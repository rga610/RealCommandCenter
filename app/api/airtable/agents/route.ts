// app/api/airtable/agents/route.ts

import { NextResponse } from "next/server";
import { fetchAirtableRecords, AirtableRecord } from "@/app/lib/airtable";

export async function GET() {
    try {
        const baseId = process.env.AIRTABLE_RRHH_BASE_ID;
        const tableId = process.env.AIRTABLE_RRHH_PEOPLE_TABLE_ID;
        const viewName = "Agentes de venta";

        if (!baseId || !tableId) {
            throw new Error("❌ Missing Airtable Base ID or Table ID in environment variables!");
        }

        const rawAgents: AirtableRecord[] = await fetchAirtableRecords(baseId, tableId, viewName);

        // ✅ Fix filter logic: Exclude only if explicitly "N/A"
        const agents = rawAgents
            .filter((record) => {
                const name = record?.Nombre?.trim(); // ✅ No `.fields`
                return name && name !== "N/A";
            })
            .map((record) => ({
                id: record.id,
                name: record.Nombre || "Unnamed Agent", // ✅ Directly from `record`
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

        return NextResponse.json(agents);
    } catch (error) {
        console.error("❌ Airtable API Error:", error);
        return NextResponse.json({ error: "Failed to load agents" }, { status: 500 });
    }
}
