import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerAuthSession } from "@/lib/server-auth";

export async function GET(_req: NextRequest) {
  const session = await getServerAuthSession();
  return NextResponse.json({ session });
}
