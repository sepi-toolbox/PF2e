#!/usr/bin/env node
// DEITY_DB.domains 한국어 이름 → DOMAIN_DB 영문 id 외래키 정규화
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DEV_DIR = path.join(ROOT, 'dev');
const DRY = process.argv.includes('--dry');

const ctx = { window:{}, console:{ error(){}, log(){} } };
vm.createContext(ctx);
let src = fs.readFileSync(path.join(DEV_DIR, 'class_features_db.js'), 'utf8');
vm.runInContext(src, ctx);

// DOMAIN_DB.name (한국어) → id (영문) 역매핑
const koToId = {};
for (const [id, info] of Object.entries(ctx.DOMAIN_DB || {})) {
  if (info && info.name) koToId[info.name] = id;
}
// 번역 불일치 수동 매핑 (PDF 점검으로 확정)
const ALIAS = {
  '날씨': 'travel',      // 고즈레: PDF는 travel(여행)이지만 DB는 '날씨'로 입력됨
  '방탕': 'indulgence',  // 우르가토아: PDF는 indulgence(탐닉)이지만 DB는 '방탕'
};

console.log('=== DEITY_DB.domains 변환 ===');
let migrated = 0, missing = 0;
for (const deity of ctx.DEITY_DB) {
  if (!Array.isArray(deity.domains)) continue;
  const newDomains = [];
  for (const d of deity.domains) {
    if (koToId[d]) { newDomains.push(koToId[d]); migrated++; }
    else if (ALIAS[d]) { newDomains.push(ALIAS[d]); migrated++; console.log(`  [alias] ${deity.id}: '${d}' → '${ALIAS[d]}'`); }
    else { newDomains.push(d); missing++; console.error(`[warn] ${deity.id}: '${d}' not in DOMAIN_DB`); }
  }
  deity.domains = newDomains;
}
console.log(`자동 변환: ${migrated} | 누락: ${missing}`);

// findVarBlock + 부분 교체
function findVarBlock(src, keyword, varName) {
  const re = new RegExp(`^${keyword}\\s+${varName}\\s*=\\s*[\\[\\{]`, 'm');
  const m = re.exec(src);
  if (!m) return null;
  let i = m.index;
  while (i < src.length && src[i] !== '[' && src[i] !== '{') i++;
  let depth = 0, inS = null, inL = false, inB = false;
  while (i < src.length) {
    const c = src[i], nx = src[i+1];
    if (inL) { if (c === '\n') inL = false; i++; continue; }
    if (inB) { if (c === '*' && nx === '/') { inB = false; i += 2; continue; } i++; continue; }
    if (inS) { if (c === '\\') { i += 2; continue; } if (c === inS) inS = null; i++; continue; }
    if (c === '/' && nx === '/') { inL = true; i += 2; continue; }
    if (c === '/' && nx === '*') { inB = true; i += 2; continue; }
    if (c === '"' || c === "'" || c === '`') { inS = c; i++; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') {
      depth--;
      if (depth === 0) {
        let j = i + 1;
        while (j < src.length && /[ \t;]/.test(src[j])) j++;
        return { start: m.index, end: j };
      }
    }
    i++;
  }
  return null;
}

const block = findVarBlock(src, 'var', 'DEITY_DB');
if (!block) { console.error('DEITY_DB block not found'); process.exit(1); }
const newCode = `var DEITY_DB = ${JSON.stringify(ctx.DEITY_DB, null, 2)};`;
const updated = src.slice(0, block.start) + newCode + src.slice(block.end);
if (!DRY) fs.writeFileSync(path.join(DEV_DIR, 'class_features_db.js'), updated);
console.log(`\n${DRY ? 'DRY-' : ''}WROTE class_features_db.js DEITY_DB`);
