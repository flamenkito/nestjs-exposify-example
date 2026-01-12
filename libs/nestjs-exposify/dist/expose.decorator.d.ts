import 'reflect-metadata';
type Constructor = new (...args: unknown[]) => object;
export type TransportType = 'json-rpc';
export interface ExposeOptions {
    transport: TransportType;
}
interface ExposeMetadata {
    transport: TransportType;
}
export declare function Expose(options: ExposeOptions): ClassDecorator;
export declare function getExposeMetadata(target: Constructor): ExposeMetadata | undefined;
export declare function getExposeRegistry(transport: TransportType): Constructor[];
export declare function getAllExposedClasses(): Map<TransportType, Constructor[]>;
export {};
