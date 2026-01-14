# nestjs-exposify-example

Example NestJS application demonstrating [nestjs-exposify](https://github.com/tks2a/nestjs-exposify) library usage with a Preact frontend.

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

## Description

This project shows how to use the `nestjs-exposify` library to expose NestJS services via JSON-RPC transport using the `@Expose` decorator. Includes:
- Reusable JWT authentication library with permission-based RBAC
- Angular client generator (ts-morph AST parsing)
- Preact UI that consumes the JSON-RPC API

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

## Authentication

JWT-based authentication with role permissions provided by `@example/auth` library.

### Test Users

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| admin@example.com | password | admin | user:create, user:read, user:update, user:delete |
| user@example.com | password | user | user:read |

### Login

```bash
curl -X POST http://localhost:3000/rpc/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"AuthService.login","params":{"email":"admin@example.com","password":"password"},"id":1}'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "accessToken": "eyJhbG...",
    "user": { "id": "...", "name": "Admin", "email": "admin@example.com", "role": "admin" }
  },
  "id": 1
}
```

### Using the Token

```bash
TOKEN="eyJhbG..."

curl -X POST http://localhost:3000/rpc/v1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"jsonrpc":"2.0","method":"UsersService.getUsers","id":1}'
```

## Testing the JSON-RPC endpoint

```bash
# Login and get token
TOKEN=$(curl -s http://localhost:3000/rpc/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"AuthService.login","params":{"email":"admin@example.com","password":"password"},"id":1}' \
  | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

# Get all users (requires user:read)
curl -X POST http://localhost:3000/rpc/v1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"jsonrpc":"2.0","method":"UsersService.getUsers","id":1}'

# Create user (requires user:create - admin only)
curl -X POST http://localhost:3000/rpc/v1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"jsonrpc":"2.0","method":"UsersService.createUser","params":{"name":"Alice","email":"alice@example.com"},"id":2}'
```

## Project Structure

```
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/           # App-specific auth (service, DTOs)
│   │   │   ├── users/
│   │   │   ├── shared/
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── package.json
│   └── web/                    # Preact frontend
│       ├── src/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── App.tsx
│       │   └── index.tsx
│       ├── vite.config.ts
│       └── package.json
├── libs/
│   ├── auth/                   # Reusable auth library
│   │   ├── src/
│   │   │   ├── auth.module.ts      # AuthModule.forRoot()
│   │   │   ├── auth.guard.ts       # JwtAuthGuard
│   │   │   ├── auth.dto.ts         # AuthUser, AuthResponse, JwtPayload
│   │   │   ├── public.decorator.ts # @Public()
│   │   │   ├── permissions.decorator.ts # @Permissions()
│   │   │   └── index.ts
│   │   └── package.json
│   └── client-gen/             # Angular client generator
│       ├── src/
│       │   ├── cli.ts              # CLI entry point
│       │   ├── parser.ts           # ts-morph AST parsing
│       │   ├── generator.ts        # Code generation
│       │   └── templates/          # Output templates
│       └── package.json
└── package.json                # Workspace root
```

## Auth Library (`@example/auth`)

Reusable NestJS authentication library with JWT and permission-based RBAC. Supports fully typed custom roles and permissions.

### Setup with Typed Config

1. Define your app's roles and permissions (`auth.config.ts`):

```typescript
import { createPermissionsDecorator } from '@example/auth';

// Define your roles
export type Role = 'admin' | 'user';

// Define your permissions
export type Permission = 'user:create' | 'user:read' | 'user:update' | 'user:delete';

// Role-to-permissions mapping (fully typed)
export const ROLE_PERMISSIONS = {
  admin: ['user:create', 'user:read', 'user:update', 'user:delete'],
  user: ['user:read'],
} as const satisfies Record<Role, readonly Permission[]>;

// Create typed Permissions decorator
export const Permissions = createPermissionsDecorator<Permission>();
```

2. Configure the module:

```typescript
import { AuthModule } from '@example/auth';
import { ROLE_PERMISSIONS } from './auth.config';

@Module({
  imports: [
    AuthModule.forRoot({
      secret: process.env.JWT_SECRET || 'your-secret',
      expiresIn: '1d',
      rolePermissions: ROLE_PERMISSIONS,  // Typed!
    }),
  ],
})
export class AppModule {}
```

### Decorators

```typescript
import { Public } from '@example/auth';
import { Permissions } from './auth.config';  // Use typed decorator

@Injectable()
export class MyService {
  @Public()  // No auth required
  async publicMethod() { ... }

  @Permissions('user:read')  // TypeScript enforces valid permission
  async protectedMethod() { ... }

  @Permissions('user:read', 'user:update')  // Requires ALL permissions
  async multiPermMethod() { ... }

  @Permissions('invalid:perm')  // TS Error: not assignable to Permission
  async invalidMethod() { ... }
}
```

### Generic Types

```typescript
import { AuthUser, AuthResponse, JwtPayload } from '@example/auth';
import { Role } from './auth.config';

// Types are generic - pass your Role type
const user: AuthUser<Role> = { id: '...', name: '...', email: '...', role: 'admin' };
const response: AuthResponse<Role> = { accessToken: '...', user };
```

## Client Generator (`@example/client-gen`)

Generate Angular HTTP clients from NestJS services decorated with `@Expose({ transport: 'json-rpc' })`.

### Usage

```bash
# Build the generator
npm run build:client-gen

# Generate Angular client
npm run generate:client

# Or use CLI directly
npx @example/client-gen -i ./apps/api/src -o ./generated -e /rpc/v1
```

### CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `-i, --input <path>` | Source directory to scan | (required) |
| `-o, --output <path>` | Output directory | (required) |
| `-e, --endpoint <path>` | JSON-RPC endpoint | `/rpc/v1` |

### Generated Output

```
generated/
├── json-rpc.client.ts      # Base JSON-RPC client
├── services/
│   ├── auth-service.service.ts
│   ├── users-service.service.ts
│   └── index.ts
├── models/
│   ├── user-dto.ts
│   ├── login-dto.ts
│   └── index.ts
└── index.ts
```

### Example

**Input (NestJS):**
```typescript
@Expose({ transport: 'json-rpc' })
@Injectable()
export class UsersService {
  @Permissions('user:read')
  async getUsers(): Promise<UserDto[]> { ... }

  @Permissions('user:create')
  async createUser(dto: CreateUserDto): Promise<UserDto> { ... }
}
```

**Output (Angular):**
```typescript
@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private rpc: JsonRpcClient) {}

  getUsers(): Observable<UserDto[]> {
    return this.rpc.call<UserDto[]>('UsersService.getUsers');
  }

  createUser(dto: CreateUserDto): Observable<UserDto> {
    return this.rpc.call<UserDto>('UsersService.createUser', dto);
  }
}
```

### Using in Angular

```typescript
// app.module.ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
})
export class AppModule {}

// component.ts
import { UsersService } from './generated';

@Component({ ... })
export class MyComponent {
  constructor(private users: UsersService) {}

  loadUsers() {
    this.users.getUsers().subscribe(users => console.log(users));
  }
}
```

## License

This is free and unencumbered software released into the public domain. See [LICENSE](LICENSE) for details.
