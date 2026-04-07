export interface ProductAttributeInput {
    id: number
    name: string
    options: string[]
}

export interface VariationAttributeInput {
    id: number
    name: string
    option: string
}

export interface ProductVariationInput {
    id: number
    price: string
    regular_price: string
    sale_price: string
    stock_status: string
    stock_quantity: number | null
    sku: string
    image: {
        id: number
        src: string
        alt?: string
    } | null
    attributes: VariationAttributeInput[]
}

export interface VariationOptionDefinition {
    slug: string
    name: string
    options: string[]
}

export interface NormalizedVariation extends ProductVariationInput {
    attributeMap: Record<string, string>
}

export function normalizeAttributeSlug(name: string): string {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase()
}
