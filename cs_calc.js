// ═══════════════════════════════════════════════
//  PROFICIENCY RANK TEXT DISPLAY (read-only)
// ═══════════════════════════════════════════════

const RANK_LABELS = {'0':'미숙련','2':'숙련','4':'전문가','6':'달인','8':'전설'};
const RANK_LETTERS = {'0':'U','2':'T','4':'E','6':'M','8':'L'};
const RANK_CLASSES = {'0':'','2':'trained','4':'expert','6':'master','8':'legendary'};

function syncProfRankText(textId, selectId) {
  const el = document.getElementById(textId);
  const sel = document.getElementById(selectId);
  if (!el || !sel) return;
  const v = sel.value || '0';
  el.textContent = RANK_LABELS[v] || '미숙련';
  el.className = 'prof-rank-text ' + (RANK_CLASSES[v] || '');
}

function syncProfRankBadge(badgeId, selectId) {
  const el = document.getElementById(badgeId);
  const sel = document.getElementById(selectId);
  if (!el || !sel) return;
  const v = sel.value || '0';
  el.textContent = RANK_LETTERS[v] || 'U';
  el.className = 'prof-rank-badge ' + (RANK_CLASSES[v] || '');
}

function syncAllProfRanks() {
  ['simple','martial','advanced','unarmed'].forEach(c => syncProfRankText('rank-weapon-'+c, 'prof-weapon-'+c));
  ['light','medium','heavy','unarmored'].forEach(c => syncProfRankText('rank-armor-'+c, 'prof-armor-'+c));
  syncProfRankText('rank-spell', 'prof-spatk');
  syncProfRankText('rank-spell-focus', 'prof-spatk');
  // 계열/시전 유형 텍스트 동기화
  const tradSel = document.getElementById('spell-tradition');
  const tradDisp = document.getElementById('spell-tradition-display');
  if (tradSel && tradDisp) tradDisp.textContent = tradSel.selectedOptions[0]?.textContent || '—';
  const typeSel = document.getElementById('spell-type');
  const typeDisp = document.getElementById('spell-type-display');
  if (typeSel && typeDisp) typeDisp.textContent = typeSel.selectedOptions[0]?.textContent || '—';
  // 크기 + 이동속도 표시
  const sizeEl = document.getElementById('char-size');
  if (sizeEl) sizeEl.textContent = state.selectedAncestry?.size || state.size || '중형';
  const speedDisp = document.getElementById('speed-display');
  const speedVal = document.getElementById('speed');
  if (speedDisp && speedVal) speedDisp.textContent = speedVal.value || '25';
  // 감각 표시
  const sensesEl = document.getElementById('char-senses');
  if (sensesEl) {
    const vision = state.selectedAncestry?.vision || state.vision || '';
    const visionMap = {'암시야':'암시야 (Darkvision)','저광 시야':'저광 시야 (Low-Light Vision)','없음':''};
    sensesEl.textContent = visionMap[vision] || vision || '—';
  }
  // 추가 속도 표시
  renderExtraSpeeds();
  // 방패 정보 표시
  updateShieldInfo();
  // 내성/지각/클래스DC 배지
  ['fort','ref','will','perc','classdc'].forEach(k => syncProfRankBadge('rank-'+k, 'prof-'+k));
  // 기술 배지
  if (typeof SKILLS !== 'undefined') {
    SKILLS.forEach(sk => syncProfRankBadge('rank-sk-'+sk.id, 'sk-prof-'+sk.id));
  }
}

// Legacy aliases
function initAllTemlButtons() { syncAllProfRanks(); }
function syncAllTeml() { syncAllProfRanks(); }

// ═══════════════════════════════════════════════
//  TRAIT TOOLTIP HELPERS
// ═══════════════════════════════════════════════

function traitTag(name) {
  const desc = TRAIT_DB[name] || TRAIT_DB[name.replace(/\s*\d+.*$/, '')] || null;
  if (desc) {
    return `<span class="trait-tag" ontouchstart="toggleTraitTip(event,this)">${name}<span class="trait-balloon">${desc}</span></span>`;
  }
  return `<span class="tag">${name}</span>`;
}

function toggleTraitTip(e, el) {
  e.preventDefault();
  e.stopPropagation();
  const isOpen = el.classList.contains('tip-open');
  document.querySelectorAll('.trait-tag.tip-open').forEach(t => t.classList.remove('tip-open'));
  if (!isOpen) el.classList.add('tip-open');
}
// 아무 곳이나 터치/클릭하면 열린 태그 풍선 닫기
document.addEventListener('click', () => {
  document.querySelectorAll('.trait-tag.tip-open').forEach(t => t.classList.remove('tip-open'));
});
document.addEventListener('touchstart', () => {
  document.querySelectorAll('.trait-tag.tip-open').forEach(t => t.classList.remove('tip-open'));
}, {passive: true});

// ═══════════════════════════════════════════════
//  SKILL PROFICIENCY HELPERS
// ═══════════════════════════════════════════════

function skillNameToId(name) {
  return SKILL_NAME_MAP[name.trim()] || null;
}

function setSkillTrained(id) {
  const el = document.getElementById('sk-prof-' + id);
  if (el && el.value === '0') el.value = '2';
}

function parseFixedSkills(skillStr) {
  // '오컬티즘, 공연 + 4+INT개' → ['오컬티즘','공연']
  // '곡예 또는 운동 + 3+INT개' → [] (skip choices)
  const part = (skillStr || '').split(' + ')[0];
  if (part.includes(' 또는 ')) return [];
  return part.split(', ').map(s => s.trim()).filter(Boolean);
}

// ═══════════════════════════════════════════════
//  INFO POPUP (feat / spell)
// ═══════════════════════════════════════════════

