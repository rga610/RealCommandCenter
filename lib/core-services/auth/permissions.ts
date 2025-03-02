// Permission definitions

export const PERMISSIONS = {
  LIST_PROPERTIES: {
    VIEW: 'list-properties:view',
    CREATE: 'list-properties:create',
    EDIT: 'list-properties:edit',
    DELETE: 'list-properties:delete',
    PUBLISH: 'list-properties:publish',
    // Add more specific permissions...
  },
  SELL_PROPERTIES: {
    VIEW: 'sell-properties:view',
    CREATE: 'sell-properties:create',
    EDIT: 'sell-properties:edit',
    DELETE: 'sell-properties:delete',
    // Add more specific permissions...
  },
  // Define permissions for other modules...
};

// Map roles to permissions
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  'admin': [
    // Admin has all permissions
    ...Object.values(PERMISSIONS).flatMap(modulePermissions => Object.values(modulePermissions))
  ],
  'manager': [
    // Managers have view and edit permissions, but not delete
    PERMISSIONS.LIST_PROPERTIES.VIEW,
    PERMISSIONS.LIST_PROPERTIES.CREATE,
    PERMISSIONS.LIST_PROPERTIES.EDIT,
    PERMISSIONS.LIST_PROPERTIES.PUBLISH,
    PERMISSIONS.SELL_PROPERTIES.VIEW,
    PERMISSIONS.SELL_PROPERTIES.CREATE,
    PERMISSIONS.SELL_PROPERTIES.EDIT,
    // Add more permissions...
  ],
  'agent': [
    // Agents have limited permissions
    PERMISSIONS.LIST_PROPERTIES.VIEW,
    PERMISSIONS.LIST_PROPERTIES.CREATE,
    PERMISSIONS.SELL_PROPERTIES.VIEW,
    PERMISSIONS.SELL_PROPERTIES.CREATE,
    // Add more permissions...
  ],
  // Define permissions for other roles...
};