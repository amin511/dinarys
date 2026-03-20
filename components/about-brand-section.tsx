export default function AboutBrandSection() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Purple Badge */}
        <span className="inline-block bg-secondary text-white text-sm font-medium px-4 py-1.5 rounded-sm mb-6">
          Nour Confection
        </span>

        {/* Heading */}
        <h2
          className="font-playfair text-3xl md:text-4xl lg:text-5xl font-medium text-[#2D2D2D] leading-tight mb-6"
        >
          Est bien plus qu&apos;une marque.
        </h2>

        {/* Description */}
        <p className="text-[#4A4A4A] leading-relaxed text-base md:text-lg mb-8">
          Chaque création est pensée avec soin pour accompagner les moments les plus précieux :
          mariages, naissances et souvenirs inoubliables. Chaque mariée mérite de se sentir unique.
          Chaque naissance est un trésor.
        </p>

        {/* LIRE PLUS button */}
        <a
          href="/a-propos"
          className="inline-block border-2 border-secondary text-[#2D2D2D] text-sm font-semibold tracking-widest uppercase px-8 py-3 hover:bg-secondary hover:text-white transition-all duration-300"
        >
          LIRE PLUS
        </a>
      </div>
    </section>
  )
}
