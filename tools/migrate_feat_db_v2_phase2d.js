#!/usr/bin/env node
// ═══════════════════════════════════════════════
//  ONE-SHOT MIGRATION — FEAT_DB v2 Phase 2D
//  CLASS_FEATURE_NAMES (128 entries) → FEAT_DB (category='feature', acquisition='auto', source=class_id)
//
//  - 각 클래스 특성을 FEAT_DB row로 추가
//  - id: slugify(name_en)+'-'+class_id (중복 방지)
//  - effects: 매칭 FEAT_EFFECTS[name_en] 주입
//  - subclass-tagged 특성(서브클래스 부여 항목)은 SUBCLASS_DB에 이미 있으니 제외 검토
//
//  Usage: node tools/migrate_feat_db_v2_phase2d.js [--dry]
// ═══════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DEV_DIR = path.join(ROOT, 'dev');
const DRY = process.argv.includes('--dry');

// ── 1) FEAT_EFFECTS 추출 (cs_feat_effects.js의 const 블록만 평가) ──
function extractFeatEffects() {
  const src = fs.readFileSync(path.join(DEV_DIR, 'cs_feat_effects.js'), 'utf8');
  const startMarker = 'const FEAT_EFFECTS = {';
  const startIdx = src.indexOf(startMarker);
  if (startIdx < 0) throw new Error('FEAT_EFFECTS const not found');

  let depth = 0;
  let inString = false, strChar = '', escapeNext = false;
  let endIdx = -1;
  const objStart = startIdx + 'const FEAT_EFFECTS = '.length;
  for (let i = objStart; i < src.length; i++) {
    const c = src[i];
    if (escapeNext) { escapeNext = false; continue; }
    if (inString) {
      if (c === '\\') escapeNext = true;
      else if (c === strChar) inString = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inString = true; strChar = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { endIdx = i + 1; break; } }
  }
  if (endIdx < 0) throw new Error('FEAT_EFFECTS const block not closed');

  const block = 'var FEAT_EFFECTS = ' + src.substring(objStart, endIdx) + ';';
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(block, sandbox);
  return sandbox.FEAT_EFFECTS;
}

