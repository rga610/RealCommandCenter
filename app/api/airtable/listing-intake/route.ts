// app\api\airtable\listing-intake\route.ts

import { NextResponse } from "next/server";
import { createAirtableRecord } from "@/app/lib/airtable";

export async function POST(req: Request) {
  try {
    console.log("📨 Received request at API");

    // ✅ Parse request body
    const body = await req.json();
    console.log("📨 Received payload:", body);

    // ✅ Validate required fields only if relevant
    const missingFields: string[] = [];

    // 1) Always required
    if (!body.ownerFullName) missingFields.push("Owner's Name");
    if (!body.canton) missingFields.push("Canton");
    if (!body.province) missingFields.push("Province");

    // 2) Conditionally require Asking Price
    //    only if user is "Sell" or "Sell or Rent"
    if (
      (body.lookingTo === "Sell" || body.lookingTo === "Sell or Rent") &&
      (body.askingPrice === undefined || body.askingPrice === null)
    ) {
      missingFields.push("Asking Price");
    }

    // 3) Conditionally require Rent Asking Price 
    //    for "Rent" or "Sell or Rent," do:
    if (
        (body.lookingTo === "Rent" || body.lookingTo === "Sell or Rent") &&
        (body.rentAskingPrice === undefined || body.rentAskingPrice === null)
    ) {
        missingFields.push("Rent Asking Price");
        }

    // If anything is missing, respond with an error
    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields);
      return NextResponse.json(
        { error: `❌ Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    console.log("✅ Required fields present, preparing data for Airtable...");

    // 1) Build the listing data with direct assignments
    const listingData: Record<string, any> = {
      "Owner Full Name": body.ownerFullName,
      "Owner Email": body.ownerEmail,
      "Owner Phone Number": body.ownerPhoneNumber,
      "Looking To": body.lookingTo,
      "Asking Price": body.askingPrice,
      "Rent Asking Price": body.rentAskingPrice,
      "Ownership Status": body.ownershipStatus,
      "Currently Rented": body.currentlyRented,
      "Monthly Rental Income": body.monthlyRentalIncome,
      "Property Type": body.propertyType,
      "Community Type": body.communityType,
      "Community Name": body.communityName,
      "H.O.A. Fee": body.hoa,
      "Town": body.town,
      "District": body.district,
      "Canton": body.canton,
      "Province": body.province,
      "Location": body.location,
      "Bedrooms": body.bedrooms,
      "Bathrooms": body.bathrooms,
      "Parking Spaces": body.parkingSpaces,
      "Lot Area": body.lotArea,
      "Constructed Area": body.constructedArea,
      "Livable Area": body.livableArea,
      "Area Metric Type": body.areaMetricType,
      "Year Built": body.yearBuilt,
      "Year Last Renovated": body.yearLastRenovated,
      // etc.
      "Amenities & Features": body.amenities,
      "Additional Notes": body.additionalNotes,
      "Existing Marketing Assets": body.existingMarketingAssets
    };

    // 2) Prune out any fields that are `undefined` or `""`
    for (const key of Object.keys(listingData)) {
      if (listingData[key] === undefined || listingData[key] === "") {
        delete listingData[key];
      }
    }

    // 3) Call Airtable API with pruned data
    await createAirtableRecord(
      process.env.AIRTABLE_LISTINGS_BASE_ID || "",
      process.env.AIRTABLE_LISTINGS_INTAKES_TABLE_ID || "",
      listingData
    );

    console.log("✅ Listing successfully submitted to Airtable.");
    return NextResponse.json(
      { message: "✅ Listing intake form submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Listing Intake Submission Failed:", error);
    return NextResponse.json(
      { error: "Error saving listing intake form" },
      { status: 500 }
    );
  }
}
