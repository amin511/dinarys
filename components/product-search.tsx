"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"

interface ProductSearchProps {
  initialQuery?: string
}

export default function ProductSearch({ initialQuery = "" }: ProductSearchProps) {
  const t = useTranslations("products")
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    const category = searchParams.get("category")
    if (category) params.set("category", category)
    if (query.trim()) params.set("search", query.trim())

    const queryString = params.toString()
    router.push(`/products${queryString ? `?${queryString}` : ""}`)
  }

  const handleClear = () => {
    setQuery("")
    const params = new URLSearchParams()
    const category = searchParams.get("category")
    if (category) params.set("category", category)
    const queryString = params.toString()
    router.push(`/products${queryString ? `?${queryString}` : ""}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full pl-11 pr-24 py-3 border border-[#E5DDD3] text-sm text-[#2D2D2D] placeholder:text-[#999] focus:outline-none focus:border-[#2D2D2D] transition-colors rounded-sm"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-20 top-1/2 -translate-y-1/2 text-xs text-[#999] hover:text-[#2D2D2D] transition-colors"
          >
            {t("searchClear")}
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#2D2D2D] text-white text-xs font-semibold tracking-wider uppercase px-4 py-2 hover:bg-secondary transition-colors"
        >
          {t("searchSubmit")}
        </button>
      </div>
    </form>
  )
}
