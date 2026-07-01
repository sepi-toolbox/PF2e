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
</script>
<style>#mode-select{display:none!important;}#preview-diag{position:fixed;left:0;top:0;right:0;z-index:2147483647;background:#111;color:#0f0;font:12px/1.5 monospace;padding:10px;white-space:pre-wrap;max-height:70vh;overflow:auto;border-bottom:2px solid #0f0;}</style>'''
src = re.sub(r'<script>\s*firebase\.initializeApp\(\{.*?const db = firebase\.firestore\(\);\s*</script>', stub, src, flags=re.S)

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
  // fvtt-only 재주도 효과 나오나(있으면)
  var anySlug=Object.keys(EFFECTS_DB).find(function(s){return EFFECTS_DB[s].source==='fvtt';});
  ok('fvtt-origin entity has runtime rows', !!(anySlug && EFFECTS_DB[anySlug].rows.length));
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
