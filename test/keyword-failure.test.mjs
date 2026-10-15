import test from 'node:test';
import assert from 'node:assert/strict';
import {check} from '../examples/keyword-grader-failure/check.mjs';

test('retained keyword grader gives full marks to a response with empty analyses', () => {
  const quote = '12 11 0.91 0.82 320 450 9月2日 早于 9月3日 RAG 检索增强生成 同一概念';
  const response = {issues: Array.from({length: 5}, () => ({quote, problem: '', fix: ''}))};
  assert.equal(check(JSON.stringify(response)).score, 100);
});
