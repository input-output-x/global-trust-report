import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canRunReport,
  createDemoAccount,
  createGuestAccount,
  isSupabaseConfigured,
  recordReport,
  remainingFreeReports
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

  it("blocks guests and allows signed-in demo users with free credits", () => {
    assert.equal(canRunReport(createGuestAccount()), false);
    assert.equal(canRunReport(createDemoAccount()), true);
  });

  it("tracks free report usage and history", () => {
    const account = createDemoAccount();
    const updated = recordReport(account, { query: "Andrew Chen", sourceCount: 4 });

    assert.equal(remainingFreeReports(updated), 2);
    assert.equal(updated.reports.length, 1);
    assert.equal(updated.reports[0].query, "Andrew Chen");
  });
});