function showInfo(type, name) {
  if (!name) return;
  let item = null;
  const nameKo = name.split(' (')[0].trim();

  if (type === 'spell' && typeof SPELL_DB !== 'undefined') {
    item = SPELL_DB.find(s => s.name_ko === nameKo || s.name_en === nameKo);
  } else if (type === 'feat' && typeof FEAT_DB !== 'undefined') {
    item = FEAT_DB.find(f => f.name_ko === nameKo) ||
           FEAT_DB.find(f => nameKo.startsWith(f.name_ko));
  } else if (type === 'weapon' && typeof WEAPON_DB !== 'undefined') {
    item = WEAPON_DB.find(w => w.name_ko === nameKo);
  } else if (type === 'armor' && typeof ARMOR_DB !== 'undefined') {
    item = ARMOR_DB.find(a => a.name_ko === nameKo);
  } else if (type === 'shield' && typeof SHIELD_DB !== 'undefined') {
    item = SHIELD_DB.find(s => s.name_ko === nameKo);
  } else if (type === 'gear' && typeof GEAR_DB !== 'undefined') {
    item = GEAR_DB.find(g => g.name_ko === nameKo);
  }

  // DB에 없으면 임시 카드
  if (!item) {
    const nameEn = (name.match(/\(([^)]+)\)/) || [])[1] || '';
    item = {
      name_ko: nameKo, name_en: nameEn,
      summary: 'DB에 상세 정보가 없습니다.',
      ...(type === 'feat' ? {feat_level:'?', category:'-', traits:[], prerequisites:''} : {}),
      ...(type === 'spell' ? {rank:0, is_cantrip:false, is_focus:false, traditions:[], traits:[], actions:''} : {}),
    };
  }

  const titleMap = {spell:'주문 정보', feat:'재주 정보', weapon:'무기 정보', armor:'방어구 정보', shield:'방패 정보', gear:'장비 정보'};
  document.getElementById('modal-overlay').classList.remove('hidden');
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  document.getElementById('modal-title').textContent = titleMap[type] || '정보';
  modalType = 'info';

  // Mobile: detail을 list 영역에 직접 표시
  if (window.innerWidth <= 900) {
    const listItems = document.getElementById('modal-options');
    if (listItems) {
      const nameKoD = item.name || item.name_ko || '';
      const nameEnD = item.en || item.name_en || '';
      const desc = item.desc || item.summary || '';
      let tags = '';
      if (item.feat_level !== undefined) tags = `<span class="tag hl">${item.feat_level}레벨</span> <span class="tag">${item.category||''}</span>`;
      else if (item.rank !== undefined) tags = `<span class="tag hl">${item.is_cantrip?'캔트립':'랭크 '+item.rank}</span>`;
      else if (item.damage) tags = `<span class="tag hl">${item.damage}</span> <span class="tag">${item.price||''}</span>`;
      else if (item.ac_bonus !== undefined) tags = `<span class="tag hl">AC+${item.ac_bonus}</span>`;
      listItems.innerHTML = `<div style="padding:16px;">
        <div style="font-size:16px;font-weight:700;margin-bottom:2px;">${nameKoD}</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:10px;">${nameEnD}</div>
        <div style="margin-bottom:10px;">${tags}</div>
        <div style="font-size:13px;line-height:1.7;">${desc}</div>
      </div>`;
    }
  } else {
    const listEl = document.querySelector('.modal-list');
    if (listEl) listEl.style.display = 'none';
    showItemDetail(item);
  }
}

// ═══════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════

// window.onload is defined below after all overrides

function buildSkills() {
  const list = document.getElementById('skills-list');
  list.innerHTML = '';
  SKILLS.forEach(sk => {
    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `
      <span class="prof-rank-badge" id="rank-sk-${sk.id}">U</span>
      <select id="sk-prof-${sk.id}" style="display:none;"><option value="0"></option><option value="2"></option><option value="4"></option><option value="6"></option><option value="8"></option></select>
      <span class="skill-attr">${sk.attr.toUpperCase()}</span>
      <span class="skill-name">${sk.name}${sk.isLore?` <input class="inline-edit" id="lore-name-${sk.id}" placeholder="주제..." oninput="save()" style="width:60px;font-size:11px;">`:''}</span>
      <span class="skill-total" id="sk-val-${sk.id}">+0</span>`;
    list.appendChild(row);
  });
}

function buildConditions() {
  const grid = document.getElementById('conditions-grid');
  grid.innerHTML = '';
  CONDITIONS_DATA.forEach(c => {
    const val = state.conditions[c.name] || 0;
    const isActive = c.valued ? val > 0 : !!val;
    const max = c.valued ? (c.max || 4) : 1;

    const item = document.createElement('div');
    item.className = 'cond-item' + (isActive ? ' active' : '');
    item.dataset.name = c.name;

    let dotsHtml = '';
    if (c.valued && max > 1) {
      for (let i = 0; i < max; i++) {
        dotsHtml += `<span class="cond-dot${i < val ? ' filled' : ''}"></span>`;
      }
    }

    item.innerHTML = `<span class="cond-name">${c.name}</span>${dotsHtml ? '<span class="cond-dots">'+dotsHtml+'</span>' : ''}`;

    // Click = increment (toggle for non-valued, cycle for valued)
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('cond-name')) {
        // Name click → show/hide description
        toggleCondDesc(c.name);
        return;
      }
      toggleCondValue(c.name);
    });

    grid.appendChild(item);
  });
  renderActiveConditions();
}

