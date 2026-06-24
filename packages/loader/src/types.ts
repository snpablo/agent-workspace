/**
 * Types for package loading and discovery
 */

import {
  Tool,
  Skill,
  Agent,
  Project,
  Channel,
  Connector,
  Schedule,
  Resource,
  Sandbox,
  ArtifactType,
} from '@awp/types';

/**
 * Kind of package that can be loaded
 */
export type PackageKind =
  | 'project'
  | 'agent'
  | 'tool'
  | 'skill'
  | 'schedule'
  | 'resource'
  | 'artifact'
  | 'channel'
  | 'connector'
  | 'sandbox';

/**
 * Union of all package types
 */
export type AnyPackage =
  | Project
  | Agent
  | Tool
  | Skill
  | Schedule
  | Resource
  | ArtifactType
  | Channel
  | Connector
  | Sandbox;

/**
 * Options for package loading
 */
export interface LoaderOptions {
  /** Root directory to search for packages */
  rootPath: string;
  /** Whether to recursively search directories */
  recursive?: boolean;
  /** Directories to skip when searching */
  ignore?: string[];
  /** Validate references between packages */
  validateReferences?: boolean;
  /** Validate YAML structure against schemas */
  validateSchema?: boolean;
}

/**
 * Result of loading a single package
 */
export interface PackageLoadResult<T extends AnyPackage = AnyPackage> {
  /** Loaded package */
  package: T;
  /** Path to the package file */
  sourcePath: string;
  /** Whether loading succeeded */
  success: boolean;
  /** Error message if loading failed */
  error?: string;
  /** Warnings encountered during loading */
  warnings?: string[];
}

/**
 * Result of discovering packages
 */
export interface DiscoveryResult {
  /** Packages discovered */
  packages: PackageLoadResult[];
  /** Packages that failed to load */
  failed: Array<{ path: string; error: string }>;
  /** Total time taken (ms) */
  durationMs: number;
  /** Number of packages discovered */
  count: number;
}

/**
 * Reference from one package to another
 */
export interface PackageRef {
  /** Kind of package being referenced */
  kind: PackageKind;
  /** ID of package being referenced */
  id: string;
  /** Path to package (optional, for unresolved references) */
  path?: string;
  /** Name of the reference field (e.g., 'tools', 'skills') */
  field: string;
  /** Line number in YAML where reference appears */
  lineNumber?: number;
}

/**
 * Result of reference resolution
 */
export interface ReferenceResolutionResult {
  /** Total references found */
  total: number;
  /** References successfully resolved */
  resolved: number;
  /** Unresolved references */
  unresolved: PackageRef[];
  /** Circular dependencies detected */
  circular: string[][];
}

/**
 * Options for validating packages
 */
export interface ValidationOptions {
  /** Check required fields */
  checkRequired?: boolean;
  /** Check field types */
  checkTypes?: boolean;
  /** Check references exist */
  checkReferences?: boolean;
  /** Check for circular dependencies */
  checkCircular?: boolean;
}

/**
 * Validation error
 */
export interface ValidationError {
  /** What is invalid */
  message: string;
  /** Path to field (e.g., 'tools.0.id') */
  path?: string;
  /** Severity: error or warning */
  severity: 'error' | 'warning';
}

/**
 * Result of validating a package
 */
export interface ValidationResult {
  /** Package ID being validated */
  packageId: string;
  /** Whether valid */
  valid: boolean;
  /** Errors found */
  errors: ValidationError[];
  /** Warnings found */
  warnings: ValidationError[];
}
