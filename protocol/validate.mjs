#!/usr/bin/env node
// Adapted from the prototype's Task Protocol v0 validator for portable examples.
// This is a targeted structural/provenance check, not a full JSON Schema engine.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const schema = JSON.parse(fs.readFileSync(path.join(root, 'protocol/task-schema.json'), 'utf8'));
const errors = [];
let checked = 0;
const nonemptyStrings = value => Array.isArray(value) && value.length > 0 && value.every(s => typeof s === 'string' && s.trim());
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

function validateTask(dir) {
  const taskFile = path.join(dir, 'task.json');
  if (!fs.existsSync(taskFile)) return;
  checked++;
  const t = JSON.parse(fs.readFileSync(taskFile, 'utf8'));
  const fail = message => errors.push(`${t.id ?? path.basename(dir)}: ${message}`);
  for (const key of schema.required) if (!(key in t)) fail(`missing ${key}`);
  if (t.protocolVersion !== '0.1') fail('protocolVersion must be 0.1');
  if (!schema.properties.status.enum.includes(t.status)) fail('invalid status');
  if (!/^[a-z0-9][a-z0-9-]*$/.test(t.id ?? '')) fail('invalid id');
  for (const key of ['title']) if (typeof t[key] !== 'string' || !t[key].trim()) fail(`invalid ${key}`);
  for (const key of ['capabilityTags', 'domainTags', 'evaluationLayers', 'workflowSteps']) if (!nonemptyStrings(t[key])) fail(`${key} must contain strings`);
  for (const layer of t.evaluationLayers ?? []) if (!['model', 'configuration'].includes(layer)) fail(`invalid layer ${layer}`);
  if ((t.workflowSteps ?? []).length < 2) fail('at least two workflow steps required');
  for (const step of t.workflowSteps ?? []) if (!schema.properties.workflowSteps.items.enum.includes(step)) fail(`invalid step ${step}`);
  if (!Array.isArray(t.protocolFixtures) || !t.protocolFixtures.length) fail('fixtures required');
  const fixturePaths = new Set();
  for (const f of t.protocolFixtures ?? []) {
    if (typeof f.path !== 'string' || path.isAbsolute(f.path)) { fail('fixture path must be relative'); continue; }
    const full = path.resolve(dir, f.path);
    const relative = path.relative(dir, full);
    if (relative.startsWith('..') || path.isAbsolute(relative)) { fail('fixture escapes task'); continue; }
    fixturePaths.add(f.path);
    if (!fs.existsSync(full) || !fs.statSync(full).isFile()) { fail(`missing fixture ${f.path}`); continue; }
    const realRelative = path.relative(fs.realpathSync(dir), fs.realpathSync(full));
    if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) { fail('fixture symlink escapes task'); continue; }
    if (!/^[a-f0-9]{64}$/.test(f.sha256 ?? '') || sha256(full) !== f.sha256) fail(`hash mismatch: ${f.path}`);
    if (typeof f.role !== 'string' || !f.role.trim()) fail('fixture role required');
  }
  if (!Array.isArray(t.sourceEvidence) || !t.sourceEvidence.length) fail('sourceEvidence required');
  for (const e of t.sourceEvidence ?? []) {
    if (!fixturePaths.has(e.fixture)) fail(`unknown evidence fixture ${e.fixture}`);
    if (!e.location || !e.claim) fail('evidence location and claim required');
  }
  for (const key of ['automatic', 'human', 'hardFailures']) if (!Array.isArray(t.scoring?.[key])) fail(`missing scoring.${key}`);
  if (!nonemptyStrings(t.outputSchema?.required)) fail('outputSchema.required must contain strings');
}

for (const dir of fs.readdirSync(path.join(root, 'examples'), { withFileTypes: true }).filter(e => e.isDirectory())) validateTask(path.join(root, 'examples', dir.name));
if (!checked) errors.push('no protocol tasks found');
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`TASK_PROTOCOL_OK: ${checked} public example(s), fixture hashes verified`);
