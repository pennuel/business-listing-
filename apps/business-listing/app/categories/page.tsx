import { Navbar } from "@/components/navbar"
import { ArrowRight, Building2 } from "lucide-react"
import { fetchAllBusinesses } from "@/lib/backend"
import Link from "next/link"

// All known categories with icons (colour-coded)
const CATEGORY_META: Record<string, { color: string; emoji: string }> = {
  Photography: { color: "from-pink-500 to-rose-600", emoji: "📸" },
  Plumbers: { color: "from-blue-500 to-cyan-600", emoji: "🔧" },
  Electricians: { color: "from-yellow-400 to-amber-500", emoji: "⚡" },
  Cleaning: { color: "from-emerald-400 to-green-600", emoji: "🧹" },
  "Auto Repair": { color: "from-slate-500 to-gray-700", emoji: "🚗" },
  Catering: { color: "from-orange-400 to-red-500", emoji: "🍽️" },
  Healthcare: { color: "from-red-400 to-pink-600", emoji: "🏥" },
  Education: { color: "from-violet-500 to-purple-700", emoji: "📚" },
  Retail: { color: "from-teal-400 to-cyan-600", emoji: "🛍️" },
  Landscaping: { color: "from-lime-400 to-green-600", emoji: "🌿" },
  Carpenters: { color: "from-amber-500 to-yellow-700", emoji: "🪵" },
}

function slugify(name: string) {
  return encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"))
}

export default async function CategoriesPage() {
  let allBusinesses: any[] = []
  try {
    allBusinesses = await fetchAllBusinesses(0, 200)
  } catch (err) {
    console.warn("[CategoriesPage] Backend unavailable")
  }

  // Group by category
  const categoriesMap = new Map<string, number>()
  allBusinesses.forEach((b) => {
    const catName = b.category?.categoryName || b.category
    if (catName) {
      categoriesMap.set(catName, (categoriesMap.get(catName) || 0) + 1)
    }
  })

  // Sort by count desc, then alphabetically
  const sortedCategories = Array.from(categoriesMap.entries()).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1]
    return a[0].localeCompare(b[0])
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b pt-12 pb-12 text-center shadow-sm relative z-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          All Service Categories
        </h1>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-lg">
          Browse our directory of service providers — find exactly what you
          need, right near you.
        </p>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCategories.map(([categoryName, count]) => {
            const meta = CATEGORY_META[categoryName]
            const gradient = meta?.color || "from-blue-500 to-indigo-600"
            const emoji = meta?.emoji || "🏢"

            return (
              <Link
                key={categoryName}
                href={`/categories/${slugify(categoryName)}`}
                className="group block"
              >
                <div className="bg-white rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full flex flex-col">
                  {/* Gradient banner */}
                  <div
                    className={`bg-gradient-to-br ${gradient} h-24 flex items-center justify-center`}
                  >
                    <span className="text-4xl drop-shadow-sm">{emoji}</span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {categoryName}
                      </h3>
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground flex-1">
                      {count} provider{count !== 1 ? "s" : ""} available
                    </p>

                    <div className="mt-4 flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                      View providers{" "}
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}

          {sortedCategories.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border border-dashed">
              <Building2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              No categories populated yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
