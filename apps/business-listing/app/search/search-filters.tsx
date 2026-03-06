"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Search,
  SlidersHorizontal,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Tag,
  DollarSign,
  Star,
  Clock,
  CircleDot,
} from "lucide-react"

// ─── Search prompt ──────────────────────────────────────────────────────────

export function SearchPromptBox({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [query])

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query) params.set("q", query)
    else params.delete("q")
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="w-full bg-white shadow-xl shadow-blue-900/10 border rounded-3xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
      <form onSubmit={handleSearch}>
        <div className="p-3 flex items-end relative">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Describe what you're looking for... (e.g. A plumber in Nairobi)"
            className="w-full resize-none bg-transparent outline-none py-3 px-4 text-gray-900 placeholder:text-gray-400 min-h-[56px] max-h-[200px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSearch()
              }
            }}
          />
          <Button
            type="submit"
            className="rounded-2xl ml-2 w-12 h-12 p-0 shrink-0 bg-blue-600 hover:bg-blue-700 shadow-md self-end mb-1 transition-all active:scale-95"
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        </div>
      </form>
    </div>
  )
}

// ─── Shared filter logic ────────────────────────────────────────────────────

function useFilterState({
  initialCategories,
  initialLocations,
  initialOpenNow,
}: {
  initialCategories: string[]
  initialLocations: string[]
  initialOpenNow: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const getArrayParam = (key: string): string[] => searchParams.getAll(key)

  const categoryArray =
    getArrayParam("category").length
      ? getArrayParam("category")
      : initialCategories
  const locationArray =
    getArrayParam("location").length
      ? getArrayParam("location")
      : initialLocations
  const priceArray = getArrayParam("price")
  const ratingArray = getArrayParam("rating")
  const availabilityArray = getArrayParam("availability")
  const openNow =
    searchParams.get("openNow") === "true" || initialOpenNow

  const hasAnyActive =
    categoryArray.length > 0 ||
    locationArray.length > 0 ||
    priceArray.length > 0 ||
    ratingArray.length > 0 ||
    availabilityArray.length > 0 ||
    openNow

  const totalActiveCount =
    categoryArray.length +
    locationArray.length +
    priceArray.length +
    ratingArray.length +
    availabilityArray.length +
    (openNow ? 1 : 0)

  const toggle = (key: string, option: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.getAll(key)
    params.delete(key)
    if (current.includes(option)) {
      current.filter((v) => v !== option).forEach((v) => params.append(key, v))
    } else {
      ;[...current, option].forEach((v) => params.append(key, v))
    }
    params.delete("page")
    router.push(`/search?${params.toString()}`)
  }

  const toggleBool = (key: string, value: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, "true")
    else params.delete(key)
    params.delete("page")
    router.push(`/search?${params.toString()}`)
  }

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString())
    ;["category", "location", "openNow", "price", "rating", "availability"].forEach(
      (k) => params.delete(k)
    )
    router.push(`/search?${params.toString()}`)
  }

  return {
    categoryArray,
    locationArray,
    priceArray,
    ratingArray,
    availabilityArray,
    openNow,
    hasAnyActive,
    totalActiveCount,
    toggle,
    toggleBool,
    clearAll,
  }
}

// ─── Desktop sidebar section ────────────────────────────────────────────────

