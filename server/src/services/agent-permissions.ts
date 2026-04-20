export type NormalizedAgentPermissions = Record<string, unknown> & {
  canCreateAgents: boolean;
  allowedForeignCompanies: string[];
};

export function defaultPermissionsForRole(role: string): NormalizedAgentPermissions {
  return {
    canCreateAgents: role === "ceo",
    allowedForeignCompanies: [],
  };
}

function sanitizeAllowedForeignCompanies(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const trimmed = entry.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}

export function normalizeAgentPermissions(
  permissions: unknown,
  role: string,
): NormalizedAgentPermissions {
  const defaults = defaultPermissionsForRole(role);
  if (typeof permissions !== "object" || permissions === null || Array.isArray(permissions)) {
    return defaults;
  }

  const record = permissions as Record<string, unknown>;
  return {
    canCreateAgents:
      typeof record.canCreateAgents === "boolean"
        ? record.canCreateAgents
        : defaults.canCreateAgents,
    allowedForeignCompanies:
      record.allowedForeignCompanies !== undefined
        ? sanitizeAllowedForeignCompanies(record.allowedForeignCompanies)
        : defaults.allowedForeignCompanies,
  };
}
