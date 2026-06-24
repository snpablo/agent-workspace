# Decision Project Example

This example shows how Architecture V3 supports strategic decision-making without adding any domain-specific architecture layer.

## Archetype

- [Decision Project image](../../images/projects/decision-project.png)

## Structure

```text
decision-project/
  project.yaml
  agents/
    decision-analyzer/
      agent.yaml
      tools/
      connectors/
      skills/
      channels/
    options-synthesizer/
      agent.yaml
    risk-assessor/
      agent.yaml
  resources/
    company-strategy.yaml
    decision-criteria.yaml
    historical-decisions.yaml
    stakeholder-list.yaml
  artifacts/
    decision-analysis.yaml
    risk-assessment.yaml
  schedules/
    daily-review.yaml
    monthly-review.yaml
    weekly-synthesis.yaml
```

## What It Demonstrates

- Multi-agent decision analysis
- Shared project context through resources
- Artifact-centric outputs with durable schemas
- Scheduled review and synthesis work

## See Also

- [Architecture V3](../../architecture/ARCHITECTURE_V3.md)
- [Project Archetypes](../../project-archetypes/README.md)
- [Finance Project](../finance-project/README.md)
- [Hiring Project](../hiring-project/README.md)
- [Partner Project](../partner-project/README.md)
