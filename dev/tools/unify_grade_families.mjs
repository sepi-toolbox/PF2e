#!/usr/bin/env node
/* unify_grade_families.mjs — 장비 등급 가족(기본+등급멤버)의 한글 본체명을 하나로 통일.
 * 영문 base(등급접미 제거) 기준으로 묶고, 한글 본체명(괄호 제거)의 최빈값을 정본으로.
 * 각 멤버 = 정본본체 + (해당 등급 한글 괄호). 기본(무등급) 멤버는 괄호 없음.
 * fix_grades와 달리 "무접미 기본 멤버"도 포함(그게 누락돼 ④ 중복으로 잡힘).
 * 실행: cd dev && node tools/unify_grade_families.mjs [--apply]
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
PF.loadCategorySync('equipment');
const GRADE = /\s*\((Minor|Lesser|Moderate|Greater|Major|True|Supreme|Standard)\)\s*$/;
const KGRADE = { Minor: '최하급', Lesser: '하급', Moderate: '보통', Greater: '중급', Major: '상급', True: '최상급', Supreme: '최상급', Standard: '표준' };
const ORDER = ['Minor', 'Lesser', 'Moderate', 'Standard', 'Greater', 'Major', 'True', 'Supreme'];

const OVL = JSON.parse(fs.readFileSync('data/overlay/equipment.ko.json', 'utf8'));
const OVR = JSON.parse(fs.readFileSync('data/override/equipment.json', 'utf8'));
function setName(slug, name) {
  if (OVR[slug] && OVR[slug].name_ko) OVR[slug].name_ko = name;
  else if (OVL[slug]) OVL[slug].name = name;
  else OVR[slug] = Object.assign(OVR[slug] || {}, { name_ko: name });
}

// 가족 수집
const fam = {};
for (const d of PF.all('equipment')) {
  const gm = d.name.match(/\((Minor|Lesser|Moderate|Greater|Major|True|Supreme|Standard)\)$/);
  const base = d.name.replace(GRADE, '').trim();
  const ko = PF.nameKo(d) || '';
  const koBase = ko.replace(/\s*\([^)]*\)\s*$/, '').trim();
  (fam[base] = fam[base] || []).push({ slug: (d.system && d.system.slug) || d._id, grade: gm ? gm[1] : null, ko, koBase });
}

let fix = 0; const log = [];
for (const base in fam) {
  const g = fam[base];
  if (g.length < 2) continue;                       // 가족 아님
  const koBases = new Set(g.map(x => x.koBase));
  if (koBases.size < 2) continue;                   // 본체명 이미 일치
  // 정본 본체 = 최빈, 동률=낮은 등급 우선
  const cnt = {}; for (const x of g) cnt[x.koBase] = (cnt[x.koBase] || 0) + 1;
  let canon = null, best = -1;
  for (const x of [...g].sort((a, b) => ORDER.indexOf(a.grade) - ORDER.indexOf(b.grade))) {
    if (cnt[x.koBase] > best) { best = cnt[x.koBase]; canon = x.koBase; }
  }
  for (const x of g) {
    const want = canon + (x.grade ? ' (' + KGRADE[x.grade] + ')' : '');
    if (x.ko !== want) { if (APPLY) setName(x.slug, want); fix++; }
  }
  log.push(`${base}: {${[...koBases].join(' / ')}} → "${canon}"`);
}
if (APPLY) {
  fs.writeFileSync('data/overlay/equipment.ko.json', JSON.stringify(OVL, null, 1) + '\n');
  fs.writeFileSync('data/override/equipment.json', JSON.stringify(OVR, null, 1) + '\n');
}
console.log('가족 본체 통일:', fix, '멤버 |', log.length, '가족');
log.slice(0, 40).forEach(x => console.log('  ' + x));
console.log(APPLY ? 'APPLIED' : '(dry-run)');
