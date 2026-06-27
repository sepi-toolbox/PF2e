// BASE creature + PF2e-KR → KO overlay (다층 해소 v2). 미해소는 TODO.
import fs from 'fs';
const KR='/tmp/PF2e-KR/compendium', PACK=process.argv[2], DATA=process.argv[3], OUT=process.argv[4], TODO=process.argv[5];
const ld=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const ldKo=name=>ld(`${KR}/ko/${name}.json`).entries;
const creatures = ld(DATA);
const L1 = ldKo(PACK);  // per-creature 오버레이 (이 팩의 KO)
const SPELL = ldKo('pf2e.spells-srd');
const ABIL = {...ldKo('pf2e.bestiary-ability-glossary-srd'), ...ldKo('pf2e.actionspf2e')};
const EQUIP = ldKo('pf2e.equipment-srd');
// L0 수동 오버레이: 손번역 + 품질 교정(override). 영문명 → {name,description}
let MANUAL = {};
try { MANUAL = JSON.parse(fs.readFileSync('/tmp/PF2e-publish/dev/data/creatures/_manual.ko.json','utf8')); } catch (e) {}
const EFFECTS = {...ldKo('pf2e.spell-effects'),...ldKo('pf2e.campaign-effects'),...ldKo('pf2e.other-effects'),...ldKo('pf2e.feat-effects'),...ldKo('pf2e.bestiary-effects')};
const COND = ldKo('pf2e.conditionitems');

const stripSuffix = n => n.replace(/\s*\((?:at[\s-]?will|constant|self only|recharge[^)]*|[^)]*at[\s-]?will[^)]*)\)\s*$/i,'').trim();
// 자연무기 용어집 (빈출)
const STRIKE = {jaws:'턱',claw:'발톱',claws:'발톱',bite:'물기',tail:'꼬리',fist:'주먹',horn:'뿔',horns:'뿔',hoof:'발굽',talon:'발톱',talons:'발톱',beak:'부리',tentacle:'촉수',tentacles:'촉수',tendril:'덩굴손',pincer:'집게',pincers:'집게',stinger:'독침',wing:'날개',fangs:'송곳니',tusk:'엄니',tusks:'엄니',gore:'들이받기',slam:'후려치기',trunk:'코',antler:'가지뿔',mandibles:'큰턱',foot:'발',leg:'다리',paw:'앞발',tongue:'혀',spike:'가시',spikes:'가시',spines:'가시',vine:'덩굴',fin:'지느러미',head:'머리',ram:'들이받기',proboscis:'주둥이',hook:'갈고리',pseudopod:'위족',branch:'나뭇가지',rock:'바위',body:'몸통',spit:'침 뱉기',root:'뿌리','shadow hand':'그림자 손','ghostly hand':'유령 손','fire mote':'불티',limb:'사지'};
const CAST_NAMES={'cleric domain spells':'클레릭 영역 주문','domain spells':'영역 주문','coven spells':'집회 주문','bard composition spells':'바드 악곡 주문','druid order spells':'드루이드 교단 주문','champion focus spells':'챔피언 집중 주문','champion focus spell':'챔피언 집중 주문','champion devotion spells':'챔피언 헌신 주문','witch hex spells':'위치 저주 주문','monk focus spells':'몽크 집중 주문','triumvirate spells':'삼두 주문','emotional focus':'감정 집중 주문','wizard focus spells':'위저드 집중 주문','oracle focus spells':'오라클 집중 주문','sorcerer bloodline spells':'소서러 혈통 주문','bloodline spells':'혈통 주문','focus spells':'집중 주문'};
// 장비 변형 정규화(+N/등급어/룬/Functions as/Lesser→(Lesser)) → equipment-srd 회복
const gearVariants = n => { const out=[n]; out.push(n.replace(/\s*\([^)]*\)\s*/g,' ').trim());
  let v=n.replace(/\s*\([^)]*\)\s*/g,' ').replace(/^\+\d+\s+/,'').replace(/\b(greater|major|moderate|lesser|true|genuine|standard)\s+/gi,'').replace(/\b(striking|resilient|keen|returning|wounding|corrosive|flaming|frost|shock|holy|unholy|thundering)\s+/gi,'').trim(); out.push(v);
  const m=n.match(/\((?:functions as|as)\s+([^)]+)\)/i); if(m)out.push(m[1].trim());
  const lg=n.match(/^(lesser|greater|major|moderate)\s+(.+)$/i); if(lg)out.push(`${lg[2]} (${lg[1][0].toUpperCase()+lg[1].slice(1).toLowerCase()})`);
  return out; };
