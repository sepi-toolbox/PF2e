// Pathfinder 2e Player Core — Equipment Database
// 출처: PlayerCore.html 6장 장비

const ARMOR_DB = [
  // ── 비무장 ──
  {name_ko:'갑옷 없음', name_en:'No Armor', category:'비무장', price:'—', ac_bonus:0, dex_cap:null, check_penalty:0, speed_penalty:0, strength:0, bulk:'—', group:'—', traits:[]},
  {name_ko:'탐험가 의복', name_en:"Explorer's Clothing", category:'비무장', price:'1sp', ac_bonus:0, dex_cap:5, check_penalty:0, speed_penalty:0, strength:0, bulk:'L', group:'천', traits:['편안']},
  // ── 경갑 ──
  {name_ko:'누비 갑옷', name_en:'Padded Armor', category:'경갑', price:'2sp', ac_bonus:1, dex_cap:3, check_penalty:0, speed_penalty:0, strength:0, bulk:'L', group:'천', traits:['편안']},
  {name_ko:'가죽 갑옷', name_en:'Leather Armor', category:'경갑', price:'2gp', ac_bonus:1, dex_cap:4, check_penalty:-1, speed_penalty:0, strength:0, bulk:1, group:'가죽', traits:[]},
  {name_ko:'징 박힌 가죽 갑옷', name_en:'Studded Leather', category:'경갑', price:'3gp', ac_bonus:2, dex_cap:3, check_penalty:-1, speed_penalty:0, strength:1, bulk:1, group:'가죽', traits:[]},
  {name_ko:'사슬 셔츠', name_en:'Chain Shirt', category:'경갑', price:'5gp', ac_bonus:2, dex_cap:3, check_penalty:-1, speed_penalty:0, strength:1, bulk:1, group:'사슬', traits:['유연','시끄러운']},
  // ── 평갑 ──
  {name_ko:'하이드', name_en:'Hide Armor', category:'평갑', price:'2gp', ac_bonus:3, dex_cap:2, check_penalty:-2, speed_penalty:-5, strength:2, bulk:2, group:'가죽', traits:[]},
  {name_ko:'미늘 갑옷', name_en:'Scale Mail', category:'평갑', price:'4gp', ac_bonus:3, dex_cap:2, check_penalty:-2, speed_penalty:-5, strength:2, bulk:2, group:'합성', traits:[]},
  {name_ko:'사슬 갑옷', name_en:'Chain Mail', category:'평갑', price:'6gp', ac_bonus:4, dex_cap:1, check_penalty:-2, speed_penalty:-5, strength:3, bulk:2, group:'사슬', traits:['유연','시끄러운']},
  {name_ko:'브레스트플레이트', name_en:'Breastplate', category:'평갑', price:'8gp', ac_bonus:4, dex_cap:1, check_penalty:-2, speed_penalty:-5, strength:3, bulk:2, group:'판금', traits:[]},
  // ── 중갑 ──
  {name_ko:'스플린트', name_en:'Splint Mail', category:'중갑', price:'13gp', ac_bonus:5, dex_cap:1, check_penalty:-3, speed_penalty:-10, strength:3, bulk:3, group:'합성', traits:[]},
  {name_ko:'하프 플레이트', name_en:'Half Plate', category:'중갑', price:'18gp', ac_bonus:5, dex_cap:1, check_penalty:-3, speed_penalty:-10, strength:3, bulk:3, group:'판금', traits:[]},
  {name_ko:'풀 플레이트', name_en:'Full Plate', category:'중갑', price:'30gp', ac_bonus:6, dex_cap:0, check_penalty:-3, speed_penalty:-10, strength:4, bulk:4, group:'판금', traits:['방벽']},
];

const SHIELD_DB = [
  {name_ko:'버클러', name_en:'Buckler', price:'1gp', ac_bonus:1, speed_penalty:0, bulk:'L', hardness:3, hp:6, bt:3},
  {name_ko:'나무 방패', name_en:'Wooden Shield', price:'1gp', ac_bonus:2, speed_penalty:0, bulk:1, hardness:3, hp:12, bt:6},
  {name_ko:'강철 방패', name_en:'Steel Shield', price:'2gp', ac_bonus:2, speed_penalty:0, bulk:1, hardness:5, hp:20, bt:10},
  {name_ko:'타워 실드', name_en:'Tower Shield', price:'10gp', ac_bonus:2, speed_penalty:-5, bulk:4, hardness:5, hp:20, bt:10},
];

