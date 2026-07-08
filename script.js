import {
  buildSignals,
  runPublicSearch,
  summarizeRecords
} from "./searchService.js";
import { isConfiguredPaymentLink, paymentLinks } from "./paymentLinks.js";
import { createClient } from "@supabase/supabase-js";
import { authConfig } from "./authConfig.js";
import {
  canRunReport,
  clearDemoAccount,
  createDemoAccount,
  createGuestAccount,
  isSupabaseConfigured,
  loadDemoAccount,
  recordReport,
  saveDemoAccount
} from "./authService.js";

const translations = {
  en: {
    metaDescription:
      "AI-powered public trust reports for hiring, investing, creator sponsorships and business partnerships.",
    nav: {
      reports: "Reports",
      pricing: "Pricing",
      compliance: "Compliance",
      cta: "Start free"
    },
    sidebar: {
      title: "Research modes",
      freeLabel: "Current plan",
      freeCount: "Free basic"
    },
    auth: {
      account: "Account",
      body: "Accounts save your report history and prepare upgrades to Pro, Ultra, team workflows and API access.",
      configNeeded: "Supabase not configured. Demo sign-in is available.",
      configured: "Supabase configured. Use Google or email to sign in.",
      demo: "Use demo account",
      demoSignedIn: "Demo account active. Replace with Supabase before production.",
      emailButton: "Send magic link",
      emailLabel: "Email",
      emailSent: "Magic link sent. Check your inbox.",
      eyebrow: "Account",
      google: "Continue with Google",
      guest: "Guest",
      history: "Report history",
      historyEmpty: "No reports yet.",
      requireSignIn: "Sign in to use the free basic plan and save report history.",
      signIn: "Sign in",
      signOut: "Sign out",
      signedIn: "Signed in",
      title: "Sign in to use the free basic plan."
    },
    hero: {
      eyebrow: "Public information intelligence",
      title: "AI trust reports before you hire, sponsor, invest or collaborate.",
      body:
        "Enter a name, social profile, company, creator page, wallet address or public link. The system organizes open web signals into a structured decision report."
    },
    form: {
      label: "Research subject",
      placeholder: "Try: @creator, linkedin.com/in/name, company.com, vitalik.eth",
      submit: "Search sources",
      samplePrefix: "sample for"
    },
    depth: {
      fast: "Fast report · Free",
      deep: "Deep report · Pro",
      team: "Team workflow · Ultra"
    },
    report: {
      trustSignal: "Trust signal",
      summaryTitle: "Summary",
      signalsTitle: "Public signals",
      useTitle: "Recommended use",
      sourcesTitle: "Sources policy",
      sourcesBody:
        "Reports should cite public URLs, confidence levels and timestamped evidence. Private, hacked, deleted or paywalled data is out of scope."
    },
    sources: {
      title: "Live public sources",
      body: "Free uses open APIs. Pro adds global social discovery. Ultra adds China social platforms and team review links.",
      idle: "Ready",
      loading: "Searching",
      complete: "Complete",
      partial: "Partial",
      failed: "Failed",
      empty: "Run a search to see Wikipedia, Wikidata, GitHub and Hacker News results here.",
      apiNote:
        "Static pages cannot safely store commercial search API keys or scrape social platforms. Social sources open public review links first; paid tiers should use backend APIs and human review."
    },
    payment: {
      startFree: "Start free",
      buySingle: "Join Pro waitlist",
      buyDeep: "Join Ultra waitlist",
      subscribeTeam: "Contact for team",
      contactApi: "Request API access",
      contactEnterprise: "Contact sales",
      note:
        "Card checkout is intentionally paused while merchant setup is being finalized. Paid buttons collect upgrade intent first.",
      unconfigured:
        "Checkout is not enabled yet. Use this as an upgrade-intent signal while Paddle, Lemon Squeezy or Stripe HK is evaluated.",
      redirecting: "Opening checkout..."
    },
    positioning: {
      eyebrow: "Positioning",
      title: "A vertical paid version of AI people research.",
      body:
        "Nuwa proves that AI-powered people research has demand. Global Trust Report focuses on high-value trust decisions: creators, contractors, founders, business partners and Web3 identities."
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Free basic forever. Pay for deeper trust workflows.",
      free: {
        title: "Free",
        price: "$0/mo",
        body: "Basic public-signal search, trust summary and limited source review for everyday checks."
      },
      single: {
        title: "Pro",
        price: "$29/mo",
        body: "More sources, search history, PDF export and fuller profiles for repeat users."
      },
      deep: {
        title: "Ultra",
        price: "$79/mo",
        body: "Deep research, cross-platform identity signals, priority queue and faster processing."
      },
      team: {
        title: "Team",
        price: "Custom",
        body: "Shared workflows, seats and review processes for agencies, recruiting teams and brands."
      },
      api: {
        price: "Usage based",
        body: "Query-based pricing for platforms, CRMs, risk engines and creator marketplaces."
      },
      enterprise: {
        title: "Enterprise compliance",
        price: "Custom",
        body: "Custom controls, review workflows, policy constraints and audit support."
      }
    },
    compliance: {
      eyebrow: "Compliance boundary",
      title: "Built for public information, not private surveillance.",
      public: {
        title: "Public data only",
        body: "No account cracking, permission bypassing, private messages, deleted content or private databases."
      },
      sources: {
        title: "Source transparency",
        body: "Important conclusions should include public source links, confidence levels and review timestamps."
      },
      noHarassment: {
        title: "No stalking or harassment",
        body: "The product is for due diligence, anti-fraud, brand safety and collaboration review."
      },
      human: {
        title: "Human final decision",
        body: "AI output is not legal, financial, credit, housing, insurance or employment advice."
      },
      correction: {
        title: "Correction workflow",
        body: "Subjects should be able to request correction, dispute false matches or remove unsupported claims."
      },
      restricted: {
        title: "Restricted use cases",
        body: "No political persecution, illegal monitoring, discriminatory profiling or regulated credit decisions."
      }
    },
    footer: {
      tagline: "AI-powered public trust reports for global collaboration."
    },
    modes: {
      creator: {
        label: "Creator Risk",
        title: "Creator Risk Report",
        score: 82,
        price: "Free sample",
        summary:
          "Public profiles appear consistent across creator channels. Sample signals are suitable for an early brand safety review.",
        signals: [
          "Audience and content niche can be mapped from public platforms.",
          "Public controversies should be reviewed before sponsorship approval.",
          "Engagement quality needs deeper validation for paid campaigns."
        ],
        use: "Useful for TikTok, YouTube, Instagram, X and LinkedIn creator sponsorship screening."
      },
      contractor: {
        label: "Contractor Trust",
        title: "Contractor Trust Check",
        score: 76,
        price: "Pro",
        summary:
          "Public professional signals suggest a reasonable starting point for remote collaboration review.",
        signals: [
          "Linked public profiles can be compared with portfolio claims.",
          "GitHub, LinkedIn and website activity may support skill consistency.",
          "Final hiring decisions require interviews and direct references."
        ],
        use: "Useful before hiring remote developers, designers, operators, agencies and freelancers."
      },
      founder: {
        label: "Founder Brief",
        title: "Founder & Investor Brief",
        score: 71,
        price: "Ultra",
        summary:
          "Public company, media and social signals can be organized into a concise diligence brief.",
        signals: [
          "Past projects and public roles can be cross-checked from open sources.",
          "News coverage and public disputes should be separated by confidence level.",
          "Corporate associations need official registry verification where available."
        ],
        use: "Useful for investor screening, partnership review and early business due diligence."
      },
      web3: {
        label: "Web3 Identity",
        title: "Web3 Wallet Identity Research",
        score: 68,
        price: "Usage based",
        summary:
          "Wallet, ENS, public social and open-source signals can help build a non-custodial identity risk picture.",
        signals: [
          "Wallet activity can be grouped into visible behavior patterns.",
          "Public identity links such as ENS, X and GitHub should be treated as signals, not proof.",
          "High-risk labels require careful source citation and human review."
        ],
        use: "Useful for Web3 teams, community managers, investors, researchers and risk workflows."
      }
    }
  },
  zh: {
    metaDescription: "面向招聘、投资、创作者投放和商务合作的 AI 公开信息信任报告。",
    nav: {
      reports: "报告",
      pricing: "价格",
      compliance: "合规边界",
      cta: "免费开始"
    },
    sidebar: {
      title: "研究模式",
      freeLabel: "当前套餐",
      freeCount: "免费基础版"
    },
    auth: {
      account: "账户",
      body: "账户用于保存报告历史，并为 Pro、Ultra、团队流程和 API 权限升级做准备。",
      configNeeded: "Supabase 尚未配置。现在可以使用 Demo 登录测试流程。",
      configured: "Supabase 已配置。可以使用 Google 或邮箱登录。",
      demo: "使用 Demo 账户",
      demoSignedIn: "Demo 账户已启用。正式上线前请替换为 Supabase。",
      emailButton: "发送 Magic Link",
      emailLabel: "邮箱",
      emailSent: "Magic Link 已发送，请检查邮箱。",
      eyebrow: "账户",
      google: "使用 Google 登录",
      guest: "访客",
      history: "报告历史",
      historyEmpty: "还没有报告。",
      requireSignIn: "请先登录，以使用免费基础版并保存报告历史。",
      signIn: "登录",
      signOut: "退出登录",
      signedIn: "已登录",
      title: "登录后使用免费基础版。"
    },
    hero: {
      eyebrow: "公开信息智能分析",
      title: "在招聘、投放、投资或合作前，先生成一份 AI 信任报告。",
      body:
        "输入人名、社媒主页、公司名称、创作者页面、钱包地址或公开链接，系统会把公开网络信号整理成结构化决策报告。"
    },
    form: {
      label: "研究对象",
      placeholder: "试试：@creator、linkedin.com/in/name、company.com、vitalik.eth",
      submit: "搜索来源",
      samplePrefix: "样例："
    },
    depth: {
      fast: "快速报告 · 免费版",
      deep: "深度报告 · Pro",
      team: "团队流程 · Ultra"
    },
    report: {
      trustSignal: "信任信号",
      summaryTitle: "摘要",
      signalsTitle: "公开信号",
      useTitle: "推荐用途",
      sourcesTitle: "来源政策",
      sourcesBody:
        "报告应引用公开 URL、可信度等级和证据时间戳。私密、破解、已删除或付费墙后的数据不在产品范围内。"
    },
    sources: {
      title: "实时公开来源",
      body: "免费版使用公开 API。Pro 增加海外社媒发现入口。Ultra 增加国内社媒和团队复核入口。",
      idle: "待搜索",
      loading: "搜索中",
      complete: "完成",
      partial: "部分完成",
      failed: "失败",
      empty: "搜索后会在这里显示 Wikipedia、Wikidata、GitHub 和 Hacker News 结果。",
      apiNote:
        "静态页面不能安全保存商业搜索 API 密钥，也不应直接抓取社交平台。社媒来源先打开公开复核链接；付费层应通过后端 API 和人工复核。"
    },
    payment: {
      startFree: "免费开始",
      buySingle: "加入 Pro 候补",
      buyDeep: "加入 Ultra 候补",
      subscribeTeam: "联系团队版",
      contactApi: "申请 API",
      contactEnterprise: "联系销售",
      note: "银行卡结账先暂停，等商户收款方案确认后再开启。当前付费按钮先用于收集升级意向。",
      unconfigured: "结账暂未开启。当前阶段先收集升级意向，同时评估 Paddle、Lemon Squeezy 或香港 Stripe。",
      redirecting: "正在打开结账页面..."
    },
    positioning: {
      eyebrow: "产品定位",
      title: "AI 人物研究的垂直付费版本。",
      body:
        "Nuwa 证明了 AI 人物研究存在需求。Global Trust Report 更聚焦高价值信任决策：创作者、远程合作者、创始人、商务伙伴和 Web3 身份。"
    },
    pricing: {
      eyebrow: "收费设计",
      title: "基础版永久免费，高级信任工作流再付费。",
      free: {
        title: "免费版",
        price: "$0/月",
        body: "基础公开信号搜索、信任摘要和有限来源展示，适合日常轻量判断。"
      },
      single: {
        title: "Pro",
        price: "$29/月",
        body: "更多来源、搜索历史、PDF 导出和更完整画像，适合持续使用的个人和小团队。"
      },
      deep: {
        title: "Ultra",
        price: "$79/月",
        body: "深度研究、跨平台身份信号、优先队列和更快处理，适合高价值判断场景。"
      },
      team: {
        title: "团队版",
        price: "定制报价",
        body: "共享流程、成员席位和审核机制，适合 Agency、招聘团队、品牌团队协作。"
      },
      api: {
        price: "按查询量收费",
        body: "适合平台、CRM、风控系统和创作者营销平台集成。"
      },
      enterprise: {
        title: "企业合规版",
        price: "定制报价",
        body: "提供定制权限、审核流程、政策约束和审计支持。"
      }
    },
    compliance: {
      eyebrow: "合规边界",
      title: "基于公开信息，而不是隐私监控。",
      public: {
        title: "只处理公开数据",
        body: "不破解账号、不绕过权限、不抓取私信、已删除内容或私有数据库。"
      },
      sources: {
        title: "来源透明",
        body: "关键结论应包含公开来源链接、可信度等级和审核时间。"
      },
      noHarassment: {
        title: "禁止跟踪和骚扰",
        body: "产品用于尽调、反欺诈、品牌安全和合作前审核。"
      },
      human: {
        title: "人类最终决策",
        body: "AI 输出不构成法律、金融、信贷、住房、保险或雇佣建议。"
      },
      correction: {
        title: "更正与申诉流程",
        body: "被查询对象应能请求更正、申诉错误匹配或移除缺乏依据的结论。"
      },
      restricted: {
        title: "限制用途",
        body: "不得用于政治迫害、非法监控、歧视性画像或受监管的信贷决策。"
      }
    },
    footer: {
      tagline: "面向全球合作的 AI 公开信息信任报告。"
    },
    modes: {
      creator: {
        label: "创作者风险",
        title: "创作者风险报告",
        score: 82,
        price: "免费样例",
        summary: "公开主页在多个创作者渠道上表现一致，样例信号适合用于早期品牌安全审核。",
        signals: [
          "可以从公开平台梳理受众、内容垂类和合作适配度。",
          "品牌投放前应复核公开争议和高风险内容。",
          "付费投放前需要进一步验证互动质量和粉丝真实性。"
        ],
        use: "适合 TikTok、YouTube、Instagram、X 和 LinkedIn 创作者投放筛选。"
      },
      contractor: {
        label: "合作者信任",
        title: "远程合作者信任检查",
        score: 76,
        price: "Pro",
        summary: "公开职业信号显示其适合进入远程合作的初步审核流程。",
        signals: [
          "可将公开职业主页与作品集声明进行交叉验证。",
          "GitHub、LinkedIn 和个人网站活跃度可支持能力一致性判断。",
          "最终雇佣仍需要面试、合同和直接背调。"
        ],
        use: "适合雇佣远程开发者、设计师、运营、代理商和自由职业者前使用。"
      },
      founder: {
        label: "创始人简报",
        title: "创始人 / 投资人背景简报",
        score: 71,
        price: "Ultra",
        summary: "公开公司、媒体和社交信号可整理成一份简洁的合作尽调简报。",
        signals: [
          "可从公开来源交叉验证过往项目和公开职务。",
          "新闻报道和公开争议应按可信度分层呈现。",
          "企业关联关系需要结合可用的官方登记信息复核。"
        ],
        use: "适合投资人筛选、合伙前审核和早期商务尽调。"
      },
      web3: {
        label: "Web3 身份",
        title: "Web3 钱包身份研究",
        score: 68,
        price: "按量收费",
        summary: "钱包、ENS、公开社交和开源信号可帮助形成非托管身份风险画像。",
        signals: [
          "钱包活动可归类为可见行为模式。",
          "ENS、X、GitHub 等公开身份链接应被视为信号，而不是绝对证明。",
          "高风险标签必须谨慎引用来源，并经过人工复核。"
        ],
        use: "适合 Web3 团队、社区管理者、投资人、研究员和风控流程。"
      }
    }
  }
};

