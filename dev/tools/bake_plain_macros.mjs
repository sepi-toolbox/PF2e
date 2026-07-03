// 비-엔티티 매크로(@Check/@Damage/@Template/[[…]])를 한글 평문으로 굽는다(overlay). @UUID/@Embed는 유지(→@link 단계).
// 사용: node tools/bake_plain_macros.mjs [--apply]   (기본 dry-run)
import fs from 'fs'; import path from 'path';
const DEV=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const require=(await import('module')).createRequire(import.meta.url);
const PF=require(path.join(DEV,'cs_pf2e.js'));
for(const c of PF.CATEGORIES){ try{PF.loadCategorySync(c);}catch(e){} }
const APPLY=process.argv.includes('--apply');
const OVL=path.join(DEV,'data/overlay');
const files=fs.readdirSync(OVL).filter(f=>f.endsWith('.ko.json'));
const countMac=s=>((s.match(/@Check\[|@Damage\[|@Template\[/g)||[]).length + (s.match(/\[\[\s*\/[a-z]/g)||[]).length);
let totalChanged=0, before=0, after=0; const samples=[];
for(const f of files){
  const fp=path.join(OVL,f); const raw=fs.readFileSync(fp,'utf8'); let j=JSON.parse(raw); let changed=false;
  const im=raw.match(/^\{\r?\n( *)"/); const indent=im?im[1].length:0;   // 원본 들여쓰기 보존
  const walk=(o)=>{ if(o==null)return o;
    if(typeof o==='string'){ const b=o, a=PF.bakePlainMacros(o); if(a!==b){ totalChanged++; before+=countMac(b); after+=countMac(a); if(samples.length<18 && /@Check|@Damage|@Template|\[\[\s*\//.test(b)) samples.push({f,b,a}); changed=true; } return a; }
    if(Array.isArray(o)) return o.map(walk);
    if(typeof o==='object'){ for(const k in o)o[k]=walk(o[k]); return o; } return o; };
  j=walk(j);
  if(changed && APPLY) fs.writeFileSync(fp, JSON.stringify(j,null,indent)+(raw.endsWith('\n')?'\n':''));
}
console.log('변경 문자열:',totalChanged,'| 매크로 before:',before,'| 잔여 after:',after, APPLY?'[APPLIED]':'[DRY-RUN]');
console.log('=== 샘플 (전→후) ===');
for(const s of samples.slice(0,14)){ console.log('▷ ['+s.f+']'); console.log('  전:',s.b.replace(/\s+/g,' ').slice(0,200)); console.log('  후:',s.a.replace(/\s+/g,' ').slice(0,200)); }
