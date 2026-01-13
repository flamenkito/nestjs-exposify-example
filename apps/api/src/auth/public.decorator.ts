// Registry of public JSON-RPC methods
export const PUBLIC_METHODS = new Set<string>();

/**
 * Marks a method as public (no authentication required).
 * Works with JSON-RPC by registering the method name in a global registry.
 */
export function Public(): MethodDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const className = target.constructor.name;
    const methodName = `${className}.${String(propertyKey)}`;
    PUBLIC_METHODS.add(methodName);
  };
}
