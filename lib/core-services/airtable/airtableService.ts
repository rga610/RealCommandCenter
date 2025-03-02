// lib/core-services/airtable/airtableService.ts

import Airtable from "airtable";
import { ServiceInterface } from "@/types/core-services/serviceRegistry";
import { serviceRegistry } from "../service-registry";
import { CacheService } from "../cache/cacheService";

export interface AirtableRecord {
  id: string;
  [key: string]: any;
}

/**
 * Query options for filtering, sorting, or limiting Airtable records.
 */
export interface AirtableQueryOptions {
  view?: string;
  filterByFormula?: string;
  maxRecords?: number;
  pageSize?: number;
  sort?: Array<{ field: string; direction: "asc" | "desc" }>;
  fields?: string[];
}

/**
 * The AirtableService class handles fetching, creating, updating, and deleting
 * records from Airtable. It can optionally use the CacheService to cache query results.
 */
export class AirtableService implements ServiceInterface {
  // Optionally, a CacheService instance for internal caching.
  private cacheService: CacheService | null = null;
  private initialized = false;

  /**
   * Initialize the Airtable service. Optionally, get the CacheService from the registry.
   */
  async initialize(): Promise<void> {
    try {
      // Attempt to retrieve the CacheService for internal caching.
      this.cacheService = await serviceRegistry.getService<CacheService>("cache");
      console.log("AirtableService initialized with cache");
    } catch (err) {
      console.warn("Cache not available for AirtableService, continuing without caching:", err);
    }
    this.initialized = true;
  }

  /**
   * Internal helper to get an Airtable base instance.
   */
  private getBase(baseId: string) {
    if (!baseId) {
      throw new Error("AirtableService: Missing baseId");
    }
    return new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(baseId);
  }

  /**
   * Fetch multiple records from a table with optional query options.
   *
   * @param baseId The Airtable base ID.
   * @param tableName The table name.
   * @param options Optional query options (e.g., view, filter).
   * @param forceRefresh If true, bypass the internal cache and fetch fresh data.
   * @returns An array of AirtableRecord objects.
   */
  async fetchRecords(
    baseId: string,
    tableName: string,
    options?: AirtableQueryOptions,
    forceRefresh = false
  ): Promise<AirtableRecord[]> {
    this.ensureInitialized();
    try {
      // Build a cache key based on parameters.
      const cacheKey = `airtable:${baseId}:${tableName}:${JSON.stringify(options)}`;
      // If not forcing a refresh and caching is enabled, try to retrieve from cache.
      if (!forceRefresh && this.cacheService) {
        const cached = await this.cacheService.get<AirtableRecord[]>(cacheKey);
        if (cached) return cached;
      }

      const base = this.getBase(baseId);
      const selectOptions: Record<string, any> = { ...options };

      const records = await base(tableName).select(selectOptions).all();
      const result = records.map((rec) => ({
        id: rec.id,
        ...rec.fields,
      }));

      // If caching is enabled, store the result.
      if (this.cacheService) {
        await this.cacheService.set(cacheKey, result, { ex: 3600 }); // 1 hour TTL.
      }

      return result;
    } catch (error) {
      console.error(
        `AirtableService: Failed to fetch records from table '${tableName}' in base '${baseId}'`,
        error
      );
      throw error;
    }
  }

  /**
   * Create one or more new records in a table.
   */
  async createRecords(
    baseId: string,
    tableName: string,
    records: Array<{ fields: Record<string, any> }>
  ): Promise<AirtableRecord[]> {
    this.ensureInitialized();
    try {
      const base = this.getBase(baseId);
      const created = await base(tableName).create(records);
      return created.map((rec) => ({
        id: rec.id,
        ...rec.fields,
      }));
    } catch (error) {
      console.error(
        `AirtableService: Failed to create record(s) in table '${tableName}' (base '${baseId}')`,
        error
      );
      throw error;
    }
  }

  /**
   * Update a record by ID.
   */
  async updateRecord(
    baseId: string,
    tableName: string,
    recordId: string,
    fields: Record<string, any>
  ): Promise<AirtableRecord> {
    this.ensureInitialized();
    try {
      const base = this.getBase(baseId);
      const updated = await base(tableName).update(recordId, { ...fields });
      return {
        id: updated.id,
        ...updated.fields,
      };
    } catch (error) {
      console.error(
        `AirtableService: Failed to update record '${recordId}' in table '${tableName}', base '${baseId}'`,
        error
      );
      throw error;
    }
  }

  /**
   * Delete a record by ID.
   */
  async deleteRecord(baseId: string, tableName: string, recordId: string): Promise<boolean> {
    this.ensureInitialized();
    try {
      const base = this.getBase(baseId);
      await base(tableName).destroy(recordId);
      return true;
    } catch (error) {
      console.error(
        `AirtableService: Failed to delete record '${recordId}' in table '${tableName}', base '${baseId}'`,
        error
      );
      return false;
    }
  }

  /**
   * Ensure that the service is initialized.
   */
  private ensureInitialized() {
    if (!this.initialized) {
      throw new Error("AirtableService is not initialized. Call initialize() first.");
    }
  }
}

// Create an instance and register it with the Service Registry.
const airtableService = new AirtableService();
serviceRegistry.register("airtable", airtableService);

export { airtableService };
