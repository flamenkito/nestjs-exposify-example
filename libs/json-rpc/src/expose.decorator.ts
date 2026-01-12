import 'reflect-metadata';

const EXPOSE_METADATA_KEY = Symbol('expose');

type Constructor = new (...args: unknown[]) => object;

export type TransportType = 'json-rpc';

export interface ExposeOptions {
  transport: TransportType;
}

interface ExposeMetadata {
  transport: TransportType;
}

// Registry to store all exposed classes by transport
const exposeRegistry: Map<TransportType, Constructor[]> = new Map();

/**
 * Class decorator that exposes a service via the specified transport.
 * All methods will be auto-registered as endpoints for that transport.
 */
export function Expose(options: ExposeOptions): ClassDecorator {
  return (target) => {
    const metadata: ExposeMetadata = { transport: options.transport };
    Reflect.defineMetadata(EXPOSE_METADATA_KEY, metadata, target);

    const transportClasses = exposeRegistry.get(options.transport) || [];
    transportClasses.push(target as unknown as Constructor);
    exposeRegistry.set(options.transport, transportClasses);
  };
}

/**
 * Get expose metadata for a class
 */
export function getExposeMetadata(
  target: Constructor,
): ExposeMetadata | undefined {
  return Reflect.getMetadata(EXPOSE_METADATA_KEY, target) as
    | ExposeMetadata
    | undefined;
}

/**
 * Get all classes exposed via a specific transport
 */
export function getExposeRegistry(transport: TransportType): Constructor[] {
  return exposeRegistry.get(transport) || [];
}

/**
 * Get all exposed classes regardless of transport
 */
export function getAllExposedClasses(): Map<TransportType, Constructor[]> {
  return exposeRegistry;
}
