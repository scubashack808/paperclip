import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { companies, createDb } from "@paperclipai/db";
import {
  getEmbeddedPostgresTestSupport,
  startEmbeddedPostgresTestDatabase,
} from "./helpers/embedded-postgres.js";
import { companyService } from "../services/companies.ts";

const embeddedPostgresSupport = await getEmbeddedPostgresTestSupport();
const describeEmbeddedPostgres = embeddedPostgresSupport.supported ? describe : describe.skip;

if (!embeddedPostgresSupport.supported) {
  console.warn(
    `Skipping company issue-prefix tests on this host: ${embeddedPostgresSupport.reason ?? "unsupported environment"}`,
  );
}

describeEmbeddedPostgres("companyService.create — unique issue prefix", () => {
  let db!: ReturnType<typeof createDb>;
  let svc!: ReturnType<typeof companyService>;
  let tempDb: Awaited<ReturnType<typeof startEmbeddedPostgresTestDatabase>> | null = null;

  beforeAll(async () => {
    tempDb = await startEmbeddedPostgresTestDatabase("paperclip-company-prefix-");
    db = createDb(tempDb.connectionString);
    svc = companyService(db);
  }, 20_000);

  afterEach(async () => {
    await db.delete(companies);
  });

  afterAll(async () => {
    await tempDb?.cleanup();
  });

  it("uses a numeric suffix (not piled-up 'A's) when multiple companies share a base prefix", async () => {
    const first = await svc.create({ name: "Glacier" });
    const second = await svc.create({ name: "Glades" });
    const third = await svc.create({ name: "Glamour" });

    expect(first.issuePrefix).toBe("GLA");
    expect(second.issuePrefix).toBe("GLA2");
    expect(third.issuePrefix).toBe("GLA3");
  });

  it("keeps prefixes short as collisions grow instead of appending one A per attempt", async () => {
    const prefixes: string[] = [];
    for (let i = 0; i < 5; i += 1) {
      const company = await svc.create({ name: `Testing ${i}` });
      prefixes.push(company.issuePrefix);
    }

    expect(prefixes).toEqual(["TES", "TES2", "TES3", "TES4", "TES5"]);
    for (const prefix of prefixes) {
      expect(prefix.length).toBeLessThanOrEqual(4);
    }
  });

  it("falls back to the default prefix base when the name has no letters", async () => {
    const first = await svc.create({ name: "12345" });
    const second = await svc.create({ name: "!!!" });

    expect(first.issuePrefix).toBe("CMP");
    expect(second.issuePrefix).toBe("CMP2");
  });
});
