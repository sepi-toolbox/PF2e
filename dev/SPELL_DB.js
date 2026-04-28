// Pathfinder 2e Player Core — 주문 데이터베이스
// PlayerCore.html 7장에서 자동 생성
// Generated: 2026-04-26
// Total: 416 spells

const SPELL_DB = [
  {
    "id": "caustic-blast",
    "name_ko": "부식 폭발",
    "name_en": "Caustic Blast",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "산성",
      "조작"
    ],
    "range": "30피트",
    "area": "5피트 폭발",
    "defense": "기본 반사",
    "summary": "큰 산성 덩어리를 던져 즉시 폭발시켜 주변 생물에게 뿌립니다. 영역 내 생물은 기본 반사 내성과 함께 1d8 산성 피해를 받습니다. 대실패 시 1 지속 산성 피해도 받습니다.강화(+2): 초기 피해 +1d8, 대실패 지속 피해 +1.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>영역:</strong> 5피트 폭발<br><strong>방어:</strong> 기본 반사<br>큰 산성 덩어리를 던져 즉시 폭발시켜 주변 생물에게 뿌립니다. 영역 내 생물은 기본 반사 내성과 함께 <strong>1d8 산성 피해</strong>를 받습니다. 대실패 시 <strong>1 지속 산성 피해</strong>도 받습니다.<br><strong>강화(+2):</strong> 초기 피해 +1d8, 대실패 지속 피해 +1."
  },
  {
    "id": "clinging-ice",
    "name_ko": "달라붙는 얼음",
    "name_en": "Clinging Ice",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "다양"
    ],
    "actions": "1행동",
    "traits": [
      "냉기",
      "위치"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "반사",
    "summary": "서리가 대상에 달라붙습니다. 1d4 냉기 피해(반사). 실패 시 -5피트 이동 속도(1라운드).강화(+2): 피해 +1d4.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 반사<br>서리가 대상에 달라붙습니다. <strong>1d4 냉기 피해</strong>(반사). 실패 시 <strong>-5피트 이동 속도</strong>(1라운드).<br><strong>강화(+2):</strong> 피해 +1d4."
  },
  {
    "id": "courageous-anthem",
    "name_ko": "용기의 찬가",
    "name_en": "Courageous Anthem",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "1행동",
    "traits": [
      "청각",
      "바드",
      "작곡",
      "감정",
      "정신"
    ],
    "area": "60피트 발산",
    "duration": "1라운드",
    "summary": "말이나 격려의 노래로 자신과 아군에게 영감을 줍니다. 당신과 영역 내 모든 아군은 명중 굴림, 피해 굴림, 공포 효과에 대한 내성에 +1 상태 보너스를 얻습니다.",
    "desc": "<strong>영역:</strong> 60피트 발산<br><strong>지속 시간:</strong> 1라운드<br>말이나 격려의 노래로 자신과 아군에게 영감을 줍니다. 당신과 영역 내 모든 아군은 명중 굴림, 피해 굴림, 공포 효과에 대한 내성에 <strong>+1 상태 보너스</strong>를 얻습니다."
  },
  {
    "id": "daze",
    "name_ko": "멍하게",
    "name_en": "Daze",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "정신",
      "비치명"
    ],
    "range": "60피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "1라운드",
    "summary": "대상의 정신을 흐리게 하여 무방비하거나 둔화시킵니다.대성공: 영향 없음.성공: 대상이 1라운드간 무방비(off-guard).실패: 대상이 4 정신 피해를 받고 1라운드간 무방비.대실패: 대상이 4 정신 피해를 받고 1라운드간 무방비 + 둔화 1(slowed 1).강화(+2): 피해 +4.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1라운드<br>대상의 정신을 흐리게 하여 무방비하거나 둔화시킵니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 대상이 1라운드간 <strong>{{condition:Off-Guard}}</strong>.<br><strong>실패:</strong> 대상이 <strong>4 정신 피해</strong>를 받고 1라운드간 <strong>무방비</strong>.<br><strong>대실패:</strong> 대상이 <strong>4 정신 피해</strong>를 받고 1라운드간 <strong>무방비 + 둔화 1(slowed 1)</strong>.<br><strong>강화(+2):</strong> 피해 +4."
  },
  {
    "id": "detect-magic",
    "name_ko": "마법 탐지",
    "name_en": "Detect Magic",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "탐지",
      "조작"
    ],
    "area": "30피트 발산",
    "summary": "근처에 마법이 있는지 감지합니다. 발산 내에 마법의 존재를 느끼며, 마법의 위치가 아닌 존재만 알게 됩니다. 물체나 생물의 후속 탐지에는 더 구체적인 정보를 제공합니다.강화(3랭크): 비일반 또는 희귀 마법 오라의 학파를 알 수 있습니다.강화(5랭크): 감지 영역이 60피트로 증가합니다.",
    "desc": "<strong>영역:</strong> 30피트 발산<br>근처에 마법이 있는지 감지합니다. 발산 내에 마법의 존재를 느끼며, 마법의 위치가 아닌 존재만 알게 됩니다. 물체나 생물의 후속 탐지에는 더 구체적인 정보를 제공합니다.<br><strong>강화(3랭크):</strong> 비일반 또는 희귀 마법 오라의 학파를 알 수 있습니다.<br><strong>강화(5랭크):</strong> 감지 영역이 60피트로 증가합니다."
  },
  {
    "id": "discern-secrets",
    "name_ko": "비밀 간파",
    "name_en": "Discern Secrets",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "다양"
    ],
    "actions": "1행동",
    "traits": [
      "위치",
      "예언",
      "정신"
    ],
    "range": "30피트",
    "target": "아군 1",
    "duration": "1라운드",
    "summary": "대상이 다음 감지, 사회, 기만 판정에 +1 상태 보너스를 얻습니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 아군 1<br><strong>지속 시간:</strong> 1라운드<br>대상이 다음 감지, 사회, 기만 판정에 <strong>+1 상태 보너스</strong>를 얻습니다."
  },
  {
    "id": "divine-lance",
    "name_ko": "신성 창",
    "name_en": "Divine Lance",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "영혼"
    ],
    "range": "60피트",
    "target": "생물 1",
    "summary": "신성 에너지를 던져 1d4 영혼(spirit) 피해를 가합니다. 신성(holy) 성별화를 가지고 있으면 불경(unholy) 대상에 추가 1d4 피해. 불경 성별화를 가지면 신성 대상에 추가 1d4 피해. 성별화가 없으면 양쪽 모두에 추가 피해 가능.강화(+1): 피해 +1d4, 추가 피해 +1d4.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 생물 1<br>신성 에너지를 던져 <strong>1d4 영혼(spirit) 피해</strong>를 가합니다. 신성(holy) 성별화를 가지고 있으면 불경(unholy) 대상에 추가 1d4 피해. 불경 성별화를 가지면 신성 대상에 추가 1d4 피해. 성별화가 없으면 양쪽 모두에 추가 피해 가능.<br><strong>강화(+1):</strong> 피해 +1d4, 추가 피해 +1d4."
  },
  {
    "id": "electric-arc",
    "name_ko": "전기 호",
    "name_en": "Electric Arc",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "전기",
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1~2 (서로 30피트 이내)",
    "defense": "기본 반사",
    "summary": "번개 호를 발사하여 대상에 1d4 전기 피해를 가합니다. 기본 반사 내성.강화(+1): 피해 +1d4.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1~2 (서로 30피트 이내)<br><strong>방어:</strong> 기본 반사<br>번개 호를 발사하여 대상에 <strong>1d4 전기 피해</strong>를 가합니다. 기본 반사 내성.<br><strong>강화(+1):</strong> 피해 +1d4."
  },
  {
    "id": "evil-eye",
    "name_ko": "사악한 눈",
    "name_en": "Evil Eye",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "다양(후원자에 따라)"
    ],
    "actions": "1행동",
    "traits": [
      "위치",
      "저주",
      "감정",
      "공포",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "1라운드",
    "summary": "저주의 눈으로 적을 응시합니다. 의지 실패 시 대상이 공포(frightened) 1. 대실패 시 공포 2. 면역을 무시합니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1라운드<br>저주의 눈으로 적을 응시합니다. 의지 실패 시 대상이 <strong>{{condition:Frightened}} 1</strong>. 대실패 시 공포 2. 면역을 무시합니다."
  },
  {
    "id": "figment",
    "name_ko": "허상",
    "name_en": "Figment",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "간단한 환영 소리 또는 시각 이미지를 만듭니다. 소리를 선택하면 청각 특성이 추가되며, 알아들을 수 있는 말이나 정교한 음악은 포함할 수 없습니다. 이미지를 선택하면 최대 5피트 정육면체 크기이며, 15피트 이내에서는 명백히 조잡하게 보입니다. 시전하거나 유지할 때, 기만 판정에 +2 상황 보너스를 받아 주의 끌기(Create a Diversion)를...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>간단한 환영 소리 또는 시각 이미지를 만듭니다. 소리를 선택하면 청각 특성이 추가되며, 알아들을 수 있는 말이나 정교한 음악은 포함할 수 없습니다. 이미지를 선택하면 최대 5피트 정육면체 크기이며, 15피트 이내에서는 명백히 조잡하게 보입니다. 시전하거나 유지할 때, 기만 판정에 <strong>+2 상황 보너스</strong>를 받아 주의 끌기(Create a Diversion)를 시도할 수 있습니다."
  },
  {
    "id": "forbidding-ward",
    "name_ko": "금지의 수호",
    "name_en": "Forbidding Ward",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "아군 1과 적 1",
    "duration": "유지(최대 1분)",
    "summary": "대상 아군은 대상 적의 공격, 주문, 기타 효과에 대해 AC와 내성 굴림에 +1 상태 보너스를 얻습니다.강화(6랭크): 보너스가 +2로 증가합니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 아군 1과 적 1<br><strong>지속 시간:</strong> 유지(최대 1분)<br>대상 아군은 대상 적의 공격, 주문, 기타 효과에 대해 AC와 내성 굴림에 <strong>+1 상태 보너스</strong>를 얻습니다.<br><strong>강화(6랭크):</strong> 보너스가 +2로 증가합니다."
  },
  {
    "id": "frostbite",
    "name_ko": "동상",
    "name_en": "Frostbite",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "공격",
      "냉기",
      "조작"
    ],
    "range": "60피트",
    "target": "생물 1",
    "defense": "인내",
    "summary": "매서운 추위로 대상에 2d4 냉기 피해를 가하며, 기본 인내 내성을 시도합니다. 대실패: 다음 턴까지 둔기 피해에 대한 약점 1도 받습니다.강화(+1): 피해 +1d4, 약점 +1.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br>매서운 추위로 대상에 <strong>2d4 냉기 피해</strong>를 가하며, 기본 인내 내성을 시도합니다. <strong>대실패:</strong> 다음 턴까지 <strong>둔기 피해에 대한 약점 1</strong>도 받습니다.<br><strong>강화(+1):</strong> 피해 +1d4, 약점 +1."
  },
  {
    "id": "gouging-claw",
    "name_ko": "발톱 긁기",
    "name_en": "Gouging Claw",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "공격",
      "조작",
      "변형"
    ],
    "range": "접촉",
    "target": "생물 1",
    "defense": "AC",
    "summary": "손을 발톱으로 변형시켜 근접 주문 명중 굴림을 합니다. 2d6 참격 또는 관통 피해 + 2 지속 출혈 피해를 가합니다. 대성공: 피해와 지속 출혈 피해가 두 배가 됩니다.강화(+1): 참격 피해 +1d6, 지속 출혈 +1.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> AC<br>손을 발톱으로 변형시켜 근접 주문 명중 굴림을 합니다. <strong>2d6 참격 또는 관통 피해 + 2 지속 출혈 피해</strong>를 가합니다. <strong>대성공:</strong> 피해와 지속 출혈 피해가 두 배가 됩니다.<br><strong>강화(+1):</strong> 참격 피해 +1d6, 지속 출혈 +1."
  },
  {
    "id": "guidance",
    "name_ko": "인도",
    "name_en": "Guidance",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult",
      "primal"
    ],
    "actions": "1행동",
    "traits": [],
    "range": "30피트",
    "target": "생물 1",
    "duration": "다음 턴 시작까지",
    "summary": "대상은 하나의 명중 굴림, 지각 판정, 내성 굴림, 또는 기술 판정에 +1 상태 보너스를 받습니다. 대상은 굴리기 전에 어떤 굴림에 보너스를 사용할지 선택합니다. 보너스를 사용하거나 지속 시간이 끝나면 주문이 종료되며, 해당 생물은 1시간 동안 인도에 일시적 면역이 됩니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 다음 턴 시작까지<br>대상은 하나의 명중 굴림, 지각 판정, 내성 굴림, 또는 기술 판정에 <strong>+1 상태 보너스</strong>를 받습니다. 대상은 굴리기 전에 어떤 굴림에 보너스를 사용할지 선택합니다. 보너스를 사용하거나 지속 시간이 끝나면 주문이 종료되며, 해당 생물은 <strong>1시간 동안</strong> 인도에 일시적 면역이 됩니다."
  },
  {
    "id": "ignition",
    "name_ko": "점화",
    "name_en": "Ignition",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "화염",
      "조작"
    ],
    "range": "접촉 또는 30피트",
    "target": "생물 1",
    "defense": "AC",
    "summary": "근접이나 원거리로 대상을 불태웁니다. 주문 명중 굴림을 합니다. 근접 시 2d4 화염 피해, 원거리 시 1d4 화염 피해 + 1d4 지속 화염 피해.강화(+1): 근접 +2d4, 원거리 초기 +1d4.",
    "desc": "<strong>사거리:</strong> 접촉 또는 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> AC<br>근접이나 원거리로 대상을 불태웁니다. 주문 명중 굴림을 합니다. 근접 시 <strong>2d4 화염 피해</strong>, 원거리 시 <strong>1d4 화염 피해 + 1d4 지속 화염 피해</strong>.<br><strong>강화(+1):</strong> 근접 +2d4, 원거리 초기 +1d4."
  },
  {
    "id": "know-the-way",
    "name_ko": "길 알기",
    "name_en": "Know the Way",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "탐지",
      "조작"
    ],
    "summary": "진북과 시전 시 선택한 다른 위치(이전에 방문한 곳)의 방향을 알게 됩니다. 나침반처럼 작동합니다.강화(3랭크): 해당 위치까지의 대략적 거리도 알 수 있습니다.강화(7랭크): 같은 차원에서 자동으로 해당 위치의 방향을 알 수 있습니다.",
    "desc": "진북과 시전 시 선택한 다른 위치(이전에 방문한 곳)의 방향을 알게 됩니다. 나침반처럼 작동합니다.<br><strong>강화(3랭크):</strong> 해당 위치까지의 대략적 거리도 알 수 있습니다.<br><strong>강화(7랭크):</strong> 같은 차원에서 자동으로 해당 위치의 방향을 알 수 있습니다."
  },
  {
    "id": "light",
    "name_ko": "빛",
    "name_en": "Light",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "빛",
      "조작"
    ],
    "range": "접촉",
    "target": "비마법 물체 1(부피 1 이하)",
    "duration": "주문 준비까지",
    "summary": "물체가 20피트 반경의 밝은 빛과 추가 20피트의 희미한 빛을 발합니다. 시전 시 빛의 색을 선택합니다. 생물이 들거나 착용하면 해당 물체를 가립니다.강화(4랭크): 물체가 60피트 밝은 빛을 발합니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 비마법 물체 1(부피 1 이하)<br><strong>지속 시간:</strong> 주문 준비까지<br>물체가 <strong>20피트 반경의 밝은 빛</strong>과 추가 20피트의 희미한 빛을 발합니다. 시전 시 빛의 색을 선택합니다. 생물이 들거나 착용하면 해당 물체를 가립니다.<br><strong>강화(4랭크):</strong> 물체가 60피트 밝은 빛을 발합니다."
  },
  {
    "id": "message",
    "name_ko": "전언",
    "name_en": "Message",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "1행동",
    "traits": [
      "청각",
      "언어",
      "정신"
    ],
    "range": "120피트",
    "target": "생물 1",
    "summary": "사거리 내 생물에 속삭임 메시지를 전달합니다. 해당 생물만 들을 수 있으며, 속삭임으로 짧은 답변을 할 수 있습니다.강화(3랭크): 사거리 500피트로 증가.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 생물 1<br>사거리 내 생물에 속삭임 메시지를 전달합니다. 해당 생물만 들을 수 있으며, 속삭임으로 짧은 답변을 할 수 있습니다.<br><strong>강화(3랭크):</strong> 사거리 500피트로 증가."
  },
  {
    "id": "nudge-fate",
    "name_ko": "운명 조정",
    "name_en": "Nudge Fate",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "다양"
    ],
    "actions": "1행동",
    "traits": [
      "위치",
      "예언"
    ],
    "range": "30피트",
    "target": "생물 1 (자신 제외)",
    "duration": "1라운드",
    "summary": "운명의 실을 조정합니다. 대상의 다음 명중 굴림, 기술 판정, 또는 내성 굴림에 +1 상태 보너스.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1 (자신 제외)<br><strong>지속 시간:</strong> 1라운드<br>운명의 실을 조정합니다. 대상의 다음 명중 굴림, 기술 판정, 또는 내성 굴림에 <strong>+1 상태 보너스</strong>."
  },
  {
    "id": "prestidigitation",
    "name_ko": "요술",
    "name_en": "Prestidigitation",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "10피트",
    "target": "물체 1(1 부피 이하)",
    "duration": "유지",
    "summary": "사소한 마법 트릭을 수행합니다. 네 가지 옵션 중 하나를 선택합니다: 요리(Cook) — 음식을 데우거나 식힘; 들기(Lift) — 1 부피 이하 물체를 천천히 이동(부양은 아님); 만들기(Make) — 작은 물체를 일시적으로 만듦; 정리(Tidy) — 표면의 먼지나 때를 제거.강화(+2): 최대 유지 시간이 10분으로 증가.",
    "desc": "<strong>사거리:</strong> 10피트<br><strong>대상:</strong> 물체 1(1 부피 이하)<br><strong>지속 시간:</strong> 유지<br>사소한 마법 트릭을 수행합니다. 네 가지 옵션 중 하나를 선택합니다: <strong>요리(Cook)</strong> — 음식을 데우거나 식힘; <strong>들기(Lift)</strong> — 1 부피 이하 물체를 천천히 이동(부양은 아님); <strong>만들기(Make)</strong> — 작은 물체를 일시적으로 만듦; <strong>정리(Tidy)</strong> — 표면의 먼지나 때를 제거.<br><strong>강화(+2):</strong> 최대 유지 시간이 10분으로 증가."
  },
  {
    "id": "shield",
    "name_ko": "방패",
    "name_en": "Shield",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "1행동",
    "traits": [
      "힘"
    ],
    "duration": "다음 턴 시작까지",
    "summary": "마법의 힘으로 된 방패를 만듭니다. 다음 턴 시작까지 AC에 +1 상황 보너스를 얻습니다. 방패 막기(Shield Block) 반응이 있으면, 이 마법 방패로도 사용할 수 있습니다. 경도 5이며, 이 방식으로 피해를 받으면 주문이 종료되고 10분간 방패를 다시 시전할 수 없습니다.강화(3랭크): 경도 10.강화(5랭크): 경도 15.강화(7랭크): 경...",
    "desc": "<strong>지속 시간:</strong> 다음 턴 시작까지<br>마법의 힘으로 된 방패를 만듭니다. 다음 턴 시작까지 AC에 <strong>+1 상황 보너스</strong>를 얻습니다. {{feat:Shield Block}} 반응이 있으면, 이 마법 방패로도 사용할 수 있습니다. 경도 5이며, 이 방식으로 피해를 받으면 주문이 종료되고 <strong>10분간 방패를 다시 시전할 수 없습니다</strong>.<br><strong>강화(3랭크):</strong> 경도 10.<br><strong>강화(5랭크):</strong> 경도 15.<br><strong>강화(7랭크):</strong> 경도 20.<br><strong>강화(9랭크):</strong> 경도 25."
  },
  {
    "id": "shroud-of-night",
    "name_ko": "밤의 장막",
    "name_en": "Shroud of Night",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "다양"
    ],
    "actions": "1행동",
    "traits": [
      "어둠",
      "위치"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "1라운드",
    "summary": "어둠의 장막으로 적의 시야를 방해합니다. 의지 실패 시 대상이 현혹됨(dazzled)(1라운드). 대실패 시 현혹됨(1분).",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1라운드<br>어둠의 장막으로 적의 시야를 방해합니다. 의지 실패 시 대상이 <strong>{{condition:Dazzled}}</strong>(1라운드). 대실패 시 현혹됨(1분)."
  },
  {
    "id": "sigil",
    "name_ko": "인장",
    "name_en": "Sigil",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "생물 또는 물체 1",
    "duration": "무제한(아래 참조)",
    "summary": "1제곱인치 크기의 작은 마법 표시를 남깁니다. 가시적이거나 비가시적으로 만들 수 있으며, 상호작용 행동으로 전환 가능합니다. 문질러서 5분이면 지울 수 있습니다. 생물에 새기면 1주에 걸쳐 서서히 사라집니다.강화(3랭크): 1개월 후 사라짐. 강화(5랭크): 1년 후 사라짐. 강화(7랭크): 절대 사라지지 않음.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 또는 물체 1<br><strong>지속 시간:</strong> 무제한(아래 참조)<br>1제곱인치 크기의 작은 마법 표시를 남깁니다. 가시적이거나 비가시적으로 만들 수 있으며, 상호작용 행동으로 전환 가능합니다. 문질러서 5분이면 지울 수 있습니다. 생물에 새기면 1주에 걸쳐 서서히 사라집니다.<br><strong>강화(3랭크):</strong> 1개월 후 사라짐. <strong>강화(5랭크):</strong> 1년 후 사라짐. <strong>강화(7랭크):</strong> 절대 사라지지 않음."
  },
  {
    "id": "song-of-strength",
    "name_ko": "힘의 노래",
    "name_en": "Song of Strength",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "1행동",
    "traits": [
      "비일상",
      "바드",
      "작곡",
      "감정",
      "정신"
    ],
    "area": "60피트 발산",
    "duration": "1라운드",
    "summary": "뮤즈: 전사(warrior)힘찬 격려로 아군의 물리적 힘을 북돋웁니다. 당신과 아군은 운동(Athletics) 판정과, 무장 해제(Disarm), 재배치(Reposition), 밀기(Shove), 넘어뜨리기(Trip) 같은 운동 기술 행동에 대한 DC에 +1 상태 보너스를 얻습니다.",
    "desc": "<strong>영역:</strong> 60피트 발산<br><strong>지속 시간:</strong> 1라운드<br><strong>뮤즈:</strong> 전사(warrior)<br>힘찬 격려로 아군의 물리적 힘을 북돋웁니다. 당신과 아군은 운동(Athletics) 판정과, 무장 해제(Disarm), 재배치(Reposition), 밀기(Shove), 넘어뜨리기(Trip) 같은 운동 기술 행동에 대한 DC에 <strong>+1 상태 보너스</strong>를 얻습니다."
  },
  {
    "id": "stabilize",
    "name_ko": "안정",
    "name_en": "Stabilize",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "치유",
      "조작",
      "활력"
    ],
    "range": "30피트",
    "target": "빈사(dying) 상태의 생물 1",
    "summary": "대상이 빈사 상태를 잃지만 0 HP에서 무의식 상태로 남습니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> {{condition:Dying}} 상태의 생물 1<br>대상이 빈사 상태를 잃지만 0 HP에서 무의식 상태로 남습니다."
  },
  {
    "id": "stoke-the-heart",
    "name_ko": "심장 격려",
    "name_en": "Stoke the Heart",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "다양"
    ],
    "actions": "1행동",
    "traits": [
      "감정",
      "위치"
    ],
    "range": "30피트",
    "target": "아군 1",
    "duration": "1라운드",
    "summary": "아군의 심장에 불을 지펴 전투 의지를 북돋웁니다. 대상이 피해 굴림에 +2 상태 보너스.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 아군 1<br><strong>지속 시간:</strong> 1라운드<br>아군의 심장에 불을 지펴 전투 의지를 북돋웁니다. 대상이 피해 굴림에 <strong>+2 상태 보너스</strong>."
  },
  {
    "id": "summon-instrument",
    "name_ko": "악기 소환",
    "name_en": "Summon Instrument",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "duration": "1시간",
    "summary": "손에 들 수 있는 악기 하나를 물질화합니다. 해당 유형에 전형적인 악기입니다. 다시 시전하면 이전 악기가 사라집니다.강화(5랭크): 명인용(virtuoso) 손에 든 악기.",
    "desc": "<strong>지속 시간:</strong> 1시간<br>손에 들 수 있는 악기 하나를 물질화합니다. 해당 유형에 전형적인 악기입니다. 다시 시전하면 이전 악기가 사라집니다.<br><strong>강화(5랭크):</strong> 명인용(virtuoso) 손에 든 악기."
  },
  {
    "id": "tangle-vine",
    "name_ko": "덩굴 묶기",
    "name_en": "Tangle Vine",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "공격",
      "조작",
      "식물"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "AC",
    "summary": "덩굴을 소환하여 적을 얽어맵니다. 주문 명중 굴림을 합니다.대성공: 대상은 이동 불가(immobilized)가 되고 이동 속도에 -10피트 상황 페널티를 받습니다(1라운드). 주문 DC에 대해 탈출 가능.성공: 이동 속도에 -10피트 상황 페널티(1라운드). 탈출 가능.실패: 영향 없음.강화(2랭크): 효과가 2라운드 지속.강화(4랭크): 효과가 1분...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> AC<br>덩굴을 소환하여 적을 얽어맵니다. 주문 명중 굴림을 합니다.<br><strong>대성공:</strong> 대상은 {{condition:Immobilized}}가 되고 이동 속도에 -10피트 상황 페널티를 받습니다(1라운드). 주문 DC에 대해 탈출 가능.<br><strong>성공:</strong> 이동 속도에 -10피트 상황 페널티(1라운드). 탈출 가능.<br><strong>실패:</strong> 영향 없음.<br><strong>강화(2랭크):</strong> 효과가 2라운드 지속.<br><strong>강화(4랭크):</strong> 효과가 1분 지속."
  },
  {
    "id": "telekinetic-hand",
    "name_ko": "염동 손",
    "name_en": "Telekinetic Hand",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "비고정, 무인 물체 1(경량 부피 이하)",
    "duration": "유지",
    "summary": "떠다니는 마법의 손으로 물체를 움직입니다. 유지 시 물체를 20피트 이동시킬 수 있습니다(어떤 방향이든). 물체를 공격에 사용할 수 없습니다.강화(3랭크): 1 부피 이하의 물체를 움직일 수 있습니다.강화(5랭크): 사거리 60피트, 1 부피까지.강화(7랭크): 사거리 60피트, 2 부피까지.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 비고정, 무인 물체 1(경량 부피 이하)<br><strong>지속 시간:</strong> 유지<br>떠다니는 마법의 손으로 물체를 움직입니다. 유지 시 물체를 20피트 이동시킬 수 있습니다(어떤 방향이든). 물체를 공격에 사용할 수 없습니다.<br><strong>강화(3랭크):</strong> 1 부피 이하의 물체를 움직일 수 있습니다.<br><strong>강화(5랭크):</strong> 사거리 60피트, 1 부피까지.<br><strong>강화(7랭크):</strong> 사거리 60피트, 2 부피까지."
  },
  {
    "id": "telekinetic-projectile",
    "name_ko": "염동 투사",
    "name_en": "Telekinetic Projectile",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "AC",
    "summary": "1 부피 이하의 비고정 물체를 염동력으로 발사하여 적에게 날립니다. AC에 대한 주문 명중 굴림을 합니다. 성공 시 2d6 둔기, 관통, 또는 참격 피해(발사한 물체에 적합한 유형)를 가합니다. 물체의 특수 특성이나 마법 속성은 적용되지 않습니다.강화(+1): 피해 +1d6.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> AC<br>1 부피 이하의 비고정 물체를 염동력으로 발사하여 적에게 날립니다. AC에 대한 주문 명중 굴림을 합니다. 성공 시 <strong>2d6 둔기, 관통, 또는 참격 피해</strong>(발사한 물체에 적합한 유형)를 가합니다. 물체의 특수 특성이나 마법 속성은 적용되지 않습니다.<br><strong>강화(+1):</strong> 피해 +1d6."
  },
  {
    "id": "uplifting-overture",
    "name_ko": "고양 서곡",
    "name_en": "Uplifting Overture",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "1행동",
    "traits": [
      "비일상",
      "바드",
      "작곡",
      "감정",
      "정신"
    ],
    "range": "30피트",
    "target": "아군 1",
    "duration": "1라운드",
    "summary": "뮤즈: 마에스트로(maestro)연주로 아군이 무엇이든 성공할 수 있다는 느낌을 줍니다. 이것은 당신이 선택한 기술 판정에 대해 아군을 지원(Aid) 준비한 것으로 간주됩니다. 이후 지원(Aid) 반응을 사용할 때 일반 기술 판정 대신 공연(Performance)을 굴릴 수 있으며, 실패를 굴려도 성공으로 취급합니다. 공연이 전설이면 자동으로 대성공입...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 아군 1<br><strong>지속 시간:</strong> 1라운드<br><strong>뮤즈:</strong> 마에스트로(maestro)<br>연주로 아군이 무엇이든 성공할 수 있다는 느낌을 줍니다. 이것은 당신이 선택한 기술 판정에 대해 아군을 <strong>지원(Aid) 준비</strong>한 것으로 간주됩니다. 이후 지원(Aid) 반응을 사용할 때 일반 기술 판정 대신 <strong>공연(Performance)</strong>을 굴릴 수 있으며, 실패를 굴려도 <strong>성공으로 취급</strong>합니다. 공연이 전설이면 <strong>자동으로 대성공</strong>입니다.<br>GM은 아군을 격려하는 행위가 기술 판정과 간섭할 경우(조용히 은신하거나 변장을 유지하는 등) 이 능력을 사용할 수 없다고 판정할 수 있습니다."
  },
  {
    "id": "vitality-lash",
    "name_ko": "활력 채찍",
    "name_en": "Vitality Lash",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "활력"
    ],
    "range": "30피트",
    "target": "언데드 또는 공허 치유를 가진 생물 1",
    "defense": "기본 인내",
    "summary": "활력 에너지로 채찍질합니다. 2d6 활력 피해(기본 인내). 대실패 시 다음 턴 시작까지 약화(enfeebled) 1도 받습니다.강화(+1): 피해 +1d6.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 언데드 또는 공허 치유를 가진 생물 1<br><strong>방어:</strong> 기본 인내<br>활력 에너지로 채찍질합니다. <strong>2d6 활력 피해</strong>(기본 인내). 대실패 시 다음 턴 시작까지 <strong>{{condition:Enfeebled}} 1</strong>도 받습니다.<br><strong>강화(+1):</strong> 피해 +1d6."
  },
  {
    "id": "void-warp",
    "name_ko": "공허 왜곡",
    "name_en": "Void Warp",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "공허"
    ],
    "range": "30피트",
    "target": "살아있는 생물 1",
    "defense": "기본 인내",
    "summary": "공허 에너지로 산 것을 피해입히고 약화시킵니다. 2d4 공허 피해(기본 인내). 대실패 시 다음 턴 시작까지 약화(enfeebled) 1도 받습니다.강화(+1): 피해 +1d4.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 살아있는 생물 1<br><strong>방어:</strong> 기본 인내<br>공허 에너지로 산 것을 피해입히고 약화시킵니다. <strong>2d4 공허 피해</strong>(기본 인내). 대실패 시 다음 턴 시작까지 <strong>{{condition:Enfeebled}} 1</strong>도 받습니다.<br><strong>강화(+1):</strong> 피해 +1d4."
  },
  {
    "id": "wilding-word",
    "name_ko": "야생의 말",
    "name_en": "Wilding Word",
    "rank": 1,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "1행동",
    "traits": [
      "드루이드"
    ],
    "range": "30피트",
    "target": "동물 또는 식물 1",
    "summary": "자연 생물에게 간단한 메시지를 전달합니다. 복잡한 개념은 전달할 수 없지만, 기본적인 의도(위험, 안전, 먹이 등)를 전달할 수 있습니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 동물 또는 식물 1<br>자연 생물에게 간단한 메시지를 전달합니다. 복잡한 개념은 전달할 수 없지만, 기본적인 의도(위험, 안전, 먹이 등)를 전달할 수 있습니다."
  },
  {
    "id": "rallying-anthem",
    "name_ko": "결집의 찬가",
    "name_en": "Rallying Anthem",
    "rank": 2,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "1행동",
    "traits": [
      "청각",
      "바드",
      "작곡",
      "감정",
      "정신"
    ],
    "area": "60피트 발산",
    "duration": "1라운드",
    "summary": "아군이 더 효과적으로 자신을 보호하도록 돕는 노래를 부릅니다. 당신과 영역 내 모든 아군은 AC와 내성 굴림에 +1 상태 보너스를 얻으며, 주문 랭크의 절반과 동일한 물리 피해 저항도 얻습니다.",
    "desc": "<strong>영역:</strong> 60피트 발산<br><strong>지속 시간:</strong> 1라운드<br>아군이 더 효과적으로 자신을 보호하도록 돕는 노래를 부릅니다. 당신과 영역 내 모든 아군은 AC와 내성 굴림에 <strong>+1 상태 보너스</strong>를 얻으며, 주문 랭크의 절반과 동일한 <strong>물리 피해 저항</strong>도 얻습니다."
  },
  {
    "id": "triple-time",
    "name_ko": "세 박자",
    "name_en": "Triple Time",
    "rank": 2,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "1행동",
    "traits": [
      "비일상",
      "바드",
      "작곡",
      "감정",
      "조작",
      "정신"
    ],
    "area": "60피트 발산",
    "duration": "1라운드",
    "summary": "빠른 박자를 설정합니다. 당신과 영역 내 모든 아군은 1라운드 동안 모든 이동 속도에 +10피트 상태 보너스를 얻습니다.",
    "desc": "<strong>영역:</strong> 60피트 발산<br><strong>지속 시간:</strong> 1라운드<br>빠른 박자를 설정합니다. 당신과 영역 내 모든 아군은 1라운드 동안 모든 이동 속도에 <strong>+10피트 상태 보너스</strong>를 얻습니다."
  },
  {
    "id": "dirge-of-doom",
    "name_ko": "파멸의 만가",
    "name_en": "Dirge of Doom",
    "rank": 3,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "1행동",
    "traits": [
      "청각",
      "바드",
      "작곡",
      "감정",
      "공포",
      "정신"
    ],
    "area": "30피트 발산",
    "duration": "1라운드",
    "summary": "영역 내 적은 공포(frightened) 1이 됩니다. 영역 내에 남아 있는 동안 공포 수치를 1 미만으로 줄일 수 없습니다.",
    "desc": "<strong>영역:</strong> 30피트 발산<br><strong>지속 시간:</strong> 1라운드<br>영역 내 적은 <strong>{{condition:Frightened}} 1</strong>이 됩니다. 영역 내에 남아 있는 동안 공포 수치를 <strong>1 미만으로 줄일 수 없습니다</strong>."
  },
  {
    "id": "song-of-marching",
    "name_ko": "행군의 노래",
    "name_en": "Song of Marching",
    "rank": 3,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "1행동",
    "traits": [
      "비일상",
      "바드",
      "작곡",
      "정신"
    ],
    "area": "60피트 발산",
    "duration": "유지(최대 1시간)",
    "summary": "아군의 이동을 유지하는 경쾌한 연주를 합니다. 당신과 영역 내 아군은 주문 지속 시간 동안 다른 탐험 활동에 추가하여 급행군(Hustle)을 할 수 있습니다(당신의 탐험 활동은 이 주문의 유지입니다). 이후 당신과 아군은 1일간 일시 면역이 됩니다.이 노래를 연주하는 중에 전투에 돌입하면, 우선권 굴림에 공연 수정치를 사용할 수 있습니다. 당신과 영향...",
    "desc": "<strong>영역:</strong> 60피트 발산<br><strong>지속 시간:</strong> 유지(최대 1시간)<br>아군의 이동을 유지하는 경쾌한 연주를 합니다. 당신과 영역 내 아군은 주문 지속 시간 동안 다른 탐험 활동에 추가하여 <strong>급행군(Hustle)</strong>을 할 수 있습니다(당신의 탐험 활동은 이 주문의 유지입니다). 이후 당신과 아군은 <strong>1일간 일시 면역</strong>이 됩니다.<br>이 노래를 연주하는 중에 전투에 돌입하면, 우선권 굴림에 <strong>공연 수정치</strong>를 사용할 수 있습니다. 당신과 영향받은 아군은 해당 우선권 굴림에 <strong>+1 상태 보너스</strong>도 받습니다.<br><strong>강화(6랭크):</strong> 최대 2시간까지 유지 가능.<br><strong>강화(9랭크):</strong> 최대 4시간까지 유지 가능."
  },
  {
    "id": "house-of-imaginary-walls",
    "name_ko": "상상의 벽 집",
    "name_en": "House of Imaginary Walls",
    "rank": 5,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "arcane"
    ],
    "actions": "1행동",
    "traits": [
      "환영",
      "조작",
      "시각",
      "위저드"
    ],
    "range": "30피트",
    "duration": "1라운드",
    "summary": "보이지 않는 힘의 벽을 만들어 적의 이동을 방해합니다. 10피트×10피트 벽을 세워 불신하지 않은 생물은 통과할 수 없다고 믿습니다(지각 판정으로 불신 가능).",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 1라운드<br>보이지 않는 힘의 벽을 만들어 적의 이동을 방해합니다. 10피트×10피트 벽을 세워 불신하지 않은 생물은 통과할 수 없다고 믿습니다(지각 판정으로 불신 가능)."
  },
  {
    "id": "allegro",
    "name_ko": "알레그로",
    "name_en": "Allegro",
    "rank": 7,
    "is_cantrip": true,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "1행동",
    "traits": [
      "비일상",
      "바드",
      "작곡",
      "감정",
      "정신"
    ],
    "range": "30피트",
    "target": "아군 1",
    "duration": "1라운드",
    "summary": "빠르게 연주하여 아군의 속도를 높입니다. 대상은 가속(quickened) 상태가 되어 추가 행동을 얻으며, 이 추가 행동은 타격(Strike), 보폭(Stride), 또는 걸음(Step)에만 사용할 수 있습니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 아군 1<br><strong>지속 시간:</strong> 1라운드<br>빠르게 연주하여 아군의 속도를 높입니다. 대상은 <strong>{{condition:Quickened}}</strong> 상태가 되어 추가 행동을 얻으며, 이 추가 행동은 <strong>타격(Strike), 보폭(Stride), 또는 걸음(Step)</strong>에만 사용할 수 있습니다."
  },
  {
    "id": "agile-feet",
    "name_ko": "민첩한 발",
    "name_en": "Agile Feet",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "조작"
    ],
    "duration": "현재 턴 종료까지",
    "summary": "신의 축복이 발을 빠르게 합니다. 이동 속도에 +5피트 상태 보너스+험지 무시. 시전의 일부로 한 걸음(Step)/보폭(Stride)/통과(Tumble Through) 가능. 적절한 속도가 있으면 굴파기/등반/비행/수영도 가능.",
    "desc": "<strong>지속 시간:</strong> 현재 턴 종료까지<br>신의 축복이 발을 빠르게 합니다. 이동 속도에 <strong>+5피트 상태 보너스</strong>+<strong>험지 무시</strong>. 시전의 일부로 한 걸음(Step)/보폭(Stride)/통과(Tumble Through) 가능. 적절한 속도가 있으면 굴파기/등반/비행/수영도 가능."
  },
  {
    "id": "athletic-rush",
    "name_ko": "운동 돌진",
    "name_en": "Athletic Rush",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "조작"
    ],
    "duration": "1라운드",
    "summary": "물리적 힘과 기술이 충만합니다. 이동 속도에 +10피트 상태 보너스+운동 판정에 +2 상태 보너스. 시전의 일부로 보폭/도약/등반/수영 가능.",
    "desc": "<strong>지속 시간:</strong> 1라운드<br>물리적 힘과 기술이 충만합니다. 이동 속도에 <strong>+10피트 상태 보너스</strong>+운동 판정에 <strong>+2 상태 보너스</strong>. 시전의 일부로 보폭/도약/등반/수영 가능."
  },
  {
    "id": "bit-of-luck",
    "name_ko": "행운의 한 조각",
    "name_en": "Bit of Luck",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "행운"
    ],
    "range": "30피트",
    "target": "동의 생물 1",
    "duration": "1라운드",
    "summary": "대상의 다음 판정(공격, 기술, 내성)에서 d20을 두 번 굴려 높은 것을 사용합니다. 사용 후 주문 종료.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 동의 생물 1<br><strong>지속 시간:</strong> 1라운드<br>대상의 다음 판정(공격, 기술, 내성)에서 <strong>d20을 두 번 굴려 높은 것</strong>을 사용합니다. 사용 후 주문 종료."
  },
  {
    "id": "cackle",
    "name_ko": "킥킥",
    "name_en": "Cackle",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "자유 행동",
    "traits": [
      "위치"
    ],
    "summary": "악랄한 웃음으로 유지 중인 주문을 자유 행동으로 유지합니다. 이번 턴에 유지(Sustain) 행동 대신 이것을 사용하여 1개의 주문을 유지할 수 있습니다.",
    "desc": "악랄한 웃음으로 유지 중인 주문을 자유 행동으로 유지합니다. 이번 턴에 유지(Sustain) 행동 대신 이것을 사용하여 1개의 주문을 유지할 수 있습니다."
  },
  {
    "id": "charming-push",
    "name_ko": "매혹의 밀침",
    "name_en": "Charming Push",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "무력화",
      "정신",
      "위저드"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "다음 턴 시작까지",
    "summary": "대상의 마음을 밀어 적의를 꺾습니다. 대상은 의지 내성을 시도합니다.대성공: 영향 없음.성공: 대상은 당신에 대한 명중 굴림과 피해 굴림에 -1 상황 페널티를 받습니다.실패: 대상은 당신에 대해 적대적 행동을 사용할 수 없습니다.대실패: 대상은 기절(stunned) 1이 되고 당신에 대해 적대적 행동을 사용할 수 없습니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 다음 턴 시작까지<br>대상의 마음을 밀어 적의를 꺾습니다. 대상은 의지 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 대상은 당신에 대한 명중 굴림과 피해 굴림에 <strong>-1 상황 페널티</strong>를 받습니다.<br><strong>실패:</strong> 대상은 당신에 대해 적대적 행동을 사용할 수 없습니다.<br><strong>대실패:</strong> 대상은 <strong>{{condition:Stunned}} 1</strong>이 되고 당신에 대해 적대적 행동을 사용할 수 없습니다."
  },
  {
    "id": "charming-touch",
    "name_ko": "매혹의 손길",
    "name_en": "Charming Touch",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "비일상",
      "클레릭",
      "감정",
      "무력화",
      "조작",
      "정신"
    ],
    "range": "접촉",
    "target": "당신에게 매력을 느낄 수 있는 생물 1",
    "defense": "의지",
    "duration": "10분",
    "summary": "대상에게 매혹을 불어넣어 당신에게 더 친근하게 행동하게 만듭니다. 대상은 의지 내성을 시도합니다. 최근 당신이나 아군에게 위협받거나 적대시된 적이 있다면 이 내성에 +4 상황 보너스를 얻습니다.대성공: 대상은 영향 없음이며 당신이 매혹을 시도했음을 인지합니다.성공: 대상은 영향 없지만 주문이 무해한 것으로 생각합니다(주문 감정, 303페이지 참조).실...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 당신에게 매력을 느낄 수 있는 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 10분<br>대상에게 매혹을 불어넣어 당신에게 더 친근하게 행동하게 만듭니다. 대상은 의지 내성을 시도합니다. 최근 당신이나 아군에게 위협받거나 적대시된 적이 있다면 이 내성에 <strong>+4 상황 보너스</strong>를 얻습니다.<br><strong>대성공:</strong> 대상은 영향 없음이며 당신이 매혹을 시도했음을 인지합니다.<br><strong>성공:</strong> 대상은 영향 없지만 주문이 무해한 것으로 생각합니다(주문 감정, 303페이지 참조).<br><strong>실패:</strong> 대상의 태도가 당신에게 <strong>{{condition:Friendly}}</strong>이 됩니다. 이미 우호적이었다면 <strong>{{condition:Helpful}}</strong>이 됩니다. 당신에 대한 적대 행동에 사용할 수 없습니다. 당신이 대상에 대해 적대 행동을 사용하면 주문이 종료됩니다. 주문을 해제(Dismiss)할 수 있으며, 종료 후에도 대상이 매혹당했음을 반드시 인지하지는 않습니다(기대에 어긋나는 행동을 요구하지 않은 경우).<br><strong>대실패:</strong> 실패와 같지만, 대상은 {{condition:Helpful}}이 됩니다."
  },
  {
    "id": "cloak-of-shadow",
    "name_ko": "어둠의 망토",
    "name_en": "Cloak of Shadow",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "비일상",
      "오라",
      "클레릭",
      "어둠",
      "조작",
      "그림자"
    ],
    "range": "접촉",
    "target": "동의 생물 1",
    "duration": "1분",
    "summary": "대상을 소용돌이치는 그림자의 망토로 감쌉니다. 대상을 보기 어렵게 만듭니다. 망토는 20피트 발산 내의 밝은 빛을 희미한 빛으로 줄입니다. 이것은 마법적 어둠의 한 형태이므로 431페이지에 설명된 대로 비마법적 빛을 극복하거나 마법적 빛을 상쇄할 수 있습니다.대상은 그림자에서 얻은 은폐(concealed) 상태를 사용하여 숨기(Hide)를 할 수 있지...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의 생물 1<br><strong>지속 시간:</strong> 1분<br>대상을 소용돌이치는 그림자의 망토로 감쌉니다. 대상을 보기 어렵게 만듭니다. 망토는 20피트 발산 내의 밝은 빛을 희미한 빛으로 줄입니다. 이것은 마법적 어둠의 한 형태이므로 431페이지에 설명된 대로 비마법적 빛을 극복하거나 마법적 빛을 상쇄할 수 있습니다.<br>대상은 그림자에서 얻은 {{condition:Concealed}} 상태를 사용하여 숨기(Hide)를 할 수 있지만, 주의 깊은 관찰자는 여전히 움직이는 그림자 기운을 따라갈 수 있어 완전히 미탐지 상태가 되기는 어렵습니다. 대상은 상호작용(Interact) 행동으로 망토를 벗어 미끼로 남겨둘 수 있으며, 망토는 남은 주문 지속 시간 동안 빛을 줄입니다. 망토가 벗겨진 후 누군가 주우면 원래 대상에게서 제거된 것이므로 망토는 증발하고 주문이 종료됩니다."
  },
  {
    "id": "cornucopia",
    "name_ko": "축제의 뿔피리",
    "name_en": "Cornucopia",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "조작",
      "식물"
    ],
    "range": "30피트",
    "area": "10피트 폭발",
    "summary": "풍요의 뿔에서 음식이 쏟아집니다. 영역 내 아군이 1d4+4 HP 회복하고 1일 영양분 섭취.강화(+1): 회복 +1d4.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>영역:</strong> 10피트 폭발<br>풍요의 뿔에서 음식이 쏟아집니다. 영역 내 아군이 <strong>1d4+4 HP 회복</strong>하고 1일 영양분 섭취.<br><strong>강화(+1):</strong> 회복 +1d4."
  },
  {
    "id": "counter-performance",
    "name_ko": "대항 공연",
    "name_en": "Counter Performance",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "비일상",
      "바드",
      "작곡",
      "행운",
      "정신"
    ],
    "area": "60피트 발산",
    "trigger": "당신 또는 60피트 이내 아군이 청각 또는 시각 효과에 대한 내성 굴림을 시도할 때",
    "summary": "공연으로 당신과 아군을 보호합니다. 알고 있는 유형의 공연(Performance) 판정을 굴립니다 — 유발 조건이 청각이면 청각 공연, 시각이면 시각 공연이어야 하며, 이 행동은 해당 공연 유형의 특성을 얻습니다. 당신과 영역 내 아군은 공연 판정 결과와 내성 굴림 중 더 좋은 결과를 사용할 수 있습니다.",
    "desc": "<strong>영역:</strong> 60피트 발산<br><strong>유발 조건:</strong> 당신 또는 60피트 이내 아군이 청각 또는 시각 효과에 대한 내성 굴림을 시도할 때<br>공연으로 당신과 아군을 보호합니다. 알고 있는 유형의 공연(Performance) 판정을 굴립니다 — 유발 조건이 청각이면 청각 공연, 시각이면 시각 공연이어야 하며, 이 행동은 해당 공연 유형의 특성을 얻습니다. 당신과 영역 내 아군은 공연 판정 결과와 내성 굴림 중 <strong>더 좋은 결과</strong>를 사용할 수 있습니다."
  },
  {
    "id": "creative-splash",
    "name_ko": "창의적 물감",
    "name_en": "Creative Splash",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "summary": "당신의 개인적 창작 전문 분야를 반영하는 물감이나 다채로운 환영의 홍수가 영역에 쏟아집니다. 1d4를 굴려 환영의 색을 결정합니다. 영역 내 각 생물은 의지 내성에 성공하거나, 해당 색의 효과를 받아야 합니다.1 하양: 실패 시 현혹됨 1라운드 / 대실패 시 현혹됨 1분.2 빨강: 실패 시 약화 1 (1라운드) / 대실패 시 약화 2 (1라운드).3 ...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br>당신의 개인적 창작 전문 분야를 반영하는 물감이나 다채로운 환영의 홍수가 영역에 쏟아집니다. 1d4를 굴려 환영의 색을 결정합니다. 영역 내 각 생물은 의지 내성에 성공하거나, 해당 색의 효과를 받아야 합니다.<br><strong>1 하양:</strong> 실패 시 현혹됨 1라운드 / 대실패 시 현혹됨 1분.<br><strong>2 빨강:</strong> 실패 시 약화 1 (1라운드) / 대실패 시 약화 2 (1라운드).<br><strong>3 노랑:</strong> 실패 시 공포 1 / 대실패 시 공포 2.<br><strong>4 파랑:</strong> 실패 시 서투름 1 (1라운드) / 대실패 시 서투름 2 (1라운드)."
  },
  {
    "id": "cry-of-destruction",
    "name_ko": "파괴의 울부짖음",
    "name_en": "Cry of Destruction",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "조작",
      "음파"
    ],
    "area": "15피트 원뿔",
    "defense": "기본 인내",
    "summary": "목소리가 쿵 울려 앞에 있는 것을 부수어 버립니다. 영역 내 각 생물과 주인 없는 물체는 1d8 음파 피해를 받습니다(기본 인내). 이 턴에 이미 타격(Strike)이나 주문으로 적에게 피해를 준 적이 있다면, 이 주문의 피해 주사위가 d12로 증가합니다.강화(+1): 피해 +1d8.",
    "desc": "<strong>영역:</strong> 15피트 원뿔<br><strong>방어:</strong> 기본 인내<br>목소리가 쿵 울려 앞에 있는 것을 부수어 버립니다. 영역 내 각 생물과 주인 없는 물체는 <strong>1d8 음파 피해</strong>를 받습니다(기본 인내). 이 턴에 이미 타격(Strike)이나 주문으로 적에게 피해를 준 적이 있다면, 이 주문의 피해 주사위가 <strong>d12</strong>로 증가합니다.<br><strong>강화(+1):</strong> 피해 +1d8."
  },
  {
    "id": "dazzling-flash",
    "name_ko": "눈부신 섬광",
    "name_en": "Dazzling Flash",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "빛",
      "조작",
      "시각"
    ],
    "area": "15피트 원뿔",
    "defense": "인내",
    "summary": "종교 상징을 들어올려 눈부신 빛의 섬광을 만듭니다.대성공: 영향 없음. 성공: 현혹됨 1라운드. 실패: 실명 1라운드+현혹됨 1분. 대실패: 실명 1라운드+현혹됨 1시간.강화(3랭크): 영역 30피트 원뿔.",
    "desc": "<strong>영역:</strong> 15피트 원뿔<br><strong>방어:</strong> 인내<br>종교 상징을 들어올려 눈부신 빛의 섬광을 만듭니다.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 현혹됨 1라운드. <strong>실패:</strong> 실명 1라운드+현혹됨 1분. <strong>대실패:</strong> 실명 1라운드+현혹됨 1시간.<br><strong>강화(3랭크):</strong> 영역 30피트 원뿔."
  },
  {
    "id": "deaths-call",
    "name_ko": "죽음의 부름",
    "name_en": "Death's Call",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "비일상",
      "클레릭"
    ],
    "duration": "1분",
    "trigger": "20피트 이내의 살아있는 생물이 죽거나, 20피트 이내의 언데드가 파괴됨",
    "summary": "이 세상에서 또 다른 존재가 떠남으로써 당신에게 활력이 솟습니다. 유발 생물의 레벨 + 당신의 주문시전 능력치 수정치에 해당하는 임시 HP를 얻습니다. 유발 생물이 언데드였다면 얻는 임시 HP가 2배가 됩니다. 이 임시 HP는 주문 지속 시간 동안 유지되며, 모든 임시 HP가 소진되면 주문이 조기 종료됩니다.",
    "desc": "<strong>지속 시간:</strong> 1분<br><strong>유발 조건:</strong> 20피트 이내의 살아있는 생물이 죽거나, 20피트 이내의 언데드가 파괴됨<br>이 세상에서 또 다른 존재가 떠남으로써 당신에게 활력이 솟습니다. 유발 생물의 레벨 + 당신의 주문시전 능력치 수정치에 해당하는 <strong>임시 HP</strong>를 얻습니다. 유발 생물이 언데드였다면 얻는 임시 HP가 <strong>2배</strong>가 됩니다. 이 임시 HP는 주문 지속 시간 동안 유지되며, 모든 임시 HP가 소진되면 주문이 조기 종료됩니다."
  },
  {
    "id": "earthworks",
    "name_ko": "대지 공사",
    "name_en": "Earthworks",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "대지",
      "클레릭",
      "조작"
    ],
    "range": "120피트",
    "area": "10피트 정육면체",
    "summary": "대지를 솟구치게 하거나 함몰시킵니다. 영역을 험지로 만들거나, 기존 험지를 정상 지형으로 변환합니다.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 10피트 정육면체<br>대지를 솟구치게 하거나 함몰시킵니다. 영역을 <strong>험지</strong>로 만들거나, 기존 험지를 정상 지형으로 변환합니다."
  },
  {
    "id": "elemental-betrayal",
    "name_ko": "정령의 배신",
    "name_en": "Elemental Betrayal",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭"
    ],
    "duration": "유지(최대 1분)",
    "summary": "30피트 발산 내 적이 정령 특성의 효과에 피해를 받을 때 추가 2 피해.강화(+1): 추가 피해 +2.",
    "desc": "<strong>지속 시간:</strong> 유지(최대 1분)<br>30피트 발산 내 적이 정령 특성의 효과에 피해를 받을 때 <strong>추가 2 피해</strong>.<br><strong>강화(+1):</strong> 추가 피해 +2."
  },
  {
    "id": "face-in-the-crowd",
    "name_ko": "군중 속의 얼굴",
    "name_en": "Face in the Crowd",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "조작",
      "시각"
    ],
    "duration": "1분",
    "summary": "비슷한 생물의 군중 속에서 외모가 무난하고 눈에 띄지 않게 됩니다. 기만/은신에 +2 상태 보너스. 군중에 의한 험지 무시.강화(3랭크): 10피트 사거리, 최대 10 대상.",
    "desc": "<strong>지속 시간:</strong> 1분<br>비슷한 생물의 군중 속에서 외모가 무난하고 눈에 띄지 않게 됩니다. 기만/은신에 <strong>+2 상태 보너스</strong>. 군중에 의한 험지 무시.<br><strong>강화(3랭크):</strong> 10피트 사거리, 최대 10 대상."
  },
  {
    "id": "fire-ray",
    "name_ko": "화염 광선",
    "name_en": "Fire Ray",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "화염",
      "조작"
    ],
    "range": "60피트",
    "target": "생물 또는 물체 1",
    "defense": "AC",
    "summary": "화염 광선을 발사합니다. 주문 명중 굴림. 2d6 화염 피해. 치명 시 1d4 지속 화염 피해.강화(+1): 피해 +1d6, 지속 +1d4.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 생물 또는 물체 1<br><strong>방어:</strong> AC<br>화염 광선을 발사합니다. 주문 명중 굴림. <strong>2d6 화염 피해</strong>. 치명 시 <strong>1d4 지속 화염 피해</strong>.<br><strong>강화(+1):</strong> 피해 +1d6, 지속 +1d4."
  },
  {
    "id": "force-bolt",
    "name_ko": "힘의 화살",
    "name_en": "Force Bolt",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "힘",
      "위저드"
    ],
    "range": "30피트",
    "target": "생물 또는 물체 1",
    "summary": "마법 힘의 화살을 발사합니다. 1d4+1 힘 피해(자동 명중). 힘의 포격(Force Barrage)과 유사하지만 1발만.강화(+2): 피해 +1d4+1.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 또는 물체 1<br>마법 힘의 화살을 발사합니다. <strong>1d4+1 힘 피해</strong>(자동 명중). {{spell:Force Barrage}}과 유사하지만 1발만.<br><strong>강화(+2):</strong> 피해 +1d4+1."
  },
  {
    "id": "fortify-summoning",
    "name_ko": "소환 강화",
    "name_en": "Fortify Summoning",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "위저드"
    ],
    "duration": "1라운드",
    "summary": "소환한 생물을 당신의 마법으로 변형시켜 그 용맹을 높이고 회복력을 강화합니다. 대상은 소환 지속 시간 동안(최대 1분) 모든 판정과 DC(AC 포함)에 +1 상태 보너스를 얻습니다.",
    "desc": "<strong>지속 시간:</strong> 1라운드<br>소환한 생물을 당신의 마법으로 변형시켜 그 용맹을 높이고 회복력을 강화합니다. 대상은 소환 지속 시간 동안(최대 1분) 모든 판정과 DC(AC 포함)에 <strong>+1 상태 보너스</strong>를 얻습니다."
  },
  {
    "id": "gravity-weapon",
    "name_ko": "중력의 무기",
    "name_en": "Gravity Weapon",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [
      "primal"
    ],
    "actions": "1행동",
    "traits": [
      "레인저"
    ],
    "duration": "1라운드",
    "summary": "다음 무기 타격에 추가 피해를 부여합니다. 이 턴에 명중한 첫 번째 타격이 추가 1d6 피해를 줍니다.강화(+1): 추가 피해 +1d6.",
    "desc": "<strong>지속 시간:</strong> 1라운드<br>다음 무기 타격에 추가 피해를 부여합니다. 이 턴에 명중한 첫 번째 타격이 <strong>추가 1d6 피해</strong>를 줍니다.<br><strong>강화(+1):</strong> 추가 피해 +1d6."
  },
  {
    "id": "hand-of-the-apprentice",
    "name_ko": "힘의 손",
    "name_en": "Hand of the Apprentice",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [
      "arcane"
    ],
    "actions": "1행동",
    "traits": [
      "위저드"
    ],
    "range": "500피트",
    "target": "생물 1",
    "defense": "AC",
    "summary": "손에 든 근접 무기를 마법의 힘으로 날려 적을 공격합니다. 주문 명중 굴림(근접 무기 능력치 사용). 명중 시 무기의 정상 피해 + 지능 수정치를 피해에 추가. 무기가 자동으로 돌아옵니다.",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> AC<br>손에 든 근접 무기를 마법의 힘으로 날려 적을 공격합니다. 주문 명중 굴림(근접 무기 능력치 사용). 명중 시 무기의 정상 피해 + 지능 수정치를 피해에 추가. 무기가 자동으로 돌아옵니다."
  },
  {
    "id": "heal-animal",
    "name_ko": "동물 치유",
    "name_en": "Heal Animal",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [
      "primal"
    ],
    "actions": "1행동~2행동",
    "traits": [
      "드루이드",
      "조작",
      "치유",
      "활력"
    ],
    "range": "접촉 또는 30피트(본문 참조)",
    "target": "자발적 동물 1",
    "summary": "동물의 상처를 치유하여 1d8 HP를 회복합니다. 주문 시전에 사용한 행동 수에 따라 효과가 달라집니다.[1행동]: 주문의 사거리가 접촉입니다.[2행동]: 주문의 사거리가 30피트이며, 대상에게 추가로 8 HP를 회복합니다.강화(+1): 치유량이 1d8 증가하고, 2행동 버전의 추가 치유량이 8 증가합니다.",
    "desc": "<strong>사거리:</strong> 접촉 또는 30피트(본문 참조)<br><strong>대상:</strong> 자발적 동물 1<br>동물의 상처를 치유하여 <strong>1d8 HP</strong>를 회복합니다. 주문 시전에 사용한 행동 수에 따라 효과가 달라집니다.<br><strong>[1행동]:</strong> 주문의 사거리가 접촉입니다.<br><strong>[2행동]:</strong> 주문의 사거리가 30피트이며, 대상에게 추가로 <strong>8 HP</strong>를 회복합니다.<br><strong>강화(+1):</strong> 치유량이 1d8 증가하고, 2행동 버전의 추가 치유량이 8 증가합니다."
  },
  {
    "id": "healers-blessing",
    "name_ko": "치유사의 축복",
    "name_en": "Healer's Blessing",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "비일상",
      "클레릭"
    ],
    "range": "30피트",
    "target": "동의하는 살아있는 생물 1",
    "duration": "1분",
    "summary": "당신의 말이 생물에게 활력 에너지와의 강화된 연결을 축복합니다. 대상이 치유 활력 주문으로부터 HP를 회복할 때, 추가로 2 HP를 회복합니다. 대상은 특정 치유 주문에서 처음 HP를 회복할 때에만 추가 HP를 얻으므로, 지속 시간 동안 반복적으로 치유하는 주문은 처음 치유될 때만 추가 HP를 제공합니다.강화(+1): 추가 치유가 2 증가합니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 동의하는 살아있는 생물 1<br><strong>지속 시간:</strong> 1분<br>당신의 말이 생물에게 활력 에너지와의 강화된 연결을 축복합니다. 대상이 치유 활력 주문으로부터 HP를 회복할 때, 추가로 <strong>2 HP</strong>를 회복합니다. 대상은 특정 치유 주문에서 처음 HP를 회복할 때에만 추가 HP를 얻으므로, 지속 시간 동안 반복적으로 치유하는 주문은 처음 치유될 때만 추가 HP를 제공합니다.<br><strong>강화(+1):</strong> 추가 치유가 2 증가합니다."
  },
  {
    "id": "hurtling-stone",
    "name_ko": "투석",
    "name_en": "Hurtling Stone",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "대지",
      "클레릭",
      "조작"
    ],
    "range": "60피트",
    "target": "생물 1",
    "defense": "AC",
    "summary": "돌을 마법으로 날립니다. 주문 명중 굴림. 1d6 둔기 피해.강화(+1): 피해 +1d6.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> AC<br>돌을 마법으로 날립니다. 주문 명중 굴림. <strong>1d6 둔기 피해</strong>.<br><strong>강화(+1):</strong> 피해 +1d6."
  },
  {
    "id": "hymn-of-healing",
    "name_ko": "치유의 찬송",
    "name_en": "Hymn of Healing",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "바드",
      "작곡",
      "치유",
      "조작",
      "활력"
    ],
    "range": "30피트",
    "target": "당신 또는 아군 1",
    "duration": "유지(최대 4라운드)",
    "summary": "영광스러운 노래가 상처를 치유하고 일시적으로 해로움을 막아줍니다. 대상은 빠른 치유 2를 얻습니다. 주문을 시전할 때, 그리고 매 라운드 처음 주문을 유지할 때, 대상은 임시 HP 2를 얻으며, 이 임시 HP는 1라운드 동안 지속됩니다.강화(+1): 빠른 치유 +2, 임시 HP +2.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 당신 또는 아군 1<br><strong>지속 시간:</strong> 유지(최대 4라운드)<br>영광스러운 노래가 상처를 치유하고 일시적으로 해로움을 막아줍니다. 대상은 <strong>빠른 치유 2</strong>를 얻습니다. 주문을 시전할 때, 그리고 매 라운드 처음 주문을 유지할 때, 대상은 <strong>임시 HP 2</strong>를 얻으며, 이 임시 HP는 1라운드 동안 지속됩니다.<br><strong>강화(+1):</strong> 빠른 치유 +2, 임시 HP +2."
  },
  {
    "id": "ignite-ambition",
    "name_ko": "야심 점화",
    "name_en": "Ignite Ambition",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "클레릭",
      "감정",
      "정신",
      "은밀"
    ],
    "range": "60피트",
    "target": "영향받는 생물 1",
    "defense": "의지",
    "trigger": "당신/아군이 정신 효과로 생물을 설득하려 시도",
    "summary": "대상의 야심을 강화하여 충성을 바꾸기 쉽게 합니다. 의지 실패 시 유발 효과에 대한 방어에 -1 상태 페널티(자신의 야심을 추구하는 제안이면 -2). 대실패 시 자기 야심을 추구하는 암시를 자동으로 따릅니다.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 영향받는 생물 1<br><strong>방어:</strong> 의지<br><strong>유발 조건:</strong> 당신/아군이 정신 효과로 생물을 설득하려 시도<br>대상의 야심을 강화하여 충성을 바꾸기 쉽게 합니다. 의지 실패 시 유발 효과에 대한 방어에 <strong>-1 상태 페널티</strong>(자신의 야심을 추구하는 제안이면 -2). 대실패 시 자기 야심을 추구하는 암시를 자동으로 따릅니다."
  },
  {
    "id": "lingering-composition",
    "name_ko": "잔향 작곡",
    "name_en": "Lingering Composition",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [
      "occult"
    ],
    "actions": "자유 행동",
    "traits": [
      "비일상",
      "바드",
      "주문형성"
    ],
    "summary": "뮤즈: 마에스트로(maestro)작곡에 장식을 추가하여 효과를 연장합니다. 다음 행동이 지속 시간 1라운드인 작곡 캔트립 시전이라면, 공연(Performance) 판정을 시도합니다. DC는 보통 작곡 대상 중 가장 높은 레벨과 동일한 표준 난이도 DC이지만, GM이 상황에 따라 다른 DC를 지정할 수 있습니다. 효과는 판정 결과에 따라 달라집니다.대성...",
    "desc": "<strong>뮤즈:</strong> 마에스트로(maestro)<br>작곡에 장식을 추가하여 효과를 연장합니다. 다음 행동이 지속 시간 1라운드인 작곡 캔트립 시전이라면, 공연(Performance) 판정을 시도합니다. DC는 보통 작곡 대상 중 가장 높은 레벨과 동일한 표준 난이도 DC이지만, GM이 상황에 따라 다른 DC를 지정할 수 있습니다. 효과는 판정 결과에 따라 달라집니다.<br><strong>대성공:</strong> 작곡이 <strong>4라운드</strong> 동안 지속됩니다.<br><strong>성공:</strong> 작곡이 <strong>3라운드</strong> 동안 지속됩니다.<br><strong>실패:</strong> 작곡이 1라운드 동안 지속되지만(정상), 이 주문에 집중점을 소비하지 않습니다."
  },
  {
    "id": "loremasters-etude",
    "name_ko": "달인의 에튀드",
    "name_en": "Loremaster's Etude",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "자유 행동",
    "traits": [
      "비일상",
      "바드",
      "행운",
      "조작"
    ],
    "range": "30피트",
    "target": "당신 또는 유발 아군",
    "trigger": "사거리 내 당신 또는 아군이 지식 회상(Recall Knowledge) 기술 판정을 시도할 때",
    "summary": "뮤즈: 수수께끼(enigma)뮤즈의 깊은 신비에 호소하여, 대상에게 더 뛰어난 사고력과 정보 회상 능력을 부여합니다. 유발된 지식 회상 기술 판정을 두 번 굴려 높은 결과를 사용합니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 당신 또는 유발 아군<br><strong>유발 조건:</strong> 사거리 내 당신 또는 아군이 지식 회상(Recall Knowledge) 기술 판정을 시도할 때<br><strong>뮤즈:</strong> 수수께끼(enigma)<br>뮤즈의 깊은 신비에 호소하여, 대상에게 더 뛰어난 사고력과 정보 회상 능력을 부여합니다. 유발된 지식 회상 기술 판정을 <strong>두 번 굴려 높은 결과</strong>를 사용합니다."
  },
  {
    "id": "magic-hide",
    "name_ko": "마법 독",
    "name_en": "Magic Hide",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [
      "primal"
    ],
    "actions": "1행동",
    "traits": [
      "레인저"
    ],
    "range": "접촉",
    "target": "동물 동료",
    "duration": "1분",
    "summary": "동물 동료의 가죽을 마법으로 강화합니다. 동물 동료가 AC에 +2 상태 보너스.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동물 동료<br><strong>지속 시간:</strong> 1분<br>동물 동료의 가죽을 마법으로 강화합니다. 동물 동료가 AC에 <strong>+2 상태 보너스</strong>."
  },
  {
    "id": "magics-vessel",
    "name_ko": "마법의 그릇",
    "name_en": "Magic's Vessel",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "비일상",
      "클레릭",
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "유지(최대 1분)",
    "summary": "생물이 순수한 마법 에너지의 신성한 그릇이 됩니다. 대상은 내성 굴림에 +1 상태 보너스를 얻습니다. 당신이 주문 슬롯에서 주문을 시전할 때마다, 이 주문을 자동으로 유지(Sustain)하고 대상에게 시전한 주문의 랭크와 동일한 주문 피해 저항을 부여합니다. 이 저항은 당신의 다음 턴 시작까지 지속됩니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 유지(최대 1분)<br>생물이 순수한 마법 에너지의 신성한 그릇이 됩니다. 대상은 내성 굴림에 <strong>+1 상태 보너스</strong>를 얻습니다. 당신이 주문 슬롯에서 주문을 시전할 때마다, 이 주문을 자동으로 유지(Sustain)하고 대상에게 시전한 주문의 랭크와 동일한 <strong>주문 피해 저항</strong>을 부여합니다. 이 저항은 당신의 다음 턴 시작까지 지속됩니다."
  },
  {
    "id": "moonbeam",
    "name_ko": "달빛",
    "name_en": "Moonbeam",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "공격",
      "화염",
      "빛",
      "조작"
    ],
    "range": "120피트",
    "target": "생물 1",
    "defense": "반사",
    "summary": "달빛 광선을 발사합니다. 주문 명중 굴림을 합니다. 광선은 2d6 화염 피해를 줍니다. 이 피해는 약점, 저항 등의 목적에서 은 피해로 취급됩니다.대성공: 2배 피해, 대상이 1분 동안 현혹됨.성공: 전체 피해, 대상이 1라운드 동안 현혹됨.강화(+1): 피해 +1d6.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 반사<br>달빛 광선을 발사합니다. 주문 명중 굴림을 합니다. 광선은 <strong>2d6 화염 피해</strong>를 줍니다. 이 피해는 약점, 저항 등의 목적에서 <strong>은 피해</strong>로 취급됩니다.<br><strong>대성공:</strong> 2배 피해, 대상이 <strong>1분</strong> 동안 현혹됨.<br><strong>성공:</strong> 전체 피해, 대상이 <strong>1라운드</strong> 동안 현혹됨.<br><strong>강화(+1):</strong> 피해 +1d6."
  },
  {
    "id": "needle-of-vengeance",
    "name_ko": "복수의 바늘",
    "name_en": "Needle of Vengeance",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "위치",
      "정신"
    ],
    "range": "30피트",
    "target": "유발 적",
    "trigger": "적이 당신이나 아군에게 피해를 줌",
    "summary": "길고 들쭉날쭉한 바늘이 대상 적의 정신을 찌릅니다. 후원자가 특별히 여기는 생물을 공격하려 할 때마다 발동합니다. 자신이나 아군 중 한 명을 지정합니다. 대상이 지정된 생물에 대해 적대 행동을 사용할 때마다 2 정신 피해를 받으며, 기본 의지 내성을 시도합니다.강화(+1): 피해가 2 증가합니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 유발 적<br><strong>유발 조건:</strong> 적이 당신이나 아군에게 피해를 줌<br>길고 들쭉날쭉한 바늘이 대상 적의 정신을 찌릅니다. 후원자가 특별히 여기는 생물을 공격하려 할 때마다 발동합니다. 자신이나 아군 중 한 명을 지정합니다. 대상이 지정된 생물에 대해 적대 행동을 사용할 때마다 <strong>2 정신 피해</strong>를 받으며, 기본 의지 내성을 시도합니다.<br><strong>강화(+1):</strong> 피해가 2 증가합니다."
  },
  {
    "id": "overstuff",
    "name_ko": "방종의 풍요",
    "name_en": "Overstuff",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "인내",
    "summary": "음식으로 과식시킵니다. 인내 실패 시 메스꺼움(sickened) 1. 대실패 시 메스꺼움 2. 이 메스꺼움의 인내 판정에 -2.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br>음식으로 과식시킵니다. 인내 실패 시 <strong>{{condition:Sickened}} 1</strong>. 대실패 시 메스꺼움 2. 이 메스꺼움의 인내 판정에 -2."
  },
  {
    "id": "perfected-mind",
    "name_ko": "완벽한 정신",
    "name_en": "Perfected Mind",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭"
    ],
    "summary": "완벽함에 대해 명상하여 정신의 모든 방해를 제거합니다. 현재 영향받는 정신 효과(의지 내성이 필요했던 것) 하나에 대해 새로운 의지 내성을 시도합니다. 새 결과가 원래보다 나쁘면 변화 없음. 같은 효과에 1회만 사용 가능.",
    "desc": "완벽함에 대해 명상하여 정신의 모든 방해를 제거합니다. 현재 영향받는 정신 효과(의지 내성이 필요했던 것) 하나에 대해 <strong>새로운 의지 내성</strong>을 시도합니다. 새 결과가 원래보다 나쁘면 변화 없음. 같은 효과에 1회만 사용 가능."
  },
  {
    "id": "phase-familiar",
    "name_ko": "사역마 위상",
    "name_en": "Phase Familiar",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "위치"
    ],
    "trigger": "사역마가 피해를 받으려 함",
    "summary": "후원자가 사역마를 잠시 에테르로 되돌려, 단단한 물리적 형태에서 유령 같은 모습으로 바꿉니다. 유발 피해에 대해 사역마는 모든 피해에 저항 5를 얻고 정밀 피해에 면역이 됩니다.강화(+1): 저항이 2 증가합니다.",
    "desc": "<strong>유발 조건:</strong> 사역마가 피해를 받으려 함<br>후원자가 사역마를 잠시 에테르로 되돌려, 단단한 물리적 형태에서 유령 같은 모습으로 바꿉니다. 유발 피해에 대해 사역마는 모든 피해에 <strong>저항 5</strong>를 얻고 <strong>정밀 피해에 면역</strong>이 됩니다.<br><strong>강화(+1):</strong> 저항이 2 증가합니다."
  },
  {
    "id": "protective-wards",
    "name_ko": "보호의 결계",
    "name_en": "Protective Wards",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "오라",
      "조작",
      "위저드"
    ],
    "area": "시전자 중심 5피트 발산",
    "duration": "유지(최대 1분)",
    "summary": "문자 고리를 펼쳐 아군을 보호합니다. 당신과 영역 내 아군은 AC에 +1 상태 보너스를 받습니다. 매 턴 주문을 유지(Sustain)할 때마다 발산 반경이 5피트씩 증가하며, 최대 30피트까지 확장됩니다.",
    "desc": "<strong>영역:</strong> 시전자 중심 5피트 발산<br><strong>지속 시간:</strong> 유지(최대 1분)<br>문자 고리를 펼쳐 아군을 보호합니다. 당신과 영역 내 아군은 <strong>AC에 +1 상태 보너스</strong>를 받습니다. 매 턴 주문을 유지(Sustain)할 때마다 발산 반경이 5피트씩 증가하며, 최대 30피트까지 확장됩니다."
  },
  {
    "id": "pushing-gust",
    "name_ko": "밀어내는 돌풍",
    "name_en": "Pushing Gust",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "공기",
      "클레릭",
      "조작"
    ],
    "range": "500피트",
    "target": "생물 1",
    "defense": "인내",
    "summary": "강력한 돌풍으로 대상을 밀어냅니다. 성공: 5피트 밀려남. 실패: 10피트. 대실패: 10피트+넘어뜨려짐.",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br>강력한 돌풍으로 대상을 밀어냅니다. <strong>성공:</strong> 5피트 밀려남. <strong>실패:</strong> 10피트. <strong>대실패:</strong> 10피트+넘어뜨려짐."
  },
  {
    "id": "read-fate",
    "name_ko": "운명 읽기",
    "name_en": "Read Fate",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "예언"
    ],
    "range": "10피트",
    "target": "생물 1",
    "summary": "대상의 가까운 미래에 대한 예감을 얻습니다. 대상이 이번 조우에서 한 판정에 d4를 추가할 수 있습니다(1회).",
    "desc": "<strong>사거리:</strong> 10피트<br><strong>대상:</strong> 생물 1<br>대상의 가까운 미래에 대한 예감을 얻습니다. 대상이 이번 조우에서 한 판정에 <strong>d4를 추가</strong>할 수 있습니다(1회)."
  },
  {
    "id": "savor-the-sting",
    "name_ko": "고통 음미",
    "name_en": "Savor the Sting",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "정신"
    ],
    "range": "접촉",
    "target": "생물 1",
    "defense": "의지",
    "summary": "대상에게 고통을 주고 그 괴로움을 즐깁니다. 1d4 정신 피해와 1d4 지속 정신 피해를 주며, 대상은 의지 내성을 시도합니다. 대상이 이 주문의 지속 피해를 받는 동안, 당신은 대상에 대한 명중 굴림과 기술 판정에 +1 상태 보너스를 얻습니다.대성공: 영향 없음.성공: 절반 피해, 지속 피해 없음.실패: 전체 초기 피해 및 지속 피해.대실패: 2배 ...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br>대상에게 고통을 주고 그 괴로움을 즐깁니다. <strong>1d4 정신 피해</strong>와 <strong>1d4 지속 정신 피해</strong>를 주며, 대상은 의지 내성을 시도합니다. 대상이 이 주문의 지속 피해를 받는 동안, 당신은 대상에 대한 명중 굴림과 기술 판정에 <strong>+1 상태 보너스</strong>를 얻습니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 절반 피해, 지속 피해 없음.<br><strong>실패:</strong> 전체 초기 피해 및 지속 피해.<br><strong>대실패:</strong> 2배 초기 피해 및 지속 피해.<br><strong>강화(+1):</strong> 초기 피해 +1d4, 지속 피해 +1d4."
  },
  {
    "id": "scholarly-recollection",
    "name_ko": "지식의 회상",
    "name_en": "Scholarly Recollection",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "클레릭",
      "행운"
    ],
    "range": "30피트",
    "target": "유발 생물",
    "trigger": "당신/아군이 지식 회상 판정을 시도(아직 굴리지 않음)",
    "summary": "학문적 지식이 떠오릅니다. 대상이 유발 판정을 두 번 굴려 높은 것을 사용합니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 유발 생물<br><strong>유발 조건:</strong> 당신/아군이 지식 회상 판정을 시도(아직 굴리지 않음)<br>학문적 지식이 떠오릅니다. 대상이 유발 판정을 <strong>두 번 굴려 높은 것</strong>을 사용합니다."
  },
  {
    "id": "scramble-body",
    "name_ko": "몸 뒤섞기",
    "name_en": "Scramble Body",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "조작",
      "공허"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "인내",
    "summary": "공허 에너지로 대상의 몸을 뒤섞습니다. 1d4 공허 피해. 인내 실패 시 서투름(clumsy) 1(1라운드). 대실패 시 서투름 2.강화(+1): 피해 +1d4.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br>공허 에너지로 대상의 몸을 뒤섞습니다. <strong>1d4 공허 피해</strong>. 인내 실패 시 <strong>{{condition:Clumsy}} 1</strong>(1라운드). 대실패 시 서투름 2.<br><strong>강화(+1):</strong> 피해 +1d4."
  },
  {
    "id": "soothing-words",
    "name_ko": "달래는 말",
    "name_en": "Soothing Words",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "감정",
      "정신"
    ],
    "range": "30피트",
    "target": "동의 생물 1",
    "duration": "1라운드",
    "summary": "달래는 말로 안정시킵니다. 대상이 공포(frightened) 상태이면 공포 수치를 1 감소. 또한 정신 효과에 대한 다음 내성에 +1 상태 보너스.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 동의 생물 1<br><strong>지속 시간:</strong> 1라운드<br>달래는 말로 안정시킵니다. 대상이 {{condition:Frightened}} 상태이면 <strong>공포 수치를 1 감소</strong>. 또한 정신 효과에 대한 다음 내성에 +1 상태 보너스."
  },
  {
    "id": "sudden-shift",
    "name_ko": "돌발 전환",
    "name_en": "Sudden Shift",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "클레릭",
      "조작"
    ],
    "duration": "다음 턴 끝까지",
    "trigger": "적이 근접 공격에 빗나감",
    "summary": "위험한 곳에서 재빨리 벗어나며 자신을 숨깁니다. 한 걸음(Step)을 밟고 은폐(concealed) 상태가 됩니다.",
    "desc": "<strong>지속 시간:</strong> 다음 턴 끝까지<br><strong>유발 조건:</strong> 적이 근접 공격에 빗나감<br>위험한 곳에서 재빨리 벗어나며 자신을 숨깁니다. 한 걸음(Step)을 밟고 <strong>{{condition:Concealed}}</strong> 상태가 됩니다."
  },
  {
    "id": "sweet-dream",
    "name_ko": "달콤한 꿈",
    "name_en": "Sweet Dream",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "3행동",
    "traits": [
      "클레릭",
      "정신"
    ],
    "range": "30피트",
    "target": "동의+잠든 생물 1",
    "duration": "10분",
    "summary": "달콤한 꿈으로 보호합니다. 대상이 악몽이나 다른 정신 방해에 면역이 되며, 1d8 HP를 회복합니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 동의+잠든 생물 1<br><strong>지속 시간:</strong> 10분<br>달콤한 꿈으로 보호합니다. 대상이 악몽이나 다른 정신 방해에 <strong>면역</strong>이 되며, <strong>1d8 HP를 회복</strong>합니다."
  },
  {
    "id": "tempest-surge",
    "name_ko": "폭풍 군주",
    "name_en": "Tempest Surge",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "공기",
      "드루이드",
      "전기",
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "반사",
    "summary": "번개를 소환하여 적에게 1d12 전기 피해. 실패 시 피해+서투름(clumsy) 2(1라운드). 대실패 시 2배 피해+서투름 2.강화(+1): 피해 +1d12.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 반사<br>번개를 소환하여 적에게 <strong>1d12 전기 피해</strong>. 실패 시 피해+<strong>{{condition:Clumsy}} 2</strong>(1라운드). 대실패 시 2배 피해+서투름 2.<br><strong>강화(+1):</strong> 피해 +1d12."
  },
  {
    "id": "tidal-surge",
    "name_ko": "조류 파도",
    "name_en": "Tidal Surge",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "조작",
      "물"
    ],
    "range": "60피트",
    "target": "생물 1",
    "defense": "인내",
    "summary": "물의 파도로 밀어냅니다. 인내 실패 시 5피트 밀려남. 대실패 시 10피트+넘어뜨려짐.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br>물의 파도로 밀어냅니다. 인내 실패 시 <strong>5피트 밀려남</strong>. 대실패 시 10피트+넘어뜨려짐."
  },
  {
    "id": "touch-of-obedience",
    "name_ko": "복종의 접촉",
    "name_en": "Touch of Obedience",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "조작",
      "정신"
    ],
    "range": "접촉",
    "target": "살아있는 생물 1",
    "defense": "의지",
    "duration": "다양",
    "summary": "의지력을 침식합니다. 성공: 현기증 1(다음 턴 끝까지). 실패: 현기증 2. 대실패: 현기증 2(1분)+넘어뜨려짐.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 살아있는 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 다양<br>의지력을 침식합니다. <strong>성공:</strong> 현기증 1(다음 턴 끝까지). <strong>실패:</strong> 현기증 2. <strong>대실패:</strong> 현기증 2(1분)+넘어뜨려짐."
  },
  {
    "id": "touch-of-undeath",
    "name_ko": "언데드의 접촉",
    "name_en": "Touch of Undeath",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "조작",
      "공허"
    ],
    "range": "접촉",
    "target": "살아있는 생물 1",
    "defense": "인내",
    "duration": "다양",
    "summary": "언데드의 힘으로 공격합니다. 1d6 공허 피해. 인내 실패 시 약화 1(1라운드). 대실패 시 약화 2.강화(+1): 피해 +1d6.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 살아있는 생물 1<br><strong>방어:</strong> 인내<br><strong>지속 시간:</strong> 다양<br>언데드의 힘으로 공격합니다. <strong>1d6 공허 피해</strong>. 인내 실패 시 <strong>약화 1</strong>(1라운드). 대실패 시 약화 2.<br><strong>강화(+1):</strong> 피해 +1d6."
  },
  {
    "id": "unimpeded-stride",
    "name_ko": "방해 없는 보폭",
    "name_en": "Unimpeded Stride",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "레인저"
    ],
    "duration": "1분",
    "summary": "비마법적 험지를 무시합니다. 극심 험지를 일반 험지로 취급합니다.",
    "desc": "<strong>지속 시간:</strong> 1분<br>비마법적 험지를 무시합니다. 극심 험지를 일반 험지로 취급합니다."
  },
  {
    "id": "untamed-form",
    "name_ko": "야생 해방",
    "name_en": "Untamed Form",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "드루이드",
      "변형"
    ],
    "duration": "1라운드",
    "summary": "자신의 내면에서 다른 부분을 찾아 해방시켜 몸을 다른 형태로 변화시킵니다. 해충 형태(pest form)에 나열된 어떤 형태로든 변이할 수 있으며, 이 형태는 10분 동안 지속됩니다. 그 외의 야생 해방 형태는 1분 동안 지속됩니다. 드루이드 재주를 통해 야생 해방 목록에 더 많은 형태를 추가할 수 있습니다. 사용 가능한 재주에 따라 접근할 수 있는 ...",
    "desc": "<strong>지속 시간:</strong> 1라운드<br>자신의 내면에서 다른 부분을 찾아 해방시켜 몸을 다른 형태로 변화시킵니다. <em>{{spell:Pest Form}}</em>에 나열된 어떤 형태로든 변이할 수 있으며, 이 형태는 10분 동안 지속됩니다. 그 외의 야생 해방 형태는 1분 동안 지속됩니다. 드루이드 재주를 통해 야생 해방 목록에 더 많은 형태를 추가할 수 있습니다. 사용 가능한 재주에 따라 접근할 수 있는 형태가 결정됩니다."
  },
  {
    "id": "untamed-shift",
    "name_ko": "야생 변이",
    "name_en": "Untamed Shift",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [
      "primal"
    ],
    "actions": "1행동~2행동",
    "traits": [
      "드루이드",
      "조작",
      "변형"
    ],
    "duration": "1분",
    "summary": "신체 일부를 변형합니다. 보유한 야생 결사 재주에 해당하는 효과 하나를 선택합니다.야생 형태: 손이 날카로운 발톱으로 변합니다. 발톱은 비무장 공격이며, 민첩·기교 특성을 가지고 1d8 베기 피해를 줍니다. 변형 중에도 손으로 물건을 들고 사용할 수 있지만, 타격하려면 빈 손이 필요합니다.곤충 형태: 입이 치명적인 턱으로 변합니다. 야생 턱은 1d8 ...",
    "desc": "<strong>지속 시간:</strong> 1분<br>신체 일부를 변형합니다. 보유한 야생 결사 재주에 해당하는 효과 하나를 선택합니다.<br><strong>야생 형태:</strong> 손이 날카로운 발톱으로 변합니다. 발톱은 비무장 공격이며, 민첩·기교 특성을 가지고 1d8 베기 피해를 줍니다. 변형 중에도 손으로 물건을 들고 사용할 수 있지만, 타격하려면 빈 손이 필요합니다.<br><strong>곤충 형태:</strong> 입이 치명적인 턱으로 변합니다. 야생 턱은 1d8 관통 피해를 주는 비무장 공격입니다.<br><strong>원소 형태:</strong> 신체가 부분적으로 원소 물질로 변하여 치명타와 정밀 피해에 대한 저항 5를 얻습니다.<br><strong>식물 형태:</strong> 팔이 긴 덩굴로 변하여 간격이 10피트(간격 무기 사용 시 15피트)로 증가합니다.<br><strong>비상 형태:</strong> 이 효과를 위해 2행동으로 야생 변이를 시전해야 합니다. 등에서 날개가 자라나 30피트 비행 속도를 얻습니다.<br><strong>강화(6단계):</strong> 목록에서 최대 두 가지 효과를 선택할 수 있습니다. 발톱은 2d6 지속 출혈 피해도 추가하고, 야생 턱은 2d6 지속 독 피해도 추가합니다.<br><strong>강화(10단계):</strong> 최대 세 가지 효과를 선택할 수 있습니다. 발톱은 4d6 지속 출혈 피해, 야생 턱은 4d6 지속 독 피해를 추가합니다."
  },
  {
    "id": "veil-of-confidence",
    "name_ko": "자신감의 장막",
    "name_en": "Veil of Confidence",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "감정",
      "정신"
    ],
    "duration": "1분",
    "summary": "자신감으로 자신을 감쌉니다. 현재 공포(frightened) 수치를 1 감소시키고, 지속 시간 동안 공포 상태가 될 때마다 그 수치를 1 감소시킵니다. 공포 효과에 대해 대실패를 하면, 자신감의 장막이 해당 효과의 공포 수치를 줄인 후 주문이 종료됩니다.",
    "desc": "<strong>지속 시간:</strong> 1분<br>자신감으로 자신을 감쌉니다. 현재 {{condition:Frightened}} 수치를 <strong>1 감소</strong>시키고, 지속 시간 동안 공포 상태가 될 때마다 그 수치를 <strong>1 감소</strong>시킵니다. 공포 효과에 대해 대실패를 하면, 자신감의 장막이 해당 효과의 공포 수치를 줄인 후 주문이 종료됩니다."
  },
  {
    "id": "vibrant-thorns",
    "name_ko": "활기찬 가시",
    "name_en": "Vibrant Thorns",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "드루이드",
      "변형",
      "식물"
    ],
    "duration": "1분",
    "summary": "몸에 가시가 자라납니다. 비무장 타격에 1d6 관통 피해 추가. 잡기(grab)를 시도하는 적에 가시 피해.",
    "desc": "<strong>지속 시간:</strong> 1분<br>몸에 가시가 자라납니다. 비무장 타격에 <strong>1d6 관통 피해 추가</strong>. 잡기(grab)를 시도하는 적에 가시 피해."
  },
  {
    "id": "waking-nightmare",
    "name_ko": "깨어난 악몽",
    "name_en": "Waking Nightmare",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "비일상",
      "클레릭",
      "감정",
      "공포",
      "조작",
      "정신"
    ],
    "summary": "사거리: 30피트 | 대상: 생물 1 | 내성 굴림: 의지 | 지속 시간: 다양생물의 마음을 공포스러운 환영으로 가득 채웁니다. 대상은 의지 내성을 시도해야 합니다. 이 주문으로 공포 상태가 된 생물은 타격(Strike)에 적중당할 때마다 추가로 1 정신 피해를 받습니다.대성공: 대상은 영향 없음.성공: 대상은 공포 1.실패: 대상은 공포 2. 잠든 ...",
    "desc": "<strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>내성 굴림:</strong> 의지 | <strong>지속 시간:</strong> 다양<br>생물의 마음을 공포스러운 환영으로 가득 채웁니다. 대상은 의지 내성을 시도해야 합니다. 이 주문으로 공포 상태가 된 생물은 타격(Strike)에 적중당할 때마다 추가로 <strong>1 정신 피해</strong>를 받습니다.<br><strong>대성공:</strong> 대상은 영향 없음.<br><strong>성공:</strong> 대상은 <strong>공포 1</strong>.<br><strong>실패:</strong> 대상은 <strong>공포 2</strong>. 잠든 상태였다면 깨어나며 <strong>1라운드 동안 마비</strong>됩니다.<br><strong>대실패:</strong> 실패와 같지만 <strong>공포 3</strong>.<br><strong>강화(+1):</strong> 타격 시 추가 정신 피해가 1 증가합니다."
  },
  {
    "id": "weapon-surge",
    "name_ko": "무기 강화",
    "name_en": "Weapon Surge",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "조작"
    ],
    "range": "접촉",
    "target": "무기 1",
    "duration": "1라운드",
    "summary": "무기에 신성한 에너지를 불어넣습니다. 무기의 다음 타격에 추가 1d6 피해(무기와 같은 유형).",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 무기 1<br><strong>지속 시간:</strong> 1라운드<br>무기에 신성한 에너지를 불어넣습니다. 무기의 다음 타격에 <strong>추가 1d6 피해</strong>(무기와 같은 유형)."
  },
  {
    "id": "whispering-quiet",
    "name_ko": "속삭이는 고요",
    "name_en": "Whispering Quiet",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "조작",
      "음파"
    ],
    "range": "60피트",
    "area": "15피트 폭발",
    "duration": "1분",
    "summary": "영역 내 소리를 억압합니다. 5피트 이상 떨어진 생물은 지각 판정(주문 DC) 없이 영역 내 목소리를 들을 수 없습니다.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>영역:</strong> 15피트 폭발<br><strong>지속 시간:</strong> 1분<br>영역 내 소리를 억압합니다. 5피트 이상 떨어진 생물은 지각 판정(주문 DC) 없이 영역 내 목소리를 들을 수 없습니다."
  },
  {
    "id": "word-of-truth",
    "name_ko": "진실의 말씀",
    "name_en": "Word of Truth",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭"
    ],
    "duration": "1라운드",
    "summary": "당신이 진실이라고 믿는 진술을 말합니다. 진술은 말 비틀기, 생략 등을 통한 속임수 시도가 없어야 하며, 25단어 이하여야 합니다. 신격의 상징이 머리 위에 빛나며 주문 지속 시간 동안 유지됩니다. 당신을 보고 듣는 모든 생물은 당신이 말하는 것을 진실로 믿는다는 것을 본능적으로 알게 됩니다. 이 정직함의 보증은 상징이 지속되는 동안 외교 판정에 +2...",
    "desc": "<strong>지속 시간:</strong> 1라운드<br>당신이 진실이라고 믿는 진술을 말합니다. 진술은 말 비틀기, 생략 등을 통한 속임수 시도가 없어야 하며, <strong>25단어 이하</strong>여야 합니다. 신격의 상징이 머리 위에 빛나며 주문 지속 시간 동안 유지됩니다. 당신을 보고 듣는 모든 생물은 당신이 말하는 것을 진실로 믿는다는 것을 본능적으로 알게 됩니다. 이 정직함의 보증은 상징이 지속되는 동안 외교 판정에 <strong>+2 상태 보너스</strong>를 부여합니다. 주문을 해제(Dismiss)할 수 있으며, 완전히 사실이라고 믿지 않는 것을 말하면 진술을 마치기 전에 주문이 종료됩니다."
  },
  {
    "id": "artistic-flourish",
    "name_ko": "예술적 장식",
    "name_en": "Artistic Flourish",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "조작"
    ],
    "duration": "10분",
    "summary": "대상을 당신의 창의적 비전에 더 가깝게 변형합니다. 분명히 같은 물건이지만, 당신이 선택한 미적 세부 사항이 추가됩니다. 대상은 아름답고 인상적인 외관이 되지만, 효과는 명백히 마법적이고 일시적이므로 금전적 가치는 변하지 않습니다. 제작이 전문가이면 무기에 명중 굴림 +1 아이템 보너스, 기술 도구에 기술 판정 +1 아이템 보너스. 이 주문을 다시 시...",
    "desc": "<strong>지속 시간:</strong> 10분<br>대상을 당신의 창의적 비전에 더 가깝게 변형합니다. 분명히 같은 물건이지만, 당신이 선택한 미적 세부 사항이 추가됩니다. 대상은 아름답고 인상적인 외관이 되지만, 효과는 명백히 마법적이고 일시적이므로 금전적 가치는 변하지 않습니다. 제작이 전문가이면 무기에 명중 굴림 <strong>+1 아이템 보너스</strong>, 기술 도구에 기술 판정 +1 아이템 보너스. 이 주문을 다시 시전하면 이전 시전이 종료됩니다.<br><strong>강화(7랭크):</strong> 제작 달인이면 +2 아이템 보너스. <strong>강화(10랭크):</strong> 제작 전설이면 +3 아이템 보너스."
  },
  {
    "id": "captivating-adoration",
    "name_ko": "열정의 유혹",
    "name_en": "Captivating Adoration",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "감정",
      "조작",
      "정신",
      "시각"
    ],
    "area": "15피트 발산",
    "defense": "의지",
    "duration": "1분",
    "summary": "매혹적 존재감. 영역에 들어온 적이 의지 실패 시 매혹(fascinated). 매혹된 동안 당신에 대한 적대 행동에 DC 5 단순 판정.",
    "desc": "<strong>영역:</strong> 15피트 발산<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1분<br>매혹적 존재감. 영역에 들어온 적이 의지 실패 시 <strong>매혹(fascinated)</strong>. 매혹된 동안 당신에 대한 적대 행동에 DC 5 단순 판정."
  },
  {
    "id": "commanding-lash",
    "name_ko": "명령의 채찍",
    "name_en": "Commanding Lash",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "비일상",
      "클레릭",
      "언어",
      "조작",
      "정신"
    ],
    "range": "100피트",
    "target": "가장 최근 행동으로 피해를 준 생물",
    "defense": "의지",
    "duration": "대상의 다음 턴 끝까지",
    "requirements": "가장 최근 행동이 대상에게 피해를 준 행동이어야 합니다.",
    "summary": "더 많은 고통을 가하겠다는 위협으로, 최근 해를 입힌 생물에게 명령을 내립니다. 명령(command) 주문의 효과로 대상에게 명령을 합니다. 대상이 공포(frightened), 현기증(stupefied), 또는 지속 피해를 받는 중이라면 내성에 -2 상황 페널티를 받습니다. 결과에 관계없이, 대상은 이후 1시간 동안 일시 면역이 됩니다.",
    "desc": "<strong>사거리:</strong> 100피트<br><strong>대상:</strong> 가장 최근 행동으로 피해를 준 생물<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 대상의 다음 턴 끝까지<br><strong>요구사항:</strong> 가장 최근 행동이 대상에게 피해를 준 행동이어야 합니다.<br>더 많은 고통을 가하겠다는 위협으로, 최근 해를 입힌 생물에게 명령을 내립니다. <em>{{spell:Command}}</em> 주문의 효과로 대상에게 명령을 합니다. 대상이 {{condition:Frightened}}, {{condition:Stupefied}}, 또는 지속 피해를 받는 중이라면 내성에 <strong>-2 상황 페널티</strong>를 받습니다. 결과에 관계없이, 대상은 이후 <strong>1시간</strong> 동안 일시 면역이 됩니다."
  },
  {
    "id": "community-restoration",
    "name_ko": "가족 회복",
    "name_en": "Community Restoration",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "치유",
      "조작"
    ],
    "range": "30피트",
    "target": "최대 4 동의 생물",
    "summary": "대상 각각의 상태 하나를 상쇄합니다(고통 정화와 유사).",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 최대 4 동의 생물<br>대상 각각의 상태 하나를 상쇄합니다(고통 정화와 유사)."
  },
  {
    "id": "competitive-edge",
    "name_ko": "경쟁심",
    "name_en": "Competitive Edge",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "감정",
      "정신"
    ],
    "duration": "유지(최대 1분)",
    "summary": "경쟁심이 우월함을 입증하게 합니다. 명중 굴림과 기술 판정에 +1 상태 보너스. 20피트 이내의 적이 공격/기술 판정에 대성공하면 해당 보너스가 1라운드간 +3으로 증가.강화(7랭크): 기본 +2, 대성공 시 +4.",
    "desc": "<strong>지속 시간:</strong> 유지(최대 1분)<br>경쟁심이 우월함을 입증하게 합니다. 명중 굴림과 기술 판정에 <strong>+1 상태 보너스</strong>. 20피트 이내의 적이 공격/기술 판정에 대성공하면 해당 보너스가 1라운드간 <strong>+3</strong>으로 증가.<br><strong>강화(7랭크):</strong> 기본 +2, 대성공 시 +4."
  },
  {
    "id": "darkened-sight",
    "name_ko": "어둠의 시야",
    "name_en": "Darkened Sight",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "어둠",
      "클레릭"
    ],
    "range": "60피트",
    "target": "생물 1",
    "defense": "인내",
    "duration": "1분",
    "summary": "대상의 시야를 어둡게 합니다. 인내 실패 시 현혹됨(dazzled). 대실패 시 실명(blinded)(1라운드 후 현혹됨으로 전환).",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br><strong>지속 시간:</strong> 1분<br>대상의 시야를 어둡게 합니다. 인내 실패 시 <strong>{{condition:Dazzled}}</strong>. 대실패 시 <strong>{{condition:Blinded}}</strong>(1라운드 후 현혹됨으로 전환)."
  },
  {
    "id": "delusional-pride",
    "name_ko": "망상적 자만",
    "name_en": "Delusional Pride",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "감정",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "10분",
    "summary": "대상을 과잉 자신감에 빠뜨려, 실패를 외부 요인 탓으로 돌리게 합니다. 대상은 의지 내성을 시도하며, 결과와 관계없이 24시간 일시 면역이 됩니다.대성공: 영향 없음.성공: 지속 시간 1라운드. 대상이 명중 굴림이나 기술 판정에 실패하면 해당 턴 끝까지(또는 턴 외에 시도한 경우 다음 턴 끝까지) 명중 굴림과 기술 판정에 -1 상태 페널티. 대상이 자...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 10분<br>대상을 과잉 자신감에 빠뜨려, 실패를 외부 요인 탓으로 돌리게 합니다. 대상은 의지 내성을 시도하며, 결과와 관계없이 <strong>24시간 일시 면역</strong>이 됩니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 지속 시간 1라운드. 대상이 명중 굴림이나 기술 판정에 실패하면 해당 턴 끝까지(또는 턴 외에 시도한 경우 다음 턴 끝까지) 명중 굴림과 기술 판정에 <strong>-1 상태 페널티</strong>. 대상이 자신의 야심을 추구하도록 격려받고 있다면 이 페널티는 <strong>-2</strong>. 이 페널티를 받는 동안 두 번째 실패를 하면 페널티가 <strong>-2</strong>로 증가합니다. 대상은 당신이 이 주문을 시전했음을 인지하지 못합니다.<br><strong>실패:</strong> 성공과 같지만 지속 시간 10분.<br><strong>대실패:</strong> 성공과 같지만 지속 시간 24시간."
  },
  {
    "id": "destructive-aura",
    "name_ko": "파괴적 기운",
    "name_en": "Destructive Aura",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭"
    ],
    "area": "15피트 발산",
    "duration": "1분",
    "summary": "신성한 파괴의 소용돌이치는 모래가 당신을 둘러싸, 닿는 모든 것의 방어를 약화시킵니다. 당신 자신과 영역 내 생물의 저항을 2 감소시킵니다.강화(+2): 저항 감소가 추가로 2 증가합니다.",
    "desc": "<strong>영역:</strong> 15피트 발산<br><strong>지속 시간:</strong> 1분<br>신성한 파괴의 소용돌이치는 모래가 당신을 둘러싸, 닿는 모든 것의 방어를 약화시킵니다. 당신 자신과 영역 내 생물의 저항을 <strong>2 감소</strong>시킵니다.<br><strong>강화(+2):</strong> 저항 감소가 추가로 2 증가합니다."
  },
  {
    "id": "disperse-into-air",
    "name_ko": "공기로 분산",
    "name_en": "Disperse into Air",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "공기",
      "클레릭",
      "조작",
      "변이"
    ],
    "trigger": "적이나 위험에서 피해를 받음",
    "summary": "유발 피해를 받은 후 공기로 변합니다. 현재 턴이 끝날 때까지 공격이나 대상으로 삼을 수 없고, 공간을 차지하지 않으며, 행동할 수 없고, 가지고 있던 기운(aura)이나 발산이 억제됩니다. 턴이 끝나면 분산된 위치에서 15피트 이내의 점유 가능한 공간에 원래 형태로 돌아옵니다. 분산 중 지속 시간이 만료되지 않은 기운이나 발산은 복원됩니다.",
    "desc": "<strong>유발 조건:</strong> 적이나 위험에서 피해를 받음<br>유발 피해를 받은 후 공기로 변합니다. 현재 턴이 끝날 때까지 공격이나 대상으로 삼을 수 없고, 공간을 차지하지 않으며, 행동할 수 없고, 가지고 있던 기운(aura)이나 발산이 억제됩니다. 턴이 끝나면 분산된 위치에서 <strong>15피트 이내</strong>의 점유 가능한 공간에 원래 형태로 돌아옵니다. 분산 중 지속 시간이 만료되지 않은 기운이나 발산은 복원됩니다."
  },
  {
    "id": "downpour",
    "name_ko": "폭포",
    "name_en": "Downpour",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "조작",
      "물"
    ],
    "area": "30피트 폭발",
    "duration": "1분",
    "summary": "폭우를 내립니다. 영역이 은폐를 제공하고 비마법 화염을 끕니다. 영역 내 화염 주문의 피해가 절반.",
    "desc": "<strong>영역:</strong> 30피트 폭발<br><strong>지속 시간:</strong> 1분<br>폭우를 내립니다. 영역이 <strong>은폐</strong>를 제공하고 비마법 화염을 끕니다. 영역 내 화염 주문의 피해가 절반."
  },
  {
    "id": "dreamers-call",
    "name_ko": "꿈꾸는 자의 부름",
    "name_en": "Dreamer's Call",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "비일상",
      "클레릭",
      "환영",
      "무력화",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "대상의 다음 턴 끝까지",
    "summary": "대상의 꿈의 이미지에서 끌어낸 생생하고 환상적인 백일몽을 만들어냅니다. 백일몽은 사거리 내 비어있는 공간에 나타나며, 대상을 끌어당기려 합니다.대성공: 대상은 영향 없음.성공: 대상의 주의가 흔들립니다. 백일몽에 매혹(fascinated)됩니다.실패: 대상은 백일몽에 매혹되어, 첫 행동으로 다음 행동 과정 중 하나를 선택하여 추구합니다: 백일몽에 접근...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 대상의 다음 턴 끝까지<br>대상의 꿈의 이미지에서 끌어낸 생생하고 환상적인 백일몽을 만들어냅니다. 백일몽은 사거리 내 비어있는 공간에 나타나며, 대상을 끌어당기려 합니다.<br><strong>대성공:</strong> 대상은 영향 없음.<br><strong>성공:</strong> 대상의 주의가 흔들립니다. 백일몽에 <strong>매혹(fascinated)</strong>됩니다.<br><strong>실패:</strong> 대상은 백일몽에 매혹되어, 첫 행동으로 다음 행동 과정 중 하나를 선택하여 추구합니다: 백일몽에 접근(도주 상태처럼), 들고 있는 것을 놓아주기(제물로), 또는 엎드려 절하기(넘어뜨려짐). 대상은 당신이 이 주문을 시전했음을 인지하지 못합니다.<br><strong>대실패:</strong> 성공과 같지만, 상태 페널티가 -4이며 자신의 야심을 추구하도록 격려받고 있어 자동으로 암시를 따릅니다."
  },
  {
    "id": "enduring-might",
    "name_ko": "지속하는 힘",
    "name_en": "Enduring Might",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "비일상",
      "클레릭",
      "조작"
    ],
    "trigger": "공격이나 효과가 당신에게 피해를 주려 함",
    "summary": "당신의 강력한 힘이 신성한 보호력과 어우러져 해로부터 지켜줍니다. 유발 공격이나 효과의 모든 피해에 대해 8 + 근력 수정치에 해당하는 저항을 얻습니다.강화(+1): 저항이 2 증가합니다.",
    "desc": "<strong>유발 조건:</strong> 공격이나 효과가 당신에게 피해를 주려 함<br>당신의 강력한 힘이 신성한 보호력과 어우러져 해로부터 지켜줍니다. 유발 공격이나 효과의 모든 피해에 대해 <strong>8 + 근력 수정치</strong>에 해당하는 <strong>저항</strong>을 얻습니다.<br><strong>강화(+1):</strong> 저항이 2 증가합니다."
  },
  {
    "id": "energy-absorption",
    "name_ko": "에너지 흡수",
    "name_en": "Energy Absorption",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "클레릭"
    ],
    "trigger": "에너지 피해를 받으려 함",
    "summary": "에너지 피해를 흡수합니다. 유발 피해를 최대 30만큼 감소. 감소시킨 피해만큼 다음 공격에 같은 유형의 추가 피해를 줄 수 있습니다(1라운드 내).",
    "desc": "<strong>유발 조건:</strong> 에너지 피해를 받으려 함<br>에너지 피해를 흡수합니다. 유발 피해를 <strong>최대 30만큼 감소</strong>. 감소시킨 피해만큼 다음 공격에 같은 유형의 <strong>추가 피해</strong>를 줄 수 있습니다(1라운드 내)."
  },
  {
    "id": "eradicate-undeath",
    "name_ko": "언데드 근절",
    "name_en": "Eradicate Undeath",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "활력"
    ],
    "area": "30피트 원뿔",
    "defense": "기본 인내",
    "summary": "활력 에너지의 파동이 언데드를 불태웁니다. 4d12 활력 피해(기본 인내, 언데드에만 영향).강화(+1): 피해 +1d12.",
    "desc": "<strong>영역:</strong> 30피트 원뿔<br><strong>방어:</strong> 기본 인내<br>활력 에너지의 파동이 언데드를 불태웁니다. <strong>4d12 활력 피해</strong>(기본 인내, 언데드에만 영향).<br><strong>강화(+1):</strong> 피해 +1d12."
  },
  {
    "id": "flame-barrier",
    "name_ko": "화염 장벽",
    "name_en": "Flame Barrier",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "클레릭"
    ],
    "range": "60피트",
    "target": "유발 생물",
    "trigger": "자신이나 60피트 이내 아군이 화염 피해를 받으려 함",
    "summary": "다가오는 불꽃을 재빨리 빗겨냅니다. 대상은 유발 효과에 대해 화염 피해 저항 15를 얻습니다.강화(+2): 저항이 5 증가합니다.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 유발 생물<br><strong>유발 조건:</strong> 자신이나 60피트 이내 아군이 화염 피해를 받으려 함<br>다가오는 불꽃을 재빨리 빗겨냅니다. 대상은 유발 효과에 대해 화염 피해 <strong>저항 15</strong>를 얻습니다.<br><strong>강화(+2):</strong> 저항이 5 증가합니다."
  },
  {
    "id": "fortissimo-composition",
    "name_ko": "포르티시모 작곡",
    "name_en": "Fortissimo Composition",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "자유 행동",
    "traits": [
      "비일상",
      "바드",
      "주문형성"
    ],
    "summary": "뮤즈: 마에스트로(maestro)뮤즈에 호소하여 용기의 찬가, 집결의 찬가, 또는 힘의 노래 작곡의 혜택을 크게 증가시킵니다. 다음 행동이 이 작곡 중 하나를 시전하는 것이라면, 공연(Performance) 판정을 시도합니다. DC는 보통 작곡 대상 중 가장 높은 의지 DC이지만, GM이 상황에 따라 다른 DC를 지정할 수 있습니다. 작곡의 효과는 판...",
    "desc": "<strong>뮤즈:</strong> 마에스트로(maestro)<br>뮤즈에 호소하여 <em>용기의 찬가</em>, <em>집결의 찬가</em>, 또는 <em>힘의 노래</em> 작곡의 혜택을 크게 증가시킵니다. 다음 행동이 이 작곡 중 하나를 시전하는 것이라면, 공연(Performance) 판정을 시도합니다. DC는 보통 작곡 대상 중 가장 높은 의지 DC이지만, GM이 상황에 따라 다른 DC를 지정할 수 있습니다. 작곡의 효과는 판정 결과에 따라 달라집니다.<br><strong>대성공:</strong> 작곡의 상태 보너스가 <strong>+3</strong>으로 증가합니다.<br><strong>성공:</strong> 작곡의 상태 보너스가 <strong>+2</strong>로 증가합니다.<br><strong>실패:</strong> 작곡은 정상적인 +1 보너스만 제공하지만, 이 주문에 집중점을 소비하지 않습니다."
  },
  {
    "id": "glimpse-the-truth",
    "name_ko": "진실의 일별",
    "name_en": "Glimpse the Truth",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "예언",
      "탐지"
    ],
    "area": "30피트 발산",
    "duration": "1라운드",
    "summary": "잠시 진실을 봅니다. 영역 내 환영에 대해 즉시 불신을 시도합니다(+2 상황 보너스). 변이/변형 중인 생물의 진짜 형태를 볼 수 있습니다.",
    "desc": "<strong>영역:</strong> 30피트 발산<br><strong>지속 시간:</strong> 1라운드<br>잠시 진실을 봅니다. 영역 내 환영에 대해 즉시 불신을 시도합니다(+2 상황 보너스). 변이/변형 중인 생물의 진짜 형태를 볼 수 있습니다."
  },
  {
    "id": "interdisciplinary-incantation",
    "name_ko": "학제간 주문",
    "name_en": "Interdisciplinary Incantation",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "위저드"
    ],
    "summary": "다른 전통의 주문을 비전 주문으로 시전합니다. 비전 목록에 없는 1-3랭크 주문 하나를 선택하여 이번만 비전 주문으로 시전합니다.",
    "desc": "다른 전통의 주문을 비전 주문으로 시전합니다. 비전 목록에 없는 1-3랭크 주문 하나를 선택하여 이번만 비전 주문으로 시전합니다."
  },
  {
    "id": "know-the-enemy",
    "name_ko": "적 파악",
    "name_en": "Know the Enemy",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "자유 행동",
    "traits": [
      "레인저"
    ],
    "trigger": "우선권 굴림(아직 굴리지 않음)",
    "summary": "적에 대한 정보를 즉시 파악합니다. 지식 회상을 한 번 시도하며, 성공 시 대상의 약점/저항/면역 중 하나를 알 수 있습니다.",
    "desc": "<strong>유발 조건:</strong> 우선권 굴림(아직 굴리지 않음)<br>적에 대한 정보를 즉시 파악합니다. 지식 회상을 한 번 시도하며, 성공 시 대상의 약점/저항/면역 중 하나를 알 수 있습니다."
  },
  {
    "id": "localized-quake",
    "name_ko": "국지 지진",
    "name_en": "Localized Quake",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "대지",
      "클레릭",
      "조작"
    ],
    "area": "15피트 발산",
    "defense": "반사",
    "summary": "대지를 흔들어 근처의 생물을 넘어뜨립니다. 시전 시 주문의 영역이 15피트 발산인지 15피트 원뿔인지 선택합니다. 영역 내에서 단단한 땅 위에 서 있는 각 생물은 4d6 둔기 피해를 받고 기본 반사 내성을 시도합니다. 내성에 실패한 생물은 넘어뜨려짐 상태도 됩니다.강화(+1): 피해 +2d6.",
    "desc": "<strong>영역:</strong> 15피트 발산<br><strong>방어:</strong> 반사<br>대지를 흔들어 근처의 생물을 넘어뜨립니다. 시전 시 주문의 영역이 15피트 발산인지 15피트 원뿔인지 선택합니다. 영역 내에서 단단한 땅 위에 서 있는 각 생물은 <strong>4d6 둔기 피해</strong>를 받고 <strong>기본 반사 내성</strong>을 시도합니다. 내성에 실패한 생물은 <strong>넘어뜨려짐</strong> 상태도 됩니다.<br><strong>강화(+1):</strong> 피해 +2d6."
  },
  {
    "id": "lucky-break",
    "name_ko": "행운의 기회",
    "name_en": "Lucky Break",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "클레릭",
      "행운"
    ],
    "trigger": "내성 굴림에 실패(아직 효과 적용 전)",
    "summary": "실패한 내성 굴림을 다시 굴립니다. 새 결과를 사용해야 합니다.",
    "desc": "<strong>유발 조건:</strong> 내성 굴림에 실패(아직 효과 적용 전)<br>실패한 내성 굴림을 <strong>다시 굴립니다</strong>. 새 결과를 사용해야 합니다."
  },
  {
    "id": "malignant-sustenance",
    "name_ko": "악성 자양분",
    "name_en": "Malignant Sustenance",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "공허"
    ],
    "range": "접촉",
    "target": "언데드 1",
    "duration": "1분",
    "summary": "언데드에 공허 에너지를 주입하여 강화합니다. 대상이 빠른 치유(fast healing) 5를 얻습니다.강화(+1): 빠른 치유 +2.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 언데드 1<br><strong>지속 시간:</strong> 1분<br>언데드에 공허 에너지를 주입하여 강화합니다. 대상이 <strong>빠른 치유(fast healing) 5</strong>를 얻습니다.<br><strong>강화(+1):</strong> 빠른 치유 +2."
  },
  {
    "id": "mystic-beacon",
    "name_ko": "신비의 등대",
    "name_en": "Mystic Beacon",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "조작"
    ],
    "range": "30피트",
    "target": "동의 생물 1",
    "duration": "다음 턴 시작까지",
    "summary": "대상이 다음에 시전하는 피해/치유 주문이 1랭크 높은 것처럼 피해/치유를 줍니다(초기 피해/치유에만 적용). 주문 시전 후 종료.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 동의 생물 1<br><strong>지속 시간:</strong> 다음 턴 시작까지<br>대상이 다음에 시전하는 피해/치유 주문이 <strong>1랭크 높은 것처럼</strong> 피해/치유를 줍니다(초기 피해/치유에만 적용). 주문 시전 후 종료."
  },
  {
    "id": "natures-bounty",
    "name_ko": "자연의 선물",
    "name_en": "Nature's Bounty",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "비일상",
      "클레릭",
      "조작",
      "식물",
      "활력"
    ],
    "requirements": "빈 손이 있어야 합니다.",
    "summary": "손바닥 크기의 날것 과일이나 채소가 당신의 빈 손에 나타납니다. 생물이 상호작용(Interact) 행동으로 이 음식을 먹으면 3d10+12 HP를 회복하고 한 끼를 먹은 것처럼 영양이 보충됩니다. 먹지 않으면 1분 후 먼지로 부서집니다.강화(+1): 회복 HP가 6 증가합니다.",
    "desc": "<strong>요구사항:</strong> 빈 손이 있어야 합니다.<br>손바닥 크기의 날것 과일이나 채소가 당신의 빈 손에 나타납니다. 생물이 상호작용(Interact) 행동으로 이 음식을 먹으면 <strong>3d10+12 HP</strong>를 회복하고 한 끼를 먹은 것처럼 영양이 보충됩니다. 먹지 않으면 1분 후 먼지로 부서집니다.<br><strong>강화(+1):</strong> 회복 HP가 6 증가합니다."
  },
  {
    "id": "perfected-body",
    "name_ko": "완벽한 몸",
    "name_en": "Perfected Body",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "클레릭"
    ],
    "trigger": "변형/독/변이 특성, 서투름/운명/약화/석화/메스꺼움을 부여하는 효과에 내성 실패/대실패",
    "summary": "몸의 완벽함이 약간 더 건강하게 유지합니다. 대실패를 실패로, 실패를 성공으로 변경합니다.",
    "desc": "<strong>유발 조건:</strong> 변형/독/변이 특성, 서투름/운명/약화/석화/메스꺼움을 부여하는 효과에 내성 실패/대실패<br>몸의 완벽함이 약간 더 건강하게 유지합니다. <strong>대실패를 실패로, 실패를 성공으로</strong> 변경합니다."
  },
  {
    "id": "precious-metals",
    "name_ko": "귀금속",
    "name_en": "Precious Metals",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "조작"
    ],
    "range": "접촉",
    "target": "금속 무기 1",
    "duration": "1분",
    "summary": "무기를 귀금속으로 일시 변환합니다. 냉철(cold iron) 또는 은(silver)으로 변환하여 해당 재료의 약점을 활용할 수 있습니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 금속 무기 1<br><strong>지속 시간:</strong> 1분<br>무기를 귀금속으로 일시 변환합니다. 냉철(cold iron) 또는 은(silver)으로 변환하여 해당 재료의 약점을 활용할 수 있습니다."
  },
  {
    "id": "pulse-of-civilization",
    "name_ko": "문명의 맥박",
    "name_en": "Pulse of Civilization",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "조작"
    ],
    "duration": "유지",
    "summary": "사거리 내 정착지의 시대정신을 감지합니다. 정착지의 이름을 알게 됩니다. 해당 정착지에 대한 지식 회상이나 정보 수집의 모든 지식(Lore) 판정에 +2 상태 보너스를 얻으며, 미숙련이더라도 레벨을 숙련도 보너스로 사용합니다. 주문 시전 시 지식 기술로 즉시 지식 회상을 할 수 있습니다. 이 주문을 다시 시전하면 이전 시전이 종료됩니다.강화(5랭크):...",
    "desc": "<strong>지속 시간:</strong> 유지<br>사거리 내 정착지의 시대정신을 감지합니다. 정착지의 이름을 알게 됩니다. 해당 정착지에 대한 지식 회상이나 정보 수집의 모든 지식(Lore) 판정에 <strong>+2 상태 보너스</strong>를 얻으며, 미숙련이더라도 레벨을 숙련도 보너스로 사용합니다. 주문 시전 시 지식 기술로 즉시 지식 회상을 할 수 있습니다. 이 주문을 다시 시전하면 이전 시전이 종료됩니다.<br><strong>강화(5랭크):</strong> 사거리 100마일. <strong>강화(7랭크):</strong> 사거리 500마일, 보너스 +3."
  },
  {
    "id": "rebuke-death",
    "name_ko": "죽음의 거부",
    "name_en": "Rebuke Death",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "치유",
      "활력"
    ],
    "range": "20피트",
    "target": "생물 1(0 HP)",
    "duration": "즉시",
    "summary": "죽음 직전의 생물에 활력을 불어넣습니다. 0 HP인 대상이 4d6 HP를 회복합니다.강화(+1): 회복 +1d6.",
    "desc": "<strong>사거리:</strong> 20피트<br><strong>대상:</strong> 생물 1(0 HP)<br><strong>지속 시간:</strong> 즉시<br>죽음 직전의 생물에 활력을 불어넣습니다. 0 HP인 대상이 <strong>4d6 HP를 회복</strong>합니다.<br><strong>강화(+1):</strong> 회복 +1d6."
  },
  {
    "id": "retributive-pain",
    "name_ko": "보복의 고통",
    "name_en": "Retributive Pain",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "클레릭",
      "정신"
    ],
    "range": "30피트",
    "target": "유발 적",
    "defense": "인내",
    "trigger": "30피트 이내의 적이 당신이나 아군에게 피해를 줌",
    "summary": "고통을 가해자에게 복수적으로 되돌려줍니다. 대상은 유발 피해의 절반에 해당하는 정신 피해를 받습니다(기본 인내).",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 유발 적<br><strong>방어:</strong> 인내<br><strong>유발 조건:</strong> 30피트 이내의 적이 당신이나 아군에게 피해를 줌<br>고통을 가해자에게 복수적으로 되돌려줍니다. 대상은 유발 피해의 <strong>절반에 해당하는 정신 피해</strong>를 받습니다(기본 인내)."
  },
  {
    "id": "rune-of-observation",
    "name_ko": "감시의 룬",
    "name_en": "Rune of Observation",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "위저드",
      "탐지",
      "조작"
    ],
    "range": "접촉",
    "target": "표면 1",
    "duration": "다음 일일 준비까지",
    "summary": "공중에 보이지 않는 눈 모양의 룬을 새겨, 투시(clairvoyance)와 같은 감지기를 만듭니다. 생성 시 이 눈은 당신의 시야 내에 있어야 합니다. 주문의 지속 시간이 끝날 때마다, 자유 행동으로 집중점 1점을 소비하여 지속 시간을 1시간 더 연장할 수 있습니다(다음 일일 준비 시 즉시 종료).",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 표면 1<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>공중에 보이지 않는 눈 모양의 룬을 새겨, <em>투시(clairvoyance)</em>와 같은 감지기를 만듭니다. 생성 시 이 눈은 당신의 시야 내에 있어야 합니다. 주문의 지속 시간이 끝날 때마다, 자유 행동으로 집중점 1점을 소비하여 지속 시간을 1시간 더 연장할 수 있습니다(다음 일일 준비 시 즉시 종료)."
  },
  {
    "id": "safeguard-secret",
    "name_ko": "비밀 수호",
    "name_en": "Safeguard Secret",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "정신"
    ],
    "range": "10피트",
    "target": "최대 4 동의 생물",
    "duration": "1시간",
    "summary": "비밀을 지킵니다. 대상이 지정된 비밀에 대해 거짓말을 하면 기만 판정에 +4 상태 보너스. 정신 탐사(독심술 등)에도 비밀이 보호됩니다.",
    "desc": "<strong>사거리:</strong> 10피트<br><strong>대상:</strong> 최대 4 동의 생물<br><strong>지속 시간:</strong> 1시간<br>비밀을 지킵니다. 대상이 지정된 비밀에 대해 거짓말을 하면 기만 판정에 <strong>+4 상태 보너스</strong>. 정신 탐사(독심술 등)에도 비밀이 보호됩니다."
  },
  {
    "id": "shared-nightmare",
    "name_ko": "공유된 악몽",
    "name_en": "Shared Nightmare",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "비일상",
      "클레릭",
      "감정",
      "무력화",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "다양",
    "summary": "대상과 마음을 합쳐 괴로운 환영을 교환합니다. 의지 내성에 따라 둘 중 하나가 혼란(confused) 상태가 됩니다.대성공: 당신이 1라운드 동안 혼란.성공: 당신의 다음 턴 시작 시, 혼란 상태로 첫 행동을 수행하고 이후 정상 행동.실패: 대상은 매 턴 시작 시 혼란 상태로 첫 행동을 수행합니다. 지속 시간 1분.대실패: 대상은 혼란. 지속 시간 1분.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 다양<br>대상과 마음을 합쳐 괴로운 환영을 교환합니다. 의지 내성에 따라 둘 중 하나가 <strong>{{condition:Confused}}</strong> 상태가 됩니다.<br><strong>대성공:</strong> 당신이 <strong>1라운드</strong> 동안 혼란.<br><strong>성공:</strong> 당신의 다음 턴 시작 시, 혼란 상태로 첫 행동을 수행하고 이후 정상 행동.<br><strong>실패:</strong> 대상은 매 턴 시작 시 혼란 상태로 첫 행동을 수행합니다. 지속 시간 1분.<br><strong>대실패:</strong> 대상은 혼란. 지속 시간 1분."
  },
  {
    "id": "shifting-form",
    "name_ko": "변형",
    "name_en": "Shifting Form",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "변형"
    ],
    "duration": "1분",
    "summary": "형태를 변화시킵니다. 다음 중 하나를 선택: 등반 속도 20피트, 수영 속도 20피트, 암시야, 도달 +5피트 비무장 공격.강화(6랭크): 2가지 선택.",
    "desc": "<strong>지속 시간:</strong> 1분<br>형태를 변화시킵니다. 다음 중 하나를 선택: 등반 속도 20피트, 수영 속도 20피트, 암시야, 도달 +5피트 비무장 공격.<br><strong>강화(6랭크):</strong> 2가지 선택."
  },
  {
    "id": "spiral-of-horrors",
    "name_ko": "공포의 나선",
    "name_en": "Spiral of Horrors",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "감정",
      "공포",
      "환영",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "유지(최대 1분)",
    "summary": "끔찍한 환영의 소용돌이. 의지 실패 시 공포 2+4d6 정신 피해. 유지 시 재피해(2d6 정신, 의지 절반).",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 유지(최대 1분)<br>끔찍한 환영의 소용돌이. 의지 실패 시 <strong>공포 2+4d6 정신 피해</strong>. 유지 시 재피해(2d6 정신, 의지 절반)."
  },
  {
    "id": "take-its-course",
    "name_ko": "경과 관찰",
    "name_en": "Take Its Course",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "클레릭",
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "defense": "의지",
    "summary": "질병/독 고통이나 지속 독 피해의 진행을 서두르게 합니다. 대상이 즉시 다음 내성 굴림을 시도합니다. 내성에 +2 또는 -2 상태 보너스/페널티를 선택하여 부여할 수 있습니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br>질병/독 고통이나 지속 독 피해의 진행을 서두르게 합니다. 대상이 즉시 다음 내성 굴림을 시도합니다. 내성에 +2 또는 -2 상태 보너스/페널티를 선택하여 부여할 수 있습니다."
  },
  {
    "id": "tempt-fate",
    "name_ko": "운명 시험",
    "name_en": "Tempt Fate",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "비일상",
      "클레릭",
      "행운",
      "조작"
    ],
    "range": "120피트",
    "target": "유발 생물",
    "trigger": "사거리 내의 아군이 내성 굴림의 대상이 됨",
    "summary": "운명의 힘을 비틀어 한 순간을 극적이거나 평범하게 만듭니다. 대상은 유발 내성 굴림에 +1 상태 보너스를 얻습니다. 내성 굴림의 결과가 성공이면 대성공이 됩니다. 결과가 실패이면 대실패가 되며, 이 대실패는 대실패를 줄이는 능력으로 감소시킬 수 없습니다. 유발 능력이 대성공과 대실패 조건을 둘 다 가지고 있지 않다면, 운명 시험은 실패하며 이 주문의 ...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 유발 생물<br><strong>유발 조건:</strong> 사거리 내의 아군이 내성 굴림의 대상이 됨<br>운명의 힘을 비틀어 한 순간을 극적이거나 평범하게 만듭니다. 대상은 유발 내성 굴림에 <strong>+1 상태 보너스</strong>를 얻습니다. 내성 굴림의 결과가 성공이면 <strong>대성공</strong>이 됩니다. 결과가 실패이면 <strong>대실패</strong>가 되며, 이 대실패는 대실패를 줄이는 능력으로 감소시킬 수 없습니다. 유발 능력이 대성공과 대실패 조건을 둘 다 가지고 있지 않다면, 운명 시험은 실패하며 이 주문의 시전에 집중점을 소비하지 않습니다.<br><strong>강화(8랭크):</strong> 내성 보너스가 +2."
  },
  {
    "id": "touch-of-the-moon",
    "name_ko": "달의 접촉",
    "name_en": "Touch of the Moon",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "빛",
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "1분",
    "summary": "대상의 이마에 달의 상징이 나타나며, 은은한 달빛으로 빛납니다. 대상은 20피트 반경의 희미한 빛을 발합니다. 또한 달의 위상에 따른 혜택을 얻으며, 위상은 초승달부터 시작하여 대상의 각 턴 끝에 다음 단계로 변합니다.초승달: 추가 혜택 없음.상현달: 명중 굴림과 피해 굴림에 +1 상태 보너스.보름달: 명중 굴림, AC, 내성에 +1 상태 보너스, 피...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 1분<br>대상의 이마에 달의 상징이 나타나며, 은은한 달빛으로 빛납니다. 대상은 20피트 반경의 희미한 빛을 발합니다. 또한 달의 위상에 따른 혜택을 얻으며, 위상은 초승달부터 시작하여 대상의 각 턴 끝에 다음 단계로 변합니다.<br><strong>초승달:</strong> 추가 혜택 없음.<br><strong>상현달:</strong> 명중 굴림과 피해 굴림에 <strong>+1 상태 보너스</strong>.<br><strong>보름달:</strong> 명중 굴림, AC, 내성에 <strong>+1 상태 보너스</strong>, 피해 굴림에 <strong>+4 상태 보너스</strong>.<br><strong>하현달:</strong> AC와 내성 굴림에 <strong>+1 상태 보너스</strong>. 이 단계 후 초승달로 돌아갑니다."
  },
  {
    "id": "travelers-transit",
    "name_ko": "여행자의 통과",
    "name_en": "Traveler's Transit",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "비일상",
      "클레릭",
      "조작"
    ],
    "duration": "5분",
    "summary": "근육에 힘을 더해 수영이나 벽 타기를 쉽게 합니다. 이 주문을 시전하면 등반 속도 또는 수영 속도 중 하나를 얻으며, 그 속도는 당신의 지상 이동 속도와 같습니다.강화(5랭크): 대신 비행 속도를 얻을 수 있습니다.",
    "desc": "<strong>지속 시간:</strong> 5분<br>근육에 힘을 더해 수영이나 벽 타기를 쉽게 합니다. 이 주문을 시전하면 <strong>등반 속도</strong> 또는 <strong>수영 속도</strong> 중 하나를 얻으며, 그 속도는 당신의 지상 이동 속도와 같습니다.<br><strong>강화(5랭크):</strong> 대신 <strong>비행 속도</strong>를 얻을 수 있습니다."
  },
  {
    "id": "tricksters-twin",
    "name_ko": "속임수꾼의 분신",
    "name_en": "Trickster's Twin",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "비일상",
      "클레릭",
      "환영",
      "조작",
      "시각"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "1분",
    "summary": "한 장소에만 머무는 법이 없습니다. 대상이 볼 수 있는 100피트 이내의 위치를 선택합니다. 그곳에 대상만 볼 수 있고 당신의 모든 행동을 모방하는 당신의 환영을 만듭니다. 대상은 의지 내성을 시도해야 합니다.대성공: 대상은 영향 없음.성공: 대상은 당신이 지정된 위치에 있다고 믿으며 실제 위치에서는 당신을 볼 수 없습니다. 당신이 환영에 맞지 않는 ...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1분<br>한 장소에만 머무는 법이 없습니다. 대상이 볼 수 있는 100피트 이내의 위치를 선택합니다. 그곳에 대상만 볼 수 있고 당신의 모든 행동을 모방하는 당신의 환영을 만듭니다. 대상은 의지 내성을 시도해야 합니다.<br><strong>대성공:</strong> 대상은 영향 없음.<br><strong>성공:</strong> 대상은 당신이 지정된 위치에 있다고 믿으며 실제 위치에서는 당신을 볼 수 없습니다. 당신이 환영에 맞지 않는 행동(환영의 위치에서 말이 안 되는 행동)을 하거나, 대상이 공격하거나, 접촉하거나, 적대 행동을 사용하면 환영을 자동으로 불신합니다. 적대 행동을 사용하면 주문이 종료됩니다.<br><strong>실패:</strong> 성공과 같지만, 대상은 나열된 사건이 발생할 때마다 의지 내성에 성공해야 환영을 불신할 수 있습니다.<br><strong>대실패:</strong> 성공과 같지만, 대상은 나열된 사건 발생 시 의지 내성에 대성공해야 환영을 불신할 수 있습니다."
  },
  {
    "id": "vital-luminance",
    "name_ko": "활력의 빛",
    "name_en": "Vital Luminance",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭",
      "빛",
      "조작",
      "활력"
    ],
    "duration": "1분",
    "summary": "생명력을 끌어와 빛의 등대가 됩니다. 30피트 발산 밝은 빛. 내부 빛 저장소(4로 시작, 매 턴 +4). 빛 영역 내 언데드가 공격 시 저장소 절반의 활력 피해. 해제 시 저장소 전체의 HP를 살아있는 대상에 회복 또는 언데드 대상에 활력 피해.",
    "desc": "<strong>지속 시간:</strong> 1분<br>생명력을 끌어와 빛의 등대가 됩니다. 30피트 발산 밝은 빛. 내부 빛 저장소(4로 시작, 매 턴 +4). 빛 영역 내 언데드가 공격 시 저장소 절반의 활력 피해. 해제 시 저장소 전체의 HP를 살아있는 대상에 회복 또는 언데드 대상에 활력 피해."
  },
  {
    "id": "word-of-freedom",
    "name_ko": "자유의 말씀",
    "name_en": "Word of Freedom",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "클레릭"
    ],
    "range": "30피트",
    "target": "생물 1",
    "summary": "생물을 해방하는 자유의 말을 내뱉습니다. 다음 상태 중 하나를 선택하여 억제합니다: 혼란, 공포, 잡힘, 마비, 구속. 대상은 선택한 상태의 영향을 받지 않으며, 잡힘이나 구속을 억제하면 주문 시전 시 자동으로 해방됩니다.상태를 제공한 효과 자체를 제거하지 않으면, 주문이 끝난 후 상태가 돌아옵니다. 예를 들어, 혼란을 1분간 주는 주문이 있다면, 자...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br>생물을 해방하는 자유의 말을 내뱉습니다. 다음 상태 중 하나를 선택하여 억제합니다: 혼란, 공포, 잡힘, 마비, 구속. 대상은 선택한 상태의 영향을 받지 않으며, 잡힘이나 구속을 억제하면 주문 시전 시 자동으로 해방됩니다.<br>상태를 제공한 효과 자체를 제거하지 않으면, 주문이 끝난 후 상태가 돌아옵니다. 예를 들어, 혼란을 1분간 주는 주문이 있다면, 자유의 말씀은 1라운드 동안 대상이 정상적으로 행동하게 하지만, 혼란 상태는 이후에 돌아옵니다."
  },
  {
    "id": "zeal-for-battle",
    "name_ko": "전투 열정",
    "name_en": "Zeal for Battle",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "클레릭",
      "감정",
      "정신"
    ],
    "area": "10피트 발산",
    "trigger": "우선권 굴림 시작",
    "summary": "전투 열정이 불타오릅니다. 영역 내 아군이 우선권 굴림에 +2 상태 보너스. 가장 높은 우선권을 가진 아군 1명은 1라운드간 가속(quickened)(보폭/타격에만 사용 가능).",
    "desc": "<strong>영역:</strong> 10피트 발산<br><strong>유발 조건:</strong> 우선권 굴림 시작<br>전투 열정이 불타오릅니다. 영역 내 아군이 우선권 굴림에 <strong>+2 상태 보너스</strong>. 가장 높은 우선권을 가진 아군 1명은 1라운드간 <strong>{{condition:Quickened}}</strong>(보폭/타격에만 사용 가능)."
  },
  {
    "id": "ode-to-ouroboros",
    "name_ko": "뱀 물기의 송가",
    "name_en": "Ode to Ouroboros",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "반응",
    "traits": [
      "바드",
      "작곡"
    ],
    "range": "60피트",
    "target": "유발 생물",
    "trigger": "생물의 빈사 수치가 사망 수치에 도달할 때",
    "summary": "당신의 송가가 죽음을 막습니다. 대상의 빈사 수치가 사망 수치보다 1 낮게 유지됩니다. 분해(disintegrate)나 죽음 효과처럼 빈사 수치를 올리지 않고 죽이는 효과에는 도움이 되지 않습니다.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 유발 생물<br><strong>유발 조건:</strong> 생물의 빈사 수치가 사망 수치에 도달할 때<br>당신의 송가가 죽음을 막습니다. 대상의 빈사 수치가 사망 수치보다 <strong>1 낮게</strong> 유지됩니다. {{spell:Disintegrate}}나 죽음 효과처럼 빈사 수치를 올리지 않고 죽이는 효과에는 도움이 되지 않습니다."
  },
  {
    "id": "symphony-of-the-unfettered-heart",
    "name_ko": "속박 해방의 교향곡",
    "name_en": "Symphony of the Unfettered Heart",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "바드",
      "작곡"
    ],
    "range": "30피트",
    "target": "당신 또는 아군 1",
    "summary": "공연 판정으로 잡힘, 속박, 마비, 구속, 둔화, 기절 중 하나를 상쇄합니다. 상태의 원천에 따라 상쇄 DC 결정.강화(9랭크): 최대 4 대상.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 당신 또는 아군 1<br>공연 판정으로 잡힘, 속박, 마비, 구속, 둔화, 기절 중 하나를 상쇄합니다. 상태의 원천에 따라 상쇄 DC 결정.<br><strong>강화(9랭크):</strong> 최대 4 대상."
  },
  {
    "id": "soothing-ballad",
    "name_ko": "위로의 발라드",
    "name_en": "Soothing Ballad",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "바드",
      "작곡",
      "감정",
      "치유",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "당신+최대 9 아군",
    "summary": "뮤즈에 의지하여 아군을 치유합니다. 세 가지 효과 중 선택: 공포 상쇄 시도, 마비 상쇄 시도, 또는 7d8 HP 회복.강화(+1): 치유 시 +1d8.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 당신+최대 9 아군<br>뮤즈에 의지하여 아군을 치유합니다. 세 가지 효과 중 선택: 공포 상쇄 시도, 마비 상쇄 시도, 또는 <strong>7d8 HP 회복</strong>.<br><strong>강화(+1):</strong> 치유 시 +1d8."
  },
  {
    "id": "impaling-briars",
    "name_ko": "가시 꿰뚫기",
    "name_en": "Impaling Briars",
    "rank": 8,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "드루이드",
      "조작",
      "식물"
    ],
    "area": "100피트 발산",
    "duration": "유지(최대 1분)",
    "summary": "가시 나무가 영역에서 자라납니다. 영역이 험지. 당신이 험지를 무시. 유지 시 영역 내 적에 10d6 관통 피해(기본 반사). 이전에 피해를 받지 않은 적에게만.강화(9랭크): 피해 15d6.",
    "desc": "<strong>영역:</strong> 100피트 발산<br><strong>지속 시간:</strong> 유지(최대 1분)<br>가시 나무가 영역에서 자라납니다. 영역이 <strong>험지</strong>. 당신이 험지를 무시. 유지 시 영역 내 적에 <strong>10d6 관통 피해</strong>(기본 반사). 이전에 피해를 받지 않은 적에게만.<br><strong>강화(9랭크):</strong> 피해 15d6."
  },
  {
    "id": "fatal-aria",
    "name_ko": "치명적 아리아",
    "name_en": "Fatal Aria",
    "rank": 10,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "1행동",
    "traits": [
      "비일상",
      "바드",
      "작곡",
      "죽음",
      "감정",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "summary": "너무나 완벽한 음악을 연주하여 대상이 기쁨이나 슬픔으로 죽을 수 있습니다. 대상으로 삼은 후 해당 생물은 1분간 일시 면역이 됩니다. 효과는 대상의 레벨과 현재 HP에 따라 달라집니다.16레벨 이하: 대상이 즉시 사망합니다.17레벨: 대상의 HP가 50 이하이면 즉시 사망합니다. 그렇지 않으면 HP가 0으로 떨어지고 빈사 1이 됩니다.18레벨 이상: ...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br>너무나 완벽한 음악을 연주하여 대상이 기쁨이나 슬픔으로 죽을 수 있습니다. 대상으로 삼은 후 해당 생물은 <strong>1분간 일시 면역</strong>이 됩니다. 효과는 대상의 레벨과 현재 HP에 따라 달라집니다.<br><strong>16레벨 이하:</strong> 대상이 즉시 사망합니다.<br><strong>17레벨:</strong> 대상의 HP가 50 이하이면 즉시 사망합니다. 그렇지 않으면 HP가 0으로 떨어지고 빈사 1이 됩니다.<br><strong>18레벨 이상:</strong> 대상이 50 피해를 받습니다. 이로 인해 HP가 0이 되면 즉시 사망합니다."
  },
  {
    "id": "pied-piping",
    "name_ko": "피리 부는 사나이",
    "name_en": "Pied Piping",
    "rank": 10,
    "is_cantrip": false,
    "is_focus": true,
    "traditions": [],
    "actions": "2행동",
    "traits": [
      "바드",
      "작곡",
      "무력화",
      "정신",
      "음파"
    ],
    "area": "5피트 발산",
    "defense": "의지",
    "duration": "1분",
    "summary": "청취자를 황홀하게 하여 따라오도록 합니다. 유지 시 반경 +5피트. 실패 시 매혹+모든 행동으로 당신을 향해 이동+칭찬. 대실패 시 하수인 특성+지배당함.",
    "desc": "<strong>영역:</strong> 5피트 발산<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1분<br>청취자를 황홀하게 하여 따라오도록 합니다. 유지 시 반경 +5피트. 실패 시 매혹+모든 행동으로 당신을 향해 이동+칭찬. 대실패 시 하수인 특성+지배당함."
  },
  {
    "id": "air-bubble",
    "name_ko": "공기 방울",
    "name_en": "Air Bubble",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "primal"
    ],
    "actions": "반응",
    "traits": [
      "조작"
    ],
    "range": "60피트",
    "target": "유발 생물",
    "duration": "1분",
    "trigger": "생물이 물에 빠지거나 공기가 없는 환경에 들어감",
    "summary": "유발 생물의 머리 주위에 신선한 공기로 된 작은 방울을 만들어냅니다. 이 공기 방울에는 대상이 정상적으로 호흡할 수 있는 충분한 공기가 들어 있습니다. 물이나 진공 상태의 대기는 방울 안으로 들어오지 않지만, 독성 가스 같은 다른 효과는 여전히 영향을 줄 수 있습니다.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 유발 생물<br><strong>지속 시간:</strong> 1분<br><strong>유발 조건:</strong> 생물이 물에 빠지거나 공기가 없는 환경에 들어감<br>유발 생물의 머리 주위에 신선한 공기로 된 작은 방울을 만들어냅니다. 이 공기 방울에는 대상이 정상적으로 호흡할 수 있는 충분한 공기가 들어 있습니다. 물이나 진공 상태의 대기는 방울 안으로 들어오지 않지만, 독성 가스 같은 다른 효과는 여전히 영향을 줄 수 있습니다."
  },
  {
    "id": "ant-haul",
    "name_ko": "개미 운반",
    "name_en": "Ant Haul",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "8시간",
    "summary": "대상의 근골격계를 강화하여 더 많은 무게를 견딜 수 있게 합니다. 대상은 과적(encumbered) 상태가 되기 전에 3 부피를 추가로 운반할 수 있으며, 최대 6 부피까지 추가로 운반할 수 있습니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 8시간<br>대상의 근골격계를 강화하여 더 많은 무게를 견딜 수 있게 합니다. 대상은 {{condition:Encumbered}} 상태가 되기 전에 <strong>3 부피</strong>를 추가로 운반할 수 있으며, 최대 <strong>6 부피</strong>까지 추가로 운반할 수 있습니다."
  },
  {
    "id": "bane",
    "name_ko": "재앙",
    "name_en": "Bane",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "정신"
    ],
    "area": "10피트 발산",
    "defense": "의지",
    "duration": "1분",
    "summary": "적의 마음을 의심으로 채웁니다. 영역 내 적은 의지 내성에 성공하거나 영역에 있는 한 명중 굴림에 -1 상태 페널티를 받아야 합니다. 이후 매 턴 한 번 주문을 유지하여 발산 반경을 10피트씩 증가시키고, 아직 영향받지 않은 영역 내 적에게 새로운 내성을 강요할 수 있습니다. 재앙(bane)은 축복(bless)을 상쇄할 수 있습니다.",
    "desc": "<strong>영역:</strong> 10피트 발산<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1분<br>적의 마음을 의심으로 채웁니다. 영역 내 적은 의지 내성에 성공하거나 영역에 있는 한 명중 굴림에 <strong>-1 상태 페널티</strong>를 받아야 합니다. 이후 매 턴 한 번 주문을 유지하여 발산 반경을 <strong>10피트</strong>씩 증가시키고, 아직 영향받지 않은 영역 내 적에게 새로운 내성을 강요할 수 있습니다. <em>{{spell:Bane}}</em>은 <em>{{spell:Bless}}</em>을 상쇄할 수 있습니다."
  },
  {
    "id": "bless",
    "name_ko": "축복",
    "name_en": "Bless",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "정신"
    ],
    "area": "15피트 발산",
    "duration": "1분",
    "summary": "아군의 공격을 영역 내에서 강화합니다. 영역 내의 당신을 포함한 아군은 영역에 있는 한 명중 굴림에 +1 상태 보너스를 얻습니다. 이후 매 턴 한 번 주문을 유지하여 발산 반경을 10피트씩 증가시킬 수 있습니다. 축복(bless)은 재앙(bane)을 상쇄할 수 있습니다.",
    "desc": "<strong>영역:</strong> 15피트 발산<br><strong>지속 시간:</strong> 1분<br>아군의 공격을 영역 내에서 강화합니다. 영역 내의 당신을 포함한 아군은 영역에 있는 한 명중 굴림에 <strong>+1 상태 보너스</strong>를 얻습니다. 이후 매 턴 한 번 주문을 유지하여 발산 반경을 <strong>10피트</strong>씩 증가시킬 수 있습니다. <em>{{spell:Bless}}</em>은 <em>{{spell:Bane}}</em>을 상쇄할 수 있습니다."
  },
  {
    "id": "breathe-fire",
    "name_ko": "불 뿜기",
    "name_en": "Breathe Fire",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "화염",
      "조작"
    ],
    "area": "15피트 원뿔",
    "defense": "기본 반사",
    "summary": "입에서 화염의 원뿔을 내뿜습니다. 영역 내 각 생물은 2d6 화염 피해를 받고 기본 반사 내성을 시도합니다.강화(+1): 피해 +2d6.",
    "desc": "<strong>영역:</strong> 15피트 원뿔<br><strong>방어:</strong> 기본 반사<br>입에서 화염의 원뿔을 내뿜습니다. 영역 내 각 생물은 <strong>2d6 화염 피해</strong>를 받고 <strong>기본 반사 내성</strong>을 시도합니다.<br><strong>강화(+1):</strong> 피해 +2d6."
  },
  {
    "id": "charm",
    "name_ko": "매혹",
    "name_en": "Charm",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "감정",
      "무력화",
      "조작",
      "정신",
      "은밀"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "1시간",
    "summary": "대상을 당신의 친구로 여기도록 마법적으로 매혹합니다. 대상이 최근(지난 1시간 이내) 당신이나 아군에게 위협이나 적대 행동을 받았다면, 의지 내성에 +4 상황 보너스를 받습니다. 대상은 의지 내성을 시도합니다. 이 주문의 지속 시간 동안, 당신이나 아군이 대상에 대해 적대 행동을 수행하면 주문이 즉시 종료됩니다.대성공: 영향 없음. 대상이 당신이 매혹...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1시간<br>대상을 당신의 친구로 여기도록 마법적으로 매혹합니다. 대상이 최근(지난 1시간 이내) 당신이나 아군에게 위협이나 적대 행동을 받았다면, 의지 내성에 <strong>+4 상황 보너스</strong>를 받습니다. 대상은 의지 내성을 시도합니다. 이 주문의 지속 시간 동안, 당신이나 아군이 대상에 대해 적대 행동을 수행하면 주문이 즉시 종료됩니다.<br><strong>대성공:</strong> 영향 없음. 대상이 당신이 매혹하려 했음을 인지합니다.<br><strong>성공:</strong> 영향 없음.<br><strong>실패:</strong> 대상의 태도가 당신에 대해 <strong>{{condition:Friendly}}</strong>으로 변합니다. 대상은 당신이 마법을 걸었음을 인지하지 못합니다.<br><strong>대실패:</strong> 대상의 태도가 <strong>{{condition:Helpful}}</strong>으로 변합니다. 대상은 당신이 마법을 걸었음을 인지하지 못합니다.<br>어느 경우든, 주문이 종료되면 대상은 자신이 매혹당했음을 깨닫고, 당신을 적대적 대상으로 분류할 수 있습니다.<br><strong>강화(4랭크):</strong> 지속 시간이 <strong>다음 일일 준비까지</strong>로 증가합니다.<br><strong>강화(8랭크):</strong> 지속 시간이 다음 일일 준비까지이며, 최대 <strong>10</strong> 생물을 대상으로 삼을 수 있습니다."
  },
  {
    "id": "cleanse-cuisine",
    "name_ko": "음식 정화",
    "name_en": "Cleanse Cuisine",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "10피트",
    "area": "1 세제곱피트",
    "summary": "영역 내 모든 음식과 음료를 맛있는 음식으로 변환합니다. 물을 와인이나 다른 고급 음료로, 음식의 맛과 재료를 미식가 수준으로 향상. 독소와 오염물질 제거 가능. 이후 오염, 자연 부패, 영양 향상은 불가.강화(+2): 영역에 인접한 1 세제곱피트 추가.",
    "desc": "<strong>사거리:</strong> 10피트<br><strong>영역:</strong> 1 세제곱피트<br>영역 내 모든 음식과 음료를 맛있는 음식으로 변환합니다. 물을 와인이나 다른 고급 음료로, 음식의 맛과 재료를 미식가 수준으로 향상. 독소와 오염물질 제거 가능. 이후 오염, 자연 부패, 영양 향상은 불가.<br><strong>강화(+2):</strong> 영역에 인접한 1 세제곱피트 추가."
  },
  {
    "id": "command",
    "name_ko": "명령",
    "name_en": "Command",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "청각",
      "언어",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "대상의 다음 턴 끝까지",
    "summary": "대상에게 한 마디 명령을 내립니다. 다음 중 하나를 선택합니다:다가오기(Approach): 대상은 자신의 다음 턴에 당신을 향해 이동합니다.도망치기(Flee): 대상은 자신의 다음 턴에 가능한 한 빨리 당신에게서 멀어집니다.놓기(Drop): 대상은 들고 있는 모든 것을 떨어뜨립니다.엎드리기(Fall Prone): 대상은 엎드려집니다.일어서기(Stand...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 대상의 다음 턴 끝까지<br>대상에게 한 마디 명령을 내립니다. 다음 중 하나를 선택합니다:<br><strong>다가오기(Approach):</strong> 대상은 자신의 다음 턴에 당신을 향해 이동합니다.<br><strong>도망치기(Flee):</strong> 대상은 자신의 다음 턴에 가능한 한 빨리 당신에게서 멀어집니다.<br><strong>놓기(Drop):</strong> 대상은 들고 있는 모든 것을 떨어뜨립니다.<br><strong>엎드리기(Fall Prone):</strong> 대상은 엎드려집니다.<br><strong>일어서기(Stand Still):</strong> 대상은 아무것도 하지 않습니다.<br>대상은 의지 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 영향 없음.<br><strong>실패:</strong> 자신의 다음 턴 <strong>첫 번째 행동</strong>으로 명령한 행동을 수행해야 합니다.<br><strong>대실패:</strong> 대상은 다음 턴의 <strong>모든 행동</strong>을 명령을 수행하는 데 사용해야 합니다.<br><strong>강화(5랭크):</strong> 최대 <strong>10</strong> 생물을 대상으로 삼을 수 있습니다."
  },
  {
    "id": "create-water",
    "name_ko": "물 생성",
    "name_en": "Create Water",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "물"
    ],
    "range": "0피트",
    "summary": "물이 손이나 용기에서 솟아오릅니다. 중형 생물 1명이 하루에 정상적인 식수로 필요로 하는 2갤런의 깨끗하고 신선한 물을 만들어냅니다. 물은 비마법적이며, 원하는 용기에 담을 수 있습니다.",
    "desc": "<strong>사거리:</strong> 0피트<br>물이 손이나 용기에서 솟아오릅니다. 중형 생물 1명이 하루에 정상적인 식수로 필요로 하는 <strong>2갤런의 깨끗하고 신선한 물</strong>을 만들어냅니다. 물은 비마법적이며, 원하는 용기에 담을 수 있습니다."
  },
  {
    "id": "detect-poison",
    "name_ko": "독 감지",
    "name_en": "Detect Poison",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "탐지",
      "조작"
    ],
    "range": "30피트",
    "target": "물체 또는 생물 1",
    "summary": "생물이 독성인지 또는 물체가 독인지/독이 묻었는지를 탐지합니다. 여러 종류의 독인지, 독의 유형은 알 수 없습니다. 납이나 알코올 같은 물질도 독이므로 다른 독을 가립니다.강화(2랭크): 독의 수와 유형을 알 수 있습니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 물체 또는 생물 1<br>생물이 독성인지 또는 물체가 독인지/독이 묻었는지를 탐지합니다. 여러 종류의 독인지, 독의 유형은 알 수 없습니다. 납이나 알코올 같은 물질도 독이므로 다른 독을 가립니다.<br><strong>강화(2랭크):</strong> 독의 수와 유형을 알 수 있습니다."
  },
  {
    "id": "dizzying-colors",
    "name_ko": "현란한 색채",
    "name_en": "Dizzying Colors",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "조작",
      "시각"
    ],
    "range": "15피트",
    "area": "15피트 원뿔",
    "defense": "의지",
    "summary": "현란하게 소용돌이치는 색채의 폭발이 영역 내 생물의 시야를 어지럽힙니다. 영역 내 각 생물은 의지 내성을 시도합니다.대성공: 영향 없음.성공: 1라운드 동안 현혹됨(dazzled).실패: 기절(stunned) 1, 1라운드 동안 실명(blinded), 1분 동안 현혹됨(dazzled).대실패: 1라운드 동안 기절(stunned), 1분 동안 실명(bl...",
    "desc": "<strong>사거리:</strong> 15피트<br><strong>영역:</strong> 15피트 원뿔<br><strong>방어:</strong> 의지<br>현란하게 소용돌이치는 색채의 폭발이 영역 내 생물의 시야를 어지럽힙니다. 영역 내 각 생물은 의지 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> <strong>1라운드</strong> 동안 <strong>{{condition:Dazzled}}</strong>.<br><strong>실패:</strong> <strong>{{condition:Stunned}} 1</strong>, <strong>1라운드</strong> 동안 <strong>{{condition:Blinded}}</strong>, <strong>1분</strong> 동안 <strong>{{condition:Dazzled}}</strong>.<br><strong>대실패:</strong> <strong>1라운드</strong> 동안 <strong>{{condition:Stunned}}</strong>, <strong>1분</strong> 동안 <strong>{{condition:Blinded}}</strong>."
  },
  {
    "id": "enfeeble",
    "name_ko": "쇠약",
    "name_en": "Enfeeble",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "인내",
    "duration": "1분",
    "summary": "대상의 근육과 힘줄을 약화시키는 에너지를 보냅니다. 대상은 인내 내성을 시도합니다.대성공: 영향 없음.성공: 주문의 지속 시간 동안 약화(enfeebled) 1 상태가 됩니다.실패: 주문의 지속 시간 동안 약화 2 상태가 됩니다.대실패: 주문의 지속 시간 동안 약화 3 상태가 됩니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br><strong>지속 시간:</strong> 1분<br>대상의 근육과 힘줄을 약화시키는 에너지를 보냅니다. 대상은 인내 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 주문의 지속 시간 동안 <strong>{{condition:Enfeebled}} 1</strong> 상태가 됩니다.<br><strong>실패:</strong> 주문의 지속 시간 동안 <strong>약화 2</strong> 상태가 됩니다.<br><strong>대실패:</strong> 주문의 지속 시간 동안 <strong>약화 3</strong> 상태가 됩니다."
  },
  {
    "id": "fear",
    "name_ko": "공포",
    "name_en": "Fear",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "감정",
      "공포",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "summary": "대상에게 불안과 공포의 파동을 보내 겁먹게 합니다. 대상은 의지 내성을 시도합니다.대성공: 영향 없음.성공: 공포(frightened) 1 상태가 됩니다.실패: 공포 2 상태가 됩니다.대실패: 공포 3 상태가 되고, 1라운드 동안 도주(fleeing) 상태가 됩니다.강화(3랭크): 최대 5명의 생물을 대상으로 삼을 수 있습니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br>대상에게 불안과 공포의 파동을 보내 겁먹게 합니다. 대상은 의지 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> <strong>{{condition:Frightened}} 1</strong> 상태가 됩니다.<br><strong>실패:</strong> <strong>공포 2</strong> 상태가 됩니다.<br><strong>대실패:</strong> <strong>공포 3</strong> 상태가 되고, <strong>1라운드</strong> 동안 <strong>{{condition:Fleeing}}</strong> 상태가 됩니다.<br><strong>강화(3랭크):</strong> 최대 <strong>5</strong>명의 생물을 대상으로 삼을 수 있습니다."
  },
  {
    "id": "fleet-step",
    "name_ko": "순발력",
    "name_en": "Fleet Step",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "duration": "1분",
    "summary": "발걸음이 경쾌해집니다. 주문의 지속 시간 동안 이동 속도에 +30피트 상태 보너스를 얻습니다.",
    "desc": "<strong>지속 시간:</strong> 1분<br>발걸음이 경쾌해집니다. 주문의 지속 시간 동안 이동 속도에 <strong>+30피트 상태 보너스</strong>를 얻습니다."
  },
  {
    "id": "force-barrage",
    "name_ko": "힘의 포격",
    "name_en": "Force Barrage",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "1~3행동",
    "traits": [
      "힘",
      "조작"
    ],
    "range": "120피트",
    "target": "생물 1",
    "summary": "자동 명중하는 마법 힘의 파편을 날립니다. 파편당 1d4+1 힘 피해. 1행동 시 1발, 2행동 시 2발, 3행동 시 3발. 각 파편의 대상을 개별로 선택할 수 있습니다. 같은 대상에 여러 파편이 명중하면 피해를 합산한 후 적용합니다.강화(+2): 행동당 파편 1발 추가.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 생물 1<br>자동 명중하는 마법 힘의 파편을 날립니다. 파편당 <strong>1d4+1 힘 피해</strong>. 1행동 시 <strong>1발</strong>, 2행동 시 <strong>2발</strong>, 3행동 시 <strong>3발</strong>. 각 파편의 대상을 개별로 선택할 수 있습니다. 같은 대상에 여러 파편이 명중하면 피해를 합산한 후 적용합니다.<br><strong>강화(+2):</strong> 행동당 파편 1발 추가."
  },
  {
    "id": "gentle-landing",
    "name_ko": "부드러운 착지",
    "name_en": "Gentle Landing",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "반응",
    "traits": [
      "공기"
    ],
    "range": "60피트",
    "target": "낙하 중인 생물 1",
    "duration": "1분",
    "trigger": "사거리 내 생물이 낙하 중",
    "summary": "대상의 낙하 속도가 라운드당 60피트로 느려지며, 주문 지속 중 낙하 피해를 받지 않습니다.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 낙하 중인 생물 1<br><strong>지속 시간:</strong> 1분<br><strong>유발 조건:</strong> 사거리 내 생물이 낙하 중<br>대상의 낙하 속도가 라운드당 60피트로 느려지며, 주문 지속 중 <strong>낙하 피해를 받지 않습니다</strong>."
  },
  {
    "id": "goblin-pox",
    "name_ko": "고블린 천연두",
    "name_en": "Goblin Pox",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "질병",
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "defense": "인내",
    "summary": "대성공: 영향 없음.성공: 메스꺼움(sickened) 1.실패: 고블린 천연두 1단계에 감염됩니다.대실패: 고블린 천연두 2단계에 감염됩니다.고블린 천연두(질병, 레벨 1): 1단계: 메스꺼움 1 (1라운드); 2단계: 메스꺼움 1과 둔화 1 (1라운드); 3단계: 메스꺼움 1이며 1 미만으로 줄일 수 없음 (1일).",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> <strong>{{condition:Sickened}} 1</strong>.<br><strong>실패:</strong> 고블린 천연두 1단계에 감염됩니다.<br><strong>대실패:</strong> 고블린 천연두 2단계에 감염됩니다.<br><strong>고블린 천연두(질병, 레벨 1):</strong> 1단계: 메스꺼움 1 (1라운드); 2단계: 메스꺼움 1과 둔화 1 (1라운드); 3단계: 메스꺼움 1이며 1 미만으로 줄일 수 없음 (1일)."
  },
  {
    "id": "grease",
    "name_ko": "기름칠",
    "name_en": "Grease",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "area": "인접한 5피트 칸 4개 또는",
    "target": "1 벌크 이하 물체 1",
    "duration": "1분",
    "summary": "영역에 시전: 험지가 됩니다. 해당 영역으로 이동하는 생물은 반사 내성 또는 곡예 판정에 성공하지 못하면 엎드림 상태가 됩니다.물체에 시전: 물체를 집으려면 곡예 판정 또는 반사 내성이 필요합니다. 실패하면 물체를 사용하는 판정에 -2 상황 페널티. 대실패하면 물체를 놓칩니다. 착용 물체에 시전하면 잡기에 대한 인내 내성에 +2 상황 보너스를 받습니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>영역:</strong> 인접한 5피트 칸 4개 또는<br><strong>대상:</strong> 1 벌크 이하 물체 1<br><strong>지속 시간:</strong> 1분<br><strong>영역에 시전:</strong> 험지가 됩니다. 해당 영역으로 이동하는 생물은 반사 내성 또는 곡예 판정에 성공하지 못하면 엎드림 상태가 됩니다.<br><strong>물체에 시전:</strong> 물체를 집으려면 곡예 판정 또는 반사 내성이 필요합니다. 실패하면 물체를 사용하는 판정에 <strong>-2 상황 페널티</strong>. 대실패하면 물체를 놓칩니다. 착용 물체에 시전하면 잡기에 대한 인내 내성에 <strong>+2 상황 보너스</strong>를 받습니다."
  },
  {
    "id": "grim-tendrils",
    "name_ko": "암울한 촉수",
    "name_en": "Grim Tendrils",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "공허"
    ],
    "area": "30피트 직선",
    "defense": "인내",
    "summary": "음산한 공허 에너지의 촉수가 직선으로 뻗어나갑니다. 경로에 있는 각 살아있는 생물은 2d4 공허 피해와 1 지속 출혈 피해를 받으며, 기본 인내 내성을 시도합니다.대성공: 영향 없음.성공: 공허 피해 절반, 지속 출혈 없음.실패: 전체 피해.대실패: 공허 피해와 지속 출혈 피해가 두 배가 됩니다.강화(+1): 공허 피해 +2d4, 지속 출혈 피해 +1.",
    "desc": "<strong>영역:</strong> 30피트 직선<br><strong>방어:</strong> 인내<br>음산한 공허 에너지의 촉수가 직선으로 뻗어나갑니다. 경로에 있는 각 살아있는 생물은 <strong>2d4 공허 피해</strong>와 <strong>1 지속 출혈 피해</strong>를 받으며, 기본 인내 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 공허 피해 절반, 지속 출혈 없음.<br><strong>실패:</strong> 전체 피해.<br><strong>대실패:</strong> 공허 피해와 지속 출혈 피해가 두 배가 됩니다.<br><strong>강화(+1):</strong> 공허 피해 +2d4, 지속 출혈 피해 +1."
  },
  {
    "id": "gust-of-wind",
    "name_ko": "돌풍",
    "name_en": "Gust of Wind",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "공기",
      "조작"
    ],
    "area": "60피트 직선",
    "defense": "인내",
    "duration": "다음 턴 시작까지",
    "summary": "당신으로부터 강력한 바람이 불어나갑니다. 작은 불을 끄고, 안개/연기를 흩어냅니다. 대형 이하 생물은 인내 내성을 시도합니다. 영역에 진입하는 대형 이하 생물도 같은 내성을 시도합니다.대성공: 영향 없음.성공: 바람을 거슬러 이동할 수 없습니다.실패: 엎드림 상태가 됩니다. 비행 중이면 대실패 효과를 대신 받습니다.대실패: 바람 방향으로 30피트 밀려...",
    "desc": "<strong>영역:</strong> 60피트 직선<br><strong>방어:</strong> 인내<br><strong>지속 시간:</strong> 다음 턴 시작까지<br>당신으로부터 강력한 바람이 불어나갑니다. 작은 불을 끄고, 안개/연기를 흩어냅니다. 대형 이하 생물은 인내 내성을 시도합니다. 영역에 진입하는 대형 이하 생물도 같은 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 바람을 거슬러 이동할 수 없습니다.<br><strong>실패:</strong> 엎드림 상태가 됩니다. 비행 중이면 대실패 효과를 대신 받습니다.<br><strong>대실패:</strong> 바람 방향으로 <strong>30피트</strong> 밀려나고, 엎드림 상태가 되며, <strong>2d6 둔기 피해</strong>를 받습니다."
  },
  {
    "id": "harm",
    "name_ko": "해로움",
    "name_en": "Harm",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "1~3행동",
    "traits": [
      "조작",
      "공허"
    ],
    "range": "다양",
    "target": "살아있는 생물 1 또는 동의하는 언데드 생물 1",
    "summary": "공허 에너지를 방출합니다. 1d8 공허 피해, 기본 인내. 언데드에게는 HP를 회복시킵니다.[1행동] 사거리 접촉. [2행동](집중) 사거리 30피트, 회복 +8. [3행동](집중) 30피트 발산, 모든 살아있는 생물과 언데드에 영향.강화(+1): 피해/회복 +1d8, 2행동 회복 +8.",
    "desc": "<strong>사거리:</strong> 다양<br><strong>대상:</strong> 살아있는 생물 1 또는 동의하는 언데드 생물 1<br>공허 에너지를 방출합니다. <strong>1d8 공허 피해</strong>, 기본 인내. 언데드에게는 HP를 회복시킵니다.<br><strong>[1행동]</strong> 사거리 접촉. <strong>[2행동]</strong>(집중) 사거리 30피트, 회복 +8. <strong>[3행동]</strong>(집중) 30피트 발산, 모든 살아있는 생물과 언데드에 영향.<br><strong>강화(+1):</strong> 피해/회복 +1d8, 2행동 회복 +8."
  },
  {
    "id": "heal",
    "name_ko": "치유",
    "name_en": "Heal",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "primal"
    ],
    "actions": "1~3행동",
    "traits": [
      "치유",
      "조작",
      "생명력"
    ],
    "range": "다양",
    "target": "동의하는 살아있는 생물 1 또는 언데드 생물 1",
    "summary": "생명력 에너지를 방출합니다. 1d8. 언데드에게는 생명력 피해, 기본 인내.[1행동] 사거리 접촉. [2행동](집중) 사거리 30피트, 회복 +8. [3행동](집중) 30피트 발산.강화(+1): +1d8, 2행동 +8.",
    "desc": "<strong>사거리:</strong> 다양<br><strong>대상:</strong> 동의하는 살아있는 생물 1 또는 언데드 생물 1<br>생명력 에너지를 방출합니다. <strong>1d8</strong>. 언데드에게는 생명력 피해, 기본 인내.<br><strong>[1행동]</strong> 사거리 접촉. <strong>[2행동]</strong>(집중) 사거리 30피트, 회복 +8. <strong>[3행동]</strong>(집중) 30피트 발산.<br><strong>강화(+1):</strong> +1d8, 2행동 +8."
  },
  {
    "id": "hydraulic-push",
    "name_ko": "수류 밀기",
    "name_en": "Hydraulic Push",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "공격",
      "조작",
      "물"
    ],
    "range": "60피트",
    "target": "생물 1 또는 비고정 물체 1",
    "defense": "AC",
    "summary": "원거리 주문 명중 굴림을 합니다.대성공: 6d6 둔기 피해, 10피트 밀려남.성공: 3d6 둔기 피해, 5피트 밀려남.강화(+1): 피해 +2d6.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 생물 1 또는 비고정 물체 1<br><strong>방어:</strong> AC<br>원거리 주문 명중 굴림을 합니다.<br><strong>대성공:</strong> <strong>6d6 둔기 피해</strong>, 10피트 밀려남.<br><strong>성공:</strong> <strong>3d6 둔기 피해</strong>, 5피트 밀려남.<br><strong>강화(+1):</strong> 피해 +2d6."
  },
  {
    "id": "ill-omen",
    "name_ko": "흉조",
    "name_en": "Ill Omen",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "불운"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "1라운드",
    "summary": "불운의 저주를 내립니다. 의지 실패 시 대상의 다음 판정에서 d20을 두 번 굴려 낮은 것을 사용(불운 효과).",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1라운드<br>불운의 저주를 내립니다. 의지 실패 시 대상의 다음 판정에서 <strong>d20을 두 번 굴려 낮은 것을 사용</strong>(불운 효과)."
  },
  {
    "id": "illusory-disguise",
    "name_ko": "환영 변장",
    "name_en": "Illusory Disguise",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작",
      "시각"
    ],
    "duration": "1시간",
    "summary": "자신의 외모를 변경하여 다른 사람처럼 보이게 하는 환영을 만듭니다. 같은 기본 체형의 생물(인간형이면 인간형)로만 위장할 수 있으며, 키와 체중을 약간(1피트 이내) 변경할 수 있습니다. 옷과 장비의 외양도 변경됩니다. 생물이 환영과 상호작용하면(접촉 등), 지각 판정을 주문 DC에 대해 시도하여 환영을 불신할 수 있습니다. 불신에 성공한 생물에게 환...",
    "desc": "<strong>지속 시간:</strong> 1시간<br>자신의 외모를 변경하여 다른 사람처럼 보이게 하는 환영을 만듭니다. 같은 기본 체형의 생물(인간형이면 인간형)로만 위장할 수 있으며, 키와 체중을 약간(1피트 이내) 변경할 수 있습니다. 옷과 장비의 외양도 변경됩니다. 생물이 환영과 상호작용하면(접촉 등), <strong>지각 판정</strong>을 주문 DC에 대해 시도하여 환영을 불신할 수 있습니다. 불신에 성공한 생물에게 환영은 흐릿하게 보입니다.<br><strong>강화(2랭크):</strong> 다른 체형의 생물로도 위장할 수 있습니다(극단적 크기 차이 제외).<br><strong>강화(3랭크):</strong> 최대 <strong>10</strong>명의 동의하는 생물을 대상으로 삼을 수 있습니다."
  },
  {
    "id": "illusory-object",
    "name_ko": "환영 물체",
    "name_en": "Illusory Object",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작",
      "시각"
    ],
    "range": "500피트",
    "area": "20피트 정육면체",
    "duration": "10분",
    "summary": "물체의 시각적으로 설득력 있는 환영을 만듭니다. 살아있는 생물이나 물리적 힘은 만들 수 없습니다. 환영은 시각적으로만 존재하며, 소리, 냄새, 질감 같은 비시각 감각에는 환영의 정체가 드러납니다. 물리적 상호작용(만지기, 물체 위에 올라서기 등)을 시도하면 환영이 불신됩니다. 불신한 생물에게는 환영이 흐릿하고 반투명하게 보입니다.강화(2랭크): 영역이...",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>영역:</strong> 20피트 정육면체<br><strong>지속 시간:</strong> 10분<br>물체의 시각적으로 설득력 있는 환영을 만듭니다. 살아있는 생물이나 물리적 힘은 만들 수 없습니다. 환영은 시각적으로만 존재하며, 소리, 냄새, 질감 같은 비시각 감각에는 환영의 정체가 드러납니다. 물리적 상호작용(만지기, 물체 위에 올라서기 등)을 시도하면 환영이 불신됩니다. 불신한 생물에게는 환영이 흐릿하고 반투명하게 보입니다.<br><strong>강화(2랭크):</strong> 영역이 <strong>40피트 정육면체</strong>로 증가합니다.<br><strong>강화(5랭크):</strong> 영역이 최대 <strong>200피트</strong>까지 증가하고, 환영에 적절한 소리를 포함할 수 있습니다."
  },
  {
    "id": "infuse-vitality",
    "name_ko": "활력 주입",
    "name_en": "Infuse Vitality",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "활력"
    ],
    "range": "접촉",
    "target": "동의 생물 1",
    "duration": "1분",
    "summary": "공격에 활력 에너지를 불어넣어 언데드에 추가 피해를 줍니다. 대상의 타격이 언데드에 추가 1d6 활력 피해를 줍니다.강화(+2): 추가 피해 +1d6.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의 생물 1<br><strong>지속 시간:</strong> 1분<br>공격에 활력 에너지를 불어넣어 언데드에 추가 피해를 줍니다. 대상의 타격이 언데드에 <strong>추가 1d6 활력 피해</strong>를 줍니다.<br><strong>강화(+2):</strong> 추가 피해 +1d6."
  },
  {
    "id": "item-facade",
    "name_ko": "아이템 외관",
    "name_en": "Item Facade",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작",
      "시각"
    ],
    "range": "접촉",
    "target": "아이템 1개",
    "duration": "1시간",
    "summary": "대상 아이템을 다른 아이템처럼 보이게 만듭니다. 아이템은 같은 부피(Bulk)를 가진 비마법 아이템의 외형을 취할 수 있지만, 실제보다 품질이 낮거나 더 낡은 것처럼 보입니다(또는 원한다면 부서지지 않을 것처럼 보이게 할 수도 있습니다). 아이템과 상호작용하는 성공적인 조작(Interact) 행동 또는 탐색(Seek) 행동은 환영을 불신하기 위한 의지...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 아이템 1개<br><strong>지속 시간:</strong> 1시간<br>대상 아이템을 다른 아이템처럼 보이게 만듭니다. 아이템은 같은 부피(Bulk)를 가진 비마법 아이템의 외형을 취할 수 있지만, 실제보다 품질이 낮거나 더 낡은 것처럼 보입니다(또는 원한다면 부서지지 않을 것처럼 보이게 할 수도 있습니다). 아이템과 상호작용하는 성공적인 조작(Interact) 행동 또는 탐색(Seek) 행동은 환영을 불신하기 위한 의지 내성 굴림을 허용합니다.<br><strong>강화(3랭크):</strong> 아이템은 같은 유형의 다른 아이템처럼 보일 수 있습니다(예: 다른 종류의 음식, 또는 다른 종류의 목재). 또한 최대 1 부피만큼 더 무겁거나 가벼운 비마법 아이템처럼 보일 수도 있습니다."
  },
  {
    "id": "jump",
    "name_ko": "도약",
    "name_en": "Jump",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "1행동",
    "traits": [
      "조작"
    ],
    "summary": "인상적인 도약을 합니다. 즉시 높이뛰기 또는 멀리뛰기를 합니다. 운동 판정 대신 주문 명중 굴림을 사용하며, 질주 없이 멀리뛰기가 가능합니다.강화(3랭크): 최대 도약 거리 30피트.",
    "desc": "인상적인 도약을 합니다. 즉시 높이뛰기 또는 멀리뛰기를 합니다. 운동 판정 대신 <strong>주문 명중 굴림</strong>을 사용하며, 질주 없이 멀리뛰기가 가능합니다.<br><strong>강화(3랭크):</strong> 최대 도약 거리 30피트."
  },
  {
    "id": "lock",
    "name_ko": "잠금",
    "name_en": "Lock",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "잠긴 문, 용기 등 1",
    "duration": "다음 일일 준비까지",
    "summary": "자물쇠를 훨씬 열기 어렵게 만듭니다. 도둑질 DC에 +4 상태 보너스를 추가합니다. 열쇠(knock) 주문은 잠금의 랭크에 따라 상쇄를 시도합니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 잠긴 문, 용기 등 1<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>자물쇠를 훨씬 열기 어렵게 만듭니다. 도둑질 DC에 <strong>+4 상태 보너스</strong>를 추가합니다. {{spell:Knock}} 주문은 잠금의 랭크에 따라 상쇄를 시도합니다."
  },
  {
    "id": "mending",
    "name_ko": "수선",
    "name_en": "Mending",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "가벼운 부피 이하의 비마법 물체 1",
    "castTime": "10분",
    "summary": "대상 아이템을 수리합니다. 주문 랭크당 5 HP를 회복시키며, 파손 한계치를 넘으면 파손(broken) 상태가 해제됩니다. 잃어버린 부품을 교체하거나 완전히 파괴된 물체를 수리할 수는 없습니다.강화(2랭크): 1 부피 이하의 비마법 물체.강화(3랭크): 2 부피 이하의 비마법 물체, 또는 1 부피 이하의 마법 물체.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 가벼운 부피 이하의 비마법 물체 1<br><strong>시전:</strong> 10분<br>대상 아이템을 수리합니다. 주문 랭크당 <strong>5 HP</strong>를 회복시키며, 파손 한계치를 넘으면 {{condition:Broken}} 상태가 해제됩니다. 잃어버린 부품을 교체하거나 완전히 파괴된 물체를 수리할 수는 없습니다.<br><strong>강화(2랭크):</strong> 1 부피 이하의 비마법 물체.<br><strong>강화(3랭크):</strong> 2 부피 이하의 비마법 물체, 또는 1 부피 이하의 마법 물체."
  },
  {
    "id": "mystic-armor",
    "name_ko": "신비 갑옷",
    "name_en": "Mystic Armor",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "duration": "다음 일일 준비까지",
    "summary": "빛나는 마법 에너지로 자신을 감싸 보호합니다. AC에 +1 아이템 보너스, 최대 민첩 수정치 +5를 얻습니다. 비갑옷 숙련도를 사용하여 AC를 계산합니다.강화(4랭크): 내성 굴림에 +1 아이템 보너스.강화(6랭크): AC 아이템 보너스가 +2로 증가, 내성에 +1 아이템 보너스.강화(8랭크): AC 아이템 보너스가 +2, 내성에 +2 아이템 보너스....",
    "desc": "<strong>지속 시간:</strong> 다음 일일 준비까지<br>빛나는 마법 에너지로 자신을 감싸 보호합니다. AC에 <strong>+1 아이템 보너스</strong>, 최대 민첩 수정치 +5를 얻습니다. 비갑옷 숙련도를 사용하여 AC를 계산합니다.<br><strong>강화(4랭크):</strong> 내성 굴림에 <strong>+1 아이템 보너스</strong>.<br><strong>강화(6랭크):</strong> AC 아이템 보너스가 <strong>+2</strong>로 증가, 내성에 +1 아이템 보너스.<br><strong>강화(8랭크):</strong> AC 아이템 보너스가 <strong>+2</strong>, 내성에 <strong>+2</strong> 아이템 보너스.<br><strong>강화(10랭크):</strong> AC 아이템 보너스가 <strong>+3</strong>, 내성에 <strong>+3</strong> 아이템 보너스."
  },
  {
    "id": "pest-form",
    "name_ko": "해충 형태",
    "name_en": "Pest Form",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "duration": "10분",
    "summary": "위협적이지 않은 작은 동물로 변신합니다. 고양이, 곤충, 도마뱀, 쥐 중 하나. 작은(Tiny) 크기. AC = 15 + 레벨. 속도 20피트. 물리 약점 5. 미광 시각, 부정확 후각 30피트. 곡예 및 은신 +10(자신의 수정치가 더 높으면 그것을 사용). 운동 -4.강화(4랭크): 날 수 있는 생물도 선택 가능, 비행 속도 20피트.",
    "desc": "<strong>지속 시간:</strong> 10분<br>위협적이지 않은 작은 동물로 변신합니다. 고양이, 곤충, 도마뱀, 쥐 중 하나. 작은(Tiny) 크기. AC = 15 + 레벨. 속도 20피트. 물리 약점 5. 미광 시각, 부정확 후각 30피트. 곡예 및 은신 +10(자신의 수정치가 더 높으면 그것을 사용). 운동 -4.<br><strong>강화(4랭크):</strong> 날 수 있는 생물도 선택 가능, 비행 속도 20피트."
  },
  {
    "id": "pet-cache",
    "name_ko": "반려 은닉",
    "name_en": "Pet Cache",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "사역마 또는 동물 동료",
    "duration": "8시간",
    "summary": "사역마나 동물 동료를 주머니 차원에 숨깁니다. 해제하거나 지속 시간이 끝나면 즉시 나타납니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 사역마 또는 동물 동료<br><strong>지속 시간:</strong> 8시간<br>사역마나 동물 동료를 주머니 차원에 숨깁니다. 해제하거나 지속 시간이 끝나면 즉시 나타납니다."
  },
  {
    "id": "phantasmal-minion",
    "name_ko": "환영 하수인",
    "name_en": "Phantasmal Minion",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "3행동",
    "traits": [
      "조작",
      "소환"
    ],
    "range": "60피트",
    "duration": "유지",
    "summary": "인간형의 윤곽을 가진 환영 하수인을 소환합니다. 하수인을 투명하게 만들거나 덧없는 모습으로 만들 수 있지만, 명백히 마법적 효과이며 실제 생물이 아닙니다. 하수인은 일반 하수인 규칙을 따릅니다.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>지속 시간:</strong> 유지<br>인간형의 윤곽을 가진 환영 하수인을 소환합니다. 하수인을 투명하게 만들거나 덧없는 모습으로 만들 수 있지만, 명백히 마법적 효과이며 실제 생물이 아닙니다. 하수인은 일반 하수인 규칙을 따릅니다."
  },
  {
    "id": "phantom-pain",
    "name_ko": "환영 고통",
    "name_en": "Phantom Pain",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작",
      "정신",
      "비치사"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "1분",
    "summary": "환영의 고통이 대상을 괴롭힙니다. 2d4 정신 피해와 1d4 지속 정신 피해, 의지 내성.대성공: 영향 없음.성공: 전체 초기 피해, 지속 피해 없음, 주문 즉시 종료.실패: 전체 초기 및 지속 피해, 메스꺼움(sickened) 1. 메스꺼움에서 회복하면 지속 피해와 주문이 종료됩니다.대실패: 실패와 같지만, 메스꺼움 2.강화(+1): 초기 피해 +2...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1분<br>환영의 고통이 대상을 괴롭힙니다. <strong>2d4 정신 피해</strong>와 <strong>1d4 지속 정신 피해</strong>, 의지 내성.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 전체 초기 피해, 지속 피해 없음, 주문 즉시 종료.<br><strong>실패:</strong> 전체 초기 및 지속 피해, <strong>{{condition:Sickened}} 1</strong>. 메스꺼움에서 회복하면 지속 피해와 주문이 종료됩니다.<br><strong>대실패:</strong> 실패와 같지만, <strong>메스꺼움 2</strong>.<br><strong>강화(+1):</strong> 초기 피해 +2d4, 지속 피해 +1d4."
  },
  {
    "id": "protection",
    "name_ko": "보호",
    "name_en": "Protection",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "동의 생물 1",
    "duration": "1분",
    "summary": "대상의 아머 클래스와 내성 굴림에 +1 상태 보너스를 부여합니다.강화(3랭크): 10피트 발산 내 모든 아군에게 적용할 수 있습니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의 생물 1<br><strong>지속 시간:</strong> 1분<br>대상의 아머 클래스와 내성 굴림에 <strong>+1 상태 보너스</strong>를 부여합니다.<br><strong>강화(3랭크):</strong> 10피트 발산 내 모든 아군에게 적용할 수 있습니다."
  },
  {
    "id": "pummeling-rubble",
    "name_ko": "파쇄 잔해",
    "name_en": "Pummeling Rubble",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "대지",
      "조작"
    ],
    "area": "15피트 원뿔",
    "defense": "반사",
    "summary": "돌과 잔해를 원뿔로 발사합니다. 2d4 둔기 피해.대성공: 영향 없음.성공: 피해 절반.실패: 전체 피해, 5피트 밀려남.대실패: 피해 2배, 10피트 밀려남.강화(+1): 피해 +2d4.",
    "desc": "<strong>영역:</strong> 15피트 원뿔<br><strong>방어:</strong> 반사<br>돌과 잔해를 원뿔로 발사합니다. <strong>2d4 둔기 피해</strong>.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 피해 절반.<br><strong>실패:</strong> 전체 피해, 5피트 밀려남.<br><strong>대실패:</strong> 피해 2배, 10피트 밀려남.<br><strong>강화(+1):</strong> 피해 +2d4."
  },
  {
    "id": "runic-body",
    "name_ko": "문자 몸",
    "name_en": "Runic Body",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult",
      "primal"
    ],
    "actions": "1행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "동의하는 생물 1",
    "duration": "1분",
    "summary": "생물의 비무장 공격에 일시적으로 마법 룬을 적용합니다. 비무장 공격이 +1 타격(striking) 무기가 된 것처럼 명중 굴림에 +1 아이템 보너스를 얻고 피해 주사위가 2개가 됩니다.강화(6랭크): +2 상위 타격(greater striking). 강화(9랭크): +3 최상위 타격(major striking).",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의하는 생물 1<br><strong>지속 시간:</strong> 1분<br>생물의 비무장 공격에 일시적으로 마법 룬을 적용합니다. 비무장 공격이 +1 타격(striking) 무기가 된 것처럼 명중 굴림에 <strong>+1 아이템 보너스</strong>를 얻고 피해 주사위가 2개가 됩니다.<br><strong>강화(6랭크):</strong> +2 상위 타격(greater striking). <strong>강화(9랭크):</strong> +3 최상위 타격(major striking)."
  },
  {
    "id": "runic-weapon",
    "name_ko": "문자 무기",
    "name_en": "Runic Weapon",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "1행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "무기 1(무주인 또는 동의하는 생물이 든)",
    "duration": "1분",
    "summary": "무기에 일시적으로 마법 룬을 적용합니다. 무기가 +1 타격(striking) 무기가 됩니다.강화(6랭크): +2 상위 타격(greater striking). 강화(9랭크): +3 최상위 타격(major striking).",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 무기 1(무주인 또는 동의하는 생물이 든)<br><strong>지속 시간:</strong> 1분<br>무기에 일시적으로 마법 룬을 적용합니다. 무기가 +1 타격(striking) 무기가 됩니다.<br><strong>강화(6랭크):</strong> +2 상위 타격(greater striking). <strong>강화(9랭크):</strong> +3 최상위 타격(major striking)."
  },
  {
    "id": "sanctuary",
    "name_ko": "성소",
    "name_en": "Sanctuary",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "defense": "의지",
    "duration": "1분",
    "summary": "생물을 공격받지 않도록 보호합니다. 대상을 공격하거나 해치려는 생물은 먼저 의지 내성을 시도해야 합니다. 대상이 적대 행동을 하면 주문 종료.대성공: 성소 종료. 성공: 이번 공격 및 이번 턴의 추가 공격 시도 가능. 실패: 공격 불가, 행동 낭비. 대실패: 행동 낭비, 성소가 지속되는 동안 추가 공격 시도 불가.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1분<br>생물을 공격받지 않도록 보호합니다. 대상을 공격하거나 해치려는 생물은 먼저 <strong>의지 내성</strong>을 시도해야 합니다. 대상이 적대 행동을 하면 주문 종료.<br><strong>대성공:</strong> 성소 종료. <strong>성공:</strong> 이번 공격 및 이번 턴의 추가 공격 시도 가능. <strong>실패:</strong> 공격 불가, 행동 낭비. <strong>대실패:</strong> 행동 낭비, 성소가 지속되는 동안 추가 공격 시도 불가."
  },
  {
    "id": "sleep",
    "name_ko": "수면",
    "name_en": "Sleep",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "조작",
      "정신",
      "수면"
    ],
    "range": "30피트",
    "area": "5피트 폭발",
    "defense": "의지",
    "summary": "영역 내 각 생물이 졸음에 빠집니다. 잠든 생물은 엎드리거나 들고 있는 물건을 떨어뜨리지 않습니다. 지각 판정 성공으로 깨어나는 것을 막지 않으므로, 전투 유용성이 제한됩니다.대성공: 영향 없음.성공: 1라운드 동안 지각 판정에 -1 상태 페널티.실패: 무의식(unconscious). 1분 후에도 무의식이면 자동으로 깨어남.대실패: 무의식. 1시간 후...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>영역:</strong> 5피트 폭발<br><strong>방어:</strong> 의지<br>영역 내 각 생물이 졸음에 빠집니다. 잠든 생물은 엎드리거나 들고 있는 물건을 떨어뜨리지 않습니다. 지각 판정 성공으로 깨어나는 것을 막지 않으므로, 전투 유용성이 제한됩니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 1라운드 동안 지각 판정에 <strong>-1 상태 페널티</strong>.<br><strong>실패:</strong> <strong>{{condition:Unconscious}}</strong>. 1분 후에도 무의식이면 자동으로 깨어남.<br><strong>대실패:</strong> <strong>무의식</strong>. 1시간 후에도 무의식이면 자동으로 깨어남.<br><strong>강화(4랭크):</strong> 실패 시 1라운드, 대실패 시 1분 동안 무의식. 엎드리며 들고 있던 물건을 놓습니다. 지각 판정으로 깨어날 수 없습니다. 지속 시간이 끝나면 자동으로 깨어나는 대신 정상적으로 수면합니다."
  },
  {
    "id": "soothe",
    "name_ko": "위로",
    "name_en": "Soothe",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "감정",
      "치유",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "동의 생물 1",
    "duration": "1분",
    "summary": "대상의 정신을 안정시켜 상처를 치유합니다. 1d10+4 HP를 회복하고, 주문 지속 시간 동안 정신 효과에 대한 내성에 +2 상태 보너스를 얻습니다.강화(+1): 회복 +1d10+4.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 동의 생물 1<br><strong>지속 시간:</strong> 1분<br>대상의 정신을 안정시켜 상처를 치유합니다. <strong>1d10+4 HP</strong>를 회복하고, 주문 지속 시간 동안 정신 효과에 대한 내성에 <strong>+2 상태 보너스</strong>를 얻습니다.<br><strong>강화(+1):</strong> 회복 +1d10+4."
  },
  {
    "id": "spider-sting",
    "name_ko": "거미 독",
    "name_en": "Spider Sting",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "독"
    ],
    "range": "접촉",
    "target": "생물 1",
    "defense": "인내",
    "summary": "1d4 관통 피해 + 거미 독. 대성공: 영향 없음. 성공: 1d4 독 피해. 실패: 거미 독 1단계. 대실패: 거미 독 2단계.거미 독(독): 레벨 1; 최대 지속 4라운드; 1단계: 1d4 독 피해 + 약화(enfeebled) 1 (1라운드); 2단계: 1d4 독 피해 + 약화 2 (1라운드).",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br><strong>1d4 관통 피해</strong> + 거미 독. <strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 1d4 독 피해. <strong>실패:</strong> 거미 독 1단계. <strong>대실패:</strong> 거미 독 2단계.<br>거미 독(독): 레벨 1; 최대 지속 4라운드; 1단계: 1d4 독 피해 + {{condition:Enfeebled}} 1 (1라운드); 2단계: 1d4 독 피해 + 약화 2 (1라운드)."
  },
  {
    "id": "spirit-link",
    "name_ko": "영혼 연결",
    "name_en": "Spirit Link",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "치유",
      "조작"
    ],
    "range": "30피트",
    "target": "동의하는 생물 1",
    "duration": "10분",
    "summary": "당신의 턴 시작 시, 대상이 최대 HP 미만이면 대상이 2 HP를 회복하고 당신이 같은 양만큼 HP를 잃습니다. 이 전달은 영적 전달로 어떤 효과도 적용되지 않으며, 활력이나 공허와 무관합니다. 해제 가능. 0 HP가 되면 종료.강화(+1): 전달 HP +2.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 동의하는 생물 1<br><strong>지속 시간:</strong> 10분<br>당신의 턴 시작 시, 대상이 최대 HP 미만이면 대상이 2 HP를 회복하고 당신이 같은 양만큼 HP를 잃습니다. 이 전달은 영적 전달로 어떤 효과도 적용되지 않으며, 활력이나 공허와 무관합니다. 해제 가능. 0 HP가 되면 종료.<br><strong>강화(+1):</strong> 전달 HP +2."
  },
  {
    "id": "summon-animal",
    "name_ko": "동물 소환",
    "name_en": "Summon Animal",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "당신을 위해 싸울 동물을 소환합니다. 주문 랭크 -1 이하 레벨의 동물을 소환합니다. 소환된 동물은 하수인 특성을 얻습니다.강화(2랭크): 주문 랭크 이하 레벨. 이후 랭크마다 더 강한 동물 소환 가능.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>당신을 위해 싸울 동물을 소환합니다. 주문 랭크 -1 이하 레벨의 동물을 소환합니다. 소환된 동물은 하수인 특성을 얻습니다.<br><strong>강화(2랭크):</strong> 주문 랭크 이하 레벨. <strong>이후 랭크마다 더 강한 동물 소환 가능.</strong>"
  },
  {
    "id": "summon-construct",
    "name_ko": "구조물 소환",
    "name_en": "Summon Construct",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "구조체를 소환합니다. 주문 랭크 -1 이하 레벨.강화(2랭크 이후): 더 강한 구조체.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>구조체를 소환합니다. 주문 랭크 -1 이하 레벨.<br><strong>강화(2랭크 이후):</strong> 더 강한 구조체."
  },
  {
    "id": "summon-fey",
    "name_ko": "페이 소환",
    "name_en": "Summon Fey",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult",
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "페이를 소환합니다. 주문 랭크 -1 이하 레벨.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>페이를 소환합니다. 주문 랭크 -1 이하 레벨."
  },
  {
    "id": "summon-plant-or-fungus",
    "name_ko": "자연 식물 소환",
    "name_en": "Summon Plant or Fungus",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "식물이나 균류 생물을 소환합니다. 주문 랭크 -1 이하 레벨.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>식물이나 균류 생물을 소환합니다. 주문 랭크 -1 이하 레벨."
  },
  {
    "id": "summon-undead",
    "name_ko": "언데드 소환",
    "name_en": "Summon Undead",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "언데드를 소환합니다. 주문 랭크 -1 이하 레벨.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>언데드를 소환합니다. 주문 랭크 -1 이하 레벨."
  },
  {
    "id": "sure-strike",
    "name_ko": "확실한 타격",
    "name_en": "Sure Strike",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "1행동",
    "traits": [],
    "duration": "턴 종료까지",
    "summary": "다음 명중 굴림에서 d20을 두 번 굴려 높은 것을 사용합니다. 명중 굴림에 대한 상황 페널티와 은폐(concealed) 또는 숨겨짐(hidden)으로 인한 일반 판정(flat check)을 무시합니다.",
    "desc": "<strong>지속 시간:</strong> 턴 종료까지<br>다음 명중 굴림에서 <strong>d20을 두 번 굴려 높은 것을 사용</strong>합니다. 명중 굴림에 대한 상황 페널티와 {{condition:Concealed}} 또는 {{condition:Hidden}}으로 인한 일반 판정(flat check)을 무시합니다."
  },
  {
    "id": "tailwind",
    "name_ko": "순풍",
    "name_en": "Tailwind",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "공기",
      "조작"
    ],
    "range": "접촉",
    "target": "접촉한 생물 1",
    "duration": "1시간",
    "summary": "바람이 대상을 밀어줍니다. 이동 속도에 +10피트 상태 보너스.강화(2랭크): 지속 시간 8시간.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 접촉한 생물 1<br><strong>지속 시간:</strong> 1시간<br>바람이 대상을 밀어줍니다. 이동 속도에 <strong>+10피트 상태 보너스</strong>.<br><strong>강화(2랭크):</strong> 지속 시간 8시간."
  },
  {
    "id": "thunderstrike",
    "name_ko": "뇌격",
    "name_en": "Thunderstrike",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "전기",
      "조작",
      "음파"
    ],
    "range": "120피트",
    "target": "생물 1",
    "defense": "기본 반사",
    "summary": "천둥과 함께 번개 덩굴이 내려쳐 1d12 전기 피해와 1d4 음파 피해를 줍니다(기본 반사 내성). 금속 갑옷이나 금속으로 이루어진 대상은 내성에 -1 상황 페널티를 받으며, 피해를 받으면 1라운드 동안 서투름(clumsy) 1이 됩니다.강화(+1): 전기 피해 +1d12, 음파 피해 +1d4.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 기본 반사<br>천둥과 함께 번개 덩굴이 내려쳐 <strong>1d12 전기 피해</strong>와 <strong>1d4 음파 피해</strong>를 줍니다(기본 반사 내성). 금속 갑옷이나 금속으로 이루어진 대상은 내성에 <strong>-1 상황 페널티</strong>를 받으며, 피해를 받으면 <strong>1라운드 동안 {{condition:Clumsy}} 1</strong>이 됩니다.<br><strong>강화(+1):</strong> 전기 피해 +1d12, 음파 피해 +1d4."
  },
  {
    "id": "ventriloquism",
    "name_ko": "복화술",
    "name_en": "Ventriloquism",
    "rank": 1,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "청각",
      "환영",
      "조작"
    ],
    "duration": "10분",
    "summary": "목소리를 던집니다. 60피트 이내의 다른 위치에서 목소리가 나오는 것처럼 만듭니다. 지각 판정으로 불신 가능.강화(2랭크): 지속 시간 1시간, 음조/음질/양상을 변경 가능. 불신 전에 능동적으로 지각 판정을 시도하거나 소리와 상호작용하는 행동을 사용해야 합니다.",
    "desc": "<strong>지속 시간:</strong> 10분<br>목소리를 던집니다. 60피트 이내의 다른 위치에서 목소리가 나오는 것처럼 만듭니다. 지각 판정으로 불신 가능.<br><strong>강화(2랭크):</strong> 지속 시간 1시간, 음조/음질/양상을 변경 가능. 불신 전에 능동적으로 지각 판정을 시도하거나 소리와 상호작용하는 행동을 사용해야 합니다."
  },
  {
    "id": "acid-grip",
    "name_ko": "산성 집게",
    "name_en": "Acid Grip",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "산성",
      "조작"
    ],
    "range": "120피트",
    "target": "생물 1",
    "defense": "반사",
    "duration": "1분",
    "summary": "덧없는 발톱 달린 손이 대상을 움켜쥐고 마법의 산으로 태웁니다. 대상은 반사 내성에 따라 2d8 산성 피해와 1d6 지속 산성 피해를 받습니다. 이 주문의 지속 피해를 받고 있는 생물은 모든 이동 속도에 -10피트 상태 페널티를 받습니다.대성공: 영향 없음.성공: 절반 피해, 지속 피해 없음. 발톱이 대상을 당신이 선택한 방향으로 최대 5피트 이동시킵...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 반사<br><strong>지속 시간:</strong> 1분<br>덧없는 발톱 달린 손이 대상을 움켜쥐고 마법의 산으로 태웁니다. 대상은 반사 내성에 따라 <strong>2d8 산성 피해</strong>와 <strong>1d6 지속 산성 피해</strong>를 받습니다. 이 주문의 지속 피해를 받고 있는 생물은 모든 이동 속도에 <strong>-10피트 상태 페널티</strong>를 받습니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 절반 피해, 지속 피해 없음. 발톱이 대상을 당신이 선택한 방향으로 최대 5피트 이동시킵니다.<br><strong>실패:</strong> 전체 피해 및 지속 피해. 발톱이 대상을 최대 10피트 이동시킵니다.<br><strong>대실패:</strong> 2배 피해 및 전체 지속 피해. 발톱이 대상을 최대 20피트 이동시킵니다.<br><strong>강화(+2):</strong> 초기 피해 +2d8, 지속 산성 피해 +1d6."
  },
  {
    "id": "animal-form",
    "name_ko": "동물 형태",
    "name_en": "Animal Form",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "duration": "1분",
    "summary": "동물 전투 형태로 변신. 중형(일부 대형), AC=16+레벨, 임시 HP 5. 곰, 황소, 고양이, 사슴, 개, 상어, 뱀 등 선택. 각 형태마다 고유 공격과 이동.강화(3랭크): 공격 +14, 피해 +5. 강화(5랭크): 거대, 도달 15피트.",
    "desc": "<strong>지속 시간:</strong> 1분<br>동물 전투 형태로 변신. 중형(일부 대형), AC=16+레벨, 임시 HP 5. 곰, 황소, 고양이, 사슴, 개, 상어, 뱀 등 선택. 각 형태마다 고유 공격과 이동.<br><strong>강화(3랭크):</strong> 공격 +14, 피해 +5. <strong>강화(5랭크):</strong> 거대, 도달 15피트."
  },
  {
    "id": "animal-messenger",
    "name_ko": "동물의 메신저",
    "name_en": "Animal Messenger",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "120피트",
    "target": "작은(Tiny) 동물 1",
    "duration": "다음 일일 준비까지",
    "summary": "작은 동물에게 메시지를 맡겨 지정 위치의 지정 대상에게 전달하게 합니다. 동물이 일반 속도로 이동하여 대상에게 도달하면 메시지를 전달합니다.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 작은(Tiny) 동물 1<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>작은 동물에게 메시지를 맡겨 지정 위치의 지정 대상에게 전달하게 합니다. 동물이 일반 속도로 이동하여 대상에게 도달하면 메시지를 전달합니다."
  },
  {
    "id": "blazing-bolt",
    "name_ko": "타오르는 화살",
    "name_en": "Blazing Bolt",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "1~3행동",
    "traits": [
      "공격",
      "화염",
      "조작"
    ],
    "range": "60피트",
    "target": "1+ 생물",
    "defense": "AC",
    "summary": "타오르는 열기와 불꽃의 광선을 발사합니다. 대상에 대해 주문 명중 굴림을 합니다.소비하는 행동 수에 따라 효과가 달라집니다:[1행동](언어) 대상 1명에게 광선 1개, 2d6 화염 피해.[2행동](집중, 조작) 대상 1명에게 광선 1개, 4d6 화염 피해.[3행동](집중, 조작, 언어) 사거리 내 서로 다른 대상 최대 3명에게 각각 광선 1개, 각 4...",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 1+ 생물<br><strong>방어:</strong> AC<br>타오르는 열기와 불꽃의 광선을 발사합니다. 대상에 대해 <strong>주문 명중 굴림</strong>을 합니다.<br>소비하는 행동 수에 따라 효과가 달라집니다:<br><strong>[1행동]</strong>(언어) 대상 1명에게 광선 1개, <strong>2d6 화염 피해</strong>.<br><strong>[2행동]</strong>(집중, 조작) 대상 1명에게 광선 1개, <strong>4d6 화염 피해</strong>.<br><strong>[3행동]</strong>(집중, 조작, 언어) 사거리 내 서로 다른 대상 최대 3명에게 각각 광선 1개, 각 <strong>4d6 화염 피해</strong>.<br>각 광선에 대해 별도의 주문 명중 굴림을 합니다. 치명적 명중 시 2배 피해. <strong>다중공격 페널티</strong>는 이 주문의 모든 명중 굴림이 끝난 후에 적용됩니다.<br><strong>강화(+1):</strong> 각 광선의 피해 +1d6."
  },
  {
    "id": "blood-vendetta",
    "name_ko": "혈의 복수",
    "name_en": "Blood Vendetta",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "반응",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "유발 생물",
    "defense": "의지",
    "trigger": "생물이 당신에게 피해를 가함",
    "summary": "당신을 공격한 자에게 피의 저주를 걸어, 상처가 멈추지 않게 합니다. 대상은 의지 내성을 시도합니다.대성공: 영향 없음.성공: 1d6 지속 출혈 피해.실패: 2d6 지속 출혈 피해.대실패: 4d6 지속 출혈 피해.강화(+2): 각 결과의 지속 출혈 피해가 1d6씩 증가합니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 유발 생물<br><strong>방어:</strong> 의지<br><strong>유발 조건:</strong> 생물이 당신에게 피해를 가함<br>당신을 공격한 자에게 피의 저주를 걸어, 상처가 멈추지 않게 합니다. 대상은 의지 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> <strong>1d6 지속 출혈 피해</strong>.<br><strong>실패:</strong> <strong>2d6 지속 출혈 피해</strong>.<br><strong>대실패:</strong> <strong>4d6 지속 출혈 피해</strong>.<br><strong>강화(+2):</strong> 각 결과의 지속 출혈 피해가 1d6씩 증가합니다."
  },
  {
    "id": "blur",
    "name_ko": "흐림",
    "name_en": "Blur",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "1분",
    "summary": "대상의 형체가 흐릿하게 나타납니다. 대상은 은폐(concealed) 상태가 됩니다. 이 효과의 특성상 대상의 위치는 여전히 명확하므로, 대상은 이 은폐를 이용하여 숨기(Hide)나 은밀 이동(Sneak)을 할 수 없습니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 1분<br>대상의 형체가 흐릿하게 나타납니다. 대상은 <strong>{{condition:Concealed}}</strong> 상태가 됩니다. 이 효과의 특성상 대상의 위치는 여전히 명확하므로, 대상은 이 은폐를 이용하여 숨기(Hide)나 은밀 이동(Sneak)을 할 수 없습니다."
  },
  {
    "id": "calm",
    "name_ko": "진정",
    "name_en": "Calm",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "감정",
      "무력화",
      "조작",
      "정신"
    ],
    "range": "120피트",
    "area": "10피트 폭발",
    "defense": "의지",
    "duration": "유지(최대 1분)",
    "summary": "영역 내 생물의 감정을 잠재워 평화롭게 합니다. 영역 내 각 생물은 의지 내성을 시도합니다.대성공: 영향 없음. 이 시전에 대해 면역이 됩니다.성공: 명중 굴림에 -1 상태 페널티를 1라운드 동안 받습니다.실패: 감정이 억압됩니다. 생물은 적대 행동을 할 수 없습니다. 다른 생물이 영향 받은 생물에게 적대 행동을 하면 그 생물에 대한 효과가 종료됩니다...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 10피트 폭발<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 유지(최대 1분)<br>영역 내 생물의 감정을 잠재워 평화롭게 합니다. 영역 내 각 생물은 의지 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음. 이 시전에 대해 면역이 됩니다.<br><strong>성공:</strong> 명중 굴림에 <strong>-1 상태 페널티</strong>를 1라운드 동안 받습니다.<br><strong>실패:</strong> 감정이 억압됩니다. 생물은 <strong>적대 행동을 할 수 없습니다</strong>. 다른 생물이 영향 받은 생물에게 적대 행동을 하면 그 생물에 대한 효과가 종료됩니다. 생물이 적대 행동을 시도하면 주문이 즉시 종료됩니다.<br><strong>대실패:</strong> 실패와 같지만, 다른 생물이 적대 행동을 해도 효과가 종료되지 않습니다."
  },
  {
    "id": "cleanse-affliction",
    "name_ko": "고통 정화",
    "name_en": "Cleanse Affliction",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "치유",
      "조작"
    ],
    "range": "접촉",
    "target": "동의 생물 1",
    "castTime": "1분",
    "summary": "대상의 몸에서 고통을 몰아내려 시도합니다. 대상에게 영향을 미치고 있는 저주, 질병, 또는 독 중 하나를 선택합니다. 해당 고통이 현재 1단계 이상이라면, 그 고통의 단계가 1 감소합니다. 같은 고통 사례에 대해 이 주문은 한 번만 효과가 있으며, 이 주문으로 두 번째 단계를 줄이려 해도 실패합니다.강화(3랭크): 질병이나 독이라면 대신 상쇄 판정을 ...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의 생물 1<br><strong>시전:</strong> 1분<br>대상의 몸에서 고통을 몰아내려 시도합니다. 대상에게 영향을 미치고 있는 저주, 질병, 또는 독 중 하나를 선택합니다. 해당 고통이 현재 1단계 이상이라면, 그 고통의 단계가 <strong>1 감소</strong>합니다. 같은 고통 사례에 대해 이 주문은 한 번만 효과가 있으며, 이 주문으로 두 번째 단계를 줄이려 해도 실패합니다.<br><strong>강화(3랭크):</strong> 질병이나 독이라면 대신 <strong>상쇄 판정</strong>을 시도합니다.<br><strong>강화(4랭크):</strong> 저주, 질병, 또는 독에 대해 <strong>상쇄 판정</strong>을 시도합니다."
  },
  {
    "id": "clear-mind",
    "name_ko": "정신 정화",
    "name_en": "Clear Mind",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "치유",
      "조작",
      "정신"
    ],
    "range": "접촉",
    "target": "동의 생물 1",
    "summary": "정신 오염을 몰아냅니다. 도주(fleeing), 공포(frightened), 현기증(stupefied) 중 하나를 부여하는 효과에 상쇄를 시도합니다. 상쇄 실패해도 랭크가 2 낮았으면 성공했을 경우, 다음 턴 시작까지 효과를 억압합니다.강화(4랭크): 혼란(confused), 지배(controlled) 추가. 강화(6랭크): 운명(doomed) 추가....",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의 생물 1<br>정신 오염을 몰아냅니다. {{condition:Fleeing}}, {{condition:Frightened}}, {{condition:Stupefied}} 중 하나를 부여하는 효과에 상쇄를 시도합니다. 상쇄 실패해도 랭크가 2 낮았으면 성공했을 경우, 다음 턴 시작까지 효과를 억압합니다.<br><strong>강화(4랭크):</strong> {{condition:Confused}}, {{condition:Controlled}} 추가. <strong>강화(6랭크):</strong> {{condition:Doomed}} 추가. <strong>강화(8랭크):</strong> {{condition:Stunned}} 추가."
  },
  {
    "id": "darkness",
    "name_ko": "어둠",
    "name_en": "Darkness",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "어둠",
      "조작"
    ],
    "range": "120피트",
    "area": "20피트 폭발",
    "duration": "1분",
    "summary": "빛이 통과하거나 발산하지 못하는 어둠의 장막을 만듭니다. 영역 내 비마법 광원(횃불, 랜턴)은 빛을 발하지 않으며, 이 주문 랭크 이하의 마법 빛도 억압됩니다. 빛이 통과하지 못하므로 영역 내 생물은 밖을 볼 수 없고, 밖에서는 순수한 어둠의 구체로 보입니다.강화(4랭크): 암시야(상위 암시야 제외)를 가진 생물도 어둠을 거의 꿰뚫어 보지 못합니다. ...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 20피트 폭발<br><strong>지속 시간:</strong> 1분<br>빛이 통과하거나 발산하지 못하는 어둠의 장막을 만듭니다. 영역 내 비마법 광원(횃불, 랜턴)은 빛을 발하지 않으며, 이 주문 랭크 이하의 마법 빛도 억압됩니다. 빛이 통과하지 못하므로 영역 내 생물은 밖을 볼 수 없고, 밖에서는 순수한 어둠의 구체로 보입니다.<br><strong>강화(4랭크):</strong> 암시야(상위 암시야 제외)를 가진 생물도 어둠을 거의 꿰뚫어 보지 못합니다. 어둠을 통해 본 대상은 은폐로 취급."
  },
  {
    "id": "darkvision",
    "name_ko": "암시야",
    "name_en": "Darkvision",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "duration": "1시간",
    "summary": "어둠 속에서도 볼 수 있는 초자연적 시각을 부여합니다. 주문의 지속 시간 동안 암시야(darkvision)를 얻어, 어둠 속에서도 흑백으로 볼 수 있습니다. 이것은 마법적 어둠에는 효과가 없습니다.강화(3랭크): 사거리가 접촉이 되고 동의하는 생물 1명을 대상으로 삼을 수 있습니다.강화(5랭크): 사거리 접촉, 동의하는 생물 1명, 지속 시간이 다음 ...",
    "desc": "<strong>지속 시간:</strong> 1시간<br>어둠 속에서도 볼 수 있는 초자연적 시각을 부여합니다. 주문의 지속 시간 동안 <strong>암시야(darkvision)</strong>를 얻어, 어둠 속에서도 흑백으로 볼 수 있습니다. 이것은 마법적 어둠에는 효과가 없습니다.<br><strong>강화(3랭크):</strong> 사거리가 접촉이 되고 동의하는 생물 1명을 대상으로 삼을 수 있습니다.<br><strong>강화(5랭크):</strong> 사거리 접촉, 동의하는 생물 1명, 지속 시간이 다음 일일 준비까지로 증가합니다."
  },
  {
    "id": "deafness",
    "name_ko": "귀머거리",
    "name_en": "Deafness",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "인내",
    "summary": "대상의 청각을 빼앗아 귀머거리로 만듭니다. 대상은 인내 내성을 시도합니다.대성공: 영향 없음.성공: 대상의 다음 턴 끝까지 귀머거리(deafened) 상태가 됩니다.실패: 10분 동안 귀머거리 상태가 됩니다.대실패: 영구적으로 귀머거리 상태가 됩니다.주문의 효과가 끝난 후 대상은 이 주문에 대해 1분간 면역이 됩니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br>대상의 청각을 빼앗아 귀머거리로 만듭니다. 대상은 인내 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 대상의 다음 턴 끝까지 <strong>{{condition:Deafened}}</strong> 상태가 됩니다.<br><strong>실패:</strong> <strong>10분</strong> 동안 귀머거리 상태가 됩니다.<br><strong>대실패:</strong> <strong>영구적으로</strong> 귀머거리 상태가 됩니다.<br>주문의 효과가 끝난 후 대상은 이 주문에 대해 <strong>1분간 면역</strong>이 됩니다."
  },
  {
    "id": "dispel-magic",
    "name_ko": "마법 해제",
    "name_en": "Dispel Magic",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "120피트",
    "target": "주문 효과 1 또는 마법 아이템에 의해 유지되는 효과 1",
    "summary": "진행 중인 주문 효과를 종료하거나, 마법 아이템의 힘을 일시적으로 억압하려 시도합니다. 대상에 대해 상쇄 판정을 합니다. 상쇄 판정은 주문 DC로 주문시전 판정이나 다른 판정을 굴려 대상의 DC와 비교합니다. 성공하면 주문 효과가 종료되거나, 아이템의 마법이 일정 시간 억압됩니다. 대상이 이 주문보다 높은 랭크이면 상쇄가 어렵거나 불가능할 수 있습니다.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 주문 효과 1 또는 마법 아이템에 의해 유지되는 효과 1<br>진행 중인 주문 효과를 종료하거나, 마법 아이템의 힘을 일시적으로 억압하려 시도합니다. 대상에 대해 <strong>상쇄 판정</strong>을 합니다. 상쇄 판정은 주문 DC로 주문시전 판정이나 다른 판정을 굴려 대상의 DC와 비교합니다. 성공하면 주문 효과가 종료되거나, 아이템의 마법이 일정 시간 억압됩니다. 대상이 이 주문보다 높은 랭크이면 상쇄가 어렵거나 불가능할 수 있습니다."
  },
  {
    "id": "embed-message",
    "name_ko": "삽입 메시지",
    "name_en": "Embed Message",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "물체 1(영역에 고정)",
    "duration": "다음 일일 준비까지",
    "summary": "물체에 환영 메시지를 남겨 나중에 발동되게 합니다. 시전 시 메시지(최대 25단어)와 발동 조건을 설정합니다. 조건이 충족되면 당신의 환영 이미지가 나타나 메시지를 전합니다.강화(+2): 메시지를 25단어 더 추가 가능.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 물체 1(영역에 고정)<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>물체에 환영 메시지를 남겨 나중에 발동되게 합니다. 시전 시 메시지(최대 25단어)와 발동 조건을 설정합니다. 조건이 충족되면 당신의 환영 이미지가 나타나 메시지를 전합니다.<br><strong>강화(+2):</strong> 메시지를 25단어 더 추가 가능."
  },
  {
    "id": "enlarge",
    "name_ko": "확대",
    "name_en": "Enlarge",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "range": "30피트",
    "target": "동의하는 생물 1",
    "duration": "5분",
    "summary": "마법적 힘으로 대상이 대형 크기로 성장합니다. 장비도 함께 커지지만 제거하면 원래 크기로 돌아옵니다. 대상은 서투름(clumsy) 1이 됩니다. 도달이 5피트 증가하며(초소형에서 시작했다면 10피트), 근접 피해에 +2 상태 보너스를 얻습니다. 이 주문은 대형 이상 생물에게 효과가 없습니다.강화(4랭크): 대상이 거대 크기로 성장합니다. 근접 피해 상...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 동의하는 생물 1<br><strong>지속 시간:</strong> 5분<br>마법적 힘으로 대상이 <strong>대형</strong> 크기로 성장합니다. 장비도 함께 커지지만 제거하면 원래 크기로 돌아옵니다. 대상은 <strong>{{condition:Clumsy}} 1</strong>이 됩니다. 도달이 <strong>5피트</strong> 증가하며(초소형에서 시작했다면 10피트), 근접 피해에 <strong>+2 상태 보너스</strong>를 얻습니다. 이 주문은 대형 이상 생물에게 효과가 없습니다.<br><strong>강화(4랭크):</strong> 대상이 <strong>거대</strong> 크기로 성장합니다. 근접 피해 상태 보너스가 <strong>+4</strong>이고 도달이 <strong>10피트</strong> 증가합니다(초소형이면 15피트). 거대 이상 생물에게 효과 없음.<br><strong>강화(6랭크):</strong> 2랭크 또는 4랭크 버전을 선택하여 최대 <strong>10</strong>명의 동의 생물에 적용합니다."
  },
  {
    "id": "entangling-flora",
    "name_ko": "방해 식물",
    "name_en": "Entangling Flora",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "식물"
    ],
    "range": "120피트",
    "area": "영역 내 모든 5피트 칸",
    "duration": "1분",
    "summary": "식물을 자라게 하여 영역 내 이동을 방해합니다. 영역은 험지가 됩니다. 영역 내에서 턴을 시작하는 각 생물은 반사 내성 시도. 실패 시 이동 불가(immobilized)(탈출 DC = 주문 DC). 대실패 시 넘어뜨려짐+이동 불가.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 영역 내 모든 5피트 칸<br><strong>지속 시간:</strong> 1분<br>식물을 자라게 하여 영역 내 이동을 방해합니다. 영역은 <strong>험지</strong>가 됩니다. 영역 내에서 턴을 시작하는 각 생물은 반사 내성 시도. 실패 시 <strong>{{condition:Immobilized}}</strong>(탈출 DC = 주문 DC). 대실패 시 넘어뜨려짐+이동 불가."
  },
  {
    "id": "environmental-endurance",
    "name_ko": "환경 내구",
    "name_en": "Environmental Endurance",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "다음 일일 준비까지",
    "summary": "극심한 추위나 더위로부터 생물을 보호합니다. 대상은 심한(severe) 이하의 환경 온도 효과를 무시합니다.강화(3랭크): 극심한(extreme) 온도까지 보호. 강화(5랭크): 극한(incredible) 온도까지 보호.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>극심한 추위나 더위로부터 생물을 보호합니다. 대상은 <strong>심한(severe)</strong> 이하의 환경 온도 효과를 무시합니다.<br><strong>강화(3랭크):</strong> <strong>극심한(extreme)</strong> 온도까지 보호. <strong>강화(5랭크):</strong> <strong>극한(incredible)</strong> 온도까지 보호."
  },
  {
    "id": "everlight",
    "name_ko": "영원한 빛",
    "name_en": "Everlight",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "빛",
      "조작"
    ],
    "range": "접촉",
    "target": "6골드 이상 가치의 보석 1개",
    "duration": "무제한",
    "summary": "당신이 접촉한 보석이 빛을 발하며, 당신이 선택한 색깔로 20피트 반경의 밝은 빛을 (그리고 그 다음 20피트는 희미한 빛을) 발산합니다. 보석이 파괴되면 즉시 주문이 종료됩니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 6골드 이상 가치의 보석 1개<br><strong>지속 시간:</strong> 무제한<br>당신이 접촉한 보석이 빛을 발하며, 당신이 선택한 색깔로 20피트 반경의 밝은 빛을 (그리고 그 다음 20피트는 희미한 빛을) 발산합니다. 보석이 파괴되면 즉시 주문이 종료됩니다."
  },
  {
    "id": "false-vitality",
    "name_ko": "거짓 활력",
    "name_en": "False Vitality",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "duration": "8시간",
    "summary": "10 임시 HP를 얻습니다.강화(+1): 임시 HP +3.",
    "desc": "<strong>지속 시간:</strong> 8시간<br><strong>10 임시 HP</strong>를 얻습니다.<br><strong>강화(+1):</strong> 임시 HP +3."
  },
  {
    "id": "floating-flame",
    "name_ko": "떠다니는 불꽃",
    "name_en": "Floating Flame",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "화염",
      "조작"
    ],
    "range": "30피트",
    "target": "5피트 칸 1개",
    "defense": "반사",
    "duration": "유지(최대 1분)",
    "summary": "대상 칸에 불을 만들어 3d6 화염 피해를 주며, 기본 반사 내성을 시도합니다. 유지하면 최대 10피트까지 부양시킬 수 있으며, 불이 있는 칸의 생물에 피해를 줍니다. 떠다니는 불꽃의 피해는 라운드당 한 번만 받습니다.강화(+1): 피해 +1d6.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 5피트 칸 1개<br><strong>방어:</strong> 반사<br><strong>지속 시간:</strong> 유지(최대 1분)<br>대상 칸에 불을 만들어 <strong>3d6 화염 피해</strong>를 주며, 기본 반사 내성을 시도합니다. 유지하면 최대 10피트까지 부양시킬 수 있으며, 불이 있는 칸의 생물에 피해를 줍니다. 떠다니는 불꽃의 피해는 라운드당 한 번만 받습니다.<br><strong>강화(+1):</strong> 피해 +1d6."
  },
  {
    "id": "gecko-grip",
    "name_ko": "도마뱀붙이 손잡기",
    "name_en": "Gecko Grip",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "10분",
    "summary": "생물의 손과 발 전체에 미세한 점착성 털이 돋아나, 거의 모든 표면에서 발판을 확보하게 해줍니다. 대상은 자신의 이동 속도와 동일한 등반 속도를 얻습니다.강화(5랭크): 지속 시간이 1시간으로 늘어납니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 10분<br>생물의 손과 발 전체에 미세한 점착성 털이 돋아나, 거의 모든 표면에서 발판을 확보하게 해줍니다. 대상은 자신의 이동 속도와 동일한 등반 속도를 얻습니다.<br><strong>강화(5랭크):</strong> 지속 시간이 1시간으로 늘어납니다."
  },
  {
    "id": "ghostly-carrier",
    "name_ko": "유령 운반자",
    "name_en": "Ghostly Carrier",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "120피트",
    "duration": "1분",
    "summary": "초소형의 반물질적 형상을 만들어 접촉 주문을 대신 전달합니다. 당신의 AC와 내성을 사용합니다. 어떤 피해라도 받으면 파괴됩니다.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>지속 시간:</strong> 1분<br>초소형의 반물질적 형상을 만들어 접촉 주문을 대신 전달합니다. 당신의 AC와 내성을 사용합니다. 어떤 피해라도 받으면 파괴됩니다."
  },
  {
    "id": "humanoid-form",
    "name_ko": "인간형 형태",
    "name_en": "Humanoid Form",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "duration": "10분",
    "summary": "인간형 생물의 형태를 취합니다. 중형 또는 소형 인간형의 외모로 변신합니다. 비전투적 변신이며, 공격/능력치는 변하지 않습니다. 불신 가능(지각 DC = 주문 DC).강화(3랭크): 대형 인간형도 가능. 강화(5랭크): 비인간형 체형도 가능.",
    "desc": "<strong>지속 시간:</strong> 10분<br>인간형 생물의 형태를 취합니다. 중형 또는 소형 인간형의 외모로 변신합니다. 비전투적 변신이며, 공격/능력치는 변하지 않습니다. 불신 가능(지각 DC = 주문 DC).<br><strong>강화(3랭크):</strong> 대형 인간형도 가능. <strong>강화(5랭크):</strong> 비인간형 체형도 가능."
  },
  {
    "id": "illusory-creature",
    "name_ko": "환영 생물",
    "name_en": "Illusory Creature",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작",
      "시각"
    ],
    "range": "500피트",
    "duration": "유지",
    "summary": "생물의 설득력 있는 환영을 만듭니다. 중형 이하, 유지 시 최대 이동 속도 25피트로 이동 및 몸짓 가능. 상호작용하면 불신 가능(지각 판정 vs 주문 DC). 불신하지 않은 생물은 진짜로 인식.강화(5랭크): 대형, 이동 속도 45피트. 강화(8랭크): 거대, 이동 속도 60피트.",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>지속 시간:</strong> 유지<br>생물의 설득력 있는 환영을 만듭니다. 중형 이하, 유지 시 최대 이동 속도 25피트로 이동 및 몸짓 가능. 상호작용하면 불신 가능(지각 판정 vs 주문 DC). 불신하지 않은 생물은 진짜로 인식.<br><strong>강화(5랭크):</strong> 대형, 이동 속도 45피트. <strong>강화(8랭크):</strong> 거대, 이동 속도 60피트."
  },
  {
    "id": "invisibility",
    "name_ko": "투명화",
    "name_en": "Invisibility",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "10분",
    "summary": "대상의 몸과 장비가 보이지 않게 됩니다. 대상은 시각에 대해 미탐지(undetected) 상태가 됩니다. 다른 감각(청각, 후각 등)으로는 여전히 감지될 수 있습니다. 대상이 적대 행동(공격, 피해를 주는 주문 시전 등)을 하면, 주문이 즉시 종료됩니다.강화(4랭크): 지속 시간이 1분으로 변경되며, 대상이 적대 행동을 하더라도 주문이 즉시 종료되지 ...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 10분<br>대상의 몸과 장비가 보이지 않게 됩니다. 대상은 시각에 대해 <strong>{{condition:Undetected}}</strong> 상태가 됩니다. 다른 감각(청각, 후각 등)으로는 여전히 감지될 수 있습니다. 대상이 적대 행동(공격, 피해를 주는 주문 시전 등)을 하면, 주문이 <strong>즉시 종료</strong>됩니다.<br><strong>강화(4랭크):</strong> 지속 시간이 <strong>1분</strong>으로 변경되며, 대상이 적대 행동을 하더라도 주문이 즉시 종료되지 않고 <strong>다음 턴 시작까지</strong> 투명 상태가 유지됩니다."
  },
  {
    "id": "knock",
    "name_ko": "열쇠",
    "name_en": "Knock",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "문, 자물쇠, 용기 1",
    "summary": "문, 자물쇠, 용기를 더 쉽게 열거나 즉시 엽니다. 마법이 아닌 잠금은 DC에 -4. 마법 잠금이면 상쇄를 시도합니다. 모든 잠금 해제 시 자동으로 열립니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 문, 자물쇠, 용기 1<br>문, 자물쇠, 용기를 더 쉽게 열거나 즉시 엽니다. 마법이 아닌 잠금은 DC에 <strong>-4</strong>. 마법 잠금이면 상쇄를 시도합니다. 모든 잠금 해제 시 자동으로 열립니다."
  },
  {
    "id": "laughing-fit",
    "name_ko": "웃음 발작",
    "name_en": "Laughing Fit",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "감정",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "유지(최대 1분)",
    "summary": "웃음이 생물의 행동을 방해합니다. 의지 실패 시 서투름(clumsy) 2+집중 주문에 DC 5 단순 판정 필요. 대실패 시 추가로 엎드려짐(prone).",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 유지(최대 1분)<br>웃음이 생물의 행동을 방해합니다. 의지 실패 시 <strong>{{condition:Clumsy}} 2</strong>+집중 주문에 DC 5 단순 판정 필요. 대실패 시 추가로 <strong>{{condition:Prone}}</strong>."
  },
  {
    "id": "marvelous-mount",
    "name_ko": "경이로운 탈것",
    "name_en": "Marvelous Mount",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "duration": "8시간",
    "castTime": "10분",
    "summary": "대형의 환상적인 생물을 소환하여 탈것으로 사용합니다. 탈것은 대상의 하수인(301페이지)이며, 이동 속도 40피트입니다. 대상과 소지품을 운반할 수 있지만 다른 생물은 운반할 수 없습니다. 대상의 AC와 내성을 사용하며, 한 번에 10 이상의 피해를 받으면 파괴되어 주문이 종료됩니다. 탐험 모드에서 시간당 20마일의 이동 속도를 가집니다.강화(3랭크)...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 8시간<br><strong>시전:</strong> 10분<br>대형의 환상적인 생물을 소환하여 탈것으로 사용합니다. 탈것은 대상의 하수인(301페이지)이며, 이동 속도 40피트입니다. 대상과 소지품을 운반할 수 있지만 다른 생물은 운반할 수 없습니다. 대상의 AC와 내성을 사용하며, 한 번에 10 이상의 피해를 받으면 파괴되어 주문이 종료됩니다. 탐험 모드에서 시간당 20마일의 이동 속도를 가집니다.<br><strong>강화(3랭크):</strong> 물 위를 걸을 수 있지만, 턴을 단단한 지면 위에서 끝내야 합니다.<br><strong>강화(4랭크):</strong> 이동 속도 60피트, 물 위를 걸을 수 있습니다.<br><strong>강화(5랭크):</strong> 이동 속도 60피트, 비행 속도 60피트, 턴을 표면 위에서 끝내야 합니다.<br><strong>강화(6랭크):</strong> 이동 및 비행 속도 80피트."
  },
  {
    "id": "mist",
    "name_ko": "안개",
    "name_en": "Mist",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "조작",
      "물"
    ],
    "range": "120피트",
    "area": "20피트 폭발",
    "duration": "1분",
    "summary": "짙은 안개 구름이 영역을 뒤덮습니다. 영역 내의 모든 생물과 물체는 은폐(concealed) 상태가 됩니다. 은폐된 대상을 공격하려면 DC 5 단순 판정에 성공해야 하며, 실패하면 공격이 빗나갑니다. 강한 바람은 안개를 날려 보낼 수 있습니다.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 20피트 폭발<br><strong>지속 시간:</strong> 1분<br>짙은 안개 구름이 영역을 뒤덮습니다. 영역 내의 모든 생물과 물체는 <strong>{{condition:Concealed}}</strong> 상태가 됩니다. 은폐된 대상을 공격하려면 DC 5 단순 판정에 성공해야 하며, 실패하면 공격이 빗나갑니다. 강한 바람은 안개를 날려 보낼 수 있습니다."
  },
  {
    "id": "noise-blast",
    "name_ko": "소음 폭발",
    "name_en": "Noise Blast",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "음파"
    ],
    "range": "30피트",
    "area": "10피트 폭발",
    "defense": "인내",
    "summary": "불협화음이 터져 나와 2d10 음파 피해를 줍니다. 각 생물은 인내 내성을 시도합니다.대성공: 영향 없음.성공: 절반 피해.실패: 전체 피해, 1라운드 동안 귀머거리(deafened).대실패: 2배 피해, 1분 동안 귀머거리, 기절(stunned) 1.강화(+1): 피해 +1d10.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>영역:</strong> 10피트 폭발<br><strong>방어:</strong> 인내<br>불협화음이 터져 나와 <strong>2d10 음파 피해</strong>를 줍니다. 각 생물은 인내 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 절반 피해.<br><strong>실패:</strong> 전체 피해, 1라운드 동안 {{condition:Deafened}}.<br><strong>대실패:</strong> 2배 피해, 1분 동안 귀머거리, <strong>{{condition:Stunned}} 1</strong>.<br><strong>강화(+1):</strong> 피해 +1d10."
  },
  {
    "id": "oaken-resilience",
    "name_ko": "참나무 강인",
    "name_en": "Oaken Resilience",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "식물"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "10분",
    "summary": "나무의 회복력을 부여하지만 가연성도 함께. 대상의 최대 HP에 +임시 HP 10을 얻고, 밀기/넘어뜨리기에 대한 인내 DC에 +2. 그러나 화염 약점 2.강화(+2): 임시 HP +5, 화염 약점 +1.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 10분<br>나무의 회복력을 부여하지만 가연성도 함께. 대상의 최대 HP에 <strong>+임시 HP 10</strong>을 얻고, 밀기/넘어뜨리기에 대한 인내 DC에 +2. 그러나 <strong>화염 약점 2</strong>.<br><strong>강화(+2):</strong> 임시 HP +5, 화염 약점 +1."
  },
  {
    "id": "paranoia",
    "name_ko": "편집증",
    "name_en": "Paranoia",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "1분",
    "summary": "성공: 모든 사람이 잠재적 위협이라고 믿으며 모두에게 비우호적. 효과는 1라운드 동안 지속.대실패: 모든 사람이 치명적 적이라고 믿으며, 모든 대상에 대해 반응과 자유 행동을 사용합니다.강화(6랭크): 최대 5명 대상.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1분<br><strong>성공:</strong> 모든 사람이 잠재적 위협이라고 믿으며 모두에게 비우호적. 효과는 1라운드 동안 지속.<br><strong>대실패:</strong> 모든 사람이 치명적 적이라고 믿으며, 모든 대상에 대해 반응과 자유 행동을 사용합니다.<br><strong>강화(6랭크):</strong> 최대 5명 대상."
  },
  {
    "id": "peaceful-rest",
    "name_ko": "평화로운 안식",
    "name_en": "Peaceful Rest",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "시체 1",
    "duration": "다음 일일 준비까지",
    "summary": "시체에 보호 마법을 부여합니다. 주문의 지속 시간 동안 시체가 부패하지 않으며, 언데드로 변환할 수 없습니다. 이 주문은 부활 주문에 필요한 시간 제한을 연장하는 데 유용합니다.강화(5랭크): 지속 시간 무제한. 행동 1개 추가 소모, 6gp 상당의 방부 처리액 필요.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 시체 1<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>시체에 보호 마법을 부여합니다. 주문의 지속 시간 동안 시체가 <strong>부패하지 않으며</strong>, 언데드로 변환할 수 없습니다. 이 주문은 부활 주문에 필요한 시간 제한을 연장하는 데 유용합니다.<br><strong>강화(5랭크):</strong> 지속 시간 무제한. 행동 1개 추가 소모, 6gp 상당의 방부 처리액 필요."
  },
  {
    "id": "resist-energy",
    "name_ko": "에너지 저항",
    "name_en": "Resist Energy",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "10분",
    "summary": "한 가지 에너지 유형의 피해로부터 생물을 보호합니다. 산성, 냉기, 전기, 화염, 음파 중 하나를 선택. 대상이 선택한 유형과 장비에 대해 저항 5를 얻습니다.강화(4랭크): 저항 10, 최대 2명. 강화(7랭크): 저항 15, 최대 5명.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 10분<br>한 가지 에너지 유형의 피해로부터 생물을 보호합니다. 산성, 냉기, 전기, 화염, 음파 중 하나를 선택. 대상이 선택한 유형과 장비에 대해 <strong>저항 5</strong>를 얻습니다.<br><strong>강화(4랭크):</strong> 저항 10, 최대 2명. <strong>강화(7랭크):</strong> 저항 15, 최대 5명."
  },
  {
    "id": "revealing-light",
    "name_ko": "드러내는 빛",
    "name_en": "Revealing Light",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "빛",
      "조작"
    ],
    "range": "120피트",
    "area": "10피트 폭발",
    "defense": "반사",
    "duration": "다양",
    "summary": "마법의 빛이 영역을 휩쓸어 숨겨진 것을 드러냅니다. 빛의 외양(다채로운 불꽃, 반짝이는 빛 등)을 선택할 수 있습니다. 영향받는 생물은 현혹(dazzled) 상태가 됩니다. 투명한 생물이었다면 은폐(concealed) 상태로 변합니다. 다른 이유로 이미 은폐된 생물은 은폐 상태가 해제됩니다.대성공: 영향 없음. 성공: 2라운드. 실패: 1분. 대실패:...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 10피트 폭발<br><strong>방어:</strong> 반사<br><strong>지속 시간:</strong> 다양<br>마법의 빛이 영역을 휩쓸어 숨겨진 것을 드러냅니다. 빛의 외양(다채로운 불꽃, 반짝이는 빛 등)을 선택할 수 있습니다. 영향받는 생물은 <strong>{{condition:Dazzled}}</strong> 상태가 됩니다. 투명한 생물이었다면 <strong>{{condition:Concealed}}</strong> 상태로 변합니다. 다른 이유로 이미 은폐된 생물은 은폐 상태가 해제됩니다.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 2라운드. <strong>실패:</strong> 1분. <strong>대실패:</strong> 10분."
  },
  {
    "id": "see-the-unseen",
    "name_ko": "보이지 않는 것 보기",
    "name_en": "See the Unseen",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "탐지"
    ],
    "duration": "10분",
    "summary": "투명한 생물을 흐릿하게 볼 수 있어 은폐(concealed) 상태로 취급되며 식별이 어렵습니다. 무형체(incorporeal) 생물도 10피트 이내에서 물체를 통해 흐릿한 형태로 보입니다. 환영을 불신하는 판정에 +2 상태 보너스를 얻습니다.강화(5랭크): 지속 시간 8시간.",
    "desc": "<strong>지속 시간:</strong> 10분<br>투명한 생물을 흐릿하게 볼 수 있어 <strong>{{condition:Concealed}}</strong> 상태로 취급되며 식별이 어렵습니다. 무형체(incorporeal) 생물도 10피트 이내에서 물체를 통해 흐릿한 형태로 보입니다. 환영을 불신하는 판정에 <strong>+2 상태 보너스</strong>를 얻습니다.<br><strong>강화(5랭크):</strong> 지속 시간 8시간."
  },
  {
    "id": "shape-wood",
    "name_ko": "나무 형성",
    "name_en": "Shape Wood",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "식물"
    ],
    "range": "접촉",
    "target": "가공되지 않은 나무 조각(최대 20 입방피트)",
    "summary": "나무를 대략적 형태로 변환합니다. 크기는 가공 전과 같아야 합니다. 단순한 형태만 가능(복잡한 움직이는 부품 불가).",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 가공되지 않은 나무 조각(최대 20 입방피트)<br>나무를 대략적 형태로 변환합니다. 크기는 가공 전과 같아야 합니다. 단순한 형태만 가능(복잡한 움직이는 부품 불가)."
  },
  {
    "id": "share-life",
    "name_ko": "피해 분담",
    "name_en": "Share Life",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "치유",
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "duration": "10분",
    "summary": "대상과 일시적 연결을 형성합니다. 대상이 받는 피해의 절반을 대상이 받고, 나머지를 당신이 받습니다. 이 연결을 통한 전달에는 저항, 약점, 능력이 적용되지 않습니다. 30피트 이상 떨어지거나 둘 중 하나가 0 HP가 되면 주문 종료.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 10분<br>대상과 일시적 연결을 형성합니다. 대상이 받는 피해의 절반을 대상이 받고, 나머지를 당신이 받습니다. 이 연결을 통한 전달에는 저항, 약점, 능력이 적용되지 않습니다. 30피트 이상 떨어지거나 둘 중 하나가 0 HP가 되면 주문 종료."
  },
  {
    "id": "shatter",
    "name_ko": "분쇄",
    "name_en": "Shatter",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "음파"
    ],
    "range": "30피트",
    "target": "무주인 물체 1",
    "summary": "고주파 음파로 물체를 파괴합니다. 2d10 음파 피해(경도 4 이하 무시).강화(+1): 피해 +1d10, 무시하는 경도 +2.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 무주인 물체 1<br>고주파 음파로 물체를 파괴합니다. <strong>2d10 음파 피해</strong>(경도 4 이하 무시).<br><strong>강화(+1):</strong> 피해 +1d10, 무시하는 경도 +2."
  },
  {
    "id": "shrink",
    "name_ko": "축소",
    "name_en": "Shrink",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "range": "30피트",
    "target": "동의 생물 1",
    "duration": "5분",
    "summary": "동의하는 생물을 작은(Tiny) 크기로 줄입니다. 범위가 0이 됩니다.강화(6랭크): 최대 10명.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 동의 생물 1<br><strong>지속 시간:</strong> 5분<br>동의하는 생물을 작은(Tiny) 크기로 줄입니다. 범위가 0이 됩니다.<br><strong>강화(6랭크):</strong> 최대 10명."
  },
  {
    "id": "silence",
    "name_ko": "침묵",
    "name_en": "Silence",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작",
      "은밀"
    ],
    "range": "접촉",
    "target": "동의 생물 1",
    "duration": "1분",
    "summary": "동의하는 생물에서 나오는 모든 소리를 마법적으로 음소거합니다. 대상은 어떤 소리도 내지 않으며, 음파 공격이나 청각(auditory) 행동을 사용할 수 없습니다. 예외: 은밀(subtle) 특성을 가진 주문은 시전 가능합니다.강화(4랭크): 대상 대신 10피트 발산 영역으로 변경됩니다. 영역 내 모든 소리가 차단되며, 영역 내 생물도 같은 효과를 받습니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의 생물 1<br><strong>지속 시간:</strong> 1분<br>동의하는 생물에서 나오는 모든 소리를 마법적으로 음소거합니다. 대상은 어떤 소리도 내지 않으며, 음파 공격이나 청각(auditory) 행동을 사용할 수 없습니다. 예외: 은밀(subtle) 특성을 가진 주문은 시전 가능합니다.<br><strong>강화(4랭크):</strong> 대상 대신 <strong>10피트 발산</strong> 영역으로 변경됩니다. 영역 내 모든 소리가 차단되며, 영역 내 생물도 같은 효과를 받습니다."
  },
  {
    "id": "sound-body",
    "name_ko": "건전한 몸",
    "name_en": "Sound Body",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "치유",
      "조작"
    ],
    "range": "접촉",
    "target": "동의하는 생물 1",
    "summary": "물리적 상태를 상쇄(counteract)합니다. 실명(blinded), 현혹(dazzled), 귀머거리(deafened), 약화(enfeebled), 메스꺼움(sickened) 중 하나를 상쇄 시도합니다. 상쇄 랭크가 2 이상 낮으면 다음 턴 시작까지 억제만 합니다. 저주, 질병, 정상 상태는 상쇄/억제 불가.강화(4랭크): 소진(drained), 기...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의하는 생물 1<br>물리적 상태를 상쇄(counteract)합니다. {{condition:Blinded}}, {{condition:Dazzled}}, {{condition:Deafened}}, {{condition:Enfeebled}}, {{condition:Sickened}} 중 하나를 상쇄 시도합니다. 상쇄 랭크가 2 이상 낮으면 다음 턴 시작까지 억제만 합니다. 저주, 질병, 정상 상태는 상쇄/억제 불가.<br><strong>강화(4랭크):</strong> {{condition:Drained}}, {{condition:Stunned}} 추가. <strong>강화(8랭크):</strong> 소진, 기절 및 전체 목록 추가."
  },
  {
    "id": "speak-with-animals",
    "name_ko": "동물과 대화",
    "name_en": "Speak with Animals",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "duration": "1시간",
    "summary": "동물과 대화할 수 있습니다. 영리한 동물은 짧게 대답하고, 지능이 낮은 동물은 무의미한 말을 합니다.",
    "desc": "<strong>지속 시간:</strong> 1시간<br>동물과 대화할 수 있습니다. 영리한 동물은 짧게 대답하고, 지능이 낮은 동물은 무의미한 말을 합니다."
  },
  {
    "id": "spiritual-armament",
    "name_ko": "영적 무장",
    "name_en": "Spiritual Armament",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "성별화",
      "영혼"
    ],
    "range": "120피트",
    "target": "생물 1",
    "defense": "AC",
    "duration": "유지(최대 1분)",
    "summary": "현재 착용하거나 들고 있는 무기 하나의 유령 같은 마법 복제본을 만들어 대상에게 날립니다. 대상의 AC에 주문 명중 굴림을 굴려 명중 시 2d8 피해(급소 공격 시 2배 피해). 피해 유형은 선택한 무기와 동일하며, 영혼 피해가 더 해롭다면 영혼 피해로 대체됩니다. 이 공격은 다중 공격 페널티에 기여합니다. 공격 후 무기는 당신 곁으로 돌아옵니다. 주...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> AC<br><strong>지속 시간:</strong> 유지(최대 1분)<br>현재 착용하거나 들고 있는 무기 하나의 유령 같은 마법 복제본을 만들어 대상에게 날립니다. 대상의 AC에 주문 명중 굴림을 굴려 명중 시 <strong>2d8 피해</strong>(급소 공격 시 2배 피해). 피해 유형은 선택한 무기와 동일하며, 영혼 피해가 더 해롭다면 영혼 피해로 대체됩니다. 이 공격은 다중 공격 페널티에 기여합니다. 공격 후 무기는 당신 곁으로 돌아옵니다. 주문을 성별화하면 공격도 성별화됩니다. 유지 시마다 120피트 내 원하는 생물에 다시 공격할 수 있습니다.<br><strong>강화(+2):</strong> 피해 +1d8, HP +20."
  },
  {
    "id": "status",
    "name_ko": "상태",
    "name_en": "Status",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "탐지",
      "조작"
    ],
    "range": "접촉",
    "target": "동의하는 살아있는 생물 1",
    "duration": "다음 일일 준비까지",
    "summary": "같은 차원에 있고 둘 다 살아있으면 대상의 거리, 방향, 현재 상태(conditions)를 알 수 있습니다.강화(4랭크): 사거리 30피트, 최대 10명.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의하는 살아있는 생물 1<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>같은 차원에 있고 둘 다 살아있으면 대상의 거리, 방향, 현재 상태(conditions)를 알 수 있습니다.<br><strong>강화(4랭크):</strong> 사거리 30피트, 최대 10명."
  },
  {
    "id": "stupefy",
    "name_ko": "멍청하게",
    "name_en": "Stupefy",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "다양",
    "summary": "대상의 정신을 둔하게 하여 주문시전을 불안정하게 만듭니다.대성공: 영향 없음. 성공: 다음 턴 시작까지 현기증(stupefied) 1. 실패: 1분 동안 현기증 2. 대실패: 1분 동안 현기증 3.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 다양<br>대상의 정신을 둔하게 하여 주문시전을 불안정하게 만듭니다.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 다음 턴 시작까지 {{condition:Stupefied}} 1. <strong>실패:</strong> 1분 동안 현기증 2. <strong>대실패:</strong> 1분 동안 현기증 3."
  },
  {
    "id": "summon-elemental",
    "name_ko": "정령 소환",
    "name_en": "Summon Elemental",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "정령을 소환합니다. 주문 랭크 -1 이하 레벨의 정령을 소환합니다.강화(3랭크 이후): 더 강한 정령 소환 가능.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>정령을 소환합니다. 주문 랭크 -1 이하 레벨의 정령을 소환합니다.<br><strong>강화(3랭크 이후):</strong> 더 강한 정령 소환 가능."
  },
  {
    "id": "sure-footing",
    "name_ko": "안정 발디딤",
    "name_en": "Sure Footing",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "치유",
      "조작"
    ],
    "range": "접촉",
    "target": "동의하는 생물 1",
    "summary": "서투름(clumsy), 잡힘(grabbed), 마비(paralyzed) 중 하나를 상쇄(counteract) 시도합니다. 상쇄 랭크가 2 이상 낮으면 다음 턴 시작까지 억제만 합니다. 저주, 질병, 정상 상태는 상쇄/억제 불가.강화(4랭크): 이동 불가(immobilized), 구속(restrained) 추가. 강화(6랭크): 석화(petrified)...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의하는 생물 1<br>{{condition:Clumsy}}, {{condition:Grabbed}}, {{condition:Paralyzed}} 중 하나를 상쇄(counteract) 시도합니다. 상쇄 랭크가 2 이상 낮으면 다음 턴 시작까지 억제만 합니다. 저주, 질병, 정상 상태는 상쇄/억제 불가.<br><strong>강화(4랭크):</strong> {{condition:Immobilized}}, {{condition:Restrained}} 추가. <strong>강화(6랭크):</strong> {{condition:Petrified}} 추가. <strong>강화(8랭크):</strong> {{condition:Stunned}} 추가."
  },
  {
    "id": "telekinetic-maneuver",
    "name_ko": "염동 기동",
    "name_en": "Telekinetic Maneuver",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "60피트",
    "target": "생물 1",
    "summary": "생물을 염동력으로 무장 해제(Disarm), 밀기(Shove), 넘어뜨리기(Trip)합니다. 운동 판정 대신 주문 명중 굴림을 사용합니다.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 생물 1<br>생물을 염동력으로 무장 해제(Disarm), 밀기(Shove), 넘어뜨리기(Trip)합니다. 운동 판정 대신 주문 명중 굴림을 사용합니다."
  },
  {
    "id": "translate",
    "name_ko": "번역",
    "name_en": "Translate",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "duration": "1시간",
    "summary": "듣거나 읽는 단일 언어의 의미를 이해할 수 있게 합니다. 말하기는 불가. 암호나 은유 등은 GM 재량. 여러 언어가 들릴 경우 어떤 언어를 이해할지 선택 가능; 그렇지 않으면 무작위.강화(3랭크): 말하기도 가능. 강화(4랭크): 최대 10 대상, 말하기도 가능.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 1시간<br>듣거나 읽는 단일 언어의 의미를 이해할 수 있게 합니다. 말하기는 불가. 암호나 은유 등은 GM 재량. 여러 언어가 들릴 경우 어떤 언어를 이해할지 선택 가능; 그렇지 않으면 무작위.<br><strong>강화(3랭크):</strong> 말하기도 가능. <strong>강화(4랭크):</strong> 최대 10 대상, 말하기도 가능."
  },
  {
    "id": "water-breathing",
    "name_ko": "수중 호흡",
    "name_en": "Water Breathing",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "최대 5 생물",
    "duration": "1시간",
    "summary": "대상 생물들이 물속에서 정상적으로 호흡할 수 있게 합니다. 대상은 수중에서 아가미가 자라거나 피부를 통해 산소를 흡수하여 물속에서도 질식하지 않습니다. 이 주문은 수영 속도를 부여하지는 않습니다.강화(3랭크): 지속 시간이 8시간으로 증가합니다.강화(4랭크): 지속 시간이 다음 일일 준비까지로 증가합니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 최대 5 생물<br><strong>지속 시간:</strong> 1시간<br>대상 생물들이 물속에서 정상적으로 호흡할 수 있게 합니다. 대상은 수중에서 아가미가 자라거나 피부를 통해 산소를 흡수하여 물속에서도 질식하지 않습니다. 이 주문은 수영 속도를 부여하지는 않습니다.<br><strong>강화(3랭크):</strong> 지속 시간이 <strong>8시간</strong>으로 증가합니다.<br><strong>강화(4랭크):</strong> 지속 시간이 <strong>다음 일일 준비까지</strong>로 증가합니다."
  },
  {
    "id": "water-walk",
    "name_ko": "수상 보행",
    "name_en": "Water Walk",
    "rank": 2,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "물"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "10분",
    "summary": "대상이 물이나 다른 액체의 표면을 걸을 수 있습니다. 원하면 물속으로 들어갈 수 있지만, 그 경우 일반적으로 수영해야 합니다. 이 주문은 수중 호흡을 부여하지 않습니다.강화(4랭크): 사거리 30피트, 지속 시간 1시간, 최대 10 생물 대상.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 10분<br>대상이 물이나 다른 액체의 표면을 걸을 수 있습니다. 원하면 물속으로 들어갈 수 있지만, 그 경우 일반적으로 수영해야 합니다. 이 주문은 수중 호흡을 부여하지 않습니다.<br><strong>강화(4랭크):</strong> 사거리 30피트, 지속 시간 1시간, 최대 10 생물 대상."
  },
  {
    "id": "aqueous-orb",
    "name_ko": "수구",
    "name_en": "Aqueous Orb",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "물"
    ],
    "range": "60피트",
    "defense": "반사",
    "duration": "유지(최대 1분)",
    "summary": "거대한 물의 공을 소환합니다. 10피트 정육면체 크기의 물 공이 사거리 내 빈 공간에 나타납니다. 물 공이 처음 나타난 공간이나, 유지 시 이동한 공간에 있는 모든 생물은 기본 반사 내성을 시도해야 합니다. 실패한 생물은 물 공 안에 삼켜져 잡힘(grabbed) 상태가 되며, 물 공과 함께 이동합니다. 삼킨 생물은 자신의 턴에 주문 DC에 대해 탈출(...",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>방어:</strong> 반사<br><strong>지속 시간:</strong> 유지(최대 1분)<br>거대한 물의 공을 소환합니다. 10피트 정육면체 크기의 물 공이 사거리 내 빈 공간에 나타납니다. 물 공이 처음 나타난 공간이나, 유지 시 이동한 공간에 있는 모든 생물은 <strong>기본 반사 내성</strong>을 시도해야 합니다. 실패한 생물은 물 공 안에 삼켜져 <strong>{{condition:Grabbed}}</strong> 상태가 되며, 물 공과 함께 이동합니다. 삼킨 생물은 자신의 턴에 주문 DC에 대해 <strong>탈출(Escape)</strong>을 시도할 수 있습니다.<br>주문을 유지할 때마다 물 공을 최대 <strong>30피트</strong>까지 이동시킬 수 있습니다. 물 공은 지나가는 경로에 있는 비마법 화염을 소화합니다. <strong>2d6 타격 피해</strong>를 가합니다(기본 반사)."
  },
  {
    "id": "bind-undead",
    "name_ko": "언데드 속박",
    "name_en": "Bind Undead",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "주문 랭크 이하 레벨의 무심한 언데드 1",
    "duration": "1일",
    "summary": "힘의 말로 무심한 언데드를 제어합니다. 대상은 하수인(minion) 특성을 얻고 당신의 명령에 복종합니다. 당신은 각 턴에 행동 1개를 소비하여 대상에게 명령을 내릴 수 있습니다. 대상이 하수인 특성을 가지는 동안, 명령 없이는 자발적으로 행동하지 않습니다. 당신이나 아군이 대상에게 적대 행동을 하면 주문이 즉시 종료됩니다. 주문이 끝나면 대상이 갑자...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 주문 랭크 이하 레벨의 무심한 언데드 1<br><strong>지속 시간:</strong> 1일<br>힘의 말로 무심한 언데드를 제어합니다. 대상은 <strong>하수인(minion)</strong> 특성을 얻고 당신의 명령에 복종합니다. 당신은 각 턴에 행동 1개를 소비하여 대상에게 명령을 내릴 수 있습니다. 대상이 하수인 특성을 가지는 동안, 명령 없이는 자발적으로 행동하지 않습니다. 당신이나 아군이 대상에게 적대 행동을 하면 주문이 즉시 종료됩니다. 주문이 끝나면 대상이 갑자기 해방되며 적대적이 될 수 있습니다."
  },
  {
    "id": "blindness",
    "name_ko": "실명",
    "name_en": "Blindness",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "인내",
    "summary": "대상의 눈에서 빛을 빼앗아 눈멀게 하려 시도합니다. 대상은 인내 내성을 시도합니다.대성공: 영향 없음.성공: 대상의 다음 턴 끝까지 실명(blinded) 상태가 됩니다.실패: 1분 동안 실명 상태가 됩니다.대실패: 영구적으로 실명 상태가 됩니다.주문의 효과가 끝난 후 대상은 이 주문에 대해 1분간 면역이 됩니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br>대상의 눈에서 빛을 빼앗아 눈멀게 하려 시도합니다. 대상은 인내 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 대상의 다음 턴 끝까지 <strong>{{condition:Blinded}}</strong> 상태가 됩니다.<br><strong>실패:</strong> <strong>1분</strong> 동안 실명 상태가 됩니다.<br><strong>대실패:</strong> <strong>영구적으로</strong> 실명 상태가 됩니다.<br>주문의 효과가 끝난 후 대상은 이 주문에 대해 <strong>1분간 면역</strong>이 됩니다."
  },
  {
    "id": "chilling-darkness",
    "name_ko": "냉기의 어둠",
    "name_en": "Chilling Darkness",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "공격",
      "냉기",
      "어둠",
      "조작",
      "불경"
    ],
    "range": "120피트",
    "target": "생물 1",
    "defense": "AC",
    "summary": "불경한 에너지가 스며든 극도로 차가운 어둠의 광선을 발사합니다. 원거리 주문 명중 굴림을 합니다. 광선은 5d6 냉기 피해를 가합니다. 대상이 신성 특성을 지니고 있다면 추가로 5d6 영혼 피해를 가합니다.대성공: 대상이 2배 피해를 받습니다.성공: 대상이 전체 피해를 받습니다.광선이 마법 빛의 영역을 통과하거나 마법 빛의 영향을 받는 생물을 대상으로...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> AC<br>불경한 에너지가 스며든 극도로 차가운 어둠의 광선을 발사합니다. 원거리 주문 명중 굴림을 합니다. 광선은 <strong>5d6 냉기 피해</strong>를 가합니다. 대상이 신성 특성을 지니고 있다면 추가로 <strong>5d6 영혼 피해</strong>를 가합니다.<br><strong>대성공:</strong> 대상이 2배 피해를 받습니다.<br><strong>성공:</strong> 대상이 전체 피해를 받습니다.<br>광선이 마법 빛의 영역을 통과하거나 마법 빛의 영향을 받는 생물을 대상으로 삼는 경우, 냉기의 어둠은 해당 빛을 상쇄하려 시도합니다. 광선이 빛의 영역을 통과하는지 판단할 필요가 있다면, 자신과 주문의 대상 사이에 선을 그어 확인합니다.<br><strong>강화(+1):</strong> 냉기 피해 +2d6, 신성 생물에 대한 영혼 피해 +2d6."
  },
  {
    "id": "cozy-cabin",
    "name_ko": "아늑한 오두막",
    "name_en": "Cozy Cabin",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "duration": "12시간",
    "castTime": "1분",
    "summary": "악천후로부터 보호된 임시 오두막을 소환합니다. 20피트 정육면체, 최대 10명 수용. 내부는 따뜻하고 건조하며, 비와 바람을 차단합니다. 오두막은 피해를 받지 않지만 마법 해제로 제거 가능.",
    "desc": "<strong>지속 시간:</strong> 12시간<br><strong>시전:</strong> 1분<br>악천후로부터 보호된 임시 오두막을 소환합니다. 20피트 정육면체, 최대 10명 수용. 내부는 따뜻하고 건조하며, 비와 바람을 차단합니다. 오두막은 피해를 받지 않지만 마법 해제로 제거 가능."
  },
  {
    "id": "crisis-of-faith",
    "name_ko": "신앙 위기",
    "name_en": "Crisis of Faith",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "summary": "대상의 신앙을 공격하여 의심과 정신적 혼란을 일으킵니다. 6d6 정신 피해(신성 주문시전자에게는 6d8).대성공: 영향 없음. 성공: 절반 피해. 실패: 전체 피해; 신성 시전자면 현기증 1(1라운드). 대실패: 2배 피해, 현기증 1(1라운드), 신성 주문 시전 불가(1라운드).자신의 신격 추종자에게 중대한 이유 없이 시전하면 대부분의 신에게 금기(...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br>대상의 신앙을 공격하여 의심과 정신적 혼란을 일으킵니다. <strong>6d6 정신 피해</strong>(신성 주문시전자에게는 6d8).<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 절반 피해. <strong>실패:</strong> 전체 피해; 신성 시전자면 현기증 1(1라운드). <strong>대실패:</strong> 2배 피해, 현기증 1(1라운드), 신성 주문 시전 불가(1라운드).<br>자신의 신격 추종자에게 중대한 이유 없이 시전하면 대부분의 신에게 금기(anathema).<br><strong>강화(+1):</strong> 피해 +2d6(또는 신성 시전자에게 +2d8)."
  },
  {
    "id": "dream-message",
    "name_ko": "꿈의 전언",
    "name_en": "Dream Message",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "3행동",
    "traits": [
      "조작",
      "정신"
    ],
    "range": "행성 전체",
    "target": "알고 있는 생물 1",
    "duration": "다음 일일 준비까지",
    "castTime": "10분",
    "summary": "잠자는 생물의 꿈에 메시지를 전달합니다. 메시지는 최대 약 1분 분량의 대화로 구성할 수 있습니다. 대상이 이미 잠들어 있다면 메시지가 즉시 꿈에 나타납니다. 대상이 깨어 있다면, 주문의 지속 시간 내 대상이 처음 잠들 때 메시지가 전달됩니다. 대상은 잠에서 깨어난 후에도 꿈 메시지의 내용을 명확하게 기억합니다. 대상이 주문 지속 시간 내에 한 번도 ...",
    "desc": "<strong>사거리:</strong> 행성 전체<br><strong>대상:</strong> 알고 있는 생물 1<br><strong>지속 시간:</strong> 다음 일일 준비까지<br><strong>시전:</strong> 10분<br>잠자는 생물의 꿈에 메시지를 전달합니다. 메시지는 최대 약 1분 분량의 대화로 구성할 수 있습니다. 대상이 이미 잠들어 있다면 메시지가 즉시 꿈에 나타납니다. 대상이 깨어 있다면, 주문의 지속 시간 내 대상이 처음 잠들 때 메시지가 전달됩니다. 대상은 잠에서 깨어난 후에도 꿈 메시지의 내용을 명확하게 기억합니다. 대상이 주문 지속 시간 내에 한 번도 잠들지 않으면 메시지는 전달되지 않고 주문이 소멸됩니다.<br><strong>강화(4랭크):</strong> 최대 <strong>8</strong>명의 생물에게 같은 메시지를 보낼 수 있습니다."
  },
  {
    "id": "earthbind",
    "name_ko": "대지 속박",
    "name_en": "Earthbind",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "120피트",
    "target": "비행 중인 생물 1",
    "defense": "인내",
    "summary": "비행 중인 생물에 대지의 인력을 강화하여 끌어내립니다. 대상은 인내 내성을 시도합니다.대성공: 영향 없음.성공: 대상이 최대 120피트까지 안전하게 하강합니다.실패: 대상이 최대 120피트까지 안전하게 하강합니다. 땅에 도달하면 1라운드 동안 비행, 부양, 또는 기타 방법으로 지면을 떠날 수 없습니다.대실패: 대상이 최대 120피트까지 안전하게 하강합...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 비행 중인 생물 1<br><strong>방어:</strong> 인내<br>비행 중인 생물에 대지의 인력을 강화하여 끌어내립니다. 대상은 인내 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 대상이 최대 <strong>120피트</strong>까지 안전하게 하강합니다.<br><strong>실패:</strong> 대상이 최대 <strong>120피트</strong>까지 안전하게 하강합니다. 땅에 도달하면 <strong>1라운드</strong> 동안 비행, 부양, 또는 기타 방법으로 지면을 떠날 수 없습니다.<br><strong>대실패:</strong> 대상이 최대 <strong>120피트</strong>까지 안전하게 하강합니다. 땅에 도달하면 <strong>1분</strong> 동안 비행, 부양, 또는 기타 방법으로 지면을 떠날 수 없습니다."
  },
  {
    "id": "enthrall",
    "name_ko": "매혹",
    "name_en": "Enthrall",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "청각",
      "감정",
      "조작"
    ],
    "range": "120피트",
    "target": "당신의 말을 들을 수 있는 모든 생물",
    "defense": "의지",
    "duration": "유지(최대 10분)",
    "summary": "당신의 말과 몸짓이 주변 생물을 사로잡습니다. 대상은 의지 내성을 시도합니다.대성공: 영향 없음. 이 시전에 대해 면역이 됩니다.성공: 영향 없음.실패: 대상이 매혹(fascinated) 상태가 되어, 당신의 연설에 집중해야 합니다. 매혹된 동안 다른 행동에 -2 상태 페널티를 받습니다. 대상에게 적대 행동을 하면 매혹이 즉시 종료됩니다. 주문을 유지...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 당신의 말을 들을 수 있는 모든 생물<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 유지(최대 10분)<br>당신의 말과 몸짓이 주변 생물을 사로잡습니다. 대상은 의지 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음. 이 시전에 대해 면역이 됩니다.<br><strong>성공:</strong> 영향 없음.<br><strong>실패:</strong> 대상이 <strong>매혹(fascinated)</strong> 상태가 되어, 당신의 연설에 집중해야 합니다. 매혹된 동안 다른 행동에 -2 상태 페널티를 받습니다. 대상에게 적대 행동을 하면 매혹이 즉시 종료됩니다. 주문을 유지하면 매혹 상태가 지속됩니다.<br><strong>대실패:</strong> 실패와 같지만, 대상은 자신이 매혹당했음을 인지하지 못합니다."
  },
  {
    "id": "ephemeral-tracking",
    "name_ko": "추적의 잔상",
    "name_en": "Ephemeral Tracking",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "탐지"
    ],
    "duration": "1시간",
    "summary": "생물의 비물질적 흔적(영혼의 잔재, 정신적 인상)을 추적합니다. 에테르 차원이나 그림자 차원을 통해 이동한 생물도 추적 가능.",
    "desc": "<strong>지속 시간:</strong> 1시간<br>생물의 비물질적 흔적(영혼의 잔재, 정신적 인상)을 추적합니다. 에테르 차원이나 그림자 차원을 통해 이동한 생물도 추적 가능."
  },
  {
    "id": "feet-to-fins",
    "name_ko": "지느러미",
    "name_en": "Feet to Fins",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변형"
    ],
    "range": "접촉",
    "target": "자발적 생물 1",
    "duration": "10분",
    "summary": "대상의 발이 지느러미로 변하여 통상 지상 이동 속도와 동일한 수영 속도를 얻지만, 지상 이동 속도가 5피트로 줄어듭니다.강화(6랭크): 지속 시간이 다음 일일 준비까지로 늘어납니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 자발적 생물 1<br><strong>지속 시간:</strong> 10분<br>대상의 발이 지느러미로 변하여 통상 지상 이동 속도와 동일한 <strong>수영 속도</strong>를 얻지만, 지상 이동 속도가 <strong>5피트</strong>로 줄어듭니다.<br><strong>강화(6랭크):</strong> 지속 시간이 다음 일일 준비까지로 늘어납니다."
  },
  {
    "id": "fireball",
    "name_ko": "화염구",
    "name_en": "Fireball",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "화염",
      "조작"
    ],
    "range": "500피트",
    "area": "20피트 폭발",
    "defense": "기본 반사",
    "summary": "당신이 지정한 지점에서 울부짖는 화염의 폭발이 일어납니다. 영역 내 각 생물은 6d6 화염 피해를 받고 기본 반사 내성을 시도합니다. 화염구의 불길은 미세하게 모퉁이를 돌아 퍼지므로, 사거리 내라면 완전한 차폐 뒤의 생물에게도 영향을 줄 수 있습니다. 영역 내의 가연성 물체에 불이 붙을 수 있습니다.강화(+1): 피해 +2d6.",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>영역:</strong> 20피트 폭발<br><strong>방어:</strong> 기본 반사<br>당신이 지정한 지점에서 울부짖는 화염의 폭발이 일어납니다. 영역 내 각 생물은 <strong>6d6 화염 피해</strong>를 받고 <strong>기본 반사 내성</strong>을 시도합니다. 화염구의 불길은 미세하게 모퉁이를 돌아 퍼지므로, 사거리 내라면 완전한 차폐 뒤의 생물에게도 영향을 줄 수 있습니다. 영역 내의 가연성 물체에 불이 붙을 수 있습니다.<br><strong>강화(+1):</strong> 피해 +2d6."
  },
  {
    "id": "ghostly-weapon",
    "name_ko": "유령 무기",
    "name_en": "Ghostly Weapon",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "주인 없거나 당신 또는 아군이 들고 있는 무기 1",
    "duration": "5분",
    "summary": "무기가 반투명하고 유령 같은 모습이 되어 물질적 존재와 무형(incorporeal) 존재 모두에 영향을 줍니다. 유령 접촉(ghost touch) 속성 룬의 효과를 얻습니다. 마법 무기가 아니었다면 마법 무기가 됩니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 주인 없거나 당신 또는 아군이 들고 있는 무기 1<br><strong>지속 시간:</strong> 5분<br>무기가 반투명하고 유령 같은 모습이 되어 물질적 존재와 무형(incorporeal) 존재 모두에 영향을 줍니다. 유령 접촉(ghost touch) 속성 룬의 효과를 얻습니다. 마법 무기가 아니었다면 마법 무기가 됩니다."
  },
  {
    "id": "haste",
    "name_ko": "가속",
    "name_en": "Haste",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "duration": "1분",
    "summary": "생물의 속도를 높여 더 자주 공격하거나 이동할 수 있게 합니다. 대상이 가속(quickened) 상태가 되어 매 턴 추가 행동 1개를 얻으며, 이 행동은 보폭(Stride) 또는 타격(Strike)에만 사용 가능.강화(7랭크): 최대 6 생물 대상.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 1분<br>생물의 속도를 높여 더 자주 공격하거나 이동할 수 있게 합니다. 대상이 <strong>{{condition:Quickened}}</strong> 상태가 되어 매 턴 <strong>추가 행동 1개</strong>를 얻으며, 이 행동은 <strong>보폭(Stride) 또는 타격(Strike)</strong>에만 사용 가능.<br><strong>강화(7랭크):</strong> 최대 6 생물 대상."
  },
  {
    "id": "heroism",
    "name_ko": "영웅심",
    "name_en": "Heroism",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "정신"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "10분",
    "summary": "대상의 내면에 잠든 영웅심을 북돋워 모든 행위에 영감을 불어넣습니다. 주문의 지속 시간 동안, 대상은 명중 굴림, 지각 판정, 기술 판정, 내성 굴림에 +1 상태 보너스를 얻습니다.강화(6랭크): 보너스가 +2로 증가합니다.강화(9랭크): 보너스가 +3으로 증가합니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 10분<br>대상의 내면에 잠든 영웅심을 북돋워 모든 행위에 영감을 불어넣습니다. 주문의 지속 시간 동안, 대상은 명중 굴림, 지각 판정, 기술 판정, 내성 굴림에 <strong>+1 상태 보너스</strong>를 얻습니다.<br><strong>강화(6랭크):</strong> 보너스가 <strong>+2</strong>로 증가합니다.<br><strong>강화(9랭크):</strong> 보너스가 <strong>+3</strong>으로 증가합니다."
  },
  {
    "id": "holy-light",
    "name_ko": "신성한 빛",
    "name_en": "Holy Light",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "공격",
      "화염",
      "신성(한)",
      "빛",
      "조작"
    ],
    "range": "120피트",
    "target": "생물 1",
    "defense": "AC",
    "summary": "신성한 에너지가 깃든 작열하는 빛의 광선을 발사합니다. 원거리 주문 명중 굴림을 합니다. 이 광선은 5d6 화염 피해를 줍니다. 대상이 불경(unholy) 특성을 지니고 있다면, 추가로 5d6 영혼 피해를 줍니다.대성공: 대상이 두 배 피해를 받습니다.성공: 대상이 전체 피해를 받습니다.이 빛이 마법적 어둠 영역을 통과하거나 마법적 어둠의 영향을 받는...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> AC<br>신성한 에너지가 깃든 작열하는 빛의 광선을 발사합니다. 원거리 주문 명중 굴림을 합니다. 이 광선은 <strong>5d6 화염 피해</strong>를 줍니다. 대상이 불경(unholy) 특성을 지니고 있다면, 추가로 <strong>5d6 영혼 피해</strong>를 줍니다.<br><strong>대성공:</strong> 대상이 두 배 피해를 받습니다.<br><strong>성공:</strong> 대상이 전체 피해를 받습니다.<br>이 빛이 마법적 어둠 영역을 통과하거나 마법적 어둠의 영향을 받는 생물을 대상으로 삼을 경우, 신성한 빛은 그 어둠을 상쇄하려고 시도합니다. 빛이 어둠 영역을 통과하는지 확인해야 한다면, 당신 자신과 주문의 대상 사이에 선을 그어 판단합니다.<br><strong>강화(+1):</strong> 화염 피해가 2d6 증가하고, 불경 생물에 대한 영혼 피해도 2d6 증가합니다."
  },
  {
    "id": "hypercognition",
    "name_ko": "초인지",
    "name_en": "Hypercognition",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "1행동",
    "traits": [],
    "summary": "방대한 양의 정보를 순간적으로 회상합니다. 즉시 6회의 지식 회상(Recall Knowledge) 판정을 할 수 있으며(각각 다른 주제), 다중 공격 페널티 등은 적용되지 않습니다.",
    "desc": "방대한 양의 정보를 순간적으로 회상합니다. 즉시 <strong>6회의 지식 회상(Recall Knowledge) 판정</strong>을 할 수 있으며(각각 다른 주제), 다중 공격 페널티 등은 적용되지 않습니다."
  },
  {
    "id": "hypnotize",
    "name_ko": "최면",
    "name_en": "Hypnotize",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "조작",
      "시각"
    ],
    "area": "30피트 발산",
    "defense": "의지",
    "duration": "유지(최대 1라운드)",
    "summary": "빠르게 변화하는 색채와 무늬의 폭발이 영역 내 생물의 시선을 사로잡습니다. 각 생물은 의지 내성을 시도합니다.대성공: 영향 없음.성공: 현혹됨(dazzled) 1라운드.실패: 매혹(fascinated) 상태가 됩니다. 유지하면 매혹이 지속됩니다. 적대 행동을 받으면 매혹 종료.대실패: 매혹 상태 + 기절(stunned) 2.",
    "desc": "<strong>영역:</strong> 30피트 발산<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 유지(최대 1라운드)<br>빠르게 변화하는 색채와 무늬의 폭발이 영역 내 생물의 시선을 사로잡습니다. 각 생물은 의지 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> <strong>{{condition:Dazzled}}</strong> 1라운드.<br><strong>실패:</strong> <strong>매혹(fascinated)</strong> 상태가 됩니다. 유지하면 매혹이 지속됩니다. 적대 행동을 받으면 매혹 종료.<br><strong>대실패:</strong> <strong>매혹</strong> 상태 + <strong>{{condition:Stunned}} 2</strong>."
  },
  {
    "id": "insect-form",
    "name_ko": "곤충 형태",
    "name_en": "Insect Form",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "duration": "1분",
    "summary": "위험한 거대 곤충으로 변신합니다. 중형, AC=18+레벨, 임시 HP 10. 개미, 딱정벌레, 지네, 사마귀, 거미, 말벌 중 선택.강화(5랭크): 대형, 비행 가능(일부 형태).",
    "desc": "<strong>지속 시간:</strong> 1분<br>위험한 거대 곤충으로 변신합니다. 중형, AC=18+레벨, 임시 HP 10. 개미, 딱정벌레, 지네, 사마귀, 거미, 말벌 중 선택.<br><strong>강화(5랭크):</strong> 대형, 비행 가능(일부 형태)."
  },
  {
    "id": "levitate",
    "name_ko": "부양",
    "name_en": "Levitate",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "비고정 물체 1 또는 동의 생물 1",
    "duration": "5분",
    "summary": "물체나 생물을 지면에서 몇 피트 띄웁니다. 대상이 10피트 상승하며, 유지 시 턴당 10피트 상승/하강 가능. 수평 이동은 불가(벽이나 천장 등을 밀어서는 가능).",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 비고정 물체 1 또는 동의 생물 1<br><strong>지속 시간:</strong> 5분<br>물체나 생물을 지면에서 몇 피트 띄웁니다. 대상이 10피트 상승하며, 유지 시 턴당 10피트 상승/하강 가능. 수평 이동은 불가(벽이나 천장 등을 밀어서는 가능)."
  },
  {
    "id": "lightning-bolt",
    "name_ko": "번개줄기",
    "name_en": "Lightning Bolt",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "전기",
      "조작"
    ],
    "area": "120피트 직선",
    "defense": "기본 반사",
    "summary": "강력한 번개 줄기가 당신에게서 일직선으로 뻗어나갑니다. 직선 경로에 있는 모든 생물은 4d12 전기 피해를 받고 기본 반사 내성을 시도합니다. 번개는 최대 120피트까지 뻗어나가며, 경로에 있는 비마법 가연물에 불이 붙을 수 있습니다.강화(+1): 피해 +1d12.",
    "desc": "<strong>영역:</strong> 120피트 직선<br><strong>방어:</strong> 기본 반사<br>강력한 번개 줄기가 당신에게서 일직선으로 뻗어나갑니다. 직선 경로에 있는 모든 생물은 <strong>4d12 전기 피해</strong>를 받고 <strong>기본 반사 내성</strong>을 시도합니다. 번개는 최대 120피트까지 뻗어나가며, 경로에 있는 비마법 가연물에 불이 붙을 수 있습니다.<br><strong>강화(+1):</strong> 피해 +1d12."
  },
  {
    "id": "locate",
    "name_ko": "위치 탐지",
    "name_en": "Locate",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "탐지",
      "조작"
    ],
    "duration": "10분",
    "castTime": "10분",
    "summary": "당신이 찾고 있는 특정 물체나 생물의 방향을 알아냅니다. 이전에 해당 물체나 생물을 본 적이 있다면(이 경우 주문이 현재 위치의 대략적인 방향을 알려줍니다), 또는 대상과 밀접하게 연관된 물체를 가지고 있다면(이 경우 그 물체를 집중 매개체로 사용하여 500피트 내의 유사한 생물이나 물체를 찾을 수 있습니다) 이 주문을 사용할 수 있습니다. 대상이 5...",
    "desc": "<strong>지속 시간:</strong> 10분<br><strong>시전:</strong> 10분<br>당신이 찾고 있는 특정 물체나 생물의 방향을 알아냅니다. 이전에 해당 물체나 생물을 본 적이 있다면(이 경우 주문이 현재 위치의 대략적인 방향을 알려줍니다), 또는 대상과 밀접하게 연관된 물체를 가지고 있다면(이 경우 그 물체를 집중 매개체로 사용하여 500피트 내의 유사한 생물이나 물체를 찾을 수 있습니다) 이 주문을 사용할 수 있습니다. 대상이 500피트 이상 떨어져 있거나, 희귀하거나 유일한 대상의 경우 10마일 이상 떨어져 있거나, 당신과 같은 차원에 존재하지 않으면 주문이 실패합니다."
  },
  {
    "id": "malicious-shadow",
    "name_ko": "악의의 그림자",
    "name_en": "Malicious Shadow",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "어둠",
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "유지(최대 1분)",
    "summary": "대상의 그림자가 적대적으로 변합니다. 의지 실패 시 대상의 그림자가 매 턴 2d6 공허 피해를 줍니다. 대상이 밝은 빛에서는 피해 2배, 어둠에서는 피해 없음.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 유지(최대 1분)<br>대상의 그림자가 적대적으로 변합니다. 의지 실패 시 대상의 그림자가 매 턴 <strong>2d6 공허 피해</strong>를 줍니다. 대상이 밝은 빛에서는 피해 2배, 어둠에서는 피해 없음."
  },
  {
    "id": "one-with-stone",
    "name_ko": "돌과 하나",
    "name_en": "One with Stone",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "대지",
      "조작"
    ],
    "duration": "10분",
    "summary": "돌 속으로 녹아들거나 돌로 변합니다. 돌의 표면에 녹아들면 내부에서 안전하게 숨을 수 있습니다. 돌의 감각으로 외부를 인지할 수 있지만 행동은 불가.",
    "desc": "<strong>지속 시간:</strong> 10분<br>돌 속으로 녹아들거나 돌로 변합니다. 돌의 표면에 녹아들면 내부에서 안전하게 숨을 수 있습니다. 돌의 감각으로 외부를 인지할 수 있지만 행동은 불가."
  },
  {
    "id": "paralyze",
    "name_ko": "마비",
    "name_en": "Paralyze",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "다양",
    "summary": "대상의 운동 충동을 차단하여 제자리에 얼어붙게 합니다. 대상은 의지 내성을 시도합니다.대성공: 영향 없음.성공: 기절(stunned) 1.실패: 1라운드 동안 마비(paralyzed).대실패: 4라운드 동안 마비. 매 턴 끝에 새로운 의지 내성을 시도하여, 잔여 지속 시간을 1라운드 줄이거나, 대성공 시 완전히 종료할 수 있습니다.강화(7랭크): 최대...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 다양<br>대상의 운동 충동을 차단하여 제자리에 얼어붙게 합니다. 대상은 의지 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> <strong>{{condition:Stunned}} 1</strong>.<br><strong>실패:</strong> <strong>1라운드</strong> 동안 <strong>{{condition:Paralyzed}}</strong>.<br><strong>대실패:</strong> <strong>4라운드</strong> 동안 <strong>마비</strong>. 매 턴 끝에 새로운 의지 내성을 시도하여, 잔여 지속 시간을 1라운드 줄이거나, 대성공 시 완전히 종료할 수 있습니다.<br><strong>강화(7랭크):</strong> 최대 <strong>10</strong>명의 생물을 대상으로 삼을 수 있습니다."
  },
  {
    "id": "personal-blizzard",
    "name_ko": "개인 눈보라",
    "name_en": "Personal Blizzard",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "냉기",
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "반사",
    "duration": "유지(최대 1분)",
    "summary": "대상 주위에 작은 눈보라가 소용돌이칩니다. 1d6 냉기 피해(반사)+대상이 은폐(concealed)(다른 이에 대해). 유지 시 재피해.강화(+1): 피해 +1d6.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 반사<br><strong>지속 시간:</strong> 유지(최대 1분)<br>대상 주위에 작은 눈보라가 소용돌이칩니다. <strong>1d6 냉기 피해</strong>(반사)+대상이 <strong>{{condition:Concealed}}</strong>(다른 이에 대해). 유지 시 재피해.<br><strong>강화(+1):</strong> 피해 +1d6."
  },
  {
    "id": "ring-of-truth",
    "name_ko": "진실의 종",
    "name_en": "Ring of Truth",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작"
    ],
    "range": "30피트",
    "area": "30피트 폭발",
    "defense": "의지",
    "duration": "10분",
    "summary": "거짓말을 탐지하는 종소리가 울립니다. 영역 내 생물이 거짓말을 하면 종이 울립니다. 기만(Deception) 판정에 -2 상태 페널티를 받습니다.대성공: 거짓말을 하고 기만 판정에 성공해도 종이 울림. 성공: 거짓말을 하고 기만 판정에 성공해도 종이 울림. 실패: 종이 기만을 정확히 꿰뚫어 보며, 거짓말을 해도 종이 울리지 않음.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>영역:</strong> 30피트 폭발<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 10분<br>거짓말을 탐지하는 종소리가 울립니다. 영역 내 생물이 거짓말을 하면 종이 울립니다. 기만(Deception) 판정에 <strong>-2 상태 페널티</strong>를 받습니다.<br><strong>대성공:</strong> 거짓말을 하고 기만 판정에 성공해도 종이 울림. <strong>성공:</strong> 거짓말을 하고 기만 판정에 성공해도 종이 울림. <strong>실패:</strong> 종이 기만을 정확히 꿰뚫어 보며, 거짓말을 해도 종이 울리지 않음."
  },
  {
    "id": "safe-passage",
    "name_ko": "안전 통행",
    "name_en": "Safe Passage",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "area": "10×10×10피트 높이, 60피트 길이 지형 구간",
    "duration": "유지(최대 1분)",
    "summary": "영역을 안전하게 이동할 수 있게 합니다. 영역 내 아군은 AC에 +2 상태 보너스를 얻고 위험 요소의 모든 피해에 대해 저항 5를 얻습니다.강화(5랭크): 저항 10, 영역 120피트. 강화(8랭크): 저항 15, 영역 500피트.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>영역:</strong> 10×10×10피트 높이, 60피트 길이 지형 구간<br><strong>지속 시간:</strong> 유지(최대 1분)<br>영역을 안전하게 이동할 수 있게 합니다. 영역 내 아군은 AC에 <strong>+2 상태 보너스</strong>를 얻고 위험 요소의 모든 피해에 대해 <strong>저항 5</strong>를 얻습니다.<br><strong>강화(5랭크):</strong> 저항 10, 영역 120피트. <strong>강화(8랭크):</strong> 저항 15, 영역 500피트."
  },
  {
    "id": "slow",
    "name_ko": "느리게",
    "name_en": "Slow",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "인내",
    "duration": "다양",
    "summary": "대상 주위의 시간 흐름을 늘려 행동을 둔화시킵니다. 대상은 인내 내성을 시도합니다.대성공: 영향 없음.성공: 1라운드 동안 둔화(slowed) 1.실패: 1분 동안 둔화 1.대실패: 1분 동안 둔화 2.강화(6랭크): 최대 10명의 생물을 대상으로 삼을 수 있습니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br><strong>지속 시간:</strong> 다양<br>대상 주위의 시간 흐름을 늘려 행동을 둔화시킵니다. 대상은 인내 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> <strong>1라운드</strong> 동안 <strong>{{condition:Slowed}} 1</strong>.<br><strong>실패:</strong> <strong>1분</strong> 동안 <strong>둔화 1</strong>.<br><strong>대실패:</strong> <strong>1분</strong> 동안 <strong>둔화 2</strong>.<br><strong>강화(6랭크):</strong> 최대 <strong>10</strong>명의 생물을 대상으로 삼을 수 있습니다."
  },
  {
    "id": "speak-with-plants",
    "name_ko": "식물과 대화",
    "name_en": "Speak with Plants",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "식물"
    ],
    "duration": "1시간",
    "summary": "식물 및 균류와 소통합니다.강화(4랭크): 지속 시간 8시간.",
    "desc": "<strong>지속 시간:</strong> 1시간<br>식물 및 균류와 소통합니다.<br><strong>강화(4랭크):</strong> 지속 시간 8시간."
  },
  {
    "id": "vampiric-feast",
    "name_ko": "흡혈 잔치",
    "name_en": "Vampiric Feast",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "공허"
    ],
    "range": "접촉",
    "target": "살아있는 생물 1",
    "defense": "기본 인내",
    "summary": "접촉으로 공허 피해를 주고 임시 HP를 얻습니다. 6d6 공허 피해(기본 인내). 대상이 받은 공허 피해의 절반만큼 임시 HP를 얻습니다(1분 후 남은 임시 HP 상실).강화(+1): 피해 +2d6.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 살아있는 생물 1<br><strong>방어:</strong> 기본 인내<br>접촉으로 공허 피해를 주고 임시 HP를 얻습니다. <strong>6d6 공허 피해</strong>(기본 인내). 대상이 받은 공허 피해의 절반만큼 <strong>임시 HP</strong>를 얻습니다(1분 후 남은 임시 HP 상실).<br><strong>강화(+1):</strong> 피해 +2d6."
  },
  {
    "id": "veil-of-privacy",
    "name_ko": "사생활 장막",
    "name_en": "Veil of Privacy",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작"
    ],
    "range": "접촉",
    "target": "생물 또는 물체 1",
    "duration": "8시간",
    "castTime": "10분",
    "summary": "탐지/발견/투시를 상쇄합니다. 캔트립은 1랭크 주문으로 취급합니다. 영역/복수 대상 주문을 성공적으로 상쇄하면 장막 대상에 대한 효과만 무효화합니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 또는 물체 1<br><strong>지속 시간:</strong> 8시간<br><strong>시전:</strong> 10분<br>탐지/발견/투시를 상쇄합니다. 캔트립은 1랭크 주문으로 취급합니다. 영역/복수 대상 주문을 성공적으로 상쇄하면 장막 대상에 대한 효과만 무효화합니다."
  },
  {
    "id": "wall-of-thorns",
    "name_ko": "가시 벽",
    "name_en": "Wall of Thorns",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "조작",
      "식물"
    ],
    "range": "60피트",
    "duration": "1분",
    "summary": "가시 덤불 벽. 최대 60피트 길이, 10피트 높이, 5피트 두께. 반대편 생물에 대해 엄폐 제공. 험지(벽 공간). 벽 공간에 진입하는 이동 행동마다 3d4 관통 피해. 각 10×10 구간: AC 10, 경도 10, HP 20. 치명타/정밀 피해 면역. 파괴된 구간은 자유롭게 통과 가능.강화(+1): 각 구간 HP +5, 관통 피해 +1d4.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>지속 시간:</strong> 1분<br>가시 덤불 벽. 최대 60피트 길이, 10피트 높이, 5피트 두께. 반대편 생물에 대해 엄폐 제공. 험지(벽 공간). 벽 공간에 진입하는 이동 행동마다 <strong>3d4 관통 피해</strong>. 각 10×10 구간: AC 10, 경도 10, HP 20. 치명타/정밀 피해 면역. 파괴된 구간은 자유롭게 통과 가능.<br><strong>강화(+1):</strong> 각 구간 HP +5, 관통 피해 +1d4."
  },
  {
    "id": "wall-of-wind",
    "name_ko": "바람 벽",
    "name_en": "Wall of Wind",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "공기",
      "조작"
    ],
    "range": "120피트",
    "duration": "1분",
    "summary": "5피트 두께, 60피트 길이, 30피트 높이. 경로 형태 조정 가능. 시야 방해 없음. 탄환/투창 등 소형 원거리 무기는 명중 굴림에 -2 상황 페널티. 더 큰 원거리 무기/물리적 물체를 만들지 않는 주문 효과는 정상 통과. 가스/증기 형태 생물은 통과 불가(육상 이동은 험지). 비행 생물이 이동 행동으로 통과 시 인내 내성: 대성공: 정상 통과. 성...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>지속 시간:</strong> 1분<br>5피트 두께, 60피트 길이, 30피트 높이. 경로 형태 조정 가능. 시야 방해 없음. 탄환/투창 등 소형 원거리 무기는 명중 굴림에 <strong>-2 상황 페널티</strong>. 더 큰 원거리 무기/물리적 물체를 만들지 않는 주문 효과는 정상 통과. 가스/증기 형태 생물은 통과 불가(육상 이동은 험지). 비행 생물이 이동 행동으로 통과 시 인내 내성: <strong>대성공:</strong> 정상 통과. <strong>성공:</strong> 험지로 통과. <strong>실패:</strong> 이동 중단. <strong>대실패:</strong> 10피트 밀려남."
  },
  {
    "id": "zealous-conviction",
    "name_ko": "열렬한 확신",
    "name_en": "Zealous Conviction",
    "rank": 3,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "감정",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "최대 10 동의 생물",
    "duration": "10분",
    "summary": "불굴의 확신과 열정을 동의하는 생물에 불어넣습니다. 대상이 10 임시 HP를 얻고, 공포(frightened) 및 도주(fleeing)에 대한 내성에 +2 상태 보너스.강화(+1): 임시 HP +3.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 최대 10 동의 생물<br><strong>지속 시간:</strong> 10분<br>불굴의 확신과 열정을 동의하는 생물에 불어넣습니다. 대상이 <strong>10 임시 HP</strong>를 얻고, {{condition:Frightened}} 및 {{condition:Fleeing}}에 대한 내성에 <strong>+2 상태 보너스</strong>.<br><strong>강화(+1):</strong> 임시 HP +3."
  },
  {
    "id": "aerial-form",
    "name_ko": "공중 형태",
    "name_en": "Aerial Form",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "duration": "1분",
    "summary": "날아다니는 전투 형태로 변신합니다. 중형, AC=18+레벨, 임시 HP 5, 비행 속도 다양. 박쥐, 새, 날벌레, 익룡 중 선택. 공격 수정치 +16, 피해 보너스 +5.강화(5랭크): 대형, 더 높은 능력치. 강화(6랭크): 용 형태에 접근 가능.",
    "desc": "<strong>지속 시간:</strong> 1분<br>날아다니는 전투 형태로 변신합니다. 중형, AC=18+레벨, 임시 HP 5, 비행 속도 다양. 박쥐, 새, 날벌레, 익룡 중 선택. 공격 수정치 +16, 피해 보너스 +5.<br><strong>강화(5랭크):</strong> 대형, 더 높은 능력치. <strong>강화(6랭크):</strong> 용 형태에 접근 가능."
  },
  {
    "id": "confusion",
    "name_ko": "혼란",
    "name_en": "Confusion",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "감정",
      "무력화",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "1분",
    "summary": "대상의 정신을 뒤흔들어 혼란에 빠뜨립니다. 대상은 의지 내성을 시도합니다. 혼란 상태에서 생물은 자신의 턴마다 DC 11 단순 판정을 합니다. 실패하면 인접한 무작위 생물(아군 포함)을 타격(Strike)합니다. 단순 판정에 성공하면 해당 턴에는 정상적으로 행동합니다. 각 턴 종료 시 추가 의지 내성을 시도하여 성공하면 주문이 종료됩니다.대성공: 영향...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1분<br>대상의 정신을 뒤흔들어 혼란에 빠뜨립니다. 대상은 의지 내성을 시도합니다. 혼란 상태에서 생물은 자신의 턴마다 DC 11 단순 판정을 합니다. 실패하면 인접한 무작위 생물(아군 포함)을 타격(Strike)합니다. 단순 판정에 성공하면 해당 턴에는 정상적으로 행동합니다. 각 턴 종료 시 추가 의지 내성을 시도하여 성공하면 주문이 종료됩니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> <strong>1라운드</strong> 동안 혼란 상태가 됩니다.<br><strong>실패:</strong> <strong>1분</strong> 동안 혼란 상태가 됩니다.<br><strong>대실패:</strong> <strong>1분</strong> 동안 혼란 상태가 되며, 턴 종료 시 내성으로 벗어날 수 없습니다.<br><strong>강화(8랭크):</strong> 30피트 폭발 영역 내 모든 생물을 대상으로 삼을 수 있습니다."
  },
  {
    "id": "creation",
    "name_ko": "창조",
    "name_en": "Creation",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "0피트",
    "duration": "1시간",
    "castTime": "1분",
    "summary": "마법 에너지에서 임시 물체를 만듭니다. 흙이나 식물 유래 물질(나무, 종이, 벽돌, 돌)이어야 하며 5 세제곱피트 이하. 복잡한 부품 불가, 비용 충족 불가, 귀중 재료 불가. 명백히 임시적이므로 진품으로 속일 수 없음.강화(5랭크): 금속 물체 가능.",
    "desc": "<strong>사거리:</strong> 0피트<br><strong>지속 시간:</strong> 1시간<br><strong>시전:</strong> 1분<br>마법 에너지에서 임시 물체를 만듭니다. 흙이나 식물 유래 물질(나무, 종이, 벽돌, 돌)이어야 하며 5 세제곱피트 이하. 복잡한 부품 불가, 비용 충족 불가, 귀중 재료 불가. 명백히 임시적이므로 진품으로 속일 수 없음.<br><strong>강화(5랭크):</strong> 금속 물체 가능."
  },
  {
    "id": "detect-scrying",
    "name_ko": "감시 탐지",
    "name_en": "Detect Scrying",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "탐지",
      "조작"
    ],
    "area": "30피트 발산",
    "duration": "1시간",
    "summary": "미세한 오라를 읽어 영역 내 투시 효과의 존재를 탐지합니다. 감시 탐지가 투시 효과보다 높은 랭크면, 투시하는 생물의 모습을 힐끗 보고 대략적 거리와 방향을 알 수 있습니다.강화(6랭크): 지속 시간 다음 일일 준비까지.",
    "desc": "<strong>영역:</strong> 30피트 발산<br><strong>지속 시간:</strong> 1시간<br>미세한 오라를 읽어 영역 내 투시 효과의 존재를 탐지합니다. 감시 탐지가 투시 효과보다 높은 랭크면, 투시하는 생물의 모습을 힐끗 보고 대략적 거리와 방향을 알 수 있습니다.<br><strong>강화(6랭크):</strong> 지속 시간 다음 일일 준비까지."
  },
  {
    "id": "dinosaur-form",
    "name_ko": "공룡 형태",
    "name_en": "Dinosaur Form",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "duration": "1분",
    "summary": "강력하고 무시무시한 공룡의 대형 동물 전투 형태로 변신합니다. AC=18+레벨, 임시 HP 15, 저광 시야, 부정확 후각 30피트. 공격 수정치 +16, 피해 보너스 +9. 안킬로사우루스, 브론토사우루스, 데이노니쿠스, 스테고사우루스, 트리케라톱스, 티라노사우루스 중 선택. 각 형태마다 고유 공격과 이동 속도.강화(5랭크): 거대, 도달 15피트, ...",
    "desc": "<strong>지속 시간:</strong> 1분<br>강력하고 무시무시한 공룡의 대형 동물 전투 형태로 변신합니다. AC=18+레벨, 임시 HP 15, 저광 시야, 부정확 후각 30피트. 공격 수정치 +16, 피해 보너스 +9. 안킬로사우루스, 브론토사우루스, 데이노니쿠스, 스테고사우루스, 트리케라톱스, 티라노사우루스 중 선택. 각 형태마다 고유 공격과 이동 속도.<br><strong>강화(5랭크):</strong> 거대, 도달 15피트, 임시 HP 20, 공격 +18, 피해 +6(2배 주사위).<br><strong>강화(7랭크):</strong> 초대형(Gargantuan), 도달 20피트, AC=21+레벨, 임시 HP 25, 공격 +25, 피해 +15."
  },
  {
    "id": "dispelling-globe",
    "name_ko": "해제 구체",
    "name_en": "Dispelling Globe",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작"
    ],
    "range": "120피트",
    "area": "10피트 폭발",
    "duration": "1분",
    "summary": "마법을 해제하는 보호 구체를 만듭니다. 이 구체의 랭크 이하인 마법 효과가 구체의 영역 안으로 들어오거나 영역 내에서 시전되면, 해제 구체가 자동으로 해당 효과에 대해 상쇄를 시도합니다. 이 주문의 랭크보다 높은 랭크의 효과에는 영향을 주지 않습니다. 구체는 이미 영역 내에 있는 효과에는 영향을 주지 않으며, 새로 들어오는 효과에만 반응합니다.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 10피트 폭발<br><strong>지속 시간:</strong> 1분<br>마법을 해제하는 보호 구체를 만듭니다. 이 구체의 랭크 이하인 마법 효과가 구체의 영역 안으로 들어오거나 영역 내에서 시전되면, 해제 구체가 자동으로 해당 효과에 대해 <strong>상쇄를 시도</strong>합니다. 이 주문의 랭크보다 높은 랭크의 효과에는 영향을 주지 않습니다. 구체는 이미 영역 내에 있는 효과에는 영향을 주지 않으며, 새로 들어오는 효과에만 반응합니다."
  },
  {
    "id": "divine-wrath",
    "name_ko": "신성한 분노",
    "name_en": "Divine Wrath",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "성별화",
      "영혼"
    ],
    "range": "120피트",
    "area": "20피트 폭발",
    "defense": "인내",
    "summary": "신성의 분노를 적들에게 쏟아붓습니다. 영역 내 적들에게 인내 내성에 따라 4d10 영혼 피해를 줍니다.대성공: 대상에게 영향 없음.성공: 대상이 절반 피해를 받습니다.실패: 대상이 전체 피해를 받고 메스꺼움(sickened) 1 상태가 됩니다.대실패: 대상이 전체 피해를 받고 메스꺼움(sickened) 2 상태가 됩니다. 메스꺼움 상태인 동안 둔화(s...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 20피트 폭발<br><strong>방어:</strong> 인내<br>신성의 분노를 적들에게 쏟아붓습니다. 영역 내 적들에게 인내 내성에 따라 <strong>4d10 영혼 피해</strong>를 줍니다.<br><strong>대성공:</strong> 대상에게 영향 없음.<br><strong>성공:</strong> 대상이 절반 피해를 받습니다.<br><strong>실패:</strong> 대상이 전체 피해를 받고 <strong>{{condition:Sickened}} 1</strong> 상태가 됩니다.<br><strong>대실패:</strong> 대상이 전체 피해를 받고 <strong>{{condition:Sickened}} 2</strong> 상태가 됩니다. 메스꺼움 상태인 동안 <strong>{{condition:Slowed}} 1</strong> 상태이기도 합니다.<br><strong>강화(+1):</strong> 피해가 1d10 증가합니다."
  },
  {
    "id": "fire-shield",
    "name_ko": "화염 방패",
    "name_en": "Fire Shield",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "화염",
      "조작"
    ],
    "duration": "1분",
    "summary": "떠다니는 화염 방패가 당신 곁을 따릅니다. 냉기 저항 5를 얻고, 온화하고 심각한 환경 냉기에 면역이 됩니다. 방패 올리기(Raise a Shield): AC에 +1 상황 보너스. 방패 막기(Shield Block): 경도 10, 화염 면역, 40 HP(파손 한계치 없음), 물 효과는 경도를 절반으로 줄입니다. 근접 비무장 또는 인접 생물의 공격을 방...",
    "desc": "<strong>지속 시간:</strong> 1분<br>떠다니는 화염 방패가 당신 곁을 따릅니다. <strong>냉기 저항 5</strong>를 얻고, 온화하고 심각한 환경 냉기에 면역이 됩니다. 방패 올리기(Raise a Shield): AC에 <strong>+1 상황 보너스</strong>. {{feat:Shield Block}}: 경도 10, 화염 면역, <strong>40 HP</strong>(파손 한계치 없음), 물 효과는 경도를 절반으로 줄입니다. 근접 비무장 또는 인접 생물의 공격을 방패 막기로 막으면, 공격자가 <strong>2d6 화염 피해</strong>를 받습니다.<br><strong>강화(+2):</strong> 냉기 저항 +5, HP +10, 화염 피해 +1d6."
  },
  {
    "id": "flicker",
    "name_ko": "깜빡임",
    "name_en": "Flicker",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "순간이동"
    ],
    "duration": "1분",
    "summary": "현실과 에테르 차원 사이를 깜빡이며, 힘을 제외한 모든 피해에 저항 5를 얻습니다. 각 턴이 끝날 때, 무작위 방향으로 자동으로 10피트 순간이동합니다.강화(+2): 저항이 3 증가합니다.",
    "desc": "<strong>지속 시간:</strong> 1분<br>현실과 에테르 차원 사이를 깜빡이며, 힘을 제외한 <strong>모든 피해에 저항 5</strong>를 얻습니다. 각 턴이 끝날 때, 무작위 방향으로 자동으로 <strong>10피트</strong> 순간이동합니다.<br><strong>강화(+2):</strong> 저항이 3 증가합니다."
  },
  {
    "id": "fly",
    "name_ko": "비행",
    "name_en": "Fly",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "5분",
    "summary": "대상에게 마법적인 비행 능력을 부여합니다. 대상은 자신의 이동 속도 또는 20피트 중 높은 것과 동일한 비행 속도를 얻습니다. 대상이 비행 중일 때 주문이 끝나면, 대상은 안전하게 착지하지 못하고 떨어집니다. 60피트까지는 천천히 떨어져 낙하 피해가 줄어들지만, 그 이상의 높이에서는 정상적인 낙하 피해를 받습니다.강화(7랭크): 지속 시간이 1시간으로...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 5분<br>대상에게 마법적인 비행 능력을 부여합니다. 대상은 <strong>자신의 이동 속도 또는 20피트 중 높은 것</strong>과 동일한 비행 속도를 얻습니다. 대상이 비행 중일 때 주문이 끝나면, 대상은 안전하게 착지하지 못하고 떨어집니다. 60피트까지는 천천히 떨어져 낙하 피해가 줄어들지만, 그 이상의 높이에서는 정상적인 낙하 피해를 받습니다.<br><strong>강화(7랭크):</strong> 지속 시간이 <strong>1시간</strong>으로 증가합니다."
  },
  {
    "id": "honeyed-words",
    "name_ko": "달콤한 말",
    "name_en": "Honeyed Words",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "정신"
    ],
    "duration": "10분",
    "summary": "가장 터무니없는 거짓말도 더 믿을 만하게 만듭니다. 기만(Deception) 판정에 +4 상태 보너스를 얻습니다.",
    "desc": "<strong>지속 시간:</strong> 10분<br>가장 터무니없는 거짓말도 더 믿을 만하게 만듭니다. 기만(Deception) 판정에 <strong>+4 상태 보너스</strong>를 얻습니다."
  },
  {
    "id": "liminal-doorway",
    "name_ko": "경계의 문",
    "name_en": "Liminal Doorway",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작",
      "그림자",
      "순간이동"
    ],
    "range": "60피트",
    "duration": "1시간",
    "summary": "두 장소를 연결하는 그림자 문을 만들어냅니다. 이 주문을 시전할 때 사거리 내의 목표 칸을 선택하여 먼 쪽 위치로 지정하고, 당신에게 인접한 출발 칸을 가까운 쪽 위치로 지정합니다. 당신과 동의하는 다른 생물들은 문을 통과할 수 있으며, 이는 단 하나의 행동만 필요하고 걷기(Step)로 계산됩니다. 가까운 쪽으로 들어가면 먼 쪽으로 나오며, 먼 쪽으로...",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>지속 시간:</strong> 1시간<br>두 장소를 연결하는 그림자 문을 만들어냅니다. 이 주문을 시전할 때 사거리 내의 목표 칸을 선택하여 먼 쪽 위치로 지정하고, 당신에게 인접한 출발 칸을 가까운 쪽 위치로 지정합니다. 당신과 동의하는 다른 생물들은 문을 통과할 수 있으며, 이는 단 하나의 행동만 필요하고 걷기(Step)로 계산됩니다. 가까운 쪽으로 들어가면 먼 쪽으로 나오며, 먼 쪽으로 들어가면 가까운 쪽으로 나옵니다.<br><strong>강화(2랭크):</strong> 지속 시간이 무제한이 되지만, 주문을 유지하기 위해 하루에 한 번 주문에 집중해야 합니다."
  },
  {
    "id": "mountain-resilience",
    "name_ko": "산의 강인함",
    "name_en": "Mountain Resilience",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "대지",
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "20분",
    "summary": "대상의 피부가 산의 바위처럼 단단해집니다. 물리 피해에 대한 저항 5를 얻습니다(정금석 제외). 대상이 둔기, 관통, 참격 공격에 맞을 때마다, 산의 강인함의 지속 시간이 1분 감소합니다.강화(6랭크): 저항이 10으로 증가합니다.강화(8랭크): 저항이 15로 증가합니다.강화(10랭크): 저항이 20으로 증가합니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 20분<br>대상의 피부가 산의 바위처럼 단단해집니다. <strong>물리 피해에 대한 저항 5</strong>를 얻습니다(정금석 제외). 대상이 둔기, 관통, 참격 공격에 맞을 때마다, 산의 강인함의 지속 시간이 1분 감소합니다.<br><strong>강화(6랭크):</strong> 저항이 <strong>10</strong>으로 증가합니다.<br><strong>강화(8랭크):</strong> 저항이 <strong>15</strong>로 증가합니다.<br><strong>강화(10랭크):</strong> 저항이 <strong>20</strong>으로 증가합니다."
  },
  {
    "id": "nightmare",
    "name_ko": "악몽",
    "name_en": "Nightmare",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작",
      "정신"
    ],
    "range": "행성 전체",
    "target": "이름을 아는 생물 1",
    "defense": "의지",
    "duration": "1일",
    "castTime": "10분",
    "summary": "대상에게 끔찍한 악몽을 보냅니다. 다음에 대상이 잠들면 의지 내성을 시도합니다. 이름으로만 알고 만난 적이 없다면 의지 내성에 +4 상황 보너스를 받습니다.대성공: 영향 없음, 1주일 동안 일시적 면역.성공: 악몽을 꾸지만 불쾌한 기억 외에 부정적 효과 없음.실패: 악몽을 꾸고 피로(fatigued) 상태로 깨어남.대실패: 악몽을 꾸고 피로 상태로 깨...",
    "desc": "<strong>사거리:</strong> 행성 전체<br><strong>대상:</strong> 이름을 아는 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1일<br><strong>시전:</strong> 10분<br>대상에게 끔찍한 악몽을 보냅니다. 다음에 대상이 잠들면 의지 내성을 시도합니다. 이름으로만 알고 만난 적이 없다면 의지 내성에 <strong>+4 상황 보너스</strong>를 받습니다.<br><strong>대성공:</strong> 영향 없음, 1주일 동안 일시적 면역.<br><strong>성공:</strong> 악몽을 꾸지만 불쾌한 기억 외에 부정적 효과 없음.<br><strong>실패:</strong> 악몽을 꾸고 <strong>{{condition:Fatigued}}</strong> 상태로 깨어남.<br><strong>대실패:</strong> 악몽을 꾸고 피로 상태로 깨어나며, 더 이상 피로하지 않을 때까지 <strong>{{condition:Drained}} 2</strong>."
  },
  {
    "id": "outcasts-curse",
    "name_ko": "추방자의 저주",
    "name_en": "Outcast's Curse",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "저주",
      "조작",
      "정신"
    ],
    "range": "접촉",
    "target": "생물 1",
    "defense": "의지",
    "summary": "생물을 불쾌하고 거슬리게 만드는 저주. 의지 실패 시 대상이 다른 생물과 상호작용할 때 항상 적대적 태도를 유발합니다. 사회적 기술 판정에 -4 상태 페널티. 저주는 상쇄될 때까지 지속.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br>생물을 불쾌하고 거슬리게 만드는 저주. 의지 실패 시 대상이 다른 생물과 상호작용할 때 항상 적대적 태도를 유발합니다. 사회적 기술 판정에 <strong>-4 상태 페널티</strong>. 저주는 상쇄될 때까지 지속."
  },
  {
    "id": "planar-tether",
    "name_ko": "차원 묶기",
    "name_en": "Planar Tether",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "다양",
    "summary": "대상을 현재 차원에 묶어둡니다. 순간이동 효과를 상쇄합니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 다양<br>대상을 현재 차원에 묶어둡니다. 순간이동 효과를 상쇄합니다."
  },
  {
    "id": "read-omens",
    "name_ko": "예언 읽기",
    "name_en": "Read Omens",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작",
      "예언"
    ],
    "castTime": "10분",
    "summary": "다가오는 사건에 대한 조언 한 조각을 얻습니다. 특정 목표나 사건에 대해 질문하면 GM이 암호적이지만 유용한 4단어 조언을 줍니다.",
    "desc": "<strong>시전:</strong> 10분<br>다가오는 사건에 대한 조언 한 조각을 얻습니다. 특정 목표나 사건에 대해 질문하면 GM이 암호적이지만 유용한 4단어 조언을 줍니다."
  },
  {
    "id": "rewrite-memory",
    "name_ko": "기억 재작성",
    "name_en": "Rewrite Memory",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "무제한",
    "summary": "대성공: 영향 없음, 시도를 인지함.성공: 영향 없음, 주문이 무해하다고 생각함(주문 식별 성공 시 제외).실패: 처음 5분 동안 라운드당 1회 유지하여 기억을 변경 가능. 유지당 6초의 기억, 최대 연속 5분까지. 주문이 지속되는 동안 기억이 변경된 상태로 유지됩니다. 대상이 사거리를 벗어나면 더 이상 변경 불가.강화(6랭크): 특정 주제(50단어 ...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 무제한<br><strong>대성공:</strong> 영향 없음, 시도를 인지함.<br><strong>성공:</strong> 영향 없음, 주문이 무해하다고 생각함(주문 식별 성공 시 제외).<br><strong>실패:</strong> 처음 5분 동안 라운드당 1회 유지하여 기억을 변경 가능. 유지당 6초의 기억, 최대 연속 5분까지. 주문이 지속되는 동안 기억이 변경된 상태로 유지됩니다. 대상이 사거리를 벗어나면 더 이상 변경 불가.<br><strong>강화(6랭크):</strong> 특정 주제(50단어 이하)에 대한 모든 기억을 영구적으로 억제하며, 불분명한 안개로 대체합니다."
  },
  {
    "id": "shape-stone",
    "name_ko": "돌 형성",
    "name_en": "Shape Stone",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "대지",
      "조작"
    ],
    "range": "접촉",
    "target": "돌 정육면체(10피트 이하)",
    "summary": "돌을 대략적 형태로 재형성합니다. 생물이 돌 위에 있을 경우: 성공 시 영향 없음, 실패 시 엎드러짐(prone), 대실패 시 돌에서 떨어져 엎드러짐.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 돌 정육면체(10피트 이하)<br>돌을 대략적 형태로 재형성합니다. 생물이 돌 위에 있을 경우: <strong>성공</strong> 시 영향 없음, <strong>실패</strong> 시 {{condition:Prone}}, <strong>대실패</strong> 시 돌에서 떨어져 엎드러짐."
  },
  {
    "id": "suggestion",
    "name_ko": "암시",
    "name_en": "Suggestion",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "언어",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "다양",
    "summary": "달콤한 말로 행동 방침을 암시합니다. 자해적이거나 자기 이익에 반하는 암시는 불가.대성공: 영향 없음, 주문 사용을 인지. 성공: 영향 없음. 실패: 암시를 따름. 지속 시간 1분, 또는 완수하거나 자해적/명백히 부정적이 되면 종료. 대실패: 실패와 같지만 기본 지속 시간 1시간.강화(8랭크): 최대 10명.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 다양<br>달콤한 말로 행동 방침을 암시합니다. 자해적이거나 자기 이익에 반하는 암시는 불가.<br><strong>대성공:</strong> 영향 없음, 주문 사용을 인지. <strong>성공:</strong> 영향 없음. <strong>실패:</strong> 암시를 따름. 지속 시간 1분, 또는 완수하거나 자해적/명백히 부정적이 되면 종료. <strong>대실패:</strong> 실패와 같지만 기본 지속 시간 1시간.<br><strong>강화(8랭크):</strong> 최대 10명."
  },
  {
    "id": "talking-corpse",
    "name_ko": "시체와 대화",
    "name_en": "Talking Corpse",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작"
    ],
    "range": "접촉",
    "target": "시체 1",
    "castTime": "10분",
    "summary": "시체가 세 가지 질문에 답합니다. 시체는 살아있을 때 알고 있던 정보만 답하며, 거짓말을 할 수 있습니다(일반적으로 성격에 따라).",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 시체 1<br><strong>시전:</strong> 10분<br>시체가 세 가지 질문에 답합니다. 시체는 살아있을 때 알고 있던 정보만 답하며, 거짓말을 할 수 있습니다(일반적으로 성격에 따라)."
  },
  {
    "id": "telepathy",
    "name_ko": "텔레파시",
    "name_en": "Telepathy",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "언어",
      "조작",
      "정신"
    ],
    "duration": "10분",
    "summary": "30피트 이내의 생물과 텔레파시로 소통할 수 있습니다. 연결이 설정되면 양방향 소통이 가능합니다. 같은 언어를 공유하는 생물과만 소통할 수 있습니다.강화(6랭크): 공유 정신 이미지를 사용하여 언어를 공유하지 않아도 소통 가능. 텔레파시가 언어(linguistic) 특성을 잃습니다.",
    "desc": "<strong>지속 시간:</strong> 10분<br>30피트 이내의 생물과 텔레파시로 소통할 수 있습니다. 연결이 설정되면 양방향 소통이 가능합니다. 같은 언어를 공유하는 생물과만 소통할 수 있습니다.<br><strong>강화(6랭크):</strong> 공유 정신 이미지를 사용하여 언어를 공유하지 않아도 소통 가능. 텔레파시가 언어(linguistic) 특성을 잃습니다."
  },
  {
    "id": "translocate",
    "name_ko": "순간이동",
    "name_en": "Translocate",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "순간이동"
    ],
    "range": "120피트",
    "summary": "당신과 입고 있는/들고 있는 아이템을 즉시 현재 공간에서 사거리 내 비어 있는 공간으로 순간이동합니다. 이것이 다른 생물을 가져오거나(차원 외 용기에 들어있는 경우에도) 주문이 실패합니다.강화(5랭크): 사거리 1마일. 목적지를 볼 필요는 없지만, 과거에 가봤고 상대 위치와 거리를 알아야 합니다. 이후 1시간 동안 일시적 면역.",
    "desc": "<strong>사거리:</strong> 120피트<br>당신과 입고 있는/들고 있는 아이템을 즉시 현재 공간에서 사거리 내 비어 있는 공간으로 순간이동합니다. 이것이 다른 생물을 가져오거나(차원 외 용기에 들어있는 경우에도) 주문이 실패합니다.<br><strong>강화(5랭크):</strong> 사거리 1마일. 목적지를 볼 필요는 없지만, 과거에 가봤고 상대 위치와 거리를 알아야 합니다. 이후 1시간 동안 일시적 면역."
  },
  {
    "id": "unfettered-movement",
    "name_ko": "자유 이동",
    "name_en": "Unfettered Movement",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "접촉한 생물 1",
    "duration": "10분",
    "summary": "방해를 물리칩니다. 주문 효과 동안 대상은 이동 속도에 상황 페널티를 주는 효과를 무시합니다. 이동 불가(immobilized), 잡힘(grabbed), 구속(restrained)에서 탈출할 때, 마법적이고 더 높은 랭크의 효과라면 자동 성공합니다.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 접촉한 생물 1<br><strong>지속 시간:</strong> 10분<br>방해를 물리칩니다. 주문 효과 동안 대상은 이동 속도에 상황 페널티를 주는 효과를 무시합니다. {{condition:Immobilized}}, {{condition:Grabbed}}, {{condition:Restrained}}에서 탈출할 때, 마법적이고 더 높은 랭크의 효과라면 자동 성공합니다."
  },
  {
    "id": "vapor-form",
    "name_ko": "증기 형태",
    "name_en": "Vapor Form",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "range": "접촉",
    "target": "동의하는 생물 1",
    "duration": "5분",
    "summary": "비정형(amorphous). 아이템 보너스 AC 및 기타 아이템 효과/보너스 상실. 비무장 방어 숙련 수정치 사용. 물리 피해에 저항 8. 정밀 피해 면역. 주문시전, 아이템 활성화, 공격/조작 특성 행동 불가. 비행 속도 10피트. 작은 틈 통과 가능. 해제 가능.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의하는 생물 1<br><strong>지속 시간:</strong> 5분<br>비정형(amorphous). 아이템 보너스 AC 및 기타 아이템 효과/보너스 상실. 비무장 방어 숙련 수정치 사용. 물리 피해에 저항 8. 정밀 피해 면역. 주문시전, 아이템 활성화, 공격/조작 특성 행동 불가. 비행 속도 10피트. 작은 틈 통과 가능. 해제 가능."
  },
  {
    "id": "vital-beacon",
    "name_ko": "활력 등대",
    "name_en": "Vital Beacon",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "치유",
      "조작",
      "활력"
    ],
    "duration": "다음 일일 준비까지",
    "castTime": "1분",
    "summary": "활력을 발산합니다. 라운드당 1회, 생물이 상호작용(Interact)하여 간청하면 치유됩니다. 등대는 약해집니다: 첫 번째 4d10, 두 번째 4d8, 세 번째 4d6, 네 번째 4d4, 이후 주문 종료. 한 번에 하나의 활력 등대만 활성 가능.강화(+1): 치유 시마다 해당 단계의 주사위 크기로 추가 1개 주사위.",
    "desc": "<strong>지속 시간:</strong> 다음 일일 준비까지<br><strong>시전:</strong> 1분<br>활력을 발산합니다. 라운드당 1회, 생물이 상호작용(Interact)하여 간청하면 치유됩니다. 등대는 약해집니다: 첫 번째 4d10, 두 번째 4d8, 세 번째 4d6, 네 번째 4d4, 이후 주문 종료. 한 번에 하나의 활력 등대만 활성 가능.<br><strong>강화(+1):</strong> 치유 시마다 해당 단계의 주사위 크기로 추가 1개 주사위."
  },
  {
    "id": "wall-of-fire",
    "name_ko": "화염 벽",
    "name_en": "Wall of Fire",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "화염",
      "조작"
    ],
    "range": "120피트",
    "duration": "1분",
    "summary": "5피트 두께의 화염 벽. 최대 60피트 직선과 10피트 높이, 또는 5피트 두께 10피트 반경 고리. 양쪽에서 반대편이 은폐(concealed). 벽을 통과하거나 턴 시작 시 벽 공간에 있는 생물은 4d6 화염 피해.강화(+1): 피해 +1d6.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>지속 시간:</strong> 1분<br>5피트 두께의 화염 벽. 최대 60피트 직선과 10피트 높이, 또는 5피트 두께 10피트 반경 고리. 양쪽에서 반대편이 {{condition:Concealed}}. 벽을 통과하거나 턴 시작 시 벽 공간에 있는 생물은 <strong>4d6 화염 피해</strong>.<br><strong>강화(+1):</strong> 피해 +1d6."
  },
  {
    "id": "weapon-storm",
    "name_ko": "무기 폭풍",
    "name_en": "Weapon Storm",
    "rank": 4,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "area": "30피트 원뿔 또는 10피트 폭발",
    "defense": "기본 반사",
    "summary": "손에 든 무기를 복제하여 많은 생물을 공격합니다. 무기의 피해 주사위를 기반으로 영역 내 모든 생물에 피해(기본 반사).강화(+1): 피해 주사위 +1개.",
    "desc": "<strong>영역:</strong> 30피트 원뿔 또는 10피트 폭발<br><strong>방어:</strong> 기본 반사<br>손에 든 무기를 복제하여 많은 생물을 공격합니다. 무기의 피해 주사위를 기반으로 영역 내 모든 생물에 피해(기본 반사).<br><strong>강화(+1):</strong> 피해 주사위 +1개."
  },
  {
    "id": "banishment",
    "name_ko": "추방",
    "name_en": "Banishment",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "조작"
    ],
    "range": "30피트",
    "target": "고향 차원에 있지 않은 생물 1",
    "defense": "의지",
    "summary": "대상을 고향 차원으로 추방하려 시도합니다. 당신은 자신의 고향 차원에서 이 주문을 시전해야 합니다. 주문 시전 시 추가 행동(물질 구성요소)을 사용하고 대상의 고향 차원에 대한 혐오 물질을 비용으로 지불하면, 대상의 의지 내성에 -2 상황 페널티를 줄 수 있습니다. 대상은 의지 내성을 시도합니다.대성공: 대상이 추방에 저항하고, 시전자가 기절 1이 됩...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 고향 차원에 있지 않은 생물 1<br><strong>방어:</strong> 의지<br>대상을 고향 차원으로 추방하려 시도합니다. 당신은 자신의 고향 차원에서 이 주문을 시전해야 합니다. 주문 시전 시 추가 행동(물질 구성요소)을 사용하고 대상의 고향 차원에 대한 혐오 물질을 비용으로 지불하면, 대상의 의지 내성에 <strong>-2 상황 페널티</strong>를 줄 수 있습니다. 대상은 의지 내성을 시도합니다.<br><strong>대성공:</strong> 대상이 추방에 저항하고, 시전자가 <strong>기절 1</strong>이 됩니다.<br><strong>성공:</strong> 대상이 추방에 저항합니다.<br><strong>실패:</strong> 대상이 고향 차원으로 추방됩니다.<br><strong>대실패:</strong> 대상이 고향 차원으로 추방되며, <strong>1주일</strong> 동안 추방한 차원으로 복귀할 수 없습니다.<br><strong>강화(9랭크):</strong> 최대 <strong>10</strong> 생물을 대상으로 삼을 수 있습니다."
  },
  {
    "id": "breath-of-life",
    "name_ko": "생명의 숨결",
    "name_en": "Breath of Life",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "반응",
    "traits": [
      "치유",
      "조작",
      "활력"
    ],
    "range": "60피트",
    "target": "유발 생물",
    "trigger": "사거리 내 생물이 사망",
    "summary": "당신의 축복이 죽음의 순간에 생물을 되살립니다. 대상의 사망을 방지하고 5d8 HP를 회복시킵니다. 유발 효과가 죽음 효과이거나 분해(disintegrate)처럼 잔해를 남기지 않는 효과인 경우에는 생명의 숨결을 사용할 수 없습니다.강화(+2): 회복 HP +1d8.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 유발 생물<br><strong>유발 조건:</strong> 사거리 내 생물이 사망<br>당신의 축복이 죽음의 순간에 생물을 되살립니다. 대상의 사망을 방지하고 <strong>5d8 HP</strong>를 회복시킵니다. 유발 효과가 <em>죽음 효과</em>이거나 <em>{{spell:Disintegrate}}</em>처럼 잔해를 남기지 않는 효과인 경우에는 <em>생명의 숨결</em>을 사용할 수 없습니다.<br><strong>강화(+2):</strong> 회복 HP +1d8."
  },
  {
    "id": "control-water",
    "name_ko": "물 제어",
    "name_en": "Control Water",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "물"
    ],
    "range": "500피트",
    "area": "50피트×50피트",
    "defense": "인내(아래 참조)",
    "summary": "물의 수위를 10피트 올리거나 내립니다. 영역 내 물 특성 생물은 인내 내성으로 느리게(slow) 주문의 효과를 받습니다.",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>영역:</strong> 50피트×50피트<br><strong>방어:</strong> 인내(아래 참조)<br>물의 수위를 10피트 올리거나 내립니다. 영역 내 물 특성 생물은 인내 내성으로 {{spell:Slow}} 주문의 효과를 받습니다."
  },
  {
    "id": "divine-immolation",
    "name_ko": "신성한 분신소각",
    "name_en": "Divine Immolation",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "화염",
      "빛",
      "조작",
      "활력"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "인내",
    "duration": "유지(최대 1분)",
    "summary": "신성한 화염으로 대상에 불을 붙여 반복적으로 태웁니다. 인내 내성과 함께 5d6 화염 피해를 가합니다. 실패 또는 대실패 시, 대상에 추가로 불이 붙어 2d6 지속 화염 피해를 받으며 10피트 반경에 밝은 빛을, 20피트까지 희미한 빛을 발산합니다. 대실패 시에는 지속 화염 피해가 4d6으로 증가합니다.대성공: 영향 없음.성공: 절반 피해를 받으며 지...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 인내<br><strong>지속 시간:</strong> 유지(최대 1분)<br>신성한 화염으로 대상에 불을 붙여 반복적으로 태웁니다. 인내 내성과 함께 <strong>5d6 화염 피해</strong>를 가합니다. 실패 또는 대실패 시, 대상에 추가로 불이 붙어 <strong>2d6 지속 화염 피해</strong>를 받으며 10피트 반경에 밝은 빛을, 20피트까지 희미한 빛을 발산합니다. 대실패 시에는 지속 화염 피해가 4d6으로 증가합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 절반 피해를 받으며 지속 화염 피해는 없습니다.<br><strong>실패:</strong> 전체 피해 및 지속 화염 피해를 받습니다.<br><strong>대실패:</strong> 2배 피해 및 증가된 지속 화염 피해를 받습니다.<br><strong>강화(+1):</strong> 초기 피해 +1d6, 지속 화염 피해 +1d6."
  },
  {
    "id": "dreaming-potential",
    "name_ko": "꿈의 잠재력",
    "name_en": "Dreaming Potential",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "정신"
    ],
    "range": "접촉",
    "target": "동의+잠자는 생물 1",
    "duration": "8시간",
    "summary": "대상이 꿈에서 재훈련합니다. 8시간 수면 후 대상은 1회 재훈련(Retrain)을 완료합니다(보통 1주가 걸리는 것을 하룻밤에).",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의+잠자는 생물 1<br><strong>지속 시간:</strong> 8시간<br>대상이 꿈에서 재훈련합니다. 8시간 수면 후 대상은 1회 재훈련(Retrain)을 완료합니다(보통 1주가 걸리는 것을 하룻밤에)."
  },
  {
    "id": "elemental-form",
    "name_ko": "정령 형태",
    "name_en": "Elemental Form",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "duration": "1분",
    "summary": "정령의 전투 형태로 변신합니다. 크기 중형, AC = 19 + 레벨(민첩 수정치 무시), 임시 HP 10을 얻습니다. 변이 주문의 일반 규칙이 적용됩니다.정령 유형을 선택합니다: 공기(비행 속도 80피트, 전기 저항), 대지(이동 속도 20피트, 굴진 속도 20피트, 경도 증가), 화염(이동 속도 40피트, 화염 저항, 접촉 시 화염 피해), 물(이동...",
    "desc": "<strong>지속 시간:</strong> 1분<br>정령의 전투 형태로 변신합니다. 크기 <strong>중형</strong>, <strong>AC = 19 + 레벨</strong>(민첩 수정치 무시), <strong>임시 HP 10</strong>을 얻습니다. 변이 주문의 일반 규칙이 적용됩니다.<br>정령 유형을 선택합니다: <strong>공기</strong>(비행 속도 80피트, 전기 저항), <strong>대지</strong>(이동 속도 20피트, 굴진 속도 20피트, 경도 증가), <strong>화염</strong>(이동 속도 40피트, 화염 저항, 접촉 시 화염 피해), <strong>물</strong>(이동 속도 20피트, 수영 속도 60피트, 냉기 저항). 각 유형은 고유한 근접 공격(공격 수정치 +18)과 피해 유형을 제공합니다.<br><strong>강화(6랭크):</strong> 크기 대형, AC = 22 + 레벨, 임시 HP 15, 공격 수정치 +23, 피해 증가.<br><strong>강화(7랭크):</strong> 크기 거대, AC = 22 + 레벨, 임시 HP 20, 공격 수정치 +25, 피해 추가 증가."
  },
  {
    "id": "hallucination",
    "name_ko": "환각",
    "name_en": "Hallucination",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "무력화",
      "조작",
      "정신",
      "은밀"
    ],
    "range": "30피트",
    "target": "생물 1",
    "duration": "1시간",
    "summary": "대상이 지속적으로 어떤 것을 다른 것으로 인지하게 합니다. 당신이 효과를 선택합니다: 실제로 있는 것을 감지하지 못하게 하거나, 없는 것을 감지하게 하거나, 신념을 변경하지는 않습니다. 매번 환각과 상호작용할 때 의지 내성으로 불신을 시도할 수 있습니다.대성공: 영향 없음.성공: 불신할 때까지 당신이 선택한 대로 인지하지만, 환각이 무엇인지 알고 있음...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 1시간<br>대상이 지속적으로 어떤 것을 다른 것으로 인지하게 합니다. 당신이 효과를 선택합니다: 실제로 있는 것을 감지하지 못하게 하거나, 없는 것을 감지하게 하거나, 신념을 변경하지는 않습니다. 매번 환각과 상호작용할 때 의지 내성으로 불신을 시도할 수 있습니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 불신할 때까지 당신이 선택한 대로 인지하지만, 환각이 무엇인지 알고 있음.<br><strong>실패:</strong> 불신할 때까지 당신이 선택한 대로 인지함.<br><strong>대실패:</strong> 불신할 때까지 당신이 선택한 대로 인지하고, 거짓 감각을 신뢰하며, 불신 내성에 <strong>-4 상황 페널티</strong>.<br><strong>강화(6랭크):</strong> 최대 10 생물을 대상으로 하거나, 지속 시간을 다음 일일 준비까지로 변경. <strong>강화(8랭크):</strong> 원하는 수의 생물을 대상으로 하거나, 무제한 지속 시간."
  },
  {
    "id": "howling-blizzard",
    "name_ko": "울부짖는 눈보라",
    "name_en": "Howling Blizzard",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "냉기",
      "조작"
    ],
    "range": "120피트",
    "area": "30피트 폭발 또는 60피트 원뿔",
    "defense": "기본 반사",
    "summary": "차가운 바람과 눈더미가 영역을 채웁니다. 7d6 냉기 피해(기본 반사). 영역은 1라운드간 험지가 됩니다.강화(+1): 피해 +2d6.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 30피트 폭발 또는 60피트 원뿔<br><strong>방어:</strong> 기본 반사<br>차가운 바람과 눈더미가 영역을 채웁니다. <strong>7d6 냉기 피해</strong>(기본 반사). 영역은 1라운드간 험지가 됩니다.<br><strong>강화(+1):</strong> 피해 +2d6."
  },
  {
    "id": "illusory-scene",
    "name_ko": "환영 풍경",
    "name_en": "Illusory Scene",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작"
    ],
    "range": "500피트",
    "area": "30피트 폭발",
    "duration": "1시간",
    "castTime": "10분",
    "summary": "여러 생물과 물체를 포함하는 상상의 장면을 만듭니다. 생물들은 단순한 행동(걸기, 말하기 등)을 할 수 있지만 전투 등 복잡한 상호작용은 불가. 불신 시 흐릿해집니다.강화(6랭크): 지속 시간 24시간. 강화(8랭크): 지속 시간 무제한.",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>영역:</strong> 30피트 폭발<br><strong>지속 시간:</strong> 1시간<br><strong>시전:</strong> 10분<br>여러 생물과 물체를 포함하는 상상의 장면을 만듭니다. 생물들은 단순한 행동(걸기, 말하기 등)을 할 수 있지만 전투 등 복잡한 상호작용은 불가. 불신 시 흐릿해집니다.<br><strong>강화(6랭크):</strong> 지속 시간 24시간. <strong>강화(8랭크):</strong> 지속 시간 무제한."
  },
  {
    "id": "impaling-spike",
    "name_ko": "꿰뚫는 말뚝",
    "name_en": "Impaling Spike",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "반사",
    "summary": "냉철 말뚝으로 생물을 꿰뚫습니다. 8d6 관통 피해(반사). 실패 시 이동 불가(immobilized)(말뚝에 꿰뚫림). 탈출 DC = 주문 DC.강화(+1): 피해 +2d6.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 반사<br>냉철 말뚝으로 생물을 꿰뚫습니다. <strong>8d6 관통 피해</strong>(반사). 실패 시 <strong>{{condition:Immobilized}}</strong>(말뚝에 꿰뚫림). 탈출 DC = 주문 DC.<br><strong>강화(+1):</strong> 피해 +2d6."
  },
  {
    "id": "invoke-spirits",
    "name_ko": "영혼 소환",
    "name_en": "Invoke Spirits",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "120피트",
    "area": "10피트 폭발",
    "defense": "의지",
    "duration": "유지(최대 1분)",
    "summary": "유령 같은 환영을 불러 적을 공격합니다. 생성 시 영역 내 적에 2d4 영혼 피해+2d4 선택한 에너지 피해(의지). 유지 시 이동(30피트)+재공격 가능.강화(+2): 각 피해 +1d4.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 10피트 폭발<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 유지(최대 1분)<br>유령 같은 환영을 불러 적을 공격합니다. 생성 시 영역 내 적에 <strong>2d4 영혼 피해+2d4 선택한 에너지 피해</strong>(의지). 유지 시 이동(30피트)+재공격 가능.<br><strong>강화(+2):</strong> 각 피해 +1d4."
  },
  {
    "id": "magic-passage",
    "name_ko": "마법 통로",
    "name_en": "Magic Passage",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작"
    ],
    "range": "접촉",
    "target": "1개의 표면(벽, 바닥, 천장)",
    "duration": "1시간",
    "summary": "표면을 통과하는 임시 통로를 엽니다. 10피트 깊이×5피트 너비×10피트 높이. 통로를 만든 사람만 볼 수 있으며, 다른 이에게는 보이지 않음. 당신과 지정한 생물만 통과 가능.강화(7랭크): 20피트 깊이.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 1개의 표면(벽, 바닥, 천장)<br><strong>지속 시간:</strong> 1시간<br>표면을 통과하는 임시 통로를 엽니다. 10피트 깊이×5피트 너비×10피트 높이. 통로를 만든 사람만 볼 수 있으며, 다른 이에게는 보이지 않음. 당신과 지정한 생물만 통과 가능.<br><strong>강화(7랭크):</strong> 20피트 깊이."
  },
  {
    "id": "mariners-curse",
    "name_ko": "선원의 저주",
    "name_en": "Mariner's Curse",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "저주",
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "defense": "의지",
    "summary": "거친 바다의 저주를 생물에게 감염시킵니다. 의지 실패 시 대상이 물 위에 있을 때 항상 메스꺼움(sickened) 1(물 위를 벗어나도 남음). 대실패 시 메스꺼움 2. 저주는 해제되거나 상쇄될 때까지 지속.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br>거친 바다의 저주를 생물에게 감염시킵니다. 의지 실패 시 대상이 물 위에 있을 때 항상 <strong>{{condition:Sickened}} 1</strong>(물 위를 벗어나도 남음). 대실패 시 메스꺼움 2. 저주는 해제되거나 상쇄될 때까지 지속."
  },
  {
    "id": "sending",
    "name_ko": "전송",
    "name_en": "Sending",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "행성 전체",
    "target": "알고 있는 생물 1",
    "summary": "행성 어디에든 메시지를 보내고 답장을 받습니다. 25단어 이하의 메시지를 보내며, 대상은 25단어 이하로 즉시 답장할 수 있습니다.",
    "desc": "<strong>사거리:</strong> 행성 전체<br><strong>대상:</strong> 알고 있는 생물 1<br>행성 어디에든 메시지를 보내고 답장을 받습니다. <strong>25단어 이하</strong>의 메시지를 보내며, 대상은 25단어 이하로 즉시 답장할 수 있습니다."
  },
  {
    "id": "shadow-blast",
    "name_ko": "그림자 폭발",
    "name_en": "Shadow Blast",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "그림자"
    ],
    "range": "다양",
    "area": "다양",
    "defense": "기본 반사 또는 의지(대상 선택)",
    "summary": "그림자 물질의 피해를 줍니다. 피해 유형(산성/타격/냉기/전기/화염/힘/관통/참격/음파/영혼)을 선택합니다. 영역은 30피트 원뿔, 120피트 이내 15피트 폭발, 또는 50피트 직선 중 선택. 6d8 피해(기본 내성).강화(+1): 피해 +1d8.",
    "desc": "<strong>사거리:</strong> 다양<br><strong>영역:</strong> 다양<br><strong>방어:</strong> 기본 반사 또는 의지(대상 선택)<br>그림자 물질의 피해를 줍니다. 피해 유형(산성/타격/냉기/전기/화염/힘/관통/참격/음파/영혼)을 선택합니다. 영역은 30피트 원뿔, 120피트 이내 15피트 폭발, 또는 50피트 직선 중 선택. <strong>6d8 피해</strong>(기본 내성).<br><strong>강화(+1):</strong> 피해 +1d8."
  },
  {
    "id": "slither",
    "name_ko": "미끄러짐",
    "name_en": "Slither",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "3행동",
    "traits": [
      "조작",
      "그림자"
    ],
    "range": "120피트",
    "area": "20피트 폭발",
    "defense": "반사",
    "duration": "1분",
    "summary": "그림자 뱀이 영역에 나타납니다. 3d6 관통 피해 + 1d6 지속 독 피해. 반사 내성에 따라 잡힘(grabbed) 또는 구속(restrained). 영역 안에서 턴을 끝내는 생물도 내성 시도. 뱀의 탈출 DC = 주문 DC. 뱀의 AC = 주문 DC. 12 이상 피해로 뱀 파괴(새 뱀 재성장).성공: 영향 없음. 실패: 전체 피해, 뱀에 잡힘. 대실...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 20피트 폭발<br><strong>방어:</strong> 반사<br><strong>지속 시간:</strong> 1분<br>그림자 뱀이 영역에 나타납니다. <strong>3d6 관통 피해 + 1d6 지속 독 피해</strong>. 반사 내성에 따라 {{condition:Grabbed}} 또는 {{condition:Restrained}}. 영역 안에서 턴을 끝내는 생물도 내성 시도. 뱀의 탈출 DC = 주문 DC. 뱀의 AC = 주문 DC. 12 이상 피해로 뱀 파괴(새 뱀 재성장).<br><strong>성공:</strong> 영향 없음. <strong>실패:</strong> 전체 피해, 뱀에 잡힘. <strong>대실패:</strong> 2배 피해, 구속.<br><strong>강화(+2):</strong> 지속 독 피해 +1d6, 뱀 HP +6."
  },
  {
    "id": "speak-with-stones",
    "name_ko": "돌과 대화",
    "name_en": "Speak with Stones",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "대지",
      "조작"
    ],
    "duration": "1시간",
    "summary": "자연 및 가공된 돌과 소통합니다. 돌은 주변에서 일어난 일(누가 지나갔는지, 진동, 온도 변화 등)에 대한 정보를 제공합니다.강화(6랭크): 지속 시간 8시간.",
    "desc": "<strong>지속 시간:</strong> 1시간<br>자연 및 가공된 돌과 소통합니다. 돌은 주변에서 일어난 일(누가 지나갔는지, 진동, 온도 변화 등)에 대한 정보를 제공합니다.<br><strong>강화(6랭크):</strong> 지속 시간 8시간."
  },
  {
    "id": "spiritual-guardian",
    "name_ko": "영적 수호자",
    "name_en": "Spiritual Guardian",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "성별화",
      "영혼"
    ],
    "range": "120피트",
    "duration": "유지(최대 1분)",
    "summary": "마법의 힘으로 만들어진 중형 수호자가 범위 내 빈 공간에 출현합니다. 수호자는 반투명하며 착용하거나 든 무기 중 하나의 유령 같은 복제본을 지닙니다. 신을 섬기는 경우 수호자는 신의 시종 또는 봉사자 형태를 취합니다. 주문을 성별화하면 수호자의 공격도 성별화됩니다. 생물은 수호자의 공간을 통과할 수 있지만 그 안에 멈출 수 없습니다. 당신과 아군은 수...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>마법의 힘으로 만들어진 중형 수호자가 범위 내 빈 공간에 출현합니다. 수호자는 반투명하며 착용하거나 든 무기 중 하나의 유령 같은 복제본을 지닙니다. 신을 섬기는 경우 수호자는 신의 시종 또는 봉사자 형태를 취합니다. 주문을 성별화하면 수호자의 공격도 성별화됩니다. 생물은 수호자의 공간을 통과할 수 있지만 그 안에 멈출 수 없습니다. 당신과 아군은 수호자와 협공이 가능합니다. 수호자는 HP 50 외 다른 속성이 없으며 HP는 회복이 불가능하고 아래의 보호 행동을 할 때만 HP를 잃습니다. 주문 시전 시 및 유지 시마다 수호자를 120피트 내 빈 공간으로 이동시키고 다음 중 하나를 수행합니다:<br><strong>공격:</strong> 수호자가 인접한 생물에 근접 주문 명중 굴림을 실행합니다. 명중 시 <strong>3d8 피해</strong>(급소 공격 시 2배). 피해 유형은 무기 유형과 같으며(또는 다용도 무기의 유형 중 선택), 영혼 피해가 더 해로우면 영혼 피해로. 다중 공격 페널티를 사용하고 기여합니다.<br><strong>보호:</strong> 인접한 선택한 생물을 보호합니다. 그 생물이 피해를 받을 때마다 수호자가 처음 <strong>10 피해</strong>를 대신 받습니다. 보호는 공격 또는 다른 생물 보호를 명령하거나 수호자가 파괴될 때까지 지속됩니다.<br><strong>강화(+2):</strong> 피해 +1d8, HP +20."
  },
  {
    "id": "subconscious-suggestion",
    "name_ko": "잠재 암시",
    "name_en": "Subconscious Suggestion",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "언어",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "다양",
    "summary": "발동 조건이 있는 깊은 암시를 심습니다. 자해적이거나 자기 이익에 반하는 암시는 불가.대성공: 영향 없음, 시도를 인지. 성공: 영향 없음, 평범한 대화였다고 인식. 실패: 발동 조건 충족 시 즉시 암시를 따름. 지속 시간 1분, 또는 완수하거나 자해적/명백히 부정적이 되면 종료. 대실패: 실패와 같지만 지속 시간 1시간.강화(9랭크): 최대 10명.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 다양<br>발동 조건이 있는 깊은 암시를 심습니다. 자해적이거나 자기 이익에 반하는 암시는 불가.<br><strong>대성공:</strong> 영향 없음, 시도를 인지. <strong>성공:</strong> 영향 없음, 평범한 대화였다고 인식. <strong>실패:</strong> 발동 조건 충족 시 즉시 암시를 따름. 지속 시간 1분, 또는 완수하거나 자해적/명백히 부정적이 되면 종료. <strong>대실패:</strong> 실패와 같지만 지속 시간 1시간.<br><strong>강화(9랭크):</strong> 최대 10명."
  },
  {
    "id": "summon-celestial",
    "name_ko": "천상 소환",
    "name_en": "Summon Celestial",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "3행동",
    "traits": [
      "신성화",
      "조작"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "천상체(celestial) 특성을 가진 5레벨 이하 생물을 소환합니다. 신성화(holy) 특성을 가집니다. GM이 특정 유형을 결정합니다.강화(6랭크 이후): 더 강한 천상 소환.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>천상체(celestial) 특성을 가진 5레벨 이하 생물을 소환합니다. 신성화(holy) 특성을 가집니다. GM이 특정 유형을 결정합니다.<br><strong>강화(6랭크 이후):</strong> 더 강한 천상 소환."
  },
  {
    "id": "summon-dragon",
    "name_ko": "용 소환",
    "name_en": "Summon Dragon",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "당신을 위해 싸울 용을 소환합니다. 주문 랭크 -1 이하 레벨의 용을 소환합니다.강화(6랭크 이후): 더 강한 용 소환 가능.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>당신을 위해 싸울 용을 소환합니다. 주문 랭크 -1 이하 레벨의 용을 소환합니다.<br><strong>강화(6랭크 이후):</strong> 더 강한 용 소환 가능."
  },
  {
    "id": "summon-entity",
    "name_ko": "실체 소환",
    "name_en": "Summon Entity",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "기형체(aberration)를 소환합니다. 주문 랭크 -1 이하 레벨.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>기형체(aberration)를 소환합니다. 주문 랭크 -1 이하 레벨."
  },
  {
    "id": "summon-fiend",
    "name_ko": "악마 소환",
    "name_en": "Summon Fiend",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "3행동",
    "traits": [
      "부정화",
      "조작"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "악마(fiend) 특성을 가진 5레벨 이하 생물을 소환합니다. 부정화(unholy) 특성을 가집니다. 신앙에 따라 특정 유형이 제한됩니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>악마(fiend) 특성을 가진 5레벨 이하 생물을 소환합니다. 부정화(unholy) 특성을 가집니다. 신앙에 따라 특정 유형이 제한됩니다."
  },
  {
    "id": "summon-monitor",
    "name_ko": "주시자 소환",
    "name_en": "Summon Monitor",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "주시자(monitor) 특성을 가진 5레벨 이하 생물을 소환합니다. 신앙에 따라 유형이 제한됩니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>주시자(monitor) 특성을 가진 5레벨 이하 생물을 소환합니다. 신앙에 따라 유형이 제한됩니다."
  },
  {
    "id": "synaptic-pulse",
    "name_ko": "시냅스 파동",
    "name_en": "Synaptic Pulse",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "조작",
      "정신"
    ],
    "area": "30피트 발산",
    "defense": "의지",
    "duration": "1라운드",
    "summary": "영역 내 모든 적에게 정신 폭발을 가합니다.대성공: 영향 없음. 성공: 기절(stunned) 1. 실패: 기절 2. 대실패: 기절 1라운드.",
    "desc": "<strong>영역:</strong> 30피트 발산<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1라운드<br>영역 내 모든 적에게 정신 폭발을 가합니다.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> {{condition:Stunned}} 1. <strong>실패:</strong> 기절 2. <strong>대실패:</strong> 기절 1라운드."
  },
  {
    "id": "telekinetic-haul",
    "name_ko": "염동 운반",
    "name_en": "Telekinetic Haul",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "120피트",
    "target": "비고정 물체 1(최대 80 부피, 가장 긴 면 20피트 이하)",
    "duration": "유지(최대 1분)",
    "summary": "물체를 20피트까지 이동시킵니다. 유지 시 다시 이동시키거나 다른 적격 대상으로 초점을 전환할 수 있습니다.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 비고정 물체 1(최대 80 부피, 가장 긴 면 20피트 이하)<br><strong>지속 시간:</strong> 유지(최대 1분)<br>물체를 20피트까지 이동시킵니다. 유지 시 다시 이동시키거나 다른 적격 대상으로 초점을 전환할 수 있습니다."
  },
  {
    "id": "terrain-transposition",
    "name_ko": "지형 전이",
    "name_en": "Terrain Transposition",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "순간이동"
    ],
    "range": "120피트",
    "summary": "자연 지형을 통해 순간이동합니다. 같은 유형의 자연 지형(숲에서 숲으로, 동굴에서 동굴로) 내에서 최대 120피트까지 순간이동합니다.",
    "desc": "<strong>사거리:</strong> 120피트<br>자연 지형을 통해 순간이동합니다. 같은 유형의 자연 지형(숲에서 숲으로, 동굴에서 동굴로) 내에서 최대 120피트까지 순간이동합니다."
  },
  {
    "id": "toxic-cloud",
    "name_ko": "독구름",
    "name_en": "Toxic Cloud",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "조작",
      "독"
    ],
    "range": "120피트",
    "area": "20피트 폭발",
    "defense": "기본 인내",
    "duration": "1분",
    "summary": "독 안개 구름을 만듭니다. 안개로 기능합니다. 매 라운드 10피트씩 당신에게서 멀어집니다. 영역 내에서 턴을 시작하는 호흡하는 생물은 6d8 독 피해(기본 인내). 해제 가능.강화(+1): 피해 +1d8.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 20피트 폭발<br><strong>방어:</strong> 기본 인내<br><strong>지속 시간:</strong> 1분<br>독 안개 구름을 만듭니다. 안개로 기능합니다. 매 라운드 10피트씩 당신에게서 멀어집니다. 영역 내에서 턴을 시작하는 호흡하는 생물은 <strong>6d8 독 피해</strong>(기본 인내). 해제 가능.<br><strong>강화(+1):</strong> 피해 +1d8."
  },
  {
    "id": "truespeech",
    "name_ko": "만능 언어",
    "name_en": "Truespeech",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "1시간",
    "summary": "생물이 모든 언어를 이해하고 말할 수 있게 합니다.강화(7랭크): 지속 시간 8시간.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 1시간<br>생물이 모든 언어를 이해하고 말할 수 있게 합니다.<br><strong>강화(7랭크):</strong> 지속 시간 8시간."
  },
  {
    "id": "umbral-journey",
    "name_ko": "그림자 여행",
    "name_en": "Umbral Journey",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작",
      "그림자",
      "순간이동"
    ],
    "range": "접촉",
    "target": "자신+접촉한 최대 10 동의 생물",
    "duration": "8시간",
    "castTime": "1분",
    "summary": "암흑계(Netherworld)를 통해 여행합니다. 1시간 = 보통 3일 이동 거리. 목적지는 모호하고 상징적입니다. 해제하거나 지속 시간 종료 시 의도한 목적지에서 1마일 이내에 도착.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 자신+접촉한 최대 10 동의 생물<br><strong>지속 시간:</strong> 8시간<br><strong>시전:</strong> 1분<br>암흑계(Netherworld)를 통해 여행합니다. 1시간 = 보통 3일 이동 거리. 목적지는 모호하고 상징적입니다. 해제하거나 지속 시간 종료 시 의도한 목적지에서 1마일 이내에 도착."
  },
  {
    "id": "wall-of-ice",
    "name_ko": "얼음 벽",
    "name_en": "Wall of Ice",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "냉기",
      "조작",
      "물"
    ],
    "range": "120피트",
    "duration": "1분",
    "summary": "얼음 장벽. 1피트 두께의 직선(최대 60피트 길이, 10피트 높이) 또는 1피트 두께 10피트 반경 반구. 불투명. 끊어지지 않은 열린 공간 필요. 각 10×10 구간: AC 10, 경도 10, HP 40. 치명타/정밀 피해 면역. 화염 약점 15. 화염으로 파괴된 구간은 물/증기로 녹음. 다른 방법으로 파괴된 구간을 통과하는 생물은 2d6 냉기 피...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>지속 시간:</strong> 1분<br>얼음 장벽. 1피트 두께의 직선(최대 60피트 길이, 10피트 높이) 또는 1피트 두께 10피트 반경 반구. 불투명. 끊어지지 않은 열린 공간 필요. 각 10×10 구간: AC 10, 경도 10, HP 40. 치명타/정밀 피해 면역. 화염 약점 15. 화염으로 파괴된 구간은 물/증기로 녹음. 다른 방법으로 파괴된 구간을 통과하는 생물은 <strong>2d6 냉기 피해</strong>(험지).<br><strong>강화(+2):</strong> 각 구간 HP +10, 파괴된 구간 냉기 피해 +1d6."
  },
  {
    "id": "wall-of-stone",
    "name_ko": "돌 벽",
    "name_en": "Wall of Stone",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "대지",
      "조작"
    ],
    "range": "120피트",
    "summary": "1인치 두께 벽, 최대 120피트 길이, 20피트 높이. 형태 조정 가능. 수직일 필요 없음. 끊어지지 않은 열린 공간 필요. 각 10×10 구간: AC 10, 경도 14, HP 50. 치명타/정밀 피해 면역. 파괴된 구간은 잔해(험지, 통과 가능).강화(+2): 각 구간 HP +15.",
    "desc": "<strong>사거리:</strong> 120피트<br>1인치 두께 벽, 최대 120피트 길이, 20피트 높이. 형태 조정 가능. 수직일 필요 없음. 끊어지지 않은 열린 공간 필요. 각 10×10 구간: AC 10, 경도 14, HP 50. 치명타/정밀 피해 면역. 파괴된 구간은 잔해(험지, 통과 가능).<br><strong>강화(+2):</strong> 각 구간 HP +15."
  },
  {
    "id": "wave-of-despair",
    "name_ko": "절망의 파도",
    "name_en": "Wave of Despair",
    "rank": 5,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "감정",
      "조작",
      "정신"
    ],
    "area": "30피트 원뿔",
    "defense": "의지",
    "summary": "영역 내 생물을 절망에 빠뜨립니다. 의지 실패 시 공포 2+둔화 1(1라운드). 대실패 시 공포 3+둔화 1(1분).강화(+1): 원뿔 크기 +5피트.",
    "desc": "<strong>영역:</strong> 30피트 원뿔<br><strong>방어:</strong> 의지<br>영역 내 생물을 절망에 빠뜨립니다. 의지 실패 시 <strong>공포 2+둔화 1</strong>(1라운드). 대실패 시 공포 3+둔화 1(1분).<br><strong>강화(+1):</strong> 원뿔 크기 +5피트."
  },
  {
    "id": "blessed-boundary",
    "name_ko": "축복받은 경계",
    "name_en": "Blessed Boundary",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "3행동",
    "traits": [
      "강력",
      "조작",
      "성별화"
    ],
    "range": "120피트",
    "area": "최대 60피트 폭발",
    "defense": "반사",
    "duration": "1분",
    "summary": "신성한 힘의 현현들이 수백 개 나타나 거대한 보호의 구체 안에서 소용돌이칩니다. 이것들은 보통 뾰족한 파편처럼 보이지만, 종종 주문을 시전하는 데 힘을 빌려준 신의 외양에 맞게 변하기도 합니다. 이 현현들은 영역 내에서 언데드 또는 악마(fiend) 특성을 지니면서 당신의 성별화(신성 또는 불경)와 반대되는 생물들을 향해 맹렬히 쏟아집니다.대성공: 영...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 최대 60피트 폭발<br><strong>방어:</strong> 반사<br><strong>지속 시간:</strong> 1분<br>신성한 힘의 현현들이 수백 개 나타나 거대한 보호의 구체 안에서 소용돌이칩니다. 이것들은 보통 뾰족한 파편처럼 보이지만, 종종 주문을 시전하는 데 힘을 빌려준 신의 외양에 맞게 변하기도 합니다. 이 현현들은 영역 내에서 언데드 또는 악마(fiend) 특성을 지니면서 당신의 성별화(신성 또는 불경)와 반대되는 생물들을 향해 맹렬히 쏟아집니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 2d10 강력 피해 및 2d10 영혼 피해를 받습니다.<br><strong>실패:</strong> 4d10 강력 피해 및 4d10 영혼 피해를 받습니다.<br><strong>대실패:</strong> 8d10 강력 피해 및 8d10 영혼 피해를 받습니다.<br><strong>강화(+1):</strong> 각 피해 유형 +1d10."
  },
  {
    "id": "chain-lightning",
    "name_ko": "연쇄 번개",
    "name_en": "Chain Lightning",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "전기",
      "조작"
    ],
    "range": "500피트",
    "target": "생물 1, 및 추가 생물 다수",
    "defense": "기본 반사",
    "summary": "강력한 번개 볼트를 대상에게 방전시켜 8d12 전기 피해를 가합니다. 대상은 기본 반사 내성을 시도해야 합니다. 그런 다음 번개는 첫 번째 대상으로부터 30피트 이내의 다른 생물로 아크를 형성하고, 그 대상에서 30피트 이내의 다른 생물로 점프하는 식으로 이어집니다. 언제든지 연쇄를 종료할 수 있습니다. 같은 생물을 두 번 이상 대상으로 삼을 수 없으...",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>대상:</strong> 생물 1, 및 추가 생물 다수<br><strong>방어:</strong> 기본 반사<br>강력한 번개 볼트를 대상에게 방전시켜 <strong>8d12 전기 피해</strong>를 가합니다. 대상은 기본 반사 내성을 시도해야 합니다. 그런 다음 번개는 첫 번째 대상으로부터 30피트 이내의 다른 생물로 아크를 형성하고, 그 대상에서 30피트 이내의 다른 생물로 점프하는 식으로 이어집니다. 언제든지 연쇄를 종료할 수 있습니다. 같은 생물을 두 번 이상 대상으로 삼을 수 없으며, 모든 대상에게 효과선이 있어야 합니다. 피해는 한 번만 굴리고 각 대상에게 적용합니다(내성 결과에 따라 적절히 반감 또는 배증). 대상 중 하나라도 내성에서 대성공을 거두면 연쇄가 종료됩니다.<br><strong>강화(+1):</strong> 피해 +1d12."
  },
  {
    "id": "cursed-metamorphosis",
    "name_ko": "저주 변신",
    "name_en": "Cursed Metamorphosis",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "저주",
      "무력화",
      "조작",
      "변신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "다양",
    "summary": "대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.대성공: 영향 없음.성공: 대상이 1라운드 동안 변신합니다.실패: 대상이 1시간 동안 변신합니다.대실패: 대상이 무기한 변신합니다.변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 ...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 다양<br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 대상이 1라운드 동안 변신합니다.<br><strong>실패:</strong> 대상이 1시간 동안 변신합니다.<br><strong>대실패:</strong> 대상이 무기한 변신합니다.<br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다."
  },
  {
    "id": "disintegrate",
    "name_ko": "분해",
    "name_en": "Disintegrate",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane"
    ],
    "actions": "2행동",
    "traits": [
      "공격",
      "조작"
    ],
    "range": "120피트",
    "target": "생물 1, 무인 물체, 또는 힘 구조물",
    "defense": "AC 및 기본 인내",
    "summary": "검은 추적 볼트를 발사하여 접촉 시 강력한 파괴 광선으로 강화됩니다. 물체나 힘 구조물(힘의 벽 등)에 맞으면 내성 없이 파괴(유물 제외, 최대 10피트 정육면체). 생물에 맞으면 12d10 피해(피해 유형 없음, 기본 인내). 치명타 시 내성 결과를 한 단계 나쁘게. 0 HP가 되면 미세한 가루로 분해(장비는 남음).강화(+1): 피해 +2d10.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 생물 1, 무인 물체, 또는 힘 구조물<br><strong>방어:</strong> AC 및 기본 인내<br>검은 추적 볼트를 발사하여 접촉 시 강력한 파괴 광선으로 강화됩니다. 물체나 힘 구조물(힘의 벽 등)에 맞으면 내성 없이 파괴(유물 제외, 최대 10피트 정육면체). 생물에 맞으면 <strong>12d10 피해</strong>(피해 유형 없음, 기본 인내). 치명타 시 내성 결과를 한 단계 나쁘게. 0 HP가 되면 미세한 가루로 분해(장비는 남음).<br><strong>강화(+1):</strong> 피해 +2d10."
  },
  {
    "id": "dominate",
    "name_ko": "지배",
    "name_en": "Dominate",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "무력화",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "다음 일일 준비까지",
    "summary": "대상의 정신을 장악하여 당신의 명령에 복종하게 합니다. 대상은 의지 내성을 시도합니다. 지배에 성공하면, 시전 시 한 문장으로 된 명령을 내릴 수 있습니다. 대상은 그 명령을 최선을 다해 수행합니다. 자해나 자멸적인 명령은 거부할 수 있으며, 명령이 대상의 근본적 성격이나 본성에 완전히 반하는 경우 주문이 자동으로 종료됩니다. 주문을 유지하여 새로운 ...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>대상의 정신을 장악하여 당신의 명령에 복종하게 합니다. 대상은 의지 내성을 시도합니다. 지배에 성공하면, 시전 시 한 문장으로 된 명령을 내릴 수 있습니다. 대상은 그 명령을 최선을 다해 수행합니다. 자해나 자멸적인 명령은 거부할 수 있으며, 명령이 대상의 근본적 성격이나 본성에 완전히 반하는 경우 주문이 자동으로 종료됩니다. 주문을 유지하여 새로운 명령을 내릴 수 있습니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 영향 없음이지만, 대상은 당신이 지배하려 시도했음을 인지합니다.<br><strong>실패:</strong> 대상이 지배됩니다. 대상은 지배당하고 있음을 인지하지 못합니다.<br><strong>대실패:</strong> 대상이 지배됩니다. 대상은 지배당하고 있음을 인지하지 못하며, 주문이 끝난 후에도 지배당했음을 기억하지 못합니다.<br><strong>강화(10랭크):</strong> 지속 시간이 무제한으로 변경되며, 대상은 초기 내성을 시도하지 않습니다."
  },
  {
    "id": "dragon-form",
    "name_ko": "용 형태",
    "name_en": "Dragon Form",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "duration": "1분",
    "summary": "용의 전투 형태로 변신합니다. 크기가 대형이 되고 도달 10피트를 얻습니다. 암시야, 비행 속도 100피트, AC = 18 + 레벨(민첩 수정치 무시), 임시 HP 10을 얻습니다. 변이 주문의 일반 규칙이 적용됩니다.용의 유형을 선택합니다: 검은(산성), 파란(전기), 녹색(독), 붉은(화염), 하얀(냉기), 놋쇠(화염), 청동(전기), 구리(산성)...",
    "desc": "<strong>지속 시간:</strong> 1분<br>용의 전투 형태로 변신합니다. 크기가 <strong>대형</strong>이 되고 도달 10피트를 얻습니다. <strong>암시야</strong>, <strong>비행 속도 100피트</strong>, <strong>AC = 18 + 레벨</strong>(민첩 수정치 무시), <strong>임시 HP 10</strong>을 얻습니다. 변이 주문의 일반 규칙이 적용됩니다.<br>용의 유형을 선택합니다: 검은(산성), 파란(전기), 녹색(독), 붉은(화염), 하얀(냉기), 놋쇠(화염), 청동(전기), 구리(산성), 금(화염), 은(냉기). 선택에 따라 근접 공격(주둥이, 발톱), 브레스 무기의 피해 유형과 형태(원뿔 또는 직선)가 결정됩니다.<br><strong>근접 공격:</strong> 주둥이 +22, 피해 2d12 + 선택한 유형 피해 / 발톱 +22, 민첩, 피해 3d10 타격.<br><strong>브레스 무기 [2행동]:</strong> 60피트 직선 또는 30피트 원뿔(유형에 따라), 기본 반사, 10d6 선택한 유형 피해. 브레스 사용 후 1d4 라운드 재충전.<br><strong>강화(8랭크):</strong> 크기 거대, 도달 15피트, AC = 21 + 레벨, 임시 HP 20, 공격 수정치 +28, 피해 주사위 증가, 브레스 피해 14d6."
  },
  {
    "id": "field-of-life",
    "name_ko": "생명의 장",
    "name_en": "Field of Life",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "치유",
      "조작",
      "생명력"
    ],
    "range": "30피트",
    "area": "20피트 폭발",
    "duration": "유지(최대 1분)",
    "summary": "영역 내 각 살아있는 생물은 턴 시작 시 1d8 HP를 회복합니다. 영역 내 언데드는 턴 시작 시 1d8 생명력 피해를 받습니다.강화(8랭크): 1d10. 강화(9랭크): 1d12.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>영역:</strong> 20피트 폭발<br><strong>지속 시간:</strong> 유지(최대 1분)<br>영역 내 각 살아있는 생물은 턴 시작 시 <strong>1d8 HP를 회복</strong>합니다. 영역 내 언데드는 턴 시작 시 <strong>1d8 생명력 피해</strong>를 받습니다.<br><strong>강화(8랭크):</strong> 1d10. <strong>강화(9랭크):</strong> 1d12."
  },
  {
    "id": "mislead",
    "name_ko": "오도",
    "name_en": "Mislead",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작"
    ],
    "duration": "유지(최대 1분)",
    "summary": "당신이 투명해지면서, 동시에 당신처럼 보이고 행동하는 환영 복제본을 만듭니다. 복제본은 당신의 마지막 위치에 나타나며, 주문을 유지하면서 턴마다 복제본을 이동시키고 간단한 행동(걷기, 말하기 등)을 하게 할 수 있습니다. 복제본은 피해를 줄 수 없으며, 물리적 상호작용을 하면 환영이 불신됩니다. 당신이 적대 행동을 하면 투명 상태가 1라운드 동안 해제...",
    "desc": "<strong>지속 시간:</strong> 유지(최대 1분)<br>당신이 투명해지면서, 동시에 당신처럼 보이고 행동하는 환영 복제본을 만듭니다. 복제본은 당신의 마지막 위치에 나타나며, 주문을 유지하면서 턴마다 복제본을 이동시키고 간단한 행동(걷기, 말하기 등)을 하게 할 수 있습니다. 복제본은 피해를 줄 수 없으며, 물리적 상호작용을 하면 환영이 불신됩니다. 당신이 적대 행동을 하면 투명 상태가 1라운드 동안 해제되지만, 복제본은 유지됩니다."
  },
  {
    "id": "never-mind",
    "name_ko": "망각",
    "name_en": "Never Mind",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "summary": "생물을 영구적으로 멍청하게 만듭니다. 의지 실패 시 현기증(stupefied) 4(영구). 대실패 시 현기증 4+혼란(confused) 1라운드. 이 효과는 저주이며 상쇄로만 제거 가능.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br>생물을 영구적으로 멍청하게 만듭니다. 의지 실패 시 <strong>{{condition:Stupefied}} 4</strong>(영구). 대실패 시 현기증 4+<strong>{{condition:Confused}} 1라운드</strong>. 이 효과는 저주이며 상쇄로만 제거 가능."
  },
  {
    "id": "petrify",
    "name_ko": "석화",
    "name_en": "Petrify",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "대지",
      "조작"
    ],
    "range": "120피트",
    "target": "유기물로 이루어진 생물 1",
    "defense": "인내",
    "duration": "다양",
    "summary": "대상의 몸이 천천히 돌로 변해갑니다. 대상은 인내 내성을 시도합니다.대성공: 영향 없음.성공: 1라운드 동안 둔화(slowed) 1.실패: 둔화 1, 매 턴 끝에 인내 내성을 시도합니다(이 반복 내성은 무력화 특성을 가짐). 실패 시 둔화 수치가 1 증가(대실패 시 2 증가). 성공 시 둔화 수치가 1 감소합니다. 둔화로 인해 완전히 행동할 수 없게 ...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 유기물로 이루어진 생물 1<br><strong>방어:</strong> 인내<br><strong>지속 시간:</strong> 다양<br>대상의 몸이 천천히 돌로 변해갑니다. 대상은 인내 내성을 시도합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> <strong>1라운드</strong> 동안 <strong>{{condition:Slowed}} 1</strong>.<br><strong>실패:</strong> <strong>둔화 1</strong>, 매 턴 끝에 인내 내성을 시도합니다(이 반복 내성은 무력화 특성을 가짐). 실패 시 둔화 수치가 1 증가(대실패 시 2 증가). 성공 시 둔화 수치가 1 감소합니다. 둔화로 인해 완전히 행동할 수 없게 되면, 영구적으로 석화됩니다. 둔화가 제거되면 주문도 종료됩니다.<br><strong>대실패:</strong> 실패와 같지만, 초기 둔화가 <strong>2</strong>입니다."
  },
  {
    "id": "phantasmal-calamity",
    "name_ko": "환영 재앙",
    "name_en": "Phantasmal Calamity",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작",
      "정신"
    ],
    "range": "500피트",
    "area": "30피트 폭발",
    "defense": "의지",
    "summary": "묵시록적 파멸의 환시가 영역 내 각 생물의 정신을 채웁니다. 11d6 정신 피해(기본 의지). 대실패 시 반사 내성이나 비슷한 판정에도 성공해야 하며, 실패하면(갈라진 틈에 빠지거나, 바다에 표류하는 등) 1분 동안 기절(stunned). 매 턴 끝에 새로운 의지 내성을 시도하여, 성공 시 환상을 불신하고 기절에서 회복합니다.강화(+1): 피해 +2d6.",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>영역:</strong> 30피트 폭발<br><strong>방어:</strong> 의지<br>묵시록적 파멸의 환시가 영역 내 각 생물의 정신을 채웁니다. <strong>11d6 정신 피해</strong>(기본 의지). 대실패 시 반사 내성이나 비슷한 판정에도 성공해야 하며, 실패하면(갈라진 틈에 빠지거나, 바다에 표류하는 등) <strong>1분 동안 {{condition:Stunned}}</strong>. 매 턴 끝에 새로운 의지 내성을 시도하여, 성공 시 환상을 불신하고 기절에서 회복합니다.<br><strong>강화(+1):</strong> 피해 +2d6."
  },
  {
    "id": "repulsion",
    "name_ko": "반발",
    "name_en": "Repulsion",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "정신"
    ],
    "area": "최대 40피트 발산",
    "defense": "의지",
    "duration": "1분",
    "summary": "접근을 막는 오라를 만듭니다. 생물이 영역에 진입하거나 영역 시작 시 의지 내성을 시도합니다. 해당 시전에 대해 같은 결과를 계속 사용합니다. 이동 제한은 자발적 접근에만 적용됩니다.대성공: 제한 없음.성공: 더 가까이 이동할 때 각 칸을 험지로 취급.실패: 더 가까이 이동 불가.",
    "desc": "<strong>영역:</strong> 최대 40피트 발산<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1분<br>접근을 막는 오라를 만듭니다. 생물이 영역에 진입하거나 영역 시작 시 의지 내성을 시도합니다. 해당 시전에 대해 같은 결과를 계속 사용합니다. 이동 제한은 자발적 접근에만 적용됩니다.<br><strong>대성공:</strong> 제한 없음.<br><strong>성공:</strong> 더 가까이 이동할 때 각 칸을 험지로 취급.<br><strong>실패:</strong> 더 가까이 이동 불가."
  },
  {
    "id": "spellwrack",
    "name_ko": "주문 고통",
    "name_en": "Spellwrack",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "저주",
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "summary": "대성공: 영향 없음. 성공: 10분간 지속 피해 틱마다 대상에 영향을 주는 주문 지속 시간이 1라운드씩 감소. 2d12 지속 힘 피해. 주문 DC에 대한 주문학(Arcana) 판정 성공 시 1분 후 저주와 지속 피해 종료. 실패: 성공과 같지만 저주와 지속 피해가 저절로 끝나지 않음. 대실패: 지속 힘 피해 4d12.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 10분간 지속 피해 틱마다 대상에 영향을 주는 주문 지속 시간이 1라운드씩 감소. <strong>2d12 지속 힘 피해</strong>. 주문 DC에 대한 주문학(Arcana) 판정 성공 시 1분 후 저주와 지속 피해 종료. <strong>실패:</strong> 성공과 같지만 저주와 지속 피해가 저절로 끝나지 않음. <strong>대실패:</strong> 지속 힘 피해 <strong>4d12</strong>."
  },
  {
    "id": "spirit-blast",
    "name_ko": "영혼 폭발",
    "name_en": "Spirit Blast",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "기본 인내",
    "summary": "생물의 영적 본질에 피해를 줍니다. 16d6 영혼(spirit) 피해(기본 인내).강화(+1): 피해 +2d6.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 기본 인내<br>생물의 영적 본질에 피해를 줍니다. <strong>16d6 영혼(spirit) 피해</strong>(기본 인내).<br><strong>강화(+1):</strong> 피해 +2d6."
  },
  {
    "id": "tangling-creepers",
    "name_ko": "덩굴 뒤엉킴",
    "name_en": "Tangling Creepers",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "식물"
    ],
    "range": "500피트",
    "area": "40피트 폭발",
    "duration": "10분",
    "summary": "모든 표면에 덩굴이 자랍니다. 지상이나 등반/수영 중인 생물은 이동 속도에 -10피트 상황 페널티를 받습니다. 라운드당 1회 유지하여 덩굴 채찍(15피트 도달)으로 공격 가능. 근접 주문 명중 굴림; 성공 시 대상을 끌어당기고 1라운드 동안 이동 불가(주문 DC에 대해 탈출 가능).",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>영역:</strong> 40피트 폭발<br><strong>지속 시간:</strong> 10분<br>모든 표면에 덩굴이 자랍니다. 지상이나 등반/수영 중인 생물은 이동 속도에 <strong>-10피트 상황 페널티</strong>를 받습니다. 라운드당 1회 유지하여 덩굴 채찍(15피트 도달)으로 공격 가능. 근접 주문 명중 굴림; 성공 시 대상을 끌어당기고 1라운드 동안 이동 불가(주문 DC에 대해 탈출 가능)."
  },
  {
    "id": "teleport",
    "name_ko": "순간이동",
    "name_en": "Teleport",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작",
      "순간이동"
    ],
    "range": "100마일",
    "target": "자신+접촉한 최대 4 대상(대략 생물 크기)",
    "castTime": "10분",
    "summary": "당신과 대상들을 즉시 이동시킵니다. 거리의 약 1%만큼 오차가 발생할 수 있습니다.강화(7랭크): 사거리 1,000마일. 강화(8랭크): 같은 행성 내, 1,000마일 초과 시 10마일 오차. 강화(9랭크): 같은 태양계 내 다른 행성, 100마일 오차. 강화(10랭크): 같은 은하 내 아무 행성.",
    "desc": "<strong>사거리:</strong> 100마일<br><strong>대상:</strong> 자신+접촉한 최대 4 대상(대략 생물 크기)<br><strong>시전:</strong> 10분<br>당신과 대상들을 즉시 이동시킵니다. 거리의 약 1%만큼 오차가 발생할 수 있습니다.<br><strong>강화(7랭크):</strong> 사거리 1,000마일. <strong>강화(8랭크):</strong> 같은 행성 내, 1,000마일 초과 시 10마일 오차. <strong>강화(9랭크):</strong> 같은 태양계 내 다른 행성, 100마일 오차. <strong>강화(10랭크):</strong> 같은 은하 내 아무 행성."
  },
  {
    "id": "truesight",
    "name_ko": "진실 시야",
    "name_en": "Truesight",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "탐지"
    ],
    "duration": "10분",
    "summary": "영역 내 환영/변이/변신에 대해 비밀 상쇄 판정을 합니다. 변신에 대해 판정 성공 시 진짜 형태를 볼 수 있지만 변신을 종료하지는 않습니다.",
    "desc": "<strong>지속 시간:</strong> 10분<br>영역 내 환영/변이/변신에 대해 비밀 상쇄 판정을 합니다. 변신에 대해 판정 성공 시 진짜 형태를 볼 수 있지만 변신을 종료하지는 않습니다."
  },
  {
    "id": "vampiric-exsanguination",
    "name_ko": "흡혈 탈혈",
    "name_en": "Vampiric Exsanguination",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "공허"
    ],
    "area": "30피트 원뿔",
    "defense": "기본 인내",
    "summary": "12d6 공허 피해(기본 인내). 가장 많은 피해를 받은 생물 1의 피해 절반만큼 임시 HP를 얻습니다(1분 후 남은 임시 HP 상실).강화(+1): 피해 +2d6.",
    "desc": "<strong>영역:</strong> 30피트 원뿔<br><strong>방어:</strong> 기본 인내<br><strong>12d6 공허 피해</strong>(기본 인내). 가장 많은 피해를 받은 생물 1의 피해 절반만큼 <strong>임시 HP</strong>를 얻습니다(1분 후 남은 임시 HP 상실).<br><strong>강화(+1):</strong> 피해 +2d6."
  },
  {
    "id": "vibrant-pattern",
    "name_ko": "현란한 무늬",
    "name_en": "Vibrant Pattern",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "무력화",
      "조작",
      "시각"
    ],
    "range": "120피트",
    "area": "10피트 폭발",
    "defense": "의지",
    "duration": "유지(최대 1분)",
    "summary": "맥동하는 빛. 영역 내 생물은 현혹(dazzled). 시전 시, 진입 시, 턴 종료 시, 영역 내에서 탐색/상호작용 시 의지 내성. 이미 실명한 생물은 새 내성 불필요.성공: 영향 없음. 실패: 실명(blinded). 무늬에서 벗어나면 매 턴 종료 시 새 내성으로 회복 가능(최대 1분). 대실패: 실명 1분.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 10피트 폭발<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 유지(최대 1분)<br>맥동하는 빛. 영역 내 생물은 {{condition:Dazzled}}. 시전 시, 진입 시, 턴 종료 시, 영역 내에서 탐색/상호작용 시 의지 내성. 이미 실명한 생물은 새 내성 불필요.<br><strong>성공:</strong> 영향 없음. <strong>실패:</strong> {{condition:Blinded}}. 무늬에서 벗어나면 매 턴 종료 시 새 내성으로 회복 가능(최대 1분). <strong>대실패:</strong> 실명 1분."
  },
  {
    "id": "wall-of-force",
    "name_ko": "힘의 벽",
    "name_en": "Wall of Force",
    "rank": 6,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "3행동",
    "traits": [
      "힘",
      "조작"
    ],
    "range": "30피트",
    "duration": "1분",
    "summary": "보이지 않는 순수 마법 힘의 벽을 형성합니다. 최대 50피트 길이, 20피트 높이. 끊어지지 않은 열린 공간에 만들어야 합니다. AC 10, 경도 30, HP 60. 치명타와 정밀 피해에 면역. 물리적 효과를 차단하며, 힘(force)으로 되어 있으므로 무형체 생물과 에테르적 생물도 차단합니다. 순간이동 효과는 통과 가능(벽이 보이지 않으므로 시각 효...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 1분<br>보이지 않는 순수 마법 힘의 벽을 형성합니다. 최대 50피트 길이, 20피트 높이. 끊어지지 않은 열린 공간에 만들어야 합니다. AC 10, 경도 30, HP 60. 치명타와 정밀 피해에 면역. 물리적 효과를 차단하며, 힘(force)으로 되어 있으므로 무형체 생물과 에테르적 생물도 차단합니다. 순간이동 효과는 통과 가능(벽이 보이지 않으므로 시각 효과도). 주문 랭크 이하의 효과에 면역. {{spell:Disintegrate}} 주문에 의해 자동 파괴됩니다.<br><strong>강화(+2):</strong> 벽의 HP가 20 증가합니다."
  },
  {
    "id": "collective-memories",
    "name_ko": "집단 기억",
    "name_en": "Collective Memories",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "정신"
    ],
    "castTime": "10분",
    "summary": "주변의 모든 생물의 집단적 기억에 접근합니다. 지역에 대한 역사, 비밀, 숨겨진 정보를 알아낼 수 있습니다. 지식 회상에 +4 상태 보너스.",
    "desc": "<strong>시전:</strong> 10분<br>주변의 모든 생물의 집단적 기억에 접근합니다. 지역에 대한 역사, 비밀, 숨겨진 정보를 알아낼 수 있습니다. 지식 회상에 <strong>+4 상태 보너스</strong>."
  },
  {
    "id": "divine-decree",
    "name_ko": "신성한 칙령",
    "name_en": "Divine Decree",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "성별화",
      "영혼"
    ],
    "range": "40피트",
    "area": "40피트 발산",
    "defense": "인내",
    "duration": "다양",
    "summary": "당신의 신앙에서 비롯된 강력한 신성 선언, 즉 당신의 이상에 반대하는 자들을 해치는 명령을 발합니다. 당신의 성별화와 반대되는 성별화를 지닌 생물(불경 성별화를 지녔다면 신성 특성의 생물, 그 반대의 경우도 마찬가지)이나 성별화가 없는 생물에게 영역 내에서 7d10 영혼 피해를 가합니다. 각 생물은 인내 내성을 시도해야 합니다.대성공: 영향 없음.성공...",
    "desc": "<strong>사거리:</strong> 40피트<br><strong>영역:</strong> 40피트 발산<br><strong>방어:</strong> 인내<br><strong>지속 시간:</strong> 다양<br>당신의 신앙에서 비롯된 강력한 신성 선언, 즉 당신의 이상에 반대하는 자들을 해치는 명령을 발합니다. 당신의 성별화와 반대되는 성별화를 지닌 생물(불경 성별화를 지녔다면 신성 특성의 생물, 그 반대의 경우도 마찬가지)이나 성별화가 없는 생물에게 영역 내에서 <strong>7d10 영혼 피해</strong>를 가합니다. 각 생물은 인내 내성을 시도해야 합니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 절반 피해를 받습니다.<br><strong>실패:</strong> 전체 피해를 받고, {{condition:Enfeebled}} 2 상태가 되며, 당신으로부터 직접 5피트 밀려납니다. 레벨 10 이하의 생물은 추가로 {{condition:Blinded}} 상태가 됩니다.<br><strong>대실패:</strong> 2배 피해를 받고, 약화 2 상태가 되며, 당신으로부터 직접 10피트 밀려납니다. 레벨 10 이하의 생물은 추가로 고향 차원으로 추방됩니다. 이 차원이 고향인 생물은 대신 {{condition:Stunned}} 4 상태가 됩니다.<br><strong>강화(+1):</strong> 피해 +1d10, 레벨 기준치 +2."
  },
  {
    "id": "duplicate-foe",
    "name_ko": "적 복제",
    "name_en": "Duplicate Foe",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "적 생물 1",
    "defense": "인내",
    "duration": "유지(최대 1분)",
    "summary": "적의 임시 복제본을 만들어 당신을 위해 싸우게 합니다. 인내 실패 시 복제본 생성. 복제본은 원본의 공격과 이동을 가지지만 HP가 낮고 주문 시전 불가. 하수인 특성.강화(9랭크): 복제본의 HP와 지속 시간 증가.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 적 생물 1<br><strong>방어:</strong> 인내<br><strong>지속 시간:</strong> 유지(최대 1분)<br>적의 임시 복제본을 만들어 당신을 위해 싸우게 합니다. 인내 실패 시 복제본 생성. 복제본은 원본의 공격과 이동을 가지지만 HP가 낮고 주문 시전 불가. 하수인 특성.<br><strong>강화(9랭크):</strong> 복제본의 HP와 지속 시간 증가."
  },
  {
    "id": "eclipse-burst",
    "name_ko": "일식 폭발",
    "name_en": "Eclipse Burst",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "냉기",
      "어둠",
      "조작"
    ],
    "range": "500피트",
    "area": "60피트 폭발",
    "defense": "반사",
    "summary": "어둠의 구체를 폭발시켜 냉기 피해, 산 것에 추가 피해, 빛을 극복합니다. 8d10 냉기 피해. 산 것에 추가 8d4 활력 피해. 영역의 마법 빛을 상쇄 시도. 불빛은 1분간 꺼짐.강화(+1): 냉기 +1d10, 활력 +1d4.",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>영역:</strong> 60피트 폭발<br><strong>방어:</strong> 반사<br>어둠의 구체를 폭발시켜 냉기 피해, 산 것에 추가 피해, 빛을 극복합니다. <strong>8d10 냉기 피해</strong>. 산 것에 추가 <strong>8d4 활력 피해</strong>. 영역의 마법 빛을 상쇄 시도. 불빛은 1분간 꺼짐.<br><strong>강화(+1):</strong> 냉기 +1d10, 활력 +1d4."
  },
  {
    "id": "energy-aegis",
    "name_ko": "에너지 방벽",
    "name_en": "Energy Aegis",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "1분",
    "summary": "생물이 산성, 냉기, 전기, 화염, 힘, 음파, 활력, 공허 피해에 저항 5를 얻습니다.강화(9랭크): 저항 10.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 1분<br>생물이 산성, 냉기, 전기, 화염, 힘, 음파, 활력, 공허 피해에 <strong>저항 5</strong>를 얻습니다.<br><strong>강화(9랭크):</strong> 저항 10."
  },
  {
    "id": "execute",
    "name_ko": "처형",
    "name_en": "Execute",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "공허",
      "활력"
    ],
    "range": "30피트",
    "target": "살아있는 또는 언데드 생물 1",
    "defense": "인내",
    "summary": "살아있는 생물을 죽음으로, 언데드를 파괴로 끌어당깁니다. 대상의 남은 HP에 따라 피해가 결정됩니다. 최대 HP의 절반 이하일 때 즉사 가능(인내 대실패 시).강화(8랭크): 2 대상. 강화(9랭크): 3 대상.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 살아있는 또는 언데드 생물 1<br><strong>방어:</strong> 인내<br>살아있는 생물을 죽음으로, 언데드를 파괴로 끌어당깁니다. 대상의 남은 HP에 따라 피해가 결정됩니다. 최대 HP의 절반 이하일 때 즉사 가능(인내 대실패 시).<br><strong>강화(8랭크):</strong> 2 대상. <strong>강화(9랭크):</strong> 3 대상."
  },
  {
    "id": "fiery-body",
    "name_ko": "불꽃 몸",
    "name_en": "Fiery Body",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "화염",
      "조작",
      "변이"
    ],
    "duration": "1분",
    "summary": "살아있는 불꽃으로 변합니다. 화염 면역, 정밀 피해 저항 10, 냉기 및 물 약점 5. 접촉하거나 비무장 공격을 받으면 3d6 화염 피해. 비무장 공격에 +1d4 화염 피해 추가. 화염 주문의 피해 주사위 +1개. 점화(Ignite)를 선천 캔트립으로 시전 가능. 시전 행동이 2에서 1로 줄어듭니다. 비행 속도 40피트. 호흡 불필요.강화(9랭크): ...",
    "desc": "<strong>지속 시간:</strong> 1분<br>살아있는 불꽃으로 변합니다. <strong>화염 면역, 정밀 피해 저항 10, 냉기 및 물 약점 5</strong>. 접촉하거나 비무장 공격을 받으면 <strong>3d6 화염 피해</strong>. 비무장 공격에 <strong>+1d4 화염 피해</strong> 추가. 화염 주문의 피해 주사위 +1개. 점화(Ignite)를 선천 캔트립으로 시전 가능. 시전 행동이 2에서 1로 줄어듭니다. <strong>비행 속도 40피트</strong>. 호흡 불필요.<br><strong>강화(9랭크):</strong> 접촉 피해 4d6, 비무장 +2d4 화염, 비행 속도 60피트."
  },
  {
    "id": "interplanar-teleport",
    "name_ko": "차원 간 순간이동",
    "name_en": "Interplanar Teleport",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작",
      "순간이동"
    ],
    "range": "접촉",
    "target": "생물 1 또는 동의 생물 최대 8",
    "summary": "당신과 대상들을 당신이 선택한 다른 차원으로 순간이동시킵니다. 목적지 차원에 대한 정보를 가지고 있어야 하며, 일반적으로 직접 방문한 경험이 있거나, 차원의 특성을 자세히 연구했거나, 신뢰할 수 있는 출처로부터 구체적인 지식을 얻은 경우에 해당합니다. 목적지를 연구하지 않았거나 이 지식을 갖추지 못한 동의하는 생물은 시전 도중 당신과 물리적으로 접촉하...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1 또는 동의 생물 최대 8<br>당신과 대상들을 당신이 선택한 다른 차원으로 순간이동시킵니다. 목적지 차원에 대한 정보를 가지고 있어야 하며, 일반적으로 직접 방문한 경험이 있거나, 차원의 특성을 자세히 연구했거나, 신뢰할 수 있는 출처로부터 구체적인 지식을 얻은 경우에 해당합니다. 목적지를 연구하지 않았거나 이 지식을 갖추지 못한 동의하는 생물은 시전 도중 당신과 물리적으로 접촉하고 있어야 합니다. 도착지는 그 차원 어딘가(특정 지점이 아님), 또는 당신이 알고 있는 특정 장소—예를 들어 포탈이나 이전에 방문한 위치—와 연관된 차원 내 지점이 됩니다.<br><strong>강화(9랭크):</strong> 동의하는 생물을 최대 100명까지 데려갈 수 있습니다."
  },
  {
    "id": "mask-of-terror",
    "name_ko": "공포의 가면",
    "name_en": "Mask of Terror",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "감정",
      "환영",
      "조작",
      "정신",
      "시각"
    ],
    "range": "30피트",
    "target": "생물 1",
    "duration": "1분",
    "summary": "무시무시한 환영 외관을 만들어 관찰자를 겁먹게 합니다. 대상을 보는 적은 의지 내성 시도. 실패 시 공포(frightened) 2. 대실패 시 공포 3+도주(fleeing) 1라운드.강화(8랭크): 30피트 폭발 내 모든 아군에 효과 적용 가능.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 1분<br>무시무시한 환영 외관을 만들어 관찰자를 겁먹게 합니다. 대상을 보는 적은 의지 내성 시도. 실패 시 <strong>{{condition:Frightened}} 2</strong>. 대실패 시 공포 3+<strong>{{condition:Fleeing}} 1라운드</strong>.<br><strong>강화(8랭크):</strong> 30피트 폭발 내 모든 아군에 효과 적용 가능."
  },
  {
    "id": "planar-displacement",
    "name_ko": "차원 추방",
    "name_en": "Planar Displacement",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "순간이동"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "1분",
    "summary": "생물을 다른 차원으로 보냅니다. 의지 실패 시 대상이 에테르 차원이나 다른 지정 차원으로 보내집니다. 지속 시간이 끝나면 원래 위치로 돌아옵니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 1분<br>생물을 다른 차원으로 보냅니다. 의지 실패 시 대상이 에테르 차원이나 다른 지정 차원으로 보내집니다. 지속 시간이 끝나면 원래 위치로 돌아옵니다."
  },
  {
    "id": "planar-seal",
    "name_ko": "차원 봉인",
    "name_en": "Planar Seal",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작"
    ],
    "range": "120피트",
    "area": "60피트 폭발",
    "duration": "다음 일일 준비까지",
    "summary": "순간이동 및 차원 이동을 상쇄하는 장벽을 세웁니다. 영역 내에서/영역으로의 순간이동, 차원 이동을 상쇄합니다.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 60피트 폭발<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>순간이동 및 차원 이동을 상쇄하는 장벽을 세웁니다. 영역 내에서/영역으로의 순간이동, 차원 이동을 상쇄합니다."
  },
  {
    "id": "project-image",
    "name_ko": "투영 이미지",
    "name_en": "Project Image",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작",
      "정신"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "자신의 환영 복제를 만듭니다. 환영은 당신과 같은 AC 및 내성을 가집니다. 공격에 맞거나 내성에 실패하면 주문이 종료됩니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>자신의 환영 복제를 만듭니다. 환영은 당신과 같은 AC 및 내성을 가집니다. 공격에 맞거나 내성에 실패하면 주문이 종료됩니다."
  },
  {
    "id": "regenerate",
    "name_ko": "재생",
    "name_en": "Regenerate",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "치유",
      "조작",
      "활력"
    ],
    "range": "접촉",
    "target": "동의하는 살아있는 생물 1",
    "duration": "1분",
    "summary": "재생 15를 부여합니다. 대상은 HP 피해로 죽을 수 없으며, 빈사 상태가 빈사 3을 초과하여 증가하지 않습니다. 부상 수치가 4 이상이면 의식을 잃은 채로 남습니다. 산성 또는 화염 피해를 받으면 재생이 다음 턴 이후까지 비활성화됩니다. 손상되거나 파괴된 기관이 재성장합니다. 절단된 부위는 상호작용 행동으로 다시 붙일 수 있습니다.강화(9랭크): 재...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 동의하는 살아있는 생물 1<br><strong>지속 시간:</strong> 1분<br>재생 15를 부여합니다. 대상은 HP 피해로 죽을 수 없으며, 빈사 상태가 빈사 3을 초과하여 증가하지 않습니다. 부상 수치가 4 이상이면 의식을 잃은 채로 남습니다. 산성 또는 화염 피해를 받으면 재생이 다음 턴 이후까지 비활성화됩니다. 손상되거나 파괴된 기관이 재성장합니다. 절단된 부위는 상호작용 행동으로 다시 붙일 수 있습니다.<br><strong>강화(9랭크):</strong> 재생 20."
  },
  {
    "id": "retrocognition",
    "name_ko": "과거 인지",
    "name_en": "Retrocognition",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "duration": "유지",
    "castTime": "1분",
    "summary": "현재 위치의 과거 사건에 대한 감각 인상을 얻습니다. 첫 1분에 전날, 이후 1분마다 하루씩 더 먼 과거로 거슬러 올라갑니다.강화(8랭크): 1분당 1년 전까지. 강화(9랭크): 1분당 1세기 전까지.",
    "desc": "<strong>지속 시간:</strong> 유지<br><strong>시전:</strong> 1분<br>현재 위치의 과거 사건에 대한 감각 인상을 얻습니다. 첫 1분에 전날, 이후 1분마다 하루씩 더 먼 과거로 거슬러 올라갑니다.<br><strong>강화(8랭크):</strong> 1분당 1년 전까지. <strong>강화(9랭크):</strong> 1분당 1세기 전까지."
  },
  {
    "id": "sunburst",
    "name_ko": "태양 폭발",
    "name_en": "Sunburst",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "화염",
      "빛",
      "조작",
      "활력"
    ],
    "range": "500피트",
    "area": "60피트 폭발",
    "defense": "반사",
    "summary": "모든 대상에 8d10 화염 피해, 언데드에 추가 8d10 활력 피해. 마법 어둠과 겹치면 어둠 효과를 상쇄 시도.대성공: 영향 없음. 성공: 절반 피해. 실패: 전체 피해. 대실패: 전체 피해 + 영구 실명(blinded).강화(+1): 화염 +1d10, 활력 +1d10.",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>영역:</strong> 60피트 폭발<br><strong>방어:</strong> 반사<br>모든 대상에 <strong>8d10 화염 피해</strong>, 언데드에 추가 <strong>8d10 활력 피해</strong>. 마법 어둠과 겹치면 어둠 효과를 상쇄 시도.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 절반 피해. <strong>실패:</strong> 전체 피해. <strong>대실패:</strong> 전체 피해 + 영구 {{condition:Blinded}}.<br><strong>강화(+1):</strong> 화염 +1d10, 활력 +1d10."
  },
  {
    "id": "true-target",
    "name_ko": "정밀 대상",
    "name_en": "True Target",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "1행동",
    "traits": [
      "예언"
    ],
    "range": "60피트",
    "target": "생물 4",
    "duration": "다음 턴 시작까지",
    "summary": "생물 하나를 지정합니다. 지속 시간 동안 각 대상이 지정된 생물에 대해 처음 명중 굴림을 할 때 d20을 두 번 굴려 높은 것을 사용합니다. 또한 은폐(concealed)/숨겨짐(hidden)으로 인한 상황 페널티와 일반 판정(flat check)을 무시합니다.",
    "desc": "<strong>사거리:</strong> 60피트<br><strong>대상:</strong> 생물 4<br><strong>지속 시간:</strong> 다음 턴 시작까지<br>생물 하나를 지정합니다. 지속 시간 동안 각 대상이 지정된 생물에 대해 처음 명중 굴림을 할 때 <strong>d20을 두 번 굴려 높은 것을 사용</strong>합니다. 또한 {{condition:Concealed}}/{{condition:Hidden}}으로 인한 상황 페널티와 일반 판정(flat check)을 무시합니다."
  },
  {
    "id": "vision-of-death",
    "name_ko": "죽음의 환시",
    "name_en": "Vision of Death",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "공포",
      "환영",
      "조작",
      "정신",
      "시각"
    ],
    "range": "120피트",
    "target": "살아있는 생물 1",
    "defense": "의지",
    "summary": "8d6 정신 피해. 0 HP로 감소하면 환시가 현실이 되어 즉사합니다.대성공: 영향 없음. 성공: 절반 피해, 공포 1. 실패: 전체 피해, 공포 2. 대실패: 2배 피해, 공포 4, 공포 상태인 동안 도주.강화(+1): 피해 +2d6.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 살아있는 생물 1<br><strong>방어:</strong> 의지<br><strong>8d6 정신 피해</strong>. 0 HP로 감소하면 환시가 현실이 되어 즉사합니다.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 절반 피해, 공포 1. <strong>실패:</strong> 전체 피해, 공포 2. <strong>대실패:</strong> 2배 피해, 공포 4, 공포 상태인 동안 도주.<br><strong>강화(+1):</strong> 피해 +2d6."
  },
  {
    "id": "volcanic-eruption",
    "name_ko": "화산 분출",
    "name_en": "Volcanic Eruption",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "대지",
      "화염",
      "조작"
    ],
    "range": "120피트",
    "area": "5피트 반경, 80피트 높이 원기둥",
    "defense": "반사",
    "summary": "14d6 화염 피해. 바위에 갇힌 생물: 서투름(clumsy) 1, 이동 속도에 -10피트 상태 페널티. 5피트 이내 생물은 내성과 무관하게 강렬한 열기로 3d6 화염 피해. 비행 생물은 즉시 20피트 하강.대성공: 영향 없음. 성공: 절반 피해. 실패: 전체 피해, 바위에 갇힘. 대실패: 2배 피해, 바위에 갇힘.갇힌 생물은 주문 DC에 대해 탈출하...",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 5피트 반경, 80피트 높이 원기둥<br><strong>방어:</strong> 반사<br><strong>14d6 화염 피해</strong>. 바위에 갇힌 생물: {{condition:Clumsy}} 1, 이동 속도에 -10피트 상태 페널티. 5피트 이내 생물은 내성과 무관하게 강렬한 열기로 <strong>3d6 화염 피해</strong>. 비행 생물은 즉시 20피트 하강.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 절반 피해. <strong>실패:</strong> 전체 피해, 바위에 갇힘. <strong>대실패:</strong> 2배 피해, 바위에 갇힘.<br>갇힌 생물은 주문 DC에 대해 탈출하거나 총 50 피해를 입혀 탈출.<br><strong>강화(+1):</strong> 피해 +2d6, 강렬한 열기 +1d6."
  },
  {
    "id": "warp-mind",
    "name_ko": "정신 왜곡",
    "name_en": "Warp Mind",
    "rank": 7,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "감정",
      "무력화",
      "조작",
      "정신"
    ],
    "range": "120피트",
    "target": "생물 1",
    "defense": "의지",
    "summary": "정신 기능과 감각 입력을 뒤섞습니다. 결과와 무관하게 대상은 10분 일시적 면역.대성공: 영향 없음. 성공: 다음 턴 첫 행동을 혼란(confused) 상태로 소비. 실패: 1분 동안 혼란. 대실패: 영구 혼란.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br>정신 기능과 감각 입력을 뒤섞습니다. 결과와 무관하게 대상은 10분 일시적 면역.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 다음 턴 첫 행동을 {{condition:Confused}} 상태로 소비. <strong>실패:</strong> 1분 동안 혼란. <strong>대실패:</strong> 영구 혼란."
  },
  {
    "id": "arctic-rift",
    "name_ko": "극지 균열",
    "name_en": "Arctic Rift",
    "rank": 8,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "냉기",
      "조작"
    ],
    "range": "120피트",
    "target": "생물 1",
    "defense": "기본 반사",
    "summary": "매서운 추위가 생물에 피해를 주고 얼립니다. 10d8 냉기 피해(기본 반사). 실패 시 둔화(slowed) 2(1라운드). 대실패 시 석화(petrified, 얼음으로)(1분).강화(+1): 피해 +2d8.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 기본 반사<br>매서운 추위가 생물에 피해를 주고 얼립니다. <strong>10d8 냉기 피해</strong>(기본 반사). 실패 시 <strong>{{condition:Slowed}} 2</strong>(1라운드). 대실패 시 <strong>석화(petrified, 얼음으로)</strong>(1분).<br><strong>강화(+1):</strong> 피해 +2d8."
  },
  {
    "id": "canticle-of-everlasting-grief",
    "name_ko": "영원한 슬픔의 찬가",
    "name_en": "Canticle of Everlasting Grief",
    "rank": 8,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "청각",
      "저주",
      "감정",
      "공포",
      "조작",
      "정신"
    ],
    "range": "120피트",
    "target": "생물 1",
    "defense": "의지",
    "duration": "다양",
    "summary": "순수한 슬픔에서 증류된 선율. 10d6 정신 피해. 저주받은 동안 상황/상태 보너스를 받을 수 없음.성공: 절반 피해, 공포 1, 저주 1라운드. 실패: 전체 피해, 공포 2, 저주 1분. 대실패: 2배 피해, 공포 3+도주 1라운드, 저주 10분.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 다양<br>순수한 슬픔에서 증류된 선율. <strong>10d6 정신 피해</strong>. 저주받은 동안 상황/상태 보너스를 받을 수 없음.<br><strong>성공:</strong> 절반 피해, 공포 1, 저주 1라운드. <strong>실패:</strong> 전체 피해, 공포 2, 저주 1분. <strong>대실패:</strong> 2배 피해, 공포 3+도주 1라운드, 저주 10분."
  },
  {
    "id": "desiccate",
    "name_ko": "탈수",
    "name_en": "Desiccate",
    "rank": 8,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "공허"
    ],
    "range": "500피트",
    "target": "살아있는 생물 다수",
    "defense": "기본 인내",
    "summary": "살아있는 생물의 몸에서 수분을 격렬하게 빼앗습니다. 대상은 10d10 공허 피해를 받고 기본 인내 내성을 시도합니다. 물(water) 특성이나 식물(plant) 특성을 가진 생물은 내성 결과가 한 단계 나빠집니다. 수분이 없는 생물(대지 정령 등)은 이 주문에 면역입니다.강화(+1): 피해 +1d10.",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>대상:</strong> 살아있는 생물 다수<br><strong>방어:</strong> 기본 인내<br>살아있는 생물의 몸에서 수분을 격렬하게 빼앗습니다. 대상은 <strong>10d10 공허 피해</strong>를 받고 <strong>기본 인내 내성</strong>을 시도합니다. 물(water) 특성이나 식물(plant) 특성을 가진 생물은 내성 결과가 <strong>한 단계 나빠집니다</strong>. 수분이 없는 생물(대지 정령 등)은 이 주문에 <strong>면역</strong>입니다.<br><strong>강화(+1):</strong> 피해 +1d10."
  },
  {
    "id": "disappearance",
    "name_ko": "소멸",
    "name_en": "Disappearance",
    "rank": 8,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "환영",
      "조작",
      "은밀"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "10분",
    "summary": "생물을 모든 감각에서 숨깁니다. 대상이 미탐지(undetected) 상태가 됩니다 — 시각뿐만 아니라 모든 정밀/부정확 감각에서. 탐색(Seek), 흩어진 먼지, 소리 공백 등으로 발견 가능.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 10분<br>생물을 모든 감각에서 숨깁니다. 대상이 <strong>{{condition:Undetected}}</strong> 상태가 됩니다 — 시각뿐만 아니라 모든 정밀/부정확 감각에서. 탐색(Seek), 흩어진 먼지, 소리 공백 등으로 발견 가능."
  },
  {
    "id": "divine-inspiration",
    "name_ko": "신성한 영감",
    "name_en": "Divine Inspiration",
    "rank": 8,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "정신"
    ],
    "range": "30피트",
    "target": "동의하는 생물 1",
    "duration": "다음 일일 준비까지",
    "summary": "대상을 신성한 힘으로 채워 직업 자질과의 연결을 회복시킵니다. 대상은 하루에 제한된 횟수만 사용할 수 있는 소진된 직업 특성 중 하나(집중 풀, 기의 풀 또는 기타 능력 등)를 되찾습니다. 주문 시전자의 경우, 4랭크 이하의 소진된 주문 슬롯 하나를 회복합니다.강화(10랭크): 회복할 수 있는 주문 슬롯이 최대 7랭크까지 가능합니다.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 동의하는 생물 1<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>대상을 신성한 힘으로 채워 직업 자질과의 연결을 회복시킵니다. 대상은 하루에 제한된 횟수만 사용할 수 있는 소진된 직업 특성 중 하나(집중 풀, 기의 풀 또는 기타 능력 등)를 되찾습니다. 주문 시전자의 경우, 4랭크 이하의 소진된 주문 슬롯 하나를 회복합니다.<br><strong>강화(10랭크):</strong> 회복할 수 있는 주문 슬롯이 최대 7랭크까지 가능합니다."
  },
  {
    "id": "earthquake",
    "name_ko": "지진",
    "name_en": "Earthquake",
    "rank": 8,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "대지",
      "조작"
    ],
    "range": "500피트",
    "area": "60피트 폭발",
    "defense": "반사",
    "summary": "파괴적인 지진으로 땅을 흔듭니다. 영역이 험지가 됩니다. 생물이 반사 내성 시도.대성공: 영향 없음. 성공: 넘어뜨려짐. 실패: 넘어뜨려짐+4d6 둔기 피해. 대실패: 넘어뜨려짐+4d6 둔기 피해+1d6 지속 둔기 피해. 구조물에 추가 피해.강화(+1): 둔기 피해 +1d6.",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>영역:</strong> 60피트 폭발<br><strong>방어:</strong> 반사<br>파괴적인 지진으로 땅을 흔듭니다. 영역이 험지가 됩니다. 생물이 반사 내성 시도.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 넘어뜨려짐. <strong>실패:</strong> 넘어뜨려짐+<strong>4d6 둔기 피해</strong>. <strong>대실패:</strong> 넘어뜨려짐+<strong>4d6 둔기 피해</strong>+<strong>1d6 지속 둔기 피해</strong>. 구조물에 추가 피해.<br><strong>강화(+1):</strong> 둔기 피해 +1d6."
  },
  {
    "id": "hidden-mind",
    "name_ko": "숨겨진 정신",
    "name_en": "Hidden Mind",
    "rank": 8,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작",
      "정신"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "다음 일일 준비까지",
    "summary": "정신 마법과 비밀을 엿보는 효과로부터 생물을 보호합니다. 정신 효과에 대한 내성에 +2 상태 보너스. 독심술, 투시, 기타 탐지 효과에 면역.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>정신 마법과 비밀을 엿보는 효과로부터 생물을 보호합니다. 정신 효과에 대한 내성에 +2 상태 보너스. 독심술, 투시, 기타 탐지 효과에 면역."
  },
  {
    "id": "quandary",
    "name_ko": "난제",
    "name_en": "Quandary",
    "rank": 8,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "duration": "유지",
    "summary": "초차원 퍼즐 방에 생물을 가둡니다. 대상은 오컬티즘, 인지, 또는 도적질 판정(주문 DC)으로 탈출을 시도합니다.대성공: 퍼즐 해결, 탈출.성공: 올바른 경로에 진입.실패: 진전 없음.대실패: 진전 없음, 올바른 경로에 있었다면 더 이상 아님.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 유지<br>초차원 퍼즐 방에 생물을 가둡니다. 대상은 오컬티즘, 인지, 또는 도적질 판정(주문 DC)으로 탈출을 시도합니다.<br><strong>대성공:</strong> 퍼즐 해결, 탈출.<br><strong>성공:</strong> 올바른 경로에 진입.<br><strong>실패:</strong> 진전 없음.<br><strong>대실패:</strong> 진전 없음, 올바른 경로에 있었다면 더 이상 아님."
  },
  {
    "id": "uncontrollable-dance",
    "name_ko": "억제할 수 없는 춤",
    "name_en": "Uncontrollable Dance",
    "rank": 8,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "무력화",
      "조작",
      "정신"
    ],
    "range": "접촉",
    "target": "생물 1",
    "defense": "의지",
    "duration": "다양",
    "summary": "대상은 무방비(off-guard). 반응 사용 불가. 반보(Stride, 절반 속도) 외의 이동 행동 사용 불가.대성공: 영향 없음. 성공: 3라운드, 매 턴 최소 1행동을 춤에 사용. 실패: 1분, 매 턴 최소 2행동을 춤에 사용. 대실패: 1분, 매 턴 모든 행동을 춤에 사용.",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 의지<br><strong>지속 시간:</strong> 다양<br>대상은 {{condition:Off-Guard}}. 반응 사용 불가. 반보(Stride, 절반 속도) 외의 이동 행동 사용 불가.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 3라운드, 매 턴 최소 1행동을 춤에 사용. <strong>실패:</strong> 1분, 매 턴 최소 2행동을 춤에 사용. <strong>대실패:</strong> 1분, 매 턴 모든 행동을 춤에 사용."
  },
  {
    "id": "unrelenting-observation",
    "name_ko": "끊임없는 관찰",
    "name_en": "Unrelenting Observation",
    "rank": 8,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "투시"
    ],
    "range": "100피트",
    "area": "20피트 폭발",
    "target": "추적할 생물/물체 1 + 최대 5 동의 생물",
    "duration": "다양",
    "summary": "투시 기반 완벽한 시야. 추적 대상 1을 선택하여 감지기로 삼습니다. 최대 5 동의 생물이 유령 같은 이미지를 볼 수 있습니다. 은폐/투명 상태를 감지할 수 있지만 물리적 장벽은 여전히 엄폐를 제공합니다. 추적 생물은 납이나 흐르는 물 외의 모든 장벽을 관통해 봅니다. 대상이 동의하면 지속 시간 1시간. 비동의 시 의지 내성.",
    "desc": "<strong>사거리:</strong> 100피트<br><strong>영역:</strong> 20피트 폭발<br><strong>대상:</strong> 추적할 생물/물체 1 + 최대 5 동의 생물<br><strong>지속 시간:</strong> 다양<br>투시 기반 완벽한 시야. 추적 대상 1을 선택하여 감지기로 삼습니다. 최대 5 동의 생물이 유령 같은 이미지를 볼 수 있습니다. 은폐/투명 상태를 감지할 수 있지만 물리적 장벽은 여전히 엄폐를 제공합니다. 추적 생물은 납이나 흐르는 물 외의 모든 장벽을 관통해 봅니다. 대상이 동의하면 지속 시간 1시간. 비동의 시 의지 내성."
  },
  {
    "id": "detonate-magic",
    "name_ko": "마법 폭발",
    "name_en": "Detonate Magic",
    "rank": 9,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작"
    ],
    "range": "120피트",
    "target": "마법 아이템 1 또는 주문 효과 1",
    "defense": "기본 반사(아래 참조)",
    "summary": "대상의 마법을 파괴적 폭발로 소산시킵니다. 상쇄를 시도합니다. 성공 시 8d6 힘 피해의 폭발(기본 반사). 아이템이면 1주 비활성(대성공 시 파괴), 5피트 발산. 주문이면 효과 종료, 영역 내 모든 생물 또는 대상+5피트 발산에 영향.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>대상:</strong> 마법 아이템 1 또는 주문 효과 1<br><strong>방어:</strong> 기본 반사(아래 참조)<br>대상의 마법을 파괴적 폭발로 소산시킵니다. 상쇄를 시도합니다. 성공 시 <strong>8d6 힘 피해</strong>의 폭발(기본 반사). 아이템이면 1주 비활성(대성공 시 파괴), 5피트 발산. 주문이면 효과 종료, 영역 내 모든 생물 또는 대상+5피트 발산에 영향."
  },
  {
    "id": "falling-stars",
    "name_ko": "유성 낙하",
    "name_en": "Falling Stars",
    "rank": 9,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "500피트",
    "area": "40피트 폭발 4개",
    "defense": "기본 반사",
    "summary": "유성 유형을 선택합니다: 공중 폭발(음파), 소행성(화염), 혜성(냉기), 플라즈마(전기). 4개의 유성이 떨어지며, 각 유성의 중심 10피트 폭발은 겹칠 수 없습니다. 각 유성은 10피트 폭발에 6d10 둔기 피해, 40피트 폭발에 14d6 에너지 피해를 줍니다. 하나의 기본 반사 내성으로 판정하며, 각 유형의 피해는 한 번만 받습니다.강화(+1):...",
    "desc": "<strong>사거리:</strong> 500피트<br><strong>영역:</strong> 40피트 폭발 4개<br><strong>방어:</strong> 기본 반사<br>유성 유형을 선택합니다: 공중 폭발(음파), 소행성(화염), 혜성(냉기), 플라즈마(전기). 4개의 유성이 떨어지며, 각 유성의 중심 10피트 폭발은 겹칠 수 없습니다. 각 유성은 10피트 폭발에 <strong>6d10 둔기 피해</strong>, 40피트 폭발에 <strong>14d6 에너지 피해</strong>를 줍니다. 하나의 기본 반사 내성으로 판정하며, 각 유형의 피해는 한 번만 받습니다.<br><strong>강화(+1):</strong> 둔기 피해 +1d10, 에너지 피해 +2d6."
  },
  {
    "id": "foresight",
    "name_ko": "예지",
    "name_en": "Foresight",
    "rank": 9,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "정신",
      "예언"
    ],
    "range": "접촉",
    "target": "생물 1",
    "duration": "1시간",
    "summary": "여섯 번째 감각이 대상에게 위험을 경고합니다. 자신에게 시전하면 정신 연결로 대상에게 알립니다. 대상은 우선권에 +2 상태 보너스를 받으며, 감지되지 않은 생물이나 측면 협공에 의해 무방비(off-guard)가 되지 않습니다. 반응: 적대적 생물이나 위험이 대상을 위협할 때, 예지가 대상을 방어합니다 — 대상이 두 번 굴려 높은 것을 사용합니다. 적대...",
    "desc": "<strong>사거리:</strong> 접촉<br><strong>대상:</strong> 생물 1<br><strong>지속 시간:</strong> 1시간<br>여섯 번째 감각이 대상에게 위험을 경고합니다. 자신에게 시전하면 정신 연결로 대상에게 알립니다. 대상은 우선권에 <strong>+2 상태 보너스</strong>를 받으며, 감지되지 않은 생물이나 측면 협공에 의해 <strong>{{condition:Off-Guard}}</strong>가 되지 않습니다. 반응: 적대적 생물이나 위험이 대상을 위협할 때, 예지가 대상을 방어합니다 — 대상이 <strong>두 번 굴려 높은 것을 사용</strong>합니다. 적대적 존재가 대상에 대해 굴리면, <strong>두 번 굴려 낮은 것을 사용</strong>합니다. 행운/불운 특성."
  },
  {
    "id": "implosion",
    "name_ko": "내파",
    "name_en": "Implosion",
    "rank": 9,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "range": "30피트",
    "target": "생물 1",
    "defense": "기본 인내",
    "duration": "유지(최대 1분)",
    "summary": "생물을 내부로 붕괴시킵니다. 75 피해(기본 인내). 유지 시마다 같은 대상이나 새 대상에 같은 효과. 원래 대상은 반복 시 내성에 -1 상황 페널티 누적.강화(10랭크): 피해 100.",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 생물 1<br><strong>방어:</strong> 기본 인내<br><strong>지속 시간:</strong> 유지(최대 1분)<br>생물을 내부로 붕괴시킵니다. <strong>75 피해</strong>(기본 인내). 유지 시마다 같은 대상이나 새 대상에 같은 효과. 원래 대상은 반복 시 내성에 -1 상황 페널티 누적.<br><strong>강화(10랭크):</strong> 피해 100."
  },
  {
    "id": "massacre",
    "name_ko": "대학살",
    "name_en": "Massacre",
    "rank": 9,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "죽음",
      "조작",
      "공허"
    ],
    "area": "60피트 직선",
    "defense": "인내",
    "summary": "죽음의 파도를 발합니다. 영역 내 17레벨 이하의 살아있는 생물은 인내 내성을 시도합니다. 대학살로 인해 생물이 0 HP로 줄어들면 즉시 죽습니다. 대학살이 단 한 생물도 죽이지 못하면, 공허 에너지가 뒤로 돌아와 영역 내 모든 살아있는 생물(17레벨 초과 포함)에게 30 공허 피해, 그리고 시전자에게도 30 공허 피해를 줍니다.대성공: 영향 없음.성...",
    "desc": "<strong>영역:</strong> 60피트 직선<br><strong>방어:</strong> 인내<br>죽음의 파도를 발합니다. 영역 내 17레벨 이하의 살아있는 생물은 인내 내성을 시도합니다. 대학살로 인해 생물이 0 HP로 줄어들면 즉시 죽습니다. 대학살이 단 한 생물도 죽이지 못하면, 공허 에너지가 뒤로 돌아와 영역 내 모든 살아있는 생물(17레벨 초과 포함)에게 <strong>30 공허 피해</strong>, 그리고 시전자에게도 <strong>30 공허 피해</strong>를 줍니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> <strong>9d6 공허 피해</strong>.<br><strong>실패:</strong> <strong>100 공허 피해</strong>.<br><strong>대실패:</strong> 생물이 죽습니다.<br><strong>강화(10랭크):</strong> 19레벨 이하까지 영향. 성공 시 피해 10d6, 실패 시 115로 증가."
  },
  {
    "id": "metamorphosis",
    "name_ko": "변형",
    "name_en": "Metamorphosis",
    "rank": 9,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "duration": "1분",
    "summary": "변환 마법의 달인으로서 형태 속에 또 다른 형태를 숨깁니다. 주문 목록에 있거나 8랭크 이하로 준비 가능한 모든 변신형(polymorph) 주문이 부여하는 형태로 변신할 수 있습니다(8랭크 이하 상향된 버전 포함). 해당 형태에서 일반적으로 얻는 임시 HP 대신 임시 HP 40을 얻습니다.",
    "desc": "<strong>지속 시간:</strong> 1분<br>변환 마법의 달인으로서 형태 속에 또 다른 형태를 숨깁니다. 주문 목록에 있거나 8랭크 이하로 준비 가능한 모든 변신형(polymorph) 주문이 부여하는 형태로 변신할 수 있습니다(8랭크 이하 상향된 버전 포함). 해당 형태에서 일반적으로 얻는 임시 HP 대신 <strong>임시 HP 40</strong>을 얻습니다."
  },
  {
    "id": "overwhelming-presence",
    "name_ko": "압도적 존재",
    "name_en": "Overwhelming Presence",
    "rank": 9,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "청각",
      "무력화",
      "조작",
      "정신",
      "시각"
    ],
    "area": "40피트 폭발",
    "defense": "의지",
    "summary": "신의 위엄을 취합니다. 영역 내 적이 의지 내성 시도. 실패 시 매 턴 첫 행동을 절하기(엎드리기)에 사용해야 합니다(1분). 대실패 시 추가로 기절 1.",
    "desc": "<strong>영역:</strong> 40피트 폭발<br><strong>방어:</strong> 의지<br>신의 위엄을 취합니다. 영역 내 적이 의지 내성 시도. 실패 시 <strong>매 턴 첫 행동을 절하기(엎드리기)에 사용</strong>해야 합니다(1분). 대실패 시 추가로 <strong>기절 1</strong>."
  },
  {
    "id": "phantasmagoria",
    "name_ko": "환상 공포증",
    "name_en": "Phantasmagoria",
    "rank": 9,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "공포",
      "환영",
      "조작",
      "정신"
    ],
    "range": "120피트",
    "area": "30피트 폭발",
    "defense": "의지",
    "summary": "겁먹게 하고 정신 피해를 주며 대상을 죽일 수도 있습니다. 16d6 정신 피해. 공포 1(성공), 공포 2(실패), 공포 3+도주(대실패). 대실패 시 피해가 0 HP로 만들면 공포로 사망.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>영역:</strong> 30피트 폭발<br><strong>방어:</strong> 의지<br>겁먹게 하고 정신 피해를 주며 대상을 죽일 수도 있습니다. <strong>16d6 정신 피해</strong>. 공포 1(성공), 공포 2(실패), 공포 3+도주(대실패). 대실패 시 피해가 0 HP로 만들면 <strong>공포로 사망</strong>."
  },
  {
    "id": "seize-soul",
    "name_ko": "영혼 포획",
    "name_en": "Seize Soul",
    "rank": 9,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "반응",
    "traits": [
      "비일반",
      "조작"
    ],
    "range": "30피트",
    "target": "최근 1분 이내 사망한 생물 1",
    "duration": "무제한",
    "summary": "필요 조건: 대상 레벨 × 100gp 이상의 아이템영혼을 아이템에 가둡니다. 아이템은 AC 16이며 일반 경도/HP를 가집니다. 포획된 동안 부활 불가. 이미 영혼이 담긴 아이템에 두 번째 시전 시 아이템 파괴 또는 다른 아이템으로 이전(유물이거나 19레벨 이상이면 실패).",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>대상:</strong> 최근 1분 이내 사망한 생물 1<br><strong>지속 시간:</strong> 무제한<br><strong>필요 조건:</strong> 대상 레벨 × 100gp 이상의 아이템<br>영혼을 아이템에 가둡니다. 아이템은 AC 16이며 일반 경도/HP를 가집니다. 포획된 동안 부활 불가. 이미 영혼이 담긴 아이템에 두 번째 시전 시 아이템 파괴 또는 다른 아이템으로 이전(유물이거나 19레벨 이상이면 실패)."
  },
  {
    "id": "storm-lord",
    "name_ko": "폭풍 군주",
    "name_en": "Storm Lord",
    "rank": 9,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "공기",
      "전기",
      "조작"
    ],
    "area": "100피트 발산",
    "duration": "유지(최대 1분)",
    "requirements": "야외이며 지상에 있어야 합니다.",
    "summary": "머리 위 하늘이 순식간에 어두워지며, 번개가 번쩍이는 불길한 구름이 소용돌이칩니다. 주문을 시전할 때와 이후 매 턴 처음 유지할 때, 영역에서 발생할 다음 폭풍 효과 중 하나를 선택합니다. 같은 효과를 연속 두 번 선택할 수 없습니다.고요: 추가 효과 없음.안개: 안개(mist)의 효과로 짙은 안개가 낀다.비: 억수같은 비가 내려 일반 불꽃을 끕니다....",
    "desc": "<strong>영역:</strong> 100피트 발산<br><strong>지속 시간:</strong> 유지(최대 1분)<br><strong>요구사항:</strong> 야외이며 지상에 있어야 합니다.<br>머리 위 하늘이 순식간에 어두워지며, 번개가 번쩍이는 불길한 구름이 소용돌이칩니다. 주문을 시전할 때와 이후 매 턴 처음 유지할 때, 영역에서 발생할 다음 폭풍 효과 중 하나를 선택합니다. 같은 효과를 연속 두 번 선택할 수 없습니다.<br><strong>고요:</strong> 추가 효과 없음.<br><strong>안개:</strong> <em>{{spell:Mist}}</em>의 효과로 짙은 안개가 낀다.<br><strong>비:</strong> 억수같은 비가 내려 일반 불꽃을 끕니다. 영역 내 생물은 곡예와 지각 판정에 <strong>-2 상황 페널티</strong>.<br><strong>바람:</strong> 강력한 바람이 모든 방향에서 불어닥칩니다. 원거리 공격에 <strong>-4 상황 페널티</strong>. 비행 생물에게 영역은 험지.<br>또한, 라운드당 한 번 단일 행동(집중+조작)으로 사거리 내 볼 수 있는 대상에 번개를 내려칠 수 있습니다. <strong>10d6 전기 피해</strong>(기본 반사). 실패 시 <strong>1라운드 귀머거리</strong>도 적용.<br><strong>강화(+1):</strong> 번개 피해 +1d6, 불타는 공간 피해 +1d6."
  },
  {
    "id": "wails-of-the-damned",
    "name_ko": "저주받은 자의 울부짖음",
    "name_en": "Wails of the Damned",
    "rank": 9,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "청각",
      "조작",
      "공허"
    ],
    "area": "40피트 발산",
    "defense": "인내",
    "summary": "8d10 공허 피해.대성공: 영향 없음. 성공: 전체 피해. 실패: 전체 피해, 소진(drained) 1d4. 대실패: 2배 피해, 소진 4.",
    "desc": "<strong>영역:</strong> 40피트 발산<br><strong>방어:</strong> 인내<br><strong>8d10 공허 피해</strong>.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 전체 피해. <strong>실패:</strong> 전체 피해, {{condition:Drained}} 1d4. <strong>대실패:</strong> 2배 피해, 소진 4."
  },
  {
    "id": "avatar",
    "name_ko": "화신",
    "name_en": "Avatar",
    "rank": 10,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "duration": "1분",
    "summary": "신격의 거대한 전투 화신으로 변신합니다. 크기가 대형이 되고 암시야를 얻습니다. 하나 이상의 명중 굴림(공격 수정치 +33)과 이동 속도를 포함하여 자신의 신격에 의해 결정되는 특수한 공격과 능력을 얻습니다. 변이 주문의 일반적인 규칙이 적용됩니다: 주문을 시전하거나 대부분의 조작 행동을 사용할 수 없으며, 장비는 형태에 흡수됩니다. 각 신격은 고유한...",
    "desc": "<strong>지속 시간:</strong> 1분<br>신격의 거대한 전투 화신으로 변신합니다. 크기가 <strong>대형</strong>이 되고 <strong>암시야</strong>를 얻습니다. 하나 이상의 명중 굴림(공격 수정치 <strong>+33</strong>)과 이동 속도를 포함하여 자신의 신격에 의해 결정되는 특수한 공격과 능력을 얻습니다. 변이 주문의 일반적인 규칙이 적용됩니다: 주문을 시전하거나 대부분의 조작 행동을 사용할 수 없으며, 장비는 형태에 흡수됩니다. 각 신격은 고유한 형태, 이동 속도, 공격 유형, 피해를 제공합니다. GM이 신격의 화신 형태를 결정합니다."
  },
  {
    "id": "cataclysm",
    "name_ko": "대재앙",
    "name_en": "Cataclysm",
    "rank": 10,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "산성",
      "둔기",
      "냉기",
      "전기",
      "화염",
      "조작"
    ],
    "range": "1,000피트",
    "area": "60피트 폭발",
    "defense": "기본 반사",
    "summary": "즉각적이고 파괴적인 대재앙을 불러옵니다. 영역 내 저항을 10 낮게 취급. 모든 생물이 기본 반사 1회로 5종 피해를 동시에 받습니다: 산성 비 3d10, 지진 3d10 둔기, 동결 바람 3d10 냉기, 번개 3d10 전기, 비행 중 돌풍 3d10 둔기, 쓰나미 3d10 둔기(수영 중 2배), 산불 3d10 화염.",
    "desc": "<strong>사거리:</strong> 1,000피트<br><strong>영역:</strong> 60피트 폭발<br><strong>방어:</strong> 기본 반사<br>즉각적이고 파괴적인 대재앙을 불러옵니다. 영역 내 저항을 10 낮게 취급. 모든 생물이 기본 반사 1회로 5종 피해를 동시에 받습니다: 산성 비 3d10, 지진 3d10 둔기, 동결 바람 3d10 냉기, 번개 3d10 전기, 비행 중 돌풍 3d10 둔기, 쓰나미 3d10 둔기(수영 중 2배), 산불 3d10 화염."
  },
  {
    "id": "freeze-time",
    "name_ko": "시간 동결",
    "name_en": "Freeze Time",
    "rank": 10,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "occult"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "summary": "시간을 멈춥니다. 최대 3세트, 각 세트 최대 3행동씩 총 최대 9행동을 취할 수 있습니다. 당신을 대상으로 하거나 영향을 주는 효과만 적용됩니다. 다른 존재는 무적 상태이며, 당신은 다른 존재를 대상으로 삼거나 영향을 줄 수 없습니다.",
    "desc": "시간을 멈춥니다. 최대 3세트, 각 세트 최대 3행동씩 총 <strong>최대 9행동</strong>을 취할 수 있습니다. 당신을 대상으로 하거나 영향을 주는 효과만 적용됩니다. 다른 존재는 무적 상태이며, 당신은 다른 존재를 대상으로 삼거나 영향을 줄 수 없습니다."
  },
  {
    "id": "gate",
    "name_ko": "차원문",
    "name_en": "Gate",
    "rank": 10,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "비일반",
      "조작",
      "순간이동"
    ],
    "range": "120피트",
    "duration": "유지(최대 1분)",
    "summary": "다른 차원으로 가는 균열을 엽니다. 수직으로 서 있는 원형 포탈이 열리며, 반경 40피트입니다. 원하는 차원과 도착 위치를 선택합니다.",
    "desc": "<strong>사거리:</strong> 120피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>다른 차원으로 가는 균열을 엽니다. 수직으로 서 있는 원형 포탈이 열리며, 반경 <strong>40피트</strong>입니다. 원하는 차원과 도착 위치를 선택합니다."
  },
  {
    "id": "indestructibility",
    "name_ko": "무적",
    "name_en": "Indestructibility",
    "rank": 10,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult"
    ],
    "actions": "2행동",
    "traits": [
      "조작"
    ],
    "duration": "1라운드",
    "summary": "잠시 모든 것에 면역이 됩니다. 다음 턴 시작까지 모든 피해와 해로운 효과에 면역.",
    "desc": "<strong>지속 시간:</strong> 1라운드<br>잠시 모든 것에 면역이 됩니다. 다음 턴 시작까지 <strong>모든 피해와 해로운 효과에 면역</strong>."
  },
  {
    "id": "manifestation",
    "name_ko": "발현",
    "name_en": "Manifestation",
    "rank": 10,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "arcane",
      "divine",
      "occult",
      "primal"
    ],
    "actions": "3행동",
    "traits": [
      "조작"
    ],
    "summary": "유연하게 자신의 전통에서 9랭크 주문을 시전합니다. 시전 시 전통 목록에서 9랭크 이하 주문 하나를 선택하여 즉시 시전합니다. 선택한 주문의 모든 규칙을 따릅니다.",
    "desc": "유연하게 자신의 전통에서 9랭크 주문을 시전합니다. 시전 시 전통 목록에서 9랭크 이하 주문 하나를 선택하여 즉시 시전합니다. 선택한 주문의 모든 규칙을 따릅니다."
  },
  {
    "id": "nature-incarnate",
    "name_ko": "자연의 화신",
    "name_en": "Nature Incarnate",
    "rank": 10,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "조작",
      "변이"
    ],
    "duration": "1분",
    "summary": "자연의 궁극적 화신으로 변신합니다. 가루다, 카라킨(세계 거북), 베히모스 등 자연의 가장 강력한 형태 중 하나를 취합니다. 거대 크기, AC=25+레벨, 임시 HP 30, 공격 수정치 +33.",
    "desc": "<strong>지속 시간:</strong> 1분<br>자연의 궁극적 화신으로 변신합니다. 가루다, 카라킨(세계 거북), 베히모스 등 자연의 가장 강력한 형태 중 하나를 취합니다. 거대 크기, AC=25+레벨, 임시 HP 30, 공격 수정치 +33."
  },
  {
    "id": "revival",
    "name_ko": "부흥",
    "name_en": "Revival",
    "rank": 10,
    "is_cantrip": false,
    "is_focus": false,
    "traditions": [
      "divine",
      "primal"
    ],
    "actions": "2행동",
    "traits": [
      "치유",
      "조작",
      "활력"
    ],
    "range": "30피트",
    "duration": "유지(최대 1분)",
    "summary": "영역 내 죽은 생물과 살아있는 생물에게 적용합니다. 살아있는 대상은 10d8+40 HP를 회복합니다. 죽은 대상은 부활(Raise Dead)과 같은 효과/제한으로 일시적으로 되살아나며, 부여된 HP와 동일한 임시 HP를 받습니다. 다른 방법으로 HP 회복이나 임시 HP 획득 불가. 부흥이 끝나면 모든 임시 HP를 잃고 사망합니다. 언데드나 붕괴/죽음 ...",
    "desc": "<strong>사거리:</strong> 30피트<br><strong>지속 시간:</strong> 유지(최대 1분)<br>영역 내 죽은 생물과 살아있는 생물에게 적용합니다. 살아있는 대상은 <strong>10d8+40 HP</strong>를 회복합니다. 죽은 대상은 부활(Raise Dead)과 같은 효과/제한으로 일시적으로 되살아나며, 부여된 HP와 동일한 임시 HP를 받습니다. 다른 방법으로 HP 회복이나 임시 HP 획득 불가. 부흥이 끝나면 모든 임시 HP를 잃고 사망합니다. 언데드나 붕괴/죽음 효과로 죽은 생물은 부활 불가."
  }
];
