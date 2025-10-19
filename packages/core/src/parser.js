"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateParser = void 0;
const YAML = __importStar(require("yaml"));
const types_1 = require("./types");
const promises_1 = require("fs/promises");
const glob_1 = require("glob");
const path_1 = require("path");
class TemplateParser {
    /**
     * Parse a single YAML template file
     */
    async parseTemplate(filePath) {
        try {
            const content = await (0, promises_1.readFile)(filePath, 'utf-8');
            const parsed = YAML.parse(content);
            // Validate against schema
            const template = types_1.TemplateSchema.parse(parsed);
            return template;
        }
        catch (error) {
            throw new Error(`Failed to parse template ${filePath}: ${error}`);
        }
    }
    /**
     * Load all templates from a directory
     */
    async loadTemplates(templateDir) {
        const yamlFiles = await (0, glob_1.glob)((0, path_1.join)(templateDir, '**/*.yaml'));
        const templates = [];
        for (const file of yamlFiles) {
            try {
                const template = await this.parseTemplate(file);
                templates.push(template);
            }
            catch (error) {
                console.warn(`Skipping invalid template ${file}:`, error);
            }
        }
        return templates;
    }
    /**
     * Filter templates by severity
     */
    filterBySeverity(templates, severities) {
        return templates.filter((t) => severities.includes(t.severity));
    }
    /**
     * Filter templates by category
     */
    filterByCategory(templates, categories) {
        return templates.filter((t) => categories.includes(t.category));
    }
    /**
     * Get template by ID
     */
    getTemplateById(templates, id) {
        return templates.find((t) => t.id === id);
    }
}
exports.TemplateParser = TemplateParser;
