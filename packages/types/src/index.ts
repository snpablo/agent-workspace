/**
 * TypeScript types for Agent Workspace Platform
 *
 * This package provides the canonical type definitions for all platform objects,
 * both definition-side (declarative) and runtime-side (executable).
 *
 * The types are organized into three categories:
 * - Definitions: declarative workspace, artifact, playbook, and agent definitions
 * - Runtime: live or persisted instances during workspace execution
 * - Interpreter: component tree and interpretation structures
 */

// Definition types
export * from './definitions';

// Runtime types
export * from './runtime';

// Interpreter types
export * from './interpreter';
