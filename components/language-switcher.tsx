"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { siteConfig } from "@/lib/config"

interface LanguageSwitcherProps {
  variant?: "header" | "floating"
}

export default function LanguageSwitcher({ variant = "header" }: LanguageSwitcherProps) {
  if (!siteConfig.features.multiLanguage) return null

  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("language")

  const otherLocale = locale === "fr" ? "ar" : "fr"
  const otherLabel = otherLocale === "ar" ? "ع" : "FR"

  const switchLocale = () => {
    router.replace(pathname, { locale: otherLocale })
  }

  if (variant === "floating") {
    return (
      <button
        onClick={switchLocale}
        aria-label={t("switchTo")}
        className="fixed bottom-6 start-6 z-50 w-12 h-12 rounded-full bg-[#2D2D2D] text-white text-sm font-bold shadow-lg hover:bg-[#1a1a1a] transition-all duration-300 hover:scale-110 flex items-center justify-center lg:hidden"
      >
        {otherLabel}
      </button>
    )
  }

  return (
    <button
      onClick={switchLocale}
      aria-label={t("switchTo")}
      className="flex items-center justify-center px-3 py-1.5 text-xs font-bold tracking-wider text-[#4A4A4A] hover:text-[#1a1a1a] border border-[#E5DDD3] hover:border-[#8b7e6e] rounded-sm transition-all duration-200 min-w-[36px]"
    >
      {otherLabel}
    </button>
  )
}
