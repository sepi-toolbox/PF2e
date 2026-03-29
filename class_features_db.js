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
    {lv:1, name_ko:'신성 글꼴', name_en:'Divine Font'},
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
    {lv:13, name_ko:'중갑 전문가', name_en:'Medium Armor Expertise'},
    {lv:13, name_ko:'무기 전문화', name_en:'Weapon Specialization'},
    {lv:15, name_ko:'대가 주문시전자', name_en:'Master Spellcaster'},
    {lv:19, name_ko:'전설 주문시전자', name_en:'Legendary Spellcaster'},
    {lv:19, name_ko:'근원 대사제', name_en:'Primal Hierophant'},
  ],
  fighter: [
    {lv:1, name_ko:'반격 타격', name_en:'Reactive Strike'},
    {lv:1, name_ko:'방패 막기', name_en:'Shield Block', type:'feat'},
    {lv:3, name_ko:'용기', name_en:'Bravery'},
    {lv:5, name_ko:'파이터 무기 달인', name_en:'Fighter Weapon Mastery'},
    {lv:7, name_ko:'전장 측량', name_en:'Battlefield Surveyor'},
    {lv:7, name_ko:'무기 전문화', name_en:'Weapon Specialization'},
    {lv:9, name_ko:'전투 단련', name_en:'Combat Flexibility'},
    {lv:9, name_ko:'전투 유연성', name_en:'Juggernaut'},
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
    {lv:11, name_ko:'중갑 전문가', name_en:'Medium Armor Expertise'},
    {lv:11, name_ko:'방해받지 않는 여정', name_en:'Unhindered Journey'},
    {lv:13, name_ko:'군용 무기 달인', name_en:'Weapon Mastery'},
    {lv:15, name_ko:'상위 자연 반사', name_en:'Greater Evasion'},
    {lv:15, name_ko:'상위 무기 전문화', name_en:'Greater Weapon Specialization'},
    {lv:15, name_ko:'감지 전설', name_en:'Incredible Senses'},
    {lv:17, name_ko:'달인 사냥꾼', name_en:'Masterful Hunter'},
    {lv:19, name_ko:'중갑 달인', name_en:'Medium Armor Mastery'},
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
  'muse-maestro': [{lv:1, type:'focus', name_ko:'포르티시모 작곡', name_en:'Fortissimo Composition'}],
  'muse-enigma':  [{lv:1, type:'focus', name_ko:'달인의 에튀드', name_en:"Loremaster's Etude"}],
  // muse-warrior, muse-lore: DB에 매칭 주문 없음
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
    {lv:1,  name_ko:'군용 무기/중갑 훈련', name_en:'Martial & Medium Armor'},
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
  'patron-curse':  [{lv:1, name_ko:'비의 전통 / 주술: 악의 눈', name_en:'Occult / Evil Eye'}],
  'patron-fate':   [{lv:1, name_ko:'비의 전통 / 주술: 운명의 실', name_en:'Occult / Nudge Fate'}],
  'patron-fervor': [{lv:1, name_ko:'신성 전통 / 주술: 마음 불꽃', name_en:'Divine / Stoke the Heart'}],
  'patron-night':  [{lv:1, name_ko:'비의 전통 / 주술: 마녀의 빗장', name_en:'Occult / Shroud of Night'}],
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
  {id:'abadar',     name_ko:'아바다르',       name_en:'Abadar',         weapon:'석궁',       skill:'society',   sanctification:['holy'],           domains:['도시','대지','여행','부']},
  {id:'asmodeus',   name_ko:'아스모데우스',   name_en:'Asmodeus',       weapon:'메이스',     skill:'deception', sanctification:['unholy'],         domains:['자신감','불','계략','폭정']},
  {id:'calistria',  name_ko:'칼리스트리아',   name_en:'Calistria',      weapon:'채찍',       skill:'deception', sanctification:['holy','unholy'],  domains:['고통','열정','비밀','계략']},
  {id:'cayden',     name_ko:'카이든 카일리언',name_en:'Cayden Cailean', weapon:'레이피어',   skill:'athletics', sanctification:['holy'],           domains:['도시','자유','방탕','힘']},
  {id:'desna',      name_ko:'데스나',         name_en:'Desna',          weapon:'대거',       skill:'acrobatics', sanctification:['holy'],          domains:['꿈','행운','달','여행']},
  {id:'erastil',    name_ko:'에라스틸',       name_en:'Erastil',        weapon:'장궁',       skill:'survival',  sanctification:['holy'],           domains:['대지','가족','자연','부']},
  {id:'gorum',      name_ko:'고룸',           name_en:'Gorum',          weapon:'그레이트소드',skill:'athletics', sanctification:['holy','unholy'],  domains:['자신감','파괴','힘','열정']},
  {id:'gozreh',     name_ko:'고즈레',         name_en:'Gozreh',         weapon:'삼지창',     skill:'survival',  sanctification:['holy'],           domains:['공기','자연','바다','날씨']},
  {id:'iomedae',    name_ko:'아이오메다이',   name_en:'Iomedae',        weapon:'롱소드',     skill:'intimidation',sanctification:['holy'],          domains:['자신감','힘','진실','열정']},
  {id:'irori',      name_ko:'이로리',         name_en:'Irori',          weapon:'주먹',       skill:'athletics', sanctification:['holy'],           domains:['지식','힘','진실','완벽']},
  {id:'lamashtu',   name_ko:'라마슈투',       name_en:'Lamashtu',       weapon:'팔치온',     skill:'survival',  sanctification:['unholy'],         domains:['가족','힘','밤','계략']},
  {id:'nethys',     name_ko:'네티스',         name_en:'Nethys',         weapon:'지팡이',     skill:'arcana',    sanctification:['holy','unholy'],  domains:['파괴','지식','마법','보호']},
  {id:'norgorber',  name_ko:'노르고르버',     name_en:'Norgorber',      weapon:'쇼트소드',   skill:'stealth',   sanctification:['unholy'],         domains:['죽음','비밀','계략','부']},
  {id:'pharasma',   name_ko:'파라즈마',       name_en:'Pharasma',       weapon:'대거',       skill:'medicine',  sanctification:['holy'],           domains:['죽음','운명','치유','영혼']},
  {id:'rovagug',    name_ko:'로바구그',       name_en:'Rovagug',        weapon:'그레이트액스',skill:'athletics', sanctification:['unholy'],         domains:['공기','파괴','대지','열정']},
  {id:'sarenrae',   name_ko:'사렌라이',       name_en:'Sarenrae',       weapon:'시미터',     skill:'medicine',  sanctification:['holy'],           domains:['불','치유','빛','진실']},
  {id:'shelyn',     name_ko:'셸린',           name_en:'Shelyn',         weapon:'글레이브',   skill:'crafting',  sanctification:['holy'],           domains:['창조','가족','열정','보호']},
  {id:'torag',      name_ko:'토라그',         name_en:'Torag',          weapon:'워해머',     skill:'crafting',  sanctification:['holy'],           domains:['창조','대지','가족','보호']},
  {id:'urgathoa',   name_ko:'우르가토아',     name_en:'Urgathoa',       weapon:'대낫',       skill:'intimidation',sanctification:['unholy'],        domains:['방탕','마법','힘','언데드']},
  {id:'zonkuthon',  name_ko:'존-쿠톤',       name_en:'Zon-Kuthon',     weapon:'시미터',     skill:'intimidation',sanctification:['unholy'],        domains:['어둠','파괴','고통','공허']},
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
