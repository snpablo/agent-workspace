/**
 * Decision Workspace Definition Example
 *
 * Canonical definition for a decision-making workspace that supports
 * collaborative analysis, option evaluation, and group decision-making.
 *
 * This workspace is organized around:
 * - Decision work items as the primary queue
 * - Analysis artifacts as the primary output
 * - Decision reviews and approvals as key actions
 */

import { WorkspaceDefinitionBuilder } from '../src/builders';

/**
 * Create a Decision Workspace definition
 */
export function createDecisionWorkspaceDefinition() {
  return new WorkspaceDefinitionBuilder('decision-workspace-v1', 'decision', 1)
    .displayName('Decision Workspace')
    .layout('operational')
    .addZone('header', 'Header')
    .addZone('queue', 'Queue')
    .addZone('analysis', 'ArtifactSurface')
    .addZone('knowledge', 'KnowledgePanel')
    .addZone('agent', 'AgentPanel')
    .addZone('actions', 'ActionPanel')
    .addZone('timeline', 'ActivityTimeline')
    .addZone('modal', 'ModalSurface')
    .addBinding('queue', 'work_item', 'queue_view')
    .addBinding('analysis', 'artifact', 'editor_view')
    .addBinding('knowledge', 'knowledge_source', 'list_view')
    .addBinding('agent', 'agent_session', 'activity_view')
    .addBinding('actions', 'action', 'actions_view')
    .addBinding('timeline', 'event', 'timeline_view')
    .addArtifact('decision-analysis', true)
    .addArtifact('decision-options')
    .addArtifact('decision-rationale')
    .addAction('request-review')
    .addAction('approve-decision')
    .addAction('request-revision')
    .addPlaybook('decision-review-workflow')
    .build();
}

/**
 * Example decision workspace instance definition in JSON format
 */
export const decisionWorkspaceJSON = {
  workspace: {
    id: 'decision-workspace-v1',
    type: 'decision',
    version: 1,
    displayName: 'Decision Workspace',
    layout: 'operational',
  },
  zones: [
    { key: 'header', component: 'Header' },
    { key: 'queue', component: 'Queue' },
    { key: 'analysis', component: 'ArtifactSurface' },
    { key: 'knowledge', component: 'KnowledgePanel' },
    { key: 'agent', component: 'AgentPanel' },
    { key: 'actions', component: 'ActionPanel' },
    { key: 'timeline', component: 'ActivityTimeline' },
    { key: 'modal', component: 'ModalSurface' },
  ],
  bindings: [
    { zone: 'queue', objectKind: 'work_item', view: 'queue_view' },
    { zone: 'analysis', objectKind: 'artifact', view: 'editor_view' },
    { zone: 'knowledge', objectKind: 'knowledge_source', view: 'list_view' },
    { zone: 'agent', objectKind: 'agent_session', view: 'activity_view' },
    { zone: 'actions', objectKind: 'action', view: 'actions_view' },
    { zone: 'timeline', objectKind: 'event', view: 'timeline_view' },
  ],
  artifacts: [
    { type: 'decision-analysis', primary: true },
    { type: 'decision-options' },
    { type: 'decision-rationale' },
  ],
  actions: [
    { type: 'request-review' },
    { type: 'approve-decision' },
    { type: 'request-revision' },
  ],
  playbooks: [{ type: 'decision-review-workflow' }],
};