const WEAPON_DB = [
  // 단순 근접
  {name_ko:'클럽', name_en:'Club', category:'단순 근접', price:'—', damage:'1d6 B', bulk:1, hands:1, range:null, reload:null, group:'곤봉', traits:['투척 10ft']},
  {name_ko:'대거', name_en:'Dagger', category:'단순 근접', price:'2sp', damage:'1d4 P', bulk:'L', hands:1, range:null, reload:null, group:'칼', traits:['민첩','기교','투척 10ft','다용도 S']},
  {name_ko:'건틀릿', name_en:'Gauntlet', category:'단순 근접', price:'2sp', damage:'1d4 B', bulk:'L', hands:1, range:null, reload:null, group:'격투', traits:['민첩','자유 손']},
  {name_ko:'라이트 메이스', name_en:'Light Mace', category:'단순 근접', price:'4sp', damage:'1d4 B', bulk:'L', hands:1, range:null, reload:null, group:'곤봉', traits:['민첩','기교','밀기']},
  {name_ko:'롱스피어', name_en:'Longspear', category:'단순 근접', price:'5sp', damage:'1d8 P', bulk:2, hands:2, range:null, reload:null, group:'창', traits:['도달']},
  {name_ko:'메이스', name_en:'Mace', category:'단순 근접', price:'1gp', damage:'1d6 B', bulk:1, hands:1, range:null, reload:null, group:'곤봉', traits:['밀기']},
  {name_ko:'모닝스타', name_en:'Morningstar', category:'단순 근접', price:'1gp', damage:'1d6 B', bulk:1, hands:1, range:null, reload:null, group:'곤봉', traits:['다용도 P']},
  {name_ko:'낫', name_en:'Sickle', category:'단순 근접', price:'2sp', damage:'1d4 S', bulk:'L', hands:1, range:null, reload:null, group:'칼', traits:['민첩','기교','넘어뜨리기']},
  {name_ko:'창', name_en:'Spear', category:'단순 근접', price:'1sp', damage:'1d6 P', bulk:1, hands:1, range:null, reload:null, group:'창', traits:['수도승','투척 20ft']},
  {name_ko:'지팡이', name_en:'Staff', category:'단순 근접', price:'—', damage:'1d4 B', bulk:1, hands:1, range:null, reload:null, group:'곤봉', traits:['수도승','양손 d8']},
  {name_ko:'씨족 대거', name_en:'Clan Dagger', category:'단순 근접(비일반)', price:'2gp', damage:'1d4 P', bulk:'L', hands:1, range:null, reload:null, group:'칼', traits:['민첩','드워프','막기','다용도 B']},
  {name_ko:'카타르', name_en:'Katar', category:'단순 근접(비일반)', price:'3sp', damage:'1d4 P', bulk:'L', hands:1, range:null, reload:null, group:'칼', traits:['민첩','치명 d6','수도승']},
  // 군용 근접
  {name_ko:'바스타드 소드', name_en:'Bastard Sword', category:'군용 근접', price:'4gp', damage:'1d8 S', bulk:1, hands:1, range:null, reload:null, group:'검', traits:['양손 d12']},
  {name_ko:'전투 도끼', name_en:'Battle Axe', category:'군용 근접', price:'1gp', damage:'1d8 S', bulk:1, hands:1, range:null, reload:null, group:'도끼', traits:['쓸기']},
  {name_ko:'팔치온', name_en:'Falchion', category:'군용 근접', price:'3gp', damage:'1d10 S', bulk:2, hands:2, range:null, reload:null, group:'검', traits:['강제 개방','쓸기']},
  {name_ko:'플레일', name_en:'Flail', category:'군용 근접', price:'8sp', damage:'1d6 B', bulk:1, hands:1, range:null, reload:null, group:'플레일', traits:['해제','쓸기','넘어뜨리기']},
  {name_ko:'글레이브', name_en:'Glaive', category:'군용 근접', price:'1gp', damage:'1d8 S', bulk:2, hands:2, range:null, reload:null, group:'장창', traits:['치명 d8','강제 개방','도달']},
  {name_ko:'그레이트액스', name_en:'Greataxe', category:'군용 근접', price:'2gp', damage:'1d12 S', bulk:2, hands:2, range:null, reload:null, group:'도끼', traits:['쓸기']},
  {name_ko:'그레이트클럽', name_en:'Greatclub', category:'군용 근접', price:'1gp', damage:'1d10 B', bulk:2, hands:2, range:null, reload:null, group:'곤봉', traits:['뒤 쓸기','밀기']},
  {name_ko:'그레이트소드', name_en:'Greatsword', category:'군용 근접', price:'2gp', damage:'1d12 S', bulk:2, hands:2, range:null, reload:null, group:'검', traits:['다용도 P']},
  {name_ko:'할버드', name_en:'Halberd', category:'군용 근접', price:'2gp', damage:'1d10 P', bulk:2, hands:2, range:null, reload:null, group:'장창', traits:['도달','다용도 S']},
  {name_ko:'손도끼', name_en:'Hatchet', category:'군용 근접', price:'4sp', damage:'1d6 S', bulk:'L', hands:1, range:null, reload:null, group:'도끼', traits:['민첩','쓸기','투척 10ft']},
  {name_ko:'라이트 해머', name_en:'Light Hammer', category:'군용 근접', price:'3sp', damage:'1d6 B', bulk:'L', hands:1, range:null, reload:null, group:'해머', traits:['민첩','투척 20ft']},
  {name_ko:'롱소드', name_en:'Longsword', category:'군용 근접', price:'1gp', damage:'1d8 S', bulk:1, hands:1, range:null, reload:null, group:'검', traits:['다용도 P']},
  {name_ko:'메인 고쉬', name_en:'Main-Gauche', category:'군용 근접', price:'5sp', damage:'1d4 P', bulk:'L', hands:1, range:null, reload:null, group:'칼', traits:['민첩','해제','기교','막기','다용도 S']},
  {name_ko:'몰', name_en:'Maul', category:'군용 근접', price:'3gp', damage:'1d12 B', bulk:2, hands:2, range:null, reload:null, group:'해머', traits:['밀기']},
  {name_ko:'픽', name_en:'Pick', category:'군용 근접', price:'7sp', damage:'1d6 P', bulk:1, hands:1, range:null, reload:null, group:'곡괭이', traits:['치사 d10']},
  {name_ko:'레이피어', name_en:'Rapier', category:'군용 근접', price:'2gp', damage:'1d6 P', bulk:1, hands:1, range:null, reload:null, group:'검', traits:['치명 d8','해제','기교']},
  {name_ko:'샙', name_en:'Sap', category:'군용 근접', price:'1sp', damage:'1d6 B', bulk:'L', hands:1, range:null, reload:null, group:'곤봉', traits:['민첩','비치명']},
  {name_ko:'시미터', name_en:'Scimitar', category:'군용 근접', price:'1gp', damage:'1d6 S', bulk:1, hands:1, range:null, reload:null, group:'검', traits:['강제 개방','쓸기']},
  {name_ko:'대낫', name_en:'Scythe', category:'군용 근접', price:'2gp', damage:'1d10 S', bulk:2, hands:2, range:null, reload:null, group:'장창', traits:['치명 d10','넘어뜨리기']},
  {name_ko:'쇼트소드', name_en:'Shortsword', category:'군용 근접', price:'9sp', damage:'1d6 P', bulk:'L', hands:1, range:null, reload:null, group:'검', traits:['민첩','기교','다용도 S']},
  {name_ko:'삼지창', name_en:'Trident', category:'군용 근접', price:'1gp', damage:'1d8 P', bulk:1, hands:1, range:null, reload:null, group:'창', traits:['투척 20ft']},
  {name_ko:'워해머', name_en:'Warhammer', category:'군용 근접', price:'1gp', damage:'1d8 B', bulk:1, hands:1, range:null, reload:null, group:'해머', traits:['밀기']},
  {name_ko:'채찍', name_en:'Whip', category:'군용 근접', price:'1sp', damage:'1d4 S', bulk:1, hands:1, range:null, reload:null, group:'플레일', traits:['해제','기교','비치명','도달','넘어뜨리기']},
  {name_ko:'드워프 전쟁도끼', name_en:'Dwarven Waraxe', category:'군용 근접(비일반)', price:'3gp', damage:'1d8 S', bulk:2, hands:1, range:null, reload:null, group:'도끼', traits:['드워프','쓸기','양손 d12']},
  {name_ko:'오크 목 찍기', name_en:'Orc Necksplitter', category:'군용 근접(비일반)', price:'2gp', damage:'1d8 S', bulk:1, hands:1, range:null, reload:null, group:'도끼', traits:['강제 개방','오크','쓸기']},
  // 단순 원거리
  {name_ko:'블로우건', name_en:'Blowgun', category:'단순 원거리', price:'1sp', damage:'1 P', bulk:'L', hands:1, range:20, reload:1, group:'다트', traits:['민첩','비치명']},
  {name_ko:'석궁', name_en:'Crossbow', category:'단순 원거리', price:'3gp', damage:'1d8 P', bulk:1, hands:2, range:120, reload:1, group:'석궁', traits:[]},
  {name_ko:'다트', name_en:'Dart', category:'단순 원거리', price:'1cp', damage:'1d4 P', bulk:'L', hands:1, range:20, reload:0, group:'다트', traits:['민첩','투척']},
  {name_ko:'핸드 석궁', name_en:'Hand Crossbow', category:'단순 원거리', price:'3gp', damage:'1d6 P', bulk:'L', hands:1, range:60, reload:1, group:'석궁', traits:[]},
  {name_ko:'중 석궁', name_en:'Heavy Crossbow', category:'단순 원거리', price:'4gp', damage:'1d10 P', bulk:2, hands:2, range:120, reload:2, group:'석궁', traits:[]},
  {name_ko:'자벨린', name_en:'Javelin', category:'단순 원거리', price:'1sp', damage:'1d6 P', bulk:'L', hands:1, range:30, reload:0, group:'다트', traits:['투척']},
  {name_ko:'투석구', name_en:'Sling', category:'단순 원거리', price:'—', damage:'1d6 B', bulk:'L', hands:1, range:50, reload:1, group:'투석구', traits:['추진']},
  // 군용 원거리
  {name_ko:'합성 장궁', name_en:'Composite Longbow', category:'군용 원거리', price:'20gp', damage:'1d8 P', bulk:2, hands:'1+', range:100, reload:0, group:'궁', traits:['치명 d10','추진','살포 30ft']},
  {name_ko:'합성 단궁', name_en:'Composite Shortbow', category:'군용 원거리', price:'14gp', damage:'1d6 P', bulk:1, hands:'1+', range:60, reload:0, group:'궁', traits:['치명 d10','추진']},
  {name_ko:'장궁', name_en:'Longbow', category:'군용 원거리', price:'6gp', damage:'1d8 P', bulk:2, hands:'1+', range:100, reload:0, group:'궁', traits:['치명 d10','살포 30ft']},
  {name_ko:'단궁', name_en:'Shortbow', category:'군용 원거리', price:'3gp', damage:'1d6 P', bulk:1, hands:'1+', range:60, reload:0, group:'궁', traits:['치명 d10']},
  {name_ko:'하플링 투석 지팡이', name_en:'Halfling Sling Staff', category:'군용 원거리(비일반)', price:'5gp', damage:'1d10 B', bulk:1, hands:2, range:80, reload:1, group:'투석구', traits:['하플링','추진']},
];