const form = document.querySelector("#report-form");
const modeButtons = [...document.querySelectorAll(".mode")];
const queryInput = document.querySelector("#query");
const depthSelect = document.querySelector("#depth");
const langToggle = document.querySelector("#lang-toggle");
const sourceGrid = document.querySelector("#source-grid");
const sourceErrors = document.querySelector("#source-errors");
const searchStatus = document.querySelector("#search-status");
const paymentNote = document.querySelector("#payment-note");
const accountButton = document.querySelector("#account-button");
const accountName = document.querySelector("#account-name");
const authStatus = document.querySelector("#auth-status");
const authModal = document.querySelector("#auth-modal");
const authMessage = document.querySelector("#auth-message");
const authClose = document.querySelector("#auth-close");
const demoLogin = document.querySelector("#demo-login");
const googleLogin = document.querySelector("#google-login");
const logoutButton = document.querySelector("#logout-button");
const emailLoginForm = document.querySelector("#email-login-form");
const authEmail = document.querySelector("#auth-email");
const freeCount = document.querySelector("#free-count");
const historyButton = document.querySelector("#history-button");
const historyList = document.querySelector("#history-list");
const supportedLanguages = ["en", "zh"];
let activeLanguage = getInitialLanguage();
let currentAccount = loadDemoAccount() || createGuestAccount();
let supabase = null;

