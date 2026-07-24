#!/usr/bin/env node
/* build_swashbuckler_styles.mjs — 스워시버클러 스타일(Style) 「항목 읽는 법」 가이드 = data/derived/swashbuckler_styles.json (guide만).
 *   교단·원인·본능 가이드와 동일 패턴. 런타임 SWASHBUCKLER_STYLE_GUIDE(class_features_db)를
 *   loadSwashbucklerStyles(cs_pf2e_class)가 채움 → 모달 「스타일 항목 읽는 법」.
 *   스타일별 정본 flavor·기술·재주·허세 행동은 subclasses.json(build_subclasses swashbuckler 브랜치)이 소유. 여기선 공통 가이드만.
 *   스워시버클러 = 주문 없음(판아슈·정밀 타격·마무리 기반). 핵심 능력치=민첩(고정).
 *   정본 = Player Core 2(PZO12004) 「Swashbuckler — Panache / Precise Strike / Swashbuckler's Style」. 실행: cd dev && node tools/derive/build_swashbuckler_styles.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const guide = [
  { term: '스타일 (Style)', def: '스워시버클러가 되면 하나의 스타일을 선택합니다. 스타일이 연관 기술 훈련과, 허세 특성을 얻게 되는 추가 행동(그리고 일부는 무료 재주)을 정합니다.' },
  { term: '스타일 기술', def: '스타일과 연관된 기술에 훈련됩니다(무용수=공연, 허풍=위협, 펜서=기만, 체조=운동, 악당=손속임, 재치=외교).' },
  { term: '허세 (Bravado)', def: '허세 특성이 있는 행동에 성공하면 판아슈를 얻습니다. 「구르며 통과」와 스타일별 추가 행동이 허세 특성을 얻습니다.' },
  { term: '판아슈 (Panache)', def: '대담하고 멋들어진 고양 상태입니다. 판아슈가 있으면 이동 속도에 +5피트 상태 보너스를 받고 강력한 「마무리」 행동을 쓸 수 있습니다. 보통 전투 중에만 얻고 유지하며, 전투가 끝나면 잃습니다.' },
  { term: '정밀 타격 (Precise Strike)', def: '기민 또는 교묘 근접 무기·비무장 공격에 추가 정밀 피해(+2, 마무리의 일부면 2d6)를 줍니다. 5·9·13·17레벨에 증가합니다.' },
  { term: '마무리 (Finisher)', def: '판아슈가 있을 때만 쓸 수 있는 강력한 행동으로, 사용하면 판아슈를 잃습니다(자신 있는 마무리 등).' },
  { term: '핵심 능력치 (Key Attribute)', def: '스워시버클러의 핵심 능력치는 민첩입니다(스타일이 바꾸지 않습니다).' },
];

fs.writeFileSync(path.join(DEV, 'data/derived/swashbuckler_styles.json'), JSON.stringify({ guide, note: '스워시버클러 스타일 가이드(항목 읽는 법). 스타일별 상세는 subclasses.json 소유. 스워시버클러=주문 없음(판아슈 기반), 핵심 능력치=민첩 고정.' }, null, 1) + '\n');
console.log(`✔ swashbuckler_styles.json — guide ${guide.length}항목`);
