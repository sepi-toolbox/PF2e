#!/usr/bin/env node
// build_trait_desc.mjs — 특성(trait) 설명 사전 사이드카 생성
//   소스: 로컬 Foundry pf2e 시스템 en.json(폴백) + PF2e-KR ko.json(한글 우선)
//   출력: dev/data/creatures/_trait_desc.ko.json  = { PascalKey: "설명" }
//   런타임(cs_monster.js)은 slug→PascalCase 변환 후 조회(+ 값접미사 폴백).
//   아이콘 빌더와 동일 방침: 소스는 로컬 설치본, 산출물만 repo 커밋.
import fs from 'node:fs';
import path from 'node:path';

const HOME = process.env.HOME;
const EN = process.env.PF2E_EN
  || `${HOME}/Library/Application Support/FoundryVTT/Data/systems/pf2e/lang/en.json`;
const KO = process.env.PF2E_KO
  || `${HOME}/Library/Application Support/FoundryVTT/Data/modules/PF2e-KR/lang/ko.json`;
const OUT = process.argv[2]
  || path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'dev', 'data', 'creatures', '_trait_desc.ko.json');

function flat(o, p, out) {
  for (const k in o) {
    const v = o[k]; const np = p ? p + '.' + k : k;
    if (v && typeof v === 'object') flat(v, np, out); else out[np] = v;
  }
  return out;
}
// PF2E.TraitDescription<Suffix> → { Suffix: text }
function descMap(file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'));
  const F = flat(json, '', {}); const m = {};
  for (const k in F) {
    const i = k.indexOf('TraitDescription');
    if (i >= 0) { const suf = k.slice(i + 'TraitDescription'.length); if (suf) m[suf] = String(F[k]).trim(); }
  }
  return m;
}

const enD = descMap(EN);
const koD = descMap(KO);
// 한글 우선 + 영문 폴백
const out = {};
for (const k in enD) out[k] = enD[k];
for (const k in koD) if (koD[k]) out[k] = koD[k];

// 결정적 정렬(키 알파벳순)로 diff 안정화
const sorted = {};
for (const k of Object.keys(out).sort()) sorted[k] = out[k];

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(sorted, null, 0) + '\n');
console.error(`[trait_desc] en=${Object.keys(enD).length} ko=${Object.keys(koD).length} → ${Object.keys(sorted).length} keys → ${OUT}`);
