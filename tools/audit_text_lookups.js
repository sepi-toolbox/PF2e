#!/usr/bin/env node
// audit_text_lookups.js
// dev/ JS 코드에서 "텍스트 기반 외래 참조" 패턴을 grep해서 정규화 진행도를 측정.
// 텍스트 매칭이 0건이 되는 것이 정규화의 종료 조건.
//
// 검출 패턴:
//   - find(x => x.name_ko === ...)  / find(x => x.name === ...)  / find(x => x.en === ...)
//   - filter(x => x.name_ko === ...)  유사
//   - X_DB.find  →  외래 DB 직접 텍스트 lookup
//   - 직접 한글 문자열 비교: === '한국어'
//   - summary.match(/.../)  정규식 파싱
//
// Usage: node tools/audit_text_lookups.js

const fs = require('fs');
const path = require('path');

const DEV = path.resolve(__dirname, '..', 'dev');
const FILES = [
  'cs_data.js',
  'cs_calc.js',
  'cs_ui.js',
  'cs_modal.js',
  'cs_feat_effects.js',
  'cs_save.js',
  'cs_session.js',
  'cs_dice.js',
  'class_features_db.js',
];

const PATTERNS = [
  {
    label: 'name_ko 텍스트 매칭',
    severity: 'HIGH',
    re: /\.name_ko\s*===\s*[^.][^\n]{0,80}/g,
    note: '외래 DB를 한국어 이름으로 검색 — id 매칭으로 교체 권장',
  },
  {
    label: 'name 텍스트 매칭 (background.name 등)',
    severity: 'MED',
    re: /\.name\s*===\s*['"][^'"]{1,30}['"]/g,
    note: '단일 식별자가 name 필드면 id 매칭으로 교체. UI 표시용이면 무시',
  },
  {
    label: 'name_en 텍스트 매칭',
    severity: 'HIGH',
    re: /\.name_en\s*===\s*[^.][^\n]{0,80}/g,
    note: '영문 이름으로 lookup — id 기반으로 교체 권장 (이름 변경에 깨지지 않음)',
  },
  {
    label: '직접 한글 문자열 비교',
    severity: 'MED',
    re: /===\s*['"`][가-힣][^'"`]*['"`]/g,
    note: '한글 텍스트와 직접 비교 — enum/id 또는 마커 필드로 교체 권장',
  },
  {
    label: 'summary 정규식 파싱',
    severity: 'HIGH',
    re: /summary[^=]*\.match\(/g,
    note: 'summary 텍스트에서 데이터 추출 — 구조화 컬럼으로 분리 권장',
  },
  {
    label: 'desc 정규식 파싱',
    severity: 'MED',
    re: /(\bdesc|\.desc)\s*\.\s*match\(/g,
    note: 'desc 텍스트에서 데이터 추출 — 구조화 컬럼으로 분리 권장',
  },
  {
    label: 'split(, ) 텍스트 CSV 파싱',
    severity: 'LOW',
    re: /\.split\(['"], ['"]\)/g,
    note: '데이터 필드가 CSV 텍스트 — 배열 컬럼으로 정규화 권장',
  },
];

const SCAN_PATH_PREFIX = DEV.replace(/\\/g, '/');

let totalHits = 0;
const buckets = {};

for (const file of FILES) {
  const fp = path.join(DEV, file);
  if (!fs.existsSync(fp)) continue;
  const lines = fs.readFileSync(fp, 'utf8').split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 주석은 제외
    if (/^\s*\/\//.test(line)) continue;

    for (const pat of PATTERNS) {
      const m = line.match(pat.re);
      if (m) {
        const key = pat.label;
        if (!buckets[key]) buckets[key] = { severity: pat.severity, note: pat.note, hits: [] };
        buckets[key].hits.push({
          file,
          line: i + 1,
          snippet: line.trim().slice(0, 160),
        });
        totalHits++;
      }
    }
  }
}

// 출력
const SEV_ORDER = { HIGH: 0, MED: 1, LOW: 2 };
const sortedLabels = Object.keys(buckets).sort((a, b) =>
  (SEV_ORDER[buckets[a].severity] - SEV_ORDER[buckets[b].severity]) || a.localeCompare(b)
);

console.log('# PF2e 캐릭터 시트 — 텍스트 매칭 잔여 측정\n');
console.log(`스캔 대상: dev/ (${FILES.length}개 파일)\n`);
console.log(`**총 잔여: ${totalHits}건**\n`);
console.log('| 위험도 | 패턴 | 건수 |');
console.log('|--------|------|------|');
for (const label of sortedLabels) {
  console.log(`| ${buckets[label].severity} | ${label} | ${buckets[label].hits.length} |`);
}
console.log('');

for (const label of sortedLabels) {
  const b = buckets[label];
  console.log(`\n## [${b.severity}] ${label}`);
  console.log(`> ${b.note}\n`);
  const byFile = {};
  for (const h of b.hits) {
    if (!byFile[h.file]) byFile[h.file] = [];
    byFile[h.file].push(h);
  }
  for (const file of Object.keys(byFile).sort()) {
    console.log(`### ${file} (${byFile[file].length}건)`);
    for (const h of byFile[file].slice(0, 8)) {
      console.log(`- L${h.line}: \`${h.snippet}\``);
    }
    if (byFile[file].length > 8) {
      console.log(`- ... ${byFile[file].length - 8}건 더`);
    }
  }
}

console.log('\n---');
console.log('정규화 종료 조건: 본 도구의 HIGH 위험도 잔여 = 0건');
