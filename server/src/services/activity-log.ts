import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import type { Db } from "@paperclipai/db";
import { activityLog, companies, issues } from "@paperclipai/db";
import { PLUGIN_EVENT_TYPES, type PluginEventType } from "@paperclipai/shared";
import type { PluginEvent } from "@paperclipai/plugin-sdk";
import { publishLiveEvent } from "./live-events.js";
import { redactCurrentUserValue } from "../log-redaction.js";
import { sanitizeRecord } from "../redaction.js";
import { logger } from "../middleware/logger.js";
import type { PluginEventBus } from "./plugin-event-bus.js";
import { instanceSettingsService } from "./instance-settings.js";

const PLUGIN_EVENT_SET: ReadonlySet<string> = new Set(PLUGIN_EVENT_TYPES);

let _pluginEventBus: PluginEventBus | null = null;

/** Wire the plugin event bus so domain events are forwarded to plugins. */
export function setPluginEventBus(bus: PluginEventBus): void {
  if (_pluginEventBus) {
    logger.warn("setPluginEventBus called more than once, replacing existing bus");
  }
  _pluginEventBus = bus;
}

export interface LogActivityInput {
  companyId: string;
  actorType: "agent" | "user" | "system";
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  agentId?: string | null;
  runId?: string | null;
  details?: Record<string, unknown> | null;
}

async function resolveCrossCompanyOriginId(
  db: Db,
  entityType: string,
  entityId: string,
  companyId: string,
): Promise<string | null> {
  if (entityType !== "issue") return null;
  if (!entityId) return null;
  try {
    const [row] = await db
      .select({ originKind: issues.originKind, originId: issues.originId })
      .from(issues)
      .where(eq(issues.id, entityId))
      .limit(1);
    if (!row) return null;
    if (row.originKind !== "cross_company") return null;
    if (!row.originId) return null;
    if (row.originId === companyId) return null;
    return row.originId;
  } catch (err) {
    logger.warn({ err, entityId }, "failed to resolve cross-company origin for live event fan-out");
    return null;
  }
}

async function resolveCompanyNamesByIds(
  db: Db,
  companyIds: string[],
): Promise<Map<string, string>> {
  if (companyIds.length === 0) return new Map();
  try {
    const rows = await db
      .select({ id: companies.id, name: companies.name })
      .from(companies)
      .where(inArray(companies.id, companyIds));
    return new Map(rows.map((r) => [r.id, r.name]));
  } catch (err) {
    logger.warn({ err, companyIds }, "failed to resolve company names for live event fan-out");
    return new Map();
  }
}

export async function logActivity(db: Db, input: LogActivityInput) {
  const currentUserRedactionOptions = {
    enabled: (await instanceSettingsService(db).getGeneral()).censorUsernameInLogs,
  };
  const sanitizedDetails = input.details ? sanitizeRecord(input.details) : null;
  const redactedDetails = sanitizedDetails
    ? redactCurrentUserValue(sanitizedDetails, currentUserRedactionOptions)
    : null;
  await db.insert(activityLog).values({
    companyId: input.companyId,
    actorType: input.actorType,
    actorId: input.actorId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    agentId: input.agentId ?? null,
    runId: input.runId ?? null,
    details: redactedDetails,
  });

  const primaryPayload = {
    actorType: input.actorType,
    actorId: input.actorId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    agentId: input.agentId ?? null,
    runId: input.runId ?? null,
    details: redactedDetails,
  };

  publishLiveEvent({
    companyId: input.companyId,
    type: "activity.logged",
    payload: primaryPayload,
  });

  const crossCompanyOriginId = await resolveCrossCompanyOriginId(
    db,
    input.entityType,
    input.entityId,
    input.companyId,
  );
  if (crossCompanyOriginId) {
    const names = await resolveCompanyNamesByIds(db, [input.companyId, crossCompanyOriginId]);
    // Redacted mirror envelope. The full `details` payload stays on the target
    // company's bus only — this mirror is broadcast to every origin-company WS
    // subscriber (board users, non-granted agents). Anything sensitive
    // (comment bodySnippets, document titles, approval payloads, work-product
    // metadata) must NOT appear here. Origin-side consumers that need the full
    // detail must re-fetch the issue through the normal cross-company read
    // path — which is authorized per-agent via the allowlist grant check.
    publishLiveEvent({
      companyId: crossCompanyOriginId,
      type: "activity.logged",
      payload: {
        actorType: input.actorType,
        // Intentionally NOT including actorId/agentId/runId/details — those are
        // target-company identifiers and potentially sensitive payload.
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        foreign: true,
        targetCompanyId: input.companyId,
        targetCompanyName: names.get(input.companyId) ?? null,
        originCompanyId: crossCompanyOriginId,
        originCompanyName: names.get(crossCompanyOriginId) ?? null,
      },
    });
  }

  if (_pluginEventBus && PLUGIN_EVENT_SET.has(input.action)) {
    const event: PluginEvent = {
      eventId: randomUUID(),
      eventType: input.action as PluginEventType,
      occurredAt: new Date().toISOString(),
      actorId: input.actorId,
      actorType: input.actorType,
      entityId: input.entityId,
      entityType: input.entityType,
      companyId: input.companyId,
      payload: {
        ...redactedDetails,
        agentId: input.agentId ?? null,
        runId: input.runId ?? null,
      },
    };
    void _pluginEventBus.emit(event).then(({ errors }) => {
      for (const { pluginId, error } of errors) {
        logger.warn({ pluginId, eventType: event.eventType, err: error }, "plugin event handler failed");
      }
    }).catch(() => {});
  }
}
