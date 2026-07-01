#!/usr/bin/env node
/* build_system_terms.mjs — 시스템 용어/config 열거형을 하나의 통합 테이블로
 * (skill/sense/ability/save/damage_type/weapon_group/armor_group/size/rarity/language 등 — 소량·산발 → 통합)
 * 컬럼: type(유형) · slug · name_en · name_ko · desc · ref(부가: 기술의 핵심능력치 등)
 * 소스: _glossary.ko.json + _lang.ko.json + PF2e-KR ko.json + _trait_desc(설명)
 * 산출: data/derived/system_terms.json  (조건은 별도 conditions 엔티티 유지)
 * 실행: cd dev && node tools/derive/build_system_terms.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const load = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return {}; } };
const gloss = load(path.join(DEV, 'data/creatures/_glossary.ko.json'));
const lang = load(path.join(DEV, 'data/overlay/_lang.ko.json'));
const kr = load('/tmp/PF2e-KR/lang/ko.json');
const tdesc = load(path.join(DEV, 'data/creatures/_trait_desc.ko.json'));
const prettify = s => String(s).split(/[-_]/).map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(' ');
const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const descIdx = {}; for (const k in tdesc) descIdx[norm(k)] = tdesc[k];

// PF2e-KR 평탄화 (언어 + 설명 조회용)
const krFlat = {};
(function walk(o, p) { for (const k in o) { const v = o[k], key = p ? p + '.' + k : k; if (typeof v === 'string') krFlat[key] = v; else if (v && typeof v === 'object') walk(v, key); } })(kr, '');
const krDesc = (needles) => { for (const n of needles) if (krFlat[n]) return krFlat[n]; return ''; };

const SKILL_ABILITY = { acrobatics: 'dex', arcana: 'int', athletics: 'str', crafting: 'int', deception: 'cha', diplomacy: 'cha', intimidation: 'cha', medicine: 'wis', nature: 'wis', occultism: 'int', performance: 'cha', religion: 'wis', society: 'int', stealth: 'dex', survival: 'wis', thievery: 'dex' };

const rows = [];
function add(type, map, opts = {}) {
  for (const [slug, ko] of Object.entries(map || {})) {
    if (slug === 'label') continue;
    const desc = descIdx[norm(slug)] || (opts.krDesc ? krDesc(opts.krDesc(slug)) : '') || '';
    rows.push({ type, slug, name_en: prettify(slug), name_ko: ko, desc, ref: opts.ref ? opts.ref(slug) : '' });
  }
}
add('skill', gloss.skill, { ref: s => SKILL_ABILITY[s] || '', krDesc: s => [`PF2E.Skill.${prettify(s)}.Description`] });
add('sense', gloss.sense, { krDesc: s => [`PF2E.Actor.Creature.Sense.Type.${prettify(s).replace(/ /g, '')}`] });
add('ability', gloss.ability);
add('save', gloss.save);
add('damage_type', lang.damageType);
add('weapon_group', lang.weaponGroup);
add('armor_group', lang.armorGroup);
add('armor_category', lang.armorCategory);
add('size', lang.size);
add('weapon_category', { unarmed: '비무장', simple: '단순', martial: '군용', advanced: '고급' });
add('rarity', { common: '일반', uncommon: '비일반', rare: '희귀', unique: '고유' });

// 언어 (PF2e-KR PF2E.*.Language.<slug>)
const seen = new Set();
for (const key in krFlat) {
  const m = key.match(/\.Language\.([a-z][a-z0-9-]*)$/);
  if (!m) continue; const slug = m[1];
  if (['label', 'plural'].includes(slug) || seen.has(slug)) continue;
  seen.add(slug);
  rows.push({ type: 'language', slug, name_en: prettify(slug), name_ko: krFlat[key], desc: '', ref: '' });
}

rows.sort((a, b) => a.type.localeCompare(b.type) || a.slug.localeCompare(b.slug));
const withDesc = rows.filter(r => r.desc).length;
const outPath = path.join(DEV, 'data', 'derived', 'system_terms.json');
fs.writeFileSync(outPath, JSON.stringify({ rows, note: '시스템 용어 통합 (유형·이름·설명). 조건은 별도 conditions 엔티티' }, null, 0) + '\n');
const byType = {}; for (const r of rows) byType[r.type] = (byType[r.type] || 0) + 1;
console.log(`✔ system_terms.json — ${rows.length}행 (설명 ${withDesc})`);
console.log('  유형별:', JSON.stringify(byType));
