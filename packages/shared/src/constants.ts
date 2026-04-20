export const COMPANY_STATUSES = ["active", "paused", "archived"] as const;
export type CompanyStatus = (typeof COMPANY_STATUSES)[number];

export const DEPLOYMENT_MODES = ["local_trusted", "authenticated"] as const;
export type DeploymentMode = (typeof DEPLOYMENT_MODES)[number];

export const DEPLOYMENT_EXPOSURES = ["private", "public"] as const;
export type DeploymentExposure = (typeof DEPLOYMENT_EXPOSURES)[number];

export const BIND_MODES = ["loopback", "lan", "tailnet", "custom"] as const;
export type BindMode = (typeof BIND_MODES)[number];

export const AUTH_BASE_URL_MODES = ["auto", "explicit"] as const;
export type AuthBaseUrlMode = (typeof AUTH_BASE_URL_MODES)[number];

export const AGENT_STATUSES = [
  "active",
  "paused",
  "idle",
  "running",
  "error",
  "pending_approval",
  "terminated",
] as const;
export type AgentStatus = (typeof AGENT_STATUSES)[number];

export const AGENT_ADAPTER_TYPES = [
  "process",
  "http",
  "claude_local",
  "codex_local",
  "gemini_local",
  "opencode_local",
  "pi_local",
  "cursor",
  "openclaw_gateway",
] as const;
export type AgentAdapterType = (typeof AGENT_ADAPTER_TYPES)[number] | (string & {});

export const AGENT_ROLES = [
  "ceo",
  "cto",
  "cmo",
  "cfo",
  "engineer",
  "designer",
  "pm",
  "qa",
  "devops",
  "researcher",
  "general",
] as const;
export type AgentRole = (typeof AGENT_ROLES)[number];

export const AGENT_ROLE_LABELS: Record<AgentRole, string> = {
  ceo: "CEO",
  cto: "CTO",
  cmo: "CMO",
  cfo: "CFO",
  engineer: "Engineer",
  designer: "Designer",
  pm: "PM",
  qa: "QA",
  devops: "DevOps",
  researcher: "Researcher",
  general: "General",
};

export const AGENT_ICON_NAMES = [
  "bot",
  "cpu",
  "brain",
  "zap",
  "rocket",
  "code",
  "terminal",
  "shield",
  "eye",
  "search",
  "wrench",
  "hammer",
  "lightbulb",
  "sparkles",
  "star",
  "heart",
  "flame",
  "bug",
  "cog",
  "database",
  "globe",
  "lock",
  "mail",
  "message-square",
  "file-code",
  "git-branch",
  "package",
  "puzzle",
  "target",
  "wand",
  "atom",
  "circuit-board",
  "radar",
  "swords",
  "telescope",
  "microscope",
  "crown",
  "gem",
  "hexagon",
  "pentagon",
  "fingerprint",
] as const;
export type AgentIconName = (typeof AGENT_ICON_NAMES)[number];

export const ISSUE_STATUSES = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "done",
  "blocked",
  "cancelled",
] as const;
export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const INBOX_MINE_ISSUE_STATUSES = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "blocked",
  "done",
] as const;
export const INBOX_MINE_ISSUE_STATUS_FILTER = INBOX_MINE_ISSUE_STATUSES.join(",");

export const ISSUE_PRIORITIES = ["critical", "high", "medium", "low"] as const;
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];

export const ISSUE_ORIGIN_KINDS = ["manual", "routine_execution"] as const;
export type IssueOriginKind = (typeof ISSUE_ORIGIN_KINDS)[number];

export const ISSUE_RELATION_TYPES = ["blocks"] as const;
export type IssueRelationType = (typeof ISSUE_RELATION_TYPES)[number];

export const ISSUE_EXECUTION_POLICY_MODES = ["normal", "auto"] as const;
export type IssueExecutionPolicyMode = (typeof ISSUE_EXECUTION_POLICY_MODES)[number];

export const ISSUE_EXECUTION_STAGE_TYPES = ["review", "approval"] as const;
export type IssueExecutionStageType = (typeof ISSUE_EXECUTION_STAGE_TYPES)[number];

export const ISSUE_EXECUTION_STATE_STATUSES = ["idle", "pending", "changes_requested", "completed"] as const;
export type IssueExecutionStateStatus = (typeof ISSUE_EXECUTION_STATE_STATUSES)[number];

export const ISSUE_EXECUTION_DECISION_OUTCOMES = ["approved", "changes_requested"] as const;
export type IssueExecutionDecisionOutcome = (typeof ISSUE_EXECUTION_DECISION_OUTCOMES)[number];

