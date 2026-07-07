const SOURCE_LIMIT = 5;
const SOURCE_TIMEOUT_MS = 6500;

function encoded(query) {
  return encodeURIComponent(query.trim());
}

export function buildSearchUrls(query) {
  const value = encoded(query);
  return {
    wikipedia: `https://en.wikipedia.org/w/api.php?action=opensearch&search=${value}&limit=${SOURCE_LIMIT}&namespace=0&format=json&origin=*`,
    wikidata: `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${value}&language=en&format=json&origin=*`,
    github: `https://api.github.com/search/users?q=${value}&per_page=${SOURCE_LIMIT}`,
    hackerNews: `https://hn.algolia.com/api/v1/search?query=${value}&tags=story`
  };
}

export function normalizeWikiItems(payload) {
  const titles = payload?.[1] ?? [];
  const descriptions = payload?.[2] ?? [];
  const urls = payload?.[3] ?? [];

  return titles.slice(0, SOURCE_LIMIT).map((title, index) => ({
    source: "Wikipedia",
    title,
    snippet: descriptions[index] || "Public encyclopedia result.",
    url: urls[index],
    confidence: "medium"
  }));
}

export function normalizeWikidataItems(payload) {
  return (payload?.search ?? []).slice(0, SOURCE_LIMIT).map((item) => ({
    source: "Wikidata",
    title: item.label,
    snippet: item.description || "Structured public entity result.",
    url: item.concepturi || item.url,
    confidence: "medium"
  }));
}

export function normalizeGithubItems(payload) {
  return (payload?.items ?? []).slice(0, SOURCE_LIMIT).map((item) => ({
    source: "GitHub",
    title: item.login,
    snippet: `${item.type || "Profile"} result. Search relevance score: ${Math.round(item.score ?? 0)}.`,
    url: item.html_url,
    confidence: "medium"
  }));
}

export function normalizeHackerNewsItems(payload) {
  return (payload?.hits ?? [])
    .filter((item) => item.title || item.story_title)
    .slice(0, SOURCE_LIMIT)
    .map((item) => ({
      source: "Hacker News",
      title: item.title || item.story_title,
      snippet: `${item.points ?? 0} points. Posted by ${item.author || "unknown"}.`,
      url: item.url || `https://news.ycombinator.com/item?id=${item.objectID}`,
      confidence: "low"
    }));
}

export function scoreSignals(records) {
  const uniqueSources = new Set(records.map((record) => record.source)).size;
  const volume = Math.min(records.length, 12);
  return Math.min(92, 42 + uniqueSources * 8 + volume * 2);
}

export function summarizeRecords(records, query, language) {
  if (!records.length) {
    return language === "zh"
      ? `没有从当前公开 API 中找到 "${query}" 的可靠结果。可以换成人名英文拼写、社媒用户名、公司名或钱包标识再试。`
      : `No reliable result for "${query}" was found in the current public APIs. Try a name spelling, social handle, company name or wallet identifier.`;
  }

  const sources = [...new Set(records.map((record) => record.source))].join(", ");
  return language === "zh"
    ? `已从 ${sources} 找到 ${records.length} 条公开来源信号。报告只整理公开可访问的信息，不代表身份认证或最终风险结论。`
    : `Found ${records.length} public-source signals from ${sources}. This report organizes public information only; it is not identity verification or a final risk decision.`;
}

export function buildSignals(records, language) {
  const sources = [...new Set(records.map((record) => record.source))];
  if (!records.length) {
    return language === "zh"
      ? [
          "当前公开数据源没有返回可用结果。",
          "可尝试更具体的英文名、用户名、公司域名或钱包地址。",
          "深度报告需要接入商业搜索 API 和人工复核流程。"
        ]
      : [
          "No usable result returned from the current public sources.",
          "Try a more specific English name, username, company domain or wallet address.",
          "A deep report requires a commercial search API and human review workflow."
        ];
  }

  return language === "zh"
    ? [
        `已覆盖 ${sources.length} 个公开来源：${sources.join("、")}。`,
        `最高相关结果：${records[0].title}。`,
        "所有结论都应点击来源链接复核，不应用作自动化拒绝或处罚依据。"
      ]
    : [
        `Covered ${sources.length} public sources: ${sources.join(", ")}.`,
        `Top matched result: ${records[0].title}.`,
        "Every conclusion should be reviewed through source links and not used for automated denial or punishment."
      ];
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SOURCE_TIMEOUT_MS);

  const response = await fetch(url, {
    signal: controller.signal,
    headers: {
      Accept: "application/json"
    }
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function runPublicSearch(query) {
  const urls = buildSearchUrls(query);
  const tasks = [
    ["wikipedia", urls.wikipedia, normalizeWikiItems],
    ["wikidata", urls.wikidata, normalizeWikidataItems],
    ["github", urls.github, normalizeGithubItems],
    ["hackerNews", urls.hackerNews, normalizeHackerNewsItems]
  ];

  const results = await Promise.allSettled(
    tasks.map(async ([key, url, normalize]) => ({
      key,
      records: normalize(await fetchJson(url))
    }))
  );

  const records = [];
  const errors = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      records.push(...result.value.records);
      return;
    }

    errors.push({
      source: tasks[index][0],
      message: result.reason?.message || "Request failed"
    });
  });

  return {
    records,
    errors,
    score: scoreSignals(records)
  };
}
