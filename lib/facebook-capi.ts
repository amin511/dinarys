import crypto from "crypto"

function hash(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex")
}

function normalizePhone(phone: string): string {
  let normalized = phone.replace(/[\s\-\(\)\.]/g, "")
  if (normalized.startsWith("0")) normalized = "213" + normalized.slice(1)
  else if (normalized.startsWith("+")) normalized = normalized.slice(1)
  return normalized
}

interface UserData {
  phone?: string
  city?: string
  state?: string
  clientIp?: string
  clientUserAgent?: string
  fbc?: string
  fbp?: string
}

interface CustomData {
  value: number
  currency: string
  contentIds: string[]
  contentType: string
  orderId: string
  numItems: number
}

export async function sendCapiEvent(
  eventName: string,
  eventId: string,
  userData: UserData,
  customData: CustomData,
  eventSourceUrl: string
): Promise<void> {
  const pixelId = process.env.FACEBOOK_PIXEL_ID || process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN

  if (!pixelId || !accessToken) return

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: eventSourceUrl,
        action_source: "website",
        user_data: {
          ...(userData.phone && { ph: [hash(normalizePhone(userData.phone))] }),
          ...(userData.city && { ct: [hash(userData.city)] }),
          ...(userData.state && { st: [hash(userData.state)] }),
          country: [hash("dz")],
          ...(userData.clientIp && { client_ip_address: userData.clientIp }),
          ...(userData.clientUserAgent && { client_user_agent: userData.clientUserAgent }),
          ...(userData.fbc && { fbc: userData.fbc }),
          ...(userData.fbp && { fbp: userData.fbp }),
        },
        custom_data: {
          value: customData.value,
          currency: customData.currency,
          content_ids: customData.contentIds,
          content_type: customData.contentType,
          order_id: customData.orderId,
          num_items: customData.numItems,
        },
      },
    ],
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )
    if (!res.ok) {
      const err = await res.text()
      console.error("[CAPI] Facebook Conversions API error:", err)
    } else {
      console.log(`[CAPI] Sent ${eventName} event (id: ${eventId})`)
    }
  } catch (err) {
    console.error("[CAPI] Failed to send Facebook CAPI event:", err)
  }
}
