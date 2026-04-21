# Adapter termination behaviour

When the control plane cancels a heartbeat run, it goes through:

1. `cancelRunInternal` (server/src/services/heartbeat.ts) flips the run
   to `cancelling`.
2. `terminateLocalService` sends `SIGTERM` to the process (or process
   group on POSIX), polls 100ms intervals up to `graceSec * 1000` ms,
   then escalates to `SIGKILL` if still alive.
3. Run is set to `cancelled` (or `failed_cancel` if termination errored).

`graceSec` is the per-adapter budget for clean shutdown after `SIGTERM`
before we `SIGKILL`. It is configurable per-agent (`adapterConfig.graceSec`);
the values below are defaults used when not overridden.

| Adapter        | Default graceSec | Why                                                                                                       |
| -------------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| `claude_local` | 15               | Claude Code flushes streaming JSONL on SIGTERM; needs a few seconds to commit partial state and exit.     |
| `codex_local`  | 10               | Codex CLI exits cleanly on SIGTERM; no large flush window needed.                                         |
| `gemini_local` | 20               | Conservative — gemini CLI behaviour has more variance across versions.                                    |
| `cursor_local` | 20               | Conservative — cursor agent runs untrusted user prompts, may have long-running tools mid-flight.          |
| `opencode_local` | 20             | Conservative — multi-tool runtime, some tools have long teardown.                                         |
| `pi_local`     | 5                | Pi local adapter is an HTTP relay with no buffered work to flush; can die fast.                           |

## What "clean shutdown" means per adapter

- **claude_local**: spawns `claude --print -` with stdin closed after the
  prompt. On SIGTERM, the CLI emits a final JSONL chunk and exits. We
  cannot inject a "wrap up" mid-run today because stdin is one-shot
  (`--print` mode); a streaming-JSONL mode would unlock that — see GLA-7
  P6 (mid-run steering).
- **codex_local**: similar one-shot. Exits cleanly on SIGTERM.
- **pi_local**: pure HTTP forwarder, no children to tear down.
- **openclaw_gateway**: WebSocket gateway. SIGTERM closes the WS,
  remote OpenClaw will see the disconnect and stop sending wakeup
  events. No graceSec defined here — owner is the OpenClaw process.

## Adding/changing a default

The default lives next to the `asNumber(config.graceSec, N)` call in
each adapter's `execute.ts`. Update the table above when changing it.

## Operator overrides

Set `graceSec` in `adapterConfig` per-agent (UI: Agent → Configuration
→ Adapter Config). The configured value takes precedence over these
defaults.

## See also

- `cancelRunInternal` — the cancel control flow.
- `terminateLocalService` — the actual signal escalation.
- GLA-7 — original investigation for the cancel flow rebuild.
