# nestjs-exposify-example

Example NestJS application demonstrating [nestjs-exposify](https://github.com/tks2a/nestjs-exposify) library usage with a Preact frontend.

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

## Description

This project shows how to use the `nestjs-exposify` library to expose NestJS services via JSON-RPC transport using the `@Expose` decorator. Includes a Preact UI that consumes the JSON-RPC API.

## Installation

```bash
npm install
```

## Running the app

```bash
# Backend (Terminal 1)
npm run dev:api

# Frontend (Terminal 2)
npm run dev:web
```

Open http://localhost:3001 for the Preact UI with hot reload.

### Production

```bash
npm run build
npm run start:prod
```

Open http://localhost:3000 - NestJS serves both API and UI.

## Testing the JSON-RPC endpoint

```bash
# Get all users
curl -X POST http://localhost:3000/rpc/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "UsersService.getUsers", "id": 1}'

# Get user by ID
curl -X POST http://localhost:3000/rpc/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "UsersService.getUserById", "params": "user-uuid-here", "id": 2}'

# Create user
curl -X POST http://localhost:3000/rpc/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "UsersService.createUser", "params": {"name": "Alice", "email": "alice@example.com"}, "id": 3}'
```

## Project Structure

```
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── users/
│   │   │   │   ├── users.module.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   └── user.dto.ts
│   │   │   ├── shared/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── package.json
│   └── web/                    # Preact frontend
│       ├── src/
│       │   ├── components/
│       │   │   ├── UserList.tsx
│       │   │   ├── UserForm.tsx
│       │   │   └── UserCard.tsx
│       │   ├── hooks/
│       │   │   └── useJsonRpc.ts
│       │   ├── App.tsx
│       │   └── index.tsx
│       ├── vite.config.ts
│       └── package.json
└── package.json                # Workspace root
```

## Key Files

### `apps/api/src/users/users.service.ts`

```typescript
import { Expose } from 'nestjs-exposify';
import { Injectable } from '@nestjs/common';

@Expose({ transport: 'json-rpc' })
@Injectable()
export class UsersService {
  async getUsers(): Promise<UserDto[]> { ... }
  async getUserById(id: string): Promise<UserDto> { ... }
  async createUser(dto: CreateUserDto): Promise<UserDto> { ... }
}
```

### `apps/web/src/hooks/useJsonRpc.ts`

```typescript
async function jsonRpcCall<T>(method: string, params?: unknown): Promise<T> {
  const response = await fetch('/rpc/v1', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: Date.now() }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}
```

## License

This is free and unencumbered software released into the public domain. See [LICENSE](LICENSE) for details.
