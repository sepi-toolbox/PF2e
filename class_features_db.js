// PF2e Player Core — Class Features Database
// 레벨별 숙련도 진행 및 자동 부여 특성
// 숙련 등급: 0=미숙련(U), 2=숙련(T), 4=전문가(E), 6=달인(M), 8=전설(L)

// ═══════════════════════════════════════════════
//  CLASS PROFICIENCY TABLE — {target: {level: rank}}
//  target = DOM element suffix (prof-{target})
// ═══════════════════════════════════════════════

var CLASS_PROF_TABLE = {
  bard: {
    fort:{1:2, 9:4},
    ref:{1:2, 3:4},
    will:{1:4, 9:6},
    perc:{1:4, 11:6},
    spatk:{1:2, 7:4, 15:6, 19:8},
    classdc:{1:2},
    'weapon-simple':{1:2, 11:4}, 'weapon-unarmed':{1:2, 11:4},
    'armor-light':{1:2, 13:4, 17:6}, 'armor-unarmored':{1:2, 13:4, 17:6},
  },
  cleric: {
    fort:{1:2},           // doctrine overrides
    ref:{1:2},            // doctrine overrides
    will:{1:4, 9:6},     // L9 확고한 신앙
    perc:{1:2, 5:4, 11:6},
    spatk:{1:2}, // doctrine overrides this
    classdc:{1:2},
    'weapon-simple':{1:2}, 'weapon-unarmed':{1:2},
    'armor-unarmored':{1:2},
  },
  druid: {
    fort:{1:2, 3:4},
    ref:{1:2, 5:4},
    will:{1:4, 11:6},
    perc:{1:2, 3:4},
    spatk:{1:2, 7:4, 15:6, 19:8},
    classdc:{1:2},
    'weapon-simple':{1:2, 11:4}, 'weapon-unarmed':{1:2, 11:4},
    'armor-light':{1:2, 13:4}, 'armor-medium':{1:2, 13:4}, 'armor-unarmored':{1:2, 13:4},
  },
  fighter: {
    fort:{1:4, 9:6, 17:8},
    ref:{1:4, 15:6},
    will:{1:2, 3:4, 17:6},
    perc:{1:4, 7:6, 13:8},
    classdc:{1:2, 9:4},
    'weapon-simple':{1:4, 5:6, 13:8}, 'weapon-martial':{1:4, 5:6, 13:8},
    'weapon-advanced':{1:2, 5:4, 13:6}, 'weapon-unarmed':{1:4, 5:6, 13:8},
    'armor-light':{1:2, 11:4, 17:6}, 'armor-medium':{1:2, 11:4, 17:6},
    'armor-heavy':{1:2, 11:4, 17:6}, 'armor-unarmored':{1:2, 11:4, 17:6},
  },
  ranger: {
    fort:{1:4, 9:6},
    ref:{1:4, 15:6},
    will:{1:2, 3:4, 17:6},
    perc:{1:4, 7:6, 15:8},
    classdc:{1:2, 9:4},
    'weapon-simple':{1:2, 5:4, 13:6}, 'weapon-martial':{1:2, 5:4, 13:6},
    'weapon-unarmed':{1:2, 5:4, 13:6},
    'armor-light':{1:2, 11:4, 17:6}, 'armor-medium':{1:2, 11:4, 17:6},
    'armor-unarmored':{1:2, 11:4, 17:6},
  },
  rogue: {
    fort:{1:2, 9:4},
    ref:{1:4, 13:6, 17:8},
    will:{1:4, 17:6},
    perc:{1:4, 7:6, 13:8},
    classdc:{1:2, 9:4},
    'weapon-simple':{1:2, 11:4}, 'weapon-unarmed':{1:2, 11:4},
    // Rogue also trains rapier, sap, shortbow, shortsword specifically
    'armor-light':{1:2, 13:4, 17:6}, 'armor-unarmored':{1:2, 13:4, 17:6},
  },
  witch: {
    fort:{1:2, 5:4},    // L5 마법 인내 Magical Fortitude
    ref:{1:2, 9:4},     // L9 반사 전문가
    will:{1:4, 9:6, 17:8},
    perc:{1:2, 5:4, 11:6},
    spatk:{1:2, 7:4, 15:6, 19:8},
    classdc:{1:2},
    'weapon-simple':{1:2}, 'weapon-unarmed':{1:2},
    'armor-unarmored':{1:2},
  },
  wizard: {
    fort:{1:2, 9:4},
    ref:{1:2, 5:4},
    will:{1:4, 9:6, 17:8},
    perc:{1:2, 5:4, 11:6},
    spatk:{1:2, 7:4, 15:6, 19:8},
    classdc:{1:2},
    'weapon-simple':{1:2}, 'weapon-unarmed':{1:2},
    'armor-unarmored':{1:2},
  },
};

// ═══════════════════════════════════════════════
//  SUBCLASS PROFICIENCY TABLE — overrides CLASS entries
//  Entries REPLACE (not merge) the class entry for that target
// ═══════════════════════════════════════════════

