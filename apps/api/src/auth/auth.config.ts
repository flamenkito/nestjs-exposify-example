import { createPermissionsDecorator } from '@example/auth';

// Define your app's roles
export type Role = 'admin' | 'user';

// Define your app's permissions
export type Permission = 'user:create' | 'user:read' | 'user:update' | 'user:delete';

// Role to permissions mapping (fully typed)
export const ROLE_PERMISSIONS = {
  admin: ['user:create', 'user:read', 'user:update', 'user:delete'],
  user: ['user:read'],
} as const satisfies Record<Role, readonly Permission[]>;

// Create typed Permissions decorator
export const Permissions = createPermissionsDecorator<Permission>();
