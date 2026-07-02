// Pathfinder 2e — 룬 & 부착 큐레이션 DB
// 무기/방어구/방패/장비 카탈로그는 FVTT 단일 소스(PF2eEquip)로 이관됨.
// 룬 부착 시스템(attachTo/runeType/runeValue)은 FVTT 컴펜디움 미인코딩 → 큐레이션 유지.


// ═══════════════════════════════════
//  RUNE & ATTACHMENT DATABASE
// ═══════════════════════════════════
const RUNE_DB = [
  {
    "id": "weapon-potency-1",
    "name_ko": "무기 위력 룬 +1",
    "name_en": "Weapon Potency (+1)",
    "price": "35gp",
    "level": 2,
    "bulk": "—",
    "attachTo": "weapon",
    "runeType": "potency",
    "runeValue": 1,
    "traits": [
      "마법"
    ],
    "desc": "이 무기의 명중 굴림에 +1 아이템 보너스를 부여하며, 속성 룬 1개를 새길 수 있게 합니다."
  },
  {
    "id": "weapon-potency-2",
    "name_ko": "무기 위력 룬 +2",
    "name_en": "Weapon Potency (+2)",
    "price": "935gp",
    "level": 10,
    "bulk": "—",
    "attachTo": "weapon",
    "runeType": "potency",
    "runeValue": 2,
    "traits": [
      "마법"
    ],
    "desc": "이 무기의 명중 굴림에 +2 아이템 보너스를 부여하며, 속성 룬 2개를 새길 수 있게 합니다."
  },
  {
    "id": "weapon-potency-3",
    "name_ko": "무기 위력 룬 +3",
    "name_en": "Weapon Potency (+3)",
    "price": "8,935gp",
    "level": 16,
    "bulk": "—",
    "attachTo": "weapon",
    "runeType": "potency",
    "runeValue": 3,
    "traits": [
      "마법"
    ],
    "desc": "이 무기의 명중 굴림에 +3 아이템 보너스를 부여하며, 속성 룬 3개를 새길 수 있게 합니다."
  },
  {
    "id": "striking",
    "name_ko": "강타 룬",
    "name_en": "Striking",
    "price": "65gp",
    "level": 4,
    "bulk": "—",
    "attachTo": "weapon",
    "runeType": "striking",
    "runeValue": 1,
    "traits": [
      "마법"
    ],
    "desc": "강타 룬은 무기의 피해를 강화합니다. 무기의 피해 주사위가 1개에서 2개로 증가합니다. 예를 들어 <i>+1 강타 단검</i>은 1d4 대신 2d4 피해를 입힙니다."
  },
  {
    "id": "greater-striking",
    "name_ko": "상위 강타 룬",
    "name_en": "Greater Striking",
    "price": "1,065gp",
    "level": 12,
    "bulk": "—",
    "attachTo": "weapon",
    "runeType": "striking",
    "runeValue": 2,
    "traits": [
      "마법"
    ],
    "desc": "무기의 피해 주사위가 3개로 증가합니다."
  },
  {
    "id": "major-striking",
    "name_ko": "최상위 강타 룬",
    "name_en": "Major Striking",
    "price": "31,065gp",
    "level": 19,
    "bulk": "—",
    "attachTo": "weapon",
    "runeType": "striking",
    "runeValue": 3,
    "traits": [
      "마법"
    ],
    "desc": "무기의 피해 주사위가 4개로 증가합니다."
  },
  {
    "id": "ghost-touch",
    "name_ko": "고스트 터치 룬",
    "name_en": "Ghost Touch",
    "price": "75gp",
    "level": 4,
    "bulk": "—",
    "attachTo": "weapon",
    "runeType": "property",
    "runeValue": 0,
    "traits": [
      "마법"
    ],
    "desc": "이 룬은 물리적 형태가 없는 생물에게 피해를 입힐 수 있게 합니다. 고스트 터치 무기에 대해 비실체 생물은 보통 약점을 가집니다. 비실체 생물은 고스트 터치 무기를 만지고, 잡고, 휘두를 수 있습니다."
  },
  {
    "id": "armor-potency-1",
    "name_ko": "갑옷 위력 룬 +1",
    "name_en": "Armor Potency (+1)",
    "price": "160gp",
    "level": 5,
    "bulk": "—",
    "attachTo": "armor",
    "runeType": "potency",
    "runeValue": 1,
    "traits": [
      "마법"
    ],
    "desc": "갑옷의 보호 마법을 강화합니다. 갑옷의 AC 아이템 보너스가 1 증가하며, 속성 룬 1개를 새길 수 있게 합니다."
  },
  {
    "id": "armor-potency-2",
    "name_ko": "갑옷 위력 룬 +2",
    "name_en": "Armor Potency (+2)",
    "price": "1,060gp",
    "level": 11,
    "bulk": "—",
    "attachTo": "armor",
    "runeType": "potency",
    "runeValue": 2,
    "traits": [
      "마법"
    ],
    "desc": "갑옷의 AC 아이템 보너스가 2 증가하며, 속성 룬 2개를 새길 수 있게 합니다."
  },
  {
    "id": "armor-potency-3",
    "name_ko": "갑옷 위력 룬 +3",
    "name_en": "Armor Potency (+3)",
    "price": "20,560gp",
    "level": 18,
    "bulk": "—",
    "attachTo": "armor",
    "runeType": "potency",
    "runeValue": 3,
    "traits": [
      "마법"
    ],
    "desc": "갑옷의 AC 아이템 보너스가 3 증가하며, 속성 룬 3개를 새길 수 있게 합니다."
  },
  {
    "id": "resilient",
    "name_ko": "탄력 룬",
    "name_en": "Resilient",
    "price": "340gp",
    "level": 8,
    "bulk": "—",
    "attachTo": "armor",
    "runeType": "resilient",
    "runeValue": 1,
    "traits": [
      "마법"
    ],
    "desc": "탄력 룬은 갑옷에 추가적인 보호 마법을 부여합니다. 착용자의 내성 굴림에 +1 아이템 보너스를 부여합니다."
  },
  {
    "id": "greater-resilient",
    "name_ko": "상위 탄력 룬",
    "name_en": "Greater Resilient",
    "price": "3,440gp",
    "level": 14,
    "bulk": "—",
    "attachTo": "armor",
    "runeType": "resilient",
    "runeValue": 2,
    "traits": [
      "마법"
    ],
    "desc": "착용자의 내성 굴림에 +2 아이템 보너스를 부여합니다."
  },
  {
    "id": "major-resilient",
    "name_ko": "최상위 탄력 룬",
    "name_en": "Major Resilient",
    "price": "49,440gp",
    "level": 20,
    "bulk": "—",
    "attachTo": "armor",
    "runeType": "resilient",
    "runeValue": 3,
    "traits": [
      "마법"
    ],
    "desc": "착용자의 내성 굴림에 +3 아이템 보너스를 부여합니다."
  },
  {
    "id": "shield-boss",
    "name_ko": "방패 보스",
    "name_en": "Shield Boss",
    "price": "5sp",
    "level": 0,
    "bulk": "—",
    "attachTo": "shield",
    "runeType": "boss",
    "runeValue": 1,
    "traits": [
      "부착"
    ],
    "desc": "방패 중앙에 부착하는 금속 돌출부입니다. 방패로 타격 공격을 할 수 있으며, 1d6 B(타격) 피해를 입힙니다. 방패 보스는 일반 무기처럼 작동하며 무기 룬을 새길 수 있습니다."
  },
  {
    "id": "shield-spikes",
    "name_ko": "방패 가시",
    "name_en": "Shield Spikes",
    "price": "5sp",
    "level": 0,
    "bulk": "—",
    "attachTo": "shield",
    "runeType": "spikes",
    "runeValue": 1,
    "traits": [
      "부착"
    ],
    "desc": "방패 표면에 부착하는 뾰족한 금속 가시입니다. 방패로 타격 공격을 할 수 있으며, 1d6 P(관통) 피해를 입힙니다. 방패 가시는 일반 무기처럼 작동하며 무기 룬을 새길 수 있습니다."
  }
];