function renderActiveConditions() {
  const box = document.getElementById('active-conditions-box');
  const list = document.getElementById('active-conditions-list');
  if (!box || !list) return;
  const active = CONDITIONS_DATA.filter(c => {
    const v = state.conditions[c.name] || 0;
    return c.valued ? v > 0 : !!v;
  });
  if (active.length === 0) {
    box.style.display = 'none';
    return;
  }
  box.style.display = '';
  list.innerHTML = active.map(c => {
    const v = state.conditions[c.name];
    const valText = c.valued ? ` ${v}` : '';
    return `<div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid var(--border);font-size:12px;">
      <span style="color:var(--red-light);font-weight:600;min-width:60px;">⚠ ${c.name}${valText}</span>
      <span style="color:var(--text2);font-size:10px;flex:1;">${c.desc.substring(0, 80)}...</span>
      <span style="cursor:pointer;color:var(--text2);font-size:10px;" onclick="state.conditions['${c.name}']=0;buildConditions();save();">✕</span>
    </div>`;
  }).join('');
}

function toggleCondValue(name) {
  const cdata = CONDITIONS_DATA.find(c=>c.name===name);
  if (!cdata) return;
  const max = cdata.valued ? (cdata.max || 4) : 1;
  let cur = parseInt(state.conditions[name] || 0);
  cur = cur >= max ? 0 : cur + 1; // increment, reset at max
  state.conditions[name] = cur;
  buildConditions(); // re-render
  save();
}

function toggleCondDesc(name) {
  const grid = document.getElementById('conditions-grid');
  const existing = grid.querySelector(`.cond-detail[data-name="${name}"]`);
  // Close all open details
  grid.querySelectorAll('.cond-detail.open').forEach(d => {
    if (d.dataset.name !== name) d.classList.remove('open');
  });
  if (existing) {
    existing.classList.toggle('open');
  } else {
    const cdata = CONDITIONS_DATA.find(c=>c.name===name);
    if (!cdata) return;
    const detail = document.createElement('div');
    detail.className = 'cond-detail open';
    detail.dataset.name = name;
    detail.innerHTML = `<strong>${cdata.name}</strong> <span style="color:var(--text2);">${cdata.en}</span>${cdata.valued ? ' (최대 '+(cdata.max||4)+')' : ''}<br>${cdata.desc}`;
    // Insert after the clicked item
    const item = grid.querySelector(`.cond-item[data-name="${name}"]`);
    if (item) item.after(detail);
  }
}

