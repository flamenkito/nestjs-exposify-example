# nestjs-exposify-example

Example NestJS application demonstrating [nestjs-exposify](https://github.com/tks2a/nestjs-exposify) library usage.

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

## Description

This project shows how to use the `nestjs-exposify` library to expose NestJS services via JSON-RPC transport using the `@Expose` decorator.

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Testing the JSON-RPC endpoint

Once the app is running, you can test the JSON-RPC endpoint:

### Get all users

```bash
curl -X POST http://localhost:3000/rpc/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "UsersService.getUsers", "id": 1}'
```

### Get user by ID

```bash
curl -X POST http://localhost:3000/rpc/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "UsersService.getUserById", "params": "user-uuid-here", "id": 2}'
```

### Create user

```bash
curl -X POST http://localhost:3000/rpc/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "UsersService.createUser", "params": {"name": "Alice", "email": "alice@example.com"}, "id": 3}'
```

## Project Structure

```
src/
├── users/
│   ├── users.module.ts
│   ├── users.service.ts    # Service exposed via @Expose decorator
│   └── user.dto.ts
├── shared/
│   ├── by-id.ts
│   └── required.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts                 # Registers JSON-RPC methods on startup
```

## Key Files

### `src/users/users.service.ts`

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

### `src/main.ts`

```typescript
import { JsonRpcHandler, registerJsonRpcMethods } from 'nestjs-exposify';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rpcHandler = app.get(JsonRpcHandler);
  registerJsonRpcMethods(app, rpcHandler);

  await app.listen(3000);
}
```

## License

This is free and unencumbered software released into the public domain. See [LICENSE](LICENSE) for details.
