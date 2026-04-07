"use client"

import ColorSelector from "./color-selector"
import SizeSelector from "./size-selector"

interface AttributeSelectorProps {
    name: string
    slug: string
    options: string[]
    selectedValue: string
    availableOptions: string[]
    onSelect: (slug: string, value: string) => void
}

function isColorAttribute(slug: string) {
    return slug === "color" || slug === "couleur"
}

function isSizeAttribute(slug: string) {
    return slug === "size" || slug === "taille"
}

export default function AttributeSelector({
    name,
    slug,
    options,
    selectedValue,
    availableOptions,
    onSelect,
}: AttributeSelectorProps) {
    if (isColorAttribute(slug)) {
        return (
            <ColorSelector
                label={name}
                options={options}
                selectedValue={selectedValue}
                availableOptions={availableOptions}
                onSelect={(value) => onSelect(slug, value)}
            />
        )
    }

    if (isSizeAttribute(slug)) {
        return (
            <SizeSelector
                label={name}
                options={options}
                selectedValue={selectedValue}
                availableOptions={availableOptions}
                onSelect={(value) => onSelect(slug, value)}
            />
        )
    }

    return (
        <div className="space-y-3">
            <div className="text-sm font-medium">{name}</div>
            <div className="flex flex-wrap gap-2">
                {options.map((option) => {
                    const isSelected = selectedValue === option
                    const isAvailable = availableOptions.includes(option)

                    return (
                        <button
                            key={option}
                            onClick={() => onSelect(slug, option)}
                            className={`px-4 py-2 border rounded-full text-sm transition-colors ${isSelected
                                    ? "bg-foreground text-background border-foreground"
                                    : "border-border hover:border-foreground"
                                } ${isAvailable ? "opacity-100" : "opacity-40"}`}
                            aria-pressed={isSelected}
                            title={isAvailable ? option : `${option} (indisponible)`}
                        >
                            {option}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