function buildSpellSlots() {
  // Legacy spell slot table removed — now handled by renderSpells() rank sections
  const body = document.getElementById('spell-slots-body');
  if (!body) return;
  body.innerHTML = '';
  for (let r = 1; r <= 10; r++) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color:var(--accent)">${r}랭크</td>
      <td><input class="inline-edit" id="slots-max-${r}" type="number" min="0" max="9" value="0" style="width:32px;text-align:center;" oninput="updateSlotChecks(${r});save()"></td>
      <td id="slot-checks-${r}" style="display:flex;gap:2px;flex-wrap:wrap;"></td>`;
    body.appendChild(tr);
  }
}

// ═══════════════════════════════════════════════
//  CALCULATIONS
// ═══════════════════════════════════════════════

// PF2e Remaster: 수정치 기준 (+0 시작)
// - 부스트 1개 = +1 (수정치 < +4일 때)
// - 수정치 +4 이상에 부스트 → "부분 부스트" 표시 (2개 쌓이면 +1)
// - 결함 1개 = -1
// - 동일 출처 묶음 내: 같은 속성에 2번 배분 불가 (UI에서 강제)
function calcMod(a) {
  const lv = getLevel();
  // 출처별 묶음 (각 묶음 내에서 동일 속성 중복 불가)
  const batches = [
    [...state.boosts.ancFixed, ...state.boosts.ancFree], // 혈통은 한 묶음
    [...state.boosts.bg],
    state.boosts.cls ? [state.boosts.cls] : [],
    [...state.boosts.lv1],
  ];
  if (lv >= 5)  batches.push([...state.boosts.lv5]);
  if (lv >= 10) batches.push([...state.boosts.lv10]);
  if (lv >= 15) batches.push([...state.boosts.lv15]);
  if (lv >= 20) batches.push([...state.boosts.lv20]);

  let mod = 0;
  let partial = false;
  for (const batch of batches) {
    // 같은 묶음 내 해당 속성 부스트 횟수 (정상적으론 최대 1회)
    const n = batch.filter(b => b === a).length;
    for (let i = 0; i < n; i++) {
      if (mod < 4) {
        mod += 1;
      } else {
        if (partial) { mod += 1; partial = false; }
        else { partial = true; }
      }
    }
  }
  // 결함 적용 (-1 per flaw)
  const flaws = state.boosts.ancFlaw.filter(f => f === a).length;
  mod -= flaws;
  return { mod, partial };
}
function getMod(a) { return calcMod(a).mod; }
function getAttr(a) { return getMod(a); } // 호환성 유지

// Parse attribute key from Korean/English mixed strings like '건강(CON)' -> 'con'
function parseAttrKey(str) {
  const m = str.match(/\b(STR|DEX|CON|INT|WIS|CHA)\b/i);
  return m ? m[1].toLowerCase() : null;
}

// ─── 부스트 팝업 모달 ───
function openBoostModal() {
  document.getElementById('modal-title').textContent = '능력치 부스트 배분';
  document.getElementById('modal-overlay').classList.remove('hidden');
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  modalType = 'boost';
  renderBoostModal();
}

function renderBoostModal() {
  const ATTRS = ['str','dex','con','int','wis','cha'];
  const ATTR_KO = {str:'근력',dex:'민첩',con:'건강',int:'지능',wis:'지혜',cha:'매력'};
  const container = document.getElementById('modal-options');
  container.innerHTML = '';

  // 현재 수정치 요약 바
  const bar = document.createElement('div');
  bar.className = 'boost-summary-bar';
  ATTRS.forEach(a => {
    const {mod, partial} = calcMod(a);
    bar.innerHTML += `<div class="boost-summary-attr">
      <div class="bsa-name">${ATTR_KO[a]}</div>
      <div class="bsa-val">${fmtBonus(mod)}${partial?'½':''}</div>
    </div>`;
  });
  container.appendChild(bar);

  const info = document.createElement('div');
  info.style.cssText = 'font-size:10px;color:var(--text2);margin-bottom:8px;';
  info.textContent = '부스트: 수정치 +1 (이미 +4 이상이면 ½ 표시 → 2개 = +1). 결함: -1. 같은 출처에서 동일 속성 중복 불가.';
  container.appendChild(info);

  // 혈통 섹션
  if (state.selectedAncestry) {
    const anc = state.selectedAncestry;
    const fixedKeys = state.boosts.ancFixed;
    const flawKeys = state.boosts.ancFlaw;
    const freeCount = anc.boosts.filter(b=>b.includes('자유')).length;
    const unavailForFree = [...fixedKeys, ...flawKeys];

    const desc = `고정: ${fixedKeys.map(k=>ATTR_KO[k]).join(', ')||'없음'}
      ${flawKeys.length?` | 결함: ${flawKeys.map(k=>ATTR_KO[k]).join(', ')}`:''}
      | 자유 ${freeCount}개 선택 (고정/결함 속성 제외)`;
    container.appendChild(makeBoostSection('혈통 자유 부스트 — '+anc.name, desc,
      'ancFree', freeCount, ATTRS.filter(a=>!unavailForFree.includes(a)), state.boosts.ancFree));
  } else {
    const s = document.createElement('div');
    s.className = 'boost-section';
    s.innerHTML = '<div class="boost-section-title">혈통 자유 부스트</div><div class="boost-section-desc" style="color:var(--text2);">혈통을 먼저 선택하세요.</div>';
    container.appendChild(s);
  }

  // 배경 섹션
  {
    const bgDesc = state.selectedBackground
      ? `배경: ${state.selectedBackground.name} — 속성: ${state.selectedBackground.boosts}`
      : '배경을 선택하면 부스트 설명이 표시됩니다.';
    container.appendChild(makeBoostSection('배경 부스트 (2개, 서로 다른 속성)', bgDesc,
      'bg', 2, ATTRS, state.boosts.bg));
  }

  // 클래스 섹션
  {
    const clsDesc = state.selectedClass
      ? `클래스: ${state.selectedClass.name} — 핵심 속성: ${state.selectedClass.keyAttr}`
      : '클래스를 선택하면 자동 설정됩니다.';
    const clsKey = state.boosts.cls;
    const sec = document.createElement('div');
    sec.className = 'boost-section';
    sec.innerHTML = `<div class="boost-section-title">클래스 핵심 속성 (자동)</div>
      <div class="boost-section-desc">${clsDesc}</div>
      <div class="boost-radio-group">${ATTRS.map(a=>`
        <label class="${clsKey===a?'selected fixed':'fixed'}">
          <span>${ATTR_KO[a]}</span>${clsKey===a?' ✓':''}
        </label>`).join('')}
      </div>`;
    // 클래스 선택 가능하면 (근력/민첩 선택형)
    if (state.selectedClass) {
      const keys = [];
      const m = state.selectedClass.keyAttr.match(/\b(STR|DEX|CON|INT|WIS|CHA)\b/gi);
      if (m) m.forEach(k=>keys.push(k.toLowerCase()));
      if (keys.length > 1) {
        sec.innerHTML = `<div class="boost-section-title">클래스 핵심 속성 선택</div>
          <div class="boost-section-desc">${state.selectedClass.name}: ${state.selectedClass.keyAttr} 중 선택</div>
          <div class="boost-radio-group">${keys.map(a=>`
            <label class="${state.boosts.cls===a?'selected':''}" onclick="setClassKey('${a}')">
              ${ATTR_KO[a]}${state.boosts.cls===a?' ✓':''}
            </label>`).join('')}
          </div>`;
      }
    }
    container.appendChild(sec);
  }

  // 레벨별 자유 부스트
  const lv = getLevel();
  [[1,'lv1'],[5,'lv5'],[10,'lv10'],[15,'lv15'],[20,'lv20']].forEach(([reqLv, key]) => {
    if (lv < reqLv) return;
    container.appendChild(makeBoostSection(
      `레벨 ${reqLv} 자유 부스트 (4개, 서로 다른 속성)`,
      '4개를 서로 다른 속성에 배분하세요.',
      key, 4, ATTRS, state.boosts[key]));
  });
}

function makeBoostSection(title, desc, stateKey, maxCount, allowedAttrs, currentArr) {
  const ATTR_KO = {str:'근력',dex:'민첩',con:'건강',int:'지능',wis:'지혜',cha:'매력'};
  const sec = document.createElement('div');
  sec.className = 'boost-section';
  const chosen = currentArr.filter(a=>allowedAttrs.includes(a)).length;
  sec.innerHTML = `<div class="boost-section-title">${title}</div>
    <div class="boost-section-desc">${desc}<br>선택됨: <strong>${chosen}/${maxCount}</strong></div>
    <div class="boost-radio-group" id="bg-${stateKey}"></div>`;
  const grp = sec.querySelector(`#bg-${stateKey}`);
  allowedAttrs.forEach(a => {
    const lbl = document.createElement('label');
    const isSelected = currentArr.includes(a);
    lbl.className = isSelected ? 'selected' : '';
    lbl.innerHTML = `${ATTR_KO[a]}${isSelected?' ✓':''}`;
    lbl.onclick = () => {
      if (currentArr.includes(a)) {
        currentArr.splice(currentArr.indexOf(a), 1);
      } else {
        if (currentArr.length >= maxCount) return;
        currentArr.push(a);
      }
      recalcAll(); save(); renderBoostModal();
    };
    grp.appendChild(lbl);
  });
  return sec;
}

