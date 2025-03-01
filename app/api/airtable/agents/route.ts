// app/api/airtable/agents/route.ts

import { NextResponse } from "next/server";
import { getAndCacheAgents } from "@/lib/core-services/cache/agents";

export async function GET(request: Request) {
  try {
    // Check for an optional ?forceRefresh=true
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("forceRefresh") === "true";

    console.log(`GET /api/airtable/agents -> forceRefresh: ${forceRefresh}`);
    
    const agents = await getAndCacheAgents(forceRefresh);
    
    // Add cache control headers
    const headers = new Headers();
    
    if (forceRefresh) {
      // If this was a force refresh, tell browsers not to cache
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
    } else {
      // For normal requests, allow modest browser caching
      headers.set('Cache-Control', 'max-age=300, s-maxage=3600'); // 5 min browser, 1 hour CDN
    }
    
    // Return the agents array directly to maintain compatibility with existing code
    return NextResponse.json(agents, { headers });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: "Failed to load agents", message: error instanceof Error ? error.message : "Unknown error" }, 
      { status: 500 }
    );
  }
}