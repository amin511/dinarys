"use client"

import Link from "next/link"
import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "@/components/product-card"
import ProductsFilter from "@/components/products-filter"
import ProductSearch from "@/components/product-search"
import Pagination from "@/components/pagination"

interface Product {
    id: number
    name: string
    price: string | number
    images: Array<{ src?: string }>
    stock_status: string
    categories?: Array<{ id: number; slug?: string }>
}

interface Category {
    id: number
    name: string
    slug: string
    parent: number
    count: number
}

interface ProductsPageClientProps {
    products: Product[]
    categories: Category[]
}

const PRODUCTS_PER_PAGE = 12

export default function ProductsPageClient({ products, categories }: ProductsPageClientProps) {
    const searchParams = useSearchParams()

    const categorySlug = searchParams.get("category")
    const searchQuery = (searchParams.get("search") || "").trim()
    const pageParam = Number.parseInt(searchParams.get("page") || "1", 10)
    const currentPage = Number.isNaN(pageParam) ? 1 : Math.max(1, pageParam)

    const category = useMemo(
        () => (categorySlug ? categories.find((cat) => cat.slug === categorySlug) || null : null),
        [categories, categorySlug]
    )

    const filteredProducts = useMemo(() => {
        let result = products

        if (categorySlug) {
            if (!category) return []
            result = result.filter((product) =>
                product.categories?.some((productCategory) => productCategory.id === category.id)
            )
        }

        if (searchQuery) {
            const normalizedQuery = searchQuery.toLowerCase()
            result = result.filter((product) => product.name.toLowerCase().includes(normalizedQuery))
        }

        return result
    }, [products, categorySlug, category, searchQuery])

    const totalProducts = filteredProducts.length
    const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE))
    const safeCurrentPage = Math.min(currentPage, totalPages)

    const paginatedProducts = useMemo(() => {
        const start = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE
        return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE)
    }, [filteredProducts, safeCurrentPage])

    const pageTitle = category?.name || "Boutique"
    const parentCategories = categories.filter((cat) => cat.parent === 0)

    return (
        <>
            {/* ── Dark Banner with Title & Breadcrumb ──────── */}
            <section className="bg-[#1a1a1a] text-white">
                <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 text-center">
                    <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium mb-4">
                        {pageTitle}
                    </h1>
                    <nav
                        aria-label="Breadcrumb"
                        className="flex items-center justify-center gap-2 text-sm text-white/60"
                    >
                        <Link href="/" className="hover:text-white transition-colors">
                            Home
                        </Link>
                        <span className="text-white/40">/</span>
                        <span className="text-white font-medium">{pageTitle}</span>
                    </nav>
                </div>
            </section>

            {/* ── Content ──────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <nav className="flex items-center gap-2 text-sm text-[#4A4A4A] mb-6 pb-4 border-b border-[#E5DDD3]">
                    <Link href="/" className="hover:text-[#2D2D2D] transition-colors">
                        Accueil
                    </Link>
                    <span className="text-[#B0A8A0]">/</span>
                    <span className="text-[#2D2D2D] font-semibold">{pageTitle}</span>
                </nav>

                <ProductsFilter categories={parentCategories} currentCategory={categorySlug} />

                <ProductSearch initialQuery={searchQuery} />

                {searchQuery && (
                    <div className="flex items-center gap-2 mb-6 text-sm text-[#4A4A4A]">
                        <span>
                            Resultats pour <strong className="text-[#2D2D2D]">&ldquo;{searchQuery}&rdquo;</strong>
                        </span>
                        <Link
                            href={categorySlug ? `/products?category=${encodeURIComponent(categorySlug)}` : "/products"}
                            className="text-secondary hover:underline ml-1"
                        >
                            Effacer
                        </Link>
                    </div>
                )}

                {paginatedProducts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground mb-4">
                            {searchQuery
                                ? `Aucun produit trouve pour "${searchQuery}"`
                                : category?.name
                                    ? `Aucun produit disponible dans la categorie "${category.name}"`
                                    : "Aucun produit disponible"}
                        </p>
                        {(categorySlug || searchQuery) && (
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 text-secondary hover:underline"
                            >
                                Voir tous les produits
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <p className="text-muted-foreground mb-6 text-sm">
                            {totalProducts} produit{totalProducts > 1 ? "s" : ""}
                            {totalPages > 1 && (
                                <span className="text-[#B0A8A0]">
                                    - Page {safeCurrentPage} sur {totalPages}
                                </span>
                            )}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {paginatedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={
                                        typeof product.price === "string"
                                            ? Number.parseFloat(product.price)
                                            : product.price
                                    }
                                    image={product.images?.[0]?.src || ""}
                                    stockStatus={product.stock_status}
                                />
                            ))}
                        </div>

                        <Pagination
                            currentPage={safeCurrentPage}
                            totalPages={totalPages}
                            params={{
                                ...(categorySlug ? { category: categorySlug } : {}),
                                ...(searchQuery ? { search: searchQuery } : {}),
                            }}
                        />
                    </>
                )}
            </div>
        </>
    )
}
