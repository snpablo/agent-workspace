# Partner Project Example

This example shows how Architecture V3 supports contract work, relationship management, and performance tracking in a single project.

## Archetype

- [Partner Project image](../../images/projects/partner-project.png)

## Structure

```text
partner-project/
  project.yaml
  agents/
    partner-manager/
      agent.yaml
      tools/
      connectors/
      skills/
    contract-reviewer/
      agent.yaml
    relationship-analyst/
      agent.yaml
  resources/
    communication-protocols.yaml
    contract-templates.yaml
    kpi-definitions.yaml
    partner-database.yaml
  artifacts/
    partner-agreement.yaml
    contract-analysis.yaml
    relationship-status-report.yaml
    performance-report.yaml
  schedules/
    monthly-review.yaml
    quarterly-review.yaml
    annual-strategy.yaml
```

## What It Demonstrates

- External relationship workflows inside one project
- Contract and performance artifacts as first-class outputs
- Shared partner context and communication guidance
- Periodic review and planning schedules
- One featured V3 agent package with nested tools and skills

## See Also

- [Architecture V3](../../architecture/ARCHITECTURE_V3.md)
- [Project Archetypes](../../project-archetypes/README.md)
- [Decision Project](../decision-project/README.md)
- [Finance Project](../finance-project/README.md)
- [Hiring Project](../hiring-project/README.md)
