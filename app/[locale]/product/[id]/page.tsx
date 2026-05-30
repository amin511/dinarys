import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductDetailClient from "@/components/product-detail-client"
import { getWooCredentials, wooConfig, siteConfig } from "@/lib/config"

export const dynamic = "force-static"
export const dynamicParams = true

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJsonWithRetry(url: string, authHeader: string, context: string) {
  const maxAttempts = 3
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Authorization: authHeader },
        cache: "force-cache",
        signal: AbortSignal.timeout(15000),
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      if (attempt === maxAttempts) throw error
      console.warn(`[SSG] Retry ${attempt}/${maxAttempts - 1} for ${context}`)
      await sleep(500 * attempt)
    }
  }
  return null
}

async function getProduct(id: string) {
  try {
    const { storeUrl, authHeader } = getWooCredentials()
    const apiUrl = `${storeUrl}/wp-json/wc/v3/products/${id}`
    return await fetchJsonWithRetry(apiUrl, authHeader, `product ${id}`)
  } catch {
    return null
  }
}

async function getRelatedProducts(currentProductId: string) {
  try {
    const { storeUrl, authHeader } = getWooCredentials()
    const apiUrl = `${storeUrl}/wp-json/wc/v3/products?per_page=5&exclude=${currentProductId}&status=publish`
    const response = await fetch(apiUrl, { headers: { Authorization: authHeader }, cache: "force-cache" })
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

async function getCategories() {
  try {
    const { storeUrl, authHeader } = getWooCredentials()
    const apiUrl = `${storeUrl}/wp-json/wc/v3/products/categories?per_page=${wooConfig.categories.perPage}&hide_empty=true`
    const response = await fetch(apiUrl, { headers: { Authorization: authHeader }, cache: "force-cache" })
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

async function getProductVariations(productId: string, productType?: string) {
  if (productType !== "variable") return []
  try {
    const { storeUrl, authHeader } = getWooCredentials()
    const apiUrl = `${storeUrl}/wp-json/wc/v3/products/${productId}/variations?per_page=100`
    const response = await fetch(apiUrl, {
      headers: { Authorization: authHeader },
      next: { tags: [`product-${productId}`, `variations-${productId}`] },
    })
    if (!response.ok) return []
    return await response.json()
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  try {
    const { storeUrl, authHeader } = getWooCredentials()
    const allProducts: any[] = []
    let page = 1
    const perPage = 100
    const maxPages = 10

    while (page <= maxPages) {
      const apiUrl = `${storeUrl}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}&status=publish`
      let products: any[] | null = null
      try {
        products = await fetchJsonWithRetry(apiUrl, authHeader, `products page ${page}`)
      } catch {
        break
      }
      if (!products || products.length === 0) break
      allProducts.push(...products)
      if (products.length < perPage) break
      page++
    }

    const locales = ["fr", "ar"]
    return locales.flatMap((locale) =>
      allProducts.map((product: any) => ({
        locale,
        id: String(product.id),
      }))
    )
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}): Promise<Metadata> {
  const { id, locale } = await params
  const t = await getTranslations({ locale, namespace: "products" })
  const product = await getProduct(id)
  if (!product) return { title: t("notFound") }
  const productImage = product.images?.[0]?.src || "/placeholder.jpg"
  return {
    title: `${product.name} | ${siteConfig.name}`,
    description: product.short_description?.replace(/<[^>]*>/g, "") || product.description?.replace(/<[^>]*>/g, "").slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.short_description?.replace(/<[^>]*>/g, "") || "",
      images: [productImage],
      type: "website",
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) notFound()

  const [relatedProducts, categories, variations] = await Promise.all([
    getRelatedProducts(id),
    getCategories(),
    getProductVariations(id, product.type),
  ])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
        categories={categories}
        variations={variations}
      />
      <Footer />
    </main>
  )
}
