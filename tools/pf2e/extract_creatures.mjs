import { ClassicLevel } from 'classic-level';
import { readdirSync, statSync, mkdirSync, writeFileSync } from 'fs';
const PACKS = "/Users/sepi/Library/Application Support/FoundryVTT/Data/systems/pf2e/packs";
const OUT = "/tmp/PF2e-publish/dev/data/base/creatures";
mkdirSync(OUT, { recursive:true });
const packs = readdirSync(PACKS).filter(p => { try { return statSync(`${PACKS}/${p}`).isDirectory(); } catch { return false; } });
// 크리처/위험요소 타입
const CREATURE_TYPES = new Set(['npc','hazard','vehicle','army','familiar']);
const isActor = k => /^!actors![A-Za-z0-9]+$/.test(k);
const isEmbedded = k => k.startsWith('!actors.items!');
const DROP = new Set(['ownership','sort','_stats','folder']);
const clean = d => { const o={}; for(const k of Object.keys(d)) if(!DROP.has(k)) o[k]=d[k]; return o; };

let grandActors=0, grandSize=0;
const index=[]; // 슬림 인덱스 (브라우징용)
const byType={};
for (const p of packs) {
  const db = new ClassicLevel(`${PACKS}/${p}`, { keyEncoding:'utf8', valueEncoding:'json' });
  // embedded items 먼저 수집 (actorId → [items])
  const emb={};
  const actors=[];
  for await (const [k,v] of db.iterator()) {
    if (isActor(k)) { if(v&&CREATURE_TYPES.has(v.type)) actors.push(v); }
    else if (isEmbedded(k)) {
      const aid = k.split('!')[2].split('.')[0];
      (emb[aid]=emb[aid]||[]).push(v);
    }
  }
  await db.close();
  if(!actors.length) continue;
  const out=[];
  for(const a of actors){
    const doc=clean(a);
    if(!doc.items||!doc.items.length){ if(emb[a._id]) doc.items=emb[a._id].map(clean); }
    out.push(doc);
    byType[a.type]=(byType[a.type]||0)+1;
    const sys=a.system||{};
    index.push({id:(sys.details&&0,(a.system&&a.system.slug)||a._id),name:a.name,type:a.type,pack:p,
      level:sys.details&&sys.details.level&&sys.details.level.value,
      size:sys.traits&&sys.traits.size&&sys.traits.size.value,
      traits:(sys.traits&&sys.traits.value)||[]});
  }
  const path=`${OUT}/${p}.json`;
  writeFileSync(path, JSON.stringify(out));
  const sz=statSync(path).size; grandSize+=sz; grandActors+=out.length;
}
writeFileSync(`${OUT}/_index.json`, JSON.stringify(index));
console.log('=== 크리처 BASE 추출 완료 ===');
console.log('총 액터:', grandActors, '| 총 용량:', (grandSize/1048576).toFixed(1),'MB');
console.log('타입별:', JSON.stringify(byType));
console.log('인덱스 항목:', index.length, '(_index.json,', (statSync(`${OUT}/_index.json`).size/1048576).toFixed(2),'MB)');
