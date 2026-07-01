#!/usr/bin/env node
/* strip_journal_links.mjs — 설명문에서 "문단 전체가 저널(@UUID JournalEntry) 링크"인 독립 문단만 제거.
 * 이유: FVTT 클래스/혈통/일부 재주 설명 끝에 붙은 `<p>[<em>]@UUID[..journals..]{자기이름}[</em>]</p>` 는
 *       Foundry에선 '전체 해설로 가는 링크'지만, 우리 앱은 저널이 없어 라벨(=엔티티 이름)만 중복 출력된다.
 * ⚠ 문단 안에 다른 텍스트가 함께 있는 인라인 저널 참조(예: "고급 연금술의 혜택을")는 건드리지 않음(의미 텍스트).
 * 실행: node tools/strip_journal_links.mjs [--apply]   (기본=dry-run)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');

// 문단 전체가 저널 링크: 선행 공백/개행 + <p>[공백][<em>] @UUID[..journals.JournalEntry..]{라벨} [</em>][공백]</p>
const RE = /\s*<p>\s*(?:<em>\s*)?@UUID\[Compendium\.pf2e\.journals\.JournalEntry\.[^\]]*\]\{[^}]*\}\s*(?:<\/em>\s*)?<\/p>/g;
const FILES = ['classes', 'ancestries', 'heritages', 'backgrounds', 'deities', 'feats', 'spells', 'effects', 'equipment', 'actions'].map(f => 'data/overlay/' + f + '.ko.json');

let total = 0; const per = {}; const samples = [];
const writes = {};
for (const p of FILES) {
  const abs = path.join(DEV, p); let s;
  try { s = fs.readFileSync(abs, 'utf8'); } catch (e) { continue; }
  let c = 0;
  const out = s.replace(RE, (m) => { c++; if (samples.length < 6) samples.push(m.replace(/\s+/g, ' ').trim().slice(0, 80)); return ''; });
  if (c) { per[p] = c; total += c; writes[p] = out; }
}

console.log('=== 문단 전체가 저널링크인 독립 문단 제거 ===');
for (const p in per) console.log(`  ${p}: ${per[p]}`);
console.log('총', total, '건');
console.log('샘플:'); samples.forEach(x => console.log('  · ' + x));

if (APPLY) {
  for (const p in writes) {
    // 제거 후 JSON 유효성 검증(파싱 실패 시 중단 — 안전)
    JSON.parse(writes[p]);
    fs.writeFileSync(path.join(DEV, p), writes[p]);
  }
  console.log('\nAPPLIED → ' + Object.keys(writes).join(', '));
} else {
  console.log('\n(dry-run) --apply 로 실제 삭제.');
}
