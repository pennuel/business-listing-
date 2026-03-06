/**
 * Admin API proxy — thin wrapper over the Kotlin backend.
 * All admin routes live here so we can add auth middleware in one place.
 *
 * Supported resources (GET/POST/DELETE):
 *   categories, businesses, reviews, businessTypes, complaints,
 *   sectors, industries, offerings (GET only — no Kotlin controller yet)
 *   stats (GET only — aggregated counts)
 *
 * Sector / Industry / Offering controllers do not exist in Kotlin yet.
 * Those cases fall back to mock data with { source: "mock" }.
 */

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const BACKEND =
  process.env.BUSINESS_SERVER_API_URL?.replace(/\/$/, "") ||
  "http://localhost:9080";
const TIMEOUT_MS = 10_000;

async function kfetch<T>(path: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BACKEND}${path}`, {
      ...init,
      signal: ctrl.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });
    clearTimeout(t);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json() as T;
  } catch (err: any) {
    clearTimeout(t);
    throw err;
  }
}

function paginate(data: any, page = 0, size = 50) {
  // Handle both paged { content: [] } and raw []
  if (Array.isArray(data)) return { content: data, totalElements: data.length };
  return {
    content: data?.content ?? [],
    totalElements: data?.totalElements ?? 0,
  };
}

// ── GET ────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // const session = await auth()
  // if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const resource = request.nextUrl.searchParams.get("resource") || "stats";
  const page = request.nextUrl.searchParams.get("page") || "0";
  const size = request.nextUrl.searchParams.get("size") || "50";

  try {
    switch (resource) {
      case "categories": {
        const raw = await kfetch(
          `/api/Category/getCategories?page=${page}&size=${size}`,
        );
        return NextResponse.json(paginate(raw));
      }
      case "businesses": {
        const raw = await kfetch(
          `/api/BusinessInfo/getBusinessInfos?page=${page}&size=${size}`,
        );
        return NextResponse.json(paginate(raw));
      }
      case "reviews": {
        const raw = await kfetch(
          `/api/Reviews/getReviews?page=${page}&size=${size}`,
        );
        return NextResponse.json(paginate(raw));
      }
      case "businessTypes": {
        const raw = await kfetch(
          `/api/businessType/getBusinessTypes?page=${page}&size=${size}`,
        );
        return NextResponse.json(paginate(raw));
      }
      case "complaints": {
        const raw = await kfetch(
          `/api/Complaints/getCategories?page=${page}&size=${size}`,
        );
        return NextResponse.json(paginate(raw));
      }

      // ── Taxonomy entities (no Kotlin controllers yet — mock fallback) ──
      case "sectors": {
        try {
          const raw = await kfetch(
            `/api/sector/getSectors?page=${page}&size=${size}`,
          );
          return NextResponse.json({ ...paginate(raw), source: "backend" });
        } catch {
          const mock = [
            { sectorId: 1, sectorName: "Creative Services" },
            { sectorId: 2, sectorName: "Trades" },
            { sectorId: 3, sectorName: "Food & Beverage" },
            { sectorId: 4, sectorName: "Automotive" },
            { sectorId: 5, sectorName: "Healthcare" },
            { sectorId: 6, sectorName: "Technology" },
            { sectorId: 7, sectorName: "Education" },
            { sectorId: 8, sectorName: "Real Estate" },
          ];
          return NextResponse.json({
            content: mock,
            totalElements: mock.length,
            source: "mock",
          });
        }
      }
      case "industries": {
        try {
          const raw = await kfetch(
            `/api/industry/getIndustries?page=${page}&size=${size}`,
          );
          return NextResponse.json({ ...paginate(raw), source: "backend" });
        } catch {
          const mock = [
            { industryId: 1, industryName: "Media" },
            { industryId: 2, industryName: "Construction" },
            { industryId: 3, industryName: "Hospitality" },
            { industryId: 4, industryName: "Mechanics" },
            { industryId: 5, industryName: "Retail" },
            { industryId: 6, industryName: "Finance" },
            { industryId: 7, industryName: "Manufacturing" },
          ];
          return NextResponse.json({
            content: mock,
            totalElements: mock.length,
            source: "mock",
          });
        }
      }
      case "offerings": {
        try {
          const raw = await kfetch(
            `/api/offering/getOfferings?page=${page}&size=${size}`,
          );
          return NextResponse.json({ ...paginate(raw), source: "backend" });
        } catch {
          const mock = [
            { offeringId: 1, offeringName: "Service" },
            { offeringId: 2, offeringName: "Product" },
            { offeringId: 3, offeringName: "Hybrid" },
            { offeringId: 4, offeringName: "Subscription" },
            { offeringId: 5, offeringName: "Consultation" },
          ];
          return NextResponse.json({
            content: mock,
            totalElements: mock.length,
            source: "mock",
          });
        }
      }

      case "stats": {
        // Fire all in parallel — ignore individual failures
        const [biz, cats, reviews, complaints] = await Promise.allSettled([
          kfetch<any>("/api/BusinessInfo/getBusinessInfos?page=0&size=1"),
          kfetch<any>("/api/Category/getCategories?page=0&size=1"),
          kfetch<any>("/api/Reviews/getReviews?page=0&size=1"),
          kfetch<any>("/api/Complaints/getCategories?page=0&size=1"),
        ]);
        return NextResponse.json({
          businesses:
            biz.status === "fulfilled" ? (biz.value?.totalElements ?? 0) : null,
          categories:
            cats.status === "fulfilled"
              ? (cats.value?.totalElements ?? 0)
              : null,
          reviews:
            reviews.status === "fulfilled"
              ? (reviews.value?.totalElements ?? 0)
              : null,
          complaints:
            complaints.status === "fulfilled"
              ? (complaints.value?.totalElements ?? 0)
              : null,
          backendOnline: biz.status === "fulfilled",
        });
      }
      default:
        return NextResponse.json(
          { error: "Unknown resource" },
          { status: 400 },
        );
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message, content: [], totalElements: 0 },
      { status: 502 },
    );
  }
}

// ── POST ───────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // const session = await auth()
  // if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const resource = request.nextUrl.searchParams.get("resource");
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    /* empty body ok */
  }

  try {
    switch (resource) {
      case "categories": {
        if (!body.categoryName?.trim())
          return NextResponse.json(
            { error: "categoryName is required" },
            { status: 400 },
          );
        const data = await kfetch("/api/Category/addCategory", {
          method: "POST",
          body: JSON.stringify({ categoryName: body.categoryName.trim() }),
        });
        return NextResponse.json(data, { status: 201 });
      }
      case "businessTypes": {
        if (!body.name?.trim())
          return NextResponse.json(
            { error: "name is required" },
            { status: 400 },
          );
        const data = await kfetch("/api/businessType/addBusinessType", {
          method: "POST",
          body: JSON.stringify({ name: body.name.trim() }),
        });
        return NextResponse.json(data, { status: 201 });
      }
      default:
        return NextResponse.json(
          { error: "POST not supported for resource" },
          { status: 400 },
        );
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}

// ── DELETE ─────────────────────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  // const session = await auth()
  // if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const resource = request.nextUrl.searchParams.get("resource");
  const id = request.nextUrl.searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    switch (resource) {
      case "categories": {
        await kfetch(`/api/Category/deleteOne?id=${id}`, { method: "DELETE" });
        return NextResponse.json({ success: true });
      }
      case "reviews": {
        await kfetch(`/api/Reviews/${id}`, { method: "DELETE" });
        return NextResponse.json({ success: true });
      }
      case "businesses": {
        await kfetch(`/api/BusinessInfo/${id}`, { method: "DELETE" });
        return NextResponse.json({ success: true });
      }
      case "complaints": {
        await kfetch(`/api/Complaints/deleteOne?id=${id}`, {
          method: "DELETE",
        });
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json(
          { error: "DELETE not supported for resource" },
          { status: 400 },
        );
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
