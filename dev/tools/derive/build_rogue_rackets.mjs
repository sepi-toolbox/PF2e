#!/usr/bin/env node
/* build_rogue_rackets.mjs — 로그 라켓(Rogue's Racket) 「항목 읽는 법」 가이드 = data/derived/rogue_rackets.json (guide만).
 *   드루이드 교단·레인저 사냥 방식 가이드와 동일 패턴. 런타임 ROGUE_RACKET_GUIDE(class_features_db)를
 *   loadRogueRackets(cs_pf2e_class)가 채움 → 모달 「라켓 항목 읽는 법」.
 *   라켓별 정본 flavor·효과·기술·핵심 능력치는 subclasses_curated → build_subclasses가 소유. 여기선 공통 가이드만.
 *   로그는 주문 없는 클래스(비전 트릭스터=APG 미보유 라켓, 제거됨). 라켓은 은밀 공격과 결합하는 전투·기술 이점.
 *   정본 = Player Core(PZO12001) 「Rogue — Rogue's Racket / Sneak Attack」. 실행: cd dev && node tools/derive/build_rogue_rackets.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const guide = [
  { term: '수법', def: '로그가 되면 하나의 수법(전문 분야, Rogue’s Racket)을 선택합니다. 수법은 고유의 특기 효과, 훈련 기술, 그리고 (일부 수법은) 선택 가능한 핵심 능력치를 정합니다. 로그 특유의 은밀 공격과 결합해 진가를 발휘합니다.' },
  { term: '수법 효과', def: '수법 고유의 특기입니다. 지략가=식별에 성공하면 대상이 무방비, 건달=어떤 무기로든 은밀 공격, 사기꾼=속임수에 성공하면 대상이 무방비, 도둑=기교 무기 피해에 민첩 수정치 적용.' },
  { term: '수법 기술', def: '수법이 훈련시키는 기술입니다(지략가=사회학+택1, 건달=위협+중간 갑옷, 사기꾼=기만·외교, 도둑=손속임).' },
  { term: '핵심 능력치', def: '지략가·건달·사기꾼은 각각 지능·근력·매력을 (기본 민첩 대신) 핵심 능력치로 고를 수 있습니다. 핵심 능력치는 은밀 공격 무기 명중·로그 클래스 DC에 쓰입니다. 도둑은 기교 무기에 민첩을 활용하므로 별도 선택이 없습니다.' },
  { term: '은밀 공격 (Sneak Attack)', def: '무방비 상태의 적을 민첩·기교 근접 무기, 기교 비무장, 또는 원거리 공격으로 때리면 추가 정밀 피해를 줍니다(1d6, 5·11·17레벨에 증가). 수법에 따라 이 조건이 확장되기도 합니다(건달=무기 제한 완화).' },
];

fs.writeFileSync(path.join(DEV, 'data/derived/rogue_rackets.json'), JSON.stringify({ guide, note: '로그 수법 가이드(항목 읽는 법). 수법별 효과는 subclasses.json 소유. 로그=주문 없음(비전 트릭스터=APG 미보유, 제거).' }, null, 1) + '\n');
console.log(`✔ rogue_rackets.json — guide ${guide.length}항목`);
