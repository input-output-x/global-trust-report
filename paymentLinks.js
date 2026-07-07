export const paymentLinks = {
  single: "",
  deep: "",
  team: "",
  api: "",
  enterprise: ""
};

export function isConfiguredPaymentLink(url) {
  return /^https:\/\/(buy|checkout)\.stripe\.com\//.test(url);
}

export function paymentPlanKeys() {
  return Object.keys(paymentLinks);
}