const GEAR_DB = [
  // ── 장비 (gear) ──
  {name_ko:'배낭', name_en:'Backpack', price:'1sp', bulk:'—', invCat:'gear'},
  {name_ko:'침낭', name_en:'Bedroll', price:'1cp', bulk:'L', invCat:'gear'},
  {name_ko:'등반 키트', name_en:'Climbing Kit', price:'5sp', bulk:1, invCat:'gear'},
  {name_ko:'변장 키트', name_en:'Disguise Kit', price:'2gp', bulk:'L', invCat:'gear'},
  {name_ko:'부싯돌과 강철', name_en:'Flint and Steel', price:'5cp', bulk:'—', invCat:'gear'},
  {name_ko:'치료 키트', name_en:"Healer's Tools", price:'5gp', bulk:1, invCat:'gear'},
  {name_ko:'랜턴(황소눈)', name_en:'Lantern (Bulls-eye)', price:'1gp', bulk:1, invCat:'gear'},
  {name_ko:'랜턴(덮개)', name_en:'Lantern (Hooded)', price:'7sp', bulk:1, invCat:'gear'},
  {name_ko:'악기(휴대용)', name_en:'Instrument (Handheld)', price:'8sp', bulk:1, invCat:'gear'},
  {name_ko:'종교 상징(나무)', name_en:'Religious Symbol (Wood)', price:'1sp', bulk:'L', invCat:'gear'},
  {name_ko:'종교 상징(은)', name_en:'Religious Symbol (Silver)', price:'2gp', bulk:'L', invCat:'gear'},
  {name_ko:'밧줄(50피트)', name_en:'Rope (50 ft)', price:'1sp', bulk:1, invCat:'gear'},
  {name_ko:'도둑 키트', name_en:"Thieves' Tools", price:'3gp', bulk:'L', invCat:'gear'},
  {name_ko:'물통', name_en:'Waterskin', price:'5cp', bulk:'L', invCat:'gear'},
  {name_ko:'모험가 팩', name_en:"Adventurer's Pack", price:'7sp', bulk:1, invCat:'gear'},
  {name_ko:'연금술사 도구', name_en:"Alchemist's Tools", price:'3gp', bulk:1, invCat:'gear'},
  {name_ko:'비전 주머니', name_en:'Arcane Spellcasting Pouch', price:'1gp', bulk:'L', invCat:'gear'},
  {name_ko:'근원 상징', name_en:'Primal Focus', price:'1gp', bulk:'L', invCat:'gear'},
  {name_ko:'주문서(공백)', name_en:'Spellbook (Blank)', price:'1gp', bulk:'L', invCat:'gear'},
  {name_ko:'수리 키트', name_en:'Repair Kit', price:'2gp', bulk:1, invCat:'gear'},
  // ── 소모품 (consumable) ──
  {name_ko:'식량(2주)', name_en:'Rations (2 weeks)', price:'8sp', bulk:'L', invCat:'consumable'},
  {name_ko:'횃불', name_en:'Torch', price:'1cp', bulk:'L', invCat:'consumable'},
  {name_ko:'성수(바이알)', name_en:'Holy Water', price:'3gp', bulk:'L', invCat:'consumable'},
  {name_ko:'포션(치유, 약)', name_en:'Healing Potion (Minor)', price:'4gp', bulk:'L', invCat:'consumable'},
  {name_ko:'연금술사의 불', name_en:"Alchemist's Fire", price:'3gp', bulk:'L', invCat:'consumable'},
  {name_ko:'산 플라스크(약)', name_en:'Acid Flask (Lesser)', price:'3gp', bulk:'L', invCat:'consumable'},
  // ── 탄환 (ammo) ──
  {name_ko:'화살(10)', name_en:'Arrows (10)', price:'1sp', bulk:'L', invCat:'ammo'},
  {name_ko:'석궁 볼트(10)', name_en:'Bolts (10)', price:'1sp', bulk:'L', invCat:'ammo'},
  {name_ko:'투석구 탄환(10)', name_en:'Sling Bullets (10)', price:'1cp', bulk:'L', invCat:'ammo'},
  {name_ko:'취주총 다트(10)', name_en:'Blowgun Darts (10)', price:'5cp', bulk:'L', invCat:'ammo'},
];

