# Architecture Decision Records

These ADRs capture the durable Architecture V2 decisions behind the platform.

Read them after [ARCHITECTURE_V2.md](../ARCHITECTURE_V2.md) when you want the reasoning behind the model rather than just the model itself.

## Recommended Order

1. [ADR-008: Minimal Ontology](./ADR-008-MINIMAL-ONTOLOGY.md)
2. [ADR-001: Project as Primary Container](./ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md)
3. [ADR-002: Package-First Architecture](./ADR-002-PACKAGE-FIRST-ARCHITECTURE.md)
4. [ADR-003: YAML-Rooted Packages](./ADR-003-YAML-ROOTED-PACKAGES.md)
5. [ADR-004: Instructions Embedded in YAML](./ADR-004-INSTRUCTIONS-EMBEDDED-IN-YAML.md)
6. [ADR-006: Tools as Primary Capability Model](./ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md)
7. [ADR-007: Channels and Schedules as First-Class Concepts](./ADR-007-CHANNELS-AND-SCHEDULES-AS-FIRST-CLASS-CONCEPTS.md)
8. [ADR-005: Artifact-Centric Outputs](./ADR-005-ARTIFACT-CENTRIC-OUTPUTS.md)
9. [ADR-009: Borrow Before Inventing](./ADR-009-BORROW-BEFORE-INVENTING.md)

## Index

| ADR | Decision | Why It Matters |
|-----|----------|----------------|
| [ADR-001](./ADR-001-PROJECT-AS-PRIMARY-CONTAINER.md) | Project as Primary Container | Defines the top-level execution boundary |
| [ADR-002](./ADR-002-PACKAGE-FIRST-ARCHITECTURE.md) | Package-First Architecture | Makes the filesystem package model the source of truth |
| [ADR-003](./ADR-003-YAML-ROOTED-PACKAGES.md) | YAML-Rooted Packages | Standardizes package format and discovery |
| [ADR-004](./ADR-004-INSTRUCTIONS-EMBEDDED-IN-YAML.md) | Instructions Embedded in YAML | Keeps agent behavior with agent definition |
| [ADR-005](./ADR-005-ARTIFACT-CENTRIC-OUTPUTS.md) | Artifact-Centric Outputs | Makes durable outcomes first-class |
| [ADR-006](./ADR-006-TOOLS-AS-PRIMARY-CAPABILITY-MODEL.md) | Tools as Primary Capability Model | Unifies external capabilities behind one concept |
| [ADR-007](./ADR-007-CHANNELS-AND-SCHEDULES-AS-FIRST-CLASS-CONCEPTS.md) | Channels and Schedules as First-Class Concepts | Makes communication and automation explicit packages |
| [ADR-008](./ADR-008-MINIMAL-ONTOLOGY.md) | Minimal Ontology | Freezes the platform at 10 core concepts |
| [ADR-009](./ADR-009-BORROW-BEFORE-INVENTING.md) | Borrow Before Inventing | Sets the rule for naming and pattern choices |
