#!/usr/bin/env python3
"""dev/_growth_test.html 생성기 — 성장 훈련/향상 출처기반 재설계 통합검증(실 앱 함수·DOM).
make_preview.py의 Firebase 스텁 방식 재사용 + 성장 스킬 diag 주입.
사용: cd dev && python3 tools/make_growth_test.py  (→ dev/_growth_test.html), http 서버로 서빙."""
import re, os
base = os.path.join(os.path.dirname(__file__), '..', 'index.html')
src = open(base, encoding='utf-8').read()
src = re.sub(r'<script src="https://www\.gstatic\.com/firebasejs/[^"]+"></script>\s*', '', src)
stub = '''<script>
window.firebase={initializeApp:function(){return {};},auth:function(){return {onAuthStateChanged:function(){},currentUser:null,signOut:function(){return Promise.resolve();}};},firestore:function(){var n={get:function(){return Promise.reject('stub');},set:function(){return Promise.resolve();},update:function(){return Promise.resolve();},delete:function(){return Promise.resolve();},onSnapshot:function(){return function(){};},collection:function(){return n;},doc:function(){return n;},where:function(){return n;},orderBy:function(){return n;},limit:function(){return n;},add:function(){return Promise.resolve({id:'x'});}};return {collection:function(){return n;},doc:function(){return n;}};}};
window.firebase.firestore.FieldValue={serverTimestamp:function(){return null;},delete:function(){return null;},arrayUnion:function(){return null;},increment:function(){return 0;}};
try{var auth=firebase.auth();var db=firebase.firestore();}catch(e){}
window.PF_ENV='prod';
window.PF_COL={characters:'characters',sessions:'sessions',dataOverrides:'data_overrides'};
window.PF_LS=function(k){return k;};
window.PF2eOverrideFetcher=function(){return Promise.resolve({});};
</script>
<style>#mode-select{display:none!important;}#preview-diag{position:fixed;left:0;top:0;right:0;z-index:2147483647;background:#111;color:#0f0;font:12px/1.5 monospace;padding:10px;white-space:pre-wrap;max-height:90vh;overflow:auto;border-bottom:2px solid #0f0;}</style>'''
_n = len(re.findall(r'<script>\s*firebase\.initializeApp\(\{.*?</script>', src, flags=re.S))
assert _n == 1, f'firebase init 블록 매칭 {_n}개'
src = re.sub(r'<script>\s*firebase\.initializeApp\(\{.*?</script>', stub, src, flags=re.S)

