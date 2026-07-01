#!/usr/bin/env node
/* build_effects.mjs — 모든 소스의 자동화(기계효과)를 하나의 정본 효과 테이블로 통합.
 * 소스: FEAT_DB · HERITAGE_DB · BACKGROUNDS 의 effect_group_id(+choice_id/auto_note/damage_note)
 *       ⨝ EFFECT_GROUPS(효과행) + CHOICE_OPTIONS(선택지→option effect_group).
 * 각 행 = "엔티티 1개의 효과/선택지/노트 1건". raw slug/enum 보존(치환 금지).
 * 산출:
 *   - data/derived/effects.json      {rows, note}  — 통합 효과 테이블(DataManager '효과' 탭)
 *   - data/derived/effect_refs.json   {feats:{slug:eg}, heritages:{slug:eg}, backgrounds:{slug:eg}}
 *                                     — 엔티티 탭(재주/유산/배경)의 effect_group_id FK 컬럼용 역참조 인덱스
 * 실행: cd dev && node tools/derive/build_effects.mjs
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

const ctx = { console, document: { getElementById: () => null, querySelectorAll: () => [], createElement: () => ({ style: {}, classList: { add() {}, remove() {} } }), addEventListener() {} }, window: {}, navigator: {}, location: {} };
ctx.window = ctx; vm.createContext(ctx);
function load(f, expose) { let s = fs.readFileSync(path.join(DEV, f), 'utf8'); if (expose) s += '\n;' + expose; vm.runInContext(s, ctx); }
load('feat_db.js', 'globalThis.FEAT_DB=FEAT_DB;');
load('cs_data.js', 'globalThis.EFFECT_GROUPS=(typeof EFFECT_GROUPS!=="undefined"?EFFECT_GROUPS:[]);globalThis.CHOICE_OPTIONS=(typeof CHOICE_OPTIONS!=="undefined"?CHOICE_OPTIONS:[]);globalThis.HERITAGE_DB=(typeof HERITAGE_DB!=="undefined"?HERITAGE_DB:[]);globalThis.BACKGROUNDS=(typeof BACKGROUNDS!=="undefined"?BACKGROUNDS:[]);');
const { FEAT_DB, EFFECT_GROUPS, CHOICE_OPTIONS, HERITAGE_DB, BACKGROUNDS } = ctx;

const egIdx = {}; for (const r of EFFECT_GROUPS) (egIdx[r.group_id] = egIdx[r.group_id] || []).push(r);
const coIdx = {}; for (const o of CHOICE_OPTIONS) (coIdx[o.choice_id] = coIdx[o.choice_id] || []).push(o);

// EFFECT_GROUPS 행 → 표시행(group_id 제거, 배열은 문자열화)
function egFields(r) {
  const out = {};
  for (const k of Object.keys(r)) {
    if (k === 'group_id') continue;
    const v = r[k];
    out[k] = Array.isArray(v) ? v.join(', ') : v;
  }
  return out;
}

const rows = [];
// 엔티티종류별 역참조 인덱스 (DataManager 탭 cat 키로: feats/heritages/backgrounds)
const refs = { feats: {}, heritages: {}, backgrounds: {} };
const stat = {};

// owner: {kind(표시), refKey(DataManager cat), slug, name, level, category}
function emit(owner, f) {
  const eg = f.effect_group_id, ch = f.choice_id;
  const hasAuto = eg || ch || f.auto_note || f.damage_note;
  if (!hasAuto) return;
  stat[owner.refKey] = (stat[owner.refKey] || 0) + 1;
  if (eg) refs[owner.refKey][owner.slug] = eg;
  const base = { owner_kind: owner.kind, owner_slug: owner.slug, owner_name: owner.name, owner_level: owner.level, category: owner.category || '', effect_group_id: eg || '' };
  // ① 직접 기계효과
  for (const r of (egIdx[eg] || [])) rows.push({ ...base, src: 'effect', choice: '', option: '', ...egFields(r) });
  // ② 노트
  if (f.auto_note) rows.push({ ...base, src: 'note', type: 'display_note', note: f.auto_note });
  if (f.damage_note) rows.push({ ...base, src: 'note', type: 'damage_note', note: typeof f.damage_note === 'object' ? JSON.stringify(f.damage_note) : f.damage_note });
  // ③ 선택지(choice) + 옵션별 효과
  if (ch) {
    const opts = coIdx[ch] || [];
    if (!opts.length) rows.push({ ...base, src: 'choice', choice: ch, type: 'choice', choice_kind: f.choice_kind || '', choice_label: f.choice_label || '' });
    for (const o of opts) {
      const orow = { ...base, src: 'choice_opt', choice: ch, option: o.option_id, type: 'choice_option', choice_kind: f.choice_kind || '', option_name: o.option_name || '', is_default: o.is_default ? 1 : '' };
      const oeff = egIdx[o.effect_group_id] || [];
      if (!oeff.length) rows.push(orow);
      else for (const r of oeff) rows.push({ ...orow, ...egFields(r) });
    }
  }
}

for (const f of FEAT_DB) if (f) emit({ kind: 'feat', refKey: 'feats', slug: f.id, name: f.name_ko || f.id, level: f.feat_level != null ? f.feat_level : '', category: f.category || '' }, f);
for (const h of HERITAGE_DB) if (h) emit({ kind: 'heritage', refKey: 'heritages', slug: h.id, name: h.name_ko || h.id, level: '', category: h.ancestry || '' }, h);
for (const b of BACKGROUNDS) if (b) emit({ kind: 'background', refKey: 'backgrounds', slug: b.id, name: b.name || b.id, level: '', category: '' }, b);

const byType = {}; for (const r of rows) if (r.type) byType[r.type] = (byType[r.type] || 0) + 1;
const note = `자동화 정본 효과 테이블(통합). 엔티티 효과행 ${rows.length}개 · ${Object.keys(byType).length} type. `
  + `소스=재주 ${stat.feats || 0}·유산 ${stat.heritages || 0}·배경 ${stat.backgrounds || 0} (effect_group_id ⨝ EFFECT_GROUPS +CHOICE_OPTIONS). `
  + `owner_kind=소속(feat/heritage/background), effect_group_id=참조 효과그룹 FK. raw slug/enum 표시(치환 금지). `
  + `src: effect(직접효과)/choice·choice_opt(선택지)/note(자동노트).`;

fs.writeFileSync(path.join(DEV, 'data/derived/effects.json'), JSON.stringify({ rows, note, _types: byType }, null, 1) + '\n');
fs.writeFileSync(path.join(DEV, 'data/derived/effect_refs.json'), JSON.stringify(refs, null, 1) + '\n');
try { fs.unlinkSync(path.join(DEV, 'data/derived/feat_effects.json')); } catch (e) {}
console.log('wrote data/derived/effects.json + effect_refs.json');
console.log('rows:', rows.length, 'by owner:', JSON.stringify(stat), 'types:', Object.keys(byType).length);
console.log('refs: feats=' + Object.keys(refs.feats).length, 'heritages=' + Object.keys(refs.heritages).length, 'backgrounds=' + Object.keys(refs.backgrounds).length);
