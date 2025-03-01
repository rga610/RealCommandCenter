// app/api/media/listing-assets/route.ts
import { NextResponse } from "next/server";
import { getListingMedia } from "@/lib/modules/media/mediaService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get('folder') || '';
    
    const assets = await getListingMedia(folder);
    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Error fetching listing assets:", error);
    return NextResponse.json({ error: "Failed to fetch listing assets" }, { status: 500 });
  }
}