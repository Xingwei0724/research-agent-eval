#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {gradeEvidence} from '../src/grade-evidence.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const taskDir = path.join(root, 'examples/evidence-boundary');
const task = JSON.parse(fs.readFileSync(path.join(taskDir, 'task.json'), 'utf8'));
const responseFile = process.argv[2];
if (!responseFile) {
  console.error('Usage: node scripts/grade.mjs <response.json>');
  process.exit(2);
}
const sources = new Map(task.protocolFixtures.map(f => [f.path, fs.readFileSync(path.join(taskDir, f.path), 'utf8')]));
const raw = fs.readFileSync(path.resolve(responseFile), 'utf8');
const grade = gradeEvidence(raw, sources);
console.log(JSON.stringify({
  task: task.id,
  responseSha256: crypto.createHash('sha256').update(raw).digest('hex'),
  ...grade,
  interpretation: 'Local automatic evidence checks only. Human review points are unassigned.'
}, null, 2));
// An incorrect answer is a quality result, not a failed transport to be dropped.
