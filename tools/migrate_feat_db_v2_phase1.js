#!/usr/bin/env node
// ═══════════════════════════════════════════════
//  ONE-SHOT MIGRATION — FEAT_DB v2 Phase 1
//  (1) PREREQ_GROUPS 신규 (FEAT_DB.prereqs → 1:N 정규화)
//  (2) FEAT_DB: prereqs 제거 + prereq_group_id/acquisition/source/effects 추가
//  (3) ANCESTRIES: features/grantWeapon 추가, specials 제거 (bonusLangs는 v528에서 처리됨)
//  (4) TRAIT_DB: type 컬럼 자동 분류 추가
//
//  Usage: node tools/migrate_feat_db_v2_phase1.js [--dry]
// ═══════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DEV_DIR = path.join(ROOT, 'dev');
const DRY = process.argv.includes('--dry');

// ── DB 로드 ──
function loadAllDBs() {
  const files = ['cs_data.js', 'feat_db.js'];
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  for (const file of files) {
    let src = fs.readFileSync(path.join(DEV_DIR, file), 'utf8');
    // const → var 치환
    src = src.replace(/^const\s+([A-Z_][A-Z0-9_]*)\s*=/gm, 'var $1 =');
    try { vm.runInContext(src, sandbox, { filename: file }); }
    catch (e) { console.error(`[warn] ${file}: ${e.message}`); }
  }
  return sandbox;
}

const ctx = loadAllDBs();

// ─────────────────────────────────────────────────
// (1) PREREQ_GROUPS 생성 + FEAT_DB 마이그레이션
// ─────────────────────────────────────────────────

// 단일 prereq 객체 → {logic, type, value} 행
function prereqToRow(p, logic) {
  if (!p || typeof p !== 'object') return null;
  if (p.ability) return { logic, type: p.ability, value: String(p.min || 0) };
  if (p.skill) return { logic, type: p.skill, value: String(p.rank || 0) };
  if (p.perception !== undefined) return { logic, type: 'perception', value: String(p.perception) };
  if (p.lore !== undefined) return { logic, type: 'lore', value: String(p.lore) };
  if (p.feat) return { logic, type: 'feat', value: p.feat };
  if (p.ancestry) return { logic, type: 'ancestry', value: p.ancestry };
  if (p.heritage) return { logic, type: 'heritage', value: p.heritage };
  if (p.subclass) return { logic, type: 'subclass', value: p.subclass };
  if (p.vision) return { logic, type: 'vision', value: p.vision };
  return null;
}

const prereqGroups = [];
const featDbNew = ctx.FEAT_DB.map(f => {
  const out = {};
  // 키 순서 유지: id/name_ko/name_en/feat_level/category/acquisition/source
  // /prereq_group_id/prerequisites/traits/actionCost/desc/summary/repeatable/effects
  out.id = f.id;
  out.name_ko = f.name_ko;
  out.name_en = f.name_en;
  if (f.feat_level !== undefined) out.feat_level = f.feat_level;
  out.category = f.category;
  // 기본값: 사용자 선택 재주
  out.acquisition = 'choice';
  out.source = '';

  // PREREQ_GROUPS 변환
  if (Array.isArray(f.prereqs) && f.prereqs.length) {
    const groupId = `gid-${f.id}`;
    out.prereq_group_id = groupId;
    for (const p of f.prereqs) {
      if (p && p.or) {
        // OR 조건: 각 sub-prereq를 logic='or' 행으로 펼침
        for (const sub of p.or) {
          const row = prereqToRow(sub, 'or');
          if (row) prereqGroups.push({ group_id: groupId, ...row });
        }
      } else {
        const row = prereqToRow(p, 'and');
        if (row) prereqGroups.push({ group_id: groupId, ...row });
      }
    }
  } else {
    out.prereq_group_id = '';
  }

  if (f.prerequisites) out.prerequisites = f.prerequisites;
  if (f.traits) out.traits = f.traits;
  if (f.actionCost) out.actionCost = f.actionCost;
  out.desc = f.desc;
  if (f.summary) out.summary = f.summary;
  if (f.repeatable) out.repeatable = f.repeatable;
  // Phase 2에서 채울 effects 자리
  out.effects = [];

  return out;
});

