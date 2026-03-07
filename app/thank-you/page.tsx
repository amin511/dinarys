"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Package, MapPin, Phone, User, Truck, CreditCard, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { fbEvent } from "@/components/facebook-pixel"

interface OrderDetails {
  product: {
    id: number
    name: string
    price: string
    image: string
    size?: string
  }
  quantity: number
  items?: any[]
  billing: {
    prenom: string
    telephone: string
    wilaya: string
    commune: string
    adresse: string
  }
  delivery_method: string
  shipping_cost: number
  subtotal: number
  total: number
}

function ConfettiAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            backgroundColor: ['#0B5A8A', '#FFD700', '#FF6B6B', '#4ECDC4', '#9B59B6'][Math.floor(Math.random() * 5)],
          }}
        />
      ))}
      <style jsx>{`
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          opacity: 0;
          animation: confetti-fall 4s ease-in-out forwards;
        }
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            top: -10px;
            transform: rotate(0deg) translateX(0);
          }
          100% {
            opacity: 0;
            top: 100vh;
            transform: rotate(720deg) translateX(100px);
          }
        }
      `}</style>
    </div>
  )
}

function SuccessAnimation() {
  return (
    <div className="relative mb-8">
      {/* Cercles animés */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-green-100 animate-ping opacity-20" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-green-200 animate-pulse" />
      </div>

      {/* Icône principale */}
      <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
        <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
      </div>

      {/* Sparkles */}
      <Sparkles className="absolute top-0 right-1/4 w-6 h-6 text-yellow-400 animate-pulse" />
      <Sparkles className="absolute bottom-2 left-1/4 w-5 h-5 text-yellow-500 animate-pulse" style={{ animationDelay: '0.3s' }} />
    </div>
  )
}

function ThankYouContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order")
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [showConfetti, setShowConfetti] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Récupérer les détails de la commande depuis localStorage
    const savedOrder = localStorage.getItem("lastOrder")
    if (savedOrder) {
      const orderData = JSON.parse(savedOrder)
      setOrderDetails(orderData)

      // Eviter le double tracking en cas de refresh
      const purchaseTracked = sessionStorage.getItem("purchase_tracked")
      if (!purchaseTracked) {
        // Track Purchase event avec value et currency (obligatoires pour Facebook)
        fbEvent("Purchase", {
          value: orderData.total || 0,
          currency: "DZD",
          content_ids: orderData.items?.map((item: any) => item.id.toString()) || [orderData.product?.id?.toString()],
          content_name: orderData.product?.name || "",
          content_type: "product",
          num_items: orderData.quantity || 1,
        })
        sessionStorage.setItem("purchase_tracked", "true")
      }
    }

    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 100)

    // Arrêter les confettis après 4 secondes
    setTimeout(() => setShowConfetti(false), 4000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 py-8 px-4">
      {showConfetti && <ConfettiAnimation />}

      <div className={`max-w-2xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header de succès */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
          <SuccessAnimation />

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Félicitations !
          </h1>
          <p className="text-xl text-green-600 font-semibold mb-4">
            Votre commande a été envoyée avec succès
          </p>

          {orderNumber && (
            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0B5A8A] px-6 py-3 rounded-full font-medium">
              <Package className="w-5 h-5" />
              Commande N° {orderNumber}
            </div>
          )}
        </div>

        {/* Détails du produit */}
        {orderDetails?.product && (
          <div className={`bg-white rounded-2xl shadow-xl p-6 mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#0B5A8A]" />
              Votre commande
            </h2>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              {orderDetails.product.image && (
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={orderDetails.product.image}
                    alt={orderDetails.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{orderDetails.product.name}</h3>
                {orderDetails.product.size && (
                  <p className="text-sm text-gray-600">Taille: {orderDetails.product.size}</p>
                )}
                <p className="text-sm text-gray-600">Quantité: {orderDetails.quantity}</p>
                <p className="text-lg font-bold text-[#0B5A8A] mt-2">
                  {orderDetails.product.price} DA
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Informations de livraison */}
        {orderDetails?.billing && (
          <div className={`bg-white rounded-2xl shadow-xl p-6 mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '300ms' }}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#0B5A8A]" />
              Informations de livraison
            </h2>

            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Nom</p>
                  <p className="font-medium text-gray-900">{orderDetails.billing.prenom}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Téléphone</p>
                  <p className="font-medium text-gray-900">{orderDetails.billing.telephone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Adresse</p>
                  <p className="font-medium text-gray-900">
                    {orderDetails.billing.adresse}, {orderDetails.billing.commune}, {orderDetails.billing.wilaya}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Truck className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Mode de livraison</p>
                  <p className="font-medium text-gray-900">
                    {orderDetails.delivery_method === "domicile" ? "🏠 Livraison à domicile" : "📦 Stop Desk"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Récapitulatif des prix */}
        {orderDetails && (
          <div className={`bg-white rounded-2xl shadow-xl p-6 mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#0B5A8A]" />
              Récapitulatif
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{orderDetails.subtotal?.toLocaleString()} DA</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{orderDetails.shipping_cost === 0 ? "Gratuit" : `${orderDetails.shipping_cost?.toLocaleString()} DA`}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-[#0B5A8A]">{orderDetails.total?.toLocaleString()} DA</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-center gap-2 text-yellow-800">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm font-medium">Paiement à la livraison</span>
            </div>
          </div>
        )}

        {/* Étapes suivantes */}
        <div className={`bg-white rounded-2xl shadow-xl p-6 mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '500ms' }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Prochaines étapes
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Confirmation par téléphone</p>
                <p className="text-sm text-gray-600">Vous recevrez un appel pour confirmer votre commande</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Préparation de votre colis</p>
                <p className="text-sm text-gray-600">Votre commande sera préparée avec soin</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Livraison à votre adresse</p>
                <p className="text-sm text-gray-600">Votre colis sera livré à l'adresse indiquée</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
          <Link
            href="/"
            className="block w-full bg-gradient-to-r from-[#0B5A8A] to-[#0a4d75] hover:from-[#094A73] hover:to-[#083d5f] text-white py-4 rounded-xl font-semibold text-center transition-all shadow-lg hover:shadow-xl"
          >
            Continuer mes achats
          </Link>

          <p className="text-center text-sm text-gray-500 mt-4">
            Merci de votre confiance ! 💙
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B5A8A] border-t-transparent" />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  )
}
