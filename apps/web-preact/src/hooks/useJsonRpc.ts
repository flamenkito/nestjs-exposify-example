import { signal, computed } from '@preact/signals';
import { byId } from '@example/utils';
import { setAuthToken } from '../generated';
import {
  login as apiLogin,
  getUsers as apiGetUsers,
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from '../generated/services';
import type { UserDto, AuthUser, Role } from '../generated';

// Auth state
export const token = signal<string | null>(localStorage.getItem('token'));
export const currentUser = signal<AuthUser<Role> | null>(
  JSON.parse(localStorage.getItem('user') || 'null')
);
export const isAuthenticated = computed(() => !!token.value);

// Initialize auth token from storage
if (token.value) {
  setAuthToken(token.value);
}

// Auth functions
export async function login(email: string, password: string): Promise<boolean> {
  loading.value = true;
  error.value = null;
  try {
    const result = await apiLogin({ email, password });
    token.value = result.accessToken;
    currentUser.value = result.user;
    localStorage.setItem('token', result.accessToken);
    localStorage.setItem('user', JSON.stringify(result.user));
    setAuthToken(result.accessToken);
    return true;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Login failed';
    return false;
  } finally {
    loading.value = false;
  }
}

export function logout(): void {
  token.value = null;
  currentUser.value = null;
  users.value = [];
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setAuthToken(null);
}

// Users state
export const users = signal<UserDto[]>([]);
export const loading = signal(false);
export const error = signal<string | null>(null);
export const selectedUser = signal<UserDto | null>(null);
export const showCreateForm = signal(false);
export const editing = signal(false);
export const deleting = signal(false);

export async function fetchUsers(): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    users.value = await apiGetUsers();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch users';
  } finally {
    loading.value = false;
  }
}

export async function createUser(name: string, email: string): Promise<UserDto | null> {
  loading.value = true;
  error.value = null;
  try {
    const newUser = await apiCreateUser({ name, email });
    users.value = [...users.value, newUser];
    return newUser;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to create user';
    return null;
  } finally {
    loading.value = false;
  }
}

export async function updateUser(id: string, name: string, email: string): Promise<UserDto | null> {
  loading.value = true;
  error.value = null;
  try {
    const updatedUser = await apiUpdateUser({ id, name, email });
    users.value = users.value.map((u) => (byId(updatedUser.id)(u) ? updatedUser : u));
    return updatedUser;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to update user';
    return null;
  } finally {
    loading.value = false;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  deleting.value = true;
  error.value = null;
  try {
    await apiDeleteUser({ id });
    users.value = users.value.filter((u) => !byId(id)(u));
    selectedUser.value = null;
    return true;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to delete user';
    return false;
  } finally {
    deleting.value = false;
  }
}

export function selectUser(user: UserDto | null): void {
  if (selectedUser.value?.id === user?.id) {
    selectedUser.value = null;
  } else {
    selectedUser.value = user;
    showCreateForm.value = false;
  }
  editing.value = false;
}

export function toggleCreateForm(): void {
  showCreateForm.value = !showCreateForm.value;
  if (showCreateForm.value) {
    selectedUser.value = null;
    editing.value = false;
  }
}

export function startEditing(): void {
  editing.value = true;
}

export function stopEditing(): void {
  editing.value = false;
}
