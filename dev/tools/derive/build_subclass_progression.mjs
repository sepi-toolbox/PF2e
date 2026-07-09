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
const classFeats = JSON.parse(fs.readFileSync(path.join(DEV, 'data/derived/class_features.json'), 'utf8')).rows;
// 일부 서브클래스(엑셈플라 이콘·키네티시스트 게이트)는 class_feature가 아니라 재주(feat)로 표현 — slug 동일.
const featLevel = new Map(JSON.parse(fs.readFileSync(path.join(DEV, 'data/store/feats.json'), 'utf8')).map(x => [x.system && x.system.slug, (x.system && x.system.level && x.system.level.value) || 1]));

// 서브클래스가 레벨별로 얻는 클래스 특성 slug 맵(level → [slug]).
//   소스: class_features 중 name_en이 "(서브클래스명)"을 포함하는 것(교리·연구분야 등 레벨별 특성) + granted_feats(1레벨 부여).
function subclassLevelFeatures(sc) {
  const cls = sc.class || sc.class_id || '';
  const tag = '(' + (sc.name_en || '') + ')';
  const map = {};
  const add = (lv, slug) => { if (slug) (map[lv] = map[lv] || []).push(slug); };
  for (const f of classFeats) {
    if (f.class !== cls) continue;
    if (sc.name_en && f.name_en && f.name_en.includes(tag)) add(f.level, f.slug);   // "(서브클래스명)" 하위 특성(교리·연구분야 등)
    if (f.slug === sc.slug || (sc.name_en && f.name_en === sc.name_en)) add(f.level, f.slug); // 서브클래스 자체 = 1레벨 클래스 특성(본능/대의 등)
  }
  if (featLevel.has(sc.slug)) add(featLevel.get(sc.slug), sc.slug);   // 서브클래스가 재주로 표현(이콘/게이트)
  for (const g of (sc.granted_feats || [])) add(1, g);                          // 부여 재주(1레벨)
  for (const sp of (sc.granted_spells || [])) add(sp.lv || 1, sp.spell_id);      // 부여 주문(레벨별: 결단/후원자 집중주문·바드 known 등)
  for (const sk of (sc.granted_skills || [])) add(1, sk);                        // 부여 기술(1레벨)
  if (!Object.keys(map).length && sc.name_en) {   // 폴백: slug/이름 정확 불일치(예: school-unified↔school-of-unified-magical-theory)만 이름 포함 매칭
    const nl = sc.name_en.toLowerCase();
    for (const f of classFeats) if (f.class === cls && f.name_en && f.name_en.toLowerCase().includes(nl)) add(f.level, f.slug);
  }
  for (const lv in map) map[lv] = [...new Set(map[lv].filter(Boolean))];
  return map;
}

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
  const pc = sc.prof_changes || {};
  const featMap = subclassLevelFeatures(sc);
  // 숙련 오버라이드 또는 레벨별 특성이 있는 서브클래스만 방출(둘 다 없으면 = 클래스 기본만 상속, 표시할 성장 없음).
  if (!Object.keys(pc).length && !Object.keys(featMap).length) continue;
  nSub++;
  for (let level = 1; level <= 20; level++) {
    const row = { subclass: sc.slug, class: sc.class || sc.class_id || '', name_ko: sc.name_ko || sc.slug, level };
    row.features = featMap[level] || [];   // 이 레벨에 얻는 클래스 특성 slug
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
