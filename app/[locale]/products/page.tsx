import Footer from "@/components/footer"
import ProductsPageClient from "@/components/products-page-client"
import { getWooCredentials } from "@/lib/config"

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

interface ProductsResult {
  products: Product[]
  totalPages: number
}

export const dynamic = "force-static"
export const revalidate = false

async function getProductsPage(page: number): Promise<ProductsResult> {
  try {
    const { storeUrl, authHeader } = getWooCredentials()
    const apiUrl = `${storeUrl}/wp-json/wc/v3/products?per_page=100&page=${page}&status=publish`
    const response = await fetch(apiUrl, {
      headers: { Authorization: authHeader },
      cache: "force-cache",
    })
    if (!response.ok) return { products: [], totalPages: 0 }
    const products = await response.json()
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1", 10)
    return { products, totalPages }
  } catch {
    return { products: [], totalPages: 0 }
  }
}

async function getAllProducts(): Promise<Product[]> {
  const firstPage = await getProductsPage(1)
  if (firstPage.totalPages <= 1) return firstPage.products
  const remainingPages = Array.from({ length: firstPage.totalPages - 1 }, (_, i) => i + 2)
  const remainingResults = await Promise.all(remainingPages.map((page) => getProductsPage(page)))
  return firstPage.products.concat(remainingResults.flatMap((r) => r.products))
}

async function getCategories(): Promise<Category[]> {
  try {
    const { storeUrl, authHeader } = getWooCredentials()
    const response = await fetch(
      `${storeUrl}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=true`,
      { headers: { Authorization: authHeader }, cache: "force-cache" }
    )
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()])
  return (
    <main className="min-h-screen bg-background">
      <ProductsPageClient products={products} categories={categories} />
      <Footer />
    </main>
  )
}
