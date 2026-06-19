/**
 * Artifact Definition Examples
 *
 * Canonical definitions for common artifact types across verticals.
 */

import { ArtifactDefinitionBuilder } from '../src/builders';

/**
 * Create a Decision Analysis artifact definition
 */
export function createDecisionAnalysisArtifact() {
  return new ArtifactDefinitionBuilder('decision-analysis', 'decision-analysis', 'Decision Analysis', 1)
    .description('Structured analysis of decision options with evaluation criteria')
    .addSection('executive-summary', 'Executive Summary', 'text')
    .addSection('decision-statement', 'Decision Statement', 'text')
    .addSection('options', 'Options', 'structured')
    .addSection('evaluation-matrix', 'Evaluation Matrix', 'table')
    .addSection('recommendation', 'Recommendation', 'text')
    .addSection('risks-constraints', 'Risks & Constraints', 'list')
    .addAction('request-review', 'Request Review')
    .addAction('approve', 'Approve')
    .addAction('revise', 'Request Revision')
    .build();
}

/**
 * Create a Renewal Analysis artifact definition
 */
export function createRenewalAnalysisArtifact() {
  return new ArtifactDefinitionBuilder('renewal-analysis', 'renewal-analysis', 'Renewal Analysis', 1)
    .description('Analysis of partner renewal opportunity with financials and recommendations')
    .addSection('partner-info', 'Partner Information', 'structured')
    .addSection('current-terms', 'Current Terms', 'structured')
    .addSection('renewal-opportunity', 'Renewal Opportunity', 'text')
    .addSection('financial-analysis', 'Financial Analysis', 'table')
    .addSection('recommendations', 'Recommendations', 'text')
    .addSection('next-steps', 'Next Steps', 'list')
    .addAction('schedule-call', 'Schedule Call')
    .addAction('send-proposal', 'Send Proposal')
    .build();
}

/**
 * Create a Playbook Output artifact definition
 */
export function createPlaybookOutputArtifact() {
  return new ArtifactDefinitionBuilder('playbook-output', 'playbook-output', 'Playbook Output', 1)
    .description('Generic artifact for capturing playbook execution results')
    .addSection('overview', 'Overview', 'text')
    .addSection('execution-summary', 'Execution Summary', 'structured')
    .addSection('outputs', 'Outputs', 'structured')
    .addSection('next-actions', 'Next Actions', 'list')
    .build();
}

/**
 * Create a Knowledge Base artifact definition
 */
export function createKnowledgeBaseArtifact() {
  return new ArtifactDefinitionBuilder('knowledge-base', 'knowledge-base', 'Knowledge Base', 1)
    .description('Curated collection of reference materials and guidelines')
    .addSection('overview', 'Overview', 'text')
    .addSection('categories', 'Knowledge Categories', 'structured')
    .addSection('references', 'References', 'list')
    .addSection('quick-links', 'Quick Links', 'list')
    .build();
}

/**
 * Example artifact definitions in JSON format
 */
export const decisionAnalysisJSON = {
  id: 'decision-analysis',
  type: 'decision-analysis',
  version: 1,
  displayName: 'Decision Analysis',
  description: 'Structured analysis of decision options with evaluation criteria',
  sections: [
    { key: 'executive-summary', title: 'Executive Summary', type: 'text' },
    { key: 'decision-statement', title: 'Decision Statement', type: 'text' },
    { key: 'options', title: 'Options', type: 'structured' },
    { key: 'evaluation-matrix', title: 'Evaluation Matrix', type: 'table' },
    { key: 'recommendation', title: 'Recommendation', type: 'text' },
    { key: 'risks-constraints', title: 'Risks & Constraints', type: 'list' },
  ],
  actions: [
    { type: 'request-review', title: 'Request Review' },
    { type: 'approve', title: 'Approve' },
    { type: 'revise', title: 'Request Revision' },
  ],
};

export const renewalAnalysisJSON = {
  id: 'renewal-analysis',
  type: 'renewal-analysis',
  version: 1,
  displayName: 'Renewal Analysis',
  description: 'Analysis of partner renewal opportunity with financials and recommendations',
  sections: [
    { key: 'partner-info', title: 'Partner Information', type: 'structured' },
    { key: 'current-terms', title: 'Current Terms', type: 'structured' },
    { key: 'renewal-opportunity', title: 'Renewal Opportunity', type: 'text' },
    { key: 'financial-analysis', title: 'Financial Analysis', type: 'table' },
    { key: 'recommendations', title: 'Recommendations', type: 'text' },
    { key: 'next-steps', title: 'Next Steps', type: 'list' },
  ],
  actions: [
    { type: 'schedule-call', title: 'Schedule Call' },
    { type: 'send-proposal', title: 'Send Proposal' },
  ],
};
