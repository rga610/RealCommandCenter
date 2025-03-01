// app/api/media/upload/route.ts
import { NextResponse } from "next/server";
import { uploadAsset } from "@/lib/media/mediaServiceNew";
import { StorageZoneType } from "@/lib/media/types";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string || undefined;
    const folder = formData.get('folder') as string || undefined;
    const storageZone = formData.get('storageZone') as StorageZoneType || 'listing-media';
    const isPublic = formData.get('isPublic') !== 'false'; // Default to true
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    
    const asset = await uploadAsset({
      file,
      fileName,
      folder,
      storageZone,
      isPublic,
    });
    
    return NextResponse.json({ asset });
  } catch (error) {
    console.error("Error uploading asset:", error);
    return NextResponse.json({ error: "Failed to upload asset" }, { status: 500 });
  }
}