export const GOAL_LEVELS = ["company", "team", "agent", "task"] as const;
export type GoalLevel = (typeof GOAL_LEVELS)[number];

export const GOAL_STATUSES = ["planned", "active", "achieved", "cancelled"] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const PROJECT_STATUSES = [
  "backlog",
  "planned",
  "in_progress",
  "completed",
  "cancelled",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const ROUTINE_STATUSES = ["active", "paused", "archived"] as const;
export type RoutineStatus = (typeof ROUTINE_STATUSES)[number];

export const ROUTINE_CONCURRENCY_POLICIES = ["coalesce_if_active", "always_enqueue", "skip_if_active"] as const;
export type RoutineConcurrencyPolicy = (typeof ROUTINE_CONCURRENCY_POLICIES)[number];

export const ROUTINE_CATCH_UP_POLICIES = ["skip_missed", "enqueue_missed_with_cap"] as const;
export type RoutineCatchUpPolicy = (typeof ROUTINE_CATCH_UP_POLICIES)[number];

export const ROUTINE_TRIGGER_KINDS = ["schedule", "webhook", "api"] as const;
export type RoutineTriggerKind = (typeof ROUTINE_TRIGGER_KINDS)[number];

export const ROUTINE_TRIGGER_SIGNING_MODES = ["bearer", "hmac_sha256", "github_hmac", "none"] as const;
export type RoutineTriggerSigningMode = (typeof ROUTINE_TRIGGER_SIGNING_MODES)[number];

export const ROUTINE_VARIABLE_TYPES = ["text", "textarea", "number", "boolean", "select"] as const;
export type RoutineVariableType = (typeof ROUTINE_VARIABLE_TYPES)[number];

export const ROUTINE_RUN_STATUSES = [
  "received",
  "coalesced",
  "skipped",
  "issue_created",
  "completed",
  "failed",
 ] as const;
export type RoutineRunStatus = (typeof ROUTINE_RUN_STATUSES)[number];

export const ROUTINE_RUN_SOURCES = ["schedule", "manual", "api", "webhook"] as const;
export type RoutineRunSource = (typeof ROUTINE_RUN_SOURCES)[number];

export const PAUSE_REASONS = ["manual", "budget", "system"] as const;
export type PauseReason = (typeof PAUSE_REASONS)[number];

export const PROJECT_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#3b82f6", // blue
] as const;

export const APPROVAL_TYPES = [
  "hire_agent",
  "approve_ceo_strategy",
  "budget_override_required",
  "request_board_approval",
] as const;
export type ApprovalType = (typeof APPROVAL_TYPES)[number];

export const APPROVAL_STATUSES = [
  "pending",
  "revision_requested",
  "approved",
  "rejected",
  "cancelled",
] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export const SECRET_PROVIDERS = [
  "local_encrypted",
  "aws_secrets_manager",
  "gcp_secret_manager",
  "vault",
] as const;
export type SecretProvider = (typeof SECRET_PROVIDERS)[number];

export const STORAGE_PROVIDERS = ["local_disk", "s3"] as const;
export type StorageProvider = (typeof STORAGE_PROVIDERS)[number];

export const BILLING_TYPES = [
  "metered_api",
  "subscription_included",
  "subscription_overage",
  "credits",
  "fixed",
  "unknown",
] as const;
export type BillingType = (typeof BILLING_TYPES)[number];

export const FINANCE_EVENT_KINDS = [
  "inference_charge",
  "platform_fee",
  "credit_purchase",
  "credit_refund",
  "credit_expiry",
  "byok_fee",
  "gateway_overhead",
  "log_storage_charge",
  "logpush_charge",
  "provisioned_capacity_charge",
  "training_charge",
  "custom_model_import_charge",
  "custom_model_storage_charge",
  "manual_adjustment",
] as const;
export type FinanceEventKind = (typeof FINANCE_EVENT_KINDS)[number];

export const FINANCE_DIRECTIONS = ["debit", "credit"] as const;
export type FinanceDirection = (typeof FINANCE_DIRECTIONS)[number];

export const FINANCE_UNITS = [
  "input_token",
  "output_token",
  "cached_input_token",
  "request",
  "credit_usd",
  "credit_unit",
  "model_unit_minute",
  "model_unit_hour",
  "gb_month",
  "train_token",
  "unknown",
] as const;
export type FinanceUnit = (typeof FINANCE_UNITS)[number];

export const BUDGET_SCOPE_TYPES = ["company", "agent", "project"] as const;
export type BudgetScopeType = (typeof BUDGET_SCOPE_TYPES)[number];

