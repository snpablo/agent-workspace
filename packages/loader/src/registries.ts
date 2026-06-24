/**
 * Specialized registries for Agent packages and capabilities
 */

import {
  Tool,
  Skill,
  Channel,
  Connector,
  Schedule,
  Sandbox,
  AnyPackage,
  ToolReference,
  SkillReference,
  ChannelReference,
  ConnectorReference,
  ScheduleReference,
} from '@awp/types';
import { PackageRef, PackageKind } from './types';

/**
 * Base registry class for any package kind
 */
export abstract class BaseRegistry<T extends AnyPackage> {
  protected packages: Map<string, T> = new Map();

  /**
   * Register a package
   */
  register(pkg: T): void {
    this.packages.set(pkg.id, pkg);
  }

  /**
   * Get package by ID
   */
  get(id: string): T | undefined {
    return this.packages.get(id);
  }

  /**
   * Get all packages
   */
  getAll(): T[] {
    return Array.from(this.packages.values());
  }

  /**
   * Check if package exists
   */
  has(id: string): boolean {
    return this.packages.has(id);
  }

  /**
   * Get count
   */
  count(): number {
    return this.packages.size;
  }

  /**
   * Clear registry
   */
  clear(): void {
    this.packages.clear();
  }
}

/**
 * Registry for Tool packages
 */
export class ToolRegistry extends BaseRegistry<Tool> {
  /**
   * Find tools by type/implementation
   */
  getByType(type: string): Tool[] {
    return this.getAll().filter((tool) => {
      if (!tool.implementation) return false;
      return (tool.implementation as any).type === type;
    });
  }

  /**
   * Find HTTP-backed tools
   */
  getHttpTools(): Tool[] {
    return this.getByType('http');
  }

  /**
   * Find connector-backed tools
   */
  getConnectorTools(): Tool[] {
    return this.getByType('connector');
  }

  /**
   * Find MCP-backed tools
   */
  getMcpTools(): Tool[] {
    return this.getByType('mcp');
  }

  /**
   * Find function-backed tools
   */
  getFunctionTools(): Tool[] {
    return this.getByType('function');
  }

  /**
   * Find platform service tools
   */
  getPlatformServiceTools(): Tool[] {
    return this.getByType('platform_service');
  }

  /**
   * Resolve tool references
   */
  resolve(refs: ToolReference[]): Tool[] {
    return refs
      .map((ref) => this.get(ref.id))
      .filter((tool): tool is Tool => tool !== undefined);
  }
}

/**
 * Registry for Skill packages
 */
export class SkillRegistry extends BaseRegistry<Skill> {
  private toolRegistry: ToolRegistry;
  private skillReferences: Map<string, string[]> = new Map();

  constructor(toolRegistry?: ToolRegistry) {
    super();
    this.toolRegistry = toolRegistry || new ToolRegistry();
  }

  /**
   * Register a skill and track tool dependencies
   */
  register(pkg: Skill): void {
    super.register(pkg);

    // Track which tools this skill uses
    if (pkg.tools) {
      const toolIds = pkg.tools.map((ref) => ref.id);
      this.skillReferences.set(pkg.id, toolIds);
    }
  }

  /**
   * Get tools used by a skill
   */
  getToolsForSkill(skillId: string): Tool[] {
    const toolIds = this.skillReferences.get(skillId) || [];
    return toolIds
      .map((id) => this.toolRegistry.get(id))
      .filter((tool): tool is Tool => tool !== undefined);
  }

  /**
   * Get skills that use a specific tool
   */
  getSkillsUsingTool(toolId: string): Skill[] {
    return this.getAll().filter((skill) => {
      if (!skill.tools) return false;
      return skill.tools.some((ref) => ref.id === toolId);
    });
  }

  /**
   * Get all transitive tools for a skill
   */
  getAllToolsForSkill(skillId: string): Tool[] {
    const skill = this.get(skillId);
    if (!skill) return [];

    const tools: Tool[] = [];
    const visited = new Set<string>();

    const collect = (s: Skill) => {
      if (visited.has(s.id)) return;
      visited.add(s.id);

      if (s.tools) {
        for (const ref of s.tools) {
          const tool = this.toolRegistry.get(ref.id);
          if (tool && !tools.find((t) => t.id === tool.id)) {
            tools.push(tool);
          }
        }
      }

      if (s.skills) {
        for (const ref of s.skills) {
          const nested = this.get(ref.id);
          if (nested) {
            collect(nested);
          }
        }
      }
    };

    collect(skill);
    return tools;
  }

