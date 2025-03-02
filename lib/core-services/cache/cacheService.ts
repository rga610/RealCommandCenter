// lib/core-services/cache/cacheService.ts

import { Redis } from "@upstash/redis";
import { ServiceInterface } from "@/types/core-services/serviceRegistry";
import { CacheOptions } from "@/types/core-services/cache";
import { serviceRegistry } from "../service-registry";

/**
 * The CacheService provides Redis-based caching functionality
 * via Upstash. It fails fast on initialization but fails gracefully
 * on runtime operations.
 */
export class CacheService implements ServiceInterface {
  private client: Redis;
  private initialized = false;

  constructor() {
    this.client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    });
  }

  /**
   * Initialize the cache service and verify connection via ping.
   * Throws an error if Redis is not reachable, so the app can fail fast.
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }
    try {
      const pingResult = await this.client.ping();
      if (pingResult !== "PONG") {
        throw new Error("Failed to connect to Redis server");
      }
      this.initialized = true;
      console.log("CacheService initialized successfully");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Failed to initialize CacheService:", errorMsg);
      throw new Error(`Cache initialization failed: ${errorMsg}`);
    }
  }

  /**
   * Retrieve a value from the cache by key.
   * Returns null if not found or on error.
   */
  async get<T>(key: string): Promise<T | null> {
    this.ensureInitialized();
    try {
      return await this.client.get<T>(key);
    } catch (error) {
      console.error(`Cache get error for key "${key}":`, error);
      return null; // fail gracefully
    }
  }

  /**
   * Set a value in the cache, supporting EX/PX/NX/XX flags as needed.
   * Returns 'OK' if the operation succeeded, or null if it failed
   * (e.g., NX was set but key already existed).
   */
  async set(key: string, value: unknown, options?: CacheOptions): Promise<"OK" | null> {
    this.ensureInitialized();
    try {
      // Convert our CacheOptions to the Upstash format:
      const redisOptions: Record<string, number | boolean> = {};
      if (options?.ex !== undefined) {
        redisOptions.ex = options.ex; // expire in seconds
      }
      if (options?.px !== undefined) {
        redisOptions.px = options.px; // expire in ms
      }
      if (options?.nx === true) {
        redisOptions.nx = true;
      }
      if (options?.xx === true) {
        redisOptions.xx = true;
      }

      // Upstash returns "OK" or null
      const result = (await this.client.set(key, JSON.stringify(value), redisOptions)) as "OK" | null;
      return result;
    } catch (error) {
      console.error(`Cache set error for key "${key}":`, error);
      return null; // fail gracefully
    }
  }

  /**
   * Delete a value from the cache by key.
   * Returns the number of items deleted (0 or 1), or 0 on error.
   */
  async del(key: string): Promise<number> {
    this.ensureInitialized();
    try {
      return await this.client.del(key);
    } catch (error) {
      console.error(`Cache del error for key "${key}":`, error);
      return 0; // fail gracefully
    }
  }

  /**
   * Check if a key exists in Redis. Returns 1 if it exists, 0 if not, or 0 on error.
   */
  async exists(key: string): Promise<number> {
    this.ensureInitialized();
    try {
      return await this.client.exists(key);
    } catch (error) {
      console.error(`Cache exists error for key "${key}":`, error);
      return 0; // fail gracefully
    }
  }

  /**
   * Increment the value at a key by 1. Returns the new value, or 0 on error.
   */
  async incr(key: string): Promise<number> {
    this.ensureInitialized();
    try {
      return await this.client.incr(key);
    } catch (error) {
      console.error(`Cache incr error for key "${key}":`, error);
      return 0;
    }
  }

  /**
   * Set an expiration time (in seconds) on a key. Returns 1 if set, 0 otherwise or on error.
   */
  async expire(key: string, seconds: number): Promise<number> {
    this.ensureInitialized();
    try {
      return await this.client.expire(key, seconds);
    } catch (error) {
      console.error(`Cache expire error for key "${key}":`, error);
      return 0;
    }
  }

  /**
   * Get the time-to-live (TTL) for a key, in seconds. Returns:
   * - The TTL in seconds
   * - -1 if the key exists but no TTL is set
   * - -2 if the key does not exist
   * - -2 on error as well
   */
  async ttl(key: string): Promise<number> {
    this.ensureInitialized();
    try {
      return await this.client.ttl(key);
    } catch (error) {
      console.error(`Cache ttl error for key "${key}":`, error);
      return -2; // fail gracefully
    }
  }

  // Additional "hash" operations below as needed:

  /**
   * Retrieve a field from a hash. Returns null if not found or on error.
   */
  async hget<T>(key: string, field: string): Promise<T | null> {
    this.ensureInitialized();
    try {
      return await this.client.hget(key, field);
    } catch (error) {
      console.error(`Cache hget error for key "${key}", field "${field}":`, error);
      return null;
    }
  }

  /**
   * Set a field on a hash. Returns number of fields that were added.
   */
  async hset(key: string, field: string, value: unknown): Promise<number> {
    this.ensureInitialized();
    try {
      // Create an object with the field as a dynamic key
      const fieldValuePair = { [field]: JSON.stringify(value) };
      // Pass the key and the field-value pair object
      return await this.client.hset(key, fieldValuePair);
    } catch (error) {
      console.error(`Cache hset error for key "${key}", field "${field}":`, error);
      return 0;
    }
  }

  /**
   * Get all fields/values from a hash. Returns an object or null on error.
   */
  async hgetall<T>(key: string): Promise<Record<string, T> | null> {
    this.ensureInitialized();
    try {
      return await this.client.hgetall(key);
    } catch (error) {
      console.error(`Cache hgetall error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Delete one or more fields from a hash.
   * Returns the number of fields removed, or 0 on error.
   */
  async hdel(key: string, ...fields: string[]): Promise<number> {
    this.ensureInitialized();
    try {
      return await this.client.hdel(key, ...fields);
    } catch (error) {
      console.error(`Cache hdel error for key "${key}":`, error);
      return 0;
    }
  }

  /**
   * Confirm that the service has completed initialization.
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error("CacheService has not been initialized");
    }
  }
}

// ------------------------------------------
// KEY PART: Register this service with the registry
// ------------------------------------------

const cacheService = new CacheService();
serviceRegistry.register("cache", cacheService);

// Export the instance so other code can import or reference it if desired
export { cacheService };
