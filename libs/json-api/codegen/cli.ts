#!/usr/bin/env bun
import { program } from 'commander';
import { glob } from 'glob';
import { resolve } from 'node:path';
import { generateResources } from './generator';
import { createProject, parseEntityFile } from './parser';
import type { EntityMetadata } from './types';

interface CodegenOptions {
  output?: string;
  watch: boolean;
}

const runCodegen = async (
  sourceGlob: string,
  options: CodegenOptions,
): Promise<void> => {
  const cwd = process.cwd();
  const outputDir = options.output ? resolve(cwd, options.output) : undefined;

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

  const resourceFiles = generateResources(allEntities, outputDir);

  console.log('\nGenerated files:');
  for (const file of resourceFiles) {
    console.log(`  ✓ ${file}`);
  }

  console.log('\nCode generation complete!');
};

const DEFAULT_GLOB = 'src/**/*.entity.ts';

program
  .name('json-api-codegen')
  .description('Generate JSON:API resource DTOs from TypeORM entities')
  .argument('[source-glob]', 'Glob pattern for entity files', DEFAULT_GLOB)
  .option('-o, --output <path>', 'Output directory for generated files')
  .option('-w, --watch', 'Watch mode for development', false)
  .action(async (sourceGlob: string, options: CodegenOptions) => {
    try {
      await runCodegen(sourceGlob, options);

      if (options.watch) {
        console.log('\nWatch mode not yet implemented. Run manually for now.');
      }
    } catch (error) {
      console.error('Code generation failed:', error);
      process.exit(1);
    }
  });

program.parse();
