import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import Link from "next/link"
import { getWooCredentials } from "@/lib/config"
import ProductsFilter from "@/components/products-filter"
import ProductSearch from "@/components/product-search"
import Pagination from "@/components/pagination"

interface Product {
  id: number
  name: string
  price: string | number
  images: Array<{ src?: string }>
  stock_status: string
}

interface Category {
  id: number
  name: string
  slug: string
  parent: number
  count: number
}

interface ProductsResult {
  products: Product[]
  totalPages: number
  totalProducts: number
}

const PRODUCTS_PER_PAGE = 12

// ISR: Revalidate every 5 minutes (300 seconds)
export const revalidate = 300

async function getProducts(
  categorySlug?: string | null,
  search?: string | null,
  page: number = 1
): Promise<ProductsResult> {
  try {
    const { storeUrl, authHeader } = getWooCredentials()
    let apiUrl = `${storeUrl}/wp-json/wc/v3/products?per_page=${PRODUCTS_PER_PAGE}&page=${page}&status=publish`

    // Add search param
    if (search) {
      apiUrl += `&search=${encodeURIComponent(search)}`
    }

    // Add category filter
    if (categorySlug) {
      const categoriesUrl = `${storeUrl}/wp-json/wc/v3/products/categories?slug=${categorySlug}`
      const catResponse = await fetch(categoriesUrl, {
        headers: { Authorization: authHeader },
        next: { revalidate: 300 },
      })

      if (catResponse.ok) {
        const categories = await catResponse.json()
        if (categories.length > 0) {
          apiUrl += `&category=${categories[0].id}`
        }
      }
    }

    const response = await fetch(apiUrl, {
      headers: { Authorization: authHeader },
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      console.error("[Products] API Error:", response.status)
      return { products: [], totalPages: 0, totalProducts: 0 }
    }

    const products = await response.json()
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1", 10)
    const totalProducts = parseInt(response.headers.get("X-WP-Total") || "0", 10)

    return { products, totalPages, totalProducts }
  } catch (error) {
    console.error("[Products] Error fetching products:", error)
    return { products: [], totalPages: 0, totalProducts: 0 }
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const { storeUrl, authHeader } = getWooCredentials()
    const response = await fetch(
      `${storeUrl}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=true`,
      {
        headers: { Authorization: authHeader },
        next: { revalidate: 300 },
      }
    )

    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error("[Products] Error fetching categories:", error)
    return []
  }
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    page?: string
  }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const categorySlug = params.category || null
  const searchQuery = params.search || null
  const currentPage = Math.max(1, parseInt(params.page || "1", 10))

  const [{ products, totalPages, totalProducts }, categories] = await Promise.all([
    getProducts(categorySlug, searchQuery, currentPage),
    getCategories(),
  ])

  const category = categorySlug
    ? categories.find((cat: Category) => cat.slug === categorySlug)
    : null

  const pageTitle = category?.name || "Boutique"
  const parentCategories = categories.filter((cat: Category) => cat.parent === 0)

  return (
    <main className="min-h-screen bg-background">
      <Header />

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
        {/* Breadcrumb (below banner) */}
        <nav className="flex items-center gap-2 text-sm text-[#4A4A4A] mb-6 pb-4 border-b border-[#E5DDD3]">
          <Link href="/" className="hover:text-[#2D2D2D] transition-colors">
            Accueil
          </Link>
          <span className="text-[#B0A8A0]">/</span>
          <span className="text-[#2D2D2D] font-semibold">{pageTitle}</span>
        </nav>

        {/* Filter */}
        <ProductsFilter
          categories={parentCategories}
          currentCategory={categorySlug || null}
        />

        {/* Search bar — client component wrapped in Suspense */}
        <Suspense fallback={null}>
          <ProductSearch initialQuery={searchQuery || ""} />
        </Suspense>

        {/* Active search indicator */}
        {searchQuery && (
          <div className="flex items-center gap-2 mb-6 text-sm text-[#4A4A4A]">
            <span>
              Résultats pour <strong className="text-[#2D2D2D]">&ldquo;{searchQuery}&rdquo;</strong>
            </span>
            <Link
              href={categorySlug ? `/products?category=${categorySlug}` : "/products"}
              className="text-secondary hover:underline ml-1"
            >
              Effacer
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `Aucun produit trouvé pour "${searchQuery}"`
                : category?.name
                  ? `Aucun produit disponible dans la catégorie "${category.name}"`
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
                  {" "}— Page {currentPage} sur {totalPages}
                </span>
              )}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={
                    typeof product.price === "string"
                      ? Number.parseFloat(product.price)
                      : product.price
                  }
                  image={product.images?.[0]?.src}
                  stockStatus={product.stock_status}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              params={{
                ...(categorySlug ? { category: categorySlug } : {}),
                ...(searchQuery ? { search: searchQuery } : {}),
              }}
            />
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
