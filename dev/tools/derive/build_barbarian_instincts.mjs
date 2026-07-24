#!/usr/bin/env node
/* build_barbarian_instincts.mjs — 바바리안 본능(Instinct) 「항목 읽는 법」 가이드 = data/derived/barbarian_instincts.json (guide만).
 *   드루이드 교단·레인저 사냥 방식 가이드와 동일 패턴. 런타임 BARBARIAN_INSTINCT_GUIDE(class_features_db)를
 *   loadBarbarianInstincts(cs_pf2e_class)가 채움 → 모달 「본능 항목 읽는 법」.
 *   본능별 flavor·본능 능력·특화·분노 저항은 FVTT _desc_ko(subclasses.json)가 이미 완비 → desc 재작성 없이 가이드만 추가.
 *   바바리안은 주문 없는 클래스 → 전통/주문 없음. 본능은 분노(Rage) 기반 전투 능력.
 *   정본 = Player Core 2(PZO12004) 「Barbarian — Instinct / Instinct Ability / Specialization Ability / Raging Resistance」.
 *   실행: cd dev && node tools/derive/build_barbarian_instincts.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const guide = [
  { term: '본능', def: '바바리안의 분노가 비롯되는 지배적 본능입니다. 본능이 1레벨 본능 능력을 주고, 고레벨에 분노 피해·저항을 키우며, 본능에 묶인 바바리안 재주를 고를 수 있게 합니다. 전통·주문은 없습니다 — 본능은 분노(Rage) 기반 전투 능력입니다.' },
  { term: '본능 능력 (Instinct Ability)', def: '1레벨에 본능이 주는 핵심 능력입니다. 동물=야수의 분노(자연 공격), 용=용의 분노(원소 피해·숨결), 거인=거인의 파괴자(내 크기보다 큰 무기), 영혼=영혼의 분노(영혼 피해), 미신=미신적 회복력(마법 저항), 분노=막을 수 없는 광란(분노 피해 증가 + 1레벨 보너스 재주).' },
  { term: '특화 능력 (Specialization Ability, 7레벨)', def: '7레벨에 본능의 분노 추가 피해가 커집니다(대개 2→5, 무기 대전문화가 있으면 12). 본능마다 세부 값이 다릅니다.' },
  { term: '분노 저항 (Raging Resistance, 9레벨)', def: '9레벨에 본능에 어울리는 피해에 저항을 얻습니다. 동물=관통·참격, 용=선택한 용의 원소, 영혼=공허·언데드, 미신=선택한 두 마법 전통의 주문 피해 등.' },
  { term: '금기 (Anathema)', def: '미신 본능만 「주문 시전을 배우거나 시전 가능한 아이템을 사용·휴대하는 것」이 금기입니다. 어기면 본능 능력과 본능을 전제로 하는 재주를 잃습니다(1일 다운타임으로 회복). 나머지 본능에는 금기가 없습니다.' },
  { term: '본능 재주 (Instinct Feat)', def: '각 본능에 묶인 바바리안 재주(예: 용의 분노 날개, 거인의 태풍 등)를 선택할 수 있습니다. 본능이 재주의 전제 조건이 됩니다.' },
];

fs.writeFileSync(path.join(DEV, 'data/derived/barbarian_instincts.json'), JSON.stringify({ guide, note: '바바리안 본능 가이드(항목 읽는 법). 본능별 능력은 subclasses.json(FVTT _desc_ko) 소유. 바바리안=주문 없음.' }, null, 1) + '\n');
console.log(`✔ barbarian_instincts.json — guide ${guide.length}항목`);
