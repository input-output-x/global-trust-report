import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canRunReport,
  createDemoAccount,
  createGuestAccount,
  isSupabaseConfigured,
  recordReport,
  freePlanLabel
} from "../authService.js";

describe("auth service", () => {
  it("detects whether Supabase auth is configured", () => {
    assert.equal(isSupabaseConfigured({ supabaseUrl: "", supabaseAnonKey: "" }), false);
    assert.equal(
      isSupabaseConfigured({
        supabaseUrl: "https://example.supabase.co",
        supabaseAnonKey: "ey.test"
      }),
      true
    );
  });

  it("blocks guests and allows signed-in users to use the free basic plan", () => {
    assert.equal(canRunReport(createGuestAccount()), false);
    assert.equal(canRunReport(createDemoAccount()), true);
  });

  it("records report history without decrementing a three-report trial", () => {
    const account = createDemoAccount();
    const updated = recordReport(account, { query: "Andrew Chen", sourceCount: 4 });

    assert.equal(freePlanLabel(), "Free basic");
    assert.equal(updated.creditsUsed, 0);
    assert.equal(updated.reports.length, 1);
    assert.equal(updated.reports[0].query, "Andrew Chen");
  });
});
