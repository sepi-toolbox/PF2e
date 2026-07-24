#!/usr/bin/env node
/* build_investigator_methodologies.mjs — 수사관 방법론(Methodology) 「항목 읽는 법」 가이드 = data/derived/investigator_methodologies.json (guide만).
 *   교단·원인·본능 가이드와 동일 패턴. 런타임 INVESTIGATOR_METHODOLOGY_GUIDE(class_features_db)를
 *   loadInvestigatorMethodologies(cs_pf2e_class)가 채움 → 모달 「방법론 항목 읽는 법」.
 *   방법론별 정본 flavor·기술·재주·능력·행동은 subclasses.json(build_subclasses investigator 브랜치)이 소유. 여기선 공통 가이드만.
 *   수사관 = 주문 없음(계략 세우기 + 방법론 기반). 핵심 능력치=지능(고정).
 *   정본 = Player Core 2(PZO12004) 「Investigator — Methodology / Devise a Stratagem」. 실행: cd dev && node tools/derive/build_investigator_methodologies.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const guide = [
  { term: '방법론 (Methodology)', def: '수사관이 되면 하나의 방법론(가장 몰두하는 조사 방식)을 선택합니다. 방법론이 훈련 기술, 무료 재주, 그리고 방법론 고유의 행동·능력을 정합니다.' },
  { term: '방법론 기술', def: '방법론이 훈련시키는 기술입니다(연금술 과학=제작, 경험주의=지능 기반 택1, 법의학=의학, 심문=외교).' },
  { term: '방법론 재주', def: '방법론이 무료로 주는 기술·수사관 재주입니다(연금술 제작, 이상한 점 조사, 법의학적 통찰력+전투 의술, 경계할 이유 없음 등).' },
  { term: '방법론 행동·능력', def: '방법론 고유의 행동이나 특기입니다(신속한 팅크, 신속한 검사, 직설적 질문, 전투 의술 강화 등).' },
  { term: '계략 세우기 (Devise a Stratagem)', def: '모든 수사관이 지니는 핵심 능력입니다(방법론과 무관). 전투에서 대상 하나를 정하고 미리 d20을 굴려두면, 그 대상을 지능 기반 무기로 공격할 때 미리 굴린 값을 명중 굴림에 쓰고 추가 정밀 피해를 줍니다.' },
  { term: '핵심 능력치 (Key Attribute)', def: '수사관의 핵심 능력치는 항상 지능입니다(방법론이 바꾸지 않습니다). 지능은 계략 명중과 수사관 클래스 DC에 쓰입니다.' },
];

fs.writeFileSync(path.join(DEV, 'data/derived/investigator_methodologies.json'), JSON.stringify({ guide, note: '수사관 방법론 가이드(항목 읽는 법). 방법론별 상세는 subclasses.json 소유. 수사관=주문 없음(계략 세우기 기반), 핵심 능력치=지능 고정.' }, null, 1) + '\n');
console.log(`✔ investigator_methodologies.json — guide ${guide.length}항목`);