harness = r'''<script>
window.addEventListener('load',function(){setTimeout(runDiag,1500);});
function runDiag(){
 var L=[], err=[];
 function log(x){L.push(x);}
 function ok(name,cond,extra){ L.push((cond?'✓ ':'✗ FAIL ')+name+(extra&&!cond?'  ['+extra+']':'')); if(!cond)err.push(name); }
 function rk(id){ var el=document.getElementById('sk-prof-'+id); return el?parseInt(el.value||0):-1; }
 function setrk(id,v){ var el=document.getElementById('sk-prof-'+id); if(el)el.value=String(v); }
 try{
  if(typeof state==='undefined'){err.push('NO state');return show();}
  if(typeof recalcAll!=='function'){err.push('recalcAll MISSING');return show();}
  if(typeof applyGrowthSkills!=='function'){err.push('applyGrowthSkills MISSING');return show();}
  if(typeof clearGrowthSkills!=='function'){err.push('clearGrowthSkills MISSING');return show();}
  if(typeof _stripGrowthFromSkillProfs!=='function'){err.push('_stripGrowthFromSkillProfs MISSING');return show();}
  // 실제 존재하는 비-lore 스킬 3개 선택
  var ids = (typeof SKILLS!=='undefined'?SKILLS.filter(function(s){return !s.isLore;}).map(function(s){return s.id;}):[]);
  ok('SKILLS 로드 + sk-prof DOM 존재', ids.length>=4 && rk(ids[0])>=0, 'ids='+ids.length);
  var A=ids[0], B=ids[1], C=ids[2];
  // 초기화 헬퍼: 전 스킬 0 + 성장 비우고 추적배열 리셋
  function reset(){ ids.forEach(function(i){setrk(i,0);}); state.growth={}; state._growthTrainedSkills=[]; state._growthIncreasedSkills=[]; state.selectedHeritage=null; state.selectedBackground=null; state.selectedClass=null; state.feats={special:[],ancestry:[],class:[],general:[],skill:[],archetype:[],other:[]}; }

  // ── T1: 성장 훈련 단일출처 부여/제거 ──
  reset();
  state.growth={1:{skillTraining:[A]}};
  recalcAll();
  ok('T1 훈련 부여 A=2', rk(A)===2, 'A='+rk(A));
  state.growth[1].skillTraining=[null]; recalcAll();
  ok('T1 훈련 제거 A=0', rk(A)===0, 'A='+rk(A));

  // ── T2: 다중출처(base 2 + 성장 훈련) → 성장 제거해도 base 유지 (핵심 버그) ──
  reset();
  setrk(B,2);  // base(클래스고정 상당, 재파생 아님) 직접 세팅
  state.growth={1:{skillTraining:[B]}};
  recalcAll();
  ok('T2 부여 B=2', rk(B)===2, 'B='+rk(B));
  state.growth[1].skillTraining=[null]; recalcAll();
  ok('T2 성장 제거 후 base 유지 B=2', rk(B)===2, 'B='+rk(B)+' (버그면 0)');

  // ── T3: 향상 누적(base2→4→6) + 역순 제거 ──
  reset();
  setrk(C,2);  // base 훈련
  state.growth={3:{skillIncrease:C},7:{skillIncrease:C}};
  recalcAll();
  ok('T3 향상 누적 C=6', rk(C)===6, 'C='+rk(C));
  state.growth[7].skillIncrease=null; recalcAll();
  ok('T3 L7 제거 C=4', rk(C)===4, 'C='+rk(C));
  state.growth[3].skillIncrease=null; recalcAll();
  ok('T3 L3 제거 C=2(base 유지)', rk(C)===2, 'C='+rk(C));

  // ── T4: strip — baked 값에서 성장 걷어내고 재파생(이중적용 방지) ──
  reset();
  state.selectedClass={id:'x',fixed_skills:[A]};  // A는 클래스고정 base
  state.initialChoices={class:{chosenFixedSkills:[]}};
  state.growth={1:{skillTraining:[B]},3:{skillIncrease:B}};
  // baked 상태 재현: A=2(클래스), B=4(훈련2+향상2)
  setrk(A,2); setrk(B,4);
  _stripGrowthFromSkillProfs();
  ok('T4 strip 후 A=2(클래스고정 보존)', rk(A)===2, 'A='+rk(A));
  ok('T4 strip 후 B=0(성장 전용 걷어냄)', rk(B)===0, 'B='+rk(B));
  recalcAll();
  ok('T4 재파생 후 B=4(이중적용 아님)', rk(B)===4, 'B='+rk(B)+' (이중이면 6)');
  ok('T4 재파생 후 A=2', rk(A)===2, 'A='+rk(A));
  // strip+재파생 후 성장 전량 제거 → 유령 없음
  state.growth[1].skillTraining=[null]; state.growth[3].skillIncrease=null; recalcAll();
  ok('T4 성장 제거 후 B=0(유령 없음)', rk(B)===0, 'B='+rk(B));
  ok('T4 A=2 유지', rk(A)===2, 'A='+rk(A));

  // ── T5: strip — 클래스고정 + 성장훈련 중복 시 base 보존 ──
  reset();
  state.selectedClass={id:'x',fixed_skills:[A]};
  state.initialChoices={class:{chosenFixedSkills:[]}};
  state.growth={1:{skillTraining:[A]}};  // 중복 선택
  setrk(A,2);
  _stripGrowthFromSkillProfs();
  ok('T5 strip: 클래스고정+성장 중복 A=2 보존', rk(A)===2, 'A='+rk(A));

  show();
 }catch(e){ err.push('EXCEPTION: '+e.message+' @'+(e.stack||'').split('\n')[1]); show(); }
 function show(){
  var d=document.createElement('div'); d.id='preview-diag';
  d.textContent='=== 성장 스킬 출처기반 검증 ===\n'+L.join('\n')+'\n\n'+(err.length? ('RESULT: '+err.length+' FAIL'):'RESULT: ALL PASS');
  document.body.appendChild(d);
 }
}
</script>'''
src = src.replace('</body>', harness + '\n</body>')
out = os.path.join(os.path.dirname(__file__), '..', '_growth_test.html')
open(out, 'w', encoding='utf-8').write(src)
print('wrote', out)
