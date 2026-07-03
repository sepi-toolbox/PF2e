// 힘(능력치)→근력, 체력(능력치)→건강, 나머지 체력(HP)→HP(+조사정정). overlay 대상. 기본 dry-run.
import fs from 'fs'; import path from 'path';
const DEV=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const OVL=path.join(DEV,'data/overlay');
const files=fs.readdirSync(OVL).filter(f=>f.endsWith('.ko.json'));
const APPLY=process.argv.includes('--apply');
const AB='(?:근력|민첩|건강|지능|지혜|매력)';
const rules=[
  // 1) 힘 → 근력 (능력치 앵커)
  [new RegExp('힘(\\s*(?:능력치|능력\\s*점수|능력(?![가-힣])|부스트|결함|수정자|수정치))','g'),'근력$1','힘→근력'],
  [/\[힘\]/g,'[근력]','힘→근력'],
  [new RegExp('힘(\\s*또는\\s*'+AB+')','g'),'근력$1','힘→근력'],
  [new RegExp('('+AB+'\\s*또는\\s*)힘','g'),'$1근력','힘→근력'],
  // 2) 체력 → 건강 (능력치 앵커)
  [new RegExp('체력(\\s*(?:능력치|능력\\s*점수|능력(?![가-힣])|부스트|결함|수정자|수정치))','g'),'건강$1','체력→건강'],
  [/\[체력\]/g,'[건강]','체력→건강'],
  [new RegExp('체력(\\s*또는\\s*'+AB+')','g'),'건강$1','체력→건강'],
  [new RegExp('('+AB+'\\s*또는\\s*)체력','g'),'$1건강','체력→건강'],
  // 3) 나머지 체력(HP) → HP + 조사정정
  [/체력\s*점수/g,'HP','체력→HP'],
  [/체력을/g,'HP를','체력→HP'],[/체력이/g,'HP가','체력→HP'],[/체력은/g,'HP는','체력→HP'],[/체력과/g,'HP와','체력→HP'],[/체력으로/g,'HP로','체력→HP'],
  [/체력/g,'HP','체력→HP'],
];
const cnt={'힘→근력':0,'체력→건강':0,'체력→HP':0}; const susp=[]; const samp={'힘→근력':[],'체력→건강':[],'체력→HP':[]};
const SUSPCTX=/(지구력|스태미나|피로|단련|신체 단련|운동으로 다진|건강미)/;
for(const f of files){ const fp=path.join(OVL,f); const raw=fs.readFileSync(fp,'utf8'); let j=JSON.parse(raw); let ch=false;
  const im=raw.match(/^\{\r?\n( *)"/); const indent=im?im[1].length:0;
  const walk=(o)=>{ if(o==null)return o; if(typeof o==='string'){ let a=o;
    for(const [re,rep,tag] of rules){ a=a.replace(re,(...args)=>{ const m=args[0],idx=args[args.length-2],str=args[args.length-1]; cnt[tag]++;
      const ctx=str.slice(Math.max(0,idx-18),idx+m.length+18).replace(/\s+/g,' ');
      if(tag==='체력→HP'&&SUSPCTX.test(ctx)&&susp.length<20)susp.push(f.replace('.ko.json','')+': …'+ctx+'…');
      if(samp[tag].length<7)samp[tag].push(f.replace('.ko.json','')+': …'+ctx+'…');
      return rep.replace(/\$(\d)/g,(x,n)=>args[n]); }); }
    if(a!==o)ch=true; return a; }
    if(Array.isArray(o))return o.map(walk); if(typeof o==='object'){for(const k in o)o[k]=walk(o[k]);return o;} return o; };
  j=walk(j); if(ch&&APPLY)fs.writeFileSync(fp,JSON.stringify(j,null,indent)+(raw.endsWith('\n')?'\n':''));
}
console.log('치환:',JSON.stringify(cnt), APPLY?'[APPLIED]':'[DRY-RUN]');
console.log('\n의심(HP전환인데 일반어 정황) '+susp.length+'건:'); susp.forEach(s=>console.log('  ⚠',s));
for(const t of ['힘→근력','체력→건강','체력→HP']){ console.log('\n=== '+t+' 샘플 ==='); samp[t].forEach(s=>console.log('  ',s)); }
