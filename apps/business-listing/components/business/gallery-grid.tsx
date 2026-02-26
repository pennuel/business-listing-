"use client"

import { useState } from "react"
import { ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react"

interface GalleryGridProps {
  /** Merged gallery URL strings from normalizeBusiness */
  images: string[]
  /** If true, show an "empty" placeholder when there are no images */
  showEmpty?: boolean
  emptyMessage?: string
}

/**
 * Responsive masonry-style gallery grid with a built-in lightbox.
 * Used on profile-content and window-content.
 */
export function GalleryGrid({ images, showEmpty = true, emptyMessage }: GalleryGridProps) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const prev = () =>
    setLightbox((i) => (i != null ? (i - 1 + images.length) % images.length : null))
  const next = () =>
    setLightbox((i) => (i != null ? (i + 1) % images.length : null))

  if (!images || images.length === 0) {
    if (!showEmpty) return null
    return (
      <div className="col-span-full py-14 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <ImageIcon className="h-6 w-6 text-gray-300" />
        </div>
        <p className="text-gray-400 font-medium text-sm">
          {emptyMessage ?? "No gallery images yet."}
        </p>
      </div>
    )
  }

  // Responsive grid: 2 cols by default, 3 on sm+
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((url, i) => (
          <button
            key={i}
            onClick={() => setLightbox(i)}
            className="aspect-square rounded-xl overflow-hidden border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <img
              src={url}
              alt={`Gallery image ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              className="absolute left-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); prev() }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Image */}
          <img
            src={images[lightbox]}
            alt={`Gallery image ${lightbox + 1}`}
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); next() }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