var SUBCLASS_PROF_TABLE = {
  // ── 클레릭 교리 ──
  'doctrine-cloistered': {
    fort:{1:2, 3:4, 9:6},             // L3 2차교리 Fort→E, L9 확고한신앙 Fort→M
    spatk:{1:2, 3:4, 15:6, 19:8},    // L3 주문→E, L15→M, L19→L
    ref:{1:2, 11:4},                   // L11 4차교리 번개반사 Ref→E
    will:{1:4, 9:6, 17:8},            // L9→M, L17 6차교의→L
    'armor-light':{1:2},
    'armor-unarmored':{1:2},
  },
  'doctrine-warpriest': {
    fort:{1:2, 3:4, 9:6},             // L3 2차교리 Fort→E, L9→M
    spatk:{1:2, 7:4, 15:6},           // L7 3차교리 주문→E, L15→M (no L)
    ref:{1:2, 3:4},                    // L3 2차교리 Ref→E
    will:{1:4, 9:6},                   // L9→M (no L)
    'weapon-martial':{1:2, 7:4},      // 군용 무기 훈련, L7 3차교리→E
    'armor-light':{1:2, 13:4, 17:6},
    'armor-medium':{1:2, 13:4, 17:6},
    'armor-heavy':{1:2},
    'armor-unarmored':{1:2, 13:4, 17:6},
  },
  // ── 바드 뮤즈 ──
  'muse-warrior': {
    'weapon-martial':{1:2},           // 군용 무기 훈련 추가
  },
};

// ═══════════════════════════════════════════════
//  CLASS FEATURE NAMES — for display in growth plan
//  Each entry: {lv, name_ko, name_en, type?}
//  type: 'feat' = auto-granted feat, undefined = display-only
// ═══════════════════════════════════════════════

