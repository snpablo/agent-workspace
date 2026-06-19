# Project Archetype Image Specifications

**Phase 1 Deliverable:** Detailed specifications for regenerating 4 project archetype images  
**Purpose:** Guide designer to adapt original workspace mockups for Architecture V2  
**Status:** Ready for designer implementation

---

## Decision Project Archetype

**Source:** decision-workspace.png  
**Target:** docs/images/projects/decision-project.png  

### Overview
Strategic decision-making application. Preserve the artifact-centric dashboard layout showing decision analysis workflows. The application guides organizations through complex decisions with multiple options being evaluated, risks assessed, and recommendations synthesized.

### Layout Preservation (DO NOT CHANGE)

**Left Panel: Decision Queue**
- List of decisions in various states
- Status indicators (color-coded)
- Recently active decisions at top
- Ability to filter/search
- Quick access to open decisions

**Center Panel: AI Assistant / Collaboration**
- Chat-based interaction surface
- Conversation history with agent
- Real-time analysis and recommendations
- Discussion with team members
- Collaborative input area

**Main Content Panel: Primary Artifact**
- Central focus: Current decision analysis document
- Sections for context, options, risks, recommendations
- Ability to view version history
- Status/approval indicators
- Export/share options

**Right Panel: Knowledge & Actions**
- Knowledge sources (company strategy, decision criteria, historical decisions)
- Agent capabilities/actions available
- Team members and their status
- Relevant metrics and KPIs
- Periodic review schedule/reminders

### Terminology Changes Only

| Old (V1) | New (V2) | Location |
|----------|----------|----------|
| "Decision Workspace" | "Decision Project" | Page title |
| "Work Items" | "Items" or "Decisions" | Queue header |
| "My Tasks" | "My Decisions" | Navigation |
| "Workspace Tabs" | "Project Tabs" | Tab labels |
| Any "Workflow" reference | Remove or replace with "Process" | Throughout |
| Any "Playbook" reference | Remove | Throughout |
| Any "Definition" reference | Remove | Throughout |

### Content Mapping (Behind the Scenes - Not Visible)

These concepts power the experience but remain invisible to the user:

| UI Element | Underlying Architecture V2 Concept |
|------------|-------------------------------------|
| Decision queue items | Project items (within Decision Project context) |
| AI Assistant | Agent interaction surface |
| Main analysis document | Artifact (versioned) |
| Knowledge sources panel | Resources |
| Agent capability cards | Agents |
| Chat history | Threads |
| Available actions | Agent tool invocations |
| Version selector | Runs + artifact versions |
| Review reminders/badges | Schedules |

### Key Information Relationships (Preserve)

1. **Decision → Options → Evaluation**: Show multiple options being evaluated
2. **Risk Assessment**: Visual risk matrix or heat map
3. **Stakeholder Involvement**: Show who is involved/reviewing
4. **Recommendation**: Clear recommendation section
5. **Timeline**: Decision progress and schedule
6. **Approval Status**: Who has approved/needs to approve

### Visual Style (Preserve)

- Clean, professional dashboard aesthetic
- Color-coded status indicators (decision stages)
- Card-based layout for queue items
- Clear artifact focus in main panel
- Integration with agent/assistant interface
- Modern enterprise application feel

### Do NOT Change

- Overall 4-panel dashboard structure
- Queue → Main → Right panel composition
- Artifact-centric information hierarchy
- AI Assistant interaction model
- Knowledge source/agent helper layout

---

## Finance Project Archetype

**Source:** finance-workspace.png  
**Target:** docs/images/projects/finance-project.png  

### Overview
Financial planning and analysis application. Preserve the metrics-driven dashboard showing financial reports, forecasts, budget tracking, and performance analysis. The application helps finance teams manage budgets, generate reports, and forecast financials.

### Layout Preservation (DO NOT CHANGE)

**Left Panel: Financial Items Queue**
- List of reports/forecasts/analyses
- Status by type (monthly report, forecast, budget review)
- Color-coded by status/priority
- Recently active items first
- Filter by report type

**Center Panel: AI Assistant / Analysis**
- Chat interface for financial queries
- Real-time calculations and analysis
- Discussion with finance team
- Recommendations and insights
- Input area for financial questions

**Main Content Panel: Primary Artifact**
- Financial report/forecast/budget document
- Charts, tables, financial metrics
- Comparison views (budget vs actual)
- Variance analysis
- Multiple sections: summary, details, analysis
- Version history navigation

**Right Panel: Knowledge & Metrics**
- Knowledge sources (financial data, models, policies)
- Key financial metrics (KPIs)
- Agent capabilities available
- Team member indicators
- Schedule for periodic reviews/processing

### Terminology Changes Only

| Old (V1) | New (V2) | Location |
|----------|----------|----------|
| "Finance Workspace" | "Finance Project" | Page title |
| "Work Items" | "Items" or "Reports" | Queue header |
| Any "Workflow" reference | Remove or replace with "Process" | Throughout |
| "My Tasks" | "My Reports" | Navigation |

