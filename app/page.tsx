import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import VideoSection from "@/components/video-section"
import ProductsSectionServer from "@/components/products-section-server"
import AboutBrandSection from "@/components/about-brand-section"
import BrandBanner from "@/components/brand-banner"
import AboutContactSection from "@/components/about-contact-section"
import Footer from "@/components/footer"
import { Suspense } from "react"

// Full SSG: No revalidation, static content only
export const revalidate = false

function ProductsLoading() {
  return (
    <section id="products" className="max-w-7xl mx-auto border-t border-border text-3xl py-16 px-4 scroll-mt-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-light text-foreground mt-0 text-xl">Nos Produits</h2>
        <span className="text-sm text-muted-foreground underline underline-offset-4">VOIR TOUT</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-muted rounded-sm mb-4" />
            <div className="h-4 bg-muted rounded mb-2" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AboutBrandSection />
      <VideoSection />
      <Suspense fallback={<ProductsLoading />}>
        <ProductsSectionServer />
      </Suspense>
      {/* <BrandBanner /> */}
      {/* <AboutContactSection /> */}
      <Footer />
    </main>
  )
}
