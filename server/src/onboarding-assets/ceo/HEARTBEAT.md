# HEARTBEAT.md -- Bill

Run this checklist every heartbeat.
This file defines cadence and QA only.
For role boundaries and routing, follow `AGENTS.md`.
For message formats, follow `SOUL.md`.

## 1. Identity And Wake Context

1. `GET /api/agents/me`
2. Read `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`, and `PAPERCLIP_APPROVAL_ID`
3. If identity, budget state, or company context is unclear, stop and escalate

## 3. Approval Pass

1. If `PAPERCLIP_APPROVAL_ID` is set, review that approval first
2. Comment on what is resolved, what remains, and any next action

## 4. Assignment Pass

1. `GET /api/companies/{companyId}/issues?assigneeAgentId={me}&status=todo,in_progress,blocked`
2. Prioritize `PAPERCLIP_TASK_ID` first, then `in_progress`, then `todo`
3. Ignore `blocked` unless you can unblock it immediately

## 5. Per-Issue Execution

For each issue you will touch:

1. `POST /api/issues/{id}/checkout`
2. If checkout returns `409`, do not retry
3. Refresh the latest working comment so it satisfies `AGENTS.md -> Required Preflight Classification`
4. Apply `AGENTS.md -> Deterministic Routing`
5. If you keep the task, work it directly
6. If you delegate, use `SOUL.md -> Delegation Brief Schema`
7. After any material change, update the issue per `AGENTS.md -> Material Task State`

## 7. Plan And Memory Pass

<<<<<<< Updated upstream
- For scoped issue wakes, Paperclip may already checkout the current issue in the harness before your run starts.
- Only call `POST /api/issues/{id}/checkout` yourself when you intentionally switch to a different task or the wake context did not already claim the issue.
- Never retry a 409 -- that task belongs to someone else.
- Do the work. Update status and comment when done.

Status quick guide:

- `todo`: ready to execute, but not yet checked out.
- `in_progress`: actively owned work. Agents should reach this by checkout, not by manually flipping status.
- `in_review`: waiting on review or approval, usually after handing work back to a board user or reviewer.
- `blocked`: cannot move until something specific changes. Say what is blocked and use `blockedByIssueIds` if another issue is the blocker.
- `done`: finished.
- `cancelled`: intentionally dropped.

## 6. Delegation
=======
1. Read today's plan from `$AGENT_HOME/memory/YYYY-MM-DD.md`
2. Update completed, blocked, and next items
3. Extract durable facts to the appropriate PARA location only after the related task state is recorded in Paperclip

## 8. Deviation Handling
>>>>>>> Stashed changes

If execution changes after you posted a plan or status expectation, add one deviation comment with:

1. `Original`
2. `Change`
3. `Reason`
4. `Impact`

If another deviation would be needed on the same issue, escalate per `AGENTS.md -> Escalate To The Board When`.

## 9. Closeout

Before exit:

1. Post a closing update using `SOUL.md -> Board Update Schema`
2. Make sure every touched issue has a current next action, blocker, handoff, or completion state

## QA Before Exit

- [ ] Opening daily-status update posted
- [ ] Closing daily-status update posted
- [ ] Every touched issue has a current preflight block
- [ ] Every checkout `409` was skipped rather than retried
- [ ] Every delegation used `SOUL.md -> Delegation Brief Schema`
- [ ] Every board-facing update used `SOUL.md -> Board Update Schema`
- [ ] Every material task state change was reflected in Paperclip
- [ ] Any deviation was documented or escalated
- [ ] No issue was touched and left without an explicit next action or blocker
