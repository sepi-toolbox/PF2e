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

// ═══════════════════════════════════════════════
//  CLASS FEATURE NAMES — for display in growth plan
//  Each entry: {lv, name_ko, name_en, type?}
//  type: 'feat' = auto-granted feat, undefined = display-only
// ═══════════════════════════════════════════════

var CLASS_FEATURE_NAMES = (function() {
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
})();

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

// ═══════════════════════════════════════════════
//  SUBCLASS FEATURE NAMES — for display
// ═══════════════════════════════════════════════

// ═══════════════════════════════════════════════
//  DEITY DATABASE — PF2e Player Core
//  weapon = WEAPON_DB name_ko, skill = SKILLS id
// ═══════════════════════════════════════════════

var DEITY_DB = [
  {
    "id": "abadar",
    "name_ko": "아바다르",
    "name_en": "Abadar",
    "weapon": "crossbow",
    "skill": "society",
    "sanctification": [
      "holy"
    ],
    "domains": [
      "cities",
      "earth",
      "travel",
      "wealth"
    ],
    "title": "첫 번째 금고의 주인",
    "desc": "세계의 야생에 문명을 가져오고, 법의 준수를 장려하며, 문명 내에서 상업과 무역을 촉진합니다.<br><b>관심 영역:</b> 도시, 법, 상인, 부<br><b>계율:</b> 개척지에 문명을 가져오라, 근면과 무역으로 부를 쌓으라, 법을 따르라<br><b>금기:</b> 산적질이나 해적 행위, 절도, 준법 법정의 약화"
  },
  {
    "id": "asmodeus",
    "name_ko": "아스모데우스",
    "name_en": "Asmodeus",
    "weapon": "mace",
    "skill": "deception",
    "sanctification": [
      "unholy"
    ],
    "domains": [
      "confidence",
      "fire",
      "trickery",
      "tyranny"
    ],
    "title": "어둠의 왕자",
    "desc": "필멸자를 타락에 굴복하도록 유혹하는 것을 즐깁니다. 모든 이가 자신의 위치를 아는 위계질서를 장려하며, 자신의 이기적 이익을 위해 질서를 이용합니다.<br><b>관심 영역:</b> 계약, 억압, 자만, 폭정<br><b>계율:</b> 최대한 유리하게 계약을 협상하라, 폭군적으로 통치하고 약한 존재를 고문하라, 윗사람에게 복종하라"
  },
  {
    "id": "calistria",
    "name_ko": "칼리스트리아",
    "name_en": "Calistria",
    "weapon": "whip",
    "skill": "deception",
    "sanctification": [
      "holy",
      "unholy"
    ],
    "domains": [
      "pain",
      "passion",
      "secrecy",
      "trickery"
    ],
    "title": "맛보는 일침",
    "desc": "다른 이를 속이고 자신을 경시한 자에게 복수를 구하는 장난기 많고 변덕스러운 매력의 신. 엘프에게 가장 널리 숭배됩니다.<br><b>관심 영역:</b> 정욕, 복수, 속임수<br><b>계율:</b> 개인의 자유를 추구하라, 쾌락주의적 스릴을 찾으라, 복수하라"
  },
  {
    "id": "cayden",
    "name_ko": "카이든 카일리언",
    "name_en": "Cayden Cailean",
    "weapon": "rapier",
    "skill": "athletics",
    "sanctification": [
      "holy"
    ],
    "domains": [
      "cities",
      "freedom",
      "indulgence",
      "might"
    ],
    "title": "우연의 신",
    "desc": "술에 취한 도전으로 필멸의 삶에서 승천했습니다. 자유를 촉진하고 다른 이들이 삶에서 자신만의 길을 찾도록 격려합니다.<br><b>관심 영역:</b> 맥주, 용기, 자유, 와인<br><b>계율:</b> 마셔라, 억압받는 이를 도우라, 영광과 모험을 추구하라"
  },
  {
    "id": "desna",
    "name_ko": "데스나",
    "name_en": "Desna",
    "weapon": "dagger",
    "skill": "acrobatics",
    "sanctification": [
      "holy"
    ],
    "domains": [
      "dreams",
      "luck",
      "moon",
      "travel"
    ],
    "title": "천구의 노래",
    "desc": "하늘에 시선을 두고, 어둠 속 여행자를 인도하고 악몽 속 꿈꾸는 이를 이끌기 위해 하늘에 별을 놓았습니다. 자유와 미스터리를 즐깁니다.<br><b>관심 영역:</b> 꿈, 행운, 별, 여행자<br><b>계율:</b> 동료 여행자를 돕고, 새로운 장소를 탐험하고, 예술과 노래로 자신을 표현하라"
  },
  {
    "id": "erastil",
    "name_ko": "에라스틸",
    "name_en": "Erastil",
    "weapon": "longbow",
    "skill": "survival",
    "sanctification": [
      "holy"
    ],
    "domains": [
      "earth",
      "family",
      "nature",
      "wealth"
    ],
    "title": "오래된 사냥꾼",
    "desc": "오래전 뿔 달린 사냥의 신이었지만, 숭배는 농촌 공동체에 집중하는 것으로 진화했습니다. 추종자들의 평화로운 삶만을 바라며, 그 목가적 존재가 위협받을 때만 무기를 들도록 합니다.<br><b>관심 영역:</b> 가족, 농업, 사냥, 무역<br><b>계율:</b> 가정과 가족을 돌보라, 의무를 이행하라, 평화를 유지하라"
  },
  {
    "id": "gorum",
    "name_ko": "고룸",
    "name_en": "Gorum",
    "weapon": "greatsword",
    "skill": "athletics",
    "sanctification": [
      "holy",
      "unholy"
    ],
    "domains": [
      "confidence",
      "destruction",
      "might",
      "passion"
    ],
    "title": "무쇠의 군주",
    "desc": "전장에서 영광을 구하는 자라면 누구든 기도합니다. 무력을 강조하며, 추종자들에게 궁극적인 숭배 방법으로 전쟁과 전투를 추구하도록 권합니다.<br><b>관심 영역:</b> 전투, 근력, 무기<br><b>계율:</b> 공정한 전투에서 승리하라, 한계를 밀어붙여라, 전투에서 갑옷을 착용하라"
  },
  {
    "id": "gozreh",
    "name_ko": "고즈레",
    "name_en": "Gozreh",
    "weapon": "trident",
    "skill": "survival",
    "sanctification": [
      "holy"
    ],
    "domains": [
      "air",
      "nature",
      "water",
      "travel"
    ],
    "title": "바람과 파도",
    "desc": "두 측면을 가진 신격으로, 대지를 감싸는 바다이자 그 표면을 움직이는 바람입니다. 드루이드와 야생을 보존하려는 자들에게 인기 있습니다.<br><b>관심 영역:</b> 자연, 바다, 날씨<br><b>계율:</b> 모든 형태의 자연을 소중히 여기고, 보호하고, 존중하라"
  },
  {
    "id": "iomedae",
    "name_ko": "아이오메다이",
    "name_en": "Iomedae",
    "weapon": "longsword",
    "skill": "intimidation",
    "sanctification": [
      "holy"
    ],
    "domains": [
      "confidence",
      "might",
      "truth",
      "passion"
    ],
    "title": "상속자",
    "desc": "승천 전, 언데드와의 전쟁에서 신성한 전사였습니다. 미덕의 가치를 지키며, 사악하고 부정한 자에 맞서 싸웁니다.<br><b>관심 영역:</b> 명예, 정의, 통치, 용기<br><b>계율:</b> 절제하라, 정의와 명예를 위해 싸우라, 마음에 용기를 품으라"
  },
  {
    "id": "irori",
    "name_ko": "이로리",
    "name_en": "Irori",
    "weapon": "fist",
    "skill": "athletics",
    "sanctification": [
      "holy"
    ],
    "domains": [
      "knowledge",
      "might",
      "truth",
      "perfection"
    ],
    "title": "지식의 대가",
    "desc": "필멸자로서 진정한 깨달음을 얻어 신성을 이루었습니다. 규율을 장려하고, 자신을 극복한 자가 세상이 제공하는 최고의 혜택을 찾는다고 가르칩니다.<br><b>관심 영역:</b> 역사, 지식, 자기완성<br><b>계율:</b> 겸손하라, 몸·정신·영혼을 더 완벽한 상태로 연마하라, 규율을 실천하라"
  },
  {
    "id": "lamashtu",
    "name_ko": "라마슈투",
    "name_en": "Lamashtu",
    "weapon": "falchion",
    "skill": "survival",
    "sanctification": [
      "unholy"
    ],
    "domains": [
      "family",
      "might",
      "nightmares",
      "trickery"
    ],
    "title": "괴물의 어머니",
    "desc": "순수한 것의 타락을 즐깁니다. 그녀의 개입으로 남은 신체적 변화와 악몽은 추종자들에게 선물로 여겨지고, 외부 세계에는 원치 않는 공포입니다.<br><b>관심 영역:</b> 기형, 괴물, 악몽<br><b>계율:</b> 추방자와 소외된 자에게 힘을 가져다주라, 라마슈투의 가르침을 전파하라, 아름다운 것을 괴물스럽게 만들라"
  },
  {
    "id": "nethys",
    "name_ko": "네티스",
    "name_en": "Nethys",
    "weapon": "staff",
    "skill": "arcana",
    "sanctification": [
      "holy",
      "unholy"
    ],
    "domains": [
      "destruction",
      "knowledge",
      "magic",
      "protection"
    ],
    "title": "모든 것을 보는 눈",
    "desc": "한때 필멸의 마법 대가였으나 마법의 전체 잠재력을 진정으로 이해하면서 신성에 올랐습니다. 이원적 신으로, 마법의 파괴적이고 보호적인 잠재력 모두를 가르칩니다.<br><b>관심 영역:</b> 마법<br><b>계율:</b> 마법의 힘을 찾아 사용하라"
  },
  {
    "id": "norgorber",
    "name_ko": "노르고르버",
    "name_en": "Norgorber",
    "weapon": "shortsword",
    "skill": "stealth",
    "sanctification": [
      "unholy"
    ],
    "domains": [
      "death",
      "secrecy",
      "trickery",
      "wealth"
    ],
    "title": "회색 주인",
    "desc": "네 가지 측면으로 숭배됩니다: 연금술사와 독살자의 동맹인 검은 손가락, 살인적인 가죽벗기는 아버지, 도둑질하는 회색 주인, 비밀스러운 명성의 수확자.<br><b>관심 영역:</b> 탐욕, 살인, 독, 비밀<br><b>계율:</b> 진정한 정체를 비밀로 유지하라, 그림자에서 일하라"
  },
  {
    "id": "pharasma",
    "name_ko": "파라즈마",
    "name_en": "Pharasma",
    "weapon": "dagger",
    "skill": "medicine",
    "sanctification": [
      "holy"
    ],
    "domains": [
      "death",
      "fate",
      "healing",
      "soul"
    ],
    "title": "죽음의 여인",
    "desc": "대부분의 다른 신들보다 고대하고 강력하며, 뼈의 정원(Boneyard)의 옥좌에서 죽은 모든 이의 영혼을 심판합니다. 출생과 죽음의 자연적 순환이 방해받지 않도록 합니다.<br><b>관심 영역:</b> 출생, 죽음, 운명, 예언, 시간<br><b>계율:</b> 고대 예언을 이해하려 노력하라, 언데드를 파괴하라, 시신을 안식시켜라"
  },
  {
    "id": "rovagug",
    "name_ko": "로바구그",
    "name_en": "Rovagug",
    "weapon": "greataxe",
    "skill": "athletics",
    "sanctification": [
      "unholy"
    ],
    "domains": [
      "air",
      "destruction",
      "earth",
      "passion"
    ],
    "title": "거친 야수",
    "desc": "오래전 많은 신들이 합심하여 골라리온의 핵심에 투옥했으며, 언젠가 탈출하여 세계에 파멸을 가져오려 합니다. 모든 것의 궁극적 파괴를 추구하는 자들이 섬깁니다.<br><b>관심 영역:</b> 파괴, 재앙, 분노<br><b>계율:</b> 모든 것을 파괴하라, 로바구그를 감옥에서 해방시켜라"
  },
  {
    "id": "sarenrae",
    "name_ko": "사렌라이",
    "name_en": "Sarenrae",
    "weapon": "scimitar",
    "skill": "medicine",
    "sanctification": [
      "holy"
    ],
    "domains": [
      "fire",
      "healing",
      "sun",
      "truth"
    ],
    "title": "새벽꽃",
    "desc": "한때 강력한 천사이자 천상의 군주였으며, 로바구그를 투옥하는 선두에 섰습니다. 가능한 곳에서 악을 구원하고, 구원될 수 없을 때 태양의 불꽃으로 태워 없앱니다.<br><b>관심 영역:</b> 치유, 정직한 구원, 태양<br><b>계율:</b> 로바구그의 생성물을 파괴하라, 아군을 보호하라, 병들고 부상당한 이에게 도움을 제공하라"
  },
  {
    "id": "shelyn",
    "name_ko": "셸린",
    "name_en": "Shelyn",
    "weapon": "glaive",
    "skill": "crafting",
    "sanctification": [
      "holy"
    ],
    "domains": [
      "creation",
      "family",
      "passion",
      "protection"
    ],
    "title": "영원한 장미",
    "desc": "평화와 사랑을 촉진하며, 때로 어두운 세계에서 아름다움을 창조하도록 추종자들을 격려합니다. 언젠가 타락한 오빠 존쿠손을 구원하려 합니다.<br><b>관심 영역:</b> 예술, 아름다움, 사랑, 음악<br><b>계율:</b> 평화롭게 지내라, 예술을 선택하고 완성하라, 모든 것에서 아름다움을 봐라"
  },
  {
    "id": "torag",
    "name_ko": "토라그",
    "name_en": "Torag",
    "weapon": "warhammer",
    "skill": "crafting",
    "sanctification": [
      "holy"
    ],
    "domains": [
      "creation",
      "earth",
      "family",
      "protection"
    ],
    "title": "창조의 아버지",
    "desc": "많은 드워프에게 창조의 아버지로 존경받으며, 숭배되는 모든 공동체를 보호하기 위해 노력합니다. 제작과 창조를 소중히 여기는 이들도 따릅니다.<br><b>관심 영역:</b> 대장간, 보호, 전략<br><b>계율:</b> 명예롭고 솔직하라, 약속을 지켜라, 대장간을 존중하라, 백성을 섬겨라"
  },
  {
    "id": "urgathoa",
    "name_ko": "우르가토아",
    "name_en": "Urgathoa",
    "weapon": "scythe",
    "skill": "intimidation",
    "sanctification": [
      "unholy"
    ],
    "domains": [
      "indulgence",
      "magic",
      "might",
      "undeath"
    ],
    "title": "창백한 공주",
    "desc": "살아있는 세계의 쾌락에 너무 매료된 나머지, 죽음과 사후세계의 속박에서 탈출하여 최초의 언데드가 되었습니다. 쾌락주의적 방식을 공유하고 언데드를 퍼뜨리는 것을 즐깁니다.<br><b>관심 영역:</b> 질병, 탐식, 언데드<br><b>계율:</b> 죽음 시 언데드가 되라, 언데드를 생성하거나 보호하라, 식욕을 충족시켜라"
  },
  {
    "id": "zonkuthon",
    "name_ko": "존-쿠톤",
    "name_en": "Zon-Kuthon",
    "weapon": "scimitar",
    "skill": "intimidation",
    "sanctification": [
      "unholy"
    ],
    "domains": [
      "darkness",
      "destruction",
      "pain",
      "void"
    ],
    "title": "밤의 왕자",
    "desc": "한때 셸린의 오빠였으나 먼 차원에서 돌아온 후 끔찍하게 변형되었습니다. 어둠, 상실, 고통 속에서 즐거움을 찾으며, 추종자들에게도 같은 것을 권합니다.<br><b>관심 영역:</b> 어둠, 상실, 고통<br><b>계율:</b> 고통을 가져오라, 어둠에 자신을 빠뜨려라"
  }
];

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
    "initial": "protector-sacrifice",
    "advanced": "protector-sphere"
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
