import { NextResponse } from "next/server";

export async function GET() {
  const dummyFilters = {
    categories: [
      "Plumbers",
      "Electricians",
      "Carpenters",
      "Cleaning",
      "Landscaping",
      "Auto Repair",
      "Catering",
      "Photography",
      "Retail",
      "Healthcare",
      "Education",
    ],
    locations: [
      "Nairobi",
      "Mombasa",
      "Kisumu",
      "Nakuru",
      "Eldoret",
      "Thika",
      "Malindi",
      "Kitale",
      "Garissa",
      "Kakamega",
    ],
    priceRanges: [
      "Under $50",
      "$50 - $100",
      "$100 - $500",
      "Over $500",
      "Custom Quote",
    ],
    ratings: ["4.5 & up", "4.0 & up", "3.0 & up", "New"],
    availability: ["Available Today", "Available This Week", "Weekends Only"],
  };

  return NextResponse.json(dummyFilters);
}