// ─────────────────────────────────────────────────
// (2) ANCESTRIES 마이그레이션
// ─────────────────────────────────────────────────

// 혈통별 자동 부여 재주 (현재 specials의 keen-eyes / plant-nourishment)
const ANCESTRY_FEATURES_MAP = {
  halfling: ['keen-eyes'],
  leshy: ['plant-nourishment'],
};
// 혈통별 무료 무기 (현재 dwarf 씨족 단검)
const ANCESTRY_GRANT_WEAPON = {
  dwarf: 'clan-dagger',
};

const ancestriesNew = ctx.ANCESTRIES.map(a => {
  const out = {};
  // 기존 키 그대로 (specials만 제외)
  for (const [k, v] of Object.entries(a)) {
    if (k === 'specials') continue;
    out[k] = v;
  }
  // bonusLangs는 v528에서 이미 추가됨 — 그대로 유지
  if (out.bonusLangs === undefined) out.bonusLangs = 0;
  // 신규 컬럼
  out.features = ANCESTRY_FEATURES_MAP[a.id] || [];
  out.grantWeapon = ANCESTRY_GRANT_WEAPON[a.id] || '';
  return out;
});

// ─────────────────────────────────────────────────
// (3) TRAIT_DB.type 자동 분류
// ─────────────────────────────────────────────────

const TRAIT_TYPE_RULES = {
  ancestry: ['드워프', '엘프', '노움', '고블린', '하플링', '인간', '레쉬', '오크', '체인질링', '네피림', '아이우바린', '드로마르'],
  creature: ['인간형', '식물', '균류', '동물', '정령', '용', '악마', '천상체', '주시자', '언데드', '구조물', '거인', '괴물'],
  damage: ['화염', '냉기', '전기', '산성', '음파', '정신', '독', '신성', '부정', '무력', '관통', '참격', '둔기', '출혈', '정밀'],
  rarity: ['일반', '비일반', '희귀', '독특'],
  mechanic: ['집중', '조작', '주문변형', '이동', '공격', '발현', '발사', '청각', '시각', '후각', '촉각', '감정', '기만', '공포', '폭발', '구속', '죽음', '수면', '매혹', '마법', '오라', '광휘', '어둠', '추가효과', '휴식', '탐지', '선언', '자유 행동', '반응', '1행동', '2행동', '3행동', '원시', '비전', '신성', '오컬트', '집중 주문', '캔트립', '의식'],
};

function classifyTrait(t) {
  for (const [tp, names] of Object.entries(TRAIT_TYPE_RULES)) {
    if (names.includes(t.id) || names.includes(t.name_ko)) return tp;
  }
  return 'weapon'; // 기본값 (PF2e 무기 특성이 다수)
}

const traitDbNew = ctx.TRAIT_DB.map(t => ({
  id: t.id,
  name_ko: t.name_ko,
  name_en: t.name_en,
  type: classifyTrait(t),
  desc: t.desc,
}));

// ─────────────────────────────────────────────────
// (4) JSON 출력
// ─────────────────────────────────────────────────

const stats = {
  prereq_groups: prereqGroups.length,
  feats_with_prereqs: featDbNew.filter(f => f.prereq_group_id).length,
  feats_total: featDbNew.length,
  ancestries: ancestriesNew.length,
  ancestries_with_features: ancestriesNew.filter(a => a.features.length).length,
  ancestries_with_grant_weapon: ancestriesNew.filter(a => a.grantWeapon).length,
  traits: traitDbNew.length,
  traits_by_type: {},
};
for (const t of traitDbNew) {
  stats.traits_by_type[t.type] = (stats.traits_by_type[t.type] || 0) + 1;
}

console.log(JSON.stringify(stats, null, 2));

