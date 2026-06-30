#!/usr/bin/env node
/* build_pf4_icons.mjs — P4 신규 엔티티(혈통/유산/배경/주문/재주) 아이콘 벤더링.
 * BASE 문서의 system img 경로를 로컬 Foundry 설치본에서 dev/data/icons/ 로 복사.
 *   - "systems/pf2e/icons/..."  → Foundry Data 루트(<FoundryData>/<img>)
 *   - "icons/..."(코어)          → Foundry 앱 public(<corePublic>/<img>)
 * 이미 dev/data/icons/ 에 있으면 skip. %xx 디코딩 처리. /tmp 초기화 시 재실행.
 * 사용: node tools/build_pf4_icons.mjs [ancestries heritages backgrounds spells feats]
 */
import fs from 'fs';
import path from 'path';

const DEV = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ICON_DEST = path.join(DEV, 'data', 'icons');
const FOUNDRY_DATA = '/Users/sepi/Library/Application Support/FoundryVTT/Data';
const CORE_PUBLIC_CANDS = [
  '/Applications/Foundry Virtual Tabletop.app/Contents/Resources/app/public',
  '/Applications/Foundry Tunnel.app/Contents/Resources/app/public',
  '/Applications/FoundryVTT.app/Contents/Resources/app/public',
];
const CORE_PUBLIC = CORE_PUBLIC_CANDS.find(p => fs.existsSync(p)) || CORE_PUBLIC_CANDS[0];

const cats = process.argv.slice(2);
const CATS = cats.length ? cats : ['ancestries', 'heritages', 'backgrounds'];

function srcOf(img) {
  const dec = decodeURIComponent(img);
  if (dec.startsWith('systems/')) return path.join(FOUNDRY_DATA, dec);
  if (dec.startsWith('icons/')) return path.join(CORE_PUBLIC, dec);
  return null;
}

let copied = 0, skipped = 0, missing = 0, noimg = 0;
const missImgs = [];
for (const cat of CATS) {
  const file = path.join(DEV, 'data', 'base', `${cat}.base.json`);
  if (!fs.existsSync(file)) { console.warn(`skip ${cat}: ${file} 없음`); continue; }
  const arr = JSON.parse(fs.readFileSync(file, 'utf8'));
  let c = 0, s = 0, m = 0;
  for (const d of arr) {
    const img = d.img; if (!img) { noimg++; continue; }
    const destRel = decodeURIComponent(img);
    const dest = path.join(ICON_DEST, destRel);
    if (fs.existsSync(dest)) { s++; skipped++; continue; }
    const src = srcOf(img);
    if (!src || !fs.existsSync(src)) { m++; missing++; if (missImgs.length < 12) missImgs.push(img); continue; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    c++; copied++;
  }
  console.log(`${cat}: 복사 ${c} / 기존 ${s} / 소스없음 ${m} (총 ${arr.length})`);
}
console.log(`\n✓ 합계: 복사 ${copied}, 기존 ${skipped}, 소스없음 ${missing}, img없음 ${noimg}`);
console.log(`  코어 public: ${CORE_PUBLIC}`);
if (missImgs.length) console.log(`  소스없음 예시:`, missImgs);
