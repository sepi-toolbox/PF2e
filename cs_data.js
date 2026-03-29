// ═══════════════════════════════════════════════
//  DATA — from Player Core Korean translation
// ═══════════════════════════════════════════════

const CLASSES = [
  {id:'bard', name:'바드', en:'Bard', hp:8,
   keyAttr:'매력 (CHA)', tradition:'occult', casting:'spontaneous',
   saves:{fort:'숙련',ref:'숙련',will:'전문가'}, perc:'전문가',
   desc:'당신은 예술의 달인, 숨겨진 비밀의 학자, 그리고 매혹적인 설득가입니다. 강력한 공연을 사용하여 마음에 영향을 주고 영혼을 새로운 수준의 영웅주의로 고양시킵니다. 카리스마 넘치는 지도자가 될 수도 있고, 아니면 상담사, 조종자, 학자, 불량배, 또는 거장이 될 수도 있습니다. 다재다능함이 일부로 하여금 당신을 매혹적인 하는 일 없는 사람이자 만물박사라 여기게 하지만, 당신을 어떤 것도 통달하지 못한 자로 치부하는 것은 위험합니다.<br><br><br><strong>전투 조우 중...</strong> 마법 공연으로 아군에게 유리하게 상황을 바꿉니다. 필요에 따라 공격, 치유, 유용한 주문 사이를 자신 있게 오갑니다.<br><br><br><strong>사회적 조우 중...</strong> 쉽게 설득하고, 거짓말하고, 위협합니다.<br><br><br><strong>탐험 중...</strong> 지식, 민담, 전설, 전승의 보고로, 그룹의 모험에 더 깊은 맥락과 유용한 정찰을 제공합니다. 주문과 공연이 동료에게 더 큰 발견과 성공을 영감합니다.<br><br><br><strong>휴식 중...</strong> 공연으로 돈과 명성을 벌고, 이름을 알리고 후원자를 얻습니다. 결국 재능과 승리에 대한 이야기가 다른 바드를 끌어 바드 대학에서 당신의 기법을 공부하게 할 수 있습니다.<br><br><br><strong>당신은 아마도...</strong><br>• 예술에 대한 열정이 강하여 영적 연결을 맺습니다.<br>• 재치와 비폭력적 해결이 필요할 때 선두에 섭니다.<br>• 신비로운 페이 생물, 철학적 개념, 심령력, 또는 예술이나 음악의 신격이든, 뮤즈를 따르며 그 도움으로 소수만이 가진 비밀 전승을 배웁니다.<br>• 공연자나 손님으로 사교 행사에 초대할 기회를 반기지만, 사교계에서 당신을 일종의 호기심 대상으로 여깁니다.<br>• 다른 주문시전자에 비해 과소평가하며, 당신이 멋부리는 음유시인에 불과하고 마법의 미묘한 힘을 간과합니다.<br><br><br><strong>다른 사람들은 아마도...</strong><br>• 공연자나 손님으로 사교 행사에 초대할 기회를 반기지만, 사교계에서 당신을 일종의 호기심 대상으로 여깁니다.<br>• 다른 주문시전자에 비해 과소평가하며, 당신이 멋부리는 음유시인에 불과하고 마법의 미묘한 힘을 간과합니다.<br>• 사교적 매력과 능력에 호의적으로 반응하지만, 매혹적인 마법에 대해서는 경계합니다.',
   skills:'오컬티즘, 공연 + 4+INT개'},
  {id:'cleric', name:'클레릭', en:'Cleric', hp:8,
   keyAttr:'지혜 (WIS)', tradition:'divine', casting:'prepared',
   saves:{fort:'숙련',ref:'숙련',will:'전문가'}, perc:'숙련',
   desc:'신격은 무한한 방법으로 세계에 뜻을 펼치며, 당신은 그들의 가장 충실한 필멸의 하인 중 한 명으로 봉사합니다. 신성한 마법의 축복을 받아, 신앙의 이상을 살고, 교회의 상징으로 자신을 장식하며, 신격의 선호 무기를 다루는 훈련에 부지런히 임합니다. 주문이 아군을 보호하고 치유하거나, 신격의 뜻에 따라 적과 신앙의 적을 벌할 수 있습니다. 당신의 삶은 헌신의 삶이며, 말과 행동 모두로 신앙의 가르침을 전파합니다.',
   skills:'종교학 + 신격기술 + 2+INT개'},
  {id:'druid', name:'드루이드', en:'Druid', hp:8,
   keyAttr:'지혜 (WIS)', tradition:'primal', casting:'prepared',
   saves:{fort:'숙련',ref:'숙련',will:'전문가'}, perc:'숙련',
   desc:'자연의 힘은 저항할 수 없습니다. 수 분 만에 가장 견고한 요새도 무너뜨려 잔해로, 재로, 눈사태 아래로, 또는 파도 아래로 삼킬 수 있습니다. 자연을 존중하는 이에게 끝없는 풍요와 숨 막히는 장관을 줄 수 있고 — 가볍게 여기는 이에게는 고통스러운 죽음을. 당신은 자연의 부름을 듣는 자 중 하나입니다. 그 힘의 위엄 앞에 경외하며 그 봉사에 자신을 바칩니다.',
   skills:'자연 + 2+INT개'},
  {id:'fighter', name:'파이터', en:'Fighter', hp:10,
   keyAttr:'근력 또는 민첩 (STR/DEX)', tradition:null, casting:null,
   saves:{fort:'전문가',ref:'전문가',will:'숙련'}, perc:'전문가',
   desc:'명예, 탐욕, 충성, 또는 순전히 전투의 짜릿함을 위해 싸우는 당신은 무기술과 전투 기법의 논쟁의 여지 없는 대가입니다. 개시 동작, 마무리 타격, 반격의 영리한 조합으로 행동을 연결하며, 적이 방어를 내리는 순간을 놓치지 않습니다. 기사이든, 용병이든, 저격수이든, 검의 달인이든, 무예를 예술의 경지로 연마하여 적에게 파괴적인 치명타를 가합니다.',
   skills:'곡예 또는 운동 + 3+INT개'},
  {id:'ranger', name:'레인저', en:'Ranger', hp:10,
   keyAttr:'근력 또는 민첩 (STR/DEX)', tradition:null, casting:null,
   saves:{fort:'전문가',ref:'전문가',will:'숙련'}, perc:'전문가',
   desc:'일부 레인저는 문명이 영혼을 닳게 하지만 야생 생물로부터 보호해야 한다고 믿습니다. 다른 이들은 자연이 탐욕스러운 자로부터 보호받아야 한다고 합니다. 어느 목표든, 혹은 둘 다를 옹호할 수 있습니다. 정찰병, 추적자, 도주자나 야수의 사냥꾼으로 문명의 끝자락이나 야생을 탐험하며, 자연에서 살아남는 법을 알고 기회의 먹이와 미운 적 모두를 발견하고 쓰러뜨리는 데 능숙합니다.',
   skills:'자연, 생존 + 3+INT개'},
  {id:'rogue', name:'로그', en:'Rogue', hp:8,
   keyAttr:'민첩 (DEX)', tradition:null, casting:null,
   saves:{fort:'숙련',ref:'전문가',will:'전문가'}, perc:'전문가',
   desc:'당신은 기술이 뛰어나고 기회주의적입니다. 날카로운 재치와 빠른 반응으로 적의 실수를 이용하여 가장 아픈 곳을 찌릅니다. 위험한 게임을 즐기며, 스릴을 추구하고 기술을 시험하며, 방해가 되는 법은 대부분 신경 쓰지 않습니다. 모든 로그의 길은 독특하고 위험으로 가득하지만, 모두가 공유하는 것은 기술의 폭과 깊이입니다.',
   skills:'은신 + 7+INT개'},
  {id:'witch', name:'위치', en:'Witch', hp:6,
   keyAttr:'지능 (INT)', tradition:'any', casting:'prepared',
   saves:{fort:'숙련',ref:'숙련',will:'전문가'}, perc:'숙련',
   desc:'당신은 학문이나 헌신이 아닌, 당신조차 완전히 이해하지 못하는 이세계 후원자의 대리인으로서 강력한 마법을 구사합니다. 이 존재는 은밀한 신격, 강력한 페이, 고대의 영혼, 또는 다른 강대한 초자연적 존재일 수 있지만 — 그 본질은 당신에게도 타인에게도 마찬가지로 미스터리일 것입니다. 특별한 사역마를 통해 후원자는 당신이 적절히 사용할 수 있는 다재다능한 주문과 강력한 주술(hex)을 부여하지만, 당신이 단지 후원자의 더 큰 계획을 수행하고 있는 것인지는 확신할 수 없습니다.',
   skills:'오컬티즘 + 3+INT개'},
  {id:'wizard', name:'위자드', en:'Wizard', hp:6,
   keyAttr:'지능 (INT)', tradition:'arcane', casting:'prepared',
   saves:{fort:'숙련',ref:'숙련',will:'전문가'}, perc:'숙련',
   desc:'당신은 우주의 비밀에 대한 영원한 학도로, 마법에 대한 숙달로 강력한 주문을 시전합니다. 마법을 과학처럼 다루며, 최신 실용 주문학 교재와 고대의 서적을 교차 참조하여 비전 마법을 발견하고 이해합니다. 그러나 마법 이론은 방대하여 모두 공부할 수는 없습니다. 대부분의 위자드는 정규 교육을 통해 배우며, 교과과정이 특정 지침을 형성하지만, 특히 열정적인 연구자는 때때로 자신만의 이론을 구축합니다.',
   skills:'주문학 + 3+INT개'},
];

