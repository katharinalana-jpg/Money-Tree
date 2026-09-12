// node --test scripts/track.test.mjs — PRD 9 events, payload hygiene
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const createTracker = require("../track.js");

const make = () => createTracker({
  getSessionId: () => "8b1c2d3e-session-id",
  getScreen: () => "/quiz/values",
  getLocale: () => "de",
  now: () => "2026-09-12T10:00:00.000Z"
});

test("only PRD 9 event names are accepted", () => {
  const T = make();
  assert.equal(T.track("made_up_event", {}), null);
  assert.ok(T.track("values_selected", { sdg_ids: [5, 13], count: 2 }));
  assert.equal(T.events().length, 1);
  for (const name of ["session_start", "screen_view", "trap_card_flip", "glossary_open", "portfolio_complete", "plan_download"]) {
    assert.ok(T.EVENTS[name], name);
  }
});

test("every event carries a hashed session id, screen, locale and timestamp", () => {
  const T = make();
  const e = T.track("session_start");
  assert.equal(e.sessionId, T.hash("8b1c2d3e-session-id"));
  assert.notEqual(e.sessionId, "8b1c2d3e-session-id");
  assert.match(e.sessionId, /^[0-9a-f]{8}$/);
  assert.equal(e.screen, "/quiz/values");
  assert.equal(e.locale, "de");
  assert.equal(e.timestamp, "2026-09-12T10:00:00.000Z");
});

test("payload is whitelisted per event; e-mails and free text never pass", () => {
  const T = make();
  const e = T.track("product_add", { product_id: "etf-she", email: "a@b.cd", note: "free text" });
  assert.deepEqual(e.data, { product_id: "etf-she" });
  const f = T.track("share_action", { channel: "someone@example.com" });
  assert.equal(f.data.channel, null, "an e-mail-shaped value is dropped");
  const g = T.track("explore_filter_change", { filterType: "sdg", value: "x".repeat(200) });
  assert.equal(g.data.value.length, 64);
});

test("transport is a no-op by default and can be set later", () => {
  const T = make();
  const seen = [];
  T.track("screen_view", { screen: "/summary" });
  assert.equal(seen.length, 0);
  T.setTransport((ev) => seen.push(ev.name));
  T.track("summary_view");
  assert.deepEqual(seen, ["summary_view"]);
});
