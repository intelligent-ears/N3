import chalk from 'chalk';

export class Logger {
  private debugMode = false;
  private verboseMode = false;
  private useColor = true;

  setDebug(enabled: boolean): void {
    this.debugMode = enabled;
  }

  setVerbose(enabled: boolean): void {
    this.verboseMode = enabled;
  }

  setColor(enabled: boolean): void {
    this.useColor = enabled;
  }

  private colorize(text: string, color: typeof chalk.green): string {
    return this.useColor ? color(text) : text;
  }

  info(message: string, ...args: any[]): void {
    console.log(this.colorize('[*]', chalk.blue), message, ...args);
  }

  success(message: string, ...args: any[]): void {
    console.log(this.colorize('[✓]', chalk.green), message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.log(this.colorize('[!]', chalk.yellow), message, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(this.colorize('[✗]', chalk.red), message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    if (this.debugMode) {
      console.log(this.colorize('[DEBUG]', chalk.gray), message, ...args);
    }
  }

  verbose(message: string, ...args: any[]): void {
    if (this.verboseMode || this.debugMode) {
      console.log(this.colorize('[VERBOSE]', chalk.cyan), message, ...args);
    }
  }

  raw(message: string): void {
    console.log(message);
  }

  newline(): void {
    console.log();
  }
}