function setClassKey(a) {
  state.boosts.cls = a;
  recalcAll(); save(); renderBoostModal();
}

function renderBoostGrid() {
  const ATTRS = ['str','dex','con','int','wis','cha'];
  const lv = getLevel();
  const grid = document.getElementById('boost-grid');
  if (!grid) return;
  // 헤더(7개) 이후 제거 후 재생성
  while (grid.children.length > 7) grid.removeChild(grid.lastChild);

  // 행 추가 헬퍼
  // key: state.boosts의 키 (null이면 읽기전용)
  // maxPicks: 이 출처에서 선택 가능한 최대 개수 (같은 묶음 내 중복 불가)
  // readonlyArr: null이 아니면 이 배열로 체크 표시 (수정 불가)
  // isFlaw: 결함 행 여부 (빨간 표시)
  function addRow(label, key, maxPicks, readonlyArr, isFlaw) {
    const srcDiv = document.createElement('div');
    srcDiv.className = 'bg-src';
    srcDiv.style.cssText = isFlaw ? 'color:var(--red-light);' : '';
    srcDiv.textContent = label;
    grid.appendChild(srcDiv);

    ATTRS.forEach(a => {
      const cell = document.createElement('div');
      cell.className = 'boost-cell';
      const cb = document.createElement('input');
      cb.type = 'checkbox';

      if (readonlyArr !== null) {
        // 읽기전용 (혈통 고정, 클래스 자동)
        cb.checked = readonlyArr.includes(a);
        cb.disabled = true;
        if (isFlaw) cb.style.accentColor = 'var(--red-light)';
      } else {
        // 사용자 선택 가능
        const arr = state.boosts[key];
        cb.checked = arr.includes(a);
        cb.onchange = () => {
          if (cb.checked) {
            // 같은 묶음 내 최대 개수 확인
            if (arr.length >= maxPicks) { cb.checked = false; return; }
            // 이미 있으면 추가 안 함
            if (!arr.includes(a)) arr.push(a);
          } else {
            const idx = arr.indexOf(a);
            if (idx >= 0) arr.splice(idx, 1);
          }
          recalcAll();
          save();
        };
      }
      cell.appendChild(cb);
      grid.appendChild(cell);
    });
  }

  // 혈통 고정 부스트 (혈통 선택 시 자동 설정)
  addRow('혈통 고정', null, 0, state.boosts.ancFixed, false);
  // 혈통 자유 부스트 (혈통에 따라 1~2개, 혈통 고정+자유 합쳐서 중복 불가 체크)
  // ancFree는 혈통 고정과 같은 묶음이므로 이미 선택된 것 제외
  const ancUsed = [...state.boosts.ancFixed];
  // 혈통 자유: 혈통마다 다른 개수 (대부분 1개, 인간/오크는 2개)
  const ancFreeMax = state.selectedAncestry
    ? state.selectedAncestry.boosts.filter(b => b.includes('자유')).length
    : 1;
  // 자유 부스트 선택 시 이미 고정된 속성 제외
  {
    const srcDiv = document.createElement('div');
    srcDiv.className = 'bg-src';
    srcDiv.textContent = '혈통 자유';
    grid.appendChild(srcDiv);
    ATTRS.forEach(a => {
      const cell = document.createElement('div');
      cell.className = 'boost-cell';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      const arr = state.boosts.ancFree;
      cb.checked = arr.includes(a);
      // 고정 부스트에서 이미 사용된 속성은 비활성화
      if (ancUsed.includes(a)) {
        cb.disabled = true;
        cb.checked = false;
        if (arr.includes(a)) { arr.splice(arr.indexOf(a), 1); }
      } else {
        cb.onchange = () => {
          if (cb.checked) {
            if (arr.length >= ancFreeMax) { cb.checked = false; return; }
            if (!arr.includes(a)) arr.push(a);
          } else {
            const idx = arr.indexOf(a); if (idx>=0) arr.splice(idx,1);
          }
          recalcAll(); save();
        };
      }
      cell.appendChild(cb);
      grid.appendChild(cell);
    });
  }
  // 혈통 결함
  addRow('혈통 결함', null, 0, state.boosts.ancFlaw, true);
  // 배경 부스트 (2개, 서로 달라야)
  addRow('배경 (2개)', 'bg', 2, null, false);
  // 클래스 핵심 속성 (자동)
  addRow('클래스', null, 0, state.boosts.cls ? [state.boosts.cls] : [], false);
  // 레벨별 자유 부스트 (4개씩, 같은 묶음 내 서로 달라야)
  addRow('레벨 1 (4개)', 'lv1', 4, null, false);
  if (lv >= 5)  addRow('레벨 5 (4개)',  'lv5',  4, null, false);
  if (lv >= 10) addRow('레벨 10 (4개)', 'lv10', 4, null, false);
  if (lv >= 15) addRow('레벨 15 (4개)', 'lv15', 4, null, false);
  if (lv >= 20) addRow('레벨 20 (4개)', 'lv20', 4, null, false);
}
function getLevel() { return parseInt(document.getElementById('f-level')?.value||1); }

