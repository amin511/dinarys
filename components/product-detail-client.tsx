"use client"

import { useState, useRef, TouchEvent, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Ruler, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice, siteConfig, getColorValue } from "@/lib/config"
import ProductCheckoutForm from "@/components/product-checkout-form"
import { fbEvent } from "@/components/facebook-pixel"

interface ProductImage {
  id: number
  src: string
  alt: string
}

interface ProductAttribute {
  id: number
  name: string
  options: string[]
}

interface VariationAttribute {
  id: number
  name: string
  option: string
}

interface ProductVariation {
  id: number
  price: string
  regular_price: string
  sale_price: string
  stock_status: string
  stock_quantity: number | null
  sku: string
  image: ProductImage | null
  attributes: VariationAttribute[]
}

interface Product {
  id: number
  name: string
  price: string
  regular_price: string
  description: string
  images: ProductImage[]
  attributes: ProductAttribute[]
  stock_status: string
  type?: string // 'simple' | 'variable' | 'grouped' | 'external'
}

interface RelatedProduct {
  id: number
  name: string
  price: string
  images: ProductImage[]
}

interface Category {
  id: number
  name: string
  slug: string
  count: number
}

interface ProductDetailClientProps {
  product: Product
  relatedProducts?: RelatedProduct[]
  categories?: Category[]
  variations?: ProductVariation[]
}