// 클래스 서브클래스 DB
const SUBCLASS_DB = [
  // ── 바드 뮤즈 ──
  {id:'muse-enigma',  class_id:'bard', subclass_type:'뮤즈', name_ko:'수수께끼', name_en:'Enigma',
   summary:'지식과 신비의 뮤즈. 바드는 더 많은 것을 알려는 탐구 본능에 사로잡힙니다. 추가로 오컬티즘(Occultism)에 훈련됨을 얻습니다. 뮤즈 주문: 비전 자물쇠(Arcane Lock). 집중 주문: 용감한 서사(Inspire Competence) 향상.'},
  {id:'muse-maestro', class_id:'bard', subclass_type:'뮤즈', name_ko:'마에스트로',    name_en:'Maestro',
   summary:'공연 예술의 마에스트로에게 영감을 받은 뮤즈. 사람들을 움직이는 능력에 집중합니다. 뮤즈 주문: 숙면(Sleep). 집중 주문: 영웅적 영감(Inspire Heroics) 습득.'},
  {id:'muse-warrior',  class_id:'bard', subclass_type:'뮤즈', name_ko:'전사',    name_en:'Warrior',
   summary:'전투와 전쟁의 영광을 노래하는 뮤즈. 단순 무기와 군용 무기에 훈련됨 추가. 집중 주문: 전투 찬가(Inspire Defense) 습득.'},
  {id:'muse-lore',     class_id:'bard', subclass_type:'뮤즈', name_ko:'지식',    name_en:'Lore',
   summary:'지식과 기억의 수집가인 뮤즈. 지식(Lore) 기술 두 개 추가 훈련됨 획득. 뮤즈 주문: 기억의 방(Memory Palace).'},

  // ── 클레릭 교리 ──
  {id:'doctrine-cloistered', class_id:'cleric', subclass_type:'교리', name_ko:'수도원 성직자', name_en:'Cloistered Cleric',
   summary:'수도원에서 마법을 탐구하는 성직자. 신성 주문에 전문가(Expert) 시작. 대신 무기 훈련됨은 소수만 해당. 도메인 주문 1개 추가 습득.'},
  {id:'doctrine-warpriest',  class_id:'cleric', subclass_type:'교리', name_ko:'전투 사제',    name_en:'Warpriest',
   summary:'전투에서 신의 뜻을 집행하는 성직자. 신격 무기에 훈련됨, 방어구 훈련됨 향상. 대신 주문 랭크 성장이 느림.'},

  // ── 드루이드 교단 ──
  {id:'order-animal', class_id:'druid', subclass_type:'교단', name_ko:'동물', name_en:'Animal',
   summary:'동물과의 깊은 유대. 동물 친구(Animal Companion) 습득. 동물 관련 주문에 이점. 교단 주문: 동물 전령(Animal Messenger).'},
  {id:'order-flame',  class_id:'druid', subclass_type:'교단', name_ko:'불꽃', name_en:'Flame',
   summary:'자연의 불꽃 힘을 다룸. 화염 피해 +1. 집중 주문: 불꽃 씨앗(Flame Seed) 습득.'},
  {id:'order-leaf',   class_id:'druid', subclass_type:'교단', name_ko:'잎',   name_en:'Leaf',
   summary:'식물과 치유의 힘. 치유 주문 DC에 이점. 집중 주문: 치유의 새싹(Goodberry) 습득.'},
  {id:'order-storm',  class_id:'druid', subclass_type:'교단', name_ko:'폭풍', name_en:'Storm',
   summary:'폭풍과 번개를 지휘. 번개 피해 +1. 집중 주문: 폭풍의 부름(Tempest Surge) 습득.'},
  {id:'order-wave',   class_id:'druid', subclass_type:'교단', name_ko:'물결', name_en:'Wave',
   summary:'물과 얼음의 힘. 수중 호흡 상시 효과. 집중 주문: 물의 채찍(Tidal Surge) 습득.'},
  {id:'order-wild',   class_id:'druid', subclass_type:'교단', name_ko:'야생', name_en:'Wild',
   summary:'야수 변신의 달인. 야수 형태(Wild Shape) 집중 주문 습득. 변신 폼이 더 강화됨.'},

  // ── 레인저 사냥 방식 ──
  {id:'edge-flurry',    class_id:'ranger', subclass_type:'사냥 방식', name_ko:'연타',   name_en:'Flurry',
   summary:'속도와 연속 공격에 특화. 사냥 목표에 대한 다중 공격 페널티 감소(-4/-8 → -3/-6).'},
  {id:'edge-outwit',    class_id:'ranger', subclass_type:'사냥 방식', name_ko:'계략',   name_en:'Outwit',
   summary:'전술과 방어에 집중. 사냥 목표에 대한 AC에 상황 보너스 +1 및 회피 기회.'},
  {id:'edge-precision', class_id:'ranger', subclass_type:'사냥 방식', name_ko:'정밀',   name_en:'Precision',
   summary:'정확한 한 방. 사냥 목표 첫 번째 공격에 추가 정밀 피해 +1d8.'},

  // ── 로그 전문 ──
  {id:'racket-acrobat',          class_id:'rogue', subclass_type:'전문', name_ko:'곡예사',      name_en:'Acrobat',
   summary:'민첩한 이동으로 적을 농락. 곡예(Acrobatics) 훈련됨. 적과 인접하거나 지나칠 때 스닉 어택 기회.'},
  {id:'racket-assassin',         class_id:'rogue', subclass_type:'전문', name_ko:'암살자',      name_en:'Assassin',
   summary:'불의의 기습에 특화. 첫 번째 라운드 스닉 어택 +2d6. 독 연구 기술.'},
  {id:'racket-eldritch-trickster', class_id:'rogue', subclass_type:'전문', name_ko:'비전 트릭스터', name_en:'Eldritch Trickster',
   summary:'마법과 교활함의 결합. 주문 트릭(Spell Trickster) 집중 주문 습득. 주문 공격으로 스닉 어택 적용.'},
  {id:'racket-mastermind',       class_id:'rogue', subclass_type:'전문', name_ko:'모략가',      name_en:'Mastermind',
   summary:'지식을 무기로. 사회(Society) 훈련됨. 적을 분석하여 방어불가 상태 유발, 스닉 어택 기회.'},
  {id:'racket-scoundrel',        class_id:'rogue', subclass_type:'전문', name_ko:'악당',        name_en:'Scoundrel',
   summary:'기만과 허세의 달인. 외교(Diplomacy) 훈련됨. 기만/위협 성공 시 적을 방어불가 상태로.'},
  {id:'racket-thief',            class_id:'rogue', subclass_type:'전문', name_ko:'도둑',        name_en:'Thief',
   summary:'손재주와 기습의 전문가. 도둑질(Thievery) 훈련됨. 근접 무기 공격에 민첩 수정치를 피해에 적용.'},

  // ── 위치 후원자 ──
  {id:'patron-curse',  class_id:'witch', subclass_type:'후원자', name_ko:'저주',   name_en:'Curse',   summary:'저주의 힘을 부여하는 후원자. 비의(Occult) 전통. 주술: 악의 눈(Evil Eye). 저주·조종 관련 주문 확장.'},
  {id:'patron-fate',   class_id:'witch', subclass_type:'후원자', name_ko:'운명',   name_en:'Fate',    summary:'운명의 실을 다루는 후원자. 비의(Occult) 전통. 주술: 운명의 실(Thread of Fate). 예지 관련 주문 확장.'},
  {id:'patron-fervor', class_id:'witch', subclass_type:'후원자', name_ko:'열정',   name_en:'Fervor',  summary:'신성한 헌신의 후원자. 신성(Divine) 전통. 주술: 정화의 불꽃(Stoke the Heart). 치유·강화 관련 주문.'},
  {id:'patron-night',  class_id:'witch', subclass_type:'후원자', name_ko:'밤',     name_en:'Night',   summary:'어둠과 꿈의 후원자. 비의(Occult) 전통. 주술: 마녀의 포옹(Witch\'s Cauldron). 환상·공포 관련 주문.'},
  {id:'patron-rune',   class_id:'witch', subclass_type:'후원자', name_ko:'룬',     name_en:'Rune',    summary:'룬 마법의 후원자. 신비(Arcane) 전통. 주술: 룬 저주(Pact of Doom). 변환·방호 관련 주문.'},
  {id:'patron-wild',   class_id:'witch', subclass_type:'후원자', name_ko:'야생',   name_en:'Wild',    summary:'자연 야생의 후원자. 원시(Primal) 전통. 주술: 야생의 분노(Wilding Word). 자연·동물 관련 주문.'},

  // ── 위자드 마법학파 ──
  {id:'school-abjuration',    class_id:'wizard', subclass_type:'마법학파', name_ko:'방호학파',   name_en:'Abjuration',    summary:'방어와 보호 마법 전문. 집중 주문: 마법 방어막(Protective Wards). 방호 주문 자동 습득.'},
  {id:'school-conjuration',   class_id:'wizard', subclass_type:'마법학파', name_ko:'소환학파',   name_en:'Conjuration',   summary:'소환과 공간 마법 전문. 집중 주문: 순간 이동(Dimensional Steps). 소환 주문 자동 습득.'},
  {id:'school-divination',    class_id:'wizard', subclass_type:'마법학파', name_ko:'예지학파',   name_en:'Divination',    summary:'정보와 예언 마법 전문. 집중 주문: 예언의 눈(Diviner\'s Sight). 예지 주문 자동 습득.'},
  {id:'school-enchantment',   class_id:'wizard', subclass_type:'마법학파', name_ko:'조종학파',   name_en:'Enchantment',   summary:'마음 조종 마법 전문. 집중 주문: 마음 통제(Charming Words). 조종 주문 자동 습득.'},
  {id:'school-evocation',     class_id:'wizard', subclass_type:'마법학파', name_ko:'소멸학파',   name_en:'Evocation',     summary:'에너지와 파괴 마법 전문. 집중 주문: 마법 손(Force Bolt). 소멸 주문 자동 습득.'},
  {id:'school-illusion',      class_id:'wizard', subclass_type:'마법학파', name_ko:'환상학파',   name_en:'Illusion',      summary:'환상과 속임 마법 전문. 집중 주문: 환영 숨기기(Warped Terrain). 환상 주문 자동 습득.'},
  {id:'school-necromancy',    class_id:'wizard', subclass_type:'마법학파', name_ko:'죽음학파',   name_en:'Necromancy',    summary:'생명력과 언데드 마법 전문. 집중 주문: 생명 흡수(Call of the Grave). 죽음 주문 자동 습득.'},
  {id:'school-transmutation', class_id:'wizard', subclass_type:'마법학파', name_ko:'변환학파',   name_en:'Transmutation', summary:'변형과 변환 마법 전문. 집중 주문: 마법 손아귀(Shifting Form). 변환 주문 자동 습득.'},
  {id:'school-unified',       class_id:'wizard', subclass_type:'마법학파', name_ko:'통합 마법 이론', name_en:'Unified Magical Theory', summary:'특정 학파 비전문. 모든 마법학파에서 주문 습득 가능. 집중 주문 풀이 더 다양함.'},
];

