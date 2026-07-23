#!/usr/bin/env node
/* build_bard_muses.mjs — 바드 뮤즈 「항목 읽는 법」 가이드 = data/derived/bard_muses.json (guide만).
 *   소서러 BLOODLINE_GUIDE·오라클 MYSTERY_GUIDE·위저드 WIZARD_SCHOOL_GUIDE와 동일 패턴.
 *   런타임 BARD_MUSE_GUIDE(class_features_db)를 loadBardMuses(cs_pf2e_class)가 채움 → 모달 가이드 노출.
 *   뮤즈별 부여 데이터(뮤즈 피트/주문)는 subclasses.json granted_feats/granted_spells가 소유 → 여기선 가이드만.
 *   실행: cd dev && node tools/derive/build_bard_muses.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const guide = [
  { term: '전통', def: '바드는 항상 오컬트(occult) 전통과 그 주문 목록을 사용하며, 주문을 레퍼토리에 담아 자연 발동(spontaneous)으로 시전합니다.' },
  { term: '뮤즈', def: '당신의 예술적 영감의 원천입니다(아래 선택). 뮤즈는 뮤즈 재주 하나와 뮤즈 주문 하나를 부여하고, 이후 얻을 수 있는 재주의 방향을 정합니다.' },
  { term: '뮤즈 재주', def: '뮤즈가 1레벨에 자동으로 주는 바드 재주입니다(예: 이니그마=바드 지식, 마에스트로=잔향 작곡, 전사=군용 공연).' },
  { term: '뮤즈 주문', def: '뮤즈가 레퍼토리에 추가로 넣어 주는 주문 하나입니다(일반 레퍼토리 선택과 별개로 부여).' },
  { term: '작곡 주문', def: '바드의 집중 주문입니다. 공연에 마법을 실어 시전하며, 「용기의 찬가」 작곡 캔트립과 「대항 공연」을 기본으로 얻습니다. 집중 점수로 시전하고 재집중으로 회복합니다.' },
];

fs.writeFileSync(path.join(DEV, 'data/derived/bard_muses.json'), JSON.stringify({ guide, note: '바드 뮤즈 가이드(항목 읽는 법). 뮤즈별 부여는 subclasses.json 소유.' }, null, 1) + '\n');
console.log(`✔ bard_muses.json — guide ${guide.length}항목`);
