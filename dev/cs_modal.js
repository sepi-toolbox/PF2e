const _catKo = {ancestry:'혈통',class:'클래스',general:'일반',skill:'기술',archetype:'원형',bard:'바드',cleric:'클레릭',druid:'드루이드',fighter:'파이터',ranger:'레인저',rogue:'로그',witch:'위치',wizard:'위저드'};

// ═══════════════════════════════════════════════
//  REST & CONDITION MODALS
// ═══════════════════════════════════════════════

function openRestModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'rest';
  document.getElementById('modal-title').textContent = '휴식 Rest';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';

  const conMod = Math.max(1, getMod('con'));
  const lv = getLevel();
  const hpRecover = conMod * lv;

  const container = document.getElementById('modal-options');
  container.innerHTML = `<div style="padding:16px;">
    <p style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:12px;border-left:3px solid var(--accent);padding-left:10px;">
      캐릭터는 매일 8시간의 수면이 필요합니다. 휴식은 보통 밤에 하지만, 낮에도 같은 효과를 얻습니다. 24시간에 한 번만 휴식 효과를 받을 수 있습니다.
    </p>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);cursor:pointer;">
        <input type="checkbox" id="rest-hp" checked style="accent-color:var(--accent);width:18px;height:18px;">
        HP를 건강 수정치 × 레벨만큼 회복 (${hpRecover} HP)${getHeritageEffects(state.selectedHeritage).restBonusHp ? ` + 언덕 하플링 보너스 (${lv} HP)` : ''}
      </label>
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);cursor:pointer;">
        <input type="checkbox" id="rest-fatigue" checked style="accent-color:var(--accent);width:18px;height:18px;">
        피로(Fatigued) 상태 해제
      </label>
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);cursor:pointer;">
        <input type="checkbox" id="rest-doomed" checked style="accent-color:var(--accent);width:18px;height:18px;">
        파멸(Doomed)과 탈진(Drained) 수치 1 감소
      </label>
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);cursor:pointer;">
        <input type="checkbox" id="rest-spells" checked style="accent-color:var(--accent);width:18px;height:18px;">
        주문 슬롯 회복
      </label>
    </div>
    </div>
    ${_hasAncestralLongevity() ? `
    <div style="margin-top:12px;padding:10px;background:var(--bg3);border:1px solid var(--accent);border-radius:4px;">
      <div style="font-size:12px;color:var(--accent);font-weight:600;margin-bottom:6px;">📜 조상의 장수 — 임시 기술 숙련</div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:8px;">준비 시 선택한 기술 1개에 임시 숙련됨을 부여합니다. 다음 휴식까지 지속됩니다.</div>
      <select id="rest-ancestral-skill" style="width:100%;padding:6px;background:var(--bg4);color:var(--text);border:1px solid var(--border2);border-radius:4px;font-size:12px;">
        <option value="">기술 선택...</option>
        ${SKILLS.filter(s => {
          if (s.isLore) return false;
          const baseRank = parseInt(document.getElementById('sk-prof-'+s.id)?.value||0);
          const featRank = state._fb?.skills?.[s.id]?.min_rank || 0;
          return Math.max(baseRank, featRank) < 2;
        }).map(s => `<option value="${s.id}" ${state.tempSkillTrained===s.id?'selected':''}>${s.name}</option>`).join('')}
      </select>
      ${_hasExpertLongevity() ? `
      <div style="margin-top:8px;border-top:1px solid var(--border);padding-top:8px;">
        <div style="font-size:11px;color:var(--accent);font-weight:600;margin-bottom:4px;">전문가의 장수 — 임시 전문가</div>
        <div style="font-size:10px;color:var(--text2);margin-bottom:4px;">이미 숙련된 기술 1개를 임시 전문가로 올립니다.</div>
        <select id="rest-expert-skill" style="width:100%;padding:6px;background:var(--bg4);color:var(--text);border:1px solid var(--border2);border-radius:4px;font-size:12px;">
          <option value="">기술 선택...</option>
          ${SKILLS.filter(s => {
            if (s.isLore) return false;
            const baseRank = parseInt(document.getElementById('sk-prof-'+s.id)?.value||0);
            return baseRank >= 2 && baseRank < 4;
          }).map(s => `<option value="${s.id}" ${state.tempSkillExpert===s.id?'selected':''}>${s.name}</option>`).join('')}
        </select>
      </div>` : ''}
    </div>` : ''}
    ${_hasGnomeObsession() ? `
    <div style="margin-top:12px;padding:10px;background:var(--bg3);border:1px solid var(--accent);border-radius:4px;">
      <div style="font-size:12px;color:var(--accent);font-weight:600;margin-bottom:6px;">🔍 집착적 연구 — 주제 변경</div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:8px;">집착할 지식 분야를 변경합니다.</div>
      <input id="rest-obsession-topic" type="text" value="${_getObsessionTopic()}" placeholder="새 지식 분야..." style="width:100%;padding:6px;background:var(--bg4);color:var(--text);border:1px solid var(--border2);border-radius:4px;font-size:12px;">
    </div>` : ''}
    ${_hasOtherworldlyAcumen() ? `
    <div style="margin-top:12px;padding:10px;background:var(--bg3);border:1px solid var(--accent);border-radius:4px;">
      <div style="font-size:12px;color:var(--accent);font-weight:600;margin-bottom:6px;">🔮 이세계 통찰 — 주문 교체</div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:8px;">휴식 1일을 소비하여 선천 주문을 같은 전통의 다른 2랭크 주문으로 교체할 수 있습니다.</div>
      <button onclick="closeModal();_reopenAcumenChoice()" style="width:100%;padding:8px;background:var(--accent-bg);border:1px solid var(--accent);border-radius:4px;color:var(--accent);cursor:pointer;font-size:12px;">주문 교체하기</button>
    </div>` : ''}
    <div style="display:flex;gap:8px;margin-top:16px;">
      <button onclick="applyRest()" style="flex:1;padding:10px;background:var(--accent);color:#000;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">적용</button>
      <button onclick="closeModal()" style="padding:10px 20px;background:var(--bg4);color:var(--text2);border:1px solid var(--border2);border-radius:4px;font-size:13px;cursor:pointer;">취소</button>
    </div>
  </div>`;

  const detail = document.getElementById('modal-detail');
  if (detail) detail.innerHTML = '';
  const listEl = document.querySelector('.modal-list');
  if (listEl) listEl.style.display = '';
}

// 재주 식별은 slug 기준(featSlug가 저장 id/이름을 카탈로그 slug로 해소) — 이름 편집에도 안전.
// 과거 하드코딩 한글명 매칭은 번역 갱신으로 이름이 드리프트하면 조용히 오작동함(예 '이세계 통찰'→'초월적 통찰력').
function _ownedFeatsFlat() { return Object.values(state.feats).flat().filter(Boolean); }
function _hasFeatSlug(slug) { return _ownedFeatsFlat().some(f => featSlug(f) === slug); }
function _findOwnedFeatBySlug(slug) { return _ownedFeatsFlat().find(f => featSlug(f) === slug); }

function _hasOtherworldlyAcumen() {
  return _hasFeatSlug('otherworldly-acumen');
}

function _reopenAcumenChoice() {
  // 해당 재주의 타입과 인덱스 찾기 (slug 기준)
  for (const [type, arr] of Object.entries(state.feats)) {
    const fi = arr.findIndex(f => f && featSlug(f) === 'otherworldly-acumen');
    if (fi >= 0) {
      const def = (typeof _getFeatEffectsDef === 'function') ? _getFeatEffectsDef('otherworldly-acumen') : null;
      if (def?.choice && typeof openFeatChoiceModal === 'function') {
        openFeatChoiceModal(type, fi, def.choice);
      }
      return;
    }
  }
}

function _hasGnomeObsession() {
  return _hasFeatSlug('gnome-obsession');
}
function _getObsessionTopic() {
  const f = _findOwnedFeatBySlug('gnome-obsession');
  return f?.choice || '';
}

function _hasExpertLongevity() {
  return _hasFeatSlug('expert-longevity');
}

function _hasAncestralLongevity() {
  return _hasFeatSlug('ancestral-longevity');
}

function applyRest() {
  if (document.getElementById('rest-hp')?.checked) {
    const conMod = Math.max(1, getMod('con'));
    const lv = getLevel();
    const hillockBonus = getHeritageEffects(state.selectedHeritage).restBonusHp ? lv : 0;
    const recover = conMod * lv + hillockBonus;
    const curEl = document.getElementById('hp-cur');
    const maxEl = document.getElementById('hp-max');
    if (curEl && maxEl) {
      const maxHp = parseInt(maxEl.value || 0);
      curEl.value = Math.min(maxHp, parseInt(curEl.value || 0) + recover);
    }
  }
  if (document.getElementById('rest-fatigue')?.checked) {
    const _f = _condName('fatigued'); if (state.conditions[_f]) state.conditions[_f] = 0;
  }
  if (document.getElementById('rest-doomed')?.checked) {
    const _d = _condName('doomed'), _dr = _condName('drained');
    if (state.conditions[_d] > 0) state.conditions[_d] = Math.max(0, state.conditions[_d] - 1);
    if (state.conditions[_dr] > 0) state.conditions[_dr] = Math.max(0, state.conditions[_dr] - 1);
  }
  if (document.getElementById('rest-spells')?.checked) {
    // 주문 슬롯 사용 초기화
    state.spellSlotsUsed = {};
    state.divineFontUsed = 0;
    // 선천 주문 사용 초기화
    state.innateSpellsUsed = {};
  }
  // 조상의 장수 임시 숙련
  const ancestralSel = document.getElementById('rest-ancestral-skill');
  if (ancestralSel) {
    state.tempSkillTrained = ancestralSel.value || null;
  }
  // 집착적 연구 주제 변경
  const obsInput = document.getElementById('rest-obsession-topic');
  if (obsInput && obsInput.value.trim()) {
    const newTopic = obsInput.value.trim();
    const obsFeat = _findOwnedFeatBySlug('gnome-obsession');
    if (obsFeat) obsFeat.choice = newTopic;
  }
  // 전문가의 장수 임시 전문가
  const expertSel = document.getElementById('rest-expert-skill');
  if (expertSel) {
    state.tempSkillExpert = expertSel.value || null;
  }
  updateHpGauge();
  buildConditions();
  renderSpells();
  recalcAll();
  save();
  closeModal();
}

function openConditionModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'condition-pick';
  document.getElementById('modal-title').textContent = '상태이상 추가';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = '';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  // footer: 닫기만
  const footer = document.querySelector('.modal-footer');
  if (footer) footer.innerHTML = '<button class="btn btn-cancel" onclick="closeModal()">닫기</button>';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  // PC: 리스트+디테일 모두 표시
  const listEl = document.querySelector('.modal-list');
  if (listEl) { listEl.style.display = ''; listEl.style.width = ''; listEl.style.borderRight = ''; }
  const detail = document.getElementById('modal-detail');
  if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">상태이상을 선택하면 상세 정보가 표시됩니다.</div>'; }

  renderConditionList();
}

function renderConditionList() {
  const q = document.getElementById('modal-search')?.value?.toLowerCase() || '';
  const container = document.getElementById('modal-options');
  container.innerHTML = '';

  CONDITIONS_DATA.forEach(c => {
    if (c.id === 'broken') return; // 장비 상태이므로 제외
    if (q && !c.name.includes(q) && !c.en.toLowerCase().includes(q)) return;
    const row = document.createElement('div');
    row.className = 'opt-row';
    row.style.cursor = 'pointer';
    const current = state.conditions[c.name] || 0;
    const isActive = c.valued ? current > 0 : current;
    row.innerHTML = `
      <div class="opt-row-icon" style="${isActive ? 'background:var(--red-bg);color:var(--red-light);' : ''}">${isActive ? '⚠' : '◻'}</div>
      <div style="flex:1;">
        <div class="opt-row-name">${c.name} <span style="color:var(--text2);font-size:10px;">${c.en}</span></div>
        <div style="font-size:10px;color:var(--text2);margin-top:2px;">${c.desc.substring(0, 60)}...</div>
      </div>
      ${isActive ? '<span style="color:var(--red-light);font-size:11px;font-weight:600;">' + (c.valued ? current : '활성') + '</span>' : ''}`;
    row.onclick = () => {
      const curVal = state.conditions[c.name] || 0;
      const statusText = c.valued ? `현재 수치: ${curVal}` + (c.max ? ` / ${c.max}` : '') : (curVal ? '활성' : '비활성');
      const btnHtml = `<div style="display:flex;gap:6px;margin-top:12px;">
        <button onclick="event.stopPropagation();toggleCondFromModal('${c.name}',1)" style="flex:1;padding:8px;background:var(--red-bg);color:var(--red-light);border:1px solid var(--red);border-radius:4px;cursor:pointer;font-size:12px;">${c.valued ? '+1 증가' : '적용'}</button>
        <button onclick="event.stopPropagation();toggleCondFromModal('${c.name}',-1)" style="flex:1;padding:8px;background:var(--bg4);color:var(--text2);border:1px solid var(--border2);border-radius:4px;cursor:pointer;font-size:12px;">${c.valued ? '-1 감소' : '해제'}</button>
      </div>`;

      if (window.innerWidth > 900) {
        // PC: 디테일 패인에 표시
        container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        const detail = document.getElementById('modal-detail');
        if (detail) {
          detail.innerHTML = `<div class="modal-detail-title">${c.name}</div><div class="modal-detail-en">${c.en}</div>
            <div style="font-size:11px;color:var(--red-light);margin:8px 0;">${statusText}</div>
            <div class="modal-detail-desc">${c.desc}</div>${btnHtml}`;
        }
      } else {
        // 모바일: 아코디언
        const existing = row.nextElementSibling;
        if (existing && existing.classList.contains('opt-row-detail') && existing.classList.contains('open')) {
          existing.classList.remove('open'); row.classList.remove('expanded'); return;
        }
        document.querySelectorAll('.opt-row-detail.open').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.opt-row.expanded').forEach(r => r.classList.remove('expanded'));
        row.classList.add('expanded');
        let detailDiv = row.nextElementSibling;
        if (!detailDiv || !detailDiv.classList.contains('opt-row-detail')) {
          detailDiv = document.createElement('div'); detailDiv.className = 'opt-row-detail'; row.after(detailDiv);
        }
        detailDiv.innerHTML = `<div style="font-size:12px;line-height:1.6;margin-bottom:8px;">${c.desc}</div>
          <div style="font-size:11px;color:var(--red-light);margin-bottom:8px;">${statusText}</div>${btnHtml}`;
        detailDiv.classList.add('open');
      }
    };
    container.appendChild(row);
  });

  // 모바일 아코디언용: 검색 이벤트 연결
  const searchEl = document.getElementById('modal-search');
  if (searchEl && !searchEl._condBound) {
    searchEl.addEventListener('input', renderConditionList);
    searchEl._condBound = true;
  }
}

function openResetModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'reset-confirm';
  document.getElementById('modal-title').textContent = '⚠ 슬롯 초기화';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  const listEl = document.querySelector('.modal-list');
  if (listEl) listEl.style.display = '';
  const detail = document.getElementById('modal-detail');
  if (detail) detail.innerHTML = '';

  const slot = typeof currentSlot !== 'undefined' ? currentSlot : 'slot1';
  const container = document.getElementById('modal-options');
  container.innerHTML = `<div style="padding:20px;text-align:center;">
    <div style="font-size:14px;color:var(--red-light);font-weight:700;margin-bottom:12px;">현재 슬롯 (${slot})의 모든 데이터를 삭제합니다</div>
    <div style="font-size:12px;color:var(--text2);margin-bottom:16px;line-height:1.6;">
      이 작업은 되돌릴 수 없습니다.<br>
      혈통, 클래스, 재주, 주문, 장비 등 모든 데이터가 초기화됩니다.
    </div>
    <label style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:13px;color:var(--text);cursor:pointer;margin-bottom:16px;">
      <input type="checkbox" id="reset-confirm-check" onchange="document.getElementById('reset-confirm-btn').disabled=!this.checked" style="accent-color:var(--red);width:18px;height:18px;">
      삭제에 동의합니다
    </label>
    <div style="display:flex;gap:8px;justify-content:center;">
      <button id="reset-confirm-btn" disabled onclick="executeReset()" style="padding:10px 24px;background:var(--red);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;opacity:0.5;">삭제</button>
      <button onclick="closeModal()" style="padding:10px 24px;background:var(--bg4);color:var(--text2);border:1px solid var(--border2);border-radius:4px;font-size:13px;cursor:pointer;">취소</button>
    </div>
  </div>`;

  // 체크박스 상태에 따라 버튼 opacity 변경
  const check = document.getElementById('reset-confirm-check');
  const btn = document.getElementById('reset-confirm-btn');
  if (check && btn) {
    check.onchange = () => {
      btn.disabled = !check.checked;
      btn.style.opacity = check.checked ? '1' : '0.5';
    };
  }
}

function executeReset() {
  // 로컬 state 초기화
  location.reload();
  // Firebase에서도 삭제
  if (typeof currentUser !== 'undefined' && currentUser && typeof currentSlot !== 'undefined') {
    const db2 = firebase.firestore();
    db2.collection('users').doc(currentUser.uid).collection(PF_COL.characters).doc(currentSlot).delete().then(() => {
      location.reload();
    }).catch(() => {
      location.reload();
    });
  }
}

function openSpeedModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'speed-edit';
  document.getElementById('modal-title').textContent = '이동 속도 관리';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  const listEl = document.querySelector('.modal-list');
  if (listEl) listEl.style.display = '';
  const detail = document.getElementById('modal-detail');
  if (detail) detail.innerHTML = '';

  if (!state.extraSpeeds) state.extraSpeeds = {};
  const baseSpeed = document.getElementById('speed')?.value || '25';
  const inputStyle = 'width:60px;background:var(--bg3);border:1px solid var(--border2);color:var(--text);padding:6px;border-radius:4px;font-size:14px;text-align:center;';
  const types = [['climb','등반 🧗'],['swim','수영 🏊'],['fly','비행 🕊'],['burrow','굴착 ⛏']];

  // 활성 보너스 섹션 (풀에서 category='speed') — 우측 detail 패널에 표시
  const speedBonuses = (state._fb?.bonuses || []).filter(b => b.category === 'speed');
  const TYPES = ['circumstance','status','item',''];
  const TYPE_KO = {circumstance:'상황', status:'상태', item:'아이템', '':'기타'};
  const byType = {};
  for (const b of speedBonuses) {
    const t = b.bonus_type || '';
    const v = (b.value === 'level') ? (typeof getLevel==='function'?getLevel():1) : (typeof b.value==='number'?b.value:parseInt(b.value)||0);
    const cur = byType[t];
    const curV = cur ? ((cur.value === 'level') ? (typeof getLevel==='function'?getLevel():1) : (typeof cur.value==='number'?cur.value:parseInt(cur.value)||0)) : -Infinity;
    if (v > curV) byType[t] = b;
  }
  let totalApplied = 0;
  for (const t of TYPES) {
    if (byType[t]) totalApplied += (byType[t].value === 'level') ? (typeof getLevel==='function'?getLevel():1) : byType[t].value;
  }
  const detailEl = document.getElementById('modal-detail');
  if (detailEl) {
    detailEl.innerHTML = `
      <div style="padding:16px;">
        <div style="color:var(--accent);font-size:14px;font-weight:600;margin-bottom:10px">⚡ 활성 보너스</div>
        <div style="color:#888;font-size:11px;margin-bottom:12px">★ = 자동 적용 (type별 max 1개). PF2e 규칙상 같은 type 비합산.</div>
        ${speedBonuses.length ? speedBonuses.map(b => {
          const t = b.bonus_type || '';
          const isApplied = byType[t] === b;
          const sign = (typeof b.value==='number' && b.value<0) ? '' : '+';
          const cond = b.condition ? ` <span style="color:#888;font-size:11px">(조건: ${b.condition})</span>` : '';
          const mark = isApplied ? '<span style="color:#0c0;font-weight:700">★</span> ' : '<span style="color:#666">·</span> ';
          return `<div style="padding:4px 0;font-size:13px">${mark}<strong>${sign}${b.value}</strong> [${TYPE_KO[t]}] <em style="color:#bbb">${b.source||''}</em>${cond}</div>`;
        }).join('') : '<div style="color:#666;font-size:12px">활성 보너스 없음</div>'}
        <div style="margin-top:14px;padding-top:10px;border-top:1px solid var(--border);text-align:right;font-size:14px">
          <span style="color:#aaa">자동 적용 합계:</span> <strong style="color:var(--accent)">${totalApplied>=0?'+':''}${totalApplied}</strong>
        </div>
      </div>
    `;
  }

  const container = document.getElementById('modal-options');
  container.innerHTML = `<div style="padding:16px;">
    <div style="border:1px solid var(--border);border-radius:6px;padding:12px;margin-bottom:12px;">
      <div style="font-size:12px;color:var(--text2);margin-bottom:6px;">🏃 기본 이동 속도</div>
      <div style="display:flex;align-items:center;gap:6px;">
        <input type="number" id="speed-edit-base" value="${baseSpeed}" min="0" onkeydown="if(event.key==='Enter')applySpeedChanges()" style="${inputStyle}">
        <span style="font-size:12px;color:var(--text2);">피트</span>
      </div>
    </div>
    ${types.map(([key, label]) => `
    <div style="border:1px solid var(--border);border-radius:6px;padding:12px;margin-bottom:8px;">
      <div style="font-size:12px;color:var(--text2);margin-bottom:6px;">${label} 속도</div>
      <div style="display:flex;align-items:center;gap:6px;">
        <input type="number" id="speed-edit-${key}" value="${state.extraSpeeds[key]||0}" min="0" onkeydown="if(event.key==='Enter')applySpeedChanges()" style="${inputStyle}">
        <span style="font-size:12px;color:var(--text2);">피트 (0 = 없음)</span>
      </div>
    </div>`).join('')}
    <button onclick="applySpeedChanges()" style="width:100%;padding:10px;background:var(--accent);color:#000;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;margin-top:8px;">적용</button>
  </div>`;
}

function applySpeedChanges() {
  const base = parseInt(document.getElementById('speed-edit-base')?.value || 25);
  document.getElementById('speed').value = base;
  if (!state.extraSpeeds) state.extraSpeeds = {};
  ['climb','swim','fly','burrow'].forEach(key => {
    const val = parseInt(document.getElementById('speed-edit-'+key)?.value || 0);
    state.extraSpeeds[key] = val > 0 ? val : 0;
  });
  syncAllProfRanks();
  save();
  closeModal();
}

function openHpModal() {
  const cur = parseInt(document.getElementById('hp-cur').value)||0;
  const max = parseInt(document.getElementById('hp-max').value)||0;
  const temp = parseInt(document.getElementById('hp-temp').value)||0;

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'hp-edit';
  document.getElementById('modal-title').textContent = 'HP 관리';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  const listEl = document.querySelector('.modal-list');
  if (listEl) { listEl.style.display = ''; listEl.style.width = '100%'; listEl.style.borderRight = 'none'; }
  const detail = document.getElementById('modal-detail');
  if (detail) detail.style.display = 'none';
  const modalEl = document.querySelector('.modal');
  if (modalEl && window.innerWidth > 900) { modalEl.style.maxWidth = '420px'; modalEl.style.height = 'auto'; }

  const inputStyle = 'flex:1;background:var(--bg3);border:1px solid var(--border2);color:var(--text);padding:8px;border-radius:4px;font-size:14px;text-align:center;';
  const container = document.getElementById('modal-options');
  container.innerHTML = `<div style="padding:16px;">
    <div style="text-align:center;margin-bottom:16px;">
      <div style="font-size:12px;color:var(--text2);">현재 HP</div>
      <div style="font-size:28px;font-weight:700;color:var(--text);">${cur} <span style="color:var(--text2);font-size:16px;">/ ${max}</span></div>
      ${temp > 0 ? '<div style="font-size:12px;color:#999;">임시 HP: +' + temp + '</div>' : ''}
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div style="border:1px solid var(--border);border-radius:6px;padding:12px;">
        <div style="font-size:12px;color:var(--text2);margin-bottom:6px;">❤️ 회복</div>
        <div style="display:flex;gap:6px;">
          <input type="number" id="hp-heal-val" min="0" value="0" onkeydown="if(event.key==='Enter')applyHpHeal()" style="${inputStyle}">
          <button onclick="applyHpHeal()" style="padding:8px 16px;background:var(--green);color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">확인</button>
        </div>
      </div>
      <div style="border:1px solid var(--border);border-radius:6px;padding:12px;">
        <div style="font-size:12px;color:var(--text2);margin-bottom:6px;">⚔️ 피해</div>
        <div style="display:flex;gap:6px;">
          <input type="number" id="hp-dmg-val" min="0" value="0" onkeydown="if(event.key==='Enter')applyHpDamage()" style="${inputStyle}">
          <button onclick="applyHpDamage()" style="padding:8px 16px;background:var(--red);color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">확인</button>
        </div>
      </div>
      <div style="border:1px solid var(--border);border-radius:6px;padding:12px;">
        <div style="font-size:12px;color:var(--text2);margin-bottom:6px;">🔧 HP 직접 설정</div>
        <div style="display:flex;gap:6px;">
          <input type="number" id="hp-set-val" min="0" value="${cur}" onkeydown="if(event.key==='Enter')applyHpSet()" style="${inputStyle}">
          <button onclick="applyHpSet()" style="padding:8px 16px;background:var(--bg4);color:var(--text);border:1px solid var(--border2);border-radius:4px;cursor:pointer;font-size:13px;">확인</button>
        </div>
      </div>
      <div style="border:1px solid var(--border);border-radius:6px;padding:12px;">
        <div style="font-size:12px;color:var(--text2);margin-bottom:6px;">🛡 임시 HP 설정</div>
        <div style="display:flex;gap:6px;">
          <input type="number" id="hp-temp-set" min="0" value="${temp}" onkeydown="if(event.key==='Enter')applyHpTemp()" style="${inputStyle}">
          <button onclick="applyHpTemp()" style="padding:8px 16px;background:var(--bg4);color:var(--text);border:1px solid var(--border2);border-radius:4px;cursor:pointer;font-size:13px;">확인</button>
        </div>
      </div>
    </div>
  </div>`;
}

function applyHpHeal() {
  const val = parseInt(document.getElementById('hp-heal-val').value)||0;
  if (val <= 0) return;
  const curEl = document.getElementById('hp-cur');
  const max = parseInt(document.getElementById('hp-max').value)||0;
  curEl.value = Math.min(max, (parseInt(curEl.value)||0) + val);
  updateHpGauge(); save(); closeModal();
}

function applyHpDamage() {
  const val = parseInt(document.getElementById('hp-dmg-val').value)||0;
  if (val <= 0) return;
  const curEl = document.getElementById('hp-cur');
  const tempEl = document.getElementById('hp-temp');
  let dmg = val;
  // 임시 HP 먼저 차감
  let temp = parseInt(tempEl.value)||0;
  if (temp > 0) {
    const absorbed = Math.min(temp, dmg);
    temp -= absorbed;
    dmg -= absorbed;
    tempEl.value = temp;
  }
  curEl.value = Math.max(0, (parseInt(curEl.value)||0) - dmg);
  updateHpGauge(); save(); closeModal();
}

function applyHpSet() {
  const val = parseInt(document.getElementById('hp-set-val').value)||0;
  const max = parseInt(document.getElementById('hp-max').value)||0;
  document.getElementById('hp-cur').value = Math.min(max, Math.max(0, val));
  updateHpGauge(); save(); closeModal();
}

function applyHpTemp() {
  const val = parseInt(document.getElementById('hp-temp-set').value)||0;
  document.getElementById('hp-temp').value = Math.max(0, val);
  updateHpGauge(); save(); closeModal();
}

function openShieldHpModal() {
  const cur = parseInt(document.getElementById('shield-hp-cur')?.value)||0;
  const max = parseInt(document.getElementById('shield-hp')?.value)||0;
  const hard = parseInt(document.getElementById('shield-hard')?.value)||0;
  const bt = Math.floor(max/2);
  const name = document.getElementById('shield-name')?.value||'방패';

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'shield-hp';
  document.getElementById('modal-title').textContent = '🛡 ' + name + ' HP';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  const listEl = document.querySelector('.modal-list');
  if (listEl) { listEl.style.display = ''; listEl.style.width = '100%'; listEl.style.borderRight = 'none'; }
  const detail = document.getElementById('modal-detail');
  if (detail) detail.style.display = 'none';
  const modalEl = document.querySelector('.modal');
  if (modalEl && window.innerWidth > 900) { modalEl.style.maxWidth = '420px'; modalEl.style.height = 'auto'; }

  const inputStyle = 'flex:1;background:var(--bg3);border:1px solid var(--border2);color:var(--text);padding:8px;border-radius:4px;font-size:14px;text-align:center;';
  const container = document.getElementById('modal-options');
  container.innerHTML = `<div style="padding:16px;">
    <div style="text-align:center;margin-bottom:16px;">
      <div style="font-size:12px;color:var(--text2);">방패 HP</div>
      <div style="font-size:28px;font-weight:700;color:var(--text);">${cur} <span style="color:var(--text2);font-size:16px;">/ ${max}</span></div>
      <div style="font-size:11px;color:var(--text2);margin-top:4px;">경도: ${hard} | 파손 기준: ${bt}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div style="border:1px solid var(--border);border-radius:6px;padding:12px;">
        <div style="font-size:12px;color:var(--text2);margin-bottom:6px;">🔧 수리 (회복)</div>
        <div style="display:flex;gap:6px;">
          <input type="number" id="shield-heal-val" min="0" value="0" onkeydown="if(event.key==='Enter')applyShieldHeal()" style="${inputStyle}">
          <button onclick="applyShieldHeal()" style="padding:8px 16px;background:var(--green);color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">확인</button>
        </div>
      </div>
      <div style="border:1px solid var(--border);border-radius:6px;padding:12px;">
        <div style="font-size:12px;color:var(--text2);margin-bottom:6px;">⚔️ 피해</div>
        <div style="display:flex;gap:6px;">
          <input type="number" id="shield-dmg-val" min="0" value="0" onkeydown="if(event.key==='Enter')applyShieldDamage()" style="${inputStyle}">
          <button onclick="applyShieldDamage()" style="padding:8px 16px;background:var(--red);color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">확인</button>
        </div>
      </div>
      <div style="border:1px solid var(--border);border-radius:6px;padding:12px;">
        <div style="font-size:12px;color:var(--text2);margin-bottom:6px;">🔧 HP 직접 설정</div>
        <div style="display:flex;gap:6px;">
          <input type="number" id="shield-set-val" min="0" value="${cur}" onkeydown="if(event.key==='Enter')applyShieldSet()" style="${inputStyle}">
          <button onclick="applyShieldSet()" style="padding:8px 16px;background:var(--bg4);color:var(--text);border:1px solid var(--border2);border-radius:4px;cursor:pointer;font-size:13px;">확인</button>
        </div>
      </div>
    </div>
  </div>`;
}

function applyShieldHeal() {
  const val = parseInt(document.getElementById('shield-heal-val').value)||0;
  if (val <= 0) return;
  const curEl = document.getElementById('shield-hp-cur');
  const max = parseInt(document.getElementById('shield-hp')?.value)||0;
  curEl.value = Math.min(max, (parseInt(curEl.value)||0) + val);
  updateShieldGauge(); save(); closeModal();
}

function applyShieldDamage() {
  const val = parseInt(document.getElementById('shield-dmg-val').value)||0;
  if (val <= 0) return;
  const curEl = document.getElementById('shield-hp-cur');
  const hard = parseInt(document.getElementById('shield-hard')?.value)||0;
  const dmg = Math.max(0, val - hard); // 경도만큼 피해 감소
  curEl.value = Math.max(0, (parseInt(curEl.value)||0) - dmg);
  updateShieldGauge(); save(); closeModal();
}

function applyShieldSet() {
  const val = parseInt(document.getElementById('shield-set-val').value)||0;
  const max = parseInt(document.getElementById('shield-hp')?.value)||0;
  document.getElementById('shield-hp-cur').value = Math.min(max, Math.max(0, val));
  updateShieldGauge(); save(); closeModal();
}

let _lastCondName = null;

function toggleCondFromModal(name, dir) {
  const cdata = CONDITIONS_DATA.find(c => c.name === name);
  if (!cdata) return;
  if (cdata.auto) return; // 자동 관리 상태이상은 수동 변경 불가
  if (cdata.valued) {
    let cur = state.conditions[name] || 0;
    cur = dir > 0 ? Math.min(cur + 1, cdata.max || 99) : Math.max(cur - 1, 0);
    state.conditions[name] = cur;
  } else {
    state.conditions[name] = dir > 0 ? 1 : 0;
  }
  _lastCondName = name;
  buildConditions();
  recalcAll();
  save();
  renderConditionList();
  // PC: 디테일 패인 즉시 갱신
  if (window.innerWidth > 900) {
    const c = cdata;
    const curVal = state.conditions[c.name] || 0;
    const statusText = c.valued ? `현재 수치: ${curVal}` + (c.max ? ` / ${c.max}` : '') : (curVal ? '활성' : '비활성');
    const btnHtml = `<div style="display:flex;gap:6px;margin-top:12px;">
      <button onclick="event.stopPropagation();toggleCondFromModal('${c.name}',1)" style="flex:1;padding:8px;background:var(--red-bg);color:var(--red-light);border:1px solid var(--red);border-radius:4px;cursor:pointer;font-size:12px;">${c.valued ? '+1 증가' : '적용'}</button>
      <button onclick="event.stopPropagation();toggleCondFromModal('${c.name}',-1)" style="flex:1;padding:8px;background:var(--bg4);color:var(--text2);border:1px solid var(--border2);border-radius:4px;cursor:pointer;font-size:12px;">${c.valued ? '-1 감소' : '해제'}</button>
    </div>`;
    const detail = document.getElementById('modal-detail');
    if (detail) {
      detail.innerHTML = `<div class="modal-detail-title">${c.name}</div><div class="modal-detail-en">${c.en}</div>
        <div style="font-size:11px;color:var(--red-light);margin:8px 0;">${statusText}</div>
        <div class="modal-detail-desc">${c.desc}</div>${btnHtml}`;
    }
  }
}

// ═══════════════════════════════════════════════
//  CLASS FEATURES AUTO-APPLY
// ═══════════════════════════════════════════════

function applyClassFeatures() {
  const cls = state.selectedClass;
  if (!cls) return;
  const level = getLevel();
  console.log('[applyClassFeatures] class:', cls.id, 'sub:', state.selectedSubclass?.id, 'lv:', level);
  try {

  // Build combined prof table: class base + subclass overrides
  const profs = {};
  // 레거시 CLASS_PROF_TABLE 우선, 미등재(신규 FVTT 클래스)면 PF2eClass 수작업 진행표
  let cp = typeof CLASS_PROF_TABLE !== 'undefined' ? CLASS_PROF_TABLE[cls.id] : null;
  if (!cp && typeof PF2eClass !== 'undefined' && PF2eClass.classProfTable) cp = PF2eClass.classProfTable(cls.id);
  if (cp) { for (const [t, p] of Object.entries(cp)) profs[t] = {...p}; }

  if (state.selectedSubclass && (state.selectedSubclass && state.selectedSubclass.prof_changes)) {
    const sp = state.selectedSubclass.prof_changes;
    if (sp) { for (const [t, p] of Object.entries(sp)) profs[t] = {...p}; } // REPLACE
  }

  // Apply proficiencies
  for (const [target, progression] of Object.entries(profs)) {
    let rank = 0;
    for (const [lv, val] of Object.entries(progression)) {
      if (parseInt(lv) <= level) rank = Math.max(rank, val);
    }
    const el = document.getElementById('prof-' + target);
    if (el) el.value = rank;
  }

  // ── Witch: auto-set spell tradition from patron (전통 = 서브클래스 데이터 필드) ──
  if (cls.id === 'witch' && state.selectedSubclass) {
    const trad = state.selectedSubclass.tradition;
    if (trad) {
      const tradEl = document.getElementById('spell-tradition');
      if (tradEl) tradEl.value = trad;
    }
  }

  // ── Auto-granted feats (class + subclass) ──
  // Save choices from auto feats before removing
  const savedAutoChoices = {};
  ['special','class','general','skill','ancestry','other'].forEach(cat => {
    if (!state.feats[cat]) state.feats[cat] = [];
    state.feats[cat].filter(f => f._auto && f.choice).forEach(f => {
      savedAutoChoices[featSlug(f) + '_' + (f._grantedBy||'')] = f.choice;
    });
    state.feats[cat] = state.feats[cat].filter(f => !f._auto);
  });
  // Gather all auto feats (CLASS_AUTO_FEATS + SUBCLASS_DB.granted_feats)
  const classFeats = CLASS_AUTO_FEATS?.[cls.id] || [];
  const subFeats = getSubclassAutoFeats(state.selectedSubclass);
  const allAutoFeats = [...classFeats, ...subFeats];
  // Also add CLASS_FEATURE_NAMES as auto-display items in special category
  const featureNames = (typeof CLASS_FEATURE_NAMES !== 'undefined' ? CLASS_FEATURE_NAMES[cls.id] : null) || [];
  const subFeatureNames = (state.selectedSubclass && true)
    ? (state.selectedSubclass.features || []) : [];
  // id/name_en/name_ko 중 하나라도 일치하면 동일 항목으로 간주 (어휘 차이 흡수)
  const _featMatch = (a, b) => {
    for (const k of ['id','name_en','name_ko']) {
      if (a[k] != null && a[k] === b[k]) return true;
    }
    return false;
  };
  [...featureNames, ...subFeatureNames].forEach(f => {
    if (f.lv <= level && !allAutoFeats.some(a => _featMatch(a, f))) {
      allAutoFeats.push({lv: f.lv, name_ko: f.name_ko, name_en: f.name_en, category: 'special'});
    }
  });
  console.log('[applyClassFeatures] auto feats:', allAutoFeats.length, 'items for', cls.id, 'subFeats:', subFeats);
  allAutoFeats.forEach(f => {
    if (f.lv <= level) {
      const cat = f.category || 'special';
      if (!state.feats[cat]) state.feats[cat] = [];
      // id(slug) 우선 해소 → 현재 카탈로그 이름으로 표시(이름 드리프트 무해), dedup·저장은 slug 기준.
      const _fd = (f.id && getFeat(f.id)) || (f.name_en && getFeat(f.name_en)) || (f.name_ko && getFeat(f.name_ko));
      const slug = _fd?.id || f.id || null;
      const featName = _fd ? (_fd.name_ko + (_fd.name_en ? ` (${_fd.name_en})` : ''))
                           : (f.name_ko + (f.name_en ? ` (${f.name_en})` : ''));
      const exists = slug ? state.feats[cat].some(e => featSlug(e) === slug)
                          : state.feats[cat].some(e => e.name === featName);
      if (!exists) {
        const autoFeat = {id: slug, name: featName, level: f.lv, _auto: true};
        if (f._subclass) autoFeat._subclass = true;
        const savedChoice = savedAutoChoices[(slug || featName) + '_'];
        if (savedChoice) autoFeat.choice = savedChoice;
        state.feats[cat].push(autoFeat);
      }
    }
  });
  if (typeof renderFeats === 'function') renderFeats();

  // ── Auto-feat choice trigger (e.g. Domain Initiate) ──
  if (typeof checkFeatChoice === 'function') {
    ['special','class','general','skill','ancestry','other'].forEach(cat => {
      (state.feats[cat]||[]).forEach((f, idx) => {
        if (f._auto && !f.choice) {
          const nameEn = typeof _extractEnName === 'function' ? _extractEnName(f.name) : '';
          const _def = nameEn && typeof _getFeatEffectsDef === 'function' ? _getFeatEffectsDef(nameEn) : null;
          if (_def && _def.choice) {
            setTimeout(() => checkFeatChoice(f.name, cat, idx), 0);
          }
        }
      });
    });
  }

  // ── Auto-granted spells (class + subclass) ──
  // Remove old auto spells (preserve null slots in cantrip)
  state.spells.cantrip = (state.spells.cantrip||[]).filter(s => s === null || !s?._auto);
  state.spells.focus = (state.spells.focus||[]).filter(s => !s?._auto);
  state.spells.known = (state.spells.known||[]).filter(s => !s?._auto);
  // Gather all auto spells
  const _classAutoSp = (typeof CLASS_AUTO_SPELLS!=='undefined' ? (CLASS_AUTO_SPELLS[cls.id]||[]) : []);
  const _subAutoSp = (state.selectedSubclass && getSubclassAutoSpells(state.selectedSubclass)) || [];
  const allAutoSpells = [..._classAutoSp, ..._subAutoSp];
  allAutoSpells.forEach(s => {
    if (s.lv <= level) {
      // id(slug) 우선 해소 → 현재 카탈로그 이름 표시, dedup은 slug 기준(이름 드리프트 무해).
      const _sp = (s.id && getSpell(s.id)) || (s.name_ko && getSpell(s.name_ko)) || (s.name_en ? getSpell(s.name_en) : null);
      const _id = _sp?.id || s.id || null;
      const spellName = _sp ? (_sp.name_ko || _sp.name_en) : s.name_ko;
      // 출처: 서브클래스 주문이면 서브클래스명, 아니면 클래스명
      const src = _subAutoSp.includes(s)
        ? (state.selectedSubclass?.name_ko || cls.name) : cls.name;
      const _dupe = (arr) => _id ? arr.some(sp => sp && spellSlug(sp) === _id) : arr.some(sp => sp?.name === spellName);
      if (s.type === 'cantrip') {
        if (!_dupe(state.spells.cantrip)) state.spells.cantrip.push({id: _id, name: spellName, rank:0, _auto: true, _source: src});
      } else if (s.type === 'focus') {
        if (!_dupe(state.spells.focus)) state.spells.focus.push({id: _id, name: spellName, _auto: true, _source: src});
      } else {
        if (!_dupe(state.spells.known)) state.spells.known.push({id: _id, name: spellName, rank: s.rank||1, _auto: true, _source: src});
      }
    }
  });
  console.log('[applyClassFeatures] auto spells added — focus:', state.spells.focus.length, 'known:', state.spells.known.length, 'cantrip:', state.spells.cantrip.length, 'allAutoSpells:', allAutoSpells);
  // growth 주문 동기화 (auto 주문 재설정 후 growth 주문 병합)
  if (typeof syncGrowthSpellsToState === 'function') syncGrowthSpellsToState();
  if (typeof syncFamiliarSpellsToState === 'function') syncFamiliarSpellsToState();
  if (typeof renderSpells === 'function') renderSpells();

  // Update UI badges
  if (typeof initWeaponProfBadges === 'function') initWeaponProfBadges();
  if (typeof initArmorProfBadges === 'function') initArmorProfBadges();
  if (typeof syncAllTeml === 'function') syncAllTeml();
  recalcAll();
  } catch(e) { console.error('[applyClassFeatures] ERROR:', e); }
}

