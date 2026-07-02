// 크리처 payload v2: 영문 원문 포함 재생성 + 깨진 마크업 기계 스캔 → 추가 repair 배치
const fs = require('fs'), path = require('path');
const DEV = '/tmp/PF2e-publish/dev';
const OUT = process.env.PF2E_AUDIT_DIR || '/tmp/pf2e-audit';
const PAY = path.join(OUT, 'payload');
const CRE_DIR = path.join(DEV, 'data/creatures');
const broken = JSON.parse(fs.readFileSync(path.join(OUT, 'broken_entities.json'), 'utf8'));

// ── 기존 creatures_*.json 제거 ──
for (const f of fs.readdirSync(PAY)) if (/^creatures_\d+\.json$/.test(f)) fs.unlinkSync(path.join(PAY, f));

const LIMIT = 72 * 1024;
function writeBatches(prefix, rows, startIdx = 0, limit = LIMIT) {
  let batch = [], size = 2, n = startIdx;
  const flush = () => { if (!batch.length) return; fs.writeFileSync(path.join(PAY, `${prefix}_${String(n).padStart(3, '0')}.json`), JSON.stringify(batch)); n++; batch = []; size = 2; };
  for (const r of rows) { const s = JSON.stringify(r).length + 1; if (size + s > limit && batch.length) flush(); batch.push(r); size += s; }
  flush();
  return n;
}

// ── 크리처: ko + en 원문 ──
const creRows = [];
for (const f of fs.readdirSync(CRE_DIR)) {
  if (!/\.ko\.json$/.test(f) || f.startsWith('_')) continue;
  const j = JSON.parse(fs.readFileSync(path.join(CRE_DIR, f), 'utf8'));
  const ent = j.entries || j;
  const bset = new Set(broken['creatures/' + f] || []);
  const baseF = path.join(CRE_DIR, f.replace('.ko.json', '.base.json'));
  let baseIdx = {};
  if (fs.existsSync(baseF)) { const b = JSON.parse(fs.readFileSync(baseF, 'utf8')); for (const doc of (Array.isArray(b) ? b : Object.values(b))) baseIdx[doc.name] = doc; }
  for (const key in ent) {
    if (bset.has(key)) continue;
    const bd = baseIdx[key];
    const en = {};
    if (bd) {
      en.description = (bd.system && bd.system.details && (bd.system.details.publicNotes || bd.system.details.blurb)) || '';
      if (ent[key].items && bd.items) {
        en.items = {};
        for (const islug in ent[key].items) {
          const bi = bd.items.find(x => (x.system && x.system.slug) === islug || (x.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === islug);
          if (bi) en.items[islug] = { name: bi.name, description: (bi.system && bi.system.description && bi.system.description.value) || '' };
        }
      }
    }
    creRows.push({ file: f, key, data: ent[key], en });
  }
}
const creCount = writeBatches('creatures', creRows);

// ── 깨진 마크업 기계 스캔(전 overlay+크리처): @UUID 골격 손상·중괄호 불균형·고아 Compendium 파편 ──
function scanBad(s) {
  const bad = [];
  // @UUID 골격이 잘렸거나(] 없음) 라벨 중괄호 불균형
  for (const m of s.matchAll(/@UUID\[[^\]]*$/gm)) bad.push('truncated-uuid');
  // @X[..]{라벨 없는 고아 중괄호 조각: "]{" 앞에 @표현식 아닌 경우
  for (const m of s.matchAll(/(?<!@[A-Za-z]{1,12}\[[^\[\]]{0,200}\])\]\{/g)) { }
  // 고아 Compendium 경로(@UUID 밖에 노출)
  for (const m of s.matchAll(/(?<!@UUID\[)Compendium\.pf2e\.[a-z-]+\.Item\.\w+/g)) {
    const i = m.index; const pre = s.slice(Math.max(0, i - 7), i);
    if (!/@UUID\[$/.test(pre) && !/@Embed\[$/.test(pre)) bad.push('orphan-compendium:' + m[0].slice(0, 60));
  }
  // 닫는 매크로 잔재 "]]" 앞에 여는 "[[" 없는 조각·이중 닫는 중괄호 "}}"는 오탐 많아 제외
  // 잘린 @표현식: "@Damage[" 이후 250자 내 "]" 없음
  for (const m of s.matchAll(/@(Damage|Check|Template|Localize|Embed)\[(?![^\[]{0,400}\])/g)) bad.push('truncated-' + m[1]);
  // {라벨 시작 후 닫는 } 없이 문단 끝
  return bad;
}
const badRows = [];
for (const f of fs.readdirSync(path.join(DEV, 'data/overlay'))) {
  if (!/\.ko\.json$/.test(f)) continue;
  const j = JSON.parse(fs.readFileSync(path.join(DEV, 'data/overlay', f), 'utf8'));
  const cat = f.replace('.ko.json', '');
  for (const slug in j) {
    const s = JSON.stringify(j[slug]);
    const bad = scanBad(s);
    // 라벨 중괄호 불균형: @X[...]{ 뒤 200자 내 } 없음
    for (const m of s.matchAll(/@[A-Za-z]+\[[^\]]*\]\{(?![^{}]{0,300}\})/g)) bad.push('unclosed-label');
    if (bad.length) badRows.push({ kind: 'markup', cat, slug, problems: [...new Set(bad)], raw: j[slug] });
  }
}
for (const f of fs.readdirSync(CRE_DIR)) {
  if (!/\.ko\.json$/.test(f) || f.startsWith('_')) continue;
  const j = JSON.parse(fs.readFileSync(path.join(CRE_DIR, f), 'utf8'));
  const ent = j.entries || j;
  for (const key in ent) {
    const s = JSON.stringify(ent[key]);
    const bad = scanBad(s);
    for (const m of s.matchAll(/@[A-Za-z]+\[[^\]]*\]\{(?![^{}]{0,300}\})/g)) bad.push('unclosed-label');
    if (bad.length) badRows.push({ kind: 'markup-creature', file: f, key, problems: [...new Set(bad)] });
  }
}
console.log('malformed-markup entities:', badRows.length);
badRows.slice(0, 20).forEach(r => console.log(' ', r.cat || r.file, r.slug || r.key, r.problems.join('|').slice(0, 120)));
let repairEnd = 6;
if (badRows.length) {
  // raw 통째는 payload 커질 수 있으니 문제 문자열 주변만 발췌
  const slim = badRows.map(r => { const { raw, ...rest } = r; return { ...rest, excerpt: raw ? JSON.stringify(raw).slice(0, 3000) : undefined }; });
  repairEnd = writeBatches('repair', slim, 6, 55 * 1024);
}
console.log(JSON.stringify({ creatures: creCount, repair: repairEnd }));
