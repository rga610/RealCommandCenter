// app/api/media/delete/route.ts
import { NextResponse } from "next/server";
import { deleteAsset } from "@/lib/media/mediaServiceNew";
import { StorageZoneType } from "@/lib/media/types";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    const storageZone = searchParams.get('storageZone') as StorageZoneType;
    
    if (!path || !storageZone) {
      return NextResponse.json({ error: "Path and storageZone are required" }, { status: 400 });
    }
    
    const success = await deleteAsset(storageZone, path);
    return NextResponse.json({ success });
  } catch (error) {
    console.error("Error deleting asset:", error);
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}