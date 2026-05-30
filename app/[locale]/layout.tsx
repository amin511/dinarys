import type React from "react"
import type { Metadata } from "next"
import { Cinzel, Montserrat, Almarai, Amiri, Cairo } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { Analytics } from "@vercel/analytics/next"
import { siteConfig } from "@/lib/config"
import { ShippingPreloader } from "@/components/shipping-preloader"
import { FacebookPixel } from "@/components/facebook-pixel"
import { routing } from "@/i18n/routing"
import LanguageSwitcher from "@/components/language-switcher"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel",
})

const almarai = Almarai({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["300", "400", "700", "800"],
})

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  weight: ["400", "700"],
})

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "600", "700"],
})

export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.description,
  icons: {
    icon: siteConfig.favicon,
    apple: siteConfig.favicon,
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as "fr" | "ar")) {
    notFound()
  }

  const messages = (await import(`@/messages/${locale}.json`)).default
  const isRTL = locale === "ar"

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`${montserrat.variable} ${cinzel.variable} ${almarai.variable} ${amiri.variable} ${cairo.variable}`}
    >
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ShippingPreloader />
          {children}
          <LanguageSwitcher variant="floating" />
          <Analytics />
          <FacebookPixel />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
