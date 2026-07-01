#!/usr/bin/env python3
"""dev/_preview.html 생성기 — index.html(진입)에서 Firebase 스텁 + 샘플 캐릭터로
slug-디커플링 회귀검증. recalcAll/cascadeRemoveFeats/renderSpells/renderFeats 실행 후
결과·에러를 고정 오버레이에 찍어 스크린샷으로 읽는다.
사용: cd dev && python3 tools/make_preview.py  (→ dev/_preview.html)"""
import re, os
base = os.path.join(os.path.dirname(__file__), '..', 'index.html')
src = open(base, encoding='utf-8').read()
# Firebase CDN 제거
src = re.sub(r'<script src="https://www\.gstatic\.com/firebasejs/[^"]+"></script>\s*', '', src)
stub = '''<script>
window.firebase={initializeApp:function(){return {};},auth:function(){return {onAuthStateChanged:function(){},currentUser:null,signOut:function(){return Promise.resolve();}};},firestore:function(){var n={get:function(){return Promise.reject('stub');},set:function(){return Promise.resolve();},update:function(){return Promise.resolve();},delete:function(){return Promise.resolve();},onSnapshot:function(){return function(){};},collection:function(){return n;},doc:function(){return n;},where:function(){return n;},orderBy:function(){return n;},limit:function(){return n;},add:function(){return Promise.resolve({id:'x'});}};return {collection:function(){return n;},doc:function(){return n;}};}};
window.firebase.firestore.FieldValue={serverTimestamp:function(){return null;},delete:function(){return null;},arrayUnion:function(){return null;},increment:function(){return 0;}};
try{var auth=firebase.auth();var db=firebase.firestore();}catch(e){}
</script>
<style>#mode-select{display:none!important;}#preview-diag{position:fixed;left:0;top:0;right:0;z-index:2147483647;background:#111;color:#0f0;font:12px/1.5 monospace;padding:10px;white-space:pre-wrap;max-height:60vh;overflow:auto;border-bottom:2px solid #0f0;}</style>'''
src = re.sub(r'<script>\s*firebase\.initializeApp\(\{.*?const db = firebase\.firestore\(\);\s*</script>', stub, src, flags=re.S)

harness = '''<script>
window.addEventListener('load',function(){setTimeout(runDiag,1200);});
function runDiag(){
 var L=[]; var err=[];
 function log(x){L.push(x);}
 try{
  var Lv=document.getElementById('f-level'); if(Lv)Lv.value=5;
  if(typeof state==='undefined'){log('NO state');return show();}
  state.level=5;
  state.selectedClass={id:'sorcerer',name:'소서저',casting:'spontaneous',keyAbility:'cha'};
  state.selectedAncestry={id:'dwarf',name:'드워프',hp:10,vision:'darkvision',speed:20};
  state.selectedBackground={id:'acolyte',name:'복사'};
  // 재주: id 있는 것 + id 없는 구형(마이그레이션 경로) 혼재
  state.feats={special:[],ancestry:[],class:[],general:[],skill:[],archetype:[],other:[]};
  // grant 관계 시뮬: 부모(자동부여) → 자식(_grantedBy=slug)
  state.feats.general.push({id:'bard-dedication',name:'바드 헌신 (Bard Dedication)',level:5});
  state.feats.general.push({name:'자식재주',level:5,_auto:true,_grantedBy:'bard-dedication'});
  // 선천 주문: _sourceFeat = slug
  state.spells={cantrip:[{id:'light',name:'빛',rank:0}],known:[{id:'caustic-blast',name:'구번역명',rank:1}],focus:[],innate:[{id:'produce-flame',name:'불꽃 생성',_sourceFeat:'bard-dedication',_source:'바드'}]};
  log('=== BEFORE ===');
  log('feats.general='+state.feats.general.length+' innate='+state.spells.innate.length+' known='+state.spells.known.length);

  // 리졸버 검증
  if(typeof spellSlug==='function'){
   log('spellSlug(known stale name obj)='+spellSlug({id:'caustic-blast',name:'구번역명'}));
   log('spellDisplay(caustic-blast)='+spellDisplay('caustic-blast'));
   log('featSlug(bard-dedication)='+featSlug('bard-dedication'));
   log('featSame(id vs stale-obj)='+featSame('bard-dedication',{id:'bard-dedication',name:'가짜이름'}));
  } else log('!! spellSlug MISSING');

  // recalcAll (cascade 포함)
  try{ if(typeof recalcAll==='function') recalcAll(); log('recalcAll OK'); }catch(e){err.push('recalcAll: '+e.message);}
  // cascade 직접 호출
  try{ if(typeof cascadeRemoveFeats==='function') cascadeRemoveFeats(); log('cascadeRemoveFeats OK'); }catch(e){err.push('cascade: '+e.message);}
  log('=== AFTER cascade ===');
  log('feats.general='+state.feats.general.length+' innate='+state.spells.innate.length);
  // 부모(bard-dedication) 생존 시 자식/선천주문 유지되어야
  var hasChild=state.feats.general.some(function(f){return f&&f._grantedBy;});
  var hasInnate=state.spells.innate.length>0;
  log('child feat survived='+hasChild+'  innate spell survived='+hasInnate+'  (both true = cascade slug-match OK)');

  // 렌더러
  ['renderSpells','renderFeats','buildSkills','renderWeapons'].forEach(function(fn){
   try{ if(typeof window[fn]==='function'){ window[fn](); log('render '+fn+' OK'); } }catch(e){ err.push(fn+': '+e.message); }
  });
 }catch(e){ err.push('FATAL: '+e.message+'\\n'+(e.stack||'')); }
 function show(){
  var d=document.createElement('div'); d.id='preview-diag';
  d.textContent=(err.length?('!!! ERRORS('+err.length+'):\\n'+err.join('\\n')+'\\n\\n'):'NO ERRORS ✓\\n\\n')+L.join('\\n');
  d.style.color=err.length?'#f66':'#6f6';
  document.body.appendChild(d);
 }
 show();
}
</script>
</body>'''
src = src.replace('</body>', harness, 1)
out = os.path.join(os.path.dirname(__file__), '..', '_preview.html')
open(out,'w',encoding='utf-8').write(src)
print('wrote', out)
