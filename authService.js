export const FREE_REPORT_LIMIT = 3;
const STORAGE_KEY = "gtr-demo-account";

export function isSupabaseConfigured(config) {
  return Boolean(
    config?.supabaseUrl?.startsWith("https://") &&
      config?.supabaseAnonKey &&
      !config.supabaseAnonKey.includes("YOUR_")
  );
}

export function createGuestAccount() {
  return {
    id: "guest",
    email: "",
    name: "Guest",
    provider: "guest",
    creditsUsed: 0,
    paidCredits: 0,
    subscription: "free",
    reports: []
  };
}

export function createDemoAccount(email = "demo@globaltrust.report") {
  return {
    id: "demo",
    email,
    name: "Demo user",
    provider: "demo",
    creditsUsed: 0,
    paidCredits: 0,
    subscription: "free",
    reports: []
  };
}

export function remainingFreeReports(account) {
  return Math.max(0, FREE_REPORT_LIMIT - (account?.creditsUsed ?? 0));
}

export function canRunReport(account) {
  return Boolean(
    account?.provider !== "guest" &&
      (remainingFreeReports(account) > 0 || (account?.paidCredits ?? 0) > 0 || account?.subscription !== "free")
  );
}

export function recordReport(account, report) {
  const paidCredits = account.paidCredits ?? 0;
  const freeRemaining = remainingFreeReports(account);
  const nextAccount = {
    ...account,
    creditsUsed: freeRemaining > 0 ? (account.creditsUsed ?? 0) + 1 : account.creditsUsed ?? 0,
    paidCredits: freeRemaining > 0 ? paidCredits : Math.max(0, paidCredits - 1),
    reports: [
      {
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...report
      },
      ...(account.reports ?? [])
    ].slice(0, 10)
  };

  saveDemoAccount(nextAccount);
  return nextAccount;
}

export function loadDemoAccount() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveDemoAccount(account) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
}

export function clearDemoAccount() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
