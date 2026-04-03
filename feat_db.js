// Pathfinder 2e Player Core — Feat Database
// Auto-generated from PlayerCore.html
// Class feats: 바드(bard), 클레릭(cleric), 드루이드(druid),
//   파이터(fighter), 레인저(ranger), 로그(rogue), 위치(witch), 위자드(wizard)
// Chapter 5 feats: 일반(general), 일반 기술(skill)
// Class features (special): 클래스 자동 부여 특성

const FEAT_DB = [
// ═══ 클래스 특성 (자동 부여) ═══
  {name_ko:"반격 타격", name_en:"Reactive Strike", feat_level:1, prerequisites:"파이터", traits:["파이터","반응"], category:"special", summary:"도달 범위 내 생물이 조작/이동 행동, 원거리 공격 시 근접 타격으로 반격합니다. 치명타 시 조작 행동을 방해합니다.", desc:'<strong>유발 조건:</strong> 도달 범위 내 생물이 조작 행동이나 이동 행동을 사용하거나, 원거리 공격을 하거나, 이동 중 칸을 떠납니다.<br>빈틈을 보이는 적을 신속히 공격합니다. 유발 생물에 <strong>근접 타격</strong>을 합니다. 치명타이고 유발이 조작 행동이면 <strong>행동을 방해</strong>합니다. 이 타격은 다중 공격 페널티에 포함되지 않으며, 다중 공격 페널티가 이 타격에 적용되지 않습니다.' }
,
  {name_ko:"은밀 공격", name_en:"Sneak Attack", feat_level:1, prerequisites:"로그", traits:["로그","정밀"], category:"special", summary:"무방비(off-guard) 상태인 생물에 민첩/기교 무기로 타격 시 추가 1d6 정밀 피해. 5·11·17레벨에 주사위 1개씩 증가.", desc:'무방비(off-guard) 상태인 생물에 민첩/기교 근접 무기, 민첩/기교 비무장 공격, 원거리 무기/비무장 공격으로 타격 시 <strong>추가 1d6 정밀 피해</strong>. 투척 근접 무기는 민첩/기교여야 합니다. 5, 11, 17레벨에 피해 주사위가 1개씩 증가.' }
,
  {name_ko:"기습", name_en:"Surprise Attack", feat_level:1, prerequisites:"로그", traits:["로그"], category:"special", summary:"첫 라운드에 기만이나 은신으로 주도권을 굴렸으면, 아직 행동하지 않은 생물은 당신에게 무방비.", desc:'전투에 적보다 빨리 뛰어듭니다. 첫 라운드에 기만이나 은신으로 주도권을 굴렸으면, 아직 행동하지 않은 생물은 당신에게 <strong>무방비</strong>.' }
,
  {name_ko:"사냥감 추적", name_en:"Hunt Prey", feat_level:1, prerequisites:"레인저", traits:["레인저","1행동"], category:"special", summary:"생물 1명을 사냥감으로 지정. 탐색에 +2 상황 보너스, 추적에 +2, 두 번째 사거리 증분 페널티 무시.", desc:'볼 수 있거나 추적 중인 생물 1명을 사냥감으로 지정합니다. 사냥감을 탐색(Seek)하기 위한 지각 판정에 <strong>+2 상황 보너스</strong>, 추적(Track)을 위한 생존 판정에 <strong>+2 상황 보너스</strong>. 사냥감에 대한 두 번째 사거리 증분 내 원거리 공격 페널티도 무시합니다. 한 번에 사냥감 1명만 가능. 다음 일일 준비까지 지속.' }
,
  {name_ko:"자연의 목소리", name_en:"Voice of Nature", feat_level:1, prerequisites:"드루이드", traits:["드루이드"], category:"special", summary:"동물 공감 또는 식물 공감 중 하나를 선택하여 자연과 소통하는 능력을 얻습니다.", desc:'동물 공감(Animal Empathy) 또는 식물 공감(Plant Empathy) 드루이드 재주 중 하나를 선택하여 얻습니다.' }
,
  {name_ko:"바드 지식", name_en:"Bardic Lore", feat_level:1, prerequisites:"수수께끼 뮤즈", traits:["바드"], category:"bard", summary:"학습으로 모든 주제에 정통합니다. 바드 지식(Bardic Lore)에 숙련됩니다 — 지식 회상(Recall Knowledge)에만 사용할 수 있지만 어떤 주제에든 사용 가능한 특수 지식 기술입니다. 오컬티즘에 전설 숙련도가 있으면 바드 지식에 전문가 숙련도를 얻지만, 다른", desc:'<strong>전제조건:</strong> 수수께끼 뮤즈<br>학습으로 모든 주제에 정통합니다. <strong>바드 지식(Bardic Lore)</strong>에 숙련됩니다 — 지식 회상(Recall Knowledge)에만 사용할 수 있지만 <strong>어떤 주제에든</strong> 사용 가능한 특수 지식 기술입니다. 비학에 전설 숙련도가 있으면 바드 지식에 전문가 숙련도를 얻지만, 다른 방법으로는 숙련도를 올릴 수 없습니다.' }
,
  {name_ko:"치유의 찬송", name_en:"Hymn of Healing", feat_level:1, prerequisites:"", traits:["바드"], category:"bard", summary:"치유의 찬송 합주 주문을 습득합니다.", desc:'<span class="spell-tip" data-tip="[1행동] 합주 캔트립 — 사거리 30피트 | 대상: 아군 1 또는 자신 | 지속: 유지. 첫 라운드에 1d4 HP 회복. 유지할 때마다 1d4 HP 회복. 강화: 3랭크 2d4 / 5랭크 3d4 / 7랭크 4d4 / 9랭크 5d4."><em>치유의 찬송</em></span>(Hymn of Healing) 합주 주문을 배워, 풍부한 선율로 아군이 피해에서 회복하도록 돕습니다.' }
,
  {name_ko:"잔향 합주", name_en:"Lingering Composition", feat_level:1, prerequisites:"마에스트로 뮤즈", traits:["바드"], category:"bard", summary:"장식을 더하여 합주를 더 오래 지속시킵니다. 잔향 합주(lingering composition) 집중 주문을 배웁니다.", desc:'<strong>전제조건:</strong> 마에스트로 뮤즈<br>장식을 더하여 합주를 더 오래 지속시킵니다. <em>잔향 합주(lingering composition)</em> 집중 주문(371페이지)을 배웁니다.' }
,
  {name_ko:"무예 공연", name_en:"Martial Performance", feat_level:1, prerequisites:"전사 뮤즈", traits:["바드"], category:"bard", summary:"뮤즈가 대부분의 바드보다 더 다양한 무기를 다루는 법을 가르쳤으며, 공연을 전투 도구에 자연스럽게 녹일 수 있습니다. 용감한 찬가 합주 캔트립이 활성화된 상태에서 타격으로 적에게 피해를 주면, 주문의 지속 시간이 1라운드 연장됩니다. 개별 시전당 1회만 연장 가능.", desc:'<strong>전제조건:</strong> 전사 뮤즈<br>뮤즈가 대부분의 바드보다 더 다양한 무기를 다루는 법을 가르쳤으며, 공연을 전투 도구에 자연스럽게 녹일 수 있습니다. <em>용감한 찬가</em> 합주 캔트립이 활성화된 상태에서 타격으로 적에게 피해를 주면, 주문의 지속 시간이 <strong>1라운드 연장</strong>됩니다. 개별 시전당 1회만 연장 가능.<br><em>결집의 찬가</em>나 <em>힘의 노래</em> 합주 캔트립을 얻으면 이 혜택을 그 캔트립에도 적용할 수 있습니다.' }
,
  {name_ko:"주문 도달", name_en:"Reach Spell", feat_level:1, prerequisites:"", traits:["바드", "집중", "주문변형"], category:"bard", summary:"주문의 사거리를 늘릴 수 있습니다. 다음 행동이 사거리가 있는 주문 시전이면, 그 주문의 사거리를 30피트 증가시킵니다. 원래 접촉 사거리이면 30피트로 확장됩니다.", desc:'주문 사거리 <strong>30피트 증가</strong>(접촉이면 30피트로).' }
,
  {name_ko:"다재다능한 공연", name_en:"Versatile Performance", feat_level:1, prerequisites:"박학다식 뮤즈", traits:["바드"], category:"bard", summary:"웅장한 공연에 의지하여 일반적인 사회 기술 대신 사용합니다. 외교 대신 공연으로 인상 만들기, 위협 대신 공연으로 사기 저하를 할 수 있습니다. 연기 공연으로 기만 대신 변장도 가능합니다.", desc:'<strong>전제조건:</strong> 박학다식 뮤즈<br>웅장한 공연에 의지하여 일반적인 사회 기술 대신 사용합니다. 외교 대신 <strong>공연으로 인상 만들기</strong>, 위협 대신 <strong>공연으로 사기 저하</strong>를 할 수 있습니다. 연기 공연으로 기만 대신 <strong>변장</strong>도 가능합니다.<br>추가로, 기만, 외교, 위협에 특정 숙련도 등급을 요구하는 기술 재주의 전제조건을 충족하는 데 <strong>공연의 숙련도 등급</strong>을 사용할 수 있습니다.' }
,
  {name_ko:"해박한", name_en:"Well-Versed", feat_level:1, prerequisites:"", traits:["바드"], category:"bard", summary:"자신의 것이 아닌 공연적 영향에 저항합니다. 청각, 환영, 언어, 음파, 시각 특성의 효과에 대한 내성에 +1 상황 보너스.", desc:'자신의 것이 아닌 공연적 영향에 저항합니다. 청각, 환영, 언어, 음파, 시각 특성의 효과에 대한 내성에 <strong>+1 상황 보너스</strong>.' }
,
  {name_ko:"캔트립 확장", name_en:"Cantrip Expansion", feat_level:2, prerequisites:"", traits:["바드"], category:"bard", summary:"매일 캔트립 2개를 추가로 준비.", desc:'매일 <strong>캔트립 2개를 추가</strong>로 준비.' }
,
  {name_ko:"지향 청중", name_en:"Directed Audience", feat_level:2, prerequisites:"", traits:["바드"], category:"bard", summary:"합주 주문의 영역을 형성할 수 있습니다. 영역이 방사인 합주 주문을 시전할 때마다, 주문의 영역을 10피트 더 큰 원뿔로 변경할 수 있습니다(원래 영역의 최대 2배). 예: 30피트 방사 → 40피트 원뿔, 5피트 방사 → 10피트 원뿔만 가능.", desc:'합주 주문의 영역을 형성할 수 있습니다. 영역이 방사인 합주 주문을 시전할 때마다, 주문의 영역을 <strong>10피트 더 큰 원뿔</strong>로 변경할 수 있습니다(원래 영역의 최대 2배). 예: 30피트 방사 → 40피트 원뿔, 5피트 방사 → 10피트 원뿔만 가능.' }
,
  {name_ko:"감정적 밀어붙이기", name_en:"Emotional Push", feat_level:2, prerequisites:"", traits:["바드", "집중"], category:"bard", summary:"적의 갑작스러운 감정 변화를 이용합니다. 대상은 다음 턴 종료까지 당신의 다음 공격에 무방비(off-guard).", desc:'<strong>유발 조건:</strong> 인식하고 있는 적이 감정 주문에 대한 내성에 실패합니다.<br>적의 갑작스러운 감정 변화를 이용합니다. 대상은 다음 턴 종료까지 당신의 다음 공격에 <strong>무방비(off-guard)</strong>.' }
,
  {name_ko:"비밀스러운 박학", name_en:"Esoteric Polymath", feat_level:2, prerequisites:"박학다식 뮤즈", traits:["바드"], category:"bard", summary:"위자드의 주문서와 유사한 오컬티즘 주문서를 가지며, 그 주문으로 레퍼토리를 보충합니다. 레퍼토리의 모든 주문을 이 책에 무료로 추가합니다. 오컬티즘 기술로 주문 학습(Learn Spells)을 하여 적절한 비용을 지불하고 주문서에 추가할 수 있습니다.", desc:'<strong>전제조건:</strong> 박학다식 뮤즈<br>위자드의 주문서와 유사한 비학 주문서를 가지며, 그 주문으로 레퍼토리를 보충합니다. 레퍼토리의 모든 주문을 이 책에 무료로 추가합니다. 비학 기술로 <strong>주문 학습(Learn Spells)</strong>을 하여 적절한 비용을 지불하고 주문서에 추가할 수 있습니다.<br>일일 준비 시, 주문서에서 <strong>주문 1개</strong>를 선택합니다. 이미 레퍼토리에 있으면 그날 추가 시그니처 주문으로 취급합니다. 레퍼토리에 없으면 다음 준비까지 레퍼토리에 있는 것처럼 취급합니다.' }
,
  {name_ko:"지식 달인의 에튀드", name_en:"Loremaster's Etude", feat_level:2, prerequisites:"수수께끼 뮤즈", traits:["바드", "행운"], category:"bard", summary:"마법적으로 기억을 해제하여 더 쉽게 떠올리게 합니다. 지식 달인의 에튀드(loremaster's etude) 합주 주문을 배웁니다.", desc:"마법적으로 기억을 해제하여 더 쉽게 떠올리게 합니다. <em>지식 달인의 에튀드(loremaster's etude)</em> 합주 주문을 배웁니다." }
,
  {name_ko:"다양한 뮤즈", name_en:"Multifarious Muse", feat_level:2, prerequisites:"", traits:["바드"], category:"bard", summary:"뮤즈가 단일 분류에 맞지 않습니다. 자신의 것이 아닌 다른 유형의 뮤즈를 선택합니다. 그 뮤즈가 필요한 1레벨 재주를 얻고, 이제 뮤즈가 그 유형이기도 하여 해당 뮤즈를 전제조건으로 하는 재주를 가질 수 있습니다. 선택한 뮤즈의 다른 효과는 얻지 않습니다.", desc:'뮤즈가 단일 분류에 맞지 않습니다. 자신의 것이 아닌 다른 유형의 뮤즈를 선택합니다. 그 뮤즈가 필요한 <strong>1레벨 재주</strong>를 얻고, 이제 뮤즈가 그 유형이기도 하여 해당 뮤즈를 전제조건으로 하는 재주를 가질 수 있습니다. 선택한 뮤즈의 다른 효과는 얻지 않습니다.<br><strong>특수:</strong> 여러 번 선택 가능. 매번 다른 유형의 뮤즈를 선택해야 합니다.' }
,
  {name_ko:"힘의 노래", name_en:"Song of Strength", feat_level:2, prerequisites:"전사 뮤즈", traits:["바드"], category:"bard", summary:"공연이 아군에게 물리적 과제를 돕도록 힘을 불어넣습니다. 힘의 노래(song of strength) 합주 캔트립을 배웁니다.", desc:'<strong>전제조건:</strong> 전사 뮤즈<br>공연이 아군에게 물리적 과제를 돕도록 힘을 불어넣습니다. <em>힘의 노래(song of strength)</em> 합주 캔트립(371페이지)을 배웁니다.' }
,
  {name_ko:"고양 서곡", name_en:"Uplifting Overture", feat_level:2, prerequisites:"마에스트로 뮤즈", traits:["바드"], category:"bard", summary:"고양 서곡(uplifting overture) 합주 캔트립을 배워, 공연의 영감적 성질로 아군의 기술을 돕습니다.", desc:'<strong>전제조건:</strong> 마에스트로 뮤즈<br><em>고양 서곡(uplifting overture)</em> 합주 캔트립(372페이지)을 배워, 공연의 영감적 성질로 아군의 기술을 돕습니다.' }
,
  {name_ko:'지식 대가의 에튀드', name_en:'Loremaster\'s Etude', feat_level:2, prerequisites:'', traits:['바드'], category:'bard', summary:'전제조건: 수수께끼 뮤즈', desc:'<strong>전제조건:</strong> 수수께끼 뮤즈<br>마법적으로 기억을 해제하여 더 쉽게 떠올리게 합니다. <em>지식 대가의 에튀드(loremaster\'s etude)</em> 합주 주문(371페이지)을 배웁니다.'}
,
  {name_ko:"전투 판독", name_en:"Combat Reading", feat_level:4, prerequisites:"", traits:["바드", "비밀"], category:"bard", summary:"공연자의 냉독(cold reading) 기법, 아우라 읽기, 기타 속임수로 적의 강점과 약점을 발견합니다. GM이 당신 대신 비밀 오컬티즘 판정을 굴립니다. 은폐, 숨겨짐, 미탐지가 아닌 전투 중인 적 1명의 기만 또는 은신 DC(높은 쪽)에 대해 판정합니다. 대상은 1일", desc:'공연자의 냉독(cold reading) 기법, 아우라 읽기, 기타 속임수로 적의 강점과 약점을 발견합니다. GM이 당신 대신 비밀 비학 판정을 굴립니다. 은폐, 숨겨짐, 미탐지가 아닌 전투 중인 적 1명의 기만 또는 은신 DC(높은 쪽)에 대해 판정합니다. 대상은 1일간 당신의 전투 판독에 면역이 됩니다.<br><strong>대성공:</strong> GM이 적에 대한 정보 2개를 알려줍니다 (가장 높은 약점, 가장 낮은 내성 수정치, 면역 1개, 가장 높은 저항 중 선택).<br>' }
,
  {name_ko:"용감한 전진", name_en:"Courageous Advance", feat_level:4, prerequisites:"전사 뮤즈", traits:["바드", "청각", "집중", "주문변형"], category:"bard", summary:"고무적인 외침으로 아군에게 전진을 촉구합니다. 다음 행동이 용감한 찬가 합주 캔트립 시전이면, 주문에서 상태 보너스를 얻는 아군 1명이 즉시 반응으로 보폭(Stride)을 할 수 있습니다.", desc:'<strong>전제조건:</strong> 전사 뮤즈<br>고무적인 외침으로 아군에게 전진을 촉구합니다. 다음 행동이 <em>용감한 찬가</em> 합주 캔트립 시전이면, 주문에서 상태 보너스를 얻는 아군 1명이 즉시 반응으로 <strong>보폭(Stride)</strong>을 할 수 있습니다.' }
,
  {name_ko:"동조", name_en:"In Tune", feat_level:4, prerequisites:"마에스트로 뮤즈", traits:["바드", "집중", "주문변형"], category:"bard", summary:"뛰어난 공연 기술을 다른 이에게 동조시켜, 마치 누구나 할 수 있는 것처럼 약간의 기술을 부여합니다. 다음 행동이 방사 영역의 합주 주문 시전이면, 영역이 당신 대신 60피트 내 동의하는 아군에서 퍼집니다. 지향 청중이 있으면 원뿔도 아군에서 시작 가능.", desc:'<strong>전제조건:</strong> 마에스트로 뮤즈<br>뛰어난 공연 기술을 다른 이에게 동조시켜, 마치 누구나 할 수 있는 것처럼 약간의 기술을 부여합니다. 다음 행동이 방사 영역의 합주 주문 시전이면, 영역이 당신 대신 60피트 내 동의하는 <strong>아군에서 퍼집니다</strong>. 지향 청중이 있으면 원뿔도 아군에서 시작 가능.' }
,
  {name_ko:"선율적 주문", name_en:"Melodious Spell", feat_level:4, prerequisites:"", traits:["바드", "집중", "주문변형"], category:"bard", summary:"주문시전을 공연에 미묘하게 엮습니다. 다음 행동이 주문 시전이면, 주문의 구성요소를 공연에 숨깁니다. 지각 DC에 대한 지각 판정에 성공하지 않으면, 공연에 주문시전이 포함된 것을 알지 못합니다.", desc:'주문시전을 공연에 미묘하게 엮습니다. 다음 행동이 주문 시전이면, 주문의 구성요소를 공연에 숨깁니다. 감지 DC에 대한 지각 판정에 성공하지 않으면, 공연에 주문시전이 포함된 것을 알지 못합니다.' }
,
  {name_ko:"결집의 찬가", name_en:"Rallying Anthem", feat_level:4, prerequisites:"", traits:["바드"], category:"bard", summary:"결집의 찬가(rallying anthem) 합주 캔트립을 배워, 아군의 의지 내성과 정신 피해 저항을 강화합니다.", desc:'<em>결집의 찬가(rallying anthem)</em> 합주 캔트립을 배워, 아군의 의지 내성과 정신 피해 저항을 강화합니다.' }
,
  {name_ko:"의식 연구자", name_en:"Ritual Researcher", feat_level:4, prerequisites:"", traits:["바드"], category:"bard", summary:"의식에서 주도적 역할을 맡는 방법을 연구했습니다. 오컬티즘 기술로 의식을 배울 수 있습니다. 공통 오컬티즘 의식에 접근하며, GM이 다른 의식에 접근을 부여할 수 있습니다. 의식의 주요 주문시전자로서, 보조 판정의 성공도를 한 단계 향상시킬 수 있습니다(대실패→실패, 실패→성", desc:'의식에서 주도적 역할을 맡는 방법을 연구했습니다. 비학 기술로 <strong>의식을 배울 수 있습니다</strong>(230페이지). 공통 비학 의식에 접근하며, GM이 다른 의식에 접근을 부여할 수 있습니다. 의식의 주요 주문시전자로서, 보조 판정의 성공도를 한 단계 향상시킬 수 있습니다(대실패→실패, 실패→성공, 성공→대성공).' }
,
  {name_ko:"세 박자", name_en:"Triple Time", feat_level:4, prerequisites:"", traits:["바드"], category:"bard", summary:"세 박자(triple time) 합주 캔트립을 배워, 아군의 이동 속도를 높입니다.", desc:'<em>세 박자(triple time)</em> 합주 캔트립(372페이지)을 배워, 아군의 이동 속도를 높입니다.' }
,
  {name_ko:"다재다능한 시그니처", name_en:"Versatile Signature", feat_level:4, prerequisites:"", traits:["바드"], category:"bard", summary:"일일 준비 시, 각 주문 랭크에 대해 시그니처 주문을 변경할 수 있습니다. 새 시그니처 주문은 다음 준비까지 유지됩니다.", desc:'일일 준비 시, 각 주문 랭크에 대해 시그니처 주문을 변경할 수 있습니다. 새 시그니처 주문은 다음 준비까지 유지됩니다.' }
,
  {name_ko:"확실한 지식", name_en:"Assured Knowledge", feat_level:6, prerequisites:"수수께끼 뮤즈", traits:["바드", "행운"], category:"bard", summary:"자신 있게 정보를 얻습니다. 어떤 기술(바드 지식 포함)로든 지식 회상(Recall Knowledge)을 할 때, 굴리는 대신 10 + 숙련 보너스를 결과로 받을 수 있습니다(다른 보너스, 페널티, 수정치 적용 안 됨).", desc:'<strong>전제조건:</strong> 수수께끼 뮤즈<br>자신 있게 정보를 얻습니다. 어떤 기술(바드 지식 포함)로든 지식 회상(Recall Knowledge)을 할 때, 굴리는 대신 <strong>10 + 숙련 보너스</strong>를 결과로 받을 수 있습니다(다른 보너스, 페널티, 수정치 적용 안 됨).<br>기술에 전문가이면, 확신(Assurance) 재주가 없어도 해당 기술의 <strong>자동 지식(Automatic Knowledge)</strong> 기술 재주 전제조건을 충족합니다.' }
,
  {name_ko:"방어 조율", name_en:"Defensive Coordination", feat_level:6, prerequisites:"전사 뮤즈, 결집의 찬가", traits:["바드", "청각", "집중", "주문변형"], category:"bard", summary:"압도적 역경에도 맞서 버티는 전설적 영웅처럼, 당신과 아군은 방어선을 지킵니다. 다음 행동이 결집의 찬가 합주 캔트립 시전이면, 방패 올리기(Raise a Shield)를 할 수 있고, 주문에서 상태 보너스를 얻는 아군 1명이 즉시 반응으로 방패 올리기를 할 수 있습니", desc:'<strong>전제조건:</strong> 전사 뮤즈, 결집의 찬가<br>압도적 역경에도 맞서 버티는 전설적 영웅처럼, 당신과 아군은 방어선을 지킵니다. 다음 행동이 <em>결집의 찬가</em> 합주 캔트립 시전이면, <strong>방패 올리기(Raise a Shield)</strong>를 할 수 있고, 주문에서 상태 보너스를 얻는 아군 1명이 즉시 반응으로 방패 올리기를 할 수 있습니다.' }
,
  {name_ko:"파멸의 만가", name_en:"Dirge of Doom", feat_level:6, prerequisites:"", traits:["바드"], category:"bard", summary:"파멸의 만가(dirge of doom) 합주 캔트립을 배워, 적을 겁먹게 하고 공포에서 완전히 회복하지 못하게 합니다.", desc:'<em>파멸의 만가(dirge of doom)</em> 합주 캔트립(370페이지)을 배워, 적을 겁먹게 하고 공포에서 완전히 회복하지 못하게 합니다.' }
,
  {name_ko:"동료 교육", name_en:"Educate Allies", feat_level:6, prerequisites:"해박한(Well-Versed)", traits:["바드", "집중"], category:"bard", summary:"합주 주문의 속성을 조정하여 방어 지식을 전달합니다. 합주 주문의 영향을 받는 모든 아군이 다음 턴 시작까지 해박한 재주의 +1 상황 보너스를 얻습니다. 가르치는 것이 자신의 기술도 강화하여 개인 해박한 보너스가 다음 턴 시작까지 +2로 증가합니다.", desc:'<strong>전제조건:</strong> 해박한(Well-Versed)<br><br>합주 주문의 속성을 조정하여 방어 지식을 전달합니다. 합주 주문의 영향을 받는 모든 아군이 다음 턴 시작까지 해박한 재주의 <strong>+1 상황 보너스</strong>를 얻습니다. 가르치는 것이 자신의 기술도 강화하여 개인 해박한 보너스가 다음 턴 시작까지 <strong>+2로 증가</strong>합니다.' }
,
  {name_ko:"조화", name_en:"Harmonize", feat_level:6, prerequisites:"마에스트로 뮤즈", traits:["바드", "집중", "조작", "주문변형"], category:"bard", summary:"여러 합주를 동시에 연주할 수 있습니다. 다음 행동이 합주 시전이면 조화된 합주가 됩니다. 일반 합주와 달리, 다른 합주를 시전해도 종료되지 않으며, 같은 턴에 다른 합주도 시전할 수 있습니다. 다른 조화된 합주를 시전하면 기존 조화된 합주가 종료됩니다.", desc:'<strong>전제조건:</strong> 마에스트로 뮤즈<br>여러 합주를 동시에 연주할 수 있습니다. 다음 행동이 합주 시전이면 <strong>조화된 합주</strong>가 됩니다. 일반 합주와 달리, 다른 합주를 시전해도 종료되지 않으며, 같은 턴에 다른 합주도 시전할 수 있습니다. 다른 조화된 합주를 시전하면 기존 조화된 합주가 종료됩니다.' }
,
  {name_ko:"행군의 노래", name_en:"Song of Marching", feat_level:6, prerequisites:"", traits:["바드"], category:"bard", summary:"행군의 노래(song of marching) 합주 캔트립을 배워, 아군과 함께 먼 거리를 무리 없이 횡단합니다.", desc:'<em>행군의 노래(song of marching)</em> 합주 캔트립(371페이지)을 배워, 아군과 함께 먼 거리를 무리 없이 횡단합니다.' }
,
  {name_ko:"안정된 주문시전", name_en:"Steady Spellcasting", feat_level:6, prerequisites:"", traits:["바드"], category:"bard", summary:"주문을 쉽게 잃지 않습니다. 반응이 주문시전 행동을 방해하려 하면, DC 15 단순 판정을 시도합니다. 성공하면 행동이 방해되지 않습니다.", desc:'반응이 주문시전을 방해하려 하면 <strong>DC 15 단순 판정</strong>. 성공 시 방해 안 됨.' }
,
  {name_ko:"반주", name_en:"Accompany", feat_level:8, prerequisites:"", traits:["바드", "집중", "조작"], category:"bard", summary:"공연으로 아군의 주문시전을 보충하여 마법 에너지를 대신 제공합니다. 아군의 레벨에 대한 매우 높은 DC에 대해 공연 판정을 시도하고, 집중 포인트(집중 주문인 경우)를 소비하거나 유발 주문보다 최소 1랭크 높은 주문 슬롯을 소비합니다. 성공하면 아군이 일반적으로 소비해", desc:'<strong>유발 조건:</strong> 30피트 내 아군이 주문을 시전합니다.<br>공연으로 아군의 주문시전을 보충하여 마법 에너지를 대신 제공합니다. 아군의 레벨에 대한 매우 높은 DC에 대해 <strong>공연 판정</strong>을 시도하고, 집중 포인트(집중 주문인 경우)를 소비하거나 유발 주문보다 최소 1랭크 높은 주문 슬롯을 소비합니다. 성공하면 아군이 일반적으로 소비해야 할 집중 포인트나 주문 슬롯을 <strong>소비하지 않습니다</strong>.' }
,
  {name_ko:"호응", name_en:"Call and Response", feat_level:8, prerequisites:"", traits:["바드", "청각", "집중", "주문변형"], category:"bard", summary:"합주가 호응 구호 형태를 취해 아군이 당신 없이도 효과를 이어갈 수 있습니다. 다음 행동이 지속 시간 1라운드의 합주 캔트립 시전이면 호출이 됩니다. 주문이 활성화된 동안, 주문의 영향을 받는 아군 1명이 청각과 집중 특성의 단일 행동으로 응답하여 지속 시간을 1라운드", desc:'합주가 호응 구호 형태를 취해 아군이 당신 없이도 효과를 이어갈 수 있습니다. 다음 행동이 지속 시간 1라운드의 합주 캔트립 시전이면 호출이 됩니다. 주문이 활성화된 동안, 주문의 영향을 받는 아군 1명이 청각과 집중 특성의 <strong>단일 행동으로 응답</strong>하여 지속 시간을 1라운드 연장할 수 있습니다. 1명만 응답 가능.' }
,
  {name_ko:"다재다능한 기술", name_en:"Eclectic Skill", feat_level:8, prerequisites:"박학다식 뮤즈, 오컬티즘 달인", traits:["바드"], category:"bard", summary:"폭넓은 경험이 다양한 기술로 변환됩니다. 미숙련 기술 판정의 숙련 보너스가 레벨과 같아집니다. 보통 숙련이 필요한 기술 행동을 미숙련으로도 시도 가능. 오컬티즘 전설이면 전문가가 필요한 기술 행동도 미숙련이나 숙련으로 시도 가능.", desc:'<strong>전제조건:</strong> 박학다식 뮤즈, 비학 대가<br>폭넓은 경험이 다양한 기술로 변환됩니다. 미숙련 기술 판정의 숙련 보너스가 <strong>레벨과 같아집니다</strong>. 보통 숙련이 필요한 기술 행동을 미숙련으로도 시도 가능. 비학 전설이면 전문가가 필요한 기술 행동도 미숙련이나 숙련으로 시도 가능.' }
,
  {name_ko:"포르티시모 합주", name_en:"Fortissimo Composition", feat_level:8, prerequisites:"마에스트로 뮤즈", traits:["바드"], category:"bard", summary:"찬가가 더 크고 강력해집니다. 포르티시모 합주(fortissimo composition) 주문변형 집중 주문을 배웁니다.", desc:'<strong>전제조건:</strong> 마에스트로 뮤즈<br>찬가가 더 크고 강력해집니다. <em>포르티시모 합주(fortissimo composition)</em> 주문변형 집중 주문(370페이지)을 배웁니다.' }
,
  {name_ko:"만물박사", name_en:"Know-It-All", feat_level:8, prerequisites:"수수께끼 뮤즈", traits:["바드"], category:"bard", summary:"지식 회상에 성공하면 추가 정보나 맥락을 얻습니다. 대성공하면 추가 정보/맥락을 얻거나 추가 후속 질문을 할 수 있습니다(GM 선택).", desc:'<strong>전제조건:</strong> 수수께끼 뮤즈<br>지식 회상에 성공하면 <strong>추가 정보나 맥락</strong>을 얻습니다. 대성공하면 추가 정보/맥락을 얻거나 <strong>추가 후속 질문</strong>을 할 수 있습니다(GM 선택).' }
,
  {name_ko:"반사적 용기", name_en:"Reflexive Courage", feat_level:8, prerequisites:"전사 뮤즈", traits:["바드", "청각"], category:"bard", summary:"사나운 전투 함성으로 스스로를 고무하여 적을 공격합니다. 유발 생물에 근접 타격. 치명타이고 유발이 조작 행동이면 행동이 방해됩니다.", desc:'<strong>전제조건:</strong> 전사 뮤즈<br><br>사나운 전투 함성으로 스스로를 고무하여 적을 공격합니다. 유발 생물에 <strong>근접 타격</strong>. 치명타이고 유발이 조작 행동이면 행동이 <strong>방해됩니다</strong>.' }
,
  {name_ko:"영혼 감각", name_en:"Soulsight", feat_level:8, prerequisites:"", traits:["바드"], category:"bard", summary:"뮤즈가 저 너머 세계에 감각을 열었습니다. 60피트 범위의 부정확 영혼감각(spiritsense)을 얻습니다. 영혼감각으로 살아있는 생물, 대부분의 비무심 언데드, 떠도는 혼령(haunts) 등 생물의 영혼을 감지합니다. 정신 없는 몸, 구조물, 물체는 감지하지 못하며", desc:'뮤즈가 저 너머 세계에 감각을 열었습니다. <strong>60피트 범위의 부정확 영혼감각(spiritsense)</strong>을 얻습니다. 영혼감각으로 살아있는 생물, 대부분의 비무심 언데드, 떠도는 혼령(haunts) 등 생물의 영혼을 감지합니다. 정신 없는 몸, 구조물, 물체는 감지하지 못하며, 대부분의 감각처럼 고체를 관통하지 못합니다.' }
,
  {name_ko:"합주 주석", name_en:"Annotate Composition", feat_level:10, prerequisites:"", traits:["바드", "탐험", "언어"], category:"bard", summary:"합주를 종이에 적어 다른 이가 읽고 이해할 수 있는 고무적인 말이나 노래의 원천을 만듭니다. 10분과 집중 포인트 1점을 소비하여 특수 두루마리에 합주 주문을 전사합니다(1행동으로 시전하는 합주만 가능). 나중에 사용한 언어를 읽을 수 있는 생물이 집중 특성의 단일 행", desc:'합주를 종이에 적어 다른 이가 읽고 이해할 수 있는 고무적인 말이나 노래의 원천을 만듭니다. <strong>10분과 집중 포인트 1점</strong>을 소비하여 특수 두루마리에 합주 주문을 전사합니다(1행동으로 시전하는 합주만 가능). 나중에 사용한 언어를 읽을 수 있는 생물이 집중 특성의 단일 행동으로 활성화하여 합주의 효과를 발생시킵니다. 다음 일일 준비 시 힘을 잃습니다.' }
,
  {name_ko:"용감한 맹공", name_en:"Courageous Assault", feat_level:10, prerequisites:"전사 뮤즈", traits:["바드", "청각", "집중", "주문변형"], category:"bard", summary:"강력한 외침으로 아군을 공격으로 이끕니다. 다음 행동이 용감한 찬가 시전이면, 상태 보너스를 얻는 아군 1명이 즉시 반응으로 근접 타격을 할 수 있습니다.", desc:'<strong>전제조건:</strong> 전사 뮤즈<br>강력한 외침으로 아군을 공격으로 이끕니다. 다음 행동이 <em>용감한 찬가</em> 시전이면, 상태 보너스를 얻는 아군 1명이 즉시 반응으로 <strong>근접 타격</strong>을 할 수 있습니다.' }
,
  {name_ko:"상상의 벽 집", name_en:"House of Imaginary Walls", feat_level:10, prerequisites:"", traits:["바드"], category:"bard", summary:"상상의 벽 집(house of imaginary walls) 합주 캔트립을 배워, 다른 이가 진짜라고 믿는 상상의 장벽을 세웁니다.", desc:'<em>상상의 벽 집(house of imaginary walls)</em> 합주 캔트립(370페이지)을 배워, 다른 이가 진짜라고 믿는 상상의 장벽을 세웁니다.' }
,
  {name_ko:"우로보로스의 송가", name_en:"Ode to Ouroboros", feat_level:10, prerequisites:"", traits:["바드"], category:"bard", summary:"우로보로스의 송가(ode to ouroboros) 합주 주문을 배워, 아군을 일시적으로 죽음에서 구합니다.", desc:'<em>우로보로스의 송가(ode to ouroboros)</em> 합주 주문(371페이지)을 배워, 아군을 일시적으로 죽음에서 구합니다.' }
,
  {name_ko:"빠른 시전", name_en:"Quickened Casting", feat_level:10, prerequisites:"", traits:["바드", "집중", "주문변형"], category:"bard", summary:"빈도: 하루 1회. 다음 행동이 캔트립이거나 가장 높은 슬롯보다 2랭크 이상 낮은 주문이면, 시전 행동 수 1 감소(최소 1).", desc:'<strong>빈도:</strong> 하루 1회. 다음 행동이 캔트립이거나 가장 높은 슬롯보다 2랭크 이상 낮은 주문이면, 시전 <strong>행동 수 1 감소</strong>(최소 1).' }
,
  {name_ko:"속박 해방의 교향곡", name_en:"Symphony of the Unfettered Heart", feat_level:10, prerequisites:"", traits:["바드"], category:"bard", summary:"속박 해방의 교향곡(symphony of the unfettered heart) 합주 주문을 배워, 무력화 상태로부터 아군을 보호합니다.", desc:'<em>속박 해방의 교향곡(symphony of the unfettered heart)</em> 합주 주문(371페이지)을 배워, 무력화 상태로부터 아군을 보호합니다.' }
,
  {name_ko:"비범한 합주", name_en:"Unusual Composition", feat_level:10, prerequisites:"박학다식 뮤즈", traits:["바드", "집중", "조작", "주문변형"], category:"bard", summary:"합주의 감정과 힘을 다른 매체로 변환합니다. 다음 행동이 청각이나 시각인 합주 주문 시전이면, 진동감각 같은 특수 감각을 포함한 어떤 감각으로든 목격할 수 있는 생물에게 영향을 줄 수 있습니다. 원하는 감각을 제외할 수 있습니다.", desc:'<strong>전제조건:</strong> 박학다식 뮤즈<br>합주의 감정과 힘을 다른 매체로 변환합니다. 다음 행동이 청각이나 시각인 합주 주문 시전이면, 진동감각 같은 특수 감각을 포함한 <strong>어떤 감각으로든 목격할 수 있는 생물에게 영향</strong>을 줄 수 있습니다. 원하는 감각을 제외할 수 있습니다.' }
,
  {name_ko:"다재다능한 박학", name_en:"Eclectic Polymath", feat_level:12, prerequisites:"비밀스러운 박학", traits:["바드"], category:"bard", summary:"유연한 정신이 한 주문에서 다른 주문으로 빠르게 전환합니다. 일일 준비 시 비밀스러운 박학으로 레퍼토리에 주문을 추가했을 때, 다시 준비할 때 비밀스러운 박학의 새 주문을 레퍼토리에 유지하고 대신 같은 랭크의 다른 레퍼토리 주문에 대한 접근을 잃을 수 있습니다.", desc:'<strong>전제조건:</strong> 비밀스러운 박학<br>유연한 정신이 한 주문에서 다른 주문으로 빠르게 전환합니다. 일일 준비 시 비밀스러운 박학으로 레퍼토리에 주문을 추가했을 때, 다시 준비할 때 비밀스러운 박학의 새 주문을 레퍼토리에 <strong>유지하고</strong> 대신 같은 랭크의 다른 레퍼토리 주문에 대한 접근을 잃을 수 있습니다.' }
,
  {name_ko:"수수께끼의 지식", name_en:"Enigma's Knowledge", feat_level:12, prerequisites:"확실한 지식", traits:["바드"], category:"bard", summary:"뮤즈가 적시에 지식을 속삭입니다. 지식 회상에 사용할 수 있는 모든 기술에 자동 지식 기술 재주의 혜택을 얻습니다. 자동 지식의 특수 조항대로 라운드당 1회만 사용.", desc:'뮤즈는 미스터리로, 삶과 다차원계의 숨겨진 비밀을 밝히도록 합니다. 완전히 파악할 수 없는 사람, 상징이 깊이 겹쳐진 텍스트, 또는 평생 작품의 바탕이 되는 감정적 역설일 수 있습니다. 이세계 생물이라면 신비로운 영겁(aeon)이나 비학 용일 수 있고, 신격이라면 이로리나 네시스일 수 있습니다.<br>수수께끼 뮤즈의 바드로서, 영감과 비학 지원 곁에 지식을 제공하여 동료를 지원합니다.<br><strong>뮤즈 재주:</strong> 바드 지식(Bardic Lore) | <strong>뮤즈 주문:</strong> <em>확실한 타격(sure strike)</em>' }
,
  {name_ko:"영감적 집중", name_en:"Inspirational Focus", feat_level:12, prerequisites:"", traits:["바드"], category:"bard", summary:"뮤즈와의 연결이 비범한 집중을 부여합니다. 재집중(Refocus)할 때마다 집중 풀을 완전히 채웁니다.", desc:'뮤즈와의 연결이 비범한 집중을 부여합니다. 재집중(Refocus)할 때마다 집중 풀을 <strong>완전히 채웁니다</strong>.' }
,
  {name_ko:"반향", name_en:"Reverberate", feat_level:12, prerequisites:"", traits:["바드"], category:"bard", summary:"주변 음향을 조작하여 음파 피해를 원천으로 돌려보냅니다. 생물의 의지 DC(또는 위험의 인내 DC, 주문이면 주문 DC 중 낮은 것)에 대해 공연 판정을 시도합니다.", desc:'<strong>유발 조건:</strong> 생물이나 위험이 당신에게 음파 피해를 주려 합니다.<br>주변 음향을 조작하여 음파 피해를 원천으로 돌려보냅니다. 생물의 의지 DC(또는 위험의 인내 DC, 주문이면 주문 DC 중 낮은 것)에 대해 공연 판정을 시도합니다.<br><strong>대성공:</strong> 유발 피해를 레벨 × 4까지 줄입니다. 생물이 줄인 양만큼 음파 피해를 받습니다.<br>' }
,
  {name_ko:"공유된 맹공", name_en:"Shared Assault", feat_level:12, prerequisites:"용감한 맹공", traits:["바드"], category:"bard", summary:"전투의 승리 속에서 다른 아군과 영광을 나눕니다. 용감한 맹공으로 선택한 아군이 부여받은 타격에서 대성공하면, 용감한 찬가의 영향을 받는 다른 아군 1명이 즉시 반응으로 근접 타격을 할 수 있습니다. 세 번째 아군에게는 이어지지 않습니다.", desc:'<strong>전제조건:</strong> 용감한 맹공<br>전투의 승리 속에서 다른 아군과 영광을 나눕니다. 용감한 맹공으로 선택한 아군이 부여받은 타격에서 <strong>대성공하면</strong>, 용감한 찬가의 영향을 받는 다른 아군 1명이 즉시 반응으로 근접 타격을 할 수 있습니다. 세 번째 아군에게는 이어지지 않습니다.' }
,
  {name_ko:'수수께끼의 지식', name_en:'Enigma\'s Knowledge', feat_level:12, prerequisites:'', traits:['바드'], category:'bard', summary:'전제조건: 확실한 지식', desc:'<strong>전제조건:</strong> 확실한 지식<br>뮤즈가 적시에 지식을 속삭입니다. 지식 회상에 사용할 수 있는 <strong>모든 기술에 자동 지식</strong> 기술 재주의 혜택을 얻습니다. 자동 지식의 특수 조항대로 라운드당 1회만 사용.'}
,
  {name_ko:"알레그로", name_en:"Allegro", feat_level:14, prerequisites:"", traits:["바드"], category:"bard", summary:"빠른 공연으로 아군을 가속합니다. 알레그로(allegro) 합주 캔트립을 배웁니다.", desc:'빠른 공연으로 아군을 가속합니다. <em>알레그로(allegro)</em> 합주 캔트립(370페이지)을 배웁니다.' }
,
  {name_ko:"귓가 멜로디", name_en:"Earworm", feat_level:14, prerequisites:"", traits:["바드", "탐험"], category:"bard", summary:"끝없이 반복하는 모티프로 아군의 머릿속에 기억에 남는 노래를 심어, 나중에 반응하도록 준비시킵니다. 합주 캔트립을 선택하고 10분간 멜로디를 반복합니다. 전체 활동 동안 볼 수 있거나 들을 수 있는 모든 아군에게 귓가 멜로디를 심습니다.", desc:'끝없이 반복하는 모티프로 아군의 머릿속에 기억에 남는 노래를 심어, 나중에 반응하도록 준비시킵니다. 합주 캔트립을 선택하고 10분간 멜로디를 반복합니다. 전체 활동 동안 볼 수 있거나 들을 수 있는 모든 아군에게 귓가 멜로디를 심습니다.<br>그 후 자유 행동으로 공연 판정을 시도하여 활성화합니다. 성공하면 귓가 멜로디를 배우고 공연을 감지할 수 있는 모든 아군에게 캔트립을 시전합니다. 활성화, 다른 귓가 멜로디 심기, 또는 다음 일일 준비 중 먼저 오는 것에 잊혀집니다.' }
,
  {name_ko:"위로의 발라드", name_en:"Soothing Ballad", feat_level:14, prerequisites:"", traits:["바드"], category:"bard", summary:"공연의 힘으로 아군의 상처를 치유합니다. 위로의 발라드(soothing ballad) 합주 주문을 배웁니다.", desc:'공연의 힘으로 아군의 상처를 치유합니다. <em>위로의 발라드(soothing ballad)</em> 합주 주문(371페이지)을 배웁니다.' }
,
  {name_ko:"승리의 영감", name_en:"Triumphant Inspiration", feat_level:14, prerequisites:"전사 뮤즈", traits:["바드"], category:"bard", summary:"승리의 외침으로 동료에게 영감을 줍니다. 보통 1행동으로 시전하는 아는 합주 캔트립을 시전합니다.", desc:'<strong>전제조건:</strong> 전사 뮤즈<br><br>승리의 외침으로 동료에게 영감을 줍니다. 보통 1행동으로 시전하는 아는 <strong>합주 캔트립</strong>을 시전합니다.' }
,
  {name_ko:"초인지", name_en:"True Hypercognition", feat_level:14, prerequisites:"수수께끼 뮤즈", traits:["바드"], category:"bard", summary:"정신이 놀라운 속도로 작동합니다. 즉시 최대 5회의 지식 회상 행동을 사용합니다. 일반적으로 지식 회상에 의해 유발되는 특수 능력이나 자유 행동은 사용할 수 없습니다.", desc:'<strong>전제조건:</strong> 수수께끼 뮤즈<br>정신이 놀라운 속도로 작동합니다. 즉시 최대 <strong>5회의 지식 회상 행동</strong>을 사용합니다. 일반적으로 지식 회상에 의해 유발되는 특수 능력이나 자유 행동은 사용할 수 없습니다.' }
,
  {name_ko:"활기찬 찬가", name_en:"Vigorous Anthem", feat_level:14, prerequisites:"", traits:["바드", "청각", "집중", "주문변형"], category:"bard", summary:"공격에 영감을 줄 때 마법적 활력을 불어넣습니다. 다음 행동이 용감한 찬가 시전이면, 당신과 영향받는 모든 아군이 3 + 매력 수정치만큼의 임시 HP를 1분간 얻습니다.", desc:'공격에 영감을 줄 때 마법적 활력을 불어넣습니다. 다음 행동이 <em>용감한 찬가</em> 시전이면, 당신과 영향받는 모든 아군이 <strong>3 + 매력 수정치만큼의 임시 HP</strong>를 1분간 얻습니다.' }
,
  {name_ko:"용감한 총공격", name_en:"Courageous Onslaught", feat_level:16, prerequisites:"용감한 전진, 용감한 맹공", traits:["바드", "청각", "집중", "주문변형"], category:"bard", summary:"공연으로 적에 대한 총공격을 지휘합니다. 다음 행동이 용감한 찬가 시전이면, 상태 보너스를 얻는 아군 1명이 즉시 반응으로 보폭 후 근접 타격을 할 수 있습니다.", desc:'<strong>전제조건:</strong> 용감한 전진, 용감한 맹공<br>공연으로 적에 대한 총공격을 지휘합니다. 다음 행동이 <em>용감한 찬가</em> 시전이면, 상태 보너스를 얻는 아군 1명이 즉시 반응으로 <strong>보폭 후 근접 타격</strong>을 할 수 있습니다.' }
,
  {name_ko:"무의식적 집중", name_en:"Effortless Concentration", feat_level:16, prerequisites:"", traits:["바드"], category:"bard", summary:"유발 조건: 턴 시작.", desc:'<strong>유발 조건:</strong> 턴 시작. 활성 위자드 주문 1개의 지속 시간을 즉시 연장.' }
,
  {name_ko:"울려 퍼지는 피날레", name_en:"Resounding Finale", feat_level:16, prerequisites:"마에스트로 뮤즈", traits:["바드", "집중"], category:"bard", summary:"공연을 갑작스럽고 극적인 마무리로 끝내 다른 소리를 압도합니다. 합주 주문이 즉시 종료되고, 혜택을 받던 모든 아군이 유발 피해에 대해 합주 주문 랭크 × 2만큼의 음파 저항을 얻습니다.", desc:'<strong>전제조건:</strong> 마에스트로 뮤즈<br><br>공연을 갑작스럽고 극적인 마무리로 끝내 다른 소리를 압도합니다. 합주 주문이 즉시 종료되고, 혜택을 받던 모든 아군이 유발 피해에 대해 합주 주문 랭크 × 2만큼의 <strong>음파 저항</strong>을 얻습니다.' }
,
  {name_ko:"학구적 용량", name_en:"Studious Capacity", feat_level:16, prerequisites:"수수께끼 뮤즈, 오컬티즘 전설", traits:["바드"], category:"bard", summary:"오컬티즘 마법의 지속적 연구가 마법 용량을 늘렸습니다. 적절한 주문 랭크의 주문 슬롯이 바닥나도 하루에 주문 1개를 추가로 시전할 수 있습니다. 단, 가장 높은 주문 랭크의 주문에는 사용할 수 없습니다.", desc:'<strong>전제조건:</strong> 수수께끼 뮤즈, 비학 전설<br>비학 마법의 지속적 연구가 마법 용량을 늘렸습니다. 적절한 주문 랭크의 주문 슬롯이 바닥나도 <strong>하루에 주문 1개를 추가로</strong> 시전할 수 있습니다. 단, 가장 높은 주문 랭크의 주문에는 사용할 수 없습니다.' }
,
  {name_ko:"모두 상상 속", name_en:"All in my Head", feat_level:18, prerequisites:"", traits:["바드", "환영", "정신"], category:"bard", summary:"오컬티즘 연결과 놀라운 설득력으로 유발 피해가 상상의 산물이라고 자신을 납득시킵니다. 피해가 원래 유형에서 정신 피해로 변경되고, 피해 효과가 비치명(nonlethal) 특성을 얻습니다. 정신 효과나 정신 피해에 면역이면 사용 불가.", desc:'<strong>유발 조건:</strong> 죽음 특성이 없거나 즉사를 유발하지 않는 타격이나 주문으로 피해를 받으려 합니다.<br>비학 연결과 놀라운 설득력으로 유발 피해가 상상의 산물이라고 자신을 납득시킵니다. 피해가 원래 유형에서 <strong>정신 피해로 변경</strong>되고, 피해 효과가 <strong>비치명(nonlethal) 특성</strong>을 얻습니다. 정신 효과나 정신 피해에 면역이면 사용 불가.' }
,
  {name_ko:"깊은 전승", name_en:"Deep Lore", feat_level:18, prerequisites:"수수께끼 뮤즈, 오컬티즘 전설", traits:["바드"], category:"bard", summary:"레퍼토리가 방대하여 일반보다 훨씬 많은 주문을 포함합니다. 시전 가능한 각 주문 랭크에 주문 1개씩 추가합니다.", desc:'<strong>전제조건:</strong> 수수께끼 뮤즈, 비학 전설<br>레퍼토리가 방대하여 일반보다 훨씬 많은 주문을 포함합니다. 시전 가능한 각 주문 랭크에 <strong>주문 1개씩 추가</strong>합니다.' }
,
  {name_ko:"불협화음", name_en:"Discordant Voice", feat_level:18, prerequisites:"용감한 찬가", traits:["바드", "음파"], category:"bard", summary:"용감한 찬가가 아군의 공격에 강력한 음파 반향을 부여합니다. 아군이 용감한 찬가의 영향을 받는 동안, 무기 타격과 비무장 공격이 추가 1d6 음파 피해.", desc:'<strong>전제조건:</strong> 용감한 찬가<br>용감한 찬가가 아군의 공격에 강력한 음파 반향을 부여합니다. 아군이 용감한 찬가의 영향을 받는 동안, 무기 타격과 비무장 공격이 <strong>추가 1d6 음파 피해</strong>.' }
,
  {name_ko:"영원한 합주", name_en:"Eternal Composition", feat_level:18, prerequisites:"마에스트로 뮤즈", traits:["바드"], category:"bard", summary:"세계가 무대이며 당신은 항상 연주 중입니다. 영구적으로 빠른(quickened) 상태; 추가 행동은 1행동으로 시전하는 합주 캔트립에만 사용 가능. 탐험 모드에서 어떤 탐험 전술을 사용하든 적격한 합주 캔트립을 선언할 수 있습니다. 전투 조우에서 첫 번째 턴 이전에도 ", desc:'<strong>전제조건:</strong> 마에스트로 뮤즈<br>세계가 무대이며 당신은 항상 연주 중입니다. <strong>영구적으로 빠른(quickened)</strong> 상태; 추가 행동은 1행동으로 시전하는 합주 캔트립에만 사용 가능. 탐험 모드에서 어떤 탐험 전술을 사용하든 적격한 합주 캔트립을 선언할 수 있습니다. 전투 조우에서 첫 번째 턴 이전에도 이전 턴에 시전한 것처럼 활성화됩니다.' }
,
  {name_ko:"불가능한 박학", name_en:"Impossible Polymath", feat_level:18, prerequisites:"신비학, 자연학, 또는 종교학에 숙련; 비밀스러운 박학", traits:["바드"], category:"bard", summary:"비밀스러운 공식이 다른 바드가 이해하지 못하는 다양한 전통의 마법에 손을 대게 합니다. 신비학에 숙련이면 비전 주문을, 자연학에 숙련이면 원시 주문을, 종교학에 숙련이면 신성 주문을 비밀스러운 박학의 주문서에 추가할 수 있습니다. 비밀스러운 박학처럼 매일 하나를 오컬티즘 주", desc:'<strong>전제조건:</strong> 신비학, 자연학, 또는 종교에 숙련; 비밀스러운 박학<br>비밀스러운 공식이 다른 바드가 이해하지 못하는 다양한 전통의 마법에 손을 대게 합니다. 신비학에 숙련이면 <strong>비전 주문</strong>을, 자연학에 숙련이면 <strong>원시 주문</strong>을, 종교에 숙련이면 <strong>신성 주문</strong>을 비밀스러운 박학의 주문서에 추가할 수 있습니다. 비밀스러운 박학처럼 매일 하나를 비학 주문으로 레퍼토리에 추가할 수 있지만, 다재다능한 박학이 있어도 다른 전통의 주문은 준비 시 <strong>유지할 수 없습니다</strong>.' }
,
  {name_ko:"치명적 아리아", name_en:"Fatal Aria", feat_level:20, prerequisites:"", traits:["바드"], category:"bard", summary:"노래가 견딜 수 없는 감정으로 대상을 압도하여 즉사시킬 수 있습니다. 치명적 아리아(fatal aria) 합주 주문을 배웁니다.", desc:'노래가 견딜 수 없는 감정으로 대상을 압도하여 즉사시킬 수 있습니다. <em>치명적 아리아(fatal aria)</em> 합주 주문(370페이지)을 배웁니다.' }
,
  {name_ko:"완벽한 앙코르", name_en:"Perfect Encore", feat_level:20, prerequisites:"마기스터리 주문", traits:["바드"], category:"bard", summary:"또 하나의 놀라운 창작을 개발합니다. 추가 10랭크 주문 슬롯을 얻습니다.", desc:'<strong>전제조건:</strong> 마기스터리 주문<br>또 하나의 놀라운 창작을 개발합니다. <strong>추가 10랭크 주문 슬롯</strong>을 얻습니다.' }
,
  {name_ko:"피리 부는 사나이", name_en:"Pied Piping", feat_level:20, prerequisites:"", traits:["바드"], category:"bard", summary:"피리 부는 사나이(pied piping) 합주 주문을 배워, 의지가 약한 개인의 행동을 지배합니다.", desc:'<em>피리 부는 사나이(pied piping)</em> 합주 주문(371페이지)을 배워, 의지가 약한 개인의 행동을 지배합니다.' }
,
  {name_ko:"뮤즈의 교향곡", name_en:"Symphony of the Muse", feat_level:20, prerequisites:"조화", traits:["바드"], category:"bard", summary:"무수한 공연을 다양한 효과의 독주 교향곡으로 엮는 법을 배웠습니다. 턴당 합주 1개나 한 번에 1개의 제한이 없어집니다; 새 합주를 사용해도 이전 합주의 효과가 남은 지속 시간 동안 계속됩니다.", desc:'<strong>전제조건:</strong> 조화<br>무수한 공연을 다양한 효과의 독주 교향곡으로 엮는 법을 배웠습니다. <strong>턴당 합주 1개나 한 번에 1개의 제한이 없어집니다</strong>; 새 합주를 사용해도 이전 합주의 효과가 남은 지속 시간 동안 계속됩니다.' }
,
  {name_ko:"궁극의 박학", name_en:"Ultimate Polymath", feat_level:20, prerequisites:"박학다식 뮤즈", traits:["바드"], category:"bard", summary:"모든 주문을 유연하게 시전하여 현기증 나는 가능성의 배열을 부여합니다. 레퍼토리의 모든 주문이 시그니처 주문이 됩니다.", desc:'<strong>전제조건:</strong> 박학다식 뮤즈<br>모든 주문을 유연하게 시전하여 현기증 나는 가능성의 배열을 부여합니다. 레퍼토리의 <strong>모든 주문이 시그니처 주문</strong>이 됩니다.' }
,
  {name_ko:"치명적 단순함", name_en:"Deadly Simplicity", feat_level:1, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"단순 무기에 대한 신격의 교리가 당신의 공격을 치명적으로 만듭니다. 신격의 선호 무기가 비무장 공격이거나 피해 주사위가 d6 이하인 단순 무기이면, 그 공격이나 무기의 피해 주사위가 한 단계 증가합니다(d4→d6, d6→d8 등).", desc:'단순 무기에 대한 신격의 교리가 당신의 공격을 치명적으로 만듭니다. 신격의 선호 무기가 비무장 공격이거나 피해 주사위가 d6 이하인 단순 무기이면, 그 공격이나 무기의 <strong>피해 주사위가 한 단계 증가</strong>합니다(d4→d6, d6→d8 등).' }
,
  {name_ko:"신성 응징", name_en:"Divine Castigation", feat_level:1, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"신앙의 힘으로 적을 응징합니다. 당신에게 신성(holy) 또는 불경(unholy) 특성이 있을 때, 해로움이나 치유로 반대 특성의 생물에게 피해를 줄 때 추가 영혼 피해를 입힙니다. 추가 피해는 주문 랭크과 같습니다.", desc:'신앙의 힘으로 적을 응징합니다. 당신에게 신성(holy) 또는 불경(unholy) 특성이 있을 때, <em>해로움</em>이나 <em>치유</em>로 반대 특성의 생물에게 피해를 줄 때 추가 <strong>영혼 피해</strong>를 입힙니다. 추가 피해는 주문 랭크과 같습니다.' }
,
  {name_ko:"영역 입문", name_en:"Domain Initiate", feat_level:1, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"신격의 영역 중 하나의 초기 영역 주문을 집중 주문으로 얻습니다. 집중 풀에 집중 포인트 1점. 특수: 여러 번 선택 가능, 매번 다른 영역.", desc:'신격의 영역 중 하나의 초기 영역 주문을 집중 주문으로 얻습니다. 집중 풀에 집중 포인트 1점. <strong>특수:</strong> 여러 번 선택 가능, 매번 다른 영역.' }
,
  {name_ko:"해로운 손", name_en:"Harming Hands", feat_level:1, prerequisites:"해로운 원천. 공허 에너지의 사악한 힘이 성장합니다. 해로움 시전 시 d8 대신 d10을 굴립니다.", traits:["클레릭"], category:"cleric", summary:"공허 에너지의 사악한 힘이 성장합니다.", desc:'<strong>전제조건:</strong> 해로운 원천. 공허 에너지의 사악한 힘이 성장합니다. <em>해로움</em> 시전 시 d8 대신 <strong>d10</strong>을 굴립니다.' }
,
  {name_ko:"치유의 손", name_en:"Healing Hands", feat_level:1, prerequisites:"치유 원천. 활력이 더 선명하고 회복적입니다. 치유 시전 시 d8 대신 d10을 굴립니다.", traits:["클레릭"], category:"cleric", summary:"활력이 더 선명하고 회복적입니다.", desc:'<strong>전제조건:</strong> 치유 원천. 활력이 더 선명하고 회복적입니다. <em>치유</em> 시전 시 d8 대신 <strong>d10</strong>을 굴립니다.' }
,
  {name_ko:"회피 예감", name_en:"Premonition of Avoidance", feat_level:1, prerequisites:"", traits:["클레릭", "신성", "예측"], category:"cleric", summary:"유발 조건: 위험에 대한 내성 굴림을 하려 합니다.", desc:'<strong>유발 조건:</strong> 위험에 대한 내성 굴림을 하려 합니다. 신격이 순간의 선견을 부여합니다. 유발 내성에 <strong>+2 상황 보너스</strong>.' }
,
  {name_ko:"주문 도달", name_en:"Reach Spell", feat_level:1, prerequisites:"", traits:["클레릭", "집중", "주문변형"], category:"cleric", summary:"주문의 사거리를 30피트 증가(접촉이면 30피트로).", desc:'주문 사거리 <strong>30피트 증가</strong>(접촉이면 30피트로).' }
,
  {name_ko:"캔트립 확장", name_en:"Cantrip Expansion", feat_level:2, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"매일 캔트립 2개를 추가로 준비할 수 있습니다.", desc:'매일 <strong>캔트립 2개를 추가</strong>로 준비.' }
,
  {name_ko:"공동 치유", name_en:"Communal Healing", feat_level:2, prerequisites:"", traits:["클레릭", "치유", "활력"], category:"cleric", summary:"활력의 뛰어난 전도체입니다. 단일 생물에게 치유를 시전할 때, 사거리 내 다른 동의하는 살아있는 생물을 선택하여 주문 랭크만큼 HP를 회복시킵니다.", desc:'활력의 뛰어난 전도체입니다. 단일 생물에게 <em>치유</em>를 시전할 때, 사거리 내 다른 동의하는 살아있는 생물을 선택하여 <strong>주문 랭크만큼 HP를 회복</strong>시킵니다.' }
,
  {name_ko:"문장 각인", name_en:"Emblazon Armament", feat_level:2, prerequisites:"", traits:["클레릭", "탐험"], category:"cleric", summary:"10분간 무기나 방패에 신격의 상징을 신중히 새깁니다(1년 지속). 상징이 추가 혜택을 부여합니다:", desc:'10분간 무기나 방패에 신격의 상징을 신중히 새깁니다(1년 지속). 상징이 추가 혜택을 부여합니다:' }
,
  {name_ko:"죽은 자 공포", name_en:"Panic the Dead", feat_level:2, prerequisites:"", traits:["클레릭", "감정", "공포", "정신"], category:"cleric", summary:"활력이 언데드에 공포를 안깁니다. 치유로 언데드에 피해를 줄 때, 내성 실패한 언데드는 공포 1. 대실패 시 다음 턴 시작까지 도주(fleeing)도 추가. 무심 언데드도 면역이 아닙니다.", desc:'활력이 언데드에 공포를 안깁니다. <em>치유</em>로 언데드에 피해를 줄 때, 내성 실패한 언데드는 <strong>공포 1</strong>. 대실패 시 다음 턴 시작까지 <strong>도주(fleeing)</strong>도 추가. 무심 언데드도 면역이 아닙니다.' }
,
  {name_ko:"신속 대응", name_en:"Rapid Response", feat_level:2, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"유발 조건: 아군이 HP 0으로 감소합니다.", desc:'<strong>유발 조건:</strong> 아군이 HP 0으로 감소합니다. 긴급 상황에서 빠르게 움직입니다. 유발 아군을 향해 <strong>보폭</strong>. 이동 중 이동 속도에 +10피트 보너스.' }
,
  {name_ko:"생명 흡수", name_en:"Sap Life", feat_level:2, prerequisites:"", traits:["클레릭", "치유"], category:"cleric", summary:"적의 생명력을 끌어냅니다. 해로움으로 살아있는 생물 최소 1명에게 피해를 줄 때, 주문 랭크만큼 HP를 회복합니다(자신이 살아있는 생물이 아니면 무효).", desc:'적의 생명력을 끌어냅니다. <em>해로움</em>으로 살아있는 생물 최소 1명에게 피해를 줄 때, <strong>주문 랭크만큼 HP를 회복</strong>합니다(자신이 살아있는 생물이 아니면 무효).' }
,
  {name_ko:"다재다능한 원천", name_en:"Versatile Font", feat_level:2, prerequisites:"해로운/치유 원천, 신격이 둘 다 허용. 원천 슬롯에 해로움이나 치유 어느 쪽이든 준비 가능.", traits:["클레릭"], category:"cleric", summary:"원천 슬롯에 해로움이나 치유 어느 쪽이든 준비 가능.", desc:'<strong>전제조건:</strong> 해로운/치유 원천, 신격이 둘 다 허용. 원천 슬롯에 <em>해로움</em>이나 <em>치유</em> 어느 쪽이든 준비 가능.' }
,
  {name_ko:"전투 사제의 갑옷", name_en:"Warpriest's Armor", feat_level:2, prerequisites:"전투 사제 교의. 평갑에 숙련. 평갑 전문가 이상을 얻을 때 평갑에도 적용. 2 부피 이상 갑옷을 1 부피 가벼운 것처럼 취급(최소 1).", traits:["클레릭"], category:"cleric", summary:"평갑에 숙련. 평갑 전문가 이상을 얻을 때 평갑에도 적용. 2 부피 이상 갑옷을 1 부피 가벼운 것처럼 취급(최소 1).", desc:'전투의 위험 속에서 무기와 주문 모두로 싸웁니다.' }
,
  {name_ko:'전투 사제의 갑옷', name_en:'Warpriest\'s Armor', feat_level:2, prerequisites:'', traits:['클레릭'], category:'cleric', summary:'전제조건: 전투 사제 교의. 평갑에 숙련. 평갑 전문가 이상을 얻을 때 평갑에도 적용. 2 부피 이상 갑옷을 1 부피 가벼운 것처럼 취급(최소 ', desc:'<strong>전제조건:</strong> 전투 사제 교의. <strong>평갑에 숙련</strong>. 평갑 전문가 이상을 얻을 때 평갑에도 적용. 2 부피 이상 갑옷을 1 부피 가벼운 것처럼 취급(최소 1).'}
,
  {name_ko:"채널 강타", name_en:"Channel Smite", feat_level:4, prerequisites:"", traits:["클레릭", "신성"], category:"cleric", summary:"비용: 해로움 또는 치유 주문 1개를 소비합니다.", desc:'<strong>비용:</strong> <em>해로움</em> 또는 <em>치유</em> 주문 1개를 소비합니다. 근접 타격을 합니다. 명중 시, 소비한 주문의 1행동 버전을 대상에게 시전하여 일반 타격 피해에 추가합니다. 대상은 자동으로 <strong>내성 실패</strong>(타격이 치명타이면 대실패). 타격 실패 시 또는 해당 에너지에 피해를 받지 않는 생물을 명중하면 주문은 효과 없이 소비됩니다.' }
,
  {name_ko:"지향 채널", name_en:"Directed Channel", feat_level:4, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"채널하는 에너지를 한 방향으로 형성합니다. 영역 버전의 해로움이나 치유 시전 시, 30피트 방사 대신 60피트 원뿔로 만들 수 있습니다.", desc:'채널하는 에너지를 한 방향으로 형성합니다. 영역 버전의 <em>해로움</em>이나 <em>치유</em> 시전 시, 30피트 방사 대신 <strong>60피트 원뿔</strong>로 만들 수 있습니다.' }
,
  {name_ko:"신성 주입", name_en:"Divine Infusion", feat_level:4, prerequisites:"", traits:["클레릭", "집중", "주문변형"], category:"cleric", summary:"치유 대상의 공격에 에너지를 쏟습니다. 다음 행동이 단일 생물에게 HP를 회복하는 해로움이나 치유 시전이면, 대상이 다음 턴 종료까지 근접 무기/비무장 공격에 추가 1d6 피해(해로움=공허, 치유=활력). 5랭크 이상이면 2d6, 8랭크 이상이면 3d6.", desc:'치유 대상의 공격에 에너지를 쏟습니다. 다음 행동이 단일 생물에게 HP를 회복하는 <em>해로움</em>이나 <em>치유</em> 시전이면, 대상이 다음 턴 종료까지 근접 무기/비무장 공격에 <strong>추가 1d6 피해</strong>(해로움=공허, 치유=활력). 5랭크 이상이면 2d6, 8랭크 이상이면 3d6.' }
,
  {name_ko:"상징 올리기", name_en:"Raise Symbol", feat_level:4, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"요구사항: 종교 상징을 들고 있어야 합니다.", desc:'<strong>요구사항:</strong> 종교 상징을 들고 있어야 합니다. 종교 상징을 강하게 제시합니다. 다음 턴 시작까지 내성 굴림에 <strong>+2 상황 보너스</strong>. 올린 상태에서 활력/공허 효과에 대한 내성에서 <strong>성공 시 대성공</strong>.' }
,
  {name_ko:"회복의 타격", name_en:"Restorative Strike", feat_level:4, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"요구사항: 시전 가능한 해로움 또는 치유가 있어야 합니다.", desc:'<strong>요구사항:</strong> 시전 가능한 <em>해로움</em> 또는 <em>치유</em>가 있어야 합니다. 1행동 <em>해로움</em>/<em>치유</em>를 시전하여 자신을 치유하고(조작 특성 없음), 근접 타격을 합니다. 신격 선호 무기로 하면 <strong>공격에 +1 상태 보너스</strong>. 명중 시 사거리 밖이라도 인접한 적에 인접한 동의하는 생물에게 같은 양의 치유를 줄 수 있습니다.' }
,
  {name_ko:"신성한 땅", name_en:"Sacred Ground", feat_level:4, prerequisites:"해로운/치유 원천. 빈도: 10분에 1회. 1분간 기도하여 30피트 폭발 내에 신격의 영역의 그림자를 부릅니다(10분 지속). 영역 내에서 10분 전체를 보낸 생물은 레벨만큼 HP를 회복합니다.", traits:["클레릭", "봉헌", "신성", "탐험"], category:"cleric", summary:"1분간 기도하여 30피트 폭발 내에 신격의 영역의 그림자를 부릅니다(10분 지속).", desc:'<strong>전제조건:</strong> 해로운/치유 원천. <strong>빈도:</strong> 10분에 1회. 1분간 기도하여 30피트 폭발 내에 신격의 영역의 그림자를 부릅니다(10분 지속). 영역 내에서 10분 전체를 보낸 생물은 <strong>레벨만큼 HP를 회복</strong>합니다.' }
,
  {name_ko:"타도", name_en:"Cast Down", feat_level:6, prerequisites:"", traits:["클레릭", "집중", "주문변형"], category:"cleric", summary:"신앙의 힘으로 적을 쓰러뜨립니다. 다음 행동이 단일 생물에게 피해를 주는 해로움/치유 시전이면, 피해를 받은 대상은 엎드려집니다(prone). 대실패 시 1분간 이동 속도 -10피트도 추가.", desc:'신앙의 힘으로 적을 쓰러뜨립니다. 다음 행동이 단일 생물에게 피해를 주는 <em>해로움</em>/<em>치유</em> 시전이면, 피해를 받은 대상은 <strong>엎드려집니다(prone)</strong>. 대실패 시 1분간 <strong>이동 속도 -10피트</strong>도 추가.' }
,
  {name_ko:"신성 반박", name_en:"Divine Rebuttal", feat_level:6, prerequisites:"", traits:["클레릭", "신성"], category:"cleric", summary:"유발 조건: 인접한 생물의 마법 능력에 대한 아군의 내성 굴림 직전.", desc:'<strong>유발 조건:</strong> 인접한 생물의 마법 능력에 대한 아군의 내성 굴림 직전.<br>' }
,
  {name_ko:"신성 무기", name_en:"Divine Weapon", feat_level:6, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"빈도: 턴당 1회. 유발 조건: 턴에 신성 주문 슬롯으로 주문 시전을 완료합니다. 잔여 주문 에너지를 무기에 흡수시킵니다. 턴 종료까지 무기가 추가 1d4 영혼 피해. 신성/불경 특성이 있으면 반대 특성 생물에", desc:'<strong>빈도:</strong> 턴당 1회. <strong>유발 조건:</strong> 턴에 신성 주문 슬롯으로 주문 시전을 완료합니다. 잔여 주문 에너지를 무기에 흡수시킵니다. 턴 종료까지 무기가 <strong>추가 1d4 영혼 피해</strong>. 신성/불경 특성이 있으면 반대 특성 생물에 <strong>2d4</strong>.' }
,
  {name_ko:"마법 손", name_en:"Magic Hands", feat_level:6, prerequisites:"치유의 손. 상처 치료(Treat Wounds) 의학 판정 성공 시 d8 대신 d10, 치유에 레벨만큼 상태 보너스.", traits:["클레릭"], category:"cleric", summary:"상처 치료(Treat Wounds) 의학 판정 성공 시 d8 대신 d10, 치유에 레벨만큼 상태 보너스.", desc:'<strong>전제조건:</strong> 치유의 손. 상처 치료(Treat Wounds) 의학 판정 성공 시 d8 대신 <strong>d10</strong>, 치유에 <strong>레벨만큼 상태 보너스</strong>.' }
,
  {name_ko:"선택적 에너지", name_en:"Selective Energy", feat_level:6, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"영역 버전의 해로움/치유 시전 시 영역 내 최대 5명을 제외할 수 있습니다.", desc:'영역 버전의 <em>해로움</em>/<em>치유</em> 시전 시 영역 내 최대 <strong>5명을 제외</strong>할 수 있습니다.' }
,
  {name_ko:"안정된 주문시전", name_en:"Steady Spellcasting", feat_level:6, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"반응이 주문시전을 방해하려 하면 DC 15 단순 판정. 성공 시 방해 안 됨.", desc:'반응이 주문시전을 방해하려 하면 <strong>DC 15 단순 판정</strong>. 성공 시 방해 안 됨.' }
,
  {name_ko:"고급 영역", name_en:"Advanced Domain", feat_level:8, prerequisites:"영역 입문. 초기 영역 주문이 있는 영역의 고급 영역 주문을 얻습니다. 특수: 여러 번 선택 가능.", traits:["클레릭"], category:"cleric", summary:"초기 영역 주문이 있는 영역의 고급 영역 주문을 얻습니다.", desc:'<strong>전제조건:</strong> 영역 입문. 초기 영역 주문이 있는 영역의 <strong>고급 영역 주문</strong>을 얻습니다. <strong>특수:</strong> 여러 번 선택 가능.' }
,
  {name_ko:"언데드 화장", name_en:"Cremate Undead", feat_level:8, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"활력이 언데드를 불태웁니다. 치유로 언데드에 피해를 줄 때, 피해를 받은 각 언데드가 주문 랭크만큼의 지속 화염 피해도 받습니다.", desc:'활력이 언데드를 불태웁니다. <em>치유</em>로 언데드에 피해를 줄 때, 피해를 받은 각 언데드가 <strong>주문 랭크만큼의 지속 화염 피해</strong>도 받습니다.' }
,
  {name_ko:"에너지 각인", name_en:"Emblazon Energy", feat_level:8, prerequisites:"문장 각인. 원소 에너지를 각인에 부여합니다. 산성/냉기/전기/화염/음파 중 하나를 선택합니다.", traits:["클레릭"], category:"cleric", summary:"방패: 해당 유형에 상황 보너스로 방패 막기 사용 가능 + 해당 유형 저항(레벨 절반).", desc:'<strong>전제조건:</strong> 문장 각인. 원소 에너지를 각인에 부여합니다. 산성/냉기/전기/화염/음파 중 하나를 선택합니다.' }
,
  {name_ko:"순교자", name_en:"Martyr", feat_level:8, prerequisites:"", traits:["클레릭", "주문변형"], category:"cleric", summary:"동료를 지원하기 위해 극단적 행동을 합니다. 다음 행동이 단일 아군에게 HP를 회복하는 해로움/치유 시전이면, 자신의 활력도 함께 전달합니다. 주문 랭크당 1d8 HP를 잃고(줄이거나 경감 불가), 아군이 같은 양만큼 추가 HP를 회복합니다.", desc:'동료를 지원하기 위해 극단적 행동을 합니다. 다음 행동이 단일 아군에게 HP를 회복하는 <em>해로움</em>/<em>치유</em> 시전이면, 자신의 활력도 함께 전달합니다. 주문 랭크당 <strong>1d8 HP를 잃고</strong>(줄이거나 경감 불가), 아군이 같은 양만큼 <strong>추가 HP를 회복</strong>합니다.' }
,
  {name_ko:"회복 채널", name_en:"Restorative Channel", feat_level:8, prerequisites:"치유 원천. 신성한 은총으로 상태를 제거합니다. 치유 원천의 추가 슬롯에 준비된 치유 1개를 희생하여 대신 다음 주문 중 하나를 시전: 고통 정화, 맑은 마음, 건강한 몸, 확실한 발놀림. 희생한 주문과 같은 랭크으로 고양.", traits:["클레릭"], category:"cleric", summary:"신성한 은총으로 상태를 제거합니다.", desc:'<strong>전제조건:</strong> 치유 원천. 신성한 은총으로 상태를 제거합니다. 치유 원천의 추가 슬롯에 준비된 <em>치유</em> 1개를 희생하여 대신 다음 주문 중 하나를 시전: <em>고통 정화, 맑은 마음, 건강한 몸, 확실한 발놀림</em>. 희생한 주문과 같은 랭크로 고양.' }
,
  {name_ko:"무장 성화", name_en:"Sanctify Armament", feat_level:8, prerequisites:"신성 또는 불경 특성. 무기를 만져 1라운드간 신성/불경 특성을 부여하고, 반대 특성 생물에 추가 2d6 영혼 피해.", traits:["클레릭", "신성"], category:"cleric", summary:"무기를 만져 1라운드간 신성/불경 특성을 부여하고, 반대 특성 생물에 추가 2d6 영혼 피해.", desc:'<strong>전제조건:</strong> 신성 또는 불경 특성. 무기를 만져 1라운드간 <strong>신성/불경 특성</strong>을 부여하고, 반대 특성 생물에 <strong>추가 2d6 영혼 피해</strong>.' }
,
  {name_ko:"솟아오르는 집중", name_en:"Surging Focus", feat_level:8, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"빈도: 하루 1회. 유발 조건: 볼 수 있는 아군이 HP 0으로 떨어집니다. 정의로운 분노의 급류로 집중 포인트 1점을 즉시 회복합니다.", desc:'<strong>빈도:</strong> 하루 1회. <strong>유발 조건:</strong> 볼 수 있는 아군이 HP 0으로 떨어집니다. 정의로운 분노의 급류로 <strong>집중 포인트 1점을 즉시 회복</strong>합니다.' }
,
  {name_ko:"공허 흡수", name_en:"Void Siphon", feat_level:8, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"공허의 원시 에너지가 살아있는 이의 정수를 빨아들입니다. 당신이 시전한 해로움에 대해 살아있는 생물이 대실패하면 소진(drained) 1.", desc:'공허의 원시 에너지가 살아있는 이의 정수를 빨아들입니다. 당신이 시전한 <em>해로움</em>에 대해 살아있는 생물이 <strong>대실패하면 소진(drained) 1</strong>.' }
,
  {name_ko:"열정적 돌진", name_en:"Zealous Rush", feat_level:8, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"유발 조건: 자신이나 장비에만 영향을 주는 1행동 이상의 신성 주문을 시전합니다.", desc:'<strong>유발 조건:</strong> 자신이나 장비에만 영향을 주는 1행동 이상의 신성 주문을 시전합니다. 이동하며 축복합니다. <strong>10피트까지 보폭</strong>. 주문이 2행동 이상이면 <strong>전체 속도까지</strong>.' }
,
  {name_ko:"응징 무기", name_en:"Castigating Weapon", feat_level:10, prerequisites:"신성 응징. 신성 응징으로 영혼 피해를 준 후 턴 종료까지 무기/비무장 타격이 신성/불경 특성을 얻고 추가 영혼 피해(해로움/치유의 랭크만큼).", traits:["클레릭"], category:"cleric", summary:"신성 응징으로 영혼 피해를 준 후 턴 종료까지 무기/비무장 타격이 신성/불경 특성을 얻고 추가 영혼 피해(해로움/치유의 랭크만큼).", desc:'<strong>전제조건:</strong> 신성 응징. 신성 응징으로 영혼 피해를 준 후 턴 종료까지 무기/비무장 타격이 신성/불경 특성을 얻고 <strong>추가 영혼 피해</strong>(해로움/치유의 랭크만큼).' }
,
  {name_ko:"영웅적 회복", name_en:"Heroic Recovery", feat_level:10, prerequisites:"치유 원천. 다음 행동이 단일 살아있는 생물 대상 치유이고 HP를 회복하면, 대상이 다음 턴 종료까지: 이동 속도 +5피트, 공격 +1 상태 보너스, 피해 +1 상태 보너스. 엎드려있으면 즉시 반응 없이 일어남.", traits:["클레릭", "집중", "주문변형"], category:"cleric", summary:"다음 행동이 단일 살아있는 생물 대상 치유이고 HP를 회복하면, 대상이 다음 턴 종료까지: 이동 속도 +5피트, 공격 +1 상태 보너스, 피해 +1 상태 보너스.", desc:'<strong>전제조건:</strong> 치유 원천. 다음 행동이 단일 살아있는 생물 대상 <em>치유</em>이고 HP를 회복하면, 대상이 다음 턴 종료까지: 이동 속도 <strong>+5피트</strong>, 공격 <strong>+1 상태 보너스</strong>, 피해 <strong>+1 상태 보너스</strong>. 엎드려있으면 즉시 <strong>반응 없이 일어남</strong>.' }
,
  {name_ko:"전쟁의 보충", name_en:"Replenishment of War", feat_level:10, prerequisites:"신격 선호 무기 전문가. 신격 선호 무기로 생물에 피해를 줄 때 레벨 절반만큼 임시 HP(치명타 시 레벨만큼). 다음 턴 시작까지 지속.", traits:["클레릭"], category:"cleric", summary:"신격 선호 무기로 생물에 피해를 줄 때 레벨 절반만큼 임시 HP(치명타 시 레벨만큼).", desc:'<strong>전제조건:</strong> 신격 선호 무기 전문가. 신격 선호 무기로 생물에 피해를 줄 때 <strong>레벨 절반만큼 임시 HP</strong>(치명타 시 레벨만큼). 다음 턴 시작까지 지속.' }
,
  {name_ko:"공유 회피", name_en:"Shared Avoidance", feat_level:10, prerequisites:"회피 예감. 회피 예감 사용 시, 같은 위험에 같은 내성을 굴리는 20피트 내 아군도 +2 상황 보너스.", traits:["클레릭"], category:"cleric", summary:"회피 예감 사용 시, 같은 위험에 같은 내성을 굴리는 20피트 내 아군도 +2 상황 보너스.", desc:'<strong>전제조건:</strong> 회피 예감. 회피 예감 사용 시, 같은 위험에 같은 내성을 굴리는 <strong>20피트 내 아군도 +2 상황 보너스</strong>.' }
,
  {name_ko:"신앙의 방패", name_en:"Shield of Faith", feat_level:10, prerequisites:"영역 입문. 집중 포인트를 소비하여 영역 주문을 시전할 때, 다음 턴 시작까지 AC에 +1 상태 보너스.", traits:["클레릭"], category:"cleric", summary:"집중 포인트를 소비하여 영역 주문을 시전할 때, 다음 턴 시작까지 AC에 +1 상태 보너스.", desc:'<strong>전제조건:</strong> 영역 입문. 집중 포인트를 소비하여 영역 주문을 시전할 때, 다음 턴 시작까지 <strong>AC에 +1 상태 보너스</strong>.' }
,
  {name_ko:"방어적 회복", name_en:"Defensive Recovery", feat_level:12, prerequisites:"", traits:["클레릭", "집중", "주문변형"], category:"cleric", summary:"다음 행동이 단일 대상 해로움/치유이고 HP 회복 시, 1라운드간 AC와 내성에 +2 상태 보너스.", desc:'다음 행동이 단일 대상 <em>해로움</em>/<em>치유</em>이고 HP 회복 시, 1라운드간 <strong>AC와 내성에 +2 상태 보너스</strong>.' }
,
  {name_ko:"영역 집중", name_en:"Domain Focus", feat_level:12, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"재집중(Refocus)할 때마다 집중 풀을 완전히 채웁니다.", desc:'재집중(Refocus)할 때마다 집중 풀을 <strong>완전히 채웁니다</strong>.' }
,
  {name_ko:"대마법 각인", name_en:"Emblazon Antimagic", feat_level:12, prerequisites:"문장 각인. 각인이 공격적 마법을 방어합니다.", traits:["클레릭"], category:"cleric", summary:"방패: 올린 상태에서 마법에 대한 내성에 방패 상황 보너스 적용 + 적 주문 피해에 방패 막기 사용 가능.", desc:'<strong>전제조건:</strong> 문장 각인. 각인이 공격적 마법을 방어합니다.' }
,
  {name_ko:"행운의 안도", name_en:"Fortunate Relief", feat_level:12, prerequisites:"", traits:["클레릭", "행운"], category:"cleric", summary:"고통이나 상태를 상쇄하려는 치유 주문 시전 시 상쇄 판정을 두 번 굴리고 높은 결과를 사용합니다.", desc:'고통이나 상태를 상쇄하려는 치유 주문 시전 시 <strong>상쇄 판정을 두 번 굴리고 높은 결과</strong>를 사용합니다.' }
,
  {name_ko:"흡수 상징", name_en:"Sapping Symbol", feat_level:12, prerequisites:"상징 올리기. 유발 조건: 상징을 올린 상태에서 근접 공격으로 피해를 받으려 합니다. 공격자의 의지 DC에 대해 종교학 판정. 대성공: 공격자가 당신에게서 멀어지는 행동을 할 때까지 기력상실(enfeebled) 2. 성공: 기력상실 1.", traits:["클레릭", "신성"], category:"cleric", summary:"공격자의 의지 DC에 대해 종교 판정.", desc:'<strong>전제조건:</strong> 상징 올리기. <strong>유발 조건:</strong> 상징을 올린 상태에서 근접 공격으로 피해를 받으려 합니다. 공격자의 의지 DC에 대해 종교 판정. <strong>대성공:</strong> 공격자가 당신에게서 멀어지는 행동을 할 때까지 <strong>기력상실(enfeebled) 2</strong>. <strong>성공:</strong> 기력상실 1.' }
,
  {name_ko:"공유 보충", name_en:"Shared Replenishment", feat_level:12, prerequisites:"전쟁의 보충. 전쟁의 보충의 임시 HP를 자신 대신 10피트 내 아군에게 줄 수 있습니다. 매번 다른 아군에게 가능.", traits:["클레릭"], category:"cleric", summary:"전쟁의 보충의 임시 HP를 자신 대신 10피트 내 아군에게 줄 수 있습니다.", desc:'<strong>전제조건:</strong> 전쟁의 보충. 전쟁의 보충의 임시 HP를 자신 대신 <strong>10피트 내 아군에게</strong> 줄 수 있습니다. 매번 다른 아군에게 가능.' }
,
  {name_ko:"채널 차단", name_en:"Channeling Block", feat_level:14, prerequisites:"방패 막기. 방패 막기 시 해로움/치유 주문을 소비합니다. 주문 랭크당 1d8을 굴려 이번 막기 동안 방패의 경도를 증가시킵니다.", traits:["클레릭"], category:"cleric", summary:"방패 막기 시 해로움/치유 주문을 소비합니다.", desc:'<strong>전제조건:</strong> 방패 막기. 방패 막기 시 <em>해로움</em>/<em>치유</em> 주문을 소비합니다. 주문 랭크당 1d8을 굴려 이번 막기 동안 방패의 <strong>경도를 증가</strong>시킵니다.' }
,
  {name_ko:"신격의 보호", name_en:"Deity's Protection", feat_level:14, prerequisites:"고급 영역. 영역 주문 시전 후 다음 턴 시작까지 모든 피해에 저항(영역 주문 랭크만큼).", traits:["클레릭"], category:"cleric", summary:"영역 주문 시전 후 다음 턴 시작까지 모든 피해에 저항(영역 주문 랭크만큼).", desc:'무엇보다 숭배하는 신격의 필멸 시종입니다. 신격은 기술 1개와 선호 무기에 숙련을 부여하고, 주문 목록에 주문을 추가합니다.' }
,
  {name_ko:"밀물과 썰물", name_en:"Ebb and Flow", feat_level:14, prerequisites:"다재다능한 원천. 활력과 공허를 동시에 끌어와 적을 해치고 아군을 치유합니다. 다음 행동이 1-2행동 치유/해로움이면, 사거리 내 피해를 받을 생물 1명과 치유를 받을 생물 1명을 선택하여 둘 다 대상으로 합니다.", traits:["클레릭", "집중", "주문변형"], category:"cleric", summary:"활력과 공허를 동시에 끌어와 적을 해치고 아군을 치유합니다.", desc:'<strong>전제조건:</strong> 다재다능한 원천. 활력과 공허를 동시에 끌어와 적을 해치고 아군을 치유합니다. 다음 행동이 1-2행동 <em>치유</em>/<em>해로움</em>이면, 사거리 내 피해를 받을 생물 1명과 치유를 받을 생물 1명을 선택하여 <strong>둘 다 대상</strong>으로 합니다.' }
,
  {name_ko:"빠른 채널", name_en:"Fast Channel", feat_level:14, prerequisites:"해로운/치유 원천. 2행동으로 해로움/치유 시전 시 3행동 버전의 효과를 얻습니다.", traits:["클레릭"], category:"cleric", summary:"2행동으로 해로움/치유 시전 시 3행동 버전의 효과를 얻습니다.", desc:'<strong>전제조건:</strong> 해로운/치유 원천. 2행동으로 <em>해로움</em>/<em>치유</em> 시전 시 <strong>3행동 버전의 효과</strong>를 얻습니다.' }
,
  {name_ko:"지속 무장", name_en:"Lasting Armament", feat_level:14, prerequisites:"무장 성별화. 무장 성별화 지속이 1라운드에서 1시간으로 증가(다른 무기에 사용하면 종료).", traits:["클레릭"], category:"cleric", summary:"무장 성별화 지속이 1라운드에서 1시간으로 증가(다른 무기에 사용하면 종료).", desc:'<strong>전제조건:</strong> 무장 성별화. 무장 성별화 지속이 1라운드에서 <strong>1시간</strong>으로 증가(다른 무기에 사용하면 종료).' }
,
  {name_ko:"명확함의 예감", name_en:"Premonition of Clarity", feat_level:14, prerequisites:"", traits:["클레릭", "행운"], category:"cleric", summary:"빈도: 시간당 1회. 유발 조건: 정신 효과에 대한 내성에 실패합니다. 신격이 신앙의 환영을 보내 정신 공격에 맞섭니다. 유발 내성을 +2 상황 보너스로 다시 굴립니다. 더 나빠도 새 결과를 사용.", desc:'<strong>빈도:</strong> 시간당 1회. <strong>유발 조건:</strong> 정신 효과에 대한 내성에 실패합니다. 신격이 신앙의 환영을 보내 정신 공격에 맞섭니다. 유발 내성을 <strong>+2 상황 보너스로 다시 굴립니다</strong>. 더 나빠도 새 결과를 사용.' }
,
  {name_ko:"신속 추방", name_en:"Swift Banishment", feat_level:14, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"유발 조건: 본향 차원이 아닌 생물에 치명타.", desc:'<strong>유발 조건:</strong> 본향 차원이 아닌 생물에 치명타. <strong>요구사항:</strong> <em>추방</em> 주문이 준비되어 있어야 합니다. 타격의 힘이 피해자를 본향으로 돌려보냅니다. 준비된 <em>추방</em>을 소비하여 주문 시전 없이 적용. 대상은 정상적으로 저항 가능.' }
,
  {name_ko:'신격의 보호', name_en:'Deity\'s Protection', feat_level:14, prerequisites:'', traits:['클레릭'], category:'cleric', summary:'전제조건: 고급 영역. 영역 주문 시전 후 다음 턴 시작까지 모든 피해에 저항(영역 주문 랭크만큼).', desc:'<strong>전제조건:</strong> 고급 영역. 영역 주문 시전 후 다음 턴 시작까지 <strong>모든 피해에 저항</strong>(영역 주문 랭크만큼).'}
,
  {name_ko:"영원한 저주", name_en:"Eternal Bane", feat_level:16, prerequisites:"불경. 영구적으로 15피트 반경의 저주(bane) 주문에 둘러싸입니다(랭크 = 레벨 절반 올림). 해산 가능, 1분 후 자동 복귀.", traits:["클레릭"], category:"cleric", summary:"영구적으로 15피트 반경의 저주(bane) 주문에 둘러싸입니다(랭크 = 레벨 절반 올림).", desc:'<strong>전제조건:</strong> 불경. 영구적으로 15피트 반경의 <em>저주(bane)</em> 주문에 둘러싸입니다(랭크 = 레벨 절반 올림). 해산 가능, 1분 후 자동 복귀.' }
,
  {name_ko:"영원한 축복", name_en:"Eternal Blessing", feat_level:16, prerequisites:"신성. 영구적으로 15피트 반경의 축복(bless) 주문에 둘러싸입니다. 해산 가능, 1분 후 자동 복귀.", traits:["클레릭"], category:"cleric", summary:"영구적으로 15피트 반경의 축복(bless) 주문에 둘러싸입니다.", desc:'<strong>전제조건:</strong> 신성. 영구적으로 15피트 반경의 <em>축복(bless)</em> 주문에 둘러싸입니다. 해산 가능, 1분 후 자동 복귀.' }
,
  {name_ko:"반향 강타", name_en:"Rebounding Smite", feat_level:16, prerequisites:"채널 강타. 유발 조건: 채널 강타 중 타격이 빗나갑니다. 에너지가 잠시 남아 새 대상에게 전달됩니다. 소비한 해로움/치유의 1행동 버전을 타격 대상이 아닌 다른 생물에게 시전합니다.", traits:["클레릭"], category:"cleric", summary:"에너지가 잠시 남아 새 대상에게 전달됩니다.", desc:'<strong>전제조건:</strong> 채널 강타. <strong>유발 조건:</strong> 채널 강타 중 타격이 빗나갑니다. 에너지가 잠시 남아 새 대상에게 전달됩니다. 소비한 <em>해로움</em>/<em>치유</em>의 1행동 버전을 <strong>타격 대상이 아닌 다른 생물에게</strong> 시전합니다.' }
,
  {name_ko:"치유하기", name_en:"Remediate", feat_level:16, prerequisites:"", traits:["클레릭", "집중", "주문변형"], category:"cleric", summary:"빈도: 시간당 1회. 다음 행동이 신성 원천로 3행동 치유/해로움 시전이면, 일반 효과 외에 주문 영역 내 신성 효과 1개를 상쇄 시도.", desc:'<strong>빈도:</strong> 시간당 1회. 다음 행동이 신성 원천로 3행동 <em>치유</em>/<em>해로움</em> 시전이면, 일반 효과 외에 주문 영역 내 <strong>신성 효과 1개를 상쇄</strong> 시도.' }
,
  {name_ko:"부활자", name_en:"Resurrectionist", feat_level:16, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"빈사 생물의 HP를 회복하거나 죽은 생물을 되살리고 HP를 회복시킬 때, 대상에게 1분간 빠른 치유 5를 부여합니다. 의식을 잃으면 빠른 치유가 종료.", desc:'빈사 생물의 HP를 회복하거나 죽은 생물을 되살리고 HP를 회복시킬 때, 대상에게 <strong>1분간 빠른 치유 5</strong>를 부여합니다. 의식을 잃으면 빠른 치유가 종료.' }
,
  {name_ko:"신성 정점", name_en:"Divine Apex", feat_level:18, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"일일 준비 완료 시, 정점(apex) 특성이 없는 착용 마법 아이템 1개를 만져 다음 준비까지 정점 특성을 부여합니다. 신격의 신성 속성 중 하나를 선택하여 해당 속성 수정치를 1 증가 또는 +4로(더 높은 쪽).", desc:'일일 준비 완료 시, 정점(apex) 특성이 없는 착용 마법 아이템 1개를 만져 다음 준비까지 정점 특성을 부여합니다. 신격의 신성 속성 중 하나를 선택하여 해당 속성 수정치를 <strong>1 증가 또는 +4로</strong>(더 높은 쪽).' }
,
  {name_ko:"메아리 채널", name_en:"Echoing Channel", feat_level:18, prerequisites:"", traits:["클레릭", "집중", "주문변형"], category:"cleric", summary:"다음 행동이 2행동 해로움/치유로 단일 생물을 치유/피해하는 것이면, 사거리 내 추가 생물 1명을 선택하여 1행동 버전을 동일 랭크으로 적용. 추가 슬롯 불필요.", desc:'다음 행동이 2행동 <em>해로움</em>/<em>치유</em>로 단일 생물을 치유/피해하는 것이면, 사거리 내 추가 생물 1명을 선택하여 <strong>1행동 버전을 동일 랭크로 적용</strong>. 추가 슬롯 불필요.' }
,
  {name_ko:"향상된 신속 추방", name_en:"Improved Swift Banishment", feat_level:18, prerequisites:"신속 추방. 추방 준비 없이도 5랭크 이상 주문 슬롯이 남아있으면 사용 가능. 해당 슬롯을 희생하고 그 랭크으로 고양. 대상의 내성에 -2 상황 페널티.", traits:["클레릭"], category:"cleric", summary:"추방 준비 없이도 5랭크 이상 주문 슬롯이 남아있으면 사용 가능.", desc:'<strong>전제조건:</strong> 신속 추방. <em>추방</em> 준비 없이도 5랭크 이상 주문 슬롯이 남아있으면 사용 가능. 해당 슬롯을 희생하고 그 랭크로 고양. 대상의 내성에 <strong>-2 상황 페널티</strong>.' }
,
  {name_ko:"불가침", name_en:"Inviolable", feat_level:18, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"신격이 당신을 해치는 자를 벌합니다. 당신에게 공격으로 명중하는 생물은 매번 3d6 영혼 피해를 받습니다. 신성/불경 특성이 있으면 이 피해에 적용 가능.", desc:'신격이 당신을 해치는 자를 벌합니다. 당신에게 공격으로 명중하는 생물은 매번 <strong>3d6 영혼 피해</strong>를 받습니다. 신성/불경 특성이 있으면 이 피해에 적용 가능.' }
,
  {name_ko:"기적의 가능성", name_en:"Miraculous Possibility", feat_level:18, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"일일 준비 중, 주문 슬롯 1개를 특정 주문 대신 순수한 신성 잠재력으로 채울 수 있습니다. 이 슬롯으로 신성 주문 목록에서 아는 주문 중 지정된 슬롯보다 최소 2랭크 낮은 것을 시전합니다. 시전 전까지 특정 주문이 준비되지 않습니다.", desc:'일일 준비 중, 주문 슬롯 1개를 특정 주문 대신 <strong>순수한 신성 잠재력</strong>으로 채울 수 있습니다. 이 슬롯으로 신성 주문 목록에서 아는 주문 중 지정된 슬롯보다 최소 2랭크 낮은 것을 시전합니다. 시전 전까지 특정 주문이 준비되지 않습니다.' }
,
  {name_ko:"공유 명확함", name_en:"Shared Clarity", feat_level:18, prerequisites:"명확함의 예감. 명확함의 예감 사용 시, 같은 정신 효과에 같은 내성을 실패한 15피트 내 아군도 +2 보너스로 다시 굴림 가능.", traits:["클레릭"], category:"cleric", summary:"명확함의 예감 사용 시, 같은 정신 효과에 같은 내성을 실패한 15피트 내 아군도 +2 보너스로 다시 굴림 가능.", desc:'<strong>전제조건:</strong> 명확함의 예감. 명확함의 예감 사용 시, 같은 정신 효과에 같은 내성을 실패한 <strong>15피트 내 아군도 +2 보너스로 다시 굴림</strong> 가능.' }
,
  {name_ko:"아바타의 알현", name_en:"Avatar's Audience", feat_level:20, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"광범위한 봉사가 신성한 특권을 부여합니다. 만나는 모든 생물이 당신이 신격을 대변한다는 것을 본능적으로 앎. 교감(commune) 의식으로 신격에 연락 시 비용 없이 자동 대성공. 하루 1회 차원간 순간이동을 신성 선천 주문으로 시전하여 신격의 영역으로만 이동 가능(시", desc:"광범위한 봉사가 신성한 특권을 부여합니다. 만나는 모든 생물이 당신이 신격을 대변한다는 것을 본능적으로 앎. <em>교감(commune)</em> 의식으로 신격에 연락 시 비용 없이 자동 대성공. <strong>하루 1회</strong> <em>차원간 순간이동</em>을 신성 선천 주문으로 시전하여 신격의 영역으로만 이동 가능(시전 시간 1분, 종교 상징이 차원 열쇠). 영역에서 돌아올 때 단일 행동으로 출발점에 복귀." }
,
  {name_ko:"아바타의 보호", name_en:"Avatar's Protection", feat_level:20, prerequisites:"", traits:["클레릭"], category:"cleric", summary:"유발 조건: 적에게 치명타를 받습니다.", desc:"<strong>유발 조건:</strong> 적에게 치명타를 받습니다. <strong>요구사항:</strong> <em>아바타</em> 주문이 준비되어 있어야 합니다. 위기의 순간에 즉시 신의 형태를 부릅니다. 주문 슬롯에서 <em>아바타</em>를 시전합니다. 유발 치명타가 <strong>일반 명중으로 감소</strong>되고, 아바타의 임시 HP를 얻은 후 피해가 적용됩니다." }
,
  {name_ko:"기적의 창조자", name_en:"Maker of Miracles", feat_level:20, prerequisites:"기적의 주문. 진정한 신적 힘의 전도체입니다. 추가 10랭크 주문 슬롯을 얻습니다.", traits:["클레릭"], category:"cleric", summary:"진정한 신적 힘의 전도체입니다.", desc:'<strong>전제조건:</strong> 기적의 주문. 진정한 신적 힘의 전도체입니다. <strong>추가 10랭크 주문 슬롯</strong>을 얻습니다.' }
,
  {name_ko:"주문변형 채널", name_en:"Spellshape Channel", feat_level:20, prerequisites:"", traits:["클레릭", "집중"], category:"cleric", summary:"생명과 죽음의 에너지의 본질에 대한 깊은 이해가 자유롭게 조작할 수 있게 합니다. 보통 1행동이고 해로움/치유에 적용 가능한 주문변형 행동 1개를 사용합니다. 이 방식으로 사용하면 효과는 해로움/치유에만 적용됩니다.", desc:'생명과 죽음의 에너지의 본질에 대한 깊은 이해가 자유롭게 조작할 수 있게 합니다. 보통 1행동이고 <em>해로움</em>/<em>치유</em>에 적용 가능한 <strong>주문변형 행동 1개를 사용</strong>합니다. 이 방식으로 사용하면 효과는 <em>해로움</em>/<em>치유</em>에만 적용됩니다.' }
,
  {name_ko:'아바타의 알현', name_en:'Avatar\'s Audience', feat_level:20, prerequisites:'', traits:['클레릭'], category:'cleric', summary:'광범위한 봉사가 신성한 특권을 부여합니다. 만나는 모든 생물이 당신이 신격을 대변한다는 것을 본능적으로 앎. 교감(commune) 의식으로 신격', desc:'광범위한 봉사가 신성한 특권을 부여합니다. 만나는 모든 생물이 당신이 신격을 대변한다는 것을 본능적으로 앎. <em>교감(commune)</em> 의식으로 신격에 연락 시 비용 없이 자동 대성공. <strong>하루 1회</strong> <em>차원간 순간이동</em>을 신성 선천 주문으로 시전하여 신격의 영역으로만 이동 가능(시전 시간 1분, 종교 상징이 차원 열쇠). 영역에서 돌아올 때 단일 행동으로 출발점에 복귀.'}
,
  {name_ko:'아바타의 보호', name_en:'Avatar\'s Protection', feat_level:20, prerequisites:'', traits:['클레릭'], category:'cleric', summary:'유발 조건: 적에게 치명타를 받습니다. 요구사항: 아바타 주문이 준비되어 있어야 합니다. 위기의 순간에 즉시 신의 형태를 부릅니다. 주문 슬롯에', desc:'<strong>유발 조건:</strong> 적에게 치명타를 받습니다. <strong>요구사항:</strong> <em>아바타</em> 주문이 준비되어 있어야 합니다. 위기의 순간에 즉시 신의 형태를 부릅니다. 주문 슬롯에서 <em>아바타</em>를 시전합니다. 유발 치명타가 <strong>일반 명중으로 감소</strong>되고, 아바타의 임시 HP를 얻은 후 피해가 적용됩니다.'}
,
  {name_ko:"동물 동료", name_en:"Animal Companion", feat_level:1, prerequisites:"", traits:["드루이드"], category:"druid", summary:"동물 동료를 얻어 함께 모험합니다. 동물과 하수인 특성을 가지며, 동물 명령 시 2행동을 얻습니다.", desc:'동물 동료를 얻습니다(206페이지).' }
,
  {name_ko:"동물 공감", name_en:"Animal Empathy", feat_level:1, prerequisites:"", traits:["드루이드"], category:"druid", summary:"동물과 소통하는 능력이 있습니다. 동물에게 외교(Diplomacy)를 사용하여 인상 만들기(Make an Impression)와 요청(Request)을 할 수 있습니다. 대부분의 동물은 기본적인 감정과 욕구만 전달합니다.", desc:'동물에게 외교를 사용하여 인상 만들기와 간단한 요청 가능.' }
,
  {name_ko:"레시 사역마", name_en:"Leshy Familiar", feat_level:1, prerequisites:"", traits:["드루이드"], category:"druid", summary:"작은 레시를 사역마로 얻습니다. 이 레시는 식물 형태의 사역마입니다.", desc:'작은 레시를 사역마로 얻습니다. 이 레시는 식물 형태의 사역마입니다.' }
,
  {name_ko:"식물 공감", name_en:"Plant Empathy", feat_level:1, prerequisites:"", traits:["드루이드"], category:"druid", summary:"식물과 균류에게 외교를 사용할 수 있습니다. 식물과 균류의 감정과 욕구는 매우 기초적입니다.", desc:'식물과 균류에게 외교를 사용할 수 있습니다. 식물과 균류의 감정과 욕구는 매우 기초적입니다.' }
,
  {name_ko:"주문 도달", name_en:"Reach Spell", feat_level:1, prerequisites:"", traits:["드루이드", "집중", "주문변형"], category:"druid", summary:"주문 사거리를 30피트 증가(접촉이면 30피트로).", desc:'주문 사거리 <strong>30피트 증가</strong>(접촉이면 30피트로).' }
,
  {name_ko:"폭풍 태생", name_en:"Storm Born", feat_level:1, prerequisites:"폭풍 결사. 바깥 요소 속에서 편안합니다. 날씨로 인한 원거리 주문 공격이나 지각 판정의 상황 페널티를 받지 않으며, 날씨로 은폐된 대상에 대한 주문도 단순 판정 불필요.", traits:["드루이드"], category:"druid", summary:"바깥 요소 속에서 편안합니다.", desc:'<strong>전제조건:</strong> 폭풍 결사. 바깥 요소 속에서 편안합니다. 날씨로 인한 원거리 주문 공격이나 지각 판정의 <strong>상황 페널티를 받지 않으며</strong>, 날씨로 은폐된 대상에 대한 주문도 단순 판정 불필요.' }
,
  {name_ko:"푸른 무기", name_en:"Verdant Weapon", feat_level:1, prerequisites:"", traits:["드루이드", "탐험"], category:"druid", summary:"원시 에너지를 씨앗에 집중시켜 나무 지팡이, 덩굴 채찍 등의 무기로 자라게 합니다. 10분간 씨앗에 0레벨 무기(금속 부품 없는, 숙련된) 하나를 각인합니다. 상호작용으로 즉시 무기로 성장/씨앗으로 복귀. 룬과 부적은 씨앗 상태에서 억제됩니다. 씨앗은 하나만 가능.", desc:'원시 에너지를 씨앗에 집중시켜 나무 지팡이, 덩굴 채찍 등의 무기로 자라게 합니다. <strong>10분간</strong> 씨앗에 0레벨 무기(금속 부품 없는, 숙련된) 하나를 각인합니다. 상호작용으로 즉시 무기로 성장/씨앗으로 복귀. 룬과 부적은 씨앗 상태에서 억제됩니다. 씨앗은 하나만 가능.' }
,
  {name_ko:"야생 형태", name_en:"Untamed Form", feat_level:1, prerequisites:"야생 결사. 야생과 하나이며 항상 변하고 적응합니다. 야생 형태(untamed form) 결사 주문을 얻어, 드루이드 재주로 확장 가능한 다양한 형태로 변신합니다.", traits:["드루이드"], category:"druid", summary:"야생과 하나이며 항상 변하고 적응합니다.", desc:'<strong>전제조건:</strong> 야생 결사. 야생과 하나이며 항상 변하고 적응합니다. <em>야생 형태(untamed form)</em> 결사 주문(382페이지)을 얻어, 드루이드 재주로 확장 가능한 다양한 형태로 변신합니다.' }
,
  {name_ko:"주문 확장", name_en:"Widen Spell", feat_level:1, prerequisites:"", traits:["드루이드", "조작", "주문변형"], category:"druid", summary:"주문의 에너지를 조작하여 더 넓은 영역에 영향을 줍니다. 다음 행동이 폭발/원뿔/직선 영역이고 지속 시간이 없는 주문 시전이면, 영역을 확장합니다. 반경 10피트 이상 폭발에 5피트 추가, 15피트 이하 원뿔/직선에 5피트 추가, 더 큰 원뿔/직선에 10피트 추가.", desc:'폭발/원뿔/직선 영역 확장.' }
,
  {name_ko:"야생의 부름", name_en:"Call of the Wild", feat_level:2, prerequisites:"", traits:["드루이드"], category:"druid", summary:"자연의 생물을 불러 도움을 청합니다. 10분간 자연과 교감하여 드루이드 주문 슬롯에 준비된 주문을 같은 랭크의 동물 소환 또는 식물/균류 소환으로 교체할 수 있습니다.", desc:'자연의 생물을 불러 도움을 청합니다. <strong>10분간</strong> 자연과 교감하여 드루이드 주문 슬롯에 준비된 주문을 같은 랭크의 <em>동물 소환</em> 또는 <em>식물/균류 소환</em>으로 교체할 수 있습니다.' }
,
  {name_ko:"강화된 사역마", name_en:"Enhanced Familiar", feat_level:2, prerequisites:"사역마. 추가 원시 에너지를 주입합니다. 매일 2개 대신 4개의 사역마/주인 능력을 선택합니다.", traits:["드루이드"], category:"druid", summary:"매일 4개의 사역마 능력 선택.", desc:'매일 <strong>4개의 사역마 능력</strong> 선택.' }
,
  {name_ko:"결사 탐험가", name_en:"Order Explorer", feat_level:2, prerequisites:"", traits:["드루이드"], category:"druid", summary:"다른 결사의 비밀을 배웠습니다. 자신의 것이 아닌 결사를 선택하여 해당 결사 전제조건의 1레벨 재주 1개를 얻고, 재주 전제조건을 위해 그 결사의 구성원이 됩니다. 새 결사의 금기를 위반하면 해당 결사의 재주/능력을 잃습니다.", desc:'다른 결사의 비밀을 배웠습니다. 자신의 것이 아닌 결사를 선택하여 해당 결사 전제조건의 <strong>1레벨 재주 1개</strong>를 얻고, 재주 전제조건을 위해 그 결사의 구성원이 됩니다. 새 결사의 금기를 위반하면 해당 결사의 재주/능력을 잃습니다.<br><strong>특수:</strong> 여러 번 선택 가능. 매번 다른 결사.' }
,
  {name_ko:"독 저항", name_en:"Poison Resistance", feat_level:2, prerequisites:"", traits:["드루이드"], category:"druid", summary:"자연 세계에 대한 친화력이 위험에 대한 보호를 부여합니다. 레벨 절반만큼 독 저항, 독에 대한 내성에 +1 상태 보너스.", desc:'자연 세계에 대한 친화력이 위험에 대한 보호를 부여합니다. <strong>레벨 절반만큼 독 저항</strong>, 독에 대한 내성에 <strong>+1 상태 보너스</strong>.' }
,
  {name_ko:"인간형 변신", name_en:"Anthropomorphic Shape", feat_level:4, prerequisites:"야생 형태. 인간형 형태의 형상들을 야생 형태 목록에 추가합니다.", traits:["드루이드"], category:"druid", summary:"인간형 형태의 형상들을 야생 형태 목록에 추가합니다.", desc:'<strong>전제조건:</strong> 야생 형태. 인간형 형태의 형상들을 야생 형태 목록에 추가합니다.' }
,
  {name_ko:"원소 소환", name_en:"Elemental Summons", feat_level:4, prerequisites:"", traits:["드루이드"], category:"druid", summary:"원소를 부를 수 있습니다. 10분간 자연과 교감하여 주문 슬롯의 주문을 같은 랭크의 원소 소환으로 교체 가능.", desc:'원소를 부를 수 있습니다. 10분간 자연과 교감하여 주문 슬롯의 주문을 같은 랭크의 <em>원소 소환</em>으로 교체 가능.' }
,
  {name_ko:"숲 통과", name_en:"Forest Passage", feat_level:4, prerequisites:"잎 결사. 식물과 균류로 인한 험지를 무시합니다.", traits:["드루이드"], category:"druid", summary:"식물과 균류로 인한 험지를 무시합니다.", desc:'<strong>전제조건:</strong> 잎 결사. 식물과 균류로 인한 <strong>험지를 무시</strong>합니다.' }
,
  {name_ko:"형태 제어", name_en:"Form Control", feat_level:4, prerequisites:"야생 형태. 다음 행동이 야생 형태 시전이면, 주문 랭크이 2 낮아지지만(최소 1랭크) 최대 1시간(또는 나열된 지속 시간 중 긴 것) 동안 변신 유지 가능.", traits:["드루이드", "조작", "주문변형"], category:"druid", summary:"다음 행동이 야생 형태 시전이면, 주문 랭크이 2 낮아지지만(최소 1랭크) 최대 1시간(또는 나열된 지속 시간 중 긴 것) 동안 변신 유지 가능.", desc:'<strong>전제조건:</strong> 야생 형태. 다음 행동이 야생 형태 시전이면, 주문 랭크가 <strong>2 낮아지지만</strong>(최소 1랭크) <strong>최대 1시간</strong>(또는 나열된 지속 시간 중 긴 것) 동안 변신 유지 가능.' }
,
  {name_ko:"레시 사역마 비밀", name_en:"Leshy Familiar Secrets", feat_level:4, prerequisites:"잎 결사. 매일 추가 사역마 능력 1개를 선택합니다(움켜잡는 덩굴, 공기 정화, 녹색 폭발 중 하나).", traits:["드루이드"], category:"druid", summary:"매일 추가 사역마 능력 1개를 선택합니다(움켜잡는 덩굴, 공기 정화, 녹색 폭발 중 하나).", desc:'<strong>전제조건:</strong> 잎 결사. 매일 <strong>추가 사역마 능력 1개</strong>를 선택합니다(움켜잡는 덩굴, 공기 정화, 녹색 폭발 중 하나).' }
,
  {name_ko:"성숙한 동물 동료", name_en:"Mature Animal Companion", feat_level:4, prerequisites:"동물 동료. 동물 동료가 성숙한 동물 동료로 성장합니다(크기 1단계 증가, 힘/민첩/건강/지혜 +1, 감지/내성 전문가, 숙련 기술 전문가, 비무장 피해 주사위 +1). 동물 명령 행동 없이도 턴에 보폭 또는 타격 1행동을 독립적으로 사용 가능.", traits:["드루이드"], category:"druid", summary:"동물 동료가 성숙. 동물 명령 없이도 턴에 보폭/타격 1행동 독립 사용.", desc:'<strong>전제조건:</strong> 동물 동료. 동물 동료가 성숙. 동물 명령 없이도 턴에 보폭/타격 <strong>1행동 독립 사용</strong>.' }
,
  {name_ko:"결사 마법", name_en:"Order Magic", feat_level:4, prerequisites:"결사 탐험가. 선택한 결사의 초기 결사 주문을 얻습니다. 특수: 여러 번 선택 가능.", traits:["드루이드"], category:"druid", summary:"선택한 결사의 초기 결사 주문을 얻습니다.", desc:'<strong>전제조건:</strong> 결사 탐험가. 선택한 결사의 <strong>초기 결사 주문</strong>을 얻습니다. <strong>특수:</strong> 여러 번 선택 가능.' }
,
  {name_ko:"눈보라 주문", name_en:"Snowdrift Spell", feat_level:4, prerequisites:"폭풍 결사. 다음 행동이 공기/물/냉기 특성(화염 아님) 주문 시전이면, 지면의 영향받는 생물 1명 아래와 인접 칸에 발목 깊이 눈이 쌓입니다. 다음 턴 시작까지 험지. 상호작용으로 제거 가능.", traits:["드루이드", "냉기", "조작", "주문변형"], category:"druid", summary:"다음 행동이 공기/물/냉기 특성(화염 아님) 주문 시전이면, 지면의 영향받는 생물 1명 아래와 인접 칸에 발목 깊이 눈이 쌓입니다.", desc:'<strong>전제조건:</strong> 폭풍 결사. 다음 행동이 공기/물/냉기 특성(화염 아님) 주문 시전이면, 지면의 영향받는 생물 1명 아래와 인접 칸에 발목 깊이 눈이 쌓입니다. 다음 턴 시작까지 <strong>험지</strong>. 상호작용으로 제거 가능.' }
,
  {name_ko:"해류 주문", name_en:"Current Spell", feat_level:6, prerequisites:"", traits:["드루이드", "집중", "주문변형"], category:"druid", summary:"다음 행동이 공기/물 특성 주문 시전이면, 다음 턴 시작까지 AC에 +1 상황 보너스(원거리 공격에 +2). 공기/물 특성 효과에 대한 내성에도 +1 상황 보너스.", desc:'다음 행동이 공기/물 특성 주문 시전이면, 다음 턴 시작까지 <strong>AC에 +1 상황 보너스</strong>(원거리 공격에 +2). 공기/물 특성 효과에 대한 내성에도 <strong>+1 상황 보너스</strong>.' }
,
  {name_ko:"참나무의 관", name_en:"Grown of Oak", feat_level:6, prerequisites:"잎 결사. 피부를 고목의 내구성으로 만듭니다. 참나무 회복력(oaken resilience)을 최고 랭크보다 1 낮은 원시 선천 주문으로 자유롭게 시전 가능(자신과 30피트 내 레시 사역마 대상).", traits:["드루이드"], category:"druid", summary:"피부를 고목의 내구성으로 만듭니다.", desc:'<strong>전제조건:</strong> 잎 결사. 피부를 고목의 내구성으로 만듭니다. <em>참나무 회복력(oaken resilience)</em>을 최고 랭크보다 1 낮은 원시 선천 주문으로 자유롭게 시전 가능(자신과 30피트 내 레시 사역마 대상).' }
,
  {name_ko:"곤충 형태", name_en:"Insect Shape", feat_level:6, prerequisites:"야생 형태. 곤충 형태의 형상들을 야생 형태 목록에 추가. 비비행 곤충 형태(해충 형태)로 변신 시 지속 시간 24시간.", traits:["드루이드"], category:"druid", summary:"곤충 형태의 형상들을 야생 형태 목록에 추가.", desc:'<strong>전제조건:</strong> 야생 형태. 곤충 형태의 형상들을 야생 형태 목록에 추가. 비비행 곤충 형태(해충 형태)로 변신 시 지속 시간 <strong>24시간</strong>.' }
,
  {name_ko:"본능적 지원", name_en:"Instinctive Support", feat_level:6, prerequisites:"동물 동료. 유발 조건: 동물 동료만을 대상으로 하는 비캔트립 주문을 시전합니다. 주문 후 동료가 턴의 행동을 얻으며(동물 명령처럼), 행동 중 하나는 지원(Support)이어야 합니다.", traits:["드루이드"], category:"druid", summary:"주문 후 동료가 턴의 행동을 얻으며(동물 명령처럼), 행동 중 하나는 지원(Support)이어야 합니다.", desc:'<strong>전제조건:</strong> 동물 동료. <strong>유발 조건:</strong> 동물 동료만을 대상으로 하는 비캔트립 주문을 시전합니다. 주문 후 동료가 턴의 행동을 얻으며(동물 명령처럼), 행동 중 하나는 지원(Support)이어야 합니다.' }
,
  {name_ko:"안정된 주문시전", name_en:"Steady Spellcasting", feat_level:6, prerequisites:"", traits:["드루이드"], category:"druid", summary:"반응이 주문시전을 방해하려 하면 DC 15 단순 판정. 성공 시 방해 안 됨.", desc:'반응이 주문시전을 방해하려 하면 <strong>DC 15 단순 판정</strong>. 성공 시 방해 안 됨.' }
,
  {name_ko:"폭풍 보복", name_en:"Storm Retribution", feat_level:6, prerequisites:"폭풍 결사, 폭풍 급습 결사 주문. 유발 조건: 인접한 적이 근접으로 치명타를 가합니다. 요구사항: 집중 포인트 1점 이상. 유발 적에게 폭풍 급습을 시전하고, 반사 내성 실패 시 5피트 밀어냄(대실패 시 10피트). 이동은 강제 이동.", traits:["드루이드"], category:"druid", summary:"요구사항: 집중 포인트 1점 이상.", desc:'<strong>전제조건:</strong> 폭풍 결사, 폭풍 급습 결사 주문. <strong>유발 조건:</strong> 인접한 적이 근접으로 치명타를 가합니다. <strong>요구사항:</strong> 집중 포인트 1점 이상. 유발 적에게 <em>폭풍 급습</em>을 시전하고, 반사 내성 실패 시 <strong>5피트 밀어냄</strong>(대실패 시 10피트). 이동은 강제 이동.' }
,
  {name_ko:"위협적 표시", name_en:"Deimatic Display", feat_level:8, prerequisites:"위협 숙련. 동물 위협 표시를 흉내 냅니다. 위협 판정 1회로 15피트 원뿔 내 모든 동물/균류/식물 생물에게 사기 저하(Demoralize). 시각 특성을 얻고, 볼 수 있는 생물만 영향. 언어 미이해 페널티 없음.", traits:["드루이드"], category:"druid", summary:"동물 위협 표시를 흉내 냅니다.", desc:'<strong>전제조건:</strong> 위협 숙련. 동물 위협 표시를 흉내 냅니다. 위협 판정 1회로 15피트 원뿔 내 모든 동물/균류/식물 생물에게 사기 저하(Demoralize). 시각 특성을 얻고, 볼 수 있는 생물만 영향. 언어 미이해 페널티 없음.' }
,
  {name_ko:"흉포한 형태", name_en:"Ferocious Shape", feat_level:8, prerequisites:"야생 형태. 공룡 형태의 형상들을 야생 형태 목록에 추가. 야생 형태로 운동 수정치를 부여하는 형태 시 운동 판정에 +1 상태 보너스.", traits:["드루이드"], category:"druid", summary:"공룡 형태의 형상들을 야생 형태 목록에 추가.", desc:'<strong>전제조건:</strong> 야생 형태. 공룡 형태의 형상들을 야생 형태 목록에 추가. 야생 형태로 운동 수정치를 부여하는 형태 시 운동 판정에 <strong>+1 상태 보너스</strong>.' }
,
  {name_ko:"페이 소환사", name_en:"Fey Caller", feat_level:8, prerequisites:"", traits:["드루이드"], category:"druid", summary:"페이의 원시 마법 변형 속임수를 배웠습니다. 주문 목록에 환영 변장, 환영 물체, 환영 장면을 추가하며, 원시 주문으로 시전합니다.", desc:'페이의 원시 마법 변형 속임수를 배웠습니다. 주문 목록에 <em>환영 변장, 환영 물체, 환영 장면</em>을 추가하며, 원시 주문으로 시전합니다.' }
,
  {name_ko:"꽃의 회복", name_en:"Floral Restoration", feat_level:8, prerequisites:"잎 결사. 빈도: 하루 1회. 근처 식물에게 활력을 나누어달라고 요청합니다. 집중 포인트 1점과 4d8 HP를 회복합니다. 최소 15평방피트의 건강한 식물이 있는 곳이어야 합니다. 9레벨부터 2레벨마다 치유가 1d8 증가.", traits:["드루이드", "치유", "활력"], category:"druid", summary:"근처 식물에게 활력을 나누어달라고 요청합니다.", desc:'<strong>전제조건:</strong> 잎 결사. <strong>빈도:</strong> 하루 1회. 근처 식물에게 활력을 나누어달라고 요청합니다. <strong>집중 포인트 1점과 4d8 HP를 회복</strong>합니다. 최소 15평방피트의 건강한 식물이 있는 곳이어야 합니다. 9레벨부터 2레벨마다 치유가 1d8 증가.' }
,
  {name_ko:"놀라운 동료", name_en:"Incredible Companion", feat_level:8, prerequisites:"성숙한 동물 동료", traits:["드루이드"], category:"druid", summary:"민첩(민첩+2, 곡예 전문가, 피해+2, 마법 공격, 고급 기동 습득) 또는 야만(힘+2, 운동 전문가, 피해+3, 마법 공격, 고급 기동 습득) 동물 동료로 성장.", desc:'<strong>전제조건:</strong> 성숙한 동물 동료. 민첩 또는 야만 동물 동료로 성장(211페이지).' }
,
  {name_ko:"멘히르 세우기", name_en:"Raise Menhir", feat_level:8, prerequisites:"", traits:["드루이드"], category:"druid", summary:"빈도: 시간당 1회. 30피트 내 빈 칸에 드루이드 기념비(선돌이나 수호수)를 세웁니다(험지). 비전/신성/비학 중 하나를 선택하여 15피트 내 모든 생물이 해당 특성에 +2 상태 보너스를 내성에 얻습니다. 1라운드", desc:'<strong>빈도:</strong> 시간당 1회. 30피트 내 빈 칸에 드루이드 기념비(선돌이나 수호수)를 세웁니다(험지). 비전/신성/비학 중 하나를 선택하여 15피트 내 모든 생물이 해당 특성에 <strong>+2 상태 보너스</strong>를 내성에 얻습니다. <strong>1라운드 지속</strong>, 최대 1분간 유지 가능.' }
,
  {name_ko:"비상 형태", name_en:"Soaring Shape", feat_level:8, prerequisites:"야생 형태. 날개가 지상의 속박에서 해방합니다. 공중 형태의 박쥐와 새 형상을 야생 형태 목록에 추가. 곤충 형태가 있으면 말벌도, 흉포한 형태가 있으면 익룡도 추가. 곡예 수정치를 부여하는 형태 시 곡예에 +1 상태 보너스.", traits:["드루이드"], category:"druid", summary:"날개가 지상의 속박에서 해방합니다.", desc:'<strong>전제조건:</strong> 야생 형태. 날개가 지상의 속박에서 해방합니다. 공중 형태의 박쥐와 새 형상을 야생 형태 목록에 추가. 곤충 형태가 있으면 말벌도, 흉포한 형태가 있으면 익룡도 추가. 곡예 수정치를 부여하는 형태 시 곡예에 <strong>+1 상태 보너스</strong>.' }
,
  {name_ko:"바람 부르기", name_en:"Wind Caller", feat_level:8, prerequisites:"폭풍 결사", traits:["드루이드"], category:"druid", summary:"바람에게 도움을 청합니다.", desc:'<strong>전제조건:</strong> 폭풍 결사. 바람에게 도움을 청합니다. <em>폭풍바람 비행(stormwind flight)</em> 결사 주문(382페이지)을 얻습니다.' }
,
  {name_ko:"원소 형태", name_en:"Elemental Shape", feat_level:10, prerequisites:"야생 형태. 원소 형태의 형상들을 야생 형태 목록에 추가. 야생 형태 변신 중 화염 저항 5.", traits:["드루이드"], category:"druid", summary:"원소 형태의 형상들을 야생 형태 목록에 추가.", desc:'<strong>전제조건:</strong> 야생 형태. 원소 형태의 형상들을 야생 형태 목록에 추가. 야생 형태 변신 중 <strong>화염 저항 5</strong>.' }
,
  {name_ko:"치유적 변신", name_en:"Healing Transformation", feat_level:10, prerequisites:"", traits:["드루이드", "주문변형"], category:"druid", summary:"변신 마법으로 상처를 봉합합니다. 다음 행동이 단일 대상 비캔트립 변신 주문이면, 주문 랭크당 1d6 HP도 회복(치유 효과).", desc:'변신 마법으로 상처를 봉합합니다. 다음 행동이 단일 대상 비캔트립 변신 주문이면, 주문 랭크당 <strong>1d6 HP도 회복</strong>(치유 효과).' }
,
  {name_ko:"압도적 에너지", name_en:"Overwhelming Energy", feat_level:10, prerequisites:"", traits:["드루이드", "조작", "주문변형"], category:"druid", summary:"다음 행동이 주문 시전이면, 대상의 산성/냉기/전기/화염/음파 저항을 레벨만큼 무시합니다(지속 피해와 지속 효과 포함). 면역은 영향 없음.", desc:'다음 주문이 대상의 에너지 <strong>저항을 레벨만큼 무시</strong>합니다. 면역은 무효.' }
,
  {name_ko:"식물 형태", name_en:"Plant Shape", feat_level:10, prerequisites:"잎 결사 또는 야생 형태. 식물 형태의 형상들을 야생 형태 목록에 추가. 변신 중 독 저항 5.", traits:["드루이드"], category:"druid", summary:"식물 형태의 형상들을 야생 형태 목록에 추가.", desc:'<strong>전제조건:</strong> 잎 결사 또는 야생 형태. 식물 형태의 형상들을 야생 형태 목록에 추가. 변신 중 <strong>독 저항 5</strong>.' }
,
  {name_ko:"원시 울음", name_en:"Primal Howl", feat_level:10, prerequisites:"놀라운 동료. 동료가 원시 마법이 실린 울음을 낼 수 있습니다. 30피트 원뿔 내 모든 생물이 동료 레벨 2당 1d6 음파 피해(인내 기본 내성). 실패 시 공포 1, 대실패 시 공포 2.", traits:["드루이드"], category:"druid", summary:"동료가 원시 마법이 실린 울음을 낼 수 있습니다.", desc:'<strong>전제조건:</strong> 놀라운 동료. 동료가 원시 마법이 실린 울음을 낼 수 있습니다. 30피트 원뿔 내 모든 생물이 동료 레벨 2당 1d6 음파 피해(인내 기본 내성). 실패 시 <strong>공포 1</strong>, 대실패 시 <strong>공포 2</strong>.' }
,
  {name_ko:"깨끗한 무기", name_en:"Pristine Weapon", feat_level:10, prerequisites:"푸른 무기. 푸른 무기가 마법 생물의 저항을 관통합니다. 냉철과 은으로 취급. 냉철이나 은 약점 생물에 치명타 시 1d4 지속 출혈 피해.", traits:["드루이드"], category:"druid", summary:"푸른 무기가 마법 생물의 저항을 관통합니다.", desc:'<strong>전제조건:</strong> 푸른 무기. 푸른 무기가 마법 생물의 저항을 관통합니다. <strong>냉철과 은으로 취급</strong>. 냉철이나 은 약점 생물에 치명타 시 <strong>1d4 지속 출혈 피해</strong>.' }
,
  {name_ko:"나란히", name_en:"Side by Side", feat_level:10, prerequisites:"동물 동료. 동료와 함께 같은 적에 인접하면, 실제 위치에 관계없이 서로 측면 공격으로 취급합니다.", traits:["드루이드"], category:"druid", summary:"같은 적에 인접 시 위치에 관계없이 서로 측면 공격.", desc:'<strong>전제조건:</strong> 동물 동료. 같은 적에 인접 시 위치에 관계없이 <strong>서로 측면 공격</strong>.' }
,
  {name_ko:"천둥 주문", name_en:"Thunderclap Spell", feat_level:10, prerequisites:"폭풍 결사. 다음 행동이 전기 특성/전기 피해, 지속 없음, 내성 필요 주문이면, 번개의 충격파가 천둥을 만듭니다. 반사 내성 실패한 생물은 1라운드 청각 상실(deafened), 대실패 시 엎드림(prone)도.", traits:["드루이드", "음파", "주문변형"], category:"druid", summary:"다음 행동이 전기 특성/전기 피해, 지속 없음, 내성 필요 주문이면, 번개의 충격파가 천둥을 만듭니다.", desc:'<strong>전제조건:</strong> 폭풍 결사. 다음 행동이 전기 특성/전기 피해, 지속 없음, 내성 필요 주문이면, 번개의 충격파가 천둥을 만듭니다. 반사 내성 실패한 생물은 <strong>1라운드 청각 상실(deafened)</strong>, 대실패 시 <strong>엎드림(prone)</strong>도.' }
,
  {name_ko:"용 형태", name_en:"Dragon Shape", feat_level:12, prerequisites:"비상 형태. 용 형태의 형상들을 야생 형태 목록에 추가. 변신 중 산성/냉기/전기/화염/독 중 선택한 저항 5.", traits:["드루이드"], category:"druid", summary:"용 형태의 형상들을 야생 형태 목록에 추가.", desc:'<strong>전제조건:</strong> 비상 형태. 용 형태의 형상들을 야생 형태 목록에 추가. 변신 중 산성/냉기/전기/화염/독 중 선택한 <strong>저항 5</strong>.' }
,
  {name_ko:"화환 주문", name_en:"Garland Spell", feat_level:12, prerequisites:"잎 결사. 다음 행동이 균류/식물 특성 주문이면, 사거리 내 10피트 폭발에 식물이 자랍니다. 가시 또는 독덩굴로 험지 + 위험 지형(이동 시 2d6 관통/독 피해, 턴당 1회). 1분 또는 다음 화환 주문까지 지속. 16레벨에 3d6, 20레벨에 4d6.", traits:["드루이드", "조작", "주문변형"], category:"druid", summary:"다음 행동이 균류/식물 특성 주문이면, 사거리 내 10피트 폭발에 식물이 자랍니다.", desc:'<strong>전제조건:</strong> 잎 결사. 다음 행동이 균류/식물 특성 주문이면, 사거리 내 10피트 폭발에 식물이 자랍니다. 가시 또는 독덩굴로 <strong>험지 + 위험 지형</strong>(이동 시 2d6 관통/독 피해, 턴당 1회). 1분 또는 다음 화환 주문까지 지속. 16레벨에 3d6, 20레벨에 4d6.' }
,
  {name_ko:"원시 집중", name_en:"Primal Focus", feat_level:12, prerequisites:"", traits:["드루이드"], category:"druid", summary:"재집중 시 집중 풀을 완전히 채웁니다.", desc:'재집중 시 집중 풀을 <strong>완전히 채웁니다</strong>.' }
,
  {name_ko:"원시 소환", name_en:"Primal Summons", feat_level:12, prerequisites:"야생의 부름", traits:["드루이드"], category:"druid", summary:"아군 소환 시 공기/대지/화염/물의 원소 힘을 부여합니다.", desc:'<strong>전제조건:</strong> 야생의 부름. 아군 소환 시 공기/대지/화염/물의 원소 힘을 부여합니다. <em>원시 소환(primal summons)</em> 결사 주문(381페이지)을 얻습니다.' }
,
  {name_ko:"방랑하는 오아시스", name_en:"Wandering Oasis", feat_level:12, prerequisites:"생존 달인. 위안의 에너지에 둘러싸여 있습니다. 당신과 60피트 내 아군은 극심한 환경 열/추위로부터 보호됩니다. 생존 전설이면 극단적 열/추위에서도.", traits:["드루이드"], category:"druid", summary:"위안의 에너지에 둘러싸여 있습니다.", desc:'<strong>전제조건:</strong> 생존 대가. 위안의 에너지에 둘러싸여 있습니다. 당신과 60피트 내 아군은 <strong>극심한 환경 열/추위로부터 보호</strong>됩니다. 생존 전설이면 극단적 열/추위에서도.' }
,
  {name_ko:"반응적 변신", name_en:"Reactive Transformation", feat_level:14, prerequisites:"야생 형태; 용/원소/식물/비상 형태 중 하나. 위험 시 반사적으로 변신합니다. 유발 조건에 따라 적절한 형태로 야생 형태를 시전합니다(추락→공중 형태, 특정 피해→해당 저항 형태).", traits:["드루이드"], category:"druid", summary:"위험 시 반사적으로 변신합니다.", desc:'<strong>전제조건:</strong> 야생 형태; 용/원소/식물/비상 형태 중 하나. 위험 시 반사적으로 변신합니다. 유발 조건에 따라 적절한 형태로 야생 형태를 시전합니다(추락→공중 형태, 특정 피해→해당 저항 형태).' }
,
  {name_ko:"주문 파종", name_en:"Sow Spell", feat_level:14, prerequisites:"", traits:["드루이드", "집중", "주문변형"], category:"druid", summary:"주문을 씨앗에 접습니다. 다음 행동이 1-2행동 주문 시전이면, 주문이 인접 칸에 심어집니다. 10분 내에 반응으로 싹을 틔워 효과를 발생시킵니다(생물이 주변 칸에 진입 시 유발). 지각 DC = 주문 DC.", desc:'주문을 씨앗에 접습니다. 다음 행동이 1-2행동 주문 시전이면, 주문이 인접 칸에 심어집니다. <strong>10분 내</strong>에 반응으로 싹을 틔워 효과를 발생시킵니다(생물이 주변 칸에 진입 시 유발). 감지 DC = 주문 DC.' }
,
  {name_ko:"전문화된 동료", name_en:"Specialized Companion", feat_level:14, prerequisites:"놀라운 동료. 동물 동료가 전문화 1개를 얻습니다(비무장 공격 전문가, 내성/감지 달인, 민첩+1, 지능+2, 비무장 피해 주사위 +1, 전문화 보너스). 특수: 최대 3회 선택 가능.", traits:["드루이드"], category:"druid", summary:"전문화 1개 추가. 특수: 최대 3회.", desc:'<strong>전제조건:</strong> 놀라운 동료. 전문화 1개 추가. <strong>특수:</strong> 최대 3회.' }
,
  {name_ko:"영원한 자연", name_en:"Timeless Nature", feat_level:14, prerequisites:"", traits:["드루이드"], category:"druid", summary:"원시 마법이 유지하여 노화가 멈춥니다. 질병과 원시 마법에 대한 내성에 +2 상태 보너스.", desc:'원시 마법이 유지하여 노화가 멈춥니다. 질병과 원시 마법에 대한 내성에 <strong>+2 상태 보너스</strong>.' }
,
  {name_ko:"녹색 변태", name_en:"Verdant Metamorphosis", feat_level:14, prerequisites:"잎 결사. 식물 버전의 자신이 되어 식물 특성을 얻고(부적절한 특성 상실). 녹색 휴식(Verdant Rest) 행동을 얻어 나무/식물로 변신(AC 30). 자연 햇빛에서 10분 쉬면 최대 HP의 절반 회복. 이 형태로 일일 휴식하면 최대 HP까지 회복하고 비영구적 소진/기력상실/서투름/멍청함 제거, 19레벨 이하 독/질병도 제거.", traits:["드루이드"], category:"druid", summary:"식물 버전의 자신이 되어 식물 특성을 얻고(부적절한 특성 상실).", desc:'<strong>전제조건:</strong> 잎 결사. 식물 버전의 자신이 되어 <strong>식물 특성</strong>을 얻고(부적절한 특성 상실). 녹색 휴식(Verdant Rest) 행동을 얻어 나무/식물로 변신(AC 30). 자연 햇빛에서 10분 쉬면 최대 HP의 절반 회복. 이 형태로 일일 휴식하면 최대 HP까지 회복하고 비영구적 소진/기력상실/서투름/멍청함 제거, 19레벨 이하 독/질병도 제거.' }
,
  {name_ko:"무의식적 집중", name_en:"Effortless Concentration", feat_level:16, prerequisites:"", traits:["드루이드"], category:"druid", summary:"", desc:'<strong>유발 조건:</strong> 턴 시작. 활성 위자드 주문 1개의 지속 시간을 즉시 연장.' }
,
  {name_ko:"꿰뚫는 가시", name_en:"Impaling Briars", feat_level:16, prerequisites:"잎 결사", traits:["드루이드"], category:"druid", summary:"꿰뚫는 가시(impaling briars) 결사 주문을 얻습니다.", desc:'<strong>전제조건:</strong> 잎 결사. <em>꿰뚫는 가시(impaling briars)</em> 결사 주문(382페이지)을 얻습니다.' }
,
  {name_ko:"괴물 형태", name_en:"Monstrosity Shape", feat_level:16, prerequisites:"야생 형태. 강력한 마법 생물로 변신합니다. 괴물 형태의 동굴벌레와 바다뱀 형상을 야생 형태 목록에 추가. 비상 형태가 있으면 불사조도 추가.", traits:["드루이드"], category:"druid", summary:"강력한 마법 생물로 변신합니다.", desc:'<strong>전제조건:</strong> 야생 형태. 강력한 마법 생물로 변신합니다. 괴물 형태의 동굴벌레와 바다뱀 형상을 야생 형태 목록에 추가. 비상 형태가 있으면 불사조도 추가.' }
,
  {name_ko:"고양의 바람", name_en:"Uplifting Winds", feat_level:16, prerequisites:"폭풍 결사. 비행 중 공기/전기 특성 주문 시전 시, 비행 속도에 +10 상태 보너스를 얻고 즉시 절반 속도까지 비행 가능.", traits:["드루이드"], category:"druid", summary:"비행 중 공기/전기 특성 주문 시전 시, 비행 속도에 +10 상태 보너스를 얻고 즉시 절반 속도까지 비행 가능.", desc:'<strong>전제조건:</strong> 폭풍 결사. 비행 중 공기/전기 특성 주문 시전 시, 비행 속도에 <strong>+10 상태 보너스</strong>를 얻고 즉시 절반 속도까지 비행 가능.' }
,
  {name_ko:"재앙 부르기", name_en:"Invoke Disaster", feat_level:18, prerequisites:"바람 부르기", traits:["드루이드"], category:"druid", summary:"자연의 분노를 적에게 부릅니다.", desc:'<strong>전제조건:</strong> 바람 부르기. 자연의 분노를 적에게 부릅니다. <em>폭풍 군주(storm lord)</em> 결사 주문(382페이지)을 얻습니다.' }
,
  {name_ko:"완벽한 형태 제어", name_en:"Perfect Form Control", feat_level:18, prerequisites:"형태 제어, 근력 +4. 마법과 근육 기억으로 대체 형태를 무기한 유지합니다. 형태 제어 사용 시 야생 형태의 지속 시간이 1시간이 아닌 무제한(해산 가능).", traits:["드루이드"], category:"druid", summary:"마법과 근육 기억으로 대체 형태를 무기한 유지합니다.", desc:'<strong>전제조건:</strong> 형태 제어, 근력 +4. 마법과 근육 기억으로 대체 형태를 무기한 유지합니다. 형태 제어 사용 시 야생 형태의 지속 시간이 1시간이 아닌 <strong>무제한</strong>(해산 가능).' }
,
  {name_ko:"원시 방패", name_en:"Primal Aegis", feat_level:18, prerequisites:"", traits:["드루이드"], category:"druid", summary:"두꺼운 보호적 원시 에너지 장으로 둘러싸입니다. 당신과 30피트 내 아군이 산성/냉기/전기/화염/활력/공허 피해에 지혜 수정치만큼 저항.", desc:'두꺼운 보호적 원시 에너지 장으로 둘러싸입니다. 당신과 30피트 내 아군이 산성/냉기/전기/화염/활력/공허 피해에 <strong>지혜 수정치만큼 저항</strong>.' }
,
  {name_ko:"대사제의 힘", name_en:"Hierophant's Power", feat_level:20, prerequisites:"", traits:["드루이드"], category:"druid", summary:"자연 세계와 얽혀 그 전체 힘이 흐릅니다. 추가 10랭크 주문 슬롯을 얻습니다.", desc:"자연 세계와 얽혀 그 전체 힘이 흐릅니다. <strong>추가 10랭크 주문 슬롯</strong>을 얻습니다." }
,
  {name_ko:"지맥 전도체", name_en:"Ley Line Conduit", feat_level:20, prerequisites:"", traits:["드루이드", "집중", "조작", "주문변형"], category:"druid", summary:"빈도: 분당 1회. 세계의 지맥에서 마법을 끌어옵니다. 다음 행동이 5랭크 이하, 지속 없는 주문 시전이면, 준비된 주문을 소비하지 않습니다.", desc:'<strong>빈도:</strong> 분당 1회. 세계의 지맥에서 마법을 끌어옵니다. 다음 행동이 5랭크 이하, 지속 없는 주문 시전이면, <strong>준비된 주문을 소비하지 않습니다</strong>.' }
,
  {name_ko:"진정한 변신술사", name_en:"True Shapeshifter", feat_level:20, prerequisites:"용 형태, 야생 형태. 형태의 한계를 초월합니다. 하루 1회 자연 화신(nature incarnate)을 준비하지 않았어도 시전하여 카이주로 변신. 식물 형태가 있으면 녹색 남자로도 가능. 진정한 변신(True Shapeshift) 활동도 얻어, 야생 형태 중 목록의 다른 형태로 2행동으로 즉시 변환 가능.", traits:["드루이드", "집중"], category:"druid", summary:"명예, 탐욕, 충성, 또는 순전히 전투의 짜릿함을 위해 싸우는 당신은 무기술과 전투 기법의 논쟁의 여지 없는 달인입니다. 개시 동작, 마무리 타격, 반격의 영리한 조합으로 행동을 연결하며, 적이 방어를 내리는 순간을 놓치지 않습니다. 기사이든, 용병이든, 저격수이든, ", desc:'<strong>전제조건:</strong> 용 형태, 야생 형태. 형태의 한계를 초월합니다. <strong>하루 1회</strong> <em>자연 화신(nature incarnate)</em>을 준비하지 않았어도 시전하여 카이주로 변신. 식물 형태가 있으면 녹색 남자로도 가능. 진정한 변신(True Shapeshift) 활동도 얻어, 야생 형태 중 목록의 다른 형태로 2행동으로 즉시 변환 가능.' }
,
  {name_ko:'대사제의 힘', name_en:'Hierophant\'s Power', feat_level:20, prerequisites:'', traits:['드루이드'], category:'druid', summary:'자연 세계와 얽혀 그 전체 힘이 흐릅니다. 추가 10랭크 주문 슬롯을 얻습니다.', desc:'자연 세계와 얽혀 그 전체 힘이 흐릅니다. <strong>추가 10랭크 주문 슬롯</strong>을 얻습니다.'}
,
  {name_ko:"전투 평가", name_en:"Combat Assessment", feat_level:1, prerequisites:"", traits:["파이터", "비밀"], category:"fighter", summary:"타격을 통해 적의 방어를 평가합니다. 근접 타격을 합니다. 명중 시, GM이 대상의 AC, 내성 굴림, 무기 약점 중 하나에 대한 정보를 줍니다.", desc:'타격을 통해 적의 방어를 평가합니다. 근접 타격을 합니다. 명중 시, GM이 대상의 AC, 내성 굴림, 무기 약점 중 하나에 대한 정보를 줍니다.' }
,
  {name_ko:"이중 베기", name_en:"Double Slice", feat_level:1, prerequisites:"", traits:["파이터", "화려함"], category:"fighter", summary:"요구사항: 각 손에 근접 무기 1개씩.", desc:'<strong>요구사항:</strong> 각 손에 근접 무기 1개씩. 양손으로 동시에 공격합니다. 두 번 타격하되, 두 번째 타격은 다중 공격 페널티 <strong>없이</strong> 합니다. 두 번째 무기의 피해만큼 결합 피해에 추가합니다.' }
,
  {name_ko:"정확한 타격", name_en:"Exacting Strike", feat_level:1, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"신중하게 공격합니다. 근접 타격을 합니다. 빗나가면 이 타격은 다중 공격 페널티에 포함되지 않습니다.", desc:'신중하게 공격합니다. 근접 타격을 합니다. 빗나가면 이 타격은 <strong>다중 공격 페널티에 포함되지 않습니다</strong>.' }
,
  {name_ko:"정밀 사격 자세", name_en:"Point Blank Stance", feat_level:1, prerequisites:"", traits:["파이터", "자세"], category:"fighter", summary:"요구사항: 원거리 무기를 들고 있어야 합니다.", desc:'<strong>요구사항:</strong> 원거리 무기를 들고 있어야 합니다. 근거리에서 무기를 더 치명적으로 사용합니다. 이 자세 중 첫 번째 사거리 증분 내에서 원거리 타격 시, 추가 <strong>피해 주사위 1개</strong>를 더합니다. 사거리가 15피트 이하인 무기를 사용 중이면 피해 유형과 같은 <strong>추가 1 피해</strong>도 추가.' }
,
  {name_ko:"반응적 방패", name_en:"Reactive Shield", feat_level:1, prerequisites:"", traits:["파이터"], category:"fighter", summary:"유발 조건: 적이 당신에게 근접 타격의 명중 굴림을 유발합니다.", desc:'<strong>유발 조건:</strong> 적이 당신에게 근접 타격의 명중 굴림을 유발합니다. 방패를 빠르게 올려 방어합니다. 즉시 <strong>방패 올리기</strong>.' }
,
  {name_ko:"걸림 타격", name_en:"Snagging Strike", feat_level:1, prerequisites:"", traits:["파이터"], category:"fighter", summary:"요구사항: 한 손에 무기, 다른 손은 빈 손.", desc:'<strong>요구사항:</strong> 한 손에 무기, 다른 손은 빈 손. 빈 손으로 적의 갑옷/의복/몸을 잡아 무방비하게 합니다. 근접 타격을 합니다. 명중 시 대상은 다음 턴 시작까지 당신에게 <strong>무방비(off-guard)</strong>.' }
,
  {name_ko:"돌진", name_en:"Sudden Charge", feat_level:1, prerequisites:"", traits:["파이터", "화려함"], category:"fighter", summary:"전력으로 적에게 돌진합니다. 보폭 2회 후 근접 타격을 합니다.", desc:'전력으로 적에게 돌진합니다. <strong>보폭 2회 후 근접 타격</strong>을 합니다.' }
,
  {name_ko:"맹렬한 일격", name_en:"Vicious Swing", feat_level:1, prerequisites:"", traits:["파이터"], category:"fighter", summary:"무기를 가볍게 들어올린 후 무시무시한 힘으로 내려칩니다. 근접 타격을 합니다. 이것은 다중 공격 페널티에 2회 공격으로 포함되지만, 무기 피해 주사위를 1개 추가합니다.", desc:'무기를 가볍게 들어올린 후 무시무시한 힘으로 내려칩니다. 근접 타격을 합니다. 이것은 다중 공격 페널티에 <strong>2회 공격으로 포함</strong>되지만, 무기 피해 주사위를 <strong>1개 추가</strong>합니다.' }
,
  {name_ko:"공격적 막기", name_en:"Aggressive Block", feat_level:2, prerequisites:"", traits:["파이터"], category:"fighter", summary:"방패 막기 사용 시, 잔여 에너지로 적을 밀어냅니다. 방패 막기의 유발 공격자를 5피트 밀거나, 다음 턴 시작까지 무방비하게 할 수 있습니다(선택).", desc:'방패 막기 사용 시, 잔여 에너지로 적을 밀어냅니다. 방패 막기의 유발 공격자를 <strong>5피트 밀거나</strong>, 다음 턴 시작까지 <strong>무방비</strong>하게 할 수 있습니다(선택).' }
,
  {name_ko:"보조 사격", name_en:"Assisting Shot", feat_level:2, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"원거리 타격을 합니다. 명중 시, 대상은 다음 턴 시작까지 다음 공격에 무방비.", desc:'원거리 타격을 합니다. 명중 시, 대상은 다음 턴 시작까지 다음 공격에 <strong>무방비</strong>.' }
,
  {name_ko:"칼날 꺾기", name_en:"Blade Break", feat_level:2, prerequisites:"", traits:["파이터"], category:"fighter", summary:"유발 조건: 적이 근접 타격으로 치명타를 가합니다.", desc:'<strong>유발 조건:</strong> 적이 근접 타격으로 치명타를 가합니다. 장비된 무기나 방패를 희생하여 피해를 줄입니다. 무기/방패가 파괴되지만 피해를 <strong>파괴된 아이템의 경도 × 2만큼 줄입니다</strong>.' }
,
  {name_ko:"야만적 밀치기", name_en:"Brutish Shove", feat_level:2, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"양손 무기의 무게로 적을 뒤로 밉니다. 양손 근접 무기로 타격합니다. 명중 시, 운동 판정 없이 자동으로 5피트 밀기(Shove). 대상은 다음 턴 시작까지 무방비.", desc:'양손 무기의 무게로 적을 뒤로 밉니다. 양손 근접 무기로 타격합니다. 명중 시, 운동 판정 없이 자동으로 <strong>5피트 밀기(Shove)</strong>. 대상은 다음 턴 시작까지 <strong>무방비</strong>.' }
,
  {name_ko:"전투 잡기", name_en:"Combat Grab", feat_level:2, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"요구사항: 한 손에 근접 무기, 빈 손 하나.", desc:'<strong>요구사항:</strong> 한 손에 근접 무기, 빈 손 하나. 근접 타격 후 빈 손으로 적을 <strong>붙잡습니다(grabbed)</strong>. 다음 턴 시작이나 놓기, 강제 이동 시까지 유지.' }
,
  {name_ko:"결투 방어", name_en:"Dueling Parry", feat_level:2, prerequisites:"", traits:["파이터"], category:"fighter", summary:"요구사항: 한 손에 근접 무기 1개, 다른 손은 빈 손.", desc:'<strong>요구사항:</strong> 한 손에 근접 무기 1개, 다른 손은 빈 손. 다음 턴 시작까지 <strong>AC에 +2 상황 보너스</strong>.' }
,
  {name_ko:"위협적 타격", name_en:"Intimidating Strike", feat_level:2, prerequisites:"", traits:["파이터", "감정", "공포", "정신"], category:"fighter", summary:"공격에 물리적 위협을 실어 적을 겁먹게 합니다. 근접 타격을 합니다. 명중하고 피해를 주면 대상은 공포 1(치명타 시 공포 2).", desc:'공격에 물리적 위협을 실어 적을 겁먹게 합니다. 근접 타격을 합니다. 명중하고 피해를 주면 대상은 <strong>공포 1</strong>(치명타 시 공포 2).' }
,
  {name_ko:"번개 교환", name_en:"Lightning Swap", feat_level:2, prerequisites:"", traits:["파이터"], category:"fighter", summary:"유발 조건: 근접 무기로 타격을 합니다(굴리기 전).", desc:'<strong>유발 조건:</strong> 근접 무기로 타격을 합니다(굴리기 전). 즉시 다른 무기로 교환합니다. 유발 타격에 교환한 무기를 사용.' }
,
  {name_ko:"돌진 찌르기", name_en:"Lunge", feat_level:2, prerequisites:"", traits:["파이터"], category:"fighter", summary:"요구사항: 근접 무기.", desc:'<strong>요구사항:</strong> 근접 무기. 적의 도달 끝에서 공격합니다. 이 타격에 도달이 <strong>5피트 증가</strong>합니다. 무기에 해제/밀기/넘어뜨리기 특성이 있으면 해당 행동으로 대체 가능.' }
,
  {name_ko:"도약 던지기", name_en:"Rebounding Toss", feat_level:2, prerequisites:"", traits:["파이터", "화려함"], category:"fighter", summary:"요구사항: 투척 무기.", desc:'<strong>요구사항:</strong> 투척 무기. 투척 원거리 타격을 합니다. 명중 시 무기가 원래 대상에서 10피트 내 다른 적에게 튕깁니다. 두 번째 적에게 추가 타격. 두 공격 모두 다중 공격에 포함되지만 둘 다 한 후 증가.' }
,
  {name_ko:"매끄러운 재배치", name_en:"Sleek Reposition", feat_level:2, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"실패: 대상이 현재 턴 종료까지 무방비.", desc:'<strong>요구사항:</strong> 기교 무기 또는 장창. 이전 공격에서 회복 중인 적의 갑옷/의복/몸을 잡아 옮깁니다. 기교 무기/장창으로 근접 타격. 자신 크기 이하 대상 명중 시 <strong>자동 재배치(Reposition)</strong>(치명타 효과 포함). 도달 무기면 도달 범위 사용.<br><strong>실패:</strong> 대상이 현재 턴 종료까지 무방비.' }
,
  {name_ko:"돌진 충격", name_en:"Barreling Charge", feat_level:4, prerequisites:"운동 숙련. 적의 공간을 통과하며 돌진합니다. 보폭하며 각 적의 인내 DC에 대해 운동 판정. 성공 시 통과, 실패 시 진입 전 정지. 이동 종료 시 근접 타격.", traits:["파이터", "화려함"], category:"fighter", summary:"적의 공간을 통과하며 돌진합니다.", desc:'<strong>전제조건:</strong> 운동 숙련. 적의 공간을 통과하며 돌진합니다. 보폭하며 각 적의 인내 DC에 대해 운동 판정. 성공 시 통과, 실패 시 진입 전 정지. 이동 종료 시 근접 타격.' }
,
  {name_ko:"이중 사격", name_en:"Double Shot", feat_level:4, prerequisites:"", traits:["파이터", "화려함"], category:"fighter", summary:"요구사항: 재장전 0 원거리 무기.", desc:'<strong>요구사항:</strong> 재장전 0 원거리 무기. 눈 깜짝할 사이에 두 발을 쏩니다. 서로 다른 대상에게 <strong>각각 -2 페널티</strong>로 타격 2회. 둘 다 다중 공격에 포함되지만 둘 다 한 후 증가.' }
,
  {name_ko:"양손 공격", name_en:"Dual-Handed Assault", feat_level:4, prerequisites:"", traits:["파이터", "화려함"], category:"fighter", summary:"요구사항: 한 손 근접 무기, 빈 손.", desc:'<strong>요구사항:</strong> 한 손 근접 무기, 빈 손. 빈 손을 잠시 잡아 더 강력한 타격을 합니다. 양손 특성이 없으면 피해 주사위 한 단계 증가, 양손 특성이 있으면 양손 혜택 + 피해 주사위 수만큼 상황 보너스.' }
,
  {name_ko:"이별의 사격", name_en:"Parting Shot", feat_level:4, prerequisites:"", traits:["파이터"], category:"fighter", summary:"요구사항: 장전된 또는 재장전 0 원거리 무기.", desc:'<strong>요구사항:</strong> 장전된 또는 재장전 0 원거리 무기. 뒤로 물러나며 적을 놀라게 하는 빠른 사격. 한 걸음 후 원거리 타격. 대상은 이 공격에 <strong>무방비</strong>.' }
,
  {name_ko:"강력한 밀치기", name_en:"Powerful Shove", feat_level:4, prerequisites:"공격적 막기 또는 야만적 밀치기. 더 큰 적도 밀어낼 수 있습니다. 자신보다 2 크기까지 큰 생물에게 사용 가능. 밀기나 치명 특성으로 밀려난 적이 물체에 멈추면 근력 수정치만큼 피해(최소 1).", traits:["파이터"], category:"fighter", summary:"더 큰 적도 밀어낼 수 있습니다.", desc:'<strong>전제조건:</strong> 공격적 막기 또는 야만적 밀치기. 더 큰 적도 밀어낼 수 있습니다. 자신보다 <strong>2 크기까지 큰 생물</strong>에게 사용 가능. 밀기나 치명 특성으로 밀려난 적이 물체에 멈추면 <strong>근력 수정치만큼 피해</strong>(최소 1).' }
,
  {name_ko:"빠른 반전", name_en:"Quick Reversal", feat_level:4, prerequisites:"", traits:["파이터", "화려함", "압박"], category:"fighter", summary:"요구사항: 최소 2명에게 측면 공격을 받고 있어야.", desc:'<strong>요구사항:</strong> 최소 2명에게 측면 공격을 받고 있어야. 적의 측면 공격을 역이용합니다. 측면 공격하는 적 1명에게 타격 후, 다른 측면 공격 적에게 같은 무기로 <strong>추가 타격</strong>(같은 다중 공격 페널티, 추가 포함 안 됨).' }
,
  {name_ko:"방패 보폭", name_en:"Shielded Stride", feat_level:4, prerequisites:"", traits:["파이터"], category:"fighter", summary:"방패를 올린 상태에서 이동으로 유발되는 반응(반격 타격 등)을 유발하지 않고 절반 속도로 보폭.", desc:'방패를 올린 상태에서 이동으로 유발되는 반응(반격 타격 등)을 유발하지 않고 <strong>절반 속도로 보폭</strong>.' }
,
  {name_ko:"내리찍기", name_en:"Slam Down", feat_level:4, prerequisites:"운동 숙련. 근접 타격을 합니다. 명중하고 피해를 주면, 명중한 생물에게 넘어뜨리기(Trip)를 시도합니다. 양손 근접 무기면 빈 손 요구사항 무시. 두 공격 모두 다중 공격에 포함.", traits:["파이터", "화려함"], category:"fighter", summary:"근접 타격을 합니다. 명중하고 피해를 주면, 명중한 생물에게 넘어뜨리기(Trip)를 시도합니다. 양손 근접 무기면 빈 손 요구사항 무시. 두 공격 모두 다중 공격에 포함.", desc:'<strong>전제조건:</strong> 운동 숙련. 근접 타격을 합니다. 명중하고 피해를 주면, 명중한 생물에게 <strong>넘어뜨리기(Trip)</strong>를 시도합니다. 양손 근접 무기면 빈 손 요구사항 무시. 두 공격 모두 다중 공격에 포함.' }
,
  {name_ko:"일격", name_en:"Swipe", feat_level:4, prerequisites:"", traits:["파이터", "화려함"], category:"fighter", summary:"넓은 호를 그리며 벱니다. 근접 도달 내이고 서로 인접한 최대 2명에게 명중 굴림 결과를 비교합니다. 피해는 한 번만 굴려 각 명중한 생물에 적용. 다중 공격에 2회로 포함. 쓸기(sweep) 특성 무기면 수정치가 모든 공격에 적용.", desc:'넓은 호를 그리며 벱니다. 근접 도달 내이고 서로 인접한 <strong>최대 2명</strong>에게 명중 굴림 결과를 비교합니다. 피해는 한 번만 굴려 각 명중한 생물에 적용. 다중 공격에 2회로 포함. 쓸기(sweep) 특성 무기면 수정치가 모든 공격에 적용.' }
,
  {name_ko:"쌍검 방어", name_en:"Twin Parry", feat_level:4, prerequisites:"", traits:["파이터"], category:"fighter", summary:"각 손의 근접 무기로 방어.", desc:'각 손의 근접 무기로 방어. <strong>AC +1 상황 보너스</strong>(방어 특성이면 +2). 다음 턴 시작까지.' }
,
  {name_ko:"고급 무기 훈련", name_en:"Advanced Weapon Training", feat_level:6, prerequisites:"", traits:["파이터"], category:"fighter", summary:"무기 그룹 하나를 선택합니다. 해당 그룹의 고급 무기를 군용 무기로 취급합니다.", desc:'무기 그룹 하나를 선택합니다. 해당 그룹의 고급 무기를 <strong>군용 무기로 취급</strong>합니다.' }
,
  {name_ko:"유리한 공격", name_en:"Advantageous Assault", feat_level:6, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"붙잡히거나(grabbed), 엎드리거나(prone), 속박된(restrained) 생물에게 타격합니다. 무기 피해 주사위 수만큼 상황 보너스를 피해에 추가(양손이면 +2). 실패 시에도 무기 피해 주사위 수만큼 피해(양손이면 +2).", desc:'붙잡히거나(grabbed), 엎드리거나(prone), 속박된(restrained) 생물에게 타격합니다. 무기 피해 주사위 수만큼 <strong>상황 보너스를 피해에 추가</strong>(양손이면 +2). 실패 시에도 무기 피해 주사위 수만큼 피해(양손이면 +2).' }
,
  {name_ko:"혼미 타격", name_en:"Dazing Blow", feat_level:6, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"대성공: 영향 없음. 성공: 기절(stunned) 1. 실패: 기절 2. 대실패: 기절 3.", desc:'<strong>요구사항:</strong> 생물을 붙잡고 있어야. 붙잡힌 적을 두들겨 기절시킵니다. 붙잡힌 생물에 근접 타격(둔기 피해). 명중 시 클래스 DC에 대해 인내 내성(무력화 효과).<br><strong>대성공:</strong> 영향 없음. <strong>성공:</strong> 기절(stunned) 1. <strong>실패:</strong> 기절 2. <strong>대실패:</strong> 기절 3.' }
,
  {name_ko:"무장 해제 자세", name_en:"Disarming Stance", feat_level:6, prerequisites:"운동 숙련. 요구사항: 한 손 근접 무기 1개, 빈 손. 무장 해제에 +1 상황 보너스, 무장 해제 방어에 +2 상황 보너스. 자신보다 2 크기까지 큰 생물에게 무장 해제 가능.", traits:["파이터", "자세"], category:"fighter", summary:"요구사항: 한 손 근접 무기 1개, 빈 손.", desc:'<strong>전제조건:</strong> 운동 숙련. <strong>요구사항:</strong> 한 손 근접 무기 1개, 빈 손. 무장 해제에 <strong>+1 상황 보너스</strong>, 무장 해제 방어에 <strong>+2 상황 보너스</strong>. 자신보다 2 크기까지 큰 생물에게 무장 해제 가능.' }
,
  {name_ko:"맹렬한 집중", name_en:"Furious Focus", feat_level:6, prerequisites:"맹렬한 일격. 양손 근접 무기로 맹렬한 일격 시 다중 공격에 1회로만 포함(2회 대신).", traits:["파이터"], category:"fighter", summary:"양손 근접 무기로 맹렬한 일격 시 다중 공격에 1회로만 포함(2회 대신).", desc:'<strong>전제조건:</strong> 맹렬한 일격. 양손 근접 무기로 맹렬한 일격 시 다중 공격에 <strong>1회로만 포함</strong>(2회 대신).' }
,
  {name_ko:"수호자의 편향", name_en:"Guardian's Deflection", feat_level:6, prerequisites:"", traits:["파이터"], category:"fighter", summary:"유발 조건: 도달 범위 내 아군이 공격에 명중당하고, +2 상황 보너스가 치명타→명중 또는 명중→빗나감으로 바꿀 수 있을 때.", desc:"<strong>유발 조건:</strong> 도달 범위 내 아군이 공격에 명중당하고, +2 상황 보너스가 치명타→명중 또는 명중→빗나감으로 바꿀 수 있을 때. <strong>요구사항:</strong> 한 손 근접 무기, 빈 손. 무기로 아군의 공격을 편향시켜 <strong>AC +2 상황 보너스</strong>." }
,
  {name_ko:"반사 방패", name_en:"Reflexive Shield", feat_level:6, prerequisites:"", traits:["파이터"], category:"fighter", summary:"방패 올리기 시 반사 내성에도 방패의 상황 보너스를 적용합니다. 방패 막기가 있으면 반사 내성으로 인한 피해에도(물리 피해가 아니어도) 방패 막기 사용 가능.", desc:'방패 올리기 시 반사 내성에도 방패의 <strong>상황 보너스를 적용</strong>합니다. 방패 막기가 있으면 반사 내성으로 인한 피해에도(물리 피해가 아니어도) 방패 막기 사용 가능.' }
,
  {name_ko:"폭로 찌르기", name_en:"Revealing Stab", feat_level:6, prerequisites:"", traits:["파이터"], category:"fighter", summary:"요구사항: 관통 피해가 가능한 근접 무기.", desc:'<strong>요구사항:</strong> 관통 피해가 가능한 근접 무기. 감지할 수 없는 적에게 무기를 박아 위치를 밝힙니다. 은폐 시 단순 판정 불필요, 숨겨진 경우 DC 5. 명중하고 피해를 주면 무기를 대상에 박아 놓아(Release) 위치를 노출.' }
,
  {name_ko:"도탄 자세", name_en:"Ricochet Stance", feat_level:6, prerequisites:"", traits:["파이터", "자세"], category:"fighter", summary:"투척 무기가 즉시 돌아오는 자세를 취합니다. 이 자세 중 둔기/참격 피해의 투척 무기로 원거리 타격 시, 무기가 즉시 손으로 돌아옵니다(사거리 증분 내, 빈 손 필요).", desc:'투척 무기가 사거리 내에서 <strong>즉시 손으로 돌아옵니다</strong>.' }
,
  {name_ko:"방어 파쇄", name_en:"Shatter Defenses", feat_level:6, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"요구사항: 도달 범위 내 겁먹은(frightened) 생물.", desc:'<strong>요구사항:</strong> 도달 범위 내 겁먹은(frightened) 생물. 공포를 이용합니다. 겁먹은 생물에 근접 타격. 명중하고 피해를 주면 공포가 끝날 때까지 <strong>무방비</strong>. 이미 무방비이었으면 다음 턴 시작까지 <strong>공포를 1 미만으로 줄일 수 없습니다</strong>.' }
,
  {name_ko:"방패 수호", name_en:"Shield Warden", feat_level:6, prerequisites:"방패 막기. 방패를 올린 상태에서 인접한 아군에 대한 공격에도 방패 막기를 사용하여 아군의 피해를 줄입니다.", traits:["파이터"], category:"fighter", summary:"방패를 올린 상태에서 인접한 아군에 대한 공격에도 방패 막기를 사용하여 아군의 피해를 줄입니다.", desc:'<strong>전제조건:</strong> 방패 막기. 방패를 올린 상태에서 인접한 아군에 대한 공격에도 <strong>방패 막기를 사용</strong>하여 아군의 피해를 줄입니다.' }
,
  {name_ko:"삼중 사격", name_en:"Triple Shot", feat_level:6, prerequisites:"이중 사격. 이중 사격의 두 타격을 같은 대상에게 할 수 있습니다. 추가 1행동으로 3회 타격도 가능(페널티 -4). 모두 다중 공격에 포함되지만 전부 한 후 증가.", traits:["파이터"], category:"fighter", summary:"이중 사격의 두 타격을 같은 대상에게 할 수 있습니다.", desc:'<strong>전제조건:</strong> 이중 사격. 이중 사격의 두 타격을 <strong>같은 대상에게</strong> 할 수 있습니다. 추가 1행동으로 <strong>3회 타격</strong>도 가능(페널티 -4). 모두 다중 공격에 포함되지만 전부 한 후 증가.' }
,
  {name_ko:'수호자의 편향', name_en:'Guardian\'s Deflection', feat_level:6, prerequisites:'', traits:['파이터'], category:'fighter', summary:'유발 조건: 도달 범위 내 아군이 공격에 명중당하고, +2 상황 보너스가 치명타→명중 또는 명중→빗나감으로 바꿀 수 있을 때. 요구사항: 한 손', desc:'<strong>유발 조건:</strong> 도달 범위 내 아군이 공격에 명중당하고, +2 상황 보너스가 치명타→명중 또는 명중→빗나감으로 바꿀 수 있을 때. <strong>요구사항:</strong> 한 손 근접 무기, 빈 손. 무기로 아군의 공격을 편향시켜 <strong>AC +2 상황 보너스</strong>.'}
,
  {name_ko:"맹공 감지", name_en:"Blind-Fight", feat_level:8, prerequisites:"지각 달인. 전투 본능이 은폐/투명 적을 더 잘 인식합니다. 은폐 시 단순 판정 불필요, 숨겨진 적에게 무방비 아님, DC 5 단순 판정만 필요. 인접한 레벨 이하 미탐지 생물은 숨겨진 것으로 취급.", traits:["파이터"], category:"fighter", summary:"은폐 시 단순 판정 불필요, 숨겨진 적에게 무방비 아님(DC 5), 인접 레벨 이하 미탐지→숨겨진.", desc:'<strong>전제조건:</strong> 감지 대가. 은폐 시 단순 판정 불필요, 숨겨진 적에게 무방비 아님(DC 5), 인접 레벨 이하 미탐지→숨겨진.' }
,
  {name_ko:"혼란의 빈틈", name_en:"Disorienting Opening", feat_level:8, prerequisites:"반격 타격. 반격 타격으로 명중 시 대상이 다음 턴 시작까지 무방비.", traits:["파이터"], category:"fighter", summary:"반격 타격으로 명중 시 대상이 다음 턴 시작까지 무방비.", desc:'<strong>전제조건:</strong> 반격 타격. 반격 타격으로 명중 시 대상이 다음 턴 시작까지 <strong>무방비</strong>.' }
,
  {name_ko:"결투 반격", name_en:"Dueling Riposte", feat_level:8, prerequisites:"결투 방어. 유발 조건: 도달 내 생물이 당신에 대해 타격에 대실패합니다. 요구사항: 결투 방어의 혜택을 받고 있어야. 우아하게 반격합니다. 유발 생물에 근접 타격 또는 무장 해제.", traits:["파이터"], category:"fighter", summary:"요구사항: 결투 방어의 혜택을 받고 있어야.", desc:'<strong>전제조건:</strong> 결투 방어. <strong>유발 조건:</strong> 도달 내 생물이 당신에 대해 타격에 대실패합니다. <strong>요구사항:</strong> 결투 방어의 혜택을 받고 있어야. 우아하게 반격합니다. 유발 생물에 근접 타격 또는 무장 해제.' }
,
  {name_ko:"낙하 타격", name_en:"Felling Strike", feat_level:8, prerequisites:"", traits:["파이터"], category:"fighter", summary:"공격이 비행 중인 적을 추락시킵니다. 타격을 합니다. 명중하고 피해를 주면 비행 대상이 최대 120피트 추락(점진적이므로 지면 충돌 시 추락 피해 없음). 치명타면 다음 턴 종료까지 비행/도약/부유 불가.", desc:'공격이 비행 중인 적을 추락시킵니다. 타격을 합니다. 명중하고 피해를 주면 비행 대상이 <strong>최대 120피트 추락</strong>(점진적이므로 지면 충돌 시 추락 피해 없음). 치명타면 다음 턴 종료까지 <strong>비행/도약/부유 불가</strong>.' }
,
  {name_ko:"놀라운 조준", name_en:"Incredible Aim", feat_level:8, prerequisites:"", traits:["파이터", "집중"], category:"fighter", summary:"잠시 집중하여 정확한 공격. 원거리 타격에 +2 상황 보너스와 대상의 은폐 무시.", desc:'잠시 집중하여 정확한 공격. 원거리 타격에 <strong>+2 상황 보너스</strong>와 대상의 은폐 무시.' }
,
  {name_ko:"기동 사격 자세", name_en:"Mobile Shot Stance", feat_level:8, prerequisites:"", traits:["파이터", "자세"], category:"fighter", summary:"이 자세 중 원거리 타격이 반격 타격이나 원거리 공격으로 유발되는 반응을 유발하지 않습니다. 반격 타격이 있으면 5피트 내에서 장전된 원거리 무기로도 사용 가능.", desc:'이 자세 중 원거리 타격이 반격 타격이나 원거리 공격으로 유발되는 반응을 <strong>유발하지 않습니다</strong>. 반격 타격이 있으면 5피트 내에서 장전된 원거리 무기로도 사용 가능.' }
,
  {name_ko:"위치 공격", name_en:"Positioning Assault", feat_level:8, prerequisites:"", traits:["파이터", "화려함"], category:"fighter", summary:"요구사항: 양손 근접 무기, 도달 내 대상.", desc:'<strong>요구사항:</strong> 양손 근접 무기, 도달 내 대상. 강타로 적을 원하는 위치로 밀어냅니다. 타격 명중 시 대상을 <strong>5피트 재배치</strong>.' }
,
  {name_ko:"빠른 방패 막기", name_en:"Quick Shield Block", feat_level:8, prerequisites:"방패 막기. 각 턴 시작에 방패 막기에만 사용할 수 있는 추가 반응 1회.", traits:["파이터"], category:"fighter", summary:"각 턴 시작에 방패 막기에만 사용할 수 있는 추가 반응 1회.", desc:'<strong>전제조건:</strong> 방패 막기. 각 턴 시작에 방패 막기에만 사용할 수 있는 <strong>추가 반응 1회</strong>.' }
,
  {name_ko:"울려 퍼지는 용기", name_en:"Resounding Bravery", feat_level:8, prerequisites:"용기. 적의 능력에 대한 의지 내성에 대성공하면 1분간 내성에 +1 상태 보너스와 레벨 절반만큼 임시 HP(공포 효과에 대성공이면 두 배).", traits:["파이터"], category:"fighter", summary:"적의 능력에 대한 의지 내성에 대성공하면 1분간 내성에 +1 상태 보너스와 레벨 절반만큼 임시 HP(공포 효과에 대성공이면 두 배).", desc:'<strong>전제조건:</strong> 용기. 적의 능력에 대한 의지 내성에 대성공하면 1분간 내성에 <strong>+1 상태 보너스</strong>와 레벨 절반만큼 <strong>임시 HP</strong>(공포 효과에 대성공이면 두 배).' }
,
  {name_ko:"순간 도약", name_en:"Sudden Leap", feat_level:8, prerequisites:"", traits:["파이터"], category:"fighter", summary:"인상적인 도약과 함께 일격. 도약/높이뛰기/멀리뛰기 중 어느 지점에서든 근접 타격 1회. 타격 직후 공중이면 착지. 도약 높이 이하의 추락은 피해 없이 착지.", desc:'인상적인 도약과 함께 일격. 도약/높이뛰기/멀리뛰기 중 어느 지점에서든 <strong>근접 타격 1회</strong>. 타격 직후 공중이면 착지. 도약 높이 이하의 추락은 피해 없이 착지.' }
,
  {name_ko:"민첩 은혜", name_en:"Agile Grace", feat_level:10, prerequisites:"", traits:["파이터"], category:"fighter", summary:"민첩 무기의 다중 공격 페널티가 2번째 -3, 이후 -6(일반 -4/-8 대신).", desc:'민첩 무기의 다중 공격 페널티가 2번째 -3, 이후 <strong>-6</strong>(일반 -4/-8 대신).' }
,
  {name_ko:"확실한 타격", name_en:"Certain Strike", feat_level:10, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"빗나가도 스치는 타격. 근접 타격을 합니다. 실패 시에도 피해 주사위를 제외한 피해를 줍니다(무기 룬, 주문, 특수 능력의 주사위도 제외).", desc:'빗나가도 스치는 타격. 근접 타격을 합니다. <strong>실패 시에도</strong> 피해 주사위를 제외한 피해를 줍니다(무기 룬, 주문, 특수 능력의 주사위도 제외).' }
,
  {name_ko:"내리찍기 강화", name_en:"Crashing Slam", feat_level:10, prerequisites:"내리찍기. 내리찍기 사용 시, 타격 대신 넘어뜨리기(Trip)를 할 때, 타격 1회를 시도할 수 있습니다. 명중하면 넘어뜨리기 판정 대신 자동으로 넘어뜨리기 대성공 효과를 적용. 양손 근접 무기면 넘어뜨리기 피해에 무기의 피해 주사위 크기를 사용.", traits:["파이터"], category:"fighter", summary:"내리찍기 사용 시, 타격 대신 넘어뜨리기(Trip)를 할 때, 타격 1회를 시도할 수 있습니다.", desc:'<strong>전제조건:</strong> 내리찍기. 내리찍기 사용 시, 타격 대신 넘어뜨리기(Trip)를 할 때, 타격 1회를 시도할 수 있습니다. 명중하면 넘어뜨리기 판정 대신 자동으로 <strong>넘어뜨리기 대성공</strong> 효과를 적용. 양손 근접 무기면 넘어뜨리기 피해에 무기의 피해 주사위 크기를 사용.' }
,
  {name_ko:"공중 요격", name_en:"Cut from the Air", feat_level:10, prerequisites:"", traits:["파이터"], category:"fighter", summary:"유발 조건: 물리적 원거리 타격의 대상이 됩니다.", desc:'<strong>유발 조건:</strong> 물리적 원거리 타격의 대상이 됩니다. <strong>요구사항:</strong> 공격을 인지하고, 무방비이 아니며, 빈 손이나 근접 무기가 있어야. 원거리 공격을 쳐냅니다. 유발 공격에 대해 <strong>AC +4 상황 보너스</strong>. 빗나가면 공중에서 쳐낸 것.' }
,
  {name_ko:"무력화 사격", name_en:"Debilitating Shot", feat_level:10, prerequisites:"", traits:["파이터", "화려함"], category:"fighter", summary:"약점을 겨냥하여 정밀 사격. 원거리 타격. 명중하고 피해를 주면 대상이 다음 턴 종료까지 느려짐(slowed) 1.", desc:'약점을 겨냥하여 정밀 사격. 원거리 타격. 명중하고 피해를 주면 대상이 다음 턴 종료까지 <strong>느려짐(slowed) 1</strong>.' }
,
  {name_ko:"무장 해제 비틀기", name_en:"Disarming Twist", feat_level:10, prerequisites:"운동 숙련. 요구사항: 한 손 근접 무기, 빈 손. 한 손 근접 무기로 타격. 무장 해제의 성공/대성공 효과도 적용. 실패 시에도 대상이 턴 종료까지 무방비. 무장 해제 자세 중이면 공격에 +1 상황 보너스.", traits:["파이터", "압박"], category:"fighter", summary:"요구사항: 한 손 근접 무기, 빈 손.", desc:'<strong>전제조건:</strong> 운동 숙련. <strong>요구사항:</strong> 한 손 근접 무기, 빈 손. 한 손 근접 무기로 타격. 무장 해제의 성공/대성공 효과도 적용. 실패 시에도 대상이 턴 종료까지 무방비. 무장 해제 자세 중이면 공격에 +1 상황 보너스.' }
,
  {name_ko:"방해 자세", name_en:"Disruptive Stance", feat_level:10, prerequisites:"", traits:["파이터", "자세"], category:"fighter", summary:"이 자세 중, 도달 내 생물이 집중(concentrate) 행동을 사용할 때도 반격 타격을 사용할 수 있습니다. 또한 타격 명중(치명타뿐 아니라)으로도 집중/조작 행동을 방해합니다.", desc:'이 자세 중, 도달 내 생물이 <strong>집중(concentrate) 행동</strong>을 사용할 때도 반격 타격을 사용할 수 있습니다. 또한 타격 명중(치명타뿐 아니라)으로도 집중/조작 행동을 <strong>방해</strong>합니다.' }
,
  {name_ko:"공포의 야수", name_en:"Fearsome Brute", feat_level:10, prerequisites:"", traits:["파이터"], category:"fighter", summary:"겁먹은 적에게 타격 시 공포 수치 × 2만큼 상황 보너스를 피해에 추가. 위협 달인이면 × 3.", desc:'겁먹은 적에게 타격 시 <strong>공포 수치 × 2만큼 상황 보너스를 피해에 추가</strong>. 위협 대가이면 × 3.' }
,
  {name_ko:"투척 돌진", name_en:"Flinging Charge", feat_level:10, prerequisites:"", traits:["파이터", "화려함"], category:"fighter", summary:"투척 무기를 던져 주의를 분산시키고 돌진합니다. 보폭 2회(중간에 투척 타격 1회). 명중 시 대상이 현재 턴의 다음 근접 공격에 무방비.", desc:'투척 무기를 던져 주의를 분산시키고 돌진합니다. 보폭 2회(중간에 투척 타격 1회). 명중 시 대상이 현재 턴의 다음 근접 공격에 <strong>무방비</strong>.' }
,
  {name_ko:"거울 방패", name_en:"Mirror Shield", feat_level:10, prerequisites:"", traits:["파이터"], category:"fighter", summary:"유발 조건: 주문 공격이 당신의 AC에 대해 대실패합니다.", desc:'<strong>유발 조건:</strong> 주문 공격이 당신의 AC에 대해 대실패합니다. <strong>요구사항:</strong> 방패를 올린 상태. 주문을 시전자에게 반사합니다. 가장 높은 원거리 무기 숙련도로 원거리 공격(또는 주문 공격). 성공 시 시전자가 자기 주문의 성공 효과를 받습니다(치명타면 대성공 효과).' }
,
  {name_ko:"압도적 돌진", name_en:"Overpowering Charge", feat_level:10, prerequisites:"돌진 충격. 돌진 충격으로 적의 공간을 성공적으로 통과하면 근력 수정치만큼 둔기 피해(대성공 시 두 배 + 다음 턴까지 무방비).", traits:["파이터"], category:"fighter", summary:"돌진 충격으로 적의 공간을 성공적으로 통과하면 근력 수정치만큼 둔기 피해(대성공 시 두 배 + 다음 턴까지 무방비).", desc:'<strong>전제조건:</strong> 돌진 충격. 돌진 충격으로 적의 공간을 성공적으로 통과하면 <strong>근력 수정치만큼 둔기 피해</strong>(대성공 시 두 배 + 다음 턴까지 무방비).' }
,
  {name_ko:"전술적 반사", name_en:"Tactical Reflexes", feat_level:10, prerequisites:"", traits:["파이터"], category:"fighter", summary:"각 턴 시작에 반격 타격에만 사용할 수 있는 추가 반응 1회.", desc:'각 턴 시작에 반격 타격에만 사용할 수 있는 <strong>추가 반응 1회</strong>.' }
,
  {name_ko:"쌍검 반격", name_en:"Twin Riposte", feat_level:10, prerequisites:"", traits:["파이터"], category:"fighter", summary:"요구사항: 쌍검 방어 혜택 중.", desc:'<strong>전제조건:</strong> 쌍검 방어. <strong>유발 조건:</strong> 도달 내 생물이 대실패. <strong>요구사항:</strong> 쌍검 방어 혜택 중. 근접 타격 또는 무장 해제.' }
,
  {name_ko:"잔혹한 마무리", name_en:"Brutal Finish", feat_level:12, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"요구사항: 양손 근접 무기.", desc:'<strong>요구사항:</strong> 양손 근접 무기. 마지막 일격. 양손 근접 무기로 타격 후 <strong>턴이 종료</strong>됩니다. 무기 피해 주사위 1개 추가(18레벨 이상이면 2개). 실패 시에도 무기 피해 주사위 1개만큼 피해(18레벨이면 2개).' }
,
  {name_ko:"질주 타격", name_en:"Dashing Strike", feat_level:12, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"요구사항: 적에 인접.", desc:'<strong>요구사항:</strong> 적에 인접. 한 적에서 빠져나와 다른 적을 타격. 이동 속도까지 보폭(다른 적의 근접 도달 내에서 종료 필요). 이동 종료 시 근접 타격.' }
,
  {name_ko:"결투의 춤", name_en:"Dueling Dance", feat_level:12, prerequisites:"결투 방어. 요구사항: 한 손 근접 무기, 빈 손. 이 자세 중 항상 결투 방어의 혜택을 받습니다.", traits:["파이터", "자세"], category:"fighter", summary:"요구사항: 한 손 근접 무기, 빈 손.", desc:'<strong>전제조건:</strong> 결투 방어. <strong>요구사항:</strong> 한 손 근접 무기, 빈 손. 이 자세 중 항상 <strong>결투 방어의 혜택</strong>을 받습니다.' }
,
  {name_ko:"투척 밀기", name_en:"Flinging Shove", feat_level:12, prerequisites:"공격적 막기 또는 야만적 밀치기. 밀기 거리가 성공 시 10피트, 대성공 시 20피트로 증가. 공격적 막기에서 무방비 또는 밀기 선택 가능. 야만적 밀치기 실패 시에도 5피트 밀기.", traits:["파이터"], category:"fighter", summary:"밀기 거리가 성공 시 10피트, 대성공 시 20피트로 증가.", desc:'<strong>전제조건:</strong> 공격적 막기 또는 야만적 밀치기. 밀기 거리가 성공 시 <strong>10피트</strong>, 대성공 시 <strong>20피트</strong>로 증가. 공격적 막기에서 무방비 또는 밀기 선택 가능. 야만적 밀치기 실패 시에도 <strong>5피트 밀기</strong>.' }
,
  {name_ko:"향상된 결투 반격", name_en:"Improved Dueling Riposte", feat_level:12, prerequisites:"결투 반격. 결투 방어의 혜택 없이도 결투 반격 사용 가능. 각 턴 시작에 결투 반격에만 사용할 수 있는 추가 반응 1회.", traits:["파이터"], category:"fighter", summary:"결투 방어의 혜택 없이도 결투 반격 사용 가능.", desc:'<strong>전제조건:</strong> 결투 반격. 결투 방어의 혜택 없이도 결투 반격 사용 가능. 각 턴 시작에 결투 반격에만 사용할 수 있는 <strong>추가 반응 1회</strong>.' }
,
  {name_ko:"놀라운 도탄", name_en:"Incredible Ricochet", feat_level:12, prerequisites:"놀라운 조준. 이번 턴에 이전에 공격한 생물에 원거리 타격. 대상의 은폐와 모든 엄폐를 무시합니다.", traits:["파이터", "집중", "압박"], category:"fighter", summary:"이번 턴에 이전에 공격한 생물에 원거리 타격.", desc:'<strong>전제조건:</strong> 놀라운 조준. 이번 턴에 이전에 공격한 생물에 원거리 타격. 대상의 <strong>은폐와 모든 엄폐를 무시</strong>합니다.' }
,
  {name_ko:"돌진 자세", name_en:"Lunging Stance", feat_level:12, prerequisites:"돌진 찌르기, 반격 타격. 요구사항: 근접 무기. 이 자세 중, 도달 밖이지만 돌진 찌르기 도달 내인 생물에게도 반격 타격을 사용 가능(도달 5피트 증가).", traits:["파이터", "자세"], category:"fighter", summary:"요구사항: 근접 무기.", desc:'<strong>전제조건:</strong> 돌진 찌르기, 반격 타격. <strong>요구사항:</strong> 근접 무기. 이 자세 중, 도달 밖이지만 돌진 찌르기 도달 내인 생물에게도 <strong>반격 타격</strong>을 사용 가능(도달 5피트 증가).' }
,
  {name_ko:"모범의 수비", name_en:"Paragon's Guard", feat_level:12, prerequisites:"", traits:["파이터", "자세"], category:"fighter", summary:"요구사항: 방패를 들고 있어야.", desc:"<strong>요구사항:</strong> 방패를 들고 있어야. 이 자세 중 항상 방패가 <strong>올려진 상태</strong>로 취급됩니다(방패 올리기 행동 불필요)." }
,
  {name_ko:'모범의 수비', name_en:'Paragon\'s Guard', feat_level:12, prerequisites:'', traits:['파이터'], category:'fighter', summary:'요구사항: 방패를 들고 있어야. 이 자세 중 항상 방패가 올려진 상태로 취급됩니다(방패 올리기 행동 불필요).', desc:'<strong>요구사항:</strong> 방패를 들고 있어야. 이 자세 중 항상 방패가 <strong>올려진 상태</strong>로 취급됩니다(방패 올리기 행동 불필요).'}
,
  {name_ko:"필사적 마무리", name_en:"Desperate Finisher", feat_level:14, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"유발 조건: 턴의 마지막 행동을 완료하고 턴이 아직 종료되지 않았습니다.", desc:'<strong>유발 조건:</strong> 턴의 마지막 행동을 완료하고 턴이 아직 종료되지 않았습니다. 모든 것을 마지막 무모한 압박에 쏟습니다. 압박 특성의 행동 1개를 사용합니다. 다음 턴 시작까지 <strong>반응 사용 불가</strong>. 평소대로 다중 공격 페널티 적용.' }
,
  {name_ko:"결의", name_en:"Determination", feat_level:14, prerequisites:"", traits:["파이터", "집중"], category:"fighter", summary:"빈도: 하루 1회. 적의 주문과 상태를 털어냅니다. 비영구적 상태/주문/마법 효과 1개를 선택합니다. 상태이면 종료, 주문이면 상쇄 시도(랭크 = 레벨 절반 올림, 의지 내성으로 상쇄 판정).", desc:'<strong>빈도:</strong> 하루 1회. 적의 주문과 상태를 털어냅니다. 비영구적 상태/주문/마법 효과 1개를 선택합니다. 상태이면 종료, 주문이면 상쇄 시도(랭크 = 레벨 절반 올림, 의지 내성으로 상쇄 판정).' }
,
  {name_ko:"안내하는 마무리", name_en:"Guiding Finish", feat_level:14, prerequisites:"", traits:["파이터", "압박"], category:"fighter", summary:"요구사항: 한 손 근접 무기, 빈 손.", desc:'<strong>요구사항:</strong> 한 손 근접 무기, 빈 손. 무기를 지렛대로 사용하여 적을 원하는 곳으로 밀어냅니다. 한 손 근접 타격. 명중 시 <strong>최대 10피트 재배치</strong>(자신의 공간 통과 가능). 실패 시에도 5피트 재배치.' }
,
  {name_ko:"안내하는 반격", name_en:"Guiding Riposte", feat_level:14, prerequisites:"결투 반격. 결투 반격으로 타격 명중 시 최대 10피트 재배치.", traits:["파이터"], category:"fighter", summary:"결투 반격으로 타격 명중 시 최대 10피트 재배치.", desc:'<strong>전제조건:</strong> 결투 반격. 결투 반격으로 타격 명중 시 <strong>최대 10피트 재배치</strong>.' }
,
  {name_ko:"향상된 쌍검 반격", name_en:"Improved Twin Riposte", feat_level:14, prerequisites:"쌍검 반격. 쌍검 방어 없이도 사용 가능. 각 턴 시작에 쌍검 반격 전용 추가 반응 1회.", traits:["파이터"], category:"fighter", summary:"각 턴 시작에 쌍검 반격 전용 추가 반응 1회.", desc:'<strong>전제조건:</strong> 쌍검 반격. 각 턴 시작에 쌍검 반격 전용 <strong>추가 반응 1회</strong>. 쌍검 방어 없이도 사용 가능.' }
,
  {name_ko:"개시 자세", name_en:"Opening Stance", feat_level:14, prerequisites:"", traits:["파이터"], category:"fighter", summary:"유발 조건: 주도권을 굴립니다.", desc:'<strong>유발 조건:</strong> 주도권을 굴립니다. 위험의 첫 징후에 자세에 들어갑니다. 자세 특성의 <strong>행동 1개를 사용</strong>합니다.' }
,
  {name_ko:"이중 무기 난무", name_en:"Two-Weapon Flurry", feat_level:14, prerequisites:"", traits:["파이터", "화려함", "압박"], category:"fighter", summary:"요구사항: 각 손에 무기 1개씩.", desc:'<strong>요구사항:</strong> 각 손에 무기 1개씩. 이전 공격의 모멘텀으로 두 무기를 갑자기 휘두릅니다. <strong>각 무기로 1회씩 타격</strong>합니다.' }
,
  {name_ko:"회오리 타격", name_en:"Whirlwind Strike", feat_level:14, prerequisites:"", traits:["파이터", "화려함"], category:"fighter", summary:"흐릿한 동작으로 근접 도달 내 모든 적에게 타격. 각 공격이 다중 공격에 포함되지만 전부 한 후에만 증가.", desc:'흐릿한 동작으로 근접 도달 내 <strong>모든 적에게 타격</strong>. 각 공격이 다중 공격에 포함되지만 전부 한 후에만 증가.' }
,
  {name_ko:"우아한 자세", name_en:"Graceful Poise", feat_level:16, prerequisites:"이중 베기. 이 자세 중 이중 베기의 두 번째 타격을 민첩 무기로 하면 다중 공격에 1회로만 포함.", traits:["파이터", "자세"], category:"fighter", summary:"이 자세 중 이중 베기의 두 번째 타격을 민첩 무기로 하면 다중 공격에 1회로만 포함.", desc:'<strong>전제조건:</strong> 이중 베기. 이 자세 중 이중 베기의 두 번째 타격을 민첩 무기로 하면 다중 공격에 <strong>1회로만 포함</strong>.' }
,
  {name_ko:"향상된 반사 방패", name_en:"Improved Reflexive Shield", feat_level:16, prerequisites:"반사 방패. 반사 내성 피해에 방패 막기 사용 시, 같은 효과에 대한 인접 아군도 피해 감소 혜택.", traits:["파이터"], category:"fighter", summary:"반사 내성 피해에 방패 막기 사용 시, 같은 효과에 대한 인접 아군도 피해 감소 혜택.", desc:'<strong>전제조건:</strong> 반사 방패. 반사 내성 피해에 방패 막기 사용 시, 같은 효과에 대한 <strong>인접 아군도 피해 감소 혜택</strong>.' }
,
  {name_ko:"다양한 양식의 달인", name_en:"Master of Many Styles", feat_level:16, prerequisites:"개시 자세. 유발 조건: 턴 시작. 자세 사이를 유연하게 전환합니다. 자세 특성의 행동 1개를 사용합니다.", traits:["파이터"], category:"fighter", summary:"자세 사이를 유연하게 전환합니다.", desc:'<strong>전제조건:</strong> 개시 자세. <strong>유발 조건:</strong> 턴 시작. 자세 사이를 유연하게 전환합니다. 자세 특성의 행동 1개를 사용합니다.' }
,
  {name_ko:"연속 사격 자세", name_en:"Multishot Stance", feat_level:16, prerequisites:"이중 사격. 요구사항: 재장전 0 원거리 무기. 이 자세 중 이중 사격의 페널티가 -1로 감소. 위치에서 이동하면 자세 종료. 삼중 사격이 있으면 3회 타격 시 -2.", traits:["파이터", "자세"], category:"fighter", summary:"요구사항: 재장전 0 원거리 무기.", desc:'<strong>전제조건:</strong> 이중 사격. <strong>요구사항:</strong> 재장전 0 원거리 무기. 이 자세 중 이중 사격의 페널티가 <strong>-1</strong>로 감소. 위치에서 이동하면 자세 종료. 삼중 사격이 있으면 3회 타격 시 -2.' }
,
  {name_ko:"압도적 일격", name_en:"Overwhelming Blow", feat_level:16, prerequisites:"", traits:["파이터"], category:"fighter", summary:"전체 체중을 실은 강력한 공격. 근접 타격(다중 공격에 3회로 포함). 명중 시 자동 치명타. 치명타 굴림이면 무기가 치명적(deadly) d12 특성도 추가. 명중 여부와 관계없이 기절(stunned) 1과 다음 턴 시작까지 무방비.", desc:'전체 체중을 실은 강력한 공격. 근접 타격(다중 공격에 3회로 포함). 명중 시 <strong>자동 치명타</strong>. 치명타 굴림이면 무기가 <strong>치명적(deadly) d12</strong> 특성도 추가. 명중 여부와 관계없이 <strong>기절(stunned) 1</strong>과 다음 턴 시작까지 <strong>무방비</strong>.' }
,
  {name_ko:"쌍검 수비", name_en:"Twinned Defense", feat_level:16, prerequisites:"쌍검 방어. 요구사항: 각 손에 근접 무기. 이 자세 중 항상 쌍검 방어의 혜택.", traits:["파이터", "자세"], category:"fighter", summary:"요구사항: 각 손에 근접 무기.", desc:'<strong>전제조건:</strong> 쌍검 방어. <strong>요구사항:</strong> 각 손에 근접 무기. 이 자세 중 항상 <strong>쌍검 방어의 혜택</strong>.' }
,
  {name_ko:"불가능한 일제사격", name_en:"Impossible Volley", feat_level:18, prerequisites:"", traits:["파이터", "화려함"], category:"fighter", summary:"요구사항: 살포+재장전 0 원거리 무기.", desc:'<strong>요구사항:</strong> 살포+재장전 0 원거리 무기. 살포 사거리 이상 중심의 10피트 폭발 내 모든 적에게 <strong>-2 페널티로 타격</strong>. 피해 1회만. 다중 공격에 포함되지만 전부 후 증가.' }
,
  {name_ko:"야만적 치명타", name_en:"Savage Critical", feat_level:18, prerequisites:"", traits:["파이터"], category:"fighter", summary:"전설 숙련도 무기/비무장 공격으로 주사위 19를 굴리면 결과가 성공인 한 자동 치명 성공. 19가 실패라면 효과 없음.", desc:'전설 숙련도 무기/비무장 공격으로 <strong>주사위 19</strong>를 굴리면 결과가 성공인 한 <strong>자동 치명 성공</strong>. 19가 실패라면 효과 없음.' }
,
  {name_ko:"공중 격파", name_en:"Smash from the Air", feat_level:18, prerequisites:"공중 요격. 원거리 주문 공격에 대해서도 공중 요격을 사용할 수 있습니다.", traits:["파이터"], category:"fighter", summary:"원거리 주문 공격에 대해서도 공중 요격을 사용할 수 있습니다.", desc:'<strong>전제조건:</strong> 공중 요격. <strong>원거리 주문 공격</strong>에 대해서도 공중 요격을 사용할 수 있습니다.' }
,
  {name_ko:"무한 반격", name_en:"Boundless Reprisals", feat_level:20, prerequisites:"", traits:["파이터"], category:"fighter", summary:"전투의 흐름에 대한 육감으로 어떤 상황에도 반응합니다. 각 적의 턴 시작에 추가 반응 1회(해당 턴 동안만, 파이터 재주나 클래스 요소의 반응에만 사용).", desc:'전투의 흐름에 대한 육감으로 어떤 상황에도 반응합니다. 각 <strong>적의 턴 시작에 추가 반응 1회</strong>(해당 턴 동안만, 파이터 재주나 클래스 특성의 반응에만 사용).' }
,
  {name_ko:"궁극의 유연성", name_en:"Ultimate Flexibility", feat_level:20, prerequisites:"향상된 유연성. 전투 유연성으로 3개 재주를 얻습니다(8레벨 이하 1개, 14레벨 이하 1개, 18레벨 이하 1개). 서로의 전제조건 충족 가능. 1시간 훈련으로 전투 유연성 재주를 재선택할 수 있습니다.", traits:["파이터"], category:"fighter", summary:"전투 유연성으로 3개 특기를 얻습니다(8레벨 이하 1개, 14레벨 이하 1개, 18레벨 이하 1개).", desc:'<strong>전제조건:</strong> 향상된 유연성. 전투 유연성으로 <strong>3개 재주</strong>를 얻습니다(8레벨 이하 1개, 14레벨 이하 1개, 18레벨 이하 1개). 서로의 전제조건 충족 가능. 1시간 훈련으로 전투 유연성 재주를 재선택할 수 있습니다.' }
,
  {name_ko:"무기 지배", name_en:"Weapon Supremacy", feat_level:20, prerequisites:"", traits:["파이터"], category:"fighter", summary:"무기 기술이 현실 법칙을 구부립니다. 영구적으로 빠른(quickened) 상태. 추가 행동은 타격에만 사용 가능.", desc:'무기 기술이 현실 법칙을 구부립니다. <strong>영구적으로 빠른(quickened)</strong> 상태. 추가 행동은 <strong>타격에만</strong> 사용 가능.' }
,
  {name_ko:"동물 동료", name_en:"Animal Companion", feat_level:1, prerequisites:"", traits:["레인저"], category:"ranger", summary:"동물 동료를 얻습니다.", desc:'동물 동료를 얻습니다(206페이지).' }
,
  {name_ko:"석궁 에이스", name_en:"Crossbow Ace", feat_level:1, prerequisites:"", traits:["레인저"], category:"ranger", summary:"석궁에 능숙합니다. 장전된 석궁을 들고 사냥감 추적을 사용하면, 다음 사냥감 대상 타격 시 추가 피해 2(반복 석궁은 추가 피해 1). 석궁의 재장전 시간을 1만큼 줄입니다(최소 0).", desc:'석궁에 능숙합니다. 장전된 석궁을 들고 사냥감 추적을 사용하면, 다음 사냥감 대상 타격 시 <strong>추가 피해 2</strong>(반복 석궁은 추가 피해 1). 석궁의 재장전 시간을 1만큼 줄입니다(최소 0).' }
,
  {name_ko:"연속 사냥", name_en:"Hunted Shot", feat_level:1, prerequisites:"", traits:["레인저", "화려함"], category:"ranger", summary:"요구사항: 재장전 0 원거리 무기.", desc:'<strong>요구사항:</strong> 재장전 0 원거리 무기. 사냥감에게 빠르게 두 발을 쏩니다. 사냥감에 대해 <strong>원거리 타격 2회</strong>(첫 번째 사거리 증분 내만). 두 공격 모두 다중 공격에 포함되지만 둘 다 후 증가.' }
,
  {name_ko:"입문 관리인", name_en:"Initiate Warden", feat_level:1, prerequisites:"", traits:["레인저"], category:"ranger", summary:"원시 마법과의 연결이 관리인 주문에 접근을 부여합니다. 입문 관리인 주문 1개를 선택합니다. 집중 풀 1점을 얻습니다.", desc:'원시 마법과의 연결이 관리인 주문에 접근을 부여합니다. 입문 관리인 주문 1개를 선택합니다(383페이지). <strong>집중 풀 1점</strong>을 얻습니다.' }
,
  {name_ko:"괴물 사냥꾼", name_en:"Monster Hunter", feat_level:1, prerequisites:"", traits:["레인저"], category:"ranger", summary:"강한 사냥감에 대한 지식을 축적합니다. 사냥감에 대해 지식 회상에 성공하면(첫 1회/사냥감), 당신과 모든 아군이 해당 사냥감의 약점이나 저항 중 하나에 대해 알게 됩니다. 대성공하면 당신과 아군이 다음 내성 굴림에 +1 상황 보너스와 다음 공격에 +1 상황 보너스.", desc:'강한 사냥감에 대한 지식을 축적합니다. 사냥감에 대해 <strong>지식 회상에 성공하면</strong>(첫 1회/사냥감), 당신과 모든 아군이 해당 사냥감의 약점이나 저항 중 하나에 대해 알게 됩니다. <strong>대성공</strong>하면 당신과 아군이 다음 내성 굴림에 <strong>+1 상황 보너스</strong>와 다음 공격에 <strong>+1 상황 보너스</strong>.' }
,
  {name_ko:"쌍둥이 격추", name_en:"Twin Takedown", feat_level:1, prerequisites:"", traits:["레인저", "화려함"], category:"ranger", summary:"요구사항: 각 손에 근접 무기 1개씩.", desc:'<strong>요구사항:</strong> 각 손에 근접 무기 1개씩. 사냥감에게 두 무기로 즉시 공격합니다. 사냥감에 대해 <strong>각 무기로 타격 1회씩</strong>. 두 공격 모두 다중 공격에 포함되지만 둘 다 후 증가.' }
,
  {name_ko:"동물 공감", name_en:"Animal Empathy", feat_level:2, prerequisites:"", traits:["레인저"], category:"ranger", summary:"동물에게 외교를 사용하여 인상 만들기와 간단한 요청 가능.", desc:'동물에게 외교를 사용하여 인상 만들기와 간단한 요청 가능.' }
,
  {name_ko:"선호 지형", name_en:"Favored Terrain", feat_level:2, prerequisites:"", traits:["레인저"], category:"ranger", summary:"특정 지형을 선택합니다(수중/극지/사막/숲/산/평원/하늘/늪/지하). 해당 지형에서 비마법 험지를 무시합니다. 방해받지 않는 여정이 있으면 추가 혜택(지형별 다름: 수영/등반 속도, 이동 속도 보너스 등).", desc:'특정 지형을 선택합니다(수중/극지/사막/숲/산/평원/하늘/늪/지하). 해당 지형에서 비마법 <strong>험지를 무시</strong>합니다. 방해받지 않는 여정이 있으면 추가 혜택(지형별 다름: 수영/등반 속도, 이동 속도 보너스 등).' }
,
  {name_ko:"사냥꾼의 조준", name_en:"Hunter's Aim", feat_level:2, prerequisites:"", traits:["레인저", "집중"], category:"ranger", summary:"사냥감에 원거리 타격. +2 상황 보너스와 사냥감의 은폐 및 하위 엄폐 무시.", desc:'야생의 동물과 다른 생물을 추적하고 잡았습니다. 가죽 벗기기, 고기 수확, 요리도 훈련의 일부였습니다.<br><strong>속성 부스트:</strong> 민첩 또는 지혜, 자유 | <strong>기술:</strong> 생존, 무두질 지식 | <strong>기술 재주:</strong> 야생 동물 조사' }
,
  {name_ko:"괴물 수호", name_en:"Monster Warden", feat_level:2, prerequisites:"괴물 사냥꾼. 괴물 사냥꾼의 보너스 부여 시, 당신과 아군이 해당 사냥감의 다음 내성에 +1 상황 보너스와 다음 공격에 대한 AC에 +1 상황 보너스도 추가.", traits:["레인저"], category:"ranger", summary:"괴물 사냥꾼의 보너스 부여 시, 당신과 아군이 해당 사냥감의 다음 내성에 +1 상황 보너스와 다음 공격에 대한 AC에 +1 상황 보너스도 추가.", desc:'<strong>전제조건:</strong> 괴물 사냥꾼. 괴물 사냥꾼의 보너스 부여 시, 당신과 아군이 해당 사냥감의 다음 내성에 <strong>+1 상황 보너스</strong>와 다음 공격에 대한 AC에 <strong>+1 상황 보너스</strong>도 추가.' }
,
  {name_ko:"빠른 뽑기", name_en:"Quick Draw", feat_level:2, prerequisites:"", traits:["레인저"], category:"ranger", summary:"무기를 뽑고 같은 동작으로 공격합니다. 상호작용으로 무기를 뽑은 후 즉시 타격.", desc:'무기를 뽑고 즉시 타격.' }
,
  {name_ko:'사냥꾼의 조준', name_en:'Hunter\'s Aim', feat_level:2, prerequisites:'', traits:['레인저'], category:'ranger', summary:'사냥감에 원거리 타격. +2 상황 보너스와 사냥감의 은폐 및 하위 엄폐 무시.', desc:'사냥감에 원거리 타격. <strong>+2 상황 보너스</strong>와 사냥감의 은폐 및 하위 엄폐 무시.'}
,
  {name_ko:"고급 관리인", name_en:"Advanced Warden", feat_level:4, prerequisites:"입문 관리인. 고급 관리인 주문 1개를 선택합니다. 특수: 여러 번 선택 가능.", traits:["레인저"], category:"ranger", summary:"고급 관리인 주문 1개를 선택합니다.", desc:'<strong>전제조건:</strong> 입문 관리인. 고급 관리인 주문 1개를 선택합니다. <strong>특수:</strong> 여러 번 선택 가능.' }
,
  {name_ko:"동료의 외침", name_en:"Companion's Cry", feat_level:4, prerequisites:"동물 동료. 동물 명령에 2행동을 소비하면 동료가 추가 행동 1개를 얻습니다.", traits:["레인저"], category:"ranger", summary:"동물 명령에 2행동을 소비하면 동료가 추가 행동 1개를 얻습니다.", desc:"동물 명령에 <strong>2행동을 소비</strong>하면 동료가 추가 행동 1개를 얻습니다." }
,
  {name_ko:"사냥감 방해", name_en:"Disrupt Prey", feat_level:4, prerequisites:"", traits:["레인저"], category:"ranger", summary:"유발 조건: 도달 내 사냥감이 조작/이동 행동을 사용하거나 이동 중 칸을 떠납니다.", desc:'<strong>유발 조건:</strong> 도달 내 사냥감이 조작/이동 행동을 사용하거나 이동 중 칸을 떠납니다. 사냥감에 근접 타격. 치명타 시 유발 행동을 <strong>방해</strong>합니다.' }
,
  {name_ko:"원거리 사격", name_en:"Far Shot", feat_level:4, prerequisites:"", traits:["레인저"], category:"ranger", summary:"무기의 사거리 증분을 2배로 합니다.", desc:'무기의 사거리 증분을 <strong>2배</strong>로 합니다.' }
,
  {name_ko:"선호 사냥감", name_en:"Favored Prey", feat_level:4, prerequisites:"", traits:["레인저"], category:"ranger", summary:"동물/야수/용/(균류+식물) 중 하나를 선호 사냥감으로 선택합니다. 주도권 굴림 시 해당 범주의 적이 보이면 자유 행동으로 사냥감 추적(식별 전이라도 가능).", desc:'동물/야수/용/(균류+식물) 중 하나를 선호 사냥감으로 선택합니다. 주도권 굴림 시 해당 범주의 적이 보이면 <strong>자유 행동으로 사냥감 추적</strong>(식별 전이라도 가능).' }
,
  {name_ko:"달리기 재장전", name_en:"Running Reload", feat_level:4, prerequisites:"", traits:["레인저"], category:"ranger", summary:"이동하며 재장전합니다. 보폭/한 걸음/잠행 후 상호작용으로 재장전.", desc:'이동하며 재장전합니다. 보폭/한 걸음/잠행 후 <strong>상호작용으로 재장전</strong>.' }
,
  {name_ko:"정찰 경고", name_en:"Scout's Warning", feat_level:4, prerequisites:"", traits:["레인저"], category:"ranger", summary:"유발 조건: 지각/생존으로 주도권 굴림 직전.", desc:'야생을 고향이라 부르며 길을 찾고 여행자를 안내했습니다.<br><strong>속성 부스트:</strong> 민첩 또는 지혜, 자유 | <strong>기술:</strong> 생존, 지형 지식 | <strong>기술 재주:</strong> 채집가' }
,
  {name_ko:"쌍검 방어", name_en:"Twin Parry", feat_level:4, prerequisites:"", traits:["레인저"], category:"ranger", summary:"각 손의 근접 무기로 방어. AC +1 상황 보너스(방어 특성이면 +2). 다음 턴 시작까지.", desc:'각 손의 근접 무기로 방어. <strong>AC +1 상황 보너스</strong>(방어 특성이면 +2). 다음 턴 시작까지.' }
,
  {name_ko:'동료의 외침', name_en:'Companion\'s Cry', feat_level:4, prerequisites:'', traits:['레인저'], category:'ranger', summary:'전제조건: 동물 동료. 동물 명령에 2행동을 소비하면 동료가 추가 행동 1개를 얻습니다.', desc:'<strong>전제조건:</strong> 동물 동료. 동물 명령에 <strong>2행동을 소비</strong>하면 동료가 추가 행동 1개를 얻습니다.'}
,
  {name_ko:'정찰 경고', name_en:'Scout\'s Warning', feat_level:4, prerequisites:'', traits:['레인저'], category:'ranger', summary:'유발 조건: 감지 또는 생존으로 주도권을 굴리려 합니다. 아군에게 위험을 경고합니다. 모든 아군의 주도권에 +1 상황 보너스.', desc:'<strong>유발 조건:</strong> 감지 또는 생존으로 주도권을 굴리려 합니다. 아군에게 위험을 경고합니다. 모든 아군의 주도권에 <strong>+1 상황 보너스</strong>.'}
,
  {name_ko:"추가 회상", name_en:"Additional Recollection", feat_level:6, prerequisites:"", traits:["레인저"], category:"ranger", summary:"유발 조건: 사냥감에 대한 지식 회상에 성공/대성공.", desc:'<strong>유발 조건:</strong> 사냥감에 대한 지식 회상에 성공/대성공. 즉시 다른 보이는 생물에 대해 <strong>추가 지식 회상</strong>을 시도합니다.' }
,
  {name_ko:"달인 관리인", name_en:"Masterful Warden", feat_level:6, prerequisites:"입문 관리인. 달인 관리인 주문 1개를 선택합니다. 특수: 여러 번 선택 가능.", traits:["레인저"], category:"ranger", summary:"달인 관리인 주문 1개를 선택합니다.", desc:'<strong>전제조건:</strong> 입문 관리인. 달인 관리인 주문 1개를 선택합니다. <strong>특수:</strong> 여러 번 선택 가능.' }
,
  {name_ko:"성숙한 동물 동료", name_en:"Mature Animal Companion", feat_level:6, prerequisites:"동물 동료. 동물 동료가 성숙. 동물 명령 없이도 턴에 보폭/타격 1행동 독립 사용.", traits:["레인저"], category:"ranger", summary:"", desc:'<strong>전제조건:</strong> 동물 동료. 동물 동료가 성숙. 동물 명령 없이도 턴에 보폭/타격 <strong>1행동 독립 사용</strong>.' }
,
  {name_ko:"교전 타격", name_en:"Skirmish Strike", feat_level:6, prerequisites:"", traits:["레인저", "화려함"], category:"ranger", summary:"발과 무기가 연동합니다. 한 걸음 후 타격 또는 타격 후 한 걸음.", desc:'한 걸음+타격 또는 타격+한 걸음.' }
,
  {name_ko:"순간 사격", name_en:"Snap Shot", feat_level:6, prerequisites:"", traits:["레인저"], category:"ranger", summary:"근접 무기 타격을 허용하는 반응에서 대신 원거리 무기 타격을 할 수 있습니다(인접 대상만). 원거리 무기를 도달 5피트로 취급. 반응의 다른 요구사항(특정 무기 종류 등)은 여전히 충족 필요.", desc:'근접 무기 타격을 허용하는 반응에서 대신 <strong>원거리 무기 타격</strong>을 할 수 있습니다(인접 대상만). 원거리 무기를 도달 5피트로 취급. 반응의 다른 요구사항(특정 무기 종류 등)은 여전히 충족 필요.' }
,
  {name_ko:"신속 추적자", name_en:"Swift Tracker", feat_level:6, prerequisites:"생존 전문가, 숙련된 추적자. 추적 중에도 전체 속도로 이동. 생존 달인이면 매시간 새 판정 불필요. 전설이면 추적 중 다른 탐험 활동도 가능. 사냥감 추적 중 생존으로 주도권을 굴리면 첫 턴에 사냥감 향해 보폭을 자유 행동으로.", traits:["레인저"], category:"ranger", summary:"추적 중 매시간마다 새 판정을 굴려야 하는 것 대신, 매 30분마다 1회로 줄어듭니다.", desc:'<strong>전제조건:</strong> 생존 대가<br>추적 중 매시간마다 새 판정을 굴려야 하는 것 대신, <strong>매 30분마다 1회</strong>로 줄어듭니다. 전설이면 패배하지 않는 한 새 판정이 필요 없습니다(극단적인 흔적 변화 시 제외).' }
,
  {name_ko:"맹공 감지", name_en:"Blind-Fight", feat_level:8, prerequisites:"지각 달인. 은폐 시 단순 판정 불필요, 숨겨진 적에게 무방비 아님(DC 5), 인접한 레벨 이하 미탐지 생물은 숨겨진 것으로 취급.", traits:["레인저"], category:"ranger", summary:"", desc:'<strong>전제조건:</strong> 감지 대가. 은폐 시 단순 판정 불필요, 숨겨진 적에게 무방비 아님(DC 5), 인접 레벨 이하 미탐지→숨겨진.' }
,
  {name_ko:"치명적 조준", name_en:"Deadly Aim", feat_level:8, prerequisites:"무기 전문화. 사냥감의 약점을 겨냥. 원거리 타격에 -2 페널티, 피해에 +4 상황 보너스(11레벨 +6, 15레벨 +8).", traits:["레인저", "화려함"], category:"ranger", summary:"사냥감의 약점을 겨냥.", desc:'<strong>전제조건:</strong> 무기 전문화. 사냥감의 약점을 겨냥. 원거리 타격에 <strong>-2 페널티, 피해에 +4 상황 보너스</strong>(11레벨 +6, 15레벨 +8).' }
,
  {name_ko:"위험 탐지기", name_en:"Hazard Finder", feat_level:8, prerequisites:"", traits:["레인저"], category:"ranger", summary:"함정/위험 탐지에 +1 상황 보너스, 공격에 대한 AC와 효과에 대한 내성에도 동일. 수색 없이도 함정을 찾을 수 있습니다.", desc:'함정/위험 탐지에 <strong>+1 상황 보너스</strong>, 공격에 대한 AC와 효과에 대한 내성에도 동일. 수색 없이도 함정을 찾을 수 있습니다.' }
,
  {name_ko:"지형 달인", name_en:"Terrain Master", feat_level:8, prerequisites:"생존 달인, 선호 지형. 1시간 연습으로 현재 지형을 선호 지형으로 임시 교체(원래 지형을 떠나 하루가 지나면 복귀).", traits:["레인저"], category:"ranger", summary:"1시간 연습으로 현재 지형을 선호 지형으로 임시 교체(원래 지형을 떠나 하루가 지나면 복귀).", desc:'<strong>전제조건:</strong> 생존 대가, 선호 지형. <strong>1시간 연습</strong>으로 현재 지형을 선호 지형으로 임시 교체(원래 지형을 떠나 하루가 지나면 복귀).' }
,
  {name_ko:"관리인의 은혜", name_en:"Warden's Boon", feat_level:8, prerequisites:"", traits:["레인저"], category:"ranger", summary:"사냥감의 약점을 지적하여 아군에게 사냥감 추적과 기질의 혜택을 다음 턴 종료까지 부여합니다.", desc:"사냥감의 약점을 지적하여 아군에게 사냥감 추적과 기질의 혜택을 <strong>다음 턴 종료까지</strong> 부여합니다." }
,
  {name_ko:'관리인의 은혜', name_en:'Warden\'s Boon', feat_level:8, prerequisites:'', traits:['레인저'], category:'ranger', summary:'사냥감의 약점을 지적하여 아군에게 사냥감 추적과 기질의 혜택을 다음 턴 종료까지 부여합니다.', desc:'사냥감의 약점을 지적하여 아군에게 사냥감 추적과 기질의 혜택을 <strong>다음 턴 종료까지</strong> 부여합니다.'}
,
  {name_ko:"위장", name_en:"Camouflage", feat_level:10, prerequisites:"은신 달인. 자연 지형에서 엄폐/은폐 없이도 숨기와 잠행 가능.", traits:["레인저"], category:"ranger", summary:"자연 지형에서 엄폐/은폐 없이도 숨기와 잠행 가능.", desc:'<strong>전제조건:</strong> 은신 대가. 자연 지형에서 엄폐/은폐 없이도 <strong>숨기와 잠행</strong> 가능.' }
,
  {name_ko:"놀라운 동료", name_en:"Incredible Companion", feat_level:10, prerequisites:"성숙한 동물 동료", traits:["레인저"], category:"ranger", summary:"민첩 또는 야만 동물 동료로 성장.", desc:'<strong>전제조건:</strong> 성숙한 동물 동료. 민첩 또는 야만 동물 동료로 성장(211페이지).' }
,
  {name_ko:"달인 괴물 사냥꾼", name_en:"Master Monster Hunter", feat_level:10, prerequisites:"자연학 달인, 괴물 사냥꾼. 자연학으로 어떤 생물이든 지식 회상 가능. 성공 시에도(대성공뿐 아니라) 괴물 사냥꾼의 혜택 적용.", traits:["레인저"], category:"ranger", summary:"자연학으로 어떤 생물이든 지식 회상 가능.", desc:'<strong>전제조건:</strong> 자연학 대가, 괴물 사냥꾼. 자연학으로 <strong>어떤 생물이든</strong> 지식 회상 가능. 성공 시에도(대성공뿐 아니라) 괴물 사냥꾼의 혜택 적용.' }
,
  {name_ko:"무적 관리인", name_en:"Peerless Warden", feat_level:10, prerequisites:"입문 관리인. 무적 관리인 주문 1개를 선택합니다. 특수: 여러 번 선택 가능.", traits:["레인저"], category:"ranger", summary:"무적 관리인 주문 1개를 선택합니다.", desc:'<strong>전제조건:</strong> 입문 관리인. 무적 관리인 주문 1개를 선택합니다. <strong>특수:</strong> 여러 번 선택 가능.' }
,
  {name_ko:"관통 사격", name_en:"Penetrating Shot", feat_level:10, prerequisites:"", traits:["레인저"], category:"ranger", summary:"요구사항: 원거리 무기.", desc:'<strong>요구사항:</strong> 원거리 무기. 사냥감에 하위 엄폐를 주는 생물을 선택합니다. 선택한 생물과 사냥감 모두에게 <strong>단일 원거리 타격</strong>(하위 엄폐 무시). 피해 1회만 굴려 두 대상에 적용. 다중 공격에 2회로 포함.' }
,
  {name_ko:"쌍검 반격", name_en:"Twin Riposte", feat_level:10, prerequisites:"쌍검 방어. 유발 조건: 도달 내 생물이 대실패. 요구사항: 쌍검 방어 혜택 중. 근접 타격 또는 무장 해제.", traits:["레인저"], category:"ranger", summary:"", desc:'<strong>전제조건:</strong> 쌍검 방어. <strong>유발 조건:</strong> 도달 내 생물이 대실패. <strong>요구사항:</strong> 쌍검 방어 혜택 중. 근접 타격 또는 무장 해제.' }
,
  {name_ko:"관리인의 발걸음", name_en:"Warden's Step", feat_level:10, prerequisites:"은신 달인. 자연 지형에서 탐험 시 주의 회피(Avoid Notice) 중이면, 원하는 수의 아군에게도 같은 혜택을 부여합니다(아군의 행동 불필요).", traits:["레인저"], category:"ranger", summary:"자연 지형에서 탐험 시 주의 회피(Avoid Notice) 중이면, 원하는 수의 아군에게도 같은 혜택을 부여합니다(아군의 행동 불필요).", desc:"자연 지형에서 탐험 시 주의 회피(Avoid Notice) 중이면, <strong>원하는 수의 아군에게도</strong> 같은 혜택을 부여합니다(아군의 행동 불필요)." }
,
  {name_ko:'관리인의 발걸음', name_en:'Warden\'s Step', feat_level:10, prerequisites:'', traits:['레인저'], category:'ranger', summary:'전제조건: 은신 대가. 자연 지형에서 탐험 시 주의 회피(Avoid Notice) 중이면, 원하는 수의 아군에게도 같은 혜택을 부여합니다(아군의', desc:'<strong>전제조건:</strong> 은신 대가. 자연 지형에서 탐험 시 주의 회피(Avoid Notice) 중이면, <strong>원하는 수의 아군에게도</strong> 같은 혜택을 부여합니다(아군의 행동 불필요).'}
,
  {name_ko:"주의 분산 사격", name_en:"Distracting Shot", feat_level:12, prerequisites:"", traits:["레인저"], category:"ranger", summary:"사냥감에 원거리 치명타를 하거나 같은 턴에 2회 이상 명중하면, 다음 턴 시작까지 무방비.", desc:'사냥감에 원거리 <strong>치명타</strong>를 하거나 같은 턴에 <strong>2회 이상 명중</strong>하면, 다음 턴 시작까지 <strong>무방비</strong>.' }
,
  {name_ko:"이중 사냥감", name_en:"Double Prey", feat_level:12, prerequisites:"", traits:["레인저"], category:"ranger", summary:"사냥감 추적 시 2명을 사냥감으로 지정 가능.", desc:'사냥감 추적 시 <strong>2명을 사냥감</strong>으로 지정 가능.' }
,
  {name_ko:"두 번째 침", name_en:"Second Sting", feat_level:12, prerequisites:"", traits:["레인저", "압박"], category:"ranger", summary:"요구사항: 각 손에 근접 무기.", desc:'<strong>요구사항:</strong> 각 손에 근접 무기. 사냥감에 근접 타격. <strong>실패 시</strong> 다른 무기가 명중했을 때의 피해(피해 주사위 제외)를 줍니다.' }
,
  {name_ko:"나란히", name_en:"Side by Side", feat_level:12, prerequisites:"동물 동료. 같은 적에 인접 시 위치에 관계없이 서로 측면 공격.", traits:["레인저"], category:"ranger", summary:"", desc:'<strong>전제조건:</strong> 동물 동료. 같은 적에 인접 시 위치에 관계없이 <strong>서로 측면 공격</strong>.' }
,
  {name_ko:"관리인의 집중", name_en:"Warden's Focus", feat_level:12, prerequisites:"관리인 주문. 재집중 시 집중 풀을 완전히 채웁니다.", traits:["레인저"], category:"ranger", summary:"재집중 시 집중 풀을 완전히 채웁니다.", desc:"자연/마법과의 유대가 강화됩니다. 재집중(Refocus) 시 집중 포인트 1개만 회복하는 대신 <strong>집중 풀을 완전히 채웁니다</strong>." }
,
  {name_ko:'관리인의 집중', name_en:'Warden\'s Focus', feat_level:12, prerequisites:'', traits:['레인저'], category:'ranger', summary:'전제조건: 관리인 주문. 재집중 시 집중 풀을 완전히 채웁니다.', desc:'<strong>전제조건:</strong> 관리인 주문. 재집중 시 집중 풀을 <strong>완전히 채웁니다</strong>.'}
,
  {name_ko:"감각 못 느낀 것 감지", name_en:"Sense the Unseen", feat_level:14, prerequisites:"", traits:["레인저"], category:"ranger", summary:"유발 조건: 탐색에 실패.", desc:'<strong>유발 조건:</strong> 탐색에 실패. 미탐지 생물을 자동 감지하여 <strong>숨겨진</strong>으로.' }
,
  {name_ko:"공유 사냥감", name_en:"Shared Prey", feat_level:14, prerequisites:"이중 사냥감, 관리인의 은혜. 사냥감 추적으로 사냥감 1명만 지정 시, 자신 외에 아군 1명에게도 혜택을 부여합니다. 다음 사냥감 추적 때까지 유지.", traits:["레인저"], category:"ranger", summary:"사냥감 추적으로 사냥감 1명만 지정 시, 자신 외에 아군 1명에게도 혜택을 부여합니다.", desc:'<strong>전제조건:</strong> 이중 사냥감, 관리인의 은혜. 사냥감 추적으로 사냥감 1명만 지정 시, 자신 외에 <strong>아군 1명에게도</strong> 혜택을 부여합니다. 다음 사냥감 추적 때까지 유지.' }
,
  {name_ko:"은밀한 동료", name_en:"Stealthy Companion", feat_level:14, prerequisites:"동물 동료, 위장. 동물 동료도 위장의 혜택을 얻습니다. 전문화된 매복형이면 은신이 달인(이미 달인면 전설)로.", traits:["레인저"], category:"ranger", summary:"동물 동료도 위장의 혜택을 얻습니다.", desc:'<strong>전제조건:</strong> 동물 동료, 위장. 동물 동료도 <strong>위장의 혜택</strong>을 얻습니다. 전문화된 매복형이면 은신이 대가(이미 대가면 전설)로.' }
,
  {name_ko:"관리인의 안내", name_en:"Warden's Guidance", feat_level:14, prerequisites:"", traits:["레인저"], category:"ranger", summary:"사냥감이 당신에게 관측 상태인 한, 사냥감을 탐색하는 아군의 실패/대실패가 성공이 됩니다. 아군이 당신을 보거나 들을 수 있어야.", desc:"사냥감이 당신에게 관측 상태인 한, 사냥감을 탐색하는 <strong>아군의 실패/대실패가 성공</strong>이 됩니다. 아군이 당신을 보거나 들을 수 있어야." }
,
  {name_ko:'관리인의 안내', name_en:'Warden\'s Guidance', feat_level:14, prerequisites:'', traits:['레인저'], category:'ranger', summary:'사냥감이 당신에게 관측 상태인 한, 사냥감을 탐색하는 아군의 실패/대실패가 성공이 됩니다. 아군이 당신을 보거나 들을 수 있어야.', desc:'사냥감이 당신에게 관측 상태인 한, 사냥감을 탐색하는 <strong>아군의 실패/대실패가 성공</strong>이 됩니다. 아군이 당신을 보거나 들을 수 있어야.'}
,
  {name_ko:"상위 주의 분산 사격", name_en:"Greater Distracting Shot", feat_level:16, prerequisites:"주의 분산 사격. 원거리 명중만으로도 다음 턴 시작까지 무방비. 치명타나 2회 명중 시 다음 턴 종료까지.", traits:["레인저"], category:"ranger", summary:"원거리 명중만으로도 다음 턴 시작까지 무방비.", desc:'<strong>전제조건:</strong> 주의 분산 사격. 원거리 명중만으로도 다음 턴 시작까지 <strong>무방비</strong>. 치명타나 2회 명중 시 <strong>다음 턴 종료까지</strong>.' }
,
  {name_ko:"향상된 쌍검 반격", name_en:"Improved Twin Riposte", feat_level:16, prerequisites:"쌍검 반격. 각 턴 시작에 쌍검 반격 전용 추가 반응 1회. 쌍검 방어 없이도 사용 가능.", traits:["레인저"], category:"ranger", summary:"", desc:'<strong>전제조건:</strong> 쌍검 반격. 각 턴 시작에 쌍검 반격 전용 <strong>추가 반응 1회</strong>. 쌍검 방어 없이도 사용 가능.' }
,
  {name_ko:"전설적 괴물 사냥꾼", name_en:"Legendary Monster Hunter", feat_level:16, prerequisites:"자연학 전설, 달인 괴물 사냥꾼. 괴물 사냥꾼(및 괴물 수호)의 보너스가 +1에서 +2로 증가.", traits:["레인저"], category:"ranger", summary:"괴물 사냥꾼(및 괴물 수호)의 보너스가 +1에서 +2로 증가.", desc:'<strong>전제조건:</strong> 자연학 전설, 달인 괴물 사냥꾼. 괴물 사냥꾼(및 괴물 수호)의 보너스가 +1에서 <strong>+2로 증가</strong>.' }
,
  {name_ko:"전문화된 동료", name_en:"Specialized Companion", feat_level:16, prerequisites:"놀라운 동료. 전문화 1개 추가. 특수: 최대 3회.", traits:["레인저"], category:"ranger", summary:"", desc:'<strong>전제조건:</strong> 놀라운 동료. 전문화 1개 추가. <strong>특수:</strong> 최대 3회.' }
,
  {name_ko:"관리인의 재장전", name_en:"Warden's Reload", feat_level:16, prerequisites:"", traits:["레인저"], category:"ranger", summary:"빈도: 라운드당 1회.", desc:"<strong>빈도:</strong> 라운드당 1회. <strong>요구사항:</strong> 이번 턴 마지막 행동이 관리인 주문 시전. 현재 무기를 <strong>즉시 재장전</strong>." }
,
  {name_ko:'관리인의 재장전', name_en:'Warden\'s Reload', feat_level:16, prerequisites:'', traits:['레인저'], category:'ranger', summary:'빈도: 라운드당 1회. 요구사항: 이번 턴 마지막 행동이 관리인 주문 시전. 현재 무기를 즉시 재장전.', desc:'<strong>빈도:</strong> 라운드당 1회. <strong>요구사항:</strong> 이번 턴 마지막 행동이 관리인 주문 시전. 현재 무기를 <strong>즉시 재장전</strong>.'}
,
  {name_ko:"불가능한 난타", name_en:"Impossible Flurry", feat_level:18, prerequisites:"", traits:["레인저", "화려함"], category:"ranger", summary:"요구사항: 각 손에 근접 무기.", desc:'<strong>요구사항:</strong> 각 손에 근접 무기. 정밀함을 포기하고 불가능한 속도로 공격. 각 무기로 <strong>3회씩 타격</strong>(각 무기의 첫 공격은 이미 1회 공격한 것처럼 페널티, 나머지는 최대 페널티).' }
,
  {name_ko:"불가능한 일제사격", name_en:"Impossible Volley", feat_level:18, prerequisites:"", traits:["레인저", "화려함"], category:"ranger", summary:"", desc:'<strong>요구사항:</strong> 살포+재장전 0 원거리 무기. 살포 사거리 이상 중심의 10피트 폭발 내 모든 적에게 <strong>-2 페널티로 타격</strong>. 피해 1회만. 다중 공격에 포함되지만 전부 후 증가.' }
,
  {name_ko:"다면적 기질", name_en:"Manifold Edge", feat_level:18, prerequisites:"기질, 달인 사냥꾼. 사냥감 추적 시 1레벨에 선택한 기질 대신 다른 기질의 혜택을 얻을 수 있습니다(달인 사냥꾼의 추가 혜택은 없음).", traits:["레인저"], category:"ranger", summary:"사냥감 추적 시 1레벨에 선택한 기질 대신 다른 기질의 혜택을 얻을 수 있습니다(달인 사냥꾼의 추가 혜택은 없음).", desc:'<strong>전제조건:</strong> 기질, 달인 사냥꾼. 사냥감 추적 시 1레벨에 선택한 기질 대신 <strong>다른 기질의 혜택</strong>을 얻을 수 있습니다(달인 사냥꾼의 추가 혜택은 없음).' }
,
  {name_ko:"달인 동료", name_en:"Masterful Companion", feat_level:18, prerequisites:"달인 사냥꾼, 동물 동료. 사냥감 추적 시 동물 동료도 기존 기질 혜택 대신 달인 사냥꾼의 강화된 기질 혜택을 얻습니다.", traits:["레인저"], category:"ranger", summary:"사냥감 추적 시 동물 동료도 기존 기질 혜택 대신 달인 사냥꾼의 강화된 기질 혜택을 얻습니다.", desc:'<strong>전제조건:</strong> 달인 사냥꾼, 동물 동료. 사냥감 추적 시 동물 동료도 기존 기질 혜택 대신 <strong>달인 사냥꾼의 강화된 기질 혜택</strong>을 얻습니다.' }
,
  {name_ko:"완벽한 사격", name_en:"Perfect Shot", feat_level:18, prerequisites:"", traits:["레인저", "화려함"], category:"ranger", summary:"요구사항: 재장전 1 이상의 장전된 원거리 무기, 지난 턴 이후 재장전하지 않았어야.", desc:'<strong>요구사항:</strong> 재장전 1 이상의 장전된 원거리 무기, 지난 턴 이후 재장전하지 않았어야. 놀라운 집중과 정밀로 최적의 순간에 사격합니다. 사냥감에 원거리 타격. 명중 시 <strong>최대 피해</strong>. 타격 후 턴이 종료됩니다.' }
,
  {name_ko:"그림자 사냥꾼", name_en:"Shadow Hunter", feat_level:18, prerequisites:"위장. 자연 지형에서 원하면 항상 모든 적에게 은폐(concealed)(사냥감 제외).", traits:["레인저"], category:"ranger", summary:"자연 지형에서 원하면 항상 모든 적에게 은폐(concealed)(사냥감 제외).", desc:'<strong>전제조건:</strong> 위장. 자연 지형에서 원하면 항상 모든 적에게 <strong>은폐(concealed)</strong>(사냥감 제외).' }
,
  {name_ko:"전설적 사격", name_en:"Legendary Shot", feat_level:20, prerequisites:"지각 전설, 원거리 사격. 원거리 무기 달인이면 사냥감에 대해 최대 5 사거리 증분까지 페널티 무시.", traits:["레인저"], category:"ranger", summary:"원거리 무기 달인이면 사냥감에 대해 최대 5 사거리 증분까지 페널티 무시.", desc:'<strong>전제조건:</strong> 지각 전설, 원거리 사격. 원거리 무기 대가이면 사냥감에 대해 <strong>최대 5 사거리 증분까지 페널티 무시</strong>.' }
,
  {name_ko:"땅끝까지", name_en:"To the Ends of the Earth", feat_level:20, prerequisites:"생존 전설. 100피트 내 생물에 사냥감 추적 시, 아무리 멀어져도 정확한 위치를 항상 알 수 있습니다. 자연학 전설이면 순간이동이나 차원 이동도 추적 가능(탐지+원시 특성 추가).", traits:["레인저"], category:"ranger", summary:"100피트 내 생물에 사냥감 추적 시, 아무리 멀어져도 정확한 위치를 항상 알 수 있습니다.", desc:'<strong>전제조건:</strong> 생존 전설. 100피트 내 생물에 사냥감 추적 시, 아무리 멀어져도 <strong>정확한 위치를 항상 알 수 있습니다</strong>. 자연학 전설이면 순간이동이나 차원 이동도 추적 가능(탐지+원시 특성 추가).' }
,
  {name_ko:"삼중 위협", name_en:"Triple Threat", feat_level:20, prerequisites:"공유 사냥감. 사냥감 추적 시 3명을 사냥감으로 지정하거나, 2명 지정 + 아군 1명에 공유, 또는 1명 지정 + 아군 2명에 공유 가능.", traits:["레인저"], category:"ranger", summary:"사냥감 추적 시 3명을 사냥감으로 지정하거나, 2명 지정 + 아군 1명에 공유, 또는 1명 지정 + 아군 2명에 공유 가능.", desc:'<strong>전제조건:</strong> 공유 사냥감. 사냥감 추적 시 <strong>3명을 사냥감</strong>으로 지정하거나, 2명 지정 + 아군 1명에 공유, 또는 1명 지정 + 아군 2명에 공유 가능.' }
,
  {name_ko:"궁극의 교전병", name_en:"Ultimate Skirmisher", feat_level:20, prerequisites:"방해받지 않는 여정. 모든 험지, 상위 험지, 위험 지형을 무시하고, 이동으로 유발되는 함정/위험도 원하지 않는 한 유발하지 않습니다.", traits:["레인저"], category:"ranger", summary:"당신은 기술이 뛰어나고 기회주의적입니다. 날카로운 재치와 빠른 반응으로 적의 실수를 이용하여 가장 아픈 곳을 찌릅니다. 위험한 게임을 즐기며, 스릴을 추구하고 기술을 시험하며, 방해가 되는 법은 대부분 신경 쓰지 않습니다. 모든 로그의 길은 독특하고 위험으로 가득하지만", desc:'<strong>전제조건:</strong> 방해받지 않는 여정. 모든 <strong>험지, 상위 험지, 위험 지형을 무시</strong>하고, 이동으로 유발되는 함정/위험도 원하지 않는 한 유발하지 않습니다.' }
,
  {name_ko:"날렵한 회피", name_en:"Nimble Dodge", feat_level:1, prerequisites:"", traits:["로그"], category:"rogue", summary:"유발 조건: 공격이 당신을 대상으로 하고 AC에 대해 명중 굴림을 유발합니다.", desc:'<strong>유발 조건:</strong> 공격이 당신을 대상으로 하고 AC에 대해 명중 굴림을 유발합니다. 재빠르게 비껴 공격을 피합니다. 유발 공격에 대해 <strong>AC +2 상황 보너스</strong>.' }
,
  {name_ko:"과장된 속임", name_en:"Overextending Feint", feat_level:1, prerequisites:"", traits:["로그"], category:"rogue", summary:"속임(Feint) 시도에 대실패하면, 대상이 무방비하는 대신 당신이 대상에게 무방비합니다(다음 턴 시작까지). 그러나 속임에 성공하면 대상은 당신뿐 아니라 모든 공격에 무방비.", desc:'속임(Feint) 시도에 대실패하면, 대상이 무방비하는 대신 <strong>당신이 대상에게 무방비</strong>합니다(다음 턴 시작까지). 그러나 속임에 성공하면 대상은 당신뿐 아니라 <strong>모든 공격에 무방비</strong>.' }
,
  {name_ko:"증거 심기", name_en:"Plant Evidence", feat_level:1, prerequisites:"", traits:["로그"], category:"rogue", summary:"도둑질(Thievery)로 물건을 훔치는 대신 대상에게 물건을 심을 수 있습니다(같은 규칙, DC 적용).", desc:'도둑질(Thievery)로 물건을 훔치는 대신 대상에게 <strong>물건을 심을 수</strong> 있습니다(같은 규칙, DC 적용).' }
,
  {name_ko:"함정 탐지기", name_en:"Trap Finder", feat_level:1, prerequisites:"", traits:["로그"], category:"rogue", summary:"함정 탐지에 +1 상황 보너스, 함정의 AC와 내성에도 +1. 수색 없이도 함정을 찾을 수 있습니다. 도둑질 달인 필요 함정을 해제 가능. 도둑질 달인이면 전설 필요 함정도 해제 가능하며 보너스가 +2로 증가.", desc:'함정 탐지에 <strong>+1 상황 보너스</strong>, 함정의 AC와 내성에도 +1. 수색 없이도 함정을 찾을 수 있습니다. 도둑질 대가 필요 함정을 해제 가능. 도둑질 대가이면 전설 필요 함정도 해제 가능하며 보너스가 +2로 증가.' }
,
  {name_ko:"구르기 뒤돌기", name_en:"Tumble Behind", feat_level:1, prerequisites:"", traits:["로그"], category:"rogue", summary:"덤블 통과(Tumble Through)에 성공하면, 통과한 적이 다음 턴 시작까지 당신의 공격에 무방비.", desc:'덤블 통과(Tumble Through)에 성공하면, 통과한 적이 다음 턴 시작까지 당신의 공격에 <strong>무방비</strong>.' }
,
  {name_ko:"쌍검 속임", name_en:"Twin Feint", feat_level:1, prerequisites:"", traits:["로그"], category:"rogue", summary:"요구사항: 각 손에 근접 무기.", desc:'<strong>요구사항:</strong> 각 손에 근접 무기. 한 무기로 적의 주의를 분산시키고 다른 무기로 다른 각도에서 공격. 같은 대상에 각 무기로 타격 1회씩. 두 번째 공격에 대상은 <strong>자동 무방비</strong>. 다중 공격 페널티 정상 적용.' }
,
  {name_ko:"네 차례다", name_en:"You're Next", feat_level:1, prerequisites:"위협 숙련. 유발 조건: 적을 HP 0으로 만듭니다. 적을 쓰러뜨린 후 60피트 내 다른 생물에게 +2 상황 보너스로 사기 저하 시도. 위협 전설이면 자유 행동으로.", traits:["로그", "감정", "공포", "정신"], category:"rogue", summary:"적을 쓰러뜨린 후 60피트 내 다른 생물에게 +2 상황 보너스로 사기 저하 시도.", desc:"적을 쓰러뜨린 후 60피트 내 다른 생물에게 <strong>+2 상황 보너스로 사기 저하</strong> 시도. 위협 전설이면 자유 행동으로." }
,
  {name_ko:'네 차례다', name_en:'You\'re Next', feat_level:1, prerequisites:'', traits:['로그'], category:'rogue', summary:'전제조건: 위협 숙련. 유발 조건: 적을 HP 0으로 만듭니다. 적을 쓰러뜨린 후 60피트 내 다른 생물에게 +2 상황 보너스로 사기 저하 시도', desc:'<strong>전제조건:</strong> 위협 숙련. <strong>유발 조건:</strong> 적을 HP 0으로 만듭니다. 적을 쓰러뜨린 후 60피트 내 다른 생물에게 <strong>+2 상황 보너스로 사기 저하</strong> 시도. 위협 전설이면 자유 행동으로.'}
,
  {name_ko:"잔혹한 구타", name_en:"Brutal Beating", feat_level:2, prerequisites:"건달 라켓. 치명타가 적의 자신감을 흔듭니다. 치명타로 피해를 줄 때마다 대상은 공포 1.", traits:["로그"], category:"rogue", summary:"치명타가 적의 자신감을 흔듭니다.", desc:'<strong>전제조건:</strong> 건달 라켓. 치명타가 적의 자신감을 흔듭니다. 치명타로 피해를 줄 때마다 대상은 <strong>공포 1</strong>.' }
,
  {name_ko:"영리한 계략", name_en:"Clever Gambit", feat_level:2, prerequisites:"지략가 라켓. 유발 조건: 지식 회상으로 식별한 생물에 대해 타격이 치명 성공하고 피해를 줍니다. 한 걸음 또는 보폭(유발 생물의 반응 유발하지 않음).", traits:["로그"], category:"rogue", summary:"한 걸음 또는 보폭(유발 생물의 반응 유발하지 않음).", desc:'<strong>전제조건:</strong> 지략가 라켓. <strong>유발 조건:</strong> 지식 회상으로 식별한 생물에 대해 타격이 치명 성공하고 피해를 줍니다. 한 걸음 또는 보폭(유발 생물의 반응 유발하지 않음).' }
,
  {name_ko:"주의 분산 속임", name_en:"Distracting Feint", feat_level:2, prerequisites:"사기꾼 라켓. 속임으로 무방비한 동안 지각 판정과 반사 내성에 -2 상황 페널티.", traits:["로그"], category:"rogue", summary:"속임으로 무방비한 동안 지각 판정과 반사 내성에 -2 상황 페널티.", desc:'<strong>전제조건:</strong> 사기꾼 라켓. 속임으로 무방비한 동안 지각 판정과 반사 내성에 <strong>-2 상황 페널티</strong>.' }
,
  {name_ko:"기동성", name_en:"Mobility", feat_level:2, prerequisites:"", traits:["로그"], category:"rogue", summary:"절반 속도 이하로 보폭하면 이동이 반응을 유발하지 않습니다.", desc:'절반 속도 이하로 보폭하면 이동이 <strong>반응을 유발하지 않습니다</strong>.' }
,
  {name_ko:"빠른 뽑기", name_en:"Quick Draw", feat_level:2, prerequisites:"", traits:["로그"], category:"rogue", summary:"무기를 뽑고 즉시 타격.", desc:'무기를 뽑고 즉시 타격.' }
,
  {name_ko:"강한 팔", name_en:"Strong Arm", feat_level:2, prerequisites:"", traits:["로그"], category:"rogue", summary:"투척 무기의 사거리 증분이 10피트 증가.", desc:'투척 무기의 사거리 증분이 <strong>10피트 증가</strong>.' }
,
  {name_ko:"불균형 타격", name_en:"Unbalancing Blow", feat_level:2, prerequisites:"도둑 라켓. 치명타로 피해 시 대상이 다음 턴 시작까지 당신의 공격에 무방비.", traits:["로그"], category:"rogue", summary:"치명타로 피해 시 대상이 다음 턴 시작까지 당신의 공격에 무방비.", desc:'<strong>전제조건:</strong> 도둑 라켓. 치명타로 피해 시 대상이 다음 턴 시작까지 당신의 공격에 <strong>무방비</strong>.' }
,
  {name_ko:"비열한 습격", name_en:"Underhanded Assault", feat_level:2, prerequisites:"은신 숙련. 아군 인접 적에게 잠행. 현재 관측 중이어도 숨겨진 것처럼 판정(은신 -2 페널티). 성공 시 잠행 종료 시 근접 타격 가능.", traits:["로그", "시각"], category:"rogue", summary:"아군 인접 적에게 잠행.", desc:'<strong>전제조건:</strong> 은신 숙련. 아군 인접 적에게 잠행. 현재 관측 중이어도 숨겨진 것처럼 판정(은신 -2 페널티). 성공 시 잠행 종료 시 근접 타격 가능.' }
,
  {name_ko:"공포 타격자", name_en:"Dread Striker", feat_level:4, prerequisites:"", traits:["로그"], category:"rogue", summary:"겁먹은(frightened) 생물은 당신의 공격에도 무방비.", desc:'겁먹은(frightened) 생물은 당신의 공격에도 <strong>무방비</strong>.' }
,
  {name_ko:"머리 밟기", name_en:"Head Stomp", feat_level:4, prerequisites:"", traits:["로그"], category:"rogue", summary:"엎드린 대상에 비무장 타격. 명중 시 다음 턴 종료까지 멍청함(stupefied) 1(치명타 2)과 무방비.", desc:'엎드린 대상에 비무장 타격. 명중 시 다음 턴 종료까지 <strong>멍청함(stupefied) 1</strong>(치명타 2)과 <strong>무방비</strong>.' }
,
  {name_ko:"갈취", name_en:"Mug", feat_level:4, prerequisites:"", traits:["로그"], category:"rogue", summary:"인접 적에 근접 타격. 명중하고 은밀 공격 피해를 주면 도둑질(Steal)도 시도 가능(전투 중이어도).", desc:'인접 적에 근접 타격. 명중하고 은밀 공격 피해를 주면 <strong>도둑질(Steal)</strong>도 시도 가능(전투 중이어도).' }
,
  {name_ko:"독 무기", name_en:"Poison Weapon", feat_level:4, prerequisites:"", traits:["로그", "조작"], category:"rogue", summary:"무기에 접촉독/부상독을 바릅니다. 빈 손이 있으면 독을 뽑는 상호작용도 포함. 일일 준비 시 로그 레벨만큼의 단순 부상독(1d4 독 피해, 내성 없음)을 준비 가능. 다음 준비 시 만료.", desc:'무기에 접촉독/부상독을 바릅니다. 빈 손이 있으면 독을 뽑는 상호작용도 포함. 일일 준비 시 로그 레벨만큼의 <strong>단순 부상독</strong>(1d4 독 피해, 내성 없음)을 준비 가능. 다음 준비 시 만료.' }
,
  {name_ko:"예측 가능!", name_en:"Predictable!", feat_level:4, prerequisites:"", traits:["로그"], category:"rogue", summary:"적 1명을 관찰하여 다음 행동을 예측합니다. 지각으로 의도 파악 시도(적의 기만 DC 또는 레벨의 어려운 DC 중 높은 것).", desc:'적 1명을 관찰하여 다음 행동을 예측합니다. 감지로 의도 파악 시도(적의 기만 DC 또는 레벨의 어려운 DC 중 높은 것).<br><strong>대성공:</strong> 다음 턴 시작까지 대상의 공격에 <strong>AC +2</strong>, 다음 내성에 <strong>+2</strong>.<br>' }
,
  {name_ko:"반응적 추격", name_en:"Reactive Pursuit", feat_level:4, prerequisites:"", traits:["로그"], category:"rogue", summary:"유발 조건: 인접 적이 당신에게서 멀어집니다.", desc:'<strong>유발 조건:</strong> 인접 적이 당신에게서 멀어집니다. 보폭하되 적에 인접하게 종료 필요. 유발 적의 반응을 유발하지 않음.' }
,
  {name_ko:"파괴 공작", name_en:"Sabotage", feat_level:4, prerequisites:"", traits:["로그", "무력화"], category:"rogue", summary:"요구사항: 빈 손. 도달 내 생물이 들거나 지닌 움직이는 부품이 있는 아이템을 손상시킵니다. 도둑질 판정(대상의 반사 DC). 대성공: 도둑질 숙련 보너스 ×4 피해. 성공: ×2 피해. 대실패: 1일 면역.", desc:'<strong>요구사항:</strong> 빈 손. 도달 내 생물이 들거나 지닌 움직이는 부품이 있는 아이템을 손상시킵니다. 도둑질 판정(대상의 반사 DC). 대성공: 도둑질 숙련 보너스 ×4 피해. 성공: ×2 피해. 대실패: 1일 면역.' }
,
  {name_ko:"사기꾼의 기습", name_en:"Scoundrel's Surprise", feat_level:4, prerequisites:"", traits:["로그", "조작"], category:"rogue", summary:"변장을 극적으로 벗어 놀라게 합니다. 이전에 변장을 간파하지 못한 생물은 턴 종료까지 다음 공격에 무방비.", desc:'재빠른 말솜씨, 아첨, 날카로운 혀로 위험을 피하고 곤란한 상황을 탈출합니다. 기만으로 성공적으로 속임(Feint) 시 다음 턴 종료까지 당신의 근접 공격에 <strong>무방비</strong>; 대성공이면 모든 근접 공격에. 민첩/기교 근접 무기를 들고 속이면 즉시 <strong>자유 행동으로 한 걸음</strong>.<br><strong>기술:</strong> 기만, 외교. <strong>핵심 속성:</strong> 매력 선택 가능.' }
,
  {name_ko:"정찰 경고", name_en:"Scout's Warning", feat_level:4, prerequisites:"", traits:["로그"], category:"rogue", summary:"", desc:'야생을 고향이라 부르며 길을 찾고 여행자를 안내했습니다.<br><strong>속성 부스트:</strong> 민첩 또는 지혜, 자유 | <strong>기술:</strong> 생존, 지형 지식 | <strong>기술 재주:</strong> 채집가' }
,
  {name_ko:"그들이 클수록", name_en:"The Harder They Fall", feat_level:4, prerequisites:"", traits:["로그"], category:"rogue", summary:"무방비한 적을 넘어뜨리기(Trip)에 성공하면 1d6 둔기 피해. 대성공이면 1d6 + 은밀 공격 피해.", desc:'무방비한 적을 넘어뜨리기(Trip)에 성공하면 <strong>1d6 둔기 피해</strong>. 대성공이면 1d6 + 은밀 공격 피해.' }
,
  {name_ko:"쌍검 교란", name_en:"Twin Distraction", feat_level:4, prerequisites:"쌍검 속임. 쌍검 속임으로 두 타격 모두 피해를 주면 대상은 클래스 DC에 대해 의지 내성. 실패 시 다음 턴 종료까지 멍청함 1.", traits:["로그"], category:"rogue", summary:"쌍검 속임으로 두 타격 모두 피해를 주면 대상은 클래스 DC에 대해 의지 내성.", desc:'<strong>전제조건:</strong> 쌍검 속임. 쌍검 속임으로 두 타격 모두 피해를 주면 대상은 클래스 DC에 대해 의지 내성. 실패 시 다음 턴 종료까지 <strong>멍청함 1</strong>.' }
,
  {name_ko:'사기꾼의 기습', name_en:'Scoundrel\'s Surprise', feat_level:4, prerequisites:'', traits:['로그'], category:'rogue', summary:'변장을 극적으로 벗어 놀라게 합니다. 이전에 변장을 간파하지 못한 생물은 턴 종료까지 다음 공격에 무방비.', desc:'변장을 극적으로 벗어 놀라게 합니다. 이전에 변장을 간파하지 못한 생물은 턴 종료까지 다음 공격에 <strong>무방비</strong>.'}
,
  {name_ko:'정찰 경고', name_en:'Scout\'s Warning', feat_level:4, prerequisites:'', traits:['로그'], category:'rogue', summary:'유발 조건: 감지/생존으로 주도권 굴림 직전. 아군 모두의 주도권에 +1 상황 보너스.', desc:'<strong>유발 조건:</strong> 감지/생존으로 주도권 굴림 직전. 아군 모두의 주도권에 <strong>+1 상황 보너스</strong>.'}
,
  {name_ko:"약점 분석", name_en:"Analyze Weakness", feat_level:6, prerequisites:"은밀 공격 2d6. 요구사항: 지식 회상으로 식별한 생물. 대상의 약점을 파악합니다. 턴 종료 전 다음 은밀 공격 시 추가 2d6 정밀 피해(11레벨 3d6, 17레벨 4d6).", traits:["로그"], category:"rogue", summary:"요구사항: 지식 회상으로 식별한 생물.", desc:'<strong>전제조건:</strong> 은밀 공격 2d6. <strong>요구사항:</strong> 지식 회상으로 식별한 생물. 대상의 약점을 파악합니다. 턴 종료 전 다음 은밀 공격 시 <strong>추가 2d6 정밀 피해</strong>(11레벨 3d6, 17레벨 4d6).' }
,
  {name_ko:"매복 예상", name_en:"Anticipate Ambush", feat_level:6, prerequisites:"은신 전문가. 절반 이동 속도로 경계. 조우 시작 시 지각으로 주도권, 은신으로 주도권 굴리는 모든 적에게 -2 상황 페널티.", traits:["로그", "탐험"], category:"rogue", summary:"절반 이동 속도로 경계.", desc:'<strong>전제조건:</strong> 은신 전문가. 절반 이동 속도로 경계. 조우 시작 시 감지로 주도권, 은신으로 주도권 굴리는 모든 적에게 <strong>-2 상황 페널티</strong>.' }
,
  {name_ko:"원거리 투척", name_en:"Far Throw", feat_level:6, prerequisites:"", traits:["로그"], category:"rogue", summary:"투척 무기의 추가 사거리 증분 페널티가 -2 대신 -1.", desc:'투척 무기의 추가 사거리 증분 페널티가 -2 대신 <strong>-1</strong>.' }
,
  {name_ko:"집단 공격", name_en:"Gang Up", feat_level:6, prerequisites:"", traits:["로그"], category:"rogue", summary:"아군과 함께 적을 괴롭힙니다. 적이 당신과 아군 모두의 도달 내에 있으면 반대편이 아니어도 측면 공격 가능. 일반 측면 요구사항은 여전히 충족 필요.", desc:'아군과 함께 적을 괴롭힙니다. 적이 당신과 아군 모두의 도달 내에 있으면 <strong>반대편이 아니어도 측면 공격</strong> 가능. 일반 측면 요구사항은 여전히 충족 필요.' }
,
  {name_ko:"가벼운 발걸음", name_en:"Light Step", feat_level:6, prerequisites:"", traits:["로그"], category:"rogue", summary:"보폭이나 한 걸음 시 험지를 무시합니다.", desc:'보폭이나 한 걸음 시 <strong>험지를 무시</strong>합니다.' }
,
  {name_ko:"밀어 눕히기", name_en:"Shove Down", feat_level:6, prerequisites:"운동 숙련. 요구사항: 마지막 행동이 성공한 밀기. 밀기 후 즉시 넘어뜨리기 시도(도달 밖이어도).", traits:["로그"], category:"rogue", summary:"요구사항: 마지막 행동이 성공한 밀기.", desc:'<strong>전제조건:</strong> 운동 숙련. <strong>요구사항:</strong> 마지막 행동이 성공한 밀기. 밀기 후 즉시 넘어뜨리기 시도(도달 밖이어도).' }
,
  {name_ko:"교전 타격", name_en:"Skirmish Strike", feat_level:6, prerequisites:"", traits:["로그", "화려함"], category:"rogue", summary:"한 걸음+타격 또는 타격+한 걸음.", desc:'한 걸음+타격 또는 타격+한 걸음.' }
,
  {name_ko:"교활한 해제", name_en:"Sly Disarm", feat_level:6, prerequisites:"", traits:["로그"], category:"rogue", summary:"운동 대신 도둑질로 무장 해제 가능. 성공 시 대상이 턴 종료까지 다음 공격에 무방비.", desc:'운동 대신 <strong>도둑질로 무장 해제</strong> 가능. 성공 시 대상이 턴 종료까지 다음 공격에 <strong>무방비</strong>.' }
,
  {name_ko:"칼 비틀기", name_en:"Twist the Knife", feat_level:6, prerequisites:"", traits:["로그"], category:"rogue", summary:"요구사항: 마지막 행동이 무방비한 대상에 은밀 공격 피해를 준 근접 타격.", desc:'<strong>요구사항:</strong> 마지막 행동이 무방비한 대상에 은밀 공격 피해를 준 근접 타격. 상처를 벌립니다. 은밀 공격 피해 주사위 수만큼 <strong>지속 출혈 피해</strong>.' }
,
  {name_ko:"뒤를 조심해", name_en:"Watch Your Back", feat_level:6, prerequisites:"위협 숙련. 30피트 내 대상의 의지 DC에 위협 판정. 성공 시 1분간 대상이 당신에 대한 지각에 +2 상태 보너스지만, 공포 효과에 대한 의지 내성에 -2 상태 페널티.", traits:["로그", "감정", "공포", "정신"], category:"rogue", summary:"30피트 내 대상의 의지 DC에 위협 판정.", desc:'<strong>전제조건:</strong> 위협 숙련. 30피트 내 대상의 의지 DC에 위협 판정. 성공 시 1분간 대상이 당신에 대한 감지에 <strong>+2 상태 보너스</strong>지만, 공포 효과에 대한 의지 내성에 <strong>-2 상태 페널티</strong>.' }
,
  {name_ko:"맹공 감지", name_en:"Blind-Fight", feat_level:8, prerequisites:"지각 달인. 은폐 시 단순 판정 불필요, 숨겨진 적에게 무방비 아님(DC 5), 인접 레벨 이하 미탐지→숨겨진.", traits:["로그"], category:"rogue", summary:"", desc:'<strong>전제조건:</strong> 감지 대가. 은폐 시 단순 판정 불필요, 숨겨진 적에게 무방비 아님(DC 5), 인접 레벨 이하 미탐지→숨겨진.' }
,
  {name_ko:"과녁", name_en:"Bullseye", feat_level:8, prerequisites:"", traits:["로그"], category:"rogue", summary:"다음 투척 무기 타격에 +1 상황 보너스, 대상의 은폐/하위 엄폐/표준 엄폐 무시(상위 엄폐→표준).", desc:'다음 투척 무기 타격에 <strong>+1 상황 보너스</strong>, 대상의 은폐/하위 엄폐/표준 엄폐 무시(상위 엄폐→표준).' }
,
  {name_ko:"함정 지연", name_en:"Delay Trap", feat_level:8, prerequisites:"", traits:["로그"], category:"rogue", summary:"유발 조건: 도달 내 함정이 유발됩니다.", desc:'<strong>유발 조건:</strong> 도달 내 함정이 유발됩니다. 도둑질로 장치 해제 시도. 대성공: 유발 방지 또는 다음 턴까지 지연(선택). 성공: 같지만 GM이 더 나쁜 것 선택.' }
,
  {name_ko:"향상된 독 무기", name_en:"Improved Poison Weapon", feat_level:8, prerequisites:"독 무기. 단순 독이 2d4 독 피해로 증가. 공격 대실패 시 독이 낭비되지 않음.", traits:["로그"], category:"rogue", summary:"단순 독이 2d4 독 피해로 증가.", desc:'<strong>전제조건:</strong> 독 무기. 단순 독이 <strong>2d4 독 피해</strong>로 증가. 공격 대실패 시 독이 낭비되지 않음.' }
,
  {name_ko:"영감적 전략", name_en:"Inspired Stratagem", feat_level:8, prerequisites:"", traits:["로그"], category:"rogue", summary:"일일 준비 시 최대 5명과 전략을 검토. 나중에 [반응]으로 아군이 공격/기술 판정을 두 번 굴려 높은 결과 사용(아군당 하루 1회).", desc:'일일 준비 시 최대 5명과 전략을 검토. 나중에 [반응]으로 아군이 공격/기술 판정을 <strong>두 번 굴려 높은 결과</strong> 사용(아군당 하루 1회).' }
,
  {name_ko:"날렵한 구르기", name_en:"Nimble Roll", feat_level:8, prerequisites:"날렵한 회피. 반사 내성 직전에도 날렵한 회피 사용 가능(반사 내성에 보너스 적용). 회피 후 공격이 실패/대실패하거나 내성 성공/대성공 시 10피트까지 보폭 가능.", traits:["로그"], category:"rogue", summary:"반사 내성 직전에도 날렵한 회피 사용 가능(반사 내성에 보너스 적용).", desc:'<strong>전제조건:</strong> 날렵한 회피. 반사 내성 직전에도 날렵한 회피 사용 가능(반사 내성에 보너스 적용). 회피 후 공격이 실패/대실패하거나 내성 성공/대성공 시 <strong>10피트까지 보폭</strong> 가능.' }
,
  {name_ko:"기회 암살", name_en:"Opportune Backstab", feat_level:8, prerequisites:"", traits:["로그"], category:"rogue", summary:"유발 조건: 도달 내 생물이 아군의 근접 공격에 명중당합니다.", desc:'<strong>유발 조건:</strong> 도달 내 생물이 아군의 근접 공격에 명중당합니다. 유발 생물에 <strong>타격</strong>.' }
,
  {name_ko:"예측 구매", name_en:"Predictive Purchase", feat_level:8, prerequisites:"", traits:["로그"], category:"rogue", summary:"선견 계획자(Prescient Planner)와 선견 소모품(Prescient Consumable) 재주를 얻습니다. 선견 계획자 사용 시 1분 대신 2행동 활동으로 아이템을 꺼냄.", desc:'선견 계획자(Prescient Planner)와 선견 소모품(Prescient Consumable) 재주를 얻습니다. 선견 계획자 사용 시 1분 대신 <strong>2행동 활동</strong>으로 아이템을 꺼냄.' }
,
  {name_ko:"도탄 자세", name_en:"Ricochet Stance", feat_level:8, prerequisites:"", traits:["로그", "자세"], category:"rogue", summary:"투척 무기가 사거리 내에서 즉시 손으로 돌아옵니다.", desc:'투척 무기가 사거리 내에서 <strong>즉시 손으로 돌아옵니다</strong>.' }
,
  {name_ko:"옆걸음", name_en:"Sidestep", feat_level:8, prerequisites:"", traits:["로그"], category:"rogue", summary:"유발 조건: 당신을 대상으로 한 타격이 실패/대실패합니다.", desc:'<strong>유발 조건:</strong> 당신을 대상으로 한 타격이 실패/대실패합니다. 공격을 인접한 다른 생물에게 <strong>리다이렉트</strong>합니다. 공격자가 새 대상에 대해 다시 굴림.' }
,
  {name_ko:"교활한 타격자", name_en:"Sly Striker", feat_level:8, prerequisites:"은밀 공격. 무방비하지 않은 생물에도 1d6 정밀 피해를 줍니다(은밀 공격 가능 무기/비무장 공격만). 14레벨에 은밀 공격이 3d6 이상이면 2d6.", traits:["로그"], category:"rogue", summary:"무방비하지 않은 생물에도 1d6 정밀 피해를 줍니다(은밀 공격 가능 무기/비무장 공격만).", desc:'<strong>전제조건:</strong> 은밀 공격. 무방비하지 않은 생물에도 <strong>1d6 정밀 피해</strong>를 줍니다(은밀 공격 가능 무기/비무장 공격만). 14레벨에 은밀 공격이 3d6 이상이면 <strong>2d6</strong>.' }
,
  {name_ko:"전리품 빼앗기", name_en:"Swipe Souvenir", feat_level:8, prerequisites:"", traits:["로그"], category:"rogue", summary:"요구사항: 붙잡힌/속박된 상태.", desc:'<strong>요구사항:</strong> 붙잡힌/속박된 상태. 적의 손아귀에서 빠져나가며 물건을 챙깁니다. 탈출 시도 후 성공하면 <strong>도둑질도 시도</strong> 가능.' }
,
  {name_ko:"전술적 진입", name_en:"Tactical Entry", feat_level:8, prerequisites:"은신 달인. 요구사항: 이번 조우에서 은신으로 주도권 굴림, 아직 아무도 행동 안 함. 보폭(반응 유발하지 않음).", traits:["로그"], category:"rogue", summary:"요구사항: 이번 조우에서 은신으로 주도권 굴림, 아직 아무도 행동 안 함.", desc:'<strong>전제조건:</strong> 은신 대가. <strong>요구사항:</strong> 이번 조우에서 은신으로 주도권 굴림, 아직 아무도 행동 안 함. 보폭(반응 유발하지 않음).' }
,
  {name_ko:"체계적 쇠약", name_en:"Methodical Debilitations", feat_level:10, prerequisites:"지략가 라켓, 쇠약 타격. 추가 쇠약 옵션: 측면 공격 불가, 방패 올리기/하위/표준 엄폐에서 상황 보너스 획득 불가(상위 엄폐만 +2).", traits:["로그"], category:"rogue", summary:"추가 쇠약 옵션: 측면 공격 불가, 방패 올리기/하위/표준 엄폐에서 상황 보너스 획득 불가(상위 엄폐만 +2).", desc:'<strong>전제조건:</strong> 지략가 라켓, 쇠약 타격. 추가 쇠약 옵션: 측면 공격 불가, 방패 올리기/하위/표준 엄폐에서 상황 보너스 획득 불가(상위 엄폐만 +2).' }
,
  {name_ko:"날렵한 타격", name_en:"Nimble Strike", feat_level:10, prerequisites:"날렵한 구르기. 날렵한 회피 반응 사용 시 근접 타격도 가능(다중 공격 페널티 미포함/미적용).", traits:["로그"], category:"rogue", summary:"날렵한 회피 반응 사용 시 근접 타격도 가능(다중 공격 페널티 미포함/미적용).", desc:'<strong>전제조건:</strong> 날렵한 구르기. 날렵한 회피 반응 사용 시 <strong>근접 타격도 가능</strong>(다중 공격 페널티 미포함/미적용).' }
,
  {name_ko:"정밀 쇠약", name_en:"Precise Debilitations", feat_level:10, prerequisites:"도둑 라켓, 쇠약 타격. 추가 쇠약 옵션: 당신의 공격에서 추가 2d6 정밀 피해, 대상이 무방비.", traits:["로그"], category:"rogue", summary:"추가 쇠약 옵션: 당신의 공격에서 추가 2d6 정밀 피해, 대상이 무방비.", desc:'<strong>전제조건:</strong> 도둑 라켓, 쇠약 타격. 추가 쇠약 옵션: 당신의 공격에서 <strong>추가 2d6 정밀 피해</strong>, 대상이 <strong>무방비</strong>.' }
,
  {name_ko:"잠행 전문가", name_en:"Sneak Adept", feat_level:10, prerequisites:"은신 달인. 잠행(Sneak) 실패 시 성공으로 취급(대실패는 여전히 가능).", traits:["로그"], category:"rogue", summary:"잠행(Sneak) 실패 시 성공으로 취급(대실패는 여전히 가능).", desc:'<strong>전제조건:</strong> 은신 대가. 잠행(Sneak) 실패 시 <strong>성공으로 취급</strong>(대실패는 여전히 가능).' }
,
  {name_ko:"전술적 쇠약", name_en:"Tactical Debilitations", feat_level:10, prerequisites:"사기꾼 라켓, 쇠약 타격. 추가 쇠약 옵션: 반응 사용 불가, 측면 공격 불가.", traits:["로그"], category:"rogue", summary:"추가 쇠약 옵션: 반응 사용 불가, 측면 공격 불가.", desc:'<strong>전제조건:</strong> 사기꾼 라켓, 쇠약 타격. 추가 쇠약 옵션: 반응 사용 불가, 측면 공격 불가.' }
,
  {name_ko:"잔혹한 쇠약", name_en:"Vicious Debilitations", feat_level:10, prerequisites:"건달 라켓, 쇠약 타격. 추가 쇠약 옵션: 둔기/관통/참격 약점 5, 서투름(clumsy) 1.", traits:["로그"], category:"rogue", summary:"추가 쇠약 옵션: 둔기/관통/참격 약점 5, 서투름(clumsy) 1.", desc:'<strong>전제조건:</strong> 건달 라켓, 쇠약 타격. 추가 쇠약 옵션: 둔기/관통/참격 약점 5, <strong>서투름(clumsy) 1</strong>.' }
,
  {name_ko:"피의 쇠약", name_en:"Bloody Debilitation", feat_level:12, prerequisites:"의학 숙련, 쇠약 타격. 추가 쇠약: 3d6 지속 출혈 피해.", traits:["로그"], category:"rogue", summary:"추가 쇠약: 3d6 지속 출혈 피해.", desc:'<strong>전제조건:</strong> 의학 숙련, 쇠약 타격. 추가 쇠약: <strong>3d6 지속 출혈 피해</strong>.' }
,
  {name_ko:"치명적 쇠약", name_en:"Critical Debilitation", feat_level:12, prerequisites:"쇠약 타격. 치명 성공 시 추가 쇠약: 인내 내성(클래스 DC). 대성공: 무효. 성공: 느려짐 1. 실패: 느려짐 2. 대실패: 다음 턴 종료까지 마비.", traits:["로그", "무력화"], category:"rogue", summary:"치명 성공 시 추가 쇠약: 인내 내성(클래스 DC).", desc:'<strong>전제조건:</strong> 쇠약 타격. 치명 성공 시 추가 쇠약: 인내 내성(클래스 DC). 대성공: 무효. 성공: 느려짐 1. 실패: 느려짐 2. 대실패: 다음 턴 종료까지 마비.' }
,
  {name_ko:"환상적 도약", name_en:"Fantastic Leap", feat_level:12, prerequisites:"", traits:["로그"], category:"rogue", summary:"높이뛰기/멀리뛰기 시도(높이뛰기도 멀리뛰기 길이로 계산). 도약 종료 시 근접 타격 가능. 도약 높이 이하 추락이면 피해 없이 착지.", desc:'높이뛰기/멀리뛰기 시도(높이뛰기도 멀리뛰기 길이로 계산). 도약 종료 시 근접 타격 가능. 도약 높이 이하 추락이면 피해 없이 착지.' }
,
  {name_ko:"낙하 사격", name_en:"Felling Shot", feat_level:12, prerequisites:"", traits:["로그"], category:"rogue", summary:"무방비한 생물에 원거리 타격. 명중하고 피해를 주면 반사 내성(클래스 DC). 실패: 최대 120피트 추락(피해 없음). 대실패: 추락 + 다음 턴까지 비행 불가.", desc:'무방비한 생물에 원거리 타격. 명중하고 피해를 주면 반사 내성(클래스 DC). 실패: 최대 120피트 추락(피해 없음). 대실패: 추락 + 다음 턴까지 비행 불가.' }
,
  {name_ko:"준비", name_en:"Preparation", feat_level:12, prerequisites:"", traits:["로그", "화려함"], category:"rogue", summary:"전장을 조사합니다. 다음 턴 시작 전까지 아무 로그 반응에 사용할 수 있는 추가 반응 1회.", desc:'전장을 조사합니다. 다음 턴 시작 전까지 아무 로그 반응에 사용할 수 있는 <strong>추가 반응 1회</strong>.' }
,
  {name_ko:"반응적 간섭", name_en:"Reactive Interference", feat_level:12, prerequisites:"", traits:["로그"], category:"rogue", summary:"유발 조건: 인접 적이 반응을 시작합니다.", desc:'<strong>유발 조건:</strong> 인접 적이 반응을 시작합니다. 레벨 이하 생물이면 자동 방해, 높은 레벨이면 AC에 대해 명중 굴림 — 성공 시 방해.' }
,
  {name_ko:"도탄 속임", name_en:"Ricochet Feint", feat_level:12, prerequisites:"도탄 자세. 도탄 자세 중 근접 도달이 아닌 투척 무기 첫 사거리 증분 내 생물에게도 속임(Feint) 가능.", traits:["로그"], category:"rogue", summary:"도탄 자세 중 근접 도달이 아닌 투척 무기 첫 사거리 증분 내 생물에게도 속임(Feint) 가능.", desc:'<strong>전제조건:</strong> 도탄 자세. 도탄 자세 중 근접 도달이 아닌 투척 무기 첫 사거리 증분 내 생물에게도 <strong>속임(Feint)</strong> 가능.' }
,
  {name_ko:"그림자에서 도약", name_en:"Spring from the Shadows", feat_level:12, prerequisites:"", traits:["로그", "화려함"], category:"rogue", summary:"숨어있다가 적을 공격합니다. 이동 속도까지 보폭하되 숨겨진/미탐지 적에 인접하게 종료. 그 적에게 타격(타격 전까지 숨겨진/미탐지 유지).", desc:'숨어있다가 적을 공격합니다. 이동 속도까지 보폭하되 숨겨진/미탐지 적에 인접하게 종료. 그 적에게 타격(타격 전까지 숨겨진/미탐지 유지).' }
,
  {name_ko:"방어적 구르기", name_en:"Defensive Roll", feat_level:14, prerequisites:"", traits:["로그"], category:"rogue", summary:"빈도: 10분에 1회.", desc:'<strong>빈도:</strong> 10분에 1회. <strong>유발 조건:</strong> 물리 공격이 HP 0으로 만들려 합니다. 구르며 충격을 분산시켜 <strong>절반 피해</strong>.' }
,
  {name_ko:"즉시 빈틈", name_en:"Instant Opening", feat_level:14, prerequisites:"", traits:["로그", "집중"], category:"rogue", summary:"30피트 내 대상 1명이 다음 턴 종료까지 당신의 공격에 무방비. 청각 또는 시각 특성.", desc:'30피트 내 대상 1명이 다음 턴 종료까지 당신의 공격에 <strong>무방비</strong>. 청각 또는 시각 특성.' }
,
  {name_ko:"빈틈 남기기", name_en:"Leave an Opening", feat_level:14, prerequisites:"", traits:["로그"], category:"rogue", summary:"무방비한 적에 치명 타격 시, 반격 타격(Reactive Strike) 반응이 있는 아군 1명이 마치 적이 조작 행동을 사용한 것처럼 반격 타격을 유발합니다.", desc:'무방비한 적에 치명 타격 시, 반격 타격(Reactive Strike) 반응이 있는 아군 1명이 마치 적이 조작 행동을 사용한 것처럼 <strong>반격 타격을 유발</strong>합니다.' }
,
  {name_ko:"감각 못 느낀 것 감지", name_en:"Sense the Unseen", feat_level:14, prerequisites:"", traits:["로그"], category:"rogue", summary:"", desc:'<strong>유발 조건:</strong> 탐색에 실패. 미탐지 생물을 자동 감지하여 <strong>숨겨진</strong>으로.' }
,
  {name_ko:"일어나지 마!", name_en:"Stay Down!", feat_level:14, prerequisites:"운동 달인. 유발 조건: 도달 내 엎드린 적이 일어나려 합니다. 운동 판정(적의 인내 DC). 성공: 행동 방해, 적이 엎드린 상태 유지. 대성공: 다음 턴까지 일어나기 불가.", traits:["로그"], category:"rogue", summary:"운동 판정(적의 인내 DC).", desc:'<strong>전제조건:</strong> 운동 대가. <strong>유발 조건:</strong> 도달 내 엎드린 적이 일어나려 합니다. 운동 판정(적의 인내 DC). 성공: 행동 방해, 적이 엎드린 상태 유지. 대성공: 다음 턴까지 일어나기 불가.' }
,
  {name_ko:"백지 상태", name_en:"Blank Slate", feat_level:16, prerequisites:"기만 전설. 탐지/폭로/관찰 마법이 당신을 감지하지 못합니다(상쇄 랭크 10 이상 효과만 가능).", traits:["로그"], category:"rogue", summary:"탐지/폭로/관찰 마법이 당신을 감지하지 못합니다(상쇄 랭크 10 이상 효과만 가능).", desc:'<strong>전제조건:</strong> 기만 전설. 탐지/폭로/관찰 마법이 당신을 감지하지 못합니다(상쇄 랭크 10 이상 효과만 가능).' }
,
  {name_ko:"구름 걷기", name_en:"Cloud Step", feat_level:16, prerequisites:"곡예 전설. 보폭 시 물, 공기, 제한 중량 표면 위를 걸을 수 있습니다. 턴 종료 시 정상적으로 추락/침몰.", traits:["로그"], category:"rogue", summary:"보폭 시 물, 공기, 제한 중량 표면 위를 걸을 수 있습니다.", desc:'<strong>전제조건:</strong> 곡예 전설. 보폭 시 물, 공기, 제한 중량 표면 위를 걸을 수 있습니다. 턴 종료 시 정상적으로 추락/침몰.' }
,
  {name_ko:"인지적 허점", name_en:"Cognitive Loophole", feat_level:16, prerequisites:"", traits:["로그"], category:"rogue", summary:"유발 조건: 턴이 종료됩니다.", desc:'<strong>유발 조건:</strong> 턴이 종료됩니다. <strong>요구사항:</strong> 정신 효과의 영향을 받고 있어야. 정신 효과의 허점을 찾아 다음 턴 종료까지 <strong>해당 효과를 무시</strong>합니다. 효과당 1회만. <strong>특수:</strong> 정신 효과가 반응을 막아도 사용 가능.' }
,
  {name_ko:"마법 베기", name_en:"Dispelling Slice", feat_level:16, prerequisites:"", traits:["로그"], category:"rogue", summary:"무방비한 대상에 타격. 은밀 공격 피해를 주면 대상의 활성 주문 1개를 상쇄 시도(랭크 = 레벨 절반 올림, 수정치 = 클래스 DC - 10).", desc:'무방비한 대상에 타격. 은밀 공격 피해를 주면 대상의 활성 주문 1개를 <strong>상쇄 시도</strong>(랭크 = 레벨 절반 올림, 수정치 = 클래스 DC - 10).' }
,
  {name_ko:"완벽한 교란", name_en:"Perfect Distraction", feat_level:16, prerequisites:"기만 전설. 미끼를 남기고 잠행. 오도(mislead) 주문처럼 작동하지만 투명이 아닌 미탐지. 미끼를 계속 이동시킬 수 있음. 다시 사용하려면 10분 준비 필요.", traits:["로그"], category:"rogue", summary:"미끼를 남기고 잠행. 오도(mislead) 주문처럼 작동하지만 투명이 아닌 미탐지. 미끼를 계속 이동시킬 수 있음. 다시 사용하려면 10분 준비 필요.", desc:'<strong>전제조건:</strong> 기만 전설. 미끼를 남기고 잠행. <em>오도(mislead)</em> 주문처럼 작동하지만 투명이 아닌 미탐지. 미끼를 계속 이동시킬 수 있음. 다시 사용하려면 10분 준비 필요.' }
,
  {name_ko:"장면 재구성", name_en:"Reconstruct the Scene", feat_level:16, prerequisites:"", traits:["로그", "집중"], category:"rogue", summary:"1분간 작은 장소를 조사하여 지난 하루 동안 일어난 사건에 대한 불명확한 인상을 받습니다(전체 사건과 시간대, 중요 단서, 기억에 남는 무기나 복장 등).", desc:'1분간 작은 장소를 조사하여 지난 하루 동안 일어난 사건에 대한 <strong>불명확한 인상</strong>을 받습니다(전체 사건과 시간대, 중요 단서, 기억에 남는 무기나 복장 등).' }
,
  {name_ko:"신속 회피", name_en:"Swift Elusion", feat_level:16, prerequisites:"곡예 전설. 유발 조건: 적이 인접하게 이동을 종료합니다. 곡예 판정(적의 반사 DC). 성공 시 적에 인접한 다른 칸으로 보폭하거나 적을 인접한 다른 칸으로 이동.", traits:["로그"], category:"rogue", summary:"곡예 판정(적의 반사 DC).", desc:'<strong>전제조건:</strong> 곡예 전설. <strong>유발 조건:</strong> 적이 인접하게 이동을 종료합니다. 곡예 판정(적의 반사 DC). 성공 시 적에 인접한 다른 칸으로 보폭하거나 적을 인접한 다른 칸으로 이동.' }
,
  {name_ko:"불가능한 침투", name_en:"Implausible Infiltration", feat_level:18, prerequisites:"곡예 전설, 빠른 비집기. 요구사항: 바닥이나 수직 벽에 인접. 미세한 틈을 찾아 벽이나 바닥을 통과합니다(나무/석고/돌만, 10피트 이하, 금속 불가).", traits:["로그", "마법", "이동"], category:"rogue", summary:"요구사항: 바닥이나 수직 벽에 인접.", desc:'<strong>전제조건:</strong> 곡예 전설, 빠른 비집기. <strong>요구사항:</strong> 바닥이나 수직 벽에 인접. 미세한 틈을 찾아 벽이나 바닥을 <strong>통과</strong>합니다(나무/석고/돌만, 10피트 이하, 금속 불가).' }
,
  {name_ko:"불가능한 구매", name_en:"Implausible Purchase", feat_level:18, prerequisites:"예측 구매. 물건을 사고 나서도 선견 계획자를 사용 가능하며, 1행동으로 꺼냄. 하루 5회까지 레벨보다 6 낮은 일반 소모품을 꺼낼 수 있습니다.", traits:["로그"], category:"rogue", summary:"물건을 사고 나서도 선견 계획자를 사용 가능하며, 1행동으로 꺼냄.", desc:'<strong>전제조건:</strong> 예측 구매. 물건을 사고 나서도 선견 계획자를 사용 가능하며, <strong>1행동으로 꺼냄</strong>. 하루 5회까지 레벨보다 6 낮은 일반 소모품을 꺼낼 수 있습니다.' }
,
  {name_ko:"강력한 은밀", name_en:"Powerful Sneak", feat_level:18, prerequisites:"", traits:["로그"], category:"rogue", summary:"은밀 공격 피해가 정밀 피해에 대한 면역/저항을 무시합니다. 잠행 후 미탐지 상태에서 지정한 생물 1명에 대한 다음 공격에서, 은밀 공격 주사위가 3 미만이면 3으로 취급.", desc:'은밀 공격 피해가 정밀 피해에 대한 <strong>면역/저항을 무시</strong>합니다. 잠행 후 미탐지 상태에서 지정한 생물 1명에 대한 다음 공격에서, 은밀 공격 주사위가 <strong>3 미만이면 3</strong>으로 취급.' }
,
  {name_ko:"숨겨진 모범", name_en:"Hidden Paragon", feat_level:20, prerequisites:"은신 전설. 빈도: 시간당 1회. 유발 조건: 모든 적에게 숨겨짐/미탐지 상태가 됩니다. 1분간 투명(적대적 행동을 해도). 폭로의 빛이나 참된 시야로도 드러나지 않지만 탐색은 정상.", traits:["로그"], category:"rogue", summary:"1분간 투명(적대적 행동을 해도).", desc:'<strong>전제조건:</strong> 은신 전설. <strong>빈도:</strong> 시간당 1회. <strong>유발 조건:</strong> 모든 적에게 숨겨짐/미탐지 상태가 됩니다. <strong>1분간 투명</strong>(적대적 행동을 해도). 폭로의 빛이나 참된 시야로도 드러나지 않지만 탐색은 정상.' }
,
  {name_ko:"불가능한 타격자", name_en:"Impossible Striker", feat_level:20, prerequisites:"교활한 타격자. 교활한 타격자의 피해 대신, 무방비하지 않은 대상에게도 전체 은밀 공격 피해를 줄 수 있습니다.", traits:["로그"], category:"rogue", summary:"교활한 타격자의 피해 대신, 무방비하지 않은 대상에게도 전체 은밀 공격 피해를 줄 수 있습니다.", desc:'<strong>전제조건:</strong> 교활한 타격자. 교활한 타격자의 피해 대신, 무방비하지 않은 대상에게도 <strong>전체 은밀 공격 피해</strong>를 줄 수 있습니다.' }
,
  {name_ko:"반응적 교란", name_en:"Reactive Distraction", feat_level:20, prerequisites:"기만 전설, 완벽한 교란. 유발 조건: 공격/효과의 대상이 되거나 영역 내에 있습니다. 요구사항: 완벽한 교란이 준비됨. 미끼와 자리를 바꿉니다. 완벽한 교란을 사용하되, 은폐/엄폐 위치에서 잠행 종료 필요. 미끼가 대신 대상이 됩니다.", traits:["로그", "집중", "조작"], category:"rogue", summary:"당신은 학문이나 헌신이 아닌, 당신조차 완전히 이해하지 못하는 이세계 후원자의 대리인으로서 강력한 마법을 구사합니다. 이 존재는 은밀한 신격, 강력한 페이, 고대의 영혼, 또는 다른 강대한 초자연적 존재일 수 있지만 — 그 본질은 당신에게도 타인에게도 마찬가지로 미스터", desc:'<strong>전제조건:</strong> 기만 전설, 완벽한 교란. <strong>유발 조건:</strong> 공격/효과의 대상이 되거나 영역 내에 있습니다. <strong>요구사항:</strong> 완벽한 교란이 준비됨. 미끼와 자리를 바꿉니다. 완벽한 교란을 사용하되, 은폐/엄폐 위치에서 잠행 종료 필요. 미끼가 대신 대상이 됩니다.' }
,
  {name_ko:"킥킥 웃음", name_en:"Cackle", feat_level:1, prerequisites:"", traits:["위치", "청각", "집중", "위치"], category:"witch", summary:"불길한 웃음으로 유지 가능한 주술의 지속 시간을 연장합니다. 활성 주술 1개의 지속 시간이 이번 턴 종료가 아닌 다음 턴 종료까지 연장됩니다.", desc:'불길한 웃음으로 유지 가능한 주술의 지속 시간을 연장합니다. 활성 주술 1개의 지속 시간이 이번 턴 종료가 아닌 <strong>다음 턴 종료까지</strong> 연장됩니다.' }
,
  {name_ko:"가마솥", name_en:"Cauldron", feat_level:1, prerequisites:"", traits:["위치"], category:"witch", summary:"마법 양조에 사용하는 특별한 가마솥을 가지고 있습니다. 가마솥으로 포션과 기름을 양조할 수 있으며, 제작 판정 대신 후원자 전통의 기술을 사용합니다. 일일 준비 시 소모품 2개를 무료로 양조(레벨보다 6 이상 낮은 일반 포션/기름).", desc:'마법 양조에 사용하는 특별한 가마솥을 가지고 있습니다. 가마솥으로 <strong>포션과 기름을 양조</strong>할 수 있으며, 제작 판정 대신 후원자 전통의 기술을 사용합니다. 일일 준비 시 소모품 2개를 무료로 양조(레벨보다 6 이상 낮은 일반 포션/기름).' }
,
  {name_ko:"반격 주문", name_en:"Counterspell", feat_level:1, prerequisites:"", traits:["위치"], category:"witch", summary:"유발 조건: 준비한 주문과 같은 주문이 시전됩니다.", desc:'<strong>유발 조건:</strong> 준비한 주문과 같은 주문이 시전됩니다. 해당 주문을 소비하여 <strong>상쇄</strong> 시도.' }
,
  {name_ko:"주문 도달", name_en:"Reach Spell", feat_level:1, prerequisites:"", traits:["위치", "집중", "주문변형"], category:"witch", summary:"주문 사거리 30피트 증가(접촉이면 30피트로).", desc:'주문 사거리 <strong>30피트 증가</strong>(접촉이면 30피트로).' }
,
  {name_ko:"주문 확장", name_en:"Widen Spell", feat_level:1, prerequisites:"", traits:["위치", "조작", "주문변형"], category:"witch", summary:"폭발/원뿔/직선 영역을 확장합니다.", desc:'폭발/원뿔/직선 영역 확장.' }
,
  {name_ko:"위치의 무장", name_en:"Witch's Armaments", feat_level:1, prerequisites:"", traits:["위치"], category:"witch", summary:"후원자가 전투에서 살아남는 법을 가르쳤습니다. 경갑에 숙련됩니다. 경갑 전문가/달인을 얻을 때 경갑에도 적용. 또한 군용 무기 1개 그룹을 선택하여 단순 무기로 취급.", desc:'사역마를 통로로 하여 후원자가 주문시전 능력을 부여합니다. 후원자의 전통으로 주문을 시전합니다. 매일 아침 사역마와 교감하여 주문을 준비합니다. 사역마가 알고 있는 주문에서 선택하여 주문 슬롯에 준비합니다.' }
,
  {name_ko:'위치의 무장', name_en:'Witch\'s Armaments', feat_level:1, prerequisites:'', traits:['위치'], category:'witch', summary:'후원자가 전투에서 살아남는 법을 가르쳤습니다. 경갑에 숙련됩니다. 경갑 전문가/달인을 얻을 때 경갑에도 적용. 또한 군용 무기 1개 그룹을 선택', desc:'후원자가 전투에서 살아남는 법을 가르쳤습니다. <strong>경갑에 숙련</strong>됩니다. 경갑 전문가/달인을 얻을 때 경갑에도 적용. 또한 군용 무기 1개 그룹을 선택하여 단순 무기로 취급.'}
,
  {name_ko:"기본 교훈", name_en:"Basic Lesson", feat_level:2, prerequisites:"", traits:["위치"], category:"witch", summary:"후원자의 기본 교훈 1개를 배워 주술 캔트립 1개와 사역마에 주문 1개를 추가합니다.", desc:'후원자의 기본 교훈 1개를 배워 <strong>주술 캔트립 1개</strong>와 사역마에 주문 1개를 추가합니다.' }
,
  {name_ko:"캔트립 확장", name_en:"Cantrip Expansion", feat_level:2, prerequisites:"", traits:["위치"], category:"witch", summary:"매일 캔트립 2개를 추가로 준비할 수 있습니다.", desc:'매일 <strong>캔트립 2개를 추가</strong>로 준비.' }
,
  {name_ko:"주문 은닉", name_en:"Conceal Spell", feat_level:2, prerequisites:"", traits:["위치", "집중", "주문변형"], category:"witch", summary:"다음 주문 시전에 미묘한(subtle) 특성을 부여하여 주문시전의 시각적 징후를 숨깁니다. 기만 DC에 대한 지각 판정에 성공하지 않으면 주문시전을 알아채지 못합니다.", desc:'다음 주문에 <strong>미묘한 특성</strong>을 부여하여 주문시전 징후를 숨깁니다.' }
,
  {name_ko:"강화된 사역마", name_en:"Enhanced Familiar", feat_level:2, prerequisites:"", traits:["위치"], category:"witch", summary:"매일 2개 대신 4개의 사역마 능력을 선택합니다.", desc:'매일 <strong>4개의 사역마 능력</strong> 선택.' }
,
  {name_ko:"사역마의 언어", name_en:"Familiar's Language", feat_level:2, prerequisites:"", traits:["위치"], category:"witch", summary:"사역마가 선택한 언어 1개를 말할 수 있습니다(텔레파시나 입으로). 추가 언어를 배울 때마다 사역마에게도 부여 가능.", desc:'사역마를 얻습니다(212페이지 규칙).' }
,
  {name_ko:'사역마의 언어', name_en:'Familiar\'s Language', feat_level:2, prerequisites:'', traits:['위치'], category:'witch', summary:'사역마가 선택한 언어 1개를 말할 수 있습니다(텔레파시나 입으로). 추가 언어를 배울 때마다 사역마에게도 부여 가능.', desc:'사역마가 선택한 언어 1개를 <strong>말할 수 있습니다</strong>(텔레파시나 입으로). 추가 언어를 배울 때마다 사역마에게도 부여 가능.'}
,
  {name_ko:"소집 의식", name_en:"Rites of Convocation", feat_level:4, prerequisites:"", traits:["위치"], category:"witch", summary:"10분간의 의식으로 주문 슬롯의 준비된 주문을 다른 주문으로 교환할 수 있습니다(사역마가 아는 같은 랭크 주문으로). 하루 1회.", desc:'10분간의 의식으로 주문 슬롯의 준비된 주문을 다른 주문으로 <strong>교환</strong>할 수 있습니다(사역마가 아는 같은 랭크 주문으로). 하루 1회.' }
,
  {name_ko:"공감 타격", name_en:"Sympathetic Strike", feat_level:4, prerequisites:"", traits:["위치", "주문변형"], category:"witch", summary:"다음 행동이 단일 대상 주문 시전이고 대상에게 피해를 주면, 피해를 받은 대상에 인접한 다른 생물 1명도 절반 피해를 받습니다(같은 피해 유형).", desc:'다음 행동이 단일 대상 주문 시전이고 대상에게 피해를 주면, 피해를 받은 대상에 인접한 다른 생물 1명도 <strong>절반 피해</strong>를 받습니다(같은 피해 유형).' }
,
  {name_ko:"의식용 칼", name_en:"Ceremonial Knife", feat_level:6, prerequisites:"", traits:["위치"], category:"witch", summary:"특별한 의식용 칼로 주문시전을 강화합니다. 칼을 들고 피해를 주는 주문을 시전하면, 주문 랭크의 절반만큼 추가 참격 피해(최소 1).", desc:'특별한 의식용 칼로 주문시전을 강화합니다. 칼을 들고 피해를 주는 주문을 시전하면, 주문 랭크의 절반만큼 <strong>추가 참격 피해</strong>(최소 1).' }
,
  {name_ko:"상급 교훈", name_en:"Greater Lesson", feat_level:6, prerequisites:"", traits:["위치"], category:"witch", summary:"후원자의 상급 교훈 1개를 배워 주술 1개와 사역마에 주문 1개를 추가합니다.", desc:'후원자의 상급 교훈 1개를 배워 <strong>주술 1개</strong>와 사역마에 주문 1개를 추가합니다.' }
,
  {name_ko:"안정된 주문시전", name_en:"Steady Spellcasting", feat_level:6, prerequisites:"", traits:["위치"], category:"witch", summary:"반응이 주문시전을 방해하려 하면 DC 15 단순 판정. 성공 시 방해 안 됨.", desc:'반응이 주문시전을 방해하려 하면 <strong>DC 15 단순 판정</strong>. 성공 시 방해 안 됨.' }
,
  {name_ko:'위치의 책임', name_en:'Witch\'s Charge', feat_level:6, prerequisites:'', traits:['위치'], category:'witch', summary:'아군 1명을 선택하여 "책임"으로 지정합니다. 책임에 대한 주문에 +1 상태 보너스(주문 공격과 DC). 다른 아군을 지정하면 이전 지정 해제.', desc:'아군 1명을 선택하여 "책임"으로 지정합니다. 책임에 대한 주문에 <strong>+1 상태 보너스</strong>(주문 공격과 DC). 다른 아군을 지정하면 이전 지정 해제.'}
,
  {name_ko:"놀라운 사역마", name_en:"Incredible Familiar", feat_level:8, prerequisites:"", traits:["위치"], category:"witch", summary:"매일 6개의 사역마 능력을 선택합니다.", desc:'매일 <strong>6개의 사역마 능력</strong>을 선택합니다.' }
,
  {name_ko:"암시 시야", name_en:"Murksight", feat_level:8, prerequisites:"", traits:["위치"], category:"witch", summary:"마법 어둠에서도 보거나, 안개/연기 같은 시야 방해 효과를 무시합니다. 상위 암시야(greater darkvision) 또는 비마법 시야 방해 효과 무시(선택).", desc:'마법 어둠에서도 보거나, 안개/연기 같은 시야 방해 효과를 무시합니다. <strong>상위 암시야(greater darkvision)</strong> 또는 비마법 시야 방해 효과 무시(선택).' }
,
  {name_ko:"영혼 사역마", name_en:"Spirit Familiar", feat_level:8, prerequisites:"", traits:["위치"], category:"witch", summary:"사역마가 영적 형태를 취할 수 있습니다. 턴에 1행동으로 사역마를 비물질(incorporeal)로 전환하거나 복귀. 비물질 상태에서 물리 피해에 저항하지만 힘(force) 피해에 약합니다.", desc:'사역마가 영적 형태를 취할 수 있습니다. 턴에 1행동으로 사역마를 <strong>비물질(incorporeal)</strong>로 전환하거나 복귀. 비물질 상태에서 물리 피해에 저항하지만 힘(force) 피해에 약합니다.' }
,
  {name_ko:"바느질 사역마", name_en:"Stitched Familiar", feat_level:8, prerequisites:"", traits:["위치"], category:"witch", summary:"사역마를 여러 생물의 부품으로 만들었습니다. 사역마에 추가 능력 1개를 항상 부여하며, 이것은 매일 변경 불가.", desc:'사역마를 여러 생물의 부품으로 만들었습니다. 사역마에 <strong>추가 능력 1개</strong>를 항상 부여하며, 이것은 매일 변경 불가.' }
,
  {name_ko:'위치의 병', name_en:'Witch\'s Bottle', feat_level:8, prerequisites:'', traits:['위치'], category:'witch', summary:'특수한 병에 집중 에너지를 저장합니다. 재집중(Refocus) 시 1점 대신 집중 풀을 완전히 채웁니다.', desc:'특수한 병에 집중 에너지를 저장합니다. 재집중(Refocus) 시 1점 대신 <strong>집중 풀을 완전히 채웁니다</strong>.'}
,
  {name_ko:"두 배, 두 배", name_en:"Double, Double", feat_level:10, prerequisites:"", traits:["위치"], category:"witch", summary:"주술 캔트립을 시전할 때, 같은 턴에 두 번째 주술 캔트립도 시전할 수 있습니다(일반 턴당 1주술 제한 무시, 캔트립에만).", desc:'주술 캔트립을 시전할 때, 같은 턴에 <strong>두 번째 주술 캔트립</strong>도 시전할 수 있습니다(일반 턴당 1주술 제한 무시, 캔트립에만).' }
,
  {name_ko:"주요 교훈", name_en:"Major Lesson", feat_level:10, prerequisites:"", traits:["위치"], category:"witch", summary:"후원자의 주요 교훈 1개를 배워 주술 1개와 사역마에 주문 1개를 추가합니다.", desc:'후원자의 주요 교훈 1개를 배워 <strong>주술 1개</strong>와 사역마에 주문 1개를 추가합니다.' }
,
  {name_ko:"빠른 시전", name_en:"Quickened Casting", feat_level:10, prerequisites:"", traits:["위치", "집중", "주문변형"], category:"witch", summary:"", desc:'<strong>빈도:</strong> 하루 1회. 다음 행동이 캔트립이거나 가장 높은 슬롯보다 2랭크 이상 낮은 주문이면, 시전 <strong>행동 수 1 감소</strong>(최소 1).' }
,
  {name_ko:'위치의 교감', name_en:'Witch\'s Communion', feat_level:10, prerequisites:'', traits:['위치'], category:'witch', summary:'다른 위치(또는 유사한 마법 사용자)와 10분간 의식을 행하여 서로의 사역마에서 임시 주문 1개를 준비할 수 있습니다.', desc:'다른 위치(또는 유사한 마법 사용자)와 10분간 의식을 행하여 서로의 사역마에서 <strong>임시 주문 1개</strong>를 준비할 수 있습니다.'}
,
  {name_ko:"의식 주문", name_en:"Coven Spell", feat_level:12, prerequisites:"", traits:["위치"], category:"witch", summary:"위치 2명 이상이 함께 10분간 의식하여, 일반적으로 시전할 수 없는 의식 주문 1개를 협력 시전합니다.", desc:'위치 2명 이상이 함께 10분간 의식하여, 일반적으로 시전할 수 없는 <strong>의식 주문 1개</strong>를 협력 시전합니다.' }
,
  {name_ko:"주술 집중", name_en:"Hex Focus", feat_level:12, prerequisites:"", traits:["위치"], category:"witch", summary:"재집중 시 집중 풀을 완전히 채웁니다.", desc:'재집중 시 집중 풀을 <strong>완전히 채웁니다</strong>.' }
,
  {name_ko:'위치의 빗자루', name_en:'Witch\'s Broom', feat_level:12, prerequisites:'', traits:['위치'], category:'witch', summary:'빗자루(또는 유사한 탈것)에 마법을 부여하여 비행할 수 있게 합니다. 하루에 최대 1시간 비행 가능(연속일 필요 없음). 비행 속도는 이동 속도와 같습니다.', desc:'빗자루(또는 유사한 탈것)에 마법을 부여하여 <strong>비행</strong>할 수 있게 합니다. 하루에 최대 1시간 비행 가능(연속일 필요 없음). 비행 속도는 이동 속도와 같습니다.'}
,
  {name_ko:'후원자의 존재감', name_en:'Patron\'s Presence', feat_level:14, prerequisites:'', traits:['위치'], category:'witch', summary:'후원자의 초자연적 존재감이 당신을 통해 발산됩니다. 30피트 내 적이 당신에게 공포 효과의 의지 내성에 -2 상태 페널티.', desc:'후원자의 초자연적 존재감이 당신을 통해 발산됩니다. 30피트 내 적이 당신에게 공포 효과의 의지 내성에 <strong>-2 상태 페널티</strong>.'}
,
  {name_ko:"주문 반사", name_en:"Reflect Spell", feat_level:14, prerequisites:"반격 주문. 반격 주문으로 상쇄에 대성공하면, 주문을 시전자에게 되돌려보냅니다(시전자가 새 대상이 됨).", traits:["위치"], category:"witch", summary:"상쇄에 대성공하면 주문을 시전자에게 되돌립니다.", desc:'<strong>전제조건:</strong> 반격 주문. 상쇄에 대성공하면 주문을 <strong>시전자에게 되돌립니다</strong>.' }
,
  {name_ko:"변환 의식", name_en:"Rites of Transfiguration", feat_level:14, prerequisites:"", traits:["위치"], category:"witch", summary:"10분간의 의식으로 준비된 변신(polymorph) 주문을 같은 랭크의 다른 변신 주문으로 교환합니다(사역마가 알아야 함).", desc:'10분간의 의식으로 준비된 <strong>변신(polymorph) 주문</strong>을 같은 랭크의 다른 변신 주문으로 교환합니다(사역마가 알아야 함).' }
,
  {name_ko:'후원자의 존재감', name_en:'Patron\'s Presence', feat_level:14, prerequisites:'', traits:['위치'], category:'witch', summary:'후원자의 초자연적 존재감이 당신을 통해 발산됩니다. 30피트 내 적이 당신에게 공포 효과의 의지 내성에 -2 상태 페널티.', desc:'후원자의 초자연적 존재감이 당신을 통해 발산됩니다. 30피트 내 적이 당신에게 공포 효과의 의지 내성에 <strong>-2 상태 페널티</strong>.'}
,
  {name_ko:"무의식적 집중", name_en:"Effortless Concentration", feat_level:16, prerequisites:"", traits:["위치"], category:"witch", summary:"", desc:'<strong>유발 조건:</strong> 턴 시작. 활성 위자드 주문 1개의 지속 시간을 즉시 연장.' }
,
  {name_ko:"힘 흡수", name_en:"Siphon Power", feat_level:16, prerequisites:"", traits:["위치"], category:"witch", summary:"주문 슬롯이 바닥났어도 가장 높은 랭크이 아닌 주문 1개를 하루에 추가 시전 가능.", desc:'주문 슬롯이 바닥났어도 가장 높은 랭크가 아닌 <strong>주문 1개를 하루에 추가 시전</strong> 가능.' }
,
  {name_ko:"주술 분열", name_en:"Split Hex", feat_level:18, prerequisites:"", traits:["위치"], category:"witch", summary:"단일 대상 주술 시전 시, 사거리 내 두 번째 대상에게도 같은 주술을 적용할 수 있습니다.", desc:'단일 대상 주술 시전 시, 사거리 내 <strong>두 번째 대상에게도</strong> 같은 주술을 적용할 수 있습니다.' }
,
  {name_ko:'후원자의 주장', name_en:'Patron\'s Claim', feat_level:18, prerequisites:'', traits:['위치'], category:'witch', summary:'후원자가 적에게 표식을 남겨 저주합니다. 주술로 피해를 준 적에게 1분간 -2 상태 페널티(내성 굴림)를 부여합니다.', desc:'후원자가 적에게 표식을 남겨 저주합니다. 주술로 피해를 준 적에게 1분간 <strong>-2 상태 페널티</strong>(내성 굴림)를 부여합니다.'}
,
  {name_ko:"주술 달인", name_en:"Hex Master", feat_level:20, prerequisites:"", traits:["위치"], category:"witch", summary:"턴당 주술 1개 제한이 해제됩니다. 원하는 만큼 주술을 사용할 수 있습니다.", desc:'턴당 주술 1개 제한이 <strong>해제</strong>됩니다. 원하는 만큼 주술을 사용할 수 있습니다.' }
,
  {name_ko:'후원자의 진실', name_en:'Patron\'s Truth', feat_level:20, prerequisites:'', traits:['위치'], category:'witch', summary:'전제조건: 후원자의 선물. 추가 10랭크 주문 슬롯을 얻습니다.', desc:'<strong>전제조건:</strong> 후원자의 선물. <strong>추가 10랭크 주문 슬롯</strong>을 얻습니다.'}
,
  {name_ko:'위치의 오두막', name_en:'Witch\'s Hut', feat_level:20, prerequisites:'', traits:['위치'], category:'witch', summary:'후원자의 힘으로 거주지를 만들어냅니다. 매그니피센트 맨션(magnificent mansion)과 유사하지만, 다리 달린 오두막 형태로 이동할 수 있습니다.', desc:'후원자의 힘으로 거주지를 만들어냅니다. <em>매그니피센트 맨션(magnificent mansion)</em>과 유사하지만, 다리 달린 오두막 형태로 이동할 수 있습니다.'}
,
  {name_ko:"반격 주문", name_en:"Counterspell", feat_level:1, prerequisites:"", traits:["위자드"], category:"wizard", summary:"", desc:'<strong>유발 조건:</strong> 준비한 주문과 같은 주문이 시전됩니다. 해당 주문을 소비하여 <strong>상쇄</strong> 시도.' }
,
  {name_ko:"사역마", name_en:"Familiar", feat_level:1, prerequisites:"", traits:["위자드"], category:"wizard", summary:"사역마를 얻습니다. HP는 레벨x5, AC/내성/감지/기술은 당신의 수치를 사용합니다.", desc:'사역마를 얻습니다(212페이지 규칙).' }
,
  {name_ko:"주문 도달", name_en:"Reach Spell", feat_level:1, prerequisites:"", traits:["위자드", "집중", "주문변형"], category:"wizard", summary:"주문 사거리 30피트 증가(접촉이면 30피트로).", desc:'주문 사거리 <strong>30피트 증가</strong>(접촉이면 30피트로).' }
,
  {name_ko:"주문서 신동", name_en:"Spellbook Prodigy", feat_level:1, prerequisites:"", traits:["위자드"], category:"wizard", summary:"주문서 관리에 놀라운 재능이 있습니다. 주문서의 시작 캔트립이 10개에서 12개로 증가. 레벨을 올릴 때 추가 주문이 2개에서 3개로 증가.", desc:'주문서 관리에 놀라운 재능이 있습니다. 주문서의 시작 캔트립이 10개에서 <strong>12개</strong>로 증가. 레벨을 올릴 때 추가 주문이 2개에서 <strong>3개</strong>로 증가.' }
,
  {name_ko:"주문 확장", name_en:"Widen Spell", feat_level:1, prerequisites:"", traits:["위자드", "조작", "주문변형"], category:"wizard", summary:"폭발/원뿔/직선 영역 확장.", desc:'폭발/원뿔/직선 영역 확장.' }
,
  {name_ko:"캔트립 확장", name_en:"Cantrip Expansion", feat_level:2, prerequisites:"", traits:["위자드"], category:"wizard", summary:"매일 캔트립 2개를 추가로 준비.", desc:'매일 <strong>캔트립 2개를 추가</strong>로 준비.' }
,
  {name_ko:"주문 은닉", name_en:"Conceal Spell", feat_level:2, prerequisites:"", traits:["위자드", "집중", "주문변형"], category:"wizard", summary:"다음 주문에 미묘한 특성을 부여하여 주문시전 징후를 숨깁니다.", desc:'다음 주문에 <strong>미묘한 특성</strong>을 부여하여 주문시전 징후를 숨깁니다.' }
,
  {name_ko:"강화된 사역마", name_en:"Enhanced Familiar", feat_level:2, prerequisites:"", traits:["위자드"], category:"wizard", summary:"매일 4개의 사역마 능력 선택.", desc:'매일 <strong>4개의 사역마 능력</strong> 선택.' }
,
  {name_ko:"에너지 삭마", name_en:"Energy Ablation", feat_level:2, prerequisites:"", traits:["위자드", "주문변형"], category:"wizard", summary:"유발 조건: 주문으로 피해를 줍니다.", desc:'<strong>유발 조건:</strong> 주문으로 피해를 줍니다. 주문의 에너지 잔재가 피해를 받은 대상의 저항을 약화시킵니다. 피해를 받은 대상 1명이 다음 턴 시작까지 주문의 피해 유형에 <strong>약점 1</strong>(5레벨에 2, 10레벨에 3, 15레벨에 4, 20레벨에 5).' }
,
  {name_ko:"비치명 주문", name_en:"Nonlethal Spell", feat_level:2, prerequisites:"", traits:["위자드", "조작", "주문변형"], category:"wizard", summary:"다음 주문에 비치명(nonlethal) 특성을 부여하여 대상을 죽이지 않고 기절시킵니다.", desc:'다음 주문에 <strong>비치명(nonlethal) 특성</strong>을 부여하여 대상을 죽이지 않고 기절시킵니다.' }
,
  {name_ko:"마법 주입 타격", name_en:"Bespell Strikes", feat_level:4, prerequisites:"", traits:["위자드"], category:"wizard", summary:"캔트립이 아닌 주문을 시전한 후 턴 종료까지, 무기와 비무장 공격에 주문의 에너지가 깃듭니다. 무기/비무장 타격이 추가 1d6 피해를 입힙니다(피해 유형은 시전한 주문에서 선택 가능한 에너지 유형, 없으면 힘(force)).", desc:'캔트립이 아닌 주문을 시전한 후 턴 종료까지, 무기와 비무장 공격에 주문의 에너지가 깃듭니다. 무기/비무장 타격이 <strong>추가 1d6 피해</strong>를 입힙니다(피해 유형은 시전한 주문에서 선택 가능한 에너지 유형, 없으면 힘(force)).' }
,
  {name_ko:"마법 도구 소환", name_en:"Call Wizardly Tools", feat_level:4, prerequisites:"", traits:["위자드"], category:"wizard", summary:"마법 아이템 1개를 원거리에서 손으로 소환합니다. 60피트 내이고 볼 수 있어야 합니다.", desc:'마법 아이템 1개를 원거리에서 손으로 소환합니다. 60피트 내이고 볼 수 있어야 합니다.' }
,
  {name_ko:"연결 집중", name_en:"Linked Focus", feat_level:4, prerequisites:"비전 유대, 학파 주문. 결합 아이템 소진으로 학파 주문을 시전하면, 집중 포인트 1점도 회복합니다.", traits:["위자드"], category:"wizard", summary:"결합 아이템 소진으로 학파 주문을 시전하면, 집중 포인트 1점도 회복합니다.", desc:'<strong>전제조건:</strong> 비전 유대, 학파 주문. 결합 아이템 소진으로 학파 주문을 시전하면, <strong>집중 포인트 1점도 회복</strong>합니다.' }
,
  {name_ko:"주문 보호 배열", name_en:"Spell Protection Array", feat_level:4, prerequisites:"", traits:["위자드"], category:"wizard", summary:"주문서에 보호 룬 배열을 새겨 자신을 보호합니다. 일일 준비 시 에너지 유형 1개를 선택하여 해당 유형에 저항 5(11레벨에 10, 17레벨에 15).", desc:'주문서에 보호 룬 배열을 새겨 자신을 보호합니다. 일일 준비 시 에너지 유형 1개를 선택하여 해당 유형에 <strong>저항 5</strong>(11레벨에 10, 17레벨에 15).' }
,
  {name_ko:"설득력 있는 환영", name_en:"Convincing Illusion", feat_level:6, prerequisites:"", traits:["위자드"], category:"wizard", summary:"환영(illusion) 주문에 대한 불신 DC가 +2 증가합니다.", desc:'환영(illusion) 주문에 대한 불신 DC가 <strong>+2 증가</strong>합니다.' }
,
  {name_ko:"폭발적 도착", name_en:"Explosive Arrival", feat_level:6, prerequisites:"", traits:["위자드"], category:"wizard", summary:"유발 조건: 순간이동 효과로 도착합니다.", desc:'<strong>유발 조건:</strong> 순간이동 효과로 도착합니다. 도착 시 10피트 방사 내 모든 생물에게 레벨 절반 × 1d6 피해(기본 반사 내성). 에너지 유형은 일일 준비 시 선택.' }
,
  {name_ko:"저항 불가 마법", name_en:"Irresistible Magic", feat_level:6, prerequisites:"", traits:["위자드"], category:"wizard", summary:"주문에 대한 적의 첫 내성이 대성공이면, 일반 성공으로 취급합니다(대상당 주문당 1회).", desc:'주문에 대한 적의 첫 내성이 대성공이면, <strong>일반 성공</strong>으로 취급합니다(대상당 주문당 1회).' }
,
  {name_ko:"분할 슬롯", name_en:"Split Slot", feat_level:6, prerequisites:"", traits:["위자드"], category:"wizard", summary:"일일 준비 시, 하나의 주문 슬롯을 2랭크 낮은 슬롯 2개로 분할할 수 있습니다(각각 다른 주문 준비).", desc:'일일 준비 시, 하나의 주문 슬롯을 <strong>2랭크 낮은 슬롯 2개</strong>로 분할할 수 있습니다(각각 다른 주문 준비).' }
,
  {name_ko:"안정된 주문시전", name_en:"Steady Spellcasting", feat_level:6, prerequisites:"", traits:["위자드"], category:"wizard", summary:"반응이 주문시전을 방해하려 하면 DC 15 단순 판정. 성공 시 방해 안 됨.", desc:'반응이 주문시전을 방해하려 하면 <strong>DC 15 단순 판정</strong>. 성공 시 방해 안 됨.' }
,
  {name_ko:"고급 학파 주문", name_en:"Advanced School Spell", feat_level:8, prerequisites:"", traits:["위자드"], category:"wizard", summary:"학파의 고급 학파 주문을 얻습니다.", desc:'학파의 <strong>고급 학파 주문</strong>을 얻습니다.' }
,
  {name_ko:"유대 보존", name_en:"Bond Conservation", feat_level:8, prerequisites:"", traits:["위자드", "주문변형"], category:"wizard", summary:"다음 행동이 결합 아이템 소진으로 재시전하는 것이면, 원래 주문보다 2랭크 이상 낮은 다른 준비 주문 1개도 추가 시전 가능(소진이 그 주문도 커버).", desc:'다음 행동이 결합 아이템 소진으로 재시전하는 것이면, 원래 주문보다 2랭크 이상 낮은 <strong>다른 준비 주문 1개도 추가 시전</strong> 가능(소진이 그 주문도 커버).' }
,
  {name_ko:"형태 유지", name_en:"Form Retention", feat_level:8, prerequisites:"", traits:["위자드"], category:"wizard", summary:"변신(polymorph) 주문의 지속 시간이 2배가 됩니다(최대 1시간까지만).", desc:'변신(polymorph) 주문의 지속 시간이 2배가 됩니다(최대 1시간까지만).' }
,
  {name_ko:"지식이 힘", name_en:"Knowledge is Power", feat_level:8, prerequisites:"", traits:["위자드"], category:"wizard", summary:"지식 회상으로 생물을 성공적으로 식별하면, 해당 생물에 대한 주문의 DC에 +1 상황 보너스(턴 종료까지). 대성공이면 +2.", desc:'지식 회상으로 생물을 성공적으로 식별하면, 해당 생물에 대한 주문의 DC에 <strong>+1 상황 보너스</strong>(턴 종료까지). 대성공이면 <strong>+2</strong>.' }
,
  {name_ko:"압도적 에너지", name_en:"Overwhelming Energy", feat_level:10, prerequisites:"", traits:["위자드", "조작", "주문변형"], category:"wizard", summary:"다음 주문이 대상의 에너지 저항을 레벨만큼 무시합니다. 면역은 무효.", desc:'다음 주문이 대상의 에너지 <strong>저항을 레벨만큼 무시</strong>합니다. 면역은 무효.' }
,
  {name_ko:"빠른 시전", name_en:"Quickened Casting", feat_level:10, prerequisites:"", traits:["위자드", "집중", "주문변형"], category:"wizard", summary:"", desc:'<strong>빈도:</strong> 하루 1회. 다음 행동이 캔트립이거나 가장 높은 슬롯보다 2랭크 이상 낮은 주문이면, 시전 <strong>행동 수 1 감소</strong>(최소 1).' }
,
  {name_ko:"두루마리 전문가", name_en:"Scroll Adept", feat_level:10, prerequisites:"", traits:["위자드"], category:"wizard", summary:"일일 준비 시, 임시 두루마리 1개를 무료로 만듭니다(레벨보다 2랭크 이상 낮은 주문서의 주문). 다음 준비 시 만료.", desc:'일일 준비 시, 임시 두루마리 1개를 무료로 만듭니다(레벨보다 2랭크 이상 낮은 주문서의 주문). 다음 준비 시 만료.' }
,
  {name_ko:"영리한 반격 주문", name_en:"Clever Counterspell", feat_level:12, prerequisites:"반격 주문. 같은 주문이 아니어도 같은 전통에서 유사한 랭크 이상 주문으로 반격 가능(상쇄 판정 필요).", traits:["위자드"], category:"wizard", summary:"같은 주문이 아니어도 같은 전통에서 유사한 랭크 이상 주문으로 반격 가능(상쇄 판정 필요).", desc:'<strong>전제조건:</strong> 반격 주문. 같은 주문이 아니어도 같은 <strong>전통에서 유사한 랭크 이상 주문</strong>으로 반격 가능(상쇄 판정 필요).' }
,
  {name_ko:"강제 에너지", name_en:"Forcible Energy", feat_level:12, prerequisites:"", traits:["위자드"], category:"wizard", summary:"에너지 삭마의 약점이 추가 3(기존에 더해)으로 증가합니다.", desc:'에너지 삭마의 약점이 <strong>추가 3</strong>(기존에 더해)으로 증가합니다.' }
,
  {name_ko:"예리한 마법 탐지", name_en:"Keen Magical Detection", feat_level:12, prerequisites:"", traits:["위자드"], category:"wizard", summary:"항상 마법 탐지(detect magic)가 활성화된 것처럼 마법 아우라를 감지합니다. 1행동으로 30피트 방사 내 모든 마법 아우라의 위치와 학파를 파악합니다.", desc:'항상 <em>마법 탐지(detect magic)</em>가 활성화된 것처럼 마법 아우라를 감지합니다. 1행동으로 30피트 방사 내 모든 마법 아우라의 위치와 학파를 파악합니다.' }
,
  {name_ko:"마법 감각", name_en:"Magic Sense", feat_level:12, prerequisites:"", traits:["위자드"], category:"wizard", summary:"부정확 마법 감각 30피트를 얻어, 마법 아우라를 감지할 수 있습니다. 물질적 감각처럼 탐색(Seek)으로 정확한 위치를 파악할 수 있습니다.", desc:'<strong>부정확 마법 감각 30피트</strong>를 얻어, 마법 아우라를 감지할 수 있습니다. 물질적 감각처럼 탐색(Seek)으로 정확한 위치를 파악할 수 있습니다.' }
,
  {name_ko:"결합 집중", name_en:"Bonded Focus", feat_level:14, prerequisites:"비전 유대, 학파 주문. 재집중(Refocus) 시 집중 풀을 완전히 채웁니다.", traits:["위자드"], category:"wizard", summary:"재집중(Refocus) 시 집중 풀을 완전히 채웁니다.", desc:'<strong>전제조건:</strong> 비전 유대, 학파 주문. 재집중(Refocus) 시 집중 풀을 <strong>완전히 채웁니다</strong>.' }
,
  {name_ko:"주문 반사", name_en:"Reflect Spell", feat_level:14, prerequisites:"반격 주문. 상쇄에 대성공하면 주문을 시전자에게 되돌립니다.", traits:["위자드"], category:"wizard", summary:"", desc:'<strong>전제조건:</strong> 반격 주문. 상쇄에 대성공하면 주문을 <strong>시전자에게 되돌립니다</strong>.' }
,
  {name_ko:"이차 폭발 배열", name_en:"Secondary Detonation Array", feat_level:14, prerequisites:"", traits:["위자드"], category:"wizard", summary:"주문 보호 배열의 에너지를 방출합니다. [반응]으로 보호 배열의 저항 유형과 같은 에너지로 30피트 내 적에게 레벨 × 1d4 피해(기본 반사 내성). 사용 후 보호 배열의 저항이 다음 준비까지 사라집니다.", desc:'주문 보호 배열의 에너지를 방출합니다. [반응]으로 보호 배열의 저항 유형과 같은 에너지로 30피트 내 적에게 <strong>레벨 × 1d4 피해</strong>(기본 반사 내성). 사용 후 보호 배열의 저항이 다음 준비까지 사라집니다.' }
,
  {name_ko:"상위 결합", name_en:"Superior Bond", feat_level:14, prerequisites:"", traits:["위자드"], category:"wizard", summary:"결합 아이템 소진을 하루 2회 사용 가능.", desc:'결합 아이템 소진을 <strong>하루 2회</strong> 사용 가능.' }
,
  {name_ko:"무의식적 집중", name_en:"Effortless Concentration", feat_level:16, prerequisites:"", traits:["위자드"], category:"wizard", summary:"", desc:'<strong>유발 조건:</strong> 턴 시작. 활성 위자드 주문 1개의 지속 시간을 즉시 연장.' }
,
  {name_ko:"빛나는 주문", name_en:"Scintillating Spell", feat_level:16, prerequisites:"", traits:["위자드", "조작", "주문변형"], category:"wizard", summary:"다음 주문이 시각적으로 찬란하게 빛납니다. 피해를 받은 생물이 눈부심(dazzled) 1라운드(치명 실패 시 실명(blinded) 1라운드 후 눈부심).", desc:'다음 주문이 시각적으로 찬란하게 빛납니다. 피해를 받은 생물이 <strong>눈부심(dazzled) 1라운드</strong>(치명 실패 시 <strong>실명(blinded) 1라운드</strong> 후 눈부심).' }
,
  {name_ko:"주문 수선", name_en:"Spell Tinker", feat_level:16, prerequisites:"", traits:["위자드", "집중"], category:"wizard", summary:"유지 중인 주문의 매개변수를 변경합니다. 유지 중인 주문 1개의 영역/대상/기타 변수를 재설정할 수 있습니다(GM 판단에 따라 허용 범위 결정).", desc:'유지 중인 주문의 매개변수를 변경합니다. 유지 중인 주문 1개의 영역/대상/기타 변수를 재설정할 수 있습니다(GM 판단에 따라 허용 범위 결정).' }
,
  {name_ko:"무한한 가능성", name_en:"Infinite Possibilities", feat_level:18, prerequisites:"", traits:["위자드"], category:"wizard", summary:"주문 슬롯이 바닥났어도 가장 높은 랭크이 아닌 주문 1개를 하루에 추가 시전 가능.", desc:'주문 슬롯이 바닥났어도 가장 높은 랭크가 아닌 <strong>주문 1개를 하루에 추가 시전</strong> 가능.' }
,
  {name_ko:"재준비 주문", name_en:"Reprepare Spell", feat_level:18, prerequisites:"", traits:["위자드"], category:"wizard", summary:"빈도: 하루 1회. 10분간 이미 시전한 주문 슬롯 1개에 주문서에서 다른 주문을 재준비합니다.", desc:'<strong>빈도:</strong> 하루 1회. <strong>10분간</strong> 이미 시전한 주문 슬롯 1개에 주문서에서 다른 주문을 <strong>재준비</strong>합니다.' }
,
  {name_ko:"재고", name_en:"Second Thoughts", feat_level:18, prerequisites:"", traits:["위자드"], category:"wizard", summary:"빈도: 하루 1회. 유발 조건: 주문을 시전합니다. 시전한 주문을 취소하고 다른 주문으로 교체하여 즉시 시전합니다(같은 랭크, 같은 행동 수). 원래 주문의 슬롯이 소비되고 새 주문이 시전됩니다.", desc:'<strong>빈도:</strong> 하루 1회. <strong>유발 조건:</strong> 주문을 시전합니다. 시전한 주문을 취소하고 다른 주문으로 <strong>교체하여 즉시 시전</strong>합니다(같은 랭크, 같은 행동 수). 원래 주문의 슬롯이 소비되고 새 주문이 시전됩니다.' }
,
  {name_ko:"대위자드의 힘", name_en:"Archwizard's Might", feat_level:20, prerequisites:"대위자드의 신비학. 추가 10랭크 주문 슬롯을 얻습니다.", traits:["위자드"], category:"wizard", summary:"추가 10랭크 주문 슬롯을 얻습니다.", desc:"마법의 절정에 도달합니다. <strong>추가 10랭크 주문 슬롯 1개</strong>를 얻습니다. 이 슬롯에는 10랭크 주문 1개를 준비할 수 있습니다." }
,
  {name_ko:"주문 조합", name_en:"Spell Combination", feat_level:20, prerequisites:"", traits:["위자드"], category:"wizard", summary:"두 주문을 하나로 결합하여 동시에 시전합니다. 같은 대상/영역의 주문 2개를 동시에 시전하며 각각의 슬롯을 소비합니다.", desc:'두 주문을 하나로 결합하여 동시에 시전합니다. 같은 대상/영역의 주문 2개를 동시에 시전하며 각각의 슬롯을 소비합니다.' }
,
  {name_ko:"주문 통달", name_en:"Spell Mastery", feat_level:20, prerequisites:"", traits:["위자드"], category:"wizard", summary:"주문서 없이도 특정 주문을 항상 준비합니다. 주문 4개를 선택하여 항상 준비된 것으로 취급(일일 준비 없이, 슬롯 소비 없이). 각 주문은 하루 1회만.", desc:'주문서 없이도 특정 주문을 항상 준비합니다. 주문 4개를 선택하여 <strong>항상 준비된 것으로</strong> 취급(일일 준비 없이, 슬롯 소비 없이). 각 주문은 하루 1회만.' }
,
  {name_ko:"주문변형 통달", name_en:"Spellshape Mastery", feat_level:20, prerequisites:"", traits:["위자드"], category:"wizard", summary:"주문변형 재주 1개를 선택합니다. 해당 주문변형을 사용할 때 자유 행동으로 사용할 수 있습니다(1행동 대신).", desc:'주문변형 재주 1개를 선택합니다. 해당 주문변형을 사용할 때 <strong>자유 행동</strong>으로 사용할 수 있습니다(1행동 대신).' }
,
  {name_ko:'대위자드의 힘', name_en:'Archwizard\'s Might', feat_level:20, prerequisites:'', traits:['위자드'], category:'wizard', summary:'전제조건: 대위자드의 주문학. 추가 10랭크 주문 슬롯을 얻습니다.', desc:'<strong>전제조건:</strong> 대위자드의 주문학. <strong>추가 10랭크 주문 슬롯</strong>을 얻습니다.'}
,
  {name_ko:"양자 혈통", name_en:"Adopted Ancestry", feat_level:1, prerequisites:"", traits:["일반"], category:"general", summary:"당신은 혈통에 속하지 않는 문화에서 자랐거나 그 문화와 깊은 유대를 맺었습니다. 다른 혈통 1개를 선택합니다. 해당 혈통의 혈통 재주에 접근할 수 있습니다.", desc:'당신은 혈통에 속하지 않는 문화에서 자랐거나 그 문화와 깊은 유대를 맺었습니다. 다른 혈통 1개를 선택합니다. 해당 혈통의 혈통 재주에 <strong>접근</strong>할 수 있습니다.' }
,
  {name_ko:"갑옷 숙련", name_en:"Armor Proficiency", feat_level:1, prerequisites:"", traits:["일반"], category:"general", summary:"갑옷의 한 유형에 숙련됩니다. 경갑, 평갑, 또는 평갑을 선택합니다. 해당 갑옷에 숙련됩니다. 이미 숙련이면 대신 전문가가 됩니다.", desc:'갑옷의 한 유형에 숙련됩니다. 경갑, 평갑, 또는 중갑을 선택합니다. 해당 갑옷에 <strong>숙련</strong>됩니다. 이미 숙련이면 대신 전문가가 됩니다.<br><strong>특수:</strong> 여러 번 선택 가능. 매번 다른 갑옷 유형.' }
,
  {name_ko:"호흡 조절", name_en:"Breath Control", feat_level:1, prerequisites:"", traits:["일반"], category:"general", summary:"놀라운 폐활량을 가지고 있습니다. 숨을 평소의 25배까지 참을 수 있어, 질식 전에 5분간의 라운드를 가지지 않고 훨씬 더 오래 버틸 수 있습니다. 또한 흡입(inhaled) 위협에 대한 내성 굴림에 +1 상황 보너스를 얻고, 숨을 참는 동안 이러한 위협으로부터 피해를", desc:'놀라운 폐활량을 가지고 있습니다. 숨을 <strong>평소의 25배</strong>까지 참을 수 있어, 질식 전에 5분간의 라운드를 가지지 않고 훨씬 더 오래 버틸 수 있습니다. 또한 흡입(inhaled) 위협에 대한 내성 굴림에 <strong>+1 상황 보너스</strong>를 얻고, 숨을 참는 동안 이러한 위협으로부터 피해를 받을 위험이 줄어듭니다.' }
,
  {name_ko:"영리한 직관", name_en:"Canny Acumen", feat_level:1, prerequisites:"", traits:["일반"], category:"general", summary:"특정 분야에서 천부적 재능이 있습니다. 인내 내성, 반사 내성, 의지 내성, 또는 지각 중 하나를 선택합니다. 해당 능력치에서 숙련도가 전문가로 증가합니다. 17레벨에서 선택한 능력치의 숙련도가 전문가이면 달인으로 증가합니다.", desc:'특정 분야에서 천부적 재능이 있습니다. 인내 내성, 반사 내성, 의지 내성, 또는 감지 중 하나를 선택합니다. 해당 능력치에서 숙련도가 <strong>전문가</strong>로 증가합니다. 17레벨에서 선택한 능력치의 숙련도가 전문가이면 <strong>대가</strong>로 증가합니다.' }
,
  {name_ko:"불굴", name_en:"Diehard", feat_level:1, prerequisites:"", traits:["일반"], category:"general", summary:"쓰러지기까지 시간이 걸립니다. 빈사(dying) 4가 아닌 빈사 5에서 죽습니다.", desc:'쓰러지기까지 시간이 걸립니다. 빈사(dying) 4가 아닌 <strong>빈사 5</strong>에서 죽습니다.' }
,
  {name_ko:"빠른 회복", name_en:"Fast Recovery", feat_level:1, prerequisites:"건강 +2", traits:["일반"], category:"general", summary:"몸이 고통에서 빠르게 회복합니다. 쉬면서 평소의 두 배의 HP를 회복합니다. 진행 중인 질병이나 독에 대한 인내 내성에 성공할 때마다 단계를 1 대신 2만큼 감소시키고(맹독은 1), 대성공 시 3만큼 감소(맹독은 2). 또한 밤에 쉴 때 소진(drained) 상태를 1", desc:'<strong>전제조건:</strong> 건강 +2<br>몸이 고통에서 빠르게 회복합니다. 쉬면서 평소의 <strong>두 배의 HP</strong>를 회복합니다. 진행 중인 질병이나 독에 대한 인내 내성에 성공할 때마다 단계를 1 대신 <strong>2만큼 감소</strong>시키고(맹독은 1), 대성공 시 3만큼 감소(맹독은 2). 또한 밤에 쉴 때 소진(drained) 상태를 1 대신 <strong>2만큼 줄입니다</strong>.' }
,
  {name_ko:"깃털 걸음", name_en:"Feather Step", feat_level:1, prerequisites:"민첩 +2", traits:["일반"], category:"general", summary:"조심스럽고 빠르게 걷습니다. 험지(difficult terrain)로 한 걸음(Step)을 할 수 있습니다.", desc:'<strong>전제조건:</strong> 민첩 +2<br>조심스럽고 빠르게 걷습니다. 험지(difficult terrain)로 <strong>한 걸음(Step)</strong>을 할 수 있습니다.' }
,
  {name_ko:"민첩함", name_en:"Fleet", feat_level:1, prerequisites:"", traits:["일반"], category:"general", summary:"도보로 더 빠르게 이동합니다. 이동 속도가 5피트 증가합니다.", desc:'도보로 더 빠르게 이동합니다. 이동 속도가 <strong>5피트 증가</strong>합니다.' }
,
  {name_ko:"놀라운 주도권", name_en:"Incredible Initiative", feat_level:1, prerequisites:"", traits:["일반"], category:"general", summary:"다른 이보다 더 빠르게 반응합니다. 주도권 굴림에 +2 상황 보너스.", desc:'다른 이보다 더 빠르게 반응합니다. 주도권 굴림에 <strong>+2 상황 보너스</strong>.' }
,
  {name_ko:"반려동물", name_en:"Pet", feat_level:1, prerequisites:"", traits:["일반"], category:"general", summary:"충성스러운 반려동물이 있습니다 — 고양이, 새, 또는 설치류 같은 작은(Tiny) 동물. 하수인(minion) 특성을 가지며 동물 명령으로 2행동을 얻습니다(자연학 판정 불필요). 반려동물은 타격을 할 수 없습니다.", desc:'충성스러운 반려동물이 있습니다 — 고양이, 새, 또는 설치류 같은 작은(Tiny) 동물. 하수인(minion) 특성을 가지며 동물 명령으로 2행동을 얻습니다(자연학 판정 불필요). 반려동물은 타격을 할 수 없습니다.<br><strong>레벨:</strong> 당신과 같음. <strong>HP:</strong> 레벨당 5. <strong>내성/AC:</strong> 당신과 같음(상황/상태 보너스 전). <strong>감지/곡예/은신:</strong> 3 + 레벨. <strong>속도:</strong> 25피트.<br><strong>반려동물 능력 2개를 선택:</strong> 양서류, 굴착(5피트), 등반(25피트), 암시야, 반향정위(20피트 정확 청각), 빠른 이동(25→40피트), 비행(25피트), 손 조작(조작 행동 가능), 후각(30피트 부정확), 강인(HP +레벨당 2).<br><strong>특수:</strong> 이 재주를 재훈련하여 새 반려동물을 얻을 수 있습니다. 사역마나 다른 동료를 얻으면 이 재주를 즉시 재훈련 가능.' }
,
  {name_ko:"기마", name_en:"Ride", feat_level:1, prerequisites:"", traits:["일반"], category:"general", summary:"타고 있는 동물에게 이동 행동(보폭 등)을 명령할 때, 판정을 시도하지 않고 자동으로 성공합니다. 타고 있는 동물은 하수인처럼 당신의 턴에 행동합니다. 조우 중간에 동물에 탑승하면, 다음 턴을 건너뛰고 그다음 턴부터 행동합니다.", desc:'타고 있는 동물에게 이동 행동(보폭 등)을 명령할 때, 판정을 시도하지 않고 <strong>자동으로 성공</strong>합니다. 타고 있는 동물은 하수인처럼 당신의 턴에 행동합니다. 조우 중간에 동물에 탑승하면, 다음 턴을 건너뛰고 그다음 턴부터 행동합니다.' }
,
  {name_ko:"방패 막기", name_en:"Shield Block", feat_level:1, prerequisites:"", traits:["일반"], category:"general", summary:"방패를 제자리에 눌러 타격을 막습니다. 방패의 경도(Hardness)만큼 피해를 방지합니다. 남은 피해를 당신과 방패가 각각 받으며, 방패가 파손되거나 파괴될 수 있습니다.", desc:'<strong>유발 조건:</strong> 방패를 올린 상태에서 공격으로 물리적 피해(둔기, 관통, 참격)를 받으려 합니다.<br>방패를 제자리에 눌러 타격을 막습니다. 방패의 경도(Hardness)만큼 피해를 <strong>방지</strong>합니다. 남은 피해를 당신과 방패가 각각 받으며, 방패가 파손되거나 파괴될 수 있습니다.' }
,
  {name_ko:"강인함", name_en:"Toughness", feat_level:1, prerequisites:"", traits:["일반"], category:"general", summary:"대부분보다 더 많은 벌을 견딥니다. 최대 HP를 레벨만큼 증가시킵니다. 회복 판정의 DC를 1 줄입니다.", desc:'대부분보다 더 많은 벌을 견딥니다. 최대 HP를 <strong>레벨만큼 증가</strong>시킵니다. 회복 판정의 DC를 <strong>1 줄입니다</strong>(411페이지).' }
,
  {name_ko:"무기 숙련", name_en:"Weapon Proficiency", feat_level:1, prerequisites:"", traits:["일반"], category:"general", summary:"모든 군용 무기에 숙련됩니다. 이미 모든 군용 무기에 숙련이면, 선택한 고급 무기 1개에 숙련됩니다. 11레벨 이상이면 이 무기에 전문가도 됩니다.", desc:'모든 군용 무기에 숙련됩니다. 이미 모든 군용 무기에 숙련이면, 선택한 고급 무기 1개에 숙련됩니다. 11레벨 이상이면 이 무기에 <strong>전문가</strong>도 됩니다.<br><strong>특수:</strong> 여러 번 선택 가능. 매번 다른 고급 무기에 숙련.' }
,
  {name_ko:"조상의 모범", name_en:"Ancestral Paragon", feat_level:3, prerequisites:"", traits:["일반"], category:"general", summary:"1레벨 혈통 재주 1개를 추가로 얻습니다.", desc:'<strong>1레벨 혈통 재주 1개</strong>를 추가로 얻습니다.' }
,
  {name_ko:"선견 계획자", name_en:"Prescient Planner", feat_level:3, prerequisites:"", traits:["일반"], category:"general", summary:"복잡한 계획과 비상 대책을 정기적으로 세우며, 자원을 사용하여 실행합니다. 1분간 배낭을 뒤져 이전에 선언하지 않았던 구매 아이템을 꺼냅니다 — 필요할 것을 직감하고 가장 최근 기회에 구매한 것입니다. 아이템은 일반 등급, 비소모품이며 배낭에 들어가는 2gp 이하 아이템이어야 하며, 무기/갑옷/연금술/", desc:'<strong>비용:</strong> 선택한 아이템의 가격<br><br>복잡한 계획과 비상 대책을 정기적으로 세우며, 자원을 사용하여 실행합니다. 1분간 배낭을 뒤져 이전에 선언하지 않았던 구매 아이템을 꺼냅니다 — 필요할 것을 직감하고 가장 최근 기회에 구매한 것입니다. 아이템은 모험 장비(291페이지 표)여야 하며, 무기/갑옷/연금술/마법 아이템/보물이 아닌 일반 아이템이어야 합니다. 레벨 절반 이하, 들고 다녀도 과적되지 않을 부피여야 합니다.' }
,
  {name_ko:"비숙련 즉흥연기", name_en:"Untrained Improvisation", feat_level:3, prerequisites:"", traits:["일반"], category:"general", summary:"역량 밖의 상황을 다루는 법을 배웠습니다. 미숙련 기술 판정의 숙련 보너스가 레벨 - 2와 같아집니다. 5레벨에서 레벨 - 1, 7레벨에서 전체 레벨. 이것은 숙련 행동을 허용하지 않습니다.", desc:'역량 밖의 상황을 다루는 법을 배웠습니다. 미숙련 기술 판정의 숙련 보너스가 <strong>레벨 - 2</strong>와 같아집니다. 5레벨에서 레벨 - 1, 7레벨에서 전체 레벨. 이것은 숙련 행동을 허용하지 않습니다.' }
,
  {name_ko:"신속 수색", name_en:"Expeditious Search", feat_level:7, prerequisites:"지각 달인", traits:["일반"], category:"general", summary:"구역을 일반 시간의 절반으로 수색합니다. 전설이면 1/4 시간.", desc:'<strong>전제조건:</strong> 감지 대가<br>구역을 일반 시간의 <strong>절반</strong>으로 수색합니다. 전설이면 1/4 시간.' }
,
  {name_ko:"선견 소모품", name_en:"Prescient Consumable", feat_level:7, prerequisites:"선견 계획자", traits:["일반"], category:"general", summary:"선견 계획자로 모험 장비 대신 소모품 아이템을 꺼낼 수 있습니다. 레벨 절반 이하의 일반 소모품이어야 합니다.", desc:'<strong>전제조건:</strong> 선견 계획자<br>선견 계획자로 모험 장비 대신 <strong>소모품 아이템</strong>을 꺼낼 수 있습니다. 레벨 절반 이하의 일반 소모품이어야 합니다.' }
,
  {name_ko:"놀라운 투자", name_en:"Incredible Investiture", feat_level:11, prerequisites:"매력 +3", traits:["일반"], category:"general", summary:"더 많은 마법 아이템을 투자할 수 있습니다. 투자 아이템 한도가 10에서 12로 증가합니다.", desc:'<strong>전제조건:</strong> 매력 +3<br>더 많은 마법 아이템을 투자할 수 있습니다. 투자 아이템 한도가 10에서 <strong>12</strong>로 증가합니다.' }
,
  {name_ko:"확신", name_en:"Assurance", feat_level:1, prerequisites:"최소 1개 기술에 숙련", traits:["일반 기술"], category:"skill", summary:"특정 과제에 대해 안정적인 결과를 보장할 수 있을 만큼 연습했습니다. 숙련된 기술 1개를 선택합니다. 해당 기술로 판정할 때, 주사위를 굴리지 않고 10 + 숙련 보너스를 결과로 사용할 수 있습니다(다른 보너스, 페널티, 수정치는 적용하지 않음).", desc:'<strong>전제조건:</strong> 최소 1개 기술에 숙련<br>특정 과제에 대해 안정적인 결과를 보장할 수 있을 만큼 연습했습니다. 숙련된 기술 1개를 선택합니다. 해당 기술로 판정할 때, 주사위를 굴리지 않고 <strong>10 + 숙련 보너스</strong>를 결과로 사용할 수 있습니다(다른 보너스, 페널티, 수정치는 적용하지 않음).<br><strong>특수:</strong> 여러 번 선택 가능. 매번 다른 기술.' }
,
  {name_ko:"동물 훈련", name_en:"Train Animal", feat_level:1, prerequisites:"자연학 숙련", traits:["일반 기술"], category:"skill", summary:"다운타임을 소비하여 동물에게 특정 행동을 가르칩니다. 이미 알려진 기본 행동을 강화하거나 새로운 기본 행동을 배우게 할 수 있습니다.", desc:'<strong>전제조건:</strong> 자연학 숙련<br>동물에게 특정 행동을 가르칩니다. 이미 알고 있는 기본 행동을 선택하거나(동물 명령의 행동 목록) 새 기본 행동을 가르칩니다. GM이 DC와 소요 시간을 결정합니다(보통 최소 1주일). 비판적 사고가 필요한 속임수는 보통 불가능합니다. 전문가/대가/전설이면 더 특이한 생물도 훈련 가능(GM 재량).<br><strong>성공:</strong> 동물이 행동을 배웁니다. 이미 알던 행동이면 자연학 판정 없이 명령 가능. 새 행동이면 명령 가능 목록에 추가되지만 판정은 필요.<br>'}
,
  {name_ko:"무거운 짐꾼", name_en:"Hefty Hauler", feat_level:1, prerequisites:"운동 숙련", traits:["일반 기술"], category:"skill", summary:"최대 및 과부하 벌크 한계를 2만큼 증가시킵니다.", desc:"당신의 틀이 암시하는 것 이상을 운반할 수 있습니다. <strong>최대 및 과부하 벌크 한계를 2만큼 증가</strong>시킵니다."}
,
  {name_ko:"흥정 사냥꾼", name_en:"Bargain Hunter", feat_level:1, prerequisites:"외교 숙련", traits:["일반 기술"], category:"skill", summary:"외교를 사용하여 수입을 얻습니다. 흥정을 찾아 이익으로 재판매합니다.", desc:"외교를 사용하여 <strong>수입을 얻을(Earn Income)</strong> 수 있으며, 흥정을 찾아 이익으로 재판매합니다. 특정 물품에 대한 거래를 찾는 데 시간을 보낼 수도 있습니다. 이는 수입 획득처럼 작동하지만 돈 대신 물품을 얻으며, 얻은 수입이 비용 이상이면 무료로 물품을 얻습니다.<br><strong>특수:</strong> 1레벨 캐릭터 생성 시 선택하면 추가 2gp를 시작합니다."}
,
  {name_ko:"의심스러운 지식", name_en:"Dubious Knowledge", feat_level:1, prerequisites:"지식 회상 기술에 숙련", traits:["일반 기술"], category:"skill", summary:"기이하고 때로는 의심스러운 방대한 잡학 지식을 축적했습니다. 지식 회상(Recall Knowledge) 판정에 실패하면, 완전히 실패하는 대신 정확한 정보 1개와 잘못된 정보 1개를 모두 얻습니다. GM이 어떤 것이 정확하고 어떤 것이 잘못된 것인지 결정합니다.", desc:'<strong>전제조건:</strong> 지식 회상 기술에 숙련<br>기이하고 때로는 의심스러운 방대한 잡학 지식을 축적했습니다. 지식 회상(Recall Knowledge) 판정에 실패하면, 완전히 실패하는 대신 <strong>정확한 정보 1개와 잘못된 정보 1개</strong>를 모두 얻습니다. GM이 어떤 것이 정확하고 어떤 것이 잘못된 것인지 결정합니다.' }
,
  {name_ko:"빠른 식별", name_en:"Quick Identification", feat_level:1, prerequisites:"신비학, 자연학, 오컬티즘, 또는 종교학에 숙련", traits:["일반 기술"], category:"skill", summary:"마법 식별(Identify Magic)을 신속하게 수행합니다. 아이템, 진행 중인 효과, 위치의 속성을 결정할 때 10분 대신 1분만 걸립니다. 달인이면 3행동 활동, 전설이면 1행동.", desc:'<strong>전제조건:</strong> 신비학, 자연학, 비학, 또는 종교에 숙련<br>마법 식별(Identify Magic)을 신속하게 수행합니다. 아이템, 진행 중인 효과, 위치의 속성을 결정할 때 10분 대신 <strong>1분</strong>만 걸립니다. 대가이면 3행동 활동, 전설이면 <strong>1행동</strong>.' }
,
  {name_ko:"기술 훈련", name_en:"Skill Training", feat_level:1, prerequisites:"지능 +1", traits:["일반 기술"], category:"skill", summary:"선택한 기술에 숙련됩니다.", desc:'<strong>전제조건:</strong> 지능 +1<br>선택한 기술에 <strong>숙련</strong>됩니다.<br><strong>특수:</strong> 여러 번 선택 가능. 매번 새 기술.' }
,
  {name_ko:"양념 달인", name_en:"Seasoned", feat_level:1, prerequisites:"술 지식, 요리 지식, 또는 제작에 숙련", traits:["일반 기술"], category:"skill", summary:"다양한 음식과 음료의 준비를 마스터했습니다. 음식과 음료를 제작할 때(연금술 제작이 있으면 영약, 마법 제작이 있으면 포션 포함) +1 상황 보너스. 전제조건 기술 중 하나가 달인이면 +2.", desc:'<strong>전제조건:</strong> 술 지식, 요리 지식, 또는 제작에 숙련<br>다양한 음식과 음료의 준비를 마스터했습니다. 음식과 음료를 제작할 때(연금술 제작이 있으면 영약, 마법 제작이 있으면 포션 포함) <strong>+1 상황 보너스</strong>. 전제조건 기술 중 하나가 대가이면 <strong>+2</strong>.' }
,
  {name_ko:"고양이 착지", name_en:"Cat Fall", feat_level:1, prerequisites:"곡예 숙련", traits:["일반 기술"], category:"skill", summary:"추락 시 반사적으로 착지합니다. 추락 피해를 계산할 때 추락 거리를 10피트 줄여 취급합니다. 전문가이면 25피트, 달인이면 50피트 줄이고, 전설이면 추락 피해를 받지 않습니다.", desc:'<strong>전제조건:</strong> 곡예 숙련<br>추락 시 반사적으로 착지합니다. 추락 피해를 계산할 때 추락 거리를 <strong>10피트 줄여</strong> 취급합니다. 전문가이면 25피트, 대가이면 50피트 줄이고, 전설이면 추락 피해를 <strong>받지 않습니다</strong>.' }
,
  {name_ko:"빠른 비집기", name_en:"Quick Squeeze", feat_level:1, prerequisites:"곡예 숙련", traits:["일반 기술"], category:"skill", summary:"비집기(Squeeze) 시 라운드당 5피트로 이동(대성공 시 10피트). 전설이면 전체 속도로.", desc:'<strong>전제조건:</strong> 곡예 숙련<br>비집기(Squeeze) 시 라운드당 <strong>5피트로 이동</strong>(대성공 시 10피트). 전설이면 전체 속도로.' }
,
  {name_ko:"안정된 균형", name_en:"Steady Balance", feat_level:1, prerequisites:"곡예 숙련", traits:["일반 기술"], category:"skill", summary:"악조건에서도 쉽게 균형을 유지합니다. 균형 잡기(Balance) 행동에서 성공 시 대성공이 됩니다. 좁은 표면과 고르지 않은 지면에서 균형을 잡으려 시도할 때 무방비이 되지 않습니다. 또한 곡예 판정으로 반사 내성 대신 모서리 잡기(Grab an Edge)를 시도할 수 ", desc:'<strong>전제조건:</strong> 곡예 숙련<br>악조건에서도 쉽게 균형을 유지합니다. 균형 잡기(Balance) 행동에서 <strong>성공 시 대성공</strong>이 됩니다. 좁은 표면과 고르지 않은 지면에서 균형을 잡으려 시도할 때 <strong>무방비이 되지 않습니다</strong>. 또한 곡예 판정으로 반사 내성 대신 <strong>모서리 잡기(Grab an Edge)</strong>를 시도할 수 있습니다.' }
,
  {name_ko:"빠른 점프", name_en:"Quick Jump", feat_level:1, prerequisites:"운동 숙련", traits:["일반 기술"], category:"skill", summary:"높이뛰기와 멀리뛰기를 2행동 대신 1행동으로 사용할 수 있습니다. 그렇게 하면 초기 보폭을 수행하지 않습니다(10피트 보폭하지 않아서 실패하지도 않음).", desc:'<strong>전제조건:</strong> 운동 숙련<br>높이뛰기와 멀리뛰기를 2행동 대신 <strong>1행동</strong>으로 사용할 수 있습니다. 그렇게 하면 초기 보폭을 수행하지 않습니다(10피트 보폭하지 않아서 실패하지도 않음).' }
,
  {name_ko:"수중 약탈자", name_en:"Underwater Marauder", feat_level:1, prerequisites:"운동 숙련", traits:["일반 기술"], category:"skill", summary:"물속에서 싸우는 법을 배웠습니다. 물속에서 무방비이 되지 않으며, 물속에서 둔기나 참격 근접 무기를 사용할 때 일반적인 페널티를 받지 않습니다.", desc:'<strong>전제조건:</strong> 운동 숙련<br>물속에서 싸우는 법을 배웠습니다. 물속에서 <strong>무방비이 되지 않으며</strong>, 물속에서 둔기나 참격 근접 무기를 사용할 때 일반적인 페널티를 받지 않습니다.' }
,
  {name_ko:"거인 레슬러", name_en:"Titan Wrestler", feat_level:1, prerequisites:"운동 숙련", traits:["일반 기술"], category:"skill", summary:"자신보다 최대 두 크기 큰 생물에게 무장 해제, 조이기, 재배치, 밀기, 넘어뜨리기를 시도할 수 있습니다. 전설이면 세 크기까지.", desc:'<strong>전제조건:</strong> 운동 숙련<br>자신보다 최대 <strong>두 크기 큰 생물</strong>에게 무장 해제, 조이기, 재배치, 밀기, 넘어뜨리기를 시도할 수 있습니다. 전설이면 <strong>세 크기</strong>까지.' }
,
  {name_ko:"빠른 수리", name_en:"Quick Repair", feat_level:1, prerequisites:"제작 숙련", traits:["일반 기술"], category:"skill", summary:"수리(Repair) 활동에서 탐험 특성이 사라지고 10분 대신 1분. 달인이면 3행동, 전설이면 1행동.", desc:'<strong>전제조건:</strong> 제작 숙련<br>수리(Repair) 활동에서 탐험 특성이 사라지고 10분 대신 <strong>1분</strong>. 대가이면 <strong>3행동</strong>, 전설이면 <strong>1행동</strong>.' }
,
  {name_ko:"전문 제작", name_en:"Specialty Crafting", feat_level:1, prerequisites:"제작 숙련", traits:["일반 기술"], category:"skill", summary:"특정 종류의 아이템 제작에 집중 훈련했습니다. 아래 전문 분야 중 하나를 선택합니다; 해당 유형의 아이템을 제작할 때 +1 상황 보너스(달인이면 +2).", desc:'<strong>전제조건:</strong> 제작 숙련<br>특정 종류의 아이템 제작에 집중 훈련했습니다. 아래 전문 분야 중 하나를 선택합니다; 해당 유형의 아이템을 제작할 때 <strong>+1 상황 보너스</strong>(대가이면 +2).<br><strong>전문 분야:</strong> 연금술(연금술 아이템), 예술품(보석 포함 미술품), 대장간(금속 제품/금속 갑옷), 제본(책/종이), 유리 세공, 가죽 세공(가죽 갑옷 포함), 도기, 조선, 석공, 재단, 직조, 목공.' }
,
  {name_ko:"매력적인 거짓말쟁이", name_en:"Charming Liar", feat_level:1, prerequisites:"기만 숙련", traits:["일반 기술"], category:"skill", summary:"매력이 넘치는 거짓말로 상대방이 속은 것을 알게 되어도 당신에게 호감을 느낍니다. 거짓말(Lie)에 성공하면, 대상은 거짓말이 진행되는 동안 당신에 대한 태도가 한 단계 개선됩니다(적대적이 아닌 한). 대화가 끝나면 원래 태도로 돌아갑니다.", desc:'<strong>전제조건:</strong> 기만 숙련<br>매력이 넘치는 거짓말로 상대방이 속은 것을 알게 되어도 당신에게 호감을 느낍니다. 거짓말(Lie)에 <strong>성공하면</strong>, 대상은 거짓말이 진행되는 동안 당신에 대한 태도가 <strong>한 단계 개선</strong>됩니다(적대적이 아닌 한). 대화가 끝나면 원래 태도로 돌아갑니다.' }
,
  {name_ko:"긴 주의 분산", name_en:"Lengthy Diversion", feat_level:1, prerequisites:"기만 숙련", traits:["일반 기술"], category:"skill", summary:"주의 분산(Create a Diversion)에 대성공하면, 턴이 끝난 후에도 숨겨진 상태를 유지합니다. GM이 상황에 따라 지속 시간을 결정합니다(최소 1라운드 추가).", desc:'<strong>전제조건:</strong> 기만 숙련<br>주의 분산(Create a Diversion)에 <strong>대성공</strong>하면, 턴이 끝난 후에도 <strong>숨겨진 상태를 유지</strong>합니다. GM이 상황에 따라 지속 시간을 결정합니다(최소 1라운드 추가).' }
,
  {name_ko:"거짓 간파", name_en:"Lie to Me", feat_level:1, prerequisites:"기만 숙련", traits:["일반 기술"], category:"skill", summary:"기만으로 함정을 놓아 당신을 속이려는 자를 잡을 수 있습니다. 당신에게 거짓말하려는 사람과 대화할 수 있으면, 지각 DC 대신 기만 DC를 사용합니다(더 높은 경우). 일방적인 연설 등에는 적용되지 않습니다.", desc:'<strong>전제조건:</strong> 기만 숙련<br>기만으로 함정을 놓아 당신을 속이려는 자를 잡을 수 있습니다. 당신에게 거짓말하려는 사람과 대화할 수 있으면, 감지 DC 대신 <strong>기만 DC</strong>를 사용합니다(더 높은 경우). 일방적인 연설 등에는 적용되지 않습니다.' }
,
  {name_ko:"집단 인상", name_en:"Group Impression", feat_level:1, prerequisites:"외교 숙련", traits:["일반 기술"], category:"skill", summary:"인상 만들기(Make an Impression) 시 페널티 없이 최대 10명의 대상에게 결과를 비교합니다. 전문가이면 20명, 달인 50명, 전설 100명.", desc:'<strong>전제조건:</strong> 외교 숙련<br>인상 만들기(Make an Impression) 시 페널티 없이 <strong>최대 10명</strong>의 대상에게 결과를 비교합니다. 전문가이면 20명, 대가 50명, 전설 100명.' }
,
  {name_ko:"수다쟁이", name_en:"Hobnobber", feat_level:1, prerequisites:"외교 숙련", traits:["일반 기술"], category:"skill", summary:"대화를 통해 정보를 수집하는 데 능숙합니다. 정보 수집(Gather Information) 탐험 활동이 보통의 절반 시간에 완료됩니다(보통 1시간). 외교 달인이고 정보 수집에 대실패하면 실패가 됩니다. 배운 소문이 정확하다는 보장은 없습니다.", desc:'<strong>전제조건:</strong> 외교 숙련<br>대화를 통해 정보를 수집하는 데 능숙합니다. 정보 수집(Gather Information) 탐험 활동이 보통의 <strong>절반 시간</strong>에 완료됩니다(보통 1시간). 외교 대가이고 정보 수집에 대실패하면 <strong>실패</strong>가 됩니다. 배운 소문이 정확하다는 보장은 없습니다.' }
,
  {name_ko:"진정 안 돼도 괜찮아", name_en:"No Cause for Alarm", feat_level:1, prerequisites:"외교 숙련", traits:["일반 기술", "청각", "집중", "감정", "언어", "정신"], category:"skill", summary:"공포를 줄이려 합니다. 10피트 방사 내 공포(frightened) 상태인 생물의 의지 DC에 대해 외교 판정. 각 생물은 1시간 면역.", desc:'<strong>전제조건:</strong> 외교 숙련<br>공포를 줄이려 합니다. 10피트 방사 내 공포(frightened) 상태인 생물의 의지 DC에 대해 외교 판정. 각 생물은 1시간 면역.<br><strong>대성공:</strong> 공포 수치 2 감소. <strong>성공:</strong> 1 감소.' }
,
  {name_ko:"위협적 노려보기", name_en:"Intimidating Glare", feat_level:1, prerequisites:"위협 숙련", traits:["일반 기술"], category:"skill", summary:"노려보기만으로도 사기 저하(Demoralize)를 할 수 있습니다. 이렇게 하면 사기 저하가 청각 특성을 잃고 시각 특성을 얻으며, 대상이 당신의 언어를 이해하지 못해도 페널티를 받지 않습니다.", desc:'<strong>전제조건:</strong> 위협 숙련<br>노려보기만으로도 사기 저하(Demoralize)를 할 수 있습니다. 이렇게 하면 사기 저하가 청각 특성을 잃고 <strong>시각 특성을 얻으며</strong>, 대상이 당신의 언어를 이해하지 못해도 <strong>페널티를 받지 않습니다</strong>.' }
,
  {name_ko:"빠른 강요", name_en:"Quick Coercion", feat_level:1, prerequisites:"위협 숙련", traits:["일반 기술"], category:"skill", summary:"몇 마디 암시만으로 효과적으로 위협합니다. 1분 대신 1라운드의 대화 후 강요(Coerce)할 수 있습니다. 여전히 전투 중이거나 대화 없이는 강요할 수 없습니다.", desc:'<strong>전제조건:</strong> 위협 숙련<br>몇 마디 암시만으로 효과적으로 위협합니다. 1분 대신 <strong>1라운드의 대화</strong> 후 강요(Coerce)할 수 있습니다. 여전히 전투 중이거나 대화 없이는 강요할 수 없습니다.' }
,
  {name_ko:"집단 강요", name_en:"Group Coercion", feat_level:1, prerequisites:"위협 숙련", traits:["일반 기술"], category:"skill", summary:"고립시키지 않고도 효과적으로 위협합니다. 강요(Coerce) 시 1명 대신 최대 5명에게 결과를 비교합니다. 각 대상에 다른 성공도가 가능합니다. 전문가이면 10명, 달인 25명, 전설 50명.", desc:'<strong>전제조건:</strong> 위협 숙련<br>고립시키지 않고도 효과적으로 위협합니다. 강요(Coerce) 시 1명 대신 <strong>최대 5명</strong>에게 결과를 비교합니다. 각 대상에 다른 성공도가 가능합니다. 전문가이면 10명, 대가 25명, 전설 50명.' }
,
  {name_ko:"독 인식", name_en:"Recognize Poison", feat_level:1, prerequisites:"의학 숙련", traits:["일반 기술"], category:"skill", summary:"유발: 시야 내 생물이 독에 걸리거나, 독이 들어간 음식이나 음료가 당신의 시야 내에 있거나 당신에게 제공됩니다.", desc:'<strong>전제조건:</strong> 의학 숙련<br><strong>유발:</strong> 시야 내 생물이 독에 걸리거나, 독이 들어간 음식이나 음료가 당신의 시야 내에 있거나 당신에게 제공됩니다.<br>독에 대한 의학 지식으로 빠르게 독을 인식합니다. DC 15 의학 판정(독의 DC가 더 높으면 그 DC)을 시도합니다. 성공하면 독의 이름과 일반적인 효과, 가능한 경우 해독제를 알아냅니다.' }
,
  {name_ko:"전투 의료", name_en:"Battle Medicine", feat_level:1, prerequisites:"의학 숙련", traits:["일반 기술", "치유", "조작"], category:"skill", summary:"전장에서 빠르게 상처를 치료합니다. 상처 치료(Treat Wounds) 규칙에 따라 의학 판정을 시도하지만, 10분이 아닌 1행동으로 수행합니다. 대상은 하루 동안(전장 의료와 상처 치료 모두에) 당신의 전투 의료에 면역이 됩니다. 이 면역은 당신이 레벨을 올리면 해제", desc:'<strong>전제조건:</strong> 의학 숙련<br><br>전장에서 빠르게 상처를 치료합니다. 상처 치료(Treat Wounds) 규칙에 따라 의학 판정을 시도하지만, 10분이 아닌 <strong>1행동</strong>으로 수행합니다. 대상은 하루 동안(전장 의료와 상처 치료 모두에) 당신의 전투 의료에 면역이 됩니다. 이 면역은 당신이 레벨을 올리면 해제됩니다.' }
,
  {name_ko:"자연 의학", name_en:"Natural Medicine", feat_level:1, prerequisites:"자연학 숙련", traits:["일반 기술"], category:"skill", summary:"자연 치료제를 적용합니다. 의학 대신 자연학으로 상처 치료를 할 수 있습니다(더 높은 숙련도로 더 어려운 판정도 시도 가능). 상처 치료 외의 의학 용도나 재주 전제조건은 대체하지 않습니다.", desc:'<strong>전제조건:</strong> 자연학 숙련<br>자연 치료제를 적용합니다. 의학 대신 <strong>자연학으로 상처 치료</strong>를 할 수 있습니다(더 높은 숙련도로 더 어려운 판정도 시도 가능). 상처 치료 외의 의학 용도나 재주 전제조건은 대체하지 않습니다.<br>야생에 있으면 신선한 재료에 더 쉽게 접근할 수 있어, GM 판단에 따라 자연학으로 상처 치료 시 <strong>+2 상황 보너스</strong>.' }
,
  {name_ko:"신비 감각", name_en:"Arcane Sense", feat_level:1, prerequisites:"신비학 숙련", traits:["일반 기술"], category:"skill", summary:"마법에 대한 직관적인 감각이 발달했습니다. 마법 감지(Detect Magic) 단순 주문(cantrip)을 신비(arcane) 단순 주문으로 사용할 수 있으며, 이 단순 주문은 신비학 기술로 시전합니다. 신비학 전문가이면 이 주문을 1행동으로 시전할 수 있으며, 달인이", desc:'<strong>전제조건:</strong> 신비학 숙련<br>마법에 대한 직관적인 감각이 발달했습니다. 마법 감지(Detect Magic) 단순 주문(cantrip)을 신비(arcane) 단순 주문으로 사용할 수 있으며, 이 단순 주문은 신비학 기술로 시전합니다. 신비학 전문가이면 이 주문을 1행동으로 시전할 수 있으며, 대가이면 자유 행동으로 사용 가능합니다. 전설이면 수동적(passive)으로 마법 감지의 효과를 지속적으로 얻습니다.' }
,
  {name_ko:"기이한 것 식별", name_en:"Oddity Identification", feat_level:1, prerequisites:"오컬티즘 숙련", traits:["일반 기술"], category:"skill", summary:"마법 효과를 인지하거나 주문이 시전되는 것을 보면, 즉시 그것이 마음을 뒤트는지(정신 특성), 운에 맞서는지(행운/불운 특성), 비밀을 밝히는지(탐지/예측/폭로/관찰 특성) 판단합니다. 이런 효과에 대한 마법 식별이나 지식 회상 시 항상 오컬티즘을 페널티 없이 사용할 수 ", desc:'<strong>전제조건:</strong> 비학 숙련<br>마법 효과를 인지하거나 주문이 시전되는 것을 보면, 즉시 그것이 마음을 뒤트는지(정신 특성), 운에 맞서는지(행운/불운 특성), 비밀을 밝히는지(탐지/예측/폭로/관찰 특성) 판단합니다. 이런 효과에 대한 마법 식별이나 지식 회상 시 항상 <strong>비학</strong>을 페널티 없이 사용할 수 있으며 <strong>+2 상황 보너스</strong>.' }
,
  {name_ko:"비밀 교육", name_en:"Schooled in Secrets", feat_level:1, prerequisites:"오컬티즘 숙련", traits:["일반 기술"], category:"skill", summary:"비밀 교단과 비밀 결사의 표시와 상징을 알아챕니다. 그런 조직에 대한 정보 수집 시 외교 대신 오컬티즘을, 그런 조직 구성원 변장 시 기만 대신 오컬티즘을 사용할 수 있습니다.", desc:'<strong>전제조건:</strong> 비학 숙련<br>비밀 교단과 비밀 결사의 표시와 상징을 알아챕니다. 그런 조직에 대한 정보 수집 시 외교 대신 <strong>비학</strong>을, 그런 조직 구성원 변장 시 기만 대신 <strong>비학</strong>을 사용할 수 있습니다.<br>비밀 조직에 속해 있으면 구성원을 자동 인식하며(은밀히 숨기지 않는 한), 그들도 당신을 인식합니다.' }
,
  {name_ko:"매혹적 공연", name_en:"Fascinating Performance", feat_level:1, prerequisites:"공연 숙련", traits:["일반 기술"], category:"skill", summary:"공연(Perform) 시, 결과를 관찰자 1명의 의지 DC와 비교합니다. 성공하면 대상이 1라운드간 매혹(fascinated)됩니다. 전투 같은 즉각적인 주의가 필요한 상황이면, 매혹시키려면 대성공해야 하며 공연 행동이 무력화(incapacitation) 특성을 얻습니", desc:'<strong>전제조건:</strong> 공연 숙련<br>공연(Perform) 시, 결과를 관찰자 1명의 의지 DC와 비교합니다. 성공하면 대상이 <strong>1라운드간 매혹(fascinated)</strong>됩니다. 전투 같은 즉각적인 주의가 필요한 상황이면, 매혹시키려면 대성공해야 하며 공연 행동이 무력화(incapacitation) 특성을 얻습니다. 판정 전에 매혹시킬 대상을 선택해야 하며, 대상은 이후 1시간 면역입니다.<br>공연 전문가이면 최대 <strong>4명</strong>, 대가이면 <strong>10명</strong>, 전설이면 <strong>인원 제한 없이</strong> 동시에 매혹시킬 수 있습니다.' }
,
  {name_ko:"인상적 공연", name_en:"Impressive Performance", feat_level:1, prerequisites:"공연 숙련", traits:["일반 기술"], category:"skill", summary:"공연이 감탄을 불러일으키고 팬을 얻습니다. 외교 대신 공연으로 인상 만들기를 할 수 있습니다. 관객 앞에서 최소 10분 공연하면 페널티 없이 최대 10명에게 인상 만들기. 1시간 공연이면 20명, 2시간이면 50명.", desc:'<strong>전제조건:</strong> 공연 숙련<br>공연이 감탄을 불러일으키고 팬을 얻습니다. 외교 대신 <strong>공연으로 인상 만들기</strong>를 할 수 있습니다. 관객 앞에서 최소 10분 공연하면 페널티 없이 <strong>최대 10명</strong>에게 인상 만들기. 1시간 공연이면 20명, 2시간이면 50명.' }
,
  {name_ko:"거장 공연자", name_en:"Virtuosic Performer", feat_level:1, prerequisites:"공연 숙련", traits:["일반 기술"], category:"skill", summary:"특정 유형의 공연에 탁월한 재능이 있습니다. 선택한 전문 분야의 공연 판정에 +1 상황 보너스(달인이면 +2).", desc:'<strong>전제조건:</strong> 공연 숙련<br>특정 유형의 공연에 탁월한 재능이 있습니다. 선택한 전문 분야의 공연 판정에 <strong>+1 상황 보너스</strong>(대가이면 +2).<br><strong>전문 분야:</strong> 연기(드라마/판토마임/인형극), 코미디(익살/농담/리메릭), 댄스(발레/후아라/지그/마크루), 건반(하프시코드/오르간/피아노), 구연(서사시/송가/시/이야기), 타악기(차임/드럼/공/실로폰), 가창(발라드/성가/멜로디/운율), 현악기(피들/하프/류트/비올), 관악기(백파이프/플루트/리코더/트럼펫).' }
,
  {name_ko:"경전 학도", name_en:"Student of the Canon", feat_level:1, prerequisites:"종교학 숙련", traits:["일반 기술"], category:"skill", summary:"다양한 신앙을 충분히 연구하여 사실이 아닐 가능성이 높은 개념을 인식합니다. 종교적 성격의 문서 해독이나 신앙의 교리에 대한 지식 회상에서 대실패 시 실패가 됩니다. 자신의 신앙의 교리에 대한 지식 회상에서 실패 시 성공, 성공 시 대성공.", desc:'<strong>전제조건:</strong> 종교 숙련<br>다양한 신앙을 충분히 연구하여 사실이 아닐 가능성이 높은 개념을 인식합니다. 종교적 성격의 문서 해독이나 신앙의 교리에 대한 지식 회상에서 <strong>대실패 시 실패</strong>가 됩니다. 자신의 신앙의 교리에 대한 지식 회상에서 <strong>실패 시 성공</strong>, <strong>성공 시 대성공</strong>.' }
,
  {name_ko:"내용 파악", name_en:"Glean Contents", feat_level:1, prerequisites:"사회 숙련", traits:["일반 기술"], category:"skill", summary:"다른 사람이 읽거나 쓰고 있는 것을 슬쩍 엿볼 수 있습니다. 2미터(10피트) 이내에서 누군가가 읽고 있는 것을 볼 수 있으면 사회 판정(DC는 GM이 결정)에 성공하여 표면적인 주제를 파악합니다. 자유 행동이므로 다른 행동과 결합 가능합니다. 전투 중이거나 서두를 때", desc:'<strong>전제조건:</strong> 사회 숙련<br>다른 사람이 읽거나 쓰고 있는 것을 슬쩍 엿볼 수 있습니다. 2미터(10피트) 이내에서 누군가가 읽고 있는 것을 볼 수 있으면 사회 판정(DC는 GM이 결정)에 성공하여 표면적인 주제를 파악합니다. 자유 행동이므로 다른 행동과 결합 가능합니다. 전투 중이거나 서두를 때는 더 어렵습니다(DC 증가).' }
,
  {name_ko:"궁정 예법", name_en:"Courtly Graces", feat_level:1, prerequisites:"사회 숙련", traits:["일반 기술"], category:"skill", summary:"귀족들 사이에서 성장했거나 적절한 예법과 태도를 익혀 귀족으로 행동하고 권력 게임에 참여할 수 있습니다. 의도적으로 다르게 행동하지 않는 한, 당신과 대화하는 이는 당신이 귀족이거나 귀족과 밀접히 연관된 사람(주요 하인 등)이라고 여깁니다.", desc:'<strong>전제조건:</strong> 사회 숙련<br>귀족들 사이에서 성장했거나 적절한 예법과 태도를 익혀 귀족으로 행동하고 권력 게임에 참여할 수 있습니다. 의도적으로 다르게 행동하지 않는 한, 당신과 대화하는 이는 당신이 귀족이거나 귀족과 밀접히 연관된 사람(주요 하인 등)이라고 여깁니다.<br>귀족에게 인상 만들기를 사회로 할 수 있으며, 변장으로 귀족의 유형이나 특정 귀족 개인인 척할 수 있습니다. 그런 상황에서 일반 기술(외교나 기만)을 사용하면 대신 <strong>+1 상황 보너스</strong>를 받습니다.' }
,
  {name_ko:"거리 지혜", name_en:"Streetwise", feat_level:1, prerequisites:"사회 숙련", traits:["일반 기술"], category:"skill", summary:"거리 생활을 알고 지역 정착지의 맥박을 느낍니다. 외교 대신 사회로 정보 수집을 할 수 있습니다. 정기적으로 방문하는 정착지에서는 사회로 지식 회상을 사용하여 외교의 정보 수집으로 알 수 있는 것과 같은 종류의 정보를 알 수 있습니다. DC는 보통 상당히 높지만, 시간", desc:'<strong>전제조건:</strong> 사회 숙련<br>거리 생활을 알고 지역 정착지의 맥박을 느낍니다. 외교 대신 <strong>사회로 정보 수집</strong>을 할 수 있습니다. 정기적으로 방문하는 정착지에서는 사회로 지식 회상을 사용하여 외교의 정보 수집으로 알 수 있는 것과 같은 종류의 정보를 알 수 있습니다. DC는 보통 상당히 높지만, 시간을 들이지 않고 정보를 압니다. 실패하면 이후 정상적으로 정보 수집 가능.' }
,
  {name_ko:"입술 읽기", name_en:"Read Lips", feat_level:1, prerequisites:"사회 숙련", traits:["일반 기술"], category:"skill", summary:"명확히 볼 수 있는 근처 사람의 입술을 읽을 수 있습니다. 읽는 언어를 알아야 합니다. 여유가 있을 때는 자동. 조우 모드이거나 어려운 경우에는 입술 움직임에 집중하는 동안 매혹(fascinated)과 무방비(off-guard) 상태이며, 사회 판정(GM이 DC 결정)에", desc:'<strong>전제조건:</strong> 사회 숙련<br>명확히 볼 수 있는 근처 사람의 입술을 읽을 수 있습니다. 읽는 언어를 알아야 합니다. 여유가 있을 때는 자동. 조우 모드이거나 어려운 경우에는 입술 움직임에 집중하는 동안 매혹(fascinated)과 무방비(off-guard) 상태이며, 사회 판정(GM이 DC 결정)에 성공해야 합니다.' }
,
  {name_ko:"수화", name_en:"Sign Language", feat_level:1, prerequisites:"사회 숙련", traits:["일반 기술"], category:"skill", summary:"아는 언어와 관련된 수화를 배워 수화로 소통하고 이해할 수 있습니다. 수화는 보통 복잡한 개념을 전달하려면 양손이 필요하며, 청각이 아닌 시각적입니다. 전투 중에는 기본 몸짓(적을 가리키기 등)과 달리 이해하기 어렵습니다. 저시야 지역에서는 시야가 어려운 것처럼 수화도", desc:'<strong>전제조건:</strong> 사회 숙련<br>아는 언어와 관련된 수화를 배워 수화로 소통하고 이해할 수 있습니다. 수화는 보통 복잡한 개념을 전달하려면 양손이 필요하며, 청각이 아닌 시각적입니다. 전투 중에는 기본 몸짓(적을 가리키기 등)과 달리 이해하기 어렵습니다. 저시야 지역에서는 시야가 어려운 것처럼 수화도 어렵습니다.' }
,
  {name_ko:"다국어", name_en:"Multilingual", feat_level:1, prerequisites:"사회 숙련", traits:["일반 기술"], category:"skill", summary:"새 언어를 쉽게 습득합니다. 일반, 비일반, 접근 가능한 언어에서 2개를 추가로 배웁니다. 사회 달인가 되면 추가 1개, 전설이면 또 1개.", desc:'<strong>전제조건:</strong> 사회 숙련<br>새 언어를 쉽게 습득합니다. 일반, 비일반, 접근 가능한 언어에서 <strong>2개를 추가로</strong> 배웁니다. 사회 대가가 되면 추가 1개, 전설이면 또 1개.<br><strong>특수:</strong> 여러 번 선택 가능. 매번 추가 언어를 배웁니다.' }
,
  {name_ko:"숙련된 밀수꾼", name_en:"Experienced Smuggler", feat_level:1, prerequisites:"은신 숙련", traits:["일반 기술"], category:"skill", summary:"자주 물건을 밀수합니다. GM이 숨긴 작은 물건에 대한 수동 관찰자의 은신 판정을 굴릴 때, 실제 주사위 결과와 10 중 높은 것을 사용합니다. 달인이면 15, 전설이면 수동 관찰자에게 자동 성공. 적극적으로 수색하는 생물에게는 효과 없음.", desc:'<strong>전제조건:</strong> 은신 숙련<br>자주 물건을 밀수합니다. GM이 숨긴 작은 물건에 대한 수동 관찰자의 은신 판정을 굴릴 때, 실제 주사위 결과와 <strong>10 중 높은 것</strong>을 사용합니다. 대가이면 15, 전설이면 수동 관찰자에게 자동 성공. 적극적으로 수색하는 생물에게는 효과 없음.' }
,
  {name_ko:"숙련된 추적자", name_en:"Experienced Tracker", feat_level:1, prerequisites:"생존 숙련", traits:["일반 기술"], category:"skill", summary:"추적이 제2의 천성입니다. 생존 판정에 -5 페널티를 받고 전체 속도로 추적할 수 있습니다. 달인이면 페널티 없음. 전설이면 매시간 새 판정 불필요(흔적에 큰 변화가 있을 때만).", desc:'<strong>전제조건:</strong> 생존 숙련<br>추적이 제2의 천성입니다. 생존 판정에 <strong>-5 페널티</strong>를 받고 <strong>전체 속도로 추적</strong>할 수 있습니다. 대가이면 페널티 없음. 전설이면 매시간 새 판정 불필요(흔적에 큰 변화가 있을 때만).' }
,
  {name_ko:"지형 은신가", name_en:"Terrain Stalker", feat_level:1, prerequisites:"은신 숙련", traits:["일반 기술"], category:"skill", summary:"험지 유형 1개를 선택합니다(잔해, 눈, 수풀). 해당 지형에서 모든 비아군에게 미탐지 상태일 때, 5피트 이하로 이동하고 10피트 내 적을 지나지 않는 한 은신 판정 없이 잠행할 수 있습니다.", desc:'<strong>전제조건:</strong> 은신 숙련<br>험지 유형 1개를 선택합니다(잔해, 눈, 수풀). 해당 지형에서 모든 비아군에게 미탐지 상태일 때, 5피트 이하로 이동하고 10피트 내 적을 지나지 않는 한 <strong>은신 판정 없이 잠행</strong>할 수 있습니다.<br>탐험 중에는 주의 회피 중 다른 생물에 <strong>15피트 내까지 자동 접근</strong>합니다(적극 수색/경계 중이 아닌 한).<br><strong>특수:</strong> 여러 번 선택 가능. 매번 다른 지형.' }
,
  {name_ko:"미묘한 도둑질", name_en:"Subtle Theft", feat_level:1, prerequisites:"도둑질 숙련", traits:["일반 기술"], category:"skill", summary:"성공적으로 훔칠 때, 관찰자(훔친 대상이 아닌 다른 생물)가 당신의 도둑질을 탐지하는 지각 DC에 -2 상황 페널티를 받습니다. 또한 먼저 주의 분산(Create a Diversion)을 하면, 손재주(Palm an Object)나 훔치기(Steal) 1회를 해도 미탐", desc:'<strong>전제조건:</strong> 도둑질 숙련<br>성공적으로 훔칠 때, 관찰자(훔친 대상이 아닌 다른 생물)가 당신의 도둑질을 탐지하는 감지 DC에 <strong>-2 상황 페널티</strong>를 받습니다. 또한 먼저 주의 분산(Create a Diversion)을 하면, 손재주(Palm an Object)나 훔치기(Steal) 1회를 해도 <strong>미탐지 상태가 유지</strong>됩니다.' }
,
  {name_ko:"소매치기", name_en:"Pickpocket", feat_level:1, prerequisites:"도둑질 숙련", traits:["일반 기술"], category:"skill", summary:"주머니 같은 밀접하게 지켜지는 물건을 -5 페널티 없이 훔치거나 손재주로 다룰 수 있습니다. 극히 눈에 띄거나 시간이 걸리는 물건(착용 신발, 갑옷, 사용 중인 무기 등)은 여전히 불가. 달인이면 전투 중이거나 경계 중인 생물에게도 시도 가능(2행동, -5 페널티).", desc:'<strong>전제조건:</strong> 도둑질 숙련<br>주머니 같은 밀접하게 지켜지는 물건을 <strong>-5 페널티 없이</strong> 훔치거나 손재주로 다룰 수 있습니다. 극히 눈에 띄거나 시간이 걸리는 물건(착용 신발, 갑옷, 사용 중인 무기 등)은 여전히 불가. 대가이면 전투 중이거나 경계 중인 생물에게도 시도 가능(2행동, -5 페널티).' }
,
  {name_ko:"채집가", name_en:"Forager", feat_level:1, prerequisites:"생존 숙련", traits:["일반 기술"], category:"skill", summary:"생존으로 생존(Subsist)할 때, 성공보다 나쁜 결과를 굴려도 성공이 됩니다. 성공하면 자신과 추가 4명에게 생활을 제공하고, 대성공이면 두 배. 절반 인원에게 편안한 생활을 제공할 수도 있습니다. 생존 전문가이면 추가 8명, 달인 16명, 전설 32명.", desc:'<strong>전제조건:</strong> 생존 숙련<br>생존으로 생존(Subsist)할 때, 성공보다 나쁜 결과를 굴려도 <strong>성공</strong>이 됩니다. 성공하면 자신과 추가 <strong>4명</strong>에게 생활을 제공하고, 대성공이면 두 배. 절반 인원에게 편안한 생활을 제공할 수도 있습니다. 생존 전문가이면 추가 8명, 대가 16명, 전설 32명.' }
,
  {name_ko:"지형 전문가", name_en:"Terrain Expertise", feat_level:1, prerequisites:"생존 숙련", traits:["일반 기술"], category:"skill", summary:"특정 지형 유형에서의 경험이 뛰어난 자신감을 줍니다. 선택한 지형(수중, 극지, 사막, 숲, 산, 평원, 하늘, 늪, 지하)에서 생존 판정에 +1 상황 보너스.", desc:'<strong>전제조건:</strong> 생존 숙련<br>특정 지형 유형에서의 경험이 뛰어난 자신감을 줍니다. 선택한 지형(수중, 극지, 사막, 숲, 산, 평원, 하늘, 늪, 지하)에서 생존 판정에 <strong>+1 상황 보너스</strong>.<br><strong>특수:</strong> 여러 번 선택 가능. 매번 다른 지형.' }
,
  {name_ko:"야생 동물 조사", name_en:"Survey Wildlife", feat_level:1, prerequisites:"생존 숙련", traits:["일반 기술"], category:"skill", summary:"야생의 세부 사항을 관찰하여 근처 생물의 존재를 파악합니다. 10분간 주변을 평가하여 둥지, 배설물, 식물의 흔적을 기반으로 근처 생물을 알아냅니다. GM이 DC를 결정합니다. 성공하면 이 흔적만으로 지식 회상을 시도하여 생물에 대해 더 배울 수 있습니다(-2 페널티,", desc:'<strong>전제조건:</strong> 생존 숙련<br>야생의 세부 사항을 관찰하여 근처 생물의 존재를 파악합니다. 10분간 주변을 평가하여 둥지, 배설물, 식물의 흔적을 기반으로 근처 생물을 알아냅니다. GM이 DC를 결정합니다. 성공하면 이 흔적만으로 지식 회상을 시도하여 생물에 대해 더 배울 수 있습니다(-2 페널티, 대가이면 페널티 없음).' }
,
  {name_ko:"자동 지식", name_en:"Automatic Knowledge", feat_level:2, prerequisites:"지식 회상 행동에 전문가, 해당 기술에 확신(Assurance)", traits:["일반 기술"], category:"skill", summary:"라운드당 1회, 자유 행동으로 지식 회상을 사용할 수 있습니다. 이때 확신의 결과를 사용해야 합니다.", desc:'<strong>전제조건:</strong> 지식 회상 행동에 전문가, 해당 기술에 확신(Assurance)<br>라운드당 1회, <strong>자유 행동으로 지식 회상</strong>을 사용할 수 있습니다. 이때 확신의 결과를 사용해야 합니다.<br><strong>특수:</strong> 여러 번 선택 가능. 매번 다른 기술(전문가 이상이고 확인이 있어야).' }
,
  {name_ko:"마법 속기", name_en:"Magical Shorthand", feat_level:2, prerequisites:"신비학, 자연학, 오컬티즘, 또는 종교학에 전문가", traits:["일반 기술"], category:"skill", summary:"주문 학습이 쉽게 됩니다. 주문 학습에 성공하면 주문 랭크에 관계없이 10분만 걸립니다. 성공할 결과를 굴리면 대성공이 됩니다. 실패하면 1주일 후 또는 레벨을 올린 후(먼저 오는 것) 재시도 가능.", desc:'<strong>전제조건:</strong> 신비학, 자연학, 비학, 또는 종교에 전문가<br>주문 학습이 쉽게 됩니다. 주문 학습에 성공하면 주문 랭크에 관계없이 <strong>10분</strong>만 걸립니다. 성공할 결과를 굴리면 <strong>대성공</strong>이 됩니다. 실패하면 1주일 후 또는 레벨을 올린 후(먼저 오는 것) 재시도 가능.<br>또한 휴식을 사용하여 새 주문을 배울 수 있습니다. 전통의 관련 기술로 돈 벌기(Earn Income)처럼 작동하지만, 돈 대신 배울 주문을 선택하여 학습 비용에 대한 할인을 받습니다(벌어들인 수입이 비용 이상이면 무료).' }
,
  {name_ko:"민첩한 포복", name_en:"Nimble Crawl", feat_level:2, prerequisites:"곡예 전문가", traits:["일반 기술"], category:"skill", summary:"놀라울 정도로 빠르게 기어갑니다 — 5피트 대신 절반 속도까지. 달인이면 전체 속도, 전설이면 엎드린 상태에서 무방비이 되지 않습니다.", desc:'<strong>전제조건:</strong> 곡예 전문가<br>놀라울 정도로 빠르게 기어갑니다 — 5피트 대신 <strong>절반 속도</strong>까지. 대가이면 전체 속도, 전설이면 엎드린 상태에서 <strong>무방비이 되지 않습니다</strong>.' }
,
  {name_ko:"강력한 도약", name_en:"Powerful Leap", feat_level:2, prerequisites:"운동 전문가", traits:["일반 기술"], category:"skill", summary:"높이뛰기(High Jump) 없이도 수직 도약(Leap)으로 5피트 위로 뛸 수 있습니다. 또한 도약/높이뛰기/멀리뛰기 시 수평 거리가 5피트 증가합니다.", desc:'<strong>전제조건:</strong> 운동 전문가<br>높이뛰기(High Jump) 없이도 수직 도약(Leap)으로 <strong>5피트 위로</strong> 뛸 수 있습니다. 또한 도약/높이뛰기/멀리뛰기 시 수평 거리가 <strong>5피트 증가</strong>합니다.' }
,
  {name_ko:"빠른 올라서기", name_en:"Rapid Mantel", feat_level:2, prerequisites:"운동 전문가", traits:["일반 기술"], category:"skill", summary:"모서리를 쉽게 잡고 올라갑니다. 모서리 잡기(Grab an Edge)를 하면 표면 위로 올라서 일어설 수 있습니다. 반사 내성 대신 운동으로 모서리 잡기를 할 수 있습니다. 모서리 꼭대기에서 5피트 아래까지 등반/도약하면 그 행동의 일부로 올라서 일어설 수 있습니다.", desc:'<strong>전제조건:</strong> 운동 전문가<br>모서리를 쉽게 잡고 올라갑니다. 모서리 잡기(Grab an Edge)를 하면 표면 위로 올라서 일어설 수 있습니다. 반사 내성 대신 <strong>운동으로 모서리 잡기</strong>를 할 수 있습니다. 모서리 꼭대기에서 5피트 아래까지 등반/도약하면 그 행동의 일부로 올라서 일어설 수 있습니다.' }
,
  {name_ko:"연금술 제작", name_en:"Alchemical Crafting", feat_level:2, prerequisites:"제작 전문가", traits:["일반 기술"], category:"skill", summary:"연금술 아이템을 제작할 수 있습니다. 이 재주를 선택하면 2레벨 이하의 일반 연금술 아이템 공식 4개를 얻습니다.", desc:'<strong>전제조건:</strong> 제작 전문가<br>연금술 아이템을 제작할 수 있습니다. 이 재주를 선택하면 <strong>2레벨 이하의 일반 연금술 아이템 공식 4개</strong>를 얻습니다.' }
,
  {name_ko:"마법 제작", name_en:"Magical Crafting", feat_level:2, prerequisites:"제작 전문가", traits:["일반 기술"], category:"skill", summary:"마법 아이템을 제작할 수 있습니다. 다만 일부는 다른 요구사항이 있을 수 있습니다(GM Core 참조). 이 재주를 선택하면 2레벨 이하의 일반 마법 아이템 공식 4개를 얻습니다.", desc:'<strong>전제조건:</strong> 제작 전문가<br>마법 아이템을 제작할 수 있습니다. 다만 일부는 다른 요구사항이 있을 수 있습니다(GM Core 참조). 이 재주를 선택하면 <strong>2레벨 이하의 일반 마법 아이템 공식 4개</strong>를 얻습니다.' }
,
  {name_ko:"빠른 변장", name_en:"Quick Disguise", feat_level:2, prerequisites:"기만 전문가", traits:["일반 기술"], category:"skill", summary:"보통 시간의 1/10에 변장을 만듭니다(보통 1분). 달인이면 변장+변장(Impersonate)이 3행동 활동, 전설이면 1행동.", desc:'<strong>전제조건:</strong> 기만 전문가<br>보통 시간의 <strong>1/10</strong>에 변장을 만듭니다(보통 1분). 대가이면 변장+변장(Impersonate)이 <strong>3행동 활동</strong>, 전설이면 <strong>1행동</strong>.' }
,
  {name_ko:"친근한 인상", name_en:"Glad-Hand", feat_level:2, prerequisites:"외교 전문가", traits:["일반 기술"], category:"skill", summary:"첫 인상이 당신의 강점입니다. 일상적이거나 사교적인 상황에서 누군가를 만나면, 1분 대화 없이도 즉시 인상 만들기를 시도할 수 있습니다. 실패하면 1분 대화 후 실패/대실패 결과 대신 새 판정을 시도할 수 있습니다.", desc:'<strong>전제조건:</strong> 외교 전문가<br>첫 인상이 당신의 강점입니다. 일상적이거나 사교적인 상황에서 누군가를 만나면, 1분 대화 없이도 즉시 <strong>인상 만들기를 시도</strong>할 수 있습니다. 실패하면 1분 대화 후 실패/대실패 결과 대신 새 판정을 시도할 수 있습니다.' }
,
  {name_ko:"위협적 체격", name_en:"Intimidating Prowess", feat_level:2, prerequisites:"근력 +3, 위협 전문가", traits:["일반 기술"], category:"skill", summary:"물리적으로 위협할 수 있는 상황에서 강요나 사기 저하 시 +1 상황 보너스를 얻고, 언어를 공유하지 않아도 페널티를 무시합니다. 근력 +5 이상이고 위협 달인이면 보너스가 +2.", desc:'<strong>전제조건:</strong> 근력 +3, 위협 전문가<br>물리적으로 위협할 수 있는 상황에서 강요나 사기 저하 시 <strong>+1 상황 보너스</strong>를 얻고, 언어를 공유하지 않아도 <strong>페널티를 무시</strong>합니다. 근력 +5 이상이고 위협 대가이면 보너스가 <strong>+2</strong>.' }
,
  {name_ko:"지속 강요", name_en:"Lasting Coercion", feat_level:2, prerequisites:"위협 전문가", traits:["일반 기술"], category:"skill", summary:"성공적으로 강요하면 대상이 복종하는 최대 시간이 1주일로 증가합니다(GM 결정). 전설이면 최대 1개월.", desc:'<strong>전제조건:</strong> 위협 전문가<br>성공적으로 강요하면 대상이 복종하는 최대 시간이 <strong>1주일</strong>로 증가합니다(GM 결정). 전설이면 최대 <strong>1개월</strong>.' }
,
  {name_ko:"강건한 회복", name_en:"Robust Recovery", feat_level:2, prerequisites:"의학 전문가", traits:["일반 기술"], category:"skill", summary:"질병과 독에서 회복하는 민간 의학을 배웠고, 부지런히 사용하여 특히 회복력이 강해졌습니다. 질병 치료나 독 치료를 하거나 받을 때, 성공 시 상황 보너스가 +4로 증가하고, 환자의 내성 결과가 성공이면 대성공이 됩니다.", desc:'<strong>전제조건:</strong> 의학 전문가<br>질병과 독에서 회복하는 민간 의학을 배웠고, 부지런히 사용하여 특히 회복력이 강해졌습니다. 질병 치료나 독 치료를 하거나 받을 때, 성공 시 상황 보너스가 <strong>+4로 증가</strong>하고, 환자의 내성 결과가 성공이면 <strong>대성공</strong>이 됩니다.' }
,
  {name_ko:"지속 회복", name_en:"Continual Recovery", feat_level:2, prerequisites:"의학 전문가", traits:["일반 기술"], category:"skill", summary:"상처 치료(Treat Wounds) 후 대상의 면역 시간이 1시간이 아닌 10분으로 줄어듭니다.", desc:'<strong>전제조건:</strong> 의학 전문가<br>상처 치료(Treat Wounds) 후 대상의 면역 시간이 1시간이 아닌 <strong>10분</strong>으로 줄어듭니다.' }
,
  {name_ko:"구역 의무관", name_en:"Ward Medic", feat_level:2, prerequisites:"의학 전문가", traits:["일반 기술"], category:"skill", summary:"대규모 의료 구역에서 여러 환자를 동시에 치료하는 법을 배웠습니다. 질병 치료나 상처 치료 시 최대 2명을 동시에 치료합니다. 달인이면 4명, 전설이면 8명.", desc:'<strong>전제조건:</strong> 의학 전문가<br>대규모 의료 구역에서 여러 환자를 동시에 치료하는 법을 배웠습니다. 질병 치료나 상처 치료 시 <strong>최대 2명</strong>을 동시에 치료합니다. 대가이면 4명, 전설이면 8명.' }
,
  {name_ko:"비정상 치료", name_en:"Unusual Treatment", feat_level:2, prerequisites:"의학 전문가", traits:["일반 기술"], category:"skill", summary:"의료 훈련이 덜 명확한 상태까지 확장됩니다. DC 20 상처 치료 성공 시, 환자의 서투름(clumsy)/기력상실(enfeebled)/멍청함(stupefied) 중 하나의 수치를 1 줄입니다. 한 번에 1명만 혜택. 하루 1회. 달인이면 DC 30으로 소진(draine", desc:'<strong>전제조건:</strong> 의학 전문가<br>의료 훈련이 덜 명확한 상태까지 확장됩니다. DC 20 상처 치료 성공 시, 환자의 서투름(clumsy)/기력상실(enfeebled)/멍청함(stupefied) 중 하나의 수치를 <strong>1 줄입니다</strong>. 한 번에 1명만 혜택. 하루 1회. 대가이면 DC 30으로 소진(drained)도 제거 가능. 전설이면 선택한 상태를 <strong>2만큼 줄입니다</strong>.' }
,
  {name_ko:"정령 상담", name_en:"Consult the Spirits", feat_level:2, prerequisites:"자연학 또는 종교학 전문가", traits:["일반 기술"], category:"skill", summary:"자연이나 신성한 정령에게 조언을 구합니다. 장소나 그 역사 및 현재 거주자에 대한 지식 회상을 시도할 때, 자연학(자연 정령의 경우)이나 종교학(신성한 정령의 경우)을 사용할 수 있습니다. 달인이면 정령이 필요한 세부 사항을 정확히 알고 있을 경우 성공보다 나쁜 결과를 ", desc:'<strong>전제조건:</strong> 자연학 또는 종교 전문가<br>자연이나 신성한 정령에게 조언을 구합니다. 장소나 그 역사 및 현재 거주자에 대한 지식 회상을 시도할 때, 자연학(자연 정령의 경우)이나 종교(신성한 정령의 경우)를 사용할 수 있습니다. 대가이면 정령이 필요한 세부 사항을 정확히 알고 있을 경우 성공보다 나쁜 결과를 굴리지 않습니다. 전설이면 판정에 성공 시 대성공이 됩니다.' }
,
  {name_ko:"추가 지식", name_en:"Additional Lore", feat_level:2, prerequisites:"지식 전문가", traits:["일반 기술"], category:"skill", summary:"지식의 영역을 넓혔습니다. 새로운 지식(Lore) 하위 기술을 선택합니다. 해당 기술에 전문가가 됩니다.", desc:'<strong>전제조건:</strong> 지식 전문가<br>지식의 영역을 넓혔습니다. 새로운 지식(Lore) 하위 기술을 선택합니다. 해당 기술에 <strong>전문가</strong>가 됩니다.<br><strong>특수:</strong> 여러 번 선택 가능. 매번 다른 지식 하위 기술을 선택합니다.' }
,
  {name_ko:"전문적 경험", name_en:"Experienced Professional", feat_level:2, prerequisites:"지식 전문가", traits:["일반 기술"], category:"skill", summary:"직업의 전문성이 당신의 업무를 돋보이게 합니다. 지식으로 돈 벌기(Earn Income)를 시도할 때, 실패해도 당신과 지정한 다른 생물들에게 하루 1 sp(구리 동전 10개) 가치의 생활을 제공합니다. 결정적 실패 시, 피해를 주는 실수 없이 단순히 아무것도 벌지 못", desc:'<strong>전제조건:</strong> 지식 전문가<br>직업의 전문성이 당신의 업무를 돋보이게 합니다. 지식으로 돈 벌기(Earn Income)를 시도할 때, 실패해도 당신과 지정한 다른 생물들에게 하루 1 sp(구리 동전 10개) 가치의 생활을 제공합니다. 결정적 실패 시, 피해를 주는 실수 없이 단순히 아무것도 벌지 못합니다.' }
,
  {name_ko:"수 감각", name_en:"Eye for Numbers", feat_level:2, prerequisites:"지식(수학) 또는 사회 전문가", traits:["일반 기술"], category:"skill", summary:"숫자와 회계에 예리한 직관이 있습니다. 거래에서 사기나 조작을 감지하거나, 집합체의 규모를 추정하거나, 수학적 성격의 정보를 회상할 때 전문가 숙련도를 사용합니다. 빠른 계산이나 암산을 즉시 수행할 수 있으며 GM이 결정하는 복잡한 수학 문제는 제외합니다.", desc:'<strong>전제조건:</strong> 지식(수학) 또는 사회 전문가<br>숫자와 회계에 예리한 직관이 있습니다. 거래에서 사기나 조작을 감지하거나, 집합체의 규모를 추정하거나, 수학적 성격의 정보를 회상할 때 전문가 숙련도를 사용합니다. 빠른 계산이나 암산을 즉시 수행할 수 있으며 GM이 결정하는 복잡한 수학 문제는 제외합니다.' }
,
  {name_ko:"빠른 학습", name_en:"Fast Study", feat_level:2, prerequisites:"지식 전문가", traits:["일반 기술"], category:"skill", summary:"정보를 빠르게 흡수합니다. 지식 회상(Recall Knowledge)에 대한 지식 기술 행동에서 성공하면, 해당 정보를 정상보다 더 효율적으로 처리하여 이후 같은 주제에 대한 지식 회상에 +1 상황 보너스를 얻습니다(GM이 언제 정보가 충분히 새 것인지 판단). 달인이", desc:'<strong>전제조건:</strong> 지식 전문가<br>정보를 빠르게 흡수합니다. 지식 회상(Recall Knowledge)에 대한 지식 기술 행동에서 성공하면, 해당 정보를 정상보다 더 효율적으로 처리하여 이후 같은 주제에 대한 지식 회상에 <strong>+1 상황 보너스</strong>를 얻습니다(GM이 언제 정보가 충분히 새 것인지 판단). 대가이면 성공 시 대성공이 됩니다.' }
,
  {name_ko:"소리 추정", name_en:"Sound Estimation", feat_level:2, prerequisites:"사회 전문가", traits:["일반 기술"], category:"skill", summary:"소리의 특성으로 그 원천에 대해 정확히 추론합니다. 직접 보지 못한 소리를 들을 때, 사회 판정으로 소리의 일반적인 출처(생물 유형, 이동 수단 등), 대략적인 방향과 거리, 그리고 개체 수 등을 파악할 수 있습니다. DC는 GM이 결정하며 거리와 소음 환경에 따라 달", desc:'<strong>전제조건:</strong> 사회 전문가<br>소리의 특성으로 그 원천에 대해 정확히 추론합니다. 직접 보지 못한 소리를 들을 때, 사회 판정으로 소리의 일반적인 출처(생물 유형, 이동 수단 등), 대략적인 방향과 거리, 그리고 개체 수 등을 파악할 수 있습니다. DC는 GM이 결정하며 거리와 소음 환경에 따라 달라집니다.' }
,
  {name_ko:"조용한 동맹", name_en:"Quiet Allies", feat_level:2, prerequisites:"은신 전문가", traits:["일반 기술"], category:"skill", summary:"집단과 함께 이동하는 데 능숙합니다. 주의 회피(Avoiding Notice) 중 아군이 전문가 따르기(Follow the Expert)를 사용하면, 각자 따로 굴리지 않고 가장 낮은 수정치로 단일 은신 판정을 굴립니다. 주도권에는 적용 안 됨.", desc:'<strong>전제조건:</strong> 은신 전문가<br>집단과 함께 이동하는 데 능숙합니다. 주의 회피(Avoiding Notice) 중 아군이 전문가 따르기(Follow the Expert)를 사용하면, 각자 따로 굴리지 않고 <strong>가장 낮은 수정치로 단일 은신 판정</strong>을 굴립니다. 주도권에는 적용 안 됨.' }
,
  {name_ko:"경계 해제", name_en:"Wary Disarmament", feat_level:2, prerequisites:"도둑질 전문가", traits:["일반 기술"], category:"skill", summary:"장치 해제 중 장치를 유발하거나 함정을 작동시키면, 그 장치/함정의 공격이나 효과에 대해 AC 또는 내성에 +2 상황 보너스. 실패로 유발된 공격/효과에만 적용되며, 이후 추가 공격(복합 함정 등)에는 적용 안 됨.", desc:'<strong>전제조건:</strong> 도둑질 전문가<br>장치 해제 중 장치를 유발하거나 함정을 작동시키면, 그 장치/함정의 공격이나 효과에 대해 <strong>AC 또는 내성에 +2 상황 보너스</strong>. 실패로 유발된 공격/효과에만 적용되며, 이후 추가 공격(복합 함정 등)에는 적용 안 됨.' }
,
  {name_ko:"틀림없는 지식", name_en:"Unmistakable Lore", feat_level:2, prerequisites:"지식 전문가", traits:["일반 기술"], category:"skill", summary:"전문 분야에 대한 정보를 절대 틀리지 않습니다. 숙련된 지식 하위 범주로 지식 회상에서 대실패 시 실패가 됩니다. 달인이면 대성공 시 평소보다 더 많은 정보나 맥락을 얻습니다.", desc:'<strong>전제조건:</strong> 지식 전문가<br>전문 분야에 대한 정보를 절대 틀리지 않습니다. 숙련된 지식 하위 범주로 지식 회상에서 <strong>대실패 시 실패</strong>가 됩니다. 대가이면 대성공 시 평소보다 더 많은 정보나 맥락을 얻습니다.<br>세계에 당신의 흔적을 남기려면 적절한 장비가 필요합니다 — 갑옷, 무기, 기타 장비를 포함하여. 이 장에서는 캐릭터 생성 중에 구매할 수 있는 다양한 장비를 제시합니다. 보통 대부분의 도시와 대형 정착지에서 이 아이템들을 구매할 수 있습니다.<br>캐릭터는 <strong>15금화(gp)</strong>(150은화)로 시작하여 이 장의 일반 아이템을 구매합니다. 비일반 희귀도 아이템은 캐릭터 생성 중 선택한 능력에서 특별한 접근을 얻거나 GM의 허가가 있어야 구매할 수 있습니다. 각 클래스의 빠른 장비 패키지가 268페이지에 있습니다.' }
,
  {name_ko:"인맥", name_en:"Connections", feat_level:3, prerequisites:"외교 숙련; 사회 숙련; 도시 지식, 범죄 지식, 정치 지식, 또는 다른 사회 집단과 관련된 지식에 숙련", traits:["일반 기술"], category:"skill", summary:"인맥 덕분에 올바른 사람을 알고 있습니다. 적어도 어느 정도 규모가 있는 도시에서 당신은 외교를 사용하여 정보 수집을 하거나 사회를 사용하여 유용한 NPC — 상인, 길드 대표, 마법사 등 — 에게 소개받을 수 있습니다. 또한 외교나 사회를 사용하여 법적 또는 정치적 ", desc:'<strong>전제조건:</strong> 외교 숙련; 사회 숙련; 도시 지식, 범죄 지식, 정치 지식, 또는 다른 사회 집단과 관련된 지식에 숙련<br>인맥 덕분에 올바른 사람을 알고 있습니다. 적어도 어느 정도 규모가 있는 도시에서 당신은 외교를 사용하여 정보 수집을 하거나 사회를 사용하여 유용한 NPC — 상인, 길드 대표, 마법사 등 — 에게 소개받을 수 있습니다. 또한 외교나 사회를 사용하여 법적 또는 정치적 도움, 상품이나 서비스 조달, 미팅 주선 등의 호의를 요청할 수 있습니다. GM이 적절한 DC와 가능 여부를 결정합니다.' }
,
  {name_ko:"솟구쳐 일어서기", name_en:"Kip Up", feat_level:7, prerequisites:"곡예 달인", traits:["일반 기술"], category:"skill", summary:"유발: 당신의 턴이 시작됩니다.", desc:'<strong>전제조건:</strong> 곡예 대가<br><strong>유발:</strong> 당신의 턴이 시작됩니다.<br>쓰러진 자세에서 즉각적으로 일어납니다. 넘어짐(prone) 상태를 종료하고 일어납니다. 이 행동은 기동(move) 행동이 아닙니다.' }
,
  {name_ko:"빠른 등반", name_en:"Quick Climb", feat_level:7, prerequisites:"운동 달인", traits:["일반 기술"], category:"skill", summary:"등반 시 성공이면 5피트 더, 대성공이면 10피트 더 이동합니다(최대 이동 속도). 전설이면 이동 속도와 같은 등반 속도를 얻습니다.", desc:'<strong>전제조건:</strong> 운동 대가<br>등반 시 성공이면 <strong>5피트 더</strong>, 대성공이면 <strong>10피트 더</strong> 이동합니다(최대 이동 속도). 전설이면 이동 속도와 같은 <strong>등반 속도</strong>를 얻습니다.' }
,
  {name_ko:"빠른 수영", name_en:"Quick Swim", feat_level:7, prerequisites:"운동 달인", traits:["일반 기술"], category:"skill", summary:"수영 시 성공이면 5피트 더, 대성공이면 10피트 더(최대 이동 속도). 전설이면 이동 속도와 같은 수영 속도.", desc:'<strong>전제조건:</strong> 운동 대가<br>수영 시 성공이면 <strong>5피트 더</strong>, 대성공이면 <strong>10피트 더</strong>(최대 이동 속도). 전설이면 이동 속도와 같은 <strong>수영 속도</strong>.' }
,
  {name_ko:"벽 점프", name_en:"Wall Jump", feat_level:7, prerequisites:"운동 달인", traits:["일반 기술"], category:"skill", summary:"점프의 모멘텀으로 벽을 타고 오릅니다. 점프 끝에 벽에 인접해 있으면(높이뛰기/멀리뛰기/도약 중), 다음 행동이 또 다른 점프인 한 추락하지 않습니다. 이전 점프가 모멘텀을 주어 높이뛰기/멀리뛰기를 1행동으로 사용할 수 있지만 초기 보폭은 없습니다. 턴당 1회(전설이면", desc:'<strong>전제조건:</strong> 운동 대가<br>점프의 모멘텀으로 벽을 타고 오릅니다. 점프 끝에 벽에 인접해 있으면(높이뛰기/멀리뛰기/도약 중), 다음 행동이 또 다른 점프인 한 <strong>추락하지 않습니다</strong>. 이전 점프가 모멘텀을 주어 높이뛰기/멀리뛰기를 1행동으로 사용할 수 있지만 초기 보폭은 없습니다. 턴당 1회(전설이면 연속 점프 행동만큼).' }
,
  {name_ko:"완벽한 제작", name_en:"Impeccable Crafting", feat_level:7, prerequisites:"제작 달인, 전문 제작", traits:["일반 기술"], category:"skill", summary:"완벽한 창작물을 뛰어난 효율로 제작합니다. 전문 제작으로 선택한 유형의 아이템을 제작 판정에서 성공하면 대성공이 됩니다.", desc:'<strong>전제조건:</strong> 제작 대가, 전문 제작<br>완벽한 창작물을 뛰어난 효율로 제작합니다. 전문 제작으로 선택한 유형의 아이템을 제작 판정에서 <strong>성공하면 대성공</strong>이 됩니다.' }
,
  {name_ko:"괴물 제작", name_en:"Monster Crafting", feat_level:7, prerequisites:"생존 달인", traits:["일반 기술"], category:"skill", summary:"괴물의 부품을 사용하여 제작에 도움을 줄 수 있습니다. 괴물의 몸을 사용하여 아이템을 제작할 때 제작(Crafting) 대신 생존(Survival)을 사용합니다. 괴물의 몸에서 가치 있는 부품이 있으면 원재료 비용에 충당할 수 있습니다. 추가 작업일에는 자신의 레벨 대", desc:'<strong>전제조건:</strong> 생존 대가<br>괴물의 부품을 사용하여 제작에 도움을 줄 수 있습니다. 괴물의 몸을 사용하여 아이템을 제작할 때 제작(Crafting) 대신 <strong>생존(Survival)</strong>을 사용합니다. 괴물의 몸에서 가치 있는 부품이 있으면 원재료 비용에 충당할 수 있습니다. 추가 작업일에는 자신의 레벨 대신 <strong>괴물의 레벨</strong>을 사용하여 가격을 줄입니다.' }
,
  {name_ko:"교활한 비밀", name_en:"Slippery Secrets", feat_level:7, prerequisites:"기만 달인", traits:["일반 기술"], category:"skill", summary:"진정한 본성이나 의도를 밝히려는 시도를 피합니다. 주문이나 마법 효과가 당신의 마음을 읽거나, 거짓말을 탐지하거나, 정체를 밝히려 할 때, 주문/효과의 DC에 대해 기만 판정을 시도합니다. 성공하면 효과가 아무것도 밝히지 못합니다.", desc:'<strong>전제조건:</strong> 기만 대가<br>진정한 본성이나 의도를 밝히려는 시도를 피합니다. 주문이나 마법 효과가 당신의 마음을 읽거나, 거짓말을 탐지하거나, 정체를 밝히려 할 때, 주문/효과의 DC에 대해 <strong>기만 판정</strong>을 시도합니다. 성공하면 효과가 <strong>아무것도 밝히지 못합니다</strong>.' }
,
  {name_ko:"범죄 인맥", name_en:"Criminal Connections", feat_level:7, prerequisites:"기만 달인; 범죄 지식 또는 지하세계 지식에 숙련", traits:["일반 기술"], category:"skill", summary:"범죄 세계의 내부 사람들과 연줄이 있습니다. 범죄 집단, 장물아비, 암시장 상인, 기타 범죄자들에게 접근할 수 있습니다. 기만이나 지식으로 정보 수집이나 필요한 불법 물품/서비스를 구할 수 있습니다. DC는 GM이 결정하며, 관련된 범죄의 위험도나 지역 사회에서의 인지", desc:'<strong>전제조건:</strong> 기만 대가; 범죄 지식 또는 지하세계 지식에 숙련<br>범죄 세계의 내부 사람들과 연줄이 있습니다. 범죄 집단, 장물아비, 암시장 상인, 기타 범죄자들에게 접근할 수 있습니다. 기만이나 지식으로 정보 수집이나 필요한 불법 물품/서비스를 구할 수 있습니다. DC는 GM이 결정하며, 관련된 범죄의 위험도나 지역 사회에서의 인지도에 따라 달라집니다.' }
,
  {name_ko:"뻔뻔한 요청", name_en:"Shameless Request", feat_level:7, prerequisites:"외교 달인", traits:["일반 기술"], category:"skill", summary:"뻔뻔함과 매력으로 요청의 결과나 터무니없음을 경시합니다. 요청(Request) 시 터무니없는 요청에 대한 DC 증가를 2만큼 줄입니다. 대실패를 굴려도 실패가 됩니다. 이것은 태도를 악화시키지 않지만, 대상은 결국 반복적인 요청에 질립니다.", desc:'<strong>전제조건:</strong> 외교 대가<br>뻔뻔함과 매력으로 요청의 결과나 터무니없음을 경시합니다. 요청(Request) 시 터무니없는 요청에 대한 DC 증가를 <strong>2만큼 줄입니다</strong>. 대실패를 굴려도 <strong>실패</strong>가 됩니다. 이것은 태도를 악화시키지 않지만, 대상은 결국 반복적인 요청에 질립니다.' }
,
  {name_ko:"전투 함성", name_en:"Battle Cry", feat_level:7, prerequisites:"위협 달인", traits:["일반 기술", "청각", "감정", "공포", "정신"], category:"skill", summary:"유발: 전투 조우에서 주도권을 굴립니다.", desc:'<strong>전제조건:</strong> 위협 대가<br><strong>유발:</strong> 전투 조우에서 주도권을 굴립니다.<br>전투 시작에 굉음을 지르며 적을 위협합니다. 30피트 범위 내 모든 적에게 사기 저하(Demoralize)를 시도합니다. 이 반응으로 시도하는 사기 저하는 언어가 필요하지 않으며 청각 특성을 얻습니다.' }
,
  {name_ko:"공포 퇴각", name_en:"Terrified Retreat", feat_level:7, prerequisites:"위협 달인", traits:["일반 기술"], category:"skill", summary:"사기 저하(Demoralize)에 대성공하고 대상의 레벨이 당신보다 낮으면, 대상은 1라운드간 도주(fleeing)합니다.", desc:'<strong>전제조건:</strong> 위협 대가<br>사기 저하(Demoralize)에 <strong>대성공</strong>하고 대상의 레벨이 당신보다 낮으면, 대상은 <strong>1라운드간 도주(fleeing)</strong>합니다.' }
,
  {name_ko:"차원 감각", name_en:"Planar Sense", feat_level:7, prerequisites:"오컬티즘 달인", traits:["일반 기술"], category:"skill", summary:"차원 이상을 직감적으로 감지합니다. 차원의 균열, 포털, 비전 통로, 다른 차원에서 온 존재 등에 대해 수동적인 지각 판정을 수행합니다. 수동 지각 대신 오컬티즘 판정을 사용하여 이러한 현상의 존재를 감지하거나(성공 시) 특성을 파악(대성공 시)합니다. 이것은 마법 감지의", desc:'<strong>전제조건:</strong> 비학 대가<br>차원 이상을 직감적으로 감지합니다. 차원의 균열, 포털, 비전 통로, 다른 차원에서 온 존재 등에 대해 수동적인 지각 판정을 수행합니다. 수동 감지 대신 비학 판정을 사용하여 이러한 현상의 존재를 감지하거나(성공 시) 특성을 파악(대성공 시)합니다. 이것은 마법 감지의 한 형태이며 마법이 차단되면 작동하지 않습니다.' }
,
  {name_ko:"기이한 마법", name_en:"Bizarre Magic", feat_level:7, prerequisites:"오컬티즘 달인", traits:["일반 기술"], category:"skill", summary:"비술의 기이한 변형을 활용할 수 있습니다 — 오컬트(occult) 주문을 시전할 수 없더라도 마찬가지입니다. 당신이 시전하는 주문을 주문 인식하거나 사용하는 마법을 마법 식별하는 DC가 5 증가합니다.", desc:'<strong>전제조건:</strong> 비학 대가<br>비술의 기이한 변형을 활용할 수 있습니다 — 오컬트(occult) 주문을 시전할 수 없더라도 마찬가지입니다. 당신이 시전하는 주문을 주문 인식하거나 사용하는 마법을 마법 식별하는 DC가 <strong>5 증가</strong>합니다.' }
,
  {name_ko:"신속 추적자", name_en:"Swift Tracker", feat_level:7, prerequisites:"생존 달인", traits:["일반 기술"], category:"skill", summary:"추적 중 매시간마다 새 판정을 굴려야 하는 것 대신, 매 30분마다 1회로 줄어듭니다. 전설이면 패배하지 않는 한 새 판정이 필요 없습니다(극단적인 흔적 변화 시 제외).", desc:'<strong>전제조건:</strong> 생존 대가<br>추적 중 매시간마다 새 판정을 굴려야 하는 것 대신, <strong>매 30분마다 1회</strong>로 줄어듭니다. 전설이면 패배하지 않는 한 새 판정이 필요 없습니다(극단적인 흔적 변화 시 제외).' }
,
  {name_ko:"빠른 자물쇠 열기", name_en:"Quick Unlock", feat_level:7, prerequisites:"도둑질 달인", traits:["일반 기술"], category:"skill", summary:"자물쇠 열기(Pick a Lock)를 2행동 대신 1행동으로.", desc:'<strong>전제조건:</strong> 도둑질 대가<br>자물쇠 열기(Pick a Lock)를 2행동 대신 <strong>1행동</strong>으로.' }
,
  {name_ko:"감각 속이기", name_en:"Foil Senses", feat_level:7, prerequisites:"은신 달인", traits:["일반 기술"], category:"skill", summary:"생물의 특수 감각을 속이는 데 능숙하여 항상 이에 대비합니다. 주의 회피, 숨기, 잠행을 사용할 때마다 항상 특수 감각에 대한 예방 조치를 취하는 것으로 간주됩니다.", desc:'<strong>전제조건:</strong> 은신 대가<br>생물의 특수 감각을 속이는 데 능숙하여 항상 이에 대비합니다. 주의 회피, 숨기, 잠행을 사용할 때마다 항상 <strong>특수 감각에 대한 예방 조치를 취하는 것</strong>으로 간주됩니다(433페이지 다른 감각으로 탐지하기 사이드바 참조).' }
,
  {name_ko:"차원간 생존", name_en:"Planar Survival", feat_level:7, prerequisites:"생존 달인", traits:["일반 기술"], category:"skill", summary:"정상적으로 자급할 수 있는 자원이나 자연 현상이 없는 다른 차원에서도 생존(Subsist)에 생존 기술을 사용할 수 있습니다. 예를 들어, 먹을 것이 없는 차원에서도 페널티 없이 채집 가능. 판정 성공은 차원의 일반적 조건으로 인한 피해로부터 당신과 생존으로 지원하는 ", desc:'<strong>전제조건:</strong> 생존 대가<br>정상적으로 자급할 수 있는 자원이나 자연 현상이 없는 다른 차원에서도 생존(Subsist)에 <strong>생존 기술</strong>을 사용할 수 있습니다. 예를 들어, 먹을 것이 없는 차원에서도 페널티 없이 채집 가능. 판정 성공은 차원의 일반적 조건으로 인한 피해로부터 당신과 생존으로 지원하는 다른 이들을 보호합니다(소규모 위험은 제외).' }
,
  {name_ko:"빠른 인식", name_en:"Quick Recognition", feat_level:7, prerequisites:"신비학/자연학/오컬티즘/종교학에 달인; 주문 인식", traits:["일반 기술"], category:"skill", summary:"주문을 빠르게 인식합니다. 달인인 기술로 라운드당 1회 자유 행동으로 주문을 인식할 수 있습니다.", desc:'<strong>전제조건:</strong> 신비학/자연학/비학/종교에 대가; 주문 인식<br>주문을 빠르게 인식합니다. 대가인 기술로 <strong>라운드당 1회 자유 행동으로</strong> 주문을 인식할 수 있습니다.' }
,
  {name_ko:"저주 해제", name_en:"Break Curse", feat_level:7, prerequisites:"오컬티즘 또는 종교학에 달인", traits:["일반 기술"], category:"skill", summary:"지식으로 저주를 해제할 수 있습니다. 오컬티즘이나 종교학으로 저주 상쇄를 시도할 수 있습니다. 상쇄 랭크은 레벨 절반(올림)과 같습니다.", desc:'<strong>전제조건:</strong> 비학 또는 종교에 대가<br>지식으로 저주를 해제할 수 있습니다. 비학이나 종교로 <strong>저주 상쇄</strong>를 시도할 수 있습니다. 상쇄 랭크는 레벨 절반(올림)과 같습니다.' }
,
  {name_ko:"신속 잠행", name_en:"Swift Sneak", feat_level:7, prerequisites:"은신 달인", traits:["일반 기술"], category:"skill", summary:"잠행(Sneak) 시 절반 속도 대신 전체 속도로 이동할 수 있습니다. 수영/등반/비행/굴착 중에도 사용 가능.", desc:'<strong>전제조건:</strong> 은신 대가<br>잠행(Sneak) 시 절반 속도 대신 <strong>전체 속도로 이동</strong>할 수 있습니다. 수영/등반/비행/굴착 중에도 사용 가능.' }
,
  {name_ko:"구름 도약", name_en:"Cloud Jump", feat_level:15, prerequisites:"운동 전설", traits:["일반 기술"], category:"skill", summary:"도약의 물리적 한계를 무시합니다. 높이뛰기 시 최대 도약 높이가 없으며 멀리뛰기 시 최대 도약 거리가 없습니다. 실제 도약한 거리에 추가로 도약 거리가 두 배가 됩니다. 예를 들어 높이뛰기 판정 결과가 30이고 도약 거리를 두 배 적용하면 60피트 높이까지 뛸 수 있습", desc:'<strong>전제조건:</strong> 운동 전설<br>도약의 물리적 한계를 무시합니다. 높이뛰기 시 최대 도약 높이가 없으며 멀리뛰기 시 최대 도약 거리가 없습니다. 실제 도약한 거리에 추가로 도약 거리가 두 배가 됩니다. 예를 들어 높이뛰기 판정 결과가 30이고 도약 거리를 두 배 적용하면 60피트 높이까지 뛸 수 있습니다. 도약은 여전히 이동 행동이며 속도 규칙을 따릅니다.' }
,
  {name_ko:"전설적 협상", name_en:"Legendary Negotiation", feat_level:15, prerequisites:"외교 전설", traits:["일반 기술"], category:"skill", summary:"적대적 상황에서도 놀라울 정도로 빠르게 협상합니다. 인상 만들기를 시도한 후 상대에게 현재 활동을 중단하고 협상에 참여하도록 요청합니다. 외교 판정에 -5 페널티. DC는 보통 대상의 의지 DC. 일부 생물은 개인적 의지와 관계없이 멈출 수 없으며, 동의해도 결국 주장", desc:'<strong>전제조건:</strong> 외교 전설<br>적대적 상황에서도 놀라울 정도로 빠르게 협상합니다. 인상 만들기를 시도한 후 상대에게 현재 활동을 중단하고 협상에 참여하도록 요청합니다. 외교 판정에 <strong>-5 페널티</strong>. DC는 보통 대상의 의지 DC. 일부 생물은 개인적 의지와 관계없이 멈출 수 없으며, 동의해도 결국 주장이 부족하면 폭력으로 돌아갈 수 있습니다.' }
,
  {name_ko:"공포로 죽이기", name_en:"Scare to Death", feat_level:15, prerequisites:"위협 전설", traits:["일반 기술", "감정", "공포", "무력화"], category:"skill", summary:"적을 너무 겁먹게 하여 죽을 수도 있습니다. 30피트 내 살아있는 생물의 의지 DC에 대해 위협 판정을 시도합니다. 대상이 당신의 말을 이해하지 못하면 -4 상황 페널티. 1분간 면역.", desc:'<strong>전제조건:</strong> 위협 전설<br>적을 너무 겁먹게 하여 죽을 수도 있습니다. 30피트 내 살아있는 생물의 의지 DC에 대해 위협 판정을 시도합니다. 대상이 당신의 말을 이해하지 못하면 -4 상황 페널티. 1분간 면역.<br><strong>대성공:</strong> 대상이 인내 내성(위협 DC)을 굴립니다. 대실패 시 <strong>사망</strong>(죽음 특성). 다른 결과: 공포 2 + 1라운드 도주.<br>' }
,
  {name_ko:"전설적 의사", name_en:"Legendary Medic", feat_level:15, prerequisites:"의학 전설", traits:["일반 기술"], category:"skill", summary:"기적적 결과를 달성하는 의료 혁신을 발견했습니다. 각 대상에 하루 1회, 1시간 치료 후 의학 판정을 시도하여 질병이나 실명/청각상실/파멸/소진 상태를 제거할 수 있습니다. DC는 질병이나 주문/효과의 DC. 유물이나 20레벨 초과 원천이면 DC +10.", desc:'<strong>전제조건:</strong> 의학 전설<br>기적적 결과를 달성하는 의료 혁신을 발견했습니다. 각 대상에 하루 1회, 1시간 치료 후 의학 판정을 시도하여 질병이나 실명/청각상실/파멸/소진 상태를 <strong>제거</strong>할 수 있습니다. DC는 질병이나 주문/효과의 DC. 유물이나 20레벨 초과 원천이면 DC +10.' }
,
  {name_ko:"신성 안내", name_en:"Divine Guidance", feat_level:15, prerequisites:"종교학 전설", traits:["일반 기술"], category:"skill", summary:"필요할 때 신성한 존재나 자신의 깊은 믿음으로부터 안내를 받습니다. 하루에 한 번 10분간 기도나 명상 후 종교학 판정(DC 20)을 시도하여 눈앞의 상황이나 문제에 대한 신탁과 같은 안내를 받습니다. 안내는 신비롭거나 은유적일 수 있지만 실질적으로 도움이 됩니다. 대성", desc:'<strong>전제조건:</strong> 종교 전설<br>필요할 때 신성한 존재나 자신의 깊은 믿음으로부터 안내를 받습니다. 하루에 한 번 10분간 기도나 명상 후 종교 판정(DC 20)을 시도하여 눈앞의 상황이나 문제에 대한 신탁과 같은 안내를 받습니다. 안내는 신비롭거나 은유적일 수 있지만 실질적으로 도움이 됩니다. 대성공하면 특히 상세하고 명확한 안내를 받으며, 실패하면 이 능력을 다음 일일 준비 이후까지 다시 사용할 수 없습니다.' }
,
  {name_ko:"전설적 암호 해독가", name_en:"Legendary Codebreaker", feat_level:15, prerequisites:"사회 전설", traits:["일반 기술"], category:"skill", summary:"언어와 암호에 대한 기술이 탁월하여 빠르게 읽어가며 정보를 해독합니다. 정상 속도로 읽으며 사회로 문서 해독을 할 수 있습니다. 천천히 읽고 성공하면 대성공; 느린 속도에서 대성공하면 거의 단어 단위의 이해를 얻습니다.", desc:'<strong>전제조건:</strong> 사회 전설<br>언어와 암호에 대한 기술이 탁월하여 빠르게 읽어가며 정보를 해독합니다. 정상 속도로 읽으며 <strong>사회로 문서 해독</strong>을 할 수 있습니다. 천천히 읽고 성공하면 <strong>대성공</strong>; 느린 속도에서 대성공하면 거의 단어 단위의 이해를 얻습니다.' }
,
  {name_ko:"전설적 언어학자", name_en:"Legendary Linguist", feat_level:15, prerequisites:"사회 전설, 다국어", traits:["일반 기술"], category:"skill", summary:"언어에 능숙하여 즉석에서 피진어를 만들 수 있습니다. 언어를 모르더라도 언어를 가진 모든 생물과 항상 대화할 수 있습니다 — 단순화된 용어와 기본 개념을 전달하는 새 피진어를 만들어. 생물이 어떤 소통 매체(말, 수화 등)를 사용하는지는 먼저 이해해야 합니다.", desc:'<strong>전제조건:</strong> 사회 전설, 다국어<br>언어에 능숙하여 즉석에서 피진어를 만들 수 있습니다. 언어를 모르더라도 <strong>언어를 가진 모든 생물과 항상 대화</strong>할 수 있습니다 — 단순화된 용어와 기본 개념을 전달하는 새 피진어를 만들어. 생물이 어떤 소통 매체(말, 수화 등)를 사용하는지는 먼저 이해해야 합니다.' }
,
  {name_ko:"자연 영향", name_en:"Influence Nature", feat_level:15, prerequisites:"자연학 전설", traits:["일반 기술"], category:"skill", summary:"자연에 대한 이해가 너무 깊어 직접 영향을 미칩니다. 10분간 자연학 판정을 시도하여 날씨나 자연 현상(홍수, 가뭄, 이주 패턴 등)을 점진적으로 변화시킬 수 있습니다. DC와 변화의 규모는 GM이 결정합니다. 이 능력은 마법이 아니며 시간이 지남에 따라 점진적으로 효", desc:'<strong>전제조건:</strong> 자연학 전설<br>자연에 대한 이해가 너무 깊어 직접 영향을 미칩니다. 10분간 자연학 판정을 시도하여 날씨나 자연 현상(홍수, 가뭄, 이주 패턴 등)을 점진적으로 변화시킬 수 있습니다. DC와 변화의 규모는 GM이 결정합니다. 이 능력은 마법이 아니며 시간이 지남에 따라 점진적으로 효과를 발휘합니다; 급격한 변화는 더 높은 DC를 가집니다. 효과는 수 시간에서 수일에 걸쳐 나타납니다.' }
,
  {name_ko:"전설적 생존자", name_en:"Legendary Survivalist", feat_level:15, prerequisites:"생존 전설", traits:["일반 기술"], category:"skill", summary:"음식이나 물 없이 무기한 생존할 수 있으며, 심각한/극단적/놀라운 추위와 더위에서도 피해를 받지 않습니다.", desc:'<strong>전제조건:</strong> 생존 전설<br>음식이나 물 없이 <strong>무기한 생존</strong>할 수 있으며, 심각한/극단적/놀라운 추위와 더위에서도 <strong>피해를 받지 않습니다</strong>.' }
,
  {name_ko:"전설적 잠행가", name_en:"Legendary Sneak", feat_level:15, prerequisites:"은신 전설, 신속 잠행", traits:["일반 기술"], category:"skill", summary:"보이기를 선택하지 않는 한 항상 잠행합니다. 엄폐나 은폐 없이도 숨기와 잠행을 할 수 있습니다. 주의 회피 외의 탐험 전술을 사용해도, 주의 회피의 혜택도 함께 얻습니다(선택하지 않는 한).", desc:'<strong>전제조건:</strong> 은신 전설, 신속 잠행<br>보이기를 선택하지 않는 한 항상 잠행합니다. 엄폐나 은폐 없이도 <strong>숨기와 잠행</strong>을 할 수 있습니다. 주의 회피 외의 탐험 전술을 사용해도, 주의 회피의 혜택도 함께 얻습니다(선택하지 않는 한).' }
,
  {name_ko:"전설적 도둑", name_en:"Legendary Thief", feat_level:15, prerequisites:"도둑질 전설, 소매치기", traits:["일반 기술"], category:"skill", summary:"도둑질 능력이 상식을 초월합니다. 사용 중인 무기나 착용 중인 신발/갑옷처럼 극히 눈에 띄거나 시간이 걸리는 물건도 훔칠 수 있습니다. 최소 1분(갑옷 같은 아이템은 훨씬 더 오래) 동안 느리고 조심스럽게 해야 하며, 어둠의 엄폐나 북적이는 군중 등 숨어있을 수단이 있", desc:'<strong>전제조건:</strong> 도둑질 전설, 소매치기<br>도둑질 능력이 상식을 초월합니다. 사용 중인 무기나 착용 중인 신발/갑옷처럼 극히 눈에 띄거나 시간이 걸리는 물건도 <strong>훔칠 수 있습니다</strong>. 최소 1분(갑옷 같은 아이템은 훨씬 더 오래) 동안 느리고 조심스럽게 해야 하며, 어둠의 엄폐나 북적이는 군중 등 숨어있을 수단이 있어야 합니다. 성공해도 완전한 갑옷처럼 극히 눈에 띄는 아이템은 곧 사라진 것을 알아챕니다.' }
,
  {name_ko:"전설적 전문가", name_en:"Legendary Professional", feat_level:15, prerequisites:"지식 전설", traits:["일반 기술"], category:"skill", summary:"명성이 땅 전체에 퍼졌습니다(예: 전쟁 지식이면 전설적 장군이나 전략가). 전설적 공연자(위 참조)처럼 작동하지만, 지식으로 돈 벌기 시 더 높은 레벨의 직업을 얻습니다.", desc:'<strong>전제조건:</strong> 지식 전설<br>명성이 땅 전체에 퍼졌습니다(예: 전쟁 지식이면 전설적 장군이나 전략가). 전설적 공연자(위 참조)처럼 작동하지만, <strong>지식으로 돈 벌기</strong> 시 더 높은 레벨의 직업을 얻습니다.' }
,
  {name_ko:"전설적 공연자", name_en:"Legendary Performer", feat_level:15, prerequisites:"공연 전설, 거장 공연자", traits:["일반 기술"], category:"skill", summary:"명성이 온 땅에 퍼졌습니다. 사회 기술이 있는 생물은 당신에 대해 들어봤으며, 보통 평소보다 한 단계 나은 태도를 가집니다(평판과 성향에 따라). 공연으로 돈 벌기 시 장소가 허용하는 것보다 더 높은 레벨의 관객을 끌어옵니다. 보통 레벨 또는 레벨+2(더 높은 쪽)까지", desc:'<strong>전제조건:</strong> 공연 전설, 거장 공연자<br>명성이 온 땅에 퍼졌습니다. 사회 기술이 있는 생물은 당신에 대해 들어봤으며, 보통 평소보다 <strong>한 단계 나은 태도</strong>를 가집니다(평판과 성향에 따라). 공연으로 돈 벌기 시 장소가 허용하는 것보다 <strong>더 높은 레벨의 관객</strong>을 끌어옵니다. 보통 레벨 또는 레벨+2(더 높은 쪽)까지 관객이 증가합니다.' }
,
  {name_ko:"통합 이론", name_en:"Unified Theory", feat_level:15, prerequisites:"신비학 전설", traits:["일반 기술"], category:"skill", summary:"네 가지 마법 전통과 마법 정수의 공통 기반을 이해하여, 비전의 렌즈를 통해 모두를 이해합니다. 마법 전통에 따라 자연학, 오컬티즘, 종교학 판정이 필요한 기술 행동이나 기술 재주를 사용할 때, 대신 신비학을 사용할 수 있습니다. 다른 마법에 신비학을 사용할 때 보통 받는 ", desc:'<strong>전제조건:</strong> 신비학 전설<br>네 가지 마법 전통과 마법 정수의 공통 기반을 이해하여, 비전의 렌즈를 통해 모두를 이해합니다. 마법 전통에 따라 자연학, 비학, 종교 판정이 필요한 기술 행동이나 기술 재주를 사용할 때, 대신 <strong>신비학</strong>을 사용할 수 있습니다. 다른 마법에 신비학을 사용할 때 보통 받는 페널티나 높은 DC도 더 이상 받지 않습니다.' }
,
  // ── 클래스 특성 (Class Features) ──
  {name_ko:"비학 주문시전", name_en:"Occult Spellcasting", cat:"feature", class_id:"bard", feat_level:1, summary:"비밀스러운 지식에서 마법을 끌어옵니다. 비학(occult) 전통의 주문시전자로, 주문 시전(Cast a Spell) 활동을 사용합니다. 바드로서 주문을 시전할 때, 주문은 음악적 리프나 영리한 리메릭일 수 있고, 몸짓은 춤과 극적인 판토마임을 포함할 수 있으며, 악기를 연주하며 주문시전을 동반할 수 있습니다. 매일 최대 2개의 1랭크 주문을 시전할 수 있습니다. 주문을 시전하려면 알고 있어야 하며, 주문 레퍼토리 클래스 특성을 통해 배웁니다. 매일 시전할 수 있는 주문 수를 주문 슬롯이라 합니다. 일부 주문은 주문 공격을 시도하거나 적이 주문 DC에 대해 내성 굴림을 해야 합니다. 핵심 속성이 매력이므로, 주문 공격 수정치와 주문 DC는 매력 수정치를 사용합니다."}
,
  {name_ko:"합주 주문", name_en:"Composition Spells", cat:"feature", class_id:"bard", feat_level:1, summary:"공연에 마법을 불어넣어 합주(composition)라는 고유한 효과를 만들 수 있습니다. 합주는 공연(Performance) 기술을 사용해야 하는 경우가 많은 특수 유형의 주문입니다. 합주 주문은 집중 주문(focus spell)의 일종입니다. 집중 주문 1개를 시전하는 데 집중 포인트 1점이 필요하며, 집중 풀 1점으로 시작합니다. 일일 준비 시 집중 풀을 채우고, 10분간 공연하거나 새 합주를 작곡하거나 뮤즈에 몰입하는 재집중(Refocus) 활동으로 1점을 회복할 수 있습니다. 반격 공연(counter performance) 합주를 배워, 청각과 시각 효과에 대항하여 보호합니다."}
,
  {name_ko:"신성 주문시전", name_en:"Divine Spellcasting", cat:"feature", class_id:"cleric", feat_level:1, summary:"신격의 힘과 신앙으로 신성(divine) 전통의 주문을 시전합니다. 매일 아침 기도와 명상으로 준비하여, 신성 주문 목록에서 시전할 주문을 선택해 주문 슬롯에 \"로드\"합니다. 핵심 속성이 지혜이므로 주문 DC와 공격 수정치에 지혜를 사용합니다."}
,
  {name_ko:"신성 원천", name_en:"Divine Font", cat:"feature", class_id:"cleric", feat_level:1, summary:"신격이 특별히 강화된 에너지에 접근을 부여합니다. 치유(heal) 또는 해로움(harm)에 대해 추가 주문 슬롯을 얻으며, 슬롯 수는 1 + 매력 수정치입니다. 원천이 둘 다 허용하면 매일 하나를 선택합니다."}
,
  {name_ko:"원시 주문시전", name_en:"Primal Spellcasting", cat:"feature", class_id:"druid", feat_level:1, summary:"야생 세계의 힘이 당신을 통해 흐릅니다. 원시(primal) 전통의 주문시전자입니다. 매일 아침 원시 주문 목록에서 주문을 준비합니다."}
,
  {name_ko:"드루이드 결사", name_en:"Druidic Order", cat:"feature", class_id:"druid", feat_level:1, summary:"드루이드가 되면 결사와 자신을 맞추며, 클래스 특기, 결사 주문, 추가 숙련 기술을 얻습니다."}
,
  {name_ko:"방패 막기", name_en:"Shield Block", cat:"feature", class_id:"druid", feat_level:1, summary:"방패 막기(Shield Block) 일반 특기를 얻습니다. [반응] 방패를 들고 물리 공격 피해를 받으면, 방패의 경도만큼 피해를 감소시키고 나머지 피해는 방패가 받습니다."}
,
  {name_ko:"자연의 목소리", name_en:"Voice of Nature", cat:"feature", class_id:"druid", feat_level:1, summary:"동물 공감(Animal Empathy) 또는 식물 공감(Plant Empathy) 드루이드 특기 중 하나를 선택하여 얻습니다."}
,
  {name_ko:"야생노래", name_en:"Wildsong", cat:"feature", class_id:"druid", feat_level:1, summary:"드루이드 결사 내에서만 알려진 비밀 언어인 야생노래를 알고 있습니다. 이것은 동물 울음소리에 가까운 선율적이고 음조적인 언어이며, 그 알파벳은 조개껍데기의 방, 눈송이의 결정, 고사리의 잎처럼 프랙탈과 나선으로 이루어져 있습니다. 비드루이드에게 야생노래를 가르치는 것은 금기입니다."}
,
  {name_ko:"반격 타격", name_en:"Reactive Strike", cat:"feature", class_id:"fighter", feat_level:1, summary:"유발 조건: 도달 범위 내 생물이 조작 행동이나 이동 행동을 사용하거나, 원거리 공격을 하거나, 이동 중 칸을 떠납니다. 빈틈을 보이는 적을 신속히 공격합니다. 유발 생물에 근접 타격을 합니다. 치명타이고 유발이 조작 행동이면 행동을 방해합니다. 이 타격은 다중 공격 페널티에 포함되지 않으며, 다중 공격 페널티가 이 타격에 적용되지 않습니다."}
,
  {name_ko:"방패 막기", name_en:"Shield Block", cat:"feature", class_id:"fighter", feat_level:1, summary:"방패 막기(Shield Block) 일반 특기를 얻습니다. [반응] 방패를 들고 물리 공격 피해를 받으면, 방패의 경도만큼 피해를 감소시키고 나머지 피해는 방패가 받습니다."}
,
  {name_ko:"사냥감 추적", name_en:"Hunt Prey", cat:"feature", class_id:"ranger", feat_level:1, summary:"볼 수 있거나 추적 중인 생물 1명을 사냥감으로 지정합니다. 사냥감을 탐색(Seek)하기 위한 지각 판정에 +2 상황 보너스, 추적(Track)을 위한 생존 판정에 +2 상황 보너스. 사냥감에 대한 두 번째 사거리 증분 내 원거리 공격 페널티도 무시합니다. 한 번에 사냥감 1명만 가능. 다음 일일 준비까지 지속."}
,
  {name_ko:"사냥꾼의 기질", name_en:"Hunter's Edge", cat:"feature", class_id:"ranger", feat_level:1, summary:"사냥감 추적 시 추가 혜택을 부여하는 기질을 선택합니다. 난타(Flurry): 사냥감에 대한 다중 공격 페널티가 완화됩니다. 두 번째 공격이 -5 대신 -3(민첩 무기 -2), 세 번째 이후가 -10 대신 -6(민첩 -4). 지략(Outwit): 사냥감의 공격에 대해 AC +1 상황 보너스, 사냥감에 대한 기만/위협/은신 및 지식 회상에 +2 상황 보너스. 정밀(Precision): 라운드에서 사냥감을 처음 명중할 때 추가 1d8 정밀 피해. 11레벨에서 2d8, 19레벨에서 3d8."}
,
  {name_ko:"은밀 공격 1d6", name_en:"Sneak Attack 1d6", cat:"feature", class_id:"rogue", feat_level:1, summary:"무방비(off-guard) 상태인 생물에 민첩/기교 근접 무기, 민첩/기교 비무장 공격, 원거리 무기/비무장 공격으로 타격 시 추가 1d6 정밀 피해. 투척 근접 무기는 민첩/기교여야 합니다. 5, 11, 17레벨에 피해 주사위가 1개씩 증가."}
,
  {name_ko:"기습", name_en:"Surprise Attack", cat:"feature", class_id:"rogue", feat_level:1, summary:"전투에 적보다 빨리 뛰어듭니다. 첫 라운드에 기만이나 은신으로 주도권을 굴렸으면, 아직 행동하지 않은 생물은 당신에게 무방비."}
,
  {name_ko:"라켓", name_en:"Racket", cat:"feature", class_id:"rogue", feat_level:1, summary:"1레벨에 로그의 라켓을 선택합니다. 라켓은 로그로서의 활동 방식을 나타내며, 추가 기술과 핵심 속성 선택지를 부여합니다. 지략가, 건달, 사기꾼, 도둑 중 하나를 선택합니다."}
,
  {name_ko:"위치 주문시전", name_en:"Witch Spellcasting", cat:"feature", class_id:"witch", feat_level:1, summary:"사역마를 통로로 하여 후원자가 주문시전 능력을 부여합니다. 후원자의 전통으로 주문을 시전합니다. 매일 아침 사역마와 교감하여 주문을 준비합니다. 사역마가 알고 있는 주문에서 선택하여 주문 슬롯에 준비합니다."}
,
  {name_ko:"사역마", name_en:"Familiar", cat:"feature", class_id:"witch", feat_level:1, summary:"후원자가 보낸 신비로운 생물로, 마법을 가르치고 주문을 매개합니다. 일반 사역마보다 강력하며, 추가 사역마 능력 2개(후원자 고유 1개 + 매일 선택 1개)를 가집니다. 6, 12, 18레벨에 추가 능력 1개씩 더. 주문: 사역마가 캔트립 10개, 1랭크 주문 5개, 후원자의 첫 교훈 주문 1개를 알고 시작합니다. 레벨을 올릴 때마다 2개의 새 주문을 배웁니다. 사역마는 두루마리를 먹거나 다른 위치의 사역마에게서 주문을 배울 수도 있습니다. 불멸: 사역마가 죽으면 다음 일일 준비 시 후원자가 교체합니다. 같은 주문을 알고 있습니다."}
,
  {name_ko:"주술", name_en:"Hexes", cat:"feature", class_id:"witch", feat_level:1, summary:"후원자의 직접적 마법 개입인 주술은 집중 주문의 일종입니다. 턴당 주술 1개만 사용 가능(두 번째 시도는 자동 실패). 집중 풀 1점으로 시작하며, 10분간 사역마와 교감하여 1점 회복. 선택으로 후원자의 인형(patron's puppet) 또는 사역마 위상(phase familiar) 주술을 배웁니다."}
,
  {name_ko:"비전 주문시전", name_en:"Arcane Spellcasting", cat:"feature", class_id:"wizard", feat_level:1, summary:"헌신적인 학습과 연습으로 비전 마법을 학술적 엄밀함으로 구성합니다. 비전(arcane) 전통의 주문시전자입니다. 매일 아침 주문서에서 주문을 준비하며, 비전 학파의 추가 캔트립 1개와 추가 주문도 준비합니다."}
,
  {name_ko:"비전 유대", name_en:"Arcane Bond", cat:"feature", class_id:"wizard", feat_level:1, summary:"마법적 힘의 일부를 결합 아이템에 저장합니다. 매일 준비 시 소유한 아이템 1개를 지정. 결합 아이템 소진(Drain Bonded Item) [자유 행동]을 얻어, 이미 시전한 준비 주문 1개를 슬롯 소비 없이 하루 1회 추가 시전 가능."}
,
  {name_ko:"비전 논제", name_en:"Arcane Thesis", cat:"feature", class_id:"wizard", feat_level:1, summary:"정식 위자드가 되는 과정에서 독자적 마법 연구의 논문을 작성했습니다. 논제에 따라 특별한 혜택을 얻습니다. 실험적 주문변형 Experimental Spellshaping — 주문변형의 마법 관행을 변수와 매개변수를 변경하여 더 효율적으로 실현할 수 있다는 논제입니다. 선택한 1레벨 주문변형 위자드 특기 1개를 얻습니다. 4레벨부터 일일 준비 시 레벨 절반 이하의 주문변형 위자드 특기를 추가로 얻을 수 있습니다. 향상된 사역마 동조 Improved Familiar Attunement — 위자드와 사역마의 마법적 유대를 미세 조정하면 더 큰 결과를 얻을 수 있다는 논제. 사역마(Familiar) 특기를 얻고, 사역마가 추가 능력 1개를 더 얻습니다(6, 12, 18레벨에 추가 1개씩). 비전 유대가 아이템 대신 사역마에 저장되어, 결합 아이템 소진(Drain Bonded Item) 대신 사역마 소진(Drain Familiar)을 얻습니다. 주문 혼합 Spell Blending — 주문 슬롯이 모든 주문시전에 힘을 공급하는 근본적 에너지의 약칭이라는 논제. 일일 준비 시, 같은 랭크의 주문 슬롯 2개를 최대 2랭크 높은 보너스 슬롯 1개로 교환할 수 있습니다. 주문 슬롯 1개를 캔트립 2개로 교환도 가능. 주문 대체 Spell Substitution — 준비된 주문은 다음 준비까지 변경할 수 없다는 사실을 거부합니다. 10분간 준비된 주문 슬롯 1개를 비우고 주문서에서 다른 주문을 준비할 수 있습니다. 지팡이 연결 Staff Nexus — 학습 초기부터 지팡이를 집중적으로 채택하면 주문시전자와 지팡이 사이에 공생적 유대를 만들 수 있다는 논제. 자작 지팡이로 시작(캔트립 1개 + 1랭크 주문 1개 포함). 일일 준비 시 주문 1개를 소비하여 해당 랭크만큼 지팡이에 충전. 8레벨에 주문 2개, 16레벨에 3개까지 소비 가능."}
,
  {name_ko:"비전 학파", name_en:"Arcane School", cat:"feature", class_id:"wizard", feat_level:1, summary:"1레벨에 비전 학파를 선택하며, 교과과정 주문과 학파 주문(집중 주문)을 얻습니다. 시전 가능한 각 주문 랭크에 학파 교과에서 추가 슬롯 1개씩을 얻고, 그 슬롯에는 교과 주문만 준비 가능합니다. 학파에는 소환(Ars Grammatica), 창조(Civic Wizardry), 변환(School of Mentalism), 점술(School of Protean Form), 환영(School of the Boundary) 등 8개 학파가 있으며, 통합 마법 이론(School of Unified Magical Theory)은 특정 학파에 속하지 않는 유연한 접근입니다."}
,
  {name_ko:"번개 반사", name_en:"Lightning Reflexes", cat:"feature", class_id:"bard", feat_level:3, summary:"위험을 피하는 재주가 생겼습니다. 반사 내성 숙련도가 전문가로 증가."}
,
  {name_ko:"시그니처 주문", name_en:"Signature Spells", cat:"feature", class_id:"bard", feat_level:3, summary:"경험으로 일부 주문을 더 유연하게 시전할 수 있습니다. 접근 가능한 각 주문 랭크마다 시그니처 주문 1개를 선택합니다. 시그니처 주문의 고양 버전은 별도로 배울 필요 없이 자유롭게 고양할 수 있습니다. 최소 랭크보다 높은 랭크에서 시그니처 주문을 배웠다면, 별도로 배우지 않고도 모든 낮은 랭크 버전도 시전할 수 있습니다."}
,
  {name_ko:"2차 교의", name_en:"Second Doctrine", cat:"feature", class_id:"cleric", feat_level:3, summary:"선택한 교의의 2차 혜택을 얻습니다(3레벨)."}
,
  {name_ko:"감지 전문가", name_en:"Alertness", cat:"feature", class_id:"druid", feat_level:3, summary:"감지 숙련도가 전문가로 증가."}
,
  {name_ko:"인내 전문가", name_en:"Great Fortitude", cat:"feature", class_id:"druid", feat_level:3, summary:"인내 내성 숙련도가 전문가로 증가."}
,
  {name_ko:"용기", name_en:"Bravery", cat:"feature", class_id:"fighter", feat_level:3, summary:"전투의 두려움을 이겨내는 훈련을 했습니다. 공포(fear) 효과에 대한 의지 내성에서 성공 시 대성공. 또한 공포 효과에 대한 의지 내성 숙련도가 전문가로 증가."}
,
  {name_ko:"의지 전문가", name_en:"Iron Will", cat:"feature", class_id:"ranger", feat_level:3, summary:"의지 내성 숙련도가 전문가로 증가."}
,
  {name_ko:"이점 부정", name_en:"Deny Advantage", cat:"feature", class_id:"rogue", feat_level:3, summary:"빈틈을 이용하는 자로서, 자신에게 그런 틈을 남기지 않습니다. 자신의 레벨 이하인 숨겨진/미탐지/측면 공격하는 생물이나 기습을 사용하는 생물에게 무방비이 되지 않습니다(다른 이유로 무방비은 여전히 가능). 그러나 그 생물은 아군의 측면 공격에 도움을 줄 수 있습니다."}
,
  {name_ko:"감지 전문가", name_en:"Alertness", cat:"feature", class_id:"cleric", feat_level:5, summary:"감지 숙련도가 전문가로 증가."}
,
  {name_ko:"반사 전문가", name_en:"Lightning Reflexes", cat:"feature", class_id:"druid", feat_level:5, summary:"반사 내성 숙련도가 전문가로 증가."}
,
  {name_ko:"파이터 무기 달인", name_en:"Fighter Weapon Mastery", cat:"feature", class_id:"fighter", feat_level:5, summary:"특정 무기 그룹에서 비할 데 없는 기술을 가지고 있습니다. 무기 그룹 하나를 선택합니다. 해당 그룹의 단순/군용 무기와 비무장 공격에 대한 숙련도가 대가로 증가. 해당 무기나 비무장 공격으로 치명타 시 치명 특성 효과를 적용합니다."}
,
  {name_ko:"레인저 무기 전문가", name_en:"Ranger Weapon Expertise", cat:"feature", class_id:"ranger", feat_level:5, summary:"단순 무기, 군용 무기, 비무장 공격 숙련도가 전문가로 증가."}
,
  {name_ko:"흔적 없는 여정", name_en:"Trackless Journey", cat:"feature", class_id:"ranger", feat_level:5, summary:"험지를 이동할 때 흔적을 남기지 않으며, 추적하기 극히 어렵습니다."}
,
  {name_ko:"은밀 공격 2d6", name_en:"Sneak Attack 2d6", cat:"feature", class_id:"rogue", feat_level:5, summary:"은밀 공격 추가 정밀 피해가 2d6으로 증가합니다."}
,
  {name_ko:"무기 속임수", name_en:"Weapon Tricks", cat:"feature", class_id:"rogue", feat_level:5, summary:"단순 무기, 군용 무기, 비무장 공격 숙련도가 전문가로 증가."}
,
  {name_ko:"마법 인내", name_en:"Magical Fortitude", cat:"feature", class_id:"witch", feat_level:5, summary:"인내 내성 숙련도가 전문가로 증가."}
,
  {name_ko:"반사 전문가", name_en:"Lightning Reflexes", cat:"feature", class_id:"wizard", feat_level:5, summary:"반사 내성 숙련도가 전문가로 증가."}
,
  {name_ko:'드워프 보강', name_en:'Dwarven Reinforcement', feat_level:5, prerequisites:'드워프, 제작 전문가', desc:'<strong>전제조건:</strong> 제작 전문가<br>공학과 금속 가공 지식으로 두꺼운 물체와 구조물을 일시적으로 강화할 수 있습니다. <strong>1시간 동안 아이템에 작업</strong>하여 24시간 동안 경도(Hardness)에 <strong>+1 상황 보너스</strong>를 줄 수 있습니다. 제작 대가이면 보너스 +2, 전설이면 +3입니다. 구조물의 일부를 보강할 수 있지만, 1시간으로는 보통 문 하나, 창문 몇 개, 또는 10피트 정육면체 내에 맞는 다른 구역만 보강합니다.'}
,
  {name_ko:"전문가 주문시전자", name_en:"Expert Spellcaster", cat:"feature", class_id:"bard", feat_level:7, summary:"마법 기법이 강해집니다. 주문 공격 수정치와 주문 DC 숙련도가 전문가로 증가."}
,
  {name_ko:"3차 교의", name_en:"Third Doctrine", cat:"feature", class_id:"cleric", feat_level:7, summary:"선택한 교의의 3차 혜택을 얻습니다(7레벨)."}
,
  {name_ko:"전문가 주문시전자", name_en:"Expert Spellcaster", cat:"feature", class_id:"druid", feat_level:7, summary:"마법 기법이 강해집니다. 주문 공격 수정치와 주문 DC 숙련도가 전문가로 증가."}
,
  {name_ko:"전장 측량", name_en:"Battlefield Surveyor", cat:"feature", class_id:"fighter", feat_level:7, summary:"감지 숙련도가 대가로 증가."}
,
  {name_ko:"무기 전문화", name_en:"Weapon Specialization", cat:"feature", class_id:"fighter", feat_level:7, summary:"전문가인 무기/비무장 공격으로 추가 피해 2(대가 3, 전설 4)."}
,
  {name_ko:"자연 반사", name_en:"Evasion", cat:"feature", class_id:"ranger", feat_level:7, summary:"반사 내성에서 성공 시 대성공."}
,
  {name_ko:"감지 달인", name_en:"Perception Master", cat:"feature", class_id:"ranger", feat_level:7, summary:"감지 숙련도가 대가로 증가."}
,
  {name_ko:"무기 전문화", name_en:"Weapon Specialization", cat:"feature", class_id:"ranger", feat_level:7, summary:"전문가인 무기와 비무장 공격으로 추가 피해 2(대가 3, 전설 4)."}
,
  {name_ko:"회피 반사", name_en:"Evasion", cat:"feature", class_id:"rogue", feat_level:7, summary:"반사 내성 숙련도가 대가로. 반사 내성에서 성공 시 대성공."}
,
  {name_ko:"경각 감각", name_en:"Vigilant Senses", cat:"feature", class_id:"rogue", feat_level:7, summary:"예리한 인식력과 세부 사항에 대한 주의력을 발달시켰습니다. 감지 숙련도가 대가로 증가."}
,
  {name_ko:"무기 전문화", name_en:"Weapon Specialization", cat:"feature", class_id:"rogue", feat_level:7, summary:"전문가인 무기와 비무장 공격으로 추가 피해 2(대가 3, 전설 4)."}
,
  {name_ko:"전문가 주문시전자", name_en:"Expert Spellcaster", cat:"feature", class_id:"witch", feat_level:7, summary:"마법 기법이 강해집니다. 주문 공격 수정치와 주문 DC 숙련도가 전문가로 증가."}
,
  {name_ko:"전문가 주문시전자", name_en:"Expert Spellcaster", cat:"feature", class_id:"wizard", feat_level:7, summary:"마법 기법이 강해집니다. 주문 공격 수정치와 주문 DC 숙련도가 전문가로 증가."}
,
  {name_ko:"큰 결의", name_en:"Resolve", cat:"feature", class_id:"bard", feat_level:9, summary:"최고의 공연은 자신의 마음에 대한 이해와 완벽한 집중을 요합니다. 의지 내성 숙련도가 대가로 증가. 의지 내성에서 성공을 굴리면 대성공."}
,
  {name_ko:"확고한 신앙", name_en:"Steadfast Faith", cat:"feature", class_id:"cleric", feat_level:9, summary:"의지 내성에서 대실패 시 실패가 됩니다."}
,
  {name_ko:"전투 유연성", name_en:"Combat Flexibility", cat:"feature", class_id:"fighter", feat_level:9, summary:"일일 준비 시, 전제조건을 충족하는 8레벨 이하 파이터 특기 1개를 얻습니다. 다음 준비 시 다른 특기로 교체 가능."}
,
  {name_ko:"전투 단련", name_en:"Juggernaut", cat:"feature", class_id:"fighter", feat_level:9, summary:"의지 내성 숙련도가 전문가로 증가."}
,
  {name_ko:"자연의 끝", name_en:"Nature", cat:"feature", class_id:"ranger", feat_level:9, summary:"험지에 있는 적은 당신에게 무방비(off-guard)."}
,
  {name_ko:"레인저 전문가", name_en:"Ranger Expertise", cat:"feature", class_id:"ranger", feat_level:9, summary:"레인저 클래스 DC 숙련도가 전문가로 증가."}
,
  {name_ko:"쇠약 타격", name_en:"Debilitating Strike", cat:"feature", class_id:"rogue", feat_level:9, summary:"유발 조건: 무방비한 생물에 타격이 명중하고 피해를 줍니다. 다음 턴 종료까지 쇠약 효과 1개를 적용합니다: 이동 속도에 -10피트 상태 페널티 기력상실(enfeebled) 1"}
,
  {name_ko:"로그 회복력", name_en:"Rogue Resilience", cat:"feature", class_id:"rogue", feat_level:9, summary:"인내 내성 숙련도가 전문가로. 인내 내성에서 성공 시 대성공."}
,
  {name_ko:"반사 전문가", name_en:"Lightning Reflexes", cat:"feature", class_id:"witch", feat_level:9, summary:"반사 내성 숙련도가 전문가로 증가."}
,
  {name_ko:"마법 인내", name_en:"Magical Fortitude", cat:"feature", class_id:"wizard", feat_level:9, summary:"인내 내성 숙련도가 전문가로 증가."}
,
  {name_ko:"경각 감각", name_en:"Vigilant Senses", cat:"feature", class_id:"bard", feat_level:11, summary:"예리한 인식력과 세부 사항에 대한 주의력을 발달시켰습니다. 감지 숙련도가 대가로 증가."}
,
  {name_ko:"무기 전문화", name_en:"Weapon Specialization", cat:"feature", class_id:"bard", feat_level:11, summary:"가장 잘 아는 무기로 더 큰 부상을 입힐 수 있습니다. 전문가인 무기와 비무장 공격으로 추가 피해 2. 대가이면 3, 전설이면 4."}
,
  {name_ko:"4차 교의", name_en:"Fourth Doctrine", cat:"feature", class_id:"cleric", feat_level:11, summary:"선택한 교의의 4차 혜택을 얻습니다(11레벨)."}
,
  {name_ko:"무기 전문가", name_en:"Druid Weapon Expertise", cat:"feature", class_id:"druid", feat_level:11, summary:"단순 무기, 비무장 공격 숙련도가 전문가로 증가."}
,
  {name_ko:"야생 의지력", name_en:"Wild Resolve", cat:"feature", class_id:"druid", feat_level:11, summary:"의지 내성 숙련도가 대가로. 의지 내성에서 성공 시 대성공."}
,
  {name_ko:"갑옷 전문가", name_en:"Armor Expertise", cat:"feature", class_id:"fighter", feat_level:11, summary:"모든 갑옷과 비무장 방어 숙련도가 전문가로 증가."}
,
  {name_ko:"파이터 전문가", name_en:"Fighter Expertise", cat:"feature", class_id:"fighter", feat_level:11, summary:"파이터 클래스 DC 숙련도가 전문가로 증가."}
,
  {name_ko:"관리인의 인내", name_en:"Warden", cat:"feature", class_id:"ranger", feat_level:11, summary:"인내 내성 숙련도가 대가로 증가. 인내 내성에서 성공 시 대성공."}
,
  {name_ko:"평갑 전문가", name_en:"Medium Armor Expertise", cat:"feature", class_id:"ranger", feat_level:11, summary:"경갑, 평갑, 비무장 방어 숙련도가 전문가로 증가."}
,
  {name_ko:"방해받지 않는 여정", name_en:"Unhindered Journey", cat:"feature", class_id:"ranger", feat_level:11, summary:"비마법 험지 이동 시 속도 페널티를 무시합니다. 선호 지형을 선택했다면 추가 혜택을 얻습니다."}
,
  {name_ko:"은밀 공격 3d6", name_en:"Sneak Attack 3d6", cat:"feature", class_id:"rogue", feat_level:11, summary:"은밀 공격 추가 정밀 피해가 3d6으로 증가합니다."}
,
  {name_ko:"로그 전문가", name_en:"Rogue Expertise", cat:"feature", class_id:"rogue", feat_level:11, summary:"로그 클래스 DC 숙련도가 전문가로 증가."}
,
  {name_ko:"감지 전문가", name_en:"Alertness", cat:"feature", class_id:"witch", feat_level:11, summary:"감지 숙련도가 전문가로 증가."}
,
  {name_ko:"무기 전문가", name_en:"Witch Weapon Expertise", cat:"feature", class_id:"witch", feat_level:11, summary:"단순 무기, 비무장 공격 숙련도가 전문가로 증가."}
,
  {name_ko:"감지 전문가", name_en:"Alertness", cat:"feature", class_id:"wizard", feat_level:11, summary:"감지 숙련도가 전문가로 증가."}
,
  {name_ko:"위자드 무기 전문가", name_en:"Wizard Weapon Expertise", cat:"feature", class_id:"wizard", feat_level:11, summary:"단순 무기, 비무장 공격 숙련도가 전문가로 증가."}
,
  {name_ko:"경갑 전문화", name_en:"Light Armor Expertise", cat:"feature", class_id:"bard", feat_level:13, summary:"경갑이나 비무장 상태에서 피하는 법을 배웠습니다. 경갑과 비무장 방어 숙련도가 전문가로 증가."}
,
  {name_ko:"신성 방어", name_en:"Divine Defense", cat:"feature", class_id:"cleric", feat_level:13, summary:"비무장 방어가 전문가로 증가."}
,
  {name_ko:"무기 전문화", name_en:"Weapon Specialization", cat:"feature", class_id:"cleric", feat_level:13, summary:"전문가인 무기와 비무장 공격으로 추가 피해 2(대가 3, 전설 4)."}
,
  {name_ko:"평갑 전문가", name_en:"Medium Armor Expertise", cat:"feature", class_id:"druid", feat_level:13, summary:"경갑, 평갑, 비무장 방어 숙련도가 전문가로 증가."}
,
  {name_ko:"무기 전문화", name_en:"Weapon Specialization", cat:"feature", class_id:"druid", feat_level:13, summary:"전문가인 무기와 비무장 공격으로 추가 피해 2(대가 3, 전설 4)."}
,
  {name_ko:"무기 전설", name_en:"Weapon Legend", cat:"feature", class_id:"fighter", feat_level:13, summary:"파이터 무기 달인으로 선택한 그룹의 단순/군용 무기와 비무장 공격 숙련도가 전설로 증가. 다른 단순/군용 무기와 비무장 공격은 대가로. 고급 무기 숙련도는 전문가로."}
,
  {name_ko:"군용 무기 달인", name_en:"Weapon Mastery", cat:"feature", class_id:"ranger", feat_level:13, summary:"단순 무기, 군용 무기, 비무장 공격 숙련도가 대가로 증가."}
,
  {name_ko:"상위 로그 반사", name_en:"Greater Rogue Reflexes", cat:"feature", class_id:"rogue", feat_level:13, summary:"반사 내성 숙련도가 전설로. 반사 내성에서 대실패 시 실패. 피해를 주는 효과에 대한 반사 내성 실패 시 절반 피해."}
,
  {name_ko:"놀라운 감각", name_en:"Incredible Senses", cat:"feature", class_id:"rogue", feat_level:13, summary:"감지 숙련도가 전설로 증가."}
,
  {name_ko:"경갑 전문가", name_en:"Light Armor Expertise", cat:"feature", class_id:"rogue", feat_level:13, summary:"경갑이나 비무장 상태에서 피하는 법을 배웠습니다. 경갑과 비무장 방어 숙련도가 전문가로 증가."}
,
  {name_ko:"달인 속임수", name_en:"Master Tricks", cat:"feature", class_id:"rogue", feat_level:13, summary:"단순 무기, 군용 무기, 비무장 공격 숙련도가 대가로 증가."}
,
  {name_ko:"방어 법의", name_en:"Defensive Robes", cat:"feature", class_id:"witch", feat_level:13, summary:"비무장 방어 숙련도가 전문가로 증가."}
,
  {name_ko:"무기 전문화", name_en:"Weapon Specialization", cat:"feature", class_id:"witch", feat_level:13, summary:"전문가인 무기와 비무장 공격으로 추가 피해 2(대가 3, 전설 4)."}
,
  {name_ko:"방어 법의", name_en:"Defensive Robes", cat:"feature", class_id:"wizard", feat_level:13, summary:"비무장 방어 숙련도가 전문가로 증가."}
,
  {name_ko:"무기 전문화", name_en:"Weapon Specialization", cat:"feature", class_id:"wizard", feat_level:13, summary:"전문가인 무기와 비무장 공격으로 추가 피해 2(대가 3, 전설 4)."}
,
  {name_ko:"대가 주문시전자", name_en:"Master Spellcaster", cat:"feature", class_id:"bard", feat_level:15, summary:"하프의 줄처럼 마법의 실을 뜯습니다. 주문 공격 수정치와 주문 DC 숙련도가 대가로 증가."}
,
  {name_ko:"5차 교의", name_en:"Fifth Doctrine", cat:"feature", class_id:"cleric", feat_level:15, summary:"선택한 교의의 5차 혜택을 얻습니다(15레벨)."}
,
  {name_ko:"대가 주문시전자", name_en:"Master Spellcaster", cat:"feature", class_id:"druid", feat_level:15, summary:"주문 공격 수정치와 주문 DC 숙련도가 대가로 증가."}
,
  {name_ko:"번뜩이는 반사", name_en:"Evasion", cat:"feature", class_id:"fighter", feat_level:15, summary:"반사 내성에서 성공 시 대성공."}
,
  {name_ko:"상위 무기 전문화", name_en:"Greater Weapon Specialization", cat:"feature", class_id:"fighter", feat_level:15, summary:"무기 전문화의 추가 피해가 증가합니다. 전문가 4, 대가 6, 전설 8."}
,
  {name_ko:"향상된 유연성", name_en:"Improved Flexibility", cat:"feature", class_id:"fighter", feat_level:15, summary:"전투 유연성이 향상됩니다. 14레벨 이하 파이터 특기를 선택 가능. 2개의 특기를 선택하는 것으로도 변경 — 하나는 8레벨 이하, 다른 하나는 14레벨 이하."}
,
  {name_ko:"상위 자연 반사", name_en:"Greater Evasion", cat:"feature", class_id:"ranger", feat_level:15, summary:"반사 내성 숙련도가 대가로 증가. 반사 내성에서 대실패 시 실패. 피해를 주는 효과에 대한 반사 내성 실패 시 절반 피해."}
,
  {name_ko:"상위 무기 전문화", name_en:"Greater Weapon Specialization", cat:"feature", class_id:"ranger", feat_level:15, summary:"무기 전문화의 추가 피해가 증가합니다. 전문가 4, 대가 6, 전설 8."}
,
  {name_ko:"지각 전설", name_en:"Incredible Senses", cat:"feature", class_id:"ranger", feat_level:15, summary:"감지 숙련도가 전설로 증가."}
,
  {name_ko:"이중 쇠약", name_en:"Double Debilitation", cat:"feature", class_id:"rogue", feat_level:15, summary:"쇠약 타격 시 쇠약 효과 2개를 동시에 적용(하나를 제거하면 둘 다 제거)."}
,
  {name_ko:"대가 주문시전자", name_en:"Master Spellcaster", cat:"feature", class_id:"witch", feat_level:15, summary:"주문 공격 수정치와 주문 DC 숙련도가 대가로 증가."}
,
  {name_ko:"대가 주문시전자", name_en:"Master Spellcaster", cat:"feature", class_id:"wizard", feat_level:15, summary:"주문 공격 수정치와 주문 DC 숙련도가 대가로 증가."}
,
  {name_ko:"6차 교의", name_en:"Sixth Doctrine", cat:"feature", class_id:"cleric", feat_level:17, summary:"선택한 교의의 6차 혜택을 얻습니다(17레벨)."}
,
  {name_ko:"갑옷 달인", name_en:"Armor Mastery", cat:"feature", class_id:"fighter", feat_level:17, summary:"모든 갑옷과 비무장 방어 숙련도가 대가로 증가."}
,
  {name_ko:"달인 사냥꾼", name_en:"Masterful Hunter", cat:"feature", class_id:"ranger", feat_level:17, summary:"사냥감 추적에 자유 행동이 아닌 1행동 대신 자유 행동으로 사냥감을 지정할 수 있습니다. 사냥꾼의 기질이 강화됩니다."}
,
  {name_ko:"민첩한 정신", name_en:"Slippery Mind", cat:"feature", class_id:"rogue", feat_level:17, summary:"의지 내성 숙련도가 대가로. 의지 내성에서 성공 시 대성공."}
,
  {name_ko:"은밀 공격 4d6", name_en:"Sneak Attack 4d6", cat:"feature", class_id:"rogue", feat_level:17, summary:"은밀 공격 추가 정밀 피해가 4d6으로 증가합니다."}
,
  {name_ko:"제자의 의지", name_en:"Apprentice", cat:"feature", class_id:"witch", feat_level:17, summary:"의지 내성 숙련도가 대가로. 의지 내성에서 성공 시 대성공."}
,
  {name_ko:"놀라운 의지", name_en:"Resolve", cat:"feature", class_id:"wizard", feat_level:17, summary:"의지 내성 숙련도가 대가로. 의지 내성에서 성공 시 대성공."}
,
  {name_ko:"전설 주문시전자", name_en:"Legendary Spellcaster", cat:"feature", class_id:"bard", feat_level:19, summary:"공연이 우주의 기초를 뒤흔들 수 있습니다. 주문 공격 수정치와 주문 DC 숙련도가 전설로 증가."}
,
  {name_ko:"마기스터리 주문", name_en:"Magistry Spells", cat:"feature", class_id:"bard", feat_level:19, summary:"가장 강력한 주문시전을 완성했습니다. 비학 목록에서 10랭크 주문 1개를 레퍼토리에 추가합니다. 10랭크 주문 슬롯 1개를 얻으며, 이 슬롯으로만 이 주문을 시전할 수 있습니다. 다른 주문 슬롯과 달리, 레벨을 올려도 새 10랭크 슬롯을 얻지 못하지만, 주문을 재훈련으로 교환할 수 있습니다."}
,
  {name_ko:"최종 교의", name_en:"Final Doctrine", cat:"feature", class_id:"cleric", feat_level:19, summary:"선택한 교의의 최종 혜택을 얻습니다(19레벨)."}
,
  {name_ko:"기적의 주문", name_en:"Miraculous Spells", cat:"feature", class_id:"cleric", feat_level:19, summary:"신성 주문 목록에서 10랭크 주문 1개 + 10랭크 슬롯 1개."}
,
  {name_ko:"전설 주문시전자", name_en:"Legendary Spellcaster", cat:"feature", class_id:"druid", feat_level:19, summary:"주문 공격 수정치와 주문 DC 숙련도가 전설로 증가."}
,
  {name_ko:"원시 대사제", name_en:"Primal Hierophant", cat:"feature", class_id:"druid", feat_level:19, summary:"원시 주문 목록에서 10랭크 주문 1개 + 10랭크 슬롯 1개."}
,
  {name_ko:"다재다능한 전설", name_en:"Versatile Legend", cat:"feature", class_id:"fighter", feat_level:19, summary:"전투의 모든 측면을 익혔습니다. 파이터 클래스 DC가 대가로. 모든 단순/군용 무기와 비무장 공격이 전설로. 모든 고급 무기가 대가로 증가."}
,
  {name_ko:"평갑 달인", name_en:"Medium Armor Mastery", cat:"feature", class_id:"ranger", feat_level:19, summary:"경갑, 평갑, 비무장 방어 숙련도가 대가로 증가."}
,
  {name_ko:"신속 사냥감", name_en:"Swift Prey", cat:"feature", class_id:"ranger", feat_level:19, summary:"사냥감 추적을 자유 행동으로 사용할 수 있습니다."}
,
  {name_ko:"경갑 달인", name_en:"Light Armor Mastery", cat:"feature", class_id:"rogue", feat_level:19, summary:"경갑, 비무장 방어 숙련도가 대가로 증가."}
,
  {name_ko:"달인 타격", name_en:"Master Strike", cat:"feature", class_id:"rogue", feat_level:19, summary:"쇠약 타격 유발 시, 쇠약 효과 대신 대상에게 클래스 DC에 대해 인내 내성을 강제할 수 있습니다(무력화 효과). 대성공: 영향 없음. 성공: 쇠약 효과 적용. 실패: 쇠약 효과 + 느려짐(slowed) 2. 대실패: 마비(paralyzed) 1라운드 후 쇠약 + 느려짐 2."}
,
  {name_ko:"전설 주문시전자", name_en:"Legendary Spellcaster", cat:"feature", class_id:"witch", feat_level:19, summary:"주문 공격 수정치와 주문 DC 숙련도가 전설로 증가."}
,
  {name_ko:"후원자의 선물", name_en:"Patron", cat:"feature", class_id:"witch", feat_level:19, summary:"10랭크 주문 슬롯 1개를 얻습니다."}
,
  {name_ko:"전설 주문시전자", name_en:"Legendary Spellcaster", cat:"feature", class_id:"wizard", feat_level:19, summary:"주문 공격 수정치와 주문 DC 숙련도가 전설로 증가."}
,
  {name_ko:"대위자드의 신비학", name_en:"Archwizard", cat:"feature", class_id:"wizard", feat_level:19, summary:"10랭크 주문 슬롯 1개를 얻습니다."}
,
  // ═══════════════════════════════════════════════
  //  혈통 재주 — Ancestry Feats (Player Core)
  // ═══════════════════════════════════════════════

  // ── 드워프 Dwarf ──
  {name_ko:'드워프 지식', name_en:'Dwarven Lore', feat_level:1, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'제작과 종교학에 숙련됨. 드워프 관련 지식(Lore)에 숙련됨.', desc:'조상, 신, 종족의 오래된 이야기와 전통을 열심히 흡수하여, 세대를 거쳐 전해진 주제와 기법을 공부했습니다. <strong>제작과 종교에 숙련</strong>됩니다. 이 기술 중 하나에 자동으로 숙련되는 경우(배경이나 클래스 등으로), 대신 선택한 다른 기술에 숙련됩니다.<br>또한 <strong>드워프 지식(Dwarf Lore)</strong>에 대한 추가 지식(Additional Lore) 일반 재주를 얻습니다.'}
,
  {name_ko:'산맥의 뿌리', name_en:'Mountain Roots', feat_level:1, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'강제 이동 거리 절반 감소. 넘어뜨리기에 대한 반사/인내 DC +2.', desc:'산과 같은 안정감으로 밀어내기에 저항합니다. 넘어뜨리기(Trip) 시도에 대한 인내 또는 반사 DC에 +2 상황 보너스를 얻습니다. 강제 이동 거리가 절반으로 줄어듭니다.'}
,
  {name_ko:'드워프 무기 친숙', name_en:'Dwarven Weapon Familiarity', feat_level:1, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'전투 도끼, 픽, 워해머에 친숙. 드워프 특성 무기는 한 단계 낮은 카테고리로 취급.', desc:'동족이 강타 무기에 대한 친화력을 심어주었고, 당신은 더 우아한 무기보다 이것을 선호합니다. 드워프 특성의 모든 <strong>비일반 무기에 접근</strong>합니다. 드워프 특성 무기와 전투 도끼(battle axe), 곡괭이(pick), 워해머(warhammer)에 친숙합니다 — 숙련도 목적으로, 이 중 <strong>군용 무기는 단순 무기</strong>로, <strong>고급 무기는 군용 무기</strong>로 취급합니다.<br>5레벨에서, 이 무기 중 하나로 치명타를 가하면 해당 무기의 <strong>치명 특성 효과</strong>를 적용합니다.'}
,
  {name_ko:'바위 달리기', name_en:'Rock Runner', feat_level:1, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'바위/흙 험한 지형에서 이동 속도 페널티 없음.', desc:'돌과의 타고난 연결로 울퉁불퉁한 표면을 민첩하게 이동합니다. 돌로 인한 <strong>험지(잔해나 자갈 등)와 돌과 흙으로 된 고르지 않은 지면을 무시</strong>할 수 있습니다. 추가로, 곡예(Acrobatics) 기술로 돌이나 흙으로 된 좁은 표면이나 고르지 않은 지면에서 균형 잡기(Balance)를 할 때, <strong>무방비(off-guard) 상태가 되지 않으며</strong>, 이 곡예 판정에서 <strong>성공을 굴리면 대성공</strong>이 됩니다.'}
,
  {name_ko:'부담 없는 철갑', name_en:'Unburdened Iron', feat_level:1, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'방어구 착용으로 인한 이동 속도 감소를 5피트 줄임.', desc:'고대 전쟁 중 조상이 처음 고안한 기법을 배워, 거대한 갑옷을 편하게 착용할 수 있습니다. 착용한 갑옷으로 인한 <strong>이동 속도 감소를 무시</strong>합니다.<br>추가로, 다른 이유(예: 과적(encumbered) 상태나 주문)로 이동 속도에 페널티를 받을 때, 페널티에서 <strong>5피트를 차감</strong>합니다. 예를 들어, 과적 상태는 일반적으로 이동 속도에 -10피트 페널티를 주지만, 이 재주로 -5피트 페널티로 줄어듭니다. 이동 속도에 여러 페널티가 있으면 하나만 선택하여 줄입니다.'}
,
  {name_ko:'보복의 맹세', name_en:'Vengeful Hatred', feat_level:1, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'선택한 적 유형에 대해 근접 무기 피해 +1. 전문화 시 +2.', desc:'오랜 적에 대한 드워프의 복수심. 특정 적 유형을 선택하고 해당 유형에 대한 근접 무기 피해에 +1 상황 보너스를 얻습니다.'}
,
  {name_ko:'드워프의 담력', name_en:'Dwarven Doughtiness', feat_level:1, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'절박한 위험에 직면해도 자연스럽게 침착하고 냉정합니다. 턴 종료 시, 공포(frightened) 상태를 1 대신 2만큼 감소시킵니다.', desc:'절박한 위험에 직면해도 자연스럽게 침착하고 냉정합니다. 턴 종료 시, 공포(frightened) 상태를 1 대신 <strong>2만큼 감소</strong>시킵니다.'}
,
  {name_ko:'산악 전략', name_en:'Mountain Strategy', feat_level:1, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'드워프는 흔한 적과 싸운 오랜 역사가 있으며, 당신은 이 적들에 더 잘 대항하기 위해 고대 전술을 숙달했습니다. 거인(giant), 고블린(go', desc:'드워프는 흔한 적과 싸운 오랜 역사가 있으며, 당신은 이 적들에 더 잘 대항하기 위해 고대 전술을 숙달했습니다. 거인(giant), 고블린(goblin), 흐린가르(hryngar), 오크(orc) 특성을 가진 생물에 대해 무기와 비무장 공격의 피해에 <strong>+1 상황 보너스</strong>를 얻습니다. 공격이 1 이상의 무기 피해 주사위를 입히면(1레벨 이후 흔함), 보너스는 무기 주사위 또는 비무장 공격 주사위의 수와 같습니다.<br>추가로, 어떤 생물이 당신에 대한 공격에 대성공하여 피해를 입히면, 선택한 특성을 가지고 있는지 여부에 관계없이 <strong>1분간 해당 생물에 대한 피해 보너스</strong>를 얻습니다.<br><strong>특수:</strong> GM은 캐릭터가 다른 유형의 적과 흔히 싸우는 공동체 출신이면 조상의 적 목록에 적절한 생물 특성을 추가할 수 있습니다.'}
,
  {name_ko:'석공의 눈', name_en:'Stonemason\'s Eye', feat_level:1, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'석조물의 복잡한 세부 사항을 이해합니다. 제작에 숙련됩니다. 이미 제작에 숙련이면 대신 석조(stonemasonry)에 대한 전문 제작(Spec', desc:'석조물의 복잡한 세부 사항을 이해합니다. <strong>제작에 숙련</strong>됩니다. 이미 제작에 숙련이면 대신 석조(stonemasonry)에 대한 전문 제작(Specialty Crafting) 기술 재주를 얻습니다.<br>또한 비정상적인 석조물을 알아채기 위한 지각 판정에 <strong>+2 상황 보너스</strong>를 얻습니다. 이 보너스는 돌로 만들어졌거나 돌 안에 숨겨진 기계 함정을 발견하는 판정에도 적용됩니다.<br>탐색(Seek) 행동이나 수색을 하지 않더라도, GM이 자동으로 비정상적인 석조물을 알아채기 위한 비밀 판정을 굴려줍니다. 이 판정에는 일반 상황 보너스가 적용되지 않습니다.'}
,
  {name_ko:'바위 껍질', name_en:'Boulder Roll', feat_level:5, prerequisites:'드워프, 바위 달리기', traits:['드워프'], category:'ancestry', summary:'이동 중 적에게 밀기 시도. 험한 지형 무시.', desc:'<strong>전제조건:</strong> 바위 달리기(Rock Runner)<br>드워프의 체격으로 적을 밀어낼 수 있습니다, 마치 거대한 바위가 지하 동굴을 굴러가듯. 당신과 같은 크기 이하인 적이 있는 <strong>칸으로 한 걸음(Step)</strong>을 밟으면, 적은 바로 뒤의 빈 칸으로 이동해야 합니다. 적은 해를 끼치는 곳이라도 이동해야 합니다. 적은 당신의 운동(Athletics) DC에 대해 <strong>인내(Fortitude) 내성 굴림</strong>을 시도하여 한 걸음을 막을 수 있습니다. 내성을 시도하면, 대성공하지 않는 한 <strong>레벨 + 근력 수정치만큼의 둔기 피해</strong>를 받습니다.<br>적이 빈 칸으로 이동할 수 없으면(고체 물체나 다른 생물에 둘러싸여 있는 등), 바위 굴리기는 효과가 없습니다.'}
,
  {name_ko:'어둠에 맞서기', name_en:'Defy the Darkness', feat_level:5, prerequisites:'드워프, 암시야', traits:['드워프'], category:'ancestry', summary:'상위 암시야 획득. 마법 어둠도 꿰뚫어 봄. 어둠 주문 사용 불가.', desc:'<strong>전제조건:</strong> 암시야(darkvision)<br>마법 어둠을 다루는 적과 싸우기 위해 개발된 고대 드워프 방법을 사용하여, 암시야를 연마하고 그런 마법을 직접 사용하지 않겠다고 맹세했습니다. <strong>상위 암시야(greater darkvision)</strong>를 얻어, 일반적으로 암시야를 방해하는 마법 어둠(예: 4랭크 어둠 주문이 만든 어둠)도 꿰뚫어 볼 수 있습니다. 어둠(darkness) 특성이 있는 주문을 시전하거나, 어둠 특성이 있는 아이템 활성화를 사용하거나, 어둠 특성이 있는 다른 능력을 사용할 수 <strong>없습니다</strong>.'}
,
  {name_ko:'돌의 메아리', name_en:'Echoes in Stone', feat_level:9, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'요구사항: 돌이나 흙 표면 위에 서 있어야 합니다.', desc:'<strong>요구사항:</strong> 돌이나 흙 표면 위에 서 있어야 합니다.<br>잠시 멈춰 주변의 돌에 감각을 동조시킵니다. 다음 턴 시작까지 <strong>20피트 범위의 부정확 진동감각(tremorsense)</strong>을 얻습니다.'}
,
  {name_ko:'산의 강인함', name_en:'Mountain\'s Stoutness', feat_level:9, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'강인함으로 대부분보다 더 많은 벌을 견딜 수 있습니다. 최대 히트 포인트를 레벨만큼 증가시킵니다. 빈사(dying) 상태일 때, 회복 판정의 D', desc:'강인함으로 대부분보다 더 많은 벌을 견딜 수 있습니다. 최대 히트 포인트를 <strong>레벨만큼 증가</strong>시킵니다. 빈사(dying) 상태일 때, 회복 판정의 DC가 <strong>10 + 빈사 수치 대신 9 + 빈사 수치</strong>입니다.<br>강인함(Toughness) 재주도 가지고 있으면, 그것과 이 재주에서 얻는 히트 포인트는 누적되며, 회복 판정 DC는 <strong>6 + 빈사 수치</strong>입니다.'}
,
  {name_ko:'돌뼈', name_en:'Stone Bones', feat_level:9, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'[반응] 물리적 치명타를 DC 17 단순 판정으로 일반 명중으로 변환.', desc:'<strong>유발 조건:</strong> 물리적 피해를 입히는 치명타에 맞습니다.<br>불굴의 본성이 가장 심각한 부상도 떨쳐내는 데 도움을 줍니다. <strong>DC 17 단순 판정</strong>을 시도합니다. 성공하면, 공격이 <strong>일반 명중</strong>이 됩니다.'}
,
  {name_ko:'산 이동자', name_en:'Stonewalker', feat_level:13, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'흙/돌 사이로 녹아들 수 있음. 대지 이동 관련 능력 향상.', desc:'돌에 대한 깊은 경외심과 연결이 있습니다. <em>돌과 하나(one with stone)</em>를 <strong>3랭크 신성 선천 주문으로 하루 1회</strong> 시전할 수 있습니다.<br>석공의 눈(Stonemason\'s Eye) 재주가 있으면, 전설 숙련도가 필요한 비정상적 석조물과 석조 함정을 찾을 수 있습니다. 석공의 눈과 지각 전설 숙련도가 모두 있으면, GM이 비정상적 석조물을 알아채기 위한 비밀 판정을 굴릴 때 석공의 눈 보너스를 유지합니다.'}
,
  {name_ko:'광산 행군', name_en:'March the Mines', feat_level:13, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'[3행동] 굴착 속도 15피트 획득. 보폭/굴착 2회 + 인접 아군 1명 동반 이동.', desc:'대지를 통과하며 행군하고 아군을 이끕니다. 이 활동을 사용할 때 <strong>굴착 속도 15피트</strong>를 얻고(더 높은 것이 없다면), 보폭 2회 또는 굴착 2회를 합니다. 이동 시작 시 인접한 <strong>동의하는 아군 1명</strong>을 선택하여 함께 이동시킬 수 있습니다. 해당 아군은 당신의 바로 뒤 칸에서 이동을 종료합니다.'}
,
  {name_ko:'대지의 힘', name_en:'Telluric Power', feat_level:13, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'발 아래 대지에서 힘을 끌어올려 적을 강타합니다. 같은 흙이나 돌 표면 위에 서 있는 대상에 대한 근접 타격 시, 무기 피해 주사위 수만큼 상황', desc:'발 아래 대지에서 힘을 끌어올려 적을 강타합니다. 같은 흙이나 돌 표면 위에 서 있는 대상에 대한 근접 타격 시, <strong>무기 피해 주사위 수만큼 상황 보너스를 피해 굴림에 추가</strong>합니다.'}
,
  {name_ko:'돌문', name_en:'Stonegate', feat_level:17, prerequisites:'드워프, 산 이동자', traits:['드워프'], category:'ancestry', summary:'마법 통로를 7랭크 신성 선천 주문으로 하루 1회 (흙/돌만).', desc:'대지의 장벽이 더 이상 진행을 방해하지 않습니다. <em>마법 통로(magic passage)</em>를 <strong>7랭크 신성 선천 주문으로 하루 1회</strong> 시전할 수 있습니다. 그러나 일반 주문과 달리, 이 능력은 <strong>흙이나 돌로 된 장벽을 통과하는 데만</strong> 사용할 수 있습니다.'}
,
  {name_ko:'돌벽', name_en:'Stonewall', feat_level:17, prerequisites:'드워프', traits:['드워프'], category:'ancestry', summary:'[반응] 하루 1회. 적의 명중/인내 실패 시 석화되어 모든 피해 무효.', desc:'<strong>빈도:</strong> 하루 1회<br><strong>유발 조건:</strong> 적이나 위험의 효과가 당신에게 명중하거나, 그에 대한 인내 내성에 실패합니다.<br>돌의 강인함이 너무 강하게 밀려와 당신의 건장한 몸을 대체합니다. 현재 턴 종료까지 <strong>석화(petrified)</strong>됩니다. 유발 효과나 돌에 영향을 줄 수 없는 다른 해로운 효과로부터 <strong>어떤 피해도 받지 않습니다</strong>.'}
,
  // ── 엘프 Elf ──
  {name_ko:'엘프 지식', name_en:'Elven Lore', feat_level:1, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'신비학과 자연학에 숙련. 엘프 지식(Elf Lore)에 숙련.', desc:'전통적인 엘프 예술을 공부하여 비전 마법과 주변 세계에 대해 배웠습니다. <strong>신비학과 자연학에 숙련</strong>됩니다. 이 기술 중 하나에 자동으로 숙련되는 경우, 대신 선택한 다른 기술에 숙련됩니다. 또한 <strong>엘프 지식(Elf Lore)</strong>에 대한 추가 지식 일반 재주를 얻습니다.'}
,
  {name_ko:'엘프 무기 친숙', name_en:'Elven Weapon Familiarity', feat_level:1, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'장궁, 단궁, 롱소드, 레이피어에 훈련됨. 엘프 특성 무기는 한 단계 낮은 카테고리로 취급.', desc:'활과 기타 우아한 무기를 선호합니다. 엘프 특성의 모든 비일반 무기에 접근합니다. 엘프 특성 무기와 장궁, 합성 장궁, 레이피어, 단궁, 합성 단궁에 친숙합니다 — 숙련도 목적으로, 이 중 <strong>군용 무기는 단순 무기</strong>로, <strong>고급 무기는 군용 무기</strong>로 취급합니다.<br>5레벨에서, 이 무기 중 하나로 치명타를 가하면 해당 무기의 치명 특성 효과를 적용합니다.'}
,
  {name_ko:'조상의 장수', name_en:'Ancestral Longevity', feat_level:1, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'일일 준비 시 기술 1개에 임시 숙련.', desc:'<strong>전제조건:</strong> 최소 100세<br>수년에 걸쳐 방대한 생활 지식을 축적했습니다. 일일 준비 시, 삶의 경험을 되돌아보며 선택한 <strong>기술 1개에 숙련</strong>됩니다. 이 숙련은 다음 준비 때까지 지속됩니다. 임시 숙련이므로, 기술 증가나 재주 같은 영구적 캐릭터 옵션의 전제조건으로 사용할 수 없습니다.'}
,
  {name_ko:'비탄', name_en:'Forlorn', feat_level:1, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'감정 효과 내성 +1. 성공 시 대성공.', desc:'친구들이 나이 들고 죽는 것을 지켜보는 것이 유해한 감정으로부터 당신을 보호하는 우울함으로 채웁니다. 감정(emotion) 효과에 대한 내성 굴림에 <strong>+1 상황 보너스</strong>를 얻습니다. 감정 효과에 대한 내성 굴림에서 <strong>성공을 굴리면 대성공</strong>이 됩니다.'}
,
  {name_ko:'재빠른 엘프', name_en:'Nimble Elf', feat_level:1, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'이동 속도 +5피트.', desc:'근육이 단단히 다듬어졌습니다. 이동 속도가 <strong>5피트 증가</strong>합니다.'}
,
  {name_ko:'이세계 마법', name_en:'Otherworldly Magic', feat_level:1, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'비전 캔트립 1개를 선천 주문으로 자유 시전.', desc:'엘프 마법이 단순한 비전 주문으로 나타나며, 정식으로 마법 훈련을 받지 않았더라도 그렇습니다. 비전 주문 목록(304페이지)에서 <strong>캔트립 1개</strong>를 선택합니다. 이 캔트립을 비전 선천 주문으로 자유롭게 시전할 수 있습니다. 캔트립은 레벨 절반(올림)과 같은 주문 랭크로 고양됩니다.'}
,
  {name_ko:'흔들리지 않는 면모', name_en:'Unwavering Mien', feat_level:1, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'정신 효과 지속시간 1라운드 감소. 수면 효과 내성 한 단계 상승.', desc:'신비로운 통제와 명상이 의식에 대한 외부 영향에 저항할 수 있게 합니다. 최소 2라운드 지속되는 정신(mental) 효과의 영향을 받을 때마다, <strong>지속 시간을 1라운드 줄일 수 있습니다</strong>.<br>자연적 수면은 여전히 필요하지만, 잠들게 하는 효과에 대한 내성 굴림을 <strong>한 단계 높은 성공도</strong>로 취급합니다. 이것은 수면 효과에만 보호하며, 다른 형태의 의식 상실에는 적용되지 않습니다.'}
,
  {name_ko:'세월의 인내', name_en:'Ageless Patience', feat_level:5, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'2배 시간 투자 시 판정에 +2 상황 보너스.', desc:'장수에서 태어난 속도로 일하여 꼼꼼함을 향상시킵니다. 지각 판정이나 기술 판정에 <strong>평소의 두 배 시간</strong>을 자발적으로 소비할 수 있습니다. 그렇게 하면 판정에 <strong>+2 상황 보너스</strong>를 얻고, 자연 1에서 자동으로 성공도가 낮아지지 않습니다(결과가 DC보다 10 이상 낮을 때만 대실패). 예를 들어, 일반적으로 1행동이 걸리는 탐색에 2행동을 소비하면 이 혜택을 얻습니다. 탐험 중에는 평소의 두 배 시간을, 휴식 중에는 두 배의 휴식 시간을 소비하면 됩니다.<br>GM은 지연이 성공에 직접 반생산적인 상황(예: 조급한 생물과의 긴장된 협상)에서는 혜택이 없다고 판단할 수 있습니다.'}
,
  {name_ko:'조상의 의심', name_en:'Ancestral Suspicion', feat_level:5, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'조종 효과 내성 +2. 의도 파악에도 +2. 성공 시 대성공.', desc:'오래 산 엘프는 문명이 흥하고 망하는 것을 보았으며, 종종 외부 세력의 손에 의해서였습니다. 그 결과, 영향이나 지배를 시도하는 자에 대한 경계심을 키웠습니다. 지배(dominate)처럼 <strong>조종(controlled) 상태로 만드는 효과에 대한 내성 굴림에 +2 상황 보너스</strong>를 얻고, 생물이 그러한 효과의 영향 아래 있는지 판단하기 위한 의도 파악(Sense Motive) 지각 판정에도 같은 보너스를 얻습니다. 그러한 효과에 대한 내성에서 <strong>성공을 굴리면 대성공</strong>이 됩니다.'}
,
  {name_ko:'무술 경험', name_en:'Martial Experience', feat_level:5, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'미숙련 무기에 레벨을 숙련 보너스로. 11레벨에서 모든 무기 숙련.', desc:'다양한 무기를 든 다양한 적과 칼을 맞대었으며, 거의 모든 무기로 싸우는 기초를 배웠습니다. 숙련되지 않은 무기를 사용할 때, <strong>레벨을 숙련 보너스로 취급</strong>합니다.<br>11레벨에서, <strong>모든 무기에 숙련</strong>됩니다.'}
,
  {name_ko:'엘프 걸음', name_en:'Elf Step', feat_level:9, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'[1행동] 5피트 한 걸음(Step) 2회.', desc:'우아한 춤처럼 움직이며, 보폭도 넓습니다. <strong>5피트 한 걸음(Step)을 2회</strong> 합니다.'}
,
  {name_ko:'전문가의 장수', name_en:'Expert Longevity', feat_level:9, prerequisites:'엘프, 조상의 장수', traits:['엘프'], category:'ancestry', summary:'조상의 장수 시 추가로 숙련 기술 1개를 전문가로.', desc:'<strong>전제조건:</strong> 조상의 장수(Ancestral Longevity)<br>삶을 통해 얻은 지식과 기술을 계속 다듬었습니다. 조상의 장수로 숙련될 기술을 선택할 때, 이미 숙련된 기술 하나도 추가로 선택하여 <strong>전문가</strong>로 만들 수 있습니다. 이것은 조상의 장수가 만료될 때까지 지속됩니다.<br>조상의 장수와 전문가의 장수 효과가 만료되면, <strong>기술 증가 하나를 재훈련</strong>할 수 있습니다. 재훈련으로 얻는 기술 증가는 조상의 장수로 선택한 기술에 숙련되게 하거나, 전문가의 장수로 선택한 기술에 전문가가 되게 해야 합니다.'}
,
  {name_ko:'이세계 통찰', name_en:'Otherworldly Acumen', feat_level:9, prerequisites:'엘프, 이세계 마법', traits:['엘프'], category:'ancestry', summary:'같은 전통의 2랭크 주문 1개를 선천 주문으로 하루 1회.', desc:'<strong>전제조건:</strong> 엘프 혈통 재주에서 얻은 선천 주문이 최소 1개<br>보유한 비전 마법이 힘과 복잡성에서 성장합니다. 이전에 다른 엘프 혈통 재주에서 얻은 선천 주문과 같은 전통에서 일반적인 <strong>2랭크 주문 1개</strong>를 선택합니다(예: 이세계 마법이 있으면 비전 목록에서). 그 주문을 선천 주문으로 <strong>하루 1회</strong> 시전할 수 있으며, 선택한 목록과 같은 전통을 사용합니다.<br>마법은 적응성이 있습니다. <strong>휴식 1일</strong>을 소비하면, 선택한 주문을 같은 전통의 다른 일반적인 2랭크 주문으로 변경할 수 있습니다.'}
,
  {name_ko:'나무 타기', name_en:'Tree Climber', feat_level:9, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'등반 속도 10피트 획득.', desc:'나무꼭대기에서 삶의 상당 부분을 보내며 빠르고 안전하게 오르는 전문가가 되었습니다. <strong>등반 속도 10피트</strong>를 얻습니다.'}
,
  {name_ko:'동료 복수', name_en:'Avenge Ally', feat_level:13, prerequisites:'엘프', traits:['엘프','행운'], category:'ancestry', summary:'[1행동] 빈사 아군 30ft 내에서 공격 2회 굴림. 10분 1회.', desc:'<strong>빈도:</strong> 10분에 1회<br><strong>요구사항:</strong> 빈사(dying) 상태인 아군의 30피트 내에 있어야 합니다.<br>언젠가 동료들보다 오래 살 것을 알지만, 그들이 죽음의 문턱에 있는 것을 보면 공격에 명료함이 생깁니다. 타격을 합니다. 명중 굴림을 <strong>두 번 굴리고 높은 결과</strong>를 사용합니다.'}
,
  {name_ko:'전문 엘프 무기', name_en:'Expert Elven Weaponry', feat_level:13, prerequisites:'엘프, 엘프 무기 친숙', traits:['엘프'], category:'ancestry', summary:'엘프 무기 숙련도 전문가로 증가.', desc:'엘프 무기에 대한 숙련도가 <strong>전문가</strong>로 증가합니다.'}
,
  {name_ko:'보편적 장수', name_en:'Universal Longevity', feat_level:13, prerequisites:'엘프, 조상의 장수', traits:['엘프'], category:'ancestry', summary:'[1행동] 하루 1회. 조상의 장수 기술 변경.', desc:'<strong>전제조건:</strong> 조상의 장수(Ancestral Longevity)<br><strong>빈도:</strong> 하루 1회<br>긴 삶에서 배운 모든 기술을 따라잡는 능력을 완성하여, 거의 진정으로 미숙련인 적이 없습니다. 삶의 경험을 되돌아보며, 조상의 장수로 선택한 기술을 변경합니다(전문가의 장수가 있으면 그 기술도 변경).'}
,
  {name_ko:'마법 탑승자', name_en:'Magic Rider', feat_level:17, prerequisites:'엘프', traits:['엘프'], category:'ancestry', summary:'순간이동 대상 시 추가 1명 + 목표 1마일 이내 도착.', desc:'먼 과거에 먼 세계 사이를 여행하기 위해 강력한 마법을 사용했으며, 그 마법의 잔재가 그러한 이동을 더 쉽게 만듭니다. 둘 이상을 운송하는 <strong>순간이동 주문의 대상</strong>이 될 때, 시전자가 선택하여 일반 한계를 넘어 <strong>추가 1명</strong>에게 영향을 줄 수 있습니다. 추가로, 순간이동(teleport) 주문의 대상이 될 때, 이동 거리에 관계없이 당신과 다른 대상은 <strong>목표에서 1마일 이내</strong>에 도착합니다.'}
,
  // ── 노움 Gnome ──
  {name_ko:'동물 속삭임', name_en:'Animal Elocutionist', feat_level:1, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'동물과 대화(speak with animals) 지속 효과.', desc:'동물 소리를 무지한 소음이 아닌 대화로 듣고, 대답할 수 있습니다. 동물에게 질문하고, 답을 받고, 외교(Diplomacy) 기술을 사용할 수 있습니다. 대부분의 경우 야생 동물은 당신이 말할 시간을 줍니다. 동물에게 <strong>인상 만들기(Make an Impression)에 +1 상황 보너스</strong>를 얻습니다.'}
,
  {name_ko:'페이 제 이야기', name_en:'Fey Fellowship', feat_level:1, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'페이와의 상호작용에서 외교/지각 판정에 +2 상황 보너스.', desc:'강화된 페이 연결(혈통이나 장기간의 접촉)이 첫 번째 세계의 생물에게서 더 따뜻한 대접과 그들의 속임수를 무력화하거나 마법을 견디는 도구를 제공합니다. 페이에 대한 지각 판정과 내성 굴림에 <strong>+2 상황 보너스</strong>를 얻습니다.<br>추가로, 사회적 상황에서 페이 생물을 만나면, 1분간 대화할 필요 없이 즉시 외교 판정으로 인상 만들기를 시도할 수 있습니다(-5 페널티 적용). 실패하면, 실패나 대실패 결과를 받아들이는 대신 1분간 대화하고 그 끝에 새 판정을 시도할 수 있습니다.'}
,
  {name_ko:'노움 무기 친숙', name_en:'Gnome Weapon Familiarity', feat_level:1, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'글레이브에 숙련됨. 노움 무기를 단순 무기로 취급.', desc:'구부러지고 독특한 모양의 칼날 같은 종족 특유의 무기를 선호합니다. 쿠크리(kukris)와 노움 특성의 모든 비일반 무기에 접근합니다. 노움 특성 무기와 글레이브, 쿠크리에 친숙합니다 — 숙련도 목적으로, 이 중 <strong>군용 무기는 단순 무기</strong>로, <strong>고급 무기는 군용 무기</strong>로 취급합니다.<br>5레벨에서, 이 무기 중 하나로 치명타를 가하면 해당 무기의 치명 특성 효과를 적용합니다.'}
,
  {name_ko:'집착적 연구', name_en:'Gnome Obsession', feat_level:1, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'선택한 지식(Lore) 기술에 숙련됨. 레벨 상승 시 자동 증가.', desc:'변덕스러운 성격일 수 있지만, 주제가 주의를 끌면 머리부터 뛰어듭니다. <strong>추가 지식(Additional Lore)</strong> 재주와 선택한 지식에 대한 <strong>확신(Assurance)</strong> 재주를 얻습니다. 노움의 집착은 빠르게 왔다 갈 수 있으므로, <strong>휴식 1일</strong>로 노움 집착을 다른 지식 하위 범주로 재훈련할 수 있습니다.'}
,
  {name_ko:'감각 예민', name_en:'Illusion Sense', feat_level:1, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'환상에 대한 간파 판정에 +1 상황 보너스. 환상 종류 인식 초기 판정 획득.', desc:'조상이 환영에 싸여 요람에서 자라며 나날을 보냈고, 그 결과 환영 마법을 감지하는 것이 제2의 천성입니다. 환영에 대한 지각 판정과 의지 내성에 <strong>+1 상황 보너스</strong>를 얻습니다.<br>불신할 수 있는 환영의 10피트 내에 들어오면, 상호작용(Interact) 행동에 행동을 소비하지 않았더라도 GM이 <strong>자동으로 비밀 불신 판정</strong>을 굴려줍니다.'}
,
  {name_ko:'제1세계 마법', name_en:'First World Magic', feat_level:1, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'페이 세계의 마법이 흐릅니다.', desc:'첫 번째 세계와의 연결이 페이와 유사한 원시 선천 주문을 부여합니다. 원시 주문 목록(311페이지)에서 <strong>캔트립 1개</strong>를 선택합니다. 이 주문을 원시 선천 주문으로 자유롭게 시전할 수 있습니다. 캔트립은 레벨 절반(올림)과 같은 주문 랭크로 고양됩니다.'}
,
  {name_ko:'눈부신 빛', name_en:'Razzle-Dazzle', feat_level:1, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'빈도: 시간당 1회', desc:'<strong>빈도:</strong> 시간당 1회<br><br>빛의 조작을 상당히 연습하여, 칼날의 반사를 무기화하거나 마법적 표현의 밝기를 비상식적인 높이로 강화했습니다. 대상에게 부여하는 실명 또는 눈부심 상태의 지속 시간을 <strong>1라운드 연장</strong>합니다.'}
,
  {name_ko:'동물 지원자', name_en:'Animal Accomplice', feat_level:5, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'페이의 힘으로 작은 동물과 유대를 맺습니다.', desc:'동물과 유대를 맺어 마법적으로 결합됩니다. 212페이지의 규칙을 사용하여 <strong>사역마</strong>를 얻습니다. 동물의 종류는 당신이 정하지만, 대부분의 노움은 굴착 속도가 있는 동물을 선택합니다.'}
,
  {name_ko:'가상 인격', name_en:'Project Persona', feat_level:5, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'다른 이들이 갑옷에 각인하여 상상력의 통로로 삼는 곳에서, 당신의 생생한 마음과 대담한 성격은 밋밋한 갑옷 위에 더 어울리는 인격을 투사합니다.', desc:'다른 이들이 갑옷에 각인하여 상상력의 통로로 삼는 곳에서, 당신의 생생한 마음과 대담한 성격은 밋밋한 갑옷 위에 더 어울리는 인격을 투사합니다. 갑옷의 모양과 외관을 <strong>상상하는 일상복이나 고급 의복</strong>으로 변경합니다. 갑옷의 능력치는 변하지 않습니다. 의식이 있고 갑옷을 착용하는 한 지속됩니다. 생물은 탐색(Seeking)이나 갑옷을 만져서 환영을 불신할 수 있습니다. DC는 당신의 의지 DC와 같습니다.'}
,
  {name_ko:'생명력 증대', name_en:'Energized Font', feat_level:9, prerequisites:'노움, 제1세계 마법', traits:['노움'], category:'ancestry', summary:'집중 포인트 +1 또는 타고난 주문 슬롯 추가.', desc:'<strong>전제조건:</strong> 집중 풀(focus pool), 노움 유산이나 혈통 재주에서 얻은 선천 주문 중 하나 이상이 집중 주문과 같은 전통을 공유<br><br>내면에 흐르는 마법 덕분에 정신을 더 빠르게 집중할 수 있습니다. 평소 최대까지 <strong>집중 포인트 1점을 회복</strong>합니다.'}
,
  {name_ko:'신중한 호기심', name_en:'Cautious Curiosity', feat_level:9, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'전제조건: 노움 유산이나 혈통 재주에서 얻은 비전 또는 비학 선천 주문 최소 1개', desc:'<strong>전제조건:</strong> 노움 유산이나 혈통 재주에서 얻은 비전 또는 비학 선천 주문 최소 1개<br>들키지 않고 곤경에 빠지고 빠져나오는 마법 기법을 배웠습니다. <em>변장 마법(disguise magic)</em>과 <em>침묵(silence)</em>을 <strong>2랭크 비전 또는 비학 선천 주문</strong>으로 얻습니다. 전통은 노움 혈통 옵션에 사용하는 전통과 일치해야 합니다. 각 주문을 <strong>하루 1회</strong> 시전할 수 있으며, 자신만 대상으로 할 수 있습니다.'}
,
  {name_ko:'제1세계 전문가', name_en:'First World Adept', feat_level:9, prerequisites:'노움, 제1세계 마법', traits:['노움'], category:'ancestry', summary:'투명화와 폭로의 빛을 2랭크 원시 선천 주문으로 하루 1회.', desc:'페이 마법이 시간이 지나며 강해졌습니다. <em>투명화(invisibility)</em>와 <em>폭로의 빛(revealing light)</em>을 <strong>2랭크 원시 선천 주문</strong>으로 얻습니다. 각 주문을 <strong>하루 1회</strong> 시전할 수 있습니다.'},
  {name_ko:'생명 도약', name_en:'Life Leap', feat_level:9, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'[1행동] 인접한 살아있는 생물의 공간을 통과하여 반대편으로 이동. 이동 반응 유발 안 함.', desc:'<strong>요구사항:</strong> 살아있는 생물에 인접해야 합니다.<br>살아있는 생물이 차지하는 공간을 순식간에 통과하여, 반대편에 자연스럽게 나타나며 화려한 빛을 보여줍니다. 현재 위치에서 같은 살아있는 생물에 인접하지만 반대편이나 모서리에 있는 다른 위치로 이동합니다.<br>생물의 생명력을 통과하여 선택한 위치에 나타납니다; 이것은 이동 기반 반응을 유발하지 않습니다. 목적지를 볼 수 있어야 하며, 이동 속도가 허용하는 것보다 멀리 이동할 수 없습니다.'}
,
  {name_ko:'생동감 있는 전도체', name_en:'Vivacious Conduit', feat_level:9, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'첫 번째 세계와의 연결이 성장하여, 생명 에너지가 빠르게 흘러들어옵니다. 10분간 쉬면, 건강 수정치 × 레벨 절반만큼의 히트 포인트를 회복합니', desc:'첫 번째 세계와의 연결이 성장하여, 생명 에너지가 빠르게 흘러들어옵니다. <strong>10분간 쉬면</strong>, 건강 수정치 × 레벨 절반만큼의 <strong>히트 포인트를 회복</strong>합니다. 이것은 활력(vitality) 치유 효과이며, 상처 치료(Treat Wounds)에서 받는 치유와 누적됩니다.'}
,
  {name_ko:'노움 무기 전문가', name_en:'Gnome Weapon Expertise', feat_level:13, prerequisites:'노움, 노움 무기 친숙', traits:['노움'], category:'ancestry', summary:'노움 무기에 대한 숙련도가 전문가로 증가합니다.', desc:'노움 무기에 대한 숙련도가 전문가로 증가합니다.'}
,
  {name_ko:'본능적 은폐', name_en:'Instinctive Obfuscation', feat_level:13, prerequisites:'노움, 원천 노움', traits:['노움'], category:'ancestry', summary:'[반응] 공격 시 환영 분신 생성. DC 10 단순 판정 실패 시 분신이 대신 맞음.', desc:'<strong>전제조건:</strong> 노움 유산이나 혈통 재주에서 얻은 비전 또는 비학 선천 주문 최소 1개<br><br>내면의 마법이 위협에 대한 자연적 반응으로 나타납니다. 당신의 공간에 잠시 환영의 분신이 나타납니다. 유발 공격자는 <strong>DC 10 단순 판정</strong>을 굴려야 합니다; 성공하면 공격이 정상적으로 당신을 대상으로 하고, 실패하면 공격이 분신을 대상으로 하여 파괴합니다. 이 행동의 전통은 노움 혈통 옵션의 전통과 일치합니다.'}
,
  {name_ko:'고향 귀환', name_en:'Homeward Bound', feat_level:17, prerequisites:'노움', traits:['노움'], category:'ancestry', summary:'빈도: 주 2회', desc:'<strong>빈도:</strong> 주 2회<br>당신과 첫 번째 세계 사이의 연결이 대부분의 노움보다 몸속에서 강하게 울려, 우주와 첫 번째 세계 사이의 문턱을 넘을 수 있습니다. <em>차원간 순간이동(interplanar teleport)</em>을 <strong>원시 선천 주문으로 주 2회</strong> 시전할 수 있습니다. 이것은 첫 번째 세계와 우주 사이를 왕래하는 데만 사용할 수 있습니다. 몸의 자연적 공명으로 주문의 초점(locus) 역할을 할 수 있으며, 특별히 조율된 차원 열쇠가 필요하지 않습니다.'}
,
  // ── 고블린 Goblin ──
  {name_ko:'화염 뿜기', name_en:'Burn It!', feat_level:1, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'화염 피해에 +1 상태 보너스. 불붙은 대상에 명중 시 지속 화염 피해.', desc:'불이 당신을 매혹합니다. 화염 피해를 입히는 주문과 연금술 아이템이 <strong>주문 랭크의 절반 또는 아이템 레벨의 4분의 1만큼 상태 보너스</strong>(최소 +1)를 피해에 얻습니다. 지속 화염 피해에도 <strong>+1 상태 보너스</strong>를 얻습니다.'}
,
  {name_ko:'고블린 노래', name_en:'Goblin Song', feat_level:1, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'[1행동] 공연 판정으로 적의 지각/의지에 -1 상태 페널티.', desc:'짜증나는 노래를 부르며 적의 주의를 분산시킵니다. 30피트 내 적 1명의 의지 DC에 대해 <strong>공연 판정</strong>을 시도합니다. 전문가이면 대상 2명, 대가 4명, 전설 8명.<br><strong>대성공:</strong> 1분간 지각 판정과 의지 내성에 -1 상태 페널티.<br>'}
,
  {name_ko:'고블린 쓰레기 뒤지기', name_en:'Goblin Scuttle', feat_level:1, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'[반응] 아군이 인접한 칸으로 이동하면 비틀거림(Step) 가능.', desc:'<strong>유발 조건:</strong> 아군이 인접한 곳에서 이동 행동을 종료합니다.<br>아군의 이동을 이용하여 위치를 조정합니다. <strong>한 걸음(Step)</strong>.'}
,
  {name_ko:'폐품 수선공', name_en:'Junk Tinker', feat_level:1, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'쓰레기에서 쓸만한 도구를 제작. 간이 무기/장비 제작 가능.', desc:'폐품으로 <strong>0레벨 아이템</strong>(무기/갑옷 포함)을 제작 가능. 가격 1/4이지만 허접(shoddy). 자신이 만든 허접 아이템 사용 시 페널티 없음. 일반 제작 시에도 폐품을 포함시켜 1일 추가 작업한 것과 같은 할인.'}
,
  {name_ko:'거친 놀이', name_en:'Rough Rider', feat_level:1, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'고블린독(Goblin Dog)이나 울프 탈것에 +1 상황 보너스.', desc:'전제조건 없이 <strong>기마(Ride) 재주</strong>를 얻습니다. 고블린 개나 늑대 탈것에 동물 명령 시 <strong>+1 상황 보너스</strong>. 늑대를 동물 동료로 얻으면 탑승 특수 능력을 얻습니다.'}
,
  {name_ko:'매우 은밀한', name_en:'Very Sneaky', feat_level:1, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'잠행 시 5피트 더 멀리 이동. 엄폐/은폐 없이도 관측 안 됨.', desc:'잠행 시 <strong>5피트 더 멀리</strong>(이동 속도까지) 이동 가능. 잠행 행동을 계속 사용하고 은신 판정에 성공하는 한, 잠행 종료 시 엄폐/은폐 없어도 관측되지 않음(단 턴 종료 시 엄폐/은폐 필요).'}
,
  {name_ko:'고블린 무기 친숙', name_en:'Goblin Weapon Familiarity', feat_level:1, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'고블린 전통 무기에 숙련됩니다.', desc:'고블린 특성의 모든 비일반 무기에 접근합니다. 고블린 특성 무기에 친숙 — <strong>군용→단순, 고급→군용</strong>으로 취급. 5레벨에서 치명 특성 효과 적용.'}
,
  {name_ko:'도시 수집가', name_en:'City Scavenger', feat_level:1, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'생존(Subsist) 판정에 +1 상황 보너스를 얻고, 정착지에서 사회나 생존으로 생존할 수 있습니다. 도시에서 생존 시, 추가 휴식일 없이 사', desc:'생존(Subsist) 판정에 <strong>+1 상황 보너스</strong>를 얻고, 정착지에서 사회나 생존으로 생존할 수 있습니다. 도시에서 생존 시, 추가 휴식일 없이 사회나 생존으로 수입 벌기도 가능하며 +1 보너스를 얻습니다.<br><strong>특수:</strong> 철위장 고블린 유산이면 보너스가 +2.'}
,
  {name_ko:'고블린 지식', name_en:'Goblin Lore', feat_level:1, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'자연학과 은신에 숙련됩니다. 이미 숙련이면 대신 다른 기술에 숙련. 고블린 지식에 대한 추가 지식 재주를 얻습니다.', desc:'<strong>자연학과 은신에 숙련</strong>됩니다. 이미 숙련이면 대신 다른 기술에 숙련. <strong>고블린 지식</strong>에 대한 추가 지식 재주를 얻습니다.'}
,
  {name_ko:'무릎치기', name_en:'Kneecap', feat_level:5, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'근접 타격을 하되 피해를 주지 않습니다. 명중 시 대상의 이동 속도에 -10피트 상태 페널티(치명타 시 -15피트)를 1라운드간 부여합니다. 지', desc:'근접 타격을 하되 피해를 주지 않습니다. 명중 시 대상의 이동 속도에 <strong>-10피트 상태 페널티</strong>(치명타 시 -15피트)를 1라운드간 부여합니다. 지상 이동 속도가 있고 다리에 의존하는 대상에게만 적용. 최소 5피트.'}
,
  {name_ko:'큰소리 가수', name_en:'Loud Singer', feat_level:5, prerequisites:'고블린, 고블린 노래', traits:['고블린'], category:'ancestry', summary:'전제조건: 고블린 노래. 고블린 노래 범위가 60피트로 증가하고 추가 적 1명 대상 가능.', desc:'<strong>전제조건:</strong> 고블린 노래. 고블린 노래 범위가 <strong>60피트로 증가</strong>하고 <strong>추가 적 1명</strong> 대상 가능.'}
,
  {name_ko:'파괴자', name_en:'Vandal', feat_level:5, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'도둑질에 숙련됩니다. 함정이나 무인 물체에 타격 명중 시 처음 5점 경도 무시.', desc:'<strong>도둑질에 숙련</strong>됩니다. 함정이나 무인 물체에 타격 명중 시 처음 <strong>5점 경도 무시</strong>.'}
,
  {name_ko:'나무 줄기 달리기', name_en:'Tree Climber', feat_level:9, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'등반 속도 10피트 획득. 등반 중 방어불가 상태 무시.', desc:'나무꼭대기에서 삶의 상당 부분을 보내며 빠르고 안전하게 오르는 전문가가 되었습니다. <strong>등반 속도 10피트</strong>를 얻습니다.'}
,
  {name_ko:'동굴 등반가', name_en:'Cave Climber', feat_level:9, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'등반 속도 10피트 획득.', desc:'수년간 동굴을 기어오른 덕분에 어디든 쉽게 오를 수 있습니다. <strong>등반 속도가 10피트</strong> 증가합니다.'},
  {name_ko:'매달리기', name_en:'Cling', feat_level:9, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'[1행동] 타격 성공 후 적에 매달려 이동 시 함께 이동.', desc:'<strong>요구사항:</strong> 마지막 행동이 성공한 타격이었고 빈 손이 있어야 합니다.<br>적에 매달려 괴롭힙니다. 대상 이동 시 함께 이동 가능. 다음 턴 시작, 함께 이동하지 않기로 선택, 또는 대상이 탈출하면 해제. 탈출은 당신의 곡예 DC에 대해 시도.<br><strong>특수:</strong> 턱이나 유사한 비무장 공격으로 이전 타격을 했다면 빈 손 없이 사용 가능.'}
,
  {name_ko:'고블린 무기 광란', name_en:'Goblin Weapon Frenzy', feat_level:13, prerequisites:'고블린, 고블린 무기 친숙', traits:['고블린'], category:'ancestry', summary:'고블린 무기 숙련도가 전문가로 증가.', desc:'고블린 무기에 대한 숙련도가 전문가로 증가합니다.'}
,
  {name_ko:'매우 매우 은밀한', name_en:'Very, Very Sneaky', feat_level:13, prerequisites:'고블린, 매우 은밀한', traits:['고블린'], category:'ancestry', summary:'전제조건: 매우 은밀한. 잠행 시 이동 속도까지 이동 가능. 숨기나 잠행에 엄폐/은폐가 더 이상 불필요.', desc:'<strong>전제조건:</strong> 매우 은밀한. 잠행 시 <strong>이동 속도까지 이동</strong> 가능. 숨기나 잠행에 엄폐/은폐가 <strong>더 이상 불필요</strong>.'}
,
  {name_ko:'무모한 포기', name_en:'Reckless Abandon', feat_level:17, prerequisites:'고블린', traits:['고블린'], category:'ancestry', summary:'[자유 행동] 하루 1회. 이 턴 내성 실패/대실패→성공, 최소 피해만 받음.', desc:'<strong>빈도:</strong> 하루 1회<br>남은 턴 동안, 해로운 효과에 대한 내성 굴림에서 <strong>실패/대실패 시 성공</strong>이 됩니다. 또한 이 턴에 적이나 위험으로부터 <strong>최소 가능 피해</strong>를 받습니다. 이 혜택은 이 턴 동안 전적으로 발생한 해로운 효과에만 적용됩니다. 지속 피해와 이전 상태는 정상 진행되며, 턴 종료 시 전체 결과에 노출됩니다.'}
,
  // ── 하플링 Halfling ──
  {name_ko:'하플링의 행운', name_en:'Halfling Luck', feat_level:1, prerequisites:'하플링', traits:['하플링','행운'], category:'ancestry', summary:'[반응] 기술 판정이나 내성에서 실패 시 1회 재굴림. 1일 1회.', desc:'<strong>빈도:</strong> 하루 1회<br>행복한 천성으로 불운이 당신을 피하는 것 같으며, 어느 정도 사실일 수 있습니다. 유발 판정을 <strong>다시 굴릴 수 있습니다</strong>. 더 나빠도 새 결과를 사용해야 합니다.'}
,
  {name_ko:'하플링 지식', name_en:'Halfling Lore', feat_level:1, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'곡예와 은신에 숙련됨. 하플링 관련 지식(Lore)에 숙련됨.', desc:'<strong>곡예와 은신에 숙련</strong>됩니다. 이미 숙련이면 대신 다른 기술. <strong>하플링 지식</strong>에 대한 추가 지식 재주를 얻습니다.'}
,
  {name_ko:'하플링 무기 친숙', name_en:'Halfling Weapon Familiarity', feat_level:1, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'슬링, 쇼트소드, 핸드 크로스보우에 숙련됨.', desc:'하플링 특성의 모든 비일반 무기에 접근. 하플링 특성 무기와 투석구(sling), 쇼트소드에 친숙 — <strong>군용→단순, 고급→군용</strong>. 5레벨에서 치명 특성 효과 적용.'}
,
  {name_ko:'확고한 다리', name_en:'Sure Feet', feat_level:1, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'좁은 표면/험한 지형에서 균형 잡기/곡예에 대성공 확률 증가.', desc:'균형 잡기든 등반이든, 발이 쉽게 지지점을 찾습니다. 균형 잡기(Balance) 곡예 판정이나 등반(Climb) 운동 판정에서 <strong>성공을 굴리면 대성공</strong>. 균형 잡기나 등반 시도 시 <strong>무방비 상태가 되지 않습니다</strong>.'}
,
  {name_ko:'거체 학살자', name_en:'Titan Slinger', feat_level:1, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'투석구로 대형 이상 생물 명중 시 피해 주사위 한 단계 증가.', desc:'투석구로 거대한 생물을 쓰러뜨리는 법을 배웠습니다. 투석구 그룹 무기로 <strong>대형 이상 생물을 명중</strong>하면, 무기 피해 주사위를 <strong>한 단계 증가</strong>시킵니다 (d4→d6, d6→d8, d8→d10, d10→d12).'}
,
  {name_ko:'주의 분산 그림자', name_en:'Distracting Shadows', feat_level:1, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'더 큰 종족을 주의 분산으로 사용하여 주목을 피하는 법을 배웠습니다. 자신보다 최소 한 크기 이상 큰 생물(보통 중형 이상)을 숨기(Hide)와', desc:'더 큰 종족을 주의 분산으로 사용하여 주목을 피하는 법을 배웠습니다. 자신보다 최소 한 크기 이상 큰 생물(보통 중형 이상)을 숨기(Hide)와 잠행(Sneak) 행동의 <strong>엄폐로 사용</strong>할 수 있습니다. 다만 엄폐(Take Cover) 같은 다른 용도로는 사용할 수 없습니다.'}
,
  {name_ko:'시골 수다', name_en:'Folksy Patter', feat_level:1, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'암호화된 메시지를 소박한 관용구로 위장하는 데 능숙합니다. 속어, 농담, 하플링어 차용어 등을 사용하여 세 개의 기본 단어로 구성된 간단한 메시', desc:'암호화된 메시지를 소박한 관용구로 위장하는 데 능숙합니다. 속어, 농담, 하플링어 차용어 등을 사용하여 세 개의 기본 단어로 구성된 간단한 메시지를 전달합니다(예: "위험 암살자 도주" 또는 "만남 달뜸"). 의도된 청자는 <strong>DC 20 지각 판정</strong>으로 메시지를 파악합니다. 청자가 하플링이거나 시골 수다를 가지면 DC가 5 감소하며, 둘 다라면 10 감소합니다. 도청자도 당신의 기만 DC에 대해 지각 판정을 시도할 수 있습니다.'}
,
  {name_ko:'초원 기수', name_en:'Prairie Rider', feat_level:1, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'씨족의 덥수룩한 조랑말과 기마견을 타고 자랐습니다. 자연학에 숙련됩니다(이미 숙련이면 다른 기술). 전통적 하플링 탈것(조랑말이나 기마견)에 동', desc:'씨족의 덥수룩한 조랑말과 기마견을 타고 자랐습니다. <strong>자연학에 숙련</strong>됩니다(이미 숙련이면 다른 기술). 전통적 하플링 탈것(조랑말이나 기마견)에 동물 명령 시 <strong>+1 상황 보너스</strong>.'}
,
  {name_ko:'속박 벗은 하플링', name_en:'Unfettered Halfling', feat_level:1, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'강제 복역이나 감옥에 갇혔다가 탈출한 후, 다시는 잡히지 않도록 훈련했습니다. 탈출 판정이나 붙잡힘(grabbed)/부동(immobilized)', desc:'강제 복역이나 감옥에 갇혔다가 탈출한 후, 다시는 잡히지 않도록 훈련했습니다. 탈출 판정이나 붙잡힘(grabbed)/부동(immobilized)/속박(restrained) 상태를 부과하는 효과에 대한 내성에서 <strong>성공을 굴리면 대성공</strong>. 생물이 당신을 조이기(Grapple)에 <strong>실패하면 대실패</strong>가 됩니다.'}
,
  {name_ko:'경계하는 하플링', name_en:'Watchful Halfling', feat_level:1, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'주변 사람들에 주의를 기울여, 성격에서 벗어나는 행동을 더 쉽게 알아챕니다. 마법에 걸리거나 빙의된 캐릭터를 알아내기 위해 의도 파악(Sense', desc:'주변 사람들에 주의를 기울여, 성격에서 벗어나는 행동을 더 쉽게 알아챕니다. 마법에 걸리거나 빙의된 캐릭터를 알아내기 위해 의도 파악(Sense Motive)를 사용할 때 지각 판정에 <strong>+2 상황 보너스</strong>. 적극적으로 의도 파악를 사용하지 않더라도 GM이 자동으로 비밀 판정을 굴려줍니다(일반 보너스 없이).<br>추가로, 마법이나 빙의를 극복하기 위한 다른 생물의 내성 굴림이나 판정에 보너스를 주는 <strong>도움(Aid) 기본 행동</strong>을 사용할 수 있습니다. 도움 규칙대로, 턴에 행동을 사용하여 생물에게 효과에 맞서 싸우도록 격려하는 준비가 필요합니다.'}
,
  {name_ko:'문화 적응', name_en:'Cultural Adaptability', feat_level:5, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'다양한 문화에 적응하는 능력.', desc:'모험 중 주변의 지배적 혈통의 문화에 적응하는 능력을 연마했습니다. <strong>양자 혈통(Adopted Ancestry)</strong> 일반 재주를 얻고, 선택한 혈통에서 <strong>1레벨 혈통 재주 1개</strong>도 추가로 얻습니다.'}
,
  {name_ko:'경쾌한 걸음', name_en:'Step Lively', feat_level:5, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'[반응] 대형 이상 적이 인접 이동 종료 시 한 걸음(Step).', desc:'<strong>유발 조건:</strong> 대형 이상 적이 인접한 곳에서 이동 행동을 종료합니다.<br>더 큰 생물의 둔한 발걸음을 피하는 전문가입니다. 해당 적에 인접한 다른 칸으로 <strong>한 걸음(Step)</strong>.'}
,
  {name_ko:'신의 행운', name_en:'Guiding Luck', feat_level:9, prerequisites:'하플링, 하플링의 행운', traits:['하플링'], category:'ancestry', summary:'하플링의 행운을 명중 굴림에도 사용 가능. 또는 아군에게 행운 부여.', desc:'<strong>전제조건:</strong> 하플링 행운(Halfling Luck)<br>행운이 올바른 방향을 보고 정확하게 타격하도록 안내합니다. 하플링 행운을 <strong>하루 2회</strong> 사용할 수 있습니다: 일반 유발 조건으로 1회, 그리고 지각 판정이나 명중 굴림에 실패할 때 1회.'}
,
  {name_ko:'발밑에서 춤추기', name_en:'Dance Underfoot', feat_level:9, prerequisites:'하플링, 경쾌한 걸음', traits:['하플링'], category:'ancestry', summary:'대형 이상 적의 칸에서 덤블 통과 종료 가능. 경쾌한 걸음으로 적의 칸에 진입 가능.', desc:'<strong>전제조건:</strong> 경쾌한 걸음(Step Lively)<br>전투에서 적의 다리 아래로 빠져나갑니다. 성공적인 <strong>덤블 통과(Tumble Through)</strong> 행동을 대형 이상 적의 칸에서 종료할 수 있습니다. 또한 경쾌한 걸음 재주 사용 시 유발 적의 칸으로 한 걸음을 밟을 수 있습니다. 적이 팔다리가 있거나 이 기동을 위한 충분한 공간을 남겨야 합니다(GM 판단). 예를 들어, 거인이나 드래곤과 공간을 공유할 수 있지만, 우즈와는 불가능합니다.'}
,
  {name_ko:'억누를 수 없는', name_en:'Irrepressible', feat_level:9, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'공포와 감정을 이용하려는 시도를 쉽게 물리칩니다. 감정 효과에 대한 내성에서 성공을 굴리면 대성공. 대담한 하플링 유산이면 감정 효과에 대한 대', desc:'공포와 감정을 이용하려는 시도를 쉽게 물리칩니다. 감정 효과에 대한 내성에서 <strong>성공을 굴리면 대성공</strong>. 대담한 하플링 유산이면 감정 효과에 대한 <strong>대실패를 굴리면 실패</strong>가 됩니다.'}
,
  {name_ko:'방해받지 않는 통과', name_en:'Unhampered Passage', feat_level:9, prerequisites:'하플링', traits:['하플링'], category:'ancestry', summary:'다른 이가 당신을 속박하게 두지 않습니다. 속박 해제(unfettered movement)를 자신에게 원시 선천 주문으로 하루 1회 시전할 수 ', desc:'다른 이가 당신을 속박하게 두지 않습니다. <em>속박 해제(unfettered movement)</em>를 자신에게 <strong>원시 선천 주문으로 하루 1회</strong> 시전할 수 있습니다.'}
,
  {name_ko:'하플링 무기 전문가', name_en:'Halfling Weapon Expertise', feat_level:13, prerequisites:'하플링, 하플링 무기 친숙', traits:['하플링'], category:'ancestry', summary:'하플링 무기 숙련도가 전문가로 증가.', desc:'하플링 무기에 대한 숙련도가 전문가로 증가합니다.'}
,
  {name_ko:'끊임없는 그림자', name_en:'Ceaseless Shadows', feat_level:13, prerequisites:'하플링, 주의 분산 그림자', traits:['하플링'], category:'ancestry', summary:'전제조건: 주의 분산 그림자(Distracting Shadows)', desc:'<strong>전제조건:</strong> 주의 분산 그림자(Distracting Shadows)<br>눈에 띄지 않는 데 탁월하며, 특히 군중 속에서. 숨기나 잠행에 <strong>엄폐나 은폐가 더 이상 필요하지 않습니다</strong>. 생물로부터 하위 엄폐가 있으면 표준 엄폐로 승격되어 엄폐를 할 수 있고, 표준 엄폐가 있으면 <strong>상위 엄폐</strong>로 승격됩니다.'}
,
  {name_ko:'넘어뜨리기 춤', name_en:'Toppling Dance', feat_level:13, prerequisites:'하플링, 발밑에서 춤추기', traits:['하플링'], category:'ancestry', summary:'전제조건: 발밑에서 춤추기(Dance Underfoot)', desc:'<strong>전제조건:</strong> 발밑에서 춤추기(Dance Underfoot)<br>발밑에서 춤추기로 생물의 칸을 공유하는 동안, 근접 무기와 비무장 공격이 <strong>넘어뜨리기(trip) 특성</strong>을 얻지만, 칸을 공유하는 생물에 대해서만. 대형 이상의 엎드린(prone) 생물과 같은 칸에 있을 수 있으며, 아군이 아니어도 됩니다.'}
,
  {name_ko:'그림자 자아', name_en:'Shadow Self', feat_level:17, prerequisites:'하플링, 은신 전설', traits:['하플링'], category:'ancestry', summary:'[1행동] 1분간 투명. 10피트 내 위치에 환영 생성.', desc:'적의 시선에서 미끄러져 나가 다른 곳에 있는 것처럼 보입니다. <strong>1분간 또는 적대적 행동을 할 때까지(먼저 오는 것) 투명</strong>해집니다. 10피트 내의 위치를 선택합니다. 투명이 끝날 때까지, 당신을 찾으려는 누구에게든 그 위치에 숨어있는 것처럼 보입니다. 수색자가 당신이 거기 없다는 명확한 증거를 얻으면 더 이상 거기에 숨어있다고 생각하지 않지만, 실제 위치는 발견하지 못합니다.'}
,
  // ── 인간 Human ──
  {name_ko:'적응력', name_en:'General Training', feat_level:1, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'인간의 다재다능함. 1레벨 일반 재주 1개를 추가로 얻습니다.', desc:'적응력이 다양한 유용한 능력의 숙달로 나타납니다. <strong>1레벨 일반 재주 1개</strong>를 얻습니다. 전제조건을 충족해야 하지만, 캐릭터 생성 중에 선택하면 나중에 전제조건을 결정할 수 있습니다.<br><strong>특수:</strong> 이 재주를 여러 번 선택할 수 있으며, 매번 다른 재주를 선택합니다.'}
,
  {name_ko:'오만한 완고함', name_en:'Haughty Obstinacy', feat_level:1, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'정신 효과에 대한 내성에서 성공은 대성공. 명령/지배에 +2.', desc:'강력한 자존심이 다른 이가 당신에게 명령하기 어렵게 합니다. 행동을 직접 지배하려는 정신 효과에 대한 내성에서 <strong>성공을 굴리면 대성공</strong>. 생물이 위협(Intimidation)으로 강요(Coerce)하려는 판정에서 <strong>실패하면 대실패</strong>가 됩니다(따라서 1주일간 다시 강요할 수 없음).'}
,
  {name_ko:'타고난 야망', name_en:'Natural Ambition', feat_level:1, prerequisites:'인간, 아무 클래스', traits:['인간'], category:'ancestry', summary:'1레벨 클래스 재주 1개 추가 획득. 클래스를 선택해야 합니다.', desc:'<strong>전제조건:</strong> 아무 클래스<br>야망적으로 자라 항상 별을 향해 나아가, 선택한 분야에서 빠르게 진전합니다. <strong>1레벨 클래스 재주 1개</strong>를 얻습니다. 전제조건을 충족해야 하지만, 캐릭터 생성 중 나중에 선택 가능.'}
,
  {name_ko:'타고난 기술', name_en:'Natural Skill', feat_level:1, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'인간의 다재다능함. 숙련된 기술 1개를 추가로 얻습니다.', desc:'독창성으로 다양한 기술을 배울 수 있습니다. 선택한 <strong>기술 2개에 숙련</strong>됩니다.'}
,
  {name_ko:'협력적 본성', name_en:'Cooperative Nature', feat_level:1, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'도움(Aid) 반응 판정에 +4 상황 보너스.', desc:'짧은 인간 수명이 관점을 주고, 어린 나이부터 차이를 제쳐두고 다른 이와 함께 위대함을 달성하는 법을 가르쳤습니다. 도움(Aid) 판정에 <strong>+4 상황 보너스</strong>.'}
,
  {name_ko:'적응된 캔트립', name_en:'Adapted Cantrip', feat_level:1, prerequisites:'인간, 주문시전 클래스 특성', traits:['인간'], category:'ancestry', summary:'다른 전통에서 캔트립 1개를 선택하여 클래스 전통으로 시전.', desc:'<strong>전제조건:</strong> 주문시전 클래스 특성<br>여러 마법 전통을 공부하여 주문시전 양식에 맞게 주문을 변경했습니다. 자신의 것이 아닌 마법 전통에서 <strong>캔트립 1개</strong>를 선택합니다. 이 캔트립을 클래스 전통의 주문으로 시전할 수 있습니다.<br>나중에 이 캔트립을 교환하거나 재훈련하면, 같은 대안 전통이나 다른 전통에서 교체를 선택할 수 있습니다.'}
,
  {name_ko:'다재다능한 유산', name_en:'Versatile Heritage', feat_level:1, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'반엘프 또는 반오크 유산을 선택 가능.', desc:'혼혈의 특성을 발현합니다. 반엘프 또는 반오크 유산을 선택할 수 있습니다.'}
,
  {name_ko:'비전통적 무기', name_en:'Unconventional Weaponry', feat_level:1, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'다른 혈통이나 문화의 특정 무기에 익숙해졌습니다. 혈통 특성(드워프, 고블린, 오크 등)이 있거나 다른 문화에서 일반적인 비일반 단순 또는 군용', desc:'다른 혈통이나 문화의 특정 무기에 익숙해졌습니다. 혈통 특성(드워프, 고블린, 오크 등)이 있거나 다른 문화에서 일반적인 비일반 단순 또는 군용 무기 하나를 선택합니다. 해당 무기에 접근하며, 숙련도 목적으로 <strong>단순 무기로 취급</strong>합니다.<br>모든 군용 무기에 숙련이면, 대신 혈통 특성이 있거나 다른 문화에 일반적인 비일반 고급 무기를 선택할 수 있습니다. 해당 무기에 접근하고 친숙하며, <strong>군용 무기로 취급</strong>합니다.'}
,
  {name_ko:'적응 전문가', name_en:'Adaptive Adept', feat_level:5, prerequisites:'인간, 적응된 캔트립', traits:['인간'], category:'ancestry', summary:'1랭크 주문 1개를 타고난 주문으로 획득.', desc:'<strong>전제조건:</strong> 적응된 캔트립, 3랭크 주문 시전 가능<br>적응된 캔트립과 같은 전통에서 캔트립 또는 <strong>1랭크 주문 1개</strong>를 선택합니다. 적응된 캔트립처럼 주문 옵션에 추가되며, 클래스 전통의 주문으로 시전합니다. 1랭크 주문을 선택하면 고양된 버전에 접근할 수 없습니다.'}
,
  {name_ko:'영리한 임기응변', name_en:'Clever Improviser', feat_level:5, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'역량 밖의 상황을 다루는 법을 배웠습니다. 비숙련 즉흥연기(Untrained Improvisation) 일반 재주를 얻습니다. 추가로, 보통 숙', desc:'역량 밖의 상황을 다루는 법을 배웠습니다. <strong>비숙련 즉흥연기(Untrained Improvisation)</strong> 일반 재주를 얻습니다. 추가로, 보통 숙련이 필요한 기술 행동을 <strong>미숙련 상태로도 시도</strong>할 수 있습니다.'}
,
  {name_ko:'동맹 감지', name_en:'Sense Allies', feat_level:5, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'긴밀한 공동체에서 자라 다른 이의 존재에 강하게 동조되어 있습니다. 60피트 내 인식하고 있는 동의하는 아군이 미탐지일 경우, 대신 숨겨진(hi', desc:'긴밀한 공동체에서 자라 다른 이의 존재에 강하게 동조되어 있습니다. 60피트 내 인식하고 있는 동의하는 아군이 미탐지일 경우, 대신 <strong>숨겨진(hidden)</strong> 상태가 됩니다. 60피트 내 숨겨진 동의하는 아군을 대상으로 하는 단순 판정 DC가 11 대신 <strong>5</strong>입니다.'}
,
  {name_ko:'완강한 인내', name_en:'Stubborn Persistence', feat_level:9, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'의지 내성에서 대실패를 실패로 변환.', desc:'인간은 다른 이가 포기할 만한 가장 혹독한 시련도 견뎌내는 능력으로 유명합니다. 피로(fatigued) 상태가 될 때, <strong>DC 17 단순 판정</strong>을 시도합니다. 성공하면 피로 상태가 되지 않습니다. 피로의 근본 원인(휴식 부족 등)을 해결하지 않으면, GM이 정한 간격으로 실패할 때까지 다시 판정해야 합니다.'}
,
  {name_ko:'협력의 영혼', name_en:'Cooperative Soul', feat_level:9, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'동료와 영혼 깊이의 유대를 발전시켜 더 큰 수준의 협력을 유지합니다. 도움하는 기술에 최소 전문가이면, 기술 판정 도움에서 실패나 대실패를 굴리', desc:'동료와 영혼 깊이의 유대를 발전시켜 더 큰 수준의 협력을 유지합니다. 도움하는 기술에 최소 전문가이면, 기술 판정 도움에서 <strong>실패나 대실패를 굴리면 성공</strong>이 됩니다.'}
,
  {name_ko:'집단 도움', name_en:'Group Aid', feat_level:9, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'팀워크를 강조하며 자라 동료를 돕는 것이 자연스럽습니다. 공격 특성이 없는 기술 판정에서 아군을 도움한 후, 같은 라운드에 같은 목적으로 같은 ', desc:'팀워크를 강조하며 자라 동료를 돕는 것이 자연스럽습니다. 공격 특성이 없는 기술 판정에서 아군을 도움한 후, 같은 라운드에 같은 목적으로 같은 기술 판정을 시도하는 <strong>다른 모든 아군도 도움</strong>할 수 있습니다. 반응 대신 <strong>자유 행동</strong>으로 합니다. 도움를 위한 준비가 다른 아군에게도 여전히 적용되어야 하며, 각 아군은 한 번만 도움할 수 있습니다.'}
,
  {name_ko:'강인한 여행자', name_en:'Hardy Traveler', feat_level:9, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'친구가 곁에 있거나 마음에 희망이 있으면 너무 먼 여정이나 너무 무거운 짐은 없습니다. 최대 및 과적 부피 한계를 1 증가시킵니다. 추가로, 야', desc:'친구가 곁에 있거나 마음에 희망이 있으면 너무 먼 여정이나 너무 무거운 짐은 없습니다. 최대 및 과적 부피 한계를 <strong>1 증가</strong>시킵니다. 추가로, 야외 여행 시 이동 속도에 <strong>+10피트 상황 보너스</strong>.'}
,
  {name_ko:'놀라운 즉흥연기', name_en:'Incredible Improvisation', feat_level:9, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'빈도: 하루 1회', desc:'<strong>빈도:</strong> 하루 1회<br><br>번뜩이는 영감이 경험 부족에도 불구하고 큰 이점을 줍니다. 유발 기술 판정에 <strong>+4 상황 보너스</strong>.'}
,
  {name_ko:'다재다능', name_en:'Multitalented', feat_level:9, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'여러 클래스 사이에 집중을 나누는 법을 쉽게 배웠습니다. 2레벨 멀티클래스 헌신 재주를 얻으며, 현재 아키타입에서 더 많은 재주를 가져야 하는 ', desc:'여러 클래스 사이에 집중을 나누는 법을 쉽게 배웠습니다. <strong>2레벨 멀티클래스 헌신 재주</strong>를 얻으며, 현재 아키타입에서 더 많은 재주를 가져야 하는 일반 제한에도 불구하고 가능합니다.<br>아이우바린(aiuvarin) 다재다능한 유산이 있으면, 재주의 속성 수정치 전제조건을 충족할 필요가 없습니다.'}
,
  {name_ko:'비관습 무기 전문성', name_en:'Unconventional Expertise', feat_level:13, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'비관습 무기 숙련도가 전문가로 증가.', desc:'선택한 비관습 무기의 숙련도가 전문가로 증가합니다.'}
,
  {name_ko:'고급 일반 훈련', name_en:'Advanced General Training', feat_level:13, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'긴 모험 생활에서 적응력이 수많은 유용한 능력을 습득하게 했습니다. 7레벨 이하 일반 재주 1개를 얻습니다. 전제조건을 충족해야 합니다.', desc:'긴 모험 생활에서 적응력이 수많은 유용한 능력을 습득하게 했습니다. <strong>7레벨 이하 일반 재주 1개</strong>를 얻습니다. 전제조건을 충족해야 합니다.<br><strong>특수:</strong> 여러 번 선택 가능, 매번 다른 재주.'}
,
  {name_ko:'회복력', name_en:'Bounce Back', feat_level:13, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'[자유 행동] 빈도: 하루 1회. 빈사 상태를 잃을 때 부상(wounded) 상태 수치를 증가시키지 않습니다.', desc:'<strong>빈도:</strong> 하루 1회<br><br>놀라운 회복력으로 임사 경험에서 회복합니다. 빈사 상태를 잃어서 <strong>부상(wounded) 상태 수치를 증가시키지 않습니다</strong>.'}
,
  {name_ko:'영웅적 존재감', name_en:'Heroic Presence', feat_level:17, prerequisites:'인간', traits:['인간'], category:'ancestry', summary:'[자유 행동] 빈도: 하루 1회. 30피트 내 최대 10명에게 6랭크 열정적 확신 효과 부여 (임시 HP 19, 공포/도주 내성 +2, 10분). 혐오 명령 시 즉시 종료.', desc:'<strong>빈도:</strong> 하루 1회<br>영웅의 피가 혈관을 흐르며, 동료들이 깊이 파고들어 새로운 수준의 결의를 찾도록 영감을 줍니다. 30피트 내 최대 <strong>10명의 동의하는 생물</strong>에게 6랭크 <span class="spell-tip" data-tip="열정적 확신 (Zealous Conviction) 6랭크: 대상이 임시 HP 19를 얻고, 공포(frightened)/도주(fleeing)에 대한 내성에 +2 상태 보너스. 지속 10분. 강화(+1): 임시 HP +3.">열정적 확신(zealous conviction)</span>의 효과를 부여합니다. 대상에게 일반적으로 혐오스럽다고 여길 명령을 내리면 효과가 자동으로 종료됩니다.'}
,
  // ── 레쉬 Leshy ──
  {name_ko:'레쉬의 미신', name_en:'Leshy Superstition', feat_level:1, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'[반응] 주문이나 마법 효과에 대한 내성에 +1 상황 보너스.', desc:'<strong>유발 조건:</strong> 주문이나 마법 효과에 대한 내성 굴림을 시도하지만 아직 굴리지 않았습니다.<br>물체에 깃든 영혼을 알아채며, 어떤 것이 행운을 가져오고 어떤 것이 불운인지 배웁니다. 행운의 물체에 집중하여 유발 효과에 대한 내성에 <strong>+1 상황 보너스</strong>.'}
,
  {name_ko:'뻗어잡는 손길', name_en:'Grasping Reach', feat_level:1, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'덩굴이나 가지를 뻗어 공격합니다.', desc:'덩굴이나 만의 다발을 뻗어 팔을 지지하고 도달을 연장합니다. 양손이 필요하고, 도달이 없으며, 최소 1d6 피해를 주는 근접 무기를 사용할 때, 상호작용 행동으로 일반 양손 잡기와 확장된 양손 잡기 사이를 전환할 수 있습니다. 확장된 잡기로 사용하면 <strong>도달 10피트</strong>를 얻지만, 안정성과 힘이 떨어져 무기 피해 주사위가 <strong>한 단계 감소</strong>합니다.'}
,
  {name_ko:'씨앗 투사', name_en:'Seedpod', feat_level:1, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'씨앗 투척 원거리 비무장 공격 (1d4 B, 사거리 30피트).', desc:'몸이 거의 끝없는 단단한 씨앗 꼬투리를 생산합니다. 사거리 30피트, <strong>1d4 둔기 피해</strong>의 씨앗 꼬투리(seedpod) 원거리 비무장 공격을 얻습니다. 치명타 시 덩굴이 터져 대상의 이동 속도에 다음 턴 시작까지 <strong>-10피트 상황 페널티</strong>. 치명 특성 효과는 추가되지 않습니다.'}
,
  {name_ko:'무해하게 귀여운', name_en:'Harmlessly Cute', feat_level:1, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'뻔뻔한 요청을 보너스 재주로 획득. 기만으로 주도권 굴릴 때 +1 상황 보너스.', desc:'크기와 태도가 다른 이에게 해가 없다고 확신시키기 쉽게 만듭니다. <strong>뻔뻔한 요청(Shameless Request)</strong> 기술 재주를 보너스 재주로 얻습니다. 추가로, 기만으로 주도권 굴릴 때 <strong>+1 상황 보너스</strong>.'}
,
  {name_ko:'레쉬 지식', name_en:'Leshy Lore', feat_level:1, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'자연학과 은신에 숙련. 레쉬 지식(Lore) 획득.', desc:'<strong>자연학과 은신에 숙련</strong>. 이미 숙련이면 다른 기술. <strong>레쉬 지식</strong>에 대한 추가 지식 재주를 얻습니다.'}
,
  {name_ko:'야생의 그림자', name_en:'Shadow of the Wilds', feat_level:1, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'도시 외 환경에서 항상 흔적 감추기 상태로 간주.', desc:'야생 지역에서 당신의 통과를 알아채기 어렵습니다. 도시 환경이 아닌 한, 탐험 모드에서 다른 활동을 선택했어도 항상 <span class="spell-tip" data-tip="흔적 감추기 [집중/탐험/이동] — 절반 이동 속도로 이동하며 흔적을 감춥니다. 추적자는 일반 DC 대신 당신의 생존 DC에 대해 성공해야 합니다."><strong>흔적 감추기(Covering Tracks)</strong></span> 상태로 간주됩니다.'}
,
  {name_ko:'태양 양분', name_en:'Solar Rejuvenation', feat_level:9, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'직사광선에서 10분 휴식 시 HP = 레벨 × CON 회복.', desc:'낮 동안 야외에서 10분 쉬면, 건강 수정치 × 레벨 절반만큼 <strong>HP를 회복</strong>합니다. 상처 치료의 치유와 별도로 추가됩니다. 광합성에 의존하지 않는 레시는 유사하게 적합한 환경이 필요합니다(균류 레시는 어둡고 습한 환경과 썩은 식물 더미).'}
,
  {name_ko:'굴하지 않는', name_en:'Undaunted', feat_level:1, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'식물/자연환경에서 은신 판정에 +2 상황 보너스.', desc:'긴 존재를 통해 많은 도전을 견뎌왔습니다. 감정 효과에 대한 내성에 <strong>+1 상황 보너스</strong>. 감정 효과에 대한 내성에서 <strong>성공을 굴리면 대성공</strong>.'}
,
  {name_ko:'고정 뿌리', name_en:'Anchoring Roots', feat_level:5, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'안정된 균형 재주 획득. 고정(Anchor) 행동 사용 가능.', desc:'발에서 작은 뿌리가 솟아 이동할 때 안정시킵니다. 곡예에 숙련이 아니어도 <strong>안정된 균형(Steady Balance)</strong> 기술 재주를 얻고, 고정(Anchor) 행동을 사용할 수 있습니다.<br><strong>고정</strong>(Anchor) [1행동]<br><strong>요구사항:</strong> 단단한 표면 위에 있어야 합니다.<br>뿌리를 땅에 박거나 지면을 가로질러 보내 비틀거리기 어렵게 합니다. 이동할 때까지 재배치, 밀기, 넘어뜨리기에 대한 인내/반사 DC에 <strong>+2 상황 보너스</strong>(뿌리 레쉬면 +4). 이동시키거나 엎드리게 하는 주문/효과에 대한 내성에도 적용. 강제 이동 시 <strong>절반 거리만</strong> 이동합니다.'}
,
  {name_ko:'레쉬 활공', name_en:'Leshy Glide', feat_level:5, prerequisites:'레쉬, 잎 레쉬 또는 고양이 착지', traits:['레쉬'], category:'ancestry', summary:'[1행동] 활공: 5피트 아래로 최대 25피트 앞으로 이동.', desc:'<strong>전제조건:</strong> 잎 레쉬 유산 또는 고양이 착지(Cat Fall) 기술 재주<br>자신의 잎을 사용하여 하강을 제어합니다. 천천히 땅을 향해 활공하며, <strong>5피트 아래로 최대 25피트 앞으로</strong> 이동합니다. 매 라운드 최소 1행동을 활공에 소비하고 아직 지면에 도달하지 않았다면, 턴 종료 시 공중에 남아 있습니다.'}
,
  {name_ko:'의식 귀환', name_en:'Ritual Reversion', feat_level:5, prerequisites:'레쉬', traits:['레쉬','변신','원시'], category:'ancestry', summary:'[2행동] 식물/균류 표본 형태로 변신 (식물과 하나 효과).', desc:'감각을 줄이지 않고 일시적으로 덜 눈에 띄는 형태로 돌아갈 수 있습니다. 영혼이 합류하기 직전의 몸 외관으로 돌아가, 가장 닮은 식물이나 균류의 일반 표본 형태를 취합니다. 이것은 크기가 소형으로 유지되는 점을 제외하면 <em>식물과 하나(one with plants)</em>의 효과를 가집니다.'}
,
  {name_ko:'동족과 대화', name_en:'Speak with Kindred', feat_level:5, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'식물/균류에게 질문하고 외교 사용 가능. 자신의 종류에 +2 상황 보너스.', desc:'같은 생리를 공유하는 생물과 연결이 있습니다. 식물과 균류에게 질문하고, 답을 받고, 외교 기술을 사용할 수 있습니다. 자신의 종류의 식물이나 균류와의 외교 판정에 <strong>+2 상황 보너스</strong>. 일반적으로 균류 레쉬는 버섯과 균류, 호박 레쉬는 호박/멜론/과실 식물, 잎 레쉬는 낙엽수, 덩굴 레쉬는 덩굴과 등반 식물에 보너스를 얻습니다.'}
,
  {name_ko:'나무껍질과 덩굴', name_en:'Bark and Tendril', feat_level:9, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'방해 식물 + 참나무 강인을 2랭크 원시 선천 주문으로 하루 1회씩 시전.', desc:'원시 마법을 다룹니다. <em>방해 식물(Entangling Flora)</em>과 <em>참나무 강인(Oaken Resilience)</em>을 <strong>2랭크 원시 선천 주문으로 하루 1회씩</strong> 시전 가능.'}
,
  {name_ko:'행운의 기념품', name_en:'Lucky Keepsake', feat_level:9, prerequisites:'레쉬, 레쉬의 미신', traits:['레쉬'], category:'ancestry', summary:'주문과 마법 효과에 대한 내성에 항상 +1 상황 보너스.', desc:'<strong>전제조건:</strong> 레쉬의 미신<br>행운을 부여하는 기념품이 있습니다. 레쉬의 미신을 사용할 때만이 아니라 <strong>항상</strong> 주문과 마법 효과에 대한 내성에 <strong>+1 상황 보너스</strong>. 기념품을 잃으면 새 것을 지정할 때까지(보통 1주일) 보너스를 잃습니다.'}
,
  {name_ko:'가시 씨앗 꼬투리', name_en:'Thorned Seedpod', feat_level:9, prerequisites:'레쉬, 씨앗 투사', traits:['레쉬'], category:'ancestry', summary:'씨앗 꼬투리 대성공 시 1d4 지속 관통 피해.', desc:'<strong>전제조건:</strong> 씨앗 투사(Seedpod)<br>씨앗 꼬투리가 치명적 일격을 가하면 가시 덩굴이 터집니다. 씨앗 꼬투리 타격에 대성공하면, 덩굴이 적을 꿰뚫고 찔러 <strong>1d4 지속 관통 피해</strong>.'}
,
  {name_ko:'녹색 남자의 부름', name_en:'Call of the Green Man', feat_level:13, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'식물 형태를 5랭크 원시 선천 주문으로 하루 1회 시전. 17레벨에서 6랭크.', desc:'근처의 자연 영혼을 불러 몸을 강화합니다. <strong>하루 1회</strong>, <em>식물 형태(Plant Form)</em>를 <strong>5랭크 원시 선천 주문</strong>으로 시전 가능. 17레벨에서 6랭크로 고양 가능.'}
,
  {name_ko:'독의 망토', name_en:'Cloak of Poison', feat_level:13, prerequisites:'레쉬', traits:['레쉬','독'], category:'ancestry', summary:'[2행동] 독의 망토: 하루 1회, 1분간 접촉/근접 공격자에게 3d6 독 피해.', desc:'<strong>빈도:</strong> 하루 1회<br>공격하는 자를 해치는 농축 독의 망토를 분비합니다. <strong>1분간</strong>, 당신을 만지거나 도달 특질 없는 비무장 공격이나 근접 무기로 피해를 주는 생물은 <strong>3d6 독 피해</strong>를 받습니다.'}
,
  {name_ko:'번영과 파멸', name_en:'Flourish and Ruin', feat_level:17, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'생명의 장 + 덩굴 뒤엉킴을 6랭크 원시 선천 주문으로 하루 1회씩 시전.', desc:'영혼의 생명 정수를 불러 아군의 생명을 회복하고 덩굴로 적을 얽어 매립니다. <em>생명의 장(Field of Life)</em>과 <em>덩굴 뒤엉킴(Tangling Creepers)</em>을 <strong>6랭크 원시 선천 주문으로 하루 1회씩</strong> 시전 가능.'}
,
  {name_ko:'재성장', name_en:'Regrowth', feat_level:17, prerequisites:'레쉬', traits:['레쉬'], category:'ancestry', summary:'재생을 7랭크 원시 선천 주문으로 하루 1회 시전.', desc:'생명 정수에 대한 지배력으로 자신이나 아군이 심각한 부상에서 회복하게 합니다. <em>재생(Regenerate)</em>을 <strong>7랭크 원시 선천 주문으로 하루 1회</strong> 시전 가능.'}
,
  // ── 오크 Orc ──
  {name_ko:'오크 지식', name_en:'Orc Lore', feat_level:1, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'운동과 생존에 숙련됨. 오크 관련 지식(Lore)에 숙련됨.', desc:'<strong>운동과 생존에 숙련</strong>됩니다. 이미 숙련이면 다른 기술. <strong>오크 지식</strong>에 대한 추가 지식 재주를 얻습니다.'}
,
  {name_ko:'오크 무기 친숙', name_en:'Orc Weapon Familiarity', feat_level:1, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'팔치온, 그레이트액스에 친숙. 오크 특성 무기는 한 단계 낮은 카테고리로 취급.', desc:'오크 특성의 모든 비일반 무기에 접근. 오크 특성 무기와 팔치온(falchion), 그레이트액스에 친숙 — <strong>군용→단순, 고급→군용</strong>. 5레벨에서 치명 특성 효과 적용.'}
,
  {name_ko:'오크 흉포', name_en:'Orc Ferocity', feat_level:1, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'[반응] HP 0 시 의식불명 대신 HP 1로 유지. 1일 1회.', desc:'<strong>빈도:</strong> 하루 1회<br><br>전투의 사나움이 피를 타고 흐르며, 부상이 아무리 끔찍해도 쓰러지기를 거부합니다. 기절을 피하고 <strong>1 HP에 남으며</strong>, 부상(wounded) 상태가 1 증가합니다.'}
,
  {name_ko:'피투성이 타격', name_en:'Bloody Blows', feat_level:1, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'피가 튀는 공격으로 적을 겁에 질리게 합니다.', desc:'치명적 비무장 공격이 피투성이 자국을 남기거나 심각한 내부 출혈을 유발합니다. 비치명이 아닌 비무장 공격으로 <strong>치명타 시 1d4 지속 출혈 피해</strong>. 주먹의 치명 공격 페널티를 감수하거나 엄니 등의 비치명이 아닌 비무장 공격이 있을 때 적용.'}
,
  {name_ko:'쇠주먹', name_en:'Iron Fists', feat_level:1, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'비무장 주먹 공격 피해가 1d6으로 증가.', desc:'주먹이 전투로 단련되었습니다. 주먹 비무장 공격이 <strong>비치명(nonlethal) 특성을 잃고</strong>, <strong>밀기(shove) 무기 특성</strong>을 얻습니다.'}
,
  {name_ko:'야수 조련사', name_en:'Beast Trainer', feat_level:1, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'사나운 야수를 길들이고 명령하는 인상적인 타고난 능력. 자연학에 숙련되고, 선택으로 반려동물(Pet) 일반 재주 또는 동물 훈련(Train An', desc:'사나운 야수를 길들이고 명령하는 인상적인 타고난 능력. <strong>자연학에 숙련</strong>되고, 선택으로 <strong>반려동물(Pet)</strong> 일반 재주 또는 <strong>동물 훈련(Train Animal)</strong> 기술 재주를 얻습니다.'}
,
  {name_ko:'오크 미신', name_en:'Orc Superstition', feat_level:1, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'유발 조건: 주문이나 마법 효과에 대한 내성 굴림을 시도하지만 아직 굴리지 않았습니다.', desc:'<strong>유발 조건:</strong> 주문이나 마법 효과에 대한 내성 굴림을 시도하지만 아직 굴리지 않았습니다.<br>오크 문화적 미신에서 파생된 기법으로 마법에 대항합니다. 유발 주문이나 마법 효과에 대한 내성에 <strong>+1 상황 보너스</strong>.'}
,
  {name_ko:'거점 표식', name_en:'Hold Mark', feat_level:1, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'공동체의 무용의 표식. 선택한 기술에 숙련 + 해당 전통 주문 내성 +1 상태 보너스.', desc:'공동체의 무용의 표식으로 강화된 흉터나 문신을 지닙니다. 아래 표에서 하나를 선택합니다. 해당 기술에 숙련되고, 해당 전통의 주문에 대한 내성에 <strong>+1 상태 보너스</strong>.<br><strong>타오르는 태양:</strong> 외교, 비전 | <strong>죽음의 머리:</strong> 생존, 원시 | <strong>더럽혀진 시체:</strong> 종교학, 신성 | <strong>빈 손:</strong> 위협, 비학'}
,
  {name_ko:'엄니', name_en:'Tusks', feat_level:1, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'특히 길고 들쭉날쭉한 엄니가 뼈에서 고기를 찢기에 완벽합니다. 1d6 관통 피해의 엄니(tusks) 비무장 공격을 얻습니다. 격투 그룹이며 기교', desc:'특히 길고 들쭉날쭉한 엄니가 뼈에서 고기를 찢기에 완벽합니다. <strong>1d6 관통 피해</strong>의 엄니(tusks) 비무장 공격을 얻습니다. 격투 그룹이며 기교와 비무장 특성.<br><strong>특수:</strong> 1레벨에서만 가질 수 있으며, 이 재주로 재훈련할 수 없습니다. 엄니를 부러뜨리거나 깎거나 뽑는 등 극단적 조치로만 재훈련 가능.'}
,
  {name_ko:'승리의 활력', name_en:'Victorious Vigor', feat_level:5, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'적을 쓰러뜨리면 임시 HP 획득 (레벨 수치).', desc:'전투의 짜릿함으로 힘을 얻습니다. 적을 쓰러뜨리면 레벨만큼의 임시 HP를 얻습니다.'}
,
  {name_ko:'운동적 힘', name_en:'Athletic Might', feat_level:5, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'적대적 지형에서의 생존이 뛰어난 기동성을 부여했습니다. 등반(Climb)이나 수영(Swim) 운동 판정에서 성공을 굴리면 대성공.', desc:'적대적 지형에서의 생존이 뛰어난 기동성을 부여했습니다. 등반(Climb)이나 수영(Swim) 운동 판정에서 <strong>성공을 굴리면 대성공</strong>.'}
,
  {name_ko:'죽음에 맞서기', name_en:'Defy Death', feat_level:5, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'전제조건: 오크의 흉포', desc:'<strong>전제조건:</strong> 오크의 흉포<br>예외적으로 죽이기 어렵습니다. 회복 판정 DC가 <strong>9 + 빈사 수치</strong>(강인함 재주 있으면 8 + 빈사 수치). 추가로, 부활 주문 등으로 1주일 쇠약해지는 효과를 <strong>받지 않습니다</strong>.'}
,
  {name_ko:'흉터 두꺼운 피부', name_en:'Scar-Thick Skin', feat_level:5, prerequisites:'오크', traits:['오크'], category:'ancestry', summary:'영광스럽고 전설적인 흉터가 몸을 덮고 보호합니다. 지속 출혈 피해를 끝내는 단순 판정 DC가 15에서 10으로(적절한 도움 후 10에서 5로) ', desc:'영광스럽고 전설적인 흉터가 몸을 덮고 보호합니다. 지속 출혈 피해를 끝내는 단순 판정 DC가 15에서 <strong>10으로</strong>(적절한 도움 후 10에서 5로) 줄어듭니다.'}
,
  {name_ko:'만연한 미신', name_en:'Pervasive Superstition', feat_level:9, prerequisites:'오크, 오크 미신', traits:['오크'], category:'ancestry', summary:'마법 효과에 대한 내성에 +1 상황 보너스.', desc:'<strong>전제조건:</strong> 오크 미신<br>미신에 몸을 담그고 고대 오크 정신 수련을 연습합니다. <strong>항상</strong> 주문과 마법 효과에 대한 내성에 <strong>+1 상황 보너스</strong>.'}
,
  {name_ko:'불사의 흉포', name_en:'Undying Ferocity', feat_level:9, prerequisites:'오크, 오크 흉포', traits:['오크'], category:'ancestry', summary:'오크 흉포 사용 시 레벨만큼의 임시 HP 획득.', desc:'<strong>전제조건:</strong> 오크 흉포<br>초자연적 활력으로 죽음의 손아귀에 저항합니다. 오크 흉포 사용 시 <strong>레벨만큼의 임시 HP</strong>를 얻습니다.'}
,
  {name_ko:'오크 무기 전문가', name_en:'Orc Weapon Expertise', feat_level:13, prerequisites:'오크, 오크 무기 친숙', traits:['오크'], category:'ancestry', summary:'오크 무기에 대한 숙련도가 전문가로 증가합니다.', desc:'오크 무기에 대한 숙련도가 전문가로 증가합니다.'}
,
  {name_ko:'놀라운 흉포', name_en:'Incredible Ferocity', feat_level:13, prerequisites:'오크, 오크 흉포', traits:['오크'], category:'ancestry', summary:'오크 흉포를 하루 1회 대신 시간당 1회 사용 가능.', desc:'<strong>전제조건:</strong> 오크 흉포<br>임사 경험 후 시간을 가지고 회복하면 흉포를 재건할 수 있습니다. 오크 흉포를 하루 1회 대신 <strong>시간당 1회</strong> 사용 가능.'}
,
  {name_ko:'흉포한 야수들', name_en:'Ferocious Beasts', feat_level:13, prerequisites:'오크, 오크 흉포', traits:['오크'], category:'ancestry', summary:'동물 동료/반려동물/사역마/결합 동물이 오크 흉포를 얻음.', desc:'<strong>전제조건:</strong> 동물 동료, 반려동물, 또는 결합 동물; 오크 흉포<br>고대부터 가장 강한 오크 야수 조련사는 자기 피를 섞은 약을 먹여 동반 야수의 진정한 투쟁 정신을 이끌어냈습니다. 모든 동물 동료, 반려동물, 사역마, 결합 동물이 <strong>오크 흉포 재주</strong>를 얻고, 오크 흉포에만 사용할 수 있는 <strong>반응 1회</strong>를 라운드마다 얻습니다.'}
,
  {name_ko:'주문 탐식자', name_en:'Spell Devourer', feat_level:13, prerequisites:'오크, 오크 미신', traits:['오크'], category:'ancestry', summary:'주문/마법 효과 내성 성공 시 주문 랭크×2만큼 임시 HP 획득.', desc:'<strong>전제조건:</strong> 오크 미신<br>마법에 저항할 뿐 아니라 삼켜버립니다. 주문이나 마법 효과에 대한 내성에 <strong>성공할 때마다</strong>, 주문 랭크의 두 배만큼의 <strong>임시 HP</strong>를 얻습니다(마법 효과가 주문이 아니면 레벨만큼). 이 임시 HP는 다음 턴 종료까지 지속.'}
,
  {name_ko:'난동의 흉포', name_en:'Rampaging Ferocity', feat_level:17, prerequisites:'오크, 오크 흉포', traits:['오크'], category:'ancestry', summary:'[자유 행동] 오크 흉포 발동 시 근접 타격 1회. 적 쓰러뜨리면 흉포 빈도에 불포함.', desc:'<strong>전제조건:</strong> 오크 흉포<br>죽음을 막아내면서도 맹렬하게 공격합니다. <strong>근접 타격 1회</strong>를 합니다. 이 타격이 적의 HP를 0으로 만들면, 이번 오크 흉포 활성화는 빈도에 포함되지 않습니다.'}
,
  // ═══ 원형 재주 — 다중클래스 (Multiclass Archetype Feats) ═══

  // ── 바드 다중클래스 Bard Multiclass ──
  {name_ko:'바드 헌신', name_en:'Bard Dedication', feat_level:2, prerequisites:'매력 +2', traits:['원형','다중클래스','헌신'], category:'archetype', summary:'비전(오컬트) 캔트립을 시전하고, 뮤즈를 선택하며, 주문 공격과 주문 DC에 숙련됩니다.', desc:'바드의 길로 발을 들입니다. 비전(오컬트) 전통의 캔트립 2개를 시전할 수 있습니다. 비학 주문 명중 굴림과 주문 DC에 <strong>숙련</strong>됩니다. 핵심 능력치는 <strong>매력</strong>입니다. 뮤즈를 하나 선택하지만 추가 캔트립은 얻지 못합니다. 비학에 숙련됩니다.<br><strong>특수:</strong> 다른 헌신 재주를 선택하려면 먼저 바드 원형 재주를 2개 이상 가져야 합니다.'}
,
  // ── 클레릭 다중클래스 Cleric Multiclass ──
  {name_ko:'클레릭 헌신', name_en:'Cleric Dedication', feat_level:2, prerequisites:'지혜 +2', traits:['원형','다중클래스','헌신'], category:'archetype', summary:'신성 캔트립을 시전하고, 신격을 선택하며, 종교와 신격 기술에 숙련됩니다.', desc:'클레릭의 길로 발을 들입니다. 신성 전통의 캔트립 2개를 시전할 수 있습니다. 신성 주문 명중 굴림과 주문 DC에 <strong>숙련</strong>됩니다. 핵심 능력치는 <strong>지혜</strong>입니다. 신격을 선택합니다. <strong>종교</strong>와 신격이 부여하는 기술에 숙련됩니다.<br><strong>특수:</strong> 다른 헌신 재주를 선택하려면 먼저 클레릭 원형 재주를 2개 이상 가져야 합니다.'}
,
  // ── 드루이드 다중클래스 Druid Multiclass ──
  {name_ko:'드루이드 헌신', name_en:'Druid Dedication', feat_level:2, prerequisites:'지혜 +2', traits:['원형','다중클래스','헌신'], category:'archetype', summary:'원시 캔트립을 시전하고, 드루이드 교단을 선택하며, 자연에 숙련됩니다.', desc:'드루이드의 길로 발을 들입니다. 원시 전통의 캔트립 2개를 시전할 수 있습니다. 원시 주문 명중 굴림과 주문 DC에 <strong>숙련</strong>됩니다. 핵심 능력치는 <strong>지혜</strong>입니다. 드루이드 교단을 하나 선택합니다. <strong>자연</strong>에 숙련됩니다.<br><strong>특수:</strong> 다른 헌신 재주를 선택하려면 먼저 드루이드 원형 재주를 2개 이상 가져야 합니다.'}
,
  // ── 파이터 다중클래스 Fighter Multiclass ──
  {name_ko:'파이터 헌신', name_en:'Fighter Dedication', feat_level:2, prerequisites:'근력 +2, 민첩 +2', traits:['원형','다중클래스','헌신'], category:'archetype', summary:'군용 무기, 곡예 또는 운동, 파이터 클래스 DC에 숙련됩니다.', desc:'파이터의 길로 발을 들입니다. 모든 <strong>군용 무기</strong>에 숙련됩니다. <strong>곡예</strong> 또는 <strong>운동</strong>(선택) 중 하나에 숙련됩니다. 파이터 클래스 DC에 숙련됩니다.<br><strong>특수:</strong> 다른 헌신 재주를 선택하려면 먼저 파이터 원형 재주를 2개 이상 가져야 합니다.'}
,
  // ── 레인저 다중클래스 Ranger Multiclass ──
  {name_ko:'레인저 헌신', name_en:'Ranger Dedication', feat_level:2, prerequisites:'민첩 +2', traits:['원형','다중클래스','헌신'], category:'archetype', summary:'생존에 숙련되고, 레인저 클래스 DC에 숙련되며, 사냥감 추적을 얻습니다.', desc:'레인저의 길로 발을 들입니다. <strong>생존</strong>에 숙련됩니다. 레인저 클래스 DC에 숙련됩니다. <strong>사냥감 추적(Hunt Prey)</strong> 행동을 얻습니다.<br><strong>특수:</strong> 다른 헌신 재주를 선택하려면 먼저 레인저 원형 재주를 2개 이상 가져야 합니다.'}
,
  // ── 로그 다중클래스 Rogue Multiclass ──
  {name_ko:'로그 헌신', name_en:'Rogue Dedication', feat_level:2, prerequisites:'민첩 +2', traits:['원형','다중클래스','헌신'], category:'archetype', summary:'기술 재주, 기습, 경갑/은신/도둑질/로그 클래스 DC에 숙련됩니다.', desc:'로그의 길로 발을 들입니다. 전제조건을 충족하는 <strong>기술 재주</strong> 하나를 얻습니다. <strong>기습(Surprise Attack)</strong>을 얻습니다. <strong>경갑</strong>에 숙련됩니다. <strong>은신</strong>과 <strong>도둑질</strong>에 숙련됩니다. 로그 클래스 DC에 숙련됩니다.<br><strong>특수:</strong> 다른 헌신 재주를 선택하려면 먼저 로그 원형 재주를 2개 이상 가져야 합니다.'}
,
  // ── 위치 다중클래스 Witch Multiclass ──
  {name_ko:'위치 헌신', name_en:'Witch Dedication', feat_level:2, prerequisites:'지능 +2', traits:['원형','다중클래스','헌신'], category:'archetype', summary:'후원자를 선택하고, 사역마를 얻고, 후원자 전통의 캔트립을 시전합니다.', desc:'위치의 길로 발을 들입니다. <strong>후원자</strong>를 선택하고 <strong>사역마</strong>를 얻습니다. 사역마에게서 후원자의 마법 전통에 속하는 <strong>캔트립 1개</strong>를 배웁니다. 해당 전통의 주문 명중 굴림과 주문 DC에 <strong>숙련</strong>됩니다. 핵심 능력치는 <strong>지능</strong>입니다. 후원자의 전통에 해당하는 기술에 숙련됩니다.<br><strong>특수:</strong> 다른 헌신 재주를 선택하려면 먼저 위치 원형 재주를 2개 이상 가져야 합니다.'}
,
  // ── 위자드 다중클래스 Wizard Multiclass ──
  {name_ko:'위자드 헌신', name_en:'Wizard Dedication', feat_level:2, prerequisites:'지능 +2', traits:['원형','다중클래스','헌신'], category:'archetype', summary:'주문서에 캔트립 4개를 기록하고, 2개를 준비하며, 비전 학파를 선택합니다.', desc:'위자드의 길로 발을 들입니다. 비전(아케인) 캔트립 <strong>4개</strong>가 담긴 주문서를 얻고, 매일 <strong>2개</strong>를 준비하여 시전할 수 있습니다. 비전 주문 명중 굴림과 주문 DC에 <strong>숙련</strong>됩니다. 핵심 능력치는 <strong>지능</strong>입니다. <strong>신비학</strong>에 숙련됩니다. 비전 학파를 하나 선택합니다.<br><strong>특수:</strong> 다른 헌신 재주를 선택하려면 먼저 위자드 원형 재주를 2개 이상 가져야 합니다.'}
,
  {name_ko:'기초 바드 주문시전', name_en:'Basic Bard Spellcasting', feat_level:4, prerequisites:'바드 헌신', traits:['원형'], category:'archetype', summary:'기초 주문시전 혜택을 얻어 비전(오컬트) 주문 슬롯을 확보합니다.', desc:'바드 원형의 기초 주문시전 혜택을 얻습니다. 6레벨에 1순환 주문 슬롯 1개, 8레벨에 2순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'기초 뮤즈의 속삭임', name_en:"Basic Muse's Whispers", feat_level:4, prerequisites:'바드 헌신', traits:['원형'], category:'archetype', summary:'1~2레벨 바드 재주 하나를 얻습니다.', desc:'1레벨 또는 2레벨 <strong>바드 재주</strong> 하나를 얻습니다.'}
,
  {name_ko:'기초 클레릭 주문시전', name_en:'Basic Cleric Spellcasting', feat_level:4, prerequisites:'클레릭 헌신', traits:['원형'], category:'archetype', summary:'기초 주문시전 혜택을 얻어 신성 주문 슬롯을 확보합니다.', desc:'클레릭 원형의 기초 주문시전 혜택을 얻습니다. 6레벨에 1순환 주문 슬롯 1개, 8레벨에 2순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'기초 교의', name_en:'Basic Dogma', feat_level:4, prerequisites:'클레릭 헌신', traits:['원형'], category:'archetype', summary:'1~2레벨 클레릭 재주 하나를 얻습니다.', desc:'1레벨 또는 2레벨 <strong>클레릭 재주</strong> 하나를 얻습니다.'}
,
  {name_ko:'기초 드루이드 주문시전', name_en:'Basic Druid Spellcasting', feat_level:4, prerequisites:'드루이드 헌신', traits:['원형'], category:'archetype', summary:'기초 주문시전 혜택을 얻어 원시 주문 슬롯을 확보합니다.', desc:'드루이드 원형의 기초 주문시전 혜택을 얻습니다. 6레벨에 1순환 주문 슬롯 1개, 8레벨에 2순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'기초 야생', name_en:'Basic Wilding', feat_level:4, prerequisites:'드루이드 헌신', traits:['원형'], category:'archetype', summary:'1~2레벨 드루이드 재주 하나를 얻습니다.', desc:'1레벨 또는 2레벨 <strong>드루이드 재주</strong> 하나를 얻습니다.'}
,
  {name_ko:'교단 주문', name_en:'Order Spell', feat_level:4, prerequisites:'드루이드 헌신', traits:['원형'], category:'archetype', summary:'교단의 초기 집중 주문을 얻습니다.', desc:'선택한 교단의 초기 교단 주문을 얻고, 집중점 1점이 있는 집중점 풀을 얻습니다. 교단 주문은 드루이드 집중 주문이며 원시 전통에 속합니다.'}
,
  {name_ko:'기초 기동', name_en:'Basic Maneuver', feat_level:4, prerequisites:'파이터 헌신', traits:['원형'], category:'archetype', summary:'1~2레벨 파이터 재주 하나를 얻습니다.', desc:'1레벨 또는 2레벨 <strong>파이터 재주</strong> 하나를 얻습니다.'}
,
  {name_ko:'파이터 회복력', name_en:'Fighter Resiliency', feat_level:4, prerequisites:'파이터 헌신', traits:['원형'], category:'archetype', summary:'파이터 원형 재주 하나당 최대 HP +3을 얻습니다.', desc:'파이터 훈련이 체력을 강화합니다. 파이터 원형 재주 하나당 최대 HP가 <strong>3점</strong> 증가합니다.'}
,
  {name_ko:'반격자', name_en:'Reactive Striker', feat_level:4, prerequisites:'파이터 헌신', traits:['원형'], category:'archetype', summary:'반격 타격(Reactive Strike) 반응을 얻습니다.', desc:'<strong>반격 타격(Reactive Strike)</strong> 반응을 얻습니다. 도달 범위 내 생물이 조작/이동 행동을 사용하거나 원거리 공격을 할 때 근접 타격으로 반격할 수 있습니다.'}
,
  {name_ko:'기초 사냥꾼의 속임수', name_en:"Basic Hunter's Trick", feat_level:4, prerequisites:'레인저 헌신', traits:['원형'], category:'archetype', summary:'1~2레벨 레인저 재주 하나를 얻습니다.', desc:'1레벨 또는 2레벨 <strong>레인저 재주</strong> 하나를 얻습니다.'}
,
  {name_ko:'레인저 회복력', name_en:'Ranger Resiliency', feat_level:4, prerequisites:'레인저 헌신', traits:['원형'], category:'archetype', summary:'레인저 원형 재주 하나당 최대 HP +3을 얻습니다.', desc:'레인저 훈련이 체력을 강화합니다. 레인저 원형 재주 하나당 최대 HP가 <strong>3점</strong> 증가합니다.'}
,
  {name_ko:'기초 속임수', name_en:'Basic Trickery', feat_level:4, prerequisites:'로그 헌신', traits:['원형'], category:'archetype', summary:'1~2레벨 로그 재주 하나를 얻습니다.', desc:'1레벨 또는 2레벨 <strong>로그 재주</strong> 하나를 얻습니다.'}
,
  {name_ko:'은밀 공격자', name_en:'Sneak Attacker', feat_level:4, prerequisites:'로그 헌신', traits:['원형'], category:'archetype', summary:'은밀 공격으로 무방비 상태인 적에게 추가 1d4 정밀 피해(6레벨에 1d6).', desc:'<strong>특성:</strong> 이동, 비밀<br>탐지되지 않은 채 이동합니다. 절반 속도로 보폭합니다. 이동 종료 시 GM이 은신 판정을 비밀리에 굴려, 이동 시작 시 숨겨진/미탐지 상태였던 각 생물의 감지 DC와 비교합니다. 이동 중 엄폐/상위 엄폐가 있으면 보너스를 얻습니다.<br><strong>성공:</strong> 이동 중과 이동 후 미탐지(undetected) 상태를 유지합니다. 숨기/잠행/한 걸음 외의 행동을 하면 관측 상태.<br>'}
,
  {name_ko:'기초 위치 주문시전', name_en:'Basic Witch Spellcasting', feat_level:4, prerequisites:'위치 헌신', traits:['원형'], category:'archetype', summary:'기초 주문시전 혜택을 얻어 후원자 전통의 주문 슬롯을 확보합니다.', desc:'위치 원형의 기초 주문시전 혜택을 얻습니다. 6레벨에 1순환 주문 슬롯 1개, 8레벨에 2순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'기초 마법', name_en:'Basic Witchcraft', feat_level:4, prerequisites:'위치 헌신', traits:['원형'], category:'archetype', summary:'1~2레벨 위치 재주 하나를 얻고, 사역마 능력이 3개로 증가합니다.', desc:'1레벨 또는 2레벨 <strong>위치 재주</strong> 하나를 얻습니다. 사역마가 기본 2개 대신 <strong>3개</strong>의 사역마 능력을 얻습니다.'}
,
  {name_ko:'비전 학파 주문', name_en:'Arcane School Spell', feat_level:4, prerequisites:'위자드 헌신', traits:['원형'], category:'archetype', summary:'선택한 학파의 초기 집중 주문을 얻습니다.', desc:'1레벨에 비전 학파를 선택하며, 교과과정 주문과 학파 주문(집중 주문)을 얻습니다. 시전 가능한 각 주문 랭크에 학파 교과에서 <strong>추가 슬롯 1개씩</strong>을 얻고, 그 슬롯에는 교과 주문만 준비 가능합니다.<br>학파에는 소환(Ars Grammatica), 창조(Civic Wizardry), 변환(School of Mentalism), 점술(School of Protean Form), 환영(School of the Boundary) 등 8개 학파가 있으며, 통합 마법 이론(School of Unified Magical Theory)은 특정 학파에 속하지 않는 유연한 접근입니다.'}
,
  {name_ko:'기초 비전학', name_en:'Basic Arcana', feat_level:4, prerequisites:'위자드 헌신', traits:['원형'], category:'archetype', summary:'1~2레벨 위자드 재주 하나를 얻습니다.', desc:'1레벨 또는 2레벨 <strong>위자드 재주</strong> 하나를 얻습니다.'}
,
  {name_ko:'기초 위자드 주문시전', name_en:'Basic Wizard Spellcasting', feat_level:4, prerequisites:'위자드 헌신', traits:['원형'], category:'archetype', summary:'기초 주문시전 혜택을 얻어 비전(아케인) 주문 슬롯을 확보합니다.', desc:'위자드 원형의 기초 주문시전 혜택을 얻습니다. 6레벨에 1순환 주문 슬롯 1개, 8레벨에 2순환 주문 슬롯 1개를 얻습니다. 이 슬롯의 주문은 주문서에서 준비합니다.'}
,
  {name_ko:'고급 뮤즈의 속삭임', name_en:"Advanced Muse's Whispers", feat_level:6, prerequisites:'기초 뮤즈의 속삭임', traits:['원형'], category:'archetype', summary:'자신의 레벨 절반 이하인 바드 재주 하나를 얻습니다.', desc:'자신의 레벨의 절반 이하인 <strong>바드 재주</strong> 하나를 얻습니다.<br><strong>특수:</strong> 이 재주를 여러 번 선택할 수 있으며, 매번 다른 바드 재주를 선택해야 합니다.'}
,
  {name_ko:'대항 공연', name_en:'Counter Perform', feat_level:6, prerequisites:'바드 헌신', traits:['원형'], category:'archetype', summary:'대항 공연(counter performance) 집중 주문을 얻습니다.', desc:'<em>대항 공연(counter performance)</em> 집중 주문을 얻고, 집중점 1점이 있는 집중점 풀을 얻습니다.'}
,
  {name_ko:'고급 교의', name_en:'Advanced Dogma', feat_level:6, prerequisites:'기초 교의', traits:['원형'], category:'archetype', summary:'자신의 레벨 절반 이하인 클레릭 재주 하나를 얻습니다.', desc:'자신의 레벨의 절반 이하인 <strong>클레릭 재주</strong> 하나를 얻습니다.<br><strong>특수:</strong> 이 재주를 여러 번 선택할 수 있으며, 매번 다른 클레릭 재주를 선택해야 합니다.'}
,
  {name_ko:'고급 야생', name_en:'Advanced Wilding', feat_level:6, prerequisites:'기초 야생', traits:['원형'], category:'archetype', summary:'자신의 레벨 절반 이하인 드루이드 재주 하나를 얻습니다.', desc:'자신의 레벨의 절반 이하인 <strong>드루이드 재주</strong> 하나를 얻습니다.<br><strong>특수:</strong> 이 재주를 여러 번 선택할 수 있으며, 매번 다른 드루이드 재주를 선택해야 합니다.'}
,
  {name_ko:'고급 기동', name_en:'Advanced Maneuver', feat_level:6, prerequisites:'기초 기동', traits:['원형'], category:'archetype', summary:'자신의 레벨 절반 이하인 파이터 재주 하나를 얻습니다.', desc:'자신의 레벨의 절반 이하인 <strong>파이터 재주</strong> 하나를 얻습니다.<br><strong>특수:</strong> 이 재주를 여러 번 선택할 수 있으며, 매번 다른 파이터 재주를 선택해야 합니다.'}
,
  {name_ko:'고급 사냥꾼의 속임수', name_en:"Advanced Hunter's Trick", feat_level:6, prerequisites:'기초 사냥꾼의 속임수', traits:['원형'], category:'archetype', summary:'자신의 레벨 절반 이하인 레인저 재주 하나를 얻습니다.', desc:'자신의 레벨의 절반 이하인 <strong>레인저 재주</strong> 하나를 얻습니다.<br><strong>특수:</strong> 이 재주를 여러 번 선택할 수 있으며, 매번 다른 레인저 재주를 선택해야 합니다.'}
,
  {name_ko:'고급 속임수', name_en:'Advanced Trickery', feat_level:6, prerequisites:'기초 속임수', traits:['원형'], category:'archetype', summary:'자신의 레벨 절반 이하인 로그 재주 하나를 얻습니다.', desc:'자신의 레벨의 절반 이하인 <strong>로그 재주</strong> 하나를 얻습니다.<br><strong>특수:</strong> 이 재주를 여러 번 선택할 수 있으며, 매번 다른 로그 재주를 선택해야 합니다.'}
,
  {name_ko:'고급 마법', name_en:'Advanced Witchcraft', feat_level:6, prerequisites:'기초 마법', traits:['원형'], category:'archetype', summary:'자신의 레벨 절반 이하인 위치 재주 하나를 얻습니다.', desc:'자신의 레벨의 절반 이하인 <strong>위치 재주</strong> 하나를 얻습니다.<br><strong>특수:</strong> 이 재주를 여러 번 선택할 수 있으며, 매번 다른 위치 재주를 선택해야 합니다.'}
,
  {name_ko:'고급 비전학', name_en:'Advanced Arcana', feat_level:6, prerequisites:'기초 비전학', traits:['원형'], category:'archetype', summary:'자신의 레벨 절반 이하인 위자드 재주 하나를 얻습니다.', desc:'자신의 레벨의 절반 이하인 <strong>위자드 재주</strong> 하나를 얻습니다.<br><strong>특수:</strong> 이 재주를 여러 번 선택할 수 있으며, 매번 다른 위자드 재주를 선택해야 합니다.'}
,
  {name_ko:'찬가 공연', name_en:'Anthemic Performance', feat_level:8, prerequisites:'바드 헌신', traits:['원형'], category:'archetype', summary:'용감한 찬가(courageous anthem) 합주 캔트립을 얻습니다.', desc:'<em>용감한 찬가(courageous anthem)</em> 합주 캔트립을 얻습니다. 이미 이 캔트립이 있다면 대신 다른 바드 합주 캔트립을 선택합니다.'}
,
  {name_ko:'오컬트 확장', name_en:'Occult Breadth', feat_level:8, prerequisites:'기초 바드 주문시전', traits:['원형'], category:'archetype', summary:'추가 비전(오컬트) 주문 슬롯을 얻습니다.', desc:'기초 바드 주문시전으로 얻은 각 순환의 주문 슬롯이 <strong>1개에서 2개</strong>로 증가합니다.'}
,
  {name_ko:'신성 확장', name_en:'Divine Breadth', feat_level:8, prerequisites:'기초 클레릭 주문시전', traits:['원형'], category:'archetype', summary:'추가 신성 주문 슬롯을 얻습니다.', desc:'기초 클레릭 주문시전으로 얻은 각 순환의 주문 슬롯이 <strong>1개에서 2개</strong>로 증가합니다.'}
,
  {name_ko:'원시 확장', name_en:'Primal Breadth', feat_level:8, prerequisites:'기초 드루이드 주문시전', traits:['원형'], category:'archetype', summary:'추가 원시 주문 슬롯을 얻습니다.', desc:'기초 드루이드 주문시전으로 얻은 각 순환의 주문 슬롯이 <strong>1개에서 2개</strong>로 증가합니다.'}
,
  {name_ko:'기술 달인', name_en:'Skill Mastery', feat_level:8, prerequisites:'로그 헌신', traits:['원형'], category:'archetype', summary:'기술 1개를 전문가로, 다른 1개를 달인으로 올리고 기술 재주를 얻습니다.', desc:'기술은 훈련이나 연습이 필요한 특정 과제를 수행하는 생물의 능력을 나타냅니다. 모든 캐릭터는 배경과 클래스로 인해 특정 기술에 숙련됩니다. 기술은 4장에서 자세히 설명됩니다. 각 기술에는 미숙련이라도 누구나 그 기술을 사용할 수 있는 방법과 기술 훈련이 필요한 용도가 포함됩니다.'}
,
  {name_ko:'후원자의 확장', name_en:"Patron's Breadth", feat_level:8, prerequisites:'기초 위치 주문시전', traits:['원형'], category:'archetype', summary:'추가 주문 슬롯을 얻습니다.', desc:'주문시전 능력은 타고나거나 수년간의 학습으로 얻은 것이 아닙니다. 대신 강력한 존재가 부여한 것으로, 그 존재는 당신에게 힘을 줌으로써 자신의 의제를 세계에서 진행시킬 수 있다는 것을 알고 있습니다. 이 존재는 보통 신비롭고 멀리 있어, 자신의 정체와 동기를 거의 드러내지 않습니다. 말보다는 전조, 꿈, 유사한 미묘한 징후로 뜻을 알립니다.<br>후원자는 사역마를 통해 당신과 소통합니다 — 사역마는 당신을 가르치고, 후원자의 마법의 통로가 되며, 후원자의 모호한 목적을 위해 당신을 감시할 수도 있습니다.<br>1레벨에 후원자를 선택하며, 이것이 주문시전 전통, 기술, 첫 번째 교훈, 고유한 사역마 능력을 결정합니다.'}
,
  {name_ko:'비전 확장', name_en:'Arcane Breadth', feat_level:8, prerequisites:'기초 위자드 주문시전', traits:['원형'], category:'archetype', summary:'추가 비전(아케인) 주문 슬롯을 얻습니다.', desc:'기초 위자드 주문시전으로 얻은 각 순환의 주문 슬롯이 <strong>1개에서 2개</strong>로 증가합니다.'}
,
  {name_ko:'비범한 회피', name_en:'Uncanny Dodge', feat_level:10, prerequisites:'로그 헌신', traits:['원형'], category:'archetype', summary:'이점 부정(deny advantage)을 얻어 숨겨지지 않은 적이 무방비을 유발하지 못합니다.', desc:'<strong>이점 부정(deny advantage)</strong>을 얻습니다. 당신은 숨겨지지 않은(hidden이 아닌) 적에게 무방비(off-guard) 상태가 되지 않습니다.'}
,
  {name_ko:'전문가 바드 주문시전', name_en:'Expert Bard Spellcasting', feat_level:12, prerequisites:'기초 바드 주문시전, 비학 달인', traits:['원형'], category:'archetype', summary:'전문가 주문시전 혜택을 얻어 중급 주문 슬롯을 확보합니다.', desc:'바드 원형의 전문가 주문시전 혜택을 얻습니다. 비전(오컬트) 주문 명중 굴림과 주문 DC가 <strong>전문가</strong>로 증가합니다. 14레벨에 3순환 주문 슬롯 1개, 16레벨에 4순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'전문가 클레릭 주문시전', name_en:'Expert Cleric Spellcasting', feat_level:12, prerequisites:'기초 클레릭 주문시전, 종교 달인', traits:['원형'], category:'archetype', summary:'전문가 주문시전 혜택을 얻어 중급 신성 주문 슬롯을 확보합니다.', desc:'클레릭 원형의 전문가 주문시전 혜택을 얻습니다. 신성 주문 명중 굴림과 주문 DC가 <strong>전문가</strong>로 증가합니다. 14레벨에 3순환 주문 슬롯 1개, 16레벨에 4순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'전문가 드루이드 주문시전', name_en:'Expert Druid Spellcasting', feat_level:12, prerequisites:'기초 드루이드 주문시전, 자연 달인', traits:['원형'], category:'archetype', summary:'전문가 주문시전 혜택을 얻어 중급 원시 주문 슬롯을 확보합니다.', desc:'드루이드 원형의 전문가 주문시전 혜택을 얻습니다. 원시 주문 명중 굴림과 주문 DC가 <strong>전문가</strong>로 증가합니다. 14레벨에 3순환 주문 슬롯 1개, 16레벨에 4순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'다양한 무기 전문가', name_en:'Diverse Weapon Expert', feat_level:12, prerequisites:'파이터 헌신', traits:['원형'], category:'archetype', summary:'단순/군용 무기 숙련도가 전문가로, 고급 무기가 숙련으로 증가합니다.', desc:'전투 훈련이 깊어집니다. 단순 무기와 군용 무기에 대한 숙련도가 <strong>전문가</strong>로, 고급 무기에 대한 숙련도가 <strong>숙련</strong>으로 증가합니다.'}
,
  {name_ko:'달인 감시자', name_en:'Master Spotter', feat_level:12, prerequisites:'레인저 헌신', traits:['원형'], category:'archetype', summary:'감지 숙련도가 달인으로 증가합니다.', desc:'감지(Perception) 숙련도가 <strong>달인</strong>으로 증가합니다.'}
,
  {name_ko:'회피력', name_en:'Evasiveness', feat_level:12, prerequisites:'로그 헌신', traits:['원형'], category:'archetype', summary:'반사 내성 숙련도가 달인으로 증가합니다.', desc:'반사 내성(Reflex saves)의 숙련도가 <strong>달인</strong>으로 증가합니다.'}
,
  {name_ko:'전문가 위치 주문시전', name_en:'Expert Witch Spellcasting', feat_level:12, prerequisites:'기초 위치 주문시전, 후원자 전통 기술 달인', traits:['원형'], category:'archetype', summary:'전문가 주문시전 혜택을 얻어 중급 주문 슬롯을 확보합니다.', desc:'위치 원형의 전문가 주문시전 혜택을 얻습니다. 주문 명중 굴림과 주문 DC가 <strong>전문가</strong>로 증가합니다. 14레벨에 3순환 주문 슬롯 1개, 16레벨에 4순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'전문가 위자드 주문시전', name_en:'Expert Wizard Spellcasting', feat_level:12, prerequisites:'기초 위자드 주문시전, 신비학 달인', traits:['원형'], category:'archetype', summary:'전문가 주문시전 혜택을 얻어 중급 비전 주문 슬롯을 확보합니다.', desc:'위자드 원형의 전문가 주문시전 혜택을 얻습니다. 비전(아케인) 주문 명중 굴림과 주문 DC가 <strong>전문가</strong>로 증가합니다. 14레벨에 3순환 주문 슬롯 1개, 16레벨에 4순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'달인 바드 주문시전', name_en:'Master Bard Spellcasting', feat_level:18, prerequisites:'전문가 바드 주문시전, 비학 전설', traits:['원형'], category:'archetype', summary:'달인 주문시전 혜택을 얻어 고급 주문 슬롯을 확보합니다.', desc:'바드 원형의 달인 주문시전 혜택을 얻습니다. 비전(오컬트) 주문 명중 굴림과 주문 DC가 <strong>달인</strong>으로 증가합니다. 20레벨에 5순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'달인 클레릭 주문시전', name_en:'Master Cleric Spellcasting', feat_level:18, prerequisites:'전문가 클레릭 주문시전, 종교 전설', traits:['원형'], category:'archetype', summary:'달인 주문시전 혜택을 얻어 고급 신성 주문 슬롯을 확보합니다.', desc:'클레릭 원형의 달인 주문시전 혜택을 얻습니다. 신성 주문 명중 굴림과 주문 DC가 <strong>달인</strong>으로 증가합니다. 20레벨에 5순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'달인 드루이드 주문시전', name_en:'Master Druid Spellcasting', feat_level:18, prerequisites:'전문가 드루이드 주문시전, 자연 전설', traits:['원형'], category:'archetype', summary:'달인 주문시전 혜택을 얻어 고급 원시 주문 슬롯을 확보합니다.', desc:'드루이드 원형의 달인 주문시전 혜택을 얻습니다. 원시 주문 명중 굴림과 주문 DC가 <strong>달인</strong>으로 증가합니다. 20레벨에 5순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'달인 위치 주문시전', name_en:'Master Witch Spellcasting', feat_level:18, prerequisites:'전문가 위치 주문시전, 후원자 전통 기술 전설', traits:['원형'], category:'archetype', summary:'달인 주문시전 혜택을 얻어 고급 주문 슬롯을 확보합니다.', desc:'위치 원형의 달인 주문시전 혜택을 얻습니다. 주문 명중 굴림과 주문 DC가 <strong>달인</strong>으로 증가합니다. 20레벨에 5순환 주문 슬롯 1개를 얻습니다.'}
,
  {name_ko:'달인 위자드 주문시전', name_en:'Master Wizard Spellcasting', feat_level:18, prerequisites:'전문가 위자드 주문시전, 신비학 전설', traits:['원형'], category:'archetype', summary:'달인 주문시전 혜택을 얻어 고급 비전 주문 슬롯을 확보합니다.', desc:'위자드 원형의 달인 주문시전 혜택을 얻습니다. 비전(아케인) 주문 명중 굴림과 주문 DC가 <strong>달인</strong>으로 증가합니다. 20레벨에 5순환 주문 슬롯 1개를 얻습니다.'}
,
  // ══════════════════════════════════
  //  체인질링 혈통/재주
  // ══════════════════════════════════
  {name_ko:'소금물의 메이', name_en:'Brine May', feat_level:1, prerequisites:'체인질링', traits:['체인질링'], category:'ancestry', summary:'어머니가 바다 해그. 수영 운동 판정에서 성공 시 대성공. 수영 실패해도 가라앉지 않음.', desc:'어머니가 바다 해그로, 바다 초록이나 파란 눈 하나를 부여합니다. 바다와 해안에서 편안함을 느낍니다. 수영 운동 판정에서 <strong>성공 시 대성공</strong>. 해당 라운드에 수영 행동에 성공하지 않고 턴을 물에서 끝내도 <strong>가라앉지 않습니다</strong>(흐름에 밀릴 수는 있음).'}
,
  {name_ko:'어린 메이', name_en:'Callow May', feat_level:1, prerequisites:'체인질링', traits:['체인질링'], category:'ancestry', summary:'달콤한 해그의 자녀. 매력적인 거짓말쟁이 재주 획득. 기만으로 주도권 굴리면 미행동 적은 무방비.', desc:'가장 흔한 체인질링으로, 달콤한 해그에게 태어났으며 선명한 초록 눈이 그 혈통을 나타냅니다. 어머니의 조종적 성격과 다재다능한 목소리가 속임에 우위를 줍니다. <strong>매력적인 거짓말쟁이(Charming Liar)</strong> 기술 재주를 얻습니다. 기만으로 주도권을 굴리면, 아직 행동하지 않은 적은 당신에게 <strong>무방비(off-guard)</strong>.'}
,
  {name_ko:'꿈의 메이', name_en:'Dream May', feat_level:1, prerequisites:'체인질링', traits:['체인질링'], category:'ancestry', summary:'뻐꾸기 해그의 자녀. 수면/꿈 효과 내성 +2. 밤새 HP 회복 2배, 소진/파멸 2만큼 감소.', desc:'뻐꾸기 해그의 자녀로 보라색이나 검은 눈 하나. 어머니의 수면과 꿈에 대한 힘이 저항력을 부여합니다. 수면 효과와 꿈을 유발/변경하는 효과에 대한 내성에 <strong>+2 상황 보너스</strong>.<br>수면이 더 회복적입니다. 밤새 HP를 회복할 때 건강 수정치 × 레벨이 아닌 <strong>× 레벨의 2배</strong>를 회복하고, 소진(drained)과 파멸(doomed) 상태를 1 대신 <strong>2만큼 줄입니다</strong>.'}
,
  {name_ko:'쇳물의 메이', name_en:'Slag May', feat_level:1, prerequisites:'체인질링', traits:['체인질링'], category:'ancestry', summary:'철 해그의 자녀. 1d6 참격 발톱 비무장 공격 (냉철).', desc:'철 해그에게서 태어나 보라색이나 강철 회색 눈. 자연에서 자라는 냉철(cold iron) 두껍고 튼튼한 발톱이 있습니다. <strong>1d6 참격 피해</strong>의 발톱(claw) 비무장 공격을 얻습니다. 격투 그룹, 비무장/조이기(grapple) 특성, 냉철.'}
,
  {name_ko:'체인질링 지식', name_en:'Changeling Lore', feat_level:1, prerequisites:'체인질링', traits:['체인질링'], category:'ancestry', summary:'기만과 비학에 숙련. 해그 지식 추가.', desc:'<strong>기만과 비학에 숙련</strong>. 이미 숙련이면 다른 기술. <strong>해그 지식</strong>에 대한 추가 지식 재주.'}
,
  {name_ko:'해그 발톱', name_en:'Hag Claws', feat_level:1, prerequisites:'체인질링', traits:['체인질링'], category:'ancestry', summary:'1d4 참격 발톱 비무장 공격 (민첩/기교).', desc:'성인이 되자 손톱이 길고 날카롭게 자랐습니다. <strong>1d4 참격 피해</strong>의 발톱 비무장 공격. 격투 그룹, 민첩(agile)/기교/비무장 특성.<br><strong>특수:</strong> 캐릭터 생애 어느 시점에서든 발톱이 발달할 수 있으므로, 혈통 재주를 얻을 때마다 선택 가능하지만 재훈련으로 나올 수 없습니다.'}
,
  {name_ko:'해그의 시야', name_en:"Hag's Sight", feat_level:1, prerequisites:'체인질링', traits:['체인질링'], category:'ancestry', summary:'암시야(darkvision) 획득.', desc:'성인이 되자 손톱이 길고 날카롭게 자랐습니다. <strong>1d4 참격 피해</strong>의 발톱 비무장 공격. 격투 그룹, 민첩(agile)/기교/비무장 특성.<br><strong>특수:</strong> 캐릭터 생애 어느 시점에서든 발톱이 발달할 수 있으므로, 혈통 재주를 얻을 때마다 선택 가능하지만 재훈련으로 나올 수 없습니다.'}
,
  {name_ko:'부름받은', name_en:'Called', feat_level:5, prerequisites:'체인질링', traits:['체인질링'], category:'ancestry', summary:'정신 효과 의지 내성 +1. 조종 효과 내성 성공 시 대성공.', desc:'부름을 듣고, 저항하면서 정신을 겨냥하는 효과에 대한 방벽을 발달시켰습니다. 정신 효과에 대한 의지 내성에 <strong>+1 상황 보너스</strong>. 조종 상태로 만드는 정신 효과에 대한 내성에서 <strong>성공 시 대성공</strong>.'}
,
  {name_ko:'안개의 아이', name_en:'Mist Child', feat_level:5, prerequisites:'체인질링', traits:['체인질링'], category:'ancestry', summary:'은폐 시 단순 판정 DC 6, 숨겨짐 시 DC 12.', desc:'부자연스러운 미묘함으로 섞여듭니다. 은폐(concealed) 시 단순 판정 DC가 <strong>6</strong>으로, 숨겨진(hidden) 시 <strong>12</strong>로 증가.'}
,
  {name_ko:'저주받은 발톱', name_en:'Accursed Claws', feat_level:9, prerequisites:'체인질링, 발톱 비무장 공격', traits:['체인질링'], category:'ancestry', summary:'발톱 치명타 시 1d4 지속 정신 피해.', desc:'<strong>전제조건:</strong> 발톱 비무장 공격. 발톱이 어머니의 해그 마법을 전달. 발톱 타격 <strong>치명타 시 1d4 지속 정신 피해</strong> 추가.'}
,
  {name_ko:'비학 저항', name_en:'Occult Resistance', feat_level:9, prerequisites:'체인질링, 비학 전문가', traits:['체인질링'], category:'ancestry', summary:'비학 효과 내성 +1 상황 보너스.', desc:'<strong>전제조건:</strong> 비학 전문가. 비학 효과에 대한 모든 내성에 <strong>+1 상황 보너스</strong>.'}
,
  {name_ko:'해그 마법', name_en:'Hag Magic', feat_level:13, prerequisites:'체인질링', traits:['체인질링'], category:'ancestry', summary:'4랭크 비학 선천 주문 하루 1회.', desc:'유산을 통해 해그의 마법을 복제할 수 있습니다. 의식에 사용 가능한 4랭크 이하의 일반 주문 1개를 선택합니다(모든 의식에서: 점술, 매혹, 투청, 투시, 꿈 메시지, 환영 변장). <strong>4랭크 비학 선천 주문으로 하루 1회</strong> 시전.'}
,
  // ══════════════════════════════════
  //  네피림 혈통/재주
  // ══════════════════════════════════
  {name_ko:'천사혈', name_en:'Angelkin', feat_level:1, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'천사의 후손. 사회에 숙련, 천상어, 다국어 재주.', desc:'천사의 후손. <strong>사회에 숙련</strong>(이미 숙련이면 다른 기술). 천상어를 알고, <strong>다국어(Multilingual)</strong> 기술 재주를 얻습니다.'}
,
  {name_ko:'암흑아', name_en:'Grimspawn', feat_level:1, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'아바돈의 데몬 혈통. 불굴(Diehard) 재주 획득.', desc:'아바돈의 영혼을 삼키는 데몬에서 혈통을 추적. 끈질기게 생명력에 매달립니다. <strong>불굴(Diehard)</strong> 일반 재주를 얻습니다.'}
,
  {name_ko:'지옥아', name_en:'Hellspawn', feat_level:1, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'헬의 악마 후손. 기만·법률 지식 숙련. 거짓 간파 재주.', desc:'헬의 교활한 책략가 악마의 후손. 거짓말과 왜곡된 표현을 알아채는 것만큼 구성하는 데도 능숙합니다. <strong>기만과 법률 지식에 숙련</strong>(이미 기만 숙련이면 다른 기술). <strong>거짓 간파(Lie to Me)</strong> 기술 재주.'}
,
  {name_ko:'법의 전달자', name_en:'Lawbringer', feat_level:1, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'아르콘 혈통. 감정 효과 내성 +1. 감정 내성 성공 시 대성공.', desc:'천국의 7층 산의 수호자 아르콘의 혈통. 감정 효과에 대한 내성에 <strong>+1 상황 보너스</strong>. 감정 효과에 대한 내성에서 <strong>성공 시 대성공</strong>.'}
,
  {name_ko:'뮤즈의 손길', name_en:'Musetouched', feat_level:1, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'아자타 혈통. 탈출 +1. 탈출 대실패→실패, 성공→대성공.', desc:'엘리시움의 자유의 화신 아자타의 해방적 힘이 피를 타고 노래합니다. 탈출(Escape)에 <strong>+1 상황 보너스</strong>. 탈출 판정에서 <strong>대실패 시 실패</strong>로, <strong>성공 시 대성공</strong>으로.'}
,
  {name_ko:'나락아', name_en:'Pitborn', feat_level:1, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'외부 균열의 악마 혈통. 운동 숙련 + 운동 기술 재주 1개.', desc:'외부 균열의 악마, 살아있는 죄의 화신의 피가 흐릅니다. <strong>운동에 숙련</strong>(이미 숙련이면 다른 기술). 운동 숙련 전제조건이 있는 1레벨 일반 기술 재주 1개를 추가로 얻습니다.'}
,
  {name_ko:'야수적 발현', name_en:'Bestial Manifestation', feat_level:1, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'차원 생물의 발톱/발굽/턱/꼬리 중 하나 선택.', desc:'몸 일부가 차원 생물의 동물적 영향을 받았습니다. 발톱(1d4 참격, 민첩/기교/비무장/다용도 관통), 발굽(1d6 둔기, 기교/비무장), 턱(1d6 관통, 기교/비무장), 꼬리(1d4 둔기, 민첩/기교/비무장) 중 하나를 선택. <strong>특수:</strong> 1레벨에서만, 재훈련 불가, 유형 변경 불가.'}
,
  {name_ko:'후광', name_en:'Halo', feat_level:1, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'신성 빛 캔트립 효과로 빛을 발함.', desc:'빛과 선함의 후광이 신성 빛(divine light) 캔트립의 효과로 빛을 발합니다. 유지(Sustain)로 억제하거나 재개할 수 있습니다.'}
,
  {name_ko:'네피림 눈', name_en:'Nephilim Eyes', feat_level:1, prerequisites:'네피림, 저광 시야', traits:['네피림'], category:'ancestry', summary:'암시야(darkvision) 획득.', desc:'<strong>전제조건:</strong> 저광 시야. <strong>암시야(darkvision)</strong>를 얻습니다.'}
,
  {name_ko:'네피림 지식', name_en:'Nephilim Lore', feat_level:1, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'외교/위협 + 종교 숙련. 차원 관련 지식 재주.', desc:'<strong>외교 또는 위협</strong>과 <strong>종교에 숙련</strong>. 혈통에 연결된 차원에 대한 <strong>지식 하위 범주</strong>의 추가 지식 재주.'}
,
  {name_ko:'재빠른 발굽', name_en:'Nimble Hooves', feat_level:1, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'이동 속도 +5피트.', desc:'발굽, 발목 날개 등이 이동을 가속합니다. 이동 속도 <strong>+5피트</strong>. (다른 혈통 재주의 속도 증가와 누적되지 않음.)'}
,
  {name_ko:'축복받은 피', name_en:'Blessed Blood', feat_level:5, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'악마/언데드가 피를 마시면 1d6 영혼 피해. 성수 제작 +4.', desc:'흘린 피가 성별화됩니다. 마귀, 언데드, 또는 성스러움에 약한 생물이 당신의 피를 마시거나 턱/송곳니 등으로 관통/참격 피해를 가하면, 신성 특성의 <strong>1d6 영혼 피해</strong>를 받습니다. 자기 피를 재료로 사용하여 성수 제작 판정에 <strong>+4 상황 보너스</strong>.'}
,
  {name_ko:'네피림 저항', name_en:'Nephilim Resistance', feat_level:5, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'산성/냉기/전기/화염/음파 중 하나에 저항 5.', desc:'산성, 냉기, 전기, 화염, 음파 피해 유형 중 하나를 선택합니다. 해당 유형에 <strong>저항 5</strong>. 유형은 보통 혈통과 관련된 차원외 존재와 일치합니다.'}
,
  {name_ko:'많은 차원의 혈손', name_en:'Scion of Many Planes', feat_level:5, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'추가 네피림 혈통 재주 1개 획득.', desc:'혈통의 복잡한 역사가 더 많은 차원 원천에서 힘을 끌어올 수 있게 합니다. 아직 가지고 있지 않은 <strong>네피림 혈통 재주 1개</strong>를 선택하여 얻습니다. 1레벨에서 이미 혈통 재주를 선택했더라도 가능.'}
,
  {name_ko:'신성 날개', name_en:'Divine Wings', feat_level:9, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'[2행동] 하루 1회. 10분간 비행 속도 = 이동 속도.', desc:'<strong>빈도:</strong> 하루 1회. 노력으로 등에서 마법 날개를 불러냅니다. <strong>10분간 이동 속도와 같은 비행 속도</strong>를 얻습니다.'}
,
  {name_ko:'천상체 마법', name_en:'Celestial Magic', feat_level:9, prerequisites:'네피림, 천사혈/법의 전달자/뮤즈의 손길', traits:['네피림'], category:'ancestry', summary:'2랭크 신성 선천 주문 2개 하루 1회.', desc:'<strong>전제조건:</strong> 천사혈, 법의 전달자, 또는 뮤즈의 손길. 맑은 마음, 영원의 빛, 인간형 형태, 폭로의 빛, 생명 공유, 확실한 발놀림 중 <strong>2개를 선택</strong>. 각각 <strong>2랭크 신성 선천 주문으로 하루 1회</strong> 시전.'}
,
  {name_ko:'악마 마법', name_en:'Fiendish Magic', feat_level:9, prerequisites:'네피림, 암흑아/나락아/지옥아', traits:['네피림'], category:'ancestry', summary:'2랭크 신성 선천 주문 2개 하루 1회.', desc:'<strong>전제조건:</strong> 암흑아, 나락아, 또는 지옥아. 변장 마법, 거짓 활력, 투명화, 투시, 분쇄, 편집증 중 <strong>2개를 선택</strong>. 각각 <strong>2랭크 신성 선천 주문으로 하루 1회</strong> 시전.'}
,
  {name_ko:'천상체의 자비', name_en:'Celestial Mercy', feat_level:13, prerequisites:'네피림, 천상체 혈통', traits:['네피림'], category:'ancestry', summary:'고통 정화를 4랭크 신성 선천 주문으로 하루 2회.', desc:'<strong>전제조건:</strong> 천상 혈통. <em>고통 정화(cleanse affliction)</em>를 <strong>4랭크 신성 선천 주문으로 하루 2회</strong> 시전.'}
,
  {name_ko:'옆으로 미끄러지기', name_en:'Slip Sideways', feat_level:13, prerequisites:'네피림, 악마 혈통', traits:['네피림'], category:'ancestry', summary:'순간이동을 5랭크 신성 선천 주문으로 하루 1회.', desc:'<strong>전제조건:</strong> 마귀 혈통. <em>순간이동(translocate)</em>을 <strong>5랭크 신성 선천 주문으로 하루 1회</strong> 시전.'}
,
  {name_ko:'네피림 동족 소환', name_en:'Summon Nephilim Kin', feat_level:13, prerequisites:'네피림, 아무 네피림 혈통 재주', traits:['네피림'], category:'ancestry', summary:'5랭크 소환 주문을 신성 선천 주문으로 하루 1회.', desc:'<strong>전제조건:</strong> 아무 네피림 혈통 재주. <em>천상 소환</em>, <em>마귀 소환</em>, 또는 혈통에 적합한 5랭크 소환 주문을 선택. <strong>5랭크 신성 선천 주문으로 하루 1회</strong> 시전. 소환된 생물은 자신의 혈통과 같은 범주여야 합니다.'}
,
  {name_ko:'신성 선언', name_en:'Divine Declaration', feat_level:17, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'신성 칙령(divine decree)을 7랭크 신성 선천 주문으로 하루 1회 시전.', desc:'<em>신성 칙령(divine decree)</em>을 <strong>7랭크 신성 선천 주문으로 하루 1회</strong> 시전.'}
,
  {name_ko:'영원한 날개', name_en:'Eternal Wings', feat_level:17, prerequisites:'네피림', traits:['네피림'], category:'ancestry', summary:'전제조건: 신성 날개. 날개가 이제 영구적인 몸의 일부. 하루 1회 10분이 아닌 항상 신성 날개의 효과.', desc:'<strong>전제조건:</strong> 신성 날개. 날개가 이제 영구적인 몸의 일부. 하루 1회 10분이 아닌 <strong>항상</strong> 신성 날개의 효과.'}
,
  // ══════════════════════════════════
  //  아이우바린 재주
  // ══════════════════════════════════
  {name_ko:'명예 획득', name_en:'Earned Glory', feat_level:1, prerequisites:'아이우바린', traits:['아이우바린'], category:'ancestry', summary:'공연 숙련. 인상적 공연 재주. 엘프에게 인상 만들기 대실패→실패.', desc:'<strong>공연에 숙련</strong>(이미 숙련이면 다른 기술). <strong>인상적 공연(Impressive Performance)</strong> 재주를 얻습니다. 엘프에게 공연으로 인상 만들기 시도 시 <strong>대실패를 굴리면 실패</strong>가 됩니다.'}
,
  {name_ko:'엘프 선조 회귀', name_en:'Elf Atavism', feat_level:1, prerequisites:'아이우바린', traits:['아이우바린'], category:'ancestry', summary:'엘프 유산 혜택 획득. 1레벨 전용, 재훈련 불가.', desc:'엘프의 피가 특히 강하게 흘러 일반적인 아이우바린보다 훨씬 더 엘프적인 특징을 부여합니다. 엘프 부모나 조상의 <strong>엘프 유산의 혜택</strong>을 얻습니다. 보통 없는 엘프 특징에 의존하거나 개선하는 유산은 선택할 수 없습니다. <strong>특수:</strong> 1레벨에서만, 재훈련 불가.'}
,
  {name_ko:'모방 영감', name_en:'Inspire Imitation', feat_level:5, prerequisites:'아이우바린', traits:['아이우바린'], category:'ancestry', summary:'기술 대성공 시 같은 기술로 도움 반응 자동 자격.', desc:'행동이 동맹에게 위대한 성취를 영감합니다. 기술 판정에 <strong>대성공</strong>할 때마다, 같은 기술로 아군을 돕기 위한 도움(Aid) 반응을 사용할 자격을 자동으로 얻으며, 준비 행동이 필요 없습니다.'}
,
  {name_ko:'초자연적 매력', name_en:'Supernatural Charm', feat_level:5, prerequisites:'아이우바린', traits:['아이우바린'], category:'ancestry', summary:'1랭크 매혹을 비전 선천 주문으로 하루 1회.', desc:'피 속의 엘프 마법이 더 매력적이거나 매혹적으로 만드는 힘으로 나타납니다. <em>1랭크 매혹(charm)</em>을 <strong>비전 선천 주문으로 하루 1회</strong> 시전.'}
,
  // ══════════════════════════════════
  //  드로마르 재주
  // ══════════════════════════════════
  {name_ko:'괴물 평화주의자', name_en:'Monstrous Peacemaker', feat_level:1, prerequisites:'드로마르', traits:['드로마르'], category:'ancestry', summary:'비인간형 지적 생물/소외된 인간형에 외교 +1. 의도 파악에도 동일.', desc:'이중적 인간과 오크 본성이 독특한 관점을 주어, 인간과 세계의 많은 지적 생물 사이의 간격을 메울 수 있습니다. 비인간형 지적 생물과 인간 사회에서 소외된 인간형(GM 재량, 최소 거인, 고블린, 코볼드, 오크 포함)에 대한 외교 판정에 <strong>+1 상황 보너스</strong>. 이 생물들의 의도 파악에도 같은 보너스.'}
,
  {name_ko:'오크 시야', name_en:'Orc Sight', feat_level:1, prerequisites:'드로마르, 저광 시야', traits:['드로마르'], category:'ancestry', summary:'암시야(darkvision) 획득. 1레벨 전용, 재훈련 불가.', desc:'<strong>전제조건:</strong> 저광 시야. 오크의 피가 선조의 예리한 시야를 부여합니다. <strong>암시야(darkvision)</strong>를 얻습니다. <strong>특수:</strong> 1레벨에서만, 재훈련 불가.'}
];
