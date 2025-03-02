// app/api/airtable/agents/route.ts

import { NextResponse } from "next/server";
import { initCoreServices } from "@/lib/core-services/serviceLoader";
import { getFieldCache } from "@/lib/core-services/cache/fieldCacheService";
import { agentsCacheConfig } from "@/lib/core-services/cache/fieldCacheConfigs";

export async function GET(request: Request) {
  try {
    // Ensure 'cache' and 'airtable' services are fully initialized.
    await initCoreServices(["cache", "airtable"]);

    // Check for an optional force refresh parameter
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("forceRefresh") === "true";
    console.log(`GET /api/airtable/agents -> forceRefresh: ${forceRefresh}`);
    
    // Use the generic field cache service to get agents.
    const agents = await getFieldCache(agentsCacheConfig, forceRefresh);
    
    // Set cache-control headers:
    const headers = new Headers();
    if (forceRefresh) {
      headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
      headers.set("Pragma", "no-cache");
      headers.set("Expires", "0");
    } else {
      headers.set("Cache-Control", "max-age=300, s-maxage=3600");
    }
    
    return NextResponse.json(agents, { headers });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to load agents",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
