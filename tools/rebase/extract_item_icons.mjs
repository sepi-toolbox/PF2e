// pathfinder-* 베스티어리 팩에서 임베디드 아이템 _id→img 사이드카 추출 (읽기 전용)
import { ClassicLevel } from "classic-level";
import fs from "fs";
const SYS="/Users/sepi/Library/Application Support/FoundryVTT/Data/systems/pf2e/packs";
const PACKS=["pathfinder-monster-core","pathfinder-monster-core-2","pathfinder-npc-core",
  "pathfinder-bestiary","pathfinder-bestiary-2","pathfinder-bestiary-3","hazards","npc-gallery"];
const out={}; let n=0;
for(const p of PACKS){
  const db=new ClassicLevel(`${SYS}/${p}`,{valueEncoding:"json",createIfMissing:false});
  let c=0;
  for await (const [k,v] of db.iterator()){
    if(k.startsWith("!actors.items!")){ if(v && v._id && v.img){ out[v._id]=v.img; c++; n++; } }
  }
  await db.close();
  console.log(`${p}: ${c} items`);
}
const dst="/tmp/PF2e-publish/dev/data/creatures/_item_icons.json";
fs.writeFileSync(dst, JSON.stringify(out));
console.log(`\n총 ${n} 아이템, distinct _id ${Object.keys(out).length} → ${dst} (${(fs.statSync(dst).size/1024).toFixed(0)}KB)`);
// distinct img 통계
const imgs=new Set(Object.values(out));
console.log("distinct img:", imgs.size);
