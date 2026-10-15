/**
 * t3 自动判分：5 处埋设的矛盾，逐条关键词判定。
 *
 * 答案键：
 *   1. 篇数加总：12 篇 vs 5+4+2=11 篇
 *   2. 召回率：说「下降到 0.91」，但 0.91 > 0.82，实为上升
 *   3. 耗时：说「从 320 ms 优化到 0.45 s」，0.45 s = 450 ms 反而更慢
 *   4. 日期时序：9 月 3 日的会上决定「9 月 2 日」再开会（早于当天）
 *   5. 术语：RAG 就是「检索增强生成」的缩写，不是两套不同路线
 */

const KEY = [
  { label: '篇数加总不符（12 vs 11）', re: /(12|十二)[\s\S]{0,40}(11|十一)|(11|十一)[\s\S]{0,40}(12|十二)|加总|合计|总和不|分项之和不|数目不符/ },
  { label: '召回率说反了（0.91 > 0.82 不是下降）', re: /0\.91[\s\S]{0,60}(0\.82|上升|提高|更[高低]|不是下降|并非下降)|(下降|降低)[\s\S]{0,60}0\.91/ },
  { label: '耗时矛盾（0.45s = 450ms 比 320ms 更慢）', re: /0\.45\s*s?[\s\S]{0,60}(450|更慢|变慢|反而|不叫优化|不是优化)|(320|450)/ },
  { label: '日期时序倒置（9月3日决定9月2日开会）', re: /9\s*月\s*2\s*日[\s\S]{0,60}(9\s*月\s*3\s*日|早于|之前|已经过去|时序|倒置|提前)|(早于|之前|时序|倒置)/ },
  { label: '术语错误（RAG 即检索增强生成）', re: /RAG[\s\S]{0,80}(检索增强生成|同一个|同一概念|缩写|全称|同一事物)|(检索增强生成)[\s\S]{0,80}(同一个|同一概念|缩写|全称)/ },
];

function parseJsonLoose(text) {
  const t = (text ?? '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(t); } catch {}
  const m = t.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch {} }
  return null;
}

export function check(text) {
  const details = [];
  let score = 0;
  const add = (pt, label, ok) => { if (ok) score += pt; details.push(`${ok ? '✓' : '✗'} ${label} (${ok ? '+' + pt : '+0'})`); };

  const data = parseJsonLoose(text);
  add(5, '输出是合法 JSON（去围栏后能解析）', Boolean(data));
  if (!data) return { score, max: 100, details, note: '无法解析 JSON，无法继续判分' };

  const issues = Array.isArray(data.issues) ? data.issues : [];
  add(5, `恰好给出 5 条（实际 ${issues.length} 条）`, issues.length === 5);

  const hay = issues.map((i) => `${i?.quote ?? ''} ${i?.problem ?? ''} ${i?.fix ?? ''}`).join('\n');
  for (const k of KEY) add(18, k.label, k.re.test(hay));

  return { score, max: 100, details, note: `模型给出 ${issues.length} 条（正确答案 5 条）` };
}
