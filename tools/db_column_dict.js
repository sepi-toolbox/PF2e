// ═══════════════════════════════════════════════
//  COLUMN DICTIONARY — 시트별 컬럼 한국어 설명
//
//  export 시 _DICT 시트로 자동 합성됨.
//  사전에 없는 컬럼은 _DICT에 빈 설명으로 표시 → 사용자가 채워서
//  이 파일에 직접 추가하면 영구 보존.
// ═══════════════════════════════════════════════

// 공통 컬럼 — 여러 시트에 동일한 의미로 등장
const COMMON = {
  id:              '고유 식별자 (PK). 영문 슬러그 형태',
  name:            '한국어 이름',
  en:              '영문 이름',
  name_ko:         '한국어 이름',
  name_en:         '영문 이름 (PK 슬러그 생성에 사용)',
  desc:            '본문 설명 (HTML 가능, {{type:key}} 동적 참조 사용 가능)',
  summary:         '간단 요약 (한 줄)',
  traits:          '특성 배열 (예: ["원시","화염"])',
  price:           '가격 (예: "2 gp", "—")',
  bulk:            '부피 (L=경량, 1, 2, … 또는 "—")',
  category:        '카테고리/분류',
  prerequisites:   '전제조건 텍스트 (표시용 — 자동화는 PREREQ_GROUPS 사용. v528~)',
  level:           '레벨',
  group:           '무기/방어구 그룹',
};

