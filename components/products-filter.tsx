"use client"

import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

interface Category {
  id: number
  name: string
  slug: string
  count: number
}

interface ProductsFilterProps {
  categories: Category[]
  currentCategory: string | null
}

export default function ProductsFilter({ categories, currentCategory }: ProductsFilterProps) {
  const t = useTranslations("products")
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2.5 text-[#2D2D2D] font-medium text-sm hover:text-secondary transition-colors pb-4 border-b border-[#E5DDD3] w-full"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <SlidersHorizontal className="w-5 h-5" />
        )}
        <span className="text-base font-semibold">{t("filter")}</span>
      </button>

      {isOpen && (
        <div className="py-6 border-b border-[#E5DDD3] animate-in slide-in-from-top-2 duration-200">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#8B8B8B] mb-4">
            {t("categories")}
          </h3>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/products"
              className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                !currentCategory
                  ? "bg-[#2D2D2D] text-white border-[#2D2D2D]"
                  : "bg-white text-[#4A4A4A] border-[#E5DDD3] hover:border-[#2D2D2D] hover:text-[#2D2D2D]"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {t("all")}
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm border transition-all duration-200 ${
                  currentCategory === cat.slug
                    ? "bg-[#2D2D2D] text-white border-[#2D2D2D]"
                    : "bg-white text-[#4A4A4A] border-[#E5DDD3] hover:border-[#2D2D2D] hover:text-[#2D2D2D]"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
