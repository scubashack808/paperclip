# Handoff: `paper` CLI + Context Window Fix

**From:** Kevin (session 2026-04-07)
**For:** Ethan

---

## What Happened

Kevin needed a way to interactively chat with Paperclip agents from the terminal instead of going through the Paperclip UI's heartbeat/comment system. We built a CLI tool and found a context window bug along the way.

## 1. `paper` CLI Tool

**Location:** `~/.local/bin/paper`

A shell script that launches an interactive Claude Code session as any Paperclip agent. It queries the Paperclip API, resolves the agent, handles auth, and launches claude with the right flags.

**Usage:**
```
paper                         # show org directory (all companies + agents)
paper paperclip               # talk to the Paperclip Operations CEO
paper research                # talk to the Research Operations CEO
paper paperclip harness       # talk to a specific agent in a company
paper ceo                     # if ambiguous, shows numbered picker
```

**What it does under the hood:**
- Queries `/api/companies` and `/api/companies/{id}/agents` to build the org
- Fuzzy matches company name, prefix, agent name, urlKey, or role
- Creates and caches API keys per agent at `~/.paperclip/paper-keys.json`
- Installs Paperclip skills into `~/.claude/skills/` on first run (symlinks from repo `skills/`)
- Registers a run via `/api/agents/{id}/wakeup` for tracking in the dashboard
- Sets env vars: `PAPERCLIP_API_URL`, `PAPERCLIP_COMPANY_ID`, `PAPERCLIP_AGENT_ID`, `PAPERCLIP_API_KEY`, `PAPERCLIP_RUN_ID`
- cd's into the agent's workspace (adapterConfig.cwd if set, otherwise `~/.paperclip/instances/default/workspaces/{agentId}/`)
- Launches `claude --model {model} --dangerously-skip-permissions --append-system-prompt-file {instructionsFilePath}`

**The script replicates what the claude_local adapter does for heartbeat runs, minus `--print -` and `--output-format stream-json` (which are for headless/programmatic use).**

## 2. Context Window Bug (IMPORTANT)

**Problem:** All Paperclip agents were running on 200K context instead of 1M.

**Root cause:** Agent configs stored `model: "claude-opus-4-6"` which gets the default 200K context window. The 1M version requires `model: "claude-opus-4-6[1m]"` with the `[1m]` suffix.

**Impact:** Kevin's CEO session hit 68% context after ~15 prompts (136K tokens / 200K = 68%). Normal sessions on 1M would have been at ~14%.

**Fix applied:**
- Updated both existing CEOs via API to `claude-opus-4-6[1m]`
- Added safety net in `paper` script: auto-appends `[1m]` to `claude-opus-4-6` model IDs

**Fix still needed (Ethan):**
- The default model for new agents created through the Paperclip UI probably doesn't include `[1m]`. Every new agent will have the same 200K problem until this default is changed.
- Check where the default model is set during agent creation (onboarding wizard, UI agent creation form, API defaults) and update to `claude-opus-4-6[1m]`.
- Consider whether the adapter should auto-append `[1m]` when it sees `claude-opus-4-6` without a context suffix, similar to what the `paper` script does.

## 3. How `paper` Relates to Paperclip

`paper` is a CLIENT-SIDE convenience tool. It doesn't modify Paperclip's codebase. It uses the existing API the same way the CLI and dashboard do. The only Paperclip-side consideration is:

- **Run registration:** `paper` calls `/api/agents/{id}/wakeup` to register interactive sessions as tracked runs. This might have side effects if the wakeup endpoint also triggers adapter-managed heartbeat runs. Ethan should verify that wakeup with `source: "on_demand"` doesn't spawn a parallel headless run when the agent is idle.
- **API keys:** `paper` creates long-lived keys via `/api/agents/{id}/keys` with name `paper-cli`. These persist. Not a problem, but worth knowing.

## Files

| File | What |
|------|------|
| `~/.local/bin/paper` | The CLI script |
| `~/.paperclip/paper-keys.json` | Cached API keys per agent |
| Agent instruction files | `~/.paperclip/instances/default/companies/{companyId}/agents/{agentId}/instructions/AGENTS.md` |
| Agent workspaces | `~/.paperclip/instances/default/workspaces/{agentId}/` |
