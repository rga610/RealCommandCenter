// app/api/airtable/tests/route.ts

import { NextResponse } from "next/server";
import { createAirtableRecord } from "@/lib/core-services/airtable/airtableService";

export async function POST(req: Request) {
  try {
    console.log("📨 Received request at API");

    // ✅ Parse request body
    const body = await req.json();
    console.log("📨 Received payload:", body);

    // ✅ Extract required fields & field mapping from the frontend
    const requiredFields: string[] = body.requiredFields || [];
    const fieldMapping: Record<string, string> = body.fieldMapping || {};

    // ✅ Validate required fields dynamically
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields);
      return NextResponse.json(
        { error: `❌ Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    console.log("✅ Required fields present, preparing data for Airtable...");

    // ✅ Convert form data to Airtable format using the mapping
    const formData: Record<string, any> = {};
    Object.keys(body).forEach((key) => {
      if (fieldMapping[key]) {
        formData[fieldMapping[key]] = body[key];
      }
    });

    // ✅ Prune out empty values
    Object.keys(formData).forEach((key) => {
      if (formData[key] === undefined || formData[key] === null || formData[key] === "") {
        delete formData[key];
      }
    });

    // ✅ Call Airtable API with dynamically mapped formData
    await createAirtableRecord(
      process.env.AIRTABLE_APITESTS_BASE_ID || "",
      process.env.AIRTABLE_APITESTS_TABLE1_TABLE_ID || "",
      formData
    );

    console.log("✅ Form submitted to Airtable.");
    return NextResponse.json({ message: "✅ Form submitted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Submission Failed:", error);
    return NextResponse.json({ error: "Error saving data to Airtable" }, { status: 500 });
  }
}
