// ═══════════════════════════════════════════════
//  FEAT EFFECTS ENGINE — 재주 자동화 시스템
//  recalcAll() 시 applyFeatEffects()로 모든 재주 효과 집계
//  state._fb 에 결과 저장 → 각 계산 함수에서 참조
// ═══════════════════════════════════════════════

// ── 효과 유형 ──
// hp_bonus:       최대 HP 추가 (value: 숫자 또는 'level')
// speed_bonus:    이동 속도 추가 (value: 피트)
// speed_extra:    추가 이동 속도 (key: 'climb'|'swim'|'fly'|'burrow', value: 피트)
// skill_trained:  기술 숙련 (skill: '$choice' 또는 기술 id)
// skill_bonus:    기술 보너스 (skill: id, value: 숫자, bonus_type)
// save_bonus:     내성 보너스 (save: 'fort'|'ref'|'will'|'all', value, bonus_type, condition)
// ac_bonus:       AC 보너스 (value, bonus_type, condition)
// initiative_bonus: 이니셔티브 보너스 (value, bonus_type)
// bulk_bonus:     벌크 한계 추가 (value)
// dying_threshold: 빈사 임계값 변경 (value)
// recovery_dc:    회복 DC 수정 (value: 음수=감소)
// resistance:     저항 (damage_type, value: 숫자 또는 'half_level')
// grant_action:   행동 해금 (action: ACTION_DB id)
// damage_note:    피해 표시 (text 또는 scaling)
// display_note:   자유 메모 ($choice_name 치환)
// cantrip_slots:  캔트립 슬롯 추가 (value)
// spell_slots:    주문 슬롯 추가 (rank, value)
// familiar_abilities: 사역마 능력 수 (value)
// proficiency:    숙련도 설정 (target, rank) — weapon-martial 등

// ── 선택 유형 ──
// choice.type: 'skill' | 'skill_trained' | 'lore' | 'terrain' | 'resistance' | 'weapon' | 'custom'
// choice.label: 모달 제목
// choice.options: 커스텀 선택지 배열 [{id, name}]
// choice.filter: { min_rank, exclude_trained, attr }
// choice.repeatable: true면 같은 재주 여러번 선택 가능

