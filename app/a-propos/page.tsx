import type { Metadata } from "next"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { siteConfig } from "@/lib/config"
import { Sparkles, Leaf, Gem, FlaskConical } from "lucide-react"

export const metadata: Metadata = {
  title: `À Propos | ${siteConfig.name}`,
  description:
    "Découvrez l'histoire de Dinarys — une marque cosmétique premium Made in Algeria, née pour proposer des produits de haute qualité aux consommateurs algériens.",
}

// Brand gold
const GOLD = "#B8943C"
const GOLD_LIGHT = "#D4A843"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* ── Hero Section ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0d0d0d] text-white">
        {/* Gold gradient overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              `radial-gradient(ellipse at 30% 50%, ${GOLD} 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, ${GOLD}80 0%, transparent 50%)`,
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 py-28 md:py-36 text-center">
          {/* Badge */}
          <span
            className="inline-block text-white/90 text-xs font-bold tracking-[0.25em] uppercase px-5 py-2 rounded-full mb-8"
            style={{ background: `${GOLD}30`, border: `1px solid ${GOLD}50` }}
          >
            Notre Histoire
          </span>

          <h1
            className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-6"
          >
            Dinarys est bien plus
            <br className="hidden md:block" />
            qu&apos;une marque.
          </h1>

          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            C&apos;est une ambition claire : mettre la cosmétique premium algérienne
            entre les mains de chaque consommatrice.
          </p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── Brand Story ──────────────────────────────── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <span
            className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm mb-8"
            style={{ background: GOLD }}
          >
            Qui Sommes-Nous
          </span>

          <h2 className="font-playfair text-3xl md:text-4xl font-medium text-[#1a1a1a] leading-snug mb-8">
            Une marque premium née avec une ambition claire.
          </h2>

          <div className="space-y-6 text-[#4A4A4A] text-base md:text-lg leading-relaxed">
            <p>
              <strong>Dinarys</strong> est une marque cosmétique premium née avec une ambition claire : proposer des produits de haute qualité, modernes et performants, conçus pour répondre aux besoins réels des consommateurs algériens.
            </p>
            <p>
              Chaque formulation est pensée avec soin, développée avec exigence et fabriquée avec les meilleurs actifs disponibles. Nos gammes capillaires célèbrent la beauté des cheveux algériens tout en s&apos;inscrivant dans les standards les plus élevés de la cosmétique internationale.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-2xl">🇩🇿</span>
              <span className="font-semibold tracking-wider text-[#1a1a1a] uppercase text-sm">
                Made in Algeria · Fièrement algérien
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-[#E5DDD3]" />
      </div>

      {/* ── Values / Beliefs ─────────────────────────── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span
              className="inline-block text-white text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm mb-6"
              style={{ background: GOLD }}
            >
              Nos Valeurs
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-medium text-[#1a1a1a]">
              Ce en quoi nous croyons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Value 1 */}
            <div
              className="group text-center p-8 rounded-2xl border hover:shadow-lg transition-all duration-500"
              style={{ borderColor: "#E5DDD3" }}
            >
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors duration-500"
                style={{ background: `${GOLD}15` }}
              >
                <Sparkles className="w-7 h-7" style={{ color: GOLD }} />
              </div>
              <h3 className="font-playfair text-xl font-medium text-[#1a1a1a] mb-3">
                Qualité Premium
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                Nous sélectionnons les meilleurs actifs pour formuler des produits à la hauteur des attentes les plus exigeantes.
              </p>
            </div>

            {/* Value 2 */}
            <div
              className="group text-center p-8 rounded-2xl border hover:shadow-lg transition-all duration-500"
              style={{ borderColor: "#E5DDD3" }}
            >
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors duration-500"
                style={{ background: `${GOLD}15` }}
              >
                <Leaf className="w-7 h-7" style={{ color: GOLD }} />
              </div>
              <h3 className="font-playfair text-xl font-medium text-[#1a1a1a] mb-3">
                Performance Prouvée
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                Chaque produit est développé pour des résultats visibles et mesurables, adaptés aux besoins réels de nos clientes.
              </p>
            </div>

            {/* Value 3 */}
            <div
              className="group text-center p-8 rounded-2xl border hover:shadow-lg transition-all duration-500"
              style={{ borderColor: "#E5DDD3" }}
            >
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center transition-colors duration-500"
                style={{ background: `${GOLD}15` }}
              >
                <Gem className="w-7 h-7" style={{ color: GOLD }} />
              </div>
              <h3 className="font-playfair text-xl font-medium text-[#1a1a1a] mb-3">
                Made in Algeria
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                Fiers de notre origine, nous portons haut les couleurs de l&apos;industrie cosmétique algérienne sur la scène internationale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-[#E5DDD3]" />
      </div>

      {/* ── Our Formulation Philosophy ─────────────────── */}
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
                Notre Philosophie
              </span>
            </div>

            <h2 className="font-playfair text-3xl md:text-4xl font-medium text-[#1a1a1a] leading-snug mb-8">
              Des actifs scientifiquement sélectionnés
            </h2>

            <div className="space-y-6 text-[#4A4A4A] text-base md:text-lg leading-relaxed">
              <p>
                Chez <strong>Dinarys</strong>, nous croyons que la science et la nature ne s&apos;opposent pas. Nos formules associent des actifs d&apos;origine naturelle — calendula, camomille, protéines de blé — avec les avancées de la cosmétique moderne comme la vitamine B5 et la kératine d&apos;origine naturelle.
              </p>
              <p>
                Le résultat : des produits doux, efficaces et respectueux de la santé capillaire des femmes algériennes.
              </p>
            </div>
          </div>

          {/* Key actives grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { emoji: "🌼", name: "Calendula", desc: "Apaisant & protecteur" },
              { emoji: "🌸", name: "Camomille", desc: "Douceur & éclat" },
              { emoji: "💊", name: "Vitamine B5", desc: "Hydratation & brillance" },
              { emoji: "🌾", name: "Protéines de Blé", desc: "Force & souplesse" },
              { emoji: "💎", name: "Kératine", desc: "Réparation & structure" },
            ].map((a, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border text-center transition-all duration-300 hover:shadow-md"
                style={{ borderColor: `${GOLD}30`, background: `${GOLD}08` }}
              >
                <div className="text-3xl mb-3">{a.emoji}</div>
                <p className="font-semibold text-sm text-[#1a1a1a] mb-1">{a.name}</p>
                <p className="text-xs text-[#5A5A5A]">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / Closing ────────────────────────────── */}
      <section className="bg-[#0d0d0d] text-white">
        <div
          className="relative overflow-hidden"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${GOLD}20 0%, transparent 60%)`,
          }}
        >
          <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-6">
              Prenez soin de vous,<br />avec Dinarys.
            </h2>
            <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
              Découvrez notre gamme capillaire premium, conçue pour sublimer et nourrir vos cheveux au quotidien.
            </p>
            <a
              href="/products"
              className="inline-block border-2 text-white text-sm font-bold tracking-widest uppercase px-10 py-4 transition-all duration-300"
              style={{ borderColor: GOLD }}
            >
              Découvrir nos produits
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
