/**
 * Workspace Interpreter for Agent Workspace Platform
 *
 * Transforms WorkspaceDefinition into a ComponentTree through a series
 * of normalization, resolution, and composition stages.
 *
 * Pipeline stages:
 * 1. Validation - ensure definition conforms to schema
 * 2. Normalization - migrate legacy formats to canonical form
 * 3. Binding Resolution - resolve bindings and select components
 * 4. Policy Evaluation - evaluate policies and permissions
 * 5. Component Tree Generation - produce normalized output
 */

import {
  WorkspaceDefinition,
  ComponentTree,
  InterpretationResult,
  InterpretationError,
  InterpreterOptions,
  NormalizedDefinition,
  RenderedZone,
  ResolvedBinding,
  ComponentDefinition,
  ViewDefinition,
  Normalization,
} from '@awp/types';
import { DefinitionValidator } from '@awp/definitions';

/**
 * Workspace Interpreter
 *
 * Main entry point for interpreting workspace definitions.
 * Orchestrates the interpretation pipeline.
 */
export class WorkspaceInterpreter {
  private validator: DefinitionValidator;
  private componentRegistry: Map<string, ComponentDefinition>;
  private viewRegistry: Map<string, ViewDefinition>;

  constructor(options?: InterpreterOptions) {
    this.validator = new DefinitionValidator();
    this.componentRegistry = new Map();
    this.viewRegistry = new Map();

    // Load custom registries if provided
    if (options?.componentRegistry) {
      for (const [key, def] of Object.entries(options.componentRegistry)) {
        this.componentRegistry.set(key, def);
      }
    }
    if (options?.viewRegistry) {
      for (const [key, def] of Object.entries(options.viewRegistry)) {
        this.viewRegistry.set(key, def);
      }
    }

    // Initialize default components and views
    this.initializeDefaults();
  }

  /**
   * Interpret a workspace definition
   */
  interpret(definition: any, options?: InterpreterOptions): InterpretationResult {
    const errors: InterpretationError[] = [];
    const warnings: string[] = [];

    try {
      // Stage 1: Normalization
      const normalized = this.normalize(definition);
      if (!normalized.valid) {
        return {
          success: false,
          errors: normalized.errors,
          warnings,
        };
      }

      const normalizedDef = normalized.definition!;

      // Stage 2: Validation
      if (options?.validate !== false) {
        const validationResult = this.validator.validateWorkspaceDefinition(normalizedDef);
        if (!validationResult.valid) {
          errors.push(
            ...validationResult.errors.map((e) => ({
              code: 'VALIDATION_ERROR',
              message: e.message,
              path: e.path,
            }))
          );
        }
        warnings.push(...validationResult.warnings);
      }

      if (errors.length > 0) {
        return { success: false, errors, warnings };
      }

      // Stage 3: Binding Resolution
      const bindings = this.resolveBindings(normalizedDef);

      // Stage 4: Policy Evaluation
      // TODO: implement policy evaluation

      // Stage 5: Component Tree Generation
      const tree = this.generateComponentTree(normalizedDef, bindings, normalized.normalizations);

      return {
        success: true,
        componentTree: tree,
        errors,
        warnings,
      };
    } catch (err: any) {
      errors.push({
        code: 'INTERNAL_ERROR',
        message: `Interpretation error: ${err.message}`,
      });
      return { success: false, errors, warnings };
    }
  }

