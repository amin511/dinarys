export default function BrandBanner() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(/hero.jpeg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Brand Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <h2
          className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider text-white drop-shadow-2xl"
        >
          NOUR
        </h2>
        <div className="flex items-center gap-4 mt-2">
          <span className="w-8 md:w-12 h-[1px] bg-white/70" />
          <p
            className="font-cormorant text-xl md:text-2xl lg:text-3xl font-light tracking-widest text-white/90 italic"
          >
            confection
          </p>
          <span className="w-8 md:w-12 h-[1px] bg-white/70" />
        </div>
      </div>
    </section>
  )
}