### Content Mapping (Behind the Scenes)

| UI Element | Underlying Architecture V2 Concept |
|------------|-------------------------------------|
| Report queue items | Project items (within Finance Project context) |
| AI Assistant | Agent interaction surface |
| Main financial document | Artifact (versioned) |
| Knowledge sources (data, models) | Resources |
| Agent capability cards | Agents (Financial Analyst, Forecaster, etc.) |
| Chat history | Threads |
| Available financial actions | Agent tool invocations |
| Report version selector | Runs + artifact versions |
| Processing reminders | Schedules |

### Key Information Relationships (Preserve)

1. **Report Composition**: Budget vs actual, variances, trends
2. **Financial Metrics**: Key metrics prominently displayed
3. **Data Integration**: Show data coming from financial sources
4. **Time-Based Analysis**: Monthly/quarterly/annual views
5. **Forecast Updates**: Version progression of forecasts
6. **Approval/Review Status**: Who has reviewed/approved

### Visual Style (Preserve)

- Metrics-heavy dashboard
- Charts and financial data prominently featured
- Color-coded by performance (green/red/yellow)
- Professional financial application aesthetic
- Clear numerical hierarchy
- Time-series visualization where applicable

---

## Hiring Project Archetype

**Source:** hr-workspace.png  
**Target:** docs/images/projects/hiring-project.png  

### Overview
Talent management and hiring application. Preserve the candidate/team-centric dashboard showing hiring pipelines, evaluations, and onboarding processes. The application guides recruitment, evaluation, and team management.

### Layout Preservation (DO NOT CHANGE)

**Left Panel: Hiring Queue**
- List of candidates/positions/onboarding tasks
- Status by hiring stage (application, interview, offer, onboarding)
- Profile indicators (candidate names, avatars)
- Filtering by status/stage
- Recently active items first

**Center Panel: AI Assistant / Collaboration**
- Chat interface for hiring decisions
- Evaluation discussion and recommendations
- Team collaboration space
- Interview notes and feedback
- Input area for hiring questions

**Main Content Panel: Primary Artifact**
- Central: Job description, candidate evaluation, or onboarding checklist
- Candidate/position details
- Evaluation criteria and scores
- Interview feedback and assessments
- Onboarding progress tracking
- Version history/previous evaluations

**Right Panel: Knowledge & Actions**
- Knowledge sources (policies, requirements, org structure)
- Team member cards (hiring managers, interviewers)
- Available actions (schedule interview, send offer, etc.)
- Pipeline metrics
- Schedule for reviews and hiring decisions

### Terminology Changes Only

| Old (V1) | New (V2) | Location |
|----------|----------|----------|
| "Hiring Workspace" | "Hiring Project" | Page title |
| "Work Items" | "Items" or "Candidates" | Queue header |
| "My Tasks" | "My Hiring" or "Pipeline" | Navigation |
| Any "Workflow" reference | Remove or replace with "Process" | Throughout |

### Content Mapping (Behind the Scenes)

| UI Element | Underlying Architecture V2 Concept |
|------------|-------------------------------------|
| Candidate/position queue items | Project items (within Hiring Project context) |
| AI Assistant | Agent interaction surface |
| Job description/evaluation/checklist | Artifact (versioned) |
| Policies, org structure | Resources |
| Hiring manager cards | Agents |
| Discussion history | Threads |
| Available hiring actions | Agent tool invocations |
| Previous evaluations selector | Runs + artifact versions |
| Hiring review reminders | Schedules |

### Key Information Relationships (Preserve)

1. **Candidate Pipeline**: Application → Interview → Offer → Onboarding
2. **Team Structure**: Who is involved (hiring managers, interviewers)
3. **Evaluation Process**: Criteria, scores, feedback
4. **Onboarding Progress**: Steps completed, next actions
5. **Timeline**: Dates, deadlines, scheduling
6. **Approval/Consent**: Who has approved what stage

### Visual Style (Preserve)

- People-centric dashboard (profiles, avatars)
- Pipeline visualization (stages/status)
- Professional HR application aesthetic
- Status indicators (color-coded progress)
- Team member visibility
- Clear action items and next steps

---

## Partner Project Archetype

**Source:** partner-workspace.png  
**Target:** docs/images/projects/partner-project.png  

### Overview
Partner relationship management application. Preserve the partnership-centric dashboard showing partner information, agreements, performance tracking, and relationship status. The application manages complex partner relationships with multiple stakeholders.

### Layout Preservation (DO NOT CHANGE)

**Left Panel: Partner Queue**
- List of partners/partnerships/agreements
- Partner names, types, status indicators
- Color-coded by partnership status
- Recently active partnerships first
- Filter by partner type/status

