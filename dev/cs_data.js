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

const CLASSES = [
  {
    "id": "bard",
    "name": "바드",
    "en": "Bard",
    "hp": 8,
    "tradition": "occult",
    "casting": "spontaneous",
    "saves": {
      "fort": "숙련",
      "ref": "숙련",
      "will": "전문가"
    },
    "perc": "전문가",
    "desc": "당신은 예술의 달인, 숨겨진 비밀의 학자, 그리고 매혹적인 설득가입니다. 강력한 공연을 사용하여 마음에 영향을 주고 영혼을 새로운 수준의 영웅주의로 고양시킵니다. 카리스마 넘치는 지도자가 될 수도 있고, 아니면 상담사, 조종자, 학자, 불량배, 또는 거장이 될 수도 있습니다. 다재다능함이 일부로 하여금 당신을 매혹적인 하는 일 없는 사람이자 만물박사라 여기게 하지만, 당신을 어떤 것도 통달하지 못한 자로 치부하는 것은 위험합니다.<br><br><br><strong>전투 조우 중...</strong> 마법 공연으로 아군에게 유리하게 상황을 바꿉니다. 필요에 따라 공격, 치유, 유용한 주문 사이를 자신 있게 오갑니다.<br><br><br><strong>사회적 조우 중...</strong> 쉽게 설득하고, 거짓말하고, 위협합니다.<br><br><br><strong>탐험 중...</strong> 지식, 민담, 전설, 전승의 보고로, 그룹의 모험에 더 깊은 맥락과 유용한 정찰을 제공합니다. 주문과 공연이 동료에게 더 큰 발견과 성공을 영감합니다.<br><br><br><strong>휴식 중...</strong> 공연으로 돈과 명성을 벌고, 이름을 알리고 후원자를 얻습니다. 결국 재능과 승리에 대한 이야기가 다른 바드를 끌어 바드 대학에서 당신의 기법을 공부하게 할 수 있습니다.<br><br><br><strong>당신은 아마도...</strong><br>• 예술에 대한 열정이 강하여 영적 연결을 맺습니다.<br>• 재치와 비폭력적 해결이 필요할 때 선두에 섭니다.<br>• 신비로운 페이 생물, 철학적 개념, 심령력, 또는 예술이나 음악의 신격이든, 뮤즈를 따르며 그 도움으로 소수만이 가진 비밀 전승을 배웁니다.<br>• 공연자나 손님으로 사교 행사에 초대할 기회를 반기지만, 사교계에서 당신을 일종의 호기심 대상으로 여깁니다.<br>• 다른 주문시전자에 비해 과소평가하며, 당신이 멋부리는 음유시인에 불과하고 마법의 미묘한 힘을 간과합니다.<br><br><br><strong>다른 사람들은 아마도...</strong><br>• 공연자나 손님으로 사교 행사에 초대할 기회를 반기지만, 사교계에서 당신을 일종의 호기심 대상으로 여깁니다.<br>• 다른 주문시전자에 비해 과소평가하며, 당신이 멋부리는 음유시인에 불과하고 마법의 미묘한 힘을 간과합니다.<br>• 사교적 매력과 능력에 호의적으로 반응하지만, 매혹적인 마법에 대해서는 경계합니다.",
    "fixed_skills": [
      "occultism",
      "performance"
    ],
    "choice_skill_groups": [],
    "free_skill_count": 4,
    "key_attrs": [
      "cha"
    ]
  },
  {
    "id": "cleric",
    "name": "클레릭",
    "en": "Cleric",
    "hp": 8,
    "tradition": "divine",
    "casting": "prepared",
    "saves": {
      "fort": "숙련",
      "ref": "숙련",
      "will": "전문가"
    },
    "perc": "숙련",
    "desc": "신격은 무한한 방법으로 세계에 뜻을 펼치며, 당신은 그들의 가장 충실한 필멸의 하인 중 한 명으로 봉사합니다. 신성한 마법의 축복을 받아, 신앙의 이상을 살고, 교회의 상징으로 자신을 장식하며, 신격의 선호 무기를 다루는 훈련에 부지런히 임합니다.<br><br><strong>전투 조우 중...</strong> 전투 사제라면 주문 시전과 신격의 선호 무기로 공격을 병행합니다. 수도원 성직자라면 주로 주문을 시전합니다. 대부분의 주문은 아군을 강화, 보호, 치유합니다. 신격에 따라 아군을 치유하거나 적을 해하는 추가 주문을 받습니다.<br><br><strong>사회적 조우 중...</strong> 외교적 제안을 하거나 인상적인 연설을 합니다. 선택하는 방향은 종종 신격의 교리에 크게 영향받습니다. 지혜롭다면 다른 이의 거짓도 간파합니다.<br><br><strong>탐험 중...</strong> 근처의 마법을 감지하고 발견한 종교적 글을 해석합니다. 공격에 대비해 아군에게 방어 주문을 집중할 수도 있습니다. 전투나 위험 후에는 마법이나 의학으로 부상자를 치유할 수 있습니다.<br><br><strong>휴식 중...</strong> 사원에서 봉사하거나, 신격의 말씀을 전파하기 위해 여행하거나, 신성한 물건을 제작하거나, 경전을 연구하거나, 성일을 기념하거나, 새 사원을 세울 수 있습니다.<br><br><strong>당신은 아마도...</strong><br>• 신앙에 신성한 사원과 성지를 방문하며, 다른 숭배자와 즉각적인 친밀감을 나눕니다.<br>• 종교 경전의 가르침을 알고, 그것이 딜레마에 어떻게 적용되는지 이해합니다.<br>• 신의 뜻에 어긋나지 않는 한 아군에 협력합니다.<br><br><strong>다른 사람들은 아마도...</strong><br>• 당신의 신앙을 공유하지 않더라도 당신의 헌신이 인상적이라고 느낍니다.<br>• 상처를 치유하고, 질병이나 저주 같은 복잡한 고통도 다루기를 기대합니다.<br>• 천상의 하인이나 악마 같은 다른 종교적 존재와 교류할 때 당신에게 의지합니다.",
    "fixed_skills": [
      "religion"
    ],
    "choice_skill_groups": [],
    "free_skill_count": 2,
    "key_attrs": [
      "wis"
    ],
    "deity_skill": true
  },
  {
    "id": "druid",
    "name": "드루이드",
    "en": "Druid",
    "hp": 8,
    "tradition": "primal",
    "casting": "prepared",
    "saves": {
      "fort": "숙련",
      "ref": "숙련",
      "will": "전문가"
    },
    "perc": "숙련",
    "desc": "자연의 힘은 저항할 수 없습니다. 수 분 만에 가장 견고한 요새도 무너뜨려 잔해로, 재로, 눈사태 아래로, 또는 파도 아래로 삼킬 수 있습니다. 자연을 존중하는 이에게 끝없는 풍요와 숨 막히는 장관을 줄 수 있고 — 가볍게 여기는 이에게는 고통스러운 죽음을. 당신은 자연의 부름을 듣는 자 중 하나입니다.<br><br><strong>전투 조우 중...</strong> 자연의 힘을 불러내 적을 물리치고 아군을 보호합니다. 원시 주문을 시전하여 자신과 친구를 보호하고, 상처를 치유하고, 치명적인 동물을 소환하여 편에 세우거나, 강력한 원소 마법을 발동하거나, 무시무시한 야수로 변신합니다.<br><br><strong>사회적 조우 중...</strong> 자연 세계에 가장 좋은 것뿐 아니라, 그 안의 생물이 조화와 평화 속에 살 수 있는 해결책을 찾으며 균형과 이성적 접근을 대변합니다. 양측이 진정으로 필요한 것을 얻을 수 있는 타협을 자주 제안합니다.<br><br><strong>탐험 중...</strong> 적을 추적하고, 야생을 탐색하며, 주문으로 마법 기운을 감지합니다. 야생 동물에게 정찰 능력을 빌려달라고 할 수도 있고, 뛰어난 감각과 정찰 능력으로 그룹을 돕습니다.<br><br><strong>휴식 중...</strong> 마법 물건이나 물약을 제작할 수 있습니다. 또는 자연과의 유대로 야생 지역을 돌보고, 문명이 초래한 상처를 치유하며, 지속 가능한 농업과 축산 기술을 가르쳐 자연의 균형을 해치지 않고 생활할 수 있게 합니다.<br><br><strong>당신은 아마도...</strong><br>• 자연의 힘에 대한 깊고 의미 있는 존경심을 가지고 있습니다.<br>• 끊임없이 자연 세계에 경외감을 느끼며, 다른 이와 나누고 싶지만 그들의 영향을 경계합니다.<br>• 식물과 동물을 동맹으로 대하며, 목표 달성을 위해 함께 일합니다.<br><br><strong>다른 사람들은 아마도...</strong><br>• 당신을 자연의 대변자로 보며, 자연을 통제할 수 있다고 확신합니다.<br>• 사회와 도시를 피하는 은둔자라고 가정합니다.<br>• 사제와 비슷한 신비주의자로 여기지만, 자연의 힘에만 응답한다고 봅니다.",
    "fixed_skills": [
      "nature"
    ],
    "choice_skill_groups": [],
    "free_skill_count": 2,
    "key_attrs": [
      "wis"
    ]
  },
  {
    "id": "fighter",
    "name": "파이터",
    "en": "Fighter",
    "hp": 10,
    "tradition": null,
    "casting": null,
    "saves": {
      "fort": "전문가",
      "ref": "전문가",
      "will": "숙련"
    },
    "perc": "전문가",
    "desc": "명예, 탐욕, 충성, 또는 순전히 전투의 짜릿함을 위해 싸우는 당신은 무기술과 전투 기법의 논쟁의 여지 없는 대가입니다. 개시 동작, 마무리 타격, 반격의 영리한 조합으로 행동을 연결하며, 적이 방어를 내리는 순간을 놓치지 않습니다. 기사든, 용병이든, 명사수든, 검술 달인이든, 당신은 무술을 예술의 경지로 끌어올리고 적에게 파괴적인 치명타를 가합니다.<br><br><strong>전투 조우 중...</strong> 비할 데 없는 정확도와 특화된 전투 기술로 공격합니다. 근접 파이터는 아군과 적 사이에 서서 지나가려는 적을 공격합니다. 원거리 파이터는 멀리서 정확한 사격을 가하지만, 근접에 밀려도 자력으로 버팁니다.<br><br><strong>사회적 조우 중...</strong> 위압적인 존재감이 될 수 있습니다. 적과 협상할 때 유용하지만, 격식 있는 자리에서는 부담이 될 수도 있습니다. 반면 갈등에 편안한 이들은 마법에 의존하지 않는 당신을 더 신뢰하고 덜 위협적으로 여길 수 있습니다.<br><br><strong>탐험 중...</strong> 전투에 대비해 방어를 유지하고 숨겨진 위협을 경계합니다. 물리적 도전도 극복합니다 — 문을 부수고, 장애물을 들어올리고, 능숙하게 등반하고, 구덩이를 뛰어넘습니다.<br><br><strong>휴식 중...</strong> 육체 노동이나 무기 수리를 할 수 있습니다. 더 이상 유리하지 않은 기법을 알면 새로운 것을 훈련할 수 있고, 명성을 쌓았다면 조직이나 거점을 세울 수 있습니다.<br><br><strong>당신은 아마도...</strong><br>• 소유한 모든 무기와 방어구의 목적과 품질을 알고 있습니다.<br>• 모험가의 삶이 위험하므로, 풍성한 잔치와 야심찬 작업으로 균형을 맞춰야 한다고 인식합니다.<br>• 세밀한 논리나 학문이 필요한 퍼즐이나 문제에는 인내심이 부족합니다.<br><br><strong>다른 사람들은 아마도...</strong><br>• 알게 되기 전까지 — 그리고 알게 된 후에도 — 당신을 위압적으로 느낍니다.<br>• 힘만 있고 머리는 없다고 기대합니다. 특히 난해한 학문 분야에서 그렇습니다.<br>• 전쟁 기술에 대한 전문성을 존중하고, 무기의 품질에 대한 당신의 의견을 소중히 여깁니다.",
    "fixed_skills": [],
    "choice_skill_groups": [
      [
        "acrobatics",
        "athletics"
      ]
    ],
    "free_skill_count": 3,
    "key_attrs": [
      "str",
      "dex"
    ]
  },
  {
    "id": "ranger",
    "name": "레인저",
    "en": "Ranger",
    "hp": 10,
    "tradition": null,
    "casting": null,
    "saves": {
      "fort": "전문가",
      "ref": "전문가",
      "will": "숙련"
    },
    "perc": "전문가",
    "desc": "일부 레인저는 문명이 영혼을 닳게 하지만 야생 생물로부터 보호해야 한다고 믿습니다. 다른 이들은 자연이 탐욕스러운 자로부터 보호받아야 한다고 합니다. 정찰병, 추적자, 도주자나 야수의 사냥꾼으로 문명의 끝자락이나 야생을 탐험하며, 자연에서 살아남는 법을 알고 기회의 먹이와 미운 적 모두를 발견하고 쓰러뜨리는 데 능숙합니다.<br><br><strong>전투 조우 중...</strong> 특정 적을 골라 사냥할 수 있어, 패배시키는 데 더 뛰어납니다. 선택한 무기로 목표를 겨냥하고 잔인하게 공격하며, 기술로 아군을 지원합니다.<br><br><strong>사회적 조우 중...</strong> 말할 때는 실용적 경험의 목소리로, 특히 야생 탐험과 관련된 이야기를 합니다.<br><br><strong>탐험 중...</strong> 야생을 통해 아군을 안내하거나 흔적을 따릅니다. 문제를 주시하며, 전투가 아닌 때에도 끊임없이 위험을 경계합니다.<br><br><strong>휴식 중...</strong> 다음 모험을 위해 무기를 제작하고 동물을 훈련합니다. 밖에 나가고 싶다면, 인근 지역을 사냥하거나 정찰하여 환경을 더 잘 이해할 수 있습니다.<br><br><strong>당신은 아마도...</strong><br>• 자연의 거친 힘을 존중하고 최대한 활용하는 법을 이해합니다.<br>• 사냥의 짜릿함을 즐깁니다.<br>• 파티 앞에서 정찰하며, 전투 전에 위험을 미리 탐지합니다.<br><br><strong>다른 사람들은 아마도...</strong><br>• 야생이나 문명의 침범으로부터 보호해달라고 요청합니다.<br>• 당신이 조용하거나 과묵한 외톨이라고 예상합니다.<br>• 당신에게 무언가 위험하고 야생적인 면이 있다고 느낍니다.",
    "fixed_skills": [
      "nature",
      "survival"
    ],
    "choice_skill_groups": [],
    "free_skill_count": 3,
    "key_attrs": [
      "str",
      "dex"
    ]
  },
  {
    "id": "rogue",
    "name": "로그",
    "en": "Rogue",
    "hp": 8,
    "tradition": null,
    "casting": null,
    "saves": {
      "fort": "숙련",
      "ref": "전문가",
      "will": "전문가"
    },
    "perc": "전문가",
    "desc": "당신은 기술이 뛰어나고 기회주의적입니다. 날카로운 재치와 빠른 반응으로 적의 실수를 이용하여 가장 아픈 곳을 찌릅니다. 위험한 게임을 즐기며, 스릴을 추구하고 기술을 시험하며, 방해가 되는 법은 대부분 신경 쓰지 않습니다. 모든 로그의 길은 독특하고 위험으로 가득하지만, 공유하는 것은 기술의 폭과 깊이입니다.<br><br><strong>전투 조우 중...</strong> 은밀하게 이동하여 적을 기습합니다. 정밀 도구처럼 적의 빈틈을 노리며, 일반 병사보다는 강력한 보스나 원거리 주문시전자를 상대하는 데 더 유용합니다.<br><br><strong>사회적 조우 중...</strong> 기술이 상대를 조종할 다양한 도구를 줍니다. 사기 치고 정보를 캐는 것은 당신에게 제2의 천성입니다.<br><br><strong>탐험 중...</strong> 적의 허를 찔러 위험이나 함정을 정찰합니다. 함정을 해제하고, 퍼즐을 풀고, 위험을 예측하는 데 큰 도움이 됩니다.<br><br><strong>휴식 중...</strong> 소매치기를 하거나 불법 물건을 거래할 수 있습니다. 도적 길드에 가입하거나, 직접 길드를 창설할 수도 있습니다.<br><br><strong>당신은 아마도...</strong><br>• 강도 높은 연습으로 기술을 연마합니다.<br>• 불법 물건을 어디서 구할 수 있는지 압니다.<br>• 법이 무의미하다고 생각하기에, 또는 자신만의 규칙이 있기에 법을 어기거나 회피합니다.<br><br><strong>다른 사람들은 아마도...</strong><br>• 더 잘 알면서도 당신을 매력적이거나 흥미롭다고 느끼며, 당신을 신뢰합니다.<br>• 위험을 감수하거나 의심스러운 방법을 쓸 사람이 필요할 때 당신에게 옵니다.<br>• 당신의 동기가 주로 탐욕이라고 의심합니다.",
    "fixed_skills": [
      "stealth"
    ],
    "choice_skill_groups": [],
    "free_skill_count": 7,
    "key_attrs": [
      "dex"
    ]
  },
  {
    "id": "witch",
    "name": "위치",
    "en": "Witch",
    "hp": 6,
    "tradition": "any",
    "casting": "prepared",
    "saves": {
      "fort": "숙련",
      "ref": "숙련",
      "will": "전문가"
    },
    "perc": "숙련",
    "desc": "당신은 학문이나 헌신이 아닌, 당신조차 완전히 이해하지 못하는 이세계 후원자의 대리인으로서 강력한 마법을 구사합니다. 이 존재는 은밀한 신격, 강력한 페이, 고대의 영혼, 또는 다른 강대한 초자연적 존재일 수 있지만 — 그 본질은 당신에게도 타인에게도 마찬가지로 미스터리일 것입니다. 특별한 사역마를 통해 후원자는 당신에게 다재다능한 주문과 강력한 주술(hex)을 자유롭게 사용할 수 있게 해주지만, 당신은 후원자의 더 큰 계획에 단순히 봉사하는 것인지 결코 확신할 수 없습니다.<br><br><strong>전투 조우 중...</strong> 전투의 흐름을 바꾸기 위해 주문을 시전합니다. 마법 주술로 적을 방해하고 아군을 돕는 한편, 더 강력한 주문으로 전장을 통제합니다. 비범한 사역마의 도움을 받아 치유하거나, 해를 끼치거나, 물약을 양조하거나, 마법 물건을 제작합니다.<br><br><strong>사회적 조우 중...</strong> 마법 문제를 포함한 다양한 주제에 대한 지식을 제공하며, 후원자의 마법을 사용해 다른 이를 매혹하거나 속일 수 있습니다.<br><br><strong>탐험 중...</strong> 마법 함정과 보물을 경계하며, 방해가 되는 장애물을 극복하기 위해 다양한 주문을 활용합니다. 사역마가 그 자체로 상당한 특수 능력을 지원할 수 있습니다.<br><br><strong>휴식 중...</strong> 물약을 양조하고, 마법 물건을 제작하고, 사역마가 배울 새 주문을 찾습니다. 후원자나 사역마에 대해 더 알려 하거나, 후원자의 목적이나 자신의 힘을 탐구하며, 협력이나 공동체를 위해 다른 위치들과 교류할 수도 있습니다.<br><br><strong>당신은 아마도...</strong><br>• 후원자나 사역마에 대해 더 알고 싶어 하며, 왜 당신을 선택했는지, 그들의 계획에 어떻게 들어맞는지 궁금합니다.<br>• 후원자가 제공하는 주문을 보완하기 위해 두루마리나 주문서 같은 새로운 마법 원천을 찾습니다.<br>• 사역마를 확고한 동맹, 소중한 친구, 또는 성격에 따라 필요악으로 봅니다.<br><br><strong>다른 사람들은 아마도...</strong><br>• 후원자의 본질과 마법의 원천에 대해 궁금해하며, 그것이 당신에게 등을 돌리거나 자신도 모르게 사악한 힘을 섬기는 것은 아닌지 걱정합니다.<br>• 직접 돕거나 적을 방해하여 마법으로 지원하는 능력에 감사합니다.<br>• 화나면 악의적인 주술을 걸까 봐 당신을 조심합니다.",
    "fixed_skills": [
      "occultism"
    ],
    "choice_skill_groups": [],
    "free_skill_count": 3,
    "key_attrs": [
      "int"
    ]
  },
  {
    "id": "wizard",
    "name": "위저드",
    "en": "Wizard",
    "hp": 6,
    "tradition": "arcane",
    "casting": "prepared",
    "saves": {
      "fort": "숙련",
      "ref": "숙련",
      "will": "전문가"
    },
    "perc": "숙련",
    "desc": "당신은 우주의 비밀에 대한 영원한 학도로, 마법에 대한 숙달로 강력한 주문을 시전합니다. 마법을 과학처럼 다루며, 최신 실용 주문학 교재와 고대의 서적을 교차 참조하여 비전 마법을 발견하고 이해합니다. 마법 이론은 방대하며 모두 공부할 수 없습니다. 대부분의 위저드는 정규 교육을 통해 배우고, 특히 의욕적인 연구자는 때때로 자신만의 이론을 만들기도 합니다.<br><br><strong>전투 조우 중...</strong> 전투에서 한 발 물러서 주문을 언제 사용할지 신중하게 판단합니다. 가장 강력한 마법으로 위협적인 적을 무력화하고, 약한 적만 남았을 때 캔트립을 사용합니다. 적이 투명화나 비행 같은 수단을 쓰면, 빛의 계시(revealing light)나 속박(earthbind) 같은 주문으로 대응하여 아군에게 전장을 고르게 만듭니다.<br><br><strong>사회적 조우 중...</strong> 비전 관련 문제에 대한 풍부한 지식을 제공하고 논리로 논쟁을 해결합니다.<br><br><strong>탐험 중...</strong> 마법 기운을 찾아내고 발견한 마법 문구나 현상의 의미를 파악합니다. 특이한 장애물에 맞닥뜨리면, 극복하기 쉽게 해줄 두루마리가 있을 것입니다.<br><br><strong>휴식 중...</strong> 새 주문을 배우고, 마법 물건을 제작하며, 파티를 위해 두루마리를 필사합니다. 주문 외에도 새롭고 흥미로운 공식을 찾으며, 학술적 인맥을 쌓고 학교나 길드를 설립할 수도 있습니다.<br><br><strong>당신은 아마도...</strong><br>• 주변 세계가 어떻게 작동하는지 — 특히 마법 — 에 대한 끝없는 지적 호기심을 가지고 있습니다.<br>• 학파의 가르침을 모든 상황에 적용할 방법을 찾으며, 평생 학습에 바친 주문의 렌즈로 문제를 봅니다.<br>• 난해한 전문 용어와 기술적 표현으로 마법 효과의 미세한 차이를 정확히 설명하는데, 그 차이가 다른 사람에게는 아마 의미 없을 것입니다.<br><br><strong>다른 사람들은 아마도...</strong><br>• 당신을 엄청나게 강력하고 잠재적으로 위험하다고 여깁니다.<br>• 마법이 마음, 몸, 영혼에 할 수 있는 일을 두려워하며, 예의 바른 자리에서 주문 시전을 피해달라고 합니다.<br>• 위험한 날씨부터 흉작까지 모든 문제를 쉽게 해결할 수 있다고 가정하고, 원하는 것을 얻을 수 있는 주문을 요청합니다.",
    "fixed_skills": [
      "arcana"
    ],
    "choice_skill_groups": [],
    "free_skill_count": 3,
    "key_attrs": [
      "int"
    ]
  }
];

