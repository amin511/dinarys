"use client"

import { useMemo, useState } from "react"
import {
    collectVariationOptionDefinitions,
    findMatchingVariation,
    getAvailableOptionsByAttribute,
    getLegacySizeColorSelection,
    hasCompatibleVariation,
    normalizeVariations,
} from "@/lib/services/variation-matcher"
import type {
    ProductAttributeInput,
    ProductVariationInput,
    VariationOptionDefinition,
} from "@/lib/types/product-variations"

interface UseAttributeSelectionParams {
    productAttributes: ProductAttributeInput[]
    variations: ProductVariationInput[]
}

export function useAttributeSelection({ productAttributes, variations }: UseAttributeSelectionParams) {
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
    const [combinationError, setCombinationError] = useState("")

    const normalizedVariations = useMemo(() => normalizeVariations(variations), [variations])

    const attributes = useMemo<VariationOptionDefinition[]>(
        () => collectVariationOptionDefinitions(productAttributes, normalizedVariations),
        [productAttributes, normalizedVariations]
    )

    const matchingVariation = useMemo(
        () => findMatchingVariation(normalizedVariations, selectedAttributes),
        [normalizedVariations, selectedAttributes]
    )

    const availableOptions = useMemo(
        () => getAvailableOptionsByAttribute(attributes, normalizedVariations, selectedAttributes),
        [attributes, normalizedVariations, selectedAttributes]
    )

    const requiredAttributes = useMemo(() => {
        if (normalizedVariations.length === 0) return []
        return attributes.filter((attribute) => attribute.options.length > 0)
    }, [attributes, normalizedVariations.length])

    const missingRequiredAttributes = useMemo(
        () => requiredAttributes.filter((attribute) => !selectedAttributes[attribute.slug]),
        [requiredAttributes, selectedAttributes]
    )

    const legacySelection = useMemo(
        () => getLegacySizeColorSelection(selectedAttributes),
        [selectedAttributes]
    )

    const selectAttribute = (slug: string, value: string) => {
        const nextSelection = {
            ...selectedAttributes,
            [slug]: selectedAttributes[slug] === value ? "" : value,
        }

        if (
            normalizedVariations.length > 0 &&
            !hasCompatibleVariation(normalizedVariations, nextSelection)
        ) {
            setCombinationError("Cette combinaison n'est pas disponible. Veuillez choisir une autre option.")
        } else {
            setCombinationError("")
        }

        setSelectedAttributes(nextSelection)
    }

    return {
        attributes,
        selectedAttributes,
        selectAttribute,
        matchingVariation,
        availableOptions,
        missingRequiredAttributes,
        combinationError,
        legacySelection,
    }
}
