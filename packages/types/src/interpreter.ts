/**
 * Interpreter types for Agent Workspace Platform
 *
 * These types represent the intermediate and output structures used by
 * the workspace interpreter to transform WorkspaceDefinition into a
 * rendered component tree.
 */

import { WorkspaceDefinition, Zone, Binding } from './definitions';
import { WorkspaceState } from './runtime';

/**
 * Component tree - normalized interpreter output for shell rendering
 *
 * The component tree is the primary output of the workspace interpreter.
 * It represents the resolved, normalized, and ready-to-render composition
 * of a workspace instance.
 */
export interface ComponentTree {
  /** Reference to the workspace definition used to generate this tree */
  workspace: {
    id: string;
    type: string;
    version: number;
    displayName?: string;
    layout?: string;
  };
  /** Resolved zones with selected components */
  zones: RenderedZone[];
  /** Resolved bindings */
  bindings: ResolvedBinding[];
  /** Component definitions available in this tree */
  components: Record<string, ComponentDefinition>;
  /** Runtime state bindings */
  stateBindings: StateBinding[];
  /** Interpreter metadata */
  metadata: InterpreterMetadata;
}

/**
 * Rendered zone - zone with its selected component
 */
export interface RenderedZone extends Zone {
  component: string;
  componentDef?: ComponentDefinition;
  bindings?: ResolvedBinding[];
}

/**
 * Resolved binding - binding with resolved component and view
 */
export interface ResolvedBinding extends Binding {
  componentDef?: ComponentDefinition;
  viewDef?: ViewDefinition;
}

/**
 * Component definition - renderable primitive in the UI
 */
export interface ComponentDefinition {
  key: string;
  name: string;
  type: string;
  description?: string;
  props?: Record<string, PropDefinition>;
  views?: ViewDefinition[];
  children?: string[];
  metadata?: Record<string, any>;
}

/**
 * Property definition for a component
 */
export interface PropDefinition {
  name: string;
  type: string;
  required?: boolean;
  default?: any;
  description?: string;
  options?: PropOption[];
}

/**
 * Option for a property
 */
export interface PropOption {
  label: string;
  value: any;
}

/**
 * View definition - component specialized for a particular object kind
 */
export interface ViewDefinition {
  key: string;
  name: string;
  objectKind: string;
  component: string;
  props?: Record<string, any>;
  description?: string;
  metadata?: Record<string, any>;
}

/**
 * State binding - connection between component tree and workspace state
 */
export interface StateBinding {
  componentKey: string;
  stateProperty: string;
  mode: 'read' | 'write' | 'readwrite';
  path: string;
}

/**
 * Interpreter metadata - provenance and diagnostics
 */
export interface InterpreterMetadata {
  interpreterVersion: string;
  schemaVersion: string;
  normalizations: Normalization[];
  warnings: string[];
  errors: string[];
  timestamp: string;
}

/**
 * Normalization record - tracks schema migration during interpretation
 */
export interface Normalization {
  from: string;
  to: string;
  reason: string;
}

/**
 * Interpreter options - configuration for interpretation
 */
export interface InterpreterOptions {
  /** Whether to validate against schema */
  validate?: boolean;
  /** Whether to normalize legacy formats */
  normalize?: boolean;
  /** Whether to resolve all references */
  resolveReferences?: boolean;
  /** Whether to evaluate policies */
  evaluatePolicies?: boolean;
  /** Custom component registry */
  componentRegistry?: Record<string, ComponentDefinition>;
  /** Custom view registry */
  viewRegistry?: Record<string, ViewDefinition>;
}

/**
 * Interpretation result - output of the interpreter
 */
export interface InterpretationResult {
  success: boolean;
  componentTree?: ComponentTree;
  errors: InterpretationError[];
  warnings: string[];
  diagnostics?: Record<string, any>;
}

/**
 * Interpretation error
 */
export interface InterpretationError {
  code: string;
  message: string;
  path?: string;
  suggestion?: string;
}

/**
 * Normalized definition - internal representation after normalization
 */
export interface NormalizedDefinition {
  workspace: {
    id: string;
    type: string;
    version: number;
    displayName?: string;
    layout?: string;
  };
  zones: Zone[];
  bindings: Binding[];
  artifacts?: Array<{ type: string; primary?: boolean }>;
  actions?: Array<{ type: string }>;
  playbooks?: Array<{ type: string }>;
  policies?: any[];
  permissions?: any[];
  normalizations: Normalization[];
}

/**
 * Binding resolution context
 */
export interface BindingContext {
  workspaceType: string;
  objectKind: string;
  zone: string;
  availableComponents: Record<string, ComponentDefinition>;
  availableViews: Record<string, ViewDefinition>;
  policies?: any[];
}

/**
 * Component selection - result of binding resolution
 */
export interface ComponentSelection {
  zone: string;
  objectKind: string;
  selectedComponent: string;
  selectedView: string;
  props?: Record<string, any>;
}
