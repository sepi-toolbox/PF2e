// 버전 범프 — dev/ 에서 실행. 모든 캐시버스터(?v=) + 푸터 표시 + CHANGELOG 최신 v + cs_monster _IIMG_VER 를
// 단일 MAJOR.MINOR 값으로 통일한다. 버전 체계: dev=소수(0.1,0.2..), 운영 배포=정수(1.0,2.0..).
//   dev 마이너 범프 예) node tools/bump_version.mjs 0.2
//   운영 배포(메이저)  예) node tools/bump_version.mjs 1.0   ← /pf2e-deploy 가 호출
import fs from 'fs';

const ver = process.argv[2];
if (!ver || !/^\d+\.\d+$/.test(ver)) {
  console.error('usage: node tools/bump_version.mjs <MAJOR.MINOR>  (예: 0.2 / 1.0)');
  process.exit(1);
}

let total = 0;
// 1) 리터럴 ?v=<x> 캐시버스터 (HTML 진입/소비 파일 + icon_map fetch)
for (const f of fs.readdirSync('.')) {
  if (!/\.(html|js)$/.test(f)) continue;
  let s = fs.readFileSync(f, 'utf8');
  const hits = (s.match(/\?v=[0-9.]+/g) || []).length;
  if (!hits) continue;
  s = s.replace(/\?v=[0-9.]+/g, '?v=' + ver);
  fs.writeFileSync(f, s);
  total += hits;
  console.log(`  ${f}: ?v= ${hits}곳`);
}

// 2) index.html — 푸터 표시 span + CHANGELOG 최신 항목 v
if (fs.existsSync('index.html')) {
  let s = fs.readFileSync('index.html', 'utf8');
  s = s.replace(/>v[0-9.]+</, '>v' + ver + '<');                                  // 기어 푸터
  s = s.replace(/(const CHANGELOG = \[\s*\{\s*v:\s*')[0-9.]+(')/, `$1${ver}$2`);  // 최신 항목 v
  fs.writeFileSync('index.html', s);
  console.log('  index.html: 푸터 span + CHANGELOG[0].v');
}

// 3) cs_monster.js — 동적 캐시버스터 변수
if (fs.existsSync('cs_monster.js')) {
  let s = fs.readFileSync('cs_monster.js', 'utf8');
  s = s.replace(/(const _IIMG_VER = ')[0-9.]+(')/, `$1${ver}$2`);
  fs.writeFileSync('cs_monster.js', s);
  console.log('  cs_monster.js: _IIMG_VER');
}

console.log(`\n✓ 버전 통일 → ${ver} (리터럴 ?v= ${total}곳 + 푸터 + CHANGELOG + _IIMG_VER)`);