var CLASS_FEATURE_NAMES = {
  bard: [
    {lv:1, name_ko:'비학 주문시전', name_en:'Occult Spellcasting'},
    {lv:1, name_ko:'합주 주문', name_en:'Composition Spells'},
    {lv:3, name_ko:'번개 반사', name_en:'Lightning Reflexes'},
    {lv:3, name_ko:'시그니처 주문', name_en:'Signature Spells'},
    {lv:7, name_ko:'전문가 주문시전자', name_en:'Expert Spellcaster'},
    {lv:9, name_ko:'큰 결의', name_en:'Resolve'},
    {lv:11, name_ko:'경각 감각', name_en:'Vigilant Senses'},
    {lv:11, name_ko:'무기 전문화', name_en:'Weapon Specialization'},
    {lv:13, name_ko:'경갑 전문화', name_en:'Light Armor Expertise'},
    {lv:15, name_ko:'대가 주문시전자', name_en:'Master Spellcaster'},
    {lv:19, name_ko:'전설 주문시전자', name_en:'Legendary Spellcaster'},
    {lv:19, name_ko:'마기스터리 주문', name_en:'Magistry Spells'},
  ],
  cleric: [
    {lv:1, name_ko:'신성 주문시전', name_en:'Divine Spellcasting'},
    {lv:1, name_ko:'신성 원천', name_en:'Divine Font'},
    {lv:3, name_ko:'2차 교의', name_en:'Second Doctrine'},
    {lv:5, name_ko:'감지 전문가', name_en:'Alertness'},
    {lv:7, name_ko:'3차 교의', name_en:'Third Doctrine'},
    {lv:9, name_ko:'확고한 신앙', name_en:'Steadfast Faith'},
    {lv:11, name_ko:'4차 교의', name_en:'Fourth Doctrine'},
    {lv:13, name_ko:'신성 방어', name_en:'Divine Defense'},
    {lv:13, name_ko:'무기 전문화', name_en:'Weapon Specialization'},
    {lv:15, name_ko:'5차 교의', name_en:'Fifth Doctrine'},
    {lv:17, name_ko:'6차 교의', name_en:'Sixth Doctrine'},
    {lv:19, name_ko:'최종 교의', name_en:'Final Doctrine'},
    {lv:19, name_ko:'기적의 주문', name_en:'Miraculous Spells'},
  ],
  druid: [
    {lv:1, name_ko:'원시 주문시전', name_en:'Primal Spellcasting'},
    {lv:1, name_ko:'드루이드 결사', name_en:'Druidic Order'},
    {lv:1, name_ko:'방패 막기', name_en:'Shield Block', type:'feat'},
    {lv:1, name_ko:'자연의 목소리', name_en:'Voice of Nature'},
    {lv:1, name_ko:'야생노래', name_en:'Wildsong'},
    {lv:3, name_ko:'감지 전문가', name_en:'Alertness'},
    {lv:3, name_ko:'인내 전문가', name_en:'Great Fortitude'},
    {lv:5, name_ko:'반사 전문가', name_en:'Lightning Reflexes'},
    {lv:7, name_ko:'전문가 주문시전자', name_en:'Expert Spellcaster'},
    {lv:11, name_ko:'무기 전문가', name_en:'Druid Weapon Expertise'},
    {lv:11, name_ko:'야생 의지력', name_en:'Wild Resolve'},
    {lv:13, name_ko:'평갑 전문가', name_en:'Medium Armor Expertise'},
    {lv:13, name_ko:'무기 전문화', name_en:'Weapon Specialization'},
    {lv:15, name_ko:'대가 주문시전자', name_en:'Master Spellcaster'},
    {lv:19, name_ko:'전설 주문시전자', name_en:'Legendary Spellcaster'},
    {lv:19, name_ko:'원시 대사제', name_en:'Primal Hierophant'},
  ],
  fighter: [
    {lv:1, name_ko:'반격 타격', name_en:'Reactive Strike'},
    {lv:1, name_ko:'방패 막기', name_en:'Shield Block', type:'feat'},
    {lv:3, name_ko:'용기', name_en:'Bravery'},
    {lv:5, name_ko:'파이터 무기 달인', name_en:'Fighter Weapon Mastery'},
    {lv:7, name_ko:'전장 측량', name_en:'Battlefield Surveyor'},
    {lv:7, name_ko:'무기 전문화', name_en:'Weapon Specialization'},
    {lv:9, name_ko:'전투 유연성', name_en:'Combat Flexibility'},
    {lv:9, name_ko:'전투 단련', name_en:'Juggernaut'},
    {lv:11, name_ko:'갑옷 전문가', name_en:'Armor Expertise'},
    {lv:11, name_ko:'파이터 전문가', name_en:'Fighter Expertise'},
    {lv:13, name_ko:'무기 전설', name_en:'Weapon Legend'},
    {lv:15, name_ko:'번뜩이는 반사', name_en:'Evasion'},
    {lv:15, name_ko:'상위 무기 전문화', name_en:'Greater Weapon Specialization'},
    {lv:15, name_ko:'향상된 유연성', name_en:'Improved Flexibility'},
    {lv:17, name_ko:'갑옷 달인', name_en:'Armor Mastery'},
    {lv:19, name_ko:'다재다능한 전설', name_en:'Versatile Legend'},
  ],
  ranger: [
    {lv:1, name_ko:'사냥감 추적', name_en:'Hunt Prey'},
    {lv:1, name_ko:'사냥꾼의 기질', name_en:"Hunter's Edge"},
    {lv:3, name_ko:'의지 전문가', name_en:'Iron Will'},
    {lv:5, name_ko:'레인저 무기 전문가', name_en:'Ranger Weapon Expertise'},
    {lv:5, name_ko:'흔적 없는 여정', name_en:'Trackless Journey'},
    {lv:7, name_ko:'자연 반사', name_en:'Evasion'},
    {lv:7, name_ko:'감지 달인', name_en:'Perception Master'},
    {lv:7, name_ko:'무기 전문화', name_en:'Weapon Specialization'},
    {lv:9, name_ko:'자연의 끝', name_en:"Nature's Edge"},
    {lv:9, name_ko:'레인저 전문가', name_en:'Ranger Expertise'},
    {lv:11, name_ko:'관리인의 인내', name_en:"Warden's Endurance"},
    {lv:11, name_ko:'평갑 전문가', name_en:'Medium Armor Expertise'},
    {lv:11, name_ko:'방해받지 않는 여정', name_en:'Unhindered Journey'},
    {lv:13, name_ko:'군용 무기 달인', name_en:'Weapon Mastery'},
    {lv:15, name_ko:'상위 자연 반사', name_en:'Greater Evasion'},
    {lv:15, name_ko:'상위 무기 전문화', name_en:'Greater Weapon Specialization'},
    {lv:15, name_ko:'지각 전설', name_en:'Incredible Senses'},
    {lv:17, name_ko:'달인 사냥꾼', name_en:'Masterful Hunter'},
    {lv:19, name_ko:'평갑 달인', name_en:'Medium Armor Mastery'},
    {lv:19, name_ko:'신속 사냥감', name_en:'Swift Prey'},
  ],
  rogue: [
    {lv:1, name_ko:'은밀 공격 1d6', name_en:'Sneak Attack 1d6'},
    {lv:1, name_ko:'기습', name_en:'Surprise Attack'},
    {lv:1, name_ko:'라켓', name_en:'Racket'},
    {lv:3, name_ko:'이점 부정', name_en:'Deny Advantage'},
    {lv:5, name_ko:'은밀 공격 2d6', name_en:'Sneak Attack 2d6'},
    {lv:5, name_ko:'무기 속임수', name_en:'Weapon Tricks'},
    {lv:7, name_ko:'회피 반사', name_en:'Evasion'},
    {lv:7, name_ko:'경각 감각', name_en:'Vigilant Senses'},
    {lv:7, name_ko:'무기 전문화', name_en:'Weapon Specialization'},
    {lv:9, name_ko:'쇠약 타격', name_en:'Debilitating Strike'},
    {lv:9, name_ko:'로그 회복력', name_en:'Rogue Resilience'},
    {lv:11, name_ko:'은밀 공격 3d6', name_en:'Sneak Attack 3d6'},
    {lv:11, name_ko:'로그 전문가', name_en:'Rogue Expertise'},
    {lv:13, name_ko:'상위 로그 반사', name_en:'Greater Rogue Reflexes'},
    {lv:13, name_ko:'놀라운 감각', name_en:'Incredible Senses'},
    {lv:13, name_ko:'경갑 전문가', name_en:'Light Armor Expertise'},
    {lv:13, name_ko:'달인 속임수', name_en:'Master Tricks'},
    {lv:15, name_ko:'이중 쇠약', name_en:'Double Debilitation'},
    {lv:17, name_ko:'민첩한 정신', name_en:'Slippery Mind'},
    {lv:17, name_ko:'은밀 공격 4d6', name_en:'Sneak Attack 4d6'},
    {lv:19, name_ko:'경갑 달인', name_en:'Light Armor Mastery'},
    {lv:19, name_ko:'달인 타격', name_en:'Master Strike'},
  ],
  witch: [
    {lv:1, name_ko:'위치 주문시전', name_en:'Witch Spellcasting'},
    {lv:1, name_ko:'사역마', name_en:'Familiar'},
    {lv:1, name_ko:'주술', name_en:'Hexes'},
    {lv:5, name_ko:'마법 인내', name_en:'Magical Fortitude'},
    {lv:7, name_ko:'전문가 주문시전자', name_en:'Expert Spellcaster'},
    {lv:9, name_ko:'반사 전문가', name_en:'Lightning Reflexes'},
    {lv:11, name_ko:'감지 전문가', name_en:'Alertness'},
    {lv:11, name_ko:'무기 전문가', name_en:'Witch Weapon Expertise'},
    {lv:13, name_ko:'방어 법의', name_en:'Defensive Robes'},
    {lv:13, name_ko:'무기 전문화', name_en:'Weapon Specialization'},
    {lv:15, name_ko:'대가 주문시전자', name_en:'Master Spellcaster'},
    {lv:17, name_ko:'제자의 의지', name_en:"Apprentice's Resolve"},
    {lv:19, name_ko:'전설 주문시전자', name_en:'Legendary Spellcaster'},
    {lv:19, name_ko:'후원자의 선물', name_en:"Patron's Gift"},
  ],
  wizard: [
    {lv:1, name_ko:'비전 주문시전', name_en:'Arcane Spellcasting'},
    {lv:1, name_ko:'비전 유대', name_en:'Arcane Bond'},
    {lv:1, name_ko:'비전 논제', name_en:'Arcane Thesis'},
    {lv:1, name_ko:'비전 학파', name_en:'Arcane School'},
    {lv:5, name_ko:'반사 전문가', name_en:'Lightning Reflexes'},
    {lv:7, name_ko:'전문가 주문시전자', name_en:'Expert Spellcaster'},
    {lv:9, name_ko:'마법 인내', name_en:'Magical Fortitude'},
    {lv:11, name_ko:'감지 전문가', name_en:'Alertness'},
    {lv:11, name_ko:'위자드 무기 전문가', name_en:'Wizard Weapon Expertise'},
    {lv:13, name_ko:'방어 법의', name_en:'Defensive Robes'},
    {lv:13, name_ko:'무기 전문화', name_en:'Weapon Specialization'},
    {lv:15, name_ko:'대가 주문시전자', name_en:'Master Spellcaster'},
    {lv:17, name_ko:'놀라운 의지', name_en:'Resolve'},
    {lv:19, name_ko:'전설 주문시전자', name_en:'Legendary Spellcaster'},
    {lv:19, name_ko:'대위자드의 주문학', name_en:"Archwizard's Spellcraft"},
  ],
};