// ═══════════════════════════════════════════════
//  CLASS-SPECIFIC BUILD CHOICES (Deity, Font, etc.)
// ═══════════════════════════════════════════════

// 신격 조회 = FVTT 신격 카탈로그(478) 단일 소스
function _allDeities() {
  return (typeof PF2eDeity !== 'undefined' && PF2eDeity.ready && PF2eDeity.ready()) ? PF2eDeity.deityList() : [];
}
function _getDeity(id) {
  return (typeof PF2eDeity !== 'undefined' && PF2eDeity.ready && PF2eDeity.ready()) ? (PF2eDeity.getDeityLegacy(id) || null) : null;
}

function openDeityPicker() {
  const _deities = _allDeities();
  if (!_deities.length) return;
  // 검색 활성화(478개 — 이름으로 찾기)
  const items = _deities.map(d =>
    `<div class="opt-row" data-s="${((d.name_ko||'')+' '+(d.name_en||'')+' '+(d.domains_ko||[]).join(' ')).toLowerCase()}" onclick="previewDeity('${d.id}',this)" style="padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--border);">
      ${typeof iconImg==='function'&&iconImg('deity',d)?`<div class="opt-row-icon" style="background:none;">${iconImg('deity',d)}</div>`:''}
      <span class="opt-row-name" style="flex:1;">${d.name_ko} <span style="color:var(--text2);font-size:11px;">${d.name_en}</span></span>
      <span style="font-size:10px;color:var(--text2);">${(typeof getWeapon==='function'&&getWeapon(d.weapon)?.name_ko)||d.weapon||''} / ${(d.sanctification||[]).map(s=>s==='holy'?'신성':'불경').join('·')}</span>
    </div>`).join('');
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal-title').textContent = `신격 선택 (${_deities.length})`;
  const fbar = document.getElementById('modal-filterbar'); if(fbar) fbar.innerHTML='';
  const searchEl = document.getElementById('modal-search');
  if(searchEl){ searchEl.style.display=''; searchEl.value=''; searchEl.placeholder='신격 이름·영역으로 검색'; searchEl.oninput=function(){ _filterDeityRows(this.value); }; }
  document.getElementById('modal-options').innerHTML = items;
  document.getElementById('modal-detail').innerHTML = '<div class="modal-detail-empty">신격을 선택하면 상세 정보가 표시됩니다.</div>';
  const footer = document.querySelector('.modal-footer');
  if(footer) footer.innerHTML = '<button class="btn btn-cancel" onclick="closeModal()">닫기</button>';
  modalType = 'deity-pick';
  _pendingDeityId = null;
}

var _pendingDeityId = null;

function _filterDeityRows(q) {
  q = (q||'').trim().toLowerCase();
  document.querySelectorAll('#modal-options .opt-row').forEach(r => {
    r.style.display = (!q || (r.getAttribute('data-s')||'').includes(q)) ? '' : 'none';
  });
}

function previewDeity(id, row) {
  const d = _getDeity(id);
  if(!d) return;
  _pendingDeityId = id;

  // 행 선택 표시
  document.querySelectorAll('.opt-row').forEach(r=>r.classList.remove('selected'));
  if(row) row.classList.add('selected');

  const sanctLabel = (d.sanctification||[]).length ? d.sanctification.map(s=>s==='holy'?'신성(Holy)':'불경(Unholy)').join(' / ') : '없음';
  const skillMap = {society:'사회',deception:'기만',athletics:'운동',acrobatics:'곡예',survival:'생존',
    intimidation:'위협',medicine:'의학',arcana:'주문학',stealth:'은신',crafting:'제작',
    nature:'자연학',occultism:'오컬티즘',religion:'종교학',diplomacy:'외교',performance:'공연',thievery:'도둑질',lore:'지식'};
  const skillName = d.skill_ko || skillMap[d.skill] || d.skill || '';
  const domainsStr = (d.domains_ko && d.domains_ko.length) ? d.domains_ko.join(', ') : (d.domains||[]).join(', ');
  const fontStr = (d.font && d.font.length) ? d.font.map(f=>f==='heal'?'치유':f==='harm'?'해악':f).join(' / ') : '';
  const titleStr = d.title ? `<div style="font-size:12px;color:var(--accent);font-style:italic;margin-top:2px;">${d.title}</div>` : '';
  const descStr = d.desc ? `<div style="font-size:12px;color:var(--text2);line-height:1.7;margin-top:8px;padding:8px 10px;background:var(--bg3);border-radius:4px;">${d.desc}</div>` : '';

  const detailHtml = `
    <div class="modal-detail-title">${d.name_ko}</div>
    <div class="modal-detail-en">${d.name_en}</div>
    ${titleStr}
    <div style="margin:12px 0;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.7;">
      <div><b>선호 무기:</b> ${(typeof getWeapon==='function'&&getWeapon(d.weapon)?.name_ko)||d.weapon||'없음'}</div>
      <div><b>신성화:</b> ${sanctLabel}</div>
      <div><b>신격 기술:</b> ${skillName}</div>
      <div><b>영역:</b> ${domainsStr||'—'}</div>
      ${fontStr?`<div><b>신성 원천:</b> ${fontStr}</div>`:''}
    </div>
    ${descStr}
    <button onclick="confirmDeity()" style="width:100%;margin-top:12px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">선택 확정</button>`;

  // 모바일: 아코디언
  if (window.innerWidth <= 900) {
    document.querySelectorAll('.opt-row-detail.open').forEach(d=>d.classList.remove('open'));
    document.querySelectorAll('.opt-row.expanded').forEach(r=>r.classList.remove('expanded'));
    if(row) {
      row.classList.add('expanded');
      let detailDiv = row.nextElementSibling;
      if(!detailDiv || !detailDiv.classList.contains('opt-row-detail')) {
        detailDiv = document.createElement('div'); detailDiv.className='opt-row-detail'; row.after(detailDiv);
      }
      detailDiv.innerHTML = detailHtml;
      detailDiv.classList.add('open');
    }
  } else {
    document.getElementById('modal-detail').innerHTML = detailHtml;
  }
}

function confirmDeity() {
  if(!_pendingDeityId) return;
  selectDeity(_pendingDeityId);
}

function selectDeity(id) {
  const d = _getDeity(id);
  if(!d) return;
  state.deity = id;
  // 신격 기술/선호 무기 숙련·성별화 자동 부여 여부 = 클래스 데이터 플래그 deity_skill (하드코딩 'cleric' 대신).
  // 일반 숭배자(타 클래스)는 신격을 '기록'만 — 기계 효과 없음(PF2e 정본). 챔피언 등은 클래스 특성에서 별도 처리.
  const deityTrains = !!(state.selectedClass && state.selectedClass.deity_skill);
  if(deityTrains) {
    // 신격 기술·선호무기 숙련은 rebuildCoreEffects(출처기반, _deityGrantedSkills/_deityGrantedProfs)가
    //   재파생 — 명령형 부여 제거(v0.134). 신격 변경/해제 시 recalcAll이 이전 부여를 자동 정리.
    const sanct = d.sanctification || [];
    if(state.sanctification && !sanct.includes(state.sanctification)) state.sanctification = null;
    if(sanct.length === 1) state.sanctification = sanct[0];
  }
  _pendingDeityId = null;
  closeModal();
  applyClassFeatures();
  renderGrowthPlan();
  recalcAll();
  save();
}

function clearDeity() {
  state.deity = null;
  state.sanctification = null;
  state._deityWeapon = null;
  recalcAll();   // 출처기반 재파생 — rebuildCoreEffects가 신격 부여 기술/무기숙련을 정리(v0.134).
  renderGrowthPlan();
  save();
}

function openSanctPicker() {
  if(!state.deity) return;
  const d = _getDeity(state.deity);
  if(!d) return;
  const opts = d.sanctification || [];
  const labels = {holy:'✨ 신성 Holy — 선한 힘에 축성됨', unholy:'🔥 불경 Unholy — 악한 힘에 축성됨'};
  const items = opts.map(s =>
    `<div class="opt-row" onclick="pickSanctification('${s}')" style="padding:12px;cursor:pointer;border-bottom:1px solid var(--border);">
      <span class="opt-row-name">${labels[s]||s}</span>
    </div>`).join('');
  items && (document.getElementById('modal-overlay').classList.remove('hidden'));
  document.getElementById('modal-title').textContent = '성별화 선택';
  const fbar = document.getElementById('modal-filterbar'); if(fbar) fbar.innerHTML='';
  const searchEl = document.getElementById('modal-search'); if(searchEl) searchEl.style.display='none';
  document.getElementById('modal-options').innerHTML = items;
  document.getElementById('modal-detail').innerHTML = '';
  const footer = document.querySelector('.modal-footer');
  if(footer) footer.innerHTML = '<button class="btn btn-cancel" onclick="closeModal()">닫기</button>';
  modalType = 'sanct-pick';
}

function pickSanctification(val) { state.sanctification = val; closeModal(); renderGrowthPlan(); save(); }
function clearSanctification() { state.sanctification = null; renderGrowthPlan(); save(); }

var _pendingFont = null;
function openDivineFontPicker() {
  _pendingFont = null;
  const items = `
    <div class="opt-row" onclick="previewDivineFont('heal',this)" style="padding:12px;cursor:pointer;border-bottom:1px solid var(--border);">
      <span class="opt-row-name">💚 치유 Heal — 치유 주문 추가 시전 횟수</span></div>
    <div class="opt-row" onclick="previewDivineFont('harm',this)" style="padding:12px;cursor:pointer;border-bottom:1px solid var(--border);">
      <span class="opt-row-name">💀 해악 Harm — 해악 주문 추가 시전 횟수</span></div>`;
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal-title').textContent = '신성 원천 선택';
  const fbar = document.getElementById('modal-filterbar'); if(fbar) fbar.innerHTML='';
  const searchEl = document.getElementById('modal-search'); if(searchEl) searchEl.style.display='none';
  document.getElementById('modal-options').innerHTML = items;
  document.getElementById('modal-detail').innerHTML = '<div class="modal-detail-empty">원천을 선택하면 상세 정보가 표시됩니다.</div>';
  const footer = document.querySelector('.modal-footer');
  if(footer) footer.innerHTML = '<button class="btn btn-cancel" onclick="closeModal()">닫기</button>';
  modalType = 'font-pick';
}

function previewDivineFont(val, row) {
  _pendingFont = val;
  document.querySelectorAll('.opt-row').forEach(r=>r.classList.remove('selected'));
  if(row) row.classList.add('selected');

  const isHeal = val === 'heal';
  const icon = isHeal ? '💚' : '💀';
  const label = isHeal ? '치유 원천' : '해악 원천';
  const labelEn = isHeal ? 'Heal' : 'Harm';
  const spellDesc = isHeal
    ? '최고 랭크 추가 슬롯에 <em>치유(Heal)</em> 주문만 준비할 수 있습니다.'
    : '최고 랭크 추가 슬롯에 <em>해로움(Harm)</em> 주문만 준비할 수 있습니다.';
  const _dfDesc = (typeof CLASS_FEATURE_NAMES !== 'undefined' && CLASS_FEATURE_NAMES.cleric)
    ? (CLASS_FEATURE_NAMES.cleric.find(f => f.id === 'divine-font') || {}).desc || '' : '';

  const detailHtml = `
    <div class="modal-detail-title">${icon} ${label}</div>
    <div class="modal-detail-en">${labelEn}</div>
    <div style="margin:12px 0;font-size:13px;line-height:1.7;">
      <div>${spellDesc}</div>
      <div style="margin-top:8px;color:var(--text2);font-size:12px;">${_dfDesc}</div>
    </div>
    <button onclick="confirmDivineFont()" style="width:100%;margin-top:12px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">선택 확정</button>`;

  if (window.innerWidth <= 900) {
    document.querySelectorAll('.opt-row-detail.open').forEach(d=>d.classList.remove('open'));
    document.querySelectorAll('.opt-row.expanded').forEach(r=>r.classList.remove('expanded'));
    if(row) {
      row.classList.add('expanded');
      let detailDiv = row.nextElementSibling;
      if(!detailDiv || !detailDiv.classList.contains('opt-row-detail')) {
        detailDiv = document.createElement('div'); detailDiv.className='opt-row-detail'; row.after(detailDiv);
      }
      detailDiv.innerHTML = detailHtml;
      detailDiv.classList.add('open');
    }
  } else {
    document.getElementById('modal-detail').innerHTML = detailHtml;
  }
}

function confirmDivineFont() {
  if (!_pendingFont) return;
  state.divineFont = _pendingFont;
  state.divineFontUsed = 0;
  _pendingFont = null;
  closeModal();
  applyClassFeatures();
  renderGrowthPlan();
  renderSpells();
  save();
}

function clearDivineFont() { state.divineFont = null; state.divineFontUsed = 0; renderGrowthPlan(); renderSpells(); save(); }

function toggleDivineFontSlot(idx) {
  const total = getDivineFontSlots();
  const used = state.divineFontUsed || 0;
  const remaining = total - used;
  let newUsed;
  if (idx < remaining) { newUsed = total - idx; }       // click bright: use down to here
  else { newUsed = total - idx - 1; }                    // click dim: restore up to here
  state.divineFontUsed = Math.max(0, Math.min(newUsed, total));
  renderSpells();
  save();
}

function getDivineFontSlots() {
  if(!state.divineFont || !state.selectedClass || !state.selectedClass.deity_skill) return 0;
  const lv = getLevel();
  // 신성한 샘(Divine Font) 정본: 4슬롯(L1~4) → 5(L5~14) → 6(L15~20). (구 표 4→10은 오류였음)
  return lv >= 15 ? 6 : lv >= 5 ? 5 : 4;
}

function onLevelChange() {
  applyClassFeatures();
  if (typeof syncGrowthSpellsToState === 'function') syncGrowthSpellsToState();
  if (typeof syncFamiliarSpellsToState === 'function') syncFamiliarSpellsToState();
  renderGrowthPlan();
  updateSpellSlotsForClass();
  // 클래스 모달이 열려 있으면 레벨별 특성 갱신
  if (modalType === 'class' && document.getElementById('class-level-ui')) {
    _refreshClassFeaturesPreview();
  }
  save();
}

// ═══════════════════════════════════════════════
//  GROWTH PLAN — Level-by-Level Progression
// ═══════════════════════════════════════════════

// GROWTH_TABLE = 클래스 미선택 시 기본 성장표(파이터 패턴). 클래스 선택 시엔 getGrowthTable가
// 그 클래스의 실제 획득 레벨(classToLegacy.growth = FVTT system.*FeatLevels)에서 파생한다.
const GROWTH_TABLE = {
  1:  { boosts:4, ancestry:true, heritage:true, background:true, classSel:true, ancestryFeat:true, classFeat:true },
  2:  { classFeat:true, skillFeat:true },
  3:  { generalFeat:true, skillIncrease:true },
  4:  { classFeat:true, skillFeat:true },
  5:  { boosts:4, ancestryFeat:true, skillIncrease:true },
  6:  { classFeat:true, skillFeat:true },
  7:  { generalFeat:true, skillIncrease:true },
  8:  { classFeat:true, skillFeat:true },
  9:  { ancestryFeat:true, skillIncrease:true },
  10: { boosts:4, classFeat:true, skillFeat:true },
  11: { generalFeat:true, skillIncrease:true },
  12: { classFeat:true, skillFeat:true },
  13: { ancestryFeat:true, skillIncrease:true },
  14: { classFeat:true, skillFeat:true },
  15: { boosts:4, generalFeat:true, skillIncrease:true },
  16: { classFeat:true, skillFeat:true },
  17: { ancestryFeat:true, skillIncrease:true },
  18: { classFeat:true, skillFeat:true },
  19: { generalFeat:true, skillIncrease:true },
  20: { boosts:4, classFeat:true, skillFeat:true },
};

// 능력치 부스트 레벨 = 전 클래스 공통 규칙(1/5/10/15/20). 레벨1 코어선택도 클래스 무관.
const _BOOST_LEVELS = [1, 5, 10, 15, 20];
// 선택 클래스의 실제 획득 레벨에서 성장표 파생. 데이터 없으면 기본 GROWTH_TABLE 폴백.
function getGrowthTable(cls) {
  const g = cls && cls.growth;
  if (!g || !Array.isArray(g.classFeat) || !g.classFeat.length) return GROWTH_TABLE;
  const has = (arr, lv) => Array.isArray(arr) && arr.indexOf(lv) !== -1;
  const table = {};
  for (let lv = 1; lv <= 20; lv++) {
    const e = {};
    if (_BOOST_LEVELS.indexOf(lv) !== -1) e.boosts = 4;
    if (lv === 1) { e.ancestry = true; e.heritage = true; e.background = true; e.classSel = true; }
    if (has(g.classFeat, lv))     e.classFeat = true;
    if (has(g.skillFeat, lv))     e.skillFeat = true;
    if (has(g.generalFeat, lv))   e.generalFeat = true;
    if (has(g.ancestryFeat, lv))  e.ancestryFeat = true;
    if (has(g.skillIncrease, lv)) e.skillIncrease = true;
    table[lv] = e;
  }
  return table;
}

function renderGrowthPlan() {
  const container = document.getElementById('growth-plan');
  if (!container) { console.warn('growth-plan container not found'); return; }
  const curLevel = getLevel();
  let html = '';
  try {

  // ── Core Build section (above level progression) ──
  html += `<div class="growth-core-section">`;
  html += `<div class="growth-core-header">핵심 빌드<span style="font-size:10px;color:var(--text2);font-weight:400;margin-left:6px;">Core Build</span></div>`;
  // Ancestry selector
  html += growthSlotWithClearHTML('ancestry-sel',
    state.selectedAncestry ? _slotCircle('ancestry', state.selectedAncestry, '🧬') : '🧬', '혈통 Ancestry',
    state.selectedAncestry ? `${state.selectedAncestry.name} (${state.selectedAncestry.en})` : null,
    "openModal('ancestry')", state.selectedAncestry ? "clearCoreSelection('ancestry')" : null);
  // Background selector
  html += growthSlotWithClearHTML('background-sel',
    state.selectedBackground ? _slotCircle('background', state.selectedBackground, '📜') : '📜', '배경 Background',
    state.selectedBackground ? `${state.selectedBackground.name} (${state.selectedBackground.en})` : null,
    "openModal('background')", state.selectedBackground ? "clearCoreSelection('background')" : null);
  // Class selector
  html += growthSlotWithClearHTML('class-sel',
    state.selectedClass ? _slotCircle('class', state.selectedClass, '⚔') : '⚔', '클래스 Class',
    state.selectedClass ? `${state.selectedClass.name} (${state.selectedClass.en})` : null,
    "openModal('class')", state.selectedClass ? "clearCoreSelection('class')" : null);
  // Deity selector (전 클래스 공통 — 핵심 빌드에서 별도 선택. 478 신격)
  {
    const _dObj = state.deity ? _getDeity(state.deity) : null;
    html += growthSlotWithClearHTML('deity-sel',
      _dObj ? _slotCircle('deity', _dObj, '🙏') : '🙏', '신격 Deity',
      _dObj ? `${_dObj.name_ko} (${_dObj.name_en})` : null,
      "openDeityPicker()", state.deity ? "clearDeity()" : null);
  }
  html += `</div>`;

  const _growthTable = getGrowthTable(state.selectedClass);
  for (let lv = 1; lv <= curLevel; lv++) {
    const plan = _growthTable[lv];
    if (!plan) continue;
    const g = state.growth[lv] || {};

    html += `<div class="growth-level-header">레벨 ${lv}<span style="font-size:10px;color:var(--text2);font-weight:400;">Level ${lv}</span></div>`;

    // Class features at this level (auto-display)
    if (state.selectedClass && typeof CLASS_FEATURE_NAMES !== 'undefined') {
      const classFeats = (CLASS_FEATURE_NAMES[state.selectedClass.id]||[]).filter(f => f.lv === lv);
      const subFeats = state.selectedSubclass && true
        ? (state.selectedSubclass.features || []).filter(f => f.lv === lv) : [];
      const allFeats = [...classFeats, ...subFeats];
      if (allFeats.length > 0) {
        html += `<div class="growth-slot" onclick="openClassModalAtLevel(${lv})" style="cursor:pointer;opacity:0.85;border-left:2px solid var(--accent);background:var(--accent-bg);">
          <div class="growth-slot-icon" style="background:var(--accent);color:#fff;font-size:10px;">⚡</div>
          <div class="growth-slot-body">
            <div class="growth-slot-label" style="color:var(--accent);font-size:10px;">클래스 특성</div>
            <div class="growth-slot-value" style="font-size:11px;line-height:1.5;">${allFeats.map(f => f.name_ko + ' <span style="color:var(--text2);font-size:9px;">' + f.name_en + '</span>').join('<br>')}</div>
          </div>
        </div>`;
      }
    }

    // Level 1 specials
    if (lv === 1) {
      // Heritage (only if ancestry selected)
      if (state.selectedAncestry) {
        html += growthSlotWithClearHTML('heritage-sel',
          state.selectedHeritage ? _slotCircle('heritage', state.selectedHeritage, '🛡') : '🛡', '유산 Heritage',
          state.selectedHeritage ? state.selectedHeritage.name_ko : null,
          "openModal('heritage')", state.selectedHeritage ? "clearCoreSelection('heritage')" : null);
      }
      // 언어/서브클래스/후원자 전통은 각 모달에서 처리

    }

    // Ability Boosts
    if (plan.boosts) {
      const boostKey = lv === 1 ? 'lv1' : `lv${lv}`;
      const boostCount = (state.boosts[boostKey] || []).length;
      const boostRemain = plan.boosts - boostCount;
      html += `<div class="growth-slot ${boostCount >= plan.boosts ? 'filled' : ''}" onclick="openModal('boost')">
        <div class="growth-slot-icon">⚙</div>
        <div class="growth-slot-body">
          <div class="growth-slot-label">능력치 부스트 Set Abilities</div>
          <div class="growth-slot-value">${boostCount >= plan.boosts ? boostCount + '개 선택 완료' : boostCount + '/' + plan.boosts + ' 선택'}</div>
        </div>
        ${boostRemain > 0 ? `<div class="growth-slot-badge">${boostRemain}</div>` : ''}
      </div>`;
    }

    // Skill Increase (levels 3,5,7,9,11,13,15,17,19)
    if (plan.skillIncrease) {
      const siVal = g.skillIncrease || '';
      const skObj = siVal ? SKILLS.find(s => s.id === siVal) : null;
      const display = skObj ? `${skObj.name} (${skObj.en})` : null;
      html += `<div class="growth-slot ${siVal ? 'filled' : ''}" onclick="growthPickSkillIncrease(${lv})">
        <div class="growth-slot-icon">📈</div>
        <div class="growth-slot-body">
          <div class="growth-slot-label">기술 증가 Skill Increase</div>
          <div class="growth-slot-value">${display || '선택 안 됨'}</div>
        </div>
        ${siVal ? '<span class="spell-del" onclick="event.stopPropagation();growthClearSkillIncrease('+lv+');" style="color:var(--red);font-size:14px;padding:0 4px;cursor:pointer;">✕</span>' : ''}
      </div>`;
    }

    // Ancestry Feat (혈통 선택 시에만)
    if (plan.ancestryFeat && state.selectedAncestry) {
      html += growthFeatSlotHTML(lv, 'ancestryFeat', '🧬', '혈통 재주 Ancestry Feat', 'ancestry', g.ancestryFeat);
    }

    // Class Feat (클래스 선택 시에만)
    if (plan.classFeat && state.selectedClass) {
      html += growthFeatSlotHTML(lv, 'classFeat', '⚔', '클래스 재주 Class Feat', 'class', g.classFeat);
    }

    // General Feat
    if (plan.generalFeat) {
      html += growthFeatSlotHTML(lv, 'generalFeat', '🔧', '일반 재주 General Feat', 'general', g.generalFeat);
    }

    // Skill Feat
    if (plan.skillFeat) {
      html += growthFeatSlotHTML(lv, 'skillFeat', '📚', '기술 재주 Skill Feat', 'skill', g.skillFeat);
    }

    // 주문 관련은 주문 탭의 "주문 배우기" 버튼에서 처리
    // 시그니처 주문만 빌더에 유지
    if (lv >= 3 && state.selectedClass?.casting === 'spontaneous') {
      html += growthSignatureCardHTML(lv);
    }
  }

  container.innerHTML = html;

  // Also update the mobile growth panel
  const mobileContainer = document.getElementById('growth-plan-mobile');
  if (mobileContainer) mobileContainer.innerHTML = html;
  } catch(e) { console.error('renderGrowthPlan error:', e); container.innerHTML = '<div style="color:red;padding:8px;">성장 플랜 렌더링 오류: '+e.message+'</div>'; }
}

// 빌드슬롯 원형 아이콘: 선택된 아이템 이미지로 원을 채움(없으면 이모지 폴백)
function _slotCircle(scope, item, emoji) {
  return (typeof iconCircle === 'function') ? iconCircle(scope, item, emoji) : emoji;
}
function growthSlotHTML(lv, key, icon, label, value, onclickStr) {
  const filled = value ? 'filled' : '';
  const display = value || '선택 안 됨';
  return `<div class="growth-slot ${filled}" onclick="${onclickStr}">
    <div class="growth-slot-icon">${icon}</div>
    <div class="growth-slot-body">
      <div class="growth-slot-label">${label}</div>
      <div class="growth-slot-value">${display}</div>
    </div>
  </div>`;
}

function growthSlotWithClearHTML(key, icon, label, value, onclickStr, clearAction) {
  const filled = value ? 'filled' : '';
  const display = value || '선택 안 됨';
  const clearBtn = clearAction ? `<span class="spell-del" onclick="event.stopPropagation();${clearAction};" style="color:var(--red);font-size:14px;padding:0 4px;cursor:pointer;">✕</span>` : '';
  return `<div class="growth-slot ${filled}" onclick="${onclickStr}">
    <div class="growth-slot-icon">${icon}</div>
    <div class="growth-slot-body">
      <div class="growth-slot-label">${label}</div>
      <div class="growth-slot-value">${display}</div>
    </div>
    ${clearBtn}
  </div>`;
}

function growthFeatSlotHTML(lv, key, icon, label, featType, value) {
  const filled = value ? 'filled' : '';
  const display = value || '선택 안 됨';
  // 채워진 슬롯 클릭 = 클래스/배경과 동일하게 선택 모달 재오픈(목록 + 현재 재주 하이라이트).
  // (구: showInfo 정보 팝업만 떠서 목록/교체가 불가했음 — 사용자 요청으로 통일)
  const clickAction = `growthPickFeat(${lv},'${key}','${featType}')`;
  // 선택된 재주 아이콘으로 원 교체
  const _fd = value && typeof getFeat === 'function' ? (getFeat(value) || getFeat(value.split(' (')[0].trim())) : null;
  const circleIco = value ? _slotCircle('feat', _fd || { name: value }, icon) : icon;
  // 선택된 재주의 전제조건 미달 체크
  let prereqWarn = '';
  if (value && typeof _hasFeatPrereqIssue === 'function') {
    try {
      if (_hasFeatPrereqIssue({name: value})) prereqWarn = '<div style="color:#ff9800;font-size:10px;margin-top:2px;">⚠ 선행 조건 미충족</div>';
    } catch(e) { console.warn('prereq check error:', e); }
  }
  // 지식 슬롯 초과 안내 (부여 지식이 2칸을 넘겨 아직 미적용) — 해당 재주 인스턴스로 조회
  let loreWarn = '';
  if (value && typeof loreSlotFullForFeat === 'function') {
    try {
      const _fobj = (state.feats[featType] || []).find(f => f && f.level === lv &&
        ((typeof featSlug === 'function') ? featSlug(f) === featSlug(value) : f.name === value));
      if (_fobj && loreSlotFullForFeat(_fobj)) loreWarn = '<div style="color:#ff9800;font-size:10px;margin-top:2px;">⚠ 지식 슬롯 가득 참 — 다른 지식 제거 시 적용</div>';
    } catch(e) {}
  }
  return `<div class="growth-slot ${filled}" onclick="${clickAction}">
    <div class="growth-slot-icon">${circleIco}</div>
    <div class="growth-slot-body">
      <div class="growth-slot-label">${label}</div>
      <div class="growth-slot-value">${display}</div>${prereqWarn}${loreWarn}
    </div>
    ${value ? '<span class="spell-del" onclick="event.stopPropagation();growthClearFeat('+lv+',\''+key+'\',\''+featType+'\');" style="color:var(--red);font-size:14px;padding:0 4px;cursor:pointer;">✕</span>' : ''}
  </div>`;
}

// Growth Plan: pick a feat via the existing modal system
let growthPendingLevel = null;
let growthPendingKey = null;
let growthPendingFeatType = null;

function growthPickFeat(lv, key, featType) {
  growthPendingLevel = lv;
  growthPendingKey = key;
  growthPendingFeatType = featType;
  openModal('feat', featType);
}

function growthClearFeat(lv, key, featType) {
  if (!state.growth[lv]) return;
  const oldName = state.growth[lv][key];
  if (oldName) {
    const arr = state.feats[featType];
    if (arr) {
      // 매칭은 slug 기준 — growth 저장명/재주명이 개명돼도 견고(featSlug가 양쪽 해소).
      const _os = (typeof featSlug === 'function') ? featSlug(oldName) : oldName;
      const idx = arr.findIndex(f => ((typeof featSlug === 'function') ? featSlug(f) : f.name) === _os && f.level === lv);
      if (idx >= 0) {
        // 부여 효과(기술숙련·숙련도·지식 등) 정리는 출처 기반 — splice 후 recalcAll이 미수집/재적용하며
        //   applyFeatEffects의 clear+rebuild(prevRank 복원)·assignLoreSlots가 자동 정리한다.
        //   ⚠ 이름·값 기반 수동 정리(if 숙련===2 then 0) 금지: base·타 출처 동일 부여를 오삭제.
        arr.splice(idx, 1);
      }
    }
    // 선천 주문 + 집중 주문 제거 (slug 기준 — _sourceFeat는 slug 저장)
    if (state.spells?.innate) state.spells.innate = state.spells.innate.filter(s => featSlug(s._sourceFeat) !== featSlug(oldName));
    if (state.spells?.focus) state.spells.focus = state.spells.focus.filter(s => featSlug(s._sourceFeat) !== featSlug(oldName));
    // 재주로 부여된 무기 제거 (grant_weapon)
    const _fEN = oldName?.match(/\(([^)]+)\)$/)?.[1] || '';
    if (_fEN) {
      state.weapons = state.weapons.filter(w => w._fromFeat !== _fEN);
    }
  }
  delete state.growth[lv][key];
  // cantrip_slots 재주를 제거한 경우 초과 캔트립 정리
  if (state.growth[lv]?.spells?.cantrip) {
    const cid = state.selectedClass?.id;
    const base = getNewSpellSlotsAtLevel(cid, lv);
    const baseCantrip = base?.cantrip || 0;
    const bonus = _getCantripBonusAtLevel(lv);
    const maxCantrip = baseCantrip + bonus;
    const arr = state.growth[lv].spells.cantrip;
    if (arr.length > maxCantrip) {
      // 초과분 삭제 + state.spells.cantrip에서도 제거
      const removed = arr.splice(maxCantrip);
      removed.forEach(name => {
        if (name && state.spells?.cantrip) {
          const idx = state.spells.cantrip.findIndex(c => c?.name === name);
          if (idx >= 0) state.spells.cantrip.splice(idx, 1);
        }
      });
    }
  }
  // 선행 연쇄 제거 + 선천 주문 정리
  if (typeof cascadeRemoveFeats === 'function') cascadeRemoveFeats();
  recalcAll();
  renderGrowthPlan();
  renderFeats();
  save();
}

function getAvailableSkillsForTraining(slotIndex, trainArr) {
  // Returns skill ids not yet selected in other training slots and not already trained
  const usedIds = (trainArr || []).filter((v, i) => v && i !== slotIndex);
  return SKILLS.filter(sk => {
    if (usedIds.includes(sk.id)) return false;
    // Check if already trained by class fixed skills (prof >= 2) but allow if it's the current slot's value
    const el = document.getElementById('sk-prof-' + sk.id);
    const rank = parseInt(el?.value || 0);
    // If skill is trained and it's not because of this training slot, skip
    if (rank >= 2) {
      const trainArrCurrent = (state.growth[1] || {}).skillTraining || [];
      if (trainArrCurrent[slotIndex] === sk.id) return true; // allow re-selecting current
      if (trainArrCurrent.includes(sk.id)) return true; // allow if trained by this system
      return false; // already trained by class/other means
    }
    return true;
  }).map(sk => sk.id);
}

function getSkillsForIncrease(lv) {
  // Returns skills that are at least trained (rank >= 2)
  return SKILLS.filter(sk => {
    const el = document.getElementById('sk-prof-' + sk.id);
    const rank = parseInt(el?.value || 0);
    return rank >= 2;
  });
}

function getSkillRankLabel(skillId) {
  const el = document.getElementById('sk-prof-' + skillId);
  const rank = parseInt(el?.value || 0);
  const labels = {0:'미숙련', 2:'숙련', 4:'전문가', 6:'달인', 8:'전설'};
  return labels[rank] || '미숙련';
}

// 출처(source) 기반: 핸들러는 state.growth만 갱신하고 recalcAll에 재파생을 위임한다.
//   (과거의 값기반 sk-prof revert는 다중출처 오삭제/유령 버그의 원인 — cs_calc.js applyGrowthSkills 참조)
function growthSkillTrainingChanged(slotIndex, value) {
  if (!state.growth[1]) state.growth[1] = {};
  if (!state.growth[1].skillTraining) state.growth[1].skillTraining = [];
  state.growth[1].skillTraining[slotIndex] = value || null;
  recalcAll();   // clearGrowthSkills → 재파생 → applyGrowthSkills. renderGrowthPlan/save는 recalcAll 내부.
}

function growthSkillIncreaseChanged(lv, value) {
  if (!state.growth[lv]) state.growth[lv] = {};
  state.growth[lv].skillIncrease = value || null;
  recalcAll();   // 값기반 -2 revert 제거 — applyGrowthSkills가 prevRank로 정확 복원.
}

// Skill Training modal pick (growth plan)
let _skillPickMode = null; // 'training' or 'increase'
let _skillPickSlotIndex = null;
let _skillPickLevel = null;

function growthPickSkillTraining(slotIndex) {
  _skillPickMode = 'training';
  _skillPickSlotIndex = slotIndex;
  _skillPickLevel = 1;
  const trainArr = state.growth[1]?.skillTraining || [];
  const available = getAvailableSkillsForTraining(slotIndex, trainArr);
  openSkillPickModal('추가 기술 숙련 선택', available);
}