const ANCESTRIES = [
  {id:'dwarf', name:'드워프', en:'Dwarf', hp:10, size:'중형', speed:20,
   boosts:['건강(CON)','지혜(WIS)','자유'], flaws:['매력(CHA)'],
   traits:['드워프','인간형'], vision:'암시야',
   desc:'드워프는 과묵하고 엄격한 사람들로 잘 알려져 있지만, 억제되지 않는 열정과 장인 정신에 대한 깊은 존중도 가지고 있습니다. 낯선 이에게는 불신이 많고 배타적으로 보일 수 있지만, 친구와 가족에게는 따뜻하고 다정합니다. 드워프의 신뢰는 얻기 어렵지만, 일단 얻으면 철만큼 단단합니다.<br><strong>당신은 아마도...</strong><br>• 개인적 명예를 지키기 위해 노력하고 물러서기를 거부합니다.<br>• 모든 형태의 우수한 장인 정신을 감상하고, 자신의 모든 장비에도 이를 요구합니다.<br>• 당신을 완고하다고 보지만, 이것이 장점인지 단점인지는 순간에 따라 바뀝니다.<br>• 가족, 유산, 친구와의 깊은 유대를 인정합니다.<br><strong>다른 사람들은 아마도...</strong><br>• 당신을 완고하다고 보지만, 이것이 장점인지 단점인지는 순간에 따라 바뀝니다.<br>• 가족, 유산, 친구와의 깊은 유대를 인정합니다.<br><strong>신체 묘사</strong><br>드워프는 키가 작고 땅딸막하며, 대부분의 인간보다 약 30cm(1피트) 정도 작습니다. 넓고 단단한 체격에 건장한 골격을 가지고 있습니다. 모든 성별의 드워프가 머리카락과 수염의 길이를 자랑스럽게 여기며, 종종 복잡한 패턴으로 땋는데, 일부는 특정 씨족을 나타냅니다. 긴 수염은 많은 드워프 씨족에서 성숙과 명예의 상징입니다.<br><strong>사회</strong><br>고대 드워프 제국은 오크와 고블린 적들에게 압도당해 오래전에 무너졌지만, 오늘날의 드워프는 한때 그들을 위대하게 만들었던 자질 — 사나움, 투지, 완고함 — 을 많이 유지하고 있습니다. 드워프는 지표면에 흩어져 있는 산악 하늘 성채(Sky Citadels) 안에서 살며, 이로 인해 드워프 씨족 간에 거대한 문화적 격차가 생길 수 있습니다. 그러나 거의 모든 드워프 민족이 석공, 금속 세공, 가족에 대한 열정을 공유합니다.<br><strong>신앙</strong><br>드워프는 명예를 중시하고 씨족과 왕국의 전통을 충실히 따르는 경향이 있습니다. 우정과 정의에 대한 강한 감각이 있지만, 누구를 친구로 여길지에 대해서는 매우 까다롭습니다. 열심히 일하고 더 열심히 노는데 — 특히 강한 에일이 관련될 때 그렇습니다. 드워프 종족의 신인 토라그(Torag)가 드워프의 주요 신격이며, 토라그의 가족 구성원에 대한 숭배도 일반적입니다.',
   specials:['씨족 단검 무료 획득','암시야(어둠에서 흑백으로 볼 수 있음)']},
  {id:'elf', name:'엘프', en:'Elf', hp:6, size:'중형', speed:30,
   boosts:['민첩(DEX)','지능(INT)','자유'], flaws:['건강(CON)'],
   traits:['엘프','인간형'], vision:'저광 시야',
   desc:'오래된 종족인 엘프는 위대한 변화를 목격했으며, 역사의 흐름을 지켜보면서만 얻을 수 있는 관점을 가지고 있습니다. 고대에 골라리온을 떠났다가 변해버린 땅으로 돌아온 엘프는 여전히 조상의 고향을 되찾기 위해 분투합니다. 엘프는 친절, 지성, 아름다움을 중시하며, 많은 엘프가 예의범절, 외모, 문화를 향상시키기 위해 노력합니다. 그들의 연구는 대부분의 수명이 짧은 종족이 과도하거나 비효율적이라고 여기는 수준의 세부 사항까지 파고듭니다. 엘프는 종종 상당히 사적인 사람들로, 숲과 친족 집단의 비밀에 깊이 빠져 있습니다. 친족 밖에서 우정을 쌓는 데 느린데, 수명이 짧은 종족 사이에서 삶을 보내는 엘프는 세대에 걸친 동료들이 나이 들고 죽는 것을 지켜보면서 우울해지는 경우가 많습니다. 이런 엘프는 동료 엘프 사이에서 "비탄의 엘프(Forlorn)"로 알려져 있습니다.<br><strong>당신은 아마도...</strong><br>• 수명이 짧은 사람들과의 관계를 신중하게 가꿉니다.<br>• 전문적이거나 잘 알려지지 않은 관심사를 순전히 숙달하기 위해 채택합니다.<br>• 외모에 집중하여, 우아함을 감탄하거나 당신을 신체적으로 연약한 것처럼 대합니다.<br>• 당신이 은밀히 자신들을 내려다본다고 걱정하거나, 당신이 오만하고 냉담하다고 느낍니다.<br><strong>다른 사람들은 아마도...</strong><br>• 외모에 집중하여, 우아함을 감탄하거나 당신을 신체적으로 연약한 것처럼 대합니다.<br>• 당신이 은밀히 자신들을 내려다본다고 걱정하거나, 당신이 오만하고 냉담하다고 느낍니다.<br><strong>신체 묘사</strong><br>일반적으로 인간보다 키가 크지만, 엘프는 긴 이목구비와 뾰족한 귀로 강조되는 섬세한 우아함을 지닙니다. 넓고 둥근 눈에는 크고 종종 선명한 색의 동공이 있어, 눈의 전체 보이는 부분을 차지합니다. 이 동공은 이질적인 외모를 주고 매우 어두운 빛에서도 선명하게 볼 수 있게 합니다.<br><strong>사회</strong><br>엘프의 타고난 인내심과 지적 호기심은 그들을 뛰어난 현자, 철학자, 위자드로 만들며, 그들의 사회는 경이와 지식에 대한 타고난 감각 위에 세워져 있습니다.<br><strong>신앙</strong><br>엘프는 종종 감정적이고 변덕스럽지만, 높은 이상을 마음 가까이 품습니다. 신비롭고 예술적인 모든 것에 대한 사랑을 공유하는 신격을 선호합니다. 데스나(Desna)와 셸린(Shelyn)이 특히 좋아하는 신격으로, 전자는 경이감으로, 후자는 예술적 감상으로 인기가 있습니다. 칼리스트리아(Calistria)는 가장 악명 높은 엘프 신격으로, 많은 엘프 이상이 극단으로 치달은 것을 나타냅니다.',
   specials:['저광 시야(희미한 빛에서 밝은 빛처럼 볼 수 있음)']},
  {id:'gnome', name:'노움', en:'Gnome', hp:8, size:'소형', speed:25,
   boosts:['건강(CON)','매력(CHA)','자유'], flaws:['근력(STR)'],
   traits:['노움','인간형'], vision:'저광 시야',
   desc:'오래전, 초기 노움 조상들은 페이의 영역인 첫 번째 세계(First World)에서 이주했습니다. 최초의 노움들이 왜 골라리온으로 떠돌아왔는지는 불분명하지만, 이 혈통은 현대 노움에게 기이한 사고방식, 기이함, 집착적 성향, 그리고 일부가 순진함으로 보는 것으로 나타납니다. 항상 새로운 경험에 굶주린 노움은 정신적으로나 물리적으로 끊임없이 방황하며, 모든 노움을 위협하는 끔찍한 질병을 막으려 합니다. 표백(Bleaching)이라 알려진 이 고통은 꿈꾸고, 혁신하고, 새로운 경험을 받아들이지 못하는 노움을 덮칩니다. 표백은 노움에게서 — 문자 그대로 — 색을 천천히 빼앗아가고, 영향받은 이를 깊은 우울증에 빠뜨려 결국 목숨을 앗아갑니다. 극소수의 노움만이 이 재앙에서 살아남아, 깊이 침울하고 현명한 생존자인 표백자(bleachlings)가 됩니다.<br><strong>당신은 아마도...</strong><br>• 학습을 포용하고 예고 없이 한 연구 분야에서 다른 분야로 뛰어다닙니다.<br>• 빠르게 말하고, 생각하고, 움직이며, 따라오지 못하는 사람에게 참을성을 잃습니다.<br>• 당신의 열정과 새로운 상황에 접근하는 에너지를 감상합니다.<br>• 당신의 동기를 이해하거나 급격한 방향 전환에 적응하는 데 어려움을 겪습니다.<br><strong>다른 사람들은 아마도...</strong><br>• 당신의 열정과 새로운 상황에 접근하는 에너지를 감상합니다.<br>• 당신의 동기를 이해하거나 급격한 방향 전환에 적응하는 데 어려움을 겪습니다.<br><strong>신체 묘사</strong><br>대부분의 노움은 키가 90cm(3피트)를 약간 넘고, 인간 아이보다 조금 더 무겁습니다. 자연적인 피부, 머리카락, 눈 색깔이 매우 다양합니다. 표백이 시작되지 않은 노움은 흰색 외에 거의 모든 머리카락과 눈 색깔이 가능하며, 선명한 색상이 가장 빈번합니다. 피부색은 약간 더 좁은 범위를 포괄하며 흙색과 분홍빛 색조가 많지만, 때로 초록, 검정, 또는 연한 파란색도 있습니다.<br><strong>사회</strong><br>대부분의 노움은 거주 지역의 문화적 관습 일부를 채택하지만, 골라서 선택하고, 자신들의 페이적 논리에 맞게 공동체를 조정하는 경향이 있습니다. 이것은 종종 노움 다수 공동체가 결국 거의 전적으로 노움으로 구성되게 하는데, 다른 사람들이 노움의 정치적 결정에 당혹하여 다른 곳으로 이사하기 때문입니다. 노움은 완전히 자기 것이라 할 수 있는 문화가 거의 없습니다. 골라리온 표면에 노움 왕국이나 국가는 극히 드물며, 대부분의 노움은 그런 나라가 있다 해도 어떻게 할지 모를 것입니다.<br><strong>신앙</strong><br>노움은 충동적인 장난꾸러기로 불가해한 동기와 혼란스러운 방법을 가지지만, 많은 이가 최소한 세상을 더 나은 곳으로 만들려 합니다. 강한 감정의 발작에 빠지기 쉬우며, 도움받을 자격이 있다고 믿는 이를 돕는 데 거의 수줍어하지 않습니다. 노움은 개인주의와 자연을 중시하는 신격을 가장 흔히 숭배하며, 케이든 카일리언, 데스나, 고즈레, 셸린 등입니다.',
   specials:['저광 시야']},
  {id:'goblin', name:'고블린', en:'Goblin', hp:6, size:'소형', speed:25,
   boosts:['민첩(DEX)','매력(CHA)','자유'], flaws:['지혜(WIS)'],
   traits:['고블린','인간형'], vision:'암시야',
   desc:'다른 사람들이 집착하는 복잡한 역사는 고블린에게 흥미가 없습니다. 이 작은 종족은 순간을 살며, 사실 기록보다 허풍 섞인 이야기를 선호합니다. 고블린의 미덕은 현재에 존재하고, 창의적이며, 솔직한 것입니다. 여정이 어떻게 끝날지 걱정하기보다 충만한 삶을 살기 위해 노력합니다. 이야기를 말하되, 사실을 따지지 않는 것. 작지만, 크게 꿈꾸는 것. 많은 고블린이 노래, 불, 먹는 것 같은 단순한 즐거움을 좋아하고, 읽기, 개, 말을 싫어합니다. 다른 고블린은 폐품 손질이나 거의 모든 것으로 간식과 폭발물을 조합하는 것 같은 더 복잡한 추구를 할 수 있습니다.<br><strong>당신은 아마도...</strong><br>• 다른 문명화된 종족 사이에서, 어쩌면 자신에게도, 자기 자리가 있다는 것을 증명하려 합니다.<br>• 다른 이의 무거운 감정적 짐을 덜어주고(동시에 자신도 즐기며) 장난과 익살로 분위기를 밝힙니다.<br>• 당신이 (의도적이든 우발적이든) 너무 많은 것에 불을 지르지 않도록 합니다.<br>• 혈통의 전형적인 미식 선택, 무모한 행동, 불에 대한 사랑을 감안하면 어떻게 생존하는지 궁금해합니다.<br><strong>다른 사람들은 아마도...</strong><br>• 당신이 (의도적이든 우발적이든) 너무 많은 것에 불을 지르지 않도록 합니다.<br>• 혈통의 전형적인 미식 선택, 무모한 행동, 불에 대한 사랑을 감안하면 어떻게 생존하는지 궁금해합니다.<br><strong>신체 묘사</strong><br>고블린은 큰 몸통, 가느다란 팔다리, 큰 귀와 작고 빨간 눈이 달린 엄청나게 큰 머리를 가진 땅딸막한 인간형입니다. 피부색은 초록에서 회색, 파란색까지 다양하며, 종종 흉터, 종기, 발진이 있습니다. 고블린의 평균 키는 약 90cm(3피트)입니다. 대부분 대머리이며, 체모가 거의 없습니다. 들쭉날쭉한 이빨이 끊임없이 빠지고 다시 자라며, 빠른 신진대사로 끊임없이 먹고 자주 낮잠을 잡니다. 돌연변이도 다른 종족보다 고블린에게서 더 흔하며, 고블린은 보통 특히 눈에 띄는 돌연변이를 힘이나 행운의 표시로 봅니다.<br><strong>사회</strong><br>고블린은 강한 지도자에게 모이는 경향이 있어 작은 부족을 형성합니다. 이 부족은 거의 100명을 넘지 않지만, 부족이 클수록 지도자가 질서를 유지하기 위해 더 부지런해야 합니다 — 악명 높게 어려운 일입니다. 생산성이나 학습보다 놀이와 창의성이 고블린에게 더 중요하며, 야영지는 노래와 웃음으로 터져 나옵니다.<br><strong>신앙</strong><br>가장 선의의 고블린도 규칙을 따르는 데 어려움을 겪어, 고블린 모험가는 종종 자신이 법의 올바른 편에 있는지 확신하지 못합니다. 조직적 숭배도 마찬가지로 고블린을 당혹하게 하며, 대부분은 자신의 신격을 직접 고릅니다 — 강력한 괴물, 자연의 경이, 또는 매혹적으로 보이는 무엇이든. 때로는 주목할 만한 동료 고블린에게도 신적 지위를 부여합니다. 다른 혈통과 시간을 보내는 고블린은 그들의 신앙을 채택할 수 있으며, 많은 고블린 모험가가 케이든 카일리언을 숭배합니다.',
   specials:['암시야']},
  {id:'halfling', name:'하플링', en:'Halfling', hp:6, size:'소형', speed:25,
   boosts:['민첩(DEX)','지혜(WIS)','자유'], flaws:['근력(STR)'],
   traits:['하플링','인간형'], vision:'없음',
   desc:'어떤 곳도 자기 것이라 주장하지 않는 하플링은 마을보다 큰 정착지를 거의 지배하지 않습니다. 대신, 더 큰 도시 안에서 인간 사이에 자주 살며, 더 큰 종족과 나란히 작은 공동체를 일구어냅니다. 낙관적이고, 쾌활하며, 강한 방랑벽에 이끌리는 하플링은 작은 키를 풍부한 용기로 보충합니다. 한편으로는 흥분하기 쉽고 느긋하며, 하플링은 최고의 기회주의자이고, 그들의 열정은 폭력보다 기쁨을 선호합니다. 호기심이 때때로 모험으로 이끌지만, 하플링은 집과 가정에 대한 강한 유대도 가지고 있습니다.<br><strong>당신은 아마도...</strong><br>• 다양한 사람들과 잘 어울리고 새 친구를 만나는 것을 즐깁니다.<br>• 문제를 일으킬 것을 알면서도 호기심을 참기 어렵습니다.<br>• 상황이 아무리 절망적이더라도 항상 은색 안감이나 웃을 거리를 찾는 능력을 감상합니다.<br>• 행운을 가져다준다고 생각합니다.<br><strong>다른 사람들은 아마도...</strong><br>• 상황이 아무리 절망적이더라도 항상 은색 안감이나 웃을 거리를 찾는 능력을 감상합니다.<br>• 행운을 가져다준다고 생각합니다.<br><strong>신체 묘사</strong><br>하플링은 더 작은 인간처럼 어렴풋이 보이는 작은 인간형입니다. 키가 90cm(3피트)를 넘는 경우가 드뭅니다. 하플링의 체형은 다양하며, 일부는 약간 더 큰 머리를 가진 더 짧은 성인 인간처럼 보이고, 다른 일부는 인간 어린이에 더 가까운 체형을 가집니다.<br><strong>사회</strong><br>쾌활하고 다정한 성격에도 불구하고, 하플링은 보통 모여살지 않습니다. 내해 지역에 문화 중심지가 거의 없으며, 대신 세계의 사회들 곳곳에 자신을 짜넣는 경향이 있습니다. 하플링은 가능한 생계를 꾸리며, 많은 이가 하찮은 노동이나 단순한 서비스 직업을 합니다. 일부 하플링은 도시 생활을 거부하고 대신 열린 길을 택해 행운과 명성을 찾아 이곳저곳을 여행합니다. 이 유목민 하플링은 종종 작은 무리로 여행하며, 가까운 친구와 가족 사이에서 고난과 소박한 즐거움을 나눕니다. 하플링 이름은 보통 2~3음절이며, 거친 자음을 피하는 부드러운 소리입니다. 겸손하게 들리는 이름을 선호하며, 지나치게 길거나 복잡한 이름은 오만함의 표시로 봅니다. 그러나 엘프와 인간은 자신들의 미학에 맞는 더 긴 이름을 가질 수 있다는 것을 이해합니다.<br><strong>신앙</strong><br>하플링은 친구와 가족에게 충성하지만, 생존을 위해 필요한 일을 하는 것을 두려워하지 않습니다. 어디를 가든, 자신이 속한 사회에 매끄럽게 녹아들어 주변의 지배적 혈통의 문화와 신앙에 적응하면서 독특한 하플링식 변형을 더해, 두 문화를 풍요롭게 하는 문화적 융합을 만들어냅니다. 하플링은 데스나처럼 행운을 부여하거나, 노르고르버처럼 교활함을 장려하는 신을 선호하며, 많은 이가 해방자로서 케이든 카일리언의 역할과 주변 다른 혈통의 종교도 감사합니다.',
   specials:['예리한 눈: 은폐/숨겨진 생물 탐색 +2 상황 보너스']},
  {id:'human', name:'인간', en:'Human', hp:8, size:'중형', speed:25,
   boosts:['자유','자유'], flaws:[],
   traits:['인간','인간형'], vision:'없음',
   desc:'골라리온의 어떤 종족만큼이나 예측 불가능하고 다양한 인간은 뛰어난 추진력과 인내하고 확장하는 능력을 가지고 있습니다. 인류가 두각을 나타내기 전에 많은 문명이 번성했지만, 인간은 역사를 통틀어 가장 위대하고 가장 끔찍한 사회를 모두 건설했으며, 오늘날 내해 주변 왕국에서 가장 인구가 많은 종족입니다.<br><strong>당신은 아마도...</strong><br>• 자기 자신으로든 대의를 위해서든 위대함을 달성하기 위해 노력합니다.<br>• 세계에서 자신의 목적을 이해하려 합니다.<br>• 가족과 친구와의 관계를 소중히 여깁니다.<br>• 유연성, 적응력, 그리고 — 대부분의 경우 — 열린 마음을 존중합니다.<br>• 의도를 불신하며, 당신이 권력이나 부만을 추구한다고 두려워합니다.<br><strong>다른 사람들은 아마도...</strong><br>• 유연성, 적응력, 그리고 — 대부분의 경우 — 열린 마음을 존중합니다.<br>• 의도를 불신하며, 당신이 권력이나 부만을 추구한다고 두려워합니다.<br>• 당신에게 무엇을 기대할지 확신하지 못하고 의도를 짐작하는 것을 주저합니다.<br>• 가룬디(Garundi) — 내해 남쪽 해안을 따라 펼쳐진 나라들.<br>• 켈레쉬(Keleshites) — 동쪽 사막의 켈레쉬 제국에 기원.<br><strong>신체 묘사</strong><br>인간의 신체적 특성은 세계의 기후만큼이나 다양합니다. 피부색과 머리카락 색, 체형, 얼굴 특징이 매우 다양합니다. 일반적으로, 적도에 가까이 살았거나 조상이 살았을수록 피부 색조가 어둡습니다.<br><strong>신앙</strong><br>인간의 다양성은 정부, 태도, 사회적 규범에도 나타납니다. 가장 오래된 인간 문화는 수천 년의 공유 역사를 추적할 수 있지만, 엘프나 드워프의 사회와 비교하면 인간 문명은 제국이 분열하고 새 왕국이 옛 것을 흡수하며 끊임없이 유동하는 상태에 있는 것 같습니다.',
   specials:['자유 속성 부스트 2개','추가 언어 1+INT개']},
  {id:'leshy', name:'레쉬', en:'Leshy', hp:8, size:'소형', speed:25,
   boosts:['건강(CON)','지혜(WIS)','자유'], flaws:['지능(INT)'],
   traits:['레쉬','식물'], vision:'저광 시야',
   desc:'레시는 일시적으로 물리적 형태를 부여받은 불멸의 자연 영혼입니다. 환경의 수호자이자 사자(使者)인 레시는 숙련된 드루이드나 다른 근원 마법의 대가가 적절한 그릇을 만드는 의식을 행하고, 영혼이 임시 거처로 그 그릇을 선택할 때 "태어납니다". 레시는 의식이 끝나는 순간부터 자립할 수 있지만, 창조자와 평생의 유대를 유지하는 것도 드물지 않습니다. 많은 레시가 물리적 세계와 상호작용하는 기회를 즐깁니다. 대부분의 레시 영혼은 고대이지만, 과거의 삶을 거의 기억하지 못하며 새 삶을 다시 한번 세계의 경이를 경험할 기회로 봅니다.<br><strong>당신은 아마도...</strong><br>• 영역을 떠날 수 없는 자연의 수호자를 위한 여행 대리인 역할을 합니다.<br>• 문명이 자연과 협력하고 생태학적으로 친화적인 방식으로 도시를 건설하도록 격려합니다.<br>• 영적 기원 때문에 당신을 호기심의 대상으로 봅니다.<br>• 자연에 대해서만 알고 문명과 사회에 익숙하지 않다고 가정합니다.<br><strong>다른 사람들은 아마도...</strong><br>• 영적 기원 때문에 당신을 호기심의 대상으로 봅니다.<br>• 자연에 대해서만 알고 문명과 사회에 익숙하지 않다고 가정합니다.<br><strong>신체 묘사</strong><br>레시는 그릇을 만드는 데 사용된 재료만큼이나 다양하며, 보통 다양한 식물이나 균류의 기이한 혼합체로 나타납니다. 몸은 어렴풋이 인간형이며, 만들어진 식물이나 균류의 수많은 특성을 가집니다. 일반적인 레시는 약 90cm(3피트) 키입니다. 레시는 성인으로 삶을 시작하며 나이를 먹지 않습니다.<br><strong>사회</strong><br>대부분의 레시에게 가족이라는 개념은 출생의 문제가 아니라 충성과 우정의 유대로 결정됩니다. 레시는 헌신적인 동맹이지만, 자연을 황폐화하려는 자에 대한 관용은 거의 없습니다. 신뢰를 얻은 누군가를 기꺼이 가족으로 받아들이지만, 가족 구성원이 대가로 그들과 자연의 보호 대상을 돌봐주기를 기대합니다.<br><strong>신앙</strong><br>레시의 신앙은 일반적으로 자연 세계에 집중됩니다. 철학적 성향이 있는 이는 녹색 신앙(Green Faith)을 향하며, 고즈레(Gozreh)가 신앙심 있는 레시 사이에서 가장 인기 있는 신격입니다. 일부 레시는 강력한 자연 영혼인 녹색 남자(green men)도 숭배합니다.',
   specials:['저광 시야','식물 영양: 보통 식비 불필요']},
  {id:'orc', name:'오크', en:'Orc', hp:10, size:'중형', speed:25,
   boosts:['자유','자유'], flaws:[],
   traits:['오크','인간형'], vision:'암시야',
   desc:'오크는 태어나는 순간부터 종종 폭력과 갈등의 불꽃 속에서 단련됩니다. 잔혹하게 짧은 삶을 사는 경우가 많기에, 오크는 합당한 적에게 자신의 힘을 시험하는 것을 즐기며, 종종 공동체의 상위 구성원에게 지배권을 도전합니다. 오크는 다른 공동체에서 수용을 얻는 데 어려움을 겪으며, 많은 이들이 그들을 야만인으로 봅니다. 그러나 오크 친구의 충성을 얻은 자는 곧 오크의 충실함과 정직함이 비할 데 없음을 알게 됩니다. 오크 문화는 그들이 살아남은 도전에 의해 형성된다고 가르치며, 가장 합당한 자가 가장 많은 고난을 이겨냅니다. 장수와 큰 승리를 모두 달성한 오크는 엄청난 존경을 받습니다.<br><strong>당신은 아마도...</strong><br>• 물리적 대결에서 자신의 힘을 증명할 기회를 열심히 맞이합니다.<br>• 노환이나 질병으로 인한 평범한 죽음보다 영광스러운 전투에서의 죽음을 선호합니다.<br>• 당신을 폭력적이거나 규율이 없다고 봅니다.<br>• 솔직함과 무뚝뚝한 정직함을 감탄합니다.<br><strong>다른 사람들은 아마도...</strong><br>• 당신을 폭력적이거나 규율이 없다고 봅니다.<br>• 솔직함과 무뚝뚝한 정직함을 감탄합니다.<br><strong>신체 묘사</strong><br>오크는 키가 크고 강력하게 건장하며, 긴 팔과 굵은 다리를 가지고 있습니다. 많은 오크의 키가 210cm(7피트)를 넘지만, 넓고 거의 벌어진 자세와 어깨를 앞으로 숙이는 경향이 있습니다. 오크는 거친 피부, 두꺼운 뼈, 바위처럼 단단한 근육을 가지고 있어 전쟁과 기타 육체적으로 요구되는 작업에 적합합니다. 오크 피부색은 보통 녹색의 어떤 색조이지만, 일부 오크는 환경에 대한 적응을 반영하는 다른 피부색을 가집니다.<br><strong>사회</strong><br>대부분의 오크 공동체 — 거점(holds)이라 알려진 — 는 고통과 영광이라는 두 가지로 자신을 정의합니다. 각각은 거의 동등한 존경을 받으며, 고통은 금욕적으로 견뎌야 합니다. 많은 흉터를 지닌 채 불평 없이 부러진 다리로 걷는 오크는 전장에서 큰 승리를 거두는 자만큼의 감탄을 받습니다. 추가로, 힘이 가족과 거점 간의 역학을 정의합니다. 약한 오크는 강한 자의 뜻에 따라 일하며, 힘은 자신의 능력을 증명하는 오크 사이에서 끊임없이 변합니다. 오크는 가족의 의무를 공유하는 경향이 있어, 공동체로 아이를 키우고 거점 전체에 책임을 분담합니다.<br><strong>신앙</strong><br>흔한 오크 격언은 "너는 너를 형성하는 흉터다"입니다. 폭력적이고 혼돈스러운 땅에서의 폭력적이고 혼돈스러운 삶은 대부분의 오크가 폭력을 예상하고 받아들이게 합니다. 더 전쟁 지향적인 오크 공동체에서는 라마슈투와 로바구그가 흔히 숭배되며, 덜 폭력적인 거점은 불, 구원, 영광의 교리가 오크의 감성에 호소하는 사렌레이 같은 신을 숭배합니다.',
   specials:['암시야','자유 속성 부스트 2개']},
];