// 클래스 서브클래스 DB
const SUBCLASS_DB = [
  {
    "id": "muse-enigma",
    "class_id": "bard",
    "subclass_type": "뮤즈",
    "name_ko": "수수께끼",
    "name_en": "Enigma",
    "desc": "뮤즈는 미스터리로, 삶과 다차원계의 숨겨진 비밀을 밝히도록 합니다. 완전히 파악할 수 없는 사람, 상징이 깊이 겹쳐진 텍스트, 또는 평생 작품의 바탕이 되는 감정적 역설일 수 있습니다. 이세계 생물이라면 신비로운 영겁(aeon)이나 오컬트 용일 수 있고, 신격이라면 이로리나 네시스일 수 있습니다.<br>수수께끼 뮤즈의 바드로서, 영감과 오컬트 지원 곁에 지식을 제공하여 동료를 지원합니다.",
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
        "desc": "수수께끼 뮤즈가 온갖 신비로운 지식을 속삭여 줍니다. 바드 지식(Bardic Lore)이라는 특수 지식 기술에 숙련됩니다. 모든 지식 회상 시 바드 지식을 사용할 수 있으며, 다른 지식 기술 대신 이 하나의 기술로 판정합니다."
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
        "desc": "작곡 캔트립의 효과를 유지하는 집중 주문을 습득합니다. 잔향 작곡(Lingering Composition) 재주를 얻어, 1 집중 포인트를 소비하여 작곡 캔트립의 지속 시간을 3라운드로 연장합니다."
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
        "desc": "전사 뮤즈의 영감으로 군용 무기에 훈련됩니다. 군용 무기 숙련도가 훈련(Trained)으로 증가합니다."
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
        "desc": "박학다식한 뮤즈의 영향으로 공연 기술로 다른 기술을 대체할 수 있습니다. 다재다능한 공연(Versatile Performance) 재주를 얻어, 공연(Performance)으로 기만, 외교, 위협 판정을 대체합니다."
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
    "desc": "신성 마법과 신격의 영역에 집중하는 성직자입니다.<br><strong>1차 교의(1레벨):</strong> 영역 입문(Domain Initiate) 클레릭 재주를 얻습니다.<br><strong>2차 교의(3레벨):</strong> 인내 내성 → 전문가.<br><strong>3차 교의(7레벨):</strong> 주문 명중/DC → 전문가.<br><strong>4차 교의(11레벨):</strong> 신격 선호 무기, 단순 무기, 비무장 → 전문가. 선호 무기 치명 성공 시 치명 특수 효과 적용; 클래스 DC 대신 주문 DC 사용 가능.<br><strong>5차 교의(15레벨):</strong> 주문 명중/DC → 달인.<br><strong>최종 교의(19레벨):</strong> 주문 명중/DC → 전설.",
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
        "desc": "동물 결사에 가입하여 동물 친구(Animal Companion)를 얻습니다. 자연학에 훈련되며, 동물 친구가 전투와 탐험에서 함께합니다."
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
        "desc": "잎 결사에 가입하여 축제의 뿔피리(Cornucopia) 집중 주문을 습득합니다. 외교에 훈련됩니다."
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
        "desc": "폭풍 결사에 가입하여 폭풍 쇄도(Tempest Surge) 집중 주문을 습득합니다. 곡예에 훈련됩니다."
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
        "desc": "야생 결사에 가입하여 야생 해방(Untamed Form) 집중 주문을 습득합니다. 위협에 훈련됩니다."
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
    "id": "racket-acrobat",
    "class_id": "rogue",
    "subclass_type": "전문",
    "name_ko": "곡예사",
    "name_en": "Acrobat",
    "desc": "서커스나 거리에서 곡예사로 공연하여 급료를 벌었습니다. 돈이 마르거나 기술을 더 나은 용도로 쓰기로 했을 때 모험가가 되었을 수 있습니다.",
    "granted_skills": [
      "acrobatics"
    ],
    "granted_feats": [],
    "granted_spells": [],
    "features": [
      {
        "lv": 1,
        "name_ko": "곡예→스닉 어택 기회",
        "name_en": "Acrobat",
        "desc": "곡예사 라켓: 곡예(Tumble Through) 성공 시 대상이 턴 끝까지 무방비 상태가 됩니다. 곡예에 훈련됩니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "racket-assassin",
    "class_id": "rogue",
    "subclass_type": "전문",
    "name_ko": "암살자",
    "name_en": "Assassin",
    "desc": "불의의 기습에 특화된 치명적 살수입니다.<br>첫 라운드 은밀 공격 추가 +2d6. 독 제조/사용에 특화.",
    "granted_skills": [
      "stealth"
    ],
    "granted_feats": [],
    "granted_spells": [],
    "features": [
      {
        "lv": 1,
        "name_ko": "기습 라운드 +2d6",
        "name_en": "Assassin",
        "desc": "암살자 라켓: 첫 라운드에 행동하지 않은 적에게 은밀 공격 시 추가 피해 주사위를 1d6 더 굴립니다. 은신과 기만에 훈련됩니다."
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
    "desc": "마법과 교활함을 결합합니다.<br>주문 트릭(Spell Trickster) 집중 주문 습득. 주문 공격으로 은밀 공격 적용 가능.",
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
        "desc": "두뇌파 라켓: 지식 회상(Recall Knowledge)으로 대상을 식별하면, 해당 대상은 다음 턴 시작까지 무방비 상태가 됩니다. 사회(Society)에 훈련되며, 하나의 지식 기술에 추가 훈련됩니다."
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
    "desc": "재빠른 말솜씨, 아첨, 날카로운 혀로 위험을 피하고 곤란한 상황을 탈출합니다. 기만으로 성공적으로 속임(Feint) 시 다음 턴 종료까지 당신의 근접 공격에 <strong>무방비</strong>; 대성공이면 모든 근접 공격에. 민첩/기교 근접 무기를 들고 속이면 즉시 <strong>자유 행동으로 한 걸음</strong>.",
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
        "desc": "사기꾼 라켓: 기만(Feint) 성공 시 대상이 다음 턴 시작까지 무방비 상태가 됩니다. 기만과 외교에 훈련됩니다."
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
        "desc": "도적 라켓: 은밀 공격 피해에 기교(Finesse) 무기 사용 시 민첩 수정치를 피해에 추가합니다. 도적질(Thievery)에 훈련됩니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "patron-curse",
    "class_id": "witch",
    "subclass_type": "후원자",
    "name_ko": "저주",
    "name_en": "Curse",
    "desc": "저주의 힘을 부여하는 후원자. 오컬트(Occult) 전통. 주술: 악의 눈(Evil Eye). 저주·조종 관련 주문 확장.",
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
        "desc": "저주 후원자가 오컬트 전통의 주문시전 능력을 부여합니다. 사악한 눈(Evil Eye) 주술 집중 주문을 습득합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "patron-fate",
    "class_id": "witch",
    "subclass_type": "후원자",
    "name_ko": "운명",
    "name_en": "Fate",
    "desc": "운명의 실을 다루는 후원자. 오컬트(Occult) 전통. 주술: 운명의 실(Thread of Fate). 예지 관련 주문 확장.",
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
        "desc": "운명 후원자가 오컬트 전통의 주문시전 능력을 부여합니다. 운명 조정(Nudge Fate) 주술 집중 주문을 습득합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "patron-fervor",
    "class_id": "witch",
    "subclass_type": "후원자",
    "name_ko": "열정",
    "name_en": "Fervor",
    "desc": "신성한 헌신의 후원자. 신성(Divine) 전통. 주술: 정화의 불꽃(Stoke the Heart). 치유·강화 관련 주문.",
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
        "desc": "열정 후원자가 신성 전통의 주문시전 능력을 부여합니다. 심장 격려(Stoke the Heart) 주술 집중 주문을 습득합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "patron-night",
    "class_id": "witch",
    "subclass_type": "후원자",
    "name_ko": "밤",
    "name_en": "Night",
    "desc": "어둠과 꿈의 후원자. 오컬트(Occult) 전통. 주술: 마녀의 포옹(Witch's Cauldron). 환상·공포 관련 주문.",
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
        "desc": "밤 후원자가 오컬트 전통의 주문시전 능력을 부여합니다. 밤의 장막(Shroud of Night) 주술 집중 주문을 습득합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "patron-rune",
    "class_id": "witch",
    "subclass_type": "후원자",
    "name_ko": "룬",
    "name_en": "Rune",
    "desc": "룬 마법의 후원자. 신비(Arcane) 전통. 주술: 룬 저주(Pact of Doom). 변환·방호 관련 주문.",
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
        "desc": "룬 후원자가 비전 전통의 주문시전 능력을 부여합니다. 비밀 간파(Discern Secrets) 주술 집중 주문을 습득합니다."
      }
    ],
    "prof_changes": {}
  },
  {
    "id": "patron-wild",
    "class_id": "witch",
    "subclass_type": "후원자",
    "name_ko": "야생",
    "name_en": "Wild",
    "desc": "자연 야생의 후원자. 원시(Primal) 전통. 주술: 야생의 분노(Wilding Word). 자연·동물 관련 주문.",
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
        "desc": "야생 후원자가 원시 전통의 주문시전 능력을 부여합니다. 야생의 말(Wilding Word) 주술 집중 주문을 습득합니다."
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
    "desc": "문자와 수호의 마법. 학파 주문: 보호의 결계(Protective Wards) / 감시의 룬(Rune of Observation). 교과: message, sigil 등.",
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
        "desc": "문법학파(Ars Grammatica)를 선택합니다. 보호의 결계(Protective Wards) 학파 집중 주문을 습득하고, 추가 교과과정 주문 슬롯을 얻습니다."
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
    "desc": "전쟁과 파괴의 마법. 학파 주문: 힘의 화살(Force Bolt) / 에너지 흡수(Energy Absorption). 교과: shield, fire 등.",
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
        "desc": "전투마법학파(Battle Magic)를 선택합니다. 힘의 화살(Force Bolt) 학파 집중 주문을 습득하고, 추가 교과과정 주문 슬롯을 얻습니다."
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
    "desc": "차원과 소환의 마법. 학파 주문: 소환 강화(Fortify Summoning) / 공포의 나선(Spiral of Horrors). 교과: telekinetic hand 등.",
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
        "desc": "경계학파(Boundary)를 선택합니다. 소환 강화(Fortify Summoning) 학파 집중 주문을 습득하고, 추가 교과과정 주문 슬롯을 얻습니다."
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
    "desc": "건설과 실용의 마법. 학파 주문: 대지 공사(Earthworks) / 가족 회복(Community Restoration). 교과: prestidigitation 등.",
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
        "desc": "시민마법학파(Civic Wizardry)를 선택합니다. 대지 공사(Earthworks) 학파 집중 주문을 습득하고, 추가 교과과정 주문 슬롯을 얻습니다."
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
    "desc": "환상과 정신의 마법. 학파 주문: 매혹의 밀침(Charming Push) / 투명 망토(Invisibility Cloak). 교과: daze, figment 등.",
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
        "desc": "정신학파(Mentalism)를 선택합니다. 매혹의 밀침(Charming Push) 학파 집중 주문을 습득하고, 추가 교과과정 주문 슬롯을 얻습니다."
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
    "desc": "변형과 변환의 마법. 학파 주문: 몸 뒤섞기(Scramble Body) / 변형(Shifting Form). 교과: gouging claw 등.",
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
        "desc": "변형학파(Protean Form)를 선택합니다. 몸 뒤섞기(Scramble Body) 학파 집중 주문을 습득하고, 추가 교과과정 주문 슬롯을 얻습니다."
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
        "desc": "통합이론학파(Unified Theory)를 선택합니다. 학파 주문 대신 추가 교과과정 주문 슬롯과 유연한 주문 준비 이점을 얻습니다."
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

const ANCESTRIES = [
  {
    "id": "dwarf",
    "name": "드워프",
    "en": "Dwarf",
    "hp": 10,
    "size": "중형",
    "speed": 20,
    "boosts": [
      "con",
      "wis"
    ],
    "flaws": [
      "cha"
    ],
    "traits": [
      "드워프",
      "인간형"
    ],
    "vision": "darkvision",
    "languages": [
      "common",
      "dwarven"
    ],
    "bonusLangs": 0,
    "desc": "드워프는 과묵하고 엄격한 사람들로 잘 알려져 있지만, 억제되지 않는 열정과 장인 정신에 대한 깊은 존중도 가지고 있습니다. 낯선 이에게는 불신이 많고 배타적으로 보일 수 있지만, 친구와 가족에게는 따뜻하고 다정합니다. 드워프의 신뢰는 얻기 어렵지만, 일단 얻으면 철만큼 단단합니다.<br><strong>당신은 아마도...</strong><br>• 개인적 명예를 지키기 위해 노력하고 물러서기를 거부합니다.<br>• 모든 형태의 우수한 장인 정신을 감상하고, 자신의 모든 장비에도 이를 요구합니다.<br>• 당신을 완고하다고 보지만, 이것이 장점인지 단점인지는 순간에 따라 바뀝니다.<br>• 가족, 유산, 친구와의 깊은 유대를 인정합니다.<br><strong>다른 사람들은 아마도...</strong><br>• 당신을 완고하다고 보지만, 이것이 장점인지 단점인지는 순간에 따라 바뀝니다.<br>• 가족, 유산, 친구와의 깊은 유대를 인정합니다.<br><strong>신체 묘사</strong><br>드워프는 키가 작고 땅딸막하며, 대부분의 인간보다 약 30cm(1피트) 정도 작습니다. 넓고 단단한 체격에 건장한 골격을 가지고 있습니다. 모든 성별의 드워프가 머리카락과 수염의 길이를 자랑스럽게 여기며, 종종 복잡한 패턴으로 땋는데, 일부는 특정 씨족을 나타냅니다. 긴 수염은 많은 드워프 씨족에서 성숙과 명예의 상징입니다.<br><strong>사회</strong><br>고대 드워프 제국은 오크와 고블린 적들에게 압도당해 오래전에 무너졌지만, 오늘날의 드워프는 한때 그들을 위대하게 만들었던 자질 — 사나움, 투지, 완고함 — 을 많이 유지하고 있습니다. 드워프는 지표면에 흩어져 있는 산악 하늘 성채(Sky Citadels) 안에서 살며, 이로 인해 드워프 씨족 간에 거대한 문화적 격차가 생길 수 있습니다. 그러나 거의 모든 드워프 민족이 석공, 금속 세공, 가족에 대한 열정을 공유합니다.<br><strong>신앙</strong><br>드워프는 명예를 중시하고 씨족과 왕국의 전통을 충실히 따르는 경향이 있습니다. 우정과 정의에 대한 강한 감각이 있지만, 누구를 친구로 여길지에 대해서는 매우 까다롭습니다. 열심히 일하고 더 열심히 노는데 — 특히 강한 에일이 관련될 때 그렇습니다. 드워프 종족의 신인 토라그(Torag)가 드워프의 주요 신격이며, 토라그의 가족 구성원에 대한 숭배도 일반적입니다.",
    "boost_choices": [],
    "free_boosts": 1,
    "flaw_choices": [],
    "free_flaws": 0,
    "features": [],
    "grantWeapon": "clan-dagger"
  },
  {
    "id": "elf",
    "name": "엘프",
    "en": "Elf",
    "hp": 6,
    "size": "중형",
    "speed": 30,
    "boosts": [
      "dex",
      "int"
    ],
    "flaws": [
      "con"
    ],
    "traits": [
      "엘프",
      "인간형"
    ],
    "vision": "low-light",
    "languages": [
      "common",
      "elven"
    ],
    "bonusLangs": 0,
    "desc": "오래된 종족인 엘프는 위대한 변화를 목격했으며, 역사의 흐름을 지켜보면서만 얻을 수 있는 관점을 가지고 있습니다. 고대에 골라리온을 떠났다가 변해버린 땅으로 돌아온 엘프는 여전히 조상의 고향을 되찾기 위해 분투합니다. 엘프는 친절, 지성, 아름다움을 중시하며, 많은 엘프가 예의범절, 외모, 문화를 향상시키기 위해 노력합니다. 그들의 연구는 대부분의 수명이 짧은 종족이 과도하거나 비효율적이라고 여기는 수준의 세부 사항까지 파고듭니다. 엘프는 종종 상당히 사적인 사람들로, 숲과 친족 집단의 비밀에 깊이 빠져 있습니다. 친족 밖에서 우정을 쌓는 데 느린데, 수명이 짧은 종족 사이에서 삶을 보내는 엘프는 세대에 걸친 동료들이 나이 들고 죽는 것을 지켜보면서 우울해지는 경우가 많습니다. 이런 엘프는 동료 엘프 사이에서 \"비탄의 엘프(Forlorn)\"로 알려져 있습니다.<br><strong>당신은 아마도...</strong><br>• 수명이 짧은 사람들과의 관계를 신중하게 가꿉니다.<br>• 전문적이거나 잘 알려지지 않은 관심사를 순전히 숙달하기 위해 채택합니다.<br>• 외모에 집중하여, 우아함을 감탄하거나 당신을 신체적으로 연약한 것처럼 대합니다.<br>• 당신이 은밀히 자신들을 내려다본다고 걱정하거나, 당신이 오만하고 냉담하다고 느낍니다.<br><strong>다른 사람들은 아마도...</strong><br>• 외모에 집중하여, 우아함을 감탄하거나 당신을 신체적으로 연약한 것처럼 대합니다.<br>• 당신이 은밀히 자신들을 내려다본다고 걱정하거나, 당신이 오만하고 냉담하다고 느낍니다.<br><strong>신체 묘사</strong><br>일반적으로 인간보다 키가 크지만, 엘프는 긴 이목구비와 뾰족한 귀로 강조되는 섬세한 우아함을 지닙니다. 넓고 둥근 눈에는 크고 종종 선명한 색의 동공이 있어, 눈의 전체 보이는 부분을 차지합니다. 이 동공은 이질적인 외모를 주고 매우 어두운 빛에서도 선명하게 볼 수 있게 합니다.<br><strong>사회</strong><br>엘프의 타고난 인내심과 지적 호기심은 그들을 뛰어난 현자, 철학자, 위저드로 만들며, 그들의 사회는 경이와 지식에 대한 타고난 감각 위에 세워져 있습니다.<br><strong>신앙</strong><br>엘프는 종종 감정적이고 변덕스럽지만, 높은 이상을 마음 가까이 품습니다. 신비롭고 예술적인 모든 것에 대한 사랑을 공유하는 신격을 선호합니다. 데스나(Desna)와 셸린(Shelyn)이 특히 좋아하는 신격으로, 전자는 경이감으로, 후자는 예술적 감상으로 인기가 있습니다. 칼리스트리아(Calistria)는 가장 악명 높은 엘프 신격으로, 많은 엘프 이상이 극단으로 치달은 것을 나타냅니다.",
    "boost_choices": [],
    "free_boosts": 1,
    "flaw_choices": [],
    "free_flaws": 0,
    "features": [],
    "grantWeapon": ""
  },
  {
    "id": "gnome",
    "name": "노움",
    "en": "Gnome",
    "hp": 8,
    "size": "소형",
    "speed": 25,
    "boosts": [
      "con",
      "cha"
    ],
    "flaws": [
      "str"
    ],
    "traits": [
      "노움",
      "인간형"
    ],
    "vision": "low-light",
    "languages": [
      "common",
      "gnomish",
      "fey"
    ],
    "bonusLangs": 0,
    "desc": "오래전, 초기 노움 조상들은 페이의 영역인 첫 번째 세계(First World)에서 이주했습니다. 최초의 노움들이 왜 골라리온으로 떠돌아왔는지는 불분명하지만, 이 혈통은 현대 노움에게 기이한 사고방식, 기이함, 집착적 성향, 그리고 일부가 순진함으로 보는 것으로 나타납니다. 항상 새로운 경험에 굶주린 노움은 정신적으로나 물리적으로 끊임없이 방황하며, 모든 노움을 위협하는 끔찍한 질병을 막으려 합니다. 표백(Bleaching)이라 알려진 이 고통은 꿈꾸고, 혁신하고, 새로운 경험을 받아들이지 못하는 노움을 덮칩니다. 표백은 노움에게서 — 문자 그대로 — 색을 천천히 빼앗아가고, 영향받은 이를 깊은 우울증에 빠뜨려 결국 목숨을 앗아갑니다. 극소수의 노움만이 이 재앙에서 살아남아, 깊이 침울하고 현명한 생존자인 표백자(bleachlings)가 됩니다.<br><strong>당신은 아마도...</strong><br>• 학습을 포용하고 예고 없이 한 연구 분야에서 다른 분야로 뛰어다닙니다.<br>• 빠르게 말하고, 생각하고, 움직이며, 따라오지 못하는 사람에게 참을성을 잃습니다.<br>• 당신의 열정과 새로운 상황에 접근하는 에너지를 감상합니다.<br>• 당신의 동기를 이해하거나 급격한 방향 전환에 적응하는 데 어려움을 겪습니다.<br><strong>다른 사람들은 아마도...</strong><br>• 당신의 열정과 새로운 상황에 접근하는 에너지를 감상합니다.<br>• 당신의 동기를 이해하거나 급격한 방향 전환에 적응하는 데 어려움을 겪습니다.<br><strong>신체 묘사</strong><br>대부분의 노움은 키가 90cm(3피트)를 약간 넘고, 인간 아이보다 조금 더 무겁습니다. 자연적인 피부, 머리카락, 눈 색깔이 매우 다양합니다. 표백이 시작되지 않은 노움은 흰색 외에 거의 모든 머리카락과 눈 색깔이 가능하며, 선명한 색상이 가장 빈번합니다. 피부색은 약간 더 좁은 범위를 포괄하며 흙색과 분홍빛 색조가 많지만, 때로 초록, 검정, 또는 연한 파란색도 있습니다.<br><strong>사회</strong><br>대부분의 노움은 거주 지역의 문화적 관습 일부를 채택하지만, 골라서 선택하고, 자신들의 페이적 논리에 맞게 공동체를 조정하는 경향이 있습니다. 이것은 종종 노움 다수 공동체가 결국 거의 전적으로 노움으로 구성되게 하는데, 다른 사람들이 노움의 정치적 결정에 당혹하여 다른 곳으로 이사하기 때문입니다. 노움은 완전히 자기 것이라 할 수 있는 문화가 거의 없습니다. 골라리온 표면에 노움 왕국이나 국가는 극히 드물며, 대부분의 노움은 그런 나라가 있다 해도 어떻게 할지 모를 것입니다.<br><strong>신앙</strong><br>노움은 충동적인 장난꾸러기로 불가해한 동기와 혼란스러운 방법을 가지지만, 많은 이가 최소한 세상을 더 나은 곳으로 만들려 합니다. 강한 감정의 발작에 빠지기 쉬우며, 도움받을 자격이 있다고 믿는 이를 돕는 데 거의 수줍어하지 않습니다. 노움은 개인주의와 자연을 중시하는 신격을 가장 흔히 숭배하며, 케이든 카일리언, 데스나, 고즈레, 셸린 등입니다.",
    "boost_choices": [],
    "free_boosts": 1,
    "flaw_choices": [],
    "free_flaws": 0,
    "features": [],
    "grantWeapon": ""
  },
  {
    "id": "goblin",
    "name": "고블린",
    "en": "Goblin",
    "hp": 6,
    "size": "소형",
    "speed": 25,
    "boosts": [
      "dex",
      "cha"
    ],
    "flaws": [
      "wis"
    ],
    "traits": [
      "고블린",
      "인간형"
    ],
    "vision": "darkvision",
    "languages": [
      "common",
      "goblin"
    ],
    "bonusLangs": 0,
    "desc": "다른 사람들이 집착하는 복잡한 역사는 고블린에게 흥미가 없습니다. 이 작은 종족은 순간을 살며, 사실 기록보다 허풍 섞인 이야기를 선호합니다. 고블린의 미덕은 현재에 존재하고, 창의적이며, 솔직한 것입니다. 여정이 어떻게 끝날지 걱정하기보다 충만한 삶을 살기 위해 노력합니다. 이야기를 말하되, 사실을 따지지 않는 것. 작지만, 크게 꿈꾸는 것. 많은 고블린이 노래, 불, 먹는 것 같은 단순한 즐거움을 좋아하고, 읽기, 개, 말을 싫어합니다. 다른 고블린은 폐품 손질이나 거의 모든 것으로 간식과 폭발물을 조합하는 것 같은 더 복잡한 추구를 할 수 있습니다.<br><strong>당신은 아마도...</strong><br>• 다른 문명화된 종족 사이에서, 어쩌면 자신에게도, 자기 자리가 있다는 것을 증명하려 합니다.<br>• 다른 이의 무거운 감정적 짐을 덜어주고(동시에 자신도 즐기며) 장난과 익살로 분위기를 밝힙니다.<br>• 당신이 (의도적이든 우발적이든) 너무 많은 것에 불을 지르지 않도록 합니다.<br>• 혈통의 전형적인 미식 선택, 무모한 행동, 불에 대한 사랑을 감안하면 어떻게 생존하는지 궁금해합니다.<br><strong>다른 사람들은 아마도...</strong><br>• 당신이 (의도적이든 우발적이든) 너무 많은 것에 불을 지르지 않도록 합니다.<br>• 혈통의 전형적인 미식 선택, 무모한 행동, 불에 대한 사랑을 감안하면 어떻게 생존하는지 궁금해합니다.<br><strong>신체 묘사</strong><br>고블린은 큰 몸통, 가느다란 팔다리, 큰 귀와 작고 빨간 눈이 달린 엄청나게 큰 머리를 가진 땅딸막한 인간형입니다. 피부색은 초록에서 회색, 파란색까지 다양하며, 종종 흉터, 종기, 발진이 있습니다. 고블린의 평균 키는 약 90cm(3피트)입니다. 대부분 대머리이며, 체모가 거의 없습니다. 들쭉날쭉한 이빨이 끊임없이 빠지고 다시 자라며, 빠른 신진대사로 끊임없이 먹고 자주 낮잠을 잡니다. 돌연변이도 다른 종족보다 고블린에게서 더 흔하며, 고블린은 보통 특히 눈에 띄는 돌연변이를 힘이나 행운의 표시로 봅니다.<br><strong>사회</strong><br>고블린은 강한 지도자에게 모이는 경향이 있어 작은 부족을 형성합니다. 이 부족은 거의 100명을 넘지 않지만, 부족이 클수록 지도자가 질서를 유지하기 위해 더 부지런해야 합니다 — 악명 높게 어려운 일입니다. 생산성이나 학습보다 놀이와 창의성이 고블린에게 더 중요하며, 야영지는 노래와 웃음으로 터져 나옵니다.<br><strong>신앙</strong><br>가장 선의의 고블린도 규칙을 따르는 데 어려움을 겪어, 고블린 모험가는 종종 자신이 법의 올바른 편에 있는지 확신하지 못합니다. 조직적 숭배도 마찬가지로 고블린을 당혹하게 하며, 대부분은 자신의 신격을 직접 고릅니다 — 강력한 괴물, 자연의 경이, 또는 매혹적으로 보이는 무엇이든. 때로는 주목할 만한 동료 고블린에게도 신적 지위를 부여합니다. 다른 혈통과 시간을 보내는 고블린은 그들의 신앙을 채택할 수 있으며, 많은 고블린 모험가가 케이든 카일리언을 숭배합니다.",
    "boost_choices": [],
    "free_boosts": 1,
    "flaw_choices": [],
    "free_flaws": 0,
    "features": [],
    "grantWeapon": ""
  },
  {
    "id": "halfling",
    "name": "하플링",
    "en": "Halfling",
    "hp": 6,
    "size": "소형",
    "speed": 25,
    "boosts": [
      "dex",
      "wis"
    ],
    "flaws": [
      "str"
    ],
    "traits": [
      "하플링",
      "인간형"
    ],
    "vision": "none",
    "languages": [
      "common",
      "halfling"
    ],
    "bonusLangs": 0,
    "desc": "어떤 곳도 자기 것이라 주장하지 않는 하플링은 마을보다 큰 정착지를 거의 지배하지 않습니다. 대신, 더 큰 도시 안에서 인간 사이에 자주 살며, 더 큰 종족과 나란히 작은 공동체를 일구어냅니다. 낙관적이고, 쾌활하며, 강한 방랑벽에 이끌리는 하플링은 작은 키를 풍부한 용기로 보충합니다. 한편으로는 흥분하기 쉽고 느긋하며, 하플링은 최고의 기회주의자이고, 그들의 열정은 폭력보다 기쁨을 선호합니다. 호기심이 때때로 모험으로 이끌지만, 하플링은 집과 가정에 대한 강한 유대도 가지고 있습니다.<br><strong>당신은 아마도...</strong><br>• 다양한 사람들과 잘 어울리고 새 친구를 만나는 것을 즐깁니다.<br>• 문제를 일으킬 것을 알면서도 호기심을 참기 어렵습니다.<br>• 상황이 아무리 절망적이더라도 항상 은색 안감이나 웃을 거리를 찾는 능력을 감상합니다.<br>• 행운을 가져다준다고 생각합니다.<br><strong>다른 사람들은 아마도...</strong><br>• 상황이 아무리 절망적이더라도 항상 은색 안감이나 웃을 거리를 찾는 능력을 감상합니다.<br>• 행운을 가져다준다고 생각합니다.<br><strong>신체 묘사</strong><br>하플링은 더 작은 인간처럼 어렴풋이 보이는 작은 인간형입니다. 키가 90cm(3피트)를 넘는 경우가 드뭅니다. 하플링의 체형은 다양하며, 일부는 약간 더 큰 머리를 가진 더 짧은 성인 인간처럼 보이고, 다른 일부는 인간 어린이에 더 가까운 체형을 가집니다.<br><strong>사회</strong><br>쾌활하고 다정한 성격에도 불구하고, 하플링은 보통 모여살지 않습니다. 내해 지역에 문화 중심지가 거의 없으며, 대신 세계의 사회들 곳곳에 자신을 짜넣는 경향이 있습니다. 하플링은 가능한 생계를 꾸리며, 많은 이가 하찮은 노동이나 단순한 서비스 직업을 합니다. 일부 하플링은 도시 생활을 거부하고 대신 열린 길을 택해 행운과 명성을 찾아 이곳저곳을 여행합니다. 이 유목민 하플링은 종종 작은 무리로 여행하며, 가까운 친구와 가족 사이에서 고난과 소박한 즐거움을 나눕니다. 하플링 이름은 보통 2~3음절이며, 거친 자음을 피하는 부드러운 소리입니다. 겸손하게 들리는 이름을 선호하며, 지나치게 길거나 복잡한 이름은 오만함의 표시로 봅니다. 그러나 엘프와 인간은 자신들의 미학에 맞는 더 긴 이름을 가질 수 있다는 것을 이해합니다.<br><strong>신앙</strong><br>하플링은 친구와 가족에게 충성하지만, 생존을 위해 필요한 일을 하는 것을 두려워하지 않습니다. 어디를 가든, 자신이 속한 사회에 매끄럽게 녹아들어 주변의 지배적 혈통의 문화와 신앙에 적응하면서 독특한 하플링식 변형을 더해, 두 문화를 풍요롭게 하는 문화적 융합을 만들어냅니다. 하플링은 데스나처럼 행운을 부여하거나, 노르고르버처럼 교활함을 장려하는 신을 선호하며, 많은 이가 해방자로서 케이든 카일리언의 역할과 주변 다른 혈통의 종교도 감사합니다.",
    "boost_choices": [],
    "free_boosts": 1,
    "flaw_choices": [],
    "free_flaws": 0,
    "features": [
      "keen-eyes"
    ],
    "grantWeapon": ""
  },
  {
    "id": "human",
    "name": "인간",
    "en": "Human",
    "hp": 8,
    "size": "중형",
    "speed": 25,
    "boosts": [],
    "flaws": [],
    "traits": [
      "인간",
      "인간형"
    ],
    "vision": "none",
    "languages": [
      "common"
    ],
    "bonusLangs": 1,
    "desc": "골라리온의 어떤 종족만큼이나 예측 불가능하고 다양한 인간은 뛰어난 추진력과 인내하고 확장하는 능력을 가지고 있습니다. 인류가 두각을 나타내기 전에 많은 문명이 번성했지만, 인간은 역사를 통틀어 가장 위대하고 가장 끔찍한 사회를 모두 건설했으며, 오늘날 내해 주변 왕국에서 가장 인구가 많은 종족입니다.<br><strong>당신은 아마도...</strong><br>• 자기 자신으로든 대의를 위해서든 위대함을 달성하기 위해 노력합니다.<br>• 세계에서 자신의 목적을 이해하려 합니다.<br>• 가족과 친구와의 관계를 소중히 여깁니다.<br>• 유연성, 적응력, 그리고 — 대부분의 경우 — 열린 마음을 존중합니다.<br>• 의도를 불신하며, 당신이 권력이나 부만을 추구한다고 두려워합니다.<br><strong>다른 사람들은 아마도...</strong><br>• 유연성, 적응력, 그리고 — 대부분의 경우 — 열린 마음을 존중합니다.<br>• 의도를 불신하며, 당신이 권력이나 부만을 추구한다고 두려워합니다.<br>• 당신에게 무엇을 기대할지 확신하지 못하고 의도를 짐작하는 것을 주저합니다.<br>• 가룬디(Garundi) — 내해 남쪽 해안을 따라 펼쳐진 나라들.<br>• 켈레쉬(Keleshites) — 동쪽 사막의 켈레쉬 제국에 기원.<br><strong>신체 묘사</strong><br>인간의 신체적 특성은 세계의 기후만큼이나 다양합니다. 피부색과 머리카락 색, 체형, 얼굴 특징이 매우 다양합니다. 일반적으로, 적도에 가까이 살았거나 조상이 살았을수록 피부 색조가 어둡습니다.<br><strong>신앙</strong><br>인간의 다양성은 정부, 태도, 사회적 규범에도 나타납니다. 가장 오래된 인간 문화는 수천 년의 공유 역사를 추적할 수 있지만, 엘프나 드워프의 사회와 비교하면 인간 문명은 제국이 분열하고 새 왕국이 옛 것을 흡수하며 끊임없이 유동하는 상태에 있는 것 같습니다.",
    "boost_choices": [],
    "free_boosts": 2,
    "flaw_choices": [],
    "free_flaws": 0,
    "features": [],
    "grantWeapon": ""
  },
  {
    "id": "leshy",
    "name": "레쉬",
    "en": "Leshy",
    "hp": 8,
    "size": "소형",
    "speed": 25,
    "boosts": [
      "con",
      "wis"
    ],
    "flaws": [
      "int"
    ],
    "traits": [
      "레쉬",
      "식물"
    ],
    "vision": "low-light",
    "languages": [
      "common",
      "fey"
    ],
    "bonusLangs": 0,
    "desc": "레시는 일시적으로 물리적 형태를 부여받은 불멸의 자연 영혼입니다. 환경의 수호자이자 사자(使者)인 레시는 숙련된 드루이드나 다른 원시 마법의 대가가 적절한 그릇을 만드는 의식을 행하고, 영혼이 임시 거처로 그 그릇을 선택할 때 \"태어납니다\". 레시는 의식이 끝나는 순간부터 자립할 수 있지만, 창조자와 평생의 유대를 유지하는 것도 드물지 않습니다. 많은 레시가 물리적 세계와 상호작용하는 기회를 즐깁니다. 대부분의 레시 영혼은 고대이지만, 과거의 삶을 거의 기억하지 못하며 새 삶을 다시 한번 세계의 경이를 경험할 기회로 봅니다.<br><strong>당신은 아마도...</strong><br>• 영역을 떠날 수 없는 자연의 수호자를 위한 여행 대리인 역할을 합니다.<br>• 문명이 자연과 협력하고 생태학적으로 친화적인 방식으로 도시를 건설하도록 격려합니다.<br>• 영적 기원 때문에 당신을 호기심의 대상으로 봅니다.<br>• 자연에 대해서만 알고 문명과 사회에 익숙하지 않다고 가정합니다.<br><strong>다른 사람들은 아마도...</strong><br>• 영적 기원 때문에 당신을 호기심의 대상으로 봅니다.<br>• 자연에 대해서만 알고 문명과 사회에 익숙하지 않다고 가정합니다.<br><strong>신체 묘사</strong><br>레시는 그릇을 만드는 데 사용된 재료만큼이나 다양하며, 보통 다양한 식물이나 균류의 기이한 혼합체로 나타납니다. 몸은 어렴풋이 인간형이며, 만들어진 식물이나 균류의 수많은 특성을 가집니다. 일반적인 레시는 약 90cm(3피트) 키입니다. 레시는 성인으로 삶을 시작하며 나이를 먹지 않습니다.<br><strong>사회</strong><br>대부분의 레시에게 가족이라는 개념은 출생의 문제가 아니라 충성과 우정의 유대로 결정됩니다. 레시는 헌신적인 동맹이지만, 자연을 황폐화하려는 자에 대한 관용은 거의 없습니다. 신뢰를 얻은 누군가를 기꺼이 가족으로 받아들이지만, 가족 구성원이 대가로 그들과 자연의 보호 대상을 돌봐주기를 기대합니다.<br><strong>신앙</strong><br>레시의 신앙은 일반적으로 자연 세계에 집중됩니다. 철학적 성향이 있는 이는 녹색 신앙(Green Faith)을 향하며, 고즈레(Gozreh)가 신앙심 있는 레시 사이에서 가장 인기 있는 신격입니다. 일부 레시는 강력한 자연 영혼인 녹색 남자(green men)도 숭배합니다.",
    "boost_choices": [],
    "free_boosts": 1,
    "flaw_choices": [],
    "free_flaws": 0,
    "features": [
      "plant-nourishment"
    ],
    "grantWeapon": ""
  },
  {
    "id": "orc",
    "name": "오크",
    "en": "Orc",
    "hp": 10,
    "size": "중형",
    "speed": 25,
    "boosts": [],
    "flaws": [],
    "traits": [
      "오크",
      "인간형"
    ],
    "vision": "darkvision",
    "languages": [
      "common",
      "orcish"
    ],
    "bonusLangs": 0,
    "desc": "오크는 태어나는 순간부터 종종 폭력과 갈등의 불꽃 속에서 단련됩니다. 잔혹하게 짧은 삶을 사는 경우가 많기에, 오크는 합당한 적에게 자신의 힘을 시험하는 것을 즐기며, 종종 공동체의 상위 구성원에게 지배권을 도전합니다. 오크는 다른 공동체에서 수용을 얻는 데 어려움을 겪으며, 많은 이들이 그들을 야만인으로 봅니다. 그러나 오크 친구의 충성을 얻은 자는 곧 오크의 충실함과 정직함이 비할 데 없음을 알게 됩니다. 오크 문화는 그들이 살아남은 도전에 의해 형성된다고 가르치며, 가장 합당한 자가 가장 많은 고난을 이겨냅니다. 장수와 큰 승리를 모두 달성한 오크는 엄청난 존경을 받습니다.<br><strong>당신은 아마도...</strong><br>• 물리적 대결에서 자신의 힘을 증명할 기회를 열심히 맞이합니다.<br>• 노환이나 질병으로 인한 평범한 죽음보다 영광스러운 전투에서의 죽음을 선호합니다.<br>• 당신을 폭력적이거나 규율이 없다고 봅니다.<br>• 솔직함과 무뚝뚝한 정직함을 감탄합니다.<br><strong>다른 사람들은 아마도...</strong><br>• 당신을 폭력적이거나 규율이 없다고 봅니다.<br>• 솔직함과 무뚝뚝한 정직함을 감탄합니다.<br><strong>신체 묘사</strong><br>오크는 키가 크고 강력하게 건장하며, 긴 팔과 굵은 다리를 가지고 있습니다. 많은 오크의 키가 210cm(7피트)를 넘지만, 넓고 거의 벌어진 자세와 어깨를 앞으로 숙이는 경향이 있습니다. 오크는 거친 피부, 두꺼운 뼈, 바위처럼 단단한 근육을 가지고 있어 전쟁과 기타 육체적으로 요구되는 작업에 적합합니다. 오크 피부색은 보통 녹색의 어떤 색조이지만, 일부 오크는 환경에 대한 적응을 반영하는 다른 피부색을 가집니다.<br><strong>사회</strong><br>대부분의 오크 공동체 — 거점(holds)이라 알려진 — 는 고통과 영광이라는 두 가지로 자신을 정의합니다. 각각은 거의 동등한 존경을 받으며, 고통은 금욕적으로 견뎌야 합니다. 많은 흉터를 지닌 채 불평 없이 부러진 다리로 걷는 오크는 전장에서 큰 승리를 거두는 자만큼의 감탄을 받습니다. 추가로, 힘이 가족과 거점 간의 역학을 정의합니다. 약한 오크는 강한 자의 뜻에 따라 일하며, 힘은 자신의 능력을 증명하는 오크 사이에서 끊임없이 변합니다. 오크는 가족의 의무를 공유하는 경향이 있어, 공동체로 아이를 키우고 거점 전체에 책임을 분담합니다.<br><strong>신앙</strong><br>흔한 오크 격언은 \"너는 너를 형성하는 흉터다\"입니다. 폭력적이고 혼돈스러운 땅에서의 폭력적이고 혼돈스러운 삶은 대부분의 오크가 폭력을 예상하고 받아들이게 합니다. 더 전쟁 지향적인 오크 공동체에서는 라마슈투와 로바구그가 흔히 숭배되며, 덜 폭력적인 거점은 불, 구원, 영광의 교리가 오크의 감성에 호소하는 사렌레이 같은 신을 숭배합니다.",
    "boost_choices": [],
    "free_boosts": 2,
    "flaw_choices": [],
    "free_flaws": 0,
    "features": [],
    "grantWeapon": ""
  }
];

const BACKGROUNDS = [
  {
    "id": "acolyte",
    "name": "수도자",
    "en": "Acolyte",
    "desc": "종교 수도원이나 수도회에서 어린 시절을 보냈습니다. 종교의 메시지를 전파하기 위해 또는 신앙의 가르침을 버렸기 때문에 세상으로 나갔을 수 있지만, 마음 깊은 곳에서는 항상 배운 교훈을 간직합니다. 속성 부스트: 지능 또는 지혜, 자유 | 기술: 종교, 필사 지식 | 기술 재주: 경전 학도",
    "effect_group_id": "eg-bg-acolyte"
  },
  {
    "id": "acrobat",
    "name": "곡예사",
    "en": "Acrobat",
    "desc": "서커스나 거리에서 곡예사로 공연하여 급료를 벌었습니다. 돈이 마르거나 기술을 더 나은 용도로 쓰기로 했을 때 모험가가 되었을 수 있습니다. 속성 부스트: 근력 또는 민첩, 자유 | 기술: 곡예, 서커스 지식 | 기술 재주: 안정된 균형",
    "effect_group_id": "eg-bg-acrobat"
  },
  {
    "id": "animal-whisperer",
    "name": "동물 소통사",
    "en": "Animal Whisperer",
    "desc": "항상 동물과 유대를 느꼈고, 그들을 훈련하는 것은 작은 도약이었습니다. 여행하며 다양한 생물을 만나 친구가 됩니다. 속성 부스트: 지혜 또는 매력, 자유 | 기술: 자연학, 지형 지식(동물이 사는 지형) | 기술 재주: 동물 훈련",
    "effect_group_id": "eg-bg-animal-whisperer"
  },
  {
    "id": "artisan",
    "name": "장인",
    "en": "Artisan",
    "desc": "도제로서 건축이나 공예의 특정 형태를 연습하여 전문 기술을 발달시켰습니다. 대장간 도제, 젊은 재단사, 조선공이었을 수 있습니다. 속성 부스트: 근력 또는 지능, 자유 | 기술: 제작, 길드 지식 | 기술 재주: 전문 제작",
    "effect_group_id": "eg-bg-artisan"
  },
  {
    "id": "artist",
    "name": "예술가",
    "en": "Artist",
    "desc": "어떤 형태든 예술이 가장 큰 열정입니다. 모험이 영감을 찾는 데 도움이 되거나, 세계적으로 유명한 예술가가 될 때까지 생존하는 방법일 수 있습니다. 속성 부스트: 민첩 또는 매력, 자유 | 기술: 제작, 예술 지식 | 기술 재주: 전문 제작",
    "effect_group_id": "eg-bg-artist"
  },
  {
    "id": "bandit",
    "name": "산적",
    "en": "Bandit",
    "desc": "과거에 적지 않은 시골 산적질이 있었습니다. 지역 귀족의 승인하에든 자발적이든, 결국 모험가의 삶에 빠졌습니다. 속성 부스트: 민첩 또는 매력, 자유 | 기술: 위협, 지형 지식 | 기술 재주: 집단 강요",
    "effect_group_id": "eg-bg-bandit"
  },
  {
    "id": "barkeep",
    "name": "술집 주인",
    "en": "Barkeep",
    "desc": "재주 다섯 가지: 통 들기, 마시기, 잔 닦기, 마시기, 마시기. 술집에서 일하며 주량을 키우고 왁자지껄 사교하는 법을 배웠습니다. 속성 부스트: 건강 또는 매력, 자유 | 기술: 외교, 술 지식 | 기술 재주: 수다쟁이",
    "effect_group_id": "eg-bg-barkeep"
  },
  {
    "id": "barrister",
    "name": "법정 변호사",
    "en": "Barrister",
    "desc": "법률 서적, 엄격한 교사, 법정 경험이 법률 문제를 가르쳤습니다. 기소나 변호가 가능하며, 급히 알아야 할 때를 위해 현지 법률에 정통합니다. 속성 부스트: 지능 또는 매력, 자유 | 기술: 외교, 법률 지식 | 기술 재주: 집단 인상",
    "effect_group_id": "eg-bg-barrister"
  },
  {
    "id": "bounty-hunter",
    "name": "현상금 사냥꾼",
    "en": "Bounty Hunter",
    "desc": "범법자를 잡아 주머니를 채웠습니다. 이타적 동기이든 보상금이 동기이든, 범죄자 추적 기술이 모험가의 삶에 쉽게 이전됩니다. 속성 부스트: 근력 또는 지혜, 자유 | 기술: 생존, 법률 지식 | 기술 재주: 숙련된 추적자",
    "effect_group_id": "eg-bg-bounty-hunter"
  },
  {
    "id": "charlatan",
    "name": "사기꾼",
    "en": "Charlatan",
    "desc": "이곳저곳을 돌아다니며 가짜 운세와 만병통치약을 팔고, 다음 마을에서는 망명 중인 왕족인 척 부유한 후계자를 유혹했습니다. 속성 부스트: 지능 또는 매력, 자유 | 기술: 기만, 뒷세계 지식 | 기술 재주: 매력적인 거짓말쟁이",
    "effect_group_id": "eg-bg-charlatan"
  },
  {
    "id": "cook",
    "name": "요리사",
    "en": "Cook",
    "desc": "주막이나 식당의 주방에서 자라며 뛰어난 요리사가 되었습니다. 굽기, 요리, 약간의 양조 — 시야 밖에서 많은 시간을 보냈으니, 직접 세상을 볼 때가 되었습니다. 속성 부스트: 건강 또는 지능, 자유 | 기술: 생존, 요리 지식 | 기술 재주: 양념 달인",
    "effect_group_id": "eg-bg-cook"
  },
  {
    "id": "criminal",
    "name": "범죄자",
    "en": "Criminal",
    "desc": "파렴치한 개인이나 지하 조직의 일원으로 범죄의 삶을 살았습니다. 구원을 찾거나, 법에서 도망치거나, 더 크고 좋은 전리품에 접근하기 위해 모험가가 되었을 수 있습니다. 속성 부스트: 민첩 또는 지능, 자유 | 기술: 은신, 뒷세계 지식 | 기술 재주: 숙련된 밀수꾼",
    "effect_group_id": "eg-bg-criminal"
  },
  {
    "id": "cultist",
    "name": "이교도",
    "en": "Cultist",
    "desc": "풍성한 수확을 위한 신성한 춤이나 어둠의 힘을 부르는 끔찍한 의식을 행하는 교단의 (전/현) 구성원입니다. 속성 부스트: 지능 또는 매력, 자유 | 기술: 오컬티즘, 신격/교단 관련 지식 | 기술 재주: 비밀 교육",
    "effect_group_id": "eg-bg-cultist"
  },
  {
    "id": "detective",
    "name": "탐정",
    "en": "Detective",
    "desc": "경찰 조사관이나 부유한 고객을 위한 사립 탐정으로 범죄를 해결했습니다. 속성 부스트: 지능 또는 지혜, 자유 | 기술: 사회, 뒷세계 지식 | 기술 재주: 거리 지혜",
    "effect_group_id": "eg-bg-detective"
  },
  {
    "id": "emissary",
    "name": "사절",
    "en": "Emissary",
    "desc": "외교관이나 전령으로 멀고 넓게 여행했습니다. 새 사람과 소통하고 동맹을 맺는 것이 생업이었습니다. 속성 부스트: 지능 또는 매력, 자유 | 기술: 사회, 도시 지식 | 기술 재주: 다국어",
    "effect_group_id": "eg-bg-emissary"
  },
  {
    "id": "entertainer",
    "name": "연예인",
    "en": "Entertainer",
    "desc": "예술 교육이나 순전한 끈기 있는 연습을 통해 관중을 즐겁게 하는 법을 배웠습니다. 배우, 무용수, 음악가, 거리 마술사 등이었을 수 있습니다. 속성 부스트: 민첩 또는 매력, 자유 | 기술: 공연, 극장 지식 | 기술 재주: 매혹적 공연",
    "effect_group_id": "eg-bg-entertainer"
  },
  {
    "id": "farmhand",
    "name": "농부",
    "en": "Farmhand",
    "desc": "강한 등과 계절 순환에 대한 이해로 땅을 갈고 작물을 돌봤습니다. 침략자가 농장을 불태웠거나, 가족을 잃었거나, 단조로움에 질렸을 수 있습니다. 속성 부스트: 건강 또는 지혜, 자유 | 기술: 운동, 농업 지식 | 기술 재주: 운동 확인",
    "effect_group_id": "eg-bg-farmhand"
  },
  {
    "id": "field-medic",
    "name": "야전 의무관",
    "en": "Field Medic",
    "desc": "전투의 혼란 속에서 급변하는 상황에 적응하며 전투 부상자를 치료했습니다. 속성 부스트: 건강 또는 지혜, 자유 | 기술: 의학, 전쟁 지식 | 기술 재주: 전투 의료",
    "effect_group_id": "eg-bg-field-medic"
  },
  {
    "id": "fortune-teller",
    "name": "점술사",
    "en": "Fortune Teller",
    "desc": "운명의 실이 분명하며, 평민이 미래를 점칠 수 있는 많은 전통적 방법을 배웠습니다. 속성 부스트: 지능 또는 매력, 자유 | 기술: 오컬티즘, 점술 지식 | 기술 재주: 기이한 것 식별",
    "effect_group_id": "eg-bg-fortune-teller"
  },
  {
    "id": "gambler",
    "name": "도박꾼",
    "en": "Gambler",
    "desc": "승리의 짜릿함이 당신을 우연의 게임으로 끌어들였습니다. 모험의 진정한 위험에 비하면 수지맞는 부업이었거나, 도박으로 몰락하여 모험을 탈출구로 삼았을 수 있습니다. 속성 부스트: 민첩 또는 매력, 자유 | 기술: 기만, 게임 지식 | 기술 재주: 거짓 간파",
    "effect_group_id": "eg-bg-gambler"
  },
  {
    "id": "gladiator",
    "name": "검투사",
    "en": "Gladiator",
    "desc": "투기장의 피의 경기가 전투 기술을 가르쳤습니다. 진정한 명성을 얻기 전에 투기장을 떠나거나 탈출하여 세상을 탐험합니다. 속성 부스트: 근력 또는 매력, 자유 | 기술: 공연, 검투 지식 | 기술 재주: 인상적 공연",
    "effect_group_id": "eg-bg-gladiator"
  },
  {
    "id": "guard",
    "name": "경비원",
    "en": "Guard",
    "desc": "애국심이나 금전적 필요로 경비대에 복무했습니다. 어려운 용의자를 말하게 하는 법을 알고 있습니다. 속성 부스트: 근력 또는 매력, 자유 | 기술: 위협, 법률 지식 또는 전쟁 지식 | 기술 재주: 빠른 강요",
    "effect_group_id": "eg-bg-guard"
  },
  {
    "id": "herbalist",
    "name": "약초사",
    "en": "Herbalist",
    "desc": "정식 약제사나 민간 의약 시골 의사로서, 다양한 약초의 치유 속성을 배웠습니다. 속성 부스트: 건강 또는 지혜, 자유 | 기술: 자연학, 약초학 지식 | 기술 재주: 자연 의학",
    "effect_group_id": "eg-bg-herbalist"
  },
  {
    "id": "hermit",
    "name": "은둔자",
    "en": "Hermit",
    "desc": "동굴, 외딴 오아시스, 격리된 저택 같은 곳에서 고독한 삶을 살았습니다. 속성 부스트: 건강 또는 지능, 자유 | 기술: 자연학 또는 오컬티즘, 지형 지식 | 기술 재주: 의심스러운 지식",
    "effect_group_id": "eg-bg-hermit"
  },
  {
    "id": "hunter",
    "name": "사냥꾼",
    "en": "Hunter",
    "desc": "야생의 동물과 다른 생물을 추적하고 잡았습니다. 가죽 벗기기, 고기 수확, 요리도 훈련의 일부였습니다. 속성 부스트: 민첩 또는 지혜, 자유 | 기술: 생존, 무두질 지식 | 기술 재주: 야생 동물 조사",
    "effect_group_id": "eg-bg-hunter"
  },
  {
    "id": "laborer",
    "name": "노동자",
    "en": "Laborer",
    "desc": "수년간 고된 육체 노동을 수행했습니다. 어려운 삶이었지만 어떻게든 살아남았습니다. 속성 부스트: 근력 또는 건강, 자유 | 기술: 운동, 노동 지식 | 기술 재주: 무거운 짐꾼",
    "effect_group_id": "eg-bg-laborer"
  },
  {
    "id": "martial-disciple",
    "name": "무예 수련생",
    "en": "Martial Disciple",
    "desc": "위대한 전사가 되기 위해 강도 높은 훈련과 엄격한 학습에 헌신했습니다. 전통적 수도원, 엘리트 군사 학교, 또는 유명 용병 조직의 지부에서 배웠을 수 있습니다. 속성 부스트: 근력 또는 민첩, 자유 | 기술: 곡예 또는 운동 중 선택, 전쟁 지식 | 기술 재주: 곡예 선택 시 고양이 착지, 운동 선택 시 빠른 점프",
    "effect_group_id": "eg-bg-martial-disciple"
  },
  {
    "id": "merchant",
    "name": "상인",
    "en": "Merchant",
    "desc": "먼지투성이 가게, 시장 노점, 또는 상인 대상에서 물건을 동전과 교역품으로 흥정했습니다. 속성 부스트: 지능 또는 매력, 자유 | 기술: 외교, 상업 지식 | 기술 재주: 흥정 사냥꾼",
    "effect_group_id": "eg-bg-merchant"
  },
  {
    "id": "miner",
    "name": "광부",
    "en": "Miner",
    "desc": "빛 없는 대지의 깊은 곳에서 귀중한 광물을 뜯어내어 생계를 유지했습니다. 속성 부스트: 근력 또는 지혜, 자유 | 기술: 생존, 광업 지식 | 기술 재주: 지하 지형 전문가",
    "effect_group_id": "eg-bg-miner"
  },
  {
    "id": "noble",
    "name": "귀족",
    "en": "Noble",
    "desc": "평민에게 귀족의 삶은 목가적 사치로 보이지만, 귀족이나 야심 찬 신사로 자라면서 현실을 알게 됩니다: 귀족의 운명은 의무와 음모입니다. 속성 부스트: 지능 또는 매력, 자유 | 기술: 사회, 족보 지식 또는 문장학 지식 | 기술 재주: 궁정 예절",
    "effect_group_id": "eg-bg-noble"
  },
  {
    "id": "nomad",
    "name": "유목민",
    "en": "Nomad",
    "desc": "멀리 넓게 여행하며 도로와 미지의 땅에서 살아남는 기본 전술을 배웠습니다. 속성 부스트: 건강 또는 지혜, 자유 | 기술: 생존, 지형 지식 | 기술 재주: 생존 확인",
    "effect_group_id": "eg-bg-nomad"
  },
  {
    "id": "prisoner",
    "name": "수감자",
    "en": "Prisoner",
    "desc": "범죄(유죄든 아니든)로 투옥되거나 처벌받았습니다. 형기가 끝나거나 탈옥한 후 새로운 자유를 최대한 활용합니다. 속성 부스트: 근력 또는 건강, 자유 | 기술: 은신, 뒷세계 지식 | 기술 재주: 숙련된 밀수꾼",
    "effect_group_id": "eg-bg-prisoner"
  },
  {
    "id": "raised-by-belief",
    "name": "신앙에 의해 양육됨",
    "en": "Raised by Belief",
    "desc": "수도원, 종교적 가정, 또는 일상생활의 일부로, 특정 신격의 전통에 깊이 젖은 양육을 받았습니다. 속성 부스트: 신격의 신성 속성 중 하나, 자유 | 기술: 신격의 신성 기술, 신격 관련 지식 | 기술 재주: 해당 기술의 확인",
    "effect_group_id": "eg-bg-raised-by-belief"
  },
  {
    "id": "sailor",
    "name": "선원",
    "en": "Sailor",
    "desc": "어린 나이에 바다의 부름을 들었습니다. 상선에 올랐거나, 해군에 입대했거나, 해적과 불량배 무리에 합류했을 수 있습니다. 속성 부스트: 근력 또는 민첩, 자유 | 기술: 운동, 항해 지식 | 기술 재주: 수중 약탈자",
    "effect_group_id": "eg-bg-sailor"
  },
  {
    "id": "scholar",
    "name": "학자",
    "en": "Scholar",
    "desc": "배우는 재능이 있어 바깥 세계에서 격리되어 할 수 있는 모든 것을 배웠습니다. 책에서 많은 경이로운 장소와 사물을 읽었고, 결국 호기심이 모험가가 되게 했습니다. 속성 부스트: 지능 또는 지혜, 자유 | 기술: 주문학/자연학/오컬티즘/종교 중 선택, 학술원 지식 | 기술 재주: 선택한 기술의 확인",
    "effect_group_id": "eg-bg-scholar"
  },
  {
    "id": "scout",
    "name": "정찰병",
    "en": "Scout",
    "desc": "야생을 고향이라 부르며 길을 찾고 여행자를 안내했습니다. 속성 부스트: 민첩 또는 지혜, 자유 | 기술: 생존, 지형 지식 | 기술 재주: 채집가",
    "effect_group_id": "eg-bg-scout"
  },
  {
    "id": "street-urchin",
    "name": "거리의 부랑아",
    "en": "Street Urchin",
    "desc": "대도시의 거리에서 소매치기로 근근이 살며 다음 끼니를 어디서 구할지 모르는 생활을 했습니다. 속성 부스트: 민첩 또는 건강, 자유 | 기술: 도둑질, 도시 지식 | 기술 재주: 소매치기",
    "effect_group_id": "eg-bg-street-urchin"
  },
  {
    "id": "teacher",
    "name": "교사",
    "en": "Teacher",
    "desc": "놀라울 정도로 지식이 풍부하고, 아이와 어른에게 세계와 경이에 대해 가르치는 데 숙련되고 훈련까지 받았을 수 있습니다. 속성 부스트: 지능 또는 지혜, 자유 | 기술: 공연 또는 사회 중 선택, 학술원 지식 | 기술 재주: 숙련된 전문가",
    "effect_group_id": "eg-bg-teacher"
  },
  {
    "id": "tinker",
    "name": "수선공",
    "en": "Tinker",
    "desc": "온갖 종류의 소소한 발명품을 만드는 것이 문제 해결 욕구를 충족시킵니다. 엔지니어링 기술이 특히 창의적이며, 다음에 무엇을 만들지 아무도 모릅니다. 속성 부스트: 민첩 또는 지능, 자유 | 기술: 제작, 공학 지식 | 기술 재주: 전문 제작",
    "effect_group_id": "eg-bg-tinker"
  },
  {
    "id": "warrior",
    "name": "전사",
    "en": "Warrior",
    "desc": "젊은 시절에 용병, 유목민을 보호하는 전사, 또는 민병대나 군대의 일원으로 전투에 뛰어들었습니다. 속성 부스트: 근력 또는 건강, 자유 | 기술: 위협, 전쟁 지식 | 기술 재주: 위협적 노려보기",
    "effect_group_id": "eg-bg-warrior"
  }
];

const HERITAGE_DB = [
  {
    "id": "ancient-blooded-dwarf",
    "name_ko": "고대혈 드워프",
    "name_en": "Ancient-Blooded Dwarf",
    "ancestry": "dwarf",
    "summary": "옛 드워프 영웅들은 적의 마법을 떨쳐낼 수 있었고, 그 저항의 일부가 당신에게 나타납니다. <em>고대의 피에 호소(Call on Ancient Blood)</em> 반응을 얻습니다."
  },
  {
    "id": "death-warden-dwarf",
    "name_ko": "죽음 감시자 드워프",
    "name_en": "Death Warden Dwarf",
    "ancestry": "dwarf",
    "summary": "조상이 무덤 수호자였으며, 죽음을 물리치는 힘이 당신에게 전해졌습니다. 공허(void) 특성이 있거나 언데드 생물이 만든 효과에 대한 내성 굴림에서 <strong>성공을 굴리면 대성공</strong>이 됩니다."
  },
  {
    "id": "forge-dwarf",
    "name_ko": "단조 드워프",
    "name_en": "Forge Dwarf",
    "ancestry": "dwarf",
    "summary": "뜨거운 환경에 대한 놀라운 적응력이 있습니다. 레벨 절반만큼의 화염 저항(최소 1)을 얻고, 환경 열 효과를 한 단계 낮게 취급합니다(극심한 열은 극한으로, 극한 열은 심한으로, 등).",
    "effect_group_id": "eg-heritage-forge-dwarf"
  },
  {
    "id": "rock-dwarf",
    "name_ko": "바위 드워프",
    "name_en": "Rock Dwarf",
    "ancestry": "dwarf",
    "summary": "조상이 산의 고대 돌 사이나 대지의 깊은 곳에서 살고 일했습니다. 이것은 발을 딛고 서면 바위처럼 단단하게 만듭니다. 재배치(Reposition), 밀기(Shove), 넘어뜨리기(Trip) 시도에 대한 인내 또는 반사 DC에 <strong>+2 상황 보너스</strong>를 얻습니다. 이 보너스는 이동시키거나 엎드리게 하려는 주문이나 효과에 대한 내성 굴림에도 적용됩니다.<br>추가로, 어떤 효과가 당신을 <strong>10피트 이상 강제 이동</strong>시키면, <strong>절반 거리만</strong> 이동합니다."
  },
  {
    "id": "strong-blooded-dwarf",
    "name_ko": "강혈 드워프",
    "name_en": "Strong-Blooded Dwarf",
    "ancestry": "dwarf",
    "summary": "피가 강하고 건강하여 독소를 떨쳐낼 수 있습니다. 레벨 절반만큼의 독 저항(최소 1)을 얻고, 독 고통에 대한 성공적인 내성 굴림은 단계를 2만큼 감소시킵니다(맹독(virulent poison)은 1). 독에 대한 대성공은 단계를 3만큼 감소시킵니다(맹독은 2).",
    "effect_group_id": "eg-heritage-strong-blooded-dwarf"
  },
  {
    "id": "ancient-elf",
    "name_ko": "고대 엘프",
    "name_en": "Ancient Elf",
    "ancestry": "elf",
    "summary": "긴 삶에서 많은 길과 많은 양식을 섭렵했습니다. 전형적인 고대 엘프는 최소 100세이지만, GM 재량으로 더 젊을 수 있습니다. 자신의 것이 아닌 <strong>다른 클래스의 멀티클래스 헌신 재주</strong>를 얻습니다. 레벨 전제조건을 충족하지 않아도 되지만(215페이지), 다른 전제조건은 여전히 충족해야 합니다."
  },
  {
    "id": "arctic-elf",
    "name_ko": "극지 엘프",
    "name_en": "Arctic Elf",
    "ancestry": "elf",
    "summary": "얼어붙은 북방 깊숙이 거주하며 추운 환경에 대한 놀라운 저항력을 얻었습니다. 레벨 절반만큼의 냉기 저항(최소 1)을 얻고, 환경 추위 효과를 한 단계 낮게 취급합니다(극심한 추위는 극한으로, 극한 추위는 심한으로, 등).",
    "effect_group_id": "eg-heritage-arctic-elf"
  },
  {
    "id": "cavern-elf",
    "name_ko": "동굴 엘프",
    "name_en": "Cavern Elf",
    "ancestry": "elf",
    "summary": "지하 터널이나 동굴에서 태어났거나 오랜 세월을 보냈으며, 빛이 부족한 곳입니다. <strong>암시야(darkvision)</strong>를 얻습니다.",
    "effect_group_id": "eg-heritage-cavern-elf"
  },
  {
    "id": "seer-elf",
    "name_ko": "예언자 엘프",
    "name_en": "Seer Elf",
    "ancestry": "elf",
    "summary": "마법 현상을 감지하고 이해하는 타고난 능력이 있습니다. 마법 탐지(detect magic) 캔트립을 비전 선천 주문으로 자유롭게 시전할 수 있습니다. 캔트립은 레벨 절반(올림)과 같은 주문 랭크로 고양됩니다. 추가로, 마법 식별(Identify Magic) 판정과 마법적 성질의 문서 해독(Decipher Writing) 판정에 +1 상황 보너스를 얻습니다. 이 기술 행동은 일반적으로 주문학, 자연학, 오컬티즘, 종교 기술을 사용합니다.",
    "effect_group_id": "eg-heritage-seer-elf"
  },
  {
    "id": "whisper-elf",
    "name_ko": "속삭임 엘프",
    "name_en": "Whisper Elf",
    "ancestry": "elf",
    "summary": "귀가 섬세하게 조율되어 가장 미세한 소리의 속삭임도 감지할 수 있습니다. 30피트 내의 숨겨진(hidden) 또는 미탐지(undetected) 생물을 찾기 위해 탐색(Seek) 행동을 사용할 때 <strong>+2 상황 보너스</strong>를 얻습니다. 은폐(concealed)된 대상이나 숨겨진 대상을 공격할 때, 단순 판정의 DC를 은폐는 <strong>3</strong>으로, 숨김은 <strong>9</strong>로 줄입니다. 이 혜택은 들을 수 없거나 대상이 소리를 낼 수 없는 경우(예: 침묵 주문의 영향)에는 적용되지 않습니다."
  },
  {
    "id": "woodland-elf",
    "name_ko": "삼림 엘프",
    "name_en": "Woodland Elf",
    "ancestry": "elf",
    "summary": "숲, 깊은 정글, 또는 유사한 환경에서의 삶에 적응하여 나무를 오르고 잎사귀를 활용하는 법을 알고 있습니다. 나무, 덩굴, 기타 식물을 오를 때, <strong>성공 시 절반 속도로, 대성공 시 전체 속도</strong>로 이동합니다(빠른 등반(Quick Climb)이 있으면 성공 시에도 전체 속도). 등반 속도가 있으면 영향받지 않습니다.<br>숲 지형 내에 있을 때, 장애물 뒤에 있지 않더라도 항상 <strong>엄폐 행동(Take Cover)</strong>을 사용하여 엄폐를 얻을 수 있습니다."
  },
  {
    "id": "chameleon-gnome",
    "name_ko": "카멜레온 노움",
    "name_en": "Chameleon Gnome",
    "ancestry": "gnome",
    "summary": "머리카락과 피부의 색이 변할 수 있으며, 아마도 첫 번째 세계의 영향이나 남아있는 환영 효과 때문입니다. 생동감과 정확한 색상을 천천히 바꿀 수 있고, 몸 전체에서 다르게 하여 패턴이나 다른 화려한 디자인을 만들 수 있습니다. 사소한 국소 변화에는 <strong>단일 행동</strong>이, 몸 전체의 극적인 변화에는 <strong>최대 1시간</strong>이 걸립니다. 잠자는 동안 색상이 꿈에 맞춰 저절로 변하여, 매일 아침 독특한 색상이 됩니다.<br>색상이 환경과 대략 유사한 지역(예: 숲에서 숲의 초록)에 있을 때:<br>환경 위장 [1행동] 주변 환경에 섞이도록 사소한 국소 변화를 합니다. 주변 환경의 색상이나 패턴이 바뀔 때까지 은신(Stealth) 판정에 <strong>+2 상황 보너스</strong>를 얻습니다."
  },
  {
    "id": "fey-touched-gnome",
    "name_ko": "페이혈 노움",
    "name_en": "Fey-Touched Gnome",
    "ancestry": "gnome",
    "summary": "페이의 피가 혈관을 흐르며, 마법으로 포화시켜 진정으로 그들 중 하나로 만듭니다. 노움과 인간형 특성에 더하여 페이(fey) 특성을 얻습니다. 원시(Primal) 주문 목록에서 캔트립 1개를 선택합니다. 이 주문을 원시 선천 주문으로 자유롭게 시전할 수 있습니다. 캔트립은 레벨 절반(올림)과 같은 주문 랭크로 고양됩니다. 하루에 1회, 10분간의 명상(집중 특성 있는 활동)으로 첫 번째 세계와 재정렬하여 이 캔트립을 같은 목록의 다른 것으로 변경할 수 있습니다.",
    "effect_group_id": "eg-heritage-fey-touched-gnome"
  },
  {
    "id": "sensate-gnome",
    "name_ko": "감각 노움",
    "name_en": "Sensate Gnome",
    "ancestry": "gnome",
    "summary": "모든 색을 더 밝게, 모든 소리를 더 풍부하게, 특히 모든 냄새를 놀라운 세부 사항으로 느낍니다. 특수 감각을 얻습니다: <strong>30피트 범위의 부정확 후각(imprecise scent)</strong>. 이것은 후각으로 생물의 정확한 위치를 결정할 수 있다는 의미입니다(434페이지 설명). GM은 일반적으로 바람이 생물로부터 불어오면 범위를 두 배로, 생물로 불어가면 절반으로 합니다.<br>추가로, 후각 범위 내에서 미탐지(undetected) 생물을 찾으려 할 때 지각 판정에 <strong>+2 상황 보너스</strong>를 얻습니다.",
    "effect_group_id": "eg-heritage-sensate-gnome"
  },
  {
    "id": "umbral-gnome",
    "name_ko": "암영 노움",
    "name_en": "Umbral Gnome",
    "ancestry": "gnome",
    "summary": "어둡거나 그림자의 페이와의 연결이든, 드라트넬라르(drathnelar)로 알려진 지하 노움이든, 다른 원천이든, 완전한 어둠에서도 볼 수 있습니다. <strong>암시야(darkvision)</strong>를 얻습니다.",
    "effect_group_id": "eg-heritage-umbral-gnome"
  },
  {
    "id": "wellspring-gnome",
    "name_ko": "원천 노움",
    "name_en": "Wellspring Gnome",
    "ancestry": "gnome",
    "summary": "다른 마법 원천이 페이 혈통의 원시 마법보다 당신을 더 강하게 붙잡고 있습니다. 이 연결은 오컬트 차원이나 고대 오컬트 노래, 신격/천상체/악마, 마법사 전쟁이 남긴 마법 유출물, 또는 고대 룬 마법에서 올 수 있습니다. 비전, 신성, 오컬트 중 하나를 선택합니다. 해당 마법 전통의 주문 목록에서 캔트립 1개를 얻습니다. 이 주문을 선택한 전통의 선천 주문으로 자유롭게 시전할 수 있습니다. 캔트립은 레벨 절반(올림)과 같은 주문 랭크로 고양됩니다. 노움 혈통 재주에서 원시 선천 주문을 얻을 때마다, 그 전통을 원시에서 선택한 전통으로 변경합니다.",
    "effect_group_id": "eg-heritage-wellspring-gnome"
  },
  {
    "id": "charhide-goblin",
    "name_ko": "숯가죽 고블린",
    "name_en": "Charhide Goblin",
    "ancestry": "goblin",
    "summary": "조상은 항상 불과의 연결과 더 두꺼운 피부를 가져 화상에 저항할 수 있었습니다. 레벨 절반만큼의 화염 저항(최소 1)을 얻습니다. 지속 화염 피해를 제거하기 위한 단순 판정이 DC 15 대신 DC 10이며, 다른 생물이 도우면 DC 5로 줄어듭니다.",
    "effect_group_id": "eg-heritage-charhide-goblin"
  },
  {
    "id": "irongut-goblin",
    "name_ko": "철위장 고블린",
    "name_en": "Irongut Goblin",
    "ancestry": "goblin",
    "summary": "대부분의 사람이 상한 것으로 여기는 음식으로 살아갈 수 있습니다. 쓰레기가 쉽게 구할 수 있다면, 생존 활동 없이도 정착지에서 빈곤한 식사로 살아갈 수 있습니다. 메스꺼움 상태일 때도 먹고 마실 수 있습니다.<br>고통에 대한 내성, 메스꺼움 상태 얻기/제거에 <strong>+2 상황 보너스</strong>를 얻습니다. 이 보너스의 영향을 받는 인내 내성에서 <strong>성공 시 대성공</strong>이 됩니다. 섭취한 것에서 비롯된 경우에만 적용됩니다."
  },
  {
    "id": "razortooth-goblin",
    "name_ko": "면도이빨 고블린",
    "name_en": "Razortooth Goblin",
    "ancestry": "goblin",
    "summary": "가족의 이빨은 무시무시한 무기입니다. <strong>1d6 관통 피해</strong>의 턱(jaws) 비무장 공격을 얻습니다. 격투 그룹이며 기교와 비무장 특성을 가집니다.",
    "effect_group_id": "eg-heritage-razortooth-goblin"
  },
  {
    "id": "snow-goblin",
    "name_ko": "눈 고블린",
    "name_en": "Snow Goblin",
    "ancestry": "goblin",
    "summary": "혹한 지역에 적응하여 하늘색~남색 피부와 파란 털을 가집니다. 레벨 절반만큼의 냉기 저항(최소 1)을 얻고, 환경 추위 효과를 한 단계 낮게 취급합니다.",
    "effect_group_id": "eg-heritage-snow-goblin"
  },
  {
    "id": "unbreakable-goblin",
    "name_ko": "부서지지 않는 고블린",
    "name_en": "Unbreakable Goblin",
    "ancestry": "goblin",
    "summary": "두꺼운 두개골, 연골성 뼈, 또는 다른 양날의 축복 덕분에 부상에서 쉽게 회복합니다. 혈통에서 6 대신 <strong>10 HP</strong>를 얻습니다. 추락 시, 절반 거리에서 떨어진 것처럼 피해를 줄입니다.",
    "effect_group_id": "eg-heritage-unbreakable-goblin"
  },
  {
    "id": "gutsy-halfling",
    "name_ko": "대담한 하플링",
    "name_en": "Gutsy Halfling",
    "ancestry": "halfling",
    "summary": "가문은 위기 상황에서 냉정을 유지하고 공포를 떨쳐내는 것으로 알려져 있습니다. 감정(emotion) 효과에 대한 내성에서 <strong>성공을 굴리면 대성공</strong>이 됩니다."
  },
  {
    "id": "hillock-halfling",
    "name_ko": "언덕 하플링",
    "name_en": "Hillock Halfling",
    "ancestry": "halfling",
    "summary": "언덕의 평화로운 삶에 익숙하여, 특히 안락한 생활을 즐길 때 휴식과 이완이 특히 회복적입니다. 밤새 HP를 회복할 때, <strong>회복된 HP에 레벨을 더합니다</strong>. 누군가 의학으로 상처 치료를 할 때, 간식을 먹으면 <strong>치료로 회복되는 HP에 레벨을 더합니다</strong>.",
    "effect_group_id": "eg-heritage-hillock-halfling"
  },
  {
    "id": "nomadic-halfling",
    "name_ko": "유목 하플링",
    "name_en": "Nomadic Halfling",
    "ancestry": "halfling",
    "summary": "조상이 세대에 걸쳐 이곳저곳을 여행하며 정착하는 데 만족하지 않았습니다. 사용 가능한 일반/비일반 언어에서 <strong>추가 언어 2개</strong>를 얻고, 다국어(Multilingual) 재주를 가질 때마다 <strong>추가 1개</strong>를 더 얻습니다.",
    "effect_group_id": "eg-heritage-nomadic-halfling"
  },
  {
    "id": "twilight-halfling",
    "name_ko": "황혼 하플링",
    "name_en": "Twilight Halfling",
    "ancestry": "halfling",
    "summary": "조상이 해질녘의 은폐 속에서 많은 비밀스러운 행동을 했으며, 시간이 지나며 하플링의 일반적인 예리한 시야를 넘어 황혼에서도 볼 수 있는 능력을 발달시켰습니다. <strong>저광 시야(low-light vision)</strong>를 얻습니다.",
    "effect_group_id": "eg-heritage-twilight-halfling"
  },
  {
    "id": "wildwood-halfling",
    "name_ko": "야생림 하플링",
    "name_en": "Wildwood Halfling",
    "ancestry": "halfling",
    "summary": "정글이나 숲 깊숙이 출신이며, 작은 체구로 덤불과 다른 장애물 사이를 비집고 지나가는 법을 배웠습니다. 식물과 곰팡이로 인한 <strong>험지를 무시</strong>합니다(덤불, 덩굴, 수풀 등)."
  },
  {
    "id": "skilled-human",
    "name_ko": "숙련된 인간",
    "name_en": "Skilled Human",
    "ancestry": "human",
    "summary": "독창성이 다양한 기술에 숙련되게 합니다. 선택한 <strong>기술 1개에 숙련</strong>됩니다. 5레벨에서 해당 기술에 <strong>전문가</strong>가 됩니다."
  },
  {
    "id": "versatile-human",
    "name_ko": "다재다능한 인간",
    "name_en": "Versatile Human",
    "ancestry": "human",
    "summary": "인류의 다재다능함과 야망이 대부분의 나라에서 가장 흔한 혈통으로 부상하게 했습니다. 전제조건을 충족하는 <strong>일반 재주 1개</strong>를 선택합니다(혈통 재주처럼 캐릭터 생성 중 어느 시점에서든 선택 가능)."
  },
  {
    "id": "fungus-leshy",
    "name_ko": "균류 레쉬",
    "name_en": "Fungus Leshy",
    "ancestry": "leshy",
    "summary": "동굴과 나무 그늘에서 자라는 균류로 만들어졌으며, 어둠 동굴과 터널이 편합니다. <strong>암시야(darkvision)</strong>를 얻습니다. 식물 특성을 잃고 <strong>균류(fungus) 특성</strong>을 얻습니다.",
    "effect_group_id": "eg-heritage-fungus-leshy"
  },
  {
    "id": "gourd-leshy",
    "name_ko": "호박 레쉬",
    "name_en": "Gourd Leshy",
    "ancestry": "leshy",
    "summary": "큰 호박이 두개골입니다. 물리적 뇌가 없어 머리 안의 공간을 사용할 수 있습니다. 머리 안에 최대 <strong>1 부피의 물건</strong>을 저장할 수 있습니다. 머리에서 물건을 훔치려는 판정 DC가 4 증가합니다. 물건을 하나만 저장하면, 다른 행동의 일부로 손에 쉽게 꺼낼 수 있습니다(조작 특성 추가)."
  },
  {
    "id": "leaf-leshy",
    "name_ko": "잎 레쉬",
    "name_en": "Leaf Leshy",
    "ancestry": "leshy",
    "summary": "몸이 대부분 자연 잎으로 만들어져, 나무에서 떨어지는 잎처럼 특히 우아하게 추락합니다. 추락 거리에 관계없이 <strong>추락 피해를 받지 않습니다</strong>."
  },
  {
    "id": "vine-leshy",
    "name_ko": "덩굴 레쉬",
    "name_en": "Vine Leshy",
    "ancestry": "leshy",
    "summary": "잡을 수 있는 덩굴이 등반에 비할 데 없는 기술을 부여합니다. 등반에 <strong>빈 손이 필요하지 않습니다</strong>. 등반 운동 판정에서 <strong>성공을 굴리면 대성공</strong>."
  },
  {
    "id": "badlands-orc",
    "name_ko": "황무지 오크",
    "name_en": "Badlands Orc",
    "ancestry": "orc",
    "summary": "태양에 타는 황무지 출신으로, 긴 다리와 요소를 견디는 능력이 번성에 도움이 되었습니다. 탐험 중 멈추기 전까지 <strong>급행(Hustle)을 두 배 오래</strong> 할 수 있고, 환경 열 효과를 한 단계 낮게 취급합니다."
  },
  {
    "id": "battle-ready-orc",
    "name_ko": "전투 준비 오크",
    "name_en": "Battle-Ready Orc",
    "ancestry": "orc",
    "summary": "두려운 전장 지휘관의 혈통입니다. <strong>위협(Intimidation)에 숙련</strong>되고, <strong>위협적 노려보기(Intimidating Glare)</strong> 기술 재주를 얻습니다.",
    "effect_group_id": "eg-heritage-battle-ready-orc"
  },
  {
    "id": "deep-orc",
    "name_ko": "심연 오크",
    "name_en": "Deep Orc",
    "ancestry": "orc",
    "summary": "굳은살이 박힌 손과 빨간 눈이 산악 동굴의 깊은 어둠에서 보낸 삶을 말해줍니다. 지하 지형에 대한 <strong>지형 전문가(Terrain Expertise)</strong> 기술 재주와 <strong>전투 등반가(Combat Climber)</strong> 기술 재주를 얻습니다.",
    "effect_group_id": "eg-heritage-deep-orc"
  },
  {
    "id": "hold-scarred-orc",
    "name_ko": "흉터 오크",
    "name_en": "Hold-Scarred Orc",
    "ancestry": "orc",
    "summary": "의례적 흉터나 문신에 참여하는 오크 공동체의 일원입니다. 혈통에서 10 대신 <strong>12 HP</strong>를 얻습니다. <strong>불굴(Diehard)</strong> 재주도 얻습니다.",
    "effect_group_id": "eg-heritage-hold-scarred-orc"
  },
  {
    "id": "rainfall-orc",
    "name_ko": "우림 오크",
    "name_en": "Rainfall Orc",
    "ancestry": "orc",
    "summary": "열대 우림에서 태어나 정글 지형을 민첩하게 이동하고 습한 환경의 질병에 저항합니다. 등반(Climb)이나 수영(Swim) 운동 판정에 <strong>+2 상황 보너스</strong>, 질병에 대한 내성에 <strong>+1 상황 보너스</strong>."
  },
  {
    "id": "changeling",
    "name_ko": "체인질링",
    "name_en": "Changeling",
    "ancestry": "*",
    "summary": "어머니가 해그(hag)입니다. 눈의 홍채이색증이 이 혈통의 가장 명확한 표시입니다.<br><br><b>체인질링(changeling) 특성</b>을 얻습니다. <b>저광 시야</b>를 얻거나, 혈통이 이미 저광 시야가 있으면 <b>암시야</b>를 얻습니다. 혈통 재주를 얻을 때마다 체인질링 재주와 다른 부모 혈통의 재주에서 선택할 수 있습니다.",
    "effect_group_id": "eg-heritage-changeling"
  },
  {
    "id": "nephilim",
    "name_ko": "네피림",
    "name_en": "Nephilim",
    "ancestry": "*",
    "summary": "필멸자와 불멸 존재의 거래에서 태어난 차원 혈손(planar scions). 다른 차원의 초자연적 정수를 물려받아 독특한 신체적 특징과 초세속적 힘으로 나타납니다. 천사, 악마(fiend), 주시자(monitor) 등에게까지 유산을 추적할 수 있습니다.<br><br>천상체(celestial), 악마, 또는 주시자의 영향을 받은 본성. 황금 눈, 후광, 뿔, 꼬리 같은 특징의 조합. <b>네피림(nephilim) 특성</b>을 얻습니다. <b>저광 시야</b>를 얻거나, 혈통이 이미 저광 시야가 있으면 <b>암시야</b>를 얻습니다. 혈통 재주를 얻을 때마다 네피림 재주와 혈통 재주에서 선택 가능.",
    "effect_group_id": "eg-heritage-nephilim"
  },
  {
    "id": "aiuvarin",
    "name_ko": "아이우바린 (반엘프)",
    "name_en": "Aiuvarin (Half-Elf)",
    "ancestry": "*",
    "summary": "다른 혈통의 사람들과 엘프의 자녀, 그리고 그 자녀의 자녀를 \"아이우바린\"이라 부르며, 이것은 너무 빨리 땅에 떨어지는 잎에 대한 엘프 시입니다. 가장 친숙한 아이우바린은 엘프와 인간 사이에서 태어나며, 흔히 \"하프엘프\"로 불립니다.<br><br>아이우바린의 삶은 어려울 수 있으며, 종종 적응하기 위한 분투로 점철됩니다. 인간 부모가 있는 아이우바린은 보통 약 150년을 삽니다.<br><br>가족 계보에 엘프나 다른 아이우바린이 있습니다. 뾰족한 귀와 엘프 유산의 다른 표시가 있습니다. <b>엘프(elf) 특성</b>, <b>아이우바린(aiuvarin) 특성</b>, <b>저광 시야</b>를 얻습니다. 혈통 재주를 얻을 때 아이우바린과 엘프 재주에서도 선택 가능.",
    "effect_group_id": "eg-heritage-aiuvarin"
  },
  {
    "id": "dromaar",
    "name_ko": "드로마르 (반오크)",
    "name_en": "Dromaar (Half-Orc)",
    "ancestry": "*",
    "summary": "벨크젠의 오크가 속삭이는 폭군에 대한 전쟁의 핵심 선봉이 되면서, 다른 혈통의 동맹과 함께 싸우며, 오크 유산과 다른 혈통이 섞인 아이들이 늘었습니다. 이 \"하프오크\"들 중 많은 이가 자신을 \"드로마르\"라 칭하며, 이것은 무리를 전쟁으로 행군시키는 북을 치는 자를 가리키는 오크어입니다.<br><br>인간 부모가 있는 드로마르는 보통 약 70세까지 삽니다.<br><br>오크의 힘이 혈통에 힘을 줍니다. 피부가 녹색 빛을 띠고 오크 유산의 다른 표시가 있습니다. <b>오크(orc) 특성</b>, <b>드로마르(dromaar) 특성</b>, <b>저광 시야</b>를 얻습니다. 혈통 재주를 얻을 때 드로마르와 오크 재주에서도 선택 가능.",
    "effect_group_id": "eg-heritage-dromaar"
  }
];

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
    "desc": "이 무기로 밀기(Shove) 특수 공격을 시도할 수 있음."
  },
  {
    "id": "막기",
    "name_ko": "막기",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기를 장비한 채 막기(Parry) 행동을 사용할 수 있음."
  },
  {
    "id": "덫",
    "name_ko": "덫",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기로 넘어뜨리기(Trip) 특수 공격을 시도할 수 있음."
  },
  {
    "id": "무장해제",
    "name_ko": "무장해제",
    "name_en": "",
    "type": "weapon",
    "desc": "이 무기로 무장해제(Disarm) 특수 공격을 시도할 수 있음."
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
    "desc": "기본 피해 유형 대신 둔기(B) 피해 유형을 선택할 수 있음."
  },
  {
    "id": "다용도 P",
    "name_ko": "다용도 P",
    "name_en": "",
    "type": "weapon",
    "desc": "기본 피해 유형 대신 관통(P) 피해 유형을 선택할 수 있음."
  },
  {
    "id": "다용도 S",
    "name_ko": "다용도 S",
    "name_en": "",
    "type": "weapon",
    "desc": "기본 피해 유형 대신 참격(S) 피해 유형을 선택할 수 있음."
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
    "desc": "속박 + 무방비. 탈출(Escape)로 빠져나옴."
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
    "desc": "신비(Arcane) 마법 전통. 비전 마법."
  },
  {
    "id": "신성",
    "name_ko": "신성",
    "name_en": "",
    "type": "damage",
    "desc": "신성(Divine) 마법 전통. 신격에서 힘을 얻음."
  },
  {
    "id": "오컬트",
    "name_ko": "오컬트",
    "name_en": "",
    "type": "mechanic",
    "desc": "오컬트(Occult) 마법 전통. 우주의 신비를 탐구."
  },
  {
    "id": "원시",
    "name_ko": "원시",
    "name_en": "",
    "type": "mechanic",
    "desc": "원시(Primal) 마법 전통. 자연의 힘."
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
    "desc": "시전자가 매 턴 지속(Sustained) 행동으로 유지해야 함."
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
    "desc": "공포의 감정을 유발하는 효과. 항상 정신(mental)과 감정(emotion) 특성도 가집니다."
  },
  {
    "id": "감정",
    "name_ko": "감정",
    "name_en": "",
    "type": "mechanic",
    "desc": "생물의 감정을 변화시키는 효과. 항상 정신(mental) 특성도 가집니다. 특수 훈련을 받았거나 기계적/인공 지능을 가진 생물은 감정 효과에 면역입니다."
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
    "desc": "인간형(Humanoid) 생물 분류. 직립 보행, 팔 2개 다리 2개."
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
    "desc": "식물(Plant) 생물 분류. 일반 식물과 구별됨."
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
    "desc": "활력(Vitality) 에너지. 산 것을 치유하고 언데드에 피해."
  },
  {
    "id": "공허",
    "name_ko": "공허",
    "name_en": "",
    "type": "weapon",
    "desc": "공허(Void) 에너지. 산 것에 피해, 언데드를 치유."
  },
  {
    "id": "변이",
    "name_ko": "변이",
    "name_en": "",
    "type": "weapon",
    "desc": "생물의 형태를 약간 변형하는 주문. 변이 효과가 부여하는 타격은 마법 특성을 얻습니다. 여러 변이 효과를 동시에 받을 수 있지만, 같은 신체 부위를 두 번 이상 변이하면 두 번째 효과가 첫 번째를 상쇄하려 시도합니다. 변신(polymorph) 효과가 변이를 무효화하면 변이가 종료될 수 있습니다."
  },
  {
    "id": "탐지",
    "name_ko": "탐지",
    "name_en": "",
    "type": "mechanic",
    "desc": "탐지(Detection) 효과. 무언가의 존재를 감지."
  },
  {
    "id": "투시",
    "name_ko": "투시",
    "name_en": "",
    "type": "weapon",
    "desc": "투시(Scrying) 효과. 원거리에서 대상을 관찰."
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
    "desc": "작곡(Composition) 작곡 주문. 바드 전용."
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
    "desc": "은밀(Subtle). 주문 시전의 시각/청각 표시가 없음."
  },
  {
    "id": "강력",
    "name_ko": "강력",
    "name_en": "",
    "type": "weapon",
    "desc": "강력(Flourish). 턴당 1회만 사용 가능."
  },
  {
    "id": "성별화",
    "name_ko": "성별화",
    "name_en": "",
    "type": "weapon",
    "desc": "성별화(Sanctified). 신성 또는 불경 효과."
  },
  {
    "id": "대지",
    "name_ko": "대지",
    "name_en": "",
    "type": "weapon",
    "desc": "대지(Earth) 원소 효과."
  },
  {
    "id": "공기",
    "name_ko": "공기",
    "name_en": "",
    "type": "weapon",
    "desc": "공기(Air) 원소 효과."
  },
  {
    "id": "물",
    "name_ko": "물",
    "name_en": "",
    "type": "weapon",
    "desc": "물(Water) 원소 효과."
  },
  {
    "id": "그림자",
    "name_ko": "그림자",
    "name_en": "",
    "type": "weapon",
    "desc": "그림자(Shadow) 효과."
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
    "desc": "환영(Illusion) 효과. 감각을 속입니다."
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
    "id": "힘",
    "name_ko": "힘",
    "name_en": "",
    "type": "weapon",
    "desc": "힘(Force) 에너지."
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
    "desc": "봉헌(Consecration) 효과. 신성 의식."
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
    "desc": "정밀(Precision) 피해. 같은 대상에 1라운드 1회만."
  },
  {
    "id": "예측",
    "name_ko": "예측",
    "name_en": "",
    "type": "weapon",
    "desc": "예측(Fortune/Misfortune) 효과."
  },
  {
    "id": "바드",
    "name_ko": "바드",
    "name_en": "",
    "type": "weapon",
    "desc": "바드(Bard) 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "클레릭",
    "name_ko": "클레릭",
    "name_en": "",
    "type": "weapon",
    "desc": "클레릭(Cleric) 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "드루이드",
    "name_ko": "드루이드",
    "name_en": "",
    "type": "weapon",
    "desc": "드루이드(Druid) 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "파이터",
    "name_ko": "파이터",
    "name_en": "",
    "type": "weapon",
    "desc": "파이터(Fighter) 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "레인저",
    "name_ko": "레인저",
    "name_en": "",
    "type": "weapon",
    "desc": "레인저(Ranger) 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "로그",
    "name_ko": "로그",
    "name_en": "",
    "type": "weapon",
    "desc": "로그(Rogue) 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "위치",
    "name_ko": "위치",
    "name_en": "",
    "type": "weapon",
    "desc": "위치(Witch) 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "위저드",
    "name_ko": "위저드",
    "name_en": "",
    "type": "weapon",
    "desc": "위저드(Wizard) 클래스의 능력을 나타내는 특성."
  },
  {
    "id": "체인질링",
    "name_ko": "체인질링",
    "name_en": "",
    "type": "ancestry",
    "desc": "체인질링(Changeling) 다목적 유산. 해그의 후손."
  },
  {
    "id": "네피림",
    "name_ko": "네피림",
    "name_en": "",
    "type": "ancestry",
    "desc": "네피림(Nephilim) 다목적 유산. 차원 혈손."
  },
  {
    "id": "아이우바린",
    "name_ko": "아이우바린",
    "name_en": "",
    "type": "ancestry",
    "desc": "아이우바린(Aiuvarin) 다목적 유산. 반엘프."
  },
  {
    "id": "드로마르",
    "name_ko": "드로마르",
    "name_en": "",
    "type": "ancestry",
    "desc": "드로마르(Dromaar) 다목적 유산. 반오크."
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
    "desc": "공격 숙련도 전문가화, 반격 타격"
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
    "name_ko": "보폭(Stride)",
    "name_en": "",
    "type": "weapon",
    "desc": "이동 속도까지 이동"
  },
  {
    "id": "한 걸음(Step)",
    "name_ko": "한 걸음(Step)",
    "name_en": "",
    "type": "weapon",
    "desc": "5피트 이동(반응 유발 안 함)"
  },
  {
    "id": "타격(Strike)",
    "name_ko": "타격(Strike)",
    "name_en": "",
    "type": "weapon",
    "desc": "무기나 비무장으로 공격"
  },
  {
    "id": "상호작용(Interact)",
    "name_ko": "상호작용(Interact)",
    "name_en": "",
    "type": "weapon",
    "desc": "물체 잡기, 놓기, 문 열기 등"
  },
  {
    "id": "놓기(Release)",
    "name_ko": "놓기(Release)",
    "name_en": "",
    "type": "weapon",
    "desc": "들고 있는 물체를 놓음"
  },
  {
    "id": "탐색(Seek)",
    "name_ko": "탐색(Seek)",
    "name_en": "",
    "type": "weapon",
    "desc": "숨겨진 것을 지각 판정으로 찾기"
  },
  {
    "id": "감지(Sense Motive)",
    "name_ko": "감지(Sense Motive)",
    "name_en": "",
    "type": "weapon",
    "desc": "생물의 의도를 지각 판정으로 파악"
  },
  {
    "id": "은신(Hide)",
    "name_ko": "은신(Hide)",
    "name_en": "",
    "type": "weapon",
    "desc": "엄폐/은폐 뒤에 숨기"
  },
  {
    "id": "잠행(Sneak)",
    "name_ko": "잠행(Sneak)",
    "name_en": "",
    "type": "weapon",
    "desc": "숨은 상태로 이동"
  },
  {
    "id": "지연(Delay)",
    "name_ko": "지연(Delay)",
    "name_en": "",
    "type": "weapon",
    "desc": "선제 순서를 늦춤"
  },
  {
    "id": "준비(Ready)",
    "name_ko": "준비(Ready)",
    "name_en": "",
    "type": "weapon",
    "desc": "발동 조건을 설정하고 반응으로 행동"
  },
  {
    "id": "엄폐(Take Cover)",
    "name_ko": "엄폐(Take Cover)",
    "name_en": "",
    "type": "weapon",
    "desc": "엄폐를 더 효과적으로 사용"
  },
  {
    "id": "방패 올리기(Raise a Shield)",
    "name_ko": "방패 올리기(Raise a Shield)",
    "name_en": "",
    "type": "weapon",
    "desc": "방패의 AC 보너스를 다음 턴까지 적용"
  },
  {
    "id": "돕기(Aid)",
    "name_ko": "돕기(Aid)",
    "name_en": "",
    "type": "weapon",
    "desc": "아군의 판정에 보너스 제공"
  },
  {
    "id": "유지(Sustain)",
    "name_ko": "유지(Sustain)",
    "name_en": "",
    "type": "weapon",
    "desc": "유지 주문이나 효과를 계속 유지"
  },
  {
    "id": "해제(Dismiss)",
    "name_ko": "해제(Dismiss)",
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
    "desc": "다른 생물을 직접 섬기는 생물. 전투에서 매 턴 1회, 당신이 행동을 소비하여 명령할 때 행동합니다. 동물 동료는 동물 명령, 소환된 하수인은 효과 유지(Sustain). 명령 없으면 자신을 방어하거나 명백한 위험을 피하는 것 외에 행동하지 않습니다. 하수인은 턴당 2행동+0반응만 가집니다."
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
    "desc": "시각 의존 대상이 은폐(concealed)로 취급."
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
    "desc": "AC에 -2 상황 페널티. 협공, 넘어뜨려짐, 은신 공격 등으로 발생."
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
    "id": "억제",
    "name_ko": "억제",
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
    "id": "멍청함",
    "name_ko": "멍청함",
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
    "name_ko": "변형",
    "name_en": "aberration",
    "type": "mechanic",
    "desc": "이상체는 차원 너머에서 온 존재나 자연의 질서의 변질된 형태입니다."
  },
  {
    "id": "acid",
    "name_ko": "산",
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
    "desc": "질서 차원인 액시스(Axis)의 존재로부터 내려온 일종의 차원 자손입니다."
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
    "desc": "이 갑옷은 수중에서 사용하도록 설계되었으며, 유선형 디자인과 부력 소재를 사용하여 전략적인 장소에서 사용됩니다. 물이나 이와 유사한 액체에서 곡예 또는 운동 체크 시 갑옷의 체크 페널티가 적용되지 않습니다."
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
    "desc": "아르단데스(Ardandes)는 키지다르(kizidhars)와 기타 나무 원소 존재의 후손인 차원 자손입니다."
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
    "desc": "부착된 무기는 다른 장비와 결합해야 사용할 수 있습니다. 특성에는 무기를 부착해야 하는 아이템의 종류가 나와 있습니다. 무기로 공격하려면 무기가 부착된 아이템을 휘두르거나 착용하고 있어야 합니다. 예를 들어 방패에 방패 가시가 부착되어 있으면 방패를 내려치는 대신 가시로 공격할 수 있지만, 방패를 휘두르고 있을 때만 가능합니다. 부착 무기는 일반적으로 아이템에 볼트로 고정되거나 아이템에 내장되어 있으며, 일반적으로 아이템에는 하나의 무기만 부착할 수 있습니다. 부착 무기는 10분의 작업 시간과제작 DC 10체크 성공으로 아이템에 부착할 수 있으며, 여기에는 이전 아이템에서 무기를 제거하는 데 필요한 시간도 포함됩니다. 아이템이 파괴된 경우, 부착된 무기는 일반적으로 회수할 수 있습니다."
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
    "desc": "이 무기로 오프-가드 상태의 생물을 공격하면 일반 공격력에 추가로 정밀 공격력 1을 줍니다. 무기가 +3 무기인 경우 정밀 공격력은 2로 증가합니다."
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
    "name_ko": "비스트",
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
    "desc": "이 특성을 가진 행동은 관련 체크의 결과에 따라 파나쉬를 부여할 수 있습니다. 무모한 행동에 대한 체크에 성공하면 파나쉬를 얻게 되고, 체크에 실패(대실패는 제외)하면 파나쉬를 얻지만, 다음 턴이 끝날 때까지만 유지됩니다. 이 효과는 실패나 생물의 면역으로 인해 행동이 다른 효과를 발휘하지 못한 경우에도 적용될 수 있습니다."
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
    "name_ko": "셀레스티얼",
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
    "desc": "응고 특성을 가진 연금술 아이템은 짧은 시간에 여러 개를 사용하면 효과가 떨어집니다. 응고 특성을 가진 아이템으로 체력을 회복한 생물은 10분 동안 응고 특성을 가진 아이템으로 체력을 회복할 수 없습니다(단, 해당 아이템의 다른 효과는 정상적으로 적용됩니다).."
  },
  {
    "id": "cobbled",
    "name_ko": "코볼드",
    "name_en": "cobbled",
    "type": "mechanic",
    "desc": "이 총기는 서로 엉켜 있어서 불발될 가능성이 높습니다. 아무리 잘 유지하더라도 공격 굴림이 실패하면 공격이 실패해 평탄 DC 5를 굴려야 합니다. 이 체크에 실패하면 무기가 제대로 발사되지 않습니다."
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
    "name_ko": "추위",
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
    "desc": "이 무기는 눈에 띄지 않거나 쉽게 은폐될 수 있도록 설계되었습니다. 이 특성을 가진 무기를 숨기거나 은폐할 때 은신 체크와 DC에 +2의 상황 보너스를 받습니다."
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
    "name_ko": "구조체",
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
    "desc": "이 무기는 한 손이 없어도 운동 기술로 무장 해제할 수 있습니다. 이 경우 무기의 사거리(자신의 사거리와 다른 경우)를 사용하며, 무기의 아이템 보너스가 있는 경우 공격 굴림에 대한 아이템 보너스를 운동 체크에 아이템 보너스로 추가합니다. 무기를 사용하여 무장 해제 체크에서 대실패하면, 무기를 떨어뜨려 대실패 대신 실패의 효과를 받을 수 있습니다. 대성공을 거둔 경우에도 아이템을 획득하려면 한 손이 자유로워야 합니다."
  },
  {
    "id": "div",
    "name_ko": "디브(Div)",
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
    "name_ko": "드래곤",
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
    "name_ko": "원소",
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
    "name_ko": "핀드",
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
    "desc": "갑옷은 대부분의 액션에 방해가 되지 않을 만큼 유연합니다. 곡예나 운동 체크에 페널티가 적용되지 않습니다."
  },
  {
    "id": "flourish",
    "name_ko": "번성",
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
    "desc": "이 방패는 건틀릿에 부착된 작은 형태로 접을 수 있어 안정적이고 이동이 편리합니다. 인터랙트 액션을 사용하여 방패를 펼치거나 보관할 수 있습니다. 방패가 펼쳐져 있는 동안에는 한 손이 자유롭거나 무기가 아닌 가벼운 물체를 손에 들고 있으면 방패를 들어 올릴 수 있습니다. 방패가 펼쳐져 있는 동안에는 손을 사용할 수 없습니다. 그 손으로 아이템을 잡을 수는 있지만, 그 손으로 무기를 휘두르거나 두 손이 필요한 조작을 하거나 건틀릿으로 공격할 수는 없습니다. 접이식 보호막은 안정성을 위해 건틀릿에 부착해야 합니다. 이 방패는 10분의 작업 시간과 DC 10의 제작 체크 성공으로 아이템에 부착할 수 있으며, 필요한 경우 이전 건틀렛에서 방패를 제거하는 데 필요한 시간도 여기에 포함됩니다. 건틀렛이 파괴된 경우, 접이식 방패는 보통 회수할 수 있습니다. 방패는 접을 수 있기 때문에 부착 무기를 장착할 수 없습니다."
  },
  {
    "id": "force",
    "name_ko": "포스",
    "name_en": "force",
    "type": "mechanic",
    "desc": "이 특성을 가진 효과는 힘 피해를 입히거나 순수한 마법의 힘으로 만들어진 물체를 생성합니다."
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
    "name_ko": "펑거스",
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
    "desc": "이 무기를 사용하면 양손이 자유롭지 않아도 운동 기술로 격투할 수 있습니다. 이 경우 무기의 사정거리(자신의 사정거리와 다른 경우)를 사용하며, 무기의 아이템 보너스를 운동 기술 체크에 아이템 보너스로 추가하여 공격 굴림에 추가합니다. 무기를 사용하여 격투 체크에서 대실패하면 무기를 떨어뜨려 대실패 대신 실패의 효과를 받을 수 있습니다."
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
    "name_ko": "휴머노이드",
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
    "desc": "무형의 생명체 또는 물체는 물리적 형태가 없습니다. 벽을 포함한 단단한 물체를 통과할 수 있습니다. 물체 안에 있는 무형 생물은 물체 외부를 인식하거나 공격하거나 상호작용할 수 없으며, 물체 안에서 자신의 차례를 시작하면 1만큼 둔화됩니다. 무형 생물은 무형 생물을 통과할 수 있지만 그 공간에서 자신의 이동을 끝낼 수는 없습니다. 무형 생물은 물체가 유령 접촉 속성 룬을 가지고 있지 않는 한, 물리 생물이나 물체에 대해 근력 기반 체크를 시도할 수 없으며 무형 생물에 대해서만 시도할 수 있습니다. 마찬가지로, 육체 생명체는 무체 생명체나 물체에 대해 근력 기반 체크를 시도할 수 없습니다. 무형 생명체는 일반적으로 질병, 독, 정밀 피해와 같이 물리적인 몸을 필요로 하는 효과나 조건에 면역이 있습니다. 일반적으로 모든 피해(힘 피해와 유령 접촉 속성 룬이 있는 공격으로 인한 피해 제외)에 대한 저항이 있으며, 비마법 피해에 대한 저항은 두 배로 증가합니다."
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
    "name_ko": "언어학",
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
    "name_ko": "불행",
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
    "name_ko": "모니터",
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
    "name_ko": "모프",
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
    "desc": "이 갑옷은 시끄러워서 주목 피하기 탐험 활동을 사용할 때 다른 플레이어에게 자신의 존재를 알릴 가능성이 높습니다. 이 갑옷의 체크 페널티는 요구 조건인 근력 점수를 충족하더라도 은신 체크에 적용됩니다."
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
    "name_ko": "우즈",
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
    "name_ko": "플랜트",
    "name_en": "plant",
    "type": "mechanic",
    "desc": "식물성 생물은 식물 특성을 가지고 있습니다. 식물은 일반 식물과 구별됩니다. 이 특성을 가진 마법 효과는 어떤 식으로든 식물이나 식물 물질을 조작하거나 만들어냅니다. 식물을 조작하는 효과는 식물이 없는 지역에서는 효과가 없습니다."
  },
  {
    "id": "polymorph",
    "name_ko": "폴리모프",
    "name_en": "polymorph",
    "type": "mechanic",
    "desc": "이 효과는 대상을 새로운 형태로 변화시킵니다. 대상은 한 번에 두 개 이상의 다형성 효과의 영향을 받을 수 없습니다. 대상이 두 번째 다형체 효과의 영향을 받는 경우, 두 번째 다형체 효과는 첫 번째 다형체 효과를 반격하려고 시도합니다. 성공하면 효과가 적용되고, 실패하면 해당 주문은 해당 대상에게 효과가 없습니다. 다형체 효과에 의해 특별히 부여되는 모든 타격은 마법입니다. 달리 명시되지 않는 한, 다형체 주문은 대상이 특정 개별 생물의 모습을 취하는 것이 아니라 일반적인 유형이나 혈통의 일반 생물의 모습을 취하게 합니다. 다형성 주문으로 전투 형태를 취하면 특수 능력치는 상황 보너스, 상태 보너스, 페널티에 의해서만 조정할 수 있습니다. 별도의 설명이 없는 한, 전투 형태에서는 주문 시전, 말하기, 손이 필요한 대부분의 조작 액션을 사용할 수 없습니다. (액션을 사용할 수 있는지 여부는 GM이 결정합니다.) 장비는 자신에게 흡수되며, 장비의 상시 능력은 계속 작동하지만 아이템은 활성화할 수 없습니다."
  },
  {
    "id": "ponderous",
    "name_ko": "숙고",
    "name_en": "ponderous",
    "type": "mechanic",
    "desc": "갑옷에는 움직이는 부품이나 기타 합병증이 있어 착용자의 초기 리액션 시간이 길어집니다. 갑옷을 착용하고 있는 동안에는 우선권 체크에서 -1의 페널티를 받습니다. 갑옷의 요구 조건인 근력 점수를 충족하지 못하면 이 페널티는 갑옷의 체크 페널티와 같을 때까지 증가하며, 더 나쁠 경우 이 페널티는 갑옷의 체크 페널티와 같습니다."
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
    "name_ko": "프레스",
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
    "desc": "이 무기는 무기의 첫 번째 사거리 증가분까지 거리에서 운동 기술로 넘어뜨리는 데 사용할 수 있습니다. 기술 체크에는 -2의 상황 페널티가 적용됩니다. 무기의 아이템 보너스를 공격 주사위에 보너스로 추가하여 체크할 수 있습니다. 근접 무기로 넘어뜨릴 때와 마찬가지로 원거리 넘어뜨림은 넘어뜨릴 때 피해를 입히지 않습니다."
  },
  {
    "id": "rare",
    "name_ko": "희귀",
    "name_en": "rare",
    "type": "mechanic",
    "desc": "이 희귀도는 게임 세계에서 규칙 요소를 찾기가 매우 어렵다는 것을 나타냅니다. 희귀 재주, 주문, 아이템 등은 GM이 게임에 포함하기로 결정한 경우에만 플레이어가 사용할 수 있으며, 일반적으로 플레이 중 발견을 통해 획득할 수 있습니다. 이 특성을 가진 생물은 희귀합니다. 일반적으로 소환할 수 없습니다. 이 생물과 관련된 지식 기억 체크의 DC는 5만큼 증가합니다."
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
    "desc": "무모한 특성이 있는 액션은 조종사가 기체에 대한 통제권을 잃을 위험이 있습니다. 무모한 액션을 수행할 때 파일럿은 먼저 적절한 파일럿 체크를 시도하여 차량 제어권을 유지해야 합니다."
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
    "desc": "지 하(Zi Ha) 출신으로 파란 피부를 가진 사람들로서, 죽은 후 환생하며 과거 생애의 일부를 기억하는 종족."
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
    "name_ko": "섀도",
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
    "desc": "이 무기는 양손이 자유롭지 않아도 운동 기술로 밀기 기술을 사용할 수 있습니다. 이 경우 무기의 사정거리(자신의 사정거리와 다른 경우)를 사용하며, 무기의 아이템 보너스를 운동 기술 체크에 아이템 보너스로 추가하여 공격 굴림에 추가합니다. 무기를 사용하여 밀치기 체크에서 대실패하면 무기를 떨어뜨려 대실패 대신 실패의 효과를 받을 수 있습니다."
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
    "name_ko": "스피릿",
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
    "name_ko": "소환된",
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
    "name_ko": "순간 이동",
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
    "name_ko": "드문",
    "name_en": "uncommon",
    "type": "mechanic",
    "desc": "드문 희귀성은 특별한 훈련이 필요하거나 특정 문화권 또는 세계의 일부에서 유래한 것입니다. 일부 캐릭터 선택에 따라 희귀 옵션에 접근할 수 있으며, GM은 누구나 접근할 수 있도록 허용할 수 있습니다. 드문 생물은 일반 생물에 비해 알려진 정보가 적습니다. 일반적으로 소환할 수 없습니다. 이 생물과 관련된 지식 기억 체크의 DC는 2만큼 증가합니다."
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
    "desc": "이 특성을 가진 규칙 요소는 유일무이합니다. 이 특성을 가진 생물과 관련된 지식 회상 체크의 DC가 10 증가합니다."
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
    "name_ko": "시각적",
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
const PREREQ_GROUPS = [
  {
    "group_id": "gid-bard-dedication",
    "logic": "and",
    "type": "cha",
    "value": "2"
  },
  {
    "group_id": "gid-basic-bard-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Bard Dedication"
  },
  {
    "group_id": "gid-counter-perform",
    "logic": "and",
    "type": "feat",
    "value": "Bard Dedication"
  },
  {
    "group_id": "gid-anthemic-performance",
    "logic": "and",
    "type": "feat",
    "value": "Bard Dedication"
  },
  {
    "group_id": "gid-occult-breadth",
    "logic": "and",
    "type": "feat",
    "value": "Basic Bard Spellcasting"
  },
  {
    "group_id": "gid-expert-bard-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Basic Bard Spellcasting"
  },
  {
    "group_id": "gid-expert-bard-spellcasting",
    "logic": "and",
    "type": "occultism",
    "value": "6"
  },
  {
    "group_id": "gid-master-bard-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Expert Bard Spellcasting"
  },
  {
    "group_id": "gid-master-bard-spellcasting",
    "logic": "and",
    "type": "occultism",
    "value": "8"
  },
  {
    "group_id": "gid-cleric-dedication",
    "logic": "and",
    "type": "wis",
    "value": "2"
  },
  {
    "group_id": "gid-basic-cleric-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Cleric Dedication"
  },
  {
    "group_id": "gid-basic-dogma",
    "logic": "and",
    "type": "feat",
    "value": "Cleric Dedication"
  },
  {
    "group_id": "gid-advanced-dogma",
    "logic": "and",
    "type": "subclass",
    "value": "기초 교리"
  },
  {
    "group_id": "gid-divine-breadth",
    "logic": "and",
    "type": "feat",
    "value": "Basic Cleric Spellcasting"
  },
  {
    "group_id": "gid-expert-cleric-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Basic Cleric Spellcasting"
  },
  {
    "group_id": "gid-expert-cleric-spellcasting",
    "logic": "and",
    "type": "religion",
    "value": "6"
  },
  {
    "group_id": "gid-master-cleric-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Expert Cleric Spellcasting"
  },
  {
    "group_id": "gid-master-cleric-spellcasting",
    "logic": "and",
    "type": "religion",
    "value": "8"
  },
  {
    "group_id": "gid-druid-dedication",
    "logic": "and",
    "type": "wis",
    "value": "2"
  },
  {
    "group_id": "gid-basic-druid-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Druid Dedication"
  },
  {
    "group_id": "gid-basic-wilding",
    "logic": "and",
    "type": "feat",
    "value": "Druid Dedication"
  },
  {
    "group_id": "gid-order-spell",
    "logic": "and",
    "type": "feat",
    "value": "Druid Dedication"
  },
  {
    "group_id": "gid-advanced-wilding",
    "logic": "and",
    "type": "feat",
    "value": "Basic Wilding"
  },
  {
    "group_id": "gid-primal-breadth",
    "logic": "and",
    "type": "feat",
    "value": "Basic Druid Spellcasting"
  },
  {
    "group_id": "gid-expert-druid-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Basic Druid Spellcasting"
  },
  {
    "group_id": "gid-expert-druid-spellcasting",
    "logic": "and",
    "type": "nature",
    "value": "6"
  },
  {
    "group_id": "gid-master-druid-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Expert Druid Spellcasting"
  },
  {
    "group_id": "gid-master-druid-spellcasting",
    "logic": "and",
    "type": "nature",
    "value": "8"
  },
  {
    "group_id": "gid-fighter-dedication",
    "logic": "and",
    "type": "str",
    "value": "2"
  },
  {
    "group_id": "gid-fighter-dedication",
    "logic": "and",
    "type": "dex",
    "value": "2"
  },
  {
    "group_id": "gid-basic-maneuver",
    "logic": "and",
    "type": "feat",
    "value": "Fighter Dedication"
  },
  {
    "group_id": "gid-fighter-resiliency",
    "logic": "and",
    "type": "feat",
    "value": "Fighter Dedication"
  },
  {
    "group_id": "gid-reactive-striker",
    "logic": "and",
    "type": "feat",
    "value": "Fighter Dedication"
  },
  {
    "group_id": "gid-advanced-maneuver",
    "logic": "and",
    "type": "feat",
    "value": "Basic Maneuver"
  },
  {
    "group_id": "gid-diverse-weapon-expert",
    "logic": "and",
    "type": "feat",
    "value": "Fighter Dedication"
  },
  {
    "group_id": "gid-ranger-dedication",
    "logic": "and",
    "type": "dex",
    "value": "2"
  },
  {
    "group_id": "gid-ranger-resiliency",
    "logic": "and",
    "type": "feat",
    "value": "Ranger Dedication"
  },
  {
    "group_id": "gid-master-spotter",
    "logic": "and",
    "type": "feat",
    "value": "Ranger Dedication"
  },
  {
    "group_id": "gid-master-spotter",
    "logic": "and",
    "type": "perception",
    "value": "4"
  },
  {
    "group_id": "gid-rogue-dedication",
    "logic": "and",
    "type": "dex",
    "value": "2"
  },
  {
    "group_id": "gid-basic-trickery",
    "logic": "and",
    "type": "feat",
    "value": "Rogue Dedication"
  },
  {
    "group_id": "gid-sneak-attacker",
    "logic": "and",
    "type": "feat",
    "value": "Rogue Dedication"
  },
  {
    "group_id": "gid-advanced-trickery",
    "logic": "and",
    "type": "feat",
    "value": "Basic Trickery"
  },
  {
    "group_id": "gid-skill-mastery",
    "logic": "and",
    "type": "feat",
    "value": "Rogue Dedication"
  },
  {
    "group_id": "gid-uncanny-dodge",
    "logic": "and",
    "type": "feat",
    "value": "Rogue Dedication"
  },
  {
    "group_id": "gid-evasiveness",
    "logic": "and",
    "type": "feat",
    "value": "Rogue Dedication"
  },
  {
    "group_id": "gid-witch-dedication",
    "logic": "and",
    "type": "int",
    "value": "2"
  },
  {
    "group_id": "gid-basic-witch-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Witch Dedication"
  },
  {
    "group_id": "gid-basic-witchcraft",
    "logic": "and",
    "type": "feat",
    "value": "Witch Dedication"
  },
  {
    "group_id": "gid-advanced-witchcraft",
    "logic": "and",
    "type": "feat",
    "value": "Basic Witchcraft"
  },
  {
    "group_id": "gid-expert-witch-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Basic Witch Spellcasting"
  },
  {
    "group_id": "gid-master-witch-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Expert Witch Spellcasting"
  },
  {
    "group_id": "gid-wizard-dedication",
    "logic": "and",
    "type": "int",
    "value": "2"
  },
  {
    "group_id": "gid-arcane-school-spell",
    "logic": "and",
    "type": "feat",
    "value": "Wizard Dedication"
  },
  {
    "group_id": "gid-basic-arcana",
    "logic": "and",
    "type": "feat",
    "value": "Wizard Dedication"
  },
  {
    "group_id": "gid-basic-wizard-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Wizard Dedication"
  },
  {
    "group_id": "gid-advanced-arcana",
    "logic": "and",
    "type": "feat",
    "value": "Basic Arcana"
  },
  {
    "group_id": "gid-arcane-breadth",
    "logic": "and",
    "type": "feat",
    "value": "Basic Wizard Spellcasting"
  },
  {
    "group_id": "gid-expert-wizard-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Basic Wizard Spellcasting"
  },
  {
    "group_id": "gid-expert-wizard-spellcasting",
    "logic": "and",
    "type": "arcana",
    "value": "6"
  },
  {
    "group_id": "gid-master-wizard-spellcasting",
    "logic": "and",
    "type": "feat",
    "value": "Expert Wizard Spellcasting"
  },
  {
    "group_id": "gid-master-wizard-spellcasting",
    "logic": "and",
    "type": "arcana",
    "value": "8"
  },
  {
    "group_id": "gid-nephilim-eyes",
    "logic": "and",
    "type": "vision",
    "value": "low-light"
  },
  {
    "group_id": "gid-orc-sight",
    "logic": "and",
    "type": "vision",
    "value": "low-light"
  },
  {
    "group_id": "gid-boulder-roll",
    "logic": "and",
    "type": "feat",
    "value": "Rock Runner"
  },
  {
    "group_id": "gid-defy-the-darkness",
    "logic": "and",
    "type": "vision",
    "value": "darkvision"
  },
  {
    "group_id": "gid-dwarven-reinforcement",
    "logic": "and",
    "type": "crafting",
    "value": "4"
  },
  {
    "group_id": "gid-energized-font",
    "logic": "and",
    "type": "feat",
    "value": "focus pool"
  },
  {
    "group_id": "gid-loud-singer",
    "logic": "and",
    "type": "feat",
    "value": "Goblin Song"
  },
  {
    "group_id": "gid-adaptive-adept",
    "logic": "and",
    "type": "feat",
    "value": "Adapted Cantrip"
  },
  {
    "group_id": "gid-defy-death",
    "logic": "and",
    "type": "feat",
    "value": "Orc Ferocity"
  },
  {
    "group_id": "gid-expert-longevity",
    "logic": "and",
    "type": "feat",
    "value": "Ancestral Longevity"
  },
  {
    "group_id": "gid-dance-underfoot",
    "logic": "and",
    "type": "feat",
    "value": "Step Lively"
  },
  {
    "group_id": "gid-guiding-luck",
    "logic": "and",
    "type": "feat",
    "value": "Halfling Luck"
  },
  {
    "group_id": "gid-pervasive-superstition",
    "logic": "and",
    "type": "feat",
    "value": "Orc Superstition"
  },
  {
    "group_id": "gid-undying-ferocity",
    "logic": "and",
    "type": "feat",
    "value": "Orc Ferocity"
  },
  {
    "group_id": "gid-occult-resistance",
    "logic": "and",
    "type": "occultism",
    "value": "4"
  },
  {
    "group_id": "gid-celestial-magic",
    "logic": "and",
    "type": "feat",
    "value": "Angelkin"
  },
  {
    "group_id": "gid-celestial-magic",
    "logic": "and",
    "type": "feat",
    "value": "Lawbringer"
  },
  {
    "group_id": "gid-fiendish-magic",
    "logic": "and",
    "type": "feat",
    "value": "Grimspawn"
  },
  {
    "group_id": "gid-fiendish-magic",
    "logic": "and",
    "type": "feat",
    "value": "Pitborn"
  },
  {
    "group_id": "gid-universal-longevity",
    "logic": "and",
    "type": "feat",
    "value": "Ancestral Longevity"
  },
  {
    "group_id": "gid-very-very-sneaky",
    "logic": "and",
    "type": "feat",
    "value": "Very Sneaky"
  },
  {
    "group_id": "gid-ceaseless-shadows",
    "logic": "and",
    "type": "feat",
    "value": "Distracting Shadows"
  },
  {
    "group_id": "gid-toppling-dance",
    "logic": "and",
    "type": "feat",
    "value": "Dance Underfoot"
  },
  {
    "group_id": "gid-incredible-ferocity",
    "logic": "and",
    "type": "feat",
    "value": "Orc Ferocity"
  },
  {
    "group_id": "gid-ferocious-beasts",
    "logic": "and",
    "type": "feat",
    "value": "Animal Companion"
  },
  {
    "group_id": "gid-ferocious-beasts",
    "logic": "and",
    "type": "feat",
    "value": "Pet"
  },
  {
    "group_id": "gid-ferocious-beasts",
    "logic": "and",
    "type": "feat",
    "value": "Orc Ferocity"
  },
  {
    "group_id": "gid-spell-devourer",
    "logic": "and",
    "type": "feat",
    "value": "Orc Superstition"
  },
  {
    "group_id": "gid-celestial-mercy",
    "logic": "and",
    "type": "heritage",
    "value": "천상 혈통"
  },
  {
    "group_id": "gid-slip-sideways",
    "logic": "and",
    "type": "heritage",
    "value": "마귀 혈통"
  },
  {
    "group_id": "gid-stonegate",
    "logic": "and",
    "type": "feat",
    "value": "Stonewalker"
  },
  {
    "group_id": "gid-shadow-self",
    "logic": "and",
    "type": "stealth",
    "value": "8"
  },
  {
    "group_id": "gid-rampaging-ferocity",
    "logic": "and",
    "type": "feat",
    "value": "Orc Ferocity"
  },
  {
    "group_id": "gid-eternal-wings",
    "logic": "and",
    "type": "feat",
    "value": "Divine Wings"
  },
  {
    "group_id": "gid-fast-recovery",
    "logic": "and",
    "type": "con",
    "value": "2"
  },
  {
    "group_id": "gid-feather-step",
    "logic": "and",
    "type": "dex",
    "value": "2"
  },
  {
    "group_id": "gid-expeditious-search",
    "logic": "and",
    "type": "perception",
    "value": "6"
  },
  {
    "group_id": "gid-prescient-consumable",
    "logic": "and",
    "type": "feat",
    "value": "Prescient Planner"
  },
  {
    "group_id": "gid-incredible-investiture",
    "logic": "and",
    "type": "cha",
    "value": "3"
  },
  {
    "group_id": "gid-dubious-knowledge",
    "logic": "or",
    "type": "arcana",
    "value": "2"
  },
  {
    "group_id": "gid-dubious-knowledge",
    "logic": "or",
    "type": "nature",
    "value": "2"
  },
  {
    "group_id": "gid-dubious-knowledge",
    "logic": "or",
    "type": "occultism",
    "value": "2"
  },
  {
    "group_id": "gid-dubious-knowledge",
    "logic": "or",
    "type": "religion",
    "value": "2"
  },
  {
    "group_id": "gid-dubious-knowledge",
    "logic": "or",
    "type": "society",
    "value": "2"
  },
  {
    "group_id": "gid-dubious-knowledge",
    "logic": "or",
    "type": "crafting",
    "value": "2"
  },
  {
    "group_id": "gid-dubious-knowledge",
    "logic": "or",
    "type": "medicine",
    "value": "2"
  },
  {
    "group_id": "gid-quick-identification",
    "logic": "or",
    "type": "arcana",
    "value": "2"
  },
  {
    "group_id": "gid-quick-identification",
    "logic": "or",
    "type": "nature",
    "value": "2"
  },
  {
    "group_id": "gid-quick-identification",
    "logic": "or",
    "type": "occultism",
    "value": "2"
  },
  {
    "group_id": "gid-quick-identification",
    "logic": "or",
    "type": "religion",
    "value": "2"
  },
  {
    "group_id": "gid-skill-training",
    "logic": "and",
    "type": "int",
    "value": "1"
  },
  {
    "group_id": "gid-cat-fall",
    "logic": "and",
    "type": "acrobatics",
    "value": "2"
  },
  {
    "group_id": "gid-quick-squeeze",
    "logic": "and",
    "type": "acrobatics",
    "value": "2"
  },
  {
    "group_id": "gid-steady-balance",
    "logic": "and",
    "type": "acrobatics",
    "value": "2"
  },
  {
    "group_id": "gid-quick-jump",
    "logic": "and",
    "type": "athletics",
    "value": "2"
  },
  {
    "group_id": "gid-combat-climber",
    "logic": "and",
    "type": "athletics",
    "value": "2"
  },
  {
    "group_id": "gid-hefty-hauler",
    "logic": "and",
    "type": "athletics",
    "value": "2"
  },
  {
    "group_id": "gid-underwater-marauder",
    "logic": "and",
    "type": "athletics",
    "value": "2"
  },
  {
    "group_id": "gid-titan-wrestler",
    "logic": "and",
    "type": "athletics",
    "value": "2"
  },
  {
    "group_id": "gid-alchemical-crafting",
    "logic": "and",
    "type": "crafting",
    "value": "2"
  },
  {
    "group_id": "gid-quick-repair",
    "logic": "and",
    "type": "crafting",
    "value": "2"
  },
  {
    "group_id": "gid-specialty-crafting",
    "logic": "and",
    "type": "crafting",
    "value": "2"
  },
  {
    "group_id": "gid-charming-liar",
    "logic": "and",
    "type": "deception",
    "value": "2"
  },
  {
    "group_id": "gid-lengthy-diversion",
    "logic": "and",
    "type": "deception",
    "value": "2"
  },
  {
    "group_id": "gid-lie-to-me",
    "logic": "and",
    "type": "deception",
    "value": "2"
  },
  {
    "group_id": "gid-group-impression",
    "logic": "and",
    "type": "diplomacy",
    "value": "2"
  },
  {
    "group_id": "gid-hobnobber",
    "logic": "and",
    "type": "diplomacy",
    "value": "2"
  },
  {
    "group_id": "gid-bargain-hunter",
    "logic": "and",
    "type": "diplomacy",
    "value": "2"
  },
  {
    "group_id": "gid-no-cause-for-alarm",
    "logic": "and",
    "type": "diplomacy",
    "value": "2"
  },
  {
    "group_id": "gid-intimidating-glare",
    "logic": "and",
    "type": "intimidation",
    "value": "2"
  },
  {
    "group_id": "gid-quick-coercion",
    "logic": "and",
    "type": "intimidation",
    "value": "2"
  },
  {
    "group_id": "gid-group-coercion",
    "logic": "and",
    "type": "intimidation",
    "value": "2"
  },
  {
    "group_id": "gid-battle-medicine",
    "logic": "and",
    "type": "medicine",
    "value": "2"
  },
  {
    "group_id": "gid-natural-medicine",
    "logic": "and",
    "type": "nature",
    "value": "2"
  },
  {
    "group_id": "gid-arcane-sense",
    "logic": "and",
    "type": "arcana",
    "value": "2"
  },
  {
    "group_id": "gid-oddity-identification",
    "logic": "and",
    "type": "occultism",
    "value": "2"
  },
  {
    "group_id": "gid-schooled-in-secrets",
    "logic": "and",
    "type": "occultism",
    "value": "2"
  },
  {
    "group_id": "gid-fascinating-performance",
    "logic": "and",
    "type": "performance",
    "value": "2"
  },
  {
    "group_id": "gid-impressive-performance",
    "logic": "and",
    "type": "performance",
    "value": "2"
  },
  {
    "group_id": "gid-virtuosic-performer",
    "logic": "and",
    "type": "performance",
    "value": "2"
  },
  {
    "group_id": "gid-student-of-the-canon",
    "logic": "and",
    "type": "religion",
    "value": "2"
  },
  {
    "group_id": "gid-courtly-graces",
    "logic": "and",
    "type": "society",
    "value": "2"
  },
  {
    "group_id": "gid-streetwise",
    "logic": "and",
    "type": "society",
    "value": "2"
  },
  {
    "group_id": "gid-read-lips",
    "logic": "and",
    "type": "society",
    "value": "2"
  },
  {
    "group_id": "gid-sign-language",
    "logic": "and",
    "type": "society",
    "value": "2"
  },
  {
    "group_id": "gid-multilingual",
    "logic": "and",
    "type": "society",
    "value": "2"
  },
  {
    "group_id": "gid-experienced-smuggler",
    "logic": "and",
    "type": "stealth",
    "value": "2"
  },
  {
    "group_id": "gid-experienced-tracker",
    "logic": "and",
    "type": "survival",
    "value": "2"
  },
  {
    "group_id": "gid-terrain-stalker",
    "logic": "and",
    "type": "stealth",
    "value": "2"
  },
  {
    "group_id": "gid-subtle-theft",
    "logic": "and",
    "type": "thievery",
    "value": "2"
  },
  {
    "group_id": "gid-pickpocket",
    "logic": "and",
    "type": "thievery",
    "value": "2"
  },
  {
    "group_id": "gid-forager",
    "logic": "and",
    "type": "survival",
    "value": "2"
  },
  {
    "group_id": "gid-terrain-expertise",
    "logic": "and",
    "type": "survival",
    "value": "2"
  },
  {
    "group_id": "gid-survey-wildlife",
    "logic": "and",
    "type": "survival",
    "value": "2"
  },
  {
    "group_id": "gid-train-animal",
    "logic": "and",
    "type": "nature",
    "value": "2"
  },
  {
    "group_id": "gid-automatic-knowledge",
    "logic": "or",
    "type": "arcana",
    "value": "4"
  },
  {
    "group_id": "gid-automatic-knowledge",
    "logic": "or",
    "type": "nature",
    "value": "4"
  },
  {
    "group_id": "gid-automatic-knowledge",
    "logic": "or",
    "type": "occultism",
    "value": "4"
  },
  {
    "group_id": "gid-automatic-knowledge",
    "logic": "or",
    "type": "religion",
    "value": "4"
  },
  {
    "group_id": "gid-automatic-knowledge",
    "logic": "or",
    "type": "society",
    "value": "4"
  },
  {
    "group_id": "gid-automatic-knowledge",
    "logic": "or",
    "type": "crafting",
    "value": "4"
  },
  {
    "group_id": "gid-automatic-knowledge",
    "logic": "or",
    "type": "medicine",
    "value": "4"
  },
  {
    "group_id": "gid-magical-shorthand",
    "logic": "or",
    "type": "arcana",
    "value": "4"
  },
  {
    "group_id": "gid-magical-shorthand",
    "logic": "or",
    "type": "nature",
    "value": "4"
  },
  {
    "group_id": "gid-magical-shorthand",
    "logic": "or",
    "type": "occultism",
    "value": "4"
  },
  {
    "group_id": "gid-magical-shorthand",
    "logic": "or",
    "type": "religion",
    "value": "4"
  },
  {
    "group_id": "gid-nimble-crawl",
    "logic": "and",
    "type": "acrobatics",
    "value": "4"
  },
  {
    "group_id": "gid-powerful-leap",
    "logic": "and",
    "type": "athletics",
    "value": "4"
  },
  {
    "group_id": "gid-rapid-mantel",
    "logic": "and",
    "type": "athletics",
    "value": "4"
  },
  {
    "group_id": "gid-inventor",
    "logic": "and",
    "type": "crafting",
    "value": "4"
  },
  {
    "group_id": "gid-magical-crafting",
    "logic": "and",
    "type": "crafting",
    "value": "4"
  },
  {
    "group_id": "gid-quick-disguise",
    "logic": "and",
    "type": "deception",
    "value": "4"
  },
  {
    "group_id": "gid-glad-hand",
    "logic": "and",
    "type": "diplomacy",
    "value": "4"
  },
  {
    "group_id": "gid-intimidating-prowess",
    "logic": "and",
    "type": "str",
    "value": "3"
  },
  {
    "group_id": "gid-intimidating-prowess",
    "logic": "and",
    "type": "intimidation",
    "value": "4"
  },
  {
    "group_id": "gid-lasting-coercion",
    "logic": "and",
    "type": "intimidation",
    "value": "4"
  },
  {
    "group_id": "gid-robust-recovery",
    "logic": "and",
    "type": "medicine",
    "value": "4"
  },
  {
    "group_id": "gid-continual-recovery",
    "logic": "and",
    "type": "medicine",
    "value": "4"
  },
  {
    "group_id": "gid-ward-medic",
    "logic": "and",
    "type": "medicine",
    "value": "4"
  },
  {
    "group_id": "gid-unusual-treatment",
    "logic": "and",
    "type": "medicine",
    "value": "4"
  },
  {
    "group_id": "gid-additional-lore",
    "logic": "and",
    "type": "lore",
    "value": "4"
  },
  {
    "group_id": "gid-experienced-professional",
    "logic": "and",
    "type": "lore",
    "value": "4"
  },
  {
    "group_id": "gid-quiet-allies",
    "logic": "and",
    "type": "stealth",
    "value": "4"
  },
  {
    "group_id": "gid-wary-disarmament",
    "logic": "and",
    "type": "thievery",
    "value": "4"
  },
  {
    "group_id": "gid-bonded-animal",
    "logic": "and",
    "type": "nature",
    "value": "4"
  },
  {
    "group_id": "gid-unmistakable-lore",
    "logic": "and",
    "type": "lore",
    "value": "4"
  },
  {
    "group_id": "gid-kip-up",
    "logic": "and",
    "type": "acrobatics",
    "value": "6"
  },
  {
    "group_id": "gid-quick-climb",
    "logic": "and",
    "type": "athletics",
    "value": "6"
  },
  {
    "group_id": "gid-quick-swim",
    "logic": "and",
    "type": "athletics",
    "value": "6"
  },
  {
    "group_id": "gid-wall-jump",
    "logic": "and",
    "type": "athletics",
    "value": "6"
  },
  {
    "group_id": "gid-impeccable-crafting",
    "logic": "and",
    "type": "crafting",
    "value": "6"
  },
  {
    "group_id": "gid-impeccable-crafting",
    "logic": "and",
    "type": "feat",
    "value": "Specialty Crafting"
  },
  {
    "group_id": "gid-monster-crafting",
    "logic": "and",
    "type": "survival",
    "value": "6"
  },
  {
    "group_id": "gid-slippery-secrets",
    "logic": "and",
    "type": "deception",
    "value": "6"
  },
  {
    "group_id": "gid-shameless-request",
    "logic": "and",
    "type": "diplomacy",
    "value": "6"
  },
  {
    "group_id": "gid-battle-cry",
    "logic": "and",
    "type": "intimidation",
    "value": "6"
  },
  {
    "group_id": "gid-terrified-retreat",
    "logic": "and",
    "type": "intimidation",
    "value": "6"
  },
  {
    "group_id": "gid-bizarre-magic",
    "logic": "and",
    "type": "occultism",
    "value": "6"
  },
  {
    "group_id": "gid-quick-unlock",
    "logic": "and",
    "type": "thievery",
    "value": "6"
  },
  {
    "group_id": "gid-foil-senses",
    "logic": "and",
    "type": "stealth",
    "value": "6"
  },
  {
    "group_id": "gid-planar-survival",
    "logic": "and",
    "type": "survival",
    "value": "6"
  },
  {
    "group_id": "gid-quick-recognition",
    "logic": "or",
    "type": "arcana",
    "value": "6"
  },
  {
    "group_id": "gid-quick-recognition",
    "logic": "or",
    "type": "nature",
    "value": "6"
  },
  {
    "group_id": "gid-quick-recognition",
    "logic": "or",
    "type": "occultism",
    "value": "6"
  },
  {
    "group_id": "gid-quick-recognition",
    "logic": "or",
    "type": "religion",
    "value": "6"
  },
  {
    "group_id": "gid-break-curse",
    "logic": "or",
    "type": "occultism",
    "value": "6"
  },
  {
    "group_id": "gid-break-curse",
    "logic": "or",
    "type": "religion",
    "value": "6"
  },
  {
    "group_id": "gid-swift-sneak",
    "logic": "and",
    "type": "stealth",
    "value": "6"
  },
  {
    "group_id": "gid-cloud-jump",
    "logic": "and",
    "type": "athletics",
    "value": "8"
  },
  {
    "group_id": "gid-legendary-negotiation",
    "logic": "and",
    "type": "diplomacy",
    "value": "8"
  },
  {
    "group_id": "gid-scare-to-death",
    "logic": "and",
    "type": "intimidation",
    "value": "8"
  },
  {
    "group_id": "gid-legendary-medic",
    "logic": "and",
    "type": "medicine",
    "value": "8"
  },
  {
    "group_id": "gid-divine-guidance",
    "logic": "and",
    "type": "religion",
    "value": "8"
  },
  {
    "group_id": "gid-legendary-codebreaker",
    "logic": "and",
    "type": "society",
    "value": "8"
  },
  {
    "group_id": "gid-legendary-linguist",
    "logic": "and",
    "type": "society",
    "value": "8"
  },
  {
    "group_id": "gid-legendary-linguist",
    "logic": "and",
    "type": "feat",
    "value": "Multilingual"
  },
  {
    "group_id": "gid-legendary-survivalist",
    "logic": "and",
    "type": "survival",
    "value": "8"
  },
  {
    "group_id": "gid-legendary-sneak",
    "logic": "and",
    "type": "stealth",
    "value": "8"
  },
  {
    "group_id": "gid-legendary-sneak",
    "logic": "and",
    "type": "feat",
    "value": "Swift Sneak"
  },
  {
    "group_id": "gid-legendary-thief",
    "logic": "and",
    "type": "thievery",
    "value": "8"
  },
  {
    "group_id": "gid-legendary-thief",
    "logic": "and",
    "type": "feat",
    "value": "Pickpocket"
  },
  {
    "group_id": "gid-legendary-professional",
    "logic": "and",
    "type": "lore",
    "value": "8"
  },
  {
    "group_id": "gid-legendary-performer",
    "logic": "and",
    "type": "performance",
    "value": "8"
  },
  {
    "group_id": "gid-legendary-performer",
    "logic": "and",
    "type": "feat",
    "value": "Virtuosic Performer"
  },
  {
    "group_id": "gid-unified-theory",
    "logic": "and",
    "type": "arcana",
    "value": "8"
  },
  {
    "group_id": "gid-bardic-lore",
    "logic": "and",
    "type": "subclass",
    "value": "수수께끼 뮤즈"
  },
  {
    "group_id": "gid-lingering-composition",
    "logic": "and",
    "type": "subclass",
    "value": "마에스트로 뮤즈"
  },
  {
    "group_id": "gid-martial-performance",
    "logic": "and",
    "type": "subclass",
    "value": "전사 뮤즈"
  },
  {
    "group_id": "gid-versatile-performance",
    "logic": "and",
    "type": "subclass",
    "value": "박학다식 뮤즈"
  },
  {
    "group_id": "gid-esoteric-polymath",
    "logic": "and",
    "type": "subclass",
    "value": "박학다식 뮤즈"
  },
  {
    "group_id": "gid-loremasters-etude",
    "logic": "and",
    "type": "subclass",
    "value": "수수께끼 뮤즈"
  },
  {
    "group_id": "gid-song-of-strength",
    "logic": "and",
    "type": "subclass",
    "value": "전사 뮤즈"
  },
  {
    "group_id": "gid-uplifting-overture",
    "logic": "and",
    "type": "subclass",
    "value": "마에스트로 뮤즈"
  },
  {
    "group_id": "gid-courageous-advance",
    "logic": "and",
    "type": "subclass",
    "value": "전사 뮤즈"
  },
  {
    "group_id": "gid-in-tune",
    "logic": "and",
    "type": "subclass",
    "value": "마에스트로 뮤즈"
  },
  {
    "group_id": "gid-assured-knowledge",
    "logic": "and",
    "type": "subclass",
    "value": "수수께끼 뮤즈"
  },
  {
    "group_id": "gid-defensive-coordination",
    "logic": "and",
    "type": "subclass",
    "value": "전사 뮤즈"
  },
  {
    "group_id": "gid-defensive-coordination",
    "logic": "and",
    "type": "feat",
    "value": "Rallying Anthem"
  },
  {
    "group_id": "gid-educate-allies",
    "logic": "and",
    "type": "feat",
    "value": "Well-Versed"
  },
  {
    "group_id": "gid-harmonize",
    "logic": "and",
    "type": "subclass",
    "value": "마에스트로 뮤즈"
  },
  {
    "group_id": "gid-eclectic-skill",
    "logic": "and",
    "type": "subclass",
    "value": "박학다식 뮤즈"
  },
  {
    "group_id": "gid-eclectic-skill",
    "logic": "and",
    "type": "occultism",
    "value": "6"
  },
  {
    "group_id": "gid-fortissimo-composition",
    "logic": "and",
    "type": "subclass",
    "value": "마에스트로 뮤즈"
  },
  {
    "group_id": "gid-know-it-all",
    "logic": "and",
    "type": "subclass",
    "value": "수수께끼 뮤즈"
  },
  {
    "group_id": "gid-reflexive-courage",
    "logic": "and",
    "type": "subclass",
    "value": "전사 뮤즈"
  },
  {
    "group_id": "gid-courageous-assault",
    "logic": "and",
    "type": "subclass",
    "value": "전사 뮤즈"
  },
  {
    "group_id": "gid-unusual-composition",
    "logic": "and",
    "type": "subclass",
    "value": "박학다식 뮤즈"
  },
  {
    "group_id": "gid-eclectic-polymath",
    "logic": "and",
    "type": "feat",
    "value": "Esoteric Polymath"
  },
  {
    "group_id": "gid-enigmas-knowledge",
    "logic": "and",
    "type": "feat",
    "value": "Assured Knowledge"
  },
  {
    "group_id": "gid-shared-assault",
    "logic": "and",
    "type": "feat",
    "value": "Courageous Assault"
  },
  {
    "group_id": "gid-triumphant-inspiration",
    "logic": "and",
    "type": "subclass",
    "value": "전사 뮤즈"
  },
  {
    "group_id": "gid-true-hypercognition",
    "logic": "and",
    "type": "subclass",
    "value": "수수께끼 뮤즈"
  },
  {
    "group_id": "gid-courageous-onslaught",
    "logic": "and",
    "type": "feat",
    "value": "Courageous Advance"
  },
  {
    "group_id": "gid-courageous-onslaught",
    "logic": "and",
    "type": "feat",
    "value": "Courageous Assault"
  },
  {
    "group_id": "gid-resounding-finale",
    "logic": "and",
    "type": "subclass",
    "value": "마에스트로 뮤즈"
  },
  {
    "group_id": "gid-studious-capacity",
    "logic": "and",
    "type": "subclass",
    "value": "수수께끼 뮤즈"
  },
  {
    "group_id": "gid-studious-capacity",
    "logic": "and",
    "type": "occultism",
    "value": "8"
  },
  {
    "group_id": "gid-deep-lore",
    "logic": "and",
    "type": "subclass",
    "value": "수수께끼 뮤즈"
  },
  {
    "group_id": "gid-deep-lore",
    "logic": "and",
    "type": "occultism",
    "value": "8"
  },
  {
    "group_id": "gid-eternal-composition",
    "logic": "and",
    "type": "subclass",
    "value": "마에스트로 뮤즈"
  },
  {
    "group_id": "gid-impossible-polymath",
    "logic": "or",
    "type": "arcana",
    "value": "2"
  },
  {
    "group_id": "gid-impossible-polymath",
    "logic": "or",
    "type": "nature",
    "value": "2"
  },
  {
    "group_id": "gid-impossible-polymath",
    "logic": "or",
    "type": "religion",
    "value": "2"
  },
  {
    "group_id": "gid-impossible-polymath",
    "logic": "and",
    "type": "feat",
    "value": "Esoteric Polymath"
  },
  {
    "group_id": "gid-symphony-of-the-muse",
    "logic": "and",
    "type": "feat",
    "value": "Harmonize"
  },
  {
    "group_id": "gid-ultimate-polymath",
    "logic": "and",
    "type": "subclass",
    "value": "박학다식 뮤즈"
  },
  {
    "group_id": "gid-harming-hands",
    "logic": "and",
    "type": "divine_font",
    "value": "harm"
  },
  {
    "group_id": "gid-healing-hands",
    "logic": "and",
    "type": "divine_font",
    "value": "heal"
  },
  {
    "group_id": "gid-versatile-font",
    "logic": "and",
    "type": "divine_font",
    "value": "either"
  },
  {
    "group_id": "gid-warpriests-armor",
    "logic": "and",
    "type": "subclass",
    "value": "전투 사제 교의"
  },
  {
    "group_id": "gid-sacred-ground",
    "logic": "and",
    "type": "divine_font",
    "value": "either"
  },
  {
    "group_id": "gid-magic-hands",
    "logic": "and",
    "type": "feat",
    "value": "Healing Hands"
  },
  {
    "group_id": "gid-advanced-domain",
    "logic": "and",
    "type": "feat",
    "value": "Domain Initiate"
  },
  {
    "group_id": "gid-emblazon-energy",
    "logic": "and",
    "type": "feat",
    "value": "Emblazon Armament"
  },
  {
    "group_id": "gid-restorative-channel",
    "logic": "and",
    "type": "divine_font",
    "value": "heal"
  },
  {
    "group_id": "gid-castigating-weapon",
    "logic": "and",
    "type": "feat",
    "value": "Divine Castigation"
  },
  {
    "group_id": "gid-heroic-recovery",
    "logic": "and",
    "type": "divine_font",
    "value": "heal"
  },
  {
    "group_id": "gid-shared-avoidance",
    "logic": "and",
    "type": "feat",
    "value": "Premonition of Avoidance"
  },
  {
    "group_id": "gid-shield-of-faith",
    "logic": "and",
    "type": "feat",
    "value": "Domain Initiate"
  },
  {
    "group_id": "gid-emblazon-antimagic",
    "logic": "and",
    "type": "feat",
    "value": "Emblazon Armament"
  },
  {
    "group_id": "gid-sapping-symbol",
    "logic": "and",
    "type": "feat",
    "value": "Raise Symbol"
  },
  {
    "group_id": "gid-shared-replenishment",
    "logic": "and",
    "type": "feat",
    "value": "Replenishment of War"
  },
  {
    "group_id": "gid-channeling-block",
    "logic": "and",
    "type": "feat",
    "value": "Shield Block"
  },
  {
    "group_id": "gid-deitys-protection",
    "logic": "and",
    "type": "feat",
    "value": "Advanced Domain"
  },
  {
    "group_id": "gid-ebb-and-flow",
    "logic": "and",
    "type": "feat",
    "value": "Versatile Font"
  },
  {
    "group_id": "gid-fast-channel",
    "logic": "and",
    "type": "divine_font",
    "value": "either"
  },
  {
    "group_id": "gid-lasting-armament",
    "logic": "and",
    "type": "feat",
    "value": "Sanctify Armament"
  },
  {
    "group_id": "gid-rebounding-smite",
    "logic": "and",
    "type": "feat",
    "value": "Channel Smite"
  },
  {
    "group_id": "gid-improved-swift-banishment",
    "logic": "and",
    "type": "feat",
    "value": "Swift Banishment"
  },
  {
    "group_id": "gid-shared-clarity",
    "logic": "and",
    "type": "feat",
    "value": "Premonition of Clarity"
  },
  {
    "group_id": "gid-storm-born",
    "logic": "and",
    "type": "subclass",
    "value": "폭풍 결사"
  },
  {
    "group_id": "gid-untamed-form",
    "logic": "and",
    "type": "subclass",
    "value": "야생 결사"
  },
  {
    "group_id": "gid-enhanced-familiar-witch",
    "logic": "and",
    "type": "feat",
    "value": "Familiar"
  },
  {
    "group_id": "gid-anthropomorphic-shape",
    "logic": "and",
    "type": "feat",
    "value": "Untamed Form"
  },
  {
    "group_id": "gid-forest-passage",
    "logic": "and",
    "type": "subclass",
    "value": "잎 결사"
  },
  {
    "group_id": "gid-form-control",
    "logic": "and",
    "type": "feat",
    "value": "Untamed Form"
  },
  {
    "group_id": "gid-leshy-familiar-secrets",
    "logic": "and",
    "type": "subclass",
    "value": "잎 결사"
  },
  {
    "group_id": "gid-mature-animal-companion-ranger",
    "logic": "and",
    "type": "feat",
    "value": "Animal Companion"
  },
  {
    "group_id": "gid-order-magic",
    "logic": "and",
    "type": "feat",
    "value": "Order Explorer"
  },
  {
    "group_id": "gid-snowdrift-spell",
    "logic": "and",
    "type": "subclass",
    "value": "폭풍 결사"
  },
  {
    "group_id": "gid-grown-of-oak",
    "logic": "and",
    "type": "subclass",
    "value": "잎 결사"
  },
  {
    "group_id": "gid-insect-shape",
    "logic": "and",
    "type": "feat",
    "value": "Untamed Form"
  },
  {
    "group_id": "gid-instinctive-support",
    "logic": "and",
    "type": "feat",
    "value": "Animal Companion"
  },
  {
    "group_id": "gid-storm-retribution",
    "logic": "and",
    "type": "subclass",
    "value": "폭풍 결사"
  },
  {
    "group_id": "gid-deimatic-display",
    "logic": "and",
    "type": "intimidation",
    "value": "2"
  },
  {
    "group_id": "gid-ferocious-shape",
    "logic": "and",
    "type": "feat",
    "value": "Untamed Form"
  },
  {
    "group_id": "gid-floral-restoration",
    "logic": "and",
    "type": "subclass",
    "value": "잎 결사"
  },
  {
    "group_id": "gid-incredible-companion-ranger",
    "logic": "and",
    "type": "feat",
    "value": "Mature Animal Companion"
  },
  {
    "group_id": "gid-soaring-shape",
    "logic": "and",
    "type": "feat",
    "value": "Untamed Form"
  },
  {
    "group_id": "gid-wind-caller",
    "logic": "and",
    "type": "subclass",
    "value": "폭풍 결사"
  },
  {
    "group_id": "gid-elemental-shape",
    "logic": "and",
    "type": "feat",
    "value": "Untamed Form"
  },
  {
    "group_id": "gid-plant-shape",
    "logic": "or",
    "type": "subclass",
    "value": "잎 결사"
  },
  {
    "group_id": "gid-plant-shape",
    "logic": "or",
    "type": "feat",
    "value": "Untamed Form"
  },
  {
    "group_id": "gid-primal-howl",
    "logic": "and",
    "type": "feat",
    "value": "Incredible Companion"
  },
  {
    "group_id": "gid-pristine-weapon",
    "logic": "and",
    "type": "feat",
    "value": "Verdant Weapon"
  },
  {
    "group_id": "gid-side-by-side-ranger",
    "logic": "and",
    "type": "feat",
    "value": "Animal Companion"
  },
  {
    "group_id": "gid-thunderclap-spell",
    "logic": "and",
    "type": "subclass",
    "value": "폭풍 결사"
  },
  {
    "group_id": "gid-dragon-shape",
    "logic": "and",
    "type": "feat",
    "value": "Soaring Shape"
  },
  {
    "group_id": "gid-garland-spell",
    "logic": "and",
    "type": "subclass",
    "value": "잎 결사"
  },
  {
    "group_id": "gid-primal-summons",
    "logic": "and",
    "type": "feat",
    "value": "Call of the Wild"
  },
  {
    "group_id": "gid-wandering-oasis",
    "logic": "and",
    "type": "survival",
    "value": "6"
  },
  {
    "group_id": "gid-reactive-transformation",
    "logic": "and",
    "type": "feat",
    "value": "Untamed Form"
  },
  {
    "group_id": "gid-specialized-companion-ranger",
    "logic": "and",
    "type": "feat",
    "value": "Incredible Companion"
  },
  {
    "group_id": "gid-verdant-metamorphosis",
    "logic": "and",
    "type": "subclass",
    "value": "잎 결사"
  },
  {
    "group_id": "gid-impaling-briars",
    "logic": "and",
    "type": "subclass",
    "value": "잎 결사"
  },
  {
    "group_id": "gid-monstrosity-shape",
    "logic": "and",
    "type": "feat",
    "value": "Untamed Form"
  },
  {
    "group_id": "gid-uplifting-winds",
    "logic": "and",
    "type": "subclass",
    "value": "폭풍 결사"
  },
  {
    "group_id": "gid-invoke-disaster",
    "logic": "and",
    "type": "feat",
    "value": "Wind Caller"
  },
  {
    "group_id": "gid-perfect-form-control",
    "logic": "and",
    "type": "feat",
    "value": "Form Control"
  },
  {
    "group_id": "gid-perfect-form-control",
    "logic": "and",
    "type": "str",
    "value": "4"
  },
  {
    "group_id": "gid-true-shapeshifter",
    "logic": "and",
    "type": "feat",
    "value": "Dragon Shape"
  },
  {
    "group_id": "gid-true-shapeshifter",
    "logic": "and",
    "type": "feat",
    "value": "Untamed Form"
  },
  {
    "group_id": "gid-barreling-charge",
    "logic": "and",
    "type": "athletics",
    "value": "2"
  },
  {
    "group_id": "gid-powerful-shove",
    "logic": "or",
    "type": "feat",
    "value": "Aggressive Block"
  },
  {
    "group_id": "gid-powerful-shove",
    "logic": "or",
    "type": "feat",
    "value": "Brutish Shove"
  },
  {
    "group_id": "gid-slam-down",
    "logic": "and",
    "type": "athletics",
    "value": "2"
  },
  {
    "group_id": "gid-disarming-stance",
    "logic": "and",
    "type": "athletics",
    "value": "2"
  },
  {
    "group_id": "gid-furious-focus",
    "logic": "and",
    "type": "feat",
    "value": "Vicious Swing"
  },
  {
    "group_id": "gid-shield-warden",
    "logic": "and",
    "type": "feat",
    "value": "Shield Block"
  },
  {
    "group_id": "gid-triple-shot",
    "logic": "and",
    "type": "feat",
    "value": "Double Shot"
  },
  {
    "group_id": "gid-blind-fight-rogue",
    "logic": "and",
    "type": "perception",
    "value": "6"
  },
  {
    "group_id": "gid-disorienting-opening",
    "logic": "and",
    "type": "feat",
    "value": "Reactive Striker"
  },
  {
    "group_id": "gid-dueling-riposte",
    "logic": "and",
    "type": "feat",
    "value": "Dueling Parry"
  },
  {
    "group_id": "gid-quick-shield-block",
    "logic": "and",
    "type": "feat",
    "value": "Shield Block"
  },
  {
    "group_id": "gid-crashing-slam",
    "logic": "and",
    "type": "feat",
    "value": "Slam Down"
  },
  {
    "group_id": "gid-disarming-twist",
    "logic": "and",
    "type": "athletics",
    "value": "2"
  },
  {
    "group_id": "gid-overpowering-charge",
    "logic": "and",
    "type": "feat",
    "value": "Barreling Charge"
  },
  {
    "group_id": "gid-twin-riposte-ranger",
    "logic": "and",
    "type": "feat",
    "value": "Twin Parry"
  },
  {
    "group_id": "gid-dueling-dance",
    "logic": "and",
    "type": "feat",
    "value": "Dueling Parry"
  },
  {
    "group_id": "gid-flinging-shove",
    "logic": "or",
    "type": "feat",
    "value": "Aggressive Block"
  },
  {
    "group_id": "gid-flinging-shove",
    "logic": "or",
    "type": "feat",
    "value": "Brutish Shove"
  },
  {
    "group_id": "gid-improved-dueling-riposte",
    "logic": "and",
    "type": "feat",
    "value": "Dueling Riposte"
  },
  {
    "group_id": "gid-incredible-ricochet",
    "logic": "and",
    "type": "feat",
    "value": "Incredible Aim"
  },
  {
    "group_id": "gid-lunging-stance",
    "logic": "and",
    "type": "feat",
    "value": "Lunge"
  },
  {
    "group_id": "gid-lunging-stance",
    "logic": "and",
    "type": "feat",
    "value": "Reactive Striker"
  },
  {
    "group_id": "gid-guiding-riposte",
    "logic": "and",
    "type": "feat",
    "value": "Dueling Riposte"
  },
  {
    "group_id": "gid-improved-twin-riposte-ranger",
    "logic": "and",
    "type": "feat",
    "value": "Twin Riposte"
  },
  {
    "group_id": "gid-graceful-poise",
    "logic": "and",
    "type": "feat",
    "value": "Double Slice"
  },
  {
    "group_id": "gid-improved-reflexive-shield",
    "logic": "and",
    "type": "feat",
    "value": "Reflexive Shield"
  },
  {
    "group_id": "gid-master-of-many-styles",
    "logic": "and",
    "type": "feat",
    "value": "Opening Stance"
  },
  {
    "group_id": "gid-multishot-stance",
    "logic": "and",
    "type": "feat",
    "value": "Double Shot"
  },
  {
    "group_id": "gid-twinned-defense",
    "logic": "and",
    "type": "feat",
    "value": "Twin Parry"
  },
  {
    "group_id": "gid-smash-from-the-air",
    "logic": "and",
    "type": "feat",
    "value": "Cut from the Air"
  },
  {
    "group_id": "gid-monster-warden",
    "logic": "and",
    "type": "feat",
    "value": "Monster Hunter"
  },
  {
    "group_id": "gid-advanced-warden",
    "logic": "and",
    "type": "feat",
    "value": "Initiate Warden"
  },
  {
    "group_id": "gid-companions-cry",
    "logic": "and",
    "type": "feat",
    "value": "Animal Companion"
  },
  {
    "group_id": "gid-masterful-warden",
    "logic": "and",
    "type": "feat",
    "value": "Initiate Warden"
  },
  {
    "group_id": "gid-mature-animal-companion-ranger",
    "logic": "and",
    "type": "feat",
    "value": "Animal Companion"
  },
  {
    "group_id": "gid-swift-tracker",
    "logic": "and",
    "type": "survival",
    "value": "4"
  },
  {
    "group_id": "gid-swift-tracker",
    "logic": "and",
    "type": "feat",
    "value": "Experienced Tracker"
  },
  {
    "group_id": "gid-blind-fight-rogue",
    "logic": "and",
    "type": "perception",
    "value": "6"
  },
  {
    "group_id": "gid-terrain-master",
    "logic": "and",
    "type": "survival",
    "value": "6"
  },
  {
    "group_id": "gid-terrain-master",
    "logic": "and",
    "type": "feat",
    "value": "Favored Terrain"
  },
  {
    "group_id": "gid-camouflage",
    "logic": "and",
    "type": "stealth",
    "value": "6"
  },
  {
    "group_id": "gid-incredible-companion-ranger",
    "logic": "and",
    "type": "feat",
    "value": "Mature Animal Companion"
  },
  {
    "group_id": "gid-master-monster-hunter",
    "logic": "and",
    "type": "nature",
    "value": "6"
  },
  {
    "group_id": "gid-master-monster-hunter",
    "logic": "and",
    "type": "feat",
    "value": "Monster Hunter"
  },
  {
    "group_id": "gid-peerless-warden",
    "logic": "and",
    "type": "feat",
    "value": "Initiate Warden"
  },
  {
    "group_id": "gid-twin-riposte-ranger",
    "logic": "and",
    "type": "feat",
    "value": "Twin Parry"
  },
  {
    "group_id": "gid-wardens-step",
    "logic": "and",
    "type": "stealth",
    "value": "6"
  },
  {
    "group_id": "gid-side-by-side-ranger",
    "logic": "and",
    "type": "feat",
    "value": "Animal Companion"
  },
  {
    "group_id": "gid-shared-prey",
    "logic": "and",
    "type": "feat",
    "value": "Double Prey"
  },
  {
    "group_id": "gid-shared-prey",
    "logic": "and",
    "type": "feat",
    "value": "Warden's Boon"
  },
  {
    "group_id": "gid-stealthy-companion",
    "logic": "and",
    "type": "feat",
    "value": "Animal Companion"
  },
  {
    "group_id": "gid-stealthy-companion",
    "logic": "and",
    "type": "feat",
    "value": "Camouflage"
  },
  {
    "group_id": "gid-greater-distracting-shot",
    "logic": "and",
    "type": "feat",
    "value": "Distracting Shot"
  },
  {
    "group_id": "gid-improved-twin-riposte-ranger",
    "logic": "and",
    "type": "feat",
    "value": "Twin Riposte"
  },
  {
    "group_id": "gid-legendary-monster-hunter",
    "logic": "and",
    "type": "nature",
    "value": "8"
  },
  {
    "group_id": "gid-legendary-monster-hunter",
    "logic": "and",
    "type": "feat",
    "value": "Master Monster Hunter"
  },
  {
    "group_id": "gid-specialized-companion-ranger",
    "logic": "and",
    "type": "feat",
    "value": "Incredible Companion"
  },
  {
    "group_id": "gid-masterful-companion",
    "logic": "and",
    "type": "feat",
    "value": "Animal Companion"
  },
  {
    "group_id": "gid-shadow-hunter",
    "logic": "and",
    "type": "feat",
    "value": "Camouflage"
  },
  {
    "group_id": "gid-legendary-shot",
    "logic": "and",
    "type": "perception",
    "value": "8"
  },
  {
    "group_id": "gid-legendary-shot",
    "logic": "and",
    "type": "feat",
    "value": "Far Shot"
  },
  {
    "group_id": "gid-to-the-ends-of-the-earth",
    "logic": "and",
    "type": "survival",
    "value": "8"
  },
  {
    "group_id": "gid-triple-threat",
    "logic": "and",
    "type": "feat",
    "value": "Shared Prey"
  },
  {
    "group_id": "gid-youre-next",
    "logic": "and",
    "type": "intimidation",
    "value": "2"
  },
  {
    "group_id": "gid-brutal-beating",
    "logic": "and",
    "type": "subclass",
    "value": "건달 라켓"
  },
  {
    "group_id": "gid-clever-gambit",
    "logic": "and",
    "type": "subclass",
    "value": "지략가 라켓"
  },
  {
    "group_id": "gid-distracting-feint",
    "logic": "and",
    "type": "subclass",
    "value": "사기꾼 라켓"
  },
  {
    "group_id": "gid-unbalancing-blow",
    "logic": "and",
    "type": "subclass",
    "value": "도둑 라켓"
  },
  {
    "group_id": "gid-underhanded-assault",
    "logic": "and",
    "type": "stealth",
    "value": "2"
  },
  {
    "group_id": "gid-twin-distraction",
    "logic": "and",
    "type": "feat",
    "value": "Twin Feint"
  },
  {
    "group_id": "gid-anticipate-ambush",
    "logic": "and",
    "type": "stealth",
    "value": "4"
  },
  {
    "group_id": "gid-shove-down",
    "logic": "and",
    "type": "athletics",
    "value": "2"
  },
  {
    "group_id": "gid-watch-your-back",
    "logic": "and",
    "type": "intimidation",
    "value": "2"
  },
  {
    "group_id": "gid-blind-fight-rogue",
    "logic": "and",
    "type": "perception",
    "value": "6"
  },
  {
    "group_id": "gid-improved-poison-weapon",
    "logic": "and",
    "type": "feat",
    "value": "Poison Weapon"
  },
  {
    "group_id": "gid-nimble-roll",
    "logic": "and",
    "type": "feat",
    "value": "Nimble Dodge"
  },
  {
    "group_id": "gid-tactical-entry",
    "logic": "and",
    "type": "stealth",
    "value": "6"
  },
  {
    "group_id": "gid-methodical-debilitations",
    "logic": "and",
    "type": "subclass",
    "value": "지략가 라켓"
  },
  {
    "group_id": "gid-nimble-strike",
    "logic": "and",
    "type": "feat",
    "value": "Nimble Roll"
  },
  {
    "group_id": "gid-precise-debilitations",
    "logic": "and",
    "type": "subclass",
    "value": "도둑 라켓"
  },
  {
    "group_id": "gid-sneak-adept",
    "logic": "and",
    "type": "stealth",
    "value": "6"
  },
  {
    "group_id": "gid-tactical-debilitations",
    "logic": "and",
    "type": "subclass",
    "value": "사기꾼 라켓"
  },
  {
    "group_id": "gid-vicious-debilitations",
    "logic": "and",
    "type": "subclass",
    "value": "건달 라켓"
  },
  {
    "group_id": "gid-bloody-debilitation",
    "logic": "and",
    "type": "medicine",
    "value": "2"
  },
  {
    "group_id": "gid-ricochet-feint",
    "logic": "and",
    "type": "feat",
    "value": "Ricochet Stance"
  },
  {
    "group_id": "gid-stay-down",
    "logic": "and",
    "type": "athletics",
    "value": "6"
  },
  {
    "group_id": "gid-blank-slate",
    "logic": "and",
    "type": "deception",
    "value": "8"
  },
  {
    "group_id": "gid-cloud-step",
    "logic": "and",
    "type": "acrobatics",
    "value": "8"
  },
  {
    "group_id": "gid-perfect-distraction",
    "logic": "and",
    "type": "deception",
    "value": "8"
  },
  {
    "group_id": "gid-swift-elusion",
    "logic": "and",
    "type": "acrobatics",
    "value": "8"
  },
  {
    "group_id": "gid-implausible-infiltration",
    "logic": "and",
    "type": "acrobatics",
    "value": "8"
  },
  {
    "group_id": "gid-implausible-infiltration",
    "logic": "and",
    "type": "feat",
    "value": "Quick Squeeze"
  },
  {
    "group_id": "gid-implausible-purchase",
    "logic": "and",
    "type": "feat",
    "value": "Predictive Purchase"
  },
  {
    "group_id": "gid-hidden-paragon",
    "logic": "and",
    "type": "stealth",
    "value": "8"
  },
  {
    "group_id": "gid-impossible-striker",
    "logic": "and",
    "type": "feat",
    "value": "Sly Striker"
  },
  {
    "group_id": "gid-reactive-distraction",
    "logic": "and",
    "type": "deception",
    "value": "8"
  },
  {
    "group_id": "gid-reactive-distraction",
    "logic": "and",
    "type": "feat",
    "value": "Perfect Distraction"
  },
  {
    "group_id": "gid-enhanced-familiar-witch",
    "logic": "and",
    "type": "feat",
    "value": "Familiar"
  },
  {
    "group_id": "gid-clever-counterspell",
    "logic": "and",
    "type": "feat",
    "value": "Counterspell"
  },
  {
    "group_id": "gid-reflect-spell-witch",
    "logic": "and",
    "type": "feat",
    "value": "Counterspell"
  },
  {
    "group_id": "gid-enhanced-familiar-witch",
    "logic": "and",
    "type": "feat",
    "value": "Familiar"
  },
  {
    "group_id": "gid-reflect-spell-witch",
    "logic": "and",
    "type": "feat",
    "value": "Counterspell"
  }
];

// ═══════════════════════════════════════════════
//  EFFECT_GROUPS — FEAT_DB.effect_group_id 1:N 정규화 (v532~ Phase 3a)
//  공통 효과 + 옵션별 효과 (choiceEffects)를 단일 테이블에 통합.
//  group_id 패턴: eg-{feat.id} (공통) / eg-{feat.id}-{option.id} (옵션별)
//  컬럼: group_id, type, target (식별자 통합 — skill/spell/feat/action/weapon_name/vision/sense/save),
//        value, bonus_type, condition, tradition, ... (sparse)
//  weapons 배열은 행 펼침 (한 그룹에 weapon_familiarity 행 N개).
//  NOTE: display_note/damage_note는 FEAT_DB.auto_note/damage_note 컬럼으로 흡수.
// ═══════════════════════════════════════════════
const EFFECT_GROUPS = [
  {
    "group_id": "eg-bard-dedication",
    "type": "skill_trained",
    "target": "occultism"
  },
  {
    "group_id": "eg-bard-dedication",
    "type": "skill_trained",
    "target": "performance"
  },
  {
    "group_id": "eg-cleric-dedication",
    "type": "skill_trained",
    "target": "religion"
  },
  {
    "group_id": "eg-druid-dedication",
    "type": "skill_trained",
    "target": "nature"
  },
  {
    "group_id": "eg-fighter-dedication",
    "type": "skill_trained",
    "target": "$choice"
  },
  {
    "group_id": "eg-fighter-resiliency",
    "type": "hp_bonus",
    "value": 3
  },
  {
    "group_id": "eg-reactive-striker",
    "type": "grant_action",
    "target": "aoo"
  },
  {
    "group_id": "eg-ranger-dedication",
    "type": "skill_trained",
    "target": "survival"
  },
  {
    "group_id": "eg-ranger-dedication",
    "type": "grant_action",
    "summary": "[1행동] 사냥감 추적 (Hunt Prey) — 시야 내 생물 1명을 사냥감으로 지정. 사냥감에 대해 무시(Ignore) 지형을 사용하여 추적하고, 추적 속도가 전체 속도가 됩니다.",
    "actionCost": "1"
  },
  {
    "group_id": "eg-ranger-resiliency",
    "type": "hp_bonus",
    "value": 3
  },
  {
    "group_id": "eg-rogue-dedication",
    "type": "skill_trained",
    "target": "stealth"
  },
  {
    "group_id": "eg-rogue-dedication",
    "type": "skill_trained",
    "target": "thievery"
  },
  {
    "group_id": "eg-rogue-dedication",
    "type": "grant_action",
    "summary": "기습 공격 (Surprise Attack) — 전투 시작 시 선제를 굴리기 전에 행동한 적이 아닌 모든 생물은 당신에게 무방비(flat-footed)입니다. 첫 턴이 끝나면 해제.",
    "actionCost": "free"
  },
  {
    "group_id": "eg-witch-dedication",
    "type": "skill_trained",
    "target": "occultism"
  },
  {
    "group_id": "eg-basic-witchcraft",
    "type": "familiar_abilities",
    "value": 1
  },
  {
    "group_id": "eg-wizard-dedication",
    "type": "skill_trained",
    "target": "arcana"
  },
  {
    "group_id": "eg-dwarven-lore",
    "type": "skill_trained",
    "target": "$choice"
  },
  {
    "group_id": "eg-dwarven-lore",
    "type": "grant_feat",
    "target": "추가 지식 (Additional Lore)",
    "defaultChoice": "드워프"
  },
  {
    "group_id": "eg-dwarven-weapon-familiarity",
    "type": "weapon_familiarity",
    "target": "전투 도끼"
  },
  {
    "group_id": "eg-dwarven-weapon-familiarity",
    "type": "weapon_familiarity",
    "target": "픽"
  },
  {
    "group_id": "eg-dwarven-weapon-familiarity",
    "type": "weapon_familiarity",
    "target": "워해머"
  },
  {
    "group_id": "eg-stonemasons-eye",
    "type": "skill_trained",
    "target": "crafting"
  },
  {
    "group_id": "eg-stonemasons-eye",
    "type": "grant_feat_if_trained",
    "target": "crafting",
    "defaultChoice": "stonemasonry"
  },
  {
    "group_id": "eg-unburdened-iron",
    "type": "unburdened_iron"
  },
  {
    "group_id": "eg-elven-lore",
    "type": "skill_trained",
    "target": "$choice"
  },
  {
    "group_id": "eg-elven-lore",
    "type": "grant_feat",
    "target": "추가 지식 (Additional Lore)",
    "defaultChoice": "엘프"
  },
  {
    "group_id": "eg-elven-weapon-familiarity",
    "type": "weapon_trained",
    "target": "장궁"
  },
  {
    "group_id": "eg-elven-weapon-familiarity",
    "type": "weapon_trained",
    "target": "단궁"
  },
  {
    "group_id": "eg-elven-weapon-familiarity",
    "type": "weapon_trained",
    "target": "롱소드"
  },
  {
    "group_id": "eg-elven-weapon-familiarity",
    "type": "weapon_trained",
    "target": "레이피어"
  },
  {
    "group_id": "eg-elven-weapon-familiarity",
    "type": "weapon_familiarity",
    "target": "합성 장궁"
  },
  {
    "group_id": "eg-elven-weapon-familiarity",
    "type": "weapon_familiarity",
    "target": "합성 단궁"
  },
  {
    "group_id": "eg-forlorn",
    "type": "save_bonus",
    "target": "will",
    "value": 1,
    "bonus_type": "circumstance",
    "condition": "감정 효과"
  },
  {
    "group_id": "eg-nimble-elf",
    "type": "speed_bonus",
    "value": 5
  },
  {
    "group_id": "eg-otherworldly-magic",
    "type": "grant_innate_spell"
  },
  {
    "group_id": "eg-first-world-magic",
    "type": "grant_innate_spell"
  },
  {
    "group_id": "eg-gnome-weapon-familiarity",
    "type": "weapon_familiarity",
    "target": "글레이브"
  },
  {
    "group_id": "eg-gnome-obsession",
    "type": "grant_feat",
    "target": "추가 지식 (Additional Lore)"
  },
  {
    "group_id": "eg-gnome-obsession",
    "type": "grant_feat",
    "target": "확신 (Assurance)"
  },
  {
    "group_id": "eg-goblin-lore",
    "type": "skill_trained",
    "target": "$choice"
  },
  {
    "group_id": "eg-goblin-lore",
    "type": "grant_feat",
    "target": "추가 지식 (Additional Lore)",
    "defaultChoice": "고블린"
  },
  {
    "group_id": "eg-goblin-scuttle",
    "type": "grant_action"
  },
  {
    "group_id": "eg-goblin-song",
    "type": "grant_action",
    "target": "goblin-song"
  },
  {
    "group_id": "eg-goblin-weapon-familiarity",
    "type": "weapon_familiarity",
    "weapons": []
  },
  {
    "group_id": "eg-rough-rider",
    "type": "grant_feat",
    "target": "기마 (Ride)"
  },
  {
    "group_id": "eg-halfling-lore",
    "type": "skill_trained",
    "target": "$choice"
  },
  {
    "group_id": "eg-halfling-lore",
    "type": "grant_feat",
    "target": "추가 지식 (Additional Lore)",
    "defaultChoice": "하플링"
  },
  {
    "group_id": "eg-halfling-luck",
    "type": "grant_action"
  },
  {
    "group_id": "eg-halfling-weapon-familiarity",
    "type": "weapon_familiarity",
    "target": "쇼트소드"
  },
  {
    "group_id": "eg-halfling-weapon-familiarity",
    "type": "weapon_familiarity",
    "target": "하플링 투석 지팡이"
  },
  {
    "group_id": "eg-prairie-rider",
    "type": "skill_trained",
    "target": "nature"
  },
  {
    "group_id": "eg-natural-skill",
    "type": "skill_trained",
    "target": "$choice"
  },
  {
    "group_id": "eg-unconventional-weaponry",
    "type": "weapon_familiarity",
    "target": "$choice"
  },
  {
    "group_id": "eg-beast-trainer",
    "type": "skill_trained",
    "target": "nature"
  },
  {
    "group_id": "eg-beast-trainer-pet",
    "type": "grant_feat",
    "target": "반려동물 (Pet)"
  },
  {
    "group_id": "eg-beast-trainer-train",
    "type": "grant_feat",
    "target": "동물 훈련 (Train Animal)"
  },
  {
    "group_id": "eg-orc-ferocity",
    "type": "grant_action"
  },
  {
    "group_id": "eg-orc-lore",
    "type": "skill_trained",
    "target": "$choice"
  },
  {
    "group_id": "eg-orc-lore",
    "type": "grant_feat",
    "target": "추가 지식 (Additional Lore)",
    "defaultChoice": "오크"
  },
  {
    "group_id": "eg-hold-mark-sun",
    "type": "skill_trained",
    "target": "diplomacy"
  },
  {
    "group_id": "eg-hold-mark-sun",
    "type": "save_bonus",
    "target": "all",
    "value": 1,
    "bonus_type": "status",
    "condition": "비전 주문"
  },
  {
    "group_id": "eg-hold-mark-skull",
    "type": "skill_trained",
    "target": "survival"
  },
  {
    "group_id": "eg-hold-mark-skull",
    "type": "save_bonus",
    "target": "all",
    "value": 1,
    "bonus_type": "status",
    "condition": "원시 주문"
  },
  {
    "group_id": "eg-hold-mark-corpse",
    "type": "skill_trained",
    "target": "religion"
  },
  {
    "group_id": "eg-hold-mark-corpse",
    "type": "save_bonus",
    "target": "all",
    "value": 1,
    "bonus_type": "status",
    "condition": "신성 주문"
  },
  {
    "group_id": "eg-hold-mark-hand",
    "type": "skill_trained",
    "target": "intimidation"
  },
  {
    "group_id": "eg-hold-mark-hand",
    "type": "save_bonus",
    "target": "all",
    "value": 1,
    "bonus_type": "status",
    "condition": "오컬트 주문"
  },
  {
    "group_id": "eg-orc-weapon-familiarity",
    "type": "weapon_familiarity",
    "target": "팔치온"
  },
  {
    "group_id": "eg-orc-weapon-familiarity",
    "type": "weapon_familiarity",
    "target": "그레이트액스"
  },
  {
    "group_id": "eg-tusks",
    "type": "grant_weapon",
    "target": "엄니",
    "weapon_category": "unarmed",
    "damage": "1d6 P",
    "range": 0,
    "traits": [
      "비무장",
      "기교"
    ]
  },
  {
    "group_id": "eg-changeling-lore",
    "type": "skill_trained",
    "target": "$choice"
  },
  {
    "group_id": "eg-changeling-lore",
    "type": "grant_feat",
    "target": "추가 지식 (Additional Lore)",
    "defaultChoice": "해그"
  },
  {
    "group_id": "eg-angelkin",
    "type": "skill_trained",
    "target": "society"
  },
  {
    "group_id": "eg-hellspawn",
    "type": "skill_trained",
    "target": "deception"
  },
  {
    "group_id": "eg-pitborn",
    "type": "skill_trained",
    "target": "athletics"
  },
  {
    "group_id": "eg-nephilim-lore",
    "type": "skill_trained",
    "target": "$choice"
  },
  {
    "group_id": "eg-nephilim-lore",
    "type": "grant_feat",
    "target": "추가 지식 (Additional Lore)"
  },
  {
    "group_id": "eg-nimble-hooves",
    "type": "speed_bonus",
    "value": 5
  },
  {
    "group_id": "eg-earned-glory",
    "type": "skill_trained",
    "target": "performance"
  },
  {
    "group_id": "eg-defy-the-darkness",
    "type": "vision_upgrade",
    "target": "상위 암시야"
  },
  {
    "group_id": "eg-martial-experience",
    "type": "martial_experience"
  },
  {
    "group_id": "eg-vandal",
    "type": "skill_trained",
    "target": "thievery"
  },
  {
    "group_id": "eg-cultural-adaptability",
    "type": "grant_feat",
    "target": "양자 혈통 (Adopted Ancestry)"
  },
  {
    "group_id": "eg-cultural-adaptability",
    "type": "grant_adopted_feat"
  },
  {
    "group_id": "eg-step-lively",
    "type": "grant_action"
  },
  {
    "group_id": "eg-clever-improviser",
    "type": "grant_feat",
    "target": "비숙련 즉흥연기 (Untrained Improvisation)"
  },
  {
    "group_id": "eg-supernatural-charm",
    "type": "grant_innate_spell",
    "target": "매혹",
    "tradition": "비전",
    "uses": "하루 1회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-echoes-in-stone",
    "type": "extra_sense",
    "target": "진동 감각 20피트 (돌/흙 위, 1행동)"
  },
  {
    "group_id": "eg-mountains-stoutness",
    "type": "hp_bonus",
    "value": "level"
  },
  {
    "group_id": "eg-mountains-stoutness",
    "type": "recovery_dc",
    "value": -1
  },
  {
    "group_id": "eg-stone-bones",
    "type": "grant_action"
  },
  {
    "group_id": "eg-stonewalker",
    "type": "grant_innate_spell",
    "target": "돌과 하나",
    "tradition": "신성",
    "uses": "하루 1회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-elf-step",
    "type": "grant_action"
  },
  {
    "group_id": "eg-tree-climber",
    "type": "speed_extra",
    "value": 10,
    "key": "climb"
  },
  {
    "group_id": "eg-life-leap",
    "type": "grant_action"
  },
  {
    "group_id": "eg-cave-climber",
    "type": "speed_extra",
    "value": 10,
    "key": "climb"
  },
  {
    "group_id": "eg-cling",
    "type": "grant_action"
  },
  {
    "group_id": "eg-unhampered-passage",
    "type": "grant_innate_spell",
    "target": "속박 해제",
    "tradition": "원시",
    "uses": "하루 1회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-hardy-traveler",
    "type": "bulk_bonus",
    "value": 1
  },
  {
    "group_id": "eg-pervasive-superstition",
    "type": "save_bonus",
    "target": "all",
    "value": 1,
    "bonus_type": "circumstance",
    "condition": "마법 효과"
  },
  {
    "group_id": "eg-divine-wings",
    "type": "grant_action"
  },
  {
    "group_id": "eg-march-the-mines",
    "type": "grant_action"
  },
  {
    "group_id": "eg-avenge-ally",
    "type": "grant_action"
  },
  {
    "group_id": "eg-universal-longevity",
    "type": "grant_action"
  },
  {
    "group_id": "eg-instinctive-obfuscation",
    "type": "grant_action"
  },
  {
    "group_id": "eg-bounce-back",
    "type": "grant_action"
  },
  {
    "group_id": "eg-celestial-mercy",
    "type": "grant_innate_spell",
    "target": "고통 정화",
    "tradition": "신성",
    "uses": "하루 2회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-slip-sideways",
    "type": "grant_innate_spell",
    "target": "순간이동",
    "tradition": "신성",
    "uses": "하루 1회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-stonegate",
    "type": "grant_innate_spell",
    "target": "마법 통로",
    "tradition": "신성",
    "uses": "하루 1회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-stonewall",
    "type": "grant_action"
  },
  {
    "group_id": "eg-homeward-bound",
    "type": "grant_innate_spell",
    "target": "차원간 순간이동",
    "tradition": "원시",
    "uses": "주 2회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-reckless-abandon",
    "type": "grant_action"
  },
  {
    "group_id": "eg-shadow-self",
    "type": "grant_action"
  },
  {
    "group_id": "eg-heroic-presence",
    "type": "grant_action"
  },
  {
    "group_id": "eg-rampaging-ferocity",
    "type": "grant_action"
  },
  {
    "group_id": "eg-adopted-ancestry",
    "type": "adopted_ancestry"
  },
  {
    "group_id": "eg-armor-proficiency",
    "type": "armor_upgrade",
    "from": "light"
  },
  {
    "group_id": "eg-diehard",
    "type": "dying_threshold",
    "value": 5
  },
  {
    "group_id": "eg-fleet",
    "type": "speed_bonus",
    "value": 5
  },
  {
    "group_id": "eg-incredible-initiative",
    "type": "initiative_bonus",
    "value": 2,
    "bonus_type": "circumstance"
  },
  {
    "group_id": "eg-shield-block",
    "type": "grant_action",
    "target": "shield-block"
  },
  {
    "group_id": "eg-toughness",
    "type": "hp_bonus",
    "value": "level"
  },
  {
    "group_id": "eg-skill-training",
    "type": "skill_trained",
    "target": "$choice"
  },
  {
    "group_id": "eg-hefty-hauler",
    "type": "bulk_bonus",
    "value": 2
  },
  {
    "group_id": "eg-battle-medicine",
    "type": "grant_action",
    "target": "battle-medicine"
  },
  {
    "group_id": "eg-arcane-sense",
    "type": "grant_innate_spell",
    "target": "마법 탐지",
    "tradition": "신비",
    "uses": "자유",
    "spellType": "cantrip"
  },
  {
    "group_id": "eg-additional-lore",
    "type": "grant_lore",
    "name": "$choice"
  },
  {
    "group_id": "eg-bardic-lore",
    "type": "grant_lore",
    "name": "바드 지식"
  },
  {
    "group_id": "eg-hymn-of-healing",
    "type": "grant_focus_spell",
    "target": "치유의 찬송"
  },
  {
    "group_id": "eg-hymn-of-healing",
    "type": "grant_action"
  },
  {
    "group_id": "eg-lingering-composition",
    "type": "grant_focus_spell",
    "target": "잔향 작곡"
  },
  {
    "group_id": "eg-well-versed",
    "type": "save_bonus",
    "target": "all",
    "value": 1,
    "bonus_type": "circumstance",
    "condition": "청각/환영/언어/음파/시각 효과"
  },
  {
    "group_id": "eg-cantrip-expansion-witch",
    "type": "cantrip_slots",
    "value": 2
  },
  {
    "group_id": "eg-loremasters-etude",
    "type": "grant_focus_spell",
    "target": "달인의 에튀드"
  },
  {
    "group_id": "eg-song-of-strength",
    "type": "grant_focus_spell",
    "target": "힘의 노래"
  },
  {
    "group_id": "eg-uplifting-overture",
    "type": "grant_focus_spell",
    "target": "고양 서곡"
  },
  {
    "group_id": "eg-rallying-anthem",
    "type": "grant_focus_spell",
    "target": "결집의 찬가"
  },
  {
    "group_id": "eg-triple-time",
    "type": "grant_focus_spell",
    "target": "세 박자"
  },
  {
    "group_id": "eg-dirge-of-doom",
    "type": "grant_focus_spell",
    "target": "파멸의 만가"
  },
  {
    "group_id": "eg-song-of-marching",
    "type": "grant_focus_spell",
    "target": "행군의 노래"
  },
  {
    "group_id": "eg-fortissimo-composition",
    "type": "grant_focus_spell",
    "target": "포르티시모 작곡"
  },
  {
    "group_id": "eg-house-of-imaginary-walls",
    "type": "grant_focus_spell",
    "target": "상상의 벽 집"
  },
  {
    "group_id": "eg-ode-to-ouroboros",
    "type": "grant_focus_spell",
    "target": "뱀 물기의 송가"
  },
  {
    "group_id": "eg-symphony-of-the-unfettered-heart",
    "type": "grant_focus_spell",
    "target": "속박 해방의 교향곡"
  },
  {
    "group_id": "eg-allegro",
    "type": "grant_focus_spell",
    "target": "알레그로"
  },
  {
    "group_id": "eg-soothing-ballad",
    "type": "grant_focus_spell",
    "target": "위로의 발라드"
  },
  {
    "group_id": "eg-fatal-aria",
    "type": "grant_focus_spell",
    "target": "치명적 아리아"
  },
  {
    "group_id": "eg-perfect-encore",
    "type": "spell_slots",
    "value": 1,
    "rank": 10
  },
  {
    "group_id": "eg-pied-piping",
    "type": "grant_focus_spell",
    "target": "피리 부는 사나이"
  },
  {
    "group_id": "eg-domain-initiate",
    "type": "grant_focus_spell",
    "target": "$domain_initial"
  },
  {
    "group_id": "eg-cantrip-expansion-witch",
    "type": "cantrip_slots",
    "value": 2
  },
  {
    "group_id": "eg-warpriests-armor",
    "type": "proficiency",
    "target": "armor-medium",
    "rank": 2
  },
  {
    "group_id": "eg-advanced-domain",
    "type": "grant_focus_spell",
    "target": "$domain_advanced"
  },
  {
    "group_id": "eg-maker-of-miracles",
    "type": "spell_slots",
    "value": 1,
    "rank": 10
  },
  {
    "group_id": "eg-enhanced-familiar-witch",
    "type": "familiar_abilities",
    "value": 4
  },
  {
    "group_id": "eg-poison-resistance",
    "type": "resistance",
    "value": "half_level",
    "damage_type": "poison"
  },
  {
    "group_id": "eg-poison-resistance",
    "type": "save_bonus",
    "target": "fort",
    "value": 1,
    "bonus_type": "status",
    "condition": "독 효과"
  },
  {
    "group_id": "eg-timeless-nature",
    "type": "save_bonus",
    "target": "all",
    "value": 2,
    "bonus_type": "status",
    "condition": "질병/원시 마법"
  },
  {
    "group_id": "eg-hierophants-power",
    "type": "spell_slots",
    "value": 1,
    "rank": 10
  },
  {
    "group_id": "eg-twin-parry-ranger",
    "type": "ac_bonus",
    "value": 1,
    "bonus_type": "circumstance",
    "condition": "양손 근접 무기"
  },
  {
    "group_id": "eg-twin-parry-ranger",
    "type": "ac_bonus",
    "value": 1,
    "bonus_type": "circumstance",
    "condition": "양손 근접 무기"
  },
  {
    "group_id": "eg-inspired-stratagem",
    "type": "grant_action"
  },
  {
    "group_id": "eg-familiar",
    "type": "familiar_abilities",
    "value": 2
  },
  {
    "group_id": "eg-cantrip-expansion-witch",
    "type": "cantrip_slots",
    "value": 2
  },
  {
    "group_id": "eg-enhanced-familiar-witch",
    "type": "familiar_abilities",
    "value": 4
  },
  {
    "group_id": "eg-secondary-detonation-array",
    "type": "grant_action"
  },
  {
    "group_id": "eg-cantrip-expansion-witch",
    "type": "cantrip_slots",
    "value": 2
  },
  {
    "group_id": "eg-enhanced-familiar-witch",
    "type": "familiar_abilities",
    "value": 4
  },
  {
    "group_id": "eg-incredible-familiar",
    "type": "familiar_abilities",
    "value": 6
  },
  {
    "group_id": "eg-stitched-familiar",
    "type": "familiar_abilities",
    "value": 1
  },
  {
    "group_id": "eg-shield-block-druid",
    "type": "grant_action",
    "target": "shield-block"
  },
  {
    "group_id": "eg-reactive-strike-fighter",
    "type": "grant_action",
    "target": "aoo"
  },
  {
    "group_id": "eg-shield-block-fighter",
    "type": "grant_action",
    "target": "shield-block"
  },
  {
    "group_id": "eg-hunt-prey-ranger",
    "type": "grant_action",
    "target": "hunt-prey"
  },
  {
    "group_id": "eg-familiar-witch",
    "type": "familiar_abilities",
    "value": 2
  },
  {
    "group_id": "eg-arcane-bond-wizard",
    "type": "grant_action"
  },
  {
    "group_id": "eg-leshy-superstition",
    "type": "grant_action"
  },
  {
    "group_id": "eg-leshy-superstition",
    "type": "save_bonus",
    "target": "all",
    "value": 1,
    "bonus_type": "circumstance",
    "condition": "마법 효과"
  },
  {
    "group_id": "eg-seedpod",
    "type": "grant_weapon",
    "target": "씨앗 꼬투리",
    "damage": "1d4 B",
    "range": 30,
    "traits": [
      "비무장",
      "원거리"
    ],
    "weapon_category": "unarmed"
  },
  {
    "group_id": "eg-undaunted",
    "type": "save_bonus",
    "target": "will",
    "value": 1,
    "bonus_type": "circumstance",
    "condition": "감정 효과"
  },
  {
    "group_id": "eg-harmlessly-cute",
    "type": "grant_feat",
    "target": "뻔뻔한 요청 (Shameless Request)"
  },
  {
    "group_id": "eg-leshy-lore",
    "type": "skill_trained",
    "target": "$choice"
  },
  {
    "group_id": "eg-leshy-lore",
    "type": "grant_feat",
    "target": "추가 지식 (Additional Lore)",
    "defaultChoice": "레쉬"
  },
  {
    "group_id": "eg-anchoring-roots",
    "type": "grant_feat",
    "target": "안정된 균형 (Steady Balance)"
  },
  {
    "group_id": "eg-anchoring-roots",
    "type": "grant_action",
    "actionName": "고정"
  },
  {
    "group_id": "eg-leshy-glide",
    "type": "grant_action"
  },
  {
    "group_id": "eg-ritual-reversion",
    "type": "grant_action"
  },
  {
    "group_id": "eg-bark-and-tendril",
    "type": "grant_innate_spell",
    "target": "방해 식물",
    "tradition": "원시",
    "uses": "하루 1회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-bark-and-tendril",
    "type": "grant_innate_spell",
    "target": "참나무 강인",
    "tradition": "원시",
    "uses": "하루 1회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-lucky-keepsake",
    "type": "save_bonus",
    "target": "all",
    "value": 1,
    "bonus_type": "circumstance",
    "condition": "주문/마법 효과"
  },
  {
    "group_id": "eg-call-of-the-green-man",
    "type": "grant_innate_spell",
    "target": "식물 형태",
    "tradition": "원시",
    "uses": "하루 1회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-cloak-of-poison",
    "type": "grant_action"
  },
  {
    "group_id": "eg-flourish-and-ruin",
    "type": "grant_innate_spell",
    "target": "생명의 장",
    "tradition": "원시",
    "uses": "하루 1회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-flourish-and-ruin",
    "type": "grant_innate_spell",
    "target": "덩굴 뒤엉킴",
    "tradition": "원시",
    "uses": "하루 1회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-regrowth",
    "type": "grant_innate_spell",
    "target": "재생",
    "tradition": "원시",
    "uses": "하루 1회",
    "spellType": "spell"
  },
  {
    "group_id": "eg-heritage-forge-dwarf",
    "type": "resistance",
    "target": "화염",
    "value": "half"
  },
  {
    "group_id": "eg-heritage-strong-blooded-dwarf",
    "type": "resistance",
    "target": "독",
    "value": "half"
  },
  {
    "group_id": "eg-heritage-arctic-elf",
    "type": "resistance",
    "target": "냉기",
    "value": "half"
  },
  {
    "group_id": "eg-heritage-cavern-elf",
    "type": "vision_upgrade",
    "target": "darkvision"
  },
  {
    "group_id": "eg-heritage-seer-elf",
    "type": "grant_innate_spell",
    "target": "마법 탐지",
    "tradition": "비전",
    "uses": "자유",
    "spellType": "cantrip"
  },
  {
    "group_id": "eg-heritage-fey-touched-gnome",
    "type": "grant_innate_spell",
    "target": "원시 캔트립 1개",
    "tradition": "원시",
    "uses": "자유",
    "spellType": "cantrip"
  },
  {
    "group_id": "eg-heritage-sensate-gnome",
    "type": "extra_sense",
    "sense": "부정확 후각 30피트"
  },
  {
    "group_id": "eg-heritage-umbral-gnome",
    "type": "vision_upgrade",
    "target": "darkvision"
  },
  {
    "group_id": "eg-heritage-wellspring-gnome",
    "type": "grant_innate_spell",
    "target": "선택한 전통 캔트립 1개",
    "tradition": "선택",
    "uses": "자유",
    "spellType": "cantrip"
  },
  {
    "group_id": "eg-heritage-charhide-goblin",
    "type": "resistance",
    "target": "화염",
    "value": "half"
  },
  {
    "group_id": "eg-heritage-razortooth-goblin",
    "type": "grant_weapon",
    "target": "턱",
    "damage": "1d6 P",
    "traits": "기교, 비무장",
    "weapon_category": "비무장 근접"
  },
  {
    "group_id": "eg-heritage-snow-goblin",
    "type": "resistance",
    "target": "냉기",
    "value": "half"
  },
  {
    "group_id": "eg-heritage-unbreakable-goblin",
    "type": "hp_bonus",
    "value": 4
  },
  {
    "group_id": "eg-heritage-hillock-halfling",
    "type": "rest_bonus_hp",
    "value": true
  },
  {
    "group_id": "eg-heritage-nomadic-halfling",
    "type": "extra_languages",
    "value": 2
  },
  {
    "group_id": "eg-heritage-twilight-halfling",
    "type": "vision_upgrade",
    "target": "low-light"
  },
  {
    "group_id": "eg-heritage-fungus-leshy",
    "type": "vision_upgrade",
    "target": "darkvision"
  },
  {
    "group_id": "eg-heritage-battle-ready-orc",
    "type": "skill_trained",
    "target": "intimidation"
  },
  {
    "group_id": "eg-heritage-battle-ready-orc",
    "type": "grant_feat",
    "target": "intimidating-glare"
  },
  {
    "group_id": "eg-heritage-deep-orc",
    "type": "grant_feat",
    "target": "terrain-expertise",
    "default_choice": "underground"
  },
  {
    "group_id": "eg-heritage-deep-orc",
    "type": "grant_feat",
    "target": "combat-climber"
  },
  {
    "group_id": "eg-heritage-hold-scarred-orc",
    "type": "hp_bonus",
    "value": 2
  },
  {
    "group_id": "eg-heritage-hold-scarred-orc",
    "type": "grant_feat",
    "target": "diehard"
  },
  {
    "group_id": "eg-heritage-changeling",
    "type": "vision_upgrade",
    "target": "upgrade"
  },
  {
    "group_id": "eg-heritage-changeling",
    "type": "versatile_ancestry",
    "value": true
  },
  {
    "group_id": "eg-heritage-changeling",
    "type": "extra_feat_category",
    "target": "체인질링"
  },
  {
    "group_id": "eg-heritage-nephilim",
    "type": "vision_upgrade",
    "target": "upgrade"
  },
  {
    "group_id": "eg-heritage-nephilim",
    "type": "versatile_ancestry",
    "value": true
  },
  {
    "group_id": "eg-heritage-nephilim",
    "type": "extra_feat_category",
    "target": "네피림"
  },
  {
    "group_id": "eg-heritage-aiuvarin",
    "type": "vision_upgrade",
    "target": "low-light"
  },
  {
    "group_id": "eg-heritage-aiuvarin",
    "type": "versatile_ancestry",
    "value": true
  },
  {
    "group_id": "eg-heritage-aiuvarin",
    "type": "extra_feat_category",
    "target": "아이우바린"
  },
  {
    "group_id": "eg-heritage-aiuvarin",
    "type": "extra_feat_category",
    "target": "엘프"
  },
  {
    "group_id": "eg-heritage-dromaar",
    "type": "vision_upgrade",
    "target": "low-light"
  },
  {
    "group_id": "eg-heritage-dromaar",
    "type": "versatile_ancestry",
    "value": true
  },
  {
    "group_id": "eg-heritage-dromaar",
    "type": "extra_feat_category",
    "target": "드로마르"
  },
  {
    "group_id": "eg-heritage-dromaar",
    "type": "extra_feat_category",
    "target": "오크"
  },
  {
    "group_id": "eg-bg-acolyte",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-acolyte",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-acolyte",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-acolyte",
    "type": "skill_trained",
    "target": "religion"
  },
  {
    "group_id": "eg-bg-acolyte",
    "type": "grant_lore",
    "target": "필사"
  },
  {
    "group_id": "eg-bg-acolyte",
    "type": "grant_feat",
    "target": "student-of-the-canon"
  },
  {
    "group_id": "eg-bg-acrobat",
    "type": "ability_boost_choice",
    "target": "str",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-acrobat",
    "type": "ability_boost_choice",
    "target": "dex",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-acrobat",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-acrobat",
    "type": "skill_trained",
    "target": "acrobatics"
  },
  {
    "group_id": "eg-bg-acrobat",
    "type": "grant_lore",
    "target": "서커스"
  },
  {
    "group_id": "eg-bg-acrobat",
    "type": "grant_feat",
    "target": "steady-balance"
  },
  {
    "group_id": "eg-bg-animal-whisperer",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-animal-whisperer",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-animal-whisperer",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-animal-whisperer",
    "type": "skill_trained",
    "target": "nature"
  },
  {
    "group_id": "eg-bg-animal-whisperer",
    "type": "grant_lore",
    "target": "지형"
  },
  {
    "group_id": "eg-bg-animal-whisperer",
    "type": "grant_feat",
    "target": "train-animal"
  },
  {
    "group_id": "eg-bg-artisan",
    "type": "ability_boost_choice",
    "target": "str",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-artisan",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-artisan",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-artisan",
    "type": "skill_trained",
    "target": "crafting"
  },
  {
    "group_id": "eg-bg-artisan",
    "type": "grant_lore",
    "target": "길드"
  },
  {
    "group_id": "eg-bg-artisan",
    "type": "grant_feat",
    "target": "specialty-crafting"
  },
  {
    "group_id": "eg-bg-artist",
    "type": "ability_boost_choice",
    "target": "dex",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-artist",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-artist",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-artist",
    "type": "skill_trained",
    "target": "crafting"
  },
  {
    "group_id": "eg-bg-artist",
    "type": "grant_lore",
    "target": "예술"
  },
  {
    "group_id": "eg-bg-artist",
    "type": "grant_feat",
    "target": "specialty-crafting"
  },
  {
    "group_id": "eg-bg-bandit",
    "type": "ability_boost_choice",
    "target": "dex",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-bandit",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-bandit",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-bandit",
    "type": "skill_trained",
    "target": "intimidation"
  },
  {
    "group_id": "eg-bg-bandit",
    "type": "grant_lore",
    "target": "지형"
  },
  {
    "group_id": "eg-bg-bandit",
    "type": "grant_feat",
    "target": "group-coercion"
  },
  {
    "group_id": "eg-bg-barkeep",
    "type": "ability_boost_choice",
    "target": "con",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-barkeep",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-barkeep",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-barkeep",
    "type": "skill_trained",
    "target": "diplomacy"
  },
  {
    "group_id": "eg-bg-barkeep",
    "type": "grant_lore",
    "target": "술"
  },
  {
    "group_id": "eg-bg-barkeep",
    "type": "grant_feat",
    "target": "hobnobber"
  },
  {
    "group_id": "eg-bg-barrister",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-barrister",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-barrister",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-barrister",
    "type": "skill_trained",
    "target": "diplomacy"
  },
  {
    "group_id": "eg-bg-barrister",
    "type": "grant_lore",
    "target": "법률"
  },
  {
    "group_id": "eg-bg-barrister",
    "type": "grant_feat",
    "target": "group-impression"
  },
  {
    "group_id": "eg-bg-bounty-hunter",
    "type": "ability_boost_choice",
    "target": "str",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-bounty-hunter",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-bounty-hunter",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-bounty-hunter",
    "type": "skill_trained",
    "target": "survival"
  },
  {
    "group_id": "eg-bg-bounty-hunter",
    "type": "grant_lore",
    "target": "법률"
  },
  {
    "group_id": "eg-bg-bounty-hunter",
    "type": "grant_feat",
    "target": "experienced-tracker"
  },
  {
    "group_id": "eg-bg-charlatan",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-charlatan",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-charlatan",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-charlatan",
    "type": "skill_trained",
    "target": "deception"
  },
  {
    "group_id": "eg-bg-charlatan",
    "type": "grant_lore",
    "target": "뒷세계"
  },
  {
    "group_id": "eg-bg-charlatan",
    "type": "grant_feat",
    "target": "charming-liar"
  },
  {
    "group_id": "eg-bg-cook",
    "type": "ability_boost_choice",
    "target": "con",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-cook",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-cook",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-cook",
    "type": "skill_trained",
    "target": "survival"
  },
  {
    "group_id": "eg-bg-cook",
    "type": "grant_lore",
    "target": "요리"
  },
  {
    "group_id": "eg-bg-cook",
    "type": "grant_feat",
    "target": "seasoned"
  },
  {
    "group_id": "eg-bg-criminal",
    "type": "ability_boost_choice",
    "target": "dex",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-criminal",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-criminal",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-criminal",
    "type": "skill_trained",
    "target": "stealth"
  },
  {
    "group_id": "eg-bg-criminal",
    "type": "grant_lore",
    "target": "뒷세계"
  },
  {
    "group_id": "eg-bg-criminal",
    "type": "grant_feat",
    "target": "experienced-smuggler"
  },
  {
    "group_id": "eg-bg-cultist",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-cultist",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-cultist",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-cultist",
    "type": "skill_trained",
    "target": "occultism"
  },
  {
    "group_id": "eg-bg-cultist",
    "type": "grant_lore",
    "target": "신격/교단"
  },
  {
    "group_id": "eg-bg-cultist",
    "type": "grant_feat",
    "target": "schooled-in-secrets"
  },
  {
    "group_id": "eg-bg-detective",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-detective",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-detective",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-detective",
    "type": "skill_trained",
    "target": "society"
  },
  {
    "group_id": "eg-bg-detective",
    "type": "grant_lore",
    "target": "뒷세계"
  },
  {
    "group_id": "eg-bg-detective",
    "type": "grant_feat",
    "target": "streetwise"
  },
  {
    "group_id": "eg-bg-emissary",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-emissary",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-emissary",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-emissary",
    "type": "skill_trained",
    "target": "society"
  },
  {
    "group_id": "eg-bg-emissary",
    "type": "grant_lore",
    "target": "도시"
  },
  {
    "group_id": "eg-bg-emissary",
    "type": "grant_feat",
    "target": "multilingual"
  },
  {
    "group_id": "eg-bg-entertainer",
    "type": "ability_boost_choice",
    "target": "dex",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-entertainer",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-entertainer",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-entertainer",
    "type": "skill_trained",
    "target": "performance"
  },
  {
    "group_id": "eg-bg-entertainer",
    "type": "grant_lore",
    "target": "극장"
  },
  {
    "group_id": "eg-bg-entertainer",
    "type": "grant_feat",
    "target": "fascinating-performance"
  },
  {
    "group_id": "eg-bg-farmhand",
    "type": "ability_boost_choice",
    "target": "con",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-farmhand",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-farmhand",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-farmhand",
    "type": "skill_trained",
    "target": "athletics"
  },
  {
    "group_id": "eg-bg-farmhand",
    "type": "grant_lore",
    "target": "농업"
  },
  {
    "group_id": "eg-bg-farmhand",
    "type": "grant_feat",
    "target": "assurance"
  },
  {
    "group_id": "eg-bg-field-medic",
    "type": "ability_boost_choice",
    "target": "con",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-field-medic",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-field-medic",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-field-medic",
    "type": "skill_trained",
    "target": "medicine"
  },
  {
    "group_id": "eg-bg-field-medic",
    "type": "grant_lore",
    "target": "전쟁"
  },
  {
    "group_id": "eg-bg-field-medic",
    "type": "grant_feat",
    "target": "battle-medicine"
  },
  {
    "group_id": "eg-bg-fortune-teller",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-fortune-teller",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-fortune-teller",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-fortune-teller",
    "type": "skill_trained",
    "target": "occultism"
  },
  {
    "group_id": "eg-bg-fortune-teller",
    "type": "grant_lore",
    "target": "점술"
  },
  {
    "group_id": "eg-bg-fortune-teller",
    "type": "grant_feat",
    "target": "oddity-identification"
  },
  {
    "group_id": "eg-bg-gambler",
    "type": "ability_boost_choice",
    "target": "dex",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-gambler",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-gambler",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-gambler",
    "type": "skill_trained",
    "target": "deception"
  },
  {
    "group_id": "eg-bg-gambler",
    "type": "grant_lore",
    "target": "게임"
  },
  {
    "group_id": "eg-bg-gambler",
    "type": "grant_feat",
    "target": "lie-to-me"
  },
  {
    "group_id": "eg-bg-gladiator",
    "type": "ability_boost_choice",
    "target": "str",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-gladiator",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-gladiator",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-gladiator",
    "type": "skill_trained",
    "target": "performance"
  },
  {
    "group_id": "eg-bg-gladiator",
    "type": "grant_lore",
    "target": "검투"
  },
  {
    "group_id": "eg-bg-gladiator",
    "type": "grant_feat",
    "target": "impressive-performance"
  },
  {
    "group_id": "eg-bg-guard",
    "type": "ability_boost_choice",
    "target": "str",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-guard",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-guard",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-guard",
    "type": "skill_trained",
    "target": "intimidation"
  },
  {
    "group_id": "eg-bg-guard",
    "type": "grant_lore",
    "target": "법률"
  },
  {
    "group_id": "eg-bg-guard",
    "type": "grant_feat",
    "target": "quick-coercion"
  },
  {
    "group_id": "eg-bg-herbalist",
    "type": "ability_boost_choice",
    "target": "con",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-herbalist",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-herbalist",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-herbalist",
    "type": "skill_trained",
    "target": "nature"
  },
  {
    "group_id": "eg-bg-herbalist",
    "type": "grant_lore",
    "target": "약초학"
  },
  {
    "group_id": "eg-bg-herbalist",
    "type": "grant_feat",
    "target": "natural-medicine"
  },
  {
    "group_id": "eg-bg-hermit",
    "type": "ability_boost_choice",
    "target": "con",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-hermit",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-hermit",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-hermit",
    "type": "skill_choice",
    "target": "nature",
    "group_no": 1
  },
  {
    "group_id": "eg-bg-hermit",
    "type": "skill_choice",
    "target": "occultism",
    "group_no": 1
  },
  {
    "group_id": "eg-bg-hermit",
    "type": "grant_lore",
    "target": "지형"
  },
  {
    "group_id": "eg-bg-hermit",
    "type": "grant_feat",
    "target": "dubious-knowledge"
  },
  {
    "group_id": "eg-bg-hunter",
    "type": "ability_boost_choice",
    "target": "dex",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-hunter",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-hunter",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-hunter",
    "type": "skill_trained",
    "target": "survival"
  },
  {
    "group_id": "eg-bg-hunter",
    "type": "grant_lore",
    "target": "무두질"
  },
  {
    "group_id": "eg-bg-hunter",
    "type": "grant_feat",
    "target": "survey-wildlife"
  },
  {
    "group_id": "eg-bg-laborer",
    "type": "ability_boost_choice",
    "target": "str",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-laborer",
    "type": "ability_boost_choice",
    "target": "con",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-laborer",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-laborer",
    "type": "skill_trained",
    "target": "athletics"
  },
  {
    "group_id": "eg-bg-laborer",
    "type": "grant_lore",
    "target": "노동"
  },
  {
    "group_id": "eg-bg-laborer",
    "type": "grant_feat",
    "target": "hefty-hauler"
  },
  {
    "group_id": "eg-bg-martial-disciple",
    "type": "ability_boost_choice",
    "target": "str",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-martial-disciple",
    "type": "ability_boost_choice",
    "target": "dex",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-martial-disciple",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-martial-disciple",
    "type": "skill_choice",
    "target": "acrobatics",
    "group_no": 1
  },
  {
    "group_id": "eg-bg-martial-disciple",
    "type": "skill_choice",
    "target": "athletics",
    "group_no": 1
  },
  {
    "group_id": "eg-bg-martial-disciple",
    "type": "grant_lore",
    "target": "전쟁"
  },
  {
    "group_id": "eg-bg-martial-disciple",
    "type": "grant_feat",
    "target": "cat-fall"
  },
  {
    "group_id": "eg-bg-merchant",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-merchant",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-merchant",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-merchant",
    "type": "skill_trained",
    "target": "diplomacy"
  },
  {
    "group_id": "eg-bg-merchant",
    "type": "grant_lore",
    "target": "상업"
  },
  {
    "group_id": "eg-bg-merchant",
    "type": "grant_feat",
    "target": "bargain-hunter"
  },
  {
    "group_id": "eg-bg-miner",
    "type": "ability_boost_choice",
    "target": "str",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-miner",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-miner",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-miner",
    "type": "skill_trained",
    "target": "survival"
  },
  {
    "group_id": "eg-bg-miner",
    "type": "grant_lore",
    "target": "광업"
  },
  {
    "group_id": "eg-bg-miner",
    "type": "grant_feat",
    "target": "terrain-expertise"
  },
  {
    "group_id": "eg-bg-noble",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-noble",
    "type": "ability_boost_choice",
    "target": "cha",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-noble",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-noble",
    "type": "skill_trained",
    "target": "society"
  },
  {
    "group_id": "eg-bg-noble",
    "type": "grant_lore",
    "target": "족보"
  },
  {
    "group_id": "eg-bg-noble",
    "type": "grant_feat",
    "target": "courtly-graces"
  },
  {
    "group_id": "eg-bg-nomad",
    "type": "ability_boost_choice",
    "target": "con",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-nomad",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-nomad",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-nomad",
    "type": "skill_trained",
    "target": "survival"
  },
  {
    "group_id": "eg-bg-nomad",
    "type": "grant_lore",
    "target": "지형"
  },
  {
    "group_id": "eg-bg-nomad",
    "type": "grant_feat",
    "target": "assurance"
  },
  {
    "group_id": "eg-bg-prisoner",
    "type": "ability_boost_choice",
    "target": "str",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-prisoner",
    "type": "ability_boost_choice",
    "target": "con",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-prisoner",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-prisoner",
    "type": "skill_trained",
    "target": "stealth"
  },
  {
    "group_id": "eg-bg-prisoner",
    "type": "grant_lore",
    "target": "뒷세계"
  },
  {
    "group_id": "eg-bg-prisoner",
    "type": "grant_feat",
    "target": "experienced-smuggler"
  },
  {
    "group_id": "eg-bg-raised-by-belief",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-raised-by-belief",
    "type": "grant_feat",
    "target": "assurance"
  },
  {
    "group_id": "eg-bg-raised-by-belief",
    "type": "deity_skill"
  },
  {
    "group_id": "eg-bg-raised-by-belief",
    "type": "deity_lore"
  },
  {
    "group_id": "eg-bg-sailor",
    "type": "ability_boost_choice",
    "target": "str",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-sailor",
    "type": "ability_boost_choice",
    "target": "dex",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-sailor",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-sailor",
    "type": "skill_trained",
    "target": "athletics"
  },
  {
    "group_id": "eg-bg-sailor",
    "type": "grant_lore",
    "target": "항해"
  },
  {
    "group_id": "eg-bg-sailor",
    "type": "grant_feat",
    "target": "underwater-marauder"
  },
  {
    "group_id": "eg-bg-scholar",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-scholar",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-scholar",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-scholar",
    "type": "skill_choice",
    "target": "arcana",
    "group_no": 1
  },
  {
    "group_id": "eg-bg-scholar",
    "type": "skill_choice",
    "target": "nature",
    "group_no": 1
  },
  {
    "group_id": "eg-bg-scholar",
    "type": "skill_choice",
    "target": "occultism",
    "group_no": 1
  },
  {
    "group_id": "eg-bg-scholar",
    "type": "skill_choice",
    "target": "religion",
    "group_no": 1
  },
  {
    "group_id": "eg-bg-scholar",
    "type": "grant_lore",
    "target": "학술원"
  },
  {
    "group_id": "eg-bg-scholar",
    "type": "grant_feat",
    "target": "assurance"
  },
  {
    "group_id": "eg-bg-scout",
    "type": "ability_boost_choice",
    "target": "dex",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-scout",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-scout",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-scout",
    "type": "skill_trained",
    "target": "survival"
  },
  {
    "group_id": "eg-bg-scout",
    "type": "grant_lore",
    "target": "지형"
  },
  {
    "group_id": "eg-bg-scout",
    "type": "grant_feat",
    "target": "forager"
  },
  {
    "group_id": "eg-bg-street-urchin",
    "type": "ability_boost_choice",
    "target": "dex",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-street-urchin",
    "type": "ability_boost_choice",
    "target": "con",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-street-urchin",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-street-urchin",
    "type": "skill_trained",
    "target": "thievery"
  },
  {
    "group_id": "eg-bg-street-urchin",
    "type": "grant_lore",
    "target": "도시"
  },
  {
    "group_id": "eg-bg-street-urchin",
    "type": "grant_feat",
    "target": "pickpocket"
  },
  {
    "group_id": "eg-bg-teacher",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-teacher",
    "type": "ability_boost_choice",
    "target": "wis",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-teacher",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-teacher",
    "type": "skill_choice",
    "target": "performance",
    "group_no": 1
  },
  {
    "group_id": "eg-bg-teacher",
    "type": "skill_choice",
    "target": "society",
    "group_no": 1
  },
  {
    "group_id": "eg-bg-teacher",
    "type": "grant_lore",
    "target": "학술원"
  },
  {
    "group_id": "eg-bg-teacher",
    "type": "grant_feat",
    "target": "experienced-professional"
  },
  {
    "group_id": "eg-bg-tinker",
    "type": "ability_boost_choice",
    "target": "dex",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-tinker",
    "type": "ability_boost_choice",
    "target": "int",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-tinker",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-tinker",
    "type": "skill_trained",
    "target": "crafting"
  },
  {
    "group_id": "eg-bg-tinker",
    "type": "grant_lore",
    "target": "공학"
  },
  {
    "group_id": "eg-bg-tinker",
    "type": "grant_feat",
    "target": "specialty-crafting"
  },
  {
    "group_id": "eg-bg-warrior",
    "type": "ability_boost_choice",
    "target": "str",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-warrior",
    "type": "ability_boost_choice",
    "target": "con",
    "value": 1,
    "group_no": 1
  },
  {
    "group_id": "eg-bg-warrior",
    "type": "free_boost_slots",
    "value": 1
  },
  {
    "group_id": "eg-bg-warrior",
    "type": "skill_trained",
    "target": "intimidation"
  },
  {
    "group_id": "eg-bg-warrior",
    "type": "grant_lore",
    "target": "전쟁"
  },
  {
    "group_id": "eg-bg-warrior",
    "type": "grant_feat",
    "target": "intimidating-glare"
  }
];

// ═══════════════════════════════════════════════
//  CHOICE_OPTIONS — FEAT_DB.choice_id 1:N 정규화 (v532~ Phase 3a)
//  옵션 행: choice_id, option_id, option_name, effect_group_id, is_default
//  custom + skill_defaults type만 옵션 행 보유.
//  나머지 type (skill/lore/spell_cantrip/spell_rank/feat_pick/weapon_pick/ancestry_pick/muse_pick/skill_fixed/skill_multi)은
//  런타임 쿼리(filter 메타 활용) — 옵션 행 없음.
// ═══════════════════════════════════════════════
const CHOICE_OPTIONS = [
  {
    "choice_id": "cho-bard-dedication",
    "option_id": "muse-enigma",
    "option_name": "수수께끼",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-bard-dedication",
    "option_id": "muse-maestro",
    "option_name": "마에스트로",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-bard-dedication",
    "option_id": "muse-warrior",
    "option_name": "전사",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-bard-dedication",
    "option_id": "muse-lore",
    "option_name": "지식",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-dwarven-lore",
    "option_id": "crafting",
    "option_name": "crafting",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-dwarven-lore",
    "option_id": "religion",
    "option_name": "religion",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-elven-lore",
    "option_id": "arcana",
    "option_name": "arcana",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-elven-lore",
    "option_id": "nature",
    "option_name": "nature",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-goblin-lore",
    "option_id": "nature",
    "option_name": "nature",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-goblin-lore",
    "option_id": "stealth",
    "option_name": "stealth",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-halfling-lore",
    "option_id": "acrobatics",
    "option_name": "acrobatics",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-halfling-lore",
    "option_id": "stealth",
    "option_name": "stealth",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-beast-trainer",
    "option_id": "pet",
    "option_name": "반려동물 (Pet)",
    "effect_group_id": "eg-beast-trainer-pet",
    "is_default": false
  },
  {
    "choice_id": "cho-beast-trainer",
    "option_id": "train",
    "option_name": "동물 훈련 (Train Animal)",
    "effect_group_id": "eg-beast-trainer-train",
    "is_default": false
  },
  {
    "choice_id": "cho-orc-lore",
    "option_id": "athletics",
    "option_name": "athletics",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-orc-lore",
    "option_id": "survival",
    "option_name": "survival",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-hold-mark",
    "option_id": "sun",
    "option_name": "타오르는 태양 (외교, 비전)",
    "effect_group_id": "eg-hold-mark-sun",
    "is_default": false
  },
  {
    "choice_id": "cho-hold-mark",
    "option_id": "skull",
    "option_name": "죽음의 머리 (생존, 원시)",
    "effect_group_id": "eg-hold-mark-skull",
    "is_default": false
  },
  {
    "choice_id": "cho-hold-mark",
    "option_id": "corpse",
    "option_name": "더럽혀진 시체 (종교학, 신성)",
    "effect_group_id": "eg-hold-mark-corpse",
    "is_default": false
  },
  {
    "choice_id": "cho-hold-mark",
    "option_id": "hand",
    "option_name": "빈 손 (위협, 오컬트)",
    "effect_group_id": "eg-hold-mark-hand",
    "is_default": false
  },
  {
    "choice_id": "cho-changeling-lore",
    "option_id": "deception",
    "option_name": "deception",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-changeling-lore",
    "option_id": "occultism",
    "option_name": "occultism",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-nephilim-lore",
    "option_id": "religion",
    "option_name": "religion",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-nephilim-lore",
    "option_id": "diplomacy",
    "option_name": "diplomacy",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-canny-acumen",
    "option_id": "fort",
    "option_name": "인내 (Fortitude)",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-canny-acumen",
    "option_id": "ref",
    "option_name": "반사 (Reflex)",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-canny-acumen",
    "option_id": "will",
    "option_name": "의지 (Will)",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-canny-acumen",
    "option_id": "perc",
    "option_name": "지각 (Perception)",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-weapon-proficiency",
    "option_id": "weapon-martial",
    "option_name": "군용 무기 1그룹 숙련",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-weapon-proficiency",
    "option_id": "weapon-simple",
    "option_name": "단순 무기 숙련 (미숙련→숙련)",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-specialty-crafting",
    "option_id": "alchemy",
    "option_name": "연금술",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-specialty-crafting",
    "option_id": "armor",
    "option_name": "갑옷",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-specialty-crafting",
    "option_id": "weapon",
    "option_name": "무기",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-specialty-crafting",
    "option_id": "jewelry",
    "option_name": "보석",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-specialty-crafting",
    "option_id": "clothing",
    "option_name": "의복",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-specialty-crafting",
    "option_id": "woodwork",
    "option_name": "목공",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-specialty-crafting",
    "option_id": "stonemasonry",
    "option_name": "석공",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-specialty-crafting",
    "option_id": "tailoring",
    "option_name": "재단",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-virtuosic-performer",
    "option_id": "singing",
    "option_name": "노래",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-virtuosic-performer",
    "option_id": "instruments",
    "option_name": "악기",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-virtuosic-performer",
    "option_id": "dancing",
    "option_name": "춤",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-virtuosic-performer",
    "option_id": "acting",
    "option_name": "연기",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-virtuosic-performer",
    "option_id": "comedy",
    "option_name": "코미디",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-virtuosic-performer",
    "option_id": "oratory",
    "option_name": "연설",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-terrain-stalker",
    "option_id": "rubble",
    "option_name": "잔해",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-terrain-stalker",
    "option_id": "snow",
    "option_name": "눈",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-terrain-stalker",
    "option_id": "underbrush",
    "option_name": "덤불",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-terrain-expertise",
    "option_id": "aquatic",
    "option_name": "수중",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-terrain-expertise",
    "option_id": "arctic",
    "option_name": "극지",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-terrain-expertise",
    "option_id": "desert",
    "option_name": "사막",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-terrain-expertise",
    "option_id": "forest",
    "option_name": "숲",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-terrain-expertise",
    "option_id": "mountain",
    "option_name": "산",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-terrain-expertise",
    "option_id": "plains",
    "option_name": "평원",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-terrain-expertise",
    "option_id": "sky",
    "option_name": "하늘",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-terrain-expertise",
    "option_id": "swamp",
    "option_name": "늪",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-terrain-expertise",
    "option_id": "underground",
    "option_name": "지하",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "air",
    "option_name": "공기",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "ambition",
    "option_name": "야망",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "change",
    "option_name": "변화",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "cities",
    "option_name": "도시",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "cold",
    "option_name": "냉기",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "confidence",
    "option_name": "자신감",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "creation",
    "option_name": "창조",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "darkness",
    "option_name": "어둠",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "death",
    "option_name": "죽음",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "decay",
    "option_name": "부패",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "delirium",
    "option_name": "망상",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "destruction",
    "option_name": "파괴",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "dreams",
    "option_name": "꿈",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "dust",
    "option_name": "먼지",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "duty",
    "option_name": "의무",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "earth",
    "option_name": "대지",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "family",
    "option_name": "가족",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "fate",
    "option_name": "운명",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "fire",
    "option_name": "화염",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "freedom",
    "option_name": "자유",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "glyph",
    "option_name": "문양",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "healing",
    "option_name": "치유",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "indulgence",
    "option_name": "탐닉",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "knowledge",
    "option_name": "지식",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "lightning",
    "option_name": "번개",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "luck",
    "option_name": "행운",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "magic",
    "option_name": "마법",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "might",
    "option_name": "힘",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "moon",
    "option_name": "달",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "nature",
    "option_name": "자연",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "nightmares",
    "option_name": "악몽",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "pain",
    "option_name": "고통",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "passion",
    "option_name": "열정",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "perfection",
    "option_name": "완벽",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "plague",
    "option_name": "역병",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "protection",
    "option_name": "보호",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "repose",
    "option_name": "안식",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "secrecy",
    "option_name": "비밀",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "sorrow",
    "option_name": "슬픔",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "soul",
    "option_name": "영혼",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "star",
    "option_name": "별",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "sun",
    "option_name": "태양",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "swarm",
    "option_name": "떼",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "time",
    "option_name": "시간",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "travel",
    "option_name": "여행",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "trickery",
    "option_name": "속임수",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "truth",
    "option_name": "진실",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "tyranny",
    "option_name": "폭정",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "undeath",
    "option_name": "언데스",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "vigil",
    "option_name": "경계",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "void",
    "option_name": "공허",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "war",
    "option_name": "전쟁",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "water",
    "option_name": "물",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "wealth",
    "option_name": "부",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "wyrmkin",
    "option_name": "용족",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-domain-initiate",
    "option_id": "zeal",
    "option_name": "열의",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "air",
    "option_name": "공기",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "ambition",
    "option_name": "야망",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "change",
    "option_name": "변화",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "cities",
    "option_name": "도시",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "cold",
    "option_name": "냉기",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "confidence",
    "option_name": "자신감",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "creation",
    "option_name": "창조",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "darkness",
    "option_name": "어둠",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "death",
    "option_name": "죽음",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "decay",
    "option_name": "부패",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "delirium",
    "option_name": "망상",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "destruction",
    "option_name": "파괴",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "dreams",
    "option_name": "꿈",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "dust",
    "option_name": "먼지",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "duty",
    "option_name": "의무",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "earth",
    "option_name": "대지",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "family",
    "option_name": "가족",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "fate",
    "option_name": "운명",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "fire",
    "option_name": "화염",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "freedom",
    "option_name": "자유",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "glyph",
    "option_name": "문양",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "healing",
    "option_name": "치유",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "indulgence",
    "option_name": "탐닉",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "knowledge",
    "option_name": "지식",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "lightning",
    "option_name": "번개",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "luck",
    "option_name": "행운",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "magic",
    "option_name": "마법",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "might",
    "option_name": "힘",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "moon",
    "option_name": "달",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "nature",
    "option_name": "자연",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "nightmares",
    "option_name": "악몽",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "pain",
    "option_name": "고통",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "passion",
    "option_name": "열정",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "perfection",
    "option_name": "완벽",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "plague",
    "option_name": "역병",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "protection",
    "option_name": "보호",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "repose",
    "option_name": "안식",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "secrecy",
    "option_name": "비밀",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "sorrow",
    "option_name": "슬픔",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "soul",
    "option_name": "영혼",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "star",
    "option_name": "별",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "sun",
    "option_name": "태양",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "swarm",
    "option_name": "떼",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "time",
    "option_name": "시간",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "travel",
    "option_name": "여행",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "trickery",
    "option_name": "속임수",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "truth",
    "option_name": "진실",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "tyranny",
    "option_name": "폭정",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "undeath",
    "option_name": "언데스",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "vigil",
    "option_name": "경계",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "void",
    "option_name": "공허",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "war",
    "option_name": "전쟁",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "water",
    "option_name": "물",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "wealth",
    "option_name": "부",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "wyrmkin",
    "option_name": "용족",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-advanced-domain",
    "option_id": "zeal",
    "option_name": "열의",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-emblazon-energy",
    "option_id": "acid",
    "option_name": "산성",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-emblazon-energy",
    "option_id": "cold",
    "option_name": "냉기",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-emblazon-energy",
    "option_id": "electricity",
    "option_name": "전기",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-emblazon-energy",
    "option_id": "fire",
    "option_name": "화염",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-emblazon-energy",
    "option_id": "sonic",
    "option_name": "음파",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-terrain",
    "option_id": "aquatic",
    "option_name": "수중",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-terrain",
    "option_id": "arctic",
    "option_name": "극지",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-terrain",
    "option_id": "desert",
    "option_name": "사막",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-terrain",
    "option_id": "forest",
    "option_name": "숲",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-terrain",
    "option_id": "mountain",
    "option_name": "산",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-terrain",
    "option_id": "plains",
    "option_name": "평원",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-terrain",
    "option_id": "sky",
    "option_name": "하늘",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-terrain",
    "option_id": "swamp",
    "option_name": "늪",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-terrain",
    "option_id": "underground",
    "option_name": "지하",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-prey",
    "option_id": "animal",
    "option_name": "동물",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-prey",
    "option_id": "beast",
    "option_name": "야수",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-prey",
    "option_id": "dragon",
    "option_name": "용",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-favored-prey",
    "option_id": "plant-fungus",
    "option_name": "균류 + 식물",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-vengeful-hatred",
    "option_id": "giant",
    "option_name": "거인",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-vengeful-hatred",
    "option_id": "orc",
    "option_name": "오크",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-vengeful-hatred",
    "option_id": "undead",
    "option_name": "언데드",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-vengeful-hatred",
    "option_id": "aberration",
    "option_name": "기형체",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-vengeful-hatred",
    "option_id": "fiend",
    "option_name": "악마",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-vengeful-hatred",
    "option_id": "dragon",
    "option_name": "드래곤",
    "effect_group_id": "",
    "is_default": false
  },
  {
    "choice_id": "cho-leshy-lore",
    "option_id": "nature",
    "option_name": "nature",
    "effect_group_id": "",
    "is_default": true
  },
  {
    "choice_id": "cho-leshy-lore",
    "option_id": "stealth",
    "option_name": "stealth",
    "effect_group_id": "",
    "is_default": true
  }
];




const CONDITIONS_DATA = [
  {
    "id": "blinded",
    "name": "실명",
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
    "name": "서투름",
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
    "name": "현혹됨",
    "en": "Dazzled",
    "valued": false,
    "desc": "시각 기반 대상이 은폐 취급."
  },
  {
    "id": "deafened",
    "name": "귀머거리",
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
    "name": "탈진",
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
    "name": "약화",
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
    "name": "도주중",
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
    "name": "협력적",
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
    "name": "고정",
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
    "name": "속행",
    "en": "Quickened",
    "valued": false,
    "desc": "매 턴 행동이 1개 추가됨. 추가 행동은 특정 행동에만 사용 가능."
  },
  {
    "id": "restrained",
    "name": "구속",
    "en": "Restrained",
    "valued": false,
    "desc": "붙잡힘 + 고정 상태. 이동 속도 0."
  },
  {
    "id": "sickened",
    "name": "메스꺼움",
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
    "name": "현기증",
    "en": "Stupefied",
    "valued": true,
    "desc": "지능/지혜/매력 기반 판정과 주문 DC에 상태 페널티 = 현기증 수치.",
    "max": 4
  },
  {
    "id": "unconscious",
    "name": "의식불명",
    "en": "Unconscious",
    "valued": false,
    "desc": "행동/반응 불가. AC -4, 지각 -4, 실명+귀머거리. 피해 받으면 깨날 수 있음."
  },
  {
    "id": "undetected",
    "name": "미감지",
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
    "name": "존재미인지",
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

const ACTION_DB = [
  {
    "id": "strike",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "스트라이크",
    "name_en": "Strike",
    "cost": "1",
    "traits": [
      "공격"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "근접 또는 원거리 무기로 공격 1회를 가합니다. 다중 공격 페널티가 적용됩니다."
  },
  {
    "id": "stride",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "이동",
    "name_en": "Stride",
    "cost": "1",
    "traits": [
      "이동"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "이동 속도만큼 이동합니다."
  },
  {
    "id": "step",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "비틀거림",
    "name_en": "Step",
    "cost": "1",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "반응 행동을 유발하지 않고 5피트 이동합니다."
  },
  {
    "id": "interact",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "상호작용",
    "name_en": "Interact",
    "cost": "1",
    "traits": [
      "조작"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "물건을 집거나, 장비를 꺼내거나, 문을 열거나, 간단한 조작을 합니다."
  },
  {
    "id": "escape",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "탈출",
    "name_en": "Escape",
    "cost": "1",
    "traits": [
      "공격"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "붙잡히거나 속박된 상태에서 벗어납니다. 운동 또는 곡예 또는 명중 굴림."
  },
  {
    "id": "seek",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "탐색",
    "name_en": "Seek",
    "cost": "1",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "주변 30피트(원뿔 15피트) 내의 숨겨진 존재나 물체를 탐지합니다. 지각 판정."
  },
  {
    "id": "stand",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "서기",
    "name_en": "Stand",
    "cost": "1",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "넘어짐 상태를 해제하고 일어납니다."
  },
  {
    "id": "drop-prone",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "엎드리기",
    "name_en": "Drop Prone",
    "cost": "1",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "자발적으로 넘어짐 상태가 됩니다. 원거리 공격에 대한 은폐를 얻습니다."
  },
  {
    "id": "take-cover",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "엄폐",
    "name_en": "Take Cover",
    "cost": "1",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "장애물 뒤에 몸을 숨겨 은폐(+2 AC, Reflex, Stealth)를 얻습니다."
  },
  {
    "id": "raise-shield",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "방패 올리기",
    "name_en": "Raise a Shield",
    "cost": "1",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "방패를 들어 AC에 방패 보너스를 적용합니다."
  },
  {
    "id": "sustain",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "주문 지속",
    "name_en": "Sustain",
    "cost": "1",
    "traits": [
      "주문"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "유지 가능한 주문의 효과를 한 라운드 더 지속합니다."
  },
  {
    "id": "delay",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "지연",
    "name_en": "Delay",
    "cost": "free",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "자신의 턴을 나중으로 미룹니다. 그 전까지 아무 행동도 하지 않습니다."
  },
  {
    "id": "ready",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "준비",
    "name_en": "Ready",
    "cost": "2",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "특정 조건이 발생했을 때 반응으로 1행동 또는 자유 행동을 취합니다."
  },
  {
    "id": "aid",
    "cat": "basic",
    "cat_label": "기본 행동",
    "name_ko": "도움",
    "name_en": "Aid",
    "cost": "reaction",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "동료의 판정이나 AC에 +1~+3 보너스를 줍니다. 전 라운드에 준비해야 합니다."
  },
  {
    "id": "climb",
    "cat": "skill",
    "cat_label": "운동 행동",
    "name_ko": "등반",
    "name_en": "Climb",
    "cost": "1",
    "traits": [
      "이동"
    ],
    "req_skill": "athletics",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 이동<br><br>수직 표면을 오릅니다. 등반 성공 시 5피트 위로 이동(대성공 시 10피트, 실패 시 이동 안 됨, 대실패 시 추락). 등반 중에는 <strong>무방비</strong>입니다. DC는 표면에 따라 다릅니다."
  },
  {
    "id": "swim",
    "cat": "skill",
    "cat_label": "운동 행동",
    "name_ko": "수영",
    "name_en": "Swim",
    "cost": "1",
    "traits": [
      "이동"
    ],
    "req_skill": "athletics",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 이동<br>물속에서 이동합니다. 대부분의 잔잔한 물은 DC 10, 거친 물은 DC 15 이상입니다. 성공 시 10피트 이동, 대성공 시 15피트, 실패 시 이동 안 됨, 대실패 시 물속에 가라앉음. 수면 아래에서 턴을 끝내면 질식 위험이 있습니다."
  },
  {
    "id": "high-jump",
    "cat": "skill",
    "cat_label": "운동 행동",
    "name_ko": "높이뛰기",
    "name_en": "High Jump",
    "cost": "2",
    "traits": [],
    "req_skill": "athletics",
    "req_rank": 0,
    "req_feat": null,
    "summary": "보폭한 후 수직으로 도약합니다. 운동 DC는 30입니다. 대성공: 8피트, 성공: 5피트, 실패: 보폭만, 대실패: 보폭 후 엎드림. 도달 높이에 자신의 키를 더합니다."
  },
  {
    "id": "long-jump",
    "cat": "skill",
    "cat_label": "운동 행동",
    "name_ko": "넓이뛰기",
    "name_en": "Long Jump",
    "cost": "2",
    "traits": [],
    "req_skill": "athletics",
    "req_rank": 0,
    "req_feat": null,
    "summary": "보폭한 후 수평으로 도약합니다. 운동 판정의 결과가 이동 거리(피트 단위)를 결정합니다. 결과가 이동 속도 이하이면 도약 성공, 아니면 실패합니다."
  },
  {
    "id": "shove",
    "cat": "skill",
    "cat_label": "운동 행동",
    "name_ko": "밀기",
    "name_en": "Shove",
    "cost": "1",
    "traits": [
      "공격"
    ],
    "req_skill": "athletics",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 공격<br>적을 뒤로 밉니다. 운동 판정을 적의 인내 DC에 대해 시도합니다. 대성공: 5피트 밀고 따라감 가능, 성공: 5피트 밀기, 실패: 효과 없음, 대실패: 무방비."
  },
  {
    "id": "trip",
    "cat": "skill",
    "cat_label": "운동 행동",
    "name_ko": "넘어뜨리기",
    "name_en": "Trip",
    "cost": "1",
    "traits": [
      "공격"
    ],
    "req_skill": "athletics",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 공격<br>적을 엎드리게 합니다. 운동 판정을 적의 반사 DC에 대해 시도합니다. 대성공: 대상이 엎드리고 1d6 둔기 피해, 성공: 엎드림, 실패: 효과 없음, 대실패: 당신이 무방비."
  },
  {
    "id": "grapple",
    "cat": "skill",
    "cat_label": "운동 행동",
    "name_ko": "붙잡기",
    "name_en": "Grapple",
    "cost": "1",
    "traits": [
      "공격"
    ],
    "req_skill": "athletics",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 공격<br>빈 손으로 적을 붙잡으려 합니다. 운동 판정을 적의 인내 DC에 대해 시도합니다. 대성공: 속박(restrained), 성공: 붙잡힘(grabbed), 실패: 효과 없음, 대실패: 적이 당신을 붙잡거나 당신이 무방비."
  },
  {
    "id": "disarm",
    "cat": "skill",
    "cat_label": "운동 행동",
    "name_ko": "무장해제",
    "name_en": "Disarm",
    "cost": "1",
    "traits": [
      "공격",
      "교묘"
    ],
    "req_skill": "athletics",
    "req_rank": 2,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 공격<br>적의 무기나 물건을 빼앗으려 합니다. 운동 판정을 적의 반사 DC에 대해 시도합니다. 대성공: 물건이 땅에 떨어짐, 성공: 대상이 -2 상황 페널티(공격과 조작), 실패: 효과 없음, 대실패: 무방비."
  },
  {
    "id": "force-open",
    "cat": "skill",
    "cat_label": "운동 행동",
    "name_ko": "강제 개방",
    "name_en": "Force Open",
    "cost": "1",
    "traits": [
      "공격"
    ],
    "req_skill": "athletics",
    "req_rank": 0,
    "req_feat": null,
    "summary": "자물쇠나 막힌 문, 상자, 족쇄 등을 힘으로 열거나 부숩니다."
  },
  {
    "id": "reposition",
    "cat": "skill",
    "cat_label": "운동 행동",
    "name_ko": "위치 변경",
    "name_en": "Reposition",
    "cost": "1",
    "traits": [
      "공격"
    ],
    "req_skill": "athletics",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 공격<br>적을 원하는 위치로 강제 이동시킵니다. 운동 판정을 적의 인내 DC에 대해 시도합니다. 대성공: 5피트 이동시키고 당신도 따라감, 성공: 5피트 이동, 실패: 효과 없음, 대실패: 무방비."
  },
  {
    "id": "balance",
    "cat": "skill",
    "cat_label": "곡예 행동",
    "name_ko": "균형 잡기",
    "name_en": "Balance",
    "cost": "1",
    "traits": [
      "이동"
    ],
    "req_skill": "acrobatics",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 이동<br><br>좁거나 불안정한 표면 위를 이동합니다. 곡예 판정을 시도합니다. DC는 표면에 따라 달라집니다. 균형 잡기를 시도하는 동안 당신은 <strong>무방비(off-guard)</strong>입니다.<br><strong>대성공:</strong> 이동 속도까지 이동하며 지형을 험지로 취급합니다(일반적으로 절반 속도).<br>"
  },
  {
    "id": "tumble-through",
    "cat": "skill",
    "cat_label": "곡예 행동",
    "name_ko": "넘어 지나가기",
    "name_en": "Tumble Through",
    "cost": "1",
    "traits": [
      "이동"
    ],
    "req_skill": "acrobatics",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 이동<br>적의 공간을 통과하여 보폭합니다. 곡예 판정을 적의 반사 DC에 대해 시도합니다.<br><strong>성공:</strong> 적의 공간을 통과하여 나머지 보폭을 완료합니다.<br>"
  },
  {
    "id": "maneuver-flight",
    "cat": "skill",
    "cat_label": "곡예 행동",
    "name_ko": "공중 기동",
    "name_en": "Maneuver in Flight",
    "cost": "1",
    "traits": [
      "이동"
    ],
    "req_skill": "acrobatics",
    "req_rank": 2,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 이동<br><br>까다로운 공중 기동을 수행합니다. 곡예 판정을 시도합니다(DC는 GM이 결정).<br><strong>성공:</strong> 원하는 기동을 수행합니다.<br>"
  },
  {
    "id": "squeeze",
    "cat": "skill",
    "cat_label": "곡예 행동",
    "name_ko": "비집고 들어가기",
    "name_en": "Squeeze",
    "cost": "1min",
    "traits": [],
    "req_skill": "acrobatics",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 탐험<br><br>보통은 맞지 않을 것 같은 좁은 공간을 10피트 통과합니다. 곡예 판정을 시도합니다.<br><strong>대성공:</strong> 좁은 공간을 1분에 5피트로 빠르게 비집고 지나갑니다.<br>"
  },
  {
    "id": "hide",
    "cat": "skill",
    "cat_label": "은신 행동",
    "name_ko": "숨기",
    "name_en": "Hide",
    "cost": "1",
    "traits": [],
    "req_skill": "stealth",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 비밀<br>엄폐나 상위 엄폐 뒤, 또는 은폐 상태에서 숨어 관측(observed) 대신 숨겨진(hidden) 상태가 됩니다. GM이 은신 판정을 비밀리에 굴려 각 관찰자의 감지 DC와 비교합니다. 표준 엄폐 시 +2, 상위 엄폐 시 +4 상황 보너스.<br><strong>성공:</strong> 볼 수 있었던 생물에게 숨겨진 상태가 됩니다. 엄폐/은폐가 사라지면 다시 관측 상태. 숨기, 잠행, 한 걸음 외의 행동을 하면 관측 상태(타격 시 공격 전까지 무방비 유지)."
  },
  {
    "id": "sneak",
    "cat": "skill",
    "cat_label": "은신 행동",
    "name_ko": "살금살금 이동",
    "name_en": "Sneak",
    "cost": "1",
    "traits": [
      "이동"
    ],
    "req_skill": "stealth",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 이동, 비밀<br>탐지되지 않은 채 이동합니다. 절반 속도로 보폭합니다. 이동 종료 시 GM이 은신 판정을 비밀리에 굴려, 이동 시작 시 숨겨진/미탐지 상태였던 각 생물의 감지 DC와 비교합니다. 이동 중 엄폐/상위 엄폐가 있으면 보너스를 얻습니다.<br><strong>성공:</strong> 이동 중과 이동 후 미탐지(undetected) 상태를 유지합니다. 숨기/잠행/한 걸음 외의 행동을 하면 관측 상태.<br>"
  },
  {
    "id": "lie",
    "cat": "skill",
    "cat_label": "기만 행동",
    "name_ko": "거짓말",
    "name_en": "Lie",
    "cost": "varies",
    "traits": [
      "언어"
    ],
    "req_skill": "deception",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 청각, 집중, 언어, 정신, 비밀<br>거짓말로 누군가를 속이려 합니다. 최소 1라운드가 걸리며(정교한 거짓말은 더 오래). 기만 판정 1회를 굴려 속이려는 모든 생물의 감지 DC와 비교합니다. GM이 상황에 따라 보너스를 줄 수 있습니다. 정교하거나 극히 믿기 어려운 거짓말은 훨씬 어렵습니다.<br><strong>성공:</strong> 대상이 거짓말을 믿습니다.<br>"
  },
  {
    "id": "impersonate",
    "cat": "skill",
    "cat_label": "기만 행동",
    "name_ko": "변장",
    "name_en": "Impersonate",
    "cost": "10min",
    "traits": [],
    "req_skill": "deception",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 집중, 탐험, 조작<br>다른 사람이나 다른 것으로 위장합니다. 설득력 있는 변장을 만드는 데 10분과 변장 키트(288페이지)가 필요합니다. 생물은 보통 탐색(Seek) 행동으로 당신의 기만 DC에 대해 지각 판정을 시도해야 당신을 간파합니다. 직접 상호작용하면 GM이 비밀 기만 판정을 굴립니다.<br><strong>성공:</strong> 변장한 인물로 속입니다. 행동이 변하면 새 판정이 필요할 수 있습니다.<br>"
  },
  {
    "id": "feint",
    "cat": "skill",
    "cat_label": "기만 행동",
    "name_ko": "페인트",
    "name_en": "Feint",
    "cost": "1",
    "traits": [],
    "req_skill": "deception",
    "req_rank": 2,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 정신<br><br>기만적인 동작으로 적을 진짜 공격에 대비시키지 못하게 합니다. 기만 판정을 대상의 감지 DC에 대해 시도합니다.<br><strong>대성공:</strong> 대상이 다음 턴 종료까지 당신의 근접 공격에 무방비.<br>"
  },
  {
    "id": "create-diversion",
    "cat": "skill",
    "cat_label": "기만 행동",
    "name_ko": "주의 분산",
    "name_en": "Create a Diversion",
    "cost": "1",
    "traits": [],
    "req_skill": "deception",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 정신<br>몸짓, 속임수, 또는 주의를 돌리는 말로 생물의 시선을 다른 곳으로 유도합니다. 기만 판정을 대상의 감지 DC에 대해 시도합니다. 성공 여부에 관계없이, 대상은 1분간 당신의 주의 분산 시도에 +4 상황 보너스를 얻습니다.<br><strong>성공:</strong> 감지 DC 이하인 생물에게 숨겨진(hidden) 상태가 됩니다. 턴 종료까지 또는 한 걸음/은신 외 행동을 할 때까지 지속.<br>"
  },
  {
    "id": "make-impression",
    "cat": "skill",
    "cat_label": "외교 행동",
    "name_ko": "인상 심기",
    "name_en": "Make an Impression",
    "cost": "1min",
    "traits": [
      "언어"
    ],
    "req_skill": "diplomacy",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 청각, 집중, 탐험, 언어, 정신<br>최소 1분의 대화 후 외교 판정을 대상의 의지 DC에 대해 시도합니다. 최대 5명까지 동시에 시도 가능(-2 페널티). 대성공: 태도 2단계 개선, 성공: 1단계 개선, 대실패: 1단계 악화."
  },
  {
    "id": "request",
    "cat": "skill",
    "cat_label": "외교 행동",
    "name_ko": "요청",
    "name_en": "Request",
    "cost": "1",
    "traits": [
      "언어"
    ],
    "req_skill": "diplomacy",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 청각, 집중, 언어, 정신<br>우호적이나 도움이 되는 생물에게 요청합니다. 대상의 현재 태도에 맞게 요청을 조정해야 합니다. GM이 DC를 설정합니다. 대성공: 무조건 동의, 성공: 조건부 동의, 실패: 거부(덜 극단적 대안 제시 가능), 대실패: 거부하고 태도 1단계 악화."
  },
  {
    "id": "gather-info",
    "cat": "skill",
    "cat_label": "외교 행동",
    "name_ko": "정보 수집",
    "name_en": "Gather Information",
    "cost": "1h",
    "traits": [],
    "req_skill": "diplomacy",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 탐험, 비밀<br>지역 시장, 주막, 모임 장소에서 특정 인물이나 주제에 대한 정보를 수집합니다. GM이 DC와 소요 시간을 결정합니다(보통 2시간이지만 때로 더 오래). 뇌물, 음료, 선물에 돈을 써서 혜택을 얻을 수도 있습니다.<br><strong>성공:</strong> 개인이나 주제에 대한 정보를 수집합니다. GM이 세부 사항을 결정합니다.<br><br><strong>예시 정보 수집 과제:</strong>"
  },
  {
    "id": "demoralize",
    "cat": "skill",
    "cat_label": "위협 행동",
    "name_ko": "사기 꺾기",
    "name_en": "Demoralize",
    "cost": "1",
    "traits": [
      "감정",
      "정신",
      "공포"
    ],
    "req_skill": "intimidation",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 청각, 집중, 감정, 공포, 정신<br>갑작스러운 외침, 시의적절한 조롱, 또는 날카로운 비꼬기로 적의 결의를 흔듭니다. 30피트 내 인식하고 있는 생물 1명을 선택하여 그 대상의 의지 DC에 대해 위협 판정을 시도합니다. 대상이 당신의 언어를 이해하지 못하거나 언어를 사용하지 않으면 -4 상황 페널티. 결과에 관계없이, 대상은 10분간 당신의 사기 저하 시도에 면역.<br><strong>대성공:</strong> 대상이 공포(frightened) 2.<br>"
  },
  {
    "id": "coerce",
    "cat": "skill",
    "cat_label": "위협 행동",
    "name_ko": "강요",
    "name_en": "Coerce",
    "cost": "1min",
    "traits": [
      "감정",
      "정신"
    ],
    "req_skill": "intimidation",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 청각, 집중, 감정, 탐험, 언어, 정신<br>드러내놓거나 은밀한 위협으로 생물을 강요합니다. 최소 1분의 대화 후 위협 판정을 대상의 의지 DC에 대해 시도합니다.<br><strong>대성공:</strong> 대상이 정보를 주거나 지시를 따릅니다. GM이 정한 기간(최대 1일) 후 비우호적이 되지만, 보복은 두려워 하지 않습니다(단기적으로).<br>"
  },
  {
    "id": "stabilize",
    "cat": "skill",
    "cat_label": "의학 행동",
    "name_ko": "안정화",
    "name_en": "Stabilize",
    "cost": "1",
    "traits": [],
    "req_skill": "medicine",
    "req_rank": 0,
    "req_feat": null,
    "summary": "빈사 상태 대상의 빈사 값을 줄여 의식 불명 상태를 유지합니다."
  },
  {
    "id": "treat-wounds",
    "cat": "skill",
    "cat_label": "의학 행동",
    "name_ko": "부상 치료",
    "name_en": "Treat Wounds",
    "cost": "10min",
    "traits": [],
    "req_skill": "medicine",
    "req_rank": 2,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 탐험, 치유, 조작<br><br>부상당한 살아있는 생물 1명을 10분간 치료합니다(자신도 가능). 대상은 1시간 동안 상처 치료에 면역입니다(치료 시간 포함). 의학 판정 DC는 보통 15이지만 GM이 조정 가능합니다. 전문가이면 DC 20으로 치유 +10, 달인이면 DC 30으로 +30, 전설이면 DC 40으로 +50.<br>1시간 동안 치료하면 회복량이 2배가 됩니다.<br><strong>대성공:</strong> 4d8 HP 회복 + 부상(wounded) 상태 제거.<br>"
  },
  {
    "id": "treat-poison",
    "cat": "skill",
    "cat_label": "의학 행동",
    "name_ko": "독 치료",
    "name_en": "Treat Poison",
    "cost": "1",
    "traits": [],
    "req_skill": "medicine",
    "req_rank": 2,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 조작<br><br>독의 확산을 방지합니다. 독의 DC에 대해 의학 판정. 대성공: 다음 내성에 +4, 성공: +2, 대실패: -2."
  },
  {
    "id": "treat-disease",
    "cat": "skill",
    "cat_label": "의학 행동",
    "name_ko": "질병 치료",
    "name_en": "Treat Disease",
    "cost": "8h",
    "traits": [],
    "req_skill": "medicine",
    "req_rank": 2,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 휴식, 조작<br><br>최소 8시간 동안 병든 생물을 돌봅니다. 질병의 DC에 대해 의학 판정. 대성공: 다음 내성에 +4, 성공: +2, 대실패: -2."
  },
  {
    "id": "first-aid",
    "cat": "skill",
    "cat_label": "의학 행동",
    "name_ko": "응급 처치",
    "name_en": "First Aid",
    "cost": "1",
    "traits": [],
    "req_skill": "medicine",
    "req_rank": 0,
    "req_feat": null,
    "summary": "지혈(피를 흘리는 상태 해제) 또는 공포에 빠진 동료를 깨웁니다."
  },
  {
    "id": "steal",
    "cat": "skill",
    "cat_label": "도둑질 행동",
    "name_ko": "소매치기",
    "name_en": "Steal",
    "cost": "1",
    "traits": [
      "교묘"
    ],
    "req_skill": "thievery",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 조작<br><br>다른 생물에게서 작은 물건을 몰래 빼앗으려 합니다. 보통 무시할 수 있는 부피만 가능하며, 전투 중이거나 경계 중인 생물에게는 자동 실패입니다. 도둑질 판정을 대상의 감지 DC에 대해 시도합니다. 주머니에 있거나 손에 들린 물건은 DC +5.<br><strong>성공:</strong> 소지자가 알아채지 못한 채 물건을 빼앗습니다.<br>"
  },
  {
    "id": "pick-lock",
    "cat": "skill",
    "cat_label": "도둑질 행동",
    "name_ko": "자물쇠 따기",
    "name_en": "Pick a Lock",
    "cost": "2",
    "traits": [
      "교묘"
    ],
    "req_skill": "thievery",
    "req_rank": 2,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 조작<br><br>열쇠 없이 자물쇠를 엽니다. DC는 자물쇠의 복잡성과 제작 품질에 따라 결정됩니다. 더 높은 품질의 자물쇠는 여러 번의 성공이 필요할 수 있습니다.<br><strong>대성공:</strong> 자물쇠를 열거나 2회 성공 진행. 흔적 없음.<br><br>모든 종류의 경험과 훈련이 클래스에서 배우는 것 이상으로 캐릭터를 형성할 수 있습니다. 특정 혈통이나 클래스의 구성원뿐 아니라 누구나 — 어느 정도의 훈련으로 — 배울 수 있는 능력을 <span class=\"term\">일반 재주(General Feats)</span>라 합니다.<br>대부분의 클래스에서 3레벨부터 매 4레벨마다 일반 재주를 얻습니다. 일반 재주를 얻을 때마다, 전제조건을 충족하는 일반(general) 특성의 재주를 선택할 수 있습니다.<br>일반 재주에는 <strong>기술 재주(Skill Feats)</strong>라는 하위 범주도 있으며, 이것은 기술로 할 수 있는 것을 확장합니다. 기술 재주에는 기술(skill) 특성도 있습니다. 대부분의 캐릭터는 2레벨부터 매 2레벨마다 기술 재주를 얻습니다. 기술 재주를 얻을 때는 기술 특성이 있는 일반 재주만 선택할 수 있으며, 기술 특성이 없는 일반 재주는 선택할 수 없습니다. 기술 재주의 레벨은 보통 캐릭터가 숙련도 전제조건을 충족할 수 있는 최소 레벨입니다.<br>각 기술에 특별히 관련된 기술 재주 외에도, 확인(Assurance)처럼 다양한 기술이나 모든 기술에 사용할 수 있는 재주가 있습니다."
  },
  {
    "id": "disable-device",
    "cat": "skill",
    "cat_label": "도둑질 행동",
    "name_ko": "장치 해제",
    "name_en": "Disable a Device",
    "cost": "2",
    "traits": [
      "교묘"
    ],
    "req_skill": "thievery",
    "req_rank": 2,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 조작<br><br>함정이나 복잡한 장치를 해제합니다. 종종 여러 번의 성공이 필요합니다. 도둑 키트가 필요하거나 유용한 경우가 많으며, 일부 장치는 더 높은 숙련도를 요구합니다.<br><strong>대성공:</strong> 장치를 해제하거나 2회 성공 진행. 흔적을 남기지 않으며 나중에 재설치 가능.<br>"
  },
  {
    "id": "command-animal",
    "cat": "skill",
    "cat_label": "자연 행동",
    "name_ko": "동물 지시",
    "name_en": "Command an Animal",
    "cost": "1",
    "traits": [
      "청각",
      "언어"
    ],
    "req_skill": "nature",
    "req_rank": 2,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 청각, 집중<br>동물에게 명령을 내립니다. 동물의 의지 DC에 대해 자연학 판정을 시도합니다. GM이 동물의 태도에 따라 DC를 조정할 수 있습니다. 적대적이거나 비우호적인 동물에게는 자동 실패합니다. 도움이 되는 동물이면 성공도가 한 단계 향상됩니다.<br>대부분의 동물은 엎드리기, 도약, 탐색, 일어서기, 보폭, 타격의 기본 행동을 알고 있습니다.<br><strong>성공:</strong> 동물이 다음 턴에 명령을 수행합니다.<br><br><strong>숙련 행동:</strong> 마법 식별(원시 전통), 주문 학습(원시 전통)."
  },
  {
    "id": "sense-direction",
    "cat": "skill",
    "cat_label": "생존 행동",
    "name_ko": "방향 감지",
    "name_en": "Sense Direction",
    "cost": "varies",
    "traits": [],
    "req_skill": "survival",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 탐험, 비밀<br>별, 태양 위치, 지리적 특성 등을 사용하여 야생에서 방향을 유지합니다. 보통 하루 1회 시도합니다. 나침반 없으면 -2 아이템 페널티.<br><strong>대성공:</strong> 방향을 정확히 파악합니다.<br>"
  },
  {
    "id": "track",
    "cat": "skill",
    "cat_label": "생존 행동",
    "name_ko": "추적",
    "name_en": "Track",
    "cost": "1",
    "traits": [
      "이동"
    ],
    "req_skill": "survival",
    "req_rank": 2,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 집중, 탐험, 이동<br><br>절반 이동 속도로 흔적을 따릅니다. 추적 시작 시, 매시간, 흔적에 중대한 변화가 있을 때마다 생존 판정을 시도합니다. DC는 흔적의 신선도, 날씨, 지면 유형에 따라 다릅니다.<br><strong>성공:</strong> 흔적을 찾거나 계속 따릅니다.<br>"
  },
  {
    "id": "cover-tracks",
    "cat": "skill",
    "cat_label": "생존 행동",
    "name_ko": "흔적 지우기",
    "name_en": "Cover Tracks",
    "cost": "1",
    "traits": [
      "이동"
    ],
    "req_skill": "survival",
    "req_rank": 2,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 집중, 탐험, 이동<br><br>절반 이동 속도로 이동하며 흔적을 감춥니다. 생존 판정을 시도하지 않지만, 추적자는 일반 DC보다 당신의 생존 DC가 높으면 그것에 대해 성공해야 합니다."
  },
  {
    "id": "repair",
    "cat": "skill",
    "cat_label": "제작 행동",
    "name_ko": "수리",
    "name_en": "Repair",
    "cost": "10min",
    "traits": [],
    "req_skill": "crafting",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 탐험, 조작<br>손상된 물건을 수리합니다. 수리 키트(288페이지)가 필요합니다. 10분간 수리 후 제작 판정을 시도합니다. 대성공: 아이템의 HP를 10 + 레벨당 10 회복, 성공: 5 + 레벨당 5 회복, 대실패: 2d6 피해를 아이템에 추가."
  },
  {
    "id": "craft",
    "cat": "skill",
    "cat_label": "제작 행동",
    "name_ko": "제작",
    "name_en": "Craft",
    "cost": "1day",
    "traits": [],
    "req_skill": "crafting",
    "req_rank": 2,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 휴식, 조작<br><br>아이템을 만듭니다. 아이템의 공식(formula)이 필요하며, 가격의 절반에 해당하는 원재료와 최소 2일의 작업이 필요합니다(공식이 있으면 1일). 제작 판정 후 추가 시간을 투자하여 남은 비용을 줄일 수 있습니다.<br><strong>대성공:</strong> 성공이며 추가 작업일의 비용 감소가 레벨+1에 기반.<br>"
  },
  {
    "id": "earn-income-cr",
    "cat": "skill",
    "cat_label": "제작 행동",
    "name_ko": "수입 창출(제작)",
    "name_en": "Earn Income",
    "cost": "1day",
    "traits": [],
    "req_skill": "crafting",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 휴식<br><br>당신은 휴식 기간에 직업이나 장사로 돈을 법니다. GM이 과제의 레벨을 결정하며, 해당 기술의 숙련도에 맞는 과제 중에서 선택합니다. 하루 작업 후 해당 기술로 판정합니다.<br><strong>대성공:</strong> 뛰어난 작업을 합니다. 과제 레벨 +1과 당신의 숙련도 등급에 해당하는 보수를 받습니다.<br><br>첫날 이후 추가 일수 동안 재판정 없이 같은 금액을 벌 수 있습니다. 대부분의 과제는 1~2주이지만, 일부는 수개월이나 수년이 걸릴 수 있습니다."
  },
  {
    "id": "perform",
    "cat": "skill",
    "cat_label": "공연 행동",
    "name_ko": "공연",
    "name_en": "Perform",
    "cost": "1",
    "traits": [],
    "req_skill": "performance",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 집중<br>짧은 공연 — 노래 한 곡, 빠른 춤, 농담 몇 개 — 을 합니다. 능력을 증명하거나 빠르게 인상을 줄 때 유용합니다. 이후 외교 판정의 DC에 영향을 줄 수 있습니다.<br><strong>대성공:</strong> 공연이 관객에게 깊은 인상을 남기고, 능력에 대한 이야기를 퍼뜨릴 가능성이 높습니다.<br><br><strong>숙련 행동:</strong> 돈 벌기(공연으로)."
  },
  {
    "id": "recall-arcana",
    "cat": "skill",
    "cat_label": "지식 행동",
    "name_ko": "지식 회상(주문학)",
    "name_en": "Recall Knowledge",
    "cost": "1",
    "traits": [
      "집중"
    ],
    "req_skill": "arcana",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 집중, 비밀<br><br>적절한 기술을 사용하여 이미 알고 있을 수 있는 정보를 기억해냅니다. GM이 DC를 결정합니다.<br><strong>대성공:</strong> 정확하고 자세한 정보를 기억해냅니다. GM이 추가 유용한 정보를 줄 수 있습니다.<br>"
  },
  {
    "id": "recall-nature",
    "cat": "skill",
    "cat_label": "지식 행동",
    "name_ko": "지식 회상(자연학)",
    "name_en": "Recall Knowledge",
    "cost": "1",
    "traits": [
      "집중"
    ],
    "req_skill": "nature",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 집중, 비밀<br><br>적절한 기술을 사용하여 이미 알고 있을 수 있는 정보를 기억해냅니다. GM이 DC를 결정합니다.<br><strong>대성공:</strong> 정확하고 자세한 정보를 기억해냅니다. GM이 추가 유용한 정보를 줄 수 있습니다.<br>"
  },
  {
    "id": "recall-occult",
    "cat": "skill",
    "cat_label": "지식 행동",
    "name_ko": "지식 회상(오컬티즘)",
    "name_en": "Recall Knowledge",
    "cost": "1",
    "traits": [
      "집중"
    ],
    "req_skill": "occultism",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 집중, 비밀<br><br>적절한 기술을 사용하여 이미 알고 있을 수 있는 정보를 기억해냅니다. GM이 DC를 결정합니다.<br><strong>대성공:</strong> 정확하고 자세한 정보를 기억해냅니다. GM이 추가 유용한 정보를 줄 수 있습니다.<br>"
  },
  {
    "id": "recall-religion",
    "cat": "skill",
    "cat_label": "지식 행동",
    "name_ko": "지식 회상(종교학)",
    "name_en": "Recall Knowledge",
    "cost": "1",
    "traits": [
      "집중"
    ],
    "req_skill": "religion",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 집중, 비밀<br><br>적절한 기술을 사용하여 이미 알고 있을 수 있는 정보를 기억해냅니다. GM이 DC를 결정합니다.<br><strong>대성공:</strong> 정확하고 자세한 정보를 기억해냅니다. GM이 추가 유용한 정보를 줄 수 있습니다.<br>"
  },
  {
    "id": "recall-society",
    "cat": "skill",
    "cat_label": "지식 행동",
    "name_ko": "지식 회상(사회)",
    "name_en": "Recall Knowledge",
    "cost": "1",
    "traits": [
      "집중"
    ],
    "req_skill": "society",
    "req_rank": 0,
    "req_feat": null,
    "summary": "<strong>특성:</strong> 집중, 비밀<br><br>적절한 기술을 사용하여 이미 알고 있을 수 있는 정보를 기억해냅니다. GM이 DC를 결정합니다.<br><strong>대성공:</strong> 정확하고 자세한 정보를 기억해냅니다. GM이 추가 유용한 정보를 줄 수 있습니다.<br>"
  },
  {
    "id": "shield-block",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "방패 막기",
    "name_en": "Shield Block",
    "cost": "reaction",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "방패 막기",
    "summary": "방패 막기(Shield Block) 일반 재주(262페이지)를 얻습니다."
  },
  {
    "id": "aoo",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "기회 공격",
    "name_en": "Attack of Opportunity",
    "cost": "reaction",
    "traits": [
      "전사"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "기회 공격",
    "summary": "적이 원거리 공격, 기술 행동, 이동 시 트리거하여 근접 스트라이크를 가합니다."
  },
  {
    "id": "sudden-charge",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "돌격",
    "name_en": "Sudden Charge",
    "cost": "2",
    "traits": [
      "충격",
      "이동"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "돌격",
    "summary": "2배 이동 속도로 달려가 스트라이크를 가합니다."
  },
  {
    "id": "power-attack",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "강공격",
    "name_en": "Power Attack",
    "cost": "2",
    "traits": [
      "전사"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "강공격",
    "summary": "두 행동을 소모하여 추가 피해 주사위 1개를 더한 스트라이크를 가합니다."
  },
  {
    "id": "reactive-shield",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "반응 방패",
    "name_en": "Reactive Shield",
    "cost": "reaction",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "반응 방패",
    "summary": "명중 당할 때 반응으로 방패 올리기를 사용합니다."
  },
  {
    "id": "double-slice",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "이중 참격",
    "name_en": "Double Slice",
    "cost": "2",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "이중 참격",
    "summary": "양손 무기로 두 번 스트라이크를 가합니다. 두 번째 타격의 다중 공격 페널티 감소."
  },
  {
    "id": "sneak-attack-ability",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "기습 공격",
    "name_en": "Sneak Attack",
    "cost": "passive",
    "traits": [],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "기습 공격",
    "summary": "무방비(off-guard) 상태인 생물에 민첩/기교 근접 무기, 민첩/기교 비무장 공격, 원거리 무기/비무장 공격으로 타격 시 <strong>추가 1d6 정밀 피해</strong>. 투척 근접 무기는 민첩/기교여야 합니다. 5, 11, 17레벨에 피해 주사위가 1개씩 증가."
  },
  {
    "id": "inspire-courage",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "용기 고취",
    "name_en": "Inspire Courage",
    "cost": "1",
    "traits": [
      "집중",
      "조작",
      "청각",
      "감정",
      "정신"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "용기 고취",
    "summary": "바드 캔트립. 아군의 명중 굴림과 피해 굴림에 +1 사기 보너스."
  },
  {
    "id": "inspire-defense",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "방어 고취",
    "name_en": "Inspire Defense",
    "cost": "1",
    "traits": [
      "집중",
      "조작",
      "청각",
      "감정",
      "정신"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "방어 고취",
    "summary": "바드 캔트립. 아군의 AC와 내성에 +1 사기 보너스."
  },
  {
    "id": "channel-smite",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "채널 강타",
    "name_en": "Channel Smite",
    "cost": "2",
    "traits": [
      "신성",
      "사악",
      "선"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "채널 강타",
    "summary": "신성 시전 에너지를 무기 타격에 담아 발사합니다."
  },
  {
    "id": "battle-medicine",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "전투 의학",
    "name_en": "Battle Medicine",
    "cost": "1",
    "traits": [
      "조작",
      "의학"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "전투 의학",
    "summary": "전투 중 부상 치료. 1일 1회/대상. 숙련 2d8, 전문가 2d8+10, 달인 4d8+30, 전설 4d8+50."
  },
  {
    "id": "goblin-song",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "고블린 노래",
    "name_en": "Goblin Song",
    "cost": "1",
    "traits": [
      "고블린"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "고블린 노래",
    "summary": "공연으로 적의 지각/의지에 -1 상태 페널티."
  },
  {
    "id": "hunt-prey",
    "cat": "feat",
    "cat_label": "재주 행동",
    "name_ko": "사냥감 지정",
    "name_en": "Hunt Prey",
    "cost": "1",
    "traits": [
      "레인저"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": "사냥감 지정",
    "summary": "볼 수 있거나 추적 중인 생물 1명을 사냥감으로 지정합니다. 사냥감을 탐색(Seek)하기 위한 지각 판정에 <strong>+2 상황 보너스</strong>, 추적(Track)을 위한 생존 판정에 <strong>+2 상황 보너스</strong>. 사냥감에 대한 두 번째 사거리 증분 내 원거리 공격 페널티도 무시합니다. 한 번에 사냥감 1명만 가능. 다음 일일 준비까지 지속."
  },
  {
    "id": "call-ancient-blood",
    "cat": "heritage",
    "cat_label": "유산 행동",
    "name_ko": "고대의 피에 호소",
    "name_en": "Call on Ancient Blood",
    "cost": "reaction",
    "traits": [
      "드워프",
      "집중"
    ],
    "req_skill": null,
    "req_rank": 0,
    "req_feat": null,
    "summary": "마법 효과에 대한 내성 굴림 전 반응. 유발 내성과 이 턴 종료까지 마법 효과 내성에 +1 상황 보너스.",
    "req_heritage": "ancient-blooded-dwarf"
  }
];

const CONDITIONS = [
  "실명",
  "파손됨",
  "서투름",
  "은폐",
  "혼란",
  "지배됨",
  "현혹됨",
  "귀머거리",
  "파멸",
  "탈진",
  "빈사",
  "약화",
  "매혹",
  "피로",
  "무방비",
  "도주중",
  "우호적",
  "공포",
  "붙잡힘",
  "협력적",
  "숨겨짐",
  "고정",
  "무관심",
  "투명",
  "발각됨",
  "마비",
  "석화",
  "넘어짐",
  "속행",
  "구속",
  "메스꺼움",
  "둔화",
  "기절",
  "현기증",
  "의식불명",
  "미감지",
  "비우호적",
  "존재미인지",
  "부상"
];

// 능력치 enum + 한글 매핑 (전역 사용)
const ATTRIBUTES = ['str','dex','con','int','wis','cha'];
const ATTR_KO = { str:'근력', dex:'민첩', con:'건강', int:'지능', wis:'지혜', cha:'매력' };
const ATTR_EN = { str:'STR', dex:'DEX', con:'CON', int:'INT', wis:'WIS', cha:'CHA' };

const PROF_RANKS = {
  "0": 0,
  "2": 2,
  "4": 4,
  "6": 6,
  "8": 8,
  "미숙련": 0,
  "숙련": 2,
  "전문가": 4,
  "달인": 6,
  "전설": 8
};

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

