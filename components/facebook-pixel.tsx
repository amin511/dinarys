"use client"

import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"
import { siteConfig } from "@/lib/config"

// Déclaration TypeScript pour Facebook Pixel
declare global {
    interface Window {
        fbq: (
            type: string,
            eventName: string,
            params?: Record<string, unknown>,
            options?: { eventID?: string }
        ) => void
        _fbq: unknown
    }
}

function FacebookPixelPageView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const pixelId = siteConfig.analytics?.facebookPixelId

    useEffect(() => {
        // Track page views on route changes
        if (pixelId && typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "PageView")
        }
    }, [pathname, searchParams, pixelId])

    return null
}

export function FacebookPixel() {
    const pixelId = siteConfig.analytics?.facebookPixelId

    // Ne pas rendre si pas de Pixel ID configuré
    if (!pixelId) return null

    return (
        <>
            <Script id="facebook-pixel" strategy="afterInteractive">
                {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
            </Script>
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
            <Suspense fallback={null}>
                <FacebookPixelPageView />
            </Suspense>
        </>
    )
}

/**
 * Helper function to track Facebook Pixel events
 * Use this in components to track e-commerce events
 * 
 * @example
 * // Track product view
 * fbEvent('ViewContent', { content_name: 'Product Name', content_ids: ['123'], value: 1000, currency: 'DZD' })
 * 
 * // Track add to cart
 * fbEvent('AddToCart', { content_name: 'Product Name', content_ids: ['123'], value: 1000, currency: 'DZD' })
 * 
 * // Track checkout initiation
 * fbEvent('InitiateCheckout', { value: 5000, currency: 'DZD', num_items: 3 })
 * 
 * // Track purchase
 * fbEvent('Purchase', { value: 5000, currency: 'DZD', content_ids: ['123', '456'] })
 */
export const fbEvent = (eventName: string, params?: Record<string, unknown>, eventID?: string) => {
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", eventName, params, eventID ? { eventID } : undefined)
    }
}
