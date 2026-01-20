import 'reflect-metadata';
import { JSON_API_KEY } from '../constants';

export const getJsonApiMetadata = <T>(target: object, propertyKey: string): T | undefined =>
  Reflect.getMetadata(JSON_API_KEY, target, propertyKey) as T | undefined;
