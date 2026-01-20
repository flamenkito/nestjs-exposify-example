import 'reflect-metadata';
import { JSON_API_KEY } from '../constants';
import type { HasConstructor, RelationshipMetadata, RelationshipOptions } from '../types';
import { kebabize } from '../utils';

export const Relationship = (
  entityCreator: HasConstructor,
  options: RelationshipOptions | undefined = undefined,
): PropertyDecorator => {
  const name = options?.name ?? entityCreator.name;

  return (target: object, propertyKey: string | symbol) => {
    const metadata: RelationshipMetadata = {
      relationship: String(propertyKey),
      name,
      type: kebabize(name),
      relationType: options?.relationType,
    };
    Reflect.defineMetadata(JSON_API_KEY, metadata, target, propertyKey);
  };
};