export const BUDGET_METRICS = ["billed_cents"] as const;
export type BudgetMetric = (typeof BUDGET_METRICS)[number];

export const BUDGET_WINDOW_KINDS = ["calendar_month_utc", "lifetime"] as const;
export type BudgetWindowKind = (typeof BUDGET_WINDOW_KINDS)[number];

export const BUDGET_THRESHOLD_TYPES = ["soft", "hard"] as const;
export type BudgetThresholdType = (typeof BUDGET_THRESHOLD_TYPES)[number];

export const BUDGET_INCIDENT_STATUSES = ["open", "resolved", "dismissed"] as const;
export type BudgetIncidentStatus = (typeof BUDGET_INCIDENT_STATUSES)[number];

export const BUDGET_INCIDENT_RESOLUTION_ACTIONS = [
  "keep_paused",
  "raise_budget_and_resume",
] as const;
export type BudgetIncidentResolutionAction = (typeof BUDGET_INCIDENT_RESOLUTION_ACTIONS)[number];

export const HEARTBEAT_INVOCATION_SOURCES = [
  "timer",
  "assignment",
  "on_demand",
  "automation",
] as const;
export type HeartbeatInvocationSource = (typeof HEARTBEAT_INVOCATION_SOURCES)[number];

export const WAKEUP_TRIGGER_DETAILS = ["manual", "ping", "callback", "system"] as const;
export type WakeupTriggerDetail = (typeof WAKEUP_TRIGGER_DETAILS)[number];

export const WAKEUP_REQUEST_STATUSES = [
  "queued",
  "deferred_issue_execution",
  "claimed",
  "coalesced",
  "skipped",
  "completed",
  "failed",
  "cancelled",
] as const;
export type WakeupRequestStatus = (typeof WAKEUP_REQUEST_STATUSES)[number];

export const HEARTBEAT_RUN_STATUSES = [
  "queued",
  "running",
  "succeeded",
  "failed",
  "cancelled",
  "timed_out",
] as const;
export type HeartbeatRunStatus = (typeof HEARTBEAT_RUN_STATUSES)[number];

export const LIVE_EVENT_TYPES = [
  "heartbeat.run.queued",
  "heartbeat.run.status",
  "heartbeat.run.event",
  "heartbeat.run.log",
  "agent.status",
  "activity.logged",
  "plugin.ui.updated",
  "plugin.worker.crashed",
  "plugin.worker.restarted",
] as const;
export type LiveEventType = (typeof LIVE_EVENT_TYPES)[number];

export const PRINCIPAL_TYPES = ["user", "agent"] as const;
export type PrincipalType = (typeof PRINCIPAL_TYPES)[number];

export const MEMBERSHIP_STATUSES = ["pending", "active", "suspended"] as const;
export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];

export const COMPANY_MEMBERSHIP_ROLES = [
  "owner",
  "admin",
  "operator",
  "viewer",
  "member",
] as const;
export type CompanyMembershipRole = (typeof COMPANY_MEMBERSHIP_ROLES)[number];

export const HUMAN_COMPANY_MEMBERSHIP_ROLES = [
  "owner",
  "admin",
  "operator",
  "viewer",
] as const;
export type HumanCompanyMembershipRole = (typeof HUMAN_COMPANY_MEMBERSHIP_ROLES)[number];

export const HUMAN_COMPANY_MEMBERSHIP_ROLE_LABELS: Record<HumanCompanyMembershipRole, string> = {
  owner: "Owner",
  admin: "Admin",
  operator: "Operator",
  viewer: "Viewer",
};

export const INSTANCE_USER_ROLES = ["instance_admin"] as const;
export type InstanceUserRole = (typeof INSTANCE_USER_ROLES)[number];

export const INVITE_TYPES = ["company_join", "bootstrap_ceo"] as const;
export type InviteType = (typeof INVITE_TYPES)[number];

export const INVITE_JOIN_TYPES = ["human", "agent", "both"] as const;
export type InviteJoinType = (typeof INVITE_JOIN_TYPES)[number];

export const JOIN_REQUEST_TYPES = ["human", "agent"] as const;
export type JoinRequestType = (typeof JOIN_REQUEST_TYPES)[number];

export const JOIN_REQUEST_STATUSES = ["pending_approval", "approved", "rejected"] as const;
export type JoinRequestStatus = (typeof JOIN_REQUEST_STATUSES)[number];

