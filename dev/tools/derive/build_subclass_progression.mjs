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

// 서브클래스가 레벨별로 얻는 **클래스 특성** slug 맵(level → [slug]).
//   이 칸(features=클래스 특성)에는 진짜 클래스 특성만 넣는다. 부여 재주/기술/주문/행동은
//   서브클래스 탭 granted_* 칸에 선언 → 효과(자동화) 탭으로 파생되므로 여기 중복 주입 금지(정규화).
//   소스: class_features 중 name_en이 "(서브클래스명)"을 포함하는 것(교리·연구분야 등 레벨별 특성)
//        + 서브클래스 자체가 1레벨 클래스 특성인 경우(본능/대의/교단 등).
function subclassLevelFeatures(sc) {
  const cls = sc.class || sc.class_id || '';
  const tag = '(' + (sc.name_en || '') + ')';
  const map = {};
  const add = (lv, slug) => { if (slug) (map[lv] = map[lv] || []).push(slug); };
  for (const f of classFeats) {
    if (f.class !== cls) continue;
    if (sc.name_en && f.name_en && f.name_en.includes(tag)) add(f.level, f.slug);   // "(서브클래스명)" 하위 특성(교리·연구분야 등)
    // ⚠ 서브클래스 자체(f.slug===sc.slug 또는 name_en 동일)는 클래스 특성 칸에 넣지 않음 — 그건 특성이 아니라
    //   서브클래스 그 자체(본능/대의/혈통/학파 선택). 성장표 특성 칸엔 그 서브클래스가 주는 '별개' 특성만.
  }
  if (featLevel.has(sc.slug)) add(featLevel.get(sc.slug), sc.slug);   // 서브클래스가 재주로 표현(이콘/게이트)
  for (const f of (sc.features || [])) add(f.lv || 1, f.slug);   // 서브클래스 자체 features[](slug 단일소스, 혈통 마법·바드 지식 등) 직접 주입 — 이름 매칭 불필요
  // ⚠ granted_feats/granted_spells/granted_skills/granted_actions는 여기서 제외 —
  //   클래스 특성 칸이 아니라 granted_* 칸(→효과 탭)의 소관. (2026-07-12 정규화)
  if (!Object.keys(map).length && sc.name_en) {   // 폴백: slug/이름 정확 불일치(예: school-unified↔school-of-unified-magical-theory)만 이름 포함 매칭
    const nl = sc.name_en.toLowerCase();
    for (const f of classFeats) if (f.class === cls && f.name_en && f.name_en.toLowerCase().includes(nl)) add(f.level, f.slug);
  }
  // ⚠ 서브클래스 자기 정의특성 일괄 제외 — 성장표 특성 칸엔 '서브클래스가 주는 별개 특성'만.
  //   서브클래스 그 자체(bloodline-aberrant·school-of-*·enigma 등)는 특성이 아니라 서브클래스 선택 자체이므로
  //   featLevel 자기주입·fallback 이름매칭에서 새어들어온 것까지 여기서 전부 걷어낸다.
  const selfSlugs = new Set([sc.id, sc.slug]);
  for (const f of classFeats) if (f.class === cls && (f.slug === sc.slug || (sc.name_en && f.name_en === sc.name_en))) selfSlugs.add(f.slug);
  for (const lv in map) map[lv] = map[lv].filter(s => !selfSlugs.has(s));
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

// 서브클래스 부여 원본(효과 추출에서 우회) — build_effects.mjs 생성. subclasses.json granted_*와 합집합.
let SUB_GRANTS_RAW = {};
try { SUB_GRANTS_RAW = (JSON.parse(fs.readFileSync(path.join(DEV, 'data/derived/subclass_grants_raw.json'), 'utf8')).rows) || {}; } catch (e) {}

// 서브클래스가 레벨별로 **부여**하는 것(재주/기술/주문/행동). 성장표가 그 자체로 효과를 지님(효과 탭 경유 안 함).
//   런타임이 이 칸을 직접 읽어 적용(숙련 T/E/M/L과 동일 경로).
//   소스 = subclasses.json granted_*(큐레이트 병합) ∪ subclass_grants_raw.json(원본 추출 우회분). 레벨: 재주/기술/행동=1, 주문=주문레벨.
function subclassLevelGrants(sc) {
  const feats = {}, skills = {}, spells = {}, actions = {};
  const fSeen = new Set(), kSeen = new Set(), aSeen = new Set(), sSeen = new Set();
  const push = (m, lv, v) => { if (v) (m[lv] = m[lv] || []).push(v); };
  const addFeat = (f, lv) => { if (f && !fSeen.has(f)) { fSeen.add(f); push(feats, lv || 1, f); } };
  const addSkill = (k, lv) => { if (k && !kSeen.has(k)) { kSeen.add(k); push(skills, lv || 1, k); } };
  const addAction = (a, lv) => { if (a && !aSeen.has(a)) { aSeen.add(a); push(actions, lv || 1, a); } };
  const addSpell = (slug, type, rank, lv) => { if (slug && !sSeen.has(slug)) { sSeen.add(slug); const o = { slug, type }; if (rank != null) o.rank = rank; push(spells, lv || 1, o); } };
  // 1) 원본 추출 우회분(subclass_grants_raw) 먼저 — 부여 레벨(lv) 정본(레벨조건 gte 반영). 같은 대상은 여기서 확정.
  const raw = SUB_GRANTS_RAW[sc.slug];
  if (raw) {
    for (const f of (raw.grant_feats || [])) addFeat(f.slug, f.lv);
    for (const k of (raw.grant_skills || [])) addSkill(k.slug, k.lv);
    for (const a of (raw.grant_actions || [])) addAction(a.slug, a.lv);
    for (const sp of (raw.grant_spells || [])) addSpell(sp.slug, sp.type || 'focus', null, sp.lv);
  }
  // 2) subclasses.json granted_*(큐레이트·챔피언·드루이드 등 원본 추출에 없는 부여) 보강 — 레벨: 재주/기술/행동=1, 주문=주문레벨.
  for (const f of (sc.granted_feats || [])) addFeat(f, 1);
  for (const sk of (sc.granted_skills || [])) addSkill(sk, 1);
  for (const a of (sc.granted_actions || [])) addAction(a, 1);
  for (const sp of (sc.granted_spells || [])) addSpell(sp.spell_id, (['known','innate','cantrip'].includes(sp.type) ? sp.type : 'focus'), sp.rank, sp.lv);
  const has = Object.keys(feats).length || Object.keys(skills).length || Object.keys(spells).length || Object.keys(actions).length;
  return has ? { feats, skills, spells, actions } : null;
}

const rows = [];
let nSub = 0, unknownStat = new Set();
for (const sc of subs) {
  const pc = sc.prof_changes || {};
  const featMap = subclassLevelFeatures(sc);
  const grantMap = subclassLevelGrants(sc);
  // 숙련 오버라이드·레벨별 특성·부여 중 하나라도 있는 서브클래스만 방출(전부 없으면 = 클래스 기본만 상속, 표시할 성장 없음).
  if (!Object.keys(pc).length && !Object.keys(featMap).length && !grantMap) continue;
  nSub++;
  for (let level = 1; level <= 20; level++) {
    const row = { subclass: sc.slug, class: sc.class || sc.class_id || '', name_ko: sc.name_ko || sc.slug, level };
    row.features = featMap[level] || [];   // 이 레벨에 얻는 클래스 특성 slug
    row.grant_feats = (grantMap && grantMap.feats[level]) || [];       // 이 레벨에 부여하는 재주
    row.grant_skills = (grantMap && grantMap.skills[level]) || [];     // 이 레벨에 부여하는 기술
    row.grant_spells = (grantMap && grantMap.spells[level]) || [];     // 이 레벨에 부여하는 주문 [{slug,type,rank?}]
    row.grant_actions = (grantMap && grantMap.actions[level]) || [];   // 이 레벨에 부여하는 행동
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
