"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expose = Expose;
exports.getExposeMetadata = getExposeMetadata;
exports.getExposeRegistry = getExposeRegistry;
exports.getAllExposedClasses = getAllExposedClasses;
require("reflect-metadata");
const EXPOSE_METADATA_KEY = Symbol('expose');
const exposeRegistry = new Map();
function Expose(options) {
    return (target) => {
        const metadata = { transport: options.transport };
        Reflect.defineMetadata(EXPOSE_METADATA_KEY, metadata, target);
        const transportClasses = exposeRegistry.get(options.transport) || [];
        transportClasses.push(target);
        exposeRegistry.set(options.transport, transportClasses);
    };
}
function getExposeMetadata(target) {
    return Reflect.getMetadata(EXPOSE_METADATA_KEY, target);
}
function getExposeRegistry(transport) {
    return exposeRegistry.get(transport) || [];
}
function getAllExposedClasses() {
    return exposeRegistry;
}
//# sourceMappingURL=expose.decorator.js.map