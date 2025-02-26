// app/api/airtable/agents/refresh/route.ts

import { NextResponse } from "next/server";
import { forceRefreshAgentsCache } from "@/app/lib/agents";

export async function POST() {
  try {
    const timestamp = new Date().toISOString();
    console.log(`🔄 Admin is explicitly refreshing the agent list at ${timestamp}...`);
    
    // Use our explicit refresh function with cache purge
    const freshAgents = await forceRefreshAgentsCache();
    
    console.log(`🔄 REFRESH COMPLETED: ${freshAgents.length} agents updated in cache at ${timestamp}`);

    // Set cache control headers to ensure no caching
    const headers = new Headers();
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    // Return the fresh data
    return NextResponse.json(freshAgents, { headers });
  } catch (error) {
    console.error("❌ Error refreshing agents cache:", error);
    return NextResponse.json(
      { 
        error: "Failed to refresh agent list", 
        message: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    );
  }
}