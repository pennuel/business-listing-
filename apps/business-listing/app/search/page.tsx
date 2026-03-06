import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Star } from "lucide-react"
import { SearchPromptBox, SearchFilterBar, SearchSidebar } from "./search-filters"
import Link from "next/link"
import { GET as getFilters } from "../api/filters/route"
import { fetchAllBusinesses, filterBusinesses } from "@/lib/backend"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : ''
  const categoryParam = searchParams.category
  const locationParam = searchParams.location
  
  const selectedCategories = Array.isArray(categoryParam) ? categoryParam : (typeof categoryParam === 'string' ? [categoryParam] : [])
  const selectedLocations = Array.isArray(locationParam) ? locationParam : (typeof locationParam === 'string' ? [locationParam] : [])
  const openNow = searchParams.openNow === 'true'

  let businesses: any[] = []
  let allCategories: string[] = []
  let allLocations: string[] = []
  let extraFilters: any = {}

  // Load filter metadata (categories, locations, price ranges, etc.)
  try {
    const dummyFiltersRes = await getFilters()
    extraFilters = await dummyFiltersRes.json()
  } catch (err) {
    console.error("Failed to load filters", err)
  }

  // Load businesses from Kotlin backend (graceful fallback to empty)
  try {
    let allBusinesses = await fetchAllBusinesses(0, 200)

    allCategories = Array.from(
      new Set([
        ...allBusinesses
          .map((b: any) =>
            typeof b.category === "object" ? b.category?.categoryName : b.category
          )
          .filter(Boolean),
        ...(extraFilters.categories || []),
      ])
    ) as string[]

    allLocations = Array.from(
      new Set([
        ...allBusinesses.map((b: any) => b.county).filter(Boolean),
        ...(extraFilters.locations || []),
      ])
    ) as string[]

    // Apply search filters
    businesses = filterBusinesses(allBusinesses, {
      query,
      category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
      location: selectedLocations.length === 1 ? selectedLocations[0] : undefined,
      openNow,
    })

    // Multi-select category filter (when more than one selected)
    if (selectedCategories.length > 1) {
      const cats = selectedCategories.map((c) => c.toLowerCase())
      businesses = businesses.filter((b: any) => {
        const catName =
          typeof b.category === "object" ? b.category?.categoryName : b.category
        return catName && cats.includes(catName.toLowerCase())
      })
    }

    // Multi-select location filter (when more than one selected)
    if (selectedLocations.length > 1) {
      const locs = selectedLocations.map((l) => l.toLowerCase())
      businesses = businesses.filter((b: any) => {
        const cty = b.county?.toLowerCase() || ""
        const sub = b.subCounty?.toLowerCase() || ""
        return locs.some((l) => cty.includes(l) || sub.includes(l))
      })
    }
  } catch (error) {
    console.error("[SearchPage] Backend unavailable:", error)
  }

  const pageParam = parseInt(searchParams.page as string || "1")
  const itemsPerPage = 6
  const totalPages = Math.ceil(businesses.length / itemsPerPage)
  
  const paginatedBusinesses = businesses.slice((pageParam - 1) * itemsPerPage, pageParam * itemsPerPage)

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v !== undefined) {
         if (Array.isArray(v)) v.forEach(val => params.append(k, val))
         else params.set(k, v)
      }
    })
    params.set("page", String(p))
    return `/search?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Search header */}
      <div className="bg-white border-b pt-8 pb-8 relative z-10 shadow-sm">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Search Results
            </h1>
            <p className="text-muted-foreground mt-1">
              {businesses.length} result{businesses.length !== 1 ? "s" : ""}
              {query && (
                <> for <span className="font-semibold text-blue-600">&ldquo;{query}&rdquo;</span></>
              )}
            </p>
          </div>
          <SearchPromptBox initialQuery={query} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-1 max-w-6xl">
        {/* Mobile filter bar — hidden on lg */}
        <div className="mb-5 lg:hidden">
          <SearchFilterBar
            initialCategories={selectedCategories}
            initialLocations={selectedLocations}
            initialOpenNow={openNow}
            categories={allCategories}
            locations={allLocations}
            extraFilters={extraFilters}
          />
        </div>

        {/* Sidebar + results layout */}
        <div className="flex gap-8 items-start">
          {/* Desktop sidebar — visible on lg+ */}
          <SearchSidebar
            categories={allCategories}
            locations={allLocations}
            extraFilters={extraFilters}
            initialCategories={selectedCategories}
            initialLocations={selectedLocations}
            initialOpenNow={openNow}
          />

          {/* Results column */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedBusinesses.map((business, index) => (
              <Link
                key={business.id ?? index}
                href={`/window/${business.id}`}
                className="group block"
              >
                <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all rounded-xl h-full flex flex-col bg-white">
                  <div className="aspect-[16/10] relative bg-muted overflow-hidden">
                     {business.coverImage ? (
                        <img 
                          src={business.coverImage} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={business.name}
                        />
                     ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                          <Building2 className="h-12 w-12 text-white opacity-20" />
                        </div>
                     )}
                     <div className="absolute top-3 left-3">
                        <Badge className="bg-white/95 text-blue-700 hover:bg-white border-none text-[10px] uppercase font-bold shadow-sm">
                          {typeof business.category === 'object' ? business.category?.categoryName : business.category || "Store"}
                        </Badge>
                     </div>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors line-clamp-1">{business.name}</h3>
                      <div className="flex items-center gap-1 text-xs bg-yellow-400/10 text-yellow-700 px-1.5 py-0.5 rounded-md self-start">
                         <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                         <span className="font-bold">4.8</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-auto mb-3 min-h-[40px]">
                      {business.tagline || business.description || "Premium services and products."}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground border-t pt-3 mt-auto">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{business.subCounty}, {business.county}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            
              {businesses.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white rounded-xl border border-dashed">
                  <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No businesses found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mt-2">Try adjusting your filters or search query to find what you&apos;re looking for.</p>
                </div>
              )}
            </div>
          
          {totalPages > 1 && (
            <div className="mt-12 mb-8">
              <Pagination>
                <PaginationContent>
                  {pageParam > 1 && (
                    <PaginationItem>
                      <PaginationPrevious href={buildPageUrl(pageParam - 1)} />
                    </PaginationItem>
                  )}
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const p = i + 1;
                    if (
                      p === 1 ||
                      p === totalPages ||
                      (p >= pageParam - 1 && p <= pageParam + 1)
                    ) {
                      return (
                        <PaginationItem key={p}>
                          <PaginationLink href={buildPageUrl(p)} isActive={pageParam === p}>
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }
                    if (p === pageParam - 2 || p === pageParam + 2) {
                      return (
                        <PaginationItem key={p}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  })}

                  {pageParam < totalPages && (
                    <PaginationItem>
                      <PaginationNext href={buildPageUrl(pageParam + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}
