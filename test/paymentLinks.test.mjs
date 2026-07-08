import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isConfiguredPaymentLink, paymentPlanKeys } from "../paymentLinks.js";

describe("payment links", () => {
  it("defines all paid plan keys", () => {
    assert.deepEqual(paymentPlanKeys(), ["single", "deep", "team", "api", "enterprise"]);
  });

  it("accepts supported checkout providers", () => {
    assert.equal(isConfiguredPaymentLink("https://buy.stripe.com/test_123"), true);
    assert.equal(isConfiguredPaymentLink("https://checkout.stripe.com/c/pay/cs_test_123"), true);
    assert.equal(isConfiguredPaymentLink("https://checkout.paddle.com/checkout/custom/test_123"), true);
    assert.equal(isConfiguredPaymentLink("https://globaltrust.lemonsqueezy.com/checkout/buy/test_123"), true);
    assert.equal(isConfiguredPaymentLink("https://example.com/pay"), false);
    assert.equal(isConfiguredPaymentLink(""), false);
  });
});
