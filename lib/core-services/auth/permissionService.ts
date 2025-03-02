// lib/core-services/auth/permissionService.ts

import { PERMISSIONS, ROLE_PERMISSIONS } from './permissions';

export class PermissionService {
  /**
   * Checks if any of the given roles contains the permissionKey.
   * If the permissionKey doesn't exist in the system, we return false by default.
   */
  checkRolePermissions(roles: string[], permissionKey: string): boolean {
    // If the permission doesn't exist in PERMISSIONS at all, deny
    if (!this.permissionExists(permissionKey)) {
      return false;
    }

    // Otherwise, see if any role has that permission
    return roles.some((role) => {
      const rolePermissions = ROLE_PERMISSIONS[role] || [];
      return rolePermissions.includes(permissionKey);
    });
  }

  /**
   * Confirms that permissionKey is one of the defined keys in PERMISSIONS.
   * Flatten all permissions from PERMISSIONS before checking.
   */
  private permissionExists(permissionKey: string): boolean {
    // Convert each module’s object into an array of permission strings
    const allPermissions = Object.values(PERMISSIONS).flatMap((modulePerms) =>
      Object.values(modulePerms),
    );
    return allPermissions.includes(permissionKey);
  }
}
