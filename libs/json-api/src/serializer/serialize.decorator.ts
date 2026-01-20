import { serialize } from './serialize.fn';

interface HasId {
  id: string | number;
}

export const Serialize = (): MethodDecorator => (_target, _propertyKey, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value as (...args: unknown[]) => Promise<unknown>;

  descriptor.value = async function (...args: unknown[]) {
    const result = await originalMethod.apply(this, args);

    if (Array.isArray(result)) {
      return result.map((item) => serialize(item as HasId));
    }

    return serialize(result as HasId);
  };

  return descriptor;
};
