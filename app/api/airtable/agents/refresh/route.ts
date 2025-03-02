// app/api/airtable/agents/refresh/route.ts

import { NextResponse } from "next/server";
import { initCoreServices } from "@/lib/core-services/serviceLoader";
import { getFieldCache } from "@/lib/core-services/cache/fieldCacheService";
import { agentsCacheConfig } from "@/lib/core-services/cache/fieldCacheConfigs";

export async function POST() {
  try {
    // Ensure 'cache' and 'airtable' services are fully initialized.
    await initCoreServices(["cache", "airtable"]);

    const timestamp = new Date().toISOString();
    console.log(`🔄 Admin is explicitly refreshing the agent list at ${timestamp}...`);
    
    // Force a refresh by passing true
    const freshAgents = await getFieldCache(agentsCacheConfig, true);
    
    console.log(`🔄 REFRESH COMPLETED: ${freshAgents.length} agents updated in cache at ${timestamp}`);

    // Set cache control headers to prevent browser caching
    const headers = new Headers();
    headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");

    return NextResponse.json(freshAgents, { headers });
  } catch (error) {
    console.error("❌ Error refreshing agents cache:", error);
    return NextResponse.json(
      {
        error: "Failed to refresh agent list",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
