#!/usr/bin/env node
// _glossary.ko.json 확장: language(+향후 확장) 섹션을 PF2e-KR lang/ko.json ⨝ FVTT en.json에서 추출·병합.
// 기존 섹션(skill/sense/condition/trait 등)은 보존. 시스템 용어 단일 소스 원칙(우리 글로서리)에 맞춤.
// 실행: node tools/derive/build_glossary_terms.mjs   (cwd=dev/)
import fs from 'fs';

const KR = '/tmp/PF2e-KR/lang/ko.json';
const EN_CANDS = [
  '/Users/sepi/Library/Application Support/FoundryVTT/Data/systems/pf2e/lang/en.json',
];
const GLOSS = 'data/creatures/_glossary.ko.json';

const ko = JSON.parse(fs.readFileSync(KR, 'utf8'));
let en = null;
for (const p of EN_CANDS) { try { en = JSON.parse(fs.readFileSync(p, 'utf8')); break; } catch (e) {} }
if (!en) { console.error('FVTT en.json 못 찾음'); process.exit(1); }

const koLang = (((ko.PF2E || {}).Actor || {}).Creature || {}).Language || {};
const enLang = (((en.PF2E || {}).Actor || {}).Creature || {}).Language || {};

// 실제 언어 슬러그만: 소문자-하이픈, 플레이스홀더/UI 문자열 제외
const slugRe = /^[a-z][a-z0-9-]*$/;
const language = {};
let n = 0;
for (const slug of Object.keys(enLang)) {
  if (!slugRe.test(slug)) continue;                 // CommonLanguage/DetailsPlaceholder/Plural 등 제외
  const koVal = koLang[slug];
  if (!koVal || /[{}]/.test(koVal)) continue;        // 미번역/플레이스홀더 제외
  // FVTT enum slug → 한글. name_en도 참조용으로 en 보관은 불필요(런타임은 slug→ko만)
  language[slug] = koVal;
  n++;
}

const gloss = JSON.parse(fs.readFileSync(GLOSS, 'utf8'));
gloss.language = language;
fs.writeFileSync(GLOSS, JSON.stringify(gloss, null, 0));
console.log(`glossary.language 병합: ${n}개 (예: elven=${language.elven}, mwangi=${language.mwangi}, tengu=${language.tengu})`);
console.log('전체 섹션:', Object.keys(gloss).map(k => k + ':' + (typeof gloss[k] === 'object' ? Object.keys(gloss[k]).length : '?')).join(', '));
