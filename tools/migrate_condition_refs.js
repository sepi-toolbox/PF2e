// migrate_condition_refs.js
// SPELL_DB.js / feat_db.js의 desc 필드 내부 한글 조건명을 {{condition:EN}} 템플릿으로 일괄 변환
// 한글 어절 경계 (?<![가-힣]) ... (?![가-힣]) 사용으로 부분 매칭 방지
// 이미 {{condition:...}} 으로 처리된 부분은 건드리지 않음 (영문이라 자동 회피)

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const DEV = path.resolve(__dirname, '..', 'dev');
const fpData = path.join(DEV, 'cs_data.js');
const fpSpell = path.join(DEV, 'SPELL_DB.js');
const fpFeat = path.join(DEV, 'feat_db.js');

const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(fpData, 'utf8').replace(/^const /gm, 'var '), ctx);

const CONDITIONS = ctx.CONDITIONS_DATA;

// 짧은 이름 우선 (긴 이름이 짧은 이름의 superstring일 수 있음 — 실제론 거의 없지만 안전)
const sortedConds = [...CONDITIONS].sort((a, b) => b.name.length - a.name.length);

// 변환 함수
function convertDesc(desc, stats) {
  if (!desc || typeof desc !== 'string') return desc;
  let out = desc;
  for (const c of sortedConds) {
    if (!c.name || !c.en) continue;
    // 한글 어절 경계 (좌우에 한글이 아닐 때만 매칭)
    // 또한 이미 {{condition:...}} 같은 템플릿 내부는 영문이므로 자동 회피
    const re = new RegExp(`(?<![가-힣])${c.name}(?![가-힣])`, 'g');
    let count = 0;
    out = out.replace(re, (match) => {
      count++;
      return `{{condition:${c.en}}}`;
    });
    if (count > 0) {
      stats[c.name] = (stats[c.name] || 0) + count;
    }
  }
  return out;
}

function processFile(fp, descRegex, prefix, quote) {
  // prefix: '"desc":', 'desc:'
  // quote: '"' or "'"
  const src = fs.readFileSync(fp, 'utf8');
  const stats = {};
  let changedFields = 0;

  const updated = src.replace(descRegex, (match, descContent) => {
    const converted = convertDesc(descContent, stats);
    if (converted !== descContent) changedFields++;
    return `${prefix} ${quote}${converted}${quote}`;
  });

  if (src !== updated) {
    fs.writeFileSync(fp, updated, 'utf8');
  }
  return { changedFields, stats };
}

// 다양한 desc 표기: "desc": "...", desc: "...", desc:'...'
const SPECS = [
  { re: /"desc":\s*"((?:[^"\\]|\\.)*)"/g, prefix: '"desc":', quote: '"' },
  { re: /(?<!")\bdesc:\s*"((?:[^"\\]|\\.)*)"/g, prefix: 'desc:', quote: '"' },
  { re: /(?<!")\bdesc:\s*'((?:[^'\\]|\\.)*)'/g, prefix: 'desc:', quote: "'" },
];

function runAll(fp) {
  const acc = { changedFields: 0, stats: {} };
  for (const s of SPECS) {
    const r = processFile(fp, s.re, s.prefix, s.quote);
    acc.changedFields += r.changedFields;
    Object.entries(r.stats).forEach(([k,v]) => acc.stats[k] = (acc.stats[k]||0) + v);
  }
  return acc;
}

console.log('=== SPELL_DB.js ===');
const sr = runAll(fpSpell);
console.log(`desc 변경 필드: ${sr.changedFields}`);

console.log('\n=== feat_db.js ===');
const fr = runAll(fpFeat);
console.log(`desc 변경 필드: ${fr.changedFields}`);

const total = {};
[sr, fr].forEach(r => Object.entries(r.stats).forEach(([k, v]) => {
  total[k] = (total[k] || 0) + v;
}));

console.log('\n=== 변환 통계 (조건명별 변환 횟수) ===');
Object.entries(total).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
  console.log(`  ${k.padEnd(8)} : ${v}`);
});
const sum = Object.values(total).reduce((a, b) => a + b, 0);
console.log(`\n총 ${sum}건 변환 완료`);