export const PERMISSION_KEYS = [
  "agents:create",
  "users:invite",
  "users:manage_permissions",
  "tasks:assign",
  "tasks:assign_scope",
  "joins:approve",
] as const;
export type PermissionKey = (typeof PERMISSION_KEYS)[number];

// ---------------------------------------------------------------------------
// Plugin System — see doc/plugins/PLUGIN_SPEC.md for the full specification
// ---------------------------------------------------------------------------

/**
 * The current version of the Plugin API contract.
 *
 * Increment this value whenever a breaking change is made to the plugin API
 * so that the host can reject incompatible plugin manifests.
 *
 * @see PLUGIN_SPEC.md §4 — Versioning
 */
export const PLUGIN_API_VERSION = 1 as const;

/**
 * Lifecycle statuses for an installed plugin.
 *
 * State machine: installed → ready | error, ready → disabled | error | upgrade_pending | uninstalled,
 * disabled → ready | uninstalled, error → ready | uninstalled,
 * upgrade_pending → ready | error | uninstalled, uninstalled → installed (reinstall).
 *
 * @see {@link PluginStatus} — inferred union type
 * @see PLUGIN_SPEC.md §21.3 `plugins.status`
 */
export const PLUGIN_STATUSES = [
  "installed",
  "ready",
  "disabled",
  "error",
  "upgrade_pending",
  "uninstalled",
] as const;
export type PluginStatus = (typeof PLUGIN_STATUSES)[number];

/**
 * Plugin classification categories. A plugin declares one or more categories
 * in its manifest to describe its primary purpose.
 *
 * @see PLUGIN_SPEC.md §6.2
 */
export const PLUGIN_CATEGORIES = [
  "connector",
  "workspace",
  "automation",
  "ui",
] as const;
export type PluginCategory = (typeof PLUGIN_CATEGORIES)[number];

/**
 * Named permissions the host grants to a plugin. Plugins declare required
 * capabilities in their manifest; the host enforces them at runtime via the
 * plugin capability validator.
 *
 * Grouped into: Data Read, Data Write, Plugin State, Runtime/Integration,
 * Agent Tools, and UI.
 *
 * @see PLUGIN_SPEC.md §15 — Capability Model
 */
export const PLUGIN_CAPABILITIES = [
  // Data Read
  "companies.read",
  "projects.read",
  "project.workspaces.read",
  "issues.read",
  "issue.comments.read",
  "issue.documents.read",
  "agents.read",
  "goals.read",
  "goals.create",
  "goals.update",
  "activity.read",
  "costs.read",
  // Data Write
  "issues.create",
  "issues.update",
  "issue.comments.create",
  "issue.documents.write",
  "agents.pause",
  "agents.resume",
  "agents.invoke",
  "agent.sessions.create",
  "agent.sessions.list",
  "agent.sessions.send",
  "agent.sessions.close",
  "activity.log.write",
  "metrics.write",
  "telemetry.track",
  // Plugin State
  "plugin.state.read",
  "plugin.state.write",
  // Runtime / Integration
  "events.subscribe",
  "events.emit",
  "jobs.schedule",
  "webhooks.receive",
  "http.outbound",
  "secrets.read-ref",
  // Agent Tools
  "agent.tools.register",
  // UI
  "instance.settings.register",
  "ui.sidebar.register",
  "ui.page.register",
  "ui.detailTab.register",
  "ui.dashboardWidget.register",
  "ui.commentAnnotation.register",
  "ui.action.register",
] as const;
export type PluginCapability = (typeof PLUGIN_CAPABILITIES)[number];

/**
 * UI extension slot types. Each slot type corresponds to a mount point in the
 * Paperclip UI where plugin components can be rendered.
 *
 * @see PLUGIN_SPEC.md §19 — UI Extension Model
 */
export const PLUGIN_UI_SLOT_TYPES = [
  "page",
  "detailTab",
  "taskDetailView",
  "dashboardWidget",
  "sidebar",
  "sidebarPanel",
  "projectSidebarItem",
  "globalToolbarButton",
  "toolbarButton",
  "contextMenuItem",
  "commentAnnotation",
  "commentContextMenuItem",
  "settingsPage",
] as const;
export type PluginUiSlotType = (typeof PLUGIN_UI_SLOT_TYPES)[number];

/**
 * Reserved company-scoped route segments that plugin page routes may not claim.
 *
 * These map to first-class host pages under `/:companyPrefix/...`.
 */