const BACKGROUNDS = [
  {id:'acolyte', name:'수도자', en:'Acolyte', boosts:'지능 또는 지혜, 자유', skills:'종교학, 필사 지식', feat:'경전 학도', desc:'종교 수도원이나 수도회에서 어린 시절을 보냈습니다.'},
  {id:'acrobat', name:'곡예사', en:'Acrobat', boosts:'근력 또는 민첩, 자유', skills:'곡예, 서커스 지식', feat:'안정된 균형', desc:'서커스나 거리에서 곡예사로 공연하여 급료를 벌었습니다.'},
  {id:'animal-whisperer', name:'동물 소통사', en:'Animal Whisperer', boosts:'지혜 또는 매력, 자유', skills:'자연학, 지형 지식', feat:'동물 훈련', desc:'항상 동물과 유대를 느꼈고, 그들을 훈련하는 것은 작은 도약이었습니다.'},
  {id:'artisan', name:'장인', en:'Artisan', boosts:'근력 또는 지능, 자유', skills:'제작, 길드 지식', feat:'전문 제작', desc:'도제로서 건축이나 공예의 특정 형태를 연습했습니다.'},
  {id:'artist', name:'예술가', en:'Artist', boosts:'민첩 또는 매력, 자유', skills:'제작, 예술 지식', feat:'전문 제작', desc:'예술이 가장 큰 열정입니다.'},
  {id:'bandit', name:'산적', en:'Bandit', boosts:'민첩 또는 매력, 자유', skills:'위협, 지형 지식', feat:'집단 강요', desc:'과거에 적지 않은 시골 산적질이 있었습니다.'},
  {id:'barkeep', name:'술집 주인', en:'Barkeep', boosts:'건강 또는 매력, 자유', skills:'외교, 술 지식', feat:'수다쟁이', desc:'술집에서 일하며 주량을 키우고 사교하는 법을 배웠습니다.'},
  {id:'barrister', name:'법정 변호사', en:'Barrister', boosts:'지능 또는 매력, 자유', skills:'외교, 법률 지식', feat:'집단 인상', desc:'법률 서적과 법정 경험이 법률 문제를 가르쳤습니다.'},
  {id:'bounty-hunter', name:'현상금 사냥꾼', en:'Bounty Hunter', boosts:'근력 또는 지혜, 자유', skills:'생존, 법률 지식', feat:'숙련된 추적자', desc:'범법자를 잡아 주머니를 채웠습니다.'},
  {id:'charlatan', name:'사기꾼', en:'Charlatan', boosts:'지능 또는 매력, 자유', skills:'기만, 뒷세계 지식', feat:'매력적인 거짓말쟁이', desc:'이곳저곳을 돌아다니며 가짜 운세와 만병통치약을 팔았습니다.'},
  {id:'cook', name:'요리사', en:'Cook', boosts:'건강 또는 지능, 자유', skills:'생존, 요리 지식', feat:'양념 달인', desc:'주막이나 식당의 주방에서 자라며 뛰어난 요리사가 되었습니다.'},
  {id:'criminal', name:'범죄자', en:'Criminal', boosts:'민첩 또는 지능, 자유', skills:'은신, 뒷세계 지식', feat:'숙련된 밀수꾼', desc:'파렴치한 개인이나 지하 조직의 일원으로 범죄의 삶을 살았습니다.'},
  {id:'cultist', name:'이교도', en:'Cultist', boosts:'지능 또는 매력, 자유', skills:'오컬티즘, 신격/교단 지식', feat:'비밀 교육', desc:'교단의 구성원으로 신성한 의식을 행했습니다.'},
  {id:'detective', name:'탐정', en:'Detective', boosts:'지능 또는 지혜, 자유', skills:'사회, 뒷세계 지식', feat:'거리 지혜', desc:'경찰 조사관이나 사립 탐정으로 범죄를 해결했습니다.'},
  {id:'emissary', name:'사절', en:'Emissary', boosts:'지능 또는 매력, 자유', skills:'사회, 도시 지식', feat:'다국어', desc:'외교관이나 전령으로 멀고 넓게 여행했습니다.'},
  {id:'entertainer', name:'연예인', en:'Entertainer', boosts:'민첩 또는 매력, 자유', skills:'공연, 극장 지식', feat:'매혹적 공연', desc:'관중을 즐겁게 하는 법을 배웠습니다.'},
  {id:'farmhand', name:'농부', en:'Farmhand', boosts:'건강 또는 지혜, 자유', skills:'운동, 농업 지식', feat:'운동 확인', desc:'땅을 갈고 작물을 돌봤습니다.'},
  {id:'field-medic', name:'야전 의무관', en:'Field Medic', boosts:'건강 또는 지혜, 자유', skills:'의학, 전쟁 지식', feat:'전투 의료', desc:'전투의 혼란 속에서 부상자를 치료했습니다.'},
  {id:'fortune-teller', name:'점술사', en:'Fortune Teller', boosts:'지능 또는 매력, 자유', skills:'오컬티즘, 점술 지식', feat:'기이한 것 식별', desc:'운명의 실을 읽고 미래를 점쳤습니다.'},
  {id:'gambler', name:'도박꾼', en:'Gambler', boosts:'민첩 또는 매력, 자유', skills:'기만, 게임 지식', feat:'거짓 간파', desc:'승리의 짜릿함이 당신을 우연의 게임으로 끌어들였습니다.'},
  {id:'gladiator', name:'검투사', en:'Gladiator', boosts:'근력 또는 매력, 자유', skills:'공연, 검투 지식', feat:'인상적 공연', desc:'투기장의 피의 경기가 전투 기술을 가르쳤습니다.'},
  {id:'guard', name:'경비원', en:'Guard', boosts:'근력 또는 매력, 자유', skills:'위협, 법률 지식', feat:'빠른 강요', desc:'경비대에 복무했습니다.'},
  {id:'herbalist', name:'약초사', en:'Herbalist', boosts:'건강 또는 지혜, 자유', skills:'자연학, 약초학 지식', feat:'자연 의학', desc:'다양한 약초의 치유 속성을 배웠습니다.'},
  {id:'hermit', name:'은둔자', en:'Hermit', boosts:'건강 또는 지능, 자유', skills:'자연학 또는 오컬티즘, 지형 지식', feat:'의심스러운 지식', desc:'격리된 곳에서 고독한 삶을 살았습니다.'},
  {id:'hunter', name:'사냥꾼', en:'Hunter', boosts:'민첩 또는 지혜, 자유', skills:'생존, 무두질 지식', feat:'야생 동물 조사', desc:'야생의 동물과 다른 생물을 추적하고 잡았습니다.'},
  {id:'laborer', name:'노동자', en:'Laborer', boosts:'근력 또는 건강, 자유', skills:'운동, 노동 지식', feat:'무거운 짐꾼', desc:'수년간 고된 육체 노동을 수행했습니다.'},
  {id:'martial-disciple', name:'무예 수련생', en:'Martial Disciple', boosts:'근력 또는 민첩, 자유', skills:'곡예 또는 운동, 전쟁 지식', feat:'고양이 착지/빠른 점프', desc:'위대한 전사가 되기 위해 강도 높은 훈련에 헌신했습니다.'},
  {id:'merchant', name:'상인', en:'Merchant', boosts:'지능 또는 매력, 자유', skills:'외교, 상업 지식', feat:'흥정 사냥꾼', desc:'물건을 동전과 교역품으로 흥정했습니다.'},
  {id:'miner', name:'광부', en:'Miner', boosts:'근력 또는 지혜, 자유', skills:'생존, 광업 지식', feat:'지하 지형 전문가', desc:'빛 없는 대지의 깊은 곳에서 귀중한 광물을 뜯어냈습니다.'},
  {id:'noble', name:'귀족', en:'Noble', boosts:'지능 또는 매력, 자유', skills:'사회, 족보 지식', feat:'궁정 예절', desc:'귀족의 삶을 살며 의무와 음모 속에서 자랐습니다.'},
  {id:'nomad', name:'유목민', en:'Nomad', boosts:'건강 또는 지혜, 자유', skills:'생존, 지형 지식', feat:'생존 확인', desc:'멀리 넓게 여행하며 생존 기술을 배웠습니다.'},
  {id:'prisoner', name:'수감자', en:'Prisoner', boosts:'근력 또는 건강, 자유', skills:'은신, 뒷세계 지식', feat:'숙련된 밀수꾼', desc:'범죄로 투옥되거나 처벌받았습니다.'},
  {id:'raised-by-belief', name:'신앙에 의해 양육됨', en:'Raised by Belief', boosts:'신격 속성 중 하나, 자유', skills:'신격 기술, 신격 지식', feat:'기술 확인', desc:'특정 신격의 전통에 깊이 젖은 양육을 받았습니다.'},
  {id:'sailor', name:'선원', en:'Sailor', boosts:'근력 또는 민첩, 자유', skills:'운동, 항해 지식', feat:'수중 약탈자', desc:'바다의 부름을 들었습니다.'},
  {id:'scholar', name:'학자', en:'Scholar', boosts:'지능 또는 지혜, 자유', skills:'주문학/자연학/오컬티즘/종교학 중 선택, 학술원 지식', feat:'기술 확인', desc:'배우는 재능이 있어 할 수 있는 모든 것을 배웠습니다.'},
  {id:'scout', name:'정찰병', en:'Scout', boosts:'민첩 또는 지혜, 자유', skills:'생존, 지형 지식', feat:'채집가', desc:'야생을 고향이라 부르며 길을 찾고 여행자를 안내했습니다.'},
  {id:'street-urchin', name:'거리의 부랑아', en:'Street Urchin', boosts:'민첩 또는 건강, 자유', skills:'도둑질, 도시 지식', feat:'소매치기', desc:'대도시의 거리에서 소매치기로 근근이 살았습니다.'},
  {id:'teacher', name:'교사', en:'Teacher', boosts:'지능 또는 지혜, 자유', skills:'공연 또는 사회, 학술원 지식', feat:'숙련된 전문가', desc:'아이와 어른에게 세계와 경이에 대해 가르쳤습니다.'},
  {id:'tinker', name:'수선공', en:'Tinker', boosts:'민첩 또는 지능, 자유', skills:'제작, 공학 지식', feat:'전문 제작', desc:'온갖 종류의 소소한 발명품을 만들었습니다.'},
  {id:'warrior', name:'전사', en:'Warrior', boosts:'근력 또는 건강, 자유', skills:'위협, 전쟁 지식', feat:'위협적 노려보기', desc:'용병이나 군대의 일원으로 전투에 뛰어들었습니다.'},
];

