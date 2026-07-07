// ═══════════════════════════════════════════════
//  DATA — from Player Core Korean translation
// ═══════════════════════════════════════════════

// 혈통 영문→한글 매핑 (양자 혈통/선행 조건 등에서 공용)
const ANCESTRY_NAME_MAP = {
  "dwarf": "드워프",
  "elf": "엘프",
  "gnome": "노움",
  "goblin": "고블린",
  "halfling": "하플링",
  "human": "인간",
  "leshy": "레쉬",
  "orc": "오크"
};

// 클래스(CLASSES) 카탈로그는 FVTT 단일 소스로 이관(PF2eClass, 27종). 숙련진행=CLASS_PROF_EXT 큐레이션.

// 클래스 서브클래스 DB
const SUBCLASS_DB = [
  {
    "id": "muse-enigma",
    "class_id": "bard",
    "subclass_type": "뮤즈",
    "name_ko": "수수께끼",
    "name_en": "Enigma",
    "desc": "뮤즈는 미스터리로, 삶과 다차원계의 숨겨진 비밀을 밝히도록 합니다. 완전히 파악할 수 없는 사람, 상징이 깊이 겹쳐진 텍스트, 또는 평생 작품의 바탕이 되는 감정적 역설일 수 있습니다. 이세계 생물이라면 신비로운 영겁이나 오컬트 용일 수 있고, 신격이라면 이로리나 네시스일 수 있습니다.<br>수수께끼 뮤즈의 바드로서, 영감과 오컬트 지원 곁에 지식을 제공하여 동료를 지원합니다.",
    "granted_skills": [],
    "granted_feats": [
      "bardic-lore"
    ],
    "granted_spells": [
      {
        "lv": 1,
        "type": "known",
        "spell_id": "sure-strike",
        "rank": 1
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "바드 지식 (자유 지식 기술)",
        "name_en": "Bardic Lore",
        "desc": "수수께끼 뮤즈가 온갖 신비로운 지식을 속삭여 줍니다. 바드 지식이라는 특수 지식 기술에 숙련됩니다. 모든 지식 회상 시 바드 지식을 사용할 수 있으며, 다른 지식 기술 대신 이 하나의 기술로 판정합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "muse-maestro",
    "class_id": "bard",
    "subclass_type": "뮤즈",
    "name_ko": "마에스트로",
    "name_en": "Maestro",
    "desc": "뮤즈가 끊임없이 더 높은 예술적 무용의 경지로 영감을 줍니다. 많은 바드에게 스승이나 라이벌이 이 역할을 하지만, 일부는 더 높은 목표를 세워 과거의 위대한 작곡가를 넘어서거나 완전히 새로운 길을 개척하려 합니다. 초자연적 생물이라면 합창 천사나 리라키엔 아자타일 수 있고, 신격이라면 셸린일 수 있습니다.<br>마에스트로 뮤즈의 바드로서, 동료에게 영감을 주며 음악적, 연설적 능력에 자신 있습니다.",
    "granted_skills": [],
    "granted_feats": [
      "lingering-composition"
    ],
    "granted_spells": [
      {
        "lv": 1,
        "type": "known",
        "spell_id": "soothe",
        "rank": 1
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "잔향 작곡",
        "name_en": "Lingering Composition",
        "desc": "작곡 캔트립의 효과를 유지하는 집중 주문을 습득합니다. 잔향 작곡 재주를 얻어, 1 집중 포인트를 소비하여 작곡 캔트립의 지속 시간을 3라운드로 연장합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "muse-warrior",
    "class_id": "bard",
    "subclass_type": "뮤즈",
    "name_ko": "전사",
    "name_en": "Warrior",
    "desc": "전장이 무대이고 강철의 울림이 노래입니다. 뮤즈는 전투에 환호하거나 그 필요성에 체념하며 수많은 전투를 목격했습니다. 개별 병사나 장군이 영감을 줄 수 있지만, 특히 심오한 역사를 가진 전장이나 무기도 마찬가지입니다. 생물이라면 아르콘이나 데블 병사 같은 이세계 전사일 수 있고, 신격이라면 고룸일 수 있습니다.<br>전사 뮤즈의 바드로서, 공연 외에 전투 훈련도 하며 전투의 위험에 대비시킵니다. 한가운데 뛰어들 수도 있습니다.",
    "granted_skills": [],
    "granted_feats": [
      "martial-performance"
    ],
    "granted_spells": [
      {
        "lv": 1,
        "type": "known",
        "spell_id": "fear",
        "rank": 1
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "군용 무기 훈련",
        "name_en": "Martial Weapon Training",
        "desc": "전사 뮤즈의 영감으로 군용 무기에 훈련됩니다. 군용 무기 숙련도가 훈련으로 증가합니다."
      }
    ],
    "prof_changes": {
      "weapon-martial": {
        "1": 2
      }
    }
  },
  {
    "id": "muse-polymath",
    "class_id": "bard",
    "subclass_type": "뮤즈",
    "name_ko": "박학다식",
    "name_en": "Polymath",
    "desc": "만물박사로, 기술과 추구 사이를 오갑니다. 다양한 주제에 관심이 있지만 하나에 전념하는 일은 드물며, 모든 것을 시도하고 싶어합니다.",
    "granted_skills": [],
    "granted_feats": [
      "versatile-performance"
    ],
    "granted_spells": [
      {
        "lv": 1,
        "type": "known",
        "spell_id": "phantasmal-minion",
        "rank": 1
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "다재다능한 공연",
        "name_en": "Versatile Performance",
        "desc": "박학다식한 뮤즈의 영향으로 공연 기술로 다른 기술을 대체할 수 있습니다. 다재다능한 공연 재주를 얻어, 공연으로 기만, 외교, 위협 판정을 대체합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "doctrine-cloistered",
    "class_id": "cleric",
    "subclass_type": "교리",
    "name_ko": "수도원 성직자",
    "name_en": "Cloistered Cleric",
    "desc": "신성 마법과 신격의 영역에 집중하는 성직자입니다.<br><strong>1차 교의(1레벨):</strong> 영역 입문 클레릭 재주를 얻습니다.<br><strong>2차 교의(3레벨):</strong> 인내 내성 → 전문가.<br><strong>3차 교의(7레벨):</strong> 주문 명중/DC → 전문가.<br><strong>4차 교의(11레벨):</strong> 신격 선호 무기, 단순 무기, 비무장 → 전문가. 선호 무기 치명 성공 시 치명 특수 효과 적용; 클래스 DC 대신 주문 DC 사용 가능.<br><strong>5차 교의(15레벨):</strong> 주문 명중/DC → 달인.<br><strong>최종 교의(19레벨):</strong> 주문 명중/DC → 전설.",
    "granted_skills": [],
    "granted_feats": [
      "domain-initiate"
    ],
    "granted_spells": [],
    "features": [
      {
        "lv": 3,
        "name_ko": "전문가 주문시전자",
        "name_en": "Expert Spellcaster",
        "desc": "주문 시전 능력이 한 단계 더 발전했습니다. 주문 명중과 주문 DC의 숙련도가 전문가로 증가합니다."
      },
      {
        "lv": 15,
        "name_ko": "달인 주문시전자",
        "name_en": "Master Spellcaster",
        "desc": "주문 시전에 대한 달인급 숙달을 달성했습니다. 주문 명중과 주문 DC의 숙련도가 달인으로 증가합니다."
      },
      {
        "lv": 19,
        "name_ko": "전설 주문시전자",
        "name_en": "Legendary Spellcaster",
        "desc": "마법의 완벽한 숙달을 이루었습니다. 주문 명중과 주문 DC의 숙련도가 전설로 증가합니다."
      }
    ],
    "prof_changes": {
      "fort": {
        "1": 2,
        "3": 4,
        "9": 6
      },
      "spatk": {
        "1": 2,
        "3": 4,
        "15": 6,
        "19": 8
      },
      "ref": {
        "1": 2,
        "11": 4
      },
      "will": {
        "1": 4,
        "9": 6,
        "17": 8
      },
      "armor-light": {
        "1": 2
      },
      "armor-unarmored": {
        "1": 2
      }
    }
  },
  {
    "id": "doctrine-warpriest",
    "class_id": "cleric",
    "subclass_type": "교리",
    "name_ko": "전투 사제",
    "name_en": "Warpriest",
    "desc": "주문과 전투 모두에 능한 전투적 성직자입니다.<br><strong>1차 교의(1레벨):</strong> 경갑·평갑 숙련, 인내 내성 → 전문가, 방패 막기 재주 획득. 신격 선호 무기가 단순/비무장이면 치명적 소박함 재주 획득. 13레벨에 신성 방어 획득 시 경갑·평갑 → 전문가.<br><strong>2차 교의(3레벨):</strong> 군용 무기 숙련.<br><strong>3차 교의(7레벨):</strong> 신격 선호 무기, 군용/단순/비무장 → 전문가. 선호 무기 치명 성공 시 치명 특수 효과; 클래스 DC 대신 주문 DC 사용 가능.<br><strong>4차 교의(11레벨):</strong> 주문 명중/DC → 전문가.<br><strong>5차 교의(15레벨):</strong> 인내 내성 → 달인. 인내 성공 시 대성공.<br><strong>최종 교의(19레벨):</strong> 신격 선호 무기, 주문 명중/DC → 달인.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [],
    "features": [
      {
        "lv": 1,
        "name_ko": "군용 무기/평갑 훈련",
        "name_en": "Martial & Medium Armor",
        "desc": "전쟁사제 교리를 따르는 클레릭으로서 전투 훈련을 받습니다. 군용 무기에 훈련되며, 평갑(중갑)에 훈련됩니다. 인내 내성 숙련도가 전문가로 증가합니다."
      },
      {
        "lv": 3,
        "name_ko": "반사 전문가",
        "name_en": "Expert Reflex",
        "desc": "전투 경험을 통해 반사신경이 향상됩니다. 반사 내성 숙련도가 전문가로 증가합니다."
      },
      {
        "lv": 7,
        "name_ko": "전문가 주문시전자",
        "name_en": "Expert Spellcaster",
        "desc": "주문 시전 능력이 한 단계 더 발전했습니다. 주문 명중과 주문 DC의 숙련도가 전문가로 증가합니다."
      },
      {
        "lv": 15,
        "name_ko": "달인 주문시전자",
        "name_en": "Master Spellcaster",
        "desc": "주문 시전에 대한 달인급 숙달을 달성했습니다. 주문 명중과 주문 DC의 숙련도가 달인으로 증가합니다."
      }
    ],
    "prof_changes": {
      "fort": {
        "1": 2,
        "3": 4,
        "9": 6
      },
      "spatk": {
        "1": 2,
        "7": 4,
        "15": 6
      },
      "ref": {
        "1": 2,
        "3": 4
      },
      "will": {
        "1": 4,
        "9": 6
      },
      "weapon-martial": {
        "1": 2,
        "7": 4
      },
      "armor-light": {
        "1": 2,
        "13": 4,
        "17": 6
      },
      "armor-medium": {
        "1": 2,
        "13": 4,
        "17": 6
      },
      "armor-heavy": {
        "1": 2
      },
      "armor-unarmored": {
        "1": 2,
        "13": 4,
        "17": 6
      }
    }
  },
  {
    "id": "order-animal",
    "class_id": "druid",
    "subclass_type": "교단",
    "name_ko": "동물",
    "name_en": "Animal",
    "desc": "야수와 강한 유대가 있어 항상 그들을 이해한다고(그들도 당신을) 느꼈습니다. 자연의 동물을 대변하며, 강력한 동물 동료가 곁에 있습니다.",
    "granted_skills": [
      "athletics"
    ],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "heal-animal"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "동물 친구 습득",
        "name_en": "Animal Companion",
        "desc": "동물 결사에 가입하여 동물 친구를 얻습니다. 자연학에 훈련되며, 동물 친구가 전투와 탐험에서 함께합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "order-leaf",
    "class_id": "druid",
    "subclass_type": "교단",
    "name_ko": "잎",
    "name_en": "Leaf",
    "desc": "자연의 풍요를 숭배하며 야생의 정원사이자 관리인 역할을 합니다. 레시 사역마와 함께 재난이나 무분별한 확장 후 지역이 다시 자라도록 돕고, 식물을 남용하는 자에게 돌려씁니다.",
    "granted_skills": [
      "diplomacy"
    ],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "cornucopia"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "집중 주문: 축제의 뿔피리",
        "name_en": "Cornucopia",
        "desc": "잎 결사에 가입하여 축제의 뿔피리 집중 주문을 습득합니다. 외교에 훈련됩니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "order-storm",
    "class_id": "druid",
    "subclass_type": "교단",
    "name_ko": "폭풍",
    "name_en": "Storm",
    "desc": "폭풍 아래 태어났든 맑은 하늘의 번개에서 살아남았든, 이제 심장에 폭풍의 분노를 담고 천둥을 무시무시한 파괴력으로 전달하며 바람을 타고 하늘을 날아갑니다.",
    "granted_skills": [
      "acrobatics"
    ],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "tempest-surge"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "집중 주문: 폭풍 쇄도",
        "name_en": "Tempest Surge",
        "desc": "폭풍 결사에 가입하여 폭풍 쇄도 집중 주문을 습득합니다. 곡예에 훈련됩니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "order-wild",
    "class_id": "druid",
    "subclass_type": "교단",
    "name_ko": "야생",
    "name_en": "Untamed",
    "desc": "자연 세계의 통제할 수 없는 부름이 몸을 관통합니다. 야생 동물에 의해 자랐거나, 도시에서 자란 후 도시의 인위를 거부했을 수 있습니다. 원시 마법이 야생 생물의 형태를 입을 능력을 부여합니다.",
    "granted_skills": [
      "intimidation"
    ],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "untamed-shift"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "집중 주문: 야생 해방",
        "name_en": "Untamed Form",
        "desc": "야생 결사에 가입하여 야생 해방 집중 주문을 습득합니다. 위협에 훈련됩니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "edge-flurry",
    "class_id": "ranger",
    "subclass_type": "사냥 방식",
    "name_ko": "연타",
    "name_en": "Flurry",
    "desc": "사냥감에 대한 다중 공격 페널티가 완화됩니다.<br>두 번째 공격: <b>-5 → -3</b> (민첩 무기 -2)<br>세 번째 이후: <b>-10 → -6</b> (민첩 -4)",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [],
    "features": [
      {
        "lv": 1,
        "name_ko": "다중 공격 페널티 감소",
        "name_en": "Flurry",
        "desc": "사냥감에 대한 연속 공격에 능숙합니다. 사냥감에 대한 다중 공격 페널티가 -4/-8로 감소합니다(일반 -5/-10). 민첩 무기 사용 시 -3/-6으로 감소합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "edge-outwit",
    "class_id": "ranger",
    "subclass_type": "사냥 방식",
    "name_ko": "계략",
    "name_en": "Outwit",
    "desc": "사냥감의 공격에 대해 <b>AC +1 상황 보너스</b>.<br>사냥감에 대한 기만/위협/은신 및 지식 회상에 <b>+2 상황 보너스</b>.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [],
    "features": [
      {
        "lv": 1,
        "name_ko": "사냥 목표 AC +1",
        "name_en": "Outwit",
        "desc": "사냥감의 약점을 간파합니다. 사냥감의 공격에 대해 AC에 +1 상황 보너스를 받고, 사냥감에 대한 기만, 위협, 은신, 지식 회상 판정에 +2 상황 보너스를 받습니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "edge-precision",
    "class_id": "ranger",
    "subclass_type": "사냥 방식",
    "name_ko": "정밀",
    "name_en": "Precision",
    "desc": "라운드에서 사냥감을 처음 명중할 때 <b>추가 1d8 정밀 피해</b>.<br>11레벨에서 2d8, 19레벨에서 3d8.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [],
    "features": [
      {
        "lv": 1,
        "name_ko": "첫 타 정밀 피해 +1d8",
        "name_en": "Precision",
        "desc": "사냥감의 치명적 약점을 노립니다. 매 라운드 사냥감에 대한 첫 번째 명중 시 추가 1d8 정밀 피해를 입힙니다. 11레벨에 2d8, 19레벨에 3d8으로 증가합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "racket-eldritch-trickster",
    "class_id": "rogue",
    "subclass_type": "전문",
    "name_ko": "비전 트릭스터",
    "name_en": "Eldritch Trickster",
    "desc": "마법과 교활함을 결합합니다.<br>주문 트릭 집중 주문 습득. 주문 공격으로 은밀 공격 적용 가능.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [],
    "features": [
      {
        "lv": 1,
        "name_ko": "주문→스닉 어택",
        "name_en": "Eldritch Trickster",
        "desc": "비전 사기꾼 라켓: 헌신 아키타입 재주를 통해 다중 클래스 주문시전을 습득합니다. 주문으로 무방비 상태를 만들어 은밀 공격을 연계할 수 있습니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "racket-mastermind",
    "class_id": "rogue",
    "subclass_type": "전문",
    "name_ko": "지략가",
    "name_en": "Mastermind",
    "desc": "지능에 의지하여 정교한 계략을 세우며, 다른 이가 3수 앞을 볼 때 10수 앞을 봅니다. 지식 회상으로 생물을 성공적으로 식별하면 다음 턴 시작까지 당신의 공격에 <strong>무방비</strong>; 대성공이면 1분간.",
    "granted_skills": [
      "society"
    ],
    "granted_feats": [],
    "granted_spells": [],
    "features": [
      {
        "lv": 1,
        "name_ko": "지식 확인→무방비",
        "name_en": "Mastermind",
        "desc": "두뇌파 라켓: 지식 회상으로 대상을 식별하면, 해당 대상은 다음 턴 시작까지 무방비 상태가 됩니다. 사회에 훈련되며, 하나의 지식 기술에 추가 훈련됩니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "racket-scoundrel",
    "class_id": "rogue",
    "subclass_type": "전문",
    "name_ko": "사기꾼",
    "name_en": "Scoundrel",
    "desc": "재빠른 말솜씨, 아첨, 날카로운 혀로 위험을 피하고 곤란한 상황을 탈출합니다. 기만으로 성공적으로 속임 시 다음 턴 종료까지 당신의 근접 공격에 <strong>무방비</strong>; 대성공이면 모든 근접 공격에. 민첩/기교 근접 무기를 들고 속이면 즉시 <strong>자유 행동으로 한 걸음</strong>.",
    "granted_skills": [
      "deception",
      "diplomacy"
    ],
    "granted_feats": [],
    "granted_spells": [],
    "features": [
      {
        "lv": 1,
        "name_ko": "기만/위협→무방비",
        "name_en": "Scoundrel",
        "desc": "사기꾼 라켓: 기만 성공 시 대상이 다음 턴 시작까지 무방비 상태가 됩니다. 기만과 외교에 훈련됩니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "racket-ruffian",
    "class_id": "rogue",
    "subclass_type": "전문",
    "name_ko": "건달",
    "name_en": "Ruffian",
    "desc": "직접적 접근을 선호: 완력이나 위협. 어떤 무기로든 은밀 공격 피해를 줄 수 있습니다(단, d8 초과 단순 무기나 d6 초과 군용/고급 무기는 제외). 이 무기로 무방비한 대상에 치명타 시 <strong>치명 특성 효과</strong> 적용.",
    "granted_skills": [
      "intimidation"
    ],
    "granted_feats": [],
    "granted_spells": [],
    "features": [],
    "prof_changes": {}
  },
  {
    "id": "racket-thief",
    "class_id": "rogue",
    "subclass_type": "전문",
    "name_ko": "도둑",
    "name_en": "Thief",
    "desc": "남의 것을 가져가는 짜릿함을 즐깁니다. 기교 근접 무기나 비무장 공격으로 공격 시 피해 굴림에 근력 대신 <strong>민첩 수정치를 추가</strong>.",
    "granted_skills": [
      "thievery"
    ],
    "granted_feats": [],
    "granted_spells": [],
    "features": [
      {
        "lv": 1,
        "name_ko": "민첩→피해 (기교 무기)",
        "name_en": "Thief",
        "desc": "도적 라켓: 은밀 공격 피해에 기교 무기 사용 시 민첩 수정치를 피해에 추가합니다. 도적질에 훈련됩니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "patron-curse",
    "class_id": "witch",
    "tradition": "occult",
    "subclass_type": "후원자",
    "name_ko": "저주",
    "name_en": "Curse",
    "desc": "저주의 힘을 부여하는 후원자. 오컬트 전통. 주술: 악의 눈. 저주·조종 관련 주문 확장.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "evil-eye"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "오컬트 전통 / 주술: 사악한 눈",
        "name_en": "Curse",
        "desc": "저주 후원자가 오컬트 전통의 주문시전 능력을 부여합니다. 사악한 눈 주술 집중 주문을 습득합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "patron-fate",
    "class_id": "witch",
    "tradition": "occult",
    "subclass_type": "후원자",
    "name_ko": "운명",
    "name_en": "Fate",
    "desc": "운명의 실을 다루는 후원자. 오컬트 전통. 주술: 운명의 실. 예지 관련 주문 확장.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "nudge-fate"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "오컬트 전통 / 주술: 운명 조정",
        "name_en": "Fate",
        "desc": "운명 후원자가 오컬트 전통의 주문시전 능력을 부여합니다. 운명 조정 주술 집중 주문을 습득합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "patron-fervor",
    "class_id": "witch",
    "tradition": "divine",
    "subclass_type": "후원자",
    "name_ko": "열정",
    "name_en": "Fervor",
    "desc": "신성한 헌신의 후원자. 신성 전통. 주술: 정화의 불꽃. 치유·강화 관련 주문.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "stoke-the-heart"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "신성 전통 / 주술: 심장 격려",
        "name_en": "Fervor",
        "desc": "열정 후원자가 신성 전통의 주문시전 능력을 부여합니다. 심장 격려 주술 집중 주문을 습득합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "patron-night",
    "class_id": "witch",
    "tradition": "occult",
    "subclass_type": "후원자",
    "name_ko": "밤",
    "name_en": "Night",
    "desc": "어둠과 꿈의 후원자. 오컬트 전통. 주술: 마녀의 포옹. 환상·공포 관련 주문.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "shroud-of-night"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "오컬트 전통 / 주술: 밤의 장막",
        "name_en": "Night",
        "desc": "밤 후원자가 오컬트 전통의 주문시전 능력을 부여합니다. 밤의 장막 주술 집중 주문을 습득합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "patron-rune",
    "class_id": "witch",
    "tradition": "arcane",
    "subclass_type": "후원자",
    "name_ko": "룬",
    "name_en": "Rune",
    "desc": "룬 마법의 후원자. 신비 전통. 주술: 룬 저주. 변환·방호 관련 주문.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "discern-secrets"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "비전 전통 / 주술: 비밀 간파",
        "name_en": "Rune",
        "desc": "룬 후원자가 비전 전통의 주문시전 능력을 부여합니다. 비밀 간파 주술 집중 주문을 습득합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "patron-wild",
    "class_id": "witch",
    "tradition": "primal",
    "subclass_type": "후원자",
    "name_ko": "야생",
    "name_en": "Wild",
    "desc": "자연 야생의 후원자. 원시 전통. 주술: 야생의 분노. 자연·동물 관련 주문.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "wilding-word"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "원시 전통 / 주술: 야생의 말",
        "name_en": "Wild",
        "desc": "야생 후원자가 원시 전통의 주문시전 능력을 부여합니다. 야생의 말 주술 집중 주문을 습득합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "school-ars-grammatica",
    "class_id": "wizard",
    "subclass_type": "비전 학파",
    "name_ko": "문법 학파",
    "name_en": "Ars Grammatica",
    "desc": "문자와 수호의 마법. 학파 주문: 보호의 결계 / 감시의 룬. 교과: message, sigil 등.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "protective-wards"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "학파 주문: 보호의 결계",
        "name_en": "Ars Grammatica",
        "desc": "문법학파를 선택합니다. 보호의 결계 학파 집중 주문을 습득하고, 추가 교과과정 주문 슬롯을 얻습니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "school-battle-magic",
    "class_id": "wizard",
    "subclass_type": "비전 학파",
    "name_ko": "전투 마법 학파",
    "name_en": "Battle Magic",
    "desc": "전쟁과 파괴의 마법. 학파 주문: 힘의 화살 / 에너지 흡수. 교과: shield, fire 등.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "force-bolt"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "학파 주문: 힘의 화살",
        "name_en": "Battle Magic",
        "desc": "전투마법학파를 선택합니다. 힘의 화살 학파 집중 주문을 습득하고, 추가 교과과정 주문 슬롯을 얻습니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "school-boundary",
    "class_id": "wizard",
    "subclass_type": "비전 학파",
    "name_ko": "경계 학파",
    "name_en": "The Boundary",
    "desc": "차원과 소환의 마법. 학파 주문: 소환 강화 / 공포의 나선. 교과: telekinetic hand 등.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "fortify-summoning"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "학파 주문: 소환 강화",
        "name_en": "Boundary",
        "desc": "경계학파를 선택합니다. 소환 강화 학파 집중 주문을 습득하고, 추가 교과과정 주문 슬롯을 얻습니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "school-civic-wizardry",
    "class_id": "wizard",
    "subclass_type": "비전 학파",
    "name_ko": "시민 마법 학파",
    "name_en": "Civic Wizardry",
    "desc": "건설과 실용의 마법. 학파 주문: 대지 공사 / 가족 회복. 교과: prestidigitation 등.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "earthworks"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "학파 주문: 대지 공사",
        "name_en": "Civic Wizardry",
        "desc": "시민마법학파를 선택합니다. 대지 공사 학파 집중 주문을 습득하고, 추가 교과과정 주문 슬롯을 얻습니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "school-mentalism",
    "class_id": "wizard",
    "subclass_type": "비전 학파",
    "name_ko": "정신 학파",
    "name_en": "Mentalism",
    "desc": "환상과 정신의 마법. 학파 주문: 매혹의 밀침 / 투명 망토. 교과: daze, figment 등.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "charming-push"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "학파 주문: 매혹의 밀침",
        "name_en": "Mentalism",
        "desc": "정신학파를 선택합니다. 매혹의 밀침 학파 집중 주문을 습득하고, 추가 교과과정 주문 슬롯을 얻습니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "school-protean-form",
    "class_id": "wizard",
    "subclass_type": "비전 학파",
    "name_ko": "변형 학파",
    "name_en": "Protean Form",
    "desc": "변형과 변환의 마법. 학파 주문: 몸 뒤섞기 / 변형. 교과: gouging claw 등.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [
      {
        "lv": 1,
        "type": "focus",
        "spell_id": "scramble-body"
      }
    ],
    "features": [
      {
        "lv": 1,
        "name_ko": "학파 주문: 몸 뒤섞기",
        "name_en": "Protean Form",
        "desc": "변형학파를 선택합니다. 몸 뒤섞기 학파 집중 주문을 습득하고, 추가 교과과정 주문 슬롯을 얻습니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "school-unified",
    "class_id": "wizard",
    "subclass_type": "비전 학파",
    "name_ko": "통합 이론 학파",
    "name_en": "Unified Magical Theory",
    "desc": "특정 학파에 전문화하지 않고 모든 학파에서 자유롭게 습득. 교과 주문 없음, 대신 유연성 확보.",
    "granted_skills": [],
    "granted_feats": [],
    "granted_spells": [],
    "features": [
      {
        "lv": 1,
        "name_ko": "통합 이론: 유연한 주문",
        "name_en": "Unified Theory",
        "desc": "통합이론학파를 선택합니다. 학파 주문 대신 추가 교과과정 주문 슬롯과 유연한 주문 준비 이점을 얻습니다."
      }
    ],
    "prof_changes": {}
  }
];

// ═══════════════════════════════════════════════
//  VISION ENUM (v526~ array, v527~ 시트화)
//  array 형식: id별 한글/영문 라벨 + rank — Excel 시트로 export 가능
//  HERITAGE_DB.vision='upgrade'는 매직 값 (혈통 시야를 한 단계 상승) — enum 외 별도 처리
// ═══════════════════════════════════════════════
const VISION_DEFS = [
  { "id": "none",                "name_ko": "없음",        "name_en": "",                    "rank": 0 },
  { "id": "low-light",           "name_ko": "저광 시야",   "name_en": "Low-Light Vision",    "rank": 1 },
  { "id": "darkvision",          "name_ko": "암시야",      "name_en": "Darkvision",          "rank": 2 },
  { "id": "greater-darkvision",  "name_ko": "상위 암시야", "name_en": "Greater Darkvision",  "rank": 3 }
];
// 코드 호환을 위한 매핑 (VISION_DEFS에서 자동 빌드)
const VISION_TYPES = VISION_DEFS.map(v => v.id);
const VISION_KO = Object.fromEntries(VISION_DEFS.map(v => [v.id, v.name_ko]));
const VISION_EN = Object.fromEntries(VISION_DEFS.map(v => [v.id, v.name_en]));
const VISION_RANK = Object.fromEntries(VISION_DEFS.map(v => [v.id, v.rank]));

// ═══════════════════════════════════════════════
//  LANGUAGE DATABASE
// ═══════════════════════════════════════════════
// v526~: 객체 배열 (id/name_ko/name_en). id는 외래 참조용, name_ko는 표시용
const LANGUAGES = [
  { "id": "common",      "name_ko": "공통어",      "name_en": "Common", "category": "common" },
  { "id": "dwarven",     "name_ko": "드워프어",    "name_en": "Dwarven", "category": "common" },
  { "id": "elven",       "name_ko": "엘프어",      "name_en": "Elven", "category": "common" },
  { "id": "gnomish",     "name_ko": "노움어",      "name_en": "Gnomish", "category": "common" },
  { "id": "goblin",      "name_ko": "고블린어",    "name_en": "Goblin", "category": "common" },
  { "id": "halfling",    "name_ko": "하플링어",    "name_en": "Halfling", "category": "common" },
  { "id": "orcish",      "name_ko": "오크어",      "name_en": "Orcish", "category": "common" },
  { "id": "fey",         "name_ko": "실반어",      "name_en": "Fey", "category": "uncommon" },
  { "id": "draconic",    "name_ko": "용어",        "name_en": "Draconic", "category": "uncommon" },
  { "id": "empyrean",    "name_ko": "천상어",      "name_en": "Empyrean", "category": "uncommon" },
  { "id": "chthonian",   "name_ko": "심연어",      "name_en": "Chthonian", "category": "uncommon" },
  { "id": "diabolic",    "name_ko": "지옥어",      "name_en": "Diabolic", "category": "uncommon" },
  { "id": "necril",      "name_ko": "네크릴어",    "name_en": "Necril", "category": "uncommon" },
  { "id": "thalassic",   "name_ko": "수생어",      "name_en": "Thalassic", "category": "uncommon" },
  { "id": "petran",      "name_ko": "지하공통어",  "name_en": "Petran", "category": "uncommon" },
  { "id": "sussuran",    "name_ko": "아우란어",    "name_en": "Sussuran", "category": "uncommon" },
  { "id": "pyric",       "name_ko": "이그난어",    "name_en": "Pyric", "category": "uncommon" },
  { "id": "ortholo",     "name_ko": "테란어",      "name_en": "Ortholo", "category": "uncommon" },
  { "id": "alkenstani",  "name_ko": "알케나즈어",  "name_en": "Alkenstani", "category": "rare" },
  { "id": "andoran",     "name_ko": "안도란어",    "name_en": "Andoran", "category": "rare" },
  { "id": "bantu",       "name_ko": "반투어",      "name_en": "Bantu", "category": "rare" },
  { "id": "saurian",     "name_ko": "사우리안어",  "name_en": "Saurian", "category": "rare" },
  { "id": "celestial",   "name_ko": "셀레스티아어","name_en": "Celestial", "category": "rare" },
  { "id": "sakvroth",    "name_ko": "사크리어",    "name_en": "Sakvroth", "category": "rare" },
  { "id": "osiriani",    "name_ko": "오시리안어",  "name_en": "Osiriani", "category": "rare" },
  { "id": "jotun",       "name_ko": "요티아어",    "name_en": "Jotun", "category": "rare" },
  { "id": "kelish",      "name_ko": "켈리쉬어",    "name_en": "Kelish", "category": "rare" },
  { "id": "varisian",    "name_ko": "바알간어",    "name_en": "Varisian", "category": "rare" },
  { "id": "taldane",     "name_ko": "탈다네어",    "name_en": "Taldane", "category": "rare" },
  { "id": "shoanti",     "name_ko": "쇼안티어",    "name_en": "Shoanti", "category": "rare" },
  { "id": "garundi",     "name_ko": "가룬디어",    "name_en": "Garundi", "category": "rare" },
  { "id": "minkaian",    "name_ko": "민카이어",    "name_en": "Minkaian", "category": "rare" },
  { "id": "demonic",     "name_ko": "데모닉어",    "name_en": "Demonic", "category": "rare" },
  { "id": "protean",     "name_ko": "프로테안어",  "name_en": "Protean", "category": "rare" }
];

// 혈통(ANCESTRIES)·배경(BACKGROUNDS)·유산(HERITAGE_DB) 카탈로그는 FVTT 단일 소스로 이관
// (PF2eAnc/PF2eBg 어댑터). 기계효과는 effects_db, 선행조건은 prereqs_db 참조.

// v526~: array 형식 [{id, name_ko, name_en, desc}]. id는 외래 참조용, name_en는 사용자가 추후 채움
const TRAIT_DB = [
  {
    "id": "민첩",
    "name_ko": "민첩",
    "name_en": "",
    "type": "weapon",
    "desc": "다중 공격 페널티가 -5/-10 대신 -4/-8로 감소."
  },
  {
    "id": "기교",
    "name_ko": "기교",
    "name_en": "",
    "type": "weapon",
    "desc": "명중 굴림에 근력 대신 민첩 수정치를 사용할 수 있음."
  },
  {
    "id": "비치명",
    "name_ko": "비치명",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기로 입힌 피해는 대상을 죽이지 않음 (기절 0으로 만듦)."
  },
  {
    "id": "도달",
    "name_ko": "도달",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기의 근접 도달이 10피트로 증가."
  },
  {
    "id": "밀기",
    "name_ko": "밀기",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기로 밀기 특수 공격을 시도할 수 있음."
  },
  {
    "id": "막기",
    "name_ko": "막기",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기를 장비한 채 막기 행동을 사용할 수 있음."
  },
  {
    "id": "덫",
    "name_ko": "덫",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기로 넘어뜨리기 특수 공격을 시도할 수 있음."
  },
  {
    "id": "무장해제",
    "name_ko": "무장해제",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기로 무장해제 특수 공격을 시도할 수 있음."
  },
  {
    "id": "발사체",
    "name_ko": "발사체",
    "name_en": "",
    "type": "weapon",
    "desc": "공격에 근력 수정치를 사용하고, 피해에 근력 수정치의 절반 추가 (양수일 때)."
  },
  {
    "id": "양손 d6",
    "name_ko": "양손 d6",
    "name_en": "",
    "type": "weapon",
    "desc": "한 손으로 사용 가능. 두 손으로 잡으면 피해 주사위가 d6로 증가."
  },
  {
    "id": "양손 d8",
    "name_ko": "양손 d8",
    "name_en": "",
    "type": "weapon",
    "desc": "한 손으로 사용 가능. 두 손으로 잡으면 피해 주사위가 d8로 증가."
  },
  {
    "id": "양손 d10",
    "name_ko": "양손 d10",
    "name_en": "",
    "type": "weapon",
    "desc": "한 손으로 사용 가능. 두 손으로 잡으면 피해 주사위가 d10로 증가."
  },
  {
    "id": "양손 d12",
    "name_ko": "양손 d12",
    "name_en": "",
    "type": "weapon",
    "desc": "한 손으로 사용 가능. 두 손으로 잡으면 피해 주사위가 d12로 증가."
  },
  {
    "id": "다용도 B",
    "name_ko": "다용도 B",
    "name_en": "",
    "type": "weapon",
    "desc": "기본 피해 유형 대신 둔기 피해 유형을 선택할 수 있음."
  },
  {
    "id": "다용도 P",
    "name_ko": "다용도 P",
    "name_en": "",
    "type": "weapon",
    "desc": "기본 피해 유형 대신 관통 피해 유형을 선택할 수 있음."
  },
  {
    "id": "다용도 S",
    "name_ko": "다용도 S",
    "name_en": "",
    "type": "weapon",
    "desc": "기본 피해 유형 대신 참격 피해 유형을 선택할 수 있음."
  },
  {
    "id": "투척 10ft",
    "name_ko": "투척 10ft",
    "name_en": "",
    "type": "weapon",
    "desc": "10피트 사거리 증분으로 투척할 수 있음."
  },
  {
    "id": "투척 20ft",
    "name_ko": "투척 20ft",
    "name_en": "",
    "type": "weapon",
    "desc": "20피트 사거리 증분으로 투척할 수 있음."
  },
  {
    "id": "투척 30ft",
    "name_ko": "투척 30ft",
    "name_en": "",
    "type": "weapon",
    "desc": "30피트 사거리 증분으로 투척할 수 있음."
  },
  {
    "id": "치명 d6",
    "name_ko": "치명 d6",
    "name_en": "",
    "type": "weapon",
    "desc": "치명타 시 1d6 크기의 추가 피해 주사위를 굴림."
  },
  {
    "id": "치명 d8",
    "name_ko": "치명 d8",
    "name_en": "",
    "type": "weapon",
    "desc": "치명타 시 1d8 크기의 추가 피해 주사위를 굴림."
  },
  {
    "id": "치명 d10",
    "name_ko": "치명 d10",
    "name_en": "",
    "type": "weapon",
    "desc": "치명타 시 1d10 크기의 추가 피해 주사위를 굴림."
  },
  {
    "id": "치명 d12",
    "name_ko": "치명 d12",
    "name_en": "",
    "type": "weapon",
    "desc": "치명타 시 1d12 크기의 추가 피해 주사위를 굴림."
  },
  {
    "id": "연발 d6",
    "name_ko": "연발 d6",
    "name_en": "",
    "type": "weapon",
    "desc": "치명타 발생 시 추가로 1d6 관통 피해를 입힘."
  },
  {
    "id": "연사",
    "name_ko": "연사",
    "name_en": "",
    "type": "weapon",
    "desc": "볼트 매거진을 장전하여 사용하는 무기. 재장전 없이 연속 발사 가능."
  },
  {
    "id": "쓸기",
    "name_ko": "쓸기",
    "name_en": "",
    "type": "weapon",
    "desc": "이번 턴에 이전 대상을 명중했으면 후속 공격에 +1 상황 보너스."
  },
  {
    "id": "강제 개방",
    "name_ko": "강제 개방",
    "name_en": "",
    "type": "weapon",
    "desc": "2번째 공격 시 피해 주사위 1개 추가, 3번째 이후 2개 추가."
  },
  {
    "id": "넘어뜨리기",
    "name_ko": "넘어뜨리기",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기로 넘어뜨리기 특수 공격을 시도할 수 있음."
  },
  {
    "id": "해제",
    "name_ko": "해제",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기로 무장해제 특수 공격을 시도할 수 있음."
  },
  {
    "id": "추진",
    "name_ko": "추진",
    "name_en": "",
    "type": "weapon",
    "desc": "피해에 근력 수정치의 절반을 추가 (양수일 때)."
  },
  {
    "id": "치사 d10",
    "name_ko": "치사 d10",
    "name_en": "",
    "type": "weapon",
    "desc": "치명타 시 피해 주사위를 d10으로 바꾸고 1d10을 추가."
  },
  {
    "id": "치사 d12",
    "name_ko": "치사 d12",
    "name_en": "",
    "type": "weapon",
    "desc": "치명타 시 피해 주사위를 d12로 바꾸고 1d12을 추가."
  },
  {
    "id": "살포 30ft",
    "name_ko": "살포 30ft",
    "name_en": "",
    "type": "weapon",
    "desc": "30피트 이내 대상 공격 시 -2 페널티."
  },
  {
    "id": "수도승",
    "name_ko": "수도승",
    "name_en": "",
    "type": "weapon",
    "desc": "수도승 재주의 일부가 이 무기에 적용됨."
  },
  {
    "id": "잡힘",
    "name_ko": "잡힘",
    "name_en": "",
    "type": "weapon",
    "desc": "속박 + 무방비. 탈출로 빠져나옴."
  },
  {
    "id": "자유 손",
    "name_ko": "자유 손",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기는 손을 차지하지 않아 다른 용도로 사용 가능."
  },
  {
    "id": "비무장",
    "name_ko": "비무장",
    "name_en": "",
    "type": "weapon",
    "desc": "비무장 공격. 무장해제 불가."
  },
  {
    "id": "조준",
    "name_ko": "조준",
    "name_en": "",
    "type": "weapon",
    "desc": "사거리 이내 근접 목표에 공격 시 -2 페널티."
  },
  {
    "id": "사거리 증분",
    "name_ko": "사거리 증분",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기의 사거리 증분 거리만큼 원거리 공격 가능."
  },
  {
    "id": "신비",
    "name_ko": "신비",
    "name_en": "",
    "type": "weapon",
    "desc": "신비 마법 전통. 비전 마법."
  },
  {
    "id": "신성",
    "name_ko": "신성",
    "name_en": "",
    "type": "damage",
    "desc": "신성 마법 전통. 신격에서 힘을 얻음."
  },
  {
    "id": "오컬트",
    "name_ko": "오컬트",
    "name_en": "",
    "type": "mechanic",
    "desc": "오컬트 마법 전통. 우주의 신비를 탐구."
  },
  {
    "id": "원시",
    "name_ko": "원시",
    "name_en": "",
    "type": "mechanic",
    "desc": "원시 마법 전통. 자연의 힘."
  },
  {
    "id": "arcane",
    "name_ko": "아케인",
    "name_en": "",
    "type": "weapon",
    "desc": "이 마법은 논리와 합리성을 기반으로 하는 아케인 전통에서 비롯된 것입니다. 이 특성을 가진 것은 무엇이든 마법입니다."
  },
  {
    "id": "divine",
    "name_ko": "디바인",
    "name_en": "",
    "type": "weapon",
    "desc": "이 마법은 디바인 전통에서 유래한 것으로, 신 또는 이와 유사한 출처에서 힘을 끌어옵니다. 이 특성을 가진 것은 무엇이든 마법입니다."
  },
  {
    "id": "occult",
    "name_ko": "오컬트",
    "name_en": "",
    "type": "weapon",
    "desc": "이 마법은 오컬트 전통에서 유래한 것으로, 기괴하고 일시적인 신비를 불러일으킵니다. 이 특성을 가진 것은 무엇이든 마법입니다."
  },
  {
    "id": "primal",
    "name_ko": "원시의",
    "name_en": "",
    "type": "weapon",
    "desc": "이 마법은 자연과 본능에 연결되는 프라이멀 전통에서 비롯됩니다. 이 특성을 가진 것은 무엇이든 마술적입니다."
  },
  {
    "id": "변환",
    "name_ko": "변환",
    "name_en": "",
    "type": "weapon",
    "desc": "Transmutation 마법 계열."
  },
  {
    "id": "소환",
    "name_ko": "소환",
    "name_en": "",
    "type": "weapon",
    "desc": "Conjuration 마법 계열."
  },
  {
    "id": "방호",
    "name_ko": "방호",
    "name_en": "",
    "type": "weapon",
    "desc": "Abjuration 마법 계열."
  },
  {
    "id": "환상",
    "name_ko": "환상",
    "name_en": "",
    "type": "weapon",
    "desc": "Illusion 마법 계열."
  },
  {
    "id": "예지",
    "name_ko": "예지",
    "name_en": "",
    "type": "weapon",
    "desc": "Divination 마법 계열."
  },
  {
    "id": "조종",
    "name_ko": "조종",
    "name_en": "",
    "type": "weapon",
    "desc": "Enchantment 마법 계열."
  },
  {
    "id": "소멸",
    "name_ko": "소멸",
    "name_en": "",
    "type": "weapon",
    "desc": "Evocation 마법 계열."
  },
  {
    "id": "죽음",
    "name_ko": "죽음",
    "name_en": "",
    "type": "mechanic",
    "desc": "이 특성을 가진 효과는 HP를 0으로 줄이면 즉사시킵니다. 일부 죽음 효과는 HP를 줄이지 않고 직접 사망시킵니다."
  },
  {
    "id": "집중",
    "name_ko": "집중",
    "name_en": "",
    "type": "mechanic",
    "desc": "정신적 집중과 규율이 필요한 행동."
  },
  {
    "id": "캔트립",
    "name_ko": "캔트립",
    "name_en": "",
    "type": "mechanic",
    "desc": "마음대로 시전 가능하며 레벨의 절반(올림)으로 자동 강화되는 주문."
  },
  {
    "id": "지속",
    "name_ko": "지속",
    "name_en": "",
    "type": "weapon",
    "desc": "시전자가 매 턴 지속 행동으로 유지해야 함."
  },
  {
    "id": "의식",
    "name_ko": "의식",
    "name_en": "",
    "type": "mechanic",
    "desc": "전투 중 시전 불가. 특수 소재 필요."
  },
  {
    "id": "공포",
    "name_ko": "공포",
    "name_en": "",
    "type": "mechanic",
    "desc": "공포의 감정을 유발하는 효과. 항상 정신과 감정 특성도 가집니다."
  },
  {
    "id": "감정",
    "name_ko": "감정",
    "name_en": "",
    "type": "mechanic",
    "desc": "생물의 감정을 변화시키는 효과. 항상 정신 특성도 가집니다. 특수 훈련을 받았거나 기계적/인공 지능을 가진 생물은 감정 효과에 면역입니다."
  },
  {
    "id": "변신",
    "name_ko": "변신",
    "name_en": "",
    "type": "weapon",
    "desc": "동시에 하나의 변신만 적용 가능."
  },
  {
    "id": "독",
    "name_ko": "독",
    "name_en": "",
    "type": "damage",
    "desc": "독을 전달하거나 독 피해를 가하는 효과. 이 특성을 가진 아이템은 독성이 있으며 질환을 유발할 수 있습니다."
  },
  {
    "id": "불",
    "name_ko": "불",
    "name_en": "",
    "type": "weapon",
    "desc": "화염 피해 또는 효과."
  },
  {
    "id": "냉기",
    "name_ko": "냉기",
    "name_en": "",
    "type": "damage",
    "desc": "냉기 피해 또는 효과."
  },
  {
    "id": "번개",
    "name_ko": "번개",
    "name_en": "",
    "type": "weapon",
    "desc": "전기 피해 또는 효과."
  },
  {
    "id": "산성",
    "name_ko": "산성",
    "name_en": "",
    "type": "damage",
    "desc": "산성 피해 또는 효과."
  },
  {
    "id": "음파",
    "name_ko": "음파",
    "name_en": "",
    "type": "damage",
    "desc": "음파 피해 또는 효과."
  },
  {
    "id": "정신",
    "name_ko": "정신",
    "name_en": "",
    "type": "damage",
    "desc": "정신 효과는 대상의 마음을 변경합니다. 물체나 지성 없는 생물에게는 효과가 없습니다."
  },
  {
    "id": "빛",
    "name_ko": "빛",
    "name_en": "",
    "type": "weapon",
    "desc": "빛 효과."
  },
  {
    "id": "어둠",
    "name_ko": "어둠",
    "name_en": "",
    "type": "mechanic",
    "desc": "어둠에서는 암시야 없이 눈멈 상태. 생물/물체가 숨겨짐 또는 미탐지."
  },
  {
    "id": "치유",
    "name_ko": "치유",
    "name_en": "",
    "type": "weapon",
    "desc": "생물의 몸을 회복시키는 효과. 보통 히트 포인트를 회복하지만, 때때로 질병이나 다른 약화 효과를 제거합니다."
  },
  {
    "id": "부정",
    "name_ko": "부정",
    "name_en": "",
    "type": "damage",
    "desc": "공허 에너지 효과."
  },
  {
    "id": "신성력",
    "name_ko": "신성력",
    "name_en": "",
    "type": "weapon",
    "desc": "활력 에너지 효과."
  },
  {
    "id": "저주",
    "name_ko": "저주",
    "name_en": "",
    "type": "weapon",
    "desc": "장기적 고통을 주는 마법 효과. 저주를 직접 대상으로 하는 효과로만 제거 가능."
  },
  {
    "id": "질병",
    "name_ko": "질병",
    "name_en": "",
    "type": "weapon",
    "desc": "질병 면역 생물에게 효과 없음."
  },
  {
    "id": "접촉",
    "name_ko": "접촉",
    "name_en": "",
    "type": "weapon",
    "desc": "접촉 거리 내 목표에게만 시전 가능."
  },
  {
    "id": "인간형",
    "name_ko": "인간형",
    "name_en": "",
    "type": "creature",
    "desc": "인간형 생물 분류. 직립 보행, 팔 2개 다리 2개."
  },
  {
    "id": "인간",
    "name_ko": "인간",
    "name_en": "",
    "type": "ancestry",
    "desc": "이 특성을 가진 생물은 인간 혈통입니다. 이 특성의 능력은 인간만 사용 가능."
  },
  {
    "id": "엘프",
    "name_ko": "엘프",
    "name_en": "",
    "type": "ancestry",
    "desc": "이 특성을 가진 생물은 엘프 혈통입니다. 이 특성의 능력은 엘프만 사용 가능."
  },
  {
    "id": "드워프",
    "name_ko": "드워프",
    "name_en": "",
    "type": "ancestry",
    "desc": "이 특성을 가진 생물은 드워프 혈통입니다. 이 특성의 능력은 드워프만 사용 가능."
  },
  {
    "id": "노움",
    "name_ko": "노움",
    "name_en": "",
    "type": "ancestry",
    "desc": "이 특성을 가진 생물은 노움 혈통입니다. 이 특성의 능력은 노움만 사용 가능."
  },
  {
    "id": "고블린",
    "name_ko": "고블린",
    "name_en": "",
    "type": "ancestry",
    "desc": "이 특성을 가진 생물은 고블린 혈통입니다. 이 특성의 능력은 고블린만 사용 가능."
  },
  {
    "id": "하플링",
    "name_ko": "하플링",
    "name_en": "",
    "type": "ancestry",
    "desc": "이 특성을 가진 생물은 하플링 혈통입니다. 이 특성의 능력은 하플링만 사용 가능."
  },
  {
    "id": "오크",
    "name_ko": "오크",
    "name_en": "",
    "type": "ancestry",
    "desc": "이 특성을 가진 생물은 오크 혈통입니다. 이 특성의 능력은 오크만 사용 가능."
  },
  {
    "id": "레쉬",
    "name_ko": "레쉬",
    "name_en": "",
    "type": "ancestry",
    "desc": "이 특성을 가진 생물은 레쉬 혈통입니다. 식물 또는 균류 생물. 이 특성의 능력은 레쉬만 사용 가능."
  },
  {
    "id": "식물",
    "name_ko": "식물",
    "name_en": "",
    "type": "creature",
    "desc": "식물 생물 분류. 일반 식물과 구별됨."
  },
  {
    "id": "조작",
    "name_ko": "조작",
    "name_en": "",
    "type": "mechanic",
    "desc": "손이나 도구로 물체를 다루는 행동. 기회 공격을 유발할 수 있음."
  },
  {
    "id": "공격",
    "name_ko": "공격",
    "name_en": "",
    "type": "mechanic",
    "desc": "이 특성을 가진 능력은 공격을 포함합니다. 턴에서 첫 번째 이후의 각 공격에 대해 다중 공격 페널티가 적용됩니다."
  },
  {
    "id": "활력",
    "name_ko": "활력",
    "name_en": "",
    "type": "weapon",
    "desc": "활력 에너지. 산 것을 치유하고 언데드에 피해."
  },
  {
    "id": "공허",
    "name_ko": "공허",
    "name_en": "",
    "type": "weapon",
    "desc": "공허 에너지. 산 것에 피해, 언데드를 치유."
  },
  {
    "id": "변이",
    "name_ko": "변이",
    "name_en": "",
    "type": "weapon",
    "desc": "생물의 형태를 약간 변형하는 주문. 변이 효과가 부여하는 타격은 마법 특성을 얻습니다. 여러 변이 효과를 동시에 받을 수 있지만, 같은 신체 부위를 두 번 이상 변이하면 두 번째 효과가 첫 번째를 상쇄하려 시도합니다. 변신 효과가 변이를 무효화하면 변이가 종료될 수 있습니다."
  },
  {
    "id": "탐지",
    "name_ko": "탐지",
    "name_en": "",
    "type": "mechanic",
    "desc": "탐지 효과. 무언가의 존재를 감지."
  },
  {
    "id": "투시",
    "name_ko": "투시",
    "name_en": "",
    "type": "weapon",
    "desc": "투시 효과. 원거리에서 대상을 관찰."
  },
  {
    "id": "순간이동",
    "name_ko": "순간이동",
    "name_en": "",
    "type": "weapon",
    "desc": "공간의 한 지점에서 다른 지점으로 즉시 이동시키는 효과. 이동 기반 반응을 보통 유발하지 않습니다."
  },
  {
    "id": "주문형성",
    "name_ko": "주문형성",
    "name_en": "",
    "type": "weapon",
    "desc": "주문의 속성을 변경하는 행동. 변경하려는 주문을 시전하기 직전에 사용해야 합니다. 주문형성 후 주문 시전 외의 다른 행동(자유 행동, 반응 포함)을 사용하면 혜택이 사라집니다. 턴이 끝나기 전에 주문을 시전하지 않아도 마찬가지입니다."
  },
  {
    "id": "작곡",
    "name_ko": "작곡",
    "name_en": "",
    "type": "weapon",
    "desc": "작곡 작곡 주문. 바드 전용."
  },
  {
    "id": "무력화",
    "name_ko": "무력화",
    "name_en": "",
    "type": "weapon",
    "desc": "캐릭터를 완전히 전투 불능으로 만들 수 있는 능력. 주문의 경우, 주문 랭크×2보다 높은 레벨의 생물은 판정 결과가 한 단계 나아집니다."
  },
  {
    "id": "은밀",
    "name_ko": "은밀",
    "name_en": "",
    "type": "weapon",
    "desc": "은밀. 주문 시전의 시각/청각 표시가 없음."
  },
  {
    "id": "강력",
    "name_ko": "강력",
    "name_en": "",
    "type": "weapon",
    "desc": "강력. 턴당 1회만 사용 가능."
  },
  {
    "id": "성별화",
    "name_ko": "성별화",
    "name_en": "",
    "type": "weapon",
    "desc": "성별화. 신성 또는 불경 효과."
  },
  {
    "id": "대지",
    "name_ko": "대지",
    "name_en": "",
    "type": "weapon",
    "desc": "대지 원소 효과."
  },
  {
    "id": "공기",
    "name_ko": "공기",
    "name_en": "",
    "type": "weapon",
    "desc": "공기 원소 효과."
  },
  {
    "id": "물",
    "name_ko": "물",
    "name_en": "",
    "type": "weapon",
    "desc": "물 원소 효과."
  },
  {
    "id": "그림자",
    "name_ko": "그림자",
    "name_en": "",
    "type": "weapon",
    "desc": "그림자 효과."
  },
  {
    "id": "언어",
    "name_ko": "언어",
    "name_en": "",
    "type": "weapon",
    "desc": "언어 이해에 의존하는 효과. 대상이 사용하는 언어를 이해해야 효과가 적용됩니다."
  },
  {
    "id": "청각",
    "name_ko": "청각",
    "name_en": "",
    "type": "mechanic",
    "desc": "소리에 의존하는 행동/효과. 대상이 들을 수 있어야 효과 적용."
  },
  {
    "id": "시각",
    "name_ko": "시각",
    "name_en": "",
    "type": "mechanic",
    "desc": "시각 효과는 대상이 볼 수 있어야만 효과가 적용됩니다. 효과의 시각적 부분에만 적용되며, 구체적인 판단은 GM이 합니다."
  },
  {
    "id": "환영",
    "name_ko": "환영",
    "name_en": "",
    "type": "weapon",
    "desc": "환영 효과. 감각을 속입니다."
  },
  {
    "id": "불운",
    "name_ko": "불운",
    "name_en": "",
    "type": "weapon",
    "desc": "불운 효과는 주사위 굴림을 불리하게 변경합니다. 두 번 굴려 낮은 결과를 사용하는 등. 행운 효과와 동시에 적용되면 서로 상쇄. 불운 효과가 여러 개면 GM이 가장 나쁜 것을 결정하여 적용합니다."
  },
  {
    "id": "행운",
    "name_ko": "행운",
    "name_en": "",
    "type": "weapon",
    "desc": "행운과 불운 효과는 주사위 굴림 방식을 변경합니다. 실패한 굴림을 다시 굴리거나, 두 번 굴려 높은 결과를 사용하는 등. 하나의 굴림에 행운 효과와 불운 효과가 동시에 적용되면 서로 상쇄되어 정상적으로 굴립니다. 하나의 굴림에 행운 효과는 1개만 적용 가능."
  },
  {
    "id": "역장",
    "name_ko": "역장",
    "name_en": "force",
    "type": "weapon",
    "desc": "이 특성을 가진 효과는 역장 피해를 입히거나 순수한 마법의 힘으로 만들어진 물체를 생성합니다."
  },
  {
    "id": "일반",
    "name_ko": "일반",
    "name_en": "",
    "type": "rarity",
    "desc": "클래스 무관 선택 가능한 재주."
  },
  {
    "id": "원형",
    "name_ko": "원형",
    "name_en": "",
    "type": "weapon",
    "desc": "다중 클래스 전용 재주."
  },
  {
    "id": "일반 기술",
    "name_ko": "일반 기술",
    "name_en": "",
    "type": "weapon",
    "desc": "일반 기술 재주."
  },
  {
    "id": "헌신",
    "name_ko": "헌신",
    "name_en": "",
    "type": "weapon",
    "desc": "다중 클래스 헌신 재주. 헌신 2개 이상 전에 원형 재주 2개 필요."
  },
  {
    "id": "다중클래스",
    "name_ko": "다중클래스",
    "name_en": "",
    "type": "weapon",
    "desc": "다중 클래스 원형 재주."
  },
  {
    "id": "주문변형",
    "name_ko": "주문변형",
    "name_en": "",
    "type": "mechanic",
    "desc": "다음에 시전하는 주문의 형태를 변경."
  },
  {
    "id": "이동",
    "name_ko": "이동",
    "name_en": "",
    "type": "mechanic",
    "desc": "이 특성을 가진 행동은 한 칸에서 다른 칸으로의 이동을 포함합니다."
  },
  {
    "id": "자세",
    "name_ko": "자세",
    "name_en": "",
    "type": "weapon",
    "desc": "자세 특성 행동으로 진입하며 일정 시간 유지하는 전투 전략. 기절, 요구사항 위반, 조우 종료, 다른 자세 사용 중 먼저 발생하는 것까지 지속. 자세 행동 사용 후 1라운드 동안 다른 자세 행동을 사용할 수 없습니다. 조우 모드에서만 진입 가능. 자세를 해제할 수 있습니다."
  },
  {
    "id": "압박",
    "name_ko": "압박",
    "name_en": "",
    "type": "weapon",
    "desc": "이전 공격에 이어서 사용하는 행동. 현재 다중 공격 페널티의 영향을 받고 있을 때만 사용 가능. 자신의 턴이 아닐 때는 준비 활동을 사용하더라도 압박 행동을 사용할 수 없습니다. 일부 압박 행동은 실패 시에도 효과를 부여합니다(대실패에는 적용 안 됨). 압박 행동이 성공하면 실패 효과를 대신 적용할 수 있습니다."
  },
  {
    "id": "화려함",
    "name_ko": "화려함",
    "name_en": "",
    "type": "weapon",
    "desc": "이 특성을 가진 행동은 너무 큰 노력을 필요로 하여 자주 수행할 수 없습니다. 라운드당 화려함 특성 행동을 1회만 사용할 수 있습니다."
  },
  {
    "id": "봉헌",
    "name_ko": "봉헌",
    "name_en": "",
    "type": "weapon",
    "desc": "봉헌 효과. 신성 의식."
  },
  {
    "id": "탐험",
    "name_ko": "탐험",
    "name_en": "",
    "type": "weapon",
    "desc": "1턴 이상 소요되는 활동으로, 보통 탐험 모드에서만 사용 가능합니다."
  },
  {
    "id": "정밀",
    "name_ko": "정밀",
    "name_en": "",
    "type": "damage",
    "desc": "정밀 피해. 같은 대상에 1라운드 1회만."
  },
  {
    "id": "예측",
    "name_ko": "예측",
    "name_en": "",
    "type": "weapon",
    "desc": "예측 효과."
  },
  {
    "id": "바드",
    "name_ko": "바드",
    "name_en": "",
    "type": "weapon",
    "desc": "바드 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "클레릭",
    "name_ko": "클레릭",
    "name_en": "",
    "type": "weapon",
    "desc": "클레릭 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "드루이드",
    "name_ko": "드루이드",
    "name_en": "",
    "type": "weapon",
    "desc": "드루이드 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "파이터",
    "name_ko": "파이터",
    "name_en": "",
    "type": "weapon",
    "desc": "파이터 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "레인저",
    "name_ko": "레인저",
    "name_en": "",
    "type": "weapon",
    "desc": "레인저 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "로그",
    "name_ko": "로그",
    "name_en": "",
    "type": "weapon",
    "desc": "로그 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "위치",
    "name_ko": "위치",
    "name_en": "",
    "type": "weapon",
    "desc": "위치 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "위저드",
    "name_ko": "위저드",
    "name_en": "",
    "type": "weapon",
    "desc": "위저드 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "체인질링",
    "name_ko": "체인질링",
    "name_en": "",
    "type": "ancestry",
    "desc": "체인질링 다목적 유산. 해그의 후손."
  },
  {
    "id": "네피림",
    "name_ko": "네피림",
    "name_en": "",
    "type": "ancestry",
    "desc": "네피림 다목적 유산. 차원 혈손."
  },
  {
    "id": "아이우바린",
    "name_ko": "아이우바린",
    "name_en": "",
    "type": "ancestry",
    "desc": "아이우바린 다목적 유산. 반엘프."
  },
  {
    "id": "드로마르",
    "name_ko": "드로마르",
    "name_en": "",
    "type": "ancestry",
    "desc": "드로마르 다목적 유산. 반오크."
  },
  {
    "id": "[1행동]",
    "name_ko": "[1행동]",
    "name_en": "",
    "type": "weapon",
    "desc": "가장 간단하고 가장 일반적인 행동 유형. 조우에서 자신의 턴에 원하는 순서로 3개의 단일 행동을 사용할 수 있습니다."
  },
  {
    "id": "[반응]",
    "name_ko": "[반응]",
    "name_en": "",
    "type": "weapon",
    "desc": "자기 턴이 아닐 때도 사용 가능. 조우 라운드당 반응 1회만 사용 가능. 특정 유발 조건이 충족될 때만 사용 가능. 종종 유발 조건은 다른 생물의 행동입니다."
  },
  {
    "id": "[자유 행동]",
    "name_ko": "[자유 행동]",
    "name_en": "",
    "type": "weapon",
    "desc": "3개의 단일 행동이나 반응을 소비하지 않음. 반응처럼 유발 조건이 있을 수 있으며, 그런 경우 반응처럼 사용 — 자기 턴이 아니어도. 단, 유발 조건당 자유 행동 1개만 사용 가능. 유발 조건이 없으면 단일 행동처럼 사용하되 행동을 소비하지 않음."
  },
  {
    "id": "1단계",
    "name_ko": "1단계",
    "name_en": "",
    "type": "weapon",
    "desc": "캐릭터 아이디어"
  },
  {
    "id": "2단계",
    "name_ko": "2단계",
    "name_en": "",
    "type": "weapon",
    "desc": "속성 수정치"
  },
  {
    "id": "3단계",
    "name_ko": "3단계",
    "name_en": "",
    "type": "weapon",
    "desc": "시작 HP(혈통분), 크기, 속도, 감각, 혈통 재주 1개"
  },
  {
    "id": "4단계",
    "name_ko": "4단계",
    "name_en": "",
    "type": "weapon",
    "desc": "배경 보너스"
  },
  {
    "id": "5단계",
    "name_ko": "5단계",
    "name_en": "",
    "type": "weapon",
    "desc": "클래스 능력"
  },
  {
    "id": "6단계",
    "name_ko": "6단계",
    "name_en": "",
    "type": "weapon",
    "desc": "최종 속성 수정치"
  },
  {
    "id": "7단계",
    "name_ko": "7단계",
    "name_en": "",
    "type": "weapon",
    "desc": "전투 수치"
  },
  {
    "id": "8단계",
    "name_ko": "8단계",
    "name_en": "",
    "type": "weapon",
    "desc": "장비"
  },
  {
    "id": "9단계",
    "name_ko": "9단계",
    "name_en": "",
    "type": "weapon",
    "desc": "주문 목록"
  },
  {
    "id": "10단계",
    "name_ko": "10단계",
    "name_en": "",
    "type": "weapon",
    "desc": "캐릭터 완성"
  },
  {
    "id": "유인원",
    "name_ko": "유인원",
    "name_en": "",
    "type": "weapon",
    "desc": "주먹 1d8 둔기등반 25피트, 위협적 표시"
  },
  {
    "id": "곰",
    "name_ko": "곰",
    "name_en": "",
    "type": "weapon",
    "desc": "턱 1d8 관통, 발톱 1d6 참격탑승 가능, 포옹 공격"
  },
  {
    "id": "고양이",
    "name_ko": "고양이",
    "name_en": "",
    "type": "weapon",
    "desc": "턱 1d6 관통, 발톱 1d4 참격민첩, 은밀 지원"
  },
  {
    "id": "독수리",
    "name_ko": "독수리",
    "name_en": "",
    "type": "weapon",
    "desc": "부리 1d6 관통, 발톱 1d4 참격비행, 시야 지원"
  },
  {
    "id": "말",
    "name_ko": "말",
    "name_en": "",
    "type": "weapon",
    "desc": "발굽 1d6 둔기탑승 전용, 돌진 지원"
  },
  {
    "id": "뱀",
    "name_ko": "뱀",
    "name_en": "",
    "type": "weapon",
    "desc": "송곳니 1d8 관통독 지원, 붙잡기"
  },
  {
    "id": "늑대",
    "name_ko": "늑대",
    "name_en": "",
    "type": "weapon",
    "desc": "턱 1d8 관통넘어뜨리기 지원"
  },
  {
    "id": "공룡 (드로메오사우루스)",
    "name_ko": "공룡 (드로메오사우루스)",
    "name_en": "",
    "type": "weapon",
    "desc": "턱 1d8 관통, 발톱 1d6 참격민첩, 도약 공격"
  },
  {
    "id": "바드 헌신",
    "name_ko": "바드 헌신",
    "name_en": "",
    "type": "weapon",
    "desc": "오컬트 주문시전(캔트립 2개 + 레퍼토리), 뮤즈 선택"
  },
  {
    "id": "클레릭 헌신",
    "name_ko": "클레릭 헌신",
    "name_en": "",
    "type": "weapon",
    "desc": "신성 주문시전(캔트립), 신격 선택, 신성 원천"
  },
  {
    "id": "드루이드 헌신",
    "name_ko": "드루이드 헌신",
    "name_en": "",
    "type": "weapon",
    "desc": "근원 주문시전(캔트립), 결사 선택, 야생노래"
  },
  {
    "id": "파이터 헌신",
    "name_ko": "파이터 헌신",
    "name_en": "",
    "type": "weapon",
    "desc": "공격 숙련도 전문가화, 반응 타격"
  },
  {
    "id": "레인저 헌신",
    "name_ko": "레인저 헌신",
    "name_en": "",
    "type": "weapon",
    "desc": "사냥감 추적, 기질 선택"
  },
  {
    "id": "로그 헌신",
    "name_ko": "로그 헌신",
    "name_en": "",
    "type": "weapon",
    "desc": "은밀 공격 1d6, 기습, 추가 기술"
  },
  {
    "id": "위치 헌신",
    "name_ko": "위치 헌신",
    "name_en": "",
    "type": "weapon",
    "desc": "후원자 전통의 주문시전(캔트립), 사역마"
  },
  {
    "id": "위저드 헌신",
    "name_ko": "위저드 헌신",
    "name_en": "",
    "type": "weapon",
    "desc": "비전 주문시전(캔트립), 주문서, 비전 학파"
  },
  {
    "id": "곡예 <span class=\"en\">Acrobatics</span>",
    "name_ko": "곡예 <span class=\"en\">Acrobatics</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "균형 잡기, 덤블 통과기동 비행, 빠른 비집기"
  },
  {
    "id": "주문학 <span class=\"en\">Arcana</span>",
    "name_ko": "주문학 <span class=\"en\">Arcana</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "지식 회상비전 주문 빌리기, 문서 해독, 마법 식별, 주문 학습"
  },
  {
    "id": "운동 <span class=\"en\">Athletics</span>",
    "name_ko": "운동 <span class=\"en\">Athletics</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "등반, 억지로 열기, 붙잡기, 높이뛰기, 멀리뛰기, 재배치, 밀기, 수영, 넘어뜨리기무장 해제"
  },
  {
    "id": "제작 <span class=\"en\">Crafting</span>",
    "name_ko": "제작 <span class=\"en\">Crafting</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "지식 회상, 수리제작, 돈 벌기, 연금술 식별"
  },
  {
    "id": "기만 <span class=\"en\">Deception</span>",
    "name_ko": "기만 <span class=\"en\">Deception</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "주의 분산, 변장, 거짓말속임"
  },
  {
    "id": "외교 <span class=\"en\">Diplomacy</span>",
    "name_ko": "외교 <span class=\"en\">Diplomacy</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "정보 수집, 인상 만들기, 요청—"
  },
  {
    "id": "위협 <span class=\"en\">Intimidation</span>",
    "name_ko": "위협 <span class=\"en\">Intimidation</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "사기 저하, 강요—"
  },
  {
    "id": "지식 <span class=\"en\">Lore</span>",
    "name_ko": "지식 <span class=\"en\">Lore</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "지식 회상돈 벌기"
  },
  {
    "id": "의학 <span class=\"en\">Medicine</span>",
    "name_ko": "의학 <span class=\"en\">Medicine</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "응급 처치, 지식 회상질병 치료, 독 치료, 상처 치료"
  },
  {
    "id": "자연학 <span class=\"en\">Nature</span>",
    "name_ko": "자연학 <span class=\"en\">Nature</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "동물 명령, 지식 회상마법 식별, 주문 학습"
  },
  {
    "id": "오컬티즘 <span class=\"en\">Occultism</span>",
    "name_ko": "오컬티즘 <span class=\"en\">Occultism</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "지식 회상문서 해독, 마법 식별, 주문 학습"
  },
  {
    "id": "공연 <span class=\"en\">Performance</span>",
    "name_ko": "공연 <span class=\"en\">Performance</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "공연돈 벌기"
  },
  {
    "id": "종교 <span class=\"en\">Religion</span>",
    "name_ko": "종교 <span class=\"en\">Religion</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "지식 회상문서 해독, 마법 식별, 주문 학습"
  },
  {
    "id": "사회 <span class=\"en\">Society</span>",
    "name_ko": "사회 <span class=\"en\">Society</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "지식 회상, 생존문서 해독, 위조 생성"
  },
  {
    "id": "은신 <span class=\"en\">Stealth</span>",
    "name_ko": "은신 <span class=\"en\">Stealth</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "물건 숨기기, 숨기, 잠행—"
  },
  {
    "id": "생존 <span class=\"en\">Survival</span>",
    "name_ko": "생존 <span class=\"en\">Survival</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "방향 감각, 생존추적, 은폐 흔적"
  },
  {
    "id": "도둑질 <span class=\"en\">Thievery</span>",
    "name_ko": "도둑질 <span class=\"en\">Thievery</span>",
    "name_en": "",
    "type": "weapon",
    "desc": "손재주, 훔치기장치 해제, 자물쇠 열기"
  },
  {
    "id": "보폭(Stride)",
    "name_ko": "보폭",
    "name_en": "",
    "type": "weapon",
    "desc": "이동 속도까지 이동"
  },
  {
    "id": "한 걸음(Step)",
    "name_ko": "한 걸음",
    "name_en": "",
    "type": "weapon",
    "desc": "5피트 이동(반응 유발 안 함)"
  },
  {
    "id": "타격(Strike)",
    "name_ko": "타격",
    "name_en": "",
    "type": "weapon",
    "desc": "무기나 비무장으로 공격"
  },
  {
    "id": "상호작용(Interact)",
    "name_ko": "상호작용",
    "name_en": "",
    "type": "weapon",
    "desc": "물체 잡기, 놓기, 문 열기 등"
  },
  {
    "id": "놓기(Release)",
    "name_ko": "놓기",
    "name_en": "",
    "type": "weapon",
    "desc": "들고 있는 물체를 놓음"
  },
  {
    "id": "탐색(Seek)",
    "name_ko": "탐색",
    "name_en": "",
    "type": "weapon",
    "desc": "숨겨진 것을 지각 판정으로 찾기"
  },
  {
    "id": "감지(Sense Motive)",
    "name_ko": "감지",
    "name_en": "",
    "type": "weapon",
    "desc": "생물의 의도를 지각 판정으로 파악"
  },
  {
    "id": "은신(Hide)",
    "name_ko": "은신",
    "name_en": "",
    "type": "weapon",
    "desc": "엄폐/은폐 뒤에 숨기"
  },
  {
    "id": "잠행(Sneak)",
    "name_ko": "잠행",
    "name_en": "",
    "type": "weapon",
    "desc": "숨은 상태로 이동"
  },
  {
    "id": "지연(Delay)",
    "name_ko": "지연",
    "name_en": "",
    "type": "weapon",
    "desc": "선제 순서를 늦춤"
  },
  {
    "id": "준비(Ready)",
    "name_ko": "준비",
    "name_en": "",
    "type": "weapon",
    "desc": "발동 조건을 설정하고 반응으로 행동"
  },
  {
    "id": "엄폐(Take Cover)",
    "name_ko": "엄폐",
    "name_en": "",
    "type": "weapon",
    "desc": "엄폐를 더 효과적으로 사용"
  },
  {
    "id": "방패 올리기(Raise a Shield)",
    "name_ko": "방패 올리기",
    "name_en": "",
    "type": "weapon",
    "desc": "방패의 AC 보너스를 다음 턴까지 적용"
  },
  {
    "id": "돕기(Aid)",
    "name_ko": "돕기",
    "name_en": "",
    "type": "weapon",
    "desc": "아군의 판정에 보너스 제공"
  },
  {
    "id": "유지(Sustain)",
    "name_ko": "유지",
    "name_en": "",
    "type": "weapon",
    "desc": "유지 주문이나 효과를 계속 유지"
  },
  {
    "id": "해제(Dismiss)",
    "name_ko": "해제",
    "name_en": "",
    "type": "weapon",
    "desc": "주문이나 효과를 종료"
  },
  {
    "id": "오라",
    "name_ko": "오라",
    "name_en": "",
    "type": "mechanic",
    "desc": "지속적으로 주변에 영향을 미치는 발산 효과."
  },
  {
    "id": "출혈",
    "name_ko": "출혈",
    "name_en": "",
    "type": "damage",
    "desc": "지속 피해의 한 유형. 턴 종료 시 피해를 받고 DC 15 단순 판정으로 종료 가능."
  },
  {
    "id": "빈사",
    "name_ko": "빈사",
    "name_en": "",
    "type": "weapon",
    "desc": "생과 사의 경계. 매 턴 회복 판정(DC 10+빈사 수치). 빈사 4 도달 시 사망."
  },
  {
    "id": "하수인",
    "name_ko": "하수인",
    "name_en": "",
    "type": "weapon",
    "desc": "다른 생물을 직접 섬기는 생물. 전투에서 매 턴 1회, 당신이 행동을 소비하여 명령할 때 행동합니다. 동물 동료는 동물 명령, 소환된 하수인은 효과 유지. 명령 없으면 자신을 방어하거나 명백한 위험을 피하는 것 외에 행동하지 않습니다. 하수인은 턴당 2행동+0반응만 가집니다."
  },
  {
    "id": "반응",
    "name_ko": "반응",
    "name_en": "",
    "type": "mechanic",
    "desc": "특정 유발 조건에 반응하여 사용하는 행동. 턴당 1회."
  },
  {
    "id": "비일반",
    "name_ko": "비일반",
    "name_en": "",
    "type": "rarity",
    "desc": "특별한 접근이나 GM 허가가 필요한 아이템/주문/재주."
  },
  {
    "id": "눈멈",
    "name_ko": "눈멈",
    "name_en": "",
    "type": "weapon",
    "desc": "시각 완전 상실. 모든 지형이 험지. 시각 필요 판정에 대실패."
  },
  {
    "id": "서투름",
    "name_ko": "서투름",
    "name_en": "",
    "type": "weapon",
    "desc": "민첩 기반 판정/DC에 상태 페널티 = 수치. AC, 반사 내성에도 영향."
  },
  {
    "id": "은폐",
    "name_ko": "은폐",
    "name_en": "",
    "type": "weapon",
    "desc": "잘 보이지 않음. 공격 시 DC 5 단순 판정 필요."
  },
  {
    "id": "혼란",
    "name_ko": "혼란",
    "name_en": "",
    "type": "weapon",
    "desc": "무작위 행동. 가장 가까운 생물 공격 등. 매 턴 끝에 의지로 탈출 시도."
  },
  {
    "id": "지배",
    "name_ko": "지배",
    "name_en": "",
    "type": "weapon",
    "desc": "다른 생물이 행동을 지배. 반응 사용 불가."
  },
  {
    "id": "눈부심",
    "name_ko": "눈부심",
    "name_en": "",
    "type": "weapon",
    "desc": "시각 의존 대상이 은폐로 취급."
  },
  {
    "id": "귀먹음",
    "name_ko": "귀먹음",
    "name_en": "",
    "type": "weapon",
    "desc": "청각 상실. 청각 기반 지각에 자동 대실패. 주문시전 시 DC 5 단순 판정."
  },
  {
    "id": "운명",
    "name_ko": "운명",
    "name_en": "",
    "type": "weapon",
    "desc": "사망 수치가 운명 수치만큼 감소. 장기 휴식 시 1 감소."
  },
  {
    "id": "배수",
    "name_ko": "배수",
    "name_en": "",
    "type": "weapon",
    "desc": "건강 기반 판정에 페널티. 최대 HP가 레벨 x 수치만큼 감소. 장기 휴식 시 1 감소."
  },
  {
    "id": "약화",
    "name_ko": "약화",
    "name_en": "",
    "type": "weapon",
    "desc": "근력 기반 판정/DC에 상태 페널티 = 수치."
  },
  {
    "id": "매혹",
    "name_ko": "매혹",
    "name_en": "",
    "type": "mechanic",
    "desc": "매혹 원인 외 감지/기술에 -2. 주의를 돌리는 행동 불가."
  },
  {
    "id": "피로",
    "name_ko": "피로",
    "name_en": "",
    "type": "weapon",
    "desc": "AC와 내성에 -1 상태 페널티. 탐험 활동 선택 불가. 8시간 휴식으로 해소."
  },
  {
    "id": "도주",
    "name_ko": "도주",
    "name_en": "",
    "type": "weapon",
    "desc": "모든 행동을 공포원에서 도망치는 데 사용."
  },
  {
    "id": "숨겨짐",
    "name_ko": "숨겨짐",
    "name_en": "",
    "type": "weapon",
    "desc": "위치는 알지만 볼 수 없음. 대상 지정 시 DC 11 단순 판정."
  },
  {
    "id": "이동 불가",
    "name_ko": "이동 불가",
    "name_en": "",
    "type": "weapon",
    "desc": "현재 위치에서 이동 불가. 이동 불필요 행동은 가능."
  },
  {
    "id": "투명",
    "name_ko": "투명",
    "name_en": "",
    "type": "weapon",
    "desc": "시각으로 감지 불가. 미탐지 상태(시각에 대해)."
  },
  {
    "id": "무방비",
    "name_ko": "무방비",
    "name_en": "",
    "type": "weapon",
    "desc": "AC에 -2 상황 페널티. 협공, 넘어짐, 은신 공격 등으로 발생."
  },
  {
    "id": "마비",
    "name_ko": "마비",
    "name_en": "",
    "type": "weapon",
    "desc": "완전히 움직일 수 없음. 무방비. 순수 정신 행동만 가능."
  },
  {
    "id": "석화",
    "name_ko": "석화",
    "name_en": "",
    "type": "weapon",
    "desc": "돌로 변함. 행동/감각 불가. AC 9, 경도 8, HP 50."
  },
  {
    "id": "엎드려짐",
    "name_ko": "엎드려짐",
    "name_en": "",
    "type": "weapon",
    "desc": "바닥에 누움. 무방비 + 공격에 -2. 일어나기에 1행동. 원거리 공격에 +1 AC."
  },
  {
    "id": "가속",
    "name_ko": "가속",
    "name_en": "",
    "type": "weapon",
    "desc": "매 턴 추가 행동 1개(보통 용도 제한). 여러 가속은 누적 불가."
  },
  {
    "id": "포박",
    "name_ko": "포박",
    "name_en": "",
    "type": "weapon",
    "desc": "이동 불가 + 무방비 + 조작에 DC 5 단순 판정. 탈출로 빠져나옴."
  },
  {
    "id": "메스꺼움",
    "name_ko": "메스꺼움",
    "name_en": "",
    "type": "weapon",
    "desc": "모든 판정/DC에 페널티 = 수치. 삼키기 불가. 1행동으로 인내 내성 시도하여 감소."
  },
  {
    "id": "둔화",
    "name_ko": "둔화",
    "name_en": "",
    "type": "weapon",
    "desc": "턴 시작 시 행동이 수치만큼 감소."
  },
  {
    "id": "기절",
    "name_ko": "기절",
    "name_en": "",
    "type": "weapon",
    "desc": "행동/반응 불가. 수치가 있으면 해당 수만큼 행동 소실."
  },
  {
    "id": "멍함",
    "name_ko": "멍함",
    "name_en": "",
    "type": "weapon",
    "desc": "정신 기반 판정/DC에 페널티 = 수치. 주문시전 시 DC 5+수치 단순 판정(실패 시 소실)."
  },
  {
    "id": "무의식",
    "name_ko": "무의식",
    "name_en": "",
    "type": "weapon",
    "desc": "의식 없음. AC -4, 감지 -4, 무방비+눈멈. 행동 불가."
  },
  {
    "id": "부상",
    "name_ko": "부상",
    "name_en": "",
    "type": "weapon",
    "desc": "빈사 시 빈사 수치에 부상 수치 추가. 전체 HP 회복 시 해소."
  },
  {
    "id": "개방",
    "name_ko": "개방",
    "name_en": "",
    "type": "weapon",
    "desc": "이 특성을 가진 행동은 턴에 첫 번째 공격으로만 사용할 수 있습니다. 다중 공격 페널티가 적용되기 전에만 사용 가능."
  },
  {
    "id": "소환됨",
    "name_ko": "소환됨",
    "name_en": "",
    "type": "weapon",
    "desc": "주문이나 효과로 불려진 생물. 소환된 생물은 다른 생물을 소환하거나, 가치 있는 것을 만들거나, 비용이 필요한 주문을 시전할 수 없습니다. 하수인 특성을 가집니다. 같은 랭크 이상의 주문을 시전하려 하면 자체 주문이 실패하고 소환 주문이 종료됩니다."
  },
  {
    "id": "비밀",
    "name_ko": "비밀",
    "name_en": "",
    "type": "weapon",
    "desc": "GM이 이 능력의 판정을 비밀리에 굴립니다. 플레이어는 결과를 직접 알지 못합니다."
  },
  {
    "id": "aberration",
    "name_ko": "기형체",
    "name_en": "aberration",
    "type": "mechanic",
    "desc": "이상체는 차원 너머에서 온 존재나 자연의 질서의 변질된 형태입니다."
  },
  {
    "id": "acid",
    "name_ko": "산성",
    "name_en": "acid",
    "type": "mechanic",
    "desc": "이 특성을 가진 효과는 산성 피해를 입힙니다. 이 특성을 가진 생물은 산과 마법적인 관련이 있습니다."
  },
  {
    "id": "additive",
    "name_ko": "첨가제",
    "name_en": "additive",
    "type": "mechanic",
    "desc": "첨가 특성을 가진 재주를 사용하면 액션을 사용해 폭탄이나 엘릭서에 특수 물질을 추가할 수 있습니다. 하나의 연금술 아이템에는 하나의 첨가제만 추가할 수 있으며, 다른 첨가제를 추가하려고 하면 아이템이 손상됩니다. 일반적으로 첨가제 특성이 있는 액션은 주입된 연금 아이템을 제작할 때만 사용할 수 있으며, 일부 액션은 빠른 연금 액션으로만 사용할 수 있습니다. 첨가제 특성 뒤에는 항상 레벨이 붙습니다(예: 첨가 2). 첨가는 수정치 중인 연금 아이템의 레벨에 해당 레벨을 더하며, 그 결과 혼합물의 새로운 레벨이 생성됩니다. 혼합물의 아이템 레벨은 고급 연금술 레벨보다 높지 않아야 합니다."
  },
  {
    "id": "adjusted",
    "name_ko": "조정됨",
    "name_en": "adjusted",
    "type": "mechanic",
    "desc": "장비에는 항목에 설명된 조정 기능이 포함되어 있습니다. 이 조정은 장비에 영구적으로 내장되어 있으므로 장비에 다른 조정을 추가할 수 없으며, 다른 조정으로 교체할 수도 없습니다. 조정으로 인해 시끄러운 특성이 추가되는 등 아이템의 기본 통계가 변경되면 장비의 표 항목에 반영됩니다."
  },
  {
    "id": "adjustment",
    "name_ko": "조정",
    "name_en": "adjustment",
    "type": "mechanic",
    "desc": "이 특성이 있는 아이템은 주로 갑옷, 방패, 무기 등 기존 장비를 변경하는 데 사용됩니다. 주어진 아이템은 어떤 유형의 장비를 수정하는지 알려줍니다. 한 장비는 한 번에 하나의 조정에만 영향을 받을 수 있습니다. 달리 명시되지 않는 한, 조정을 추가하거나 제거하려면 10분의 활동과 수리 키트를 사용해야 합니다."
  },
  {
    "id": "aeon",
    "name_ko": "에온",
    "name_en": "aeon",
    "type": "mechanic",
    "desc": "이 감시자는 자칭 현실의 수호자입니다. 전통적인 이온은 이원론적 성격과 형태를 가지고 있으며, 이분법적 이해관계를 가지고 있지만 공리성과 필연성은 그렇지 않습니다. 공리자와 필연자 이외의 이온은 상상력이라는 기묘한 텔레파시 감각 전송을 통해 소통합니다."
  },
  {
    "id": "aesir",
    "name_ko": "아지르",
    "name_en": "aesir",
    "type": "mechanic",
    "desc": "아이시르는 종종 혼돈의 행성을 감시하며 전투 기술을 연마하고 다중 우주의 끝에서 최후의 대결을 준비하는 존재입니다."
  },
  {
    "id": "aftermath",
    "name_ko": "여파",
    "name_en": "aftermath",
    "type": "mechanic",
    "desc": "이 특성은 기이하고 치명적인 것에 노출된 후 얻게 되는 특별한 능력을 나타내는 재주를 설명합니다."
  },
  {
    "id": "agathion",
    "name_ko": "아가시온",
    "name_en": "agathion",
    "type": "mechanic",
    "desc": "동물의 재주를 가진 이 천족은 열반의 차원이 고향입니다. 대부분의 아가시온은 중립 선이며 암흑 시야를 가지고 있고 악의 피해에 약합니다."
  },
  {
    "id": "agile",
    "name_ko": "기민한",
    "name_en": "agile",
    "type": "mechanic",
    "desc": "자신의 턴 두 번째 공격에서 이 무기로 받는 다중 공격 페널티는 -5가 아니라 -4이며, 세 번째 공격 이후 턴에는 -10이 아니라 -8입니다."
  },
  {
    "id": "alchemical",
    "name_ko": "연금술",
    "name_en": "alchemical",
    "type": "mechanic",
    "desc": "연금술 아이템은 연금술 시약의 리액션으로 힘을 얻습니다. 연금술 아이템은 마법이 아니며 마법의 기운을 발산하지 않습니다."
  },
  {
    "id": "alchemist",
    "name_ko": "연금술사",
    "name_en": "alchemist",
    "type": "mechanic",
    "desc": "연금술사 클래스의 능력을 나타냅니다."
  },
  {
    "id": "amp",
    "name_ko": "증폭",
    "name_en": "amp",
    "type": "mechanic",
    "desc": "증폭은 초능력의 속성을 수정치 않는 특별한 사고방식입니다. 사이 캔트립은 각각 고유한 앰프를 가지고 있으며, 앰프 특성을 가진 재주는 일반 앰프를 대신해 사이 캔트립에 적용할 수 있는 다른 앰프를 제공합니다."
  },
  {
    "id": "amphibious",
    "name_ko": "수륙양용",
    "name_en": "amphibious",
    "type": "mechanic",
    "desc": "수륙양용 생물은 물과 공기 중에서 호흡할 수 있으며, 선호하는 환경이 아닌 곳에서도 보통 무한정, 적어도 몇 시간 동안 호흡할 수 있습니다. 이 생명체는 종종 수영 속도가 빠릅니다. 비무장 상태에서 내리치기와 베기 공격은 물속에 있을 때 받는 일반적인 -2 불이익을 받지 않습니다."
  },
  {
    "id": "anadi",
    "name_ko": "아나디",
    "name_en": "anadi",
    "type": "mechanic",
    "desc": "거미를 닮았으며 인간의 모습을 취할 수 있는 가룬드 출신의 은둔형 외톨이 민족입니다."
  },
  {
    "id": "analog",
    "name_ko": "아날로그",
    "name_en": "analog",
    "type": "mechanic",
    "desc": "이 무기는 첨단 전자 장치, 컴퓨터 시스템 및 전기 동력원을 사용하지 않지만, 첨단 기술을 사용하여 제조 및 보정되었습니다. 이 무기는 기술을 대상으로 하는 능력에 영향을 받지 않습니다. 이 무기에 고대 특성이 없는 한, 무기 룬은 이 무기에 작동하지 않습니다."
  },
  {
    "id": "android",
    "name_ko": "안드로이드",
    "name_en": "android",
    "type": "mechanic",
    "desc": "인공적인 방법으로 만들어진 합성 휴머노이드 조상. 누메리아에서 가장 흔합니다."
  },
  {
    "id": "angel",
    "name_ko": "천사",
    "name_en": "angel",
    "type": "mechanic",
    "desc": "이 천사족은 메신저이자 전사입니다. 대부분의 천사들은 성스럽고 어둠 시야를 가지고 있으며, 성스럽지 않은 것에 약점을 가지고 있습니다."
  },
  {
    "id": "animal",
    "name_ko": "동물",
    "name_en": "animal",
    "type": "mechanic",
    "desc": "동물은 지능이 비교적 낮은 생물입니다. 일반적으로 지능 속성 수정자가 -4 이상은 아니며, 언어를 말하지 못하고, 지능 기반 스킬을 훈련받을 수 없습니다."
  },
  {
    "id": "animist",
    "name_ko": "애니미스트",
    "name_en": "animist",
    "type": "mechanic",
    "desc": "이것은 애니미스트 직업의 능력을 나타냅니다."
  },
  {
    "id": "apex",
    "name_ko": "에이펙스",
    "name_en": "apex",
    "type": "mechanic",
    "desc": "정점 특성을 가진 아이템에 투자하면, 속성 수정치 중 하나가 1씩 증가하거나 총 +4까지 증가하여 더 높은 수정치를 부여합니다. 이렇게 하면 투자가 끝날 때까지 새로운 속성 수정치의 모든 혜택을 누릴 수 있습니다. 정점 아이템은 24시간 이내에 처음 투자할 때만 이 혜택을 부여하며, 한 번에 하나의 정점 아이템만 혜택을 받을 수 있습니다. 이미 정점 아이템을 투자한 상태에서 정점 아이템 투자를 시도하면, 아이템 인베스팅으로 인한 다른 효과는 모두 얻을 수 있지만 속성 수정치 증가는 얻을 수 없습니다."
  },
  {
    "id": "aphorite",
    "name_ko": "아포라이트",
    "name_en": "aphorite",
    "type": "mechanic",
    "desc": "질서 차원인 액시스의 존재로부터 내려온 일종의 차원 자손입니다."
  },
  {
    "id": "apparition",
    "name_ko": "출현",
    "name_en": "apparition",
    "type": "mechanic",
    "desc": "유령은 일반적으로 물리적 세계에 들어가거나 영향을 미칠 수 있는 힘, 일체감, 또는 연결고리가 부족한 영적 존재입니다. 유령이나 환영과 달리, 유령은 과거에 살아있던 생물체였을 필요가 없으며, 특히 의미 있는 장소나 사건의 영적 기억일 수 있습니다. 유령은 다른 사람이나 사물과 상호 작용하기 위해 애니미스트에 의존하며, 일반적으로 자신이 조화를 이루고 있는 애니미스트의 주문과 능력 외에는 다른 주문과 능력의 대상이 되거나 영향을 받을 수 없습니다. 영혼에 영향을 미치는 애니미스트의 특성과 능력은 특별히 명시된 경우에만 유령에게도 영향을 미칩니다. 유령 특성이 있는 애니미스트의 능력은 하나 이상의 유령이 당신과 함께 행동하는 것을 포함합니다. 유령 능력을 사용하려면 적어도 한 명의 유령과 조화를 이룬 상태여야 하며, 일부 능력은 요구 사항에서 조화를 이룬 유령을 구체적으로 명시할 수 있습니다. 일반적으로 당신은 매일 준비 과정에서 유령들과 조화를 이룬 것으로 간주되지만, 특정 애니미스트 능력이나 특수한 상황으로 인해 유령들이 일시적으로 분산되거나 당신과 분리될 수 있습니다. 분산된 유령과는 조화를 이룬 상태가 아닙니다."
  },
  {
    "id": "aquadynamic",
    "name_ko": "아쿠아다이나믹",
    "name_en": "aquadynamic",
    "type": "mechanic",
    "desc": "이 갑옷은 수중에서 사용하도록 설계되었으며, 유선형 디자인과 부력 소재를 사용하여 전략적인 장소에서 사용됩니다. 물이나 이와 유사한 액체에서 곡예 또는 운동 판정 시 갑옷의 판정 페널티가 적용되지 않습니다."
  },
  {
    "id": "aquatic",
    "name_ko": "아쿠아틱",
    "name_en": "aquatic",
    "type": "mechanic",
    "desc": "수중 생물은 물속이 집과 같습니다. 무기를 사용하지 않는 타격 및 베기 공격은 물속에 있어도 일반적인 -2의 페널티를 받지 않습니다. 수중 생물은 물은 숨을 쉴 수 있지만 공기는 숨을 쉴 수 없습니다."
  },
  {
    "id": "archetype",
    "name_ko": "아키타입",
    "name_en": "archetype",
    "type": "mechanic",
    "desc": "이 재주는 아키타입에 속합니다."
  },
  {
    "id": "archon",
    "name_ko": "아콘",
    "name_en": "archon",
    "type": "mechanic",
    "desc": "이 천상 존재의 종족에 속한 존재들은 천계의 수호자이며 일반적으로 성스러운 존재입니다. 그들은 어둠 시야를 가지고 있으며 성스러운 것에 약점을 가지고 있습니다."
  },
  {
    "id": "ardande",
    "name_ko": "아르단드",
    "name_en": "ardande",
    "type": "mechanic",
    "desc": "아르단데스는 키지다르와 기타 나무 원소 존재의 후손인 차원 자손입니다."
  },
  {
    "id": "artifact",
    "name_ko": "아티팩트",
    "name_en": "artifact",
    "type": "mechanic",
    "desc": "이 특성을 가진 아이템은 아티팩트입니다. 이러한 마법 아이템은 일반적인 방법으로 제작할 수 없으며, 일반적인 방법으로 손상시킬 수도 없습니다. 아티팩트는 항상 희귀하거나 고유합니다."
  },
  {
    "id": "astral",
    "name_ko": "아스트랄",
    "name_en": "astral",
    "type": "mechanic",
    "desc": "아스트랄 생물은 아스트랄 평면에 원주민으로 존재합니다. 그들은 아스트랄 평면의 기본 환경 효과에 견딜 수 있습니다."
  },
  {
    "id": "asura",
    "name_ko": "아수라",
    "name_en": "asura",
    "type": "mechanic",
    "desc": "이 질서 정연한 악마들은 신의 우연의 물리적 표현입니다. 아수라는 일반적으로 암흑 시야를 가지고 있으며, 저주에 면역이 있고, 선에 약합니다."
  },
  {
    "id": "athamaru",
    "name_ko": "아타마루",
    "name_en": "athamaru",
    "type": "mechanic",
    "desc": "아타마루스는 물고기 모양의 수생 인간형 생물입니다."
  },
  {
    "id": "attached",
    "name_ko": "부착됨",
    "name_en": "attached",
    "type": "mechanic",
    "desc": "부착된 무기는 다른 장비와 결합해야 사용할 수 있습니다. 특성에는 무기를 부착해야 하는 아이템의 종류가 나와 있습니다. 무기로 공격하려면 무기가 부착된 아이템을 휘두르거나 착용하고 있어야 합니다. 예를 들어 방패에 방패 가시가 부착되어 있으면 방패를 내려치는 대신 가시로 공격할 수 있지만, 방패를 휘두르고 있을 때만 가능합니다. 부착 무기는 일반적으로 아이템에 볼트로 고정되거나 아이템에 내장되어 있으며, 일반적으로 아이템에는 하나의 무기만 부착할 수 있습니다. 부착 무기는 10분의 작업 시간과제작 DC 10판정 성공으로 아이템에 부착할 수 있으며, 여기에는 이전 아이템에서 무기를 제거하는 데 필요한 시간도 포함됩니다. 아이템이 파괴된 경우, 부착된 무기는 일반적으로 회수할 수 있습니다."
  },
  {
    "id": "aura",
    "name_ko": "아우라",
    "name_en": "aura",
    "type": "mechanic",
    "desc": "아우라란 나로부터 지속적으로 발산되어 일정 반경 내에 있는 생물에게 영향을 미치는 기운을 말합니다. 아우라는 강력한 성향을 가진 아이템이나 생물의 마법 기운을 의미하기도 합니다."
  },
  {
    "id": "automaton",
    "name_ko": "오토마톤",
    "name_en": "automaton",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 오토마톤 조상의 일원입니다."
  },
  {
    "id": "awakened-animal",
    "name_ko": "깨어난 동물",
    "name_en": "awakened-animal",
    "type": "mechanic",
    "desc": "깨어난 동물들은 지능을 얻기 전에는 평범한 생물들이었습니다."
  },
  {
    "id": "azarketi",
    "name_ko": "아자케티",
    "name_en": "azarketi",
    "type": "mechanic",
    "desc": "내해 지역의 바다에 사는 수륙양용 인간형 종족으로, 아즐란트족의 후손이라고 전해집니다. 길맨 또는 로우 아즐란티라고도 합니다."
  },
  {
    "id": "azata",
    "name_ko": "아자타",
    "name_en": "azata",
    "type": "mechanic",
    "desc": "이 천상 생물 종족은 엘리시움 출신입니다. 그들은 일반적으로 성스러운 성격을 지니며, 어둠 시야를 가지고 있으며, 냉철과 성스러운 것에 약점을 가지고 있습니다."
  },
  {
    "id": "backstabber",
    "name_ko": "백스태버",
    "name_en": "backstabber",
    "type": "mechanic",
    "desc": "이 무기로 무방비 상태의 생물을 공격하면 일반 공격력에 추가로 정밀 공격력 1을 줍니다. 무기가 +3 무기인 경우 정밀 공격력은 2로 증가합니다."
  },
  {
    "id": "backswing",
    "name_ko": "백스윙",
    "name_en": "backswing",
    "type": "mechanic",
    "desc": "이 무기로 빗맞힌 공격의 추진력을 다음 공격으로 이어갈 수 있습니다. 자신의 턴에 이 무기로 빗맞힌 후, 자신의 턴이 끝나기 전에 이 무기로 다음 공격할 때 +1의 상황 보너스를 받습니다."
  },
  {
    "id": "barbarian",
    "name_ko": "바바리안",
    "name_en": "barbarian",
    "type": "mechanic",
    "desc": "바바리안 클래스의 능력을 나타냅니다."
  },
  {
    "id": "bard",
    "name_ko": "음유시인",
    "name_en": "bard",
    "type": "mechanic",
    "desc": "음유시인 클래스의 능력을 나타냅니다."
  },
  {
    "id": "barding",
    "name_ko": "마갑",
    "name_en": "barding",
    "type": "mechanic",
    "desc": "동물용 특수 방어구인 마갑을 구매할 수 있습니다. 모든 동물은 가벼운 마갑 숙련도 등급을 가지고 있으며, 전투 훈련된 동물은 무거운 마갑 숙련도 등급을 가지고 있습니다. 마갑은 다음을 제외하고 갑옷과 동일한 규칙을 사용합니다. 마갑의 가격과 부피는 동물의 크기에 따라 달라집니다. 갑옷과 달리 마갑의 근력 항목은 점수가 아닌 수정치로 표시됩니다. 마갑은 마법 룬으로 각인할 수 없지만, 특별한 마법 마갑을 사용할 수 있습니다."
  },
  {
    "id": "beast",
    "name_ko": "야수",
    "name_en": "beast",
    "type": "mechanic",
    "desc": "동물과 비슷하지만 지능 수정자가 -3 이상인 생물은 보통 야수입니다. 동물과 달리 야수는 말하고 사고할 수 있습니다."
  },
  {
    "id": "beastkin",
    "name_ko": "비스트킨",
    "name_en": "beastkin",
    "type": "mechanic",
    "desc": "부분적으로 또는 완전히 동물 형태로 변신할 수 있는 휴머노이드."
  },
  {
    "id": "blight",
    "name_ko": "병해",
    "name_en": "blight",
    "type": "mechanic",
    "desc": "블라이트는 자연의 분노가 변질된 형태입니다."
  },
  {
    "id": "boggard",
    "name_ko": "보가드",
    "name_en": "boggard",
    "type": "mechanic",
    "desc": "보가드는 개구리 같은 인간형 생물입니다. 그들은 일반적으로 어둠 시야를 가지고 있습니다."
  },
  {
    "id": "bomb",
    "name_ko": "폭탄",
    "name_en": "bomb",
    "type": "mechanic",
    "desc": "연금술 폭탄은 휘발성 연금술 성분을 결합하여 생물이나 물체에 부딪히면 폭발합니다. 대부분의 연금술 폭탄은 피해를 입히지만, 일부 폭탄은 다른 효과를 생성하기도 합니다."
  },
  {
    "id": "bottled-breath",
    "name_ko": "보틀 브레스",
    "name_en": "bottled-breath",
    "type": "mechanic",
    "desc": "숨결의 병은 마법이 걸린 구름과 안개 병으로, 공중의 행성 주민들이 처음 개발했습니다. 숨결의 병 특성을 가진 아이템을 흡입하거나 다른 생물이 흡입하게 하여 활성화할 수 있습니다."
  },
  {
    "id": "brace",
    "name_ko": "보호대",
    "name_en": "brace",
    "type": "mechanic",
    "desc": "보호막 무기는 움직이는 적에게 피해를 주는 데 효과적입니다. 내 사정거리 내에서 움직이는 적을 공격할 준비가 되면, 다음 턴이 시작될 때까지 보호막 무기로 공격할 때마다 무기 공격력만큼 추가로 정밀 피해를 2만큼 줍니다."
  },
  {
    "id": "bravado",
    "name_ko": "브라바도",
    "name_en": "bravado",
    "type": "mechanic",
    "desc": "이 특성을 가진 행동은 관련 판정의 결과에 따라 파나쉬를 부여할 수 있습니다. 무모한 행동에 대한 판정에 성공하면 파나쉬를 얻게 되고, 판정에 실패(대실패는 제외)하면 파나쉬를 얻지만, 다음 턴이 끝날 때까지만 유지됩니다. 이 효과는 실패나 생물의 면역으로 인해 행동이 다른 효과를 발휘하지 못한 경우에도 적용될 수 있습니다."
  },
  {
    "id": "brutal",
    "name_ko": "잔인한",
    "name_en": "brutal",
    "type": "mechanic",
    "desc": "이 특성을 가진 원거리 공격은 공격 주사위에서 민첩 대신 해당 근력 수정치를 사용합니다."
  },
  {
    "id": "bugbear",
    "name_ko": "버그베어",
    "name_en": "bugbear",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 털이 많고 은밀한 고블린형 생물입니다. 버그베어는 일반적으로 어둠 시야를 가지고 있습니다."
  },
  {
    "id": "bulwark",
    "name_ko": "방어벽",
    "name_en": "bulwark",
    "type": "mechanic",
    "desc": "갑옷이 몸을 완전히 감싸기 때문에 일부 피해 효과에 대한 이점을 제공합니다. 불덩어리와 같은 피해 효과를 피하기 위해 반사 내성을 하면 민첩 수정치 대신 +3 수정치가 추가됩니다."
  },
  {
    "id": "caligni",
    "name_ko": "칼리니",
    "name_en": "caligni",
    "type": "mechanic",
    "desc": "이 지하에 사는 사람들은 어둠 시야를 가지고 있으며, 일부는 어둠을 창조하는 능력을 지니고 있습니다."
  },
  {
    "id": "calling",
    "name_ko": "호출",
    "name_en": "calling",
    "type": "mechanic",
    "desc": "소명 특성은 캐릭터가 신화적 힘을 처음 얻을 때 획득하는 기계적 옵션을 식별합니다. 각 소명 옵션은 신화적 포인트를 사용하고 회복하는 방법을 제공합니다."
  },
  {
    "id": "capacity",
    "name_ko": "용량",
    "name_en": "capacity",
    "type": "mechanic",
    "desc": "탄약 용량 특성이 있는 무기는 일반적으로 탄약 한 발을 담을 수 있는 여러 개의 탄창 또는 탄실이 있습니다. 탄창에는 항상 탄창 또는 탄실의 개수를 나타내는 숫자가 함께 표시됩니다. 수용량 무기를 발사한 후에는 손을 자유롭게 사용할 필요가 없는 인터랙트 액션으로 다음에 장전된 탄창 또는 탄실을 선택할 수 있습니다. 각 배럴 또는 챔버는 발사 후 별도의 인터랙트 액션으로 재장전할 수 있습니다."
  },
  {
    "id": "catalyst",
    "name_ko": "카탈리스트",
    "name_en": "catalyst",
    "type": "mechanic",
    "desc": "촉매제 특성이 있는 아이템은 특정 주문을 변경하거나 확대하는 소모성 재료 주문 구성 요소입니다. 촉매제를 활성화하는 것은 주문 시전의 일부입니다. 촉매제는 촉매제의 활성화 항목에 표시된 대로 주문을 시전하는 데 필요한 액션 횟수를 증가시킬 수 있습니다. 또한 주문에 재료 성분이 없는 경우 재료 성분을 얻거나 기존 성분에 촉매제를 추가합니다. 촉매제는 재료 구성 요소의 일부가 되므로 주문 시전 시 촉매제를 뽑을 수 있습니다."
  },
  {
    "id": "catfolk",
    "name_ko": "캣포크",
    "name_en": "catfolk",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 캣포크 혈통의 일원입니다."
  },
  {
    "id": "celestial",
    "name_ko": "천상체",
    "name_en": "celestial",
    "type": "mechanic",
    "desc": "성스러운 차원에서 비롯되거나 성스러운 차원과 강한 연결고리를 가진 생물들은 천상체라고 불립니다. 천상체는 외계 차원의 기본 환경 효과로부터 생존할 수 있습니다."
  },
  {
    "id": "censer",
    "name_ko": "향로",
    "name_en": "censer",
    "type": "mechanic",
    "desc": "향은 향을 태우는 장식용 용기로, 주로 금속이나 도자기로 만들어집니다. 향기 특성을 가진 아이템에 향을 채워 활성화하면 향에 불이 붙고 향로에서 연기 구름이 뿜어져 나오게 됩니다."
  },
  {
    "id": "centaur",
    "name_ko": "켄타우루스",
    "name_en": "centaur",
    "type": "mechanic",
    "desc": "센타우루스는 인간형 상체와 말의 하체를 가지고 있습니다."
  },
  {
    "id": "certain-kill",
    "name_ko": "Certain Kill",
    "name_en": "certain-kill",
    "type": "mechanic",
    "desc": "빛의 수호자는 유리 등대 내부에 있을 때만 특정 살상 기술을 사용할 수 있습니다. 이 기술들은 ‘특정 살상’ 특성을 지니며, 사용자가 기술을 발동할 때 등대의 구조에 명백한 왜곡을 일으킵니다. 그러나 각 기술은 빛의 수호자 중 한 명이 팀의 나머지 구성원으로부터 반차원 공간의 통제권을 일시적으로 넘겨받아야 하기 때문에, 한 라운드 동안 빛의 수호자 중 누구도 특정 살상 기술을 두 번 이상 사용할 수 없습니다."
  },
  {
    "id": "champion",
    "name_ko": "챔피언",
    "name_en": "champion",
    "type": "mechanic",
    "desc": "챔피언 클래스의 능력을 나타냅니다."
  },
  {
    "id": "charau-ka",
    "name_ko": "차라우카",
    "name_en": "charau-ka",
    "type": "mechanic",
    "desc": "만드릴과 유사한 인간형 생물로, 잔인한 전사들입니다. 많은 차라우-카가 우사로에 살고 있습니다."
  },
  {
    "id": "climbing",
    "name_ko": "클라이밍",
    "name_en": "climbing",
    "type": "mechanic",
    "desc": "무기를 휘두르는 손은 오르기에 사용할 수 있습니다."
  },
  {
    "id": "clockwork",
    "name_ko": "시계장치",
    "name_en": "clockwork",
    "type": "mechanic",
    "desc": "시계장치는 특정 기능을 수행하도록 프로그래밍할 수 있는 복잡하고 복잡한 구조물입니다."
  },
  {
    "id": "coagulant",
    "name_ko": "응고제",
    "name_en": "coagulant",
    "type": "mechanic",
    "desc": "응고 특성을 가진 연금술 아이템은 짧은 시간에 여러 개를 사용하면 효과가 떨어집니다. 응고 특성을 가진 아이템으로 HP를 회복한 생물은 10분 동안 응고 특성을 가진 아이템으로 HP를 회복할 수 없습니다(단, 해당 아이템의 다른 효과는 정상적으로 적용됩니다)."
  },
  {
    "id": "cobbled",
    "name_ko": "코볼드",
    "name_en": "cobbled",
    "type": "mechanic",
    "desc": "이 총기는 서로 엉켜 있어서 불발될 가능성이 높습니다. 아무리 잘 유지하더라도 공격 굴림이 실패하면 공격이 실패해 평탄 DC 5를 굴려야 합니다. 이 판정에 실패하면 무기가 제대로 발사되지 않습니다."
  },
  {
    "id": "coda",
    "name_ko": "코다",
    "name_en": "coda",
    "type": "mechanic",
    "desc": "코다 특성이 있는 악기는 대부분 지팡이처럼 작동하며 오선지 특성을 가지고 있습니다. 두 가지 차이점이 있습니다: 코다 악기는 악기 형태이며 음유시인만 준비할 수 있습니다. 물리적인 지팡이가 아니기 때문에 코다 악기로 공격할 수 없고 무기 룬을 새길 수도 없습니다. 코다 악기를 준비하는 과정에는 악기에 담긴 주문과 관련된 노래의 상당 부분을 연주하는 것이 포함됩니다(오래된 표준이든 직접 창작한 노래이든). 이렇게 하면 악기 내에 마법의 울림이 남게 되며, 나중에 코다를 연주하여 곡을 완성할 수 있습니다."
  },
  {
    "id": "cold",
    "name_ko": "냉기",
    "name_en": "cold",
    "type": "mechanic",
    "desc": "이 특성을 가진 효과는 냉기 피해를 줍니다. 이 특성을 가진 생물은 마법의 냉기와 관련이 있습니다."
  },
  {
    "id": "combination",
    "name_ko": "조합",
    "name_en": "combination",
    "type": "mechanic",
    "desc": "근접 무기와 총기의 기능을 독특하거나 특이한 방식으로 결합한 무기의 특성입니다. 복합 무기는 총기 형태 또는 사용법과 근접 무기 형태 또는 사용법을 모두 가지고 있습니다."
  },
  {
    "id": "comfort",
    "name_ko": "편안함",
    "name_en": "comfort",
    "type": "mechanic",
    "desc": "갑옷이 너무 편안해서 착용한 채로 정상적으로 휴식을 취할 수 있습니다."
  },
  {
    "id": "common",
    "name_ko": "흔한",
    "name_en": "common",
    "type": "mechanic",
    "desc": "다른 희귀도 특성(드문, 희귀, 고유)이 표시되지 않은 모든 것은 자동으로 흔한 특성을 갖습니다. 이 희귀도는 해당 능력, 아이템, 주문의 전제 조건을 충족하는 모든 플레이어가 사용할 수 있음을 나타냅니다. 이 희귀도를 가진 생물은 일반적으로 알려져 있으며 적절한 소환 주문으로 소환할 수 있습니다."
  },
  {
    "id": "companion",
    "name_ko": "동반자",
    "name_en": "companion",
    "type": "mechanic",
    "desc": "이 특성이 있는 아이템은 동물 동반자 또는 이와 유사한 생물이 착용할 수 있습니다. 동반자는 최대 두 아이템까지 투자할 수 있습니다."
  },
  {
    "id": "complex",
    "name_ko": "복잡한",
    "name_en": "complex",
    "type": "mechanic",
    "desc": "이 특성을 가진 위험은 인카운터에서 교대로 등장합니다."
  },
  {
    "id": "composite",
    "name_ko": "합성",
    "name_en": "composite",
    "type": "mechanic",
    "desc": "복합 충동은 여러 요소가 결합된 것입니다. 키네틱 요소에 임펄스의 특성에 나열된 모든 요소가 포함되어 있어야만 복합 특성을 가진 임펄스를 획득할 수 있습니다."
  },
  {
    "id": "composition",
    "name_ko": "구성",
    "name_en": "composition",
    "type": "mechanic",
    "desc": "작곡 캔트립이나 포커스 주문을 시전할 때는 공연 유형을 사용합니다. 주문에 청각적 연기가 필요한 경우, 시를 낭송하거나 노래를 부르거나 극적인 독백을 할 수 있습니다. 주문에 시각적 연기가 필요한 경우, 춤을 추거나 무언극을 할 수 있습니다. 구성 주문은 한 턴에 하나만 시전할 수 있으며, 한 번에 하나만 활성화할 수 있습니다. 새로운 구성 주문을 발동하면 이전 구성 주문의 진행 중인 효과는 즉시 종료됩니다."
  },
  {
    "id": "concealable",
    "name_ko": "은폐된",
    "name_en": "concealable",
    "type": "mechanic",
    "desc": "이 무기는 눈에 띄지 않거나 쉽게 은폐될 수 있도록 설계되었습니다. 이 특성을 가진 무기를 숨기거나 은폐할 때 은신 판정과 DC에 +2의 상황 보너스를 받습니다."
  },
  {
    "id": "concussive",
    "name_ko": "뇌진탕",
    "name_en": "concussive",
    "type": "mechanic",
    "desc": "이 무기는 관통하며 박살냅니다. 이 무기로 인한 피해에 대한 생물의 저항 또는 면역을 결정할 때, 대상의 관통 또는 둔기 피해에 대한 저항 또는 면역 중 약한 것을 사용합니다. 예를 들어, 해당 생물이 관통에 면역이고 둔기 피해에 대한 저항이나 면역이 없는 경우, 뇌진탕 무기로 받는 피해는 전부를 받습니다. 모든 물리 피해 또는 모든 피해에 대한 저항 또는 면역은 정상적으로 적용됩니다."
  },
  {
    "id": "conrasu",
    "name_ko": "콘라수",
    "name_en": "conrasu",
    "type": "mechanic",
    "desc": "의식이 부여된 우주의 힘으로 구성되고 독특한 외골격 내에 있는 사람들입니다."
  },
  {
    "id": "construct",
    "name_ko": "구조물",
    "name_en": "construct",
    "type": "mechanic",
    "desc": "구조물은 강령술 이외의 힘으로 강화된 인공 생명체입니다. 구조물은 종종 의식이 없으며, 출혈 피해, 사망 효과, 질병, 치유, 강령술, 치명적이지 않은 공격, 독, 운명, 탈진, 피로, 마비, 병, 의식 불명 상태에 면역이며, 몸을 만드는 데 사용된 재료에 따라 경도를 가질 수 있습니다. 구조물은 생명체가 아니며 언데드도 아닙니다. HP가 0으로 감소하면 구조물 생물이 파괴됩니다."
  },
  {
    "id": "consumable",
    "name_ko": "소모품",
    "name_en": "consumable",
    "type": "mechanic",
    "desc": "이 특성이 있는 아이템은 한 번만 사용할 수 있습니다. 별도의 설명이 없는 한, 활성화 후 소멸됩니다. 소모품에는 연금술 아이템과 두루마리, 부적과 같은 마법 소모품이 포함됩니다. 캐릭터가 소모품을 생성할 때는 4개씩 일괄적으로 만들 수 있습니다."
  },
  {
    "id": "contingency",
    "name_ko": "컨틴전시",
    "name_en": "contingency",
    "type": "mechanic",
    "desc": "이 특성이 있는 주문은 주문 효과가 지속되는 동안 액션을 부여하며, 일반적으로 특별한 트리거가 있는 리액션입니다. 일반적으로 24시간과 같이 지속 시간이 길어집니다. 우발성 특성이 있는 주문, 즉 우발성 주문은 한 번에 하나만 활성화할 수 있습니다. 우발성 특성 또는 우발성 주문이 있는 다른 주문을 발동하면 새로 발동한 주문이 이전 주문을 대체합니다."
  },
  {
    "id": "contract",
    "name_ko": "계약",
    "name_en": "contract",
    "type": "mechanic",
    "desc": "계약은 여러 당사자 간의 계약을 마법으로 성립시키고 일반적으로 마법 혜택을 부여하는 아이템의 일종입니다."
  },
  {
    "id": "critical-fusion",
    "name_ko": "크리티컬 퓨전",
    "name_en": "critical-fusion",
    "type": "mechanic",
    "desc": "크리티컬 융합은 조합 무기의 새로운 특성으로, 총기가 장전된 상태에서 조합 무기의 근접 버전을 사용하여 근접 공격을 할 때 두 가지 추가 치명타 전문화 효과 옵션을 부여합니다. 이 중 하나를 선택하면 근접 무기의 일반 치명타 전문화 효과를 대체합니다. 첫째, 근접 무기 그룹의 크리티컬 전문화 효과 대신 총기류의 크리티컬 전문화 효과를 사용하여 총기를 발사하여 큰 소리와 뇌진탕을 일으킬 수 있습니다. 둘째, 총기를 발사하여 크리티컬의 추진력을 높이거나 근접 공격 시 적을 쏴서 무기 피해량이 죽어감당하는 만큼 추가 피해를 입히는 방법을 선택할 수 있습니다. 이 두 가지 옵션은 모두 총기를 방전시키므로 일반적으로 재장전 후 다시 발사해야 합니다."
  },
  {
    "id": "cursebound",
    "name_ko": "저주에 묶인",
    "name_en": "cursebound",
    "type": "mechanic",
    "desc": "이 특성을 가진 주문은 시전 시 오라클 저주의 심각도가 증가합니다. 일반적으로 계시 주문에만 이 특성이 있습니다. 오라클 저주가 없으면 저주에 걸린 주문을 시전할 수 없습니다."
  },
  {
    "id": "cursed",
    "name_ko": "저주받은",
    "name_en": "cursed",
    "type": "mechanic",
    "desc": "이 특성을 가진 아이템은 저주에 걸려 소유자에게 문제를 일으킵니다. 아이템이 식별될 때는 저주가 감지되지 않지만, 대성공을 거두면 저주의 존재와 정확한 성격이 모두 드러납니다. 저주받은 아이템은 한 번 트리거되거나 처음 인베스팅된 후에는 버릴 수 없습니다. 아이템은 저주가 제거된 경우에만 제거할 수 있습니다."
  },
  {
    "id": "daemon",
    "name_ko": "데이몬",
    "name_en": "daemon",
    "type": "mechanic",
    "desc": "아바돈의 황량한 평원에서 탄생한 악마의 종족으로, 대부분의 악마는 구원받을 수 없는 악의 화신입니다. 그들은 일반적으로 어둠 시야를 가지고 있으며 성스러운 것에 약점을 보입니다.."
  },
  {
    "id": "darvakka",
    "name_ko": "다르바카",
    "name_en": "darvakka",
    "type": "mechanic",
    "desc": "네더월드와 공허에 의해 뒤틀린 엔트로피 언데드 생물입니다."
  },
  {
    "id": "deadly",
    "name_ko": "위험한",
    "name_en": "deadly",
    "type": "mechanic",
    "desc": "치명타가 적중하면 무기는 나열된 크기의 공격 주사위을 추가합니다. 무기의 공격력을 두 배로 늘린 후 주사위를 굴립니다. 무기에 타격 룬이 있으면 주사위를 두 개, 향상된 타격 룬이 있으면 주사위를 세 개로 늘립니다. 예를 들어, 향상된 타격 룬이 붙은 레이피어는 치명타 시 2d8의 추가 관통 피해를 줍니다. 무기의 일반 피해 주사위의 크기를 변경하는 능력은 치명타 주사위의 크기를 변경하지 않습니다."
  },
  {
    "id": "demon",
    "name_ko": "데몬",
    "name_en": "demon",
    "type": "mechanic",
    "desc": "악마의 한 종족으로, 외계 균열에서 비롯되거나 그 기원을 추적할 수 있습니다. 대부분은 구원받을 수 없는 불경한 존재로, 어둠 시야를 가지고 있으며 냉철과 성스러운 것에 약합니다."
  },
  {
    "id": "dero",
    "name_ko": "데로",
    "name_en": "dero",
    "type": "mechanic",
    "desc": "이 인간형 생물 종족은 어둠의 땅에 버려진 후 어둠과 혼란에 빠진 요정 생물의 후예입니다. 그들은 혼란에 면역이지만 햇빛에 취약합니다."
  },
  {
    "id": "deviant",
    "name_ko": "비정상",
    "name_en": "deviant",
    "type": "mechanic",
    "desc": "이 특성은 이상한 초자연적 또는 초자연적 능력을 설명합니다."
  },
  {
    "id": "devil",
    "name_ko": "데빌",
    "name_en": "devil",
    "type": "mechanic",
    "desc": "지옥에서 온 악마의 가족으로, 대부분의 악마는 구제 불능의 부정한 존재입니다. 일반적으로 더 뛰어난 암시력, 불에 대한 면역력, 텔레파시 능력, 그리고 신성한 것에 대한 약점을 가지고 있습니다."
  },
  {
    "id": "dhampir",
    "name_ko": "담피르",
    "name_en": "dhampir",
    "type": "mechanic",
    "desc": "이 특성을 가진 생명체는 뱀파이어 혈통의 일원입니다. 이 휴머노이드는 뱀파이어와 다른 혈통의 필멸자 자손입니다."
  },
  {
    "id": "dinosaur",
    "name_ko": "공룡",
    "name_en": "dinosaur",
    "type": "mechanic",
    "desc": "이 파충류들은 선사 시대부터 살아남아 왔습니다."
  },
  {
    "id": "disarm",
    "name_ko": "무장 해제",
    "name_en": "disarm",
    "type": "mechanic",
    "desc": "이 무기는 한 손이 없어도 운동 기술로 무장 해제할 수 있습니다. 이 경우 무기의 사거리(자신의 사거리와 다른 경우)를 사용하며, 무기의 아이템 보너스가 있는 경우 공격 굴림에 대한 아이템 보너스를 운동 판정에 아이템 보너스로 추가합니다. 무기를 사용하여 무장 해제 판정에서 대실패하면, 무기를 떨어뜨려 대실패 대신 실패의 효과를 받을 수 있습니다. 대성공을 거둔 경우에도 아이템을 획득하려면 한 손이 자유로워야 합니다."
  },
  {
    "id": "div",
    "name_ko": "디브",
    "name_en": "div",
    "type": "mechanic",
    "desc": "디브는 아바돈의 황폐한 땅에서 사악한 지니의 영혼에서 태어난 악마의 일족입니다. 대부분의 디브는 중립 악입니다. 이들은 일반적으로 암흑 시야가 뛰어나고, 냉철에 약하고, 피해가 큽니다."
  },
  {
    "id": "double-barrel",
    "name_ko": "더블 배럴",
    "name_en": "double-barrel",
    "type": "mechanic",
    "desc": "이 무기에는 각각 따로 장전되는 두 개의 탄창이 있습니다. 더블 배럴 무기의 두 포신을 한 번에 발사하면 무기 피해량이 한 단계 증가합니다. 무기에 치명타 특성이 있는 경우 치명타 사망률이 한 단계 증가합니다."
  },
  {
    "id": "downtime",
    "name_ko": "다운타임",
    "name_en": "downtime",
    "type": "mechanic",
    "desc": "이 특성이 있는 활동은 하루 이상 소요되며 다운타임 중에만 사용할 수 있습니다."
  },
  {
    "id": "dragon",
    "name_ko": "용",
    "name_en": "dragon",
    "type": "mechanic",
    "desc": "용은 파충류형 생물로, 대부분 날개가 있거나 비행 능력을 갖추고 있습니다. 대부분의 용은 마법 에너지를 내뿜을 수 있으며, 수면과 마비에 면역입니다."
  },
  {
    "id": "dragonblood",
    "name_ko": "용혈",
    "name_en": "dragonblood",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 드래곤블러드 다목적 유산을 지니고 있습니다. 이 생물들은 드래곤 혈통에서 태어나며 종종 드래곤의 외형을 지니고 있습니다."
  },
  {
    "id": "dream",
    "name_ko": "꿈",
    "name_en": "dream",
    "type": "mechanic",
    "desc": "꿈의 차원에 원주민으로 존재하는 생물들은 다양한 능력을 지닐 수 있지만, 렌의 악몽 차원과 관련된 능력은 거의 항상 불경스럽고 그 차원의 얼어붙는 온도에 면역입니다."
  },
  {
    "id": "drug",
    "name_ko": "약물",
    "name_en": "drug",
    "type": "mechanic",
    "desc": "이 특성을 가진 아이템은 단기적인 이득과 함께 해로운 부작용과 장기적인 결과를 가져오는 독인 약물입니다. 생물이 특정 약물을 사용할 때마다 해당 약물에 중독되지 않도록 내성 굴림을 시도해야 합니다."
  },
  {
    "id": "duskwalker",
    "name_ko": "더스크워커",
    "name_en": "duskwalker",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 더스크워커의 다재다능한 유산을 가지고 있습니다. 더스크워커는 사이코폼프의 초자연적인 에너지가 주입된 차원의 자손입니다. 이 특성을 가진 능력은 더스크워커만 사용하거나 선택할 수 있습니다."
  },
  {
    "id": "eidolon",
    "name_ko": "에이돌론",
    "name_en": "eidolon",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 소환사의 아이돌론입니다. 이 특성이 있는 아이템은 아이돌론이 착용할 수 있습니다. 아이돌론은 최대 두 개까지 아이템을 투자할 수 있습니다."
  },
  {
    "id": "electricity",
    "name_ko": "전기",
    "name_en": "electricity",
    "type": "mechanic",
    "desc": "이 특성을 가진 효과는 전기 피해를 입힙니다. 이 특성을 가진 생물은 전기와 마법적으로 연결되어 있습니다."
  },
  {
    "id": "elemental",
    "name_ko": "정령",
    "name_en": "elemental",
    "type": "mechanic",
    "desc": "원소와 직접적으로 연결되어 있으며 원소 평면에 원주민으로 존재하는 생물들. 원소체는 숨을 쉴 필요가 없습니다."
  },
  {
    "id": "elixir",
    "name_ko": "엘릭서",
    "name_en": "elixir",
    "type": "mechanic",
    "desc": "엘릭서는 마시는 방식으로 사용하는 연금술 액체입니다."
  },
  {
    "id": "esoterica",
    "name_ko": "에소테리카",
    "name_en": "esoterica",
    "type": "mechanic",
    "desc": "에소테리카 특성은 다양한 부적, 초자연 장신구 및 기타 소지한 물건과 관련된 많은 투마술사 재주와 클래스 특징에 존재합니다. 에소테리카 특성을 가진 능력을 사용하려면 에소테리카를 소지하고 있어야 합니다. 일반적으로는 항상 비전서를 소지하고 있다고 가정하지만, 드물게는 비전서를 소지하지 않거나 장비를 빼앗길 수도 있습니다."
  },
  {
    "id": "ethereal",
    "name_ko": "에테리얼",
    "name_en": "ethereal",
    "type": "mechanic",
    "desc": "에테리얼 생물은 에테리얼 평면의 원주민입니다. 그들은 에테리얼 평면의 기본 환경 효과를 견딜 수 있습니다."
  },
  {
    "id": "evolution",
    "name_ko": "진화",
    "name_en": "evolution",
    "type": "mechanic",
    "desc": "이 특성을 가진 재주는 보통 플레이어 대신 에이돌론에게 추가적인 물리 능력을 부여하는 방식으로 영향을 미칩니다."
  },
  {
    "id": "exemplar",
    "name_ko": "이그젬플러",
    "name_en": "exemplar",
    "type": "mechanic",
    "desc": "이는 예시 클래스의 능력을 나타냅니다."
  },
  {
    "id": "expandable",
    "name_ko": "확장 가능",
    "name_en": "expandable",
    "type": "mechanic",
    "desc": "확장 가능한 특성을 가진 아이템은 활성화하면 특정 크기로 증가합니다. 별도의 설명이 없는 한, 이 공간은 자신과 지면에 인접해야 하며, 아이템이 확장할 수 있는 충분한 공간이 있어야 하며 그렇지 않으면 활성화 효과가 적용되지 않습니다. 효과가 종료되면, 확장된 아이템은 소모품인 경우 분해되고 소모품이 아닌 경우 원래 크기로 다시 축소됩니다."
  },
  {
    "id": "experiment",
    "name_ko": "실험적",
    "name_en": "experiment",
    "type": "mechanic",
    "desc": "실험용 크립티드가 알케미, 공학, 마법, 또는 의식을 통해 일부 구성 요소 요소를 포함하도록 의도적으로 변형되었습니다. 강력한 힘을 지니고 있지만, 이 과정은 불안정하고 불완전합니다."
  },
  {
    "id": "exploration",
    "name_ko": "탐색",
    "name_en": "exploration",
    "type": "mechanic",
    "desc": "이 특성을 가진 활동은 사용하는 데 턴이 한 번 이상 걸리며, 일반적으로 탐험 모드에서만 사용할 수 있습니다."
  },
  {
    "id": "extradimensional",
    "name_ko": "초차원적",
    "name_en": "extradimensional",
    "type": "mechanic",
    "desc": "이 효과 또는 아이템은 초차원 공간을 생성합니다. 다른 초차원 공간 안에 배치된 초차원 효과는 제거할 때까지 작동이 중지됩니다."
  },
  {
    "id": "fatal",
    "name_ko": "치명적",
    "name_en": "fatal",
    "type": "mechanic",
    "desc": "치명적인 특성에는 주사위 크기가 포함됩니다. 치명타 발생 시, 무기의 피해 주사위는 일반 주사위 크기 대신 해당 주사위 크기로 증가하고, 무기는 나열된 크기의 피해 주사위 하나를 추가합니다."
  },
  {
    "id": "fatal-aim",
    "name_ko": "치명적 조준",
    "name_en": "fatal-aim",
    "type": "mechanic",
    "desc": "무기가 팔 아래에서 미끄러지지 않도록 다른 손에 무기나 방패, 그 밖에 움직이고 위치를 잡아야 하는 물건을 들고 있지 않다면 한 손으로도 무기를 발사할 수 있습니다. 하지만 양손을 모두 사용하면 무기가 치명적인 공격을 가할 수 있습니다. 양손으로 무기를 휘두르면 해당 무기는 나열된 피해량만큼 치명적인 특성을 얻습니다. 무기를 겨드랑이 아래에서 안정적으로 잡고 발사하는 것은 한 손에서 무기를 놓는 것보다 훨씬 더 복잡하므로, 두 그립 사이를 전환하려면 놓는 동작이 아닌 상호작용 액션을 사용하거나 재장전의 일부로 전환해야 합니다."
  },
  {
    "id": "fetchling",
    "name_ko": "페츨링",
    "name_en": "fetchling",
    "type": "mechanic",
    "desc": "이 특성을 가진 생명체는 페츨링 조상의 일원입니다. 페츨링은 한때 인간이었지만, 네더월드에서 여러 세대에 걸쳐 살면서 변모했습니다."
  },
  {
    "id": "fey",
    "name_ko": "페이",
    "name_en": "fey",
    "type": "mechanic",
    "desc": "제1세계의 생명체는 페이라고 불립니다."
  },
  {
    "id": "fiend",
    "name_ko": "악마",
    "name_en": "fiend",
    "type": "mechanic",
    "desc": "부정한 차원에서 유래하거나 그곳과 밀접한 관련이 있는 생물들을 피엔드라고 합니다. 피엔드는 외부 영역의 기본 환경 효과에서 살아남을 수 있습니다."
  },
  {
    "id": "figurehead",
    "name_ko": "피겨헤드",
    "name_en": "figurehead",
    "type": "mechanic",
    "desc": "많은 선박이 장식 조각으로 장식되어 있지만, 대담한 선원들은 때때로 선박에 마법의 선수상을 장식하기도 합니다."
  },
  {
    "id": "finisher",
    "name_ko": "피니셔",
    "name_en": "finisher",
    "type": "mechanic",
    "desc": "피니셔는 화려한 마무리 기술입니다. 피니셔는 파나쉬가 있을 때만 사용할 수 있으며, 피니셔를 사용하면 즉시 파나쉬를 잃습니다. 피니셔를 사용한 후에는 남은 턴 동안 해당 공격 특성을 가진 액션을 사용할 수 없습니다. 일부 피니셔 액션은 실패 시에도 효과를 부여합니다. 피니셔가 성공하면 대신 실패 효과를 적용하도록 선택할 수 있습니다."
  },
  {
    "id": "finite",
    "name_ko": "유한",
    "name_en": "finite",
    "type": "mechanic",
    "desc": "이 특성을 가진 차원은 제한된 공간으로 구성됩니다."
  },
  {
    "id": "fire",
    "name_ko": "화염",
    "name_en": "fire",
    "type": "mechanic",
    "desc": "화염 특성을 가진 효과는 화염 피해를 주거나 화염을 소환하거나 조작합니다. 불을 조종하는 효과는 불이 없는 지역에서는 효과가 없습니다. 이 특성을 가진 생물은 주로 불로 이루어져 있거나 해당 원소와 마법적으로 연결되어 있습니다."
  },
  {
    "id": "fleshwarp",
    "name_ko": "플레쉬워프",
    "name_en": "fleshwarp",
    "type": "mechanic",
    "desc": "외부의 힘에 의해 완전히 변형된 휴머노이드는 이제 고유 조상이 되었습니다."
  },
  {
    "id": "flexible",
    "name_ko": "유연성",
    "name_en": "flexible",
    "type": "mechanic",
    "desc": "갑옷은 대부분의 액션에 방해가 되지 않을 만큼 유연합니다. 곡예나 운동 판정에 페널티가 적용되지 않습니다."
  },
  {
    "id": "flourish",
    "name_ko": "전개",
    "name_en": "flourish",
    "type": "mechanic",
    "desc": "번성 액션은 너무 많은 힘을 소모해야 연속으로 수행할 수 있는 액션입니다. 번성 특성이 있는 액션은 한 턴에 하나만 사용할 수 있습니다."
  },
  {
    "id": "focus",
    "name_ko": "포커스",
    "name_en": "focus",
    "type": "mechanic",
    "desc": "포커스 주문은 특정 학문 분야, 신 또는 다른 특정 출처에서 직접 습득할 수 있는 특별한 유형의 주문입니다. 포커스 주문은 주문 목록에서 선택하는 것이 아니라 특별한 클래스 특징이나 재주를 통해서만 배울 수 있습니다. 또한, 포커스 주문은 특별한 포커스 포인트 풀을 사용하여 주문 슬롯에서 포커스 주문을 준비하거나 주문 슬롯을 사용하여 포커스 주문을 시전할 수 없으며, 마찬가지로 포커스 주문이 아닌 다른 주문을 시전하는 데 포커스 포인트를 사용할 수 없습니다."
  },
  {
    "id": "focused",
    "name_ko": "추가 포커스",
    "name_en": "focused",
    "type": "mechanic",
    "desc": "이 특성이 있는 아이템은 추가 포커스 포인트를 획득할 수 있습니다. 이 포커스 포인트는 집중력 풀과는 별개이며, 집중력 풀의 한도에 포함되지 않습니다. 이 혜택은 집중력 풀이 있는 경우에만 얻을 수 있으며, 포인트 사용 방법에는 제한이 있을 수 있습니다. 집중 아이템에서 하루에 1점 이상의 포커스 포인트를 획득할 수 없습니다."
  },
  {
    "id": "foldaway",
    "name_ko": "접이식",
    "name_en": "foldaway",
    "type": "mechanic",
    "desc": "이 방패는 건틀릿에 부착된 작은 형태로 접을 수 있어 안정적이고 이동이 편리합니다. 인터랙트 액션을 사용하여 방패를 펼치거나 보관할 수 있습니다. 방패가 펼쳐져 있는 동안에는 한 손이 자유롭거나 무기가 아닌 가벼운 물체를 손에 들고 있으면 방패를 들어 올릴 수 있습니다. 방패가 펼쳐져 있는 동안에는 손을 사용할 수 없습니다. 그 손으로 아이템을 잡을 수는 있지만, 그 손으로 무기를 휘두르거나 두 손이 필요한 조작을 하거나 건틀릿으로 공격할 수는 없습니다. 접이식 보호막은 안정성을 위해 건틀릿에 부착해야 합니다. 이 방패는 10분의 작업 시간과 DC 10의 제작 판정 성공으로 아이템에 부착할 수 있으며, 필요한 경우 이전 건틀렛에서 방패를 제거하는 데 필요한 시간도 여기에 포함됩니다. 건틀렛이 파괴된 경우, 접이식 방패는 보통 회수할 수 있습니다. 방패는 접을 수 있기 때문에 부착 무기를 장착할 수 없습니다."
  },
  {
    "id": "force",
    "name_ko": "역장",
    "name_en": "force",
    "type": "mechanic",
    "desc": "이 특성을 가진 효과는 역장 피해를 입히거나 순수한 마법의 힘으로 만들어진 물체를 생성합니다."
  },
  {
    "id": "forceful",
    "name_ko": "기세",
    "name_en": "forceful",
    "type": "mechanic",
    "desc": "이 무기는 기세를 올릴수록 더 위험해집니다. 자신의 차례에 이 무기로 두 번 이상 공격하면 두 번째 공격은 무기 피해 주사위 수만큼 공격력에 대한 상황 보너스를 얻고, 이후 공격할 때마다 무기 피해 주사위 수의 두 배만큼 공격력에 대한 상황 보너스를 얻습니다."
  },
  {
    "id": "free-hand",
    "name_ko": "프리 핸드",
    "name_en": "free-hand",
    "type": "mechanic",
    "desc": "이 무기는 보통 갑옷에 내장되어 있기 때문에 손을 차지하지 않습니다. 프리 핸드 무기는 무장을 해제할 수 없습니다. 프리 핸드 무기로 가린 손으로 다른 아이템을 휘두르거나 액션을 조작하는 등의 행동을 할 수 있습니다. 그 손에 다른 무기를 들고 있거나 그 손을 다른 용도로 사용 중이라면 자유 무기로는 공격할 수 없습니다. 아무것도 들고 있지 않고 손을 다른 용도로 사용하지 않을 때는 한 손이 자유로워야 하는 능력과 무기를 들고 있어야 하는 능력을 모두 사용할 수 있습니다. 각 손에는 프리 핸드 무기를 하나씩만 사용할 수 있습니다."
  },
  {
    "id": "fulu",
    "name_ko": "풀루",
    "name_en": "fulu",
    "type": "mechanic",
    "desc": "풀루스는 갑옷, 방패, 무기, 생물, 구조물 등에 부착할 수 있는 작은 종이 부적입니다. 일부 풀루스는 여러 개의 참으로 구성되어 있으며, 모든 참을 부착해야만 효과가 적용됩니다. 일반 부적은 부착 즉시 효과가 적용되지만, 풀루 부적은 한 번만 활성화하면 효과가 적용됩니다. 부적이 활성화되면 지정된 시간 동안 지속된 후 소멸됩니다. 별도의 언급이 없는 한, 풀루는 생성된 후 1년이 지나면 만료되어 일반 종이로 돌아갑니다. 모든 풀루스는 풀루스와 소모품 특성을 가지고 있습니다. 또한 풀루는 제작자의 마법 전통에 따라 비전, 신성, 오컬트, 원시 등 전통 특성이 있으며, 이는 제작자의 마법 전통에 따라 결정됩니다. 예를 들어 사제가 만든 풀루는 신성한 특성을 가지며, 운명을 다루는 마녀는 오컬트 특성을 가진 풀루를 만들 수 있습니다. 일부 풀루는 부적과 유사하게 작동하는 경우(예: 갑옷, 방패, 무기에 부착하는 등) 부적 특성을 갖기도 합니다. 각 풀루의 능력치 블록에는 부착할 수 있는 아이템 또는 생물의 유형이 표시되어 있습니다. 부적을 부착하거나 제거하려면 부적을 부착하기 활동을 사용해야 하며, 부적이 부적이기도 한 경우에는 부적을 부착하기 액션을 사용해야 합니다."
  },
  {
    "id": "fungus",
    "name_ko": "균류",
    "name_en": "fungus",
    "type": "mechanic",
    "desc": "균류 생물은 균류 특성을 가지고 있습니다. 이들은 일반적인 균류와 구분됩니다."
  },
  {
    "id": "gadget",
    "name_ko": "가젯",
    "name_en": "gadget",
    "type": "mechanic",
    "desc": "가젯은 혁신적인 용도로 사용되는 소모성 기술 발명품입니다."
  },
  {
    "id": "ganzi",
    "name_ko": "간지",
    "name_en": "ganzi",
    "type": "mechanic",
    "desc": "소용돌이의 혼돈의 존재인 프로테안으로부터 후손이 된 차원적 자손입니다."
  },
  {
    "id": "genie",
    "name_ko": "지니",
    "name_en": "genie",
    "type": "mechanic",
    "desc": "다양한 종류의 지니들은 원소계에서 두드러진 위치를 차지하고 있습니다. 이들은 강력한 마법 능력을 가지고 있습니다."
  },
  {
    "id": "geniekin",
    "name_ko": "지니킨",
    "name_en": "geniekin",
    "type": "mechanic",
    "desc": "원소계에서 온 존재의 후손인 차원 자손을 포괄적으로 일컫는 용어입니다."
  },
  {
    "id": "ghoran",
    "name_ko": "고란",
    "name_en": "ghoran",
    "type": "mechanic",
    "desc": "씨앗에서 스스로 젊음을 되찾아 긴 수명을 유지하는 지능적인 식물 조상."
  },
  {
    "id": "ghost",
    "name_ko": "고스트",
    "name_en": "ghost",
    "type": "mechanic",
    "desc": "무형의 언데드로 세상을 떠도는 잃어버린 영혼을 유령이라고 합니다."
  },
  {
    "id": "ghoul",
    "name_ko": "구울",
    "name_en": "ghoul",
    "type": "mechanic",
    "desc": "구울은 육체를 먹어 치우는 사악한 언데드 생물입니다."
  },
  {
    "id": "ghul",
    "name_ko": "굴",
    "name_en": "ghul",
    "type": "mechanic",
    "desc": "원래 지니에서 태어난 탐욕스럽고 탐식적인 언데드입니다."
  },
  {
    "id": "giant",
    "name_ko": "자이언트",
    "name_en": "giant",
    "type": "mechanic",
    "desc": "거인들은 거대한 인간형 생물체입니다.."
  },
  {
    "id": "girtablilu",
    "name_ko": "기르타브릴루",
    "name_en": "girtablilu",
    "type": "mechanic",
    "desc": "기르타빌루스는 상반신은 인간형이고 하반신은 거대한 전갈의 모습을 하고 있다."
  },
  {
    "id": "gnoll",
    "name_ko": "콜로",
    "name_en": "gnoll",
    "type": "mechanic",
    "desc": "놀은 하이에나를 닮은 휴머노이드입니다."
  },
  {
    "id": "goloma",
    "name_ko": "골로마",
    "name_en": "goloma",
    "type": "mechanic",
    "desc": "무수히 많은 눈을 가진 고립된 휴머노이드."
  },
  {
    "id": "graft",
    "name_ko": "그래프트",
    "name_en": "graft",
    "type": "mechanic",
    "desc": "이식 특성을 가진 아이템은 호스트에 이식된 살아있는 조직 샘플입니다. 이는 대상의 신체에 영구적으로 통합되며, 해당 생물이 하루에 투자할 수 있는 아이템 수를 1씩 감소시킵니다. 각 이식물은 이 제한을 표시하기 위해 ‘투자된’ 특성을 갖습니다—이식물은 호스트 생물이 선택의 여지 없이 투자해야 하는 투자된 아이템과 유사합니다. 생물체가 투자할 수 있는 아이템의 수가 이미 0으로 감소한 상태에서 새로운 이식물을 얻게 되면, 숙주 신체는 이식물을 거부합니다. 이식물이 완전히 이식된 후에는 별도로 피해를 입을 수 없습니다. 이식물이 숙주 신체에서 분리된 경우, 재생 마법과 같이 일반적으로 사지나 장기를 다시 부착할 수 있는 효과로 다시 부착할 수 있습니다. 이식자는 이식을 제거하는 데 필요한 동일한 과정을 통해 이식을 제거할 수 있지만, 이는 초기 이식으로 대체된 장기를 반드시 복원하지는 않습니다. 이식은 일반적으로 호스트 외부에 생존하기 위해 특수한 보관 조건(예: 연금술 탱크)이 필요합니다. 이식은 이식자가 추가 수술, 변이 개발, 또는 유사한 의료 절차를 적용함으로써 더 강력한 버전으로 업그레이드될 수 있습니다."
  },
  {
    "id": "grapple",
    "name_ko": "붙잡기",
    "name_en": "grapple",
    "type": "mechanic",
    "desc": "이 무기를 사용하면 양손이 자유롭지 않아도 운동 기술로 격투할 수 있습니다. 이 경우 무기의 사정거리(자신의 사정거리와 다른 경우)를 사용하며, 무기의 아이템 보너스를 운동 기술 판정에 아이템 보너스로 추가하여 공격 굴림에 추가합니다. 무기를 사용하여 격투 판정에서 대실패하면 무기를 떨어뜨려 대실패 대신 실패의 효과를 받을 수 있습니다."
  },
  {
    "id": "gremlin",
    "name_ko": "그렘린",
    "name_en": "gremlin",
    "type": "mechanic",
    "desc": "잔인하고 장난기 많은 요정인 그렘린은 우주에서의 삶에 적응해 왔습니다."
  },
  {
    "id": "grimoire",
    "name_ko": "마도서",
    "name_en": "grimoire",
    "type": "mechanic",
    "desc": "주문서는 마법 사용자라면 누구나 주문과 힘의 룬을 적을 수 있는 유용한 도구이지만, 대부분의 주문서가 양피지에 잉크를 적는 것에 불과하다면, 마도서는 주문에 대한 지식이 풍부한 마법사가 주문을 강화하는 데 사용할 수 있는 마법 속 마법을 흡수했습니다."
  },
  {
    "id": "grioth",
    "name_ko": "그리오스",
    "name_en": "grioth",
    "type": "mechanic",
    "desc": "그리오스는 오컬트 힘을 휘두르고 어두운 우주의 진공 상태에서도 존재할 수 있는 박쥐와 같은 외계인입니다. 암흑 시야와 반향 위치 파악 능력이 있습니다."
  },
  {
    "id": "grippli",
    "name_ko": "트립키",
    "name_en": "grippli",
    "type": "mechanic",
    "desc": "그리플리는 개구리를 닮은 휴머노이드입니다."
  },
  {
    "id": "gunslinger",
    "name_ko": "건슬링어",
    "name_en": "gunslinger",
    "type": "mechanic",
    "desc": "건슬링어 클래스의 능력을 나타냅니다."
  },
  {
    "id": "hag",
    "name_ko": "해그",
    "name_en": "hag",
    "type": "mechanic",
    "desc": "이 사악한 마녀들은 마녀회를 형성합니다."
  },
  {
    "id": "hampering",
    "name_ko": "방해",
    "name_en": "hampering",
    "type": "mechanic",
    "desc": "방해 특성이 있는 무기에는 파괴적인 팔다리 또는 플랜지가 포함됩니다. 상호작용 액션을 사용하여 무기가 닿을 수 있는 사각형 안에 있는 무기를 내리칠 수 있습니다. 이 사각형은 무기로 공격하거나, 이동하거나, 무기를 내려치기를 멈추거나, 다음 턴이 시작될 때까지 어려운 지형이 됩니다."
  },
  {
    "id": "harnessed",
    "name_ko": "활용",
    "name_en": "harnessed",
    "type": "mechanic",
    "desc": "이 방패에는 마상 무기를 장착할 수 있도록 설계된 특수 버팀대 또는 구멍이 있습니다."
  },
  {
    "id": "haunt",
    "name_ko": "귀신들린",
    "name_en": "haunt",
    "type": "mechanic",
    "desc": "이 특성을 가진 유령은 종종 비극적인 죽음을 맞이한 사람의 영적 메아리입니다. 유령을 잠재우려면 유령의 미완의 숙제를 해결해야 하는 경우가 많습니다. 제대로 잠재우지 못한 유령은 시간이 지나면 항상 다시 나타납니다."
  },
  {
    "id": "herald",
    "name_ko": "헤럴드",
    "name_en": "herald",
    "type": "mechanic",
    "desc": "거의 모든 신들은 특정 대표자로 알려진 '헤럴드'를 가지고 있습니다. 헤럴드들은 신들만큼이나 외모와 능력에서 다양합니다. 헤럴드 유형을 가진 생물은 항상 유일무이합니다."
  },
  {
    "id": "hex",
    "name_ko": "헥스",
    "name_en": "hex",
    "type": "mechanic",
    "desc": "헥스는 마녀가 시전할 수 있는 일종의 포커스 주문입니다."
  },
  {
    "id": "hindering",
    "name_ko": "방해",
    "name_en": "hindering",
    "type": "mechanic",
    "desc": "이 갑옷은 너무 무겁고 부피가 커서 무슨 일이 있어도 속도가 느려집니다. 모든 이동 속도에 -5의 페널티를 받습니다(최소 5피트 이동 속도까지). 이는 방어구의 속도 감소 효과와는 별개이며, 근력이나 능력으로 방어구의 속도 감소 효과를 줄이거나 무시할 수 있는 경우에도 영향을 받습니다."
  },
  {
    "id": "hobgoblin",
    "name_ko": "홉고블린",
    "name_en": "hobgoblin",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 키가 크고 군사적인 고블린족입니다. 홉고블린은 어둠 시야를 가지고 있습니다."
  },
  {
    "id": "holy",
    "name_ko": "신성한",
    "name_en": "holy",
    "type": "mechanic",
    "desc": "성스러운 특성을 가진 효과는 자비와 미덕의 강력한 마법력과 관련이 있습니다. 종종 부정한 생물에게 더 강력한 효과를 발휘합니다. 이 특성을 가진 생물은 성스러운 일에 강하게 헌신하며, 종종 부정한 것에 약합니다. 신성함에 약점을 가진 생물이 신성 아이템이나 효과를 사용하면, 그 약점으로 인한 피해를 받습니다"
  },
  {
    "id": "hryngar",
    "name_ko": "흐린가",
    "name_en": "hryngar",
    "type": "mechanic",
    "desc": "지하에 사는 드워프의 친척인 흐링가르들은 일반적으로 어둠 시야를 가지고 있으며, 독에 저항하고 밝은 빛에 놀라 물러납니다."
  },
  {
    "id": "humanoid",
    "name_ko": "인간형",
    "name_en": "humanoid",
    "type": "mechanic",
    "desc": "휴머노이드 생명체는 인간처럼 추론하고 행동합니다. 일반적으로 똑바로 서서 두 팔과 두 다리를 가지고 있습니다."
  },
  {
    "id": "ifrit",
    "name_ko": "아이프릿",
    "name_en": "ifrit",
    "type": "mechanic",
    "desc": "불의 차원에서 온 존재의 후손인 지니킨의 일종입니다."
  },
  {
    "id": "ikon",
    "name_ko": "이콘",
    "name_en": "ikon",
    "type": "mechanic",
    "desc": "ikon 특성을 가진 아이템은 모범자의 신성으로부터 제공되거나 생성된 특수 아이템으로, 해당 모범자와 매우 밀접하게 연결되어 있어 그들의 힘을 담는 성스러운 그릇으로 기능할 수 있습니다. 1레벨에 도달하면 세 개의 ikon을 얻습니다. 각 ikon은 패시브 내재 능력과 활성화 가능한 초월 능력을 갖추고 있습니다. 아이콘 특성이 있는 피트는 아이콘 중 하나에 추가 능력을 부여합니다. 아이콘 특성이 있는 피트를 획득할 때마다, 그 능력을 획득할 아이콘을 선택합니다. 피트의 사용 요건을 충족하는 아이콘이 여러 개 있는 경우, 피트를 여러 번 선택하여 다른 아이콘에 그 효과를 적용할 수 있습니다. 이 피트들은 어떤 아이콘에 부여될 수 있는지 나열되어 있으며, 하나의 아이콘에 여러 개의 피트를 부여할 수 있습니다."
  },
  {
    "id": "impulse",
    "name_ko": "임펄스",
    "name_en": "impulse",
    "type": "mechanic",
    "desc": "키네틱리스트가 주로 사용하는 마법 액션을 임펄스라고 합니다. 임펄스는 키네틱 오라가 활성화되어 있고 해당 원소를 채널링하고 있을 때만 사용할 수 있으며, 원소의 흐름을 형성할 수 있는 손이 자유로운 경우에만 사용할 수 있습니다. 임펄스 특성은 다른 능력이 이를 변경하지 않는 한 액션에 집중 특성이 있음을 의미합니다. 충동으로 원소를 선택할 수 있는 경우, 채널링 중인 원소를 선택할 수 있으며 충동은 해당 원소의 특성을 얻습니다."
  },
  {
    "id": "incarnate",
    "name_ko": "화신",
    "name_en": "incarnate",
    "type": "mechanic",
    "desc": "화신 특성이 있는 주문은 생물을 소환하는 주문과 주제는 비슷하지만, 소환된 특성을 가진 하수인을 소환하지 않습니다. 대신, 소환된 육화된 생물은 주문 시전이 끝나면 도착 액션을 취합니다. 당신의 다음 턴이 끝날 때, 육화된 생물은 걸음마, 보폭, 또는 자신이 가진 다른 이동 유형(예: 오르기 또는 굴진)의 액션을 취한 다음 출발 액션을 취합니다. 그러면 주문이 종료됩니다. 특정 도착 및 출발 액션의 이름은 각각 \"도착\" 또는 \"출발\" 단어 뒤에 이탤릭체로 표시되며, 특성이 함께 표시됩니다. 화신 주문으로 소환된 생물은 플레이어의 이익을 위해 행동하고, 가능한 한 플레이어와 아군에게서 효과를 멀리 떨어뜨리며, 플레이어의 요청을 듣기도 하지만 궁극적으로는 스스로 결정을 내립니다. 주문이 화신이 결정을 내리도록 지시하는 경우, GM은 화신이 어떻게 행동할지 결정합니다. 심지어 여러 번의 소환을 통해 원하는 대로 정확하게 행동하는 경향이 강해질 수도 있습니다. 화신은 완전한 생물이 아닙니다. 다른 액션을 취할 수 없으며, 주문 효과(예: 마법 해제)의 대상이 되거나 종료되지 않는 한 타격, 주문 또는 기타 효과의 대상이 되거나 피해를 입을 수 없습니다. 효과의 위치를 결정하기 위한 목적으로 크기가 정해져 있지만, 이동을 막지는 않습니다. 해당되는 경우, 효과는 주문 DC와 주문 공격 굴림 수정치를 사용합니다."
  },
  {
    "id": "incorporeal",
    "name_ko": "무형",
    "name_en": "incorporeal",
    "type": "mechanic",
    "desc": "무형의 생명체 또는 물체는 물리적 형태가 없습니다. 벽을 포함한 단단한 물체를 통과할 수 있습니다. 물체 안에 있는 무형 생물은 물체 외부를 인식하거나 공격하거나 상호작용할 수 없으며, 물체 안에서 자신의 차례를 시작하면 1만큼 둔화됩니다. 무형 생물은 무형 생물을 통과할 수 있지만 그 공간에서 자신의 이동을 끝낼 수는 없습니다. 무형 생물은 물체가 유령 접촉 속성 룬을 가지고 있지 않는 한, 물리 생물이나 물체에 대해 근력 기반 판정을 시도할 수 없으며 무형 생물에 대해서만 시도할 수 있습니다. 마찬가지로, 육체 생명체는 무체 생명체나 물체에 대해 근력 기반 판정을 시도할 수 없습니다. 무형 생명체는 일반적으로 질병, 독, 정밀 피해와 같이 물리적인 몸을 필요로 하는 효과나 조건에 면역이 있습니다. 일반적으로 모든 피해(역장 피해와 유령 접촉 속성 룬이 있는 공격으로 인한 피해 제외)에 대한 저항이 있으며, 비마법 피해에 대한 저항은 두 배로 증가합니다."
  },
  {
    "id": "inevitable",
    "name_ko": "불가피한",
    "name_en": "inevitable",
    "type": "mechanic",
    "desc": "이 구조화된 영원은 공리주의자들에 의해 만들어졌습니다. 각 유형의 불가피는 특정 임무에 전념합니다. 대부분의 불가피는 카오스 피해에 약합니다."
  },
  {
    "id": "infused",
    "name_ko": "주입된",
    "name_en": "infused",
    "type": "mechanic",
    "desc": "주입한 시약을 사용해 주입된 특성을 가진 연금 아이템을 만들었으며, 이 아이템은 비활성 상태가 되기까지 제한된 시간이 있습니다. 주입한 연금술 아이템의 모든 비영구적 효과는 느리게 작용하는 독과 같은 고통을 제외하고는 매일 다시 준비할 때 종료됩니다."
  },
  {
    "id": "infusion",
    "name_ko": "주입",
    "name_en": "infusion",
    "type": "mechanic",
    "desc": "주입 특성이 있는 액션은 키네키스트 충동을 조정합니다. 변경하려는 충동 액션 바로 전에 주입 액션을 사용해야 합니다. 충동 행동 바로 뒤에 충동 행동이 아닌 다른 액션(자유 액션 및 리액션 포함)을 사용하면 주입 행동의 효과를 낭비하게 됩니다. 주입 액션으로 추가된 추가 효과는 주입 액션 자체가 아니라 충동 효과의 일부입니다."
  },
  {
    "id": "ingested",
    "name_ko": "섭취됨",
    "name_en": "ingested",
    "type": "mechanic",
    "desc": "이 독은 마시거나 먹으면 감염됩니다."
  },
  {
    "id": "inhaled",
    "name_ko": "흡입",
    "name_en": "inhaled",
    "type": "mechanic",
    "desc": "이 독은 숨을 들이마시면 감염됩니다."
  },
  {
    "id": "injection",
    "name_ko": "주입",
    "name_en": "injection",
    "type": "mechanic",
    "desc": "이 무기는 부상 독으로 채울 수 있습니다. 무기로 공격에 성공한 직후, 한 번의 인터랙트 액션으로 대상에게 장전된 독을 주입할 수 있습니다. 무기에 새로운 물질을 재장전하려면 세 번의 상호작용 액션이 필요하며, 양손을 모두 사용해야 합니다."
  },
  {
    "id": "inscribed",
    "name_ko": "새겨진",
    "name_en": "inscribed",
    "type": "mechanic",
    "desc": "갑옷이나 방패는 두루마리 제작과 같은 방법으로 마법의 기호를 새길 수 있도록 처리되어 있습니다. 새겨진 의복에는 새겨진 두루마리 한 개를 넣을 수 있습니다. 두루마리를 활성화하려면 손이 자유로워야 하지만, 두루마리를 그리기 위해 상호작용을 할 필요는 없습니다. 마법을 활성화하여 현재 방어구에 새겨진 두루마리를 지울 수도 있습니다. 현재 갑옷에 두루마리가 새겨져 있거나 갑옷이 파손된 경우에는 갑옷에 새 두루마리를 새길 수 없습니다."
  },
  {
    "id": "intelligent",
    "name_ko": "지능",
    "name_en": "intelligent",
    "type": "mechanic",
    "desc": "이 특성을 가진 아이템은 지능적이며, 고유한 의지와 개성을 가지고 있을 뿐만 아니라 대부분의 아이템에는 없는 몇 가지 통계도 가지고 있습니다. 지능 아이템은 일반적인 방법으로는 제작할 수 없으며, 항상 희귀하거나 고유합니다."
  },
  {
    "id": "inventor",
    "name_ko": "발명가",
    "name_en": "inventor",
    "type": "mechanic",
    "desc": "발명가 클래스의 능력을 나타냅니다."
  },
  {
    "id": "invested",
    "name_ko": "인베스팅",
    "name_en": "invested",
    "type": "mechanic",
    "desc": "캐릭터는 인베스팅된 특성이 있는 마법 아이템을 10개까지만 착용할 수 있습니다. 캐릭터가 아이템을 인베스팅 하지 않은 경우에는 아이템의 마법 효과가 적용되지 않으며 활성화할 수도 없지만, 캐릭터는 물리 아이템 착용으로 얻을 수 있는 일반적인 혜택(예: 비를 막아주는 모자)은 계속 받을 수 있습니다."
  },
  {
    "id": "investigator",
    "name_ko": "조사자",
    "name_en": "investigator",
    "type": "mechanic",
    "desc": "이는 조사자 클래스의 능력을 나타냅니다."
  },
  {
    "id": "jousting",
    "name_ko": "마상",
    "name_en": "jousting",
    "type": "mechanic",
    "desc": "이 무기는 마구 또는 이와 유사한 수단으로 기마 전투에 적합합니다. 기마 상태일 때 공격 전 액션에서 10피트 이상 움직였다면 해당 공격의 피해에 무기의 피해 주사위 수만큼의 상황 보너스가 추가됩니다. 또한, 탈것에 탑승한 상태에서 무기를 한 손으로 휘두르면 피해 주사위가 나열된 값으로 바뀝니다."
  },
  {
    "id": "kami",
    "name_ko": "카미",
    "name_en": "kami",
    "type": "mechanic",
    "desc": "카미는 물질계에 속한 영혼으로, 특정 물체나 장소와 결합하는 존재입니다."
  },
  {
    "id": "kashrishi",
    "name_ko": "카쉬리시",
    "name_en": "kashrishi",
    "type": "mechanic",
    "desc": "독특한 수정 뿔과 타고난 초능력을 지닌 강인한 혈통입니다."
  },
  {
    "id": "kickback",
    "name_ko": "킥백",
    "name_en": "kickback",
    "type": "mechanic",
    "desc": "반동 무기는 매우 강력하지만 반동이 커서 사용하기가 어렵습니다. 반동 무기는 모든 공격에 추가 피해 1을 줍니다. 반동 무기를 발사하면 공격 주사위에 -2의 상황 페널티가 부여되지만, 근력이 14 이상인 캐릭터는 페널티를 무시합니다. 반동 무기를 배치된 바이포드, 삼각대, 기타 안정 장치에 부착하면 이 페널티를 낮추거나 무효화할 수 있습니다."
  },
  {
    "id": "kineticist",
    "name_ko": "키네티스트",
    "name_en": "kineticist",
    "type": "mechanic",
    "desc": "키네티스트 클래스의 능력을 나타냅니다."
  },
  {
    "id": "kitsune",
    "name_ko": "키츠네",
    "name_en": "kitsune",
    "type": "mechanic",
    "desc": "실제 모습은 여우를 닮은 변신 휴머노이드입니다."
  },
  {
    "id": "kobold",
    "name_ko": "코볼트",
    "name_en": "kobold",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 코볼트 혈통의 일원입니다."
  },
  {
    "id": "kovintus",
    "name_ko": "코빈투스",
    "name_en": "kovintus",
    "type": "mechanic",
    "desc": "은둔적인 인간형 생물인 코빈투스는 선천적인 지리학의 재능을 지니고 있으며, 자연과 마법 모두와 본질적인 연결고리를 가지고 있습니다."
  },
  {
    "id": "laminar",
    "name_ko": "라미나르",
    "name_en": "laminar",
    "type": "mechanic",
    "desc": "갑옷은 겹겹이 쌓인 부분으로 구성되어 있어 부러져도 큰 문제가 되지 않습니다. 갑옷이 부러졌을 때 받는 상태 이상 페널티는 중형 갑옷이 부러진 경우 -1, 중갑옷이 부러진 경우 -2, 경갑옷이 부러진 경우 페널티가 없습니다."
  },
  {
    "id": "launching",
    "name_ko": "발사가능",
    "name_en": "launching",
    "type": "mechanic",
    "desc": "방패에 있는 메커니즘이 투사체를 발사하여 방패를 원거리 무기로도 사용할 수 있습니다. 특성에는 \"발사 다트\"와 같은 무기의 종류가 나열되어 있습니다. 발사기로 공격할 때는 평소와 같은 수의 손이 필요하지만, 방패를 들고 있는 손도 이 총계에 포함되므로 한손 원거리 무기는 한 손만 있으면 됩니다. 재장전에는 일반적인 인터랙트 액션 횟수인 최소 1회의 액션이 필요하며, 방패를 들고 있는 손으로는 재장전할 수 없습니다."
  },
  {
    "id": "leshy",
    "name_ko": "레시",
    "name_en": "leshy",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 레쉬 혈통의 일원입니다."
  },
  {
    "id": "lineage",
    "name_ko": "혈통",
    "name_en": "lineage",
    "type": "mechanic",
    "desc": "이 특성을 가진 피트는 캐릭터가 특정 유형의 생물에서 유래했음을 나타냅니다. 계통 피트는 하나만 선택할 수 있습니다. 계통 피트는 1레벨에서만 선택할 수 있으며, 이 피트를 재훈련하거나 다른 피트로 변경할 수 없습니다."
  },
  {
    "id": "linguistic",
    "name_ko": "언어",
    "name_en": "linguistic",
    "type": "mechanic",
    "desc": "이 특성을 가진 효과는 언어 이해도에 따라 달라집니다. 생물을 대상으로 하는 언어 효과는 대상이 내가 사용하는 언어를 이해하는 경우에만 작동합니다."
  },
  {
    "id": "litany",
    "name_ko": "리타니",
    "name_en": "litany",
    "type": "mechanic",
    "desc": "기도문은 일반적으로 챔피언이 사용하는 특별한 헌신 주문으로, 한 번의 액션을 필요로 하며, 보통 추가 기도문에 일시적인 면역 효과를 부여합니다."
  },
  {
    "id": "lizardfolk",
    "name_ko": "리자드포크",
    "name_en": "lizardfolk",
    "type": "mechanic",
    "desc": "이루시라고도 불리는 이 파충류 휴머노이드는 적응력이 뛰어나고 인내심이 강합니다."
  },
  {
    "id": "lozenge",
    "name_ko": "로젠지",
    "name_en": "lozenge",
    "type": "mechanic",
    "desc": "연금술 사탕을 입에 넣으면 활성화됩니다. 시간이 지남에 따라 천천히 녹아 성분을 방출하면서 그 자리에 머물러 있습니다. 마름모꼴 사탕을 깨물면 보조 효과를 얻을 수 있습니다. 이것이 취하는 액션은 항목에 명시되어 있습니다. 이 보조 효과가 끝나면 마름모꼴 사탕이 소진되고 그 혜택이 종료됩니다. 엘릭서, 물약, 음료는 입에 사탕을 물고 마실 수 있지만, 한 번에 두 개 이상의 사탕의 혜택을 받을 수는 없습니다. 두 개의 마름모꼴 사탕을 동시에 입에 넣으면 둘 다 비활성 상태가 됩니다. 사탕을 한 번의 액션으로 뱉어 효과를 종료하고 비활성 상태로 만들 수도 있습니다. 사탕은 연금술 성분으로 인해 녹기 때문에 일반적으로 타액이 없어도 효과가 지속됩니다."
  },
  {
    "id": "maftet",
    "name_ko": "마프테트",
    "name_en": "maftet",
    "type": "mechanic",
    "desc": "마프테츠는 상반신은 인간형이고 하반신은 사자형이며 매와 같은 날개를 지녔다."
  },
  {
    "id": "magical",
    "name_ko": "마법적",
    "name_en": "magical",
    "type": "mechanic",
    "desc": "마법 특성을 가진 무언가에는 특정 마법 전통과 관련이 없는 마법의 에너지가 스며들어 있습니다. 일부 아이템이나 효과는 특정 마법 전통과 밀접하게 연관되어 있습니다. 이러한 경우 아이템은 마법 특성 대신 아케인, 디바인, 오컬트 또는 프라이멀 특성을 갖습니다. 이러한 특성이 있으면 해당 아이템이 마법 아이템임을 나타냅니다."
  },
  {
    "id": "magus",
    "name_ko": "메이거스",
    "name_en": "magus",
    "type": "mechanic",
    "desc": "메이거스 클래스의 능력을 나타냅니다."
  },
  {
    "id": "mechanical",
    "name_ko": "기계",
    "name_en": "mechanical",
    "type": "mechanic",
    "desc": "이 특성을 지닌 위험 요소는 구성된 물리적 물체입니다."
  },
  {
    "id": "merfolk",
    "name_ko": "머포크",
    "name_en": "merfolk",
    "type": "mechanic",
    "desc": "이 수생 인간형 생물은 상체는 인간과 유사하고 하체는 물고기와 유사합니다."
  },
  {
    "id": "metal",
    "name_ko": "금속",
    "name_en": "metal",
    "type": "mechanic",
    "desc": "금속 특성을 가진 효과는 금속을 조작하거나 소환합니다. 금속을 조작하는 효과는 금속이 없는 지역에서는 효과가 없습니다. 이 특성을 가진 생물은 주로 금속으로 이루어져 있거나 해당 원소와 마법적으로 연결되어 있습니다."
  },
  {
    "id": "mindless",
    "name_ko": "무심한",
    "name_en": "mindless",
    "type": "mechanic",
    "desc": "무의식 생명체는 프로그래밍된 정신 속성 또는 초보적인 정신 속성을 가지고 있습니다. 전부는 아니더라도 대부분의 정신 속성 수정치는 -5입니다. 이들은 모든 정신 효과에 면역입니다."
  },
  {
    "id": "mindshift",
    "name_ko": "마인드 시프트",
    "name_en": "mindshift",
    "type": "mechanic",
    "desc": "이 특성이 있는 액션은 언제든지 정신의 원초적인 힘을 사용하도록 변경할 수 있습니다. 이 액션을 사용할 때, 이 액션이 주는 모든 피해를 정신 피해로 바꾸고, 정신 특성을 부여하고, 필요한 저항을 의지 저항으로 바꿀 수 있습니다. 이 액션은 더 이상 입히지 않는 피해 유형과 일치하는 특성을 잃습니다."
  },
  {
    "id": "minotaur",
    "name_ko": "미노타우루스",
    "name_en": "minotaur",
    "type": "mechanic",
    "desc": "미노타우르는 뿔이 난 소 모양의 인간형 생물로, 미로와 퍼즐에 능숙합니다."
  },
  {
    "id": "misfortune",
    "name_ko": "불운",
    "name_en": "misfortune",
    "type": "mechanic",
    "desc": "불행 효과는 주사위를 굴리는 방식에 불이익을 줍니다. 한 번의 주사위 굴림에 두 가지 이상의 불행 효과가 적용될 수는 없습니다. 불행 효과가 여러 개 적용될 경우, GM이 어떤 것이 더 나쁜지 결정하여 적용합니다. 행운 효과와 불행 효과가 같은 주사위에 적용될 경우, 두 효과는 서로 반격되고 정상적으로 주사위를 굴립니다."
  },
  {
    "id": "missive",
    "name_ko": "미시브",
    "name_en": "missive",
    "type": "mechanic",
    "desc": "미시브는 마법 문구류로, 반드시 제작하고 구성해야 활성화할 수 있습니다. 모든 미시브에는 미시브와 소모품 특성이 있습니다. 미시브는 보통 종이, 양피지, 모피지로 제작되지만, 글이나 엠보싱을 넣을 수 있는 얇고 휴대가 간편한 재료라면 무엇이든 미시브로 제작할 수 있습니다. 미시브를 제작한 후에는 그 위에 메시지를 작성하여 마법을 완성하기 전까지는 빈 종이입니다."
  },
  {
    "id": "modification",
    "name_ko": "수정",
    "name_en": "modification",
    "type": "mechanic",
    "desc": "이 특성의 재주는 혁신의 구성을 변경합니다. 재구성 클래스 특징이 있으면 이러한 재주를 더 쉽게 재교육할 수 있습니다."
  },
  {
    "id": "modular",
    "name_ko": "모듈형 B, P 또는 S",
    "name_en": "modular",
    "type": "mechanic",
    "desc": "무기에는 인터랙트 액션을 사용하여 전환할 수 있는 여러 가지 구성이 있습니다. 일반적으로 모듈형 무기의 구성을 전환하면 다양한 유형의 피해를 입힐 수 있지만(예: \"모듈형 B, P 또는 S\"와 같이 특성에 나열됨), 모듈형 무기 설명에 더 복잡한 구성이 나열될 수도 있습니다."
  },
  {
    "id": "monitor",
    "name_ko": "주시자",
    "name_en": "monitor",
    "type": "mechanic",
    "desc": "본야드, 메일스트롬에서 유래하거나 그곳과 밀접한 관련이 있는 생물들을 모니터라고 합니다. 모니터는 외부 영역의 기본 환경 효과에서 살아남을 수 있습니다."
  },
  {
    "id": "monk",
    "name_ko": "몽크",
    "name_en": "monk",
    "type": "mechanic",
    "desc": "이 특성을 가진 능력은 몽크 클래스에 속합니다. 이 특성을 가진 무기는 주로 몽크가 사용합니다."
  },
  {
    "id": "morlock",
    "name_ko": "몰록",
    "name_en": "morlock",
    "type": "mechanic",
    "desc": "모록스는 수 세기 전에 일반 인간이었던 창백한 지하 거주 인간형 생물 종족입니다."
  },
  {
    "id": "morph",
    "name_ko": "변형",
    "name_en": "morph",
    "type": "mechanic",
    "desc": "생물의 형태를 약간 변경하는 효과에는 변신 특성이 있습니다. 변신 효과에 의해 특별히 부여되는 모든 타격은 마법입니다. 한 번에 여러 개의 변신 주문의 영향을 받을 수 있지만, 같은 신체 부위를 두 번 이상 변신하면 두 번째 변신 효과는 첫 번째 효과를 반격하려고 시도합니다(해당 특성에 설명된 두 개의 다형성 효과와 같은 방식으로). 또한, 형상변환 중인 상태에서 형상변환 효과가 자신의 형상변환 효과를 무효화하거나 무시하는 경우에도 형상변환 효과가 종료될 수 있습니다. GM이 함께 사용할 수 있는 변신 효과와 사용할 수 없는 효과를 결정합니다."
  },
  {
    "id": "mortic",
    "name_ko": "모틱",
    "name_en": "mortic",
    "type": "mechanic",
    "desc": "모티크는 언데드와 밀접한 관련이 있는 살아있는 인간형 생물입니다. 암흑 시야, 치유력 상실, 신성한 땅에 대한 취약성을 가지고 있으며, 숨을 참으면 언데드가 될 수 있습니다."
  },
  {
    "id": "mounted",
    "name_ko": "마운트",
    "name_en": "mounted",
    "type": "mechanic",
    "desc": "기갑 공성 무기는 일정한 크기와 공간을 차지하며, 일반적으로 공격할 수 있는 통계가 있습니다. 대규모 전쟁에 사용됩니다."
  },
  {
    "id": "multiclass",
    "name_ko": "멀티클래스",
    "name_en": "multiclass",
    "type": "mechanic",
    "desc": "멀티 클래스 특성을 가진 아키타입은 다른 클래스의 전문 분야로 훈련을 다양화하는 것을 나타냅니다. 같은 이름의 클래스에 소속되어 있는 경우 멀티 클래스 아키타입의 헌신 재주를 선택할 수 없습니다."
  },
  {
    "id": "mummy",
    "name_ko": "미라",
    "name_en": "mummy",
    "type": "mechanic",
    "desc": "미라는 보존된 시체에서 만들어진 언데드 생물입니다."
  },
  {
    "id": "munavri",
    "name_ko": "무나브리",
    "name_en": "munavri",
    "type": "mechanic",
    "desc": "다크랜드에 사는 친근한 인간형 생물인 무나브리스는 강력한 염력과 사이킥 능력을 가지고 있습니다."
  },
  {
    "id": "mutagen",
    "name_ko": "혈청",
    "name_en": "mutagen",
    "type": "mechanic",
    "desc": "혈청 특성을 가진 엘릭서는 대상의 신체를 일시적으로 변형시키고 정신을 변화시킵니다. 혈청은 항상 하나 이상의 유익한 효과와 하나 이상의 해로운 효과를 함께 전달합니다. 혈청은 다형성 효과이므로 한 번에 하나만 혜택을 받을 수 있습니다."
  },
  {
    "id": "mutant",
    "name_ko": "돌연변이",
    "name_en": "mutant",
    "type": "mechanic",
    "desc": "몬스터가 변이하거나 진화하여 특이한 장점, 단점, 또는 둘 다를 얻었습니다."
  },
  {
    "id": "mythic",
    "name_ko": "신화적",
    "name_en": "mythic",
    "type": "mechanic",
    "desc": "이 특성을 가진 옵션은 신화적 힘을 부여하거나 활용합니다. 신화적 특성을 가진 피트는 신화적 소명을 가진 신화적 캐릭터만 선택할 수 있습니다. 신화적 특성을 가진 몬스터는 신화 포인트 풀을 사용할 수 있으며, 같은 레벨의 다른 생물보다 특히 강합니다. 많은 신화적 몬스터는 신화적이지 않은 생물이나 무기의 공격에 대해 저항력이나 완전히 면역입니다. 신화적 특성을 가진 주문은 발동하기 위해 신화 포인트를 소모해야 하며, 신화적 특성을 가진 아이템은 활성화된 능력을 사용하기 위해 신화 포인트를 소모해야 합니다. 신화적 특성을 가진 무기는 신화적 몬스터의 저항력과 면역력을 무력화합니다."
  },
  {
    "id": "nagaji",
    "name_ko": "나가지",
    "name_en": "nagaji",
    "type": "mechanic",
    "desc": "파충류의 특징과 뱀의 머리를 가진 전통주의 조상입니다."
  },
  {
    "id": "nightmare",
    "name_ko": "악몽",
    "name_en": "nightmare",
    "type": "mechanic",
    "desc": "악몽의 위험은 렝에서만 발생하는 독특한 현상이다. 여러 면에서 악몽의 위험은 유령 출몰과 유사하며, 잠재적 희생자들은 퇴마를 통해 이를 무력화하려고 시도하다 효과가 없다는 사실을 깨닫기 전까지는 그 끔찍한 진실을 알지 못할 수도 있다."
  },
  {
    "id": "nindoru",
    "name_ko": "닌도루",
    "name_en": "nindoru",
    "type": "mechanic",
    "desc": "닌도루는 영혼이 환생하는 주기에 따라 타락하여 우주에 사는 혼돈의 사악한 악마입니다. 닌도루는 종종 언데드처럼 보이게 하는 요소를 가지고 있지만, 실제로는 살아있는 존재입니다. 대부분의 닌도루는 암흑 시야를 가지고 있으며, 죽음의 효과에 면역이 있고, 은에 약하며, 생각에서 사물이나 생물을 발현하는 힘을 가지고 있습니다."
  },
  {
    "id": "noisy",
    "name_ko": "시끄러운",
    "name_en": "noisy",
    "type": "mechanic",
    "desc": "이 갑옷은 시끄러워서 주목 피하기 탐험 활동을 사용할 때 다른 플레이어에게 자신의 존재를 알릴 가능성이 높습니다. 이 갑옷의 판정 페널티는 요구 조건인 근력 점수를 충족하더라도 은신 판정에 적용됩니다."
  },
  {
    "id": "nonlethal",
    "name_ko": "치명적이지 않음",
    "name_en": "nonlethal",
    "type": "mechanic",
    "desc": "이 무기를 사용한 공격은 치명적이지 않으며 생물을 죽이는 대신 무의식으로 만드는 데 사용됩니다. 치명적이지 않은 무기를 사용하여 -2 상황 페널티를 받고 치명적인 공격을 할 수 있습니다."
  },
  {
    "id": "nymph",
    "name_ko": "님프",
    "name_en": "nymph",
    "type": "mechanic",
    "desc": "이 아름다운 요정 생물들은 자연과 밀접한 관련이 있습니다."
  },
  {
    "id": "oath",
    "name_ko": "맹세",
    "name_en": "oath",
    "type": "mechanic",
    "desc": "맹세는 코드에 추가 원칙을 추가합니다. 이 특성은 보통 한 가지 재주만 가질 수 있습니다."
  },
  {
    "id": "oil",
    "name_ko": "오일",
    "name_en": "oil",
    "type": "mechanic",
    "desc": "오일은 일반적으로 물체에 바르고 그 과정에서 소진되는 마법의 젤, 연고, 페이스트 또는 연고입니다."
  },
  {
    "id": "olfactory",
    "name_ko": "후각",
    "name_en": "olfactory",
    "type": "mechanic",
    "desc": "후각 효과는 냄새를 맡을 수 있는 생물에게만 영향을 줄 수 있습니다. 이는 GM이 결정하는 대로 후각 효과의 일부에만 적용됩니다."
  },
  {
    "id": "oni",
    "name_ko": "오니",
    "name_en": "oni",
    "type": "mechanic",
    "desc": "오니는 잔인하고 형태를 바꾸는 거인족으로, 과거에 신이었던 존재들입니다."
  },
  {
    "id": "ooze",
    "name_ko": "점액체",
    "name_en": "ooze",
    "type": "mechanic",
    "desc": "우즈는 해부학적으로 단순한 생물입니다. 정신 속성 수정자가 낮고, 정신 효과 및 정밀 피해에 면역이 있는 경향이 있습니다."
  },
  {
    "id": "oracle",
    "name_ko": "오라클",
    "name_en": "oracle",
    "type": "mechanic",
    "desc": "오라클 클래스의 능력을 나타냅니다."
  },
  {
    "id": "oread",
    "name_ko": "오레드",
    "name_en": "oread",
    "type": "mechanic",
    "desc": "대지 차원에서 온 존재의 후손인 지니킨의 일종입니다."
  },
  {
    "id": "overflow",
    "name_ko": "오버플로",
    "name_en": "overflow",
    "type": "mechanic",
    "desc": "강력한 충동은 일시적으로 키네틱 게이트의 에너지를 넘치게 합니다. 오버플로 특성이 있는 임펄스를 사용하면 키네틱 오라가 다시 활성화될 때까지 비활성화됩니다(일반적으로 채널 원소를 사용합니다). 원소를 이렇게 심하게 소진하는 것은 부담스럽기 때문에 키네틱 게이트를 다시 활성화하더라도 라운드당 오버플로 임펄스는 한 번만 사용할 수 있습니다."
  },
  {
    "id": "paaridar",
    "name_ko": "파리다르",
    "name_en": "paaridar",
    "type": "mechanic",
    "desc": "파아리다르는 부패한 마법 의식을 통해 강력한 야수의 신체적 특징과 능력을 얻은 인간형 존재입니다."
  },
  {
    "id": "palinthanos",
    "name_ko": "팔린타노스",
    "name_en": "palinthanos",
    "type": "mechanic",
    "desc": "신들의 비와 같은 우주적 사건이 존재하는 모든 것을 뒤흔들 때, 영혼의 강은 충격파로 인해 일시적으로 역류하는 현상이 발생합니다. 충격파에 의해 강제로 멀리 밀려난 영혼들은 역류하는 시간 속에서 죽음을 겪는 고통스러운 경험을 할 수 있습니다. 이 중 일부는 흐름이 정상으로 돌아오면 다시 강으로 들어갈 수 있지만, 살아있는 자들의 해안에 좌초된 영혼들은 팔린타노스가 될 수 있습니다. 팔린타노스는 역행한 죽음에서 태어난 강력한 언데드로, 운명적으로 강으로 추방될 때까지 헛된 투쟁을 계속합니다."
  },
  {
    "id": "parry",
    "name_ko": "패리",
    "name_en": "parry",
    "type": "mechanic",
    "desc": "이 무기는 방어적으로 사용하여 공격을 막을 수 있습니다. 이 무기를 사용하는 동안 훈련된 숙련도 이상이면 한 번의 액션을 사용하여 무기를 방어적으로 배치하고 다음 턴이 시작될 때까지 AC에 +1의 상황 보너스를 얻을 수 있습니다."
  },
  {
    "id": "persona-flirt",
    "name_ko": "페르소나: 유혹자",
    "name_en": "persona-flirt",
    "type": "mechanic",
    "desc": "대중은 당신을 그룹에서 가장 로맨틱한 사람으로 인식하며, 외모에 의존해 살아가는 유혹자나 텅 빈 허세꾼으로 여겨질 수 있습니다."
  },
  {
    "id": "persona-guardian",
    "name_ko": "페르소나: 수호자",
    "name_en": "persona-guardian",
    "type": "mechanic",
    "desc": "대중은 당신을 그룹의 치유자이자 보호자로 인식하지만, 일부는 당신을 \"진정한 영웅\"으로 보기에는 너무 마음이 약하고 소심하다고 생각할 수도 있습니다."
  },
  {
    "id": "persona-leader",
    "name_ko": "페르소나: 지도자",
    "name_en": "persona-leader",
    "type": "mechanic",
    "desc": "대중은 당신을 그룹의 리더로 인식하지만, 일부는 당신을 너무 과격하거나 심지어 교만하다고 생각합니다."
  },
  {
    "id": "persona-scholar",
    "name_ko": "페르소나: 학자",
    "name_en": "persona-scholar",
    "type": "mechanic",
    "desc": "대중은 당신을 문제 해결자이자 그룹의 두뇌로 여기지만, 일부는 당신을 교만하거나 신체적 업무에 능숙하지 못하다고 생각합니다."
  },
  {
    "id": "persona-scoundrel",
    "name_ko": "페르소나: 불량배",
    "name_en": "persona-scoundrel",
    "type": "mechanic",
    "desc": "대중은 당신이 그룹의 \"나쁜 남자/나쁜 여자\"로, 불쾌하지만 필요한 일을 처리하는 인물로 믿고 있습니다. 하지만 때로는 당에 대한 범죄자나 잠재적 배신자로 여겨지기도 합니다."
  },
  {
    "id": "persona-underdog",
    "name_ko": "페르소나: 언더독",
    "name_en": "persona-underdog",
    "type": "mechanic",
    "desc": "대중은 당신을 \"물 밖의 물고기\"로 인식합니다—우연히 그룹에 휘말려 들어갔지만 여전히 성공을 거두는 사람으로, 때로는 약한 고리나 패배자로 여겨지는 인물입니다."
  },
  {
    "id": "persona-warrior",
    "name_ko": "페르소나: 전사",
    "name_en": "persona-warrior",
    "type": "mechanic",
    "desc": "대중은 당신을 그룹의 강자, 싸움에 능한 사람으로 인식하지만, 때로는 잔인하고 무례하며 심지어 괴롭힘을 일삼는 사람으로 생각하기도 합니다."
  },
  {
    "id": "persona-wildcard",
    "name_ko": "페르소나: 와일드카드",
    "name_en": "persona-wildcard",
    "type": "mechanic",
    "desc": "대중은 당신을 그룹 내에서 유머러스하고 독특한 아이디어의 원천으로 인식하지만, 그 명성은 양날의 검과도 같습니다. 일부는 당신을 부담스러운 존재나 신뢰할 수 없는 사람으로 여기기 때문입니다."
  },
  {
    "id": "phantom",
    "name_ko": "팬텀",
    "name_en": "phantom",
    "type": "mechanic",
    "desc": "유령은 심판을 받기 전에 에테리얼 플레인의 영혼의 강에서 분리된 영혼입니다. 일반적으로 죽음 전의 기억을 유지하고 있지만 언데드는 아닙니다."
  },
  {
    "id": "plant",
    "name_ko": "식물",
    "name_en": "plant",
    "type": "mechanic",
    "desc": "식물성 생물은 식물 특성을 가지고 있습니다. 식물은 일반 식물과 구별됩니다. 이 특성을 가진 마법 효과는 어떤 식으로든 식물이나 식물 물질을 조작하거나 만들어냅니다. 식물을 조작하는 효과는 식물이 없는 지역에서는 효과가 없습니다."
  },
  {
    "id": "polymorph",
    "name_ko": "변이",
    "name_en": "polymorph",
    "type": "mechanic",
    "desc": "이 효과는 대상을 새로운 형태로 변화시킵니다. 대상은 한 번에 두 개 이상의 다형성 효과의 영향을 받을 수 없습니다. 대상이 두 번째 다형체 효과의 영향을 받는 경우, 두 번째 다형체 효과는 첫 번째 다형체 효과를 반격하려고 시도합니다. 성공하면 효과가 적용되고, 실패하면 해당 주문은 해당 대상에게 효과가 없습니다. 다형체 효과에 의해 특별히 부여되는 모든 타격은 마법입니다. 달리 명시되지 않는 한, 다형체 주문은 대상이 특정 개별 생물의 모습을 취하는 것이 아니라 일반적인 유형이나 혈통의 일반 생물의 모습을 취하게 합니다. 다형성 주문으로 전투 형태를 취하면 특수 능력치는 상황 보너스, 상태 보너스, 페널티에 의해서만 조정할 수 있습니다. 별도의 설명이 없는 한, 전투 형태에서는 주문 시전, 말하기, 손이 필요한 대부분의 조작 액션을 사용할 수 없습니다. (액션을 사용할 수 있는지 여부는 GM이 결정합니다.) 장비는 자신에게 흡수되며, 장비의 상시 능력은 계속 작동하지만 아이템은 활성화할 수 없습니다."
  },
  {
    "id": "ponderous",
    "name_ko": "숙고",
    "name_en": "ponderous",
    "type": "mechanic",
    "desc": "갑옷에는 움직이는 부품이나 기타 합병증이 있어 착용자의 초기 리액션 시간이 길어집니다. 갑옷을 착용하고 있는 동안에는 우선권 판정에서 -1의 페널티를 받습니다. 갑옷의 요구 조건인 근력 점수를 충족하지 못하면 이 페널티는 갑옷의 판정 페널티와 같을 때까지 증가하며, 더 나쁠 경우 이 페널티는 갑옷의 판정 페널티와 같습니다."
  },
  {
    "id": "poppet",
    "name_ko": "퍼펫",
    "name_en": "poppet",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 퍼펫 혈통의 일원입니다."
  },
  {
    "id": "portable",
    "name_ko": "휴대성",
    "name_en": "portable",
    "type": "mechanic",
    "desc": "공성추와 같은 휴대용 공성 무기는 더 쉽게 휴대할 수 있으며 전쟁은 물론 소규모 분쟁이나 탐사에서도 역할을 할 수 있습니다."
  },
  {
    "id": "possession",
    "name_ko": "소유",
    "name_en": "possession",
    "type": "mechanic",
    "desc": "이 특성을 가진 효과를 사용하면 생물은 자신의 정신과 영혼을 대상에게 투사할 수 있습니다. 정신 효과에 면역인 생물은 빙의 효과를 사용할 수 없습니다. 빙의 효과로 생물체가 대상에게 물리적으로 들어갈 수 있는 경우를 제외하고, 대상에게 빙의하는 동안 빙의자의 실제 몸은 의식이 없는 상태이며 정상적으로 깨어날 수 없습니다. 대상이 피해를 받을 때마다 빙의자는 그 피해의 절반을 정신 피해로 받습니다. 빙의자는 자신의 신체에 영향을 주는 주문이나 능력의 효과를 잃지만, 대상의 신체에 영향을 주는 주문과 능력의 효과는 얻습니다. 빙의자는 대상의 순전히 물리적인 능력은 모두 사용할 수 있으며, 주문과 순전히 정신적인 능력을 제외한 자신의 능력은 사용할 수 없습니다. 능력이 순전히 물리적 능력인지, 순전히 정신적 능력인지는 GM이 결정합니다. 빙의자는 대상의 공격 수정치, AC, 인내 내성, 반사 내성, 지각, 물리 기술, 자신의 의지 내성, 정신 기술, 주문 공격 굴림, 주문 DC를 사용하며, 해당하는 경우 투자한 아이템의 혜택이 적용됩니다(자신의 가치를 사용할 때는 빙의자의 투자 아이템이, 대상의 가치를 사용할 때는 대상의 투자 아이템이 적용됨). 소지자는 자신의 몸에 있지 않으므로 일반적으로 시전자에게만 영향을 주는 주문을 발동해도 이득을 얻지 못합니다. 빙의된 생물이 행동하도록 하려면 빙의자는 자신의 액션을 사용해야 합니다. 빙의 대상은 빙의로 인한 본체 피해와 정신적 피해를 모두 합쳐서 HP가 0에 도달하면 정상적으로 기절하고 빙의는 즉시 종료됩니다. 대상이 먼저 HP 0에 도달하면 빙의자는 몸과 함께 의식을 잃고 빙의를 계속하거나 자유 액션으로 효과를 종료하고 몸으로 돌아갈 수 있습니다. 대상이 죽어감으로써 빙의는 즉시 종료되고 빙의자는 1분 동안 기절합니다."
  },
  {
    "id": "potion",
    "name_ko": "물약",
    "name_en": "potion",
    "type": "mechanic",
    "desc": "물약은 마실 때 활성화되는 마법의 액체입니다."
  },
  {
    "id": "precious",
    "name_ko": "귀중한",
    "name_en": "precious",
    "type": "mechanic",
    "desc": "특별한 특성을 가진 귀중한 재료에는 귀중한 특성이 있습니다. 아이템 제작 시 기본 재료로 대체할 수 있습니다."
  },
  {
    "id": "press",
    "name_ko": "압박",
    "name_en": "press",
    "type": "mechanic",
    "desc": "이 특성이 있는 액션을 사용하면 앞선 공격을 후속 공격할 수 있습니다. 누르기 특성이 있는 액션은 현재 다중 공격 페널티의 영향을 받고 있는 경우에만 사용할 수 있습니다. 준비 활동을 사용하더라도 자신의 차례가 아닐 때는 누르기 액션을 사용할 수 없습니다. 누르기 특성이 있는 일부 액션은 실패 시에도 효과를 부여합니다. 실패 시 추가되는 효과는 대실패 시에는 적용되지 않습니다. 누르기 액션이 성공하면 대신 실패 효과를 적용하도록 선택할 수 있습니다. (예를 들어, 저항으로 인해 공격이 피해를 주지 않을 때 이렇게 할 수 있습니다.)"
  },
  {
    "id": "processed",
    "name_ko": "가공된",
    "name_en": "processed",
    "type": "mechanic",
    "desc": "가공 특성을 가진 연금술 소모품은 빠른 연금술로 만들 수 있지만, 한 번의 액션으로 만들기에는 너무 복잡합니다."
  },
  {
    "id": "propulsive",
    "name_ko": "추진력",
    "name_en": "propulsive",
    "type": "mechanic",
    "desc": "추진력 원거리 무기로 굴려서 주는 피해에 근력 수정치의 절반(양수일 경우)을 더합니다. 근력 수정치가 음수인 경우, 대신 자신의 근력 수정치 전체를 더합니다."
  },
  {
    "id": "protean",
    "name_ko": "프로테안",
    "name_en": "protean",
    "type": "mechanic",
    "desc": "메일스트롬에서 탄생한 모니터의 일족으로, 이 생물들은 무질서의 수호자입니다. 이들은 일반적으로 암흑 시야, 무정형 해부학적 구조, 마법적인 워프파를 생성하는 능력을 가지고 있습니다."
  },
  {
    "id": "psyche",
    "name_ko": "사이키",
    "name_en": "psyche",
    "type": "mechanic",
    "desc": "정신 특성을 가진 능력을 사용하려면 정신이 해방되어야 하며, 해방된 정신이 가라앉으면 자동으로 종료됩니다."
  },
  {
    "id": "psychic",
    "name_ko": "사이킥",
    "name_en": "psychic",
    "type": "mechanic",
    "desc": "이것은 심령술사 클래스의 능력을 나타냅니다."
  },
  {
    "id": "psychopomp",
    "name_ko": "사이코폼프",
    "name_en": "psychopomp",
    "type": "mechanic",
    "desc": "본야드에서 태어난 모니터의 일족으로, 영혼을 외부 차원으로 전달하는 역할을 합니다. 이들은 일반적으로 암흑 시야, 생명 감지, 목자의 손길을 가지고 있으며, 죽음의 효과에 면역입니다."
  },
  {
    "id": "qlippoth",
    "name_ko": "클리포스",
    "name_en": "qlippoth",
    "type": "mechanic",
    "desc": "외곽 균열에서 온 악마의 일족인 클리포스는 대부분 불경스러운 존재입니다. 그들의 모습은 그들을 보는 비클리포스의 정신에 영향을 미칩니다."
  },
  {
    "id": "radiation",
    "name_ko": "방사",
    "name_en": "radiation",
    "type": "mechanic",
    "desc": "일반적으로 방사성 광물에서 발생하는 위험하고 일반적으로 유독한 방출입니다."
  },
  {
    "id": "rage",
    "name_ko": "분노",
    "name_en": "rage",
    "type": "mechanic",
    "desc": "분노 특성을 가진 능력을 사용하려면 반드시 분노 상태여야 하며, 분노를 멈추면 자동으로 종료됩니다."
  },
  {
    "id": "rakshasa",
    "name_ko": "락샤사",
    "name_en": "rakshasa",
    "type": "mechanic",
    "desc": "라크샤사스는 신성한 영혼이지만 세속적인 것을 상징합니다. 그들은 일반적으로 형태를 변환할 수 있으며 성스러운 것에 약점을 가지고 있습니다."
  },
  {
    "id": "range",
    "name_ko": "사거리",
    "name_en": "range",
    "type": "mechanic",
    "desc": "이러한 공격은 범위 증가에 대한 일반적인 규칙을 따르는 유한 범위 또는 범위 증가를 나열합니다."
  },
  {
    "id": "ranged-trip",
    "name_ko": "원거리 트립",
    "name_en": "ranged-trip",
    "type": "mechanic",
    "desc": "이 무기는 무기의 첫 번째 사거리 증가분까지 거리에서 운동 기술로 넘어뜨리는 데 사용할 수 있습니다. 기술 판정에는 -2의 상황 페널티가 적용됩니다. 무기의 아이템 보너스를 공격 주사위에 보너스로 추가하여 판정할 수 있습니다. 근접 무기로 넘어뜨릴 때와 마찬가지로 원거리 넘어뜨림은 넘어뜨릴 때 피해를 입히지 않습니다."
  },
  {
    "id": "rare",
    "name_ko": "희귀",
    "name_en": "rare",
    "type": "mechanic",
    "desc": "이 희귀도는 게임 세계에서 규칙 요소를 찾기가 매우 어렵다는 것을 나타냅니다. 희귀 재주, 주문, 아이템 등은 GM이 게임에 포함하기로 결정한 경우에만 플레이어가 사용할 수 있으며, 일반적으로 플레이 중 발견을 통해 획득할 수 있습니다. 이 특성을 가진 생물은 희귀합니다. 일반적으로 소환할 수 없습니다. 이 생물과 관련된 지식 기억 판정의 DC는 5만큼 증가합니다."
  },
  {
    "id": "ratfolk",
    "name_ko": "랫포크",
    "name_en": "ratfolk",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 렛포크의 혈통입니다."
  },
  {
    "id": "razing",
    "name_ko": "레이징",
    "name_en": "razing",
    "type": "mechanic",
    "desc": "파괴 무기는 물체, 구조물, 전차에 특히 좋은 피해를 줍니다. 파괴 무기로 물체(방패와 움직이는 물체 포함), 구조물, 전차에 피해를 줄 때마다 물체는 무기 피해 주사위 수의 두 배에 해당하는 추가 피해를 받습니다."
  },
  {
    "id": "reach",
    "name_ko": "범위",
    "name_en": "reach",
    "type": "mechanic",
    "desc": "이 특성을 가진 자연 공격은 인접한 생물만 공격하는 대신 나열된 거리까지 멀리 있는 생물을 공격하는 데 사용할 수 있습니다. 이 특성이 있는 무기는 길이가 길며, 인접한 생물만 공격하는 대신 최대 10피트 떨어진 생물까지 공격할 수 있습니다. 이미 무기를 휘두르는 팔다리의 범위가 있는 생물의 경우, 무기의 범위가 5피트 증가합니다."
  },
  {
    "id": "reckless",
    "name_ko": "무모한",
    "name_en": "reckless",
    "type": "mechanic",
    "desc": "무모한 특성이 있는 액션은 조종사가 기체에 대한 통제권을 잃을 위험이 있습니다. 무모한 액션을 수행할 때 파일럿은 먼저 적절한 파일럿 판정을 시도하여 차량 제어권을 유지해야 합니다."
  },
  {
    "id": "recovery",
    "name_ko": "복원",
    "name_en": "recovery",
    "type": "mechanic",
    "desc": "복원 무기는 던진 무기가 목표물을 빗나갔을 때 던진 사람에게 돌아오도록 설계된 무기입니다. 이 무기로 던진 공격이 실패하면, 공격이 완료된 후 무기는 다시 내 손으로 날아와 다시 시도할 수 있습니다. 무기가 돌아올 때 손이 가득 차 있으면 무기는 내 공간의 바닥에 떨어집니다."
  },
  {
    "id": "reflection",
    "name_ko": "리플렉션",
    "name_en": "reflection",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 리플렉션 다재다능한 유산을 가지고 있습니다. 리플렉션은 복제, 평면 복제, 또는 다른 메커니즘을 통해 살아있는 사람의 복사본이 된 존재입니다. 이 특성을 가진 능력은 리플렉션만 사용하거나 선택할 수 있습니다."
  },
  {
    "id": "reincarnated",
    "name_ko": "환생",
    "name_en": "reincarnated",
    "type": "mechanic",
    "desc": "이 조상 피트는 배경 스토리에서 또는 플레이 중에 환생한 적이 한 번 이상 있는 모든 캐릭터가 사용할 수 있습니다."
  },
  {
    "id": "relic",
    "name_ko": "유물",
    "name_en": "relic",
    "type": "mechanic",
    "desc": "유물 특성을 가진 아이템은 착용자와 함께 위력이 증가합니다."
  },
  {
    "id": "reload",
    "name_ko": "재장전",
    "name_en": "reload",
    "type": "mechanic",
    "desc": "모든 무기는 장전하는 데 어느 정도 시간이 필요하지만, 원거리 무기는 장전하고 재장전하는 데도 많은 시간이 필요합니다. 이 항목은 해당 무기를 재장전하는 데 필요한 인터랙트 액션 수를 나타냅니다. 탄약을 뽑는 것과 무기를 발사하는 것이 동일한 액션의 일부인 경우 0이 될 수 있습니다. 아이템 재장전에 2개 이상의 액션이 필요한 경우, GM은 이 액션들을 하나의 활동으로 함께 수행해야 하는지 아니면 한 턴에 일부만 사용하고 나머지는 다음 턴에 사용할 수 있는지를 결정합니다."
  },
  {
    "id": "repeating",
    "name_ko": "리피팅",
    "name_en": "repeating",
    "type": "mechanic",
    "desc": "리피팅 무기는 일반적으로 재장전 시간이 짧은 쇠뇌의 한 유형입니다. 이 무기는 다른 쇠뇌처럼 개별 볼트로 장전할 수 없으며, 특수 탄약이 들어 있는 탄창을 특수 슬롯에 장전해야 합니다. 탄창을 장착하면 무기를 발사할 때마다 탄약이 자동으로 장전되며, 재장전 항목의 값(일반적으로 0)까지 재장전이 줄어듭니다. 탄약이 다 떨어지면 새 탄창을 장전해야 하며, 이를 위해서는 한 손이 자유롭고 3개의 인터랙트 액션(기존 탄창 제거, 새 탄창 가져오기, 새 탄창 제자리에 끼우기)이 필요합니다. 이러한 액션은 연속적으로 수행할 필요는 없습니다."
  },
  {
    "id": "resonant",
    "name_ko": "공명",
    "name_en": "resonant",
    "type": "mechanic",
    "desc": "이 무기는 에너지 피해를 줄 수 있습니다. 공명 무기를 휘두르는 동안 행동 에너지 프리 액션을 얻습니다."
  },
  {
    "id": "revelation",
    "name_ko": "리벨리온",
    "name_en": "revelation",
    "type": "mechanic",
    "desc": "이 특성을 가진 효과는 사물을 있는 그대로 보여줍니다."
  },
  {
    "id": "saggorak",
    "name_ko": "사그고락",
    "name_en": "saggorak",
    "type": "mechanic",
    "desc": "사그고락의 고대 드워프 대장장이들은 놀랍도록 강력한 일련의 룬을 설계했습니다. 전설적인 제작 숙련도를 가진 사람 또는 코블라 도시의 숙련된 드워프 장인만이 사그고락 특성을 가진 룬을 적용, 이전 또는 제거할 수 있습니다. 모든 사그고락 룬은 상당한 위력 때문에 특성 룬 슬롯 두 개를 차지하므로, 최소 +2 강화 룬이 있는 방어구와 무기에만 적용할 수 있습니다."
  },
  {
    "id": "sahkil",
    "name_ko": "사킬",
    "name_en": "sahkil",
    "type": "mechanic",
    "desc": "사킬은 필멸의 생물들에게 공포와 불안감을 퍼뜨리는 것을 즐기는 악마입니다. 이들은 일반적으로 암흑 시야를 가지고 있으며, 공포에 면역이 있고, 선에 약합니다."
  },
  {
    "id": "samsaran",
    "name_ko": "삼사란",
    "name_en": "samsaran",
    "type": "mechanic",
    "desc": "지 하 출신으로 파란 피부를 가진 사람들로서, 죽은 후 환생하며 과거 생애의 일부를 기억하는 종족."
  },
  {
    "id": "sanctified",
    "name_ko": "성화",
    "name_en": "sanctified",
    "type": "mechanic",
    "desc": "당신이 성스럽거나 불경한 경우, 당신의 정화된 행동과 주문은 동일한 특성을 얻습니다."
  },
  {
    "id": "scatter",
    "name_ko": "산탄",
    "name_en": "scatter",
    "type": "mechanic",
    "desc": "이 무기는 넓은 범위의 알갱이 덩어리를 발사합니다. 흩뿌리기에는 항상 분사 반경을 나타내는 영역이 나열되어 있습니다. 적중 시, 분사형 무기를 사용한 공격의 주요 대상은 나열된 피해를 입고, 대상과 그 주위에 나열된 반경 내에 있는 다른 모든 생물은 무기 피해 주사위당 1점의 방사 피해를 입습니다."
  },
  {
    "id": "scroll",
    "name_ko": "스크롤",
    "name_en": "scroll",
    "type": "mechanic",
    "desc": "주문 주문서에는 주문 슬롯 없이 시전할 수 있는 주문이 하나 들어 있습니다."
  },
  {
    "id": "scrying",
    "name_ko": "점술",
    "name_en": "scrying",
    "type": "mechanic",
    "desc": "점술 효과는 자신의 눈과 귀가 아닌 센서나 장치를 사용하여 먼 거리에서 보고, 듣고, 감각 정보를 얻을 수 있게 해줍니다."
  },
  {
    "id": "sea-devil",
    "name_ko": "씨 데빌",
    "name_en": "sea-devil",
    "type": "mechanic",
    "desc": "사악한 바다에 사는 인간형 생물인 바다 악마는 보통 암흑 시야와 파도 감지 능력을 가지고 있습니다."
  },
  {
    "id": "sedacthy",
    "name_ko": "진정제",
    "name_en": "sedacthy",
    "type": "mechanic",
    "desc": "바다에 사는 인간형 생물로, 해양 생물과 소통할 수 있으며, 보통 암흑 시야와 파도 감지 능력을 가지고 있습니다."
  },
  {
    "id": "serpentfolk",
    "name_ko": "서펜트포크",
    "name_en": "serpentfolk",
    "type": "mechanic",
    "desc": "서펀트포크는 뱀 모양의 인간형 생물 종족입니다."
  },
  {
    "id": "shabti",
    "name_ko": "샤브티",
    "name_en": "shabti",
    "type": "mechanic",
    "desc": "샤비티는 죽은 생물의 죄를 대신해 심판을 받기 위해 만들어진 인공 인간형 존재입니다."
  },
  {
    "id": "shade",
    "name_ko": "그늘",
    "name_en": "shade",
    "type": "mechanic",
    "desc": "쉐이드는 심판을 받은 후 다른 차원의 원주민으로 변환된 불멸의 영혼들입니다. 청원자들은 자신의 고향 차원의 기본 환경 효과를 견딜 수 있습니다."
  },
  {
    "id": "shadow",
    "name_ko": "그림자",
    "name_en": "shadow",
    "type": "mechanic",
    "desc": "이 마법에는 그림자 또는 네더월드의 에너지가 사용됩니다."
  },
  {
    "id": "shisk",
    "name_ko": "시스크",
    "name_en": "shisk",
    "type": "mechanic",
    "desc": "지하에 서식하는 뼈의 깃털로 덮인 비밀스러운 휴머노이드입니다."
  },
  {
    "id": "shoony",
    "name_ko": "슈니",
    "name_en": "shoony",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 슈니 혈통의 일원입니다."
  },
  {
    "id": "shove",
    "name_ko": "밀어내기",
    "name_en": "shove",
    "type": "mechanic",
    "desc": "이 무기는 양손이 자유롭지 않아도 운동 기술로 밀기 기술을 사용할 수 있습니다. 이 경우 무기의 사정거리(자신의 사정거리와 다른 경우)를 사용하며, 무기의 아이템 보너스를 운동 기술 판정에 아이템 보너스로 추가하여 공격 굴림에 추가합니다. 무기를 사용하여 밀치기 판정에서 대실패하면 무기를 떨어뜨려 대실패 대신 실패의 효과를 받을 수 있습니다."
  },
  {
    "id": "skeleton",
    "name_ko": "스켈레톤",
    "name_en": "skeleton",
    "type": "mechanic",
    "desc": "이 언데드는 죽은 생물의 해골에 공허의 기운을 불어넣어 만듭니다. 이 특성을 가진 능력은 스켈레톤만 사용하거나 선택할 수 있습니다."
  },
  {
    "id": "skelm",
    "name_ko": "스켈름",
    "name_en": "skelm",
    "type": "mechanic",
    "desc": "이 생물들은 흉악하고 분노에 차 있는 인간 혐오자로, 분노와 증오를 통해 타인을 지배하려 합니다."
  },
  {
    "id": "skill",
    "name_ko": "기술",
    "name_en": "skill",
    "type": "mechanic",
    "desc": "기술 특성이 있는 일반 재주는 기술과 해당 기술의 액션을 향상시키거나 기술에 새로운 액션을 부여합니다. 이 특성을 가진 업적은 클래스가 기술 업적 또는 일반 재주를 획득할 때 선택할 수 있습니다. 기술 특성을 가진 아키타입 재주는 해당 원형의 헌신 재주가 있는 경우 기술 재주 대신 선택할 수 있습니다."
  },
  {
    "id": "skulk",
    "name_ko": "스컬크",
    "name_en": "skulk",
    "type": "mechanic",
    "desc": "스컬크스는 피부 색상을 변화시켜 은밀함을 돕는 인간형 생물 종족입니다."
  },
  {
    "id": "sleep",
    "name_ko": "수면",
    "name_en": "sleep",
    "type": "mechanic",
    "desc": "이 효과는 생물을 잠들게 하거나 졸음을 유발할 수 있습니다."
  },
  {
    "id": "snare",
    "name_ko": "스네어",
    "name_en": "snare",
    "type": "mechanic",
    "desc": "일반적으로 레인저가 만드는 함정인 올무는 전장에서 빠르게 건설하고 사용할 수 있는 특별한 규칙을 따릅니다."
  },
  {
    "id": "social",
    "name_ko": "소셜",
    "name_en": "social",
    "type": "mechanic",
    "desc": "사회적 특성이 있는 액션과 능력은 비질란테가 사회적 신분을 유지하고 있는 동안에만 사용할 수 있습니다."
  },
  {
    "id": "sorcerer",
    "name_ko": "소서러",
    "name_en": "sorcerer",
    "type": "mechanic",
    "desc": "소서러 클래스의 능력을 나타냅니다."
  },
  {
    "id": "soulbound",
    "name_ko": "소울바운드",
    "name_en": "soulbound",
    "type": "mechanic",
    "desc": "이 구조물은 한때 살아있던 생물의 영혼의 파편에 의해 정신적으로 강화되었습니다."
  },
  {
    "id": "spellgun",
    "name_ko": "주문 총",
    "name_en": "spellgun",
    "type": "mechanic",
    "desc": "주문총 특성은 총알처럼 날아가는 마법 효과를 생성할 수 있는 아이템에 나타납니다. 주문 총으로 주문 공격 주사위를 굴리거나 간단한 총기 숙련도를 사용해 원거리 공격 주사위를 굴릴 수 있습니다. 주문 총에는 사거리 증가 효과가 있으며, 이는 어떤 유형의 공격 굴림을 하든 적용됩니다. 단순 총기에 수정치를 사용할 수 있지만, 주문총은 실제로 총기가 아닙니다. 총기 일격의 피해나 치명타 전문화 같은 다른 혜택을 받을 수 없습니다. 마찬가지로 주문 총을 장전하거나 재장전할 수 없으며, 주문 총에 부적을 부착하거나 총기 일격을 가할 수 있는 액션의 일부로 주문 총 일격을 가하는 등의 행동을 할 수 없습니다."
  },
  {
    "id": "spellheart",
    "name_ko": "주문심장",
    "name_en": "spellheart",
    "type": "mechanic",
    "desc": "주문심장은 부적과 유사한 효과를 지닌 영구 아이템입니다. 주문심장 부착하기 활동을 통해 주문심장을 부착할 수 있으며, 그 외에는 부적 부착과 동일합니다. 아이템당 부적 1개 제한은 그대로 유지되며, 아이템에는 주문심장 하나 또는 부적 하나만 부착할 수 있고 둘 다 부착할 수는 없습니다. 주문심장으로 캔트립을 시전할 때는 주문 공격력 주사위를 사용하거나 주문 DC가 더 높을 경우 사용할 수 있습니다. 주문심장을 제작하려면 주문 심장이 시전할 수 있는 주문이 필요합니다. 예를 들어, 주요 다섯 깃털 화환을 만들려면 공중 보행, 강풍 폭발, 바람의 벽이 필요합니다."
  },
  {
    "id": "spellshape",
    "name_ko": "주문형상",
    "name_en": "spellshape",
    "type": "mechanic",
    "desc": "주문형상 액션은 주문의 속성을 변경합니다. 주문형상 액션은 변경하려는 주문을 시전하기 바로 전에 사용해야 합니다. 주문 시전 직후에 주문을 시전하는 것 외에 다른 액션(자유 액션 및 리액션 포함)을 사용하면 주문형상 액션의 이점을 잃게 됩니다. 주문을 시전하기 전에 자신의 턴이 끝나면 이 혜택도 사라집니다. 주문형상 액션으로 추가되는 모든 효과는 주문 효과의 일부이지 주문형상 액션 자체의 일부가 아닙니다."
  },
  {
    "id": "spirit",
    "name_ko": "영혼",
    "name_en": "spirit",
    "type": "mechanic",
    "desc": "이 특성이 있는 효과는 영적 본질을 가진 생물에게 영향을 미칠 수 있으며 영혼 피해를 입힐 수도 있습니다. 이 특성을 가진 생물은 영적 본질로 정의됩니다. 정령 생물은 종종 물질적 형태를 갖지 않습니다."
  },
  {
    "id": "splash",
    "name_ko": "방사",
    "name_en": "splash",
    "type": "mechanic",
    "desc": "방사 특성이 있는 투척 무기를 사용할 때는 피해 굴림에 자신의 근력 수정치를 더하지 않습니다. 방사무기로 공격이 실패하거나, 성공하거나, 대성공하면 대상(대상 포함)으로부터 5피트 이내에 있는 모든 생물이 나열된 방사 피해를 받습니다. 공격이 실패해도(대실패는 아님) 공격 대상은 여전히 방사 피해를 받습니다. 방사 피해는 대상의 약점이나 저항을 적용하기 전에 대상에 대한 초기 피해와 합산합니다. 치명타에 대한 방사 피해는 곱하지 않습니다."
  },
  {
    "id": "splash-10",
    "name_ko": "방사 10 피트",
    "name_en": "splash-10",
    "type": "mechanic",
    "desc": "방사 특성이 있는 투척 무기를 사용할 때는 피해 굴림에 자신의 근력 수정치를 더하지 않습니다. 방사 무기로 공격이 실패하거나, 성공하거나, 대성공하면 대상(대상 포함)으로부터 10피트 이내에 있는 모든 생물이 나열된 방사 피해를 받습니다. 공격이 실패해도(대실패는 아님) 공격 대상은 여전히 방사 피해를 받습니다. 방사 피해는 대상의 약점이나 저항을 적용하기 전에 대상에 대한 초기 피해와 합산합니다. 치명타에 대한 방사 피해는 곱하지 않습니다."
  },
  {
    "id": "spriggan",
    "name_ko": "스프리건",
    "name_en": "spriggan",
    "type": "mechanic",
    "desc": "노움과 친척인 스프리건은 사악한 성향을 가지고 있으며, 거인처럼 커질 수도 있습니다."
  },
  {
    "id": "sprite",
    "name_ko": "스프라이트",
    "name_en": "sprite",
    "type": "mechanic",
    "desc": "프라이멀 마법과 밀접한 관련이 있는 작은 날개 달린 페이족입니다."
  },
  {
    "id": "staff",
    "name_ko": "스태프",
    "name_en": "staff",
    "type": "mechanic",
    "desc": "이 마법 아이템은 특정 테마의 주문을 담고 있으며, 주문 시전자가 지팡이를 준비하여 추가 주문을 시전할 수 있습니다."
  },
  {
    "id": "steam",
    "name_ko": "증기",
    "name_en": "steam",
    "type": "mechanic",
    "desc": "이 특성을 가진 아이템은 물을 끓여 증기를 생성하고 부품을 이동시키는 엔진으로 구동됩니다."
  },
  {
    "id": "stheno",
    "name_ko": "스텐노",
    "name_en": "stheno",
    "type": "mechanic",
    "desc": "스테노는 메두사와 관련된 인간형 생물로, 머리카락 대신 뱀을 가지고 있습니다."
  },
  {
    "id": "strix",
    "name_ko": "스트릭스",
    "name_en": "strix",
    "type": "mechanic",
    "desc": "날개 달린 휴머노이드는 대부분 첼리악스와 그 주변에 서식합니다."
  },
  {
    "id": "structure",
    "name_ko": "구조",
    "name_en": "structure",
    "type": "mechanic",
    "desc": "구조물 특성이 있는 아이템은 활성화하면 마법 건물이나 다른 구조물을 생성합니다. 아이템은 다른 구조물이 없는 대지에서 활성화해야 합니다. 구조물은 자연 지형에 적응하여 그곳에 건설할 수 있는 구조 요구 조건을 적용합니다. 구조물은 연못이나 바위 첨탑과 같은 작은 특징을 중심으로 조정되지만, 물이나 기타 단단한 표면에는 생성할 수 없습니다. 눈, 모래 언덕 또는 아래에 단단한 표면이 있는 기타 부드러운 표면에서 활성화하면 구조물의 기초(있는 경우)가 단단한 지면에 닿게 됩니다. 이 특성이 있는 아이템이 늪이나 지진이 자주 발생하는 지역처럼 단단하지만 불안정한 표면에서 활성화되면 매일 평탄 DC 3을 굴려 실패하면 구조물이 가라앉거나 붕괴하기 시작합니다. 구조물이 나타날 때 해당 지역 내의 생물에게는 해를 끼치지 않으며, 군중이나 인구 밀집 지역에는 구조물을 만들 수 없습니다. 아이템이 활성화되었을 때 실수로 구조물 안에 갇힌 생명체는 전체 구조물 안에서 무사히 탈출할 수 있으며, 항상 탈출 경로가 명확합니다. 활성화가 종료될 때 구조물 안에 있던 생명체는 해를 입지 않으며, 구조물의 위층에 있었다면 무사히 바닥에 떨어집니다."
  },
  {
    "id": "subjective-gravity",
    "name_ko": "주관적 중력",
    "name_en": "subjective-gravity",
    "type": "mechanic",
    "desc": "모든 질량을 가진 물체는 동일한 힘으로 중력의 중심이 될 수 있지만, 지각이 없는 생물이 의지를 발휘한 경우에만 가능합니다. 무인 물건, 사물 및 지각이 없는 생물은 평면을 미세 중력이 있는 것으로 취급합니다. 주관적 중력이 있는 평면상의 생물은 발 근처에 ‘아래'를 상상함으로써 고체 표면에서 정상적으로 이동할 수 있습니다. 이 아래 방향을 지정하는 것은 집중 특성을 가진 무료 행동입니다. 공중에 떠 있는 생물은 '아래’ 방향을 선택하고 그 방향으로 떨어지며, 속도나 비행 속도로 위로 이동함으로써 비행과 유사한 움직임을 재현할 수 있습니다. 이 가짜 비행은 비행 행동을 사용합니다."
  },
  {
    "id": "subtle",
    "name_ko": "미묘한",
    "name_en": "subtle",
    "type": "mechanic",
    "desc": "미묘한 특성을 가진 주문은 주문 없이 시전할 수 있으며 뚜렷한 효과가 나타나지 않습니다."
  },
  {
    "id": "suli",
    "name_ko": "술리",
    "name_en": "suli",
    "type": "mechanic",
    "desc": "술리는 지니의 후손인 차원 자손입니다."
  },
  {
    "id": "summoned",
    "name_ko": "소환됨",
    "name_en": "summoned",
    "type": "mechanic",
    "desc": "주문 또는 효과에 의해 호출된 생물은 소환된 특성을 얻습니다. 소환된 생물은 다른 생물을 소환하거나, 가치 있는 물건을 만들거나, 비용이 필요한 주문을 시전할 수 없습니다. 하수인 특성이 있습니다. 소환된 생물이 자신을 소환한 주문과 같거나 더 높은 등급의 주문을 시전하려고 하면, 소환 마법을 무력화하여 자신의 주문이 실패하고 소환 주문이 종료됩니다. 그렇지 않으면, 소환된 생물은 같은 종류의 생물에 대한 표준 능력을 사용합니다. 소환된 생물은 일반적으로 최선을 다해 적을 공격합니다. 소환수와 의사소통이 가능하다면 소환수에게 명령을 내릴 수 있지만, 소환수가 당신의 명령을 얼마나 따를지는 GM이 결정합니다. 주문 시전이 끝나는 즉시, 소환된 생물은 해당 턴에 자신의 액션 2장을 사용합니다. 소환된 생물로부터 생성된 스폰 또는 다른 생물은 소환된 생물이 사라진 후 변경되지 않은 상태(스폰의 경우 보통 시체)로 돌아갑니다. 이 상태가 무엇인지 불분명할 경우, GM이 결정합니다. 소환된 생물은 다양한 주문과 효과에 의해 추방될 수 있습니다. HP가 0으로 감소하거나 소환한 주문이 끝나면 자동으로 추방됩니다."
  },
  {
    "id": "summoner",
    "name_ko": "소환사",
    "name_en": "summoner",
    "type": "mechanic",
    "desc": "소환사 클래스의 능력을 나타냅니다."
  },
  {
    "id": "surki",
    "name_ko": "수르키",
    "name_en": "surki",
    "type": "mechanic",
    "desc": "수르키는 지하에 서식하는 곤충형 조상 종으로, 주변의 마법을 흡수하여 독특한 적응력을 진화시킨 종입니다."
  },
  {
    "id": "swarm",
    "name_ko": "스웜",
    "name_en": "swarm",
    "type": "mechanic",
    "desc": "무리는 하나의 몬스터로 기능하는 생물들의 집합체 또는 구름입니다. 크기는 전체 집합체의 크기를 나타내지만, 대부분의 무리에서 집합체를 구성하는 개별 생물들은 크기가 매우 작습니다. 무리는 다른 생물들과 동일한 공간을 차지할 수 있으며, 피해를 주는 행동을 사용하려면 그렇게 해야 합니다. 스웜은 일반적으로 영역에 피해를 주는 효과(영역 주문 및 방사 무기 등)에 약합니다. 스웜은 그래플링, 엎드린 상태, 구속 상태에 면역입니다."
  },
  {
    "id": "swashbuckler",
    "name_ko": "스워시버클러",
    "name_en": "swashbuckler",
    "type": "mechanic",
    "desc": "스워시버클러 클래스의 능력을 나타냅니다."
  },
  {
    "id": "sweep",
    "name_ko": "스윕",
    "name_en": "sweep",
    "type": "mechanic",
    "desc": "이 무기는 넓게 휘두르거나 회전하는 공격을 하므로 여러 적을 쉽게 공격할 수 있습니다. 이 무기로 공격할 때, 이 무기로 이번 턴에 이미 다른 대상을 공격했다면 공격 주사위에 상황 보너스 +1을 받습니다."
  },
  {
    "id": "sylph",
    "name_ko": "실프",
    "name_en": "sylph",
    "type": "mechanic",
    "desc": "공기 차원에서 온 존재의 후손인 지니킨의 일종입니다."
  },
  {
    "id": "talisman",
    "name_ko": "탈리스만",
    "name_en": "talisman",
    "type": "mechanic",
    "desc": "부적은 갑옷, 방패 또는 무기에 부착하는 작은 물체(부착 아이템이라고 함)입니다. 부착된 부적을 활성화하려면 아이템을 휘두르거나 착용하고 있어야 합니다. 부적이 활성화되면 영구적으로 소멸됩니다."
  },
  {
    "id": "talos",
    "name_ko": "탈로스",
    "name_en": "talos",
    "type": "mechanic",
    "desc": "탈로스는 주라의 후손인 차원 자손입니다."
  },
  {
    "id": "tandem",
    "name_ko": "탠덤",
    "name_en": "tandem",
    "type": "mechanic",
    "desc": "이 특성이 있는 액션은 자신과 에이돌론이 함께 행동하는 것입니다. 자신이나 에이돌론 중 한 명이 행동할 수 없거나, 에이돌론을 발현하지 않았거나, 에이돌론이 별도의 개체가 아닌 방식으로 발현한 경우(예: 에이돌론에 녹아들기 재주)에는 탠덤 액션을 사용할 수 없습니다. 탠덤 액션을 사용하면 자신과 에이돌론이 각각 별도의 액션을 취할 수 있지만, 이는 반드시 자신과 에이돌론이 각각 따로 취하는 액션이어야 하며, 탠덤 액션을 사용하여 다른 탠덤 액션을 취할 수 없습니다."
  },
  {
    "id": "tane",
    "name_ko": "테인",
    "name_en": "tane",
    "type": "mechanic",
    "desc": "타네는 첫 번째 세계의 가장 오래된 존재에 의해 수억 년 전에 창조된 강력한 생물체입니다. 모든 타네는 자신이 속한 차원을 자신의 고향 차원으로 여깁니다."
  },
  {
    "id": "tanggal",
    "name_ko": "탕갈",
    "name_en": "tanggal",
    "type": "mechanic",
    "desc": "이 식인성 변종 종족은 사냥 중 몸체를 두 조각으로 분리할 수 있는 다양한 인간형 생물들로 구성되어 있습니다."
  },
  {
    "id": "tattoo",
    "name_ko": "타투",
    "name_en": "tattoo",
    "type": "mechanic",
    "desc": "문신은 동물의 피부에 그리거나 자르는 일종의 아이템으로, 일반적으로 이미지나 상징의 형태를 취합니다."
  },
  {
    "id": "tea",
    "name_ko": "차",
    "name_en": "tea",
    "type": "mechanic",
    "desc": "마법의 차는 일종의 물약입니다. 마시면 활성화되어 물약이 소진됩니다. 마법 차에는 물약과 차의 특성이 있습니다. 마법 차를 제작할 때 공급하는 원료는 특이하고 값비싼 찻잎의 형태입니다. 마법 차를 만드는 과정에는 찻잎에 마법 시약을 주입하고, 물을 정화하고, 차를 물에 담그는 과정이 포함되며, 그 결과 특별한 맛의 물약이 만들어집니다. 마법의 차를 마실 때 상호작용 액션으로 활성화하거나 다른 생물에게 먹이면 물약처럼 마법의 차를 활성화할 수 있습니다. 또한, 10분의 활동으로 마법의 차를 활성화할 수 있는데, 이 활동은 최대 4명이 동시에 공유할 수 있는 고급 다기(장인의 도구)를 사용해 차를 준비한 다음 짧은 다도를 통해 차를 마시거나 누군가에게 선물하면 마법의 차의 효과가 시작되며, 이 방법으로 마법의 차를 활성화하면 각 항목의 다도에 설명된 대로 효과가 강화됩니다. 마법의 차를 한 번 마시면 24시간 동안 해당 마법의 차에 일시적으로 면역이 됩니다."
  },
  {
    "id": "tearing",
    "name_ko": "찢어짐",
    "name_en": "tearing",
    "type": "mechanic",
    "desc": "이 무기는 구부러진 이빨로 가장자리가 날카로워 출혈을 일으키는 상처를 남깁니다. 이 무기로 생물을 공격하면 추가적으로 1의 지속 출혈 피해가 발생합니다. 이 무기에 더 큰 타격 룬이 장착되어 있으면 지속 출혈 피해가 2로 증가합니다."
  },
  {
    "id": "tech",
    "name_ko": "기술",
    "name_en": "tech",
    "type": "mechanic",
    "desc": "이 특성을 가진 아이템은 누메리아의 기술과 관련이 있습니다."
  },
  {
    "id": "telepathy",
    "name_ko": "텔레파시",
    "name_en": "telepathy",
    "type": "mechanic",
    "desc": "텔레파시를 가진 생명체는 다른 생명체와 정신적으로 소통할 수 있습니다. 그렇다고 해서 상대의 생각에 특별히 접근할 수 있는 것은 아니며, 일반적인 말보다 더 많은 정보를 전달할 수는 없습니다."
  },
  {
    "id": "teleportation",
    "name_ko": "순간이동",
    "name_en": "teleportation",
    "type": "mechanic",
    "desc": "순간이동 효과는 공간의 한 지점에서 다른 지점으로 순간적으로 이동할 수 있게 해줍니다. 텔레포트는 일반적으로 움직임에 따른 리액션을 트리거하지 않습니다."
  },
  {
    "id": "tengu",
    "name_ko": "텐구",
    "name_en": "tengu",
    "type": "mechanic",
    "desc": "이 특성을 가진 생물은 텐구 조상의 일원입니다. 텐구는 새를 닮은 휴머노이드입니다. 이 특성을 가진 능력은 텐구만 사용하거나 선택할 수 있습니다. 이 특성을 가진 아이템은 텐구만이 생성하고 사용합니다."
  },
  {
    "id": "tethered",
    "name_ko": "테더링",
    "name_en": "tethered",
    "type": "mechanic",
    "desc": "이 무기는 긴 밧줄이나 사슬에 연결되어 있어 무기가 손에서 떨어졌을 때 되찾을 수 있습니다. 이 무기를 휘두르는 동안 한 손이 자유롭다면, 원거리 공격으로 무기를 던진 후 또는 무기가 해제된 후 (다른 생물이 들고 있지 않는 한) 상호작용 액션을 사용하여 무기를 다시 잡을 수 있습니다."
  },
  {
    "id": "thaumaturge",
    "name_ko": "쏘마터지",
    "name_en": "thaumaturge",
    "type": "mechanic",
    "desc": "이것은 쏘마터지 클래스의 능력을 나타냅니다."
  },
  {
    "id": "thrown",
    "name_ko": "던지기",
    "name_en": "thrown",
    "type": "mechanic",
    "desc": "이 무기는 원거리 공격으로 던질 수 있습니다. 던진 무기는 근접 무기와 마찬가지로 공격력에 근력 수정치가 추가됩니다. 이 특성이 근접 무기에 나타나면 사거리 증가 효과도 포함됩니다."
  },
  {
    "id": "time",
    "name_ko": "시간",
    "name_en": "time",
    "type": "mechanic",
    "desc": "시간 생물은 시간 차원의 원주민이다. 그들은 늙지 않으며, 초자연적인 갈망에 사로잡힌 개체도 있지만 생존을 위해 먹거나 마실 필요가 없다. 그들은 시간 차원의 기본적인 환경적 영향 속에서도 생존할 수 있다."
  },
  {
    "id": "titan",
    "name_ko": "티탄",
    "name_en": "titan",
    "type": "mechanic",
    "desc": "타이탄은 신에 가까운 힘을 지닌 거대한 원시적 생물로, 인간 종족보다 훨씬 오래 전에 존재해 왔습니다."
  },
  {
    "id": "training",
    "name_ko": "교육",
    "name_en": "training",
    "type": "mechanic",
    "desc": "훈련 무기는 동물이 공격할 대상을 식별하여 전투에 참여하도록 훈련시킬 때 사용합니다. 훈련 무기로 생물을 공격하면 동반자 또는 반려 동물이 해당 대상에 대한 다음 공격 굴림에 +1 상황 보너스를 받습니다."
  },
  {
    "id": "transcendence",
    "name_ko": "초월",
    "name_en": "transcendence",
    "type": "mechanic",
    "desc": "초월은 모범의 신성한 불꽃의 힘을 그들의 아이콘 중 하나를 통해 전달하여 인간을 초월하고 기적적인 행위를 수행합니다. 각 아이콘은 ‘초월’ 특성을 가진 행동을 가지고 있으며, 이를 사용하는 것을 '스파크 초월'이라고 합니다. 이 행동을 사용하려면, 신성한 불꽃이 그 아이콘에 힘을 부여하고 있어야 하며, 아이콘을 사용할 준비가 되어 있어야 합니다(일반적으로 무기 아이콘을 들고 있거나 착용한 아이콘을 착용하고 있어야 함). 초월을 발동한 직후, 신성한 불꽃이 그 아이콘에서 강제로 배출되어, 당신이 선택한 다른 아이콘에 머무르게 됩니다. 초월은 라운드당 한 번만 발동할 수 있습니다. 신성한 불꽃에서 발동된 초월 행동은 신성한 특성을 가지고 있습니다."
  },
  {
    "id": "trap",
    "name_ko": "함정",
    "name_en": "trap",
    "type": "mechanic",
    "desc": "이 특성을 가진 위험물이나 아이템은 침입자를 방해하도록 제작됩니다."
  },
  {
    "id": "troll",
    "name_ko": "트롤",
    "name_en": "troll",
    "type": "mechanic",
    "desc": "트롤은 거대하고 야만적인 생물로서, 무생물 재료로 변신하는 것으로 유명합니다."
  },
  {
    "id": "troop",
    "name_ko": "부대",
    "name_en": "troop",
    "type": "mechanic",
    "desc": "부대는 일반적으로 소형 또는 중형 크기의 구성 생물들로 조직된 집단으로, 응집력 있는 전체로 작동합니다. 충분한 공격을 받거나 동료들이 쓰러지면 부대의 크기가 줄어듭니다. 부대는 일반적으로 부대 방어력과 부대 이동 능력을 가지고 있으며, 대부분의 부대는 면적 피해와 방사 피해에 약합니다. 여러 개의 개별 생물들로 구성되어 있기 때문에 소환할 수 없습니다."
  },
  {
    "id": "true-name",
    "name_ko": "진명",
    "name_en": "true-name",
    "type": "mechanic",
    "desc": "특정 주문, 재주, 아이템에는 실명 특성이 있습니다. 이 특성은 해당 생물의 실제 이름을 알아야만 사용할 수 있다는 뜻입니다."
  },
  {
    "id": "twin",
    "name_ko": "트윈",
    "name_en": "twin",
    "type": "mechanic",
    "desc": "이 무기는 한 쌍으로 사용하며 서로를 보완합니다. 쌍둥이 무기로 공격할 때, 이번 턴에 같은 종류의 다른 무기로 공격한 적이 있다면 무기의 피해 주사위 수와 같은 상황 보너스를 피해 주사위에 추가합니다. 이 특성의 혜택을 받으려면 무기의 종류가 같아야 하지만, 같은 룬을 사용할 필요는 없습니다."
  },
  {
    "id": "two-hand",
    "name_ko": "양손",
    "name_en": "two-hand",
    "type": "mechanic",
    "desc": "이 무기는 양손으로 휘두를 수 있습니다. 이렇게 하면 무기 공격력이 표시된 값으로 변경됩니다. 이 변화는 일격 룬으로 인한 피해 등 무기의 모든 피해 주사위에 적용됩니다."
  },
  {
    "id": "uncommon",
    "name_ko": "비일상",
    "name_en": "uncommon",
    "type": "mechanic",
    "desc": "드문 희귀성은 특별한 훈련이 필요하거나 특정 문화권 또는 세계의 일부에서 유래한 것입니다. 일부 캐릭터 선택에 따라 희귀 옵션에 접근할 수 있으며, GM은 누구나 접근할 수 있도록 허용할 수 있습니다. 드문 생물은 일반 생물에 비해 알려진 정보가 적습니다. 일반적으로 소환할 수 없습니다. 이 생물과 관련된 지식 기억 판정의 DC는 2만큼 증가합니다."
  },
  {
    "id": "undead",
    "name_ko": "언데드",
    "name_en": "undead",
    "type": "mechanic",
    "desc": "살아 있던 이 생물들은 죽은 후 공허의 기운과 영혼을 타락시키는 부정한 마법을 주입받습니다. HP가 0으로 감소하면 언데드 생물은 파괴됩니다. 언데드 생물은 생명력 에너지로 피해를 받고 공허 에너지로 치유되며, 생명력 치유 효과의 혜택을 받지 못합니다."
  },
  {
    "id": "undine",
    "name_ko": "운디네",
    "name_en": "undine",
    "type": "mechanic",
    "desc": "물의 차원에서 온 존재의 후손인 지니킨의 일종입니다."
  },
  {
    "id": "unholy",
    "name_ko": "불경한",
    "name_en": "unholy",
    "type": "mechanic",
    "desc": "불경한 특성을 가진 효과는 잔인함과 죄악의 강력한 마법과 관련이 있습니다. 성스러운 생물에게 더 강력한 효과를 주는 경우가 많습니다. 이 특성을 가진 생물은 부정한 목적에 강하게 헌신하며, 종종 성스러운 것에 약합니다. 부정한 것에 약점을 가진 생물이 불경한 아이템이나 효과를 사용하면 그 약점으로 인해 피해를 받습니다."
  },
  {
    "id": "unique",
    "name_ko": "고유",
    "name_en": "unique",
    "type": "mechanic",
    "desc": "이 특성을 가진 규칙 요소는 유일무이합니다. 이 특성을 가진 생물과 관련된 지식 회상 판정의 DC가 10 증가합니다."
  },
  {
    "id": "unstable",
    "name_ko": "불안정",
    "name_en": "unstable",
    "type": "mechanic",
    "desc": "불안정한 액션은 본인도 완전히 예측할 수 없는 혁신의 실험적 기능에 의존합니다. 혁신에 불안정한 액션을 사용한 후 다른 액션을 사용하는 것은 위험합니다."
  },
  {
    "id": "urdefhan",
    "name_ko": "우르데판",
    "name_en": "urdefhan",
    "type": "mechanic",
    "desc": "우르데프한스는 악마와 계약을 맺은 인간형 생물로, 투명한 피부를 가지고 있으며 피를 마십니다."
  },
  {
    "id": "vampire",
    "name_ko": "뱀파이어",
    "name_en": "vampire",
    "type": "mechanic",
    "desc": "피에 굶주린 언데드 생물인 뱀파이어는 다재다능하고 파괴하기 어려운 것으로 악명 높습니다."
  },
  {
    "id": "vanara",
    "name_ko": "바나라",
    "name_en": "vanara",
    "type": "mechanic",
    "desc": "영장류와 같은 특징과 날카로운 꼬리를 가진 호기심 많은 조상입니다."
  },
  {
    "id": "vehicular",
    "name_ko": "차량용",
    "name_en": "vehicular",
    "type": "mechanic",
    "desc": "차량용 무기는 차량에 부착하거나 탈것에 착용하며, 일반적으로 차량 운전자 또는 탈것의 주 탑승자만 사용할 수 있습니다. 운전자 또는 탑승자는 차량을 조종하거나 탈것을 안내할 때 사용하는 것과 같은 손으로 차량 무기를 제어할 수 있습니다. 차량 무기는 조작 장치(일반적으로 탈것의 고삐 또는 차량의 조향 장치)를 착용자의 손에서 떼어내면 무장 해제할 수 있습니다."
  },
  {
    "id": "velstrac",
    "name_ko": "벨스트렉",
    "name_en": "velstrac",
    "type": "mechanic",
    "desc": "그림자 차원에서 온 악마의 일족으로, 고통과 고난과 연관된 존재들입니다. 모든 벨스트렉은 어떤 형태의 끔찍한 시선을 지니고 있습니다."
  },
  {
    "id": "venomous",
    "name_ko": "유독한",
    "name_en": "venomous",
    "type": "mechanic",
    "desc": "이 무기는 타격할 때마다 독을 주입합니다. 이 무기로 생물을 타격하면 1의 지속 독 피해가 추가로 발생합니다. 이 무기에 더 큰 타격 룬이 장착되어 있으면 지속 독 피해가 2로 증가합니다."
  },
  {
    "id": "versatile",
    "name_ko": "다용도",
    "name_en": "versatile",
    "type": "mechanic",
    "desc": "다목적 무기는 피해 항목에 나열된 것과는 다른 유형의 피해를 입히는 데 사용할 수 있습니다. 이 특성은 대체 피해 유형을 나타냅니다. 예를 들어, 다용도 S인 관통 무기는 관통 또는 베기 피해를 주는 데 사용할 수 있습니다. 공격할 때마다 피해 유형을 선택합니다."
  },
  {
    "id": "vigilante",
    "name_ko": "비질란테",
    "name_en": "vigilante",
    "type": "mechanic",
    "desc": "클래스 피트와 자경단 피트는 자경단 신분과 관련이 있으며, 사회 신분으로 활동하는 동안 이러한 피트를 사용하면 자경단 신분이 드러날 위험이 있습니다. 신분이 공개되면, 자신을 위장하는 데에 대한 자경단 헌신의 이점을 잃게 되지만, 1주간의 다운타임을 사용하여 새로운 사회 신분을 만들 수 있습니다."
  },
  {
    "id": "virulent",
    "name_ko": "바이러스성",
    "name_en": "virulent",
    "type": "mechanic",
    "desc": "독성 특성을 가진 고통은 제거하기가 더 어렵습니다. 두 번 연속으로 저항에 성공해야 독성 괴물의 단계가 1 감소하며, 대성공하면 독성 고통의 단계가 2가 아닌 1만 감소합니다."
  },
  {
    "id": "vishkanya",
    "name_ko": "비쉬카야",
    "name_en": "vishkanya",
    "type": "mechanic",
    "desc": "뱀과 같은 특징과 강력한 독을 가진 혈통입니다."
  },
  {
    "id": "visual",
    "name_ko": "시각",
    "name_en": "visual",
    "type": "mechanic",
    "desc": "시각 효과는 볼 수 있는 생물에게만 영향을 줄 수 있습니다. 이는 GM이 결정한 대로 효과의 눈에 보이는 부분에만 적용됩니다."
  },
  {
    "id": "volley",
    "name_ko": "발리",
    "name_en": "volley",
    "type": "mechanic",
    "desc": "이 원거리 무기는 가까운 거리에서는 효과가 떨어집니다. 나열된 범위 내의 거리에 있는 대상에 대한 공격은 -2의 페널티를 받습니다."
  },
  {
    "id": "wand",
    "name_ko": "완드",
    "name_en": "wand",
    "type": "mechanic",
    "desc": "완드에는 하루에 한 번 시전할 수 있는 주문이 하나 들어 있습니다."
  },
  {
    "id": "wandering",
    "name_ko": "떠도는",
    "name_en": "wandering",
    "type": "mechanic",
    "desc": "방랑은 특정 유형의 유령에 적응한 애니미스트의 특기를 식별합니다. 이 특기를 선택하려면, 선택 시 전제 조건에 맞는 유령에 적응해야 하며, 그 특정 유령과의 유대 관계에서 얻은 지식과 능력을 나타냅니다. 일일 준비를 할 때, 교환한 특기를 배웠을 때의 레벨에서 사용할 수 있는 다른 방랑 특기로 알고 있는 방랑 특기를 재훈련할 수 있습니다 (평소와 같이, 더 낮은 레벨의 방랑 특기도 포함). 새로운 특기의 다른 전제 조건을 모두 충족해야 합니다."
  },
  {
    "id": "wayang",
    "name_ko": "와양",
    "name_en": "wayang",
    "type": "mechanic",
    "desc": "네더월드에 사는 작은 민족. 어스폴 이후 골라리온으로 이주했다."
  },
  {
    "id": "werecreature",
    "name_ko": "웨어크리처",
    "name_en": "werecreature",
    "type": "mechanic",
    "desc": "이 변신 생물들은 동물형, 인간형, 그리고 하이브리드 형태 사이를 자유롭게 변신할 수 있습니다."
  },
  {
    "id": "whetstone",
    "name_ko": "연마석",
    "name_en": "whetstone",
    "type": "mechanic",
    "desc": "마법으로 강화된 소모품으로, 무기의 효과를 높이기 위해 설계된 연마석입니다."
  },
  {
    "id": "wight",
    "name_ko": "와이트",
    "name_en": "wight",
    "type": "mechanic",
    "desc": "와이트는 생명을 흡수하는 언데드 생물이며, 무덤을 지키고 있는 존재입니다."
  },
  {
    "id": "wild-hunt",
    "name_ko": "와일드 헌트",
    "name_en": "wild-hunt",
    "type": "mechanic",
    "desc": "야생 사냥 특성을 가진 생물은 14레벨 이하가 아닙니다. 향상된 암흑 시야, 녹색 시력, 차원 적응, 야생 시선, 본능적 협력, 콜드 아이언에 약함, 동식물과의 대화 능력, 고유한 야생 사냥 고리를 가지고 있습니다."
  },
  {
    "id": "witch",
    "name_ko": "마녀",
    "name_en": "witch",
    "type": "mechanic",
    "desc": "마녀 클래스의 능력을 나타냅니다."
  },
  {
    "id": "wizard",
    "name_ko": "위자드",
    "name_en": "wizard",
    "type": "mechanic",
    "desc": "위자드 클래스의 능력을 나타냅니다."
  },
  {
    "id": "wood",
    "name_ko": "목재",
    "name_en": "wood",
    "type": "mechanic",
    "desc": "나무 특성을 가진 효과는 나무를 소환하거나 조작합니다. 나무를 조종하는 효과는 나무가 없는 지역에서는 효과가 없습니다. 이 특성을 가진 생물은 주로 나무로 이루어져 있거나 마법의 나무와 관련이 있습니다."
  },
  {
    "id": "wraith",
    "name_ko": "레이쓰",
    "name_en": "wraith",
    "type": "mechanic",
    "desc": "와이트는 공허의 에너지로 충만해져 모든 생명에 대한 증오로 움직이는 무형의 불사체입니다."
  },
  {
    "id": "wyrwood",
    "name_ko": "와이어우드",
    "name_en": "wyrwood",
    "type": "mechanic",
    "desc": "Wyrwood는 나무로 만들어지고 에온 스톤이나 유사한 마법의 돌로 구동되는 작은 지각 있는 생명체입니다."
  },
  {
    "id": "xulgath",
    "name_ko": "줄가스",
    "name_en": "xulgath",
    "type": "mechanic",
    "desc": "이 지하에 사는 파충류 생물들은 어둠을 볼 수 있고 냄새가 매우 나쁘다."
  },
  {
    "id": "zombie",
    "name_ko": "좀비",
    "name_en": "zombie",
    "type": "mechanic",
    "desc": "이 언데드는 살아있는 살을 갈망하는 무의식적인 썩은 시체들입니다."
  }
];

// ═══════════════════════════════════════════════
//  PREREQ_GROUPS — FEAT_DB.prereq_group_id 1:N 정규화 (v528~)
//  같은 group_id 행 = 묶인 조건. logic=and(모두) / or(하나)
//  type: 능력치 enum / SKILLS.id / perception / lore / feat / ancestry / heritage / subclass / vision
// ═══════════════════════════════════════════════
const PREREQ_GROUPS = []; // v0.x~ dead — 선행조건 정본=prereqs_db.js(PREREQ_STRUCT). FEAT_DB.prereq_group_id 미설정으로 도달불가(가드 유지용 빈 배열).

// ═══════════════════════════════════════════════
//  EFFECT_GROUPS — FEAT_DB.effect_group_id 1:N 정규화 (v532~ Phase 3a)
//  공통 효과 + 옵션별 효과 (choiceEffects)를 단일 테이블에 통합.
//  group_id 패턴: eg-{feat.id} (공통) / eg-{feat.id}-{option.id} (옵션별)
//  컬럼: group_id, type, target (식별자 통합 — skill/spell/feat/action/weapon_name/vision/sense/save),
//        value, bonus_type, condition, tradition, ... (sparse)
//  weapons 배열은 행 펼침 (한 그룹에 weapon_familiarity 행 N개).
//  NOTE: display_note/damage_note는 FEAT_DB.auto_note/damage_note 컬럼으로 흡수.
// ═══════════════════════════════════════════════
const EFFECT_GROUPS = []; // v0.28~ 효과 단일화로 제거 — 정본=effects_db.js(build_effects.mjs). getEffectRows는 EFFECTS_DB[slug] 사용.

// ═══════════════════════════════════════════════
//  CHOICE_OPTIONS — FEAT_DB.choice_id 1:N 정규화 (v532~ Phase 3a)
//  옵션 행: choice_id, option_id, option_name, effect_group_id, is_default
//  custom + skill_defaults type만 옵션 행 보유.
//  나머지 type (skill/lore/spell_cantrip/spell_rank/feat_pick/weapon_pick/ancestry_pick/muse_pick/skill_fixed/skill_multi)은
//  런타임 쿼리(filter 메타 활용) — 옵션 행 없음.
// ═══════════════════════════════════════════════
const CHOICE_OPTIONS = []; // v0.28~ 제거 — choice는 effects_db.js EFFECTS_DB[slug].choice 로 통합.




const CONDITIONS_DATA = [
  {
    "id": "blinded",
    "name": "눈멈",
    "en": "Blinded",
    "valued": false,
    "desc": "시각 완전 상실. 시각 기반 판정 자동 대실패. 대상 지정 시 DC 11 단순 판정 필요."
  },
  {
    "id": "broken",
    "name": "파손됨",
    "en": "Broken",
    "valued": false,
    "desc": "아이템 HP가 파손 기준값 이하. 무기 -2 공격, 갑옷은 AC 보너스 절반."
  },
  {
    "id": "clumsy",
    "name": "둔함",
    "en": "Clumsy",
    "valued": true,
    "desc": "민첩 기반 판정/DC에 상태 페널티 = 서투름 수치. AC(민첩), 반사 내성에도 적용.",
    "max": 4
  },
  {
    "id": "concealed",
    "name": "은폐",
    "en": "Concealed",
    "valued": false,
    "desc": "잘 보이지 않음. 공격 시 DC 5 단순 판정 필요."
  },
  {
    "id": "confused",
    "name": "혼란",
    "en": "Confused",
    "valued": false,
    "desc": "행동 제어 불가. 무작위로 행동(공격, 이동 등). 매 턴 종료 시 의지 굴림으로 탈출 가능."
  },
  {
    "id": "controlled",
    "name": "지배됨",
    "en": "Controlled",
    "valued": false,
    "desc": "다른 생물이 당신의 행동을 완전히 지배함."
  },
  {
    "id": "dazzled",
    "name": "눈부심",
    "en": "Dazzled",
    "valued": false,
    "desc": "시각 기반 대상이 은폐 취급."
  },
  {
    "id": "deafened",
    "name": "귀먹음",
    "en": "Deafened",
    "valued": false,
    "desc": "청각 상실. 청각 기반 판정 자동 대실패. 음성 주문 시전 불가."
  },
  {
    "id": "doomed",
    "name": "파멸",
    "en": "Doomed",
    "valued": true,
    "desc": "빈사 판정 DC가 파멸 수치만큼 증가. 휴식마다 1 감소.",
    "max": 3
  },
  {
    "id": "drained",
    "name": "생명력 고갈",
    "en": "Drained",
    "valued": true,
    "desc": "건강 기반 판정에 상태 페널티 = 탈진 수치. 최대 HP도 감소.",
    "max": 4
  },
  {
    "id": "dying",
    "name": "빈사",
    "en": "Dying",
    "valued": true,
    "desc": "생사의 기로. 매 턴 회복 굴림. 0이 되면 의식불명, 4가 되면 사망.",
    "max": 4
  },
  {
    "id": "enfeebled",
    "name": "약화됨",
    "en": "Enfeebled",
    "valued": true,
    "desc": "근력 기반 판정/피해에 상태 페널티 = 약화 수치.",
    "max": 4
  },
  {
    "id": "charmed",
    "name": "매혹",
    "en": "Charmed",
    "valued": false,
    "desc": "특정 생물에게 우호적 감정을 느낌. 그 생물을 해치는 행동에 제한."
  },
  {
    "id": "fatigued",
    "name": "피로",
    "en": "Fatigued",
    "valued": false,
    "desc": "모든 판정/DC에 -1 상황 페널티. 방어구 착용 중 이동 속도 5피트 감소. 휴식 후 해제."
  },
  {
    "id": "off-guard",
    "name": "무방비",
    "en": "Off-Guard",
    "valued": false,
    "desc": "AC에 -2 상황 페널티. 협공, 넘어짐, 은신 공격 등으로 발생."
  },
  {
    "id": "fleeing",
    "name": "도주",
    "en": "Fleeing",
    "valued": false,
    "desc": "매 턴 최대한 멀리 이동 필수. 다른 행동 불가."
  },
  {
    "id": "friendly",
    "name": "우호적",
    "en": "Friendly",
    "valued": false,
    "desc": "당신에게 우호적. 요청에 응할 가능성 높음."
  },
  {
    "id": "frightened",
    "name": "공포",
    "en": "Frightened",
    "valued": true,
    "desc": "모든 판정/DC에 상태 페널티 = 공포 수치. 매 턴 종료 시 1 감소.",
    "max": 4
  },
  {
    "id": "grabbed",
    "name": "붙잡힘",
    "en": "Grabbed",
    "valued": false,
    "desc": "이동 속도 0. 탈출 행동으로 종료 가능."
  },
  {
    "id": "helpful",
    "name": "도움",
    "en": "Helpful",
    "valued": false,
    "desc": "당신을 돕기를 원함. 도움 요청 성공 가능성 높음."
  },
  {
    "id": "hidden",
    "name": "숨겨짐",
    "en": "Hidden",
    "valued": false,
    "desc": "존재는 알려졌지만 위치 모름. 발견하려면 DC 9 단순 판정 필요."
  },
  {
    "id": "immobilized",
    "name": "이동 불가",
    "en": "Immobilized",
    "valued": false,
    "desc": "이동 속도 0. 회전은 가능."
  },
  {
    "id": "indifferent",
    "name": "무관심",
    "en": "Indifferent",
    "valued": false,
    "desc": "당신에 대해 중립적. 외교 보너스/페널티 없음."
  },
  {
    "id": "invisible",
    "name": "투명",
    "en": "Invisible",
    "valued": false,
    "desc": "보이지 않음. 대상 지정 불가(위치 알면 DC 11 단순 판정)."
  },
  {
    "id": "observed",
    "name": "발각됨",
    "en": "Observed",
    "valued": false,
    "desc": "발견됨. 은신 시도 전 상태."
  },
  {
    "id": "paralyzed",
    "name": "마비",
    "en": "Paralyzed",
    "valued": false,
    "desc": "행동/반응 불가. AC에 -2 상황 페널티. 무방비 상태."
  },
  {
    "id": "petrified",
    "name": "석화",
    "en": "Petrified",
    "valued": false,
    "desc": "돌로 변함. 무의식이며 피해 면역. 돌 상태에서만 피해 가능."
  },
  {
    "id": "prone",
    "name": "넘어짐",
    "en": "Prone",
    "valued": false,
    "desc": "근접 공격에 -2, 원거리 공격에 +2 AC. 일어서기 = 25피트 이동 소모."
  },
  {
    "id": "quickened",
    "name": "가속",
    "en": "Quickened",
    "valued": false,
    "desc": "매 턴 행동이 1개 추가됨. 추가 행동은 특정 행동에만 사용 가능."
  },
  {
    "id": "restrained",
    "name": "포박",
    "en": "Restrained",
    "valued": false,
    "desc": "붙잡힘 + 고정 상태. 이동 속도 0."
  },
  {
    "id": "sickened",
    "name": "구역질",
    "en": "Sickened",
    "valued": true,
    "desc": "모든 판정/공격에 상태 페널티 = 메스꺼움 수치. 음식 섭취 불가.",
    "max": 4
  },
  {
    "id": "slowed",
    "name": "둔화",
    "en": "Slowed",
    "valued": true,
    "desc": "매 턴 행동 수 = 3 - 둔화 수치.",
    "max": 3
  },
  {
    "id": "stunned",
    "name": "기절",
    "en": "Stunned",
    "valued": true,
    "desc": "행동 수치가 기절 값만큼 소모됨. 매 턴 기절 수치만큼 행동 손실.",
    "max": 4
  },
  {
    "id": "stupefied",
    "name": "멍함",
    "en": "Stupefied",
    "valued": true,
    "desc": "지능/지혜/매력 기반 판정과 주문 DC에 상태 페널티 = 현기증 수치.",
    "max": 4
  },
  {
    "id": "unconscious",
    "name": "무의식",
    "en": "Unconscious",
    "valued": false,
    "desc": "행동/반응 불가. AC -4, 지각 -4, 실명+귀머거리. 피해 받으면 깨날 수 있음."
  },
  {
    "id": "undetected",
    "name": "미탐지",
    "en": "Undetected",
    "valued": false,
    "desc": "존재와 위치 모두 알려지지 않음."
  },
  {
    "id": "unfriendly",
    "name": "비우호적",
    "en": "Unfriendly",
    "valued": false,
    "desc": "당신을 비우호적으로 봄. 외교 -1 상황 페널티."
  },
  {
    "id": "unnoticed",
    "name": "존재 미인지",
    "en": "Unnoticed",
    "valued": false,
    "desc": "당신의 존재 자체를 모름."
  },
  {
    "id": "wounded",
    "name": "부상",
    "en": "Wounded",
    "valued": true,
    "desc": "빈사 판정 DC에 부상 수치가 누적. 치유 후 휴식으로 1 감소.",
    "max": 3
  },
  {
    "id": "encumbered",
    "name": "과적",
    "en": "Encumbered",
    "valued": false,
    "desc": "부피가 5+근력 수정치 초과. 서투름 1, 이동 속도 10피트 감소. 부피 줄이면 자동 해제.",
    "auto": true
  }
];

const SKILLS = [
  {
    "id": "acrobatics",
    "name": "곡예",
    "en": "Acrobatics",
    "attr": "dex"
  },
  {
    "id": "arcana",
    "name": "주문학",
    "en": "Arcana",
    "attr": "int"
  },
  {
    "id": "athletics",
    "name": "운동",
    "en": "Athletics",
    "attr": "str"
  },
  {
    "id": "crafting",
    "name": "제작",
    "en": "Crafting",
    "attr": "int"
  },
  {
    "id": "deception",
    "name": "기만",
    "en": "Deception",
    "attr": "cha"
  },
  {
    "id": "diplomacy",
    "name": "외교",
    "en": "Diplomacy",
    "attr": "cha"
  },
  {
    "id": "intimidation",
    "name": "위협",
    "en": "Intimidation",
    "attr": "cha"
  },
  {
    "id": "lore1",
    "name": "지식 1",
    "en": "Lore",
    "attr": "int",
    "isLore": true
  },
  {
    "id": "lore2",
    "name": "지식 2",
    "en": "Lore",
    "attr": "int",
    "isLore": true
  },
  {
    "id": "medicine",
    "name": "의학",
    "en": "Medicine",
    "attr": "wis"
  },
  {
    "id": "nature",
    "name": "자연학",
    "en": "Nature",
    "attr": "wis"
  },
  {
    "id": "occultism",
    "name": "오컬티즘",
    "en": "Occultism",
    "attr": "int"
  },
  {
    "id": "performance",
    "name": "공연",
    "en": "Performance",
    "attr": "cha"
  },
  {
    "id": "religion",
    "name": "종교학",
    "en": "Religion",
    "attr": "wis"
  },
  {
    "id": "society",
    "name": "사회",
    "en": "Society",
    "attr": "int"
  },
  {
    "id": "stealth",
    "name": "은신",
    "en": "Stealth",
    "attr": "dex"
  },
  {
    "id": "survival",
    "name": "생존",
    "en": "Survival",
    "attr": "wis"
  },
  {
    "id": "thievery",
    "name": "도둑질",
    "en": "Thievery",
    "attr": "dex"
  }
];

const SKILL_NAME_MAP = {
  "곡예": "acrobatics",
  "주문학": "arcana",
  "운동": "athletics",
  "제작": "crafting",
  "기만": "deception",
  "외교": "diplomacy",
  "위협": "intimidation",
  "의학": "medicine",
  "자연학": "nature",
  "자연": "nature",
  "오컬티즘": "occultism",
  "공연": "performance",
  "종교학": "religion",
  "사회": "society",
  "은신": "stealth",
  "생존": "survival",
  "도둑질": "thievery"
};

// 행동 큐레이션(ACTION_DB: 그룹 cat_label·비용요건·기술게이트)은 data/derived/action_curation.json로 이관
// (PF2eAction.curatedList/getCuration). 표시데이터는 FVTT actions 오버레이 단일 소스.

const CONDITIONS = [
  "눈멈",
  "파손됨",
  "둔함",
  "은폐",
  "혼란",
  "지배됨",
  "눈부심",
  "귀먹음",
  "파멸",
  "생명력 고갈",
  "빈사",
  "약화됨",
  "매혹",
  "피로",
  "무방비",
  "도주",
  "우호적",
  "공포",
  "붙잡힘",
  "도움",
  "숨겨짐",
  "이동 불가",
  "무관심",
  "투명",
  "발각됨",
  "마비",
  "석화",
  "넘어짐",
  "가속",
  "포박",
  "구역질",
  "둔화",
  "기절",
  "멍함",
  "무의식",
  "미탐지",
  "비우호적",
  "존재 미인지",
  "부상"
];

// 능력치 enum + 한글 매핑 (전역 사용)
const ATTRIBUTES = ['str','dex','con','int','wis','cha'];
const ATTR_KO = { str:'근력', dex:'민첩', con:'건강', int:'지능', wis:'지혜', cha:'매력' };
const ATTR_EN = { str:'STR', dex:'DEX', con:'CON', int:'INT', wis:'WIS', cha:'CHA' };

// PROF_RANKS 제거(v0.x~ 죽은코드, 참조 0). 숙련 라벨↔값은 RANK_LABELS/RANK_KO 사용.

// ═══════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════

let state = {
  selectedClass: null,
  selectedSubclass: null,
  selectedAncestry: null,
  selectedBackground: null,
  selectedHeritage: null,
  portrait: null,   // base64 초상 (시트 표시 + 맵 토큰 img 출처)
  // PF2e Remaster boost tracking
  boosts: {
    ancFixed: [],    // fixed from ancestry (auto)
    ancFlaw:  [],    // flaws from ancestry (auto)
    ancFree:  [],    // free boost from ancestry (user picks)
    bg:       [],    // 2 background boosts (user picks)
    cls:      null,  // class key attr (auto)
    lv1:      [],    // level 1 free boosts (user picks, max 4, all diff)
    lv5:      [],
    lv10:     [],
    lv15:     [],
    lv20:     [],
  },
  weapons: [],
  equip: [],
  spells: {cantrip:[], known:[], focus:[], innate:[]},
  cantripSlots: 5,
  spellSlots: {},
  spellSlotsUsed: {},
  signatureSpells: {},  // {rank: spellName} — 시그니처 주문 (3레벨~)
  familiarSpells: null, // {cantrip:[], 1:[], 2:[], ...} — 사역마/주문서가 아는 주문 (prepared caster)
  preparedSpells: null, // {cantrip:[], 1:[], 2:[], ...} — 슬롯에 준비된 주문 (중복 가능, null=빈)
  feats: {special:[], ancestry:[], class:[], general:[], skill:[], archetype:[], other:[]},
  conditions: {},
  growth: {},  // level-by-level progression
  // Class-specific choices
  deity: null,           // deity ID (cleric)
  divineFont: null,      // 'heal' or 'harm' (cleric)
  sanctification: null,  // 'holy' or 'unholy' (cleric)
  divineFontUsed: 0,     // how many divine font slots used today
};

let modalType = null;
let modalSelected = null;

