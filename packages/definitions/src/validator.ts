/**
 * Definition validation for Agent Workspace Platform
 *
 * Provides schema validation and constraint checking for all definition types.
 */

import { WorkspaceDefinition, ArtifactDefinition, PlaybookDefinition, AgentDefinition } from '@awp/types';
import * as schemas from '@awp/schemas';

/**
 * Definition validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

/**
 * Validation error with path information
 */
export interface ValidationError {
  path: string;
  message: string;
  value?: any;
}

/**
 * Definition validator
 *
 * Validates workspace and artifact definitions against JSON schemas
 * and enforces platform-specific constraints.
 *
 * Note: This is a simplified validator for constraint checking.
 * For full JSON Schema validation, integrate with a schema validator
 * like AJV or Zod.
 */
export class DefinitionValidator {
  constructor() {
    // Validator initialized
  }

  /**
   * Validate a workspace definition
   */
  validateWorkspaceDefinition(def: WorkspaceDefinition): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Schema validation
    const schemaErrors = this.validateAgainstSchema('workspaceDefinition', def, schemas.workspaceDefinition);
    errors.push(...schemaErrors);

    // Constraint validation
    if (def.zones && def.zones.length === 0) {
      errors.push({
        path: 'zones',
        message: 'Must have at least one zone',
      });
    }

    if (def.bindings && def.bindings.length === 0) {
      errors.push({
        path: 'bindings',
        message: 'Must have at least one binding',
      });
    }

    // Validate bindings reference valid zones
    if (def.zones && def.bindings) {
      const validZones = new Set(def.zones.map((z) => z.key));
      for (const binding of def.bindings) {
        if (!validZones.has(binding.zone)) {
          errors.push({
            path: `bindings[*].zone`,
            message: `Zone "${binding.zone}" not found in workspace zones`,
          });
        }
      }
    }

    // Validate artifact references
    if (def.artifacts) {
      if (def.artifacts.length > 0) {
        const primaryCount = def.artifacts.filter((a) => a.primary).length;
        if (primaryCount > 1) {
          warnings.push('Multiple artifacts marked as primary; only one should be primary');
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate an artifact definition
   */
  validateArtifactDefinition(def: ArtifactDefinition): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Schema validation
    const schemaErrors = this.validateAgainstSchema('artifactDefinition', def, schemas.artifactDefinition);
    errors.push(...schemaErrors);

    // Constraint validation
    if (def.sections && def.sections.length === 0) {
      warnings.push('ArtifactDefinition has no sections; consider adding at least one');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate a playbook definition
   */
  validatePlaybookDefinition(def: PlaybookDefinition): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Schema validation
    const schemaErrors = this.validateAgainstSchema('playbookDefinition', def, schemas.playbookDefinition);
    errors.push(...schemaErrors);

    // Constraint validation
    if (def.activities && def.activities.length === 0) {
      errors.push({
        path: 'activities',
        message: 'PlaybookDefinition must have at least one activity',
      });
    }

    // Validate transitions reference valid activities
    if (def.activities && def.transitions) {
      const validActivityIds = new Set(def.activities.map((a) => a.id));
      for (const transition of def.transitions) {
        if (!validActivityIds.has(transition.from)) {
          errors.push({
            path: `transitions[*].from`,
            message: `Activity "${transition.from}" not found`,
          });
        }
        if (!validActivityIds.has(transition.to)) {
          errors.push({
            path: `transitions[*].to`,
            message: `Activity "${transition.to}" not found`,
          });
        }
      }
    }

    // Validate startActivity references valid activity
    if (def.startActivity && def.activities) {
      const validActivityIds = new Set(def.activities.map((a) => a.id));
      if (!validActivityIds.has(def.startActivity)) {
        errors.push({
          path: 'startActivity',
          message: `Activity "${def.startActivity}" not found`,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate an agent definition
   */
  validateAgentDefinition(def: AgentDefinition): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Schema validation
    const schemaErrors = this.validateAgainstSchema('agentDefinition', def, schemas.agentDefinition);
    errors.push(...schemaErrors);

    // Constraint validation
    if (!def.role) {
      warnings.push('AgentDefinition should specify a role for clarity');
    }

    if (!def.systemPrompt) {
      warnings.push('AgentDefinition should include a systemPrompt for proper agent behavior');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Internal schema validation helper
   */
  private validateAgainstSchema(schemaName: string, data: any, schema: any): ValidationError[] {
    const errors: ValidationError[] = [];

    try {
      const valid = this.validateSchemaRecursive(data, schema);
      if (!valid) {
        // Build error messages from schema violations
        // This is a simplified implementation; a production system would use
        // the full AJV validation result
        errors.push({
          path: schemaName,
          message: `Data does not conform to ${schemaName} schema`,
          value: data,
        });
      }
    } catch (err: any) {
      errors.push({
        path: schemaName,
        message: `Validation error: ${err.message}`,
      });
    }

    return errors;
  }

  /**
   * Recursively validate data against schema
   */
  private validateSchemaRecursive(data: any, schema: any): boolean {
    // Check required properties
    if (schema.required) {
      for (const prop of schema.required) {
        if (!(prop in data)) {
          return false;
        }
      }
    }

    // Check property types
    if (schema.properties) {
      for (const [key, propSchema] of Object.entries(schema.properties)) {
        if (key in data) {
          const propData = data[key];
          const ps = propSchema as any;

          if (ps.type) {
            if (ps.type === 'array' && !Array.isArray(propData)) {
              return false;
            }
            if (ps.type === 'object' && typeof propData !== 'object') {
              return false;
            }
            if (ps.type === 'string' && typeof propData !== 'string') {
              return false;
            }
          }
        }
      }
    }

    return true;
  }
}
