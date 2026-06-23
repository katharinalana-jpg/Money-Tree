#!/usr/bin/env node
/* =============================================================
   Money Tree — price-snapshot maintenance script.

   Reads data/securities.json and writes one end-of-day price
   snapshot per security to data/prices/<id>.json, in the shape
   documented in data/README.md. This is a LOCAL maintenance tool
   — it is never shipped to the browser. The site reads the static
   snapshots so it needs no API key and has no runtime rate limits.

   Usage (from repo root, Node 18+ for global fetch):
     TWELVE_DATA_API_KEY=xxxxx node scripts/fetch-prices.mjs
     TWELVE_DATA_API_KEY=xxxxx node scripts/fetch-prices.mjs --only stock-microsoft

   Notes
   - Free Twelve Data tiers are rate-limited (≈8 calls/min) and are
     strongest on US listings. Non-US tickers/ISINs may not resolve;
     those securities are skipped and keep their existing snapshot.
   - Data is delayed/EOD. Keep the "source" string for attribution.
   ============================================================= */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA = join(ROOT, "data");
const OUT = join(DATA, "prices");

const API_KEY = process.env.TWELVE_DATA_API_KEY;
const OUTPUTSIZE = 260;            // ~1 trading year of daily closes
const THROTTLE_MS = 8000;          // stay under free-tier ≈8 req/min
const SOURCE = "Twelve Data (EOD, delayed)";
const SOURCE_URL = "https://twelvedata.com";

const onlyArg = process.argv.indexOf("--only");
const ONLY = onlyArg > -1 ? process.argv[onlyArg + 1] : null;

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function fetchSeries(symbol) {
  const url = new URL("https://api.twelvedata.com/time_series");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", "1day");
  url.searchParams.set("outputsize", String(OUTPUTSIZE));
  url.searchParams.set("order", "ASC");
  url.searchParams.set("apikey", API_KEY);

  const res = await fetch(url);
  const body = await res.json();
  if (body.status === "error" || !Array.isArray(body.values)) {
    throw new Error(body.message || `no series for ${symbol}`);
  }
  return body.values.map((v) => ({ d: v.datetime, c: Number(Number(v.close).toFixed(2)) }));
}

async function main() {
  if (!API_KEY) {
    console.error("Missing TWELVE_DATA_API_KEY. See data/README.md.");
    process.exit(1);
  }

  const doc = JSON.parse(await readFile(join(DATA, "securities.json"), "utf8"));
  let securities = doc.securities;
  if (ONLY) securities = securities.filter((s) => s.id === ONLY);

  let ok = 0, skipped = 0;
  for (const s of securities) {
    const symbol = s.ticker || s.isin;
    if (!symbol) { console.warn(`- skip ${s.id}: no ticker/ISIN`); skipped++; continue; }

    try {
      const series = await fetchSeries(symbol);
      if (!series.length) throw new Error("empty series");
      const snapshot = {
        id: s.id,
        symbol,
        currency: s.currency,
        asOf: series[series.length - 1].d,
        source: SOURCE,
        sourceUrl: SOURCE_URL,
        placeholder: false,
        series
      };
      await writeFile(join(OUT, `${s.id}.json`), JSON.stringify(snapshot, null, 2) + "\n");
      console.log(`✓ ${s.id} (${symbol}) — ${series.length} points`);
      ok++;
    } catch (err) {
      console.warn(`- skip ${s.id} (${symbol}): ${err.message} — kept existing snapshot`);
      skipped++;
    }
    await sleep(THROTTLE_MS);
  }

  console.log(`\nDone. ${ok} updated, ${skipped} skipped.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
