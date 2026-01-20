import 'reflect-metadata';
import { JSON_API_KEY } from '../constants';
import type { AttributeMetadata } from '../types';

export const Attribute = (): PropertyDecorator => (target: object, propertyKey: string | symbol) => {
  const metadata: AttributeMetadata = {
    attribute: String(propertyKey),
  };
  Reflect.defineMetadata(JSON_API_KEY, metadata, target, propertyKey);
};
