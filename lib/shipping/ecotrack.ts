/**
 * Ecotrack (H24 Delivery) shipping fees
 *
 * Source of truth for delivery prices. The carrier exposes one endpoint returning
 * the current tarif (domicile) and tarif_stopdesk for all 58 wilayas:
 *
 *   GET https://h24delivery.ecotrack.dz/api/v1/get/fees
 *   Authorization: Bearer <ECOTRACK_API_TOKEN>
 *   → { "livraison": [ { "wilaya_id": 1, "tarif": "1150", "tarif_stopdesk": "650" }, ... ] }
 *
 * The response is reshaped into the same "shipping zone" structure that
 * data/shipping-zones-prices.json uses, so /api/shipping and every consumer
 * downstream (useShipping.ts, the checkout forms) keep working unchanged.
 *
 * The method ids emitted here (flat_rate_ecotrack / local_pickup_ecotrack) are the
 * exact ids detectDeliveryType() in lib/hooks/useShipping.ts checks for first.
 */

import { ALGERIA_WILAYAS } from "@/lib/config/country/algeria"

/** Cache tag used to refresh fees on demand via /api/shipping/sync */
export const ECOTRACK_FEES_TAG = "shipping-fees"

/** Fees are re-fetched automatically once a day */
export const ECOTRACK_REVALIDATE_SECONDS = 86400

export const ECOTRACK_DEFAULT_FEES_URL = "https://h24delivery.ecotrack.dz/api/v1/get/fees"

const WILAYA_COUNT = 58

export interface EcotrackFeeRow {
    wilaya_id: number
    tarif: string
    tarif_stopdesk: string
}

export interface EcotrackZoneMethod {
    instance_id: number
    method_id: string
    method_title: string
    title: string
    enabled: boolean
    cost: number
    rawCost: string
    min_amount: string | null
    requires: string | null
}

export interface EcotrackZone {
    id: number
    name: string
    order: number
    locations: { code: string; type: "state" }[]
    methods: EcotrackZoneMethod[]
    error: null
}

function readEnv(): { url: string; token: string } {
    const token = process.env.ECOTRACK_API_TOKEN
    if (!token) {
        throw new Error("Missing required environment variable: ECOTRACK_API_TOKEN")
    }
    return {
        url: process.env.ECOTRACK_FEES_URL || ECOTRACK_DEFAULT_FEES_URL,
        token,
    }
}

function toPositiveNumber(value: unknown): number | null {
    const num = Number(value)
    return Number.isFinite(num) && num > 0 ? num : null
}

/**
 * Keep valid fee rows returned by Ecotrack. Missing wilayas are intentionally omitted
 * because they do not have a current price in the carrier response.
 */
export function validateFeeRows(rows: unknown): EcotrackFeeRow[] {
    if (!Array.isArray(rows)) {
        throw new Error("Ecotrack response has no 'livraison' array")
    }

    const byId = new Map<number, EcotrackFeeRow>()

    for (const row of rows) {
        const id = Number((row as EcotrackFeeRow)?.wilaya_id)
        if (!Number.isInteger(id) || id < 1 || id > WILAYA_COUNT) continue

        const tarif = toPositiveNumber((row as EcotrackFeeRow).tarif)
        if (tarif === null) {
            throw new Error(`Ecotrack returned a non-positive tarif for wilaya_id ${id}`)
        }

        byId.set(id, row as EcotrackFeeRow)
    }

    return Array.from(byId.values()).sort((a, b) => Number(a.wilaya_id) - Number(b.wilaya_id))
}

/**
 * Fetch the current fee table.
 *
 * @param fresh bypass the cache entirely (used by the sync endpoint)
 */
export async function fetchEcotrackFees(fresh = false): Promise<EcotrackFeeRow[]> {
    const { url, token } = readEnv()

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        ...(fresh
            ? { cache: "no-store" as const }
            : {
                next: {
                    tags: [ECOTRACK_FEES_TAG],
                    revalidate: ECOTRACK_REVALIDATE_SECONDS,
                },
            }),
    })

    if (!response.ok) {
        throw new Error(`Ecotrack fees request failed (${response.status})`)
    }

    const payload = (await response.json()) as { livraison?: unknown }
    if (!Array.isArray(payload?.livraison)) {
        throw new Error("Ecotrack response has no 'livraison' array")
    }

    const liveRows = payload.livraison
    const liveIds = new Set(liveRows.map((row) => Number((row as EcotrackFeeRow)?.wilaya_id)))
    const missingIds = Array.from({ length: WILAYA_COUNT }, (_, index) => index + 1).filter(
        (id) => !liveIds.has(id)
    )

    if (missingIds.length > 0) {
        console.warn(
            `[Ecotrack] Missing wilaya_id ${missingIds.join(", ")}; omitting those wilayas`
        )
    }

    return validateFeeRows(liveRows)
}

/**
 * Turn the flat fee table into one shipping zone per wilaya, matching the shape of
 * data/shipping-zones-prices.json.
 *
 * wilaya_id maps directly onto ALGERIA_WILAYAS by index (verified: entry i is
 * wilaya i+1 for all 58) and onto the WooCommerce state code DZ:DZ-NN that
 * WILAYA_CODE_MAP in useShipping.ts resolves wilaya names to.
 */
export function feesToZones(rows: EcotrackFeeRow[]): EcotrackZone[] {
    return rows.map((row) => {
        const id = Number(row.wilaya_id)
        const domicile = toPositiveNumber(row.tarif)
        const stopdesk = toPositiveNumber(row.tarif_stopdesk)

        const methods: EcotrackZoneMethod[] = []

        if (domicile !== null) {
            methods.push({
                instance_id: id * 2 - 1,
                method_id: "flat_rate_ecotrack",
                method_title: "Ecotrack Home Delivery",
                title: "التوصيل للمنزل",
                enabled: true,
                cost: domicile,
                rawCost: String(row.tarif),
                min_amount: null,
                requires: null,
            })
        }

        // A wilaya with no stopdesk price simply has no pickup option, rather than
        // a 0 DZD one the customer could accidentally select.
        if (stopdesk !== null) {
            methods.push({
                instance_id: id * 2,
                method_id: "local_pickup_ecotrack",
                method_title: "Ecotrack Hub Pickup",
                title: "التوصيل للمكتب",
                enabled: true,
                cost: stopdesk,
                rawCost: String(row.tarif_stopdesk),
                min_amount: null,
                requires: null,
            })
        }

        return {
            id,
            name: ALGERIA_WILAYAS[id - 1] ?? `Wilaya ${id}`,
            order: id,
            locations: [{ code: `DZ:DZ-${String(id).padStart(2, "0")}`, type: "state" as const }],
            methods,
            error: null,
        }
    })
}

/** Convenience: fetch + transform in one call. */
export async function getEcotrackZones(fresh = false): Promise<EcotrackZone[]> {
    return feesToZones(await fetchEcotrackFees(fresh))
}

/** Flatten zones to a { wilaya: { domicile, stopdesk } } map, used for sync diffs. */
export function zonesToPriceMap(
    zones: { name: string; methods: { method_id: string; cost: number }[] }[]
): Record<string, { domicile: number; stopdesk: number }> {
    const map: Record<string, { domicile: number; stopdesk: number }> = {}

    for (const zone of zones) {
        const domicile = zone.methods.find((m) => m.method_id.includes("flat_rate"))
        const stopdesk = zone.methods.find((m) => m.method_id.includes("local_pickup"))
        map[zone.name] = {
            domicile: domicile?.cost ?? 0,
            stopdesk: stopdesk?.cost ?? 0,
        }
    }

    return map
}
