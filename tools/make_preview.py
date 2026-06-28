#!/usr/bin/env python3
"""dev/_preview.html 생성기 — CharacterSheet.html에서 Firebase를 스텁하고
샘플 캐릭터로 모든 탭을 스택 렌더하는 오프라인 미리보기를 만든다(검증용).
사용: cd dev && python3 ../tools/make_preview.py  (→ dev/_preview.html)"""
import re, os
base = os.path.join(os.path.dirname(__file__), '..', 'dev', 'CharacterSheet.html')
src = open(base, encoding='utf-8').read()
src = re.sub(r'<script src="https://www\.gstatic\.com/firebasejs/[^"]+"></script>\s*', '', src)
stub = '''<script>
/* PREVIEW STUB: Firebase 무력화 */
window.firebase={initializeApp:function(){return {};},auth:function(){return {onAuthStateChanged:function(){},currentUser:null,signOut:function(){return Promise.resolve();}};},firestore:function(){var n={get:function(){return Promise.reject('stub');},set:function(){return Promise.resolve();},update:function(){return Promise.resolve();},delete:function(){return Promise.resolve();},onSnapshot:function(){return function(){};},collection:function(){return n;},doc:function(){return n;},where:function(){return n;},orderBy:function(){return n;},limit:function(){return n;},add:function(){return Promise.resolve({id:'x'});}};return {collection:function(){return n;},doc:function(){return n;}};}};
window.firebase.firestore.FieldValue={serverTimestamp:function(){return null;},delete:function(){return null;},arrayUnion:function(){return null;},increment:function(){return 0;}};
var auth=firebase.auth();var db=firebase.firestore();
</script>'''
src = re.sub(r'<script>\s*firebase\.initializeApp\(\{.*?const db = firebase\.firestore\(\);\s*</script>', stub, src, flags=re.S)
harness = '''<script>
window.addEventListener('load',function(){setTimeout(runPreview,300);});
function runPreview(){try{
 var L=document.getElementById('f-level');if(L)L.value=5;
 state.selectedClass={id:'sorcerer',name:'소서러',casting:'spontaneous',keyAbility:'cha'};
 state.selectedAncestry={id:'dwarf',name:'드워프'};state.selectedBackground={id:'warrior',name:'전사'};
 state.weapons=[{name:'롱소드',damage:'1d8',dmgType:'참격',hands:1,_held:true,category:'군용',group:'검',traits:['다용도 P']}];
 state.equip=[{name:'풀 플레이트',_type:'armor',_data:{ac_bonus:6,dex_cap:0,category:'중량'},qty:1,bulk:4}];
 state.feats={special:[],ancestry:[{name:'드워프 특성'}],class:[{name:'주문 레퍼토리'}],general:[],skill:[{name:'재빠른 소집'}],archetype:[],other:[]};
 state.spells={cantrip:['빛','산성 물줄기'],known:[{rank:1,name:'마법 화살'},{rank:1,name:'방패'},{rank:2,name:'타오르는 손'}],focus:[],innate:[]};
 state.spellSlots={1:3,2:2};
 if(typeof recalcAll==='function')try{recalcAll();}catch(e){console.warn('recalc',e);}
 ['renderWeapons','renderArmorCard','renderShieldCard','renderEquip','renderContainers','renderFormulas','renderSpells','renderFeats','renderPets','buildSkills','buildConditions'].forEach(function(fn){if(typeof window[fn]==='function'){try{window[fn]();}catch(e){console.warn(fn,e);}}});
 if(typeof switchSpellSubtab==='function'){try{switchSpellSubtab('class');}catch(e){}}
 document.querySelectorAll('.panel').forEach(function(p){p.style.display='block';p.style.borderBottom='3px solid var(--accent)';var t=document.createElement('div');t.textContent='▼ '+p.id;t.style.cssText='font-size:11px;color:var(--accent);font-weight:700;padding:6px 4px;';p.insertBefore(t,p.firstChild);});
 var rc=document.getElementById('right-content');if(rc){rc.style.overflow='visible';rc.style.height='auto';}
 var al=document.getElementById('app-layout');if(al){al.style.height='auto';al.style.overflow='visible';}
 console.log('[preview] done');
}catch(e){console.error('[preview] fail',e);}}
</script>
</body>'''
src = src.replace('</body>', harness, 1)
out = os.path.join(os.path.dirname(__file__), '..', 'dev', '_preview.html')
open(out,'w',encoding='utf-8').write(src)
print('wrote', out)
