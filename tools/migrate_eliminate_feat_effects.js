#!/usr/bin/env node
// ═══════════════════════════════════════════════
//  ONE-SHOT MIGRATION — FEAT_EFFECTS 완전 제거 (v533)
//
//  v532 Phase 3a 후속 작업:
//    - FEAT_EFFECTS const(cs_feat_effects.js)의 활성 키 49개를 FEAT_DB로 흡수
//    - placeholder row 등재 (id=슬러그, name_ko/desc='' — 사용자 보강용)
//    - 효과는 EFFECT_GROUPS / CHOICE_OPTIONS / FEAT_DB.auto_note / FEAT_DB.damage_note로 분배
//      (v532 Phase 3a 모델과 동일)
//
//  Usage: node tools/migrate_eliminate_feat_effects.js [--dry]
// ═══════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DEV = path.join(ROOT, 'dev');
const DRY = process.argv.includes('--dry');

// ── DB 로드 ──
const sb = { window: {}, console };
vm.createContext(sb);
for (const file of ['cs_data.js', 'feat_db.js']) {
  let src = fs.readFileSync(path.join(DEV, file), 'utf8');
  src = src.replace(/^const\s+/gm, 'var ').replace(/^let\s+/gm, 'var ');
  vm.runInContext(src, sb, { filename: file });
}

// FEAT_EFFECTS const 추출
function extractFeatEffects() {
  const src = fs.readFileSync(path.join(DEV, 'cs_feat_effects.js'), 'utf8');
  const startMarker = 'const FEAT_EFFECTS = {';
  const sIdx = src.indexOf(startMarker);
  if (sIdx < 0) throw new Error('FEAT_EFFECTS const not found');
  let depth = 0, inStr = false, sc = '', esc = false, eIdx = -1;
  const objStart = sIdx + 'const FEAT_EFFECTS = '.length;
  for (let i = objStart; i < src.length; i++) {
    const c = src[i];
    if (esc) { esc = false; continue; }
    if (inStr) { if (c === '\\') esc = true; else if (c === sc) inStr = false; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = true; sc = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { eIdx = i + 1; break; } }
  }
  const block = 'var FEAT_EFFECTS = ' + src.substring(objStart, eIdx) + ';';
  const sb2 = {};
  vm.createContext(sb2);
  vm.runInContext(block, sb2);
  return { fe: sb2.FEAT_EFFECTS, src, sIdx, eIdx, blockStart: objStart };
}

const { fe: FEAT_EFFECTS, src: feSrc, sIdx, eIdx } = extractFeatEffects();
const FEAT_DB = sb.FEAT_DB;
const featByEn = new Set(FEAT_DB.map(f => f.name_en).filter(Boolean));
const activeKeys = Object.keys(FEAT_EFFECTS).filter(k => !featByEn.has(k));

console.error(`FEAT_DB rows: ${FEAT_DB.length}`);
console.error(`FEAT_EFFECTS keys: ${Object.keys(FEAT_EFFECTS).length}`);
console.error(`활성 키 (FEAT_DB 미등재): ${activeKeys.length}`);

