"use client"

import { useState, useRef, TouchEvent, useEffect } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { Ruler, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/config"
import { useFormatPrice } from "@/lib/hooks/useFormatPrice"
import ProductCheckoutForm from "@/components/product-checkout-form"
import { fbEvent } from "@/components/facebook-pixel"
import { useAttributeSelection } from "@/lib/hooks/useAttributeSelection"
import AttributeSelector from "@/components/product-detail/attributes/attribute-selector"

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
  short_description?: string
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
  const t = useTranslations("products")
  const formatPrice = useFormatPrice()
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const router = useRouter();

  const {
    attributes,
    selectedAttributes,
    selectAttribute,
    matchingVariation,
    availableOptions,
    missingRequiredAttributes,
    combinationError,
    legacySelection,
  } = useAttributeSelection({
    productAttributes: product.attributes,
    variations,
  })

  const selectedVariation = matchingVariation as ProductVariation | null
  const selectedSize = legacySelection.size
  const selectedColor = legacySelection.color

  // Find matching variation when attributes are selected
  useEffect(() => {
    console.log("=== VARIATION DEBUG ===")
    console.log("Available variations:", variations)
    console.log("Selected Attributes:", selectedAttributes)
    console.log("Product images:", product.images)

    if (variations.length === 0) return

    console.log('Matching variation found:', selectedVariation)
    console.log('Variation image:', selectedVariation?.image)

    // Si la variation a une image, naviguer vers elle
    if (selectedVariation?.image?.src) {
      console.log("Looking for variation image in gallery...")

      // Vérifier si l'image existe dans la galerie du produit
      const variationImageIndex = product.images?.findIndex(
        (img) => img.src === selectedVariation.image?.src || img.id === selectedVariation.image?.id
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
  }, [selectedAttributes, variations, product.images, selectedVariation])

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
    if (missingRequiredAttributes.length > 0) {
      const names = missingRequiredAttributes.map((attribute) => attribute.name).join(", ")
      alert(t("pleaseSelect", { attrs: names }))
      return
    }

    const newItem = {
      id: product.id,
      name: product.name,
      price: selectedVariation?.price || product.price,
      size: selectedSize,
      color: selectedColor,
      attributes: selectedAttributes,
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

  const hasRequiredAttributes = missingRequiredAttributes.length > 0

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

  const handleOrderNowClick = () => {
    const target = document.getElementById("product-order-form")
    target?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 py-8 pb-28 md:pb-8">
      <div className="flex gap-8">
        {/* Categories Sidebar */}
        {categories.length > 0 && (
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <h3
                className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 opacity-0 animate-fade-in-rise"
                style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
              >
                {t("categories")}
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
          {product.short_description && (
            <div
              className="prose prose-sm max-w-2xl text-muted-foreground mb-8 opacity-0 animate-fade-in-rise"
              style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

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
                      className="relative w-full shrink-0 aspect-square cursor-zoom-in"
                      onClick={() => setShowLightbox(true)}
                    >
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt || product.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-contain select-none pointer-events-none"
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
                      aria-label={t("prevImage")}
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); goToNext(); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-105"
                      aria-label={t("nextImage")}
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
                        sizes="20vw"
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

              {/* Dynamic Attribute Selection */}
              {attributes.map((attribute, index) => (
                <div
                  key={attribute.slug}
                  className="opacity-0 animate-fade-in-rise"
                  style={{ animationDelay: `${350 + index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <AttributeSelector
                    name={attribute.name}
                    slug={attribute.slug}
                    options={attribute.options}
                    selectedValue={selectedAttributes[attribute.slug] || ""}
                    availableOptions={availableOptions[attribute.slug] || attribute.options}
                    onSelect={selectAttribute}
                  />
                </div>
              ))}

              {/* Size Guide */}
              {/* <button
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
              >
                <Ruler className="w-4 h-4" />
                {t("sizeGuide")}
              </button> */}

              <div id="product-order-form" className="scroll-mt-24 space-y-4">
                {/* Validation messages */}
                {hasRequiredAttributes || combinationError ? (
                  <div
                    className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg text-center opacity-0 animate-fade-in-rise"
                    style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
                  >
                    {combinationError || t("pleaseSelect", { attrs: missingRequiredAttributes.map((a) => a.name).join(", ") })}
                  </div>
                ) : null}

                {/* Stock Status - Affiché après sélection des attributs */}
                {!hasRequiredAttributes && (
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
                            {t("inStock")} {stockQty !== null && stockQty !== undefined && t("stockQty", { qty: stockQty })}
                          </div>
                        )
                      }
                      if (stockStatus === "outofstock") {
                        return (
                          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            {t("outOfStockStatus")}
                          </div>
                        )
                      }
                      if (stockStatus === "onbackorder") {
                        return (
                          <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            {t("onBackorder")}
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                )}

                {/* Checkout Section - Based on checkoutMode config */}
                {!hasRequiredAttributes && (
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
                              <span className="text-green-600">✓</span> {t("addedToCart")}
                            </>
                          ) : (selectedVariation?.stock_status || product.stock_status) === "outofstock" ? (
                            t("outOfStockStatus")
                          ) : (
                            t("addToCart")
                          )}
                        </Button>
                        {addedToCart && (
                          <div className="flex justify-center">
                            <Link
                              href="/cart"
                              className="text-sm text-muted-foreground hover:text-foreground underline"
                            >
                              {t("viewCart")}
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Separator for "both" mode */}
                    {checkoutMode === "both" && (
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground uppercase">{t("orOrderDirect")}</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    )}

                    {/* Inline Checkout Form - shown for "form" and "both" modes, hidden when out of stock */}
                    {showForm && (selectedVariation?.stock_status || product.stock_status) !== "outofstock" && (
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
              </div>

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
            {t("youMightAlsoLike")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
              <Link
                key={relatedProduct.id}
                href={`/product/${relatedProduct.id}` as `/product/${string}`}
                className="group opacity-0 animate-fade-in-rise"
                style={{ animationDelay: `${700 + index * 100}ms`, animationFillMode: 'forwards' }}
              >
                <div className="relative aspect-[3/4] bg-secondary rounded-sm overflow-hidden mb-3">
                  <Image
                    src={relatedProduct.images?.[0]?.src || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    fill
                    sizes="(max-width: 768px) 40vw, 200px"
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

      {showForm && (
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 animate-cta-enter">
          <Button
            size="lg"
            className="w-full rounded-full py-6 text-base shadow-xl shadow-black/10 transition-all duration-300 active:scale-95 hover:-translate-y-0.5 animate-cta-breathe"
            onClick={handleOrderNowClick}
          >
            {t("orderNow")}
          </Button>
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
            aria-label={t("close")}
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
            aria-label={t("prevImage")}
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
            aria-label={t("nextImage")}
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
                  sizes="64px"
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