const HERITAGE_DB = [
  // 드워프
  {id:'ancient-blooded-dwarf',name_ko:'고대혈 드워프',name_en:'Ancient-Blooded Dwarf',ancestry:'dwarf',summary:'드워프 조상의 마법 저항력을 이어받아 마법 효과에 대한 추가 내성 굴림을 얻습니다.'},
  {id:'death-warden-dwarf',name_ko:'사신 수호 드워프',name_en:'Death Warden Dwarf',ancestry:'dwarf',summary:'언데드 마법에 특히 강합니다. 인내 내성이 약화됨(enfeebled)에 해당하는 효과에 적용됩니다.'},
  {id:'forge-dwarf',name_ko:'단조 드워프',name_en:'Forge Dwarf',ancestry:'dwarf',summary:'용암, 고온, 화재에 대한 저항을 가집니다.'},
  {id:'rock-dwarf',name_ko:'바위 드워프',name_en:'Rock Dwarf',ancestry:'dwarf',summary:'밀쳐내기(Push), 이동(Trip), 넘어뜨리기 등에 특별히 저항합니다.'},
  {id:'strong-blooded-dwarf',name_ko:'강혈 드워프',name_en:'Strong-Blooded Dwarf',ancestry:'dwarf',summary:'독에 강하며, 독 상태의 지속을 줄입니다.'},
  // 엘프
  {id:'ancient-elf',name_ko:'고대 엘프',name_en:'Ancient Elf',ancestry:'elf',summary:'수백 년의 삶에서 다양한 기술을 연마했습니다. 하나의 다중 클래스 혈통 재주를 레벨 제한 없이 선택합니다.'},
  {id:'arctic-elf',name_ko:'극지 엘프',name_en:'Arctic Elf',ancestry:'elf',summary:'혹한 환경에 적응하여 냉기 저항과 혹한에서의 페널티 면역을 얻습니다.'},
  {id:'cavern-elf',name_ko:'동굴 엘프',name_en:'Cavern Elf',ancestry:'elf',summary:'지하 생활에 적응하여 저광 시야 대신 암시야(darkvision)를 얻습니다.'},
  {id:'seer-elf',name_ko:'예언자 엘프',name_en:'Seer Elf',ancestry:'elf',summary:'마법 기운을 감지하는 능력이 뛰어납니다. 마법 감지 시 추가 정보를 얻습니다.'},
  {id:'whisper-elf',name_ko:'속삭임 엘프',name_en:'Whisper Elf',ancestry:'elf',summary:'청각이 극도로 예민합니다. 청각으로 주변 생물의 위치를 파악할 수 있습니다.'},
  {id:'woodland-elf',name_ko:'삼림 엘프',name_en:'Woodland Elf',ancestry:'elf',summary:'숲 환경에 완벽히 적응하여 나무 위 이동 속도를 얻고 덤불을 무시합니다.'},
  // 노움
  {id:'chameleon-gnome',name_ko:'카멜레온 노움',name_en:'Chameleon Gnome',ancestry:'gnome',summary:'피부와 머리카락 색을 바꿔 은신에 유리한 상황 보너스를 얻습니다.'},
  {id:'fey-touched-gnome',name_ko:'페이혈 노움',name_en:'Fey-Touched Gnome',ancestry:'gnome',summary:'페이 마법과 깊이 연결되어 추가 집중 주문을 얻습니다.'},
  {id:'sensate-gnome',name_ko:'감각 노움',name_en:'Sensate Gnome',ancestry:'gnome',summary:'후각이 강화되어 냄새로 생물을 추적하고 숨겨진 생물을 감지합니다.'},
  {id:'umbral-gnome',name_ko:'암영 노움',name_en:'Umbral Gnome',ancestry:'gnome',summary:'완전한 어둠에서도 볼 수 있는 암시야(darkvision)를 얻습니다.'},
  {id:'wellspring-gnome',name_ko:'원천 노움',name_en:'Wellspring Gnome',ancestry:'gnome',summary:'특정 마법 원천(신비/신성/비의/원시)과 연결되어 해당 전통의 집중 주문을 얻습니다.'},
  // 고블린
  {id:'charhide-goblin',name_ko:'숯가죽 고블린',name_en:'Charhide Goblin',ancestry:'goblin',summary:'불에 강한 가죽을 가져 화염 저항 및 화상으로 영구 피해 방지 능력을 얻습니다.'},
  {id:'irongut-goblin',name_ko:'철위장 고블린',name_en:'Irongut Goblin',ancestry:'goblin',summary:'어떤 음식도 소화하며, 식품 관련 구역질 및 질병에 저항합니다.'},
  {id:'razortooth-goblin',name_ko:'면도이빨 고블린',name_en:'Razortooth Goblin',ancestry:'goblin',summary:'날카로운 이빨로 1d6 관통 피해의 비무장 공격을 할 수 있습니다.'},
  {id:'snow-goblin',name_ko:'눈 고블린',name_en:'Snow Goblin',ancestry:'goblin',summary:'혹한 환경에 적응하여 냉기 저항과 설원에서 이동 페널티 면역을 얻습니다.'},
  {id:'unbreakable-goblin',name_ko:'부서지지 않는 고블린',name_en:'Unbreakable Goblin',ancestry:'goblin',summary:'추락 피해를 절반으로 받고 최대 HP가 2 증가합니다.'},
  // 하플링
  {id:'gutsy-halfling',name_ko:'대담한 하플링',name_en:'Gutsy Halfling',ancestry:'halfling',summary:'공포 관련 내성에 추가 이점을 얻으며, 공포 효과를 재시도할 수 있습니다.'},
  {id:'hillock-halfling',name_ko:'언덕 하플링',name_en:'Hillock Halfling',ancestry:'halfling',summary:'편안한 장소에서 휴식할 때 레벨의 2배만큼 추가 HP를 회복합니다.'},
  {id:'nomadic-halfling',name_ko:'유목 하플링',name_en:'Nomadic Halfling',ancestry:'halfling',summary:'언어를 빠르게 배웁니다. 추가 언어 2개를 얻습니다.'},
  {id:'twilight-halfling',name_ko:'황혼 하플링',name_en:'Twilight Halfling',ancestry:'halfling',summary:'어스름한 빛에서 볼 수 있는 저광 시야를 얻습니다.'},
  {id:'wildwood-halfling',name_ko:'야생림 하플링',name_en:'Wildwood Halfling',ancestry:'halfling',summary:'덤불과 험한 지형을 무시하며 이동할 수 있습니다.'},
  // 인간
  {id:'skilled-human',name_ko:'숙련된 인간',name_en:'Skilled Human',ancestry:'human',summary:'하나의 기술에서 훈련됨 대신 전문가 숙련도를 얻습니다.'},
  {id:'versatile-human',name_ko:'다재다능한 인간',name_en:'Versatile Human',ancestry:'human',summary:'1레벨에 추가 기술 재주를 얻습니다.'},
  // 레쉬
  {id:'fungus-leshy',name_ko:'균류 레쉬',name_en:'Fungus Leshy',ancestry:'leshy',summary:'어둠에서 볼 수 있는 암시야와 독 저항을 얻습니다.'},
  {id:'gourd-leshy',name_ko:'호박 레쉬',name_en:'Gourd Leshy',ancestry:'leshy',summary:'머리를 분리하여 정찰하거나 야광으로 조명을 만들 수 있습니다.'},
  {id:'leaf-leshy',name_ko:'잎 레쉬',name_en:'Leaf Leshy',ancestry:'leshy',summary:'느린 낙하로 추락 피해를 절반만 받고, 식물 위 이동에 페널티가 없습니다.'},
  {id:'vine-leshy',name_ko:'덩굴 레쉬',name_en:'Vine Leshy',ancestry:'leshy',summary:'등반 속도를 얻으며, 적에게 달라붙어 넘어뜨릴 수 있습니다.'},
  // 오크
  {id:'badlands-orc',name_ko:'황무지 오크',name_en:'Badlands Orc',ancestry:'orc',summary:'혹독한 환경에서의 이동 속도 페널티 면역과 탈수 저항을 얻습니다.'},
  {id:'battle-ready-orc',name_ko:'전투 준비 오크',name_en:'Battle-Ready Orc',ancestry:'orc',summary:'지각 숙련도가 훈련됨에서 전문가로 향상됩니다.'},
  {id:'deep-orc',name_ko:'심연 오크',name_en:'Deep Orc',ancestry:'orc',summary:'지하 생활에 적응하여 암시야(darkvision)를 얻습니다.'},
  {id:'hold-scarred-orc',name_ko:'흉터 오크',name_en:'Hold-Scarred Orc',ancestry:'orc',summary:'의례적 흉터로 최대 HP가 2 증가하고 회복에 보너스를 얻습니다.'},
  {id:'rainfall-orc',name_ko:'우림 오크',name_en:'Rainfall Orc',ancestry:'orc',summary:'우림 지형 이동에 페널티가 없고 질병 저항을 얻습니다.'},

  // ── 다재다능한 유산 (Versatile Heritage) — 모든 혈통 선택 가능 ──
  {id:'changeling',name_ko:'체인질링',name_en:'Changeling',ancestry:'*',versatile:true,
   summary:'밤마녀(hag)의 개입으로 태어난 아이. 아버지의 혈통을 닮지만 양쪽 눈 색이 다른 홍채 이색증이 특징. 성장하면서 저광 시야, 갈고리 손톱, 선천적 마법 등 밤마녀의 특징이 나타남. 저광 시야(이미 있으면 암시야) 획득. 체인질링 특성 추가.'},
  {id:'nephilim',name_ko:'네피림',name_en:'Nephilim',ancestry:'*',versatile:true,
   summary:'외부 차원의 초자연적 힘이 주입된 존재. 천상, 지옥, 심연 등의 영향으로 금빛 눈, 후광, 뿔, 꼬리 같은 특징이 나타남. 저광 시야(이미 있으면 암시야) 획득. 네피림 특성 추가. 혈통에 따라 천사혈·지옥아·나락아·법의 전달자·뮤즈의 손길·암흑아 중 선택.'},

  // ── 혼합 혈통 (Mixed Ancestry) — 모든 혈통 선택 가능 ──
  {id:'aiuvarin',name_ko:'아이우바린 (반엘프)',name_en:'Aiuvarin (Half-Elf)',ancestry:'*',versatile:true,
   summary:'엘프와 다른 혈통의 혼혈 후손을 "아이우바린"이라 합니다 — 엘프어로 너무 빨리 땅에 떨어지는 나뭇잎에 관한 시에서 유래. 대부분 엘프-인간 혼혈이 가장 흔함. 인간 부모를 둔 경우 약 150년을 삶. 저광 시야 획득. 엘프·아이우바린 특성 추가. 엘프 재주도 선택 가능.'},
  {id:'dromaar',name_ko:'드로마르 (반오크)',name_en:'Dromaar (Half-Orc)',ancestry:'*',versatile:true,
   summary:'오크와 다른 혈통의 혼혈 후손을 "드로마르"라 합니다 — 오크어로 전쟁 행군의 북을 치는 자. 벨크젠의 오크들이 속삭이는 폭군 전쟁에서 다른 혈통과 함께 싸우면서 혼혈이 증가. 인간 부모를 둔 경우 약 70년을 삶. 피부에 녹색 기운. 저광 시야 획득. 오크·드로마르 특성 추가. 오크 재주도 선택 가능.'},
];

