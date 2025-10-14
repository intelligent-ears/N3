import * as YAML from 'yaml';
import { Template, TemplateSchema } from './types';
import { readFile } from 'fs/promises';
import { glob } from 'glob';
import { join } from 'path';

export class TemplateParser {
  /**
   * Parse a single YAML template file
   */
  async parseTemplate(filePath: string): Promise<Template> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const parsed = YAML.parse(content);
      
      // Validate against schema
      const template = TemplateSchema.parse(parsed);
      return template;
    } catch (error) {
      throw new Error(`Failed to parse template ${filePath}: ${error}`);
    }
  }

  /**
   * Load all templates from a directory
   */
  async loadTemplates(templateDir: string): Promise<Template[]> {
    const yamlFiles = await glob(join(templateDir, '**/*.yaml'));
    const templates: Template[] = [];

    for (const file of yamlFiles) {
      try {
        const template = await this.parseTemplate(file);
        templates.push(template);
      } catch (error) {
        console.warn(`Skipping invalid template ${file}:`, error);
      }
    }

    return templates;
  }

  /**
   * Filter templates by severity
   */
  filterBySeverity(templates: Template[], severities: string[]): Template[] {
    return templates.filter((t) => severities.includes(t.severity));
  }

  /**
   * Filter templates by category
   */
  filterByCategory(templates: Template[], categories: string[]): Template[] {
    return templates.filter((t) => categories.includes(t.category));
  }

  /**
   * Get template by ID
   */
  getTemplateById(templates: Template[], id: string): Template | undefined {
    return templates.find((t) => t.id === id);
  }
}
