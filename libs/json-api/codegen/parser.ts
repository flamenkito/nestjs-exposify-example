import { Node, Project, SourceFile, SyntaxKind, Type } from 'ts-morph';
import type {
  EntityMetadata,
  ImportMetadata,
  PropertyMetadata,
  RelationshipPropertyMetadata,
} from './types';

const kebabize = (name: string): string =>
  name.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());

const stripEntitySuffix = (name: string): string =>
  name.endsWith('Entity') ? name.slice(0, -6) : name;

const hasDecorator = (node: Node, decoratorName: string): boolean => {
  if (!Node.isPropertyDeclaration(node)) return false;
  return node.getDecorators().some((d) => d.getName() === decoratorName);
};

const toSingleQuotes = (text: string): string => text.replace(/"/g, "'");

const resolveTypeText = (type: Type): string => {
  if (type.isArray()) {
    const elementType = type.getArrayElementType();
    return elementType ? `${resolveTypeText(elementType)}[]` : 'unknown[]';
  }

  if (type.isUnion()) {
    return type
      .getUnionTypes()
      .map((t) => resolveTypeText(t))
      .join(' | ');
  }

  const symbol = type.getSymbol() ?? type.getAliasSymbol();
  if (symbol) {
    return symbol.getName();
  }

  return toSingleQuotes(type.getText());
};

const extractRelationshipInfo = (
  decoratorArgs: Node[],
): { entityName: string; relationType: RelationshipPropertyMetadata['relationType'] } => {
  const entityArg = decoratorArgs[0];
  let entityName = 'unknown';

  if (Node.isIdentifier(entityArg)) {
    entityName = entityArg.getText();
  } else if (Node.isArrowFunction(entityArg) || Node.isFunctionExpression(entityArg)) {
    const body = entityArg.getBody();
    if (Node.isIdentifier(body)) {
      entityName = body.getText();
    }
  }

  entityName = stripEntitySuffix(entityName);

  let relationType: RelationshipPropertyMetadata['relationType'] = 'many-to-one';
  const optionsArg = decoratorArgs[1];
  if (optionsArg && Node.isObjectLiteralExpression(optionsArg)) {
    const relationTypeProp = optionsArg.getProperty('relationType');
    if (relationTypeProp && Node.isPropertyAssignment(relationTypeProp)) {
      const value = relationTypeProp.getInitializer()?.getText().replace(/['"]/g, '');
      if (
        value === 'one-to-one' ||
        value === 'one-to-many' ||
        value === 'many-to-one' ||
        value === 'many-to-many'
      ) {
        relationType = value;
      }
    }
  }

  return { entityName, relationType };
};

const collectImports = (
  sourceFile: SourceFile,
  attributes: PropertyMetadata[],
  relationships: RelationshipPropertyMetadata[],
): ImportMetadata[] => {
  const imports: ImportMetadata[] = [];
  const typeNames = new Set<string>();

  for (const attr of attributes) {
    const primitives = ['string', 'number', 'boolean', 'unknown', 'any', 'void', 'never'];
    const typeWithoutArray = attr.type.replace(/\[\]$/, '');
    if (!primitives.includes(typeWithoutArray)) {
      typeNames.add(typeWithoutArray);
    }
  }

  for (const rel of relationships) {
    typeNames.add(`${rel.relationshipName}Resource`);
  }

  for (const importDecl of sourceFile.getImportDeclarations()) {
    const moduleSpecifier = importDecl.getModuleSpecifierValue();
    const isTypeOnly = importDecl.isTypeOnly();

    for (const namedImport of importDecl.getNamedImports()) {
      const importName = namedImport.getName();
      if (typeNames.has(importName)) {
        imports.push({
          name: importName,
          isTypeOnly: isTypeOnly || namedImport.isTypeOnly(),
          moduleSpecifier,
        });
      }
    }
  }

  return imports;
};

export const parseEntityFile = (project: Project, filePath: string): EntityMetadata[] => {
  const sourceFile = project.addSourceFileAtPath(filePath);
  const entities: EntityMetadata[] = [];

  for (const classDecl of sourceFile.getClasses()) {
    const entityDecorator = classDecl.getDecorator('Entity');
    if (!entityDecorator) continue;

    const className = classDecl.getName();
    if (!className) continue;

    const baseName = stripEntitySuffix(className);
    const resourceType = kebabize(baseName);

    const attributes: PropertyMetadata[] = [];
    const relationships: RelationshipPropertyMetadata[] = [];

    for (const prop of classDecl.getProperties()) {
      const propName = prop.getName();
      const propType = prop.getType();
      const isOptional = prop.hasQuestionToken();

      if (hasDecorator(prop, 'Attribute')) {
        attributes.push({
          name: propName,
          type: resolveTypeText(propType),
          isOptional,
        });
      }

      if (hasDecorator(prop, 'Relationship')) {
        const decorator = prop.getDecorator('Relationship');
        if (decorator) {
          const args = decorator.getArguments();
          const { entityName, relationType } = extractRelationshipInfo(args);
          const isArray = relationType === 'one-to-many' || relationType === 'many-to-many';

          relationships.push({
            name: propName,
            type: resolveTypeText(propType),
            isOptional,
            relationshipName: entityName,
            resourceType: kebabize(entityName),
            relationType,
            isArray,
          });
        }
      }
    }

    const imports = collectImports(sourceFile, attributes, relationships);

    entities.push({
      name: baseName,
      resourceType,
      sourceFile: filePath,
      attributes,
      relationships,
      imports,
    });
  }

  return entities;
};

export const createProject = (tsConfigPath?: string): Project =>
  new Project({
    tsConfigFilePath: tsConfigPath,
    skipAddingFilesFromTsConfig: true,
  });
