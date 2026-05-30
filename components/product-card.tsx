"use client"

import { Link } from "@/i18n/navigation"
import { useFormatPrice } from "@/lib/hooks/useFormatPrice"

interface ProductCardProps {
  id: number
  name: string
  price: number
  image: string
  isOutOfStock?: boolean
  stockStatus?: string
  outOfStockLabel?: string
  index?: number
}

export default function ProductCard({ id, name, price, image, isOutOfStock, stockStatus, outOfStockLabel = "Épuisé", index = 0 }: ProductCardProps) {
  const formatPrice = useFormatPrice()
  const delay = 100 + (index * 80)

  return (
    <Link href={`/product/${id}` as `/product/${string}`}>
      <div
        className="group cursor-pointer opacity-0 animate-fade-in-rise"
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
      >
        {/* Image container */}
        <div className="relative w-full overflow-hidden rounded-sm mb-4">
          <img
            src={image || "/placeholder.svg?height=400&width=300&query=fashion%20product"}
            alt={name}
            className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
          />

          {/* Out of stock badge */}
          {isOutOfStock || stockStatus === "outofstock" ? (
            <div className="absolute top-3 start-3 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
              {outOfStockLabel}
            </div>
          ) : null}
        </div>

        {/* Product info */}
        <div className="space-y-2">
          <h3 className="text-sm font-normal text-muted-foreground line-clamp-2 group-hover:text-foreground transition font-[family-name:var(--font-playfair)]">
            {name}
          </h3>
          <p className="text-base font-medium text-primary">{formatPrice(price || 0)}</p>
        </div>
      </div>
    </Link>
  )
}