// ── 슬러그 생성 ──
function slugify(name) {
  return name.toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── 기존 cs_data.js의 EFFECT_GROUPS / CHOICE_OPTIONS 그대로 가져오기 ──
const existingEG = sb.EFFECT_GROUPS || [];
const existingCO = sb.CHOICE_OPTIONS || [];
const newEG = [...existingEG];
const newCO = [...existingCO];

// ── 효과 변환 (v532 Phase 3a와 동일 로직) ──
const NOTE_TYPES = new Set(['display_note', 'damage_note']);
const TARGET_COLS = ['skill', 'spell', 'feat', 'action', 'weapon_name', 'vision', 'sense', 'save'];

function effectToRows(groupId, e) {
  if (!e || NOTE_TYPES.has(e.type)) return [];
  const rows = [];
  if (Array.isArray(e.weapons) && e.weapons.length) {
    for (const w of e.weapons) {
      const row = { group_id: groupId, type: e.type, target: w };
      for (const k of Object.keys(e)) {
        if (k === 'weapons' || k === 'type') continue;
        if (TARGET_COLS.includes(k)) continue;
        row[k] = e[k];
      }
      rows.push(row);
    }
    return rows;
  }
  const row = { group_id: groupId, type: e.type };
  for (const c of TARGET_COLS) {
    if (e[c] !== undefined && e[c] !== null && e[c] !== '') {
      row.target = e[c];
      break;
    }
  }
  for (const k of Object.keys(e)) {
    if (k === 'type') continue;
    if (TARGET_COLS.includes(k)) continue;
    row[k] = e[k];
  }
  rows.push(row);
  return rows;
}

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

function pushEffects(groupId, arr) {
  if (!Array.isArray(arr)) return 0;
  let n = 0;
  for (const e of arr) {
    const rows = effectToRows(groupId, e);
    for (const r of rows) { newEG.push(sortRowKeys(r)); n++; }
  }
  return n;
}

function extractNotes(arr) {
  const out = { auto_note: '', damage_note: null };
  if (!Array.isArray(arr)) return out;
  for (const e of arr) {
    if (!e) continue;
    if (e.type === 'display_note') out.auto_note = e.text || '';
    else if (e.type === 'damage_note') {
      const d = {};
      for (const k of Object.keys(e)) if (k !== 'type') d[k] = e[k];
      out.damage_note = d;
    }
  }
  return out;
}

// ── 활성 키 49개 → FEAT_DB row 생성 ──
const FEAT_NEW_COLUMN_ORDER = [
  'id', 'name_ko', 'name_en', 'feat_level', 'category',
  'acquisition', 'source', 'prereq_group_id',
  'auto_note', 'damage_note',
  'effect_group_id',
  'choice_id', 'choice_kind', 'choice_label', 'choice_filter',
  'prerequisites', 'traits', 'actionCost',
  'desc', 'summary',
  'repeatable',
];

const newFeatRows = [];
for (const nameEn of activeKeys) {
  const def = FEAT_EFFECTS[nameEn];
  const id = slugify(nameEn);

  // 효과 처리
  const notes = extractNotes(def.effects);
  let effect_group_id = '';
  if (Array.isArray(def.effects) && def.effects.some(e => e && !NOTE_TYPES.has(e.type))) {
    effect_group_id = `eg-${id}`;
    pushEffects(effect_group_id, def.effects);
  }

  // choice 처리
  let choice_id = '', choice_kind = '', choice_label = '';
  let choice_filter = null;
  if (def.choice) {
    choice_id = `cho-${id}`;
    choice_kind = def.choice.type || '';
    choice_label = def.choice.label || '';
    const filter = {};
    for (const k of Object.keys(def.choice)) {
      if (['type', 'label', 'options', 'defaults'].includes(k)) continue;
      filter[k] = def.choice[k];
    }
    if (Object.keys(filter).length) choice_filter = filter;

    if (def.choice.type === 'custom' && Array.isArray(def.choice.options)) {
      for (const opt of def.choice.options) {
        let optEgId = '';
        if (def.choiceEffects && def.choiceEffects[opt.id]) {
          optEgId = `eg-${id}-${opt.id}`;
          pushEffects(optEgId, def.choiceEffects[opt.id]);
        }
        newCO.push({
          choice_id, option_id: opt.id, option_name: opt.name,
          effect_group_id: optEgId, is_default: false,
        });
      }
    } else if (def.choice.type === 'skill_defaults' && Array.isArray(def.choice.defaults)) {
      for (const sk of def.choice.defaults) {
        newCO.push({
          choice_id, option_id: sk, option_name: sk,
          effect_group_id: '', is_default: true,
        });
      }
    }
  }

  // FEAT_DB row 빌드 (placeholder — 사용자가 Excel에서 메타 보강)
  const row = {};
  row.id = id;
  row.name_ko = nameEn;       // placeholder (영문 그대로)
  row.name_en = nameEn;
  row.feat_level = 1;          // 기본값 (PC1/PC2 본문 확인 후 사용자가 보강)
  row.category = 'ancestry';   // 기본 추정 — 49건 대부분이 ancestry/skill 재주
  row.acquisition = 'choice';
  row.source = '';
  row.prereq_group_id = '';
  if (notes.auto_note) row.auto_note = notes.auto_note;
  if (notes.damage_note) row.damage_note = notes.damage_note;
  if (effect_group_id) row.effect_group_id = effect_group_id;
  if (choice_id) row.choice_id = choice_id;
  if (choice_kind) row.choice_kind = choice_kind;
  if (choice_label) row.choice_label = choice_label;
  if (choice_filter) row.choice_filter = choice_filter;
  row.traits = [];
  row.desc = '';
  row.summary = '';

  // 컬럼 순서 정렬
  const sorted = {};
  for (const k of FEAT_NEW_COLUMN_ORDER) if (row[k] !== undefined) sorted[k] = row[k];
  for (const k of Object.keys(row)) if (sorted[k] === undefined) sorted[k] = row[k];

  newFeatRows.push(sorted);
}

// 기존 FEAT_DB + 신규 49 row
const featDbNew = [...FEAT_DB, ...newFeatRows];

// ── 통계 ──
const stats = {
  feat_db_total: featDbNew.length,
  feat_db_added: newFeatRows.length,
  effect_groups_total: newEG.length,
  effect_groups_added: newEG.length - existingEG.length,
  choice_options_total: newCO.length,
  choice_options_added: newCO.length - existingCO.length,
};

// FK 무결성
const egIds = new Set(newEG.map(r => r.group_id));
const featEgRefs = featDbNew.filter(f => f.effect_group_id).map(f => f.effect_group_id);
const choiceEgRefs = newCO.filter(c => c.effect_group_id).map(c => c.effect_group_id);
const allEgRefs = new Set([...featEgRefs, ...choiceEgRefs]);
stats.fk_orphan_eg_in_FEAT_DB = featEgRefs.filter(id => !egIds.has(id)).length;
stats.fk_orphan_eg_in_CHOICE_OPTIONS = choiceEgRefs.filter(id => !egIds.has(id)).length;
stats.fk_unused_eg = [...egIds].filter(id => !allEgRefs.has(id)).length;

console.log(JSON.stringify(stats, null, 2));

if (DRY) {
  console.error('\n[dry-run] 파일 미수정.');
  console.error('\n샘플 신규 FEAT_DB row 3건:');
  console.error(JSON.stringify(newFeatRows.slice(0, 3), null, 2));
  console.error('\n샘플 신규 EFFECT_GROUPS (Leshy Superstition):');
  console.error(JSON.stringify(newEG.filter(r => r.group_id === 'eg-leshy-superstition'), null, 2));
  console.error('\n샘플 신규 EFFECT_GROUPS (Vengeful Hatred 분기):');
  console.error(JSON.stringify(newEG.filter(r => r.group_id && r.group_id.startsWith('eg-vengeful-hatred')), null, 2));
  process.exit(0);
}

// ── 1) feat_db.js 재작성 ──
const featDbHeader = `// ═══════════════════════════════════════════════
//  FEAT_DB — 자동생성 (rebuild_feat_db.js)
//  ancestry/archetype: 기존 수동 데이터 유지
//  class/general/skill: PlayerCore.html 자동 파싱
//  v528~ Phase 1: prereqs → prereq_group_id (PREREQ_GROUPS 외래 참조)
//  v528~ Phase 2: effects/choice/choiceEffects 통합 (FEAT_EFFECTS에서 이주)
//  v528~ Phase 2D: CLASS_FEATURE_NAMES → category='feature', acquisition='auto', source=class_id
//  v532~ Phase 3a: effects → effect_group_id + auto_note + damage_note 분리
//  v533~ FEAT_EFFECTS 완전 제거: PC2 미등재 49 활성키를 placeholder row로 등재 (사용자 메타 보강용)
// ═══════════════════════════════════════════════

`;
fs.writeFileSync(path.join(DEV, 'feat_db.js'),
  featDbHeader + 'var FEAT_DB = ' + JSON.stringify(featDbNew, null, 2) + ';\n');
console.error(`✓ ${path.join(DEV, 'feat_db.js')}`);

// ── 2) cs_data.js EFFECT_GROUPS, CHOICE_OPTIONS 갱신 ──
const csDataPath = path.join(DEV, 'cs_data.js');
let csDataSrc = fs.readFileSync(csDataPath, 'utf8');

function replaceConst(src, varName, newArr) {
  const re = new RegExp(`(^const\\s+${varName}\\s*=\\s*)\\[[\\s\\S]*?\\n\\];`, 'm');
  if (!re.test(src)) {
    console.error(`[warn] ${varName} 블록을 찾지 못함`);
    return src;
  }
  return src.replace(re, `$1${JSON.stringify(newArr, null, 2)};`);
}

csDataSrc = replaceConst(csDataSrc, 'EFFECT_GROUPS', newEG);
csDataSrc = replaceConst(csDataSrc, 'CHOICE_OPTIONS', newCO);
fs.writeFileSync(csDataPath, csDataSrc);
console.error(`✓ ${csDataPath}`);

// ── 3) cs_feat_effects.js: FEAT_EFFECTS const + fallback 코드 제거 ──
const fePath = path.join(DEV, 'cs_feat_effects.js');
let feNewSrc = fs.readFileSync(fePath, 'utf8');

// FEAT_EFFECTS const 블록 제거 (한 줄 위까지 주석 포함하여 잘라낼지 결정)
// 주석 시작점 찾기 (그 위 4-5줄 주석 block 포함)
const beforeStart = feNewSrc.lastIndexOf('// ═══════════════════════════════════════════════', sIdx);
let removeStart = beforeStart;
if (removeStart < 0 || sIdx - beforeStart > 500) removeStart = sIdx;
// 끝 ; 까지 포함
let removeEnd = eIdx;
while (removeEnd < feNewSrc.length && feNewSrc[removeEnd] !== ';') removeEnd++;
if (feNewSrc[removeEnd] === ';') removeEnd++;
// 다음 빈 줄까지 포함
while (removeEnd < feNewSrc.length && (feNewSrc[removeEnd] === '\n' || feNewSrc[removeEnd] === '\r')) removeEnd++;

const removed = feNewSrc.substring(removeStart, removeEnd);
console.error(`\nFEAT_EFFECTS const 제거: ${removeEnd - removeStart} bytes`);
feNewSrc = feNewSrc.substring(0, removeStart) + feNewSrc.substring(removeEnd);

// _getFeatEffectsDef의 fallback 라인 제거
feNewSrc = feNewSrc.replace(
  /\s*\/\/ PC2 미등재용 legacy fallback\s*\n\s*if \(typeof FEAT_EFFECTS !== 'undefined'\) return FEAT_EFFECTS\[nameEn\];\s*\n\s*return null;\s*\n/,
  '\n  return null;\n'
);
// 또 다른 fallback 패턴 (더 일반적)
feNewSrc = feNewSrc.replace(
  /return \(typeof FEAT_EFFECTS !== 'undefined'\) \? FEAT_EFFECTS\[nameEn\] : null;/,
  'return null;'
);

fs.writeFileSync(fePath, feNewSrc);
console.error(`✓ ${fePath}`);

// ── 4) db_schema.js에서 FEAT_EFFECTS 시트 제거 ──
const schemaPath = path.join(__dirname, 'db_schema.js');
let schemaSrc = fs.readFileSync(schemaPath, 'utf8');
schemaSrc = schemaSrc.replace(
  /\s*{\s*sheet:'FEAT_EFFECTS'[^}]*},?\s*\n/,
  '\n'
);
fs.writeFileSync(schemaPath, schemaSrc);
console.error(`✓ ${schemaPath}`);

console.error('\n완료. 다음 단계:');
console.error('  1. node -c dev/*.js (syntax 검증)');
console.error('  2. node tools/audit_text_lookups.js (HIGH 0)');
console.error('  3. node tools/export_to_excel.js (FEAT_EFFECTS 시트 사라졌는지 확인)');
console.error('  4. 버전 범프 v533 + 사용자 회귀 테스트');