// ═══════════════════════════════════════════════
//  AUTO-GRANTED FEATS — class features that grant feats
// ═══════════════════════════════════════════════

var CLASS_AUTO_FEATS = {
  fighter: [
    {lv:1, name_ko:'방패 막기', name_en:'Shield Block', category:'special'},
    {lv:1, name_ko:'반격 타격', name_en:'Reactive Strike', category:'special'},
  ],
  druid: [
    {lv:1, name_ko:'방패 막기', name_en:'Shield Block', category:'special'},
    {lv:1, name_ko:'자연의 목소리', name_en:'Voice of Nature', category:'special'},
  ],
  rogue: [
    {lv:1, name_ko:'은밀 공격', name_en:'Sneak Attack', category:'special'},
    {lv:1, name_ko:'기습', name_en:'Surprise Attack', category:'special'},
  ],
  ranger: [
    {lv:1, name_ko:'사냥감 추적', name_en:'Hunt Prey', category:'special'},
  ],
};

// Subclass auto-granted feats
var SUBCLASS_AUTO_FEATS = {
  'muse-maestro': [{lv:1, name_ko:'잔향 합주', name_en:'Lingering Composition', category:'special'}],
  'muse-enigma':  [{lv:1, name_ko:'바드 지식', name_en:'Bardic Lore', category:'special'}],
  'muse-warrior': [{lv:1, name_ko:'무예 공연', name_en:'Martial Performance', category:'special'}],
  'muse-lore':    [{lv:1, name_ko:'바드 지식', name_en:'Bardic Lore', category:'special'}],
};

// ═══════════════════════════════════════════════
//  AUTO-GRANTED SPELLS — added to spell tab
//  type: 'cantrip' | 'focus' | 'known'
// ═══════════════════════════════════════════════

var CLASS_AUTO_SPELLS = {
  // Bard: Inspire Courage composition cantrip at L1
  bard: [
    {lv:1, type:'focus', name_ko:'용기의 찬가', name_en:'Courageous Anthem'},
    {lv:1, type:'focus', name_ko:'대항 공연', name_en:'Counter Performance'},
  ],
};

