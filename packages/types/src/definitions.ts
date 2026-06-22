/**
 * Package definition types for Agent Platform
 *
 * Definitions ARE filesystem packages (YAML files).
 * There is no separate Definition/Instance split.
 * Runtime state is kept in runtime types (see runtime.ts).
 *
 * Each package has metadata including:
 * - kind: what type of package (tool, skill, agent, project, etc.)
 * - id: unique identifier
 * - name: human-readable name
 * - version: semantic version
 * - sourcePath: filesystem path to YAML file
 */

/**
 * Package metadata common to all definitions
 * These fields come from the YAML package or are derived from the filesystem
 */
export interface PackageMetadata {
  /** Package kind: tool, skill, agent, project, channel, schedule, resource, sandbox */
  kind: 'tool' | 'skill' | 'agent' | 'project' | 'channel' | 'schedule' | 'resource' | 'sandbox';
  /** Unique identifier within scope */
  id: string;
  /** Display name */
  name: string;
  /** Semantic version */
  version: string;
  /** Filesystem path to YAML file */
  sourcePath: string;
  /** Description or documentation */
  description?: string;
  /** Creation timestamp */
  createdAt?: string;
  /** Last modification timestamp */
  updatedAt?: string;
}

/**
 * Tool package - interface to external capability
 * Located at: agents/agent-name/tools/tool-name.yaml
 */
export interface Tool extends PackageMetadata {
  kind: 'tool';
  /** Execution implementation config (API, MCP, connector, function, service) */
  implementation?: Record<string, any>;
  /** Input parameters schema */
  parameters?: Record<string, any>;
  /** Output schema */
  returns?: Record<string, any>;
  /** Execution constraints (timeout, retry, etc.) */
  policy?: Record<string, any>;
  /** Tool-specific metadata */
  metadata?: Record<string, any>;
}

/**
 * Skill package - reusable know-how composed from tools and skills
 * Located at: agents/agent-name/skills/skill-name.yaml
 */
export interface Skill extends PackageMetadata {
  kind: 'skill';
  /** Tool references this skill may invoke */
  tools?: ToolReference[];
  /** Other skills this skill may invoke */
  skills?: SkillReference[];
  /** Instructions for skill invocation */
  instructions?: string;
  /** Input schema */
  inputSchema?: Record<string, any>;
  /** Output schema */
  outputSchema?: Record<string, any>;
}

/**
 * Agent package - actor definition
 * Located at: agents/agent-name/agent.yaml
 */
export interface Agent extends PackageMetadata {
  kind: 'agent';
  /** Agent role or title */
  role?: string;
  /** Agent instructions (inline in YAML) */
  instructions?: string;
  /** Model or implementation identifier */
  model?: string;
  /** Tool references */
  tools?: ToolReference[];
  /** Skill references */
  skills?: SkillReference[];
  /** Execution constraints */
  constraints?: {
    maxIterations?: number;
    timeoutSeconds?: number;
    sandbox?: Record<string, any>;
  };
  /** Agent-specific policies */
  policies?: PolicyReference[];
  /** Agent metadata */
  metadata?: Record<string, any>;
}

/**
 * Project package - organizing container
 * Located at: project.yaml in project root
 */
export interface Project extends PackageMetadata {
  kind: 'project';
  /** Agent references */
  agents?: AgentReference[];
  /** Resource references */
  resources?: ResourceReference[];
  /** Artifact type definitions */
  artifacts?: ArtifactType[];
  /** Channel references */
  channels?: ChannelReference[];
  /** Schedule references */
  schedules?: ScheduleReference[];
  /** Project metadata */
  metadata?: Record<string, any>;
}

/**
 * Channel package - communication interface
 * Located at: channels/channel-name.yaml
 */
export interface Channel extends PackageMetadata {
  kind: 'channel';
  /** Channel type: slack, email, http, webhook, etc. */
  type: string;
  /** Connection configuration */
  config?: Record<string, any>;
  /** Channel metadata */
  metadata?: Record<string, any>;
}

/**
 * Schedule package - trigger definition
 * Located at: schedules/schedule-name.yaml
 */
export interface Schedule extends PackageMetadata {
  kind: 'schedule';
  /** Schedule type: cron, event, manual, etc. */
  type: string;
  /** Schedule expression or config */
  trigger?: Record<string, any>;
  /** What to execute when triggered */
  action?: Record<string, any>;
  /** Schedule metadata */
  metadata?: Record<string, any>;
}

/**
 * Resource package - context data
 * Located at: resources/resource-name.yaml
 */
export interface Resource extends PackageMetadata {
  kind: 'resource';
  /** Resource type: document, config, credential, data, etc. */
  type: string;
  /** Resource content or reference */
  content?: any;
  /** Access metadata */
  metadata?: Record<string, any>;
}

/**
 * Sandbox package - optional execution constraints for an agent
 * Located at: agents/agent-name/sandbox/*.yaml
 */
export interface Sandbox extends PackageMetadata {
  kind: 'sandbox';
  limits?: Record<string, any>;
  permissions?: Record<string, any>;
  environment?: Record<string, any>;
  metadata?: Record<string, any>;
}


/**
 * Artifact type - describes what kinds of artifacts a project creates
 * Part of project.yaml or in artifacts/ directory
 */
export interface ArtifactType {
  /** Kind is always 'artifact-type' */
  kind: 'artifact-type';
  /** Artifact type identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description */
  description?: string;
  /** JSON Schema for artifact content */
  schema?: Record<string, any>;
  /** Artifact structure */
  structure?: {
    sections?: Array<{ name: string; description?: string; schema?: Record<string, any> }>;
    relationships?: Array<{ name: string; target: string }>;
  };
}

// Reference types for linking between packages

/**
 * Reference to a tool by id
 */
export interface ToolReference {
  id: string;
  name?: string;
  description?: string;
  required?: boolean;
  path?: string;
}

/**
 * Reference to a skill by id
 */
export interface SkillReference {
  id: string;
  name?: string;
  description?: string;
  path?: string;
}

/**
 * Reference to an agent by id
 */
export interface AgentReference {
  id: string;
  name?: string;
  description?: string;
  path?: string;
}

/**
 * Reference to a resource by id
 */
export interface ResourceReference {
  id: string;
  name?: string;
  type?: string;
  path?: string;
}

/**
 * Reference to a channel by id
 */
export interface ChannelReference {
  id: string;
  name?: string;
  type?: string;
  path?: string;
}

/**
 * Reference to a schedule by id
 */
export interface ScheduleReference {
  id: string;
  name?: string;
  type?: string;
  path?: string;
}

/**
 * Reference to a policy by id
 */
export interface PolicyReference {
  id: string;
  name?: string;
  description?: string;
}

/**
 * Union of supported package definitions
 */
export type AnyPackage =
  | Tool
  | Skill
  | Agent
  | Project
  | Channel
  | Schedule
  | Resource
  | ArtifactType
  | Sandbox;

/**
 * Validation result for packages
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
