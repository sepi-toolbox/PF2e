#!/usr/bin/env node
// ═══════════════════════════════════════════════
//  ONE-SHOT MIGRATION — FEAT_DB v3 Phase 3a
//  effects/choice/choiceEffects 1:N 정규화
//
//  사용자 합의 모델 (proposal_v3_export.js 정본):
//    FEAT_DB:
//      - effects 컬럼 제거
//      - auto_note (display_note text 1:1 흡수)
//      - damage_note (1건 JSON 흡수)
//      - effect_group_id (공통 효과 → EFFECT_GROUPS 외래키)
//      - choice 컬럼 제거 → choice_id + choice_kind + choice_label + choice_filter
//      - choiceEffects 컬럼 제거 → 옵션이 자기 effect_group_id 보유
//
//    EFFECT_GROUPS (cs_data.js 신규 const):
//      - target 통합 컬럼 (식별자 7-8개를 target 1개로):
//        skill/spell/feat/action/weapon_name/vision/sense/save → target
//      - weapons 배열은 행 펼침 (한 그룹에 weapon_familiarity 행 N개)
//      - 컬럼 우선순위: group_id, type, target, value, bonus_type, condition,
//                       tradition, spell_type, uses, default_choice, ...
//      - NOTE_TYPES (display_note/damage_note)는 제외 (FEAT_DB로 흡수됨)
//
//    CHOICE_OPTIONS (cs_data.js 신규 const):
//      - choice_id, option_id, option_name, effect_group_id, is_default
//      - custom + skill_defaults type만 옵션 펼침
//      - 그 외 11종은 런타임 쿼리 (옵션 행 없음)
//
//  Usage: node tools/migrate_feat_db_v3_phase3a.js [--dry]
// ═══════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DEV_DIR = path.join(ROOT, 'dev');
const DRY = process.argv.includes('--dry');

// ── DB 로드 ──
function loadDBs() {
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  for (const file of ['cs_data.js', 'feat_db.js']) {
    let src = fs.readFileSync(path.join(DEV_DIR, file), 'utf8');
    src = src.replace(/^const\s+/gm, 'var ').replace(/^let\s+/gm, 'var ');
    try { vm.runInContext(src, sandbox, { filename: file }); }
    catch (e) { console.error(`[warn] ${file}: ${e.message}`); }
  }
  return sandbox;
}

const ctx = loadDBs();
const FEAT_DB = ctx.FEAT_DB || [];

console.error(`FEAT_DB rows: ${FEAT_DB.length}`);

// ── 변환 ──
const NOTE_TYPES = new Set(['display_note', 'damage_note']);

// 식별자 컬럼 → target 통합 (proposal_v3_export.js와 동일)
const TARGET_COLS = ['skill','spell','feat','action','weapon_name','vision','sense','save'];

// ── 행 펼침 단계 ──
// 효과 객체 → 행들로 변환 (target 통합 + weapons 펼침)
function effectToRows(groupId, e) {
  if (!e || NOTE_TYPES.has(e.type)) return [];
  const rows = [];

  // weapons 배열은 행 펼침
  if (Array.isArray(e.weapons) && e.weapons.length) {
    for (const w of e.weapons) {
      const row = { group_id: groupId, type: e.type, target: w };
      for (const k of Object.keys(e)) {
        if (k === 'weapons' || k === 'type') continue;
        if (TARGET_COLS.includes(k)) continue;  // target에 통합되는 컬럼 skip
        row[k] = e[k];
      }
      rows.push(row);
    }
    return rows;
  }

  // 일반: target 통합 (TARGET_COLS 중 첫 매칭 → target에)
  const row = { group_id: groupId, type: e.type };
  for (const c of TARGET_COLS) {
    if (e[c] !== undefined && e[c] !== null && e[c] !== '') {
      row.target = e[c];
      break;
    }
  }
  for (const k of Object.keys(e)) {
    if (k === 'type') continue;
    if (TARGET_COLS.includes(k)) continue;  // target에 흡수됨
    row[k] = e[k];
  }
  rows.push(row);
  return rows;
}

const effectGroups = [];
const choiceOptions = [];

function pushEffects(groupId, arr) {
  if (!Array.isArray(arr)) return 0;
  let n = 0;
  for (const e of arr) {
    const rows = effectToRows(groupId, e);
    for (const r of rows) { effectGroups.push(r); n++; }
  }
  return n;
}

// 효과 배열에서 노트만 추출
function extractNotes(arr) {
  const out = { auto_note: '', damage_note: null };
  if (!Array.isArray(arr)) return out;
  for (const e of arr) {
    if (!e) continue;
    if (e.type === 'display_note') {
      out.auto_note = e.text || '';
    } else if (e.type === 'damage_note') {
      const d = {};
      for (const k of Object.keys(e)) if (k !== 'type') d[k] = e[k];
      out.damage_note = d;
    }
  }
  return out;
}

