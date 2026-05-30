import { type NextRequest } from "next/server"
import { getWooCredentials, wooConfig } from "@/lib/config"

// ISR: Revalidate every 5 minutes
export const revalidate = 300

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const per_page = searchParams.get("per_page") || String(wooConfig.products.perPage)
    const page = searchParams.get("page") || "1"
    const orderby = searchParams.get("orderby") || wooConfig.products.defaultOrderBy
    const order = searchParams.get("order") || wooConfig.products.defaultOrder
    const category = searchParams.get("category") || ""

    const { storeUrl, authHeader } = getWooCredentials()

    console.log("[v0] Using WooCommerce store:", storeUrl)

    let apiUrl = `${storeUrl}/wp-json/wc/v3/products?per_page=${per_page}&page=${page}&orderby=${orderby}&order=${order}`

    // Add category filter if provided (WooCommerce accepts category slug)
    if (category) {
      // First, we need to get the category ID from the slug
      const categoriesUrl = `${storeUrl}/wp-json/wc/v3/products/categories?slug=${category}`
      const catResponse = await fetch(categoriesUrl, {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 }
      })

      if (catResponse.ok) {
        const categories = await catResponse.json()
        if (categories.length > 0) {
          const categoryId = categories[0].id
          apiUrl += `&category=${categoryId}`
          console.log("[v0] Filtering by category:", category, "ID:", categoryId)
        }
      }
    }

    console.log("[v0] Fetching from:", apiUrl)

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }
    })

    console.log("[v0] WooCommerce API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] WooCommerce API error:", response.status, errorText)
      throw new Error(`WooCommerce API returned ${response.status}: ${errorText}`)
    }

    const products = await response.json()

    console.log("[v0] Successfully fetched products count:", products.length)

    // Transform WooCommerce data to match our component expectations
    const transformedProducts = (products || []).map((product: any) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      regular_price: product.regular_price,
      description: product.description,
      images: product.images || [],
      stock_status: product.stock_status || "instock",
      stock_quantity: product.stock_quantity,
      sku: product.sku,
      permalink: product.permalink,
    }))

    return Response.json(transformedProducts)
  } catch (error) {
    console.error("[v0] Products API error:", error instanceof Error ? error.message : error)
    return Response.json(
      {
        error: "Failed to fetch products from WooCommerce",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