function getInitialLanguage() {
  const saved = localStorage.getItem("gtr-language");
  if (supportedLanguages.includes(saved)) return saved;
  return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function translate(path) {
  return path.split(".").reduce((value, key) => value?.[key], translations[activeLanguage]) ?? "";
}

function activeModeKey() {
  return document.querySelector(".mode.is-active").dataset.mode;
}

function applyLanguage() {
  document.documentElement.lang = activeLanguage === "zh" ? "zh-CN" : "en";
  document.title = activeLanguage === "zh" ? "Global Trust Report | 全球信任报告" : "Global Trust Report";
  document.querySelector('meta[name="description"]').setAttribute("content", translate("metaDescription"));
  langToggle.textContent = activeLanguage === "zh" ? "English" : "中文";
  langToggle.setAttribute("aria-label", activeLanguage === "zh" ? "Switch to English" : "切换到中文");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translate(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", translate(element.dataset.i18nPlaceholder));
  });

  paymentNote.textContent = translate("payment.note");
  paymentNote.classList.remove("is-warning");
  renderReport(activeModeKey());
  renderEmptySources();
  updateAuthUi();
}

function renderReport(modeKey) {
  const report = translations[activeLanguage].modes[modeKey];
  document.querySelector("#report-mode").textContent = report.title;
  document.querySelector("#report-price").textContent = report.price;
  document.querySelector("#score").textContent = report.score;
  document.querySelector("#meter-fill").style.width = `${report.score}%`;
  document.querySelector("#summary").textContent = report.summary;
  document.querySelector("#use-case").textContent = report.use;

  const signals = document.querySelector("#signals");
  signals.innerHTML = "";
  report.signals.forEach((signal) => {
    const item = document.createElement("li");
    item.textContent = signal;
    signals.appendChild(item);
  });
}

