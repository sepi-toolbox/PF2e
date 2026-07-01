#!/usr/bin/env node
/* build_localize.mjs — @Localize 변환 사전 (PF2E.* 키 → 한글 텍스트)
 * @Localize[PF2E.NPC.Abilities.Glossary.Grab] 류 3849개가 현재 enrichDesc에서 ''로 삭제됨(내용손실).
 * PF2e-KR lang(ko.json + action-ko.json + re-ko.json)에 해당 키의 한글이 존재 → 평탄 사전으로 추출.
 * 산출: data/derived/localize.ko.json = { "PF2E.xxx": "한글" }
 * 실행: cd dev && node tools/derive/build_localize.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const KR = '/tmp/PF2e-KR/lang';
const load = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return {}; } };

function flatten(o, prefix, out) {
  for (const k in o) {
    const v = o[k], key = prefix ? prefix + '.' + k : k;
    if (typeof v === 'string') out[key] = v;
    else if (v && typeof v === 'object') flatten(v, key, out);
  }
}
const dict = {};
for (const f of ['ko.json', 'action-ko.json', 're-ko.json']) flatten(load(path.join(KR, f)), '', dict);

// @Localize가 실제 참조하는 키만이 아니라 전체 PF2E.* 유지(UI 문자열 사전으로도 유용)
const outPath = path.join(DEV, 'data', 'derived', 'localize.ko.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(dict, null, 0) + '\n');

// 실제 @Localize 참조 키 커버리지 측정
const refs = new Set();
function scan(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { scan(p); continue; }
    if (!f.endsWith('.json')) continue;
    const s = fs.readFileSync(p, 'utf8');
    for (const m of s.matchAll(/@Localize\[([^\]]+)\]/g)) refs.add(m[1]);
  }
}
scan(path.join(DEV, 'data', 'base')); scan(path.join(DEV, 'data', 'creatures'));
const covered = [...refs].filter(k => dict[k]).length;
console.log(`✔ localize.ko.json — ${Object.keys(dict).length} 키`);
console.log(`  @Localize 참조 키 ${refs.size}종 중 ${covered} 해소 (${(covered / refs.size * 100).toFixed(0)}%)`);
console.log('  미해소 샘플:', [...refs].filter(k => !dict[k]).slice(0, 8).join(', ') || '없음');
