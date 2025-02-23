import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) return new NextResponse("Report ID is required", { status: 400 });

    try {
        const report = await db.report.findUnique({ where: { id } });

        if (!report) return new NextResponse("Report not found", { status: 404 });

        return NextResponse.json(JSON.parse(report.content));
    } catch (error) {
        console.error("Error retrieving report:", error);
        return new NextResponse("Failed to retrieve report", { status: 500 });
    }
}