const TRAIT_DB = {
  // 무기 특성
  '민첩':'다중 공격 페널티가 -5/-10 대신 -4/-8로 감소.',
  '기교':'명중 굴림에 근력 대신 민첩 수정치를 사용할 수 있음.',
  '비치명':'이 무기로 입힌 피해는 대상을 죽이지 않음 (기절 0으로 만듦).',
  '도달':'이 무기의 근접 도달이 10피트로 증가.',
  '밀기':'이 무기로 밀기(Shove) 특수 공격을 시도할 수 있음.',
  '막기':'이 무기를 장비한 채 막기(Parry) 행동을 사용할 수 있음.',
  '덫':'이 무기로 넘어뜨리기(Trip) 특수 공격을 시도할 수 있음.',
  '무장해제':'이 무기로 무장해제(Disarm) 특수 공격을 시도할 수 있음.',
  '발사체':'공격에 근력 수정치를 사용하고, 피해에 근력 수정치의 절반 추가 (양수일 때).',
  '양손 d6':'한 손으로 사용 가능. 두 손으로 잡으면 피해 주사위가 d6로 증가.',
  '양손 d8':'한 손으로 사용 가능. 두 손으로 잡으면 피해 주사위가 d8로 증가.',
  '양손 d10':'한 손으로 사용 가능. 두 손으로 잡으면 피해 주사위가 d10로 증가.',
  '양손 d12':'한 손으로 사용 가능. 두 손으로 잡으면 피해 주사위가 d12로 증가.',
  '다용도 B':'기본 피해 유형 대신 둔기(B) 피해 유형을 선택할 수 있음.',
  '다용도 P':'기본 피해 유형 대신 관통(P) 피해 유형을 선택할 수 있음.',
  '다용도 S':'기본 피해 유형 대신 참격(S) 피해 유형을 선택할 수 있음.',
  '투척 10ft':'10피트 사거리 증분으로 투척할 수 있음.',
  '투척 20ft':'20피트 사거리 증분으로 투척할 수 있음.',
  '투척 30ft':'30피트 사거리 증분으로 투척할 수 있음.',
  '치명 d6':'치명타 시 1d6 크기의 추가 피해 주사위를 굴림.',
  '치명 d8':'치명타 시 1d8 크기의 추가 피해 주사위를 굴림.',
  '치명 d10':'치명타 시 1d10 크기의 추가 피해 주사위를 굴림.',
  '치명 d12':'치명타 시 1d12 크기의 추가 피해 주사위를 굴림.',
  '연발 d6':'치명타 발생 시 추가로 1d6 관통 피해를 입힘.',
  '연사':'볼트 매거진을 장전하여 사용하는 무기. 재장전 없이 연속 발사 가능.',
  '조준':'사거리 이내 근접 목표에 공격 시 -2 페널티.',
  '사거리 증분':'이 무기의 사거리 증분 거리만큼 원거리 공격 가능.',
  // 마법 계열/학파
  '신비':'신비(Arcane) 마법 전통.',
  '신성':'신성(Divine) 마법 전통.',
  '비의':'비의(Occult) 마법 전통.',
  '원시':'원시(Primal) 마법 전통.',
  '변환':'변환(Transmutation) 마법 계열.',
  '소환':'소환(Conjuration) 마법 계열.',
  '방호':'방호(Abjuration) 마법 계열.',
  '환상':'환상(Illusion) 마법 계열.',
  '예지':'예지(Divination) 마법 계열.',
  '조종':'조종(Enchantment) 마법 계열.',
  '소멸':'소멸(Evocation) 마법 계열.',
  '죽음':'죽음(Necromancy) 마법 계열.',
  // 주문 특성
  '집중':'집중(Focus) 주문. 집중 포인트를 소비하여 시전.',
  '캔트립':'캔트립. 주문 슬롯 없이 자유롭게 시전. 랭크 = ⌈레벨/2⌉.',
  '지속':'시전자가 매 턴 지속(Sustained) 행동으로 유지해야 함.',
  '의식':'의식(Ritual) 주문. 전투 중 시전 불가. 특수 소재 필요.',
  '공포':'공포(Fear) 감정 효과. 공포 상태를 유발하거나 관련됨.',
  '감정':'감정(Emotion) 기반 효과. 감정 면역 생물에게 효과 없음.',
  '변신':'변신(Polymorph) 효과. 동시에 하나의 변신만 적용 가능.',
  '독':'독(Poison) 특성. 독 면역 생물에게 효과 없음.',
  '불':'화염(Fire) 피해 또는 효과.',
  '냉기':'냉기(Cold) 피해 또는 효과.',
  '번개':'전기(Electricity) 피해 또는 효과.',
  '산성':'산성(Acid) 피해 또는 효과.',
  '음파':'음파(Sonic) 피해 또는 효과.',
  '정신':'정신(Mental) 효과. 정신 면역 생물에게 효과 없음.',
  '빛':'빛(Light) 효과.',
  '어둠':'어둠(Darkness) 효과.',
  '치유':'치유(Healing) 효과. 언데드에게는 피해.',
  '부정':'부정(Negative) 에너지 효과.',
  '신성력':'신성력(Positive) 에너지 효과.',
  '저주':'저주(Curse) 효과. 주문 무효화로 해제 가능.',
  '질병':'질병(Disease) 효과. 질병 면역 생물에게 효과 없음.',
  '접촉':'접촉 거리 내 목표에게만 시전 가능.',
  // 혈통/생물 분류 특성
  '인간형':'인간형(Humanoid) 생물 분류.',
  '인간':'인간(Human) 혈통 특성.',
  '엘프':'엘프(Elf) 혈통 특성.',
  '드워프':'드워프(Dwarf) 혈통 특성.',
  '노움':'그노움(Gnome) 혈통 특성.',
  '고블린':'고블린(Goblin) 혈통 특성.',
  '하플링':'하플링(Halfling) 혈통 특성.',
  '오크':'오크(Orc) 혈통 특성.',
  '레쉬':'레쉬(Leshy) 혈통 특성. 식물로 분류됨.',
  '식물':'식물(Plant) 생물 분류.',
  // 재주 분류
  '일반':'일반(General) 재주. 클래스 무관 선택 가능.',
  '기술':'기술(Skill) 재주. 해당 기술 훈련됨이 선행 조건.',
  '원형':'원형(Archetype) 재주. 다중 클래스 전용.',
};

const CONDITIONS_DATA = [
  {name:'실명',en:'Blinded',valued:false,desc:'시각 완전 상실. 시각 기반 판정 자동 대실패. 대상 지정 시 DC 11 단순 판정 필요.'},
  {name:'파손됨',en:'Broken',valued:false,desc:'아이템 HP가 파손 기준값 이하. 무기 -2 공격, 갑옷은 AC 보너스 절반.'},
  {name:'둔함',en:'Clumsy',valued:true,max:4,desc:'민첩 기반 판정/DC에 상태 페널티 = 둔함 수치. AC(민첩), 반사 내성에도 적용.'},
  {name:'은폐됨',en:'Concealed',valued:false,desc:'잘 보이지 않음. 공격 시 DC 5 단순 판정 필요.'},
  {name:'혼란',en:'Confused',valued:false,desc:'행동 제어 불가. 무작위로 행동(공격, 이동 등). 매 턴 종료 시 의지 굴림으로 탈출 가능.'},
  {name:'지배됨',en:'Controlled',valued:false,desc:'다른 생물이 당신의 행동을 완전히 지배함.'},
  {name:'현혹됨',en:'Dazzled',valued:false,desc:'시각 기반 대상이 은폐됨 취급.'},
  {name:'귀머거리',en:'Deafened',valued:false,desc:'청각 상실. 청각 기반 판정 자동 대실패. 음성 주문 시전 불가.'},
  {name:'파멸',en:'Doomed',valued:true,max:3,desc:'빈사 판정 DC가 파멸 수치만큼 증가. 휴식마다 1 감소.'},
  {name:'쇠약',en:'Drained',valued:true,max:4,desc:'건강 기반 판정에 상태 페널티 = 쇠약 수치. 최대 HP도 감소.'},
  {name:'빈사',en:'Dying',valued:true,max:4,desc:'생사의 기로. 매 턴 회복 굴림. 0이 되면 의식불명, 4가 되면 사망.'},
  {name:'약화됨',en:'Enfeebled',valued:true,max:4,desc:'근력 기반 판정/피해에 상태 페널티 = 약화됨 수치.'},
  {name:'매혹됨',en:'Charmed',valued:false,desc:'특정 생물에게 우호적 감정을 느낌. 그 생물을 해치는 행동에 제한.'},
  {name:'피로',en:'Fatigued',valued:false,desc:'모든 판정/DC에 -1 상황 페널티. 방어구 착용 중 이동 속도 5피트 감소. 휴식 후 해제.'},
  {name:'방어불가',en:'Flat-Footed',valued:false,desc:'민첩 보너스가 AC에 적용되지 않음.'},
  {name:'도주중',en:'Fleeing',valued:false,desc:'매 턴 최대한 멀리 이동 필수. 다른 행동 불가.'},
  {name:'우호적',en:'Friendly',valued:false,desc:'당신에게 우호적. 요청에 응할 가능성 높음.'},
  {name:'공포',en:'Frightened',valued:true,max:4,desc:'모든 판정/DC에 상태 페널티 = 공포 수치. 매 턴 종료 시 1 감소.'},
  {name:'붙잡힘',en:'Grabbed',valued:false,desc:'이동 속도 0. 탈출 행동으로 종료 가능.'},
  {name:'협력적',en:'Helpful',valued:false,desc:'당신을 돕기를 원함. 도움 요청 성공 가능성 높음.'},
  {name:'숨겨짐',en:'Hidden',valued:false,desc:'존재는 알려졌지만 위치 모름. 발견하려면 DC 9 단순 판정 필요.'},
  {name:'고정됨',en:'Immobilized',valued:false,desc:'이동 속도 0. 회전은 가능.'},
  {name:'무관심',en:'Indifferent',valued:false,desc:'당신에 대해 중립적. 외교 보너스/페널티 없음.'},
  {name:'투명',en:'Invisible',valued:false,desc:'보이지 않음. 대상 지정 불가(위치 알면 DC 11 단순 판정).'},
  {name:'발각됨',en:'Observed',valued:false,desc:'발견됨. 은신 시도 전 상태.'},
  {name:'마비',en:'Paralyzed',valued:false,desc:'행동/반응 불가. AC에 -2 상황 페널티. 방어불가 상태.'},
  {name:'석화',en:'Petrified',valued:false,desc:'돌로 변함. 무의식이며 피해 면역. 돌 상태에서만 피해 가능.'},
  {name:'넘어짐',en:'Prone',valued:false,desc:'근접 공격에 -2, 원거리 공격에 +2 AC. 일어서기 = 25피트 이동 소모.'},
  {name:'속행',en:'Quickened',valued:false,desc:'매 턴 행동이 1개 추가됨. 추가 행동은 특정 행동에만 사용 가능.'},
  {name:'속박됨',en:'Restrained',valued:false,desc:'붙잡힘 + 고정됨 상태. 이동 속도 0.'},
  {name:'구역질',en:'Sickened',valued:true,max:4,desc:'모든 판정/공격에 상태 페널티 = 구역질 수치. 음식 섭취 불가.'},
  {name:'행동감소',en:'Slowed',valued:true,max:3,desc:'매 턴 행동 수 = 3 - 행동감소 수치.'},
  {name:'기절',en:'Stunned',valued:true,max:4,desc:'행동 수치가 기절 값만큼 소모됨. 매 턴 기절 수치만큼 행동 손실.'},
  {name:'혼미',en:'Stupefied',valued:true,max:4,desc:'지능/지혜/매력 기반 판정과 주문 DC에 상태 페널티 = 혼미 수치.'},
  {name:'의식불명',en:'Unconscious',valued:false,desc:'행동/반응 불가. AC -4, 지각 -4, 실명+귀머거리. 피해 받으면 깨날 수 있음.'},
  {name:'미감지',en:'Undetected',valued:false,desc:'존재와 위치 모두 알려지지 않음.'},
  {name:'비우호적',en:'Unfriendly',valued:false,desc:'당신을 비우호적으로 봄. 외교 -1 상황 페널티.'},
  {name:'존재미인지',en:'Unnoticed',valued:false,desc:'당신의 존재 자체를 모름.'},
  {name:'부상',en:'Wounded',valued:true,max:3,desc:'빈사 판정 DC에 부상 수치가 누적. 치유 후 휴식으로 1 감소.'},
];

