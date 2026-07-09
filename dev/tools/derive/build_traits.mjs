#!/usr/bin/env node
/* build_traits.mjs — 특성(trait) 레지스트리를 1급 엔티티로 구축
 * 소스(FVTT/PF2e-KR 파생): _lang.traits(slug→한글, 1224) + _trait_desc.ko.json(설명, 504, PascalCase키)
 * 산출: data/derived/traits.json = { slug: {name_en, name_ko, desc_ko, has_desc} }
 * 실행: cd dev && node tools/derive/build_traits.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const load = f => { try { return JSON.parse(fs.readFileSync(path.join(DEV, f), 'utf8')); } catch (e) { return {}; } };

const labels = load('data/overlay/_lang.ko.json').traits || {};   // slug → 한글
const gloss = (load('data/creatures/_glossary.ko.json').trait) || {};
const descs = load('data/creatures/_trait_desc.ko.json');          // PascalCase → 설명
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const descByNorm = {}, enByNorm = {};
for (const k in descs) { descByNorm[norm(k)] = descs[k]; enByNorm[norm(k)] = k; }
const prettify = s => String(s).split(/[-_]/).map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(' ');

// 이름 소스 = _glossary.ko.json.trait(단일 루트). 우리 엔티티가 쓰는 트레잇은 이 루트에 등록돼 있어야 함(내부 정합성).
//   slug 정합성 검사(DataManager 참조 링크)로 발견된 미등록 24종을 루트 glossary trait에 백필(런타임 store/_glossary도 동일).
const allSlugs = new Set([...Object.keys(labels), ...Object.keys(gloss)]);
const out = {};
let withDesc = 0;
for (const slug of [...allSlugs].sort()) {
  const n = norm(slug);
  const desc = descByNorm[n] || '';
  if (desc) withDesc++;
  out[slug] = {
    name_en: enByNorm[n] || prettify(slug),
    name_ko: labels[slug] || gloss[slug] || slug,
    desc_ko: desc,
    has_desc: !!desc,
  };
}
const outPath = path.join(DEV, 'data', 'derived', 'traits.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 1) + '\n');
console.log(`✔ ${path.relative(DEV, outPath)} — 특성 ${Object.keys(out).length}개 (설명 ${withDesc}개, ${(withDesc / Object.keys(out).length * 100).toFixed(0)}%)`);
