// Portable adaptation of the prototype's read-only list/search/read toolbox.
// The path checks help isolate fixtures; this is not an OS security sandbox.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export function createToolbox(root) {
  const base = fs.realpathSync(root);
  const inside = full => { const rel = path.relative(base, full); return rel !== '..' && !rel.startsWith('..' + path.sep) && !path.isAbsolute(rel); };
  const safe = rel => {
    if (typeof rel !== 'string' || path.isAbsolute(rel)) throw new Error('use a relative fixture path');
    const full = path.resolve(base, rel);
    if (!inside(full)) throw new Error('path outside visible root');
    const real = fs.realpathSync(full);
    if (!inside(real)) throw new Error('symlink outside visible root');
    return real;
  };
  const lines = rel => fs.readFileSync(safe(rel), 'utf8').split(/\r?\n/);
  return {
    listFiles(rel = '.') {
      return fs.readdirSync(safe(rel), { withFileTypes: true }).map(e => ({name: e.name, type: e.isDirectory() ? 'directory' : 'file'}));
    },
    searchText(rel, pattern) {
      const regex = new RegExp(pattern, 'i');
      return lines(rel).flatMap((text, i) => regex.test(text) ? [{line: i + 1, text}] : []);
    },
    readFile(rel, start = 1, end = start + 40) {
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) throw new Error('invalid line range');
      return lines(rel).slice(start - 1, end).map((text, i) => ({line: start + i, text}));
    }
  };
}

export function instrument(toolbox) {
  const calls = [];
  const invoke = (operation, args, purpose) => {
    if (!['listFiles', 'searchText', 'readFile'].includes(operation)) throw new Error('unknown operation');
    if (!purpose || !Array.isArray(args)) throw new Error('args and purpose required');
    let result;
    try { result = {ok: true, value: toolbox[operation](...args)}; }
    catch (error) { result = {ok: false, error: error.message}; }
    calls.push({seq: calls.length + 1, operation, args, purpose, ...result,
      resultSha256: crypto.createHash('sha256').update(JSON.stringify(result)).digest('hex')});
    return result;
  };
  return {invoke, calls};
}
