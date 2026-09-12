#!/usr/bin/env node
/* =============================================================
   Portemonnaie — JSON Schema validation for data/*.json (PRD 10
   "Content-Pflege"). Zero dependencies (decision on conflict 15):
   a small validator for the schema subset used in data/*.schema.json
   (type incl. arrays of types, required, properties, additional-
   Properties, items, enum, minimum/maximum, minLength, pattern,
   minItems/maxItems, $ref to #/$defs/…).

   Usage:
     node scripts/validate-data.mjs            # every data/<name>.json with a schema
     node scripts/validate-data.mjs data/products.json
   Exit 1 on any violation. Errors break the build (PRD 10).
   ============================================================= */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, basename } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = resolve(HERE, "..", "data");

function typeOf(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (typeof v === "number") return Number.isInteger(v) ? "integer" : "number";
  return typeof v;
}
function typeMatches(want, v) {
  const t = typeOf(v);
  return want === t || (want === "number" && t === "integer");
}

export function validate(doc, schema, root = schema, path = "$", errors = []) {
  if (schema.$ref) {
    const target = schema.$ref.replace(/^#\//, "").split("/").reduce((o, k) => (o ? o[k] : undefined), root);
    if (!target) { errors.push(`${path}: unresolvable $ref ${schema.$ref}`); return errors; }
    return validate(doc, target, root, path, errors);
  }
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => typeMatches(t, doc))) { errors.push(`${path}: expected ${types.join("|")}, got ${typeOf(doc)}`); return errors; }
  }
  if (doc === null) return errors;
  if (schema.enum && !schema.enum.includes(doc)) errors.push(`${path}: "${doc}" not in enum [${schema.enum.join(", ")}]`);
  if (typeof doc === "string") {
    if (schema.minLength != null && doc.length < schema.minLength) errors.push(`${path}: shorter than ${schema.minLength}`);
    if (schema.pattern && !new RegExp(schema.pattern).test(doc)) errors.push(`${path}: "${doc}" does not match ${schema.pattern}`);
  }
  if (typeof doc === "number") {
    if (schema.minimum != null && doc < schema.minimum) errors.push(`${path}: ${doc} < ${schema.minimum}`);
    if (schema.maximum != null && doc > schema.maximum) errors.push(`${path}: ${doc} > ${schema.maximum}`);
  }
  if (Array.isArray(doc)) {
    if (schema.minItems != null && doc.length < schema.minItems) errors.push(`${path}: fewer than ${schema.minItems} items`);
    if (schema.maxItems != null && doc.length > schema.maxItems) errors.push(`${path}: more than ${schema.maxItems} items`);
    if (schema.items) doc.forEach((item, i) => validate(item, schema.items, root, `${path}[${i}]`, errors));
  }
  if (typeOf(doc) === "object") {
    (schema.required || []).forEach((k) => { if (!(k in doc)) errors.push(`${path}: missing required "${k}"`); });
    const props = schema.properties || {};
    for (const [k, v] of Object.entries(doc)) {
      if (props[k]) validate(v, props[k], root, `${path}.${k}`, errors);
      else if (schema.additionalProperties === false) errors.push(`${path}: unexpected property "${k}"`);
    }
  }
  return errors;
}

export function validateFile(dataFile, schemaFile) {
  const doc = JSON.parse(readFileSync(dataFile, "utf8"));
  const schema = JSON.parse(readFileSync(schemaFile, "utf8"));
  const errors = validate(doc, schema);
  // uniqueness of ids where a list of records exists
  const list = doc.products || doc.terms || doc.sdgs || doc.partners;
  if (Array.isArray(list)) {
    const seen = new Set();
    list.forEach((r, i) => { if (seen.has(r.id)) errors.push(`$[${i}]: duplicate id "${r.id}"`); seen.add(r.id); });
  }
  return errors;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  const files = args.length ? args.map((f) => resolve(f)) :
    readdirSync(DATA).filter((f) => /^[a-z]+\.json$/.test(f)).map((f) => resolve(DATA, f));
  let total = 0, checked = 0;
  for (const file of files) {
    const schema = resolve(DATA, basename(file, ".json") + ".schema.json");
    if (!existsSync(schema)) { console.log(`${basename(file)}: no schema, skipped`); continue; }
    const errors = validateFile(file, schema);
    checked++; total += errors.length;
    console.log(`${basename(file)}: ${errors.length ? errors.length + " error(s)" : "valid"}`);
    errors.slice(0, 50).forEach((e) => console.log("  " + e));
  }
  if (!checked) { console.error("no data file with a schema found"); process.exit(1); }
  process.exit(total ? 1 : 0);
}