// ═══════════════════════════════════
//  RUNE & ATTACHMENT DATABASE
// ═══════════════════════════════════
const RUNE_DB = [
  // ── 무기 기본 룬 ──
  {name_ko:'무기 위력 룬 +1', name_en:'Weapon Potency (+1)', price:'35gp', level:2, bulk:'—', attachTo:'weapon', runeType:'potency', runeValue:1,
   traits:['마법'], desc:'이 무기의 명중 굴림에 +1 아이템 보너스를 부여하며, 속성 룬 1개를 새길 수 있게 합니다.'},
  {name_ko:'무기 위력 룬 +2', name_en:'Weapon Potency (+2)', price:'935gp', level:10, bulk:'—', attachTo:'weapon', runeType:'potency', runeValue:2,
   traits:['마법'], desc:'이 무기의 명중 굴림에 +2 아이템 보너스를 부여하며, 속성 룬 2개를 새길 수 있게 합니다.'},
  {name_ko:'무기 위력 룬 +3', name_en:'Weapon Potency (+3)', price:'8,935gp', level:16, bulk:'—', attachTo:'weapon', runeType:'potency', runeValue:3,
   traits:['마법'], desc:'이 무기의 명중 굴림에 +3 아이템 보너스를 부여하며, 속성 룬 3개를 새길 수 있게 합니다.'},
  {name_ko:'강타 룬', name_en:'Striking', price:'65gp', level:4, bulk:'—', attachTo:'weapon', runeType:'striking', runeValue:1,
   traits:['마법'], desc:'강타 룬은 무기의 피해를 강화합니다. 무기의 피해 주사위가 1개에서 2개로 증가합니다. 예를 들어 <i>+1 강타 단검</i>은 1d4 대신 2d4 피해를 입힙니다.'},
  {name_ko:'상위 강타 룬', name_en:'Greater Striking', price:'1,065gp', level:12, bulk:'—', attachTo:'weapon', runeType:'striking', runeValue:2,
   traits:['마법'], desc:'무기의 피해 주사위가 3개로 증가합니다.'},
  {name_ko:'최상위 강타 룬', name_en:'Major Striking', price:'31,065gp', level:19, bulk:'—', attachTo:'weapon', runeType:'striking', runeValue:3,
   traits:['마법'], desc:'무기의 피해 주사위가 4개로 증가합니다.'},
  // ── 무기 속성 룬 ──
  {name_ko:'고스트 터치 룬', name_en:'Ghost Touch', price:'75gp', level:4, bulk:'—', attachTo:'weapon', runeType:'property', runeValue:0,
   traits:['마법'], desc:'이 룬은 물리적 형태가 없는 생물에게 피해를 입힐 수 있게 합니다. 고스트 터치 무기에 대해 비실체 생물은 보통 약점을 가집니다. 비실체 생물은 고스트 터치 무기를 만지고, 잡고, 휘두를 수 있습니다.'},
  // ── 갑옷 기본 룬 ──
  {name_ko:'갑옷 위력 룬 +1', name_en:'Armor Potency (+1)', price:'160gp', level:5, bulk:'—', attachTo:'armor', runeType:'potency', runeValue:1,
   traits:['마법'], desc:'갑옷의 보호 마법을 강화합니다. 갑옷의 AC 아이템 보너스가 1 증가하며, 속성 룬 1개를 새길 수 있게 합니다.'},
  {name_ko:'갑옷 위력 룬 +2', name_en:'Armor Potency (+2)', price:'1,060gp', level:11, bulk:'—', attachTo:'armor', runeType:'potency', runeValue:2,
   traits:['마법'], desc:'갑옷의 AC 아이템 보너스가 2 증가하며, 속성 룬 2개를 새길 수 있게 합니다.'},
  {name_ko:'갑옷 위력 룬 +3', name_en:'Armor Potency (+3)', price:'20,560gp', level:18, bulk:'—', attachTo:'armor', runeType:'potency', runeValue:3,
   traits:['마법'], desc:'갑옷의 AC 아이템 보너스가 3 증가하며, 속성 룬 3개를 새길 수 있게 합니다.'},
  {name_ko:'탄력 룬', name_en:'Resilient', price:'340gp', level:8, bulk:'—', attachTo:'armor', runeType:'resilient', runeValue:1,
   traits:['마법'], desc:'탄력 룬은 갑옷에 추가적인 보호 마법을 부여합니다. 착용자의 내성 굴림에 +1 아이템 보너스를 부여합니다.'},
  {name_ko:'상위 탄력 룬', name_en:'Greater Resilient', price:'3,440gp', level:14, bulk:'—', attachTo:'armor', runeType:'resilient', runeValue:2,
   traits:['마법'], desc:'착용자의 내성 굴림에 +2 아이템 보너스를 부여합니다.'},
  {name_ko:'최상위 탄력 룬', name_en:'Major Resilient', price:'49,440gp', level:20, bulk:'—', attachTo:'armor', runeType:'resilient', runeValue:3,
   traits:['마법'], desc:'착용자의 내성 굴림에 +3 아이템 보너스를 부여합니다.'},
  // ── 방패 부착물 ──
  {name_ko:'방패 보스', name_en:'Shield Boss', price:'5sp', level:0, bulk:'—', attachTo:'shield', runeType:'boss', runeValue:1,
   traits:['부착'], desc:'방패 중앙에 부착하는 금속 돌출부입니다. 방패로 타격(Strike) 공격을 할 수 있으며, 1d6 B(타격) 피해를 입힙니다. 방패 보스는 일반 무기처럼 작동하며 무기 룬을 새길 수 있습니다.'},
  {name_ko:'방패 가시', name_en:'Shield Spikes', price:'5sp', level:0, bulk:'—', attachTo:'shield', runeType:'spikes', runeValue:1,
   traits:['부착'], desc:'방패 표면에 부착하는 뾰족한 금속 가시입니다. 방패로 타격(Strike) 공격을 할 수 있으며, 1d6 P(관통) 피해를 입힙니다. 방패 가시는 일반 무기처럼 작동하며 무기 룬을 새길 수 있습니다.'},
];
