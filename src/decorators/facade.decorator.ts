import 'reflect-metadata';

const FACADE_METADATA_KEY = Symbol('facade');

// Registry to store all facade classes
const facadeRegistry: Function[] = [];

/**
 * Class decorator that marks a class as a Facade.
 * All facade classes can be discovered and their methods logged on app startup.
 */
export function Facade(): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(FACADE_METADATA_KEY, true, target);
    facadeRegistry.push(target);
  };
}

/**
 * Check if a class is decorated with @Facade
 */
export function isFacade(target: Function): boolean {
  return Reflect.getMetadata(FACADE_METADATA_KEY, target) === true;
}

/**
 * Get all registered facade classes
 */
export function getFacadeRegistry(): Function[] {
  return facadeRegistry;
}

/**
 * Scan all facade classes and log their names and method names
 */
export function scanFacades(): void {
  console.log('[Facade] Scanning registered facades...');

  for (const facade of facadeRegistry) {
    const methodNames = Object.getOwnPropertyNames(facade.prototype).filter(
      (name) =>
        name !== 'constructor' &&
        typeof facade.prototype[name] === 'function',
    );

    console.log(`[Facade] ${facade.name}`);
    console.log(`  Methods: ${methodNames.join(', ') || '(none)'}`);
  }

  console.log(`[Facade] Total facades: ${facadeRegistry.length}`);
}
