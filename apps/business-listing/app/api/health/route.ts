import { NextResponse } from "next/server"
import { businessService } from "@think-id/database"

export async function GET() {
  try {
    // Check database connection by attempting a simple query
    await businessService.getAllBusinesses({ limit: 1 })
    const isDbConnected = true

    return NextResponse.json({
      status: "healthy",
      database: {
        connected: isDbConnected,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        database: {
          connected: false,
        },
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
