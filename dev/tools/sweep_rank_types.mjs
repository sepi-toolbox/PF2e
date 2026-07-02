#!/usr/bin/env node
/* sweep_rank_types.mjs — 2026-07-02 사용자 확정 통일:
 * ① Spell Rank = 랭크: 주문 문맥 필드(주문|시전|캔트립|두루마리 언급) 안의 «등급»→«랭크».
 *    보호(등급 유지): 숙련도/숙련/성공/표준/고급/하급/전설/달인/전문가/미숙련/훈련 + 등급 (숙련도·성공도·재료 등급).
 * ② 장비 유형어: Wand=완드(지팡이·마법봉 금지, Staff=지팡이와 충돌 해소) / Potion=물약 / Oil=기름 / Elixir=엘릭서 / Snare=올가미 / Boots=부츠 / Gauntlets=장갑.
 * 실행: cd dev && node tools/sweep_rank_types.mjs [--apply]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const DEV = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(DEV);
const APPLY = process.argv.includes('--apply');
const log = { rank: 0, types: {} };

// ── ① 랭크 스윕 ──
const PROTECT_RE = /(숙련도|숙련|성공|표준|고급|하급|전설|달인|전문가|미숙련|훈련) 등급/g;
function rankSweep(s) {
  if (!/등급/.test(s) || !/주문|시전|캔트립|두루마리/.test(s)) return s;
  let t = s.replace(PROTECT_RE, (m) => m.replace('등급', '⟪G⟫'));
  const n = (t.match(/등급/g) || []).length;
  if (n) { log.rank += n; t = t.split('등급').join('랭크'); }
  return t.split('⟪G⟫').join('등급');
}
function walkSweep(o) {
  if (typeof o === 'string') return rankSweep(o);
  if (Array.isArray(o)) return o.map(walkSweep);
  if (o && typeof o === 'object') { for (const k in o) o[k] = walkSweep(o[k]); return o; }
  return o;
}
const FILES = [
  ...fs.readdirSync('data/overlay').filter(f => /\.ko\.json$/.test(f)).map(f => 'data/overlay/' + f),
  ...fs.readdirSync('data/creatures').filter(f => /\.ko\.json$/.test(f) && !f.startsWith('_')).map(f => 'data/creatures/' + f),
  'data/creatures/_trait_desc.ko.json', 'data/creatures/_manual.ko.json', 'data/overlay/_lang.ko.json', 'data/creatures/_glossary.ko.json',
];
for (const f of FILES) {
  if (!fs.existsSync(f)) continue;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  const out = walkSweep(j);
  if (APPLY) fs.writeFileSync(f, JSON.stringify(out, null, 1) + '\n');
}

// ── ② 유형어 이름 통일 (영문명에 유형어 포함된 엔티티의 한글명에서 유형 토큰 교체) ──
const PF = require(path.join(DEV, 'cs_pf2e.js'));
PF.loadCategorySync('equipment');
const TYPES = [
  { en: /\bWand\b/i, to: '완드', from: ['지팡이', '마법봉'] },
  { en: /Potion/i, to: '물약', from: ['포션'] },
  { en: /\bOil\b/i, to: '기름', from: ['오일'] },
  { en: /Elixir/i, to: '엘릭서', from: ['비약', '영약'] },
  { en: /Snare/i, to: '올가미', from: ['덫'] },
  { en: /\bBoots\b/i, to: '부츠', from: ['장화'] },
  { en: /Gauntlets/i, to: '장갑', from: ['건틀릿'] },
];
const ovl = JSON.parse(fs.readFileSync('data/overlay/equipment.ko.json', 'utf8'));
const ovr = JSON.parse(fs.readFileSync('data/override/equipment.json', 'utf8'));
for (const d of PF.all('equipment')) {
  const slug = (d.system && d.system.slug) || d._id;
  const ko = PF.nameKo(d) || '';
  for (const T of TYPES) {
    if (!T.en.test(d.name)) continue;
    let nk = ko;
    for (const w of T.from) nk = nk.split(w).join(T.to);
    if (nk !== ko) {
      log.types[T.to] = (log.types[T.to] || 0) + 1;
      if (APPLY) {
        if (ovr[slug] && ovr[slug].name_ko) ovr[slug].name_ko = nk;
        else if (ovl[slug]) ovl[slug].name = nk;
        else ovr[slug] = Object.assign(ovr[slug] || {}, { name_ko: nk });
      }
    }
    break; // 첫 매칭 유형만
  }
}
// Potion "약" 단독 3건 개별 (X 약 → X 물약)
for (const d of PF.all('equipment')) {
  if (!/Potion/i.test(d.name)) continue;
  const slug = (d.system && d.system.slug) || d._id;
  const ko = (APPLY && ovr[slug] && ovr[slug].name_ko) || (ovl[slug] && ovl[slug].name) || PF.nameKo(d) || '';
  if (/물약|포션/.test(ko)) continue;
  const m = ko.match(/^(.*) 약(\s*\([^)]*\))?$/);
  if (m) {
    const nk = m[1] + ' 물약' + (m[2] || '');
    log.types['물약(약→)'] = (log.types['물약(약→)'] || 0) + 1;
    if (APPLY) { if (ovr[slug] && ovr[slug].name_ko) ovr[slug].name_ko = nk; else if (ovl[slug]) ovl[slug].name = nk; }
  }
}
if (APPLY) {
  fs.writeFileSync('data/overlay/equipment.ko.json', JSON.stringify(ovl, null, 1) + '\n');
  fs.writeFileSync('data/override/equipment.json', JSON.stringify(ovr, null, 1) + '\n');
}
console.log('랭크 치환:', log.rank, '| 유형어:', JSON.stringify(log.types));
console.log(APPLY ? 'APPLIED' : '(dry-run) --apply 로 적용');
