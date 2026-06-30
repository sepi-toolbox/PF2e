// PF2e-KR PF2E.TraitDescription*(한글 정본) → TRAIT_DB 보강.
import fs from 'fs';
const ROOT='/tmp/PF2e-publish';
const lang=JSON.parse(fs.readFileSync(ROOT+'/dev/data/overlay/_lang.ko.json','utf8')).traits;
const kr=JSON.parse(fs.readFileSync('/tmp/PF2e-KR/lang/ko.json','utf8'));
function walk(o,pre,out){ if(o&&typeof o==='object'&&!Array.isArray(o)){for(const k in o)walk(o[k],pre?pre+'.'+k:k,out);} else out[pre]=o; }
const flat={}; walk(kr,'',flat);
const desc={}; for(const k in flat) if(k.startsWith('PF2E.TraitDescription')) desc[k.replace('PF2E.TraitDescription','')]=flat[k];
const key=s=>s.split(/[-_]/).map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join('');
const SKILL={crafting:'제작',flat:'평탄'};
function clean(s){
  s=s.replace(/@Check\[([^\]]*)\]/g,(m,inner)=>{
    const o={}; inner.split('|').forEach(p=>{const i=p.indexOf(':');if(i>0)o[p.slice(0,i).trim()]=p.slice(i+1).trim();});
    const t=SKILL[o.type]||o.type||''; return (t?t+' ':'')+(o.dc?'DC '+o.dc:'').trim();
  });
  s=s.replace(/<\/(p|li|ul)>/g,' ').replace(/<[^>]+>/g,'');   // 블록태그→공백, 나머지 태그 제거
  s=s.replace(/\s+/g,' ').trim();
  return s;
}
const src=fs.readFileSync(ROOT+'/dev/cs_data.js','utf8');
const m=src.match(/const TRAIT_DB = (\[[\s\S]*?\n\]);/);
const tdb=JSON.parse(m[1]);
const have=new Set(); for(const t of tdb){have.add(t.id);if(t.name_ko)have.add(t.name_ko);if(t.name_en)have.add(t.name_en);}
const add=[];
for(const [slug,ko] of Object.entries(lang)){
  const d=desc[key(slug)]; if(!d) continue;
  if(have.has(slug)||have.has(ko)) continue;
  add.push({ id: slug, name_ko: ko, name_en: slug, type: 'mechanic', desc: clean(d) });
}
add.sort((a,b)=>a.id<b.id?-1:1);
const UP={arcane:'아케인',divine:'디바인',occult:'오컬트',primal:'원시의'};
const upgrades=[];
for(const [slug,ko] of Object.entries(UP)){ const d=desc[key(slug)]; if(d) upgrades.push({slug,name_ko:ko,desc:clean(d)}); }
fs.writeFileSync(ROOT+'/tools/_trait_desc_new.json', JSON.stringify({add,upgrades},null,2));
console.log('NEW:',add.length,' UPGRADE:',upgrades.length);
const dirty=add.concat(upgrades.map(u=>({id:u.slug,desc:u.desc}))).filter(x=>/[<>@]|\[\[/.test(x.desc));
console.log('잔여 마크업:',dirty.length, dirty.map(x=>x.id));
