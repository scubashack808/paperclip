export interface DashboardSummary {
  companyId: string;
  agents: {
    active: number;
    running: number;
    paused: number;
    error: number;
  };
  tasks: {
    open: number;
    inProgress: number;
    blocked: number;
    done: number;
  };
  costs: {
    monthSpendCents: number;
    estimatedCostCents: number;
    monthBudgetCents: number;
    monthUtilizationPercent: number;
    inputTokens: number;
    cachedInputTokens: number;
    outputTokens: number;
    /** Models seen this month with no pricing entry; tokens counted, cost not estimated. */
    unknownModelIds: string[];
    /** ISO date of the pricing source fetch. */
    pricingSourceFetchedAt: string;
    /** Pricing source URL. */
    pricingSourceUrl: string;
  };
  pendingApprovals: number;
  budgets: {
    activeIncidents: number;
    pendingApprovals: number;
    pausedAgents: number;
    pausedProjects: number;
  };
}
