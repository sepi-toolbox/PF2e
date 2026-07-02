#!/usr/bin/env node
/* unify_trivial_dupes.mjs — 동일 영문·동일 카테고리 중복 엔티티 중 "사소한 차이"(띄어쓰기·조사)만 통일.
 * 정규화 후 같으면 = 같은 번역 → 더 짧은(조사 없는) 쪽 or 다수를 정본으로.
 * 음역↔의역처럼 형태소가 다른 쌍은 건드리지 않음(취향 판단 → 별도).
 * 실행: cd dev && node tools/unify_trivial_dupes.mjs [--apply]
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

// 정규화: 공백 제거 + 조사(의/을/를/이/가/은/는) 제거 + 괄호내용 제거
function norm(s) {
  return String(s).replace(/\s+/g, '').replace(/\([^)]*\)/g, '').replace(/의|을|를|이|가|은|는/g, '');
}

const OVL = {}, OVR = {};
for (const c of CATS) {
  OVL[c] = JSON.parse(fs.readFileSync(`data/overlay/${c}.ko.json`, 'utf8'));
  const op = `data/override/${c}.json`;
  OVR[c] = fs.existsSync(op) ? JSON.parse(fs.readFileSync(op, 'utf8')) : {};
}
function setName(c, slug, name) {
  if (OVR[c][slug] && OVR[c][slug].name_ko) OVR[c][slug].name_ko = name;
  else if (OVL[c][slug]) OVL[c][slug].name = name;
  else OVR[c][slug] = Object.assign(OVR[c][slug] || {}, { name_ko: name });
}

let unified = 0; const log = [], kept = [];
for (const c of CATS) {
  // 영문명 → [{slug, ko}]
  const byEn = {};
  for (const d of PF.all(c)) {
    const slug = (d.system && d.system.slug) || d._id;
    (byEn[d.name] = byEn[d.name] || []).push({ slug, ko: PF.nameKo(d) || '' });
  }
  for (const en in byEn) {
    const g = byEn[en];
    const kos = [...new Set(g.map(x => x.ko))].filter(Boolean);
    if (kos.length < 2) continue;
    // 정규화가 전부 같으면 = 사소한 차이 → 정본 = 최빈, 동률이면 짧은 것
    const normed = [...new Set(kos.map(norm))];
    if (normed.length !== 1) { kept.push(`${c} ${en}: ${kos.join(' / ')}`); continue; } // 형태소 차이 → 보류
    const cnt = {}; for (const x of g) cnt[x.ko] = (cnt[x.ko] || 0) + 1;
    const canon = kos.slice().sort((a, b) => (cnt[b] - cnt[a]) || (a.length - b.length))[0];
    for (const x of g) if (x.ko !== canon) { if (APPLY) setName(c, x.slug, canon); unified++; }
    log.push(`${c} ${en}: {${kos.join(' / ')}} → "${canon}"`);
  }
}
if (APPLY) for (const c of CATS) {
  fs.writeFileSync(`data/overlay/${c}.ko.json`, JSON.stringify(OVL[c], null, 1) + '\n');
  fs.writeFileSync(`data/override/${c}.json`, JSON.stringify(OVR[c], null, 1) + '\n');
}
console.log('사소차이 통일:', unified, '엔티티 |', log.length, '그룹 | 형태소차이 보류:', kept.length);
log.slice(0, 30).forEach(x => console.log('  ' + x));
console.log(APPLY ? 'APPLIED' : '(dry-run)');
