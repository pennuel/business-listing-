import { auth } from "./auth";

/**
 * Wrapper for getting the server session in server components or API routes.
 * Usage: const session = await getServerAuthSession()
 */
export async function getServerAuthSession() {
  return await auth();
}

export default getServerAuthSession;
