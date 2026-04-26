// ═══════════════════════════════════════════════
//  SAVE / LOAD  (in-memory only; use JSON 내보내기/불러오기)
// ═══════════════════════════════════════════════

let _autoSaveDebounce = null;

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
  if (st) { st.textContent = '저장 중...'; st.style.color = '#f5c518'; }
  const data = collectData();
  const db2 = firebase.firestore();
  db2.collection('users').doc(currentUser.uid).collection('characters').doc(currentSlot).set({
    data: JSON.stringify(data),
    name: data.name || '이름 없음',
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
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
    currency: {gp:document.getElementById('cur-gp')?.value, sp:document.getElementById('cur-sp')?.value, cp:document.getElementById('cur-cp')?.value, pp:document.getElementById('cur-pp')?.value},
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

function exportJSON() {
  const data = collectData();
  const charName = (document.getElementById('f-name')?.value || 'character').replace(/[^\w가-힣]/g,'_');
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${charName}_pf2e.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  const st = document.getElementById('save-status');
  st.textContent = 'JSON 내보냄';
  st.classList.add('show');
  setTimeout(() => { st.classList.remove('show'); st.textContent = '저장됨'; }, 2000);
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      loadData(JSON.parse(e.target.result));
      recalcAll();
    } catch(err) {
      alert('JSON 파일을 읽을 수 없습니다:\n' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
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
        if (el && d.currency[c] !== undefined) el.value = d.currency[c];
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
    if (d.selectedAncestry) {
      state.selectedAncestry = ANCESTRIES.find(a=>a.id===d.selectedAncestry)||null;
      if (state.selectedAncestry) {
        const btn = document.getElementById('btn-ancestry');
        if (btn) { btn.textContent = `${state.selectedAncestry.name} (${state.selectedAncestry.en})`; btn.classList.add('filled'); }
      }
    }
    if (d.selectedBackground) {
      state.selectedBackground = BACKGROUNDS.find(b=>b.id===d.selectedBackground)||null;
      if (state.selectedBackground) {
        const btn = document.getElementById('btn-background');
        if (btn) { btn.textContent = `${state.selectedBackground.name} (${state.selectedBackground.en})`; btn.classList.add('filled'); }
      }
    }
    if (d.selectedHeritage) {
      state.selectedHeritage = HERITAGE_DB.find(h=>h.id===d.selectedHeritage)||null;
      if (state.selectedHeritage) {
        const btn = document.getElementById('btn-heritage');
        if (btn) { btn.textContent = state.selectedHeritage.name_ko; btn.classList.add('filled'); }
      }
    }
    if (d.weapons) { state.weapons = d.weapons; renderWeapons(); }
    if (d.equip) { state.equip = d.equip; renderEquip(); }
    if (d.containers) { state.containers = d.containers; if (typeof renderContainers === 'function') renderContainers(); }
    if (d.formulas) { state.formulas = d.formulas; if (typeof renderFormulas === 'function') renderFormulas(); }
    if (d.languages) { state.languages = d.languages; if (typeof renderLanguages === 'function') renderLanguages(); }
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
      const _condMigrate = {둔함:'서투름',약화됨:'약화',혼미:'현기증',행동감소:'둔화',고정됨:'고정',방어불가:'무방비',속박됨:'구속',매혹됨:'매혹',쇠약:'탈진',은폐됨:'은폐',구역질:'메스꺼움'};
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
    if (d.vision) state.vision = d.vision;
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
  _uiReady = true;
  _checkReady();
};
