import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import IngredientsSection from "@/components/ingredients-section"
import ProductsSectionServer from "@/components/products-section-server"
import AboutBrandSection from "@/components/about-brand-section"
import Footer from "@/components/footer"
import { Suspense } from "react"

export const dynamic = "force-static"

function ProductsLoading() {
  return (
    <section id="products" className="max-w-7xl mx-auto border-t border-border text-3xl py-16 px-4 scroll-mt-20">
      <div className="flex items-center justify-between mb-8">
        <div className="h-6 bg-muted rounded w-32 animate-pulse" />
        <div className="h-4 bg-muted rounded w-16 animate-pulse" />
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

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AboutBrandSection />
      <Suspense fallback={<ProductsLoading />}>
        <ProductsSectionServer locale={locale} />
      </Suspense>
      <IngredientsSection />
      <Footer />
    </main>
  )
}