const FEAT_EFFECTS = {

  // ═══════════════════════════════════════
  //  일반 재주 (General Feats)
  // ═══════════════════════════════════════

  'Toughness': {
    effects: [
      {type:'hp_bonus', value:'level'},
    ]
  },
  'Fleet': {
    effects: [
      {type:'speed_bonus', value:5},
    ]
  },
  'Incredible Initiative': {
    effects: [
      {type:'initiative_bonus', value:2, bonus_type:'circumstance'},
    ]
  },
  'Diehard': {
    effects: [
      {type:'dying_threshold', value:5},
    ]
  },
  'Shield Block': {
    effects: [
      {type:'grant_action', action:'shield-block'},
    ]
  },
  'Armor Proficiency': {
    // 경갑 미숙련→숙련, 이미 경갑 숙련이면 평갑 숙련
    effects: [
      {type:'armor_upgrade', from:'light'},
    ]
  },
  'Weapon Proficiency': {
    choice: {
      type:'custom', label:'무기 그룹을 선택하세요',
      options:[
        {id:'weapon-martial', name:'군용 무기 1그룹 숙련'},
        {id:'weapon-simple', name:'단순 무기 숙련 (미숙련→숙련)'},
      ]
    },
    effects: [
      {type:'display_note', text:'무기 숙련: $choice_name'},
    ]
  },
  'Ride': {
    effects: [
      {type:'display_note', text:'탈것 명령 시 이동 행동 자동 성공'},
    ]
  },
  'Adopted Ancestry': {
    choice: {
      type:'custom', label:'입양된 혈통을 선택하세요',
      options:[
        {id:'dwarf', name:'드워프'}, {id:'elf', name:'엘프'}, {id:'gnome', name:'노움'},
        {id:'goblin', name:'고블린'}, {id:'halfling', name:'하플링'}, {id:'human', name:'인간'},
        {id:'leshy', name:'레쉬'}, {id:'orc', name:'오크'},
      ]
    },
    effects: [
      {type:'display_note', text:'입양 혈통: $choice_name — 해당 혈통 재주 선택 가능'},
    ]
  },
  'Breath Control': {
    effects: [
      {type:'display_note', text:'숨 참기 시간 25배. 질식/흡입 효과에 대한 내성 +1 상황 보너스, 성공→대성공'},
    ]
  },
  'Canny Acumen': {
    choice: {
      type:'custom', label:'전문가로 올릴 내성/지각을 선택하세요',
      options:[
        {id:'fort', name:'인내 (Fortitude)'}, {id:'ref', name:'반사 (Reflex)'},
        {id:'will', name:'의지 (Will)'}, {id:'perc', name:'지각 (Perception)'},
      ]
    },
    effects: [
      {type:'display_note', text:'영리한 직관: $choice_name → 17레벨에 전문가→달인'},
    ]
  },
  'Feather Step': {
    effects: [
      {type:'display_note', text:'비틀거림(Step) 시 험한 지형 무시'},
    ]
  },
  'Incredible Investiture': {
    effects: [
      {type:'display_note', text:'마법 아이템 투자 한도 10→12개'},
    ]
  },
  'Prescient Planner': {
    effects: [
      {type:'display_note', text:'배낭에서 2gp 이하 일반 비소모품을 꺼낼 수 있음 (하루 1회)'},
    ]
  },
  'Prescient Consumable': {
    effects: [
      {type:'display_note', text:'선견 계획자로 소모품(레벨/2 이하)도 꺼낼 수 있음'},
    ]
  },
  'Untrained Improvisation': {
    effects: [
      {type:'display_note', text:'미숙련 기술 판정에 레벨 절반 보너스. 7레벨부터 레벨 전체'},
    ]
  },
  'Fast Recovery': {
    effects: [
      {type:'display_note', text:'휴식 시 HP 회복 2배 (CON×2×레벨). 쇠약/파멸 회복량 +1'},
    ]
  },
  'Pet': {
    effects: [
      {type:'display_note', text:'반려동물 1마리 획득 (사역마 능력 없는 소형 동물)'},
    ]
  },
  'Recognize Spell': {
    effects: [
      {type:'display_note', text:'[반응] 주문 시전 목격 시 주문 식별. 2랭크 이하 일반 주문 자동 식별'},
    ]
  },

  // ═══════════════════════════════════════
  //  기술 재주 (Skill Feats)
  // ═══════════════════════════════════════

  'Assurance': {
    choice: {
      type:'skill', label:'확인을 적용할 기술을 선택하세요',
      filter:{min_rank:2}, repeatable:true,
    },
    effects: [
      {type:'display_note', text:'확인($choice_name): 굴림 대신 10 + 숙련 보너스 사용'},
    ]
  },
  'Skill Training': {
    choice: {
      type:'skill', label:'숙련시킬 기술을 선택하세요',
      filter:{exclude_trained:true}, repeatable:true,
    },
    effects: [
      {type:'skill_trained', skill:'$choice'},
    ]
  },
  'Terrain Expertise': {
    choice: {
      type:'custom', label:'전문 지형을 선택하세요', repeatable:true,
      options:[
        {id:'aquatic', name:'수중'}, {id:'arctic', name:'극지'}, {id:'desert', name:'사막'},
        {id:'forest', name:'숲'}, {id:'mountain', name:'산'}, {id:'plains', name:'평원'},
        {id:'sky', name:'하늘'}, {id:'swamp', name:'늪'}, {id:'underground', name:'지하'},
      ]
    },
    effects: [
      {type:'display_note', text:'지형 전문가($choice_name): 해당 지형에서 생존 +1 상황 보너스'},
    ]
  },
  'Hefty Hauler': {
    effects: [{type:'bulk_bonus', value:2}]
  },
  'Bargain Hunter': {
    effects: [{type:'display_note', text:'외교로 수입 획득 가능. 1레벨 시작 시 추가 2gp'}]
  },
  'Train Animal': {
    effects: [{type:'display_note', text:'다운타임으로 동물에게 행동 훈련 가능'}]
  },
  'Battle Medicine': {
    effects: [{type:'grant_action', action:'battle-medicine'}, {type:'display_note', text:'[1행동] 전투 중 부상 치료. 1일 1회/대상. 숙련 2d8, 전문가 2d8+10, 달인 4d8+30, 전설 4d8+50'}]
  },
  'Natural Medicine': {
    effects: [{type:'display_note', text:'자연학으로 부상 치료(Treat Wounds) 가능'}]
  },
  'Charming Liar': {
    effects: [{type:'display_note', text:'거짓말 대성공 시 대상이 1분간 우호적'}]
  },
  'Lengthy Diversion': {
    effects: [{type:'display_note', text:'주의 분산 효과가 1분 지속 (적의 행동 전까지)'}]
  },
  'Lie to Me': {
    effects: [{type:'display_note', text:'기만으로 거짓말 감지 가능 (지각 대신)'}]
  },
  'Confabulator': {
    effects: [{type:'display_note', text:'거짓말 대실패가 실패로. 같은 거짓말 반복 시 상황 페널티 무시'}]
  },
  'Quick Disguise': {
    effects: [{type:'display_note', text:'변장 시간 대폭 단축. 숙련=1분, 달인=3행동'}]
  },
  'Slippery Secrets': {
    effects: [{type:'display_note', text:'거짓말 감지/판독 불가 효과에 대한 의지 내성 +1 상황 보너스'}]
  },
  'Bon Mot': {
    effects: [{type:'grant_action', action:'bon-mot'}, {type:'display_note', text:'[1행동] 외교로 적의 지각/의지에 -2~-3 상태 페널티 (1분)'}]
  },
  'Group Impression': {
    effects: [{type:'display_note', text:'인상 만들기를 최대 4명에게 동시 사용 가능'}]
  },
  'Hobnobber': {
    effects: [{type:'display_note', text:'정보 수집 시간 절반 (30분). 대실패=실패'}]
  },
  'Glad-Hand': {
    effects: [{type:'display_note', text:'인상 만들기 즉시 사용 가능 (요청과 결합, -5 페널티)'}]
  },
  'Shameless Request': {
    effects: [{type:'display_note', text:'뻔뻔한 요청 시 페널티 감소. 대실패=실패'}]
  },
  'Legendary Negotiation': {
    effects: [{type:'display_note', text:'적과 일시 휴전 협상 가능 (전설)'}]
  },
  'Intimidating Glare': {
    effects: [{type:'display_note', text:'사기 꺾기를 비언어(시각)로 사용 가능. 언어 미통 페널티 무시'}]
  },
  'Intimidating Prowess': {
    effects: [{type:'display_note', text:'사기 꺾기에 상황 보너스 +1 (전문가 +2). 요건: 근력 16'}]
  },
  'Scare to Death': {
    effects: [{type:'display_note', text:'[1행동] 위협으로 살해 시도. 의지 DC 판정, 대실패=사망. 전설 전용'}]
  },
  'Coercion': {
    effects: [{type:'display_note', text:'강요 시간 단축 (전문가=3라운드, 달인=1라운드, 전설=1행동)'}]
  },
  'Battle Cry': {
    effects: [{type:'display_note', text:'전투 시작 시 자유 행동으로 사기 꺾기. 달인=주도권 굴림 후 즉시'}]
  },
  'Cat Fall': {
    effects: [{type:'display_note', text:'낙하 피해 감소. 숙련=10피트, 전문가=25피트, 달인=50피트 무시. 전설=추락 면역'}]
  },
  'Quick Jump': {
    effects: [{type:'display_note', text:'높이뛰기/넓이뛰기를 1행동으로 사용 가능 (보폭 없이)'}]
  },
  'Steady Balance': {
    effects: [{type:'display_note', text:'균형 잡기 판정 성공→대성공. 방어불가 상태 아님. 험지에서 보폭 가능'}]
  },
  'Nimble Crawl': {
    effects: [{type:'display_note', text:'엎드린 채 이동 시 5피트→절반 속도. 전설=전체 속도'}]
  },
  'Kip Up': {
    effects: [{type:'display_note', text:'자유 행동으로 넘어짐 해제. 반응 유발 안 함'}]
  },
  'Pickpocket': {
    effects: [{type:'display_note', text:'소매치기를 주의 분산 없이 시도 가능. 전문가=관찰 중에도 시도'}]
  },
  'Subtle Theft': {
    effects: [{type:'display_note', text:'소매치기/손재주 시 감지 DC에 상황 페널티 부여. 인지 안 됨'}]
  },
  'Wary Disarmament': {
    effects: [{type:'display_note', text:'함정 해제 대실패 시 +2 상황 보너스로 반사 내성'}]
  },
  'Quick Repair': {
    effects: [{type:'display_note', text:'수리 시간 10분→1분. 달인=3행동'}]
  },
  'Specialty Crafting': {
    choice: {
      type:'custom', label:'전문 제작 분야를 선택하세요',
      options:[
        {id:'alchemy', name:'연금술'}, {id:'armor', name:'갑옷'}, {id:'weapon', name:'무기'},
        {id:'jewelry', name:'보석'}, {id:'clothing', name:'의복'}, {id:'woodwork', name:'목공'},
        {id:'stonemasonry', name:'석공'}, {id:'tailoring', name:'재단'},
      ]
    },
    effects: [{type:'display_note', text:'전문 제작($choice_name): 해당 분야 제작에 +1 상황 보너스, 전문가=+2'}]
  },
  'Alchemical Crafting': {
    effects: [{type:'display_note', text:'연금술 아이템 제조 공식 습득. 일일 준비 시 연금술 시약 제작 가능'}]
  },
  'Magical Crafting': {
    effects: [{type:'display_note', text:'마법 아이템 제작 가능'}]
  },
  'Impeccable Crafting': {
    effects: [{type:'display_note', text:'전문 제작 분야에서 제작 성공→대성공'}]
  },
  'Snare Crafting': {
    effects: [{type:'display_note', text:'간단한 덫 4종 제조법 습득. 덫 제작 가능'}]
  },
  'Experienced Professional': {
    effects: [{type:'display_note', text:'지식으로 수입 획득 시 실패해도 최소 1sp. 대성공 확률 증가'}]
  },
  'Dubious Knowledge': {
    effects: [{type:'display_note', text:'지식 회상 실패 시 정확 1개 + 오류 1개 정보 획득 (완전 실패 방지)'}]
  },
  'Quick Identification': {
    effects: [{type:'display_note', text:'마법 식별 10분→1분. 달인=3행동, 전설=1행동'}]
  },
  'Recognize Spell': {
    effects: [{type:'display_note', text:'[반응] 주문 시전 목격 시 식별. 2랭크 이하 일반 주문 자동 식별'}]
  },
  'Multilingual': {
    effects: [{type:'display_note', text:'추가 언어 2개 습득. 전문가=비일반 언어도 가능. 이 재주 반복 선택 가능'}]
  },
  'Read Lips': {
    effects: [{type:'display_note', text:'알고 있는 언어의 입술 읽기 가능. 조우 중 매 라운드 사회 판정 필요'}]
  },
  'Sign Language': {
    effects: [{type:'display_note', text:'수화 사용 가능. 대화 상대도 수화를 알아야 함'}]
  },
  'Oddity Identification': {
    effects: [{type:'display_note', text:'오컬티즘으로 저주/유령 현상/정신 점령 식별 가능'}]
  },
  'Fascinating Performance': {
    effects: [{type:'display_note', text:'공연으로 주변 생물을 매혹. 의지 내성 실패 시 매혹 1라운드'}]
  },
  'Impressive Performance': {
    effects: [{type:'display_note', text:'인상 만들기에 공연 사용 가능'}]
  },
  'Virtuosic Performer': {
    choice: {
      type:'custom', label:'전문 공연 분야를 선택하세요',
      options:[
        {id:'singing', name:'노래'}, {id:'instruments', name:'악기'}, {id:'dancing', name:'춤'},
        {id:'acting', name:'연기'}, {id:'comedy', name:'코미디'}, {id:'oratory', name:'연설'},
      ]
    },
    effects: [{type:'display_note', text:'거장 공연가($choice_name): 해당 분야 공연에 +1 상황 보너스, 전문가=+2'}]
  },
  'Legendary Performer': {
    effects: [{type:'display_note', text:'공연으로 수백~수천 명에게 인상 만들기. 전설 전용'}]
  },
  'Student of the Canon': {
    effects: [{type:'display_note', text:'종교학 지식 회상 대실패→실패. 성공→대성공(일반 교리 한정)'}]
  },
  'Pilgrim\'s Token': {
    effects: [{type:'display_note', text:'신성한 부적 소지. 마법에 대한 의지 내성 +1 상황 보너스'}]
  },
  'Arcane Sense': {
    effects: [{type:'display_note', text:'60피트 이내 마법 감지(1행동). 전문가=상시 마법 감지'}]
  },
  'Unified Theory': {
    effects: [{type:'display_note', text:'주문학으로 다른 마법 전통(신성/비의/원시) 판정 대체 가능. 전설 전용'}]
  },
  'Connections': {
    effects: [{type:'display_note', text:'정보 수집 시 영향력 있는 인맥에 접근. 어려운 정보 획득 가능'}]
  },
  'Streetwise': {
    effects: [{type:'display_note', text:'도시에서 정보 수집에 사회 사용 가능. 전문가=도시 정세 자동 파악'}]
  },
  'Experienced Smuggler': {
    effects: [{type:'display_note', text:'은닉품 탐지 DC에 +2 상황 보너스. 전문가=대실패→실패'}]
  },
  'Swift Sneak': {
    effects: [{type:'display_note', text:'잠행 시 전체 이동 속도 사용 가능 (절반 대신)'}]
  },
  'Terrain Stalker': {
    choice: {
      type:'custom', label:'은밀 이동 지형을 선택하세요',
      options:[
        {id:'rubble', name:'잔해'}, {id:'snow', name:'눈'}, {id:'underbrush', name:'덤불'},
      ]
    },
    effects: [{type:'display_note', text:'지형 잠행($choice_name): 해당 지형에서 잠행 시 추적 흔적 안 남김'}]
  },
  'Quiet Allies': {
    effects: [{type:'display_note', text:'탐험 중 은밀 이동 시 아군도 당신의 은신 판정 결과 사용 가능'}]
  },
  'Foil Senses': {
    effects: [{type:'display_note', text:'숨기/잠행 시 항상 특수 감각(후각/진동감지 등)에 대한 예방 조치를 취하는 것으로 간주'}]
  },
  'Legendary Sneak': {
    effects: [{type:'display_note', text:'항상 숨기 상태. 발각 시에도 은폐물 없이 숨기 가능. 전설 전용'}]
  },
  'Robust Recovery': {
    effects: [{type:'display_note', text:'질병/독 치료 시 상황 보너스 +2→+4. 대실패→실패'}]
  },
  'Continual Recovery': {
    effects: [{type:'display_note', text:'부상 치료 대기 시간 1시간→10분'}]
  },
  'Ward Medic': {
    effects: [{type:'display_note', text:'부상 치료를 2명에게 동시 적용. 달인=4명, 전설=8명'}]
  },
  'Legendary Medic': {
    effects: [{type:'display_note', text:'1시간 치료로 쇠약/실명/귀머거리 등 심각한 상태 치유 가능. 전설 전용'}]
  },
  'Forager': {
    effects: [{type:'display_note', text:'생존으로 Subsist 시 실패→성공. 성공 시 자신+4명 제공. 전문가=+8명'}]
  },
  'Survey Wildlife': {
    effects: [{type:'display_note', text:'10분간 주변 관찰하여 근처 생물 파악. 흔적으로 지식 회상 가능'}]
  },
  'Experienced Tracker': {
    effects: [{type:'display_note', text:'추적 시 전체 속도 이동 가능. 달인=험지에서도 전체 속도'}]
  },
  'Legendary Survivalist': {
    effects: [{type:'display_note', text:'극한 환경에서도 자동 생존. 전설 전용'}]
  },

  // ═══════════════════════════════════════
  //  혈통 재주 (Ancestry Feats)
  // ═══════════════════════════════════════

  // ── 드워프 ──
  'Dwarven Lore': {
    effects: [{type:'skill_trained', skill:'crafting'}, {type:'skill_trained', skill:'religion'}]
  },
  'Mountain Roots': {
    effects: [{type:'display_note', text:'밀기/넘어뜨리기에 대한 DC +2 상황 보너스. 강제 이동 거리 절반'}]
  },
  'Dwarven Weapon Familiarity': {
    effects: [{type:'display_note', text:'전투 도끼, 전쟁 도끼, 전투 해머, 워해머 숙련됨'}]
  },
  'Rock Runner': {
    effects: [{type:'display_note', text:'바위/흙 험한 지형 이동 페널티 없음'}]
  },
  'Unburdened Iron': {
    effects: [{type:'display_note', text:'방어구 이동 속도 감소 5피트 줄임'}]
  },
  'Vengeful Hatred': {
    choice: {
      type:'custom', label:'복수 대상 유형을 선택하세요',
      options:[
        {id:'giant', name:'거인'}, {id:'orc', name:'오크'}, {id:'undead', name:'언데드'},
        {id:'aberration', name:'기형체'}, {id:'fiend', name:'마귀'}, {id:'dragon', name:'드래곤'},
      ]
    },
    effects: [{type:'display_note', text:'보복의 맹세($choice_name): 해당 유형 근접 피해 +1 (전문화 +2)'}]
  },
  'Boulder Roll': {
    effects: [{type:'display_note', text:'이동 중 적에게 밀기(Shove) 시도 가능'}]
  },
  "Mountain's Stoutness": {
    effects: [{type:'hp_bonus', value:'level'}, {type:'recovery_dc', value:-1}]
  },
  'Stonewalker': {
    effects: [{type:'display_note', text:'석재/흙벽 녹아들기 이동 가능'}]
  },

  // ── 엘프 ──
  'Elven Lore': {
    effects: [{type:'skill_trained', skill:'arcana'}, {type:'skill_trained', skill:'nature'}]
  },
  'Elven Weapon Familiarity': {
    effects: [{type:'display_note', text:'롱보우, 쇼트보우, 롱소드, 레이피어 숙련됨'}]
  },
  'Forlorn': {
    effects: [{type:'save_bonus', save:'will', value:1, bonus_type:'circumstance', condition:'감정 효과'}]
  },
  'Nimble Elf': {
    effects: [{type:'speed_bonus', value:5}]
  },
  'Unwavering Mien': {
    effects: [{type:'display_note', text:'매혹/수면 효과 지속시간 절반'}]
  },
  'Ageless Patience': {
    effects: [{type:'display_note', text:'탐색/조사에 2배 시간 투자 시 +2 상황 보너스'}]
  },
  'Elf Step': {
    effects: [{type:'display_note', text:'비틀거림(Step) 시 10피트 이동 가능'}]
  },
  'Expert Elven Weaponry': {
    effects: [{type:'display_note', text:'엘프 무기 숙련도 전문가로 증가'}]
  },

  // ── 노움 ──
  'Animal Elocutionist': {
    effects: [{type:'display_note', text:'동물과 대화(speak with animals) 상시 효과'}]
  },
  'Fey Fellowship': {
    effects: [{type:'display_note', text:'페이와의 외교/지각에 +2 상황 보너스'}]
  },
  'Gnome Weapon Familiarity': {
    effects: [{type:'display_note', text:'글레이브, 호쿡드 해머 숙련됨'}]
  },
  'Gnome Obsession': {
    choice: {
      type:'lore', label:'집착할 지식(Lore) 분야를 입력하세요',
    },
    effects: [{type:'display_note', text:'집착적 연구($choice_name): 해당 지식에 숙련됨, 레벨 상승 시 자동 증가'}]
  },
  'Illusion Sense': {
    effects: [{type:'display_note', text:'환상에 대한 간파 판정에 +1 상황 보너스'}]
  },
  'First World Magic': {
    effects: [{type:'cantrip_slots', value:1, tradition:'primal'}]
  },
  'Animal Accomplice': {
    effects: [{type:'display_note', text:'사역마 1마리 획득'}]
  },
  'Energized Font': {
    effects: [{type:'display_note', text:'추가 집중 포인트 1점 또는 타고난 주문 슬롯 추가'}]
  },
  'Gnome Weapon Expertise': {
    effects: [{type:'display_note', text:'노움 무기 숙련도 전문가로 증가'}]
  },

  // ── 고블린 ──
  'Burn It!': {
    effects: [{type:'display_note', text:'화염 피해에 +1 상태 보너스'}]
  },
  'Goblin Song': {
    effects: [{type:'grant_action', action:'goblin-song'}, {type:'display_note', text:'[1행동] 적의 지각/의지에 -1 상태 페널티'}]
  },
  'Goblin Scuttle': {
    effects: [{type:'display_note', text:'[반응] 아군 인접 이동 시 비틀거림(Step) 가능'}]
  },
  'Junk Tinker': {
    effects: [{type:'display_note', text:'폐자재로 간이 무기/장비 제작 가능'}]
  },
  'Rough Rider': {
    effects: [{type:'display_note', text:'탈것 관련 자연(Nature) 판정에 +1 상황 보너스'}]
  },
  'Very Sneaky': {
    effects: [{type:'display_note', text:'험한 지형에서 은신 +1 상황 보너스'}]
  },
  'Goblin Weapon Familiarity': {
    effects: [{type:'display_note', text:'도그슬라이서, 호스쵸퍼 숙련됨'}]
  },
  'Tail Spin': {
    effects: [{type:'display_note', text:'넘어뜨리기(Trip)에 +2 상황 보너스'}]
  },
  'Tree Climber': {
    effects: [{type:'speed_extra', key:'climb', value:10}]
  },
  'Goblin Weapon Frenzy': {
    effects: [{type:'display_note', text:'고블린 무기 숙련도 전문가로 증가'}]
  },

  // ── 하플링 ──
  'Halfling Luck': {
    effects: [{type:'display_note', text:'[반응] 기술/내성 실패 시 1회 재굴림. 하루 1회'}]
  },
  'Halfling Lore': {
    effects: [{type:'skill_trained', skill:'acrobatics'}, {type:'skill_trained', skill:'stealth'}]
  },
  'Halfling Weapon Familiarity': {
    effects: [{type:'display_note', text:'슬링, 쇼트소드, 핸드 크로스보우 숙련됨'}]
  },
  'Keen Eyes': {
    effects: [{type:'display_note', text:'은폐됨 DC 5→3, 숨겨짐 DC 11→9'}]
  },
  'Sure Feet': {
    effects: [{type:'display_note', text:'균형 잡기(Balance) 성공→대성공'}]
  },
  'Titan Slinger': {
    effects: [{type:'display_note', text:'슬링으로 대형+ 적 공격 시 추가 피해'}]
  },
  'Cultural Adaptability': {
    effects: [{type:'display_note', text:'1레벨 일반 재주 1개 추가 획득'}]
  },
  'Guiding Luck': {
    effects: [{type:'display_note', text:'이방인의 행운을 공격 굴림에도 사용 가능'}]
  },
  'Halfling Weapon Expertise': {
    effects: [{type:'display_note', text:'하플링 무기 숙련도 전문가로 증가'}]
  },

  // ── 인간 ──
  'General Training': {
    effects: [{type:'display_note', text:'1레벨 일반 재주 1개 추가 획득'}]
  },
  'Haughty Obstinacy': {
    effects: [{type:'display_note', text:'정신 효과 내성 성공→대성공. 명령/지배에 +2'}]
  },
  'Natural Ambition': {
    effects: [{type:'display_note', text:'1레벨 클래스 재주 1개 추가 획득'}]
  },
  'Natural Skill': {
    choice: {
      type:'skill', label:'추가로 숙련시킬 기술을 선택하세요',
      filter:{exclude_trained:true},
    },
    effects: [{type:'skill_trained', skill:'$choice'}]
  },
  'Cooperative Nature': {
    effects: [{type:'display_note', text:'도움(Aid) 반응 판정에 +4 상황 보너스'}]
  },
  'Versatile Heritage': {
    effects: [{type:'display_note', text:'반엘프 또는 반오크 유산 선택 가능'}]
  },
  'Adaptive Adept': {
    effects: [{type:'display_note', text:'1랭크 주문 1개를 타고난 주문으로 획득'}]
  },
  'Stubborn Persistence': {
    effects: [{type:'display_note', text:'의지 내성 대실패→실패'}]
  },
  'Unconventional Expertise': {
    effects: [{type:'display_note', text:'비관습 무기 숙련도 전문가로 증가'}]
  },

  // ── 레쉬 ──
  'Leshy Superstition': {
    effects: [{type:'save_bonus', save:'all', value:1, bonus_type:'circumstance', condition:'마법 효과'}]
  },
  'Grasping Reach': {
    effects: [{type:'display_note', text:'비무장 공격 도달 범위 10피트'}]
  },
  'Seedpod': {
    effects: [{type:'display_note', text:'씨앗 투척 원거리 비무장 공격 (1d4 B, 사거리 30피트)'}]
  },
  'Solar Rejuvenation': {
    effects: [{type:'display_note', text:'직사광선 10분 휴식 시 HP = 레벨 × CON 회복'}]
  },
  'Undaunted': {
    effects: [{type:'display_note', text:'식물/자연환경에서 은신 +2 상황 보너스'}]
  },
  'Leshy Familiar': {
    effects: [{type:'display_note', text:'식물 특성 사역마 1마리 획득'}]
  },
  'Ritual of Regrowth': {
    effects: [{type:'display_note', text:'1일 1회 10분 의식: HP = 레벨 × 4 회복, 상태이상 1개 해제'}]
  },
  'Bark Shield': {
    effects: [{type:'display_note', text:'[반응] 피격 시 나무껍질 방패 생성 (경도 3, HP 12)'}]
  },

  // ── 오크 ──
  'Orc Lore': {
    effects: [{type:'skill_trained', skill:'athletics'}, {type:'skill_trained', skill:'survival'}]
  },
  'Orc Weapon Familiarity': {
    effects: [{type:'display_note', text:'팔치온, 그레이트액스 숙련됨'}]
  },
  'Orc Ferocity': {
    effects: [{type:'display_note', text:'[반응] HP 0 시 HP 1로 유지. 하루 1회'}]
  },
  'Bloody Blows': {
    effects: [{type:'display_note', text:'치명타 시 대상에게 공포 1 부여'}]
  },
  'Iron Fists': {
    effects: [{type:'display_note', text:'주먹 비무장 피해 1d4→1d6'}]
  },
  'Victorious Vigor': {
    effects: [{type:'display_note', text:'적 쓰러뜨리면 임시 HP = 레벨'}]
  },
  'Pervasive Superstition': {
    effects: [{type:'save_bonus', save:'all', value:1, bonus_type:'circumstance', condition:'마법 효과'}]
  },
  'Orc Weapon Expertise': {
    effects: [{type:'display_note', text:'오크 무기 숙련도 전문가로 증가'}]
  },
};


