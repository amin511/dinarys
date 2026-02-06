import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react"
import { siteConfig, navigationConfig } from "@/lib/config"

export default function Footer() {
  const { contact, social, logo, copyright } = siteConfig
  const { footerNav } = navigationConfig

  return (
    <footer className="bg-white border-t border-[#E5DDD3]">
      {/* Top section with description */}
      <div className="border-b border-[#E5DDD3]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Brand description */}
            <div className="space-y-2">
              <Link href="/" className="inline-block">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-16 w-auto object-contain"
                />
              </Link>
              <p className="text-[#4A4A4A] leading-relaxed text-sm max-w-xl">
                Neyla Collection est une boutique en ligne dédiée à la mode féminine raffinée, spécialisée dans les robes d'hôtesse et les pièces traditionnelles. Notre mission est de proposer des pièces élégantes et modernes, tout en respectant l'authenticité de la tradition algérienne.
              </p>
              <p className="text-[#4A4A4A] leading-relaxed text-sm max-w-xl">
                Chaque création est confectionnée avec des tissus de haute qualité, des finitions soignées et une broderie professionnelle, pour garantir un rendu luxueux et durable.
              </p>
            </div>

            {/* Social links - large format */}
            <div className="flex flex-wrap gap-4 lg:justify-end">
              {social.instagram.url && (
                <a
                  href={social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-full text-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-white transition-all duration-300 shadow-sm"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
              )}
              {social.facebook.url && (
                <a
                  href={social.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-full text-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-white transition-all duration-300 shadow-sm"
                >
                  <Facebook className="w-5 h-5" />
                  <span className="text-sm font-medium">Facebook</span>
                </a>
              )}
              {social.tiktok.url && (
                <a
                  href={social.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-full text-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-white transition-all duration-300 shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  <span className="text-sm font-medium">TikTok</span>
                </a>
              )}
              {social.whatsapp?.url && (
                <a
                  href={social.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-full text-[#2D2D2D] hover:bg-[#2D2D2D] hover:text-white transition-all duration-300 shadow-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Links section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Quick links */}
          <div className="space-y-5">
            <h3 className="font-semibold text-[#2D2D2D] text-sm uppercase tracking-widest">{footerNav.shop.title}</h3>
            <ul className="space-y-3">
              {footerNav.shop.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#4A4A4A] hover:text-[#2D2D2D] transition text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div className="space-y-5">
            <h3 className="font-semibold text-[#2D2D2D] text-sm uppercase tracking-widest">{footerNav.support.title}</h3>
            <ul className="space-y-3">
              {footerNav.support.links.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4A4A4A] hover:text-[#2D2D2D] transition text-sm"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a href={link.href} className="text-[#4A4A4A] hover:text-[#2D2D2D] transition text-sm">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h3 className="font-semibold text-[#2D2D2D] text-sm uppercase tracking-widest">Contact</h3>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-[#4A4A4A] hover:text-[#2D2D2D] transition text-sm">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Phone className="w-4 h-4" />
                  </div>
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-[#4A4A4A] hover:text-[#2D2D2D] transition text-sm">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <Mail className="w-4 h-4" />
                  </div>
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#4A4A4A] hover:text-[#2D2D2D] transition text-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <MapPin className="w-4 h-4" />
                  </div>
                  {contact.address}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E5DDD3]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm text-[#6B6B6B]">
            © {copyright.year} {siteConfig.name}. {copyright.text}
          </p>
        </div>
      </div>
    </footer>
  )
}
