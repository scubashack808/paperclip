# MRE-LOCAL: local changes on top of upstream Paperclip

This VPS runs upstream Paperclip (`paperclipai/paperclip`) pinned to an exact canary tag plus the
small local delta below. The source patch is carried in Git; the database patch is verified
separately because it persists outside Git.

## Current base

Pinned tag: `canary/v2026.805.0-canary.7`

Pinned commit: `8142e54150f263815100e52cc3db43b16d630122`

Update date: 2026-08-04 HST

## Thin patches

### PC-T01: auth session cache (source)

- File: `server/src/middleware/auth.ts`
- Behavior: cache Better Auth `getSession()` results by a SHA-256-derived cookie key for 30 seconds
  with a 1,000-entry LRU cap. The original live measurement was 250-450 ms per uncached lookup and
  a 97% cache hit rate under normal traffic.
- Trade-off: logout or session revocation can take up to 30 seconds to take effect.
- Upstream disposition at the pinned target: still distinct. Upstream changed the same middleware
  substantially but does not provide an equivalent session-result cache.
- Source proof: focused auth middleware tests plus the full repository suite.
- Artifact proof:

  ```sh
  grep -c resolveSessionCached server/dist/middleware/auth.js
  ```

  Expected: at least `2`.

### PC-T02: issue activity lookup index (database)

- Object: PostgreSQL partial index `activity_log_issue_lookup_idx`.
- Behavior: accelerate the correlated activity lookup in `issueCanonicalLastActivityAtExpr`.
- Original live measurement: issue-list latency fell from 5,954 ms to 3.6 ms.
- Upstream disposition at the pinned target: still distinct. Upstream retains the correlated query;
  its generic activity indexes do not cover company, issue entity, and descending activity time in
  the same partial index.
- Recreate on a fresh database only:

  ```sql
  CREATE INDEX CONCURRENTLY IF NOT EXISTS activity_log_issue_lookup_idx
    ON activity_log (company_id, entity_id, created_at DESC)
    WHERE entity_type = 'issue';
  ```

- Live proof: query `pg_indexes` for the exact definition after every restore or update.

## Retired patches

Retired on 2026-07-05 and rechecked against the current target:

- `issues.ts` Date `.toISOString()` coercion. Upstream supplies it.
- `issues.ts` run-log best-effort `try/catch`. Upstream supplies it.

## Update to a newer upstream tag

Do not build the new revision for the first time in `/root/paperclip`, and do not make cutover the
first run against production-shaped state.

1. Freeze an exact upstream tag/commit and create a clean worktree.
2. Reconcile PC-T01 by behavior against the target; do not accept a clean textual replay as proof.
3. Verify whether PC-T02 is still needed by inspecting both the target query and target indexes.
4. Install, typecheck, run the full relevant test suite, and build as the `paperclip` user in the
   isolated worktree.
5. Seed an isolated Paperclip worktree instance from a verified copy of live state. Keep its port,
   database, instance directory, scheduler, routines, agents, service, and global integrations
   separate from production. Exercise the exact built candidate there before cutover.
6. Before live mutation, create and verify a durable database backup plus the current source commit,
   service definition, instance configuration, uploads, workspaces, and secrets-key recovery basis.
7. Move the live checkout to the exact proven candidate, request an appropriate guarded restart,
   then verify service health, migrations, both thin patches, live UI/API behavior, and any restart
   continuity report.

## Backups

Hourly logical database backups live under the active instance's `data/backups/` directory and sync
to `gdrive:vps-archive/paperclip-db-backups/`. Ad-hoc cutover backups use a uniquely identifiable
filename and are verified locally and remotely by exact size and cryptographic hash.
Database dumps alone do not include uploads, workspaces, instance configuration, or the local
encrypted-secrets master key; a cutover recovery basis must cover those separately.
