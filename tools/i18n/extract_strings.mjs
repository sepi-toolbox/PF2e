// 패스포지 UI 한글 문자열 추출 → 로컬라이즈 인벤토리
// HTML(텍스트+속성) + JS(문자열 리터럴, HTML조각은 내부 텍스트 분해). 동적(${}) 분리 표기.
import fs from 'fs';
const DEV = '/tmp/PF2e-publish/dev';
const HTML = ['CharacterSheet.html','GMSheet.html','Map.html'];
const JS = ['cs_ui.js','cs_modal.js','cs_calc.js','cs_save.js','cs_session.js','cs_dice.js','cs_feat_effects.js','cs_map.js','cs_data.js'];
const KO = /[가-힣]/;
const inv = new Map(); // phrase → {ko, kind, dyn, files:Set}
const add = (ko, kind, file, dyn=false) => {
  ko = ko.trim();
  if (!ko || !KO.test(ko)) return;
  if (ko.length > 200) return;                 // 너무 긴 건 동적 본문일 확률 — 스킵
  const e = inv.get(ko) || { ko, kind, dyn, files: new Set() };
  e.files.add(file); if (dyn) e.dyn = true;
  inv.set(ko, e);
};
// HTML 텍스트 노드 + 속성
for (const f of HTML) {
  let src = fs.readFileSync(`${DEV}/${f}`, 'utf8');
  src = src.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, ''); // 스크립트/스타일 제외
  for (const m of src.matchAll(/>([^<>]*[가-힣][^<>]*)</g)) add(m[1].replace(/&[a-z]+;/g,' '), 'html-text', f);
  for (const m of src.matchAll(/(?:placeholder|title|alt|aria-label|value)\s*=\s*"([^"]*[가-힣][^"]*)"/g)) add(m[1], 'html-attr', f);
}
// JS 문자열 리터럴 — 깨끗한 원자 UI 문자열만 ('...' "..." 만, HTML/코드 조각 제외)
const CODE = /[<>{}$=;|`\\]/;       // 이 문자 포함 시 = HTML조각/코드/동적 → 제외
for (const f of JS) {
  const src = fs.readFileSync(`${DEV}/${f}`, 'utf8');
  const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"/g;   // 한 줄짜리 따옴표 리터럴만
  for (const m of src.matchAll(re)) {
    const raw = (m[1] ?? m[2]); if (raw == null || !KO.test(raw)) continue;
    if (CODE.test(raw)) continue;                              // HTML/코드 섞인 건 per-site 단계로
    if (raw.length < 2 || raw.length > 80) continue;
    add(raw.replace(/\\(.)/g,'$1'), 'js', f);
  }
}
const out = [...inv.values()].map(e => ({ ko: e.ko, kind: e.kind, dyn: e.dyn, files: [...e.files] }))
  .sort((a,b)=> a.ko.localeCompare(b.ko,'ko'));
fs.writeFileSync('/tmp/PF2e-publish/tools/i18n/_strings.json', JSON.stringify(out, null, 1));
const dyn = out.filter(o=>o.dyn).length;
console.log(`고유 문자열 ${out.length}종 (동적 ${dyn}, 정적 ${out.length-dyn})`);
const byKind = {}; for (const o of out) byKind[o.kind]=(byKind[o.kind]||0)+1;
console.log('종류별:', JSON.stringify(byKind));
console.log('샘플:', out.filter(o=>!o.dyn).slice(0,12).map(o=>o.ko).join(' | '));
