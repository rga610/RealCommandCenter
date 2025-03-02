// lib/core-services/service-registry.ts

import { ServiceType, ServiceInterface } from '@/types/core-services/serviceRegistry';


/**
 * The ServiceRegistry manages all service instances in the application.
 */
export class ServiceRegistry {
  private services: Map<ServiceType, ServiceInterface> = new Map();
  private initialized: Set<ServiceType> = new Set();
  
  // Define service dependencies
  private dependencies: Record<ServiceType, ServiceType[]> = {
    'cache': [],
    'airtable': ['cache'],
    'auth': [],
    'dam': ['airtable', 'cache'],
    'email': ['airtable'],
    'notifications': ['airtable', 'cache']
  };

  /**
   * Register a service with the registry.
   */
  register(type: ServiceType, service: ServiceInterface): void {
    this.services.set(type, service);
    console.log(`Service '${type}' registered`);
  }

  /**
   * Get a service from the registry.
   */
  async getService<T extends ServiceInterface>(type: ServiceType): Promise<T> {
    // Check if the service exists
    const service = this.services.get(type);
    if (!service) {
      throw new Error(`Service '${type}' is not registered`);
    }

    // Initialize if needed
    if (!this.initialized.has(type)) {
      await this.initializeService(type);
    }

    return service as T;
  }

  /**
   * Initialize a specific service and its dependencies.
   */
  async initializeService(type: ServiceType): Promise<void> {
    // Skip if already initialized
    if (this.initialized.has(type)) {
      return;
    }

    console.log(`Initializing service '${type}'...`);

    // Initialize dependencies first
    const dependencies = this.dependencies[type] || [];
    for (const dependency of dependencies) {
      await this.initializeService(dependency);
    }

    // Get the service
    const service = this.services.get(type);
    if (!service) {
      throw new Error(`Cannot initialize service '${type}' because it is not registered`);
    }

    // Initialize the service
    try {
      await service.initialize();
      this.initialized.add(type);
      console.log(`Service '${type}' initialized successfully`);
    } catch (err) {
      // Properly handle the error as unknown type
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to initialize service '${type}': ${errorMessage}`);
    }
  }
}

// Create and export singleton instance
export const serviceRegistry = new ServiceRegistry();