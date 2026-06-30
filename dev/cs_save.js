// ═══════════════════════════════════════════════
//  SAVE / LOAD  (Firebase 슬롯 자동저장)
// ═══════════════════════════════════════════════

let _autoSaveDebounce = null;
let _lastSavedJson = null; // 직전 저장 JSON — 동일 데이터 중복 write 방지

// ── 동시편집 보호 (stale/파괴적 덮어쓰기 방지) ──────────────────────
// 현재 편집 중인 캐릭터 슬롯의 마지막으로 본 클라우드 버전(서버 updatedAt millis)
let _baseUpdatedAt = 0;
let _lastWrittenJson = null;      // 내가 마지막으로 성공 저장한 json (내 쓰기 에코 식별용)
function _docUpdatedMillis(d) { try { var t = d && d.updatedAt; return (t && t.toMillis) ? t.toMillis() : 0; } catch (e) { return 0; } }
function noteCloudVersion(doc) { try { if (doc && doc.exists) { var m = _docUpdatedMillis(doc.data()); if (m > _baseUpdatedAt) _baseUpdatedAt = m; } } catch (e) {} }
function resetCloudVersion(doc) { try { _baseUpdatedAt = (doc && doc.exists) ? _docUpdatedMillis(doc.data()) : 0; if (doc && doc.exists && doc.data().data) _lastWrittenJson = doc.data().data; } catch (e) { _baseUpdatedAt = 0; } }

// 캐릭터 데이터 풍부도 — 파괴적(전체 손실급) 덮어쓰기 감지용
function _charRichness(data) {
  if (typeof data === 'string') { try { data = JSON.parse(data); } catch (e) { return 0; } }
  if (!data || typeof data !== 'object') return 0;
  var s = 0;
  var nm = data.fields && data.fields.name; if (nm && String(nm).trim()) s += 2;
  if (data.selectedClass) s += 3; if (data.selectedAncestry) s += 1; if (data.selectedHeritage) s += 1;
  var lv = parseInt(data.fields && data.fields.level) || 1; if (lv > 1) s += Math.min(lv, 20);
  function cnt(o) { var n = 0; if (o && typeof o === 'object') for (var k in o) if (Array.isArray(o[k])) n += o[k].length; return n; }
  s += cnt(data.feats) + cnt(data.spells) + cnt(data.boosts);
  if (Array.isArray(data.weapons)) s += data.weapons.length;
  if (Array.isArray(data.equip)) s += data.equip.length;
  if (data.growth && typeof data.growth === 'object') s += Object.keys(data.growth).length;
  return s;
}

// 트랜잭션 안전 저장: (1)클라우드가 내가 본 버전보다 최신이면 stale → 덮어쓰지 않음(들어오는 onSnapshot이 동기화)
//                    (2)기존이 풍부한데 새 데이터가 절반 미만으로 급감하면 파괴적 → 차단.
// resolve → {skipped:false|'stale'|'destructive', oldR, newR}
function safeSaveCharacter(ref, payload) {
  return firebase.firestore().runTransaction(function (tx) {
    return tx.get(ref).then(function (snap) {
      var cloudMs = snap.exists ? _docUpdatedMillis(snap.data()) : 0;
      var cloudData = snap.exists ? snap.data().data : null;
      if (snap.exists && cloudMs > _baseUpdatedAt + 200 && cloudData !== _lastWrittenJson) {
        return { skipped: 'stale' };
      }
      if (cloudData) {
        var oldR = _charRichness(cloudData), newR = _charRichness(payload.data);
        if (oldR >= 8 && newR < Math.ceil(oldR * 0.5)) return { skipped: 'destructive', oldR: oldR, newR: newR };
      }
      tx.set(ref, payload);
      return { skipped: false };
    });
  });
}

function save() {
  const st = document.getElementById('save-status');
  if (st) { st.textContent = '미저장'; st.style.color = '#f5c518'; }
  if (_autoSaveDebounce) clearTimeout(_autoSaveDebounce);
  var delay = (typeof _sessionMode !== 'undefined' && _sessionMode) ? 500 : 2000;
  _autoSaveDebounce = setTimeout(() => { autoSaveNow(); }, delay);
}

