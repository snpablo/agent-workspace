/**
 * Definition types for Agent Workspace Platform
 *
 * Definition objects are declarative, versioned, and portable templates.
 * They describe the structure and composition of workspace experiences
 * and the capabilities available within them.
 */

/**
 * Versioned metadata common to all definition objects
 */
export interface DefinitionMetadata {
  /** Unique identifier for the definition */
  id: string;
  /** Type classifier for the definition */
  type: string;
  /** Semantic or integer version */
  version: number;
  /** Human-readable display name */
  displayName?: string;
  /** Extended description or documentation */
  description?: string;
  /** Timestamp when definition was created */
  createdAt?: string;
  /** Timestamp when definition was last modified */
  updatedAt?: string;
}

/**
 * Skill definition - reusable capability invoked by agents or playbooks
 */
export interface SkillDefinition extends DefinitionMetadata {
  /** Tool references this skill may invoke */
  tools?: ToolReference[];
  /** Capability description or prompt guidance */
  instructions?: string;
  /** Input schema for skill invocation */
  inputSchema?: Record<string, any>;
  /** Output schema for skill results */
  outputSchema?: Record<string, any>;
}

/**
 * Tool definition - bounded callable capability
 */
export interface ToolDefinition extends DefinitionMetadata {
  /** Tool implementation or endpoint reference */
  implementation?: string;
  /** Input parameters schema */
  parameters?: Record<string, any>;
  /** Output schema */
  returns?: Record<string, any>;
  /** Any retry or execution policy */
  policy?: Record<string, any>;
}

/**
 * Agent definition - declarative description of an agent role and capabilities
 */
export interface AgentDefinition extends DefinitionMetadata {
  /** Role or title for the agent */
  role?: string;
  /** Skills this agent can invoke */
  skills?: SkillReference[];
  /** Tools this agent can use */
  tools?: ToolReference[];
  /** System prompt or behavior guidance */
  systemPrompt?: string;
  /** Model or implementation identifier */
  model?: string;
  /** Agent-specific policies or constraints */
  policies?: PolicyReference[];
}

/**
 * Artifact definition - declarative definition of a durable artifact type
 */
export interface ArtifactDefinition extends DefinitionMetadata {
  /** Structured sections that compose the artifact */
  sections?: ArtifactSection[];
  /** Relationships this artifact can have with other artifacts */
  relationships?: ArtifactRelationship[];
  /** Available actions on this artifact */
  actions?: ActionReference[];
  /** Validation schema for artifact content */
  contentSchema?: Record<string, any>;
}

/**
 * Artifact section - structural component within an artifact
 */
export interface ArtifactSection {
  key: string;
  title: string;
  description?: string;
  type: string;
  required?: boolean;
  schema?: Record<string, any>;
}

/**
 * Artifact relationship - allowed connections between artifact types
 */
export interface ArtifactRelationship {
  type: string;
  targetType: string;
  cardinality?: 'one-to-one' | 'one-to-many' | 'many-to-many';
  description?: string;
}

/**
 * Playbook definition - orchestration/process definition
 */
export interface PlaybookDefinition extends DefinitionMetadata {
  /** Sequential or parallel activities in the playbook */
  activities: PlaybookActivity[];
  /** Starting activity */
  startActivity?: string;
  /** Possible transitions between activities */
  transitions?: PlaybookTransition[];
  /** Skills required by the playbook */
  skills?: SkillReference[];
  /** Tools referenced by the playbook */
  tools?: ToolReference[];
  /** Input schema for playbook execution */
  inputSchema?: Record<string, any>;
  /** Output schema for playbook results */
  outputSchema?: Record<string, any>;
}

/**
 * Playbook activity - individual step in a playbook
 */
export interface PlaybookActivity {
  id: string;
  type: string;
  title?: string;
  description?: string;
  skill?: SkillReference;
  tool?: ToolReference;
  parameters?: Record<string, any>;
  timeout?: number;
}

/**
 * Playbook transition - control flow between activities
 */
export interface PlaybookTransition {
  from: string;
  to: string;
  condition?: string;
  description?: string;
}

/**
 * Workspace shell zone - structural region in workspace UI
 */
export interface Zone {
  key: string;
  component: string;
  placement?: string;
  priority?: string;
  collapsible?: boolean;
}

/**
 * Binding - connection between zone and object kind for view selection
 */
export interface Binding {
  zone: string;
  objectKind: string;
  view: string;
  selectionMode?: string;
}

/**
 * Workspace definition - declarative description of workspace type and composition
 */
export interface WorkspaceDefinition {
  /** Workspace identity and metadata */
  workspace: {
    id: string;
    type: string;
    version: number;
    displayName?: string;
    layout?: string;
  };
  /** Structural zones in the workspace shell */
  zones: Zone[];
  /** Bindings from zones to object kinds and views */
  bindings: Binding[];
  /** Artifact types available in this workspace */
  artifacts?: ArtifactReference[];
  /** Action types available in this workspace */
  actions?: TypeReference[];
  /** Playbook types available in this workspace */
  playbooks?: TypeReference[];
  /** Policies governing workspace behavior */
  policies?: PolicyReference[];
  /** Permission rules for workspace access and operations */
  permissions?: PermissionReference[];
}

/**
 * Artifact reference in workspace definition
 */
export interface ArtifactReference {
  type: string;
  primary?: boolean;
}

/**
 * Generic type reference
 */
export interface TypeReference {
  type: string;
}

/**
 * Policy reference
 */
export interface PolicyReference {
  type?: string;
  id?: string;
}

/**
 * Permission reference
 */
export interface PermissionReference {
  type?: string;
  id?: string;
}

/**
 * Skill reference - pointer to a SkillDefinition
 */
export interface SkillReference {
  skillId: string;
  version?: number;
}

/**
 * Tool reference - pointer to a ToolDefinition
 */
export interface ToolReference {
  toolId: string;
  version?: number;
}

/**
 * Action reference in workspace
 */
export interface ActionReference {
  type: string;
  title?: string;
  description?: string;
}
