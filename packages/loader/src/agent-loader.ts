/**
 * AgentLoader - loads and manages Agent packages
 */

import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';
import { Agent, Tool, Skill, Channel, Connector, Schedule, Sandbox } from '@awp/types';
import { PackageLoader } from './package-loader';
import { AgentCapabilityRegistry } from './registries';
import { PackageLoadResult } from './types';

/**
 * Agent package structure
 */
export interface AgentPackageStructure {
  agentDefinition: Agent;
  toolResults: PackageLoadResult<Tool>[];
  skillResults: PackageLoadResult<Skill>[];
  channelResults: PackageLoadResult<Channel>[];
  connectorResults: PackageLoadResult<Connector>[];
  scheduleResults: PackageLoadResult<Schedule>[];
  sandboxResults: PackageLoadResult<Sandbox>[];
  evals: any[];
  errors: Array<{ directory: string; error: string }>;
}

/**
 * Loader for Agent packages with full capability structure
 */
export class AgentLoader {
  private packageLoader: PackageLoader;

  constructor(agentPath: string) {
    this.packageLoader = new PackageLoader({
      rootPath: agentPath,
      recursive: true,
    });
  }

  /**
   * Load complete agent package structure
   */
  async load(): Promise<AgentPackageStructure> {
    const result: AgentPackageStructure = {
      agentDefinition: {} as Agent,
      toolResults: [],
      skillResults: [],
      channelResults: [],
      connectorResults: [],
      scheduleResults: [],
      sandboxResults: [],
      evals: [],
      errors: [],
    };

    // Load agent definition
    const agentDefPath = path.join(this.packageLoader['options'].rootPath, 'agent.yaml');
    if (fs.existsSync(agentDefPath)) {
      const yaml = fs.readFileSync(agentDefPath, 'utf-8');
      const parsed = parse(yaml);
      result.agentDefinition = {
        ...parsed,
        kind: 'agent',
        sourcePath: agentDefPath,
      };
    }

    // Discover and load capability packages
    const discovery = await this.packageLoader.discover();

    for (const packageResult of discovery.packages) {
      const pkg = packageResult.package;

      switch (pkg.kind) {
        case 'tool':
          result.toolResults.push(packageResult as PackageLoadResult<Tool>);
          break;

        case 'skill':
          result.skillResults.push(packageResult as PackageLoadResult<Skill>);
          break;

        case 'channel':
          result.channelResults.push(packageResult as PackageLoadResult<Channel>);
          break;

        case 'connector':
          result.connectorResults.push(packageResult as PackageLoadResult<Connector>);
          break;

        case 'schedule':
          result.scheduleResults.push(packageResult as PackageLoadResult<Schedule>);
          break;

        case 'sandbox':
          result.sandboxResults.push(packageResult as PackageLoadResult<Sandbox>);
          break;
      }
    }

    // Add discovered errors
    for (const failed of discovery.failed) {
      result.errors.push({
        directory: failed.path,
        error: failed.error,
      });
    }

    return result;
  }

  /**
   * Load agent and populate registries
   */
  async loadWithRegistries(): Promise<{
    agentDefinition: Agent;
    registries: AgentCapabilityRegistry;
    structure: AgentPackageStructure;
  }> {
    const structure = await this.load();

    const registries = new AgentCapabilityRegistry();

    // Register tools
    for (const result of structure.toolResults) {
      if (result.success) {
        registries.tools.register(result.package);
      }
    }

    // Register skills
    for (const result of structure.skillResults) {
      if (result.success) {
        registries.skills.register(result.package);
      }
    }

    // Register channels
    for (const result of structure.channelResults) {
      if (result.success) {
        registries.channels.register(result.package);
      }
    }

    // Register connectors
    for (const result of structure.connectorResults) {
      if (result.success) {
        registries.connectors.register(result.package);
      }
    }

    // Register schedules
    for (const result of structure.scheduleResults) {
      if (result.success) {
        registries.schedules.register(result.package);
      }
    }

    // Register sandboxes
    for (const result of structure.sandboxResults) {
      if (result.success) {
        registries.sandboxes.register(result.package);
      }
    }

    return {
      agentDefinition: structure.agentDefinition,
      registries,
      structure,
    };
  }
}

/**
 * Load multiple agents and create composite registry
 */
export async function loadAgents(
  agentPaths: string[],
): Promise<{
  agents: Agent[];
  registries: Map<string, AgentCapabilityRegistry>;
}> {
  const agents: Agent[] = [];
  const registries = new Map<string, AgentCapabilityRegistry>();

  for (const agentPath of agentPaths) {
    const loader = new AgentLoader(agentPath);
    const { agentDefinition, registries: agentRegistries } = await loader.loadWithRegistries();

    agents.push(agentDefinition);
    registries.set(agentDefinition.id, agentRegistries);
  }

  return { agents, registries };
}

/**
 * Agent package summary
 */
export interface AgentPackageSummary {
  agentId: string;
  agentName: string;
  agentModel?: string;
  toolCount: number;
  skillCount: number;
  channelCount: number;
  connectorCount: number;
  scheduleCount: number;
  sandboxCount: number;
  errors: number;
}

/**
 * Get summary of agent package
 */
export function getAgentSummary(structure: AgentPackageStructure): AgentPackageSummary {
  return {
    agentId: structure.agentDefinition.id,
    agentName: structure.agentDefinition.name,
    agentModel: structure.agentDefinition.model,
    toolCount: structure.toolResults.filter((r) => r.success).length,
    skillCount: structure.skillResults.filter((r) => r.success).length,
    channelCount: structure.channelResults.filter((r) => r.success).length,
    connectorCount: structure.connectorResults.filter((r) => r.success).length,
    scheduleCount: structure.scheduleResults.filter((r) => r.success).length,
    sandboxCount: structure.sandboxResults.filter((r) => r.success).length,
    errors: structure.errors.length,
  };
}