// FEAT_DB의 모든 컬럼을 효과 컬럼 세트로 재구성하면서 effects/choice/choiceEffects 제거
const FEAT_NEW_COLUMN_ORDER = [
  'id', 'name_ko', 'name_en', 'feat_level', 'category',
  'acquisition', 'source', 'prereq_group_id',
  'auto_note', 'damage_note',
  'effect_group_id',
  'choice_id', 'choice_kind', 'choice_label', 'choice_filter',
  'prerequisites', 'traits', 'actionCost',
  'desc', 'summary',
  'repeatable',
  // PlayerCore 자동 파싱 비대상 메타 보존 (v528~)
  'feature_legacy_id', 'feature_type',
];

const featDbNew = FEAT_DB.map(f => {
  const out = {};

  // ── 노트 추출 ──
  const notes = extractNotes(f.effects);

  // ── 공통 효과 (노트 제외) → effect_group_id ──
  let effect_group_id = '';
  if (Array.isArray(f.effects) && f.effects.some(e => e && !NOTE_TYPES.has(e.type))) {
    effect_group_id = `eg-${f.id}`;
    pushEffects(effect_group_id, f.effects);
  }

  // ── choice → choice_id + CHOICE_OPTIONS 시트 + 옵션효과 ──
  let choice_id = '', choice_kind = '', choice_label = '';
  let choice_filter = null;
  if (f.choice) {
    choice_id = `cho-${f.id}`;
    choice_kind = f.choice.type || '';
    choice_label = f.choice.label || '';

    // type/label/options/defaults 외 메타는 JSON으로 보존
    const filter = {};
    for (const k of Object.keys(f.choice)) {
      if (['type', 'label', 'options', 'defaults'].includes(k)) continue;
      filter[k] = f.choice[k];
    }
    if (Object.keys(filter).length) choice_filter = filter;

    if (f.choice.type === 'custom' && Array.isArray(f.choice.options)) {
      for (const opt of f.choice.options) {
        let optEgId = '';
        if (f.choiceEffects && f.choiceEffects[opt.id]) {
          optEgId = `eg-${f.id}-${opt.id}`;
          pushEffects(optEgId, f.choiceEffects[opt.id]);
        }
        choiceOptions.push({
          choice_id,
          option_id: opt.id,
          option_name: opt.name,
          effect_group_id: optEgId,
          is_default: false,
        });
      }
    } else if (f.choice.type === 'skill_defaults' && Array.isArray(f.choice.defaults)) {
      for (const sk of f.choice.defaults) {
        choiceOptions.push({
          choice_id,
          option_id: sk,
          option_name: sk,
          effect_group_id: '',
          is_default: true,
        });
      }
    }
    // 그 외 11종 type: 옵션 행 없음
  }

  // ── 새 row 빌드 (정해진 순서로) ──
  for (const k of FEAT_NEW_COLUMN_ORDER) {
    if (k === 'auto_note') {
      if (notes.auto_note) out[k] = notes.auto_note;
    } else if (k === 'damage_note') {
      if (notes.damage_note) out[k] = notes.damage_note;
    } else if (k === 'effect_group_id') {
      if (effect_group_id) out[k] = effect_group_id;
    } else if (k === 'choice_id') {
      if (choice_id) out[k] = choice_id;
    } else if (k === 'choice_kind') {
      if (choice_kind) out[k] = choice_kind;
    } else if (k === 'choice_label') {
      if (choice_label) out[k] = choice_label;
    } else if (k === 'choice_filter') {
      if (choice_filter) out[k] = choice_filter;
    } else if (f[k] !== undefined) {
      out[k] = f[k];
    }
  }

  // ORDER 외 컬럼 보존 (단, effects/choice/choiceEffects는 명시적 제거)
  for (const k of Object.keys(f)) {
    if (k === 'effects' || k === 'choice' || k === 'choiceEffects') continue;
    if (out[k] === undefined && f[k] !== undefined) out[k] = f[k];
  }

  return out;
});

// ── EFFECT_GROUPS 컬럼 순서 (시안 _proposals/PF2e_DB_proposal_v3_effects_choice.xlsx 정본) ──
//   의미적 정렬: group_id → type → target → value → bonus_type → condition → tradition → uses → actionCost
//                → damage → damage_type → defaultChoice → from → key → name → range → rank → spellType
//                → summary → traits → weapon_category → weapons
// JSON 출력 시 key 순서가 컬럼 순서가 됨 → 모든 행에서 동일한 key 순서 유지
const COL_PRIORITY = [
  'group_id', 'type', 'target',
  'value', 'bonus_type', 'condition',
  'tradition', 'uses', 'actionCost',
  'damage', 'damage_type', 'defaultChoice',
  'from', 'key', 'name', 'range', 'rank',
  'spellType', 'spell_type',
  'summary', 'traits',
  'weapon_category', 'weapons',
  'feat', 'scaling', 'default_choice',
];
function sortRowKeys(row) {
  const out = {};
  for (const k of COL_PRIORITY) if (row[k] !== undefined) out[k] = row[k];
  for (const k of Object.keys(row)) if (out[k] === undefined) out[k] = row[k];
  return out;
}
const effectGroupsSorted = effectGroups.map(sortRowKeys);

