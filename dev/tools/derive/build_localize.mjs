#!/usr/bin/env node
/* build_localize.mjs — @Localize 해소 사전 + UI 용어집 (분리, 엔티티 중복 배제)
 * 문제: PF2e-KR ko.json 전체를 넣으면 특성/행동/조건/장비/재주룰 등 엔티티 테이블과 중복.
 * 해결:
 *   ① localize.ko.json = 실제 @Localize[...]가 참조하는 키만(대부분 NPC 능력 글로서리). 런타임 해소용.
 *   ② ui_glossary.json = 진짜 UI 문자열(SETTINGS/UI/CompendiumBrowser 등 화이트리스트)만. 브라우즈용.
 * 소스: PF2e-KR lang(ko/action/re) . 데이터의 @Localize 실참조 스캔.
 * 실행: cd dev && node tools/derive/build_localize.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const KR = '/tmp/PF2e-KR/lang';
const load = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return {}; } };
const dict = {};
(function () {
  for (const f of ['ko.json', 'action-ko.json', 're-ko.json']) {
    (function walk(o, p) { for (const k in o) { const v = o[k], key = p ? p + '.' + k : k; if (typeof v === 'string') dict[key] = v; else if (v && typeof v === 'object') walk(v, key); } })(load(path.join(KR, f)), '');
  }
})();

// ① @Localize 실참조 키 스캔
const refs = new Set();
(function scan(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { scan(p); continue; }
    if (!f.endsWith('.json')) continue;
    for (const m of fs.readFileSync(p, 'utf8').matchAll(/@Localize\[([^\]]+)\]/g)) refs.add(m[1]);
  }
})(path.join(DEV, 'data', 'base'));
(function scan(dir) { for (const f of fs.readdirSync(dir)) { const p = path.join(dir, f); if (fs.statSync(p).isDirectory()) scan(p); else if (f.endsWith('.json')) for (const m of fs.readFileSync(p, 'utf8').matchAll(/@Localize\[([^\]]+)\]/g)) refs.add(m[1]); } })(path.join(DEV, 'data', 'creatures'));

const localize = {};
let miss = [];
for (const k of refs) { if (dict[k] != null) localize[k] = dict[k]; else miss.push(k); }
fs.writeFileSync(path.join(DEV, 'data/derived/localize.ko.json'), JSON.stringify(localize, null, 0) + '\n');

// ② UI 용어집 — 진짜 UI 네임스페이스만(엔티티/기계 룰 배제)
const UI_NS = new Set(['SETTINGS', 'UI', 'CompendiumBrowser', 'RuleEditor', 'RuleElement', 'RULES', 'WorldClock', 'TradeDialog',
  'Encounter', 'Check', 'Roll', 'loot', 'identification', 'TravelSpeed', 'vehicle', 'Token', 'EFFECT', 'ChatCard',
  'ActorSheet', 'Migrations', 'Levabbr', 'PewPew', 'Kingmaker', 'CriticalDeck', 'InlineCheck', 'Duration', 'Time', 'Coins']);
const ui = [];
for (const k of Object.keys(dict)) {
  const ns = k.split('.')[1] || '';
  if (UI_NS.has(ns)) ui.push({ slug: k, name_ko: dict[k] });
}
ui.sort((a, b) => a.slug.localeCompare(b.slug));
fs.writeFileSync(path.join(DEV, 'data/derived/ui_glossary.json'), JSON.stringify({ rows: ui, note: '진짜 UI 문자열만(엔티티/룰 중복 배제). 화이트리스트 네임스페이스' }, null, 0) + '\n');

console.log(`✔ localize.ko.json — @Localize 참조 ${Object.keys(localize).length}키 (미해소 ${miss.length})`);
console.log(`✔ ui_glossary.json — 진짜 UI ${ui.length}행`);
if (miss.length) console.log('  미해소 샘플:', miss.slice(0, 6).join(', '));
