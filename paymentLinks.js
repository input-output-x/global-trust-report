export const paymentLinks = {
  single: "",
  deep: "",
  team: "",
  api: "",
  enterprise: ""
};

export function isConfiguredPaymentLink(url) {
  return [
    /^https:\/\/(buy|checkout)\.stripe\.com\//,
    /^https:\/\/checkout\.paddle\.com\//,
    /^https:\/\/[a-z0-9-]+\.lemonsqueezy\.com\/checkout\/buy\//
  ].some((pattern) => pattern.test(url));
}

export function paymentPlanKeys() {
  return Object.keys(paymentLinks);
}
