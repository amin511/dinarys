"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

interface PaginationProps {
  currentPage: number
  totalPages: number
  params?: Record<string, string>
}

function buildPageUrl(page: number, params: Record<string, string> = {}): string {
  const searchParams = new URLSearchParams(params)
  if (page > 1) {
    searchParams.set("page", String(page))
  } else {
    searchParams.delete("page")
  }
  const qs = searchParams.toString()
  return `/products${qs ? `?${qs}` : ""}`
}

export default function Pagination({ currentPage, totalPages, params = {} }: PaginationProps) {
  const t = useTranslations("products")

  if (totalPages <= 1) return null

  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = []
    const delta = 1

    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

    pages.push(1)

    if (rangeStart > 2) pages.push("...")

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }

    if (rangeEnd < totalPages - 1) pages.push("...")

    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-12 mb-8">
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1, params)}
          className="flex items-center justify-center w-10 h-10 rounded-sm border border-[#E5DDD3] text-[#4A4A4A] hover:border-[#2D2D2D] hover:text-[#2D2D2D] transition-colors"
          aria-label={t("prevPage")}
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 rounded-sm border border-[#E5DDD3] text-[#D0C8C0] cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {pageNumbers.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex items-center justify-center w-10 h-10 text-[#999] text-sm"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildPageUrl(page, params)}
            className={`flex items-center justify-center w-10 h-10 rounded-sm text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-[#2D2D2D] text-white border border-[#2D2D2D]"
                : "border border-[#E5DDD3] text-[#4A4A4A] hover:border-[#2D2D2D] hover:text-[#2D2D2D]"
            }`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1, params)}
          className="flex items-center justify-center w-10 h-10 rounded-sm border border-[#E5DDD3] text-[#4A4A4A] hover:border-[#2D2D2D] hover:text-[#2D2D2D] transition-colors"
          aria-label={t("nextPage")}
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 rounded-sm border border-[#E5DDD3] text-[#D0C8C0] cursor-not-allowed">
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  )
}
