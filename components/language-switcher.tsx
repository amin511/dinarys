"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { siteConfig } from "@/lib/config"
import { Globe } from "lucide-react"

interface LanguageSwitcherProps {
  variant?: "header" | "floating"
}

const LOCALE_LABELS: Record<string, { full: string; short: string }> = {
  fr: { full: "Français", short: "FR" },
  ar: { full: "العربية", short: "AR" },
}

export default function LanguageSwitcher({ variant = "header" }: LanguageSwitcherProps) {
  if (!siteConfig.features.multiLanguage) return null

  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("language")

  const otherLocale = locale === "fr" ? "ar" : "fr"
  const currentLabel = LOCALE_LABELS[locale] ?? LOCALE_LABELS.fr
  const otherLabel = LOCALE_LABELS[otherLocale] ?? LOCALE_LABELS.ar

  const switchLocale = () => {
    router.replace(pathname, { locale: otherLocale })
  }

  if (variant === "floating") {
    return (
      <button
        onClick={switchLocale}
        aria-label={t("switchTo")}
        title={otherLabel.full}
        className="fixed bottom-6 start-6 z-50 w-14 h-14 rounded-full bg-[#2D2D2D] text-white shadow-xl hover:bg-[#1a1a1a] transition-all duration-300 hover:scale-110 flex flex-col items-center justify-center gap-0.5 group lg:hidden"
      >
        <Globe
          size={18}
          className="text-[#d6a853] transition-transform duration-300 group-hover:rotate-12"
        />
        <span className="text-[10px] font-bold tracking-widest text-[#d6a853] leading-none">
          {otherLabel.short}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={switchLocale}
      aria-label={t("switchTo")}
      title={otherLabel.full}
      className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm transition-all duration-200 hover:bg-[#d6a853]/8 relative"
    >
      <Globe
        size={14}
        className="text-[#d6a853] shrink-0 transition-transform duration-300 group-hover:rotate-12"
      />
      <span className="text-xs font-semibold tracking-wide text-[#4A4A4A] group-hover:text-[#1a1a1a] transition-colors duration-200 relative">
        {currentLabel.full}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#d6a853] transition-all duration-300 group-hover:w-full" />
      </span>
      <span className="text-[10px] text-[#d6a853]/60 font-bold tracking-wider group-hover:text-[#d6a853] transition-colors duration-200">
        → {otherLabel.short}
      </span>
    </button>
  )
}
