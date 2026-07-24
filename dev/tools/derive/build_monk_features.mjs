#!/usr/bin/env node
/* build_monk_features.mjs — 몽크 「클래스 핵심 특징」 가이드 = data/derived/monk_features.json (guide만).
 *   ⚠ 몽크는 서브클래스가 없는 클래스(선택하는 하위 갈래 없음) → 다른 클래스의 「서브클래스 항목 읽는 법」 대신
 *   클래스 정체성(핵심 능력치·몰아치는 타격·자세·완벽을 향한 길 등)을 안내. 바바리안 본능 가이드와 동일 인프라(guide만).
 *   런타임 MONK_GUIDE(class_features_db)를 loadMonkFeatures(cs_pf2e_class)가 채움 → 모달 「클래스 핵심 특징」 박스(드롭다운 없음).
 *   특징 레벨은 우리 성장표(class_progression monk) 기준. 정본 = Player Core(PZO12001) 「Monk」.
 *   실행: cd dev && node tools/derive/build_monk_features.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const guide = [
  { term: '핵심 능력치 (Key Attribute)', def: '근력 또는 민첩 중 하나를 선택합니다. 이 능력치가 비무장 명중과 몽크 클래스 DC에 쓰입니다.' },
  { term: '몰아치는 타격 (Flurry of Blows, 1레벨)', def: '한 번의 행동으로 비무장 타격 2회를 가합니다(두 공격이 다중 공격 페널티를 함께 나눔). 몽크 전투의 핵심입니다.' },
  { term: '강력한 주먹 (Powerful Fist, 1레벨)', def: '비무장 타격이 1d6 피해를 주고, 살상 공격 시 따르는 페널티 없이 맨손으로 치명적인 일격을 가할 수 있습니다.' },
  { term: '자세 (Stances)', def: '몽크는 서브클래스 대신 자세 재주(학 자세·호랑이 자세·산 요새 등)를 골라 고유한 무술 스타일과 특수 공격을 얻습니다. 1레벨 재주부터 선택합니다.' },
  { term: '놀라운 이동력 · 신비한 공격 (3레벨)', def: '이동 속도가 크게 늘고(놀라운 이동력), 비무장 타격이 마법 무기로 취급되어(신비한 공격) 저항을 넘어섭니다.' },
  { term: '완벽을 향한 길 (Path to Perfection, 7레벨)', def: '내성 하나를 달인 등급으로 끌어올립니다. 11·15레벨에 두 번째·세 번째 길로 확장됩니다.' },
  { term: '집중 주문 (선택)', def: '일부 몽크 재주는 집중 주문(초자연적 무예)을 부여합니다 — 지혜를 시전 능력치로 씁니다(필수는 아닙니다).' },
];

fs.writeFileSync(path.join(DEV, 'data/derived/monk_features.json'), JSON.stringify({ guide, note: '몽크 클래스 핵심 특징 가이드. 몽크=서브클래스 없음(자세 재주로 정체성 완성). 특징 레벨=class_progression monk 기준. 정본 Player Core.' }, null, 1) + '\n');
console.log(`✔ monk_features.json — guide ${guide.length}항목`);
