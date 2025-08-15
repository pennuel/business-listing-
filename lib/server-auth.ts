import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

/**
 * Wrapper for getting the server session in server components or API routes.
 * Usage: const session = await getServerAuthSession()
 */
export async function getServerAuthSession() {
  return await getServerSession(authOptions)
}

export default getServerAuthSession
