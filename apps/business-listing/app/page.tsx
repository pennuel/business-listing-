import { BusinessInfo, businessService } from "@think-id/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Search, MapPin, Star, ArrowRight, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"

export default async function HomePage() {
  let businesses: BusinessInfo[] = []
  try {
    const result = await businessService.getAllBusinesses({
      status: "active",
      limit: 12
    })
    businesses = Array.isArray(result) ? result : (result?.businesses || [])
  } catch (error) {
    console.error("Failed to fetch businesses:", error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero / Search */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-gray-900">
            Welcome to the <span className="text-blue-600">Think Mall</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore the best service providers and shops in your community. Every window tells a story.
          </p>
          
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
            <Input 
              placeholder="Search for services, shops, or locations..." 
              className="pl-12 h-14 text-lg shadow-sm rounded-full border-2 focus-visible:ring-blue-600"
            />
            <Button className="absolute right-2 top-2 h-10 rounded-full px-6 bg-blue-600 hover:bg-blue-700">
              Find
            </Button>
          </div>
        </div>
      </div>

      {/* The Mall Directory (Window Displays) */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Window Displays</h2>
            <p className="text-muted-foreground">The most interesting stores open today</p>
          </div>
          <Button variant="ghost" className="text-blue-600 gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((business, index) => (
            <a
              key={business.bizId ?? (business as any).id ?? index}
              href={`/window/${business.bizId ?? (business as any).id}`}
              className="group block"
            >
              <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
                {/* Visual Window */}
                <div className="aspect-[16/10] relative overflow-hidden">
                   {business.coverImage ? (
                      <img 
                        src={business.coverImage} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        alt={business.businessName}
                      />
                   ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Building2 className="h-16 w-16 text-white opacity-20" />
                      </div>
                   )}
                   <div className="absolute top-4 left-4">
                      <Badge className="bg-white/95 text-blue-700 hover:bg-white border-none shadow-sm font-bold uppercase text-[10px]">
                        {business.category?.categoryName}
                      </Badge>
                   </div>
                   
                   {/* Live Status Overlay */}
                   <div className="absolute bottom-4 right-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
                      <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-2">
                         <div className={`h-2 w-2 rounded-full ${business.isManuallyOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                         <span className="text-[10px] text-white font-bold uppercase tracking-widest">
                            {business.isManuallyOpen ? 'Store Open' : 'Store Closed'}
                         </span>
                      </div>
                   </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">{business.businessName}</h3>
                    <div className="flex items-center gap-1 text-sm bg-yellow-400/10 text-yellow-700 px-2 py-0.5 rounded-md">
                       <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                       <span className="font-bold">4.8</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                    {business.tagline || business.description || "Explore our premium services and products."}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {business.subCounty}, {business.county}
                    </div>
                    {/* {business.services.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {business.services[0].serviceName}
                      </div>
                    )} */}
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}

          {businesses.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">The Mall is quiet right now</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">No businesses have opened their display windows yet. Check back soon!</p>
              <Button className="mt-6" variant="outline" asChild>
                <a href="/login">Register Your Store</a>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="bg-blue-600 py-20 mt-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-64 w-64 rounded-full bg-blue-500 opacity-20 blur-3xl" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Open Your Window to the World</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto opacity-90">
            Join the Think Mall community and turn your local business into a visible, accessible digital destination.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 shadow-xl" asChild>
              <a href="/login">Register My Business</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8" asChild>
              <a href="/login">Get Help Opening</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

//               <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
//               <CardDescription>Join thousands of businesses already using our platform</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button size="lg" onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700">
//                 Register Your Business
//                 <ArrowRight className="ml-2 h-4 w-4" />
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