function growthClearSkillTraining(slotIndex) {
  growthSkillTrainingChanged(slotIndex, '');
}

function growthClearAllSkillTraining() {
  const trainArr = state.growth[1]?.skillTraining || [];
  for (let i = trainArr.length - 1; i >= 0; i--) {
    if (trainArr[i]) growthSkillTrainingChanged(i, '');
  }
}

function growthPickSkillTrainingMulti() {
  const numSlots = state.trainableSkillSlots || 0;
  if (!state.growth[1]) state.growth[1] = {};
  if (!state.growth[1].skillTraining) state.growth[1].skillTraining = [];
  const trainArr = state.growth[1].skillTraining;
  const alreadySelected = trainArr.filter(v => v);

  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal-title').textContent = `추가 기술 숙련 선택 (${alreadySelected.length}/${numSlots})`;
  const searchEl = document.getElementById('modal-search');
  if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; }
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) { confirmBtn.style.display = ''; confirmBtn.textContent = '완료'; }
  modalType = 'skill-multi';
  modalSelected = null;

  const container = document.getElementById('modal-options');
  const detail = document.getElementById('modal-detail');
  container.innerHTML = '';
  if (detail) detail.innerHTML = `<div class="modal-detail-empty">${numSlots}개의 기술을 선택하세요.<br>이미 훈련된 기술은 선택할 수 없습니다.</div>`;

  const available = getAvailableSkillsForTraining(-1, []);

  SKILLS.forEach(sk => {
    const isAvail = available.includes(sk.id);
    const isSelected = alreadySelected.includes(sk.id);
    const isFull = alreadySelected.length >= numSlots && !isSelected;
    const row = document.createElement('div');
    row.className = 'opt-row' + (isSelected ? ' selected' : '');
    if (!isAvail && !isSelected) row.style.opacity = '0.4';
    row.innerHTML = `
      <div class="opt-row-icon">${isSelected ? '✓' : '📖'}</div>
      <span class="opt-row-name">${sk.name} <span style="color:var(--text2);font-size:11px;">${sk.en}</span></span>
      <span style="font-size:10px;color:var(--text2);margin-right:4px;">${getSkillRankLabel(sk.id)}</span>`;

    if (isAvail || isSelected) {
      row.style.cursor = 'pointer';
      row.onclick = () => {
        if (isSelected) {
          // Deselect
          const idx = trainArr.indexOf(sk.id);
          if (idx >= 0) growthSkillTrainingChanged(idx, '');
          growthPickSkillTrainingMulti(); // Re-render modal
        } else if (!isFull) {
          // Select: find empty slot
          let emptyIdx = trainArr.findIndex(v => !v);
          if (emptyIdx < 0) emptyIdx = trainArr.length;
          growthSkillTrainingChanged(emptyIdx, sk.id);
          growthPickSkillTrainingMulti(); // Re-render modal
        }
      };
    }
    container.appendChild(row);
  });

  const listEl = document.querySelector('.modal-list');
  if (listEl) listEl.style.display = '';
}

function growthPickSkillIncrease(lv) {
  _skillPickMode = 'increase';
  _skillPickLevel = lv;
  const skills = getSkillsForIncrease(lv);
  openSkillPickModal('기술 증가 선택', skills.map(s => s.id));
}

function growthClearSkillIncrease(lv) {
  growthSkillIncreaseChanged(lv, '');
}

function openSkillPickModal(title, availableIds) {
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal-title').textContent = title;
  const searchEl = document.getElementById('modal-search');
  if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; }
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  modalType = 'skill-pick';
  modalSelected = null;

  const container = document.getElementById('modal-options');
  const detail = document.getElementById('modal-detail');
  container.innerHTML = '';
  if (detail) detail.innerHTML = '<div class="modal-detail-empty">기술을 선택하세요.</div>';

  SKILLS.forEach(sk => {
    if (!availableIds.includes(sk.id)) return;
    const rankLabel = getSkillRankLabel(sk.id);
    const row = document.createElement('div');
    row.className = 'opt-row';
    row.innerHTML = `
      <div class="opt-row-icon">📖</div>
      <span class="opt-row-name">${sk.name} <span style="color:var(--text2);font-size:11px;">${sk.en}</span></span>
      <span style="font-size:10px;color:var(--text2);margin-right:4px;">${rankLabel}</span>`;
    row.onclick = () => {
      document.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      // Immediately apply
      if (_skillPickMode === 'training') {
        growthSkillTrainingChanged(_skillPickSlotIndex, sk.id);
      } else if (_skillPickMode === 'increase') {
        growthSkillIncreaseChanged(_skillPickLevel, sk.id);
      }
      closeModal();
    };
    container.appendChild(row);
  });
  // Show list, hide detail on mobile
  const listEl = document.querySelector('.modal-list');
  if (listEl) listEl.style.display = '';
}

// ═══════════════════════════════════════════════
//  GROWTH PLAN — SPELL REPERTOIRE (spontaneous casters)
// ═══════════════════════════════════════════════

// 확장/축소 상태 (세션 중 유지, 저장 안 함)
if (typeof _growthSpellExpanded === 'undefined') var _growthSpellExpanded = {};

// 해당 레벨에서 새로 얻는 주문 슬롯 계산
function getNewSpellSlotsAtLevel(classId, lv) {
  if (typeof CLASS_SPELL_TABLE === 'undefined' || !CLASS_SPELL_TABLE[classId]) return null;
  const cur = CLASS_SPELL_TABLE[classId][Math.min(lv,20)];
  if (!cur) return null;
  const prev = lv > 1 ? CLASS_SPELL_TABLE[classId][Math.min(lv-1,20)] : null;
  const result = {};
  let total = 0;
  // 캔트립 (1레벨에만)
  if (lv === 1 && cur.cantrips > 0) {
    result.cantrip = cur.cantrips;
    total += cur.cantrips;
  }
  // 랭크별 슬롯 증분
  for (let r = 1; r <= 10; r++) {
    const c = cur.slots[r-1] || 0;
    const p = prev ? (prev.slots[r-1] || 0) : 0;
    const diff = c - p;
    if (diff > 0) { result['rank'+r] = diff; total += diff; }
  }
  return total > 0 ? result : null;
}

// _auto known 주문 중 이 레벨에 부여되는 것 (뮤즈 등)
function getAutoKnownAtLevel(lv) {
  const result = [];
  const cid = state.selectedClass?.id;
  const sid = state.selectedSubclass?.id;
  // id(slug) 우선 해소 → 현재 카탈로그 이름으로 표시(이름 드리프트 무해)
  const _reso = (s, extra) => {
    const sp = (s.id && getSpell(s.id)) || (s.name_ko && getSpell(s.name_ko)) || (s.name_en && getSpell(s.name_en));
    return Object.assign({id: sp?.id || s.id || null, name: sp ? (sp.name_ko || sp.name_en) : s.name_ko}, extra);
  };
  if (typeof CLASS_AUTO_SPELLS !== 'undefined' && cid && CLASS_AUTO_SPELLS[cid]) {
    CLASS_AUTO_SPELLS[cid].forEach(s => {
      if (s.lv === lv && s.type === 'known') result.push(_reso(s, {rank: s.rank || 1}));
    });
  }
  if (sid && getSubclassAutoSpells(SUBCLASS_DB.find(s => s.id === sid)).length > 0) {
    getSubclassAutoSpells(SUBCLASS_DB.find(s => s.id === sid)).forEach(s => {
      if (s.lv === lv && s.type === 'known') result.push(_reso(s, {rank: s.rank || 1}));
    });
  }
  // cantrip 자동 부여
  if (typeof CLASS_AUTO_SPELLS !== 'undefined' && cid && CLASS_AUTO_SPELLS[cid]) {
    CLASS_AUTO_SPELLS[cid].forEach(s => {
      if (s.lv === lv && s.type === 'cantrip') result.push(_reso(s, {rank: 0, isCantrip: true}));
    });
  }
  if (sid && getSubclassAutoSpells(SUBCLASS_DB.find(s => s.id === sid)).length > 0) {
    getSubclassAutoSpells(SUBCLASS_DB.find(s => s.id === sid)).forEach(s => {
      if (s.lv === lv && s.type === 'cantrip') result.push(_reso(s, {rank: 0, isCantrip: true}));
    });
  }
  return result;
}

// 해당 레벨에 배운 재주의 cantrip_slots 보너스 합산
function _getCantripBonusAtLevel(lv) {
  const g = state.growth[lv] || {};
  let bonus = 0;
  // 모든 재주 슬롯 확인
  ['classFeat','classFeat2','generalFeat','skillFeat','ancestryFeat','archFeat'].forEach(key => {
    const featName = g[key];
    if (!featName) return;
    const en = typeof _extractEnName === 'function' ? _extractEnName(featName) : '';
    if (!en || typeof _getFeatEffectsDef !== 'function') return;
    const def = _getFeatEffectsDef(en);
    if (!def || !def.effects) return;
    def.effects.forEach(eff => {
      if (eff.type === 'cantrip_slots') bonus += (eff.value || 0);
    });
  });
  return bonus;
}

// 성장 주문 카드 HTML
function growthSpellCardHTML(lv) {
  const cid = state.selectedClass?.id;
  if (!cid) return '';
  const newSlots = getNewSpellSlotsAtLevel(cid, lv);

  // cantrip_slots 보너스 확인 (이 레벨에 해당 재주를 배운 경우)
  const cantripBonus = _getCantripBonusAtLevel(lv);
  if (!newSlots && cantripBonus <= 0) return '';
  const slots = newSlots || {};
  if (cantripBonus > 0) {
    slots.cantrip = (slots.cantrip || 0) + cantripBonus;
  }
  // newSlots → slots로 이하 참조 교체를 위해 변수 재할당
  const _newSlots = slots;

  const g = state.growth[lv] || {};
  const gs = g.spells || {};
  const autoKnown = getAutoKnownAtLevel(lv);

  // 자동 부여 주문이 차지하는 슬롯 계산
  const autoByKey = {};
  autoKnown.forEach(a => {
    const key = a.isCantrip ? 'cantrip' : 'rank' + a.rank;
    if (!autoByKey[key]) autoByKey[key] = [];
    autoByKey[key].push(a.name);
  });

  let totalNew = 0, totalFilled = 0;
  const slotKeys = [];

  // 각 키별 사용자 선택 가능 수 계산 (자동 부여 주문은 보너스 — 슬롯 차감 안 함)
  Object.keys(_newSlots).forEach(key => {
    const count = _newSlots[key];
    const autoCount = (autoByKey[key] || []).length;
    const userCount = count; // 자동 부여는 보너스이므로 슬롯 차감 없음
    const userFilled = (gs[key] || []).filter(n => n).length;
    slotKeys.push({key, total: count + autoCount, autoCount, autoNames: autoByKey[key] || [], userCount, userFilled});
    totalNew += userCount;
    totalFilled += Math.min(userFilled, userCount);
  });

  if (totalNew === 0 && slotKeys.every(s => s.autoCount === 0)) return '';

  const allFilled = totalFilled >= totalNew;
  const expanded = !!_growthSpellExpanded[lv];

  // 요약 라인
  let summary = [];
  slotKeys.forEach(s => {
    const label = s.key === 'cantrip' ? '캔트립' : s.key.replace('rank','') + '랭크';
    const filled = s.autoCount + Math.min(s.userFilled, s.userCount);
    summary.push(`${label} ${filled}/${s.total}`);
  });

  let html = `<div class="growth-slot ${allFilled ? 'filled' : ''}" onclick="toggleGrowthSpellExpand(${lv})" style="flex-wrap:wrap;">
    <div class="growth-slot-icon">🎵</div>
    <div class="growth-slot-body">
      <div class="growth-slot-label">주문 레퍼토리 Spell Repertoire</div>
      <div class="growth-slot-value">${summary.join(', ')}</div>
    </div>
    ${totalFilled > 0 ? '<span class="spell-del" onclick="event.stopPropagation();growthClearSpells('+lv+');" style="color:var(--red);font-size:14px;padding:0 4px;cursor:pointer;">✕</span>' : ''}
    ${!allFilled && totalNew > 0 ? '<div class="growth-slot-badge">'+(totalNew - totalFilled)+'</div>' : ''}
  </div>`;

  // 인라인 확장
  if (expanded) {
    html += '<div class="growth-spell-detail" style="margin-left:32px;margin-bottom:8px;">';
    slotKeys.forEach(s => {
      const label = s.key === 'cantrip' ? '캔트립' : s.key.replace('rank','') + '랭크 주문';
      html += `<div style="font-size:10px;color:var(--accent);margin:6px 0 2px;font-weight:600;">${label} (${s.total}개)</div>`;
      // 자동 부여 슬롯
      s.autoNames.forEach(name => {
        html += `<div class="growth-spell-slot" style="display:flex;align-items:center;gap:6px;padding:3px 6px;border-left:3px solid var(--accent);background:rgba(100,160,255,0.06);margin:2px 0;border-radius:4px;font-size:12px;">
          <span style="flex:1;">${name}</span>
          <span style="font-size:9px;color:var(--accent);">자동 부여</span>
        </div>`;
      });
      // 사용자 선택 슬롯
      for (let i = 0; i < s.userCount; i++) {
        const stored = (gs[s.key] || [])[i] || null;
        const name = stored ? spellDisplay(stored) : null; // slug → 표시명
        const rank = s.key === 'cantrip' ? 0 : parseInt(s.key.replace('rank',''));
        if (name) {
          html += `<div class="growth-spell-slot" style="display:flex;align-items:center;gap:6px;padding:3px 6px;background:var(--bg2);margin:2px 0;border-radius:4px;font-size:12px;cursor:pointer;" onclick="event.stopPropagation();showInfo('spell','${String(stored).replace(/'/g,"\\'")}')">
            <span style="flex:1;">${name}</span>
            <span class="spell-del" onclick="event.stopPropagation();growthRemoveSpell(${lv},'${s.key}',${i});" style="color:var(--red);font-size:12px;cursor:pointer;">✕</span>
          </div>`;
        } else {
          html += `<div class="growth-spell-slot" style="display:flex;align-items:center;gap:6px;padding:3px 6px;background:var(--bg2);margin:2px 0;border-radius:4px;font-size:12px;cursor:pointer;opacity:0.6;" onclick="event.stopPropagation();openGrowthSpellPicker(${lv},'${s.key}',${i},${rank})">
            <span style="flex:1;color:var(--text2);">선택 안 됨</span>
          </div>`;
        }
      }
    });
    html += '</div>';
  }

  return html;
}

function toggleGrowthSpellExpand(lv) {
  _growthSpellExpanded[lv] = !_growthSpellExpanded[lv];
  renderGrowthPlan();
}

