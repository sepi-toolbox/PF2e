import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
const LANG = "/Users/sepi/Library/Application Support/FoundryVTT/Data/modules/PF2e-KR/lang";
const OUT = "/tmp/PF2e-publish/dev/data/overlay";
mkdirSync(OUT, { recursive:true });
const all = {};
const flat = (o, p='') => { for (const k in o){ const v=o[k], np=p?p+'.'+k:k; if(v&&typeof v==='object') flat(v,np); else all[np]=v; } };
for (const f of readdirSync(LANG).filter(f=>f.endsWith('.json'))) { try { flat(JSON.parse(readFileSync(`${LANG}/${f}`,'utf8'))); } catch(e){} }

// camelCase 키조각 → kebab slug. "TwoHandD8"→"two-hand-d8", "VersatileP"→"versatile-p"
const kebab = s => s.replace(/([a-z])([A-Z0-9])/g,'$1-$2').replace(/([0-9])([A-Z])/g,'$1-$2').toLowerCase();
const out = { traits:{}, rarity:{}, damageType:{}, weaponCategory:{}, weaponGroup:{}, armorCategory:{}, armorGroup:{}, size:{}, actionType:{} };
const PREFIX = {
  'PF2E.Trait': 'traits', 'PF2E.Rarity': 'rarity', 'PF2E.Damage.RollFlavor.': 'damageType',
  'PF2E.WeaponCategory': 'weaponCategory', 'PF2E.WeaponGroup': 'weaponGroup',
  'PF2E.ArmorType': 'armorCategory', 'PF2E.ArmorGroup': 'armorGroup', 'PF2E.ActorSize': 'size',
};
for (const [k,v] of Object.entries(all)) {
  for (const [pre,bucket] of Object.entries(PREFIX)) {
    if (k.startsWith(pre) && typeof v==='string') {
      let tail = k.slice(pre.length);
      if (!tail || /[.]/.test(tail)) continue;
      out[bucket][kebab(tail)] = v;
    }
  }
}
// 추가 피해유형(PF2E.TraitX와 별도로 흔히 쓰는 슬러그)
for (const dt of ['slashing','piercing','bludgeoning','fire','cold','acid','electricity','sonic','force','mental','poison','vitality','void','spirit','untyped','bleed','precision']) {
  const cap = dt[0].toUpperCase()+dt.slice(1);
  if (all['PF2E.Trait'+cap]) out.damageType[dt] = all['PF2E.Trait'+cap];
}
writeFileSync(`${OUT}/_lang.ko.json`, JSON.stringify(out));
console.log('lang overlay 작성: _lang.ko.json');
for (const b of Object.keys(out)) console.log(`  ${b}: ${Object.keys(out[b]).length}`);
console.log('샘플 traits:', JSON.stringify({agile:out.traits.agile,'two-hand-d8':out.traits['two-hand-d8'],'versatile-p':out.traits['versatile-p'],reach:out.traits.reach}));
