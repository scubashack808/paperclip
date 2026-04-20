import { describe, expect, it } from "vitest";
import {
  defaultPermissionsForRole,
  normalizeAgentPermissions,
} from "../services/agent-permissions.js";

describe("defaultPermissionsForRole", () => {
  it("grants canCreateAgents to the CEO role and nobody else", () => {
    expect(defaultPermissionsForRole("ceo").canCreateAgents).toBe(true);
    expect(defaultPermissionsForRole("engineer").canCreateAgents).toBe(false);
  });

  it("defaults allowedForeignCompanies to an empty array for every role", () => {
    expect(defaultPermissionsForRole("ceo").allowedForeignCompanies).toEqual([]);
    expect(defaultPermissionsForRole("engineer").allowedForeignCompanies).toEqual([]);
  });
});

describe("normalizeAgentPermissions", () => {
  it("falls back to role defaults for non-object input", () => {
    expect(normalizeAgentPermissions(null, "ceo")).toEqual({
      canCreateAgents: true,
      allowedForeignCompanies: [],
    });
    expect(normalizeAgentPermissions("invalid", "engineer")).toEqual({
      canCreateAgents: false,
      allowedForeignCompanies: [],
    });
    expect(normalizeAgentPermissions(["nope"], "engineer")).toEqual({
      canCreateAgents: false,
      allowedForeignCompanies: [],
    });
  });

  it("preserves canCreateAgents when set, otherwise falls back to role default", () => {
    expect(
      normalizeAgentPermissions({ canCreateAgents: true }, "engineer").canCreateAgents,
    ).toBe(true);
    expect(
      normalizeAgentPermissions({ canCreateAgents: false }, "ceo").canCreateAgents,
    ).toBe(false);
    expect(
      normalizeAgentPermissions({}, "ceo").canCreateAgents,
    ).toBe(true);
  });

  it("preserves allowedForeignCompanies when set to an array of strings", () => {
    const permissions = {
      allowedForeignCompanies: [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ],
    };
    expect(
      normalizeAgentPermissions(permissions, "engineer").allowedForeignCompanies,
    ).toEqual([
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    ]);
  });

  it("drops non-string, empty, and duplicate entries from allowedForeignCompanies", () => {
    const permissions = {
      allowedForeignCompanies: [
        "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        " aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa ",
        "",
        "   ",
        42,
        null,
        undefined,
        { not: "a-string" },
        "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      ],
    };
    expect(
      normalizeAgentPermissions(permissions, "engineer").allowedForeignCompanies,
    ).toEqual([
      "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    ]);
  });

  it("returns an empty allowedForeignCompanies when the field is not an array", () => {
    expect(
      normalizeAgentPermissions({ allowedForeignCompanies: "not-an-array" }, "engineer")
        .allowedForeignCompanies,
    ).toEqual([]);
    expect(
      normalizeAgentPermissions({ allowedForeignCompanies: 42 }, "engineer")
        .allowedForeignCompanies,
    ).toEqual([]);
    expect(
      normalizeAgentPermissions({ allowedForeignCompanies: { 0: "uuid" } }, "engineer")
        .allowedForeignCompanies,
    ).toEqual([]);
  });

  it("falls back to role default allowedForeignCompanies when the field is missing", () => {
    expect(
      normalizeAgentPermissions({ canCreateAgents: true }, "engineer")
        .allowedForeignCompanies,
    ).toEqual([]);
  });
});
