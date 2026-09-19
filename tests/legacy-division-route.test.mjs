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

test("legacy division links preserve campaign parameters and replace history before showing the wrong division", () => {
  const cases = [
    ["/#ersiyan-virtual-view", "/virtual"],
    ["/?utm_source=virtual&utm_content=%ED%95%9C%EA%B8%80#ersiyan-virtual-view", "/virtual?utm_source=virtual&utm_content=%ED%95%9C%EA%B8%80"],
    ["/virtual#ersiyan-games-view", "/"],
    ["/virtual?utm_source=games&tag=one&tag=two#ersiyan-games-view", "/?utm_source=games&tag=one&tag=two"],
    ["/virtual?utm_source=link#games", "/?utm_source=link#games"],
    ["/virtual?utm_source=link#studio", "/?utm_source=link#studio"],
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

test("ordinary company, game, archive, and unknown fragment links remain visible and unchanged", () => {
  for (const path of [
    "/", "/?utm_source=games", "/#games", "/#studio", "/#ersiyan-games-view",
    "/#ersiyan-company-view", "/#business-info", "/#unrelated", "/#ERSIYAN-VIRTUAL-VIEW",
    "/virtual", "/virtual?utm_source=virtual", "/virtual#ersiyan-virtual-view",
    "/virtual#ersiyan-company-view", "/virtual#business-info",
    "/mine-logic#games", "/velsien-summit#studio", "/velsien-summit/late-update#ersiyan-virtual-view",
    "/velsien-summit/secret#ersiyan-virtual-view", "/privacy#ersiyan-virtual-view",
    "/?next=https%3A%2F%2Fexample.com#unrelated",
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
