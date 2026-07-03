// @UUID/@Embed(콘텐츠 엔티티 참조) → @link[cat.slug]{label}. effects/외부참조는 @UUID 유지.
// 사용: node tools/bake_entity_links.mjs [--apply]
import fs from 'fs'; import path from 'path';
const DEV=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const require=(await import('module')).createRequire(import.meta.url);
const PF=require(path.join(DEV,'cs_pf2e.js'));
for(const c of PF.CATEGORIES){ try{PF.loadCategorySync(c);}catch(e){} }
const APPLY=process.argv.includes('--apply');
const OVL=path.join(DEV,'data/overlay');
const files=fs.readdirSync(OVL).filter(f=>f.endsWith('.ko.json'));
const cU=s=>(s.match(/@UUID\[|@Embed\[/g)||[]).length, cL=s=>(s.match(/@link\[/g)||[]).length;
let changed=0, uBefore=0, linkAfter=0, uAfter=0; const samples=[];
for(const f of files){ const fp=path.join(OVL,f); const raw=fs.readFileSync(fp,'utf8'); let j=JSON.parse(raw); let ch=false;
  const im=raw.match(/^\{\r?\n( *)"/); const indent=im?im[1].length:0;
  const walk=(o)=>{ if(o==null)return o;
    if(typeof o==='string'){ const b=o,a=PF.bakeEntityLinks(o); if(a!==b){ changed++; uBefore+=cU(b); linkAfter+=cL(a); uAfter+=cU(a); if(samples.length<14&&/@UUID|@Embed/.test(b))samples.push({f,b,a}); ch=true; } return a; }
    if(Array.isArray(o))return o.map(walk);
    if(typeof o==='object'){ for(const k in o)o[k]=walk(o[k]); return o; } return o; };
  j=walk(j);
  if(ch&&APPLY) fs.writeFileSync(fp, JSON.stringify(j,null,indent)+(raw.endsWith('\n')?'\n':''));
}
// 전체 잔여 @UUID(변환 안 된, 모든 문자열 포함) 재집계
let remainU=0; for(const f of files){ remainU += (fs.readFileSync(path.join(OVL,f),'utf8').match(/@UUID\[|@Embed\[/g)||[]).length; }
console.log('변경 문자열:',changed,'| @UUID/@Embed(변경분 before):',uBefore,'→ @link:',linkAfter,'| 변경분 잔여@UUID:',uAfter, APPLY?'[APPLIED]':'[DRY-RUN]');
console.log('현재 파일상 총 @UUID/@Embed(변환 후 예상 잔여=effects/외부):', APPLY?remainU:'(dry-run이라 미반영)');
console.log('=== 샘플 ===');
for(const s of samples.slice(0,10)){ console.log('▷['+s.f+']'); console.log(' 전:',s.b.replace(/\s+/g,' ').slice(0,180)); console.log(' 후:',s.a.replace(/\s+/g,' ').slice(0,180)); }
