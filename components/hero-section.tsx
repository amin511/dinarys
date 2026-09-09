import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      dir="rtl"
      className="
        relative w-full overflow-hidden bg-black
        aspect-[9/16]
        md:grid md:h-[90vh] md:aspect-auto md:grid-cols-2
      "
    >
      {/* Image */}
      <div className="absolute inset-0 md:relative md:inset-auto md:order-2">
        <Image
          src="/hero/heroMalika.webp"
          alt="عبايات بمعايير عالمية"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-top opacity-85"
        />
      </div>

      {/* Content */}
      <div
        className="
          absolute inset-0 z-10
          flex flex-col items-end justify-center
          p-[30px] text-right text-white
          bg-gradient-to-b from-black/20 to-black/70

          md:relative md:inset-auto md:order-1
          md:p-[60px]
          md:bg-gradient-to-br md:from-[#1a1a1a] md:to-black
        "
      >
        <h1
          className="
            mb-[10px]
            text-[34px] font-bold leading-tight
            drop-shadow-lg
            md:mb-5 md:text-[52px]
          "
        >
          الملكة متجر كل مسلمة
        </h1>

        <p
          className="
            mb-5 text-[18px] font-normal
            md:mb-[30px] md:text-[24px]
          "
        >
          الملكة للباس الشرعي هنا متجر كل مسلمة تبحث عن الأناقة والستر
        </p>

        <Link
          href="/products"
          className="
            rounded-lg bg-white px-5 py-[10px]
            font-bold text-black
            transition-all duration-300

            hover:-translate-y-0.5
            hover:bg-gray-100

            md:px-9 md:py-4 md:text-lg
          "
        >
          تسوقي الآن
        </Link>
      </div>
    </section>
  );
}