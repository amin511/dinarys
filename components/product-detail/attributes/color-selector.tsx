"use client"

import { getColorValue } from "@/lib/config"

interface ColorSelectorProps {
    label: string
    options: string[]
    selectedValue: string
    availableOptions: string[]
    onSelect: (value: string) => void
}

export default function ColorSelector({
    label,
    options,
    selectedValue,
    availableOptions,
    onSelect,
}: ColorSelectorProps) {
    return (
        <div className="space-y-3">
            <div className="text-sm font-medium">
                {label}
                {selectedValue && (
                    <span className="font-normal text-muted-foreground"> : {selectedValue}</span>
                )}
            </div>
            <div className="flex flex-wrap gap-2">
                {options.map((color) => {
                    const isAvailable = availableOptions.includes(color)
                    const isSelected = selectedValue === color

                    return (
                        <button
                            key={color}
                            onClick={() => onSelect(color)}
                            title={isAvailable ? color : `${color} (indisponible)`}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${isSelected
                                    ? "ring-2 ring-offset-2 ring-foreground border-foreground"
                                    : "border-border hover:border-foreground"
                                } ${isAvailable ? "opacity-100" : "opacity-40"}`}
                            style={{ backgroundColor: getColorValue(color) }}
                            aria-pressed={isSelected}
                        >
                            <span className="sr-only">{color}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