export const PLUGIN_RESERVED_COMPANY_ROUTE_SEGMENTS = [
  "dashboard",
  "onboarding",
  "companies",
  "company",
  "settings",
  "plugins",
  "org",
  "agents",
  "projects",
  "issues",
  "goals",
  "approvals",
  "costs",
  "activity",
  "inbox",
  "design-guide",
  "tests",
] as const;
export type PluginReservedCompanyRouteSegment =
  (typeof PLUGIN_RESERVED_COMPANY_ROUTE_SEGMENTS)[number];

/**
 * Launcher placement zones describe where a plugin-owned launcher can appear
 * in the host UI. These are intentionally aligned with current slot surfaces
 * so manifest authors can describe launch intent without coupling to a single
 * component implementation detail.
 */
export const PLUGIN_LAUNCHER_PLACEMENT_ZONES = [
  "page",
  "detailTab",
  "taskDetailView",
  "dashboardWidget",
  "sidebar",
  "sidebarPanel",
  "projectSidebarItem",
  "globalToolbarButton",
  "toolbarButton",
  "contextMenuItem",
  "commentAnnotation",
  "commentContextMenuItem",
  "settingsPage",
] as const;
export type PluginLauncherPlacementZone = (typeof PLUGIN_LAUNCHER_PLACEMENT_ZONES)[number];

/**
 * Launcher action kinds describe what the launcher does when activated.
 */
export const PLUGIN_LAUNCHER_ACTIONS = [
  "navigate",
  "openModal",
  "openDrawer",
  "openPopover",
  "performAction",
  "deepLink",
] as const;
export type PluginLauncherAction = (typeof PLUGIN_LAUNCHER_ACTIONS)[number];

/**
 * Optional size hints the host can use when rendering plugin-owned launcher
 * destinations such as overlays, drawers, or full page handoffs.
 */
export const PLUGIN_LAUNCHER_BOUNDS = [
  "inline",
  "compact",
  "default",
  "wide",
  "full",
] as const;
export type PluginLauncherBounds = (typeof PLUGIN_LAUNCHER_BOUNDS)[number];

/**
 * Render environments describe the container a launcher expects after it is
 * activated. The current host may map these to concrete UI primitives.
 */
export const PLUGIN_LAUNCHER_RENDER_ENVIRONMENTS = [
  "hostInline",
  "hostOverlay",
  "hostRoute",
  "external",
  "iframe",
] as const;
export type PluginLauncherRenderEnvironment =
  (typeof PLUGIN_LAUNCHER_RENDER_ENVIRONMENTS)[number];

/**
 * Entity types that a `detailTab` UI slot can attach to.
 *
 * @see PLUGIN_SPEC.md §19.3 — Detail Tabs
 */
export const PLUGIN_UI_SLOT_ENTITY_TYPES = [
  "project",
  "issue",
  "agent",
  "goal",
  "run",
  "comment",
] as const;
export type PluginUiSlotEntityType = (typeof PLUGIN_UI_SLOT_ENTITY_TYPES)[number];

/**
 * Scope kinds for plugin state storage. Determines the granularity at which
 * a plugin stores key-value state data.
 *
 * @see PLUGIN_SPEC.md §21.3 `plugin_state.scope_kind`
 */
export const PLUGIN_STATE_SCOPE_KINDS = [
  "instance",
  "company",
  "project",
  "project_workspace",
  "agent",
  "issue",
  "goal",
  "run",
] as const;
export type PluginStateScopeKind = (typeof PLUGIN_STATE_SCOPE_KINDS)[number];

/** Statuses for a plugin's scheduled job definition. */
export const PLUGIN_JOB_STATUSES = [
  "active",
  "paused",
  "failed",
] as const;
export type PluginJobStatus = (typeof PLUGIN_JOB_STATUSES)[number];

/** Statuses for individual job run executions. */
export const PLUGIN_JOB_RUN_STATUSES = [
  "pending",
  "queued",
  "running",
  "succeeded",
  "failed",
  "cancelled",
] as const;
export type PluginJobRunStatus = (typeof PLUGIN_JOB_RUN_STATUSES)[number];

/** What triggered a particular job run. */
export const PLUGIN_JOB_RUN_TRIGGERS = [
  "schedule",
  "manual",
  "retry",
] as const;
export type PluginJobRunTrigger = (typeof PLUGIN_JOB_RUN_TRIGGERS)[number];

/** Statuses for inbound webhook deliveries. */
export const PLUGIN_WEBHOOK_DELIVERY_STATUSES = [
  "pending",
  "success",
  "failed",
] as const;
export type PluginWebhookDeliveryStatus = (typeof PLUGIN_WEBHOOK_DELIVERY_STATUSES)[number];

