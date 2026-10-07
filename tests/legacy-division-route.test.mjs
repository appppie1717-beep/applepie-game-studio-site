import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

const moduleSource = await readFile(new URL("../app/_components/legacy-division-route.ts", import.meta.url), "utf8");
const moduleContext = {};
runInNewContext(moduleSource.replace(/^export const legacyDivisionRouteScript\s*=/m,
  "globalThis.legacyDivisionRouteScript ="), moduleContext);
const script = moduleContext.legacyDivisionRouteScript;
assert.equal(typeof script, "string");

function navigate(path) {
  const url = new URL(path, "https://ersiyan.com");
  const events = [];
  runInNewContext(script, {
    location: {
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      replace: (destination) => events.push(["replace", destination]),
    },
    document: { documentElement: {
      setAttribute: (name, value) => events.push(["attribute", name, value]),
    } },
  }, { timeout: 1000 });
  return events;
}

test("legacy division links preserve campaign parameters and replace history before showing the wrong section", () => {
  const cases = [
    ["/#ersiyan-virtual-view", "/virtual"],
    ["/?utm_source=virtual&utm_content=%ED%95%9C%EA%B8%80#ersiyan-virtual-view", "/virtual?utm_source=virtual&utm_content=%ED%95%9C%EA%B8%80"],
    ["/#ersiyan-games-view", "/games"],
    ["/?utm_source=link#games", "/games?utm_source=link#games"],
    ["/?utm_source=link#studio", "/games?utm_source=link#studio"],
    ["/virtual#ersiyan-games-view", "/games"],
    ["/virtual?utm_source=games&tag=one&tag=two#ersiyan-games-view", "/games?utm_source=games&tag=one&tag=two"],
    ["/virtual?utm_source=link#games", "/games?utm_source=link#games"],
    ["/virtual?utm_source=link#studio", "/games?utm_source=link#studio"],
    ["/games#ersiyan-virtual-view", "/virtual"],
    ["/games?utm_source=company#ersiyan-company-view", "/?utm_source=company#ersiyan-company-view"],
    ["/virtual#ersiyan-company-view", "/#ersiyan-company-view"],
  ];
  for (const [from, to] of cases) {
    assert.deepEqual(navigate(from), [
      ["attribute", "data-division-redirect", ""],
      ["replace", to],
    ], from);
    assert.equal(new URL(to, "https://ersiyan.com").origin, "https://ersiyan.com");
    assert.deepEqual(navigate(to), [], "The destination does not redirect again");
  }
});

test("explicit department selections preserve unrelated raw query parameters and do not loop", () => {
  const cases = [
    ["/?division=games", "/games"],
    ["/?tag=one&division=virtual&tag=two&label=%ED%95%9C%EA%B8%80", "/virtual?tag=one&tag=two&label=%ED%95%9C%EA%B8%80"],
    ["/games?division=company#ersiyan-company-view", "/#ersiyan-company-view"],
    ["/virtual?division=games#ersiyan-virtual-view", "/games"],
    ["/?division=virtual#studio", "/virtual"],
    ["/games?division=games#studio", "/games#studio"],
    ["/?division=company#unrelated", "/#unrelated"],
    ["/?division=games&next=https%3A%2F%2Fexample.com#unrelated", "/games?next=https%3A%2F%2Fexample.com#unrelated"],
  ];
  for (const [from, to] of cases) {
    assert.deepEqual(navigate(from), [["attribute", "data-division-redirect", ""], ["replace", to]], from);
    assert.deepEqual(navigate(to), [], "The selected destination does not redirect again");
  }
});

test("ordinary company, game, archive, and unknown fragment links remain visible and unchanged", () => {
  for (const path of [
    "/", "/?utm_source=games", "/#ersiyan-company-view", "/#business-info", "/#unrelated", "/#ERSIYAN-VIRTUAL-VIEW",
    "/games", "/games#games", "/games#studio", "/games#ersiyan-games-view", "/games#business-info",
    "/virtual", "/virtual?utm_source=virtual", "/virtual#ersiyan-virtual-view", "/virtual#business-info",
    "/mine-logic#games", "/velsien-summit#studio", "/velsien-summit#devlog-2026-08-late",
    "/velsien-summit/secret#ersiyan-virtual-view", "/privacy#ersiyan-virtual-view",
    "/?next=https%3A%2F%2Fexample.com#unrelated", "/?division=unknown", "/?division=GAMES",
    "/privacy?division=games", "/company?division=virtual",
  ]) assert.deepEqual(navigate(path), [], path);
});

test("the legacy redirect and its first-paint guard are installed in the document head", async () => {
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const head = layout.match(/<head>([\s\S]*?)<\/head>/)?.[1];
  assert.ok(head);
  assert.match(head, /html\[data-division-redirect\] body\{visibility:hidden\}/);
  assert.match(head, /id="legacy-division-route"[\s\S]*?__html:\s*legacyDivisionRouteScript/);
  assert.ok(layout.indexOf("</head>") < layout.indexOf("<body>"));
  assert.doesNotMatch(head, /\b(?:defer|async)=/);
});
