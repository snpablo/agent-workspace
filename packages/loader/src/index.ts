/**
 * @awp/loader - Filesystem package loader for Agent Platform
 */

export { PackageLoader, detectPackageKind, loadFromMultiplePaths } from './package-loader';
export { PackageRegistry } from './package-registry';
export {
  BaseRegistry,
  ToolRegistry,
  SkillRegistry,
  ChannelRegistry,
  ConnectorRegistry,
  ScheduleRegistry,
  SandboxRegistry,
  AgentCapabilityRegistry,
} from './registries';
export { AgentLoader, loadAgents, getAgentSummary } from './agent-loader';
export type {
  LoaderOptions,
  PackageLoadResult,
  DiscoveryResult,
  PackageKind,
  AnyPackage,
  PackageRef,
  ReferenceResolutionResult,
  ValidationOptions,
  ValidationError,
  ValidationResult,
} from './types';
export type { AgentPackageStructure, AgentPackageSummary } from './agent-loader';
