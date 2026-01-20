export { JSON_API_KEY } from './constants';
export { Attribute } from './decorators/attribute.decorator';
export { Relationship } from './decorators/relationship.decorator';
export { isAttributeMetadata } from './guards/is-attribute.guard';
export { isRelationshipMetadata } from './guards/is-relationship.guard';
export { Serialize } from './serializer/serialize.decorator';
export { serialize } from './serializer/serialize.fn';
export type { AttributeMetadata, HasConstructor, RelationshipMetadata, RelationshipOptions, Resource } from './types';
export { getJsonApiMetadata, kebabize } from './utils';
