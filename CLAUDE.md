# Paperclip - Local Repo

## What This Repo Is

This is a local clone of the Paperclip open source project (github.com/paperclipai/paperclip). It is NOT the running Paperclip instance. The running instance is on the VPS.

## Architecture

| Component | Location | Purpose |
|-----------|----------|---------|
| **Running server** | VPS (`mre-vps` / `100.66.60.55:3100`) | The actual Paperclip instance. All companies, agents, issues, runs live here. |
| **This repo** | `~/CursorProjects/paperclip/` | Source code for development, CLI access, and reading code to understand how things work. |
| **Skills** | Symlinked from `~/.claude/skills/` into this repo (will be changed to VPS-fetched copies) | Paperclip skills that load into Claude Code sessions. |
| **CLI context** | `~/.paperclip/context.json` | Points at VPS API (`http://100.66.60.55:3100`), World Model company by default. |
| **Auth** | `~/.paperclip/auth.json` | Board user credentials for the VPS instance. |

## Rules

**Never run the server locally.** No `pnpm dev`, no `pnpm run`, no starting a local Paperclip instance. The server runs on the VPS only.

**VPS is the source of truth.** When updating Paperclip, update the VPS (`ssh mre-vps`, git pull, build, restart). Updating the local repo alone does nothing for the running system.

**Update procedure for VPS:**
```bash
ssh mre-vps "cd /root/paperclip && git pull origin master && pnpm install --frozen-lockfile && pnpm build"
ssh mre-vps "sudo systemctl restart paperclip"
ssh mre-vps "systemctl is-active paperclip"  # verify
```

**Keep local in sync.** After updating the VPS, also pull locally so the CLI and skills match the server version. The skill symlinks point into this repo, so a local/VPS version mismatch means agents could get stale instructions.

**Known issue (PAP-2):** Skills are currently symlinked from this local repo. They should instead be fetched from the VPS API so they're always version-matched to the running server. This is tracked in PAP-2.

## CLI Usage

All CLI commands hit the VPS API, not a local server:

```bash
# Set the env var first
export PAPERCLIP_API_KEY="pcp_board_6932d60a186268bdcff82c40932a80197772319e2472d064"

# Then run commands
pnpm paperclipai issue list
pnpm paperclipai issue get WOR-1
pnpm paperclipai company list
pnpm paperclipai auth whoami
```

Context is configured at `~/.paperclip/context.json`:
- API base: `http://100.66.60.55:3100`
- Company: `810ab6f6-a109-4ecc-95e5-2e75cf5d6d0f` (World Model)
- API key env var: `PAPERCLIP_API_KEY`

## Companies on the VPS

| Company | Prefix | ID |
|---------|--------|----|
| Paperclip Operations | PAP | `905fab10-0ca5-4a02-919a-0bfa06bc7d83` |
| World Model | WOR | `810ab6f6-a109-4ecc-95e5-2e75cf5d6d0f` |
| Research Operations | RES | `34eb1b54-4519-4b6c-9ee7-60bf1badd44a` |
| Context System | CON | `bb260489-d231-41d3-ab75-ee8c86bd11a3` |
| Maui Dog Sitting | MDS | `28053af3-de83-403e-8850-e82a8ed96671` |
| Scuba Shack Web Dev | SCU | `99cd27e1-fb28-4610-9e3d-9d912b34e665` |
| FareHarbor Inc. | FAR | `60817f3d-77a3-49fa-99d2-73041f5deb84` |

## Active Work

- **PAP-2**: Support interactive CLI agent sessions. Adds manual run creation so agents can checkout issues from CLI. Includes instruction file sync and skill version-pinning to VPS.