  /**
   * Stage 1: Normalization
   *
   * Converts legacy definition formats into the canonical form.
   * Tracks all normalizations for diagnostic purposes.
   */
  private normalize(
    definition: any
  ): { valid: boolean; definition?: NormalizedDefinition; errors: InterpretationError[]; normalizations: Normalization[] } {
    const normalizations: Normalization[] = [];
    const errors: InterpretationError[] = [];

    let def = definition;

    // Migration: top-level id and type -> workspace.id and workspace.type
    if (def.id && !def.workspace?.id) {
      def.workspace = def.workspace || {};
      def.workspace.id = def.id;
      normalizations.push({
        from: 'top-level.id',
        to: 'workspace.id',
        reason: 'Legacy format migration',
      });
    }

    if (def.type && !def.workspace?.type && !def.workspaceType) {
      def.workspace = def.workspace || {};
      def.workspace.type = def.type;
      normalizations.push({
        from: 'top-level.type',
        to: 'workspace.type',
        reason: 'Legacy format migration',
      });
    }

    // Migration: workspaceType -> workspace.type
    if (def.workspaceType && !def.workspace?.type) {
      def.workspace = def.workspace || {};
      def.workspace.type = def.workspaceType;
      normalizations.push({
        from: 'workspaceType',
        to: 'workspace.type',
        reason: 'Legacy format migration',
      });
    }

    // Migration: componentBindings -> bindings
    if (def.componentBindings && !def.bindings) {
      def.bindings = def.componentBindings;
      normalizations.push({
        from: 'componentBindings',
        to: 'bindings',
        reason: 'Legacy format migration',
      });
    }

    // Migration: normalize binding properties
    if (def.bindings) {
      def.bindings = def.bindings.map((binding: any) => {
        let normalized = { ...binding };

        // Migration: zoneKey -> zone
        if (binding.zoneKey && !binding.zone) {
          normalized.zone = binding.zoneKey;
          normalizations.push({
            from: 'binding.zoneKey',
            to: 'binding.zone',
            reason: 'Legacy format migration',
          });
        }

        // Migration: viewKey -> view
        if (binding.viewKey && !binding.view) {
          normalized.view = binding.viewKey;
          normalizations.push({
            from: 'binding.viewKey',
            to: 'binding.view',
            reason: 'Legacy format migration',
          });
        }

        // Migration: componentType -> component
        if (binding.componentType && !binding.component) {
          normalized.component = binding.componentType;
          normalizations.push({
            from: 'binding.componentType',
            to: 'binding.component',
            reason: 'Legacy format migration',
          });
        }

        // Migration: task -> work_item
        if (binding.objectKind === 'task') {
          normalized.objectKind = 'work_item';
          normalizations.push({
            from: 'binding.objectKind=task',
            to: 'binding.objectKind=work_item',
            reason: 'Canonical vocabulary migration',
          });
        }

        return normalized;
      });
    }

    // Migration: Output -> Artifact
    if (def.artifacts) {
      def.artifacts = def.artifacts.map((artifact: any) => {
        if (artifact.type === 'Output') {
          normalizations.push({
            from: 'artifact.type=Output',
            to: 'artifact.type=Artifact',
            reason: 'Canonical vocabulary migration',
          });
          return { ...artifact, type: 'Artifact' };
        }
        return artifact;
      });
    }

    // Validate essential structure
    if (!def.workspace) {
      errors.push({
        code: 'MISSING_REQUIRED',
        message: 'Definition must have a workspace property',
        path: 'workspace',
      });
      return { valid: false, errors, normalizations };
    }

    if (!def.workspace.id) {
      errors.push({
        code: 'MISSING_REQUIRED',
        message: 'workspace.id is required',
        path: 'workspace.id',
      });
    }

    if (!def.workspace.type) {
      errors.push({
        code: 'MISSING_REQUIRED',
        message: 'workspace.type is required',
        path: 'workspace.type',
      });
    }

    if (!def.workspace.version) {
      def.workspace.version = 1; // Default version
    }

    if (!def.zones || !Array.isArray(def.zones)) {
      errors.push({
        code: 'MISSING_REQUIRED',
        message: 'zones is required and must be an array',
        path: 'zones',
      });
    }

    if (!def.bindings || !Array.isArray(def.bindings)) {
      errors.push({
        code: 'MISSING_REQUIRED',
        message: 'bindings is required and must be an array',
        path: 'bindings',
      });
    }

    if (errors.length > 0) {
      return { valid: false, errors, normalizations };
    }

    const normalized: NormalizedDefinition = {
      workspace: def.workspace,
      zones: def.zones || [],
      bindings: def.bindings || [],
      artifacts: def.artifacts,
      actions: def.actions,
      playbooks: def.playbooks,
      policies: def.policies,
      permissions: def.permissions,
      normalizations,
    };

    return { valid: true, definition: normalized, errors, normalizations };
  }

  /**
   * Stage 3: Binding Resolution
   *
   * Resolves bindings by selecting appropriate components and views
   * based on object kind and zone.
   */
  private resolveBindings(def: NormalizedDefinition): ResolvedBinding[] {
    const resolved: ResolvedBinding[] = [];

    for (const binding of def.bindings) {
      const componentDef = this.componentRegistry.get(binding.view);
      const viewDef = this.viewRegistry.get(`${binding.objectKind}:${binding.view}`);

      resolved.push({
        ...binding,
        componentDef,
        viewDef,
      });
    }

    return resolved;
  }