function SidebarSection({
  title,
  icon,
  options,
  selected,
  filterKey,
  onToggle,
}: {
  title: string
  icon: React.ReactNode
  options: string[]
  selected: string[]
  filterKey: string
  onToggle: (key: string, opt: string) => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  if (!options || options.length === 0) return null

  return (
    <div className="border-b border-gray-100 pb-4 last:border-0">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {icon}
          {title}
          {selected.length > 0 && (
            <span className="text-[10px] font-bold bg-blue-600 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {selected.length}
            </span>
          )}
        </span>
        {collapsed ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {!collapsed && (
        <div className="flex flex-col gap-1">
          {options.map((opt) => {
            const checked = selected.includes(opt)
            return (
              <label
                key={opt}
                className="flex items-center gap-3 px-1 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group/item"
                onClick={(e) => {
                  e.preventDefault()
                  onToggle(filterKey, opt)
                }}
              >
                <div
                  className={`flex-shrink-0 flex items-center justify-center h-4.5 w-4.5 h-[18px] w-[18px] rounded border transition-colors ${
                    checked
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300 bg-white group-hover/item:border-blue-400"
                  }`}
                >
                  {checked && <Check className="h-3 w-3 text-white" />}
                </div>
                <span
                  className={`text-sm leading-tight ${
                    checked ? "font-semibold text-gray-900" : "text-gray-600"
                  }`}
                >
                  {opt}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Desktop sidebar (full) ────────────────────────────────────────────────

export function SearchSidebar({
  categories = [],
  locations = [],
  extraFilters = {},
  initialCategories = [],
  initialLocations = [],
  initialOpenNow = false,
}: {
  categories?: string[]
  locations?: string[]
  extraFilters?: Record<string, string[]>
  initialCategories?: string[]
  initialLocations?: string[]
  initialOpenNow?: boolean
}) {
  const {
    categoryArray,
    locationArray,
    priceArray,
    ratingArray,
    availabilityArray,
    openNow,
    hasAnyActive,
    totalActiveCount,
    toggle,
    toggleBool,
    clearAll,
  } = useFilterState({ initialCategories, initialLocations, initialOpenNow })

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col">
      <div className="bg-white rounded-2xl border shadow-sm p-5 sticky top-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {totalActiveCount > 0 && (
              <span className="text-xs font-bold bg-blue-600 text-white rounded-full px-2 py-0.5">
                {totalActiveCount}
              </span>
            )}
          </h3>
          {hasAnyActive && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-col gap-0">
          {/* Open Now toggle */}
          <div className="border-b border-gray-100 pb-4">
            <label className="flex items-center justify-between py-2 cursor-pointer group">
              <span className="flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                <CircleDot className="h-4 w-4" />
                Open Now
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={openNow}
                onClick={() => toggleBool("openNow", !openNow)}
                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                  openNow ? "bg-green-500" : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    openNow ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </label>
          </div>

          <SidebarSection
            title="Category"
            icon={<Tag className="h-4 w-4" />}
            options={categories}
            selected={categoryArray}
            filterKey="category"
            onToggle={toggle}
          />
          <SidebarSection
            title="Location"
            icon={<MapPin className="h-4 w-4" />}
            options={locations}
            selected={locationArray}
            filterKey="location"
            onToggle={toggle}
          />
          <SidebarSection
            title="Price Range"
            icon={<DollarSign className="h-4 w-4" />}
            options={extraFilters.priceRanges || []}
            selected={priceArray}
            filterKey="price"
            onToggle={toggle}
          />
          <SidebarSection
            title="Availability"
            icon={<Clock className="h-4 w-4" />}
            options={extraFilters.availability || []}
            selected={availabilityArray}
            filterKey="availability"
            onToggle={toggle}
          />
          <SidebarSection
            title="Rating"
            icon={<Star className="h-4 w-4" />}
            options={extraFilters.ratings || []}
            selected={ratingArray}
            filterKey="rating"
            onToggle={toggle}
          />
        </div>
      </div>
    </aside>
  )
}

// ─── Mobile filter bar (compact pill row + sheet) ────────────────────────────

export function SearchFilterBar({
  initialCategories = [],
  initialLocations = [],
  initialOpenNow = false,
  categories = [],
  locations = [],
  extraFilters = {},
}: {
  initialCategories?: string[]
  initialLocations?: string[]
  initialOpenNow?: boolean
  categories?: string[]
  locations?: string[]
  extraFilters?: Record<string, string[]>
}) {
  const {
    categoryArray,
    locationArray,
    priceArray,
    ratingArray,
    availabilityArray,
    openNow,
    hasAnyActive,
    totalActiveCount,
    toggle,
    toggleBool,
    clearAll,
  } = useFilterState({ initialCategories, initialLocations, initialOpenNow })

  return (
    <div className="lg:hidden w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {/* All Filters sheet trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className={`relative flex items-center shrink-0 h-9 pl-3 pr-4 rounded-full border text-sm font-semibold transition-all ${
                hasAnyActive
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-900 bg-gray-900 text-white"
              }`}
            >
              <SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
              Filters
              {totalActiveCount > 0 && (
                <span className="ml-2 bg-white text-blue-600 rounded-full text-xs font-bold px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                  {totalActiveCount}
                </span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl h-[85vh] overflow-y-auto">
            <SheetHeader className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg">Filters</SheetTitle>
                {hasAnyActive && (
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-sm font-semibold text-red-500 hover:text-red-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </SheetHeader>
            <div className="py-4 flex flex-col gap-6">
              {/* Open Now */}
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <CircleDot className="h-4 w-4" />
                    Open Now
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={openNow}
                    onClick={() => toggleBool("openNow", !openNow)}
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                      openNow ? "bg-green-500" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        openNow ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </label>
              </div>

              {/* Category */}
              {categories.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                    {categoryArray.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                        {categoryArray.length}
                      </span>
                    )}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((c) => (
                      <label
                        key={c}
                        className="flex items-center gap-2 text-sm cursor-pointer select-none p-2 rounded-lg hover:bg-gray-50"
                        onClick={(e) => { e.preventDefault(); toggle("category", c) }}
                      >
                        <div className={`flex-shrink-0 flex items-center justify-center h-4 w-4 rounded border transition-colors ${categoryArray.includes(c) ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                          {categoryArray.includes(c) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={categoryArray.includes(c) ? "font-semibold" : ""}>{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              {locations.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                    {locationArray.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                        {locationArray.length}
                      </span>
                    )}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {locations.map((l) => (
                      <label
                        key={l}
                        className="flex items-center gap-2 text-sm cursor-pointer select-none p-2 rounded-lg hover:bg-gray-50"
                        onClick={(e) => { e.preventDefault(); toggle("location", l) }}
                      >
                        <div className={`flex-shrink-0 flex items-center justify-center h-4 w-4 rounded border transition-colors ${locationArray.includes(l) ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                          {locationArray.includes(l) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={locationArray.includes(l) ? "font-semibold" : ""}>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              {(extraFilters.priceRanges || []).length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Price Range
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {extraFilters.priceRanges!.map((p) => (
                      <label
                        key={p}
                        className="flex items-center gap-2 text-sm cursor-pointer select-none p-2 rounded-lg hover:bg-gray-50"
                        onClick={(e) => { e.preventDefault(); toggle("price", p) }}
                      >
                        <div className={`flex-shrink-0 flex items-center justify-center h-4 w-4 rounded border transition-colors ${priceArray.includes(p) ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                          {priceArray.includes(p) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={`leading-tight ${priceArray.includes(p) ? "font-semibold" : ""}`}>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              {(extraFilters.availability || []).length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Availability
                  </h4>
                  <div className="flex flex-col gap-2">
                    {extraFilters.availability!.map((a) => (
                      <label
                        key={a}
                        className="flex items-center gap-2 text-sm cursor-pointer select-none p-2 rounded-lg hover:bg-gray-50"
                        onClick={(e) => { e.preventDefault(); toggle("availability", a) }}
                      >
                        <div className={`flex-shrink-0 flex items-center justify-center h-4 w-4 rounded border transition-colors ${availabilityArray.includes(a) ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                          {availabilityArray.includes(a) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={availabilityArray.includes(a) ? "font-semibold" : ""}>{a}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Rating */}
              {(extraFilters.ratings || []).length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Rating
                  </h4>
                  <div className="flex flex-col gap-2">
                    {extraFilters.ratings!.map((r) => (
                      <label
                        key={r}
                        className="flex items-center gap-2 text-sm cursor-pointer select-none p-2 rounded-lg hover:bg-gray-50"
                        onClick={(e) => { e.preventDefault(); toggle("rating", r) }}
                      >
                        <div className={`flex-shrink-0 flex items-center justify-center h-4 w-4 rounded border transition-colors ${ratingArray.includes(r) ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                          {ratingArray.includes(r) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className={ratingArray.includes(r) ? "font-semibold" : ""}>{r}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Quick active-filter chips */}
        {categoryArray.map((c) => (
          <button
            key={`cat-${c}`}
            type="button"
            onClick={() => toggle("category", c)}
            className="flex items-center gap-1 shrink-0 h-9 pl-3 pr-2.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors"
          >
            {c}
            <X className="h-3.5 w-3.5 ml-0.5 opacity-70" />
          </button>
        ))}
        {locationArray.map((l) => (
          <button
            key={`loc-${l}`}
            type="button"
            onClick={() => toggle("location", l)}
            className="flex items-center gap-1 shrink-0 h-9 pl-3 pr-2.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700 text-sm font-semibold hover:bg-purple-100 transition-colors"
          >
            {l}
            <X className="h-3.5 w-3.5 ml-0.5 opacity-70" />
          </button>
        ))}
        {openNow && (
          <button
            type="button"
            onClick={() => toggleBool("openNow", false)}
            className="flex items-center gap-1 shrink-0 h-9 pl-3 pr-2.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors"
          >
            Open Now
            <X className="h-3.5 w-3.5 ml-0.5 opacity-70" />
          </button>
        )}
        {hasAnyActive && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center shrink-0 h-9 px-3 rounded-full text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