export default function ProductDetailClient({ product, relatedProducts = [], categories = [], variations = [] }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null)
  const router = useRouter();

  // Find matching variation when attributes are selected
  useEffect(() => {
    console.log("=== VARIATION DEBUG ===")
    console.log("Available variations:", variations)
    console.log("Selected Size:", selectedSize)
    console.log("Selected Color:", selectedColor)
    console.log("Product images:", product.images)

    if (variations.length === 0) return

    const matchingVariation = variations.find((variation) => {
      return variation.attributes.every((attr) => {
        const attrName = attr.name.toLowerCase()
        if (attrName === 'size' || attrName === 'taille') {
          return !selectedSize || attr.option === selectedSize
        }
        if (attrName === 'color' || attrName === 'couleur') {
          return !selectedColor || attr.option === selectedColor
        }
        return true
      })
    })

    setSelectedVariation(matchingVariation || null)
    console.log('Matching variation found:', matchingVariation)
    console.log('Variation image:', matchingVariation?.image)

    // Si la variation a une image, naviguer vers elle
    if (matchingVariation?.image?.src) {
      console.log("Looking for variation image in gallery...")

      // Vérifier si l'image existe dans la galerie du produit
      const variationImageIndex = product.images?.findIndex(
        (img) => img.src === matchingVariation.image?.src || img.id === matchingVariation.image?.id
      )

      if (variationImageIndex !== undefined && variationImageIndex >= 0) {
        // L'image existe dans la galerie, y naviguer
        setSelectedImageIndex(variationImageIndex)
        console.log("Image found in gallery, navigating to index:", variationImageIndex)
      } else {
        // L'image n'est pas dans la galerie, elle sera ajoutée au début (index 0)
        setSelectedImageIndex(0)
        console.log("Image not in gallery, will be added at index 0")
      }
    }
    console.log("=== END DEBUG ===")
  }, [selectedSize, selectedColor, variations, product.images])

  // Track ViewContent event on product page load
  useEffect(() => {
    console.log(product, "product details");
    fbEvent("ViewContent", {
      content_name: product.name,
      content_ids: [product.id.toString()],
      content_type: "product",
    })
  }, [product.id, product.name])

  // Get checkout mode from config
  const checkoutMode = siteConfig.checkoutMode
  const showForm = checkoutMode === "form" || checkoutMode === "both"
  const showCart = checkoutMode === "cart" || checkoutMode === "both"

  // Function to handle add to cart
  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert("Veuillez sélectionner une taille")
      return
    }

    if (colors.length > 0 && !selectedColor) {
      alert("Veuillez sélectionner une couleur")
      return
    }

    const newItem = {
      id: product.id,
      name: product.name,
      price: selectedVariation?.price || product.price,
      size: selectedSize,
      color: selectedColor,
      image: selectedVariation?.image?.src || mainImage,
      quantity: 1,
      variationId: selectedVariation?.id || null,
      sku: selectedVariation?.sku || null,
    }

    // Get existing cart items
    const existingCart = localStorage.getItem("cartItems")
    let cartItems = existingCart ? JSON.parse(existingCart) : []

    // Check if item with same id, size and color already exists
    const existingItemIndex = cartItems.findIndex(
      (item: any) => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
    )

    if (existingItemIndex > -1) {
      // Item exists, increment quantity
      cartItems[existingItemIndex].quantity += 1
    } else {
      // New item, add to cart
      cartItems.push(newItem)
    }

    // Save updated cart
    localStorage.setItem("cartItems", JSON.stringify(cartItems))

    // Also keep single item for backward compatibility
    localStorage.setItem("cartItem", JSON.stringify(newItem))

    // Track AddToCart event
    fbEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id.toString()],
      content_type: "product",
    })

    window.dispatchEvent(new Event("cartUpdated"))

    if (checkoutMode === "cart") {
      // If cart only mode, redirect based on addToCartRedirect config
      const redirectTo = siteConfig.addToCartRedirect
      if (redirectTo === "checkout") {
        router.push("/checkout")
      } else if (redirectTo === "cart") {
        router.push("/cart")
      } else {
        // "stay" - show confirmation without redirect
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 3000)
      }
    } else {
      // Show confirmation for "both" mode
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 3000)
    }
  }

  // Touch/swipe handling
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const minSwipeDistance = 50 // Minimum distance for a swipe

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current
    const isSwipe = Math.abs(distance) > minSwipeDistance

    if (isSwipe) {
      if (distance > 0) {
        // Swipe left -> next image
        goToNext()
      } else {
        // Swipe right -> previous image
        goToPrevious()
      }
    }
  }

  // Maximum thumbnails to show before "+X more"
  const MAX_VISIBLE_THUMBNAILS = 5

  // Get size attribute
  const sizeAttribute = product.attributes?.find(
    (attr) => attr.name.toLowerCase() === "size" || attr.name.toLowerCase() === "taille",
  )
  const sizes = sizeAttribute?.options || []

  // Get color attribute
  const colorAttribute = product.attributes?.find(
    (attr) => attr.name.toLowerCase() === "color" || attr.name.toLowerCase() === "couleur",
  )
  const colors = colorAttribute?.options || []

  // Get all images - inclure l'image de la variation si elle n'est pas dans la galerie
  const baseImages = product.images?.length > 0 ? product.images : [{ id: 0, src: "/placeholder.svg?height=600&width=600", alt: product.name }]

  // Vérifier si l'image de la variation existe dans la galerie
  const variationImage = selectedVariation?.image
  const variationImageInGallery = variationImage ? baseImages.some(
    (img) => img.src === variationImage.src || img.id === variationImage.id
  ) : true

  // Si l'image de la variation n'est pas dans la galerie, l'ajouter au début
  const productImages = (!variationImageInGallery && variationImage)
    ? [{ id: variationImage.id, src: variationImage.src, alt: variationImage.alt || product.name }, ...baseImages]
    : baseImages

  const mainImage = productImages[selectedImageIndex]?.src || "/placeholder.svg?height=600&width=600"

  // Calculate visible thumbn8ails and remaining count
  const visibleThumbnails = productImages.slice(0, MAX_VISIBLE_THUMBNAILS)
  const remainingCount = productImages.length - MAX_VISIBLE_THUMBNAILS

  // Navigation functions - simple and direct
  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))
  }

  // Direct thumbnail click
  const goToImage = (index: number) => {
    setSelectedImageIndex(index)
  }

  // Handle keyboard navigation in lightbox
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious()
    if (e.key === "ArrowRight") goToNext()
    if (e.key === "Escape") setShowLightbox(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        {/* Categories Sidebar */}
        {categories.length > 0 && (
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <h3
                className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 opacity-0 animate-fade-in-rise"
                style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
              >
                Catégories
              </h3>
              <nav className="space-y-1">
                {categories.map((category, index) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="flex items-center justify-between py-2 px-3 text-sm rounded-sm hover:bg-muted transition-colors group opacity-0 animate-fade-in-rise"
                    style={{ animationDelay: `${150 + index * 50}ms`, animationFillMode: 'forwards' }}
                  >
                    <span className="group-hover:text-foreground">{category.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted group-hover:bg-background px-2 py-0.5 rounded-full">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div
              className="space-y-4 opacity-0 animate-fade-in-rise"
              style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
            >
              {/* Main Image Slider with swipe support */}
              <div
                className="relative rounded-sm overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Slider container */}
                <div
                  className="flex transition-all duration-300 ease-out items-start"
                  style={{ transform: `translateX(-${selectedImageIndex * 100}%)` }}
                >
                  {productImages.map((image, index) => (
                    <div
                      key={`slider-${index}-${image.id}`}
                      className="w-full shrink-0 cursor-zoom-in"
                      onClick={() => setShowLightbox(true)}
                    >
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt || product.name}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto select-none pointer-events-none"
                        priority={index === 0}
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>

                {/* Navigation arrows - always visible */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-105"
                      aria-label="Image précédente"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); goToNext(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-105"
                      aria-label="Image suivante"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                  </>
                )}

                {/* Brand logo */}
                <div className="absolute top-4 left-4">
                  <Image
                    src={siteConfig.logo.src}
                    alt={siteConfig.logo.alt}
                    width={60}
                    height={60}
                    className="opacity-80"
                  />
                </div>
                {/* Image counter badge */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {selectedImageIndex + 1} / {productImages.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery - Grid Layout */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {visibleThumbnails.map((image, index) => (
                    <button
                      key={`thumb-${index}-${image.id}`}
                      onClick={() => goToImage(index)}
                      className={`relative aspect-[3/4] rounded-sm overflow-hidden transition-all duration-200 ${selectedImageIndex === index
                        ? "ring-2 ring-foreground ring-offset-2 opacity-100"
                        : "opacity-60 hover:opacity-100"
                        }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt || `${product.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                  {/* Show "+X more" button if there are more images */}
                  {remainingCount > 0 && (
                    <button
                      onClick={() => setShowLightbox(true)}
                      className="relative aspect-[3/4] rounded-sm overflow-hidden bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                    >
                      <span className="text-sm font-medium text-muted-foreground">
                        +{remainingCount}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>            {/* Product Details */}
            <div className="flex flex-col gap-6 font-sans">
              {/* Product Name */}
              <h1
                className="text-3xl md:text-4xl font-light text-balance opacity-0 animate-fade-in-rise"
                style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
              >
                {product.name}
              </h1>

              {/* Price */}
              <div
                className="flex items-baseline gap-3 opacity-0 animate-fade-in-rise"
                style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
              >
                <span className="text-2xl font-medium">
                  {formatPrice(Number.parseFloat(selectedVariation?.price || product.price))}
                </span>
                {(selectedVariation?.regular_price || product.regular_price) &&
                  Number.parseFloat(selectedVariation?.regular_price || product.regular_price) >
                  Number.parseFloat(selectedVariation?.price || product.price) && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(Number.parseFloat(selectedVariation?.regular_price || product.regular_price))}
                    </span>
                  )}
              </div>

              {/* Color Selection */}
              {colors.length > 0 && (
                <div
                  className="space-y-3 opacity-0 animate-fade-in-rise"
                  style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
                >
                  <div className="text-sm font-medium">Couleur {selectedColor && <span className="font-normal text-muted-foreground">: {selectedColor}</span>}</div>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color
                          ? "ring-2 ring-offset-2 ring-foreground border-foreground"
                          : "border-border hover:border-foreground"
                          }`}
                        style={{ backgroundColor: getColorValue(color) }}
                      >
                        <span className="sr-only">{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {sizes.length > 0 && (
                <div
                  className="space-y-3 opacity-0 animate-fade-in-rise"
                  style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
                >
                  <div className="text-sm font-medium">Taille</div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-2 border rounded-full text-sm transition-colors ${selectedSize === size
                          ? "bg-foreground text-background border-foreground"
                          : "border-border hover:border-foreground"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Guide */}
              <button
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
              >
                <Ruler className="w-4 h-4" />
                Guides des tailles
              </button>

              {/* Validation messages */}
              {(colors.length > 0 && !selectedColor) || (sizes.length > 0 && !selectedSize) ? (
                <div
                  className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg text-center opacity-0 animate-fade-in-rise"
                  style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
                >
                  {colors.length > 0 && !selectedColor && sizes.length > 0 && !selectedSize
                    ? "Veuillez sélectionner une couleur et une taille pour continuer"
                    : colors.length > 0 && !selectedColor
                      ? "Veuillez sélectionner une couleur pour continuer"
                      : "Veuillez sélectionner une taille pour continuer"}
                </div>
              ) : null}

              {/* Stock Status - Affiché après sélection des attributs */}
              {(sizes.length === 0 || selectedSize) && (colors.length === 0 || selectedColor) && (
                <div
                  className="opacity-0 animate-fade-in-rise"
                  style={{ animationDelay: '450ms', animationFillMode: 'forwards' }}
                >
                  {(() => {
                    const stockStatus = selectedVariation?.stock_status || product.stock_status
                    const stockQty = selectedVariation?.stock_quantity

                    if (stockStatus === "instock") {
                      return (
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          En stock {stockQty !== null && stockQty !== undefined && `(${stockQty} disponibles)`}
                        </div>
                      )
                    }
                    if (stockStatus === "outofstock") {
                      return (
                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          Rupture de stock
                        </div>
                      )
                    }
                    if (stockStatus === "onbackorder") {
                      return (
                        <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          Sur commande
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>
              )}

              {/* Checkout Section - Based on checkoutMode config */}
              {(sizes.length === 0 || selectedSize) && (colors.length === 0 || selectedColor) && (
                <div
                  className="space-y-4 opacity-0 animate-fade-in-rise"
                  style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
                >
                  {/* Add to Cart Button - shown for "cart" and "both" modes */}
                  {showCart && (
                    <div className="space-y-2">
                      <Button
                        size="lg"
                        variant={checkoutMode === "both" ? "outline" : "default"}
                        className="w-full rounded-full py-6 text-base"
                        onClick={handleAddToCart}
                        disabled={(selectedVariation?.stock_status || product.stock_status) === "outofstock"}
                      >
                        {addedToCart ? (
                          <>
                            <span className="text-green-600">✓</span> Ajouté au panier
                          </>
                        ) : (selectedVariation?.stock_status || product.stock_status) === "outofstock" ? (
                          "Rupture de stock"
                        ) : (
                          "Ajouter au panier"
                        )}
                      </Button>
                      {addedToCart && (
                        <div className="flex justify-center">
                          <Link
                            href="/cart"
                            className="text-sm text-muted-foreground hover:text-foreground underline"
                          >
                            Voir le panier →
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Separator for "both" mode */}
                  {checkoutMode === "both" && (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground uppercase">ou commander directement</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  )}

                  {/* Inline Checkout Form - shown for "form" and "both" modes */}
                  {showForm && (
                    <ProductCheckoutForm
                      product={{
                        id: product.id,
                        name: product.name,
                        price: selectedVariation?.price || product.price,
                        image: selectedVariation?.image?.src || mainImage,
                        size: selectedSize,
                        color: selectedColor,
                        variationId: selectedVariation?.id,
                      }}
                    />
                  )}
                </div>
              )}

              {/* Product Description */}
              <div className="pt-6 border-t border-border">
                <div
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Recommendations */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-border">
          <h2
            className="text-2xl font-light mb-8 text-center opacity-0 animate-fade-in-rise"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
              <Link
                key={relatedProduct.id}
                href={`/product/${relatedProduct.id}`}
                className="group opacity-0 animate-fade-in-rise"
                style={{ animationDelay: `${700 + index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="relative aspect-[3/4] bg-secondary rounded-sm overflow-hidden mb-3">
                  <Image
                    src={relatedProduct.images?.[0]?.src || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm font-medium line-clamp-2 group-hover:underline">
                  {relatedProduct.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatPrice(Number.parseFloat(relatedProduct.price))}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setShowLightbox(false)}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm">
            {selectedImageIndex + 1} / {productImages.length}
          </div>

          {/* Previous button */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 z-10 p-3 text-white hover:text-white transition-colors bg-white/20 hover:bg-white/30 rounded-full"
            aria-label="Image précédente"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Main lightbox image slider */}
          <div
            className="relative w-full max-w-[90vw] max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex transition-transform duration-300 ease-out items-center"
              style={{ transform: `translateX(-${selectedImageIndex * 100}%)` }}
            >
              {productImages.map((image, index) => (
                <div key={`lightbox-${index}-${image.id}`} className="w-full shrink-0 flex items-center justify-center">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt || product.name}
                    width={1200}
                    height={1600}
                    className="max-w-full max-h-[85vh] object-contain select-none pointer-events-none"
                    priority={index === selectedImageIndex}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 z-10 p-3 text-white hover:text-white transition-colors bg-white/20 hover:bg-white/30 rounded-full"
            aria-label="Image suivante"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Thumbnail strip at bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2">
            {productImages.map((image, index) => (
              <button
                key={`lightbox-thumb-${index}-${image.id}`}
                onClick={(e) => { e.stopPropagation(); goToImage(index); }}
                className={`relative shrink-0 w-16 h-20 rounded-sm overflow-hidden transition-all duration-200 ${selectedImageIndex === index
                  ? "ring-2 ring-white opacity-100"
                  : "opacity-50 hover:opacity-100"
                  }`}
              >
                <Image
                  src={image.src}
                  alt={image.alt || `${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
