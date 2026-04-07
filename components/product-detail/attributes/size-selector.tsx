"use client"

interface SizeSelectorProps {
    label: string
    options: string[]
    selectedValue: string
    availableOptions: string[]
    onSelect: (value: string) => void
}

export default function SizeSelector({
    label,
    options,
    selectedValue,
    availableOptions,
    onSelect,
}: SizeSelectorProps) {
    return (
        <div className="space-y-3">
            <div className="text-sm font-medium">{label}</div>
            <div className="flex flex-wrap gap-2">
                {options.map((size) => {
                    const isSelected = selectedValue === size
                    const isAvailable = availableOptions.includes(size)

                    return (
                        <button
                            key={size}
                            onClick={() => onSelect(size)}
                            className={`px-6 py-2 border rounded-full text-sm transition-colors ${isSelected
                                    ? "bg-foreground text-background border-foreground"
                                    : "border-border hover:border-foreground"
                                } ${isAvailable ? "opacity-100" : "opacity-40"}`}
                            aria-pressed={isSelected}
                            title={isAvailable ? size : `${size} (indisponible)`}
                        >
                            {size}
                        </button>
                    )
                }
                )}
            </div>
        </div>
    )
}
