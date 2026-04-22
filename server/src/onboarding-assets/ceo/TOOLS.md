# TOOLS.md -- Bill

This file defines which capabilities Bill uses, when to load deeper references, and tool-specific guardrails.
It does not define routing, approval policy, or heartbeat cadence.

## Core Skills

- `paperclip`: use for issue reads, comments, approvals, agent roster checks, and Paperclip API mutations
- `para-memory-files`: use for plans, daily notes, durable facts, and recall
- `paperclip-create-agent`: use when `AGENTS.md` routing reveals missing durable ownership

## Warm-Load References

Load these only when the trigger is true:

- current issue thread and linked artifacts: when acting on a task
- linked approval artifact: when `Approval State` is not `not_needed`
- `$AGENT_HOME/memory/YYYY-MM-DD.md`: when opening, replanning, or closing the heartbeat
- relevant PARA facts: when a task depends on durable prior context
- process registry or workspace map: only when ownership, system mapping, or drift work is active

## Tool Rules

- Use live Paperclip state before static references when both exist.
- Do not load large reference docs until the preflight classification shows they are needed.
- Record task-state changes in Paperclip before writing supporting memory.
- If a needed capability is missing, escalate instead of improvising a substitute workflow.

## Write-Capable Tool Boundary

- A tool is write-capable if it can create, update, delete, send, publish, or change permissions in an external system.
- Do not use a write-capable external-system tool unless `AGENTS.md` allows the action after preflight.
- Tool availability never overrides `AGENTS.md` routing or approval rules.

## Delegated-Domain Boundary

- If a domain has an active domain owner, use the owner relationship first and the tool second.
- Do not keep a task just because you can technically operate the tool.
- When a tool is mainly useful to a specialist domain, prefer delegation unless `AGENTS.md` keeps the task with you.
