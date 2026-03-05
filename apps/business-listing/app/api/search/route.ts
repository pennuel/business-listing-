import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Create ~20 dummy business listings
  const dummyBusinesses = Array.from({ length: 24 }).map((_, i) => ({
    id: `dummy-business-${i}`,
    name: `Premium Business Service ${i + 1}`,
    description: `This is a highly rated fake business designed for testing search functionality. They specialize in excellent customer service and fast delivery.`,
    tagline: `Unbeatable quality in our region - ${i % 3 === 0 ? "Fast" : "Reliable"} Services`,
    category: {
      id: `cat-${i % 8}`,
      categoryName: [
        "Plumbers",
        "Electricians",
        "Retail",
        "Cleaning",
        "Auto Repair",
        "Healthcare",
        "Education",
        "Catering",
      ][i % 8],
    },
    county: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"][i % 5],
    subCounty: "Central",
    address: `${100 + i} Main St, Suite ${i}`,
    contactEmail: `contact@business${i}.com`,
    contactPhone: `+254 700 ${100000 + i}`,
    website: `https://business${i}.example.com`,
    isManuallyOpen: i % 2 === 0,
    status: "active",
    rating: (Math.random() * (5 - 3) + 3).toFixed(1), // Random 3.0 to 5.0
    priceRange: [
      "Under $50",
      "$50 - $100",
      "$100 - $500",
      "Over $500",
      "Custom Quote",
    ][i % 5],
    availability: ["Available Today", "Available This Week", "Weekends Only"][
      i % 3
    ],
  }));

  return NextResponse.json({
    businesses: dummyBusinesses,
    total: dummyBusinesses.length,
  });
}
