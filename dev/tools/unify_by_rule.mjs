#!/usr/bin/env node
/* unify_by_rule.mjs — 이름 불일치 그룹 중 "용어집 규칙이 정본을 확정하는 것"만 통일.
 * 취향(음역↔의역)은 건드리지 않음. 규칙 소스=dev/docs/용어집.md + data/creatures/_glossary.ko.json.
 * 규칙:
 *   A. 감각(Sense): 영문명이 감각 슬러그면 전 변형을 글로서리 감각 정본으로.
 *   B. Strike 접미: "... Strike" → 본체 공격→타격 (Strike=타격).
 *   C. Holy/Unholy: Holy=신성, Unholy=불경 토큰 통일.
 *   D. 조사/띄어쓰기만 차이: 정규화 동일하면 최빈/짧은 쪽으로.
 * 실행: cd dev && node tools/unify_by_rule.mjs [--apply]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const DEV = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(DEV);
const APPLY = process.argv.includes('--apply');
const PF = require(path.join(DEV, 'cs_pf2e.js'));
const CATS = ['actions', 'ancestries', 'backgrounds', 'classes', 'conditions', 'deities', 'effects', 'equipment', 'feats', 'heritages', 'spells'];
CATS.forEach(c => PF.loadCategorySync(c));
const gloss = JSON.parse(fs.readFileSync('data/creatures/_glossary.ko.json', 'utf8'));
const SENSE = gloss.sense || {};            // slug → 정본 (암흑 시야 등)
const senseByEn = {};                        // "Darkvision" → 암흑 시야
for (const slug in SENSE) senseByEn[slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())] = SENSE[slug];
senseByEn['Greater Darkvision'] = SENSE['greater-darkvision'];

const OVL = {}, OVR = {};
for (const c of CATS) { OVL[c] = JSON.parse(fs.readFileSync(`data/overlay/${c}.ko.json`, 'utf8')); const op = `data/override/${c}.json`; OVR[c] = fs.existsSync(op) ? JSON.parse(fs.readFileSync(op, 'utf8')) : {}; }
function setName(c, slug, name) {
  if (OVR[c][slug] && OVR[c][slug].name_ko) OVR[c][slug].name_ko = name;
  else if (OVL[c][slug]) OVL[c][slug].name = name;
  else OVR[c][slug] = Object.assign(OVR[c][slug] || {}, { name_ko: name });
}
// 엔티티 슬러그·카테고리 인덱스 (영문명 → [{c,slug,ko}])
const byEn = {};
for (const c of CATS) for (const d of PF.all(c)) {
  const base = d.name.replace(/^(Spell Effect|Effect|Stance|Aura|Curse):\s*/, '').replace(/\s*\((Greater|Lesser|Moderate|Major|True|Minor)\)$/, '');
  (byEn[base] = byEn[base] || []).push({ c, slug: (d.system && d.system.slug) || d._id, ko: PF.nameKo(d) || '', name: d.name });
}
const norm = s => String(s).replace(/\s+/g, '').replace(/의|을|를|이|가|은|는/g, '');
let a = 0, b = 0, cc = 0, d2 = 0; const log = [];
for (const en in byEn) {
  const g = byEn[en];
  const kos = [...new Set(g.map(x => x.ko))].filter(Boolean);
  if (kos.length < 2) continue;
  let canon = null, rule = null;
  // A. 감각
  if (senseByEn[en]) { canon = senseByEn[en]; rule = 'A감각'; }
  // B. Strike
  else if (/ Strike$/.test(en)) {
    const withTa = kos.find(k => /타격/.test(k) && !/공격/.test(k));
    if (withTa && kos.some(k => /공격/.test(k))) { canon = withTa; rule = 'B타격'; }
  }
  // C. Holy/Unholy — "신성"/"불경" 포함 변형 선호
  else if (/\bHoly\b/.test(en) && kos.some(k => /신성/.test(k)) && kos.some(k => /성스러운|거룩/.test(k))) { canon = kos.find(k => /신성/.test(k)); rule = 'C신성'; }
  // D. 조사/띄어쓰기만 차이
  else if ([...new Set(kos.map(norm))].length === 1) {
    const cnt = {}; for (const x of g) if (x.ko) cnt[x.ko] = (cnt[x.ko] || 0) + 1;
    canon = kos.slice().sort((x, y) => (cnt[y] - cnt[x]) || (x.length - y.length))[0]; rule = 'D조사';
  }
  if (!canon) continue;
  const PFX = /^(주문 효과|효과|자세|오라|저주):\s*/;
  let n = 0; for (const x of g) { const pm = x.ko.match(PFX); const target = (pm ? pm[0] : '') + canon; if (x.ko && x.ko !== target) { if (APPLY) setName(x.c, x.slug, target); n++; } }
  if (n) { log.push(`[${rule}] ${en}: {${kos.join(' / ')}} → "${canon}"`); if (rule[0] === 'A') a += n; else if (rule[0] === 'B') b += n; else if (rule[0] === 'C') cc += n; else d2 += n; }
}
if (APPLY) for (const c of CATS) { fs.writeFileSync(`data/overlay/${c}.ko.json`, JSON.stringify(OVL[c], null, 1) + '\n'); fs.writeFileSync(`data/override/${c}.json`, JSON.stringify(OVR[c], null, 1) + '\n'); }
console.log(`규칙 통일 — 감각 ${a} · 타격 ${b} · 신성 ${cc} · 조사 ${d2} (그룹 ${log.length})`);
log.forEach(x => console.log('  ' + x));
console.log(APPLY ? 'APPLIED' : '(dry-run)');
