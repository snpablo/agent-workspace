/**
 * Workspace Interpreter for Agent Workspace Platform
 *
 * Transforms WorkspaceDefinition into ComponentTree through normalization,
 * validation, binding resolution, and component tree generation.
 *
 * Usage:
 * ```typescript
 * import { WorkspaceInterpreter } from '@awp/interpreter';
 * import { workspaceDefinition } from './definition';
 *
 * const interpreter = new WorkspaceInterpreter();
 * const result = interpreter.interpret(workspaceDefinition);
 *
 * if (result.success) {
 *   console.log('Component Tree:', result.componentTree);
 * } else {
 *   console.error('Interpretation errors:', result.errors);
 * }
 * ```
 */

export * from './interpreter';
export * from './normalizer';
export * from './registry';
export { ComponentRegistry, ViewRegistry, createDefaultComponentRegistry, createDefaultViewRegistry } from './registry';