**Center Panel: AI Assistant / Collaboration**
- Chat interface for partner discussions
- Contract analysis and recommendations
- Performance discussion
- Relationship planning and strategy
- Input area for partner questions

**Main Content Panel: Primary Artifact**
- Central: Partner agreement, performance report, or relationship status
- Partner contact information
- Agreement terms and milestones
- Performance metrics and KPIs
- Communication history
- Version history (agreements, status updates)

**Right Panel: Knowledge & Actions**
- Knowledge sources (partner database, contract templates, policies)
- Relationship metrics and performance indicators
- Agent capabilities and available actions
- Partner team member contacts
- Periodic business review schedule

### Terminology Changes Only

| Old (V1) | New (V2) | Location |
|----------|----------|----------|
| "Partner Workspace" | "Partner Project" | Page title |
| "Work Items" | "Items" or "Partnerships" | Queue header |
| "My Tasks" | "My Partners" | Navigation |
| Any "Workflow" reference | Remove or replace with "Process" | Throughout |

### Content Mapping (Behind the Scenes)

| UI Element | Underlying Architecture V2 Concept |
|------------|-------------------------------------|
| Partnership queue items | Project items (within Partner Project context) |
| AI Assistant | Agent interaction surface |
| Agreement/report document | Artifact (versioned) |
| Partner database, templates, policies | Resources |
| Partner manager team cards | Agents |
| Discussion and negotiation history | Threads |
| Available partnership actions | Agent tool invocations |
| Previous agreements selector | Runs + artifact versions |
| Quarterly review reminders | Schedules |

### Key Information Relationships (Preserve)

1. **Partner Information**: Contact details, relationship status
2. **Agreements**: Contract terms, milestones, renewal dates
3. **Performance Tracking**: KPIs, metrics, health indicators
4. **Communication**: Recent interactions, next scheduled review
5. **Team Involvement**: Who is managing this partnership
6. **Timeline**: Agreement dates, reviews, renewal cycles

### Visual Style (Preserve)

- Partnership-centric dashboard
- Partner information cards
- Agreement/contract prominence
- Performance metrics visualization
- Professional B2B aesthetic
- Clear relationship status indicators
- Action items and next review dates

---

## Cross-Cutting Design Principles

### For All Four Archetypes

1. **Preserve the 4-panel dashboard structure**
   - Queue on left
   - AI assistant in center
   - Primary artifact as main content
   - Knowledge/actions on right

2. **Maintain artifact-centric focus**
   - The document/report/agreement is the primary information hierarchy
   - All other panels support understanding and working with it

3. **Keep the AI assistant visible and central**
   - Not hidden in a sidebar
   - Natural collaboration interface
   - Shows agent capabilities and recommendations

4. **Minimize terminology changes**
   - Workspace → Project
   - WorkItem → Item (or domain-specific equivalent)
   - Remove V1 concepts entirely
   - Everything else stays the same

5. **Preserve information relationships**
   - Queue → Main → Right panel flow
   - Domain-specific concepts (Options, Metrics, Candidates, Agreements)
   - Status and progress indicators
   - Timeline and schedule integration

6. **Modern enterprise aesthetic**
   - Clean, professional
   - Consistent color coding
   - Clear visual hierarchy
   - Integration with AI/agent concepts
   - Feels like Claude Projects + Artifacts + Enterprise Dashboard

### What NOT to Do

❌ Replace dashboard with tree diagrams  
❌ Replace dashboard with architecture diagrams  
❌ Force Architecture V2 concepts into UI panels  
❌ Redesign overall layout  
❌ Make ontology visible (users should never think "Agents panel")  
❌ Hide the AI assistant  
❌ Deemphasize artifacts  
❌ Change visual style dramatically  

### What TO Do

✅ Update titles (Workspace → Project)  
✅ Update labels (WorkItem → Item)  
✅ Remove V1 terminology  
✅ Preserve everything else  
✅ Keep the dashboard feeling like a modern application  
✅ Keep architecture concepts behind the scenes  
✅ Maintain information architecture  

---

## Implementation Notes for Designer

- **Source files:** docs/images/originals/
  - decision-workspace.png → adapt to decision-project.png
  - finance-workspace.png → adapt to finance-project.png
  - hr-workspace.png → adapt to hiring-project.png
  - partner-workspace.png → adapt to partner-project.png

- **Target location:** docs/images/projects/

- **Minimal changes principle:** Only update text and terminology. Keep layouts, color schemes, information architecture, and visual aesthetic intact.

- **Validation:** When complete, each image should:
  - Show the domain application (feels like real work)
  - Use Architecture V2 terminology in labels
  - Have no V1 concepts visible
  - Feel like "Claude Projects + Artifacts + Agent Collaboration + Enterprise Domain Dashboard"

---

## Next Steps

1. Designer regenerates 4 images using these specifications
2. Images placed in docs/images/projects/
3. Move to Phase 2: Create example projects
4. Phase 3: Create documentation links
