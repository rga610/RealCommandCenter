// lib/core-services/serviceLoader.ts

// 1) Force the aggregator to run first:
import "@/lib/core-services/index"; // aggregator file

import { serviceRegistry } from "./service-registry";
import { ServiceType } from "@/types/core-services/serviceRegistry";

/**
 * Initialize core services required by a module.
 */
export async function initCoreServices(services: ServiceType[]): Promise<void> {
  try {
    console.log(`Initializing core services: ${services.join(", ")}`);

    for (const service of services) {
      await serviceRegistry.initializeService(service);
    }

    console.log("Core services initialization complete");
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Failed to initialize core services:", errorMessage);
    throw new Error(`Core services initialization failed: ${errorMessage}`);
  }
}
