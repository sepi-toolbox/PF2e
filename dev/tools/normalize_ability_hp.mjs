// v2(2026-07-03 재작성): 능력치/내성/HP 용어 정본화. overlay 대상. 기본 dry-run, --apply로 적용.
//  - 카리스마→매력(전역, --creatures면 creatures/derived도), 기민성 수정자→민첩 수정자
//  - <strong>힘|체력</strong> 능력치 나열(또는/이나/, 체인, 태그 사이 인식 — v1은 이걸 놓쳐 체력→HP 오변환)
//  - 체력(Fortitude 문맥: 내성/DC/반사·의지 나열)→인내, <strong>포트|윌</strong> 스탯→인내|의지
//  - 힘|체력 + 평문 앵커(능력치/부스트/수정자/결함/대신/또는+능력어)→근력|건강
//  - 잔여 체력→HP (조사 정정, '체력이나'→'HP나' — v1은 '체력이'가 먼저 물어 'HP가나' 손상)
import fs from 'fs'; import path from 'path';
const DEV=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const APPLY=process.argv.includes('--apply');
const CREATURES=process.argv.includes('--creatures');
const files=fs.readdirSync(path.join(DEV,'data/overlay')).filter(f=>f.endsWith('.ko.json')).map(f=>({fp:path.join(DEV,'data/overlay',f),light:false}));
if(CREATURES){ // creatures/derived는 무측정 — 무조건 안전한 정본화(카리스마 등)만 적용
  for(const f of fs.readdirSync(path.join(DEV,'data/creatures')).filter(f=>f.endsWith('.ko.json'))) files.push({fp:path.join(DEV,'data/creatures',f),light:true});
  files.push({fp:path.join(DEV,'data/derived/effects.json'),light:true});
}
const MAP={'힘':'근력','체력':'건강'};
const AB='(?:힘|체력|근력|민첩|건강|지능|지혜|매력|카리스마)'; // 구·신 용어 모두 (v1은 신용어만이라 '힘 또는 체력' 미인식)
const cnt={}; const tick=t=>{cnt[t]=(cnt[t]||0)+1;};
const samp={}; const susp=[];
const rec=(t,str,idx,m)=>{ tick(t); (samp[t]=samp[t]||[]); if(samp[t].length<6)samp[t].push('…'+str.slice(Math.max(0,idx-20),idx+m.length+20).replace(/\s+/g,' ')+'…'); };
const SUSPCTX=/(지구력|스태미나|피로|단련|신체 단련|운동으로 다진|건강미)/;
// 슬러그 타겟 수정: PF2e-KR이 부스트 문장을 누락/오역한 항목 (base system.boosts 대조로 확정)
const BOOST=(x,y)=>`능력 부스트 두 가지를 선택합니다. 하나는 <strong>${x}</strong> 또는 <strong>${y}</strong>에 적용해야 하며, 다른 하나는 자유 능력 부스트입니다.`;
const TARGETED={
  'backgrounds.ko.json:political-scion':[['<strong>민첩</strong> 또는 <strong>지능</strong>에 적용해야','<strong>건강</strong> 또는 <strong>지능</strong>에 적용해야']], // EN: Con or Int
  'backgrounds.ko.json:remittance-agent':[['두 가지 속성 보너스를 선택하세요.',BOOST('건강','지능')]],
  'backgrounds.ko.json:runaway-noble':[['두 가지 속성 보너스를 선택하세요.',BOOST('매력','지능')]],
  'backgrounds.ko.json:ocean-diver':[['두 가지 속성 보너스를 선택하세요.',BOOST('건강','지혜')]],
  'effects.ko.json:spell-effect-blessing-of-defiance':[['체력을 선택한 경우','인내를 선택한 경우'],['반사을 선택한 경우','반사를 선택한 경우']], // EN: if you choose Fortitude
};

