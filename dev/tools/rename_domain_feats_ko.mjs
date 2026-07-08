#!/usr/bin/env node
/* rename_domain_feats_ko.mjs — 재주명 "도메인" → "영역" 용어 통일(정본)
 * PF2e 정본 용어 = 영역(Domain). 재주 한글명의 "도메인" 표기를 "영역"으로 통일.
 * 산출: data/store/feats.json 제자리(minified 유지). 재실행 안전(idempotent).
 * 실행: cd dev && node tools/rename_domain_feats_ko.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..');
const RENAME = {
  'domain-initiate': '영역 입문자',
  'advanced-domain': '고급 영역',
  'guarded-domain': '수호 영역',
  'domain-spirit': '영역 영혼',
  'domain-fluency': '영역 유창성',
  'domain-embodiment': '영역 구현',
  'domain-acumen': '영역 통찰력',
  'domain-focus': '영역 집중',
};
const fpath = path.join(DEV, 'data/store/feats.json');
const feats = JSON.parse(fs.readFileSync(fpath, 'utf8'));
const arr = Array.isArray(feats) ? feats : Object.values(feats);
let n = 0;
for (const f of arr) {
  const slug = f.system && f.system.slug;
  if (slug && RENAME[slug] && f.name_ko !== RENAME[slug]) { f.name_ko = RENAME[slug]; n++; }
}
fs.writeFileSync(fpath, JSON.stringify(feats));
console.log(`✅ 재주명 통일 ${n}건 (도메인→영역)`);
for (const [s, ko] of Object.entries(RENAME)) console.log(`  ${s} → ${ko}`);
