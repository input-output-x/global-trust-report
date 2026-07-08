export function isTrackableAccount(account) {
  return Boolean(account?.provider === "supabase" && account?.id && account.id !== "guest");
}

export function buildProfilePayload(account) {
  return {
    id: account.id,
    email: account.email || "",
    full_name: account.name || account.email || "",
    subscription_status: account.subscription || "free"
  };
}

export function buildReportPayload(account, report) {
  return {
    user_id: account.id,
    query: report.query,
    mode: report.mode,
    depth: report.depth || "fast",
    source_count: report.sourceCount ?? 0,
    score: report.score ?? 0
  };
}

export function buildUpgradeIntentPayload(account, plan, metadata = {}) {
  return {
    user_id: account.id,
    plan,
    source: "pricing_button",
    status: "pending",
    metadata
  };
}

export async function syncProfile(supabase, account) {
  if (!supabase || !isTrackableAccount(account)) return { skipped: true };

  const { error } = await supabase
    .from("profiles")
    .upsert(buildProfilePayload(account), { onConflict: "id" });

  if (error) throw error;
  return { skipped: false };
}

export async function logReport(supabase, account, report) {
  if (!supabase || !isTrackableAccount(account)) return { skipped: true };

  const { error } = await supabase
    .from("reports")
    .insert(buildReportPayload(account, report));

  if (error) throw error;
  return { skipped: false };
}

export async function logUpgradeIntent(supabase, account, plan, metadata = {}) {
  if (!supabase || !isTrackableAccount(account)) return { skipped: true };

  const { error } = await supabase
    .from("upgrade_intents")
    .insert(buildUpgradeIntentPayload(account, plan, metadata));

  if (error) throw error;
  return { skipped: false };
}
