import {
    type NormalizedVariation,
    type ProductAttributeInput,
    type ProductVariationInput,
    type VariationOptionDefinition,
    normalizeAttributeSlug,
} from "@/lib/types/product-variations"

export function normalizeVariations(variations: ProductVariationInput[]): NormalizedVariation[] {
    return variations.map((variation) => {
        const attributeMap = variation.attributes.reduce<Record<string, string>>((acc, attribute) => {
            const slug = normalizeAttributeSlug(attribute.name)
            acc[slug] = attribute.option
            return acc
        }, {})

        return {
            ...variation,
            attributeMap,
        }
    })
}

export function collectVariationOptionDefinitions(
    productAttributes: ProductAttributeInput[] = [],
    normalizedVariations: NormalizedVariation[] = []
): VariationOptionDefinition[] {
    const map = new Map<string, VariationOptionDefinition>()

    for (const attribute of productAttributes) {
        const slug = normalizeAttributeSlug(attribute.name)
        if (!slug) continue

        const existing = map.get(slug)
        if (!existing) {
            map.set(slug, {
                slug,
                name: attribute.name,
                options: [...new Set(attribute.options || [])],
            })
            continue
        }

        existing.options = [...new Set([...existing.options, ...(attribute.options || [])])]
    }

    for (const variation of normalizedVariations) {
        for (const attribute of variation.attributes) {
            const slug = normalizeAttributeSlug(attribute.name)
            if (!slug) continue

            const existing = map.get(slug)
            if (!existing) {
                map.set(slug, {
                    slug,
                    name: attribute.name,
                    options: [attribute.option],
                })
                continue
            }

            if (!existing.options.includes(attribute.option)) {
                existing.options.push(attribute.option)
            }
        }
    }

    return Array.from(map.values()).filter((attribute) => attribute.options.length > 0)
}

export function hasCompatibleVariation(
    normalizedVariations: NormalizedVariation[],
    selectedAttributes: Record<string, string>
): boolean {
    const selectedEntries = Object.entries(selectedAttributes).filter(([, value]) => Boolean(value))
    if (selectedEntries.length === 0) return true

    return normalizedVariations.some((variation) =>
        selectedEntries.every(([slug, value]) => variation.attributeMap[slug] === value)
    )
}

export function findMatchingVariation(
    normalizedVariations: NormalizedVariation[],
    selectedAttributes: Record<string, string>
): NormalizedVariation | null {
    const selectedEntries = Object.entries(selectedAttributes).filter(([, value]) => Boolean(value))

    const matches = normalizedVariations.filter((variation) =>
        selectedEntries.every(([slug, value]) => variation.attributeMap[slug] === value)
    )

    if (matches.length === 0) return null

    const inStock = matches.find((variation) => variation.stock_status === "instock")
    return inStock || matches[0]
}

export function getAvailableOptionsByAttribute(
    definitions: VariationOptionDefinition[],
    normalizedVariations: NormalizedVariation[],
    selectedAttributes: Record<string, string>
): Record<string, string[]> {
    const result: Record<string, string[]> = {}

    for (const definition of definitions) {
        result[definition.slug] = definition.options.filter((option) => {
            const candidateSelection = {
                ...selectedAttributes,
                [definition.slug]: option,
            }
            return hasCompatibleVariation(normalizedVariations, candidateSelection)
        })
    }

    return result
}

export function getLegacySizeColorSelection(selectedAttributes: Record<string, string>) {
    const entries = Object.entries(selectedAttributes)

    const sizeEntry = entries.find(([slug]) => slug === "size" || slug === "taille")
    const colorEntry = entries.find(([slug]) => slug === "color" || slug === "couleur")

    return {
        size: sizeEntry?.[1] || "",
        color: colorEntry?.[1] || "",
    }
}