/**
 * Core domain event types that plugins can subscribe to via the
 * `events.subscribe` capability.
 *
 * @see PLUGIN_SPEC.md §16 — Event System
 */
export const PLUGIN_EVENT_TYPES = [
  "company.created",
  "company.updated",
  "project.created",
  "project.updated",
  "project.workspace_created",
  "project.workspace_updated",
  "project.workspace_deleted",
  "issue.created",
  "issue.updated",
  "issue.comment.created",
  "agent.created",
  "agent.updated",
  "agent.status_changed",
  "agent.run.started",
  "agent.run.finished",
  "agent.run.failed",
  "agent.run.cancelled",
  "goal.created",
  "goal.updated",
  "approval.created",
  "approval.decided",
  "cost_event.created",
  "activity.logged",
] as const;
export type PluginEventType = (typeof PLUGIN_EVENT_TYPES)[number];

/**
 * Error codes returned by the plugin bridge when a UI → worker call fails.
 *
 * @see PLUGIN_SPEC.md §19.7 — Error Propagation Through The Bridge
 */
export const PLUGIN_BRIDGE_ERROR_CODES = [
  "WORKER_UNAVAILABLE",
  "CAPABILITY_DENIED",
  "WORKER_ERROR",
  "TIMEOUT",
  "UNKNOWN",
] as const;
export type PluginBridgeErrorCode = (typeof PLUGIN_BRIDGE_ERROR_CODES)[number];

/**
 * Estimated API pricing per model for shadow-cost calculations (PAP-19).
 * Base rates are USD per 1 million tokens; cache-read and cache-write rates
 * are derived from the input rate using Anthropic's published multipliers
 * when not set explicitly, so the table stays small and the multipliers
 * (0.1x read, 1.25x 5m write, 2.0x 1h write) are the single source of truth.
 *
 * Prices and modifier multipliers are sourced from Anthropic's pricing docs.
 * When updating this table, bump sourceFetchedAt and keep the note next to
 * the pricing constants below.
 */
export interface ModelPricing {
  /** Canonical model id used as the lookup key. */
  modelId: string;
  /** Alternate ids that should resolve to this entry (normalized before match). */
  aliases?: string[];
  /** USD per 1M input tokens. */
  inputPer1M: number;
  /** USD per 1M cache-read tokens. Defaults to inputPer1M * 0.1. */
  cacheReadPer1M?: number;
  /** USD per 1M 5-minute cache-write tokens. Defaults to inputPer1M * 1.25. */
  cacheWrite5mPer1M?: number;
  /** USD per 1M 1-hour cache-write tokens. Defaults to inputPer1M * 2.0. */
  cacheWrite1hPer1M?: number;
  /** USD per 1M output tokens. */
  outputPer1M: number;
  /** URL this row was sourced from. */
  source: string;
  /** ISO date the source was last fetched. */
  sourceFetchedAt: string;
}

export const PRICING_SOURCE_URL =
  "https://platform.claude.com/docs/en/docs/about-claude/pricing";
export const PRICING_SOURCE_FETCHED_AT = "2026-04-18";

/** Cache-read is 0.1x input (90% discount for prompt reuse). */
export const CACHE_READ_MULTIPLIER = 0.1;
/** 5-minute cache-write is 1.25x input. */
export const CACHE_WRITE_5M_MULTIPLIER = 1.25;
/** 1-hour cache-write is 2.0x input. */
export const CACHE_WRITE_1H_MULTIPLIER = 2.0;

/**
 * Request-level pricing modifiers that stack on top of the base rate.
 * These come from Anthropic docs; OpenAI/Gemini entries ignore them.
 *
 *   Fast mode (Opus 4.6 beta):     6.0x all token categories
 *   Data residency (us-only):      1.1x all token categories (Opus 4.6/4.7+)
 *   Batch API:                     0.5x input + output (cache unchanged)
 */
export const FAST_MODE_MULTIPLIER = 6.0;
export const US_DATA_RESIDENCY_MULTIPLIER = 1.1;
export const BATCH_API_MULTIPLIER = 0.5;

/** Request-level flags captured per cost event (nullable until adapters surface them). */
export interface PricingModifiers {
  fastMode?: boolean;
  dataResidency?: "global" | "us-only";
  batch?: boolean;
}

/**
 * MODEL_API_PRICING
 *
 * Source: https://platform.claude.com/docs/en/docs/about-claude/pricing
 * Fetched: 2026-04-18
 *
 * Anthropic docs (2026-04-18) confirm:
 *   "Opus 4.7, Opus 4.6, and Sonnet 4.6 include the full 1M token context
 *   window at standard pricing." No 1M-tier multiplier for current models.
 *
 * Older Opus 4 / 4.1 priced at $15 in / $75 out (long-context pricing). Kept
 * for historical cost_events that still reference those model ids.
 */
