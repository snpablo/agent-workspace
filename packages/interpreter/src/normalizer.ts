/**
 * Definition normalization utilities
 *
 * Provides functions to migrate legacy definition formats to canonical form
 * and track all transformations for diagnostics.
 */

import { Normalization } from '@awp/types';

/**
 * Normalization context for tracking all transformations
 */
export interface NormalizationContext {
  normalizations: Normalization[];
  warnings: string[];
  errors: string[];
}

/**
 * Normalize a definition object
 *
 * Handles migration of:
 * - Top-level id/type to workspace.id/type
 * - Legacy property names (componentBindings, zoneKey, viewKey)
 * - Legacy object kinds (task -> work_item, Output -> Artifact)
 * - Default values and optional properties
 */
export function normalizeDefinition(definition: any, context: NormalizationContext): any {
  let normalized = { ...definition };

  // Normalize workspace structure
  normalized = normalizeWorkspaceStructure(normalized, context);

  // Normalize zones
  if (normalized.zones) {
    normalized.zones = normalized.zones.map((zone: any) => normalizeZone(zone, context));
  }

  // Normalize bindings
  if (normalized.bindings) {
    normalized.bindings = normalized.bindings.map((binding: any) => normalizeBinding(binding, context));
  }

  // Normalize artifacts
  if (normalized.artifacts) {
    normalized.artifacts = normalized.artifacts.map((artifact: any) => normalizeArtifactRef(artifact, context));
  }

  return normalized;
}

/**
 * Normalize workspace structure
 */
function normalizeWorkspaceStructure(definition: any, context: NormalizationContext): any {
  let def = { ...definition };

  // Ensure workspace object exists
  if (!def.workspace) {
    def.workspace = {};
  }

  // Migrate top-level id to workspace.id
  if (def.id && !def.workspace.id) {
    def.workspace.id = def.id;
    context.normalizations.push({
      from: 'root.id',
      to: 'workspace.id',
      reason: 'Legacy format migration - top-level id moved to workspace object',
    });
    delete def.id;
  }

  // Migrate top-level type to workspace.type
  if (def.type && !def.workspace.type) {
    def.workspace.type = def.type;
    context.normalizations.push({
      from: 'root.type',
      to: 'workspace.type',
      reason: 'Legacy format migration - top-level type moved to workspace object',
    });
    delete def.type;
  }

  // Migrate workspaceType to workspace.type
  if (def.workspaceType && !def.workspace.type) {
    def.workspace.type = def.workspaceType;
    context.normalizations.push({
      from: 'workspaceType',
      to: 'workspace.type',
      reason: 'Legacy property name migration',
    });
    delete def.workspaceType;
  }

  // Ensure version exists
  if (!def.workspace.version) {
    def.workspace.version = 1;
  }

  return def;
}

/**
 * Normalize a zone
 */
function normalizeZone(zone: any, context: NormalizationContext): any {
  return { ...zone };
}

/**
 * Normalize a binding
 */
function normalizeBinding(binding: any, context: NormalizationContext): any {
  let normalized = { ...binding };

  // Migrate zoneKey to zone
  if (binding.zoneKey && !binding.zone) {
    normalized.zone = binding.zoneKey;
    context.normalizations.push({
      from: 'binding.zoneKey',
      to: 'binding.zone',
      reason: 'Legacy property name migration',
    });
    delete normalized.zoneKey;
  }

  // Migrate viewKey to view
  if (binding.viewKey && !binding.view) {
    normalized.view = binding.viewKey;
    context.normalizations.push({
      from: 'binding.viewKey',
      to: 'binding.view',
      reason: 'Legacy property name migration',
    });
    delete normalized.viewKey;
  }

  // Migrate componentType to component
  if (binding.componentType && !binding.component) {
    normalized.component = binding.componentType;
    context.normalizations.push({
      from: 'binding.componentType',
      to: 'binding.component',
      reason: 'Legacy property name migration',
    });
    delete normalized.componentType;
  }

  // Migrate task to work_item
  if (normalized.objectKind === 'task') {
    normalized.objectKind = 'work_item';
    context.normalizations.push({
      from: 'binding.objectKind=task',
      to: 'binding.objectKind=work_item',
      reason: 'Canonical vocabulary migration - task replaced by work_item',
    });
  }

  return normalized;
}

/**
 * Normalize an artifact reference
 */
function normalizeArtifactRef(artifactRef: any, context: NormalizationContext): any {
  let normalized = { ...artifactRef };

  // Migrate Output to Artifact
  if (normalized.type === 'Output') {
    normalized.type = 'Artifact';
    context.normalizations.push({
      from: 'artifactRef.type=Output',
      to: 'artifactRef.type=Artifact',
      reason: 'Canonical vocabulary migration - Output replaced by Artifact',
    });
  }

  return normalized;
}

/**
 * Check for common schema migration issues
 */
export function checkForDeprecatedPatterns(definition: any, context: NormalizationContext): void {
  // Check for componentBindings
  if (definition.componentBindings) {
    context.warnings.push('Definition uses deprecated "componentBindings" property; use "bindings" instead');
  }

  // Check for top-level id/type
  if (definition.id || definition.type) {
    context.warnings.push('Definition uses deprecated top-level id/type; use workspace.id and workspace.type instead');
  }

  // Check for workspaceType
  if (definition.workspaceType) {
    context.warnings.push('Definition uses deprecated "workspaceType" property; use workspace.type instead');
  }

  // Check for binding property names
  if (definition.bindings) {
    for (const binding of definition.bindings) {
      if (binding.zoneKey) {
        context.warnings.push('Binding uses deprecated "zoneKey" property; use "zone" instead');
      }
      if (binding.viewKey) {
        context.warnings.push('Binding uses deprecated "viewKey" property; use "view" instead');
      }
      if (binding.componentType) {
        context.warnings.push('Binding uses deprecated "componentType" property; use "component" instead');
      }
      if (binding.objectKind === 'task') {
        context.warnings.push('Binding uses deprecated objectKind "task"; use "work_item" instead');
      }
    }
  }

  // Check for Output artifact type
  if (definition.artifacts) {
    for (const artifact of definition.artifacts) {
      if (artifact.type === 'Output') {
        context.warnings.push('Artifact uses deprecated type "Output"; use "Artifact" instead');
      }
    }
  }
}
