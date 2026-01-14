import { signal, computed } from '@preact/signals';
import type { CreateUserDto, User } from '../types/user';

interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params?: unknown;
  id: number;
}

interface JsonRpcResponse<T> {
  jsonrpc: '2.0';
  result?: T;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: number;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

let requestId = 0;

// Auth state
export const token = signal<string | null>(localStorage.getItem('token'));
export const currentUser = signal<AuthUser | null>(
  JSON.parse(localStorage.getItem('user') || 'null')
);
export const isAuthenticated = computed(() => !!token.value);

async function jsonRpcCall<T>(method: string, params?: unknown): Promise<T> {
  const request: JsonRpcRequest = {
    jsonrpc: '2.0',
    method,
    params,
    id: ++requestId,
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token.value) {
    headers['Authorization'] = `Bearer ${token.value}`;
  }

  const response = await fetch('/rpc/v1', {
    method: 'POST',
    headers,
    body: JSON.stringify(request),
  });

  const data: JsonRpcResponse<T> = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result as T;
}

// Auth functions
export async function login(email: string, password: string): Promise<boolean> {
  loading.value = true;
  error.value = null;
  try {
    const result = await jsonRpcCall<AuthResponse>('AuthService.login', {
      email,
      password,
    });
    token.value = result.accessToken;
    currentUser.value = result.user;
    localStorage.setItem('token', result.accessToken);
    localStorage.setItem('user', JSON.stringify(result.user));
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
}

// Users state
export const users = signal<User[]>([]);
export const loading = signal(false);
export const error = signal<string | null>(null);

export async function fetchUsers(): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    users.value = await jsonRpcCall<User[]>('UsersService.getUsers');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch users';
  } finally {
    loading.value = false;
  }
}

export async function createUser(dto: CreateUserDto): Promise<User | null> {
  loading.value = true;
  error.value = null;
  try {
    const newUser = await jsonRpcCall<User>('UsersService.createUser', dto);
    users.value = [...users.value, newUser];
    return newUser;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to create user';
    return null;
  } finally {
    loading.value = false;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    return await jsonRpcCall<User>('UsersService.getUserById', { id });
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch user';
    return null;
  }
}
