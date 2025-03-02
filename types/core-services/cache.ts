// types/core-services/cache.ts

/**
 * CacheOptions describes the optional arguments
 * that can be passed to certain Redis operations,
 * such as the NX/XX/EX flags.
 */
export interface CacheOptions {
  /**
   * The expiry time in seconds.
   * For example, ex: 3600 -> key is valid for 1 hour.
   */
  ex?: number;

  /**
   * Set the specified expire time, in milliseconds.
   */
  px?: number;

  /**
   * Set the key only if it does NOT exist.
   */
  nx?: boolean;

  /**
   * Set the key only if it already exists.
   */
  xx?: boolean;

  /**
   * Preserve the existing TTL (Upstash name: keepttl).
   */
  keepTtl?: boolean;
}

// do we use this?
export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<'OK' | null>;
  del(key: string): Promise<number>;
  exists(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  ttl(key: string): Promise<number>;
  hget<T>(key: string, field: string): Promise<T | null>;
  hset(key: string, field: string, value: any): Promise<number>;
  hgetall<T>(key: string): Promise<Record<string, T> | null>;
  hdel(key: string, ...fields: string[]): Promise<number>;
}