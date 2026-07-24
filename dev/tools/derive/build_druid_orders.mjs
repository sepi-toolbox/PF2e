#!/usr/bin/env node
/* build_druid_orders.mjs — 드루이드 교단 「항목 읽는 법」 가이드 = data/derived/druid_orders.json (guide만).
 *   소서러/오라클/위저드/바드/마녀 가이드와 동일 패턴. 런타임 DRUID_ORDER_GUIDE(class_features_db)를
 *   loadDruidOrders(cs_pf2e_class)가 채움 → 모달 「교단 항목 읽는 법」.
 *   교단별 정본 flavor·부여(기술·집중주문·재주·금기)는 subclasses_curated → build_subclasses가 소유. 여기선 가이드만.
 *   정본 = Player Core(PZO12001) 「Druidic Order」. 실행: cd dev && node tools/derive/build_druid_orders.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const guide = [
  { term: '교단', def: '드루이드가 되면 하나의 교단(결사)에 소속됩니다. 교단은 교단 기술 하나, 교단 주문(집중), 1레벨 보너스 드루이드 재주, 그리고 교단 고유의 금기를 정합니다. 최초 교단에 평생 속하지만, 다른 교단의 재주를 익혀 그 힘을 함께 다룰 수도 있습니다.' },
  { term: '전통', def: '드루이드의 주문 전통은 원시입니다. 준비 시전자로서, 하루 준비로 주문 슬롯에 원시 주문을 담아 시전합니다.' },
  { term: '교단 기술', def: '교단이 지정하는 기술에 훈련됩니다. 이미 그 기술에 훈련되어 있다면, 대신 원하는 다른 기술 하나에 훈련됩니다.' },
  { term: '교단 주문', def: '교단이 부여하는 집중 주문입니다. 1레벨에 자동으로 얻으며, 집중 점수 1점으로 시전하고 재집중으로 회복합니다. 캔트립처럼 자신의 레벨 절반(올림)으로 자동 고양됩니다.' },
  { term: '교단 재주', def: '교단이 지정하는 1레벨 드루이드 재주를 보너스로 얻습니다(동물 동료·레시 패밀리어·폭풍의 자식·길들여지지 않은 형태 등).' },
  { term: '금기', def: '교단 고유의 금기입니다. 모든 드루이드가 공유하는 금기에 이 항목이 더해지며, 이를 어기면 집중 주문과 교단 능력을 잃을 수 있습니다.' },
];

fs.writeFileSync(path.join(DEV, 'data/derived/druid_orders.json'), JSON.stringify({ guide, note: '드루이드 교단 가이드(항목 읽는 법). 교단별 부여는 subclasses.json 소유.' }, null, 1) + '\n');
console.log(`✔ druid_orders.json — guide ${guide.length}항목`);
