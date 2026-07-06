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
// v0.28~ 효과 단일화: 모든 효과는 EFFECTS_DB(effects_db.js, slug 단일 소스)에서 조립.
//  (구 RE-브리지 _fvttFeatDef 제거 — fvtt 효과는 build_effects.mjs가 EFFECTS_DB에 baked.)
// v0.28~ 효과 단일화: EFFECTS_DB(effects_db.js) slug 단일 소스. 레거시 EFFECT_GROUPS 경로 + RE-브리지 폐기.
// override(effect_groups.json, slug 키)는 getEffectRows(slug)가 반영 → def.effects에 자동 적용.
function _getFeatEffectsDef(nameEn) {
  if (!nameEn) return null;
  if (typeof getFeat !== 'function') return null;
  const f = getFeat(nameEn); if (!f) return null;
  const slug = f.id; if (!slug) return null;
  const entry = (typeof EFFECTS_DB !== 'undefined') ? EFFECTS_DB[slug] : null;
  // override(있으면 base rows 대체) 반영 — getEffectRows가 slug 키로 처리
  const rows = (typeof getEffectRows === 'function') ? getEffectRows(slug) : (entry && entry.rows) || [];
  const autoNote = entry && entry.auto_note, dmgNote = entry && entry.damage_note, choiceE = entry && entry.choice;
  if (!rows.length && !autoNote && !dmgNote && !choiceE) return null;

  const effects = rows.map(_rowToEffect);
  if (autoNote) effects.push({ type: 'display_note', text: autoNote });
  if (dmgNote) effects.push(Object.assign({ type: 'damage_note' }, dmgNote));

  let choice = null, choiceEffects = null;
  if (choiceE) {
    choice = { type: choiceE.kind || '' };
    if (choiceE.label) choice.label = choiceE.label;
    if (choiceE.filter && typeof choiceE.filter === 'object') Object.assign(choice, choiceE.filter);
    const opts = choiceE.options || [];
    if (choiceE.kind === 'custom') choice.options = opts.map(o => ({ id: o.option_id, name: o.option_name }));
    else if (choiceE.kind === 'skill_defaults') choice.defaults = opts.filter(o => o.is_default).map(o => o.option_id);
    for (const o of opts) {
      if (o.rows && o.rows.length) { (choiceEffects = choiceEffects || {})[o.option_id] = o.rows.map(_rowToEffect); }
    }
  }
  const def = { effects };
  if (choice) def.choice = choice;
  if (choiceEffects) def.choiceEffects = choiceEffects;
  return def;
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

  // grant_lore: 지식 슬롯 초기화 (재주/배경 공용 restoreGrantedLores — prevName/prevRank 복원)
  if (typeof restoreGrantedLores === 'function') restoreGrantedLores(state._featGrantedLores);
  state._featGrantedLores = [];
  // 지식 슬롯 초과 경고: 재주 몫만 초기화(배경 몫은 rebuildCoreEffects가 관리). 아래에서 다시 채워짐.
  state._loreOverflow = (state._loreOverflow || []).filter(o => o.kind !== 'feat');

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

  // 부모 재주 생존 확인 — slug 기준(번역명 변경에도 부여관계 유지). featSlug는 name·id·객체·en명 모두 허용.
  const _fslug = (typeof featSlug === 'function') ? featSlug : (x => (x && (x.id || x.name)) || x);
  const allFeatSlugs = new Set(Object.values(state.feats).flat().filter(f => f).map(f => _fslug(f)));

  // grant_weapon: 부모 없으면 제거 (사용자 룬 설정 보존)
  state.weapons = (state.weapons || []).filter(w => !w._fromFeat || allFeatSlugs.has(_fslug(w._fromFeat)));

  // grant_feat: 부모 없으면 제거 (사용자 choice 보존)
  Object.values(state.feats).forEach(arr => {
    if (!arr) return;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i]?._grantedBy && !allFeatSlugs.has(_fslug(arr[i]._grantedBy))) {
        arr.splice(i, 1);
      }
    }
  });

  // 시야: 매 사이클 혈통 기본 → 유산 업그레이드 재적용 (재주 시야는 아래 효과 루프에서 max로 적용)
  // (v0.5 P4: 유산 단독 시야[동굴 엘프 등]가 _featVisionUpgrade 게이트에 막혀 미적용되던 버그 수정 — 항상 재계산)
  state.vision = state.selectedAncestry?.vision || 'none';
  {
    const _hv = (typeof getHeritageEffects === 'function' ? getHeritageEffects(state.selectedHeritage).vision : null);
    if (_hv === 'upgrade') {
      if (state.vision === 'low-light') state.vision = 'darkvision';
      else if (state.vision !== 'darkvision') state.vision = 'low-light';
    } else if (_hv && (VISION_RANK[_hv]||0) > (VISION_RANK[state.vision]||0)) {
      state.vision = _hv;
    }
  }

  // 모든 재주 카테고리 순회
  Object.values(state.feats).forEach(arr => {
    if (!arr) return;
    arr.forEach(feat => {
      // 효과 정의는 slug(feat.id) 우선 해소 — 이름 편집에도 안전. 폴백은 표시명 영문 추출.
      const _key = feat.id || _extractEnName(feat.name);
      if (!_key) return;
      const def = _getFeatEffectsDef(_key);
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
      // 재주 자동 부여 — eff.feat = slug(신) 또는 이름(구/override). getFeat이 둘 다 해소, dedup·저장은 slug 기준.
      if (eff.feat && feat.name) {
        const gf = getFeat(eff.feat);
        const gslug = gf?.id || null;
        const gname = gf ? (gf.name_ko + (gf.name_en ? ` (${gf.name_en})` : '')) : eff.feat;
        const alreadyHas = gslug
          ? Object.values(state.feats).flat().some(f => f && featSlug(f) === gslug)
          : Object.values(state.feats).flat().some(f => f && f.name && f.name.includes(String(eff.feat).split(' (')[0]));
        if (!alreadyHas) {
          if (!state.feats.general) state.feats.general = [];
          const entry = {id: gslug, name: gname, level: 1, _auto: true, _grantedBy: feat.id || feat.name};
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
          const gf = getFeat(eff.feat);
          const gslug = gf?.id || null;
          const gname = gf ? (gf.name_ko + (gf.name_en ? ` (${gf.name_en})` : '')) : eff.feat;
          const alreadyHas = gslug
            ? Object.values(state.feats).flat().some(f => f && featSlug(f) === gslug)
            : Object.values(state.feats).flat().some(f => f && f.name && f.name.includes(String(eff.feat).split(' (')[0]));
          if (!alreadyHas) {
            if (!state.feats.skill) state.feats.skill = [];
            const entry = {id: gslug, name: gname, level: 1, _auto: true, _grantedBy: feat.id || feat.name};
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
      // 재주 시야는 현재 시야(혈통/유산 포함)보다 높을 때만 적용 (다운그레이드 방지)
      if ((VISION_RANK[eff.vision]||0) > (VISION_RANK[state.vision]||0)) state.vision = eff.vision;
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
        const _pk = feat.id || feat.name;
        // eff.spell = slug(신) 또는 이름(구/override). getSpell이 둘 다 해소, dedup은 slug 기준.
        const _sp = getSpell(eff.spell);
        const _sid = _sp?.id || null;
        const _sname = _sp ? (_sp.name_ko || _sp.name_en) : eff.spell;
        const existing = state.spells.innate.find(s => s._sourceFeat === _pk && (_sid ? spellSlug(s) === _sid : s.name === eff.spell));
        if (!existing) {
          state.spells.innate.push({
            id: _sid,
            name: _sname, tradition: eff.tradition || '', type: eff.spellType || 'spell',
            uses: eff.uses || '하루 1회', _sourceFeat: _pk, _source: feat.name
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
        // DOMAIN_DB는 주문 slug 외래키 → getSpell(카탈로그)로 직접 lookup
        const sp = id ? getSpell(id) : null;
        spellName = sp ? sp.name_ko : '';
        spellId = sp?.id || null;
      } else {
        const _sp = getSpell(spellName);  // slug(신) 또는 이름(구) 해소
        spellId = _sp?.id || null;
        if (_sp) spellName = _sp.name_ko || _sp.name_en;  // 현재 카탈로그명으로 표시
      }
      if (spellName && !String(spellName).startsWith('$') && feat.name) {
        if (!state.spells.focus) state.spells.focus = [];
        const _pk = feat.id || feat.name;
        const existing = state.spells.focus.find(s => s._sourceFeat === _pk && (spellId ? spellSlug(s) === spellId : s.name === spellName));
        if (!existing) {
          state.spells.focus.push({id: spellId, name: spellName, _auto: true, _sourceFeat: _pk, _source: feat.name.split(' (')[0].trim()});
        }
      }
      break;
    }
    case 'grant_lore': {
      // 재주/배경 공용 grantLoreToSlot로 지식 부여. 레벨 스케일(prof_by_level)·슬롯 초과 처리 포함.
      // (예: 추가 지식 [[1,2],[3,4],[7,6],[15,8]] → 3/7/15레벨에 전문가·달인·전설.)
      let loreName = eff.name || '';
      if (loreName === '$choice') loreName = feat.choice || '';
      if (!loreName) break;
      if (typeof grantLoreToSlot === 'function') {
        const res = grantLoreToSlot(loreName, { profByLevel: eff.prof_by_level, trackingArr: state._featGrantedLores, fbSkills: fb.skills });
        if (!res.placed && !res.empty) {
          // 슬롯 만석 → 초과 경고 기록(재주 탭·성장 슬롯에 안내). 다른 지식 제거 시 다음 recalc에서 자동 적용.
          (state._loreOverflow = state._loreOverflow || []).push({ kind: 'feat', loreName: loreName, featRef: feat });
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

// 이미 선택된 재주의 전제조건이 현재 미달인지 체크 (★ slug 기준)
function _hasFeatPrereqIssue(feat) {
  if (typeof _checkPrereqs !== 'function') return false;
  const slug = feat.id || (typeof featSlug === 'function' ? featSlug(feat.name?.split(' (')[0]?.trim()) : null);
  if (!slug) return false;
  // 기계판정 가능한 구조화 조건(파싱 PREREQ_STRUCT 또는 레거시 prereq_group_id)이 있을 때만 판정.
  // 순수 내러티브(구조화 없음)는 항상 달성 → 이슈 없음.
  const hasStruct = typeof PREREQ_STRUCT !== 'undefined' && PREREQ_STRUCT[slug];
  const fd = typeof getFeat === 'function' ? getFeat(slug) : null;
  const hasLegacy = fd && fd.prereq_group_id;
  if (!hasStruct && !hasLegacy) return false;
  return !_checkPrereqs({ id: slug, prereq_group_id: hasLegacy ? fd.prereq_group_id : undefined });
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
    else if (typeof loreSlotFullForFeat === 'function' && loreSlotFullForFeat(feat)) html += `<div style="margin-top:4px;font-size:11px;color:#ff9800;">⚠ 지식 슬롯(2칸)이 가득 차 아직 적용되지 않았습니다. 다른 지식 출처를 제거하면 자동으로 적용됩니다.</div>`;
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
      if (ff && featSlug(ff) === 'multifarious-muse' && ff.choice) takenMuses.add(ff.choice);
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
    if (choiceDef.label && choiceDef.label.includes('영역') && state.deity && typeof _getDeity === 'function') {
      const deity = _getDeity(state.deity);
      if (deity && deity.domains && deity.domains.length > 0) {
        filteredOpts = choiceDef.options.filter(opt => deity.domains.includes(opt.id));  // domains=영역 id 배열 (구: opt.name 오탐)
        const note = document.createElement('div');
        note.style.cssText = 'font-size:11px;color:var(--accent);padding:8px 12px;border-bottom:1px solid var(--border);';
        note.textContent = `${deity.name_ko}의 영역: ${(deity.domains_ko&&deity.domains_ko.length?deity.domains_ko:deity.domains).join(', ')}`;
        container.appendChild(note);
      }
    }
    if (choiceDef.repeatable && choiceDef.label && choiceDef.label.includes('영역')) {
      const curFeat = (featType && featIndex != null && state.feats[featType]) ? state.feats[featType][featIndex] : null;
      const curSlug = curFeat ? featSlug(curFeat) : '';
      const alreadyChosen = new Set();
      Object.values(state.feats).flat().forEach(f => {
        if (f && curSlug && featSlug(f) === curSlug && f.choice) alreadyChosen.add(f.choice);
      });
      filteredOpts = filteredOpts.filter(opt => !alreadyChosen.has(opt.id));
    }
    if (choiceDef.filterByInitiated) {
      const initiatedDomains = new Set();
      Object.values(state.feats).flat().forEach(f => {
        if (f && featSlug(f) === 'domain-initiate' && f.choice) {
          initiatedDomains.add(f.choice);
        }
      });
      filteredOpts = filteredOpts.filter(opt => initiatedDomains.has(opt.id));
    } else if (choiceDef.label && choiceDef.label.includes('영역')) {
      // Domain Initiate: 신격의 4개 영역만 선택 가능 (PF2e 룰 PC1 p.113)
      // state.deity = 신격 id, DEITY_DB.domains = 영역 id 배열 (외래키)
      if (state.deity && typeof _getDeity === 'function') {
        const deity = _getDeity(state.deity);
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
          // DOMAIN_DB는 주문 slug 외래키 → getSpell(카탈로그) lookup
          const spellId = dom ? (isAdvanced ? dom.advanced : dom.initial) : null;
          const spell = spellId && typeof getSpell === 'function' ? getSpell(spellId) : null;
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
  } else if ((choiceDef.type === 'spell_cantrip' || choiceDef.type === 'spell_rank') && typeof _allSpells === 'function' && _allSpells().length) {
    const tradition = choiceDef.tradition || 'arcane';
    const isRankSpell = choiceDef.type === 'spell_rank';
    const targetRank = choiceDef.rank || 1;
    const _sp = _allSpells();
    let cantrips;
    if (isRankSpell) {
      cantrips = _sp.filter(sp => !sp.is_cantrip && !sp.is_focus && sp.rank && sp.rank <= targetRank && sp.traditions && sp.traditions.includes(tradition));
    } else if (tradition === 'any' || tradition === '$other') {
      const classTrad = state.selectedClass?.tradition || '';
      cantrips = _sp.filter(sp => sp.is_cantrip && !sp.is_focus && sp.traditions && (!classTrad || !sp.traditions.includes(classTrad)));
    } else {
      cantrips = _sp.filter(sp => sp.is_cantrip && !sp.is_focus && sp.traditions && sp.traditions.includes(tradition));
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
  } else if (choiceDef.type === 'ancestry_pick' && typeof PF2eAnc !== 'undefined' && PF2eAnc.ready && PF2eAnc.ready()) {
    // 혈통 선택 모달 — 이미 선택한 혈통과 내 혈통 제외 (FVTT 혈통 카탈로그 단일 소스)
    const _ancAll = PF2eAnc.ancestryList();
    const myAnc = state.selectedAncestry?.id || '';
    const alreadyAdopted = Object.values(state.feats).flat()
      .filter(f => f && featSlug(f) === 'adopted-ancestry' && f.choice)
      .map(f => f.choice);
    const available = _ancAll.filter(a => a.id !== myAnc && !alreadyAdopted.includes(a.id));

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
  } else if (choiceDef.type === 'weapon_pick' && typeof PF2eEquip !== 'undefined' && PF2eEquip.legacyList) {
    // ── 비일반(uncommon) 무기 선택 모달 (FVTT 카탈로그 단일 소스) ──
    // 군용 무기 전체 숙련 여부 확인
    const martialProf = parseInt(document.getElementById('prof-weapon-martial')?.value || 0);
    const allMartialTrained = martialProf >= 2;

    const candidates = PF2eEquip.legacyList({type:'weapon'}).filter(w => {
      if (w.rarity !== 'uncommon') return false;           // 비일반 희귀도만
      if (allMartialTrained) return true;                  // 고급 비일반도 허용
      return w.category === '단순' || w.category === '군용'; // 그 외 단순/군용 비일반만
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
  } else if (choiceDef.type === 'feat_pick' && typeof _allFeats === 'function') {
    // ── 범용 재주 선택 모달 (적응력, 자연 야심, 고급 일반 훈련 등) ──
    let pickCat = choiceDef.pickCategory || 'general';
    if (pickCat === '$class' && state.selectedClass) pickCat = state.selectedClass.id;
    const pickMax = choiceDef.pickMaxLevel || 99;
    const pickTraits = choiceDef.pickTraits || null;

    // 이미 보유한 재주 (중복 방지) — slug 기준(이름 표기 무관)
    const ownedSlugs = new Set();
    for (const arr of Object.values(state.feats)) {
      if (Array.isArray(arr)) arr.forEach(f => { const s = (typeof featSlug === 'function') ? featSlug(f) : (f && f.id); if (s) ownedSlugs.add(s); });
    }

    // 아이우바린 유산 보유 + skipPrereqIfAiuvarin이면 능력치 전제조건 생략
    const isAiuvarin = state.selectedHeritage?.id === 'aiuvarin';
    const skipPrereq = choiceDef.skipPrereqIfAiuvarin && isAiuvarin;
    // 자기 클래스 헌신 slug = {classId}-dedication (이름 매칭 대체)
    const myClassDedSlug = state.selectedClass ? state.selectedClass.id + '-dedication' : '';

    // 소스 무관 통일: 클래스 pickCat은 _featInClass(FVTT category='class'+_classSlugs)로 판정
    const _isClassPick = pickCat && !['ancestry','general','skill','archetype','feature','other','class'].includes(pickCat);
    const candidates = _allFeats().filter(f => {
      if (!f) return false;
      if (_isClassPick) { if (!(typeof _featInClass === 'function' ? _featInClass(f, pickCat) : f.category === pickCat) && f.category !== 'archetype') return false; }
      else if (f.category !== pickCat) return false;
      if (f.feat_level > pickMax) return false;
      if (pickTraits && !(f.traits && f.traits.some(t => pickTraits.includes(t)))) return false;
      // 헌신 재주: 자기 클래스 헌신 제외 (slug 기준)
      if (pickTraits?.includes('헌신') && myClassDedSlug && f.id === myClassDedSlug) return false;
      // 전제조건 체크 (아이우바린이면 생략 가능)
      if (f.prerequisites && !skipPrereq && typeof _checkPrereqs === 'function' && !_checkPrereqs(f.prerequisites)) return false;
      // 헌신 재주 특수 조건 (다재다능은 skipDedicationLimit으로 무시)
      if (f.traits?.includes('헌신') && !choiceDef.skipDedicationLimit && typeof canTakeDedication === 'function' && !canTakeDedication(f)) return false;
      if (f.id && ownedSlugs.has(f.id)) return false;
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
    const _pf2 = state.feats[featType]?.[featIndex];
    const grantedBy = choiceDef._grantedBy || (_pf2 && (_pf2.id || _pf2.name)) || ''; // slug 우선
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
    const _pFeat = state.feats[featType][featIndex];
    const featName = _pFeat.name || '';
    const _pk = _pFeat.id || featName; // _sourceFeat = slug 저장(번역명 무관)
    // 기존에 이 재주로 추가된 선천 주문 제거
    if (!state.spells.innate) state.spells.innate = [];
    state.spells.innate = state.spells.innate.filter(s => featSlug(s._sourceFeat) !== featSlug(_pk));
    // 새 선천 주문 추가
    const spType = choiceDef.type === 'spell_rank' ? 'spell' : 'cantrip';
    const spUses = choiceDef.type === 'spell_rank' ? '하루 1회' : '자유';
    const _spCh = getSpell(choiceId);
    state.spells.innate.push({id: _spCh?.id || null, name: choiceId, tradition: tradKo, type: spType, uses: spUses, _sourceFeat: _pk, _source: featName});
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
      const alreadyGranted = (state.feats.ancestry||[]).some(f => f && featSlug(f._grantedBy) === featSlug(parentFeatName));
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
    // 인라인 컨트롤이 있는 타입은 팝업 생략 → 재주 탭 인라인 UI에서 선택.
    // lore(지식 분야 입력)도 인라인 처리(배경 혜택의 지식 입력과 동일 방식) — 별도 팝업 없음.
    // 미선택 시 재주 탭에 ⚠ 경고 + 인라인 입력이 노출(발견성 유지). grant_lore choice 전반에 적용.
    if (t === 'skill' || t === 'skill_fixed' || t === 'skill_defaults' || t === 'lore' || (t === 'custom' && def.choice.options)) {
      return false;
    }
    openFeatChoiceModal(featType, featIndex, def.choice);
    return true; // 선택 모달이 열림
  }
  return false; // 선택 불필요
}
