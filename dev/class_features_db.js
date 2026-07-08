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

// id(=FVTT slug)가 정본 식별자 — 소비처는 id로 카탈로그를 해소(getFeat(id)). name_ko/name_en은
// slug 미해소 시 폴백 표시용일 뿐(번역 갱신으로 드리프트해도 id가 있으면 무해).
var CLASS_AUTO_FEATS = {
  fighter: [
    {lv:1, id:'shield-block', name_ko:'방패 막기', name_en:'Shield Block', category:'special'},
    {lv:1, id:'reactive-strike', name_ko:'반응 타격', name_en:'Reactive Strike', category:'special'},
  ],
  druid: [
    {lv:1, id:'shield-block', name_ko:'방패 막기', name_en:'Shield Block', category:'special'},
    {lv:1, id:'voice-of-nature', name_ko:'자연의 목소리', name_en:'Voice of Nature', category:'special'},
  ],
  rogue: [
    {lv:1, id:'sneak-attack', name_ko:'은밀 공격', name_en:'Sneak Attack', category:'special'},
    {lv:1, id:'surprise-attack', name_ko:'기습', name_en:'Surprise Attack', category:'special'},
  ],
  ranger: [
    {lv:1, id:'hunt-prey', name_ko:'사냥감 추적', name_en:'Hunt Prey', category:'special'},
  ],
  bard: [
    // 작곡 주문(Composition Spells) L1 클래스 특성 — 부여 로직은 효과(자동화) 데이터에 있음:
    // data/override/effect_groups.json 의 'composition-spells' grant_focus_spell(용기의 찬가). 하드코딩 아님.
    {lv:1, id:'composition-spells', name_ko:'작곡 주문', name_en:'Composition Spells', category:'special'},
  ],
};

// Subclass auto-granted feats
// ═══════════════════════════════════════════════
//  AUTO-GRANTED SPELLS — added to spell tab
//  type: 'cantrip' | 'focus' | 'known'
// ═══════════════════════════════════════════════

var CLASS_AUTO_SPELLS = {
  // Bard: Inspire Courage composition cantrip at L1
  bard: [
    // 용기의 찬가(Courageous Anthem)는 '작곡 주문' 특성의 효과(자동화) 데이터가 부여 →
    //   data/override/effect_groups.json 'composition-spells'. 여기 하드코딩 아님.
    {lv:1, type:'focus', id:'counter-performance', name_ko:'대항 공연', name_en:'Counter Performance'},
  ],
  // Summoner: Boost Eidolon 집중 주문 L1 (FVTT 컴펜디움 미인코딩=시스템 TS 전용 → 수작업 표)
  summoner: [
    {lv:1, type:'focus', id:'boost-eidolon', name_ko:'에이돌론 강화', name_en:'Boost Eidolon'},
  ],
};

// ═══════════════════════════════════════════════
//  SUBCLASS FEATURE NAMES — for display
// ═══════════════════════════════════════════════

// 신격(DEITY_DB) 카탈로그는 FVTT 단일 소스로 이관(PF2eDeity 어댑터, 478종).
// 영역→집중주문 매핑(DOMAIN_DB)은 FVTT 갭 큐레이션이므로 아래 유지.

// ═══════════════════════════════════════════════
//  DOMAIN DATABASE — 영역별 초기/고급 집중 주문
// ═══════════════════════════════════════════════

var DOMAIN_DB = {}; // 영역 데이터 = DataManager 단일소스(data/derived/domains.json). cs_pf2e_deity.loadDomains()가 런타임 채움(구 61개 하드코딩 폐기, v0.150).

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
