"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Tag, X } from "lucide-react"

export function HomeSearch({ categories, locations }: { categories: string[], locations: string[] }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [query])

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    startTransition(() => {
      const params = new URLSearchParams()
      if (query.trim()) params.set("q", query.trim())
      if (category) params.set("category", category)
      if (location) params.set("location", location)
      
      if (params.toString()) {
        router.push(`/search?${params.toString()}`)
      } else {
        router.push('/search')
      }
    })
  }

  const handleClear = () => {
    setQuery("")
    setCategory("")
    setLocation("")
    setIsExpanded(false)
    if (textareaRef.current) {
      textareaRef.current.blur()
    }
  }

  return (
    <div className={`w-full max-w-2xl mx-auto bg-white shadow-xl shadow-blue-900/10 border rounded-3xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-all text-left ${isPending ? 'opacity-70 scale-[0.98]' : 'opacity-100 scale-100'}`}>
      <form onSubmit={handleSearch}>
        <div className="p-3 flex items-end relative">
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Describe what you're looking for... (e.g. A fundi in Nairobi)"
            className="w-full resize-none bg-transparent outline-none py-3 px-4 text-gray-900 placeholder:text-gray-400 min-h-[56px] max-h-[200px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSearch()
              }
            }}
            disabled={isPending}
          />
          <Button 
            type="submit" 
            disabled={isPending}
            className="rounded-2xl ml-2 w-12 h-12 p-0 shrink-0 bg-blue-600 hover:bg-blue-700 shadow-md self-end mb-1 transition-all active:scale-95"
          >
            <Search className={`h-5 w-5 text-white ${isPending ? 'animate-pulse' : ''}`} />
          </Button>
        </div>

        <div className={`transition-all duration-300 overflow-hidden ${isExpanded || query || category || location ? 'max-h-32 opacity-100 border-t border-gray-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-gray-50/80 px-5 py-3 flex flex-wrap items-center gap-4">
            {categories.length > 0 && (
              <div className="flex items-center text-sm bg-white border rounded-full px-3 py-1.5 shadow-sm text-gray-600 hover:border-gray-300 transition-colors">
                <Tag className="h-3.5 w-3.5 mr-2 text-gray-400" />
                <select 
                  className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer text-sm font-medium outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {locations.length > 0 && (
              <div className="flex items-center text-sm bg-white border rounded-full px-3 py-1.5 shadow-sm text-gray-600 hover:border-gray-300 transition-colors">
                <MapPin className="h-3.5 w-3.5 mr-2 text-gray-400" />
                <select 
                  className="bg-transparent border-none p-0 focus:ring-0 cursor-pointer text-sm font-medium outline-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {locations.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {(query || category || location || isExpanded) && (
              <button 
                type="button"
                onClick={handleClear}
                className="flex items-center text-xs font-medium text-gray-400 hover:text-red-500 transition-colors ml-auto"
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

