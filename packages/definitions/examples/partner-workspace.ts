/**
 * Partner Workspace Definition Example
 *
 * Canonical definition for a partner operations workspace that supports
 * account management, renewal tracking, and partner collaboration.
 *
 * This workspace is organized around:
 * - Partner accounts as work items
 * - Renewal analyses and updates as artifacts
 * - Partner reviews and approval workflows as playbooks
 */

import { WorkspaceDefinitionBuilder } from '../src/builders';

/**
 * Create a Partner Workspace definition
 */
export function createPartnerWorkspaceDefinition() {
  return new WorkspaceDefinitionBuilder('partner-workspace-v1', 'partner', 1)
    .displayName('Partner Operations Workspace')
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
    .addArtifact('renewal-analysis', true)
    .addArtifact('partner-profile')
    .addArtifact('renewal-proposal')
    .addAction('schedule-call')
    .addAction('send-proposal')
    .addAction('request-approval')
    .addPlaybook('renewal-review-workflow')
    .build();
}

/**
 * Example partner workspace instance definition in JSON format
 */
export const partnerWorkspaceJSON = {
  workspace: {
    id: 'partner-workspace-v1',
    type: 'partner',
    version: 1,
    displayName: 'Partner Operations Workspace',
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
    { type: 'renewal-analysis', primary: true },
    { type: 'partner-profile' },
    { type: 'renewal-proposal' },
  ],
  actions: [
    { type: 'schedule-call' },
    { type: 'send-proposal' },
    { type: 'request-approval' },
  ],
  playbooks: [{ type: 'renewal-review-workflow' }],
};