// ── 2) class_features_db.js 로드 ──
function loadClassFeatures() {
  const src = fs.readFileSync(path.join(DEV_DIR, 'class_features_db.js'), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return sandbox;
}

// ── 3) FEAT_DB 로드 ──
function loadFeatDb() {
  const src = fs.readFileSync(path.join(DEV_DIR, 'feat_db.js'), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return sandbox.FEAT_DB;
}

const FEAT_EFFECTS = extractFeatEffects();
const cfdb = loadClassFeatures();
const FEAT_DB = loadFeatDb();
const CFN = cfdb.CLASS_FEATURE_NAMES;

console.error(`CLASS_FEATURE_NAMES classes: ${Object.keys(CFN).length}`);
let totalCfn = 0;
for (const arr of Object.values(CFN)) totalCfn += arr.length;
console.error(`CLASS_FEATURE_NAMES entries: ${totalCfn}`);
console.error(`FEAT_DB rows (before): ${FEAT_DB.length}`);

// ── 4) slugify ──
function slugify(s) {
  return (s || '').toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ── 5) 기존 ID 풀 (충돌 방지) ──
const existingIds = new Set(FEAT_DB.filter(f => f.id).map(f => f.id));

// ── 6) CLASS_FEATURE_NAMES → FEAT_DB row 변환 ──
const newRows = [];
let withEffects = 0;
for (const [classId, arr] of Object.entries(CFN)) {
  for (const f of arr) {
    // id: name_en 슬러그 + classId 접미사 (충돌 방지)
    let id = `${slugify(f.name_en)}-${classId}`;
    if (existingIds.has(id)) {
      // 매우 드문 충돌: 숫자 접미사
      let i = 2;
      while (existingIds.has(`${id}-${i}`)) i++;
      id = `${id}-${i}`;
    }
    existingIds.add(id);

    const fxDef = FEAT_EFFECTS[f.name_en];
    const row = {
      id,
      name_ko: f.name_ko,
      name_en: f.name_en,
      feat_level: f.lv,
      category: 'feature',
      acquisition: 'auto',
      source: classId,
      prereq_group_id: '',
      traits: [],
      desc: f.desc || '',
      effects: fxDef?.effects || [],
    };
    // CLASS_FEATURE_NAMES에 id/type 메타가 있으면 보존 (cs_modal에서 검색 키로 사용)
    if (f.id) row.feature_legacy_id = f.id;
    if (f.type) row.feature_type = f.type;
    if (fxDef?.choice) row.choice = fxDef.choice;
    if (fxDef?.choiceEffects) row.choiceEffects = fxDef.choiceEffects;
    if (fxDef?.effects?.length) withEffects++;
    newRows.push(row);
  }
}

console.error(`\n생성된 FEAT_DB feature 행: ${newRows.length}`);
console.error(`  - effects 주입됨: ${withEffects}`);
console.error(`  - effects 비어있음: ${newRows.length - withEffects}`);

// ── 7) FEAT_DB에 append ──
const FEAT_DB_NEW = [...FEAT_DB, ...newRows];

if (DRY) {
  console.error('\n[dry-run] 파일 미수정.');
  console.error('샘플 새 행 (앞 3개):');
  for (const r of newRows.slice(0, 3)) {
    console.error(JSON.stringify(r, null, 2));
  }
  process.exit(0);
}

// ── 8) feat_db.js 재작성 ──
const featDbHeader = `// ═══════════════════════════════════════════════
//  FEAT_DB — 자동생성 (rebuild_feat_db.js)
//  ancestry/archetype: 기존 수동 데이터 유지
//  class/general/skill: PlayerCore.html 자동 파싱
//  v528~ Phase 1: prereqs → prereq_group_id (PREREQ_GROUPS 외래 참조)
//  v528~ Phase 2: effects/choice/choiceEffects 통합 (FEAT_EFFECTS에서 이주)
//  v528~ Phase 2D: CLASS_FEATURE_NAMES → category='feature', acquisition='auto', source=class_id
// ═══════════════════════════════════════════════

`;
fs.writeFileSync(path.join(DEV_DIR, 'feat_db.js'), featDbHeader + 'var FEAT_DB = ' + JSON.stringify(FEAT_DB_NEW, null, 2) + ';\n');
console.error(`✓ ${path.join(DEV_DIR, 'feat_db.js')} (${FEAT_DB_NEW.length} rows)`);

// ── 9) class_features_db.js의 CLASS_FEATURE_NAMES → derived const로 교체 ──
const cfdbSrc = fs.readFileSync(path.join(DEV_DIR, 'class_features_db.js'), 'utf8');
// 기존 var CLASS_FEATURE_NAMES = { ... }; 블록 찾기
const startMarker = 'var CLASS_FEATURE_NAMES = {';
const startIdx = cfdbSrc.indexOf(startMarker);
if (startIdx < 0) {
  console.error('[warn] CLASS_FEATURE_NAMES 시작 마커를 찾지 못함. 수동 갱신 필요.');
} else {
  let depth = 0, inString = false, strChar = '', escapeNext = false, endIdx = -1;
  const objStart = startIdx + 'var CLASS_FEATURE_NAMES = '.length;
  for (let i = objStart; i < cfdbSrc.length; i++) {
    const c = cfdbSrc[i];
    if (escapeNext) { escapeNext = false; continue; }
    if (inString) {
      if (c === '\\') escapeNext = true;
      else if (c === strChar) inString = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inString = true; strChar = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { endIdx = i + 1; break; } }
  }
  // 세미콜론 포함
  while (endIdx < cfdbSrc.length && cfdbSrc[endIdx] !== ';') endIdx++;
  endIdx++;

  const replacement = `var CLASS_FEATURE_NAMES = (function() {
  // v528~ Phase 2D: FEAT_DB에서 파생 (category='feature' + acquisition='auto' + source=class_id)
  const out = {};
  if (typeof FEAT_DB === 'undefined') return out;
  for (const f of FEAT_DB) {
    if (!f || f.category !== 'feature' || f.acquisition !== 'auto' || !f.source) continue;
    if (!out[f.source]) out[f.source] = [];
    const entry = { lv: f.feat_level, name_ko: f.name_ko, name_en: f.name_en, desc: f.desc };
    if (f.feature_legacy_id) entry.id = f.feature_legacy_id;
    if (f.feature_type) entry.type = f.feature_type;
    out[f.source].push(entry);
  }
  // 레벨 정렬
  for (const k of Object.keys(out)) out[k].sort((a, b) => a.lv - b.lv);
  return out;
})();`;

  const newSrc = cfdbSrc.substring(0, startIdx) + replacement + cfdbSrc.substring(endIdx);
  fs.writeFileSync(path.join(DEV_DIR, 'class_features_db.js'), newSrc);
  console.error(`✓ ${path.join(DEV_DIR, 'class_features_db.js')} (CLASS_FEATURE_NAMES → derived)`);
}