function checkXpLevelUp() {
  const xpEl = document.getElementById('f-xp');
  const lvEl = document.getElementById('f-level');
  if (!xpEl || !lvEl) return;
  let xp = parseInt(xpEl.value || 0);
  let lv = parseInt(lvEl.value || 1);
  if (xp >= 1000 && lv < 20) {
    lv += 1;
    xp -= 1000;
    lvEl.value = lv;
    xpEl.value = xp;
    onLevelChange();
  }
  save();
}
function getProfBonus(selectId) {
  const v = parseInt(document.getElementById(selectId)?.value||0);
  return v > 0 ? (v + getLevel()) : 0;
}
function fmtBonus(n) { return n >= 0 ? '+'+n : ''+n; }

function recalcAll() {
  ['str','dex','con','int','wis','cha'].forEach(a => {
    const {mod, partial} = calcMod(a);
    const mEl = document.getElementById('mod-'+a);
    if (mEl) mEl.textContent = fmtBonus(mod);
    const pEl = document.getElementById('partial-'+a);
    if (pEl) pEl.textContent = partial ? '½ 부스트' : '';
  });
  // 부스트 팝업이 열려있으면 실시간 업데이트
  if (modalType === 'boost') renderBoostModal();
  recalcAC();
  recalcSaves();
  recalcPerc();
  recalcClassDC();
  recalcSpellStats();
  recalcSkills();
  recalcBulk();
  updateHP();
  updateHpGauge();
  updateShieldGauge();
  renderWeapons();
  renderGrowthPlan();
  syncAllProfRanks();
  // 행동 탭이 활성화된 경우에만 재렌더
  if (document.getElementById('panel-actions')?.classList.contains('active')) renderActions();
}

function getCondPenalty() {
  const frightened = parseInt(state.conditions['공포'] || 0);
  const sickened = parseInt(state.conditions['구역질'] || 0);
  const clumsy = parseInt(state.conditions['둔함'] || 0);
  const enfeebled = parseInt(state.conditions['약화됨'] || 0);
  const stupefied = parseInt(state.conditions['혼미'] || 0);
  return {
    all: Math.max(frightened, sickened), // 공포/구역질 중 큰 값
    clumsy, enfeebled, stupefied
  };
}

function applyPenaltyColor(el, base, penalty) {
  if (!el) return;
  const total = base - penalty;
  el.textContent = (total >= 0 ? '+' : '') + total;
  el.style.color = penalty > 0 ? 'var(--red-light)' : '';
}

function recalcAC() {
  const baseAc = parseInt(document.getElementById('armor-ac')?.value||0);
  const potency = state.armorPotency || 0;
  const armorBonus = baseAc + potency;
  const dexCap = document.getElementById('armor-dex')?.value;
  let dexMod = getMod('dex');
  if (dexCap && dexCap !== '-' && dexCap !== '') dexMod = Math.min(dexMod, parseInt(dexCap)||99);

  // Use armor-category-specific proficiency
  const armorProfId = getArmorProfSelectId();
  const armorProfRank = parseInt(document.getElementById(armorProfId)?.value||0);
  const lv = getLevel();
  const profBonus = armorProfRank > 0 ? (armorProfRank + lv) : 0;

  // Sync prof-ac (sidebar) with current armor category prof
  const profAc = document.getElementById('prof-ac');
  if (profAc) profAc.value = armorProfRank;
  const profAc2 = document.getElementById('prof-ac2');
  if (profAc2) profAc2.value = armorProfRank;

  const stowed = state.armorStowed || false;
  const effectiveArmor = stowed ? 0 : armorBonus;
  const effectiveDex = stowed ? getMod('dex') : dexMod;
  const effectiveProf = stowed ? (parseInt(document.getElementById('prof-armor-unarmored')?.value||0) > 0 ? parseInt(document.getElementById('prof-armor-unarmored').value) + lv : 0) : profBonus;

  // 방패 들기 보너스
  const shieldBonus = (state.shieldRaised && !state.shieldStowed) ? parseInt(document.getElementById('shield-ac')?.value||0) : 0;
  const pen = getCondPenalty();
  const acPenalty = pen.all + pen.clumsy;
  const ac = 10 + effectiveDex + effectiveArmor + effectiveProf + shieldBonus - acPenalty;
  const acEl = document.getElementById('val-ac');
  if (acEl) { acEl.textContent = ac; acEl.style.color = acPenalty > 0 ? 'var(--red-light)' : ''; }

  // Update AC breakdown display
  const itemDisp = document.getElementById('ac-item-display');
  if (itemDisp) itemDisp.textContent = '+' + effectiveArmor;
  const dexDisp = document.getElementById('ac-dex-display');
  if (dexDisp) dexDisp.textContent = (effectiveDex >= 0 ? '+' : '') + effectiveDex;
  const profDisp = document.getElementById('ac-prof-display');
  if (profDisp) profDisp.textContent = '+' + effectiveProf;
}

function syncArmorProf() {
  // Legacy: sync from prof-ac2 to prof-ac
  const v = document.getElementById('prof-ac2')?.value;
  if (document.getElementById('prof-ac')) document.getElementById('prof-ac').value = v;
  recalcAC();
}

function recalcSaves() {
  const lv = getLevel();
  const pen = getCondPenalty();
  const pairs = [
    ['fort','con','prof-fort','val-fort', 0],
    ['ref','dex','prof-ref','val-ref', pen.clumsy],
    ['will','wis','prof-will','val-will', 0],
  ];
  pairs.forEach(([,attr,profId,valId, extraPen]) => {
    const rank = parseInt(document.getElementById(profId)?.value||0);
    const base = getMod(attr) + (rank>0?rank+lv:0);
    const totalPen = pen.all + extraPen;
    applyPenaltyColor(document.getElementById(valId), base, totalPen);
  });
}

function recalcPerc() {
  const total = getMod('wis') + getProfBonus('prof-perc');
  document.getElementById('val-perc').textContent = fmtBonus(total);
  document.getElementById('val-init').textContent = fmtBonus(total);
}

