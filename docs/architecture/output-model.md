# Output Model

## Thesis

The output is the durable result that survives beyond a thread or a run.

A persistent editable `Page` is one important output experience. More generally, the platform needs a broader `Output` model that can cover reports, drafts, plans, analyses, and other durable results.

## Base Shape

```ts
interface Output {
  id: string;
  type: string;
  title: string;
  status: OutputStatus;
  workspaceId: string;
  workItemId?: string;
  summary?: string;
  sections: OutputSection[];
  knowledgeSourceLinks: OutputKnowledgeSourceLink[];
  publishedKnowledgeSourceIds?: string[];
  actionLinks: OutputActionLink[];
  metadata: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
}
```

## Required Properties

- `type`: selects the output type definition
- `status`: defines lifecycle and UI behavior
- `sections`: the structured body of the output
- `knowledgeSourceLinks`: traceability for claims
- `publishedKnowledgeSourceIds`: knowledge sources derived from or published from this output
- `actionLinks`: what can happen next
- `metadata`: output-type-specific fields

## Output Publication

An output should not literally change identity into a knowledge source.

Instead:

- an output may remain an `Output`
- that output may be published as, indexed into, or derived into one or more `Knowledge Sources`

This preserves provenance and prevents the model from collapsing the roles of:

- durable work product
- grounding/reference material

Recommended linkage:

- `Output.publishedKnowledgeSourceIds[]`
- `KnowledgeSource.derivedFromOutputId?`

This is especially useful when a draft, report, or plan later becomes permanent internal reference material such as a wiki entry, PDF, or indexed knowledge asset.

## Output Type Registry

Every output type should be defined through a registry entry rather than hard-coded product logic.

```ts
interface OutputTypeDefinition {
  name: string;
  key: string;
  description: string;
  sectionDefinitions: SectionDefinition[];
  knowledgeSourceTypes: string[];
  actionTypes: string[];
  agentRoles: string[];
  metadataSchema: Record<string, unknown>;
}
```

## Section Model

Sections should be structured enough for rendering and validation, but flexible enough for multiple workspace types.

```ts
interface OutputSection {
  id: string;
  key: string;
  title: string;
  kind: "text" | "table" | "list" | "score" | "timeline" | "custom";
  content: unknown;
  status?: "draft" | "complete" | "needs_review";
}
```

## Example Output Families

### Decision Outputs

- decision-report
- recommendation
- scenario-analysis
- risk-assessment

### Operational Outputs

- renewal-analysis
- renewal-plan
- support-resolution
- escalation-package
- quote-package
- outreach-draft
- proposal-draft

### Research Outputs

- research-brief
- market-landscape
- technical-evaluation
- literature-review

### Planning Outputs

- project-plan
- implementation-plan
- migration-plan
- roadmap

### Workflow Outputs

- runbook
- playbook
- process-definition
- sop

### Communication Outputs

- executive-brief
- proposal
- customer-response
- meeting-summary

## Design Rules

1. An output type should define structure, not only labels.
2. Output types may vary by metadata and sections, but should share a common lifecycle model.
3. Knowledge source linkage should be first-class, not a text-only citation pattern.
4. Outputs should be versioned.
5. Outputs should remain editable by humans after agent generation.
6. Outputs may be published into knowledge sources without losing their own identity as outputs.

## Minimal Example

```json
{
  "name": "Decision Report",
  "key": "decision-report",
  "sectionDefinitions": [
    { "key": "summary", "title": "Summary" },
    { "key": "options", "title": "Options" },
    { "key": "recommendation", "title": "Recommendation" },
    { "key": "risks", "title": "Risks" }
  ],
  "knowledgeSourceTypes": ["document", "web-page", "dataset", "user-note"],
  "actionTypes": ["approve", "request-revision", "export", "create-followup-task"],
  "agentRoles": ["research", "risk", "editor"]
}
```

## Open Questions

- Do all outputs need the same status model?
- Which sections should allow machine-generated structure versus rich manual editing?
- When should an output split into multiple linked outputs instead of becoming too large?
- When should an output be rendered as a `Page` versus another output experience?
