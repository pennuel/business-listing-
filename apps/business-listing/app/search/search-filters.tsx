"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, ChevronDown, SlidersHorizontal, MapPin, Tag, X, Check } from "lucide-react"

export function SearchPromptBox({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
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
              if (e.key === 'Enter' && !e.shiftKey) {
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

const FilterPill = ({ 
  label, 
  value, 
  options, 
  filterKey,
  onToggle 
}: { 
  label: string, 
  value: string[], 
  options: string[], 
  filterKey: string,
  onToggle: (key: string, option: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!options || options.length === 0) return null;
  
  const hasSelections = value.length > 0
  const displayLabel = hasSelections 
    ? (value.length === 1 ? value[0] : `${value.length} selected`) 
    : label

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button 
          type="button"
          className={`relative flex items-center shrink-0 h-10 px-4 rounded-full border text-sm font-medium transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${hasSelections ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-gray-300 text-gray-700 bg-white'}`}
        >
          <span className="truncate max-w-[120px]">{displayLabel}</span>
          <ChevronDown className={`ml-2 h-4 w-4 opacity-50 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="text-xs font-semibold text-gray-400 px-3 py-1.5 uppercase tracking-wider">
          {label}
        </div>
        <div className="flex flex-col gap-1 mt-1 max-h-60 overflow-y-auto invisible-scrollbar">
          {options.map((opt) => {
            const checked = value.includes(opt)
            return (
              <label 
                key={opt} 
                className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                onClick={(e) => {
                  // Prevent immediate popover close if desired, right now label clicks will naturally toggle if correctly bound, but let's handle the toggle cleanly
                  e.preventDefault()
                  onToggle(filterKey, opt)
                }}
              >
                <div className={`flex flex-shrink-0 items-center justify-center h-5 w-5 rounded border mr-3 ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                  {checked && <Check className="h-3.5 w-3.5 text-white" />}
                </div>
                <span className={`text-sm ${checked ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                  {opt}
                </span>
              </label>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function SearchFilterBar({
  initialCategories = [],
  initialLocations = [],
  initialOpenNow = false,
  categories = [],
  locations = [],
  extraFilters = {}
}: {
  initialCategories?: string[]
  initialLocations?: string[]
  initialOpenNow?: boolean
  categories?: string[]
  locations?: string[]
  extraFilters?: Record<string, string[]>
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isExpanded, setIsExpanded] = useState(false)

  const getArrayParam = (key: string): string[] => {
    const val = searchParams.getAll(key)
    return val.length > 0 ? val : []
  }

  const categoryArray = getArrayParam('category').length ? getArrayParam('category') : initialCategories
  const locationArray = getArrayParam('location').length ? getArrayParam('location') : initialLocations
  const priceArray = getArrayParam('price')
  const ratingArray = getArrayParam('rating')
  const availabilityArray = getArrayParam('availability')

  const openNow = searchParams.get('openNow') === 'true' || initialOpenNow

  const hasExtraFiltersActive = priceArray.length > 0 || ratingArray.length > 0 || availabilityArray.length > 0
  
  // Auto-expand if the user arrives via a link that already has extra filters active
  useEffect(() => {
    if (hasExtraFiltersActive) {
      setIsExpanded(true)
    }
  }, [hasExtraFiltersActive])

  const toggleFilterOption = (key: string, option: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.getAll(key)
    
    // Remove all existings to reconstruct
    params.delete(key)
    
    // Toggle
    if (currentValues.includes(option)) {
      currentValues.filter(v => v !== option).forEach(v => params.append(key, v))
    } else {
      currentValues.push(option)
      currentValues.forEach(v => params.append(key, v))
    }
    
    router.push(`/search?${params.toString()}`)
  }

  const toggleBooleanFilter = (key: string, value: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, "true")
    else params.delete(key)
    router.push(`/search?${params.toString()}`)
  }

  const handleClear = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('category')
    params.delete('location')
    params.delete('openNow')
    params.delete('price')
    params.delete('rating')
    params.delete('availability')
    router.push(`/search?${params.toString()}`)
  }

  const hasAnyFilterActive = categoryArray.length > 0 || locationArray.length > 0 || hasExtraFiltersActive || openNow

  return (
    <div className="relative w-full py-1">
      <div className={`flex flex-wrap gap-2 items-center transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[600px] pb-2' : 'max-h-12'}`}>
        {/* Primary Row Controls */}
        <FilterPill label="Category" value={categoryArray} options={categories} filterKey="category" onToggle={toggleFilterOption} />
        <FilterPill label="Location" value={locationArray} options={locations} filterKey="location" onToggle={toggleFilterOption} />
        
        <label className={`relative flex items-center shrink-0 h-10 px-4 rounded-full border text-sm font-medium transition-colors cursor-pointer select-none hover:bg-gray-50 ${openNow ? 'border-green-600 text-green-700 bg-green-50' : 'border-gray-300 text-gray-700 bg-white'}`}>
          <input 
            type="checkbox" 
            className="sr-only"
            checked={openNow}
            onChange={(e) => toggleBooleanFilter('openNow', e.target.checked)}
          />
          <span className="truncate">Open Now</span>
        </label>

        <button 
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-center shrink-0 h-10 w-10 rounded-full border transition-colors ${isExpanded ? 'bg-gray-200 border-gray-300 text-gray-800' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
          title={isExpanded ? "Show fewer filters" : "Show more filters"}
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        <Sheet>
          <SheetTrigger asChild>
            <button 
              type="button"
              className="relative flex items-center shrink-0 h-10 px-5 rounded-full border border-gray-900 bg-gray-900 text-white text-sm font-medium transition-opacity hover:opacity-90 active:scale-95"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              All Filters
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>All Filters</SheetTitle>
            </SheetHeader>
            <div className="py-6 flex flex-col gap-8">
               <div className="space-y-4">
                 <h3 className="font-bold text-gray-900">Category</h3>
                 <div className="grid grid-cols-2 gap-3">
                    {categories.map((c) => (
                      <label key={c} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input type="checkbox" checked={categoryArray.includes(c)} onChange={() => toggleFilterOption('category', c)} className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        {c}
                      </label>
                    ))}
                 </div>
               </div>

               <div className="space-y-4">
                 <h3 className="font-bold text-gray-900">Location</h3>
                 <div className="grid grid-cols-2 gap-3">
                    {locations.map((c) => (
                      <label key={c} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input type="checkbox" checked={locationArray.includes(c)} onChange={() => toggleFilterOption('location', c)} className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        {c}
                      </label>
                    ))}
                 </div>
               </div>

               <div className="space-y-4">
                 <h3 className="font-bold text-gray-900">Price</h3>
                 <div className="grid grid-cols-2 gap-3">
                    {extraFilters.priceRanges?.map((c) => (
                      <label key={c} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input type="checkbox" checked={priceArray.includes(c)} onChange={() => toggleFilterOption('price', c)} className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        {c}
                      </label>
                    ))}
                 </div>
               </div>

               <div className="space-y-4">
                 <h3 className="font-bold text-gray-900">Condition</h3>
                 <div className="grid grid-cols-2 gap-3">
                    {(extraFilters.ratings || ["New", "Refurbished", "Used"]).map((c) => (
                      <label key={c} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                        <input type="checkbox" checked={ratingArray.includes(c)} onChange={() => toggleFilterOption('rating', c)} className="rounded border-gray-300 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                        {c}
                      </label>
                    ))}
                 </div>
               </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {hasAnyFilterActive && (
          <button 
            type="button"
            onClick={handleClear}
            className="flex items-center text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors px-2 uppercase tracking-wider h-10"
          >
            Clear
          </button>
        )}

        {/* Secondary controls (these cleanly wrap on small screens, or to the next line on large screens) */}
        <div className={`w-full h-px hidden md:block ${isExpanded ? 'my-1' : ''}`} />
        
        <FilterPill label="Price" value={priceArray} options={extraFilters.priceRanges || []} filterKey="price" onToggle={toggleFilterOption} />
        <FilterPill label="Condition" value={ratingArray} options={extraFilters.ratings || ["New", "Refurbished", "Used"]} filterKey="rating" onToggle={toggleFilterOption} />
        <FilterPill label="Availability" value={availabilityArray} options={extraFilters.availability || []} filterKey="availability" onToggle={toggleFilterOption} />
      </div>
    </div>
  )
}


