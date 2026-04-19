#!/usr/bin/env node
/**
 * prereqs JSON을 feat_db.js에 삽입
 * 사용법: node tools/apply_prereqs.js prereqs.json
 */
const fs = require('fs');
const prereqsJson = JSON.parse(fs.readFileSync(process.argv[2] || '/tmp/prereqs_result.json', 'utf8'));

let dbText = fs.readFileSync('feat_db.js', 'utf8');
let applied = 0, missed = 0;

for (const [nameEn, prereqs] of Object.entries(prereqsJson)) {
  // feat_db에서 해당 재주 행 찾기: name_en:'XXX'
  const escaped = nameEn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "\\\\'");
  const pattern = new RegExp(`(name_en:'${escaped}',\\s*feat_level:\\d+,\\s*(?:prerequisites:'[^']*',\\s*)?)`, 'g');

  let found = false;
  dbText = dbText.replace(pattern, (match) => {
    // 이미 prereqs가 있으면 교체
    if (match.includes('prereqs:')) {
      found = true;
      return match.replace(/prereqs:\[[^\]]*\],?\s*/, '') ;
    }
    found = true;
    // prerequisites 바로 뒤에 prereqs 삽입
    const prereqStr = JSON.stringify(prereqs).replace(/"/g, '');
    // JSON → JS 객체 리터럴로 변환
    let jsPrereqs = JSON.stringify(prereqs);
    // 키의 따옴표 제거 (간결한 JS 객체 스타일)
    jsPrereqs = jsPrereqs.replace(/"(\w+)":/g, '$1:');
    // 문자열 값의 " → ' (내부 어포스트로피 이스케이프)
    jsPrereqs = jsPrereqs.replace(/"([^"]+)"/g, (m, v) => "'" + v.replace(/'/g, "\\'") + "'");

    return match + `prereqs:${jsPrereqs}, `;
  });

  if (found) applied++;
  else missed++;
}

fs.writeFileSync('feat_db.js', dbText);
console.error(`적용: ${applied}, 미발견: ${missed}`);
