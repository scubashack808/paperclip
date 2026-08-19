# MRE update qualification: stable v2026.817.0

This branch reconciles the maintained MRE Paperclip delta onto upstream stable
`v2026.817.0` (`213dabab4f8e1f3bb1803a2924c0fea1289fcd4c`, tree
`0f7d1f815488db6a104a4b9216ec41d8eccafe99`).

The qualified runtime commit is
`75bd29fbf20b3d2cd10c683896c725f6dd535f1d` (tree
`762fa4f97f9a9accb58c98d038e304836d66e074`). The maintained source delta is:

- the authenticated-session cache in `server/src/middleware/auth.ts`;
- its positive, negative, invalidation, and isolation coverage in
  `server/src/__tests__/auth-session-route.test.ts`;
- the local behavior ledger in `MRE-LOCAL.md`.

The database-resident `activity_log_issue_lookup_idx` remains intentionally
outside the source tree. It was preserved and exercised separately during the
copied-production rehearsal and independent restore.

## Qualification completed

- The focused private auth suite passed 14/14 on macOS and Linux.
- The full 32-workspace typecheck and complete production build passed on
  macOS. The complete production build also passed on Linux with the exact
  pinned Node 24 and pnpm 9.15.4 toolchain.
- All 128 server serialized suites passed independently.
- The full source matrix produced no candidate-only regression. Every failure
  class reproduced on the untouched stable comparator: macOS canonical-path
  assertions, Honolulu/timezone assumptions, managed-environment CLI context,
  the absence of `psql` on macOS, and Linux-only bubblewrap tests incorrectly
  running on macOS.
- Linux closed the platform-specific gaps: 448 adapter-runtime tests passed
  with 4 skips, all 7 real `psql` backup/restore tests passed, and the private
  14-test auth suite passed.

## Copied-production rehearsal

The exact runtime commit started and restarted in an isolated authenticated
instance using copied production database and object storage. Schedulers,
heartbeats, agents, assigned work, pending runs/wakeups, scheduled routines,
watchdogs, plugins, feedback delivery, telemetry, and external objects were
disabled or verified absent before acceptance.

The rehearsal proved:

- health identity and migration idempotence;
- 20/20 concurrent authenticated-session reads, sign-out invalidation, and
  isolation of a second live session;
- company, project, task, dashboard, activity, comment, search, attachment,
  and attachment-integrity reads;
- rendered authenticated UI for the Maui Dog Sitting dashboard and FareHarbor
  task `FAR-79`, including accessibility-tree verification;
- actual use of `activity_log_issue_lookup_idx` for representative task
  activity;
- a Paperclip-created 38,694,345-byte backup with SHA-256
  `91c0105642729e0752e58541233821c4b6165afd47f6898ca9050ed7f1bbd4bf`;
- restore into a second fresh Postgres, with all 213 migrations current before
  and after idempotent apply, 11 companies, 37 projects, 374 tasks, 157,976
  comments, 24 attachments, and 163,556 activity rows;
- exact preservation of the private partial-index definition after restore.

The rehearsal listener, copied database, independent restore database, and
temporary browser tunnel were shut down. The live checkout, service, database,
storage, configuration, and secrets were not changed; live Paperclip remained
healthy at its existing commit and PID throughout.

## Delivery and deployment boundary

This branch is source delivery for review. It is not a deployment. Merging the
private pull request and cutting over the live VPS are separate operator
approvals. A live cutover must revalidate this exact source identity, create a
fresh live backup, preserve the database index, verify health/auth/data/UI, and
retain a tested rollback path.
