import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDiscoverySources,
  buildSearchUrls,
  normalizeGithubItems,
  normalizeHackerNewsItems,
  normalizeWikiItems,
  normalizeWikidataItems,
  scoreSignals
} from "../searchService.js";

describe("search service", () => {
  it("builds public source URLs from a query", () => {
    const urls = buildSearchUrls("Andrew Chen");

    assert.equal(urls.wikipedia.includes("Andrew%20Chen"), true);
    assert.equal(urls.wikidata.includes("Andrew%20Chen"), true);
    assert.equal(urls.github.includes("Andrew%20Chen"), true);
    assert.equal(urls.hackerNews.includes("Andrew%20Chen"), true);
  });

  it("adds tiered social discovery sources by report depth", () => {
    const free = buildDiscoverySources("Andrew Chen", "fast");
    const deep = buildDiscoverySources("Andrew Chen", "deep");
    const team = buildDiscoverySources("Andrew Chen", "team");

    assert.equal(free.some((record) => record.source === "LinkedIn"), false);
    assert.equal(deep.some((record) => record.source === "LinkedIn"), true);
    assert.equal(deep.some((record) => record.source === "微博"), false);
    assert.equal(team.some((record) => record.source === "微博"), true);
  });

  it("normalizes public API responses into source records", () => {
    const wiki = normalizeWikiItems([
      "Andrew Chen",
      ["Andrew Chen"],
      ["Investor and writer"],
      ["https://en.wikipedia.org/wiki/Andrew_Chen"]
    ]);
    const wikidata = normalizeWikidataItems({
      search: [{ label: "Andrew Chen", description: "American investor", concepturi: "https://www.wikidata.org/entity/Q1" }]
    });
    const github = normalizeGithubItems({
      items: [{ login: "andrew", html_url: "https://github.com/andrew", type: "User", score: 42 }]
    });
    const hn = normalizeHackerNewsItems({
      hits: [{ title: "Andrew Chen AMA", url: "https://news.ycombinator.com/item?id=1", author: "pg", points: 12 }]
    });

    assert.equal(wiki[0].source, "Wikipedia");
    assert.equal(wikidata[0].source, "Wikidata");
    assert.equal(github[0].source, "GitHub");
    assert.equal(hn[0].source, "Hacker News");
  });

  it("scores stronger reports when more independent sources are found", () => {
    const score = scoreSignals([
      { source: "Wikipedia" },
      { source: "Wikidata" },
      { source: "GitHub" },
      { source: "Hacker News" }
    ]);

    assert.equal(score, 82);
  });
});
