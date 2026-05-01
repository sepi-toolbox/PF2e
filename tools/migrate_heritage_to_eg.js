#!/usr/bin/env node
// ═══════════════════════════════════════════════
//  ONE-SHOT MIGRATION — HERITAGE_DB 효과 컬럼 → EFFECT_GROUPS (v534, Phase 4a)
//
//  HERITAGE_DB의 효과 컬럼들을 effect_group_id 외래키로 통합.
//  변환 대상 컬럼 (12개):
//    vision           → vision_upgrade (target=값)
//    hpBonus          → hp_bonus (value=숫자)
//    restBonusHp      → rest_bonus_hp (value=true)
//    extraLanguages   → extra_languages (value=숫자)
//    extraSenses      → extra_sense (sense=텍스트)
//    resistances[]    → resistance (target=damage type, value/formula)
//    grantWeapon      → grant_weapon (target=무기명, weapon_category, damage, traits)
//    grantSkills[]    → skill_trained (target=skill id) — 행 펼침
//    grantFeats[]     → grant_feat (target=feat id, default_choice) — 행 펼침
//    innateSpells[]   → grant_innate_spell (target=주문명, tradition, spellType, uses) — 행 펼침
//    versatile        → versatile_ancestry (value=true)
//    extraFeats[]     → extra_feat_category (target=카테고리/혈통명) — 행 펼침
//
//  HERITAGE_DB 신 컬럼: effect_group_id
//  group_id 패턴: eg-heritage-{id}
//
//  Usage: node tools/migrate_heritage_to_eg.js [--dry]
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

const HERITAGE_DB = sb.HERITAGE_DB;
const FEAT_DB = sb.FEAT_DB;
const existingEG = sb.EFFECT_GROUPS || [];
console.error(`HERITAGE_DB: ${HERITAGE_DB.length} rows`);

