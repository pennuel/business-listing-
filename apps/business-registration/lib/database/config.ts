// Database configuration and connection management
import { PrismaClient } from "@prisma/client"

// Database configuration interface
export interface DatabaseConfig {
  url: string
  maxConnections?: number
  connectionTimeout?: number
  queryTimeout?: number
}

// Environment-based database configuration
export const databaseConfig: DatabaseConfig = {
  url: process.env.DATABASE_URL || "",
  maxConnections: Number.parseInt(process.env.DB_MAX_CONNECTIONS || "10"),
  connectionTimeout: Number.parseInt(process.env.DB_CONNECTION_TIMEOUT || "10000"),
  queryTimeout: Number.parseInt(process.env.DB_QUERY_TIMEOUT || "5000"),
}

// Prisma client singleton with configuration
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    datasources: {
      db: {
        url: databaseConfig.url,
      },
    },
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Database connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Graceful database disconnection
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error("Error disconnecting from database:", error)
  }
}
