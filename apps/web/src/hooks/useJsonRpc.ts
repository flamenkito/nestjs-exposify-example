import { signal } from '@preact/signals';
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

let requestId = 0;

async function jsonRpcCall<T>(method: string, params?: unknown): Promise<T> {
  const request: JsonRpcRequest = {
    jsonrpc: '2.0',
    method,
    params,
    id: ++requestId,
  };

  const response = await fetch('/rpc/v1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  const data: JsonRpcResponse<T> = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.result as T;
}

// Signals for state management
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
    return await jsonRpcCall<User>('UsersService.getUserById', id);
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to fetch user';
    return null;
  }
}
