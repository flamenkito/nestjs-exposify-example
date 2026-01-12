# nestjs-exposify

Multi-transport service exposure for NestJS applications. Expose your services via JSON-RPC (and more transports coming soon) with a simple decorator.

## Installation

```bash
npm install nestjs-exposify
```

## Quick Start

### 1. Import the module

```typescript
import { JsonRpcModule } from 'nestjs-exposify';
import { Module } from '@nestjs/common';

@Module({
  imports: [JsonRpcModule],
})
export class AppModule {}
```

### 2. Expose your service

```typescript
import { Expose } from 'nestjs-exposify';
import { Injectable } from '@nestjs/common';

@Expose({ transport: 'json-rpc' })
@Injectable()
export class UsersService {
  async getUsers() {
    return [{ id: '1', name: 'John' }];
  }

  async getUserById(id: string) {
    return { id, name: 'John' };
  }
}
```

### 3. Register methods on startup

```typescript
import { JsonRpcHandler, registerJsonRpcMethods } from 'nestjs-exposify';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const rpcHandler = app.get(JsonRpcHandler);
  registerJsonRpcMethods(app, rpcHandler);

  await app.listen(3000);
}
bootstrap();
```

## Usage

Send JSON-RPC 2.0 requests to `/rpc/v1`:

```bash
curl -X POST http://localhost:3000/rpc/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "method": "UsersService.getUsers", "id": 1}'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "result": [{ "id": "1", "name": "John" }],
  "id": 1
}
```

## Method Naming

RPC methods follow the pattern: `{ClassName}.{methodName}`

For a class `UsersService` with method `getUsers`, the RPC method name is `UsersService.getUsers`.

## API

### `@Expose(options)`

Class decorator to expose a service via a transport.

```typescript
interface ExposeOptions {
  transport: 'json-rpc'; // More transports coming soon
}
```

### `JsonRpcModule`

NestJS module that provides the JSON-RPC controller and handler.

### `JsonRpcHandler`

Service for registering and handling JSON-RPC methods.

### `registerJsonRpcMethods(app, handler)`

Utility function to auto-register all `@Expose({ transport: 'json-rpc' })` decorated classes.

## License

MIT