const SKILLS = [
  {id:'acrobatics',  name:'곡예',   en:'Acrobatics',  attr:'dex'},
  {id:'arcana',      name:'주문학', en:'Arcana',       attr:'int'},
  {id:'athletics',   name:'운동',   en:'Athletics',    attr:'str'},
  {id:'crafting',    name:'제작',   en:'Crafting',     attr:'int'},
  {id:'deception',   name:'기만',   en:'Deception',    attr:'cha'},
  {id:'diplomacy',   name:'외교',   en:'Diplomacy',    attr:'cha'},
  {id:'intimidation',name:'위협',   en:'Intimidation', attr:'cha'},
  {id:'lore1',       name:'지식 1', en:'Lore',         attr:'int', isLore:true},
  {id:'lore2',       name:'지식 2', en:'Lore',         attr:'int', isLore:true},
  {id:'medicine',    name:'의학',   en:'Medicine',     attr:'wis'},
  {id:'nature',      name:'자연학',   en:'Nature',       attr:'wis'},
  {id:'occultism',   name:'오컬티즘', en:'Occultism',    attr:'int'},
  {id:'performance', name:'공연',   en:'Performance',  attr:'cha'},
  {id:'religion',    name:'종교학',   en:'Religion',     attr:'wis'},
  {id:'society',     name:'사회',   en:'Society',      attr:'int'},
  {id:'stealth',     name:'은신',   en:'Stealth',      attr:'dex'},
  {id:'survival',    name:'생존',   en:'Survival',     attr:'wis'},
  {id:'thievery',    name:'도둑질', en:'Thievery',     attr:'dex'},
];

const SKILL_NAME_MAP = {
  '곡예':'acrobatics','주문학':'arcana','운동':'athletics','제작':'crafting',
  '기만':'deception','외교':'diplomacy','위협':'intimidation','의학':'medicine',
  '자연학':'nature','자연':'nature','오컬티즘':'occultism','공연':'performance',
  '종교학':'religion','사회':'society','은신':'stealth','생존':'survival','도둑질':'thievery',
};