const ANTHROPIC_SRC = PRICING_SOURCE_URL;
const OPENAI_SRC = "https://openai.com/api/pricing/";
const GEMINI_SRC = "https://ai.google.dev/gemini-api/docs/pricing";

export const MODEL_API_PRICING: Record<string, ModelPricing> = {
  // --- Anthropic (current) ---
  "claude-opus-4-7": {
    modelId: "claude-opus-4-7",
    aliases: ["claude-opus-4-7[1m]"],
    inputPer1M: 5,
    outputPer1M: 25,
    source: ANTHROPIC_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "claude-opus-4-6": {
    modelId: "claude-opus-4-6",
    aliases: ["claude-opus-4-6[1m]"],
    inputPer1M: 5,
    outputPer1M: 25,
    source: ANTHROPIC_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "claude-sonnet-4-6": {
    modelId: "claude-sonnet-4-6",
    aliases: ["claude-sonnet-4-6[1m]"],
    inputPer1M: 3,
    outputPer1M: 15,
    source: ANTHROPIC_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "claude-sonnet-4-5": {
    modelId: "claude-sonnet-4-5",
    inputPer1M: 3,
    outputPer1M: 15,
    source: ANTHROPIC_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "claude-opus-4-5": {
    modelId: "claude-opus-4-5",
    inputPer1M: 5,
    outputPer1M: 25,
    source: ANTHROPIC_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "claude-haiku-4-5": {
    modelId: "claude-haiku-4-5",
    aliases: ["claude-haiku-4-5-20251001"],
    inputPer1M: 1,
    outputPer1M: 5,
    source: ANTHROPIC_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  // --- Anthropic (historical, retained for legacy cost_events) ---
  "claude-opus-4-1": {
    modelId: "claude-opus-4-1",
    inputPer1M: 15,
    outputPer1M: 75,
    source: ANTHROPIC_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "claude-opus-4": {
    modelId: "claude-opus-4",
    inputPer1M: 15,
    outputPer1M: 75,
    source: ANTHROPIC_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "claude-3-5-sonnet-20241022": {
    modelId: "claude-3-5-sonnet-20241022",
    inputPer1M: 3,
    outputPer1M: 15,
    source: ANTHROPIC_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "claude-3-5-haiku-20241022": {
    modelId: "claude-3-5-haiku-20241022",
    inputPer1M: 0.8,
    outputPer1M: 4,
    source: ANTHROPIC_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "claude-3-opus-20240229": {
    modelId: "claude-3-opus-20240229",
    inputPer1M: 15,
    outputPer1M: 75,
    source: ANTHROPIC_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "claude-3-haiku-20240307": {
    modelId: "claude-3-haiku-20240307",
    inputPer1M: 0.25,
    outputPer1M: 1.25,
    source: ANTHROPIC_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  // --- OpenAI ---
  "gpt-4o": {
    modelId: "gpt-4o",
    inputPer1M: 2.5,
    cacheReadPer1M: 1.25,
    outputPer1M: 10,
    source: OPENAI_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "gpt-4o-mini": {
    modelId: "gpt-4o-mini",
    inputPer1M: 0.15,
    cacheReadPer1M: 0.075,
    outputPer1M: 0.6,
    source: OPENAI_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "gpt-4.1": {
    modelId: "gpt-4.1",
    inputPer1M: 2,
    cacheReadPer1M: 0.5,
    outputPer1M: 8,
    source: OPENAI_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "gpt-4.1-mini": {
    modelId: "gpt-4.1-mini",
    inputPer1M: 0.4,
    cacheReadPer1M: 0.1,
    outputPer1M: 1.6,
    source: OPENAI_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "gpt-4.1-nano": {
    modelId: "gpt-4.1-nano",
    inputPer1M: 0.1,
    cacheReadPer1M: 0.025,
    outputPer1M: 0.4,
    source: OPENAI_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "o3": {
    modelId: "o3",
    inputPer1M: 2,
    cacheReadPer1M: 0.5,
    outputPer1M: 8,
    source: OPENAI_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "o3-mini": {
    modelId: "o3-mini",
    inputPer1M: 1.1,
    cacheReadPer1M: 0.55,
    outputPer1M: 4.4,
    source: OPENAI_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "o4-mini": {
    modelId: "o4-mini",
    inputPer1M: 1.1,
    cacheReadPer1M: 0.275,
    outputPer1M: 4.4,
    source: OPENAI_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  // --- Google Gemini ---
  "gemini-2.5-pro": {
    modelId: "gemini-2.5-pro",
    inputPer1M: 1.25,
    cacheReadPer1M: 0.3125,
    outputPer1M: 10,
    source: GEMINI_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "gemini-2.5-flash": {
    modelId: "gemini-2.5-flash",
    inputPer1M: 0.15,
    cacheReadPer1M: 0.0375,
    outputPer1M: 0.6,
    source: GEMINI_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
  "gemini-2.0-flash": {
    modelId: "gemini-2.0-flash",
    inputPer1M: 0.1,
    cacheReadPer1M: 0.025,
    outputPer1M: 0.4,
    source: GEMINI_SRC,
    sourceFetchedAt: PRICING_SOURCE_FETCHED_AT,
  },
};

/** Alias → canonical modelId, built once at module load. */
const MODEL_ALIAS_INDEX: Record<string, string> = (() => {
  const idx: Record<string, string> = {};
  for (const [canonical, entry] of Object.entries(MODEL_API_PRICING)) {
    idx[canonical] = canonical;
    for (const alias of entry.aliases ?? []) {
      idx[alias] = canonical;
    }
  }
  return idx;
})();

/**
 * Resolve a raw model string to a canonical pricing entry, or null if unknown.
 * Matches exact id, alias, and then the id with a `[...]` suffix stripped
 * (so `claude-opus-4-6[1m]` still resolves when `[1m]` isn't an alias yet).
 */
export function resolveModelPricing(model: string): ModelPricing | null {
  if (!model) return null;
  const direct = MODEL_ALIAS_INDEX[model];
  if (direct) return MODEL_API_PRICING[direct] ?? null;
  const stripped = model.replace(/\[[^\]]*\]$/, "");
  if (stripped !== model) {
    const viaStripped = MODEL_ALIAS_INDEX[stripped];
    if (viaStripped) return MODEL_API_PRICING[viaStripped] ?? null;
  }
  return null;
}

function effectiveCacheReadRate(p: ModelPricing): number {
  return p.cacheReadPer1M ?? p.inputPer1M * CACHE_READ_MULTIPLIER;
}

function isOpus46Family(p: ModelPricing): boolean {
  return p.modelId === "claude-opus-4-6";
}

function isOpus46Or47Family(p: ModelPricing): boolean {
  return p.modelId === "claude-opus-4-6" || p.modelId === "claude-opus-4-7";
}

/**
 * Estimate API cost in cents for the given model and token counts.
 *
 * Returns `null` when the model is not in the pricing table. Callers MUST
 * surface null as "pricing unknown" (badge, `—`) rather than silently defaulting
 * to mid-tier rates — silent fallback caused the undercount fixed in PAP-19.
 *
 * Modifier precedence (multiplicative, in order):
 *   base → batch (input+output only) → data residency → fast mode
 */
export function estimateApiCostCents(
  model: string,
  inputTokens: number,
  cachedInputTokens: number,
  outputTokens: number,
  modifiers: PricingModifiers = {},
): number | null {
  const pricing = resolveModelPricing(model);
  if (!pricing) return null;

  const inputRate = pricing.inputPer1M;
  const outputRate = pricing.outputPer1M;
  const cacheReadRate = effectiveCacheReadRate(pricing);

  // Apply Batch API (0.5x input + output; cache unchanged per Anthropic docs).
  const batch = modifiers.batch === true;
  const batchMult = batch ? BATCH_API_MULTIPLIER : 1;

  // Data residency applies to Opus 4.6/4.7+ only per Anthropic docs.
  const residencyEligible = isOpus46Or47Family(pricing);
  const residencyMult =
    residencyEligible && modifiers.dataResidency === "us-only"
      ? US_DATA_RESIDENCY_MULTIPLIER
      : 1;

  // Fast mode is Opus 4.6 only today; stacks across all token categories.
  const fastEligible = isOpus46Family(pricing);
  const fastMult = fastEligible && modifiers.fastMode === true ? FAST_MODE_MULTIPLIER : 1;

  const inputUsd = (inputTokens * inputRate * batchMult * residencyMult * fastMult) / 1_000_000;
  const outputUsd =
    (outputTokens * outputRate * batchMult * residencyMult * fastMult) / 1_000_000;
  const cacheReadUsd =
    (cachedInputTokens * cacheReadRate * residencyMult * fastMult) / 1_000_000;

  return Math.round((inputUsd + outputUsd + cacheReadUsd) * 100);
}
