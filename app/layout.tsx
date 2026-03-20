import type React from "react"
import type { Metadata } from "next"
import { Assistant, Playfair_Display, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { siteConfig } from "@/lib/config"
import { ShippingPreloader } from "@/components/shipping-preloader"
import { FacebookPixel } from "@/components/facebook-pixel"
import "./globals.css"

const assistant = Assistant({
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.description,
  icons: {
    icon: siteConfig.favicon,
    apple: siteConfig.favicon,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased ${assistant.className} ${playfair.variable} ${cormorant.variable}`}>
        <ShippingPreloader />
        {children}
        <Analytics />
        <FacebookPixel />
      </body>
    </html>
  )
}
