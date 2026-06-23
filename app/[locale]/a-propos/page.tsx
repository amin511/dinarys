import type { Metadata } from "next"
import Image from "next/image"
import Footer from "@/components/footer"
import { siteConfig } from "@/lib/config"
import { Sparkles, Leaf, Gem, FlaskConical } from "lucide-react"
import { getTranslations } from "next-intl/server"

export const dynamic = "force-static"

const GOLD = "#B8943C"
const GOLD_LIGHT = "#D4A843"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "about" })
  return {
    title: `${t("metaTitle")} | ${siteConfig.name}`,
    description: t("metaDesc"),
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "about" })

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0d0d0d] text-white">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 30% 50%, ${GOLD} 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, ${GOLD}80 0%, transparent 50%)`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 py-28 md:py-36 text-center">
          <span
            className="inline-block text-white/90 text-xs font-bold tracking-[0.25em] uppercase px-5 py-2 rounded-full mb-8"
            style={{ background: `${GOLD}30`, border: `1px solid ${GOLD}50` }}
          >
            {t("heroBadge")}
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-6">
            {t("heroTitle1")}
            <br className="hidden md:block" />
            {t("heroTitle2")}
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle")}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Brand Story */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <span
            className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm mb-8"
            style={{ background: GOLD }}
          >
            {t("storyBadge")}
          </span>
          <h2 className="font-playfair text-3xl md:text-4xl font-medium text-[#1a1a1a] leading-snug mb-8">
            {t("storyTitle")}
          </h2>
          <div className="space-y-6 text-[#4A4A4A] text-base md:text-lg leading-relaxed">
            <p><strong>Dinarys</strong> {t("storyPara1").replace(/^Dinarys\s+/, "")}</p>
            <p>{t("storyPara2")}</p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-2xl">🇩🇿</span>
              <span className="font-semibold tracking-wider text-[#1a1a1a] uppercase text-sm">
                {t("madeIn")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-[#E5DDD3]" />
      </div>

      {/* Values */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm mb-6"
              style={{ background: GOLD }}
            >
              {t("valuesBadge")}
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-medium text-[#1a1a1a]">
              {t("valuesTitle")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Sparkles, title: t("value1Title"), desc: t("value1Desc") },
              { icon: Leaf, title: t("value2Title"), desc: t("value2Desc") },
              { icon: Gem, title: t("value3Title"), desc: t("value3Desc") },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group text-center p-8 rounded-2xl border hover:shadow-lg transition-all duration-500"
                style={{ borderColor: "#E5DDD3" }}
              >
                <div
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ background: `${GOLD}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: GOLD }} />
                </div>
                <h3 className="font-playfair text-xl font-medium text-[#1a1a1a] mb-3">{title}</h3>
                <p className="text-[#4A4A4A] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-[#E5DDD3]" />
      </div>

      {/* Philosophy */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl mx-auto mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: `${GOLD}15` }}
              >
                <FlaskConical className="w-6 h-6" style={{ color: GOLD }} />
              </div>
              <span
                className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm"
                style={{ background: GOLD }}
              >
                {t("philoBadge")}
              </span>
            </div>
            <h2 className="font-playfair text-3xl md:text-4xl font-medium text-[#1a1a1a] leading-snug mb-8">
              {t("philoTitle")}
            </h2>
            <div className="space-y-6 text-[#4A4A4A] text-base md:text-lg leading-relaxed">
              <p>{t("philoPara1")}</p>
              <p>{t("philoPara2")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { emoji: "🌼", nameKey: "active1Name", descKey: "active1Desc" },
              { emoji: "🌸", nameKey: "active2Name", descKey: "active2Desc" },
              { emoji: "💊", nameKey: "active3Name", descKey: "active3Desc" },
              { emoji: "🌾", nameKey: "active4Name", descKey: "active4Desc" },
              { emoji: "💎", nameKey: "active5Name", descKey: "active5Desc" },
            ].map(({ emoji, nameKey, descKey }) => (
              <div
                key={nameKey}
                className="p-5 rounded-2xl border text-center transition-all duration-300 hover:shadow-md"
                style={{ borderColor: `${GOLD}30`, background: `${GOLD}08` }}
              >
                <div className="text-3xl mb-3">{emoji}</div>
                <p className="font-semibold text-sm text-[#1a1a1a] mb-1">{t(nameKey as any)}</p>
                <p className="text-xs text-[#5A5A5A]">{t(descKey as any)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d] text-white">
        <div
          className="relative overflow-hidden"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${GOLD}20 0%, transparent 60%)` }}
        >
          <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-6">
              {t("ctaTitle1")}<br />{t("ctaTitle2")}
            </h2>
            <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
              {t("ctaSubtitle")}
            </p>
            <a
              href="/products"
              className="inline-block border-2 text-white text-sm font-bold tracking-widest uppercase px-10 py-4 transition-all duration-300"
              style={{ borderColor: GOLD }}
            >
              {t("ctaButton")}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
