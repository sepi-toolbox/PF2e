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
  prereqs:         '구조화된 전제조건 (JSON, _checkPrereqs가 사용)',
  prerequisites:   '전제조건 텍스트 (표시용)',
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
    bonusLangs:     'INT에 더해지는 추가 언어 슬롯 수',
    specials:       '특수 능력 텍스트 배열',
  },
  LANGUAGES: {
    category:       '카테고리 (common/uncommon/rare). v526~',
  },
  TRAIT_DB: {
    desc:           '특성 효과 설명 (무기 트레이트는 게임 메카닉, 혈통/생물 트레이트는 분류용)',
  },
  BACKGROUNDS: {
    boosts:         '고정 능력치 부스트 enum 배열',
    boost_choices:  '선택형 부스트 그룹 (이중배열, 그룹당 1택)',
    free_boosts:    '자유 능력치 부스트 슬롯 수',
    skills:         '부여 기술 텍스트 (예: "기술1, 기술2")',
    feat:           '부여 재주 (한글명)',
  },
  HERITAGE_DB: {
    ancestry:        '소속 혈통 id',
    resistances:     '저항 (예: ["화염 5"])',
    vision:          '시야 enum (low-light/darkvision/upgrade) — upgrade는 한 단계 상승. v526~',
    innateSpells:    '선천 주문 배열',
    extraSenses:     '추가 감각',
    grantWeapon:     '부여 무기 (한글명)',
    hpBonus:         'HP 보너스 (혈통 HP에 추가)',
    restBonusHp:     '휴식 시 HP 보너스',
    extraLanguages:  '추가 언어 배열',
    grantSkills:     '부여 기술 (id 배열)',
    grantFeats:      '부여 재주 ("한글명 (영문명)" 형태)',
    versatile:       '다재다능 — 추가 능력치 부스트',
    extraFeats:      '추가 재주',
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
    feat_level:  '재주 레벨 (1, 2, 4, 6, …)',
    repeatable:  '여러 번 선택 가능 여부',
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
