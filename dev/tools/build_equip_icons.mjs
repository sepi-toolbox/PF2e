// BASE 장비 아이콘 전량 벤더링
// equipment.base.json(FVTT 5646개)의 img(아이콘 경로)를 data/icons/ 로 복사 → 장비 모달/인벤토리가
// item.img 폴백으로 FVTT 아이콘을 그대로 표시(레거시 icon_map 미커버분 해소).
// 소스: 로컬 Foundry 설치본(시스템 + 코어 public). /tmp 초기화돼도 산출물 커밋되어 있으면 재실행 불필요.
// 사용: cd dev/tools && node build_equip_icons.mjs

import fs from 'fs';
import path from 'path';

const DEV = path.resolve(import.meta.dirname, '..');
const OUT = path.join(DEV, 'data', 'icons');
const DATA = '/Users/sepi/Library/Application Support/FoundryVTT/Data/';
const CORE = '/Applications/Foundry Virtual Tabletop.app/Contents/Resources/app/public/';

const base = JSON.parse(fs.readFileSync(path.join(DEV, 'data', 'creatures', '..', 'base', 'equipment.base.json'), 'utf8'));
const arr = Array.isArray(base) ? base : Object.values(base);

function srcOf(img) {                       // img 경로(verbatim) → 실제 소스 파일(디코드)
  const d = decodeURIComponent(img);
  if (fs.existsSync(DATA + d)) return DATA + d;
  if (fs.existsSync(CORE + d)) return CORE + d;
  return null;
}

const imgs = new Set();
for (const x of arr) if (x && x.img) imgs.add(x.img);

let copied = 0, already = 0, miss = 0, bytes = 0; const missEx = [];
for (const img of imgs) {
  const dest = path.join(OUT, decodeURIComponent(img));   // data/icons/<경로> (디코드해 실제 파일경로로)
  if (fs.existsSync(dest)) { already++; continue; }
  const src = srcOf(img);
  if (!src) { miss++; if (missEx.length < 10) missEx.push(img); continue; }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  copied++; bytes += fs.statSync(dest).size;
}
console.log(`BASE 장비 아이콘: ${imgs.size}종`);
console.log(`복사 ${copied} | 기존 ${already} | 누락 ${miss} (+${(bytes / 1048576).toFixed(1)}MB)`);
if (miss) console.log('누락 예:', missEx);