const eqLookup = n => { for(const v of gearVariants(n)){ if(EQUIP[v]) return EQUIP[v]; } return null; };
const GEAR={spellbook:'주문서','formula book':'제조법서','signet ring':'인장 반지',lute:'류트',robes:'로브','pewter mug':'백랍 잔'};
const stripParen = n => n.replace(/\s*\([^)]*\)\s*$/,'').trim();
const stripParenAll = n => n.replace(/(\s*\([^)]*\))+\s*$/,'').trim();  // 다중 괄호 제거
// QC: PF2e-KR 기계번역 일본어 조각 교정 (로그: OVERLAY_FIXES.md). 토큰 단위만, 무거운 절은 별도.
const SANITIZE = {'パラスマ':'파라스마','スマ':'스마','プリント':'프린트','ハンサム':'핸섬','パル':'펄','の対象':'의 대상','灰色の主人':'회색의 주인','への':'에의'};
const san = t => { if(!t||typeof t!=='string')return t; for(const k in SANITIZE) t=t.split(k).join(SANITIZE[k]); return t; };
const TRAD={arcane:'비전',divine:'신성',occult:'오컬트',primal:'원시'};
const PREP={innate:'선천',prepared:'준비',spontaneous:'자발',focus:'집중',ritual:'의식'};
const castName = n => { const m=n.toLowerCase(); let t=Object.keys(TRAD).find(k=>m.includes(k)), p=Object.keys(PREP).find(k=>m.includes(k)); if(t&&m.includes('spell')) return `${TRAD[t]} ${p?PREP[p]:''} 주문`.replace(/\s+/g,' ').trim(); return null; };
const TPL=[[/^Telepathy\b.*?(\d+)\s*feet/i,m=>`텔레파시 ${m[1]}피트`],[/^Lifesense\b.*?(\d+)\s*feet/i,m=>`생명감지 ${m[1]}피트`],[/^Tremorsense\b.*?(\d+)\s*feet/i,m=>`진동감지 ${m[1]}피트`],[/^Scent\b/i,()=>'후각'],[/^Greater Darkvision$/i,()=>'상위 암시야'],[/^Darkvision$/i,()=>'암시야'],[/^Low-Light Vision$/i,()=>'저광 시야'],[/^Fast Healing\b.*?(\d+)/i,m=>`빠른 치유 ${m[1]}`],[/^Regeneration\b.*?(\d+)/i,m=>`재생 ${m[1]}`]];
const tpl=n=>{for(const[re,f]of TPL){const m=n.match(re);if(m)return f(m);}return null;};

