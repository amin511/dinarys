import Link from "next/link"
import ProductCard from "./product-card"
import { getWooCredentials } from "@/lib/config"

interface Product {
    id: number
    name: string
    price: string | number
    images: Array<{ src?: string }>
    stock_status: string
}

// Fetch products from WooCommerce
async function getProducts() {
    try {
        const { storeUrl, authHeader } = getWooCredentials()
        const apiUrl = `${storeUrl}/wp-json/wc/v3/products?per_page=20&page=1&orderby=modified&order=desc&status=publish`

        const response = await fetch(apiUrl, {
            headers: {
                Authorization: authHeader,
            },
            next: { revalidate: 300 } // ISR: Revalidate every 5 minutes
        })

        if (!response.ok) {
            console.error("[ProductsSection] API Error:", response.status)
            return []
        }

        const products = await response.json()
        return products
    } catch (error) {
        console.error("[ProductsSection] Error fetching products:", error)
        return []
    }
}

export default async function ProductsSectionServer() {
    const products = await getProducts()

    if (products.length === 0) {
        return (
            <section id="products" className="max-w-7xl mx-auto px-4 py-16 border-t border-border scroll-mt-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-light text-foreground">Nos Produits</h2>
                    <Link href="/products" className="text-sm text-[#4A4A4A] underline underline-offset-4 uppercase tracking-wider hover:text-[#2D2D2D] transition">VOIR TOUT</Link>
                </div>
                <div className="p-8 bg-muted/50 border border-border rounded-sm">
                    <p className="text-muted-foreground">Aucun produit disponible pour le moment.</p>
                </div>
            </section>
        )
    }

    return (
        <section id="products" className="max-w-7xl mx-auto border-t border-border text-3xl py-16 px-4 scroll-mt-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-light text-foreground mt-0 text-xl">Nos Produits</h2>
                <Link href="/products" className="text-sm text-[#4A4A4A] underline underline-offset-4 uppercase tracking-wider hover:text-[#2D2D2D] transition">VOIR TOUT</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {products.map((product: Product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={typeof product.price === "string" ? Number.parseFloat(product.price) : product.price}
                        image={product.images?.[0]?.src || ""}
                        stockStatus={product.stock_status}
                    />
                ))}
            </div>
        </section>
    )
}
