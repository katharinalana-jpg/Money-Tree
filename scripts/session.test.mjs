// node --test scripts/session.test.mjs — PRD 5.4 / 7.1 session rules
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const createSession = require("../session.js");

const DAY = 24 * 60 * 60 * 1000;
function fakeStorage() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) };
}
function make(startMs) {
  let clock = startMs;
  const S = createSession({ storage: fakeStorage(), now: () => clock });
  return { S, advance: (ms) => { clock += ms; } };
}

test("create writes a schema 7.1 session with referrer and every input persists", () => {
  const { S } = make(Date.parse("2026-09-12T10:00:00Z"));
  const s = S.create({ locale: "de", referrer: "abc123" });
  assert.equal(s.schemaVersion, 1);
  assert.equal(s.lastScreen, "/quiz/traps");
  assert.equal(s.referrer, "abc123");
  assert.deepEqual(Object.keys(s.situation), ["monthlyRange", "monthlyAmount", "horizon"]);
  S.update({ values: { sdgs: [5, 13] } });
  S.update({ situation: { horizon: "over_10y" } });
  const r = S.read();
  assert.deepEqual(r.values.sdgs, [5, 13]);
  assert.equal(r.situation.horizon, "over_10y");
  assert.equal(r.situation.monthlyRange, null, "merge keeps sibling fields");
});

test("expiry: valid on day 30, discarded after 30 days", () => {
  const { S, advance } = make(Date.parse("2026-09-12T10:00:00Z"));
  S.create();
  advance(30 * DAY);
  assert.ok(S.isValid(S.read()));
  assert.ok(S.current());
  advance(1);
  assert.equal(S.isValid(S.read()), false);
  assert.equal(S.current(), null);
  assert.equal(S.update({ values: { sdgs: [1] } }), null, "no writes into an expired session");
});

test("schema mismatch: an old schemaVersion is not valid and is replaced on create", () => {
  const { S } = make(Date.now());
  S.write({ schemaVersion: 0, sessionId: "old", startedAt: new Date().toISOString(), lastScreen: "/explore", values: { sdgs: [1, 2] } });
  assert.equal(S.isValid(S.read()), false);
  assert.equal(S.current(), null);
  const fresh = S.create();
  assert.equal(fresh.schemaVersion, 1);
  assert.notEqual(fresh.sessionId, "old");
  assert.deepEqual(fresh.values.sdgs, []);
});

test("back navigation keeps values", () => {
  const { S } = make(Date.now());
  S.create();
  S.setScreen("/quiz/values");
  S.update({ values: { sdgs: [5, 13, 4] }, situation: { monthlyRange: "50_150", horizon: "3_10y" } });
  S.setScreen("/summary");
  S.setScreen("/quiz/values");   // back
  S.setScreen("/quiz/situation"); // further back
  const s = S.read();
  assert.deepEqual(s.values.sdgs, [5, 13, 4]);
  assert.equal(s.situation.monthlyRange, "50_150");
  assert.equal(s.situation.horizon, "3_10y");
  assert.equal(s.lastScreen, "/quiz/situation");
});

test("reset is explicit and clears everything", () => {
  const { S } = make(Date.now());
  S.create();
  S.update({ values: { sdgs: [7] } });
  S.reset();
  assert.equal(S.read(), null);
});

test("stages and reached index follow the routes decision", () => {
  const { S } = make(Date.now());
  assert.equal(S.pageFor("/quiz/values"), "quiz.html");
  assert.equal(S.pageFor("/summary"), "summary.html");
  assert.equal(S.pageFor("/explore"), "explore.html");
  assert.equal(S.pageFor("/portfolio"), "portfolio.html");
  assert.equal(S.quizStepIndex("/quiz/values"), 5);
  assert.equal(S.quizStepIndex("/quiz/traps"), 0);
  const s = S.create();
  assert.equal(S.reachedIndex(s), 0);
  S.update({ values: { sdgs: [1] } });
  assert.equal(S.reachedIndex(S.read()), 1, "quiz answered → summary reachable");
  S.setScreen("/explore");
  assert.equal(S.reachedIndex(S.read()), 2);
  S.update({ portfolio: { items: [{ productId: "a", weight: 100 }] } });
  assert.equal(S.reachedIndex(S.read()), 3);
});
