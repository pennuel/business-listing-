"use client"

import { Package, Clock, Tag } from "lucide-react"

interface Service {
  id?: any
  name?: string
  serviceName?: string
  description?: string
  serviceDescription?: string
  price?: number | string
  costing?: string
  currency?: string
  duration?: number
}

interface BusinessServicesProps {
  services: Service[]
  /** "card" = compact card row (profile/window), "shelf" = mini inline row (dashboard sidebar) */
  variant?: "card" | "shelf"
  /** maximum items to show — undefined means show all */
  limit?: number
  emptyMessage?: string
}

/**
 * Shared read-only display of a business's services.
 * Used on profile-content, window-content, and dashboard-content.
 */
export function BusinessServices({
  services,
  variant = "card",
  limit,
  emptyMessage = "No services listed yet.",
}: BusinessServicesProps) {
  // Normalise each service in case it comes pre-normalised or still in raw form
  const normalised = (services ?? []).map((s) => ({
    id:          s.id ?? s.name,
    name:        s.name ?? s.serviceName ?? "Unnamed service",
    description: s.description ?? s.serviceDescription ?? null,
    price:       s.costing != null ? Number(s.costing) : Number(s.price ?? 0),
    currency:    s.currency ?? "KES",
    duration:    s.duration ?? null,
  }))

  const visible = limit ? normalised.slice(0, limit) : normalised

  if (visible.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-xl text-muted-foreground gap-2">
        <Package className="h-8 w-8 opacity-20" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    )
  }

  if (variant === "shelf") {
    // Compact 1-line rows for dashboard sidebar
    return (
      <div className="grid gap-3">
        {visible.map((svc) => (
          <div
            key={svc.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div>
              <div className="font-medium text-sm">{svc.name}</div>
              {svc.duration && (
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {svc.duration} mins
                </div>
              )}
            </div>
            <div className="text-sm font-bold tabular-nums">
              {svc.currency} {svc.price.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Full card rows for profile / window
  return (
    <div className="grid gap-4">
      {visible.map((svc) => (
        <div
          key={svc.id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border bg-white hover:shadow-md transition-shadow"
        >
          {/* Icon + info */}
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{svc.name}</p>
              <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                {svc.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {svc.duration} mins
                  </span>
                )}
                {svc.description && (
                  <span className="truncate max-w-[200px]">{svc.description}</span>
                )}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="sm:text-right flex-shrink-0">
            <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">
              Price
            </div>
            <div className="text-lg font-black text-blue-600">
              {svc.currency} {svc.price.toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
