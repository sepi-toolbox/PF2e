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

var DOMAIN_DB = {
  "air": {
    "name": "공기",
    "initial": "pushing-gust",
    "advanced": "disperse-into-air"
  },
  "ambition": {
    "name": "야망",
    "initial": "ignite-ambition",
    "advanced": "competitive-edge"
  },
  "cities": {
    "name": "도시",
    "initial": "face-in-the-crowd",
    "advanced": "pulse-of-civilization"
  },
  "confidence": {
    "name": "자신감",
    "initial": "veil-of-confidence",
    "advanced": "delusional-pride"
  },
  "creation": {
    "name": "창조",
    "initial": "creative-splash",
    "advanced": "artistic-flourish"
  },
  "darkness": {
    "name": "어둠",
    "initial": "cloak-of-shadow",
    "advanced": "darkened-sight"
  },
  "death": {
    "name": "죽음",
    "initial": "deaths-call",
    "advanced": "eradicate-undeath"
  },
  "destruction": {
    "name": "파괴",
    "initial": "cry-of-destruction",
    "advanced": "destructive-aura"
  },
  "dreams": {
    "name": "꿈",
    "initial": "sweet-dream",
    "advanced": "dreamers-call"
  },
  "earth": {
    "name": "대지",
    "initial": "hurtling-stone",
    "advanced": "localized-quake"
  },
  "family": {
    "name": "가족",
    "initial": "soothing-words",
    "advanced": "community-restoration"
  },
  "fate": {
    "name": "운명",
    "initial": "read-fate",
    "advanced": "tempt-fate"
  },
  "fire": {
    "name": "화염",
    "initial": "fire-ray",
    "advanced": "flame-barrier"
  },
  "freedom": {
    "name": "자유",
    "initial": "unimpeded-stride",
    "advanced": "word-of-freedom"
  },
  "healing": {
    "name": "치유",
    "initial": "healers-blessing",
    "advanced": "rebuke-death"
  },
  "indulgence": {
    "name": "탐닉",
    "initial": "overstuff",
    "advanced": "take-its-course"
  },
  "knowledge": {
    "name": "지식",
    "initial": "scholarly-recollection",
    "advanced": "know-the-enemy"
  },
  "luck": {
    "name": "행운",
    "initial": "bit-of-luck",
    "advanced": "lucky-break"
  },
  "magic": {
    "name": "마법",
    "initial": "magics-vessel",
    "advanced": "mystic-beacon"
  },
  "might": {
    "name": "힘",
    "initial": "athletic-rush",
    "advanced": "enduring-might"
  },
  "moon": {
    "name": "달",
    "initial": "moonbeam",
    "advanced": "touch-of-the-moon"
  },
  "nature": {
    "name": "자연",
    "initial": "vibrant-thorns",
    "advanced": "natures-bounty"
  },
  "nightmares": {
    "name": "악몽",
    "initial": "waking-nightmare",
    "advanced": "shared-nightmare"
  },
  "pain": {
    "name": "고통",
    "initial": "savor-the-sting",
    "advanced": "retributive-pain"
  },
  "passion": {
    "name": "열정",
    "initial": "charming-touch",
    "advanced": "captivating-adoration"
  },
  "perfection": {
    "name": "완벽",
    "initial": "perfected-mind",
    "advanced": "perfected-body"
  },
  "protection": {
    "name": "보호",
    "initial": "protectors-sacrifice",
    "advanced": "protectors-sphere"
  },
  "secrecy": {
    "name": "비밀",
    "initial": "whispering-quiet",
    "advanced": "safeguard-secret"
  },
  "soul": {
    "name": "영혼"
  },
  "sun": {
    "name": "태양",
    "initial": "dazzling-flash",
    "advanced": "vital-luminance"
  },
  "travel": {
    "name": "여행",
    "initial": "agile-feet",
    "advanced": "travelers-transit"
  },
  "trickery": {
    "name": "속임수",
    "initial": "sudden-shift",
    "advanced": "tricksters-twin"
  },
  "truth": {
    "name": "진실",
    "initial": "word-of-truth",
    "advanced": "glimpse-the-truth"
  },
  "tyranny": {
    "name": "폭정",
    "initial": "touch-of-obedience",
    "advanced": "commanding-lash"
  },
  "undeath": {
    "name": "언데스",
    "initial": "touch-of-undeath",
    "advanced": "malignant-sustenance"
  },
  "void": {
    "name": "공허",
    "initial": "scramble-body"
  },
  "water": {
    "name": "물",
    "initial": "tidal-surge",
    "advanced": "downpour"
  },
  "wealth": {
    "name": "부",
    "advanced": "precious-metals"
  },
  "zeal": {
    "name": "열의",
    "initial": "weapon-surge",
    "advanced": "zeal-for-battle"
  },
  "repose": {
    "name": "휴식",
    "initial": "share-burden",
    "advanced": "font-of-serenity"
  },
  "sorrow": {
    "name": "슬픔",
    "initial": "lament",
    "advanced": "overflowing-sorrow"
  },
  "star": {
    "name": "스타",
    "initial": "zenith-star",
    "advanced": "asterism"
  },
  "duty": {
    "name": "의무",
    "initial": "oathkeepers-insignia",
    "advanced": "dutiful-challenge"
  },
  "change": {
    "name": "변경",
    "initial": "adapt-self",
    "advanced": "adaptive-ablation"
  },
  "vigil": {
    "name": "비질",
    "initial": "object-memory",
    "advanced": "remember-the-lost"
  },
  "glyph": {
    "name": "글리프",
    "initial": "redact",
    "advanced": "ghostly-transcription"
  },
  "time": {
    "name": "시간",
    "initial": "delay-consequence",
    "advanced": "stasis"
  },
  "wyrmkin": {
    "name": "웜킨",
    "initial": "draconic-barrage"
  },
  "lightning": {
    "name": "라이트닝",
    "initial": "charged-javelin",
    "advanced": "bottle-the-storm"
  },
  "cold": {
    "name": "추위",
    "initial": "winter-bolt",
    "advanced": "diamond-dust"
  },
  "dust": {
    "name": "먼지",
    "initial": "parch",
    "advanced": "dust-storm"
  },
  "toil": {
    "name": "근면",
    "initial": "practice-makes-perfect",
    "advanced": "tireless-worker"
  },
  "naga": {
    "name": "나가",
    "initial": "split-the-tongue",
    "advanced": "ordained-purpose"
  },
  "introspection": {
    "name": "자기 성찰"
  },
  "decay": {
    "name": "부패",
    "initial": "withering-grasp",
    "advanced": "fallow-field"
  },
  "plague": {
    "name": "전염병",
    "initial": "divine-plagues",
    "advanced": "foul-miasma"
  },
  "swarm": {
    "name": "무리",
    "initial": "swarmsense",
    "advanced": "swarm-form"
  },
  "delirium": {
    "name": "섬망",
    "advanced": "ephemeral-hazards"
  },
  "metal": {
    "name": "금속",
    "initial": "serrate",
    "advanced": "repel-metal"
  },
  "wood": {
    "name": "목재"
  },
  "abomination": {
    "name": "혐오",
    "initial": "lift-natures-caul",
    "advanced": "fearful-feast"
  }
};

