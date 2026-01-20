#!/usr/bin/env bun
import { program } from 'commander';
import { glob } from 'glob';
import { generateResources } from './generator';
import { createProject, parseEntityFile } from './parser';
import type { EntityMetadata } from './types';

const runCodegen = async (sourceGlob: string): Promise<void> => {
  const cwd = process.cwd();

  console.log(`Scanning for entities: ${sourceGlob}`);

  const files = await glob(sourceGlob, { cwd, absolute: true });

  if (files.length === 0) {
    console.warn('No files matched the provided glob pattern.');
    return;
  }

  console.log(`Found ${files.length} file(s) to process`);

  const project = createProject();
  const allEntities: EntityMetadata[] = [];

  for (const file of files) {
    try {
      const entities = parseEntityFile(project, file);
      if (entities.length > 0) {
        console.log(`  Parsed ${entities.length} entity/entities from ${file}`);
        allEntities.push(...entities);
      }
    } catch (error) {
      console.error(`  Error parsing ${file}:`, error);
    }
  }

  if (allEntities.length === 0) {
    console.warn('No entities with @Attribute decorators found.');
    return;
  }

  console.log(`\nGenerating ${allEntities.length} resource file(s)`);

  const resourceFiles = generateResources(allEntities);

  console.log('\nGenerated files:');
  for (const file of resourceFiles) {
    console.log(`  ✓ ${file}`);
  }

  console.log('\nCode generation complete!');
};

program
  .name('json-api-codegen')
  .description('Generate JSON:API resource DTOs from TypeORM entities')
  .argument('<source-glob>', 'Glob pattern for entity files')
  .option('-w, --watch', 'Watch mode for development', false)
  .action(async (sourceGlob: string, options: { watch: boolean }) => {
    try {
      await runCodegen(sourceGlob);

      if (options.watch) {
        console.log('\nWatch mode not yet implemented. Run manually for now.');
      }
    } catch (error) {
      console.error('Code generation failed:', error);
      process.exit(1);
    }
  });

program.parse();
