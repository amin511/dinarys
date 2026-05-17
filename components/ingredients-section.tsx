"use client"

import Image from "next/image"

const products = [
  {
    name: "Shampooing Vitalité Capillaire Intense",
    subtitle: "FORCE, RÉSISTANCE & ANTI-CASSE",
    description:
      "Nettoyage doux et respectueux du cuir chevelu avec un effet hydratant et apaisant. Sa formule hydrate et apaise tout en éliminant les impuretés en douceur.",
    claim: "Les cheveux sont légers, doux et visiblement plus sains.",
    benefits: [
      { icon: "💧", label: "Effet Hydratant & Apaisant", desc: "Hydrate le cuir chevelu et apaise les sensations d'inconfort." },
      { icon: "✨", label: "Nettoyage Doux", desc: "Élimine les impuretés sans agresser la fibre capillaire." },
    ],
    image: "/hero/prod1.jpeg",
    volume: "250ml",
  },
  {
    name: "Masque Restructurant Vitalité & Résistance",
    subtitle: "FORCE ET BRILLANCE INTENSE",
    description:
      "Soin réparateur intensif qui nourrit en profondeur et renforce la fibre capillaire. Sa texture riche restaure la vitalité, améliore la résistance et redonne souplesse et brillance aux cheveux abîmés ou fragilisés.",
    claim: "Pour des cheveux plus forts, doux et éclatants de santé.",
    benefits: [
      { icon: "💧", label: "Nourrit & Répare en Profondeur", desc: "Pénètre au cœur de la fibre pour revitaliser et réparer les cheveux abîmés." },
      { icon: "🛡️", label: "Renforce & Protège", desc: "Renforce la structure capillaire et aide à protéger contre les agressions extérieures." },
    ],
    image: "/hero/prod2.jpeg",
    volume: "300g",
  },
  {
    name: "Lotion Élixir Brillance & Résistance",
    subtitle: "DISCIPLINE CAPILLAIRE & ÉCLAT SOYEUX",
    description:
      "Soin sans rinçage léger qui protège, hydrate et sublime les cheveux au quotidien. Il aide à limiter les frisottis, sans alourdir, tout en protégeant la fibre capillaire des agressions extérieures : rayons UV et chaleur (sèche-cheveux, lisseur…).",
    claim: "Pour des cheveux doux, brillants et protégés tout au long de la journée.",
    benefits: [
      { icon: "☀️", label: "Protection UV & Chaleur", desc: "Protège des rayons UV et de la chaleur des outils coiffants." },
      { icon: "✨", label: "Anti-Frisottis & Brillance", desc: "Discipline les cheveux et sublime leur éclat naturel." },
    ],
    image: "/hero_dinarys2.png",
    volume: "100ml",
  },
]

const actives = [
  {
    name: "Calendula",
    desc: "Actif apaisant qui aide à protéger et calmer le cuir chevelu.",
    color: "#D4A843",
    emoji: "🌼",
  },
  {
    name: "Camomille",
    desc: "Apporte douceur, éclat et confort d'utilisation.",
    color: "#C8A84B",
    emoji: "🌸",
  },
  {
    name: "Vitamine B5",
    desc: "Hydrate, renforce et améliore la brillance capillaire.",
    color: "#B8943C",
    emoji: "💊",
  },
  {
    name: "Protéines de Blé",
    desc: "Gainent la fibre capillaire, facilitent le démêlage et apportent souplesse.",
    color: "#A07830",
    emoji: "🌾",
  },
  {
    name: "Kératine Naturelle",
    desc: "Contribue à réparer et restructurer les cheveux abîmés.",
    color: "#8B6520",
    emoji: "💎",
  },
]

