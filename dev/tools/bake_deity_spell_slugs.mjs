#!/usr/bin/env node
/* bake_deity_spell_slugs.mjs — 신격 주문(Cleric Spells) UUID → 슬러그 베이크
 * 신격 system.spells = {랭크: Compendium UUID} → 사람이 읽고 런타임이 쓰는 system.spells_slug = {랭크: slug} 병기.
 *   규칙: 신격 주문은 그 신격을 섬기는 클레릭의 주문 목록에 해당 랭크부터 추가됨.
 *   UUID→slug = spells.json _id 인덱스(현재 100% 해소). 원본 UUID(system.spells)는 보존(출처).
 * 산출: data/store/deities.json 제자리 수정(materialized store — name_ko/_desc_ko와 동일 관리).
 * 실행: cd dev && node tools/bake_deity_spell_slugs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..');
const load = f => JSON.parse(fs.readFileSync(f, 'utf8'));

const spells = load(path.join(DEV, 'data/store/spells.json'));
const sarr = Array.isArray(spells) ? spells : Object.values(spells);
const BY_ID = new Map();
for (const s of sarr) { if (s._id) BY_ID.set(s._id, s.system && s.system.slug); }

const dpath = path.join(DEV, 'data/store/deities.json');
const deities = load(dpath);
const darr = Array.isArray(deities) ? deities : Object.values(deities);

let total = 0, resolved = 0, touched = 0;
const unresolved = [];
for (const d of darr) {
  const sp = d.system && d.system.spells;
  if (!sp || typeof sp !== 'object' || !Object.keys(sp).length) { if (d.system) delete d.system.spells_slug; continue; }
  const map = {};
  for (const [rank, uuid] of Object.entries(sp)) {
    total++;
    const id = String(uuid).split('.').pop();
    const slug = BY_ID.get(id);
    if (slug) { map[rank] = slug; resolved++; }
    else { map[rank] = null; unresolved.push(`${d.system.slug}@${rank}=${uuid}`); }
  }
  d.system.spells_slug = map;
  touched++;
}

fs.writeFileSync(dpath, JSON.stringify(deities)); // store는 minified 단일 라인(포맷 보존)
console.log(`✅ deities.json: ${touched}개 신격에 spells_slug 베이크 (주문 ${resolved}/${total} 해소)`);
if (unresolved.length) console.log('  ⚠ 미해소:', unresolved.slice(0, 10).join(', '), unresolved.length > 10 ? `외 ${unresolved.length - 10}` : '');
