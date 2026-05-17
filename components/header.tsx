"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Search, ShoppingBag, X, ChevronRight, ChevronDown } from "lucide-react"
import { siteConfig, navigationConfig } from "@/lib/config"

interface Category {
  id: number
  name: string
  slug: string
  parent: number
  count: number
}

// Simple header background (replaces heavy SVG watercolor filter for mobile performance)

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [activeTab, setActiveTab] = useState<"menu" | "categories">("menu")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const categoriesTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasFetchedCategoriesRef = useRef(false)
  const router = useRouter()
  const pathname = usePathname()

  // Transparent-to-white animation ONLY on the home page
  const isHomePage = pathname === '/'
  // When on home and not yet scrolled → icons must be white (dark hero image behind)
  const mobileIconClass = isHomePage && !isScrolled
    ? 'text-white drop-shadow-md hover:text-white/80'
    : 'text-[#4A4A4A] hover:text-[#1a1a1a]'
  // On non-home pages the header is always white → always show full nav
  const alwaysVisible = !isHomePage

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Init on mount
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
      setSearchTerm("")
      setIsMenuOpen(false)
      setIsSearchOpen(false)
    }
  }

  useEffect(() => {
    const checkCart = () => {
      const cartItems = localStorage.getItem("cartItems")
      if (cartItems) {
        const items = JSON.parse(cartItems)
        const totalCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0)
        setCartCount(totalCount)
      } else {
        setCartCount(0)
      }
    }

    checkCart()

    window.addEventListener("storage", checkCart)
    window.addEventListener("cartUpdated", checkCart)

    return () => {
      window.removeEventListener("storage", checkCart)
      window.removeEventListener("cartUpdated", checkCart)
    }
  }, [])

  // Fetch categories once on mount for desktop/mobile navigation dropdowns.
  useEffect(() => {
    if (hasFetchedCategoriesRef.current) return
    hasFetchedCategoriesRef.current = true

    const controller = new AbortController()

    const fetchCategories = async () => {
      setLoadingCategories(true)

      try {
        const response = await fetch("/api/categories", { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Categories API returned ${response.status}`)
        }

        const data = await response.json()

        if (Array.isArray(data)) {
          setCategories(data)
        } else {
          console.error("Unexpected categories payload:", data)
          setCategories([])
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error fetching categories:", err)
        }
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()

    return () => {
      controller.abort()
    }
  }, [])

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setIsCategoriesOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Get primary categories (parent = 0)
  const primaryCategories = categories.filter((cat) => cat.parent === 0)

  const closeMenu = () => setIsMenuOpen(false)

  const handleCategoriesEnter = () => {
    if (categoriesTimeoutRef.current) clearTimeout(categoriesTimeoutRef.current)
    setIsCategoriesOpen(true)
  }

  const handleCategoriesLeave = () => {
    categoriesTimeoutRef.current = setTimeout(() => {
      setIsCategoriesOpen(false)
    }, 150)
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50">
      {/*
        Background:
        - Home page  → transparent at top, white on scroll
        - Other pages → always white
      */}
      <div
        className={`absolute inset-0 z-[-1] transition-opacity duration-250 ${
          alwaysVisible || isScrolled
            ? 'opacity-100 bg-white border-b border-[#E5DDD3]/70 shadow-sm'
            : 'opacity-0'
        }`}
      />

      {navigationConfig.announcement.enabled && (
        <div
          className={`transition-all duration-200 overflow-hidden ${
            isScrolled || alwaysVisible
              ? 'max-h-0 opacity-0'
              : 'max-h-10 opacity-100 bg-primary/90 text-white text-center py-2 text-sm relative z-10'
          }`}
        >
          {navigationConfig.announcement.text}
        </div>
      )}

      {/* Inner container — same height on home & other pages */}
      <div className={`max-w-7xl mx-auto px-4 flex items-center relative z-10 transition-all duration-200 ${
        isScrolled || alwaysVisible ? 'h-[64px] lg:h-[72px]' : 'h-[76px] lg:h-[90px]'
      } ${
        /* On home: center logo with 3-col grid | On other pages: logo left, nav right */
        isHomePage
          ? 'lg:grid lg:grid-cols-[1fr_auto_1fr] justify-between'
          : 'justify-between gap-6'
      }`}>

        {/* Mobile hamburger — hidden on lg */}
        <button
          className={`transition-all duration-300 lg:hidden relative z-50 p-2 -ml-2 ${mobileIconClass}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* ── Desktop Navigation ──────── */}
        <nav className={`hidden lg:flex items-center gap-2 transition-all duration-200 ${
          alwaysVisible || isScrolled
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}>
          <DesktopNavLink href="/" label="Accueil" />
          <DesktopNavLink href="/a-propos" label="Qui est Dinarys" />

          {/* Categories dropdown */}
          <div
            ref={categoriesRef}
            className="relative"
            onMouseEnter={handleCategoriesEnter}
            onMouseLeave={handleCategoriesLeave}
          >
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium tracking-wide text-[#2D2D2D] transition-all duration-300 relative group overflow-hidden ${isCategoriesOpen ? "text-[#1a1a1a]" : ""
                }`}
            >
              <span className="relative z-10">Catégories</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 relative z-10 ${isCategoriesOpen ? "rotate-180" : ""
                  }`}
              />
              {/* Hand-drawn hover highlight */}
              <div className="absolute bottom-1 left-3 right-3 h-[8px] bg-amber-100/50 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[50%_20%_60%_30%/30%_50%_40%_60%] origin-left scale-x-0 group-hover:scale-x-100"></div>
            </button>

            {/* Dropdown panel — scrollable & responsive */}
            {isCategoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 max-h-[60vh] overflow-y-auto bg-[#FCFAF8] rounded-bl-2xl rounded-br-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-[#E5DDD3]/60 py-3 animate-in fade-in zoom-in-95 duration-300 z-50 overflow-hidden">
                {/* Sketchy border inside dropdown */}
                <div className="absolute inset-0 pointer-events-none border-[1.5px] border-amber-900/5 rounded-bl-2xl rounded-br-2xl [clip-path:polygon(1%_2%,98%_1%,99%_98%,2%_99%)]"></div>

                <Link
                  href="/products"
                  className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-[#2D2D2D] hover:bg-[#f4ebd8]/40 transition-colors relative z-10"
                  onClick={() => setIsCategoriesOpen(false)}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D2D2D]" />
                  Tous les Produits
                </Link>

                {loadingCategories ? (
                  <div className="px-5 py-3 space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 bg-[#E8DCCB]/50 animate-pulse rounded-md" />
                    ))}
                  </div>
                ) : (
                  primaryCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className="flex items-center justify-between px-5 py-2.5 text-sm text-[#5a5651] hover:text-[#2D2D2D] hover:bg-[#f4ebd8]/40 transition-all duration-200 group relative z-10"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-1 h-1 rounded-full bg-[#D5C5B3] group-hover:bg-[#8b7e6e] group-hover:scale-150 transition-all duration-300" />
                        {category.name}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#B0A8A0] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <DesktopNavLink href="/products" label="Nos Produits" />
        </nav>

        {/* Logo */}
        <Link
          href="/"
          className={`transition-all duration-200 ${
            isHomePage
              /* Home: absolutely centered when transparent, normal in grid when scrolled */
              ? isScrolled
                ? 'lg:relative lg:left-auto lg:translate-x-0 lg:justify-self-center scale-100'
                : 'absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:translate-x-0 lg:justify-self-center scale-105 lg:scale-125 drop-shadow-2xl'
              /* Other pages: normal flow, no scaling */
              : 'scale-100'
          }`}
        >
          <div className="relative">
            {/* White glow only on home transparent state */}
            <div
              className={`absolute inset-0 bg-white/20 blur-xl rounded-full transition-opacity duration-200 ${
                isHomePage && !isScrolled ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <Image
              src={siteConfig.logo.src}
              alt={siteConfig.logo.alt}
              width={siteConfig.logo.width}
              height={siteConfig.logo.height}
              className={`h-10 lg:h-12 w-auto max-w-[140px] lg:max-w-none object-contain transition-all duration-200 ${
                isHomePage && !isScrolled
                  ? 'brightness-0 invert filter'          /* white logo on dark hero */
                  : 'mix-blend-multiply dark:mix-blend-screen dark:invert' /* dark logo on white bg */
              }`}
              priority
            />
          </div>
        </Link>

        {/* Actions (right column) - MOBILE */}
        <div className="flex items-center gap-2 lg:hidden relative z-50">
          <button
            className={`transition-all duration-300 p-2 ${mobileIconClass}`}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>
          <Link href="/cart" className={`relative transition-all duration-300 p-2 group ${mobileIconClass}`}>
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#8b7e6e] text-white text-[10px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] w-[16px] h-[16px] flex items-center justify-center font-bold shadow-sm group-hover:bg-[#1a1a1a] transition-colors">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Actions (right column) - DESKTOP */}
        <div className={`hidden lg:flex items-center gap-5 justify-self-end relative z-50 transition-all duration-200 ${
          alwaysVisible || isScrolled
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}>
          <button
            className="transition-all duration-300 hover:scale-110 p-1 text-[#4A4A4A] hover:text-[#1a1a1a]"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>
          <Link href="/cart" className="relative p-1 transition-all duration-300 hover:scale-110 group text-[#4A4A4A] hover:text-[#1a1a1a]">
            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-[#8b7e6e] text-white text-[10px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] w-[18px] h-[18px] flex items-center justify-center font-bold shadow-sm group-hover:bg-[#1a1a1a] transition-colors">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search dropdown with sketchbook styling */}
      {isSearchOpen && (
        <form onSubmit={handleSearch} className="absolute w-full px-4 py-4 animate-in slide-in-from-top-2 fade-in duration-300 z-0">
          <div className="absolute inset-0 bg-[#FCFAF8]/95 backdrop-blur-md shadow-md border-b border-[#E5DDD3] z-[-1]"></div>
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b7e6e] transition-colors group-focus-within:text-[#1a1a1a]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher des produits..."
              autoFocus
              className="w-full pl-12 pr-4 py-3.5 bg-white/50 border border-[#E5DDD3] text-[#2D2D2D] text-sm placeholder:text-[#999] focus:outline-none focus:border-[#8b7e6e] focus:bg-white transition-all shadow-inner rounded-sm"
              style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }} // Sketchy border radius
            />
          </div>
        </form>
      )}

      {/* ── Mobile Sidebar ───────────────── */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in duration-300 lg:hidden"
            onClick={closeMenu}
          />

          {/* Sidebar */}
          <nav className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-[320px] bg-[#FCFAF8] shadow-[10px_0_30px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-left duration-500 overflow-y-auto flex flex-col lg:hidden border-r border-[#E5DDD3]/50">
            {/* Subtle watercolor texture in sidebar */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-[-1]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

            {/* Close button */}
            <div className="flex justify-end p-5">
              <button
                onClick={closeMenu}
                className="text-[#4A4A4A] hover:text-[#1a1a1a] transition-all hover:rotate-90 duration-300"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="px-6 pb-6">
              <div className="relative group">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher"
                  className="w-full pr-10 pl-4 py-3 bg-white/60 border border-[#E5DDD3] text-sm text-[#2D2D2D] placeholder:text-[#999] focus:outline-none focus:border-[#8b7e6e] transition-colors"
                  style={{ borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px' }}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-[#999] group-focus-within:text-[#8b7e6e] hover:text-[#1a1a1a] transition-colors" />
                </button>
              </div>
            </form>

            {/* Tabs: MENU / CATÉGORIES */}
            <div className="flex px-6 mb-2">
              <button
                onClick={() => setActiveTab("menu")}
                className={`flex-1 py-2 text-[11px] font-bold tracking-[0.2em] uppercase text-center transition-all duration-300 relative ${activeTab === "menu"
                  ? "text-[#1a1a1a]"
                  : "text-[#999] hover:text-[#4A4A4A]"
                  }`}
              >
                Menu
                {activeTab === "menu" && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#8b7e6e] rounded-full [clip-path:polygon(0_0,100%_10%,95%_100%,5%_90%)]"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`flex-1 py-2 text-[11px] font-bold tracking-[0.2em] uppercase text-center transition-all duration-300 relative ${activeTab === "categories"
                  ? "text-[#1a1a1a]"
                  : "text-[#999] hover:text-[#4A4A4A]"
                  }`}
              >
                Catégories
                {activeTab === "categories" && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-[#8b7e6e] rounded-full [clip-path:polygon(5%_10%,95%_0,100%_90%,0_100%)]"></span>
                )}
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-2">
              {activeTab === "menu" ? (
                /* ── MENU TAB ─────────────────────────── */
                <div className="py-2">
                  <SidebarLink href="/" label="ACCUEIL" onClick={closeMenu} />
                  <SidebarLink href="/a-propos" label="QUI EST NOUR" onClick={closeMenu} />
                  <SidebarLink href="/products" label="NOS PRODUITS" onClick={closeMenu} hasArrow />
                  <SidebarLink href="/products" label="NOUVELLE COLLECTION" onClick={closeMenu} />
                  <SidebarLink href="#about-contact" label="NOUS CONTACTER" onClick={closeMenu} />

                  {/* Social link */}
                  {siteConfig.social.instagram.url && (
                    <a
                      href={siteConfig.social.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between mx-4 px-2 py-4 text-xs font-bold tracking-wider text-[#4A4A4A] uppercase hover:text-[#1a1a1a] transition-all group border-b border-[#E5DDD3]/50 last:border-0"
                      onClick={closeMenu}
                    >
                      <span>INSTAGRAM</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#B0A8A0] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </a>
                  )}
                </div>
              ) : (
                /* ── CATÉGORIES TAB ───────────────────── */
                <div className="py-2">
                  {loadingCategories ? (
                    <div className="p-5 space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 bg-[#E8DCCB]/40 animate-pulse rounded-sm w-3/4" />
                      ))}
                    </div>
                  ) : primaryCategories.length > 0 ? (
                    <>
                      {/* All products */}
                      <Link
                        href="/products"
                        className="flex items-center justify-between mx-4 px-2 py-4 text-xs font-bold tracking-wider text-[#4A4A4A] uppercase hover:text-[#1a1a1a] transition-all group border-b border-[#E5DDD3]/50"
                        onClick={closeMenu}
                      >
                        <span>TOUS LES PRODUITS</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#B0A8A0] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>

                      {primaryCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.slug}`}
                          className="flex items-center justify-between mx-4 px-2 py-4 text-[11px] font-bold tracking-[0.1em] text-[#5a5651] uppercase hover:text-[#1a1a1a] transition-all group border-b border-[#E5DDD3]/50 last:border-0"
                          onClick={closeMenu}
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-1 h-1 bg-[#D5C5B3] rounded-full group-hover:scale-150 transition-transform" />
                            {category.name}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#B0A8A0] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </>
                  ) : (
                    <p className="px-6 py-8 text-sm text-[#999] text-center italic">
                      Aucune catégorie disponible
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Sketchy footer decoration */}
            <div className="p-6 mt-auto">
              <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,10 Q25,5 50,12 T100,8" fill="none" stroke="#E5DDD3" strokeWidth="1" />
                <path d="M0,14 Q30,18 60,10 T100,15" fill="none" stroke="#E5DDD3" strokeWidth="0.5" />
              </svg>
            </div>
          </nav>
        </>
      )}
    </header>
  )
}

/* ── Desktop Nav Link ────────────────────────────── */
function DesktopNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2 text-sm font-medium tracking-wide text-[#2D2D2D] transition-colors duration-300 group"
    >
      <span className="relative z-10">{label}</span>
      {/* Hand-drawn hover highlight */}
      <div className="absolute bottom-1 left-3 right-3 h-[8px] bg-amber-100/50 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[50%_20%_60%_30%/30%_50%_40%_60%] origin-left scale-x-0 group-hover:scale-x-100"></div>
    </Link>
  )
}

/* ── Sidebar Menu Link (Mobile) ──────────────────── */
function SidebarLink({
  href,
  label,
  onClick,
  hasArrow,
}: {
  href: string
  label: string
  onClick: () => void
  hasArrow?: boolean
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between mx-4 px-2 py-4 text-xs font-bold tracking-wider text-[#4A4A4A] uppercase hover:text-[#1a1a1a] transition-all group border-b border-[#E5DDD3]/50 last:border-0"
      onClick={onClick}
    >
      <span className="relative">
        {label}
        <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#8b7e6e]/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 [clip-path:polygon(0_0,100%_10%,95%_100%,5%_90%)]"></span>
      </span>
      {hasArrow && <ChevronRight className="w-3.5 h-3.5 text-[#B0A8A0] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
    </Link>
  )
}
