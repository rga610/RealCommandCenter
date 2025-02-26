// app/lib/agents.ts

import { fetchAirtableRecords, AirtableRecord } from "@/app/lib/airtable";
import redis from "@/lib/redis";

const CACHE_KEY = "agents_list";
const CACHE_TTL = 21600; // 6 hours

/**
 * Fetch from Redis unless forceRefresh is true.
 * If cache is empty or forceRefresh is true, fetch fresh data from Airtable.
 */
export async function getAndCacheAgents(forceRefresh = false) {
  // For force refresh, skip Redis read and go straight to Airtable
  if (forceRefresh) {
    console.log("🔄 Force refresh requested, bypassing Redis cache");
    return await fetchFreshDataAndUpdateCache(true);
  }
  
  // Try to get from Redis first
  try {
    const cachedAgents = await redis.get(CACHE_KEY);
    
    // Make sure we have valid data
    if (Array.isArray(cachedAgents) && cachedAgents.length > 0) {
      console.log(`✅ Using cached data from Redis (${cachedAgents.length} agents)`);
      return cachedAgents;
    }
    console.log("🛑 No cached data found or cache is empty");
  } catch (error) {
    console.error("⚠️ Redis error while reading cache:", error);
    // Continue to Airtable fetch on Redis error
  }

  // If we reach here, we need fresh data
  return await fetchFreshDataAndUpdateCache(false);
}

/**
 * Fetches fresh data from Airtable and updates the Redis cache
 * @param {boolean} purgeCache - Whether to delete the cache key before updating
 */
async function fetchFreshDataAndUpdateCache(purgeCache = false) {
  const baseId = process.env.AIRTABLE_RRHH_BASE_ID;
  const tableId = process.env.AIRTABLE_RRHH_PEOPLE_TABLE_ID;
  const viewName = "Agentes de venta";

  if (!baseId || !tableId) {
    throw new Error("Missing Airtable Base ID or Table ID in environment variables!");
  }

  console.log("📊 Fetching fresh data from Airtable...");
  try {
    const rawAgents: AirtableRecord[] = await fetchAirtableRecords(baseId, tableId, viewName);

    const agents = rawAgents
      .filter((record) => {
        const name = record?.Nombre?.trim();
        return name && name !== "N/A";
      })
      .map((record) => ({
        id: record.id,
        name: record.Nombre || "Unnamed Agent",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // --- PURGE EXISTING CACHE IF REQUESTED ---
    if (purgeCache) {
      try {
        console.log("🗑️ Purging existing Redis cache before update");
        await redis.del(CACHE_KEY);
      } catch (purgeError) {
        console.error("⚠️ Failed to purge Redis cache:", purgeError);
        // Continue despite purge error
      }
    }

    // --- STORE IN REDIS ---
    try {
      // Ensure we're using await here - important for error handling
      const redisResult = await redis.set(CACHE_KEY, agents, { ex: CACHE_TTL });
      console.log(`✅ Redis cache update result: ${redisResult}`);
      console.log(`✅ Updated Redis cache with ${agents.length} agents (expires in ${CACHE_TTL}s)`);
      
      // Double-check the cache was updated by reading it back
      try {
        const verifyCache = await redis.get(CACHE_KEY);
        const cacheLen = Array.isArray(verifyCache) ? verifyCache.length : 'N/A';
        console.log(`✅ Verified cache contains ${cacheLen} items`);
      } catch (verifyError) {
        console.error("⚠️ Failed to verify cache:", verifyError);
      }
    } catch (redisError) {
      console.error("⚠️ Failed to update Redis cache:", redisError);
      // Don't fail the operation if Redis write fails
    }

    return agents;
  } catch (airtableError) {
    console.error("❌ Airtable API Error:", airtableError);
    // If we have an Airtable error but there's cached data, use it as fallback
    try {
      const cachedAgents = await redis.get(CACHE_KEY);
      if (Array.isArray(cachedAgents) && cachedAgents.length > 0) {
        console.log("⚠️ Using cached data as fallback after Airtable error");
        return cachedAgents;
      }
    } catch (error) {
      // If both Airtable and Redis fail, we have no choice but to error out
      console.error("💥 Redis fallback failed after Airtable error:", error);
    }
    
    throw airtableError; // Re-throw if we have no fallback
  }
}

/**
 * Force refresh the agents cache
 * Explicitly named function for clarity in API routes
 */
export async function forceRefreshAgentsCache() {
  console.log("🔄 Forcing refresh of agents cache");
  return await fetchFreshDataAndUpdateCache(true); // Pass true to purge cache first
}