import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isConfiguredPaymentLink, paymentPlanKeys } from "../paymentLinks.js";

describe("payment links", () => {
  it("defines all paid plan keys", () => {
    assert.deepEqual(paymentPlanKeys(), ["single", "deep", "team", "api", "enterprise"]);
  });

  it("only accepts Stripe checkout or buy links", () => {
    assert.equal(isConfiguredPaymentLink("https://buy.stripe.com/test_123"), true);
    assert.equal(isConfiguredPaymentLink("https://checkout.stripe.com/c/pay/cs_test_123"), true);
    assert.equal(isConfiguredPaymentLink("https://example.com/pay"), false);
    assert.equal(isConfiguredPaymentLink(""), false);
  });
});
