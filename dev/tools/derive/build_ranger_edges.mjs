#!/usr/bin/env node
/* build_ranger_edges.mjs — 레인저 사냥 방식(Hunter's Edge) 「항목 읽는 법」 가이드 = data/derived/ranger_edges.json (guide만).
 *   드루이드 교단·마녀 후원자 가이드와 동일 패턴. 런타임 RANGER_EDGE_GUIDE(class_features_db)를
 *   loadRangerEdges(cs_pf2e_class)가 채움 → 모달 「사냥 방식 항목 읽는 법」.
 *   방식별 정본 flavor·효과(1레벨/17레벨)는 subclasses_curated → build_subclasses가 소유. 여기선 공통 가이드만.
 *   레인저는 주문 없는 클래스 → 전통/집중 주문/금기 없음. 사냥 방식은 순수 전투·기술 이점.
 *   정본 = Player Core(PZO12001) 「Ranger — Hunter's Edge / Hunt Prey / Masterful Hunter」. 실행: cd dev && node tools/derive/build_ranger_edges.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const guide = [
  { term: '사냥꾼의 예리함', def: '레인저가 되면 하나의 사냥 방식(예리함)을 선택합니다. 사냥 방식은 사냥감을 사냥할 때 얻는 추가 이점을 정하며, 훈련의 초점에 따라 연타·계략·정밀 중 하나입니다. 레인저는 주문을 쓰지 않는 대신, 이 예리함과 사냥 재주로 사냥감을 압도합니다.' },
  { term: '사냥감 사냥 (Hunt Prey)', def: '한 크리처를 사냥감으로 지정하는 1행동입니다(집중). 사냥감을 탐지할 때 지각에 +2, 추적할 때 생존에 +2 상황 보너스를 받고, 두 번째 사거리 증가분 내 원거리 공격 페널티를 무시합니다. 사냥 방식의 이점은 모두 이 사냥감에게 적용됩니다. 지정은 다음 일일 준비 때까지 유지되며, 한 번에 하나만 지정할 수 있습니다.' },
  { term: '사냥 방식 효과', def: '1레벨에 선택한 방식이 주는 효과입니다. 연타=사냥감에 대한 다중 공격 페널티 완화, 계략=사냥감에 대한 방어(AC)와 기만·위협·은신·지식 회상 보너스, 정밀=매 라운드 첫 명중 시 추가 정밀 피해.' },
  { term: '노련한 사냥꾼 (17레벨)', def: '17레벨에 사냥 방식이 강화됩니다(달인 숙련 조건). 연타는 페널티가 더 줄고, 계략은 상황 보너스가 +4·AC +2로 커지며, 정밀은 두 번째 명중에도 정밀 피해가 붙습니다. (정밀 피해는 11·19레벨에도 자동으로 증가합니다.)' },
];

fs.writeFileSync(path.join(DEV, 'data/derived/ranger_edges.json'), JSON.stringify({ guide, note: '레인저 사냥 방식 가이드(항목 읽는 법). 방식별 효과는 subclasses.json 소유. 레인저=주문 없음.' }, null, 1) + '\n');
console.log(`✔ ranger_edges.json — guide ${guide.length}항목`);
