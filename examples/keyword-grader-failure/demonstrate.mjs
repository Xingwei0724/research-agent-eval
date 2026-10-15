import assert from 'node:assert/strict';
import {check} from './check.mjs';

const tokens = '12 11 0.91 0.82 320 450 9月2日 早于 9月3日 RAG 检索增强生成 同一概念';
const response = {issues: Array.from({length: 5}, () => ({quote: tokens, problem: '', fix: ''}))};
const result = check(JSON.stringify(response));
assert.equal(result.score, 100);
console.log(JSON.stringify({
  example: 'keyword-grader-failure',
  score: result.score,
  max: result.max,
  actualAnalysis: 'Missing: all problem and fix fields are empty.',
  interpretation: 'A local grader failure demonstration; no model was evaluated.'
}, null, 2));
