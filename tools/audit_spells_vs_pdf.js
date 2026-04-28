#!/usr/bin/env node
// SPELL_DB의 모든 name_en을 PDF (PC1+PC2)와 대조해서 Remaster에 없는 항목 점검
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DEV_DIR = path.join(ROOT, 'dev');
const PDF_DIR = '/Users/sepi/Library/Mobile Documents/com~apple~CloudDocs/AIwork/01_TTRPG-Translation/Pathfinder2e/PlayerCore/01. 원본';

// PDF → 텍스트 (캐시 사용)
const TXT1 = '/tmp/pc1.txt';
const TXT2 = '/tmp/pc2.txt';
if (!fs.existsSync(TXT1)) execSync(`pdftotext -layout "${PDF_DIR}/PZO12001E.pdf" ${TXT1}`, {stdio:'pipe'});
if (!fs.existsSync(TXT2)) execSync(`pdftotext -layout "${PDF_DIR}/PZO12002E.pdf" ${TXT2}`, {stdio:'pipe'});

// PDF에서 주문명 추출
//   ALLCAPS 이름 + optional [cast] + SPELL|FOCUS|CANTRIP|RITUAL N 패턴
//   라인 어디든 (multi-column layout 대응)
function extractSpellNames(txt) {
  // 모든 typographic apostrophe → ASCII
  txt = txt.replace(/[''']/g, "'");
  const names = new Set();
  const STOPWORD = /^(SPELL|FOCUS|CANTRIP|RITUAL|TRADITIONS|TRAITS|RANGE|AREA|DURATION|TRIGGER|REQUIREMENTS|DEFENSE|HEIGHTENED|SUCCESS|FAILURE|CRITICAL|CAST|UNCOMMON|RARE|FEAT|HEX|EFFECT)$/;
  // cast 표기: [single] | [a] TO [b] | [a] OR [b]
  const cast = `(?:\\[[a-z0-9\\- ]+\\](?:\\s+(?:TO|OR)\\s+\\[[a-z0-9\\- ]+\\])?\\s+)?`;
  const re = new RegExp(`([A-Z][A-Z'\\- ]{1,40}?[A-Z])\\s+${cast}(?:SPELL|FOCUS|CANTRIP|RITUAL)\\s+\\d+`, 'g');
  let m;
  while ((m = re.exec(txt)) !== null) {
    let name = m[1].trim();
    // PDF layout 컬럼 분리: 3+ 연속 공백은 다른 컬럼 → 마지막 세그먼트가 실제 헤더
    const segs = name.split(/\s{3,}/);
    name = segs[segs.length - 1].trim();
    const parts = name.split(/\s+/);
    while (parts.length && STOPWORD.test(parts[parts.length-1])) parts.pop();
    while (parts.length && STOPWORD.test(parts[0])) parts.shift();
    name = parts.join(' ');
    if (name.length >= 3 && !STOPWORD.test(name)) names.add(name);
  }
  return names;
}

const pdfNames1 = extractSpellNames(fs.readFileSync(TXT1, 'utf8'));
const pdfNames2 = extractSpellNames(fs.readFileSync(TXT2, 'utf8'));
const allPdfNames = new Set([...pdfNames1, ...pdfNames2]);
console.log(`[PDF] PC1 추출: ${pdfNames1.size}개, PC2 추출: ${pdfNames2.size}개, 합계: ${allPdfNames.size}개\n`);

// SPELL_DB 로드
const ctx = { window:{}, console };
vm.createContext(ctx);
let s = fs.readFileSync(path.join(DEV_DIR, 'SPELL_DB.js'), 'utf8').replace(/^const SPELL_DB =/m, 'var SPELL_DB =');
vm.runInContext(s, ctx);

// 정규화 (case-insensitive 비교, ' 같은 특수문자 정리)
function norm(s) {
  return s.toUpperCase().replace(/['']/g, "'").replace(/\s+/g, ' ').trim();
}
const pdfNorm = new Set([...allPdfNames].map(norm));

// 미매칭 SPELL_DB 항목
const missing = [];
const matched = [];
for (const sp of ctx.SPELL_DB) {
  if (!sp?.name_en) continue;
  const n = norm(sp.name_en);
  if (pdfNorm.has(n)) matched.push(sp);
  else missing.push(sp);
}

console.log(`SPELL_DB 항목: 총 ${ctx.SPELL_DB.length}`);
console.log(`  PDF 매칭: ${matched.length}`);
console.log(`  PDF 미매칭: ${missing.length}\n`);

console.log('=== 미매칭 SPELL_DB 항목 (Remaster에 없을 가능성) ===');
// 카테고리별 그룹
const byCat = {};
for (const sp of missing) {
  const cat = sp.is_cantrip ? '캔트립' : sp.is_focus ? '집중' : '랭크 ' + (sp.rank||'?');
  (byCat[cat] = byCat[cat]||[]).push(sp);
}
for (const cat of Object.keys(byCat).sort()) {
  console.log(`\n[${cat}] ${byCat[cat].length}개`);
  for (const sp of byCat[cat]) {
    const tradStr = (sp.traditions||[]).join(',');
    console.log(`  ${sp.id.padEnd(35)} ${sp.name_en.padEnd(30)} | ${sp.name_ko} | ${tradStr}`);
  }
}

// 추가 진단: PC1만에 있는 거, PC2만에 있는 거
console.log(`\n=== PDF 인덱스 통계 ===`);
console.log(`PC1만: ${[...pdfNames1].filter(n => !pdfNames2.has(n)).length}`);
console.log(`PC2만: ${[...pdfNames2].filter(n => !pdfNames1.has(n)).length}`);
console.log(`공통: ${[...pdfNames1].filter(n => pdfNames2.has(n)).length}`);
