/**
 * PackageRegistry - stores and manages loaded packages
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
  AnyPackage,
  ToolReference,
  SkillReference,
  AgentReference,
  ResourceReference,
  ChannelReference,
  ConnectorReference,
  ScheduleReference,
} from '@awp/types';
import { PackageLoadResult, PackageRef, ReferenceResolutionResult, PackageKind } from './types';

/**
 * Registry for managing packages and resolving references
 */
export class PackageRegistry {
  private packages: Map<string, PackageLoadResult> = new Map();
  private byKind: Map<PackageKind, Set<string>> = new Map();
  private references: Map<string, PackageRef[]> = new Map();

  constructor(packages?: PackageLoadResult[]) {
    if (packages) {
      for (const result of packages) {
        this.register(result);
      }
    }
  }

  /**
   * Register a loaded package
   */
  register(result: PackageLoadResult): void {
    const pkg = result.package;
    const id = this.getId(pkg);

    this.packages.set(id, result);

    // Index by kind
    const kind = pkg.kind as PackageKind;
    if (!this.byKind.has(kind)) {
      this.byKind.set(kind, new Set());
    }
    this.byKind.get(kind)!.add(id);

    // Extract references
    this.extractReferences(id, pkg);
  }

  /**
   * Get a package by ID
   */
  get<T extends AnyPackage = AnyPackage>(id: string): T | undefined {
    const result = this.packages.get(id);
    return result?.package as T | undefined;
  }

  /**
   * Get all packages of a specific kind
   */
  getByKind(kind: PackageKind): AnyPackage[] {
    const ids = this.byKind.get(kind) || new Set();
    return Array.from(ids)
      .map((id) => this.packages.get(id)?.package)
      .filter((pkg): pkg is AnyPackage => pkg !== undefined);
  }

  /**
   * Get all packages
   */
  getAll(): AnyPackage[] {
    return Array.from(this.packages.values())
      .map((result) => result.package);
  }

  /**
   * Check if a package exists
   */
  has(id: string): boolean {
    return this.packages.has(id);
  }

  /**
   * Get all references in a package
   */
  getReferences(id: string): PackageRef[] {
    return this.references.get(id) || [];
  }

  /**
   * Resolve all references to actual packages
   */
  resolveReferences(): ReferenceResolutionResult {
    let resolved = 0;
    let total = 0;
    const unresolved: PackageRef[] = [];
    const circular: string[][] = [];

    // Check all references
    for (const refs of this.references.values()) {
      for (const ref of refs) {
        total++;
        if (this.has(ref.id)) {
          resolved++;
        } else {
          unresolved.push(ref);
        }
      }
    }

    // Check for circular dependencies
    for (const [packageId] of this.packages) {
      const cycle = this.detectCycle(packageId, new Set());
      if (cycle.length > 0) {
        circular.push(cycle);
      }
    }

    return {
      total,
      resolved,
      unresolved,
      circular,
    };
  }

  /**
   * Get packages that reference a given package
   */
  getReferencers(targetId: string): string[] {
    const referencers: string[] = [];

    for (const [packageId, refs] of this.references) {
      if (refs.some((ref) => ref.id === targetId)) {
        referencers.push(packageId);
      }
    }

    return referencers;
  }

  /**
   * Get dependency graph for a package
   */
  getDependencies(packageId: string, deep = true): Map<string, AnyPackage> {
    const deps = new Map<string, AnyPackage>();
    const visited = new Set<string>();

    const collect = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const refs = this.references.get(id) || [];
      for (const ref of refs) {
        const pkg = this.get(ref.id);
        if (pkg) {
          deps.set(ref.id, pkg);
          if (deep) {
            collect(ref.id);
          }
        }
      }
    };

