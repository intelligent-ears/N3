import { glob } from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import type { Logger } from './logger';

export class FileScanner {
  constructor(private logger: Logger) {}

  async findContracts(target: string): Promise<string[]> {
    const stat = fs.statSync(target);

    if (stat.isFile()) {
      if (this.isSolidityFile(target)) {
        this.logger.debug(`Found single Solidity file: ${target}`);
        return [target];
      } else {
        this.logger.warn(`${target} is not a Solidity file`);
        return [];
      }
    }

    if (stat.isDirectory()) {
      this.logger.debug(`Scanning directory: ${target}`);
      const pattern = path.join(target, '**/*.sol');
      const files = await glob(pattern, {
        ignore: ['**/node_modules/**', '**/test/**', '**/tests/**'],
      });
      
      this.logger.debug(`Found ${files.length} Solidity files in directory`);
      return files;
    }

    return [];
  }

  private isSolidityFile(file: string): boolean {
    return file.endsWith('.sol');
  }
}
