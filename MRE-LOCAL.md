# MRE-LOCAL: local changes on top of upstream Paperclip

The MRE VPS runs upstream Paperclip (`paperclipai/paperclip`) pinned to an exact stable tag plus the
small private delta below. The source patch is carried in Git; the database patch is verified
separately because it persists outside Git.

## Current base

Pinned tag: `v2026.817.0`

Pinned commit: `213dabab4f8e1f3bb1803a2924c0fea1289fcd4c`

Pinned tree: `0f7d1f815488db6a104a4b9216ec41d8eccafe99`

Candidate date: 2026-08-19 HST

## Thin patches

### PC-T01: auth session cache (source)

- File: `server/src/middleware/auth.ts`
- Behavior: cache Better Auth `getSession()` results by a SHA-256-derived cookie key for 30 seconds
  with a 1,000-entry LRU cap. Session roles and company memberships remain uncached and are read on
  every request.
- Original measurement: 250-450 ms per uncached lookup and a 97% cache hit rate under normal live
  traffic.
- Trade-off: logout or session revocation can take up to 30 seconds to take effect.
- Upstream disposition at this target: still distinct. The stable line still calls the uncached
  session resolver directly.
- Candidate proof: focused authenticated-session tests, the full repository suite, and built-code
  inspection recorded in `UPDATE.md`.

### PC-T02: issue activity lookup index (database)

- Object: PostgreSQL partial index `activity_log_issue_lookup_idx`.
- Behavior: accelerate the correlated activity lookup in `issueCanonicalLastActivityAtExpr`.
- Original measurement: issue-list latency fell from 5,954 ms to 3.6 ms.
- Upstream disposition at this target: still distinct. The correlated query and generic activity
  indexes are unchanged, and migrations through `0211` do not add an equivalent index.
- Recreate on a fresh or rehearsed database only:

  ```sql
  CREATE INDEX CONCURRENTLY IF NOT EXISTS activity_log_issue_lookup_idx
    ON activity_log (company_id, entity_id, created_at DESC)
    WHERE entity_type = 'issue';
  ```

- Live proof: query `pg_indexes` for the exact definition after every restore or update.

## Retired patches

Retired on 2026-07-05 and rechecked against this target:

- `issues.ts` Date `.toISOString()` coercion. Upstream supplies it.
- `issues.ts` run-log best-effort error handling. Upstream supplies it.

## Update to a newer upstream tag

Do not build a new revision for the first time in `/root/paperclip`, and do not make cutover the
first run against production-shaped state.

1. Freeze an exact upstream tag, commit, and tree in a clean worktree.
2. Reconcile PC-T01 by behavior against the target, including every path changed by both lines.
3. Verify whether PC-T02 is still needed by inspecting the target query, schema, and migrations.
4. Install, typecheck, run the full repository suite, and build as the `paperclip` user in an
   isolated worktree.
5. Seed an isolated Paperclip instance from a verified live backup. Keep its port, database,
   instance directory, scheduler, routines, agents, service, and integrations separate from live.
6. Exercise the exact built candidate there, including migrations, authentication, issue-list
   behavior, quarantine, backup, and restore.
7. Before live mutation, create and verify a durable database backup plus the current source
   commit, service definition, instance configuration, uploads, workspaces, and secrets-key
   recovery basis.
8. Move the live checkout only to the exact proven candidate under separate approval, perform one
   guarded restart, then verify health, migrations, both thin patches, UI/API behavior, and run
   continuity.

## Backups

Hourly logical database backups live under the active instance's `data/backups/` directory and sync
to `gdrive:vps-archive/paperclip-db-backups/`. Ad-hoc cutover backups use a unique filename and are
verified locally and remotely by exact size and cryptographic hash. Database dumps alone do not
include uploads, workspaces, instance configuration, or the local encrypted-secrets master key;
the recovery basis must cover those separately.