function getClassKeyAttr() {
  if (state.selectedClass) {
    const k = parseAttrKey(state.selectedClass.keyAttr);
    if (k) return k;
  }
  return 'wis';
}

function recalcClassDC() {
  const total = 10 + getMod(getClassKeyAttr()) + getProfBonus('prof-classdc');
  document.getElementById('val-classdc').textContent = total;
}

function recalcSpellStats() {
  const keyAttr = getClassKeyAttr();
  const prof = getProfBonus('prof-spatk');
  const atk = getMod(keyAttr) + prof;
  const dc = 10 + getMod(keyAttr) + prof;
  const atkEl = document.getElementById('val-spatk');
  if (atkEl) atkEl.textContent = fmtBonus(atk);
  const dcEl = document.getElementById('val-spdc');
  if (dcEl) dcEl.textContent = dc;
  // 주문 탭 헤더 업데이트
  const spDcVal = document.getElementById('spell-dc-val');
  if (spDcVal) spDcVal.textContent = dc;
  const spAtkVal = document.getElementById('spell-atk-val');
  if (spAtkVal) spAtkVal.textContent = fmtBonus(atk);
  // Focus tab mirrors
  const focusDcEl = document.getElementById('spell-dc-val-focus');
  if (focusDcEl) focusDcEl.textContent = dc;
  const focusAtkEl = document.getElementById('spell-atk-val-focus');
  if (focusAtkEl) focusAtkEl.textContent = fmtBonus(atk);
  renderFpChecks();
  // Breakdown update
  const keyLabel = document.getElementById('spell-key-label');
  if (keyLabel) keyLabel.textContent = keyAttr ? keyAttr.substring(0,3).toUpperCase() : '—';
  const keyVal = document.getElementById('spell-key-val');
  if (keyVal) keyVal.textContent = getMod(keyAttr);
  const profVal = document.getElementById('spell-prof-val');
  if (profVal) profVal.textContent = prof;
  // TEML badges update
  if (typeof updateSpellTemlBadges === 'function') updateSpellTemlBadges();
  // 방어 탭 미러 업데이트
  const mirrorDc = document.getElementById('val-spdc-mirror');
  if (mirrorDc) mirrorDc.textContent = dc;
}

function recalcSkills() {
  SKILLS.forEach(sk => recalcSkill(sk.id));
}

function recalcSkill(id) {
  const sk = SKILLS.find(s=>s.id===id);
  if (!sk) return;
  const rank = parseInt(document.getElementById('sk-prof-'+id)?.value||0);
  const lv = getLevel();
  const base = getMod(sk.attr) + (rank>0?rank+lv:0);
  const pen = getCondPenalty();
  let extraPen = 0;
  if (sk.attr === 'str') extraPen = pen.enfeebled;
  if (sk.attr === 'dex') extraPen = pen.clumsy;
  if (['int','wis','cha'].includes(sk.attr)) extraPen = pen.stupefied;
  applyPenaltyColor(document.getElementById('sk-val-'+id), base, pen.all + extraPen);
}

function toggleHeroStar(idx) {
  const cur = parseInt(document.getElementById('hero-points').value) || 0;
  // Star rating: click filled star to reduce, click empty star to fill up to it
  const next = (idx === cur) ? idx - 1 : idx;
  document.getElementById('hero-points').value = next;
  renderHeroStars(next);
  save();
}
function renderHeroStars(n) {
  document.querySelectorAll('.hero-star').forEach((s, i) => {
    s.classList.toggle('filled', i < n);
  });
}
function loadHeroPoints(val) {
  const n = parseInt(val)||0;
  document.getElementById('hero-points').value = n;
  renderHeroStars(n);
}
function updateHpGauge() {
  const cur = parseInt(document.getElementById('hp-cur').value)||0;
  const max = parseInt(document.getElementById('hp-max').value)||1;
  const temp = parseInt(document.getElementById('hp-temp').value)||0;
  const pct = Math.max(0, Math.min(100, (cur/max)*100));
  const fill = document.getElementById('hp-gauge-fill');
  if (fill) {
    fill.style.width = pct + '%';
    if (pct > 50) fill.style.background = 'linear-gradient(90deg,#1a6040,#2d8a5e)';
    else if (pct > 25) fill.style.background = 'linear-gradient(90deg,#6a5a1a,#a08a20)';
    else fill.style.background = 'linear-gradient(90deg,#6a1a1a,#a03030)';
  }
  const curDisp = document.getElementById('hp-cur-display');
  const maxDisp = document.getElementById('hp-max-display');
  if (curDisp) curDisp.textContent = cur;
  if (maxDisp) maxDisp.textContent = max;
  const tempDisp = document.getElementById('hp-temp-display');
  const tempVal = document.getElementById('hp-temp-val');
  if (tempDisp) tempDisp.style.display = temp > 0 ? '' : 'none';
  if (tempVal) tempVal.textContent = temp;
  // 임시 HP 게이지 (우측에서 차오름)
  const tempFill = document.getElementById('hp-gauge-temp');
  if (tempFill) {
    const tempPct = max > 0 ? Math.min(100, (temp / max) * 100) : 0;
    tempFill.style.width = tempPct > 0 ? tempPct + '%' : '0';
  }
  checkHpZero();
}
function updateShieldGauge() {
  const shieldHp = parseInt(document.getElementById('shield-hp')?.value)||0;
  const shieldName = document.getElementById('shield-name')?.value||'';
  const wrap = document.getElementById('shield-gauge-wrap');
  if (!wrap) return;
  if (!shieldName) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  const cur = parseInt(document.getElementById('shield-hp-cur')?.value)||0;
  const pct = shieldHp > 0 ? Math.max(0, Math.min(100, (cur/shieldHp)*100)) : 0;
  const fill = document.getElementById('shield-gauge-fill');
  if (fill) fill.style.width = pct + '%';
  const label = document.getElementById('shield-gauge-label');
  if (label) label.textContent = shieldName || '방패';
  const maxDisp = document.getElementById('shield-hp-max-display');
  if (maxDisp) maxDisp.textContent = shieldHp;
  const curDisp = document.getElementById('shield-hp-cur-display');
  if (curDisp) curDisp.textContent = cur;
}

