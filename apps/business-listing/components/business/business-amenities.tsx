"use client"

import { Sparkles } from "lucide-react"

interface BusinessAmenitiesProps {
  amenities: string[]
  /** "pills" = colourful pill badges (profile/window), "list" = compact dot list (dashboard) */
  variant?: "pills" | "list"
  emptyMessage?: string
}

/**
 * Shared read-only display of a business's amenities / perks.
 * Used on profile-content, window-content, and dashboard-content.
 */
export function BusinessAmenities({
  amenities,
  variant = "pills",
  emptyMessage,
}: BusinessAmenitiesProps) {
  const items = amenities ?? []

  if (items.length === 0) {
    if (!emptyMessage) return null
    return (
      <p className="text-sm text-muted-foreground italic">{emptyMessage}</p>
    )
  }

  if (variant === "list") {
    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((a) => (
          <span
            key={a}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium"
          >
            <span className="h-1 w-1 rounded-full bg-primary/50" />
            {a}
          </span>
        ))}
      </div>
    )
  }

  // Pills — full colour, used on profile & window
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((a) => (
        <span
          key={a}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <Sparkles className="h-3 w-3 opacity-60" />
          {a}
        </span>
      ))}
    </div>
  )
}