    collect(packageId);
    return deps;
  }

  /**
   * Validate all references
   */
  validateReferences(): Array<{ id: string; missing: PackageRef[] }> {
    const issues: Array<{ id: string; missing: PackageRef[] }> = [];

    for (const [packageId, refs] of this.references) {
      const missing = refs.filter((ref) => !this.has(ref.id));
      if (missing.length > 0) {
        issues.push({ id: packageId, missing });
      }
    }

    return issues;
  }

  /**
   * Get all tool references in a package (as resolved tools)
   */
  resolveTools(pkg: Agent | Skill): Tool[] {
    const tools: Tool[] = [];

    if (!pkg.tools) return tools;

    for (const ref of pkg.tools) {
      const tool = this.get<Tool>(ref.id);
      if (tool) {
        tools.push(tool);
      }
    }

    return tools;
  }

  /**
   * Get all skill references in a package (as resolved skills)
   */
  resolveSkills(pkg: Agent | Skill): Skill[] {
    const skills: Skill[] = [];

    if (!pkg.skills) return skills;

    for (const ref of pkg.skills) {
      const skill = this.get<Skill>(ref.id);
      if (skill) {
        skills.push(skill);
      }
    }

    return skills;
  }

  /**
   * Get all resources referenced in a project
   */
  resolveResources(project: Project): Resource[] {
    const resources: Resource[] = [];

    if (!project.resources) return resources;

    for (const ref of project.resources) {
      const resource = this.get<Resource>(ref.id);
      if (resource) {
        resources.push(resource);
      }
    }

    return resources;
  }

  /**
   * Get all connector references in a package
   */
  resolveConnectors(pkg: Agent | Project | Tool): Connector[] {
    const connectors: Connector[] = [];
    const toolPkg = pkg as Tool;
    const multiConnectorPkg = pkg as Agent | Project;

    if (toolPkg.connector?.id) {
      const connector = this.get<Connector>(toolPkg.connector.id);
      if (connector) {
        connectors.push(connector);
      }
      return connectors;
    }

    if (!multiConnectorPkg.connectors) return connectors;

    for (const ref of multiConnectorPkg.connectors) {
      const connector = this.get<Connector>(ref.id);
      if (connector) {
        connectors.push(connector);
      }
    }

    return connectors;
  }

  /**
   * Get all agents referenced in a project
   */
  resolveAgents(project: Project): Agent[] {
    const agents: Agent[] = [];

    if (!project.agents) return agents;

    for (const ref of project.agents) {
      const agent = this.get<Agent>(ref.id);
      if (agent) {
        agents.push(agent);
      }
    }

    return agents;
  }

  /**
   * Export registry as JSON (for serialization)
   */
  toJSON() {
    return {
      packages: Array.from(this.packages.values()).map((result) => ({
        id: this.getId(result.package),
        kind: result.package.kind,
        sourcePath: result.sourcePath,
      })),
      references: Array.from(this.references.entries()).map(([from, refs]) => ({
        from,
        to: refs.map((r) => r.id),
      })),
    };
  }

  /**
   * Get statistics about the registry
   */
  getStats() {
    const stats: Record<PackageKind, number> = {} as any;

    for (const [kind, ids] of this.byKind) {
      stats[kind] = ids.size;
    }

    return {
      total: this.packages.size,
      byKind: stats,
      totalReferences: Array.from(this.references.values()).reduce((sum, refs) => sum + refs.length, 0),
    };
  }

  /**
   * Clear the registry
   */
  clear(): void {
    this.packages.clear();
    this.byKind.clear();
    this.references.clear();
  }

  /**
   * Extract ID from package
   */
  private getId(pkg: any): string {
    return pkg.id || 'unknown';
  }

  /**
   * Extract references from a package
   */
  private extractReferences(packageId: string, pkg: any): void {
    const refs: PackageRef[] = [];

    // Tools referenced
    if (pkg.tools && Array.isArray(pkg.tools)) {
      for (let i = 0; i < pkg.tools.length; i++) {
        const tool = pkg.tools[i];
        if (typeof tool === 'object' && tool.id) {
          refs.push({
            kind: 'tool',
            id: tool.id,
            field: `tools[${i}]`,
          });
        }
      }
    }

    // Skills referenced
    if (pkg.skills && Array.isArray(pkg.skills)) {
      for (let i = 0; i < pkg.skills.length; i++) {
        const skill = pkg.skills[i];
        if (typeof skill === 'object' && skill.id) {
          refs.push({
            kind: 'skill',
            id: skill.id,
            field: `skills[${i}]`,
          });
        }
      }
    }

    // Agents referenced (in projects)
    if (pkg.agents && Array.isArray(pkg.agents)) {
      for (let i = 0; i < pkg.agents.length; i++) {
        const agent = pkg.agents[i];
        if (typeof agent === 'object' && agent.id) {
          refs.push({
            kind: 'agent',
            id: agent.id,
            field: `agents[${i}]`,
          });
        }
      }
    }

    // Resources referenced (in projects)
    if (pkg.resources && Array.isArray(pkg.resources)) {
      for (let i = 0; i < pkg.resources.length; i++) {
        const resource = pkg.resources[i];
        if (typeof resource === 'object' && resource.id) {
          refs.push({
            kind: 'resource',
            id: resource.id,
            field: `resources[${i}]`,
          });
        }
      }
    }

    // Channels referenced (in projects)
    if (pkg.channels && Array.isArray(pkg.channels)) {
      for (let i = 0; i < pkg.channels.length; i++) {
        const channel = pkg.channels[i];
        if (typeof channel === 'object' && channel.id) {
          refs.push({
            kind: 'channel',
            id: channel.id,
            field: `channels[${i}]`,
          });
        }
      }
    }

    // Connectors referenced
    if (pkg.connectors && Array.isArray(pkg.connectors)) {
      for (let i = 0; i < pkg.connectors.length; i++) {
        const connector = pkg.connectors[i];
        if (typeof connector === 'object' && connector.id) {
          refs.push({
            kind: 'connector',
            id: connector.id,
            field: `connectors[${i}]`,
          });
        }
      }
    }

    // Single connector referenced (typically by tools)
    if (pkg.connector && typeof pkg.connector === 'object' && pkg.connector.id) {
      refs.push({
        kind: 'connector',
        id: pkg.connector.id,
        field: 'connector',
      });
    }

    // Schedules referenced (in projects)
    if (pkg.schedules && Array.isArray(pkg.schedules)) {
      for (let i = 0; i < pkg.schedules.length; i++) {
        const schedule = pkg.schedules[i];
        if (typeof schedule === 'object' && schedule.id) {
          refs.push({
            kind: 'schedule',
            id: schedule.id,
            field: `schedules[${i}]`,
          });
        }
      }
    }

    if (refs.length > 0) {
      this.references.set(packageId, refs);
    }
  }

  /**
   * Detect cycles in dependency graph
   */
  private detectCycle(
    packageId: string,
    visiting: Set<string>,
    visited: Set<string> = new Set(),
  ): string[] {
    if (visited.has(packageId)) {
      return [];
    }

    if (visiting.has(packageId)) {
      // Cycle detected
      return [packageId];
    }

    visiting.add(packageId);

    const refs = this.references.get(packageId) || [];
    for (const ref of refs) {
      const cycle = this.detectCycle(ref.id, new Set(visiting), visited);
      if (cycle.length > 0) {
        return [packageId, ...cycle];
      }
    }

    visiting.delete(packageId);
    visited.add(packageId);

    return [];
  }
}
