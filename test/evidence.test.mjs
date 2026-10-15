import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { gradeEvidence } from '../src/grade-evidence.mjs';

const root = new URL('../examples/evidence-boundary/', import.meta.url);
const read = (file) => fs.readFileSync(new URL(file, root), 'utf8');
const sources = new Map(['fixtures/study-note.md', 'fixtures/pilot-runs.json'].map((file) => [file, read(file)]));
const sample = (name) => JSON.parse(read('samples/' + name + '.json'));
const grade = (answer, texts = sources) => gradeEvidence(JSON.stringify(answer), texts);

test('task manifest binds the exact fictional fixture bytes', () => {
  const manifest = JSON.parse(read('task.json'));
  assert.equal(manifest.protocolVersion, '0.1');
  assert.equal(manifest.synthetic, true);
  for (const fixture of manifest.protocolFixtures) {
    const actual = crypto.createHash('sha256').update(fs.readFileSync(new URL(fixture.path, root))).digest('hex');
    assert.equal(actual, fixture.sha256);
  }
});

test('correct sample passes mechanics without receiving a human or overall score', () => {
  const r = grade(sample('correct'));
  assert.equal(r.autoScore, 30);
  assert.equal(r.mechanicalPass, true);
  assert.deepEqual(r.criticalQualityFlags, []);
  assert.equal(r.manualReview.score, null);
  assert.equal(r.reviewMax, 70);
  assert.equal('totalScore' in r, false);
});

test('wrong source facts lose points even when all quotes exist', () => {
  const r = grade(sample('wrong'));
  assert.equal(r.autoScore, 20);
  assert.equal(r.checks.citations, true);
  assert.equal(r.checks.fieldValues, false);
  assert.ok(r.criticalQualityFlags.includes('wrong-source-fact'));
});

test('a real but unrelated line is rejected for its assigned field', () => {
  const r = grade(sample('near-miss'));
  const citation = r.citations.find((c) => c.field === 'observations');
  assert.equal(r.autoScore, 20);
  assert.equal(citation.rangeValid, true);
  assert.equal(citation.quoteExact, true);
  assert.equal(citation.boundToField, false);
  assert.ok(r.criticalQualityFlags.includes('misbound-citation'));
});

test('a free-text scientific overclaim deliberately remains a human decision', () => {
  const r = grade(sample('overclaim'));
  assert.equal(r.autoScore, 30);
  assert.equal(r.mechanicalPass, true);
  assert.equal(r.manualReview.required, true);
  assert.equal(r.manualReview.score, null);
});

const mutations = [
  ['fabricated quote', (a) => { a.observations.citation.quote += ' invented'; }, 'citations'],
  ['unknown path', (a) => { a.configuration.citation.file = '../private/note.md'; }, 'citations'],
  ['out-of-range line', (a) => { a.observations.citation.end = 999; }, 'citations'],
  ['reversed range', (a) => { a.observations.citation.start = 9; }, 'citations'],
  ['missing citation', (a) => { delete a.configuration.citation; }, 'format'],
  ['wrong assumption', (a) => { a.configuration.assumptions[0] = 'variable-matrix'; }, 'fieldValues'],
  ['false measured status', (a) => { a.observations.kind = 'measured'; }, 'fieldValues'],
  ['missing uncertainty', (a) => { a.uncertainties = []; }, 'format'],
];
for (const [name, mutate, check] of mutations) {
  test('mutation: ' + name, () => {
    const answer = sample('correct');
    mutate(answer);
    const r = grade(answer);
    assert.equal(r.checks[check], false);
    assert.equal(r.mechanicalPass, false);
    assert.ok(r.autoScore < 30);
  });
}

test('malformed JSON and non-object answers fail safely', () => {
  for (const raw of ['{', 'null', '[]', '4', '"text"']) {
    const r = gradeEvidence(raw, sources);
    assert.equal(r.autoScore, 0);
    assert.equal(r.mechanicalPass, false);
  }
});

test('CRLF source and quote line endings are equivalent to LF', () => {
  const answer = sample('correct');
  for (const field of ['configuration', 'observations', 'source_limits']) {
    answer[field].citation.quote = answer[field].citation.quote.replaceAll('\n', '\r\n');
  }
  const crlf = new Map([...sources].map(([file, text]) => [file, text.replaceAll('\n', '\r\n')]));
  assert.equal(grade(answer, crlf).autoScore, 30);
});
