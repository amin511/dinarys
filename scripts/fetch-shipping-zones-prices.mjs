import fs from "node:fs/promises"
import path from "node:path"

async function loadEnvFile(envPath) {
    try {
        const raw = await fs.readFile(envPath, "utf8")
        const lines = raw.split(/\r?\n/)

        for (const line of lines) {
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
        // Ignore missing .env.local file and rely on process env.
    }
}

function requireEnv(name) {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}

function toNumberOrNull(value) {
    if (value === undefined || value === null || value === "") return null
    const num = Number(value)
    return Number.isFinite(num) ? num : null
}

async function fetchJson(url, headers) {
    const response = await fetch(url, { headers })
    if (!response.ok) {
        const text = await response.text()
        throw new Error(`Request failed (${response.status}) for ${url}: ${text}`)
    }
    return response.json()
}

function toErrorMessage(error) {
    if (error instanceof Error) return error.message
    return String(error)
}

async function main() {
    const cwd = process.cwd()
    await loadEnvFile(path.join(cwd, ".env.local"))

    const storeUrl = requireEnv("WOOCOMMERCE_STORE_URL").replace(/\/$/, "")
    const consumerKey = requireEnv("WOOCOMMERCE_CONSUMER_KEY")
    const consumerSecret = requireEnv("WOOCOMMERCE_CONSUMER_SECRET")

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")
    const headers = {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
    }

    const zonesUrl = `${storeUrl}/wp-json/wc/v3/shipping/zones`
    const zones = await fetchJson(zonesUrl, headers)

    const enrichedZones = await Promise.all(
        zones.map(async (zone) => {
            const locationsUrl = `${storeUrl}/wp-json/wc/v3/shipping/zones/${zone.id}/locations`
            const methodsUrl = `${storeUrl}/wp-json/wc/v3/shipping/zones/${zone.id}/methods`

            let locations = []
            let methods = []
            let error = null

            try {
                locations = await fetchJson(locationsUrl, headers)
            } catch (err) {
                error = toErrorMessage(err)
            }

            try {
                methods = await fetchJson(methodsUrl, headers)
            } catch (err) {
                const message = toErrorMessage(err)
                error = error ? `${error} | ${message}` : message
            }

            return {
                id: zone.id,
                name: zone.name,
                order: zone.order,
                locations,
                methods: methods.map((method) => {
                    const rawCost = method?.settings?.cost?.value ?? ""
                    return {
                        instance_id: method.instance_id,
                        method_id: method.method_id,
                        method_title: method.method_title,
                        title: method.title,
                        enabled: Boolean(method.enabled),
                        cost: toNumberOrNull(rawCost),
                        rawCost,
                        min_amount: toNumberOrNull(method?.settings?.min_amount?.value ?? ""),
                        requires: method?.settings?.requires?.value ?? null,
                    }
                }),
                error,
            }
        })
    )

    const failedZones = enrichedZones.filter((zone) => zone.error)

    const output = {
        generatedAt: new Date().toISOString(),
        storeUrl,
        totalZones: enrichedZones.length,
        failedZones: failedZones.length,
        zones: enrichedZones,
    }

    const outDir = path.join(cwd, "data")
    const outPath = path.join(outDir, "shipping-zones-prices.json")

    await fs.mkdir(outDir, { recursive: true })
    await fs.writeFile(outPath, JSON.stringify(output, null, 2), "utf8")

    if (failedZones.length > 0) {
        console.warn(`Completed with ${failedZones.length} zone(s) in error. See JSON field: zones[].error`)
    }
    console.log(`Saved shipping zones and prices to: ${outPath}`)
}

main().catch((error) => {
    console.error("Failed to export shipping zones and prices:", error.message)
    process.exitCode = 1
})
