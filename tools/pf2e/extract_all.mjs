import { ClassicLevel } from 'classic-level';
import { readdirSync, statSync, mkdirSync, writeFileSync } from 'fs';
const PACKS = "/Users/sepi/Library/Application Support/FoundryVTT/Data/systems/pf2e/packs";
const OUT = "/tmp/PF2e-publish/dev/data/base";
mkdirSync(OUT, { recursive:true });
const packs = readdirSync(PACKS).filter(p => { try { return statSync(`${PACKS}/${p}`).isDirectory(); } catch { return false; } });
const isTopLevel = k => /^![a-z]+![A-Za-z0-9]+$/.test(k);

// type → 출력 카테고리. 크리처(npc/hazard/vehicle/army/familiar/character)는 이번 단계 제외(별도 처리).
const ROUTE = {
  spell:'spells', feat:'feats', campaignFeature:'feats',
  weapon:'equipment', armor:'equipment', shield:'equipment', equipment:'equipment',
  consumable:'equipment', treasure:'equipment', ammo:'equipment', backpack:'equipment', kit:'equipment',
  ancestry:'ancestries', heritage:'heritages', background:'backgrounds', class:'classes', deity:'deities',
  action:'actions', condition:'conditions', effect:'effects',
};
const DROP = new Set(['ownership','sort','_stats','folder']);
const clean = d => { const o={}; for(const k of Object.keys(d)) if(!DROP.has(k)) o[k]=d[k]; return o; };

const buckets = {};   // category → []
const seen = {};      // category → Set(id) 중복방지(팩 간 동일 slug)
const skip = {};
for (const p of packs) {
  const db = new ClassicLevel(`${PACKS}/${p}`, { keyEncoding:'utf8', valueEncoding:'json' });
  for await (const [k,v] of db.iterator()) {
    if (!isTopLevel(k)) continue;
    const t = v && v.type;
    const cat = ROUTE[t];
    if (!cat) { skip[t]=(skip[t]||0)+1; continue; }
    const slug = (v.system && v.system.slug) || null;
    const key = slug || v._id;
    if(!buckets[cat]){buckets[cat]=[];seen[cat]=new Set();}
    if(seen[cat].has(key)) continue;          // 동일 slug 첫 등장만
    seen[cat].add(key);
    const doc = clean(v);
    doc._pack = p;
    buckets[cat].push(doc);
  }
  await db.close();
}
const sizes=[];
for (const [cat,arr] of Object.entries(buckets)) {
  const path = `${OUT}/${cat}.base.json`;
  writeFileSync(path, JSON.stringify(arr));
  const mb = (statSync(path).size/1048576).toFixed(1);
  sizes.push([cat, arr.length, mb]);
}
sizes.sort((a,b)=>b[1]-a[1]);
console.log("=== BASE 추출 완료 (dev/data/base/) ===");
for (const [c,n,mb] of sizes) console.log(`  ${c}.base.json : ${n}개  (${mb}MB)`);
console.log("\n제외된 타입:", JSON.stringify(skip));
