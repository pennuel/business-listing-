import { Navbar } from "@/components/navbar"
import { Building2, MapPin, Star, ArrowLeft, Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { fetchAllBusinesses, filterBusinesses } from "@/lib/backend"

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Decode the slug into a display name (e.g., "auto-repair" -> "Auto Repair")
  const categoryName = decodeURIComponent(slug)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  let businesses: any[] = []
  try {
    const allBusinesses = await fetchAllBusinesses(0, 200)
    businesses = filterBusinesses(allBusinesses, { category: categoryName })
  } catch (err) {
    console.warn("[CategoryDetailPage] Backend unavailable")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white border-b pt-10 pb-10 relative z-10 shadow-sm">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/categories"
              className="hover:text-blue-600 transition-colors"
            >
              Categories
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{categoryName}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {categoryName}
              </h1>
              <p className="text-muted-foreground mt-2">
                {businesses.length} service provider
                {businesses.length !== 1 ? "s" : ""} available
              </p>
            </div>

            <Link
              href={`/search?category=${encodeURIComponent(categoryName)}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full"
            >
              <Search className="h-4 w-4" />
              Filter & Search
            </Link>
          </div>
        </div>
      </div>

      {/* Business Grid */}
      <div className="container mx-auto px-4 py-10 max-w-5xl flex-1">
        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business, index) => (
              <Link
                key={business.id ?? index}
                href={`/window/${business.id}`}
                className="group block"
              >
                <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl bg-white h-full flex flex-col">
                  {/* Cover */}
                  <div className="aspect-[16/10] relative bg-muted overflow-hidden">
                    {business.coverImage ? (
                      <img
                        src={business.coverImage}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt={business.name}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300">
                        <Building2 className="h-12 w-12 text-white opacity-25" />
                      </div>
                    )}

                    {/* open/closed badge */}
                    <div className="absolute bottom-3 left-3">
                      <div
                        className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-md border ${
                          business.isManuallyOpen
                            ? "bg-green-900/40 border-green-400/30 text-green-300"
                            : "bg-black/40 border-white/10 text-white/70"
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
                      <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors line-clamp-1">
                        {business.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs bg-yellow-400/10 text-yellow-700 px-1.5 py-0.5 rounded-md self-start shrink-0 ml-2">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="font-bold">{business.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[40px]">
                      {business.tagline || business.description}
                    </p>

                    <div className="mt-auto space-y-2 border-t pt-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {business.subCounty}, {business.county}
                        </span>
                      </div>
                      {business.priceRange && (
                        <div className="text-xs font-medium text-blue-600">
                          {business.priceRange}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-dashed">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No providers in "{categoryName}" yet
            </h3>
            <p className="text-muted-foreground max-w-xs mt-2 mb-6">
              Be the first to list your business in this category.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Browse other categories
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
