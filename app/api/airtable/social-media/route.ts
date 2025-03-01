//app\api\airtable\social-media\route.ts

import { NextResponse } from "next/server";
import { createAirtableRecord } from "@/lib/core-services/airtable/airtableService";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const socialMediaEntry = {
            "Agente": body.agentName,
            "Link": body.propertyLink,
            "Indicaciones": body.additionalNotes || '',
        };

        await createAirtableRecord(
            process.env.AIRTABLE_SOCIALMEDIA_BASE_ID || "",
            process.env.AIRTABLE_SOCIALMEDIA_TABLE_ID || "",
            socialMediaEntry
        );

        return NextResponse.json({ message: "Success" }, { status: 200 });

    } catch (error) {
        console.error("❌ Social Media Submission Failed:", error);
        return NextResponse.json({ error: "Error saving social media request" }, { status: 500 });
    }
}
