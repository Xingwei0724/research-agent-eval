import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createToolbox, instrument} from '../configuration/toolbox.mjs';

test('toolbox records evidence reads and rejected requests', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'research-agent-eval-'));
  t.after(() => fs.rmSync(temp, {recursive: true, force: true}));
  const root = path.join(temp, 'visible');
  fs.mkdirSync(root);
  fs.writeFileSync(path.join(root, 'note.txt'), 'Scope: finite observations.\nNo theorem is established.\n');
  fs.writeFileSync(path.join(temp, 'outside.txt'), 'outside');
  const tools = createToolbox(root);
  assert.equal(tools.listFiles().length, 1);
  assert.deepEqual(tools.searchText('note.txt', 'scope'), [{line: 1, text: 'Scope: finite observations.'}]);
  assert.throws(() => tools.readFile('../outside.txt'), /outside/);
  assert.throws(() => tools.readFile(path.join(root, 'note.txt')), /relative/);
  assert.throws(() => tools.readFile('note.txt', 0, 1), /range/);
  const trace = instrument(tools);
  assert.equal(trace.invoke('readFile', ['note.txt', 1, 2], 'Check claim scope').ok, true);
  assert.equal(trace.invoke('readFile', ['../outside.txt'], 'Boundary check').ok, false);
  assert.deepEqual(trace.calls.map(c => c.seq), [1, 2]);
  assert.equal(trace.calls[0].resultSha256.length, 64);
  assert.equal(trace.calls[1].ok, false);
});