// ── 통계 / FK 무결성 ──
const stats = {
  feats_total: featDbNew.length,
  feats_with_auto_note: featDbNew.filter(f => f.auto_note).length,
  feats_with_damage_note: featDbNew.filter(f => f.damage_note).length,
  feats_with_effect_group_id: featDbNew.filter(f => f.effect_group_id).length,
  feats_with_choice_id: featDbNew.filter(f => f.choice_id).length,
  feats_with_both: featDbNew.filter(f => f.effect_group_id && f.choice_id).length,
  effect_groups_rows: effectGroupsSorted.length,
  effect_groups_distinct: new Set(effectGroupsSorted.map(r => r.group_id)).size,
  choice_options_rows: choiceOptions.length,
  choice_options_distinct_choice_ids: new Set(choiceOptions.map(r => r.choice_id)).size,
  choice_options_with_effect_group: choiceOptions.filter(c => c.effect_group_id).length,
};

// effect type 분포
const typeCount = {};
for (const r of effectGroupsSorted) typeCount[r.type] = (typeCount[r.type] || 0) + 1;
stats.effect_type_distribution = Object.fromEntries(
  Object.entries(typeCount).sort((a, b) => b[1] - a[1])
);

// 컬럼 채움률
const colFill = {};
for (const r of effectGroupsSorted) for (const k of Object.keys(r)) colFill[k] = (colFill[k] || 0) + 1;
stats.column_fill = Object.fromEntries(
  Object.entries(colFill).sort((a, b) => b[1] - a[1])
    .map(([k, c]) => [k, `${c} (${((c/effectGroupsSorted.length)*100).toFixed(0)}%)`])
);

// FK 무결성 검사
const egIds = new Set(effectGroupsSorted.map(r => r.group_id));
const featEgRefs = featDbNew.filter(f => f.effect_group_id).map(f => f.effect_group_id);
const choiceEgRefs = choiceOptions.filter(c => c.effect_group_id).map(c => c.effect_group_id);
const allEgRefs = [...featEgRefs, ...choiceEgRefs];
const referencedEgs = new Set(allEgRefs);

stats.fk_orphan_eg_in_FEAT_DB = featEgRefs.filter(id => !egIds.has(id)).length;
stats.fk_orphan_eg_in_CHOICE_OPTIONS = choiceEgRefs.filter(id => !egIds.has(id)).length;
stats.fk_unused_eg = [...egIds].filter(id => !referencedEgs.has(id)).length;

const choiceIds = new Set(choiceOptions.map(c => c.choice_id));
const featChoiceIds = featDbNew.filter(f => f.choice_id).map(f => f.choice_id);
const referencedChoiceIds = new Set(featChoiceIds);
stats.fk_unused_choice_id = [...choiceIds].filter(id => !referencedChoiceIds.has(id)).length;
stats.choice_ids_without_options = featChoiceIds.filter(id => !choiceIds.has(id)).length;

console.log(JSON.stringify(stats, null, 2));

if (DRY) {
  console.error('\n[dry-run] 파일 미수정.');
  console.error('\n샘플 EFFECT_GROUPS — weapon_familiarity 행 펼침 (Adopted Ancestry / Half-Elf Atavism):');
  console.error(JSON.stringify(effectGroupsSorted.filter(r => r.type === 'weapon_familiarity').slice(0, 6), null, 2));
  console.error('\n샘플 EFFECT_GROUPS — Bard Dedication (target 통합):');
  console.error(JSON.stringify(effectGroupsSorted.filter(r => r.group_id === 'eg-bard-dedication'), null, 2));
  console.error('\n샘플 EFFECT_GROUPS — Hold Mark sun (choiceEffects 분기):');
  console.error(JSON.stringify(effectGroupsSorted.filter(r => r.group_id === 'eg-hold-mark-sun'), null, 2));
  process.exit(0);
}

// ── 파일 쓰기 ──

