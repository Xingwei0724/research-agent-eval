#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {gradeEvidence} from '../src/grade-evidence.mjs';
import {check as keywordCheck} from '../examples/keyword-grader-failure/check.mjs';
import {createToolbox, instrument} from '../configuration/toolbox.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const taskDir = path.join(root, 'examples/evidence-boundary');
const task = JSON.parse(fs.readFileSync(path.join(taskDir, 'task.json'), 'utf8'));
const sources = new Map(task.protocolFixtures.map(f => [f.path, fs.readFileSync(path.join(taskDir, f.path), 'utf8')]));
const tokens = '12 11 0.91 0.82 320 450 9月2日 早于 9月3日 RAG 检索增强生成 同一概念';
const emptyAnalysis = {issues: Array.from({length: 5}, () => ({quote: tokens, problem: '', fix: ''}))};
const failedGrade = keywordCheck(JSON.stringify(emptyAnalysis));
assert.equal(failedGrade.score, 100);
console.log(`Keyword failure: ${failedGrade.score}/${failedGrade.max} despite empty problem/fix fields.`);

for (const name of fs.readdirSync(path.join(taskDir, 'samples')).filter(n => n.endsWith('.json')).sort()) {
  const grade = gradeEvidence(fs.readFileSync(path.join(taskDir, 'samples', name), 'utf8'), sources);
  console.log(JSON.stringify({sample: name, autoScore: grade.autoScore, autoMax: grade.autoMax,
    reviewMax: grade.reviewMax, criticalQualityFlags: grade.criticalQualityFlags}));
}

const tools = instrument(createToolbox(path.join(taskDir, 'fixtures')));
tools.invoke('listFiles', ['.'], 'Locate the synthetic source materials');
for (const fixture of task.protocolFixtures) {
  const name = path.basename(fixture.path);
  tools.invoke('searchText', [name, 'scope|condition|observ|limit|run|grid'], 'Locate scope and observation statements');
  tools.invoke('readFile', [name, 1, 40], 'Read the source with numbered lines');
}
const outputDir = path.join(root, 'output');
fs.mkdirSync(outputDir, {recursive: true});
fs.writeFileSync(path.join(outputDir, 'demo-trace.json'), JSON.stringify({
  traceVersion: '0.1',
  provenance: 'scripted-local-demo',
  task: task.id,
  model: null,
  inputFixtures: task.protocolFixtures,
  calls: tools.calls,
  interpretation: 'Operations were chosen by this script. This does not evaluate agent planning or tool selection.'
}, null, 2) + '\n');
assert.ok(tools.calls.every(c => c.ok));
console.log('Wrote output/demo-trace.json (scripted local demo; no model evaluated).');
