import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Instagram } from "lucide-react"
import { siteConfig } from "@/lib/config"

export default function Footer() {
  const { contact, social, logo, copyright, name, description } = siteConfig

  return (
    <footer className="bg-white border-t border-[#E5DDD3]">
      {/* ── Brand Section ─────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        {/* Logo */}
        <Link href="/" className="inline-block mb-6 group" aria-label="Accueil">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-20 w-auto object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Brand Name */}
        <h2 className="font-playfair text-2xl md:text-3xl font-semibold tracking-wide text-[#2D2D2D] mb-6">
          {name}
        </h2>

        {/* Description */}
        <p className="text-[#5A5A5A] leading-relaxed text-sm md:text-base max-w-xl mx-auto mb-4">
          {description}
        </p>

        {/* Algerian Flag */}
        <span className="text-2xl" role="img" aria-label="Drapeau algérien">🇩🇿</span>
      </div>

      {/* ── Contact Section ───────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        <h3 className="font-playfair text-xl md:text-2xl font-semibold text-[#2D2D2D] text-center mb-8 tracking-wide">
          CONTACT
        </h3>

        <ul className="space-y-5 max-w-md mx-auto">
          {/* Email */}
          <li>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-4 text-[#4A4A4A] hover:text-[#2D2D2D] transition-colors duration-200 group"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F8F6F3] flex items-center justify-center group-hover:bg-[#EDEAE5] transition-colors duration-200">
                <Mail className="w-[18px] h-[18px] text-[#6B6B6B] group-hover:text-[#2D2D2D] transition-colors duration-200" />
              </span>
              <span className="text-sm md:text-base">mail:{contact.email}</span>
            </a>
          </li>

          {/* Instagram */}
          {social.instagram.url && (
            <li>
              <a
                href={social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-[#4A4A4A] hover:text-[#2D2D2D] transition-colors duration-200 group"
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F8F6F3] flex items-center justify-center group-hover:bg-[#EDEAE5] transition-colors duration-200">
                  <Instagram className="w-[18px] h-[18px] text-[#6B6B6B] group-hover:text-[#2D2D2D] transition-colors duration-200" />
                </span>
                <span className="text-sm md:text-base">Instagram: {social.instagram.handle}</span>
              </a>
            </li>
          )}

          {/* Address */}
          <li>
            <a
              href={contact.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-[#4A4A4A] hover:text-[#2D2D2D] transition-colors duration-200 group"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F8F6F3] flex items-center justify-center group-hover:bg-[#EDEAE5] transition-colors duration-200">
                <MapPin className="w-[18px] h-[18px] text-[#6B6B6B] group-hover:text-[#2D2D2D] transition-colors duration-200" />
              </span>
              <span className="text-sm md:text-base">Adresse : {contact.address}</span>
            </a>
          </li>

          {/* Phone */}
          <li>
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-4 text-[#4A4A4A] hover:text-[#2D2D2D] transition-colors duration-200 group"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F8F6F3] flex items-center justify-center group-hover:bg-[#EDEAE5] transition-colors duration-200">
                <Phone className="w-[18px] h-[18px] text-[#6B6B6B] group-hover:text-[#2D2D2D] transition-colors duration-200" />
              </span>
              <span className="text-sm md:text-base">tel:{contact.phoneDisplay}</span>
            </a>
          </li>
        </ul>
      </div>

      {/* ── Social Icons Row ──────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        <div className="flex items-center justify-center gap-5">
          {/* Facebook */}
          {social.facebook.url && (
            <a
              href={social.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style={{ backgroundColor: "#1877F2" }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          )}

          {/* Instagram */}
          {social.instagram.url && (
            <a
              href={social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #833AB4, #E4405F, #FCAF45)" }}
            >
              <Instagram className="w-6 h-6" />
            </a>
          )}

          {/* TikTok */}
          {social.tiktok.url && (
            <a
              href={social.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg bg-[#010101]"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          )}

          {/* WhatsApp / Phone */}
          {social.whatsapp?.url && (
            <a
              href={social.whatsapp.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style={{ backgroundColor: "#25D366" }}
            >
              <Phone className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6">
        <div className="border-t border-[#E5DDD3]" />
      </div>

      {/* ── Copyright Bar ─────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <p className="text-center text-sm text-[#6B6B6B] mb-2">
          © Copyright {name} {copyright.year} — Développé par
        </p>
        <p className="text-center">
          <a
            href="https://navigi.taplink.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[#2D2D2D] hover:text-[#4A4A4A] transition-colors duration-200"
          >
            Navigi Agency
          </a>
        </p>
      </div>
    </footer>
  )
}
