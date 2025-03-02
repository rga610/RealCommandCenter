// lib/core-services/cache/fieldCacheService.ts

import { serviceRegistry } from "../service-registry";
import { CacheService } from "./cacheService";
import { refreshCache } from "./refreshCache";
import { FieldCacheConfig } from "./fieldCacheConfigs";

/**
 * Retrieves cached data for a specific field.
 * If forceRefresh is true or the cache is empty, it fetches fresh data using the provided fetcher.
 *
 * @param config - Field-specific configuration (cache key, TTL, and fetcher function).
 * @param forceRefresh - If true, bypass the current cache and fetch fresh data.
 * @returns The fresh or cached data of type T.
 */
export async function getFieldCache<T>(
  config: FieldCacheConfig<T>,
  forceRefresh = false
): Promise<T> {
  const cache = await serviceRegistry.getService<CacheService>("cache");

  if (forceRefresh) {
    console.log(`🔄 Force refreshing cache for key: ${config.key}`);
    return await refreshCache(config.key, config.fetcher, config.ttl, true);
  }

  try {
    const cachedData = await cache.get<T>(config.key);
    if (cachedData !== null) {
      console.log(`✅ Using cached data for key: ${config.key}`);
      return cachedData;
    }
    console.log(`🛑 No cached data found for key: ${config.key}`);
  } catch (error) {
    console.error(`⚠️ Error reading cache for key ${config.key}:`, error);
  }

  // Fetch fresh data if cache is empty or an error occurred.
  return await refreshCache(config.key, config.fetcher, config.ttl, false);
}
