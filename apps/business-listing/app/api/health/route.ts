import { NextResponse } from "next/server"
import { database, checkDatabaseConnection } from "@/lib/database"

export async function GET() {
  try {
    const isDbConnected = await checkDatabaseConnection()
    const isUsingFallback = await database.isUsingFallback()

    return NextResponse.json({
      status: "healthy",
      database: {
        connected: isDbConnected,
        usingFallback: isUsingFallback,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
