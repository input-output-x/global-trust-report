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
  return account?.provider === "guest" ? 0 : Infinity;
}

export function freePlanLabel() {
  return "Free basic";
}

export function canRunReport(account) {
  return Boolean(account?.provider !== "guest");
}

export function recordReport(account, report) {
  const nextAccount = {
    ...account,
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
