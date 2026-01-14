import { Command } from 'commander';
import * as path from 'path';
import { Generator } from './generator';

const program = new Command();

function collect(value: string, previous: string[]): string[] {
  return previous.concat([value]);
}

program
  .name('client-gen')
  .description('Generate Angular clients from NestJS @Expose services')
  .version('0.0.1')
  .requiredOption('-i, --input <path>', 'Source directory to scan (can be specified multiple times)', collect, [])
  .requiredOption('-o, --output <path>', 'Output directory for generated code')
  .option('-e, --endpoint <path>', 'JSON-RPC endpoint path', '/rpc/v1')
  .action((options) => {
    const inputs = options.input.map((p: string) => path.resolve(process.cwd(), p));
    const output = path.resolve(process.cwd(), options.output);

    console.log('Angular Client Generator');
    console.log('========================');
    console.log(`Input:    ${inputs.join(', ')}`);
    console.log(`Output:   ${output}`);
    console.log(`Endpoint: ${options.endpoint}`);
    console.log('');

    const generator = new Generator();
    generator.generate({
      inputs,
      output,
      endpoint: options.endpoint,
    });
  });

program.parse();
