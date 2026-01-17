// Registry of method permissions: methodName -> required permissions
export const METHOD_PERMISSIONS = new Map<string, string[]>();

// Runtime storage for role-permissions mapping
let rolePermissionsMap: Record<string, string[]> = {};

/**
 * Set the role-permissions mapping at runtime.
 * Called by AuthModule.forRoot()
 */
export function setRolePermissions<R extends string, P extends string>(mapping: Record<R, readonly P[]>): void {
  rolePermissionsMap = mapping as unknown as Record<string, string[]>;
}

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: string, permission: string): boolean {
  return rolePermissionsMap[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has all specified permissions.
 */
export function hasAllPermissions(role: string, permissions: string[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Creates a typed Permissions decorator for the given permission type.
 */
export function createPermissionsDecorator<P extends string>() {
  return function Permissions(...permissions: P[]): MethodDecorator {
    return (target: object, propertyKey: string | symbol) => {
      const className = target.constructor.name;
      const methodName = `${className}.${String(propertyKey)}`;
      METHOD_PERMISSIONS.set(methodName, permissions);
    };
  };
}

/**
 * Generic Permissions decorator (uses string type).
 * For type safety, use createPermissionsDecorator() instead.
 */
export function Permissions(...permissions: string[]): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const className = target.constructor.name;
    const methodName = `${className}.${String(propertyKey)}`;
    METHOD_PERMISSIONS.set(methodName, permissions);
  };
}
