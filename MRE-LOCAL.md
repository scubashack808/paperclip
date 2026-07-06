# MRE-LOCAL: local changes on top of upstream Paperclip

This VPS runs upstream Paperclip (github.com/paperclipai/paperclip) pinned to a tag,
plus the local commit(s) below, committed on `master` directly on top of the tag.
See exactly what is ours with: `git log <base-tag>..HEAD`.

## Current base
Pinned tag: canary/v2026.705.0-canary.0  (updated 2026-07-05)

## Local commits (what's ours)
1. MRE-LOCAL: auth session cache  (server/src/middleware/auth.ts)
   Caches better-auth getSession() (was 250-450ms x 6-10 calls/page) for 30s, 1000-entry LRU.
   Verify in build:  grep -c resolveSessionCached server/dist/middleware/auth.js   (expect >= 2)

## DB-side (not a code commit; persists across code updates)
- Postgres partial index activity_log_issue_lookup_idx (issues-list 5954ms -> 3.6ms).
  Recreate only on a fresh DB:
    CREATE INDEX CONCURRENTLY IF NOT EXISTS activity_log_issue_lookup_idx
      ON activity_log (company_id, entity_id, created_at DESC) WHERE entity_type='issue';

## Dropped 2026-07-05 (upstream integrated these)
- issues.ts Date .toISOString() coercion  (upstream issues.ts already has it)
- issues.ts run-log try/catch             (upstream issues.ts already wraps it)

## Update to a newer upstream tag
  git fetch origin --tags
  git rebase <new-tag>        # replays the MRE-LOCAL commit(s); resolve auth.ts if it conflicts
  sudo -u paperclip -H bash -lc 'cd /root/paperclip && pnpm install --frozen-lockfile --store-dir /home/paperclip/.pnpm-store && pnpm build'
  sudo systemctl restart paperclip
  systemctl is-active paperclip && grep -c resolveSessionCached server/dist/middleware/auth.js

## Backups
Never deleted. Ad-hoc DB backups ship to scubashack:VPS-Storage/archives/ via rclone copy
(hash-verified), then the local copy is removed. See backup.sh for the hourly pattern.
