import { NextResponse } from "next/server";

export async function GET() {
  const dummyFilters = {
    categories: [
      "Photography",
      "Plumbers",
      "Electricians",
      "Cleaning",
      "Auto Repair",
      "Catering",
      "Healthcare",
      "Education",
      "Retail",
      "Landscaping",
      "Carpenters",
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
      "Under Ksh 1,000",
      "Ksh 1,000 - 5,000",
      "Ksh 5,000 - 20,000",
      "Over Ksh 20,000",
      "Custom Quote",
    ],
    ratings: ["4.5 & up", "4.0 & up", "3.0 & up", "New"],
    availability: ["Available Today", "Available This Week", "Weekends Only"],
  };

  return NextResponse.json(dummyFilters);
}
