#!/usr/bin/env node
/* build_familiars.mjs — 사역마(패밀리어) 능력 데이터 테이블
 * 소스: PF2e-KR compendium en/ko pf2e.familiar-abilities.json (babele, 영문명 키 → {name(ko), description, traits})
 * 산출: data/derived/familiar_abilities.json (rows: slug/name_en/name_ko/traits/desc_ko)
 * (에이돌론=feats summoner-eidolon 태그→subclasses 테이블 / 동물동료=FVTT 컴펜디움 statblock 없음)
 * 실행: cd dev && node tools/derive/build_familiars.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const load = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return {}; } };
const ko = load('/tmp/PF2e-KR/compendium/ko/pf2e.familiar-abilities.json');
const en = load('/tmp/PF2e-KR/compendium/en/pf2e.familiar-abilities.json');
const eko = ko.entries || ko, een = en.entries || en;
const slugify = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const rows = [];
for (const nameEn of Object.keys(een)) {
  const k = eko[nameEn] || {}, e = een[nameEn] || {};
  const traits = (k.traits || e.traits || (e.system && e.system.traits && e.system.traits.value) || []);
  rows.push({
    slug: slugify(nameEn), name_en: nameEn, name_ko: k.name || '',
    traits: Array.isArray(traits) ? traits.join(', ') : '',
    desc_ko: (k.description || '').replace(/\s+/g, ' ').trim(),
  });
}
rows.sort((a, b) => a.name_en.localeCompare(b.name_en));
fs.writeFileSync(path.join(DEV, 'data/derived/familiar_abilities.json'), JSON.stringify({ rows, note: '사역마(패밀리어) 능력 — PF2e-KR familiar-abilities 팩' }, null, 0) + '\n');
console.log(`✔ familiar_abilities.json — ${rows.length} (한글 ${rows.filter(r => r.name_ko).length})`);
