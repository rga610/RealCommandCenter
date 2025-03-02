// lib/core-services/auth/authService.ts

import { ServiceInterface } from "@/types/core-services/serviceRegistry";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { serviceRegistry } from "../service-registry";
import { AirtableService } from "../airtable/airtableService";
import { User } from "@/types/core-services/auth";
import { PermissionService } from "./permissionService";

export class AuthService implements ServiceInterface {
  private airtableService: AirtableService | null = null;

  /**
   * Initialize: optionally retrieve the Airtable service for role merging.
   */
  async initialize(): Promise<void> {
    try {
      this.airtableService = await serviceRegistry.getService<AirtableService>("airtable");
      console.log("AuthService initialized (with Airtable for roles).");
    } catch (error) {
      console.warn("Airtable not available for role management:", error);
    }
  }

  /**
   * Returns the current user from Clerk (server-side).
   */
  async getCurrentUser(): Promise<User | null> {
    // 'auth()' is async, so we must await it:
    const { userId } = await auth();
    if (!userId) return null;

    try {
      // clerkClient is now the object with .users
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUser(userId);

      // Construct our in-app User object
      return {
        id: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress ?? "",
        firstName: clerkUser.firstName ?? "",
        lastName: clerkUser.lastName ?? "",
        // Coalesce null -> ""
        imageUrl: clerkUser.imageUrl ?? "",
        roles: (clerkUser.publicMetadata?.roles as string[]) ?? [],
        metadata: clerkUser.publicMetadata,
      };
    } catch (error) {
      console.error("Error fetching user from Clerk:", error);
      return null;
    }
  }

  /**
   * Merges Clerk roles with any additional roles in Airtable.
   */
  async getUserRoles(userId?: string): Promise<string[]> {
    // If userId not passed, fetch it from Clerk's auth()
    let currentUserId = userId;
    if (!currentUserId) {
      const { userId: clerkUserId } = await auth();
      if (clerkUserId) {
        currentUserId = clerkUserId;
      }
    }
    if (!currentUserId) return [];

    // 1) Fetch roles from Clerk publicMetadata
    let clerkRoles: string[] = [];
    try {
      const clerk = await clerkClient();
      const clerkUser = await clerk.users.getUser(currentUserId);
      clerkRoles = (clerkUser.publicMetadata?.roles as string[]) ?? [];
    } catch (err) {
      console.error("Error fetching user from Clerk:", err);
    }

    // 2) If Airtable isn't available, just return Clerk roles
    if (!this.airtableService) {
      return clerkRoles;
    }

    // 3) Merge with Airtable roles, if any
    try {
      const records = await this.airtableService.fetchRecords(
        process.env.AIRTABLE_USERS_BASE_ID || "",
        process.env.AIRTABLE_USERS_TABLE_ID || "",
        { filterByFormula: `{ClerkId}='${currentUserId}'` }
      );

      if (records.length > 0 && records[0].roles) {
        const merged = new Set([...clerkRoles, ...records[0].roles]);
        return Array.from(merged);
      }
    } catch (error) {
      console.error("Error fetching user roles from Airtable:", error);
    }

    // If no Airtable data, return whatever we got from Clerk
    return clerkRoles;
  }

  /**
   * Check if the user has a specific permission (defined in PermissionService).
   */
  async hasPermission(permissionKey: string, userId?: string): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    const permService = new PermissionService();
    return permService.checkRolePermissions(roles, permissionKey);
  }

  /**
   * Check if the user can access a module (assumes "moduleKey:view" is required).
   */
  async hasModuleAccess(moduleKey: string, userId?: string): Promise<boolean> {
    const viewPermission = `${moduleKey}:view`;
    return this.hasPermission(viewPermission, userId);
  }
}

// Create and register the instance with the service registry
const authService = new AuthService();
serviceRegistry.register("auth", authService);

export { authService };
