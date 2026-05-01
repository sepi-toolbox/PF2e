#!/usr/bin/env node
// ═══════════════════════════════════════════════
//  ONE-SHOT MIGRATION — BACKGROUNDS 효과 컬럼 → EFFECT_GROUPS (v535, Phase 4b)
//
//  BACKGROUNDS의 효과 컬럼들을 effect_group_id 외래키로 통합.
//  변환 대상 컬럼 (9개):
//    boosts[]            → ability_boost (target=ability enum, value=1) — 행 펼침
//    boost_choices[][]   → ability_boost_choice (target=ability, value=1, group_no) — 행 펼침
//    free_boosts         → free_boost_slots (value=숫자)
//    fixed_skills[]      → skill_trained (target=skill id) — 행 펼침
//    choice_skill_groups → skill_choice (target=skill id, group_no) — 행 펼침
//    fixed_lores[]       → grant_lore (target=한글 lore name) — 행 펼침
//    feat_id             → grant_feat (target=feat id)
//    deity_skill         → deity_skill (마커)
//    deity_lore          → deity_lore (마커)
//
//  BACKGROUNDS 신 컬럼: id/name/en/desc/effect_group_id (5개)
//  group_id 패턴: eg-bg-{id}
//
//  Usage: node tools/migrate_backgrounds_to_eg.js [--dry]
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

const BACKGROUNDS = sb.BACKGROUNDS;
const FEAT_DB = sb.FEAT_DB;
const SKILLS = sb.SKILLS;
const existingEG = sb.EFFECT_GROUPS || [];
console.error(`BACKGROUNDS: ${BACKGROUNDS.length} rows`);

