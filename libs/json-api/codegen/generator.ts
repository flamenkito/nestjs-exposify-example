import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { generateDtoFile, generateIndexFile } from './templates';
import type { EntityMetadata } from './types';

const computeEntityImportPath = (
  entity: EntityMetadata,
  outputDir?: string,
): string => {
  if (!outputDir) {
    // Co-located: import from same directory
    return `./${entity.resourceType}.entity`;
  }

  // Compute relative path from output directory to entity file
  const entityDir = dirname(entity.sourceFile);
  const entityFileName = `${entity.resourceType}.entity`;
  const relativePath = relative(outputDir, join(entityDir, entityFileName));

  // Ensure path starts with ./ or ../
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
};

const writeResourceFile = (
  entity: EntityMetadata,
  outputDir?: string,
): string => {
  const dir = outputDir ?? dirname(entity.sourceFile);
  const fileName = `${entity.resourceType}.resource.ts`;
  const filePath = join(dir, fileName);

  // Update entity import path based on output location
  const entityImportPath = computeEntityImportPath(entity, outputDir);
  const updatedEntity: EntityMetadata = {
    ...entity,
    entityImportPath,
  };

  const content = generateDtoFile(updatedEntity);

  if (outputDir) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(filePath, content, 'utf-8');
  return filePath;
};

const writeIndexFile = (entities: EntityMetadata[], outputDir: string): string => {
  const filePath = join(outputDir, 'index.ts');
  const content = generateIndexFile(entities);

  writeFileSync(filePath, content, 'utf-8');
  return filePath;
};

export const generateResources = (
  entities: EntityMetadata[],
  outputDir?: string,
): string[] => {
  const resourceFiles = entities.map((e) => writeResourceFile(e, outputDir));

  // Generate index file when using output directory
  if (outputDir) {
    resourceFiles.push(writeIndexFile(entities, outputDir));
  }

  return resourceFiles;
};