export default function IngredientsSection() {
  return (
    <section id="ingredients" className="bg-white">
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-12 text-center">
        <span
          className="inline-block text-white text-xs font-bold tracking-[0.25em] uppercase px-5 py-2 rounded-sm mb-6"
          style={{ background: "#B8943C" }}
        >
          Notre Gamme Capillaire
        </span>
        <h2
          className="font-playfair text-3xl md:text-4xl lg:text-5xl font-semibold text-[#1a1a1a] mb-4"
        >
          La Science du Cheveu Algérien
        </h2>
        <p className="text-[#5A5A5A] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Une gamme de 3 soins capillaires haute performance, formulée avec des actifs clés pour nourrir, réparer et sublimer vos cheveux.
        </p>
      </div>

      {/* ── Products ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 space-y-24">
        {products.map((product, i) => (
          <div
            key={i}
            className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            {/* Image */}
            <div className="relative group">
              <div
                className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at 50% 50%, #D4A84320 0%, transparent 70%)" }}
              />
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-[#0d0d0d]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
              </div>
              {/* Volume badge */}
              <div
                className="absolute bottom-4 right-4 text-white text-xs font-bold tracking-wider px-3 py-1.5 rounded-full shadow-lg"
                style={{ background: "#B8943C" }}
              >
                {product.volume}
              </div>
            </div>

            {/* Text */}
            <div>
              <p
                className="text-xs font-bold tracking-[0.25em] uppercase mb-3"
                style={{ color: "#B8943C" }}
              >
                {product.subtitle}
              </p>
              <div className="w-10 h-0.5 mb-5" style={{ background: "#B8943C" }} />
              <h3 className="font-playfair text-2xl md:text-3xl font-semibold text-[#1a1a1a] mb-4 leading-snug">
                {product.name}
              </h3>
              <p className="text-[#4A4A4A] text-base leading-relaxed mb-3">
                {product.description}
              </p>
              <p className="font-semibold text-[#1a1a1a] mb-8 text-base">
                {product.claim}
              </p>

              {/* Benefits */}
              <div className="space-y-4">
                {product.benefits.map((b, bi) => (
                  <div key={bi} className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-lg border-2"
                      style={{ borderColor: "#D4A84360", background: "#D4A84310" }}
                    >
                      {b.icon}
                    </div>
                    <div>
                      <p
                        className="text-sm font-bold tracking-wide uppercase mb-0.5"
                        style={{ color: "#B8943C" }}
                      >
                        {b.label}
                      </p>
                      <p className="text-[#5A5A5A] text-sm leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Key Actives ── */}
      <div className="bg-[#0d0d0d] py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold tracking-[0.25em] uppercase px-5 py-2 rounded-sm mb-6"
              style={{ background: "#B8943C20", color: "#D4A843", border: "1px solid #B8943C50" }}
            >
              Actifs Clés
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-white mb-4">
              Des ingrédients qui font la différence
            </h2>
            <p className="text-white/60 text-base max-w-xl mx-auto">
              Chaque actif est sélectionné avec précision pour ses propriétés prouvées sur la santé capillaire.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {actives.map((active, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl border border-white/10 hover:border-[#B8943C]/50 transition-all duration-500 cursor-default"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto transition-transform duration-500 group-hover:scale-110"
                  style={{ background: "#B8943C20", border: `1.5px solid #B8943C40` }}
                >
                  {active.emoji}
                </div>
                <h4
                  className="font-semibold text-center mb-2 text-sm tracking-wide"
                  style={{ color: "#D4A843" }}
                >
                  {active.name}
                </h4>
                <p className="text-white/55 text-xs text-center leading-relaxed">
                  {active.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Made in Algeria badge */}
          <div className="flex justify-center mt-14">
            <div
              className="flex items-center gap-3 px-8 py-4 rounded-full border"
              style={{ borderColor: "#B8943C40", background: "#B8943C10" }}
            >
              <span className="text-2xl">🇩🇿</span>
              <span className="text-white font-semibold tracking-wider text-sm uppercase">
                Made in Algeria · Qualité Premium
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
