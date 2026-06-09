// ═══════════════════════════════════════════════
//  FEAT EFFECTS ENGINE — 재주 자동화 시스템
//  recalcAll() 시 applyFeatEffects()로 모든 재주 효과 집계
//  state._fb 에 결과 저장 → 각 계산 함수에서 참조
// ═══════════════════════════════════════════════

// ── 효과 유형 ──
// hp_bonus:       최대 HP 추가 (value: 숫자 또는 'level')
// speed_bonus:    이동 속도 추가 (value: 피트)
// speed_extra:    추가 이동 속도 (key: 'climb'|'swim'|'fly'|'burrow', value: 피트)
// skill_trained:  기술 숙련 (skill: '$choice' 또는 기술 id)
// skill_bonus:    기술 보너스 (skill: id, value: 숫자, bonus_type)
// save_bonus:     내성 보너스 (save: 'fort'|'ref'|'will'|'all', value, bonus_type, condition)
// ac_bonus:       AC 보너스 (value, bonus_type, condition)
// initiative_bonus: 이니셔티브 보너스 (value, bonus_type)
// bulk_bonus:     벌크 한계 추가 (value)
// dying_threshold: 빈사 임계값 변경 (value)
// recovery_dc:    회복 DC 수정 (value: 음수=감소)
// resistance:     저항 (damage_type, value: 숫자 또는 'half_level')
// grant_action:   행동 해금 (action: ACTION_DB id)
// damage_note:    피해 표시 (text 또는 scaling)
// display_note:   자유 메모 ($choice_name 치환)
// cantrip_slots:  캔트립 슬롯 추가 (value)
// spell_slots:    주문 슬롯 추가 (rank, value)
// familiar_abilities: 사역마 능력 수 (value)
// proficiency:    숙련도 설정 (target, rank) — weapon-martial 등

// ── 선택 유형 ──
// choice.type: 'skill' | 'skill_trained' | 'lore' | 'terrain' | 'resistance' | 'weapon' | 'custom'
// choice.label: 모달 제목
// choice.options: 커스텀 선택지 배열 [{id, name}]
// choice.filter: { min_rank, exclude_trained, attr }
// choice.repeatable: true면 같은 재주 여러번 선택 가능

// v532~ Phase 3a: effect_group_id/auto_note/damage_note + choice_id/CHOICE_OPTIONS 정규화
// v533~ FEAT_EFFECTS 완전 제거 — 모든 효과는 FEAT_DB 신 컬럼에서 조립
//  FEAT_DB row의 effect_group_id/auto_note/damage_note/choice_id를 조립해 def 객체 반환
//  미등재(row 없음/효과 컬럼 모두 빈 값)면 null
function _getFeatEffectsDef(nameEn) {
  if (!nameEn) return null;
  if (typeof FEAT_DB !== 'undefined' && typeof getFeat === 'function') {
    const f = getFeat(nameEn);
    if (f && (f.effect_group_id || f.auto_note || f.damage_note || f.choice_id)) {
      // ── effects 재구성: 공통 효과 + 노트 ──
      const effects = [];
      if (f.effect_group_id && typeof getEffectRows === 'function') {
        for (const r of getEffectRows(f.effect_group_id)) effects.push(_rowToEffect(r));
      }
      if (f.auto_note) effects.push({ type: 'display_note', text: f.auto_note });
      if (f.damage_note) effects.push(Object.assign({ type: 'damage_note' }, f.damage_note));

      // ── choice 재구성 ──
      let choice = null, choiceEffects = null;
      if (f.choice_id && typeof getChoiceOptions === 'function') {
        choice = { type: f.choice_kind || '' };
        if (f.choice_label) choice.label = f.choice_label;
        if (f.choice_filter && typeof f.choice_filter === 'object') Object.assign(choice, f.choice_filter);

        const opts = getChoiceOptions(f.choice_id);
        if (f.choice_kind === 'custom') {
          choice.options = opts.map(o => ({ id: o.option_id, name: o.option_name }));
        } else if (f.choice_kind === 'skill_defaults') {
          choice.defaults = opts.filter(o => o.is_default).map(o => o.option_id);
        }

        // 옵션별 effect_group_id → choiceEffects
        for (const o of opts) {
          if (o.effect_group_id && typeof getEffectRows === 'function') {
            const arr = getEffectRows(o.effect_group_id).map(_rowToEffect);
            if (arr.length) {
              if (!choiceEffects) choiceEffects = {};
              choiceEffects[o.option_id] = arr;
            }
          }
        }
      }

      const def = { effects };
      if (choice) def.choice = choice;
      if (choiceEffects) def.choiceEffects = choiceEffects;
      return def;
    }
  }
  return null;
}


// ═══════════════════════════════════════════════
//  ENGINE — applyFeatEffects()
// ═══════════════════════════════════════════════

function applyFeatEffects() {
  const fb = {
    hp: 0,
    extraSpeeds: {},     // {climb:10, swim:20}
    bulk: 0,
    skills: {},          // {athletics: {min_rank:2, bonus:0}}
    familiarWeapons: [],
    martialExperience: false,
    unburdenedIron: false,
    adoptedAncestries: [],
    extraSenses: [],
    cantrip_bonus: 0,
    bonuses: [],         // 활성 보너스 풀 — {category,target,value,bonus_type,condition,source} (v530~)
  };

  const level = getLevel();

  // ═══ 재주 부여 효과 재구축: 이전 사이클 정리 ═══

  // grant_lore: 지식 슬롯 초기화
  (state._featGrantedLores || []).forEach(entry => {
    const nameEl = document.getElementById('lore-name-' + entry.slot);
    const profEl = document.getElementById('sk-prof-' + entry.slot);
    if (nameEl && nameEl.value === entry.name) {
      nameEl.value = '';
      if (profEl) profEl.value = '0';
    }
  });
  state._featGrantedLores = [];

  // skill_trained: 재주가 부여한 기술 숙련 → 이전 값으로 복원
  (state._featGrantedSkills || []).forEach(entry => {
    const profEl = document.getElementById('sk-prof-' + entry.skill);
    if (profEl && parseInt(profEl.value || 0) === entry.rank) {
      profEl.value = String(entry.prevRank || 0);
    }
  });
  state._featGrantedSkills = [];

  // grant_focus_spell: _sourceFeat 있는 집중 주문 제거
  if (state.spells?.focus) {
    state.spells.focus = state.spells.focus.filter(s => !s._sourceFeat);
  }

  // grant_innate_spell: _sourceFeat 있는 선천 주문 제거
  if (state.spells?.innate) {
    state.spells.innate = state.spells.innate.filter(s => !s._sourceFeat);
  }

  // grant_weapon: 부모 재주 생존 확인 — 부모 없으면 제거 (사용자 룬 설정 보존)
  const allFeatNames = Object.values(state.feats).flat().filter(f => f).map(f => _extractEnName(f.name));
  state.weapons = (state.weapons || []).filter(w => !w._fromFeat || allFeatNames.includes(w._fromFeat));

  // grant_feat: 부모 재주 생존 확인 — 부모 없으면 제거 (사용자 choice 보존)
  const allFeatFullNames = Object.values(state.feats).flat().filter(f => f).map(f => f.name);
  Object.values(state.feats).forEach(arr => {
    if (!arr) return;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i]?._grantedBy && !allFeatFullNames.includes(arr[i]._grantedBy)) {
        arr.splice(i, 1);
      }
    }
  });

  // vision_upgrade: 재주 부여 시야 초기화 → 혈통/유산 기본값 복원 (v526~ enum)
  if (state._featVisionUpgrade) {
    state.vision = state.selectedAncestry?.vision || 'none';
    const _hv = (typeof getHeritageEffects === 'function' ? getHeritageEffects(state.selectedHeritage).vision : null);
    if (_hv) {
      const hv = _hv;
      if (hv === 'upgrade') {
        // 저광 시야 부여, 이미 저광이면 암시야로 업그레이드
        if (state.vision === 'low-light') state.vision = 'darkvision';
        else if (state.vision !== 'darkvision') state.vision = 'low-light';
      } else {
        if ((VISION_RANK[hv]||0) > (VISION_RANK[state.vision]||0)) state.vision = hv;
      }
    }
    state._featVisionUpgrade = false;
  }

  // 모든 재주 카테고리 순회
  Object.values(state.feats).forEach(arr => {
    if (!arr) return;
    arr.forEach(feat => {
      const nameEn = _extractEnName(feat.name);
      if (!nameEn) return;
      const def = _getFeatEffectsDef(nameEn);
      if (!def || !def.effects) return;

      // skill_defaults: choice 미설정 시 기본값 자동 적용
      if (def.choice?.type === 'skill_defaults' && !feat.choice) {
        feat.choice = (def.choice.defaults || []).join(',');
      }

      def.effects.forEach(eff => {
        _applyOneEffect(fb, eff, feat, level);
      });
      // choiceEffects: 선택값에 따른 추가 효과
      if (def.choiceEffects && feat.choice && def.choiceEffects[feat.choice]) {
        def.choiceEffects[feat.choice].forEach(eff => {
          _applyOneEffect(fb, eff, feat, level);
        });
      }
    });
  });

  state._fb = fb;
}

