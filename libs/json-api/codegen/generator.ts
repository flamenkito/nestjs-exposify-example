import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { generateDtoFile } from './templates';
import type { EntityMetadata } from './types';

export const writeResourceFile = (entity: EntityMetadata): string => {
  const dir = dirname(entity.sourceFile);
  const fileName = `${entity.resourceType}.resource.ts`;
  const filePath = join(dir, fileName);
  const content = generateDtoFile(entity);

  writeFileSync(filePath, content, 'utf-8');
  return filePath;
};

export const generateResources = (entities: EntityMetadata[]): string[] =>
  entities.map(writeResourceFile);
