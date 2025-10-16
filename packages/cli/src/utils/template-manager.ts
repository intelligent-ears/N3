import { TemplateParser } from '@n3/core';
import type { Template } from '@n3/core';
import type { Logger } from './logger';

export class TemplateManager {
  private parser: TemplateParser;

  constructor(private logger: Logger) {
    this.parser = new TemplateParser();
  }

  async loadTemplates(directory: string): Promise<Template[]> {
    this.logger.debug(`Loading templates from ${directory}`);
    const templates = await this.parser.loadTemplates(directory);
    this.logger.debug(`Loaded ${templates.length} templates`);
    return templates;
  }

  filterBySeverity(templates: Template[], severities: string[]): Template[] {
    return this.parser.filterBySeverity(templates, severities);
  }

  filterByCategory(templates: Template[], categories: string[]): Template[] {
    return this.parser.filterByCategory(templates, categories);
  }
}