let stat={creatures:0,coHdr:0,items:0,manual:0,L1:0,spell:0,abil:0,equip:0,strike:0,cast:0,lore:0,effect:0,cond:0,tpl:0,L4:0};
const todo={}, overlay={}, strikeMiss={};
for(const c of creatures){
  stat.creatures++; const e1=L1[c.name]||{}; if(e1.name)stat.coHdr++;
  const co={name:e1.name||null,description:san(e1.description)||null,hpdetails:san(e1.hpdetails)||null,perception:san(e1.perception)||null,languages:san(e1.languages)||null,speeds:san(e1.speeds)||null,items:{}};
  for(const it of c.items){
    stat.items++; let ko=null,src=null; const nm=it.name, lo=nm.toLowerCase();
    const _cOv=MANUAL.creatures&&MANUAL.creatures[c.name]&&(MANUAL.creatures[c.name][it.slug]||MANUAL.creatures[c.name][nm]);
    if(_cOv){ko=_cOv;src='manual';stat.manual++;}
    else if(MANUAL.items&&MANUAL.items[nm]){ko=MANUAL.items[nm];src='manual';stat.manual++;}
    else if(e1.items?.[it._id]?.name){ko=e1.items[it._id];src='L1';stat.L1++;}
    else if(it.type==='spell'){const h=SPELL[nm]||SPELL[stripSuffix(nm)]||SPELL[stripParenAll(nm)];if(h){ko=h;src='spell';stat.spell++;}}
    else if(it.type==='action'){const h=ABIL[nm];if(h){ko=h;src='abil';stat.abil++;}}
    else if(['weapon','armor','shield','consumable','equipment','ammo','treasure'].includes(it.type)){let h=eqLookup(nm)||(GEAR[lo]&&{name:GEAR[lo]})||(GEAR[stripParen(lo)]&&{name:GEAR[stripParen(lo)]});const sc=nm.match(/^Scroll of (.+?)(?:\s*\(Rank \d+\))?$/i);if(!h&&sc&&SPELL[sc[1]])h={name:`${SPELL[sc[1]].name} 두루마리`};if(h){ko=h;src='equip';stat.equip++;}}
    else if(it.type==='spellcastingEntry'){const t=CAST_NAMES[lo]||castName(nm);if(t){ko={name:t};src='cast';stat.cast++;}}
    else if(it.type==='lore'){const m=nm.match(/^(.*?)\s*Lore$/i);if(m){ko={name:`${m[1]} 지식`};src='lore';stat.lore++;}}
    else if(it.type==='effect'){const h=EFFECTS[nm]||EFFECTS[nm.replace(/^(?:Spell |Stance: )?Effect:\s*/i,'')];if(h){ko=h;src='effect';stat.effect++;}}
    else if(it.type==='condition'){const h=COND[nm]||COND[stripParen(nm)];if(h){ko=h;src='cond';stat.cond++;}}
    if(!ko&&it.type==='melee'){ const eq=eqLookup(nm); const sk=STRIKE[lo]||STRIKE[stripParen(lo)]; if(eq){ko=eq;src='equip';stat.equip++;} else if(sk){ko={name:sk};src='strike';stat.strike++;} else strikeMiss[lo]=(strikeMiss[lo]||0)+1; }
    if(!ko){const t=tpl(nm);if(t){ko={name:t};src='tpl';stat.tpl++;}}
    if(ko)co.items[it.slug]={name:san(ko.name),description:san(ko.description)||null,src};
    else{stat.L4++;(todo[it.type]=todo[it.type]||[]).push(`${c.id}:${nm}`);}
  }
  overlay[c.name]=co;
}
fs.writeFileSync(OUT,JSON.stringify(overlay)); fs.writeFileSync(TODO,JSON.stringify(todo,null,1));
const R=stat.manual+stat.L1+stat.spell+stat.abil+stat.equip+stat.strike+stat.cast+stat.lore+stat.effect+stat.cond+stat.tpl;
const pct=n=>(n/stat.items*100).toFixed(1)+'%';
console.log('생물',stat.creatures,'| 헤더',stat.coHdr+'/'+stat.creatures,'| 아이템',stat.items);
console.log(`L1:${stat.L1} 주문:${stat.spell} 능력:${stat.abil} 장비:${stat.equip} 타격:${stat.strike} 시전:${stat.cast} 지식:${stat.lore} 템플릿:${stat.tpl}`);
console.log(`해소 합계: ${R} (${pct(R)}) | 미해소 L4: ${stat.L4} (${pct(stat.L4)})`);
console.log('L4 타입별:',Object.fromEntries(Object.entries(todo).map(([k,v])=>[k,v.length])));
const topMiss=Object.entries(strikeMiss).sort((a,b)=>b[1]-a[1]).slice(0,15);
console.log('타격 미해소 빈출:',topMiss.map(([n,c])=>`${n}(${c})`).join(' '));