// 시트별 특화 컬럼
const PER_SHEET = {
  CLASSES: {
    hp:                  '1레벨 HP (혈통 HP에 더해짐)',
    key_attrs:           '핵심 능력치 enum 배열 (1개=고정, 2+=OR 1택). 예: ["cha"] / ["str","dex"]',
    keyAttr:             '(deprecated) 핵심 능력치 텍스트 — key_attrs로 마이그레이션됨',
    tradition:           '주문 전통 (occult/divine/primal/arcane/any/null)',
    casting:             '시전 방식 (spontaneous=즉흥, prepared=준비, null=비시전)',
    saves:               '내성 굴림 숙련 {fort, ref, will} — 한글 등급',
    perc:                'Perception(지각) 1레벨 숙련도 (한글 등급)',
    fixed_skills:        '자동 부여되는 기술 ID 배열 (SKILLS.id 사용)',
    choice_skill_groups: '선택형 기술 그룹 (이중 배열). 외부=그룹들, 내부=한 그룹에서 1택',
    free_skill_count:    '자유 선택 가능한 추가 기술 수 (실제로는 INT에 더해짐)',
    deity_skill:         '신격이 추가 기술 1개 부여하는지 여부 (클레릭 전용 플래그)',
  },
  SUBCLASS_DB: {
    class_id:        '소속 클래스 id',
    subclass_type:   '서브클래스 타입 (뮤즈/교리/교단/연구분야 등)',
    granted_skills:  '자동 부여 기술 ID 배열 (SKILLS.id)',
    granted_feats:   '자동 부여 재주 ID 배열 (FEAT_DB.id, 모두 lv 1 적용)',
    granted_spells:  '자동 부여 주문 객체 배열 [{lv, type, rank?, spell_id}]',
    features:        '서브클래스 특성 객체 배열 [{lv, name_ko, name_en, desc}]',
    prof_changes:    '숙련도 변경 객체 {target: {level: rank}} (예: 클레릭 교리)',
  },
  ANCESTRIES: {
    hp:             '혈통 HP (클래스 HP에 더해짐)',
    size:           '크기 (소형/중형/대형)',
    speed:          '이동력 (피트)',
    boosts:         '고정 능력치 부스트 enum 배열 (예: ["con","wis"])',
    boost_choices:  '선택형 부스트 그룹 (이중배열, 그룹당 1택)',
    free_boosts:    '자유 능력치 부스트 슬롯 수',
    flaws:          '고정 능력치 결점 enum 배열',
    flaw_choices:   '선택형 결점 그룹 (이중배열)',
    free_flaws:     '자유 결점 슬롯 수',
    traits:         'TRAIT_DB.id 외래키 배열 (예: ["드워프","인간형"]). v526~ id 참조',
    vision:         '시야 enum (none/low-light/darkvision/greater-darkvision). v526~',
    languages:      'LANGUAGES.id 외래키 배열 (예: ["common","dwarven"]). v526~ id 참조',
    bonusLangs:     'INT에 더해지는 기본 추가 언어 슬롯 수 (인간만 1, 나머지 0). v528~',
    features:       'FEAT_DB.id 외래키 배열 — 자동 부여 재주 (예: halfling=["keen-eyes"]). v528~',
    grantWeapon:    'WEAPON_DB.id (무료 획득 무기. dwarf=clan-dagger). v528~',
  },
  LANGUAGES: {
    category:       '카테고리 (common/uncommon/rare). v526~',
  },
  VISION_DEFS: {
    rank:           '시야 우선순위 (높을수록 더 좋은 시야). 비교 시 사용',
  },
  TRAIT_DB: {
    desc:           '특성 효과 설명 (무기 트레이트는 게임 메카닉, 혈통/생물 트레이트는 분류용)',
    type:           '특성 분류: weapon(무기 메카닉) / damage(피해 종류) / ancestry(혈통) / creature(생물형) / mechanic(범용 메커닉) / rarity(희귀도). v528~',
  },
  PREREQ_GROUPS: {
    group_id:  'PREREQ_GROUPS PK — FEAT_DB.prereq_group_id가 참조. 같은 group_id 행 = 묶인 조건',
    logic:     'and(기본 — 모두 만족) / or(같은 group_id 내 OR 행끼리 하나만 만족)',
    type:      '조건 타입: 능력치 enum(str/dex/con/int/wis/cha) / SKILLS.id (religion 등) / perception / lore / feat / ancestry / heritage / subclass / vision',
    value:     '값: 능력치=최소 부스트(2/4/...) / 기술/지각/lore=숙련도(2/4/6/8) / feat=영문명 / ancestry/heritage/subclass=한글명 / vision=시야 enum',
  },
  EFFECT_GROUPS: {
    group_id:        'EFFECT_GROUPS PK — FEAT_DB.effect_group_id 또는 CHOICE_OPTIONS.effect_group_id가 참조. eg-{feat.id} (공통) / eg-{feat.id}-{option.id} (옵션별)',
    type:            '효과 타입 enum: hp_bonus, save_bonus, ac_bonus, speed_bonus, initiative_bonus, skill_bonus, skill_trained, grant_action, grant_focus_spell, grant_innate_spell, grant_feat, grant_feat_if_trained, grant_lore, grant_weapon, grant_adopted_feat, weapon_familiarity, weapon_trained, vision_upgrade, extra_sense, resistance, proficiency, cantrip_slots, spell_slots, dying_threshold, recovery_dc, familiar_abilities, speed_extra, bulk_bonus, unburdened_iron, martial_experience, adopted_ancestry, armor_upgrade, [v534~ heritage] rest_bonus_hp, extra_languages, versatile_ancestry, extra_feat_category, [v535~ background] ability_boost, ability_boost_choice, free_boost_slots, skill_choice, deity_skill, deity_lore ... (display_note/damage_note는 FEAT_DB.auto_note/damage_note로 흡수됨)',
    target:          '식별자 통합 컬럼 — type별 의미: skill_trained=skill id / grant_feat=재주 id / grant_focus_spell|grant_innate_spell=주문명 / grant_action=action id / grant_weapon=무기명 / grant_lore=지식 분야 / vision_upgrade=시야 enum (darkvision/low-light/upgrade) / extra_sense=감각 텍스트(별도 sense 컬럼 사용 가능) / save_bonus=fort/ref/will/all / resistance=피해종류(한글) / weapon_familiarity|weapon_trained=무기명(행 펼침) / proficiency=DOM id suffix / extra_feat_category=재주 카테고리/혈통명 / ability_boost|ability_boost_choice=능력치 enum / skill_choice=skill id',
    value:           '수치 값 (hp_bonus/save_bonus/speed_bonus/ac_bonus/bulk_bonus/cantrip_slots/dying_threshold/initiative_bonus/recovery_dc/speed_extra/spell_slots/familiar_abilities/free_boost_slots/ability_boost*=1). 또는 "level" 키워드',
    group_no:        '같은 group_id 내 OR 그룹 번호 (1부터). ability_boost_choice / skill_choice — 같은 group_no 끼리 OR (1택)',
    bonus_type:      'circumstance/status/item/untyped (save_bonus/ac_bonus/initiative_bonus 보너스 type)',
    condition:       '한글 조건 텍스트 ("감정 효과", "비전 주문") (save_bonus/ac_bonus 적용 조건)',
    tradition:       'arcane/divine/occult/primal (grant_innate_spell)',
    spell_type:      'spell/cantrip (grant_innate_spell). 데이터 일부에 spellType camelCase 혼재',
    spellType:       'spell/cantrip (legacy camelCase 키 — spell_type과 동일 의미)',
    uses:            '사용횟수 텍스트 ("하루 1회") (grant_innate_spell)',
    default_choice:  '자식 재주의 기본 choice (grant_feat/grant_feat_if_trained)',
    defaultChoice:   '자식 재주의 기본 choice (legacy camelCase — default_choice와 동일 의미)',
    feat:            '부여 재주 (grant_feat_if_trained의 feat — target=skill일 때 별도 컬럼)',
    weapon_category: 'unarmed/simple/martial (grant_weapon)',
    damage:          '"1d6 P" 형태 (grant_weapon)',
    range:           '0=근접 (grant_weapon)',
    traits:          '특성 배열 (grant_weapon — 같은 종류 복수 OK)',
    summary:         'action ID 없는 인라인 행동 텍스트 (grant_action)',
    actionCost:      '1/2/3/free/reaction (grant_action)',
    name:            '지식 분야 한글명 (grant_lore — target에 통합 안 됨, 별도 컬럼)',
    rank:            'T/E/M/L 또는 1~10 (proficiency/spell_slots)',
    key:             'climb/swim/fly (speed_extra)',
    from:            '변환 전 갑옷 카테고리 (armor_upgrade)',
    damage_type:     '피해 종류 ("정밀"/"냉기") (resistance — target에 통합 안 됨, 별도 컬럼)',
    scaling:         '피해 스케일링 객체 ({"1":"1d4","6":"1d6"}) — damage_note용. 현재 sneak-attacker 1건만',
  },
  CHOICE_OPTIONS: {
    choice_id:        'CHOICE_OPTIONS PK 일부 — FEAT_DB.choice_id가 참조. cho-{feat.id}',
    option_id:        '옵션 식별자 (custom: 자유 슬러그 / skill_defaults: SKILLS.id)',
    option_name:      '옵션 표시명 (한글)',
    effect_group_id:  '옵션 선택 시 적용되는 EFFECT_GROUPS.group_id 외래키 (choiceEffects 분기). 빈 문자열이면 옵션 분기 효과 없음',
    is_default:       '기본 선택 여부 (skill_defaults는 true / custom은 보통 false)',
  },
  BACKGROUNDS: {
    id:              '배경 id (영문 슬러그)',
    name:            '배경 한글명',
    en:              '배경 영문명',
    desc:            '배경 본문 설명',
    effect_group_id: 'EFFECT_GROUPS.group_id 외래키 (효과 정본 — boosts/boost_choices/free_boosts/fixed_skills/choice_skill_groups/fixed_lores/feat_id/deity_skill/deity_lore 모두 EG 행으로 흡수). 빈 문자열=효과 없음. v535~ Phase 4b',
  },
  HERITAGE_DB: {
    ancestry:        '소속 혈통 id (* = 다재다능 — 모든 혈통에서 선택 가능)',
    effect_group_id: 'EFFECT_GROUPS.group_id 외래키 (효과 정본). 빈 문자열=효과 없음. v534~ Phase 4a',
  },
  SKILLS: {
    attr:    '관련 능력치 (str/dex/con/int/wis/cha)',
    isLore:  '지식 기술 여부 (true면 자유 분야)',
  },
  CONDITIONS_DATA: {
    valued:  '수치형 상태 여부 (true면 1,2,3… 단계 적용)',
    max:     '최대 단계 (valued인 경우)',
    auto:    '자동 적용 효과 정의',
  },
  ACTION_DB: {
    cat:           '카테고리 (basic/skill 등)',
    cat_label:     '카테고리 한글 라벨',
    cost:          '행동 비용 (1행동/2행동/3행동/반응/자유 행동)',
    req_skill:     '요구 기술 id',
    req_rank:      '요구 숙련 등급 (0=미숙련, 2=숙련, 4=전문가, 6=달인, 8=전설)',
    req_feat:      '요구 재주',
    req_heritage:  '요구 유산',
  },
  DEITY_DB: {
    weapon:          '선호 무기 (한글명)',
    skill:           '신격 기술 id',
    sanctification:  '성별화 옵션',
    domains:         '영역 id 배열',
    title:           '신격 칭호',
  },
  FEAT_DB: {
    feat_level:       '재주 레벨 (1, 2, 4, 6, …)',
    repeatable:       '여러 번 선택 가능 여부',
    acquisition:      'choice(사용자 선택) / auto(자동 부여). v528~',
    source:           'auto일 때 출처 ID (혈통/클래스 id). v528~',
    prereq_group_id:  'PREREQ_GROUPS.group_id 외래키 (빈 문자열=전제조건 없음). v528~',
    actionCost:       '행동 비용 (1/2/3/reaction/free)',
    auto_note:        '시트 변화 없는 자동 표시 노트 (display_note 1:1 흡수). $choice_name 토큰 가능. v532~ Phase 3a',
    damage_note:      '피해 메모 객체 (damage_note 1:1 흡수, JSON). type=damage_note, scaling 등. v532~ Phase 3a',
    effect_group_id:  'EFFECT_GROUPS.group_id 외래키 (공통 효과). 빈 문자열=공통 효과 없음. v532~ Phase 3a',
    choice_id:        'CHOICE_OPTIONS.choice_id 외래키 (선택지). 빈 문자열=선택지 없음. v532~ Phase 3a',
    choice_kind:      '선택 종류 enum: custom/skill/skill_fixed/skill_defaults/skill_multi/lore/spell_cantrip/spell_rank/feat_pick/weapon_pick/ancestry_pick/muse_pick. v532~ Phase 3a',
    choice_label:     '선택 라벨 (모달/인라인 안내문). v532~ Phase 3a',
    choice_filter:    '선택 필터/메타 객체 (JSON) — type/label/options/defaults 외 모든 메타 (filter, count, pickCategory, min_rank 등). v532~ Phase 3a',
    feature_legacy_id: '구 CLASS_FEATURE_NAMES 메타 ID (divine-font 등) — IIFE 파생용. v529~',
    feature_type:     '구 CLASS_FEATURE_NAMES 메타 type (shield-block 등) — IIFE 파생용. v529~',
  },
  SPELL_DB: {
    rank:          '랭크 (1~10)',
    is_cantrip:    '캔트립 여부',
    is_focus:      '집중 주문 여부',
    traditions:    '시전 전통 배열 (occult/divine/primal/arcane)',
    actions:       '시전 행동 (1행동/2행동/3행동/반응/자유)',
    range:         '사거리',
    area:          '영역 (예: "30피트 폭발")',
    defense:       '내성 종류 (반사/인내/의지)',
    target:        '대상',
    duration:      '지속 시간',
    trigger:       '발동 조건 (반응)',
    requirements:  '요구 조건',
    castTime:      '시전 시간',
  },
  WEAPON_DB: {
    damage:  '피해 (예: "1d6 P")',
    hands:   '필요 손 (1, 2, 또는 1+ 가변)',
    range:   '사거리 (원거리 무기)',
    reload:  '재장전 행동 수',
  },
  ARMOR_DB: {
    ac_bonus:       'AC 보너스',
    dex_cap:        '민첩 상한 (이 값까지만 AC에 반영)',
    check_penalty:  '점검 페널티 (기술 굴림 마이너스)',
    speed_penalty:  '이동력 페널티',
    strength:       '근력 요구치 (이 값 이상 시 페널티 무시)',
  },
  SHIELD_DB: {
    ac_bonus:       'AC 보너스 (들기 시)',
    speed_penalty:  '이동력 페널티',
    hardness:       '강도 (피해 차감)',
    hp:             '내구도',
    bt:             'Break Threshold (이 값 이하 HP면 파손)',
  },
  GEAR_DB: {
    invCat:  '인벤토리 카테고리 (gear=장비, consumable=소모품, ammo=탄환)',
  },
  RUNE_DB: {
    level:       '룬 레벨',
    attachTo:    '부착 대상 종류 (weapon/armor/shield)',
    runeType:    '룬 종류 (potency/striking/property 등)',
    runeValue:   '룬 효과 값',
  },
};

// 원시값 배열 시트 (단일 value 컬럼)
const PRIMITIVE = {
  value:  '항목 값 (원시 문자열)',
};

// kv-json 시트 (key/value_json 두 컬럼)
const KV_JSON = {
  key:         '항목 키 (PK)',
  value_json:  'JSON 직렬화된 값 (편집 시 valid JSON 유지 필요)',
};

// 시트별 컬럼 → 설명 lookup
function getDescription(sheetName, columnName, sheetShape) {
  if (sheetShape === 'kv-json') {
    if (KV_JSON[columnName]) return KV_JSON[columnName];
  }
  if (PER_SHEET[sheetName] && PER_SHEET[sheetName][columnName]) {
    return PER_SHEET[sheetName][columnName];
  }
  if (COMMON[columnName]) return COMMON[columnName];
  if (PRIMITIVE[columnName]) return PRIMITIVE[columnName];
  return '';  // 빈 칸 — 사용자가 직접 채울 수 있음
}

module.exports = { getDescription, COMMON, PER_SHEET, PRIMITIVE, KV_JSON };
