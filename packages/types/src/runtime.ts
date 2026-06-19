/**
 * Runtime types for Agent Workspace Platform
 *
 * Runtime objects are live or persisted instances that exist during
 * workspace execution. They maintain state, execution history, and
 * collaborative context.
 */

/**
 * Status values for runtime instances
 */
export type InstanceStatus = 'active' | 'completed' | 'failed' | 'cancelled' | 'archived';
export type WorkItemStatus = 'open' | 'in_progress' | 'completed' | 'blocked' | 'archived';
export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'archived';
export type RunStatus = 'pending' | 'running' | 'succeeded' | 'failed' | 'cancelled';
export type ParticipantRole = 'owner' | 'editor' | 'reviewer' | 'viewer';

/**
 * Participant - human or agent actor in the workspace
 */
export interface Participant {
  id: string;
  type: 'human' | 'agent';
  workspaceId: string;
  role: ParticipantRole;
  name?: string;
  email?: string;
  joinedAt: string;
  lastActiveAt?: string;
}

/**
 * Knowledge source - grounding source for artifacts and work
 */
export interface KnowledgeSource {
  id: string;
  type: string;
  workspaceId: string;
  title: string;
  description?: string;
  contentHash?: string;
  sourceUrl?: string;
  createdAt: string;
  createdBy: string;
}

/**
 * Event - canonical record of runtime activity
 */
export interface Event {
  id: string;
  name: string;
  timestamp: string;
  workspaceId: string;
  runId?: string;
  artifactId?: string;
  actionId?: string;
  sessionId?: string;
  participantId?: string;
  payload?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Run - finite execution instance for a playbook, skill, or action
 */
export interface Run {
  id: string;
  workspaceId: string;
  status: RunStatus;
  startedAt: string;
  completedAt?: string;
  playbookDefinitionId?: string;
  skillDefinitionId?: string;
  toolDefinitionId?: string;
  sessionId: string;
  input?: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  events: Event[];
  metadata?: Record<string, any>;
}

/**
 * Action - executable or reviewable next step
 */
export interface Action {
  id: string;
  type: string;
  workspaceId: string;
  status: ActionStatus;
  title?: string;
  description?: string;
  workItemId?: string;
  artifactId?: string;
  runId?: string;
  assignedTo?: string;
  createdAt: string;
  completedAt?: string;
  metadata?: Record<string, any>;
}

/**
 * Thread - conversation or discussion context
 */
export interface Thread {
  id: string;
  workspaceId: string;
  status: InstanceStatus;
  workItemId?: string;
  artifactId?: string;
  sessionId?: string;
  messages: Message[];
  createdAt: string;
  updatedAt?: string;
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
 * Agent session - long-lived participation context for an agent
 */
export interface AgentSession {
  id: string;
  agentDefinitionId: string;
  workspaceId: string;
  status: InstanceStatus;
  createdAt: string;
  updatedAt?: string;
  runs: Run[];
  threads?: Thread[];
  context?: Record<string, any>;
  metadata?: Record<string, any>;
}

/**
 * Artifact instance - durable result created or edited in a workspace
 */
export interface ArtifactInstance {
  id: string;
  type: string;
  workspaceId: string;
  status: InstanceStatus;
  version: number;
  title?: string;
  content: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  workItemId?: string;
  knowledgeSources?: string[];
  relatedArtifacts?: string[];
  actions?: string[];
  participants?: string[];
  metadata?: Record<string, any>;
}

/**
 * Artifact version - immutable snapshot of artifact at a point in time
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
 * Work item - business anchor for active work in the workspace
 */
export interface WorkItem {
  id: string;
  type: string;
  workspaceId: string;
  status: WorkItemStatus;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  assignedTo?: string;
  dueDate?: string;
  artifacts?: string[];
  actions?: string[];
  knowledgeSources?: string[];
  threads?: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

/**
 * Playbook instance - runtime realization of a playbook definition
 */
export interface PlaybookInstance {
  id: string;
  playbookDefinitionId: string;
  workspaceId: string;
  status: InstanceStatus;
  createdAt: string;
  updatedAt?: string;
  runs: Run[];
  currentActivityId?: string;
  metadata?: Record<string, any>;
}

/**
 * Workspace instance - runtime realization of a workspace definition
 */
export interface WorkspaceInstance {
  id: string;
  workspaceDefinitionId: string;
  status: InstanceStatus;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  workItems: WorkItem[];
  artifacts: ArtifactInstance[];
  participants: Participant[];
  runs: Run[];
  actions: Action[];
  threads: Thread[];
  events: Event[];
  sessions: AgentSession[];
  playbookInstances: PlaybookInstance[];
  metadata?: Record<string, any>;
}

/**
 * Workspace state - runtime state model for a workspace
 */
export interface WorkspaceState {
  /** Current business state - work items, artifacts, actions */
  businessState: BusinessState;
  /** Selection state - what is currently selected */
  selectionState: SelectionState;
  /** Navigation state - current routes and focus */
  navigationState: NavigationState;
  /** Artifact state - artifact-specific runtime state */
  artifactState: ArtifactState;
  /** Agent state - agent sessions and activity */
  agentState: AgentState;
  /** Action state - pending and in-progress actions */
  actionState: ActionState;
  /** Activity state - events and timeline */
  activityState: ActivityState;
  /** Layout state - presentation state (visibility, sizes) */
  layoutState: LayoutState;
}

/**
 * Business state - work items, artifacts, and core work state
 */
export interface BusinessState {
  activeWorkItem?: string;
  workItems: WorkItem[];
  artifacts: ArtifactInstance[];
  knowledgeSources: KnowledgeSource[];
}

/**
 * Selection state - user selections within the workspace
 */
export interface SelectionState {
  selectedWorkItemId?: string;
  selectedArtifactId?: string;
  selectedActionId?: string;
  selectedParticipantId?: string;
}

/**
 * Navigation state - current route and UI focus
 */
export interface NavigationState {
  activeZone?: string;
  activeSurface?: string;
  breadcrumbs?: NavBreadcrumb[];
  modalOpen?: boolean;
  modalTarget?: string;
  history?: string[];
}

/**
 * Navigation breadcrumb for tracking navigation history
 */
export interface NavBreadcrumb {
  label: string;
  path: string;
  timestamp: string;
}

/**
 * Artifact state - artifact-specific runtime state
 */
export interface ArtifactState {
  editingArtifactId?: string;
  unsavedChanges?: Record<string, any>;
  versions: Record<string, ArtifactVersion[]>;
  activeVersion?: Record<string, number>;
}

/**
 * Agent state - agent sessions and activity tracking
 */
export interface AgentState {
  activeSessions: AgentSession[];
  runHistory: Run[];
  lastActivityAt?: string;
}

/**
 * Action state - pending and in-progress actions
 */
export interface ActionState {
  pendingActions: Action[];
  inProgressActions: Action[];
  completedActions: Action[];
}

/**
 * Activity state - events and timeline
 */
export interface ActivityState {
  events: Event[];
  recentActivity: ActivityEntry[];
  lastEventAt?: string;
}

/**
 * Activity entry for timeline
 */
export interface ActivityEntry {
  id: string;
  timestamp: string;
  type: string;
  actor: string;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * Layout state - runtime presentation state (visibility, splits, etc.)
 */
export interface LayoutState {
  panelVisibility?: Record<string, boolean>;
  splitSizes?: Record<string, number>;
  pinnedItems?: string[];
  collapsedSections?: string[];
}
