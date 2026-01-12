"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerJsonRpcMethods = registerJsonRpcMethods;
const expose_decorator_1 = require("./expose.decorator");
function registerJsonRpcMethods(app, handler) {
    const rpcClasses = (0, expose_decorator_1.getExposeRegistry)('json-rpc');
    for (const rpcClass of rpcClasses) {
        const instance = app.get(rpcClass, { strict: false });
        if (!instance)
            continue;
        const prototype = rpcClass.prototype;
        const methodNames = Object.getOwnPropertyNames(prototype).filter((name) => name !== 'constructor' && typeof prototype[name] === 'function');
        for (const methodName of methodNames) {
            const method = instance[methodName];
            if (typeof method !== 'function')
                continue;
            const boundMethod = method.bind(instance);
            const rpcName = `${rpcClass.name}.${methodName}`;
            handler.register(rpcName, undefined, boundMethod);
            console.log(`[JSON-RPC] Registered ${rpcName}`);
        }
    }
}
//# sourceMappingURL=json-rpc.registry.js.map