// 활성 보너스 풀에 푸시 — 굴림 모달/AC·속도 합산/툴팁의 단일 출처 (v530~)
function _pushBonus(fb, category, target, eff, feat) {
  fb.bonuses.push({
    category,                            // 'save'|'ac'|'initiative'|'skill'|'speed'|'perception'|'hit'|'damage'
    target: target || null,              // save name, skill id, weapon, ... (없으면 null)
    value: eff.value,
    bonus_type: eff.bonus_type || '',    // 'circumstance'|'status'|'item'|''
    condition: eff.condition || '',      // 한글 자유 텍스트 (자동 분기 없음, 사용자가 보고 결정)
    source: feat?.name || '',            // 출처 재주명 (툴팁/모달 표시용)
  });
}

function _applyOneEffect(fb, eff, feat, level) {
  switch (eff.type) {
    case 'hp_bonus':
      fb.hp += (eff.value === 'level') ? level : (typeof eff.value === 'number' ? eff.value : 0);
      break;
    case 'speed_bonus':
      // 합산은 recalcSpeed에서 풀 기반 type별 max로 (v530~)
      _pushBonus(fb, 'speed', null, eff, feat);
      break;
    case 'speed_extra':
      fb.extraSpeeds[eff.key] = Math.max(fb.extraSpeeds[eff.key] || 0, eff.value);
      break;
    case 'initiative_bonus':
      // 풀 단일 출처 (v531~) — recalcPerc가 getStackedBonus로 합산
      _pushBonus(fb, 'initiative', null, eff, feat);
      break;
    case 'bulk_bonus':
      fb.bulk += eff.value;
      break;
    case 'dying_threshold':
    case 'recovery_dc':
      // desc 정본 (v531~) — 자동화 보류 (각 1건, 사용자가 desc에서 확인)
      break;
    case 'skill_trained': {
      const sid = _resolveChoice(eff.skill, feat);
      if (sid) {
        // skill_multi: 쉼표 구분된 다중 ID 지원
        const ids = sid.includes(',') ? sid.split(',') : [sid];
        ids.forEach(id => {
          const s = id.trim();
          if (!s) return;
          if (!fb.skills[s]) fb.skills[s] = {min_rank:0, bonus:0};
          fb.skills[s].min_rank = Math.max(fb.skills[s].min_rank, 2);
          const profEl = document.getElementById('sk-prof-' + s);
          const prevRank = parseInt(profEl?.value || 0);
          if (profEl && prevRank < 2) {
            state._featGrantedSkills.push({skill: s, rank: 2, feat: feat.name, prevRank});
            profEl.value = '2';
          }
        });
      }
      break;
    }
    case 'skill_bonus': {
      const sid2 = _resolveChoice(eff.skill, feat);
      if (sid2) {
        if (!fb.skills[sid2]) fb.skills[sid2] = {min_rank:0, bonus:0};
        fb.skills[sid2].bonus += eff.value;
        _pushBonus(fb, 'skill', sid2, eff, feat);
      }
      break;
    }
    case 'save_bonus': {
      // 풀 단일 출처 (v531~) — recalcSaves가 getStackedBonus로 합산
      const key = eff.save; // 'fort','ref','will','all'
      if (key === 'all') {
        ['fort','ref','will'].forEach(s => _pushBonus(fb, 'save', s, eff, feat));
      } else {
        _pushBonus(fb, 'save', key, eff, feat);
      }
      break;
    }
    case 'grant_action':
      // summary 기반 동적 행동 (ACTION_DB에 없는 행동) — 레거시
      if (eff.summary && feat.name) {
        if (!fb._customActions) fb._customActions = [];
        fb._customActions.push({featName: feat.name, summary: eff.summary, actionCost: eff.actionCost || 'free'});
      }
      // actionName 기반: desc에서 자동 추출 (정본 = feat_db.desc)
      if (eff.actionName && feat.name) {
        if (!fb._customActions) fb._customActions = [];
        fb._customActions.push({featName: feat.name, actionName: eff.actionName});
      }
      break;
    case 'damage_note':
    case 'display_note':
      // desc 정본 (v531~) — display_note 713건은 Phase 3a에서 FEAT_DB.auto_note로 흡수 예정
      break;
    case 'ac_bonus':
      _pushBonus(fb, 'ac', null, eff, feat);
      // 자동 합산은 recalcAC에서 풀을 읽어 type별 max 적용 (v530~)
      break;
    case 'cantrip_slots':
      fb.cantrip_bonus += eff.value;
      break;
    case 'familiar_abilities':
      // 펫 시스템 통합 보류 (v531~) — desc 정본, 사용자가 펫 카드 maxAbilities 직접 조정
      break;
    case 'armor_upgrade':
      // 갑옷 카테고리 업그레이드 — _applyFeatChoice/사용자 선택 시 직접 prof DOM 변경 (v531~)
      // 1건(갑옷 숙련) 사용, choice 시스템 통합은 Phase 3a 이후 별도 작업
      break;
    case 'proficiency': {
      // 숙련도 직접 부여 (v531~) — target=DOM id suffix, rank=숫자
      if (eff.target && typeof eff.rank === 'number') {
        const profEl = document.getElementById('prof-' + eff.target);
        if (profEl && parseInt(profEl.value || 0) < eff.rank) {
          profEl.value = String(eff.rank);
        }
      }
      break;
    }
    case 'weapon_familiarity': {
      // 해당 무기를 한 카테고리 낮춰 취급 (군용→단순, 고급→군용)
      if (eff.weapons) eff.weapons.forEach(w => {
        const resolved = (w === '$choice') ? (feat.choice || '') : w;
        if (resolved && !fb.familiarWeapons.includes(resolved)) fb.familiarWeapons.push(resolved);
      });
      break;
    }
    case 'weapon_trained': {
      // 특정 무기에 직접 훈련됨(trained) 부여
      if (!fb.trainedWeapons) fb.trainedWeapons = [];
      if (eff.weapons) eff.weapons.forEach(w => { if (!fb.trainedWeapons.includes(w)) fb.trainedWeapons.push(w); });
      break;
    }
    case 'grant_adopted_feat': {
      // _applyFeatChoice에서 직접 처리 — 여기서는 아무것도 안 함
      break;
    }
    case 'adopted_ancestry': {
      // 양자 혈통 — 선택한 혈통의 재주에 접근
      if (feat.choice) {
        const traitName = ANCESTRY_NAME_MAP[feat.choice] || feat.choice;
        if (!fb.adoptedAncestries) fb.adoptedAncestries = [];
        if (!fb.adoptedAncestries.includes(traitName)) fb.adoptedAncestries.push(traitName);
      }
      break;
    }
    case 'grant_feat': {
      // 재주 자동 부여 — 확신이든 뭐든 동일한 재주 데이터 참조
      if (eff.feat && feat.name) {
        const grantName = eff.feat;
        const alreadyHas = Object.values(state.feats).flat().some(f => f && f.name && f.name.includes(grantName.split(' (')[0]));
        if (!alreadyHas) {
          if (!state.feats.general) state.feats.general = [];
          const entry = {name: grantName, level: 1, _auto: true, _grantedBy: feat.name};
          // defaultChoice: 자식 재주의 초기 choice 설정 (사용자 변경 가능)
          if (eff.defaultChoice) entry.choice = eff.defaultChoice;
          state.feats.general.push(entry);
        }
      }
      break;
    }
    case 'grant_feat_if_trained': {
      // 지정 기술이 이미 숙련이면 재주 부여 (석공의 눈 등)
      if (eff.feat && eff.skill) {
        const profEl = document.getElementById('sk-prof-' + eff.skill);
        const wasAlreadyTrained = profEl && parseInt(profEl.value || 0) >= 2 &&
          !(state._featGrantedSkills || []).some(g => g.skill === eff.skill && g.feat === feat.name);
        if (wasAlreadyTrained) {
          const grantName = eff.feat;
          const alreadyHas = Object.values(state.feats).flat().some(f => f && f.name && f.name.includes(grantName.split(' (')[0]));
          if (!alreadyHas) {
            if (!state.feats.skill) state.feats.skill = [];
            const entry = {name: grantName, level: 1, _auto: true, _grantedBy: feat.name};
            if (eff.defaultChoice) entry.choice = eff.defaultChoice;
            state.feats.skill.push(entry);
          }
        }
      }
      break;
    }
    case 'extra_sense': {
      if (eff.sense && !fb.extraSenses.includes(eff.sense)) fb.extraSenses.push(eff.sense);
      break;
    }
    case 'vision_upgrade': {
      state.vision = eff.vision;
      state._featVisionUpgrade = true;
      break;
    }
    case 'unburdened_iron': {
      fb.unburdenedIron = true;
      break;
    }
    case 'martial_experience': {
      // 미숙련 무기에 레벨을 숙련 보너스로, 11레벨에서 모든 무기 숙련
      fb.martialExperience = true;
      break;
    }
    case 'grant_innate_spell': {
      // 고정 선천 주문 부여 (선택 불필요)
      if (eff.spell && feat.name) {
        if (!state.spells.innate) state.spells.innate = [];
        const existing = state.spells.innate.find(s => s._sourceFeat === feat.name && s.name === eff.spell);
        if (!existing) {
          const _sp = getSpell(eff.spell);
          state.spells.innate.push({
            id: _sp?.id || null,
            name: eff.spell, tradition: eff.tradition || '', type: eff.spellType || 'spell',
            uses: eff.uses || '하루 1회', _sourceFeat: feat.name, _source: feat.name
          });
        }
      }
      break;
    }
    case 'grant_focus_spell': {
      let spellName = eff.spell;
      let spellId = null;
      if (spellName === '$domain_initial' || spellName === '$domain_advanced') {
        const dom = feat.choice && typeof DOMAIN_DB !== 'undefined' ? DOMAIN_DB[feat.choice] : null;
        const id = dom ? (spellName === '$domain_initial' ? dom.initial : dom.advanced) : null;
        // DOMAIN_DB는 SPELL_DB.id 외래키로 정규화됨 → id로 직접 lookup
        const sp = id ? getSpell(id) : null;
        spellName = sp ? sp.name_ko : '';
        spellId = sp?.id || null;
      } else {
        const _sp = getSpell(spellName);
        spellId = _sp?.id || null;
      }
      if (spellName && !spellName.startsWith('$') && feat.name) {
        if (!state.spells.focus) state.spells.focus = [];
        const existing = state.spells.focus.find(s => s._sourceFeat === feat.name && s.name === spellName);
        if (!existing) {
          state.spells.focus.push({id: spellId, name: spellName, _auto: true, _sourceFeat: feat.name, _source: feat.name.split(' (')[0].trim()});
        }
      }
      break;
    }
    case 'grant_lore': {
      // 빈 지식 슬롯을 찾아 이름 설정 + 숙련 부여
      let loreName = eff.name || '';
      if (loreName === '$choice') loreName = feat.choice || '';
      if (!loreName) break;
      const slots = ['lore1','lore2'];
      for (const sid of slots) {
        const nameEl = document.getElementById('lore-name-'+sid);
        const profEl = document.getElementById('sk-prof-'+sid);
        if (!nameEl) continue;
        if (nameEl.value === loreName) {
          if (profEl && parseInt(profEl.value||0) < 2) profEl.value = '2';
          if (!fb.skills[sid]) fb.skills[sid] = {min_rank:0, bonus:0};
          fb.skills[sid].min_rank = Math.max(fb.skills[sid].min_rank, 2);
          state._featGrantedLores.push({slot: sid, name: loreName, feat: feat.name});
          break;
        }
        if (!nameEl.value) {
          nameEl.value = loreName;
          if (profEl && parseInt(profEl.value||0) < 2) profEl.value = '2';
          if (!fb.skills[sid]) fb.skills[sid] = {min_rank:0, bonus:0};
          fb.skills[sid].min_rank = Math.max(fb.skills[sid].min_rank, 2);
          state._featGrantedLores.push({slot: sid, name: loreName, feat: feat.name});
          break;
        }
      }
      break;
    }

    case 'grant_weapon': {
      // 재주가 부여하는 무기를 state.weapons에 추가 (중복 방지)
      const wName = eff.weapon_name || '';
      if (!wName) break;
      const _fEN = _extractEnName(feat.name);
      const already = state.weapons.some(w => w._fromFeat === _fEN);
      if (!already) {
        const wData = {
          name: wName,
          category: eff.weapon_category || 'unarmed',
          dmg: eff.damage || '',
          range: eff.range || 0,
          traits: eff.traits || [],
          _fromFeat: _fEN,
          _potency: 0, _striking: 0, _propertyRunes: [], _stowed: false, _twoHand: false
        };
        state.weapons.push({id:'w-'+Date.now(), ...wData});
      }
      break;
    }
  }
}

