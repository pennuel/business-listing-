import { NextResponse } from "next/server"
import { checkDatabaseConnection } from "@think-id/database"

export async function GET() {
  try {
    const isDbConnected = await checkDatabaseConnection()

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
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
