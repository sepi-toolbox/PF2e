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
function safeSaveCharacter(ref, payload, allowDestructive) {
  return firebase.firestore().runTransaction(function (tx) {
    return tx.get(ref).then(function (snap) {
      var cloudMs = snap.exists ? _docUpdatedMillis(snap.data()) : 0;
      var cloudData = snap.exists ? snap.data().data : null;
      if (snap.exists && cloudMs > _baseUpdatedAt + 200 && cloudData !== _lastWrittenJson) {
        return { skipped: 'stale' };
      }
      // 파괴적 저장 차단 = 버그로 인한 우발적 데이터 손실 방지. 단, 사용자가 명시적으로 초기화·코어 삭제한 경우(allowDestructive)는 우회
      //   — 안 그러면 클래스 삭제·슬롯 초기화가 클라우드에 반영 안 돼 리로드 시 옛 캐릭터가 되살아남(회귀 수정).
      if (!allowDestructive && cloudData) {
        var oldR = _charRichness(cloudData), newR = _charRichness(payload.data);
        if (oldR >= 8 && newR < Math.ceil(oldR * 0.5)) return { skipped: 'destructive', oldR: oldR, newR: newR };
      }
      tx.set(ref, payload);
      return { skipped: false };
    });
  });
}

// 명시적 초기화/코어 삭제 시 다음 저장 1회에 한해 파괴적 가드 우회(사용자 의도). autoSaveNow가 읽고 소비.
let _forceSaveDestructive = false;
// 즉시 강제 저장(디바운스 없이) — clearCoreSelection·executeReset 등 사용자 명시 행동용.
function forceSaveNow() {
  _forceSaveDestructive = true;
  if (typeof _autoSaveDebounce !== 'undefined' && _autoSaveDebounce) clearTimeout(_autoSaveDebounce);
  if (typeof autoSaveNow === 'function') autoSaveNow();
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
  const _allowDestructive = _forceSaveDestructive; _forceSaveDestructive = false;   // 이번 저장 1회만 우회
  safeSaveCharacter(ref, {
    data: json,
    name: (data.fields && data.fields.name) || '이름 없음',   // 실제 캐릭터 이름은 fields.name (이전엔 data.name=undefined라 항상 '이름 없음' 저장되던 버그)
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, _allowDestructive).then((res) => {
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
    spells: state.spells, spellSlots: state.spellSlots, spellSlotsUsed: state.spellSlotsUsed, cantripSlots: state.cantripSlots || 5, bonusSpellSlots: state.bonusSpellSlots || {},
    feats: state.feats, conditions: state.conditions,
    customLores: state.customLores || [],
    classSkillChoices: state.classSkillChoices || [],
    growth: state.growth,
    vision: state.vision || null,
    size: state.size || null,
    trainableSkillSlots: state.trainableSkillSlots || 0,
    armorPotency: state.armorPotency || 0,
    armorResilient: state.armorResilient || 0,
    armorStowed: state.armorStowed || false,
    armorMaterial: state.armorMaterial || null,
    armorBulkOverride: (state.armorBulkOverride != null ? state.armorBulkOverride : null),
    shieldStowed: state.shieldStowed || false,
    extraSpeeds: state.extraSpeeds || {},
    shieldRaised: state.shieldRaised || false,
    innateSpellsUsed: state.innateSpellsUsed || {},
    tempSkillTrained: state.tempSkillTrained || null,
    tempSkillExpert: state.tempSkillExpert || null,
    deity: state.deity || null,
    divineFont: state.divineFont || null,
    sanctification: state.sanctification || null,
    devotionSpell: state.devotionSpell || null,             // 챔피언 헌신 주문(리로드 소실 방지)
    championBlessing: state.championBlessing || null,       // 챔피언 헌신자의 축복(3레벨 택1)
    divineFontUsed: state.divineFontUsed || 0,
    bloodlineExemplar: state.bloodlineExemplar || null,   // 소서러 혈통 표본/원소/지니 유형 선택
    classFeatureChoices: state.classFeatureChoices || {}, // 클래스 특성 인라인 선택(자연의 목소리 등)
    signatureSpells: state.signatureSpells || {},
    familiarSpells: state.familiarSpells || null,
    preparedSpells: state.preparedSpells || null,
    initialChoices: state.initialChoices || null,
    portrait: state.portrait || null,
  };
  SKILLS.forEach(sk => {
    data.skillProfs[sk.id] = document.getElementById('sk-prof-'+sk.id)?.value;
    // 지식 이름: 부여(출처 소유) 슬롯은 출처의 choice에서 재파생되므로 저장 안 함(로드 시 수동 오인 방지).
    //   수동 입력 슬롯만 저장.
    if (sk.isLore && !(state._loreSlotSource && state._loreSlotSource[sk.id])) data.loreNames[sk.id] = document.getElementById('lore-name-'+sk.id)?.value;
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

// ── slug 디커플링: 이름 키 주문 저장소를 slug로 정규화 (번역 편집 안전화) ──
// 대상: growth[*].spells / growth[*].familiarSpells / signatureSpells / familiarSpells / preparedSpells.
// 미해소 값은 원문 유지(graceful). 표시는 렌더 시 spellDisplay로 재해소.
function _slugArr(a) { if (!Array.isArray(a)) return a; return a.map(x => x ? (typeof spellSlug === 'function' ? spellSlug(x) : x) : x); }
function _migrateGrowthStoresToSlug() {
  if (typeof spellSlug !== 'function' || !state.growth) return;
  for (const lv in state.growth) {
    const g = state.growth[lv]; if (!g) continue;
    if (g.spells) for (const k in g.spells) g.spells[k] = _slugArr(g.spells[k]);
    if (g.familiarSpells) {
      const gf = g.familiarSpells;
      for (const k in gf) {
        if (k === 'free') { // free = [{name,rank}|slug] → [{id,rank}]
          gf.free = (gf.free || []).map(e => {
            if (!e) return e;
            if (typeof e === 'object') return { id: spellSlug(e.id || e.name), rank: e.rank };
            return { id: spellSlug(e), rank: 0 };
          });
        } else gf[k] = _slugArr(gf[k]);
      }
    }
  }
}
function _migrateDerivedSpellStoresToSlug() {
  if (typeof spellSlug !== 'function') return;
  if (state.signatureSpells) for (const r in state.signatureSpells) { const v = state.signatureSpells[r]; if (v) state.signatureSpells[r] = spellSlug(v); }
  for (const store of [state.familiarSpells, state.preparedSpells]) {
    if (!store) continue;
    for (const k in store) if (Array.isArray(store[k])) store[k] = _slugArr(store[k]);
  }
}

// 로드 시 skillProfs에는 출처기반으로 '재파생되는' 기술 숙련(클래스 고정/선택, 신격 기술, 배경 선택기술,
// 성장 훈련/향상)이 baked돼 있음 → 걷어내서 recalcAll이 prevRank=0에서 clean 재파생하도록.
// 안 걷어내면 ①향상이 이중적용(+2 두 번) ②훈련/부여 prevRank가 stale(2)가 돼 로드 후 신격 변경·클래스 선택
// 변경·성장 슬롯 제거 시 유령 잔존(특히 신격은 reset 경로가 없어 치명적). 구/신 저장본 동일 취급(플래그 불필요).
// ⚠ state.growth·selectedClass·deity·initialChoices 로드 후, applyClassFeatures(→recalcAll) 전에 호출할 것.
// ⚠ 무기 숙련(prof-weapon-*)은 클래스 진행표(비재파생)와 공유하므로 strip 대상에서 제외 — 신격 무기숙련은
//    현행 유지(로드 후 신격 무기변경은 희소). 유산/배경고정/재주 기술도 기존 동작 보존(변경 시 각자 reset 존재).
function _stripDerivedSkillProfs() {
  const g = state.growth || {};
  const rankOf = id => parseInt(document.getElementById('sk-prof-' + id)?.value || 0);
  const setRank = (id, v) => { const el = document.getElementById('sk-prof-' + id); if (el) el.value = String(v); };
  const toId = n => (typeof skillNameToId === 'function' ? skillNameToId(n) : null);
  // 향상 strip (레벨마다 -2). 재파생이 정확히 되돌림.
  Object.keys(g).forEach(lv => {
    const inc = g[lv] && g[lv].skillIncrease;
    if (inc && rankOf(inc) > 0) setRank(inc, Math.max(0, rankOf(inc) - 2));
  });
  // 재파생되는 '트레인드 기술' 부여를 0으로 걷어냄(위 대상만).
  const ids = new Set();
  const cls = state.selectedClass;
  if (cls) (cls.fixed_skills || []).forEach(i => { if (i) ids.add(i); });
  ((state.initialChoices && state.initialChoices.class && state.initialChoices.class.chosenFixedSkills) || [])
    .forEach(n => { const i = toId(n); if (i) ids.add(i); });
  if (cls && cls.deity_skill && state.deity && typeof _getDeity === 'function') {
    const d = _getDeity(state.deity); if (d && d.skill) ids.add(d.skill);
  }
  const bgc = state.initialChoices && state.initialChoices.background && state.initialChoices.background.choiceSkill;
  if (bgc) ids.add(bgc);
  ((g[1] && g[1].skillTraining) || []).forEach(i => { if (i) ids.add(i); });
  ids.forEach(id => setRank(id, 0));
}

function loadData(d) {
  if (!d) return;
  // 로딩 게이트: 카탈로그(혈통/배경/클래스/신격/장비/주문/재주 등) 미준비면 준비 후 재실행.
  // (복원이 FVTT 카탈로그로 state 객체를 재구성 — 레거시 폴백 없이 안전하게)
  if (typeof _ensureAllCatalogs === 'function' && typeof catalogsReady === 'function' && !catalogsReady()) {
    _ensureAllCatalogs().then(() => loadData(d));
    return;
  }
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
    state.armorMaterial = (d.armorMaterial !== undefined) ? d.armorMaterial : null;
    state.armorBulkOverride = (d.armorBulkOverride !== undefined) ? d.armorBulkOverride : null;
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
      state.selectedClass = (typeof PF2eClass !== 'undefined' && PF2eClass.getClassLegacy(d.selectedClass)) || null;
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
      state.selectedAncestry = (typeof PF2eAnc !== 'undefined' && PF2eAnc.getAncestryLegacy(d.selectedAncestry)) || null;
      if (state.selectedAncestry) {
        const btn = document.getElementById('btn-ancestry');
        if (btn) { btn.textContent = `${state.selectedAncestry.name} (${state.selectedAncestry.en})`; btn.classList.add('filled'); }
      }
    }
    if (d.selectedBackground) {
      state.selectedBackground = (typeof PF2eBg !== 'undefined' && PF2eBg.getBackgroundLegacy(d.selectedBackground)) || null;
      if (state.selectedBackground) {
        const btn = document.getElementById('btn-background');
        if (btn) { btn.textContent = `${state.selectedBackground.name} (${state.selectedBackground.en})`; btn.classList.add('filled'); }
      }
    }
    if (d.selectedHeritage) {
      state.selectedHeritage = (typeof PF2eAnc !== 'undefined' && PF2eAnc.getHeritageLegacy(d.selectedHeritage)) || null;
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
      // v524~: id 마이그레이션. v0.25~: slug 정규화 + 표시명(name_ko) 재해소
      // → 저장 키는 slug(id), name은 현재 번역으로 재파생(번역 편집이 매칭에 영향 0).
      for (const k of ['cantrip','known','focus','innate']) {
        for (const it of state.spells[k]) {
          if (!it || !(it.id || it.name)) continue;
          const sp = (typeof getSpell === 'function') ? getSpell(it.id || it.name) : null;
          if (sp) { it.id = sp.id; it.name = sp.name_ko || sp.name_en || it.name; }
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
    state.bonusSpellSlots = d.bonusSpellSlots || {};
    state.customLores = Array.isArray(d.customLores) ? d.customLores : [];   // 커스텀 지식(부여 지식은 출처에서 재파생)
    state.classSkillChoices = Array.isArray(d.classSkillChoices) ? d.classSkillChoices : [];   // 택1 클래스 스킬
    renderSpells();
    if (d.feats) {
      state.feats = d.feats;
      // 배열 필드 보장
      ['special','ancestry','class','general','skill','archetype','other'].forEach(k => {
        if (!state.feats[k]) state.feats[k] = [];
      });
      // 유령 재주 정리: growth에 대응되지 않는 비-자동/비-부여 재주 제거.
      // ⚠ growth는 이름/슬러그/개명본이 섞일 수 있음(FVTT 단일소스 이행 후 name_ko 개명 포함) →
      //    name·id·slug 3중 매칭으로 판정(하나라도 맞으면 유지). 이름만 비교하면 slug-growth가
      //    실제 재주를 전부 삭제함(회귀 사고). featSlug로 양측을 slug 정규화해 비교.
      if (d.growth) {
        const growthRefs = new Set();
        Object.values(d.growth).forEach(g => {
          if (!g || typeof g !== 'object') return;
          Object.entries(g).forEach(([k,v]) => {
            if (typeof v === 'string' && k !== 'skillIncrease' && k !== 'skillTraining') {
              growthRefs.add(v);
              if (typeof featSlug === 'function') { try { const sl = featSlug(v); if (sl) growthRefs.add(sl); } catch (e) {} }
            }
          });
        });
        ['ancestry','class','general','skill','archetype','other'].forEach(cat => {
          const arr = state.feats[cat];
          for (let i = arr.length - 1; i >= 0; i--) {
            const f = arr[i];
            if (!f?.name || f._auto || f._grantedBy) continue;
            let keep = growthRefs.has(f.name) || (f.id && growthRefs.has(f.id));
            if (!keep && typeof featSlug === 'function') { try { const sl = featSlug(f.id || f.name); if (sl && growthRefs.has(sl)) keep = true; } catch (e) {} }
            if (!keep) arr.splice(i, 1);
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
          // dedup 키 = slug(있으면) 기준 — 이름 표기 불일치에도 견고. 미해소 시 이름 폴백.
          const _s = (typeof featSlug === 'function') ? featSlug(f) : null;
          const key = (_s || f.name) + '|' + (f.level||1) + '|' + (f._grantedBy||'');
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
          // v0.25~: id 확정 시 표시명 재파생(번역 편집 반영). 아키타입은 name_ko가 "한글 (English)" 형식 유지.
          if (fd && fd.name_ko) it.name = fd.name_ko;
        }
      });
      renderFeats();
    }
    if (d.growth) { state.growth = d.growth; }
    _migrateGrowthStoresToSlug(); // 동기화 전에 growth를 slug로 정규화 → sync가 slug로 파생
    // initialChoices(선택형 고정기술 등)를 strip 전에 복원해야 함 — 아래 strip이 chosenFixedSkills를 참조.
    if (d.initialChoices) state.initialChoices = d.initialChoices;
    // 재파생 대상 기술 숙련(클래스/신격/배경선택/성장)을 skillProfs에서 걷어냄 → recalcAll이 clean 재파생.
    _stripDerivedSkillProfs();
    applyClassFeatures();
    if (typeof syncGrowthSpellsToState === 'function') syncGrowthSpellsToState();
    if (typeof syncFamiliarSpellsToState === 'function') syncFamiliarSpellsToState();
    renderGrowthPlan();
    if (d.conditions) {
      state.conditions = d.conditions;
      // 상태 키 마이그레이션: 구 조건명(여러 세대) → slug → 현재 CONDITIONS_DATA 이름으로 정규화.
      // (state.conditions는 현재 한글명 키 — 이름이 또 개명돼도 slug로 현재명 해소, 구 역방향맵 폐기.)
      const _condAlias = {
        '서투름':'clumsy', '약화':'enfeebled', '메스꺼움':'sickened',
        '혼미':'stupefied', '현기증':'stupefied', '쇠약':'drained', '탈진':'drained',
        '의식불명':'unconscious', '행동감소':'slowed', '고정됨':'immobilized', '고정':'immobilized',
        '방어불가':'off-guard', '발묶임':'off-guard', '속박됨':'restrained', '구속':'restrained',
        '매혹됨':'charmed', '은폐됨':'concealed'
      };
      const _cName = (typeof _condName === 'function') ? _condName : (s => s);
      for (const [old, slug] of Object.entries(_condAlias)) {
        if (state.conditions[old] !== undefined) {
          const cur = _cName(slug);
          if (cur && cur !== old) { state.conditions[cur] = state.conditions[old]; delete state.conditions[old]; }
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
      // 선호 무기 복원 — 신격 카탈로그(FVTT 478) 단일 소스
      const dty = (typeof _getDeity === 'function') ? _getDeity(d.deity) : null;
      if (dty) state._deityWeapon = dty.weapon;
    }
    if (d.divineFont) state.divineFont = d.divineFont;
    if (d.sanctification) state.sanctification = d.sanctification;
    if (d.devotionSpell) state.devotionSpell = d.devotionSpell;
    if (d.championBlessing) state.championBlessing = d.championBlessing;
    if (d.divineFontUsed !== undefined) state.divineFontUsed = d.divineFontUsed;
    if (d.bloodlineExemplar) state.bloodlineExemplar = d.bloodlineExemplar;
    if (d.classFeatureChoices) state.classFeatureChoices = d.classFeatureChoices;
    if (d.signatureSpells) state.signatureSpells = d.signatureSpells;
    if (d.familiarSpells) state.familiarSpells = d.familiarSpells;
    if (d.preparedSpells) state.preparedSpells = d.preparedSpells;
    // v0.26~: 파생 주문 저장소(signature/familiar/prepared)도 slug로 정규화.
    // (familiarSpells는 위 sync가 growth에서 slug로 재구축하지만, 저장본 우선 로드 케이스도 커버)
    _migrateDerivedSpellStoresToSlug();
    // initialChoices는 위(growth strip 직전)에서 이미 복원됨.
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
    // 완전 빈 캐릭터면 기본 빌드(혈통/클래스/배경) 적용 — 아무것도 선택 안 된 상태 방지.
    if (typeof _maybeApplyDefaultBuild === 'function') _maybeApplyDefaultBuild();
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
  // 전 카탈로그 로딩 게이트 선제 워밍 — catalogsReady를 미리 세워 loadData 복원이 지연 없이 진행되게(레거시 폴백 없음).
  if (typeof _ensureAllCatalogs === 'function') _ensureAllCatalogs();
  if (typeof _ensureEquipData === 'function') _ensureEquipData();  // FVTT 장비 카탈로그 사전 로드 (첫 브라우즈 즉시 표시)
  if (typeof _ensureAncData === 'function') _ensureAncData();      // FVTT 혈통/유산/배경 카탈로그 사전 로드 (P4, 캐릭터 생성 1단계)
  if (typeof PF2eSpell !== 'undefined') PF2eSpell.init().catch(()=>{});  // FVTT 주문 카탈로그 사전 로드 (P4)
  if (typeof PF2eDeity !== 'undefined') PF2eDeity.init().then(()=>{ if (typeof renderGrowthPlan==='function') renderGrowthPlan(); }).catch(()=>{});  // FVTT 신격 478 사전 로드 (P4 후속) — ready 후 핵심 빌드 슬롯 재렌더
  if (typeof PF2eFeat !== 'undefined') PF2eFeat.init().then(() => {        // FVTT 재주 카탈로그 + 교차참조 카테고리 (P4)
    // GrantItem(재주→재주/주문/효과/행동) getByUuid 해소용 — 자동화 전 인덱스 보장
    if (typeof PF2eData !== 'undefined') { PF2eData.loadCategory('effects').catch(()=>{}); PF2eData.loadCategory('actions').catch(()=>{}); }
    if (typeof PF2eAction !== 'undefined') PF2eAction.init().then(()=>{ if (typeof renderActions==='function') renderActions(); }).catch(()=>{});  // FVTT 행동 1340 단일소스 룩업 → 준비되면 행동 탭 재렌더(FVTT 표시데이터 반영, v0.44)
  }).catch(()=>{});
  _uiReady = true;
  _checkReady();
};
