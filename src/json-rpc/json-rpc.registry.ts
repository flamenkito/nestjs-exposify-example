import { INestApplication } from '@nestjs/common';
import { getJsonRpcRegistry } from './json-rpc.decorator';
import { JsonRpcHandler } from './json-rpc.handler';

/**
 * Scans all @JsonRpc classes and registers all their methods as RPC endpoints.
 * RPC method names follow the pattern: {ClassName}.{methodName}
 */
export function registerJsonRpcMethods(
  app: INestApplication,
  handler: JsonRpcHandler,
): void {
  const rpcClasses = getJsonRpcRegistry();

  for (const rpcClass of rpcClasses) {
    // Get the instance from NestJS DI container
    const instance = app.get(rpcClass, { strict: false });
    if (!instance) continue;

    const prototype = rpcClass.prototype as Record<string, unknown>;
    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (name) => name !== 'constructor' && typeof prototype[name] === 'function',
    );

    for (const methodName of methodNames) {
      const method = (instance as Record<string, unknown>)[methodName];
      if (typeof method !== 'function') continue;

      const boundMethod = method.bind(instance) as (
        params: unknown,
      ) => Promise<unknown>;

      const rpcName = `${rpcClass.name}.${methodName}`;

      handler.register(rpcName, undefined, boundMethod);

      console.log(`[RPC] Registered ${rpcName}`);
    }
  }
}