// ── 헬퍼 ──

function _extractEnName(featFullName) {
  if (!featFullName) return '';
  // 괄호 안 영문명 추출 시도
  const m = featFullName.match(/\(([^)]+)\)$/);
  if (m) return m[1].trim();
  // 영문명이 없으면 FEAT_DB에서 한국어 이름으로 매칭
  const nameKo = featFullName.split(' (')[0].trim();
  const found = getFeat(nameKo);
  if (found) return found.name_en || '';
  return '';
}

function _resolveChoice(ref, feat) {
  if (ref === '$choice') return feat.choice || '';
  return ref;
}

function _getChoiceDisplayName(feat) {
  if (!feat.choice) return '';
  // 기술 id면 한글 이름으로
  if (typeof SKILLS !== 'undefined') {
    const sk = SKILLS.find(s => s.id === feat.choice);
    if (sk) return sk.name;
  }
  // muse_pick: SUBCLASS_DB에서 이름 조회
  const nameEn = _extractEnName(feat.name);
  const def = _getFeatEffectsDef(nameEn);
  if (def?.choice?.type === 'muse_pick' && typeof SUBCLASS_DB !== 'undefined') {
    const muse = SUBCLASS_DB.find(s => s.id === feat.choice);
    if (muse) return muse.name_ko + ' ' + (muse.subclass_type || '뮤즈');
  }
  // 커스텀 옵션이면 _getFeatEffectsDef로 def.choice.options 검색
  if (def && def.choice && def.choice.options) {
    const opt = def.choice.options.find(o => o.id === feat.choice);
    if (opt) return opt.name;
  }
  return feat.choice;
}

// ── 재주 탭 인라인 choice 컨트롤 ──

function _hasFeatChoiceIssue(feat) {
  const nameEn = _extractEnName(feat.name);
  if (!nameEn) return false;
  const def = _getFeatEffectsDef(nameEn);
  if (!def?.choice) return false;
  const ch = def.choice;
  if (ch.type === 'skill') {
    // 유효하지 않은 기술 ID
    if (feat.choice && typeof SKILLS !== 'undefined' && !SKILLS.some(s => s.id === feat.choice)) return true;
    // min_rank 미달
    if (ch.filter?.min_rank && feat.choice) {
      const rank = parseInt(document.getElementById('sk-prof-' + feat.choice)?.value || 0);
      if (rank < ch.filter.min_rank) return true;
    }
  }
  // choice 미선택
  if (!feat.choice && (ch.type === 'lore' || ch.type === 'skill' || ch.type === 'custom')) return true;
  return false;
}

