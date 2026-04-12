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
    {lv:1, name_ko:'오컬트 주문시전', name_en:'Occult Spellcasting', desc:'오컬트 전통의 주문을 자발적으로 시전합니다. 핵심 능력치는 매력이며, 주문 목록(레퍼토리)에서 주문을 선택하여 시전합니다. 1레벨에 1랭크 주문 2개와 오컬트 캔트립 5개를 배웁니다.'},
    {lv:1, name_ko:'작곡 주문', name_en:'Composition Spells', desc:'공연에 마법을 불어넣어 작곡(Composition)이라는 독특한 효과를 만듭니다. 작곡 주문은 집중 주문의 일종으로, 1 집중 포인트를 소모하며 시전 시 공연 기술을 사용합니다. <strong>용기의 찬가</strong> 작곡 캔트립을 습득합니다.'},
    {lv:3, name_ko:'번개 반사', name_en:'Lightning Reflexes', desc:'반사신경이 번개처럼 빨라 위험을 피합니다. 반사 내성 숙련도가 전문가로 증가합니다.'},
    {lv:3, name_ko:'시그니처 주문', name_en:'Signature Spells', desc:'특정 주문을 더 자유롭게 시전할 수 있습니다. 각 랭크마다 하나의 시그니처 주문을 지정하며, 해당 주문을 자동으로 고양하여 더 높은 랭크의 주문 슬롯으로 시전할 수 있습니다.'},
    {lv:7, name_ko:'전문가 주문시전자', name_en:'Expert Spellcaster', desc:'주문 시전 능력이 한 단계 더 발전했습니다. 주문 명중과 주문 DC의 숙련도가 전문가로 증가합니다.'},
    {lv:9, name_ko:'큰 결의', name_en:'Resolve', desc:'정신이 너무 복잡하고 정교해서 함부로 건드릴 수 없습니다. 의지 내성 숙련도가 달인으로 증가합니다. 의지 내성에서 성공 시 대성공으로 처리됩니다.'},
    {lv:11, name_ko:'경각 감각', name_en:'Vigilant Senses', desc:'더 높은 경각심과 주의력을 개발했습니다. 지각 숙련도가 달인으로 증가합니다.'},
    {lv:11, name_ko:'무기 전문화', name_en:'Weapon Specialization', desc:'가장 익숙한 무기로 더 큰 부상을 입힙니다. 전문가 숙련도 무기에 +2, 달인 +3, 전설 +4 추가 피해를 가합니다.'},
    {lv:13, name_ko:'경갑 전문화', name_en:'Light Armor Expertise', desc:'경갑 착용 시 회피 능력이 향상됩니다. 경갑과 비무장 방어의 숙련도가 전문가로 증가합니다.'},
    {lv:15, name_ko:'달인 주문시전자', name_en:'Master Spellcaster', desc:'주문 시전에 대한 달인급 숙달을 달성했습니다. 주문 명중과 주문 DC의 숙련도가 달인으로 증가합니다.'},
    {lv:19, name_ko:'전설 주문시전자', name_en:'Legendary Spellcaster', desc:'마법의 완벽한 숙달을 이루었습니다. 주문 명중과 주문 DC의 숙련도가 전설로 증가합니다.'},
    {lv:19, name_ko:'마기스터리 주문', name_en:'Magistry Spells', desc:'주문시전의 최고 경지에 도달합니다. 일반 오컬트 10랭크 주문 2개를 레퍼토리에 추가하고, 10랭크 주문 슬롯 1개를 얻습니다.'},
  ],
  cleric: [
    {lv:1, name_ko:'신성 주문시전', name_en:'Divine Spellcasting', desc:'신성 전통의 주문을 준비하여 시전합니다. 핵심 능력치는 지혜이며, 매일 아침 신성 주문 목록에서 주문을 준비합니다. 1레벨에 1랭크 주문 2개와 신성 캔트립 5개를 준비할 수 있습니다.'},
    {lv:1, name_ko:'신성 원천', name_en:'Divine Font', desc:'신의 축복을 통해 활력 또는 공허의 힘을 전달하는 추가 주문을 얻습니다. <strong>치유 원천:</strong> 최고 랭크 추가 슬롯에 <em>heal</em> 주문만 준비 가능. <strong>해악 원천:</strong> 최고 랭크 추가 슬롯에 <em>harm</em> 주문만 준비 가능. 추가 슬롯은 1레벨 4개, 5레벨 5개, 15레벨 6개입니다.'},
    {lv:3, name_ko:'2차 교의', name_en:'Second Doctrine', desc:'2차 교의의 혜택을 얻습니다. <strong>은둔:</strong> 인내 내성 숙련도가 전문가로 증가합니다. <strong>전쟁사제:</strong> 군용 무기에 훈련됩니다.'},
    {lv:5, name_ko:'지각 전문가', name_en:'Alertness', desc:'주변에 항상 경계합니다. 지각 숙련도가 전문가로 증가합니다.'},
    {lv:7, name_ko:'3차 교의', name_en:'Third Doctrine', desc:'3차 교의의 혜택을 얻습니다. <strong>은둔:</strong> 주문 명중과 DC 숙련도가 전문가로 증가합니다. <strong>전쟁사제:</strong> 신의 총애 무기, 단순 무기, 비무장 공격 숙련도가 전문가로 증가합니다.'},
    {lv:9, name_ko:'확고한 신앙', name_en:'Steadfast Faith', desc:'확고한 믿음이 사악한 생각을 막아줍니다. 의지 내성 숙련도가 달인으로 증가합니다. 의지 내성에서 성공 시 대성공으로 처리합니다.'},
    {lv:11, name_ko:'4차 교의', name_en:'Fourth Doctrine', desc:'4차 교의의 혜택을 얻습니다. <strong>은둔/전쟁사제:</strong> 주문 명중과 DC 숙련도가 전문가로 증가합니다.'},
    {lv:13, name_ko:'신성 방어', name_en:'Divine Defense', desc:'비갑 방어 숙련도가 전문가로 증가합니다.'},
    {lv:13, name_ko:'무기 전문화', name_en:'Weapon Specialization', desc:'가장 익숙한 무기로 더 큰 부상을 입힙니다. 전문가 숙련도 무기에 +2, 달인 +3, 전설 +4 추가 피해를 가합니다.'},
    {lv:15, name_ko:'5차 교의', name_en:'Fifth Doctrine', desc:'5차 교의의 혜택을 얻습니다. <strong>은둔:</strong> 인내 내성 숙련도가 달인으로, 성공 시 대성공으로 처리합니다. <strong>전쟁사제:</strong> 인내 내성 숙련도가 달인으로 증가합니다.'},
    {lv:17, name_ko:'6차 교의', name_en:'Sixth Doctrine', desc:'6차 교의의 혜택을 얻습니다 (17레벨). 은둔/전쟁사제 모두 주문 명중과 DC 숙련도가 달인으로 증가합니다.'},
    {lv:19, name_ko:'최종 교의', name_en:'Final Doctrine', desc:'최종 교의의 혜택을 얻습니다 (19레벨). <strong>은둔:</strong> 주문 명중과 DC 숙련도가 전설로 증가합니다. <strong>전쟁사제:</strong> 신의 총애 무기, 주문 명중, DC가 달인으로 증가합니다.'},
    {lv:19, name_ko:'기적의 주문', name_en:'Miraculous Spells', desc:'신의 힘에 의해 진정으로 기적적인 주문을 시전합니다. 10랭크 주문 슬롯 1개를 얻어 신성 주문시전으로 준비할 수 있습니다.'},
  ],
  druid: [
    {lv:1, name_ko:'원시 주문시전', name_en:'Primal Spellcasting', desc:'원시 전통의 주문을 준비하여 시전합니다. 핵심 능력치는 지혜이며, 매일 아침 원시 주문 목록에서 주문을 준비합니다. 1레벨에 1랭크 주문 2개와 원시 캔트립 5개를 준비할 수 있습니다.'},
    {lv:1, name_ko:'드루이드 결사', name_en:'Druidic Order', desc:'드루이드 결사에 가입하여 결사 주문, 추가 훈련 기술, 1레벨 드루이드 재주를 얻습니다. 결사 주문은 1 집중 포인트를 소모하는 집중 주문입니다. 동물, 불꽃, 잎, 폭풍, 파도, 야생, 길들여지지 않음 중 선택합니다.'},
    {lv:1, name_ko:'방패 막기', name_en:'Shield Block', type:'feat', desc:'방패 막기 일반 재주를 얻습니다. 방패를 사용하여 피해를 경감하는 반응 행동입니다.'},
    {lv:1, name_ko:'자연의 목소리', name_en:'Voice of Nature', desc:'동물 공감 또는 식물 공감 드루이드 재주 중 하나를 선택하여 얻습니다.'},
    {lv:1, name_ko:'야생노래', name_en:'Wildsong', desc:'야생노래를 알게 됩니다. 드루이드 결사 내에서만 알려진 비밀 언어로, 선율적이고 음조적인 언어이며 동물 울음소리처럼 들립니다.'},
    {lv:3, name_ko:'지각 전문가', name_en:'Alertness', desc:'주변에 항상 경계합니다. 지각 숙련도가 전문가로 증가합니다.'},
    {lv:3, name_ko:'인내 전문가', name_en:'Great Fortitude', desc:'인내 내성 숙련도가 전문가로 증가합니다.'},
    {lv:5, name_ko:'반사 전문가', name_en:'Lightning Reflexes', desc:'반사신경이 번개처럼 빨라 위험을 피합니다. 반사 내성 숙련도가 전문가로 증가합니다.'},
    {lv:7, name_ko:'전문가 주문시전자', name_en:'Expert Spellcaster', desc:'주문 시전 능력이 한 단계 더 발전했습니다. 주문 명중과 주문 DC의 숙련도가 전문가로 증가합니다.'},
    {lv:11, name_ko:'무기 전문가', name_en:'Druid Weapon Expertise', desc:'전투 실력이 향상됩니다. 단순 무기와 비무장 공격의 숙련도가 전문가로 증가합니다.'},
    {lv:11, name_ko:'야생 의지력', name_en:'Wild Resolve', desc:'야생의 의지력은 길들일 수 없습니다. 의지 내성 숙련도가 달인으로 증가합니다. 의지 내성에서 성공 시 대성공으로 처리합니다.'},
    {lv:13, name_ko:'평갑 전문가', name_en:'Medium Armor Expertise', desc:'평갑과 경갑 활용 능력이 향상되어 타격을 더 잘 피합니다. 경갑, 평갑, 비무장 방어의 숙련도가 전문가로 증가합니다.'},
    {lv:13, name_ko:'무기 전문화', name_en:'Weapon Specialization', desc:'가장 익숙한 무기로 더 큰 부상을 입힙니다. 전문가 숙련도 무기에 +2, 달인 +3, 전설 +4 추가 피해를 가합니다.'},
    {lv:15, name_ko:'달인 주문시전자', name_en:'Master Spellcaster', desc:'주문 시전에 대한 달인급 숙달을 달성했습니다. 주문 명중과 주문 DC의 숙련도가 달인으로 증가합니다.'},
    {lv:19, name_ko:'전설 주문시전자', name_en:'Legendary Spellcaster', desc:'마법의 완벽한 숙달을 이루었습니다. 주문 명중과 주문 DC의 숙련도가 전설로 증가합니다.'},
    {lv:19, name_ko:'원시 대사제', name_en:'Primal Hierophant', desc:'원시 마법의 가장 강력한 힘을 지휘합니다. 10랭크 주문 슬롯 1개를 얻어 원시 주문을 준비할 수 있습니다.'},
  ],
  fighter: [
    {lv:1, name_ko:'반격 타격', name_en:'Reactive Strike', desc:'약점을 노려 빈틈을 보이는 적을 재빨리 공격합니다. 사거리 내 적이 조작 행동, 이동 행동, 원거리 공격을 하거나 이동 행동 중 사각을 벗어날 때 반응으로 근접 타격을 가합니다.'},
    {lv:1, name_ko:'방패 막기', name_en:'Shield Block', type:'feat', desc:'방패 막기 일반 재주를 얻습니다. 방패를 사용하여 피해를 경감하는 반응 행동입니다.'},
    {lv:3, name_ko:'용기', name_en:'Bravery', desc:'수많은 적과 전투의 혼란을 겪으며 두려움 앞에서도 강하게 서는 법을 배웠습니다. 의지 내성 숙련도가 전문가로 증가합니다. 의지 내성에서 공포 효과에 대해 성공 시 대성공으로 처리하며, 겁먹음 상태값을 1 감소시킵니다.'},
    {lv:5, name_ko:'파이터 무기 달인', name_en:'Fighter Weapon Mastery', desc:'선호하는 무기군과의 훈련을 오래 쌓았습니다. 무기군 하나를 선택하여 단순, 군용, 비무장 공격의 숙련도가 달인으로, 해당 군의 고급 무기는 전문가로 증가합니다. 치명 특수화 효과에 접근합니다.'},
    {lv:7, name_ko:'전장 측량', name_en:'Battlefield Surveyor', desc:'군대의 후방이든 단순히 서서 주변을 관찰하든, 전장을 면밀히 살핍니다. 지각 숙련도가 달인으로 증가합니다. 우선권 판정에 지각 대신 +2 상황 보너스를 받습니다.'},
    {lv:7, name_ko:'무기 전문화', name_en:'Weapon Specialization', desc:'가장 익숙한 무기로 더 큰 부상을 입힙니다. 전문가 숙련도 무기에 +2, 달인 +3, 전설 +4 추가 피해를 가합니다.'},
    {lv:9, name_ko:'전투 유연성', name_en:'Combat Flexibility', desc:'매일 전투 전술을 준비할 수 있습니다. 매일 준비 시 선행조건을 충족하는 8레벨 이하 파이터 재주 1개를 선택하여 그날 사용할 수 있습니다.'},
    {lv:9, name_ko:'전투 단련', name_en:'Juggernaut', desc:'인내 내성 숙련도가 달인으로 증가합니다. 인내 내성에서 성공 시 대성공으로 처리합니다.'},
    {lv:11, name_ko:'갑옷 전문가', name_en:'Armor Expertise', desc:'갑옷 착용에 많은 시간을 투자하여 최대한 보호받는 법을 배웠습니다. 경갑, 중갑, 중갑, 비갑 방어 숙련도가 전문가로 증가합니다.'},
    {lv:11, name_ko:'파이터 전문가', name_en:'Fighter Expertise', desc:'숙련된 전투 기술이 더욱 강력해집니다. 파이터 클래스 DC 숙련도가 전문가로 증가합니다.'},
    {lv:13, name_ko:'무기 전설', name_en:'Weapon Legend', desc:'모든 무기에 대한 비할 데 없는 기술을 개발했습니다. 단순 무기, 군용 무기, 비무장 공격의 숙련도가 달인으로, 파이터 무기 달인으로 선택한 무기군과 고급 무기의 숙련도가 전설로 증가합니다. 파이터 클래스 DC도 달인으로 증가합니다.'},
    {lv:15, name_ko:'번뜩이는 반사', name_en:'Evasion', desc:'반사 내성 숙련도가 달인으로 증가합니다. 반사 내성에서 성공 시 대성공으로 처리됩니다.'},
    {lv:15, name_ko:'상위 무기 전문화', name_en:'Greater Weapon Specialization', desc:'무기 전문화의 추가 피해가 증가합니다(전문가 +4, 달인 +6, 전설 +8).'},
    {lv:15, name_ko:'향상된 유연성', name_en:'Improved Flexibility', desc:'전투 유연성이 향상되어 매일 준비 시 14레벨 이하 파이터 재주 1개를 추가로 선택할 수 있습니다. 첫 번째 재주는 14레벨 이하까지 가능해집니다.'},
    {lv:17, name_ko:'갑옷 달인', name_en:'Armor Mastery', desc:'갑옷 기술이 더욱 향상됩니다. 경갑, 중갑, 중갑, 비갑 방어의 숙련도가 달인으로 증가합니다.'},
    {lv:19, name_ko:'다재다능한 전설', name_en:'Versatile Legend', desc:'어떤 무기든 비할 데 없는 실력을 발휘합니다. 단순 무기, 군용 무기, 비무장 공격의 숙련도가 전설로, 고급 무기의 숙련도가 달인으로 증가합니다. 파이터 클래스 DC도 달인으로 증가합니다.'},
  ],
  ranger: [
    {lv:1, name_ko:'사냥감 추적', name_en:'Hunt Prey', desc:'1행동(집중)으로 볼 수 있거나 추적 중인 생물 1체를 사냥감으로 지정합니다. 사냥감을 Seek할 때 지각에 +2 환경 보너스, Track할 때 생존에 +2 환경 보너스를 받으며, 두 번째 사거리 증분 내 원거리 공격 불이익을 무시합니다. 다음 일일 준비까지 지속됩니다.'},
    {lv:1, name_ko:'사냥꾼의 기질', name_en:"Hunter's Edge", desc:'숙련된 사냥꾼이자 추적자로서 사냥감 추적 시 추가 이점을 얻는 사냥꾼의 기질을 선택합니다.<br><strong>난타(Flurry):</strong> 사냥감에 대한 다중 명중 페널티가 완화됩니다.<br><strong>기지(Outwit):</strong> 사냥감 AC에 +1 상황 보너스, 기만/위협/은신/지식회상에 +2 상황 보너스.<br><strong>정밀(Precision):</strong> 라운드당 사냥감 첫 명중 시 추가 1d8 정밀 피해(11레벨 2d8, 19레벨 3d8).'},
    {lv:3, name_ko:'의지 전문가', name_en:'Iron Will', desc:'정신적 방어력이 강해집니다. 의지 내성 숙련도가 전문가로 증가합니다.'},
    {lv:5, name_ko:'레인저 무기 전문가', name_en:'Ranger Weapon Expertise', desc:'무기에서 추가 우위를 얻습니다. 군용 무기, 단순 무기, 비무장 공격의 숙련도가 전문가로 증가합니다. 사냥감 공격 시 단순/군용 무기 및 비무장 공격의 치명 전문화 효과를 적용합니다.'},
    {lv:5, name_ko:'흔적 없는 여정', name_en:'Trackless Journey', desc:'자연 지형을 이동할 때 흔적을 남기지 않으며, 추적이 불가능합니다. Cover Tracks 활동의 이점도 자동으로 적용됩니다.'},
    {lv:7, name_ko:'자연 반사', name_en:'Evasion', desc:'반사 내성 숙련도가 달인으로 증가합니다. 반사 내성에서 성공 시 대성공으로 처리됩니다.'},
    {lv:7, name_ko:'지각 달인', name_en:'Perception Master', desc:'고도로 발달한 경각심과 주의력을 갖추었습니다. 지각 숙련도가 달인으로 증가합니다.'},
    {lv:7, name_ko:'무기 전문화', name_en:'Weapon Specialization', desc:'가장 익숙한 무기로 더 큰 부상을 입힙니다. 전문가 숙련도 무기에 +2, 달인 +3, 전설 +4 추가 피해를 가합니다.'},
    {lv:9, name_ko:'자연의 끝', name_en:"Nature's Edge", desc:'적의 약점을 항상 간파합니다. 험지 또는 불리한 지형에 있는 적은 항상 무방비 상태입니다.'},
    {lv:9, name_ko:'레인저 전문가', name_en:'Ranger Expertise', desc:'추적 기술과 사냥 실력이 향상됩니다. 레인저 클래스 DC 숙련도가 전문가로 증가합니다. 관리인 주문이 있다면 주문 명중과 주문 DC도 전문가로 증가합니다.'},
    {lv:11, name_ko:'관리인의 인내', name_en:"Warden's Endurance", desc:'그리즐리의 돌진이나 독의 효과도 거뜬히 견딥니다. 인내 내성 숙련도가 달인으로 증가합니다.'},
    {lv:11, name_ko:'평갑 전문가', name_en:'Medium Armor Expertise', desc:'평갑과 경갑 활용 능력이 향상되어 타격을 더 잘 피합니다. 경갑, 평갑, 비무장 방어의 숙련도가 전문가로 증가합니다.'},
    {lv:11, name_ko:'방해받지 않는 여정', name_en:'Unhindered Journey', desc:'장애물을 빠르게 돌파합니다. 험지, 거친 지형, 넘어진 지형의 효과를 무시할 수 있습니다. 험지를 더 험한 장애 지형으로 취급하지도 않습니다.'},
    {lv:13, name_ko:'군용 무기 달인', name_en:'Weapon Mastery', desc:'무기의 정교함을 완전히 터득했습니다. 단순 무기, 군용 무기, 비무장 공격의 숙련도가 달인으로 증가합니다.'},
    {lv:15, name_ko:'상위 자연 반사', name_en:'Greater Evasion', desc:'반사 내성 숙련도가 전설로 증가합니다. 반사 내성에서 치명적 실패 시 실패로 처리됩니다. 피해를 주는 반사 내성에서 실패해도 피해를 절반으로 줄입니다.'},
    {lv:15, name_ko:'상위 무기 전문화', name_en:'Greater Weapon Specialization', desc:'무기 전문화의 추가 피해가 증가합니다(전문가 +4, 달인 +6, 전설 +8).'},
    {lv:15, name_ko:'지각 전설', name_en:'Incredible Senses', desc:'거의 감지할 수 없는 것까지 알아챕니다. 지각 숙련도가 전설로 증가합니다.'},
    {lv:17, name_ko:'달인 사냥꾼', name_en:'Masterful Hunter', desc:'사냥꾼으로서의 능력이 놀라운 수준에 달합니다. 레인저 클래스 DC가 달인으로 증가합니다. 관리인 주문이 있다면 주문 명중/DC도 달인으로 증가합니다. 달인 숙련도 원거리 무기의 두 번째·세 번째 사거리 증분 불이익을 무시합니다. 사냥꾼의 기질 효과도 강화됩니다.'},
    {lv:19, name_ko:'평갑 달인', name_en:'Medium Armor Mastery', desc:'경갑과 평갑 활용 능력이 최고 수준에 달합니다. 경갑, 평갑, 비무장 방어의 숙련도가 달인으로 증가합니다.'},
    {lv:19, name_ko:'신속 사냥감', name_en:'Swift Prey', desc:'한 눈에 사냥감을 파악합니다. 턴의 첫 행동이라면 사냥감 추적(Hunt Prey)을 자유 행동으로 사용할 수 있습니다.'},
  ],
  rogue: [
    {lv:1, name_ko:'은밀 공격 1d6', name_en:'Sneak Attack 1d6', desc:'적의 방어가 미비하면 유리하게 공격합니다. 무방비 상태의 적에게 민첩 또는 교묘한 무기, 비무장 공격, 원거리 무기로 타격 시 추가 1d6 정밀 피해를 입힙니다. 원거리 공격은 무기도 민첩하거나 교묘해야 합니다.'},
    {lv:1, name_ko:'기습', name_en:'Surprise Attack', desc:'전투보다 빠르게 행동합니다. 첫 라운드에서 기만 또는 은신으로 우선권을 굴린 경우, 아직 행동하지 않은 적은 무방비 상태입니다.'},
    {lv:1, name_ko:'라켓', name_en:'Racket', desc:'로그의 접근법과 기술 분야를 결정하는 라켓을 선택합니다.<br><strong>두뇌파:</strong> 지식회상 성공 시 대상이 무방비.<br><strong>건달:</strong> 모든 무기로 은밀 공격 가능(d8 이하).<br><strong>사기꾼:</strong> 기만(Feint) 성공 시 대상이 무방비.<br><strong>도적:</strong> 도적질에 숙련, 위협과 외교에 숙련.'},
    {lv:3, name_ko:'이점 부정', name_en:'Deny Advantage', desc:'이점을 이용하려는 자들에게 빈틈을 보이지 않습니다. 자신의 레벨 이하 적의 측면 공격이나 은밀 등으로 무방비 상태가 되지 않습니다.'},
    {lv:5, name_ko:'은밀 공격 2d6', name_en:'Sneak Attack 2d6', desc:'은밀 공격의 추가 피해가 2d6으로 증가합니다.'},
    {lv:5, name_ko:'무기 속임수', name_en:'Weapon Tricks', desc:'단순 무기, 군용 무기, 비무장 공격의 숙련도를 얻습니다. 무방비 상태의 적에게 민첩 또는 교묘한 무기로 명중 시 치명 전문화 효과를 적용합니다.'},
    {lv:7, name_ko:'회피 반사', name_en:'Evasion', desc:'반사 내성 숙련도가 달인으로 증가합니다. 반사 내성에서 성공 시 대성공으로 처리됩니다.'},
    {lv:7, name_ko:'경각 감각', name_en:'Vigilant Senses', desc:'더 높은 경각심과 주의력을 개발했습니다. 지각 숙련도가 달인으로 증가합니다.'},
    {lv:7, name_ko:'무기 전문화', name_en:'Weapon Specialization', desc:'가장 익숙한 무기로 더 큰 부상을 입힙니다. 전문가 숙련도 무기에 +2, 달인 +3, 전설 +4 추가 피해를 가합니다.'},
    {lv:9, name_ko:'쇠약 타격', name_en:'Debilitating Strike', desc:'빈틈을 공격할 때 적을 방해하고 해칩니다. 쇠약 타격 자유 행동을 얻습니다. 무방비 상태의 적에게 타격하여 피해를 줄 때, 다음 턴 시작까지 쇠약 효과 적용: 이동속도 -10피트 상태 불이익, 또는 쇠약 1.'},
    {lv:9, name_ko:'로그 회복력', name_en:'Rogue Resilience', desc:'체력이 놀라울 정도로 강인합니다. 인내 내성 숙련도가 전문가로 증가합니다. 인내 내성에서 성공 시 대성공으로 처리됩니다.'},
    {lv:11, name_ko:'은밀 공격 3d6', name_en:'Sneak Attack 3d6', desc:'은밀 공격의 추가 피해가 3d6으로 증가합니다.'},
    {lv:11, name_ko:'로그 전문가', name_en:'Rogue Expertise', desc:'기술이 더욱 저항하기 어려워집니다. 로그 클래스 DC 숙련도가 전문가로 증가합니다.'},
    {lv:13, name_ko:'상위 로그 반사', name_en:'Greater Rogue Reflexes', desc:'반사 내성 숙련도가 전설로 증가합니다. 반사 내성에서 치명적 실패 시 실패로 처리됩니다. 피해를 주는 반사 내성에서 실패해도 피해를 절반으로 줄입니다.'},
    {lv:13, name_ko:'놀라운 감각', name_en:'Incredible Senses', desc:'거의 감지할 수 없는 것까지 알아챕니다. 지각 숙련도가 전설로 증가합니다.'},
    {lv:13, name_ko:'경갑 전문가', name_en:'Light Armor Expertise', desc:'경갑 착용 시 회피 능력이 향상됩니다. 경갑과 비무장 방어의 숙련도가 전문가로 증가합니다.'},
    {lv:13, name_ko:'달인 속임수', name_en:'Master Tricks', desc:'로그의 전투 기술을 완전히 익혔습니다. 모든 단순 무기, 군용 무기, 비무장 공격의 숙련도가 달인으로 증가합니다.'},
    {lv:15, name_ko:'이중 쇠약', name_en:'Double Debilitation', desc:'기회를 놓치지 않는 공격을 합니다. 쇠약 타격 사용 시 쇠약 효과를 1개가 아닌 2개 동시에 적용합니다. 하나를 제거하면 둘 다 제거됩니다.'},
    {lv:17, name_ko:'민첩한 정신', name_en:'Slippery Mind', desc:'정신적 게임과 인지적 트릭으로 정신 조작 효과를 떨쳐냅니다. 의지 내성 숙련도가 달인으로 증가합니다. 의지 내성에서 성공 시 대성공으로 처리됩니다.'},
    {lv:17, name_ko:'은밀 공격 4d6', name_en:'Sneak Attack 4d6', desc:'은밀 공격의 추가 피해가 4d6으로 증가합니다.'},
    {lv:19, name_ko:'경갑 달인', name_en:'Light Armor Mastery', desc:'경갑 활용 능력이 최고 수준에 달합니다. 경갑과 비무장 방어의 숙련도가 달인으로 증가합니다.'},
    {lv:19, name_ko:'달인 타격', name_en:'Master Strike', desc:'한 번의 타격으로 방심한 적을 무력화할 수 있습니다. 로그 클래스 DC 숙련도가 달인으로 증가합니다. 달인 타격(Master Strike) 자유 행동을 얻습니다.'},
  ],
  witch: [
    {lv:1, name_ko:'위치 주문시전', name_en:'Witch Spellcasting', desc:'사역마를 매개로 후원자가 주문 시전 능력을 부여합니다. 후원자의 전통에 따른 주문을 준비하여 시전합니다. 1레벨에서 1랭크 주문 슬롯 2개와 캔트립 5개를 준비할 수 있습니다. 핵심 능력치는 지능이며, 주문 명중과 주문 DC에 지능 수정치를 사용합니다.'},
    {lv:1, name_ko:'사역마', name_en:'Familiar', desc:'후원자가 보낸 신비한 생물인 사역마가 주문을 가르치고 돕습니다. 일반 사역마보다 강력하며, 추가 사역마 능력 2개를 얻습니다(하나는 항상 선택 가능). 6, 12, 18레벨에 추가 능력을 얻습니다. 사역마는 후원자 주문의 저장소이자 원천입니다.'},
    {lv:1, name_ko:'주술', name_en:'Hexes', desc:'후원자의 힘을 빌려 직접적인 마법 개입인 주술(Hex)을 사용합니다. 주술은 집중 주문으로, 1 집중점을 소비합니다. 일일 준비 시 집중점을 회복하며, Refocus(사역마와 교감 10분)로 1점 회복 가능합니다.'},
    {lv:5, name_ko:'마법 인내', name_en:'Magical Fortitude', desc:'마법의 힘이 신체적 회복력을 강화합니다. 인내 내성 숙련도가 전문가로 증가합니다.'},
    {lv:7, name_ko:'전문가 주문시전자', name_en:'Expert Spellcaster', desc:'주문 시전 능력이 한 단계 더 발전했습니다. 주문 명중과 주문 DC의 숙련도가 전문가로 증가합니다.'},
    {lv:9, name_ko:'반사 전문가', name_en:'Lightning Reflexes', desc:'반사신경이 번개처럼 빨라 위험을 피합니다. 반사 내성 숙련도가 전문가로 증가합니다.'},
    {lv:11, name_ko:'지각 전문가', name_en:'Alertness', desc:'주변에 항상 경계합니다. 지각 숙련도가 전문가로 증가합니다.'},
    {lv:11, name_ko:'무기 전문가', name_en:'Witch Weapon Expertise', desc:'오랜 경험을 통해 무기 기술이 향상됩니다. 단순 무기와 비무장 공격의 숙련도가 전문가로 증가합니다.'},
    {lv:13, name_ko:'방어 법의', name_en:'Defensive Robes', desc:'마법과 주문시전, 방어 훈련이 결합되어 공격을 피합니다. 비무장 방어의 숙련도가 전문가로 증가합니다.'},
    {lv:13, name_ko:'무기 전문화', name_en:'Weapon Specialization', desc:'가장 익숙한 무기로 더 큰 부상을 입힙니다. 전문가 숙련도 무기에 +2, 달인 +3, 전설 +4 추가 피해를 가합니다.'},
    {lv:15, name_ko:'달인 주문시전자', name_en:'Master Spellcaster', desc:'주문 시전에 대한 달인급 숙달을 달성했습니다. 주문 명중과 주문 DC의 숙련도가 달인으로 증가합니다.'},
    {lv:17, name_ko:'제자의 의지', name_en:"Apprentice's Resolve", desc:'사역마와의 소통이 정신적 강인함을 길러주었습니다. 의지 내성 숙련도가 달인으로 증가합니다. 의지 내성에서 성공 시 대성공으로 처리됩니다.'},
    {lv:19, name_ko:'전설 주문시전자', name_en:'Legendary Spellcaster', desc:'마법의 완벽한 숙달을 이루었습니다. 주문 명중과 주문 DC의 숙련도가 전설로 증가합니다.'},
    {lv:19, name_ko:'후원자의 선물', name_en:"Patron's Gift", desc:'후원자가 엄청난 마법의 힘을 부여합니다. 단독 10랭크 주문 슬롯 1개를 얻어, 해당 슬롯에 주문을 준비할 수 있습니다.'},
  ],
  wizard: [
    {lv:1, name_ko:'비전 주문시전', name_en:'Arcane Spellcasting', desc:'학술적 엄밀함으로 비전 마법을 구성하여 주문을 시전합니다. 비전 전통의 준비형 주문시전자입니다. 1레벨에서 1랭크 주문 슬롯 2개와 캔트립 5개를 준비하며, 학파 교과과정 캔트립과 교과과정 주문 각 1개를 추가로 준비합니다. 핵심 능력치는 지능입니다.'},
    {lv:1, name_ko:'비전 유대', name_en:'Arcane Bond', desc:'마법의 힘 일부를 유대 아이템에 저장합니다. 매일 주문 준비 시 소유한 아이템 하나를 유대 아이템으로 지정하고, 유대 아이템 소진(Drain Bonded Item) 자유 행동을 얻습니다. 하루 1회 주문 슬롯 소비 없이 준비된 주문 1개를 시전할 수 있습니다.'},
    {lv:1, name_ko:'비전 논제', name_en:'Arcane Thesis', desc:'고유한 마법 연구 논제를 작성하여 특별한 이점을 얻습니다.<br><strong>실험적 주문성형:</strong> 다양한 주문성형 효과에 효율적 접근.<br><strong>향상된 사역마 동조:</strong> 사역마와의 유대 강화, 추가 능력.<br><strong>주문 혼합:</strong> 같은 랭크 주문 슬롯 2개를 상위 보너스 슬롯 1개로 교환.<br><strong>주문 대체:</strong> 준비된 주문 교체 가능.<br><strong>마도구 연결:</strong> 마도구와 학파 교과과정의 시너지.'},
    {lv:1, name_ko:'비전 학파', name_en:'Arcane School', desc:'비전 마법 학파를 선택합니다. 학파에 따라 교과과정의 추가 주문과 주문 슬롯, 학파 주문(집중 주문)을 얻습니다. 문법학파, 전투마법학파, 경계학파, 시민마법학파, 정신학파, 변형학파, 통합이론학파 중 선택합니다.'},
    {lv:5, name_ko:'반사 전문가', name_en:'Lightning Reflexes', desc:'반사신경이 번개처럼 빨라 위험을 피합니다. 반사 내성 숙련도가 전문가로 증가합니다.'},
    {lv:7, name_ko:'전문가 주문시전자', name_en:'Expert Spellcaster', desc:'주문 시전 능력이 한 단계 더 발전했습니다. 주문 명중과 주문 DC의 숙련도가 전문가로 증가합니다.'},
    {lv:9, name_ko:'마법 인내', name_en:'Magical Fortitude', desc:'마법의 힘이 신체적 회복력을 강화합니다. 인내 내성 숙련도가 전문가로 증가합니다.'},
    {lv:11, name_ko:'지각 전문가', name_en:'Alertness', desc:'주변에 항상 경계합니다. 지각 숙련도가 전문가로 증가합니다.'},
    {lv:11, name_ko:'위저드 무기 전문가', name_en:'Wizard Weapon Expertise', desc:'오랜 경험을 통해 무기 기술이 향상됩니다. 단순 무기와 비무장 공격의 숙련도가 전문가로 증가합니다.'},
    {lv:13, name_ko:'방어 법의', name_en:'Defensive Robes', desc:'마법과 주문시전, 방어 훈련이 결합되어 공격을 피합니다. 비무장 방어의 숙련도가 전문가로 증가합니다.'},
    {lv:13, name_ko:'무기 전문화', name_en:'Weapon Specialization', desc:'가장 익숙한 무기로 더 큰 부상을 입힙니다. 전문가 숙련도 무기에 +2, 달인 +3, 전설 +4 추가 피해를 가합니다.'},
    {lv:15, name_ko:'달인 주문시전자', name_en:'Master Spellcaster', desc:'주문 시전에 대한 달인급 숙달을 달성했습니다. 주문 명중과 주문 DC의 숙련도가 달인으로 증가합니다.'},
    {lv:17, name_ko:'놀라운 의지', name_en:'Resolve', desc:'정신이 너무 복잡하고 정교해서 함부로 건드릴 수 없습니다. 의지 내성 숙련도가 달인으로 증가합니다. 의지 내성에서 성공 시 대성공으로 처리됩니다.'},
    {lv:19, name_ko:'전설 주문시전자', name_en:'Legendary Spellcaster', desc:'마법의 완벽한 숙달을 이루었습니다. 주문 명중과 주문 DC의 숙련도가 전설로 증가합니다.'},
    {lv:19, name_ko:'대위저드의 주문학', name_en:"Archwizard's Spellcraft", desc:'가장 강력한 비전 마법을 지휘합니다. 단독 10랭크 주문 슬롯 1개를 얻어, 위저드 주문시전으로 해당 슬롯에 주문을 준비할 수 있습니다.'},
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
  'muse-maestro': [{lv:1, name_ko:'잔향 작곡', name_en:'Lingering Composition', category:'special'}],
  'muse-enigma':  [{lv:1, name_ko:'바드 지식', name_en:'Bardic Lore', category:'special'}],
  'muse-warrior': [{lv:1, name_ko:'무예 공연', name_en:'Martial Performance', category:'special'}],
  'muse-polymath': [{lv:1, name_ko:'다재다능한 공연', name_en:'Versatile Performance', category:'special'}],
  'doctrine-cloistered': [{lv:1, name_ko:'영역 입문', name_en:'Domain Initiate', category:'class'}],
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
  // ── 바드 뮤즈: 뮤즈 주문만 자동 부여 (집중 주문은 재주 선택 시 습득) ──
  'muse-maestro': [{lv:1, type:'known', rank:1, name_ko:'위로', name_en:'Soothe'}],
  'muse-enigma':  [{lv:1, type:'known', rank:1, name_ko:'확실한 타격', name_en:'Sure Strike'}],
  'muse-warrior': [{lv:1, type:'known', rank:1, name_ko:'공포', name_en:'Fear'}],
  'muse-polymath': [{lv:1, type:'known', rank:1, name_ko:'환영 하수인', name_en:'Phantasmal Minion'}],
  // ── 드루이드 교단 (DB 매칭) ──
  'order-flame':  [{lv:1, type:'focus', name_ko:'화염 광선', name_en:'Fire Ray'}],
  'order-leaf':   [{lv:1, type:'focus', name_ko:'선의 씨앗', name_en:'Goodberry'}],
  'order-storm':  [{lv:1, type:'focus', name_ko:'폭풍 군주', name_en:'Tempest Surge'}],
  'order-wave':   [{lv:1, type:'focus', name_ko:'조류 파도', name_en:'Tidal Surge'}],
  'order-wild':   [{lv:1, type:'focus', name_ko:'야생 변신', name_en:'Wild Shape'}],
  // order-animal: DB에 Heal Animal 없음
  // ── 위저드 비전 학파 (Remaster) ──
  'school-ars-grammatica': [{lv:1, type:'focus', name_ko:'보호의 결계', name_en:'Protective Wards'}],
  'school-battle-magic':   [{lv:1, type:'focus', name_ko:'힘의 화살', name_en:'Force Bolt'}],
  'school-boundary':       [{lv:1, type:'focus', name_ko:'소환 강화', name_en:'Fortify Summoning'}],
  'school-civic-wizardry': [{lv:1, type:'focus', name_ko:'대지 공사', name_en:'Earthworks'}],
  'school-mentalism':      [{lv:1, type:'focus', name_ko:'매혹의 밀침', name_en:'Charming Push'}],
  'school-protean-form':   [{lv:1, type:'focus', name_ko:'몸 뒤섞기', name_en:'Scramble Body'}],
  // school-unified: 학파 주문 없음 (통합 이론)
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
  'muse-maestro': [{lv:1, name_ko:'잔향 작곡', name_en:'Lingering Composition'}],
  'muse-warrior': [{lv:1, name_ko:'군용 무기 훈련', name_en:'Martial Weapon Training'}],
  'muse-polymath': [{lv:1, name_ko:'다재다능한 공연', name_en:'Versatile Performance'}],
  // ── 클레릭 교리 ──
  'doctrine-cloistered': [
    {lv:1,  name_ko:'도메인 개시 주문 1개', name_en:'Domain Initiate Spell'},
    {lv:3, name_ko:'전문가 주문시전자', name_en:'Expert Spellcaster', desc:'주문 시전 능력이 한 단계 더 발전했습니다. 주문 명중과 주문 DC의 숙련도가 전문가로 증가합니다.'},
    {lv:15, name_ko:'달인 주문시전자', name_en:'Master Spellcaster', desc:'주문 시전에 대한 달인급 숙달을 달성했습니다. 주문 명중과 주문 DC의 숙련도가 달인으로 증가합니다.'},
    {lv:19, name_ko:'전설 주문시전자', name_en:'Legendary Spellcaster', desc:'마법의 완벽한 숙달을 이루었습니다. 주문 명중과 주문 DC의 숙련도가 전설로 증가합니다.'},
  ],
  'doctrine-warpriest': [
    {lv:1,  name_ko:'군용 무기/평갑 훈련', name_en:'Martial & Medium Armor'},
    {lv:3,  name_ko:'반사 전문가', name_en:'Expert Reflex'},
    {lv:7, name_ko:'전문가 주문시전자', name_en:'Expert Spellcaster', desc:'주문 시전 능력이 한 단계 더 발전했습니다. 주문 명중과 주문 DC의 숙련도가 전문가로 증가합니다.'},
    {lv:15, name_ko:'달인 주문시전자', name_en:'Master Spellcaster', desc:'주문 시전에 대한 달인급 숙달을 달성했습니다. 주문 명중과 주문 DC의 숙련도가 달인으로 증가합니다.'},
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
  // ── 위저드 비전 학파 (Remaster) ──
  'school-ars-grammatica': [{lv:1, name_ko:'학파 주문: 보호의 결계', name_en:'Protective Wards'}],
  'school-battle-magic':   [{lv:1, name_ko:'학파 주문: 힘의 화살', name_en:'Force Bolt'}],
  'school-boundary':       [{lv:1, name_ko:'학파 주문: 소환 강화', name_en:'Fortify Summoning'}],
  'school-civic-wizardry': [{lv:1, name_ko:'학파 주문: 대지 공사', name_en:'Earthworks'}],
  'school-mentalism':      [{lv:1, name_ko:'학파 주문: 매혹의 밀침', name_en:'Charming Push'}],
  'school-protean-form':   [{lv:1, name_ko:'학파 주문: 몸 뒤섞기', name_en:'Scramble Body'}],
  'school-unified':        [{lv:1, name_ko:'통합 이론: 유연한 주문', name_en:'Unified Flexibility'}],
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
  {id:'cayden',     name_ko:'카이든 카일리언',name_en:'Cayden Cailean', weapon:'레이피어',   skill:'athletics', sanctification:['holy'],           domains:['도시','자유','탐닉','힘'],
   title:'우연의 신', desc:'술에 취한 도전으로 필멸의 삶에서 승천했습니다. 자유를 촉진하고 다른 이들이 삶에서 자신만의 길을 찾도록 격려합니다.<br><b>관심 영역:</b> 맥주, 용기, 자유, 와인<br><b>계율:</b> 마셔라, 억압받는 이를 도우라, 영광과 모험을 추구하라'},
  {id:'desna',      name_ko:'데스나',         name_en:'Desna',          weapon:'대거',       skill:'acrobatics', sanctification:['holy'],          domains:['꿈','행운','달','여행'],
   title:'천구의 노래', desc:'하늘에 시선을 두고, 어둠 속 여행자를 인도하고 악몽 속 꿈꾸는 이를 이끌기 위해 하늘에 별을 놓았습니다. 자유와 미스터리를 즐깁니다.<br><b>관심 영역:</b> 꿈, 행운, 별, 여행자<br><b>계율:</b> 동료 여행자를 돕고, 새로운 장소를 탐험하고, 예술과 노래로 자신을 표현하라'},
  {id:'erastil',    name_ko:'에라스틸',       name_en:'Erastil',        weapon:'장궁',       skill:'survival',  sanctification:['holy'],           domains:['대지','가족','자연','부'],
   title:'오래된 사냥꾼', desc:'오래전 뿔 달린 사냥의 신이었지만, 숭배는 농촌 공동체에 집중하는 것으로 진화했습니다. 추종자들의 평화로운 삶만을 바라며, 그 목가적 존재가 위협받을 때만 무기를 들도록 합니다.<br><b>관심 영역:</b> 가족, 농업, 사냥, 무역<br><b>계율:</b> 가정과 가족을 돌보라, 의무를 이행하라, 평화를 유지하라'},
  {id:'gorum',      name_ko:'고룸',           name_en:'Gorum',          weapon:'그레이트소드',skill:'athletics', sanctification:['holy','unholy'],  domains:['자신감','파괴','힘','열정'],
   title:'무쇠의 군주', desc:'전장에서 영광을 구하는 자라면 누구든 기도합니다. 무력을 강조하며, 추종자들에게 궁극적인 숭배 방법으로 전쟁과 전투를 추구하도록 권합니다.<br><b>관심 영역:</b> 전투, 근력, 무기<br><b>계율:</b> 공정한 전투에서 승리하라, 한계를 밀어붙여라, 전투에서 갑옷을 착용하라'},
  {id:'gozreh',     name_ko:'고즈레',         name_en:'Gozreh',         weapon:'삼지창',     skill:'survival',  sanctification:['holy'],           domains:['공기','자연','물','날씨'],
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
  {id:'urgathoa',   name_ko:'우르가토아',     name_en:'Urgathoa',       weapon:'대낫',       skill:'intimidation',sanctification:['unholy'],        domains:['방탕','마법','힘','언데스'],
   title:'창백한 공주', desc:'살아있는 세계의 쾌락에 너무 매료된 나머지, 죽음과 사후세계의 속박에서 탈출하여 최초의 언데드가 되었습니다. 쾌락주의적 방식을 공유하고 언데드를 퍼뜨리는 것을 즐깁니다.<br><b>관심 영역:</b> 질병, 탐식, 언데드<br><b>계율:</b> 죽음 시 언데드가 되라, 언데드를 생성하거나 보호하라, 식욕을 충족시켜라'},
  {id:'zonkuthon',  name_ko:'존-쿠톤',       name_en:'Zon-Kuthon',     weapon:'시미터',     skill:'intimidation',sanctification:['unholy'],        domains:['어둠','파괴','고통','공허'],
   title:'밤의 왕자', desc:'한때 셸린의 오빠였으나 먼 차원에서 돌아온 후 끔찍하게 변형되었습니다. 어둠, 상실, 고통 속에서 즐거움을 찾으며, 추종자들에게도 같은 것을 권합니다.<br><b>관심 영역:</b> 어둠, 상실, 고통<br><b>계율:</b> 고통을 가져오라, 어둠에 자신을 빠뜨려라'},
];

// ═══════════════════════════════════════════════
//  DOMAIN DATABASE — 영역별 초기/고급 집중 주문
// ═══════════════════════════════════════════════

var DOMAIN_DB = {
  air:         {name:'공기',   initial:'밀어내는 돌풍',    advanced:'공기로 분산'},
  ambition:    {name:'야망',   initial:'야심 점화',       advanced:'경쟁심'},
  cities:      {name:'도시',   initial:'군중 속의 얼굴',  advanced:'문명의 맥박'},
  confidence:  {name:'자신감', initial:'자신감의 장막',   advanced:'망상적 자만'},
  creation:    {name:'창조',   initial:'창의적 물감',     advanced:'예술적 장식'},
  darkness:    {name:'어둠',   initial:'어둠의 망토',    advanced:'어둠의 시야'},
  death:       {name:'죽음',   initial:'죽음의 부름',    advanced:'언데드 근절'},
  destruction: {name:'파괴',   initial:'파괴의 울부짖음', advanced:'파괴적 기운'},
  dreams:      {name:'꿈',     initial:'달콤한 꿈',      advanced:'꿈꾸는 자의 부름'},
  earth:       {name:'대지',   initial:'투석',           advanced:'국지 지진'},
  family:      {name:'가족',   initial:'달래는 말',       advanced:'가족 회복'},
  fate:        {name:'운명',   initial:'운명 읽기',      advanced:'운명 시험'},
  fire:        {name:'화염',   initial:'화염 광선',       advanced:'화염 장벽'},
  freedom:     {name:'자유',   initial:'방해 없는 보폭', advanced:'자유의 말씀'},
  healing:     {name:'치유',   initial:'치유사의 축복',   advanced:'죽음의 거부'},
  indulgence:  {name:'탐닉',   initial:'방종의 풍요',     advanced:'경과 관찰'},
  knowledge:   {name:'지식',   initial:'지식의 회상',     advanced:'적 파악'},
  luck:        {name:'행운',   initial:'행운의 한 조각',  advanced:'행운의 기회'},
  magic:       {name:'마법',   initial:'마법의 그릇',     advanced:'신비의 등대'},
  might:       {name:'힘',     initial:'운동 돌진',      advanced:'지속하는 힘'},
  moon:        {name:'달',     initial:'달빛',           advanced:'달의 접촉'},
  nature:      {name:'자연',   initial:'활기찬 가시',    advanced:'자연의 선물'},
  nightmares:  {name:'악몽',   initial:'깨어난 악몽',    advanced:'공유된 악몽'},
  pain:        {name:'고통',   initial:'고통 음미',       advanced:'보복의 고통'},
  passion:     {name:'열정',   initial:'매혹의 손길',    advanced:'열정의 유혹'},
  perfection:  {name:'완벽',   initial:'완벽한 정신',     advanced:'완벽한 몸'},
  protection:  {name:'보호',   initial:'보호의 수호',     advanced:'에너지 흡수'},
  secrecy:     {name:'비밀',   initial:'속삭이는 고요',   advanced:'비밀 수호'},
  soul:        {name:'영혼'},
  sun:         {name:'태양',   initial:'눈부신 섬광',     advanced:'활력의 빛'},
  travel:      {name:'여행',   initial:'민첩한 발',      advanced:'여행자의 통과'},
  trickery:    {name:'속임수', initial:'돌발 전환',      advanced:'속임수꾼의 분신'},
  truth:       {name:'진실',   initial:'진실의 말씀',     advanced:'진실의 일별'},
  tyranny:     {name:'폭정',   initial:'복종의 접촉',    advanced:'명령의 채찍'},
  undeath:     {name:'언데스', initial:'언데드의 접촉',   advanced:'악성 자양분'},
  void:        {name:'공허',   initial:'몸 뒤섞기'},
  water:       {name:'물',     initial:'조류 파도',       advanced:'폭포'},
  wealth:      {name:'부',     advanced:'귀금속'},
  zeal:        {name:'열의',   initial:'무기 강화',       advanced:'전투 열정'},
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
