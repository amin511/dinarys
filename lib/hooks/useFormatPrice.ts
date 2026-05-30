"use client"

import { useLocale } from "next-intl"
import { formatPrice } from "@/lib/config"

export function useFormatPrice() {
  const locale = useLocale()
  return (price: number) => formatPrice(price, locale)
}
