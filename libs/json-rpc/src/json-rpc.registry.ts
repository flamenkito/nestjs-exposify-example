import { INestApplication } from '@nestjs/common';
import { getExposeRegistry } from './expose.decorator';
import { JsonRpcHandler } from './json-rpc.handler';

/**
 * Scans all @Expose({ transport: 'json-rpc' }) classes and registers their methods as RPC endpoints.
 * RPC method names follow the pattern: {ClassName}.{methodName}
 */
export function registerJsonRpcMethods(
  app: INestApplication,
  handler: JsonRpcHandler,
): void {
  const rpcClasses = getExposeRegistry('json-rpc');

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

      console.log(`[JSON-RPC] Registered ${rpcName}`);
    }
  }
}
