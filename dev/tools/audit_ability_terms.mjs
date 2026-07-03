// 능력치/HP/내성 용어 정본화 감사 — overlay 한글을 BASE 영어 원문과 슬러그 단위 대조.
// A: EN에 Constitution 있는데 KO에 건강 0 & HP 있음 → Con을 HP로 오변환 의심
// B: EN에 Strength(대문자) 있는데 KO에 근력 0 & 힘 있음 → 미변환 Strength 의심
// C: EN에 Fortitude 있는데 KO에 인내 0 → Fort 누락 의심 / KO 'HP 내성|HP DC' → 무조건 오류
// D: backgrounds: base system.boosts 첫 그룹 능력쌍 vs KO 표기 대조
import fs from 'fs'; import path from 'path';
const DEV=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const KOAB={str:'근력',dex:'민첩',con:'건강',int:'지능',wis:'지혜',cha:'매력'};
const cats=fs.readdirSync(path.join(DEV,'data/overlay')).filter(f=>f.endsWith('.ko.json')&&!f.startsWith('_')).map(f=>f.replace('.ko.json',''));
let flags=0;
const show=(t,cat,slug,ko,en)=>{ flags++; if(flags>60)return; console.log(`[${t}] ${cat}/${slug}`); if(ko)console.log('  KO:',ko.replace(/\s+/g,' ').slice(0,160)); if(en)console.log('  EN:',en.replace(/\s+/g,' ').slice(0,160)); };
for(const cat of cats){
  const bp=path.join(DEV,`data/base/${cat}.base.json`); if(!fs.existsSync(bp))continue;
  const base=JSON.parse(fs.readFileSync(bp,'utf8'));
  const bySlug={}; for(const d of (Array.isArray(base)?base:Object.values(base))){ const s=d?.system?.slug||d?.slug||(d?.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-'); if(s)bySlug[s]=d; }
  const ov=JSON.parse(fs.readFileSync(path.join(DEV,`data/overlay/${cat}.ko.json`),'utf8'));
  for(const [slug,e] of Object.entries(ov)){
    const ko=[e?.name,e?.description,e?.desc_ko].filter(Boolean).join('\n'); if(!ko)continue;
    const bd=bySlug[slug]; const en=bd?JSON.stringify([bd.name,bd.system?.description?.value]):''; if(!en)continue;
    const enCon=/\bConstitution\b/.test(en), enStr=/\bStrength\b/.test(en), enFort=/\bFortitude\b/.test(en);
    const enHP=/\bHit Point|\bHP\b/.test(en);
    const c=t=>(ko.match(new RegExp(t,'g'))||[]).length;
    if(/HP\s*(내성|DC)/.test(ko)) show('C:HP내성/DC',cat,slug,ko.match(/.{20}HP\s*(?:내성|DC).{20}/)?.[0],'');
    if(enCon&&!enHP&&c('건강')===0&&c('HP')>0) show('A:Con→HP의심',cat,slug,ko.match(/.{25}HP.{25}/)?.[0],en.match(/.{30}Constitution.{30}/)?.[0]);
    if(enStr&&c('근력')===0&&c('힘')>0) show('B:Str미변환',cat,slug,ko.match(/.{25}힘.{25}/)?.[0],en.match(/.{30}Strength.{30}/)?.[0]);
    if(enFort&&c('인내')===0&&/체력|HP/.test(ko)&&/Fortitude (save|saving|DC)/.test(en)) show('C:Fort누락',cat,slug,ko.match(/.{25}(?:체력|HP).{25}/)?.[0],en.match(/.{30}Fortitude.{30}/)?.[0]);
    if(cat==='backgrounds'&&bd?.system?.boosts){
      const g0=bd.system.boosts['0']?.value||[];
      if(g0.length===2){ const need=g0.map(a=>KOAB[a]); const miss=need.filter(n=>!ko.includes(n));
        if(miss.length) show('D:부스트쌍불일치',cat,slug,`필요[${need}] 누락[${miss}] | `+(ko.match(/하나는.{0,60}/)?.[0]||''),''); }
    }
  }
}
console.log(`\n총 플래그 ${flags}건${flags>60?' (60건까지만 표시)':''}`);