var SUBCLASS_AUTO_SPELLS = {
  // ── 바드 뮤즈 (DB 매칭된 것만) ──
  'muse-maestro': [{lv:1, type:'focus', name_ko:'포르티시모 작곡', name_en:'Fortissimo Composition'}, {lv:1, type:'known', rank:1, name_ko:'위로', name_en:'Soothe'}],
  'muse-enigma':  [{lv:1, type:'focus', name_ko:'달인의 에튀드', name_en:"Loremaster's Etude"}, {lv:1, type:'known', rank:1, name_ko:'확실한 타격', name_en:'Sure Strike'}],
  'muse-warrior': [{lv:1, type:'known', rank:1, name_ko:'공포', name_en:'Fear'}],
  'muse-lore':    [],
  // ── 드루이드 교단 (DB 매칭) ──
  'order-flame':  [{lv:1, type:'focus', name_ko:'화염 광선', name_en:'Fire Ray'}],
  'order-leaf':   [{lv:1, type:'focus', name_ko:'선의 씨앗', name_en:'Goodberry'}],
  'order-storm':  [{lv:1, type:'focus', name_ko:'폭풍 군주', name_en:'Tempest Surge'}],
  'order-wave':   [{lv:1, type:'focus', name_ko:'조류 파도', name_en:'Tidal Surge'}],
  'order-wild':   [{lv:1, type:'focus', name_ko:'야생 변신', name_en:'Wild Shape'}],
  // order-animal: DB에 Heal Animal 없음
  // ── 위자드 학파 (DB 매칭) ──
  'school-abjuration':    [{lv:1, type:'focus', name_ko:'보호의 수호', name_en:'Protective Wards'}],
  'school-conjuration':   [{lv:1, type:'focus', name_ko:'소환 강화', name_en:'Fortify Summoning'}],
  'school-evocation':     [{lv:1, type:'focus', name_ko:'힘의 화살', name_en:'Force Bolt'}],
  'school-transmutation': [{lv:1, type:'focus', name_ko:'변형', name_en:'Shifting Form'}],
  // school-divination, enchantment, illusion, necromancy: DB에 매칭 주문 없음
  // ── 위치 후원자 (DB 매칭) ──
  'patron-curse':  [{lv:1, type:'focus', name_ko:'사악한 눈', name_en:'Evil Eye'}],
  'patron-fate':   [{lv:1, type:'focus', name_ko:'운명 조정', name_en:'Nudge Fate'}],
  'patron-fervor': [{lv:1, type:'focus', name_ko:'심장 격려', name_en:'Stoke the Heart'}],
  'patron-night':  [{lv:1, type:'focus', name_ko:'밤의 장막', name_en:'Shroud of Night'}],
  'patron-rune':   [{lv:1, type:'focus', name_ko:'비밀 간파', name_en:'Discern Secrets'}],
  // patron-wild: 야생의 말 DB에 없음 (Wilding Word)
};

// ═══════════════════════════════════════════════
//  SUBCLASS FEATURE NAMES — for display
// ═══════════════════════════════════════════════

var SUBCLASS_FEATURE_NAMES = {
  // ── 바드 뮤즈 ──
  'muse-enigma':  [{lv:1, name_ko:'바드 지식 (자유 지식 기술)', name_en:'Bardic Lore'}],
  'muse-maestro': [{lv:1, name_ko:'여운 주문 재주', name_en:'Lingering Composition'}],
  'muse-warrior': [{lv:1, name_ko:'군용 무기 훈련', name_en:'Martial Weapon Training'}],
  'muse-lore':    [{lv:1, name_ko:'지식 기술 2개 추가', name_en:'Lore Skills'}],
  // ── 클레릭 교리 ──
  'doctrine-cloistered': [
    {lv:1,  name_ko:'도메인 개시 주문 1개', name_en:'Domain Initiate Spell'},
    {lv:3,  name_ko:'전문가 주문시전자', name_en:'Expert Spellcaster'},
    {lv:15, name_ko:'달인 주문시전자', name_en:'Master Spellcaster'},
    {lv:19, name_ko:'전설 주문시전자', name_en:'Legendary Spellcaster'},
  ],
  'doctrine-warpriest': [
    {lv:1,  name_ko:'군용 무기/평갑 훈련', name_en:'Martial & Medium Armor'},
    {lv:3,  name_ko:'반사 전문가', name_en:'Expert Reflex'},
    {lv:7,  name_ko:'전문가 주문시전자', name_en:'Expert Spellcaster'},
    {lv:15, name_ko:'달인 주문시전자', name_en:'Master Spellcaster'},
  ],
  // ── 드루이드 교단 ──
  'order-animal': [{lv:1, name_ko:'동물 친구 습득', name_en:'Animal Companion'}],
  'order-flame':  [{lv:1, name_ko:'집중 주문: 불꽃 씨앗', name_en:'Fire Ray'}],
  'order-leaf':   [{lv:1, name_ko:'집중 주문: 치유의 새싹', name_en:'Goodberry'}],
  'order-storm':  [{lv:1, name_ko:'집중 주문: 폭풍 쇄도', name_en:'Tempest Surge'}],
  'order-wave':   [{lv:1, name_ko:'집중 주문: 물의 채찍', name_en:'Tidal Surge'}],
  'order-wild':   [{lv:1, name_ko:'집중 주문: 야수 형태', name_en:'Wild Shape'}],
  // ── 레인저 사냥 방식 ──
  'edge-flurry':    [{lv:1, name_ko:'다중 공격 페널티 감소', name_en:'Flurry: -3/-6 MAP'}],
  'edge-outwit':    [{lv:1, name_ko:'사냥 목표 AC +1', name_en:'Outwit: +1 AC vs Prey'}],
  'edge-precision': [{lv:1, name_ko:'첫 타 정밀 피해 +1d8', name_en:'Precision: +1d8'}],
  // ── 로그 전문 ──
  'racket-thief':     [{lv:1, name_ko:'민첩→피해 (기교 무기)', name_en:'DEX to damage (finesse)'}],
  'racket-scoundrel': [{lv:1, name_ko:'기만/위협→방어불가', name_en:'Feint/Demoralize → Flat-footed'}],
  'racket-mastermind':[{lv:1, name_ko:'지식 확인→방어불가', name_en:'Recall Knowledge → Flat-footed'}],
  'racket-acrobat':   [{lv:1, name_ko:'곡예→스닉 어택 기회', name_en:'Acrobatics → Sneak Attack'}],
  'racket-assassin':  [{lv:1, name_ko:'기습 라운드 +2d6', name_en:'Surprise +2d6'}],
  'racket-eldritch-trickster': [{lv:1, name_ko:'주문→스닉 어택', name_en:'Spell → Sneak Attack'}],
  // ── 위치 후원자 ──
  'patron-curse':  [{lv:1, name_ko:'오컬트 전통 / 주술: 악의 눈', name_en:'Occult / Evil Eye'}],
  'patron-fate':   [{lv:1, name_ko:'오컬트 전통 / 주술: 운명의 실', name_en:'Occult / Nudge Fate'}],
  'patron-fervor': [{lv:1, name_ko:'신성 전통 / 주술: 마음 불꽃', name_en:'Divine / Stoke the Heart'}],
  'patron-night':  [{lv:1, name_ko:'오컬트 전통 / 주술: 마녀의 빗장', name_en:'Occult / Shroud of Night'}],
  'patron-rune':   [{lv:1, name_ko:'비전 전통 / 주술: 파멸의 서약', name_en:'Arcane / Discern Secrets'}],
  'patron-wild':   [{lv:1, name_ko:'원시 전통 / 주술: 야생의 분노', name_en:'Primal / Wilding Word'}],
  // ── 위자드 마법학파 ──
  'school-abjuration':    [{lv:1, name_ko:'학파 주문: 마법 방어막', name_en:'Protective Wards'}],
  'school-conjuration':   [{lv:1, name_ko:'학파 주문: 비전 소환', name_en:'Augment Summoning'}],
  'school-divination':    [{lv:1, name_ko:'학파 주문: 예언의 눈', name_en:"Diviner's Sight"}],
  'school-enchantment':   [{lv:1, name_ko:'학파 주문: 매혹의 말', name_en:'Charming Words'}],
  'school-evocation':     [{lv:1, name_ko:'학파 주문: 힘의 화살', name_en:'Force Bolt'}],
  'school-illusion':      [{lv:1, name_ko:'학파 주문: 지형 왜곡', name_en:'Warped Terrain'}],
  'school-necromancy':    [{lv:1, name_ko:'학파 주문: 무덤의 부름', name_en:'Call of the Grave'}],
  'school-transmutation': [{lv:1, name_ko:'학파 주문: 물질 변형', name_en:'Shifting Form'}],
  'school-unified':       [{lv:1, name_ko:'통합 이론: 유연한 학파', name_en:'Universalist Flexibility'}],
};

