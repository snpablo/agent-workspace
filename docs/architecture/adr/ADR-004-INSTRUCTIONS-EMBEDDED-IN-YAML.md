# ADR-004: Instructions Embedded in YAML

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Context

Agent behavior is configured through **instructions** - the system prompt that defines how an agent thinks and acts.

Previously, instructions could be:
- Hardcoded in agent class definition
- Stored in separate prompt files
- Managed as database records
- Passed at runtime

This created separation between agent metadata and agent behavior, making it hard to:
- Version control agent behavior with agent definition
- Understand agent capabilities by reading one file
- Non-technical users to modify agent personality
- Reason about complete agent package

## Decision

**Instructions are embedded directly in the package YAML as a field.**

```yaml
kind: agent
id: decision-analyzer
name: Decision Analyzer
version: 1.0.0

instructions: |
  You are an expert strategic decision analyst.
  
  Your responsibilities:
  - Analyze complex business decisions
  - Evaluate options using structured frameworks
  - Identify risks and opportunities
  - Produce detailed analysis artifacts
  
  Process:
  1. Gather decision context
  2. Identify stakeholders
  3. Evaluate each option
  4. Synthesize findings

model: claude-opus
tools:
  - id: search-tool
```

Instructions are:
- Part of the package definition
- Versioned with the agent
- Readable in a single file
- Editable by non-technical users
- Reviewable in pull requests
- Complete with all metadata in one place

## Consequences

### Positive
- **Single source of truth:** Agent definition and behavior in one file
- **Version control:** Behavior changes are commits, not separate
- **Easy to understand:** Read the file, understand the agent
- **Non-technical authoring:** Anyone can write instructions
- **PR-friendly:** Behavior changes reviewable in pull requests
- **Portable:** Agent package is self-contained
- **Clear dependencies:** Tools/skills declared same file as instructions
- **Ease of modification:** Change instructions = change file = commit

### Negative
- **Large files:** agent.yaml can be long if instructions are detailed
- **File size limits:** Very large instructions might cause editor issues
- **Template expansion:** Complex instructions may benefit from templating
- **Environment-specific config:** Instructions can't easily reference environment variables

### Mitigation
- Keep instructions clear but concise
- Use line length conventions (80-120 chars for readability)
- Instructions are YAML multi-line strings (`|` or `>`), readable as markdown

## Alternatives Considered

1. **Separate instructions.md file**
   - Rejected: Breaks "single source of truth"
   - Rejected: Package isn't self-contained
   - Rejected: Harder to version together

2. **Instructions as database records**
   - Rejected: Breaks filesystem-first design
   - Rejected: Requires persistent storage
   - Rejected: Not portable

3. **Instructions passed at runtime**
   - Rejected: Can't see agent capabilities from package
   - Rejected: Behavior not version controlled
   - Rejected: Makes agents non-reproducible

4. **Separate prompt/ directory with prompts**
   - Rejected: Over-engineering for v1
   - Rejected: Still split from metadata
   - **Possible future** if shared prompts needed

5. **Templating system for instructions**
   - Rejected: Complexity not justified yet
   - Rejected: Non-technical users confused
   - **Possible future** if template reuse needed

---

## Implementation Details

Instructions field:
- Always present in agent definitions
- Multi-line string using YAML `|` (literal) or `>` (folded) syntax
- Treated as plain text by runtime
- Passed directly to model as system prompt
- Can reference agent role/name for context

Example with complex instructions:

```yaml
kind: agent
id: code-reviewer
name: Code Reviewer
version: 1.0.0

role: senior-engineer
model: claude-opus

instructions: |
  You are a senior software engineer and code reviewer.
  
  Code Review Standards:
  - Security: Check for injection, auth, data protection
  - Performance: Identify bottlenecks, efficiency issues
  - Maintainability: Question complex logic, naming clarity
  - Testing: Verify coverage, edge cases
  
  Output Format:
  Always provide your review as:
  1. Summary (1 paragraph)
  2. Critical Issues (if any)
  3. Improvements (by category)
  4. Positive Feedback
  
  Style:
  - Be constructive, never dismissive
  - Suggest specific improvements
  - Acknowledge good patterns

tools:
  - id: diff-tool
  - id: linter-tool
```

---

## Related Decisions

- [ADR-002: Package-First Architecture](ADR-002-PACKAGE-FIRST-ARCHITECTURE.md)
- [ADR-003: YAML-Rooted Packages](ADR-003-YAML-ROOTED-PACKAGES.md)

## References

- [ARCHITECTURE_V2.md - YAML Package Format](../ARCHITECTURE_V2.md#package-format-yaml)
- [AGENT_PACKAGE_MODEL.md - Agent Definition](../../../AGENT_PACKAGE_MODEL.md#agent-definition-agencyaml)