// 1) feat_db.js 재작성
const featDbHeader = `// ═══════════════════════════════════════════════
//  FEAT_DB — 자동생성 (rebuild_feat_db.js)
//  ancestry/archetype: 기존 수동 데이터 유지
//  class/general/skill: PlayerCore.html 자동 파싱
//  v528~ Phase 1: prereqs → prereq_group_id (PREREQ_GROUPS 외래 참조)
//  v528~ Phase 2: effects/choice/choiceEffects 통합 (FEAT_EFFECTS에서 이주)
//  v528~ Phase 2D: CLASS_FEATURE_NAMES → category='feature', acquisition='auto', source=class_id
//  v532~ Phase 3a: effects → effect_group_id + auto_note + damage_note 분리,
//                  choice → choice_id (CHOICE_OPTIONS 외래 참조), choiceEffects → 옵션 자기 effect_group_id
// ═══════════════════════════════════════════════

`;
fs.writeFileSync(path.join(DEV_DIR, 'feat_db.js'),
  featDbHeader + 'var FEAT_DB = ' + JSON.stringify(featDbNew, null, 2) + ';\n');
console.error(`✓ ${path.join(DEV_DIR, 'feat_db.js')}`);

// 2) cs_data.js: PREREQ_GROUPS 다음에 EFFECT_GROUPS, CHOICE_OPTIONS 삽입
const csDataPath = path.join(DEV_DIR, 'cs_data.js');
let csDataSrc = fs.readFileSync(csDataPath, 'utf8');

function replaceOrInsertConst(src, varName, newArr, headerComment, insertAfterVar) {
  const re = new RegExp(`(^const\\s+${varName}\\s*=\\s*)\\[[\\s\\S]*?\\n\\];`, 'm');
  if (re.test(src)) {
    return src.replace(re, `$1${JSON.stringify(newArr, null, 2)};`);
  }
  const reAfter = new RegExp(`(^const\\s+${insertAfterVar}\\s*=\\s*\\[[\\s\\S]*?\\n\\];)`, 'm');
  if (!reAfter.test(src)) {
    console.error(`[warn] ${insertAfterVar} 블록을 찾지 못함 — ${varName} 삽입 실패`);
    return src;
  }
  const insertText = `\n\n${headerComment}const ${varName} = ${JSON.stringify(newArr, null, 2)};\n`;
  return src.replace(reAfter, `$1${insertText}`);
}

csDataSrc = replaceOrInsertConst(csDataSrc, 'EFFECT_GROUPS', effectGroupsSorted,
  '// ═══════════════════════════════════════════════\n' +
  '//  EFFECT_GROUPS — FEAT_DB.effect_group_id 1:N 정규화 (v532~ Phase 3a)\n' +
  '//  공통 효과 + 옵션별 효과 (choiceEffects)를 단일 테이블에 통합.\n' +
  '//  group_id 패턴: eg-{feat.id} (공통) / eg-{feat.id}-{option.id} (옵션별)\n' +
  '//  컬럼: group_id, type, target (식별자 통합 — skill/spell/feat/action/weapon_name/vision/sense/save),\n' +
  '//        value, bonus_type, condition, tradition, ... (sparse)\n' +
  '//  weapons 배열은 행 펼침 (한 그룹에 weapon_familiarity 행 N개).\n' +
  '//  NOTE: display_note/damage_note는 FEAT_DB.auto_note/damage_note 컬럼으로 흡수.\n' +
  '// ═══════════════════════════════════════════════\n',
  'PREREQ_GROUPS');

csDataSrc = replaceOrInsertConst(csDataSrc, 'CHOICE_OPTIONS', choiceOptions,
  '// ═══════════════════════════════════════════════\n' +
  '//  CHOICE_OPTIONS — FEAT_DB.choice_id 1:N 정규화 (v532~ Phase 3a)\n' +
  '//  옵션 행: choice_id, option_id, option_name, effect_group_id, is_default\n' +
  '//  custom + skill_defaults type만 옵션 행 보유.\n' +
  '//  나머지 type (skill/lore/spell_cantrip/spell_rank/feat_pick/weapon_pick/ancestry_pick/muse_pick/skill_fixed/skill_multi)은\n' +
  '//  런타임 쿼리(filter 메타 활용) — 옵션 행 없음.\n' +
  '// ═══════════════════════════════════════════════\n',
  'EFFECT_GROUPS');

fs.writeFileSync(csDataPath, csDataSrc);
console.error(`✓ ${csDataPath}`);

console.error('\n완료. 다음 단계:');
console.error('  1. node -c dev/feat_db.js dev/cs_data.js');
console.error('  2. cs_calc.js: getEffectRows + getChoiceOptions + _rowToEffect 헬퍼 (target → 원래 컬럼 풀기)');
console.error('  3. cs_feat_effects.js: _getFeatEffectsDef 갱신');
console.error('  4. node tools/audit_text_lookups.js (HIGH 0 유지)');
console.error('  5. 사용자 회귀 테스트');
