// PF2e Player Core — Class Features Database
// 레벨별 숙련도 진행 및 자동 부여 특성
// 숙련 등급: 0=미숙련(U), 2=숙련(T), 4=전문가(E), 6=달인(M), 8=전설(L)

// ═══════════════════════════════════════════════
//  CLASS PROFICIENCY TABLE — {target: {level: rank}}
//  target = DOM element suffix (prof-{target})
// ═══════════════════════════════════════════════

// CLASS_PROF_TABLE 폐기 → DataManager 단일 소스(class_progression.json)에서 런타임 구성(cs_pf2e_class).

// ═══════════════════════════════════════════════
//  SUBCLASS PROFICIENCY TABLE — overrides CLASS entries
//  Entries REPLACE (not merge) the class entry for that target
// ═══════════════════════════════════════════════

// ═══════════════════════════════════════════════
//  CLASS FEATURE NAMES — for display in growth plan
//  Each entry: {lv, name_ko, name_en, type?}
//  type: 'feat' = auto-granted feat, undefined = display-only
// ═══════════════════════════════════════════════

// 클래스 레벨별 특성명. 전 클래스(27) PF2eClass._mergeIntoGlobals가 classFeatures(doc)로 채운다.
// (FVTT 클래스 doc의 system.items에서 도출 — 단일 소스. 초기값 빈 객체.)
var CLASS_FEATURE_NAMES = {};

// ═══════════════════════════════════════════════
//  AUTO-GRANTED FEATS — class features that grant feats
// ═══════════════════════════════════════════════

// ⚠ CLASS_AUTO_FEATS 폐기(v0.158) — 클래스 자동부여 재주는 클래스 성장표 로스터가 단일소스.
//   fighter 방패막기/반응타격, rogue 은밀공격 등은 이미 data/store/classes.json system.items(=성장표 features[])에
//   있었고, 이 const는 그걸 손으로 재선언한 중복이었음. CLASS_FEATURE_NAMES가 성장표 로스터에서 slug+kind를
//   실어오므로(cs_pf2e_class.classFeatureRoster) applyClassFeatures의 featureNames 주입이 전량 커버. 파리티 검증됨.

// ═══════════════════════════════════════════════
//  AUTO-GRANTED SPELLS — added to spell tab (type: 'cantrip' | 'focus' | 'known')
// ═══════════════════════════════════════════════
// ⚠ CLASS_AUTO_SPELLS 비움(v0.159) — 클래스특성이 부여하는 집중주문은 그 특성의 효과(자동화) 슬러그가 정본:
//   작곡 주문(composition-spells) → 용기의 찬가+대항 공연 / 소환사 시전(summoner-spellcasting) → 에이돌론 강화.
//   전부 data/override/effect_groups.json의 grant_focus_spell 행 → getEffectRows(slug)가 applyFeatEffects에서
//   부여(클래스특성이 auto 재주로 주입되므로 재주와 동일 경로). 하드코딩 목록 폐기. (센티널로 var는 유지)
var CLASS_AUTO_SPELLS = {};

// ═══════════════════════════════════════════════
//  SUBCLASS FEATURE NAMES — for display
// ═══════════════════════════════════════════════

// 신격(DEITY_DB) 카탈로그는 FVTT 단일 소스로 이관(PF2eDeity 어댑터, 478종).
// 영역→집중주문 매핑(DOMAIN_DB)은 FVTT 갭 큐레이션이므로 아래 유지.

// ═══════════════════════════════════════════════
//  DOMAIN DATABASE — 영역별 초기/고급 집중 주문
// ═══════════════════════════════════════════════

var DOMAIN_DB = {}; // 영역 데이터 = DataManager 단일소스(data/derived/domains.json). cs_pf2e_deity.loadDomains()가 런타임 채움(구 61개 하드코딩 폐기, v0.150).