const ACTION_DB = [
  // ── 기본 행동 (항상 사용 가능) ──
  {id:'strike',        cat:'basic', cat_label:'기본 행동', name_ko:'스트라이크',      name_en:'Strike',         cost:'1',        traits:['공격'],            req_skill:null, req_rank:0, req_feat:null, summary:'근접 또는 원거리 무기로 공격 1회를 가합니다. 다중 공격 페널티가 적용됩니다.'},
  {id:'stride',        cat:'basic', cat_label:'기본 행동', name_ko:'이동',            name_en:'Stride',         cost:'1',        traits:['이동'],            req_skill:null, req_rank:0, req_feat:null, summary:'이동 속도만큼 이동합니다.'},
  {id:'step',          cat:'basic', cat_label:'기본 행동', name_ko:'비틀거림',        name_en:'Step',           cost:'1',        traits:[],                  req_skill:null, req_rank:0, req_feat:null, summary:'반응 행동을 유발하지 않고 5피트 이동합니다.'},
  {id:'interact',      cat:'basic', cat_label:'기본 행동', name_ko:'상호작용',        name_en:'Interact',       cost:'1',        traits:['조작'],            req_skill:null, req_rank:0, req_feat:null, summary:'물건을 집거나, 장비를 꺼내거나, 문을 열거나, 간단한 조작을 합니다.'},
  {id:'escape',        cat:'basic', cat_label:'기본 행동', name_ko:'탈출',            name_en:'Escape',         cost:'1',        traits:['공격'],            req_skill:null, req_rank:0, req_feat:null, summary:'붙잡히거나 속박된 상태에서 벗어납니다. 운동 또는 곡예 또는 명중 굴림.'},
  {id:'seek',          cat:'basic', cat_label:'기본 행동', name_ko:'탐색',            name_en:'Seek',           cost:'1',        traits:[],                  req_skill:null, req_rank:0, req_feat:null, summary:'주변 30피트(원뿔 15피트) 내의 숨겨진 존재나 물체를 탐지합니다. 지각 판정.'},
  {id:'stand',         cat:'basic', cat_label:'기본 행동', name_ko:'서기',            name_en:'Stand',          cost:'1',        traits:[],                  req_skill:null, req_rank:0, req_feat:null, summary:'넘어짐 상태를 해제하고 일어납니다.'},
  {id:'drop-prone',    cat:'basic', cat_label:'기본 행동', name_ko:'엎드리기',        name_en:'Drop Prone',     cost:'1',        traits:[],                  req_skill:null, req_rank:0, req_feat:null, summary:'자발적으로 넘어짐 상태가 됩니다. 원거리 공격에 대한 은폐를 얻습니다.'},
  {id:'take-cover',    cat:'basic', cat_label:'기본 행동', name_ko:'엄폐',            name_en:'Take Cover',     cost:'1',        traits:[],                  req_skill:null, req_rank:0, req_feat:null, summary:'장애물 뒤에 몸을 숨겨 은폐(+2 AC, Reflex, Stealth)를 얻습니다.'},
  {id:'raise-shield',  cat:'basic', cat_label:'기본 행동', name_ko:'방패 올리기',     name_en:'Raise a Shield', cost:'1',        traits:[],                  req_skill:null, req_rank:0, req_feat:null, summary:'방패를 들어 AC에 방패 보너스를 적용합니다.'},
  {id:'sustain',       cat:'basic', cat_label:'기본 행동', name_ko:'주문 지속',       name_en:'Sustain',        cost:'1',        traits:['주문'],            req_skill:null, req_rank:0, req_feat:null, summary:'유지 가능한 주문의 효과를 한 라운드 더 지속합니다.'},
  {id:'delay',         cat:'basic', cat_label:'기본 행동', name_ko:'지연',            name_en:'Delay',          cost:'free',     traits:[],                  req_skill:null, req_rank:0, req_feat:null, summary:'자신의 턴을 나중으로 미룹니다. 그 전까지 아무 행동도 하지 않습니다.'},
  {id:'ready',         cat:'basic', cat_label:'기본 행동', name_ko:'준비',            name_en:'Ready',          cost:'2',        traits:[],                  req_skill:null, req_rank:0, req_feat:null, summary:'특정 조건이 발생했을 때 반응으로 1행동 또는 자유 행동을 취합니다.'},
  {id:'aid',           cat:'basic', cat_label:'기본 행동', name_ko:'도움',            name_en:'Aid',            cost:'reaction', traits:[],                  req_skill:null, req_rank:0, req_feat:null, summary:'동료의 판정이나 AC에 +1~+3 보너스를 줍니다. 전 라운드에 준비해야 합니다.'},

  // ── 운동 (Athletics) 기술 행동 ──
  {id:'climb',         cat:'skill', cat_label:'운동 행동', name_ko:'등반',            name_en:'Climb',          cost:'1',        traits:['이동'],            req_skill:'athletics', req_rank:0, req_feat:null, summary:'수직 표면이나 경사면을 올라갑니다. DC는 표면의 난이도에 따라 다릅니다.'},
  {id:'swim',          cat:'skill', cat_label:'운동 행동', name_ko:'수영',            name_en:'Swim',           cost:'1',        traits:['이동'],            req_skill:'athletics', req_rank:0, req_feat:null, summary:'물 속에서 이동합니다. DC는 수류의 세기에 따라 다릅니다.'},
  {id:'high-jump',     cat:'skill', cat_label:'운동 행동', name_ko:'높이뛰기',        name_en:'High Jump',      cost:'2',        traits:[],                  req_skill:'athletics', req_rank:0, req_feat:null, summary:'이동 후 수직으로 점프합니다. DC 30은 일반 도달 이상 높이.'},
  {id:'long-jump',     cat:'skill', cat_label:'운동 행동', name_ko:'넓이뛰기',        name_en:'Long Jump',      cost:'2',        traits:[],                  req_skill:'athletics', req_rank:0, req_feat:null, summary:'이동 후 수평으로 점프합니다. DC = 뛰어넘을 거리(피트).'},
  {id:'shove',         cat:'skill', cat_label:'운동 행동', name_ko:'밀기',            name_en:'Shove',          cost:'1',        traits:['공격'],            req_skill:'athletics', req_rank:0, req_feat:null, summary:'대상을 5피트 밀어냅니다(대성공 시 10피트). 크기가 1단계 이상 크면 불가.'},
  {id:'trip',          cat:'skill', cat_label:'운동 행동', name_ko:'넘어뜨리기',      name_en:'Trip',           cost:'1',        traits:['공격'],            req_skill:'athletics', req_rank:0, req_feat:null, summary:'대상을 넘어짐 상태로 만듭니다. 크기가 1단계 이상 크면 불가.'},
  {id:'grapple',       cat:'skill', cat_label:'운동 행동', name_ko:'붙잡기',          name_en:'Grapple',        cost:'1',        traits:['공격'],            req_skill:'athletics', req_rank:0, req_feat:null, summary:'대상을 붙잡혀 있음 상태로 만듭니다. 비어있는 손이 필요합니다.'},
  {id:'disarm',        cat:'skill', cat_label:'운동 행동', name_ko:'무장해제',        name_en:'Disarm',         cost:'1',        traits:['공격','교묘'],     req_skill:'athletics', req_rank:2, req_feat:null, summary:'대상의 손에서 물건을 떨어뜨립니다. 숙련 이상 필요.'},
  {id:'force-open',    cat:'skill', cat_label:'운동 행동', name_ko:'강제 개방',       name_en:'Force Open',     cost:'1',        traits:['공격'],            req_skill:'athletics', req_rank:0, req_feat:null, summary:'자물쇠나 막힌 문, 상자, 족쇄 등을 힘으로 열거나 부숩니다.'},
  {id:'reposition',    cat:'skill', cat_label:'운동 행동', name_ko:'위치 변경',       name_en:'Reposition',     cost:'1',        traits:['공격'],            req_skill:'athletics', req_rank:0, req_feat:null, summary:'대상을 5피트 원하는 방향으로 이동시킵니다(대성공 10피트).'},

  // ── 곡예 (Acrobatics) 기술 행동 ──
  {id:'balance',       cat:'skill', cat_label:'곡예 행동', name_ko:'균형 잡기',       name_en:'Balance',        cost:'1',        traits:['이동'],            req_skill:'acrobatics', req_rank:0, req_feat:null, summary:'불안정한 지형을 반 속도로 이동합니다. 실패 시 넘어짐.'},
  {id:'tumble-through',cat:'skill', cat_label:'곡예 행동', name_ko:'넘어 지나가기',   name_en:'Tumble Through', cost:'1',        traits:['이동'],            req_skill:'acrobatics', req_rank:0, req_feat:null, summary:'적의 위협 공간을 통과하여 이동합니다.'},
  {id:'maneuver-flight',cat:'skill',cat_label:'곡예 행동', name_ko:'공중 기동',       name_en:'Maneuver in Flight',cost:'1',     traits:['이동'],            req_skill:'acrobatics', req_rank:2, req_feat:null, summary:'비행 중 급선회 등 어려운 기동을 합니다. 숙련 필요.'},
  {id:'squeeze',       cat:'skill', cat_label:'곡예 행동', name_ko:'비집고 들어가기', name_en:'Squeeze',        cost:'1min',     traits:[],                  req_skill:'acrobatics', req_rank:0, req_feat:null, summary:'자기 크기보다 작은 공간을 1분에 걸쳐 통과합니다.'},

  // ── 은신 (Stealth) 기술 행동 ──
  {id:'hide',          cat:'skill', cat_label:'은신 행동', name_ko:'숨기',            name_en:'Hide',           cost:'1',        traits:[],                  req_skill:'stealth', req_rank:0, req_feat:null, summary:'숨겨짐 상태를 시도합니다. 장애물이나 어둠이 필요합니다.'},
  {id:'sneak',         cat:'skill', cat_label:'은신 행동', name_ko:'살금살금 이동',   name_en:'Sneak',          cost:'1',        traits:['이동'],            req_skill:'stealth', req_rank:0, req_feat:null, summary:'숨겨짐 또는 미감지 상태를 유지하면서 이동합니다.'},

  // ── 기만 (Deception) 기술 행동 ──
  {id:'lie',           cat:'skill', cat_label:'기만 행동', name_ko:'거짓말',          name_en:'Lie',            cost:'varies',   traits:['언어'],            req_skill:'deception', req_rank:0, req_feat:null, summary:'사실이 아닌 것을 대상이 믿도록 설득합니다.'},
  {id:'impersonate',   cat:'skill', cat_label:'기만 행동', name_ko:'변장',            name_en:'Impersonate',    cost:'10min',    traits:[],                  req_skill:'deception', req_rank:0, req_feat:null, summary:'다른 사람이나 존재로 변장합니다.'},
  {id:'feint',         cat:'skill', cat_label:'기만 행동', name_ko:'페인트',          name_en:'Feint',          cost:'1',        traits:[],                  req_skill:'deception', req_rank:2, req_feat:null, summary:'근접 거리 내 대상을 기만하여 피격 시 민첩 보너스를 빼앗습니다. 숙련 필요.'},
  {id:'create-diversion',cat:'skill',cat_label:'기만 행동',name_ko:'주의 분산',       name_en:'Create a Diversion',cost:'1',     traits:[],                  req_skill:'deception', req_rank:0, req_feat:null, summary:'대상의 시선을 돌려 숨기 행동에 유리한 조건을 만듭니다.'},

  // ── 외교 (Diplomacy) 기술 행동 ──
  {id:'make-impression',cat:'skill',cat_label:'외교 행동', name_ko:'인상 심기',       name_en:'Make an Impression',cost:'1min',  traits:['언어'],            req_skill:'diplomacy', req_rank:0, req_feat:null, summary:'1분간 교류로 대상의 태도를 우호적으로 변경합니다.'},
  {id:'request',       cat:'skill', cat_label:'외교 행동', name_ko:'요청',            name_en:'Request',        cost:'1',        traits:['언어'],            req_skill:'diplomacy', req_rank:0, req_feat:null, summary:'우호적 또는 협력적 대상에게 무언가를 부탁합니다.'},
  {id:'gather-info',   cat:'skill', cat_label:'외교 행동', name_ko:'정보 수집',       name_en:'Gather Information',cost:'1h',    traits:[],                  req_skill:'diplomacy', req_rank:0, req_feat:null, summary:'1시간에 걸쳐 마을 등지에서 정보를 수집합니다.'},

  // ── 위협 (Intimidation) 기술 행동 ──
  {id:'demoralize',    cat:'skill', cat_label:'위협 행동', name_ko:'사기 꺾기',       name_en:'Demoralize',     cost:'1',        traits:['감정','정신','공포'],req_skill:'intimidation', req_rank:0, req_feat:null, summary:'대상을 공포 1 상태로 만듭니다. 같은 조우에서 한 번씩만 사용 가능.'},
  {id:'coerce',        cat:'skill', cat_label:'위협 행동', name_ko:'강요',            name_en:'Coerce',         cost:'1min',     traits:['감정','정신'],     req_skill:'intimidation', req_rank:0, req_feat:null, summary:'위협으로 대상이 원하는 것을 하도록 강요합니다.'},

  // ── 의학 (Medicine) 기술 행동 ──
  {id:'stabilize',     cat:'skill', cat_label:'의학 행동', name_ko:'안정화',          name_en:'Stabilize',      cost:'1',        traits:[],                  req_skill:'medicine', req_rank:0, req_feat:null, summary:'빈사 상태 대상의 빈사 값을 줄여 의식 불명 상태를 유지합니다.'},
  {id:'treat-wounds',  cat:'skill', cat_label:'의학 행동', name_ko:'부상 치료',       name_en:'Treat Wounds',   cost:'10min',    traits:[],                  req_skill:'medicine', req_rank:2, req_feat:null, summary:'10분 동안 치료하여 HP를 회복시킵니다. 의사 도구 필요. 숙련 필요.'},
  {id:'treat-poison',  cat:'skill', cat_label:'의학 행동', name_ko:'독 치료',         name_en:'Treat Poison',   cost:'1',        traits:[],                  req_skill:'medicine', req_rank:2, req_feat:null, summary:'독에 걸린 대상의 다음 내성 굴림에 보너스를 줍니다. 숙련 필요.'},
  {id:'treat-disease', cat:'skill', cat_label:'의학 행동', name_ko:'질병 치료',       name_en:'Treat Disease',  cost:'8h',       traits:[],                  req_skill:'medicine', req_rank:2, req_feat:null, summary:'질병에 걸린 대상의 다음 내성 굴림에 보너스를 줍니다. 숙련 필요.'},
  {id:'first-aid',     cat:'skill', cat_label:'의학 행동', name_ko:'응급 처치',       name_en:'First Aid',      cost:'1',        traits:[],                  req_skill:'medicine', req_rank:0, req_feat:null, summary:'지혈(피를 흘리는 상태 해제) 또는 공포에 빠진 동료를 깨웁니다.'},

  // ── 도둑질 (Thievery) 기술 행동 ──
  {id:'steal',         cat:'skill', cat_label:'도둑질 행동', name_ko:'소매치기',       name_en:'Steal',          cost:'1',        traits:['교묘'],            req_skill:'thievery', req_rank:0, req_feat:null, summary:'대상이 인식하지 못하는 사이 들고 있는 물건을 훔칩니다.'},
  {id:'pick-lock',     cat:'skill', cat_label:'도둑질 행동', name_ko:'자물쇠 따기',    name_en:'Pick a Lock',    cost:'2',        traits:['교묘'],            req_skill:'thievery', req_rank:2, req_feat:null, summary:'잠긴 자물쇠를 엽니다. 도둑 도구 필요. 숙련 필요.'},
  {id:'disable-device',cat:'skill', cat_label:'도둑질 행동', name_ko:'장치 해제',       name_en:'Disable a Device',cost:'2',      traits:['교묘'],            req_skill:'thievery', req_rank:2, req_feat:null, summary:'함정 등 위험한 장치를 비활성화합니다. 도둑 도구 필요. 숙련 필요.'},

  // ── 자연 (Nature) 기술 행동 ──
  {id:'command-animal',cat:'skill', cat_label:'자연 행동', name_ko:'동물 지시',       name_en:'Command an Animal',cost:'1',      traits:['청각','언어'],     req_skill:'nature', req_rank:2, req_feat:null, summary:'훈련된 동물이 단순한 지시를 따르도록 합니다. 숙련 필요.'},

  // ── 생존 (Survival) 기술 행동 ──
  {id:'sense-direction',cat:'skill',cat_label:'생존 행동', name_ko:'방향 감지',       name_en:'Sense Direction', cost:'varies',   traits:[],                  req_skill:'survival', req_rank:0, req_feat:null, summary:'나침반 없이 방향을 감지합니다. 전설급은 다른 차원에서도 가능.'},
  {id:'track',         cat:'skill', cat_label:'생존 행동', name_ko:'추적',            name_en:'Track',           cost:'1',        traits:['이동'],            req_skill:'survival', req_rank:2, req_feat:null, summary:'흔적을 따라 대상을 추적합니다. 숙련 필요.'},
  {id:'cover-tracks',  cat:'skill', cat_label:'생존 행동', name_ko:'흔적 지우기',     name_en:'Cover Tracks',    cost:'1',        traits:['이동'],            req_skill:'survival', req_rank:2, req_feat:null, summary:'이동하면서 자신의 발자국을 지웁니다. 숙련 필요.'},

  // ── 제작 (Crafting) 기술 행동 ──
  {id:'repair',        cat:'skill', cat_label:'제작 행동', name_ko:'수리',            name_en:'Repair',          cost:'10min',    traits:[],                  req_skill:'crafting', req_rank:0, req_feat:null, summary:'손상된 물건을 수리합니다. 제작 도구 필요.'},
  {id:'craft',         cat:'skill', cat_label:'제작 행동', name_ko:'제작',            name_en:'Craft',           cost:'1day',     traits:[],                  req_skill:'crafting', req_rank:2, req_feat:null, summary:'물건을 제작합니다. 공식과 재료가 필요합니다. 숙련 필요.'},
  {id:'earn-income-cr',cat:'skill', cat_label:'제작 행동', name_ko:'수입 창출(제작)', name_en:'Earn Income',     cost:'1day',     traits:[],                  req_skill:'crafting', req_rank:0, req_feat:null, summary:'기술을 활용해 하루에 일정 수입을 얻습니다.'},

  // ── 공연 (Performance) 기술 행동 ──
  {id:'perform',       cat:'skill', cat_label:'공연 행동', name_ko:'공연',            name_en:'Perform',         cost:'1',        traits:[],                  req_skill:'performance', req_rank:0, req_feat:null, summary:'관중 앞에서 공연합니다. 반응이나 수입을 얻을 수 있습니다.'},

  // ── 지식 기술 행동 (Recall Knowledge) ──
  {id:'recall-arcana', cat:'skill', cat_label:'지식 행동', name_ko:'지식 회상(주문학)',name_en:'Recall Knowledge',cost:'1',       traits:['집중'],            req_skill:'arcana',      req_rank:0, req_feat:null, summary:'주문, 마법 아이템, 아케인 전통 등에 대한 정보를 회상합니다.'},
  {id:'recall-nature', cat:'skill', cat_label:'지식 행동', name_ko:'지식 회상(자연학)',  name_en:'Recall Knowledge',cost:'1',       traits:['집중'],            req_skill:'nature',      req_rank:0, req_feat:null, summary:'동물, 식물, 자연 현상에 대한 정보를 회상합니다.'},
  {id:'recall-occult', cat:'skill', cat_label:'지식 행동', name_ko:'지식 회상(오컬티즘)',  name_en:'Recall Knowledge',cost:'1',       traits:['집중'],            req_skill:'occultism',   req_rank:0, req_feat:null, summary:'신비로운 현상, 악령, 오컬티즘 전통에 대한 정보를 회상합니다.'},
  {id:'recall-religion',cat:'skill',cat_label:'지식 행동', name_ko:'지식 회상(종교학)',  name_en:'Recall Knowledge',cost:'1',       traits:['집중'],            req_skill:'religion',    req_rank:0, req_feat:null, summary:'신들, 악마, 신성한 전통에 대한 정보를 회상합니다.'},
  {id:'recall-society',cat:'skill', cat_label:'지식 행동', name_ko:'지식 회상(사회)',  name_en:'Recall Knowledge',cost:'1',       traits:['집중'],            req_skill:'society',     req_rank:0, req_feat:null, summary:'귀족, 법, 역사, 인간 문명에 대한 정보를 회상합니다.'},

  // ── 재주로 해금되는 행동 ──
  {id:'shield-block',  cat:'feat',  cat_label:'재주 행동', name_ko:'방패 막기',       name_en:'Shield Block',   cost:'reaction', traits:[],                  req_skill:null, req_rank:0, req_feat:'방패 막기', summary:'방패를 올린 상태에서 피해를 받을 때, 방패로 막아 피해를 감소시킵니다.'},
  {id:'aoo',           cat:'feat',  cat_label:'재주 행동', name_ko:'기회 공격',       name_en:'Attack of Opportunity',cost:'reaction',traits:['전사'],         req_skill:null, req_rank:0, req_feat:'기회 공격', summary:'적이 원거리 공격, 기술 행동, 이동 시 트리거하여 근접 스트라이크를 가합니다.'},
  {id:'sudden-charge', cat:'feat',  cat_label:'재주 행동', name_ko:'돌격',            name_en:'Sudden Charge',  cost:'2',        traits:['충격','이동'],     req_skill:null, req_rank:0, req_feat:'돌격', summary:'2배 이동 속도로 달려가 스트라이크를 가합니다.'},
  {id:'power-attack',  cat:'feat',  cat_label:'재주 행동', name_ko:'강공격',          name_en:'Power Attack',   cost:'2',        traits:['전사'],            req_skill:null, req_rank:0, req_feat:'강공격', summary:'두 행동을 소모하여 추가 피해 주사위 1개를 더한 스트라이크를 가합니다.'},
  {id:'reactive-shield',cat:'feat', cat_label:'재주 행동', name_ko:'반응 방패',       name_en:'Reactive Shield',cost:'reaction', traits:[],                  req_skill:null, req_rank:0, req_feat:'반응 방패', summary:'명중 당할 때 반응으로 방패 올리기를 사용합니다.'},
  {id:'double-slice',  cat:'feat',  cat_label:'재주 행동', name_ko:'이중 참격',       name_en:'Double Slice',   cost:'2',        traits:[],                  req_skill:null, req_rank:0, req_feat:'이중 참격', summary:'양손 무기로 두 번 스트라이크를 가합니다. 두 번째 타격의 다중 공격 페널티 감소.'},
  {id:'sneak-attack-ability',cat:'feat',cat_label:'재주 행동',name_ko:'기습 공격',    name_en:'Sneak Attack',   cost:'passive',  traits:[],                  req_skill:null, req_rank:0, req_feat:'기습 공격', summary:'대상이 속임수(flanked) 또는 민첩 보너스를 잃을 때 추가 정밀 피해를 입힙니다.'},
  {id:'inspire-courage',cat:'feat', cat_label:'재주 행동', name_ko:'용기 고취',       name_en:'Inspire Courage',cost:'1',        traits:['집중','조작','청각','감정','정신'],req_skill:null, req_rank:0, req_feat:'용기 고취', summary:'바드 캔트립. 아군의 명중 굴림과 피해 굴림에 +1 사기 보너스.'},
  {id:'inspire-defense',cat:'feat', cat_label:'재주 행동', name_ko:'방어 고취',       name_en:'Inspire Defense',cost:'1',        traits:['집중','조작','청각','감정','정신'],req_skill:null, req_rank:0, req_feat:'방어 고취', summary:'바드 캔트립. 아군의 AC와 내성에 +1 사기 보너스.'},
  {id:'channel-smite', cat:'feat',  cat_label:'재주 행동', name_ko:'채널 강타',       name_en:'Channel Smite',  cost:'2',        traits:['신성','사악','선'],req_skill:null, req_rank:0, req_feat:'채널 강타', summary:'신성 시전 에너지를 무기 타격에 담아 발사합니다.'},
];

const CONDITIONS = [
  '실명','파손됨','둔함','은폐됨','혼란','지배됨','현혹됨','귀머거리',
  '파멸','쇠약','빈사','약화됨','매혹됨','피로','방어불가','도주중',
  '우호적','공포','붙잡힘','협력적','숨겨짐','고정됨','무관심','투명',
  '발각됨','마비','석화','넘어짐','속행','속박됨','구역질','행동감소',
  '기절','혼미','의식불명','미감지','비우호적','존재미인지','부상'
];

const PROF_RANKS = {
  '미숙련':0,'숙련':2,'전문가':4,'달인':6,'전설':8,
  '0':0,'2':2,'4':4,'6':6,'8':8
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
  spells: {cantrip:[], known:[], focus:[]},
  cantripSlots: 5,
  spellSlots: {},
  spellSlotsUsed: {},
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