function transform(s,light,en){ en=en||'';
  let a=s;
  const rep=(re,fn,tag)=>{ a=a.replace(re,(...args)=>{ const m=args[0],idx=args[args.length-2],str=args[args.length-1]; const out=fn(...args); if(out!==m)rec(tag,str,idx,m); return out; }); };
  // 0) 무조건 정본화
  rep(/카리스마/g,()=> '매력','카리스마→매력');
  rep(/기민성(\s*수정자)/g,(m,g)=>'민첩'+g,'기민성→민첩');
  rep(/<strong>포트<\/strong>/g,()=>'<strong>인내</strong>','포트→인내');
  rep(/<strong>윌<\/strong>/g,()=>'<strong>의지</strong>','윌→의지');
  if(light)return a;
  // 0b) 능력치 이형 표기 (지력=Int, 민첩성=Dex — 단 bare 지력은 접지력/의지력/예지력 부분열이라 strong/괄호/앵커만)
  rep(/<strong>지력<\/strong>/g,()=>'<strong>지능</strong>','지력→지능');
  rep(/\(지력\)/g,()=>'(지능)','지력→지능');
  rep(/<strong>민첩성<\/strong>/g,()=>'<strong>민첩</strong>','민첩성→민첩');
  rep(/민첩성(을?\s*(?:상한선?|수정자|기반))/g,(m,g)=>'민첩'+g,'민첩성→민첩');
  rep(/체력질/g,()=>'건강','체력질→건강'); // PF2e-KR 오타(sarkorian-survivor)
  rep(/체력\s+(?=인내|건강)/g,()=>'','중복체력제거'); // "체력 인내 내성"/"체력 건강 수정자" 원문 중복 표기
  rep(/체력\s*저항(\s*DC)/g,(m,g)=>'인내'+g,'체력저항→인내'); // "체력 저항 DC" = Fortitude DC 오역
  rep(/체력\s*저항(\s*내성)?/g,()=>'인내 내성','체력저항→인내'); // "체력 저항 (내성)" = Fortitude save 오역
  rep(/반사\s*신경(?=\s*(?:DC|내성))/g,()=>'반사','반사신경→반사');
  rep(/인내, 반사 신경, 의지력/g,()=>'인내, 반사, 의지','내성목록');
  // 1) strong 능력치 나열 체인 (태그 사이 또는/이나/, — 반복 적용으로 3개+ 체인 해소)
  for(let i=0;i<6;i++){ const before=a;
    rep(new RegExp('<strong>(힘|체력)(</strong>\\s*(?:,|또는|이나)\\s*<strong>'+AB+'</strong>)','g'),(m,ab,rest)=>'<strong>'+MAP[ab]+rest,'strong나열');
    rep(new RegExp('('+AB+'</strong>\\s*(?:,|또는|이나)\\s*<strong>)(힘|체력)(?=</strong>)','g'),(m,pre,ab)=>pre+MAP[ab],'strong나열');
    if(a===before)break; }
  // 1b) strong 단독 능력치: 힘=무조건 근력(스탯라인 포함 전수검증), 체력=숫자·반려동물(HP 정황) 제외 건강
  rep(/<strong>힘<\/strong>/g,()=>'<strong>근력</strong>','strong단독');
  rep(/<strong>체력<\/strong>(?!\s*[\d;]|\s*당신의)/g,()=>'<strong>건강</strong>','strong단독');
  // 1c) 괄호형 능력치 라벨: 서적(지능)·방패(체력)·소(힘) 등 별자리/해로우 카드 목록
  rep(/\((힘|체력)\)/g,(m,ab)=>'('+MAP[ab]+')','괄호능력치');
  // 2) Fortitude 문맥 → 인내 (HP 캐치올보다 먼저)
  rep(/체력(\s*(?:및|또는|,)\s*(?:반사|의지))/g,(m,g)=>'인내'+g,'체력→인내');
  rep(/(내성\s*굴림\s*\()체력/g,(m,g)=>g+'인내','체력→인내');
  rep(/체력(\s*내성)/g,(m,g)=>'인내'+g,'체력→인내');
  rep(/체력(\s*DC)/g,(m,g)=>'인내'+g,'체력→인내');
  // 3) 평문 능력치 앵커
  rep(new RegExp('(힘|체력)(\\s*(?:능력치|능력\\s*점수|능력(?![가-힣])|부스트|결함|수정자|수정치))','g'),(m,ab,g)=>MAP[ab]+g,'평문앵커');
  rep(/\[힘\]/g,()=>'[근력]','평문앵커'); rep(/\[체력\]/g,()=>'[건강]','평문앵커');
  rep(new RegExp('(힘|체력)(\\s*(?:또는|이나)\\s*'+AB+'(?:[^가-힣]|[에을이가은는와과의로]|$))','g'),(m,ab,g)=>MAP[ab]+g,'평문나열');
  rep(new RegExp('('+AB+'\\s*(?:또는|이나)\\s*)(힘|체력)(?=[^가-힣]|[에을이가은는와과의로])','g'),(m,pre,ab)=>pre+MAP[ab],'평문나열');
  rep(new RegExp('(힘|체력)(\\s*대신\\s*'+AB+')','g'),(m,ab,g)=>MAP[ab]+g,'대신');
  rep(new RegExp('('+AB+'\\s*대신\\s*)(힘|체력)(?=[에을이가])','g'),(m,pre,ab)=>pre+MAP[ab],'대신');
  rep(/(힘|체력)((?:에|을|를)?\s*기반)/g,(m,ab,g)=>MAP[ab]+g,'기반'); // "공격은 힘(에/을) 기반"(Strength based)
  rep(/힘(이|은|을)?(?=\s*[+\-]\d)/g,(m,g)=>'근력'+(g||''),'힘+수치'); // "힘이 +4 미만"(장비 근력 요구치)
  rep(/힘(\s*(?:수치|요구치|요구량|값|항목|점수))/g,(m,g)=>'근력'+g,'힘+수치'); // "힘 수치 16"(Strength value/entry/score)
  // 과/와 나열: 우측이 확정 정본 능력어일 때만 (힘과 힘을 축적 같은 플레이버 오탐 방지, 우측 힘/체력 금지)
  rep(/(힘|체력)(\s*(?:과|와)\s*(?:근력|민첩|건강|지능|지혜|매력))/g,(m,ab,g)=>MAP[ab]+g,'과와나열'); // "힘과 민첩성에 의존"
  rep(/민첩성(에\s*의존)/g,(m,g)=>'민첩'+g,'민첩성→민첩');
  rep(/힘(을\s*핵심\s*능력치)/g,(m,g)=>'근력'+g,'핵심능력치'); // "힘을 핵심 능력치 (수정자)로"
  rep(/(핵심\s*능력치로\s*)힘(?=[을이 ])/g,(m,g)=>g+'근력','핵심능력치');
  rep(/힘(\s*\(망치\))/g,(m,g)=>'근력'+g,'해로우수트'); // 해로우 덱 수트: 망치=근력
  // 쉼표 나열은 상승/부스트류 앵커 필수 — 신격 '관심 분야'(균형, 힘, 건강, 온천) 같은 플레이버 나열 오탐 방지
  rep(new RegExp('(힘|체력)(\\s*,\\s*'+AB+'[를을이가]?\\s*(?:상승|올리|부스트|결함|보너스))','g'),(m,ab,g)=>MAP[ab]+g,'쉼표나열');
  if(/부스트/.test(a)) rep(/(하나는\s*(?:반드시\s*)?)체력(?=[이가에으])/g,(m,g)=>g+'건강','부스트단독'); // "하나는 체력이고"
  // 4) 잔여 체력 → 엔트리 영어 원문 대조 판정 (사용자 지시: 원문 Constitution인데 체력으로 번역된 본문이 많음)
  rep(/체력\s*점수/g,()=>'HP','체력→HP');
  const enCon=/\bConstitution\b/.test(en), enHP=/\bHit Points?\b|\bHP\b/i.test(en);
  const JOSA_HP={'이나':'나','을':'를','이':'가','은':'는','과':'와','으로':'로'};
  rep(/체력(이나|으로|을|이|은|과)?/g,(m,josa,idx,str)=>{
    josa=typeof josa==='string'?josa:''; if(typeof idx!=='number'){idx=josa;josa='';} // josa 미캡처 시 인자 시프트 방어
    const L=String(str).slice(Math.max(0,idx-14),idx), R=String(str).slice(idx+2+josa.length,idx+2+josa.length+16);
    const hpLocal=/(임시|최대|현재|남은|회복하는)\s*$/.test(L)||/^\s*(?:을|를)?\s*(회복|잃|얻|감소|증가|소모|포인트)/.test(R.replace(/^[을를이가은는]/,''))||/^\s*\d/.test(R)||/(경도|파손).{0,8}$/.test(L)||/^\s*(회복|피해|포인트)/.test(R);
    const conLocal=/^\s*(수정자|능력|부스트|기반|점수에)/.test(R);
    let verdict; // 'con'|'hp'|'keep'
    if(conLocal)verdict='con'; else if(hpLocal)verdict='hp';
    else if(en&&enCon&&!enHP)verdict='con'; else if(en&&enHP&&!enCon)verdict='hp';
    else if(en&&!enCon&&!enHP){ verdict='keep'; if(susp.length<40)susp.push('[유지:EN무관]…'+(L+'체력'+josa+R).replace(/\s+/g,' ')+'…'); } // 플레이버(신체 단련 등) — 원문에 Con/HP 없음
    else { verdict='hp'; if(susp.length<40)susp.push((en?'[HP:EN양쪽]':'[HP:EN미매칭]')+'…'+(L+'체력'+josa+R).replace(/\s+/g,' ')+'…'); }
    if(verdict==='keep'){ tick('체력유지(플레이버)'); return m; }
    if(verdict==='con'){ tick('체력→건강(EN대조)'); return '건강'+josa; }
    tick('체력→HP'); return 'HP'+(JOSA_HP[josa]??josa);
  },'체력판정');
  return a;
}
for(const {fp,light} of files){ const raw=fs.readFileSync(fp,'utf8'); let j=JSON.parse(raw); let ch=false;
  const im=raw.match(/^\{\r?\n( *)"/); const indent=im?im[1].length:2;
  const base=path.basename(fp);
  // 영어 원문(BASE) 슬러그 조인 — 잔여 체력의 건강/HP 판정에 사용
  const enBySlug={};
  if(!light){ const bp=path.join(DEV,'data/base',base.replace('.ko.json','.base.json'));
    if(fs.existsSync(bp)) for(const d of JSON.parse(fs.readFileSync(bp,'utf8'))){ const s=d?.system?.slug||(d?.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-'); if(s&&!enBySlug[s])enBySlug[s]=(d.name||'')+'\n'+(d.system?.description?.value||''); } }
  const walk=(o,slug)=>{ if(o==null)return o; if(typeof o==='string'){ let a=transform(o,light,enBySlug[slug]);
      for(const [from,to] of (TARGETED[base+':'+slug]||[])) if(a.includes(from)){ a=a.split(from).join(to); tick('타겟수정'); }
      if(a!==o)ch=true; return a; }
    if(Array.isArray(o))return o.map(x=>walk(x,slug)); if(typeof o==='object'){for(const k in o)o[k]=walk(o[k],slug);return o;} return o; };
  if(!Array.isArray(j)&&typeof j==='object'){ for(const k in j) j[k]=walk(j[k],k); } else j=walk(j,'');
  if(ch&&APPLY)fs.writeFileSync(fp,JSON.stringify(j,null,indent)+(raw.endsWith('\n')?'\n':''));
}
console.log('치환:',JSON.stringify(cnt,null,1), APPLY?'[APPLIED]':'[DRY-RUN]', CREATURES?'(+creatures/derived)':'');
console.log('\n의심(HP전환인데 일반어 정황) '+susp.length+'건:'); susp.forEach(s=>console.log('  ⚠',s));
for(const t of Object.keys(samp)){ console.log('\n=== '+t+' 샘플 ==='); samp[t].forEach(s=>console.log('  ',s)); }
