#!/usr/bin/env node
// desc 필드 내 한글(English) 패턴을 {{type:Key}} 템플릿으로 변환
// Usage: node tools/apply_desc_refs.js

const fs = require('fs');
const path = require('path');

// ── 1. DB 로드 ──
const fakeDoc = {getElementById:()=>null,addEventListener:()=>{},querySelectorAll:()=>[],querySelector:()=>null,createElement:()=>({style:{},appendChild:()=>{}})};
const fakeWin = {innerWidth:1024,innerHeight:768,addEventListener:()=>{},getComputedStyle:()=>({})};
global.document = fakeDoc; global.window = fakeWin;
global.alert = ()=>{}; global.setTimeout = ()=>{}; global.setInterval = ()=>{};
global.localStorage = {getItem:()=>null,setItem:()=>{}};
global.firebase = {auth:()=>({onAuthStateChanged:()=>{}}),firestore:()=>({})};

// dev/ 기준 (v509~ 운영/개발 분리)
const root = path.resolve(__dirname, '..', 'dev');

// cs_data.js 직접 파싱 (eval이 실패할 수 있으므로 CONDITIONS_DATA만 추출)
const dataText = fs.readFileSync(path.join(root, 'cs_data.js'), 'utf8');

// CONDITIONS_DATA 추출
const condMatch = dataText.match(/const CONDITIONS_DATA\s*=\s*(\[[\s\S]*?\n\];)/);
const CONDITIONS_DATA = condMatch ? eval(condMatch[1]) : [];

// ACTION_DB 추출
const actMatch = dataText.match(/const ACTION_DB\s*=\s*(\[[\s\S]*?\n\];)/);
const ACTION_DB = actMatch ? eval(actMatch[1]) : [];

// SPELL_DB 로드
const spellText = fs.readFileSync(path.join(root, 'SPELL_DB.js'), 'utf8');
const spellMatch = spellText.match(/const SPELL_DB\s*=\s*(\[[\s\S]*\]);/);
const SPELL_DB = spellMatch ? eval(spellMatch[1]) : [];

// FEAT_DB 로드
const featText = fs.readFileSync(path.join(root, 'feat_db.js'), 'utf8');
eval(featText); // var FEAT_DB

console.error(`DB 로드: conditions=${CONDITIONS_DATA.length}, actions=${ACTION_DB.length}, spells=${SPELL_DB.length}, feats=${FEAT_DB.length}`);

// ── 2. 영문명 → {type, key} 매핑 빌드 ──
// 우선순위: condition > action > spell > feat
const refMap = new Map(); // lowercase english → {type, key}

// Feats (lowest priority)
for (const f of FEAT_DB) {
  if (f && f.name_en) refMap.set(f.name_en.toLowerCase(), {type:'feat', key:f.name_en});
}
// Spells
for (const sp of SPELL_DB) {
  if (sp && sp.name_en) refMap.set(sp.name_en.toLowerCase(), {type:'spell', key:sp.name_en});
}
// Actions — 제외 (DB Korean name이 desc 텍스트와 불일치하여 렌더링 오류 발생)
// Conditions (highest priority — overwrites if same name)
for (const c of CONDITIONS_DATA) {
  if (c && c.en) refMap.set(c.en.toLowerCase(), {type:'condition', key:c.en});
}

// 수동 별칭 (desc에서 사용하는 Remaster 이름 → DB의 en 필드)
const aliases = {
  'off-guard': {type:'condition', key:'Off-Guard'},
  'flat-footed': {type:'condition', key:'Off-Guard'},
  'greater darkvision': null, // 특수 시야 — 변환하지 않음
  'darkvision': null,
  'low-light vision': null,
};

function lookupEnglish(english) {
  const lk = english.toLowerCase().trim();
  // 별칭 먼저
  if (aliases.hasOwnProperty(lk)) return aliases[lk]; // null이면 변환 안 함
  // DB 매핑
  return refMap.get(lk) || null;
}

// ── 3. 변환 함수 ──
// 한글(English) 패턴을 {{type:Key}}로 변환
// 주의: summary는 건드리지 않음 — desc만 대상
const koEnPattern = /([\uAC00-\uD7A3]+)\(([A-Za-z][A-Za-z '\-]*[A-Za-z])\)/g;

// 변환하면 안 되는 패턴 (혈통명, 특성명 등 DB에 없는 것은 자동 스킵)
const skipKorean = new Set([
  // 혈통/종족 이름
  '코볼트','고블린','노움','인간','엘프','드워프','오크','하플링','레쉬',
  '흐린가르','아이오니스','드로모아르','파르쿤','도크잘','겔리드','칼가시',
  // 무기/방어구/도구
  '도끼','곡괭이','워해머','쿠크리','할버드','글레이브','팔치온','긴칼','짧은칼',
  // 일반명사
  '허접','석조','법률','사냥','광업','채광','약초','농업','항해',
]);

function convertDesc(desc) {
  if (!desc || typeof desc !== 'string') return desc;
  // 이미 {{}} 템플릿이 있으면 그 부분은 건드리지 않음
  return desc.replace(koEnPattern, (match, korean, english) => {
    if (skipKorean.has(korean)) return match;
    const ref = lookupEnglish(english);
    if (!ref) return match; // DB에 없으면 원본 유지
    return `{{${ref.type}:${ref.key}}}`;
  });
}

// ── 4. feat_db.js 변환 ──
let featOut = featText;
let featCount = 0;

// desc:'...' 필드만 변환 (summary는 건드리지 않음)
featOut = featOut.replace(/desc:'((?:[^'\\]|\\.)*)'/g, (match, descContent) => {
  const converted = convertDesc(descContent);
  if (converted !== descContent) featCount++;
  return `desc:'${converted}'`;
});

fs.writeFileSync(path.join(root, 'feat_db.js'), featOut);
console.error(`feat_db.js: ${featCount}개 desc 변환됨`);

// ── 5. SPELL_DB.js 변환 ──
let spellOut = spellText;
let spellCount = 0;

// desc: "..." 필드만 변환
spellOut = spellOut.replace(/desc: "((?:[^"\\]|\\.)*)"/g, (match, descContent) => {
  const converted = convertDesc(descContent);
  if (converted !== descContent) spellCount++;
  return `desc: "${converted}"`;
});

fs.writeFileSync(path.join(root, 'SPELL_DB.js'), spellOut);
console.error(`SPELL_DB.js: ${spellCount}개 desc 변환됨`);

// ── 6. 통계 ──
const allText = featOut + spellOut;
const templateCount = (allText.match(/\{\{(spell|feat|condition|trait|action):/g) || []).length;
console.error(`\n총 {{type:key}} 템플릿: ${templateCount}개`);
console.error('완료.');
