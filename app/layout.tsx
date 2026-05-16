import type React from "react"
import type { Metadata } from "next"
import { Cinzel, Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { siteConfig } from "@/lib/config"
import { ShippingPreloader } from "@/components/shipping-preloader"
import { FacebookPixel } from "@/components/facebook-pixel"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
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
      <body className={`antialiased ${montserrat.className} ${montserrat.variable} ${cinzel.variable}`}>
        <ShippingPreloader />
        {children}
        <Analytics />
        <FacebookPixel />
      </body>
    </html>
  )
}
