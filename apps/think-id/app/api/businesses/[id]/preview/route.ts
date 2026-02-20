import { type NextRequest, NextResponse } from "next/server"
import { database } from "@think-id/database"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const business = await database.businesses.getBusinessById(id)

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 })
    }

    // Normalize schedule for front-end consumption if needed
    // The database likely returns schema objects like `weekdaySchedule`
    // If the frontend expects `schedule`, we map it here.
    const normalized = {
      ...business,
      schedule: (business as any).weekdaySchedule ?? {},
      // Ensure other fields are present even if null in DB
      description: business.description || "",
      website: business.website || "",
    }

    return NextResponse.json({ business: normalized })
  } catch (err) {
    console.error("Error fetching business preview:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
