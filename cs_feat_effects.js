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
      type:'ancestry_pick', label:'입양할 혈통을 선택하세요', repeatable:true
    },
    effects: [
      {type:'adopted_ancestry'},
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
    effects: [{type:'grant_innate_spell', spell:'마법 감지', tradition:'신비', spellType:'cantrip', uses:'자유'}, {type:'display_note', text:'전문가=1행동, 대가=자유 행동, 전설=수동 상시 감지'}]
  },
  'Unified Theory': {
    effects: [{type:'display_note', text:'주문학으로 다른 마법 전통(신성/오컬트/원시) 판정 대체 가능. 전설 전용'}]
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
    effects: [{type:'skill_trained', skill:'crafting'}, {type:'skill_trained', skill:'religion'}, {type:'grant_lore', name:'드워프'}]
  },
  'Mountain Roots': {
    effects: [{type:'display_note', text:'밀기/넘어뜨리기에 대한 DC +2 상황 보너스. 강제 이동 거리 절반'}]
  },
  'Defy the Darkness': {
    effects: [{type:'vision_upgrade', vision:'상위 암시야'}]
  },
  'Echoes in Stone': {
    effects: [{type:'extra_sense', sense:'진동 감각 20피트 (돌/흙 위, 1행동)'}]
  },
  'Stonegate': {
    effects: [{type:'grant_innate_spell', spell:'마법 통로', tradition:'신성', spellType:'spell', uses:'하루 1회'}]
  },
  'Stonewalker': {
    effects: [{type:'grant_innate_spell', spell:'돌과 하나', tradition:'신성', spellType:'spell', uses:'하루 1회'}]
  },
  "Stonemason's Eye": {
    effects: [{type:'skill_trained', skill:'crafting'}]
  },
  'Dwarven Weapon Familiarity': {
    effects: [{type:'weapon_familiarity', weapons:['전투 도끼','픽','워해머']}]
  },
  'Rock Runner': {
    effects: [{type:'display_note', text:'바위/흙 험한 지형 이동 페널티 없음'}]
  },
  'Unburdened Iron': {
    effects: [{type:'unburdened_iron'}]
  },
  'Vengeful Hatred': {
    choice: {
      type:'custom', label:'복수 대상 유형을 선택하세요',
      options:[
        {id:'giant', name:'거인'}, {id:'orc', name:'오크'}, {id:'undead', name:'언데드'},
        {id:'aberration', name:'기형체'}, {id:'fiend', name:'악마'}, {id:'dragon', name:'드래곤'},
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
  'March the Mines': {
    effects: [{type:'grant_action'}]
  },
  'Stone Bones': {
    effects: [{type:'grant_action'}]
  },
  'Stonewall': {
    effects: [{type:'grant_action'}]
  },

  // ── 엘프 ──
  'Elven Lore': {
    effects: [{type:'skill_trained', skill:'arcana'}, {type:'skill_trained', skill:'nature'}, {type:'grant_lore', name:'엘프'}]
  },
  'Elven Weapon Familiarity': {
    effects: [
      {type:'weapon_trained', weapons:['장궁','단궁','롱소드','레이피어']},
      {type:'weapon_familiarity', weapons:['합성 장궁','합성 단궁']}
    ]
  },
  'Forlorn': {
    effects: [{type:'save_bonus', save:'will', value:1, bonus_type:'circumstance', condition:'감정 효과'}]
  },
  'Nimble Elf': {
    effects: [{type:'speed_bonus', value:5}]
  },
  'Otherworldly Magic': {
    choice: {type:'spell_cantrip', tradition:'arcane', label:'비전(Arcane) 캔트립 선택'},
    effects: [{type:'grant_innate_spell'}]
  },
  'First World Magic': {
    choice: {type:'spell_cantrip', tradition:'primal', label:'원시(Primal) 캔트립 선택'},
    effects: [{type:'grant_innate_spell'}]
  },
  'Tree Climber': {
    effects: [{type:'speed_extra', key:'climb', value:10}]
  },
  'Martial Experience': {
    effects: [{type:'martial_experience'}]
  },
  'Unwavering Mien': {
    effects: [{type:'display_note', text:'매혹/수면 효과 지속시간 절반'}]
  },
  'Ageless Patience': {
    effects: [{type:'display_note', text:'탐색/조사에 2배 시간 투자 시 +2 상황 보너스'}]
  },
  'Elf Step': {
    effects: [{type:'grant_action'}, {type:'display_note', text:'비틀거림(Step) 시 10피트 이동 가능'}]
  },
  'Expert Elven Weaponry': {
    effects: [{type:'display_note', text:'엘프 무기 숙련도 전문가로 증가'}]
  },
  'Avenge Ally': {
    effects: [{type:'grant_action'}]
  },
  'Universal Longevity': {
    effects: [{type:'grant_action'}]
  },

  // ── 노움 ──
  'Animal Elocutionist': {
    effects: [{type:'display_note', text:'동물과 대화(speak with animals) 상시 효과'}]
  },
  'Fey Fellowship': {
    effects: [{type:'display_note', text:'페이와의 외교/지각에 +2 상황 보너스'}]
  },
  'Homeward Bound': {
    effects: [{type:'grant_innate_spell', spell:'차원간 순간이동', tradition:'원시', spellType:'spell', uses:'주 2회'}]
  },
  'Gnome Weapon Familiarity': {
    effects: [{type:'weapon_familiarity', weapons:['글레이브']}]
  },
  'Gnome Obsession': {
    choice: {
      type:'lore', label:'집착할 지식(Lore) 분야를 입력하세요',
    },
    effects: [{type:'grant_lore', name:'$choice'}, {type:'display_note', text:'$choice_name 지식에 숙련됨 + 확신(Assurance) 재주 적용. 휴식 1일로 주제 변경 가능'}]
  },
  'Illusion Sense': {
    effects: [{type:'display_note', text:'환상에 대한 간파 판정에 +1 상황 보너스'}]
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
  'Instinctive Obfuscation': {
    effects: [{type:'grant_action'}]
  },
  'Life Leap': {
    effects: [{type:'grant_action'}]
  },

  // ── 고블린 ──
  'Burn It!': {
    effects: [{type:'display_note', text:'화염 피해에 +1 상태 보너스'}]
  },
  'Goblin Song': {
    effects: [{type:'grant_action', action:'goblin-song'}, {type:'display_note', text:'[1행동] 적의 지각/의지에 -1 상태 페널티'}]
  },
  'Goblin Scuttle': {
    effects: [{type:'grant_action'}, {type:'display_note', text:'[반응] 아군 인접 이동 시 비틀거림(Step) 가능'}]
  },
  'Junk Tinker': {
    effects: [{type:'display_note', text:'폐자재로 간이 무기/장비 제작 가능'}]
  },
  'Rough Rider': {
    effects: [{type:'grant_feat', feat:'기마 (Ride)'}, {type:'display_note', text:'고블린 개/늑대 탈것에 동물 명령 +1 상황 보너스'}]
  },
  'Cave Climber': {
    effects: [{type:'speed_extra', key:'climb', value:10}]
  },
  'Vandal': {
    effects: [{type:'skill_trained', skill:'thievery'}]
  },
  'Goblin Lore': {
    effects: [{type:'skill_trained', skill:'nature'}, {type:'skill_trained', skill:'stealth'}, {type:'grant_lore', name:'고블린'}]
  },
  'Very Sneaky': {
    effects: [{type:'display_note', text:'험한 지형에서 은신 +1 상황 보너스'}]
  },
  'Goblin Weapon Familiarity': {
    effects: [{type:'weapon_familiarity', weapons:[]}, {type:'display_note', text:'고블린 특성 무기에 친숙 (군용→단순, 고급→군용)'}]
  },
  'Tail Spin': {
    effects: [{type:'display_note', text:'넘어뜨리기(Trip)에 +2 상황 보너스'}]
  },
  'Goblin Weapon Frenzy': {
    effects: [{type:'display_note', text:'고블린 무기 숙련도 전문가로 증가'}]
  },
  'Cling': {
    effects: [{type:'grant_action'}]
  },
  'Reckless Abandon': {
    effects: [{type:'grant_action'}]
  },

  // ── 하플링 ──
  'Halfling Luck': {
    effects: [{type:'grant_action'}, {type:'display_note', text:'[반응] 기술/내성 실패 시 1회 재굴림. 하루 1회'}]
  },
  'Prairie Rider': {
    effects: [{type:'skill_trained', skill:'nature'}]
  },
  'Halfling Lore': {
    effects: [{type:'skill_trained', skill:'acrobatics'}, {type:'skill_trained', skill:'stealth'}, {type:'grant_lore', name:'하플링'}]
  },
  'Unhampered Passage': {
    effects: [{type:'grant_innate_spell', spell:'속박 해제', tradition:'원시', spellType:'spell', uses:'하루 1회'}]
  },
  'Halfling Weapon Familiarity': {
    effects: [{type:'weapon_familiarity', weapons:['쇼트소드','하플링 투석 지팡이']}]
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
    effects: [{type:'grant_feat', feat:'양자 혈통 (Adopted Ancestry)'}, {type:'grant_adopted_feat'}]
  },
  'Guiding Luck': {
    effects: [{type:'display_note', text:'이방인의 행운을 명중 굴림에도 사용 가능'}]
  },
  'Halfling Weapon Expertise': {
    effects: [{type:'display_note', text:'하플링 무기 숙련도 전문가로 증가'}]
  },
  'Shadow Self': {
    effects: [{type:'grant_action'}]
  },
  'Step Lively': {
    effects: [{type:'grant_action'}]
  },

  // ── 인간 ──
  'General Training': {
    choice: {type:'feat_pick', label:'1레벨 일반 재주 선택', pickCategory:'general', pickMaxLevel:1, grantTo:'general'},
    effects: []
  },
  'Haughty Obstinacy': {
    effects: [{type:'display_note', text:'정신 효과 내성 성공→대성공. 명령/지배에 +2'}]
  },
  'Natural Ambition': {
    choice: {type:'feat_pick', label:'1레벨 클래스 재주 선택', pickCategory:'$class', pickMaxLevel:1, grantTo:'class'},
    effects: []
  },
  'Adapted Cantrip': {
    choice: {type:'spell_cantrip', tradition:'$other', label:'다른 전통에서 캔트립 선택'},
    effects: []
  },
  'Supernatural Charm': {
    effects: [{type:'grant_innate_spell', spell:'매혹', tradition:'비전', spellType:'spell', uses:'하루 1회'}]
  },
  'Natural Skill': {
    choice: {
      type:'skill_multi', label:'숙련시킬 기술 2개를 선택하세요', count:2,
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
  'Clever Improviser': {
    effects: [{type:'grant_feat', feat:'비숙련 즉흥연기 (Untrained Improvisation)'}]
  },
  'Stubborn Persistence': {
    effects: [{type:'display_note', text:'의지 내성 대실패→실패'}]
  },
  'Hardy Traveler': {
    effects: [{type:'bulk_bonus', value:1}]
  },
  'Multitalented': {
    choice: {type:'feat_pick', label:'2레벨 멀티클래스 헌신 재주 선택', pickCategory:'archetype', pickMaxLevel:2, pickTraits:['헌신'], grantTo:'archetype', skipPrereqIfAiuvarin:true, skipDedicationLimit:true},
    effects: []
  },
  'Advanced General Training': {
    choice: {type:'feat_pick', label:'7레벨 이하 일반 재주 선택', pickCategory:'general', pickMaxLevel:7, grantTo:'general'},
    effects: []
  },
  'Unconventional Weaponry': {
    choice: {type:'weapon_pick', label:'비일반 무기 선택'},
    effects: [{type:'weapon_familiarity', weapons:['$choice']}]
  },
  'Unconventional Expertise': {
    choice: {type:'weapon_pick', label:'전문가로 올릴 비일반 무기 선택'},
    effects: [{type:'display_note', text:'선택한 비관습 무기 숙련도 전문가로 증가: $choice_name'}]
  },
  'Bounce Back': {
    effects: [{type:'grant_action'}, {type:'display_note', text:'[자유 행동] 하루 1회. 빈사 해제 시 부상 수치 미증가'}]
  },
  'Heroic Presence': {
    effects: [{type:'grant_action'}, {type:'display_note', text:'[자유 행동] 하루 1회. 열정적 확신 6랭크: 임시 HP 19, 공포/도주 내성 +2 (10분)'}]
  },

  // ── 레쉬 ──
  'Leshy Superstition': {
    effects: [{type:'grant_action'}, {type:'save_bonus', save:'all', value:1, bonus_type:'circumstance', condition:'마법 효과'}]
  },
  'Grasping Reach': {
    effects: [{type:'display_note', text:'비무장 공격 도달 범위 10피트'}]
  },
  'Seedpod': {
    effects: [{type:'grant_weapon', weapon_name:'씨앗 꼬투리', weapon_category:'unarmed', damage:'1d4 B', range:30, traits:['비무장','원거리']}]
  },
  'Solar Rejuvenation': {
    effects: [{type:'display_note', text:'직사광선 10분 휴식 시 HP = 레벨 × CON 회복'}]
  },
  'Undaunted': {
    effects: [{type:'save_bonus', save:'will', value:1, bonus_type:'circumstance', condition:'감정 효과'}]
  },
  'Harmlessly Cute': {
    effects: [{type:'grant_feat', feat:'뻔뻔한 요청 (Shameless Request)'}, {type:'display_note', text:'기만으로 주도권 굴릴 때 +1 상황 보너스'}]
  },
  'Leshy Lore': {
    effects: [{type:'skill_trained', skill:'nature'}, {type:'skill_trained', skill:'stealth'}, {type:'grant_lore', name:'레쉬'}]
  },
  'Shadow of the Wilds': {
    effects: [{type:'display_note', text:'도시 외 환경에서 항상 흔적 감추기 상태'}]
  },
  'Anchoring Roots': {
    effects: [{type:'grant_feat', feat:'안정된 균형 (Steady Balance)'}, {type:'grant_action', actionName:'고정'}]
  },
  'Leshy Glide': {
    effects: [{type:'grant_action'}, {type:'display_note', text:'[1행동] 5피트 아래로 최대 25피트 앞으로 활공'}]
  },
  'Ritual Reversion': {
    effects: [{type:'grant_action'}, {type:'display_note', text:'[2행동] 식물/균류 표본 형태로 변신 (식물과 하나 효과)'}]
  },
  'Speak with Kindred': {
    effects: [{type:'display_note', text:'식물/균류에게 외교 사용 가능. 자신의 종류에 +2 상황 보너스'}]
  },
  'Bark and Tendril': {
    effects: [{type:'grant_innate_spell', spell:'방해 식물', tradition:'원시', spellType:'spell', uses:'하루 1회'}, {type:'grant_innate_spell', spell:'참나무 강인', tradition:'원시', spellType:'spell', uses:'하루 1회'}]
  },
  'Lucky Keepsake': {
    effects: [{type:'save_bonus', save:'all', value:1, bonus_type:'circumstance', condition:'주문/마법 효과'}]
  },
  'Thorned Seedpod': {
    effects: [{type:'damage_note', text:'씨앗 꼬투리 대성공 시 1d4 지속 관통 피해'}]
  },
  'Call of the Green Man': {
    effects: [{type:'grant_innate_spell', spell:'식물 형태', tradition:'원시', spellType:'spell', uses:'하루 1회'}]
  },
  'Cloak of Poison': {
    effects: [{type:'grant_action'}, {type:'display_note', text:'[2행동] 하루 1회, 1분간 접촉/근접 공격자에게 3d6 독 피해'}]
  },
  'Flourish and Ruin': {
    effects: [{type:'grant_innate_spell', spell:'생명의 장', tradition:'원시', spellType:'spell', uses:'하루 1회'}, {type:'grant_innate_spell', spell:'덩굴 뒤엉킴', tradition:'원시', spellType:'spell', uses:'하루 1회'}]
  },
  'Regrowth': {
    effects: [{type:'grant_innate_spell', spell:'재생', tradition:'원시', spellType:'spell', uses:'하루 1회'}]
  },

  // ── 오크 ──
  'Orc Lore': {
    effects: [{type:'skill_trained', skill:'athletics'}, {type:'skill_trained', skill:'survival'}, {type:'grant_lore', name:'오크'}]
  },
  'Orc Weapon Familiarity': {
    effects: [{type:'weapon_familiarity', weapons:['팔치온','그레이트액스']}]
  },
  'Tusks': {
    effects: [{type:'grant_weapon', weapon_name:'엄니', weapon_category:'unarmed', damage:'1d6 P', range:0, traits:['비무장','기교']}]
  },
  'Beast Trainer': {
    effects: [{type:'skill_trained', skill:'nature'}],
    choice: {type:'custom', label:'재주 선택', options:[{id:'pet',name:'반려동물 (Pet)'},{id:'train',name:'동물 훈련 (Train Animal)'}]},
    choiceEffects: {
      pet: [{type:'grant_feat', feat:'반려동물 (Pet)'}],
      train: [{type:'grant_feat', feat:'동물 훈련 (Train Animal)'}]
    }
  },
  'Hold Mark': {
    choice: {type:'custom', label:'거점 표식 선택', options:[
      {id:'sun',name:'타오르는 태양 (외교, 비전)'},
      {id:'skull',name:'죽음의 머리 (생존, 원시)'},
      {id:'corpse',name:'더럽혀진 시체 (종교학, 신성)'},
      {id:'hand',name:'빈 손 (위협, 오컬트)'}
    ]},
    choiceEffects: {
      sun: [{type:'skill_trained', skill:'diplomacy'},{type:'save_bonus', save:'all', value:1, bonus_type:'status', condition:'비전 주문'}],
      skull: [{type:'skill_trained', skill:'survival'},{type:'save_bonus', save:'all', value:1, bonus_type:'status', condition:'원시 주문'}],
      corpse: [{type:'skill_trained', skill:'religion'},{type:'save_bonus', save:'all', value:1, bonus_type:'status', condition:'신성 주문'}],
      hand: [{type:'skill_trained', skill:'intimidation'},{type:'save_bonus', save:'all', value:1, bonus_type:'status', condition:'오컬트 주문'}]
    }
  },
  'Orc Ferocity': {
    effects: [{type:'grant_action'}, {type:'display_note', text:'[반응] HP 0 시 HP 1로 유지. 하루 1회'}]
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
  'Rampaging Ferocity': {
    effects: [{type:'grant_action'}]
  },

  // ── 체인질링 ──
  'Changeling Lore': {
    effects: [{type:'skill_trained', skill:'deception'}, {type:'skill_trained', skill:'occultism'}, {type:'grant_lore', name:'해그'}]
  },
  "Hag's Sight": {
    effects: [{type:'display_note', text:'암시야(darkvision) 획득'}]
  },

  // ── 네피림 ──
  'Angelkin': {
    effects: [{type:'skill_trained', skill:'society'}, {type:'display_note', text:'천상어 습득. 다국어(Multilingual) 재주 획득'}]
  },
  'Hellspawn': {
    effects: [{type:'skill_trained', skill:'deception'}, {type:'display_note', text:'법률 지식 숙련. 거짓 간파(Lie to Me) 재주 획득'}]
  },
  'Pitborn': {
    effects: [{type:'skill_trained', skill:'athletics'}, {type:'display_note', text:'운동 숙련 전제조건 1레벨 기술 재주 1개 추가'}]
  },
  'Nephilim Lore': {
    effects: [{type:'skill_trained', skill:'religion'}, {type:'grant_lore', name:'차원'}, {type:'display_note', text:'외교 또는 위협 숙련 (선택)'}]
  },
  'Nephilim Eyes': {
    effects: [{type:'display_note', text:'암시야(darkvision) 획득'}]
  },
  'Nimble Hooves': {
    effects: [{type:'speed_bonus', value:5}]
  },
  'Divine Wings': {
    effects: [{type:'grant_action'}]
  },

  // ── 아이우바린 ──
  'Earned Glory': {
    effects: [{type:'skill_trained', skill:'performance'}, {type:'display_note', text:'인상적 공연(Impressive Performance) 재주 획득'}]
  },

  // ── 드로마르 ──
  'Monstrous Peacemaker': {
    effects: [{type:'display_note', text:'비인간형 지적 생물/소외된 인간형에 외교 +1 상황 보너스'}]
  },
  'Orc Sight': {
    effects: [{type:'display_note', text:'암시야(darkvision) 획득'}]
  },
  'Celestial Mercy': {
    effects: [{type:'grant_innate_spell', spell:'고통 정화', tradition:'신성', spellType:'spell', uses:'하루 2회'}]
  },
  'Slip Sideways': {
    effects: [{type:'grant_innate_spell', spell:'순간이동', tradition:'신성', spellType:'spell', uses:'하루 1회'}]
  },
  'Hag Magic': {
    effects: [{type:'display_note', text:'4랭크 오컬트 선천 주문 하루 1회 (점술, 매혹, 투청, 투시, 꿈 메시지, 환영 변장 중 선택)'}]
  },
  'Otherworldly Acumen': {
    choice: {type:'spell_rank', rank:2, tradition:'arcane', label:'비전(Arcane) 2랭크 주문 선택'},
    effects: []
  },
  'Celestial Magic': {
    effects: [{type:'display_note', text:'2랭크 신성 선천 주문 2개 하루 1회 (맑은 마음, 영원의 빛, 인간형 형태, 폭로의 빛, 생명 공유, 확실한 발놀림 중 선택)'}]
  },
  'Fiendish Magic': {
    effects: [{type:'display_note', text:'2랭크 신성 선천 주문 2개 하루 1회 (변장 마법, 거짓 활력, 투명화, 투시, 분쇄, 편집증 중 선택)'}]
  },
  'Summon Nephilim Kin': {
    effects: [{type:'display_note', text:'5랭크 소환 주문을 신성 선천 주문으로 하루 1회'}]
  },

  // ═══════════════════════════════════════
  //  바드 클래스 재주 (Bard Class Feats)
  // ═══════════════════════════════════════

  // ── 1레벨 ──
  'Bardic Lore': {
    effects: [{type:'grant_lore', name:'바드 지식'}, {type:'display_note', text:'어떤 주제든 지식 회상 가능. 오컬티즘 전설 시 전문가'}]
  },
  'Hymn of Healing': {
    effects: [{type:'grant_focus_spell', spell:'치유의 찬송'}, {type:'grant_action'}]
  },
  'Lingering Composition': {
    effects: [{type:'grant_focus_spell', spell:'잔향 작곡'}, {type:'display_note', text:'작곡 지속 시간 연장. 집중 포인트 풀 +1 (최대 3)'}]
  },
  'Martial Performance': {
    effects: [{type:'display_note', text:'용감한 찬가 활성 중 타격 명중 시 작곡 지속 1라운드 연장 (시전당 1회)'}]
  },
  // 'Reach Spell' — 공유 재주, 위치 섹션에 정의됨
  'Versatile Performance': {
    effects: [{type:'display_note', text:'공연으로 인상 만들기(외교), 사기 꺾기(위협), 변장(기만) 대체 가능'}]
  },
  'Well-Versed': {
    effects: [{type:'save_bonus', save:'all', value:1, bonus_type:'circumstance', condition:'청각/환영/언어/음파/시각 효과'}]
  },

  // ── 2레벨 ──
  'Cantrip Expansion': {
    effects: [{type:'cantrip_slots', value:2}]
  },
  'Directed Audience': {
    effects: [{type:'display_note', text:'방사 영역 작곡를 10피트 더 큰 원뿔로 변경 가능'}]
  },
  'Emotional Push': {
    effects: [{type:'display_note', text:'[반응] 적이 감정 주문 내성 실패 시, 대상이 다음 공격에 무방비(off-guard)'}]
  },
  'Esoteric Polymath': {
    effects: [{type:'display_note', text:'오컬트 주문서 획득. 일일 준비 시 주문서에서 주문 1개를 레퍼토리에 추가'}]
  },
  "Loremaster's Etude": {
    effects: [{type:'grant_focus_spell', spell:'대가의 에튀드'}, {type:'display_note', text:'지식 회상 보조. 집중 포인트 풀 +1 (최대 3)'}]
  },
  'Multifarious Muse': {
    choice: {
      type:'muse_pick', label:'추가 뮤즈를 선택하세요', repeatable:true
    },
    effects: [{type:'display_note', text:'추가 뮤즈: $choice_name — 해당 뮤즈 1레벨 재주 획득'}]
  },
  'Song of Strength': {
    effects: [{type:'grant_focus_spell', spell:'힘의 노래'}, {type:'display_note', text:'작곡 캔트립: 힘의 노래 습득. 아군의 운동 판정 보조'}]
  },
  'Uplifting Overture': {
    effects: [{type:'grant_focus_spell', spell:'고양 서곡'}, {type:'display_note', text:'작곡 캔트립: 고양 서곡 습득. 아군의 기술 판정 보조'}]
  },

  // ── 4레벨 ──
  'Combat Reading': {
    effects: [{type:'display_note', text:'[1행동] 오컬티즘 판정으로 적의 약점/내성/면역/저항 파악'}]
  },
  'Courageous Advance': {
    effects: [{type:'display_note', text:'[주문변형] 용감한 찬가 시전 시 아군 1명이 반응으로 보폭'}]
  },
  'In Tune': {
    effects: [{type:'display_note', text:'[주문변형] 방사 작곡의 원점을 60피트 내 아군으로 변경'}]
  },
  'Melodious Spell': {
    effects: [{type:'display_note', text:'[주문변형] 주문 구성요소를 공연에 숨김. 지각 판정 성공해야 감지'}]
  },
  'Rallying Anthem': {
    effects: [{type:'grant_focus_spell', spell:'결집의 찬가'}, {type:'display_note', text:'작곡 캔트립: 결집의 찬가 습득. 아군 의지 내성 강화 및 정신 피해 저항'}]
  },
  'Ritual Researcher': {
    effects: [{type:'display_note', text:'오컬티즘으로 의식 학습 가능. 보조 판정 성공도 한 단계 향상'}]
  },
  'Triple Time': {
    effects: [{type:'grant_focus_spell', spell:'세 박자'}, {type:'display_note', text:'작곡 캔트립: 세 박자 습득. 아군 이동 속도 증가'}]
  },
  'Versatile Signature': {
    effects: [{type:'display_note', text:'일일 준비 시 각 랭크의 시그니처 주문 변경 가능'}]
  },

  // ── 6레벨 ──
  'Assured Knowledge': {
    effects: [{type:'display_note', text:'지식 회상 시 굴림 대신 10 + 숙련 보너스 사용 가능. 확인 없이 자동 지식 전제 충족'}]
  },
  'Defensive Coordination': {
    effects: [{type:'display_note', text:'[주문변형] 결집의 찬가 시전 시 방패 올리기 + 아군 1명도 방패 올리기'}]
  },
  'Dirge of Doom': {
    effects: [{type:'grant_focus_spell', spell:'파멸의 만가'}, {type:'display_note', text:'작곡 캔트립: 파멸의 만가 습득. 적에게 공포 부여'}]
  },
  'Educate Allies': {
    effects: [{type:'display_note', text:'작곡 영향 아군에게 해박한 보너스(+1) 전달. 자신은 +2로 증가'}]
  },
  'Harmonize': {
    effects: [{type:'display_note', text:'[주문변형] 작곡를 조화시켜 다른 작곡와 동시 유지 가능'}]
  },
  'Song of Marching': {
    effects: [{type:'grant_focus_spell', spell:'행군의 노래'}, {type:'display_note', text:'작곡 캔트립: 행군의 노래 습득. 장거리 행군 피로 경감'}]
  },
  // 'Steady Spellcasting' — 공유 재주, 위치 섹션에 정의됨

  // ── 8레벨 ──
  'Accompany': {
    effects: [{type:'display_note', text:'[반응] 아군 주문시전 시 공연 판정으로 슬롯/집중 포인트 대신 소비'}]
  },
  'Call and Response': {
    effects: [{type:'display_note', text:'[주문변형] 작곡 캔트립을 호응 형태로 — 아군 1명이 1행동으로 지속 연장'}]
  },
  'Eclectic Skill': {
    effects: [{type:'display_note', text:'미숙련 기술 숙련 보너스 = 레벨. 숙련 필요 행동도 미숙련으로 시도 가능'}]
  },
  'Fortissimo Composition': {
    effects: [{type:'grant_focus_spell', spell:'포르티시모 작곡'}, {type:'display_note', text:'작곡 강화. 집중 포인트 풀 +1 (최대 3)'}]
  },
  'Know-It-All': {
    effects: [{type:'display_note', text:'지식 회상 성공 시 추가 정보 획득. 대성공 시 추가 질문 가능'}]
  },
  'Reflexive Courage': {
    effects: [{type:'display_note', text:'[반응] 전투 함성으로 유발 생물에 근접 타격. 치명타 시 조작 행동 방해'}]
  },
  'Soulsight': {
    effects: [{type:'display_note', text:'60피트 부정확 영혼감각 획득. 살아있는/언데드/혼령 감지'}]
  },

  // ── 10레벨 ──
  'Annotate Composition': {
    effects: [{type:'display_note', text:'10분 + 집중 포인트 1점으로 작곡를 두루마리에 전사. 다른 이가 읽어 활성화'}]
  },
  'Courageous Assault': {
    effects: [{type:'display_note', text:'[주문변형] 용감한 찬가 시전 시 아군 1명이 반응으로 근접 타격'}]
  },
  'House of Imaginary Walls': {
    effects: [{type:'grant_focus_spell', spell:'상상의 벽 집'}, {type:'display_note', text:'작곡 캔트립: 상상의 벽 집 습득. 상상의 장벽 생성'}]
  },
  'Ode to Ouroboros': {
    effects: [{type:'grant_focus_spell', spell:'뱀 물기의 송가'}, {type:'display_note', text:'집중 주문: 뱀 물기의 송가 습득. 아군을 일시적으로 죽음에서 구함. 집중 포인트 풀 +1 (최대 3)'}]
  },
  'Quickened Casting': {
    effects: [{type:'display_note', text:'하루 1회. 캔트립 또는 최고 슬롯보다 2랭크 이상 낮은 주문의 시전 행동 수 1 감소'}]
  },
  'Symphony of the Unfettered Heart': {
    effects: [{type:'grant_focus_spell', spell:'속박 해방의 교향곡'}, {type:'display_note', text:'집중 주문: 속박 해방의 교향곡 습득. 무력화 상태 보호. 집중 포인트 풀 +1 (최대 3)'}]
  },
  'Unusual Composition': {
    effects: [{type:'display_note', text:'[주문변형] 작곡를 어떤 감각으로든 전달 가능 (진동감각 등)'}]
  },

  // ── 12레벨 ──
  'Eclectic Polymath': {
    effects: [{type:'display_note', text:'비밀스러운 박학으로 추가한 주문을 레퍼토리에 유지 가능 (같은 랭크 주문과 교환)'}]
  },
  "Enigma's Knowledge": {
    effects: [{type:'display_note', text:'지식 회상 가능한 모든 기술에 자동 지식 혜택 적용 (라운드당 1회)'}]
  },
  'Inspirational Focus': {
    effects: [{type:'display_note', text:'재집중 시 집중 풀 완전 회복'}]
  },
  'Reverberate': {
    effects: [{type:'display_note', text:'[반응] 음파 피해 수신 시 공연 판정으로 피해 감소 및 반사'}]
  },
  'Shared Assault': {
    effects: [{type:'display_note', text:'용감한 맹공의 아군이 대성공 시, 다른 아군 1명도 반응으로 근접 타격'}]
  },

  // ── 14레벨 ──
  'Allegro': {
    effects: [{type:'grant_focus_spell', spell:'알레그로'}, {type:'display_note', text:'작곡 캔트립: 알레그로 습득. 아군 가속'}]
  },
  'Earworm': {
    effects: [{type:'display_note', text:'10분간 작곡 캔트립을 아군 머릿속에 심어 나중에 자유 행동으로 활성화'}]
  },
  'Soothing Ballad': {
    effects: [{type:'grant_focus_spell', spell:'위로의 발라드'}, {type:'display_note', text:'집중 주문: 위로의 발라드 습득. 아군 치유. 집중 포인트 풀 +1 (최대 3)'}]
  },
  'Triumphant Inspiration': {
    effects: [{type:'display_note', text:'[자유행동] 적 쓰러뜨릴 때 1행동 작곡 캔트립 즉시 시전'}]
  },
  'True Hypercognition': {
    effects: [{type:'display_note', text:'[1행동] 즉시 최대 5회 지식 회상 사용'}]
  },
  'Vigorous Anthem': {
    effects: [{type:'display_note', text:'[주문변형] 용감한 찬가 시전 시 아군 전원에 3+매력 수정치 임시 HP (1분)'}]
  },

  // ── 16레벨 ──
  'Courageous Onslaught': {
    effects: [{type:'display_note', text:'[주문변형] 용감한 찬가 시전 시 아군 1명이 반응으로 보폭 후 근접 타격'}]
  },
  // 'Effortless Concentration' — 공유 재주, 드루이드 섹션에 정의됨
  'Resounding Finale': {
    effects: [{type:'display_note', text:'[반응] 음파 피해 수신 시 작곡 종료하여 아군에 음파 저항 (랭크 x 2)'}]
  },
  'Studious Capacity': {
    effects: [{type:'display_note', text:'하루 1회 추가 주문 시전 가능 (최고 랭크 제외)'}]
  },

  // ── 18레벨 ──
  'All in my Head': {
    effects: [{type:'display_note', text:'[반응] 피해를 정신 피해(비치명)로 변환. 정신 면역 시 사용 불가'}]
  },
  'Deep Lore': {
    effects: [{type:'display_note', text:'시전 가능한 각 주문 랭크에 레퍼토리 주문 1개 추가'}]
  },
  'Discordant Voice': {
    effects: [{type:'display_note', text:'용감한 찬가 영향 중 아군의 무기/비무장 공격에 추가 1d6 음파 피해'}]
  },
  'Eternal Composition': {
    effects: [{type:'display_note', text:'영구 가속(quickened) 상태 — 추가 행동은 1행동 작곡 캔트립에만 사용'}]
  },
  'Impossible Polymath': {
    effects: [{type:'display_note', text:'주문학→비전, 자연학→원시, 종교학→신성 주문을 주문서에 추가 가능'}]
  },

  // ── 20레벨 ──
  'Fatal Aria': {
    effects: [{type:'grant_focus_spell', spell:'치명적 아리아'}, {type:'display_note', text:'집중 주문: 치명적 아리아 습득. 즉사 효과. 집중 포인트 풀 +1 (최대 3)'}]
  },
  'Perfect Encore': {
    effects: [{type:'spell_slots', rank:10, value:1}]
  },
  'Pied Piping': {
    effects: [{type:'grant_focus_spell', spell:'피리 부는 사나이'}, {type:'display_note', text:'집중 주문: 피리 부는 사나이 습득. 의지 약한 생물 지배. 집중 포인트 풀 +1 (최대 3)'}]
  },
  'Symphony of the Muse': {
    effects: [{type:'display_note', text:'턴당 작곡 1개 제한 해제. 새 작곡 시전해도 이전 작곡 유지'}]
  },
  'Ultimate Polymath': {
    effects: [{type:'display_note', text:'레퍼토리의 모든 주문이 시그니처 주문'}]
  },

  // ═══════════════════════════════════════
  //  클레릭 클래스 재주 (Cleric Class Feats)
  // ═══════════════════════════════════════

  // ── 1레벨 ──
  'Deadly Simplicity': {
    effects: [{type:'display_note', text:'신격 선호 무기(d6 이하 단순/비무장)의 피해 주사위 한 단계 증가'}]
  },
  'Divine Castigation': {
    effects: [{type:'display_note', text:'해로움/치유로 반대 특성 생물에 추가 영혼 피해 (= 주문 랭크)'}]
  },
  'Domain Initiate': {
    choice: {
      type:'custom', label:'영역을 선택하세요', repeatable:true,
      options:[
        {id:'air', name:'공기'}, {id:'ambition', name:'야망'}, {id:'change', name:'변화'}, {id:'cities', name:'도시'},
        {id:'cold', name:'냉기'}, {id:'confidence', name:'자신감'}, {id:'creation', name:'창조'},
        {id:'darkness', name:'어둠'}, {id:'death', name:'죽음'}, {id:'decay', name:'부패'},
        {id:'delirium', name:'망상'}, {id:'destruction', name:'파괴'}, {id:'dreams', name:'꿈'},
        {id:'dust', name:'먼지'}, {id:'duty', name:'의무'}, {id:'earth', name:'대지'},
        {id:'family', name:'가족'}, {id:'fate', name:'운명'}, {id:'fire', name:'화염'},
        {id:'freedom', name:'자유'}, {id:'glyph', name:'문양'}, {id:'healing', name:'치유'},
        {id:'indulgence', name:'탐닉'}, {id:'knowledge', name:'지식'}, {id:'lightning', name:'번개'},
        {id:'luck', name:'행운'}, {id:'magic', name:'마법'}, {id:'might', name:'힘'},
        {id:'moon', name:'달'}, {id:'nature', name:'자연'}, {id:'nightmares', name:'악몽'},
        {id:'pain', name:'고통'}, {id:'passion', name:'열정'}, {id:'perfection', name:'완벽'},
        {id:'plague', name:'역병'}, {id:'protection', name:'보호'}, {id:'repose', name:'안식'},
        {id:'secrecy', name:'비밀'}, {id:'sorrow', name:'슬픔'}, {id:'soul', name:'영혼'},
        {id:'star', name:'별'}, {id:'sun', name:'태양'}, {id:'swarm', name:'떼'},
        {id:'time', name:'시간'}, {id:'travel', name:'여행'}, {id:'trickery', name:'속임수'},
        {id:'truth', name:'진실'}, {id:'tyranny', name:'폭정'}, {id:'undeath', name:'언데스'},
        {id:'vigil', name:'경계'}, {id:'void', name:'공허'}, {id:'war', name:'전쟁'},
        {id:'water', name:'물'}, {id:'wealth', name:'부'}, {id:'wyrmkin', name:'용족'},
        {id:'zeal', name:'열의'},
      ]
    },
    effects: [{type:'grant_focus_spell', spell:'$domain_initial'}, {type:'display_note', text:'집중 주문: $choice_name 영역 초기 주문 습득. 집중 포인트 풀 +1 (최대 3)'}]
  },
  'Harming Hands': {
    effects: [{type:'display_note', text:'해로움 시전 시 d8 → d10'}]
  },
  'Healing Hands': {
    effects: [{type:'display_note', text:'치유 시전 시 d8 → d10'}]
  },
  'Premonition of Avoidance': {
    effects: [{type:'display_note', text:'[반응] 위험에 대한 내성 굴림에 +2 상황 보너스'}]
  },
  // 'Reach Spell' — 공유 재주, 위치 섹션에 정의됨

  // ── 2레벨 ──
  // 'Cantrip Expansion' — 바드 섹션에 정의됨
  'Communal Healing': {
    effects: [{type:'display_note', text:'단일 대상 치유 시전 시 사거리 내 다른 생물에게 주문 랭크만큼 HP 회복'}]
  },
  'Emblazon Armament': {
    effects: [{type:'display_note', text:'무기/방패에 신격 상징 각인 (10분). 무기: +1 피해. 방패: +1 경도'}]
  },
  'Panic the Dead': {
    effects: [{type:'display_note', text:'치유로 언데드에 피해 시 내성 실패 → 공포 1. 대실패 → 도주 추가'}]
  },
  'Rapid Response': {
    effects: [{type:'display_note', text:'[반응] 아군 HP 0 시 아군 방향으로 보폭 (이동 속도 +10피트)'}]
  },
  'Sap Life': {
    effects: [{type:'display_note', text:'해로움으로 살아있는 생물에 피해 시 주문 랭크만큼 HP 회복'}]
  },
  'Versatile Font': {
    effects: [{type:'display_note', text:'원천 슬롯에 해로움/치유 어느 쪽이든 준비 가능'}]
  },
  "Warpriest's Armor": {
    effects: [{type:'proficiency', target:'armor-medium', rank:2}, {type:'display_note', text:'평갑 숙련. 전문가 이상 획득 시 평갑에도 적용. 2부피+ 갑옷 부피 1 감소'}]
  },

  // ── 4레벨 ──
  'Channel Smite': {
    effects: [{type:'display_note', text:'[2행동] 해로움/치유 소비하여 근접 타격에 추가. 명중 시 자동 내성 실패'}]
  },
  'Directed Channel': {
    effects: [{type:'display_note', text:'영역 해로움/치유를 30피트 방사 대신 60피트 원뿔로 변경 가능'}]
  },
  'Divine Infusion': {
    effects: [{type:'display_note', text:'[주문변형] HP 회복 해로움/치유 시전 시 대상 근접 공격에 추가 1d6 공허/활력 피해 (5랭크 2d6, 8랭크 3d6)'}]
  },
  'Raise Symbol': {
    effects: [{type:'display_note', text:'[1행동] 종교 상징 제시 → 내성 +2 상황 보너스. 활력/공허 효과 내성 성공→대성공'}]
  },
  'Restorative Strike': {
    effects: [{type:'display_note', text:'[2행동] 해로움/치유로 자신 치유 + 근접 타격. 선호 무기 시 공격 +1. 인접 아군에 치유 전달 가능'}]
  },
  'Sacred Ground': {
    effects: [{type:'display_note', text:'1분 기도로 30피트 내 신성 영역 생성 (10분). 영역 내 10분 체류 시 레벨만큼 HP 회복'}]
  },

  // ── 6레벨 ──
  'Cast Down': {
    effects: [{type:'display_note', text:'[주문변형] 단일 대상 해로움/치유로 피해 시 대상 엎드림. 대실패 시 이동 속도 -10피트'}]
  },
  'Divine Rebuttal': {
    effects: [{type:'display_note', text:'[반응] 인접 생물의 마법에 대한 아군 내성 직전, 선호 무기로 타격. 명중 시 내성 +2 (치명타 +3)'}]
  },
  'Divine Weapon': {
    effects: [{type:'display_note', text:'[자유행동] 신성 주문 시전 완료 시 턴 종료까지 무기에 추가 1d4 영혼 피해 (반대 특성 2d4)'}]
  },
  'Magic Hands': {
    effects: [{type:'display_note', text:'상처 치료 시 d8→d10. 치유에 레벨만큼 상태 보너스'}]
  },
  'Selective Energy': {
    effects: [{type:'display_note', text:'영역 해로움/치유 시전 시 영역 내 최대 5명 제외 가능'}]
  },
  // 'Steady Spellcasting' — 공유 재주, 위치 섹션에 정의됨

  // ── 8레벨 ──
  'Advanced Domain': {
    choice: {
      type:'custom', label:'고급 영역을 선택하세요', repeatable:true, filterByInitiated:true,
      options:[
        {id:'air', name:'공기'}, {id:'ambition', name:'야망'}, {id:'change', name:'변화'}, {id:'cities', name:'도시'},
        {id:'cold', name:'냉기'}, {id:'confidence', name:'자신감'}, {id:'creation', name:'창조'},
        {id:'darkness', name:'어둠'}, {id:'death', name:'죽음'}, {id:'decay', name:'부패'},
        {id:'delirium', name:'망상'}, {id:'destruction', name:'파괴'}, {id:'dreams', name:'꿈'},
        {id:'dust', name:'먼지'}, {id:'duty', name:'의무'}, {id:'earth', name:'대지'},
        {id:'family', name:'가족'}, {id:'fate', name:'운명'}, {id:'fire', name:'화염'},
        {id:'freedom', name:'자유'}, {id:'glyph', name:'문양'}, {id:'healing', name:'치유'},
        {id:'indulgence', name:'탐닉'}, {id:'knowledge', name:'지식'}, {id:'lightning', name:'번개'},
        {id:'luck', name:'행운'}, {id:'magic', name:'마법'}, {id:'might', name:'힘'},
        {id:'moon', name:'달'}, {id:'nature', name:'자연'}, {id:'nightmares', name:'악몽'},
        {id:'pain', name:'고통'}, {id:'passion', name:'열정'}, {id:'perfection', name:'완벽'},
        {id:'plague', name:'역병'}, {id:'protection', name:'보호'}, {id:'repose', name:'안식'},
        {id:'secrecy', name:'비밀'}, {id:'sorrow', name:'슬픔'}, {id:'soul', name:'영혼'},
        {id:'star', name:'별'}, {id:'sun', name:'태양'}, {id:'swarm', name:'떼'},
        {id:'time', name:'시간'}, {id:'travel', name:'여행'}, {id:'trickery', name:'속임수'},
        {id:'truth', name:'진실'}, {id:'tyranny', name:'폭정'}, {id:'undeath', name:'언데스'},
        {id:'vigil', name:'경계'}, {id:'void', name:'공허'}, {id:'war', name:'전쟁'},
        {id:'water', name:'물'}, {id:'wealth', name:'부'}, {id:'wyrmkin', name:'용족'},
        {id:'zeal', name:'열의'},
      ]
    },
    effects: [{type:'grant_focus_spell', spell:'$domain_advanced'}, {type:'display_note', text:'고급 영역 주문: $choice_name 습득'}]
  },
  'Cremate Undead': {
    effects: [{type:'display_note', text:'치유로 언데드 피해 시 주문 랭크만큼 지속 화염 피해 추가'}]
  },
  'Emblazon Energy': {
    choice: {
      type:'custom', label:'에너지 유형을 선택하세요',
      options:[
        {id:'acid', name:'산성'}, {id:'cold', name:'냉기'}, {id:'electricity', name:'전기'},
        {id:'fire', name:'화염'}, {id:'sonic', name:'음파'},
      ]
    },
    effects: [{type:'display_note', text:'각인에 $choice_name 에너지 부여. 방패: 해당 유형 저항(레벨 절반) + 방패 막기'}]
  },
  'Martyr': {
    effects: [{type:'display_note', text:'[주문변형] 단일 아군 HP 회복 시 랭크당 1d8 HP 잃고 아군에 같은 양 추가 회복'}]
  },
  'Restorative Channel': {
    effects: [{type:'display_note', text:'치유 원천 슬롯을 희생하여 고통 정화/맑은 마음/건강한 몸/확실한 발놀림 시전'}]
  },
  'Sanctify Armament': {
    effects: [{type:'display_note', text:'[1행동] 무기에 1라운드 신성/불경 특성 부여. 반대 특성 생물에 추가 2d6 영혼 피해'}]
  },
  'Surging Focus': {
    effects: [{type:'display_note', text:'[반응] 하루 1회. 아군 HP 0 시 집중 포인트 1점 즉시 회복'}]
  },
  'Void Siphon': {
    effects: [{type:'display_note', text:'해로움에 살아있는 생물이 대실패 시 소진(drained) 1'}]
  },
  'Zealous Rush': {
    effects: [{type:'display_note', text:'[자유행동] 자기 대상 신성 주문 시전 시 10피트 보폭 (2행동+ 주문이면 전체 속도)'}]
  },

  // ── 10레벨 ──
  'Castigating Weapon': {
    effects: [{type:'display_note', text:'신성 응징 후 턴 종료까지 무기에 신성/불경 특성 + 추가 영혼 피해 (랭크만큼)'}]
  },
  'Heroic Recovery': {
    effects: [{type:'display_note', text:'[주문변형] 단일 대상 치유로 HP 회복 시: 이동 +5피트, 공격 +1, 피해 +1. 엎드림 즉시 해제'}]
  },
  'Replenishment of War': {
    effects: [{type:'display_note', text:'선호 무기로 피해 시 레벨 절반 임시 HP (치명타 시 레벨). 다음 턴까지 지속'}]
  },
  'Shared Avoidance': {
    effects: [{type:'display_note', text:'회피 예감 사용 시 20피트 내 같은 위험의 아군에게도 +2 상황 보너스'}]
  },
  'Shield of Faith': {
    effects: [{type:'display_note', text:'영역 주문 시전 시 다음 턴까지 AC +1 상태 보너스'}]
  },

  // ── 12레벨 ──
  'Defensive Recovery': {
    effects: [{type:'display_note', text:'[주문변형] 단일 대상 해로움/치유로 HP 회복 시 1라운드 AC/내성 +2 상태 보너스'}]
  },
  'Domain Focus': {
    effects: [{type:'display_note', text:'재집중 시 집중 풀 완전 회복'}]
  },
  'Emblazon Antimagic': {
    effects: [{type:'display_note', text:'각인 무기: 타격 시 대상 주문 해제 시도. 각인 방패: 주문 피해에 방패 막기 사용 가능'}]
  },
  'Fortunate Relief': {
    effects: [{type:'display_note', text:'치유 주문으로 상태 상쇄 시 판정을 두 번 굴리고 높은 결과 사용'}]
  },
  'Sapping Symbol': {
    effects: [{type:'display_note', text:'[반응] 상징 올린 상태에서 근접 피해 시 종교 판정 → 공격자 기력상실 1/2'}]
  },
  'Shared Replenishment': {
    effects: [{type:'display_note', text:'전쟁의 보충 임시 HP를 자신 대신 10피트 내 아군에게 부여 가능'}]
  },

  // ── 14레벨 ──
  'Channeling Block': {
    effects: [{type:'display_note', text:'방패 막기 시 해로움/치유 소비 → 랭크당 1d8만큼 방패 경도 증가'}]
  },
  "Deity's Protection": {
    effects: [{type:'display_note', text:'영역 주문 시전 후 다음 턴까지 모든 피해 저항 (영역 주문 랭크만큼)'}]
  },
  'Ebb and Flow': {
    effects: [{type:'display_note', text:'[주문변형] 1-2행동 치유/해로움으로 적 1명 피해 + 아군 1명 치유 동시 가능'}]
  },
  'Fast Channel': {
    effects: [{type:'display_note', text:'2행동으로 해로움/치유 시전 시 3행동 버전 효과 적용'}]
  },
  'Lasting Armament': {
    effects: [{type:'display_note', text:'무장 성별화 지속 1라운드 → 1시간'}]
  },
  'Premonition of Clarity': {
    effects: [{type:'display_note', text:'[반응] 시간 1회. 정신 효과 내성 실패 시 +2로 다시 굴림'}]
  },
  'Swift Banishment': {
    effects: [{type:'display_note', text:'[반응] 타차원 생물 치명타 시 준비된 추방 소비하여 즉시 적용'}]
  },

  // ── 16레벨 ──
  'Eternal Bane': {
    effects: [{type:'display_note', text:'영구 15피트 저주(bane) 영역 (랭크 = 레벨/2). 해산 가능, 1분 후 복귀'}]
  },
  'Eternal Blessing': {
    effects: [{type:'display_note', text:'영구 15피트 축복(bless) 영역. 해산 가능, 1분 후 복귀'}]
  },
  'Rebounding Smite': {
    effects: [{type:'display_note', text:'[반응] 채널 강타 빗나감 시 해로움/치유 1행동 버전을 다른 생물에 시전'}]
  },
  'Remediate': {
    effects: [{type:'display_note', text:'[주문변형] 시간 1회. 3행동 원천 해로움/치유 시전 시 영역 내 신성 효과 1개 상쇄 시도'}]
  },
  'Resurrectionist': {
    effects: [{type:'display_note', text:'빈사/사망 생물 HP 회복 시 1분간 빠른 치유 5 부여'}]
  },

  // ── 18레벨 ──
  'Divine Apex': {
    effects: [{type:'display_note', text:'일일 준비 시 아이템에 정점 특성 부여. 신성 속성 수정치 +1 또는 +4'}]
  },
  'Echoing Channel': {
    effects: [{type:'display_note', text:'[주문변형] 2행동 해로움/치유로 단일 대상 시 추가 1명에 1행동 버전 적용 (슬롯 불필요)'}]
  },
  'Improved Swift Banishment': {
    effects: [{type:'display_note', text:'추방 미준비 시에도 5랭크+ 슬롯 희생으로 사용 가능. 대상 내성 -2'}]
  },
  'Inviolable': {
    effects: [{type:'display_note', text:'공격으로 명중하는 생물에게 매번 3d6 영혼 피해'}]
  },
  'Miraculous Possibility': {
    effects: [{type:'display_note', text:'일일 준비 시 슬롯 1개를 비워두고, 신성 주문 중 2랭크+ 낮은 주문을 즉석 시전'}]
  },
  'Shared Clarity': {
    effects: [{type:'display_note', text:'명확함의 예감 사용 시 15피트 내 같은 효과 실패 아군도 +2로 다시 굴림'}]
  },

  // ── 20레벨 ──
  "Avatar's Audience": {
    effects: [{type:'display_note', text:'교감 의식 자동 대성공. 하루 1회 신격 영역으로 차원간 순간이동'}]
  },
  "Avatar's Protection": {
    effects: [{type:'display_note', text:'[반응] 치명타 수신 시 아바타 즉시 시전. 치명타→일반 명중으로 감소 + 임시 HP'}]
  },
  'Maker of Miracles': {
    effects: [{type:'spell_slots', rank:10, value:1}]
  },
  'Spellshape Channel': {
    effects: [{type:'display_note', text:'해로움/치유에 적용 가능한 1행동 주문변형을 자유 행동으로 사용'}]
  },

  // ═══════════════════════════════════════
  //  드루이드 클래스 재주 (Druid Class Feats)
  // ═══════════════════════════════════════

  'Animal Companion': {
    effects: [{type:'display_note', text:'동물 동료 획득. 동물 명령 시 2행동 부여'}]
  },
  'Animal Empathy': {
    effects: [{type:'display_note', text:'동물에게 외교로 인상 만들기/요청 가능'}]
  },
  // 'Leshy Familiar' — 이미 혈통 섹션에 존재
  'Plant Empathy': {
    effects: [{type:'display_note', text:'식물과 균류에게 외교 사용 가능'}]
  },
  // 'Reach Spell' — 이미 위치 섹션에 존재
  'Storm Born': {
    effects: [{type:'display_note', text:'날씨로 인한 원거리 주문/지각 상황 페널티 무시. 날씨 은폐 단순 판정 불필요'}]
  },
  'Verdant Weapon': {
    effects: [{type:'display_note', text:'10분간 씨앗에 무기 각인. 상호작용으로 즉시 무기로 성장/복귀'}]
  },
  'Untamed Form': {
    effects: [{type:'display_note', text:'집중 주문: 야생 형태(untamed form) 습득. 다양한 형태로 변신'}]
  },
  'Widen Spell': {
    effects: [{type:'display_note', text:'[1행동] 다음 주문의 폭발/원뿔/직선 영역 5~10피트 확장'}]
  },
  'Call of the Wild': {
    effects: [{type:'display_note', text:'10분 교감으로 준비 주문을 동물 소환/식물 소환으로 교체'}]
  },
  'Enhanced Familiar': {
    effects: [{type:'familiar_abilities', value:4}]
  },
  'Order Explorer': {
    effects: [{type:'display_note', text:'다른 결사 선택, 해당 결사 1레벨 재주 1개 획득. 반복 선택 가능'}]
  },
  'Poison Resistance': {
    effects: [{type:'resistance', damage_type:'poison', value:'half_level'}, {type:'save_bonus', save:'fort', value:1, bonus_type:'status', condition:'독 효과'}]
  },
  'Anthropomorphic Shape': {
    effects: [{type:'display_note', text:'인간형 형태를 야생 형태 목록에 추가'}]
  },
  'Elemental Summons': {
    effects: [{type:'display_note', text:'10분 교감으로 준비 주문을 원소 소환으로 교체'}]
  },
  'Forest Passage': {
    effects: [{type:'display_note', text:'식물/균류로 인한 험지 무시'}]
  },
  'Form Control': {
    effects: [{type:'display_note', text:'[1행동] 야생 형태 랭크 -2 대신 지속 시간 최대 1시간으로 연장'}]
  },
  'Leshy Familiar Secrets': {
    effects: [{type:'display_note', text:'매일 추가 사역마 능력 1개 선택 (움켜잡는 덩굴/공기 정화/녹색 폭발)'}]
  },
  'Mature Animal Companion': {
    effects: [{type:'display_note', text:'동물 동료 성장: 성숙. 동물 명령 없이 턴에 보폭/타격 1행동 독립 사용'}]
  },
  'Order Magic': {
    effects: [{type:'display_note', text:'집중 주문: 선택한 결사의 초기 결사 주문 습득. 반복 선택 가능'}]
  },
  'Snowdrift Spell': {
    effects: [{type:'display_note', text:'[1행동] 공기/물/냉기 주문 시 대상 주변에 눈 → 다음 턴까지 험지'}]
  },
  'Current Spell': {
    effects: [{type:'display_note', text:'[1행동] 공기/물 주문 시 AC +1 상황 보너스 (원거리 +2), 내성 +1'}]
  },
  'Grown of Oak': {
    effects: [{type:'display_note', text:'참나무 회복력을 원시 선천 주문으로 자유 시전 가능 (자신+레시 사역마)'}]
  },
  'Insect Shape': {
    effects: [{type:'display_note', text:'곤충 형태를 야생 형태 목록에 추가. 비비행 곤충 시 24시간 지속'}]
  },
  'Instinctive Support': {
    effects: [{type:'display_note', text:'[반응] 동료 대상 주문 시전 후, 동료가 행동 획득 (하나는 지원)'}]
  },
  // 'Steady Spellcasting' — 이미 위치 섹션에 존재
  'Storm Retribution': {
    effects: [{type:'display_note', text:'[반응] 인접 적의 근접 치명타 시 폭풍 급습 시전. 실패 시 5피트 밀어냄'}]
  },
  'Deimatic Display': {
    effects: [{type:'display_note', text:'15피트 원뿔 내 동물/균류/식물에게 사기 꺾기. 시각 특성, 언어 페널티 없음'}]
  },
  'Ferocious Shape': {
    effects: [{type:'display_note', text:'공룡 형태를 야생 형태 목록에 추가. 운동 부여 형태 시 +1 상태 보너스'}]
  },
  'Fey Caller': {
    effects: [{type:'display_note', text:'주문 목록에 환영 변장/환영 물체/환영 장면 추가 (원시 주문)'}]
  },
  'Floral Restoration': {
    effects: [{type:'display_note', text:'하루 1회. 근처 식물에서 집중 포인트 1점 + 4d8 HP 회복 (2레벨마다 +1d8)'}]
  },
  'Incredible Companion': {
    effects: [{type:'display_note', text:'동물 동료 성장: 민첩(민첩+2, 피해+2) 또는 야만(힘+2, 피해+3). 마법 공격'}]
  },
  'Raise Menhir': {
    effects: [{type:'display_note', text:'시간당 1회. 30피트 내 선돌/수호수 세움. 15피트 내 비전/신성/오컬트 내성 +2 상태 보너스'}]
  },
  'Soaring Shape': {
    effects: [{type:'display_note', text:'공중 형태(박쥐/새)를 야생 형태 목록에 추가. 곡예 부여 형태 시 +1 상태 보너스'}]
  },
  'Wind Caller': {
    effects: [{type:'display_note', text:'집중 주문: 폭풍바람 비행(stormwind flight) 습득'}]
  },
  'Elemental Shape': {
    effects: [{type:'display_note', text:'원소 형태를 야생 형태 목록에 추가. 변신 중 화염 저항 5'}]
  },
  'Healing Transformation': {
    effects: [{type:'display_note', text:'[1행동] 단일 대상 변신 주문 시 주문 랭크당 1d6 HP 회복'}]
  },
  // 'Overwhelming Energy' — 이미 위저드 섹션에 존재
  'Plant Shape': {
    effects: [{type:'display_note', text:'식물 형태를 야생 형태 목록에 추가. 변신 중 독 저항 5'}]
  },
  'Primal Howl': {
    effects: [{type:'display_note', text:'동료의 원시 울음: 30피트 원뿔 음파 피해 (레벨 2당 1d6). 실패=공포 1, 대실패=공포 2'}]
  },
  'Pristine Weapon': {
    effects: [{type:'display_note', text:'푸른 무기가 냉철+은으로 취급. 약점 생물 치명타 시 1d4 지속 출혈'}]
  },
  'Side by Side': {
    effects: [{type:'display_note', text:'동료와 같은 적에 인접 시 위치 무관하게 측면 공격'}]
  },
  'Thunderclap Spell': {
    effects: [{type:'display_note', text:'[1행동] 전기 주문 시 반사 실패한 생물 1라운드 청각 상실, 대실패 시 엎드림'}]
  },
  'Dragon Shape': {
    effects: [{type:'display_note', text:'용 형태를 야생 형태 목록에 추가. 변신 중 에너지 저항 5 (선택)'}]
  },
  'Garland Spell': {
    effects: [{type:'display_note', text:'[1행동] 균류/식물 주문 시 10피트 폭발에 가시 덩굴 → 험지+위험 지형 (2d6 피해)'}]
  },
  'Primal Focus': {
    effects: [{type:'display_note', text:'재집중 시 집중 풀 완전 회복'}]
  },
  'Primal Summons': {
    effects: [{type:'display_note', text:'집중 주문: 원시 소환 습득. 소환 생물에 원소 힘 부여'}]
  },
  'Wandering Oasis': {
    effects: [{type:'display_note', text:'60피트 내 아군 포함 극심한 환경 열/추위 보호. 생존 전설이면 극단적까지'}]
  },
  'Reactive Transformation': {
    effects: [{type:'display_note', text:'[반응] 위험 시 적절한 형태로 야생 형태 자동 시전 (추락→비행, 피해→저항)'}]
  },
  'Sow Spell': {
    effects: [{type:'display_note', text:'[1행동] 주문을 인접 칸에 심어 10분 내 반응으로 발동 (진입 시 유발)'}]
  },
  'Specialized Companion': {
    effects: [{type:'display_note', text:'동물 동료 성장: 전문화 1개. 비무장 전문가, 내성/감지 달인. 최대 3회'}]
  },
  'Timeless Nature': {
    effects: [{type:'save_bonus', save:'all', value:2, bonus_type:'status', condition:'질병/원시 마법'}, {type:'display_note', text:'노화 정지. 질병/원시 마법 내성 +2 상태 보너스'}]
  },
  'Verdant Metamorphosis': {
    effects: [{type:'display_note', text:'식물 특성 획득. 녹색 휴식으로 나무 변신 (AC 30). 햇빛 10분 쉬면 HP 절반 회복'}]
  },
  'Effortless Concentration': {
    effects: [{type:'display_note', text:'[자유] 턴 시작 시 유지 주문 1개 자동 연장'}]
  },
  'Impaling Briars': {
    effects: [{type:'display_note', text:'집중 주문: 꿰뚫는 가시(impaling briars) 습득'}]
  },
  'Monstrosity Shape': {
    effects: [{type:'display_note', text:'괴물 형태(동굴벌레/바다뱀)를 야생 형태 목록에 추가. 비상 형태 시 불사조도'}]
  },
  'Uplifting Winds': {
    effects: [{type:'display_note', text:'비행 중 공기/전기 주문 시전 시 비행 속도 +10 상태 보너스, 즉시 절반 속도 비행'}]
  },
  'Invoke Disaster': {
    effects: [{type:'display_note', text:'집중 주문: 폭풍 군주(storm lord) 습득'}]
  },
  'Perfect Form Control': {
    effects: [{type:'display_note', text:'형태 제어 사용 시 야생 형태 지속 시간 무제한 (해산 가능)'}]
  },
  'Primal Aegis': {
    effects: [{type:'display_note', text:'30피트 내 아군 포함 산성/냉기/전기/화염/활력/공허 피해에 지혜 수정치 저항'}]
  },
  "Hierophant's Power": {
    effects: [{type:'spell_slots', rank:10, value:1}, {type:'display_note', text:'추가 10랭크 주문 슬롯 획득'}]
  },
  'Ley Line Conduit': {
    effects: [{type:'display_note', text:'[1행동] 분당 1회. 5랭크 이하 지속 없는 주문을 슬롯 소비 없이 시전'}]
  },
  'True Shapeshifter': {
    effects: [{type:'display_note', text:'하루 1회 자연 화신 시전 (미준비 가능). 야생 형태 중 2행동으로 다른 형태 전환'}]
  },

  // ═══════════════════════════════════════
  //  레인저 클래스 재주 (Ranger Class Feats)
  // ═══════════════════════════════════════

  // 'Animal Companion' — 이미 드루이드 섹션에 존재
  'Crossbow Ace': {
    effects: [{type:'display_note', text:'사냥감 추적 후 석궁 타격 시 추가 피해 2 (반복 석궁 +1). 재장전 시간 -1'}]
  },
  'Hunted Shot': {
    effects: [{type:'display_note', text:'[1행동] 재장전 0 원거리 무기로 사냥감에 2회 타격 (첫 사거리 증분 내)'}]
  },
  'Initiate Warden': {
    effects: [{type:'display_note', text:'집중 주문: 입문 관리인 주문 1개 습득. 집중 풀 1점'}]
  },
  'Monster Hunter': {
    effects: [{type:'display_note', text:'사냥감 지식 회상 성공 시 아군 포함 약점/저항 공유. 대성공 시 내성/공격 +1 상황 보너스'}]
  },
  'Twin Takedown': {
    effects: [{type:'display_note', text:'[1행동] 양손 근접 무기로 사냥감에 각 1회씩 타격'}]
  },
  // 'Animal Empathy' — 이미 드루이드 섹션에 존재
  'Favored Terrain': {
    choice: {
      type:'custom', label:'선호 지형을 선택하세요',
      options:[
        {id:'aquatic', name:'수중'}, {id:'arctic', name:'극지'}, {id:'desert', name:'사막'},
        {id:'forest', name:'숲'}, {id:'mountain', name:'산'}, {id:'plains', name:'평원'},
        {id:'sky', name:'하늘'}, {id:'swamp', name:'늪'}, {id:'underground', name:'지하'},
      ]
    },
    effects: [{type:'display_note', text:'선호 지형($choice_name): 해당 지형에서 비마법 험지 무시'}]
  },
  "Hunter's Aim": {
    effects: [{type:'display_note', text:'[2행동] 사냥감에 원거리 타격 +2 상황 보너스. 은폐/하위 엄폐 무시'}]
  },
  'Monster Warden': {
    effects: [{type:'display_note', text:'괴물 사냥꾼 보너스 시 아군 내성 +1 상황 보너스, AC +1 상황 보너스 추가'}]
  },
  'Quick Draw': {
    effects: [{type:'display_note', text:'[1행동] 무기 뽑기 + 즉시 타격'}]
  },
  'Advanced Warden': {
    effects: [{type:'display_note', text:'집중 주문: 고급 관리인 주문 1개 습득. 반복 선택 가능'}]
  },
  "Companion's Cry": {
    effects: [{type:'display_note', text:'동물 명령에 2행동 소비 시 동료가 추가 행동 1개 획득'}]
  },
  'Disrupt Prey': {
    effects: [{type:'display_note', text:'[반응] 도달 내 사냥감의 조작/이동 시 근접 타격. 치명타 시 행동 방해'}]
  },
  'Far Shot': {
    effects: [{type:'display_note', text:'무기 사거리 증분 2배'}]
  },
  'Favored Prey': {
    choice: {
      type:'custom', label:'선호 사냥감을 선택하세요',
      options:[
        {id:'animal', name:'동물'}, {id:'beast', name:'야수'}, {id:'dragon', name:'용'},
        {id:'plant-fungus', name:'균류 + 식물'},
      ]
    },
    effects: [{type:'display_note', text:'선호 사냥감($choice_name): 주도권 시 해당 적 보이면 자유 행동으로 사냥감 추적'}]
  },
  'Running Reload': {
    effects: [{type:'display_note', text:'[1행동] 보폭/한 걸음/잠행 후 상호작용으로 재장전'}]
  },
  "Scout's Warning": {
    effects: [{type:'display_note', text:'[자유] 주도권 굴림 직전 아군 모두 주도권 +1 상황 보너스'}]
  },
  'Twin Parry': {
    effects: [{type:'ac_bonus', value:1, bonus_type:'circumstance', condition:'양손 근접 무기'}, {type:'display_note', text:'[1행동] 양손 근접 무기로 AC +1 상황 보너스 (방어 특성 +2). 다음 턴까지'}]
  },
  'Additional Recollection': {
    effects: [{type:'display_note', text:'[반응] 사냥감 지식 회상 성공 시 다른 보이는 생물에 추가 지식 회상'}]
  },
  'Masterful Warden': {
    effects: [{type:'display_note', text:'집중 주문: 달인 관리인 주문 1개 습득. 반복 선택 가능'}]
  },
  // 'Mature Animal Companion' — 이미 드루이드 섹션에 존재
  'Skirmish Strike': {
    effects: [{type:'display_note', text:'[1행동] 비틀거림 후 타격, 또는 타격 후 비틀거림'}]
  },
  'Snap Shot': {
    effects: [{type:'display_note', text:'근접 반응 대신 원거리 무기 타격 가능 (인접 대상). 도달 5피트 취급'}]
  },
  'Swift Tracker': {
    effects: [{type:'display_note', text:'추적 중 전체 속도 이동. 달인=매시간 판정 불필요. 전설=다른 탐험 활동 병행'}]
  },
  'Blind-Fight': {
    effects: [{type:'display_note', text:'은폐 단순 판정 불필요. 숨겨진 적에게 무방비 아님. 인접 미탐지→숨겨진'}]
  },
  'Deadly Aim': {
    effects: [{type:'display_note', text:'[2행동] 원거리 타격 -2 페널티, 피해 +4 상황 보너스 (11레벨 +6, 15레벨 +8)'}]
  },
  'Hazard Finder': {
    effects: [{type:'display_note', text:'함정/위험 탐지 +1 상황 보너스. 공격 AC/내성에도 +1. 수색 없이 탐지 가능'}]
  },
  'Terrain Master': {
    effects: [{type:'display_note', text:'1시간 연습으로 현재 지형을 선호 지형으로 임시 교체'}]
  },
  "Warden's Boon": {
    effects: [{type:'display_note', text:'[1행동] 아군에게 사냥감 추적/기질 혜택을 다음 턴 종료까지 부여'}]
  },
  'Camouflage': {
    effects: [{type:'display_note', text:'자연 지형에서 엄폐/은폐 없이 숨기+잠행 가능'}]
  },
  // 'Incredible Companion' — 이미 드루이드 섹션에 존재
  'Master Monster Hunter': {
    effects: [{type:'display_note', text:'자연학으로 모든 생물 지식 회상 가능. 성공 시에도 괴물 사냥꾼 혜택 적용'}]
  },
  'Peerless Warden': {
    effects: [{type:'display_note', text:'집중 주문: 무적 관리인 주문 1개 습득. 반복 선택 가능'}]
  },
  'Penetrating Shot': {
    effects: [{type:'display_note', text:'[2행동] 하위 엄폐 주는 생물과 사냥감 모두에게 단일 원거리 타격 (엄폐 무시)'}]
  },
  'Twin Riposte': {
    effects: [{type:'display_note', text:'[반응] 도달 내 적의 대실패 시 근접 타격 또는 무장 해제. 쌍검 방어 중 필요'}]
  },
  "Warden's Step": {
    effects: [{type:'display_note', text:'자연 지형 탐험 시 주의 회피 중이면 원하는 수의 아군에게도 혜택 부여'}]
  },
  'Distracting Shot': {
    effects: [{type:'display_note', text:'사냥감에 원거리 치명타 또는 동일 턴 2회 명중 시 다음 턴까지 무방비'}]
  },
  'Double Prey': {
    effects: [{type:'display_note', text:'사냥감 추적 시 2명을 사냥감으로 지정 가능'}]
  },
  'Second Sting': {
    effects: [{type:'display_note', text:'[1행동] 양손 근접 무기로 사냥감 타격. 실패 시 다른 무기의 피해(주사위 제외) 적용'}]
  },
  // 'Side by Side' — 이미 드루이드 섹션에 존재
  "Warden's Focus": {
    effects: [{type:'display_note', text:'재집중 시 집중 풀 완전 회복'}]
  },
  'Sense the Unseen': {
    effects: [{type:'display_note', text:'[반응] 탐색 실패 시 미탐지 생물을 자동 감지하여 숨겨진으로'}]
  },
  'Shared Prey': {
    effects: [{type:'display_note', text:'사냥감 1명 지정 시 아군 1명에게도 사냥감 추적 혜택 공유'}]
  },
  'Stealthy Companion': {
    effects: [{type:'display_note', text:'동물 동료도 위장 혜택 획득. 매복형 전문화 시 은신 달인'}]
  },
  "Warden's Guidance": {
    effects: [{type:'display_note', text:'관측 사냥감 탐색 시 아군의 실패/대실패가 성공으로'}]
  },
  'Greater Distracting Shot': {
    effects: [{type:'display_note', text:'원거리 명중만으로 무방비 부여. 치명타/2회 명중 시 다음 턴 종료까지'}]
  },
  'Improved Twin Riposte': {
    effects: [{type:'display_note', text:'턴 시작 시 쌍검 반격 전용 추가 반응 1회. 쌍검 방어 없이도 사용'}]
  },
  'Legendary Monster Hunter': {
    effects: [{type:'display_note', text:'괴물 사냥꾼(+괴물 수호) 보너스 +1 → +2로 증가'}]
  },
  // 'Specialized Companion' — 이미 드루이드 섹션에 존재
  "Warden's Reload": {
    effects: [{type:'display_note', text:'라운드당 1회. 관리인 주문 시전 후 무기 즉시 재장전'}]
  },
  'Impossible Flurry': {
    effects: [{type:'display_note', text:'[3행동] 양손 근접 무기로 각 3회씩 타격 (다중 공격 페널티 적용)'}]
  },
  'Impossible Volley': {
    effects: [{type:'display_note', text:'[3행동] 살포+재장전 0 무기로 10피트 폭발 내 모든 적에 -2 페널티 타격'}]
  },
  'Manifold Edge': {
    effects: [{type:'display_note', text:'사냥감 추적 시 1레벨 기질 대신 다른 기질 혜택 선택 가능'}]
  },
  'Masterful Companion': {
    effects: [{type:'display_note', text:'사냥감 추적 시 동물 동료도 달인 사냥꾼의 강화 기질 혜택 획득'}]
  },
  'Perfect Shot': {
    effects: [{type:'display_note', text:'[3행동] 재장전 1+ 장전된 무기로 사냥감에 최대 피해 타격. 이후 턴 종료'}]
  },
  'Shadow Hunter': {
    effects: [{type:'display_note', text:'자연 지형에서 모든 적에게 항상 은폐 (사냥감 제외)'}]
  },
  'Legendary Shot': {
    effects: [{type:'display_note', text:'원거리 달인 시 사냥감에 최대 5 사거리 증분까지 페널티 무시'}]
  },
  'To the Ends of the Earth': {
    effects: [{type:'display_note', text:'100피트 내 사냥감 추적 시 거리 무관하게 위치 파악. 전설=차원 이동도 추적'}]
  },
  'Triple Threat': {
    effects: [{type:'display_note', text:'사냥감 추적 시 3명 지정 또는 2명+아군 공유 또는 1명+아군 2명 공유'}]
  },
  'Ultimate Skirmisher': {
    effects: [{type:'display_note', text:'모든 험지/상위 험지/위험 지형 무시. 이동 유발 함정/위험도 무시'}]
  },

  // ═══════════════════════════════════════
  //  위치 재주 (Witch Feats)
  // ═══════════════════════════════════════

  // -- 공유 재주 (위치/위저드 공통) --
  'Reach Spell': {
    effects: [{type:'display_note', text:'[1행동] 주문 사거리 30피트 증가 (접촉→30피트)'}]
  },
  'Conceal Spell': {
    effects: [{type:'display_note', text:'[1행동] 다음 주문에 미묘한 특성 부여. 기만 DC로 시전 징후 은닉'}]
  },
  'Steady Spellcasting': {
    effects: [{type:'display_note', text:'반응이 주문시전 방해 시 DC 15 단순 판정 성공하면 방해 안 됨'}]
  },

  // -- 위치 전용 --
  'Cackle': {
    effects: [{type:'display_note', text:'[1행동] 유지 가능한 주술 1개의 지속 시간을 다음 턴 종료까지 연장'}]
  },
  'Cauldron': {
    effects: [{type:'display_note', text:'가마솥으로 포션/기름 양조 가능. 일일 준비 시 소모품 2개 무료 양조'}]
  },
  "Witch's Armaments": {
    effects: [{type:'display_note', text:'경갑 숙련. 군용 무기 1그룹을 단순 무기로 취급'}]
  },
  'Basic Lesson': {
    effects: [{type:'display_note', text:'기본 교훈 1개 습득: 주술 캔트립 1개 + 사역마에 주문 1개 추가'}]
  },
  "Familiar's Language": {
    effects: [{type:'display_note', text:'사역마가 언어 1개를 말할 수 있음. 추가 언어 습득 시 사역마에게도 부여 가능'}]
  },
  'Rites of Convocation': {
    effects: [{type:'display_note', text:'10분 의식으로 준비 주문을 같은 랭크의 다른 주문으로 교환. 하루 1회'}]
  },
  'Sympathetic Strike': {
    effects: [{type:'display_note', text:'[1행동] 단일 대상 피해 주문 시전 시, 대상 인접 생물 1명에게도 절반 피해'}]
  },
  'Ceremonial Knife': {
    effects: [{type:'display_note', text:'의식용 칼을 들고 피해 주문 시전 시, 주문 랭크 절반만큼 추가 참격 피해'}]
  },
  'Greater Lesson': {
    effects: [{type:'display_note', text:'상급 교훈 1개 습득: 주술 1개 + 사역마에 주문 1개 추가'}]
  },
  "Witch's Charge": {
    effects: [{type:'display_note', text:'아군 1명을 "책임"으로 지정. 해당 대상에 대한 주문 공격/DC에 +1 상태 보너스'}]
  },
  'Incredible Familiar': {
    effects: [{type:'familiar_abilities', value:6}]
  },
  'Murksight': {
    effects: [{type:'display_note', text:'상위 암시야 또는 비마법 시야 방해 효과(안개/연기) 무시 중 택 1'}]
  },
  'Spirit Familiar': {
    effects: [{type:'display_note', text:'[1행동] 사역마를 비물질(incorporeal)로 전환/복귀. 물리 피해 저항, 힘 피해에 약함'}]
  },
  'Stitched Familiar': {
    effects: [{type:'familiar_abilities', value:1}]
  },
  "Witch's Bottle": {
    effects: [{type:'display_note', text:'재집중(Refocus) 시 집중 풀을 완전히 채움'}]
  },
  'Double, Double': {
    effects: [{type:'display_note', text:'주술 캔트립 시전 시 같은 턴에 두 번째 주술 캔트립도 시전 가능'}]
  },
  'Major Lesson': {
    effects: [{type:'display_note', text:'주요 교훈 1개 습득: 주술 1개 + 사역마에 주문 1개 추가'}]
  },
  "Witch's Communion": {
    effects: [{type:'display_note', text:'다른 위치와 10분 의식으로 서로의 사역마에서 임시 주문 1개 준비 가능'}]
  },
  'Coven Spell': {
    effects: [{type:'display_note', text:'위치 2명 이상이 10분 의식으로 의식 주문 1개를 협력 시전'}]
  },
  'Hex Focus': {
    effects: [{type:'display_note', text:'재집중(Refocus) 시 집중 풀을 완전히 채움'}]
  },
  "Witch's Broom": {
    effects: [{type:'display_note', text:'빗자루에 비행 마법 부여. 하루 최대 1시간 비행 (속도 = 이동 속도)'}]
  },
  "Patron's Presence": {
    effects: [{type:'display_note', text:'30피트 내 적이 공포 효과의 의지 내성에 -2 상태 페널티'}]
  },
  'Rites of Transfiguration': {
    effects: [{type:'display_note', text:'10분 의식으로 준비된 변신 주문을 같은 랭크의 다른 변신 주문으로 교환'}]
  },
  'Siphon Power': {
    effects: [{type:'display_note', text:'주문 슬롯 소진 시에도 최고 랭크 미만 주문 1개 추가 시전 가능 (하루 1회)'}]
  },
  "Patron's Claim": {
    effects: [{type:'display_note', text:'주술로 피해를 준 적에게 1분간 내성 굴림 -2 상태 페널티'}]
  },
  'Split Hex': {
    effects: [{type:'display_note', text:'단일 대상 주술 시전 시 사거리 내 두 번째 대상에게도 적용'}]
  },
  'Hex Master': {
    effects: [{type:'display_note', text:'턴당 주술 1개 제한 해제. 원하는 만큼 주술 사용 가능'}]
  },
  "Patron's Truth": {
    effects: [{type:'display_note', text:'추가 10랭크 주문 슬롯 1개 획득'}]
  },
  "Witch's Hut": {
    effects: [{type:'display_note', text:'후원자의 힘으로 이동 가능한 오두막 거주지 생성 (매그니피센트 맨션 유사)'}]
  },

  // ═══════════════════════════════════════
  //  위저드 재주 (Wizard Feats)
  // ═══════════════════════════════════════

  'Familiar': {
    effects: [{type:'familiar_abilities', value:2}]
  },
  'Spellbook Prodigy': {
    effects: [{type:'display_note', text:'주문서 시작 캔트립 10→12개. 레벨업 시 추가 주문 2→3개'}]
  },
  'Energy Ablation': {
    effects: [{type:'display_note', text:'[반응] 주문 피해 시, 대상 1명에게 다음 턴까지 해당 에너지 약점 부여 (레벨별 1~5)'}]
  },
  'Nonlethal Spell': {
    effects: [{type:'display_note', text:'[1행동] 다음 주문에 비치명 특성 부여. 대상을 죽이지 않고 기절시킴'}]
  },
  'Bespell Strikes': {
    effects: [{type:'display_note', text:'캔트립 외 주문 시전 후 턴 종료까지 무기/비무장 타격에 추가 1d6 피해'}]
  },
  'Call Wizardly Tools': {
    effects: [{type:'display_note', text:'60피트 내 볼 수 있는 마법 아이템 1개를 손으로 소환'}]
  },
  'Linked Focus': {
    effects: [{type:'display_note', text:'결합 아이템 소진으로 학파 주문 시전 시 집중 포인트 1점 회복'}]
  },
  'Spell Protection Array': {
    effects: [{type:'display_note', text:'일일 준비 시 에너지 유형 선택: 해당 유형 저항 5 (11레벨 10, 17레벨 15)'}]
  },
  'Convincing Illusion': {
    effects: [{type:'display_note', text:'환영 주문의 불신 DC +2 증가'}]
  },
  'Explosive Arrival': {
    effects: [{type:'display_note', text:'[반응] 순간이동 도착 시 10피트 내 생물에게 레벨/2 × 1d6 피해 (반사 내성)'}]
  },
  'Irresistible Magic': {
    effects: [{type:'display_note', text:'주문 내성 대성공을 일반 성공으로 취급 (대상당 주문당 1회)'}]
  },
  'Split Slot': {
    effects: [{type:'display_note', text:'주문 슬롯 1개를 2랭크 낮은 슬롯 2개로 분할 (각각 다른 주문 준비)'}]
  },
  'Advanced School Spell': {
    effects: [{type:'display_note', text:'학파의 고급 학파 주문 습득. 집중 포인트 최대치 2로 증가'}]
  },
  'Bond Conservation': {
    effects: [{type:'display_note', text:'[1행동] 결합 아이템 소진 시, 원래보다 2랭크 이상 낮은 주문 1개 추가 시전'}]
  },
  'Form Retention': {
    effects: [{type:'display_note', text:'변신(polymorph) 주문 지속 시간 2배 (최대 1시간)'}]
  },
  'Knowledge is Power': {
    effects: [{type:'display_note', text:'지식 회상 성공 시 해당 생물에 주문 DC +1 상황 보너스 (대성공 시 +2)'}]
  },
  'Overwhelming Energy': {
    effects: [{type:'display_note', text:'[1행동] 다음 주문이 대상의 에너지 저항을 레벨만큼 무시'}]
  },
  'Scroll Adept': {
    effects: [{type:'display_note', text:'일일 준비 시 임시 두루마리 1개 무료 생성 (최고 랭크보다 2 이상 낮은 주문)'}]
  },
  'Clever Counterspell': {
    effects: [{type:'display_note', text:'같은 주문 없이도 같은 전통의 유사 랭크 주문으로 반격 가능'}]
  },
  'Forcible Energy': {
    effects: [{type:'display_note', text:'에너지 삭마의 약점이 추가 3 증가'}]
  },
  'Keen Magical Detection': {
    effects: [{type:'display_note', text:'항상 마법 탐지 활성. 1행동으로 30피트 내 마법 아우라의 위치/학파 파악'}]
  },
  'Magic Sense': {
    effects: [{type:'display_note', text:'부정확 마법 감각 30피트 획득. 탐색(Seek)으로 정확한 위치 파악 가능'}]
  },
  'Bonded Focus': {
    effects: [{type:'display_note', text:'재집중(Refocus) 시 집중 풀을 완전히 채움'}]
  },
  'Secondary Detonation Array': {
    effects: [{type:'display_note', text:'[반응] 보호 배열 에너지 방출: 30피트 내 적에게 레벨 × 1d4 피해. 사용 후 저항 소멸'},{type:'grant_action'}]
  },
  'Arcane Bond': {
    effects: [{type:'grant_action'}]
  },
  'Superior Bond': {
    effects: [{type:'display_note', text:'결합 아이템 소진을 하루 2회 사용 가능'}]
  },
  'Scintillating Spell': {
    effects: [{type:'display_note', text:'[1행동] 다음 주문 피해 대상에 눈부심 1라운드 (치명실패 시 실명 1라운드)'}]
  },
  'Spell Tinker': {
    effects: [{type:'display_note', text:'유지 중인 주문 1개의 영역/대상/변수를 재설정 가능'}]
  },
  'Infinite Possibilities': {
    effects: [{type:'display_note', text:'주문 슬롯 소진 시에도 최고 랭크 미만 주문 1개 추가 시전 가능 (하루 1회)'}]
  },
  'Reprepare Spell': {
    effects: [{type:'display_note', text:'하루 1회, 10분간 시전 완료된 슬롯 1개에 주문서에서 다른 주문 재준비'}]
  },
  'Second Thoughts': {
    effects: [{type:'display_note', text:'[반응] 하루 1회, 시전한 주문을 취소하고 같은 랭크/행동 수의 다른 주문으로 교체 시전'}]
  },
  "Archwizard's Might": {
    effects: [{type:'display_note', text:'추가 10랭크 주문 슬롯 1개 획득'}]
  },
  'Spell Combination': {
    effects: [{type:'display_note', text:'같은 대상/영역의 주문 2개를 동시에 시전 (각각 슬롯 소비)'}]
  },
  'Spell Mastery': {
    effects: [{type:'display_note', text:'주문 4개를 항상 준비된 것으로 취급 (슬롯 소비 없이 각 하루 1회)'}]
  },
  'Spellshape Mastery': {
    effects: [{type:'display_note', text:'주문변형 재주 1개를 자유 행동으로 사용 가능 (1행동 대신)'}]
  },

  // ═══════════════════════════════════════
  //  파이터 클래스 재주 (Fighter Class Feats)
  // ═══════════════════════════════════════

  // ── 1레벨 ──
  'Combat Assessment': {
    effects: [{type:'display_note', text:'[2행동] 근접 타격. 명중 시 GM이 대상의 AC/내성/약점 중 하나 정보 제공'}]
  },
  'Double Slice': {
    effects: [{type:'display_note', text:'[2행동] 양손 무기로 동시 공격. 두 번째 타격은 다중 공격 페널티 없이'}]
  },
  'Exacting Strike': {
    effects: [{type:'display_note', text:'[1행동] 근접 타격. 빗나가면 다중 공격 페널티에 포함 안 됨'}]
  },
  'Point Blank Stance': {
    effects: [{type:'display_note', text:'[1행동] 자세: 첫 사거리 증분 내 원거리 타격 시 피해 주사위 1개 추가'}]
  },
  'Reactive Shield': {
    effects: [{type:'display_note', text:'[반응] 근접 명중 굴림 유발 시 즉시 방패 올리기'}]
  },
  'Snagging Strike': {
    effects: [{type:'display_note', text:'[1행동] 한 손 무기+빈 손. 근접 타격 명중 시 대상이 다음 턴까지 무방비'}]
  },
  'Sudden Charge': {
    effects: [{type:'display_note', text:'[2행동] 보폭 2회 후 근접 타격'}]
  },
  'Vicious Swing': {
    effects: [{type:'display_note', text:'[2행동] 근접 타격. 다중 공격 2회로 포함되지만 무기 피해 주사위 1개 추가'}]
  },

  // ── 2레벨 ──
  'Aggressive Block': {
    effects: [{type:'display_note', text:'방패 막기 시 공격자를 5피트 밀거나 무방비하게 할 수 있음 (선택)'}]
  },
  'Assisting Shot': {
    effects: [{type:'display_note', text:'[1행동] 원거리 타격. 명중 시 대상이 다음 공격에 무방비'}]
  },
  'Blade Break': {
    effects: [{type:'display_note', text:'[반응] 적의 치명타 시 무기/방패를 파괴하여 경도×2만큼 피해 감소'}]
  },
  'Brutish Shove': {
    effects: [{type:'display_note', text:'[1행동] 양손 근접 타격. 명중 시 자동 5피트 밀기+무방비'}]
  },
  'Combat Grab': {
    effects: [{type:'display_note', text:'[1행동] 한 손 무기+빈 손. 근접 타격 후 빈 손으로 적을 붙잡기(grabbed)'}]
  },
  'Dueling Parry': {
    effects: [{type:'display_note', text:'[1행동] 한 손 무기+빈 손. 다음 턴까지 AC +2 상황 보너스'}]
  },
  'Intimidating Strike': {
    effects: [{type:'display_note', text:'[2행동] 근접 타격. 명중+피해 시 공포 1 (치명타 시 공포 2)'}]
  },
  'Lightning Swap': {
    effects: [{type:'display_note', text:'[자유] 근접 타격 시(굴림 전) 즉시 다른 무기로 교환'}]
  },
  'Lunge': {
    effects: [{type:'display_note', text:'[1행동] 근접 타격의 도달 5피트 증가'}]
  },
  'Rebounding Toss': {
    effects: [{type:'display_note', text:'[2행동] 투척 타격. 명중 시 10피트 내 다른 적에게 튕겨 추가 타격'}]
  },
  'Sleek Reposition': {
    effects: [{type:'display_note', text:'[1행동] 기교/장창으로 타격. 명중 시 자동 재배치. 실패 시에도 무방비'}]
  },

  // ── 4레벨 ──
  'Barreling Charge': {
    effects: [{type:'display_note', text:'[2행동] 보폭하며 적 공간 통과(운동 판정). 이동 종료 시 근접 타격'}]
  },
  'Double Shot': {
    effects: [{type:'display_note', text:'[2행동] 재장전 0 원거리 무기. 서로 다른 대상에 각 -2로 타격 2회'}]
  },
  'Dual-Handed Assault': {
    effects: [{type:'display_note', text:'[2행동] 한 손 무기+빈 손. 양손으로 잡아 피해 주사위 증가'}]
  },
  'Parting Shot': {
    effects: [{type:'display_note', text:'[2행동] 한 걸음 후 원거리 타격. 대상은 이 공격에 무방비'}]
  },
  'Powerful Shove': {
    effects: [{type:'display_note', text:'자신보다 2 크기까지 큰 적에게 밀기 가능. 벽 충돌 시 근력 수정치 피해'}]
  },
  'Quick Reversal': {
    effects: [{type:'display_note', text:'[1행동] 측면 공격받는 중 한 적에 타격 후 다른 측면 적에 추가 타격'}]
  },
  'Shielded Stride': {
    effects: [{type:'display_note', text:'방패 올린 상태에서 반응 유발 없이 절반 속도로 보폭'}]
  },
  'Slam Down': {
    effects: [{type:'display_note', text:'[2행동] 근접 타격 명중+피해 시 넘어뜨리기(Trip) 시도'}]
  },
  'Swipe': {
    effects: [{type:'display_note', text:'[2행동] 인접한 최대 2명에게 한 번의 명중 굴림으로 타격'}]
  },

  // ── 6레벨 ──
  'Advanced Weapon Training': {
    effects: [{type:'display_note', text:'선택한 무기 그룹의 고급 무기를 군용 무기로 취급'}]
  },
  'Advantageous Assault': {
    effects: [{type:'display_note', text:'[1행동] 붙잡힌/엎드린/속박 적에 타격. 무기 주사위 수만큼 피해 보너스. 실패 시에도 피해'}]
  },
  'Dazing Blow': {
    effects: [{type:'display_note', text:'[1행동] 붙잡힌 적에 둔기 타격. 명중 시 인내 내성 → 기절 1~3'}]
  },
  'Disarming Stance': {
    effects: [{type:'display_note', text:'[1행동] 자세: 무장 해제에 +1, 무장 해제 방어에 +2 상황 보너스. 2 크기 큰 적에게도 가능'}]
  },
  'Furious Focus': {
    effects: [{type:'display_note', text:'양손 근접 무기로 맹렬한 일격 시 다중 공격에 1회로만 포함'}]
  },
  "Guardian's Deflection": {
    effects: [{type:'display_note', text:'[반응] 도달 내 아군의 AC에 +2 상황 보너스 (명중→빗나감 또는 치명타→명중 가능 시)'}]
  },
  'Reflexive Shield': {
    effects: [{type:'display_note', text:'방패 올리기 시 반사 내성에도 방패의 상황 보너스 적용'}]
  },
  'Revealing Stab': {
    effects: [{type:'display_note', text:'[2행동] 관통 무기로 감지 불가 적에 타격. 명중 시 무기를 박아 위치 노출'}]
  },
  'Ricochet Stance': {
    effects: [{type:'display_note', text:'[1행동] 자세: 투척 무기가 사거리 내에서 즉시 손으로 돌아옴'}]
  },
  'Shatter Defenses': {
    effects: [{type:'display_note', text:'[1행동] 겁먹은 적에 타격. 명중+피해 시 공포가 끝날 때까지 무방비'}]
  },
  'Shield Warden': {
    effects: [{type:'display_note', text:'방패 올린 상태에서 인접 아군에 대한 공격에도 방패 막기 사용 가능'}]
  },
  'Triple Shot': {
    effects: [{type:'display_note', text:'이중 사격의 두 타격을 같은 대상에게 가능. 1행동 추가로 -4 페널티 3회 타격'}]
  },

  // ── 8레벨 ──
  'Disorienting Opening': {
    effects: [{type:'display_note', text:'반격 타격 명중 시 대상이 다음 턴까지 무방비'}]
  },
  'Dueling Riposte': {
    effects: [{type:'display_note', text:'[반응] 결투 방어 중 적의 타격 대실패 시 근접 타격 또는 무장 해제'}]
  },
  'Felling Strike': {
    effects: [{type:'display_note', text:'[2행동] 타격 명중+피해 시 비행 적이 최대 120피트 추락. 치명타면 비행 불가'}]
  },
  'Incredible Aim': {
    effects: [{type:'display_note', text:'[2행동] 원거리 타격에 +2 상황 보너스, 대상의 은폐 무시'}]
  },
  'Mobile Shot Stance': {
    effects: [{type:'display_note', text:'[1행동] 자세: 원거리 타격이 반응을 유발하지 않음. 반격 타격 시 원거리 무기 사용 가능'}]
  },
  'Positioning Assault': {
    effects: [{type:'display_note', text:'[2행동] 양손 근접 타격 명중 시 대상을 5피트 재배치'}]
  },
  'Quick Shield Block': {
    effects: [{type:'display_note', text:'각 턴 시작에 방패 막기 전용 추가 반응 1회'}]
  },
  'Resounding Bravery': {
    effects: [{type:'display_note', text:'적의 의지 내성 대성공 시 1분간 내성 +1 상태 보너스 + 임시 HP(레벨 절반)'}]
  },
  'Sudden Leap': {
    effects: [{type:'display_note', text:'[2행동] 도약/높이뛰기/멀리뛰기 중 근접 타격 1회. 도약 높이 이하 추락 피해 없음'}]
  },

  // ── 10레벨 ──
  'Agile Grace': {
    effects: [{type:'display_note', text:'민첩 무기의 다중 공격 페널티가 -3/-6으로 감소 (일반 -4/-8 대신)'}]
  },
  'Certain Strike': {
    effects: [{type:'display_note', text:'[1행동] 근접 타격. 실패 시에도 피해 주사위 제외한 피해를 줌'}]
  },
  'Crashing Slam': {
    effects: [{type:'display_note', text:'내리찍기에서 타격 명중 시 자동 넘어뜨리기 대성공'}]
  },
  'Cut from the Air': {
    effects: [{type:'display_note', text:'[반응] 물리 원거리 타격 대상 시 AC +4 상황 보너스로 요격'}]
  },
  'Debilitating Shot': {
    effects: [{type:'display_note', text:'[2행동] 원거리 타격. 명중+피해 시 대상이 느려짐(slowed) 1'}]
  },
  'Disarming Twist': {
    effects: [{type:'display_note', text:'[1행동] 한 손 무기+빈 손. 타격+무장 해제. 실패 시에도 무방비'}]
  },
  'Disruptive Stance': {
    effects: [{type:'display_note', text:'[1행동] 자세: 집중 행동에도 반격 타격 가능. 명중만으로 집중/조작 행동 방해'}]
  },
  'Fearsome Brute': {
    effects: [{type:'display_note', text:'겁먹은 적 타격 시 공포 수치×2 상황 보너스를 피해에 추가 (달인이면 ×3)'}]
  },
  'Flinging Charge': {
    effects: [{type:'display_note', text:'[2행동] 보폭 2회(중간에 투척 타격). 명중 시 다음 근접 공격에 무방비'}]
  },
  'Mirror Shield': {
    effects: [{type:'display_note', text:'[반응] 주문 공격 대실패 시 시전자에게 주문 반사'}]
  },
  'Overpowering Charge': {
    effects: [{type:'display_note', text:'돌진 충격으로 통과 시 근력 수정치 둔기 피해 (대성공 시 2배+무방비)'}]
  },
  'Tactical Reflexes': {
    effects: [{type:'display_note', text:'각 턴 시작에 반격 타격 전용 추가 반응 1회'}]
  },

  // ── 12레벨 ──
  'Brutal Finish': {
    effects: [{type:'display_note', text:'[1행동] 양손 근접 타격. 피해 주사위 1개 추가(18레벨 2개). 실패 시에도 피해. 턴 종료'}]
  },
  'Dashing Strike': {
    effects: [{type:'display_note', text:'[2행동] 적에서 빠져나와 이동 속도까지 보폭 후 근접 타격'}]
  },
  'Dueling Dance': {
    effects: [{type:'display_note', text:'[1행동] 자세: 한 손 무기+빈 손. 항상 결투 방어의 AC +2 상황 보너스'}]
  },
  'Flinging Shove': {
    effects: [{type:'display_note', text:'밀기 거리 증가: 성공 10피트, 대성공 20피트. 야만적 밀치기 실패 시에도 5피트 밀기'}]
  },
  'Improved Dueling Riposte': {
    effects: [{type:'display_note', text:'결투 방어 없이도 결투 반격 사용 가능. 전용 추가 반응 1회'}]
  },
  'Incredible Ricochet': {
    effects: [{type:'display_note', text:'[2행동] 이번 턴 공격한 생물에 원거리 타격. 은폐와 모든 엄폐 무시'}]
  },
  'Lunging Stance': {
    effects: [{type:'display_note', text:'[1행동] 자세: 반격 타격의 도달이 5피트 증가 (돌진 찌르기 범위)'}]
  },
  "Paragon's Guard": {
    effects: [{type:'display_note', text:'[1행동] 자세: 방패가 항상 올려진 상태로 취급 (행동 불필요)'}]
  },

  // ── 14레벨 ──
  'Desperate Finisher': {
    effects: [{type:'display_note', text:'[반응] 턴 마지막 행동 후 압박 행동 1개 추가 사용. 다음 턴까지 반응 불가'}]
  },
  'Determination': {
    effects: [{type:'display_note', text:'[1행동] 하루 1회. 비영구 상태/주문 효과 1개 종료 또는 상쇄 시도'}]
  },
  'Guiding Finish': {
    effects: [{type:'display_note', text:'[1행동] 한 손 무기+빈 손. 타격 명중 시 최대 10피트 재배치. 실패 시에도 5피트'}]
  },
  'Guiding Riposte': {
    effects: [{type:'display_note', text:'결투 반격 명중 시 대상을 최대 10피트 재배치'}]
  },
  'Opening Stance': {
    effects: [{type:'display_note', text:'[반응] 주도권 굴림 시 자세 특성 행동 1개를 즉시 사용'}]
  },
  'Two-Weapon Flurry': {
    effects: [{type:'display_note', text:'[1행동] 각 손의 무기로 1회씩 타격 (이전 모멘텀 활용)'}]
  },
  'Whirlwind Strike': {
    effects: [{type:'display_note', text:'[3행동] 근접 도달 내 모든 적에게 타격. 전부 한 후에만 다중 공격 증가'}]
  },

  // ── 16레벨 ──
  'Graceful Poise': {
    effects: [{type:'display_note', text:'[1행동] 자세: 이중 베기의 두 번째 타격을 민첩 무기로 하면 다중 공격 1회로만 포함'}]
  },
  'Improved Reflexive Shield': {
    effects: [{type:'display_note', text:'반사 내성 피해에 방패 막기 시 인접 아군도 피해 감소 혜택'}]
  },
  'Master of Many Styles': {
    effects: [{type:'display_note', text:'[자유] 턴 시작 시 자세 행동 1개를 사용하여 자세 전환'}]
  },
  'Multishot Stance': {
    effects: [{type:'display_note', text:'[1행동] 자세: 이중 사격 페널티 -1로 감소. 이동 시 자세 종료'}]
  },
  'Overwhelming Blow': {
    effects: [{type:'display_note', text:'[2행동] 근접 타격(다중 공격 3회). 명중 시 자동 치명타. 기절 1+무방비'}]
  },
  'Twinned Defense': {
    effects: [{type:'display_note', text:'[1행동] 자세: 각 손에 근접 무기. 항상 쌍검 방어의 AC 보너스'}]
  },

  // ── 18레벨 ──
  'Savage Critical': {
    effects: [{type:'display_note', text:'전설 숙련도 무기로 주사위 19 굴림 시 성공이면 자동 치명 성공'}]
  },
  'Smash from the Air': {
    effects: [{type:'display_note', text:'공중 요격을 원거리 주문 공격에 대해서도 사용 가능'}]
  },

  // ── 20레벨 ──
  'Boundless Reprisals': {
    effects: [{type:'display_note', text:'각 적의 턴 시작에 파이터 반응 전용 추가 반응 1회'}]
  },
  'Ultimate Flexibility': {
    effects: [{type:'display_note', text:'전투 유연성으로 3개 재주 획득 (8레벨/14레벨/18레벨 이하 각 1개)'}]
  },
  'Weapon Supremacy': {
    effects: [{type:'display_note', text:'영구적으로 빠른(quickened) 상태. 추가 행동은 타격에만 사용 가능'}]
  },

  // ═══════════════════════════════════════
  //  로그 클래스 재주 (Rogue Class Feats)
  // ═══════════════════════════════════════

  // ── 1레벨 ──
  'Nimble Dodge': {
    effects: [{type:'display_note', text:'[반응] 공격 대상 시 유발 공격에 AC +2 상황 보너스'}]
  },
  'Overextending Feint': {
    effects: [{type:'display_note', text:'속임 성공 시 대상이 모든 공격에 무방비. 대실패 시 당신이 무방비'}]
  },
  'Plant Evidence': {
    effects: [{type:'display_note', text:'도둑질로 물건을 훔치는 대신 대상에게 물건을 심을 수 있음'}]
  },
  'Trap Finder': {
    effects: [{type:'display_note', text:'함정 탐지에 +1 상황 보너스, 함정 AC/내성에도 +1. 수색 없이도 함정 발견 가능'}]
  },
  'Tumble Behind': {
    effects: [{type:'display_note', text:'덤블 통과 성공 시 통과한 적이 다음 턴까지 무방비'}]
  },
  'Twin Feint': {
    effects: [{type:'display_note', text:'[2행동] 각 손에 근접 무기. 같은 대상에 타격 2회. 두 번째 공격에 자동 무방비'}]
  },
  "You're Next": {
    effects: [{type:'display_note', text:'[반응] 적 쓰러뜨린 후 60피트 내 생물에 +2 상황 보너스로 사기 저하'}]
  },

  // ── 2레벨 ──
  'Brutal Beating': {
    effects: [{type:'display_note', text:'치명타로 피해 시 대상에게 공포 1'}]
  },
  'Clever Gambit': {
    effects: [{type:'display_note', text:'[반응] 지식 회상으로 식별한 적에 치명 성공 시 인접 아군이 비틀거림 또는 타격'}]
  },
  'Distracting Feint': {
    effects: [{type:'display_note', text:'속임으로 무방비한 대상의 지각과 반사 내성에 -2 상황 페널티'}]
  },
  'Mobility': {
    effects: [{type:'display_note', text:'절반 속도 이하로 보폭하면 이동이 반응을 유발하지 않음'}]
  },
  'Strong Arm': {
    effects: [{type:'display_note', text:'투척 무기의 사거리 증분 10피트 증가'}]
  },
  'Unbalancing Blow': {
    effects: [{type:'display_note', text:'치명타 피해 시 대상이 다음 턴까지 당신의 공격에 무방비'}]
  },
  'Underhanded Assault': {
    effects: [{type:'display_note', text:'[2행동] 아군 인접 적에 잠행(은신 -2). 성공 시 근접 타격 가능'}]
  },

  // ── 4레벨 ──
  'Dread Striker': {
    effects: [{type:'display_note', text:'겁먹은(frightened) 생물은 당신의 공격에도 무방비'}]
  },
  'Head Stomp': {
    effects: [{type:'display_note', text:'[1행동] 엎드린 대상에 비무장 타격. 명중 시 멍청함 1(치명타 2)+무방비'}]
  },
  'Mug': {
    effects: [{type:'display_note', text:'[1행동] 근접 타격. 은밀 공격 피해 시 도둑질(Steal)도 시도 가능'}]
  },
  'Poison Weapon': {
    effects: [{type:'display_note', text:'[1행동] 무기에 독 도포. 일일 준비 시 로그 레벨만큼 단순 독(1d4) 준비'}]
  },
  "Predictable!": {
    effects: [{type:'display_note', text:'[1행동] 적의 다음 행동 예측. 성공 시 AC/내성 +1~+2. 대실패 시 -1'}]
  },
  'Reactive Pursuit': {
    effects: [{type:'display_note', text:'[반응] 인접 적이 멀어질 때 보폭하여 적에 인접하게 유지'}]
  },
  'Sabotage': {
    effects: [{type:'display_note', text:'[1행동] 도달 내 적의 장비를 도둑질로 손상 (대성공: 숙련 보너스×4 피해)'}]
  },
  "Scoundrel's Surprise": {
    effects: [{type:'display_note', text:'[1행동] 변장 벗어 놀라게 함. 간파 못한 생물은 다음 공격에 무방비'}]
  },
  'The Harder They Fall': {
    effects: [{type:'display_note', text:'무방비한 적 넘어뜨리기 성공 시 1d6 둔기 피해. 대성공이면 +은밀 공격 피해'}]
  },
  'Twin Distraction': {
    effects: [{type:'display_note', text:'쌍검 속임으로 양쪽 모두 피해 시 의지 내성. 실패 시 멍청함 1'}]
  },

  // ── 6레벨 ──
  'Analyze Weakness': {
    effects: [{type:'display_note', text:'[1행동] 지식 회상으로 식별한 적. 다음 은밀 공격에 추가 2d6 정밀 피해 (11레벨 3d6, 17레벨 4d6)'}]
  },
  'Anticipate Ambush': {
    effects: [{type:'display_note', text:'절반 속도로 경계. 은신으로 주도권 굴리는 모든 적에 -2 상황 페널티'}]
  },
  'Far Throw': {
    effects: [{type:'display_note', text:'투척 무기의 추가 사거리 증분 페널티가 -2 대신 -1'}]
  },
  'Gang Up': {
    effects: [{type:'display_note', text:'적이 아군과 함께 도달 내에 있으면 반대편 아니어도 측면 공격 가능'}]
  },
  'Light Step': {
    effects: [{type:'display_note', text:'보폭/비틀거림 시 험한 지형 무시 (마법 지형 포함)'}]
  },
  'Shove Down': {
    effects: [{type:'display_note', text:'[자유] 밀기 성공 후 즉시 넘어뜨리기 시도 (도달 밖이어도)'}]
  },
  'Sly Disarm': {
    effects: [{type:'display_note', text:'운동 대신 도둑질로 무장 해제 가능. 성공 시 대상이 무방비'}]
  },
  'Twist the Knife': {
    effects: [{type:'display_note', text:'[1행동] 은밀 공격 피해를 준 무방비 대상에 은밀 공격 주사위 수만큼 지속 출혈'}]
  },
  'Watch Your Back': {
    effects: [{type:'display_note', text:'[1행동] 위협 판정. 성공 시 대상이 당신 지각에 +2이지만 공포 의지 내성에 -2'}]
  },

  // ── 8레벨 ──
  'Bullseye': {
    effects: [{type:'display_note', text:'[2행동] 다음 투척 타격에 +1 상황 보너스. 은폐/엄폐 무시'}]
  },
  'Delay Trap': {
    effects: [{type:'display_note', text:'[반응] 함정 유발 시 도둑질로 해제 시도. 대성공: 유발 방지/지연'}]
  },
  'Improved Poison Weapon': {
    effects: [{type:'display_note', text:'단순 독이 2d4 독 피해로 증가. 대실패 시 독이 낭비되지 않음'}]
  },
  'Inspired Stratagem': {
    effects: [{type:'display_note', text:'일일 준비 시 최대 5명과 전략 공유. [반응]으로 아군이 판정을 2번 굴림'},{type:'grant_action'}]
  },
  'Nimble Roll': {
    effects: [{type:'display_note', text:'날렵한 회피를 반사 내성에도 사용 가능. 회피 성공 시 10피트 보폭'}]
  },
  'Opportune Backstab': {
    effects: [{type:'display_note', text:'[반응] 도달 내 생물이 아군 근접 공격에 명중당하면 타격'}]
  },
  'Predictive Purchase': {
    effects: [{type:'display_note', text:'선견 계획자+선견 소모품 재주 획득. 2행동으로 아이템을 꺼냄'}]
  },
  'Sidestep': {
    effects: [{type:'display_note', text:'[반응] 타격 실패/대실패 시 공격을 인접 생물에게 리다이렉트'}]
  },
  'Sly Striker': {
    effects: [{type:'display_note', text:'무방비하지 않은 생물에도 1d6 정밀 피해 (14레벨에 2d6)'}]
  },
  'Swipe Souvenir': {
    effects: [{type:'display_note', text:'[1행동] 붙잡힌/속박 시 탈출 시도 후 성공하면 도둑질도 시도'}]
  },
  'Tactical Entry': {
    effects: [{type:'display_note', text:'[1행동] 은신으로 주도권 굴린 첫 턴에 보폭 (반응 유발 안 함)'}]
  },

  // ── 10레벨 ──
  'Methodical Debilitations': {
    effects: [{type:'display_note', text:'추가 쇠약: 측면 공격 불가, 엄폐 보너스 무효화'}]
  },
  'Nimble Strike': {
    effects: [{type:'display_note', text:'날렵한 회피 반응 시 근접 타격도 가능 (다중 공격 미포함/미적용)'}]
  },
  'Precise Debilitations': {
    effects: [{type:'display_note', text:'추가 쇠약: 추가 2d6 정밀 피해 또는 대상이 무방비'}]
  },
  'Sneak Adept': {
    effects: [{type:'display_note', text:'잠행(Sneak) 실패 시 성공으로 취급 (대실패는 여전히 가능)'}]
  },
  'Tactical Debilitations': {
    effects: [{type:'display_note', text:'추가 쇠약: 반응 사용 불가 또는 측면 공격 불가'}]
  },
  'Vicious Debilitations': {
    effects: [{type:'display_note', text:'추가 쇠약: 둔기/관통/참격 약점 5 또는 서투름(clumsy) 1'}]
  },

  // ── 12레벨 ──
  'Bloody Debilitation': {
    effects: [{type:'display_note', text:'추가 쇠약: 3d6 지속 출혈 피해'}]
  },
  'Critical Debilitation': {
    effects: [{type:'display_note', text:'치명 성공 시 추가 쇠약: 인내 내성 → 느려짐 1~2 또는 마비'}]
  },
  'Fantastic Leap': {
    effects: [{type:'display_note', text:'[2행동] 높이/멀리뛰기. 도약 종료 시 근접 타격. 추락 피해 없이 착지'}]
  },
  'Felling Shot': {
    effects: [{type:'display_note', text:'[2행동] 무방비한 생물에 원거리 타격. 명중 시 반사 내성 → 최대 120피트 추락'}]
  },
  'Preparation': {
    effects: [{type:'display_note', text:'[1행동] 다음 턴까지 로그 반응 전용 추가 반응 1회'}]
  },
  'Reactive Interference': {
    effects: [{type:'display_note', text:'[반응] 인접 적의 반응을 방해. 레벨 이하면 자동, 높으면 명중 굴림'}]
  },
  'Ricochet Feint': {
    effects: [{type:'display_note', text:'도탄 자세 중 투척 사거리 내 생물에게도 속임(Feint) 가능'}]
  },
  'Spring from the Shadows': {
    effects: [{type:'display_note', text:'[2행동] 보폭 후 숨겨진/미탐지 적에 타격 (타격 전까지 은신 유지)'}]
  },

  // ── 14레벨 ──
  'Defensive Roll': {
    effects: [{type:'display_note', text:'[반응] 10분 1회. 물리 공격이 HP 0으로 만들려 할 때 절반 피해'}]
  },
  'Instant Opening': {
    effects: [{type:'display_note', text:'[1행동] 30피트 내 대상 1명이 다음 턴 종료까지 무방비'}]
  },
  'Leave an Opening': {
    effects: [{type:'display_note', text:'무방비한 적에 치명 타격 시 아군의 반격 타격을 유발'}]
  },
  "Stay Down!": {
    effects: [{type:'display_note', text:'[반응] 도달 내 엎드린 적이 일어나려 할 때 운동으로 방해'}]
  },

  // ── 16레벨 ──
  'Blank Slate': {
    effects: [{type:'display_note', text:'탐지/폭로/관찰 마법이 감지 불가 (상쇄 랭크 10 이상만 가능)'}]
  },
  'Cloud Step': {
    effects: [{type:'display_note', text:'보폭 시 물/공기/제한 중량 표면 위를 걸음. 턴 종료 시 추락/침몰'}]
  },
  'Cognitive Loophole': {
    effects: [{type:'display_note', text:'[반응] 정신 효과의 허점을 찾아 다음 턴 종료까지 해당 효과 무시'}]
  },
  'Dispelling Slice': {
    effects: [{type:'display_note', text:'[2행동] 무방비한 대상에 타격. 은밀 공격 피해 시 활성 주문 상쇄 시도'}]
  },
  'Perfect Distraction': {
    effects: [{type:'display_note', text:'미끼를 남기고 잠행. 오도(mislead) 주문처럼 작동. 10분 준비 필요'}]
  },
  'Reconstruct the Scene': {
    effects: [{type:'display_note', text:'[1행동] 1분간 조사하여 지난 하루 사건의 불명확한 인상을 받음'}]
  },
  'Swift Elusion': {
    effects: [{type:'display_note', text:'[반응] 적이 인접 이동 종료 시 곡예 판정으로 재배치'}]
  },

  // ── 18레벨 ──
  'Implausible Infiltration': {
    effects: [{type:'display_note', text:'[2행동] 벽/바닥 통과 (나무/석고/돌, 10피트 이하, 금속 불가)'}]
  },
  'Implausible Purchase': {
    effects: [{type:'display_note', text:'선견 계획자를 1행동으로 사용. 하루 5회까지 레벨-6 이하 소모품'}]
  },
  'Powerful Sneak': {
    effects: [{type:'display_note', text:'은밀 공격이 정밀 피해 면역/저항 무시. 미탐지 시 주사위 3 미만=3'}]
  },

  // ── 20레벨 ──
  'Hidden Paragon': {
    effects: [{type:'display_note', text:'시간당 1회. 모든 적에게 숨겨짐/미탐지 시 1분간 투명 (적대 행동해도 유지)'}]
  },
  'Impossible Striker': {
    effects: [{type:'display_note', text:'무방비하지 않은 대상에게도 전체 은밀 공격 피해'}]
  },
  'Reactive Distraction': {
    effects: [{type:'display_note', text:'[반응] 공격/효과 대상 시 미끼와 자리를 바꿈. 미끼가 대신 대상'}]
  },

  // ═══════════════════════════════════════
  //  클래스 자동 재주 (Special / Auto-granted)
  // ═══════════════════════════════════════

  'Reactive Strike': {
    effects: [{type:'grant_action', action:'aoo'}, {type:'display_note', text:'[반응] 도달 범위 내 적이 조작/이동 행동 또는 원거리 공격 시 근접 타격. 치명타 시 조작 행동 방해'}]
  },
  'Sneak Attack': {
    effects: [{type:'damage_note', scaling:{1:'1d6',5:'2d6',11:'3d6',17:'4d6'}, damage_type:'정밀'}]
  },
  'Surprise Attack': {
    effects: [{type:'display_note', text:'전투 시작 시 기만/은신으로 주도권 굴림 가능. 적이 아직 행동 안 했으면 방어불가'}]
  },
  'Hunt Prey': {
    effects: [{type:'grant_action', action:'hunt-prey'}, {type:'display_note', text:'[1행동] 사냥감 1마리 지정. 지정된 적에 대해 추적/인지 보너스 + 사냥 방식 효과 적용'}]
  },
  'Voice of Nature': {
    effects: [{type:'display_note', text:'드루이드 언어(Druidic) 습득. 자연의 소리를 듣고 이해 가능'}]
  },
  'Counterspell': {
    effects: [{type:'display_note', text:'[반응] 적이 같은 주문을 시전할 때 반격으로 해당 주문을 무효화'}]
  },
  'Reflect Spell': {
    effects: [{type:'display_note', text:'반격 주문 대성공 시 주문을 원래 시전자에게 되돌림'}]
  },

  // ═══════════════════════════════════════
  //  나머지 일반 재주
  // ═══════════════════════════════════════

  'Ancestral Paragon': {
    effects: [{type:'display_note', text:'1레벨 혈통 재주 1개 추가 획득'}]
  },
  'Expeditious Search': {
    effects: [{type:'display_note', text:'탐색(Seek) 영역 2배. 달인=4배 속도로 탐색'}]
  },

  // ═══════════════════════════════════════
  //  나머지 기술 재주
  // ═══════════════════════════════════════

  'Seasoned': {
    effects: [{type:'display_note', text:'요리/양조에 +1 상황 보너스. 독에 대한 인내 내성 +1'}]
  },
  'Automatic Knowledge': {
    choice: {
      type:'skill', label:'자동 지식을 적용할 기술을 선택하세요',
      filter:{min_rank:2}, repeatable:true,
    },
    effects: [{type:'display_note', text:'자동 지식($choice_name): 1라운드 1회 자유 행동으로 지식 회상 (확인 결과 사용)'}]
  },
  'Magical Shorthand': {
    effects: [{type:'display_note', text:'주문서/두루마리에서 주문 학습 시간 단축. 숙련=1분, 전문가=즉시'}]
  },
  'Quick Squeeze': {
    effects: [{type:'display_note', text:'비집고 들어가기 1분→5피트/라운드. 전문가=이동 행동 속도'}]
  },
  'Powerful Leap': {
    effects: [{type:'display_note', text:'수직 도약 5피트, 수평 도약 방향 5피트 자동 성공 (판정 불필요)'}]
  },
  'Quick Climb': {
    effects: [{type:'display_note', text:'등반 시 전체 속도 이동. 대성공 시 추가 5피트'}]
  },
  'Quick Swim': {
    effects: [{type:'display_note', text:'수영 시 전체 속도 이동. 대성공 시 추가 5피트'}]
  },
  'Underwater Marauder': {
    effects: [{type:'display_note', text:'수중 전투 페널티 없음. 참격/둔기 무기 수중 사용 가능'}]
  },
  'Wall Jump': {
    effects: [{type:'display_note', text:'등반 중 도약 가능. 벽 사이 연속 점프 가능'}]
  },
  'Titan Wrestler': {
    effects: [{type:'display_note', text:'자신보다 2단계 큰 생물에게도 붙잡기/무장해제 등 시도 가능'}]
  },
  'Rapid Mantel': {
    effects: [{type:'display_note', text:'난간/턱에 매달린 상태에서 일어서기를 자유 행동으로'}]
  },
  'Cloud Jump': {
    effects: [{type:'display_note', text:'도약 거리 제한 해제. 운동 판정 결과만큼 수직/수평 이동. 전설 전용'}]
  },
  'Monster Crafting': {
    effects: [{type:'display_note', text:'몬스터 부위로 특수 장비 제작 가능 (재료비 절감)'}]
  },
  'Criminal Connections': {
    effects: [{type:'display_note', text:'뒷세계 인맥으로 암시장 접근. 불법 물품 입수/판매 가능'}]
  },
  'No Cause for Alarm': {
    effects: [{type:'display_note', text:'[반응] 공포 효과 목격 시 30피트 이내 아군의 공포 수치 1 감소'}]
  },
  'Quick Coercion': {
    effects: [{type:'display_note', text:'강요 시간 1분→1라운드 (3행동)'}]
  },
  'Group Coercion': {
    effects: [{type:'display_note', text:'강요를 최대 4명에게 동시 사용 가능'}]
  },
  'Lasting Coercion': {
    effects: [{type:'display_note', text:'강요 효과 지속시간 증가. 달인=1주일, 전설=무기한'}]
  },
  'Terrified Retreat': {
    effects: [{type:'display_note', text:'사기 꺾기 대성공 시 대상이 도주 상태 (1라운드)'}]
  },
  'Recognize Poison': {
    effects: [{type:'display_note', text:'[1행동] 독소 종류 식별. 제작으로 독 유형/DC 파악'}]
  },
  'Unusual Treatment': {
    effects: [{type:'display_note', text:'의학 대신 제작으로 독/질병 치료 시도 가능'}]
  },
  'Consult the Spirits': {
    effects: [{type:'display_note', text:'자연학/오컬티즘/종교학으로 영혼에게 지식 회상 시도 가능'}]
  },
  'Planar Sense': {
    effects: [{type:'display_note', text:'항상 차원 감지 활성. 30피트 이내 차원문/이계 존재 자동 인식'}]
  },
  'Bizarre Magic': {
    effects: [{type:'display_note', text:'주문 식별 DC +5. 적이 당신의 주문을 식별하기 어려움'}]
  },
  'Schooled in Secrets': {
    effects: [{type:'display_note', text:'오컬티즘으로 비밀/음모 관련 지식 회상 시 +1 상황 보너스'}]
  },
  'Divine Guidance': {
    effects: [{type:'display_note', text:'10분 기도로 신격에게 조언 구함. 종교학 판정으로 유용한 정보 획득'}]
  },
  'Additional Lore': {
    choice: {
      type:'lore', label:'추가 지식(Lore) 분야를 입력하세요',
    },
    effects: [{type:'display_note', text:'추가 지식($choice_name) 숙련됨. 레벨 상승 시 자동 증가'}]
  },
  'Eye for Numbers': {
    effects: [{type:'display_note', text:'숫자/계산을 빠르게 파악. 재정/수학 관련 사회 판정에 +2 상황 보너스'}]
  },
  'Fast Study': {
    effects: [{type:'display_note', text:'지식 회상 후 해당 정보를 활용한 판정에 +1 상황 보너스 (1분)'}]
  },
  'Glean Contents': {
    effects: [{type:'display_note', text:'봉인된 용기/서신의 내용물을 외부에서 추정. 사회 판정으로 파악'}]
  },
  'Sound Estimation': {
    effects: [{type:'display_note', text:'소리만으로 거리/방향/수량 추정 가능'}]
  },
  'Courtly Graces': {
    effects: [{type:'display_note', text:'사회로 인상 만들기 가능. 귀족/궁정 예절에 정통'}]
  },
  'Legendary Codebreaker': {
    effects: [{type:'display_note', text:'암호 해독 대성공 시 원래 메시지+의도까지 파악. 전설 전용'}]
  },
  'Legendary Linguist': {
    effects: [{type:'display_note', text:'사회 판정으로 알지 못하는 언어 즉시 소통 가능. 전설 전용'}]
  },
  'Influence Nature': {
    effects: [{type:'display_note', text:'자연학으로 동물의 태도를 영구적으로 변경 가능'}]
  },
  'Quick Unlock': {
    effects: [{type:'display_note', text:'자물쇠 따기 2행동→1행동'}]
  },
  'Planar Survival': {
    effects: [{type:'display_note', text:'다른 차원에서도 생존 기술로 자급 가능'}]
  },
  'Quick Recognition': {
    effects: [{type:'display_note', text:'주문 인식을 자유 행동으로 사용 가능 (1라운드 1회)'}]
  },
  'Break Curse': {
    effects: [{type:'display_note', text:'해제 마법 없이 수련/훈련으로 저주 제거 시도 가능'}]
  },
  'Legendary Thief': {
    effects: [{type:'display_note', text:'장착/고정된 물건도 소매치기 가능. 전설 전용'}]
  },
  'Legendary Professional': {
    effects: [{type:'display_note', text:'지식으로 수입 획득 시 최대 20레벨 과업 수행 가능. 전설 전용'}]
  },
  'Unmistakable Lore': {
    effects: [{type:'display_note', text:'지식(Lore) 기술로 지식 회상 시 대실패→실패'}]
  },

  // ═══════════════════════════════════════
  //  원형 재주 (Archetype / Multiclass Feats)
  // ═══════════════════════════════════════

  // ── 바드 멀티클래스 ──
  'Bard Dedication': {
    choice: {type:'custom', label:'뮤즈를 선택하세요', options:[{id:'muse-enigma',name:'수수께끼'},{id:'muse-maestro',name:'마에스트로'},{id:'muse-warrior',name:'전사'},{id:'muse-lore',name:'지식'}]},
    effects: [{type:'skill_trained', skill:'occultism'}, {type:'skill_trained', skill:'performance'}, {type:'display_note', text:'오컬트 캔트립 2개 습득. 주문 공격/DC 숙련됨. 핵심 속성: 매력. 뮤즈: $choice_name'}]
  },
  'Basic Bard Spellcasting': {
    effects: [{type:'display_note', text:'기초 주문시전 혜택: 1랭크 주문 슬롯 1개. 6레벨에 2랭크, 8레벨에 3랭크 슬롯 추가'}]
  },
  "Basic Muse's Whispers": {
    effects: [{type:'display_note', text:'1~2레벨 바드 재주 1개 습득'}]
  },
  "Advanced Muse's Whispers": {
    effects: [{type:'display_note', text:'바드 재주 1개 습득 (바드 레벨 = 캐릭터 레벨/2). 반복 선택 가능'}]
  },
  'Counter Perform': {
    effects: [{type:'display_note', text:'집중 주문: 대항 공연 습득. 집중 포인트 풀 획득/확장'}]
  },
  'Anthemic Performance': {
    effects: [{type:'display_note', text:'작곡 캔트립: 용기의 찬가 습득'}]
  },
  'Occult Breadth': {
    effects: [{type:'display_note', text:'바드 원형 주문 슬롯 수 증가 (최고 2랭크 제외 각 랭크 +1)'}]
  },
  'Expert Bard Spellcasting': {
    effects: [{type:'display_note', text:'주문 공격/DC 전문가. 4랭크 슬롯. 14레벨에 5랭크, 16레벨에 6랭크'}]
  },
  'Master Bard Spellcasting': {
    effects: [{type:'display_note', text:'주문 공격/DC 달인. 7랭크 슬롯. 20레벨에 8랭크'}]
  },

  // ── 클레릭 멀티클래스 ──
  'Cleric Dedication': {
    effects: [{type:'skill_trained', skill:'religion'}, {type:'display_note', text:'신격 선택. 신성 캔트립 2개. 주문 공격/DC 숙련됨. 핵심 속성: 지혜. 신격 기술 숙련'}]
  },
  'Basic Cleric Spellcasting': {
    effects: [{type:'display_note', text:'기초 주문시전 혜택. 신격 주문을 원형 슬롯에 준비 가능'}]
  },
  'Basic Dogma': {
    effects: [{type:'display_note', text:'1~2레벨 클레릭 재주 1개 습득'}]
  },
  'Advanced Dogma': {
    effects: [{type:'display_note', text:'클레릭 재주 1개 습득 (클레릭 레벨 = 캐릭터 레벨/2). 반복 선택 가능'}]
  },
  'Divine Breadth': {
    effects: [{type:'display_note', text:'클레릭 원형 주문 슬롯 수 증가 (최고 2랭크 제외 각 랭크 +1)'}]
  },
  'Expert Cleric Spellcasting': {
    effects: [{type:'display_note', text:'주문 공격/DC 전문가. 4랭크 슬롯. 14레벨에 5랭크, 16레벨에 6랭크'}]
  },
  'Master Cleric Spellcasting': {
    effects: [{type:'display_note', text:'주문 공격/DC 달인. 7랭크 슬롯. 20레벨에 8랭크'}]
  },

  // ── 드루이드 멀티클래스 ──
  'Druid Dedication': {
    effects: [{type:'skill_trained', skill:'nature'}, {type:'display_note', text:'드루이드 교단 선택. 원시 캔트립 2개. 주문 공격/DC 숙련됨. 핵심 속성: 지혜. 드루이드 금기 적용'}]
  },
  'Basic Druid Spellcasting': {
    effects: [{type:'display_note', text:'기초 주문시전 혜택'}]
  },
  'Basic Wilding': {
    effects: [{type:'display_note', text:'1~2레벨 드루이드 재주 1개 습득'}]
  },
  'Order Spell': {
    effects: [{type:'display_note', text:'교단의 초기 집중 주문 습득. 집중 포인트 풀 획득/확장'}]
  },
  'Advanced Wilding': {
    effects: [{type:'display_note', text:'드루이드 재주 1개 습득 (드루이드 레벨 = 캐릭터 레벨/2). 반복 선택 가능'}]
  },
  'Primal Breadth': {
    effects: [{type:'display_note', text:'드루이드 원형 주문 슬롯 수 증가'}]
  },
  'Expert Druid Spellcasting': {
    effects: [{type:'display_note', text:'주문 공격/DC 전문가. 4랭크 슬롯'}]
  },
  'Master Druid Spellcasting': {
    effects: [{type:'display_note', text:'주문 공격/DC 달인. 7랭크 슬롯'}]
  },

  // ── 파이터 멀티클래스 ──
  'Fighter Dedication': {
    choice: {type:'skill', label:'곡예 또는 운동 중 숙련시킬 기술 선택', filter:{custom:['acrobatics','athletics']}},
    effects: [{type:'skill_trained', skill:'$choice'}, {type:'display_note', text:'군용 무기 숙련됨. 파이터 클래스 DC 숙련'}]
  },
  'Basic Maneuver': {
    effects: [{type:'display_note', text:'1~2레벨 파이터 재주 1개 습득'}]
  },
  'Fighter Resiliency': {
    effects: [{type:'hp_bonus', value:3}, {type:'display_note', text:'파이터 원형 재주당 HP +3'}]
  },
  'Reactive Striker': {
    effects: [{type:'grant_action', action:'aoo'}, {type:'display_note', text:'반격 타격(Reactive Strike) 반응 획득'}]
  },
  'Advanced Maneuver': {
    effects: [{type:'display_note', text:'파이터 재주 1개 습득 (파이터 레벨 = 캐릭터 레벨/2). 반복 선택 가능'}]
  },
  'Diverse Weapon Expert': {
    effects: [{type:'display_note', text:'단순/군용 무기 숙련도 전문가. 고급 무기 숙련됨'}]
  },

  // ── 레인저 멀티클래스 ──
  'Ranger Dedication': {
    effects: [{type:'skill_trained', skill:'survival'}, {type:'grant_action', summary:'[1행동] 사냥감 추적 (Hunt Prey) — 시야 내 생물 1명을 사냥감으로 지정. 사냥감에 대해 무시(Ignore) 지형을 사용하여 추적하고, 추적 속도가 전체 속도가 됩니다.'}, {type:'display_note', text:'레인저 클래스 DC 숙련'}]
  },
  "Basic Hunter's Trick": {
    effects: [{type:'display_note', text:'1~2레벨 레인저 재주 1개 습득'}]
  },
  'Ranger Resiliency': {
    effects: [{type:'hp_bonus', value:3}, {type:'display_note', text:'레인저 원형 재주당 HP +3'}]
  },
  "Advanced Hunter's Trick": {
    effects: [{type:'display_note', text:'레인저 재주 1개 습득 (레인저 레벨 = 캐릭터 레벨/2). 반복 선택 가능'}]
  },
  'Master Spotter': {
    effects: [{type:'display_note', text:'지각 숙련도 달인으로 증가'}]
  },

  // ── 로그 멀티클래스 ──
  'Rogue Dedication': {
    effects: [{type:'skill_trained', skill:'stealth'}, {type:'skill_trained', skill:'thievery'}, {type:'grant_action', summary:'기습 공격 (Surprise Attack) — 전투 시작 시 선제를 굴리기 전에 행동한 적이 아닌 모든 생물은 당신에게 무방비(flat-footed)입니다. 첫 턴이 끝나면 해제.'}, {type:'display_note', text:'기술 재주 1개 습득. 경갑 숙련됨. 로그 클래스 DC 숙련'}]
  },
  'Basic Trickery': {
    effects: [{type:'display_note', text:'1~2레벨 로그 재주 1개 습득'}]
  },
  'Sneak Attacker': {
    effects: [{type:'damage_note', scaling:{1:'1d4',6:'1d6'}, damage_type:'정밀'}, {type:'display_note', text:'은밀 공격 1d4 (6레벨에 1d6). 레벨 스케일링 없음'}]
  },
  'Advanced Trickery': {
    effects: [{type:'display_note', text:'로그 재주 1개 습득 (로그 레벨 = 캐릭터 레벨/2). 반복 선택 가능'}]
  },
  'Skill Mastery': {
    effects: [{type:'display_note', text:'기술 1개 전문가→달인, 다른 1개 숙련→전문가. 기술 재주 1개. 최대 5회'}]
  },
  'Uncanny Dodge': {
    effects: [{type:'display_note', text:'이점 부정(Deny Advantage) 획득. 은폐/기습의 방어불가 면역'}]
  },
  'Evasiveness': {
    effects: [{type:'display_note', text:'반사 내성 숙련도 달인으로 증가'}]
  },

  // ── 위치 멀티클래스 ──
  'Witch Dedication': {
    effects: [{type:'skill_trained', skill:'occultism'}, {type:'display_note', text:'후원자 선택. 사역마 획득. 캔트립 1개. 주문 공격/DC 숙련됨. 핵심 속성: 지능'}]
  },
  'Basic Witch Spellcasting': {
    effects: [{type:'display_note', text:'기초 주문시전 혜택'}]
  },
  'Basic Witchcraft': {
    effects: [{type:'familiar_abilities', value:1}, {type:'display_note', text:'1~2레벨 위치 재주 1개. 사역마 능력 3개 (기본 2개→3개)'}]
  },
  'Advanced Witchcraft': {
    effects: [{type:'display_note', text:'위치 재주 1개 습득 (위치 레벨 = 캐릭터 레벨/2). 반복 선택 가능'}]
  },
  "Patron's Breadth": {
    effects: [{type:'display_note', text:'위치 원형 주문 슬롯 수 증가'}]
  },
  'Expert Witch Spellcasting': {
    effects: [{type:'display_note', text:'주문 공격/DC 전문가. 4랭크 슬롯'}]
  },
  'Master Witch Spellcasting': {
    effects: [{type:'display_note', text:'주문 공격/DC 달인. 7랭크 슬롯'}]
  },

  // ── 위저드 멀티클래스 ──
  'Wizard Dedication': {
    effects: [{type:'skill_trained', skill:'arcana'}, {type:'display_note', text:'주문서 획득 (캔트립 4개, 매일 2개 준비). 주문 공격/DC 숙련됨. 핵심 속성: 지능. 학파 선택'}]
  },
  'Arcane School Spell': {
    effects: [{type:'display_note', text:'학파의 초기 학파 주문 습득. 집중 포인트 풀 획득'}]
  },
  'Basic Arcana': {
    effects: [{type:'display_note', text:'1~2레벨 위저드 재주 1개 습득'}]
  },
  'Basic Wizard Spellcasting': {
    effects: [{type:'display_note', text:'기초 주문시전 혜택. 주문서에 주문 추가'}]
  },
  'Advanced Arcana': {
    effects: [{type:'display_note', text:'위저드 재주 1개 습득 (위저드 레벨 = 캐릭터 레벨/2). 반복 선택 가능'}]
  },
  'Arcane Breadth': {
    effects: [{type:'display_note', text:'위저드 원형 주문 슬롯 수 증가'}]
  },
  'Expert Wizard Spellcasting': {
    effects: [{type:'display_note', text:'주문 공격/DC 전문가. 4랭크 슬롯'}]
  },
  'Master Wizard Spellcasting': {
    effects: [{type:'display_note', text:'주문 공격/DC 달인. 7랭크 슬롯'}]
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
    familiarWeapons: [],
    martialExperience: false,
    unburdenedIron: false,
    adoptedAncestries: [],
    extraSenses: [],
    damage_notes: [],
    notes: [],
    cantrip_bonus: 0,
    familiar_abilities: 0,
  };

  const level = getLevel();

  // ═══ 재주 부여 효과 재구축: 이전 사이클 정리 ═══

  // grant_lore: 지식 슬롯 초기화
  (state._featGrantedLores || []).forEach(entry => {
    const nameEl = document.getElementById('lore-name-' + entry.slot);
    const profEl = document.getElementById('sk-prof-' + entry.slot);
    if (nameEl && nameEl.value === entry.name) {
      nameEl.value = '';
      if (profEl) profEl.value = '0';
    }
  });
  state._featGrantedLores = [];

  // skill_trained: 재주가 부여한 기술 숙련 초기화
  (state._featGrantedSkills || []).forEach(entry => {
    const profEl = document.getElementById('sk-prof-' + entry.skill);
    if (profEl && parseInt(profEl.value || 0) === entry.rank) profEl.value = '0';
  });
  state._featGrantedSkills = [];

  // grant_focus_spell: _sourceFeat 있는 집중 주문 제거
  if (state.spells?.focus) {
    state.spells.focus = state.spells.focus.filter(s => !s._sourceFeat);
  }

  // grant_innate_spell: _sourceFeat 있는 선천 주문 제거
  if (state.spells?.innate) {
    state.spells.innate = state.spells.innate.filter(s => !s._sourceFeat);
  }

  // grant_weapon: 부모 재주 생존 확인 — 부모 없으면 제거 (사용자 룬 설정 보존)
  const allFeatNames = Object.values(state.feats).flat().filter(f => f).map(f => _extractEnName(f.name));
  state.weapons = (state.weapons || []).filter(w => !w._fromFeat || allFeatNames.includes(w._fromFeat));

  // grant_feat: 부모 재주 생존 확인 — 부모 없으면 제거 (사용자 choice 보존)
  const allFeatFullNames = Object.values(state.feats).flat().filter(f => f).map(f => f.name);
  Object.values(state.feats).forEach(arr => {
    if (!arr) return;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i]?._grantedBy && !allFeatFullNames.includes(arr[i]._grantedBy)) {
        arr.splice(i, 1);
      }
    }
  });

  // vision_upgrade: 재주 부여 시야 초기화 → 혈통/유산 기본값 복원
  if (state._featVisionUpgrade) {
    state.vision = state.selectedAncestry?.vision || '없음';
    if (state.selectedHeritage?.vision) state.vision = state.selectedHeritage.vision;
    state._featVisionUpgrade = false;
  }

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
      // choiceEffects: 선택값에 따른 추가 효과
      if (def.choiceEffects && feat.choice && def.choiceEffects[feat.choice]) {
        def.choiceEffects[feat.choice].forEach(eff => {
          _applyOneEffect(fb, eff, feat, level);
        });
      }
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
        // skill_multi: 쉼표 구분된 다중 ID 지원
        const ids = sid.includes(',') ? sid.split(',') : [sid];
        ids.forEach(id => {
          const s = id.trim();
          if (!s) return;
          if (!fb.skills[s]) fb.skills[s] = {min_rank:0, bonus:0};
          fb.skills[s].min_rank = Math.max(fb.skills[s].min_rank, 2);
          const profEl = document.getElementById('sk-prof-' + s);
          if (profEl && parseInt(profEl.value || 0) < 2) {
            state._featGrantedSkills.push({skill: s, rank: 2, feat: feat.name});
            profEl.value = '2';
          }
        });
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
      if (eff.action && !fb.actions.includes(eff.action)) fb.actions.push(eff.action);
      // summary 기반 동적 행동 (ACTION_DB에 없는 행동) — 레거시
      if (eff.summary && feat.name) {
        if (!fb._customActions) fb._customActions = [];
        fb._customActions.push({featName: feat.name, summary: eff.summary});
      }
      // actionName 기반: desc에서 자동 추출 (정본 = feat_db.desc)
      if (eff.actionName && feat.name) {
        if (!fb._customActions) fb._customActions = [];
        fb._customActions.push({featName: feat.name, actionName: eff.actionName});
      }
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
    case 'weapon_familiarity': {
      // 해당 무기를 한 카테고리 낮춰 취급 (군용→단순, 고급→군용)
      if (eff.weapons) eff.weapons.forEach(w => {
        const resolved = (w === '$choice') ? (feat.choice || '') : w;
        if (resolved && !fb.familiarWeapons.includes(resolved)) fb.familiarWeapons.push(resolved);
      });
      break;
    }
    case 'weapon_trained': {
      // 특정 무기에 직접 훈련됨(trained) 부여
      if (!fb.trainedWeapons) fb.trainedWeapons = [];
      if (eff.weapons) eff.weapons.forEach(w => { if (!fb.trainedWeapons.includes(w)) fb.trainedWeapons.push(w); });
      break;
    }
    case 'grant_adopted_feat': {
      // _applyFeatChoice에서 직접 처리 — 여기서는 아무것도 안 함
      break;
    }
    case 'adopted_ancestry': {
      // 양자 혈통 — 선택한 혈통의 재주에 접근
      if (feat.choice) {
        const traitName = ANCESTRY_NAME_MAP[feat.choice] || feat.choice;
        if (!fb.adoptedAncestries) fb.adoptedAncestries = [];
        if (!fb.adoptedAncestries.includes(traitName)) fb.adoptedAncestries.push(traitName);
      }
      break;
    }
    case 'grant_feat': {
      // 재주 자동 부여
      if (eff.feat && feat.name) {
        const grantName = eff.feat;
        const alreadyHas = Object.values(state.feats).flat().some(f => f && f.name && f.name.includes(grantName.split(' (')[0]));
        if (!alreadyHas) {
          if (!state.feats.general) state.feats.general = [];
          state.feats.general.push({name: grantName, level: 1, _auto: true, _grantedBy: feat.name});
          // 부여된 재주에 choice가 필요하면 모달 열기
          const grantedIdx = state.feats.general.length - 1;
          const grantedFeat = state.feats.general[grantedIdx];
          if (!grantedFeat.choice && typeof checkFeatChoice === 'function') {
            setTimeout(() => checkFeatChoice(grantName, 'general', grantedIdx), 0);
          }
        }
      }
      break;
    }
    case 'extra_sense': {
      if (eff.sense && !fb.extraSenses.includes(eff.sense)) fb.extraSenses.push(eff.sense);
      break;
    }
    case 'vision_upgrade': {
      state.vision = eff.vision;
      state._featVisionUpgrade = true;
      break;
    }
    case 'unburdened_iron': {
      fb.unburdenedIron = true;
      break;
    }
    case 'martial_experience': {
      // 미숙련 무기에 레벨을 숙련 보너스로, 11레벨에서 모든 무기 숙련
      fb.martialExperience = true;
      break;
    }
    case 'grant_innate_spell': {
      // 고정 선천 주문 부여 (선택 불필요)
      if (eff.spell && feat.name) {
        if (!state.spells.innate) state.spells.innate = [];
        const existing = state.spells.innate.find(s => s._sourceFeat === feat.name && s.name === eff.spell);
        if (!existing) {
          state.spells.innate.push({
            name: eff.spell, tradition: eff.tradition || '', type: eff.spellType || 'spell',
            uses: eff.uses || '하루 1회', _sourceFeat: feat.name, _source: feat.name
          });
        }
      }
      break;
    }
    case 'grant_focus_spell': {
      let spellName = eff.spell;
      if (spellName === '$domain_initial') {
        const dom = feat.choice && typeof DOMAIN_DB !== 'undefined' ? DOMAIN_DB[feat.choice] : null;
        spellName = dom && dom.initial ? dom.initial : '';
      } else if (spellName === '$domain_advanced') {
        const dom = feat.choice && typeof DOMAIN_DB !== 'undefined' ? DOMAIN_DB[feat.choice] : null;
        spellName = dom && dom.advanced ? dom.advanced : '';
      }
      if (spellName && !spellName.startsWith('$') && feat.name) {
        if (!state.spells.focus) state.spells.focus = [];
        const existing = state.spells.focus.find(s => s._sourceFeat === feat.name && s.name === spellName);
        if (!existing) {
          state.spells.focus.push({name: spellName, _auto: true, _sourceFeat: feat.name, _source: feat.name.split(' (')[0].trim()});
        }
      }
      break;
    }
    case 'grant_lore': {
      // 빈 지식 슬롯을 찾아 이름 설정 + 숙련 부여
      let loreName = eff.name || '';
      if (loreName === '$choice') loreName = feat.choice || '';
      if (!loreName) break;
      const slots = ['lore1','lore2'];
      for (const sid of slots) {
        const nameEl = document.getElementById('lore-name-'+sid);
        const profEl = document.getElementById('sk-prof-'+sid);
        if (!nameEl) continue;
        if (nameEl.value === loreName) {
          if (profEl && parseInt(profEl.value||0) < 2) profEl.value = '2';
          if (!fb.skills[sid]) fb.skills[sid] = {min_rank:0, bonus:0};
          fb.skills[sid].min_rank = Math.max(fb.skills[sid].min_rank, 2);
          state._featGrantedLores.push({slot: sid, name: loreName, feat: feat.name});
          break;
        }
        if (!nameEl.value) {
          nameEl.value = loreName;
          if (profEl && parseInt(profEl.value||0) < 2) profEl.value = '2';
          if (!fb.skills[sid]) fb.skills[sid] = {min_rank:0, bonus:0};
          fb.skills[sid].min_rank = Math.max(fb.skills[sid].min_rank, 2);
          state._featGrantedLores.push({slot: sid, name: loreName, feat: feat.name});
          break;
        }
      }
      break;
    }

    case 'grant_weapon': {
      // 재주가 부여하는 무기를 state.weapons에 추가 (중복 방지)
      const wName = eff.weapon_name || '';
      if (!wName) break;
      const _fEN = _extractEnName(feat.name);
      const already = state.weapons.some(w => w._fromFeat === _fEN);
      if (!already) {
        const wData = {
          name: wName,
          category: eff.weapon_category || 'unarmed',
          dmg: eff.damage || '',
          range: eff.range || 0,
          traits: eff.traits || [],
          _fromFeat: _fEN,
          _potency: 0, _striking: 0, _propertyRunes: [], _stowed: false, _twoHand: false
        };
        state.weapons.push({id:'w-'+Date.now(), ...wData});
      }
      break;
    }
  }
}

// ── 헬퍼 ──

function _extractEnName(featFullName) {
  if (!featFullName) return '';
  // 괄호 안 영문명 추출 시도
  const m = featFullName.match(/\(([^)]+)\)$/);
  if (m) return m[1].trim();
  // 영문명이 없으면 FEAT_DB에서 한국어 이름으로 매칭
  const nameKo = featFullName.split(' (')[0].trim();
  if (typeof FEAT_DB !== 'undefined') {
    const found = FEAT_DB.find(f => f && f.name_ko === nameKo);
    if (found) return found.name_en || '';
  }
  return '';
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
  // muse_pick: SUBCLASS_DB에서 이름 조회
  const nameEn = _extractEnName(feat.name);
  const def = FEAT_EFFECTS[nameEn];
  if (def?.choice?.type === 'muse_pick' && typeof SUBCLASS_DB !== 'undefined') {
    const muse = SUBCLASS_DB.find(s => s.id === feat.choice);
    if (muse) return muse.name_ko + ' ' + (muse.subclass_type || '뮤즈');
  }
  // 커스텀 옵션이면 FEAT_EFFECTS의 options 검색
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

  const isSpellChoice = choiceDef.type === 'spell_cantrip';
  document.getElementById('modal-title').textContent = choiceDef.label || '선택';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  const detail = document.getElementById('modal-detail');
  if (detail) { detail.style.display = 'none'; }
  // spell_cantrip: 닫기/취소/선택 전부 숨김 (선택 필수, detail 내 버튼만 사용)
  if (isSpellChoice || choiceDef.type === 'lore' || choiceDef.type === 'custom' || choiceDef.type === 'muse_pick' || choiceDef.type === 'ancestry_pick' || choiceDef.type === 'feat_pick' || choiceDef.type === 'skill_multi' || choiceDef.type === 'weapon_pick') {
    const closeBtn = document.querySelector('.modal-close');
    const closeBtnM = document.getElementById('modal-close-m');
    const footer = document.querySelector('.modal-footer');
    if (closeBtn) closeBtn.style.display = 'none';
    if (closeBtnM) closeBtnM.style.display = 'none';
    if (footer) footer.style.display = 'none';
  }

  const listEl = document.querySelector('.modal-list');
  if (listEl) { listEl.style.display = ''; listEl.style.width = '100%'; listEl.style.borderRight = 'none'; }

  const container = document.getElementById('modal-options');
  container.innerHTML = '';

  if (choiceDef.type === 'skill' || choiceDef.type === 'skill_trained') {
    SKILLS.forEach(sk => {
      if (sk.isLore) return; // 지식 기술은 별도 처리
      if (choiceDef.filter?.custom && !choiceDef.filter.custom.includes(sk.id)) return;
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
  } else if (choiceDef.type === 'skill_multi') {
    // ── 기술 다중 선택 (체크 형태) ──
    const maxPick = choiceDef.count || 2;
    const selected = new Set();
    modalContext._multiSelected = selected;

    // 하단에 확정 버튼 표시
    const footer = document.querySelector('.modal-footer');
    if (footer) {
      footer.style.display = '';
      footer.innerHTML = `<button class="btn btn-confirm" id="skill-multi-confirm" disabled style="opacity:.4;cursor:not-allowed;">0/${maxPick}개 선택됨 — 선택 완료</button>`;
      document.getElementById('skill-multi-confirm').onclick = () => {
        if (selected.size === maxPick) _applyFeatChoice([...selected].join(','));
      };
    }

    function updateMultiBtn() {
      const btn = document.getElementById('skill-multi-confirm');
      if (!btn) return;
      const done = selected.size === maxPick;
      btn.textContent = `${selected.size}/${maxPick}개 선택됨 — 선택 완료`;
      btn.disabled = !done;
      btn.style.opacity = done ? '1' : '.4';
      btn.style.cursor = done ? 'pointer' : 'not-allowed';
    }

    SKILLS.forEach(sk => {
      if (sk.isLore) return;
      const rank = parseInt(document.getElementById('sk-prof-' + sk.id)?.value || 0);
      if (choiceDef.filter?.exclude_trained && rank >= 2) return;

      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      const check = document.createElement('span');
      check.className = 'skill-multi-check';
      check.style.cssText = 'width:18px;height:18px;border:2px solid var(--border,#555);border-radius:4px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;transition:all .15s;';
      row.appendChild(check);
      const label = document.createElement('span');
      label.className = 'opt-row-name';
      label.textContent = `${sk.name} (${sk.en})`;
      row.appendChild(label);

      row.onclick = () => {
        if (selected.has(sk.id)) {
          selected.delete(sk.id);
          check.textContent = '';
          check.style.background = '';
          check.style.borderColor = 'var(--border,#555)';
          row.classList.remove('selected');
        } else {
          if (selected.size >= maxPick) return; // 최대 도달
          selected.add(sk.id);
          check.textContent = '✓';
          check.style.background = 'var(--accent,#d4a04a)';
          check.style.borderColor = 'var(--accent,#d4a04a)';
          check.style.color = '#000';
          row.classList.add('selected');
        }
        updateMultiBtn();
      };
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
  } else if (choiceDef.type === 'muse_pick') {
    // ── 다양한 뮤즈 전용: 기존 서브클래스 모달과 완전히 동일한 UI ──
    // 모달을 리셋하고 서브클래스 모달 방식으로 전환
    overlay.classList.add('hidden'); // 현재 feat-choice 모달 닫기

    // 이미 선택된 뮤즈 수집
    const takenMuses = new Set();
    if (state.selectedSubclass) takenMuses.add(state.selectedSubclass.id);
    Object.values(state.feats).flat().forEach(ff => {
      if (ff?.name?.includes('다양한 뮤즈') && ff.choice) takenMuses.add(ff.choice);
    });

    // 서브클래스 모달 열기 (muse_pick 모드)
    modalType = 'muse_pick';
    modalContext = {featType, featIndex, choiceDef, takenMuses};
    overlay.classList.remove('hidden');
    document.getElementById('modal-title').textContent = '추가 뮤즈 선택';
    const searchEl2 = document.getElementById('modal-search');
    if (searchEl2) { searchEl2.style.display = 'none'; searchEl2.value = ''; }
    const fbar2 = document.getElementById('modal-filterbar');
    if (fbar2) fbar2.innerHTML = '';
    // 목록 + 상세 패널 레이아웃 복원 (서브클래스 모달과 동일)
    const listEl2 = document.querySelector('.modal-list');
    if (listEl2) { listEl2.style.display = ''; listEl2.style.width = ''; listEl2.style.borderRight = ''; }
    const detail2 = document.getElementById('modal-detail');
    if (detail2) detail2.style.display = '';
    const confirmBtn2 = document.querySelector('.btn-confirm');
    if (confirmBtn2) confirmBtn2.style.display = '';
    const closeBtn2 = document.querySelector('.modal-close');
    if (closeBtn2) closeBtn2.style.display = '';
    const closeBtnM2 = document.getElementById('modal-close-m');
    if (closeBtnM2) closeBtnM2.style.display = '';
    const footer2 = document.querySelector('.modal-footer');
    if (footer2) footer2.style.display = '';

    // 필터링된 뮤즈 목록으로 renderOptions 호출
    const museList = typeof SUBCLASS_DB !== 'undefined'
      ? SUBCLASS_DB.filter(s => s.class_id === 'bard' && !takenMuses.has(s.id))
      : [];
    renderOptions(museList);
    return; // 이후 로직 스킵
  } else if (choiceDef.type === 'custom' && choiceDef.options) {
    // 영역 입문: 신격 영역으로 필터링
    let filteredOpts = choiceDef.options;
    if (choiceDef.label && choiceDef.label.includes('영역') && state.deity && typeof DEITY_DB !== 'undefined') {
      const deity = DEITY_DB.find(d => d.id === state.deity);
      if (deity && deity.domains && deity.domains.length > 0) {
        filteredOpts = choiceDef.options.filter(opt => deity.domains.includes(opt.name));
        const note = document.createElement('div');
        note.style.cssText = 'font-size:11px;color:var(--accent);padding:8px 12px;border-bottom:1px solid var(--border);';
        note.textContent = `${deity.name_ko}의 영역: ${deity.domains.join(', ')}`;
        container.appendChild(note);
      }
    }
    if (choiceDef.repeatable && choiceDef.label && choiceDef.label.includes('영역')) {
      const curFeat = (featType && featIndex != null && state.feats[featType]) ? state.feats[featType][featIndex] : null;
      const featBaseName = curFeat && curFeat.name ? curFeat.name.split(' (')[0] : '';
      const alreadyChosen = new Set();
      Object.values(state.feats).flat().forEach(f => {
        if (f && f.name && f.name.split(' (')[0] === featBaseName && f.choice) alreadyChosen.add(f.choice);
      });
      filteredOpts = filteredOpts.filter(opt => !alreadyChosen.has(opt.id));
    }
    if (choiceDef.filterByInitiated) {
      const initiatedDomains = new Set();
      Object.values(state.feats).flat().forEach(f => {
        if (f && f.name && (f.name.includes('Domain Initiate') || f.name.includes('영역 입문')) && f.choice) {
          initiatedDomains.add(f.choice);
        }
      });
      filteredOpts = filteredOpts.filter(opt => initiatedDomains.has(opt.id));
    }
    // 영역 선택: 좌측 목록 + 우측 주문 설명 레이아웃
    const isDomain = choiceDef.label && choiceDef.label.includes('영역');
    if (isDomain && typeof DOMAIN_DB !== 'undefined') {
      // 모달 레이아웃 재구성: list+detail 패널 사용
      const listEl2 = document.querySelector('.modal-list');
      if (listEl2) { listEl2.style.width = '140px'; listEl2.style.borderRight = '1px solid var(--border,#444)'; }
      const detail2 = document.getElementById('modal-detail');
      if (detail2) { detail2.style.display = ''; detail2.innerHTML = '<div style="color:#888;padding:40px 16px;text-align:center;">영역을 선택하세요</div>'; }
      // 확정 버튼 표시
      const footer2 = document.querySelector('.modal-footer');
      if (footer2) { footer2.style.display = ''; footer2.innerHTML = '<button class="btn btn-cancel" onclick="closeModal()">취소</button><button class="btn btn-confirm" id="domain-confirm-btn" disabled style="opacity:0.5;">확정</button>'; }

      let selectedDomainId = null;

      filteredOpts.forEach(opt => {
        const row = document.createElement('div');
        row.className = 'opt-row';
        row.style.cssText = 'padding:10px 12px;cursor:pointer;border-bottom:1px solid var(--border,#333);font-size:13px;';
        row.textContent = opt.name;
        row.onclick = () => {
          selectedDomainId = opt.id;
          container.querySelectorAll('.opt-row').forEach(d => { d.style.background = ''; d.style.color = ''; });
          row.style.background = 'var(--accent,#c9a84c)'; row.style.color = '#000';
          const dom = DOMAIN_DB[opt.id];
          const isAdvanced = !!choiceDef.filterByInitiated;
          const spellName = dom ? (isAdvanced ? dom.advanced : dom.initial) : null;
          const spell = spellName && typeof SPELL_DB !== 'undefined' ? SPELL_DB.find(s => s.name_ko === spellName) : null;
          if (detail2) {
            if (spell) {
              detail2.innerHTML = `<div style="padding:16px;"><div style="font-size:16px;font-weight:bold;color:var(--accent,#c9a84c);margin-bottom:8px;">${spell.name_ko} <span style="font-size:11px;color:#888;">${spell.name_en}</span></div>`
                + (spell.traits ? `<div style="margin-bottom:8px;">${spell.traits.map(t => '<span style="display:inline-block;background:#333;color:#ccc;padding:2px 6px;border-radius:3px;font-size:10px;margin:1px 2px;">'+t+'</span>').join('')}</div>` : '')
                + `<div style="color:#bbb;line-height:1.7;font-size:13px;">${spell.desc||'설명 없음'}</div></div>`;
            } else if (spellName) {
              detail2.innerHTML = `<div style="padding:16px;"><div style="font-size:16px;font-weight:bold;color:var(--accent);">${spellName}</div><div style="color:#888;margin-top:8px;">주문 상세 정보가 DB에 없습니다.</div></div>`;
            } else {
              detail2.innerHTML = `<div style="color:#888;padding:40px 16px;text-align:center;">${opt.name} 영역의 ${isAdvanced?'고급':'초기'} 주문이 아직 번역되지 않았습니다.</div>`;
            }
          }
          const cBtn = document.getElementById('domain-confirm-btn');
          if (cBtn) { cBtn.disabled = false; cBtn.style.opacity = '1'; cBtn.onclick = () => _applyFeatChoice(selectedDomainId); }
        };
        container.appendChild(row);
      });
    } else {
      filteredOpts.forEach(opt => {
        const row = document.createElement('div');
        row.className = 'opt-row';
        row.style.cursor = 'pointer';
        row.innerHTML = `<span class="opt-row-name">${opt.name}</span>`;
        row.onclick = () => _applyFeatChoice(opt.id);
        container.appendChild(row);
      });
    }
  } else if ((choiceDef.type === 'spell_cantrip' || choiceDef.type === 'spell_rank') && typeof SPELL_DB !== 'undefined') {
    const tradition = choiceDef.tradition || 'arcane';
    const isRankSpell = choiceDef.type === 'spell_rank';
    const targetRank = choiceDef.rank || 1;
    let cantrips;
    if (isRankSpell) {
      cantrips = SPELL_DB.filter(sp => !sp.is_cantrip && !sp.is_focus && sp.rank && sp.rank <= targetRank && sp.traditions && sp.traditions.includes(tradition));
    } else if (tradition === 'any' || tradition === '$other') {
      const classTrad = state.selectedClass?.tradition || '';
      cantrips = SPELL_DB.filter(sp => sp.is_cantrip && !sp.is_focus && sp.traditions && (!classTrad || !sp.traditions.includes(classTrad)));
    } else {
      cantrips = SPELL_DB.filter(sp => sp.is_cantrip && !sp.is_focus && sp.traditions && sp.traditions.includes(tradition));
    }
    cantrips.sort((a,b) => (a.name_ko||'').localeCompare(b.name_ko||''));

    // 주문 선택 모달과 동일한 구조로 전환
    if (searchEl) {
      searchEl.style.display = '';
      searchEl.value = '';
      searchEl.oninput = () => {
        const q = searchEl.value.toLowerCase();
        container.querySelectorAll('.opt-row').forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      };
    }
    // 디테일 패널 활성화
    if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">캔트립을 선택하면 상세 정보가 표시됩니다.</div>'; }
    if (listEl) { listEl.style.width = ''; listEl.style.borderRight = ''; }
    modalContext._selectedSpell = null;

    cantrips.forEach(sp => {
      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      const actions = typeof getActionIcons==='function' ? getActionIcons(sp.actions) : (sp.actions||'');
      row.innerHTML = `<span class="opt-row-icon">📄</span><span class="opt-row-name">${sp.name_ko}</span>${actions?`<span class="opt-row-actions">${actions}</span>`:''}`;
      row.onclick = () => {
        modalContext._selectedSpell = sp.name_ko;
        if (window.innerWidth <= 900) {
          // 모바일: 아코디언
          document.querySelectorAll('.opt-row-detail.open').forEach(d => d.classList.remove('open'));
          document.querySelectorAll('.opt-row.expanded').forEach(r => r.classList.remove('expanded'));
          row.classList.add('expanded');
          let detailDiv = row.nextElementSibling;
          if (!detailDiv || !detailDiv.classList.contains('opt-row-detail')) {
            detailDiv = document.createElement('div'); detailDiv.className = 'opt-row-detail'; row.after(detailDiv);
          }
          const rankStr = sp.is_cantrip ? '캔트립' : `랭크 ${sp.rank}`;
          const spTraits = [...(sp.traditions||[]),...(sp.traits||[])].map(t => typeof traitTag==='function' ? traitTag(t) : `<span class="tag">${t}</span>`).join('');
          const spDesc = sp.desc || sp.summary || '';
          detailDiv.innerHTML = `
            <div style="margin-bottom:4px;"><span class="tag-meta">${rankStr}</span></div>
            ${spTraits ? '<div style="margin-bottom:6px;">'+spTraits+'</div>' : ''}
            <div style="font-size:12px;line-height:1.6;">${spDesc}</div>
            <button onclick="if(modalContext._selectedSpell)_applyFeatChoice(modalContext._selectedSpell)" style="width:100%;margin-top:8px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">선택</button>`;
          detailDiv.classList.add('open');
        } else {
          // PC: 우측 패널
          container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
          row.classList.add('selected');
          if (typeof showItemDetail === 'function') showItemDetail(sp);
          // detail 패널에 선택 확정 버튼 추가
          const detailEl = document.getElementById('modal-detail');
          if (detailEl) {
            const btn = document.createElement('button');
            btn.textContent = '이 캔트립 선택';
            btn.style.cssText = 'width:100%;margin-top:12px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;';
            btn.onclick = () => _applyFeatChoice(sp.name_ko);
            detailEl.appendChild(btn);
          }
        }
      };
      container.appendChild(row);
    });
  } else if (choiceDef.type === 'ancestry_pick' && typeof ANCESTRIES !== 'undefined') {
    // 혈통 선택 모달 — 이미 선택한 혈통과 내 혈통 제외
    const myAnc = state.selectedAncestry?.id || '';
    const alreadyAdopted = Object.values(state.feats).flat()
      .filter(f => f && f.name && f.name.includes('양자 혈통') && f.choice)
      .map(f => f.choice);
    const available = ANCESTRIES.filter(a => a.id !== myAnc && !alreadyAdopted.includes(a.id));

    if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; searchEl.oninput = () => {
      const q = searchEl.value.toLowerCase();
      container.querySelectorAll('.opt-row').forEach(r => { r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none'; });
    };}
    if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">혈통을 선택하면 상세 정보가 표시됩니다.</div>'; }
    if (listEl) { listEl.style.width = ''; listEl.style.borderRight = ''; }
    modalContext._selectedSpell = null;

    available.forEach(anc => {
      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      row.innerHTML = `<span class="opt-row-icon">🧬</span><span class="opt-row-name">${anc.name} <span style="color:var(--text2);font-size:10px;">${anc.en}</span></span>`;
      row.onclick = () => {
        container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        modalContext._selectedSpell = anc.id;
        // 상세 정보 표시
        const detailEl = document.getElementById('modal-detail');
        if (detailEl) {
          detailEl.innerHTML = `
            <div class="modal-detail-title">${anc.name}</div>
            <div class="modal-detail-en">${anc.en}</div>
            <div style="margin:12px 0;font-size:13px;line-height:1.7;">
              <div><b>HP:</b> ${anc.hp} | <b>크기:</b> ${anc.size} | <b>속도:</b> ${anc.speed}피트</div>
              <div><b>부스트:</b> ${anc.boosts.join(', ')}</div>
              ${anc.flaws.length ? '<div><b>결함:</b> '+anc.flaws.join(', ')+'</div>' : ''}
              <div><b>특성:</b> ${anc.traits.join(', ')}</div>
            </div>
            <button onclick="_applyFeatChoice(modalContext._selectedSpell)" style="width:100%;margin-top:12px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">이 혈통 선택</button>`;
        }
      };
      container.appendChild(row);
    });
  } else if (choiceDef.type === 'weapon_pick' && typeof WEAPON_DB !== 'undefined') {
    // ── 비일반 무기 선택 모달 ──
    // 군용 무기 전체 숙련 여부 확인
    const martialProf = parseInt(document.getElementById('prof-weapon-martial')?.value || 0);
    const allMartialTrained = martialProf >= 2;

    const candidates = WEAPON_DB.filter(w => {
      if (!w.category || !w.category.includes('비일반')) return false;
      if (allMartialTrained) {
        // 고급 비일반도 허용
        return true;
      } else {
        // 단순/군용 비일반만
        return w.category.startsWith('단순') || w.category.startsWith('군용');
      }
    });

    if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; searchEl.oninput = () => {
      const q = searchEl.value.toLowerCase();
      container.querySelectorAll('.opt-row').forEach(r => { r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none'; });
    };}
    if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">무기를 선택하면 상세 정보가 표시됩니다.</div>'; }
    if (listEl) { listEl.style.width = ''; listEl.style.borderRight = ''; }

    candidates.forEach(w => {
      const catLabel = w.category.replace('(비일반)','').trim();
      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      row.innerHTML = `<span class="opt-row-icon">⚔</span><span class="opt-row-name">${w.name_ko}</span><span style="font-size:10px;color:var(--text2);margin-left:auto;">${catLabel} · ${w.damage||''}</span>`;
      row.onclick = () => {
        container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        // 상세 정보
        const detEl = document.getElementById('modal-detail');
        if (detEl) {
          const traitsHtml = (w.traits||[]).map(t => typeof traitTag==='function' ? traitTag(t) : `<span class="tag">${t}</span>`).join(' ');
          detEl.innerHTML = `
            <div class="modal-detail-title">${w.name_ko}</div>
            <div class="modal-detail-en">${w.name_en||''}</div>
            <div style="margin:8px 0;font-size:13px;">
              <div><b>분류:</b> ${w.category}</div>
              <div><b>피해:</b> ${w.damage||'—'} | <b>부피:</b> ${w.bulk||'—'} | <b>가격:</b> ${w.price||'—'}</div>
              ${w.range ? '<div><b>사거리:</b> '+w.range+'ft.</div>' : ''}
            </div>
            ${traitsHtml ? '<div style="margin:6px 0;">'+traitsHtml+'</div>' : ''}
            <button onclick="_applyFeatChoice('${(w.name_ko||'').replace(/'/g,"\\'")}')" style="width:100%;margin-top:12px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">이 무기 선택</button>`;
        }
      };
      container.appendChild(row);
    });
  } else if (choiceDef.type === 'feat_pick' && typeof FEAT_DB !== 'undefined') {
    // ── 범용 재주 선택 모달 (적응력, 자연 야심, 고급 일반 훈련 등) ──
    let pickCat = choiceDef.pickCategory || 'general';
    if (pickCat === '$class' && state.selectedClass) pickCat = state.selectedClass.id;
    const pickMax = choiceDef.pickMaxLevel || 99;
    const pickTraits = choiceDef.pickTraits || null;

    // 이미 보유한 재주 이름 (중복 방지)
    const ownedNames = new Set();
    for (const arr of Object.values(state.feats)) {
      if (Array.isArray(arr)) arr.forEach(f => { if (f?.name) ownedNames.add(f.name.split(' (')[0].trim()); });
    }

    // 아이우바린 유산 보유 + skipPrereqIfAiuvarin이면 능력치 전제조건 생략
    const isAiuvarin = state.selectedHeritage?.id === 'aiuvarin';
    const skipPrereq = choiceDef.skipPrereqIfAiuvarin && isAiuvarin;
    // 자기 클래스 이름 (헌신 재주에서 자기 클래스 제외용)
    const myClassName = state.selectedClass?.name || '';
    const myClassEn = state.selectedClass?.en || '';

    const candidates = FEAT_DB.filter(f => {
      if (!f) return false;
      if (f.category !== pickCat) return false;
      if (f.feat_level > pickMax) return false;
      if (pickTraits && !(f.traits && f.traits.some(t => pickTraits.includes(t)))) return false;
      // 헌신 재주: 자기 클래스 헌신 제외
      if (pickTraits?.includes('헌신') && f.name_ko) {
        if (myClassName && f.name_ko.includes(myClassName)) return false;
        if (myClassEn && f.name_en && f.name_en.toLowerCase().includes(myClassEn.toLowerCase())) return false;
      }
      // 전제조건 체크 (아이우바린이면 생략 가능)
      if (f.prerequisites && !skipPrereq && typeof _checkPrereqs === 'function' && !_checkPrereqs(f.prerequisites)) return false;
      // 헌신 재주 특수 조건 (다재다능은 skipDedicationLimit으로 무시)
      if (f.traits?.includes('헌신') && !choiceDef.skipDedicationLimit && typeof canTakeDedication === 'function' && !canTakeDedication(f)) return false;
      if (ownedNames.has(f.name_ko)) return false;
      return true;
    });

    if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; searchEl.oninput = () => {
      const q = searchEl.value.toLowerCase();
      container.querySelectorAll('.opt-row').forEach(r => { r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none'; });
    };}
    if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">재주를 선택하면 상세 정보가 표시됩니다.</div>'; }
    if (listEl) { listEl.style.width = ''; listEl.style.borderRight = ''; }

    if (candidates.length === 0) {
      container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text2);">선택 가능한 재주가 없습니다.<br><span style="font-size:11px;">전제조건(능력치 등)을 확인하세요.</span></div>';
      const closeBtn2 = document.querySelector('.modal-close');
      const closeBtnM2 = document.getElementById('modal-close-m');
      const footer2 = document.querySelector('.modal-footer');
      if (closeBtn2) closeBtn2.style.display = '';
      if (closeBtnM2) closeBtnM2.style.display = '';
      if (footer2) { footer2.style.display = ''; footer2.innerHTML = '<button class="btn btn-cancel" onclick="closeModal()">닫기</button>'; }
    }

    candidates.forEach(cf => {
      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      row.innerHTML = `<span class="opt-row-icon">📄</span><span class="opt-row-name">${cf.name_ko}</span><span style="font-size:10px;color:var(--text2);margin-left:auto;">${cf.name_en||''}</span>`;
      row.onclick = () => {
        container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        if (typeof showItemDetail === 'function') showItemDetail(cf);
        const detEl = document.getElementById('modal-detail');
        if (detEl) {
          const btn = document.createElement('button');
          btn.textContent = '이 재주 선택';
          btn.style.cssText = 'width:100%;margin-top:12px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;';
          btn.onclick = () => {
            const fullName = cf.name_ko + (cf.name_en ? ' (' + cf.name_en + ')' : '');
            _applyFeatChoice(fullName);
          };
          detEl.appendChild(btn);
        }
      };
      container.appendChild(row);
    });
  }
}

function _applyFeatChoice(choiceId) {
  if (!modalContext) return;
  const {featType, featIndex, choiceDef} = modalContext;

  // ── skill_multi: 다중 기술 선택 ──
  if (choiceDef?.type === 'skill_multi') {
    state.feats[featType][featIndex].choice = choiceId; // "athletics,stealth" 형태
    renderFeats();
    try { recalcAll(); } catch(e) { console.error(e); }
    save();
    closeModal();
    return;
  }

  // ── feat_pick: 재주 부여 + 연쇄 모달 ──
  if (choiceDef?.type === 'feat_pick') {
    // 부모 재주에 choice 저장 (있으면)
    if (featType && featIndex !== null && state.feats[featType]?.[featIndex]) {
      state.feats[featType][featIndex].choice = choiceId;
    }
    const grantTo = choiceDef.grantTo || 'general';
    const grantedBy = choiceDef._grantedBy || (state.feats[featType]?.[featIndex]?.name || '');
    if (!state.feats[grantTo]) state.feats[grantTo] = [];
    state.feats[grantTo].push({name: choiceId, level: 1, _grantedBy: grantedBy});
    const newIdx = state.feats[grantTo].length - 1;
    renderFeats();
    try { recalcAll(); } catch(e) { console.error(e); }
    save();
    closeModal();
    // 부여된 재주에 선택이 필요하면 연쇄 모달
    if (typeof checkFeatChoice === 'function') {
      checkFeatChoice(choiceId, grantTo, newIdx);
    }
    return;
  }

  state.feats[featType][featIndex].choice = choiceId;

  // spell_cantrip 선택 시 선천적 주문에 추가
  if (choiceDef?.type === 'spell_cantrip' || choiceDef?.type === 'spell_rank') {
    const tradition = choiceDef.tradition || 'arcane';
    const tradKo = {arcane:'비전',divine:'신성',occult:'오컬트',primal:'원시'}[tradition] || tradition;
    const featName = state.feats[featType][featIndex].name || '';
    // 기존에 이 재주로 추가된 선천 주문 제거
    if (!state.spells.innate) state.spells.innate = [];
    state.spells.innate = state.spells.innate.filter(s => s._sourceFeat !== featName);
    // 새 선천 주문 추가
    const spType = choiceDef.type === 'spell_rank' ? 'spell' : 'cantrip';
    const spUses = choiceDef.type === 'spell_rank' ? '하루 1회' : '자유';
    state.spells.innate.push({name: choiceId, tradition: tradKo, type: spType, uses: spUses, _sourceFeat: featName, _source: featName});
    if (typeof renderSpells === 'function') renderSpells();
    // 선천적 주문 탭으로 자동 전환
    if (typeof switchSpellSubtab === 'function') switchSpellSubtab('innate');
  }

  renderFeats();
  try { recalcAll(); } catch(e) { console.error(e); }
  save();
  closeModal();

  // 양자 혈통 선택 완료 후 — 문화 적응의 grant_adopted_feat → feat_pick으로 혈통 재주 선택
  if (choiceDef?.type === 'ancestry_pick') {
    const grantedByFeat = state.feats[featType]?.[featIndex];
    if (grantedByFeat?._grantedBy) {
      const parentFeatName = grantedByFeat._grantedBy;
      const traitName = ANCESTRY_NAME_MAP[choiceId] || choiceId;
      const alreadyGranted = (state.feats.ancestry||[]).some(f => f && f._grantedBy === parentFeatName);
      if (!alreadyGranted) {
        openFeatChoiceModal(null, null, {
          type: 'feat_pick',
          label: traitName + ' 1레벨 혈통 재주 선택',
          pickCategory: 'ancestry',
          pickMaxLevel: 1,
          pickTraits: [traitName],
          grantTo: 'ancestry',
          _grantedBy: parentFeatName
        });
      }
    }
  }
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