function autoSaveNow() {
  if (typeof currentUser === 'undefined' || !currentUser) {
    const st = document.getElementById('save-status');
    if (st) { st.textContent = '로그인 필요'; st.style.color = '#e74c3c'; }
    return;
  }
  const st = document.getElementById('save-status');
  const data = collectData();
  const json = JSON.stringify(data);
  // 변경 없음 — write 스킵
  if (json === _lastSavedJson) {
    if (st) { st.textContent = '저장완료'; st.style.color = '#27ae60'; }
    return;
  }
  if (st) { st.textContent = '저장 중...'; st.style.color = '#f5c518'; }
  const db2 = firebase.firestore();
  const ref = db2.collection('users').doc(currentUser.uid).collection(PF_COL.characters).doc(currentSlot);
  safeSaveCharacter(ref, {
    data: json,
    name: (data.fields && data.fields.name) || '이름 없음',   // 실제 캐릭터 이름은 fields.name (이전엔 data.name=undefined라 항상 '이름 없음' 저장되던 버그)
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then((res) => {
    if (res.skipped === 'stale') { if (st) { st.textContent = '다른 기기 변경 감지 — 동기화 중'; st.style.color = '#f5c518'; } return; }
    if (res.skipped === 'destructive') { console.warn('[autoSave] 파괴적 저장 차단', res); if (st) { st.textContent = '⚠ 빈 데이터 저장 차단됨'; st.style.color = '#e74c3c'; } return; }
    _lastSavedJson = json; _lastWrittenJson = json;
    if (typeof _refreshCurrentSlotMeta === 'function') _refreshCurrentSlotMeta(data);  // 슬롯 표시(이름·시간) 즉시 갱신
    if (st) { st.textContent = '저장완료'; st.style.color = '#27ae60'; }
  }).catch((e) => {
    if (st) { st.textContent = '저장 실패'; st.style.color = '#e74c3c'; }
    console.error('[autoSave] error:', e);
  });
}

function collectData() {
  const data = {
    fields: {
      name: document.getElementById('f-name')?.value,
      level: document.getElementById('f-level')?.value,
      xp: document.getElementById('f-xp')?.value,
      notes: document.getElementById('f-notes')?.value,
      languages: document.getElementById('f-languages')?.value,
      combatNotes: document.getElementById('combat-notes')?.value,
      equipNotes: document.getElementById('equip-notes')?.value,
      speed: document.getElementById('speed')?.value,
    },
    boosts: state.boosts,
    hp: {cur:document.getElementById('hp-cur')?.value, max:document.getElementById('hp-max')?.value, temp:document.getElementById('hp-temp')?.value},
    dying: document.getElementById('dying')?.value,
    wounded: document.getElementById('wounded')?.value,
    heroPoints: document.getElementById('hero-points')?.value,
    shieldHpCur: document.getElementById('shield-hp-cur')?.value,
    profs: {
      ac: document.getElementById('prof-ac')?.value,
      fort: document.getElementById('prof-fort')?.value,
      ref: document.getElementById('prof-ref')?.value,
      will: document.getElementById('prof-will')?.value,
      perc: document.getElementById('prof-perc')?.value,
      classdc: document.getElementById('prof-classdc')?.value,
      spatk: document.getElementById('prof-spatk')?.value,
      weaponSimple: document.getElementById('prof-weapon-simple')?.value,
      weaponMartial: document.getElementById('prof-weapon-martial')?.value,
      weaponAdvanced: document.getElementById('prof-weapon-advanced')?.value,
      weaponUnarmed: document.getElementById('prof-weapon-unarmed')?.value,
      armorLight: document.getElementById('prof-armor-light')?.value,
      armorMedium: document.getElementById('prof-armor-medium')?.value,
      armorHeavy: document.getElementById('prof-armor-heavy')?.value,
      armorUnarmored: document.getElementById('prof-armor-unarmored')?.value,
    },
    skillProfs: {}, loreNames: {},
    armor:  {name:document.getElementById('armor-name')?.value,  ac:document.getElementById('armor-ac')?.value,   dex:document.getElementById('armor-dex')?.value},
    shield: {name:document.getElementById('shield-name')?.value, ac:document.getElementById('shield-ac')?.value,  hard:document.getElementById('shield-hard')?.value, hp:document.getElementById('shield-hp')?.value},
    spell:  {tradition:document.getElementById('spell-tradition')?.value, type:document.getElementById('spell-type')?.value, fpCur:document.getElementById('fp-cur')?.value, fpMax:document.getElementById('fp-max')?.value},
    spellSlots: {},
    currency: {gp:parseInt(document.getElementById('cur-gp')?.value)||0, sp:parseInt(document.getElementById('cur-sp')?.value)||0, cp:parseInt(document.getElementById('cur-cp')?.value)||0, pp:parseInt(document.getElementById('cur-pp')?.value)||0},
    selectedClass:      state.selectedClass?.id      || null,
    selectedSubclass:   state.selectedSubclass?.id   || null,
    selectedAncestry:   state.selectedAncestry?.id   || null,
    selectedBackground: state.selectedBackground?.id || null,
    selectedHeritage:   state.selectedHeritage?.id   || null,
    weapons: state.weapons, equip: state.equip, containers: state.containers || [], formulas: state.formulas || [], languages: state.languages || [], pets: state.pets || [],
    spells: state.spells, spellSlots: state.spellSlots, spellSlotsUsed: state.spellSlotsUsed, cantripSlots: state.cantripSlots || 5,
    feats: state.feats, conditions: state.conditions,
    growth: state.growth,
    vision: state.vision || null,
    size: state.size || null,
    trainableSkillSlots: state.trainableSkillSlots || 0,
    armorPotency: state.armorPotency || 0,
    armorResilient: state.armorResilient || 0,
    armorStowed: state.armorStowed || false,
    shieldStowed: state.shieldStowed || false,
    extraSpeeds: state.extraSpeeds || {},
    shieldRaised: state.shieldRaised || false,
    innateSpellsUsed: state.innateSpellsUsed || {},
    tempSkillTrained: state.tempSkillTrained || null,
    tempSkillExpert: state.tempSkillExpert || null,
    deity: state.deity || null,
    divineFont: state.divineFont || null,
    sanctification: state.sanctification || null,
    divineFontUsed: state.divineFontUsed || 0,
    signatureSpells: state.signatureSpells || {},
    familiarSpells: state.familiarSpells || null,
    preparedSpells: state.preparedSpells || null,
    initialChoices: state.initialChoices || null,
    portrait: state.portrait || null,
  };
  SKILLS.forEach(sk => {
    data.skillProfs[sk.id] = document.getElementById('sk-prof-'+sk.id)?.value;
    if (sk.isLore) data.loreNames[sk.id] = document.getElementById('lore-name-'+sk.id)?.value;
  });
  for (let r=1; r<=10; r++) {
    // CLASS_SPELL_TABLE 기반 클래스는 state 값 그대로 저장 (숫자)
    const hasAutoSlots = typeof getClassSpellData === 'function' && getClassSpellData();
    if (hasAutoSlots) {
      data.spellSlots[r] = state.spellSlots?.[r] || 0;
    } else {
      const domMax = document.getElementById(`slots-max-${r}`)?.value;
      data.spellSlots[r] = {
        max: domMax !== undefined ? domMax : (state.spellSlots?.[r] || 0),
        checks: Array.from(document.querySelectorAll(`#slot-checks-${r} input`)).map(c=>c.checked),
      };
    }
  }
  return data;
}

function loadData(d) {
  const wasLoadComplete = _loadComplete;
  try {
    if (!d) return;
    // 로드 중 자동저장 방지
    _loadComplete = false;

    // Fields
    if (d.boosts) {
      Object.assign(state.boosts, d.boosts);
    }
    state.portrait = d.portrait || null;
    if (typeof renderPortrait === 'function') renderPortrait();
    if (d.fields) {
      ['name','level','xp','notes','languages','speed'].forEach(f => {
        const el = document.getElementById('f-'+f) || document.getElementById(f);
        if (el && d.fields[f] !== undefined) el.value = d.fields[f];
      });
      if (d.fields.combatNotes) document.getElementById('combat-notes').value = d.fields.combatNotes;
      if (d.fields.equipNotes) document.getElementById('equip-notes').value = d.fields.equipNotes;
      if (d.fields.speed) document.getElementById('speed').value = d.fields.speed;
    }
    // Attrs: now calculated from boosts (no direct attr input)
    // HP
    if (d.hp) {
      ['cur','max','temp'].forEach(t => {
        if (d.hp[t]!==undefined) document.getElementById('hp-'+t).value = d.hp[t];
      });
      // HP max는 항상 recalcAll → updateHP()에서 재계산
      // 현재 HP만 로드값 유지
    }
    if (d.dying !== undefined) document.getElementById('dying').value = d.dying;
    if (d.wounded !== undefined) document.getElementById('wounded').value = d.wounded;
    if (d.heroPoints !== undefined) { document.getElementById('hero-points').value = d.heroPoints; loadHeroPoints(d.heroPoints); }
    if (d.shieldHpCur !== undefined && document.getElementById('shield-hp-cur')) document.getElementById('shield-hp-cur').value = d.shieldHpCur;

    // Profs
    if (d.profs) {
      ['ac','fort','ref','will','perc','classdc','spatk'].forEach(p => {
        const el = document.getElementById('prof-'+p);
        if (el && d.profs[p] !== undefined) el.value = d.profs[p];
      });
      // Weapon proficiencies
      const wpMap = {weaponSimple:'simple',weaponMartial:'martial',weaponAdvanced:'advanced',weaponUnarmed:'unarmed'};
      for (const [key,cat] of Object.entries(wpMap)) {
        if (d.profs[key] !== undefined) {
          const el = document.getElementById('prof-weapon-'+cat);
          if (el) el.value = d.profs[key];
        }
      }
      initWeaponProfBadges();
      // Armor proficiencies
      const apMap = {armorLight:'light',armorMedium:'medium',armorHeavy:'heavy',armorUnarmored:'unarmored'};
      for (const [key,cat] of Object.entries(apMap)) {
        if (d.profs[key] !== undefined) {
          const el = document.getElementById('prof-armor-'+cat);
          if (el) el.value = d.profs[key];
        }
      }
      initArmorProfBadges();
      if (typeof syncAllTeml === 'function') syncAllTeml();
    }
    // Skills
    if (d.skillProfs) {
      SKILLS.forEach(sk => {
        if (d.skillProfs[sk.id] !== undefined) {
          const el = document.getElementById('sk-prof-'+sk.id);
          if (el) el.value = d.skillProfs[sk.id];
        }
        if (sk.isLore && d.loreNames?.[sk.id]) {
          const el = document.getElementById('lore-name-'+sk.id);
          if (el) el.value = d.loreNames[sk.id];
        }
      });
    }
    // Armor/Shield
    if (d.armor) {
      ['name','ac','dex'].forEach(k => {
        const el = document.getElementById('armor-'+k);
        if (el && d.armor[k] !== undefined) el.value = d.armor[k];
      });
    }
    if (d.shield) {
      ['name','ac','hard','hp'].forEach(k => {
        const el = document.getElementById('shield-'+k);
        if (el && d.shield[k] !== undefined) el.value = d.shield[k];
      });
    }
    // Armor/Shield state
    if (d.armorPotency !== undefined) state.armorPotency = d.armorPotency;
    if (d.armorResilient !== undefined) state.armorResilient = d.armorResilient;
    if (d.armorStowed !== undefined) state.armorStowed = d.armorStowed;
    if (d.shieldStowed !== undefined) state.shieldStowed = d.shieldStowed;
    renderArmorCard();
    renderShieldCard();
    // Spell
    if (d.spell) {
      ['tradition','type'].forEach(k => {
        const el = document.getElementById('spell-'+k);
        if (el && d.spell[k] !== undefined) el.value = d.spell[k];
      });
      if (d.spell.fpCur !== undefined) document.getElementById('fp-cur').value = d.spell.fpCur;
      if (d.spell.fpMax !== undefined) document.getElementById('fp-max').value = d.spell.fpMax;
    }
    // Spell slots
    if (d.spellSlots) {
      for (let r=1;r<=10;r++) {
        if (d.spellSlots[r]) {
          const maxEl = document.getElementById(`slots-max-${r}`);
          if (maxEl) { maxEl.value = d.spellSlots[r].max||0; updateSlotChecks(r); }
          setTimeout(() => {
            const checks = document.querySelectorAll(`#slot-checks-${r} input`);
            (d.spellSlots[r].checks||[]).forEach((v,i) => { if(checks[i]) checks[i].checked = v; });
          }, 50);
        }
      }
    }
    // Currency
    if (d.currency) {
      ['gp','sp','cp','pp'].forEach(c => {
        const el = document.getElementById('cur-'+c);
        if (el && d.currency[c] !== undefined) el.value = parseInt(d.currency[c]) || 0;  // 앞자리 0 제거
      });
    }
    // State objects
    if (d.selectedClass) {
      state.selectedClass = CLASSES.find(c=>c.id===d.selectedClass)||null;
      if (state.selectedClass) {
        const btn = document.getElementById('btn-class');
        if (btn) { btn.textContent = `${state.selectedClass.name} (${state.selectedClass.en})`; btn.classList.add('filled'); }
        const subBtn = document.getElementById('btn-subclass');
        if (subBtn) {
          const hasSub = SUBCLASS_DB.some(s => s.class_id === state.selectedClass.id);
          subBtn.style.display = hasSub ? '' : 'none';
        }
      }
    }
    if (d.selectedSubclass) {
      state.selectedSubclass = SUBCLASS_DB.find(s=>s.id===d.selectedSubclass)||null;
      if (state.selectedSubclass) {
        const btn = document.getElementById('btn-subclass');
        if (btn) {
          btn.textContent = `${state.selectedSubclass.subclass_type}: ${state.selectedSubclass.name_ko}`;
          btn.classList.add('filled');
        }
      }
    }
    const _ancReady = (typeof PF2eAnc !== 'undefined' && PF2eAnc.ready && PF2eAnc.ready());
    if (d.selectedAncestry) {
      state.selectedAncestry = (_ancReady && PF2eAnc.getAncestryLegacy(d.selectedAncestry)) || ANCESTRIES.find(a=>a.id===d.selectedAncestry)||null;
      if (state.selectedAncestry) {
        const btn = document.getElementById('btn-ancestry');
        if (btn) { btn.textContent = `${state.selectedAncestry.name} (${state.selectedAncestry.en})`; btn.classList.add('filled'); }
      }
    }
    if (d.selectedBackground) {
      state.selectedBackground = ((typeof PF2eBg !== 'undefined' && PF2eBg.ready && PF2eBg.ready() && PF2eBg.getBackgroundLegacy(d.selectedBackground))) || BACKGROUNDS.find(b=>b.id===d.selectedBackground)||null;
      if (state.selectedBackground) {
        const btn = document.getElementById('btn-background');
        if (btn) { btn.textContent = `${state.selectedBackground.name} (${state.selectedBackground.en})`; btn.classList.add('filled'); }
      }
    }
    if (d.selectedHeritage) {
      state.selectedHeritage = (_ancReady && PF2eAnc.getHeritageLegacy(d.selectedHeritage)) || HERITAGE_DB.find(h=>h.id===d.selectedHeritage)||null;
      if (state.selectedHeritage) {
        const btn = document.getElementById('btn-heritage');
        if (btn) { btn.textContent = state.selectedHeritage.name_ko; btn.classList.add('filled'); }
      }
    }
    if (d.weapons) { state.weapons = d.weapons; renderWeapons(); }
    if (d.equip) {
      // _equipped → _holdMode 마이그레이션
      d.equip.forEach(e => {
        if (e._holdMode === undefined && e._equipped) {
          if (e._type === 'armor') e._holdMode = 'worn';
          else e._holdMode = 'one';
        }
        if (!e._holdMode) e._holdMode = 'stowed';
      });
      state.equip = d.equip; renderEquip();
    }
    if (d.containers) { state.containers = d.containers; if (typeof renderContainers === 'function') renderContainers(); }
    if (d.formulas) { state.formulas = d.formulas; if (typeof renderFormulas === 'function') renderFormulas(); }
    if (d.languages) {
      // v526~: 한글 이름 → id 마이그레이션 (LANGUAGES.name_ko 매칭)
      state.languages = d.languages.map(l => {
        const found = (typeof getLanguage === 'function') ? getLanguage(l) : null;
        return found ? found.id : l;
      });
      if (typeof renderLanguages === 'function') renderLanguages();
    }
    if (d.pets) { state.pets = d.pets; if (typeof renderPets === 'function') renderPets(); }
    if (d.extraSpeeds) state.extraSpeeds = d.extraSpeeds;
    if (d.shieldRaised) state.shieldRaised = d.shieldRaised;
    if (d.spells) {
      state.spells = d.spells;
      // 배열 필드 보장 (이전 저장 호환)
      if (!state.spells.cantrip) state.spells.cantrip = [];
      if (!state.spells.known) state.spells.known = [];
      if (!state.spells.focus) state.spells.focus = [];
      if (!state.spells.innate) state.spells.innate = [];
      // v524~: id 마이그레이션 (id 없는 항목에 SPELL_DB lookup으로 자동 부여)
      for (const k of ['cantrip','known','focus','innate']) {
        for (const it of state.spells[k]) {
          if (!it || it.id || !it.name) continue;
          const sp = (typeof getSpell === 'function') ? getSpell(it.name) : null;
          if (sp) it.id = sp.id;
        }
      }
    }
    if (d.spellSlots) {
      state.spellSlots = {};
      // 이전 저장 형식({max,checks}) → 숫자로 정규화
      for (let r = 1; r <= 10; r++) {
        const v = d.spellSlots[r];
        if (v && typeof v === 'object' && v.max !== undefined) {
          state.spellSlots[r] = parseInt(v.max) || 0;
        } else {
          state.spellSlots[r] = parseInt(v) || 0;
        }
      }
    }
    if (d.spellSlotsUsed) state.spellSlotsUsed = d.spellSlotsUsed;
    if (d.cantripSlots) state.cantripSlots = d.cantripSlots;
    renderSpells();
    if (d.feats) {
      state.feats = d.feats;
      // 배열 필드 보장
      ['special','ancestry','class','general','skill','archetype','other'].forEach(k => {
        if (!state.feats[k]) state.feats[k] = [];
      });
      // 유령 재주 정리: growth에 대응되지 않는 비-자동/비-부여 재주 제거
      if (d.growth) {
        const growthFeatNames = new Set();
        Object.values(d.growth).forEach(g => {
          if (!g || typeof g !== 'object') return;
          Object.entries(g).forEach(([k,v]) => { if (typeof v === 'string' && k !== 'skillIncrease' && k !== 'skillTraining') growthFeatNames.add(v); });
        });
        ['ancestry','class','general','skill','archetype','other'].forEach(cat => {
          const arr = state.feats[cat];
          for (let i = arr.length - 1; i >= 0; i--) {
            const f = arr[i];
            if (!f?.name || f._auto || f._grantedBy) continue;
            if (!growthFeatNames.has(f.name)) { arr.splice(i, 1); }
          }
        });
      }
      // 중복 재주 정리: 같은 이름+레벨의 재주 제거 (repeatable 포함)
      Object.keys(state.feats).forEach(cat => {
        const arr = state.feats[cat];
        const seen = new Set();
        for (let i = arr.length - 1; i >= 0; i--) {
          const f = arr[i];
          if (!f?.name) continue;
          const key = f.name + '|' + (f.level||1) + '|' + (f._grantedBy||'');
          if (seen.has(key)) { arr.splice(i, 1); continue; }
          seen.add(key);
        }
      });
      // v524~: id 마이그레이션 (id 없는 항목에 FEAT_DB lookup으로 자동 부여)
      // archetype 재주는 name_ko가 "한글 (English)" 형식이라 전체 매칭 우선,
      // 일반 카테고리는 한글만 들어있어 split 후 매칭으로 폴백
      Object.keys(state.feats).forEach(cat => {
        for (const it of state.feats[cat]) {
          if (!it || it.id || !it.name) continue;
          let fd = (typeof getFeat === 'function') ? getFeat(it.name) : null;
          if (!fd && typeof getFeat === 'function') {
            const nameKo = it.name.split(' (')[0].trim();
            fd = getFeat(nameKo);
          }
          if (fd) it.id = fd.id;
        }
      });
      renderFeats();
    }
    if (d.growth) { state.growth = d.growth; }
    applyClassFeatures();
    if (typeof syncGrowthSpellsToState === 'function') syncGrowthSpellsToState();
    if (typeof syncFamiliarSpellsToState === 'function') syncFamiliarSpellsToState();
    renderGrowthPlan();
    if (d.conditions) {
      state.conditions = d.conditions;
      // v369: 상태 키 마이그레이션 (구 용어 → 신 용어)
      const _condMigrate = {둔함:'서투름',약화됨:'약화',혼미:'현기증',행동감소:'둔화',고정됨:'고정',방어불가:'무방비',발묶임:'무방비',속박됨:'구속',매혹됨:'매혹',쇠약:'탈진',은폐됨:'은폐',구역질:'메스꺼움'};
      for (const [old,nw] of Object.entries(_condMigrate)) {
        if (state.conditions[old] !== undefined) {
          state.conditions[nw] = state.conditions[old];
          delete state.conditions[old];
        }
      }
      // 값을 복원 후 buildConditions 다시 실행
      buildConditions();
    }
    // Restore extra state fields
    if (d.vision) {
      // v526~: 한글 → enum 마이그레이션
      const _vMig = {'없음':'none','저광 시야':'low-light','암시야':'darkvision','상위 암시야':'greater-darkvision'};
      state.vision = _vMig[d.vision] || d.vision;
    }
    if (d.size) state.size = d.size;
    if (d.trainableSkillSlots !== undefined) state.trainableSkillSlots = d.trainableSkillSlots;
    // Class-specific choices
    if (d.innateSpellsUsed) state.innateSpellsUsed = d.innateSpellsUsed;
    if (d.tempSkillTrained) state.tempSkillTrained = d.tempSkillTrained;
    if (d.tempSkillExpert) state.tempSkillExpert = d.tempSkillExpert;
    if (d.deity) {
      state.deity = d.deity;
      // 선호 무기 복원
      if (typeof DEITY_DB !== 'undefined') {
        const dty = DEITY_DB.find(x=>x.id===d.deity);
        if (dty) state._deityWeapon = dty.weapon;
      }
    }
    if (d.divineFont) state.divineFont = d.divineFont;
    if (d.sanctification) state.sanctification = d.sanctification;
    if (d.divineFontUsed !== undefined) state.divineFontUsed = d.divineFontUsed;
    if (d.signatureSpells) state.signatureSpells = d.signatureSpells;
    if (d.familiarSpells) state.familiarSpells = d.familiarSpells;
    if (d.preparedSpells) state.preparedSpells = d.preparedSpells;
    if (d.initialChoices) state.initialChoices = d.initialChoices;
  } catch(e) { console.warn('Load failed',e); }
  // 로드 완료 — 자동저장 복원 + 진행 중인 debounce 취소
  _loadComplete = wasLoadComplete;
  if (_autoSaveDebounce) { clearTimeout(_autoSaveDebounce); _autoSaveDebounce = null; }
}

// ── PATHBUILDER STYLE: switchTab override ──
// Override original to handle new panel IDs + mobile sidebar/center
function switchTab(id, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');

  // Mobile-only panels that mirror sidebar/center
  if (id === 'growth') {
    // 모바일: sidebar만 표시 (panel-growth 미사용 — 중복 방지)
    document.getElementById('sidebar')?.classList.add('mobile-active');
    document.getElementById('center-col')?.classList.remove('mobile-active');
  } else if (id === 'info') {
    document.getElementById('panel-info')?.classList.add('active');
    document.getElementById('center-col')?.classList.add('mobile-active');
    document.getElementById('sidebar')?.classList.remove('mobile-active');
  } else {
    document.getElementById('panel-' + id)?.classList.add('active');
    document.getElementById('sidebar')?.classList.remove('mobile-active');
    document.getElementById('center-col')?.classList.remove('mobile-active');
  }

  if (id === 'actions') renderActions();
  // 지도는 탭이 아니라 상단 바의 전체화면 토글(MapView.toggleFullscreen)로 이동됨 (v545~)
}

// Fix recalcAll to also update mobile mirror attribute displays + auto-save
let _loadComplete = false;   // true = UI 초기화 + 클라우드 로드 모두 완료
let _uiReady = false;        // window.onload 완료
let _cloudResolved = false;  // 클라우드 로드 완료 (or 로그인 안 됨)
function _checkReady() {
  if (_uiReady && _cloudResolved && !_loadComplete) {
    _loadComplete = true;
  }
}
const _origRecalcAll = recalcAll;
recalcAll = function() {
  _origRecalcAll();
  // sync mobile mirror
  ['str','dex','con','int','wis','cha'].forEach(a => {
    const src = document.getElementById('mod-' + a);
    const dst = document.getElementById('mod-' + a + '-m');
    if (src && dst) dst.textContent = src.textContent;
  });
  // UI + 클라우드 모두 준비된 후에만 자동저장
  if (_loadComplete) save();
};

// Re-init window.onload to use new tab
window.onload = function() {
  buildSkills();
  buildConditions();
  buildSpellSlots();
  initAllTemlButtons();
  initWeaponProfBadges();
  initArmorProfBadges();
  renderArmorCard();
  renderShieldCard();
  renderFeats();
  renderContainers();
  renderFormulas();
  renderLanguages();
  renderPets();
  recalcAll();
  renderGrowthPlan();
  renderPortrait();
  if (typeof MapView !== 'undefined') MapView.init();  // 지도 onChange/프로비저닝 구독 (세션 입장 시 동작)
  if (typeof _ensureEquipData === 'function') _ensureEquipData();  // FVTT 장비 카탈로그 사전 로드 (첫 브라우즈 즉시 표시)
  if (typeof _ensureAncData === 'function') _ensureAncData();      // FVTT 혈통/유산/배경 카탈로그 사전 로드 (P4, 캐릭터 생성 1단계)
  if (typeof PF2eSpell !== 'undefined') PF2eSpell.init().catch(()=>{});  // FVTT 주문 카탈로그 사전 로드 (P4)
  if (typeof PF2eFeat !== 'undefined') PF2eFeat.init().then(() => {        // FVTT 재주 카탈로그 + 교차참조 카테고리 (P4)
    // GrantItem(재주→재주/주문/효과/행동) getByUuid 해소용 — 자동화 전 인덱스 보장
    if (typeof PF2eData !== 'undefined') { PF2eData.loadCategory('effects').catch(()=>{}); PF2eData.loadCategory('actions').catch(()=>{}); }
  }).catch(()=>{});
  _uiReady = true;
  _checkReady();
};
