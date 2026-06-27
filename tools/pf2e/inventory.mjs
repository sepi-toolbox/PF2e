import { ClassicLevel } from 'classic-level';
import { readdirSync, statSync } from 'fs';
const PACKS = "/Users/sepi/Library/Application Support/FoundryVTT/Data/systems/pf2e/packs";
const packs = readdirSync(PACKS).filter(p => { try { return statSync(`${PACKS}/${p}`).isDirectory(); } catch { return false; } });

// top-level doc key: !collection!id  (단일 ! 쌍, 내부 . 없는 collection)
const isTopLevel = k => /^![a-z]+![A-Za-z0-9]+$/.test(k);

const byType = {};        // system item type → count
const byCollection = {};  // pack collection (items/actors/...) → count
const bestiaryActors = []; // npc/hazard 등
let totalTop = 0;

for (const p of packs) {
  const db = new ClassicLevel(`${PACKS}/${p}`, { keyEncoding:'utf8', valueEncoding:'json' });
  try {
    for await (const [k,v] of db.iterator()) {
      if (!isTopLevel(k)) continue;
      totalTop++;
      const coll = k.split('!')[1];
      byCollection[coll] = (byCollection[coll]||0)+1;
      const t = (v && v.type) || 'unknown';
      byType[t] = (byType[t]||0)+1;
    }
  } catch(e){ console.error('ERR', p, e.message); }
  await db.close();
}
const sort = o => Object.entries(o).sort((a,b)=>b[1]-a[1]);
console.log("=== 전체 top-level 문서:", totalTop, "===");
console.log("\n--- 컬렉션별 ---");
for (const [k,n] of sort(byCollection)) console.log(`  ${k}: ${n}`);
console.log("\n--- system.type 별 (이식 단위) ---");
for (const [k,n] of sort(byType)) console.log(`  ${k}: ${n}`);
