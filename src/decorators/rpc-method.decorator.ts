import 'reflect-metadata';
import { ClassConstructor } from '../utils/validate-dto';

const RPC_METHODS_KEY = Symbol('rpc:methods');

interface RpcMethodMetadata {
  methodName: string;
  rpcName: string;
  paramsDto?: ClassConstructor<object>;
}

/**
 * Method decorator that marks a method as an RPC endpoint.
 * @param rpcName - The RPC method name (defaults to the method name)
 * @param paramsDto - Optional DTO class for parameter validation
 */
export function RpcMethod(
  rpcName?: string,
  paramsDto?: ClassConstructor<object>,
): MethodDecorator {
  return (target, propertyKey) => {
    const methods: RpcMethodMetadata[] =
      (Reflect.getMetadata(RPC_METHODS_KEY, target.constructor) as
        | RpcMethodMetadata[]
        | undefined) || [];

    methods.push({
      methodName: String(propertyKey),
      rpcName: rpcName || String(propertyKey),
      paramsDto,
    });

    Reflect.defineMetadata(RPC_METHODS_KEY, methods, target.constructor);
  };
}

/**
 * Get all RPC methods registered on a class
 */
export function getRpcMethods(target: object): RpcMethodMetadata[] {
  return (
    (Reflect.getMetadata(RPC_METHODS_KEY, target.constructor) as
      | RpcMethodMetadata[]
      | undefined) || []
  );
}
