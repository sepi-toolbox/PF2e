// pf2e Foundry LevelDB 팩 → BASE JSON 추출 (slug 키, 임베디드 아이템 join)
// 사용: NODE_PATH=/tmp/pf2e-extract/node_modules node extract_pf2e.mjs <packName> <outFile>
import { ClassicLevel } from 'classic-level';
import fs from 'fs';
const SYS = "/Users/sepi/Library/Application Support/FoundryVTT/Data/systems/pf2e/packs";
const pack = process.argv[2], out = process.argv[3];
const db = new ClassicLevel(`${SYS}/${pack}`, { valueEncoding: 'json' });
const actors={}, itemsByActor={};
for await (const [k,v] of db.iterator()) {
  if (k.startsWith('!actors.items!')) { const aid=k.slice('!actors.items!'.length).split('.')[0]; (itemsByActor[aid]=itemsByActor[aid]||[]).push(v); }
  else if (k.startsWith('!actors!')) actors[k.slice('!actors!'.length)]=v;
}
await db.close();
const slugify = s => (s||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const seen={};
const creatures = Object.entries(actors).map(([id,a])=>{
  let slug = a.system?.details?.identification?.slug || slugify(a.name);
  if (seen[slug]) slug = `${slug}-${(seen[slug]=(seen[slug]||1)+1)}`; else seen[slug]=1;
  // 임베디드 아이템: 필요한 필드만 (slug 부여)
  const items = (itemsByActor[id]||[]).map(it=>({
    _id: it._id, type: it.type, name: it.name,
    slug: it.system?.slug || slugify(it.name),
    system: it.system
  }));
  return { id: slug, source: pack, name: a.name, type: a.type, system: a.system, items };
});
fs.writeFileSync(out, JSON.stringify(creatures));
console.log(`${pack}: ${creatures.length} actors → ${out} (${(fs.statSync(out).size/1048576).toFixed(1)}MB)`);
