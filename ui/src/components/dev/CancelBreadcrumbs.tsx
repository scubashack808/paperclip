import { useEffect, useRef, useState } from "react";

type Entry = {
  ts: number;
  runId: string;
  status: string;
  agentId?: string;
  errorCode?: string;
};

const MAX = 50;

export function CancelBreadcrumbs() {
  if (!import.meta.env.DEV) return null;
  return <CancelBreadcrumbsInner />;
}

function CancelBreadcrumbsInner() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const seqRef = useRef(0);

  useEffect(() => {
    const onEvent = (event: Event) => {
      const detail = (event as CustomEvent).detail as Record<string, unknown> | undefined;
      if (!detail) return;
      const runId = typeof detail.runId === "string" ? detail.runId : null;
      const status = typeof detail.status === "string" ? detail.status : null;
      if (!runId || !status) return;
      seqRef.current += 1;
      setEntries((prev) =>
        [
          {
            ts: typeof detail.observedAt === "number" ? (detail.observedAt as number) : Date.now(),
            runId,
            status,
            agentId: typeof detail.agentId === "string" ? (detail.agentId as string) : undefined,
            errorCode: typeof detail.errorCode === "string" ? (detail.errorCode as string) : undefined,
          },
          ...prev,
        ].slice(0, MAX),
      );
    };
    window.addEventListener("paperclip:dev:run-status", onEvent);
    return () => window.removeEventListener("paperclip:dev:run-status", onEvent);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        zIndex: 9999,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 11,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: "4px 8px",
          borderRadius: 6,
          background: "rgba(15,23,42,0.85)",
          color: "#f8fafc",
          border: "1px solid rgba(148,163,184,0.4)",
          cursor: "pointer",
        }}
      >
        run-status: {entries.length}
      </button>
      {open ? (
        <div
          style={{
            marginTop: 6,
            maxHeight: 280,
            width: 320,
            overflowY: "auto",
            background: "rgba(15,23,42,0.95)",
            color: "#e2e8f0",
            border: "1px solid rgba(148,163,184,0.4)",
            borderRadius: 6,
            padding: 8,
          }}
        >
          {entries.length === 0 ? (
            <div style={{ opacity: 0.6 }}>no events yet</div>
          ) : (
            entries.map((e, i) => (
              <div key={`${e.ts}-${i}`} style={{ marginBottom: 4 }}>
                <span style={{ opacity: 0.6 }}>{new Date(e.ts).toISOString().slice(11, 23)} </span>
                <span style={{ color: statusColor(e.status) }}>{e.status}</span>
                <span style={{ opacity: 0.7 }}> {e.runId.slice(0, 8)}</span>
                {e.errorCode ? <span style={{ opacity: 0.7 }}> ({e.errorCode})</span> : null}
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

function statusColor(status: string) {
  switch (status) {
    case "running":
      return "#34d399";
    case "queued":
      return "#fbbf24";
    case "cancelled":
    case "failed":
      return "#f87171";
    case "succeeded":
      return "#60a5fa";
    default:
      return "#e2e8f0";
  }
}
