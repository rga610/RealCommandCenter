import { NextResponse } from "next/server";
import { getListingMedia } from "@/app/lib/media/mediaService";

export async function GET() {
  try {
    const assets = await getListingMedia();
    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Error fetching listing assets:", error);
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
  }
}
