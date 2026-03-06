/**
 * /api/reviews — Reviews CRUD
 *
 * GET  /api/reviews?businessId=X   → list reviews for a business
 * POST /api/reviews                → add a review (auth required client-side)
 *
 * Proxies to the Kotlin backend: GET /api/Reviews/getReviews?businessId=X
 * and POST /api/Reviews/addReview
 * Falls back to mock data if backend is unavailable.
 */
import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BUSINESS_SERVER_API_URL?.replace(/\/$/, "") ||
  "http://localhost:9080";

async function backendFetch(path: string, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(init?.headers || {}),
      },
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  } catch (err: any) {
    clearTimeout(timer);
    throw err;
  }
}

// Mock reviews for fallback
const MOCK_REVIEWS: Record<string, any[]> = {
  __default__: [
    {
      id: "r1",
      authorName: "Wanjiku M.",
      rating: 5,
      comment:
        "Absolutely incredible service. Very professional and timely. Would highly recommend to everyone!",
      createdAt: "2026-02-10T08:30:00Z",
      reply: null,
    },
    {
      id: "r2",
      authorName: "Kamau J.",
      rating: 4,
      comment:
        "Good experience overall. The team was friendly and the quality was great. Slight delay but handled well.",
      createdAt: "2026-02-05T14:00:00Z",
      reply: "Thank you so much for the kind words, we really appreciate it!",
    },
    {
      id: "r3",
      authorName: "Odhiambo P.",
      rating: 5,
      comment:
        "Best in the area by far. Very thorough and detailed work. Will definitely use again.",
      createdAt: "2026-01-28T11:00:00Z",
      reply: null,
    },
    {
      id: "r4",
      authorName: "Fatuma A.",
      rating: 3,
      comment:
        "Decent service. Could improve on communication but the final result was acceptable.",
      createdAt: "2026-01-15T09:00:00Z",
      reply: null,
    },
  ],
};

export async function GET(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get("businessId");

  try {
    // Try Kotlin backend: GET /api/Reviews/getReviews?businessId=X
    const params = new URLSearchParams();
    params.set("page", "0");
    params.set("size", "50");
    if (businessId) params.set("businessId", businessId);

    const data = await backendFetch(
      `/api/Reviews/getReviews?${params.toString()}`,
    );
    const reviews = Array.isArray(data) ? data : (data?.content ?? []);
    return NextResponse.json({
      reviews,
      total: reviews.length,
      source: "backend",
    });
  } catch (err: any) {
    console.warn(
      `[reviews GET] Backend unavailable: ${err?.message}. Using mock.`,
    );
    const mockList = MOCK_REVIEWS.__default__;
    return NextResponse.json({
      reviews: mockList,
      total: mockList.length,
      source: "mock",
    });
  }
}

export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { businessId, authorName, rating, comment } = body;
  if (!businessId || !authorName || !rating || !comment) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
  }

  try {
    const data = await backendFetch("/api/Reviews/addReview", {
      method: "POST",
      body: JSON.stringify({ businessId, authorName, rating, comment }),
    });
    return NextResponse.json({ success: true, review: data }, { status: 201 });
  } catch (err: any) {
    console.warn(
      `[reviews POST] Backend unavailable: ${err?.message}. Simulating success.`,
    );
    const mockReview = {
      id: `mock-${Date.now()}`,
      authorName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      reply: null,
    };
    return NextResponse.json(
      { success: true, review: mockReview },
      { status: 201 },
    );
  }
}
