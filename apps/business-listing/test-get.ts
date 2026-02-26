import { businessService } from "@think-id/database";

async function main() {
    console.log("Fetching");
    const id = "demo-1";
    const res = await businessService.getBusinessById(id).catch(console.error);
    console.log("Amenities:", res?.amenities);
    console.log("Type of amenities:", typeof res?.amenities);
    console.log("Array?", Array.isArray(res?.amenities));
}
main();
