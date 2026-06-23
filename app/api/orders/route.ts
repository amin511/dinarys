import { getWooCredentials, wooConfig } from "@/lib/config"
import { sendCapiEvent } from "@/lib/facebook-capi"

export async function POST(request: Request) {
  try {
    const orderData = await request.json()

    const { storeUrl, authHeader } = getWooCredentials()

    console.log("[v0] Creating order in WooCommerce:", orderData)

    const apiUrl = `${storeUrl}/wp-json/wc/v3/orders`

    // Préparer les line_items avec les tailles et couleurs
    // Note: Si variation_id est fourni, WooCommerce ajoute automatiquement les attributs
    // On n'ajoute les meta_data que pour les produits simples (sans variation)
    const lineItems = orderData.items
      ? orderData.items.map((item: any) => {
        const hasVariation = !!item.variationId
        const metaData = []
        // Ajouter taille/couleur uniquement si pas de variation (produit simple)
        if (!hasVariation) {
          if (item.size) {
            metaData.push({ key: "Taille", value: item.size })
          }
          if (item.color) {
            metaData.push({ key: "Couleur", value: item.color })
          }
        }
        return {
          product_id: item.id,
          variation_id: item.variationId || undefined,
          quantity: item.quantity,
          ...(metaData.length > 0 && { meta_data: metaData }),
        }
      })
      : (() => {
        const hasVariation = !!orderData.variation_id
        const metaData = []
        // Ajouter taille/couleur uniquement si pas de variation (produit simple)
        if (!hasVariation) {
          if (orderData.size) {
            metaData.push({ key: "Taille", value: orderData.size })
          }
          if (orderData.color) {
            metaData.push({ key: "Couleur", value: orderData.color })
          }
        }
        return [
          {
            product_id: orderData.product_id,
            variation_id: orderData.variation_id || undefined,
            quantity: orderData.quantity,
            ...(metaData.length > 0 && { meta_data: metaData }),
          },
        ]
      })()

    // Create WooCommerce order format using config
    const { orders } = wooConfig
    const wooOrder = {
      status: "processing",
      payment_method: orders.paymentMethod,
      payment_method_title: orders.paymentMethodTitle,
      set_paid: false,
      billing: {
        first_name: orderData.prenom,
        phone: orderData.telephone,
        address_1: orderData.adresse,
        city: orderData.commune,
        state: orderData.wilaya,
        country: orders.defaultCountry,
      },
      shipping: {
        first_name: orderData.prenom,
        address_1: orderData.adresse,
        city: orderData.commune,
        state: orderData.wilaya,
        country: orders.defaultCountry,
      },
      line_items: lineItems,
      shipping_lines: [
        {
          method_id: orders.shippingMethod,
          method_title: orderData.delivery_method === "domicile" ? "Livraison à domicile" : "Stop Desk",
          total: String(orderData.shipping_cost || 0),
        },
      ],
      // Définir les meta données de la commande
      meta_data: [
        {
          key: "_shipping_cost",
          value: String(orderData.shipping_cost || 0),
        },
        {
          key: "_order_subtotal",
          value: String(orderData.subtotal || 0),
        },
        {
          key: "_delivery_method",
          value: orderData.delivery_method || "domicile",
        },
      ],
    }

    console.log("[v0] Sending order to WooCommerce API:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wooOrder),
    })

    console.log("[v0] WooCommerce order API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] WooCommerce order API error:", response.status, errorText)
      throw new Error(`WooCommerce API returned ${response.status}: ${errorText}`)
    }

    const createdOrder = await response.json()
    console.log("[v0] Order created successfully:", createdOrder.id)

    const eventId = `purchase_${createdOrder.id}`
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      undefined
    const clientUserAgent = request.headers.get("user-agent") || undefined
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dinarys.dz"

    sendCapiEvent(
      "Purchase",
      eventId,
      {
        phone: orderData.telephone,
        city: orderData.commune,
        state: orderData.wilaya,
        clientIp,
        clientUserAgent,
      },
      {
        value: orderData.total || 0,
        currency: "DZD",
        contentIds: orderData.items
          ? orderData.items.map((item: any) => String(item.id))
          : [String(orderData.product_id)],
        contentType: "product",
        orderId: String(createdOrder.id),
        numItems: orderData.quantity || 1,
      },
      `${siteUrl}/thank-you`
    ).catch(() => {})

    return Response.json({
      success: true,
      order_id: createdOrder.id,
      order_number: createdOrder.number,
      event_id: eventId,
    })
  } catch (error) {
    console.error("[v0] Order creation error:", error instanceof Error ? error.message : error)
    return Response.json(
      {
        error: "Failed to create order in WooCommerce",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
