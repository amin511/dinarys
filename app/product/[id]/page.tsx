import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProductDetailClient from "@/components/product-detail-client"
import { getWooCredentials, wooConfig, siteConfig } from "@/lib/config"

/**
 * SSG Configuration with on-demand generation for new products
 * 
 * - generateStaticParams() génère toutes les pages produits au build time
 * - dynamicParams = true : Les nouveaux produits peuvent être générés à la demande
 * - Pas de revalidation temporelle (pas d'ISR intervalle)
 */
export const dynamicParams = true

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJsonWithRetry(url: string, authHeader: string, context: string) {
  const maxAttempts = 3

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: authHeader,
        },
        cache: "force-cache",
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      const isLastAttempt = attempt === maxAttempts

      if (isLastAttempt) {
        throw error
      }

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

    let product: any = null
    try {
      product = await fetchJsonWithRetry(apiUrl, authHeader, `product ${id}`)
    } catch (error) {
      console.error(`[v0] Failed to fetch product ${id} after retries:`, error)
      return null
    }

    return product
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return null
  }
}

async function getRelatedProducts(currentProductId: string) {
  try {
    const { storeUrl, authHeader } = getWooCredentials()
    const apiUrl = `${storeUrl}/wp-json/wc/v3/products?per_page=5&exclude=${currentProductId}&status=publish`

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: authHeader,
      },
      cache: "force-cache", // SSG: Cache au build time
    })

    if (!response.ok) {
      return []
    }

    const products = await response.json()
    return products
  } catch (error) {
    console.error("[v0] Error fetching related products:", error)
    return []
  }
}

async function getCategories() {
  try {
    const { storeUrl, authHeader } = getWooCredentials()
    const apiUrl = `${storeUrl}/wp-json/wc/v3/products/categories?per_page=${wooConfig.categories.perPage}&hide_empty=true`

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: authHeader,
      },
      cache: "force-cache", // SSG: Cache au build time
    })

    if (!response.ok) {
      return []
    }

    const categories = await response.json()
    return categories
  } catch (error) {
    console.error("[v0] Error fetching categories:", error)
    return []
  }
}

/**
 * Récupère les variations d'un produit variable
 * @see https://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#list-all-product-variations
 */
async function getProductVariations(productId: string, productType?: string) {
  // Ne récupère les variations que pour les produits variables
  if (productType !== 'variable') {
    return []
  }

  try {
    const { storeUrl, authHeader } = getWooCredentials()
    const apiUrl = `${storeUrl}/wp-json/wc/v3/products/${productId}/variations?per_page=100`

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: authHeader,
      },
      next: { tags: [`product-${productId}`, `variations-${productId}`] }, // Tags pour revalidation
    })

    if (!response.ok) {
      console.error("[v0] Error fetching variations:", response.status)
      return []
    }

    const variations = await response.json()
    console.log(`[v0] Fetched ${variations.length} variations for product ${productId}`)
    return variations
  } catch (error) {
    console.error("[v0] Error fetching product variations:", error)
    return []
  }
}

/**
 * Génère les paramètres statiques pour TOUS les produits au build time
 * Utilise la pagination pour récupérer jusqu'à 1000 produits
 */
export async function generateStaticParams() {
  try {
    const { storeUrl, authHeader } = getWooCredentials()
    const allProducts: any[] = []
    let page = 1
    const perPage = 100 // Maximum autorisé par WooCommerce
    const maxPages = 10 // Limite à 1000 produits maximum

    console.log("[SSG] Fetching all products for static generation...")

    while (page <= maxPages) {
      const apiUrl = `${storeUrl}/wp-json/wc/v3/products?per_page=${perPage}&page=${page}&status=publish`

      let products: any[] | null = null
      try {
        products = await fetchJsonWithRetry(apiUrl, authHeader, `products page ${page}`)
      } catch (error) {
        console.error(`[SSG] Failed to fetch page ${page} after retries:`, error)
        break
      }

      if (!products || products.length === 0) {
        console.log(`[SSG] No more products at page ${page}`)
        break
      }

      allProducts.push(...products)
      console.log(`[SSG] Fetched page ${page}: ${products.length} products (total: ${allProducts.length})`)

      // Si moins de produits que perPage, c'est la dernière page
      if (products.length < perPage) {
        break
      }

      page++
    }

    console.log(`[SSG] Total products to generate: ${allProducts.length}`)

    return allProducts.map((product: any) => ({
      id: String(product.id),
    }))
  } catch (error) {
    console.error("[SSG] Error in generateStaticParams:", error)
    return []
  }
}

/**
 * Génère les métadonnées SEO dynamiques pour chaque produit
 */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return {
      title: "Produit non trouvé",
    }
  }

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

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // D'abord récupérer le produit pour connaître son type
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  // Ensuite récupérer les données complémentaires en parallèle
  const [relatedProducts, categories, variations] = await Promise.all([
    getRelatedProducts(id),
    getCategories(),
    getProductVariations(id, product.type)
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
