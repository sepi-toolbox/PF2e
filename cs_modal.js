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
        HP를 건강 수정치 × 레벨만큼 회복 (${hpRecover} HP)
      </label>
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);cursor:pointer;">
        <input type="checkbox" id="rest-fatigue" checked style="accent-color:var(--accent);width:18px;height:18px;">
        피로(Fatigued) 상태 해제
      </label>
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);cursor:pointer;">
        <input type="checkbox" id="rest-doomed" checked style="accent-color:var(--accent);width:18px;height:18px;">
        파멸(Doomed)과 쇠약(Drained) 수치 1 감소
      </label>
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);cursor:pointer;">
        <input type="checkbox" id="rest-spells" checked style="accent-color:var(--accent);width:18px;height:18px;">
        주문 슬롯 회복
      </label>
    </div>
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

function applyRest() {
  if (document.getElementById('rest-hp')?.checked) {
    const conMod = Math.max(1, getMod('con'));
    const lv = getLevel();
    const recover = conMod * lv;
    const curEl = document.getElementById('hp-cur');
    const maxEl = document.getElementById('hp-max');
    if (curEl && maxEl) {
      const maxHp = parseInt(maxEl.value || 0);
      curEl.value = Math.min(maxHp, parseInt(curEl.value || 0) + recover);
    }
  }
  if (document.getElementById('rest-fatigue')?.checked) {
    if (state.conditions['피로']) { state.conditions['피로'] = 0; }
  }
  if (document.getElementById('rest-doomed')?.checked) {
    if (state.conditions['파멸'] > 0) state.conditions['파멸'] = Math.max(0, state.conditions['파멸'] - 1);
    if (state.conditions['쇠약'] > 0) state.conditions['쇠약'] = Math.max(0, state.conditions['쇠약'] - 1);
  }
  if (document.getElementById('rest-spells')?.checked) {
    // 주문 슬롯 사용 초기화
    state.spellSlotsUsed = {};
    state.divineFontUsed = 0;
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
    if (c.name === '파손됨') return; // 장비 상태이므로 제외
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
    db2.collection('users').doc(currentUser.uid).collection('characters').doc(currentSlot).delete().then(() => {
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
  const cp = typeof CLASS_PROF_TABLE !== 'undefined' ? CLASS_PROF_TABLE[cls.id] : null;
  if (cp) { for (const [t, p] of Object.entries(cp)) profs[t] = {...p}; }

  if (state.selectedSubclass && typeof SUBCLASS_PROF_TABLE !== 'undefined') {
    const sp = SUBCLASS_PROF_TABLE[state.selectedSubclass.id];
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

  // ── Witch: auto-set spell tradition from patron ──
  if (cls.id === 'witch' && state.selectedSubclass && typeof PATRON_TRADITION !== 'undefined') {
    const trad = PATRON_TRADITION[state.selectedSubclass.id];
    if (trad) {
      const tradEl = document.getElementById('spell-tradition');
      if (tradEl) tradEl.value = trad;
    }
  }

  // ── Auto-granted feats (class + subclass) ──
  // Remove old auto feats
  ['special','class','general','skill','ancestry','other'].forEach(cat => {
    if (!state.feats[cat]) state.feats[cat] = [];
    state.feats[cat] = state.feats[cat].filter(f => !f._auto);
  });
  // Gather all auto feats (CLASS_AUTO_FEATS + SUBCLASS_AUTO_FEATS)
  const classFeats = CLASS_AUTO_FEATS?.[cls.id] || [];
  const subFeats = (state.selectedSubclass && SUBCLASS_AUTO_FEATS) ? (SUBCLASS_AUTO_FEATS[state.selectedSubclass.id]||[]) : [];
  const allAutoFeats = [...classFeats, ...subFeats];
  // Also add CLASS_FEATURE_NAMES as auto-display items in special category
  const featureNames = (typeof CLASS_FEATURE_NAMES !== 'undefined' ? CLASS_FEATURE_NAMES[cls.id] : null) || [];
  const subFeatureNames = (state.selectedSubclass && typeof SUBCLASS_FEATURE_NAMES !== 'undefined')
    ? (SUBCLASS_FEATURE_NAMES[state.selectedSubclass.id]||[]) : [];
  [...featureNames, ...subFeatureNames].forEach(f => {
    if (f.lv <= level && !allAutoFeats.some(a => a.name_ko === f.name_ko)) {
      allAutoFeats.push({lv: f.lv, name_ko: f.name_ko, name_en: f.name_en, category: 'special'});
    }
  });
  console.log('[applyClassFeatures] auto feats:', allAutoFeats.length, 'items for', cls.id);
  allAutoFeats.forEach(f => {
    if (f.lv <= level) {
      const featName = f.name_ko + (f.name_en ? ` (${f.name_en})` : '');
      const cat = f.category || 'special';
      if (!state.feats[cat]) state.feats[cat] = [];
      if (!state.feats[cat].some(e => e.name === featName)) {
        state.feats[cat].push({name: featName, level: f.lv, _auto: true});
      }
    }
  });
  if (typeof renderFeats === 'function') renderFeats();

  // ── Auto-granted spells (class + subclass) ──
  // Remove old auto spells (preserve null slots in cantrip)
  state.spells.cantrip = (state.spells.cantrip||[]).filter(s => s === null || !s?._auto);
  state.spells.focus = (state.spells.focus||[]).filter(s => !s?._auto);
  state.spells.known = (state.spells.known||[]).filter(s => !s?._auto);
  // Gather all auto spells
  const allAutoSpells = [
    ...(typeof CLASS_AUTO_SPELLS!=='undefined' ? (CLASS_AUTO_SPELLS[cls.id]||[]) : []),
    ...(state.selectedSubclass && typeof SUBCLASS_AUTO_SPELLS!=='undefined' ? (SUBCLASS_AUTO_SPELLS[state.selectedSubclass.id]||[]) : []),
  ];
  allAutoSpells.forEach(s => {
    if (s.lv <= level) {
      const spellName = s.name_ko;
      if (s.type === 'cantrip') {
        if (!state.spells.cantrip.some(sp => sp?.name === spellName)) {
          state.spells.cantrip.push({name: spellName, rank:0, _auto: true});
        }
      } else if (s.type === 'focus') {
        if (!state.spells.focus.some(sp => sp?.name === spellName)) {
          state.spells.focus.push({name: spellName, _auto: true});
        }
      } else {
        if (!state.spells.known.some(sp => sp?.name === spellName)) {
          state.spells.known.push({name: spellName, rank: s.rank||1, _auto: true});
        }
      }
    }
  });
  console.log('[applyClassFeatures] auto spells added — focus:', state.spells.focus.length, 'cantrip:', state.spells.cantrip.length);
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

function openDeityPicker() {
  if (typeof DEITY_DB === 'undefined') return;
  const items = DEITY_DB.map(d =>
    `<div class="opt-row" onclick="selectDeity('${d.id}')" style="padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--border);">
      <span class="opt-row-name" style="flex:1;">${d.name_ko} <span style="color:var(--text2);font-size:11px;">${d.name_en}</span></span>
      <span style="font-size:10px;color:var(--text2);">${d.weapon} / ${d.sanctification.map(s=>s==='holy'?'신성':'불경').join('·')}</span>
    </div>`).join('');
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal-title').textContent = '신격 선택';
  const fbar = document.getElementById('modal-filterbar'); if(fbar) fbar.innerHTML='';
  const searchEl = document.getElementById('modal-search'); if(searchEl) searchEl.style.display='none';
  document.getElementById('modal-options').innerHTML = items;
  document.getElementById('modal-detail').innerHTML = '<div class="modal-detail-empty">신격을 선택하면 상세 정보가 표시됩니다.</div>';
  const footer = document.querySelector('.modal-footer');
  if(footer) footer.innerHTML = '<button class="btn btn-cancel" onclick="closeModal()">닫기</button>';
  modalType = 'deity-pick';
}

function selectDeity(id) {
  const d = DEITY_DB.find(x=>x.id===id);
  if(!d) return;
  state.deity = id;
  // Auto-set deity skill
  const skillMap = {society:'사회학',deception:'기만',athletics:'운동',acrobatics:'곡예',survival:'생존',
    intimidation:'위협',medicine:'의학',arcana:'주문학',stealth:'은신',crafting:'공예'};
  if(d.skill && typeof setSkillTrained==='function') setSkillTrained(d.skill);
  // Reset sanctification if deity doesn't support current choice
  if(state.sanctification && !d.sanctification.includes(state.sanctification)) state.sanctification = null;
  // If deity has only one sanctification option, auto-set
  if(d.sanctification.length === 1) state.sanctification = d.sanctification[0];
  closeModal();
  applyClassFeatures();
  renderGrowthPlan();
  recalcAll();
  save();
}

function clearDeity() {
  state.deity = null;
  state.sanctification = null;
  renderGrowthPlan();
  save();
}

function openSanctPicker() {
  if(!state.deity || typeof DEITY_DB==='undefined') return;
  const d = DEITY_DB.find(x=>x.id===state.deity);
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

function openDivineFontPicker() {
  const items = `
    <div class="opt-row" onclick="pickDivineFont('heal')" style="padding:12px;cursor:pointer;border-bottom:1px solid var(--border);">
      <span class="opt-row-name">💚 치유 Heal — 치유 주문 추가 시전 횟수</span></div>
    <div class="opt-row" onclick="pickDivineFont('harm')" style="padding:12px;cursor:pointer;border-bottom:1px solid var(--border);">
      <span class="opt-row-name">💀 해악 Harm — 해악 주문 추가 시전 횟수</span></div>`;
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal-title').textContent = '신성 샘 선택';
  const fbar = document.getElementById('modal-filterbar'); if(fbar) fbar.innerHTML='';
  const searchEl = document.getElementById('modal-search'); if(searchEl) searchEl.style.display='none';
  document.getElementById('modal-options').innerHTML = items;
  document.getElementById('modal-detail').innerHTML = '<div class="modal-detail-empty"><strong>신성 샘</strong><br>매일 추가 주문 슬롯을 받아 치유 또는 해악 주문만 시전할 수 있습니다.</div>';
  const footer = document.querySelector('.modal-footer');
  if(footer) footer.innerHTML = '<button class="btn btn-cancel" onclick="closeModal()">닫기</button>';
  modalType = 'font-pick';
}

function pickDivineFont(val) {
  state.divineFont = val;
  state.divineFontUsed = 0;
  closeModal();
  applyClassFeatures();
  renderGrowthPlan();
  renderSpells();
  save();
}

function clearDivineFont() { state.divineFont = null; state.divineFontUsed = 0; renderGrowthPlan(); renderSpells(); save(); }

function toggleDivineFontSlot(idx) {
  const total = getDivineFontSlots();
  let used = state.divineFontUsed || 0;
  if (idx < used) used = idx;     // un-use: set used count to this index
  else used = idx + 1;            // use: set used count to index+1
  state.divineFontUsed = Math.min(used, total);
  renderSpells();
  save();
}

function getDivineFontSlots() {
  if(!state.divineFont || !state.selectedClass || state.selectedClass.id !== 'cleric') return 0;
  const lv = getLevel();
  const base = (typeof DIVINE_FONT_SLOTS!=='undefined' ? DIVINE_FONT_SLOTS[lv] : null) || (3 + Math.floor(lv/4));
  return base;
}

function onLevelChange() {
  applyClassFeatures();
  renderGrowthPlan();
  updateSpellSlotsForClass();
  save();
}

// ═══════════════════════════════════════════════
//  GROWTH PLAN — Level-by-Level Progression
// ═══════════════════════════════════════════════

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
  html += growthSlotWithClearHTML('ancestry-sel', '🧬', '혈통 Ancestry',
    state.selectedAncestry ? `${state.selectedAncestry.name} (${state.selectedAncestry.en})` : null,
    "openModal('ancestry')", state.selectedAncestry ? "clearCoreSelection('ancestry')" : null);
  // Background selector
  html += growthSlotWithClearHTML('background-sel', '📜', '배경 Background',
    state.selectedBackground ? `${state.selectedBackground.name} (${state.selectedBackground.en})` : null,
    "openModal('background')", state.selectedBackground ? "clearCoreSelection('background')" : null);
  // Class selector
  html += growthSlotWithClearHTML('class-sel', '⚔', '클래스 Class',
    state.selectedClass ? `${state.selectedClass.name} (${state.selectedClass.en})` : null,
    "openModal('class')", state.selectedClass ? "clearCoreSelection('class')" : null);
  html += `</div>`;

  for (let lv = 1; lv <= curLevel; lv++) {
    const plan = GROWTH_TABLE[lv];
    if (!plan) continue;
    const g = state.growth[lv] || {};

    html += `<div class="growth-level-header">레벨 ${lv}<span style="font-size:10px;color:var(--text2);font-weight:400;">Level ${lv}</span></div>`;

    // Class features at this level (auto-display)
    if (state.selectedClass && typeof CLASS_FEATURE_NAMES !== 'undefined') {
      const classFeats = (CLASS_FEATURE_NAMES[state.selectedClass.id]||[]).filter(f => f.lv === lv);
      const subFeats = state.selectedSubclass && typeof SUBCLASS_FEATURE_NAMES !== 'undefined'
        ? (SUBCLASS_FEATURE_NAMES[state.selectedSubclass.id]||[]).filter(f => f.lv === lv) : [];
      const allFeats = [...classFeats, ...subFeats];
      if (allFeats.length > 0) {
        html += `<div class="growth-slot" style="cursor:default;opacity:0.85;border-left:2px solid var(--accent);background:var(--accent-bg);">
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
        html += growthSlotWithClearHTML('heritage-sel', '🛡', '유산 Heritage',
          state.selectedHeritage ? state.selectedHeritage.name_ko : null,
          "openModal('heritage')", state.selectedHeritage ? "clearCoreSelection('heritage')" : null);
      }
      // Languages
      if (state.selectedAncestry) {
        const intMod = Math.max(0, getMod('int'));
        const baseCount = 2; // 공용어 + 혈통어
        const maxLangs = baseCount + intMod;
        const curLangs = (state.languages || []).length;
        const remain = Math.max(0, maxLangs - curLangs);
        const langNames = (state.languages || []).join(', ');
        html += `<div class="growth-slot ${curLangs >= maxLangs ? 'filled' : ''}" onclick="addLanguage()">
          <div class="growth-slot-icon">🗣</div>
          <div class="growth-slot-body">
            <div class="growth-slot-label">언어 Languages</div>
            <div class="growth-slot-value">${curLangs >= maxLangs ? langNames : curLangs + '/' + maxLangs + ' 선택' + (langNames ? ' — ' + langNames : '')}</div>
          </div>
          ${remain > 0 ? `<div class="growth-slot-badge">${remain}</div>` : ''}
        </div>`;
      }

      // Subclass (only if class selected AND has subclasses)
      if (state.selectedClass) {
        const subs = SUBCLASS_DB.filter(s => s.class_id === state.selectedClass.id);
        if (subs.length > 0) {
          const subLabel = subs[0].subclass_type || '서브클래스';
          const subEnMap = {'뮤즈':'Muse','교리':'Doctrine','교단':'Druidic Order','사냥 방식':"Hunter's Edge",'전문':'Racket','후원자':'Patron','마법학파':'Arcane School'};
          const subEn = subEnMap[subLabel] || 'Subclass';
          const subIcon = {'뮤즈':'🎵','교리':'📿','교단':'🌿','사냥 방식':'🏹','전문':'🗡','후원자':'🔮','마법학파':'📖'}[subLabel] || '⚙';
          html += growthSlotWithClearHTML('subclass-sel', subIcon, `${subLabel} ${subEn}`,
            state.selectedSubclass ? `${state.selectedSubclass.name_ko} (${state.selectedSubclass.name_en})` : null,
            "openModal('subclass')", state.selectedSubclass ? "clearCoreSelection('subclass')" : null);
        }
      }
      // ── Class-specific L1 build choices ──
      if (state.selectedClass) {
        const cid = state.selectedClass.id;

        // CLERIC: Deity selector
        if (cid === 'cleric' && typeof DEITY_DB !== 'undefined') {
          const deityObj = state.deity ? DEITY_DB.find(d=>d.id===state.deity) : null;
          html += growthSlotWithClearHTML('deity-sel', '🙏', '신격 Deity',
            deityObj ? `${deityObj.name_ko} (${deityObj.name_en})` : null,
            "openDeityPicker()", state.deity ? "clearDeity()" : null);

          // Sanctification (only if deity selected)
          if (deityObj) {
            const sanctOpts = deityObj.sanctification || [];
            if (sanctOpts.length > 0) {
              const sanctLabel = state.sanctification === 'holy' ? '신성 Holy' : state.sanctification === 'unholy' ? '불경 Unholy' : null;
              html += growthSlotWithClearHTML('sanct-sel', '✨', '성별화 Sanctification',
                sanctLabel, "openSanctPicker()", state.sanctification ? "clearSanctification()" : null);
            }
          }

          // Divine Font
          const fontLabel = state.divineFont === 'heal' ? '치유 Heal' : state.divineFont === 'harm' ? '해악 Harm' : null;
          html += growthSlotWithClearHTML('font-sel', '⛲', '신성 샘 Divine Font',
            fontLabel, "openDivineFontPicker()", state.divineFont ? "clearDivineFont()" : null);
        }

        // WITCH: Show patron tradition (auto-set, display only)
        if (cid === 'witch' && state.selectedSubclass && typeof PATRON_TRADITION !== 'undefined') {
          const trad = PATRON_TRADITION[state.selectedSubclass.id];
          if (trad) {
            const tradNames = {arcane:'비전',divine:'신성',occult:'비의',primal:'원시'};
            html += `<div class="growth-slot filled" style="cursor:default;">
              <div class="growth-slot-icon">🔮</div>
              <div class="growth-slot-body">
                <div class="growth-slot-label">후원자 전통 Patron Tradition</div>
                <div class="growth-slot-value">${tradNames[trad]||trad} (${trad})</div>
              </div></div>`;
          }
        }
      }

      // Background skill feat (auto-granted, display only)
      if (g.bgSkillFeat) {
        html += `<div class="growth-slot filled" style="cursor:default;">
          <div class="growth-slot-icon">📚</div>
          <div class="growth-slot-body">
            <div class="growth-slot-label">배경 기술 재주 Background Skill Feat</div>
            <div class="growth-slot-value">${g.bgSkillFeat}</div>
          </div>
        </div>`;
      }

      // Skill Training at level 1 (single card, multi-select modal)
      const numSlots = state.trainableSkillSlots || 0;
      if (numSlots > 0) {
        const trainArr = (g.skillTraining || []).filter(v => v);
        const filledCount = trainArr.length;
        const allFilled = filledCount >= numSlots;
        const displayNames = trainArr.map(id => { const sk = SKILLS.find(s=>s.id===id); return sk ? sk.name : id; }).join(', ');
        html += `<div class="growth-slot ${allFilled ? 'filled' : ''}" onclick="growthPickSkillTrainingMulti()">
          <div class="growth-slot-icon">📖</div>
          <div class="growth-slot-body">
            <div class="growth-slot-label">기술 훈련 Skill Training</div>
            <div class="growth-slot-value">${allFilled ? displayNames : filledCount + '/' + numSlots + ' 선택' + (displayNames ? ' — ' + displayNames : '')}</div>
          </div>
          <div class="growth-slot-badge">${numSlots}</div>
          ${filledCount > 0 ? '<span class="spell-del" onclick="event.stopPropagation();growthClearAllSkillTraining();" style="color:var(--red);font-size:14px;padding:0 4px;cursor:pointer;">✕</span>' : ''}
        </div>`;
      }
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

    // Ancestry Feat
    if (plan.ancestryFeat) {
      html += growthFeatSlotHTML(lv, 'ancestryFeat', '🧬', '혈통 재주 Ancestry Feat', 'ancestry', g.ancestryFeat);
    }

    // Class Feat
    if (plan.classFeat) {
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
  }

  container.innerHTML = html;

  // Also update the mobile growth panel
  const mobileContainer = document.getElementById('growth-plan-mobile');
  if (mobileContainer) mobileContainer.innerHTML = html;
  } catch(e) { console.error('renderGrowthPlan error:', e); container.innerHTML = '<div style="color:red;padding:8px;">성장 플랜 렌더링 오류: '+e.message+'</div>'; }
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
  const clickAction = value ? `showInfo('feat','${(value||'').replace(/'/g,"\\'")}')` : `growthPickFeat(${lv},'${key}','${featType}')`;
  return `<div class="growth-slot ${filled}" onclick="${clickAction}">
    <div class="growth-slot-icon">${icon}</div>
    <div class="growth-slot-body">
      <div class="growth-slot-label">${label}</div>
      <div class="growth-slot-value">${display}</div>
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
    // Remove from state.feats as well
    const arr = state.feats[featType];
    if (arr) {
      const idx = arr.findIndex(f => f.name === oldName && f.level === lv);
      if (idx >= 0) arr.splice(idx, 1);
    }
  }
  delete state.growth[lv][key];
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

function growthSkillTrainingChanged(slotIndex, value) {
  if (!state.growth[1]) state.growth[1] = {};
  if (!state.growth[1].skillTraining) state.growth[1].skillTraining = [];
  const oldVal = state.growth[1].skillTraining[slotIndex] || null;
  // Un-train old skill if it was set (only if no other source trained it)
  if (oldVal) {
    const el = document.getElementById('sk-prof-' + oldVal);
    if (el && el.value === '2') {
      // Check if any other training slot or fixed class skill uses it
      const otherSlots = (state.growth[1].skillTraining || []).filter((v, i) => v === oldVal && i !== slotIndex);
      if (otherSlots.length === 0) {
        el.value = '0';
      }
    }
  }
  state.growth[1].skillTraining[slotIndex] = value || null;
  // Train new skill
  if (value) {
    const el = document.getElementById('sk-prof-' + value);
    if (el && parseInt(el.value) < 2) el.value = '2';
  }
  recalcSkills();
  syncAllProfRanks();
  renderGrowthPlan();
  save();
}

function growthSkillIncreaseChanged(lv, value) {
  if (!state.growth[lv]) state.growth[lv] = {};
  const oldVal = state.growth[lv].skillIncrease || null;
  // Revert old skill increase
  if (oldVal) {
    const el = document.getElementById('sk-prof-' + oldVal);
    if (el) {
      const curRank = parseInt(el.value || 0);
      if (curRank >= 4) el.value = String(curRank - 2);
    }
  }
  state.growth[lv].skillIncrease = value || null;
  // Apply new skill increase (bump proficiency by one step)
  if (value) {
    const el = document.getElementById('sk-prof-' + value);
    if (el) {
      const curRank = parseInt(el.value || 0);
      if (curRank < 8) el.value = String(curRank + 2);
    }
  }
  recalcSkills();
  syncAllProfRanks();
  renderGrowthPlan();
  save();
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
  openSkillPickModal('기술 훈련 선택', available);
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
  document.getElementById('modal-title').textContent = `기술 훈련 선택 (${alreadySelected.length}/${numSlots})`;
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
//  MODAL SYSTEM
// ═══════════════════════════════════════════════

let modalContext = null;

function openModal(type, ctx) {
  modalType = type;
  modalContext = ctx || null;
  modalSelected = null;

  // 부스트 모달은 별도 처리
  if (type === 'boost') { openBoostModal(); return; }

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

  renderOptions(getOptionsData(type));
}

function getOptionsData(type) {
  if (type==='class') return CLASSES;
  if (type==='ancestry') return ANCESTRIES;
  if (type==='background') return BACKGROUNDS;
  if (type==='heritage') return HERITAGE_DB.filter(h => h.ancestry === '*' || !state.selectedAncestry || h.ancestry === state.selectedAncestry.id);
  if (type==='subclass') return state.selectedClass ? SUBCLASS_DB.filter(s => s.class_id === state.selectedClass.id) : [];
  if (type==='feat') return filterFeats();
  if (type==='spell') return filterSpells();
  if (type==='weapon' || type==='equip-weapon') return filterWeapons();
  if (type==='armor' || type==='equip-armor') return typeof ARMOR_DB!=='undefined' ? ARMOR_DB : [];
  if (type==='shield' || type==='equip-shield') return typeof SHIELD_DB!=='undefined' ? SHIELD_DB : [];
  if (type==='equip-gear') return typeof GEAR_DB!=='undefined' ? GEAR_DB : [];
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
    const cats = [...new Set((typeof FEAT_DB!=='undefined'?FEAT_DB:[]).map(f=>f.category))].sort();
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
  const cats = [...new Set((typeof WEAPON_DB!=='undefined'?WEAPON_DB:[]).map(w=>w.category))].sort();
  fbar.innerHTML = `
    <select id="filter-wpn-cat" onchange="renderOptions(getOptionsData('weapon'))">
      <option value="">전체 분류</option>
      ${cats.map(c=>`<option value="${c}">${c}</option>`).join('')}
    </select>`;
}

function filterFeats() {
  if (typeof FEAT_DB==='undefined') return [];
  const q = document.getElementById('modal-search')?.value.toLowerCase()||'';
  const fromGrowth = !!growthPendingKey;

  // 성장 빌더에서 호출 시: growthPendingFeatType + growthPendingLevel 기준
  if (fromGrowth) {
    const ft = growthPendingFeatType;
    const maxLv = growthPendingLevel || getLevel();
    let cat = ft;
    // class → 선택된 클래스 id
    if (ft === 'class' && state.selectedClass) cat = state.selectedClass.id;

    return FEAT_DB.filter(f => {
      if (q && !f.name_ko.includes(q) && !(f.name_en||'').toLowerCase().includes(q) && !(f.summary||'').includes(q)) return false;
      if (f.feat_level > maxLv) return false;
      if (ft === 'ancestry') {
        // 혈통 재주: ancestry 카테고리 + 선택된 혈통 trait 일치
        if (f.category !== 'ancestry') return false;
        if (state.selectedAncestry) {
          const ancTraits = state.selectedAncestry.traits || [];
          return f.traits && f.traits.some(t => ancTraits.includes(t));
        }
        return true;
      }
      return f.category === cat;
    });
  }

  // 일반 모달 (재주 탭에서 직접 열기)
  const cat = document.getElementById('filter-feat-cat')?.value||'';
  const lv = parseInt(document.getElementById('filter-feat-lv')?.value||0);
  return FEAT_DB.filter(f =>
    (!cat || f.category===cat) &&
    (!lv || f.feat_level<=lv) &&
    (!q || f.name_ko.includes(q) || (f.name_en||'').toLowerCase().includes(q) || (f.summary||'').includes(q))
  );
}

function filterSpells() {
  if (typeof SPELL_DB==='undefined') return [];
  const q = document.getElementById('modal-search')?.value.toLowerCase()||'';
  const classTrad = state.selectedClass?.tradition || '';
  const pending = typeof _spellSlotPending !== 'undefined' ? _spellSlotPending : null;
  const slotType = pending?.type || '';  // 'cantrip', 'known', 'focus'
  const slotRank = pending?.rank || 0;

  return SPELL_DB.filter(sp => {
    // 클래스 전통 필터 (any면 모두 허용)
    if (classTrad && classTrad !== 'any' && sp.traditions && !sp.traditions.includes(classTrad)) return false;
    // 슬롯 타입별 필터
    if (slotType === 'cantrip' && !sp.is_cantrip) return false;
    if (slotType === 'focus' && !sp.is_focus) return false;
    if (slotType === 'known') {
      if (sp.is_cantrip || sp.is_focus) return false;
      if (slotRank > 0 && sp.rank !== slotRank) return false;
    }
    // 검색어
    if (q && !sp.name_ko.includes(q) && !sp.name_en.toLowerCase().includes(q)) return false;
    return true;
  });
}

function filterWeapons() {
  if (typeof WEAPON_DB==='undefined') return [];
  const q = document.getElementById('modal-search')?.value.toLowerCase()||'';
  const cat = document.getElementById('filter-wpn-cat')?.value||'';
  return WEAPON_DB.filter(w =>
    (!cat || w.category===cat) &&
    (!q || w.name_ko.includes(q) || (w.name_en||'').toLowerCase().includes(q))
  );
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
    grouped = {};
    data.forEach(item => {
      const key = item.versatile ? '🌟 다재다능한 유산 / 혼합 혈통' : '🧬 혈통 유산';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
  } else if (modalType === 'spell') {
    grouped = {};
    data.forEach(item => {
      const key = item.is_cantrip ? '캔트립' : item.is_focus ? '집중 주문' : `랭크 ${item.rank} 주문`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
  } else if (isFeat) {
    grouped = {};
    data.forEach(item => {
      const key = `${item.feat_level}레벨`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
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
    const selected = modalSelected?.id === item.id || modalSelected?.name_ko === item.name_ko;
    row.className = 'opt-row' + (selected ? ' selected' : '');

    // Level/rank badge
    let levelNum = 0;
    let levelText = '';
    if (item.feat_level !== undefined) { levelNum = item.feat_level; levelText = item.feat_level; }
    else if (item.rank !== undefined) { levelNum = item.is_cantrip ? 0 : item.rank; levelText = item.is_cantrip ? 'C' : item.rank; }
    else if (modalType === 'equip-browse' && item.price && item.price !== '—') { levelNum = 0; levelText = item.price; }

    // Action icons
    let actionsHtml = '';
    if (item.actions) {
      const a = item.actions;
      if (a.includes('1행동') || a === '1') actionsHtml = '◆';
      else if (a.includes('2행동') || a === '2') actionsHtml = '◆◆';
      else if (a.includes('3행동') || a === '3') actionsHtml = '◆◆◆';
      else if (a.includes('반응')) actionsHtml = '↩';
      else if (a.includes('자유')) actionsHtml = '⟡';
      else actionsHtml = a;
    }

    const rClass = `r${Math.min(levelNum, 10)}`;
    row.innerHTML = `
      <div class="opt-row-icon">📄</div>
      <span class="opt-row-name">${nameKo}</span>
      ${actionsHtml ? `<span class="opt-row-actions">${actionsHtml}</span>` : ''}
      ${levelText !== '' ? `<span class="opt-row-level ${rClass}">${levelText}</span>` : ''}`;

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
      const p = i.price && i.price !== '—' ? `<div><strong>가격:</strong> ${i.price}</div>` : '';
      const b = `<div><strong>부피:</strong> ${i.bulk==='L'?'L':i.bulk==='—'?'—':i.bulk}</div>`;
      const d = i.damage ? `<div><strong>피해:</strong> ${i.damage}</div>` : '';
      const ac = i.ac_bonus!==undefined ? `<div><strong>AC:</strong> +${i.ac_bonus}</div>` : '';
      const traits = (i.traits||[]).length ? `<div style="margin-top:4px;">${i.traits.map(t=>traitTag(t)).join(' ')}</div>` : '';
      detailHtml = `${p}${b}${d}${ac}${traits}
        <div style="display:flex;gap:6px;margin-top:8px;">
          ${modalType === 'formula-pick'
            ? `<button onclick="recordFormula('${(item.name_ko||item.name||'').replace(/'/g,"\\\\'")}')" style="flex:1;padding:8px;background:var(--accent-bg);border:1px solid var(--accent);border-radius:4px;color:var(--accent);cursor:pointer;">📜 제조법 기록</button>`
            : `<button class="btn-give" onclick="equipBrowseGive()" style="flex:1;padding:8px;background:var(--bg4);border:1px solid var(--border2);border-radius:4px;color:var(--text);cursor:pointer;">획득</button>
               <button class="btn-buy" onclick="equipBrowseBuy()" style="flex:1;padding:8px;background:var(--accent-bg);border:1px solid var(--accent);border-radius:4px;color:var(--accent);cursor:pointer;">구매</button>`}
        </div>`;
    } else {
      const nameKo = item.name || item.name_ko || '';
      const desc = item.desc || item.summary || '';
      let tags = '';
      if (item.feat_level !== undefined) tags = `<span class="tag hl">${item.feat_level}레벨</span> <span class="tag">${item.category||''}</span>`;
      else if (item.rank !== undefined) tags = `<span class="tag hl">${item.is_cantrip?'캔트립':'랭크 '+item.rank}</span>`;
      else if (item.damage) tags = `<span class="tag hl">${item.damage}</span> <span class="tag">가격: ${item.price||'-'}</span>`;
      else if (item.ac_bonus !== undefined) tags = `<span class="tag hl">AC+${item.ac_bonus}</span>`;
      detailHtml = `${tags?'<div style="margin-bottom:6px;">'+tags+'</div>':''}
        <div style="font-size:12px;line-height:1.6;">${desc}</div>`;
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
      // Confirm button for non-equip modals
      if (modalType !== 'equip-browse' && modalType !== 'deity-pick' && modalType !== 'sanct-pick' && modalType !== 'font-pick') {
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

function showItemDetail(item) {
  const detail = document.getElementById('modal-detail');
  if (!detail) return;

  const nameKo = item.name || item.name_ko || '';
  const nameEn = item.en || item.name_en || '';
  const desc = item.desc || item.summary || '';

  let tags = '';
  if (item.feat_level !== undefined) {
    tags = `<span class="tag hl">${item.feat_level}레벨</span>
            <span class="tag">${item.category||''}</span>
            ${(item.traits||[]).map(t=>traitTag(t)).join('')}
            ${item.prerequisites?`<span class="tag" style="color:var(--accent);">선행: ${item.prerequisites}</span>`:''}`;
  } else if (item.rank !== undefined) {
    const rankStr = item.is_cantrip?'캔트립':item.is_focus?'집중':`랭크 ${item.rank}`;
    tags = `<span class="tag hl">${rankStr}</span>
            <span class="spell-actions">${item.actions||''}</span>
            ${(item.traditions||[]).map(t=>traitTag(t)).join('')}
            ${(item.traits||[]).map(t=>traitTag(t)).join('')}`;
  } else if (item.damage !== undefined) {
    tags = `<span class="tag hl">${item.damage||''}</span>
            <span class="tag">${item.category||''}</span>
            <span class="tag">가격: ${item.price||'-'}</span>
            ${(item.traits||[]).map(t=>traitTag(t)).join('')}`;
  } else if (item.ac_bonus !== undefined) {
    tags = `<span class="tag hl">AC+${item.ac_bonus}</span>
            <span class="tag">${item.category||''}</span>
            ${item.dex_cap!==null&&item.dex_cap!==undefined?`<span class="tag">DEX상한: ${item.dex_cap}</span>`:''}
            ${item.hardness!==undefined?`<span class="tag">경도: ${item.hardness}</span>`:''}
            ${item.hp!==undefined&&item.bt!==undefined?`<span class="tag">HP: ${item.hp} (BT: ${item.bt})</span>`:''}
            ${item.speed_penalty?`<span class="tag" style="color:var(--red-light);">속도: ${item.speed_penalty}</span>`:''}
            <span class="tag">가격: ${item.price||'-'}</span>`;
  } else if (item.hp !== undefined && item.keyAttr !== undefined) {
    tags = `<span class="tag hl">HP ${item.hp}+CON</span>
            <span class="tag hl">${item.keyAttr}</span>
            ${item.tradition?`<span class="tag">${item.tradition} 주문</span>`:''}`;
  } else if (item.boosts && item.flaws) {
    tags = `<span class="tag hl">HP ${item.hp}</span>
            <span class="tag">${item.size}/${item.speed}피트</span>
            ${item.boosts.map(b=>`<span class="tag hl">${b}</span>`).join('')}`;
  } else if (item.subclass_type) {
    tags = `<span class="tag hl">${item.subclass_type}</span>`;
  }

  detail.innerHTML = `
    <div class="modal-detail-back" onclick="document.getElementById('modal-body').classList.remove('detail-open')">← 목록으로</div>
    <div class="modal-detail-title">${nameKo}</div>
    <div class="modal-detail-en">${nameEn}</div>
    <div class="modal-detail-tags">${tags}</div>
    <div class="modal-detail-desc">${desc}</div>`;
}

function filterOptions() {
  if (modalType === 'equip-browse' || modalType === 'formula-pick') { renderEquipBrowseItems(); return; }
  renderOptions(getOptionsData(modalType));
}

// ═══════════════════════════════════════════════
//  CASCADE RESET FUNCTIONS
// ═══════════════════════════════════════════════

function resetFromClass() {
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
  // Reset spell tradition/type
  const tradEl = document.getElementById('spell-tradition');
  if (tradEl) tradEl.value = '';
  const typeEl = document.getElementById('spell-type');
  if (typeEl) typeEl.value = '';
  recalcAll();
  renderFeats();
  renderGrowthPlan();
}

function resetFromAncestry() {
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
  // Reset vision/size
  state.vision = '없음';
  state.size = '중형';
  // Clear languages/traits textarea
  const langEl = document.getElementById('f-languages');
  if (langEl) langEl.value = '';
  recalcAll();
  renderFeats();
  renderGrowthPlan();
}

function resetFromBackground() {
  // Reset background boosts
  state.boosts.bg = [];
  // Remove auto-granted background feat from skill feats
  if (state.growth[1] && state.growth[1].bgSkillFeat) {
    const bgFeatName = state.growth[1].bgSkillFeat;
    const idx = state.feats.skill.findIndex(f => f.name === bgFeatName && f.level === 1);
    if (idx >= 0) state.feats.skill.splice(idx, 1);
    delete state.growth[1].bgSkillFeat;
  }
  // Reset background-related skill training (clear notes)
  const notesEl = document.getElementById('f-notes');
  if (notesEl && notesEl.value.startsWith('[배경:')) notesEl.value = '';
  recalcAll();
  renderFeats();
  renderGrowthPlan();
}

function resetFromSubclass() {
  state.selectedSubclass = null;
  const subBtn = document.getElementById('btn-subclass');
  if (subBtn) { subBtn.textContent = '서브클래스...'; subBtn.classList.remove('filled'); }
  renderGrowthPlan();
  save();
}

function clearCoreSelection(type) {
  if (type === 'class') {
    if (state.selectedClass && !confirm('클래스를 변경하면 모든 빌드 선택이 초기화됩니다. 계속하시겠습니까?')) return;
    resetFromClass();
    state.selectedClass = null;
    const btn = document.getElementById('btn-class');
    if (btn) { btn.textContent = '클래스 선택...'; btn.classList.remove('filled'); }
    renderGrowthPlan();
    save();
  } else if (type === 'ancestry') {
    if (state.selectedAncestry && !confirm('혈통을 변경하면 혈통 관련 선택이 초기화됩니다. 계속하시겠습니까?')) return;
    resetFromAncestry();
    state.selectedAncestry = null;
    const btn = document.getElementById('btn-ancestry');
    if (btn) { btn.textContent = '혈통 선택...'; btn.classList.remove('filled'); }
    renderGrowthPlan();
    save();
  } else if (type === 'background') {
    if (state.selectedBackground && !confirm('배경을 변경하면 배경 관련 선택이 초기화됩니다. 계속하시겠습니까?')) return;
    resetFromBackground();
    state.selectedBackground = null;
    const btn = document.getElementById('btn-background');
    if (btn) { btn.textContent = '배경 선택...'; btn.classList.remove('filled'); }
    renderGrowthPlan();
    save();
  } else if (type === 'heritage') {
    state.selectedHeritage = null;
    const btn = document.getElementById('btn-heritage');
    if (btn) { btn.textContent = '유산...'; btn.classList.remove('filled'); }
    renderGrowthPlan();
    save();
  } else if (type === 'subclass') {
    resetFromSubclass();
  }
}

function confirmModal() {
  if (modalType === 'skill-multi') { closeModal(); return; } // multi-select handled inline
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
  } else if (modalType==='background') {
    // Cascade reset if changing background
    if (state.selectedBackground && state.selectedBackground.id !== modalSelected.id) {
      if (!confirm('배경을 변경하면 배경 관련 선택이 초기화됩니다. 계속하시겠습니까?')) { closeModal(); return; }
      resetFromBackground();
    }
    state.selectedBackground = modalSelected;
    const btnB = document.getElementById('btn-background');
    if (btnB) { btnB.textContent = `${modalSelected.name} (${modalSelected.en})`; btnB.classList.add('filled'); }
    applyBackgroundInfo(modalSelected);
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
        if (arr) { const idx = arr.findIndex(f => f.name === oldName && f.level === gLv); if (idx >= 0) arr.splice(idx, 1); }
      }
      state.growth[gLv][gKey] = featName;
      state.feats[type].push({name: featName, level: gLv});
      growthPendingLevel = null;
      growthPendingKey = null;
      growthPendingFeatType = null;
      renderGrowthPlan();
    } else {
      state.feats[type].push({name: featName, level: featLevel});
    }
    renderFeats();
  } else if (modalType==='spell') {
    const sp = modalSelected;
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
    applyClassFeatures();
    renderGrowthPlan();
  } else if (modalType==='heritage') {
    state.selectedHeritage = modalSelected;
    const btn = document.getElementById('btn-heritage');
    if (btn) { btn.textContent = modalSelected.name_ko; btn.classList.add('filled'); }
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
    addEquip({name: g.name_ko, qty:1, bulk: typeof g.bulk==='number'?g.bulk:(g.bulk==='L'?0.1:0)});
  }
  recalcAll();
  closeModal();
  save();
}

function closeModal() {
  const wasBoost = (modalType === 'boost');
  document.getElementById('modal-overlay').classList.add('hidden');
  // Clean up equip-browse
  const eqTabs = document.getElementById('equip-tab-container');
  if (eqTabs) eqTabs.style.display = 'none';
  const footer = document.querySelector('.modal-footer');
  if (footer && !footer.querySelector('.btn-confirm')) {
    footer.innerHTML = '<button class="btn btn-cancel" onclick="closeModal()">취소</button><button class="btn btn-confirm" onclick="confirmModal()">선택</button>';
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
  // Mobile: reset detail-open
  const body = document.getElementById('modal-body');
  if (body) body.classList.remove('detail-open');
  // 부스트 모달 닫을 때 성장 계획 + 수치 갱신
  if (wasBoost) { renderGrowthPlan(); recalcAll(); }
}

document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
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

  // Auto-set class key attribute boost
  const key = parseAttrKey(cls.keyAttr);
  if (key) state.boosts.cls = key;
  // Auto-set fixed class skill proficiencies
  parseFixedSkills(cls.skills || '').forEach(name => {
    const id = skillNameToId(name);
    if (id) setSkillTrained(id);
  });
  // Parse trainable skill slot count (e.g. '4+INT개' from '오컬티즘, 공연 + 4+INT개')
  const skillParts = (cls.skills || '').split(' + ');
  let trainableSlots = 0;
  for (const p of skillParts) {
    const m = p.match(/(\d+)\+INT개/);
    if (m) { trainableSlots = parseInt(m[1]); break; }
  }
  state.trainableSkillSlots = trainableSlots;
  updateHP();
  updateSpellSlotsForClass();
  recalcSkills();
}

function applyAncestryDefaults(anc) {
  const speedEl = document.getElementById('speed');
  if (speedEl) speedEl.value = anc.speed;
  // Save vision and size to state
  state.vision = anc.vision || '없음';
  state.size = anc.size || '중형';
  const langEl = document.getElementById('f-languages');
  if (langEl && !langEl.value) {
    langEl.value = `특성: ${anc.traits.join(', ')}\n크기: ${anc.size}\n시야: ${anc.vision}\n${anc.specials.join('\n')}`;
  }
  // Parse ancestry boosts/flaws from format like ['건강(CON)','지혜(WIS)','자유']
  const fixed = [], flaws = [];
  for (const b of anc.boosts) {
    const k = parseAttrKey(b);
    if (k) fixed.push(k);
  }
  for (const f of anc.flaws) {
    const k = parseAttrKey(f);
    if (k) flaws.push(k);
  }
  state.boosts.ancFixed = fixed;
  state.boosts.ancFlaw = flaws;
  state.boosts.ancFree = []; // reset free boost
  updateHP();
}

function applyBackgroundInfo(bg) {
  // Show info in notes if empty
  const notesEl = document.getElementById('f-notes');
  if (notesEl && !notesEl.value) {
    notesEl.value = `[배경: ${bg.name}]\n속성 부스트: ${bg.boosts}\n기술: ${bg.skills}\n기술 재주: ${bg.feat}`;
  }
  // Auto-set background skill proficiencies
  if (bg.skills) {
    let loreUsed = 0;
    bg.skills.split(', ').forEach(skillName => {
      const s = skillName.trim();
      // Skip choice skills (contains '또는')
      if (s.includes('또는')) return;
      // Skip slash-separated choices (e.g. '주문학/자연학/오컬티즘/종교학 중 선택')
      if (s.includes('/') || s.includes('중 선택')) return;
      if (s.endsWith(' 지식') || s === '필사 지식' || s.includes('지식')) {
        const loreName = s.replace(' 지식', '').trim();
        const loreId = loreUsed === 0 ? 'lore1' : 'lore2';
        setSkillTrained(loreId);
        const loreNameEl = document.getElementById('lore-name-' + loreId);
        if (loreNameEl && !loreNameEl.value) loreNameEl.value = loreName;
        loreUsed++;
      } else {
        const id = skillNameToId(s);
        if (id) setSkillTrained(id);
      }
    });
  }
  // Auto-set background skill feat
  if (bg.feat) {
    const featName = bg.feat.trim();
    // Don't add if it contains a choice indicator
    if (featName && !featName.includes('/') && !featName.includes('또는')) {
      // Avoid duplicates
      const alreadyHas = state.feats.skill.some(f => f.name === featName);
      if (!alreadyHas) {
        state.feats.skill.push({name: featName, level: 1});
        // Also store in growth plan Level 1
        if (!state.growth[1]) state.growth[1] = {};
        state.growth[1].bgSkillFeat = featName;
        renderFeats();
        renderGrowthPlan();
      }
    }
  }
  recalcSkills();
}

function updateSpellSlotsForClass() {
  if (!state.selectedClass || !state.selectedClass.casting) return;
  const lv = getLevel();
  // PF2e caster slots by level (rank 1-10)
  const slots = [
    [2,0,0,0,0,0,0,0,0,0],  // lv1
    [3,0,0,0,0,0,0,0,0,0],  // lv2
    [3,2,0,0,0,0,0,0,0,0],  // lv3
    [3,3,0,0,0,0,0,0,0,0],  // lv4
    [3,3,2,0,0,0,0,0,0,0],  // lv5
    [3,3,3,0,0,0,0,0,0,0],  // lv6
    [3,3,3,2,0,0,0,0,0,0],  // lv7
    [3,3,3,3,0,0,0,0,0,0],  // lv8
    [3,3,3,3,2,0,0,0,0,0],  // lv9
    [3,3,3,3,3,0,0,0,0,0],  // lv10
    [3,3,3,3,3,2,0,0,0,0],  // lv11
    [3,3,3,3,3,3,0,0,0,0],  // lv12
    [3,3,3,3,3,3,2,0,0,0],  // lv13
    [3,3,3,3,3,3,3,0,0,0],  // lv14
    [3,3,3,3,3,3,3,2,0,0],  // lv15
    [3,3,3,3,3,3,3,3,0,0],  // lv16
    [3,3,3,3,3,3,3,3,2,0],  // lv17
    [3,3,3,3,3,3,3,3,3,0],  // lv18
    [3,3,3,3,3,3,3,3,3,1],  // lv19
    [3,3,3,3,3,3,3,3,3,1],  // lv20
  ];
  const row = slots[Math.min(lv,20)-1] || slots[0];
  state.spellSlots = state.spellSlots || {};
  for (let r=1; r<=10; r++) {
    state.spellSlots[r] = row[r-1] || 0;
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

function setActionFilter(f, btn) {
  _actionFilter = f;
  document.querySelectorAll('#action-filter-bar button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderActions();
}

const COST_ICON = {'1':'◆','2':'◆◆','3':'◆◆◆','reaction':'↺','free':'◇','passive':'—','varies':'✦','10min':'10분','1min':'1분','1h':'1시간','1day':'1일','8h':'8시간'};

function getActionCostIcon(cost) {
  return COST_ICON[cost] || cost;
}

function getSkillRank(skillId) {
  const el = document.getElementById('sk-prof-' + skillId);
  return el ? parseInt(el.value) || 0 : 0;
}

function getLearnedFeatNames() {
  const names = new Set();
  Object.values(state.feats).forEach(arr => {
    arr.forEach(f => {
      if (f.name) names.add(f.name.split(' (')[0].trim());
    });
  });
  return names;
}

function isActionAvailable(action) {
  if (action.req_feat) {
    const learned = getLearnedFeatNames();
    if (!learned.has(action.req_feat)) return false;
  }
  if (action.req_skill) {
    if (getSkillRank(action.req_skill) < action.req_rank) return false;
  }
  return true;
}

function renderActions() {
  const container = document.getElementById('actions-content');
  if (!container) return;

  // Conditions reference tab
  if (_actionFilter === 'conditions') {
    let html = '';
    CONDITIONS_DATA.forEach(c => {
      const val = state.conditions[c.name] || 0;
      const isActive = c.valued ? val > 0 : !!val;
      const maxStr = c.valued ? ` (최대 ${c.max||4})` : '';
      html += `<div style="padding:8px 10px;border-bottom:1px solid var(--border);${isActive?'background:var(--red-bg);border-left:3px solid var(--red);':''}">
        <div style="display:flex;align-items:center;gap:6px;">
          <strong style="font-size:13px;${isActive?'color:var(--red-light);':''}">${c.name}</strong>
          <span style="font-size:11px;color:var(--text2);">${c.en}${maxStr}</span>
          ${isActive?`<span style="margin-left:auto;font-size:11px;color:var(--red);font-weight:700;">${c.valued?'수치 '+val:'적용 중'}</span>`:''}
        </div>
        <div style="font-size:12px;color:var(--text);line-height:1.6;margin-top:4px;">${c.desc}</div>
      </div>`;
    });
    container.innerHTML = html;
    return;
  }

  // Filter
  let visible = ACTION_DB.filter(a => {
    if (_actionFilter !== 'all') {
      if (_actionFilter === 'reaction') {
        if (a.cost !== 'reaction') return false;
      } else if (_actionFilter !== a.cat) {
        return false;
      }
    }
    return true;
  });

  // Group by cat_label, separate available vs locked
  const groups = {};
  visible.forEach(a => {
    if (!groups[a.cat_label]) groups[a.cat_label] = {available:[], locked:[]};
    if (isActionAvailable(a)) groups[a.cat_label].available.push(a);
    else groups[a.cat_label].locked.push(a);
  });

  const catOrder = ['기본 행동','운동 행동','곡예 행동','은신 행동','기만 행동','외교 행동','위협 행동','의학 행동','도둑질 행동','자연 행동','생존 행동','제작 행동','공연 행동','지식 행동','재주 행동'];

  let html = '';
  const orderedGroups = [...catOrder.filter(k => groups[k]), ...Object.keys(groups).filter(k => !catOrder.includes(k))];

  orderedGroups.forEach(label => {
    const g = groups[label];
    const all = [...g.available, ...g.locked];
    if (!all.length) return;
    html += `<div style="margin-bottom:12px;"><div class="action-group-title">${label}</div><div class="actions-grid">`;
    all.forEach(a => {
      const avail = isActionAvailable(a);
      const opacity = avail ? '' : 'opacity:0.45;';
      const costIcon = getActionCostIcon(a.cost);
      const traitsHtml = (a.traits||[]).map(t => `<span class="tag">${t}</span>`).join('');
      let reqHtml = '';
      if (!avail) {
        if (a.req_feat) reqHtml = `<div class="action-req">재주 필요: ${a.req_feat}</div>`;
        else if (a.req_skill && a.req_rank > 0) {
          const rankNames = {2:'숙련',4:'전문가',6:'달인',8:'전설'};
          const sk = SKILLS.find(s=>s.id===a.req_skill);
          reqHtml = `<div class="action-req">${sk?sk.name:a.req_skill} ${rankNames[a.req_rank]||''} 필요</div>`;
        }
      }
      html += `<div class="action-card" style="${opacity}">
        <div class="action-card-head">
          <span class="action-cost">${costIcon}</span>
          <div style="flex:1;min-width:0;">
            <div class="action-name-ko">${a.name_ko}</div>
            <div class="action-name-en">${a.name_en}</div>
          </div>
        </div>
        ${traitsHtml ? `<div class="action-traits">${traitsHtml}</div>` : ''}
        <div class="action-summary">${a.summary}</div>
        ${reqHtml}
      </div>`;
    });
    html += `</div></div>`;
  });

  if (!html) html = '<div style="color:var(--text2);padding:16px;">현재 사용 가능한 행동이 없습니다.</div>';
  container.innerHTML = html;
}

