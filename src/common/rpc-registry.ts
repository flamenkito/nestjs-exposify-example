import { INestApplication } from '@nestjs/common';
import { getFacadeRegistry } from '../decorators/facade.decorator';
import { JsonRpcHandler } from './json-rpc-handler';

/**
 * Scans all @Facade classes and registers all their methods as RPC endpoints.
 * RPC method names follow the pattern: {ClassName}.{methodName}
 */
export function registerFacadeRpcMethods(
  app: INestApplication,
  handler: JsonRpcHandler,
): void {
  const facades = getFacadeRegistry();

  for (const facadeClass of facades) {
    // Get the instance from NestJS DI container
    const instance = app.get(facadeClass, { strict: false });
    if (!instance) continue;

    const prototype = facadeClass.prototype as Record<string, unknown>;
    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (name) => name !== 'constructor' && typeof prototype[name] === 'function',
    );

    for (const methodName of methodNames) {
      const method = (instance as Record<string, unknown>)[methodName];
      if (typeof method !== 'function') continue;

      const boundMethod = method.bind(instance) as (
        params: unknown,
      ) => Promise<unknown>;

      const rpcName = `${facadeClass.name}.${methodName}`;

      handler.register(rpcName, undefined, boundMethod);

      console.log(`[RPC] Registered ${rpcName}`);
    }
  }
}
