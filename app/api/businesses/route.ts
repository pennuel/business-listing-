import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const userId = searchParams.get("userId")
    const businessId = searchParams.get("id")
    const page = searchParams.get("page")
    const limit = searchParams.get("limit")
    const status = searchParams.get("status")
    const category = searchParams.get("category")

    // Filter by business ID if provided
    if (businessId) {
      const business = await database.getBusinessById(businessId)
      if (!business) {
        return NextResponse.json({ error: "Business not found" }, { status: 404 })
      }
      return NextResponse.json({ business })
    }

    // Filter by email if provided
    if (email) {
      const userBusinesses = await database.getBusinessesByEmail(email)
      return NextResponse.json({ businesses: userBusinesses })
    }

    // Filter by userId if provided
    if (userId) {
      const userBusinesses = await database.getBusinessesByUserId(userId)
      return NextResponse.json({ businesses: userBusinesses })
    }

    // Get all businesses with pagination and filters
    const options: any = {}
    if (page) options.page = Number.parseInt(page)
    if (limit) options.limit = Number.parseInt(limit)
    if (status) options.status = status
    if (category) options.category = category

    const result = await database.getAllBusinesses(options)

    if (typeof result === "object" && "businesses" in result) {
      // Paginated result
      return NextResponse.json(result)
    } else {
      // Simple array result
      return NextResponse.json({ businesses: result })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "category", "offeringType", "country", "county", "address"]
    for (const field of requiredFields) {
      if (!body[field]?.toString().trim()) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Create business using database manager
    const newBusiness = await database.createBusiness(body)

    return NextResponse.json({ success: true, business: newBusiness }, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create business" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("id")

    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 })
    }

    // Update business using database manager
    const updatedBusiness = await database.updateBusiness(businessId, body)

    if (!updatedBusiness) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, business: updatedBusiness })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update business" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get("id")

    if (!businessId) {
      return NextResponse.json({ error: "Business ID is required" }, { status: 400 })
    }

    // Delete business using database manager
    const deletedBusiness = await database.deleteBusiness(businessId)

    if (!deletedBusiness) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, business: deletedBusiness })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete business" },
      { status: 500 },
    )
  }
}
