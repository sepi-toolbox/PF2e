#!/usr/bin/env node
/* build_feat_effects.mjs — 재주 자동화(기계효과)를 하나의 정본 데이터 테이블로 평탄화.
 * 소스: FEAT_DB(effect_group_id/choice_id/choice_kind/choice_label/auto_note/damage_note) ⨝
 *       EFFECT_GROUPS(기계효과 행) + CHOICE_OPTIONS(선택지 → option effect_group).
 * 각 행 = "재주 1개의 효과/선택지/노트 1건". raw 값(slug/enum) 그대로 — DataManager 표시/관리용.
 * 산출: data/derived/feat_effects.json  ({rows:[...], note})
 * 실행: cd dev && node tools/derive/build_feat_effects.mjs
 * (cs_data.js는 DOM 스텁으로 vm 로드 — EFFECT_GROUPS/CHOICE_OPTIONS 추출)
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
load('cs_data.js', 'globalThis.EFFECT_GROUPS=(typeof EFFECT_GROUPS!=="undefined"?EFFECT_GROUPS:[]);globalThis.CHOICE_OPTIONS=(typeof CHOICE_OPTIONS!=="undefined"?CHOICE_OPTIONS:[]);');
const { FEAT_DB, EFFECT_GROUPS, CHOICE_OPTIONS } = ctx;

const egIdx = {}; for (const r of EFFECT_GROUPS) (egIdx[r.group_id] = egIdx[r.group_id] || []).push(r);
const coIdx = {}; for (const o of CHOICE_OPTIONS) (coIdx[o.choice_id] = coIdx[o.choice_id] || []).push(o);

// EFFECT_GROUPS 행 → 표시행(그룹키 제거, 배열은 문자열화)
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
let featCount = 0;
for (const f of FEAT_DB) {
  if (!f) continue;
  const hasAuto = f.effect_group_id || f.choice_id || f.auto_note || f.damage_note;
  if (!hasAuto) continue;
  featCount++;
  const base = { feat_slug: f.id, feat_name: f.name_ko || f.id, feat_level: f.feat_level != null ? f.feat_level : '', category: f.category || '' };
  // ① 직접 기계효과
  for (const r of (egIdx[f.effect_group_id] || [])) rows.push({ ...base, src: 'effect', choice: '', option: '', ...egFields(r) });
  // ② 노트
  if (f.auto_note) rows.push({ ...base, src: 'note', type: 'display_note', note: f.auto_note });
  if (f.damage_note) rows.push({ ...base, src: 'note', type: 'damage_note', note: typeof f.damage_note === 'object' ? JSON.stringify(f.damage_note) : f.damage_note });
  // ③ 선택지(choice) + 옵션별 효과
  if (f.choice_id) {
    const opts = coIdx[f.choice_id] || [];
    if (!opts.length) {
      rows.push({ ...base, src: 'choice', choice: f.choice_id, type: 'choice', choice_kind: f.choice_kind || '', choice_label: f.choice_label || '' });
    }
    for (const o of opts) {
      const orow = { ...base, src: 'choice_opt', choice: f.choice_id, option: o.option_id, type: 'choice_option', choice_kind: f.choice_kind || '', option_name: o.option_name || '', is_default: o.is_default ? 1 : '' };
      const oeff = egIdx[o.effect_group_id] || [];
      if (!oeff.length) rows.push(orow);
      else for (const r of oeff) rows.push({ ...orow, ...egFields(r) });
    }
  }
}

// type 분포(note 필드)
const byType = {}; for (const r of rows) if (r.type) byType[r.type] = (byType[r.type] || 0) + 1;
const note = `재주 자동화 정본 효과 테이블. 재주 ${featCount}개 · 효과행 ${rows.length}개 · ${Object.keys(byType).length} type. `
  + `소스=FEAT_DB.effect_group_id ⨝ EFFECT_GROUPS(+CHOICE_OPTIONS). raw slug/enum 표시(치환 금지). `
  + `src: effect(직접효과)/choice·choice_opt(선택지)/note(자동노트). 편집=구조필드는 후속(현재 열람).`;

const out = { rows, note, _types: byType };
fs.writeFileSync(path.join(DEV, 'data/derived/feat_effects.json'), JSON.stringify(out, null, 1) + '\n');
console.log('wrote data/derived/feat_effects.json');
console.log('feats:', featCount, 'rows:', rows.length, 'types:', Object.keys(byType).length);
console.log('by type:', JSON.stringify(byType));
