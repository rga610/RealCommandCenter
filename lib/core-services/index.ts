// lib/core-services/index.ts

// 1) Import the service registry itself:
import { serviceRegistry } from "./service-registry";

// 2) Import each service file so it self-registers with the registry:
import "./cache/cacheService";      // => runs `serviceRegistry.register("cache", cacheService)`
import "./airtable/airtableService"; // => runs `serviceRegistry.register("airtable", airtableService)`
import "./auth/authService";       // => runs `serviceRegistry.register("auth", authService)`
// import "./dam/damService";      // => runs `serviceRegistry.register("dam", damService)`
// import "./email/emailService";  // => runs `serviceRegistry.register("email", emailService)`
// import "./notifications/notificationService"; // => etc.
// ... add other service imports as needed

// 3) (Optional) Re-export the registry, service types, or convenience loaders:
export { serviceRegistry } from "./service-registry";
export { initCoreServices } from "./serviceLoader";

// You can also re-export any standard service interface, or anything else 
// that's commonly needed, like so:
// export type { ServiceInterface } from "@/types/core-services/serviceRegistry";
// export * from "./cache/cacheService"; // if you want direct access to the instance
