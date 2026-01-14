<div align="center">
  <img src="docs/assets/logo_icon_transparent_1024.png" alt="nestjs-exposify Logo" width="128">
  <h1>nestjs-exposify-example</h1>
  <p><strong>Example monorepo demonstrating nestjs-exposify</strong></p>

  [![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)
</div>

Example NestJS application demonstrating [nestjs-exposify](https://github.com/tks2a/nestjs-exposify) library usage with Preact and Angular frontends. Includes:
- Reusable JWT authentication library with permission-based RBAC
- Client generation via [exposify-codegen](https://github.com/tks2a/exposify-codegen)
- Preact UI that consumes the JSON-RPC API
- Angular 21 UI (zoneless, signal forms) that consumes the JSON-RPC API

## Installation

```bash
npm install
```

## Running the app

### Development

Use [workgraph](https://github.com/tks2a/workgraph) for coordinated builds with file watching:

```bash
# Watch libs + run API and Angular dev servers
npm run dev -- api web-angular

# Watch libs + run API and Preact dev servers
npm run dev -- api web-preact

# Watch libs only
npm run dev
```

- http://localhost:3001 - Preact UI (hot reload)
- http://localhost:3002 - Angular UI (hot reload)

### Production

```bash
npm run build
npm run start:prod
```

- http://localhost:3000/preact - Preact UI
- http://localhost:3000/angular - Angular UI

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
│   ├── web-preact/             # Preact frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── App.tsx
│   │   │   └── index.tsx
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── web-angular/            # Angular 21 frontend (zoneless)
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/
│       │   │   ├── services/
│       │   │   ├── models/
│       │   │   └── app.component.ts
│       │   ├── main.ts
│       │   └── styles.css
│       ├── angular.json
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
│   └── utils/                  # Shared utilities
│       ├── src/
│       │   ├── by-id.ts            # byId predicate helper
│       │   ├── required.ts         # required() assertion helper
│       │   └── index.ts
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

## Client Generation (exposify-codegen)

This project uses [exposify-codegen](https://github.com/tks2a/exposify-codegen) to generate typed clients from NestJS `@Expose` decorated services. Client generation is **automatic** via [workgraph](https://github.com/tks2a/workgraph) source configuration.

### Automatic Generation

The `workgraph.sources` configuration in `package.json` automatically regenerates the Angular client when building:

```json
{
  "workgraph": {
    "sources": {
      "apps/web-angular/src/generated": "npx exposify-codegen api -o ./apps/web-angular/src/generated"
    }
  }
}
```

When you run `npm run build` or `npm run dev`, workgraph detects that `web-angular` imports from `src/generated` and automatically runs the exposify-codegen command before building.

### Manual Generation

You can also generate manually:

```bash
npx exposify-codegen api -o ./apps/web-angular/src/generated
```

### Generated Output

```
apps/web-angular/src/generated/
├── json-rpc.client.ts      # JSON-RPC client
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

## Utils Library (`@example/utils`)

Shared utility functions used across the monorepo.

### Functions

```typescript
import { byId, required } from '@example/utils';

// byId - Create predicate for finding items by ID
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const user = users.find(byId(1));  // { id: 1, name: 'Alice' }

// required - Assert required values with custom error types
const userId = params.id ?? required('userId');
const userId = params.id ?? required('userId', NotFoundException);
```

## Build Orchestration

This project uses [workgraph](https://github.com/tks2a/workgraph) for dependency-aware builds in watch mode.

```bash
# Install workgraph globally (optional)
npm install -g workgraph

# Or use via npx (used in npm scripts)
npx workgraph analyze    # Show dependency graph
npx workgraph build      # Build all projects in dependency order
npx workgraph watch      # Watch mode with automatic rebuilds
```

The `npm run dev` script uses workgraph to:
- Watch all projects for file changes
- Only rebuild affected libraries (filtered to `libs/*`)
- Optionally start app dev servers with prefixed output

## License

This is free and unencumbered software released into the public domain. See [LICENSE](LICENSE) for details.
