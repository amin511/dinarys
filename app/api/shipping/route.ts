import { NextResponse } from "next/server"
import { getWooCredentials, buildApiUrl } from "@/lib/config"
import { getEcotrackZones } from "@/lib/shipping/ecotrack"
import shippingSnapshot from "@/data/shipping-zones-prices.json"

export const runtime = "nodejs"

/**
 * The handler itself must not be prerendered — caching lives entirely in the tagged
 * Ecotrack fetch (24h), so that /api/shipping/sync can invalidate it on demand.
 * Re-running the handler is cheap: it reads the cached fee data, not the network.
 */
export const dynamic = "force-dynamic"

export interface ShippingZone {
    id: number
    name: string
    order: number
}

export interface ShippingLocation {
    code: string
    type: "postcode" | "state" | "country" | "continent"
}

export interface ShippingMethod {
    instance_id: number
    title: string
    order: number
    enabled: boolean
    method_id: string
    method_title: string
    method_description: string
    settings: {
        title?: { value: string }
        cost?: { value: string }
        min_amount?: { value: string }
        requires?: { value: string }
    }
}

export interface ShippingZoneWithMethods extends ShippingZone {
    locations: ShippingLocation[]
    methods: ShippingMethod[]
}

interface ExportedShippingLocation {
    code: string
    type: "postcode" | "state" | "country" | "continent"
}

interface ExportedShippingMethod {
    instance_id: number
    method_id: string
    method_title: string
    title?: string
    enabled?: boolean
    cost?: number
    rawCost?: string
    min_amount?: string | null
    requires?: string | null
}

interface ExportedShippingZone {
    id: number
    name: string
    order: number
    locations: ExportedShippingLocation[]
    methods: ExportedShippingMethod[]
    error?: string | null
}

interface ExportedShippingDataFile {
    generatedAt: string
    zones: ExportedShippingZone[]
    totalZones?: number
}

function toShippingMethod(method: ExportedShippingMethod): ShippingMethod {
    return {
        instance_id: method.instance_id,
        title: method.title || method.method_title,
        order: 0,
        enabled: method.enabled !== false,
        method_id: method.method_id,
        method_title: method.method_title,
        method_description: "",
        settings: {
            title: { value: method.title || method.method_title },
            cost: {
                value: method.rawCost ?? String(method.cost ?? 0),
            },
            min_amount:
                method.min_amount != null
                    ? { value: String(method.min_amount) }
                    : undefined,
            requires:
                method.requires != null
                    ? { value: String(method.requires) }
                    : undefined,
        },
    }
}

/**
 * Offline fallback, bundled at build time.
 *
 * This is a static import rather than a runtime fs read on purpose: the previous
 * path.join(process.cwd(), ...) read is not reliably file-traced into the serverless
 * bundle, so the fallback could fail in production and silently hit WooCommerce on
 * every request instead.
 */
function loadShippingZonesFromSnapshot(): ShippingZoneWithMethods[] {
    const parsed = shippingSnapshot as unknown as ExportedShippingDataFile

    return (parsed.zones || []).map((zone) => ({
        id: zone.id,
        name: zone.name,
        order: zone.order,
        locations: (zone.locations || []).map((location) => ({
            code: location.code,
            type: location.type,
        })),
        methods: (zone.methods || [])
            .filter((method) => method.enabled !== false)
            .map(toShippingMethod),
    }))
}

async function loadShippingZonesFromWoo(): Promise<{ zones: ShippingZoneWithMethods[]; totalZones: number }> {
    const { authHeader } = getWooCredentials()

    const headers = {
        Authorization: authHeader,
        "Content-Type": "application/json",
    }

    // 1. Fetch all shipping zones
    const zonesUrl = buildApiUrl("shipping/zones")
    const zonesResponse = await fetch(zonesUrl, {
        headers,
        cache: "force-cache",
    })

    if (!zonesResponse.ok) {
        console.error("[Shipping API] Failed to fetch zones:", zonesResponse.status)
        throw new Error(`WooCommerce zones fetch failed (${zonesResponse.status})`)
    }

    const zones: ShippingZone[] = await zonesResponse.json()

    // 2. Fetch locations and methods for each zone
    const zonesWithDetails: ShippingZoneWithMethods[] = await Promise.all(
        zones.map(async (zone) => {
            const locationsUrl = buildApiUrl(`shipping/zones/${zone.id}/locations`)
            const locationsResponse = await fetch(locationsUrl, {
                headers,
                cache: "force-cache",
            })
            const locations: ShippingLocation[] = locationsResponse.ok
                ? await locationsResponse.json()
                : []

            const methodsUrl = buildApiUrl(`shipping/zones/${zone.id}/methods`)
            const methodsResponse = await fetch(methodsUrl, {
                headers,
                cache: "force-cache",
            })
            const methods: ShippingMethod[] = methodsResponse.ok
                ? await methodsResponse.json()
                : []

            return {
                ...zone,
                locations,
                methods: methods.filter((m) => m.enabled),
            }
        })
    )

    return { zones: zonesWithDetails, totalZones: zones.length }
}

/**
 * GET /api/shipping
 *
 * Returns every shipping zone with its locations and methods.
 *
 * Sources, in order of preference:
 *   1. Ecotrack (H24 Delivery) live fees — cached for 24h, refreshable on demand
 *      through /api/shipping/sync
 *   2. data/shipping-zones-prices.json — bundled snapshot, used if Ecotrack is down
 *   3. WooCommerce shipping zones — last resort
 */
export async function GET() {
    try {
        let zonesWithDetails: ShippingZoneWithMethods[] = []
        let totalZones = 0
        let source: "ecotrack" | "snapshot" | "woocommerce" = "ecotrack"

        try {
            const ecotrackZones = await getEcotrackZones()
            zonesWithDetails = ecotrackZones.map((zone) => ({
                id: zone.id,
                name: zone.name,
                order: zone.order,
                locations: zone.locations,
                methods: zone.methods.map(toShippingMethod),
            }))
            totalZones = zonesWithDetails.length
        } catch (ecotrackError) {
            console.warn("[Shipping API] Ecotrack unavailable, falling back to snapshot:", ecotrackError)
            try {
                zonesWithDetails = loadShippingZonesFromSnapshot()
                totalZones = zonesWithDetails.length
                source = "snapshot"
            } catch (snapshotError) {
                console.warn("[Shipping API] Snapshot unavailable, falling back to WooCommerce:", snapshotError)
                const wooData = await loadShippingZonesFromWoo()
                zonesWithDetails = wooData.zones
                totalZones = wooData.totalZones
                source = "woocommerce"
            }
        }

        const activeZones = zonesWithDetails.filter((z) => z.methods.length > 0)

        return NextResponse.json({
            success: true,
            zones: activeZones,
            totalZones,
            activeZones: activeZones.length,
            source,
        })
    } catch (error) {
        console.error("[Shipping API] Error:", error)
        return NextResponse.json(
            { error: "Internal server error", message: String(error) },
            { status: 500 }
        )
    }
}
