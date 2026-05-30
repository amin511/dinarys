import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import crypto from "crypto"

const WEBHOOK_SECRET = process.env.WOOCOMMERCE_WEBHOOK_SECRET || ""
const VERCEL_DEPLOY_HOOK_URL = process.env.VERCEL_DEPLOY_HOOK_URL || ""

/**
 * Verify WooCommerce webhook signature
 */
function verifyWebhookSignature(payload: string, signature: string): boolean {
    if (!WEBHOOK_SECRET) {
        console.log("[WooCommerce Webhook] No secret configured, skipping signature verification")
        return true
    }

    if (!signature) {
        console.warn("[WooCommerce Webhook] Missing webhook signature header")
        return false
    }

    try {
        const expectedSignature = crypto
            .createHmac("sha256", WEBHOOK_SECRET)
            .update(payload)
            .digest("base64")

        const actualBuffer = Buffer.from(signature)
        const expectedBuffer = Buffer.from(expectedSignature)

        if (actualBuffer.length !== expectedBuffer.length) {
            console.error("[WooCommerce Webhook] Signature length mismatch")
            return false
        }

        return crypto.timingSafeEqual(actualBuffer, expectedBuffer)
    } catch (error) {
        console.error("[WooCommerce Webhook] Signature verification error:", error)
        return false
    }
}

async function triggerFullSsgRebuild(reason: string, payload: { event: string; productId?: string | number }) {
    if (!VERCEL_DEPLOY_HOOK_URL) {
        console.warn("[WooCommerce Webhook] VERCEL_DEPLOY_HOOK_URL not set; skipping rebuild trigger")
        return
    }

    try {
        const response = await fetch(VERCEL_DEPLOY_HOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                trigger: "woocommerce-webhook",
                reason,
                event: payload.event,
                productId: payload.productId || null,
                timestamp: new Date().toISOString(),
            }),
        })

        if (!response.ok) {
            console.error(`[WooCommerce Webhook] Failed to trigger rebuild: HTTP ${response.status}`)
            return
        }

        console.log("[WooCommerce Webhook] ✅ Full SSG rebuild triggered")
    } catch (error) {
        console.error("[WooCommerce Webhook] Error triggering rebuild:", error)
    }
}

/**
 * Handle WooCommerce webhooks for product updates
 * Supports: product.created, product.updated, product.deleted, product.restored
 */
export async function POST(request: Request) {
    try {
        const rawBody = await request.text()
        const trimmedBody = rawBody.trim()

        // Get WooCommerce headers
        const signature = request.headers.get("x-wc-webhook-signature") || ""
        const headerTopic = request.headers.get("x-wc-webhook-topic") || ""
        const headerResource = request.headers.get("x-wc-webhook-resource") || ""
        const headerEvent = request.headers.get("x-wc-webhook-event") || ""
        const deliveryId = request.headers.get("x-wc-webhook-delivery-id") || ""

        console.log("[WooCommerce Webhook] Secret configured:", WEBHOOK_SECRET ? "Yes" : "No")
        console.log("[WooCommerce Webhook] Headers:", {
            topic: headerTopic,
            resource: headerResource,
            event: headerEvent,
            deliveryId,
            hasSignature: Boolean(signature),
        })

        // Handle WooCommerce ping/test requests (not JSON)
        if (trimmedBody.startsWith("webhook_id=")) {
            console.log("[WooCommerce Webhook] Ping request received, responding OK")
            return NextResponse.json({ success: true, message: "Ping received" })
        }

        if (!verifyWebhookSignature(rawBody, signature)) {
            console.error("[WooCommerce Webhook] Invalid signature")
            return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
        }

        // Parse payload
        let payload
        try {
            payload = JSON.parse(trimmedBody)
        } catch (e) {
            console.log("[WooCommerce Webhook] Invalid JSON, ignoring:", trimmedBody.substring(0, 100))
            return NextResponse.json({ success: true, message: "Non-JSON request ignored" })
        }

        // Fallback: some WooCommerce setups only send x-wc-webhook-topic (e.g. product.created)
        const topic = headerTopic || ""
        const [topicResource = "", topicEvent = ""] = topic.split(".")
        const resource = headerResource || topicResource
        const event = headerEvent || topicEvent

        console.log(`[WooCommerce Webhook] Received: ${topic} (${resource}.${event})`)
        console.log(`[WooCommerce Webhook] Delivery ID: ${deliveryId}`)

        // Handle different webhook topics
        switch (resource) {
            case "product":
                await handleProductWebhook(event, payload)
                break

            case "order":
                await handleOrderWebhook(event, payload)
                break

            case "coupon":
                await handleCouponWebhook(event, payload)
                break

            default:
                console.log(`[WooCommerce Webhook] Unhandled resource: ${resource}`)
        }

        return NextResponse.json({
            success: true,
            topic,
            resource,
            event,
            deliveryId,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error("[WooCommerce Webhook] Error:", error)
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 }
        )
    }
}

