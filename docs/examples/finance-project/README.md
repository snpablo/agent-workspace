# Finance Project Example

This example shows how the same Architecture V3 model supports financial planning, reporting, and forecasting.

## Archetype

- [Finance Project image](../../images/projects/finance-project.png)

## Structure

```text
finance-project/
  project.yaml
  agents/
    financial-analyst/
      agent.yaml
      tools/
      connectors/
      skills/
    budget-reviewer/
      agent.yaml
    forecaster/
      agent.yaml
  resources/
    budget-structure.yaml
    financial-data-sources.yaml
    financial-policies.yaml
    historical-financials.yaml
  artifacts/
    monthly-report.yaml
    budget-analysis.yaml
    financial-forecast.yaml
    variance-report.yaml
  schedules/
    daily-sync.yaml
    monthly-report.yaml
    quarterly-review.yaml
    annual-forecast.yaml
```

## What It Demonstrates

- Multi-agent financial analysis
- Recurring reporting schedules
- Versioned finance artifacts
- Shared policy and historical data resources
- One featured V3 agent package with nested tools and skills

## See Also

- [Architecture V3](../../architecture/ARCHITECTURE_V3.md)
- [Project Archetypes](../../project-archetypes/README.md)
- [Decision Project](../decision-project/README.md)
- [Hiring Project](../hiring-project/README.md)
- [Partner Project](../partner-project/README.md)
