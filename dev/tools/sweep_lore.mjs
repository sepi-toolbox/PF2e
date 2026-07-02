#!/usr/bin/env node
/* sweep_lore.mjs — Lore 표기 통일: 로어 → 지식 (2026-07-02 사용자 지시).
 * 예외(보호): 플로어벨(Floorbell)·밴달로어(Bandalore)·아클로어(Aklo 언어)·로어마스터(Loremaster 원형명)·로어키퍼(Lorekeeper NPC 칭호).
 * 부수 정정: "로어킬"(로어 스킬 오타)→"지식 기술", "하로어"(Harrower 이형)→"해로우어".
 * 대상: overlay/creatures ko 이름·본문 + _lang/_trait_desc. derived는 손대지 않음(재빌드로 반영).
 * 실행: cd dev && node tools/sweep_lore.mjs [--apply]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const DEV = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');

const PROTECT = ['플로어', '밴달로어', '아클로어', '로어마스터', '로어키퍼'];
const PRE_FIX = [['로어킬', '지식 기술'], ['하로어', '해로우어']];

let total = 0; const perFile = {};
function sweep(text) {
  let t = text;
  for (const [o, n] of PRE_FIX) t = t.split(o).join(n);
  PROTECT.forEach((p, i) => { t = t.split(p).join(`${i}`); });
  const before = (t.match(/로어/g) || []).length;
  t = t.split('로어').join('지식');
  // "의 지식" 이름 스타일 정리는 이름 필드에서만(아래 name 처리) — 본문은 조사 유지
  PROTECT.forEach((p, i) => { t = t.split(`${i}`).join(p); });
  return { t, n: before };
}

const files = [
  ...fs.readdirSync(path.join(DEV, 'data/overlay')).filter(f => /\.ko\.json$/.test(f)).map(f => 'data/overlay/' + f),
  ...fs.readdirSync(path.join(DEV, 'data/creatures')).filter(f => /\.ko\.json$/.test(f) && !f.startsWith('_')).map(f => 'data/creatures/' + f),
  'data/creatures/_trait_desc.ko.json', 'data/creatures/_manual.ko.json',
];
for (const f of files) {
  const p = path.join(DEV, f);
  if (!fs.existsSync(p)) continue;
  const src = fs.readFileSync(p, 'utf8');
  const { t, n } = sweep(src);
  if (n) { perFile[f] = n; total += n; }
  if (APPLY && t !== src) { JSON.parse(t); fs.writeFileSync(p, t); }
}

// 이름 스타일 정리: "X의 지식" → "X 지식" (재주 이름 필드만 — overlay name)
let nameStyle = 0;
for (const f of ['data/overlay/feats.ko.json', 'data/overlay/spells.ko.json', 'data/overlay/effects.ko.json']) {
  const p = path.join(DEV, f);
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  let dirty = false;
  for (const slug in j) {
    const e = j[slug];
    if (e && typeof e.name === 'string') {
      let n2 = e.name;
      for (const [o, nn] of PRE_FIX) n2 = n2.split(o).join(nn);
      if (!PROTECT.some(pt => n2.includes(pt))) n2 = n2.replace(/의 로어\b/g, ' 지식').replace(/로어/g, '지식');
      // 개별 정본(직역 어색 교정)
      const SPECIAL = { 'glean-lore': '지식 수집', 'bardic-lore': '바드 지식', 'deep-lore': '심오한 지식' };
      if (SPECIAL[slug]) n2 = SPECIAL[slug];
      if (n2 !== e.name) { e.name = n2; dirty = true; nameStyle++; }
    }
  }
  if (APPLY && dirty) fs.writeFileSync(p, JSON.stringify(j, null, 1) + '\n');
}

console.log('본문/이름 로어 치환:', total, '건', JSON.stringify(perFile));
console.log('이름 필드 정리:', nameStyle, '건');
console.log(APPLY ? 'APPLIED' : '(dry-run) --apply 로 적용');
