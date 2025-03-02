/**
 * Defines the possible types of services in our system.
 */
export type ServiceType = 'cache' | 'airtable' | 'auth' | 'dam' | 'email' | 'notifications';
/**
 * The base interface that all services must implement.
 */
export interface ServiceInterface {
   /**
  * Initialize the service and get it ready for use.
  */
  initialize(): Promise<void>;
}

  