function recalcBulk() {
  let total = 0;
  state.equip.forEach(e => {
    const b = parseFloat(e.bulk||0);
    total += isNaN(b)?0:b;
  });
  document.getElementById('bulk-total').textContent = total.toFixed(1).replace('.0','');
  const maxBulk = getMod('str') + 5;
  document.getElementById('bulk-max').textContent = maxBulk;
}

function updateHP() {
  const lv = getLevel();
  if (state.selectedClass && state.selectedAncestry) {
    const ancHP = state.selectedAncestry.hp;
    const clsHP = state.selectedClass.hp;
    const conMod = getMod('con');
    const max = ancHP + (clsHP + conMod) * lv;
    const maxEl = document.getElementById('hp-max');
    const curEl = document.getElementById('hp-cur');
    const oldMax = parseInt(maxEl.value || 0);
    if (oldMax === 0 || !maxEl._userEdited) {
      maxEl.value = max;
      // 최대치가 바뀌면 현재 HP도 최대치로 설정 (초기 또는 레벨업)
      if (curEl && (parseInt(curEl.value || 0) === 0 || parseInt(curEl.value) === oldMax)) {
        curEl.value = max;
      }
    }
  }
  checkHpZero();
}

function renderExtraSpeeds() {
  const el = document.getElementById('extra-speeds');
  if (!el) return;
  if (!state.extraSpeeds) state.extraSpeeds = {};
  const types = [['climb','등반'],['swim','수영'],['fly','비행'],['burrow','굴착']];
  let html = '';
  types.forEach(([key, label]) => {
    const val = state.extraSpeeds[key];
    if (val && val > 0) {
      html += `<div style="text-align:center;cursor:pointer;" onclick="openSpeedModal()">
        <div style="font-size:8px;color:var(--text2);text-transform:uppercase;">${label}</div>
        <div style="font-size:13px;font-weight:600;color:var(--text);">${val}</div>
      </div>`;
    }
  });
  el.innerHTML = html;
}

function renderFpChecks() {
  const container = document.getElementById('fp-checks');
  if (!container) return;
  const max = parseInt(document.getElementById('fp-max')?.value || 0);
  const cur = parseInt(document.getElementById('fp-cur')?.value || 0);
  if (max <= 0) { container.innerHTML = '<span style="font-size:11px;color:var(--text2);">—</span>'; return; }
  let html = '';
  for (let i = 0; i < max; i++) {
    const used = i >= cur;
    html += `<span onclick="toggleFpCheck(${i})" style="cursor:pointer;font-size:18px;color:${used ? 'var(--text2)' : 'var(--accent)'};">${used ? '○' : '●'}</span>`;
  }
  container.innerHTML = html;
}

function toggleFpCheck(idx) {
  const curEl = document.getElementById('fp-cur');
  const max = parseInt(document.getElementById('fp-max')?.value || 0);
  let cur = parseInt(curEl?.value || 0);
  if (idx < cur) {
    // 사용: 해당 포인트 소모
    curEl.value = idx;
  } else {
    // 회복: 해당 포인트까지 채움
    curEl.value = Math.min(max, idx + 1);
  }
  renderFpChecks();
  save();
}

function updateShieldInfo() {
  const shieldName = document.getElementById('shield-name')?.value || '';
  const infoRow = document.getElementById('shield-info-row');
  const raiseBtn = document.getElementById('shield-raise-btn');
  if (infoRow) infoRow.style.display = shieldName ? '' : 'none';
  if (raiseBtn) {
    raiseBtn.style.display = shieldName ? '' : 'none';
    const raised = state.shieldRaised || false;
    raiseBtn.style.background = raised ? 'var(--accent-bg)' : 'var(--bg4)';
    raiseBtn.style.color = raised ? 'var(--accent)' : 'var(--text2)';
    raiseBtn.style.borderColor = raised ? 'var(--accent)' : 'var(--border2)';
    raiseBtn.textContent = raised ? '🛡 방패 내리기' : '🛡 방패 들기';
  }
  const acDisp = document.getElementById('shield-ac-display');
  const hardDisp = document.getElementById('shield-hard-display');
  if (acDisp) acDisp.textContent = '+' + (document.getElementById('shield-ac')?.value || '0');
  if (hardDisp) hardDisp.textContent = document.getElementById('shield-hard')?.value || '0';
}

function toggleShieldRaise() {
  state.shieldRaised = !state.shieldRaised;
  recalcAC();
  updateShieldInfo();
  save();
}

function checkHpZero() {
  const cur = parseInt(document.getElementById('hp-cur')?.value || 0);
  if (cur <= 0) {
    // PF2e: HP 0 → 의식불명 + 빈사 1 (부상 수치만큼 빈사 증가)
    if (!state.conditions['의식불명']) {
      state.conditions['의식불명'] = 1;
      const wounded = state.conditions['부상'] || 0;
      state.conditions['빈사'] = Math.max(state.conditions['빈사'] || 0, 1 + wounded);
      buildConditions();
      if (typeof renderActiveConditions === 'function') renderActiveConditions();
    }
  }
}

