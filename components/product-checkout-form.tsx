"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { User, Phone, Minus, Plus, ShoppingBag, Truck, Loader2 } from "lucide-react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { useFormatPrice } from "@/lib/hooks/useFormatPrice"
import {
  shippingConfig,
  isFreeShipping,
  ALGERIA_WILAYAS,
  ALGERIA_COMMUNES,
  type DeliveryMethod,
} from "@/lib/config"
import { useWilayaShipping, type WilayaShippingMethod } from "@/lib/hooks/useShipping"

interface ProductCheckoutFormProps {
  product: {
    id: number
    name: string
    price: string
    image: string
    size?: string
    color?: string
    variationId?: number
  }
}

function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '')
  const phoneRegex = /^(0|\+213)\d{9}$/
  return phoneRegex.test(cleaned)
}

export default function ProductCheckoutForm({ product }: ProductCheckoutFormProps) {
  const t = useTranslations("checkout")
  const formatPrice = useFormatPrice()
  const [quantity, setQuantity] = useState(1)
  const [wilaya, setWilaya] = useState("")
  const [commune, setCommune] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(shippingConfig.defaultMethod)
  const [formData, setFormData] = useState({
    prenom: "",
    telephone: "",
  })
  const [phoneError, setPhoneError] = useState("")
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isShippingEnabled = shippingConfig.enabled

  const { shippingData, loading: shippingLoading } = useWilayaShipping(wilaya || null)

  const productPrice = Number.parseFloat(product.price) || 0
  const sousTotal = productPrice * quantity

  const dynamicDeliveryMethods = useMemo((): WilayaShippingMethod[] => {
    if (!shippingData) return []
    return shippingData.methods.filter(m => m.deliveryType !== "other")
  }, [shippingData])

  const livraison = useMemo(() => {
    if (!isShippingEnabled) return 0
    if (!wilaya || !shippingData) return 0
    if (isFreeShipping(sousTotal)) return 0

    if (deliveryMethod === "domicile") {
      return shippingData.domicilePrice
    } else if (deliveryMethod === "stopdesk") {
      return shippingData.stopdeskPrice
    }
    return shippingData.cheapestMethod?.cost || 0
  }, [wilaya, deliveryMethod, sousTotal, isShippingEnabled, shippingData])

  const total = sousTotal + livraison

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.prenom || !formData.telephone || !wilaya || !commune) {
      alert(t("fillRequired"))
      return
    }

    if (!validatePhoneNumber(formData.telephone)) {
      setPhoneError(t("phoneError"))
      return
    }

    setPhoneError("")
    setIsSubmitting(true)

    try {
      const orderPayload = {
        product_id: product.id,
        variation_id: product.variationId || null,
        quantity,
        prenom: formData.prenom,
        telephone: formData.telephone,
        wilaya,
        commune,
        delivery_method: deliveryMethod,
        shipping_cost: livraison,
        subtotal: sousTotal,
        total,
        size: product.size,
        color: product.color,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      })

      if (!response.ok) throw new Error("Failed to create order")

      const result = await response.json()

      const orderDetailsForThankYou = {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || "",
          size: product.size || null,
          color: product.color || null,
        },
        quantity,
        items: [{
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || "",
          size: product.size || null,
          color: product.color || null,
          quantity,
        }],
        billing: {
          prenom: formData.prenom,
          telephone: formData.telephone,
          wilaya,
          commune,
          adresse: "",
        },
        delivery_method: deliveryMethod,
        shipping_cost: livraison,
        subtotal: sousTotal,
        total,
        event_id: result.event_id,
      }
      localStorage.setItem("lastOrder", JSON.stringify(orderDetailsForThankYou))

      sessionStorage.removeItem("purchase_tracked")

      router.push(`/thank-you?order=${result.order_number || result.order_id}`)
    } catch (error) {
      console.error("Order submission error:", error)
      alert(t("orderError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border-2 border-black rounded-2xl p-6 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Quantity Selector */}
        <div className="pb-4 border-b border-gray-200">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 block">
            {t("quantity")}
          </label>
          <div className="inline-flex items-center border-2 border-black rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-3 hover:bg-black hover:text-white transition-all duration-200 ease-out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-6 py-3 font-bold text-lg min-w-[4rem] text-center bg-gray-50">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-3 hover:bg-black hover:text-white transition-all duration-200 ease-out"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">
            {t("deliveryInfoSection")}
          </label>

          {/* Name */}
          <div className="relative group">
            <label className="absolute -top-2.5 start-3 px-2 bg-white text-xs font-medium text-gray-500 group-focus-within:text-black transition-colors duration-200">
              {t("firstName")} <span className="text-red-500">*</span>
            </label>
            <User className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors duration-200" />
            <input
              type="text"
              placeholder={t("namePlaceholder")}
              required
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              className="w-full ps-12 pe-4 py-4 border-2 border-gray-200 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:border-black hover:border-gray-400 transition-all duration-200 ease-out text-start"
            />
          </div>

          {/* Phone */}
          <div className="relative group">
            <label className="absolute -top-2.5 start-3 px-2 bg-white text-xs font-medium text-gray-500 group-focus-within:text-black transition-colors duration-200">
              {t("phone")} <span className="text-red-500">*</span>
            </label>
            <Phone className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors duration-200" />
            <input
              type="tel"
              placeholder="0XXXXXXXXX ou +213XXXXXXXXX"
              required
              value={formData.telephone}
              onChange={(e) => {
                setFormData({ ...formData, telephone: e.target.value })
                if (phoneError) setPhoneError("")
              }}
              className={`w-full ps-12 pe-4 py-4 border-2 rounded-xl text-sm font-medium placeholder:text-gray-400 focus:outline-none hover:border-gray-400 transition-all duration-200 ease-out text-start ${phoneError
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-black"
                }`}
            />
            {phoneError && <p className="text-red-500 text-xs mt-1 ms-1">{phoneError}</p>}
          </div>

          {/* Wilaya */}
          <div className="relative group">
            <label className="absolute -top-2.5 start-3 px-2 bg-white text-xs font-medium text-gray-500 group-focus-within:text-black transition-colors duration-200 z-10">
              {t("wilaya")} <span className="text-red-500">*</span>
            </label>
            <select
              value={wilaya}
              required
              onChange={(e) => { setWilaya(e.target.value); setCommune("") }}
              className="w-full ps-4 pe-12 py-4 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-black hover:border-gray-400 transition-all duration-200 ease-out appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[center_right_1rem] rtl:bg-[center_left_1rem] bg-no-repeat cursor-pointer text-start"
            >
              <option value="" className="text-gray-400">{t("selectWilayaOption")}</option>
              {ALGERIA_WILAYAS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          {/* Commune */}
          <div className="relative group">
            <label className="absolute -top-2.5 start-3 px-2 bg-white text-xs font-medium text-gray-500 group-focus-within:text-black transition-colors duration-200 z-10">
              {t("commune")} <span className="text-red-500">*</span>
            </label>
            <select
              value={commune}
              required
              onChange={(e) => setCommune(e.target.value)}
              disabled={!wilaya}
              className="w-full ps-4 pe-12 py-4 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-black hover:border-gray-400 transition-all duration-200 ease-out appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[center_right_1rem] rtl:bg-[center_left_1rem] bg-no-repeat cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-50 text-start"
            >
              <option value="" className="text-gray-400">{t("selectCommuneOption")}</option>
              {wilaya && ALGERIA_COMMUNES[wilaya]?.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Delivery Method Selection */}
        {isShippingEnabled && shippingConfig.allowMethodSelection && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gray-500" />
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {t("deliveryMethod")}
              </label>
              {shippingLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            </div>

            {shippingData && dynamicDeliveryMethods.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dynamicDeliveryMethods.map((method) => {
                  const isSelected = deliveryMethod === method.deliveryType
                  const isFree = method.isFree || (wilaya && isFreeShipping(sousTotal))

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setDeliveryMethod(method.deliveryType as DeliveryMethod)}
                      className={`relative p-4 rounded-xl border-2 text-start transition-all duration-200 ${isSelected
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 end-3 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <span className="text-xl">{method.deliveryType === 'stopdesk' ? '📦' : '🏠'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{method.title}</div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-400" />
                            <span className={`font-bold text-sm ${isFree ? 'text-green-600' : 'text-black'}`}>
                              {isFree ? t("free") : formatPrice(method.cost)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : wilaya && shippingLoading ? (
              <div className="text-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                <p className="text-xs text-gray-400 mt-2">{t("loadingRates")}</p>
              </div>
            ) : wilaya && !shippingData ? (
              <div className="text-center py-4 text-xs text-gray-500">
                <p>{t("ratesUnavailable")}</p>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-gray-400">
                <p>{t("selectWilayaPrompt")}</p>
              </div>
            )}

            {wilaya && shippingData && (
              <p className="text-xs text-gray-400 text-center">
                {t("deliveryTo", { wilaya, zone: shippingData.zoneName })} • {deliveryMethod === 'stopdesk' ? t("stopdesk") : t("domicile")}
              </p>
            )}
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              {t("subtotal")} ({quantity} {quantity > 1 ? t("articles") : t("article")})
            </span>
            <span className="font-medium">{formatPrice(sousTotal)}</span>
          </div>
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-500">{t("shipping")}</span>
            {isShippingEnabled ? (
              wilaya ? (
                isFreeShipping(sousTotal) ? (
                  <span className="text-green-600 font-medium">{t("free")}</span>
                ) : (
                  <span className="font-medium">{formatPrice(livraison)}</span>
                )
              ) : (
                <span className="text-gray-400 text-xs">{t("selectWilayaForShipping")}</span>
              )
            ) : (
              <span className="text-gray-400 text-xs">{shippingConfig.disabledMessage}</span>
            )}
          </div>
          <div className="text-xs text-gray-400">
            💵 {t("cod")}
          </div>
          <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-200">
            <span>{t("total")}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full bg-black text-white py-4 rounded-xl font-semibold text-base overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="relative z-10 flex items-center justify-center gap-3">
            <ShoppingBag className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t("submitting")}
              </span>
            ) : (
              <span>{t("orderNow")}</span>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </form>
    </div>
  )
}
