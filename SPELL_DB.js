// Pathfinder 2e Player Core — 주문 데이터베이스
// PlayerCore.html 7장 주문에서 자동 생성 (전문 포함)
// Generated: 2026-03-29

const SPELL_DB = [

  // ─── CANTRIPS ───────────────────────────────────────────────

  { name_ko: "부식 폭발", name_en: "Caustic Blast", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["산성", "조작"],
    summary: "큰 산성 덩어리를 던져 즉시 폭발시켜 주변 생물에게 뿌립니다. 영역 내 생물은 기본 반사 내성과 함께 1d8 산성 피해를 받습니다. 대실패 시 1 지속 산성 피해도 받습니다.강화(+2): 초기 피해 +1d8, 대실패...",
    desc: "큰 산성 덩어리를 던져 즉시 폭발시켜 주변 생물에게 뿌립니다. 영역 내 생물은 기본 반사 내성과 함께 <strong>1d8 산성 피해</strong>를 받습니다. 대실패 시 <strong>1 지속 산성 피해</strong>도 받습니다.<br><strong>강화(+2):</strong> 초기 피해 +1d8, 대실패 지속 피해 +1." },

  { name_ko: "달라붙는 얼음", name_en: "Clinging Ice", rank: 1, is_cantrip: true, is_focus: false,
    traditions: [], actions: "1행동", traits: ["냉기", "위치"],
    summary: "서리가 대상에 달라붙습니다. 1d4 냉기 피해(반사). 실패 시 -5피트 이동 속도(1라운드).강화(+2): 피해 +1d4.",
    desc: "서리가 대상에 달라붙습니다. <strong>1d4 냉기 피해</strong>(반사). 실패 시 <strong>-5피트 이동 속도</strong>(1라운드).<br><strong>강화(+2):</strong> 피해 +1d4." },

  { name_ko: "멍하게", name_en: "Daze", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작", "정신", "비치명"],
    summary: "대상의 정신을 흐리게 하여 방심하거나 느리게 만듭니다.대성공: 영향 없음.성공: 대상이 1라운드간 방심(off-guard).실패: 대상이 4 정신 피해를 받고 1라운드간 방심.대실패: 대상이 4 정신 피해를 받고 1...",
    desc: "대상의 정신을 흐리게 하여 방심하거나 느리게 만듭니다.<br><strong>대성공:</strong> 영향 없음.<br><strong>성공:</strong> 대상이 1라운드간 <strong>방심(off-guard)</strong>.<br><strong>실패:</strong> 대상이 <strong>4 정신 피해</strong>를 받고 1라운드간 <strong>방심</strong>.<br><strong>대실패:</strong> 대상이 <strong>4 정신 피해</strong>를 받고 1라운드간 <strong>방심 + 느려짐 1(slowed 1)</strong>.<br><strong>강화(+2):</strong> 피해 +4." },

  { name_ko: "마법 탐지", name_en: "Detect Magic", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["탐지", "조작"],
    summary: "근처에 마법이 있는지 감지합니다. 발산 내에 마법의 존재를 느끼며, 마법의 위치가 아닌 존재만 알게 됩니다. 물체나 생물의 후속 탐지에는 더 구체적인 정보를 제공합니다.강화(3랭크): 비일반 또는 희귀 마법 오라의 ...",
    desc: "근처에 마법이 있는지 감지합니다. 발산 내에 마법의 존재를 느끼며, 마법의 위치가 아닌 존재만 알게 됩니다. 물체나 생물의 후속 탐지에는 더 구체적인 정보를 제공합니다.<br><strong>강화(3랭크):</strong> 비일반 또는 희귀 마법 오라의 학파를 알 수 있습니다.<br><strong>강화(5랭크):</strong> 감지 영역이 60피트로 증가합니다." },

  { name_ko: "비밀 간파", name_en: "Discern Secrets", rank: 1, is_cantrip: true, is_focus: false,
    traditions: [], actions: "1행동", traits: ["위치", "예언", "정신"],
    summary: "대상이 다음 지각, 사회, 기만 판정에 +1 상태 보너스를 얻습니다.",
    desc: "대상이 다음 지각, 사회, 기만 판정에 <strong>+1 상태 보너스</strong>를 얻습니다." },

  { name_ko: "신성 창", name_en: "Divine Lance", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["조작", "영혼"],
    summary: "신성 에너지를 던져 1d4 영혼(spirit) 피해를 가합니다. 신성(holy) 성별화를 가지고 있으면 불경(unholy) 대상에 추가 1d4 피해. 불경 성별화를 가지면 신성 대상에 추가 1d4 피해. 성별화가 없...",
    desc: "신성 에너지를 던져 <strong>1d4 영혼(spirit) 피해</strong>를 가합니다. 신성(holy) 성별화를 가지고 있으면 불경(unholy) 대상에 추가 1d4 피해. 불경 성별화를 가지면 신성 대상에 추가 1d4 피해. 성별화가 없으면 양쪽 모두에 추가 피해 가능.<br><strong>강화(+1):</strong> 피해 +1d4, 추가 피해 +1d4." },

  { name_ko: "전기 호", name_en: "Electric Arc", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["전기", "조작"],
    summary: "번개 호를 발사하여 대상에 1d4 전기 피해를 가합니다. 기본 반사 내성.강화(+1): 피해 +1d4.",
    desc: "번개 호를 발사하여 대상에 <strong>1d4 전기 피해</strong>를 가합니다. 기본 반사 내성.<br><strong>강화(+1):</strong> 피해 +1d4." },

  { name_ko: "사악한 눈", name_en: "Evil Eye", rank: 1, is_cantrip: true, is_focus: false,
    traditions: [], actions: "1행동", traits: ["위치", "저주", "감정", "공포", "정신"],
    summary: "저주의 눈으로 적을 응시합니다. 의지 실패 시 대상이 공포(frightened) 1. 대실패 시 공포 2. 면역을 무시합니다.",
    desc: "저주의 눈으로 적을 응시합니다. 의지 실패 시 대상이 <strong>공포(frightened) 1</strong>. 대실패 시 공포 2. 면역을 무시합니다." },

  { name_ko: "허상", name_en: "Figment", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["환영", "조작"],
    summary: "간단한 청각적 또는 시각적 환영을 만듭니다. 소리만이면 대화를 모방할 수 없고, 이미지라면 5피트 정육면체 안에 맞아야 하며 움직이지 못합니다. 환영은 다른 감각을 만들 수 없습니다. 생물이 환영을 탐색(Seek)하...",
    desc: "간단한 청각적 또는 시각적 환영을 만듭니다. 소리만이면 대화를 모방할 수 없고, 이미지라면 5피트 정육면체 안에 맞아야 하며 움직이지 못합니다. 환영은 다른 감각을 만들 수 없습니다. 생물이 환영을 탐색(Seek)하면 주문 DC에 대한 지각 판정으로 불신할 수 있습니다." },

  { name_ko: "금지의 수호", name_en: "Forbidding Ward", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["조작"],
    summary: "당신 주위에 수호 기호가 빛나며 아군을 보호합니다. 시전 시 30피트 이내의 적 1을 지정합니다. 대상 아군은 해당 적의 공격과 효과에 대해 AC와 내성 굴림에 +1 상태 보너스를 얻습니다.강화(6랭크): 보너스가 ...",
    desc: "당신 주위에 수호 기호가 빛나며 아군을 보호합니다. 시전 시 30피트 이내의 적 1을 지정합니다. 대상 아군은 해당 적의 공격과 효과에 대해 AC와 내성 굴림에 <strong>+1 상태 보너스</strong>를 얻습니다.<br><strong>강화(6랭크):</strong> 보너스가 +2로 증가합니다." },

  { name_ko: "동상", name_en: "Frostbite", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["냉기", "조작"],
    summary: "매서운 추위로 대상에 1d4 냉기 피해를 가합니다. 기본 인내 내성.강화(+1): 피해 +1d4.",
    desc: "매서운 추위로 대상에 <strong>1d4 냉기 피해</strong>를 가합니다. 기본 인내 내성.<br><strong>강화(+1):</strong> 피해 +1d4." },

  { name_ko: "발톱 긁기", name_en: "Gouging Claw", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "변형"],
    summary: "팔을 발톱으로 변형시켜 공격합니다. 주문 명중 굴림을 합니다. 성공 시 1d6 참격 피해를 가합니다. 치명타 시 대상이 1d4 지속 출혈 피해를 받습니다. 피해 유형은 관통으로 변경 가능합니다.강화(+1): 참격 피...",
    desc: "팔을 발톱으로 변형시켜 공격합니다. 주문 명중 굴림을 합니다. 성공 시 <strong>1d6 참격 피해</strong>를 가합니다. 치명타 시 대상이 <strong>1d4 지속 출혈 피해</strong>를 받습니다. 피해 유형은 관통으로 변경 가능합니다.<br><strong>강화(+1):</strong> 참격 피해 +1d6, 지속 출혈 +1d4." },

  { name_ko: "인도", name_en: "Guidance", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["divine", "occult"], actions: "1행동", traits: [],
    summary: "신성한 인도가 하나의 굴림을 향상시킵니다. 대상이 지속 시간 중 하나의 명중 굴림, 기술 판정, 또는 내성 굴림에 +1 상태 보너스를 사용할 수 있습니다. 보너스를 사용하면 주문이 종료됩니다. 생물이 인도를 받으면 ...",
    desc: "신성한 인도가 하나의 굴림을 향상시킵니다. 대상이 지속 시간 중 하나의 명중 굴림, 기술 판정, 또는 내성 굴림에 <strong>+1 상태 보너스</strong>를 사용할 수 있습니다. 보너스를 사용하면 주문이 종료됩니다. 생물이 인도를 받으면 <strong>1시간 동안</strong> 다시 인도의 대상이 될 수 없습니다." },

  { name_ko: "환영의 벽집", name_en: "House of Imaginary Walls", rank: 5, is_cantrip: true, is_focus: false,
    traditions: ["arcane"], actions: "1행동", traits: ["환영", "조작", "시각", "위자드"],
    summary: "보이지 않는 힘의 벽을 만들어 적의 이동을 방해합니다. 10피트×10피트 벽을 세워 불신하지 않은 생물은 통과할 수 없다고 믿습니다(지각 판정으로 불신 가능).",
    desc: "보이지 않는 힘의 벽을 만들어 적의 이동을 방해합니다. 10피트×10피트 벽을 세워 불신하지 않은 생물은 통과할 수 없다고 믿습니다(지각 판정으로 불신 가능)." },

  { name_ko: "점화", name_en: "Ignition", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["화염", "조작"],
    summary: "근접이나 원거리로 대상을 불태웁니다. 주문 명중 굴림을 합니다. 근접 시 2d4 화염 피해, 원거리 시 1d4 화염 피해 + 1d4 지속 화염 피해.강화(+1): 근접 +2d4, 원거리 초기 +1d4.",
    desc: "근접이나 원거리로 대상을 불태웁니다. 주문 명중 굴림을 합니다. 근접 시 <strong>2d4 화염 피해</strong>, 원거리 시 <strong>1d4 화염 피해 + 1d4 지속 화염 피해</strong>.<br><strong>강화(+1):</strong> 근접 +2d4, 원거리 초기 +1d4." },

  { name_ko: "길 알기", name_en: "Know the Way", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["divine", "occult", "primal"], actions: "2행동", traits: ["탐지", "조작"],
    summary: "진북과 시전 시 선택한 다른 위치(이전에 방문한 곳)의 방향을 알게 됩니다. 나침반처럼 작동합니다.강화(3랭크): 해당 위치까지의 대략적 거리도 알 수 있습니다.강화(7랭크): 같은 차원에서 자동으로 해당 위치의 방...",
    desc: "진북과 시전 시 선택한 다른 위치(이전에 방문한 곳)의 방향을 알게 됩니다. 나침반처럼 작동합니다.<br><strong>강화(3랭크):</strong> 해당 위치까지의 대략적 거리도 알 수 있습니다.<br><strong>강화(7랭크):</strong> 같은 차원에서 자동으로 해당 위치의 방향을 알 수 있습니다." },

  { name_ko: "빛", name_en: "Light", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["빛", "조작"],
    summary: "물체가 20피트 반경의 밝은 빛과 추가 20피트의 희미한 빛을 발합니다. 시전 시 빛의 색을 선택합니다. 생물이 들거나 착용하면 해당 물체를 가립니다.강화(4랭크): 물체가 60피트 밝은 빛을 발합니다.",
    desc: "물체가 <strong>20피트 반경의 밝은 빛</strong>과 추가 20피트의 희미한 빛을 발합니다. 시전 시 빛의 색을 선택합니다. 생물이 들거나 착용하면 해당 물체를 가립니다.<br><strong>강화(4랭크):</strong> 물체가 60피트 밝은 빛을 발합니다." },

  { name_ko: "전언", name_en: "Message", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "1행동", traits: ["청각", "언어", "정신"],
    summary: "사거리 내 생물에 속삭임 메시지를 전달합니다. 해당 생물만 들을 수 있으며, 속삭임으로 짧은 답변을 할 수 있습니다.강화(3랭크): 사거리 500피트로 증가.",
    desc: "사거리 내 생물에 속삭임 메시지를 전달합니다. 해당 생물만 들을 수 있으며, 속삭임으로 짧은 답변을 할 수 있습니다.<br><strong>강화(3랭크):</strong> 사거리 500피트로 증가." },

  { name_ko: "운명 조정", name_en: "Nudge Fate", rank: 1, is_cantrip: true, is_focus: false,
    traditions: [], actions: "1행동", traits: ["위치", "예언"],
    summary: "운명의 실을 조정합니다. 대상의 다음 명중 굴림, 기술 판정, 또는 내성 굴림에 +1 상태 보너스.",
    desc: "운명의 실을 조정합니다. 대상의 다음 명중 굴림, 기술 판정, 또는 내성 굴림에 <strong>+1 상태 보너스</strong>." },

  { name_ko: "요술", name_en: "Prestidigitation", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "사소한 마법 트릭을 수행합니다. 음식이나 음료의 맛/냄새/질감 변경, 표면의 먼지나 때 제거, 작은 아이템의 색 변경, 바닥에 메시지나 도안 쓰기 등. 다른 주문의 효과를 복제하거나 기계적 혜택을 줄 수 없습니다.",
    desc: "사소한 마법 트릭을 수행합니다. 음식이나 음료의 맛/냄새/질감 변경, 표면의 먼지나 때 제거, 작은 아이템의 색 변경, 바닥에 메시지나 도안 쓰기 등. 다른 주문의 효과를 복제하거나 기계적 혜택을 줄 수 없습니다." },

  { name_ko: "방패", name_en: "Shield", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "1행동", traits: ["힘"],
    summary: "마법의 힘으로 된 방패를 만듭니다. 다음 턴 시작까지 AC에 +1 상황 보너스를 얻습니다. 방패 막기(Shield Block) 반응이 있으면, 이 마법 방패로도 사용할 수 있습니다. 경도 5이며, 이 방식으로 피해를...",
    desc: "마법의 힘으로 된 방패를 만듭니다. 다음 턴 시작까지 AC에 <strong>+1 상황 보너스</strong>를 얻습니다. 방패 막기(Shield Block) 반응이 있으면, 이 마법 방패로도 사용할 수 있습니다. 경도 5이며, 이 방식으로 피해를 받으면 주문이 종료되고 <strong>10분간 방패를 다시 시전할 수 없습니다</strong>.<br><strong>강화(3랭크):</strong> 경도 10.<br><strong>강화(5랭크):</strong> 경도 15.<br><strong>강화(7랭크):</strong> 경도 20.<br><strong>강화(9랭크):</strong> 경도 25." },

  { name_ko: "밤의 장막", name_en: "Shroud of Night", rank: 1, is_cantrip: true, is_focus: false,
    traditions: [], actions: "1행동", traits: ["어둠", "위치"],
    summary: "어둠의 장막으로 적의 시야를 방해합니다. 의지 실패 시 대상이 눈부심(dazzled)(1라운드). 대실패 시 눈부심(1분).",
    desc: "어둠의 장막으로 적의 시야를 방해합니다. 의지 실패 시 대상이 <strong>눈부심(dazzled)</strong>(1라운드). 대실패 시 눈부심(1분)." },

  { name_ko: "인장", name_en: "Sigil", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "작은 마법 표시를 남깁니다. 표시는 시각적으로 볼 수 있지만, 크기와 어두움 수준을 선택할 수 있어 실질적으로 보이지 않게 만들 수 있습니다. 마법 탐지로 감지됩니다. 주문을 해제하면 인장이 사라집니다.강화(3랭크)...",
    desc: "작은 마법 표시를 남깁니다. 표시는 시각적으로 볼 수 있지만, 크기와 어두움 수준을 선택할 수 있어 실질적으로 보이지 않게 만들 수 있습니다. 마법 탐지로 감지됩니다. 주문을 해제하면 인장이 사라집니다.<br><strong>강화(3랭크):</strong> 인장에 짧은 메시지(최대 10단어)를 포함시킬 수 있습니다." },

  { name_ko: "안정", name_en: "Stabilize", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["divine", "primal"], actions: "2행동", traits: ["치유", "조작", "활력"],
    summary: "활력 에너지가 대상에 흘러들어 빈사 상태를 안정시킵니다. 대상의 빈사 수치가 0이 되고 안정(stabilized)됩니다. 대상이 HP를 회복하거나 의식을 되찾지는 못합니다.",
    desc: "활력 에너지가 대상에 흘러들어 빈사 상태를 안정시킵니다. 대상의 빈사 수치가 0이 되고 <strong>안정(stabilized)</strong>됩니다. 대상이 HP를 회복하거나 의식을 되찾지는 못합니다." },

  { name_ko: "심장 격려", name_en: "Stoke the Heart", rank: 1, is_cantrip: true, is_focus: false,
    traditions: [], actions: "1행동", traits: ["감정", "위치"],
    summary: "아군의 심장에 불을 지펴 전투 의지를 북돋웁니다. 대상이 피해 굴림에 +2 상태 보너스.",
    desc: "아군의 심장에 불을 지펴 전투 의지를 북돋웁니다. 대상이 피해 굴림에 <strong>+2 상태 보너스</strong>." },

  { name_ko: "악기 소환", name_en: "Summon Instrument", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "3행동", traits: ["조작"],
    summary: "당신만 연주할 수 있는 악기 하나를 손에 나타나게 합니다. 악기는 비마법적이며 가치가 없습니다. 해제하거나 놓으면 사라집니다.강화(5랭크): 악기가 질적으로 뛰어나며 공연 판정에 +1 아이템 보너스.",
    desc: "당신만 연주할 수 있는 악기 하나를 손에 나타나게 합니다. 악기는 비마법적이며 가치가 없습니다. 해제하거나 놓으면 사라집니다.<br><strong>강화(5랭크):</strong> 악기가 질적으로 뛰어나며 공연 판정에 +1 아이템 보너스." },

  { name_ko: "덩굴 묶기", name_en: "Tangle Vine", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "식물"],
    summary: "덩굴을 소환하여 적을 얽어맵니다. 대상이 반사 내성에 실패하면 5피트 끌려오고 다음 탈출할 때까지 이동 불가(immobilized). 대실패 시 넘어뜨려짐(prone)과 이동 불가.강화(2랭크): 실패 시 대상이 방...",
    desc: "덩굴을 소환하여 적을 얽어맵니다. 대상이 반사 내성에 실패하면 <strong>5피트 끌려오고</strong> 다음 탈출할 때까지 <strong>이동 불가(immobilized)</strong>. 대실패 시 <strong>넘어뜨려짐(prone)과 이동 불가</strong>.<br><strong>강화(2랭크):</strong> 실패 시 대상이 방심(off-guard)도 됩니다.<br><strong>강화(4랭크):</strong> 실패 시 대상이 10피트 끌려옵니다." },

  { name_ko: "염동 손", name_en: "Telekinetic Hand", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작"],
    summary: "떠다니는 마법의 손으로 물체를 움직입니다. 유지 시 물체를 20피트 이동시킬 수 있습니다(어떤 방향이든). 물체를 공격에 사용할 수 없습니다.강화(3랭크): 1 부피 이하의 물체를 움직일 수 있습니다.강화(5랭크):...",
    desc: "떠다니는 마법의 손으로 물체를 움직입니다. 유지 시 물체를 20피트 이동시킬 수 있습니다(어떤 방향이든). 물체를 공격에 사용할 수 없습니다.<br><strong>강화(3랭크):</strong> 1 부피 이하의 물체를 움직일 수 있습니다.<br><strong>강화(5랭크):</strong> 사거리 60피트, 1 부피까지.<br><strong>강화(7랭크):</strong> 사거리 60피트, 2 부피까지." },

  { name_ko: "염동 투사", name_en: "Telekinetic Projectile", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작"],
    summary: "물체를 염동력으로 발사하여 적에게 날립니다. 주문 명중 굴림을 합니다. 성공 시 1d6 둔기, 관통, 또는 참격 피해(발사한 물체에 적합한 유형, 시전 시 선택)를 가합니다.강화(+1): 피해 +1d6.",
    desc: "물체를 염동력으로 발사하여 적에게 날립니다. 주문 명중 굴림을 합니다. 성공 시 <strong>1d6 둔기, 관통, 또는 참격 피해</strong>(발사한 물체에 적합한 유형, 시전 시 선택)를 가합니다.<br><strong>강화(+1):</strong> 피해 +1d6." },

  { name_ko: "활력 채찍", name_en: "Vitality Lash", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["divine", "primal"], actions: "2행동", traits: ["조작", "활력"],
    summary: "활력 에너지로 언데드를 채찍질합니다. 대상에 1d4 활력 피해를 가합니다. 기본 인내 내성. 실패 시 약화(enfeebled) 1도 1라운드간.강화(+1): 피해 +1d4.",
    desc: "활력 에너지로 언데드를 채찍질합니다. 대상에 <strong>1d4 활력 피해</strong>를 가합니다. 기본 인내 내성. 실패 시 <strong>약화(enfeebled) 1도 1라운드간</strong>.<br><strong>강화(+1):</strong> 피해 +1d4." },

  { name_ko: "공허 왜곡", name_en: "Void Warp", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작", "공허"],
    summary: "공허 에너지로 산 것을 피해입히고 약화시킵니다. 대상에 1d4 공허 피해를 가합니다. 기본 인내 내성. 실패 시 약화 1도 1라운드간.강화(+1): 피해 +1d4.",
    desc: "공허 에너지로 산 것을 피해입히고 약화시킵니다. 대상에 <strong>1d4 공허 피해</strong>를 가합니다. 기본 인내 내성. 실패 시 <strong>약화 1도 1라운드간</strong>.<br><strong>강화(+1):</strong> 피해 +1d4." },

  { name_ko: "야생의 말", name_en: "Wilding Word", rank: 1, is_cantrip: true, is_focus: false,
    traditions: ["primal"], actions: "1행동", traits: ["드루이드"],
    summary: "자연 생물에게 간단한 메시지를 전달합니다. 복잡한 개념은 전달할 수 없지만, 기본적인 의도(위험, 안전, 먹이 등)를 전달할 수 있습니다.",
    desc: "자연 생물에게 간단한 메시지를 전달합니다. 복잡한 개념은 전달할 수 없지만, 기본적인 의도(위험, 안전, 먹이 등)를 전달할 수 있습니다." },


  // ─── REGULAR SPELLS (1~10랭크) ────────────────────────────

  { name_ko: "공기 방울", name_en: "Air Bubble", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "primal"], actions: "반응", traits: ["조작"],
    summary: "대상의 머리 주위에 공기 주머니를 만들어 물속이나 공기가 없는 환경에서 정상적으로 호흡할 수 있게 합니다.",
    desc: "대상의 머리 주위에 공기 주머니를 만들어 물속이나 공기가 없는 환경에서 정상적으로 호흡할 수 있게 합니다." },

  { name_ko: "개미 운반", name_en: "Ant Haul", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작"],
    summary: "대상의 최대 운반 부피를 결정할 때 근력 수정치가 3 높은 것처럼 취급합니다.",
    desc: "대상의 최대 운반 부피를 결정할 때 근력 수정치가 <strong>3 높은 것</strong>처럼 취급합니다." },

  { name_ko: "재앙", name_en: "Bane", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["조작", "정신"],
    summary: "적의 마음을 의심으로 채웁니다. 영역 내 적이 의지 실패 시 명중 굴림에 -1 상태 페널티. 유지 시 반경 +10피트, 새 적에게 내성 요구. 축복(bless)을 상쇄 가능.",
    desc: "적의 마음을 의심으로 채웁니다. 영역 내 적이 의지 실패 시 공격 굴림에 <strong>-1 상태 페널티</strong>. 유지 시 반경 +10피트, 새 적에게 내성 요구. 축복(bless)을 상쇄 가능." },

  { name_ko: "축복", name_en: "Bless", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["조작", "정신"],
    summary: "아군(자신 포함) 명중 굴림에 +1 상태 보너스. 유지 시 반경 +10피트. 재앙(bane)을 상쇄 가능.",
    desc: "아군(자신 포함) 공격 굴림에 <strong>+1 상태 보너스</strong>. 유지 시 반경 +10피트. 재앙(bane)을 상쇄 가능." },

  { name_ko: "불 뿜기", name_en: "Breathe Fire", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["화염", "조작"],
    summary: "2d6 화염 피해. 기본 반사. 강화(+1): +2d6.",
    desc: "<strong>2d6 화염 피해</strong>. 기본 반사. <strong>강화(+1):</strong> +2d6." },

  { name_ko: "매혹", name_en: "Charm", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult", "primal"], actions: "2행동", traits: ["감정", "무력화", "조작", "정신", "은밀"],
    summary: "최근 위협/적대 시 의지에 +4 상황 보너스. 적대 행동 시 종료.대성공: 영향 없음+인지. 성공: 영향 없음. 실패: 태도 우호적, 적대 불가. 대실패: 태도 도움, 적대 불가.강화(4랭크): 다음 일일 준비까지....",
    desc: "최근 위협/적대 시 의지에 +4 상황 보너스. 적대 행동 시 종료.<br>" },

  { name_ko: "음식 정화", name_en: "Cleanse Cuisine", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["divine", "primal"], actions: "2행동", traits: ["조작"],
    summary: "영역 내 모든 음식과 음료를 맛있는 음식으로 변환합니다. 물을 와인이나 다른 고급 음료로, 음식의 맛과 재료를 미식가 수준으로 향상. 독소와 오염물질 제거 가능. 이후 오염, 자연 부패, 영양 향상은 불가.강화(+2...",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 신성, 원시<br><strong>사거리:</strong> 10피트 | <strong>영역:</strong> 1 세제곱피트<br>영역 내 모든 음식과 음료를 맛있는 음식으로 변환합니다. 물을 와인이나 다른 고급 음료로, 음식의 맛과 재료를 미식가 수준으로 향상. 독소와 오염물질 제거 가능. 이후 오염, 자연 부패, 영양 향상은 불가.<br><strong>강화(+2):</strong> 영역에 인접한 1 세제곱피트 추가.</div><br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "명령", name_en: "Command", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["청각", "언어", "조작", "정신"],
    summary: "다가오기/도망치기/놓기/엎드리기/일어서기 중 하나를 명령. 의지 실패 시 다음 턴 첫 행동으로 수행.강화(5랭크): 10 생물. 강화(6랭크): 자유 행동 지정.",
    desc: "다가오기/도망치기/놓기/엎드리기/일어서기 중 하나를 명령. 의지 실패 시 다음 턴 첫 행동으로 수행.<br>" },

  { name_ko: "물 생성", name_en: "Create Water", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "primal"], actions: "2행동", traits: ["조작", "물"],
    summary: "중형 생물 1명이 하루 필요한 2갤런의 깨끗한 물을 만듭니다.",
    desc: "중형 생물 1명이 하루 필요한 <strong>2갤런의 깨끗한 물</strong>을 만듭니다." },

  { name_ko: "독 감지", name_en: "Detect Poison", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["divine", "primal"], actions: "2행동", traits: ["비일반", "탐지", "조작"],
    summary: "생물이 독성인지 또는 물체가 독인지/독이 묻었는지를 탐지합니다. 여러 종류의 독인지, 독의 유형은 알 수 없습니다. 납이나 알코올 같은 물질도 독이므로 다른 독을 가립니다.강화(2랭크): 독의 수와 유형을 알 수 있...",
    desc: "생물이 독성인지 또는 물체가 독인지/독이 묻었는지를 탐지합니다. 여러 종류의 독인지, 독의 유형은 알 수 없습니다. 납이나 알코올 같은 물질도 독이므로 다른 독을 가립니다.<br>" },

  { name_ko: "현란한 색채", name_en: "Dizzying Colors", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["무력화", "조작", "시각"],
    summary: "소용돌이치는 색채가 생물을 눈멀게, 눈부시게, 또는 멍하게 합니다.대성공: 영향 없음. 성공: 1라운드 눈부심(dazzled). 실패: 1라운드 눈멈+1분 눈부심. 대실패: 1라운드 멍해짐(stunned) 1+1분 ...",
    desc: "소용돌이치는 색채가 생물을 눈멀게, 눈부시게, 또는 멍하게 합니다.<br>" },

  { name_ko: "쇠약", name_en: "Enfeeble", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작"],
    summary: "대상의 근력을 빼앗습니다.대성공: 영향 없음. 성공: 약화(enfeebled) 1. 실패: 약화 2. 대실패: 약화 3.",
    desc: "대상의 근력을 빼앗습니다.<br>" },

  { name_ko: "공포", name_en: "Fear", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["감정", "공포", "조작", "정신"],
    summary: "생물을 겁먹게 합니다.대성공: 영향 없음. 성공: 공포(frightened) 1. 실패: 공포 2. 대실패: 공포 3 + 도주(fleeing) 1라운드.강화(3랭크): 30피트 폭발 영역의 모든 생물 대상 가능.",
    desc: "생물을 겁먹게 합니다.<br>" },

  { name_ko: "순발력", name_en: "Fleet Step", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작"],
    summary: "이동 속도에 +30피트 상태 보너스를 얻습니다.",
    desc: "이동 속도에 <strong>+30피트 상태 보너스</strong>를 얻습니다." },

  { name_ko: "힘의 포격", name_en: "Force Barrage", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "1~3행동", traits: ["힘", "조작"],
    summary: "오류 없는 마법 힘의 파편으로 생물을 강타합니다. 1행동 시 1발(1d4+1 힘 피해), 2행동 시 2발, 3행동 시 3발. 각 탄을 같은 대상이나 다른 대상에 배분할 수 있습니다. 명중 굴림 없이 자동 명중.강화(...",
    desc: "오류 없는 마법 힘의 파편으로 생물을 강타합니다. 1행동 시 <strong>1발(1d4+1 힘 피해)</strong>, 2행동 시 <strong>2발</strong>, 3행동 시 <strong>3발</strong>. 각 탄을 같은 대상이나 다른 대상에 배분할 수 있습니다. <strong>공격 굴림 없이 자동 명중.</strong><br>" },

  { name_ko: "부드러운 착지", name_en: "Gentle Landing", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "반응", traits: ["조작"],
    summary: "떨어지는 생물을 구합니다. 대상은 깃털처럼 천천히 분당 60피트로 하강하며, 낙하 피해를 받지 않습니다.",
    desc: "떨어지는 생물을 구합니다. 대상은 깃털처럼 천천히 분당 60피트로 하강하며, <strong>낙하 피해를 받지 않습니다</strong>." },

  { name_ko: "고블린 천연두", name_en: "Goblin Pox", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["질병", "조작"],
    summary: "대상을 고블린 천연두에 감염시킵니다. 인내 실패 시 즉시 구역질(sickened) 1. 고블린 천연두: 최대 단계 3. 1단계: 구역질 1. 2단계: 구역질 1+느려짐 1. 3단계: 구역질 1+느려짐 1(실외에서 다...",
    desc: "대상을 고블린 천연두에 감염시킵니다. 인내 실패 시 즉시 구역질(sickened) 1. <strong>고블린 천연두:</strong> 최대 단계 3. 1단계: 구역질 1. 2단계: 구역질 1+느려짐 1. 3단계: 구역질 1+느려짐 1(실외에서 다른 고블린 천연두 감염자에 전파 가능)." },

  { name_ko: "기름칠", name_en: "Grease", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "2행동", traits: ["조작"],
    summary: "대상이나 영역을 미끄러운 기름으로 덮습니다. 물체에 시전하면 잡고 있는 생물이 반사 내성에 실패 시 물체를 떨어뜨립니다. 영역에 시전하면 험지가 되며, 생물이 이동 시 곡예 판정(주문 DC) 실패하면 넘어뜨려짐.",
    desc: "대상이나 영역을 미끄러운 기름으로 덮습니다. 물체에 시전하면 잡고 있는 생물이 반사 내성에 실패 시 물체를 떨어뜨립니다. 영역에 시전하면 험지가 되며, 생물이 이동 시 곡예 판정(주문 DC) 실패하면 넘어뜨려짐." },

  { name_ko: "암울한 촉수", name_en: "Grim Tendrils", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작", "공허"],
    summary: "직선의 생물에 2d4 공허 피해 + 기본 인내. 실패 시 1 지속 출혈 피해.강화(+1): 피해 +2d4, 지속 출혈 +1.",
    desc: "직선의 생물에 <strong>2d4 공허 피해</strong> + 기본 인내. 실패 시 <strong>1 지속 출혈 피해</strong>.<br>" },

  { name_ko: "돌풍", name_en: "Gust of Wind", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["공기", "조작"],
    summary: "바람이 불을 끄고 물체와 생물을 밀어냅니다. 비마법 화염을 끄고, 중형 이하 생물은 인내 DC에 대해 밀려남. 비행 생물에 더 강하게 영향.",
    desc: "바람이 불을 끄고 물체와 생물을 밀어냅니다. 비마법 화염을 끄고, 중형 이하 생물은 인내 DC에 대해 밀려남. 비행 생물에 더 강하게 영향." },

  { name_ko: "해로움", name_en: "Harm", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "1~3행동", traits: ["조작", "공허"],
    summary: "공허 에너지가 산 것을 해치거나 언데드를 치유합니다. 1행동: 접촉 대상 1, 1d8 피해(산 것에) 또는 회복(언데드에). 2행동: 30피트 사거리 대상 1, 같은 효과. 3행동: 30피트 발산 영역 모든 생물에 ...",
    desc: "공허 에너지가 산 것을 해치거나 언데드를 치유합니다. 1행동: 접촉 대상 1, <strong>1d8 피해</strong>(산 것에) 또는 회복(언데드에). 2행동: 30피트 사거리 대상 1, 같은 효과. 3행동: 30피트 발산 영역 모든 생물에 영향. 산 것에 피해 시 기본 인내. 언데드 치유 시 내성 없음.<br>" },

  { name_ko: "치유", name_en: "Heal", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["divine", "primal"], actions: "1~3행동", traits: ["치유", "조작", "활력"],
    summary: "활력 에너지가 산 것을 치유하거나 언데드를 해칩니다. 1행동: 접촉 대상 1, 1d8 HP 회복(산 것에) 또는 피해(언데드에). 2행동: 30피트 사거리 대상 1, 같은 효과. 3행동: 30피트 발산 영역 모든 생...",
    desc: "활력 에너지가 산 것을 치유하거나 언데드를 해칩니다. 1행동: 접촉 대상 1, <strong>1d8 HP 회복</strong>(산 것에) 또는 피해(언데드에). 2행동: 30피트 사거리 대상 1, 같은 효과. 3행동: 30피트 발산 영역 모든 생물에 영향. 산 것에 회복 시 내성 없음. 언데드에 피해 시 기본 인내.<br>" },

  { name_ko: "수류 밀기", name_en: "Hydraulic Push", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "물"],
    summary: "물의 폭발로 생물에 피해를 주고 밀어냅니다. 3d6 둔기 피해(인내). 실패 시 5피트 밀려남. 대실패 시 10피트 밀려남+넘어뜨려짐.강화(+1): 피해 +2d6.",
    desc: "물의 폭발로 생물에 피해를 주고 밀어냅니다. <strong>3d6 둔기 피해</strong>(인내). 실패 시 5피트 밀려남. 대실패 시 10피트 밀려남+넘어뜨려짐.<br>" },

  { name_ko: "흉조", name_en: "Ill Omen", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "2행동", traits: ["조작", "불운"],
    summary: "불운의 저주를 내립니다. 의지 실패 시 대상의 다음 판정에서 d20을 두 번 굴려 낮은 것을 사용(불운 효과).",
    desc: "<strong>특성:</strong> 집중, 조작, 불운 | <strong>전통:</strong> 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 1라운드<br>불운의 저주를 내립니다. 의지 실패 시 대상의 다음 판정에서 <strong>d20을 두 번 굴려 낮은 것을 사용</strong>(불운 효과).</div>" },

  { name_ko: "환영 변장", name_en: "Illusory Disguise", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["환영", "조작", "시각"],
    summary: "자신을 다른 생물처럼 보이게 합니다. 같은 체형의 생물로만 가능. 키/체중은 약간 변경 가능. 생물이 상호작용하면 지각 판정(주문 DC)으로 불신 가능.강화(2랭크): 다른 체형 가능(극단적이지 않은). 강화(3랭크...",
    desc: "자신을 다른 생물처럼 보이게 합니다. 같은 체형의 생물로만 가능. 키/체중은 약간 변경 가능. 생물이 상호작용하면 지각 판정(주문 DC)으로 불신 가능.<br>" },

  { name_ko: "환영 물체", name_en: "Illusory Object", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["환영", "조작", "시각"],
    summary: "물체의 설득력 있는 환영을 만듭니다. 생물이나 힘은 만들 수 없습니다. 모든 비시각 감각에는 환영이 아님이 드러납니다. 불신 시 흐릿해집니다.강화(2랭크): 영역 40피트 정육면체. 강화(5랭크): 영역 200피트까...",
    desc: "물체의 설득력 있는 환영을 만듭니다. 생물이나 힘은 만들 수 없습니다. 모든 비시각 감각에는 환영이 아님이 드러납니다. 불신 시 흐릿해집니다.<br>" },

  { name_ko: "활력 주입", name_en: "Infuse Vitality", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["조작", "활력"],
    summary: "공격에 활력 에너지를 불어넣어 언데드에 추가 피해를 줍니다. 대상의 타격이 언데드에 추가 1d6 활력 피해를 줍니다.강화(+2): 추가 피해 +1d6.",
    desc: "<strong>특성:</strong> 집중, 조작, 활력 | <strong>전통:</strong> 신성<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 동의 생물 1 | <strong>지속 시간:</strong> 1분<br>공격에 활력 에너지를 불어넣어 언데드에 추가 피해를 줍니다. 대상의 타격이 언데드에 <strong>추가 1d6 활력 피해</strong>를 줍니다.<br><strong>강화(+2):</strong> 추가 피해 +1d6.</div>" },

  { name_ko: "아이템 외관", name_en: "Item Facade", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["환영", "조작", "시각"],
    summary: "대상 아이템을 다른 아이템처럼 보이게 만듭니다. 아이템은 같은 부피(Bulk)를 가진 비마법 아이템의 외형을 취할 수 있지만, 실제보다 품질이 낮거나 더 낡은 것처럼 보입니다(또는 원한다면 부서지지 않을 것처럼 보이...",
    desc: "대상 아이템을 다른 아이템처럼 보이게 만듭니다. 아이템은 같은 부피(Bulk)를 가진 비마법 아이템의 외형을 취할 수 있지만, 실제보다 품질이 낮거나 더 낡은 것처럼 보입니다(또는 원한다면 부서지지 않을 것처럼 보이게 할 수도 있습니다). 아이템과 상호작용하는 성공적인 조작(Interact) 행동 또는 탐색(Seek) 행동은 환영을 불신하기 위한 의지 내성 굴림을 허용합니다.<br>" },

  { name_ko: "도약", name_en: "Jump", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "1행동", traits: ["조작"],
    summary: "인상적인 도약을 합니다. 즉시 높이뛰기 또는 멀리뛰기를 합니다. 운동 판정 대신 주문 명중 굴림을 사용하며, 질주 없이 멀리뛰기가 가능합니다.강화(3랭크): 최대 도약 거리 30피트.",
    desc: "인상적인 도약을 합니다. 즉시 높이뛰기 또는 멀리뛰기를 합니다. 운동 판정 대신 <strong>주문 공격 굴림</strong>을 사용하며, 질주 없이 멀리뛰기가 가능합니다.<br>" },

  { name_ko: "잠금", name_en: "Lock", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작"],
    summary: "자물쇠를 훨씬 열기 어렵게 만듭니다. 도둑질 DC에 +4 상태 보너스를 추가합니다. 열쇠(knock) 주문은 잠금의 랭크에 따라 상쇄를 시도합니다.",
    desc: "자물쇠를 훨씬 열기 어렵게 만듭니다. 도둑질 DC에 <strong>+4 상태 보너스</strong>를 추가합니다. 열쇠(knock) 주문은 잠금의 랭크에 따라 상쇄를 시도합니다." },

  { name_ko: "수선", name_en: "Mending", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "비마법 아이템 하나를 수리합니다. 아이템의 HP를 주문시전 판정 결과만큼 회복시킵니다. 파손(broken) 상태를 해제할 수 있습니다. 완전히 파괴된 아이템은 수리할 수 없습니다.강화(2랭크): 마법 아이템도 수리 ...",
    desc: "비마법 아이템 하나를 수리합니다. 아이템의 HP를 <strong>주문시전 판정 결과만큼</strong> 회복시킵니다. 파손(broken) 상태를 해제할 수 있습니다. 완전히 파괴된 아이템은 수리할 수 없습니다.<br>" },

  { name_ko: "정신 연결", name_en: "Mindlink", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작", "정신"],
    summary: "10분 분량의 정보를 즉시 정신적으로 전달합니다. 한 방향 전송이며, 대상이 당신에게 답하려면 자기 차례에 다시 이 주문을 시전해야 합니다.",
    desc: "<strong>특성:</strong> 집중, 조작, 정신 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 동의 생물 1<br>10분 분량의 정보를 즉시 정신적으로 전달합니다. 한 방향 전송이며, 대상이 당신에게 답하려면 자기 차례에 다시 이 주문을 시전해야 합니다.</div>" },

  { name_ko: "신비 갑옷", name_en: "Mystic Armor", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "마법 갑옷으로 자신을 보호합니다. AC에 +1 아이템 보너스를 얻습니다. 갑옷을 착용하고 있으면 이 주문은 효과가 없습니다.강화(4랭크): AC에 +2 아이템 보너스. 강화(6랭크): +3. 강화(8랭크): +4.",
    desc: "마법 갑옷으로 자신을 보호합니다. AC에 <strong>+1 아이템 보너스</strong>를 얻습니다. 갑옷을 착용하고 있으면 이 주문은 효과가 없습니다.<br>" },

  { name_ko: "해충 형태", name_en: "Pest Form", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "위협적이지 않은 작은 동물로 변신합니다. 작은(Tiny) 크기의 고양이, 곤충, 쥐, 새 등. 전투 불가. 은신에 유용. 달리기 20피트 또는 비행 15피트.강화(4랭크): 1시간. 강화(6랭크): 24시간.",
    desc: "<strong>특성:</strong> 집중, 조작, 변이 | <strong>전통:</strong> 비전, 원시<br><strong>지속 시간:</strong> 10분<br>위협적이지 않은 작은 동물로 변신합니다. 작은(Tiny) 크기의 고양이, 곤충, 쥐, 새 등. 전투 불가. 은신에 유용. 달리기 20피트 또는 비행 15피트.<br><strong>강화(4랭크):</strong> 1시간. <strong>강화(6랭크):</strong> 24시간.</div>" },

  { name_ko: "반려 은닉", name_en: "Pet Cache", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "사역마나 동물 동료를 주머니 차원에 숨깁니다. 해제하거나 지속 시간이 끝나면 즉시 나타납니다.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 신성, 비학, 원시<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 사역마 또는 동물 동료 | <strong>지속 시간:</strong> 8시간<br>사역마나 동물 동료를 주머니 차원에 숨깁니다. 해제하거나 지속 시간이 끝나면 즉시 나타납니다.</div>" },

  { name_ko: "환영 하수인", name_en: "Phantasmal Minion", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "3행동", traits: ["조작", "소환"],
    summary: "인간형의 윤곽을 가진 환영 하수인을 소환합니다. 하수인을 투명하게 만들거나 덧없는 모습으로 만들 수 있지만, 명백히 마법적 효과이며 실제 생물이 아닙니다. 하수인은 일반 하수인 규칙을 따릅니다.",
    desc: "<strong>특성:</strong> 집중, 조작, 소환 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 60피트 | <strong>지속 시간:</strong> 유지<br>인간형의 윤곽을 가진 환영 하수인을 소환합니다. 하수인을 투명하게 만들거나 덧없는 모습으로 만들 수 있지만, 명백히 마법적 효과이며 실제 생물이 아닙니다. 하수인은 일반 하수인 규칙을 따릅니다.</div>" },

  { name_ko: "환영 고통", name_en: "Phantom Pain", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "2행동", traits: ["환영", "조작", "정신"],
    summary: "지속적인 고통으로 구역질을 유발합니다. 2d4 정신 피해+1d4 지속 정신 피해(의지). 지속 피해 받는 동안 구역질(sickened) 1.강화(+1): 초기 +2d4, 지속 +1d4.",
    desc: "<strong>특성:</strong> 집중, 환영, 조작, 정신 | <strong>전통:</strong> 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 1분<br>지속적인 고통으로 구역질을 유발합니다. <strong>2d4 정신 피해</strong>+<strong>1d4 지속 정신 피해</strong>(의지). 지속 피해 받는 동안 <strong>구역질(sickened) 1</strong>.<br><strong>강화(+1):</strong> 초기 +2d4, 지속 +1d4.</div>" },

  { name_ko: "보호", name_en: "Protection", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["조작"],
    summary: "생물의 AC를 올립니다. 대상의 AC에 +1 상태 보너스.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 신성, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>지속 시간:</strong> 1분<br>생물의 AC를 올립니다. 대상의 AC에 <strong>+1 상태 보너스</strong>.</div>" },

  { name_ko: "파쇄 잔해", name_en: "Pummeling Rubble", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["대지", "조작"],
    summary: "돌 원뿔을 발사하여 생물을 때립니다. 2d4 둔기 피해(반사). 실패 시 험지(1라운드)가 됨.강화(+1): 피해 +2d4.",
    desc: "<strong>특성:</strong> 대지, 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>영역:</strong> 15피트 원뿔 | <strong>방어:</strong> 반사<br>돌 원뿔을 발사하여 생물을 때립니다. <strong>2d4 둔기 피해</strong>(반사). 실패 시 <strong>험지(1라운드)</strong>가 됨.<br><strong>강화(+1):</strong> 피해 +2d4.</div>" },

  { name_ko: "문자 몸", name_en: "Runic Body", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "1행동", traits: ["조작"],
    summary: "생물의 비무장 공격에 일시적으로 마법 룬을 적용합니다. 비무장 공격이 +1 무기 강화 룬이 새겨진 것처럼 +1 아이템 보너스를 얻습니다.강화(4랭크): +1 타격 룬 + 속성 룬 1개 효과 추가. 강화(+2 이후):...",
    desc: "생물의 비무장 공격에 일시적으로 마법 룬을 적용합니다. 비무장 공격이 +1 무기 강화 룬이 새겨진 것처럼 <strong>+1 아이템 보너스</strong>를 얻습니다.<br>" },

  { name_ko: "문자 무기", name_en: "Runic Weapon", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "1행동", traits: ["조작"],
    summary: "무기에 일시적으로 마법 룬을 적용합니다. 무기가 +1 무기 강화 룬이 새겨진 것처럼 +1 아이템 보너스를 얻습니다. 이미 룬이 있으면 효과 없음.강화(4랭크): +1 타격 룬 + 속성 룬 1개 추가.",
    desc: "무기에 일시적으로 마법 룬을 적용합니다. 무기가 +1 무기 강화 룬이 새겨진 것처럼 <strong>+1 아이템 보너스</strong>를 얻습니다. 이미 룬이 있으면 효과 없음.<br>" },

  { name_ko: "성소", name_en: "Sanctuary", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["조작"],
    summary: "생물을 공격받지 않도록 보호합니다. 대상을 공격하거나 해치려는 생물은 먼저 의지 내성을 시도해야 합니다. 성공 시 정상 공격 가능, 실패 시 해당 턴에 대상을 공격 불가. 대상이 적대 행동을 하면 주문 종료.",
    desc: "생물을 공격받지 않도록 보호합니다. 대상을 공격하거나 해치려는 생물은 먼저 <strong>의지 내성</strong>을 시도해야 합니다. 성공 시 정상 공격 가능, 실패 시 해당 턴에 대상을 공격 불가. 대상이 적대 행동을 하면 주문 종료." },

  { name_ko: "피해 분담", name_en: "Share Life", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["치유", "조작"],
    summary: "다른 생물이 받을 피해의 절반을 대신 흡수합니다.",
    desc: "<strong>특성:</strong> 집중, 치유, 조작 | <strong>전통:</strong> 신성<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 동의 생물 1 | <strong>지속 시간:</strong> 10분<br>다른 생물이 받을 피해의 절반을 대신 흡수합니다.</div>" },

  { name_ko: "수면", name_en: "Sleep", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["무력화", "조작", "정신"],
    summary: "작은 영역의 생물을 잠재웁니다. 각 생물이 의지 내성 시도.대성공: 영향 없음. 성공: 1라운드 졸림(drowsy, -1 판정). 실패: 무의식(unconscious)으로 잠듬. 흔들거나 피해를 주면 깨어남. 대실패...",
    desc: "작은 영역의 생물을 잠재웁니다. 각 생물이 의지 내성 시도.<br>" },

  { name_ko: "위로", name_en: "Soothe", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "2행동", traits: ["감정", "치유", "조작", "정신"],
    summary: "대상을 치유하고 정신 공격에 대해 강화합니다. 1d10+4 HP 회복. 대상이 다음 정신 효과에 대한 내성에 +2 상태 보너스(1라운드).강화(+1): 회복 +1d10+4.",
    desc: "<strong>특성:</strong> 집중, 감정, 치유, 조작, 정신 | <strong>전통:</strong> 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 동의 생물 1<br>대상을 치유하고 정신 공격에 대해 강화합니다. <strong>1d10+4 HP 회복</strong>. 대상이 다음 정신 효과에 대한 내성에 <strong>+2 상태 보너스</strong>(1라운드).<br><strong>강화(+1):</strong> 회복 +1d10+4.</div>" },

  { name_ko: "거미 독", name_en: "Spider Sting", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "독"],
    summary: "생물에 피해를 주고 거미 독을 감염시킵니다. 1d4 독 피해+거미 독 고통(최대 단계 4: 1d4 독 피해+약화 1).",
    desc: "<strong>특성:</strong> 집중, 조작, 독 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 인내<br>생물에 피해를 주고 거미 독을 감염시킵니다. <strong>1d4 독 피해</strong>+거미 독 고통(최대 단계 4: 1d4 독 피해+약화 1).</div>" },

  { name_ko: "영혼 연결", name_en: "Spirit Link", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["치유", "조작"],
    summary: "자신의 HP를 지속적으로 다른 이에게 전달합니다. 대상이 피해를 받을 때마다, 피해의 절반을 당신이 대신 받습니다(영혼 연결을 통해).",
    desc: "<strong>특성:</strong> 집중, 치유, 조작 | <strong>전통:</strong> 신성, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 동의 생물 1 | <strong>지속 시간:</strong> 10분<br>자신의 HP를 지속적으로 다른 이에게 전달합니다. 대상이 피해를 받을 때마다, 피해의 절반을 당신이 대신 받습니다(영혼 연결을 통해).</div>" },

  { name_ko: "동물 소환", name_en: "Summon Animal", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "3행동", traits: ["조작"],
    summary: "당신을 위해 싸울 동물을 소환합니다. 주문 랭크 -1 이하 레벨의 동물을 소환합니다. 소환된 동물은 하수인 특성을 얻습니다.강화(2랭크): 주문 랭크 이하 레벨. 이후 랭크마다 더 강한 동물 소환 가능.",
    desc: "당신을 위해 싸울 동물을 소환합니다. 주문 랭크 -1 이하 레벨의 동물을 소환합니다. 소환된 동물은 하수인 특성을 얻습니다.<br>" },

  { name_ko: "구조물 소환", name_en: "Summon Construct", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "3행동", traits: ["조작"],
    summary: "구조체를 소환합니다. 주문 랭크 -1 이하 레벨.강화(2랭크 이후): 더 강한 구조체.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전 | <strong>사거리:</strong> 30피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>구조체를 소환합니다. 주문 랭크 -1 이하 레벨.<br><strong>강화(2랭크 이후):</strong> 더 강한 구조체.</div>" },

  { name_ko: "페이 소환", name_en: "Summon Fey", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["occult", "primal"], actions: "3행동", traits: ["조작"],
    summary: "페이를 소환합니다. 주문 랭크 -1 이하 레벨.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비학, 원시 | <strong>사거리:</strong> 30피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>페이를 소환합니다. 주문 랭크 -1 이하 레벨.</div>" },

  { name_ko: "자연 식물 소환", name_en: "Summon Plant or Fungus", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "3행동", traits: ["조작"],
    summary: "식물이나 균류 생물을 소환합니다. 주문 랭크 -1 이하 레벨.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 원시 | <strong>사거리:</strong> 30피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>식물이나 균류 생물을 소환합니다. 주문 랭크 -1 이하 레벨.</div>" },

  { name_ko: "언데드 소환", name_en: "Summon Undead", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "3행동", traits: ["조작"],
    summary: "언데드를 소환합니다. 주문 랭크 -1 이하 레벨.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 신성, 비학 | <strong>사거리:</strong> 30피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>언데드를 소환합니다. 주문 랭크 -1 이하 레벨.</div>" },

  { name_ko: "확실한 타격", name_en: "Sure Strike", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "1행동", traits: [],
    summary: "다음 공격이 특히 정확합니다. 이 턴의 다음 명중 굴림에서 d20을 두 번 굴려 높은 것을 사용(행운 효과).",
    desc: "<strong>특성:</strong> 집중 | <strong>전통:</strong> 비전, 비학<br>다음 공격이 특히 정확합니다. 이 턴의 다음 공격 굴림에서 <strong>d20을 두 번 굴려 높은 것을 사용</strong>(행운 효과).</div>" },

  { name_ko: "순풍", name_en: "Tailwind", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["공기", "조작"],
    summary: "바람이 대상을 밀어줍니다. 이동 속도에 +10피트 상태 보너스.강화(2랭크): +15피트. 강화(3랭크): +20피트.",
    desc: "<strong>특성:</strong> 공기, 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>지속 시간:</strong> 1시간<br>바람이 대상을 밀어줍니다. 이동 속도에 <strong>+10피트 상태 보너스</strong>.<br><strong>강화(2랭크):</strong> +15피트. <strong>강화(3랭크):</strong> +20피트.</div>" },

  { name_ko: "뇌격", name_en: "Thunderstrike", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["전기", "조작", "음파"],
    summary: "벼락을 내려칩니다. 대상에 1d12 전기 피해 + 1d4 음파 피해(기본 반사).강화(+1): 전기 +1d12, 음파 +1d4.",
    desc: "벼락을 내려칩니다. 대상에 <strong>1d12 전기 피해 + 1d4 음파 피해</strong>(기본 반사).<br>" },

  { name_ko: "복화술", name_en: "Ventriloquism", rank: 1, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["청각", "환영", "조작"],
    summary: "목소리를 던집니다. 60피트 이내의 다른 위치에서 목소리가 나오는 것처럼 만듭니다. 지각 판정으로 불신 가능.강화(3랭크): 사거리 500피트.",
    desc: "<strong>특성:</strong> 청각, 집중, 환영, 조작 | <strong>전통:</strong> 비전, 신성, 비학<br><strong>지속 시간:</strong> 10분<br>목소리를 던집니다. 60피트 이내의 다른 위치에서 목소리가 나오는 것처럼 만듭니다. 지각 판정으로 불신 가능.<br><strong>강화(3랭크):</strong> 사거리 500피트.</div>" },

  { name_ko: "산성 집게", name_en: "Acid Grip", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["산성", "조작"],
    summary: "산성 손이 적을 잡고 해칩니다. 대상에 3d6 산성 피해를 가하고 인내 내성을 요구합니다. 유지 시마다 추가 피해를 가합니다.성공: 절반 피해, 주문 종료. 실패: 전체 피해, 조이기(grabbed). 대실패: 2배...",
    desc: "산성 손이 적을 잡고 해칩니다. 대상에 <strong>3d6 산성 피해</strong>를 가하고 인내 내성을 요구합니다. 유지 시마다 추가 피해를 가합니다.<br>" },

  { name_ko: "동물 특성", name_en: "Animal Feature", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["조작", "변형"],
    summary: "동물의 한 가지 특성을 자신에게 부여합니다. 다음 중 하나를 선택: 발톱(1d6 참격 비무장 공격), 수영 속도 20피트, 부정확 후각 30피트, 등반 속도 20피트.강화(4랭크): 2가지 특성 선택 가능.",
    desc: "<strong>특성:</strong> 집중, 조작, 변형 | <strong>전통:</strong> 원시<br><strong>지속 시간:</strong> 10분<br>동물의 한 가지 특성을 자신에게 부여합니다. 다음 중 하나를 선택: 발톱(1d6 참격 비무장 공격), 수영 속도 20피트, 부정확 후각 30피트, 등반 속도 20피트.<br><strong>강화(4랭크):</strong> 2가지 특성 선택 가능.</div>" },

  { name_ko: "동물 형태", name_en: "Animal Form", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "동물 전투 형태로 변신. 중형(일부 대형), AC=16+레벨, 임시 HP 5. 곰, 황소, 고양이, 사슴, 개, 상어, 뱀 등 선택. 각 형태마다 고유 공격과 이동.강화(3랭크): 공격 +14, 피해 +5. 강화(5...",
    desc: "<strong>특성:</strong> 집중, 조작, 변이 | <strong>전통:</strong> 원시<br><strong>지속 시간:</strong> 1분<br>동물 전투 형태로 변신. 중형(일부 대형), AC=16+레벨, 임시 HP 5. 곰, 황소, 고양이, 사슴, 개, 상어, 뱀 등 선택. 각 형태마다 고유 공격과 이동.<br><strong>강화(3랭크):</strong> 공격 +14, 피해 +5. <strong>강화(5랭크):</strong> 거대, 도달 15피트.</div><br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "동물의 메신저", name_en: "Animal Messenger", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["조작"],
    summary: "작은 동물에게 메시지를 맡겨 지정 위치의 지정 대상에게 전달하게 합니다. 동물이 일반 속도로 이동하여 대상에게 도달하면 메시지를 전달합니다.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 원시<br><strong>사거리:</strong> 120피트 | <strong>대상:</strong> 작은(Tiny) 동물 1<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>작은 동물에게 메시지를 맡겨 지정 위치의 지정 대상에게 전달하게 합니다. 동물이 일반 속도로 이동하여 대상에게 도달하면 메시지를 전달합니다.</div><br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "물체 활성화", name_en: "Animate Object", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "2행동", traits: ["조작"],
    summary: "물체에 생명을 불어넣어 이동하게 합니다. 물체가 소형 또는 중형의 활성화된 물체가 되어 하수인으로 행동합니다. 부피에 따라 HP, 공격 수정치, 피해가 결정됩니다.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 비고정 물체 1 | <strong>지속 시간:</strong> 유지(최대 1분)<br>물체에 생명을 불어넣어 이동하게 합니다. 물체가 소형 또는 중형의 <strong>활성화된 물체</strong>가 되어 하수인으로 행동합니다. 부피에 따라 HP, 공격 수정치, 피해가 결정됩니다.</div>" },

  { name_ko: "타오르는 화살", name_en: "Blazing Bolt", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "1~3행동", traits: ["공격", "화염", "조작"],
    summary: "열과 불꽃의 광선. 주문 명중 굴림. 명중 시 2d6 화염 피해, 치명 시 2배. 추가 행동으로 추가 대상(최대 3). 2행동 이상 시 피해 4d6. 다중공격 페널티는 모든 굴림 후 적용.강화(+1): 각 광선 피해...",
    desc: "열과 불꽃의 광선. 주문 공격 굴림. 명중 시 <strong>2d6 화염 피해</strong>, 치명 시 2배. 추가 행동으로 추가 대상(최대 3). 2행동 이상 시 피해 4d6. 다중공격 페널티는 모든 굴림 후 적용.<br>" },

  { name_ko: "혈의 복수", name_en: "Blood Vendetta", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "반응", traits: ["조작"],
    summary: "의지 실패 시 2d6 지속 출혈 피해. 강화(+2): +2d6.",
    desc: "의지 실패 시 <strong>2d6 지속 출혈 피해</strong>. <strong>강화(+2):</strong> +2d6." },

  { name_ko: "흐림", name_en: "Blur", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["환영", "조작"],
    summary: "대상이 은폐(concealed) 상태. DC 5 단순 판정으로 명중 가능. 진실 시야로 무시 가능.",
    desc: "대상이 <strong>은폐(concealed)</strong> 상태. DC 5 단순 판정으로 명중 가능. 진실 시야로 무시 가능." },

  { name_ko: "진정", name_en: "Calm", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["감정", "무력화", "조작", "정신"],
    summary: "대성공: 영향 없음. 성공: 공격에 -1. 실패: 감정 억압, 적대 행동 불가(적대 행동 받으면 종료). 대실패: 실패와 같지만 적대 행동 받아도 종료 안 됨.",
    desc: "<strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 공격에 -1. <strong>실패:</strong> 감정 억압, 적대 행동 불가(적대 행동 받으면 종료). <strong>대실패:</strong> 실패와 같지만 적대 행동 받아도 종료 안 됨." },

  { name_ko: "고통 정화", name_en: "Cleanse Affliction", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult", "primal"], actions: "2행동", traits: ["치유", "조작"],
    summary: "대상의 고통(저주/질병/독) 1개가 1단계 이상이면 단계 1 감소(같은 사례에 1회만).강화(3랭크): 질병/독이면 상쇄 시도. 강화(4랭크): 저주/질병/독 모두 상쇄 시도.",
    desc: "대상의 고통(저주/질병/독) 1개가 1단계 이상이면 <strong>단계 1 감소</strong>(같은 사례에 1회만).<br>" },

  { name_ko: "정신 정화", name_en: "Clear Mind", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult", "primal"], actions: "2행동", traits: ["치유", "조작", "정신"],
    summary: "정신 오염을 몰아냅니다. 도주(fleeing), 공포(frightened), 멍청함(stupefied) 중 하나를 부여하는 효과에 상쇄를 시도합니다. 상쇄 실패해도 랭크이 2 낮았으면 성공했을 경우, 다음 턴 시작까...",
    desc: "<strong>특성:</strong> 집중, 치유, 조작, 정신 | <strong>전통:</strong> 신성, 비학, 원시<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 동의 생물 1<br>정신 오염을 몰아냅니다. 도주(fleeing), 공포(frightened), 멍청함(stupefied) 중 하나를 부여하는 효과에 상쇄를 시도합니다. 상쇄 실패해도 랭크가 2 낮았으면 성공했을 경우, 다음 턴 시작까지 효과를 억압합니다.<br><strong>강화(4랭크):</strong> 혼란(confused), 지배(controlled) 추가. <strong>강화(6랭크):</strong> 운명(doomed) 추가. <strong>강화(8랭크):</strong> 멍해짐(stunned) 추가.</div><br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "어둠", name_en: "Darkness", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "3행동", traits: ["어둠", "조작"],
    summary: "빛이 통과하거나 발산하지 못하는 어둠의 장막을 만듭니다. 영역 내 비마법 광원(횃불, 랜턴)은 빛을 발하지 않으며, 이 주문 랭크 이하의 마법 빛도 억압됩니다. 빛이 통과하지 못하므로 영역 내 생물은 밖을 볼 수 없...",
    desc: "빛이 통과하거나 발산하지 못하는 어둠의 장막을 만듭니다. 영역 내 비마법 광원(횃불, 랜턴)은 빛을 발하지 않으며, 이 주문 랭크 이하의 마법 빛도 억압됩니다. 빛이 통과하지 못하므로 영역 내 생물은 밖을 볼 수 없고, 밖에서는 순수한 어둠의 구체로 보입니다.<br>" },

  { name_ko: "암시야", name_en: "Darkvision", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "어둠에서 초자연적 시야를 부여합니다. 암시야(darkvision)를 얻습니다.강화(3랭크): 사거리 접촉, 동의 생물 1 대상.강화(5랭크): 사거리 접촉, 동의 생물 1, 지속 시간 다음 일일 준비까지.",
    desc: "어둠에서 초자연적 시야를 부여합니다. <strong>암시야(darkvision)</strong>를 얻습니다.<br>" },

  { name_ko: "귀머거리", name_en: "Deafness", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "대상의 청각을 빼앗습니다. 인내 내성 시도 후 1분 면역.대성공: 영향 없음. 성공: 1라운드 귀먹음. 실패: 10분 귀먹음. 대실패: 영구 귀먹음.",
    desc: "대상의 청각을 빼앗습니다. 인내 내성 시도 후 1분 면역.<br>" },

  { name_ko: "마법 해제", name_en: "Dispel Magic", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "주문을 종료하거나 아이템의 마법을 억압합니다. 대상에 대해 상쇄 판정을 시도합니다.",
    desc: "주문을 종료하거나 아이템의 마법을 억압합니다. 대상에 대해 <strong>상쇄 판정</strong>(431페이지)을 시도합니다." },

  { name_ko: "삽입 메시지", name_en: "Embed Message", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작"],
    summary: "물체에 환영 메시지를 남겨 나중에 발동되게 합니다. 시전 시 메시지(최대 25단어)와 발동 조건을 설정합니다. 조건이 충족되면 당신의 환영 이미지가 나타나 메시지를 전합니다.강화(+2): 메시지를 25단어 더 추가 ...",
    desc: "물체에 환영 메시지를 남겨 나중에 발동되게 합니다. 시전 시 메시지(최대 25단어)와 발동 조건을 설정합니다. 조건이 충족되면 당신의 환영 이미지가 나타나 메시지를 전합니다.<br>" },

  { name_ko: "확대", name_en: "Enlarge", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "대상이 한 크기 랭크 증가합니다. 장비도 함께 커집니다. 커진 무기의 피해 주사위가 1 단계 증가합니다. 확장할 공간이 없으면 주문 실패.강화(4랭크): 대상이 두 크기 랭크 증가(최대 거대). 피해 주사위가 2 단...",
    desc: "대상이 <strong>한 크기 등급 증가</strong>합니다. 장비도 함께 커집니다. 커진 무기의 피해 주사위가 1 단계 증가합니다. 확장할 공간이 없으면 주문 실패.<br>" },

  { name_ko: "방해 식물", name_en: "Entangling Flora", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "식물"],
    summary: "식물을 자라게 하여 영역 내 이동을 방해합니다. 영역은 험지가 됩니다. 영역 내에서 턴을 시작하는 각 생물은 반사 내성 시도. 실패 시 이동 불가(immobilized)(탈출 DC = 주문 DC). 대실패 시 넘어뜨...",
    desc: "식물을 자라게 하여 영역 내 이동을 방해합니다. 영역은 <strong>험지</strong>가 됩니다. 영역 내에서 턴을 시작하는 각 생물은 반사 내성 시도. 실패 시 <strong>이동 불가(immobilized)</strong>(탈출 DC = 주문 DC). 대실패 시 넘어뜨려짐+이동 불가." },

  { name_ko: "환경 내구", name_en: "Environmental Endurance", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "primal"], actions: "2행동", traits: ["조작"],
    summary: "극심한 추위나 더위로부터 생물을 보호합니다. 대상은 심한(severe) 이하의 환경 온도 효과를 무시합니다.강화(3랭크): 극심한(extreme) 온도까지 보호. 강화(5랭크): 극한(incredible) 온도까지 ...",
    desc: "극심한 추위나 더위로부터 생물을 보호합니다. 대상은 <strong>심한(severe)</strong> 이하의 환경 온도 효과를 무시합니다.<br>" },

  { name_ko: "영원한 빛", name_en: "Everlight", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "3행동", traits: ["빛", "조작"],
    summary: "당신이 접촉한 보석이 빛을 발하며, 당신이 선택한 색깔로 20피트 반경의 밝은 빛을 (그리고 그 다음 20피트는 희미한 빛을) 발산합니다. 보석이 파괴되면 즉시 주문이 종료됩니다.",
    desc: "당신이 접촉한 보석이 빛을 발하며, 당신이 선택한 색깔로 20피트 반경의 밝은 빛을 (그리고 그 다음 20피트는 희미한 빛을) 발산합니다. 보석이 파괴되면 즉시 주문이 종료됩니다." },

  { name_ko: "거짓 활력", name_en: "False Vitality", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작"],
    summary: "10 임시 HP를 얻습니다. 다른 출처의 임시 HP와 누적되지 않습니다.강화(+1): 임시 HP +5.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>지속 시간:</strong> 8시간<br><strong>10 임시 HP</strong>를 얻습니다. 다른 출처의 임시 HP와 누적되지 않습니다.<br><strong>강화(+1):</strong> 임시 HP +5.</div>" },

  { name_ko: "떠다니는 불꽃", name_en: "Floating Flame", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["화염", "조작"],
    summary: "소환된 불이 당신의 명령에 따라 이동합니다. 5피트 정육면체 크기의 불을 소환하여 유지 시마다 최대 60피트 이동. 불이 생물의 칸을 통과하면 2d4 화염 피해(기본 반사). 한 턴에 같은 생물에 한 번만.강화(+1...",
    desc: "<strong>특성:</strong> 집중, 화염, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 120피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>소환된 불이 당신의 명령에 따라 이동합니다. 5피트 정육면체 크기의 불을 소환하여 유지 시마다 최대 60피트 이동. 불이 생물의 칸을 통과하면 <strong>2d4 화염 피해</strong>(기본 반사). 한 턴에 같은 생물에 한 번만.<br><strong>강화(+1):</strong> 피해 +1d4.</div>" },

  { name_ko: "도마뱀붙이 손잡기", name_en: "Gecko Grip", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작"],
    summary: "생물의 손과 발 전체에 미세한 점착성 털이 돋아나, 거의 모든 표면에서 발판을 확보하게 해줍니다. 대상은 자신의 이동 속도와 동일한 등반 속도를 얻습니다.강화(5랭크): 지속 시간이 1시간으로 늘어납니다.",
    desc: "생물의 손과 발 전체에 미세한 점착성 털이 돋아나, 거의 모든 표면에서 발판을 확보하게 해줍니다. 대상은 자신의 이동 속도와 동일한 등반 속도를 얻습니다.<br>" },

  { name_ko: "유령 운반자", name_en: "Ghostly Carrier", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작"],
    summary: "반물질적 형상을 만들어 접촉 주문을 대신 전달합니다. 형상은 이동 속도 30피트. 유지 시 형상을 이동시키고, 접촉 사거리 주문을 형상의 위치에서 전달 가능.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 30피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>반물질적 형상을 만들어 접촉 주문을 대신 전달합니다. 형상은 이동 속도 30피트. 유지 시 형상을 이동시키고, 접촉 사거리 주문을 형상의 위치에서 전달 가능.</div>" },

  { name_ko: "인간형 형태", name_en: "Humanoid Form", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작", "변이"],
    summary: "인간형 생물의 형태를 취합니다. 중형 또는 소형 인간형의 외모로 변신합니다. 비전투적 변신이며, 공격/능력치는 변하지 않습니다. 불신 가능(지각 DC = 주문 DC).강화(3랭크): 대형 인간형도 가능. 강화(5랭크...",
    desc: "<strong>특성:</strong> 집중, 조작, 변이 | <strong>전통:</strong> 비전, 비학<br><strong>지속 시간:</strong> 10분<br>인간형 생물의 형태를 취합니다. 중형 또는 소형 인간형의 외모로 변신합니다. 비전투적 변신이며, 공격/능력치는 변하지 않습니다. 불신 가능(감지 DC = 주문 DC).<br><strong>강화(3랭크):</strong> 대형 인간형도 가능. <strong>강화(5랭크):</strong> 비인간형 체형도 가능.</div>" },

  { name_ko: "환영 생물", name_en: "Illusory Creature", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["환영", "조작", "시각"],
    summary: "생물의 설득력 있는 환영을 만듭니다. 중형 이하, 유지 시 최대 이동 속도 25피트로 이동 및 몸짓 가능. 상호작용하면 불신 가능(지각 판정 vs 주문 DC). 불신하지 않은 생물은 진짜로 인식.강화(5랭크): 대형...",
    desc: "<strong>특성:</strong> 집중, 환영, 조작, 시각 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 500피트 | <strong>지속 시간:</strong> 유지<br>생물의 설득력 있는 환영을 만듭니다. 중형 이하, 유지 시 최대 이동 속도 25피트로 이동 및 몸짓 가능. 상호작용하면 불신 가능(지각 판정 vs 주문 DC). 불신하지 않은 생물은 진짜로 인식.<br><strong>강화(5랭크):</strong> 대형, 이동 속도 45피트. <strong>강화(8랭크):</strong> 거대, 이동 속도 60피트.</div>" },

  { name_ko: "투명화", name_en: "Invisibility", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["환영", "조작"],
    summary: "생물이 보이지 않게(invisible) 됩니다. 적대 행동(공격 등) 시 주문 종료.강화(4랭크): 지속 시간 1분, 적대 행동 후에도 다음 턴 시작까지 유지.",
    desc: "생물이 <strong>보이지 않게(invisible)</strong> 됩니다. 적대 행동(공격 등) 시 주문 종료.<br>" },

  { name_ko: "열쇠", name_en: "Knock", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작"],
    summary: "문, 자물쇠, 용기를 더 쉽게 열거나 즉시 엽니다. 마법이 아닌 잠금은 DC에 -4. 마법 잠금이면 상쇄를 시도합니다. 모든 잠금 해제 시 자동으로 열립니다.",
    desc: "문, 자물쇠, 용기를 더 쉽게 열거나 즉시 엽니다. 마법이 아닌 잠금은 DC에 <strong>-4</strong>. 마법 잠금이면 상쇄를 시도합니다. 모든 잠금 해제 시 자동으로 열립니다." },

  { name_ko: "웃음 발작", name_en: "Laughing Fit", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["감정", "조작", "정신"],
    summary: "웃음이 생물의 행동을 방해합니다. 의지 실패 시 서투름(clumsy) 2+집중 주문에 DC 5 단순 판정 필요. 대실패 시 추가로 엎드려짐(prone).",
    desc: "<strong>특성:</strong> 집중, 감정, 조작, 정신 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 유지(최대 1분)<br>웃음이 생물의 행동을 방해합니다. 의지 실패 시 <strong>서투름(clumsy) 2</strong>+집중 주문에 DC 5 단순 판정 필요. 대실패 시 추가로 <strong>엎드려짐(prone)</strong>.</div>" },

  { name_ko: "경이로운 탈것", name_en: "Marvelous Mount", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "환상적인 탈것을 소환합니다. 대형 생물로, 이동 속도 40피트. 탈것은 전투에 참여할 수 없으며, 피해를 받으면 즉시 사라집니다.강화(4랭크): 비행 속도 40피트. 강화(6랭크): 이동/비행 속도 80피트.",
    desc: "환상적인 탈것을 소환합니다. 대형 생물로, 이동 속도 40피트. 탈것은 전투에 참여할 수 없으며, 피해를 받으면 즉시 사라집니다.<br>" },

  { name_ko: "안개", name_en: "Mist", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "3행동", traits: ["조작", "물"],
    summary: "안개 구름으로 생물을 숨깁니다. 영역 내의 모든 것이 은폐(concealed) 상태가 됩니다.",
    desc: "안개 구름으로 생물을 숨깁니다. 영역 내의 모든 것이 <strong>은폐(concealed)</strong> 상태가 됩니다." },

  { name_ko: "소음 폭발", name_en: "Noise Blast", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작", "음파"],
    summary: "강력한 소음으로 생물에 피해를 주고 귀먹게 합니다. 4d6 음파 피해(기본 인내). 실패 시 1라운드 귀먹음. 대실패 시 1분 귀먹음.강화(+1): 피해 +2d6.",
    desc: "강력한 소음으로 생물에 피해를 주고 귀먹게 합니다. <strong>4d6 음파 피해</strong>(기본 인내). 실패 시 1라운드 귀먹음. 대실패 시 1분 귀먹음.<br>" },

  { name_ko: "참나무 강인", name_en: "Oaken Resilience", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "식물"],
    summary: "나무의 회복력을 부여하지만 가연성도 함께. 대상의 최대 HP에 +임시 HP 10을 얻고, 밀기/넘어뜨리기에 대한 인내 DC에 +2. 그러나 화염 약점 2.강화(+2): 임시 HP +5, 화염 약점 +1.",
    desc: "<strong>특성:</strong> 집중, 조작, 식물 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>지속 시간:</strong> 10분<br>나무의 회복력을 부여하지만 가연성도 함께. 대상의 최대 HP에 <strong>+임시 HP 10</strong>을 얻고, 밀기/넘어뜨리기에 대한 인내 DC에 +2. 그러나 <strong>화염 약점 2</strong>.<br><strong>강화(+2):</strong> 임시 HP +5, 화염 약점 +1.</div>" },

  { name_ko: "편집증", name_en: "Paranoia", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "2행동", traits: ["무력화", "조작", "정신"],
    summary: "모든 사람이 위협이라고 믿게 합니다. 의지 실패 시 대상이 아군을 적으로 인식합니다. 아군의 치유/버프도 적대 행동으로 취급.강화(6랭크): 최대 5 대상.",
    desc: "<strong>특성:</strong> 집중, 무력화, 조작, 정신 | <strong>전통:</strong> 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 1분<br>모든 사람이 위협이라고 믿게 합니다. 의지 실패 시 대상이 아군을 적으로 인식합니다. 아군의 치유/버프도 적대 행동으로 취급.<br><strong>강화(6랭크):</strong> 최대 5 대상.</div>" },

  { name_ko: "평화로운 안식", name_en: "Peaceful Rest", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "시체가 부패하지 않으며 언데드가 될 수 없습니다.",
    desc: "시체가 부패하지 않으며 언데드가 될 수 없습니다." },

  { name_ko: "에너지 저항", name_en: "Resist Energy", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "한 가지 에너지 유형의 피해로부터 생물을 보호합니다. 산성, 냉기, 전기, 화염, 음파 중 하나를 선택. 대상이 해당 유형에 저항 5를 얻습니다.강화(4랭크): 저항 10, 지속 시간 1시간. 강화(7랭크): 저항 ...",
    desc: "한 가지 에너지 유형의 피해로부터 생물을 보호합니다. 산성, 냉기, 전기, 화염, 음파 중 하나를 선택. 대상이 해당 유형에 <strong>저항 5</strong>를 얻습니다.<br>" },

  { name_ko: "드러내는 빛", name_en: "Revealing Light", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["빛", "조작"],
    summary: "마법의 빛이 영역을 휩쓸어 숨겨진 것을 드러냅니다. 빛의 외양(다채로운 불꽃, 반짝이는 빛 등)을 선택할 수 있습니다. 영향받는 생물은 현혹됨(dazzled) 상태가 됩니다. 투명한 생물이었다면 은폐됨(conceal...",
    desc: "<strong>특성:</strong> 집중, 빛, 조작 | <strong>전통:</strong> 비전, 신성, 비학, 원시<br><strong>사거리:</strong> 120피트 | <strong>영역:</strong> 10피트 폭발 | <strong>방어:</strong> 반사 | <strong>지속 시간:</strong> 다양<br>마법의 빛이 영역을 휩쓸어 숨겨진 것을 드러냅니다. 빛의 외양(다채로운 불꽃, 반짝이는 빛 등)을 선택할 수 있습니다. 영향받는 생물은 <strong>현혹됨(dazzled)</strong> 상태가 됩니다. 투명한 생물이었다면 <strong>은폐됨(concealed)</strong> 상태로 변합니다. 다른 이유로 이미 은폐된 생물은 은폐 상태가 해제됩니다.<br><strong>결정적 성공:</strong> 영향 없음. <strong>성공:</strong> 2라운드. <strong>실패:</strong> 1분. <strong>결정적 실패:</strong> 10분.</div>" },

  { name_ko: "보이지 않는 것 보기", name_en: "See the Unseen", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작", "탐지"],
    summary: "투명한 생물을 당신의 시야에 드러냅니다. 투명 생물이 숨겨짐(hidden)(미탐지가 아닌)으로 취급됩니다. 에테르 생물도 흐릿하게 볼 수 있습니다.강화(5랭크): 투명 생물이 완전히 보임(관측 상태).",
    desc: "<strong>특성:</strong> 집중, 조작, 탐지 | <strong>전통:</strong> 비전, 신성, 비학<br><strong>지속 시간:</strong> 10분<br>투명한 생물을 당신의 시야에 드러냅니다. 투명 생물이 <strong>숨겨짐(hidden)</strong>(미탐지가 아닌)으로 취급됩니다. 에테르 생물도 흐릿하게 볼 수 있습니다.<br><strong>강화(5랭크):</strong> 투명 생물이 완전히 보임(관측 상태).</div>" },

  { name_ko: "나무 형성", name_en: "Shape Wood", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "식물"],
    summary: "나무를 원하는 형태로 변환합니다. 크기는 가공 전과 같아야 합니다. 단순한 형태만 가능(복잡한 움직이는 부품 불가).",
    desc: "<strong>특성:</strong> 집중, 조작, 식물 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 가공되지 않은 나무 조각<br>나무를 원하는 형태로 변환합니다. 크기는 가공 전과 같아야 합니다. 단순한 형태만 가능(복잡한 움직이는 부품 불가).</div>" },

  { name_ko: "분쇄", name_en: "Shatter", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["occult", "primal"], actions: "2행동", traits: ["조작", "음파"],
    summary: "고주파 음파로 물체를 파괴합니다. 2d10 음파 피해(물체의 경도 무시). 착용/보유 물체면 소유자가 기본 인내 내성.강화(+1): 피해 +1d10.",
    desc: "<strong>특성:</strong> 집중, 조작, 음파 | <strong>전통:</strong> 비학, 원시<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 비마법 물체 1 | <strong>방어:</strong> 기본 인내(착용/보유 물체면)<br>고주파 음파로 물체를 파괴합니다. <strong>2d10 음파 피해</strong>(물체의 경도 무시). 착용/보유 물체면 소유자가 기본 인내 내성.<br><strong>강화(+1):</strong> 피해 +1d10.</div>" },

  { name_ko: "축소", name_en: "Shrink", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "동의하는 생물을 작은(Tiny) 크기로 줄입니다. 장비도 함께 줄어듭니다. 무기의 피해 주사위가 감소합니다.",
    desc: "동의하는 생물을 작은(Tiny) 크기로 줄입니다. 장비도 함께 줄어듭니다. 무기의 피해 주사위가 감소합니다." },

  { name_ko: "침묵", name_en: "Silence", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["환영", "조작"],
    summary: "동의하는 생물에서 나오는 모든 소리를 음소거합니다. 대상은 시전에 필요한 발성, 청각 효과 사용 불가.강화(4랭크): 15피트 발산 내 모든 소리를 차단하는 영역으로 변경.",
    desc: "동의하는 생물에서 나오는 모든 소리를 음소거합니다. 대상은 시전에 필요한 발성, 청각 효과 사용 불가.<br>" },

  { name_ko: "건전한 몸", name_en: "Sound Body", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult", "primal"], actions: "2행동", traits: ["치유", "조작"],
    summary: "물리적 상태를 상쇄합니다. 눈멈(blinded), 눈부심(dazzled), 귀먹음(deafened), 쇠약(enfeebled), 구역질(sickened) 중 하나를 부여하는 효과에 상쇄를 시도합니다.강화(4랭크): ...",
    desc: "<strong>특성:</strong> 집중, 치유, 조작 | <strong>전통:</strong> 신성, 비학, 원시<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 동의 생물 1<br>물리적 상태를 상쇄합니다. 눈멈(blinded), 눈부심(dazzled), 귀먹음(deafened), 쇠약(enfeebled), 구역질(sickened) 중 하나를 부여하는 효과에 상쇄를 시도합니다.<br><strong>강화(4랭크):</strong> 서투름(clumsy), 배수(drained) 추가. <strong>강화(6랭크):</strong> 느려짐(slowed) 추가.</div>" },

  { name_ko: "동물과 대화", name_en: "Speak with Animals", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["조작"],
    summary: "동물과 대화할 수 있습니다. 동물이 종의 지능 범위 내에서 대답합니다.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 원시<br><strong>지속 시간:</strong> 10분<br>동물과 대화할 수 있습니다. 동물이 종의 지능 범위 내에서 대답합니다.</div>" },

  { name_ko: "영적 무장", name_en: "Spiritual Armament", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["조작", "성별화", "영혼"],
    summary: "현재 착용하거나 들고 있는 무기 하나의 유령 같은 마법 복제본을 만들어 대상에게 날립니다. 대상의 AC에 주문 명중 굴림을 굴려 명중 시 2d8 피해(급소 공격 시 2배 피해). 피해 유형은 선택한 무기와 동일하며,...",
    desc: "<strong>특성:</strong> 집중, 조작, 성별화, 영혼 | <strong>전통:</strong> 신성, 비학<br><strong>사거리:</strong> 120피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> AC | <strong>지속 시간:</strong> 유지(최대 1분)<br>현재 착용하거나 들고 있는 무기 하나의 유령 같은 마법 복제본을 만들어 대상에게 날립니다. 대상의 AC에 주문 공격 굴림을 굴려 명중 시 <strong>2d8 피해</strong>(급소 공격 시 2배 피해). 피해 유형은 선택한 무기와 동일하며, 영혼 피해가 더 해롭다면 영혼 피해로 대체됩니다. 이 공격은 다중 공격 페널티에 기여합니다. 공격 후 무기는 당신 곁으로 돌아옵니다. 주문을 성별화하면 공격도 성별화됩니다. 유지 시마다 120피트 내 원하는 생물에 다시 공격할 수 있습니다.<br><strong>강화(+2):</strong> 피해 +1d8.</div>" },

  { name_ko: "상태", name_en: "Status", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["탐지", "조작"],
    summary: "동의하는 생물의 위치와 안녕을 추적합니다. 대상의 방향, 대략적 거리, 현재 HP의 대략적 상태(건강/부상/빈사/사망)를 알 수 있습니다.강화(+1): 추가 1 대상.",
    desc: "<strong>특성:</strong> 집중, 탐지, 조작 | <strong>전통:</strong> 신성, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 동의 생물 1 | <strong>지속 시간:</strong> 다음 일일 준비까지<br>동의하는 생물의 위치와 안녕을 추적합니다. 대상의 방향, 대략적 거리, 현재 HP의 대략적 상태(건강/부상/빈사/사망)를 알 수 있습니다.<br><strong>강화(+1):</strong> 추가 1 대상.</div>" },

  { name_ko: "멍청하게", name_en: "Stupefy", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["무력화", "조작", "정신"],
    summary: "대상의 정신을 둔하게 하여 주문시전을 불안정하게 만듭니다. 의지 실패 시 멍청함(stupefied) 2. 대실패 시 멍청함 4.",
    desc: "<strong>특성:</strong> 집중, 무력화, 조작, 정신 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 1분<br>대상의 정신을 둔하게 하여 주문시전을 불안정하게 만듭니다. 의지 실패 시 <strong>멍청함(stupefied) 2</strong>. 대실패 시 멍청함 4.</div>" },

  { name_ko: "정령 소환", name_en: "Summon Elemental", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "3행동", traits: ["조작"],
    summary: "정령을 소환합니다. 주문 랭크 -1 이하 레벨의 정령을 소환합니다.강화(3랭크 이후): 더 강한 정령 소환 가능.",
    desc: "정령을 소환합니다. 주문 랭크 -1 이하 레벨의 정령을 소환합니다.<br>" },

  { name_ko: "안정 발디딤", name_en: "Sure Footing", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult", "primal"], actions: "2행동", traits: ["치유", "조작"],
    summary: "서투름(clumsy), 조이기(grabbed), 마비(paralyzed) 또는 관련 상태를 부여하는 효과에 상쇄를 시도합니다.강화(4랭크): 이동 불가(immobilized), 억제(restrained) 추가. 강화...",
    desc: "<strong>특성:</strong> 집중, 치유, 조작 | <strong>전통:</strong> 신성, 비학, 원시<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 동의 생물 1<br>서투름(clumsy), 조이기(grabbed), 마비(paralyzed) 또는 관련 상태를 부여하는 효과에 상쇄를 시도합니다.<br><strong>강화(4랭크):</strong> 이동 불가(immobilized), 억제(restrained) 추가. <strong>강화(6랭크):</strong> 석화(petrified) 추가.</div>" },

  { name_ko: "염동 기동", name_en: "Telekinetic Maneuver", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작"],
    summary: "생물을 염동력으로 무장 해제(Disarm), 재배치(Reposition), 밀기(Shove), 넘어뜨리기(Trip)합니다. 주문 공격 대신 적절한 기동 판정을 합니다.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 60피트 | <strong>대상:</strong> 생물 1<br>생물을 염동력으로 무장 해제(Disarm), 재배치(Reposition), 밀기(Shove), 넘어뜨리기(Trip)합니다. 주문 공격 대신 적절한 기동 판정을 합니다.</div>" },

  { name_ko: "번역", name_en: "Translate", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "한 가지 언어에 대한 이해를 부여합니다. 시전 시 알고 있는 언어 1개를 선택하여 대상에게 해당 언어를 이해하고 읽을 수 있게 합니다. 말하기는 불가.강화(3랭크): 대상이 해당 언어로 말하기도 가능. 강화(4랭크)...",
    desc: "한 가지 언어에 대한 이해를 부여합니다. 시전 시 알고 있는 언어 1개를 선택하여 대상에게 해당 언어를 이해하고 읽을 수 있게 합니다. 말하기는 불가.<br>" },

  { name_ko: "수중 호흡", name_en: "Water Breathing", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "생물이 물속에서 호흡할 수 있게 합니다.강화(3랭크): 지속 시간 8시간. 강화(4랭크): 다음 일일 준비까지.",
    desc: "생물이 물속에서 호흡할 수 있게 합니다.<br>" },

  { name_ko: "수상 보행", name_en: "Water Walk", rank: 2, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "primal"], actions: "2행동", traits: ["조작", "물"],
    summary: "대상이 물이나 다른 액체의 표면을 걸을 수 있습니다. 원하면 물속으로 들어갈 수 있지만, 그 경우 일반적으로 수영해야 합니다. 이 주문은 수중 호흡을 부여하지 않습니다.강화(4랭크): 사거리 30피트, 지속 시간 1...",
    desc: "<strong>특성:</strong> 집중, 조작, 물 | <strong>전통:</strong> 비전, 신성, 원시<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>지속 시간:</strong> 10분<br>대상이 물이나 다른 액체의 표면을 걸을 수 있습니다. 원하면 물속으로 들어갈 수 있지만, 그 경우 일반적으로 수영해야 합니다. 이 주문은 수중 호흡을 부여하지 않습니다.<br><strong>강화(4랭크):</strong> 사거리 30피트, 지속 시간 1시간, 최대 10 생물 대상.</div>" },

  { name_ko: "수구", name_en: "Aqueous Orb", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "물"],
    summary: "물의 공을 만들어 굴리며, 불을 끄고 생물을 삼킵니다. 10피트 정육면체. 유지 시 30피트까지 이동. 공이 생물을 지나면 반사 내성 실패 시 삼켜짐(조이기 상태). 탈출 DC = 주문 DC. 비마법 화염도 끕니다.",
    desc: "물의 공을 만들어 굴리며, 불을 끄고 생물을 삼킵니다. 10피트 정육면체. 유지 시 30피트까지 이동. 공이 생물을 지나면 반사 내성 실패 시 삼켜짐(조이기 상태). 탈출 DC = 주문 DC. 비마법 화염도 끕니다." },

  { name_ko: "언데드 속박", name_en: "Bind Undead", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작"],
    summary: "힘의 말로 대상을 장악합니다. 하수인 특성을 얻습니다. 당신이나 아군이 적대 행동을 하면 주문 종료.",
    desc: "힘의 말로 대상을 장악합니다. 하수인 특성을 얻습니다. 당신이나 아군이 적대 행동을 하면 주문 종료." },

  { name_ko: "실명", name_en: "Blindness", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["무력화", "조작"],
    summary: "대성공: 영향 없음. 성공: 다음 턴까지 눈멈. 실패: 1분간 눈멈. 대실패: 영구 눈멈. 이후 1분 면역.",
    desc: "<strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 다음 턴까지 눈멈. <strong>실패:</strong> 1분간 눈멈. <strong>대실패:</strong> 영구 눈멈. 이후 1분 면역." },

  { name_ko: "냉기의 어둠", name_en: "Chilling Darkness", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["공격", "냉기", "어둠", "조작", "불경"],
    summary: "불경한 에너지가 스며든 극도로 차가운 어둠의 광선을 발사합니다. 원거리 주문 명중 굴림을 합니다. 광선은 5d6 냉기 피해를 가합니다. 대상이 신성 특성을 지니고 있다면 추가로 5d6 영혼 피해를 가합니다.대성공: ...",
    desc: "불경한 에너지가 스며든 극도로 차가운 어둠의 광선을 발사합니다. 원거리 주문 공격 굴림을 합니다. 광선은 <strong>5d6 냉기 피해</strong>를 가합니다. 대상이 신성 특성을 지니고 있다면 추가로 <strong>5d6 영혼 피해</strong>를 가합니다.<br><br>광선이 마법 빛의 영역을 통과하거나 마법 빛의 영향을 받는 생물을 대상으로 삼는 경우, 냉기의 어둠은 해당 빛을 상쇄하려 시도합니다. 광선이 빛의 영역을 통과하는지 판단할 필요가 있다면, 자신과 주문의 대상 사이에 선을 그어 확인합니다.<br>" },

  { name_ko: "아늑한 오두막", name_en: "Cozy Cabin", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "3행동", traits: ["조작"],
    summary: "악천후로부터 보호된 임시 오두막을 소환합니다. 20피트 정육면체, 최대 10명 수용. 내부는 따뜻하고 건조하며, 비와 바람을 차단합니다. 오두막은 피해를 받지 않지만 마법 해제로 제거 가능.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>시전:</strong> 1분 | <strong>지속 시간:</strong> 12시간<br>악천후로부터 보호된 임시 오두막을 소환합니다. 20피트 정육면체, 최대 10명 수용. 내부는 따뜻하고 건조하며, 비와 바람을 차단합니다. 오두막은 피해를 받지 않지만 마법 해제로 제거 가능.</div><br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "신앙 위기", name_en: "Crisis of Faith", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["조작", "정신"],
    summary: "대상의 신앙을 공격하여 의심과 정신적 혼란을 일으킵니다. 6d6 정신 피해(신성 주문시전자에게는 6d8).대성공: 영향 없음. 성공: 절반 피해. 실패: 전체 피해; 신성 시전자면 멍청함 1(1라운드). 대실패: 2...",
    desc: "<strong>특성:</strong> 집중, 조작, 정신 | <strong>전통:</strong> 신성<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지<br>대상의 신앙을 공격하여 의심과 정신적 혼란을 일으킵니다. <strong>6d6 정신 피해</strong>(신성 주문시전자에게는 6d8).<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 절반 피해. <strong>실패:</strong> 전체 피해; 신성 시전자면 멍청함 1(1라운드). <strong>대실패:</strong> 2배 피해, 멍청함 1(1라운드), 신성 주문 시전 불가(1라운드).<br>자신의 신격 추종자에게 중대한 이유 없이 시전하면 대부분의 신에게 금기(anathema).<br><strong>강화(+1):</strong> 피해 +2d6(또는 신성 시전자에게 +2d8).</div><br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "꿈의 전언", name_en: "Dream Message", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "3행동", traits: ["조작", "정신"],
    summary: "수면 중 꿈에 도착하는 메시지를 보냅니다. 대상이 잠들면 메시지를 꿈에서 받으며, 잠에서 깨어난 후 기억합니다. 대상이 깨어 있으면 메시지는 첫 번째 수면 중에 전달됩니다.강화(4랭크): 대상 8명까지.",
    desc: "수면 중 꿈에 도착하는 메시지를 보냅니다. 대상이 잠들면 메시지를 꿈에서 받으며, 잠에서 깨어난 후 기억합니다. 대상이 깨어 있으면 메시지는 첫 번째 수면 중에 전달됩니다.<br>" },

  { name_ko: "대지 속박", name_en: "Earthbind", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작"],
    summary: "비행 중인 생물을 땅으로 끌어내립니다. 인내 실패 시 비행 속도를 잃고 60피트 하강. 대실패 시 비행 속도를 1분간 잃음. 비행이 마법이 아닌 날개 같은 물리적 수단이면 비행을 완전히 잃지는 않지만 하강합니다.",
    desc: "비행 중인 생물을 땅으로 끌어내립니다. 인내 실패 시 비행 속도를 잃고 60피트 하강. 대실패 시 비행 속도를 1분간 잃음. 비행이 마법이 아닌 날개 같은 물리적 수단이면 비행을 완전히 잃지는 않지만 하강합니다." },

  { name_ko: "매혹", name_en: "Enthrall", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["청각", "감정", "조작"],
    summary: "당신의 연설이 생물을 매혹시킵니다. 의지 실패 시 매혹(fascinated) 상태. 적대 행동을 받으면 자동 종료.",
    desc: "당신의 연설이 생물을 매혹시킵니다. 의지 실패 시 <strong>매혹(fascinated)</strong> 상태. 적대 행동을 받으면 자동 종료." },

  { name_ko: "추적의 잔상", name_en: "Ephemeral Tracking", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["조작", "탐지"],
    summary: "생물의 비물질적 흔적(영혼의 잔재, 정신적 인상)을 추적합니다. 에테르 차원이나 그림자 차원을 통해 이동한 생물도 추적 가능.",
    desc: "<strong>특성:</strong> 집중, 조작, 탐지 | <strong>전통:</strong> 신성, 비학<br><strong>지속 시간:</strong> 1시간<br>생물의 비물질적 흔적(영혼의 잔재, 정신적 인상)을 추적합니다. 에테르 차원이나 그림자 차원을 통해 이동한 생물도 추적 가능.</div>" },

  { name_ko: "지느러미", name_en: "Feet to Fins", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "변형"],
    summary: "생물의 발을 지느러미로 변환합니다. 대상이 수영 속도 = 이동 속도를 얻지만, 지상 이동 속도가 5피트로 줄어듭니다.강화(6랭크): 지상 이동 속도 유지하면서 수영 속도도 얻음.",
    desc: "생물의 발을 지느러미로 변환합니다. 대상이 <strong>수영 속도 = 이동 속도</strong>를 얻지만, 지상 이동 속도가 <strong>5피트</strong>로 줄어듭니다.<br>" },

  { name_ko: "화염구", name_en: "Fireball", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["화염", "조작"],
    summary: "불의 폭발이 영역 내 생물을 태웁니다. 6d6 화염 피해(기본 반사).강화(+1): 피해 +2d6.",
    desc: "불의 폭발이 영역 내 생물을 태웁니다. <strong>6d6 화염 피해</strong>(기본 반사).<br>" },

  { name_ko: "유령 무기", name_en: "Ghostly Weapon", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작"],
    summary: "무기가 무형 생물에 영향을 줄 수 있게 합니다. 무형 생물에 타격 시 전체 피해를 줍니다(보통은 절반).",
    desc: "무기가 무형 생물에 영향을 줄 수 있게 합니다. 무형 생물에 타격 시 <strong>전체 피해</strong>를 줍니다(보통은 절반)." },

  { name_ko: "가속", name_en: "Haste", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "생물의 속도를 높여 더 자주 공격하거나 이동할 수 있게 합니다. 대상이 가속(quickened) 상태가 되어 매 턴 추가 행동 1개를 얻으며, 이 행동은 보폭(Stride) 또는 타격(Strike)에만 사용 가능.강...",
    desc: "생물의 속도를 높여 더 자주 공격하거나 이동할 수 있게 합니다. 대상이 <strong>가속(quickened)</strong> 상태가 되어 매 턴 <strong>추가 행동 1개</strong>를 얻으며, 이 행동은 <strong>보폭(Stride) 또는 타격(Strike)</strong>에만 사용 가능.<br>" },

  { name_ko: "영웅심", name_en: "Heroism", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["조작"],
    summary: "생물의 내면 영웅심을 북돋워 능력을 향상시킵니다. 대상이 명중 굴림, 지각, 기술 판정, 내성 굴림에 +1 상태 보너스를 얻습니다.강화(6랭크): 보너스 +2. 강화(9랭크): 보너스 +3.",
    desc: "생물의 내면 영웅심을 북돋워 능력을 향상시킵니다. 대상이 공격 굴림, 감지, 기술 판정, 내성 굴림에 <strong>+1 상태 보너스</strong>를 얻습니다.<br>" },

  { name_ko: "신성한 빛", name_en: "Holy Light", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["divine", "primal"], actions: "2행동", traits: ["공격", "화염", "신성(한)", "빛", "조작"],
    summary: "신성한 에너지가 깃든 작열하는 빛의 광선을 발사합니다. 원거리 주문 명중 굴림을 합니다. 이 광선은 5d6 화염 피해를 줍니다. 대상이 불경(unholy) 특성을 지니고 있다면, 추가로 5d6 영혼 피해를 줍니다.대...",
    desc: "신성한 에너지가 깃든 작열하는 빛의 광선을 발사합니다. 원거리 주문 공격 굴림을 합니다. 이 광선은 <strong>5d6 화염 피해</strong>를 줍니다. 대상이 불경(unholy) 특성을 지니고 있다면, 추가로 <strong>5d6 영혼 피해</strong>를 줍니다.<br><br>이 빛이 마법적 어둠 영역을 통과하거나 마법적 어둠의 영향을 받는 생물을 대상으로 삼을 경우, 신성한 빛은 그 어둠을 상쇄하려고 시도합니다. 빛이 어둠 영역을 통과하는지 확인해야 한다면, 당신 자신과 주문의 대상 사이에 선을 그어 판단합니다.<br>" },

  { name_ko: "초인지", name_en: "Hypercognition", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "1행동", traits: [],
    summary: "방대한 양의 정보를 순간적으로 회상합니다. 즉시 6회의 지식 회상(Recall Knowledge) 판정을 할 수 있으며(각각 다른 주제), 다중 공격 페널티 등은 적용되지 않습니다.",
    desc: "<strong>특성:</strong> 집중 | <strong>전통:</strong> 비학<br>방대한 양의 정보를 순간적으로 회상합니다. 즉시 <strong>6회의 지식 회상(Recall Knowledge) 판정</strong>을 할 수 있으며(각각 다른 주제), 다중 공격 페널티 등은 적용되지 않습니다.</div>" },

  { name_ko: "최면", name_en: "Hypnotize", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["무력화", "조작", "시각"],
    summary: "변화하는 색채가 생물을 눈부시게 하고 매혹시킵니다. 의지 실패 시 매혹(fascinated). 대실패 시 매혹+멍해짐(stunned) 2.",
    desc: "변화하는 색채가 생물을 눈부시게 하고 매혹시킵니다. 의지 실패 시 <strong>매혹(fascinated)</strong>. 대실패 시 매혹+<strong>멍해짐(stunned) 2</strong>." },

  { name_ko: "곤충 형태", name_en: "Insect Form", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "위험한 거대 곤충으로 변신합니다. 중형, AC=18+레벨, 임시 HP 10. 개미, 딱정벌레, 지네, 사마귀, 거미, 말벌 중 선택.강화(5랭크): 대형, 비행 가능(일부 형태).",
    desc: "<strong>특성:</strong> 집중, 조작, 변이 | <strong>전통:</strong> 원시<br><strong>지속 시간:</strong> 1분<br>위험한 거대 곤충으로 변신합니다. 중형, AC=18+레벨, 임시 HP 10. 개미, 딱정벌레, 지네, 사마귀, 거미, 말벌 중 선택.<br><strong>강화(5랭크):</strong> 대형, 비행 가능(일부 형태).</div>" },

  { name_ko: "부양", name_en: "Levitate", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작"],
    summary: "물체나 생물을 지면에서 몇 피트 띄웁니다. 대상이 10피트 상승하며, 유지 시 턴당 10피트 상승/하강 가능. 수평 이동은 불가(벽이나 천장 등을 밀어서는 가능).",
    desc: "물체나 생물을 지면에서 몇 피트 띄웁니다. 대상이 10피트 상승하며, 유지 시 턴당 10피트 상승/하강 가능. 수평 이동은 불가(벽이나 천장 등을 밀어서는 가능)." },

  { name_ko: "번개줄기", name_en: "Lightning Bolt", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["전기", "조작"],
    summary: "번개가 직선의 모든 생물을 타격합니다. 4d12 전기 피해(기본 반사).강화(+1): 피해 +1d12.",
    desc: "번개가 직선의 모든 생물을 타격합니다. <strong>4d12 전기 피해</strong>(기본 반사).<br>" },

  { name_ko: "위치 탐지", name_en: "Locate", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["비일반", "탐지", "조작"],
    summary: "당신이 찾고 있는 특정 물체나 생물의 방향을 알아냅니다. 이전에 해당 물체나 생물을 본 적이 있다면(이 경우 주문이 현재 위치의 대략적인 방향을 알려줍니다), 또는 대상과 밀접하게 연관된 물체를 가지고 있다면(이 경...",
    desc: "당신이 찾고 있는 특정 물체나 생물의 방향을 알아냅니다. 이전에 해당 물체나 생물을 본 적이 있다면(이 경우 주문이 현재 위치의 대략적인 방향을 알려줍니다), 또는 대상과 밀접하게 연관된 물체를 가지고 있다면(이 경우 그 물체를 집중 매개체로 사용하여 500피트 내의 유사한 생물이나 물체를 찾을 수 있습니다) 이 주문을 사용할 수 있습니다. 대상이 500피트 이상 떨어져 있거나, 희귀하거나 유일한 대상의 경우 10마일 이상 떨어져 있거나, 당신과 같은 차원에 존재하지 않으면 주문이 실패합니다." },

  { name_ko: "미친 원숭이들", name_en: "Mad Monkeys", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["조작"],
    summary: "미친 원숭이 떼를 소환합니다. 유지 시 원숭이를 20피트 이동시킬 수 있습니다. 원숭이가 있는 칸의 적은 2d8 둔기 피해(기본 반사). 원숭이가 물건을 훔치거나 방해할 수도 있습니다.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 원시<br><strong>사거리:</strong> 30피트 | <strong>영역:</strong> 5피트 폭발 | <strong>지속 시간:</strong> 유지(최대 1분)<br>미친 원숭이 떼를 소환합니다. 유지 시 원숭이를 20피트 이동시킬 수 있습니다. 원숭이가 있는 칸의 적은 <strong>2d8 둔기 피해</strong>(기본 반사). 원숭이가 물건을 훔치거나 방해할 수도 있습니다.</div>" },

  { name_ko: "악의의 그림자", name_en: "Malicious Shadow", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "2행동", traits: ["어둠", "조작"],
    summary: "대상의 그림자가 적대적으로 변합니다. 의지 실패 시 대상의 그림자가 매 턴 2d6 공허 피해를 줍니다. 대상이 밝은 빛에서는 피해 2배, 어둠에서는 피해 없음.",
    desc: "<strong>특성:</strong> 어둠, 집중, 조작 | <strong>전통:</strong> 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 유지(최대 1분)<br>대상의 그림자가 적대적으로 변합니다. 의지 실패 시 대상의 그림자가 매 턴 <strong>2d6 공허 피해</strong>를 줍니다. 대상이 밝은 빛에서는 피해 2배, 어둠에서는 피해 없음.</div>" },

  { name_ko: "독심술", name_en: "Mind Reading", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["비일반", "조작", "정신"],
    summary: "생물의 표면 생각을 읽습니다. 의지 실패 시 현재 생각하고 있는 것을 알 수 있습니다. 유지 시 더 깊은 생각을 탐색할 수 있습니다(추가 의지 내성).강화(4랭크): 대상이 인지하지 못함(은밀).",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작, 정신 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 1라운드 또는 유지<br>생물의 표면 생각을 읽습니다. 의지 실패 시 현재 생각하고 있는 것을 알 수 있습니다. 유지 시 더 깊은 생각을 탐색할 수 있습니다(추가 의지 내성).<br><strong>강화(4랭크):</strong> 대상이 인지하지 못함(은밀).</div>" },

  { name_ko: "돌과 하나", name_en: "One with Stone", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["대지", "조작"],
    summary: "돌 속으로 녹아들거나 돌로 변합니다. 돌의 표면에 녹아들면 내부에서 안전하게 숨을 수 있습니다. 돌의 감각으로 외부를 인지할 수 있지만 행동은 불가.",
    desc: "<strong>특성:</strong> 대지, 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>지속 시간:</strong> 10분<br>돌 속으로 녹아들거나 돌로 변합니다. 돌의 표면에 녹아들면 내부에서 안전하게 숨을 수 있습니다. 돌의 감각으로 외부를 인지할 수 있지만 행동은 불가.</div>" },

  { name_ko: "마비", name_en: "Paralyze", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult", "primal"], actions: "2행동", traits: ["무력화", "조작", "정신"],
    summary: "생물을 제자리에 얼려 움직이지 못하게 합니다.대성공: 영향 없음. 성공: 1라운드 멍해짐(stunned) 1. 실패: 마비(paralyzed) 1분(매 턴 끝에 의지 내성으로 탈출 시도). 대실패: 마비 1분(마비를...",
    desc: "생물을 제자리에 얼려 움직이지 못하게 합니다.<br>" },

  { name_ko: "개인 눈보라", name_en: "Personal Blizzard", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["냉기", "조작"],
    summary: "대상 주위에 작은 눈보라가 소용돌이칩니다. 1d6 냉기 피해(반사)+대상이 은폐(concealed)(다른 이에 대해). 유지 시 재피해.강화(+1): 피해 +1d6.",
    desc: "<strong>특성:</strong> 냉기, 집중, 조작 | <strong>전통:</strong> 원시<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 반사 | <strong>지속 시간:</strong> 유지(최대 1분)<br>대상 주위에 작은 눈보라가 소용돌이칩니다. <strong>1d6 냉기 피해</strong>(반사)+대상이 <strong>은폐(concealed)</strong>(다른 이에 대해). 유지 시 재피해.<br><strong>강화(+1):</strong> 피해 +1d6.</div>" },

  { name_ko: "진실의 종", name_en: "Ring of Truth", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["비일반", "조작"],
    summary: "진실이 말해지면 종이 울립니다. 대상이 의도적으로 거짓말을 하면 감지 가능(진실을 말하면 종이 울림). 의지 실패 시 거짓말을 하기 어려워짐(기만 판정에 -4).",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작 | <strong>전통:</strong> 신성, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 10분<br>진실이 말해지면 종이 울립니다. 대상이 의도적으로 거짓말을 하면 감지 가능(진실을 말하면 종이 울림). 의지 실패 시 거짓말을 하기 어려워짐(기만 판정에 -4).</div>" },

  { name_ko: "룬 함정", name_en: "Rune Trap", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "2행동", traits: ["조작"],
    summary: "표면에 마법 룬 함정을 설치합니다. 생물이 밟으면 발동하여 4d8 피해(기본 반사, 산성/냉기/전기/화염 중 선택).강화(+1): 피해 +2d8.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 표면 1 | <strong>지속 시간:</strong> 다음 일일 준비까지<br>표면에 마법 룬 함정을 설치합니다. 생물이 밟으면 발동하여 <strong>4d8 피해</strong>(기본 반사, 산성/냉기/전기/화염 중 선택).<br><strong>강화(+1):</strong> 피해 +2d8.</div>" },

  { name_ko: "안전 통행", name_en: "Safe Passage", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "3행동", traits: ["조작"],
    summary: "영역을 안전하게 이동할 수 있게 합니다. 영역 내 험지와 위험 지형이 무시되며, 영역의 환경 효과가 억압됩니다.",
    desc: "영역을 안전하게 이동할 수 있게 합니다. 영역 내 험지와 위험 지형이 무시되며, 영역의 환경 효과가 억압됩니다." },

  { name_ko: "느리게", name_en: "Slow", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "생물을 느리게 하여 행동을 줄입니다.대성공: 영향 없음. 성공: 1라운드 느려짐(slowed) 1. 실패: 1분간 느려짐 1. 대실패: 1분간 느려짐 2.강화(6랭크): 최대 10 대상.",
    desc: "생물을 느리게 하여 행동을 줄입니다.<br>" },

  { name_ko: "식물과 대화", name_en: "Speak with Plants", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult", "primal"], actions: "2행동", traits: ["조작", "식물"],
    summary: "식물 및 식물 생물과 소통합니다. 식물은 제한적으로 지능이 있으며, 최근 환경 변화나 근처 생물에 대한 정보를 제공할 수 있습니다.강화(6랭크): 식물이 당신을 위해 간단한 작업을 수행합니다.",
    desc: "<strong>특성:</strong> 집중, 조작, 식물 | <strong>전통:</strong> 신성, 비학, 원시<br><strong>지속 시간:</strong> 10분<br>식물 및 식물 생물과 소통합니다. 식물은 제한적으로 지능이 있으며, 최근 환경 변화나 근처 생물에 대한 정보를 제공할 수 있습니다.<br><strong>강화(6랭크):</strong> 식물이 당신을 위해 간단한 작업을 수행합니다.</div>" },

  { name_ko: "흡혈 잔치", name_en: "Vampiric Feast", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작", "공허"],
    summary: "접촉으로 공허 피해를 주고 임시 HP를 얻습니다. 5d6 공허 피해(기본 인내). 대상이 받은 피해만큼 임시 HP(1분 지속, 대상 HP의 절반까지).강화(+1): 피해 +2d6.",
    desc: "<strong>특성:</strong> 집중, 조작, 공허 | <strong>전통:</strong> 비전, 신성, 비학, 원시<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 기본 인내<br>접촉으로 공허 피해를 주고 임시 HP를 얻습니다. <strong>5d6 공허 피해</strong>(기본 인내). 대상이 받은 피해만큼 <strong>임시 HP</strong>(1분 지속, 대상 HP의 절반까지).<br><strong>강화(+1):</strong> 피해 +2d6.</div>" },

  { name_ko: "사생활 장막", name_en: "Veil of Privacy", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["비일반", "조작"],
    summary: "마법적 탐지로부터 생물이나 물체를 보호합니다. 마법 탐지, 투시 등이 대상을 감지할 수 없습니다.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 또는 물체 1 | <strong>지속 시간:</strong> 1시간<br>마법적 탐지로부터 생물이나 물체를 보호합니다. 마법 탐지, 투시 등이 대상을 감지할 수 없습니다.</div>" },

  { name_ko: "가시 벽", name_en: "Wall of Thorns", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "3행동", traits: ["조작", "식물"],
    summary: "가시 덤불의 벽을 키워 통과하는 생물에 피해를 줍니다. 60피트 길이, 10피트 높이, 5피트 두께. 통과 시 3d4 관통 피해(매 5피트마다). 5피트 이동에 5피트 추가 비용.강화(+1): 피해 +1d4.",
    desc: "<strong>특성:</strong> 집중, 조작, 식물 | <strong>전통:</strong> 원시<br><strong>사거리:</strong> 60피트 | <strong>지속 시간:</strong> 1분<br>가시 덤불의 벽을 키워 통과하는 생물에 피해를 줍니다. 60피트 길이, 10피트 높이, 5피트 두께. 통과 시 <strong>3d4 관통 피해</strong>(매 5피트마다). 5피트 이동에 5피트 추가 비용.<br><strong>강화(+1):</strong> 피해 +1d4.</div>" },

  { name_ko: "바람 벽", name_en: "Wall of Wind", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "3행동", traits: ["공기", "조작"],
    summary: "돌풍의 벽을 만들어 이동과 원거리 공격을 방해합니다. 120피트 길이, 20피트 높이. 벽을 통과하는 원거리 공격은 무시(거대 투사체 제외). 벽을 통과하려면 인내 내성(주문 DC). 안개, 가스 등을 분산.",
    desc: "<strong>특성:</strong> 공기, 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 120피트 | <strong>지속 시간:</strong> 1분<br>돌풍의 벽을 만들어 이동과 원거리 공격을 방해합니다. 120피트 길이, 20피트 높이. 벽을 통과하는 원거리 공격은 무시(거대 투사체 제외). 벽을 통과하려면 인내 내성(주문 DC). 안개, 가스 등을 분산.</div>" },

  { name_ko: "열렬한 확신", name_en: "Zealous Conviction", rank: 3, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["감정", "조작", "정신"],
    summary: "불굴의 확신과 열정을 동의하는 생물에 불어넣습니다. 대상이 10 임시 HP를 얻고, 공포(frightened) 및 도주(fleeing)에 대한 내성에 +2 상태 보너스.강화(+1): 임시 HP +3.",
    desc: "<strong>특성:</strong> 감정, 집중, 조작, 정신 | <strong>전통:</strong> 신성<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 최대 10 동의 생물 | <strong>지속 시간:</strong> 10분<br>불굴의 확신과 열정을 동의하는 생물에 불어넣습니다. 대상이 <strong>10 임시 HP</strong>를 얻고, 공포(frightened) 및 도주(fleeing)에 대한 내성에 <strong>+2 상태 보너스</strong>.<br><strong>강화(+1):</strong> 임시 HP +3.</div>" },

  { name_ko: "공중 형태", name_en: "Aerial Form", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "날아다니는 전투 형태로 변신합니다. 중형, AC=18+레벨, 임시 HP 5, 비행 속도 다양. 박쥐, 새, 날벌레, 익룡 중 선택. 공격 수정치 +16, 피해 보너스 +5.강화(5랭크): 대형, 더 높은 능력치. 강...",
    desc: "<strong>특성:</strong> 집중, 조작, 변이 | <strong>전통:</strong> 비전, 원시<br><strong>지속 시간:</strong> 1분<br>날아다니는 전투 형태로 변신합니다. 중형, AC=18+레벨, 임시 HP 5, 비행 속도 다양. 박쥐, 새, 날벌레, 익룡 중 선택. 공격 수정치 +16, 피해 보너스 +5.<br><strong>강화(5랭크):</strong> 대형, 더 높은 능력치. <strong>강화(6랭크):</strong> 용 형태에 접근 가능.</div><br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "혼란", name_en: "Confusion", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["감정", "무력화", "조작", "정신"],
    summary: "대성공: 영향 없음. 성공: 1라운드 혼란. 실패: 1분 혼란. 대실패: 1분 혼란(내성 탈출 불가).강화(8랭크): 30피트 폭발로 모든 생물 대상.",
    desc: "<strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 1라운드 혼란. <strong>실패:</strong> 1분 혼란. <strong>대실패:</strong> 1분 혼란(내성 탈출 불가).<br><strong>강화(8랭크):</strong> 30피트 폭발로 모든 생물 대상." },

  { name_ko: "창조", name_en: "Creation", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작"],
    summary: "마법 에너지에서 임시 물체를 만듭니다. 흙이나 식물 유래 물질(나무, 종이, 벽돌, 돌)이어야 하며 5 세제곱피트 이하. 복잡한 부품 불가, 비용 충족 불가, 귀중 재료 불가. 명백히 임시적이므로 진품으로 속일 수 ...",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>시전:</strong> 1분 | <strong>사거리:</strong> 0피트 | <strong>지속 시간:</strong> 1시간<br>마법 에너지에서 임시 물체를 만듭니다. 흙이나 식물 유래 물질(나무, 종이, 벽돌, 돌)이어야 하며 5 세제곱피트 이하. 복잡한 부품 불가, 비용 충족 불가, 귀중 재료 불가. 명백히 임시적이므로 진품으로 속일 수 없음.<br><strong>강화(5랭크):</strong> 금속 물체 가능.</div><br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "감시 탐지", name_en: "Detect Scrying", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["비일반", "탐지", "조작"],
    summary: "미세한 오라를 읽어 영역 내 투시 효과의 존재를 탐지합니다. 감시 탐지가 투시 효과보다 높은 랭크이면, 투시하는 생물의 모습을 힐끗 보고 대략적 거리와 방향을 알 수 있습니다.강화(6랭크): 지속 시간 다음 일일 준...",
    desc: "미세한 오라를 읽어 영역 내 투시 효과의 존재를 탐지합니다. 감시 탐지가 투시 효과보다 높은 랭크면, 투시하는 생물의 모습을 힐끗 보고 대략적 거리와 방향을 알 수 있습니다.<br>" },

  { name_ko: "공룡 형태", name_en: "Dinosaur Form", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "강력하고 무시무시한 공룡의 대형 동물 전투 형태로 변신합니다. AC=18+레벨, 임시 HP 15, 저광 시야, 부정확 후각 30피트. 공격 수정치 +16, 피해 보너스 +9. 안킬로사우루스, 브론토사우루스, 데이노니...",
    desc: "강력하고 무시무시한 공룡의 대형 동물 전투 형태로 변신합니다. AC=18+레벨, 임시 HP 15, 저광 시야, 부정확 후각 30피트. 공격 수정치 +16, 피해 보너스 +9. 안킬로사우루스, 브론토사우루스, 데이노니쿠스, 스테고사우루스, 트리케라톱스, 티라노사우루스 중 선택. 각 형태마다 고유 공격과 이동 속도.<br>" },

  { name_ko: "해제 구체", name_en: "Dispelling Globe", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["비일반", "조작"],
    summary: "구체에 들어오는 마법을 상쇄합니다. 주문 랭크 이하의 마법 효과가 구체에 들어오면 자동으로 상쇄를 시도합니다. 더 높은 랭크의 효과에는 영향을 주지 않습니다.",
    desc: "구체에 들어오는 마법을 상쇄합니다. 주문 랭크 이하의 마법 효과가 구체에 들어오면 자동으로 상쇄를 시도합니다. 더 높은 랭크의 효과에는 영향을 주지 않습니다." },

  { name_ko: "신성한 분노", name_en: "Divine Wrath", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["조작", "성별화", "영혼"],
    summary: "신성의 분노를 적들에게 쏟아붓습니다. 영역 내 적들에게 인내 내성에 따라 4d10 영혼 피해를 줍니다.대성공: 대상에게 영향 없음.성공: 대상이 절반 피해를 받습니다.실패: 대상이 전체 피해를 받고 구역질(sicke...",
    desc: "신성의 분노를 적들에게 쏟아붓습니다. 영역 내 적들에게 인내 내성에 따라 <strong>4d10 영혼 피해</strong>를 줍니다.<br>" },

  { name_ko: "화염 방패", name_en: "Fire Shield", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["화염", "조작"],
    summary: "불꽃이 당신을 보호합니다. 냉기 저항 5를 얻습니다. 인접 생물이 근접 공격으로 당신에게 피해를 주면 2d6 화염 피해를 받습니다.강화(+2): 냉기 저항 +5, 반사 화염 피해 +1d6.",
    desc: "불꽃이 당신을 보호합니다. <strong>냉기 저항 5</strong>를 얻습니다. 인접 생물이 근접 공격으로 당신에게 피해를 주면 <strong>2d6 화염 피해</strong>를 받습니다.<br>" },

  { name_ko: "깜빡임", name_en: "Flicker", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작", "순간이동"],
    summary: "불규칙하게 순간이동하며 대부분의 피해를 피합니다. 매 턴 시작 시 DC 11 단순 판정. 성공 시 해당 턴에 은폐(concealed) 상태이며, 에테르 차원과 물질 차원 사이를 깜빡입니다.강화(8랭크): DC 6으로...",
    desc: "불규칙하게 순간이동하며 대부분의 피해를 피합니다. 매 턴 시작 시 DC 11 단순 판정. 성공 시 해당 턴에 <strong>은폐(concealed)</strong> 상태이며, 에테르 차원과 물질 차원 사이를 깜빡입니다.<br>" },

  { name_ko: "비행", name_en: "Fly", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "대상에게 비행 속도 = 이동 속도 또는 20피트 중 높은 것을 부여합니다. 주문이 끝나면 떨어집니다.강화(7랭크): 지속 시간 1시간.",
    desc: "대상에게 <strong>비행 속도 = 이동 속도 또는 20피트 중 높은 것</strong>을 부여합니다. 주문이 끝나면 떨어집니다.<br>" },

  { name_ko: "달콤한 말", name_en: "Honeyed Words", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "2행동", traits: ["조작", "정신"],
    summary: "가장 터무니없는 거짓말도 더 믿을 만하게 만듭니다. 기만(Deception) 판정에 +4 상태 보너스를 얻습니다.",
    desc: "<strong>특성:</strong> 집중, 조작, 정신 | <strong>전통:</strong> 비학<br><strong>지속 시간:</strong> 10분<br>가장 터무니없는 거짓말도 더 믿을 만하게 만듭니다. 기만(Deception) 판정에 <strong>+4 상태 보너스</strong>를 얻습니다.</div>" },

  { name_ko: "수류 격류", name_en: "Hydraulic Torrent", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["조작", "물"],
    summary: "강력한 물줄기. 8d6 둔기 피해(인내). 실패 시 5피트 밀려남. 대실패 시 10피트 밀려남+넘어뜨려짐.강화(+1): 피해 +2d6.",
    desc: "<strong>특성:</strong> 집중, 조작, 물 | <strong>전통:</strong> 원시<br><strong>영역:</strong> 60피트 직선 | <strong>방어:</strong> 인내<br>강력한 물줄기. <strong>8d6 둔기 피해</strong>(인내). 실패 시 5피트 밀려남. 대실패 시 10피트 밀려남+넘어뜨려짐.<br><strong>강화(+1):</strong> 피해 +2d6.</div>" },

  { name_ko: "경계의 문", name_en: "Liminal Doorway", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["비일반", "조작", "그림자", "순간이동"],
    summary: "두 장소를 연결하는 그림자 문을 만들어냅니다. 이 주문을 시전할 때 사거리 내의 목표 칸을 선택하여 먼 쪽 위치로 지정하고, 당신에게 인접한 출발 칸을 가까운 쪽 위치로 지정합니다. 당신과 동의하는 다른 생물들은 문...",
    desc: "두 장소를 연결하는 그림자 문을 만들어냅니다. 이 주문을 시전할 때 사거리 내의 목표 칸을 선택하여 먼 쪽 위치로 지정하고, 당신에게 인접한 출발 칸을 가까운 쪽 위치로 지정합니다. 당신과 동의하는 다른 생물들은 문을 통과할 수 있으며, 이는 단 하나의 행동만 필요하고 걷기(Step)로 계산됩니다. 가까운 쪽으로 들어가면 먼 쪽으로 나오며, 먼 쪽으로 들어가면 가까운 쪽으로 나옵니다.<br>" },

  { name_ko: "신기루", name_en: "Mirage", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["비일반", "환영", "조작"],
    summary: "자연 환경 하나를 다른 것으로 위장합니다. 숲을 사막으로, 들판을 늪으로 등. 환경의 물리적 특성은 변하지 않지만 외관이 변합니다. 지각 판정으로 불신 가능.강화(5랭크): 영역 1마일 폭발.",
    desc: "<strong>특성:</strong> 비일반, 집중, 환영, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 500피트 | <strong>영역:</strong> 50피트 폭발 | <strong>지속 시간:</strong> 다음 일일 준비까지<br>자연 환경 하나를 다른 것으로 위장합니다. 숲을 사막으로, 들판을 늪으로 등. 환경의 물리적 특성은 변하지 않지만 외관이 변합니다. 지각 판정으로 불신 가능.<br><strong>강화(5랭크):</strong> 영역 1마일 폭발.</div>" },

  { name_ko: "산의 강인함", name_en: "Mountain Resilience", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작"],
    summary: "생물을 물리적 공격에 더 단단하게 합니다. 대상이 물리 피해에 저항 5를 얻습니다.강화(6랭크): 저항 10. 강화(8랭크): 저항 15.",
    desc: "생물을 물리적 공격에 더 단단하게 합니다. 대상이 <strong>물리 피해에 저항 5</strong>를 얻습니다.<br>" },

  { name_ko: "악몽", name_en: "Nightmare", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작", "정신"],
    summary: "생물의 꿈을 불안한 악몽으로 괴롭힙니다. 대상이 잠들면 악몽을 꿉니다. 의지 실패 시 피로(fatigued)로 깨어나고 4d6 정신 피해. 대실패 시 2배 피해+피로.",
    desc: "생물의 꿈을 불안한 악몽으로 괴롭힙니다. 대상이 잠들면 악몽을 꿉니다. 의지 실패 시 <strong>피로(fatigued)</strong>로 깨어나고 <strong>4d6 정신 피해</strong>. 대실패 시 2배 피해+피로." },

  { name_ko: "추방자의 저주", name_en: "Outcast's Curse", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["저주", "조작", "정신"],
    summary: "생물을 불쾌하고 거슬리게 만드는 저주. 의지 실패 시 대상이 다른 생물과 상호작용할 때 항상 적대적 태도를 유발합니다. 사회적 기술 판정에 -4 상태 페널티. 저주는 상쇄될 때까지 지속.",
    desc: "생물을 불쾌하고 거슬리게 만드는 저주. 의지 실패 시 대상이 다른 생물과 상호작용할 때 항상 적대적 태도를 유발합니다. 사회적 기술 판정에 <strong>-4 상태 페널티</strong>. 저주는 상쇄될 때까지 지속." },

  { name_ko: "평화 방울", name_en: "Peaceful Bubble", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["비일반", "조작"],
    summary: "불투명 방울이 탐지, 꿈, 감지, 투시를 차단합니다. 방울 내부는 외부에서 어떤 마법적 탐지로도 인지할 수 없습니다.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 또는 물체 1 | <strong>지속 시간:</strong> 8시간<br>불투명 방울이 탐지, 꿈, 감지, 투시를 차단합니다. 방울 내부는 외부에서 어떤 마법적 탐지로도 인지할 수 없습니다.</div>" },

  { name_ko: "차원 묶기", name_en: "Planar Tether", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작"],
    summary: "생물을 현재 차원에 묶어둡니다. 의지 실패 시 차원 이동, 순간이동, 소환 제거 등이 불가.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 신성, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 1분<br>생물을 현재 차원에 묶어둡니다. 의지 실패 시 차원 이동, 순간이동, 소환 제거 등이 불가.</div>" },

  { name_ko: "예언 읽기", name_en: "Read Omens", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["비일반", "조작", "예언"],
    summary: "다가오는 사건에 대한 조언 한 조각을 얻습니다. 특정 목표나 사건에 대해 질문하면 GM이 암호적이지만 유용한 4단어 조언을 줍니다.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작, 예언 | <strong>전통:</strong> 신성, 비학<br><strong>시전:</strong> 10분<br>다가오는 사건에 대한 조언 한 조각을 얻습니다. 특정 목표나 사건에 대해 질문하면 GM이 암호적이지만 유용한 4단어 조언을 줍니다.</div>" },

  { name_ko: "기억 재작성", name_en: "Rewrite Memory", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "2행동", traits: ["비일반", "조작", "정신"],
    summary: "기억을 변경, 삭제, 또는 이식합니다. 의지 실패 시 대상의 최근 5분간 기억을 변경 가능.강화(6랭크): 최근 1일까지. 강화(8랭크): 어떤 기억이든.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작, 정신 | <strong>전통:</strong> 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 무제한<br>기억을 변경, 삭제, 또는 이식합니다. 의지 실패 시 대상의 최근 5분간 기억을 변경 가능.<br><strong>강화(6랭크):</strong> 최근 1일까지. <strong>강화(8랭크):</strong> 어떤 기억이든.</div>" },

  { name_ko: "돌 형성", name_en: "Shape Stone", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["대지", "조작"],
    summary: "돌의 정육면체를 재형성합니다. 원하는 형태로 형성 가능(문, 벽, 선반, 조각 등). 움직이는 부품은 단순한 것만 가능(경첩 등).",
    desc: "<strong>특성:</strong> 대지, 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 돌 정육면체(5피트 이하)<br>돌의 정육면체를 재형성합니다. 원하는 형태로 형성 가능(문, 벽, 선반, 조각 등). 움직이는 부품은 단순한 것만 가능(경첩 등).</div>" },

  { name_ko: "암시", name_en: "Suggestion", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["무력화", "언어", "조작", "정신"],
    summary: "생물이 따라야 하는 행동 방침을 암시합니다. 합리적으로 들리는 한 문장 암시. 의지 실패 시 암시를 따릅니다. 자해적이거나 당연히 거부할 암시는 자동 실패.대성공: 영향 없음, 암시 인지. 성공: 영향 없음. 실패:...",
    desc: "생물이 따라야 하는 행동 방침을 암시합니다. 합리적으로 들리는 한 문장 암시. 의지 실패 시 암시를 따릅니다. 자해적이거나 당연히 거부할 암시는 자동 실패.<br>" },

  { name_ko: "시체와 대화", name_en: "Talking Corpse", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["비일반", "조작"],
    summary: "시체가 세 가지 질문에 답합니다. 시체는 살아있을 때 알고 있던 정보만 답하며, 거짓말을 할 수 있습니다(일반적으로 성격에 따라).",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작 | <strong>전통:</strong> 신성, 비학<br><strong>시전:</strong> 10분 | <strong>사거리:</strong> 접촉 | <strong>대상:</strong> 시체 1<br>시체가 세 가지 질문에 답합니다. 시체는 살아있을 때 알고 있던 정보만 답하며, 거짓말을 할 수 있습니다(일반적으로 성격에 따라).</div>" },

  { name_ko: "텔레파시", name_en: "Telepathy", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["언어", "조작", "정신"],
    summary: "30피트 이내의 모든 생물과 텔레파시로 소통합니다. 같은 언어를 공유하지 않아도 의미가 전달됩니다.강화(6랭크): 120피트로 사거리 증가. 강화(8랭크): 모든 거리(같은 차원 내).",
    desc: "30피트 이내의 모든 생물과 텔레파시로 소통합니다. 같은 언어를 공유하지 않아도 의미가 전달됩니다.<br>" },

  { name_ko: "순간이동", name_en: "Translocate", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작", "순간이동"],
    summary: "중간 거리를 순간이동합니다. 최대 120피트까지 볼 수 있는 빈 칸으로 순간이동합니다.강화(5랭크): 사거리 1마일(볼 수 있거나 명확히 지정 가능한 위치).",
    desc: "중간 거리를 순간이동합니다. 최대 <strong>120피트</strong>까지 볼 수 있는 빈 칸으로 순간이동합니다.<br>" },

  { name_ko: "자유 이동", name_en: "Unfettered Movement", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "생물을 제자리에 묶는 효과를 밀어냅니다. 대상이 조이기(grabbed), 이동 불가(immobilized), 억제(restrained)를 무시합니다. 또한 험지를 정상 지형으로 취급합니다.",
    desc: "생물을 제자리에 묶는 효과를 밀어냅니다. 대상이 <strong>조이기(grabbed), 이동 불가(immobilized), 억제(restrained)</strong>를 무시합니다. 또한 험지를 정상 지형으로 취급합니다." },

  { name_ko: "증기 형태", name_en: "Vapor Form", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult", "primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "몸을 증기로 변합니다. 비행 속도 10피트. 작은 틈을 통과 가능. 물리 피해에 저항 8. 주문시전 및 대부분의 행동 불가. 비마법 바람에 밀릴 수 있음.",
    desc: "<strong>특성:</strong> 집중, 조작, 변이 | <strong>전통:</strong> 비전, 비학, 원시<br><strong>지속 시간:</strong> 5분<br>몸을 증기로 변합니다. 비행 속도 10피트. 작은 틈을 통과 가능. 물리 피해에 저항 8. 주문시전 및 대부분의 행동 불가. 비마법 바람에 밀릴 수 있음.</div>" },

  { name_ko: "죽음의 환시", name_en: "Vision of Death", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["공포", "환영", "조작", "정신", "시각"],
    summary: "대상에게 자신의 죽음에 대한 환시를 보여 공포와 정신 피해를 줍니다. 8d6 정신 피해+공포.성공: 절반 피해. 실패: 전체 피해+공포 2. 대실패: 2배 피해+공포 3+도주 1라운드.",
    desc: "<strong>특성:</strong> 집중, 공포, 환영, 조작, 정신, 시각 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 120피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지<br>대상에게 자신의 죽음에 대한 환시를 보여 공포와 정신 피해를 줍니다. <strong>8d6 정신 피해</strong>+공포.<br><strong>성공:</strong> 절반 피해. <strong>실패:</strong> 전체 피해+공포 2. <strong>대실패:</strong> 2배 피해+공포 3+도주 1라운드.</div>" },

  { name_ko: "활력 등대", name_en: "Vital Beacon", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["치유", "조작", "활력"],
    summary: "활력을 발산하여 당신을 접촉하는 생물을 치유합니다. 지속 시간 동안 누군가 당신에게 접촉 치유 주문을 시전하면 추가로 주문 랭크 d10 HP를 회복합니다.",
    desc: "<strong>특성:</strong> 집중, 치유, 조작, 활력 | <strong>전통:</strong> 신성<br><strong>지속 시간:</strong> 다음 일일 준비까지<br>활력을 발산하여 당신을 접촉하는 생물을 치유합니다. 지속 시간 동안 누군가 당신에게 접촉 치유 주문을 시전하면 추가로 <strong>주문 랭크 d10 HP</strong>를 회복합니다.</div>" },

  { name_ko: "화염 벽", name_en: "Wall of Fire", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "3행동", traits: ["화염", "조작"],
    summary: "타오르는 벽을 만들어 통과하는 생물을 태웁니다. 60피트 길이×10피트 높이×1인치 두께. 통과 시 4d6 화염 피해. 벽의 한쪽(시전 시 선택)에 인접한 생물이 턴 시작 시 2d6 화염 피해.강화(+1): 통과 피...",
    desc: "타오르는 벽을 만들어 통과하는 생물을 태웁니다. 60피트 길이×10피트 높이×1인치 두께. 통과 시 <strong>4d6 화염 피해</strong>. 벽의 한쪽(시전 시 선택)에 인접한 생물이 턴 시작 시 2d6 화염 피해.<br>" },

  { name_ko: "무기 폭풍", name_en: "Weapon Storm", rank: 4, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작"],
    summary: "손에 든 무기를 복제하여 많은 생물을 공격합니다. 무기의 피해 주사위를 기반으로 영역 내 모든 생물에 피해(기본 반사).강화(+1): 피해 주사위 +1개.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>영역:</strong> 30피트 원뿔 또는 10피트 폭발 | <strong>방어:</strong> 기본 반사<br>손에 든 무기를 복제하여 많은 생물을 공격합니다. 무기의 피해 주사위를 기반으로 영역 내 모든 생물에 피해(기본 반사).<br><strong>강화(+1):</strong> 피해 주사위 +1개.</div>" },

  { name_ko: "추방", name_en: "Banishment", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["무력화", "조작"],
    summary: "대상을 고향 차원으로 돌려보냅니다. 추가 행동+비용(저주받은 물체)으로 내성에 -2. 자신의 고향 차원에서만 시전 가능.대성공: 저항, 시전자 멍해짐 1. 성공: 저항. 실패: 추방. 대실패: 추방+1주 복귀 불가....",
    desc: "대상을 고향 차원으로 돌려보냅니다. 추가 행동+비용(저주받은 물체)으로 내성에 -2. 자신의 고향 차원에서만 시전 가능.<br>" },

  { name_ko: "생명의 숨결", name_en: "Breath of Life", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "반응", traits: ["치유", "조작", "활력"],
    summary: "사망 순간에 6d8 HP 회복. 회복 후 HP가 양수이면 사망 방지.",
    desc: "사망 순간에 <strong>6d8 HP 회복</strong>. 회복 후 HP가 양수이면 사망 방지." },

  { name_ko: "물 제어", name_en: "Control Water", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "물"],
    summary: "물의 수위를 10피트 올리거나 내립니다. 영역 내 물 특성 생물은 인내 내성으로 느리게(slow) 주문의 효과를 받습니다.",
    desc: "<strong>특성:</strong> 집중, 조작, 물 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 500피트 | <strong>영역:</strong> 50피트×50피트 | <strong>방어:</strong> 인내(아래 참조)<br>물의 수위를 10피트 올리거나 내립니다. 영역 내 물 특성 생물은 인내 내성으로 느리게(slow) 주문의 효과를 받습니다.</div><br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "죽음의 저주", name_en: "Curse of Death", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["저주", "조작", "공허"],
    summary: "치명적 저주. 인내 실패 시 3d6 지속 공허 피해. 지속 피해를 받는 동안 최대 HP가 해당량만큼 감소. 지속 피해를 멈추면 저주가 잠들지만, 다음 일일 준비 시 저주가 재활성화(인내 내성 재시도).강화(+1): ...",
    desc: "<strong>특성:</strong> 저주, 집중, 조작, 공허 | <strong>전통:</strong> 신성, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 인내<br>치명적 저주. 인내 실패 시 <strong>3d6 지속 공허 피해</strong>. 지속 피해를 받는 동안 최대 HP가 해당량만큼 감소. 지속 피해를 멈추면 저주가 잠들지만, 다음 일일 준비 시 저주가 재활성화(인내 내성 재시도).<br><strong>강화(+1):</strong> 지속 피해 +1d6.</div><br>이 시점에서 캐릭터가 있고 패스파인더를 플레이할 준비가 되었습니다! 아니면 GM으로서 첫 모험을 진행할 준비를 하고 있을 수도 있습니다. 어느 쪽이든, 이 장은 1장에서 개요된 규칙의 전체 세부 사항을 제공합니다. 이 장은 게임 플레이의 일반 규칙과 관례를 설명하고, 각 플레이 모드의 규칙을 더 심층적으로 설명합니다." },

  { name_ko: "신성한 분신소각", name_en: "Divine Immolation", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["화염", "빛", "조작", "활력"],
    summary: "신성한 화염으로 대상에 불을 붙여 반복적으로 태웁니다. 인내 내성과 함께 5d6 화염 피해를 가합니다. 실패 또는 대실패 시, 대상에 추가로 불이 붙어 2d6 지속 화염 피해를 받으며 10피트 반경에 밝은 빛을, 2...",
    desc: "신성한 화염으로 대상에 불을 붙여 반복적으로 태웁니다. 인내 내성과 함께 <strong>5d6 화염 피해</strong>를 가합니다. 실패 또는 대실패 시, 대상에 추가로 불이 붙어 <strong>2d6 지속 화염 피해</strong>를 받으며 10피트 반경에 밝은 빛을, 20피트까지 희미한 빛을 발산합니다. 대실패 시에는 지속 화염 피해가 4d6으로 증가합니다.<br>" },

  { name_ko: "꿈의 잠재력", name_en: "Dreaming Potential", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "2행동", traits: ["조작", "정신"],
    summary: "대상이 꿈에서 재훈련합니다. 8시간 수면 후 대상은 1회 재훈련(Retrain)을 완료합니다(보통 1주가 걸리는 것을 하룻밤에).",
    desc: "<strong>특성:</strong> 집중, 조작, 정신 | <strong>전통:</strong> 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 동의+잠자는 생물 1 | <strong>지속 시간:</strong> 8시간<br>대상이 꿈에서 재훈련합니다. 8시간 수면 후 대상은 1회 재훈련(Retrain)을 완료합니다(보통 1주가 걸리는 것을 하룻밤에).</div>" },

  { name_ko: "정령 형태", name_en: "Elemental Form", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "정령 전투 형태로 변신합니다. 중형, AC=19+레벨, 임시 HP 10. 공기/대지/화염/물 정령 중 선택하여 각각 다른 이동 속도, 공격, 특수 능력을 얻습니다.강화(6랭크): 대형, 더 높은 능력치.강화(7랭크)...",
    desc: "정령 전투 형태로 변신합니다. 중형, AC=19+레벨, 임시 HP 10. 공기/대지/화염/물 정령 중 선택하여 각각 다른 이동 속도, 공격, 특수 능력을 얻습니다.<br>" },

  { name_ko: "거짓 시야", name_en: "False Vision", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["비일반", "환영", "조작"],
    summary: "투시 주문을 속입니다. 영역을 투시하려는 자는 당신이 설정한 환영을 대신 봅니다.",
    desc: "<strong>특성:</strong> 비일반, 집중, 환영, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>시전:</strong> 10분 | <strong>영역:</strong> 100피트 폭발 | <strong>지속 시간:</strong> 다음 일일 준비까지<br>투시 주문을 속입니다. 영역을 투시하려는 자는 당신이 설정한 환영을 대신 봅니다.</div>" },

  { name_ko: "환각", name_en: "Hallucination", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["무력화", "환영", "조작", "정신"],
    summary: "대상이 어떤 것을 다른 것으로 믿게 하거나, 없는 것을 인지하게 하거나, 있는 것을 인지하지 못하게 합니다. 의지 실패 시 당신이 선택한 환각을 경험합니다. 매 턴 환각에 관여할 때 의지 내성으로 불신 시도 가능.강...",
    desc: "대상이 어떤 것을 다른 것으로 믿게 하거나, 없는 것을 인지하게 하거나, 있는 것을 인지하지 못하게 합니다. 의지 실패 시 당신이 선택한 환각을 경험합니다. 매 턴 환각에 관여할 때 의지 내성으로 불신 시도 가능.<br>" },

  { name_ko: "울부짖는 눈보라", name_en: "Howling Blizzard", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["냉기", "조작"],
    summary: "차가운 바람과 눈더미가 영역을 채웁니다. 7d6 냉기 피해(기본 반사). 영역은 1라운드간 험지가 됩니다.강화(+1): 피해 +2d6.",
    desc: "<strong>특성:</strong> 냉기, 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 120피트 | <strong>영역:</strong> 30피트 폭발 또는 60피트 원뿔 | <strong>방어:</strong> 기본 반사<br>차가운 바람과 눈더미가 영역을 채웁니다. <strong>7d6 냉기 피해</strong>(기본 반사). 영역은 1라운드간 험지가 됩니다.<br><strong>강화(+1):</strong> 피해 +2d6.</div>" },

  { name_ko: "환영 풍경", name_en: "Illusory Scene", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["환영", "조작"],
    summary: "여러 생물과 물체를 포함하는 상상의 장면을 만듭니다. 생물들은 단순한 행동(걸기, 말하기 등)을 할 수 있지만 전투 등 복잡한 상호작용은 불가. 불신 시 흐릿해집니다.강화(6랭크): 지속 시간 24시간. 강화(8랭크...",
    desc: "여러 생물과 물체를 포함하는 상상의 장면을 만듭니다. 생물들은 단순한 행동(걸기, 말하기 등)을 할 수 있지만 전투 등 복잡한 상호작용은 불가. 불신 시 흐릿해집니다.<br>" },

  { name_ko: "꿰뚫는 말뚝", name_en: "Impaling Spike", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작"],
    summary: "냉철 말뚝으로 생물을 꿰뚫습니다. 8d6 관통 피해(반사). 실패 시 이동 불가(immobilized)(말뚝에 꿰뚫림). 탈출 DC = 주문 DC.강화(+1): 피해 +2d6.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 반사<br>냉철 말뚝으로 생물을 꿰뚫습니다. <strong>8d6 관통 피해</strong>(반사). 실패 시 <strong>이동 불가(immobilized)</strong>(말뚝에 꿰뚫림). 탈출 DC = 주문 DC.<br><strong>강화(+1):</strong> 피해 +2d6.</div>" },

  { name_ko: "영혼 소환", name_en: "Invoke Spirits", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작"],
    summary: "유령 같은 환영을 불러 적을 공격합니다. 생성 시 영역 내 적에 2d4 영혼 피해+2d4 선택한 에너지 피해(의지). 유지 시 이동(30피트)+재공격 가능.강화(+2): 각 피해 +1d4.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 신성, 비학<br><strong>사거리:</strong> 120피트 | <strong>영역:</strong> 10피트 폭발 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 유지(최대 1분)<br>유령 같은 환영을 불러 적을 공격합니다. 생성 시 영역 내 적에 <strong>2d4 영혼 피해+2d4 선택한 에너지 피해</strong>(의지). 유지 시 이동(30피트)+재공격 가능.<br><strong>강화(+2):</strong> 각 피해 +1d4.</div>" },

  { name_ko: "마법 통로", name_en: "Magic Passage", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "2행동", traits: ["비일반", "조작"],
    summary: "표면을 통과하는 임시 통로를 엽니다. 10피트 깊이×5피트 너비×10피트 높이. 통로를 만든 사람만 볼 수 있으며, 다른 이에게는 보이지 않음. 당신과 지정한 생물만 통과 가능.강화(7랭크): 20피트 깊이.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작 | <strong>전통:</strong> 비전<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 1개의 표면(벽, 바닥, 천장) | <strong>지속 시간:</strong> 1시간<br>표면을 통과하는 임시 통로를 엽니다. 10피트 깊이×5피트 너비×10피트 높이. 통로를 만든 사람만 볼 수 있으며, 다른 이에게는 보이지 않음. 당신과 지정한 생물만 통과 가능.<br><strong>강화(7랭크):</strong> 20피트 깊이.</div>" },

  { name_ko: "선원의 저주", name_en: "Mariner's Curse", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult", "primal"], actions: "2행동", traits: ["저주", "조작"],
    summary: "거친 바다의 저주를 생물에게 감염시킵니다. 의지 실패 시 대상이 물 위에 있을 때 항상 구역질(sickened) 1(물 위를 벗어나도 남음). 대실패 시 구역질 2. 저주는 해제되거나 상쇄될 때까지 지속.",
    desc: "거친 바다의 저주를 생물에게 감염시킵니다. 의지 실패 시 대상이 물 위에 있을 때 항상 <strong>구역질(sickened) 1</strong>(물 위를 벗어나도 남음). 대실패 시 구역질 2. 저주는 해제되거나 상쇄될 때까지 지속." },

  { name_ko: "정신 탐침", name_en: "Mind Probe", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["비일반", "조작", "언어", "정신"],
    summary: "생물의 지식과 기억을 발굴합니다. 특정 정보에 대해 질문하며, 각 유지마다 의지 내성. 실패 시 대상이 알고 있는 정보를 제공합니다. 대상은 탐침을 인지합니다.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작, 언어, 정신 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 유지(최대 1분)<br>생물의 지식과 기억을 발굴합니다. 특정 정보에 대해 질문하며, 각 유지마다 의지 내성. 실패 시 대상이 알고 있는 정보를 제공합니다. 대상은 탐침을 인지합니다.</div>" },

  { name_ko: "차원 하인", name_en: "Planar Servitor", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "3행동", traits: ["조작"],
    summary: "차원에서 하인을 소환합니다. 천상체, 악마, 또는 주시자를 소환하며, 주문 랭크에 따라 레벨이 결정됩니다. 소환된 생물은 하수인 특성을 가집니다.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 신성<br><strong>사거리:</strong> 30피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>차원에서 하인을 소환합니다. 천상, 마귀, 또는 감시자를 소환하며, 주문 랭크에 따라 레벨이 결정됩니다. 소환된 생물은 하수인 특성을 가집니다.</div><br>이 시점에서 캐릭터가 있고 패스파인더를 플레이할 준비가 되었습니다! 아니면 GM으로서 첫 모험을 진행할 준비를 하고 있을 수도 있습니다. 어느 쪽이든, 이 장은 1장에서 개요된 규칙의 전체 세부 사항을 제공합니다. 이 장은 게임 플레이의 일반 규칙과 관례를 설명하고, 각 플레이 모드의 규칙을 더 심층적으로 설명합니다." },

  { name_ko: "식물 형태", name_en: "Plant Form", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["조작", "식물", "변이"],
    summary: "거대 식물 전투 형태로 변신. 대형, AC=19+레벨, 임시 HP 12. 플라이트랩, 셤블러, 트렌트 등 선택. 각 형태마다 고유 공격.강화(6랭크): 거대, 도달 15피트.",
    desc: "<strong>특성:</strong> 집중, 조작, 식물, 변이 | <strong>전통:</strong> 원시<br><strong>지속 시간:</strong> 1분<br>거대 식물 전투 형태로 변신. 대형, AC=19+레벨, 임시 HP 12. 플라이트랩, 셤블러, 트렌트 등 선택. 각 형태마다 고유 공격.<br><strong>강화(6랭크):</strong> 거대, 도달 15피트.</div>" },

  { name_ko: "회복의 순간", name_en: "Restorative Moment", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["치유", "조작"],
    summary: "생물에 하루 분량의 회복을 순간적으로 부여합니다. 대상이 자연 치유로 회복할 HP를 즉시 회복하고, 여러 상태가 하루 경과한 것처럼 줄어듭니다.",
    desc: "<strong>특성:</strong> 집중, 치유, 조작 | <strong>전통:</strong> 신성, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 동의 생물 1<br>생물에 하루 분량의 회복을 순간적으로 부여합니다. 대상이 자연 치유로 회복할 HP를 즉시 회복하고, 여러 상태가 하루 경과한 것처럼 줄어듭니다.</div><br>이 시점에서 캐릭터가 있고 패스파인더를 플레이할 준비가 되었습니다! 아니면 GM으로서 첫 모험을 진행할 준비를 하고 있을 수도 있습니다. 어느 쪽이든, 이 장은 1장에서 개요된 규칙의 전체 세부 사항을 제공합니다. 이 장은 게임 플레이의 일반 규칙과 관례를 설명하고, 각 플레이 모드의 규칙을 더 심층적으로 설명합니다." },

  { name_ko: "정찰 눈", name_en: "Scouting Eye", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작", "투시"],
    summary: "보이지 않는 눈이 보는 것을 당신에게 전송합니다. 눈은 비행 속도 30피트로 이동하며, 당신의 시각을 대체합니다.",
    desc: "<strong>특성:</strong> 집중, 조작, 투시 | <strong>전통:</strong> 비전, 신성, 비학<br><strong>사거리:</strong> 500피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>보이지 않는 눈이 보는 것을 당신에게 전송합니다. 눈은 비행 속도 30피트로 이동하며, 당신의 시각을 대체합니다.</div>" },

  { name_ko: "전송", name_en: "Sending", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작"],
    summary: "행성 어디에든 메시지를 보내고 답장을 받습니다. 25단어 이하의 메시지를 보내며, 대상은 25단어 이하로 즉시 답장할 수 있습니다.",
    desc: "행성 어디에든 메시지를 보내고 답장을 받습니다. <strong>25단어 이하</strong>의 메시지를 보내며, 대상은 25단어 이하로 즉시 답장할 수 있습니다." },

  { name_ko: "그림자 폭발", name_en: "Shadow Blast", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["조작", "그림자"],
    summary: "그림자 물질의 피해 원뿔을 형성합니다. 시전 시 피해 유형(산성, 냉기, 전기, 화염, 음파)과 내성(인내, 반사, 의지)을 선택. 5d8 피해(기본 내성).강화(+1): 피해 +1d8.",
    desc: "<strong>특성:</strong> 집중, 조작, 그림자 | <strong>전통:</strong> 신성, 비학<br><strong>영역:</strong> 30피트 원뿔 | <strong>방어:</strong> 기본(선택한 내성)<br>그림자 물질의 피해 원뿔을 형성합니다. 시전 시 피해 유형(산성, 냉기, 전기, 화염, 음파)과 내성(인내, 반사, 의지)을 선택. <strong>5d8 피해</strong>(기본 내성).<br><strong>강화(+1):</strong> 피해 +1d8.</div>" },

  { name_ko: "미끄러짐", name_en: "Slither", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "3행동", traits: ["조작", "그림자"],
    summary: "그림자 뱀이 물고 포획합니다. 4d8 관통 피해(반사). 실패 시 조이기(grabbed). 유지 시 조이기된 적에 자동 피해 + 이동.강화(+1): 피해 +1d8.",
    desc: "<strong>특성:</strong> 집중, 조작, 그림자 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 120피트 | <strong>영역:</strong> 10피트 폭발 | <strong>방어:</strong> 반사 | <strong>지속 시간:</strong> 유지(최대 1분)<br>그림자 뱀이 물고 포획합니다. <strong>4d8 관통 피해</strong>(반사). 실패 시 <strong>조이기(grabbed)</strong>. 유지 시 조이기된 적에 자동 피해 + 이동.<br><strong>강화(+1):</strong> 피해 +1d8.</div>" },

  { name_ko: "돌과 대화", name_en: "Speak with Stones", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult", "primal"], actions: "2행동", traits: ["대지", "조작"],
    summary: "자연 및 가공된 돌과 소통합니다. 돌은 주변에서 일어난 일(누가 지나갔는지, 진동, 온도 변화 등)에 대한 정보를 제공합니다.",
    desc: "<strong>특성:</strong> 대지, 집중, 조작 | <strong>전통:</strong> 신성, 비학, 원시<br><strong>지속 시간:</strong> 10분<br>자연 및 가공된 돌과 소통합니다. 돌은 주변에서 일어난 일(누가 지나갔는지, 진동, 온도 변화 등)에 대한 정보를 제공합니다.</div>" },

  { name_ko: "영적 수호자", name_en: "Spiritual Guardian", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["조작", "성별화", "영혼"],
    summary: "마법의 힘으로 만들어진 중형 수호자가 범위 내 빈 공간에 출현합니다. 수호자는 반투명하며 착용하거나 든 무기 중 하나의 유령 같은 복제본을 지닙니다. 신을 섬기는 경우 수호자는 신의 시종 또는 봉사자 형태를 취합니다...",
    desc: "<strong>특성:</strong> 집중, 조작, 성별화, 영혼 | <strong>전통:</strong> 신성<br><strong>사거리:</strong> 120피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>마법의 힘으로 만들어진 중형 수호자가 범위 내 빈 공간에 출현합니다. 수호자는 반투명하며 착용하거나 든 무기 중 하나의 유령 같은 복제본을 지닙니다. 신을 섬기는 경우 수호자는 신의 시종 또는 봉사자 형태를 취합니다. 주문을 성별화하면 수호자의 공격도 성별화됩니다. 생물은 수호자의 공간을 통과할 수 있지만 그 안에 멈출 수 없습니다. 수호자와 협공이 가능합니다. 수호자는 HP 50 외 다른 속성이 없으며 HP는 회복이 불가능하고 아래의 보호 행동을 할 때만 HP를 잃습니다. 주문 시전 시 및 유지 시마다 수호자를 120피트 내 빈 공간으로 이동시키고 다음 중 하나를 수행합니다:<br><strong>공격:</strong> 수호자가 인접한 생물에 근접 주문 공격 굴림을 실행합니다. 명중 시 <strong>3d8 피해</strong>(급소 공격 시 2배). 피해 유형은 무기 유형과 같으며, 영혼 피해가 더 해로우면 영혼 피해로. 다중 공격 페널티에 기여합니다.<br><strong>보호:</strong> 인접한 선택한 생물을 보호합니다. 그 생물이 피해를 받을 때마다 수호자가 대신 피해를 받습니다. 수호자의 HP가 0이 되면 사라지고 주문이 종료됩니다.</div>" },

  { name_ko: "잠재 암시", name_en: "Subconscious Suggestion", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["무력화", "언어", "조작", "정신"],
    summary: "생물의 마음에 발동 조건이 있는 암시를 심습니다. 암시(Suggestion)와 유사하지만, 지정한 발동 조건이 충족될 때까지 잠재되어 있다가 활성화됩니다. 활성화되면 대상이 암시를 따릅니다.",
    desc: "<strong>특성:</strong> 집중, 무력화, 언어, 조작, 정신 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 다양<br>생물의 마음에 발동 조건이 있는 암시를 심습니다. 암시(Suggestion)와 유사하지만, 지정한 발동 조건이 충족될 때까지 잠재되어 있다가 활성화됩니다. 활성화되면 대상이 암시를 따릅니다.</div>" },

  { name_ko: "천상체 소환", name_en: "Summon Celestial", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "3행동", traits: ["조작"],
    summary: "당신을 위해 싸울 천상체를 소환합니다. 주문 랭크 -1 이하 레벨의 천상체 소환.강화(6랭크 이후): 더 강한 천상체 소환.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 신성 | <strong>사거리:</strong> 30피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>당신을 위해 싸울 천상 생물을 소환합니다. 주문 랭크 -1 이하 레벨의 천상 소환.<br><strong>강화(6랭크 이후):</strong> 더 강한 천상 소환.</div>" },

  { name_ko: "용 소환", name_en: "Summon Dragon", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "3행동", traits: ["조작"],
    summary: "당신을 위해 싸울 용을 소환합니다. 주문 랭크 -1 이하 레벨의 용을 소환합니다.강화(6랭크 이후): 더 강한 용 소환 가능.",
    desc: "당신을 위해 싸울 용을 소환합니다. 주문 랭크 -1 이하 레벨의 용을 소환합니다.<br>" },

  { name_ko: "실체 소환", name_en: "Summon Entity", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "3행동", traits: ["조작"],
    summary: "기형체(aberration)를 소환합니다. 주문 랭크 -1 이하 레벨.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비학 | <strong>사거리:</strong> 30피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>기형체(aberration)를 소환합니다. 주문 랭크 -1 이하 레벨.</div>" },

  { name_ko: "악마 소환", name_en: "Summon Fiend", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "3행동", traits: ["조작"],
    summary: "악마를 소환합니다. 주문 랭크 -1 이하 레벨.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 신성 | <strong>사거리:</strong> 30피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>마귀를 소환합니다. 주문 랭크 -1 이하 레벨.</div>" },

  { name_ko: "거인 소환", name_en: "Summon Giant", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "3행동", traits: ["조작"],
    summary: "거인을 소환합니다. 주문 랭크 -1 이하 레벨의 거인.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 원시<br><strong>사거리:</strong> 30피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>거인을 소환합니다. 주문 랭크 -1 이하 레벨의 거인.</div><br>이 시점에서 캐릭터가 있고 패스파인더를 플레이할 준비가 되었습니다! 아니면 GM으로서 첫 모험을 진행할 준비를 하고 있을 수도 있습니다. 어느 쪽이든, 이 장은 1장에서 개요된 규칙의 전체 세부 사항을 제공합니다. 이 장은 게임 플레이의 일반 규칙과 관례를 설명하고, 각 플레이 모드의 규칙을 더 심층적으로 설명합니다." },

  { name_ko: "감시자 소환", name_en: "Summon Monitor", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "3행동", traits: ["조작"],
    summary: "차원 감시자를 소환합니다. 주문 랭크 -1 이하 레벨.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 신성 | <strong>사거리:</strong> 30피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>차원 감시자를 소환합니다. 주문 랭크 -1 이하 레벨.</div>" },

  { name_ko: "시냅스 파동", name_en: "Synaptic Pulse", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "2행동", traits: ["무력화", "조작", "정신"],
    summary: "정신 폭발로 생물을 느리게 합니다. 영역 내 적이 의지 내성 시도.성공: 느려짐(slowed) 1(1라운드). 실패: 느려짐 1(1분). 대실패: 멍해짐(stunned) 1+느려짐 1(1분).",
    desc: "<strong>특성:</strong> 집중, 무력화, 조작, 정신 | <strong>전통:</strong> 비학<br><strong>영역:</strong> 30피트 발산 | <strong>방어:</strong> 의지<br>정신 폭발로 생물을 느리게 합니다. 영역 내 적이 의지 내성 시도.<br><strong>성공:</strong> 느려짐(slowed) 1(1라운드). <strong>실패:</strong> 느려짐 1(1분). <strong>대실패:</strong> 멍해짐(stunned) 1+느려짐 1(1분).</div>" },

  { name_ko: "염동 운반", name_en: "Telekinetic Haul", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작"],
    summary: "큰 물체를 이동시킵니다. 대상을 20피트까지 어떤 방향으로든 이동시킵니다. 생물에 떨어지면 피해 가능(기본 반사, 낙하 피해 규칙 적용).",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 120피트 | <strong>대상:</strong> 비고정 물체 1(최대 80 부피)<br>큰 물체를 이동시킵니다. 대상을 20피트까지 어떤 방향으로든 이동시킵니다. 생물에 떨어지면 피해 가능(기본 반사, 낙하 피해 규칙 적용).</div>" },

  { name_ko: "지형 전이", name_en: "Terrain Transposition", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["조작", "순간이동"],
    summary: "자연 지형을 통해 순간이동합니다. 같은 유형의 자연 지형(숲에서 숲으로, 동굴에서 동굴로) 내에서 최대 120피트까지 순간이동합니다.",
    desc: "<strong>특성:</strong> 집중, 조작, 순간이동 | <strong>전통:</strong> 원시<br><strong>사거리:</strong> 120피트<br>자연 지형을 통해 순간이동합니다. 같은 유형의 자연 지형(숲에서 숲으로, 동굴에서 동굴로) 내에서 최대 120피트까지 순간이동합니다.</div><br>이 시점에서 캐릭터가 있고 패스파인더를 플레이할 준비가 되었습니다! 아니면 GM으로서 첫 모험을 진행할 준비를 하고 있을 수도 있습니다. 어느 쪽이든, 이 장은 1장에서 개요된 규칙의 전체 세부 사항을 제공합니다. 이 장은 게임 플레이의 일반 규칙과 관례를 설명하고, 각 플레이 모드의 규칙을 더 심층적으로 설명합니다." },

  { name_ko: "독구름", name_en: "Toxic Cloud", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "3행동", traits: ["조작", "독"],
    summary: "독 안개 구름이 당신에게서 굴러갑니다. 4d6 독 피해(기본 인내). 유지 시 구름이 10피트 이동하고 재피해.강화(+1): 피해 +1d6.",
    desc: "<strong>특성:</strong> 집중, 조작, 독 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 120피트 | <strong>영역:</strong> 20피트 폭발 | <strong>방어:</strong> 기본 인내 | <strong>지속 시간:</strong> 유지(최대 1분)<br>독 안개 구름이 당신에게서 굴러갑니다. <strong>4d6 독 피해</strong>(기본 인내). 유지 시 구름이 10피트 이동하고 재피해.<br><strong>강화(+1):</strong> 피해 +1d6.</div>" },

  { name_ko: "만능 언어", name_en: "Truespeech", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["비일반", "조작"],
    summary: "생물이 모든 언어를 이해하고 말할 수 있게 합니다.강화(7랭크): 지속 시간 8시간. 강화(9랭크): 다음 일일 준비까지.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작 | <strong>전통:</strong> 비전, 신성, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>지속 시간:</strong> 1시간<br>생물이 모든 언어를 이해하고 말할 수 있게 합니다.<br><strong>강화(7랭크):</strong> 지속 시간 8시간. <strong>강화(9랭크):</strong> 다음 일일 준비까지.</div>" },

  { name_ko: "그림자 여행", name_en: "Umbral Journey", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["비일반", "조작", "그림자", "순간이동"],
    summary: "그림자 세계를 통해 빠르게 이동합니다. 물질계에서 그림자계(Netherworld)로 전환되어 이동 속도가 3배가 됩니다. 유지 종료 시 물질계의 해당 위치로 돌아옵니다.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작, 그림자, 순간이동 | <strong>전통:</strong> 비전, 비학<br><strong>지속 시간:</strong> 유지(최대 1분)<br>그림자 세계를 통해 빠르게 이동합니다. 물질계에서 그림자계(Netherworld)로 전환되어 이동 속도가 <strong>3배</strong>가 됩니다. 유지 종료 시 물질계의 해당 위치로 돌아옵니다.</div>" },

  { name_ko: "얼음 벽", name_en: "Wall of Ice", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "3행동", traits: ["냉기", "조작", "물"],
    summary: "1피트 두께의 얼음 벽을 형성하여 시야를 차단하고 생물을 냉각시킵니다. 벽의 인접한 면에 있는 생물이 2d6 냉기 피해(기본 반사). 벽은 AC 10, 경도 10, HP 40.강화(+2): HP +20, 피해 +2d...",
    desc: "<strong>특성:</strong> 냉기, 집중, 조작, 물 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 120피트 | <strong>지속 시간:</strong> 1분<br>1피트 두께의 얼음 벽을 형성하여 시야를 차단하고 생물을 냉각시킵니다. 벽의 인접한 면에 있는 생물이 <strong>2d6 냉기 피해</strong>(기본 반사). 벽은 AC 10, 경도 10, HP 40.<br><strong>강화(+2):</strong> HP +20, 피해 +2d6.</div>" },

  { name_ko: "돌 벽", name_en: "Wall of Stone", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "3행동", traits: ["대지", "조작"],
    summary: "돌 벽을 형성합니다. 120피트 길이, 20피트 높이, 1인치 두께(또는 더 짧고 두껍게). 영구적이지 않지만 물리적으로 파괴하지 않는 한 사라지지 않음. AC 10, 경도 14, HP 50.",
    desc: "<strong>특성:</strong> 대지, 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 120피트<br>돌 벽을 형성합니다. 120피트 길이, 20피트 높이, 1인치 두께(또는 더 짧고 두껍게). 영구적이지 않지만 물리적으로 파괴하지 않는 한 사라지지 않음. AC 10, 경도 14, HP 50.</div>" },

  { name_ko: "절망의 파도", name_en: "Wave of Despair", rank: 5, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["감정", "조작", "정신"],
    summary: "영역 내 생물을 절망에 빠뜨립니다. 의지 실패 시 공포 2+느려짐 1(1라운드). 대실패 시 공포 3+느려짐 1(1분).강화(+1): 원뿔 크기 +5피트.",
    desc: "<strong>특성:</strong> 집중, 감정, 조작, 정신 | <strong>전통:</strong> 비전, 비학<br><strong>영역:</strong> 30피트 원뿔 | <strong>방어:</strong> 의지<br>영역 내 생물을 절망에 빠뜨립니다. 의지 실패 시 <strong>공포 2+느려짐 1</strong>(1라운드). 대실패 시 공포 3+느려짐 1(1분).<br><strong>강화(+1):</strong> 원뿔 크기 +5피트.</div>" },

  { name_ko: "축복받은 경계", name_en: "Blessed Boundary", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "3행동", traits: ["강력", "조작", "성별화"],
    summary: "신성한 힘의 현현들이 수백 개 나타나 거대한 보호의 구체 안에서 소용돌이칩니다. 이것들은 보통 뾰족한 파편처럼 보이지만, 종종 주문을 시전하는 데 힘을 빌려준 신의 외양에 맞게 변하기도 합니다. 이 현현들은 영역 내...",
    desc: "신성한 힘의 현현들이 수백 개 나타나 거대한 보호의 구체 안에서 소용돌이칩니다. 이것들은 보통 뾰족한 파편처럼 보이지만, 종종 주문을 시전하는 데 힘을 빌려준 신의 외양에 맞게 변하기도 합니다. 이 현현들은 영역 내에서 언데드 또는 악마(fiend) 특성을 지니면서 당신의 성별화(신성 또는 불경)와 반대되는 생물들을 향해 맹렬히 쏟아집니다.<br>" },

  { name_ko: "연쇄 번개", name_en: "Chain Lightning", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["전기", "조작"],
    summary: "강력한 번개 볼트를 대상에게 방전시켜 8d12 전기 피해를 가합니다. 대상은 기본 반사 내성을 시도해야 합니다. 그런 다음 번개는 첫 번째 대상으로부터 30피트 이내의 다른 생물로 아크를 형성하고, 그 대상에서 30...",
    desc: "강력한 번개 볼트를 대상에게 방전시켜 <strong>8d12 전기 피해</strong>를 가합니다. 대상은 기본 반사 내성을 시도해야 합니다. 그런 다음 번개는 첫 번째 대상으로부터 30피트 이내의 다른 생물로 아크를 형성하고, 그 대상에서 30피트 이내의 다른 생물로 점프하는 식으로 이어집니다. 언제든지 연쇄를 종료할 수 있습니다. 같은 생물을 두 번 이상 대상으로 삼을 수 없으며, 모든 대상에게 효과선이 있어야 합니다. 피해는 한 번만 굴리고 각 대상에게 적용합니다(내성 결과에 따라 적절히 반감 또는 배증). 대상 중 하나라도 내성에서 대성공을 거두면 연쇄가 종료됩니다.<br>" },

  { name_ko: "저주 변신", name_en: "Cursed Metamorphosis", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult", "primal"], actions: "2행동", traits: ["저주", "무력화", "조작", "변신"],
    summary: "대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.대성공: 영향 없음.성공: 대상이 1라운드 동안 변신합니다.실패: 대상이 1시간 동안 변신합니...",
    desc: "대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "분해", name_en: "Disintegrate", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "2행동", traits: ["공격", "조작"],
    summary: "검은 추적 볼트를 발사하여 접촉 시 강력한 파괴 광선으로 강화됩니다. 물체나 힘 구조물(힘의 벽 등)에 맞으면 내성 없이 파괴(유물 제외, 최대 10피트 정육면체). 생물에 맞으면 12d10 피해(피해 유형 없음, ...",
    desc: "검은 추적 볼트를 발사하여 접촉 시 강력한 파괴 광선으로 강화됩니다. 물체나 힘 구조물(힘의 벽 등)에 맞으면 내성 없이 파괴(유물 제외, 최대 10피트 정육면체). 생물에 맞으면 <strong>12d10 피해</strong>(피해 유형 없음, 기본 인내). 치명타 시 내성 결과를 한 단계 나쁘게. 0 HP가 되면 미세한 가루로 분해(장비는 남음).<br>" },

  { name_ko: "지배", name_en: "Dominate", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["비일반", "무력화", "조작", "정신"],
    summary: "대상이 당신의 명령에 복종해야 합니다. 의지 내성 실패 시 시전 시 한 문장 명령을 따릅니다. 적대 행동은 거부할 수 있습니다. 명령이 완전히 대상의 성격에 반하면 자동 종료. 유지하여 새 명령 가능.대성공: 영향 ...",
    desc: "대상이 당신의 명령에 복종해야 합니다. 의지 내성 실패 시 시전 시 한 문장 명령을 따릅니다. 적대 행동은 거부할 수 있습니다. 명령이 완전히 대상의 성격에 반하면 자동 종료. 유지하여 새 명령 가능.<br>" },

  { name_ko: "용 형태", name_en: "Dragon Form", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "전투 형태로 용으로 변신합니다. 대형, AC = 18+레벨, 임시 HP 10, 암시야, 비행 100피트 등. 공격 수정치 +22, 브레스 웨폰 사용 가능. 용 유형(검은/파란/녹색/붉은/하얀/놋쇠/청동/금/은/구리)...",
    desc: "전투 형태로 용으로 변신합니다. 대형, AC = 18+레벨, 임시 HP 10, 암시야, 비행 100피트 등. 공격 수정치 +22, 브레스 웨폰 사용 가능. 용 유형(검은/파란/녹색/붉은/하얀/놋쇠/청동/금/은/구리) 선택 시 각각 다른 공격/브레스 피해 유형.<br>" },

  { name_ko: "생명의 장", name_en: "Field of Life", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["divine", "primal"], actions: "2행동", traits: ["치유", "조작", "활력"],
    summary: "활력 에너지 장을 만들어 영역 내에 머무는 생물을 치유합니다. 처음 생성 시 영역 내 살아있는 아군이 1d8 HP 회복. 유지 시마다 추가 1d8 회복. 영역 내 언데드는 턴 시작 시 1d8 활력 피해.강화(8랭크)...",
    desc: "<strong>특성:</strong> 집중, 치유, 조작, 활력 | <strong>전통:</strong> 신성, 원시<br><strong>사거리:</strong> 30피트 | <strong>영역:</strong> 20피트 폭발 | <strong>지속 시간:</strong> 유지(최대 1분)<br>활력 에너지 장을 만들어 영역 내에 머무는 생물을 치유합니다. 처음 생성 시 영역 내 살아있는 아군이 <strong>1d8 HP 회복</strong>. 유지 시마다 추가 1d8 회복. 영역 내 언데드는 턴 시작 시 1d8 활력 피해.<br><strong>강화(8랭크):</strong> 치유/피해 2d8. <strong>강화(9랭크):</strong> 3d8.</div>" },

  { name_ko: "오도", name_en: "Mislead", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "2행동", traits: ["환영", "조작"],
    summary: "투명해지면서 자신처럼 행동하는 복제본을 만듭니다. 복제본은 당신의 마지막 위치에 나타나며, 유지 시 이동시킬 수 있습니다. 생물이 상호작용하면 불신 가능. 복제본은 피해를 줄 수 없습니다.",
    desc: "투명해지면서 자신처럼 행동하는 복제본을 만듭니다. 복제본은 당신의 마지막 위치에 나타나며, 유지 시 이동시킬 수 있습니다. 생물이 상호작용하면 불신 가능. 복제본은 피해를 줄 수 없습니다." },

  { name_ko: "망각", name_en: "Never Mind", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["무력화", "조작", "정신"],
    summary: "생물을 영구적으로 멍청하게 만듭니다. 의지 실패 시 멍청함(stupefied) 4(영구). 대실패 시 멍청함 4+혼란(confused) 1라운드. 이 효과는 저주이며 상쇄로만 제거 가능.",
    desc: "<strong>특성:</strong> 집중, 무력화, 조작, 정신 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지<br>생물을 영구적으로 멍청하게 만듭니다. 의지 실패 시 <strong>멍청함(stupefied) 4</strong>(영구). 대실패 시 멍청함 4+<strong>혼란(confused) 1라운드</strong>. 이 효과는 저주이며 상쇄로만 제거 가능.</div>" },

  { name_ko: "석화", name_en: "Petrify", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["대지", "조작"],
    summary: "생물을 돌 조각상으로 만듭니다.대성공: 영향 없음. 성공: 1라운드 느려짐(slowed) 1. 실패: 1분간 느려짐 1, 매 턴 끝에 인내 내성(실패 시 석화(petrified) 영구). 대실패: 즉시 석화(영구).",
    desc: "생물을 돌 조각상으로 만듭니다.<br>" },

  { name_ko: "환영 재앙", name_en: "Phantasmal Calamity", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["환영", "조작", "정신"],
    summary: "종말의 환시를 만들어 생물에 정신 피해를 줍니다. 11d6 정신 피해(의지).대성공: 피해 없음. 성공: 절반 피해. 실패: 전체 피해+멍해짐 1(1분). 대실패: 2배 피해+멍해짐 2(1분).강화(+1): 피해 +...",
    desc: "종말의 환시를 만들어 생물에 정신 피해를 줍니다. <strong>11d6 정신 피해</strong>(의지).<br>" },

  { name_ko: "부활", name_en: "Raise Dead", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["비일반", "치유", "조작", "활력"],
    summary: "죽은 생물을 삶으로 돌려보냅니다. 1 HP로 부활합니다. 대상에 부활 병(resurrection sickness)이 부여되어(일정 기간 페널티). 의지가 없거나 영혼이 자유롭지 않은 생물은 부활 불가.강화(7랭크):...",
    desc: "죽은 생물을 삶으로 돌려보냅니다. <strong>1 HP</strong>로 부활합니다. 대상에 <strong>부활 병(resurrection sickness)</strong>이 부여되어(일정 기간 페널티). 의지가 없거나 영혼이 자유롭지 않은 생물은 부활 불가.<br>" },

  { name_ko: "반발", name_en: "Repulsion", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작", "정신"],
    summary: "생물이 당신에게 접근하지 못하게 합니다. 영역에 들어오려는 생물이 의지 내성 실패 시 자기 턴에 더 가까이 이동할 수 없습니다. 내성 성공 시 1라운드만 통과 가능(다음 턴에 다시 시도 필요).",
    desc: "생물이 당신에게 접근하지 못하게 합니다. 영역에 들어오려는 생물이 의지 내성 실패 시 자기 턴에 더 가까이 이동할 수 없습니다. 내성 성공 시 1라운드만 통과 가능(다음 턴에 다시 시도 필요)." },

  { name_ko: "투시", name_en: "Scrying", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["비일반", "조작", "투시"],
    summary: "선택한 생물을 감시합니다. 대상에 대해 아는 것이 많을수록 내성에 페널티. 실패 시 보이지 않는 마법 감지기를 대상 옆에 만들어 보고 들을 수 있습니다. 대상이 내성에 성공하면 1주간 면역.",
    desc: "선택한 생물을 감시합니다. 대상에 대해 아는 것이 많을수록 내성에 페널티. 실패 시 보이지 않는 마법 감지기를 대상 옆에 만들어 보고 들을 수 있습니다. 대상이 내성에 성공하면 1주간 면역." },

  { name_ko: "주문 고통", name_en: "Spellwrack", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["저주", "조작"],
    summary: "주문이 시전될 때 해를 입고 주문 지속 시간이 줄어드는 저주. 의지 실패 시 대상이 주문을 시전하거나 주문의 대상이 될 때마다 4d6 지속 피해. 또한 대상의 모든 주문 지속 시간이 절반으로 감소.",
    desc: "<strong>특성:</strong> 저주, 집중, 조작 | <strong>전통:</strong> 비전, 신성, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지<br>주문이 시전될 때 해를 입고 주문 지속 시간이 줄어드는 저주. 의지 실패 시 대상이 주문을 시전하거나 주문의 대상이 될 때마다 <strong>4d6 지속 피해</strong>. 또한 대상의 모든 주문 지속 시간이 절반으로 감소.</div>" },

  { name_ko: "영혼 폭발", name_en: "Spirit Blast", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["조작"],
    summary: "생물의 영적 본질에 피해를 줍니다. 16d6 힘 피해(기본 인내). 영체가 없는 구조물(구조체 등)은 면역.강화(+1): 피해 +2d6.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 신성, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 기본 인내<br>생물의 영적 본질에 피해를 줍니다. <strong>16d6 힘 피해</strong>(기본 인내). 영체가 없는 구조물(구조체 등)은 면역.<br><strong>강화(+1):</strong> 피해 +2d6.</div>" },

  { name_ko: "덩굴 뒤엉킴", name_en: "Tangling Creepers", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["조작", "식물"],
    summary: "폭발 영역에 뒤엉키는 덩굴이 자라 생물을 얽어맵니다. 영역은 험지. 유지 시 덩굴이 영역 내 생물을 공격(인내 DC)하여 이동 불가. 집중 시 덩굴이 추가 피해.",
    desc: "<strong>특성:</strong> 집중, 조작, 식물 | <strong>전통:</strong> 원시<br><strong>사거리:</strong> 500피트 | <strong>영역:</strong> 40피트 폭발 | <strong>지속 시간:</strong> 유지(최대 10분)<br>폭발 영역에 뒤엉키는 덩굴이 자라 생물을 얽어맵니다. 영역은 험지. 유지 시 덩굴이 영역 내 생물을 공격(인내 DC)하여 이동 불가. 집중 시 덩굴이 추가 피해.</div>" },

  { name_ko: "순간이동", name_en: "Teleport", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["비일반", "조작", "순간이동"],
    summary: "당신과 동의하는 생물들을 먼 거리로 순간이동합니다. 정밀도는 목적지에 대한 친숙도에 따라 다릅니다. 잘 아는 곳은 정확히, 한 번 본 곳은 약간의 오차, 설명만 들은 곳은 크게 빗나갈 수 있습니다.강화(7랭크): 같...",
    desc: "당신과 동의하는 생물들을 먼 거리로 순간이동합니다. 정밀도는 목적지에 대한 친숙도에 따라 다릅니다. 잘 아는 곳은 정확히, 한 번 본 곳은 약간의 오차, 설명만 들은 곳은 크게 빗나갈 수 있습니다.<br>" },

  { name_ko: "계절의 나무", name_en: "Tree of Seasons", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "3행동", traits: ["조작", "식물"],
    summary: "거대한 마법 나무를 자라게 합니다. 나무는 계절에 따른 효과를 줍니다: 봄(치유 발산), 여름(화염 피해 발산), 가을(보호 발산), 겨울(냉기 피해+느리게 발산). 유지 시 계절을 변경할 수 있습니다.",
    desc: "<strong>특성:</strong> 집중, 조작, 식물 | <strong>전통:</strong> 원시<br><strong>지속 시간:</strong> 유지(최대 1분)<br>거대한 마법 나무를 자라게 합니다. 나무는 계절에 따른 효과를 줍니다: 봄(치유 발산), 여름(화염 피해 발산), 가을(보호 발산), 겨울(냉기 피해+느리게 발산). 유지 시 계절을 변경할 수 있습니다.</div><br>이 시점에서 캐릭터가 있고 패스파인더를 플레이할 준비가 되었습니다! 아니면 GM으로서 첫 모험을 진행할 준비를 하고 있을 수도 있습니다. 어느 쪽이든, 이 장은 1장에서 개요된 규칙의 전체 세부 사항을 제공합니다. 이 장은 게임 플레이의 일반 규칙과 관례를 설명하고, 각 플레이 모드의 규칙을 더 심층적으로 설명합니다." },

  { name_ko: "진실 시야", name_en: "Truesight", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작", "탐지"],
    summary: "환영과 물리적 변형을 꿰뚫어 봅니다. 상위 암시야(greater darkvision)를 얻고, 변이/환영의 진짜 형태를 볼 수 있습니다. 투명한 생물은 은폐(흐릿하게 보임)로 취급됩니다.",
    desc: "환영과 물리적 변형을 꿰뚫어 봅니다. <strong>상위 암시야(greater darkvision)</strong>를 얻고, 변이/환영의 진짜 형태를 볼 수 있습니다. 투명한 생물은 은폐(흐릿하게 보임)로 취급됩니다." },

  { name_ko: "흡혈 탈혈", name_en: "Vampiric Exsanguination", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작", "공허"],
    summary: "원뿔의 생물에게서 피와 생명력을 빼앗아 자신을 치유합니다. 12d6 공허 피해(기본 인내). 생물들이 받은 피해의 절반만큼 임시 HP를 얻습니다(1분 지속).강화(+1): 피해 +2d6.",
    desc: "<strong>특성:</strong> 집중, 조작, 공허 | <strong>전통:</strong> 비전, 신성, 비학<br><strong>영역:</strong> 30피트 원뿔 | <strong>방어:</strong> 기본 인내<br>원뿔의 생물에게서 피와 생명력을 빼앗아 자신을 치유합니다. <strong>12d6 공허 피해</strong>(기본 인내). 생물들이 받은 피해의 절반만큼 <strong>임시 HP</strong>를 얻습니다(1분 지속).<br><strong>강화(+1):</strong> 피해 +2d6.</div>" },

  { name_ko: "현란한 무늬", name_en: "Vibrant Pattern", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["환영", "무력화", "조작", "시각"],
    summary: "빛의 무늬가 영역에 들어오는 생물을 눈부시게 하고 눈멀게 합니다.성공: 눈부심 1라운드. 실패: 눈멈 1라운드+눈부심 1분. 대실패: 눈멈 1분.",
    desc: "<strong>특성:</strong> 집중, 환영, 무력화, 조작, 시각 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 120피트 | <strong>영역:</strong> 10피트 폭발 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 유지(최대 1분)<br>빛의 무늬가 영역에 들어오는 생물을 눈부시게 하고 눈멀게 합니다.<br><strong>성공:</strong> 눈부심 1라운드. <strong>실패:</strong> 눈멈 1라운드+눈부심 1분. <strong>대실패:</strong> 눈멈 1분.</div>" },

  { name_ko: "힘의 벽", name_en: "Wall of Force", rank: 6, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "3행동", traits: ["힘", "조작"],
    summary: "보이지 않고 내구적인 마법 힘의 평면을 만듭니다. 50피트×20피트의 벽. 물리적이거나 에테르적으로 통과 불가. 상쇄하거나 분해(disintegrate)로만 파괴 가능. AC 10, 경도 30, HP 120.강화(7...",
    desc: "보이지 않고 내구적인 마법 힘의 평면을 만듭니다. 50피트×20피트의 벽. 물리적이거나 에테르적으로 통과 불가. 상쇄하거나 분해(disintegrate)로만 파괴 가능. AC 10, 경도 30, HP 120.<br>" },

  { name_ko: "집단 기억", name_en: "Collective Memories", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "2행동", traits: ["조작", "정신"],
    summary: "주변의 모든 생물의 집단적 기억에 접근합니다. 지역에 대한 역사, 비밀, 숨겨진 정보를 알아낼 수 있습니다. 지식 회상에 +4 상태 보너스.",
    desc: "<strong>특성:</strong> 집중, 조작, 정신 | <strong>전통:</strong> 비학<br><strong>시전:</strong> 10분<br>주변의 모든 생물의 집단적 기억에 접근합니다. 지역에 대한 역사, 비밀, 숨겨진 정보를 알아낼 수 있습니다. 지식 회상에 <strong>+4 상태 보너스</strong>.</div><br>이 시점에서 캐릭터가 있고 패스파인더를 플레이할 준비가 되었습니다! 아니면 GM으로서 첫 모험을 진행할 준비를 하고 있을 수도 있습니다. 어느 쪽이든, 이 장은 1장에서 개요된 규칙의 전체 세부 사항을 제공합니다. 이 장은 게임 플레이의 일반 규칙과 관례를 설명하고, 각 플레이 모드의 규칙을 더 심층적으로 설명합니다." },

  { name_ko: "신성한 칙령", name_en: "Divine Decree", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["조작", "성별화", "영혼"],
    summary: "당신의 신앙에서 비롯된 강력한 신성 선언, 즉 당신의 이상에 반대하는 자들을 해치는 명령을 발합니다. 당신의 성별화와 반대되는 성별화를 지닌 생물(불경 성별화를 지녔다면 신성 특성의 생물, 그 반대의 경우도 마찬가지...",
    desc: "당신의 신앙에서 비롯된 강력한 신성 선언, 즉 당신의 이상에 반대하는 자들을 해치는 명령을 발합니다. 당신의 성별화와 반대되는 성별화를 지닌 생물(불경 성별화를 지녔다면 신성 특성의 생물, 그 반대의 경우도 마찬가지)이나 성별화가 없는 생물에게 영역 내에서 <strong>7d10 영혼 피해</strong>를 가합니다. 각 생물은 인내 내성을 시도해야 합니다.<br>" },

  { name_ko: "적 복제", name_en: "Duplicate Foe", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "3행동", traits: ["조작"],
    summary: "적의 임시 복제본을 만들어 당신을 위해 싸우게 합니다. 인내 실패 시 복제본 생성. 복제본은 원본의 공격과 이동을 가지지만 HP가 낮고 주문 시전 불가. 하수인 특성.강화(9랭크): 복제본의 HP와 지속 시간 증가.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 적 생물 1 | <strong>방어:</strong> 인내 | <strong>지속 시간:</strong> 유지(최대 1분)<br>적의 임시 복제본을 만들어 당신을 위해 싸우게 합니다. 인내 실패 시 복제본 생성. 복제본은 원본의 공격과 이동을 가지지만 HP가 낮고 주문 시전 불가. 하수인 특성.<br><strong>강화(9랭크):</strong> 복제본의 HP와 지속 시간 증가.</div>" },

  { name_ko: "일식 폭발", name_en: "Eclipse Burst", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["냉기", "어둠", "조작"],
    summary: "어둠의 구체를 폭발시켜 냉기 피해, 산 것에 추가 피해, 빛을 극복합니다. 8d10 냉기 피해. 산 것에 추가 8d4 활력 피해. 영역의 마법 빛을 상쇄 시도. 불빛은 1분간 꺼짐.강화(+1): 냉기 +1d10, 활...",
    desc: "<strong>특성:</strong> 냉기, 어둠, 집중, 조작 | <strong>전통:</strong> 비전, 신성, 비학, 원시<br><strong>사거리:</strong> 500피트 | <strong>영역:</strong> 60피트 폭발 | <strong>방어:</strong> 반사<br>어둠의 구체를 폭발시켜 냉기 피해, 산 것에 추가 피해, 빛을 극복합니다. <strong>8d10 냉기 피해</strong>. 산 것에 추가 <strong>8d4 활력 피해</strong>. 영역의 마법 빛을 상쇄 시도. 불빛은 1분간 꺼짐.<br><strong>강화(+1):</strong> 냉기 +1d10, 활력 +1d4.</div>" },

  { name_ko: "에너지 방벽", name_en: "Energy Aegis", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["조작"],
    summary: "생물이 산성, 냉기, 전기, 화염, 힘, 음파, 활력, 공허 피해에 저항 5를 얻습니다.강화(9랭크): 저항 10.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 신성, 비학, 원시<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>지속 시간:</strong> 1분<br>생물이 산성, 냉기, 전기, 화염, 힘, 음파, 활력, 공허 피해에 <strong>저항 5</strong>를 얻습니다.<br><strong>강화(9랭크):</strong> 저항 10.</div>" },

  { name_ko: "처형", name_en: "Execute", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["조작", "공허", "활력"],
    summary: "살아있는 생물을 죽음으로, 언데드를 파괴로 끌어당깁니다. 대상의 남은 HP에 따라 피해가 결정됩니다. 최대 HP의 절반 이하일 때 즉사 가능(인내 대실패 시).강화(8랭크): 2 대상. 강화(9랭크): 3 대상.",
    desc: "<strong>특성:</strong> 집중, 조작, 공허, 활력 | <strong>전통:</strong> 신성, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 살아있는 또는 언데드 생물 1 | <strong>방어:</strong> 인내<br>살아있는 생물을 죽음으로, 언데드를 파괴로 끌어당깁니다. 대상의 남은 HP에 따라 피해가 결정됩니다. 최대 HP의 절반 이하일 때 즉사 가능(인내 대실패 시).<br><strong>강화(8랭크):</strong> 2 대상. <strong>강화(9랭크):</strong> 3 대상.</div>" },

  { name_ko: "불꽃 몸", name_en: "Fiery Body", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["화염", "조작", "변이"],
    summary: "몸을 살아있는 불꽃으로 변합니다. 화염 면역, 냉기 약점 5. 비행 속도 40피트. 근접 접촉 시 3d6 화염 피해. 비무장 공격에 2d6 화염 피해 추가. 화염 주문의 피해 주사위 1개마다 +1 추가 피해.강화(9...",
    desc: "<strong>특성:</strong> 집중, 화염, 조작, 변이 | <strong>전통:</strong> 비전, 원시<br><strong>지속 시간:</strong> 1분<br>몸을 살아있는 불꽃으로 변합니다. <strong>화염 면역, 냉기 약점 5</strong>. 비행 속도 40피트. 근접 접촉 시 <strong>3d6 화염 피해</strong>. 비무장 공격에 2d6 화염 피해 추가. 화염 주문의 피해 주사위 1개마다 +1 추가 피해.<br><strong>강화(9랭크):</strong> 냉기 약점 0, 비행 속도 60피트, 접촉 피해 4d6.</div>" },

  { name_ko: "차원 간 순간이동", name_en: "Interplanar Teleport", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["비일반", "조작", "순간이동"],
    summary: "당신과 대상들을 당신이 선택한 다른 차원으로 순간이동시킵니다. 목적지 차원에 대한 정보를 가지고 있어야 하며, 일반적으로 직접 방문한 경험이 있거나, 차원의 특성을 자세히 연구했거나, 신뢰할 수 있는 출처로부터 구체...",
    desc: "당신과 대상들을 당신이 선택한 다른 차원으로 순간이동시킵니다. 목적지 차원에 대한 정보를 가지고 있어야 하며, 일반적으로 직접 방문한 경험이 있거나, 차원의 특성을 자세히 연구했거나, 신뢰할 수 있는 출처로부터 구체적인 지식을 얻은 경우에 해당합니다. 목적지를 연구하지 않았거나 이 지식을 갖추지 못한 동의하는 생물은 시전 도중 당신과 물리적으로 접촉하고 있어야 합니다. 도착지는 그 차원 어딘가(특정 지점이 아님), 또는 당신이 알고 있는 특정 장소—예를 들어 포탈이나 이전에 방문한 위치—와 연관된 차원 내 지점이 됩니다.<br>" },

  { name_ko: "공포의 가면", name_en: "Mask of Terror", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["감정", "환영", "조작", "정신", "시각"],
    summary: "무시무시한 환영 외관을 만들어 관찰자를 겁먹게 합니다. 대상을 보는 적은 의지 내성 시도. 실패 시 공포(frightened) 2. 대실패 시 공포 3+도주(fleeing) 1라운드.강화(8랭크): 30피트 폭발 내...",
    desc: "<strong>특성:</strong> 집중, 감정, 환영, 조작, 정신, 시각 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>지속 시간:</strong> 1분<br>무시무시한 환영 외관을 만들어 관찰자를 겁먹게 합니다. 대상을 보는 적은 의지 내성 시도. 실패 시 <strong>공포(frightened) 2</strong>. 대실패 시 공포 3+<strong>도주(fleeing) 1라운드</strong>.<br><strong>강화(8랭크):</strong> 30피트 폭발 내 모든 아군에 효과 적용 가능.</div>" },

  { name_ko: "차원 추방", name_en: "Planar Displacement", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작", "순간이동"],
    summary: "생물을 다른 차원으로 보냅니다. 의지 실패 시 대상이 에테르 차원이나 다른 지정 차원으로 보내집니다. 지속 시간이 끝나면 원래 위치로 돌아옵니다.",
    desc: "<strong>특성:</strong> 집중, 조작, 순간이동 | <strong>전통:</strong> 비전, 신성, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 1분<br>생물을 다른 차원으로 보냅니다. 의지 실패 시 대상이 에테르 차원이나 다른 지정 차원으로 보내집니다. 지속 시간이 끝나면 원래 위치로 돌아옵니다.</div><br>이 시점에서 캐릭터가 있고 패스파인더를 플레이할 준비가 되었습니다! 아니면 GM으로서 첫 모험을 진행할 준비를 하고 있을 수도 있습니다. 어느 쪽이든, 이 장은 1장에서 개요된 규칙의 전체 세부 사항을 제공합니다. 이 장은 게임 플레이의 일반 규칙과 관례를 설명하고, 각 플레이 모드의 규칙을 더 심층적으로 설명합니다." },

  { name_ko: "차원 궁전", name_en: "Planar Palace", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "3행동", traits: ["비일반", "조작"],
    summary: "반차원에 안전한 거처를 소환합니다. 내부에 최대 150명 수용. 음식, 침구, 하인(무형) 제공. 외부 위험으로부터 완전 보호.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>시전:</strong> 1분 | <strong>지속 시간:</strong> 24시간<br>반차원에 안전한 거처를 소환합니다. 내부에 최대 150명 수용. 음식, 침구, 하인(무형) 제공. 외부 위험으로부터 완전 보호.</div>" },

  { name_ko: "차원 봉인", name_en: "Planar Seal", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["비일반", "조작"],
    summary: "순간이동과 소환에 대한 장벽을 세웁니다. 영역 내에서/영역으로의 순간이동, 소환, 차원 이동을 차단합니다.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작 | <strong>전통:</strong> 비전, 신성, 비학<br><strong>영역:</strong> 60피트 폭발 | <strong>지속 시간:</strong> 1일<br>순간이동과 소환에 대한 장벽을 세웁니다. 영역 내에서/영역으로의 순간이동, 소환, 차원 이동을 차단합니다.</div>" },

  { name_ko: "투영 이미지", name_en: "Project Image", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "2행동", traits: ["환영", "조작", "정신"],
    summary: "자신의 환영을 만들어 주문을 통해 시전합니다. 환영은 당신처럼 보이고 행동합니다. 유지 시 환영을 통해 주문을 시전할 수 있습니다(사거리는 환영 위치에서 계산).",
    desc: "<strong>특성:</strong> 집중, 환영, 조작, 정신 | <strong>전통:</strong> 비전<br><strong>사거리:</strong> 30피트 | <strong>지속 시간:</strong> 유지(최대 1분)<br>자신의 환영을 만들어 주문을 통해 시전합니다. 환영은 당신처럼 보이고 행동합니다. 유지 시 환영을 통해 주문을 시전할 수 있습니다(사거리는 환영 위치에서 계산).</div>" },

  { name_ko: "재생", name_en: "Regenerate", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["divine", "primal"], actions: "2행동", traits: ["치유", "조작", "활력"],
    summary: "생물이 시간에 따라 치유되고, 기관을 재생하며, 신체 부위를 다시 붙입니다. 대상이 라운드당 15 HP를 회복합니다. 잃어버린 팔다리, 기관 등이 지속 시간 중에 재성장합니다.강화(9랭크): 라운드당 20 HP.",
    desc: "생물이 시간에 따라 치유되고, 기관을 재생하며, 신체 부위를 다시 붙입니다. 대상이 <strong>라운드당 15 HP</strong>를 회복합니다. 잃어버린 팔다리, 기관 등이 지속 시간 중에 재성장합니다.<br>" },

  { name_ko: "과거 인지", name_en: "Retrocognition", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작"],
    summary: "현재 위치의 과거 사건에 대한 감각 인상을 얻습니다. 유지할수록 더 먼 과거로 거슬러 올라가며, 중요한 감정적 사건일수록 더 선명하게 인지합니다.강화(8랭크): 수천 년 전까지. 강화(9랭크): 시간 제한 없음.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>시전:</strong> 1분 | <strong>지속 시간:</strong> 유지(최대 5분)<br>현재 위치의 과거 사건에 대한 감각 인상을 얻습니다. 유지할수록 더 먼 과거로 거슬러 올라가며, 중요한 감정적 사건일수록 더 선명하게 인지합니다.<br><strong>강화(8랭크):</strong> 수천 년 전까지. <strong>강화(9랭크):</strong> 시간 제한 없음.</div>" },

  { name_ko: "태양 폭발", name_en: "Sunburst", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["divine", "primal"], actions: "2행동", traits: ["화염", "빛", "조작", "활력"],
    summary: "태양 빛의 구체가 화염 피해를 주고, 언데드를 해치며, 어둠을 극복합니다. 8d10 화염 피해(반사). 언데드에 추가 8d10 활력 피해. 영역의 마법 어둠을 상쇄 시도. 4랭크 이하 비마법 불빛이 1분간 꺼짐.강화...",
    desc: "<strong>특성:</strong> 화염, 빛, 집중, 조작, 활력 | <strong>전통:</strong> 신성, 원시<br><strong>사거리:</strong> 500피트 | <strong>영역:</strong> 60피트 폭발 | <strong>방어:</strong> 반사<br>태양 빛의 구체가 화염 피해를 주고, 언데드를 해치며, 어둠을 극복합니다. <strong>8d10 화염 피해</strong>(반사). 언데드에 추가 <strong>8d10 활력 피해</strong>. 영역의 마법 어둠을 상쇄 시도. 4랭크 이하 비마법 불빛이 1분간 꺼짐.<br><strong>강화(+1):</strong> 화염 +1d10, 활력 +1d10.</div>" },

  { name_ko: "정밀 대상", name_en: "True Target", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "1행동", traits: ["예언"],
    summary: "한 생물에 대한 여러 공격을 특별히 정확하게 합니다. 이 턴과 다음 턴에 대상에 대한 명중 굴림에서 d20을 두 번 굴려 높은 것을 사용.",
    desc: "<strong>특성:</strong> 집중, 예언 | <strong>전통:</strong> 비전<br><strong>사거리:</strong> 60피트 | <strong>대상:</strong> 생물 1 | <strong>지속 시간:</strong> 다음 일일 준비까지<br>한 생물에 대한 여러 공격을 특별히 정확하게 합니다. 이 턴과 다음 턴에 대상에 대한 공격 굴림에서 <strong>d20을 두 번 굴려 높은 것을 사용</strong>.</div>" },

  { name_ko: "화산 분출", name_en: "Volcanic Eruption", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["대지", "화염", "조작"],
    summary: "미니 화산을 폭발시킵니다. 분출구에서 30피트 원뿔의 용암이 분출되어 14d6 화염 피해(반사). 실패 시 4d6 지속 화염 피해. 분출구 영역은 극심 험지가 됩니다(1분).강화(+1): 화염 +2d6.",
    desc: "<strong>특성:</strong> 대지, 화염, 집중, 조작 | <strong>전통:</strong> 원시<br><strong>사거리:</strong> 120피트 | <strong>영역:</strong> 5피트 반경 분출구 | <strong>방어:</strong> 반사<br>미니 화산을 폭발시킵니다. 분출구에서 30피트 원뿔의 용암이 분출되어 <strong>14d6 화염 피해</strong>(반사). 실패 시 <strong>4d6 지속 화염 피해</strong>. 분출구 영역은 <strong>극심 험지</strong>가 됩니다(1분).<br><strong>강화(+1):</strong> 화염 +2d6.</div>" },

  { name_ko: "정신 왜곡", name_en: "Warp Mind", rank: 7, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["감정", "무력화", "조작", "정신"],
    summary: "생물을 혼란시켜 영구적으로 만듭니다. 의지 실패 시 혼란(confused). 대실패 시 영구 혼란(상쇄로만 제거).",
    desc: "<strong>특성:</strong> 집중, 감정, 무력화, 조작, 정신 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 120피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지<br>생물을 혼란시켜 영구적으로 만듭니다. 의지 실패 시 <strong>혼란(confused)</strong>. 대실패 시 <strong>영구 혼란</strong>(상쇄로만 제거).</div>" },

  { name_ko: "극지 균열", name_en: "Arctic Rift", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["냉기", "조작"],
    summary: "매서운 추위가 생물에 피해를 주고 얼립니다. 10d8 냉기 피해(기본 반사). 실패 시 느려짐(slowed) 2(1라운드). 대실패 시 석화(petrified, 얼음으로)(1분).강화(+1): 피해 +2d8.",
    desc: "<strong>특성:</strong> 냉기, 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 120피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 기본 반사<br>매서운 추위가 생물에 피해를 주고 얼립니다. <strong>10d8 냉기 피해</strong>(기본 반사). 실패 시 <strong>느려짐(slowed) 2</strong>(1라운드). 대실패 시 <strong>석화(petrified, 얼음으로)</strong>(1분).<br><strong>강화(+1):</strong> 피해 +2d8.</div><br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "영원한 슬픔의 찬가", name_en: "Canticle of Everlasting Grief", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["청각", "저주", "감정", "공포", "조작", "정신"],
    summary: "순수한 슬픔에서 증류된 선율. 10d6 정신 피해. 저주받은 동안 상황/상태 보너스를 받을 수 없음.성공: 절반 피해, 공포 1, 저주 1라운드. 실패: 전체 피해, 공포 2, 저주 1분. 대실패: 2배 피해, 공포...",
    desc: "<strong>특성:</strong> 청각, 집중, 저주, 감정, 공포, 조작, 정신 | <strong>전통:</strong> 신성, 비학<br><strong>사거리:</strong> 120피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 다양<br>순수한 슬픔에서 증류된 선율. <strong>10d6 정신 피해</strong>. 저주받은 동안 상황/상태 보너스를 받을 수 없음.<br><strong>성공:</strong> 절반 피해, 공포 1, 저주 1라운드. <strong>실패:</strong> 전체 피해, 공포 2, 저주 1분. <strong>대실패:</strong> 2배 피해, 공포 3+도주 1라운드, 저주 10분.</div><br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "탈수", name_en: "Desiccate", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "공허"],
    summary: "대상의 수분을 빼앗아 10d10 공허 피해. 물 생물과 식물 생물은 내성 결과를 한 단계 나쁘게 적용. 수분이 없는 생물(대지 정령 등)은 면역.강화(+1): 피해 +1d10.",
    desc: "대상의 수분을 빼앗아 <strong>10d10 공허 피해</strong>. 물 생물과 식물 생물은 내성 결과를 한 단계 나쁘게 적용. 수분이 없는 생물(대지 정령 등)은 면역.<br>" },

  { name_ko: "소멸", name_en: "Disappearance", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["환영", "조작", "은밀"],
    summary: "생물을 모든 감각에서 숨깁니다. 대상이 미탐지(undetected) 상태가 됩니다 — 시각뿐만 아니라 모든 정밀/부정확 감각에서. 탐색(Seek), 흩어진 먼지, 소리 공백 등으로 발견 가능.",
    desc: "<strong>특성:</strong> 환영, 조작, 은밀 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>지속 시간:</strong> 10분<br>생물을 모든 감각에서 숨깁니다. 대상이 <strong>미탐지(undetected)</strong> 상태가 됩니다 — 시각뿐만 아니라 모든 정밀/부정확 감각에서. 탐색(Seek), 흩어진 먼지, 소리 공백 등으로 발견 가능.</div>" },

  { name_ko: "신성한 영감", name_en: "Divine Inspiration", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["조작", "정신"],
    summary: "대상을 신성한 힘으로 채워 직업 자질과의 연결을 회복시킵니다. 대상은 하루에 제한된 횟수만 사용할 수 있는 소진된 직업 요소 중 하나(집중 풀, 기의 풀 또는 기타 능력 등)를 되찾습니다. 주문 시전자의 경우, 4등...",
    desc: "대상을 신성한 힘으로 채워 직업 자질과의 연결을 회복시킵니다. 대상은 하루에 제한된 횟수만 사용할 수 있는 소진된 직업 특성 중 하나(집중 풀, 기의 풀 또는 기타 능력 등)를 되찾습니다. 주문 시전자의 경우, 4랭크 이하의 소진된 주문 슬롯 하나를 회복합니다.<br>" },

  { name_ko: "지진", name_en: "Earthquake", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["대지", "조작"],
    summary: "파괴적인 지진으로 땅을 흔듭니다. 영역이 험지가 됩니다. 생물이 반사 내성 시도.대성공: 영향 없음. 성공: 넘어뜨려짐. 실패: 넘어뜨려짐+4d6 둔기 피해. 대실패: 넘어뜨려짐+4d6 둔기 피해+1d6 지속 둔기 ...",
    desc: "<strong>특성:</strong> 대지, 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 500피트 | <strong>영역:</strong> 60피트 폭발 | <strong>방어:</strong> 반사<br>파괴적인 지진으로 땅을 흔듭니다. 영역이 험지가 됩니다. 생물이 반사 내성 시도.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 넘어뜨려짐. <strong>실패:</strong> 넘어뜨려짐+<strong>4d6 둔기 피해</strong>. <strong>대실패:</strong> 넘어뜨려짐+<strong>4d6 둔기 피해</strong>+<strong>1d6 지속 둔기 피해</strong>. 구조물에 추가 피해.<br><strong>강화(+1):</strong> 둔기 피해 +1d6.</div>" },

  { name_ko: "숨겨진 정신", name_en: "Hidden Mind", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["비일반", "조작", "정신"],
    summary: "정신 마법과 비밀을 엿보는 효과로부터 생물을 보호합니다. 정신 효과에 대한 내성에 +2 상태 보너스. 독심술, 투시, 기타 탐지 효과에 면역.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작, 정신 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>지속 시간:</strong> 다음 일일 준비까지<br>정신 마법과 비밀을 엿보는 효과로부터 생물을 보호합니다. 정신 효과에 대한 내성에 +2 상태 보너스. 독심술, 투시, 기타 탐지 효과에 면역.</div>" },

  { name_ko: "이주", name_en: "Migration", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "순간이동"],
    summary: "당신과 동의하는 생물들을 같은 차원 내 먼 거리로 순간이동시킵니다. 순간이동(Teleport)과 유사하지만 더 많은 대상을 이동시킬 수 있으며, 야외 자연 환경으로만 이동 가능합니다.",
    desc: "<strong>특성:</strong> 집중, 조작, 순간이동 | <strong>전통:</strong> 비전, 원시<br><strong>대상:</strong> 자신+최대 8 동의 생물 | <strong>사거리:</strong> 접촉<br>당신과 동의하는 생물들을 같은 차원 내 먼 거리로 순간이동시킵니다. 순간이동(Teleport)과 유사하지만 더 많은 대상을 이동시킬 수 있으며, 야외 자연 환경으로만 이동 가능합니다.</div><br>이 시점에서 캐릭터가 있고 패스파인더를 플레이할 준비가 되었습니다! 아니면 GM으로서 첫 모험을 진행할 준비를 하고 있을 수도 있습니다. 어느 쪽이든, 이 장은 1장에서 개요된 규칙의 전체 세부 사항을 제공합니다. 이 장은 게임 플레이의 일반 규칙과 관례를 설명하고, 각 플레이 모드의 규칙을 더 심층적으로 설명합니다." },

  { name_ko: "갱신의 순간", name_en: "Moment of Renewal", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["치유", "조작"],
    summary: "생물에 하루 분량의 회복을 순간적으로 부여합니다. 각 대상이 4d8+21 HP 회복. 또한 각 대상에게 영향을 미치는 저주, 질병, 독 중 하나에 대해 상쇄를 시도합니다. 추가로 배수(drained) 수치를 1 감소...",
    desc: "<strong>특성:</strong> 집중, 치유, 조작 | <strong>전통:</strong> 신성, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 최대 6 생물<br>생물에 하루 분량의 회복을 순간적으로 부여합니다. 각 대상이 <strong>4d8+21 HP 회복</strong>. 또한 각 대상에게 영향을 미치는 저주, 질병, 독 중 하나에 대해 상쇄를 시도합니다. 추가로 배수(drained) 수치를 1 감소시킵니다.</div><br>이 시점에서 캐릭터가 있고 패스파인더를 플레이할 준비가 되었습니다! 아니면 GM으로서 첫 모험을 진행할 준비를 하고 있을 수도 있습니다. 어느 쪽이든, 이 장은 1장에서 개요된 규칙의 전체 세부 사항을 제공합니다. 이 장은 게임 플레이의 일반 규칙과 관례를 설명하고, 각 플레이 모드의 규칙을 더 심층적으로 설명합니다." },

  { name_ko: "괴물 형태", name_en: "Monstrosity Form", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "강력한 괴물로 변신합니다. 거대 크기, AC=22+레벨, 임시 HP 20. 피닉스, 크라켄, 퍼플 웜, 베히르 등 선택. 각 형태마다 고유 공격, 이동 속도, 특수 능력.",
    desc: "<strong>특성:</strong> 집중, 조작, 변이 | <strong>전통:</strong> 비전, 원시<br><strong>지속 시간:</strong> 1분<br>강력한 괴물로 변신합니다. 거대 크기, AC=22+레벨, 임시 HP 20. 피닉스, 크라켄, 퍼플 웜, 베히르 등 선택. 각 형태마다 고유 공격, 이동 속도, 특수 능력.</div><br>이 시점에서 캐릭터가 있고 패스파인더를 플레이할 준비가 되었습니다! 아니면 GM으로서 첫 모험을 진행할 준비를 하고 있을 수도 있습니다. 어느 쪽이든, 이 장은 1장에서 개요된 규칙의 전체 세부 사항을 제공합니다. 이 장은 게임 플레이의 일반 규칙과 관례를 설명하고, 각 플레이 모드의 규칙을 더 심층적으로 설명합니다." },

  { name_ko: "정확 위치", name_en: "Pinpoint", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["비일반", "조작", "탐지"],
    summary: "생물이나 물체의 정확한 위치를 알아냅니다. 대상에 대해 아는 것이 있으면 성공적으로 위치를 파악합니다.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작, 탐지 | <strong>전통:</strong> 비전, 신성, 비학<br><strong>사거리:</strong> 행성 전체 | <strong>대상:</strong> 생물 또는 물체 1<br>생물이나 물체의 정확한 위치를 알아냅니다. 대상에 대해 아는 것이 있으면 성공적으로 위치를 파악합니다.</div>" },

  { name_ko: "벌의 바람", name_en: "Punishing Winds", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "3행동", traits: ["공기", "조작"],
    summary: "강력한 바람이 영역을 휩씁니다. 원거리 공격에 -4 상황 페널티. 비행 중인 생물은 60피트 하강(인내로 저항). 영역은 극심 험지. 소형 이하 생물은 이동 불가.",
    desc: "<strong>특성:</strong> 공기, 집중, 조작 | <strong>전통:</strong> 원시<br><strong>영역:</strong> 100피트 발산 | <strong>지속 시간:</strong> 유지(최대 1분)<br>강력한 바람이 영역을 휩씁니다. 원거리 공격에 -4 상황 페널티. 비행 중인 생물은 60피트 하강(인내로 저항). 영역은 극심 험지. 소형 이하 생물은 이동 불가.</div><br>이 시점에서 캐릭터가 있고 패스파인더를 플레이할 준비가 되었습니다! 아니면 GM으로서 첫 모험을 진행할 준비를 하고 있을 수도 있습니다. 어느 쪽이든, 이 장은 1장에서 개요된 규칙의 전체 세부 사항을 제공합니다. 이 장은 게임 플레이의 일반 규칙과 관례를 설명하고, 각 플레이 모드의 규칙을 더 심층적으로 설명합니다." },

  { name_ko: "난제", name_en: "Quandary", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작"],
    summary: "초차원 퍼즐에 생물을 가둡니다. 의지 실패 시 대상이 반차원 퍼즐 공간에 갇힙니다. 탈출하려면 다양한 기술 판정(주문 DC) 3번 성공 필요.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지<br>초차원 퍼즐에 생물을 가둡니다. 의지 실패 시 대상이 반차원 퍼즐 공간에 갇힙니다. 탈출하려면 다양한 기술 판정(주문 DC) 3번 성공 필요.</div>" },

  { name_ko: "억제할 수 없는 춤", name_en: "Uncontrollable Dance", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["무력화", "조작", "정신"],
    summary: "춤에 대한 억제할 수 없는 충동으로 대상을 극복합니다. 의지 실패 시 대상이 매 턴 1행동을 춤추는 데 사용해야 합니다(방심+이동 속도 -10피트). 대실패 시 모든 행동을 춤에 사용.",
    desc: "<strong>특성:</strong> 집중, 무력화, 조작, 정신 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 접촉 | <strong>대상:</strong> 생물 1 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 다양<br>춤에 대한 억제할 수 없는 충동으로 대상을 극복합니다. 의지 실패 시 대상이 매 턴 1행동을 춤추는 데 사용해야 합니다(방심+이동 속도 -10피트). 대실패 시 모든 행동을 춤에 사용.</div>" },

  { name_ko: "끊임없는 관찰", name_en: "Unrelenting Observation", rank: 8, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "occult"], actions: "2행동", traits: ["조작", "투시"],
    summary: "당신과 다른 생물이 투시를 사용하여 대상을 정확히 추적합니다. 대상이 영역을 통과하면, 당신은 대상의 정확한 위치를 다음 일일 준비까지 알 수 있습니다.",
    desc: "<strong>특성:</strong> 집중, 조작, 투시 | <strong>전통:</strong> 비전, 비학<br><strong>사거리:</strong> 100피트 | <strong>영역:</strong> 20피트 폭발 | <strong>지속 시간:</strong> 다음 일일 준비까지<br>당신과 다른 생물이 투시를 사용하여 대상을 정확히 추적합니다. 대상이 영역을 통과하면, 당신은 대상의 정확한 위치를 다음 일일 준비까지 알 수 있습니다.</div>" },

  { name_ko: "마법 폭발", name_en: "Detonate Magic", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["비일반", "조작"],
    summary: "대상의 마법을 파괴적 폭발로 소산시킵니다. 상쇄를 시도합니다. 성공 시 8d6 힘 피해의 폭발(기본 반사). 아이템이면 1주 비활성(대성공 시 파괴), 5피트 발산. 주문이면 효과 종료, 영역 내 모든 생물 또는 대...",
    desc: "대상의 마법을 파괴적 폭발로 소산시킵니다. 상쇄를 시도합니다. 성공 시 <strong>8d6 힘 피해</strong>의 폭발(기본 반사). 아이템이면 1주 비활성(대성공 시 파괴), 5피트 발산. 주문이면 효과 종료, 영역 내 모든 생물 또는 대상+5피트 발산에 영향.<br>" },

  { name_ko: "유성 낙하", name_en: "Falling Stars", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작"],
    summary: "하늘에서 네 개의 천체 조각을 내려칩니다. 각 유성은 10피트 폭발 영역에 6d10 둔기 피해 + 6d10 화염 피해(기본 반사). 영역은 겹칠 수 있으며, 겹치는 영역의 생물은 한 번만 내성.강화(10랭크): 6개...",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 500피트<br>하늘에서 네 개의 천체 조각을 내려칩니다. 각 유성은 10피트 폭발 영역에 <strong>6d10 둔기 피해 + 6d10 화염 피해</strong>(기본 반사). 영역은 겹칠 수 있으며, 겹치는 영역의 생물은 한 번만 내성.<br><strong>강화(10랭크):</strong> 6개 유성.</div>" },

  { name_ko: "예지", name_en: "Foresight", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작", "예언"],
    summary: "위험 감각이 생물에게 위험을 경고하고 행운으로 보호합니다. 대상은 방심(off-guard)이 되지 않으며, 선제력(initiative) 굴림과 지각 판정에 +2 상태 보너스. 위험이 임박하면 시전자에게도 경고합니다....",
    desc: "위험 감각이 생물에게 위험을 경고하고 행운으로 보호합니다. 대상은 <strong>방심(off-guard)이 되지 않으며</strong>, 선제력(initiative) 굴림과 지각 판정에 <strong>+2 상태 보너스</strong>. 위험이 임박하면 시전자에게도 경고합니다. 또한 턴 시작 시 반응으로 대상이나 시전자가 <strong>다음 내성이나 AC에 +2 상황 보너스</strong>를 사용할 수 있습니다." },

  { name_ko: "내파", name_en: "Implosion", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "2행동", traits: ["조작"],
    summary: "생물을 내부로 붕괴시킵니다. 75 피해(기본 인내). 유지 시마다 같은 대상이나 새 대상에 같은 효과. 원래 대상은 반복 시 내성에 -1 상황 페널티 누적.강화(10랭크): 피해 100.",
    desc: "생물을 내부로 붕괴시킵니다. <strong>75 피해</strong>(기본 인내). 유지 시마다 같은 대상이나 새 대상에 같은 효과. 원래 대상은 반복 시 내성에 -1 상황 페널티 누적.<br>" },

  { name_ko: "대학살", name_en: "Massacre", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "primal"], actions: "2행동", traits: ["조작", "공허", "죽음"],
    summary: "즉시 여러 생물을 죽입니다. 영역 내 생물이 인내 내성 시도. 14레벨 이하 생물이 실패하면 즉사(죽음 효과). 더 높은 레벨은 100 피해. 대실패 시 레벨에 관계없이 즉사.강화(10랭크): 영향받는 최대 레벨 1...",
    desc: "즉시 여러 생물을 죽입니다. 영역 내 생물이 인내 내성 시도. 14레벨 이하 생물이 실패하면 <strong>즉사</strong>(죽음 효과). 더 높은 레벨은 <strong>100 피해</strong>. 대실패 시 레벨에 관계없이 즉사.<br>" },

  { name_ko: "변형", name_en: "Metamorphosis", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "변환 마법의 달인으로서 형태 속에 또 다른 형태를 숨깁니다. 주문 목록에 있거나 8랭크 이하로 준비 가능한 모든 변신형(polymorph) 주문이 부여하는 형태로 변신할 수 있습니다(8랭크 이하 상향된 버전 포함)....",
    desc: "<strong>특성:</strong> 집중, 조작, 변이 | <strong>전통:</strong> 비전, 원시<br><strong>지속 시간:</strong> 1분<br>변환 마법의 달인으로서 형태 속에 또 다른 형태를 숨깁니다. 주문 목록에 있거나 8랭크 이하로 준비 가능한 모든 변신형(polymorph) 주문이 부여하는 형태로 변신할 수 있습니다(8랭크 이하 상향된 버전 포함). 해당 형태에서 일반적으로 얻는 임시 HP 대신 <strong>임시 HP 40</strong>을 얻습니다.</div>" },

  { name_ko: "압도적 존재", name_en: "Overwhelming Presence", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["청각", "무력화", "조작", "정신", "시각"],
    summary: "신의 위엄을 취합니다. 영역 내 적이 의지 내성 시도. 실패 시 매 턴 첫 행동을 절하기(엎드리기)에 사용해야 합니다(1분). 대실패 시 추가로 멍해짐 1.",
    desc: "<strong>특성:</strong> 청각, 집중, 무력화, 조작, 정신, 시각 | <strong>전통:</strong> 신성, 비학<br><strong>영역:</strong> 40피트 폭발 | <strong>방어:</strong> 의지<br>신의 위엄을 취합니다. 영역 내 적이 의지 내성 시도. 실패 시 <strong>매 턴 첫 행동을 절하기(엎드리기)에 사용</strong>해야 합니다(1분). 대실패 시 추가로 <strong>멍해짐 1</strong>.</div>" },

  { name_ko: "환상 공포증", name_en: "Phantasmagoria", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "2행동", traits: ["공포", "환영", "조작", "정신"],
    summary: "겁먹게 하고 정신 피해를 주며 대상을 죽일 수도 있습니다. 16d6 정신 피해. 공포 1(성공), 공포 2(실패), 공포 3+도주(대실패). 대실패 시 피해가 0 HP로 만들면 공포로 사망.",
    desc: "<strong>특성:</strong> 집중, 공포, 환영, 조작, 정신 | <strong>전통:</strong> 비학<br><strong>사거리:</strong> 120피트 | <strong>영역:</strong> 30피트 폭발 | <strong>방어:</strong> 의지<br>겁먹게 하고 정신 피해를 주며 대상을 죽일 수도 있습니다. <strong>16d6 정신 피해</strong>. 공포 1(성공), 공포 2(실패), 공포 3+도주(대실패). 대실패 시 피해가 0 HP로 만들면 <strong>공포로 사망</strong>.</div>" },

  { name_ko: "영혼 포획", name_en: "Seize Soul", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "반응", traits: ["비일반", "조작"],
    summary: "영혼을 아이템에 가둡니다. 죽은 생물의 영혼이 보석에 포획되어 부활이나 다른 사후 효과가 불가능해집니다. 보석을 파괴하면 영혼이 해방됩니다.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작 | <strong>전통:</strong> 신성, 비학<br><strong>유발 조건:</strong> 사거리 내 생물이 사망<br><strong>사거리:</strong> 30피트 | <strong>대상:</strong> 유발 생물 | <strong>비용:</strong> 보석(100gp+, 대상 레벨에 따라)<br>영혼을 아이템에 가둡니다. 죽은 생물의 영혼이 보석에 포획되어 부활이나 다른 사후 효과가 불가능해집니다. 보석을 파괴하면 영혼이 해방됩니다.</div>" },

  { name_ko: "폭풍 군주", name_en: "Storm Lord", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["공기", "전기", "조작"],
    summary: "강력한 폭풍을 불러옵니다. 영역에 폭우+강풍. 유지 시마다 번개 3줄기를 원하는 대상에 발사(각 4d12 전기 피해, 기본 반사). 비행 중인 적은 이동이 방해됩니다.강화(10랭크): 번개 6줄기.",
    desc: "<strong>특성:</strong> 공기, 전기, 집중, 조작 | <strong>전통:</strong> 원시<br><strong>영역:</strong> 100피트 발산 | <strong>지속 시간:</strong> 유지(최대 1분)<br>강력한 폭풍을 불러옵니다. 영역에 폭우+강풍. 유지 시마다 번개 3줄기를 원하는 대상에 발사(<strong>각 4d12 전기 피해</strong>, 기본 반사). 비행 중인 적은 이동이 방해됩니다.<br><strong>강화(10랭크):</strong> 번개 6줄기.</div>" },

  { name_ko: "불가해한 노래", name_en: "Unfathomable Song", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["occult"], actions: "2행동", traits: ["청각", "무력화", "조작", "정신"],
    summary: "이해할 수 없는 노래. 적이 의지 내성 시도. 성공: 멍청함 1(1라운드). 실패: 혼란+멍청함 1(1라운드). 대실패: 지배(controlled, 1라운드)+멍청함 1. 유지 시 영역 내 적에 재적용.",
    desc: "<strong>특성:</strong> 청각, 집중, 무력화, 조작, 정신 | <strong>전통:</strong> 비학<br><strong>사거리:</strong> 120피트 | <strong>영역:</strong> 20피트 폭발 | <strong>방어:</strong> 의지 | <strong>지속 시간:</strong> 유지(최대 1분)<br>이해할 수 없는 노래. 적이 의지 내성 시도. <strong>성공:</strong> 멍청함 1(1라운드). <strong>실패:</strong> 혼란+멍청함 1(1라운드). <strong>대실패:</strong> 지배(controlled, 1라운드)+멍청함 1. 유지 시 영역 내 적에 재적용.</div>" },

  { name_ko: "저주받은 자의 울부짖음", name_en: "Wails of the Damned", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["divine", "occult"], actions: "2행동", traits: ["청각", "조작", "공허"],
    summary: "비명을 질러 산 것의 생명력을 빼앗고 공허 피해를 줍니다. 8d10 음파 피해 + 8d10 공허 피해(기본 인내). 산 것에만 영향.",
    desc: "<strong>특성:</strong> 청각, 집중, 조작, 공허 | <strong>전통:</strong> 신성, 비학<br><strong>영역:</strong> 40피트 발산 | <strong>방어:</strong> 기본 인내<br>비명을 질러 산 것의 생명력을 빼앗고 공허 피해를 줍니다. <strong>8d10 음파 피해 + 8d10 공허 피해</strong>(기본 인내). 산 것에만 영향.</div>" },

  { name_ko: "소망", name_en: "Wish", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "3행동", traits: ["조작"],
    summary: "가장 강력한 비전 마법입니다. 비전 주문 목록의 7랭크 이하 주문 하나를 복제하거나, 다른 전통의 7랭크 이하 주문을 복제할 수 있습니다. 또는 GM 재량으로 그 이상의 효과를 얻을 수도 있지만, 의도와 다르게 해석...",
    desc: "가장 강력한 비전 마법입니다. 비전 주문 목록의 7랭크 이하 주문 하나를 복제하거나, 다른 전통의 7랭크 이하 주문을 복제할 수 있습니다. 또는 GM 재량으로 그 이상의 효과를 얻을 수도 있지만, 의도와 다르게 해석될 위험이 있습니다.<br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "분노의 폭풍", name_en: "Wrathful Storm", rank: 9, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["공기", "전기", "조작"],
    summary: "격렬한 뇌우. 생성 시 2d12 전기 피해(기본 반사). 유지 시 원하는 칸에 번개 낙뢰(각 4d12 전기, 기본 반사).",
    desc: "<strong>특성:</strong> 공기, 전기, 집중, 조작 | <strong>전통:</strong> 원시<br><strong>사거리:</strong> 500피트 | <strong>영역:</strong> 400피트 폭발(해당 높이까지) | <strong>방어:</strong> 기본 반사 | <strong>지속 시간:</strong> 유지(최대 1분)<br>격렬한 뇌우. 생성 시 <strong>2d12 전기 피해</strong>(기본 반사). 유지 시 원하는 칸에 번개 낙뢰(각 <strong>4d12 전기</strong>, 기본 반사).</div>" },

  { name_ko: "화신", name_en: "Avatar", rank: 10, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["조작", "변이"],
    summary: "당신의 신격에 의해 결정되는 전투 형태로 변신합니다. 크기 대형, 암시야, 이동 속도·공격·피해는 각 신격별로 다릅니다. 공격 수정치 +33. 변이 주문의 일반 규칙 적용(시전·대부분의 조작 행동 불가, 장비 흡수)...",
    desc: "당신의 신격에 의해 결정되는 전투 형태로 변신합니다. 크기 대형, 암시야, 이동 속도·공격·피해는 각 신격별로 다릅니다. 공격 수정치 +33. 변이 주문의 일반 규칙 적용(시전·대부분의 조작 행동 불가, 장비 흡수)." },

  { name_ko: "대재앙", name_en: "Cataclysm", rank: 10, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "primal"], actions: "2행동", traits: ["산성", "둔기", "냉기", "전기", "화염", "조작"],
    summary: "즉각적이고 파괴적인 대재앙을 불러옵니다. 영역 내 저항을 10 낮게 취급. 모든 생물이 기본 반사 1회로 5종 피해를 동시에 받습니다: 산성 비 3d10, 지진 3d10 둔기, 동결 바람 3d10 냉기, 번개 3d1...",
    desc: "<strong>특성:</strong> 산성, 둔기, 냉기, 전기, 화염, 집중, 조작 | <strong>전통:</strong> 비전, 원시<br><strong>사거리:</strong> 1,000피트 | <strong>영역:</strong> 60피트 폭발 | <strong>방어:</strong> 기본 반사<br>즉각적이고 파괴적인 대재앙을 불러옵니다. 영역 내 저항을 10 낮게 취급. 모든 생물이 기본 반사 1회로 5종 피해를 동시에 받습니다: 산성 비 3d10, 지진 3d10 둔기, 동결 바람 3d10 냉기, 번개 3d10 전기, 비행 중 돌풍 3d10 둔기, 쓰나미 3d10 둔기(수영 중 2배), 산불 3d10 화염.</div><br>대상의 몸을 비틀어 소형 이하 크기의 무해한 동물(개구리, 토끼 등)로 변신시킵니다. 대상은 의지 내성을 시도해야 합니다.<br><br>변신한 대상은 새로운 동물 형태에 대한 일반 규칙을 따르지만, 자신의 의지 내성과 숙련도는 유지하며 매 라운드 새로운 의지 내성을 굴려 효과를 종료할 수 있습니다. 대상은 자신의 지능, 지혜, 매력 점수와 관련 기술을 유지합니다. 대상은 말하는 능력과 주문 시전 능력을 잃습니다(동물 형태가 말할 수 있는 경우는 제외). 변신한 상태에서 대상이 사망하면, 새로운 형태 그대로 죽습니다.</div>" },

  { name_ko: "시간 동결", name_en: "Freeze Time", rank: 10, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "3행동", traits: ["조작"],
    summary: "당신을 제외한 모든 것의 시간을 잠시 멈춥니다. 즉시 3턴의 행동을 연속으로 취합니다. 시간 정지(Time Stop)와 유사하지만 다른 생물에 직접 영향을 줄 수 없습니다.",
    desc: "당신을 제외한 모든 것의 시간을 잠시 멈춥니다. 즉시 <strong>3턴의 행동</strong>을 연속으로 취합니다. 시간 정지(Time Stop)와 유사하지만 다른 생물에 직접 영향을 줄 수 없습니다." },

  { name_ko: "차원문", name_en: "Gate", rank: 10, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["비일반", "조작", "순간이동"],
    summary: "다른 차원으로 가는 포탈을 찢어 엽니다. 양쪽 모두 10피트 반경 원형의 차원 포탈이 열리며, 자유롭게 통과 가능. 원하는 차원과 도착 위치를 선택합니다. 차원간 이동이 차단된 곳에서는 작동하지 않습니다.",
    desc: "다른 차원으로 가는 포탈을 찢어 엽니다. 양쪽 모두 10피트 반경 원형의 차원 포탈이 열리며, 자유롭게 통과 가능. 원하는 차원과 도착 위치를 선택합니다. 차원간 이동이 차단된 곳에서는 작동하지 않습니다." },

  { name_ko: "무적", name_en: "Indestructibility", rank: 10, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult"], actions: "2행동", traits: ["조작"],
    summary: "잠시 모든 것에 면역이 됩니다. 다음 턴 시작까지 모든 피해와 해로운 효과에 면역.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 신성, 비학<br><strong>지속 시간:</strong> 1라운드<br>잠시 모든 것에 면역이 됩니다. 다음 턴 시작까지 <strong>모든 피해와 해로운 효과에 면역</strong>.</div>" },

  { name_ko: "발현", name_en: "Manifestation", rank: 10, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "3행동", traits: ["조작"],
    summary: "유연하게 자신의 전통에서 9랭크 주문을 시전합니다. 시전 시 전통 목록에서 9랭크 이하 주문 하나를 선택하여 즉시 시전합니다. 선택한 주문의 모든 규칙을 따릅니다.",
    desc: "<strong>특성:</strong> 집중, 조작 | <strong>전통:</strong> 비전, 신성, 비학, 원시<br>유연하게 자신의 전통에서 9랭크 주문을 시전합니다. 시전 시 전통 목록에서 9랭크 이하 주문 하나를 선택하여 즉시 시전합니다. 선택한 주문의 모든 규칙을 따릅니다.</div>" },

  { name_ko: "자연의 화신", name_en: "Nature Incarnate", rank: 10, is_cantrip: false, is_focus: false,
    traditions: ["primal"], actions: "2행동", traits: ["조작", "변이"],
    summary: "자연의 궁극적 화신으로 변신합니다. 가루다, 카라킨(세계 거북), 베히모스 등 자연의 가장 강력한 형태 중 하나를 취합니다. 거대 크기, AC=25+레벨, 임시 HP 30, 공격 수정치 +33.",
    desc: "<strong>특성:</strong> 집중, 조작, 변이 | <strong>전통:</strong> 원시<br><strong>지속 시간:</strong> 1분<br>자연의 궁극적 화신으로 변신합니다. 가루다, 카라킨(세계 거북), 베히모스 등 자연의 가장 강력한 형태 중 하나를 취합니다. 거대 크기, AC=25+레벨, 임시 HP 30, 공격 수정치 +33.</div>" },

  { name_ko: "재창조", name_en: "Remake", rank: 10, is_cantrip: false, is_focus: false,
    traditions: ["arcane", "divine", "occult", "primal"], actions: "2행동", traits: ["비일반", "조작"],
    summary: "파괴된 물체를 다시 만듭니다. 파괴된 물체의 조각(아무리 작아도)을 원래 상태로 복원합니다. 유물(artifact)에는 작동하지 않습니다.",
    desc: "<strong>특성:</strong> 비일반, 집중, 조작 | <strong>전통:</strong> 비전, 신성, 비학, 원시<br><strong>사거리:</strong> 5피트<br>파괴된 물체를 다시 만듭니다. 파괴된 물체의 조각(아무리 작아도)을 원래 상태로 복원합니다. 유물(artifact)에는 작동하지 않습니다.</div>" },

  { name_ko: "부흥", name_en: "Revival", rank: 10, is_cantrip: false, is_focus: false,
    traditions: ["divine"], actions: "2행동", traits: ["치유", "조작", "활력"],
    summary: "영역 내 생물을 치유하고 죽은 자를 일시적으로 되살립니다. 살아있는 아군은 10d8+40 HP 회복. 최근 1분 이내 사망한 생물은 1 HP로 부활합니다.",
    desc: "<strong>특성:</strong> 집중, 치유, 조작, 활력 | <strong>전통:</strong> 신성<br><strong>사거리:</strong> 30피트 | <strong>영역:</strong> 30피트 폭발<br>영역 내 생물을 치유하고 죽은 자를 일시적으로 되살립니다. 살아있는 아군은 <strong>10d8+40 HP 회복</strong>. 최근 1분 이내 사망한 생물은 <strong>1 HP</strong>로 부활합니다.</div>" },

  { name_ko: "시간 정지", name_en: "Time Stop", rank: 10, is_cantrip: false, is_focus: false,
    traditions: ["arcane"], actions: "3행동", traits: ["조작"],
    summary: "당신을 제외한 모든 것에 대해 잠시 시간을 멈춥니다. 즉시 3턴의 행동을 연속으로 취합니다(각 턴 3행동). 다른 생물에 직접 영향을 주는 주문/공격은 일시 중지되어 시간 정지 종료 시 발동합니다.",
    desc: "당신을 제외한 모든 것에 대해 잠시 시간을 멈춥니다. 즉시 <strong>3턴의 행동</strong>을 연속으로 취합니다(각 턴 3행동). 다른 생물에 직접 영향을 주는 주문/공격은 일시 중지되어 시간 정지 종료 시 발동합니다." },


  // ─── FOCUS CANTRIPS (작곡 등) ──────────────────────────────

  { name_ko: "알레그로", name_en: "Allegro", rank: 7, is_cantrip: true, is_focus: true,
    traditions: ["occult"], actions: "1행동", traits: ["청각", "바드", "작곡"],
    summary: "빠른 선율이 아군의 발을 빠르게 합니다. 대상이 이동 속도에 +10피트 상태 보너스를 얻습니다.",
    desc: "빠른 선율이 아군의 발을 빠르게 합니다. 대상이 이동 속도에 <strong>+10피트 상태 보너스</strong>를 얻습니다." },

  { name_ko: "용기의 찬가", name_en: "Courageous Anthem", rank: 1, is_cantrip: true, is_focus: true,
    traditions: ["occult"], actions: "1행동", traits: ["청각", "바드", "작곡", "감정", "정신"],
    summary: "용기를 북돋우는 연주. 발산 내 아군이 명중 굴림, 피해 굴림, 공포에 대한 내성에 +1 상태 보너스.",
    desc: "용기를 북돋우는 연주. 발산 내 아군이 명중 굴림, 피해 굴림, 공포에 대한 내성에 <strong>+1 상태 보너스</strong>." },

  { name_ko: "죽음의 디르지", name_en: "Dirge of Doom", rank: 3, is_cantrip: true, is_focus: true,
    traditions: ["occult"], actions: "1행동", traits: ["청각", "바드", "작곡", "감정", "공포", "정신"],
    summary: "불길한 선율. 발산 내 적이 공포(frightened) 1이 됩니다(이미 공포이면 증가하지 않음). 이 주문은 면역을 무시합니다.",
    desc: "불길한 선율. 발산 내 적이 <strong>공포(frightened) 1</strong>이 됩니다(이미 공포이면 증가하지 않음). 이 주문은 면역을 무시합니다." },

  { name_ko: "집결의 찬가", name_en: "Rallying Anthem", rank: 2, is_cantrip: true, is_focus: true,
    traditions: ["occult"], actions: "1행동", traits: ["청각", "바드", "작곡", "감정", "정신"],
    summary: "방어를 북돋우는 연주. 발산 내 아군이 AC와 내성 굴림에 +1 상태 보너스.",
    desc: "방어를 북돋우는 연주. 발산 내 아군이 AC와 내성 굴림에 <strong>+1 상태 보너스</strong>." },

  { name_ko: "행군의 노래", name_en: "Song of Marching", rank: 3, is_cantrip: true, is_focus: true,
    traditions: ["occult"], actions: "1행동", traits: ["청각", "바드", "작곡"],
    summary: "탐험 중 아군의 여행을 돕는 노래. 발산 내 아군이 여행 중 이동 속도에 +10피트 상태 보너스. 피로를 지연시킵니다.",
    desc: "탐험 중 아군의 여행을 돕는 노래. 발산 내 아군이 여행 중 이동 속도에 <strong>+10피트 상태 보너스</strong>. 피로를 지연시킵니다." },

  { name_ko: "힘의 노래", name_en: "Song of Strength", rank: 3, is_cantrip: true, is_focus: true,
    traditions: ["occult"], actions: "1행동", traits: ["청각", "바드", "작곡", "감정", "정신"],
    summary: "힘을 북돋우는 연주. 발산 내 아군이 운동(Athletics) 판정과 피해 굴림에 +1 상태 보너스.",
    desc: "힘을 북돋우는 연주. 발산 내 아군이 운동(Athletics) 판정과 피해 굴림에 <strong>+1 상태 보너스</strong>." },

  { name_ko: "삼박자", name_en: "Triple Time", rank: 3, is_cantrip: true, is_focus: true,
    traditions: ["occult"], actions: "1행동", traits: ["청각", "바드", "작곡"],
    summary: "경쾌한 박자. 발산 내 아군이 이동 속도에 +10피트 상태 보너스.",
    desc: "경쾌한 박자. 발산 내 아군이 이동 속도에 <strong>+10피트 상태 보너스</strong>." },

  { name_ko: "고양의 서곡", name_en: "Uplifting Overture", rank: 1, is_cantrip: true, is_focus: true,
    traditions: ["occult"], actions: "1행동", traits: ["청각", "바드", "작곡", "감정", "정신"],
    summary: "기분을 높이는 서곡. 대상이 다음 의지 내성 굴림에 +1 상태 보너스.",
    desc: "기분을 높이는 서곡. 대상이 다음 의지 내성 굴림에 <strong>+1 상태 보너스</strong>." },


  // ─── FOCUS SPELLS ─────────────────────────────────────────

  { name_ko: "민첩한 발", name_en: "Agile Feet", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "조작"],
    summary: "신의 축복이 발을 빠르게 합니다. 이동 속도에 +5피트 상태 보너스+험지 무시. 시전의 일부로 한 걸음(Step)/보폭(Stride)/통과(Tumble Through) 가능. 적절한 속도가 있으면 굴파기/등반/비행/...",
    desc: "신의 축복이 발을 빠르게 합니다. 이동 속도에 <strong>+5피트 상태 보너스</strong>+<strong>험지 무시</strong>. 시전의 일부로 한 걸음(Step)/보폭(Stride)/통과(Tumble Through) 가능. 적절한 속도가 있으면 굴파기/등반/비행/수영도 가능." },

  { name_ko: "예술적 장식", name_en: "Artistic Flourish", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "조작"],
    summary: "물체에 마법적 예술적 장식을 추가합니다. 물체의 외관이 아름답게 변하고 가치가 증가합니다. 사회(Society) 판정에 +2 상황 보너스.",
    desc: "물체에 마법적 예술적 장식을 추가합니다. 물체의 외관이 아름답게 변하고 가치가 증가합니다. 사회(Society) 판정에 +2 상황 보너스." },

  { name_ko: "운동 돌진", name_en: "Athletic Rush", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "조작"],
    summary: "물리적 힘과 기술이 충만합니다. 이동 속도에 +10피트 상태 보너스+운동 판정에 +2 상태 보너스. 시전의 일부로 보폭/도약/등반/수영 가능.",
    desc: "물리적 힘과 기술이 충만합니다. 이동 속도에 <strong>+10피트 상태 보너스</strong>+운동 판정에 <strong>+2 상태 보너스</strong>. 시전의 일부로 보폭/도약/등반/수영 가능." },

  { name_ko: "행운의 한 조각", name_en: "Bit of Luck", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "행운"],
    summary: "대상의 다음 판정(공격, 기술, 내성)에서 d20을 두 번 굴려 높은 것을 사용합니다. 사용 후 주문 종료.",
    desc: "대상의 다음 판정(공격, 기술, 내성)에서 <strong>d20을 두 번 굴려 높은 것</strong>을 사용합니다. 사용 후 주문 종료." },

  { name_ko: "피의 수호", name_en: "Blood Ward", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "조작"],
    summary: "언데드의 공격에 대한 보호. 대상이 언데드에 대해 AC와 내성에 +1 상태 보너스.",
    desc: "언데드의 공격에 대한 보호. 대상이 언데드에 대해 AC와 내성에 <strong>+1 상태 보너스</strong>." },

  { name_ko: "킥킥", name_en: "Cackle", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "자유 행동", traits: ["위치"],
    summary: "악랄한 웃음으로 유지 중인 주문을 자유 행동으로 유지합니다. 이번 턴에 유지(Sustain) 행동 대신 이것을 사용하여 1개의 주문을 유지할 수 있습니다.",
    desc: "악랄한 웃음으로 유지 중인 주문을 자유 행동으로 유지합니다. 이번 턴에 유지(Sustain) 행동 대신 이것을 사용하여 1개의 주문을 유지할 수 있습니다." },

  { name_ko: "열정의 유혹", name_en: "Captivating Adoration", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "감정", "조작", "정신", "시각"],
    summary: "매혹적 존재감. 영역에 들어온 적이 의지 실패 시 매혹(fascinated). 매혹된 동안 당신에 대한 적대 행동에 DC 5 단순 판정.",
    desc: "매혹적 존재감. 영역에 들어온 적이 의지 실패 시 <strong>매혹(fascinated)</strong>. 매혹된 동안 당신에 대한 적대 행동에 DC 5 단순 판정." },

  { name_ko: "가족 회복", name_en: "Community Restoration", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "치유", "조작"],
    summary: "대상 각각의 상태 하나를 상쇄합니다(고통 정화와 유사).",
    desc: "최대 10명의 대상을 골라 각각에게 걸린 고통 하나를 해소합니다. 고통 정화(cleanse affliction)와 유사하게 작동합니다. 각 대상의 <strong>질병, 독, 저주 중 1개</strong>에 대해 해제를 시도합니다." },

  { name_ko: "경쟁심", name_en: "Competitive Edge", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "감정", "정신"],
    summary: "경쟁심이 우월함을 입증하게 합니다. 명중 굴림과 기술 판정에 +1 상태 보너스. 20피트 이내의 적이 공격/기술 판정에 대성공하면 해당 보너스가 1라운드간 +3으로 증가.강화(7랭크): 기본 +2, 대성공 시 +4.",
    desc: "경쟁심이 우월함을 입증하게 합니다. 명중 굴림과 기술 판정에 <strong>+1 상태 보너스</strong>. 20피트 이내의 적이 공격/기술 판정에 대성공하면 해당 보너스가 1라운드간 <strong>+3</strong>으로 증가.<br><strong>강화(7랭크):</strong> 기본 +2, 대성공 시 +4." },

  { name_ko: "축제의 뿔피리", name_en: "Cornucopia", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "조작", "식물"],
    summary: "풍요의 뿔에서 음식이 쏟아집니다. 영역 내 아군이 1d4+4 HP 회복하고 1일 영양분 섭취.강화(+1): 회복 +1d4.",
    desc: "풍요의 뿔에서 음식이 쏟아집니다. 영역 내 아군이 <strong>1d4+4 HP 회복</strong>하고 1일 영양분 섭취.<br><strong>강화(+1):</strong> 회복 +1d4." },

  { name_ko: "대항 공연", name_en: "Counter Performance", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["바드", "작곡", "행운", "정신"],
    summary: "공연으로 아군을 보호합니다. 공연(Performance) 판정을 굴립니다(유발 조건에 맞는 유형). 당신과 영역 내 아군은 공연 판정과 내성 굴림 중 더 좋은 결과를 사용합니다.",
    desc: "공연으로 아군을 보호합니다. 공연(Performance) 판정을 굴립니다(유발 조건에 맞는 유형). 당신과 영역 내 아군은 공연 판정과 내성 굴림 중 <strong>더 좋은 결과</strong>를 사용합니다." },

  { name_ko: "창의적 물감", name_en: "Creative Splash", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "조작"],
    summary: "마법 물감을 생물에 뿌려 눈부시게 합니다. 1d6 피해(기본 반사)+실패 시 눈부심 1라운드.강화(+1): 피해 +1d6.",
    desc: "마법 물감을 생물에 뿌려 눈부시게 합니다. <strong>1d6 피해</strong>(기본 반사)+실패 시 눈부심 1라운드.<br><strong>강화(+1):</strong> 피해 +1d6." },

  { name_ko: "파괴의 울부짖음", name_en: "Cry of Destruction", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "조작", "음파"],
    summary: "파괴적인 울부짖음. 1d8 음파 피해(기본 인내).강화(+1): 피해 +1d8.",
    desc: "파괴적인 울부짖음. <strong>1d8 음파 피해</strong>(기본 인내).<br><strong>강화(+1):</strong> 피해 +1d8." },

  { name_ko: "어둠의 시야", name_en: "Darkened Sight", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["어둠", "클레릭"],
    summary: "대상의 시야를 어둡게 합니다. 인내 실패 시 눈부심(dazzled). 대실패 시 눈멈(blinded)(1라운드 후 눈부심으로 전환).",
    desc: "대상의 시야를 어둡게 합니다. 인내 실패 시 <strong>눈부심(dazzled)</strong>. 대실패 시 <strong>눈멈(blinded)</strong>(1라운드 후 눈부심으로 전환)." },

  { name_ko: "눈부신 섬광", name_en: "Dazzling Flash", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "빛", "조작", "시각"],
    summary: "종교 상징을 들어올려 눈부신 빛의 섬광을 만듭니다.대성공: 영향 없음. 성공: 눈부심 1라운드. 실패: 눈멈 1라운드+눈부심 1분. 대실패: 눈멈 1라운드+눈부심 1시간.강화(3랭크): 영역 30피트 원뿔.",
    desc: "종교 상징을 들어올려 눈부신 빛의 섬광을 만듭니다.<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 눈부심 1라운드. <strong>실패:</strong> 눈멈 1라운드+눈부심 1분. <strong>대실패:</strong> 눈멈 1라운드+눈부심 1시간.<br><strong>강화(3랭크):</strong> 영역 30피트 원뿔." },

  { name_ko: "망상적 자만", name_en: "Delusional Pride", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "감정", "정신"],
    summary: "과도한 자신감으로 방어를 낮추게 합니다. 의지 실패 시 대상이 자신의 AC/내성에 대한 보너스를 유지하되 실제로는 적용하지 않습니다(자신이 더 강하다고 착각).",
    desc: "과도한 자신감으로 방어를 낮추게 합니다. 의지 실패 시 대상이 자신의 AC/내성에 대한 보너스를 유지하되 실제로는 적용하지 않습니다(자신이 더 강하다고 착각)." },

  { name_ko: "파괴적 기운", name_en: "Destructive Aura", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭"],
    summary: "파괴의 기운. 영역 내 아군의 타격이 추가 1d6 피해(무기 특성 효과와 같은 유형). 유지 필요 없음.",
    desc: "파괴의 기운. 영역 내 아군의 타격이 <strong>추가 1d6 피해</strong>(무기 특성 효과와 같은 유형). 유지 필요 없음." },

  { name_ko: "공기로 분산", name_en: "Disperse into Air", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["공기", "클레릭", "조작", "변이"],
    summary: "유발 피해를 받은 후 공기로 변합니다. 턴 종료까지 면역(물리 피해)이며, 60피트까지 비행 이동 후 원래 형태로 돌아옵니다.",
    desc: "유발 피해를 받은 후 공기로 변합니다. 턴 종료까지 면역(물리 피해)이며, 60피트까지 비행 이동 후 원래 형태로 돌아옵니다." },

  { name_ko: "폭포", name_en: "Downpour", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "조작", "물"],
    summary: "폭우를 내립니다. 영역이 은폐를 제공하고 비마법 화염을 끕니다. 영역 내 화염 주문의 피해가 절반.",
    desc: "폭우를 내립니다. 영역이 <strong>은폐</strong>를 제공하고 비마법 화염을 끕니다. 영역 내 화염 주문의 피해가 절반." },

  { name_ko: "대지 공사", name_en: "Earthworks", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["대지", "클레릭", "조작"],
    summary: "대지를 솟구치게 하거나 함몰시킵니다. 영역을 험지로 만들거나, 기존 험지를 정상 지형으로 변환합니다.",
    desc: "대지를 솟구치게 하거나 함몰시킵니다. 영역을 <strong>험지</strong>로 만들거나, 기존 험지를 정상 지형으로 변환합니다." },

  { name_ko: "정령의 배신", name_en: "Elemental Betrayal", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭"],
    summary: "30피트 발산 내 적이 정령 특성의 효과에 피해를 받을 때 추가 2 피해.강화(+1): 추가 피해 +2.",
    desc: "30피트 발산 내 적이 정령 특성의 효과에 피해를 받을 때 <strong>추가 2 피해</strong>.<br><strong>강화(+1):</strong> 추가 피해 +2." },

  { name_ko: "에너지 흡수", name_en: "Energy Absorption", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["클레릭"],
    summary: "에너지 피해를 흡수합니다. 유발 피해를 최대 30만큼 감소. 감소시킨 피해만큼 다음 공격에 같은 유형의 추가 피해를 줄 수 있습니다(1라운드 내).",
    desc: "에너지 피해를 흡수합니다. 유발 피해를 <strong>최대 30만큼 감소</strong>. 감소시킨 피해만큼 다음 공격에 같은 유형의 <strong>추가 피해</strong>를 줄 수 있습니다(1라운드 내)." },

  { name_ko: "언데드 근절", name_en: "Eradicate Undeath", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "활력"],
    summary: "활력 에너지의 파동이 언데드를 불태웁니다. 4d12 활력 피해(기본 인내, 언데드에만 영향).강화(+1): 피해 +1d12.",
    desc: "활력 에너지의 파동이 언데드를 불태웁니다. <strong>4d12 활력 피해</strong>(기본 인내, 언데드에만 영향).<br><strong>강화(+1):</strong> 피해 +1d12." },

  { name_ko: "군중 속의 얼굴", name_en: "Face in the Crowd", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "조작", "시각"],
    summary: "비슷한 생물의 군중 속에서 외모가 무난하고 눈에 띄지 않게 됩니다. 기만/은신에 +2 상태 보너스. 군중에 의한 험지 무시.강화(3랭크): 10피트 사거리, 최대 10 대상.",
    desc: "비슷한 생물의 군중 속에서 외모가 무난하고 눈에 띄지 않게 됩니다. 기만/은신에 <strong>+2 상태 보너스</strong>. 군중에 의한 험지 무시.<br><strong>강화(3랭크):</strong> 10피트 사거리, 최대 10 대상." },

  { name_ko: "치명적 아리아", name_en: "Fatal Aria", rank: 10, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["바드", "작곡", "죽음", "감정", "정신"],
    summary: "너무 완벽한 음악으로 대상이 기쁨이나 슬픔으로 죽을 수 있습니다. 대상 1분 면역. 16레벨 이하: 즉사. 17레벨: HP 50 이하면 즉사, 아니면 빈사 1. 18레벨 이상: 50 피해, 0 HP가 되면 즉사.",
    desc: "너무 완벽한 음악으로 대상이 기쁨이나 슬픔으로 죽을 수 있습니다. 대상 1분 면역. 16레벨 이하: 즉사. 17레벨: HP 50 이하면 즉사, 아니면 빈사 1. 18레벨 이상: 50 피해, 0 HP가 되면 즉사." },

  { name_ko: "화염 광선", name_en: "Fire Ray", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "화염", "조작"],
    summary: "화염 광선을 발사합니다. 주문 명중 굴림. 2d6 화염 피해. 치명 시 1d4 지속 화염 피해.강화(+1): 피해 +1d6, 지속 +1d4.",
    desc: "화염 광선을 발사합니다. 주문 명중 굴림. <strong>2d6 화염 피해</strong>. 치명 시 <strong>1d4 지속 화염 피해</strong>.<br><strong>강화(+1):</strong> 피해 +1d6, 지속 +1d4." },

  { name_ko: "화염 장벽", name_en: "Flame Barrier", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["클레릭"],
    summary: "화염 피해를 흡수합니다. 대상이 받을 화염 피해를 최대 15만큼 감소시킵니다.강화(6랭크): 감소 30.",
    desc: "화염 피해를 흡수합니다. 대상이 받을 화염 피해를 <strong>최대 15만큼 감소</strong>시킵니다.<br><strong>강화(6랭크):</strong> 감소 30." },

  { name_ko: "힘의 화살", name_en: "Force Bolt", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["힘", "위자드"],
    summary: "마법 힘의 화살을 발사합니다. 1d4+1 힘 피해(자동 명중). 힘의 포격(Force Barrage)과 유사하지만 1발만.강화(+2): 피해 +1d4+1.",
    desc: "마법 힘의 화살을 발사합니다. <strong>1d4+1 힘 피해</strong>(자동 명중). 힘의 포격(Force Barrage)과 유사하지만 1발만.<br><strong>강화(+2):</strong> 피해 +1d4+1." },

  { name_ko: "소환 강화", name_en: "Fortify Summoning", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["위자드"],
    summary: "다음 소환 주문을 강화합니다. 이 턴에 시전하는 소환 주문으로 소환된 생물이 10 임시 HP와 공격에 +1 상태 보너스를 얻습니다.",
    desc: "다음 소환 주문을 강화합니다. 이 턴에 시전하는 소환 주문으로 소환된 생물이 <strong>10 임시 HP</strong>와 공격에 <strong>+1 상태 보너스</strong>를 얻습니다." },

  { name_ko: "포르티시모 작곡", name_en: "Fortissimo Composition", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "자유 행동", traits: ["바드", "주문형성"],
    summary: "뮤즈: 거장(maestro)뮤즈에 호소하여 용기의 찬가/집결의 찬가/힘의 노래의 혜택을 크게 증가시킵니다. 다음 행동이 이 작곡 중 하나면 공연 판정을 시도합니다. 대성공: 상태 보너스 +3으로 증가. 성공: +2....",
    desc: "<strong>뮤즈:</strong> 거장(maestro)<br>뮤즈에 호소하여 용기의 찬가/집결의 찬가/힘의 노래의 혜택을 크게 증가시킵니다. 다음 행동이 이 작곡 중 하나면 공연 판정을 시도합니다. <strong>대성공:</strong> 상태 보너스 +3으로 증가. <strong>성공:</strong> +2. <strong>실패:</strong> 정상(+1), 집중점 미소비." },

  { name_ko: "진실의 일별", name_en: "Glimpse the Truth", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "예언", "탐지"],
    summary: "잠시 진실을 봅니다. 영역 내 환영에 대해 즉시 불신을 시도합니다(+2 상황 보너스). 변이/변형 중인 생물의 진짜 형태를 볼 수 있습니다.",
    desc: "잠시 진실을 봅니다. 영역 내 환영에 대해 즉시 불신을 시도합니다(+2 상황 보너스). 변이/변형 중인 생물의 진짜 형태를 볼 수 있습니다." },

  { name_ko: "선의 씨앗", name_en: "Goodberry", rank: 1, is_cantrip: false, is_focus: true,
    traditions: ["primal"], actions: "2행동", traits: ["드루이드", "치유", "조작", "식물", "활력"],
    summary: "열매에 치유의 에너지를 불어넣습니다. 열매를 먹으면 1d6+4 HP 회복하고 하루 영양분을 섭취합니다. 10분 후 마법이 사라집니다.",
    desc: "열매에 치유의 에너지를 불어넣습니다. 열매를 먹으면 <strong>1d6+4 HP 회복</strong>하고 하루 영양분을 섭취합니다. 10분 후 마법이 사라집니다." },

  { name_ko: "중력의 무기", name_en: "Gravity Weapon", rank: 1, is_cantrip: false, is_focus: true,
    traditions: ["primal"], actions: "1행동", traits: ["레인저"],
    summary: "다음 무기 타격에 추가 피해를 부여합니다. 이 턴에 명중한 첫 번째 타격이 추가 1d6 피해를 줍니다.강화(+1): 추가 피해 +1d6.",
    desc: "다음 무기 타격에 추가 피해를 부여합니다. 이 턴에 명중한 첫 번째 타격이 <strong>추가 1d6 피해</strong>를 줍니다.<br><strong>강화(+1):</strong> 추가 피해 +1d6." },

  { name_ko: "힘의 손", name_en: "Hand of the Apprentice", rank: 1, is_cantrip: false, is_focus: true,
    traditions: ["arcane"], actions: "1행동", traits: ["위자드"],
    summary: "손에 든 근접 무기를 마법의 힘으로 날려 적을 공격합니다. 주문 명중 굴림(근접 무기 능력치 사용). 명중 시 무기의 정상 피해 + 지능 수정치를 피해에 추가. 무기가 자동으로 돌아옵니다.",
    desc: "손에 든 근접 무기를 마법의 힘으로 날려 적을 공격합니다. 주문 명중 굴림(근접 무기 능력치 사용). 명중 시 무기의 정상 피해 + 지능 수정치를 피해에 추가. 무기가 자동으로 돌아옵니다." },

  { name_ko: "투석", name_en: "Hurtling Stone", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["대지", "클레릭", "조작"],
    summary: "돌을 마법으로 날립니다. 주문 명중 굴림. 1d6 둔기 피해.강화(+1): 피해 +1d6.",
    desc: "돌을 마법으로 날립니다. 주문 명중 굴림. <strong>1d6 둔기 피해</strong>.<br><strong>강화(+1):</strong> 피해 +1d6." },

  { name_ko: "야심 점화", name_en: "Ignite Ambition", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["클레릭", "감정", "정신", "은밀"],
    summary: "대상의 야심을 강화하여 충성을 바꾸기 쉽게 합니다. 의지 실패 시 유발 효과에 대한 방어에 -1 상태 페널티(자신의 야심을 추구하는 제안이면 -2). 대실패 시 자기 야심을 추구하는 암시를 자동으로 따릅니다.",
    desc: "대상의 야심을 강화하여 충성을 바꾸기 쉽게 합니다. 의지 실패 시 유발 효과에 대한 방어에 <strong>-1 상태 페널티</strong>(자신의 야심을 추구하는 제안이면 -2). 대실패 시 자기 야심을 추구하는 암시를 자동으로 따릅니다." },

  { name_ko: "가시 꿰뚫기", name_en: "Impaling Briars", rank: 8, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["드루이드", "조작", "식물"],
    summary: "가시 나무가 영역에서 자라납니다. 영역이 험지. 당신이 험지를 무시. 유지 시 영역 내 적에 10d6 관통 피해(기본 반사). 이전에 피해를 받지 않은 적에게만.강화(9랭크): 피해 15d6.",
    desc: "가시 나무가 영역에서 자라납니다. 영역이 <strong>험지</strong>. 당신이 험지를 무시. 유지 시 영역 내 적에 <strong>10d6 관통 피해</strong>(기본 반사). 이전에 피해를 받지 않은 적에게만.<br><strong>강화(9랭크):</strong> 피해 15d6." },

  { name_ko: "학제간 주문", name_en: "Interdisciplinary Incantation", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["위자드"],
    summary: "다른 전통의 주문을 비전 주문으로 시전합니다. 비전 목록에 없는 1-3랭크 주문 하나를 선택하여 이번만 비전 주문으로 시전합니다.",
    desc: "다른 전통의 주문을 비전 주문으로 시전합니다. 비전 목록에 없는 1-3랭크 주문 하나를 선택하여 이번만 비전 주문으로 시전합니다." },

  { name_ko: "적 파악", name_en: "Know the Enemy", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "자유 행동", traits: ["레인저"],
    summary: "적에 대한 정보를 즉시 파악합니다. 지식 회상을 한 번 시도하며, 성공 시 대상의 약점/저항/면역 중 하나를 알 수 있습니다.",
    desc: "적에 대한 정보를 즉시 파악합니다. 지식 회상을 한 번 시도하며, 성공 시 대상의 약점/저항/면역 중 하나를 알 수 있습니다." },

  { name_ko: "생명 충전", name_en: "Life Boost", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["드루이드", "치유", "활력"],
    summary: "대상에 임시 HP = 주문 랭크 × 2(1분 지속).강화(+1): 임시 HP +2.",
    desc: "대상에 <strong>임시 HP = 주문 랭크 × 2</strong>(1분 지속).<br><strong>강화(+1):</strong> 임시 HP +2." },

  { name_ko: "작곡 연장", name_en: "Lingering Composition", rank: 1, is_cantrip: false, is_focus: true,
    traditions: ["occult"], actions: "자유 행동", traits: ["바드"],
    summary: "작곡에 장식을 추가하여 효과를 연장합니다. 공연(Performance) 판정을 시도합니다.대성공: 작곡 지속 시간이 4라운드로 증가. 성공: 3라운드. 실패: 1라운드(정상), 집중점 미소비. 대실패: 작곡 실패, ...",
    desc: "작곡에 장식을 추가하여 효과를 연장합니다. 공연(Performance) 판정을 시도합니다.<br><strong>대성공:</strong> 작곡 지속 시간이 <strong>4라운드</strong>로 증가. <strong>성공:</strong> <strong>3라운드</strong>. <strong>실패:</strong> 1라운드(정상), 집중점 미소비. <strong>대실패:</strong> 작곡 실패, 집중점 미소비." },

  { name_ko: "국지 지진", name_en: "Localized Quake", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["대지", "클레릭", "조작"],
    summary: "국지적 지진. 영역 내 적이 반사 내성 시도. 실패 시 넘어뜨려짐+4d6 둔기 피해. 영역이 1분간 험지.",
    desc: "국지적 지진. 영역 내 적이 반사 내성 시도. 실패 시 <strong>넘어뜨려짐+4d6 둔기 피해</strong>. 영역이 1분간 험지." },

  { name_ko: "달인의 에튀드", name_en: "Loremaster's Etude", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "자유 행동", traits: ["바드", "행운", "조작"],
    summary: "뮤즈: 수수께끼(enigma)뮤즈의 깊은 신비에 호소하여 대상의 정보 회상 능력을 강화합니다. 유발 지식 회상 판정을 두 번 굴려 높은 것을 사용합니다.",
    desc: "<strong>뮤즈:</strong> 수수께끼(enigma)<br>뮤즈의 깊은 신비에 호소하여 대상의 정보 회상 능력을 강화합니다. 유발 지식 회상 판정을 <strong>두 번 굴려 높은 것</strong>을 사용합니다." },

  { name_ko: "행운의 기회", name_en: "Lucky Break", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["클레릭", "행운"],
    summary: "실패한 내성 굴림을 다시 굴립니다. 새 결과를 사용해야 합니다.",
    desc: "실패한 내성 굴림을 <strong>다시 굴립니다</strong>. 새 결과를 사용해야 합니다." },

  { name_ko: "마법 독", name_en: "Magic Hide", rank: 1, is_cantrip: false, is_focus: true,
    traditions: ["primal"], actions: "1행동", traits: ["레인저"],
    summary: "동물 동료의 가죽을 마법으로 강화합니다. 동물 동료가 AC에 +2 상태 보너스.",
    desc: "동물 동료의 가죽을 마법으로 강화합니다. 동물 동료가 AC에 <strong>+2 상태 보너스</strong>." },

  { name_ko: "악성 자양분", name_en: "Malignant Sustenance", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "공허"],
    summary: "언데드에 공허 에너지를 주입하여 강화합니다. 대상이 빠른 치유(fast healing) 5를 얻습니다.강화(+1): 빠른 치유 +2.",
    desc: "언데드에 공허 에너지를 주입하여 강화합니다. 대상이 <strong>빠른 치유(fast healing) 5</strong>를 얻습니다.<br><strong>강화(+1):</strong> 빠른 치유 +2." },

  { name_ko: "달의 광란", name_en: "Moon Frenzy", rank: 5, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["드루이드", "변형", "식물"],
    summary: "달빛이 야수적 힘을 부여합니다. 대상이 변이 전투 형태 중이면 공격에 +2 상태 보너스, 피해에 +5, 임시 HP 10. 변이 중이 아니면 발톱 비무장 공격(1d4 참격, 민첩)을 얻고 10 임시 HP.",
    desc: "달빛이 야수적 힘을 부여합니다. 대상이 변이 전투 형태 중이면 공격에 <strong>+2 상태 보너스</strong>, 피해에 <strong>+5</strong>, 임시 HP 10. 변이 중이 아니면 발톱 비무장 공격(1d4 참격, 민첩)을 얻고 10 임시 HP." },

  { name_ko: "달빛", name_en: "Moonbeam", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "공격", "화염", "빛", "조작"],
    summary: "집중된 달빛 광선. 1d6 화염 피해(반사). 대상이 변이(polymorph) 상태면 상쇄를 시도합니다.강화(+1): 피해 +1d6.",
    desc: "집중된 달빛 광선. <strong>1d6 화염 피해</strong>(반사). 대상이 변이(polymorph) 상태면 상쇄를 시도합니다.<br><strong>강화(+1):</strong> 피해 +1d6." },

  { name_ko: "신비의 등대", name_en: "Mystic Beacon", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "조작"],
    summary: "대상이 다음에 시전하는 피해/치유 주문이 1랭크 높은 것처럼 피해/치유를 줍니다(초기 피해/치유에만 적용). 주문 시전 후 종료.",
    desc: "대상이 다음에 시전하는 피해/치유 주문이 <strong>1랭크 높은 것처럼</strong> 피해/치유를 줍니다(초기 피해/치유에만 적용). 주문 시전 후 종료." },

  { name_ko: "복수의 바늘", name_en: "Needle of Vengeance", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["위치", "정신"],
    summary: "복수의 저주. 대상이 다음에 공격을 시도하면 2d6 정신 피해를 받습니다(의지로 절반).강화(+2): 피해 +2d6.",
    desc: "복수의 저주. 대상이 다음에 공격을 시도하면 <strong>2d6 정신 피해</strong>를 받습니다(의지로 절반).<br><strong>강화(+2):</strong> 피해 +2d6." },

  { name_ko: "우로보로스의 송가", name_en: "Ode to Ouroboros", rank: 5, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["바드", "작곡"],
    summary: "당신의 송가가 죽음을 막습니다. 대상의 빈사 수치가 사망 수치보다 1 낮게 유지됩니다. 분해(disintegrate)나 죽음 효과처럼 빈사 수치를 올리지 않고 죽이는 효과에는 도움이 되지 않습니다.",
    desc: "당신의 송가가 죽음을 막습니다. 대상의 빈사 수치가 사망 수치보다 <strong>1 낮게</strong> 유지됩니다. 분해(disintegrate)나 죽음 효과처럼 빈사 수치를 올리지 않고 죽이는 효과에는 도움이 되지 않습니다." },

  { name_ko: "방종의 풍요", name_en: "Overstuff", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "조작"],
    summary: "음식으로 과식시킵니다. 인내 실패 시 구역질(sickened) 1. 대실패 시 구역질 2. 이 구역질의 인내 판정에 -2.",
    desc: "음식으로 과식시킵니다. 인내 실패 시 <strong>구역질(sickened) 1</strong>. 대실패 시 구역질 2. 이 구역질의 인내 판정에 -2." },

  { name_ko: "완벽한 몸", name_en: "Perfected Body", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["클레릭"],
    summary: "몸의 완벽함이 약간 더 건강하게 유지합니다. 대실패를 실패로, 실패를 성공으로 변경합니다.",
    desc: "몸의 완벽함이 약간 더 건강하게 유지합니다. <strong>대실패를 실패로, 실패를 성공으로</strong> 변경합니다." },

  { name_ko: "완벽한 정신", name_en: "Perfected Mind", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭"],
    summary: "완벽함에 대해 명상하여 정신의 모든 방해를 제거합니다. 현재 영향받는 정신 효과(의지 내성이 필요했던 것) 하나에 대해 새로운 의지 내성을 시도합니다. 새 결과가 원래보다 나쁘면 변화 없음. 같은 효과에 1회만 사용...",
    desc: "완벽함에 대해 명상하여 정신의 모든 방해를 제거합니다. 현재 영향받는 정신 효과(의지 내성이 필요했던 것) 하나에 대해 <strong>새로운 의지 내성</strong>을 시도합니다. 새 결과가 원래보다 나쁘면 변화 없음. 같은 효과에 1회만 사용 가능." },

  { name_ko: "사역마 위상", name_en: "Phase Familiar", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["위치"],
    summary: "사역마가 에테르 차원으로 잠시 이동하여 피해를 회피합니다. 유발 피해를 완전히 무시합니다.",
    desc: "사역마가 에테르 차원으로 잠시 이동하여 피해를 회피합니다. 유발 피해를 <strong>완전히 무시</strong>합니다." },

  { name_ko: "유혹의 피리", name_en: "Pied Piping", rank: 10, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["바드", "작곡", "무력화", "정신", "음파"],
    summary: "청취자를 황홀하게 하여 따라오도록 합니다. 유지 시 반경 +5피트. 실패 시 매혹+모든 행동으로 당신을 향해 이동+칭찬. 대실패 시 하수인 특성+지배당함.",
    desc: "청취자를 황홀하게 하여 따라오도록 합니다. 유지 시 반경 +5피트. 실패 시 매혹+모든 행동으로 당신을 향해 이동+칭찬. 대실패 시 하수인 특성+지배당함." },

  { name_ko: "귀금속", name_en: "Precious Metals", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "조작"],
    summary: "무기를 귀금속으로 일시 변환합니다. 냉철(cold iron) 또는 은(silver)으로 변환하여 해당 재료의 약점을 활용할 수 있습니다.",
    desc: "무기를 귀금속으로 일시 변환합니다. 냉철(cold iron) 또는 은(silver)으로 변환하여 해당 재료의 약점을 활용할 수 있습니다." },

  { name_ko: "보호의 수호", name_en: "Protective Wards", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭"],
    summary: "보호 수호. 영역 내 아군이 내성 굴림에 +1 상태 보너스.",
    desc: "보호 수호. 영역 내 아군이 내성 굴림에 <strong>+1 상태 보너스</strong>." },

  { name_ko: "문명의 맥박", name_en: "Pulse of Civilization", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "조작"],
    summary: "도시의 에너지를 끌어와 주변을 안전하게 합니다. 60피트 발산 내 험지가 정상 지형이 되고, 아군이 이동 속도에 +10피트.",
    desc: "도시의 에너지를 끌어와 주변을 안전하게 합니다. 60피트 발산 내 험지가 정상 지형이 되고, 아군이 이동 속도에 +10피트." },

  { name_ko: "밀어내는 돌풍", name_en: "Pushing Gust", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["공기", "클레릭", "조작"],
    summary: "강력한 돌풍으로 대상을 밀어냅니다. 성공: 5피트 밀려남. 실패: 10피트. 대실패: 10피트+넘어뜨려짐.",
    desc: "강력한 돌풍으로 대상을 밀어냅니다. <strong>성공:</strong> 5피트 밀려남. <strong>실패:</strong> 10피트. <strong>대실패:</strong> 10피트+넘어뜨려짐." },

  { name_ko: "운명 읽기", name_en: "Read Fate", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "예언"],
    summary: "대상의 가까운 미래에 대한 예감을 얻습니다. 대상이 이번 조우에서 한 판정에 d4를 추가할 수 있습니다(1회).",
    desc: "대상의 가까운 미래에 대한 예감을 얻습니다. 대상이 이번 조우에서 한 판정에 <strong>d4를 추가</strong>할 수 있습니다(1회)." },

  { name_ko: "죽음의 거부", name_en: "Rebuke Death", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "치유", "활력"],
    summary: "죽음 직전의 생물에 활력을 불어넣습니다. 0 HP인 대상이 4d6 HP를 회복합니다.강화(+1): 회복 +1d6.",
    desc: "죽음 직전의 생물에 활력을 불어넣습니다. 0 HP인 대상이 <strong>4d6 HP를 회복</strong>합니다.<br><strong>강화(+1):</strong> 회복 +1d6." },

  { name_ko: "보복의 고통", name_en: "Retributive Pain", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["클레릭", "정신"],
    summary: "고통을 되돌려줍니다. 유발 적에 4d6 정신 피해(인내 절반). 대실패 시 느려짐 1(1라운드)도.",
    desc: "고통을 되돌려줍니다. 유발 적에 <strong>4d6 정신 피해</strong>(인내 절반). 대실패 시 <strong>느려짐 1</strong>(1라운드)도." },

  { name_ko: "감시의 룬", name_en: "Rune of Observation", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["위자드", "탐지", "조작"],
    summary: "감시 룬을 남깁니다. 룬에서 30피트 이내의 모든 것을 당신의 감각으로 인지할 수 있습니다.",
    desc: "감시 룬을 남깁니다. 룬에서 30피트 이내의 모든 것을 당신의 감각으로 인지할 수 있습니다." },

  { name_ko: "비밀 수호", name_en: "Safeguard Secret", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "정신"],
    summary: "비밀을 지킵니다. 대상이 지정된 비밀에 대해 거짓말을 하면 기만 판정에 +4 상태 보너스. 정신 탐사(독심술 등)에도 비밀이 보호됩니다.",
    desc: "비밀을 지킵니다. 대상이 지정된 비밀에 대해 거짓말을 하면 기만 판정에 <strong>+4 상태 보너스</strong>. 정신 탐사(독심술 등)에도 비밀이 보호됩니다." },

  { name_ko: "고통 음미", name_en: "Savor the Sting", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "정신"],
    summary: "고통에서 쾌감을 추출합니다. 1d4 정신 피해. 의지 실패 시 당신이 해당 피해만큼 임시 HP를 얻습니다(1분).강화(+1): 피해 +1d4.",
    desc: "고통에서 쾌감을 추출합니다. <strong>1d4 정신 피해</strong>. 의지 실패 시 당신이 해당 피해만큼 <strong>임시 HP</strong>를 얻습니다(1분).<br><strong>강화(+1):</strong> 피해 +1d4." },

  { name_ko: "지식의 회상", name_en: "Scholarly Recollection", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["클레릭", "행운"],
    summary: "학문적 지식이 떠오릅니다. 대상이 유발 판정을 두 번 굴려 높은 것을 사용합니다.",
    desc: "학문적 지식이 떠오릅니다. 대상이 유발 판정을 <strong>두 번 굴려 높은 것</strong>을 사용합니다." },

  { name_ko: "몸 뒤섞기", name_en: "Scramble Body", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "조작", "공허"],
    summary: "공허 에너지로 대상의 몸을 뒤섞습니다. 1d4 공허 피해. 인내 실패 시 서투름(clumsy) 1(1라운드). 대실패 시 서투름 2.강화(+1): 피해 +1d4.",
    desc: "공허 에너지로 대상의 몸을 뒤섞습니다. <strong>1d4 공허 피해</strong>. 인내 실패 시 <strong>서투름(clumsy) 1</strong>(1라운드). 대실패 시 서투름 2.<br><strong>강화(+1):</strong> 피해 +1d4." },

  { name_ko: "변형", name_en: "Shifting Form", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "변형"],
    summary: "형태를 변화시킵니다. 다음 중 하나를 선택: 등반 속도 20피트, 수영 속도 20피트, 암시야, 도달 +5피트 비무장 공격.강화(6랭크): 2가지 선택.",
    desc: "형태를 변화시킵니다. 다음 중 하나를 선택: 등반 속도 20피트, 수영 속도 20피트, 암시야, 도달 +5피트 비무장 공격.<br><strong>강화(6랭크):</strong> 2가지 선택." },

  { name_ko: "진정의 발라드", name_en: "Soothing Ballad", rank: 7, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["바드", "작곡", "감정", "치유", "조작", "정신"],
    summary: "뮤즈에 의지하여 아군을 치유합니다. 세 가지 효과 중 선택: 공포 상쇄 시도, 마비 상쇄 시도, 또는 7d8 HP 회복.강화(+1): 치유 시 +1d8.",
    desc: "뮤즈에 의지하여 아군을 치유합니다. 세 가지 효과 중 선택: 공포 상쇄 시도, 마비 상쇄 시도, 또는 <strong>7d8 HP 회복</strong>.<br><strong>강화(+1):</strong> 치유 시 +1d8." },

  { name_ko: "달래는 말", name_en: "Soothing Words", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "감정", "정신"],
    summary: "달래는 말로 안정시킵니다. 대상이 공포(frightened) 상태이면 공포 수치를 1 감소. 또한 정신 효과에 대한 다음 내성에 +1 상태 보너스.",
    desc: "달래는 말로 안정시킵니다. 대상이 공포(frightened) 상태이면 <strong>공포 수치를 1 감소</strong>. 또한 정신 효과에 대한 다음 내성에 +1 상태 보너스." },

  { name_ko: "공포의 나선", name_en: "Spiral of Horrors", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "감정", "공포", "환영", "정신"],
    summary: "끔찍한 환영의 소용돌이. 의지 실패 시 공포 2+4d6 정신 피해. 유지 시 재피해(2d6 정신, 의지 절반).",
    desc: "끔찍한 환영의 소용돌이. 의지 실패 시 <strong>공포 2+4d6 정신 피해</strong>. 유지 시 재피해(2d6 정신, 의지 절반)." },

  { name_ko: "돌발 전환", name_en: "Sudden Shift", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["클레릭", "조작"],
    summary: "위험한 곳에서 재빨리 벗어나며 자신을 숨깁니다. 한 걸음(Step)을 밟고 은폐(concealed) 상태가 됩니다.",
    desc: "위험한 곳에서 재빨리 벗어나며 자신을 숨깁니다. 한 걸음(Step)을 밟고 <strong>은폐(concealed)</strong> 상태가 됩니다." },

  { name_ko: "달콤한 꿈", name_en: "Sweet Dream", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "3행동", traits: ["클레릭", "정신"],
    summary: "달콤한 꿈으로 보호합니다. 대상이 악몽이나 다른 정신 방해에 면역이 되며, 1d8 HP를 회복합니다.",
    desc: "달콤한 꿈으로 보호합니다. 대상이 악몽이나 다른 정신 방해에 <strong>면역</strong>이 되며, <strong>1d8 HP를 회복</strong>합니다." },

  { name_ko: "자유로운 심장의 교향곡", name_en: "Symphony of the Unfettered Heart", rank: 5, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["바드", "작곡"],
    summary: "공연 판정으로 조이기, 이동 불가, 마비, 억제, 느려짐, 멍해짐 중 하나를 상쇄합니다. 상태의 원천에 따라 상쇄 DC 결정.강화(9랭크): 최대 4 대상.",
    desc: "공연 판정으로 조이기, 이동 불가, 마비, 억제, 느려짐, 멍해짐 중 하나를 상쇄합니다. 상태의 원천에 따라 상쇄 DC 결정.<br><strong>강화(9랭크):</strong> 최대 4 대상." },

  { name_ko: "경과 관찰", name_en: "Take Its Course", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "조작"],
    summary: "질병/독 고통이나 지속 독 피해의 진행을 서두르게 합니다. 대상이 즉시 다음 내성 굴림을 시도합니다. 내성에 +2 또는 -2 상태 보너스/페널티를 선택하여 부여할 수 있습니다.",
    desc: "질병/독 고통이나 지속 독 피해의 진행을 서두르게 합니다. 대상이 즉시 다음 내성 굴림을 시도합니다. 내성에 +2 또는 -2 상태 보너스/페널티를 선택하여 부여할 수 있습니다." },

  { name_ko: "폭풍 군주", name_en: "Tempest Surge", rank: 1, is_cantrip: false, is_focus: true,
    traditions: ["primal"], actions: "2행동", traits: ["공기", "드루이드", "전기", "조작"],
    summary: "번개를 소환하여 적에게 1d12 전기 피해. 실패 시 피해+서투름(clumsy) 2(1라운드). 대실패 시 2배 피해+서투름 2.강화(+1): 피해 +1d12.",
    desc: "번개를 소환하여 적에게 <strong>1d12 전기 피해</strong>. 실패 시 피해+<strong>서투름(clumsy) 2</strong>(1라운드). 대실패 시 2배 피해+서투름 2.<br><strong>강화(+1):</strong> 피해 +1d12." },

  { name_ko: "조류 파도", name_en: "Tidal Surge", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "조작", "물"],
    summary: "물의 파도로 밀어냅니다. 인내 실패 시 5피트 밀려남. 대실패 시 10피트+넘어뜨려짐.",
    desc: "물의 파도로 밀어냅니다. 인내 실패 시 <strong>5피트 밀려남</strong>. 대실패 시 10피트+넘어뜨려짐." },

  { name_ko: "복종의 접촉", name_en: "Touch of Obedience", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "조작", "정신"],
    summary: "의지력을 침식합니다. 성공: 멍청함 1(다음 턴 끝까지). 실패: 멍청함 2. 대실패: 멍청함 2(1분)+넘어뜨려짐.",
    desc: "의지력을 침식합니다. <strong>성공:</strong> 멍청함 1(다음 턴 끝까지). <strong>실패:</strong> 멍청함 2. <strong>대실패:</strong> 멍청함 2(1분)+넘어뜨려짐." },

  { name_ko: "언데드의 접촉", name_en: "Touch of Undeath", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "조작", "공허"],
    summary: "언데드의 힘으로 공격합니다. 1d6 공허 피해. 인내 실패 시 약화 1(1라운드). 대실패 시 약화 2.강화(+1): 피해 +1d6.",
    desc: "언데드의 힘으로 공격합니다. <strong>1d6 공허 피해</strong>. 인내 실패 시 <strong>약화 1</strong>(1라운드). 대실패 시 약화 2.<br><strong>강화(+1):</strong> 피해 +1d6." },

  { name_ko: "달의 접촉", name_en: "Touch of the Moon", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "빛", "조작"],
    summary: "달의 에너지를 부여합니다. 대상이 선택 시 은은한 빛을 내어 10피트 범위 희미한 빛. 또한 암시야(darkvision)를 얻거나, 이미 있으면 상위 암시야.",
    desc: "달의 에너지를 부여합니다. 대상이 선택 시 은은한 빛을 내어 10피트 범위 희미한 빛. 또한 <strong>암시야(darkvision)</strong>를 얻거나, 이미 있으면 <strong>상위 암시야</strong>." },

  { name_ko: "방해 없는 보폭", name_en: "Unimpeded Stride", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["레인저"],
    summary: "비마법적 험지를 무시합니다. 극심 험지를 일반 험지로 취급합니다.",
    desc: "마법이 아닌 <strong>험한 지형을 무시</strong>합니다. 극심한 험한 지형은 일반 험한 지형으로 취급합니다. <strong>지속:</strong> 1분." },

  { name_ko: "야생 해방", name_en: "Untamed Form", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["드루이드", "변형"],
    summary: "야생의 힘이 형태를 변화시킵니다. 비무장 공격에 +1 상태 보너스를 얻고, 비무장 공격이 마법 특성을 얻습니다.",
    desc: "야생의 힘이 형태를 변화시킵니다. 비무장 공격에 <strong>+1 상태 보너스</strong>를 얻고, 비무장 공격이 <strong>마법</strong> 특성을 얻습니다." },

  { name_ko: "흔적 없는 이동", name_en: "Vanishing Tracks", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["레인저"],
    summary: "당신과 아군의 발자국/흔적을 제거합니다. 추적 DC가 +4 증가합니다.",
    desc: "당신과 아군의 발자국/흔적을 제거합니다. 추적 DC가 <strong>+4</strong> 증가합니다." },

  { name_ko: "자신감의 장막", name_en: "Veil of Confidence", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "감정", "정신"],
    summary: "자신감이 넘쳐흐릅니다. 피해 굴림에 +1 상태 보너스+최초 성공을 대성공으로 취급 가능(1회). 적에게 성공 시 실패로 취급 가능(1회).",
    desc: "자신감이 넘쳐흐릅니다. 피해 굴림에 <strong>+1 상태 보너스</strong>+최초 성공을 대성공으로 취급 가능(1회). 적에게 성공 시 실패로 취급 가능(1회)." },

  { name_ko: "활기찬 가시", name_en: "Vibrant Thorns", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["드루이드", "변형", "식물"],
    summary: "몸에 가시가 자라납니다. 비무장 타격에 1d6 관통 피해 추가. 조이기(grab)를 시도하는 적에 가시 피해.",
    desc: "몸에 가시가 자라납니다. 비무장 타격에 <strong>1d6 관통 피해 추가</strong>. 조이기(grab)를 시도하는 적에 가시 피해." },

  { name_ko: "활력의 빛", name_en: "Vital Luminance", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "빛", "조작", "활력"],
    summary: "생명력을 끌어와 빛의 등대가 됩니다. 30피트 발산 밝은 빛. 내부 빛 저장소(4로 시작, 매 턴 +4). 빛 영역 내 언데드가 공격 시 저장소 절반의 활력 피해. 해제 시 저장소 전체의 HP를 살아있는 대상에 회복...",
    desc: "생명력을 끌어와 빛의 등대가 됩니다. 30피트 발산 밝은 빛. 내부 빛 저장소(4로 시작, 매 턴 +4). 빛 영역 내 언데드가 공격 시 저장소 절반의 활력 피해. 해제 시 저장소 전체의 HP를 살아있는 대상에 회복 또는 언데드 대상에 활력 피해." },

  { name_ko: "무기 강화", name_en: "Weapon Surge", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭", "조작"],
    summary: "무기에 신성한 에너지를 불어넣습니다. 무기의 다음 타격에 추가 1d6 피해(무기와 같은 유형).",
    desc: "무기에 신성한 에너지를 불어넣습니다. 무기의 다음 타격에 <strong>추가 1d6 피해</strong>(무기와 같은 유형)." },

  { name_ko: "속삭이는 고요", name_en: "Whispering Quiet", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "2행동", traits: ["클레릭", "조작", "음파"],
    summary: "영역 내 소리를 억압합니다. 5피트 이상 떨어진 생물은 지각 판정(주문 DC) 없이 영역 내 목소리를 들을 수 없습니다.",
    desc: "영역 내 소리를 억압합니다. 5피트 이상 떨어진 생물은 지각 판정(주문 DC) 없이 영역 내 목소리를 들을 수 없습니다." },

  { name_ko: "야생 변신", name_en: "Wild Shape", rank: 1, is_cantrip: false, is_focus: true,
    traditions: ["primal"], actions: "2행동", traits: ["드루이드", "조작", "변이"],
    summary: "자연의 형태로 변신합니다. 해충 형태(Pest Form)를 1시간 동안 시전하거나, 알고 있는 다른 변이 전투 형태 주문(동물 형태, 곤충 형태 등)을 시전합니다. 더 높은 레벨에서 더 많은 형태에 접근합니다.",
    desc: "자연의 형태로 변신합니다. 해충 형태(Pest Form)를 1시간 동안 시전하거나, 알고 있는 다른 변이 전투 형태 주문(동물 형태, 곤충 형태 등)을 시전합니다. 더 높은 레벨에서 더 많은 형태에 접근합니다." },

  { name_ko: "자유의 말씀", name_en: "Word of Freedom", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭"],
    summary: "자유의 말로 속박을 풀어줍니다. 대상이 조이기(grabbed), 이동 불가(immobilized), 마비(paralyzed), 억제(restrained) 중 하나에서 즉시 해방됩니다. 또한 다음 턴 끝까지 이 상태에...",
    desc: "자유의 말로 속박을 풀어줍니다. 대상이 조이기(grabbed), 이동 불가(immobilized), 마비(paralyzed), 억제(restrained) 중 하나에서 즉시 해방됩니다. 또한 다음 턴 끝까지 이 상태에 대해 +4 상태 보너스." },

  { name_ko: "진실의 말씀", name_en: "Word of Truth", rank: 1, is_cantrip: false, is_focus: true,
    traditions: [], actions: "1행동", traits: ["클레릭"],
    summary: "진실만 말할 수 있게 됩니다. 지속 시간 동안 당신은 의도적으로 거짓말을 할 수 없으며, 다른 생물이 이를 인지합니다. 기만에 대한 지각 판정에 +4 상태 보너스.",
    desc: "진실만 말할 수 있게 됩니다. 지속 시간 동안 당신은 의도적으로 거짓말을 할 수 없으며, 다른 생물이 이를 인지합니다. 기만에 대한 지각 판정에 <strong>+4 상태 보너스</strong>." },

  { name_ko: "전투 열정", name_en: "Zeal for Battle", rank: 4, is_cantrip: false, is_focus: true,
    traditions: [], actions: "반응", traits: ["클레릭", "감정", "정신"],
    summary: "전투 열정이 불타오릅니다. 영역 내 아군이 선제력 굴림에 +2 상태 보너스. 가장 높은 선제력을 가진 아군 1명은 1라운드간 가속(quickened)(보폭/타격에만 사용 가능).",
    desc: "전투 열정이 불타오릅니다. 영역 내 아군이 선제력 굴림에 <strong>+2 상태 보너스</strong>. 가장 높은 선제력을 가진 아군 1명은 1라운드간 <strong>가속(quickened)</strong>(보폭/타격에만 사용 가능)." },


];
