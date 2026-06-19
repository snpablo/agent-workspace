# ADR-009: Borrow Before Inventing

**Status:** Accepted  
**Date:** June 2026  
**Author:** Platform Architecture Team

---

## Context

When designing a new platform, you face choices at every decision point:
- Invent new terminology?
- Adopt existing terminology?
- Invent new patterns?
- Use proven patterns?

Inventing offers:
- Perfect fit for your domain
- Fresh start (not constrained by history)

Borrowing offers:
- Users already know the term
- Proven patterns (battle-tested)
- Community alignment
- Easier learning curve
- Cross-platform portability

The question: When do you invent vs. borrow?

## Decision

**Borrow industry patterns and terminology first. Invent only when there's no suitable alternative.**

### What We Borrowed

#### Concepts

- **Project:** From Claude Projects, Vercel Eve, GitHub Projects
- **Agent:** From AI/ML community (LangGraph, AutoGen, CrewAI)
- **Tool:** From Claude tool_use, OpenAI functions, Anthropic tool calling
- **Run:** From academic agent literature, workflow engines
- **Artifact:** From design/product management ("artifact" = design output)
- **Thread:** From collaboration software (Slack, Discord)
- **Skill:** From game design (player skills), educational models

#### Patterns

- **Filesystem packages:** From Docker, Kubernetes, Terraform
- **YAML configuration:** From DevOps/cloud native tools
- **Version control:** Git as source of truth
- **Provider pattern:** From strategy pattern in software design
- **Event stream:** From event sourcing, Kafka
- **Reference resolution:** From dependency management

### What We Invented

Only when necessary:

- **PackageMetadata structure:** Needed to bridge filesystem discovery and runtime
- **Reference pattern:** `{ id: string, name?: string }` for lazy resolution
- **ProjectContext structure:** Specific to how we manage runtime state
- **ToolProvider pattern:** Specific to our tool abstraction (though strategy pattern not new)

## Consequences

### Positive
- **Familiar to users:** They already know what "Agent" means
- **Documented patterns:** Industry patterns have books/tutorials
- **Proven solutions:** Borrowed patterns are battle-tested
- **Hiring advantage:** Developers already know the vocabulary
- **Community engagement:** Can engage with broader agent community
- **Cross-platform:** Projects look similar across platforms
- **Less risk:** Not betting on own designs

### Negative
- **Constrained by others' choices:** Can't always perfect-fit our needs
- **History baggage:** May inherit assumptions we don't agree with
- **Bikeshedding:** Community has opinions on terminology
- **Incremental vs. revolutionary:** Won't invent tomorrow's patterns

---

## Examples of Borrow vs. Invent

### Example 1: Project

**Borrowed:** Project, from Claude Projects and GitHub Projects
- Users understand "create a project"
- All platforms use this term
- No confusion with other concepts

**Alternative we rejected:** "Workspace" (too UI-centric), "Execution Context" (too technical)

### Example 2: Tool

**Borrowed:** "Tool" from Claude, OpenAI, Anthropic APIs
- Developers know this means "capability"
- Used across LLM frameworks
- Clear semantic

**Alternative we rejected:** "Capability," "Integration," "Function" (ambiguous), "Extension" (unclear)

### Example 3: Artifact

**Borrowed:** "Artifact" from UX/design community
- Used for design outputs, documents, assets
- Clearly means "durable result"
- Non-technical users understand

**Alternative we rejected:** "Output" (vague), "Result" (generic), "Asset" (ambiguous)

### Example 4: YAML Configuration

**Borrowed:** YAML from DevOps/Kubernetes/Terraform
- Developers expect YAML for config
- Standard in cloud native
- Tools exist

**Alternative we rejected:** JSON (less readable), Python (requires runtime), DSL (learning curve)

### Example 5: PackageMetadata

**Invented:** The specific structure with kind/id/name/version/sourcePath
- Nothing in industry quite matches our needs
- Needed to bridge filesystem discovery and runtime
- Custom invention was justified

---

## Decision Process

When facing a design choice:

1. **Look at industry standards first**
   - How do Claude Projects do it?
   - How do Vercel Eve, LangGraph, AutoGen do it?
   - Is there a de facto standard?

2. **Adopt if it fits**
   - If it solves your problem, use it
   - Benefits outweigh any mismatch

3. **Adapt carefully if needed**
   - If slightly off, adapt minimally
   - Rename if needed for clarity
   - But maintain spirit of original

4. **Invent only when**
   - No industry standard exists
   - Existing standards don't fit core needs
   - Invention adds significant value

## Alignment with Industry

Our vocabulary aligns with:

| Concept | Claude Projects | Vercel Eve | LangGraph | AutoGen |
|---------|-----------------|-----------|-----------|----------|
| Project | ✓ | ✓ | - | - |
| Agent | ✓ | ✓ | ✓ | ✓ |
| Tool | ✓ | ✓ | ✓ | ✓ |
| Run | ✓ | ✓ | ✓ | ✓ |
| Thread | ✓ (soon) | - | - | - |

This alignment:
- Reduces learning curve for multi-platform developers
- Enables knowledge sharing between platforms
- Supports eventual interoperability
- Future-proofs against market shifts

## Related Decisions

- [ADR-001: Project as Primary Container](ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md) (borrowed Project term)
- [ADR-006: Tools as Primary Capability](ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md) (borrowed Tool term)
- [ADR-008: Minimal Ontology](ADR-008-MINIMAL-ONTOLOGY.md) (enables focused borrowing)

## References

- [ARCHITECTURE_V2.md - Vision](../ARCHITECTURE_V2.md#vision)
- Industry alignment documented in various capability documentation
