// 깨진 마크업 정밀 스캔 v2 — 괄호 워커(1단 중첩 허용)
const fs = require('fs'), path = require('path');
const DEV = '/tmp/PF2e-publish/dev';
const OUT = process.env.PF2E_AUDIT_DIR || '/tmp/pf2e-audit';
const PAY = path.join(OUT, 'payload');
// 기존 repair_006 이상 제거(오탐 재생성분)
for (const f of fs.readdirSync(PAY)) { const m = f.match(/^repair_(\d+)\.json$/); if (m && +m[1] >= 6) fs.unlinkSync(path.join(PAY, f)); }

function scanBad(s) {
  const bad = [];
  // @X[ ... ] 골격 검사: 여는 [ 후 중첩 허용 워커
  for (const m of s.matchAll(/@([A-Za-z]{2,12})\[/g)) {
    let depth = 1, i = m.index + m[0].length, steps = 0;
    while (i < s.length && depth > 0 && steps < 800) {
      const c = s[i];
      if (c === '[') depth++; else if (c === ']') depth--;
      i++; steps++;
    }
    if (depth > 0) { bad.push('truncated-@' + m[1] + ':' + s.slice(m.index, m.index + 70)); continue; }
    // 라벨 { 검사: ]{ 로 이어지면 닫는 } 존재 확인
    if (s[i] === '{') {
      const close = s.indexOf('}', i);
      if (close === -1 || close - i > 400) bad.push('unclosed-label:' + s.slice(m.index, m.index + 70));
    }
  }
  // 고아 Compendium 경로(@UUID/@Embed 밖 노출) — 단 "UUID[" 직전 제외
  for (const m of s.matchAll(/Compendium\.pf2e\.[a-z-]+\.(?:Item|Actor|JournalEntry)\.\w{6,}/g)) {
    const pre = s.slice(Math.max(0, m.index - 14), m.index);
    if (!/@(UUID|Embed)\[$/.test(pre)) bad.push('orphan-compendium:' + m[0].slice(0, 60));
  }
  // 고아 롤매크로 잘림: "[[/" 후 "]]" 없음
  for (const m of s.matchAll(/\[\[\//g)) {
    const rest = s.slice(m.index, m.index + 600);
    if (!/\]\]/.test(rest)) bad.push('truncated-roll:' + rest.slice(0, 60));
  }
  return bad;
}
const badRows = [];
for (const f of fs.readdirSync(path.join(DEV, 'data/overlay'))) {
  if (!/\.ko\.json$/.test(f)) continue;
  const j = JSON.parse(fs.readFileSync(path.join(DEV, 'data/overlay', f), 'utf8'));
  const cat = f.replace('.ko.json', '');
  for (const slug in j) {
    const bad = scanBad(JSON.stringify(j[slug]));
    if (bad.length) badRows.push({ kind: 'markup', cat, slug, problems: [...new Set(bad)].slice(0, 6), excerpt: JSON.stringify(j[slug]).slice(0, 2500) });
  }
}
const CRE_DIR = path.join(DEV, 'data/creatures');
for (const f of fs.readdirSync(CRE_DIR)) {
  if (!/\.ko\.json$/.test(f) || f.startsWith('_')) continue;
  const j = JSON.parse(fs.readFileSync(path.join(CRE_DIR, f), 'utf8'));
  const ent = j.entries || j;
  for (const key in ent) {
    const bad = scanBad(JSON.stringify(ent[key]));
    if (bad.length) badRows.push({ kind: 'markup-creature', file: f, key, problems: [...new Set(bad)].slice(0, 6) });
  }
}
console.log('malformed entities:', badRows.length);
const byP = {};
for (const r of badRows) for (const p of r.problems) byP[p.split(':')[0]] = (byP[p.split(':')[0]] || 0) + 1;
console.log(byP);
badRows.slice(0, 15).forEach(r => console.log(' ', r.cat || r.file, r.slug || r.key, r.problems.join(' | ').slice(0, 150)));
// repair 배치로 기록 (있다면)
const LIMIT = 55 * 1024;
let batch = [], size = 2, n = 6;
const flush = () => { if (!batch.length) return; fs.writeFileSync(path.join(PAY, `repair_${String(n).padStart(3, '0')}.json`), JSON.stringify(batch)); n++; batch = []; size = 2; };
for (const r of badRows) { const s = JSON.stringify(r).length + 1; if (size + s > LIMIT && batch.length) flush(); batch.push(r); size += s; }
flush();
console.log(JSON.stringify({ repairEnd: n }));
