//app\api\airtable\seller-leads\route.ts

import { NextResponse } from "next/server";
import { createAirtableRecord } from "@/lib/core-services/airtable/airtableService";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const newLead = {
            "Agent": body.agentName,
            "Date": body.reportDate,
            "First name": body.clientFirstName,
            "Last name": body.clientLastName,
            "Email": body.clientEmail,
            "Phone": body.clientPhone,
            "Related contact": body.relatedContact || '',
            "Type of related contact": body.relationshipType || '',
            "Additional information": body.additionalInfo || '',
            "Lead type": body.leadType,
            "Property address": body.propertyAddress,
            "Community": body.community || '',
            "Property details": body.propertyDetails || '',
            "Contact status": body.contactStatus,
            "Agent notes": body.agentNotes || '',
        };

        await createAirtableRecord(
            process.env.AIRTABLE_LEADS_BASE_ID || "",
            process.env.AIRTABLE_LEADS_REPORT_TABLE_ID || "",
            newLead
        );

        return NextResponse.json({ message: "Success" }, { status: 200 });

    } catch (error) {
        console.error("❌ Seller Lead Submission Failed:", error);
        return NextResponse.json({ error: "Error saving seller lead" }, { status: 500 });
    }
}
