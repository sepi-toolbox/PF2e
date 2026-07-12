#!/usr/bin/env python3
"""dev/_preview.html 생성기 — index.html(진입)에서 Firebase 스텁 + 샘플로 slug-디커플링 회귀검증.
결과·에러를 고정 오버레이에 찍어 스크린샷/DOM 덤프로 읽는다.
사용: cd dev && python3 tools/make_preview.py  (→ dev/_preview.html)"""
import re, os
base = os.path.join(os.path.dirname(__file__), '..', 'index.html')
src = open(base, encoding='utf-8').read()
src = re.sub(r'<script src="https://www\.gstatic\.com/firebasejs/[^"]+"></script>\s*', '', src)
stub = '''<script>
window.firebase={initializeApp:function(){return {};},auth:function(){return {onAuthStateChanged:function(){},currentUser:null,signOut:function(){return Promise.resolve();}};},firestore:function(){var n={get:function(){return Promise.reject('stub');},set:function(){return Promise.resolve();},update:function(){return Promise.resolve();},delete:function(){return Promise.resolve();},onSnapshot:function(){return function(){};},collection:function(){return n;},doc:function(){return n;},where:function(){return n;},orderBy:function(){return n;},limit:function(){return n;},add:function(){return Promise.resolve({id:'x'});}};return {collection:function(){return n;},doc:function(){return n;}};}};
window.firebase.firestore.FieldValue={serverTimestamp:function(){return null;},delete:function(){return null;},arrayUnion:function(){return null;},increment:function(){return 0;}};
try{var auth=firebase.auth();var db=firebase.firestore();}catch(e){}
// env-split 헬퍼 스텁 — 실제 블록(firebase init와 같은 script)이 통째로 교체되므로 여기서 재정의 필수
window.PF_ENV='prod';
window.PF_COL={characters:'characters',sessions:'sessions',dataOverrides:'data_overrides'};
window.PF_LS=function(k){return k;};
window.PF2eOverrideFetcher=function(){return Promise.resolve({});};
</script>
<style>#mode-select{display:none!important;}#preview-diag{position:fixed;left:0;top:0;right:0;z-index:2147483647;background:#111;color:#0f0;font:12px/1.5 monospace;padding:10px;white-space:pre-wrap;max-height:70vh;overflow:auto;border-bottom:2px solid #0f0;}</style>'''
# firebase init 블록 전체(env-split 헬퍼·PF2eOverrideFetcher 포함, 첫 </script>까지) 교체.
# 구 패턴은 'const db...</script>' 즉시 종료를 가정 — 2026-06-30 env-split로 블록이 확장돼 미매칭
# → 진짜 initializeApp이 남아 throw → PF_LS 미정의 연쇄로 후속 블록 사망(무음).
_n = len(re.findall(r'<script>\s*firebase\.initializeApp\(\{.*?</script>', src, flags=re.S))
assert _n == 1, f'firebase init 블록 매칭 {_n}개 — make_preview 패턴 점검 필요'
src = re.sub(r'<script>\s*firebase\.initializeApp\(\{.*?</script>', stub, src, flags=re.S)