// 시그니처 주문 카드 — 3레벨에 전체, 이후 새 랭크 얻는 레벨에만 표시
function growthSignatureCardHTML(lv) {
  const cid = state.selectedClass?.id;
  if (!cid || typeof CLASS_SPELL_TABLE === 'undefined' || !CLASS_SPELL_TABLE[cid]) return '';

  const curData = CLASS_SPELL_TABLE[cid][Math.min(lv,20)];
  if (!curData) return '';

  // 이 레벨에서 접근 가능한 랭크 목록
  const accessibleRanks = [];
  for (let r = 1; r <= 10; r++) {
    if ((curData.slots[r-1] || 0) > 0) accessibleRanks.push(r);
  }
  if (accessibleRanks.length === 0) return '';

  // 3레벨에 전체 표시, 이후에는 새 랭크가 생기는 레벨에만 표시
  if (lv > 3) {
    const prevData = CLASS_SPELL_TABLE[cid][Math.min(lv-1,20)];
    if (!prevData) return '';
    const hasNewRank = accessibleRanks.some(r => (prevData.slots[r-1] || 0) === 0);
    if (!hasNewRank) return '';
  }

  // 현재 알고 있는 주문 목록 (growth + auto)
  const knownByRank = {};
  // auto known
  const allAutoKnown = [];
  for (let l = 1; l <= lv; l++) {
    getAutoKnownAtLevel(l).forEach(a => {
      if (!a.isCantrip) allAutoKnown.push(a);
    });
  }
  allAutoKnown.forEach(a => {
    const sl = spellSlug(a.name); // knownByRank는 slug 보관
    if (!knownByRank[a.rank]) knownByRank[a.rank] = [];
    if (!knownByRank[a.rank].includes(sl)) knownByRank[a.rank].push(sl);
  });
  // growth known (이미 slug 저장)
  for (let l = 1; l <= lv; l++) {
    const gs = state.growth[l]?.spells;
    if (!gs) continue;
    for (let r = 1; r <= 10; r++) {
      const arr = gs['rank'+r];
      if (!arr) continue;
      arr.forEach(nm => {
        if (!nm) return;
        const sl = spellSlug(nm);
        if (!knownByRank[r]) knownByRank[r] = [];
        if (!knownByRank[r].includes(sl)) knownByRank[r].push(sl);
      });
    }
  }

  const sigs = state.signatureSpells || {};
  const totalRanks = accessibleRanks.length;
  const filledCount = accessibleRanks.filter(r => sigs[r]).length;
  const allFilled = filledCount >= totalRanks;

  let html = `<div class="growth-slot ${allFilled ? 'filled' : ''}" style="flex-wrap:wrap;cursor:default;">
    <div class="growth-slot-icon">★</div>
    <div class="growth-slot-body">
      <div class="growth-slot-label">시그니처 주문 Signature Spells</div>
      <div class="growth-slot-value">${filledCount}/${totalRanks} 랭크 지정</div>
    </div>
    ${!allFilled ? `<div class="growth-slot-badge">${totalRanks - filledCount}</div>` : ''}
  </div>`;

  // 항상 펼쳐서 표시 (랭크별 드롭다운)
  html += '<div style="margin-left:32px;margin-bottom:8px;">';
  accessibleRanks.forEach(r => {
    const spells = knownByRank[r] || [];
    const curSig = sigs[r] || '';
    html += `<div style="display:flex;align-items:center;gap:6px;margin:3px 0;font-size:12px;">
      <span style="min-width:50px;color:var(--accent);font-weight:600;">${r}랭크</span>
      <select onchange="setSignatureSpell(${r},this.value)" style="flex:1;font-size:12px;background:var(--bg2);color:var(--text1);border:1px solid var(--border);border-radius:4px;padding:2px 4px;">
        <option value="">— 선택 안 됨 —</option>
        ${spells.map(sl => `<option value="${String(sl).replace(/"/g,'&quot;')}"${curSig===sl?' selected':''}>${spellDisplay(sl)}</option>`).join('')}
      </select>
    </div>`;
  });
  html += '</div>';

  return html;
}

function setSignatureSpell(rank, spellName) {
  if (!state.signatureSpells) state.signatureSpells = {};
  if (spellName) {
    state.signatureSpells[rank] = (typeof spellSlug === 'function') ? spellSlug(spellName) : spellName; // slug 저장
  } else {
    delete state.signatureSpells[rank];
  }
  renderSpells();
  save();
}

// 성장 주문 선택 모달
let _growthSpellPending = null;

function openGrowthSpellPicker(lv, slotKey, slotIdx, rank) {
  _growthSpellPending = {lv, slotKey, slotIdx, rank};
  const isCantrip = slotKey === 'cantrip';
  // 주문 모달 열기 (spell 타입)
  _spellSlotPending = null; // 일반 슬롯 선택과 충돌 방지
  openModal('spell', isCantrip ? 'cantrip' : 'known');
}

// confirmModal에서 호출 — growth 주문 선택 완료
function applyGrowthSpellSelection(spellName) {
  if (!_growthSpellPending) return false;
  const {lv, slotKey, slotIdx} = _growthSpellPending;
  if (!state.growth[lv]) state.growth[lv] = {};
  if (!state.growth[lv].spells) state.growth[lv].spells = {};
  if (!state.growth[lv].spells[slotKey]) state.growth[lv].spells[slotKey] = [];
  state.growth[lv].spells[slotKey][slotIdx] = (typeof spellSlug === 'function') ? spellSlug(spellName) : spellName; // slug 저장
  _growthSpellPending = null;
  syncGrowthSpellsToState();
  renderGrowthPlan();
  renderSpells();
  save();
  return true;
}

function growthRemoveSpell(lv, slotKey, slotIdx) {
  if (!state.growth[lv]?.spells?.[slotKey]) return;
  state.growth[lv].spells[slotKey][slotIdx] = null;
  syncGrowthSpellsToState();
  renderGrowthPlan();
  renderSpells();
  save();
}

function growthClearSpells(lv) {
  if (!state.growth[lv]) return;
  delete state.growth[lv].spells;
  syncGrowthSpellsToState();
  renderGrowthPlan();
  renderSpells();
  save();
}

// growth의 주문 선택을 state.spells에 동기화
function syncGrowthSpellsToState() {
  const cid = state.selectedClass?.id;
  if (!cid || typeof CLASS_SPELL_TABLE === 'undefined' || !CLASS_SPELL_TABLE[cid]) return;
  if (!state.selectedClass.casting) return;

  // growth 주문을 기존 state.spells에 추가 (기존 주문 유지, 중복만 방지)
  const curLevel = getLevel();
  for (let lv = 1; lv <= curLevel; lv++) {
    const gs = state.growth[lv]?.spells;
    if (!gs) continue;
    // 캔트립
    if (gs.cantrip) {
      gs.cantrip.forEach(nm => {
        if (nm && !(state.spells.cantrip||[]).find(c => spellSame(c, nm))) {
          const _sp = getSpell(nm);
          state.spells.cantrip.push({id: _sp?.id || spellSlug(nm), name: spellDisplay(nm), rank: 0});
        }
      });
    }
    // 랭크별 known
    for (let r = 1; r <= 10; r++) {
      const arr = gs['rank'+r];
      if (!arr) continue;
      arr.forEach(nm => {
        if (nm && !(state.spells.known||[]).find(k => spellSame(k, nm) && k.rank === r)) {
          const _sp = getSpell(nm);
          state.spells.known.push({id: _sp?.id || spellSlug(nm), name: spellDisplay(nm), rank: r});
        }
      });
    }
  }
}

// ═══════════════════════════════════════════════
//  GROWTH PLAN — FAMILIAR SPELLBOOK (prepared casters: witch 등)
// ═══════════════════════════════════════════════

if (typeof _growthFamiliarExpanded === 'undefined') var _growthFamiliarExpanded = {};

// 위치 사역마: 레벨 1 초기 주문 수
var FAMILIAR_INIT = {
  witch:  {cantrip: 10, rank1: 5},  // + 후원자 교훈 1개
  wizard: {cantrip: 10, rank1: 7},  // 5 + 학파 교과 2개
};

// 해당 레벨에서 사역마가 배울 수 있는 최대 랭크
function getFamiliarMaxRank(classId, lv) {
  if (typeof CLASS_SPELL_TABLE === 'undefined' || !CLASS_SPELL_TABLE[classId]) return 0;
  const data = CLASS_SPELL_TABLE[classId][Math.min(lv,20)];
  if (!data) return 0;
  for (let r = 10; r >= 1; r--) {
    if ((data.slots[r-1] || 0) > 0) return r;
  }
  return 0;
}

// 전통 전체 접근 안내 카드 (cleric, druid — 성장계획 1레벨에만 표시)
function growthFullTraditionCardHTML() {
  const trad = state.selectedClass?.tradition || '';
  const tradNames = {divine:'신성', primal:'원시', arcane:'비전', occult:'오컬트'};
  const tradLabel = tradNames[trad] || trad;
  return `<div class="growth-slot filled" style="flex-wrap:wrap;cursor:default;">
    <div class="growth-slot-icon">📖</div>
    <div class="growth-slot-body">
      <div class="growth-slot-label">준비형 주문시전 Prepared Casting</div>
      <div class="growth-slot-value" style="font-size:11px;line-height:1.4;">${tradLabel} 전통의 모든 주문에 접근할 수 있습니다.<br>주문 탭의 <strong>📖 주문 기억</strong> 버튼으로 일일 준비하세요.</div>
    </div>
  </div>`;
}

// 주문서/사역마 주문 습득 카드
function growthFamiliarSpellCardHTML(lv) {
  const cid = state.selectedClass?.id;
  if (!cid) return '';
  const init = FAMILIAR_INIT[cid];
  if (!init && lv === 1) return '';

  const g = state.growth[lv] || {};
  const gf = g.familiarSpells || {};
  const maxRank = getFamiliarMaxRank(cid, lv);

  // 각 레벨에서 배울 주문 수 계산
  let slots = {};
  if (lv === 1 && init) {
    slots.cantrip = init.cantrip;
    slots.rank1 = init.rank1;
  } else if (lv >= 2) {
    // 레벨업마다 2개 — 접근 가능한 아무 랭크
    slots._free = 2;
  } else {
    return '';
  }

  // 자동 부여 주문 (후원자 교훈 등) — type:'known' 인 것만
  const autoKnown = getAutoKnownAtLevel(lv).filter(a => !a.isCantrip);
  const autoCantrips = getAutoKnownAtLevel(lv).filter(a => a.isCantrip);

  const expanded = !!_growthFamiliarExpanded[lv];

  if (lv === 1 && init) {
    // ── 레벨 1: 캔트립 N개 + 1랭크 N개 ──
    const cantripFilled = (gf.cantrip || []).filter(n => n).length;
    const rank1Filled = (gf.rank1 || []).filter(n => n).length;
    const totalNeeded = init.cantrip + init.rank1;
    const totalFilled = cantripFilled + rank1Filled + autoKnown.length + autoCantrips.length;
    const allFilled = cantripFilled >= init.cantrip && rank1Filled >= init.rank1;

    let summary = `캔트립 ${cantripFilled}/${init.cantrip}, 1랭크 ${rank1Filled + autoKnown.length}/${init.rank1 + autoKnown.length}`;

    const isWizard = cid === 'wizard';
    const sbIcon = isWizard ? '📖' : '🐈';
    const sbLabel = isWizard ? '주문서 Spellbook' : '사역마 주문 Familiar Spells';
    let html = `<div class="growth-slot ${allFilled ? 'filled' : ''}" onclick="toggleGrowthFamiliarExpand(${lv})" style="flex-wrap:wrap;">
      <div class="growth-slot-icon">${sbIcon}</div>
      <div class="growth-slot-body">
        <div class="growth-slot-label">${sbLabel}</div>
        <div class="growth-slot-value">${summary}</div>
      </div>
      ${!allFilled ? `<div class="growth-slot-badge">${totalNeeded - cantripFilled - rank1Filled}</div>` : ''}
    </div>`;

    if (expanded) {
      html += '<div class="growth-spell-detail" style="margin-left:32px;margin-bottom:8px;">';
      // 캔트립
      html += `<div style="font-size:10px;color:var(--accent);margin:6px 0 2px;font-weight:600;">캔트립 (${init.cantrip}개)</div>`;
      for (let i = 0; i < init.cantrip; i++) {
        const name = (gf.cantrip || [])[i] || null;
        html += _familiarSlotHTML(lv, 'cantrip', i, name, 0);
      }
      // 1랭크
      html += `<div style="font-size:10px;color:var(--accent);margin:6px 0 2px;font-weight:600;">1랭크 주문 (${init.rank1}개)</div>`;
      // 자동 부여
      autoKnown.forEach(a => {
        html += `<div class="growth-spell-slot" style="display:flex;align-items:center;gap:6px;padding:3px 6px;border-left:3px solid var(--accent);background:rgba(100,160,255,0.06);margin:2px 0;border-radius:4px;font-size:12px;">
          <span style="flex:1;">${a.name}</span>
          <span style="font-size:9px;color:var(--accent);">후원자 교훈</span>
        </div>`;
      });
      for (let i = 0; i < init.rank1; i++) {
        const name = (gf.rank1 || [])[i] || null;
        html += _familiarSlotHTML(lv, 'rank1', i, name, 1);
      }
      html += '</div>';
    }
    return html;
  } else if (slots._free) {
    // ── 레벨 2+: 자유 2개 ──
    const freeArr = gf.free || [];
    const filled = freeArr.filter(n => n).length;
    const allFilled = filled >= slots._free;

    // 선택된 주문 표시
    const display = freeArr.filter(n=>n).map(n => {
      if (typeof n === 'object') return `${spellDisplay(n.id||n.name)} (${n.rank}랭크)`;
      return spellDisplay(n);
    }).join(', ');

    const isWiz = cid === 'wizard';
    const sbIco = isWiz ? '📖' : '🐈';
    const sbLbl = isWiz ? '주문서 습득 Spellbook Learns' : '사역마 주문 습득 Familiar Learns';
    let html = `<div class="growth-slot ${allFilled ? 'filled' : ''}" onclick="toggleGrowthFamiliarExpand(${lv})" style="flex-wrap:wrap;">
      <div class="growth-slot-icon">${sbIco}</div>
      <div class="growth-slot-body">
        <div class="growth-slot-label">${sbLbl}</div>
        <div class="growth-slot-value">${allFilled ? display : filled + '/' + slots._free + ' 선택'}</div>
      </div>
      ${!allFilled ? `<div class="growth-slot-badge">${slots._free - filled}</div>` : ''}
    </div>`;

    if (expanded) {
      html += '<div class="growth-spell-detail" style="margin-left:32px;margin-bottom:8px;">';
      html += `<div style="font-size:10px;color:var(--text2);margin:4px 0 2px;">접근 가능한 아무 랭크에서 2개 선택 (최대 ${maxRank}랭크)</div>`;
      for (let i = 0; i < slots._free; i++) {
        const entry = freeArr[i] || null;
        const storedF = entry ? (typeof entry === 'object' ? (entry.id || entry.name) : entry) : null;
        const name = storedF ? spellDisplay(storedF) : null;
        const rank = entry ? (typeof entry === 'object' ? entry.rank : 0) : 0;
        if (name) {
          html += `<div class="growth-spell-slot" style="display:flex;align-items:center;gap:6px;padding:3px 6px;background:var(--bg2);margin:2px 0;border-radius:4px;font-size:12px;cursor:pointer;" onclick="event.stopPropagation();showInfo('spell','${String(storedF).replace(/'/g,"\\'")}')">
            <span style="flex:1;">${name} <span style="font-size:9px;color:var(--text2);">(${rank}랭크)</span></span>
            <span class="spell-del" onclick="event.stopPropagation();growthRemoveFamiliarSpell(${lv},${i});" style="color:var(--red);font-size:12px;cursor:pointer;">✕</span>
          </div>`;
        } else {
          html += `<div class="growth-spell-slot" style="display:flex;align-items:center;gap:6px;padding:3px 6px;background:var(--bg2);margin:2px 0;border-radius:4px;font-size:12px;cursor:pointer;opacity:0.6;" onclick="event.stopPropagation();openGrowthFamiliarFreePicker(${lv},${i},${maxRank})">
            <span style="flex:1;color:var(--text2);">선택 안 됨</span>
          </div>`;
        }
      }
      html += '</div>';
    }
    return html;
  }
  return '';
}

function _familiarSlotHTML(lv, key, idx, stored, rank) {
  if (stored) {
    const name = spellDisplay(stored); // slug → 표시명
    return `<div class="growth-spell-slot" style="display:flex;align-items:center;gap:6px;padding:3px 6px;background:var(--bg2);margin:2px 0;border-radius:4px;font-size:12px;cursor:pointer;" onclick="event.stopPropagation();showInfo('spell','${String(stored).replace(/'/g,"\\'")}')">
      <span style="flex:1;">${name}</span>
      <span class="spell-del" onclick="event.stopPropagation();growthRemoveFamiliarInitSpell(${lv},'${key}',${idx});" style="color:var(--red);font-size:12px;cursor:pointer;">✕</span>
    </div>`;
  }
  return `<div class="growth-spell-slot" style="display:flex;align-items:center;gap:6px;padding:3px 6px;background:var(--bg2);margin:2px 0;border-radius:4px;font-size:12px;cursor:pointer;opacity:0.6;" onclick="event.stopPropagation();openGrowthFamiliarInitPicker(${lv},'${key}',${idx},${rank})">
    <span style="flex:1;color:var(--text2);">선택 안 됨</span>
  </div>`;
}

function toggleGrowthFamiliarExpand(lv) {
  _growthFamiliarExpanded[lv] = !_growthFamiliarExpanded[lv];
  renderGrowthPlan();
}

// ── 사역마 주문 선택 모달 ──
let _growthFamiliarPending = null;

function openGrowthFamiliarInitPicker(lv, key, idx, rank) {
  _growthFamiliarPending = {lv, key, idx, rank, mode: 'init'};
  _spellSlotPending = null;
  _growthSpellPending = null;
  const isCantrip = key === 'cantrip';
  openModal('spell', isCantrip ? 'cantrip' : 'known');
}

function openGrowthFamiliarFreePicker(lv, idx, maxRank) {
  _growthFamiliarPending = {lv, idx, maxRank, mode: 'free'};
  _spellSlotPending = null;
  _growthSpellPending = null;
  // 모든 랭크 표시 (1~maxRank) — 특수 필터
  openModal('spell', 'known');
}

function applyGrowthFamiliarSelection(spellObj) {
  if (!_growthFamiliarPending) return false;
  const p = _growthFamiliarPending;
  _growthFamiliarPending = null;
  if (!state.growth[p.lv]) state.growth[p.lv] = {};
  if (!state.growth[p.lv].familiarSpells) state.growth[p.lv].familiarSpells = {};
  const gf = state.growth[p.lv].familiarSpells;

  if (p.mode === 'init') {
    if (!gf[p.key]) gf[p.key] = [];
    gf[p.key][p.idx] = spellObj.id || spellObj.name_ko; // slug 저장
  } else if (p.mode === 'free') {
    if (!gf.free) gf.free = [];
    gf.free[p.idx] = {id: spellObj.id || spellObj.name_ko, rank: spellObj.is_cantrip ? 0 : (spellObj.rank || 1)};
  }
  syncFamiliarSpellsToState();
  renderGrowthPlan();
  renderSpells();
  save();
  return true;
}

function growthRemoveFamiliarInitSpell(lv, key, idx) {
  if (!state.growth[lv]?.familiarSpells?.[key]) return;
  state.growth[lv].familiarSpells[key][idx] = null;
  syncFamiliarSpellsToState();
  renderGrowthPlan();
  save();
}

function growthRemoveFamiliarSpell(lv, idx) {
  if (!state.growth[lv]?.familiarSpells?.free) return;
  state.growth[lv].familiarSpells.free[idx] = null;
  syncFamiliarSpellsToState();
  renderGrowthPlan();
  save();
}

// growth → state.familiarSpells 구축 (주문서/사역마 보유 클래스만: wizard, witch)
function syncFamiliarSpellsToState() {
  const cid = state.selectedClass?.id;
  if (!cid || state.selectedClass.casting !== 'prepared') return;
  if (typeof CLASS_SPELL_TABLE === 'undefined' || !CLASS_SPELL_TABLE[cid]) return;
  // 주문서/사역마가 없는 클래스(cleric, druid 등)는 전통 전체 접근 → familiarSpells 불필요
  if (typeof FAMILIAR_INIT === 'undefined' || !FAMILIAR_INIT[cid]) { state.familiarSpells = null; return; }

  const fs = {cantrip: [], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[], 10:[]};
  const curLevel = getLevel();

  for (let lv = 1; lv <= curLevel; lv++) {
    const gf = state.growth[lv]?.familiarSpells;
    if (!gf) continue;
    // 레벨 1 init 슬롯
    if (gf.cantrip) gf.cantrip.forEach(n => { if (n && !fs.cantrip.includes(n)) fs.cantrip.push(n); });
    if (gf.rank1) gf.rank1.forEach(n => { if (n && !fs[1].includes(n)) fs[1].push(n); });
    // 자유 슬롯 (레벨 2+)
    if (gf.free) {
      gf.free.forEach(entry => {
        if (!entry) return;
        const sl = typeof entry === 'object' ? (entry.id || spellSlug(entry.name)) : spellSlug(entry); // slug
        const rank = typeof entry === 'object' ? entry.rank : 1;
        const key = rank === 0 ? 'cantrip' : rank;
        if (!fs[key]) fs[key] = [];
        if (!fs[key].includes(sl)) fs[key].push(sl);
      });
    }
  }

  // 자동 부여 주문 (후원자 교훈 등) — slug 보관
  for (let lv = 1; lv <= curLevel; lv++) {
    getAutoKnownAtLevel(lv).forEach(a => {
      const key = a.isCantrip ? 'cantrip' : (a.rank || 1);
      const sl = spellSlug(a.name);
      if (!fs[key]) fs[key] = [];
      if (!fs[key].includes(sl)) fs[key].push(sl);
    });
  }

  state.familiarSpells = fs;
}

// ═══════════════════════════════════════════════
//  PREPARED SPELL SLOT MANAGEMENT
// ═══════════════════════════════════════════════

let _memorizeActiveSlot = null; // {rank, idx}

function openMemorizeModal() {
  if (!state.selectedClass || state.selectedClass.casting !== 'prepared') return;
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'memorize';
  document.getElementById('modal-title').textContent = '📖 주문 기억 — 일일 준비';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  // 모달 푸터의 확인 버튼으로 스코프 (기어 메뉴의 .btn-confirm을 잘못 잡던 버그 수정)
  const confirmBtn = document.querySelector('.modal-footer .btn-confirm');
  if (confirmBtn) { confirmBtn.style.display = ''; confirmBtn.textContent = '준비 완료'; }

  _memorizeActiveSlot = null;
  if (!state.preparedSpells) state.preparedSpells = {cantrip: []};

  // 모바일에서 주문 선택 목록(modal-detail)이 숨겨지지 않도록 마커 클래스 부여
  const bodyEl = document.getElementById('modal-body');
  if (bodyEl) bodyEl.classList.add('mem-modal');

  _renderMemorizeSlots();
  _renderMemorizeDetail();

  const listEl = document.querySelector('.modal-list');
  if (listEl) listEl.style.display = '';
}

function _renderMemorizeSlots() {
  const container = document.getElementById('modal-options');
  if (!container) return;

  const lv = getLevel();
  const maxRank = Math.min(10, Math.ceil(lv / 2)) || 1;
  const cantripSlots = state.cantripSlots || 5;
  const active = _memorizeActiveSlot;
  let html = '';

  // 캔트립
  html += `<div style="padding:6px 8px;border-bottom:1px solid var(--border);">
    <div style="font-size:12px;font-weight:600;color:var(--accent);margin-bottom:4px;">캔트립 (${cantripSlots}개)</div>`;
  for (let i = 0; i < cantripSlots; i++) {
    const name = (state.preparedSpells.cantrip || [])[i] || null;
    const isActive = active && active.rank === 0 && active.idx === i;
    html += `<div onclick="_memorizeSelectSlot(0,${i})" style="display:flex;align-items:center;gap:6px;padding:5px 8px;margin:2px 0;border-radius:4px;cursor:pointer;font-size:12px;
      background:${isActive ? 'var(--accent)' : name ? 'var(--bg3)' : 'var(--bg2)'};
      color:${isActive ? '#000' : 'var(--text1)'};
      border:1px solid ${isActive ? 'var(--accent)' : 'var(--border)'};">
      <span style="font-size:10px;min-width:18px;color:${isActive?'#000':'var(--text2)'};">${i+1}.</span>
      <span style="flex:1;display:inline-flex;align-items:center;min-width:0;">${name ? ((typeof iconImg==='function'?iconImg('spell',getSpell(name)):'')+spellDisplay(name)) : '<span style="opacity:0.4;">빈 슬롯</span>'}</span>
      ${name ? `<span onclick="event.stopPropagation();_memorizeClearSlot(0,${i})" style="color:${isActive?'#000':'var(--red)'};font-size:12px;padding:0 2px;cursor:pointer;">✕</span>` : ''}
    </div>`;
  }
  html += `</div>`;

  // 랭크별
  for (let r = 1; r <= maxRank; r++) {
    const slotMax = parseInt(state.spellSlots?.[r] || 0);
    if (slotMax === 0) continue;
    html += `<div style="padding:6px 8px;border-bottom:1px solid var(--border);">
      <div style="font-size:12px;font-weight:600;color:var(--accent);margin-bottom:4px;">${r}랭크 (${slotMax}개)</div>`;
    for (let i = 0; i < slotMax; i++) {
      const name = (state.preparedSpells[r] || [])[i] || null;
      const isActive = active && active.rank === r && active.idx === i;
      html += `<div onclick="_memorizeSelectSlot(${r},${i})" style="display:flex;align-items:center;gap:6px;padding:5px 8px;margin:2px 0;border-radius:4px;cursor:pointer;font-size:12px;
        background:${isActive ? 'var(--accent)' : name ? 'var(--bg3)' : 'var(--bg2)'};
        color:${isActive ? '#000' : 'var(--text1)'};
        border:1px solid ${isActive ? 'var(--accent)' : 'var(--border)'};">
        <span style="font-size:10px;min-width:18px;color:${isActive?'#000':'var(--text2)'};">${i+1}.</span>
        <span style="flex:1;display:inline-flex;align-items:center;min-width:0;">${name ? ((typeof iconImg==='function'?iconImg('spell',getSpell(name)):'')+spellDisplay(name)) : '<span style="opacity:0.4;">빈 슬롯</span>'}</span>
        ${name ? `<span onclick="event.stopPropagation();_memorizeClearSlot(${r},${i})" style="color:${isActive?'#000':'var(--red)'};font-size:12px;padding:0 2px;cursor:pointer;">✕</span>` : ''}
      </div>`;
    }
    html += `</div>`;
  }

  container.innerHTML = html;
}

function _renderMemorizeDetail() {
  const detail = document.getElementById('modal-detail');
  if (!detail) return;
  const active = _memorizeActiveSlot;
  if (!active) {
    detail.innerHTML = '<div class="modal-detail-empty">슬롯을 선택하면 준비할 주문 목록이 표시됩니다.</div>';
    return;
  }

  const isCantrip = active.rank === 0;
  const rank = active.rank;
  const fs = state.familiarSpells;
  const hasSpellbook = !!fs; // 위치/위저드: 주문서/사역마 보유

  // 선택 가능한 주문 목록 구축
  let available = [];
  if (hasSpellbook) {
    // 주문서/사역마에서 가져오기
    if (isCantrip) {
      (fs.cantrip || []).forEach(name => available.push({name, note: ''}));
    } else {
      for (let sr = 1; sr <= rank; sr++) {
        (fs[sr] || []).forEach(name => {
          available.push({name, note: sr < rank ? `${sr}랭크 고양` : ''});
        });
      }
    }
  } else if (typeof _allSpells === 'function' && _allSpells().length) {
    // 클레릭/드루이드: 전통 목록 전체에서 선택
    let trad = state.selectedClass?.tradition || '';
    if (trad === 'any' && state.selectedSubclass) {
      trad = state.selectedSubclass.tradition || trad;
    }
    _allSpells().forEach(sp => {
      if (sp.is_focus) return;
      if (isCantrip && !sp.is_cantrip) return;
      if (!isCantrip && (sp.is_cantrip || sp.rank > rank)) return;
      if (trad && trad !== 'any' && sp.traditions && !sp.traditions.includes(trad)) return;
      const note = (!isCantrip && sp.rank < rank) ? `${sp.rank}랭크 고양` : '';
      available.push({name: sp.id || sp.name_ko, note}); // slug 저장(표시는 아래 spellDisplay)
    });
  }

  if (available.length === 0) {
    const msg = hasSpellbook ? '주문서에 이 랭크의 주문이 없습니다.<br>빌더에서 주문을 배우세요.' : '이 랭크에 사용 가능한 주문이 없습니다.';
    detail.innerHTML = `<div class="modal-detail-empty">${msg}</div>`;
    return;
  }

  const label = isCantrip ? '캔트립' : `${rank}랭크`;
  detail.innerHTML = `<div style="padding:8px;">
    <div style="font-size:13px;font-weight:600;color:var(--accent);margin-bottom:8px;">슬롯 ${active.idx+1} — ${label} 주문 선택
      <span style="font-weight:400;color:var(--text2);font-size:11px;">(이름을 누르면 상세 · 「준비」로 슬롯 배치)</span></div>
    <div id="mem-spell-list"></div></div>`;
  const listEl = detail.querySelector('#mem-spell-list');
  if (!listEl) return;
  available.forEach(({name, note}) => {
    const spellData = getSpell(name);
    const actions = typeof getActionIcons === 'function' ? getActionIcons(spellData?.actions) : '';
    const wrap = document.createElement('div');
    wrap.className = 'mem-spell';
    const ic = (typeof iconImg === 'function') ? iconImg('spell', spellData || {name}) : '';
    wrap.innerHTML = `
      <div class="mem-spell-row">
        <span class="mem-spell-name">${ic}${spellDisplay(name)}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}</span>
        ${note ? `<span class="mem-spell-note">${note}</span>` : ''}
        <button class="mem-prep-btn">준비</button>
        <span class="ls-chevron">▾</span>
      </div>
      <div class="mem-spell-detail"></div>`;
    const row = wrap.querySelector('.mem-spell-row');
    const btn = wrap.querySelector('.mem-prep-btn');
    const dd = wrap.querySelector('.mem-spell-detail');
    // 「준비」 버튼 — 슬롯 배치 (펼침과 분리)
    if (btn) btn.onclick = (e) => { e.stopPropagation(); _memorizeAssign(name); };
    // 이름 행 클릭 — 인라인 아코디언으로 주문 상세 펼침/접힘
    if (row) row.onclick = () => {
      const wasOpen = wrap.classList.contains('expanded');
      listEl.querySelectorAll('.mem-spell.expanded').forEach(w => w.classList.remove('expanded'));
      if (!wasOpen) {
        if (dd && !dd.dataset.filled) {
          dd.innerHTML = (typeof _learnSpellDetailHtml === 'function' && spellData)
            ? _learnSpellDetailHtml(spellData)
            : (spellData?.desc || '<span style="color:var(--text2);">설명 없음</span>');
          dd.dataset.filled = '1';
        }
        wrap.classList.add('expanded');
      }
    };
    listEl.appendChild(wrap);
  });
}

function _memorizeSelectSlot(rank, idx) {
  _memorizeActiveSlot = {rank, idx};
  _renderMemorizeSlots();
  _renderMemorizeDetail();
  // 모바일: 슬롯 아래로 쌓이는 주문 선택 목록이 보이도록 스크롤
  if (window.innerWidth <= 900) {
    const detail = document.getElementById('modal-detail');
    if (detail) detail.scrollIntoView({behavior:'smooth', block:'start'});
  }
}

function _memorizeAssign(spellName) {
  if (!_memorizeActiveSlot) return;
  const {rank, idx} = _memorizeActiveSlot;
  if (!state.preparedSpells) state.preparedSpells = {cantrip: []};
  const key = rank === 0 ? 'cantrip' : rank;
  if (!state.preparedSpells[key]) state.preparedSpells[key] = [];
  state.preparedSpells[key][idx] = spellName;
  // 다음 빈 슬롯으로 자동 이동
  _memorizeAdvanceSlot(rank, idx);
  _renderMemorizeSlots();
  _renderMemorizeDetail();
}

function _memorizeClearSlot(rank, idx) {
  const key = rank === 0 ? 'cantrip' : rank;
  if (state.preparedSpells?.[key]) state.preparedSpells[key][idx] = null;
  _renderMemorizeSlots();
  if (_memorizeActiveSlot?.rank === rank && _memorizeActiveSlot?.idx === idx) {
    _renderMemorizeDetail();
  }
}

function _memorizeAdvanceSlot(curRank, curIdx) {
  // 같은 랭크의 다음 빈 슬롯, 없으면 다음 랭크
  const lv = getLevel();
  const maxRank = Math.min(10, Math.ceil(lv / 2)) || 1;
  const ranks = [0]; // cantrip first
  for (let r = 1; r <= maxRank; r++) {
    if ((state.spellSlots?.[r] || 0) > 0) ranks.push(r);
  }
  const curRankPos = ranks.indexOf(curRank);
  for (let ri = curRankPos; ri < ranks.length; ri++) {
    const r = ranks[ri];
    const key = r === 0 ? 'cantrip' : r;
    const max = r === 0 ? (state.cantripSlots || 5) : (state.spellSlots?.[r] || 0);
    const startIdx = (ri === curRankPos) ? curIdx + 1 : 0;
    for (let i = startIdx; i < max; i++) {
      if (!(state.preparedSpells?.[key]?.[i])) {
        _memorizeActiveSlot = {rank: r, idx: i};
        return;
      }
    }
  }
  // 모든 슬롯이 채워짐
  _memorizeActiveSlot = null;
}

function openPrepareSpellForSlot(rank, slotIdx) {
  // 주문서/사역마가 아는 주문 목록에서 선택 → 슬롯에 준비
  if (!state.familiarSpells) return;
  const isCantrip = rank === 0;
  const known = isCantrip ? (state.familiarSpells.cantrip || []) : (state.familiarSpells[rank] || []);
  const isWiz = state.selectedClass?.id === 'wizard';
  if (known.length === 0) { alert(isWiz ? '주문서에 이 랭크의 주문이 없습니다. 빌더에서 먼저 주문을 배우세요.' : '사역마가 이 랭크의 주문을 모릅니다. 빌더에서 먼저 주문을 배우세요.'); return; }

  // 간단한 인라인 모달 — opt-row 목록
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal-title').textContent = isCantrip ? '캔트립 준비' : `${rank}랭크 주문 준비`;
  const searchEl = document.getElementById('modal-search');
  if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; }
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  modalType = 'prepare-spell';
  modalSelected = null;

  const container = document.getElementById('modal-options');
  const detail = document.getElementById('modal-detail');
  container.innerHTML = '';
  if (detail) detail.innerHTML = '<div class="modal-detail-empty">준비할 주문을 선택하세요.</div>';

  // 사역마가 아는 주문 + 낮은 랭크 주문 (고양 가능)
  const allAvailable = [];
  if (!isCantrip) {
    for (let r = 1; r <= rank; r++) {
      (state.familiarSpells[r] || []).forEach(name => {
        allAvailable.push({name, originalRank: r});
      });
    }
  } else {
    known.forEach(name => allAvailable.push({name, originalRank: 0}));
  }

  allAvailable.forEach(({name, originalRank}) => {
    const spellData = getSpell(name);
    const actions = typeof getActionIcons === 'function' ? getActionIcons(spellData?.actions) : '';
    const row = document.createElement('div');
    row.className = 'opt-row';
    const rankNote = (!isCantrip && originalRank < rank) ? ` <span style="font-size:9px;color:var(--accent);">(${originalRank}랭크에서 고양)</span>` : '';
    row.innerHTML = `
      <div class="opt-row-icon">📖</div>
      <span class="opt-row-name">${spellDisplay(name)}${rankNote}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}</span>`;
    row.onclick = () => {
      // 슬롯에 준비
      if (!state.preparedSpells) state.preparedSpells = {cantrip:[]};
      const key = isCantrip ? 'cantrip' : rank;
      if (!state.preparedSpells[key]) state.preparedSpells[key] = [];
      state.preparedSpells[key][slotIdx] = name;
      closeModal();
      renderSpells();
      save();
    };
    container.appendChild(row);
  });

  const listEl = document.querySelector('.modal-list');
  if (listEl) listEl.style.display = '';
}

function castPreparedSpell(rank, slotIdx) {
  state.spellSlotsUsed = state.spellSlotsUsed || {};
  state.spellSlotsUsed[rank] = state.spellSlotsUsed[rank] || {};
  state.spellSlotsUsed[rank][slotIdx] = true;
  renderSpells();
  save();
}

function unprepareSlot(rank, slotIdx) {
  if (!state.preparedSpells) return;
  const key = rank === 0 ? 'cantrip' : rank;
  if (state.preparedSpells[key]) state.preparedSpells[key][slotIdx] = null;
  renderSpells();
  save();
}

function longRest() {
  // 모든 소모된 슬롯 복원 (준비 내용은 유지)
  state.spellSlotsUsed = {};
  // 집중 포인트도 복원
  const fpCur = document.getElementById('fp-cur');
  const fpMax = document.getElementById('fp-max');
  if (fpCur && fpMax) fpCur.value = fpMax.value;
  // 선천적 주문 사용 초기화
  state.innateSpellsUsed = {};
  renderSpells();
  save();
}

// ═══════════════════════════════════════════════
//  MODAL SYSTEM
// ═══════════════════════════════════════════════

let modalContext = null;

function openModal(type, ctx) {
  modalType = type;
  modalContext = ctx || null;
  modalSelected = null;

  // 부스트 모달은 별도 처리
  if (type === 'boost') { openBoostModal(); return; }

  // ── FVTT 카탈로그 로딩 게이트 ──
  // 관련 어댑터가 준비 안 됐으면 빈 목록 대신 "로딩 중"을 보여주고 상호작용을 막은 뒤,
  // 준비되면 재오픈해 정상 렌더. (느린 모바일에서 빈 모달을 만지다 확정이 막히던 문제 방지)
  const _equipTypes = ['weapon','armor','shield','equip-weapon','equip-armor','equip-shield','equip-gear'];
  let _dataReady = true;
  if (type === 'class') _dataReady = !(typeof PF2eClass !== 'undefined' && PF2eClass.ready && !PF2eClass.ready());
  else if (type === 'background') _dataReady = !(typeof PF2eBg !== 'undefined' && PF2eBg.ready && !PF2eBg.ready());
  else if (type === 'ancestry' || type === 'heritage') _dataReady = !(typeof PF2eAnc !== 'undefined' && PF2eAnc.ready && !PF2eAnc.ready());
  else if (type === 'feat') _dataReady = !(typeof PF2eFeat !== 'undefined' && PF2eFeat.ready && !PF2eFeat.ready());
  else if (type === 'spell') _dataReady = !(typeof PF2eSpell !== 'undefined' && PF2eSpell.ready && !PF2eSpell.ready());
  else if (_equipTypes.includes(type)) _dataReady = !(typeof _equipUseFvtt === 'function') || _equipUseFvtt();
  if (!_dataReady) {
    const _reopen = (ok) => { if (ok !== false && modalType === type) openModal(type, ctx); };
    if (['class','ancestry','heritage','background'].includes(type) && typeof _ensureAncData === 'function') _ensureAncData().then(_reopen);
    else if ((type === 'feat' || type === 'spell') && typeof _ensureAllCatalogs === 'function') _ensureAllCatalogs().then(_reopen);
    else if (_equipTypes.includes(type) && typeof _ensureEquipData === 'function') _ensureEquipData().then(_reopen);
    else if (typeof _ensureAllCatalogs === 'function') _ensureAllCatalogs().then(_reopen);
  }

  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal-search').value = '';

  const titles = {
    class:'클래스 선택', ancestry:'혈통 선택', background:'배경 선택',
    heritage:'유산 선택', subclass:'서브클래스 선택', feat:'재주 선택', spell:'주문 선택',
    weapon:'무기 선택', armor:'방어구 선택', shield:'방패 선택',
    'equip-weapon':'무기 추가 (인벤토리)', 'equip-armor':'방어구 추가 (인벤토리)', 'equip-shield':'방패 추가 (인벤토리)', 'equip-gear':'장비 추가 (인벤토리)'
  };
  document.getElementById('modal-title').textContent = titles[type]||type;

  // 검색창 표시 여부
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = ['class','ancestry','background'].includes(type) ? 'none' : '';

  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  if (type==='feat') buildFeatFilters(ctx);
  else if (type==='spell') buildSpellFilters();
  else if (type==='weapon' || type==='equip-weapon') buildWeaponFilters();
  // 서브클래스 모달 제목에 클래스/유형 표시
  if (type==='subclass' && state.selectedClass) {
    const subs = SUBCLASS_DB.filter(s => s.class_id === state.selectedClass.id);
    const stype = subs[0]?.subclass_type || '서브클래스';
    document.getElementById('modal-title').textContent = `${state.selectedClass.name} — ${stype} 선택`;
  }

  // 초기 선택 UI가 있는 타입은 footer 숨김 (자체 확인 버튼 사용)
  const footer = document.querySelector('.modal-footer');
  if (footer) footer.style.display = ['class','ancestry','background'].includes(type) ? 'none' : '';

  // 미준비: 로딩 안내만 표시하고 종료(준비되면 위 게이트가 재오픈해 정상 렌더)
  if (!_dataReady) {
    const _opts = document.getElementById('modal-options');
    if (_opts) _opts.innerHTML = '<div style="padding:28px 16px;text-align:center;color:var(--text2);font-size:13px;line-height:1.7;">데이터를 불러오는 중입니다…<br><span style="font-size:11px;">잠시 후 목록이 표시됩니다.</span></div>';
    const _det = document.getElementById('modal-detail'); if (_det) _det.innerHTML = '';
    return;
  }

  renderOptions(getOptionsData(type));

  // ── 이미 선택된 항목이 있으면 자동 선택 + 상세 패널 표시 ──
  let preselected = null;
  if (type === 'class' && state.selectedClass) preselected = state.selectedClass;
  else if (type === 'ancestry' && state.selectedAncestry) preselected = state.selectedAncestry;
  else if (type === 'background' && state.selectedBackground) preselected = state.selectedBackground;
  else if (type === 'heritage' && state.selectedHeritage) preselected = state.selectedHeritage;
  if (preselected) {
    const rows = document.querySelectorAll('#modal-options .opt-row');
    for (const row of rows) {
      const nameEl = row.querySelector('.opt-row-name');
      const name = nameEl ? nameEl.textContent.trim() : '';
      const matchName = preselected.name || preselected.name_ko || '';
      if (name === matchName) {
        row.click();
        break;
      }
    }
  }
  // ── 재주(성장 빌더): 슬롯에 이미 선택된 재주가 있으면 하이라이트 + 상세 표시 ──
  // 클래스/배경과 동일한 재오픈 경험(목록 유지 + 선택된 항목 하이라이트).
  else if (type === 'feat' && growthPendingKey !== null && growthPendingLevel !== null) {
    const _curFeat = state.growth && state.growth[growthPendingLevel] && state.growth[growthPendingLevel][growthPendingKey];
    if (_curFeat) {
      const _matchKo = String(_curFeat).split(' (')[0].trim();
      const rows = document.querySelectorAll('#modal-options .opt-row');
      for (const row of rows) {
        const nameEl = row.querySelector('.opt-row-name');
        if (nameEl && nameEl.textContent.trim() === _matchKo) { row.click(); break; }
      }
    }
  }
}

function _searchFilter(arr) {
  const q = (document.getElementById('modal-search')?.value||'').toLowerCase();
  if (!q) return arr;
  return arr.filter(i => (i.name_ko||i.name||'').toLowerCase().includes(q) || (i.name_en||i.en||'').toLowerCase().includes(q) || (i.summary||'').toLowerCase().includes(q));
}

function getOptionsData(type) {
  const _ancReady = (typeof PF2eAnc !== 'undefined' && PF2eAnc.ready && PF2eAnc.ready());
  if (type==='class') {
    // 클래스 = FVTT 카탈로그(PF2eClass) 단일 소스(27). 미준비 시 openModal 게이트가 재오픈.
    return (typeof PF2eClass !== 'undefined' && PF2eClass.ready && PF2eClass.ready()) ? PF2eClass.classList() : [];
  }
  if (type==='ancestry') return _ancReady ? PF2eAnc.ancestryList() : [];
  if (type==='background') return (typeof PF2eBg !== 'undefined' && PF2eBg.ready && PF2eBg.ready()) ? PF2eBg.backgroundList() : [];
  if (type==='heritage') {
    if (!_ancReady) return [];   // 미준비 시 openModal 게이트가 로드 후 재오픈
    const ancId = state.selectedAncestry && state.selectedAncestry.id;
    // ancestry==null = 다목적 유산(네피림/체인질링/댐피르 등) → 항상 노출. 연결형은 선택 혈통 매칭
    return PF2eAnc.heritageList().filter(h => h.ancestry == null || !ancId || h.ancestry === ancId);
  }
  if (type==='subclass') return state.selectedClass ? SUBCLASS_DB.filter(s => s.class_id === state.selectedClass.id) : [];
  if (type==='feat') return filterFeats();
  if (type==='spell') return filterSpells();
  if (type==='weapon' || type==='equip-weapon') return filterWeapons();
  const _eqList = (t) => (typeof PF2eEquip!=='undefined' && PF2eEquip.legacyList) ? PF2eEquip.legacyList(t ? {type:t} : {}) : [];
  if (type==='armor' || type==='equip-armor') return _searchFilter(_eqList('armor'));
  if (type==='shield' || type==='equip-shield') return _searchFilter(_eqList('shield'));
  if (type==='equip-gear') return _searchFilter(_eqList().filter(i => i.damage===undefined && i.ac_bonus===undefined && i.hardness===undefined));
  return [];
}

function buildFeatFilters(ctx) {
  const fbar = document.getElementById('modal-filterbar');
  if (!fbar) return;
  const fromGrowth = !!growthPendingKey;

  if (fromGrowth) {
    // 성장 빌더에서 호출 시 필터 UI 숨김 (사용자 변경 불가)
    fbar.innerHTML = '';
  } else {
    const cats = [...new Set((typeof _allFeats === 'function' ? _allFeats() : []).map(f=>f.category))].sort();
    fbar.innerHTML = `
      <select id="filter-feat-cat" onchange="renderOptions(getOptionsData('feat'))">
        <option value="">전체 분류</option>
        ${cats.map(c=>`<option value="${c}">${c}</option>`).join('')}
      </select>
      <select id="filter-feat-lv" onchange="renderOptions(getOptionsData('feat'))">
        <option value="">전체 레벨</option>
        ${[1,2,4,6,8,10,12,14,16,18,20].map(n=>`<option value="${n}">${n}레벨 이하</option>`).join('')}
      </select>`;
    const catSel = document.getElementById('filter-feat-cat');
    const lvSel = document.getElementById('filter-feat-lv');
    if (catSel && lvSel) {
      if (ctx === 'class' && state.selectedClass) {
        catSel.value = state.selectedClass.id;
      } else if (ctx === 'ancestry') {
        catSel.value = 'ancestry';
      } else if (ctx === 'general') {
        catSel.value = 'general';
      } else if (ctx === 'skill') {
        catSel.value = 'skill';
      }
      const lv = getLevel();
      const opt = [...lvSel.options].reverse().find(o => parseInt(o.value) <= lv);
      if (opt) lvSel.value = opt.value;
    }
  }
}

function buildSpellFilters() {
  // 필터 UI 없음 — 슬롯 타입에 맞게 자동 필터링
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
}

function buildWeaponFilters() {
  const fbar = document.getElementById('modal-filterbar');
  if (!fbar) return;
  const _wl = (typeof PF2eEquip!=='undefined' && PF2eEquip.legacyList) ? PF2eEquip.legacyList({type:'weapon'}) : [];
  const cats = [...new Set(_wl.map(w=>w.category))].sort();
  fbar.innerHTML = `
    <select id="filter-wpn-cat" onchange="renderOptions(getOptionsData('weapon'))">
      <option value="">전체 분류</option>
      ${cats.map(c=>`<option value="${c}">${c}</option>`).join('')}
    </select>`;
}

// ── 구조화 prereqs 단일 조건 체크 ──
function _checkOnePrereq(cond) {
  // 기술 숙련도: {skill:'religion', rank:2}
  if (cond.skill) {
    const sk = (typeof SKILLS !== 'undefined') ? SKILLS.find(s => s.id === cond.skill) : null;
    if (!sk) return true; // 알 수 없는 기술 → 통과
    const cur = parseInt(document.getElementById('sk-prof-'+sk.id)?.value||0);
    return cur >= (cond.rank || 2);
  }
  // 지각: {perception:6}
  if (cond.perception != null) {
    const cur = parseInt(document.getElementById('prof-perc')?.value||0);
    return cur >= cond.perception;
  }
  // 지식(아무 지식): {lore:4}
  if (cond.lore != null) {
    const loreSkills = (typeof SKILLS !== 'undefined') ? SKILLS.filter(s => s.isLore) : [];
    const anyLore = loreSkills.some(s => {
      const cur = parseInt(document.getElementById('sk-prof-'+s.id)?.value||0);
      return cur >= cond.lore;
    });
    if (anyLore) return true;
    // 부여 지식은 DOM 슬롯 랭크(위 anyLore)에 이미 반영됨(출처 기반, assignLoreSlots). 별도 체크 불필요.
    return false;
  }
  // 능력치: {ability:'cha', min:2}
  if (cond.ability) {
    return getMod(cond.ability) >= (cond.min || 0);
  }
  // 시야: {vision:'darkvision'} or {vision:'low-light'} (v526~ enum)
  if (cond.vision) {
    const curVision = state.vision || state.selectedAncestry?.vision || 'none';
    return (VISION_RANK[curVision]||0) >= (VISION_RANK[cond.vision]||0);
  }
  // 신성 원천 선택: {divineFont:'heal' | 'harm' | 'either'} — state.divineFont 직접 비교
  if (cond.divineFont) {
    const cur = state.divineFont;
    if (!cur) return false;
    if (cond.divineFont === 'either') return cur === 'heal' || cur === 'harm';
    return cur === cond.divineFont;
  }
  // 재주 보유: {feat, featSlug}. ★ featSlug 있으면 슬러그로만 체크(번역명 무관, slug 원칙).
  if (cond.featSlug) {
    const fs2 = cond.featSlug;
    return Object.values(state.feats).flat().some(ff =>
      ff && ff.id && (ff.id === fs2 || (typeof featSlug === 'function' && featSlug(ff.id) === fs2)));
  }
  // 레거시(PREREQ_GROUPS, featSlug 없음): 이름 매칭 폴백
  if (cond.feat) {
    const allFeats = Object.values(state.feats).flat().filter(ff => ff?.name);
    return allFeats.some(ff => {
      const ko = ff.name.split(' (')[0].trim();
      const enM = ff.name.match(/\(([^)]+)\)$/);
      const en = enM ? enM[1].trim() : '';
      return en === cond.feat || ko === cond.feat;
    });
  }
  // 혈통: {ancestry:'엘프'}
  if (cond.ancestry) {
    if (state.selectedAncestry?.traits?.includes(cond.ancestry)) return true;
    if (getHeritageEffects(state.selectedHeritage).extraFeats?.includes(cond.ancestry)) return true;
    // 양자 혈통
    const adopted = Object.values(state.feats).flat().some(ff =>
      ff && featSlug(ff) === 'adopted-ancestry' && ff.choice && (typeof ANCESTRY_NAME_MAP !== 'undefined') && ANCESTRY_NAME_MAP[ff.choice] === cond.ancestry
    );
    return adopted;
  }
  // 유산: {heritage:'천상 혈통'}
  if (cond.heritage) {
    return nameMatches(cond.heritage, state.selectedHeritage);
  }
  // 서브클래스: {subclass:'수수께끼 뮤즈'} — name_ko로 시작하면 매칭 (서브클래스 타입 단어 차이 허용)
  if (cond.subclass) {
    const c = cond.subclass;
    const matchSub = (sub) => {
      if (!sub) return false;
      if (nameMatches(c, sub)) return true;
      // "폭풍 결사" / "수수께끼 뮤즈" 등: 첫 단어가 name_ko면 매칭 ('교단'/'결사' 같은 어휘 차이 흡수)
      const firstWord = c.split(' ')[0];
      if (sub.name_ko && firstWord === sub.name_ko) return true;
      if (sub.name_en && firstWord.toLowerCase() === sub.name_en.toLowerCase()) return true;
      return false;
    };
    if (matchSub(state.selectedSubclass)) return true;
    // 추가 서브클래스 (다양한 뮤즈 등)
    if (typeof SUBCLASS_DB !== 'undefined') {
      const match = Object.values(state.feats).flat().some(ff => {
        if (!ff?.choice) return false;
        return matchSub(SUBCLASS_DB.find(s => s.id === ff.choice));
      });
      if (match) return true;
    }
    return false;
  }
  // OR 조건: {or:[...]}
  if (cond.or) {
    return cond.or.some(sub => _checkOnePrereq(sub));
  }
  return true; // 알 수 없는 조건 → 통과
}

// ── PREREQ_GROUPS row → _checkOnePrereq 입력 객체로 변환 (v528~) ──
function _rowToCond(r) {
  const t = r.type;
  if (['str','dex','con','int','wis','cha'].includes(t)) {
    return { ability: t, min: parseInt(r.value) || 0 };
  }
  if (t === 'perception') return { perception: parseInt(r.value) || 0 };
  if (t === 'lore')       return { lore: parseInt(r.value) || 0 };
  if (t === 'feat')       return { feat: r.value };
  if (t === 'ancestry')   return { ancestry: r.value };
  if (t === 'heritage')   return { heritage: r.value };
  if (t === 'subclass')   return { subclass: r.value };
  if (t === 'vision')     return { vision: r.value };
  if (t === 'divine_font') return { divineFont: r.value };
  // 기본: SKILLS.id 외래키 (기술 숙련도)
  return { skill: t, rank: parseInt(r.value) || 0 };
}

// ── 전제조건 체크 (PREREQ_GROUPS 우선, 텍스트 폴백) — v528~ ──
function _checkPrereqs(feat) {
  if (feat.prereq_group_id && typeof PREREQ_GROUPS !== 'undefined') {
    const rows = getPrereqRows(feat.prereq_group_id);
    if (rows.length > 0) {
      const andRows = rows.filter(r => r.logic === 'and');
      const orRows  = rows.filter(r => r.logic === 'or');
      if (!andRows.every(r => _checkOnePrereq(_rowToCond(r)))) return false;
      if (orRows.length > 0 && !orRows.some(r => _checkOnePrereq(_rowToCond(r)))) return false;
      return true;
    }
  }
  // FVTT 파싱 구조화 conds(prereqs_db.js) — 기계판정 가능한 조건만 검사.
  // 내러티브 조건("100살 이상" 등 미파싱)은 conds에 미포함 = 자동 달성(미달 안내 없음).
  const _slug = feat && (feat.id || feat.slug);
  if (_slug && typeof PREREQ_STRUCT !== 'undefined' && PREREQ_STRUCT[_slug]) {
    return PREREQ_STRUCT[_slug].every(c => _checkOnePrereq(c));
  }
  // 구조화 없음(순수 내러티브/조건없음) → 항상 달성.
  // (구 텍스트 정규식 폴백 _checkPrereqsText은 내러티브 오판이 많아 미사용 — 차후 복구용으로 함수는 보존)
  return true;
}

// 선행조건 미충족 경고 배너(기계 conds 기반, _checkPrereqs). v0.117~:
//   읽는 선행 '문구'는 설명(desc)에서 관리 — FVTT 영어 원문(system.prerequisites)은 표시하지 않음.
//   데이터(conds)는 판정만 담당. 미충족일 때만 배너 반환, 충족/조건없음이면 ''.
function _prereqWarnBanner(feat) {
  let met = true;
  try { met = _checkPrereqs(feat); } catch(e) {}
  if (met) return '';
  return `<div style="background:#f4433620;border:1px solid #f44336;border-radius:4px;padding:6px 10px;margin-bottom:6px;color:#f44336;font-size:11px;font-weight:600;">⚠ 선행 조건이 충족되지 않았습니다</div>`;
}

// ── 텍스트 기반 전제조건 체크 (폴백) ──
function _checkPrereqsText(prereqStr) {
  if (!prereqStr) return true;
  const prereq = prereqStr.split(/(?<=\.)\s+/)[0].replace(/\.$/,'').trim();
  if (!prereq) return true;

  const learnedFeats = new Set();
  Object.values(state.feats).forEach(arr => arr.forEach(f => {
    if (f.name) {
      learnedFeats.add(f.name.split(' (')[0].trim());
      const enM = f.name.match(/\(([^)]+)\)$/);
      if (enM) learnedFeats.add(enM[1].trim());
    }
  }));

  const conditions = prereq.replace(/;\s*/g, ', ').split(/,\s*/);
  for (const cond of conditions) {
    const c = cond.trim();
    if (!c) continue;
    if (c.includes(' 또는 ')) {
      const orParts = c.split(/\s+또는\s+/);
      const anyPass = orParts.some(part => _checkPrereqsText(part.trim()));
      if (!anyPass) return false;
      continue;
    }
    // 기술 숙련도
    const skillRankMatch = c.match(/^(.+?)\s+(숙련|전문가|달인|전설)$/);
    if (skillRankMatch) {
      const name = skillRankMatch[1].replace(/에$/, '');
      const rankMap = {'숙련':2,'전문가':4,'달인':6,'전설':8};
      const reqRank = rankMap[skillRankMatch[2]] || 2;
      if (name === '지각') { if (parseInt(document.getElementById('prof-perc')?.value||0) < reqRank) return false; continue; }
      const sk = (typeof SKILLS !== 'undefined') ? SKILLS.find(s => s.name === skillRankMatch[1] || s.name === name) : null;
      if (sk && parseInt(document.getElementById('sk-prof-'+sk.id)?.value||0) < reqRank) return false;
      continue;
    }
    // 능력치
    const attrMatch = c.match(/^(근력|민첩|건강|지능|지혜|매력)\s*\+(\d+)$/);
    if (attrMatch) {
      const attrMap = {'근력':'str','민첩':'dex','건강':'con','지능':'int','지혜':'wis','매력':'cha'};
      if (getMod(attrMap[attrMatch[1]]) < parseInt(attrMatch[2])) return false;
      continue;
    }
    // 시야 — prereq 텍스트는 한글 또는 enum 양쪽 허용 (v526~)
    {
      // c 토큰을 enum으로 정규화
      const visionId = (c === '암시야' || c === 'darkvision') ? 'darkvision'
                     : (c === '저광 시야' || c === 'low-light') ? 'low-light'
                     : (c === '상위 암시야' || c === 'greater-darkvision') ? 'greater-darkvision'
                     : null;
      if (visionId) {
        const curVision = state.vision || state.selectedAncestry?.vision || 'none';
        if ((VISION_RANK[curVision]||0) < (VISION_RANK[visionId]||0)) return false;
        continue;
      }
    }
    // 혈통/유산/서브클래스/재주 — 기존 로직 유지
    if (state.selectedAncestry?.traits?.includes(c)) continue;
    if (getHeritageEffects(state.selectedHeritage).extraFeats?.includes(c)) continue;
    if (nameMatches(c, state.selectedHeritage)) continue;
    if (state.selectedSubclass) {
      const sub = state.selectedSubclass;
      if (nameMatches(c, sub)) continue;
      if (sub.subclass_type && c === sub.name_ko + ' ' + sub.subclass_type) continue;
    }
    if (/\d+레벨/.test(c)) continue;
    if (learnedFeats.has(c)) continue;
    {
      const found = getFeat(c);
      if (found && (learnedFeats.has(found.name_ko) || learnedFeats.has(found.name_en))) continue;
    }
    if (c === '주문시전 클래스 특성') { if (!state.selectedClass?.tradition) return false; continue; }
    if (c.includes('원천') || c.includes('동물') || c.includes('사역마')) continue;
    if (c.includes('주문')) { if (!state.selectedClass?.tradition) return false; continue; }
    return false;
  }
  return true;
}

// 헌신 재주 특수 조건: 자기 클래스 헌신 불가 + 기존 헌신이 있으면 해당 원형 비헌신 재주 2개 이상 필요
function canTakeDedication(f) {
  if (!featHasTrait(f, 'dedication', '헌신')) return true;
  // 자기 클래스 헌신 차단: 헌신 재주 slug = "<class>-dedication" (name_en 파싱 대신 slug)
  if (featHasTrait(f, 'multiclass', '멀티클래스') && state.selectedClass && f.id === state.selectedClass.id + '-dedication') return false;
  // 이미 보유한 헌신 재주 목록
  const allFeats = Object.values(state.feats).flat().filter(ff => ff?.name);
  const ownedDedications = allFeats.filter(ff => {
    const nameKo = ff.name.split(' (')[0].trim();
    const dbEntry = getFeat(nameKo);
    return featHasTrait(dbEntry, 'dedication', '헌신');
  });
  if (ownedDedications.length === 0) return true; // 첫 헌신은 자유

  // 각 보유 헌신에 대해: 해당 원형의 비헌신 재주 2개 이상 있는지 확인
  for (const ded of ownedDedications) {
    const dedNameKo = ded.name.split(' (')[0].trim();
    // 해당 원형의 비헌신 재주 수 (같은 원형 = name_ko에 같은 클래스명 포함)
    const classWord = dedNameKo.replace(' 헌신', '');
    const archFeats = allFeats.filter(ff => {
      if (ff.name === ded.name) return false; // 헌신 자체 제외
      const fNameKo = ff.name.split(' (')[0].trim();
      const fDb = getFeat(fNameKo);
      return fDb?.category === 'archetype' && fDb?.prerequisites?.includes(classWord);
    });
    if (archFeats.length < 2) return false;
  }
  return true;
}

function filterFeats() {
  if (typeof _allFeats !== 'function') return [];
  const q = document.getElementById('modal-search')?.value.toLowerCase()||'';
  const fromGrowth = !!growthPendingKey;

  // 성장 빌더에서 호출 시: growthPendingFeatType + growthPendingLevel 기준
  if (fromGrowth) {
    const ft = growthPendingFeatType;
    const maxLv = growthPendingLevel || getLevel();
    let cat = ft;
    // class → 선택된 클래스 id
    if (ft === 'class' && state.selectedClass) cat = state.selectedClass.id;

    // 혈통 재주용 traits 사전 구성 (filter 밖에서 1번만)
    let _ancestryTraits = null;
    if (ft === 'ancestry' && state.selectedAncestry) {
      _ancestryTraits = [...(state.selectedAncestry.traits || [])];
      const _hExtra = getHeritageEffects(state.selectedHeritage).extraFeats;
      if (_hExtra) _ancestryTraits.push(..._hExtra);
      if (state._fb?.adoptedAncestries) _ancestryTraits.push(...state._fb.adoptedAncestries);
      Object.values(state.feats).flat().forEach(ff => {
        if (ff && featSlug(ff) === 'adopted-ancestry' && ff.choice) {
          const t = ANCESTRY_NAME_MAP[ff.choice] || ff.choice;
          if (!_ancestryTraits.includes(t)) _ancestryTraits.push(t);
        }
      });
    }

    // 이미 배운 재주 이름·slug 수집 (중복 방지 — 전 카테고리, _auto 포함)
    // name(한글명 표기) + id/slug 3중 매칭 — 이름 표기 불일치(예 반격/반응)에도 견고
    // ★ 편집 중인 슬롯의 현재 재주는 제외 → 목록에 남아 하이라이트/재선택 가능
    //   (예: 돌진 슬롯을 다시 누르면 돌진이 목록에 그대로 보이고 하이라이트됨)
    const _editName = state.growth && state.growth[growthPendingLevel] && state.growth[growthPendingLevel][growthPendingKey];
    const _editSlug = _editName && typeof featSlug === 'function' ? featSlug(_editName) : null;
    const _learnedNames = new Set();
    const _learnedIds = new Set();
    Object.values(state.feats).flat().forEach(ff => {
      if (!ff) return;
      if (_editSlug && typeof featSlug === 'function' && featSlug(ff) === _editSlug && ff.level === growthPendingLevel) return;
      if (ff.name) _learnedNames.add(ff.name);
      if (ff.id) _learnedIds.add(ff.id);
    });

    return _allFeats().filter(f => {
      if (!f) return false;
      // 자동 부여(클래스/혈통 특성 등, acquisition='auto')는 선택 불가 재주 — 선택 모달에서 항상 제외.
      // 예: 반응 타격(Reactive Strike)·전설의 전사(Warrior of Legend)는 파이터 선택 시 자동 습득되는 특성.
      if (f.acquisition === 'auto') return false;
      if (q && !f.name_ko.includes(q) && !(f.name_en||'').toLowerCase().includes(q) && !(f.summary||'').includes(q)) return false;
      if (f.feat_level > maxLv) return false;
      // 전제조건 미달이어도 목록에 노출 (선택 시 경고 표시)
      // 이미 배운 재주 중복 방지 (repeatable이면 허용) — 이름 표기 or slug 일치
      if (!f.repeatable) {
        const fullName = f.name_ko + (f.name_en ? ` (${f.name_en})` : '');
        if (_learnedNames.has(fullName)) return false;
        if (f.id && _learnedIds.has(f.id)) return false;
      }
      // 헌신 재주 특수 조건
      if (featHasTrait(f, 'dedication', '헌신') && !canTakeDedication(f)) return false;
      if (ft === 'ancestry') {
        if (f.category !== 'ancestry') return false;
        if (_ancestryTraits) {
          return f.traits && f.traits.some(t => _ancestryTraits.includes(t));
        }
        return true;
      }
      // 클래스 재주 슬롯: 해당 클래스 재주 + archetype 재주도 포함
      // ★ 소스 무관 통일: 레거시(category=classid) + FVTT(category='class' + _classSlugs 트레잇) 동일 취급
      if (ft === 'class') {
        return _featInClass(f, cat) || f.category === 'archetype';
      }
      return f.category === cat;
    });
  }

  // 일반 모달 (재주 탭에서 직접 열기)
  const cat = document.getElementById('filter-feat-cat')?.value||'';
  const lv = parseInt(document.getElementById('filter-feat-lv')?.value||0);
  const _isClassCat = cat && !['ancestry','general','skill','archetype','feature','other','class'].includes(cat);
  return _allFeats().filter(f =>
    f.acquisition !== 'auto' &&  // 자동 부여 특성은 선택 불가 → 목록 제외
    (!cat || (_isClassCat ? _featInClass(f, cat) : f.category===cat)) &&
    (!lv || f.feat_level<=lv) &&
    (!q || f.name_ko.includes(q) || (f.name_en||'').toLowerCase().includes(q) || (f.summary||'').includes(q))
  );
}

// 재주의 클래스 소속 판정 — 소스(레거시/FVTT) 무관 통일.
//   레거시: category=classid ('fighter' 등). FVTT: category='class' + _classSlugs 트레잇(다중클래스 포함).
function _featInClass(f, classId) {
  if (!f || !classId) return false;
  if (f.category === classId) return true;
  if (f._classSlugs && f._classSlugs.indexOf(classId) !== -1) return true;
  return false;
}

function filterSpells() {
  const _spells = (typeof _allSpells === 'function') ? _allSpells() : [];
  if (!_spells.length) return [];
  const q = document.getElementById('modal-search')?.value.toLowerCase()||'';
  // 위치: 후원자 전통 사용, 그 외: 클래스 전통
  let classTrad = state.selectedClass?.tradition || '';
  if (classTrad === 'any' && state.selectedSubclass) {
    classTrad = state.selectedSubclass.tradition || classTrad;
  }
  const pending = typeof _spellSlotPending !== 'undefined' ? _spellSlotPending : null;
  const gPending = typeof _growthSpellPending !== 'undefined' ? _growthSpellPending : null;
  const fPending = typeof _growthFamiliarPending !== 'undefined' ? _growthFamiliarPending : null;
  let slotType = pending?.type || '';  // 'cantrip', 'known', 'focus'
  let slotRank = pending?.rank || 0;
  // growth 주문 선택 시 필터 적용
  if (!pending && gPending) {
    slotType = gPending.slotKey === 'cantrip' ? 'cantrip' : 'known';
    slotRank = gPending.rank || 0;
  }
  // 사역마 주문 습득 시 필터
  if (!pending && !gPending && fPending) {
    if (fPending.mode === 'init') {
      slotType = fPending.key === 'cantrip' ? 'cantrip' : 'known';
      slotRank = fPending.rank || 0;
    } else if (fPending.mode === 'free') {
      slotType = 'known';
      slotRank = fPending.maxRank || 0;
    }
  }

  return _spells.filter(sp => {
    // 클래스 전통 필터 (any면 모두 허용)
    if (classTrad && classTrad !== 'any' && sp.traditions && !sp.traditions.includes(classTrad)) return false;
    // 슬롯 타입별 필터
    if (slotType === 'cantrip' && !sp.is_cantrip) return false;
    if (slotType === 'focus' && !sp.is_focus) return false;
    if (slotType === 'known') {
      if (sp.is_cantrip || sp.is_focus) return false;
      // 해당 랭크 이하 주문 허용 (낮은 랭크 주문의 고양 버전으로 배울 수 있음)
      if (slotRank > 0 && sp.rank > slotRank) return false;
    }
    // 집중 주문은 재주/클래스 능력으로만 습득 — 일반 주문 선택에서 제외
    if (slotType !== 'focus' && sp.is_focus) return false;
    // 검색어
    if (q && !sp.name_ko.includes(q) && !sp.name_en.toLowerCase().includes(q)) return false;
    return true;
  });
}

function filterWeapons() {
  if (typeof PF2eEquip==='undefined' || !PF2eEquip.legacyList) return [];
  const q = document.getElementById('modal-search')?.value.toLowerCase()||'';
  const cat = document.getElementById('filter-wpn-cat')?.value||'';
  return PF2eEquip.legacyList({type:'weapon', search:q}).filter(w => !cat || w.category===cat);
}

function renderOptions(data) {
  const container = document.getElementById('modal-options');
  const detail = document.getElementById('modal-detail');
  container.innerHTML = '';
  if (detail) detail.innerHTML = '<div class="modal-detail-empty">항목을 선택하면 상세 정보가 표시됩니다.</div>';

  if (!data || !data.length) {
    container.innerHTML = '<div style="color:var(--text2);text-align:center;padding:20px;">결과 없음</div>';
    return;
  }

  // Group by rank/level for spells and feats
  const isSpell = ['spell','info'].includes(modalType) || modalType?.startsWith?.('equip');
  const isFeat = modalType === 'feat';
  let grouped = null;

  if (modalType === 'heritage') {
    // ancestry==null = 다재다능(복합) 유산(담피르·아이우바린·네피림 등) → 별도 그룹.
    // 판정은 필터(getOptionsData)와 동일한 신뢰 신호 h.ancestry 사용(effects의 versatile 플래그는 RE 형태가 제각각이라 불안정).
    // 현재 혈통에 종속된 유산을 위로, 다재다능 유산을 아래로.
    const KEY_ANC = '🧬 혈통 유산', KEY_VER = '🌟 다재다능한 유산 / 혼합 혈통';
    grouped = { [KEY_ANC]: [], [KEY_VER]: [] };
    data.forEach(item => { grouped[item.ancestry == null ? KEY_VER : KEY_ANC].push(item); });
    if (!grouped[KEY_ANC].length) delete grouped[KEY_ANC];
    if (!grouped[KEY_VER].length) delete grouped[KEY_VER];
  } else if (modalType === 'spell') {
    grouped = {};
    data.forEach(item => {
      const key = item.is_cantrip ? '캔트립' : item.is_focus ? '집중 주문' : `랭크 ${item.rank} 주문`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
  } else if (isFeat) {
    // 전제조건 충족 재주를 상단, 미달 재주를 하단으로 정렬
    data.sort((a, b) => {
      let aFail = false, bFail = false;
      try { aFail = (a.prereq_group_id || a.prerequisites) && !_checkPrereqs(a); } catch(e) {}
      try { bFail = (b.prereq_group_id || b.prerequisites) && !_checkPrereqs(b); } catch(e) {}
      if (aFail !== bFail) return aFail ? 1 : -1;
      return 0;
    });
    // 헌신(원형 입문) 재주는 레벨 그룹에서 빼내 맨 아래 별도 그룹으로 분리(클래스 재주 슬롯 등).
    const DED_KEY = '🎓 원형 헌신 재주';
    const lvGroups = {}, dedItems = [];
    data.forEach(item => {
      if (featHasTrait(item, 'dedication', '헌신')) { dedItems.push(item); return; }
      (lvGroups[item.feat_level] = lvGroups[item.feat_level] || []).push(item);
    });
    grouped = {};
    // 정수형 키는 JS 객체가 오름차순 순회 → 레벨 낮은 순 헤더
    Object.keys(lvGroups).forEach(lv => { grouped[`${lv}레벨`] = lvGroups[lv]; });
    if (dedItems.length) grouped[DED_KEY] = dedItems;
  } else if (modalType === 'equip-browse' && !equipBrowseSubTab) {
    if (equipBrowseTab === 'all') {
      grouped = {};
      data.forEach(item => {
        const key = item.damage!==undefined?'⚔ 무기':item.hardness!==undefined?'🛡 방패':item.ac_bonus!==undefined?'🛡 방어구':'📦 장비';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });
    } else if (data.length > 0 && data[0].category) {
      grouped = {};
      data.forEach(item => {
        const key = item.category || '기타';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });
    }
  }

  function renderItem(item) {
    const row = document.createElement('div');
    const nameKo = item.name || item.name_ko || '';
    const nameEn = item.en || item.name_en || '';
    // id 우선 매칭, id 없는 모달 항목(혈통/배경 등 일부)은 name_ko 폴백
    const _matchKey = modalSelected?.id != null && item?.id != null ? 'id' : 'name_ko';
    const selected = !!modalSelected && modalSelected[_matchKey] != null && modalSelected[_matchKey] === item?.[_matchKey];
    row.className = 'opt-row' + (selected ? ' selected' : '');

    // Level/rank badge
    let levelNum = 0;
    let levelText = '';
    if (item.feat_level !== undefined) { levelNum = item.feat_level; levelText = item.feat_level; }
    else if (item.rank !== undefined) { levelNum = item.is_cantrip ? 0 : item.rank; levelText = item.is_cantrip ? 'C' : item.rank; }
    else if (modalType === 'equip-browse' && item.price && item.price !== '—') { levelNum = 0; levelText = item.price; }

    // Action icons — 행동경제 글리프는 cs_ui.getActionIcons 단일 소스로(코드 1/2/3/reaction/free + 한글텍스트 + 범위).
    //   (구: 동일 로직 if-체인 중복. FVTT 재주 actions는 숫자라 getActionIcons가 String()로 안전 처리)
    const actionsHtml = (typeof getActionIcons === 'function') ? getActionIcons(item.actions) : (item.actions ? String(item.actions) : '');

    // 전제조건 미달 체크
    let prereqFail = false;
    try { prereqFail = item.feat_level !== undefined && (item.prereq_group_id || item.prerequisites) && !_checkPrereqs(item); } catch(e) {}

    const rClass = `r${Math.min(levelNum, 10)}`;
    // FVTT 아이콘: modalType→scope 매핑 (없으면 📄)
    const _scope = {spell:'spell',feat:'feat',heritage:'heritage',ancestry:'ancestry',background:'background',deity:'deity',class:'class'}[modalType]
      || ((modalType||'').startsWith('equip') ? 'equipment' : null);
    const _ico = _scope && typeof iconImg === 'function' ? iconImg(_scope, item) : '';
    row.innerHTML = `
      ${_ico ? `<div class="opt-row-icon" style="background:none;">${_ico}</div>` : '<div class="opt-row-icon">📄</div>'}
      <span class="opt-row-name" ${prereqFail ? 'style="opacity:0.5;"' : ''}>${nameKo}</span>
      ${prereqFail ? '<span style="font-size:10px;color:#f44336;flex-shrink:0;" title="선행 조건 미충족">⚠</span>' : ''}
      ${actionsHtml ? `<span class="opt-row-actions">${actionsHtml}</span>` : ''}
      ${levelText !== '' ? (
        (modalType === 'equip-browse' && item.price && item.price !== '—')
          ? `<span class="opt-row-price">${typeof priceWithIcons==='function'?priceWithIcons(item.price,14):levelText}</span>`
          : `<span class="opt-row-level ${rClass}">${levelText}</span>`
      ) : ''}`;

    row.onclick = () => selectOption(item, row);
    return row;
  }

  if (grouped) {
    for (const [section, items] of Object.entries(grouped)) {
      const header = document.createElement('div');
      header.className = 'opt-section-header';
      header.textContent = section;
      container.appendChild(header);
      items.forEach(item => container.appendChild(renderItem(item)));
    }
  } else {
    data.forEach(item => container.appendChild(renderItem(item)));
  }
}

function selectOption(item, row) {
  modalSelected = item;

  // Mobile accordion mode (≤700px)
  if (window.innerWidth <= 900) {
    // Toggle: if same row already expanded, collapse it
    const existing = row?.nextElementSibling;
    if (existing && existing.classList.contains('opt-row-detail') && existing.classList.contains('open')) {
      existing.classList.remove('open');
      row.classList.remove('expanded');
      modalSelected = null;
      return;
    }
    // Collapse all others
    document.querySelectorAll('.opt-row-detail.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.opt-row.expanded').forEach(r => r.classList.remove('expanded'));
    // Build detail HTML
    let detailHtml = '';
    if (modalType === 'equip-browse' || modalType === 'formula-pick') {
      const i = item;
      const p = i.price && i.price !== '—' ? `<div style="display:flex;align-items:center;gap:4px;"><strong>가격:</strong> ${typeof priceWithIcons==='function'?priceWithIcons(i.price,16):i.price}</div>` : '';
      const b = `<div><strong>부피:</strong> ${i.bulk==='L'?'L':i.bulk==='—'?'—':i.bulk}</div>`;
      const d = i.damage ? `<div><strong>피해:</strong> ${i.damage}</div>` : '';
      const ac = i.ac_bonus!==undefined ? `<div><strong>AC:</strong> +${i.ac_bonus}</div>` : '';
      const traits = (i.traits||[]).length ? `<div style="margin-top:4px;">${i.traits.map(t=>traitTag(t)).join(' ')}</div>` : '';
      // 설명(desc) — 데스크톱 showEquipDetail과 동일하게 모바일 아코디언에도 표시 (누락 버그 수정)
      let _descRaw = i.desc || i._desc || (i._runeData && i._runeData.desc) || '';
      let _descHtml = '';
      if (_descRaw) {
        if (typeof PF2eData !== 'undefined' && PF2eData.enrichDesc) { try { _descRaw = PF2eData.enrichDesc(_descRaw); } catch (e) {} }
        const _rendered = (typeof resolveDescRefs === 'function') ? resolveDescRefs(_descRaw) : _descRaw;
        _descHtml = `<div class="opt-row-desc" style="margin-top:8px;font-size:12px;line-height:1.6;border-top:1px solid var(--border);padding-top:8px;">${_rendered}</div>`;
      }
      detailHtml = `${p}${b}${d}${ac}${traits}${_descHtml}
        <div style="display:flex;gap:6px;margin-top:8px;">
          ${modalType === 'formula-pick'
            ? `<button onclick="recordFormula('${(item.name_ko||item.name||'').replace(/'/g,"\\\\'")}')" style="flex:1;padding:8px;background:var(--accent-bg);border:1px solid var(--accent);border-radius:4px;color:var(--accent);cursor:pointer;">📜 제조법 기록</button>`
            : `<button class="btn-give" onclick="equipBrowseGive()" style="flex:1;padding:8px;background:var(--bg4);border:1px solid var(--border2);border-radius:4px;color:var(--text);cursor:pointer;">획득</button>
               <button class="btn-buy" onclick="equipBrowseBuy()" style="flex:1;padding:8px;background:var(--accent-bg);border:1px solid var(--accent);border-radius:4px;color:var(--accent);cursor:pointer;">구매</button>`}
        </div>`;
    } else if ((modalType === 'class' || modalType === 'background' || modalType === 'ancestry') && _buildInitialChoicesUI) {
      const choicesHtml = _buildInitialChoicesUI(modalType, item);
      if (choicesHtml) {
        const shortDesc = modalType === 'background'
          ? (item.desc || '').replace(/\s*속성 부스트:.*$/, '')
          : (item.desc || '').split('<br><strong>')[0];
        detailHtml = `<div style="font-size:12px;line-height:1.7;color:var(--text2);margin-bottom:8px;">${shortDesc}</div>
          ${choicesHtml}
          <button id="modal-confirm-choice" onclick="confirmModal()" disabled
            style="width:100%;margin-top:10px;padding:10px;background:var(--bg4);color:var(--text2);border:1px solid var(--border);border-radius:4px;font-size:13px;font-weight:600;cursor:not-allowed;">
            모든 항목을 선택하세요
          </button>`;
      }
    } else {
      const nameKo = item.name || item.name_ko || '';
      let mDesc = item.desc || item.summary || '';
      let tags = '';
      if (item.feat_level !== undefined) {
        const mfTraits = (item.traits||[]).map(t2=>traitTag(t2)).join('');
        tags = `<div style="margin-bottom:4px;"><span class="tag-meta">${item.feat_level}레벨</span> <span class="tag-meta">${_catKo[item.category]||item.category||''}</span></div>${mfTraits?'<div style="margin-bottom:6px;">'+mfTraits+'</div>':''}`;
        // 선행 문구는 설명(desc)에서 관리 — 영어 원문 미표시. 기계 conds 미충족 시 경고 배너만 앞에 붙임.
        mDesc = _prereqWarnBanner(item) + (mDesc || '');
      }
      else if (item.rank !== undefined) tags = `<span class="tag-meta">${item.is_cantrip?'캔트립':'랭크 '+item.rank}</span>`;
      else if (item.damage) tags = `<span class="tag-meta">${item.damage}</span> <span class="tag-meta">가격: ${item.price?(typeof priceWithIcons==='function'?priceWithIcons(item.price):item.price):'-'}</span>`;
      else if (item.ac_bonus !== undefined) tags = `<span class="tag-meta">AC+${item.ac_bonus}</span>`;
      const mSpellNotes = (item.rank !== undefined && typeof getSpellFeatNotes === 'function') ? getSpellFeatNotes(item.name||item.name_ko||'') : '';
      const mFeatChoiceUI = (modalType === 'feat' && typeof _buildFeatModalChoiceUI === 'function') ? _buildFeatModalChoiceUI(item) : '';
      detailHtml = `${tags?'<div style="margin-bottom:6px;">'+tags+'</div>':''}
        <div style="font-size:12px;line-height:1.6;">${formatDescActions(mDesc, item)}${mSpellNotes}${_buildFeatActionCard(item)}</div>${mFeatChoiceUI}`;
    }
    // Insert or reuse detail div after row
    if (row) {
      row.classList.add('expanded');
      let detailDiv = row.nextElementSibling;
      if (!detailDiv || !detailDiv.classList.contains('opt-row-detail')) {
        detailDiv = document.createElement('div');
        detailDiv.className = 'opt-row-detail';
        row.after(detailDiv);
      }
      detailDiv.innerHTML = detailHtml;
      detailDiv.classList.add('open');
      // 초기 선택 UI: 이전 값 복원 + 검증 트리거
      if (typeof _restoreInitialChoicesUI === 'function') setTimeout(_restoreInitialChoicesUI, 0);
      // Confirm button for non-equip modals (초기 선택 UI가 있으면 자체 버튼 사용)
      const hasInitChoices = document.getElementById('modal-confirm-choice');
      if (!hasInitChoices && modalType !== 'equip-browse' && modalType !== 'deity-pick' && modalType !== 'sanct-pick' && modalType !== 'font-pick') {
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '선택';
        confirmBtn.style.cssText = 'width:100%;margin-top:8px;padding:10px;background:var(--accent);color:#fff;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;';
        confirmBtn.onclick = () => confirmModal();
        detailDiv.appendChild(confirmBtn);
      }
    }
    return;
  }

  // Desktop: standard behavior
  document.querySelectorAll('.opt-row').forEach(c => c.classList.remove('selected'));
  if (row) row.classList.add('selected');
  if (modalType === 'equip-browse' || modalType === 'formula-pick') showEquipDetail(item);
  else showItemDetail(item);
}

// 설명 텍스트에서 행동 블록([반응], [1행동] 등)을 행동 탭과 완전히 동일한 카드로 변환
// 재주가 행동인 경우 행동 카드 생성
function _buildFeatActionCard(item) {
  if (!item) return '';
  const summ = item.summary || item.desc || '';
  const costMatch = summ.match(/^\[(반응|1행동|2행동|3행동|자유 행동)\]/);
  if (!costMatch) return '';
  const costMap = {'반응':'reaction','1행동':'1','2행동':'2','3행동':'3','자유 행동':'free'};
  const costKey = costMap[costMatch[1]] || '1';
  const costIcon = (typeof getActionCostIcon==='function') ? getActionCostIcon(costKey) : costMatch[0];
  const traits = (item.traits||[]).map(t => typeof traitTag==='function' ? traitTag(t) : `<span class="tag">${t}</span>`).join(' ');
  let rawDesc = (item.desc||item.summary||'').replace(/^\[(?:반응|1행동|2행동|3행동|자유 행동)\]\s*/, '');
  rawDesc = _stripTraitLine(rawDesc);
  const desc = typeof resolveDescRefs==='function' ? resolveDescRefs(rawDesc) : rawDesc;
  return `<div class="action-card" style="margin:8px 0;max-width:320px;">
    <div class="action-card-head">
      <span class="action-cost">${costIcon}</span>
      <div style="flex:1;min-width:0;">
        <div class="action-name-ko">${item.name_ko||item.name||''}</div>
        <div class="action-name-en">${item.name_en||item.en||''}</div>
      </div>
    </div>
    ${traits ? `<div class="action-traits">${traits}</div>` : ''}
    <div class="action-summary">${desc}</div>
  </div>`;
}

function formatDescActions(text, item) {
  if (!text) return text;
  // desc 동적 참조 해석
  if (typeof resolveDescRefs === 'function') text = resolveDescRefs(text);
  const actionCostRe = /\[(?:반응|1행동|2행동|3행동|자유 행동)\]/;
  if (!actionCostRe.test(text)) return text;

  const costToKey = {'[반응]':'reaction','[1행동]':'1','[2행동]':'2','[3행동]':'3','[자유 행동]':'free'};

  // [행동] 위치를 찾고, 앞뒤를 분리
  const idx = text.search(actionCostRe);
  const before = text.substring(0, idx);

  // [행동] 앞에서 행동 이름 시작점 찾기 — 마지막 ". " 또는 "<br>" 또는 텍스트 시작
  let splitAt = 0;
  const lastDot = before.lastIndexOf('. ');
  const lastBr = before.lastIndexOf('<br>');
  if (lastDot >= 0 || lastBr >= 0) {
    if (lastDot > lastBr) splitAt = lastDot + 2;
    else splitAt = lastBr + 4;
  }

  const prefixText = text.substring(0, splitAt).trim();
  const actionPart = text.substring(splitAt).trim();

  // 파싱: "이름(English) [행동] 나머지" 또는 "이름 [행동] 나머지" 또는 "[행동] 나머지"
  const m = actionPart.match(/^(?:([\s\S]*?)\s+)?(\[(?:반응|1행동|2행동|3행동|자유 행동)\])\s*([\s\S]*)$/);
  if (!m) return text;

  let rawName = (m[1] || '').trim();
  const costPart = m[2];
  const restText = (m[3] || '').trim();
  const costKey = costToKey[costPart] || '1';

  // 이름에서 한국어 이름과 (영문) 분리
  let nameKo = rawName.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const enMatch = rawName.match(/\(([^)]+)\)\s*$/);
  let nameEn = enMatch ? enMatch[1] : '';

  // "~를 얻어" 등 불필요 접미사 제거
  nameKo = nameKo.replace(/을$|를$/, '').trim();

  // ACTION_DB에 등록된 행동이면 DB 데이터를 그대로 사용
  if (nameKo) {
    const dbAction = getAction(nameKo) || (nameEn ? getAction(nameEn) : null);
    if (dbAction) {
      return (prefixText ? prefixText + '<br>' : '') +
        _buildActionCard(dbAction.cost, dbAction.name_ko, dbAction.name_en, dbAction.traits||[], dbAction.summary);
    }
  }

  // DB에 없으면 파싱된 데이터로 카드 생성
  // 이름이 없으면 item(재주/유산)의 이름 사용
  if (!nameKo && item) {
    nameKo = item.name_ko || item.name || '';
    nameEn = nameEn || item.name_en || item.en || '';
  }
  const itemTraits = (!nameKo && item?.traits) ? item.traits : [];
  return (prefixText ? prefixText + '<br>' : '') +
    _buildActionCard(costKey, nameKo, nameEn, itemTraits, restText);
}

// summary 본문 맨 앞에 박혀 있는 "특성: ..." 텍스트 줄 제거 (칩으로 일원화).
// ACTION_DB 등 일부 summary가 `<strong>특성:</strong> 이동<br>...` 형태로 시작.
function _stripTraitLine(s) {
  return (s || '').replace(/^\s*<strong>특성:<\/strong>[^<]*(?:<br>\s*)+/, '');
}

function _buildActionCard(costKey, nameKo, nameEn, traits, summary) {
  const costIcon = getActionCostIcon(costKey);
  const traitsHtml = (traits||[]).map(t => typeof traitTag==='function' ? traitTag(t) : `<span class="tag">${t}</span>`).join('');
  summary = _stripTraitLine(summary);
  return `<div class="action-card" style="margin:8px 0;max-width:320px;">
    <div class="action-card-head">
      <span class="action-cost">${costIcon}</span>
      <div style="flex:1;min-width:0;">
        ${nameKo ? `<div class="action-name-ko">${nameKo}</div>` : ''}
        ${nameEn ? `<div class="action-name-en">${nameEn}</div>` : ''}
      </div>
    </div>
    ${traitsHtml ? `<div class="action-traits">${traitsHtml}</div>` : ''}
    <div class="action-summary">${summary}</div>
  </div>`;
}

function showItemDetail(item) {
  const detail = document.getElementById('modal-detail');
  if (!detail) return;

  const nameKo = item.name || item.name_ko || '';
  const nameEn = item.en || item.name_en || '';
  let desc = item.desc || item.summary || '';

  let tags = '';
  if (item.feat_level !== undefined) {
    const traitsHtml = (item.traits||[]).map(t=>traitTag(t)).join('');
    tags = `<div style="margin-bottom:4px;"><span class="tag-meta">${item.feat_level}레벨</span> <span class="tag-meta">${_catKo[item.category]||item.category||''}</span></div>${traitsHtml?'<div style="margin-bottom:6px;">'+traitsHtml+'</div>':''}`;
    // 선행 문구는 설명(desc)에서 관리 — 영어 원문 미표시. 기계 conds 미충족 시 경고 배너만 앞에 붙임.
    desc = _prereqWarnBanner(item) + (desc || '');
  } else if (item.rank !== undefined) {
    const rankStr = item.is_cantrip?'캔트립':item.is_focus?'집중':`랭크 ${item.rank}`;
    const spTraits = [...(item.traditions||[]),...(item.traits||[])].map(t=>traitTag(t)).join('');
    tags = `<div style="margin-bottom:4px;"><span class="tag-meta">${rankStr}</span> <span class="spell-actions">${item.actions||''}</span></div>${spTraits?'<div style="margin-bottom:6px;">'+spTraits+'</div>':''}`;
    // 주문 메타 필드 구조화 (desc 앞에 삽입하지 않고, 별도 블록으로)
    let spellMeta = '';
    if (item.castTime) spellMeta += `<div><strong>시전:</strong> ${item.castTime}</div>`;
    if (item.range) spellMeta += `<div><strong>사거리:</strong> ${item.range}${item.area ? ` | <strong>영역:</strong> ${item.area}` : ''}</div>`;
    if (item.target) spellMeta += `<div><strong>대상:</strong> ${item.target}</div>`;
    if (item.defense) spellMeta += `<div><strong>방어:</strong> ${item.defense}</div>`;
    if (item.duration) spellMeta += `<div><strong>지속 시간:</strong> ${item.duration}</div>`;
    if (item.frequency) spellMeta += `<div><strong>빈도:</strong> ${item.frequency}</div>`;
    if (item.trigger) spellMeta += `<div><strong>유발 조건:</strong> ${item.trigger}</div>`;
    if (item.requirements) spellMeta += `<div><strong>요구사항:</strong> ${item.requirements}</div>`;
    if (item.cost) spellMeta += `<div><strong>비용:</strong> ${item.cost}</div>`;
    if (spellMeta) {
      spellMeta = `<div style="font-size:12px;line-height:1.6;padding:6px 0;margin-bottom:6px;border-bottom:1px solid var(--border);color:var(--text2);">${spellMeta}</div>`;
    }
    // desc에서 중복 메타 줄 제거 (새 DB는 desc에 메타를 넣으므로)
    desc = desc.replace(/<strong>(?:사거리|영역|대상|방어|지속 ?시간|빈도|유발 조건|요구사항|비용|시전):<\/strong>[^<]*(?:<br>)?/g, '').replace(/^\s*<br>/, '');
    desc = spellMeta + desc;
  } else if (item.damage !== undefined) {
    const wpTraits = (item.traits||[]).map(t=>traitTag(t)).join('');
    tags = `<div style="margin-bottom:4px;"><span class="tag-meta">${item.damage||''}</span> <span class="tag-meta">${item.category||''}</span> <span class="tag-meta">가격: ${item.price?(typeof priceWithIcons==='function'?priceWithIcons(item.price):item.price):'-'}</span></div>${wpTraits?'<div style="margin-bottom:6px;">'+wpTraits+'</div>':''}`;
  } else if (item.ac_bonus !== undefined) {
    tags = `<div style="margin-bottom:4px;"><span class="tag-meta">AC+${item.ac_bonus}</span> <span class="tag-meta">${item.category||''}</span>
            ${item.dex_cap!==null&&item.dex_cap!==undefined?`<span class="tag-meta">DEX상한: ${item.dex_cap}</span>`:''}
            ${item.hardness!==undefined?`<span class="tag-meta">경도: ${item.hardness}</span>`:''}
            ${item.hp!==undefined&&item.bt!==undefined?`<span class="tag-meta">HP: ${item.hp} (BT: ${item.bt})</span>`:''}
            ${item.speed_penalty?`<span class="tag-meta" style="color:var(--red-light);">속도: ${item.speed_penalty}</span>`:''}
            <span class="tag-meta">가격: ${item.price?(typeof priceWithIcons==='function'?priceWithIcons(item.price):item.price):'-'}</span></div>`;
  } else if (item.hp !== undefined && item.key_attrs !== undefined) {
    const keyKo = (item.key_attrs || []).map(k => ATTR_KO[k]).join(' 또는 ');
    tags = `<span class="tag-meta">HP ${item.hp}+CON</span> <span class="tag-meta">${keyKo}</span>
            ${item.tradition?`<span class="tag">${item.tradition} 주문</span>`:''}`;
  } else if (item.boosts !== undefined && item.flaws !== undefined && item.size !== undefined) {
    // ANCESTRIES (혈통)
    const boostKo = [
      ...(item.boosts || []).map(k => ATTR_KO[k]),
      ...(item.boost_choices || []).map(g => g.map(k => ATTR_KO[k]).join('/')),
      ...Array(item.free_boosts || 0).fill('자유'),
    ];
    tags = `<span class="tag hl">HP ${item.hp}</span>
            <span class="tag">${item.size}/${item.speed}피트</span>
            ${boostKo.map(b=>`<span class="tag hl">${b}</span>`).join('')}`;
  } else if (item.subclass_type) {
    tags = `<span class="tag hl">${item.subclass_type}</span>`;
  }

  // ── 클래스/배경/혈통: 초기 선택 UI 포함 상세 패널 ──
  if ((modalType === 'class' || modalType === 'background' || modalType === 'ancestry') && _buildInitialChoicesUI) {
    const choicesHtml = _buildInitialChoicesUI(modalType, item);
    if (choicesHtml) {
      const shortDesc = modalType === 'background'
        ? (item.desc || '').replace(/\s*속성 부스트:.*$/, '')
        : (item.desc || '').split('<br><strong>')[0]; // 첫 단락만
      detail.innerHTML = `
        <div class="modal-detail-back" onclick="document.getElementById('modal-body').classList.remove('detail-open')">← 목록으로</div>
        <div class="modal-detail-title">${nameKo}</div>
        <div class="modal-detail-en">${nameEn}</div>
        <div class="modal-detail-tags">${tags}</div>
        <hr style="border:none;border-top:1px solid var(--border);margin:0 0 10px 0;">
        <div style="font-size:12px;line-height:1.7;color:var(--text2);margin-bottom:10px;">${shortDesc}</div>
        ${modalType === 'class' ? _buildClassProgressionTable(item) : ''}
        ${choicesHtml}
        <button id="modal-confirm-choice" onclick="confirmModal()" disabled
          style="width:100%;margin-top:14px;padding:10px;background:var(--bg4);color:var(--text2);border:1px solid var(--border);border-radius:4px;font-size:13px;font-weight:600;cursor:not-allowed;">
          모든 항목을 선택하세요
        </button>`;
      setTimeout(_restoreInitialChoicesUI, 0);
      return;
    }
  }

  // 주문에 재주 효과 노트 추가
  const spellNotes = (item.rank !== undefined && typeof getSpellFeatNotes === 'function') ? getSpellFeatNotes(nameKo) : '';
  // 재주: 인라인 choice UI(지식/기술 등, 배경과 동일 방식) — 상세 패널에서 바로 입력
  const featChoiceUI = (modalType === 'feat' && typeof _buildFeatModalChoiceUI === 'function') ? _buildFeatModalChoiceUI(item) : '';
  detail.innerHTML = `
    <div class="modal-detail-back" onclick="document.getElementById('modal-body').classList.remove('detail-open')">← 목록으로</div>
    <div class="modal-detail-title">${nameKo}</div>
    <div class="modal-detail-en">${nameEn}</div>
    <div class="modal-detail-tags">${tags}</div>
    <hr style="border:none;border-top:1px solid var(--border);margin:0 0 10px 0;">
    <div class="modal-detail-desc">${formatDescActions(desc, item)}${spellNotes}${_buildFeatActionCard(item)}</div>
    ${featChoiceUI}`;
}

function filterOptions() {
  if (modalType === 'equip-browse' || modalType === 'formula-pick') { renderEquipBrowseItems(); return; }
  if (modalType === 'learn-spells') { if (typeof _refreshLearnSpellsList === 'function') _refreshLearnSpellsList(); return; }
  renderOptions(getOptionsData(modalType));
}

// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
//  INITIAL CHOICES UI (class/background/ancestry 모달 내 선택)
// ═══════════════════════════════════════════════

// 임시 저장: 모달 내 선택값 (confirmModal 시 state에 반영)
var _modalChoices = {};

function _buildInitialChoicesUI(type, item) {
  _modalChoices = {};
  if (type === 'class') return _buildClassChoicesUI(item);
  if (type === 'background') return _buildBackgroundChoicesUI(item);
  if (type === 'ancestry') return _buildAncestryChoicesUI(item);
  return '';
}

// ── 드롭다운 빌더 헬퍼 ──
var _selStyle = 'width:100%;padding:6px 8px;background:var(--bg2);color:var(--text);border:1px solid var(--border);border-radius:4px;font-size:12px;';
function _choiceDropdown(id, label, options, disabled, selected) {
  const disAttr = disabled ? 'disabled' : '';
  const disStyle = disabled ? 'opacity:0.6;' : '';
  let html = `<select id="${id}" ${disAttr} onchange="_onInitialChoiceChange()" style="${_selStyle}${disStyle}">`;
  if (!disabled && !selected) html += `<option value="">— 선택 —</option>`;
  options.forEach(o => {
    const val = typeof o === 'object' ? o.value : o;
    const lbl = typeof o === 'object' ? o.label : o;
    const sel = (selected === val || (disabled && options.length === 1)) ? ' selected' : '';
    html += `<option value="${val}"${sel}>${lbl}</option>`;
  });
  html += `</select>`;
  return `<div style="margin-bottom:6px;">
    <div style="font-size:10px;color:var(--text2);margin-bottom:2px;">${label}</div>
    ${html}
  </div>`;
}

// ── 재주 선택 모달: 인라인 choice UI (배경 지식 입력과 완전히 동일한 방식) ──
// 지식(lore) 자유입력·기술(skill)·커스텀(custom)·기본기술(skill_defaults)을 선택 모달 상세 패널에서
// 바로 입력한다. 값은 _modalChoices.featChoice에 임시 저장 → confirmModal이 추가되는 재주에 반영.
// (기존 재주 탭 인라인 _buildFeatChoiceUI는 '나중 편집' surface로 그대로 유지 — 동일 데이터(feat.choice) 공유.)
function _existingFeatChoiceForModal(item) {
  if (typeof featSlug !== 'function') return '';
  // ★ 편집 중인 '바로 그 슬롯'의 현재 재주와 이 항목이 동일할 때만 기존 choice 프리필(재선택/편집).
  //   새 추가(빈 슬롯이거나 다른 재주)엔 프리필 금지 — 반복 재주(추가 지식)를 새로 넣을 때 다른 인스턴스의
  //   지식명이 복제돼 모두 같은 슬롯(동명)으로 몰리던 버그 방지.
  if (growthPendingKey == null || growthPendingLevel == null) return '';
  const cur = state.growth && state.growth[growthPendingLevel] && state.growth[growthPendingLevel][growthPendingKey];
  if (!cur) return '';
  const itemSlug = item.id || featSlug(item.name_ko || item.name || '');
  if (!itemSlug || featSlug(cur) !== itemSlug) return '';
  const arr = state.feats[growthPendingFeatType];
  if (!Array.isArray(arr)) return '';
  const f = arr.find(x => x && featSlug(x) === itemSlug && x.level === growthPendingLevel);
  return (f && f.choice) || '';
}

function _buildFeatModalChoiceUI(item) {
  _modalChoices = {}; // 다른 타입 잔류값 초기화 (선택 안 한 재주면 빈 값)
  if (typeof _getFeatEffectsDef !== 'function' || !item) return '';
  const def = _getFeatEffectsDef(item.id || item.name_en || item.en || item.name_ko || item.name || '');
  if (!def || !def.choice) return '';
  const ch = def.choice;
  // 인라인으로 다룰 타입만 (spell_cantrip 등 팝업형은 확정 후 기존 팝업 유지)
  const inline = (ch.type === 'lore' || ch.type === 'skill' || ch.type === 'skill_fixed'
    || ch.type === 'skill_defaults' || (ch.type === 'custom' && ch.options));
  if (!inline) return '';

  const skills = (typeof SKILLS !== 'undefined') ? SKILLS.filter(s => !s.isLore) : [];
  const existing = _existingFeatChoiceForModal(item);
  _modalChoices = { type: 'feat', featChoiceType: ch.type, featChoice: existing || '' };

  let inner = '', note = '비워 두면 나중에 재주 탭에서 입력할 수 있습니다.';
  if (ch.type === 'lore') {
    const cur = (existing || '').replace(/"/g, '&quot;');
    inner = `<input type="text" id="feat-choice-lore" value="${cur}" placeholder="지식 분야 입력 (예: 소문 지식)" maxlength="30"
      oninput="_modalChoices.featChoice=this.value" style="${_selStyle}">`;
  } else if (ch.type === 'skill_fixed') {
    const fid = ch.fixedSkill || '';
    _modalChoices.featChoice = fid;
    const fname = (skills.find(s => s.id === fid) || {}).name || fid;
    inner = `<select disabled style="${_selStyle}opacity:0.6;"><option selected>${fname}</option></select>`;
    note = '';
  } else if (ch.type === 'skill' || (ch.type === 'custom' && ch.options)) {
    const minRank = (ch.type === 'skill' && ch.filter && ch.filter.min_rank) || 0;
    const opts = (ch.type === 'custom')
      ? ch.options.map(o => ({ value: o.id, name: o.name }))
      : skills.filter(s => {
          if (!minRank) return true;
          const rank = parseInt((document.getElementById('sk-prof-' + s.id) || {}).value || 0);
          return rank >= minRank || s.id === existing;
        }).map(s => ({ value: s.id, name: s.name }));
    inner = `<select id="feat-choice-sel" onchange="_modalChoices.featChoice=this.value" style="${_selStyle}">
      <option value="">— 선택 —</option>
      ${opts.map(o => `<option value="${o.value}"${o.value === existing ? ' selected' : ''}>${o.name}</option>`).join('')}
    </select>`;
  } else if (ch.type === 'skill_defaults') {
    const defaults = ch.defaults || [];
    const count = ch.count || defaults.length;
    const vals = (existing || defaults.join(',')).split(',');
    _modalChoices.featChoice = vals.slice(0, count).join(',');
    for (let i = 0; i < count; i++) {
      const sv = vals[i] || defaults[i] || '';
      inner += `<div style="margin-bottom:4px;"><select data-fcd="${i}" onchange="_onFeatModalDefaultsChange(${count})" style="${_selStyle}">
        ${skills.map(s => `<option value="${s.id}"${s.id === sv ? ' selected' : ''}>${s.name}</option>`).join('')}
      </select></div>`;
    }
  }

  return `<div style="border:1px solid var(--border);border-radius:6px;padding:10px;margin-top:10px;">
    <div style="font-size:11px;font-weight:600;color:var(--accent);margin-bottom:6px;">📋 ${ch.label || '선택'}</div>
    ${inner}
    ${note ? `<div style="font-size:10px;color:var(--text2);margin-top:4px;">${note}</div>` : ''}
  </div>`;
}

function _onFeatModalDefaultsChange(count) {
  const vals = [];
  document.querySelectorAll('[data-fcd]').forEach(s => vals.push(s.value));
  if (_modalChoices) _modalChoices.featChoice = vals.slice(0, count).join(',');
}

// confirmModal에서 방금 추가된 재주에 모달 상세의 인라인 choice 값을 반영
function _applyModalFeatChoice(feat) {
  if (!feat || !_modalChoices || _modalChoices.type !== 'feat') return;
  if (typeof _modalChoices.featChoice === 'string' && _modalChoices.featChoice.trim()) {
    feat.choice = _modalChoices.featChoice.trim();
  }
}

// ── 클래스 발전 표 (Table) ──
function _buildClassProgressionTable(cls) {
  if (!cls || typeof CLASS_FEATURE_NAMES === 'undefined') return '';
  const cfn = CLASS_FEATURE_NAMES[cls.id] || [];
  const gt = getGrowthTable(cls);
  const curLv = getLevel();

  let rows = '';
  for (let lv = 1; lv <= 20; lv++) {
    const plan = gt[lv] || {};
    const parts = [];

    // 클래스 특성
    const feats = cfn.filter(f => f.lv === lv);
    feats.forEach(f => parts.push(f.name_ko));

    // GROWTH_TABLE 항목
    if (plan.classFeat) parts.push('클래스 재주');
    if (plan.ancestryFeat) parts.push('혈통 재주');
    if (plan.generalFeat) parts.push('일반 재주');
    if (plan.skillFeat) parts.push('기술 재주');
    if (plan.skillIncrease) parts.push('기술 증가');
    if (plan.boosts) parts.push('능력치 부스트');
    if (lv === 1) { parts.push('혈통과 배경'); parts.push('초기 숙련도'); }

    const isFuture = lv > curLv;
    const rowBg = lv === curLv ? 'rgba(245,197,24,0.12)' : (lv % 2 === 0 ? 'var(--bg3)' : 'transparent');
    const dimStyle = isFuture ? 'opacity:0.4;' : '';
    const lvColor = lv === curLv ? '#f5c518' : (isFuture ? 'var(--text2)' : 'var(--accent)');
    rows += `<tr style="background:${rowBg};${dimStyle}">
      <td style="padding:3px 6px;text-align:center;font-weight:600;color:${lvColor};border-right:1px solid var(--border);white-space:nowrap;">${lv}</td>
      <td style="padding:3px 6px;font-size:11px;line-height:1.5;">${parts.join(', ')}</td>
    </tr>`;
  }

  return `<div id="class-progression-table" style="margin:10px 0;border:1px solid var(--border);border-radius:6px;overflow:hidden;">
    <div style="font-size:11px;font-weight:600;color:var(--accent);padding:8px 10px;background:var(--bg3);border-bottom:1px solid var(--border);">📋 ${cls.name} 발전 표</div>
    <div>
    <table style="width:100%;border-collapse:collapse;font-size:11px;color:var(--text1);">
      <thead><tr style="background:var(--bg4);border-bottom:1px solid var(--border);">
        <th style="padding:4px 6px;text-align:center;font-size:10px;color:var(--text2);border-right:1px solid var(--border);">레벨</th>
        <th style="padding:4px 6px;text-align:left;font-size:10px;color:var(--text2);">클래스 특성</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    </div>
  </div>`;
}

// ── 클래스 모달: 레벨별 통합 UI ──
function _buildClassChoicesUI(cls) {
  // ── 정규화된 데이터 사용 (CLASSES.fixed_skills/choice_skill_groups/free_skill_count) ──
  const skillNameById = {};
  if (typeof SKILLS !== 'undefined') SKILLS.forEach(s => { skillNameById[s.id] = s.name; });
  const fixedSkills = (cls.fixed_skills || []).map(id => skillNameById[id] || id);
  const choiceSkills = (cls.choice_skill_groups || []).map(grp => grp.map(id => skillNameById[id] || id));
  const trainableBase = cls.free_skill_count || 0;
  const deitySkill = !!cls.deity_skill;

  _modalChoices = { type: 'class', fixedSkills, choiceSkills, trainableBase, deitySkill, trainableSkills: Array(trainableBase).fill(''), chosenFixedSkills: Array(choiceSkills.length).fill('') };

  // ── 이전 선택값 복원 (같은 클래스가 이미 선택된 경우) ──
  if (state.selectedClass?.id === cls.id) {
    const saved = state.initialChoices?.class;
    // trainableSkills: growth에 저장된 값 우선, 없으면 initialChoices
    const savedTraining = state.growth?.[1]?.skillTraining || (saved ? saved.trainableSkills : []) || [];
    for (let i = 0; i < trainableBase && i < savedTraining.length; i++) {
      _modalChoices.trainableSkills[i] = savedTraining[i] || '';
    }
    // chosenFixedSkills 복원
    const savedFixed = saved?.chosenFixedSkills || [];
    for (let i = 0; i < choiceSkills.length && i < savedFixed.length; i++) {
      _modalChoices.chosenFixedSkills[i] = savedFixed[i] || '';
    }
  }

  // ── 클래스 특성 수집 ──
  const maxLv = getLevel();
  const classFeats = typeof CLASS_FEATURE_NAMES !== 'undefined' ? (CLASS_FEATURE_NAMES[cls.id] || []).filter(f => f.lv <= maxLv) : [];
  // ⚠ 현재 선택된 서브클래스가 '이 클래스' 소속일 때만 사용(타 클래스 잔류 방지 — 클레릭 교의가 챔피언에 새던 버그)
  const _selSub = state.selectedSubclass;
  const subId = (_selSub && _selSub.class_id === cls.id) ? _selSub.id : null;
  const subFeats = subId
    ? (SUBCLASS_DB.find(s => s.id === subId)?.features || []).filter(f => f.lv <= maxLv) : [];
  const allFeats = [...classFeats, ...subFeats].sort((a, b) => a.lv - b.lv || a.name_ko.localeCompare(b.name_ko));
  const featsByLv = {};
  allFeats.forEach(f => { (featsByLv[f.lv] = featsByLv[f.lv] || []).push(f); });

  // ── 서브클래스 HTML 미리 준비 ── (신격/교의/신성원천 UI = deity_skill 플래그, 하드코딩 'cleric' 대신)
  let subclassHtml = '';
  if (deitySkill) {
    subclassHtml = _buildClericChoicesUI();
  } else if (typeof SUBCLASS_DB !== 'undefined') {
    const subs = SUBCLASS_DB.filter(s => s.class_id === cls.id);
    if (subs.length > 0) {
      const subLabel = subs[0].subclass_type || '서브클래스';
      subclassHtml = _buildSubclassChoiceUI(cls.id, subLabel, subs);
    }
  }

  // ── 레벨별 통합 렌더링 ──
  let html = '';

  // 1레벨에 들어갈 항목 수집
  const lv1Feats = featsByLv[1] || [];
  const hasLv1Content = true; // 기술 숙련은 항상 있음

  // === 1레벨 ===
  html += _classLevelHeader(1);

  // 기술 숙련 블록
  html += _classFeatureBlock('📖', '기술 숙련', 'Skill Proficiencies', () => {
    let inner = '';
    fixedSkills.forEach(name => {
      inner += _choiceDropdown('', '고정 기술', [{value: name, label: name}], true, name);
    });
    choiceSkills.forEach((choices, ci) => {
      const curFixed = _modalChoices.chosenFixedSkills[ci] || '';
      const options = choices.map(c => ({value: c, label: c}));
      inner += `<div style="margin-bottom:6px;">
        <div style="font-size:10px;color:var(--text2);margin-bottom:2px;">기술 (선택)</div>
        <select onchange="_modalChoices.chosenFixedSkills[${ci}]=this.value;_validateInitialChoices()" style="${_selStyle}">
          <option value="">— 선택 —</option>
          ${options.map(o => `<option value="${o.value}"${o.value === curFixed ? ' selected' : ''}>${o.label}</option>`).join('')}
        </select>
      </div>`;
    });
    inner += `<div style="font-size:10px;color:var(--text2);margin:8px 0 4px;">추가 기술 숙련 (기본 ${trainableBase}개${deitySkill ? ' + 신격 기술' : ''}, + 버튼으로 추가)</div>`;
    inner += `<div id="class-trainable-skills">`;
    for (let i = 0; i < trainableBase; i++) {
      inner += _buildTrainableSkillRow(i, fixedSkills);
    }
    inner += `</div>`;
    inner += `<div style="text-align:center;margin-top:4px;">
      <button onclick="_addTrainableSkill()" style="padding:4px 16px;background:var(--bg3);border:1px solid var(--border);border-radius:4px;color:var(--accent);cursor:pointer;font-size:12px;">＋ 추가</button>
      <span style="font-size:10px;color:var(--text2);margin-left:6px;">INT 수정치만큼 추가 가능</span>
    </div>`;
    return inner;
  });

  // 서브클래스/클레릭 블록 (1레벨)
  if (subclassHtml) {
    html += subclassHtml;
  }

  // 1레벨 클래스 특성 블록들 (서브클래스 특성은 서브클래스 블록 안에 표시하므로 제외)
  lv1Feats.filter(f => !subFeats.includes(f)).forEach(f => {
    html += `<div class="cfp-dynamic">${_classFeatureBlock('⚡', f.name_ko, f.name_en, () => {
      return f.desc ? `<div class="cfb-desc">${resolveDescRefs(f.desc)}</div>` : '';
    }, false, true)}</div>`;
  });

  // === 2레벨 이상 ===
  const otherLevels = Object.keys(featsByLv).map(Number).filter(lv => lv > 1).sort((a, b) => a - b);
  otherLevels.forEach(lv => {
    html += `<div class="cfp-dynamic">${_classLevelHeader(lv)}`;
    featsByLv[lv].forEach((f, fi) => {
      const isSub = subFeats.includes(f);
      html += _classFeatureBlock('⚡', f.name_ko, f.name_en, () => {
        return f.desc ? `<div class="cfb-desc">${resolveDescRefs(f.desc)}</div>` : '';
      }, isSub, true);
    });
    html += `</div>`;
  });

  // 동적 갱신용 컨테이너 ID
  html = `<div id="class-level-ui">${html}</div>`;
  return html;
}

// ── 레벨 헤더 ──
function _classLevelHeader(lv) {
  const curLv = getLevel();
  const isCurrent = lv === curLv;
  const isFuture = lv > curLv;
  const lvColor = isCurrent ? '#f5c518' : (isFuture ? 'var(--text2)' : 'var(--accent)');
  const dimStyle = isFuture ? 'opacity:0.45;' : '';
  return `<div id="class-lv-${lv}" style="display:flex;align-items:center;gap:8px;margin:${lv === 1 ? '6' : '16'}px 0 8px;${dimStyle}">
    <div style="font-size:13px;font-weight:700;color:${lvColor};white-space:nowrap;">${lv}레벨</div>
    <div style="flex:1;height:1px;background:var(--border);"></div>
  </div>`;
}

// ── 클래스 특성 블록 카드 (표준 아코디언 박스 + 아이콘) ──
// collapsible=true: 재주/특성 카탈로그(PF2eFeat)에서 아이콘·설명을 해소해 클릭-펼침 아코디언으로.
//   contentFn이 빈 본문을 반환하면 카탈로그 desc로 자동 보강(FVTT 클래스 특성은 name만 옴).
// collapsible=false(기본): 인터랙티브 콘텐츠(기술 숙련 드롭다운 등) — 항상 펼침.
function _classFeatureBlock(icon, nameKo, nameEn, contentFn, isSub, collapsible) {
  const subTag = isSub ? `<span class="cfb-subtag">서브클래스</span>` : '';
  // 아이콘/설명 해소: FVTT 재주 카탈로그 우선 → 레거시 getFeat
  let fo = null;
  if (typeof PF2eFeat !== 'undefined' && PF2eFeat.ready && PF2eFeat.ready()) fo = PF2eFeat.getFeatLegacy(nameEn) || PF2eFeat.getFeatLegacy(nameKo);
  if (!fo && typeof getFeat === 'function') fo = getFeat(nameEn) || getFeat(nameKo);
  const iconHtml = (fo && typeof iconImg === 'function' && iconImg('feat', fo, 'cfb-ic')) || `<span class="cfb-emoji">${icon}</span>`;

  let body = contentFn ? contentFn() : '';
  const _stripEmpty = h => !h || !String(h).replace(/<[^>]*>/g, '').trim();
  if (collapsible && _stripEmpty(body) && fo) {
    const d = fo.desc || fo.summary || '';
    body = d ? `<div class="cfb-desc">${typeof resolveDescRefs === 'function' ? resolveDescRefs(d) : d}</div>` : '';
  }
  const hasBody = !_stripEmpty(body);

  if (collapsible) {
    return `<div class="cfb-card">
      <div class="cfb-head${hasBody ? ' cfb-clickable' : ''}"${hasBody ? ' onclick="_toggleClassFeatInline(this)"' : ''}>
        <span class="cfb-icon">${iconHtml}</span>
        <span class="cfb-name">${nameKo} <span class="cfb-en">${nameEn}</span></span>${subTag}
        ${hasBody ? '<span class="cfb-chev">▾</span>' : ''}
      </div>
      ${hasBody ? `<div class="cfb-body">${body}</div>` : ''}
    </div>`;
  }
  // 비접이식: 인터랙티브 콘텐츠 — 항상 펼침
  return `<div class="cfb-card">
    <div class="cfb-head cfb-static"><span class="cfb-icon">${iconHtml}</span><span class="cfb-name">${nameKo} <span class="cfb-en">${nameEn}</span></span>${subTag}</div>
    <div class="cfb-body cfb-open">${body}</div>
  </div>`;
}

// 아코디언 토글 (한 카드씩 독립 — 주문/장비 인라인과 동일 언어)
function _toggleClassFeatInline(headEl) {
  const card = headEl.closest('.cfb-card'); if (!card) return;
  const body = card.querySelector('.cfb-body'); if (!body) return;
  const willOpen = !body.classList.contains('cfb-open');
  body.classList.toggle('cfb-open', willOpen);
  headEl.classList.toggle('cfb-head-open', willOpen);
}

// 서브클래스 부여 항목(재주/주문/특성) 공용 아코디언 카드
function _subFeatCard(scope, item, nameKo, nameEn, badge, descHtml) {
  const ic = (item && typeof iconImg === 'function' && iconImg(scope, item, 'cfb-ic')) || `<span class="cfb-emoji">${scope === 'spell' ? '✨' : '🎖'}</span>`;
  const hasBody = descHtml && String(descHtml).replace(/<[^>]*>/g, '').trim();
  return `<div class="cfb-card">
    <div class="cfb-head${hasBody ? ' cfb-clickable' : ''}"${hasBody ? ' onclick="_toggleClassFeatInline(this)"' : ''}>
      <span class="cfb-icon">${ic}</span>
      <span class="cfb-name">${nameKo} <span class="cfb-en">${nameEn || ''}</span></span>
      ${badge ? `<span class="cfb-subtag">${badge}</span>` : ''}
      ${hasBody ? '<span class="cfb-chev">▾</span>' : ''}
    </div>
    ${hasBody ? `<div class="cfb-body">${descHtml}</div>` : ''}
  </div>`;
}

// ── 서브클래스 변경 시 레벨별 UI 전체 갱신 ──
function _refreshClassFeaturesPreview() {
  const container = document.getElementById('class-level-ui');
  if (!container || !_modalChoices || _modalChoices.type !== 'class') return;
  const cls = typeof modalSelected !== 'undefined' ? modalSelected : null;
  if (!cls) return;
  // 전체 UI를 다시 빌드하면 _modalChoices가 초기화되므로
  // 서브클래스 변경 시에는 클래스 특성 부분만 갱신
  // → 레벨 2+ 섹션을 다시 렌더링
  const maxLv = getLevel();
  const classFeats = typeof CLASS_FEATURE_NAMES !== 'undefined' ? (CLASS_FEATURE_NAMES[cls.id] || []).filter(f => f.lv <= maxLv) : [];
  // 이 클래스 소속 서브클래스만 (타 클래스 잔류분 무시)
  const _stSub = (state.selectedSubclass && state.selectedSubclass.class_id === cls.id) ? state.selectedSubclass.id : null;
  const subId = _modalChoices?.doctrine || _modalChoices?.subclass || _stSub;
  const subFeats = (subId && (!SUBCLASS_DB.find(s => s.id === subId) || SUBCLASS_DB.find(s => s.id === subId).class_id === cls.id))
    ? (SUBCLASS_DB.find(s => s.id === subId)?.features || []).filter(f => f.lv <= maxLv) : [];

  // 1레벨 클래스 특성 + 2레벨 이상 전체를 다시 생성
  const allFeats = [...classFeats, ...subFeats].sort((a, b) => a.lv - b.lv || a.name_ko.localeCompare(b.name_ko));
  const featsByLv = {};
  allFeats.forEach(f => { (featsByLv[f.lv] = featsByLv[f.lv] || []).push(f); });

  // 발전 표 갱신 (레벨 변경 시 미래 레벨 시각 구분 반영)
  const progTable = document.getElementById('class-progression-table');
  if (progTable && cls) {
    progTable.outerHTML = _buildClassProgressionTable(cls);
  }

  // 기존 동적 블록 제거 (class-feat-dynamic 클래스)
  container.querySelectorAll('.cfp-dynamic').forEach(el => el.remove());

  // 1레벨 클래스 특성 블록 추가 (서브클래스 특성은 서브클래스 블록 안에 표시하므로 제외)
  const lv1Feats = (featsByLv[1] || []).filter(f => !subFeats.includes(f) || f.lv !== 1);
  let lv1Html = '';
  lv1Feats.forEach(f => {
    lv1Html += `<div class="cfp-dynamic">${_classFeatureBlock('⚡', f.name_ko, f.name_en, () => {
      return f.desc ? `<div class="cfb-desc">${resolveDescRefs(f.desc)}</div>` : '';
    }, false, true)}</div>`;
  });

  // 2레벨 이상 블록
  let otherHtml = '';
  Object.keys(featsByLv).map(Number).filter(lv => lv > 1).sort((a, b) => a - b).forEach(lv => {
    otherHtml += `<div class="cfp-dynamic">${_classLevelHeader(lv)}`;
    featsByLv[lv].forEach(f => {
      const isSub = subFeats.includes(f);
      otherHtml += _classFeatureBlock('⚡', f.name_ko, f.name_en, () => {
        return f.desc ? `<div class="cfb-desc">${resolveDescRefs(f.desc)}</div>` : '';
      }, isSub, true);
    });
    otherHtml += `</div>`;
  });

  container.insertAdjacentHTML('beforeend', lv1Html + otherHtml);
}

// ── 서브클래스 특성을 서브클래스 블록 안에 렌더링 (정규화된 SUBCLASS_DB.granted_*) ──
function _renderSubclassFeatsInBlock(subId, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (!subId) { container.innerHTML = ''; return; }

  const sub = typeof SUBCLASS_DB !== 'undefined' ? SUBCLASS_DB.find(s => s.id === subId) : null;
  if (!sub) { container.innerHTML = ''; return; }

  let html = '';
  const _cs = 'margin-top:8px;padding:8px;background:var(--bg3);border-radius:4px;border-left:2px solid var(--accent);';
  const _badge = 'font-size:9px;color:var(--accent);background:var(--bg4);padding:1px 5px;border-radius:3px;';
  const shownNames = new Set();
  const shownKoNames = new Set();
  const skillNameById = {};
  if (typeof SKILLS !== 'undefined') SKILLS.forEach(s => { skillNameById[s.id] = s.name; });

  // ── 1) 기술 숙련 ──
  if (Array.isArray(sub.granted_skills) && sub.granted_skills.length) {
    html += `<div style="${_cs}">`;
    html += `<div style="font-size:11px;font-weight:600;color:var(--accent);margin-bottom:4px;">📖 기술 숙련</div>`;
    sub.granted_skills.forEach(sid => {
      const ko = skillNameById[sid] || sid;
      html += `<div style="margin-bottom:4px;"><select disabled style="${_selStyle}opacity:0.6;"><option>${ko}</option></select></div>`;
    });
    html += `</div>`;
  }

  // ── 2) 자동 부여 재주 (lv=1만 모달 표시) ──
  const autoFeats = getSubclassAutoFeats(sub).filter(f => f.lv === 1);
  autoFeats.forEach(af => {
    shownNames.add(af.name_en);
    if (af.name_ko) shownKoNames.add(af.name_ko);
    let feat = (typeof PF2eFeat !== 'undefined' && PF2eFeat.ready && PF2eFeat.ready()) ? (PF2eFeat.getFeatLegacy(af.name_en) || PF2eFeat.getFeatLegacy(af.name_ko)) : null;
    if (!feat) feat = getFeat(af.name_en) || getFeat(af.name_ko);
    const descHtml = (feat?.desc || feat?.summary)
      ? resolveDescRefs(feat.desc || feat.summary)
      : `<div style="font-size:10px;color:var(--text2);font-style:italic;">Player Core 2 재주 — 상세 설명 미등록</div>`;
    html += _subFeatCard('feat', feat || { name_en: af.name_en, name_ko: af.name_ko }, af.name_ko, af.name_en, '재주', descHtml);
  });

  // ── 3) 자동 부여 주문 ──
  const autoSpells = getSubclassAutoSpells(sub).filter(s => s.lv === 1);
  autoSpells.forEach(sp => {
    shownNames.add(sp.name_en);
    shownKoNames.add(sp.name_ko);
    const spellData = getSpell(sp.name_en) || getSpell(sp.name_ko);
    const typeLabel = sp.type === 'focus' ? '집중 주문' : sp.type === 'cantrip' ? '캔트립' : `${sp.rank || 1}랭크 주문`;
    const descHtml = spellData ? resolveDescRefs(spellData.desc || spellData.summary || '') : '';
    html += _subFeatCard('spell', spellData || { name_ko: sp.name_ko, name_en: sp.name_en }, sp.name_ko, sp.name_en, typeLabel, descHtml);
  });

  // ── 4) 서브클래스 특성 (재주/주문과 중복되지 않는 것만) ──
  (sub.features || []).filter(f => f.lv === 1).forEach(f => {
    if (shownNames.has(f.name_en)) return;
    for (const ko of shownKoNames) { if (ko && f.name_ko.includes(ko)) return; }
    let fo = (typeof PF2eFeat !== 'undefined' && PF2eFeat.ready && PF2eFeat.ready()) ? (PF2eFeat.getFeatLegacy(f.name_en) || PF2eFeat.getFeatLegacy(f.name_ko)) : null;
    if (!fo && typeof getFeat === 'function') fo = getFeat(f.name_en) || getFeat(f.name_ko);
    const descHtml = resolveDescRefs(f.desc || (fo && (fo.desc || fo.summary)) || '');
    html += _subFeatCard('feat', fo || { name_en: f.name_en, name_ko: f.name_ko }, f.name_ko, f.name_en, '', descHtml);
  });

  container.innerHTML = html;
}

// ── 빌더에서 클래스 특성 클릭 시 → 클래스 모달 열기 + 스크롤 ──
function openClassModalAtLevel(targetLv) {
  if (!state.selectedClass) return;
  openModal('class');
  // 현재 클래스를 자동 선택 (FVTT 카탈로그)
  const cls = (typeof PF2eClass !== 'undefined' && PF2eClass.getClassLegacy) ? PF2eClass.getClassLegacy(state.selectedClass.id) : null;
  if (!cls) return;
  modalSelected = cls;
  showItemDetail(cls);
  // detail-open 활성화 (모바일 포함)
  const body = document.getElementById('modal-body');
  if (body) body.classList.add('detail-open');
  // 스크롤: 약간의 지연 후 해당 레벨로 이동
  setTimeout(() => {
    const target = document.getElementById('class-lv-' + targetLv);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

// ── 클레릭 전용 UI: 교리 + 신격 + 신성 원천 ──
function _buildClericChoicesUI() {
  // ── 이전 선택값 복원 ──
  const _savedDoc = state.selectedSubclass?.id || '';
  const _savedDeity = state.deity || '';
  const _savedSanct = state.sanctification || '';
  const _savedFont = state.divineFont || '';
  _modalChoices.doctrine = state.selectedClass?.id === 'cleric' ? _savedDoc : '';
  _modalChoices.deity = state.selectedClass?.id === 'cleric' ? _savedDeity : '';
  _modalChoices.divineFont = state.selectedClass?.id === 'cleric' ? _savedFont : '';

  // 교리
  const doctrines = typeof SUBCLASS_DB !== 'undefined' ? SUBCLASS_DB.filter(s => s.class_id === 'cleric') : [];
  let html = `<div style="border:1px solid var(--border);border-radius:6px;padding:10px;margin-top:8px;">
    <div style="font-size:11px;font-weight:600;color:var(--accent);margin-bottom:8px;">📿 교리 Doctrine</div>
    <select id="cls-doctrine" onchange="_onClericDoctrineChange(this.value)" style="${_selStyle}">
      <option value="">— 선택 —</option>
      ${doctrines.map(d => `<option value="${d.id}"${d.id === _savedDoc ? ' selected' : ''}>${d.name_ko} (${d.name_en})</option>`).join('')}
    </select>
    <div id="cls-doctrine-info" style="font-size:10px;color:var(--text2);margin-top:4px;line-height:1.5;"></div>
    <div id="cls-doctrine-feats"></div>
  </div>`;

  // 신격 (성별화 포함)
  const deities = _allDeities();
  _modalChoices.sanctification = state.selectedClass?.id === 'cleric' ? _savedSanct : '';
  html += `<div style="border:1px solid var(--border);border-radius:6px;padding:10px;margin-top:8px;">
    <div style="font-size:11px;font-weight:600;color:var(--accent);margin-bottom:8px;">🙏 신격 Deity</div>
    <select id="cls-deity" onchange="_onClericDeityChange(this.value)" style="${_selStyle}">
      <option value="">— 선택 —</option>
      ${deities.map(d => `<option value="${d.id}"${d.id === _savedDeity ? ' selected' : ''}>${d.name_ko} (${d.name_en})</option>`).join('')}
    </select>
    <div id="cls-deity-info" style="font-size:10px;color:var(--text2);margin-top:4px;line-height:1.5;"></div>
    <div id="cls-deity-details"></div>
    <div id="cls-sanct-block" style="margin-top:8px;display:none;">
      <div style="font-size:10px;color:var(--text2);margin-bottom:2px;">✨ 성별화 Sanctification</div>
      <select id="cls-sanct" onchange="_modalChoices.sanctification=this.value;_validateInitialChoices()" style="${_selStyle}">
      </select>
    </div>
  </div>`;

  // 신성 원천
  html += `<div style="border:1px solid var(--border);border-radius:6px;padding:10px;margin-top:8px;">
    <div style="font-size:11px;font-weight:600;color:var(--accent);margin-bottom:8px;">⛲ 신성 원천 Divine Font</div>
    <select id="cls-font" onchange="_onClericFontChange(this.value)" style="${_selStyle}">
      <option value="">— 선택 —</option>
      <option value="heal"${_savedFont === 'heal' ? ' selected' : ''}>치유 (Heal)</option>
      <option value="harm"${_savedFont === 'harm' ? ' selected' : ''}>해악 (Harm)</option>
    </select>
    <div id="cls-font-info" style="font-size:10px;color:var(--text2);margin-top:4px;line-height:1.5;"></div>
  </div>`;

  return html;
}

function _onClericDoctrineChange(id) {
  _modalChoices.doctrine = id;
  const info = document.getElementById('cls-doctrine-info');
  if (info) {
    const sub = typeof SUBCLASS_DB !== 'undefined' ? SUBCLASS_DB.find(s => s.id === id) : null;
    info.innerHTML = sub ? `<div style="margin-top:4px;padding:6px 8px;background:var(--bg4);border-radius:4px;border-left:2px solid var(--accent);line-height:1.6;">${sub.desc || ''}</div>` : '';
  }
  _renderSubclassFeatsInBlock(id, 'cls-doctrine-feats');
  _refreshClassFeaturesPreview();
  _validateInitialChoices();
}

function _onClericDeityChange(id) {
  _modalChoices.deity = id;
  const info = document.getElementById('cls-deity-info');
  const sanctBlock = document.getElementById('cls-sanct-block');
  const sanctSel = document.getElementById('cls-sanct');
  const d = _getDeity(id);

  if (info) {
    if (d) {
      const skillMap = {society:'사회',deception:'기만',athletics:'운동',acrobatics:'곡예',survival:'생존',
        intimidation:'위협',medicine:'의학',arcana:'주문학',stealth:'은신',crafting:'제작',
        nature:'자연학',religion:'종교학',occultism:'오컬티즘',diplomacy:'외교',performance:'공연',thievery:'도둑질'};
      info.innerHTML = `<div style="margin-top:4px;padding:6px 8px;background:var(--bg4);border-radius:4px;border-left:2px solid var(--accent);line-height:1.6;">
        ${d.title ? `<div style="color:var(--accent);font-style:italic;margin-bottom:4px;">${d.title}</div>` : ''}
        <div><strong>영역:</strong> ${(d.domains_ko&&d.domains_ko.length?d.domains_ko:(d.domains||[])).join(', ')||'—'}</div>
        ${d.desc ? `<div style="margin-top:4px;">${d.desc}</div>` : ''}
      </div>`;
    } else {
      info.innerHTML = '';
    }
  }
  // 신격 기술 / 선호 무기 비활성 드롭다운
  const detailsEl = document.getElementById('cls-deity-details');
  if (detailsEl) {
    if (d) {
      const skillMap = {society:'사회',deception:'기만',athletics:'운동',acrobatics:'곡예',survival:'생존',
        intimidation:'위협',medicine:'의학',arcana:'주문학',stealth:'은신',crafting:'제작',
        nature:'자연학',religion:'종교학',occultism:'오컬티즘',diplomacy:'외교',performance:'공연',thievery:'도둑질'};
      const skillName = d.skill_ko || skillMap[d.skill] || d.skill;
      detailsEl.innerHTML = `
        <div style="margin-top:8px;">
          <div style="font-size:10px;color:var(--text2);margin-bottom:2px;">📖 신격 기술</div>
          <select disabled style="${_selStyle}opacity:0.6;"><option>${skillName}</option></select>
        </div>
        <div style="margin-top:6px;">
          <div style="font-size:10px;color:var(--text2);margin-bottom:2px;">⚔ 선호 무기</div>
          <select disabled style="${_selStyle}opacity:0.6;"><option>${(typeof getWeapon==='function'&&getWeapon(d.weapon)?.name_ko)||d.weapon}</option></select>
        </div>`;
    } else {
      detailsEl.innerHTML = '';
    }
  }

  // 성별화 블록 동적 업데이트
  if (sanctBlock && sanctSel) {
    const opts = d ? (d.sanctification || []) : [];
    if (opts.length === 0) {
      sanctBlock.style.display = 'none';
      _modalChoices.sanctification = '';
    } else if (opts.length === 1) {
      // 선택지 1개: 자동 선택 (disabled)
      sanctBlock.style.display = '';
      const label = opts[0] === 'holy' ? '신성 (Holy)' : '불경 (Unholy)';
      sanctSel.innerHTML = `<option value="${opts[0]}">${label}</option>`;
      sanctSel.disabled = true;
      sanctSel.style.opacity = '0.6';
      _modalChoices.sanctification = opts[0];
    } else {
      // 선택지 2개: 유저 선택
      sanctBlock.style.display = '';
      sanctSel.innerHTML = `<option value="">— 선택 —</option>` +
        opts.map(o => `<option value="${o}">${o==='holy'?'신성 (Holy)':'불경 (Unholy)'}</option>`).join('');
      sanctSel.disabled = false;
      sanctSel.style.opacity = '';
      _modalChoices.sanctification = '';
    }
  }
  _validateInitialChoices();
}

function _onClericFontChange(val) {
  _modalChoices.divineFont = val;
  const info = document.getElementById('cls-font-info');
  if (info) {
    if (!val) { info.innerHTML = ''; _validateInitialChoices(); return; }
    // 신성 원천 기능 설명
    const cfDesc = (typeof CLASS_FEATURE_NAMES !== 'undefined' && CLASS_FEATURE_NAMES.cleric)
      ? (CLASS_FEATURE_NAMES.cleric.find(f => f.id === 'divine-font') || {}).desc || '' : '';
    // 주문 정보 — val(heal/harm)이 곧 정본 slug
    const spell = getSpell(val);
    let spellHtml = '';
    if (spell) {
      spellHtml = `<div style="margin-top:6px;padding:6px 8px;background:var(--bg3);border-radius:4px;border-left:2px solid var(--accent);">
        <div style="font-weight:600;">${spell.name_ko} <span style="color:var(--text2);font-weight:400;">${spell.name_en}</span></div>
        <div style="margin-top:4px;">${spell.desc || spell.summary || ''}</div>
      </div>`;
    }
    info.innerHTML = `<div style="margin-top:4px;padding:6px 8px;background:var(--bg4);border-radius:4px;border-left:2px solid var(--accent);line-height:1.6;">
      ${cfDesc}
    </div>${spellHtml}`;
  }
  _validateInitialChoices();
}

// ── 범용 서브클래스 선택 UI (클레릭 제외) ──
function _buildSubclassChoiceUI(classId, label, subs) {
  // ⚠ 현재 선택된 서브클래스가 '이 클래스(subs)' 소속일 때만 복원 — 타 클래스 서브클래스가
  //    잔류해 _restoreInitialChoicesUI가 엉뚱한 특성(예: 클레릭 영역 입문)을 렌더하던 버그 방지
  const _curSub = state.selectedSubclass?.id || '';
  const _savedSub = subs.some(s => s.id === _curSub) ? _curSub : '';
  _modalChoices.subclass = _savedSub;
  let html = `<div style="border:1px solid var(--border);border-radius:6px;padding:10px;margin-top:8px;">`;
  html += `<div style="font-size:11px;font-weight:600;color:var(--accent);margin-bottom:8px;">⚙ ${label}</div>`;
  html += `<div style="margin-bottom:6px;">
    <select id="cls-subclass" onchange="_onSubclassChange(this.value)" style="${_selStyle}">
      <option value="">— 선택 —</option>
      ${subs.map(s => `<option value="${s.id}"${s.id === _savedSub ? ' selected' : ''}>${s.name_ko} (${s.name_en})</option>`).join('')}
    </select>
    <div id="cls-subclass-info" style="font-size:10px;color:var(--text2);margin-top:4px;line-height:1.5;"></div>
    <div id="cls-subclass-feats"></div>
  </div>`;
  html += `</div>`;
  return html;
}

function _onSubclassChange(id) {
  _modalChoices.subclass = id;
  const info = document.getElementById('cls-subclass-info');
  if (info) {
    const sub = typeof SUBCLASS_DB !== 'undefined' ? SUBCLASS_DB.find(s => s.id === id) : null;
    info.innerHTML = sub ? `<div style="margin-top:4px;padding:6px 8px;background:var(--bg4);border-radius:4px;border-left:2px solid var(--accent);line-height:1.6;">${sub.desc || ''}</div>` : '';
  }
  _renderSubclassFeatsInBlock(id, 'cls-subclass-feats');
  _refreshClassFeaturesPreview();
  _validateInitialChoices();
}

function _buildTrainableSkillRow(index, excludeNames) {
  const allSkills = typeof SKILLS !== 'undefined' ? SKILLS.filter(s => !s.isLore) : [];
  const exclude = new Set((excludeNames || []).map(n => skillNameToId(n)).filter(Boolean));
  // 이미 선택된 기술도 제외
  (_modalChoices.trainableSkills || []).forEach((v, i) => { if (v && i !== index) exclude.add(v); });
  const options = allSkills.filter(s => !exclude.has(s.id)).map(s => ({value: s.id, label: `${s.name} (${s.en})`}));
  const curVal = (_modalChoices.trainableSkills || [])[index] || '';
  return `<div class="trainable-skill-row" data-index="${index}" style="display:flex;gap:4px;align-items:center;margin-bottom:4px;">
    <select onchange="_onTrainableSkillChange(${index}, this.value)" style="${_selStyle}flex:1;">
      <option value="">— 선택 —</option>
      ${options.map(o => `<option value="${o.value}"${o.value === curVal ? ' selected' : ''}>${o.label}</option>`).join('')}
    </select>
    ${index >= (_modalChoices.trainableBase || 0) ? `<button onclick="_removeTrainableSkill(${index})" style="padding:2px 6px;background:none;border:1px solid var(--red);border-radius:4px;color:var(--red);cursor:pointer;font-size:11px;">✕</button>` : ''}
  </div>`;
}

function _onTrainableSkillChange(index, value) {
  if (!_modalChoices.trainableSkills) _modalChoices.trainableSkills = [];
  _modalChoices.trainableSkills[index] = value || '';
  // 다른 드롭다운 옵션 갱신 (이미 선택된 기술 제외)
  _rebuildTrainableSkillDropdowns();
  _validateInitialChoices();
}

function _addTrainableSkill() {
  if (!_modalChoices.trainableSkills) _modalChoices.trainableSkills = [];
  _modalChoices.trainableSkills.push('');
  _rebuildTrainableSkillDropdowns();
  _validateInitialChoices();
}

function _removeTrainableSkill(index) {
  if (!_modalChoices.trainableSkills) return;
  _modalChoices.trainableSkills.splice(index, 1);
  _rebuildTrainableSkillDropdowns();
  _validateInitialChoices();
}

function _rebuildTrainableSkillDropdowns() {
  const container = document.getElementById('class-trainable-skills');
  if (!container) return;
  const excludeNames = _modalChoices.fixedSkills || [];
  let html = '';
  (_modalChoices.trainableSkills || []).forEach((v, i) => {
    html += _buildTrainableSkillRow(i, excludeNames);
  });
  container.innerHTML = html;
}

// ── 배경 모달: 기술 + 재주 ──
function _buildBackgroundChoicesUI(bg) {
  const beff = (typeof getBackgroundEffects === 'function') ? getBackgroundEffects(bg) : {};
  const _savedBgChoice = (state.selectedBackground?.id === bg.id) ? (state.initialChoices?.background?.choiceSkill || null) : null;
  const _savedBgLore = (state.selectedBackground?.id === bg.id) ? (state.initialChoices?.background?.choiceLore || '') : '';
  _modalChoices = { type: 'background', skills: {}, choiceSkill: _savedBgChoice, loreName: '', choiceLore: _savedBgLore };

  let html = `<div style="border:1px solid var(--border);border-radius:6px;padding:10px;margin-top:6px;">`;
  html += `<div style="font-size:11px;font-weight:600;color:var(--accent);margin-bottom:8px;">📋 배경 혜택</div>`;
  // 능력치 부스트 표시
  const bgBoostKo = [
    ...(beff.boosts || []).map(k => ATTR_KO[k]),
    ...(beff.boost_choices || []).map(g => g.map(k => ATTR_KO[k]).join(' 또는 ')),
    ...Array(beff.free_boosts || 0).fill('자유'),
  ].join(', ') || '—';
  html += `<div style="font-size:11px;color:var(--text2);margin-bottom:6px;"><strong>능력치 부스트:</strong> ${bgBoostKo}</div>`;

  // 고정 기술
  (beff.fixed_skills || []).forEach(id => {
    const skill = (typeof SKILLS !== 'undefined') ? SKILLS.find(s => s.id === id) : null;
    const label = skill ? skill.name : id;
    html += _choiceDropdown('', `기술`, [{value: id, label}], true, id);
  });

  // 선택 기술 그룹 (그룹당 1택)
  let hasChoice = false;
  (beff.choice_skill_groups || []).forEach((group, gi) => {
    hasChoice = true;
    const options = group.map(id => {
      const skill = (typeof SKILLS !== 'undefined') ? SKILLS.find(s => s.id === id) : null;
      return { value: id, label: skill ? skill.name : id };
    });
    html += `<div style="margin-bottom:6px;">
      <div style="font-size:10px;color:var(--text2);margin-bottom:2px;">기술 (선택)</div>
      <select id="bg-choice-skill${gi||''}" onchange="_modalChoices.choiceSkill=this.value;_validateInitialChoices()" style="${_selStyle}">
        <option value="">— 선택 —</option>
        ${options.map(o => `<option value="${o.value}"${o.value === _savedBgChoice ? ' selected' : ''}>${o.label}</option>`).join('')}
      </select>
    </div>`;
  });
  _modalChoices.hasChoiceSkill = hasChoice;

  // 고정 지식 (lore) — 한국어 그대로
  (beff.fixed_lores || []).forEach(loreName => {
    _modalChoices.loreName = loreName;
    const _loreKo = (typeof getLoreKo === 'function') ? getLoreKo(loreName) : loreName;
    html += _choiceDropdown('', `지식 기술`, [{value: loreName, label: _loreKo + ' 지식'}], true, loreName);
  });

  // 원하는 지식 (선택) — 사용자가 분야명 지정(추가 지식과 동일). 미입력 허용(시트에서 나중에 입력 가능).
  if (beff.choice_lore) {
    const _curLore = (_modalChoices.choiceLore || '').replace(/"/g, '&quot;');
    html += `<div style="margin-bottom:6px;">
      <div style="font-size:10px;color:var(--text2);margin-bottom:2px;">지식 기술 (원하는 분야 1개)</div>
      <input type="text" id="bg-choice-lore" value="${_curLore}" placeholder="예: 소문 지식" maxlength="30"
        oninput="_modalChoices.choiceLore=this.value" style="${_selStyle}">
    </div>`;
  }

  // 신격 기술/지식 마커 (raised-by-belief)
  if (beff.deity_skill || beff.deity_lore) {
    html += `<div style="font-size:10px;color:var(--text2);margin:4px 0;">※ 신격 선택 후 자동 부여 (신격 기술${beff.deity_lore ? ' + 신격 지식' : ''})</div>`;
  }

  // 기술 재주 — 클래스/서브클래스 자동재주와 동일한 표준 카드(_subFeatCard, 아이콘 포함)
  if (beff.feat_id) {
    const fd = getFeat(beff.feat_id);
    const descHtml = fd
      ? resolveDescRefs((fd.desc || fd.summary || '').replace(/<strong>전제조건:<\/strong>[^<]*<br>/i, ''))
      : `<div style="font-size:10px;color:var(--text2);font-style:italic;">※ 카탈로그 미등재 (${beff.feat_id})</div>`;
    html += `<div style="margin-top:4px;">`;
    html += `<div style="font-size:10px;color:var(--text2);margin-bottom:2px;">기술 재주</div>`;
    html += _subFeatCard('feat', fd || { id: beff.feat_id }, fd ? fd.name_ko : beff.feat_id, fd ? fd.name_en : '', '재주', descHtml);
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}

// ── 혈통 모달: 언어 선택 ──
function _buildAncestryChoicesUI(anc) {
  const fixedLangs = anc.languages || ['common'];
  // PF2e Remaster 룰: 인간 1 + INT, 나머지 INT만 (v528~ ANCESTRIES.bonusLangs 데이터 사용)
  const bonusBase = anc.bonusLangs ?? 0;
  _modalChoices = { type: 'ancestry', fixedLangs, bonusBase, bonusLangs: Array(bonusBase).fill('') };

  // ── 이전 선택값 복원: state.languages에서 고정 언어를 제외한 나머지가 보너스 언어 ──
  if (state.selectedAncestry?.id === anc.id && state.languages?.length) {
    const fixedSet = new Set(fixedLangs);
    const savedBonus = state.languages.filter(l => !fixedSet.has(l));
    for (let i = 0; i < savedBonus.length; i++) {
      if (i < _modalChoices.bonusLangs.length) {
        _modalChoices.bonusLangs[i] = savedBonus[i];
      } else {
        _modalChoices.bonusLangs.push(savedBonus[i]);
      }
    }
  }

  let html = `<div style="border:1px solid var(--border);border-radius:6px;padding:10px;margin-top:6px;">`;
  html += `<div style="font-size:11px;font-weight:600;color:var(--accent);margin-bottom:8px;">🗣 언어</div>`;

  // 고정 언어 (disabled) — id로 저장, 라벨은 한글 표시
  fixedLangs.forEach(langId => {
    const ko = (typeof getLanguageKo === 'function') ? getLanguageKo(langId) : langId;
    html += _choiceDropdown('', `기본 언어`, [{value: langId, label: ko}], true, langId);
  });

  // 추가 언어 (active + "+" 버튼)
  const bonusLabel = bonusBase > 0
    ? `추가 언어 (기본 ${bonusBase}개 + INT 수정치, + 버튼으로 추가)`
    : `추가 언어 (INT 수정치만큼, + 버튼으로 추가)`;
  html += `<div style="font-size:10px;color:var(--text2);margin:8px 0 4px;">${bonusLabel}</div>`;
  html += `<div id="anc-bonus-langs">`;
  const bonusCount = Math.max(bonusBase, _modalChoices.bonusLangs.length);
  for (let i = 0; i < bonusCount; i++) {
    html += _buildBonusLangRow(i, fixedLangs);
  }
  html += `</div>`;
  html += `<div style="text-align:center;margin-top:4px;">
    <button onclick="_addBonusLang()" style="padding:4px 16px;background:var(--bg3);border:1px solid var(--border);border-radius:4px;color:var(--accent);cursor:pointer;font-size:12px;">＋ 추가</button>
    <span style="font-size:10px;color:var(--text2);margin-left:6px;">INT 수정치만큼 추가 가능</span>
  </div>`;

  // 시야/크기/속도 정보 표시
  html += `<div style="margin-top:10px;font-size:11px;color:var(--text2);line-height:1.7;">`;
  html += `<div><strong>크기:</strong> ${anc.size} | <strong>속도:</strong> ${anc.speed}피트</div>`;
  html += `<div><strong>감각:</strong> ${VISION_KO[anc.vision] || anc.vision || '없음'}</div>`;
  html += `</div>`;

  html += `</div>`;
  return html;
}

function _buildBonusLangRow(index, excludeLangs) {
  const allLangs = typeof LANGUAGES !== 'undefined' ? LANGUAGES : [];
  const exclude = new Set(excludeLangs || []);  // id 배열
  (_modalChoices.bonusLangs || []).forEach((v, i) => { if (v && i !== index) exclude.add(v); });
  const options = allLangs.filter(l => !exclude.has(l.id)).map(l => ({value: l.id, label: l.name_ko}));
  const curVal = (_modalChoices.bonusLangs || [])[index] || '';
  return `<div style="display:flex;gap:4px;align-items:center;margin-bottom:4px;">
    <select onchange="_onBonusLangChange(${index}, this.value)" style="${_selStyle}flex:1;">
      <option value="">— 선택 —</option>
      ${options.map(o => `<option value="${o.value}"${o.value === curVal ? ' selected' : ''}>${o.label}</option>`).join('')}
    </select>
    ${index >= (_modalChoices.bonusBase || 0) ? `<button onclick="_removeBonusLang(${index})" style="padding:2px 6px;background:none;border:1px solid var(--red);border-radius:4px;color:var(--red);cursor:pointer;font-size:11px;">✕</button>` : ''}
  </div>`;
}

function _onBonusLangChange(index, value) {
  if (!_modalChoices.bonusLangs) _modalChoices.bonusLangs = [];
  _modalChoices.bonusLangs[index] = value || '';
  _rebuildBonusLangDropdowns();
  _validateInitialChoices();
}

function _addBonusLang() {
  if (!_modalChoices.bonusLangs) _modalChoices.bonusLangs = [];
  _modalChoices.bonusLangs.push('');
  _rebuildBonusLangDropdowns();
  _validateInitialChoices();
}

function _removeBonusLang(index) {
  if (!_modalChoices.bonusLangs) return;
  _modalChoices.bonusLangs.splice(index, 1);
  _rebuildBonusLangDropdowns();
  _validateInitialChoices();
}

function _rebuildBonusLangDropdowns() {
  const container = document.getElementById('anc-bonus-langs');
  if (!container) return;
  let html = '';
  (_modalChoices.bonusLangs || []).forEach((v, i) => {
    html += _buildBonusLangRow(i, _modalChoices.fixedLangs || []);
  });
  container.innerHTML = html;
}

// ── DOM 삽입 후 이전 선택값의 정보 패널 복원 ──
function _restoreInitialChoicesUI() {
  // 클레릭: 교리/신격/신성원천 정보 패널 트리거
  if (_modalChoices.doctrine) {
    _onClericDoctrineChange(_modalChoices.doctrine);
  }
  if (_modalChoices.deity) {
    // _onClericDeityChange가 sanctification을 리셋하므로 미리 보존
    const savedSanct = _modalChoices.sanctification || '';
    _onClericDeityChange(_modalChoices.deity);
    // 성별화 값 복원 (2개 선택지인 경우 리셋되므로)
    if (savedSanct) {
      _modalChoices.sanctification = savedSanct;
      const sanctEl = document.getElementById('cls-sanct');
      if (sanctEl) sanctEl.value = savedSanct;
    }
  }
  if (_modalChoices.divineFont) {
    _onClericFontChange(_modalChoices.divineFont);
  }
  // 범용 서브클래스 정보 패널 트리거
  if (_modalChoices.subclass) {
    _onSubclassChange(_modalChoices.subclass);
  }
  _validateInitialChoices();
}

// ── 공통: 유효성 검증 + 확인 버튼 활성화 ──
function _onInitialChoiceChange() { _validateInitialChoices(); }

function _validateInitialChoices() {
  // ⚠ 확정 버튼은 뷰(데스크톱 상세패널 / 모바일 아코디언)마다 렌더돼 같은 id가 여럿 존재할 수 있음.
  //   getElementById는 첫 매치만 잡아 안 보이는 버튼만 갱신 → 실제 보이는 버튼이 disabled로 남음(모바일 스틱 버그).
  //   → 모든 [id="modal-confirm-choice"]를 갱신한다.
  const btns = document.querySelectorAll('[id="modal-confirm-choice"]');
  if (!btns.length) return;
  let valid = true;

  if (_modalChoices.type === 'class') {
    const skills = _modalChoices.trainableSkills || [];
    // 모든 드롭다운이 선택되어야 함
    if (skills.some(v => !v)) valid = false;
    // 최소 base 개수
    if (skills.length < (_modalChoices.trainableBase || 0)) valid = false;
    // 선택형 고정 기술 ("또는" 패턴)
    if ((_modalChoices.chosenFixedSkills || []).some(v => !v)) valid = false;
    // 클레릭: 교리/신격/성별화/신성 원천 필수
    if (_modalChoices.doctrine !== undefined && !_modalChoices.doctrine) valid = false;
    if (_modalChoices.deity !== undefined && !_modalChoices.deity) valid = false;
    if (_modalChoices.sanctification !== undefined && !_modalChoices.sanctification) valid = false;
    if (_modalChoices.divineFont !== undefined && !_modalChoices.divineFont) valid = false;
    // 범용 서브클래스
    if (_modalChoices.subclass !== undefined && !_modalChoices.subclass) valid = false;
  } else if (_modalChoices.type === 'background') {
    if (_modalChoices.hasChoiceSkill && !_modalChoices.choiceSkill) valid = false;
  } else if (_modalChoices.type === 'ancestry') {
    const langs = _modalChoices.bonusLangs || [];
    if (langs.some(v => !v)) valid = false;
    if (langs.length < (_modalChoices.bonusBase || 0)) valid = false;
  }

  btns.forEach(btn => {
    if (valid) {
      btn.disabled = false;
      btn.style.background = 'var(--accent)';
      btn.style.color = '#fff';
      btn.style.cursor = 'pointer';
      btn.style.border = 'none';
      btn.textContent = '선택 확정';
    } else {
      btn.disabled = true;
      btn.style.background = 'var(--bg4)';
      btn.style.color = 'var(--text2)';
      btn.style.cursor = 'not-allowed';
      btn.style.border = '1px solid var(--border)';
      btn.textContent = '모든 항목을 선택하세요';
    }
  });
}

//  CASCADE RESET FUNCTIONS
// ═══════════════════════════════════════════════

function resetFromClass() {
  // Reset initialChoices for class
  if (state.initialChoices) delete state.initialChoices.class;
  // Reset all level selections
  state.growth = {};
  // Reset all feats
  state.feats = {special:[], ancestry:[], class:[], general:[], skill:[], archetype:[], other:[]};
  // Reset boosts (class + all level boosts)
  state.boosts.cls = null;
  for (let lv = 1; lv <= 20; lv++) {
    const key = `lv${lv}`;
    if (state.boosts[key]) state.boosts[key] = [];
  }
  // Reset subclass
  state.selectedSubclass = null;
  const subBtn = document.getElementById('btn-subclass');
  if (subBtn) { subBtn.textContent = '서브클래스...'; subBtn.classList.remove('filled'); subBtn.style.display = 'none'; }
  // Reset weapon proficiencies to defaults
  ['simple','martial','advanced','unarmed'].forEach(c => {
    const el = document.getElementById('prof-weapon-'+c);
    if (el) el.value = '0';
  });
  initWeaponProfBadges();
  // Reset armor proficiencies to defaults
  ['light','medium','heavy','unarmored'].forEach(c => {
    const el = document.getElementById('prof-armor-'+c);
    if (el) el.value = '0';
  });
  initArmorProfBadges();
  // Reset save proficiencies
  ['prof-fort','prof-ref','prof-will'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '0';
  });
  const percEl = document.getElementById('prof-perc');
  if (percEl) percEl.value = '0';
  const cdcEl = document.getElementById('prof-classdc');
  if (cdcEl) cdcEl.value = '0';
  const spEl = document.getElementById('prof-spatk');
  if (spEl) spEl.value = '0';
  // Reset skill proficiencies (set all to 0)
  if (typeof SKILLS !== 'undefined') {
    SKILLS.forEach(sk => {
      const el = document.getElementById('sk-prof-' + sk.id);
      if (el) el.value = '0';
    });
  }
  // Reset trainable skill slots
  state.trainableSkillSlots = 0;
  // Reset spells, slots, signature, familiar/prepared
  state.spells = {cantrip:[], known:[], focus:[], innate:[]};
  state.spellSlots = {};
  state.spellSlotsUsed = {};
  state.cantripSlots = 5;
  state.signatureSpells = {};
  state.familiarSpells = null;
  state.preparedSpells = null;
  // Reset spell tradition/type
  const tradEl = document.getElementById('spell-tradition');
  if (tradEl) tradEl.value = '';
  const typeEl = document.getElementById('spell-type');
  if (typeEl) typeEl.value = '';
  renderSpells();
  recalcAll();
  renderFeats();
  renderGrowthPlan();
}

function resetFromAncestry() {
  // Reset initialChoices for ancestry
  if (state.initialChoices) delete state.initialChoices.ancestry;
  // Reset heritage
  state.selectedHeritage = null;
  const herBtn = document.getElementById('btn-heritage');
  if (herBtn) { herBtn.textContent = '유산...'; herBtn.classList.remove('filled'); }
  // Reset ancestry boosts
  state.boosts.ancFixed = [];
  state.boosts.ancFlaw = [];
  state.boosts.ancFree = [];
  // Reset ancestry feats
  state.feats.ancestry = [];
  // Clear ancestry feats from growth
  for (const lv in state.growth) {
    if (state.growth[lv] && state.growth[lv].ancestryFeat) {
      delete state.growth[lv].ancestryFeat;
    }
  }
  // Reset vision/size/speed
  state.vision = 'none';
  state.size = '중형';
  const speedEl = document.getElementById('speed');
  if (speedEl) speedEl.value = 25;
  // 유산 부여 선천적 주문 + 임시 재주 제거
  if (state.spells.innate) state.spells.innate = state.spells.innate.filter(s => !s._heritage);
  if (state.feats.other) state.feats.other = state.feats.other.filter(f => !f._heritageCantrip);
  // Clear languages/traits textarea
  const langEl = document.getElementById('f-languages');
  if (langEl) langEl.value = '';
  recalcAll();
  renderFeats();
  renderGrowthPlan();
}

function resetFromBackground() {
  // Reset initialChoices for background
  if (state.initialChoices) delete state.initialChoices.background;
  // Reset background boosts
  state.boosts.bg = [];
  state.boosts.bgFixed = [];
  state.boosts.bgFree = [];
  // Growth plan 배경 재주 정리
  if (state.growth[1]) delete state.growth[1].bgSkillFeat;
  // 기존 저장 데이터 호환: _fromBackground 없는 배경 재주 제거
  if (state.selectedBackground?.feat) {
    const fn = state.selectedBackground.feat.trim();
    const idx = state.feats.skill.findIndex(f => f.name === fn && f.level === 1 && !f._fromBackground);
    if (idx >= 0) state.feats.skill.splice(idx, 1);
  }
  // 노트 정리
  const notesEl = document.getElementById('f-notes');
  if (notesEl && notesEl.value.startsWith('[배경:')) notesEl.value = '';
  // 기술/지식/재주는 rebuildCoreEffects()가 null 감지 시 자동 정리
  recalcAll();
  renderFeats();
  renderGrowthPlan();
}

function resetFromSubclass() {
  state.selectedSubclass = null;
  const subBtn = document.getElementById('btn-subclass');
  if (subBtn) { subBtn.textContent = '서브클래스...'; subBtn.classList.remove('filled'); }
  applyClassFeatures(); // 내부에서 recalcAll() 호출됨
  renderGrowthPlan();
  save();
}

function clearCoreSelection(type) {
  if (type === 'class') {
    if (state.selectedClass && !confirm('클래스를 변경하면 모든 빌드 선택이 초기화됩니다. 계속하시겠습니까?')) return;
    state.selectedClass = null;
    resetFromClass();
    const btn = document.getElementById('btn-class');
    if (btn) { btn.textContent = '클래스 선택...'; btn.classList.remove('filled'); }
    // 파생 스탯·재주 탭 갱신 — 안 하면 클래스 특성/숙련도 잔상이 남음(예: 메이거스 해제 후에도 특성 잔류)
    recalcAll();
    renderFeats();
    renderGrowthPlan();
    save();
  } else if (type === 'ancestry') {
    if (state.selectedAncestry && !confirm('혈통을 변경하면 혈통 관련 선택이 초기화됩니다. 계속하시겠습니까?')) return;
    state.selectedAncestry = null;
    resetFromAncestry();
    const btn = document.getElementById('btn-ancestry');
    if (btn) { btn.textContent = '혈통 선택...'; btn.classList.remove('filled'); }
    recalcAll();
    renderFeats();
    renderGrowthPlan();
    save();
  } else if (type === 'background') {
    if (state.selectedBackground && !confirm('배경을 변경하면 배경 관련 선택이 초기화됩니다. 계속하시겠습니까?')) return;
    state.selectedBackground = null;
    resetFromBackground();
    const btn = document.getElementById('btn-background');
    if (btn) { btn.textContent = '배경 선택...'; btn.classList.remove('filled'); }
    recalcAll();
    renderFeats();
    renderGrowthPlan();
    save();
  } else if (type === 'heritage') {
    state.selectedHeritage = null;
    // 유산 캔트립 임시 재주 제거 (인터랙티브 모달 관련)
    if (state.feats.other) state.feats.other = state.feats.other.filter(f => !f._heritageCantrip);
    // 나머지(시야/주문/무기/기술/재주/HP)는 rebuildCoreEffects()가 null 감지 시 자동 정리
    const btn = document.getElementById('btn-heritage');
    if (btn) { btn.textContent = '유산...'; btn.classList.remove('filled'); }
    recalcAll();
    renderFeats();
    renderGrowthPlan();
    save();
  } else if (type === 'subclass') {
    resetFromSubclass();
  }
}

function confirmModal() {
  if (modalType === 'skill-multi') { closeModal(); return; }
  if (modalType === 'memorize') {
    // 주문 기억 완료 — 슬롯도 복원
    state.spellSlotsUsed = {};
    renderSpells();
    save();
    closeModal();
    return;
  }
  if (modalType === 'learn-spells') { closeModal(); return; }
  if (!modalSelected) { closeModal(); return; }
  if (modalType==='class') {
    // Cascade reset if changing class
    if (state.selectedClass && state.selectedClass.id !== modalSelected.id) {
      if (!confirm('클래스를 변경하면 모든 빌드 선택이 초기화됩니다. 계속하시겠습니까?')) { closeModal(); return; }
      resetFromClass();
    }
    state.selectedClass = modalSelected;
    const btnC = document.getElementById('btn-class');
    if (btnC) { btnC.textContent = `${modalSelected.name} (${modalSelected.en})`; btnC.classList.add('filled'); }
    applyClassDefaults(modalSelected);
    // 모달 내 기술 선택 반영
    if (_modalChoices.type === 'class') {
      // 선택형 고정 기술(예: "곡예 또는 운동")·추가 기술 숙련 모두 state에만 기록하고 부여는
      //   recalcAll의 출처기반 재파생에 위임(rebuildCoreEffects._classGrantedSkills / applyGrowthSkills).
      //   (구: 여기서 명령형으로 sk-prof를 훈련시켜 같은 클래스 재확정+다른 선택 시 이전 기술 유령 잔존 — v0.134 해소)
      // 추가 기술 숙련 — state.growth에만 기록하고 부여는 recalcAll의 applyGrowthSkills(출처기반)에 위임.
      //   (여기서 명령형으로 sk-prof를 훈련시키면 prevRank base가 오염돼 이후 슬롯 제거 시 유령 잔존)
      const skills = (_modalChoices.trainableSkills || []).filter(v => v);
      state.trainableSkillSlots = skills.length;
      if (!state.growth[1]) state.growth[1] = {};
      state.growth[1].skillTraining = skills;
    }
    // 클레릭: 교리/신격/신성 원천 반영
    if (_modalChoices.doctrine) {
      const sub = typeof SUBCLASS_DB !== 'undefined' ? SUBCLASS_DB.find(s => s.id === _modalChoices.doctrine) : null;
      if (sub) { state.selectedSubclass = sub; const btn = document.getElementById('btn-subclass'); if (btn) { btn.textContent = `${sub.name_ko} (${sub.name_en})`; btn.classList.add('filled'); } }
    }
    if (_modalChoices.deity) {
      state.deity = _modalChoices.deity;
    }
    if (_modalChoices.sanctification) {
      state.sanctification = _modalChoices.sanctification;
    }
    if (_modalChoices.divineFont) {
      state.divineFont = _modalChoices.divineFont;
      state.divineFontUsed = 0;
    }
    // 범용 서브클래스
    if (_modalChoices.subclass) {
      const sub = typeof SUBCLASS_DB !== 'undefined' ? SUBCLASS_DB.find(s => s.id === _modalChoices.subclass) : null;
      if (sub) { state.selectedSubclass = sub; const btn = document.getElementById('btn-subclass'); if (btn) { btn.textContent = `${sub.name_ko} (${sub.name_en})`; btn.classList.add('filled'); } }
    }
    // ── 선택값 영속 저장 ──
    if (!state.initialChoices) state.initialChoices = {};
    state.initialChoices.class = {
      trainableSkills: (_modalChoices.trainableSkills || []).filter(v => v),
      chosenFixedSkills: (_modalChoices.chosenFixedSkills || []).slice(),
    };
    applyClassFeatures();
  } else if (modalType==='ancestry') {
    // Cascade reset if changing ancestry
    if (state.selectedAncestry && state.selectedAncestry.id !== modalSelected.id) {
      if (!confirm('혈통을 변경하면 혈통 관련 선택이 초기화됩니다. 계속하시겠습니까?')) { closeModal(); return; }
      resetFromAncestry();
    }
    state.selectedAncestry = modalSelected;
    const btnA = document.getElementById('btn-ancestry');
    if (btnA) { btnA.textContent = `${modalSelected.name} (${modalSelected.en})`; btnA.classList.add('filled'); }
    applyAncestryDefaults(modalSelected);
    // 모달 내 언어 선택 반영
    if (_modalChoices.type === 'ancestry') {
      const allLangs = [...(_modalChoices.fixedLangs || []), ...(_modalChoices.bonusLangs || []).filter(v => v)];
      if (!state.languages) state.languages = [];
      state.languages = allLangs;
      const langEl = document.getElementById('f-languages');
      if (langEl) {
        const traits = modalSelected.traits ? `특성: ${modalSelected.traits.join(', ')}` : '';
        const size = `크기: ${modalSelected.size || '중형'}`;
        const vision = `감각: ${VISION_KO[modalSelected.vision] || modalSelected.vision || '없음'}`;
        const langLine = `언어: ${allLangs.join(', ')}`;
        const extras = _summarizeAncestryExtras(modalSelected);
        langEl.value = [traits, size, vision, langLine, extras].filter(Boolean).join('\n');
      }
    }
    // ── 선택값 영속 저장 ──
    if (!state.initialChoices) state.initialChoices = {};
    state.initialChoices.ancestry = {
      bonusLangs: (_modalChoices.bonusLangs || []).filter(v => v),
    };
  } else if (modalType==='background') {
    // Cascade reset if changing background
    if (state.selectedBackground && state.selectedBackground.id !== modalSelected.id) {
      if (!confirm('배경을 변경하면 배경 관련 선택이 초기화됩니다. 계속하시겠습니까?')) { closeModal(); return; }
      resetFromBackground();
    }
    state.selectedBackground = modalSelected;
    const btnB = document.getElementById('btn-background');
    if (btnB) { btnB.textContent = `${modalSelected.name} (${modalSelected.en})`; btnB.classList.add('filled'); }
    // 모달 내 선택 기술 반영 (선택형 기술을 bg 객체에 임시 주입)
    if (_modalChoices.type === 'background' && _modalChoices.choiceSkill) {
      // 원래 skills 문자열에서 선택형 부분을 선택된 기술로 교체
      const chosenId = _modalChoices.choiceSkill;
      const sk = SKILLS.find(s => s.id === chosenId);
      const chosenName = sk ? sk.name : chosenId;
      const bgCopy = Object.assign({}, modalSelected);
      bgCopy.skills = (bgCopy.skills || '').replace(/[^,]+(?:또는|\/)[^,]+(?:\s*중 선택)?/, chosenName);
      applyBackgroundInfo(bgCopy);
    } else {
      applyBackgroundInfo(modalSelected);
    }
    // ── 선택값 영속 저장 ──
    if (!state.initialChoices) state.initialChoices = {};
    state.initialChoices.background = {
      choiceSkill: _modalChoices.choiceSkill || null,
      choiceLore: (_modalChoices.choiceLore || '').trim() || null,
    };
  } else if (modalType==='feat') {
    const type = modalContext || 'other';
    const featName = modalSelected.name_ko + (modalSelected.name_en?` (${modalSelected.name_en})`:'');
    const featLevel = modalSelected.feat_level||1;
    // If triggered from growth plan, store in growth state
    if (growthPendingLevel !== null && growthPendingKey !== null) {
      const gLv = growthPendingLevel;
      const gKey = growthPendingKey;
      const gType = growthPendingFeatType;
      if (!state.growth[gLv]) state.growth[gLv] = {};
      // Clear old feat if replacing
      const oldName = state.growth[gLv][gKey];
      if (oldName) {
        const arr = state.feats[gType];
        if (arr) { const _os = featSlug(oldName); const idx = arr.findIndex(f => featSlug(f) === _os && f.level === gLv); if (idx >= 0) arr.splice(idx, 1); }
        // 선천 주문 제거 (slug 기준)
        if (state.spells?.innate) state.spells.innate = state.spells.innate.filter(s => featSlug(s._sourceFeat) !== featSlug(oldName));
        // 연쇄 제거
        if (typeof cascadeRemoveFeats === 'function') cascadeRemoveFeats();
      }
      state.growth[gLv][gKey] = featName;
      const _fdG = getFeat(featName) || getFeat(featName.split(' (')[0].trim());
      const _newFeatG = {id: _fdG?.id || null, name: featName, level: gLv};
      _applyModalFeatChoice(_newFeatG); // 모달 상세에서 입력한 인라인 choice(지식 등) 반영
      state.feats[type].push(_newFeatG);
      growthPendingLevel = null;
      growthPendingKey = null;
      growthPendingFeatType = null;
      // 선택이 필요한 재주면 선택 모달 열기
      if (typeof checkFeatChoice === 'function' && checkFeatChoice(featName, type, state.feats[type].length - 1)) {
        recalcAll();
        renderGrowthPlan();
        renderFeats();
        save();
        return; // 선택 모달이 열림 → closeModal은 선택 완료 후
      }
      renderGrowthPlan();
    } else {
      const _fdN = getFeat(featName) || getFeat(featName.split(' (')[0].trim());
      const _newFeatN = {id: _fdN?.id || null, name: featName, level: featLevel};
      _applyModalFeatChoice(_newFeatN); // 모달 상세에서 입력한 인라인 choice(지식 등) 반영
      state.feats[type].push(_newFeatN);
      // 선택이 필요한 재주면 선택 모달 열기
      if (typeof checkFeatChoice === 'function' && checkFeatChoice(featName, type, state.feats[type].length - 1)) {
        recalcAll();
        renderFeats();
        save();
        return;
      }
    }
    recalcAll();
    renderFeats();
  } else if (modalType==='spell') {
    const sp = modalSelected;
    // growth 사역마 주문 선택 (prepared caster)
    if (_growthFamiliarPending) {
      applyGrowthFamiliarSelection(sp);
      closeModal();
      return;
    }
    // growth 주문 선택 (spontaneous caster)
    if (_growthSpellPending) {
      applyGrowthSpellSelection(sp.name_ko);
      closeModal();
      return;
    }
    if (_spellSlotPending) {
      const pending = _spellSlotPending;
      _spellSlotPending = null;
      if (pending.type === 'cantrip') {
        // Insert at slot index (replace or insert)
        if (pending.slotIndex < state.spells.cantrip.length) {
          state.spells.cantrip[pending.slotIndex] = {name: sp.name_ko, rank:0};
        } else {
          // Pad with nulls if needed, then set
          while (state.spells.cantrip.length < pending.slotIndex) state.spells.cantrip.push(null);
          state.spells.cantrip[pending.slotIndex] = {name: sp.name_ko, rank:0};
        }
      } else {
        // Known spell slot
        const rank = pending.rank;
        const spellsAtRank = state.spells.known.filter(s => s.rank === rank);
        if (pending.slotIndex < spellsAtRank.length) {
          // Replace existing
          const globalIdx = state.spells.known.indexOf(spellsAtRank[pending.slotIndex]);
          state.spells.known[globalIdx] = {name: sp.name_ko, rank: rank};
        } else {
          state.spells.known.push({name: sp.name_ko, rank: rank});
        }
      }
    } else if (sp.is_cantrip) {
      state.spells.cantrip.push({name: sp.name_ko, rank:0});
    } else if (sp.is_focus) {
      state.spells.focus.push({name: sp.name_ko});
    } else {
      state.spells.known.push({name: sp.name_ko, rank: sp.rank||1});
    }
    renderSpells();
  } else if (modalType==='weapon') {
    const w = modalSelected;
    addWeapon({name: w.name_ko, dmg: w.damage||'', traits: (w.traits||[]).join(', '), _dbData: w, category: w.category, range: w.range});
  } else if (modalType==='subclass') {
    // Reset subclass-specific features if changing
    if (state.selectedSubclass && state.selectedSubclass.id !== modalSelected.id) {
      resetFromSubclass();
    }
    state.selectedSubclass = modalSelected;
    const btn = document.getElementById('btn-subclass');
    if (btn) { btn.textContent = `${modalSelected.subclass_type}: ${modalSelected.name_ko}`; btn.classList.add('filled'); }
    const _dbgSub = getSubclassAutoFeats(modalSelected);
    const _dbgSpell = getSubclassAutoSpells(modalSelected);
    applyClassFeatures();
    renderFeats();
    renderSpells();
    renderGrowthPlan();
  } else if (modalType==='muse_pick') {
    // 다양한 뮤즈 선택 — feat choice에 id 적용
    if (modalSelected && modalContext) {
      _applyFeatChoice(modalSelected.id);
    }
  } else if (modalType==='heritage') {
    state.selectedHeritage = modalSelected;
    const btn = document.getElementById('btn-heritage');
    if (btn) { btn.textContent = modalSelected.name_ko; btn.classList.add('filled'); }
    applyHeritageEffects(modalSelected);
    renderGrowthPlan();
  } else if (modalType==='armor') {
    const a = modalSelected;
    const nameEl = document.getElementById('armor-name');
    const acEl = document.getElementById('armor-ac');
    const dexEl = document.getElementById('armor-dex');
    if (nameEl) nameEl.value = a.name_ko;
    if (acEl) acEl.value = a.ac_bonus||0;
    if (dexEl) dexEl.value = a.dex_cap!==null && a.dex_cap!==undefined ? a.dex_cap : '-';
    state.armorPotency = 0;
    state.armorResilient = 0;
    state.armorStowed = false;
    renderArmorCard();
    recalcAC();
  } else if (modalType==='shield') {
    const s = modalSelected;
    document.getElementById('shield-name').value = s.name_ko;
    document.getElementById('shield-ac').value = s.ac_bonus||0;
    document.getElementById('shield-hard').value = s.hardness||0;
    document.getElementById('shield-hp').value = s.hp||0;
    const hpCur = document.getElementById('shield-hp-cur');
    if (hpCur) hpCur.value = s.hp||0;
    state.shieldStowed = false;
    renderShieldCard();
    updateShieldGauge();
  } else if (modalType==='equip-weapon') {
    const w = modalSelected;
    addEquip({name: w.name_ko, qty:1, bulk: typeof w.bulk==='number'?w.bulk:(w.bulk==='L'?0.1:0), _type:'weapon', _data:w});
  } else if (modalType==='equip-armor') {
    const a = modalSelected;
    addEquip({name: a.name_ko, qty:1, bulk: typeof a.bulk==='number'?a.bulk:(a.bulk==='L'?0.1:0), _type:'armor', _data:a});
  } else if (modalType==='equip-shield') {
    const s = modalSelected;
    addEquip({name: s.name_ko, qty:1, bulk: typeof s.bulk==='number'?s.bulk:(s.bulk==='L'?0.1:0), _type:'shield', _data:s});
  } else if (modalType==='equip-gear') {
    const g = modalSelected;
    addEquip({name: g.name_ko, qty:1, bulk: typeof g.bulk==='number'?g.bulk:(g.bulk==='L'?0.1:0), _data:g});
  }
  try { recalcAll(); } catch(e) { console.error('confirmModal recalcAll error:', e); }
  closeModal();
  // 모달 닫은 후 최종 렌더링 보장
  if (typeof renderFeats === 'function') renderFeats();
  if (typeof renderSpells === 'function') renderSpells();
  save();
}

function closeModal() {
  const wasBoost = (modalType === 'boost');
  document.getElementById('modal-overlay').classList.add('hidden');
  // 닫기/취소/footer 복원 (spell_cantrip에서 숨겼을 수 있음)
  const closeBtn = document.querySelector('.modal-close');
  const closeBtnM = document.getElementById('modal-close-m');
  const footer = document.querySelector('.modal-footer');
  if (closeBtn) closeBtn.style.display = '';
  if (closeBtnM) closeBtnM.style.display = '';
  if (footer) footer.style.display = '';
  // Clean up equip-browse
  const eqTabs = document.getElementById('equip-tab-container');
  if (eqTabs) eqTabs.style.display = 'none';
  if (typeof _hideCustomEquipForm === 'function') _hideCustomEquipForm();
  // footer 버튼 항상 초기화
  if (footer) {
    footer.innerHTML = '<button class="btn btn-cancel" onclick="closeModal()">닫기</button><button class="btn btn-confirm" onclick="confirmModal()">선택</button>';
  }
  modalType = null;
  modalSelected = null;
  // Clear growth pending state
  growthPendingLevel = null;
  growthPendingKey = null;
  growthPendingFeatType = null;
  _spellSlotPending = null;
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = '';
  // Restore modal size
  const modalEl = document.querySelector('.modal');
  if (modalEl) { modalEl.style.maxWidth = ''; modalEl.style.height = ''; }
  // Restore list/detail to default state
  const listEl = document.querySelector('.modal-list');
  if (listEl) { listEl.style.display = ''; listEl.style.width = ''; listEl.style.borderRight = ''; }
  const detailEl = document.getElementById('modal-detail');
  if (detailEl) { detailEl.style.display = ''; detailEl.innerHTML = '<div class="modal-detail-empty">항목을 선택하면 상세 정보가 표시됩니다.</div>'; }
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = '';
  // Mobile: reset detail-open + 주문 기억 마커
  const body = document.getElementById('modal-body');
  if (body) { body.classList.remove('detail-open'); body.classList.remove('mem-modal'); }
  // 부스트 모달 닫을 때 성장 계획 + 수치 갱신
  if (wasBoost) { renderGrowthPlan(); recalcAll(); }
}

document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) {
    // 필수 선택 모달이면 닫지 않음 (footer가 숨겨진 상태 = 닫기 불가)
    const footer = document.querySelector('.modal-footer');
    if (footer && footer.style.display === 'none') return;
    closeModal();
  }
});

// 모바일 모달 닫기 버튼: CSS media query로 제어 (JS MutationObserver 제거)

function applyClassDefaults(cls) {
  const saveMap = {fort:'prof-fort', ref:'prof-ref', will:'prof-will'};
  const rankMap = {'미숙련':'0','숙련':'2','전문가':'4','달인':'6','전설':'8'};
  for (const [save, profId] of Object.entries(saveMap)) {
    const el = document.getElementById(profId);
    if (el) el.value = rankMap[cls.saves[save]||'숙련']||'2';
  }
  const percEl = document.getElementById('prof-perc');
  if (percEl) percEl.value = rankMap[cls.perc||'숙련']||'2';
  const cdcEl = document.getElementById('prof-classdc');
  if (cdcEl) cdcEl.value = '2';
  if (cls.casting) {
    const spEl = document.getElementById('prof-spatk');
    if (spEl) spEl.value = '2';
    // 주문 계열 자동 설정
    const tradEl = document.getElementById('spell-tradition');
    if (tradEl && cls.tradition && cls.tradition !== 'any') tradEl.value = cls.tradition;
    // 시전 유형 자동 설정
    const typeEl = document.getElementById('spell-type');
    if (typeEl && cls.casting) typeEl.value = cls.casting;
    // 캔트립 슬롯 기본값
    state.cantripSlots = 5;
    // 기본 주문 슬롯 (레벨 1 기준: 랭크1 = 2슬롯)
    state.spellSlots = state.spellSlots || {};
    if (!state.spellSlots[1]) state.spellSlots[1] = 2;
  }
  const speedEl = document.getElementById('speed');
  if (speedEl && state.selectedAncestry) speedEl.value = state.selectedAncestry.speed;
  // 서브클래스 버튼 표시/초기화
  const subBtn = document.getElementById('btn-subclass');
  if (subBtn) {
    const hasSub = SUBCLASS_DB.some(s => s.class_id === cls.id);
    subBtn.style.display = hasSub ? '' : 'none';
    subBtn.textContent = '서브클래스 선택...';
    subBtn.classList.remove('filled');
    state.selectedSubclass = null;
  }
  // Weapon proficiencies based on class
  const wpDefaults = {
    fighter:   {simple:'4',martial:'4',advanced:'2',unarmed:'4'},
    champion:  {simple:'2',martial:'2',advanced:'0',unarmed:'2'},
    ranger:    {simple:'2',martial:'2',advanced:'0',unarmed:'2'},
    barbarian: {simple:'2',martial:'2',advanced:'0',unarmed:'2'},
    rogue:     {simple:'2',martial:'2',advanced:'0',unarmed:'2'},
    monk:      {simple:'2',martial:'0',advanced:'0',unarmed:'4'},
    swashbuckler:{simple:'2',martial:'2',advanced:'0',unarmed:'2'},
    investigator:{simple:'2',martial:'2',advanced:'0',unarmed:'2'},
    gunslinger:{simple:'2',martial:'2',advanced:'0',unarmed:'2'},
    inventor:  {simple:'2',martial:'2',advanced:'0',unarmed:'2'},
    magus:     {simple:'2',martial:'2',advanced:'0',unarmed:'2'},
    thaumaturge:{simple:'2',martial:'2',advanced:'0',unarmed:'2'},
    bard:      {simple:'2',martial:'0',advanced:'0',unarmed:'2'},
    cleric:    {simple:'2',martial:'0',advanced:'0',unarmed:'2'},
    druid:     {simple:'2',martial:'0',advanced:'0',unarmed:'2'},
    oracle:    {simple:'2',martial:'0',advanced:'0',unarmed:'2'},
    psychic:   {simple:'2',martial:'0',advanced:'0',unarmed:'2'},
    sorcerer:  {simple:'2',martial:'0',advanced:'0',unarmed:'2'},
    summoner:  {simple:'2',martial:'0',advanced:'0',unarmed:'2'},
    witch:     {simple:'2',martial:'0',advanced:'0',unarmed:'2'},
    wizard:    {simple:'2',martial:'0',advanced:'0',unarmed:'2'},
    kineticist:{simple:'2',martial:'0',advanced:'0',unarmed:'2'},
  };
  const clsId = (cls.id||cls.en||'').toLowerCase();
  const wp = wpDefaults[clsId] || {simple:'2',martial:'0',advanced:'0',unarmed:'2'};
  ['simple','martial','advanced','unarmed'].forEach(c => {
    const el = document.getElementById('prof-weapon-'+c);
    if (el) el.value = wp[c];
  });
  initWeaponProfBadges();

  // Armor proficiencies based on class
  const apDefaults = {
    fighter:     {light:'2',medium:'2',heavy:'2',unarmored:'2'},
    champion:    {light:'2',medium:'2',heavy:'2',unarmored:'2'},
    ranger:      {light:'2',medium:'2',heavy:'0',unarmored:'2'},
    barbarian:   {light:'2',medium:'2',heavy:'0',unarmored:'2'},
    rogue:       {light:'2',medium:'0',heavy:'0',unarmored:'2'},
    monk:        {light:'0',medium:'0',heavy:'0',unarmored:'4'},
    swashbuckler:{light:'2',medium:'0',heavy:'0',unarmored:'2'},
    investigator:{light:'2',medium:'0',heavy:'0',unarmored:'2'},
    gunslinger:  {light:'2',medium:'2',heavy:'0',unarmored:'2'},
    inventor:    {light:'2',medium:'2',heavy:'2',unarmored:'2'},
    magus:       {light:'2',medium:'0',heavy:'0',unarmored:'2'},
    thaumaturge: {light:'2',medium:'0',heavy:'0',unarmored:'2'},
    bard:        {light:'2',medium:'0',heavy:'0',unarmored:'2'},
    cleric:      {light:'2',medium:'2',heavy:'0',unarmored:'2'},
    druid:       {light:'2',medium:'2',heavy:'0',unarmored:'2'},
    oracle:      {light:'0',medium:'0',heavy:'0',unarmored:'2'},
    psychic:     {light:'0',medium:'0',heavy:'0',unarmored:'2'},
    sorcerer:    {light:'0',medium:'0',heavy:'0',unarmored:'2'},
    summoner:    {light:'0',medium:'0',heavy:'0',unarmored:'2'},
    witch:       {light:'0',medium:'0',heavy:'0',unarmored:'2'},
    wizard:      {light:'0',medium:'0',heavy:'0',unarmored:'2'},
    kineticist:  {light:'0',medium:'0',heavy:'0',unarmored:'2'},
  };
  const ap = apDefaults[clsId] || {light:'0',medium:'0',heavy:'0',unarmored:'2'};
  ['light','medium','heavy','unarmored'].forEach(c => {
    const el = document.getElementById('prof-armor-'+c);
    if (el) el.value = ap[c];
  });
  initArmorProfBadges();
  renderArmorCard();

  // 핵심 능력치: 단일 고정이면 자동 설정, OR이면 사용자 선택 대기 (모달에서 setClassKey)
  const keys = cls.key_attrs || [];
  if (keys.length === 1) state.boosts.cls = keys[0];
  // 길이 2+ (OR)는 기존 선택 보존 또는 빈 상태로 둠 (renderBoostModal에서 사용자 선택)
  // 고정 클래스 기술 숙련은 rebuildCoreEffects(출처기반, _classGrantedSkills)가 재파생 — 명령형 부여 제거(v0.134).
  state.trainableSkillSlots = cls.free_skill_count || 0;
  updateHP();
  updateSpellSlotsForClass();
  recalcSkills();
}

// 혈통 부가 정보 요약 텍스트 (v528~ specials 컬럼 제거 후 features/grantWeapon에서 파생)
function _summarizeAncestryExtras(anc) {
  if (!anc) return '';
  const lines = [];
  if (anc.grantWeapon) {
    const w = (typeof getWeapon === 'function') ? getWeapon(anc.grantWeapon) : null;
    // FVTT 혈통 내장 items가 무기가 아닐 수 있음 → 무기로 해소될 때만 표시(레거시 데이터는 항상 표시)
    if (w) lines.push(`무료 획득: ${w.name_ko}`);
    else if (!anc._fvtt) lines.push(`무료 획득: ${anc.grantWeapon}`);
  }
  for (const fid of (anc.features || [])) {
    const f = (typeof getFeat === 'function') ? getFeat(fid) : null;
    lines.push(`자동 부여: ${f?.name_ko || fid}`);
  }
  if (anc.free_boosts) lines.push(`자유 속성 부스트 ${anc.free_boosts}개`);
  if (anc.bonusLangs) lines.push(`추가 언어 ${anc.bonusLangs}+INT개`);
  return lines.join('\n');
}

function applyAncestryDefaults(anc) {
  const speedEl = document.getElementById('speed');
  if (speedEl) speedEl.value = anc.speed;
  // Save vision and size to state
  state.vision = anc.vision || 'none';
  state.size = anc.size || '중형';
  const langEl = document.getElementById('f-languages');
  if (langEl && !langEl.value) {
    const visionKo = (typeof VISION_KO !== 'undefined' && VISION_KO[anc.vision]) || anc.vision || '없음';
    const extras = _summarizeAncestryExtras(anc);
    langEl.value = [
      `특성: ${(anc.traits||[]).join(', ')}`,
      `크기: ${anc.size}`,
      `감각: ${visionKo}`,
      extras
    ].filter(Boolean).join('\n');
  }
  // 정규화된 enum 직접 사용 (boosts=고정, flaws=고정, boost_choices/free_boosts는 모달에서 처리)
  state.boosts.ancFixed = [...(anc.boosts || [])];
  state.boosts.ancFlaw = [...(anc.flaws || [])];
  state.boosts.ancFree = []; // reset free boost
  updateHP();
}

function applyHeritageEffects(h) {
  if (!h) return;
  try {
  // 캔트립 선택이 필요한 유산만 인터랙티브 모달 열기
  const _heff = getHeritageEffects(h);
  if (_heff.innateSpells) {
    const _isChoose = (t) => t === '$other' || t === 'any' || t === '선택';
    const needsChoice = _heff.innateSpells.some(sp => _isChoose(sp.tradition) || sp.tradition === 'primal' || sp.tradition === '원시');
    if (needsChoice) {
      const sp = _heff.innateSpells[0];
      const trad = _isChoose(sp.tradition) ? 'any' : 'primal';
      const label = _isChoose(sp.tradition) ? '전통 캔트립 선택 (비전/신성/오컬트 중)' : '원시(Primal) 캔트립 선택';
      if (!state.feats.other) state.feats.other = [];
      const tempFeatName = h.name_ko + ' 캔트립';
      // 중복 방지
      if (!state.feats.other.some(f => f._heritageCantrip)) {
        state.feats.other.push({name: tempFeatName, level:1, _auto:true, _heritageCantrip:true});
        const fi = state.feats.other.length - 1;
        if (typeof openFeatChoiceModal === 'function') {
          setTimeout(() => openFeatChoiceModal('other', fi, {type:'spell_cantrip', tradition: trad, label}), 0);
        }
      }
    }
  }
  // 나머지 효과(시야, 기술, 재주, 무기, 주문, HP)는 rebuildCoreEffects()가 매 recalcAll마다 재파생
  recalcAll();
  renderFeats();
  if (typeof renderSpells === 'function') renderSpells();
  } catch(e) { console.error('applyHeritageEffects error:', e); }
}

function applyBackgroundInfo(bg) {
  const beff = (typeof getBackgroundEffects === 'function') ? getBackgroundEffects(bg) : {};
  // 노트에 배경 정보 표시 (1회성 UI)
  const notesEl = document.getElementById('f-notes');
  if (notesEl && !notesEl.value) {
    const boostKo = [
      ...(beff.boosts || []).map(k => ATTR_KO[k]),
      ...(beff.boost_choices || []).map(g => g.map(k => ATTR_KO[k]).join(' 또는 ')),
      ...Array(beff.free_boosts || 0).fill('자유'),
    ].join(', ');
    const skillsKo = [
      ...(beff.fixed_skills || []).map(id => (typeof SKILLS !== 'undefined' ? (SKILLS.find(s=>s.id===id)?.name || id) : id)),
      ...(beff.choice_skill_groups || []).map(g => g.map(id => (typeof SKILLS !== 'undefined' ? (SKILLS.find(s=>s.id===id)?.name || id) : id)).join(' 또는 ')),
      ...(beff.fixed_lores || []).map(l => ((typeof getLoreKo === 'function') ? getLoreKo(l) : l) + ' 지식'),
      ...(beff.choice_lore ? ['원하는 지식 1개'] : []),
    ].join(', ');
    const fd = beff.feat_id ? getFeat(beff.feat_id) : null;
    const featKo = fd ? fd.name_ko : (beff.feat_id || '—');
    notesEl.value = `[배경: ${bg.name}]\n속성 부스트: ${boostKo}\n기술: ${skillsKo}\n기술 재주: ${featKo}`;
  }
  // growth plan에 배경 재주 저장 (1회성, feat_id 기반)
  if (beff.feat_id) {
    const fd = getFeat(beff.feat_id);
    if (fd) {
      if (!state.growth[1]) state.growth[1] = {};
      state.growth[1].bgSkillFeat = `${fd.name_ko} (${fd.name_en})`;
    }
  }
  // 기술/지식/재주 적용은 rebuildCoreEffects()가 매 recalcAll마다 재파생
  recalcAll();
  renderFeats();
  renderGrowthPlan();
}

function getClassSpellData() {
  if (!state.selectedClass) return null;
  const cid = state.selectedClass.id;
  const lv = getLevel();
  if (typeof CLASS_SPELL_TABLE !== 'undefined' && CLASS_SPELL_TABLE[cid]) {
    return CLASS_SPELL_TABLE[cid][Math.min(lv,20)] || null;
  }
  return null;
}

function updateSpellSlotsForClass() {
  if (!state.selectedClass || !state.selectedClass.casting) return;
  const data = getClassSpellData();
  const lv = getLevel();
  state.spellSlots = state.spellSlots || {};
  if (data) {
    // CLASS_SPELL_TABLE 기반 자동 설정
    for (let r = 1; r <= 10; r++) {
      state.spellSlots[r] = data.slots[r-1] || 0;
    }
    // cantrip_slots 보너스 합산 (모든 레벨)
    let cantripBonus = 0;
    const curLv = getLevel();
    for (let l = 1; l <= curLv; l++) cantripBonus += _getCantripBonusAtLevel(l);
    state.cantripSlots = (data.cantrips || 5) + cantripBonus;
  } else {
    // CLASS_SPELL_TABLE에 없는 클래스 — 범용 폴백
    const slots = [
      [2,0,0,0,0,0,0,0,0,0],[3,0,0,0,0,0,0,0,0,0],[3,2,0,0,0,0,0,0,0,0],
      [3,3,0,0,0,0,0,0,0,0],[3,3,2,0,0,0,0,0,0,0],[3,3,3,0,0,0,0,0,0,0],
      [3,3,3,2,0,0,0,0,0,0],[3,3,3,3,0,0,0,0,0,0],[3,3,3,3,2,0,0,0,0,0],
      [3,3,3,3,3,0,0,0,0,0],[3,3,3,3,3,2,0,0,0,0],[3,3,3,3,3,3,0,0,0,0],
      [3,3,3,3,3,3,2,0,0,0],[3,3,3,3,3,3,3,0,0,0],[3,3,3,3,3,3,3,2,0,0],
      [3,3,3,3,3,3,3,3,0,0],[3,3,3,3,3,3,3,3,2,0],[3,3,3,3,3,3,3,3,3,0],
      [3,3,3,3,3,3,3,3,3,1],[3,3,3,3,3,3,3,3,3,1],
    ];
    const row = slots[Math.min(lv,20)-1] || slots[0];
    for (let r = 1; r <= 10; r++) {
      state.spellSlots[r] = row[r-1] || 0;
    }
  }
  renderSpells();
}

// ═══════════════════════════════════════════════
//  TAB NAVIGATION
// ═══════════════════════════════════════════════

// switchTab is overridden below with Pathbuilder layout support

// ═══════════════════════════════════════════════
//  ACTIONS TAB
// ═══════════════════════════════════════════════

let _actionFilter = 'all';
let _actionAvailOnly = false;   // 행동: 사용 가능한 것만
let _condActiveOnly = false;    // 상태이상: 적용 중인 것만

function setActionFilter(f, btn) {
  _actionFilter = f;
  document.querySelectorAll('#action-filter-bar button.af-eco').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderActions();
}

// 우측 끝 체크박스: 행동 탭이면 "사용 가능한 것만", 상태이상 탭이면 "적용 중인 것만"
function toggleActionExtraFilter(cb) {
  if (_actionFilter === 'conditions') _condActiveOnly = cb.checked;
  else _actionAvailOnly = cb.checked;
  renderActions();
}

// 컨텍스트(행동/상태이상)에 따라 체크박스 라벨·상태 동기화
function _syncActionExtraFilter() {
  const lbl = document.getElementById('action-extra-label');
  const cb = document.getElementById('action-extra-check');
  const wrap = document.getElementById('action-extra-filter');
  if (!lbl || !cb) return;
  if (_actionFilter === 'conditions') {
    lbl.textContent = '적용 중인 것만';
    cb.checked = _condActiveOnly;
    if (wrap) wrap.title = '적용 중인 상태이상만 표시';
  } else {
    lbl.textContent = '사용 가능한 것만';
    cb.checked = _actionAvailOnly;
    if (wrap) wrap.title = '사용 가능한 행동만 표시';
  }
}

// ── 상태이상 탭: 카드 클릭으로 on/off, 수치형은 스테퍼로 횟수 증감 ──
function _afterCondChange() {
  if (typeof recalcAll === 'function') recalcAll();   // 상태이상이 파생 스탯에 반영(공포/메스꺼움/서투름/약화/현기증 등)
  else if (typeof buildConditions === 'function') buildConditions();
  if (typeof save === 'function') save();
  renderActions();                                    // 상태이상 탭 갱신
}
function toggleCardCondition(name) {
  const c = CONDITIONS_DATA.find(x => x.name === name);
  if (!c || c.auto) return;
  const cur = parseInt(state.conditions[name] || 0);
  const isOn = c.valued ? cur > 0 : !!cur;
  state.conditions[name] = isOn ? 0 : 1;              // 끄기 → 0, 켜기 → 1(수치형 시작값 1)
  _afterCondChange();
}
function stepCardCondition(name, delta) {
  const c = CONDITIONS_DATA.find(x => x.name === name);
  if (!c || !c.valued || c.auto) return;
  const maxN = c.max || 4;
  let cur = parseInt(state.conditions[name] || 0);
  cur = Math.max(0, Math.min(maxN, cur + delta));     // 0이면 자동으로 꺼짐
  state.conditions[name] = cur;
  _afterCondChange();
}

const COST_ICON = {'1':'<span class="action-glyph">1</span>','2':'<span class="action-glyph">2</span>','3':'<span class="action-glyph">3</span>','reaction':'<span class="action-glyph">R</span>','free':'<span class="action-glyph">F</span>','passive':'—','varies':'✦','10min':'10분','1min':'1분','1h':'1시간','1day':'1일','8h':'8시간'};

function getActionCostIcon(cost) {
  return COST_ICON[cost] || cost;
}

function getSkillRank(skillId) {
  const el = document.getElementById('sk-prof-' + skillId);
  return el ? parseInt(el.value) || 0 : 0;
}

// 보유 재주 slug 집합 — 이름 편집에도 안전(featSlug가 저장 id/이름을 카탈로그 slug로 해소).
function getLearnedFeatSlugs() {
  const slugs = new Set();
  Object.values(state.feats).forEach(arr => {
    arr.forEach(f => { const s = (typeof featSlug === 'function') ? featSlug(f) : (f && f.id); if (s) slugs.add(s); });
  });
  return slugs;
}

function isActionAvailable(action) {
  if (action.req_heritage) {
    if (!state.selectedHeritage || state.selectedHeritage.id !== action.req_heritage) return false;
  }
  if (action.req_feat) {
    // req_feat = slug(신) 또는 이름(구/큐레이션) — featSlug로 해소해 보유 slug와 대조.
    const learned = getLearnedFeatSlugs();
    if (!learned.has((typeof featSlug === 'function') ? featSlug(action.req_feat) : action.req_feat)) return false;
  }
  if (action.req_skill) {
    if (getSkillRank(action.req_skill) < action.req_rank) return false;
  }
  return true;
}

function isGrantedAction(action) {
  return !!(action.req_feat || action.req_heritage || action.cat === 'heritage');
}

function renderActions() {
  const container = document.getElementById('actions-content');
  if (!container) return;

  _syncActionExtraFilter();

  // Conditions reference tab — 행동 카드 형식 + FVTT 상태이상 아이콘
  if (_actionFilter === 'conditions') {
    const rows = CONDITIONS_DATA.map(c => {
      const val = state.conditions[c.name] || 0;
      const isActive = c.valued ? val > 0 : !!val;
      return { c, val, isActive };
    }).filter(o => !_condActiveOnly || o.isActive);

    let html = '<div class="actions-grid">';
    rows.forEach(({ c, val, isActive }) => {
      const maxN = c.max || 4;
      const maxStr = c.valued ? ` (최대 ${maxN})` : '';
      const ico = (typeof iconImg === 'function' && iconImg('condition', c)) ||
        '<span class="item-icon" style="display:inline-flex;align-items:center;justify-content:center;font-size:14px;background:var(--bg4);">⚠</span>';
      const activeStyle = isActive ? 'border-left:3px solid var(--red);background:var(--red-bg);' : '';
      const dimStyle = isActive ? '' : 'opacity:0.7;';
      const desc = (typeof resolveDescRefs === 'function') ? resolveDescRefs(c.desc) : c.desc;
      const clickable = !c.auto;          // 과적 등 자동 상태이상은 클릭 토글 불가(부피로 관리)
      const onClick = clickable ? ` onclick="toggleCardCondition('${c.name}')"` : '';
      const cursorStyle = clickable ? 'cursor:pointer;' : 'cursor:default;';
      // 우측: 자동=잠금 / 수치형 활성=스테퍼 / 단순 활성=적용 중
      let statusHtml = '';
      if (c.auto) {
        statusHtml = `<span style="font-size:10px;color:var(--text2);flex-shrink:0;" title="부피에 따라 자동 적용/해제">🔒 자동${isActive?' 적용':''}</span>`;
      } else if (isActive && c.valued) {
        statusHtml = `<span class="cond-stepper" style="flex-shrink:0;">`
          + `<button onclick="event.stopPropagation();stepCardCondition('${c.name}',-1)" title="감소">−</button>`
          + `<span class="cond-stepper-val">${val}</span>`
          + `<button onclick="event.stopPropagation();stepCardCondition('${c.name}',1)"${val>=maxN?' disabled':''} title="증가">＋</button>`
          + `</span>`;
      } else if (isActive) {
        statusHtml = `<span style="font-size:10px;color:var(--red);font-weight:700;flex-shrink:0;">적용 중</span>`;
      }
      html += `<div class="action-card cond-card${isActive?' on':''}" style="${dimStyle}${activeStyle}${cursorStyle}"${onClick}>
        <div class="action-card-head">
          ${ico}
          <div style="flex:1;min-width:0;">
            <div class="action-name-ko"${isActive?' style="color:var(--red-light);"':''}>${c.name}${(c.valued&&val)?' '+val:''}</div>
            <div class="action-name-en">${c.en}${maxStr}</div>
          </div>
          ${statusHtml}
        </div>
        <div class="action-summary">${desc}</div>
      </div>`;
    });
    html += '</div>';
    if (!rows.length) html = `<div style="color:var(--text2);padding:16px;">${_condActiveOnly?'적용 중인 상태이상이 없습니다.':'상태이상 데이터가 없습니다.'}</div>`;
    container.innerHTML = html;
    return;
  }

  // 풀: 전체 행동(큐레이션) — 비용 필터는 동적 추가(재주/커스텀)까지 합친 뒤 마지막에 적용
  let visible = [...((typeof PF2eAction !== 'undefined' && PF2eAction.curatedList) ? PF2eAction.curatedList() : [])];

  // FVTT 이행(v0.44): 큐레이션 74개의 표시데이터를 FVTT actions 오버레이 단일 소스에서 해소.
  //   그룹/비용요건/기술게이트(cat_label·req_*)는 큐레이션 유지, 이름·비용·특성·설명은 FVTT.
  //   활동시간(1min/10min 등)은 FVTT actionType 미표현 → 표준 행동경제값만 교체(폴백=레거시).
  //   매칭 실패(재주 파생 등)는 레거시 필드 그대로 폴백. _fvttDesc=클릭 시 펼칠 전체 설명.
  if (typeof PF2eAction !== 'undefined' && PF2eAction.ready && PF2eAction.ready()) {
    const _STD_COST = new Set(['1', '2', '3', 'free', 'reaction']);
    visible = visible.map(a => {
      const fv = a.name_en && PF2eAction.getActionLegacy(a.name_en);
      if (!fv) return a;
      // FVTT desc가 텍스트 없는 스텁(<p></p> 등, 실제 설명이 재주쪽인 경우)이면 레거시 summary 유지
      const _fvHasText = fv.desc && fv.desc.replace(/<[^>]+>/g, '').trim();
      return Object.assign({}, a, {
        name_ko: fv.name_ko || a.name_ko,
        cost: _STD_COST.has(fv.cost) ? fv.cost : a.cost,
        traits: (fv.traits && fv.traits.length) ? fv.traits : a.traits,
        _fvttDesc: _fvHasText ? fv.desc : '',
        _fvtt: true,
      });
    });
  }

  // 보유 재주 중 행동인 것 동적 추가 (ACTION_DB에 없는 것만) — 보유 재주 객체를 slug로 카탈로그 조회
  if (typeof getFeat === 'function') {
    const existingIds = new Set(visible.map(a => a.id));
    Object.values(state.feats).flat().forEach(lf => {
      if (!lf) return;
      const fd = getFeat(lf.id || (lf.name || '').split(' (')[0].trim());  // slug 우선 해소
      if (!fd) return;
      // 행동 비용: 레거시 actionCost 또는 FVTT actionType/actions에서 도출
      const cost = fd.actionCost || (fd.actionType === 'reaction' ? 'reaction'
        : fd.actionType === 'free' ? 'free'
        : (fd.actions != null ? String(fd.actions) + '행동' : null));
      if (!cost) return;
      const id = 'feat-auto-' + fd.id;  // slug 기반 id(이름 드리프트 무관)
      if (existingIds.has(id)) return;
      existingIds.add(id);
      const desc = (fd.desc||fd.summary||'').replace(/^\[(?:반응|1행동|2행동|3행동|자유 행동)\]\s*/, '');
      visible.push({
        id, cat:'feat', cat_label:'재주 행동', name_ko: fd.name_ko, name_en: fd.name_en,
        cost, traits: fd.traits||[], req_skill:null, req_rank:0, req_feat: fd.id, req_feat_name: fd.name_ko,
        summary: desc
      });
    });
  }

  // _fb._customActions: 동적 행동 카드 추가
  if (state._fb?._customActions) {
    const existingIds2 = new Set(visible.map(a => a.id));
    state._fb._customActions.forEach(ca => {
      const featNameKo = ca.featName.split(' (')[0].trim();

      // actionName 기반: 행동 DB(카탈로그) 우선, 미스 시 부모 재주 desc 정규식 폴백
      if (ca.actionName) {
        // 보조 추출: 부모 재주 desc에서 영문명/비용/본문(폴백 + DB 키 확보)
        const fd = getFeat(featNameKo);
        let nameEn = '', cost = 'free', body = '';
        if (fd && fd.desc) {
          const marker = '<strong>' + ca.actionName + '</strong>';
          const idx = fd.desc.indexOf(marker);
          if (idx >= 0) {
            const section = fd.desc.substring(idx + marker.length);
            const enMatch = section.match(/^\(([^)]+)\)/);
            nameEn = enMatch ? enMatch[1] : '';
            const costMatch = section.match(/\[([^\]]+)\]/);
            const costMap = {'반응':'reaction','1행동':'1','2행동':'2','3행동':'3','자유 행동':'free'};
            cost = costMatch ? (costMap[costMatch[1]] || 'free') : 'free';
            body = section.replace(/^[^]*?\[.+?\]\s*(?:<br\s*\/?>)?\s*/, '');
          }
        }
        // DB 우선: 영문명(안정적) → 한글명 순으로 카탈로그 조회
        let fv = null;
        if (typeof PF2eAction !== 'undefined' && PF2eAction.ready && PF2eAction.ready()) {
          fv = (nameEn && PF2eAction.getActionLegacy(nameEn)) || PF2eAction.getActionLegacy(ca.actionName) || null;
        }
        // DB도 없고 desc 추출도 실패면 표시 안 함(기존 동작)
        if (!fv && !body) return;
        const name_ko = (fv && fv.name_ko) || ca.actionName;
        const name_en = (fv && fv.name_en) || nameEn;
        const finalCost = (fv && fv.cost) || cost;
        const summary = (fv && fv.desc) || body;
        const traits = (fv && fv.traits) || [];
        const id = 'custom-' + (name_en || name_ko).replace(/\s/g,'-');
        if (existingIds2.has(id)) return;
        existingIds2.add(id);
        visible.push({
          id, cat:'feat', cat_label:'재주 행동', name_ko, name_en,
          cost: finalCost, traits, req_skill:null, req_rank:0, req_feat: (typeof featSlug==='function'?featSlug(featNameKo):featNameKo), req_feat_name: featNameKo,
          summary
        });
        return;
      }

      // 레거시: summary 기반 (하위 호환) — ca.actionCost는 cs_feat_effects.js에서 부여 (v523~)
      const id = 'custom-' + (ca.featName||'').replace(/\s/g,'-');
      if (existingIds2.has(id)) return;
      existingIds2.add(id);
      const cost = ca.actionCost || 'free';
      const nameEnMatch = ca.featName.match(/\(([^)]+)\)$/);
      const nameEn = nameEnMatch ? nameEnMatch[1] : '';
      const desc = ca.summary.replace(/^\[.+?\]\s*/, '').replace(/^[^—]*—\s*/, '');
      visible.push({
        id, cat:'feat', cat_label:'재주 행동', name_ko: featNameKo, name_en: nameEn,
        cost, traits:[], req_skill:null, req_rank:0, req_feat: (typeof featSlug==='function'?featSlug(featNameKo):featNameKo), req_feat_name: featNameKo,
        summary: desc
      });
    });
  }

  // 행동경제(비용) 필터 — _actionFilter 값('1'|'2'|'3'|'free'|'reaction')이 곧 a.cost
  // 그 외(1min/10min/passive/varies 등)는 '전체'에서만 노출. 그룹 분류(기본/기술/재주)는 그대로 유지.
  if (_actionFilter !== 'all') {
    visible = visible.filter(a => a.cost === _actionFilter);
  }

  // Group by cat_label, separate available vs locked
  const groups = {};
  visible.forEach(a => {
    if (!groups[a.cat_label]) groups[a.cat_label] = {available:[], locked:[]};
    if (isActionAvailable(a)) groups[a.cat_label].available.push(a);
    else groups[a.cat_label].locked.push(a);
  });

  const catOrder = ['재주 행동','유산 행동','기본 행동','운동 행동','곡예 행동','은신 행동','기만 행동','외교 행동','위협 행동','의학 행동','도둑질 행동','자연 행동','생존 행동','제작 행동','공연 행동','지식 행동'];

  let html = '';
  const orderedGroups = [...catOrder.filter(k => groups[k]), ...Object.keys(groups).filter(k => !catOrder.includes(k))];

  orderedGroups.forEach(label => {
    const g = groups[label];
    const all = _actionAvailOnly ? [...g.available] : [...g.available, ...g.locked];
    if (!all.length) return;
    html += `<div style="margin-bottom:12px;"><div class="action-group-title">${label}</div><div class="actions-grid">`;
    all.forEach(a => {
      const avail = isActionAvailable(a);
      const granted = avail && isGrantedAction(a);
      const opacity = avail ? '' : 'opacity:0.45;';
      const grantedStyle = granted ? 'border-left:3px solid var(--accent);background:rgba(100,160,255,0.06);' : '';
      const costIcon = getActionCostIcon(a.cost);
      const traitsHtml = (a.traits||[]).map(t => typeof traitTag==='function' ? traitTag(t) : `<span class="tag">${t}</span>`).join('');
      let reqHtml = '';
      if (!avail) {
        if (a.req_feat) reqHtml = `<div class="action-req">재주 필요: ${a.req_feat_name || a.req_feat}</div>`;
        else if (a.req_heritage) reqHtml = `<div class="action-req">유산 필요</div>`;
        else if (a.req_skill && a.req_rank > 0) {
          const rankNames = {2:'숙련',4:'전문가',6:'달인',8:'전설'};
          const sk = SKILLS.find(s=>s.id===a.req_skill);
          reqHtml = `<div class="action-req">${sk?sk.name:a.req_skill} ${rankNames[a.req_rank]||''} 필요</div>`;
        }
      }
      const sourceHtml = granted ? `<div style="font-size:9px;color:var(--accent);margin-top:2px;">${a.req_heritage ? '유산 부여' : a.req_feat ? '재주: '+(a.req_feat_name || a.req_feat) : ''}</div>` : '';
      // FVTT 이행: 전체 설명=FVTT desc(폴백 레거시 summary). 카드=컴팩트 프리뷰 + 클릭 시 인라인 아코디언.
      const descFull = (s=>typeof resolveDescRefs==='function'?resolveDescRefs(s):s)(_stripTraitLine(a._fvttDesc || a.summary || ''));
      const previewText = descFull.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
      const preview = previewText.slice(0,76) + (previewText.length>76 ? '…' : '');
      html += `<div class="action-card action-card-click" onclick="typeof toggleActionInline==='function'&&toggleActionInline(this)" style="${opacity}${grantedStyle}">
        <div class="action-card-head">
          <span class="action-cost">${costIcon}</span>
          ${a.cat==='feat' && typeof iconImg==='function' ? iconImg('feat',a) : ''}
          <div style="flex:1;min-width:0;">
            <div class="action-name-ko">${a.name_ko}</div>
            <div class="action-name-en">${a.name_en}</div>
          </div>
        </div>
        ${traitsHtml ? `<div class="action-traits">${traitsHtml}</div>` : ''}
        ${preview ? `<div class="action-summary">${preview}</div>` : ''}
        ${sourceHtml}${reqHtml}
      </div>
      <div class="action-inline-detail">${descFull || '<span style="color:var(--text2);">상세 설명이 없습니다.</span>'}</div>`;
    });
    html += `</div></div>`;
  });

  if (!html) html = '<div style="color:var(--text2);padding:16px;">현재 사용 가능한 행동이 없습니다.</div>';
  container.innerHTML = html;
}

