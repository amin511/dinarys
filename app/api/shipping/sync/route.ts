import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { createHash, timingSafeEqual } from "node:crypto"
import {
    ECOTRACK_FEES_TAG,
    getEcotrackZones,
    zonesToPriceMap,
    type EcotrackZone,
} from "@/lib/shipping/ecotrack"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * GET /api/shipping/sync?secret=<SHIPPING_SYNC_SECRET>
 *
 * Delivery prices refresh from Ecotrack automatically every 24 hours. This endpoint is
 * the manual override: hit it right after changing prices in the Ecotrack dashboard and
 * the new prices go live immediately, with no redeploy.
 *
 * The response lists exactly which wilayas changed and by how much.
 *
 * Query params:
 *   secret  required, matched against SHIPPING_SYNC_SECRET (or send it as a Bearer token)
 *   dry=1   preview the diff without actually applying it
 *
 * Note: on Vercel the filesystem is read-only, so this refreshes the cached fee data
 * rather than rewriting data/shipping-zones-prices.json. To update that committed
 * fallback snapshot, run `pnpm sync:fees` locally and commit the result.
 */
export async function GET(request: NextRequest) {
    const expected = process.env.SHIPPING_SYNC_SECRET

    // Fail closed: an unset secret must never mean "no auth required".
    if (!expected) {
        console.error("[Shipping Sync] SHIPPING_SYNC_SECRET is not configured")
        return NextResponse.json(
            { error: "Sync endpoint is not configured" },
            { status: 500 }
        )
    }

    const { searchParams } = new URL(request.url)
    const provided =
        searchParams.get("secret") ||
        request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
        ""

    if (!matchesSecret(provided, expected)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dryRun = searchParams.get("dry") === "1"

    try {
        // What the site is serving right now (may be absent on a cold cache).
        let before: EcotrackZone[] | null = null
        try {
            before = await getEcotrackZones()
        } catch {
            before = null
        }

        if (!dryRun) {
            // { expire: 0 } rather than a named profile like "max": named profiles use
            // stale-while-revalidate, which serves the OLD price to the first request
            // after a sync. Expiring outright makes the very next request show the new
            // price, which is what someone hitting this URL expects.
            revalidateTag(ECOTRACK_FEES_TAG, { expire: 0 })
        }

        // Bypass the cache so the diff reflects what Ecotrack returns *now*.
        const after = await getEcotrackZones(true)

        return NextResponse.json({
            success: true,
            applied: !dryRun,
            syncedAt: new Date().toISOString(),
            wilayas: after.length,
            ...diffZones(before, after),
        })
    } catch (error) {
        console.error("[Shipping Sync] Failed:", error)
        return NextResponse.json(
            {
                success: false,
                error: "Failed to sync shipping fees from Ecotrack",
                message: error instanceof Error ? error.message : String(error),
            },
            { status: 502 }
        )
    }
}

/**
 * Constant-time comparison. Both sides are hashed first so the buffers are always the
 * same length, which timingSafeEqual requires.
 */
function matchesSecret(provided: string, expected: string): boolean {
    if (!provided) return false
    const a = createHash("sha256").update(provided).digest()
    const b = createHash("sha256").update(expected).digest()
    return timingSafeEqual(a, b)
}

interface PriceChange {
    wilaya: string
    domicile?: { from: number; to: number }
    stopdesk?: { from: number; to: number }
}

function diffZones(
    before: EcotrackZone[] | null,
    after: EcotrackZone[]
): { changed: PriceChange[]; unchanged: number; note?: string } {
    if (!before) {
        return {
            changed: [],
            unchanged: 0,
            note: "No cached prices to compare against — the fee table was loaded fresh.",
        }
    }

    const oldPrices = zonesToPriceMap(before)
    const newPrices = zonesToPriceMap(after)

    const changed: PriceChange[] = []
    let unchanged = 0

    for (const [wilaya, next] of Object.entries(newPrices)) {
        const prev = oldPrices[wilaya]

        if (!prev) {
            changed.push({
                wilaya,
                domicile: { from: 0, to: next.domicile },
                stopdesk: { from: 0, to: next.stopdesk },
            })
            continue
        }

        const change: PriceChange = { wilaya }
        if (prev.domicile !== next.domicile) {
            change.domicile = { from: prev.domicile, to: next.domicile }
        }
        if (prev.stopdesk !== next.stopdesk) {
            change.stopdesk = { from: prev.stopdesk, to: next.stopdesk }
        }

        if (change.domicile || change.stopdesk) {
            changed.push(change)
        } else {
            unchanged++
        }
    }

    return { changed, unchanged }
}