function renderEmptySources() {
  if (!sourceGrid.children.length || sourceGrid.querySelector(".source-empty")) {
    sourceGrid.innerHTML = `<article class="source-empty">${translate("sources.empty")}</article>`;
    sourceErrors.hidden = true;
    searchStatus.textContent = translate("sources.idle");
  }
}

function renderSourceCards(records) {
  if (!records.length) {
    sourceGrid.innerHTML = `<article class="source-empty">${translate("sources.empty")}</article>`;
    return;
  }

  sourceGrid.innerHTML = records
    .slice(0, 12)
    .map((record) => {
      const title = escapeHtml(record.title || record.url || record.source);
      const snippet = escapeHtml(record.snippet || "");
      const source = escapeHtml(record.source);
      const confidence = escapeHtml(record.tier || record.confidence || "medium");
      const region = record.region ? `<span>${escapeHtml(record.region)}</span>` : "";
      const url = escapeHtml(record.url || "#");

      return `
        <article class="source-card">
          <div class="source-meta">
            <span>${source}</span>
            <span>${confidence}</span>
            ${region}
          </div>
          <a href="${url}" target="_blank" rel="noreferrer">${title}</a>
          <p>${snippet}</p>
        </article>
      `;
    })
    .join("");
}

function renderSourceErrors(errors) {
  if (!errors.length) {
    sourceErrors.hidden = true;
    sourceErrors.textContent = "";
    return;
  }

  const sourceNames = errors.map((error) => error.source).join(", ");
  sourceErrors.hidden = false;
  sourceErrors.textContent =
    activeLanguage === "zh"
      ? `部分来源暂时不可用：${sourceNames}。${translate("sources.apiNote")}`
      : `Some sources are temporarily unavailable: ${sourceNames}. ${translate("sources.apiNote")}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function initAuth() {
  if (!isSupabaseConfigured(authConfig)) {
    updateAuthUi();
    return;
  }

  supabase = createClient(authConfig.supabaseUrl, authConfig.supabaseAnonKey);
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    currentAccount = accountFromSupabaseUser(data.session.user);
    saveDemoAccount(currentAccount);
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    currentAccount = session?.user ? accountFromSupabaseUser(session.user) : createGuestAccount();
    saveDemoAccount(currentAccount);
    updateAuthUi();
  });

  updateAuthUi();
}

function accountFromSupabaseUser(user) {
  const stored = loadDemoAccount();
  return {
    ...(stored?.id === user.id ? stored : createDemoAccount(user.email || "")),
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.name || user.email || "User",
    provider: "supabase"
  };
}

function updateAuthUi() {
  const signedIn = currentAccount.provider !== "guest";
  freeCount.textContent = translate("sidebar.freeCount");
  accountName.textContent = signedIn ? currentAccount.email || currentAccount.name : translate("auth.guest");
  accountButton.textContent = signedIn ? translate("auth.signedIn") : translate("auth.signIn");

  if (signedIn && currentAccount.provider === "demo") {
    authStatus.textContent = translate("auth.demoSignedIn");
  } else if (signedIn) {
    authStatus.textContent = translate("auth.signedIn");
  } else {
    authStatus.textContent = isSupabaseConfigured(authConfig)
      ? translate("auth.configured")
      : translate("auth.configNeeded");
  }

  renderHistory();
}

function openAuthModal(message = "") {
  authMessage.textContent = message;
  renderHistory();
  if (!authModal.open) authModal.showModal();
}

function renderHistory() {
  const reports = currentAccount.reports ?? [];
  if (!reports.length) {
    historyList.innerHTML = `<div class="history-item"><span>${translate("auth.historyEmpty")}</span></div>`;
    return;
  }

  historyList.innerHTML = reports
    .map(
      (report) => `
        <div class="history-item">
          <strong>${escapeHtml(report.query)}</strong>
          <span>${escapeHtml(report.sourceCount ?? 0)} sources · ${escapeHtml(report.createdAt ?? "")}</span>
        </div>
      `
    )
    .join("");
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modeButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderReport(button.dataset.mode);
  });
});

langToggle.addEventListener("click", () => {
  activeLanguage = activeLanguage === "zh" ? "en" : "zh";
  localStorage.setItem("gtr-language", activeLanguage);
  applyLanguage();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const report = translations[activeLanguage].modes[activeModeKey()];
  const subject = queryInput.value.trim();
  const depth = depthSelect.options[depthSelect.selectedIndex].text;

  if (!subject) return;

  if (!canRunReport(currentAccount)) {
    openAuthModal(translate("auth.requireSignIn"));
    return;
  }

  searchStatus.textContent = translate("sources.loading");
  sourceGrid.innerHTML = `<article class="source-empty">${translate("sources.loading")}...</article>`;
  sourceErrors.hidden = true;
  document.querySelector("#summary").textContent =
    activeLanguage === "zh" ? `正在搜索 "${subject}" 的公开来源...` : `Searching public sources for "${subject}"...`;
  document.querySelector("#reports").scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const result = await runPublicSearch(subject, depthSelect.value);
    const signals = buildSignals(result.records, activeLanguage);
    document.querySelector("#score").textContent = result.score;
    document.querySelector("#meter-fill").style.width = `${result.score}%`;
    document.querySelector("#summary").textContent =
      activeLanguage === "zh"
        ? `${depth}结果："${subject}"。${summarizeRecords(result.records, subject, activeLanguage)}`
        : `${depth} result for "${subject}": ${summarizeRecords(result.records, subject, activeLanguage)}`;
    document.querySelector("#use-case").textContent = report.use;

    const signalsList = document.querySelector("#signals");
    signalsList.innerHTML = "";
    signals.forEach((signal) => {
      const item = document.createElement("li");
      item.textContent = signal;
      signalsList.appendChild(item);
    });

    renderSourceCards(result.records);
    renderSourceErrors(result.errors);
    searchStatus.textContent = result.errors.length ? translate("sources.partial") : translate("sources.complete");
    currentAccount = recordReport(currentAccount, {
      query: subject,
      mode: activeModeKey(),
      sourceCount: result.records.length,
      score: result.score
    });
    updateAuthUi();
  } catch (error) {
    searchStatus.textContent = translate("sources.failed");
    document.querySelector("#summary").textContent =
      activeLanguage === "zh"
        ? `搜索失败：${error.message}。${translate("sources.apiNote")}`
        : `Search failed: ${error.message}. ${translate("sources.apiNote")}`;
  }
});

document.querySelectorAll("[data-pay-plan]").forEach((button) => {
  button.addEventListener("click", () => {
    const plan = button.dataset.payPlan;

    if (plan !== "free" && currentAccount.provider === "guest") {
      openAuthModal(translate("auth.requireSignIn"));
      return;
    }

    if (plan === "free") {
      document.querySelector("#research").scrollIntoView({ behavior: "smooth", block: "start" });
      queryInput.focus();
      return;
    }

    const url = paymentLinks[plan];
    if (isConfiguredPaymentLink(url)) {
      paymentNote.textContent = translate("payment.redirecting");
      window.location.href = url;
      return;
    }

    paymentNote.textContent = translate("payment.unconfigured");
    paymentNote.classList.add("is-warning");
  });
});

accountButton.addEventListener("click", () => openAuthModal());
historyButton.addEventListener("click", () => openAuthModal());
authClose.addEventListener("click", () => authModal.close());

demoLogin.addEventListener("click", () => {
  currentAccount = createDemoAccount();
  saveDemoAccount(currentAccount);
  updateAuthUi();
  authMessage.textContent = translate("auth.demoSignedIn");
});

logoutButton.addEventListener("click", async () => {
  if (supabase) await supabase.auth.signOut();
  clearDemoAccount();
  currentAccount = createGuestAccount();
  updateAuthUi();
  authMessage.textContent = "";
});

googleLogin.addEventListener("click", async () => {
  if (!supabase) {
    authMessage.textContent = translate("auth.configNeeded");
    return;
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: authConfig.redirectTo }
  });
  if (error) authMessage.textContent = error.message;
});

emailLoginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!supabase) {
    authMessage.textContent = translate("auth.configNeeded");
    return;
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: authEmail.value,
    options: { emailRedirectTo: authConfig.redirectTo }
  });
  authMessage.textContent = error ? error.message : translate("auth.emailSent");
});

applyLanguage();
initAuth();
