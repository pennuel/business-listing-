/**
 * Admin API proxy — thin wrapper over the Kotlin backend.
 * All admin routes live here so we can add auth middleware in one place.
 *
 * Supported resources (GET / POST / DELETE):
 *   Management:
 *     categories, businesses, reviews, businessTypes, complaints
 *   Taxonomy:
 *     sectors, industries, offerings
 *   Location:
 *     countries, counties, subCounties
 *   Aggregated:
 *     stats
 */

import { type NextRequest, NextResponse } from "next/server";

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

function paginate(data: any) {
  if (Array.isArray(data)) return { content: data, totalElements: data.length };
  return {
    content: data?.content ?? data?.item ?? [],
    totalElements: data?.totalElements ?? data?.totalItems ?? 0,
  };
}

// ── GET ────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const resource = request.nextUrl.searchParams.get("resource") || "stats";
  const page = request.nextUrl.searchParams.get("page") || "0";
  const size = request.nextUrl.searchParams.get("size") || "50";

  try {
    switch (resource) {
      // ── Management ─────────────────────────────────────────────────────
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

      // ── Taxonomy ───────────────────────────────────────────────────────
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

      // ── Location ───────────────────────────────────────────────────────
      case "countries": {
        try {
          const raw = await kfetch(
            `/api/country/getCountries?page=${page}&size=${size}`,
          );
          return NextResponse.json({ ...paginate(raw), source: "backend" });
        } catch {
          const mock = [
            {
              countryId: 1,
              countryName: "Kenya",
              countryCode: "KE",
              flagLogo: "🇰🇪",
            },
            {
              countryId: 2,
              countryName: "Uganda",
              countryCode: "UG",
              flagLogo: "🇺🇬",
            },
            {
              countryId: 3,
              countryName: "Tanzania",
              countryCode: "TZ",
              flagLogo: "🇹🇿",
            },
          ];
          return NextResponse.json({
            content: mock,
            totalElements: mock.length,
            source: "mock",
          });
        }
      }
      case "counties": {
        try {
          const raw = await kfetch(
            `/api/county/getCounties?page=${page}&size=${size}`,
          );
          return NextResponse.json({ ...paginate(raw), source: "backend" });
        } catch {
          const mock = [
            { countyId: 1, countyName: "Nairobi" },
            { countyId: 2, countyName: "Mombasa" },
            { countyId: 3, countyName: "Kisumu" },
            { countyId: 4, countyName: "Nakuru" },
            { countyId: 5, countyName: "Eldoret" },
          ];
          return NextResponse.json({
            content: mock,
            totalElements: mock.length,
            source: "mock",
          });
        }
      }
      case "subCounties": {
        try {
          const raw = await kfetch(
            `/api/subCounty/getSubCounties?page=${page}&size=${size}`,
          );
          return NextResponse.json({ ...paginate(raw), source: "backend" });
        } catch {
          const mock = [
            { subCountyId: 1, subCountyName: "Westlands", countyId: 1 },
            { subCountyId: 2, subCountyName: "Embakasi", countyId: 1 },
            { subCountyId: 3, subCountyName: "Starehe", countyId: 1 },
            { subCountyId: 4, subCountyName: "Mvita", countyId: 2 },
            { subCountyId: 5, subCountyName: "Kisumu Central", countyId: 3 },
          ];
          return NextResponse.json({
            content: mock,
            totalElements: mock.length,
            source: "mock",
          });
        }
      }

      // ── Stats ──────────────────────────────────────────────────────────
      case "stats": {
        const [biz, cats, reviews, complaints, sectors, countries] =
          await Promise.allSettled([
            kfetch<any>("/api/BusinessInfo/getBusinessInfos?page=0&size=1"),
            kfetch<any>("/api/Category/getCategories?page=0&size=1"),
            kfetch<any>("/api/Reviews/getReviews?page=0&size=1"),
            kfetch<any>("/api/Complaints/getCategories?page=0&size=1"),
            kfetch<any>("/api/sector/getSectors?page=0&size=1"),
            kfetch<any>("/api/country/getCountries?page=0&size=1"),
          ]);
        const count = (r: PromiseSettledResult<any>) =>
          r.status === "fulfilled"
            ? (r.value?.totalElements ?? r.value?.totalItems ?? null)
            : null;
        return NextResponse.json({
          businesses: count(biz),
          categories: count(cats),
          reviews: count(reviews),
          complaints: count(complaints),
          sectors: count(sectors),
          countries: count(countries),
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
  const resource = request.nextUrl.searchParams.get("resource");
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    /* empty body ok */
  }

  try {
    switch (resource) {
      // ── Management ─────────────────────────────────────────────────────
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
      case "complaints": {
        if (!body.complaint?.trim())
          return NextResponse.json(
            { error: "complaint is required" },
            { status: 400 },
          );
        const data = await kfetch("/api/Complaints/addComplaint", {
          method: "POST",
          body: JSON.stringify({ complaint: body.complaint.trim() }),
        });
        return NextResponse.json(data, { status: 201 });
      }

      // ── Taxonomy ───────────────────────────────────────────────────────
      case "sectors": {
        if (!body.sectorName?.trim())
          return NextResponse.json(
            { error: "sectorName is required" },
            { status: 400 },
          );
        const data = await kfetch("/api/sector/addSector", {
          method: "POST",
          body: JSON.stringify({ sectorName: body.sectorName.trim() }),
        });
        return NextResponse.json(data, { status: 201 });
      }
      case "industries": {
        if (!body.industryName?.trim())
          return NextResponse.json(
            { error: "industryName is required" },
            { status: 400 },
          );
        const data = await kfetch("/api/industry/addIndustry", {
          method: "POST",
          body: JSON.stringify({ industryName: body.industryName.trim() }),
        });
        return NextResponse.json(data, { status: 201 });
      }
      case "offerings": {
        if (!body.offeringName?.trim())
          return NextResponse.json(
            { error: "offeringName is required" },
            { status: 400 },
          );
        const data = await kfetch("/api/offering/addOffering", {
          method: "POST",
          body: JSON.stringify({ offeringName: body.offeringName.trim() }),
        });
        return NextResponse.json(data, { status: 201 });
      }

      // ── Location ───────────────────────────────────────────────────────
      case "countries": {
        if (!body.countryName?.trim())
          return NextResponse.json(
            { error: "countryName is required" },
            { status: 400 },
          );
        const data = await kfetch("/api/country/addCountry", {
          method: "POST",
          body: JSON.stringify({
            countryName: body.countryName.trim(),
            countryCode: body.countryCode?.trim() || null,
            flagLogo: body.flagLogo?.trim() || null,
          }),
        });
        return NextResponse.json(data, { status: 201 });
      }
      case "counties": {
        if (!body.countyName?.trim())
          return NextResponse.json(
            { error: "countyName is required" },
            { status: 400 },
          );
        const data = await kfetch("/api/county/addCounty", {
          method: "POST",
          body: JSON.stringify({
            countyName: body.countyName.trim(),
            countryId: body.countryId ? Number(body.countryId) : null,
          }),
        });
        return NextResponse.json(data, { status: 201 });
      }
      case "subCounties": {
        if (!body.subCountyName?.trim())
          return NextResponse.json(
            { error: "subCountyName is required" },
            { status: 400 },
          );
        const data = await kfetch("/api/subCounty/addSubCounty", {
          method: "POST",
          body: JSON.stringify({
            subCountyName: body.subCountyName.trim(),
            countyId: body.countyId ? Number(body.countyId) : null,
            countryId: body.countryId ? Number(body.countryId) : null,
          }),
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
  const resource = request.nextUrl.searchParams.get("resource");
  const id = request.nextUrl.searchParams.get("id");

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    switch (resource) {
      // ── Management ─────────────────────────────────────────────────────
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
      case "businessTypes": {
        await kfetch(`/api/businessType/deleteOne?id=${id}`, {
          method: "DELETE",
        });
        return NextResponse.json({ success: true });
      }

      // ── Taxonomy ───────────────────────────────────────────────────────
      case "sectors": {
        await kfetch(`/api/sector/deleteOne?id=${id}`, { method: "DELETE" });
        return NextResponse.json({ success: true });
      }
      case "industries": {
        await kfetch(`/api/industry/deleteOne?id=${id}`, { method: "DELETE" });
        return NextResponse.json({ success: true });
      }
      case "offerings": {
        await kfetch(`/api/offering/deleteOne?id=${id}`, { method: "DELETE" });
        return NextResponse.json({ success: true });
      }

      // ── Location ───────────────────────────────────────────────────────
      case "countries": {
        await kfetch(`/api/country/deleteOne?id=${id}`, { method: "DELETE" });
        return NextResponse.json({ success: true });
      }
      case "counties": {
        await kfetch(`/api/county/deleteOne?id=${id}`, { method: "DELETE" });
        return NextResponse.json({ success: true });
      }
      case "subCounties": {
        await kfetch(`/api/subCounty/deleteOne?id=${id}`, { method: "DELETE" });
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