harness = r'''<script>
window.addEventListener('load',function(){setTimeout(runDiag,1200);});
function runDiag(){
 var L=[], err=[];
 function log(x){L.push(x);}
 function ok(name,cond){ log((cond?'✓ ':'✗ FAIL ')+name); if(!cond)err.push(name); }
 try{
  if(typeof state==='undefined'){err.push('NO state');return show();}
  if(typeof spellSlug!=='function'){err.push('spellSlug MISSING');return show();}
  var Lv=document.getElementById('f-level'); if(Lv)Lv.value=5;
  state.level=5;
  state.selectedClass={id:'sorcerer',name:'sorc',casting:'spontaneous',keyAbility:'cha',tradition:'arcane'};
  state.selectedAncestry={id:'dwarf',name:'dwarf',hp:10,vision:'darkvision',speed:20};
  state.selectedBackground={id:'acolyte',name:'aco'};
  state.feats={special:[],ancestry:[],class:[],general:[],skill:[],archetype:[],other:[]};
  state.feats.general.push({id:'bard-dedication',name:'Bard Dedication',level:5});
  state.feats.general.push({name:'child',level:5,_auto:true,_grantedBy:'bard-dedication'});
  state.spells={cantrip:[{id:'light',name:'X',rank:0}],known:[{id:'caustic-blast',name:'STALE',rank:1}],focus:[],innate:[]};

  ok('spellSlug(name obj)->slug', spellSlug({id:'caustic-blast',name:'STALE'})==='caustic-blast');
  ok('spellDisplay(slug)->korean', /[가-힣]/.test(spellDisplay('caustic-blast')));
  ok('featSame(id vs stale-obj)', featSame('bard-dedication',{id:'bard-dedication',name:'fake'}));

  try{ recalcAll(); }catch(e){err.push('recalcAll:'+e.message);}
  try{ cascadeRemoveFeats(); }catch(e){err.push('cascade:'+e.message);}
  ok('child feat survived (grantedBy slug)', state.feats.general.some(function(f){return f&&f._grantedBy;}));

  // growth(spontaneous): slug 저장 -> sync -> render (stale known 제거 후 growth 파생만 검사)
  state.spells.known=[];
  state.growth={3:{spells:{cantrip:['light'],rank1:['caustic-blast']}}};
  state.signatureSpells={1:'caustic-blast'};
  try{ syncGrowthSpellsToState(); }catch(e){err.push('syncGrowth:'+e.message);}
  var kn=(state.spells.known||[]).find(function(s){return spellSlug(s)==='caustic-blast';});
  ok('growth->known slug entry', !!kn);
  ok('  known.name is korean (sync re-derives)', !!(kn && /[가-힣]/.test(kn.name)));
  var sigHtml=(typeof growthSignatureCardHTML==='function')?growthSignatureCardHTML(3):'';
  // 옵션 라벨(>...<)이 한글이어야 함. value 속성엔 slug가 있는 게 정상.
  var labels=(sigHtml.match(/>([^<>]*부식[^<>]*)</g)||[]).join('');
  ok('signature card option label is korean', /부식/.test(labels));

  // load-migration: old name-based save -> slug
  state.growth={2:{familiarSpells:{free:[{name:'부식성 폭발',rank:1}]},spells:{rank1:['부식성 폭발']}}};
  state.preparedSpells={1:['부식성 폭발']}; state.familiarSpells={1:['부식성 폭발']};
  if(typeof _migrateGrowthStoresToSlug==='function') _migrateGrowthStoresToSlug();
  if(typeof _migrateDerivedSpellStoresToSlug==='function') _migrateDerivedSpellStoresToSlug();
  ok('migrate growth.spells name->slug', state.growth[2].spells.rank1[0]==='caustic-blast');
  ok('migrate familiar free name->{id:slug}', state.growth[2].familiarSpells.free[0].id==='caustic-blast');
  ok('migrate preparedSpells name->slug', state.preparedSpells[1][0]==='caustic-blast');

  // prepared render (wizard): stored slug -> no raw slug in DOM
  state.selectedClass={id:'wizard',name:'wiz',casting:'prepared',keyAbility:'int',tradition:'arcane'};
  state.spellSlots={1:3}; state.cantripSlots=5;
  state.preparedSpells={cantrip:['light'],1:['caustic-blast']};
  try{ renderSpells(); }catch(e){err.push('renderSpells(prep):'+e.message);}
  var cont=document.getElementById('spell-ranks-container');
  ok('prepared render: no raw slug leaked', (cont?cont.textContent:'').indexOf('caustic-blast')===-1);

  ['renderSpells','renderFeats','buildSkills','renderWeapons'].forEach(function(fn){
   try{ if(typeof window[fn]==='function') window[fn](); }catch(e){ err.push(fn+':'+e.message); }
  });
  log('renderers ran');

  // ── 효과 단일화(EFFECTS_DB) 검증 ──
  ok('EFFECTS_DB loaded', typeof EFFECTS_DB!=='undefined' && Object.keys(EFFECTS_DB).length>1000);
  ok('EFFECT_GROUPS emptied (레거시 제거)', typeof EFFECT_GROUPS!=='undefined' && EFFECT_GROUPS.length===0);
  // 레거시 재주 효과가 EFFECTS_DB 경유로 나오나
  var bd = _getFeatEffectsDef('Bard Dedication');
  ok('feat def via EFFECTS_DB (Bard Dedication)', !!(bd && bd.effects && bd.effects.some(function(e){return e.type==='skill_trained';})));
  // 유산(legacy) 효과
  var hv = getHeritageEffects({id:'forge-dwarf'});
  ok('heritage effects via EFFECTS_DB (forge-dwarf)', !!(hv && (hv.resistances||hv.hpBonus!=null||hv.vision)));
  // 배경(legacy) 효과
  var bg = getBackgroundEffects({id:'acolyte'});
  ok('background effects via EFFECTS_DB (acolyte)', !!(bg && (bg.fixed_skills.length||bg.fixed_lores.length||bg.boosts.length)));
  // 배경 부여 재주(generic items→grant_feat) + 원하는 지식(choice_lore)
  var gsp = getBackgroundEffects({id:'gossip'});
  ok('gossip: feat_id=hobnobber (부여재주)', gsp && gsp.feat_id==='hobnobber');
  ok('gossip: choice_lore=true (원하는 지식)', gsp && gsp.choice_lore===true);
  ok('gossip: fixed_lores 비어있음(선택형이라)', gsp && gsp.fixed_lores.length===0);
  ok('gossip: 외교 훈련 유지', gsp && gsp.fixed_skills.indexOf('diplomacy')>=0);
  var bkp = getBackgroundEffects({id:'barkeep'});
  ok('barkeep: feat_id=hobnobber + 고정지식 Alcohol', bkp && bkp.feat_id==='hobnobber' && bkp.fixed_lores.length===1 && bkp.choice_lore===false);
  var gr = (typeof getEffectRows==='function')?getEffectRows('gossip'):[];
  ok('gossip rows: grant_lore $choice 존재', gr.some(function(r){return r.type==='grant_lore'&&r.target==='$choice';}));
  ok('gossip rows: grant_feat hobnobber 존재', gr.some(function(r){return r.type==='grant_feat'&&r.target==='hobnobber';}));
  // 추가 지식 레벨 스케일(prof_by_level) — 데이터+_rowToEffect 통과+공식
  var alRow = (getEffectRows('additional-lore')||[]).find(function(r){return r.type==='grant_lore';});
  ok('additional-lore: prof_by_level 존재', !!(alRow && Array.isArray(alRow.prof_by_level) && alRow.prof_by_level.length===4));
  var alEff = (typeof _rowToEffect==='function' && alRow)?_rowToEffect(alRow):{};
  ok('_rowToEffect가 prof_by_level 보존', !!(alEff && Array.isArray(alEff.prof_by_level)));
  function _lr(lvl,tbl){var r=0;(tbl||[]).forEach(function(p){if(Array.isArray(p)&&lvl>=p[0])r=Math.max(r,p[1]);});return r||2;}
  var t=alEff.prof_by_level;
  ok('스케일 L1=훈련(2)', _lr(1,t)===2 && _lr(2,t)===2);
  ok('스케일 L3=전문가(4)', _lr(3,t)===4 && _lr(6,t)===4);
  ok('스케일 L7=달인(6)', _lr(7,t)===6 && _lr(14,t)===6);
  ok('스케일 L15=전설(8)', _lr(15,t)===8 && _lr(20,t)===8);
  // 스케일 없는 지식(가십 choice)은 훈련 고정
  var gLore=(getEffectRows('gossip')||[]).find(function(r){return r.type==='grant_lore';});
  ok('가십 지식은 prof_by_level 없음(훈련 고정)', !!(gLore && !gLore.prof_by_level));
  // 택1(or) 배경 → choice_lore, 쓰레기 고정지식 없음
  var fo=getBackgroundEffects({id:'faction-opportunist'});
  ok('faction-opportunist: choice_lore=true(택1)', fo && fo.choice_lore===true);
  ok('faction-opportunist: 쓰레기 고정지식 없음', fo && fo.fixed_lores.length===0);
  var hd=getBackgroundEffects({id:'hookclaw-digger'});
  ok('hookclaw-digger: 고정지식 2개 유지(and)', hd && hd.fixed_lores.length===2 && hd.choice_lore===false);

  // ── 출처(source) 기반 지식 슬롯: 수집→배정·스케일·빈이름 점유·초과·당겨짐 ──
  if (typeof collectLoreSource==='function' && typeof assignLoreSlots==='function') {
    var n1=document.getElementById('lore-name-lore1'), p1=document.getElementById('sk-prof-lore1');
    var n2=document.getElementById('lore-name-lore2'), p2=document.getElementById('sk-prof-lore2');
    ok('지식 슬롯 DOM 존재(lore1/lore2)', !!(n1&&p1&&n2&&p2));
    if (n1&&p1&&n2&&p2) {
      n1.value='';p1.value='0';n2.value='';p2.value='0';
      state._loreSlotSource={}; state._loreSlotRef={};
      // 스케일: L15 prof_by_level → 전설(8)
      state.level=15;
      state._loreSources=[{key:'feat:a:1',name:'스케일테스트',rank:_loreRank([[1,2],[3,4],[7,6],[15,8]]),kind:'feat',ref:{},fixed:false}];
      assignLoreSlots();
      ok('출처 스케일 L15 → lore1=전설(8)', n1.value==='스케일테스트' && p1.value==='8');
      // 빈 이름도 슬롯 점유(출처 기반) + 둘째 출처 → lore2
      state._loreSources=[{key:'feat:a:1',name:'',rank:2,kind:'feat',ref:{},fixed:false},{key:'feat:b:1',name:'공부',rank:2,kind:'feat',ref:{},fixed:false}];
      assignLoreSlots();
      ok('빈 이름도 슬롯 점유(lore1 rank2)', p1.value==='2' && n1.value==='' && !!state._loreSlotSource.lore1);
      ok('둘째 출처 → lore2(공부)', n2.value==='공부');
      // 초과: 3번째 출처 → 오버플로
      var refC={};
      state._loreSources=[{key:'feat:a:1',name:'A',rank:2,kind:'feat',ref:{},fixed:false},{key:'feat:b:1',name:'B',rank:2,kind:'feat',ref:{},fixed:false},{key:'feat:c:1',name:'C',rank:2,kind:'feat',ref:refC,fixed:false}];
      assignLoreSlots();
      ok('셋째 출처 → 오버플로(ref로 추적)', (state._loreOverflow||[]).some(function(o){return o.ref===refC;}));
      // 앞 출처 제거 → 초과분 당겨짐(C가 lore2로)
      state._loreSources=[{key:'feat:a:1',name:'A',rank:2,kind:'feat',ref:{},fixed:false},{key:'feat:c:1',name:'C',rank:2,kind:'feat',ref:refC,fixed:false}];
      assignLoreSlots();
      ok('출처 제거 → 초과분 당겨짐(C→lore2)', n2.value==='C' && (state._loreOverflow||[]).length===0);
      n1.value='';p1.value='0';n2.value='';p2.value='0';state._loreSources=[];state._loreSlotSource={};state._loreSlotRef={};
    }
  } else { ok('collectLoreSource/assignLoreSlots 로드', false); }
  // fvtt-only 재주도 효과 나오나(있으면)
  var anySlug=Object.keys(EFFECTS_DB).find(function(s){return EFFECTS_DB[s].source==='fvtt';});
  ok('fvtt-origin entity has runtime rows', !!(anySlug && EFFECTS_DB[anySlug].rows.length));

  // ── 소서러 혈통 고도화 검증 (GAP 1~4) ──
  if (typeof PF2eClass!=='undefined' && PF2eClass.subclassGrantTable) {
    ok('BLOODLINE_DB 로드(≥18)', typeof BLOODLINE_DB!=='undefined' && Object.keys(BLOODLINE_DB).length>=18);
    var angG=PF2eClass.subclassGrantTable('bloodline-angelic',20);
    ok('GAP1 천상체 혈통기술 2(외교·종교)', angG.skills.map(function(s){return s.slug;}).sort().join()==='diplomacy,religion');
    ok('GAP2 천상체 부여주문(캔트립 light + known≥9)', angG.spells.some(function(s){return s.type==='cantrip'&&s.slug==='light';}) && angG.spells.filter(function(s){return s.type==='known';}).length>=9);
    state.selectedClass={id:'sorcerer',name:'sorc',casting:'spontaneous',keyAbility:'cha',tradition:'any'};
    state.selectedSubclass=SUBCLASS_DB.find(function(s){return s.id==='bloodline-angelic';}); state.bloodlineExemplar=null;
    ok('GAP4 천상체 전통=divine(고정)', typeof _subclassTradition==='function' && _subclassTradition()==='divine');
    state.selectedSubclass=SUBCLASS_DB.find(function(s){return s.id==='bloodline-draconic';}); state.bloodlineExemplar='Arcane';
    ok('GAP4 드라코닉+아케인표본 전통=arcane', _subclassTradition()==='arcane');
    // GAP1 skill training via recalcAll (DOM)
    state.level=5;
    state.selectedSubclass=SUBCLASS_DB.find(function(s){return s.id==='bloodline-angelic';}); state.bloodlineExemplar=null;
    try{ recalcAll(); }catch(e){err.push('sorc recalcAll:'+e.message);}
    var dip=document.getElementById('sk-prof-diplomacy'), rel=document.getElementById('sk-prof-religion');
    ok('GAP1 천상체 선택 → 외교·종교 훈련(DOM)', !!(dip&&rel)&&parseInt(dip.value)>=2&&parseInt(rel.value)>=2);
    // GAP4 draconic exemplar skill training (협박 고정 + 표본 주문학)
    state.selectedSubclass=SUBCLASS_DB.find(function(s){return s.id==='bloodline-draconic';}); state.bloodlineExemplar='Arcane';
    try{ recalcAll(); }catch(e){err.push('sorc recalcAll2:'+e.message);}
    var arc=document.getElementById('sk-prof-arcana'), intim=document.getElementById('sk-prof-intimidation');
    ok('GAP4 드라코닉+아케인 → 협박+주문학 훈련(DOM)', !!(arc&&intim)&&parseInt(arc.value)>=2&&parseInt(intim.value)>=2);
    // GAP3 advanced/greater focus 효과 존재 + 해소
    var advDef=(typeof _getFeatEffectsDef==='function')?_getFeatEffectsDef('Advanced Bloodline'):null;
    ok('GAP3 Advanced Bloodline grant_focus_spell 효과', !!(advDef&&advDef.effects&&advDef.effects.some(function(e){return e.type==='grant_focus_spell';})));
    var _bl=BLOODLINE_DB['bloodline-draconic'];
    ok('GAP3 드라코닉 중급=dragon-breath/고급=dragon-wings', _bl.advanced==='dragon-breath' && _bl.greater==='dragon-wings');
    // 「혈통 항목 읽는 법」 데이터 파생 가이드(5용어) + 모달 렌더
    ok('BLOODLINE_GUIDE 5용어 로드', typeof BLOODLINE_GUIDE!=='undefined' && BLOODLINE_GUIDE.length===5 && BLOODLINE_GUIDE.some(function(g){return g.term==='혈통 마법';}));
    if (typeof _bloodlineGuideHtml==='function') {
      var gh=_bloodlineGuideHtml('sorcerer');
      ok('혈통 선택 위 용어설명 렌더(혈통 마법 정의 포함)', /혈통 마법/.test(gh) && /포커스 포인트|집중/.test(gh) && !/details/.test(gh));
      ok('용어설명 콜아웃 아님(평문: 배경·보더 없음)', !/background:/.test(gh) && !/border-left/.test(gh));
      ok('소서러 외엔 미표시', _bloodlineGuideHtml('druid')==='');
    }
    // 각 혈통 desc에 전통 줄 일관 표시(번역이 반만 살린 것 → BLOODLINE_DB로 재삽입) + 라벨 통일
    if (typeof _bloodlineDescHtml==='function' && typeof SUBCLASS_DB!=='undefined') {
      _modalChoices={type:'class',classFeatureChoices:{},bloodlineExemplar:''};
      var abr=SUBCLASS_DB.find(function(s){return s.id==='bloodline-aberrant';});   // desc에 전통 줄 없던 혈통
      var abrH=_bloodlineDescHtml(abr,'bloodline-aberrant');
      ok('이형체 전통 줄 표시(전통 오컬트)', /<strong>전통<\/strong>\s*오컬트/.test(abrH));
      var ang=SUBCLASS_DB.find(function(s){return s.id==='bloodline-angelic';});     // '주문 목록'/'부여된 주문' 쓰던 혈통
      var angH=_bloodlineDescHtml(ang,'bloodline-angelic');
      ok('천상체 전통 신성 + 중복 없음', /<strong>전통<\/strong>\s*신성/.test(angH) && !/주문 목록/.test(angH));
      ok('천상체 마법적 재능으로 통일(부여된 주문 제거)', /마법적 재능/.test(angH) && !/부여된 주문/.test(angH));
      var dra=SUBCLASS_DB.find(function(s){return s.id==='bloodline-draconic';});
      var draH=_bloodlineDescHtml(dra,'bloodline-draconic');
      ok('드라코닉 전통=표본 의존 안내', /표본 선택에 따라 결정/.test(draH));
    }
    // 혈통 마법 = 주문 탭 섹션(패시브 라이더)
    state.selectedClass={id:'sorcerer',casting:'spontaneous',keyAbility:'cha',tradition:'any'};
    state.selectedSubclass=SUBCLASS_DB.find(function(s){return s.id==='bloodline-angelic';});
    state.spells={cantrip:[],known:[],focus:[{id:'angelic-halo',name:'천사의 후광'}],innate:[]};
    try{ if(typeof renderSpells==='function') renderSpells(); }catch(e){err.push('bloodmagic render:'+e.message);}
    var bms=document.getElementById('spell-blood-magic-section'), bmb=document.getElementById('blood-magic-body');
    ok('혈통 마법 섹션 표시(천상체=신성한 오라)', !!(bmb&&bms) && /신성한 오라/.test(bmb.innerHTML) && bms.style.display!=='none');
    state.selectedSubclass=null;
    try{ if(typeof renderSpells==='function') renderSpells(); }catch(e){}
    ok('혈통 없으면 혈통 마법 섹션 숨김', !!bms && bms.style.display==='none');
  } else { ok('PF2eClass.subclassGrantTable 로드', false); }

  // ── 드루이드 서브클래스(교단) 드롭다운 조건 + 자연의 목소리 인라인 선택 ──
  if (typeof SUBCLASS_DB!=='undefined') {
    var druidOrders=SUBCLASS_DB.filter(function(s){return s.class_id==='druid'&&s.subclass_type==='교단';});
    ok('드루이드 교단 4종(드롭다운 소스)', druidOrders.length===4);
    // 단일 subclass_type 클래스는 특성명 불일치여도 primaryType=유일유형 → subs 비지 않음(드롭다운 표시)
    ['druid','ranger','rogue','wizard'].forEach(function(cid){
      var all=SUBCLASS_DB.filter(function(s){return s.class_id===cid;});
      var types=[]; all.forEach(function(s){if(s.subclass_type&&types.indexOf(s.subclass_type)<0)types.push(s.subclass_type);});
      ok(cid+' 서브클래스 드롭다운 표시(단일유형 '+types[0]+')', types.length===1 && all.length>0);
    });
    if (typeof _classFeatureChoiceHtml==='function') {
      _modalChoices={type:'class',classFeatureChoices:{}};
      var vohHtml=_classFeatureChoiceHtml({kind:'choice',slug:'voice-of-nature',name_ko:'자연의 목소리'});
      ok('자연의 목소리 인라인 드롭다운 생성(동물/식물 공감)', /animal-empathy/.test(vohHtml)&&/plant-empathy/.test(vohHtml));
    } else { ok('_classFeatureChoiceHtml 로드', false); }
    // choice=동물공감 → recalcAll이 하위 재주(동물 공감) 부여
    state.feats={special:[{id:'voice-of-nature',name:'자연의 목소리 (Voice of Nature)',_auto:true,choice:'animal-empathy',level:1}],ancestry:[],class:[],general:[],skill:[],archetype:[],other:[]};
    state.selectedClass={id:'druid',name:'druid',keyAbility:'wis',tradition:'primal',casting:'prepared'};
    state.selectedSubclass=null; state.level=1;
    try{ recalcAll(); }catch(e){err.push('druid recalc:'+e.message);}
    var hasAnimal=Object.keys(state.feats).some(function(cat){return (state.feats[cat]||[]).some(function(f){return f&&(f.id==='animal-empathy'||/animal-empathy/.test((f.name||'')+(f.id||'')))&&f._grantedBy;});});
    ok('자연의 목소리 choice=동물공감 → 동물 공감 재주 부여', hasAnimal);
  }

  log('EFFECTS_DB slugs='+Object.keys(EFFECTS_DB).length);
 }catch(e){ err.push('FATAL:'+e.message+' | '+(e.stack||'')); }
 function show(){
  var d=document.createElement('div'); d.id='preview-diag';
  var head = err.length ? ('!!! FAILURES('+err.length+'):\n'+err.join('\n')+'\n\n') : 'ALL PASS ✓\n\n';
  d.textContent = head + L.join('\n');
  d.style.color = err.length ? '#f66' : '#6f6';
  (document.body||document.documentElement).appendChild(d);
 }
 show();
}
</script>
</body>'''
src = src.replace('</body>', harness, 1)
out = os.path.join(os.path.dirname(__file__), '..', '_preview.html')
open(out,'w',encoding='utf-8').write(src)
print('wrote', out)
