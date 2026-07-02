#!/usr/bin/env node
/* align_effect_names.mjs — 효과(effect) 엔티티 이름을 그 원본(주문>재주>행동>장비) 이름에 맞춤.
 * 규칙: 효과는 원본이 만드는 상태 → 이름이 같아야 함. 원본 우선순위 spell > feat > action > equipment.
 * 별개 객체(같은 영문명이지만 다른 것) 자동 회피: 효과의 base 영문명 == 원본 영문명일 때만, 원본이 있을 때만.
 * 등급 접미(Greater 등)·프리픽스(Effect:/Spell Effect:/Stance:)는 보존.
 * 실행: cd dev && node tools/align_effect_names.mjs [--apply]
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
['effects', 'spells', 'feats', 'actions', 'equipment'].forEach(c => PF.loadCategorySync(c));

// 원본 인덱스: 영문명 → {c, ko} (우선순위대로 첫 등록만)
const idx = {};
for (const c of ['spells', 'feats', 'actions', 'equipment'])
  for (const d of PF.all(c)) if (!(d.name in idx)) idx[d.name] = { c, ko: PF.nameKo(d) };

const GRADE = '(Greater|Lesser|Major|Moderate|True|Minor|Supreme)';
const PREFIX = { 'Spell Effect': '주문 효과: ', 'Effect': '효과: ', 'Stance': '자세: ', 'Aura': '오라: ', 'Curse': '저주: ' };
const KGRADE = { Minor: '최하급', Lesser: '하급', Moderate: '보통', Greater: '중급', Major: '상급', True: '최상급', Supreme: '최상급' };

const ovl = JSON.parse(fs.readFileSync('data/overlay/effects.ko.json', 'utf8'));
const ovr = JSON.parse(fs.readFileSync('data/override/effects.json', 'utf8'));
let n = 0; const log = []; const skipped = [];

for (const d of PF.all('effects')) {
  const slug = (d.system && d.system.slug) || d._id;
  const cur = PF.nameKo(d) || '';
  // 영문 파싱: [prefix: ] base [ (grade)]
  const m = d.name.match(new RegExp('^(?:(Spell Effect|Effect|Stance|Aura|Curse): )?(.+?)(?: \\(' + GRADE + '\\))?$'));
  if (!m) continue;
  const pfx = m[1], base = m[2], grade = m[3];
  const src = idx[base];
  if (!src || !src.ko || !/[가-힣]/.test(src.ko)) continue;      // 원본 없음/영문 → 건드리지 않음
  // 목표 한글: [한글프리픽스] 원본한글 [ (등급)]
  let want = (pfx ? PREFIX[pfx] : '') + src.ko;
  if (grade) {
    const curPar = cur.match(/\(([^)]+)\)\s*$/);
    want += ' (' + ((curPar && /급|보통|표준/.test(curPar[1])) ? curPar[1] : KGRADE[grade]) + ')';
  }
  if (cur === want) continue;
  // 안전장치: 프리픽스 없는 효과인데 원본이 equipment면 스킵(별개 객체 위험 큼) — spell/feat/action만 신뢰
  if (!pfx && src.c === 'equipment') { skipped.push(`${slug}: "${cur}" ≠ 장비"${src.ko}" (프리픽스없음·장비원본→보류)`); continue; }
  log.push(`${slug}: "${cur}" → "${want}" (원본 ${src.c})`);
  if (APPLY) {
    if (ovr[slug] && ovr[slug].name_ko) ovr[slug].name_ko = want;
    else if (ovl[slug]) ovl[slug].name = want;
    else ovr[slug] = Object.assign(ovr[slug] || {}, { name_ko: want });
  }
  n++;
}
if (APPLY) {
  fs.writeFileSync('data/overlay/effects.ko.json', JSON.stringify(ovl, null, 1) + '\n');
  fs.writeFileSync('data/override/effects.json', JSON.stringify(ovr, null, 1) + '\n');
}
console.log('정렬:', n, '건 | 보류(장비원본·프리픽스없음):', skipped.length);
log.slice(0, 40).forEach(x => console.log('  ' + x));
if (skipped.length) { console.log('--- 보류 샘플 ---'); skipped.slice(0, 10).forEach(x => console.log('  ' + x)); }
console.log(APPLY ? 'APPLIED' : '(dry-run)');
