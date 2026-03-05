import { businessService } from "@think-id/database"
import { Navbar } from "@/components/navbar"
import { normalizeBusiness } from "@/lib/utils/normalize"
import Link from "next/link"
import { Building2, ArrowRight } from "lucide-react"

// To fetch dummy businesses too
import { GET as getDummySearch } from "../api/search/route"

export default async function CategoriesPage() {
  let allBusinesses: any[] = []

  // Load Real Db items
  try {
    const result = await businessService.getAllBusinesses({ status: "active", limit: 200 })
    allBusinesses = Array.isArray(result) ? result : (result?.businesses || [])
  } catch (error) {
    console.error("Failed to fetch db businesses:", error)
  }

  // Load dummy items
  try {
    const dRes = await getDummySearch(new Request("http://localhost/api/search"))
    const dData = await dRes.json()
    allBusinesses = [...allBusinesses, ...(dData.businesses || [])]
  } catch (error) {
    console.error("Failed to fetch dummy businesses:", error)
  }

  // Normalize and group by category
  const normalized = allBusinesses.map(b => normalizeBusiness(b))
  
  const categoriesMap = new Map<string, any[]>()

  normalized.forEach(b => {
    const catName = typeof b.category === 'object' ? b.category?.categoryName : b.category
    if (catName) {
      if (!categoriesMap.has(catName)) {
        categoriesMap.set(catName, [])
      }
      categoriesMap.get(catName)?.push(b)
    }
  })

  // Sort categories by popular/alphabetical
  const sortedCategories = Array.from(categoriesMap.entries()).sort((a, b) => {
    // Sort by count descending, then alphabetically if equal
    if (b[1].length !== a[1].length) {
      return b[1].length - a[1].length
    }
    return a[0].localeCompare(b[0])
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="bg-white border-b pt-12 pb-12 relative z-10 shadow-sm text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          All Service Categories
        </h1>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-lg">
          Browse our extensive directory of service providers. Find Exactly what you need, right near you.
        </p>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCategories.map(([categoryName, businesses]) => (
            <Link 
              key={categoryName}
              href={`/search?category=${encodeURIComponent(categoryName)}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50/20 rounded-bl-full -z-10 transition-transform group-hover:scale-125 duration-500" />
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100/50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium">
                    {businesses.length} lists
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{categoryName}</h3>
                
                <div className="mt-auto pt-6 flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">
                  View providers <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 border-gray-400 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
          
          {sortedCategories.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border border-dashed">
              No categories populated yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Badge({ children, className }: any) {
  return (
    <div className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${className}`}>
      {children}
    </div>
  )
}