// ═══════════════════════════════════════════════
//  ENGINE — applyFeatEffects()
// ═══════════════════════════════════════════════

function applyFeatEffects() {
  const fb = {
    hp: 0,
    speed: 0,
    extraSpeeds: {},     // {climb:10, swim:20}
    initiative: 0,
    bulk: 0,
    dying_threshold: 4,
    recovery_dc_mod: 0,
    skills: {},          // {athletics: {min_rank:2, bonus:0}}
    saves: {},           // {fort:{value:0,type:'',cond:''}}
    ac: 0,
    actions: [],
    damage_notes: [],
    notes: [],
    cantrip_bonus: 0,
    familiar_abilities: 0,
  };

  const level = getLevel();

  // 모든 재주 카테고리 순회
  Object.values(state.feats).forEach(arr => {
    if (!arr) return;
    arr.forEach(feat => {
      const nameEn = _extractEnName(feat.name);
      if (!nameEn) return;
      const def = FEAT_EFFECTS[nameEn];
      if (!def || !def.effects) return;

      def.effects.forEach(eff => {
        _applyOneEffect(fb, eff, feat, level);
      });
    });
  });

  state._fb = fb;
}

function _applyOneEffect(fb, eff, feat, level) {
  switch (eff.type) {
    case 'hp_bonus':
      fb.hp += (eff.value === 'level') ? level : (typeof eff.value === 'number' ? eff.value : 0);
      break;
    case 'speed_bonus':
      fb.speed += eff.value;
      break;
    case 'speed_extra':
      fb.extraSpeeds[eff.key] = Math.max(fb.extraSpeeds[eff.key] || 0, eff.value);
      break;
    case 'initiative_bonus':
      fb.initiative = Math.max(fb.initiative, eff.value);
      break;
    case 'bulk_bonus':
      fb.bulk += eff.value;
      break;
    case 'dying_threshold':
      fb.dying_threshold = Math.max(fb.dying_threshold, eff.value);
      break;
    case 'recovery_dc':
      fb.recovery_dc_mod += eff.value;
      break;
    case 'skill_trained': {
      const sid = _resolveChoice(eff.skill, feat);
      if (sid) {
        if (!fb.skills[sid]) fb.skills[sid] = {min_rank:0, bonus:0};
        fb.skills[sid].min_rank = Math.max(fb.skills[sid].min_rank, 2);
      }
      break;
    }
    case 'skill_bonus': {
      const sid2 = _resolveChoice(eff.skill, feat);
      if (sid2) {
        if (!fb.skills[sid2]) fb.skills[sid2] = {min_rank:0, bonus:0};
        fb.skills[sid2].bonus += eff.value;
      }
      break;
    }
    case 'save_bonus': {
      const key = eff.save; // 'fort','ref','will','all'
      const entry = {value: eff.value, type: eff.bonus_type||'', cond: eff.condition||''};
      if (key === 'all') {
        ['fort','ref','will'].forEach(s => {
          if (!fb.saves[s]) fb.saves[s] = [];
          fb.saves[s].push(entry);
        });
      } else {
        if (!fb.saves[key]) fb.saves[key] = [];
        fb.saves[key].push(entry);
      }
      break;
    }
    case 'grant_action':
      if (!fb.actions.includes(eff.action)) fb.actions.push(eff.action);
      break;
    case 'damage_note':
      if (eff.scaling) {
        let val = '';
        Object.entries(eff.scaling).forEach(([lv, v]) => {
          if (level >= parseInt(lv)) val = v;
        });
        if (val) fb.damage_notes.push(val + (eff.damage_type ? ' ' + eff.damage_type : ''));
      } else if (eff.text) {
        fb.damage_notes.push(eff.text);
      }
      break;
    case 'display_note': {
      let text = eff.text || '';
      text = text.replace(/\$choice_name/g, _getChoiceDisplayName(feat));
      fb.notes.push(text);
      break;
    }
    case 'cantrip_slots':
      fb.cantrip_bonus += eff.value;
      break;
    case 'familiar_abilities':
      fb.familiar_abilities += eff.value;
      break;
    case 'armor_upgrade':
    case 'proficiency':
      // 숙련도 변경 — syncAllProfRanks에서 처리 예정
      break;
  }
}

