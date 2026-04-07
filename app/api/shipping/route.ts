import { NextResponse } from "next/server"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { getWooCredentials, buildApiUrl } from "@/lib/config"

export const runtime = "nodejs"

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

async function loadShippingZonesFromJson(): Promise<ShippingZoneWithMethods[]> {
    const filePath = path.join(process.cwd(), "data", "shipping-zones-prices.json")
    const fileContent = await readFile(filePath, "utf-8")
    const parsed = JSON.parse(fileContent) as ExportedShippingDataFile

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
 * Fetches all shipping zones with their locations and methods from WooCommerce
 */
export async function GET() {
    try {
        let zonesWithDetails: ShippingZoneWithMethods[] = []
        let totalZones = 0
        let source: "json" | "woocommerce" = "json"

        try {
            zonesWithDetails = await loadShippingZonesFromJson()
            totalZones = zonesWithDetails.length
        } catch (jsonError) {
            console.warn("[Shipping API] JSON source unavailable, fallback to WooCommerce:", jsonError)
            const wooData = await loadShippingZonesFromWoo()
            zonesWithDetails = wooData.zones
            totalZones = wooData.totalZones
            source = "woocommerce"
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
