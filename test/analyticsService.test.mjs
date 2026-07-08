import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildProfilePayload,
  buildReportPayload,
  buildUpgradeIntentPayload,
  isTrackableAccount
} from "../analyticsService.js";

describe("analytics service", () => {
  const account = {
    id: "00000000-0000-4000-8000-000000000001",
    email: "founder@example.com",
    name: "Founder",
    provider: "supabase",
    subscription: "free"
  };

  it("only tracks real Supabase users", () => {
    assert.equal(isTrackableAccount(account), true);
    assert.equal(isTrackableAccount({ ...account, provider: "demo" }), false);
    assert.equal(isTrackableAccount({ ...account, provider: "guest" }), false);
  });

  it("builds profile payloads for Supabase upsert", () => {
    assert.deepEqual(buildProfilePayload(account), {
      id: account.id,
      email: "founder@example.com",
      full_name: "Founder",
      subscription_status: "free"
    });
  });

  it("builds report payloads with mode and depth", () => {
    assert.deepEqual(
      buildReportPayload(account, {
        query: "@creator",
        mode: "creator",
        depth: "fast",
        sourceCount: 8,
        score: 76
      }),
      {
        user_id: account.id,
        query: "@creator",
        mode: "creator",
        depth: "fast",
        source_count: 8,
        score: 76
      }
    );
  });

  it("builds upgrade-intent payloads", () => {
    assert.deepEqual(buildUpgradeIntentPayload(account, "deep", { language: "en" }), {
      user_id: account.id,
      plan: "deep",
      source: "pricing_button",
      status: "pending",
      metadata: { language: "en" }
    });
  });
});
