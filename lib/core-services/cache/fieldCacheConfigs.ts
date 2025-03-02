// lib/core-services/cache/fieldCacheConfigs.ts

import { serviceRegistry } from "../service-registry";
import { AirtableService } from "../airtable/airtableService";

export interface FieldCacheConfig<T> {
  /** The cache key to use in Redis */
  key: string;
  /** Time-to-live for the cached data, in seconds */
  ttl: number;
  /**
   * A function that fetches the fresh data when needed.
   * When called, it should bypass any internal caching and return up-to-date data.
   */
  fetcher: () => Promise<T>;
}

// Example configuration for the agents field.
export const agentsCacheConfig: FieldCacheConfig<any[]> = {
  key: "agents_list",
  ttl: 21600, // 6 hours
  fetcher: async () => {
    // Retrieve AirtableService from the registry.
    const airtable = await serviceRegistry.getService<AirtableService>("airtable");
    const baseId = process.env.AIRTABLE_RRHH_BASE_ID;
    const tableId = process.env.AIRTABLE_RRHH_PEOPLE_TABLE_ID;
    const viewName = "Agentes de venta";
    if (!baseId || !tableId) {
      throw new Error("Missing Airtable Base ID or Table ID in environment variables!");
    }
    // Force a fresh fetch from Airtable (bypass any internal cache).
    const rawAgents = await airtable.fetchRecords(baseId, tableId, { view: viewName }, true);
    // Process and return a simplified array of agents.
    return rawAgents
      .filter((record) => {
        const name = record?.Nombre?.trim();
        return name && name !== "N/A";
      })
      .map((record) => ({
        id: record.id,
        name: record.Nombre || "Unnamed Agent",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },
};

// Export additional field configurations here as needed.
