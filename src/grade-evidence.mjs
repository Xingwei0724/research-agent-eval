// Mechanical checks for the original synthetic example; no mathematical prose judge.
export const graderVersion = 'synthetic-evidence-boundary-v1';
const object = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const rules = {
  configuration: { file: 'fixtures/study-note.md', start: 4, end: 5 },
  observations: { file: 'fixtures/pilot-runs.json', start: 6, end: 8 },
  source_limits: { file: 'fixtures/study-note.md', start: 6, end: 7 },
};
const allowedFiles = new Set(Object.values(rules).map((rule) => rule.file));
const note = 'Automatic points check controlled facts and citations only. Free prose, scientific scope, and evidential support require human review; no overall score is computed.';

function result(autoScore, checks, formatErrors, criticalQualityFlags, citations) {
  return {
    graderVersion, autoScore, autoMax: 30, reviewMax: 70,
    mechanicalPass: Object.values(checks).every(Boolean),
    checks, formatErrors, criticalQualityFlags, citations,
    manualReview: { required: true, score: null, max: 70, rubric: 'examples/evidence-boundary/rubric.json' },
    note,
  };
}

/** raw is a JSON string; sources is a Map of allowlisted relative paths to text. */
export function gradeEvidence(raw, sources) {
  let answer;
  try { answer = JSON.parse(raw); } catch {
    return result(0, { format: false, fieldValues: false, citations: false }, ['invalid-json'], ['invalid-json'], []);
  }
  if (!object(answer)) {
    return result(0, { format: false, fieldValues: false, citations: false }, ['answer-not-object'], ['invalid-json'], []);
  }
  const errors = [];
  for (const field of Object.keys(rules)) {
    if (!object(answer[field]) || !object(answer[field].citation)) errors.push(field + ': object and citation required');
  }
  if (!['supported', 'partially-supported', 'not-established'].includes(answer.claim_assessment)) errors.push('claim_assessment');
  if (typeof answer.conclusion !== 'string' || !answer.conclusion.trim()) errors.push('conclusion');
  if (!Array.isArray(answer.uncertainties) || !answer.uncertainties.length ||
      answer.uncertainties.some((x) => typeof x !== 'string' || !x.trim())) errors.push('uncertainties');
  const fieldChecks = {
    configuration: answer.configuration?.method === 'Example-J' &&
      answer.configuration?.tolerance === 0.000001 &&
      same(answer.configuration?.assumptions, ['fixed-matrix-per-run', 'zero-initial-guess']),
    observations: answer.observations?.kind === 'synthetic' &&
      same(answer.observations?.sizes, [8, 16, 32]) && same(answer.observations?.iterations, [3, 3, 4]),
    source_limits: answer.source_limits?.uniform_bound === 'not-established' &&
      answer.source_limits?.parallel_scaling === 'not-measured',
  };
  const citations = Object.entries(rules).map(([field, rule]) => {
    const citation = answer[field]?.citation;
    const text = allowedFiles.has(citation?.file) && sources instanceof Map ? sources.get(citation.file) : undefined;
    const lines = typeof text === 'string' ? text.split(/\r?\n/) : [];
    const rangeValid = object(citation) && typeof text === 'string' &&
      Number.isInteger(citation.start) && Number.isInteger(citation.end) &&
      citation.start >= 1 && citation.end >= citation.start && citation.end <= lines.length;
    const quoteExact = Boolean(rangeValid && typeof citation.quote === 'string' &&
      citation.quote.replaceAll('\r\n', '\n') === lines.slice(citation.start - 1, citation.end).join('\n'));
    const boundToField = Boolean(rangeValid && citation.file === rule.file &&
      citation.start <= rule.start && citation.end >= rule.end);
    return { field, file: citation?.file ?? null, rangeValid: Boolean(rangeValid), quoteExact, boundToField };
  });
  const checks = {
    format: errors.length === 0,
    fieldValues: Object.values(fieldChecks).every(Boolean),
    citations: citations.every((c) => c.quoteExact && c.boundToField),
  };
  const flags = [];
  if (!checks.fieldValues) flags.push('wrong-source-fact');
  if (citations.some((c) => !c.quoteExact)) flags.push('invalid-citation');
  if (citations.some((c) => c.quoteExact && !c.boundToField)) flags.push('misbound-citation');
  const autoScore = (checks.format ? 5 : 0) +
    Object.values(fieldChecks).filter(Boolean).length * 5 + (checks.citations ? 10 : 0);
  return result(autoScore, checks, errors, flags, citations);
}