// ═══════════════════════════════════════════════
//  DEITY DATABASE — PF2e Player Core
//  weapon = WEAPON_DB name_ko, skill = SKILLS id
// ═══════════════════════════════════════════════

var DEITY_DB = [
  {id:'abadar',     name_ko:'아바다르',       name_en:'Abadar',         weapon:'석궁',       skill:'society',   sanctification:['holy'],           domains:['도시','대지','여행','부'],
   title:'첫 번째 금고의 주인', desc:'세계의 야생에 문명을 가져오고, 법의 준수를 장려하며, 문명 내에서 상업과 무역을 촉진합니다.<br><b>관심 영역:</b> 도시, 법, 상인, 부<br><b>계율:</b> 개척지에 문명을 가져오라, 근면과 무역으로 부를 쌓으라, 법을 따르라<br><b>금기:</b> 산적질이나 해적 행위, 절도, 준법 법정의 약화'},
  {id:'asmodeus',   name_ko:'아스모데우스',   name_en:'Asmodeus',       weapon:'메이스',     skill:'deception', sanctification:['unholy'],         domains:['자신감','화염','속임수','폭정'],
   title:'어둠의 왕자', desc:'필멸자를 타락에 굴복하도록 유혹하는 것을 즐깁니다. 모든 이가 자신의 위치를 아는 위계질서를 장려하며, 자신의 이기적 이익을 위해 질서를 이용합니다.<br><b>관심 영역:</b> 계약, 억압, 자만, 폭정<br><b>계율:</b> 최대한 유리하게 계약을 협상하라, 폭군적으로 통치하고 약한 존재를 고문하라, 윗사람에게 복종하라'},
  {id:'calistria',  name_ko:'칼리스트리아',   name_en:'Calistria',      weapon:'채찍',       skill:'deception', sanctification:['holy','unholy'],  domains:['고통','열정','비밀','속임수'],
   title:'맛보는 일침', desc:'다른 이를 속이고 자신을 경시한 자에게 복수를 구하는 장난기 많고 변덕스러운 매력의 신. 엘프에게 가장 널리 숭배됩니다.<br><b>관심 영역:</b> 정욕, 복수, 속임수<br><b>계율:</b> 개인의 자유를 추구하라, 쾌락주의적 스릴을 찾으라, 복수하라'},
  {id:'cayden',     name_ko:'카이든 카일리언',name_en:'Cayden Cailean', weapon:'레이피어',   skill:'athletics', sanctification:['holy'],           domains:['도시','자유','방탕','힘'],
   title:'우연의 신', desc:'술에 취한 도전으로 필멸의 삶에서 승천했습니다. 자유를 촉진하고 다른 이들이 삶에서 자신만의 길을 찾도록 격려합니다.<br><b>관심 영역:</b> 맥주, 용기, 자유, 와인<br><b>계율:</b> 마셔라, 억압받는 이를 도우라, 영광과 모험을 추구하라'},
  {id:'desna',      name_ko:'데스나',         name_en:'Desna',          weapon:'대거',       skill:'acrobatics', sanctification:['holy'],          domains:['꿈','행운','달','여행'],
   title:'천구의 노래', desc:'하늘에 시선을 두고, 어둠 속 여행자를 인도하고 악몽 속 꿈꾸는 이를 이끌기 위해 하늘에 별을 놓았습니다. 자유와 미스터리를 즐깁니다.<br><b>관심 영역:</b> 꿈, 행운, 별, 여행자<br><b>계율:</b> 동료 여행자를 돕고, 새로운 장소를 탐험하고, 예술과 노래로 자신을 표현하라'},
  {id:'erastil',    name_ko:'에라스틸',       name_en:'Erastil',        weapon:'장궁',       skill:'survival',  sanctification:['holy'],           domains:['대지','가족','자연','부'],
   title:'오래된 사냥꾼', desc:'오래전 뿔 달린 사냥의 신이었지만, 숭배는 농촌 공동체에 집중하는 것으로 진화했습니다. 추종자들의 평화로운 삶만을 바라며, 그 목가적 존재가 위협받을 때만 무기를 들도록 합니다.<br><b>관심 영역:</b> 가족, 농업, 사냥, 무역<br><b>계율:</b> 가정과 가족을 돌보라, 의무를 이행하라, 평화를 유지하라'},
  {id:'gorum',      name_ko:'고룸',           name_en:'Gorum',          weapon:'그레이트소드',skill:'athletics', sanctification:['holy','unholy'],  domains:['자신감','파괴','힘','열정'],
   title:'무쇠의 군주', desc:'전장에서 영광을 구하는 자라면 누구든 기도합니다. 무력을 강조하며, 추종자들에게 궁극적인 숭배 방법으로 전쟁과 전투를 추구하도록 권합니다.<br><b>관심 영역:</b> 전투, 근력, 무기<br><b>계율:</b> 공정한 전투에서 승리하라, 한계를 밀어붙여라, 전투에서 갑옷을 착용하라'},
  {id:'gozreh',     name_ko:'고즈레',         name_en:'Gozreh',         weapon:'삼지창',     skill:'survival',  sanctification:['holy'],           domains:['공기','자연','바다','날씨'],
   title:'바람과 파도', desc:'두 측면을 가진 신격으로, 대지를 감싸는 바다이자 그 표면을 움직이는 바람입니다. 드루이드와 야생을 보존하려는 자들에게 인기 있습니다.<br><b>관심 영역:</b> 자연, 바다, 날씨<br><b>계율:</b> 모든 형태의 자연을 소중히 여기고, 보호하고, 존중하라'},
  {id:'iomedae',    name_ko:'아이오메다이',   name_en:'Iomedae',        weapon:'롱소드',     skill:'intimidation',sanctification:['holy'],          domains:['자신감','힘','진실','열정'],
   title:'상속자', desc:'승천 전, 언데드와의 전쟁에서 신성한 전사였습니다. 미덕의 가치를 지키며, 사악하고 부정한 자에 맞서 싸웁니다.<br><b>관심 영역:</b> 명예, 정의, 통치, 용기<br><b>계율:</b> 절제하라, 정의와 명예를 위해 싸우라, 마음에 용기를 품으라'},
  {id:'irori',      name_ko:'이로리',         name_en:'Irori',          weapon:'주먹',       skill:'athletics', sanctification:['holy'],           domains:['지식','힘','진실','완벽'],
   title:'지식의 대가', desc:'필멸자로서 진정한 깨달음을 얻어 신성을 이루었습니다. 규율을 장려하고, 자신을 극복한 자가 세상이 제공하는 최고의 혜택을 찾는다고 가르칩니다.<br><b>관심 영역:</b> 역사, 지식, 자기완성<br><b>계율:</b> 겸손하라, 몸·정신·영혼을 더 완벽한 상태로 연마하라, 규율을 실천하라'},
  {id:'lamashtu',   name_ko:'라마슈투',       name_en:'Lamashtu',       weapon:'팔치온',     skill:'survival',  sanctification:['unholy'],         domains:['가족','힘','악몽','속임수'],
   title:'괴물의 어머니', desc:'순수한 것의 타락을 즐깁니다. 그녀의 개입으로 남은 신체적 변화와 악몽은 추종자들에게 선물로 여겨지고, 외부 세계에는 원치 않는 공포입니다.<br><b>관심 영역:</b> 기형, 괴물, 악몽<br><b>계율:</b> 추방자와 소외된 자에게 힘을 가져다주라, 라마슈투의 가르침을 전파하라, 아름다운 것을 괴물스럽게 만들라'},
  {id:'nethys',     name_ko:'네티스',         name_en:'Nethys',         weapon:'지팡이',     skill:'arcana',    sanctification:['holy','unholy'],  domains:['파괴','지식','마법','보호'],
   title:'모든 것을 보는 눈', desc:'한때 필멸의 마법 대가였으나 마법의 전체 잠재력을 진정으로 이해하면서 신성에 올랐습니다. 이원적 신으로, 마법의 파괴적이고 보호적인 잠재력 모두를 가르칩니다.<br><b>관심 영역:</b> 마법<br><b>계율:</b> 마법의 힘을 찾아 사용하라'},
  {id:'norgorber',  name_ko:'노르고르버',     name_en:'Norgorber',      weapon:'쇼트소드',   skill:'stealth',   sanctification:['unholy'],         domains:['죽음','비밀','속임수','부'],
   title:'회색 주인', desc:'네 가지 측면으로 숭배됩니다: 연금술사와 독살자의 동맹인 검은 손가락, 살인적인 가죽벗기는 아버지, 도둑질하는 회색 주인, 비밀스러운 명성의 수확자.<br><b>관심 영역:</b> 탐욕, 살인, 독, 비밀<br><b>계율:</b> 진정한 정체를 비밀로 유지하라, 그림자에서 일하라'},
  {id:'pharasma',   name_ko:'파라즈마',       name_en:'Pharasma',       weapon:'대거',       skill:'medicine',  sanctification:['holy'],           domains:['죽음','운명','치유','영혼'],
   title:'죽음의 여인', desc:'대부분의 다른 신들보다 고대하고 강력하며, 뼈의 정원(Boneyard)의 옥좌에서 죽은 모든 이의 영혼을 심판합니다. 출생과 죽음의 자연적 순환이 방해받지 않도록 합니다.<br><b>관심 영역:</b> 출생, 죽음, 운명, 예언, 시간<br><b>계율:</b> 고대 예언을 이해하려 노력하라, 언데드를 파괴하라, 시신을 안식시켜라'},
  {id:'rovagug',    name_ko:'로바구그',       name_en:'Rovagug',        weapon:'그레이트액스',skill:'athletics', sanctification:['unholy'],         domains:['공기','파괴','대지','열정'],
   title:'거친 야수', desc:'오래전 많은 신들이 합심하여 골라리온의 핵심에 투옥했으며, 언젠가 탈출하여 세계에 파멸을 가져오려 합니다. 모든 것의 궁극적 파괴를 추구하는 자들이 섬깁니다.<br><b>관심 영역:</b> 파괴, 재앙, 분노<br><b>계율:</b> 모든 것을 파괴하라, 로바구그를 감옥에서 해방시켜라'},
  {id:'sarenrae',   name_ko:'사렌라이',       name_en:'Sarenrae',       weapon:'시미터',     skill:'medicine',  sanctification:['holy'],           domains:['화염','치유','태양','진실'],
   title:'새벽꽃', desc:'한때 강력한 천사이자 천상의 군주였으며, 로바구그를 투옥하는 선두에 섰습니다. 가능한 곳에서 악을 구원하고, 구원될 수 없을 때 태양의 불꽃으로 태워 없앱니다.<br><b>관심 영역:</b> 치유, 정직한 구원, 태양<br><b>계율:</b> 로바구그의 생성물을 파괴하라, 아군을 보호하라, 병들고 부상당한 이에게 도움을 제공하라'},
  {id:'shelyn',     name_ko:'셸린',           name_en:'Shelyn',         weapon:'글레이브',   skill:'crafting',  sanctification:['holy'],           domains:['창조','가족','열정','보호'],
   title:'영원한 장미', desc:'평화와 사랑을 촉진하며, 때로 어두운 세계에서 아름다움을 창조하도록 추종자들을 격려합니다. 언젠가 타락한 오빠 존쿠손을 구원하려 합니다.<br><b>관심 영역:</b> 예술, 아름다움, 사랑, 음악<br><b>계율:</b> 평화롭게 지내라, 예술을 선택하고 완성하라, 모든 것에서 아름다움을 봐라'},
  {id:'torag',      name_ko:'토라그',         name_en:'Torag',          weapon:'워해머',     skill:'crafting',  sanctification:['holy'],           domains:['창조','대지','가족','보호'],
   title:'창조의 아버지', desc:'많은 드워프에게 창조의 아버지로 존경받으며, 숭배되는 모든 공동체를 보호하기 위해 노력합니다. 제작과 창조를 소중히 여기는 이들도 따릅니다.<br><b>관심 영역:</b> 대장간, 보호, 전략<br><b>계율:</b> 명예롭고 솔직하라, 약속을 지켜라, 대장간을 존중하라, 백성을 섬겨라'},
  {id:'urgathoa',   name_ko:'우르가토아',     name_en:'Urgathoa',       weapon:'대낫',       skill:'intimidation',sanctification:['unholy'],        domains:['방탕','마법','힘','언데드'],
   title:'창백한 공주', desc:'살아있는 세계의 쾌락에 너무 매료된 나머지, 죽음과 사후세계의 속박에서 탈출하여 최초의 언데드가 되었습니다. 쾌락주의적 방식을 공유하고 언데드를 퍼뜨리는 것을 즐깁니다.<br><b>관심 영역:</b> 질병, 탐식, 언데드<br><b>계율:</b> 죽음 시 언데드가 되라, 언데드를 생성하거나 보호하라, 식욕을 충족시켜라'},
  {id:'zonkuthon',  name_ko:'존-쿠톤',       name_en:'Zon-Kuthon',     weapon:'시미터',     skill:'intimidation',sanctification:['unholy'],        domains:['어둠','파괴','고통','공허'],
   title:'밤의 왕자', desc:'한때 셸린의 오빠였으나 먼 차원에서 돌아온 후 끔찍하게 변형되었습니다. 어둠, 상실, 고통 속에서 즐거움을 찾으며, 추종자들에게도 같은 것을 권합니다.<br><b>관심 영역:</b> 어둠, 상실, 고통<br><b>계율:</b> 고통을 가져오라, 어둠에 자신을 빠뜨려라'},
];

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
