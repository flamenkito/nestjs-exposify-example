import type { RelationshipMetadata } from '../types';

export const isRelationshipMetadata = (value: unknown): value is RelationshipMetadata =>
  typeof (value as RelationshipMetadata)?.relationship === 'string' &&
  typeof (value as RelationshipMetadata)?.name === 'string' &&
  typeof (value as RelationshipMetadata)?.type === 'string';
