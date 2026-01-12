import 'reflect-metadata';

const JSONRPC_METADATA_KEY = Symbol('jsonrpc');

type Constructor = new (...args: unknown[]) => object;

// Registry to store all JSON-RPC classes
const jsonRpcRegistry: Constructor[] = [];

/**
 * Class decorator that marks a class as a JSON-RPC service.
 * All methods will be auto-registered as RPC endpoints.
 */
export function JsonRpc(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(JSONRPC_METADATA_KEY, true, target);
    jsonRpcRegistry.push(target as unknown as Constructor);
  };
}

/**
 * Check if a class is decorated with @JsonRpc
 */
export function isJsonRpc(target: Constructor): boolean {
  return Reflect.getMetadata(JSONRPC_METADATA_KEY, target) === true;
}

/**
 * Get all registered JSON-RPC classes
 */
export function getJsonRpcRegistry(): Constructor[] {
  return jsonRpcRegistry;
}
