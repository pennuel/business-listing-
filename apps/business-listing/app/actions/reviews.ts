"use server";

import { revalidatePath } from "next/cache";

const BACKEND_URL =
  process.env.BUSINESS_SERVER_API_URL?.replace(/\/$/, "") ||
  "http://localhost:9080";

export interface ReviewPayload {
  businessId: string;
  authorName: string;
  rating: number;
  comment: string;
}

export async function addReviewAction(payload: ReviewPayload) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/Reviews/addReview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Backend responded ${res.status}`);
    }

    const data = await res.json();
    revalidatePath(`/window/${payload.businessId}`);
    revalidatePath(`/window/${payload.businessId}/reviews`);
    return { success: true, review: data };
  } catch (err: any) {
    // During dev (no server), simulate success
    console.warn(
      "[addReviewAction] Backend unavailable — simulating:",
      err?.message,
    );
    return {
      success: true,
      review: {
        id: `tmp-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
        reply: null,
      },
      _simulated: true,
    };
  }
}

export async function fetchReviewsAction(businessId: string) {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/Reviews/getReviews?businessId=${encodeURIComponent(businessId)}&page=0&size=50`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.content ?? []);
  } catch {
    // Return mock data
    return [
      {
        id: "r1",
        authorName: "Wanjiku M.",
        rating: 5,
        comment: "Absolutely incredible service. Very professional and timely!",
        createdAt: "2026-02-10T08:30:00Z",
        reply: null,
      },
      {
        id: "r2",
        authorName: "Kamau J.",
        rating: 4,
        comment:
          "Good experience overall. The team was friendly and the quality was great.",
        createdAt: "2026-02-05T14:00:00Z",
        reply: "Thank you so much for the kind words!",
      },
      {
        id: "r3",
        authorName: "Odhiambo P.",
        rating: 5,
        comment: "Best in the area by far. Very thorough and detailed work.",
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
    ];
  }
}
