# Global Trust Report / 全球信任报告

**English:** AI-powered public trust reports for hiring, investing, creator sponsorships and business partnerships.  
**中文：** 面向招聘、投资、创作者投放和商务合作的 AI 公开信息信任报告。

Live demo / 线上页面: https://input-output-x.github.io/global-trust-report/

---

## English

Global Trust Report is a bilingual product MVP inspired by the demand for AI-powered people research, but focused on higher-value global trust decisions: creators, contractors, founders, business partners and Web3 identities.

Users can enter a name, social profile, company name, creator page, wallet address or public link. The system organizes public web signals into a structured report that helps teams make safer decisions before hiring, sponsoring, investing or collaborating.

The live demo runs real browser-side searches against public APIs:

- Wikipedia OpenSearch
- Wikidata entity search
- GitHub user search
- Hacker News Algolia search

Because this version is deployed on GitHub Pages, it does not store commercial search API keys in the browser. Full web search should be connected through a backend using Serper, Tavily, Bing Web Search or another compliant provider.

This is not a people-search abuse product. It is designed around public information, source transparency, correction workflows and restricted-use boundaries.

### Pricing model

- First 3 reports: free
- Single report: $9-$29
- Deep report: $49-$199
- Team plan: $99-$499/month
- API: usage based
- Enterprise compliance: custom pricing

### Compliance boundary

- Public information only
- No account cracking, permission bypassing or private data collection
- No deleted, hacked, private-message or paywalled data
- Source links, confidence levels and timestamps should be shown for important claims
- AI output is not legal, financial, credit, housing, insurance or employment advice
- Subjects should be able to request correction or dispute false matches
- Restricted use cases include harassment, stalking, discriminatory profiling, political persecution and regulated credit decisions

---

## 中文

Global Trust Report 是一个中英双语产品 MVP，灵感来自 AI 人物研究的需求，但更聚焦全球范围内更容易付费的高价值信任决策：创作者、远程合作者、创始人、商务伙伴和 Web3 身份。

用户可以输入人名、社交媒体主页、公司名称、创作者页面、钱包地址或公开链接。系统会把公开网络信号整理成结构化报告，帮助团队在招聘、投放、投资或合作前做出更安全的判断。

当前线上演示版会在浏览器中真实调用公开 API：

- Wikipedia OpenSearch
- Wikidata 实体搜索
- GitHub 用户搜索
- Hacker News Algolia 搜索

因为这个版本部署在 GitHub Pages 上，不能把商业搜索 API 密钥直接放在浏览器里。真正的全网搜索应通过后端接入 Serper、Tavily、Bing Web Search 或其他合规搜索服务。

这不是“人肉搜索”或隐私窥探工具。产品边界围绕公开信息、来源透明、更正机制和限制用途设计。

### 收费设计

- 前 3 次报告：免费
- 单次报告：$9-$29
- 深度报告：$49-$199
- 团队版：$99-$499/月
- API：按查询量收费
- 企业合规版：定制报价

### 合规边界

- 只处理公开信息
- 不破解账号、不绕过权限、不采集私密数据
- 不处理已删除、破解、私信或付费墙后的数据
- 关键结论应展示来源链接、可信度等级和时间戳
- AI 输出不构成法律、金融、信贷、住房、保险或雇佣建议
- 被查询对象应能请求更正或申诉错误匹配
- 限制用途包括骚扰、跟踪、歧视性画像、政治迫害和受监管的信贷决策

---

## Run locally / 本地运行

```bash
npm install
npm start
```

## Build / 构建

```bash
npm run build
```

## Stripe Payment Links / Stripe 支付接入

This GitHub Pages version uses Stripe Payment Links because a static site cannot safely store a Stripe secret key. Create your products and payment links in the Stripe Dashboard, then paste the live links into `paymentLinks.js`.

当前 GitHub Pages 版本使用 Stripe Payment Links，因为静态站不能安全保存 Stripe Secret Key。你需要先在 Stripe Dashboard 创建产品和 Payment Link，然后把真实链接填入 `paymentLinks.js`。

```js
export const paymentLinks = {
  single: "https://buy.stripe.com/...",
  deep: "https://buy.stripe.com/...",
  team: "https://buy.stripe.com/...",
  api: "https://buy.stripe.com/...",
  enterprise: "https://buy.stripe.com/..."
};
```

Recommended mapping / 推荐映射：

- `single`: Single report / 单次报告
- `deep`: Deep report / 深度报告
- `team`: Team subscription / 团队订阅
- `api`: API access or usage deposit / API 权限或用量预充值
- `enterprise`: Enterprise compliance deposit or sales checkout / 企业合规定金或销售结账

If a link is empty, the site shows a configuration warning instead of sending users to a fake checkout.

如果链接为空，网站会显示配置提示，不会把用户带到假的结账页。

## Supabase Auth / 登录注册

The login UI is already scaffolded with Google OAuth, email magic link, demo sign-in, free report credits and local report history. This repo is currently connected to the Supabase project `alfbnfxxxjdoosmpxciy`:

登录 UI 已经搭好，包含 Google 登录、邮箱 Magic Link、Demo 登录、免费报告额度和报告历史。当前仓库已接入 Supabase 项目 `alfbnfxxxjdoosmpxciy`：

```js
export const authConfig = {
  supabaseUrl: "https://alfbnfxxxjdoosmpxciy.supabase.co",
  supabaseAnonKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
  redirectTo: "https://input-output-x.github.io/global-trust-report/"
};
```

Supabase Auth URL configuration:

- Site URL: `https://input-output-x.github.io/global-trust-report/`
- Google OAuth callback URL: `https://alfbnfxxxjdoosmpxciy.supabase.co/auth/v1/callback`

To enable Google sign-in, create an OAuth Web Client in Google Cloud, add the callback URL above as an authorized redirect URI, then paste the Google Client ID and Client Secret into Supabase Authentication -> Sign In / Providers -> Google.

Supabase Auth URL 配置：

- Site URL：`https://input-output-x.github.io/global-trust-report/`
- Google OAuth 回调地址：`https://alfbnfxxxjdoosmpxciy.supabase.co/auth/v1/callback`

要启用 Google 登录，需要先在 Google Cloud 创建 OAuth Web Client，把上面的回调地址加入 Authorized redirect URI，然后把 Google Client ID 和 Client Secret 填进 Supabase Authentication -> Sign In / Providers -> Google。

Then run the SQL in `supabase/schema.sql` inside the Supabase SQL Editor. It creates:

然后在 Supabase SQL Editor 里运行 `supabase/schema.sql`，它会创建：

- `profiles`: user credits and subscription status / 用户额度和订阅状态
- `reports`: report history / 报告历史
- `stripe_events`: Stripe webhook event log / Stripe webhook 事件记录
- Row Level Security policies / RLS 权限策略

For production, move credit deduction, paid credit grants and Stripe webhook handling to Supabase Edge Functions or another backend. The browser should never decide paid entitlements by itself.

正式上线时，应把额度扣减、付费额度发放和 Stripe webhook 验证放到 Supabase Edge Functions 或其他后端里，不能只靠浏览器判断用户是否付费。
