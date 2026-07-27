/**
 * Refresh the committed fallback snapshot from Ecotrack (H24 Delivery).
 *
 *   pnpm sync:fees
 *
 * In production the site reads Ecotrack live (cached 24h, refreshable through
 * /api/shipping/sync), so this script is NOT how prices go live. It only rewrites
 * data/shipping-zones-prices.json, the offline fallback used when Ecotrack is
 * unreachable. Run it occasionally and commit the result so that fallback stays current.
 */

import fs from "node:fs/promises"
import path from "node:path"

const DEFAULT_FEES_URL = "https://h24delivery.ecotrack.dz/api/v1/get/fees"
const WILAYA_COUNT = 58

async function loadEnvFile(envPath) {
    try {
        const raw = await fs.readFile(envPath, "utf8")

        for (const line of raw.split(/\r?\n/)) {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith("#")) continue

            const eqIndex = trimmed.indexOf("=")
            if (eqIndex === -1) continue

            const key = trimmed.slice(0, eqIndex).trim()
            let value = trimmed.slice(eqIndex + 1).trim()

            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1)
            }

            if (!(key in process.env)) {
                process.env[key] = value
            }
        }
    } catch {
        // Ignore a missing env file and rely on the ambient environment.
    }
}

function requireEnv(name) {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}

/**
 * Read the wilaya names straight out of the TS config so this script cannot drift
 * out of sync with the list the checkout dropdown uses.
 */
async function loadWilayaNames(cwd) {
    const source = await fs.readFile(
        path.join(cwd, "lib", "config", "country", "algeria.ts"),
        "utf8"
    )
    const block = source.split("ALGERIA_WILAYAS")[1]?.split("]")[0] ?? ""
    const names = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1])

    if (names.length !== WILAYA_COUNT) {
        throw new Error(
            `Expected ${WILAYA_COUNT} wilayas in algeria.ts, found ${names.length}`
        )
    }
    return names
}

function toPositiveNumber(value) {
    const num = Number(value)
    return Number.isFinite(num) && num > 0 ? num : null
}

function feesToZones(rows, wilayaNames) {
    const byId = new Map()

    for (const row of rows) {
        const id = Number(row?.wilaya_id)
        if (!Number.isInteger(id) || id < 1 || id > WILAYA_COUNT) continue

        const domicile = toPositiveNumber(row.tarif)
        if (domicile === null) {
            throw new Error(`Non-positive tarif for wilaya_id ${id}`)
        }
        const stopdesk = toPositiveNumber(row.tarif_stopdesk)

        const methods = [
            {
                instance_id: id * 2 - 1,
                method_id: "flat_rate_ecotrack",
                method_title: "Ecotrack Home Delivery",
                title: "التوصيل للمنزل",
                enabled: true,
                cost: domicile,
                rawCost: String(row.tarif),
                min_amount: null,
                requires: null,
            },
        ]

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

        byId.set(id, {
            id,
            name: wilayaNames[id - 1],
            order: id,
            locations: [{ code: `DZ:DZ-${String(id).padStart(2, "0")}`, type: "state" }],
            methods,
            error: null,
        })
    }

    const missing = []
    for (let id = 1; id <= WILAYA_COUNT; id++) {
        if (!byId.has(id)) missing.push(id)
    }
    if (missing.length > 0) {
        throw new Error(`Ecotrack response is missing wilaya_id: ${missing.join(", ")}`)
    }

    return [...byId.values()].sort((a, b) => a.id - b.id)
}

async function main() {
    const cwd = process.cwd()
    await loadEnvFile(path.join(cwd, ".env.local"))
    await loadEnvFile(path.join(cwd, ".env"))

    const token = requireEnv("ECOTRACK_API_TOKEN")
    const url = process.env.ECOTRACK_FEES_URL || DEFAULT_FEES_URL

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    })

    if (!response.ok) {
        throw new Error(`Ecotrack fees request failed (${response.status})`)
    }

    const payload = await response.json()
    if (!Array.isArray(payload?.livraison)) {
        throw new Error("Ecotrack response has no 'livraison' array")
    }

    const wilayaNames = await loadWilayaNames(cwd)
    const zones = feesToZones(payload.livraison, wilayaNames)

    const output = {
        generatedAt: new Date().toISOString(),
        source: "ecotrack",
        feesUrl: url,
        totalZones: zones.length,
        zones,
    }

    const outPath = path.join(cwd, "data", "shipping-zones-prices.json")
    await fs.mkdir(path.dirname(outPath), { recursive: true })
    await fs.writeFile(outPath, JSON.stringify(output, null, 2), "utf8")

    const withoutStopdesk = zones.filter(
        (z) => !z.methods.some((m) => m.method_id === "local_pickup_ecotrack")
    )
    if (withoutStopdesk.length > 0) {
        console.warn(
            `Note: no stopdesk price for ${withoutStopdesk.map((z) => z.name).join(", ")}`
        )
    }

    console.log(`Saved ${zones.length} wilayas to: ${outPath}`)
}

main().catch((error) => {
    console.error("Failed to sync Ecotrack fees:", error.message)
    process.exitCode = 1
})
