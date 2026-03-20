import type { Metadata } from "next"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { siteConfig } from "@/lib/config"
import { Sparkles, Heart, Gem, Scissors } from "lucide-react"
import VideoSection from "@/components/video-section"

export const metadata: Metadata = {
  title: `À Propos | ${siteConfig.name}`,
  description:
    "Découvrez l'histoire de Nour Confection — une marque née d'une passion pour l'élégance algérienne, les traditions et le fait main.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* ── Hero Section ─────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#1a1a1a] text-white">
        {/* Decorative gradient overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, #8c3b7b 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, #6b2f5a 0%, transparent 50%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 py-28 md:py-36 text-center">
          {/* Badge */}
          <span className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold tracking-[0.25em] uppercase px-5 py-2 rounded-full mb-8 animate-fade-in-rise">
            Notre Histoire
          </span>

          <h1
            className={`font-playfair text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-6 animate-fade-in-rise`}
            style={{ animationDelay: "150ms" }}
          >
            Nour Confection est bien plus
            <br className="hidden md:block" />
            qu&apos;une marque.
          </h1>

          <p
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-fade-in-rise"
            style={{ animationDelay: "300ms" }}
          >
            C&apos;est une histoire de passion, de tradition et d&apos;amour pour
            l&apos;élégance algérienne.
          </p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── Video Introduction ─────────────────────────── */}
      <section className="py-20 md:py-28 px-6 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Text side */}
            <div className="order-2 md:order-1">
              <span className="inline-block bg-[#8B5E83] text-white text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm mb-6">
                Découvrez Notre Univers
              </span>
              <h2
                className={`font-playfair text-3xl md:text-4xl font-medium text-[#2D2D2D] leading-snug mb-6`}
              >
                Un savoir-faire artisanal,
                <br className="hidden md:block" />
                transmis avec passion.
              </h2>
              <div className="space-y-4 text-[#4A4A4A] text-base md:text-lg leading-relaxed">
                <p>
                  Derrière chaque création Nour Confection se cache un travail minutieux :
                  le choix des tissus, la précision de la couture, la délicatesse des
                  broderies et le soin apporté à chaque finition.
                </p>
                <p>
                  Cette vidéo vous ouvre les portes de notre atelier, là où naissent les
                  pièces qui accompagneront vos plus beaux moments.
                </p>
              </div>
            </div>

            {/* Video side */}
            <div className="order-1 md:order-2 flex justify-center">
              <VideoSection embedded />
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand Story ──────────────────────────────── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-[#8B5E83] text-white text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm mb-8">
            Qui Sommes-Nous
          </span>

          <h2
            className={`font-playfair text-3xl md:text-4xl font-medium text-[#2D2D2D] leading-snug mb-8`}
          >
            Préserver l&apos;âme des traditions algériennes
            <br className="hidden md:block" />
            avec une touche moderne et raffinée.
          </h2>

          <div className="space-y-6 text-[#4A4A4A] text-base md:text-lg leading-relaxed">
            <p>
              Fondée par une créatrice animée par la volonté de sublimer les moments les
              plus précieux de la vie d&apos;une femme, <strong>Nour Confection</strong>{" "}
              est née d&apos;un rêve : préserver l&apos;âme des traditions algériennes tout
              en leur offrant une touche moderne et raffinée.
            </p>
            <p>
              Chaque pièce est pensée avec soin, dessinée avec délicatesse et confectionnée
              avec exigence. Nos collections pour{" "}
              <strong>mariées</strong> et <strong>bébés</strong> célèbrent la
              beauté des détails, l&apos;authenticité du patrimoine et le raffinement du
              fait main.
            </p>
          </div>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-[#E5DDD3]" />
      </div>

      {/* ── Values / Beliefs ─────────────────────────── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#8B5E83] text-white text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm mb-6">
              Nos Valeurs
            </span>
            <h2
              className={`font-playfair text-3xl md:text-4xl font-medium text-[#2D2D2D]`}
            >
              Ce en quoi nous croyons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Value 1 */}
            <div className="group text-center p-8 rounded-2xl border border-[#E5DDD3] hover:border-[#8B5E83]/30 hover:shadow-lg transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#8B5E83]/10 flex items-center justify-center group-hover:bg-[#8B5E83]/20 transition-colors duration-500">
                <Sparkles className="w-7 h-7 text-[#8B5E83]" />
              </div>
              <h3
                className={`font-playfair text-xl font-medium text-[#2D2D2D] mb-3`}
              >
                Chaque mariée est unique
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                Nous croyons que chaque mariée mérite de se sentir unique,
                sublimée par des pièces qui racontent son histoire.
              </p>
            </div>

            {/* Value 2 */}
            <div className="group text-center p-8 rounded-2xl border border-[#E5DDD3] hover:border-[#8B5E83]/30 hover:shadow-lg transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#8B5E83]/10 flex items-center justify-center group-hover:bg-[#8B5E83]/20 transition-colors duration-500">
                <Heart className="w-7 h-7 text-[#8B5E83]" />
              </div>
              <h3
                className={`font-playfair text-xl font-medium text-[#2D2D2D] mb-3`}
              >
                Chaque naissance est un trésor
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                Nous célébrons chaque nouveau-né avec des créations
                délicates et précieuses, dignes de ce moment unique.
              </p>
            </div>

            {/* Value 3 */}
            <div className="group text-center p-8 rounded-2xl border border-[#E5DDD3] hover:border-[#8B5E83]/30 hover:shadow-lg transition-all duration-500">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#8B5E83]/10 flex items-center justify-center group-hover:bg-[#8B5E83]/20 transition-colors duration-500">
                <Gem className="w-7 h-7 text-[#8B5E83]" />
              </div>
              <h3
                className={`font-playfair text-xl font-medium text-[#2D2D2D] mb-3`}
              >
                Tradition & Modernité
              </h3>
              <p className="text-[#4A4A4A] text-sm leading-relaxed">
                La tradition peut être élégante, contemporaine et
                intemporelle à la fois. C&apos;est notre promesse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="border-t border-[#E5DDD3]" />
      </div>

      {/* ── Craftsmanship ────────────────────────────── */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="max-w-3xl mx-auto mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-[#8B5E83]/10 flex items-center justify-center shrink-0">
                <Scissors className="w-6 h-6 text-[#8B5E83]" />
              </div>
              <span className="inline-block bg-[#8B5E83] text-white text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-sm">
                Notre Savoir-Faire
              </span>
            </div>

            <h2
              className={`font-playfair text-3xl md:text-4xl font-medium text-[#2D2D2D] leading-snug mb-8`}
            >
              Des matières nobles et des finitions haut de gamme
            </h2>

            <div className="space-y-6 text-[#4A4A4A] text-base md:text-lg leading-relaxed">
              <p>
                Chez Nour Confection, nous travaillons des{" "}
                <strong>matières nobles</strong>, des{" "}
                <strong>broderies inspirées du patrimoine algérien</strong> et des{" "}
                <strong>finitions haut de gamme</strong> pour créer des accessoires qui
                accompagnent les plus beaux souvenirs.
              </p>
              <p>
                Nos créations ne sont pas de simples articles.
                <br />
                Ce sont des pièces qui racontent une histoire.
              </p>
            </div>
          </div>

          {/* Photo Gallery — Masonry-style grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {/* Image 1 — tall */}
            <div className="row-span-2 relative rounded-2xl overflow-hidden shadow-md group">
              <Image
                src="/about/img1.jpeg"
                alt="Confection à la machine à coudre"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>

            {/* Image 2 */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
              <Image
                src="/about/img2.jpeg"
                alt="Nouage de ruban sur tissu"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>

            {/* Image 3 */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
              <Image
                src="/about/img3.jpeg"
                alt="Couture et finitions"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>

            {/* Image 4 */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
              <Image
                src="/about/img4.jpeg"
                alt="Fils et matériaux de confection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>

            {/* Image 5 */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
              <Image
                src="/about/img5.jpeg"
                alt="Emballage Nour Confection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>

            {/* Image 6 */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md group">
              <Image
                src="/about/img6.jpeg"
                alt="Détails de confection"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Video Section ────────────────────────────── */}
      <VideoSection />

      {/* ── CTA / Closing ────────────────────────────── */}
      <section className="bg-[#1a1a1a] text-white">
        <div
          className="relative overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #8c3b7b33 0%, transparent 60%)",
          }}
        >
          <div className="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center">
            <h2
              className={`font-playfair text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-6`}
            >
              Votre histoire.
            </h2>
            <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
              Chaque création Nour Confection est une pièce unique, pensée pour
              accompagner vos plus beaux moments.
            </p>
            <a
              href="/products"
              className="inline-block border-2 border-white text-white text-sm font-semibold tracking-widest uppercase px-10 py-4 hover:bg-white hover:text-[#1a1a1a] transition-all duration-300"
            >
              Découvrir nos créations
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