// ═══════════════════════════════════════════════
//  WITCH PATRON → SPELL TRADITION MAPPING
// ═══════════════════════════════════════════════

var PATRON_TRADITION = {
  'patron-curse':  'occult',
  'patron-fate':   'occult',
  'patron-fervor': 'divine',
  'patron-night':  'occult',
  'patron-rune':   'arcane',
  'patron-wild':   'primal',
};

// ═══════════════════════════════════════════════
//  DIVINE FONT SPELL SLOTS — extra slots per level
//  Value = base extra slots (add CHA modifier)
// ═══════════════════════════════════════════════

var DIVINE_FONT_SLOTS = {
  1:4, 2:4, 3:4, 4:5, 5:5, 6:5, 7:6, 8:6, 9:6, 10:7,
  11:7, 12:7, 13:8, 14:8, 15:8, 16:9, 17:9, 18:9, 19:10, 20:10
};

// ═══════════════════════════════════════════════
//  CLASS_SPELL_TABLE — 클래스별 일일 주문 수 (Player Core 정본)
//  [classId][level] = { cantrips, slots:[rank1..rank10] }
//  spontaneous 캐스터: 레퍼토리 크기 = 슬롯 수 (각 랭크)
// ═══════════════════════════════════════════════

var CLASS_SPELL_TABLE = {
  bard: {
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
  },
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
