#!/usr/bin/env node
/* build_creatures.mjs — 크리처 데이터 테이블군 파생 (FVTT bestiary/npc 팩)
 * 소스: data/creatures/<pack>.base.json (npc 액터) + <pack>.ko.json (한글 overlay: name/description/items 번역)
 * 산출:
 *   creatures.json        — 크리처 본체 (팩·level·type·size·AC·HP·saves·speed·traits)
 *   creature_strikes.json — 공격 flatten (크리처×melee/weapon: bonus·damage·traits)
 *   creature_abilities.json — 능력 flatten (크리처×action: actions·category)
 * 실행: cd dev && node tools/derive/build_creatures.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');
const CDIR = path.join(DEV, 'data', 'creatures');
const PACKS = ['monster-core', 'monster-core-2', 'bestiary', 'bestiary-2', 'bestiary-3', 'npc-core', 'npc-gallery'];
const load = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };

const creatures = [], strikes = [], abilities = [], hazards = [];

// 임베디드 공격(melee/weapon)·능력(action) flatten (크리처·해저드 공용)
function flattenItems(entity, nameKo, pack, itemsKo) {
  for (const it of (entity.items || [])) {
    const isys = it.system || {};
    const itKo = itemsKo[it.name] || {};
    if (it.type === 'melee' || it.type === 'weapon') {
      const dmg = Object.values(isys.damageRolls || {}).map(d => `${d.damage} ${d.damageType}`).join(' + ');
      strikes.push({
        owner: entity.name, owner_ko: nameKo, pack, strike: it.name, strike_ko: itKo.name || '',
        type: it.type === 'melee' ? (isys.weaponType?.value || 'melee') : 'weapon',
        bonus: isys.bonus?.value ?? '', damage: dmg, traits: (isys.traits?.value || []).join(', '),
      });
    } else if (it.type === 'action') {
      abilities.push({
        owner: entity.name, owner_ko: nameKo, pack, ability: it.name, ability_ko: itKo.name || '',
        actions: isys.actions?.value ?? (isys.actionType?.value || ''),
        category: isys.category || '', traits: (isys.traits?.value || []).join(', '),
      });
    }
  }
}

for (const pack of PACKS) {
  const base = load(path.join(CDIR, `${pack}.base.json`));
  const ovl = load(path.join(CDIR, `${pack}.ko.json`)) || {};
  if (!base) continue;
  const arr = Array.isArray(base) ? base : Object.values(base);
  // overlay: babele 형식 {entries:{name:{name, items:{...}}}} 또는 {name:{...}}
  const ovlEntries = ovl.entries || ovl;
  for (const c of arr) {
    const s = c.system || {};
    const nameKo = (ovlEntries[c.name] || {}).name || '';
    const lvl = s.details?.level?.value;
    const traits = s.traits?.value || [];
    creatures.push({
      pack, id: c.id || c._id, name_en: c.name, name_ko: nameKo,
      level: lvl == null ? '' : lvl,
      size: s.traits?.size?.value || '', rarity: s.traits?.rarity || '',
      ac: s.attributes?.ac?.value ?? '', hp: s.attributes?.hp?.max ?? s.attributes?.hp?.value ?? '',
      fort: s.saves?.fortitude?.value ?? '', ref: s.saves?.reflex?.value ?? '', will: s.saves?.will?.value ?? '',
      perception: s.perception?.mod ?? s.attributes?.perception?.value ?? '',
      traits: traits.join(', '),
      n_strikes: (c.items || []).filter(i => i.type === 'melee' || i.type === 'weapon').length,
      n_abilities: (c.items || []).filter(i => i.type === 'action').length,
      n_spells: (c.items || []).filter(i => i.type === 'spell').length,
    });
    flattenItems(c, nameKo, pack, (ovlEntries[c.name] || {}).items || {});
  }
}

// ── 해저드 (함정/위험) ──
const hbase = load(path.join(CDIR, 'hazards.base.json'));
if (hbase) {
  const hovl = load(path.join(CDIR, 'hazards.ko.json')) || {};
  const hovlE = hovl.entries || hovl;
  const harr = Array.isArray(hbase) ? hbase : Object.values(hbase);
  for (const h of harr) {
    const s = h.system || {};
    const nameKo = (hovlE[h.name] || {}).name || '';
    hazards.push({
      pack: 'hazards', id: h.id || h._id, name_en: h.name, name_ko: nameKo,
      level: s.details?.level?.value ?? '', complex: s.details?.isComplex ? '✓' : '',
      ac: s.attributes?.ac?.value ?? '', hardness: s.attributes?.hardness?.value ?? '',
      hp: s.attributes?.hp?.max ?? s.attributes?.hp?.value ?? '', stealth: s.attributes?.stealth?.value ?? '',
      fort: s.saves?.fortitude?.value ?? '', ref: s.saves?.reflex?.value ?? '', will: s.saves?.will?.value ?? '',
      traits: (s.traits?.value || []).join(', '),
      n_strikes: (h.items || []).filter(i => i.type === 'melee' || i.type === 'weapon').length,
      n_abilities: (h.items || []).filter(i => i.type === 'action').length,
    });
    flattenItems(h, nameKo, 'hazards', (hovlE[h.name] || {}).items || {});
  }
}

function write(name, rows, note) {
  fs.writeFileSync(path.join(DEV, 'data', 'derived', name), JSON.stringify({ rows, note }, null, 0) + '\n');
}
write('creatures.json', creatures, 'FVTT bestiary/npc 팩 크리처 본체');
write('hazards.json', hazards, 'FVTT 해저드 (함정/위험) 본체');
write('creature_strikes.json', strikes, '크리처·해저드 공격 flatten (melee/weapon)');
write('creature_abilities.json', abilities, '크리처·해저드 능력 flatten (action)');
console.log(`✔ creatures ${creatures.length}, hazards ${hazards.length}, strikes ${strikes.length}, abilities ${abilities.length}`);
console.log(`  한글명 커버: 크리처 ${(creatures.filter(c => c.name_ko).length / creatures.length * 100).toFixed(0)}%`);
// 샘플
const g = creatures.find(c => c.name_ko && c.level == 1) || creatures[0];
console.log('  샘플:', JSON.stringify(g));
