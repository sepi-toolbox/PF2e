#!/usr/bin/env node
// normalize_integrated_traits.mjs — 방패/무기 통합무기 트레잇 정규화(1회, 멱등).
//   FVTT 플랫 슬러그 `integrated-1d6-s[-versatile-p]`는 피해·다용도를 슬러그에 인코딩 → 레지스트리에 없는 아이템별 유사트레잇.
//   우리 단일 소스에선 value=base 트레잇(`integrated`,`versatile-p`)만 두고, 피해/다용도는 구조화 `traits.integrated` 객체에 보존(무손실).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const DEV = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FILE = path.join(DEV, 'data/store/equipment.json');
const DMG = { s: 'slashing', p: 'piercing', b: 'bludgeoning' };
const RE = /^integrated-(\d+)d(\d+)-([a-z])(?:-versatile-([a-z]))?$/;

const eq = JSON.parse(fs.readFileSync(FILE, 'utf8'));
let changed = 0;
for (const it of eq) {
  const tv = it.system && it.system.traits && it.system.traits.value;
  if (!Array.isArray(tv)) continue;
  const idx = tv.findIndex(t => RE.test(String(t)));
  if (idx < 0) continue;
  const m = RE.exec(String(tv[idx]));
  const [, n, die, dtype, vers] = m;
  // 구조화 integrated 객체에 피해/다용도 보존
  const integ = it.system.traits.integrated || (it.system.traits.integrated = {});
  integ.damage = `${n}d${die}`;
  integ.damageType = DMG[dtype] || dtype;
  if (vers) integ.versatile = DMG[vers] || vers;
  // 플랫 value → base 트레잇으로 교체
  const base = ['integrated'];
  if (vers) base.push('versatile-' + vers);
  tv.splice(idx, 1, ...base);
  it.system.traits.value = [...new Set(tv)];
  changed++;
}
fs.writeFileSync(FILE, JSON.stringify(eq) + '\n');
console.log(`normalized integrated traits on ${changed} items.`);