// ── 헬퍼 ──

function _extractEnName(featFullName) {
  if (!featFullName) return '';
  const m = featFullName.match(/\(([^)]+)\)$/);
  return m ? m[1].trim() : '';
}

function _resolveChoice(ref, feat) {
  if (ref === '$choice') return feat.choice || '';
  return ref;
}

function _getChoiceDisplayName(feat) {
  if (!feat.choice) return '';
  // 기술 id면 한글 이름으로
  if (typeof SKILLS !== 'undefined') {
    const sk = SKILLS.find(s => s.id === feat.choice);
    if (sk) return sk.name;
  }
  // 커스텀 옵션이면 name_en에서 FEAT_EFFECTS의 options 검색
  const nameEn = _extractEnName(feat.name);
  const def = FEAT_EFFECTS[nameEn];
  if (def && def.choice && def.choice.options) {
    const opt = def.choice.options.find(o => o.id === feat.choice);
    if (opt) return opt.name;
  }
  return feat.choice;
}

// ── 선택 모달 ──

function openFeatChoiceModal(featType, featIndex, choiceDef) {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'feat-choice';
  modalContext = {featType, featIndex, choiceDef};

  document.getElementById('modal-title').textContent = choiceDef.label || '선택';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  const detail = document.getElementById('modal-detail');
  if (detail) { detail.style.display = 'none'; }

  const listEl = document.querySelector('.modal-list');
  if (listEl) { listEl.style.display = ''; listEl.style.width = '100%'; listEl.style.borderRight = 'none'; }

  const container = document.getElementById('modal-options');
  container.innerHTML = '';

  if (choiceDef.type === 'skill' || choiceDef.type === 'skill_trained') {
    SKILLS.forEach(sk => {
      if (sk.isLore) return; // 지식 기술은 별도 처리
      const rank = parseInt(document.getElementById('sk-prof-' + sk.id)?.value || 0);
      if (choiceDef.filter?.min_rank && rank < choiceDef.filter.min_rank) return;
      if (choiceDef.filter?.exclude_trained && rank >= 2) return;

      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      row.innerHTML = `<span class="opt-row-name">${sk.name} (${sk.en})</span>`;
      row.onclick = () => _applyFeatChoice(sk.id);
      container.appendChild(row);
    });
  } else if (choiceDef.type === 'lore') {
    // 자유 입력
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '지식 분야 입력...';
    input.style.cssText = 'width:100%;padding:8px;background:var(--bg3);border:1px solid var(--border);color:var(--text);border-radius:4px;font-size:14px;margin:8px 0;';
    container.appendChild(input);
    const btn = document.createElement('button');
    btn.textContent = '확인';
    btn.style.cssText = 'padding:8px 20px;background:var(--accent);color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;';
    btn.onclick = () => {
      const val = input.value.trim();
      if (val) _applyFeatChoice(val);
    };
    container.appendChild(btn);
  } else if (choiceDef.type === 'custom' && choiceDef.options) {
    choiceDef.options.forEach(opt => {
      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      row.innerHTML = `<span class="opt-row-name">${opt.name}</span>`;
      row.onclick = () => _applyFeatChoice(opt.id);
      container.appendChild(row);
    });
  }
}

function _applyFeatChoice(choiceId) {
  if (!modalContext) return;
  const {featType, featIndex} = modalContext;
  state.feats[featType][featIndex].choice = choiceId;
  renderFeats();
  recalcAll();
  save();
  closeModal();
}

// ── 재주 추가 시 선택 필요 여부 체크 ──

function checkFeatChoice(featName, featType, featIndex) {
  const nameEn = _extractEnName(featName);
  const def = FEAT_EFFECTS[nameEn];
  if (def && def.choice) {
    openFeatChoiceModal(featType, featIndex, def.choice);
    return true; // 선택 모달이 열림
  }
  return false; // 선택 불필요
}
