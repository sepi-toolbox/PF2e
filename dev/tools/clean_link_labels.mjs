// @link[cat.slug]{label} 정리: 이름 라벨 제거(렌더러가 정본명 사용) → @link[cat.slug]. 값(뒤 숫자)만 {N}으로 유지.
// 사용: node tools/clean_link_labels.mjs [--apply]
import fs from 'fs'; import path from 'path';
const DEV=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const OVL=path.join(DEV,'data/overlay');
const files=fs.readdirSync(OVL).filter(f=>f.endsWith('.ko.json'));
const APPLY=process.argv.includes('--apply');
const re=/@link\[([a-z]+)\.([a-z0-9._-]+)\]\{([^}]*)\}/g;
let dropped=0, keptVal=0; const samples=[];
const tf=s=>s.replace(re,(m,cat,slug,label)=>{ const num=label.match(/([0-9]+)\s*$/); if(num){ keptVal++; return `@link[${cat}.${slug}]{${num[1]}}`; } dropped++; if(samples.length<8)samples.push(m+' → @link['+cat+'.'+slug+']'); return `@link[${cat}.${slug}]`; });
for(const f of files){ const fp=path.join(OVL,f); const raw=fs.readFileSync(fp,'utf8'); let j=JSON.parse(raw); let ch=false;
  const im=raw.match(/^\{\r?\n( *)"/); const indent=im?im[1].length:0;
  const walk=o=>{ if(o==null)return o; if(typeof o==='string'){ const a=tf(o); if(a!==o)ch=true; return a; } if(Array.isArray(o))return o.map(walk); if(typeof o==='object'){for(const k in o)o[k]=walk(o[k]);return o;} return o; };
  j=walk(j); if(ch&&APPLY)fs.writeFileSync(fp,JSON.stringify(j,null,indent)+(raw.endsWith('\n')?'\n':''));
}
console.log('이름라벨 제거:',dropped,'| 값라벨 유지({N}):',keptVal, APPLY?'[APPLIED]':'[DRY-RUN]');
samples.forEach(s=>console.log('  ',s));
