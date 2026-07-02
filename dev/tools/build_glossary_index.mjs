#!/usr/bin/env node
/* build_glossary_index.mjs — dev/docs/용어집.md 의 자동 생성 색인(Part 2)을 런타임 데이터에서 재생성.
 * 정본 데이터 = 앱이 실제 표시하는 한글명(BASE⊕OVERLAY⊕OVERRIDE 런타임 조인).
 * 실행: cd dev && node tools/build_glossary_index.mjs
 * 마커 <!-- AUTO-INDEX BEGIN --> … <!-- AUTO-INDEX END --> 사이만 교체(핵심 용어 Part 1은 손대지 않음).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..');
const PF = require(path.join(DEV, 'cs_pf2e.js'));
['classes', 'ancestries', 'heritages', 'actions'].forEach(c => PF.loadCategorySync(c));
const J = f => JSON.parse(fs.readFileSync(path.join(DEV, f), 'utf8'));

const out = [];
const H = (t) => out.push(`\n### ${t}\n`);
const table = (rows, cols = ['원문', '정본']) => {
  out.push(`| ${cols.join(' | ')} |`);
  out.push(`|${cols.map(() => '---').join('|')}|`);
  for (const r of rows) out.push(`| ${r.join(' | ')} |`);
};
const esc = s => String(s || '').replace(/\|/g, '\\|');

// ── 1) 클래스 ──
H('클래스 (Classes)');
table(PF.all('classes').map(d => [esc(d.name), esc(PF.nameKo(d))]).sort((a, b) => a[0].localeCompare(b[0])));

// ── 2) 서브클래스 ──
H('서브클래스 (Subclasses)');
{
  const rows = (J('data/derived/subclasses.json').rows || []).map(r => {
    const cls = r.class || (r.tag || '').split('-')[0] || '';
    return [esc(cls), esc(r.subclass_type || ''), esc(r.name_en), esc(r.name_ko)];
  }).sort((a, b) => a[0].localeCompare(b[0]) || a[2].localeCompare(b[2]));
  table(rows, ['클래스', '유형', '원문', '정본']);
}

// ── 3) 클래스 요소(특성) ──
H('클래스 요소 (Class Features) — 클래스 고유 규칙용어');
{
  const seen = new Set();
  const rows = [];
  for (const r of (J('data/derived/class_features.json').rows || [])) {
    const key = r.name_en + '|' + r.name_ko;
    if (seen.has(key)) continue; seen.add(key);
    const cls = r.class || (r.tag || '').split('-')[0] || '(공통/기타)';
    rows.push([esc(cls), esc(r.name_en), esc(r.name_ko)]);
  }
  rows.sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
  table(rows, ['클래스', '원문', '정본']);
}

// ── 4) 혈통 ──
H('혈통 (Ancestries)');
table(PF.all('ancestries').map(d => [esc(d.name), esc(PF.nameKo(d))]).sort((a, b) => a[0].localeCompare(b[0])));

// ── 5) 유산 ──
H('유산 (Heritages)');
{
  const ancKo = {}; for (const d of PF.all('ancestries')) ancKo[d.name] = PF.nameKo(d);
  const rows = PF.all('heritages').map(d => {
    const anc = (d.system && d.system.ancestry && d.system.ancestry.name) || '(다목적)';
    return [esc(ancKo[anc] ? `${anc} ${ancKo[anc]}` : anc), esc(d.name), esc(PF.nameKo(d))];
  }).sort((a, b) => a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
  table(rows, ['혈통', '원문', '정본']);
}

// ── 6) 탐험/막간 활동 ──
for (const [trait, title] of [['exploration', '탐험 활동 (Exploration Activities)'], ['downtime', '막간 활동 (Downtime Activities)']]) {
  H(title);
  const rows = PF.all('actions')
    .filter(d => ((d.system && d.system.traits && d.system.traits.value) || []).includes(trait))
    .map(d => [esc(d.name), esc(PF.nameKo(d))]).sort((a, b) => a[0].localeCompare(b[0]));
  table(rows);
}

// ── 7) 시스템 enum (크기·희귀도·무기/갑옷 분류·감각) ──
{
  const st = J('data/derived/system_terms.json').rows || [];
  const groups = { size: '크기 (Sizes)', rarity: '희귀도 (Rarity)', weapon_category: '무기 분류', weapon_group: '무기 그룹', armor_category: '갑옷 분류', armor_group: '갑옷 그룹', sense: '감각 (Senses)' };
  for (const k in groups) {
    H(groups[k]);
    table(st.filter(r => r.type === k).map(r => [esc(r.name_en || r.slug), esc(r.name_ko)]).sort((a, b) => a[0].localeCompare(b[0])));
  }
}

// ── 문서 스플라이스 ──
const DOC = path.join(DEV, 'docs/용어집.md');
let md = fs.readFileSync(DOC, 'utf8');
const BEGIN = '<!-- AUTO-INDEX BEGIN -->', END = '<!-- AUTO-INDEX END -->';
const body = `${BEGIN}
> ⚙ **자동 생성 색인** — 앱 런타임 데이터(BASE⊕OVERLAY⊕OVERRIDE)에서 추출한 정본 한글명. 손으로 고치지 말 것 — 이름 수정은 \`data/override/<cat>.json\`(엔티티) 또는 원천 데이터에서 하고 \`node tools/build_glossary_index.mjs\`로 재생성.
${out.join('\n')}
${END}`;
if (md.includes(BEGIN)) {
  md = md.replace(new RegExp(BEGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), body);
} else {
  md = md.trimEnd() + '\n\n---\n\n# Part 2. 전체 색인 (자동 생성)\n\n' + body + '\n';
}
fs.writeFileSync(DOC, md);
const lines = out.length;
console.log(`✓ 용어집 자동 색인 재생성 — 표 ${Object.keys({}).length || ''}${lines}행 (클래스 ${PF.all('classes').length} · 서브클래스 ${(J('data/derived/subclasses.json').rows || []).length} · 혈통 ${PF.all('ancestries').length} · 유산 ${PF.all('heritages').length})`);