  /**
   * Stage 5: Component Tree Generation
   *
   * Produces the final ComponentTree that can be consumed by the runtime
   * and shell rendering engine.
   */
  private generateComponentTree(
    def: NormalizedDefinition,
    bindings: ResolvedBinding[],
    normalizations: Normalization[]
  ): ComponentTree {
    const renderedZones: RenderedZone[] = def.zones.map((zone) => {
      const zoneBindings = bindings.filter((b) => b.zone === zone.key);
      const component = zone.component || (zoneBindings[0]?.componentDef?.key ?? 'unknown');

      return {
        ...zone,
        component,
        bindings: zoneBindings,
      };
    });

    return {
      workspace: {
        id: def.workspace.id,
        type: def.workspace.type,
        version: def.workspace.version,
        displayName: def.workspace.displayName,
        layout: def.workspace.layout,
      },
      zones: renderedZones,
      bindings,
      components: Object.fromEntries(this.componentRegistry),
      stateBindings: this.generateStateBindings(def, renderedZones),
      metadata: {
        interpreterVersion: '0.0.1',
        schemaVersion: '1.0',
        normalizations,
        warnings: [],
        errors: [],
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Generate state bindings for runtime state management
   */
  private generateStateBindings(def: NormalizedDefinition, zones: RenderedZone[]) {
    // TODO: implement state binding generation
    // This should map component properties to workspace state paths
    return [];
  }

  /**
   * Initialize default components and views
   */
  private initializeDefaults(): void {
    // Register canonical components
    const headerComponent: ComponentDefinition = {
      key: 'Header',
      name: 'Workspace Header',
      type: 'container',
      description: 'Header zone containing workspace metadata and controls',
    };

    const queueComponent: ComponentDefinition = {
      key: 'Queue',
      name: 'Work Queue',
      type: 'container',
      description: 'Queue zone for work items and tasks',
      views: [
        {
          key: 'work_item_queue',
          name: 'Work Item Queue',
          objectKind: 'work_item',
          component: 'WorkItemQueueView',
        },
      ],
    };

    const artifactSurfaceComponent: ComponentDefinition = {
      key: 'ArtifactSurface',
      name: 'Artifact Surface',
      type: 'container',
      description: 'Primary surface for artifact display and editing',
      views: [
        {
          key: 'artifact_editor',
          name: 'Artifact Editor',
          objectKind: 'artifact',
          component: 'ArtifactEditorView',
        },
      ],
    };

    const knowledgePanelComponent: ComponentDefinition = {
      key: 'KnowledgePanel',
      name: 'Knowledge Panel',
      type: 'panel',
      description: 'Panel for knowledge sources and references',
    };

    const agentPanelComponent: ComponentDefinition = {
      key: 'AgentPanel',
      name: 'Agent Panel',
      type: 'panel',
      description: 'Panel for agent activity and control',
    };

    const actionPanelComponent: ComponentDefinition = {
      key: 'ActionPanel',
      name: 'Action Panel',
      type: 'panel',
      description: 'Panel for actions and next steps',
    };

    const timelineComponent: ComponentDefinition = {
      key: 'ActivityTimeline',
      name: 'Activity Timeline',
      type: 'panel',
      description: 'Timeline of workspace activity and events',
    };

    const modalComponent: ComponentDefinition = {
      key: 'ModalSurface',
      name: 'Modal Surface',
      type: 'overlay',
      description: 'Modal overlay for dialogs and temporary content',
    };

    const assistantComponent: ComponentDefinition = {
      key: 'AssistantSurface',
      name: 'Assistant Surface',
      type: 'container',
      description: 'Surface for AI assistant interaction',
    };

    // Register components
    [
      headerComponent,
      queueComponent,
      artifactSurfaceComponent,
      knowledgePanelComponent,
      agentPanelComponent,
      actionPanelComponent,
      timelineComponent,
      modalComponent,
      assistantComponent,
    ].forEach((comp) => {
      this.componentRegistry.set(comp.key, comp);
    });

    // Register canonical views
    const views: ViewDefinition[] = [
      {
        key: 'work_item_queue',
        name: 'Work Item Queue View',
        objectKind: 'work_item',
        component: 'Queue',
      },
      {
        key: 'artifact_editor',
        name: 'Artifact Editor View',
        objectKind: 'artifact',
        component: 'ArtifactSurface',
      },
      {
        key: 'knowledge_sources',
        name: 'Knowledge Sources View',
        objectKind: 'knowledge_source',
        component: 'KnowledgePanel',
      },
      {
        key: 'agent_activity',
        name: 'Agent Activity View',
        objectKind: 'agent_session',
        component: 'AgentPanel',
      },
      {
        key: 'actions_list',
        name: 'Actions List View',
        objectKind: 'action',
        component: 'ActionPanel',
      },
      {
        key: 'event_timeline',
        name: 'Event Timeline View',
        objectKind: 'event',
        component: 'ActivityTimeline',
      },
    ];

    views.forEach((view) => {
      this.viewRegistry.set(`${view.objectKind}:${view.key}`, view);
    });
  }

  /**
   * Register a custom component
   */
  registerComponent(component: ComponentDefinition): void {
    this.componentRegistry.set(component.key, component);
  }

  /**
   * Register a custom view
   */
  registerView(view: ViewDefinition): void {
    this.viewRegistry.set(`${view.objectKind}:${view.key}`, view);
  }
}
