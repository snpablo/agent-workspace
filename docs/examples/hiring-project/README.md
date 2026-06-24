# Hiring Project Example

This example shows how Architecture V3 supports hiring, policy review, and onboarding as one project-centric system.

It is the clearest example of long-running collaborative work that starts, stops, and resumes over time:

- a recruiter opens the hiring request
- an agent drafts candidate materials
- hiring managers and coordinators review asynchronously
- another agent revises after comments or policy findings
- approval arrives later through a new event or scheduled review

## Archetype

- [Hiring Project image](../../images/projects/hiring-project.png)

## Structure

```text
hiring-project/
  project.yaml
  agents/
    hr-coordinator/
      agent.yaml
      tools/
      connectors/
      skills/
    hiring-assistant/
      agent.yaml
    policy-reviewer/
      agent.yaml
  resources/
    company-structure.yaml
    compliance-requirements.yaml
    employee-database.yaml
    hiring-policies.yaml
  artifacts/
    hiring-plan.yaml
    job-description.yaml
    candidate-evaluation.yaml
    onboarding-checklist.yaml
    employee-record.yaml
    policy-compliance-report.yaml
  schedules/
    weekly-hiring-review.yaml
    monthly-onboarding.yaml
    quarterly-policy-review.yaml
```

## What It Demonstrates

- Multi-human and multi-agent collaboration around hiring work
- Work that pauses and resumes across many events, reviews, and handoffs
- Canonical event history with queryable current-state projections
- Policy and compliance resources shared across agents
- Hiring and onboarding artifacts as durable outcomes
- Recurring governance and onboarding checks
- Evaluation kept outside the main execution and wake-up loop
- One featured V3 agent package with nested tools and skills

## See Also

- [Architecture V3](../../architecture/ARCHITECTURE_V3.md)
- [Project Archetypes](../../project-archetypes/README.md)
- [Decision Project](../decision-project/README.md)
- [Finance Project](../finance-project/README.md)
- [Partner Project](../partner-project/README.md)