  /**
   * Resolve skill references
   */
  resolve(refs: SkillReference[]): Skill[] {
    return refs
      .map((ref) => this.get(ref.id))
      .filter((skill): skill is Skill => skill !== undefined);
  }
}

/**
 * Registry for Channel packages
 */
export class ChannelRegistry extends BaseRegistry<Channel> {
  /**
   * Find channels by type
   */
  getByType(type: string): Channel[] {
    return this.getAll().filter((channel) => channel.type === type);
  }

  /**
   * Find Slack channels
   */
  getSlackChannels(): Channel[] {
    return this.getByType('slack');
  }

  /**
   * Find email channels
   */
  getEmailChannels(): Channel[] {
    return this.getByType('email');
  }

  /**
   * Find HTTP channels
   */
  getHttpChannels(): Channel[] {
    return this.getByType('http');
  }

  /**
   * Find webhook channels
   */
  getWebhookChannels(): Channel[] {
    return this.getByType('webhook');
  }

  /**
   * Resolve channel references
   */
  resolve(refs: ChannelReference[]): Channel[] {
    return refs
      .map((ref) => this.get(ref.id))
      .filter((channel): channel is Channel => channel !== undefined);
  }
}

/**
 * Registry for Connector packages
 */
export class ConnectorRegistry extends BaseRegistry<Connector> {
  /**
   * Find connectors by type
   */
  getByType(type: string): Connector[] {
    return this.getAll().filter((connector) => connector.type === type);
  }

  /**
   * Find connectors by mode
   */
  getByMode(mode: 'action' | 'knowledge' | 'hybrid'): Connector[] {
    return this.getAll().filter((connector) => connector.mode === mode);
  }

  /**
   * Find action-oriented connectors
   */
  getActionConnectors(): Connector[] {
    return this.getByMode('action');
  }

  /**
   * Find knowledge-oriented connectors
   */
  getKnowledgeConnectors(): Connector[] {
    return this.getByMode('knowledge');
  }

  /**
   * Resolve connector references
   */
  resolve(refs: ConnectorReference[]): Connector[] {
    return refs
      .map((ref) => this.get(ref.id))
      .filter((connector): connector is Connector => connector !== undefined);
  }
}

/**
 * Registry for Schedule packages
 */
export class ScheduleRegistry extends BaseRegistry<Schedule> {
  /**
   * Find schedules by trigger type
   */
  getByType(type: string): Schedule[] {
    return this.getAll().filter((schedule) => schedule.type === type);
  }

  /**
   * Find cron-based schedules
   */
  getCronSchedules(): Schedule[] {
    return this.getByType('cron');
  }

  /**
   * Find event-based schedules
   */
  getEventSchedules(): Schedule[] {
    return this.getByType('event');
  }

  /**
   * Find manual trigger schedules
   */
  getManualSchedules(): Schedule[] {
    return this.getByType('manual');
  }

  /**
   * Resolve schedule references
   */
  resolve(refs: ScheduleReference[]): Schedule[] {
    return refs
      .map((ref) => this.get(ref.id))
      .filter((schedule): schedule is Schedule => schedule !== undefined);
  }
}

/**
 * Registry for Sandbox packages
 */
export class SandboxRegistry extends BaseRegistry<Sandbox> {
  /**
   * Get sandbox by name
   */
  getByName(name: string): Sandbox | undefined {
    return this.getAll().find((sandbox) => sandbox.name === name);
  }
}

/**
 * Composite registry for all Agent capabilities
 */
export class AgentCapabilityRegistry {
  tools: ToolRegistry;
  skills: SkillRegistry;
  channels: ChannelRegistry;
  connectors: ConnectorRegistry;
  schedules: ScheduleRegistry;
  sandboxes: SandboxRegistry;

  constructor() {
    this.tools = new ToolRegistry();
    this.skills = new SkillRegistry(this.tools);
    this.channels = new ChannelRegistry();
    this.connectors = new ConnectorRegistry();
    this.schedules = new ScheduleRegistry();
    this.sandboxes = new SandboxRegistry();
  }

  /**
   * Get statistics
   */
  getStats(): Record<string, number> {
    return {
      tools: this.tools.count(),
      skills: this.skills.count(),
      channels: this.channels.count(),
      connectors: this.connectors.count(),
      schedules: this.schedules.count(),
      sandboxes: this.sandboxes.count(),
    };
  }

  /**
   * Clear all registries
   */
  clear(): void {
    this.tools.clear();
    this.skills.clear();
    this.channels.clear();
    this.connectors.clear();
    this.schedules.clear();
    this.sandboxes.clear();
  }
}
