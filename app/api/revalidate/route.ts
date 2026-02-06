import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { getWooCredentials } from "@/lib/config"

const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN || ""

/**
 * API de revalidation manuelle pour les pages SSG
 * 
 * Usage:
 * - POST /api/revalidate?path=/products
 * - POST /api/revalidate?path=/product/123
 * - POST /api/revalidate?path=/all-products (revalide toutes les pages produits)
 * 
 * Headers requis:
 * - Authorization: Bearer <REVALIDATE_TOKEN>
 */
export async function POST(request: NextRequest) {
    try {
        // Vérifier le token d'authentification
        const authHeader = request.headers.get("authorization")
        const token = authHeader?.replace("Bearer ", "")

        if (REVALIDATE_TOKEN && token !== REVALIDATE_TOKEN) {
            return NextResponse.json(
                { error: "Invalid or missing authorization token" },
                { status: 401 }
            )
        }

        // Récupérer le path à revalider
        const { searchParams } = new URL(request.url)
        const path = searchParams.get("path")

        if (!path) {
            return NextResponse.json(
                { error: "Missing 'path' query parameter" },
                { status: 400 }
            )
        }

        console.log(`[Revalidate API] Revalidating path: ${path}`)

        // Cas spécial: revalider tous les produits
        if (path === "/all-products") {
            await revalidateAllProducts()
            return NextResponse.json({
                success: true,
                message: "All product pages revalidated",
                timestamp: new Date().toISOString(),
            })
        }

        // Revalider le path spécifique
        revalidatePath(path)

        // Si c'est une page produit, aussi revalider les tags de cache et les listings
        if (path.startsWith("/product/")) {
            const productId = path.replace("/product/", "")
            // Invalider les tags de cache pour le produit et ses variations
            revalidateTag(`product-${productId}`, "page")
            revalidateTag(`variations-${productId}`, "page")

            revalidatePath("/products", "page")
            revalidatePath("/", "page")

            console.log(`[Revalidate API] Revalidated product ${productId} with tags`)
        }

        return NextResponse.json({
            success: true,
            revalidated: path,
            timestamp: new Date().toISOString(),
        })
    } catch (error) {
        console.error("[Revalidate API] Error:", error)
        return NextResponse.json(
            { error: "Revalidation failed", details: String(error) },
            { status: 500 }
        )
    }
}

/**
 * Revalider toutes les pages produits
 */
async function revalidateAllProducts() {
    try {
        const { storeUrl, authHeader } = getWooCredentials()

        // Récupérer tous les IDs de produits
        const response = await fetch(
            `${storeUrl}/wp-json/wc/v3/products?per_page=100&status=publish&_fields=id`,
            {
                headers: { Authorization: authHeader },
                cache: "no-store",
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status}`)
        }

        const products = await response.json()

        // Revalider le layout de la route dynamique
        revalidatePath("/product/[id]", "layout")

        // Revalider chaque page produit avec ses tags
        for (const product of products) {
            revalidateTag(`product-${product.id}`, "page")
            revalidateTag(`variations-${product.id}`, "page")
            revalidatePath(`/product/${product.id}`)
        }

        // Revalider les listings
        revalidatePath("/products")
        revalidatePath("/")

        console.log(`[Revalidate API] Revalidated ${products.length} product pages with tags`)
    } catch (error) {
        console.error("[Revalidate API] Error revalidating all products:", error)
        throw error
    }
}

/**
 * GET endpoint pour vérifier le statut
 */
export async function GET() {
    return NextResponse.json({
        status: "Revalidation API is active",
        usage: {
            endpoint: "POST /api/revalidate?path=<path>",
            examples: [
                "/api/revalidate?path=/products",
                "/api/revalidate?path=/product/123",
                "/api/revalidate?path=/all-products",
            ],
            headers: {
                Authorization: "Bearer <REVALIDATE_TOKEN>",
            },
        },
        timestamp: new Date().toISOString(),
    })
}
