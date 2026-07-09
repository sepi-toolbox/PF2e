#!/usr/bin/env node
// build_boosts.mjs — 능력치 부스트를 엔티티 store의 네이티브 4컬럼으로 베이크.
//   컬럼(배경·종족·클래스 공통, 서브클래스는 부스트 없음):
//     boost_fixed        : 능력치 slug 배열 — 항상 적용되는 고정 부스트
//     boost_free         : 정수 — 자유 부스트 개수(풀=전체라 암묵적)
//     boost_choice       : 능력치 slug 배열 — 택1 제한 풀(측정상 엔티티당 최대 1그룹, 항상 택1)
//     boost_flaws        : 능력치 slug 배열 — 고정 결함(boost_fixed와 대칭, 종족만)
//   출처: system.boosts / system.flaws(종족·배경), system.keyAbility(클래스).
//   ⚠ 이 빌더는 store를 단일소스로 만드는 1회 마이그레이션 + 재현용. 실행 후 4컬럼이 정본.
//   parity: 파싱 규칙은 기존 어댑터(ancestryToLegacy/emitBackground/classToLegacy)와 동일 → by construction.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DEV = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const STORE = path.join(DEV, 'data/store');

// system.boosts(숫자키 그룹) → {free, fixed[], choice[]}
function parseBoostGroups(boosts) {
  let free = 0; const fixed = []; let choice = [];
  for (const k of Object.keys(boosts || {})) {
    const v = ((boosts[k] || {}).value) || [];
    if (v.length >= 6) free++;               // 6개 전체 = 자유
    else if (v.length === 1) fixed.push(v[0]); // 단일 = 고정
    else if (v.length > 1) choice = v.slice(); // 2~5 = 택1 제한 풀(측정상 엔티티당 ≤1그룹)
    // length 0 = 미지정 슬롯 → 무시(기존 어댑터 동작 일치)
  }
  return { free, fixed, choice };
}
// system.flaws → 고정 결함 배열(측정상 FIX1 또는 빈값뿐)
function parseFlaws(flaws) {
  const out = [];
  for (const k of Object.keys(flaws || {})) {
    const v = ((flaws[k] || {}).value) || [];
    if (v.length === 1) out.push(v[0]);
  }
  return out;
}

function bakeDoc(doc, kind) {
  const s = doc.system || {};
  let cols;
  if (kind === 'classes') {
    // 클래스 핵심 능력치 = 능력치 부스트(택1, 옵션 1개면 고정). key_attrs는 런타임이 이 컬럼에서 파생.
    const key = (s.keyAbility && s.keyAbility.value) || [];
    cols = {
      boost_fixed: key.length === 1 ? key.slice() : [],
      boost_free: 0,
      boost_choice: key.length > 1 ? key.slice() : [],
      boost_flaws: [],
    };
  } else {
    const g = parseBoostGroups(s.boosts);
    cols = {
      boost_fixed: g.fixed,
      boost_free: g.free,
      boost_choice: g.choice,
      boost_flaws: parseFlaws(s.flaws),
    };
  }
  Object.assign(doc, cols);
  return cols;
}

let total = 0;
const summary = {};
for (const kind of ['ancestries', 'backgrounds', 'classes']) {
  const file = path.join(STORE, kind + '.json');
  const arr = JSON.parse(fs.readFileSync(file, 'utf8'));
  const shapes = {};
  for (const doc of arr) {
    const c = bakeDoc(doc, kind);
    const key = `fixed${c.boost_fixed.length}/free${c.boost_free}/choice${c.boost_choice.length}/flaw${c.boost_flaws.length}`;
    shapes[key] = (shapes[key] || 0) + 1;
    total++;
  }
  fs.writeFileSync(file, JSON.stringify(arr) + '\n');
  summary[kind] = { count: arr.length, shapes };
}
console.log(JSON.stringify(summary, null, 1));
console.log('baked boost columns onto', total, 'entities.');
