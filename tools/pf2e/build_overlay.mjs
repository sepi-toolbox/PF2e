import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
const BASE = "/tmp/PF2e-publish/dev/data/base";
const KR = process.env.PF2E_KR_SRC ? process.env.PF2E_KR_SRC + "/compendium/ko" : "/Users/sepi/Library/Application Support/FoundryVTT/Data/modules/PF2e-KR/compendium/ko";
const OUT = "/tmp/PF2e-publish/dev/data/overlay";
mkdirSync(OUT, { recursive:true });

// 카테고리 → KR Babele 팩 파일들(복수 가능, 우선순위순)
const MAP = {
  equipment: ['pf2e.equipment-srd.json'],
  spells: ['pf2e.spells-srd.json','pf2e.spells.json'],
  feats: ['pf2e.feats-srd.json','pf2e.classfeatures.json','pf2e.ancestryfeatures.json','pf2e.campaign-feats.json'],
  actions: ['pf2e.actionspf2e.json','pf2e.actions.json','pf2e.adventure-specific-actions.json'],
  backgrounds: ['pf2e.backgrounds.json'],
  deities: ['pf2e.deities.json'],
  heritages: ['pf2e.heritages.json','pf2e.ancestryfeatures.json'],
  ancestries: ['pf2e.ancestries.json'],
  conditions: ['pf2e.conditionitems.json'],
  classes: ['pf2e.classes.json'],
  effects: ['pf2e.spell-effects.json','pf2e.feat-effects.json','pf2e.equipment-effects.json','pf2e.other-effects.json','pf2e.bestiary-effects.json','pf2e.campaign-effects.json','pf2e.conditionitems.json'],
};
const loadKR = files => {
  const m={};
  for(const f of files){ if(!existsSync(`${KR}/${f}`)) continue;
    const j=JSON.parse(readFileSync(`${KR}/${f}`,'utf8')); const e=j.entries||{};
    for(const k of Object.keys(e)) if(!(k in m)) m[k]=e[k];
  }
  return m;
};
const stripSuffix = n => n.replace(/\s*\((?:Greater|Major|Lesser|Minor|Moderate|True|Grand|Supreme|I|II|III|IV|V)\)\s*$/,'').trim();

let report=[];
for(const [cat,files] of Object.entries(MAP)){
  const basePath=`${BASE}/${cat}.base.json`; if(!existsSync(basePath)) continue;
  const base=JSON.parse(readFileSync(basePath,'utf8'));
  const kr=loadKR(files);
  const ovl={}; let hit=0,fb=0,miss=0;
  for(const d of base){
    const slug=(d.system&&d.system.slug)||d._id;
    let e=kr[d.name];
    if(!e){const s=stripSuffix(d.name); if(s!==d.name&&kr[s]){e=kr[s];fb++;}}
    if(e){hit++; const o={name:e.name}; if(e.description)o.description=e.description; if(e.traits)o.traits=e.traits; ovl[slug]=o;}
    else miss++;
  }
  writeFileSync(`${OUT}/${cat}.ko.json`, JSON.stringify(ovl));
  report.push([cat, base.length, hit, fb, miss]);
}
console.log('=== OVERLAY 빌드 (dev/data/overlay/) ===');
console.log('cat: base | 매칭(직접+폴백) | 폴백 | 미스 | 커버%');
for(const [c,b,h,fb,m] of report) console.log(`  ${c}: ${b} | ${h} | fb${fb} | miss${m} | ${(h/b*100).toFixed(1)}%`);
