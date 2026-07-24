#!/usr/bin/env node
/* build_alchemist_research_fields.mjs — 연금술사 연구 분야(Research Field) 「항목 읽는 법」 가이드 = data/derived/alchemist_research_fields.json (guide만).
 *   바바리안 본능 가이드와 동일 패턴(desc는 이미 FVTT _desc_ko가 충실 → 재작성 없이 가이드+런타임만).
 *   런타임 ALCHEMIST_RESEARCH_FIELD_GUIDE(class_features_db)를 loadAlchemistResearchFields(cs_pf2e_class)가 채움 → 모달 「연구 분야 항목 읽는 법」.
 *   분야별 정본 제조법·연구 혜택·전투용 약병·분야 발견은 subclasses.json(FVTT _desc_ko) 소유. 여기선 공통 가이드만.
 *   연금술사 = 주문 없음(고급 연금술·다용도 약병 기반). 핵심 능력치=지능.
 *   정본 = Player Core 2(PZO12004) 「Alchemist — Research Field / Advanced Alchemy / Versatile Vials / Quick Alchemy」. 실행: cd dev && node tools/derive/build_alchemist_research_fields.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const guide = [
  { term: '연구 분야 (Research Field)', def: '연금술사가 되면 하나의 연구 분야를 선택합니다. 분야가 초기 제조법, 연구 혜택, 전투용 약병 활용법, 그리고 상위 분야 발견의 방향을 정합니다.' },
  { term: '제조법 (분야 발견)', def: '분야가 무료로 주는 초기 공식입니다(폭격기=1레벨 폭탄 2종, 외과의=치유 엘릭서, 혈청학자=변이원, 독물학자=독).' },
  { term: '연구 혜택', def: '분야 고유의 특기입니다(폭격기=스플래시 조정, 외과의=치유 강화, 혈청학자=변이원 부작용 완화, 독물학자=독 조정).' },
  { term: '전투용 약병 (Field Vial)', def: '분야가 더해 주는 다용도 약병 활용법입니다 — 약병을 무기처럼 쓰거나 분야 특유의 효과로 변환합니다.' },
  { term: '다용도 약병 (Versatile Vial)', def: '매일 준비 시 「2 + 지능 수정치」만큼 만드는 약병입니다. 폭탄으로 던지거나, 신속한 연금술로 아는 제조법의 아이템으로 바꾸거나, 분야의 전투용 약병 효과로 씁니다. 탐사 10분마다 2개씩 회복합니다.' },
  { term: '고급 연금술 (Advanced Alchemy)', def: '매일 준비 시 「4 + 지능 수정치」 개의 연금술 소비품(공식서에 있고 레벨 이하)을 비용·제작 판정 없이 만듭니다(주입 특성, 다음 준비까지 유효).' },
  { term: '핵심 능력치 (Key Attribute)', def: '연금술사의 핵심 능력치는 지능입니다. 지능이 다용도 약병·고급 연금술 개수와 연금술사 클래스 DC에 쓰입니다.' },
];

fs.writeFileSync(path.join(DEV, 'data/derived/alchemist_research_fields.json'), JSON.stringify({ guide, note: '연금술사 연구 분야 가이드(항목 읽는 법). 분야별 상세는 subclasses.json(FVTT _desc_ko) 소유. 연금술사=주문 없음, 핵심 능력치=지능.' }, null, 1) + '\n');
console.log(`✔ alchemist_research_fields.json — guide ${guide.length}항목`);
