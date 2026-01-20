export interface ImportMetadata {
  name: string;
  isTypeOnly: boolean;
  moduleSpecifier: string;
}

export interface PropertyMetadata {
  name: string;
  type: string;
  isOptional: boolean;
}

export interface RelationshipPropertyMetadata extends PropertyMetadata {
  relationshipName: string;
  resourceType: string;
  relationType: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  isArray: boolean;
}

export interface EntityMetadata {
  name: string;
  resourceType: string;
  sourceFile: string;
  attributes: PropertyMetadata[];
  relationships: RelationshipPropertyMetadata[];
  imports: ImportMetadata[];
  entityImportPath?: string;
}

export interface CodegenOptions {
  sourceGlob: string;
  watch: boolean;
}