// ── 슬러그 헬퍼 (grantFeats의 한글명/영문명 → id 매칭) ──
function slug(s) {
  return s.toLowerCase().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function findFeatId(text) {
  if (!text) return text;
  // 객체 형태 {id: 'xxx', choice: 'yyy'}
  if (typeof text === 'object' && text.id) return text;  // 보존
  if (typeof text !== 'string') return text;
  // 영문 슬러그면 그대로
  const direct = FEAT_DB.find(f => f.id === text);
  if (direct) return text;
  // 영문명
  const byEn = FEAT_DB.find(f => f.name_en === text);
  if (byEn) return byEn.id;
  // 한글명
  const byKo = FEAT_DB.find(f => f.name_ko === text || f.name_ko === text + ' (영문)');
  if (byKo) return byKo.id;
  // 슬러그화
  return slug(text);
}

// ── 컬럼 우선순위 (proposal_v3_export.js 기준) ──
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

// ── 새 EFFECT_GROUPS 행들 ──
const newEGRows = [];
function pushRow(row) { newEGRows.push(sortRowKeys(row)); }

// ── HERITAGE_DB 변환 ──
const newHerDB = HERITAGE_DB.map(h => {
  const out = { id: h.id, name_ko: h.name_ko, name_en: h.name_en, ancestry: h.ancestry, summary: h.summary };
  let hasEffects = false;
  const gid = `eg-heritage-${h.id}`;

  if (h.vision) { pushRow({ group_id: gid, type: 'vision_upgrade', target: h.vision }); hasEffects = true; }
  if (h.hpBonus) { pushRow({ group_id: gid, type: 'hp_bonus', value: h.hpBonus }); hasEffects = true; }
  if (h.restBonusHp) { pushRow({ group_id: gid, type: 'rest_bonus_hp', value: true }); hasEffects = true; }
  if (h.extraLanguages) { pushRow({ group_id: gid, type: 'extra_languages', value: h.extraLanguages }); hasEffects = true; }
  if (h.extraSenses) { pushRow({ group_id: gid, type: 'extra_sense', sense: h.extraSenses }); hasEffects = true; }
  if (h.versatile) { pushRow({ group_id: gid, type: 'versatile_ancestry', value: true }); hasEffects = true; }

  if (Array.isArray(h.resistances)) {
    for (const r of h.resistances) {
      const row = { group_id: gid, type: 'resistance', target: r.type };
      if (r.formula) row.value = r.formula;
      else if (r.value !== undefined) row.value = r.value;
      pushRow(row); hasEffects = true;
    }
  }

  if (h.grantWeapon) {
    const w = h.grantWeapon;
    const row = { group_id: gid, type: 'grant_weapon', target: w.name };
    if (w.dmg) row.damage = w.dmg;
    if (w.traits) row.traits = w.traits;
    if (w.category) row.weapon_category = w.category;
    pushRow(row); hasEffects = true;
  }

  if (Array.isArray(h.grantSkills)) {
    for (const sid of h.grantSkills) {
      pushRow({ group_id: gid, type: 'skill_trained', target: sid }); hasEffects = true;
    }
  }

  if (Array.isArray(h.grantFeats)) {
    for (const entry of h.grantFeats) {
      let featId, dc;
      if (typeof entry === 'object' && entry.id) {
        featId = entry.id; dc = entry.choice;
      } else {
        featId = findFeatId(entry);
      }
      const row = { group_id: gid, type: 'grant_feat', target: featId };
      if (dc) row.default_choice = dc;
      pushRow(row); hasEffects = true;
    }
  }

  if (Array.isArray(h.innateSpells)) {
    for (const sp of h.innateSpells) {
      const row = { group_id: gid, type: 'grant_innate_spell', target: sp.name };
      if (sp.tradition) row.tradition = sp.tradition;
      if (sp.type) row.spellType = sp.type;
      if (sp.uses) row.uses = sp.uses;
      pushRow(row); hasEffects = true;
    }
  }

  if (Array.isArray(h.extraFeats)) {
    for (const cat of h.extraFeats) {
      pushRow({ group_id: gid, type: 'extra_feat_category', target: cat });
      hasEffects = true;
    }
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
  heritage_total: newHerDB.length,
  heritage_with_effects: newHerDB.filter(h => h.effect_group_id).length,
  effect_groups_added_rows: newEGRows.length,
  effect_groups_total: allEG.length,
  effect_groups_distinct_new: new Set(newEGRows.map(r => r.group_id)).size,
  type_distribution_new: typeCount,
};

// FK 무결성
const allEGIds = new Set(allEG.map(r => r.group_id));
const heritageEGRefs = newHerDB.filter(h => h.effect_group_id).map(h => h.effect_group_id);
stats.fk_orphan_heritage = heritageEGRefs.filter(id => !allEGIds.has(id)).length;

console.log(JSON.stringify(stats, null, 2));

if (DRY) {
  console.error('\n[dry-run] 파일 미수정.');
  console.error('\n샘플 변환 — leaf-leshy (효과 없음):');
  console.error(JSON.stringify(newHerDB.find(h => h.id === 'leaf-leshy'), null, 2));
  console.error('\n샘플 변환 — cavern-elf (vision):');
  console.error(JSON.stringify(newHerDB.find(h => h.id === 'cavern-elf'), null, 2));
  console.error('  EG 행:', JSON.stringify(newEGRows.filter(r => r.group_id === 'eg-heritage-cavern-elf')));
  console.error('\n샘플 변환 — battle-ready-orc (skill_trained + grant_feat):');
  console.error(JSON.stringify(newHerDB.find(h => h.id === 'battle-ready-orc'), null, 2));
  console.error('  EG 행:', JSON.stringify(newEGRows.filter(r => r.group_id === 'eg-heritage-battle-ready-orc'), null, 2));
  console.error('\n샘플 변환 — changeling (versatile + extra_feat_category):');
  console.error(JSON.stringify(newHerDB.find(h => h.id === 'changeling'), null, 2));
  console.error('  EG 행:', JSON.stringify(newEGRows.filter(r => r.group_id === 'eg-heritage-changeling'), null, 2));
  console.error('\n샘플 변환 — razortooth-goblin (grant_weapon):');
  console.error(JSON.stringify(newHerDB.find(h => h.id === 'razortooth-goblin'), null, 2));
  console.error('  EG 행:', JSON.stringify(newEGRows.filter(r => r.group_id === 'eg-heritage-razortooth-goblin'), null, 2));
  console.error('\n샘플 변환 — hold-scarred-orc (hp_bonus + grant_feat):');
  console.error(JSON.stringify(newHerDB.find(h => h.id === 'hold-scarred-orc'), null, 2));
  console.error('  EG 행:', JSON.stringify(newEGRows.filter(r => r.group_id === 'eg-heritage-hold-scarred-orc'), null, 2));
  console.error('\n샘플 변환 — fey-touched-gnome (innateSpells):');
  console.error(JSON.stringify(newHerDB.find(h => h.id === 'fey-touched-gnome'), null, 2));
  console.error('  EG 행:', JSON.stringify(newEGRows.filter(r => r.group_id === 'eg-heritage-fey-touched-gnome'), null, 2));
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

csDataSrc = replaceConst(csDataSrc, 'HERITAGE_DB', newHerDB);
csDataSrc = replaceConst(csDataSrc, 'EFFECT_GROUPS', allEG);

fs.writeFileSync(csDataPath, csDataSrc);
console.error(`✓ ${csDataPath}`);
console.error('\n다음: cs_calc.js getHeritageEffects 헬퍼 + 호출처 갱신');
