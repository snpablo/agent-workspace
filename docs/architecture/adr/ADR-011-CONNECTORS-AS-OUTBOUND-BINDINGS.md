# ADR-011: Connectors as Outbound Bindings

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Decision Summary

The platform introduces **Connector** as a first-class package kind for outbound system binding.

Connectors belong to the integration layer. They are packaged integration bindings that sit between inbound channels and callable tools.

## Context

Modern agent systems increasingly rely on established industry connector models:

- Anthropic uses MCP-based connectors to bind Claude to real user context and external systems.
- Microsoft uses connectors to define authenticated system access and then exposes specific actions through them.

In both ecosystems, the connector is not the action itself. It is the authenticated binding to the external system. The model calls specific operations exposed through that binding.

The repository previously treated `connector` only as a tool implementation subtype. That collapsed two different concerns:

- system binding and authentication
- discrete model-callable operations

## Decision

The platform now uses this split:

1. **Channel** is inbound.
   - It receives messages, UI events, webhooks, or external triggers into the project.

2. **Connector** is outbound.
   - It binds to an external system using OAuth, service auth, MCP server configuration, tenant/workspace identifiers, or enterprise indexing settings.

3. **Tool** is the callable operation.
   - It is the discrete read, search, update, or action capability the model is allowed to invoke through a connector.

Examples:

- one Google Drive MCP connector may surface `search_files`, `read_document`, and `share_link`
- one ServiceNow connector may surface `Get_Ticket_Details` and `Update_Status`
- one Notion connector may surface `search_pages`, `read_document`, and `append_comment`

## Consequences

### Positive

- Aligns the platform with common Anthropic and Microsoft terminology
- Separates authentication/binding from model-callable operations
- Lets one connector expose many tools cleanly
- Makes inbound channels and outbound bindings distinct
- Improves clarity for package layout and capability modeling

### Tradeoffs

- Adds another first-class package kind the docs and loader must explain clearly
- Requires loader, types, examples, and docs to distinguish channels from connectors
- Existing connector-backed tools may need follow-up cleanup to point at connector packages explicitly

## Alternatives Considered

1. **Keep connector only as a tool implementation subtype**
   - Rejected because it conflates system binding with operation surface.

2. **Keep describing the architecture as one flat fixed concept list**
   - Rejected because that framing hides the architectural distinction between collaboration concepts, integration bindings, and runtime records.

3. **Model outbound access as Resource**
   - Rejected because resources represent in-project context, not authenticated external system binding.

---

## Related Decisions

- [ADR-006: Tools as Primary Capability Model](ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md)
- [ADR-007: Channels and Schedules as First-Class Concepts](ADR-007-CHANNELS-AND-SCHEDULES-AS-FIRST-CLASS-CONCEPTS.md)
- [ADR-010: Event-Canonical Runtime](ADR-010-EVENT-CANONICAL-RUNTIME.md)

## References

- [ARCHITECTURE_V3.md - Connectors Bind Outbound Systems](../ARCHITECTURE_V3.md#connectors-bind-outbound-systems)
- [ARCHITECTURE_V3.md - Channels, Connectors, and Tools](../ARCHITECTURE_V3.md#channels-connectors-and-tools)