// ── 컬럼 우선순위 (proposal_v3_export.js 기준 + Phase 4b 신규) ──
const COL_PRIORITY = [
  'group_id', 'type', 'target',
  'value', 'group_no', 'bonus_type', 'condition',
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

// ── 검증 헬퍼 ──
const ATTRS = ['str','dex','con','int','wis','cha'];
const skillIds = new Set((SKILLS || []).map(s => s.id));
const featIds = new Set(FEAT_DB.map(f => f.id));

const warnings = [];

// ── 새 EFFECT_GROUPS 행들 ──
const newEGRows = [];
function pushRow(row) { newEGRows.push(sortRowKeys(row)); }

// ── BACKGROUNDS 변환 ──
const newBgDB = BACKGROUNDS.map(b => {
  const out = { id: b.id, name: b.name, en: b.en, desc: b.desc };
  let hasEffects = false;
  const gid = `eg-bg-${b.id}`;

  // boosts[] (고정) — 모든 배경이 빈 배열, 안전망
  if (Array.isArray(b.boosts)) {
    for (const a of b.boosts) {
      if (!ATTRS.includes(a)) warnings.push(`${b.id} boosts: 알 수 없는 능력치 "${a}"`);
      pushRow({ group_id: gid, type: 'ability_boost', target: a, value: 1 });
      hasEffects = true;
    }
  }

  // boost_choices[][] — 그룹별 group_no 부여 (1부터)
  if (Array.isArray(b.boost_choices)) {
    b.boost_choices.forEach((group, gi) => {
      if (!Array.isArray(group) || group.length === 0) return;
      const gno = gi + 1;
      for (const a of group) {
        if (!ATTRS.includes(a)) warnings.push(`${b.id} boost_choices: 알 수 없는 능력치 "${a}"`);
        pushRow({ group_id: gid, type: 'ability_boost_choice', target: a, value: 1, group_no: gno });
        hasEffects = true;
      }
    });
  }

  // free_boosts (숫자)
  if (b.free_boosts && b.free_boosts > 0) {
    pushRow({ group_id: gid, type: 'free_boost_slots', value: b.free_boosts });
    hasEffects = true;
  }

  // fixed_skills[] — skill_trained
  if (Array.isArray(b.fixed_skills)) {
    for (const sid of b.fixed_skills) {
      if (!skillIds.has(sid)) warnings.push(`${b.id} fixed_skills: 알 수 없는 skill id "${sid}"`);
      pushRow({ group_id: gid, type: 'skill_trained', target: sid });
      hasEffects = true;
    }
  }

  // choice_skill_groups[][] — skill_choice with group_no
  if (Array.isArray(b.choice_skill_groups)) {
    b.choice_skill_groups.forEach((group, gi) => {
      if (!Array.isArray(group) || group.length === 0) return;
      const gno = gi + 1;
      for (const sid of group) {
        if (!skillIds.has(sid)) warnings.push(`${b.id} choice_skill_groups: 알 수 없는 skill id "${sid}"`);
        pushRow({ group_id: gid, type: 'skill_choice', target: sid, group_no: gno });
        hasEffects = true;
      }
    });
  }

  // fixed_lores[] — grant_lore (target=한글)
  if (Array.isArray(b.fixed_lores)) {
    for (const loreName of b.fixed_lores) {
      pushRow({ group_id: gid, type: 'grant_lore', target: loreName });
      hasEffects = true;
    }
  }

  // feat_id — grant_feat
  if (b.feat_id) {
    if (!featIds.has(b.feat_id)) warnings.push(`${b.id} feat_id: FEAT_DB 미등재 "${b.feat_id}"`);
    pushRow({ group_id: gid, type: 'grant_feat', target: b.feat_id });
    hasEffects = true;
  }

  // deity_skill / deity_lore — 마커
  if (b.deity_skill) {
    pushRow({ group_id: gid, type: 'deity_skill' });
    hasEffects = true;
  }
  if (b.deity_lore) {
    pushRow({ group_id: gid, type: 'deity_lore' });
    hasEffects = true;
  }

  if (hasEffects) out.effect_group_id = gid;

  return out;
});

// ── 기존 EFFECT_GROUPS + 신규 ──
const allEG = [...existingEG, ...newEGRows];

// ── 통계 ──
const typeCount = {};
for (const r of newEGRows) typeCount[r.type] = (typeCount[r.type] || 0) + 1;

const stats = {
  bg_total: newBgDB.length,
  bg_with_effects: newBgDB.filter(b => b.effect_group_id).length,
  bg_without_effects: newBgDB.filter(b => !b.effect_group_id).map(b => b.id),
  effect_groups_added_rows: newEGRows.length,
  effect_groups_total: allEG.length,
  effect_groups_distinct_new: new Set(newEGRows.map(r => r.group_id)).size,
  type_distribution_new: typeCount,
  warnings: warnings.length,
};

// FK 무결성
const allEGIds = new Set(allEG.map(r => r.group_id));
const bgEGRefs = newBgDB.filter(b => b.effect_group_id).map(b => b.effect_group_id);
stats.fk_orphan_bg = bgEGRefs.filter(id => !allEGIds.has(id)).length;

console.log(JSON.stringify(stats, null, 2));
if (warnings.length) {
  console.error('\n경고:');
  warnings.forEach(w => console.error('  -', w));
}

if (DRY) {
  console.error('\n[dry-run] 파일 미수정.');
  const sample = (id) => {
    const b = newBgDB.find(x => x.id === id);
    console.error(`\n샘플 — ${id} (${b?.name}):`);
    console.error(JSON.stringify(b, null, 2));
    console.error('  EG 행:', JSON.stringify(newEGRows.filter(r => r.group_id === `eg-bg-${id}`), null, 2));
  };
  sample('acolyte');           // 일반 (boost_choice + free_boost + skill + lore + feat)
  sample('hermit');            // choice_skill_groups
  sample('scholar');           // choice_skill_groups (4가지 옵션)
  sample('raised-by-belief');  // deity_skill + deity_lore (특수)
  process.exit(0);
}

// ── 파일 쓰기 ──
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

csDataSrc = replaceConst(csDataSrc, 'BACKGROUNDS', newBgDB);
csDataSrc = replaceConst(csDataSrc, 'EFFECT_GROUPS', allEG);

fs.writeFileSync(csDataPath, csDataSrc);
console.error(`✓ ${csDataPath}`);
console.error('\n다음: cs_calc.js getBackgroundEffects 헬퍼 + 호출처 갱신');
