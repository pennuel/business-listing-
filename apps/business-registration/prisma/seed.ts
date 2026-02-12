import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create sample businesses
  const business1 = await prisma.business.create({
    data: {
      name: "Tech Solutions Kenya",
      phone: "+254712345678",
      email: "info@techsolutions.co.ke",
      website: "https://techsolutions.co.ke",
      offeringType: "services",
      category: "Technology Services",
      description:
        "We provide comprehensive IT solutions for businesses including web development, mobile apps, and system integration.",
      country: "Kenya",
      county: "Nairobi",
      subCounty: "Westlands",
      address: "Westlands Square, Ring Road",
      pin: "00100",
      weekdaySchedule: {
        monday: { open: "08:00", close: "17:00", isOpen: true },
        tuesday: { open: "08:00", close: "17:00", isOpen: true },
        wednesday: { open: "08:00", close: "17:00", isOpen: true },
        thursday: { open: "08:00", close: "17:00", isOpen: true },
        friday: { open: "08:00", close: "17:00", isOpen: true },
      },
      weekendSchedule: {
        saturday: { open: "09:00", close: "13:00", isOpen: true },
        sunday: { open: "09:00", close: "13:00", isOpen: false },
      },
      holidayHours: { open: "10:00", close: "14:00", isOpen: false },
      status: "active",
      paymentStatus: "paid",
    },
  })

  const business2 = await prisma.business.create({
    data: {
      name: "Fresh Groceries Market",
      phone: "+254798765432",
      email: "orders@freshgroceries.co.ke",
      website: "https://freshgroceries.co.ke",
      offeringType: "goods",
      category: "Food & Beverages",
      description: "Fresh organic groceries, fruits, vegetables, and household items delivered to your doorstep.",
      country: "Kenya",
      county: "Nairobi",
      subCounty: "Kasarani",
      address: "Kasarani Shopping Center, Thika Road",
      pin: "00618",
      weekdaySchedule: {
        monday: { open: "07:00", close: "20:00", isOpen: true },
        tuesday: { open: "07:00", close: "20:00", isOpen: true },
        wednesday: { open: "07:00", close: "20:00", isOpen: true },
        thursday: { open: "07:00", close: "20:00", isOpen: true },
        friday: { open: "07:00", close: "20:00", isOpen: true },
      },
      weekendSchedule: {
        saturday: { open: "07:00", close: "21:00", isOpen: true },
        sunday: { open: "08:00", close: "19:00", isOpen: true },
      },
      holidayHours: { open: "08:00", close: "16:00", isOpen: true },
      status: "pending_payment",
      paymentStatus: "pending",
    },
  })

  console.log("Seed data created:", { business1, business2 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
