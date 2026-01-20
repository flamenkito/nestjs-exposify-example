export interface AttributeMetadata {
  attribute: string;
}

export interface RelationshipMetadata {
  relationship: string;
  name: string;
  type: string;
  relationType:
    | 'one-to-one'
    | 'one-to-many'
    | 'many-to-one'
    | 'many-to-many'
    // eslint-disable-next-line custom/no-explicit-null-undefined -- optional config for decorator
    | undefined;
}

export interface RelationshipOptions {
  name:
    | string
    // eslint-disable-next-line custom/no-explicit-null-undefined -- optional config for decorator
    | undefined;
  relationType:
    | RelationshipMetadata['relationType']
    // eslint-disable-next-line custom/no-explicit-null-undefined -- optional config for decorator
    | undefined;
}

export interface HasConstructor {
  name: string;
  new (...args: unknown[]): unknown;
}
