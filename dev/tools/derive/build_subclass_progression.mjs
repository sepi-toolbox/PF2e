#!/usr/bin/env node
/* build_subclass_progression.mjs — 서브클래스 숙련 진행표(섀시)를 클래스 성장표와 동일 스키마로 파생.
 *
 *  정책(2026-07-09): 숙련 진행 = 섀시 도메인 → 성장 데이터(효과 테이블 아님). 클래스=class_progression,
 *   서브클래스=이 파일. 컬럼 스키마·랭크 표기(T/E/M/L) 클래스표와 **완전 동일**, 키만 subclass.
 *   빈 칸 = 클래스 기본 상속(오버라이드 없음) — 클래스표(빈=미숙련U)와 의미가 달라 별도 테이블.
 *
 *  소스: data/derived/subclasses.json 각 서브클래스의 prof_changes({runtimeStat:{level:rankNum}}).
 *   런타임키(fort/spatk/weapon-martial/armor-light…) → 성장표 컬럼명으로 역매핑, 랭크숫자(2/4/6/8)→T/E/M/L.
 *   레벨 1~20 조밀 그리드(클래스표와 동일): 각 레벨에서 breakpoint ≤ level 최대 랭크.
 *  실행: cd dev && node tools/derive/build_subclass_progression.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const subs = JSON.parse(fs.readFileSync(path.join(DEV, 'data/derived/subclasses.json'), 'utf8')).rows;

// 런타임 스탯키 → 성장표 컬럼명 (class_progression _PROF_COL2T의 역)
const STAT2COL = {
  perc: 'perception', fort: 'fortitude', ref: 'reflex', will: 'will', classdc: 'classDC',
  'weapon-simple': 'simple', 'weapon-martial': 'martial', 'weapon-unarmed': 'unarmed', 'weapon-advanced': 'advanced',
  'armor-unarmored': 'unarmored', 'armor-light': 'light', 'armor-medium': 'medium', 'armor-heavy': 'heavy',
  spatk: 'spellcasting',
};
const RANK2L = { 0: '', 2: 'T', 4: 'E', 6: 'M', 8: 'L' };
const COLS = ['perception', 'fortitude', 'reflex', 'will', 'classDC', 'simple', 'martial', 'unarmed', 'advanced', 'unarmored', 'light', 'medium', 'heavy', 'spellcasting'];

const rows = [];
let nSub = 0, unknownStat = new Set();
for (const sc of subs) {
  const pc = sc.prof_changes;
  if (!pc || !Object.keys(pc).length) continue;
  nSub++;
  for (let level = 1; level <= 20; level++) {
    const row = { subclass: sc.slug, class: sc.class || sc.class_id || '', name_ko: sc.name_ko || sc.slug, level };
    for (const c of COLS) row[c] = '';
    let any = false;
    for (const [stat, prog] of Object.entries(pc)) {
      const col = STAT2COL[stat];
      if (!col) { unknownStat.add(stat); continue; }
      let rank = 0;
      for (const [lv, val] of Object.entries(prog)) if (parseInt(lv) <= level) rank = Math.max(rank, val);
      if (rank > 0) { row[col] = RANK2L[rank] || ''; any = true; }
    }
    row._src = 'canonical(prof_changes)';
    rows.push(row);
  }
}

const out = {
  rows,
  note: '서브클래스 숙련 진행(섀시) — class_progression과 동일 컬럼 스키마(T/E/M/L). 빈 칸=클래스 기본 상속(오버라이드 없음). build_subclass_progression.mjs 생성(소스=subclasses.json prof_changes).',
};
fs.writeFileSync(path.join(DEV, 'data/derived/subclass_progression.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`✔ subclass_progression.json — ${nSub}개 서브클래스 × 20레벨 = ${rows.length}행 (클래스표 동일 스키마)`);
if (unknownStat.size) console.log('  ⚠ 미매핑 스탯키:', [...unknownStat].join(', '));
console.log('  서브클래스:', [...new Set(rows.map(r => r.subclass))].join(', '));
