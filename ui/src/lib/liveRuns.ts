import type { LiveRunForIssue } from "../api/heartbeats";

export interface IssueLiveRunBuckets {
  running: Set<string>;
  queued: Set<string>;
}

export function bucketLiveRunsByIssue(
  liveRuns: ReadonlyArray<LiveRunForIssue> | undefined,
): IssueLiveRunBuckets {
  const running = new Set<string>();
  const queued = new Set<string>();
  for (const run of liveRuns ?? []) {
    if (!run.issueId) continue;
    if (run.status === "running") {
      running.add(run.issueId);
    } else if (run.status === "queued" && !running.has(run.issueId)) {
      queued.add(run.issueId);
    }
  }
  for (const id of running) queued.delete(id);
  return { running, queued };
}

export interface AgentLiveRunCounts {
  running: number;
  queued: number;
}

export function countLiveRunsByAgent(
  liveRuns: ReadonlyArray<LiveRunForIssue> | undefined,
): Map<string, AgentLiveRunCounts> {
  const counts = new Map<string, AgentLiveRunCounts>();
  for (const run of liveRuns ?? []) {
    const entry = counts.get(run.agentId) ?? { running: 0, queued: 0 };
    if (run.status === "running") entry.running += 1;
    else if (run.status === "queued") entry.queued += 1;
    counts.set(run.agentId, entry);
  }
  return counts;
}

export function countRunningRuns(
  liveRuns: ReadonlyArray<LiveRunForIssue> | undefined,
): number {
  let total = 0;
  for (const run of liveRuns ?? []) {
    if (run.status === "running") total += 1;
  }
  return total;
}
