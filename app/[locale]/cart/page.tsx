"use client"

export const dynamic = "force-static"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "@/i18n/navigation"
import { Link } from "@/i18n/navigation"
import Footer from "@/components/footer"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormatPrice } from "@/lib/hooks/useFormatPrice"

interface CartItem {
  id: number
  name: string
  price: string
  size: string
  color?: string
  image: string
  quantity: number
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const t = useTranslations("cart")
  const formatPrice = useFormatPrice()

  useEffect(() => {
    const loadCart = () => {
      const stored = localStorage.getItem("cartItems")
      if (stored) {
        setCartItems(JSON.parse(stored))
      }
      setIsLoading(false)
    }
    loadCart()

    const handleCartUpdate = () => loadCart()
    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return
    const updatedItems = [...cartItems]
    updatedItems[index].quantity = newQuantity
    setCartItems(updatedItems)
    localStorage.setItem("cartItems", JSON.stringify(updatedItems))
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const removeItem = (index: number) => {
    const updatedItems = cartItems.filter((_, i) => i !== index)
    setCartItems(updatedItems)
    localStorage.setItem("cartItems", JSON.stringify(updatedItems))
    if (updatedItems.length === 0) {
      localStorage.removeItem("cartItem")
    }
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number.parseFloat(item.price) * item.quantity,
    0
  )
  const shipping = 0
  const total = subtotal + shipping

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">

        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="h-40 bg-muted rounded"></div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <ShoppingBag className="w-6 h-6 text-accent" />
          <h1 className="text-2xl md:text-3xl font-light tracking-wide">
            {t("title")} {cartItems.length > 0 && `(${cartItems.length})`}
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-light mb-3">{t("empty")}</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t("emptyDesc")}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 text-sm font-medium hover:bg-primary/90 transition-all duration-300"
            >
              {t("continueShopping")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${item.color}-${index}`} className="border border-border rounded-sm overflow-hidden bg-card">
                  <div className="p-4 md:p-6">
                    <div className="flex gap-4 md:gap-6">
                      <div className="relative w-24 h-32 md:w-32 md:h-40 flex-shrink-0 bg-secondary rounded-sm overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-medium text-foreground mb-1 line-clamp-2">{item.name}</h3>
                            {item.color && (
                              <p className="text-sm text-muted-foreground mb-1">
                                {t("color")} <span className="text-foreground">{item.color}</span>
                              </p>
                            )}
                            {item.size && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {t("size")} <span className="text-foreground">{item.size}</span>
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(index)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                            aria-label={t("remove")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-lg font-medium text-accent mb-4">
                          {formatPrice(Number.parseFloat(item.price))}
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-muted-foreground mr-3">{t("quantity")}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center border border-border rounded-sm hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={t("decrease")}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-border rounded-sm hover:bg-secondary transition-colors"
                            aria-label={t("increase")}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-6 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                {t("continueShopping")}
              </Link>
            </div>

            <div className="lg:col-span-1">
              <div className="border border-border rounded-sm bg-card p-6 sticky top-24">
                <h2 className="text-lg font-medium mb-6">{t("summary")}</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("subtotal")}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("shipping")}</span>
                    <span className="text-green-600">{t("freeShipping")}</span>
                  </div>
                </div>

                <div className="border-t border-border my-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t("total")}</span>
                    <span className="text-xl font-semibold text-accent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-primary text-primary-foreground py-4 text-sm font-medium hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                >
                  {t("checkout")}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-[10px]">✓</span>
                      </div>
                      <span>{t("trustDelivery")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-[10px]">✓</span>
                      </div>
                      <span>{t("trustPayment")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 text-[10px]">✓</span>
                      </div>
                      <span>{t("trustService")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
