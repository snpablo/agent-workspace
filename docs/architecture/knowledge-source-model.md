# Knowledge Source Model

## Purpose

Knowledge sources provide traceability for claims, conclusions, and actions.

Without knowledge sources, generated outputs become difficult to trust, review, or audit.

## Knowledge Source Shape

```ts
interface KnowledgeSource {
  id: string;
  type: string;
  title?: string;
  sourceRef: string;
  summary?: string;
  provenance: {
    collectedBy?: string;
    collectedAt?: string;
    method?: string;
  };
  status: "collected" | "verified" | "stale" | "rejected";
  metadata: Record<string, unknown>;
}
```

## Knowledge Source Types

- document
- web-page
- dataset
- transcript
- message
- user-note
- system-record

## Knowledge Source Rules

1. Knowledge sources should be linkable to specific output sections.
2. Knowledge sources should retain provenance.
3. Knowledge sources may be summarized, but the original source reference should remain available.
4. Knowledge source status should reflect confidence and review state.
5. Knowledge sources should be reusable across outputs where permissions allow.

## Why This Matters

The user should be able to answer:

- where did this claim come from?
- what grounds this recommendation?
- which knowledge sources are stale?
- what changed between versions?

## Open Questions

- Should knowledge source links support weights or confidence scores?
- How should conflicting knowledge sources be represented?
- Which knowledge source types can be edited versus only annotated?

## Microsoft References

- [What are tools in Foundry Agent Service?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/tool-catalog)
- [Custom engine agents for Microsoft 365 overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-custom-engine-agent)
- [Microsoft References](resources.md)
