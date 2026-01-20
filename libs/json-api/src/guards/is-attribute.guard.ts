import type { AttributeMetadata } from '../types';

export const isAttributeMetadata = (value: unknown): value is AttributeMetadata =>
  typeof (value as AttributeMetadata)?.attribute === 'string';
