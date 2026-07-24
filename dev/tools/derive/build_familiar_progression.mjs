#!/usr/bin/env node
/* build_familiar_progression.mjs — 사역마(패밀리어) 능력 개수 진행표(레벨별) = data/derived/familiar_progression.json
 *
 *  대원칙 0: 개수는 성장 데이터가 그 자체로 소유(숙련 T/E/M/L처럼) → 런타임이 이 표를 직접 읽어 펫 maxAbilities 결정.
 *  정본(Player Core):
 *   · 일반 사역마: "매일 사역마/마스터 능력 2개 선택" → 보편 base = 2.
 *   · 마녀 사역마(Witch's Familiar): "추가 능력 2개(후원자 고유 1 고정 + 매일 1) + 6·12·18레벨에 각 +1".
 *      → 총합 = 2(보편) + 2 + 레벨마일스톤. 1~5레벨 4 / 6~11 5 / 12~17 6 / 18~20 7. (이 중 1개는 후원자 고정.)
 *  실행: cd dev && node tools/derive/build_familiar_progression.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const BASE_DEFAULT = 2;                 // 보편 사역마: 매일 능력 2개(재주로 증가 가능)
// 클래스별 사역마 능력 총 개수(레벨1~20). 후원자/근원 고정 능력 포함(자유선택 = 총합 − 고정수).
const CLASS_RULES = {
  // 마녀: base 2 + 마녀 +2, 6/12/18레벨 +1씩.
  witch: { base: 4, milestones: { 6: 5, 12: 6, 18: 7 } },
};

function byLevel(rule) {
  const arr = [];
  let cur = rule.base;
  for (let lv = 1; lv <= 20; lv++) {
    if (rule.milestones && rule.milestones[lv] != null) cur = rule.milestones[lv];
    arr.push(cur);
  }
  return arr;
}

const classes = {};
const rows = [];
for (const [cls, rule] of Object.entries(CLASS_RULES)) {
  const arr = byLevel(rule);
  classes[cls] = arr;
  arr.forEach((n, i) => rows.push({ class: cls, level: i + 1, abilities: n }));
}

const out = {
  base_default: BASE_DEFAULT,
  classes,
  rows,
  note: '사역마 능력 개수(레벨별). base_default=보편 사역마(2). classes[클래스]=레벨1~20 총 개수(고정 능력 포함). 소스=Player Core 정본. 런타임이 펫 maxAbilities로 직접 읽음(대원칙 0).',
};
fs.writeFileSync(path.join(DEV, 'data/derived/familiar_progression.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`✔ familiar_progression.json — 기본 ${BASE_DEFAULT}, 클래스 ${Object.keys(classes).length}종`);
for (const c in classes) console.log(`  ${c}: L1=${classes[c][0]} L6=${classes[c][5]} L12=${classes[c][11]} L18=${classes[c][17]}`);
