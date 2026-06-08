# Microsoft References

This architecture uses Microsoft terminology intentionally. The sources below are the primary references used to tune the domain model.

## Platform Framing

- [Microsoft Build 2026: Be yourself at work](https://blogs.microsoft.com/blog/2026/06/02/microsoft-build-2026-be-yourself-at-work/)  
  Source for `Microsoft Agent Platform`, `Microsoft IQ`, and the current Build-era framing of agents across GitHub, Foundry, and Microsoft 365.

- [Agents hub - Start here for agentic computing at Microsoft](https://learn.microsoft.com/en-us/agents/)  
  Source for Microsoft’s current cross-product agent vocabulary, including `agents`, `actions`, `workflows`, `persistent memory`, `Microsoft Agent 365`, and `Microsoft Foundry`.

## Foundry Runtime Terms

- [Threads, runs, and messages in Foundry Agent Service](https://learn.microsoft.com/en-us/azure/ai-foundry/agents/concepts/threads-runs-messages)  
  Source for `agent`, `thread`, `message`, and `run`.

- [What are tools in Foundry Agent Service?](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/tool-catalog)  
  Source for `tool` as the formal execution capability term.

- [Set up your environment for Azure AI Foundry Agent Service](https://learn.microsoft.com/en-us/azure/ai-services/agents/environment-setup)  
  Source for `project` as an isolated workspace boundary in Foundry.

## Microsoft 365 Copilot Terms

- [Custom engine agents for Microsoft 365 overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-custom-engine-agent)  
  Source for `custom engine agent`, `orchestration`, `knowledge`, `actions`, and Microsoft 365 integration paths.

- [View agent activity in Microsoft 365 Copilot](https://learn.microsoft.com/en-us/microsoft-agent-365/observe-agents-microsoft-365-copilot)  
  Source for `agent activity`, `inputs and outputs`, `actions taken`, `results`, and task-oriented visibility beyond chat history.

## Persistent Content and Workspace Terms

- [How Microsoft 365 Copilot Pages works](https://support.microsoft.com/en-US/Microsoft-365-Copilot/how-microsoft-365-copilot-pages-works)  
  Source for `Pages` as a dynamic, persistent side-by-side canvas in Copilot chat.

- [Get started with Microsoft Loop](https://support.microsoft.com/en-us/office/get-started-with-microsoft-loop-9f4d8d4f-dfc6-4518-9ef6-069408c21f0c)  
  Source for `Loop workspaces`, `Loop pages`, and `Loop components`.

## Interpretation Notes

- We use `Workspace` as the product-level collaboration container because it aligns with Loop and common user expectations, even though Foundry uses `project` for the infrastructure isolation boundary.
- We use `Output` as the architecture term for durable results because Microsoft uses several user-facing result terms across products, including `page`, `content`, `response`, and `results`.
- We use `Knowledge Source` instead of `Evidence` to stay closer to Microsoft’s grounding language in Copilot Studio and Foundry.
- We use both `Skill` and `Tool` because they operate at different layers: `Skill` is packaged domain workflow behavior, while `Tool` is the atomic callable capability.
