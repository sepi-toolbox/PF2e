#!/usr/bin/env node
// ═══════════════════════════════════════════════
//  ONE-SHOT MIGRATION — FEAT_DB v2 Phase 2
//  FEAT_EFFECTS (808 keys) → FEAT_DB.effects/choice/choiceEffects
//
//  - 매칭: name_en === FEAT_EFFECTS key
//  - 기존 FEAT_DB.effects=[] 자리에 FEAT_EFFECTS[name_en].effects 주입
//  - choice/choiceEffects도 동일하게 (있을 때만)
//  - 미매칭 키 출력 (CLASS_FEATURE_NAMES → Phase 2D에서 처리)
//
//  Usage: node tools/migrate_feat_db_v2_phase2.js [--dry]
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

  // 중첩 brace + 문자열 회피 파서로 const 블록 끝 찾기
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

// ── 2) FEAT_DB 로드 ──
function loadFeatDb() {
  const src = fs.readFileSync(path.join(DEV_DIR, 'feat_db.js'), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox);
  return sandbox.FEAT_DB;
}

const FEAT_EFFECTS = extractFeatEffects();
const FEAT_DB = loadFeatDb();

console.error(`FEAT_EFFECTS keys: ${Object.keys(FEAT_EFFECTS).length}`);
console.error(`FEAT_DB rows:     ${FEAT_DB.length}`);

// ── 3) name_en → FEAT_DB 인덱스 (중복 시 첫 항목 우선, 모두 갱신) ──
const featByName = new Map();
for (const f of FEAT_DB) {
  if (!f || !f.name_en) continue;
  if (!featByName.has(f.name_en)) featByName.set(f.name_en, []);
  featByName.get(f.name_en).push(f);
}

// ── 4) 이주 ──
let matched = 0, unmatched = [];
for (const [nameEn, def] of Object.entries(FEAT_EFFECTS)) {
  const targets = featByName.get(nameEn);
  if (!targets || targets.length === 0) {
    unmatched.push(nameEn);
    continue;
  }
  for (const f of targets) {
    if (def.effects) f.effects = def.effects;
    if (def.choice) f.choice = def.choice;
    if (def.choiceEffects) f.choiceEffects = def.choiceEffects;
  }
  matched++;
}

// ── 5) 통계 ──
console.error(`\n매칭: ${matched}`);
console.error(`미매칭: ${unmatched.length}`);
console.error(`(미매칭은 CLASS_FEATURE_NAMES 항목 — Phase 2D에서 처리)\n`);
console.error('미매칭 키 (전체):');
for (const k of unmatched) console.error(`  - ${k}`);

// 효과 통계
const featsWithEffects = FEAT_DB.filter(f => Array.isArray(f.effects) && f.effects.length > 0).length;
const featsWithChoice = FEAT_DB.filter(f => f.choice).length;
const featsWithChoiceEffects = FEAT_DB.filter(f => f.choiceEffects).length;
console.error(`\nFEAT_DB.effects 비어있지 않은 행: ${featsWithEffects}`);
console.error(`FEAT_DB.choice 있는 행: ${featsWithChoice}`);
console.error(`FEAT_DB.choiceEffects 있는 행: ${featsWithChoiceEffects}`);

if (DRY) {
  console.error('\n[dry-run] 파일 미수정.');
  process.exit(0);
}

// ── 6) feat_db.js 재작성 ──
const featDbHeader = `// ═══════════════════════════════════════════════
//  FEAT_DB — 자동생성 (rebuild_feat_db.js)
//  ancestry/archetype: 기존 수동 데이터 유지
//  class/general/skill: PlayerCore.html 자동 파싱
//  v528~ Phase 1: prereqs → prereq_group_id (PREREQ_GROUPS 외래 참조)
//  v528~ Phase 2: effects/choice/choiceEffects 통합 (FEAT_EFFECTS에서 이주)
// ═══════════════════════════════════════════════

`;
fs.writeFileSync(path.join(DEV_DIR, 'feat_db.js'), featDbHeader + 'var FEAT_DB = ' + JSON.stringify(FEAT_DB, null, 2) + ';\n');
console.error(`\n✓ ${path.join(DEV_DIR, 'feat_db.js')}`);

// ── 7) 미매칭 키를 별도 JSON 파일로 (Phase 2D 입력) ──
const unmatchedDef = {};
for (const k of unmatched) unmatchedDef[k] = FEAT_EFFECTS[k];
fs.writeFileSync(path.join(ROOT, '_proposals', 'feat_effects_unmatched.json'), JSON.stringify(unmatchedDef, null, 2));
console.error(`✓ _proposals/feat_effects_unmatched.json (${unmatched.length} keys)`);
