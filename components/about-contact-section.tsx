import Image from "next/image"
import { Mail, Phone, MapPin, Instagram } from "lucide-react"
import { siteConfig } from "@/lib/config"

export default function AboutContactSection() {
  const { contact, social, logo } = siteConfig

  return (
    <section id="about-contact" className="py-16 px-6 bg-white">
      <div className="max-w-xl mx-auto text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={120}
            height={120}
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Brand Name */}
        <h2
          className="font-playfair text-2xl md:text-3xl font-semibold tracking-wider text-[#2D2D2D] mb-8"
        >
          NOUR CONFECTION
        </h2>

        {/* Description */}
        <p className="text-[#4A4A4A] leading-relaxed text-base md:text-lg mb-6 max-w-md mx-auto">
          Nour Confection propose des créations élégantes pour mariées et bébés, inspirées du
          patrimoine algérien et réalisées avec un savoir-faire artisanal pour sublimer les moments
          les plus précieux
        </p>

        {/* Algerian Flag */}
        <div className="text-4xl mb-12">🇩🇿</div>

        {/* Contact Section */}
        <h3
          className="font-playfair text-xl md:text-2xl font-semibold tracking-wider text-[#2D2D2D] mb-8"
        >
          CONTACT
        </h3>

        <div className="space-y-5 text-left max-w-sm mx-auto">
          {/* Email */}
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-4 text-[#4A4A4A] hover:text-[#2D2D2D] transition group"
          >
            <Mail className="w-5 h-5 text-[#6B6B6B] group-hover:text-[#2D2D2D] transition flex-shrink-0" />
            <span className="text-sm md:text-base">mail:{contact.email}</span>
          </a>

          {/* Instagram */}
          {social.instagram.url && (
            <a
              href={social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-[#4A4A4A] hover:text-[#2D2D2D] transition group"
            >
              <Instagram className="w-5 h-5 text-[#6B6B6B] group-hover:text-[#2D2D2D] transition flex-shrink-0" />
              <span className="text-sm md:text-base">Instagram: {social.instagram.handle}</span>
            </a>
          )}

          {/* Address */}
          <a
            href={contact.mapUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 text-[#4A4A4A] hover:text-[#2D2D2D] transition group"
          >
            <MapPin className="w-5 h-5 text-[#6B6B6B] group-hover:text-[#2D2D2D] transition flex-shrink-0" />
            <span className="text-sm md:text-base">Adresse : {contact.address}</span>
          </a>

          {/* Phone */}
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-4 text-[#4A4A4A] hover:text-[#2D2D2D] transition group"
          >
            <Phone className="w-5 h-5 text-[#6B6B6B] group-hover:text-[#2D2D2D] transition flex-shrink-0" />
            <span className="text-sm md:text-base">tel:{contact.phone}</span>
          </a>
        </div>
      </div>
    </section>
  )
}
