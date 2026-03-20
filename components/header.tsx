"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Menu, Search, ShoppingBag, X, ChevronRight, ChevronDown } from "lucide-react"
import { siteConfig, navigationConfig } from "@/lib/config"

interface Category {
  id: number
  name: string
  slug: string
  parent: number
  count: number
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [activeTab, setActiveTab] = useState<"menu" | "categories">("menu")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const categoriesTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

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

  // Fetch categories on mount (needed for desktop dropdown)
  useEffect(() => {
    if (categories.length === 0 && !loadingCategories) {
      setLoadingCategories(true)
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setCategories(data)
          }
        })
        .catch((err) => console.error("Error fetching categories:", err))
        .finally(() => setLoadingCategories(false))
    }
  }, [categories.length, loadingCategories])

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
    <header className="border-b bg-white border-border bg-background sticky top-0 z-40">
      {navigationConfig.announcement.enabled && (
        <div className="bg-secondary text-white text-center py-2 text-sm">
          {navigationConfig.announcement.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 h-[80px] py-4 flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]">
        {/* Mobile hamburger — hidden on lg */}
        <button
          className="text-foreground hover:text-accent transition-colors lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* ── Desktop Navigation (left column) ──────── */}
        <nav className="hidden lg:flex items-center gap-1">
          <DesktopNavLink href="/" label="Accueil" />
          <DesktopNavLink href="/a-propos" label="Qui est Nour" />

          {/* Categories dropdown */}
          <div
            ref={categoriesRef}
            className="relative"
            onMouseEnter={handleCategoriesEnter}
            onMouseLeave={handleCategoriesLeave}
          >
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium tracking-wide text-[#2D2D2D] rounded-lg transition-all duration-200 hover:bg-[#F8F6F3] hover:text-[#1a1a1a] ${
                isCategoriesOpen ? "bg-[#F8F6F3] text-[#1a1a1a]" : ""
              }`}
            >
              Catégories
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isCategoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown panel — scrollable & responsive */}
            {isCategoriesOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 max-h-[60vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-[#E5DDD3]/60 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                <Link
                  href="/products"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#2D2D2D] hover:bg-[#F8F6F3] transition-colors"
                  onClick={() => setIsCategoriesOpen(false)}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2D2D2D]" />
                  Tous les Produits
                </Link>

                {loadingCategories ? (
                  <div className="px-4 py-3 space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-4 bg-[#F0EBE4] animate-pulse rounded" />
                    ))}
                  </div>
                ) : (
                  primaryCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-[#4A4A4A] hover:bg-[#F8F6F3] hover:text-[#2D2D2D] transition-colors group"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B0A8A0] group-hover:bg-[#2D2D2D] transition-colors" />
                        {category.name}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#B0A8A0] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <DesktopNavLink href="/products" label="Nos Produits" />
        </nav>

        {/* Logo (center column — always centered) */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:translate-x-0 lg:justify-self-center">
          <Image
            src={siteConfig.logo.src}
            alt={siteConfig.logo.alt}
            width={siteConfig.logo.width}
            height={siteConfig.logo.height}
            className="h-12 w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
            priority
          />
        </Link>

        {/* Actions (right column) */}
        <div className="flex items-center gap-4 lg:justify-self-end">
          <button
            className="text-foreground hover:text-accent transition-colors"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link href="/cart" className="relative">
            <ShoppingBag className="w-5 h-5 text-foreground hover:text-accent transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {isSearchOpen && (
        <form onSubmit={handleSearch} className="border-t border-border px-4 py-4 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher des produits..."
              autoFocus
              className="w-full pl-10 pr-4 py-3 border border-border rounded-sm bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </form>
      )}

      {/* ── Mobile Sidebar (unchanged) ───────────────── */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 animate-in fade-in duration-200 lg:hidden"
            onClick={closeMenu}
          />

          {/* Sidebar */}
          <nav className="fixed top-0 left-0 h-full w-80 bg-white z-50 animate-in slide-in-from-left duration-300 overflow-y-auto flex flex-col lg:hidden">

            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeMenu}
                className="text-[#2D2D2D] hover:text-secondary transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="px-5 pb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher des produits"
                  className="w-full pr-10 pl-4 py-2.5 border border-[#E5DDD3] text-sm text-[#2D2D2D] placeholder:text-[#999] focus:outline-none focus:border-[#2D2D2D] transition-colors"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-[#999] hover:text-[#2D2D2D] transition-colors" />
                </button>
              </div>
            </form>

            {/* Tabs: MENU / CATÉGORIES */}
            <div className="flex border-b border-[#E5DDD3]">
              <button
                onClick={() => setActiveTab("menu")}
                className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase text-center transition-colors ${
                  activeTab === "menu"
                    ? "text-[#2D2D2D] border-b-2 border-[#2D2D2D]"
                    : "text-[#999] hover:text-[#2D2D2D]"
                }`}
              >
                Menu
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase text-center transition-colors ${
                  activeTab === "categories"
                    ? "text-[#2D2D2D] border-b-2 border-[#2D2D2D]"
                    : "text-[#999] hover:text-[#2D2D2D]"
                }`}
              >
                Catégories
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "menu" ? (
                /* ── MENU TAB ─────────────────────────── */
                <div>
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
                      className="flex items-center justify-between px-5 py-4 text-xs font-bold tracking-wider text-[#2D2D2D] uppercase border-b border-[#E5DDD3] hover:text-secondary transition-colors"
                      onClick={closeMenu}
                    >
                      INSTAGRAM
                    </a>
                  )}
                </div>
              ) : (
                /* ── CATÉGORIES TAB ───────────────────── */
                <div>
                  {loadingCategories ? (
                    <div className="p-5 space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-5 bg-[#F0EBE4] animate-pulse rounded" />
                      ))}
                    </div>
                  ) : primaryCategories.length > 0 ? (
                    <>
                      {/* All products */}
                      <Link
                        href="/products"
                        className="flex items-center justify-between px-5 py-4 text-xs font-bold tracking-wider text-[#2D2D2D] uppercase border-b border-[#E5DDD3] hover:text-secondary transition-colors"
                        onClick={closeMenu}
                      >
                        TOUS LES PRODUITS
                      </Link>

                      {primaryCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.slug}`}
                          className="flex items-center justify-between px-5 py-4 text-xs font-bold tracking-wider text-[#2D2D2D] uppercase border-b border-[#E5DDD3] hover:text-secondary transition-colors"
                          onClick={closeMenu}
                        >
                          <span>{category.name}</span>
                          <ChevronRight className="w-4 h-4 text-[#B0A8A0]" />
                        </Link>
                      ))}
                    </>
                  ) : (
                    <p className="px-5 py-4 text-sm text-[#999]">
                      Aucune catégorie disponible
                    </p>
                  )}
                </div>
              )}
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
      className="px-4 py-2 text-sm font-medium tracking-wide text-[#2D2D2D] rounded-lg transition-all duration-200 hover:bg-[#F8F6F3] hover:text-[#1a1a1a]"
    >
      {label}
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
      className="flex items-center justify-between px-5 py-4 text-xs font-bold tracking-wider text-[#2D2D2D] uppercase border-b border-[#E5DDD3] hover:text-secondary transition-colors"
      onClick={onClick}
    >
      <span>{label}</span>
      {hasArrow && <ChevronRight className="w-4 h-4 text-[#B0A8A0]" />}
    </Link>
  )
}
