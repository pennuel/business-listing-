import Link from "next/link"
import { ArrowRight, Building2, MapPin, Search, Star, ChevronRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { HomeSearch } from "@/components/home-search"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchAllBusinesses } from "@/lib/backend"

// Category visual config
const CATEGORY_META: Record<string, { color: string; emoji: string }> = {
  Photography: { color: "bg-pink-100 text-pink-700 hover:bg-pink-200", emoji: "📸" },
  Plumbers: { color: "bg-blue-100 text-blue-700 hover:bg-blue-200", emoji: "🔧" },
  Electricians: { color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200", emoji: "⚡" },
  Cleaning: { color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200", emoji: "🧹" },
  "Auto Repair": { color: "bg-slate-100 text-slate-700 hover:bg-slate-200", emoji: "🚗" },
  Catering: { color: "bg-orange-100 text-orange-700 hover:bg-orange-200", emoji: "🍽️" },
  Healthcare: { color: "bg-red-100 text-red-700 hover:bg-red-200", emoji: "🏥" },
  Education: { color: "bg-violet-100 text-violet-700 hover:bg-violet-200", emoji: "📚" },
  Retail: { color: "bg-teal-100 text-teal-700 hover:bg-teal-200", emoji: "🛍️" },
  Landscaping: { color: "bg-lime-100 text-lime-700 hover:bg-lime-200", emoji: "🌿" },
  Carpenters: { color: "bg-amber-100 text-amber-700 hover:bg-amber-200", emoji: "🪵" },
}

function slugify(name: string) {
  return encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"))
}

export default async function HomePage() {
  // Load all businesses — backend first, silent fallback to []
  let allBusinesses: any[] = []
  try {
    allBusinesses = await fetchAllBusinesses(0, 200)
  } catch (err) {
    console.warn("[HomePage] Backend unavailable, showing empty state")
  }

  // Derive categories + locations for search box
  const allCategories = Array.from(
    new Set(allBusinesses.map((b) => b.category?.categoryName || b.category).filter(Boolean))
  ) as string[]
  const allLocations = Array.from(
    new Set(allBusinesses.map((b) => b.county).filter(Boolean))
  ) as string[]

  // Category counts for the grid
  const categoriesMap = new Map<string, number>()
  allBusinesses.forEach((b) => {
    const cat = b.category?.categoryName || b.category
    if (cat) categoriesMap.set(cat, (categoriesMap.get(cat) || 0) + 1)
  })
  const sortedCategories = Array.from(categoriesMap.entries())
    .sort((a, b) => b[1] - a[1])

  // Recent listings (latest 6 for the discovery strip)
  const recentListings = allBusinesses.slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── HERO / SEARCH ── */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 border border-blue-100">
            <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse" />
            Kenya&apos;s Local Business Directory
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-gray-900 leading-tight">
            Find trusted services{" "}
            <span className="text-blue-600">near you</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            Explore the best service providers and shops in your community —
            from plumbers and photographers to caterers and clinics.
          </p>

          <div className="max-w-2xl mx-auto relative z-20">
            <HomeSearch categories={allCategories} locations={allLocations} />
          </div>
        </div>

        {/* Quick Category Chips — horizontal scroll */}
        <div className="border-t bg-gray-50/60">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest shrink-0 mr-1">
                Popular:
              </span>
              {sortedCategories.slice(0, 8).map(([catName]) => {
                const meta = CATEGORY_META[catName]
                return (
                  <Link
                    key={catName}
                    href={`/categories/${slugify(catName)}`}
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-full border border-transparent transition-all shrink-0 ${
                      meta?.color ?? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {meta?.emoji} {catName}
                  </Link>
                )
              })}
              <Link
                href="/categories"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 px-3 py-1.5 shrink-0 transition-colors"
              >
                All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── BROWSE BY CATEGORY GRID ── */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {sortedCategories.length} categories of local services
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedCategories.map(([catName, count]) => {
            const meta = CATEGORY_META[catName]
            return (
              <Link
                key={catName}
                href={`/categories/${slugify(catName)}`}
                className="group block"
              >
                <div className="bg-white rounded-2xl p-5 border hover:border-blue-200 shadow-sm hover:shadow-lg transition-all duration-200 text-center">
                  <div className="text-3xl mb-2">{meta?.emoji ?? "🏢"}</div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-tight">
                    {catName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {count} listing{count !== 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── RECENT LISTINGS STRIP ── */}
      <div className="bg-white border-y">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recently Listed
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Newly added service providers
              </p>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentListings.map((business, index) => (
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
                      <Badge className="bg-white/95 text-blue-700 border-none text-[10px] uppercase font-bold shadow-sm">
                        {business.category?.categoryName || business.category || "Service"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <div
                        className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full backdrop-blur-md ${
                          business.isManuallyOpen
                            ? "bg-green-900/40 border border-green-400/30 text-green-300"
                            : "bg-black/40 border border-white/10 text-white/60"
                        }`}
                      >
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${
                            business.isManuallyOpen
                              ? "bg-green-400 animate-pulse"
                              : "bg-red-400"
                          }`}
                        />
                        {business.isManuallyOpen ? "Open" : "Closed"}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-bold group-hover:text-blue-600 transition-colors line-clamp-1">
                        {business.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs bg-yellow-400/10 text-yellow-700 px-1.5 py-0.5 rounded-md self-start shrink-0 ml-2">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="font-bold">{business.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[40px]">
                      {business.tagline || business.description}
                    </p>
                    <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground border-t pt-3">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {business.subCounty}, {business.county}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA FOOTER ── */}
      <div className="bg-blue-600 py-20 mt-0 text-white overflow-hidden relative">
        <div className="absolute -top-20 right-0 h-64 w-64 rounded-full bg-blue-500 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-700 opacity-20 blur-2xl" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            List your business today
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto opacity-90">
            Join the THiNK directory and connect with thousands of customers
            looking for your services right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 shadow-xl"
              asChild
            >
              <Link href="/login">Register My Business</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8"
              asChild
            >
              <Link href="/search">
                <Search className="h-4 w-4 mr-2" />
                Browse Services
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