// 소서러 혈통(BLOODLINE_DB) = DataManager 단일소스(data/derived/bloodlines.json). cs_pf2e_class.loadBloodlines()가 런타임 채움.
//   {slug:{name,tradition,skills,initial,advanced,greater,granted,blood_magic,exemplars,...}} — 혈통 집중주문(초/중/고급)·부여 레퍼토리·표본 선택.
var BLOODLINE_DB = {};
// 「혈통 항목 읽는 법」 정본 용어 설명(전 혈통 공통, bloodline-spells 항목 파생) — [{term,def},...].
var BLOODLINE_GUIDE = [];
// 오라클 신비(MYSTERY_DB) = DataManager 단일소스(data/derived/oracle_mysteries.json). cs_pf2e_class.loadMysteries()가 런타임 채움.
//   {slug:{name,tradition,mystery_skill,granted_spells,revelation:{initial,advanced,greater},domains,curse,oracle_feat}} — 미스터리 기술·부여 레퍼토리·계시주문(초/상/고급).
var MYSTERY_DB = {};
// 「신비 항목 읽는 법」 정본 용어 설명(전 신비 공통, oracle_mysteries.json guide) — [{term,def},...].
var MYSTERY_GUIDE = [];
// 위저드 비전 학파(WIZARD_SCHOOL_DB) = DataManager 단일소스(data/derived/wizard_schools.json). cs_pf2e_class.loadWizardSchools()가 런타임 채움.
//   {slug:{name,tradition,curriculum:{rank:[{spell}]},school_spell:{initial,advanced}}} — 교육과정 풀·학파 주문(초/상급).
var WIZARD_SCHOOL_DB = {};
// 「학파 항목 읽는 법」 정본 용어 설명(전 학파 공통, wizard_schools.json guide) — [{term,def},...].
var WIZARD_SCHOOL_GUIDE = [];
// 바드 뮤즈 「항목 읽는 법」 가이드 = data/derived/bard_muses.json → cs_pf2e_class.loadBardMuses()가 채움.
var BARD_MUSE_GUIDE = [];
// 마녀 후원자 「항목 읽는 법」 가이드 = data/derived/witch_patrons.json → cs_pf2e_class.loadWitchPatrons()가 채움.
var WITCH_PATRON_GUIDE = [];
// 드루이드 교단 「항목 읽는 법」 가이드 = data/derived/druid_orders.json → cs_pf2e_class.loadDruidOrders()가 채움.
var DRUID_ORDER_GUIDE = [];
// 레인저 사냥 방식 「항목 읽는 법」 가이드 = data/derived/ranger_edges.json → cs_pf2e_class.loadRangerEdges()가 채움.
var RANGER_EDGE_GUIDE = [];
// 로그 수법 「항목 읽는 법」 가이드 = data/derived/rogue_rackets.json → cs_pf2e_class.loadRogueRackets()가 채움.
var ROGUE_RACKET_GUIDE = [];
// 챔피언 원인 「항목 읽는 법」 가이드 = data/derived/champion_causes.json → cs_pf2e_class.loadChampionCauses()가 채움.
var CHAMPION_CAUSE_GUIDE = [];

// ═══════════════════════════════════════════════
//  WITCH PATRON → SPELL TRADITION MAPPING
// ═══════════════════════════════════════════════

// 마녀 후원자 전통 매핑은 SUBCLASS_DB 각 후원자 행의 `tradition` 필드로 이관됨(v0.134, 원칙#2 — 별도 상수표 제거).

// ═══════════════════════════════════════════════
//  DIVINE FONT SPELL SLOTS — extra slots per level
//  Value = base extra slots (add CHA modifier)
// ═══════════════════════════════════════════════

// DIVINE_FONT_SLOTS 제거(v0.x~): 레벨별 슬롯 = 공식 4+floor((lv-1)/3) (getDivineFontSlots).

// ═══════════════════════════════════════════════
//  CLASS_SPELL_TABLE — 클래스별 일일 주문 수 (Player Core 정본)
//  [classId][level] = { cantrips, slots:[rank1..rank10] }
//  spontaneous 캐스터: 레퍼토리 크기 = 슬롯 수 (각 랭크)
// ═══════════════════════════════════════════════

// 레거시 풀캐스터 5종은 표준 풀캐스터 진행표 공유(값 동일 — bard 명시 중복 제거).
// 신규(sorcerer/oracle/animist)는 cs_pf2e_class.js spellTable()가 FULL_CASTERS로 동일 표 생성.
var CLASS_SPELL_TABLE = {
  bard:    _FULL_CASTER_TABLE(),
  witch:   _FULL_CASTER_TABLE(),
  cleric:  _FULL_CASTER_TABLE(),
  druid:   _FULL_CASTER_TABLE(),
  wizard:  _FULL_CASTER_TABLE(),
};

// 표준 풀캐스터 일일 주문 테이블 (모든 풀캐스터 공유)
function _FULL_CASTER_TABLE() {
  return {
    1:  {cantrips:5, slots:[2,0,0,0,0,0,0,0,0,0]},
    2:  {cantrips:5, slots:[3,0,0,0,0,0,0,0,0,0]},
    3:  {cantrips:5, slots:[3,2,0,0,0,0,0,0,0,0]},
    4:  {cantrips:5, slots:[3,3,0,0,0,0,0,0,0,0]},
    5:  {cantrips:5, slots:[3,3,2,0,0,0,0,0,0,0]},
    6:  {cantrips:5, slots:[3,3,3,0,0,0,0,0,0,0]},
    7:  {cantrips:5, slots:[3,3,3,2,0,0,0,0,0,0]},
    8:  {cantrips:5, slots:[3,3,3,3,0,0,0,0,0,0]},
    9:  {cantrips:5, slots:[3,3,3,3,2,0,0,0,0,0]},
    10: {cantrips:5, slots:[3,3,3,3,3,0,0,0,0,0]},
    11: {cantrips:5, slots:[3,3,3,3,3,2,0,0,0,0]},
    12: {cantrips:5, slots:[3,3,3,3,3,3,0,0,0,0]},
    13: {cantrips:5, slots:[3,3,3,3,3,3,2,0,0,0]},
    14: {cantrips:5, slots:[3,3,3,3,3,3,3,0,0,0]},
    15: {cantrips:5, slots:[3,3,3,3,3,3,3,2,0,0]},
    16: {cantrips:5, slots:[3,3,3,3,3,3,3,3,0,0]},
    17: {cantrips:5, slots:[3,3,3,3,3,3,3,3,2,0]},
    18: {cantrips:5, slots:[3,3,3,3,3,3,3,3,3,0]},
    19: {cantrips:5, slots:[3,3,3,3,3,3,3,3,3,1]},
    20: {cantrips:5, slots:[3,3,3,3,3,3,3,3,3,1]},
  };
}