// 이미 선택된 재주의 전제조건이 현재 미달인지 체크
function _hasFeatPrereqIssue(feat) {
  if (typeof FEAT_DB === 'undefined' || typeof _checkPrereqs !== 'function') return false;
  const nameKo = feat.name?.split(' (')[0]?.trim();
  if (!nameKo) return false;
  const fd = getFeat(nameKo);
  if (!fd) return false;
  if (!fd.prereqs && !fd.prerequisites) return false;
  return !_checkPrereqs(fd);
}

function _buildFeatChoiceUI(feat, featType, featIndex) {
  const nameEn = _extractEnName(feat.name);
  if (!nameEn) return '';
  const def = _getFeatEffectsDef(nameEn);
  if (!def || !def.choice) return '';
  const ch = def.choice;
  const uid = `fc-${featType}-${featIndex}`;
  const current = feat.choice || '';
  const displayName = _getChoiceDisplayName(feat);

  let html = `<div class="feat-choice-ctrl" style="margin-top:8px;padding:8px;background:var(--bg4);border-radius:6px;border:1px solid var(--border);">`;
  html += `<div style="font-size:11px;color:var(--accent);margin-bottom:6px;font-weight:600;">${ch.label || '선택'}</div>`;

  if (ch.type === 'skill_fixed') {
    const skills = typeof SKILLS !== 'undefined' ? SKILLS : [];
    const fixedId = ch.fixedSkill || '';
    const fixedName = skills.find(s => s.id === fixedId)?.name || fixedId;
    html += `<select disabled
      style="width:100%;padding:6px 8px;font-size:13px;background:var(--bg3);color:var(--text2);border:1px solid var(--border);border-radius:4px;outline:none;opacity:0.7;">
      <option selected>${fixedName}</option>
    </select>`;
  } else if (ch.type === 'lore') {
    html += `<div style="display:flex;gap:6px;align-items:center;">
      <input id="${uid}" type="text" value="${current}" placeholder="지식 분야 입력"
        style="flex:1;min-width:0;padding:6px 8px;font-size:13px;background:var(--bg2);color:var(--text);border:1px solid var(--border);border-radius:4px;outline:none;">
      <button onclick="_onFeatChoiceInline('${featType}',${featIndex},'lore')"
        style="padding:6px 12px;font-size:12px;background:var(--accent);color:var(--bg);border:none;border-radius:4px;cursor:pointer;white-space:nowrap;font-weight:600;">확인</button>
    </div>`;
    if (!current) html += `<div style="margin-top:4px;font-size:11px;color:#f44336;">⚠ 선택하지 않은 항목이 있습니다.</div>`;
  } else if (ch.type === 'skill') {
    const skills = typeof SKILLS !== 'undefined' ? SKILLS : [];
    const minRank = ch.filter?.min_rank || 0;
    html += `<select id="${uid}" onchange="_onFeatChoiceInline('${featType}',${featIndex},'skill')"
      style="width:100%;padding:6px 8px;font-size:13px;background:var(--bg2);color:var(--text);border:1px solid var(--border);border-radius:4px;outline:none;">
      <option value="">— 선택 —</option>`;
    skills.forEach(s => {
      const rank = parseInt(document.getElementById('sk-prof-' + s.id)?.value || 0);
      if (rank < minRank && s.id !== current) return;
      const sel = s.id === current ? ' selected' : '';
      html += `<option value="${s.id}"${sel}>${s.name}</option>`;
    });
    html += `</select>`;
    const isValidSkill = current && skills.some(s => s.id === current);
    if (!current || !isValidSkill) {
      // 유효하지 않은 값이면 초기화
      if (current && !isValidSkill) feat.choice = '';
      html += `<div style="margin-top:4px;font-size:11px;color:#f44336;">⚠ 선택하지 않은 항목이 있습니다.</div>`;
    } else if (minRank > 0) {
      const curRank = parseInt(document.getElementById('sk-prof-' + current)?.value || 0);
      if (curRank < minRank) {
        const curName = skills.find(s => s.id === current)?.name || current;
        html += `<div style="margin-top:4px;font-size:11px;color:#f44336;">⚠ ${curName}이(가) 숙련되어 있지 않습니다.</div>`;
      }
    }
  } else if (ch.type === 'skill_defaults') {
    const skills = typeof SKILLS !== 'undefined' ? SKILLS : [];
    const defaults = ch.defaults || [];
    const count = ch.count || defaults.length;
    const vals = (current || defaults.join(',')).split(',');
    for (let si = 0; si < count; si++) {
      const selVal = vals[si] || '';
      const selectId = `${uid}-${si}`;
      const defaultId = defaults[si] || '';
      const defaultName = skills.find(s => s.id === defaultId)?.name || defaultId;
      html += `<div style="display:flex;align-items:center;gap:6px;${si > 0 ? 'margin-top:4px;' : ''}">
        <span style="font-size:11px;color:var(--text2);min-width:20px;">${si+1}.</span>
        <select id="${selectId}" onchange="_onSkillDefaultsChange('${featType}',${featIndex},${count})"
          style="flex:1;padding:6px 8px;font-size:13px;background:var(--bg2);color:var(--text);border:1px solid var(--border);border-radius:4px;outline:none;">`;
      skills.forEach(s => {
        const sel = s.id === selVal ? ' selected' : '';
        html += `<option value="${s.id}"${sel}>${s.name}</option>`;
      });
      html += `</select></div>`;
    }
  } else if (ch.type === 'custom' && ch.options) {
    html += `<select id="${uid}" onchange="_onFeatChoiceInline('${featType}',${featIndex},'custom')"
      style="width:100%;padding:6px 8px;font-size:13px;background:var(--bg2);color:var(--text);border:1px solid var(--border);border-radius:4px;outline:none;">
      <option value="">— 선택 —</option>`;
    ch.options.forEach(o => {
      const sel = o.id === current ? ' selected' : '';
      html += `<option value="${o.id}"${sel}>${o.name}</option>`;
    });
    html += `</select>`;
    if (!current) html += `<div style="margin-top:4px;font-size:11px;color:#f44336;">⚠ 선택하지 않은 항목이 있습니다.</div>`;
  } else {
    // 기타 타입 (spell_cantrip 등) — 기존 모달 사용
    const escapedName = feat.name.replace(/'/g, "\\'");
    html += `<button onclick="checkFeatChoice('${escapedName}','${featType}',${featIndex})"
      style="width:100%;padding:6px 8px;font-size:12px;background:var(--bg2);color:var(--accent);border:1px solid var(--accent);border-radius:4px;cursor:pointer;">
      ${displayName || '선택하기'}</button>`;
  }
  html += `</div>`;
  return html;
}

function _onSkillDefaultsChange(featType, featIndex, count) {
  const uid = `fc-${featType}-${featIndex}`;
  const vals = [];
  for (let i = 0; i < count; i++) {
    const el = document.getElementById(`${uid}-${i}`);
    if (el) vals.push(el.value);
  }
  state.feats[featType][featIndex].choice = vals.join(',');
  const container = document.getElementById('feats-' + featType);
  try { recalcAll(); } catch(e) { console.error(e); }
  // 아코디언 유지
  if (container) {
    const entry = container.children[featIndex];
    if (entry) entry.classList.add('expanded');
  }
  save();
}

function _onFeatChoiceInline(featType, featIndex, choiceType) {
  const uid = `fc-${featType}-${featIndex}`;
  const el = document.getElementById(uid);
  if (!el) return;
  const val = el.value.trim();
  // lore 타입은 빈 값 무시 (확인 버튼 방식), 그 외는 빈 값도 저장 (초기화)
  if (!val && choiceType === 'lore') return;
  state.feats[featType][featIndex].choice = val;
  renderFeats();
  // 선택한 재주를 다시 펼침
  const container = document.getElementById('feats-' + featType);
  if (container) {
    const entry = container.children[featIndex];
    if (entry) entry.classList.add('expanded');
  }
  try { recalcAll(); } catch(e) { console.error(e); }
  save();
}

// ── 선택 모달 ──

function openFeatChoiceModal(featType, featIndex, choiceDef) {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'feat-choice';
  modalContext = {featType, featIndex, choiceDef};

  const isSpellChoice = choiceDef.type === 'spell_cantrip';
  document.getElementById('modal-title').textContent = choiceDef.label || '선택';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  const detail = document.getElementById('modal-detail');
  if (detail) { detail.style.display = 'none'; }
  // spell_cantrip: 닫기/취소/선택 전부 숨김 (선택 필수, detail 내 버튼만 사용)
  if (isSpellChoice || choiceDef.type === 'lore' || choiceDef.type === 'custom' || choiceDef.type === 'muse_pick' || choiceDef.type === 'ancestry_pick' || choiceDef.type === 'feat_pick' || choiceDef.type === 'skill_multi' || choiceDef.type === 'weapon_pick') {
    const closeBtn = document.querySelector('.modal-close');
    const closeBtnM = document.getElementById('modal-close-m');
    const footer = document.querySelector('.modal-footer');
    if (closeBtn) closeBtn.style.display = 'none';
    if (closeBtnM) closeBtnM.style.display = 'none';
    if (footer) footer.style.display = 'none';
  }

  const listEl = document.querySelector('.modal-list');
  if (listEl) { listEl.style.display = ''; listEl.style.width = '100%'; listEl.style.borderRight = 'none'; }

  const container = document.getElementById('modal-options');
  container.innerHTML = '';

  if (choiceDef.type === 'skill' || choiceDef.type === 'skill_trained') {
    SKILLS.forEach(sk => {
      if (sk.isLore) return; // 지식 기술은 별도 처리
      if (choiceDef.filter?.custom && !choiceDef.filter.custom.includes(sk.id)) return;
      const rank = parseInt(document.getElementById('sk-prof-' + sk.id)?.value || 0);
      if (choiceDef.filter?.min_rank && rank < choiceDef.filter.min_rank) return;
      if (choiceDef.filter?.exclude_trained && rank >= 2) return;

      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      row.innerHTML = `<span class="opt-row-name">${sk.name} (${sk.en})</span>`;
      row.onclick = () => _applyFeatChoice(sk.id);
      container.appendChild(row);
    });
  } else if (choiceDef.type === 'skill_multi') {
    // ── 기술 다중 선택 (체크 형태) ──
    const maxPick = choiceDef.count || 2;
    const selected = new Set();
    modalContext._multiSelected = selected;

    // 하단에 확정 버튼 표시
    const footer = document.querySelector('.modal-footer');
    if (footer) {
      footer.style.display = '';
      footer.innerHTML = `<button class="btn btn-confirm" id="skill-multi-confirm" disabled style="opacity:.4;cursor:not-allowed;">0/${maxPick}개 선택됨 — 선택 완료</button>`;
      document.getElementById('skill-multi-confirm').onclick = () => {
        if (selected.size === maxPick) _applyFeatChoice([...selected].join(','));
      };
    }

    function updateMultiBtn() {
      const btn = document.getElementById('skill-multi-confirm');
      if (!btn) return;
      const done = selected.size === maxPick;
      btn.textContent = `${selected.size}/${maxPick}개 선택됨 — 선택 완료`;
      btn.disabled = !done;
      btn.style.opacity = done ? '1' : '.4';
      btn.style.cursor = done ? 'pointer' : 'not-allowed';
    }

    SKILLS.forEach(sk => {
      if (sk.isLore) return;
      const rank = parseInt(document.getElementById('sk-prof-' + sk.id)?.value || 0);
      if (choiceDef.filter?.exclude_trained && rank >= 2) return;

      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      const check = document.createElement('span');
      check.className = 'skill-multi-check';
      check.style.cssText = 'width:18px;height:18px;border:2px solid var(--border,#555);border-radius:4px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;transition:all .15s;';
      row.appendChild(check);
      const label = document.createElement('span');
      label.className = 'opt-row-name';
      label.textContent = `${sk.name} (${sk.en})`;
      row.appendChild(label);

      row.onclick = () => {
        if (selected.has(sk.id)) {
          selected.delete(sk.id);
          check.textContent = '';
          check.style.background = '';
          check.style.borderColor = 'var(--border,#555)';
          row.classList.remove('selected');
        } else {
          if (selected.size >= maxPick) return; // 최대 도달
          selected.add(sk.id);
          check.textContent = '✓';
          check.style.background = 'var(--accent,#d4a04a)';
          check.style.borderColor = 'var(--accent,#d4a04a)';
          check.style.color = '#000';
          row.classList.add('selected');
        }
        updateMultiBtn();
      };
      container.appendChild(row);
    });
  } else if (choiceDef.type === 'lore') {
    // 자유 입력
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '지식 분야 입력...';
    input.style.cssText = 'width:100%;padding:8px;background:var(--bg3);border:1px solid var(--border);color:var(--text);border-radius:4px;font-size:14px;margin:8px 0;';
    container.appendChild(input);
    const btn = document.createElement('button');
    btn.textContent = '확인';
    btn.style.cssText = 'padding:8px 20px;background:var(--accent);color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;';
    btn.onclick = () => {
      const val = input.value.trim();
      if (val) _applyFeatChoice(val);
    };
    container.appendChild(btn);
  } else if (choiceDef.type === 'muse_pick') {
    // ── 다양한 뮤즈 전용: 기존 서브클래스 모달과 완전히 동일한 UI ──
    // 모달을 리셋하고 서브클래스 모달 방식으로 전환
    overlay.classList.add('hidden'); // 현재 feat-choice 모달 닫기

    // 이미 선택된 뮤즈 수집
    const takenMuses = new Set();
    if (state.selectedSubclass) takenMuses.add(state.selectedSubclass.id);
    Object.values(state.feats).flat().forEach(ff => {
      if (ff?.name?.includes('다양한 뮤즈') && ff.choice) takenMuses.add(ff.choice);
    });

    // 서브클래스 모달 열기 (muse_pick 모드)
    modalType = 'muse_pick';
    modalContext = {featType, featIndex, choiceDef, takenMuses};
    overlay.classList.remove('hidden');
    document.getElementById('modal-title').textContent = '추가 뮤즈 선택';
    const searchEl2 = document.getElementById('modal-search');
    if (searchEl2) { searchEl2.style.display = 'none'; searchEl2.value = ''; }
    const fbar2 = document.getElementById('modal-filterbar');
    if (fbar2) fbar2.innerHTML = '';
    // 목록 + 상세 패널 레이아웃 복원 (서브클래스 모달과 동일)
    const listEl2 = document.querySelector('.modal-list');
    if (listEl2) { listEl2.style.display = ''; listEl2.style.width = ''; listEl2.style.borderRight = ''; }
    const detail2 = document.getElementById('modal-detail');
    if (detail2) detail2.style.display = '';
    const confirmBtn2 = document.querySelector('.btn-confirm');
    if (confirmBtn2) confirmBtn2.style.display = '';
    const closeBtn2 = document.querySelector('.modal-close');
    if (closeBtn2) closeBtn2.style.display = '';
    const closeBtnM2 = document.getElementById('modal-close-m');
    if (closeBtnM2) closeBtnM2.style.display = '';
    const footer2 = document.querySelector('.modal-footer');
    if (footer2) footer2.style.display = '';

    // 필터링된 뮤즈 목록으로 renderOptions 호출
    const museList = typeof SUBCLASS_DB !== 'undefined'
      ? SUBCLASS_DB.filter(s => s.class_id === 'bard' && !takenMuses.has(s.id))
      : [];
    renderOptions(museList);
    return; // 이후 로직 스킵
  } else if (choiceDef.type === 'custom' && choiceDef.options) {
    // 영역 입문: 신격 영역으로 필터링
    let filteredOpts = choiceDef.options;
    if (choiceDef.label && choiceDef.label.includes('영역') && state.deity && typeof DEITY_DB !== 'undefined') {
      const deity = DEITY_DB.find(d => d.id === state.deity);
      if (deity && deity.domains && deity.domains.length > 0) {
        filteredOpts = choiceDef.options.filter(opt => deity.domains.includes(opt.name));
        const note = document.createElement('div');
        note.style.cssText = 'font-size:11px;color:var(--accent);padding:8px 12px;border-bottom:1px solid var(--border);';
        note.textContent = `${deity.name_ko}의 영역: ${deity.domains.join(', ')}`;
        container.appendChild(note);
      }
    }
    if (choiceDef.repeatable && choiceDef.label && choiceDef.label.includes('영역')) {
      const curFeat = (featType && featIndex != null && state.feats[featType]) ? state.feats[featType][featIndex] : null;
      const featBaseName = curFeat && curFeat.name ? curFeat.name.split(' (')[0] : '';
      const alreadyChosen = new Set();
      Object.values(state.feats).flat().forEach(f => {
        if (f && f.name && f.name.split(' (')[0] === featBaseName && f.choice) alreadyChosen.add(f.choice);
      });
      filteredOpts = filteredOpts.filter(opt => !alreadyChosen.has(opt.id));
    }
    if (choiceDef.filterByInitiated) {
      const initiatedDomains = new Set();
      Object.values(state.feats).flat().forEach(f => {
        if (f && f.name && (f.name.includes('Domain Initiate') || f.name.includes('영역 입문')) && f.choice) {
          initiatedDomains.add(f.choice);
        }
      });
      filteredOpts = filteredOpts.filter(opt => initiatedDomains.has(opt.id));
    } else if (choiceDef.label && choiceDef.label.includes('영역')) {
      // Domain Initiate: 신격의 4개 영역만 선택 가능 (PF2e 룰 PC1 p.113)
      // state.deity = 신격 id, DEITY_DB.domains = 영역 id 배열 (외래키)
      if (state.deity && typeof DEITY_DB !== 'undefined') {
        const deity = DEITY_DB.find(d => d.id === state.deity);
        if (deity && Array.isArray(deity.domains) && deity.domains.length) {
          filteredOpts = filteredOpts.filter(opt => deity.domains.includes(opt.id));
        }
      }
    }
    // 영역 선택: 좌측 목록 + 우측 주문 설명 레이아웃
    const isDomain = choiceDef.label && choiceDef.label.includes('영역');
    if (isDomain && typeof DOMAIN_DB !== 'undefined') {
      // 모달 레이아웃 재구성: list+detail 패널 사용
      const listEl2 = document.querySelector('.modal-list');
      if (listEl2) { listEl2.style.width = '140px'; listEl2.style.borderRight = '1px solid var(--border,#444)'; }
      const detail2 = document.getElementById('modal-detail');
      if (detail2) { detail2.style.display = ''; detail2.innerHTML = '<div style="color:#888;padding:40px 16px;text-align:center;">영역을 선택하세요</div>'; }
      // 확정 버튼 표시
      const footer2 = document.querySelector('.modal-footer');
      if (footer2) { footer2.style.display = ''; footer2.innerHTML = '<button class="btn btn-cancel" onclick="closeModal()">취소</button><button class="btn btn-confirm" id="domain-confirm-btn" disabled style="opacity:0.5;">확정</button>'; }

      let selectedDomainId = null;

      filteredOpts.forEach(opt => {
        const row = document.createElement('div');
        row.className = 'opt-row';
        row.style.cssText = 'padding:10px 12px;cursor:pointer;border-bottom:1px solid var(--border,#333);font-size:13px;';
        row.textContent = opt.name;
        row.onclick = () => {
          selectedDomainId = opt.id;
          container.querySelectorAll('.opt-row').forEach(d => { d.style.background = ''; d.style.color = ''; });
          row.style.background = 'var(--accent,#c9a84c)'; row.style.color = '#000';
          const dom = DOMAIN_DB[opt.id];
          const isAdvanced = !!choiceDef.filterByInitiated;
          // DOMAIN_DB는 SPELL_DB.id 외래키 → SPELL_DB lookup
          const spellId = dom ? (isAdvanced ? dom.advanced : dom.initial) : null;
          const spell = spellId && typeof SPELL_DB !== 'undefined' ? SPELL_DB.find(s => s.id === spellId) : null;
          const spellName = spell ? spell.name_ko : null;
          if (detail2) {
            if (spell) {
              detail2.innerHTML = `<div style="padding:16px;"><div style="font-size:16px;font-weight:bold;color:var(--accent,#c9a84c);margin-bottom:8px;">${spell.name_ko} <span style="font-size:11px;color:#888;">${spell.name_en}</span></div>`
                + (spell.traits ? `<div style="margin-bottom:8px;">${spell.traits.map(t => '<span style="display:inline-block;background:#333;color:#ccc;padding:2px 6px;border-radius:3px;font-size:10px;margin:1px 2px;">'+t+'</span>').join('')}</div>` : '')
                + `<div style="color:#bbb;line-height:1.7;font-size:13px;">${resolveDescRefs(spell.desc||'설명 없음')}</div></div>`;
            } else if (spellName) {
              detail2.innerHTML = `<div style="padding:16px;"><div style="font-size:16px;font-weight:bold;color:var(--accent);">${spellName}</div><div style="color:#888;margin-top:8px;">주문 상세 정보가 DB에 없습니다.</div></div>`;
            } else {
              detail2.innerHTML = `<div style="color:#888;padding:40px 16px;text-align:center;">${opt.name} 영역의 ${isAdvanced?'고급':'초기'} 주문이 아직 번역되지 않았습니다.</div>`;
            }
          }
          const cBtn = document.getElementById('domain-confirm-btn');
          if (cBtn) { cBtn.disabled = false; cBtn.style.opacity = '1'; cBtn.onclick = () => _applyFeatChoice(selectedDomainId); }
        };
        container.appendChild(row);
      });
    } else {
      filteredOpts.forEach(opt => {
        const row = document.createElement('div');
        row.className = 'opt-row';
        row.style.cursor = 'pointer';
        row.innerHTML = `<span class="opt-row-name">${opt.name}</span>`;
        row.onclick = () => _applyFeatChoice(opt.id);
        container.appendChild(row);
      });
    }
  } else if ((choiceDef.type === 'spell_cantrip' || choiceDef.type === 'spell_rank') && typeof SPELL_DB !== 'undefined') {
    const tradition = choiceDef.tradition || 'arcane';
    const isRankSpell = choiceDef.type === 'spell_rank';
    const targetRank = choiceDef.rank || 1;
    let cantrips;
    if (isRankSpell) {
      cantrips = SPELL_DB.filter(sp => !sp.is_cantrip && !sp.is_focus && sp.rank && sp.rank <= targetRank && sp.traditions && sp.traditions.includes(tradition));
    } else if (tradition === 'any' || tradition === '$other') {
      const classTrad = state.selectedClass?.tradition || '';
      cantrips = SPELL_DB.filter(sp => sp.is_cantrip && !sp.is_focus && sp.traditions && (!classTrad || !sp.traditions.includes(classTrad)));
    } else {
      cantrips = SPELL_DB.filter(sp => sp.is_cantrip && !sp.is_focus && sp.traditions && sp.traditions.includes(tradition));
    }
    cantrips.sort((a,b) => (a.name_ko||'').localeCompare(b.name_ko||''));

    // 주문 선택 모달과 동일한 구조로 전환
    if (searchEl) {
      searchEl.style.display = '';
      searchEl.value = '';
      searchEl.oninput = () => {
        const q = searchEl.value.toLowerCase();
        container.querySelectorAll('.opt-row').forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      };
    }
    // 디테일 패널 활성화
    if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">캔트립을 선택하면 상세 정보가 표시됩니다.</div>'; }
    if (listEl) { listEl.style.width = ''; listEl.style.borderRight = ''; }
    modalContext._selectedSpell = null;

    cantrips.forEach(sp => {
      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      const actions = typeof getActionIcons==='function' ? getActionIcons(sp.actions) : (sp.actions||'');
      row.innerHTML = `<span class="opt-row-icon">📄</span><span class="opt-row-name">${sp.name_ko}</span>${actions?`<span class="opt-row-actions">${actions}</span>`:''}`;
      row.onclick = () => {
        modalContext._selectedSpell = sp.name_ko;
        if (window.innerWidth <= 900) {
          // 모바일: 아코디언
          document.querySelectorAll('.opt-row-detail.open').forEach(d => d.classList.remove('open'));
          document.querySelectorAll('.opt-row.expanded').forEach(r => r.classList.remove('expanded'));
          row.classList.add('expanded');
          let detailDiv = row.nextElementSibling;
          if (!detailDiv || !detailDiv.classList.contains('opt-row-detail')) {
            detailDiv = document.createElement('div'); detailDiv.className = 'opt-row-detail'; row.after(detailDiv);
          }
          const rankStr = sp.is_cantrip ? '캔트립' : `랭크 ${sp.rank}`;
          const spTraits = [...(sp.traditions||[]),...(sp.traits||[])].map(t => typeof traitTag==='function' ? traitTag(t) : `<span class="tag">${t}</span>`).join('');
          const spDesc = sp.desc || sp.summary || '';
          detailDiv.innerHTML = `
            <div style="margin-bottom:4px;"><span class="tag-meta">${rankStr}</span></div>
            ${spTraits ? '<div style="margin-bottom:6px;">'+spTraits+'</div>' : ''}
            <div style="font-size:12px;line-height:1.6;">${resolveDescRefs(spDesc)}</div>
            <button onclick="if(modalContext._selectedSpell)_applyFeatChoice(modalContext._selectedSpell)" style="width:100%;margin-top:8px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">선택</button>`;
          detailDiv.classList.add('open');
        } else {
          // PC: 우측 패널
          container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
          row.classList.add('selected');
          if (typeof showItemDetail === 'function') showItemDetail(sp);
          // detail 패널에 선택 확정 버튼 추가
          const detailEl = document.getElementById('modal-detail');
          if (detailEl) {
            const btn = document.createElement('button');
            btn.textContent = '이 캔트립 선택';
            btn.style.cssText = 'width:100%;margin-top:12px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;';
            btn.onclick = () => _applyFeatChoice(sp.name_ko);
            detailEl.appendChild(btn);
          }
        }
      };
      container.appendChild(row);
    });
  } else if (choiceDef.type === 'ancestry_pick' && typeof ANCESTRIES !== 'undefined') {
    // 혈통 선택 모달 — 이미 선택한 혈통과 내 혈통 제외
    const myAnc = state.selectedAncestry?.id || '';
    const alreadyAdopted = Object.values(state.feats).flat()
      .filter(f => f && f.name && f.name.includes('양자 혈통') && f.choice)
      .map(f => f.choice);
    const available = ANCESTRIES.filter(a => a.id !== myAnc && !alreadyAdopted.includes(a.id));

    if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; searchEl.oninput = () => {
      const q = searchEl.value.toLowerCase();
      container.querySelectorAll('.opt-row').forEach(r => { r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none'; });
    };}
    if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">혈통을 선택하면 상세 정보가 표시됩니다.</div>'; }
    if (listEl) { listEl.style.width = ''; listEl.style.borderRight = ''; }
    modalContext._selectedSpell = null;

    available.forEach(anc => {
      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      row.innerHTML = `<span class="opt-row-icon">🧬</span><span class="opt-row-name">${anc.name} <span style="color:var(--text2);font-size:10px;">${anc.en}</span></span>`;
      row.onclick = () => {
        container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        modalContext._selectedSpell = anc.id;
        // 상세 정보 표시
        const detailEl = document.getElementById('modal-detail');
        if (detailEl) {
          detailEl.innerHTML = `
            <div class="modal-detail-title">${anc.name}</div>
            <div class="modal-detail-en">${anc.en}</div>
            <div style="margin:12px 0;font-size:13px;line-height:1.7;">
              <div><b>HP:</b> ${anc.hp} | <b>크기:</b> ${anc.size} | <b>속도:</b> ${anc.speed}피트</div>
              <div><b>부스트:</b> ${[...(anc.boosts||[]).map(k=>ATTR_KO[k]), ...(anc.boost_choices||[]).map(g=>g.map(k=>ATTR_KO[k]).join('/')), ...Array(anc.free_boosts||0).fill('자유')].join(', ')}</div>
              ${(anc.flaws||[]).length ? '<div><b>결함:</b> '+anc.flaws.map(k=>ATTR_KO[k]).join(', ')+'</div>' : ''}
              <div><b>특성:</b> ${anc.traits.join(', ')}</div>
            </div>
            <button onclick="_applyFeatChoice(modalContext._selectedSpell)" style="width:100%;margin-top:12px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">이 혈통 선택</button>`;
        }
      };
      container.appendChild(row);
    });
  } else if (choiceDef.type === 'weapon_pick' && typeof WEAPON_DB !== 'undefined') {
    // ── 비일반 무기 선택 모달 ──
    // 군용 무기 전체 숙련 여부 확인
    const martialProf = parseInt(document.getElementById('prof-weapon-martial')?.value || 0);
    const allMartialTrained = martialProf >= 2;

    const candidates = WEAPON_DB.filter(w => {
      if (!w.category || !w.category.includes('비일반')) return false;
      if (allMartialTrained) {
        // 고급 비일반도 허용
        return true;
      } else {
        // 단순/군용 비일반만
        return w.category.startsWith('단순') || w.category.startsWith('군용');
      }
    });

    if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; searchEl.oninput = () => {
      const q = searchEl.value.toLowerCase();
      container.querySelectorAll('.opt-row').forEach(r => { r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none'; });
    };}
    if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">무기를 선택하면 상세 정보가 표시됩니다.</div>'; }
    if (listEl) { listEl.style.width = ''; listEl.style.borderRight = ''; }

    candidates.forEach(w => {
      const catLabel = w.category.replace('(비일반)','').trim();
      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      row.innerHTML = `<span class="opt-row-icon">⚔</span><span class="opt-row-name">${w.name_ko}</span><span style="font-size:10px;color:var(--text2);margin-left:auto;">${catLabel} · ${w.damage||''}</span>`;
      row.onclick = () => {
        container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        // 상세 정보
        const detEl = document.getElementById('modal-detail');
        if (detEl) {
          const traitsHtml = (w.traits||[]).map(t => typeof traitTag==='function' ? traitTag(t) : `<span class="tag">${t}</span>`).join(' ');
          detEl.innerHTML = `
            <div class="modal-detail-title">${w.name_ko}</div>
            <div class="modal-detail-en">${w.name_en||''}</div>
            <div style="margin:8px 0;font-size:13px;">
              <div><b>분류:</b> ${w.category}</div>
              <div><b>피해:</b> ${w.damage||'—'} | <b>부피:</b> ${w.bulk||'—'} | <b>가격:</b> ${w.price||'—'}</div>
              ${w.range ? '<div><b>사거리:</b> '+w.range+'ft.</div>' : ''}
            </div>
            ${traitsHtml ? '<div style="margin:6px 0;">'+traitsHtml+'</div>' : ''}
            <button onclick="_applyFeatChoice('${(w.name_ko||'').replace(/'/g,"\\'")}')" style="width:100%;margin-top:12px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">이 무기 선택</button>`;
        }
      };
      container.appendChild(row);
    });
  } else if (choiceDef.type === 'feat_pick' && typeof FEAT_DB !== 'undefined') {
    // ── 범용 재주 선택 모달 (적응력, 자연 야심, 고급 일반 훈련 등) ──
    let pickCat = choiceDef.pickCategory || 'general';
    if (pickCat === '$class' && state.selectedClass) pickCat = state.selectedClass.id;
    const pickMax = choiceDef.pickMaxLevel || 99;
    const pickTraits = choiceDef.pickTraits || null;

    // 이미 보유한 재주 이름 (중복 방지)
    const ownedNames = new Set();
    for (const arr of Object.values(state.feats)) {
      if (Array.isArray(arr)) arr.forEach(f => { if (f?.name) ownedNames.add(f.name.split(' (')[0].trim()); });
    }

    // 아이우바린 유산 보유 + skipPrereqIfAiuvarin이면 능력치 전제조건 생략
    const isAiuvarin = state.selectedHeritage?.id === 'aiuvarin';
    const skipPrereq = choiceDef.skipPrereqIfAiuvarin && isAiuvarin;
    // 자기 클래스 이름 (헌신 재주에서 자기 클래스 제외용)
    const myClassName = state.selectedClass?.name || '';
    const myClassEn = state.selectedClass?.en || '';

    const candidates = FEAT_DB.filter(f => {
      if (!f) return false;
      if (f.category !== pickCat) return false;
      if (f.feat_level > pickMax) return false;
      if (pickTraits && !(f.traits && f.traits.some(t => pickTraits.includes(t)))) return false;
      // 헌신 재주: 자기 클래스 헌신 제외
      if (pickTraits?.includes('헌신') && f.name_ko) {
        if (myClassName && f.name_ko.includes(myClassName)) return false;
        if (myClassEn && f.name_en && f.name_en.toLowerCase().includes(myClassEn.toLowerCase())) return false;
      }
      // 전제조건 체크 (아이우바린이면 생략 가능)
      if (f.prerequisites && !skipPrereq && typeof _checkPrereqs === 'function' && !_checkPrereqs(f.prerequisites)) return false;
      // 헌신 재주 특수 조건 (다재다능은 skipDedicationLimit으로 무시)
      if (f.traits?.includes('헌신') && !choiceDef.skipDedicationLimit && typeof canTakeDedication === 'function' && !canTakeDedication(f)) return false;
      if (ownedNames.has(f.name_ko)) return false;
      return true;
    });

    if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; searchEl.oninput = () => {
      const q = searchEl.value.toLowerCase();
      container.querySelectorAll('.opt-row').forEach(r => { r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none'; });
    };}
    if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">재주를 선택하면 상세 정보가 표시됩니다.</div>'; }
    if (listEl) { listEl.style.width = ''; listEl.style.borderRight = ''; }

    if (candidates.length === 0) {
      container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text2);">선택 가능한 재주가 없습니다.<br><span style="font-size:11px;">전제조건(능력치 등)을 확인하세요.</span></div>';
      const closeBtn2 = document.querySelector('.modal-close');
      const closeBtnM2 = document.getElementById('modal-close-m');
      const footer2 = document.querySelector('.modal-footer');
      if (closeBtn2) closeBtn2.style.display = '';
      if (closeBtnM2) closeBtnM2.style.display = '';
      if (footer2) { footer2.style.display = ''; footer2.innerHTML = '<button class="btn btn-cancel" onclick="closeModal()">닫기</button>'; }
    }

    candidates.forEach(cf => {
      const row = document.createElement('div');
      row.className = 'opt-row';
      row.style.cursor = 'pointer';
      row.innerHTML = `<span class="opt-row-icon">📄</span><span class="opt-row-name">${cf.name_ko}</span><span style="font-size:10px;color:var(--text2);margin-left:auto;">${cf.name_en||''}</span>`;
      row.onclick = () => {
        container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        if (typeof showItemDetail === 'function') showItemDetail(cf);
        const detEl = document.getElementById('modal-detail');
        if (detEl) {
          const btn = document.createElement('button');
          btn.textContent = '이 재주 선택';
          btn.style.cssText = 'width:100%;margin-top:12px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;';
          btn.onclick = () => {
            const fullName = cf.name_ko + (cf.name_en ? ' (' + cf.name_en + ')' : '');
            _applyFeatChoice(fullName);
          };
          detEl.appendChild(btn);
        }
      };
      container.appendChild(row);
    });
  }
}

function _applyFeatChoice(choiceId) {
  if (!modalContext) return;
  const {featType, featIndex, choiceDef} = modalContext;

  // ── skill_multi: 다중 기술 선택 ──
  if (choiceDef?.type === 'skill_multi') {
    state.feats[featType][featIndex].choice = choiceId; // "athletics,stealth" 형태
    renderFeats();
    try { recalcAll(); } catch(e) { console.error(e); }
    save();
    closeModal();
    return;
  }

  // ── feat_pick: 재주 부여 + 연쇄 모달 ──
  if (choiceDef?.type === 'feat_pick') {
    // 부모 재주에 choice 저장 (있으면)
    if (featType && featIndex !== null && state.feats[featType]?.[featIndex]) {
      state.feats[featType][featIndex].choice = choiceId;
    }
    const grantTo = choiceDef.grantTo || 'general';
    const grantedBy = choiceDef._grantedBy || (state.feats[featType]?.[featIndex]?.name || '');
    if (!state.feats[grantTo]) state.feats[grantTo] = [];
    const _fdC = getFeat(choiceId.split(' (')[0].trim());
    state.feats[grantTo].push({id: _fdC?.id || null, name: choiceId, level: 1, _grantedBy: grantedBy});
    const newIdx = state.feats[grantTo].length - 1;
    renderFeats();
    try { recalcAll(); } catch(e) { console.error(e); }
    save();
    closeModal();
    // 부여된 재주에 선택이 필요하면 연쇄 모달
    if (typeof checkFeatChoice === 'function') {
      checkFeatChoice(choiceId, grantTo, newIdx);
    }
    return;
  }

  state.feats[featType][featIndex].choice = choiceId;

  // spell_cantrip 선택 시 선천적 주문에 추가
  if (choiceDef?.type === 'spell_cantrip' || choiceDef?.type === 'spell_rank') {
    const tradition = choiceDef.tradition || 'arcane';
    const tradKo = {arcane:'비전',divine:'신성',occult:'오컬트',primal:'원시'}[tradition] || tradition;
    const featName = state.feats[featType][featIndex].name || '';
    // 기존에 이 재주로 추가된 선천 주문 제거
    if (!state.spells.innate) state.spells.innate = [];
    state.spells.innate = state.spells.innate.filter(s => s._sourceFeat !== featName);
    // 새 선천 주문 추가
    const spType = choiceDef.type === 'spell_rank' ? 'spell' : 'cantrip';
    const spUses = choiceDef.type === 'spell_rank' ? '하루 1회' : '자유';
    const _spCh = getSpell(choiceId);
    state.spells.innate.push({id: _spCh?.id || null, name: choiceId, tradition: tradKo, type: spType, uses: spUses, _sourceFeat: featName, _source: featName});
    if (typeof renderSpells === 'function') renderSpells();
    // 선천적 주문 탭으로 자동 전환
    if (typeof switchSpellSubtab === 'function') switchSpellSubtab('innate');
  }

  renderFeats();
  try { recalcAll(); } catch(e) { console.error(e); }
  save();
  closeModal();

  // 양자 혈통 선택 완료 후 — 문화 적응의 grant_adopted_feat → feat_pick으로 혈통 재주 선택
  if (choiceDef?.type === 'ancestry_pick') {
    const grantedByFeat = state.feats[featType]?.[featIndex];
    if (grantedByFeat?._grantedBy) {
      const parentFeatName = grantedByFeat._grantedBy;
      const traitName = ANCESTRY_NAME_MAP[choiceId] || choiceId;
      const alreadyGranted = (state.feats.ancestry||[]).some(f => f && f._grantedBy === parentFeatName);
      if (!alreadyGranted) {
        openFeatChoiceModal(null, null, {
          type: 'feat_pick',
          label: traitName + ' 1레벨 혈통 재주 선택',
          pickCategory: 'ancestry',
          pickMaxLevel: 1,
          pickTraits: [traitName],
          grantTo: 'ancestry',
          _grantedBy: parentFeatName
        });
      }
    }
  }
}

// ── 재주 추가 시 선택 필요 여부 체크 ──

function checkFeatChoice(featName, featType, featIndex) {
  const nameEn = _extractEnName(featName);
  const def = _getFeatEffectsDef(nameEn);
  if (def && def.choice) {
    const t = def.choice.type;
    // 인라인 컨트롤이 있는 타입은 팝업 생략 → 재주 탭에서 선택
    if (t === 'lore' || t === 'skill' || t === 'skill_fixed' || t === 'skill_defaults' || (t === 'custom' && def.choice.options)) {
      return false;
    }
    openFeatChoiceModal(featType, featIndex, def.choice);
    return true; // 선택 모달이 열림
  }
  return false; // 선택 불필요
}