if (DRY) {
  console.error('\n[dry-run] 파일 미수정. 결과만 출력.');
  // 샘플 출력
  console.error('\n샘플 PREREQ_GROUPS (앞 5개):');
  console.error(JSON.stringify(prereqGroups.slice(0, 5), null, 2));
  console.error('\n샘플 FEAT_DB[0]:');
  console.error(JSON.stringify(featDbNew[0], null, 2));
  console.error('\n샘플 ANCESTRIES[0]:');
  console.error(JSON.stringify(ancestriesNew[0], null, 2));
  console.error('\n샘플 TRAIT_DB[0..2]:');
  console.error(JSON.stringify(traitDbNew.slice(0, 3), null, 2));
  process.exit(0);
}

// ─────────────────────────────────────────────────
// (5) 파일 쓰기
// ─────────────────────────────────────────────────

// — feat_db.js 재작성 —
const featDbPath = path.join(DEV_DIR, 'feat_db.js');
const featDbHeader = `// ═══════════════════════════════════════════════
//  FEAT_DB — 자동생성 (rebuild_feat_db.js)
//  ancestry/archetype: 기존 수동 데이터 유지
//  class/general/skill: PlayerCore.html 자동 파싱
//  v528~ Phase 1: prereqs → prereq_group_id (PREREQ_GROUPS 외래 참조)
// ═══════════════════════════════════════════════

`;
fs.writeFileSync(featDbPath, featDbHeader + 'var FEAT_DB = ' + JSON.stringify(featDbNew, null, 2) + ';\n');
console.error(`✓ ${featDbPath}`);

// — cs_data.js: ANCESTRIES, TRAIT_DB 교체 + PREREQ_GROUPS 삽입 —
const csDataPath = path.join(DEV_DIR, 'cs_data.js');
let csDataSrc = fs.readFileSync(csDataPath, 'utf8');

// ANCESTRIES 교체
csDataSrc = replaceTopLevelArray(csDataSrc, 'ANCESTRIES', ancestriesNew);
// TRAIT_DB 교체
csDataSrc = replaceTopLevelArray(csDataSrc, 'TRAIT_DB', traitDbNew);
// PREREQ_GROUPS 삽입 (TRAIT_DB 다음)
csDataSrc = insertAfterArray(csDataSrc, 'TRAIT_DB',
  '\n// ═══════════════════════════════════════════════\n' +
  '//  PREREQ_GROUPS — FEAT_DB.prereq_group_id 1:N 정규화 (v528~)\n' +
  '//  같은 group_id 행 = 묶인 조건. logic=and(모두) / or(하나)\n' +
  '//  type: 능력치 enum / SKILLS.id / perception / lore / feat / ancestry / heritage / subclass / vision\n' +
  '// ═══════════════════════════════════════════════\n' +
  'const PREREQ_GROUPS = ' + JSON.stringify(prereqGroups, null, 2) + ';\n'
);
fs.writeFileSync(csDataPath, csDataSrc);
console.error(`✓ ${csDataPath}`);

// ─────────────────────────────────────────────────
// 헬퍼: 파일 텍스트 내 const NAME = [...]; 블록 교체
// ─────────────────────────────────────────────────
function replaceTopLevelArray(src, varName, newArr) {
  const re = new RegExp(`(^const\\s+${varName}\\s*=\\s*)\\[[\\s\\S]*?\\n\\];`, 'm');
  if (!re.test(src)) {
    console.error(`[warn] ${varName} 블록을 찾지 못함`);
    return src;
  }
  return src.replace(re, `$1${JSON.stringify(newArr, null, 2)};`);
}

function insertAfterArray(src, afterVar, insertText) {
  const re = new RegExp(`(^const\\s+${afterVar}\\s*=\\s*\\[[\\s\\S]*?\\n\\];)`, 'm');
  if (!re.test(src)) {
    console.error(`[warn] ${afterVar} 블록을 찾지 못함`);
    return src;
  }
  return src.replace(re, `$1\n${insertText}`);
}
