// 3. API Route for Marketing Assets
// app/api/media/marketing-assets/route.ts
import { NextResponse } from "next/server";
import { getMarketingAssets } from "@/app/lib/media/mediaService";

export async function GET() {
  try {
    const assets = await getMarketingAssets();
    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Error fetching marketing assets:", error);
    return NextResponse.json({ error: "Failed to fetch marketing assets" }, { status: 500 });
  }
}