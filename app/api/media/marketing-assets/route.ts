// app/api/media/marketing-assets/route.ts
import { NextResponse } from "next/server";
import { getMarketingAssets } from "@/lib/modules/media/mediaService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get('folder') || '';
    
    const assets = await getMarketingAssets(folder);
    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Error fetching marketing assets:", error);
    return NextResponse.json({ error: "Failed to fetch marketing assets" }, { status: 500 });
  }
}