/**
 * Handle product webhooks (created, updated, deleted)
 * 
 * Pour les nouveaux produits (created), on doit invalider le layout de la route dynamique
 * pour permettre à Next.js de générer la page à la demande via dynamicParams = true
 */
async function handleProductWebhook(event: string, payload: any) {
    const productId = payload.id
    const productName = payload.name || "Unknown"
    const productSlug = payload.slug || productId
    const locales = ["fr", "ar"]

    console.log(`[WooCommerce Webhook] Product ${event}: ${productName} (ID: ${productId}, Slug: ${productSlug})`)

    switch (event) {
        case "created":
            for (const locale of locales) {
                revalidatePath(`/${locale}/product/[id]`, "layout")
                revalidatePath(`/${locale}/product/${productId}`)
                revalidatePath(`/${locale}/products`)
                revalidatePath(`/${locale}`)
            }
            await triggerFullSsgRebuild("product.created", { event, productId })
            console.log(`[WooCommerce Webhook] ✅ New product ${productId} - Revalidated route layout and listings`)
            break

        case "updated":
            revalidateTag(`product-${productId}`)
            revalidateTag(`variations-${productId}`)
            for (const locale of locales) {
                revalidatePath(`/${locale}/product/${productId}`)
                revalidatePath(`/${locale}/products`)
                revalidatePath(`/${locale}`)
            }
            await triggerFullSsgRebuild("product.updated", { event, productId })
            console.log(`[WooCommerce Webhook] ✅ Updated product ${productId} - Revalidated tags and paths`)
            break

        case "deleted":
        case "trashed":
            revalidateTag(`product-${productId}`)
            revalidateTag(`variations-${productId}`)
            for (const locale of locales) {
                revalidatePath(`/${locale}/product/[id]`, "layout")
                revalidatePath(`/${locale}/products`)
                revalidatePath(`/${locale}`)
            }
            await triggerFullSsgRebuild("product.deleted", { event, productId })
            console.log(`[WooCommerce Webhook] ✅ Product ${productId} deleted - Revalidated all routes`)
            break

        case "restored":
            revalidateTag(`product-${productId}`)
            revalidateTag(`variations-${productId}`)
            for (const locale of locales) {
                revalidatePath(`/${locale}/product/[id]`, "layout")
                revalidatePath(`/${locale}/product/${productId}`)
                revalidatePath(`/${locale}/products`)
                revalidatePath(`/${locale}`)
            }
            await triggerFullSsgRebuild("product.restored", { event, productId })
            console.log(`[WooCommerce Webhook] ✅ Product ${productId} restored - Revalidated all routes`)
            break
    }
}

/**
 * Handle order webhooks
 */
async function handleOrderWebhook(event: string, payload: any) {
    const orderId = payload.id
    console.log(`[WooCommerce Webhook] Order ${event}: ${orderId}`)
    // Orders don't typically require cache revalidation
}

/**
 * Handle coupon webhooks
 */
async function handleCouponWebhook(event: string, payload: any) {
    const couponId = payload.id
    console.log(`[WooCommerce Webhook] Coupon ${event}: ${couponId}`)
    // Coupons don't typically require cache revalidation
}

/**
 * Handle GET requests (for testing)
 */
export async function GET() {
    return NextResponse.json({
        status: "WooCommerce Webhook endpoint is active",
        supported_events: [
            "product.created",
            "product.updated",
            "product.deleted",
            "product.restored",
            "order.created",
            "order.updated",
            "coupon.created",
            "coupon.updated",
        ],
        timestamp: new Date().toISOString(),
    })
}
