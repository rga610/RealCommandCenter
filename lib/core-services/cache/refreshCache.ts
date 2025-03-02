// lib/core-services/cache/refreshCache.ts

import { serviceRegistry } from "@/lib/core-services/service-registry";
import { CacheService } from "./cacheService";

/**
 * A generic helper to force refresh a cache key by fetching new data.
 *
 * @param cacheKey - The key in Redis to refresh.
 * @param fetcher - A function that returns a Promise with the fresh data.
 * @param ttl - The time-to-live for the cache entry, in seconds.
 * @param purge - Whether to purge the cache key before fetching new data.
 * @returns The fresh data.
 */
export async function refreshCache<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  ttl: number,
  purge: boolean = false
): Promise<T> {
  const cache = await serviceRegistry.getService<CacheService>("cache");

  if (purge) {
    try {
      console.log(`🗑️ Purging cache for key: ${cacheKey}`);
      await cache.del(cacheKey);
    } catch (err) {
      console.error(`⚠️ Error purging cache for key ${cacheKey}:`, err);
    }
  }

  // Fetch new data.
  const freshData = await fetcher();

  // Store the fresh data in cache.
  try {
    const result = await cache.set(cacheKey, freshData, { ex: ttl });
    console.log(`✅ Cache set for key "${cacheKey}" result: ${result}`);
  } catch (err) {
    console.error(`⚠️ Error setting cache for key ${cacheKey}:`, err);
  }

  return freshData;
}
