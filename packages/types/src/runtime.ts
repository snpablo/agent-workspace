/**
 * Runtime types for Agent Platform
 *
 * Runtime objects are live or persisted instances created during execution.
 * They maintain state, execution history, and collaborative context.
 *
 * There is no Definition/Instance split—definitions are filesystem packages,
 * runtime objects are live execution state.
 */

/**
 * Status values for runtime objects
 */
export type RunStatus = 'pending' | 'running' | 'succeeded' | 'failed' | 'cancelled';
export type ThreadStatus = 'active' | 'closed' | 'archived';
export type ArtifactStatus = 'draft' | 'active' | 'archived';
export type ParticipantRole = 'owner' | 'editor' | 'reviewer' | 'viewer';

/**
 * Participant - human or agent actor in a project
 */
export interface Participant {
  id: string;
  type: 'human' | 'agent';
  projectId: string;
  role: ParticipantRole;
  name?: string;
  email?: string;
  joinedAt: string;
  lastActiveAt?: string;
}

/**
 * Resource - context data (documents, configs, credentials, datasets)
 * Represents resources available to agents within a project
 */
export interface Resource {
  id: string;
  projectId: string;
  type: string;
  name: string;
  description?: string;
  content?: any;
  contentHash?: string;
  sourceUrl?: string;
  createdAt: string;
  createdBy: string;
  metadata?: Record<string, any>;
}

/**
 * Event - canonical record of runtime activity
 * Events are named with <object>.<verb> pattern and drive current-state projections.
 */
export interface Event {
  id: string;
  name: string;
  timestamp: string;
  projectId: string;
  runId?: string;
  artifactId?: string;
  threadId?: string;
  agentSessionId?: string;
  participantId?: string;
  payload?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Run - finite execution instance
 * Records a tool invocation, skill execution, or agent action
 */
export interface Run {
  id: string;
  projectId: string;
  agentId?: string;
  status: RunStatus;
  startedAt: string;
  completedAt?: string;
  /** What was invoked: tool, skill, agent, schedule */
  targetKind?: 'tool' | 'skill' | 'agent' | 'schedule';
  /** ID of what was invoked */
  targetId?: string;
  /** Thread this run belongs to */
  threadId?: string;
  /** Agent session context */
  agentSessionId?: string;
  /** Execution input */
  input?: Record<string, any>;
  /** Execution output/result */
  output?: Record<string, any>;
  /** Error if failed */
  error?: string;
  /** Canonical events emitted during execution */
  events?: Event[];
  /** Run metadata */
  metadata?: Record<string, any>;
}

/**
 * Thread - conversation or discussion
 * Links humans and agents discussing artifacts, runs, or project context
 */
export interface Thread {
  id: string;
  projectId: string;
  status: ThreadStatus;
  /** What is being discussed */
  targetKind?: 'artifact' | 'run' | 'project';
  targetId?: string;
  /** Messages in the thread */
  messages: Message[];
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  participants?: string[];
  metadata?: Record<string, any>;
}

/**
 * Message in a thread
 */
export interface Message {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * AgentSession - long-lived participation context for an agent in a project
 * Spans multiple runs and maintains agent-specific context
 */
export interface AgentSession {
  id: string;
  projectId: string;
  agentId: string;
  status: 'active' | 'idle' | 'completed' | 'archived';
  createdAt: string;
  updatedAt?: string;
  /** Runs executed in this session */
  runs?: string[];
  /** Threads involving this agent */
  threads?: string[];
  /** Session-specific context maintained across runs */
  context?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Artifact - durable result created or edited in a project
 * Represents a versioned, auditable outcome
 */
export interface Artifact {
  id: string;
  projectId: string;
  type: string;
  status: ArtifactStatus;
  title?: string;
  /** Current content */
  content: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  /** Current version number */
  version: number;
  /** Resources used to create this artifact */
  resources?: string[];
  /** Other artifacts related to this one */
  relatedArtifacts?: string[];
  /** Participants who have worked on this artifact */
  participants?: string[];
  metadata?: Record<string, any>;
}

/**
 * ArtifactVersion - immutable snapshot of artifact at a point in time
 */
export interface ArtifactVersion {
  id: string;
  artifactId: string;
  version: number;
  content: Record<string, any>;
  createdAt: string;
  createdBy: string;
  changeDescription?: string;
  metadata?: Record<string, any>;
}

/**
 * ProjectState - runtime state model for a project
 * Captures the mutable runtime state of a project execution
 */
export interface ProjectState {
  projectId: string;
  /** Artifacts in this project */
  artifacts: Artifact[];
  /** Runs executed in this project */
  runs: Run[];
  /** Threads (conversations) in this project */
  threads: Thread[];
  /** Resources available in this project */
  resources: Resource[];
  /** Agent sessions */
  agentSessions: AgentSession[];
  /** Participants */
  participants: Participant[];
  /** Events that have occurred */
  events: Event[];
  /** Runtime metadata */
  metadata?: Record<string, any>;
}
