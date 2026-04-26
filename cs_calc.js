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
  if (speedDisp && speedVal) {
    const armorPen = getArmorPenalties();
    const baseSpeed = parseInt(speedVal.value || '25') + (state._fb?.speed || 0) + armorPen.speed;
    speedDisp.textContent = Math.max(5, baseSpeed);
  }
  // 감각 표시 (유산 vision이 혈통 vision보다 우선)
  const sensesEl = document.getElementById('char-senses');
  if (sensesEl) {
    const ancVision = state.selectedAncestry?.vision || '없음';
    const stateVision = state.vision || '없음';
    // 더 좋은 시야를 사용 (상위 암시야 > 암시야 > 저광 시야 > 없음)
    const visionRank = {'상위 암시야':3,'암시야':2,'저광 시야':1,'없음':0};
    const vision = (visionRank[stateVision]||0) >= (visionRank[ancVision]||0) ? stateVision : ancVision;
    const visionMap = {'상위 암시야':'상위 암시야 (Greater Darkvision)','암시야':'암시야 (Darkvision)','저광 시야':'저광 시야 (Low-Light Vision)','없음':''};
    let sensesText = visionMap[vision] || vision || '—';
    // 유산 추가 감각
    const heritageSense = state.selectedHeritage?.extraSenses;
    if (heritageSense) sensesText += (sensesText && sensesText !== '—' ? ', ' : '') + heritageSense;
    // 재주 추가 감각
    if (state._fb?.extraSenses?.length) {
      sensesText += (sensesText && sensesText !== '—' ? ', ' : '') + state._fb.extraSenses.join(', ');
    }
    sensesEl.textContent = sensesText || '—';
  }
  // 저항 표시
  renderResistances();
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
  // 무기/방어구 숙련 요약
  updateWeaponProfSummary();
  updateArmorProfSummary();
}

function _buildProfSummaryHTML(label, items) {
  if (!items.length) return '';
  const parts = items.map((it, i) =>
    (i > 0 ? '<span class="ac-sep">|</span>' : '') +
    `<span class="ac-part">${it}</span>`
  ).join('');
  return `<span class="ac-part" style="margin-right:2px;">${label}</span>${parts}`;
}

function updateWeaponProfSummary() {
  const el = document.getElementById('weapon-prof-summary');
  if (!el) return;
  const cats = [
    {id:'simple', name:'단순 무기'},
    {id:'martial', name:'군용 무기'},
    {id:'advanced', name:'고급 무기'},
    {id:'unarmed', name:'비무장'}
  ];
  const items = [];
  cats.forEach(c => {
    const rank = parseInt(document.getElementById('prof-weapon-'+c.id)?.value || 0);
    if (rank >= 2) items.push(c.name);
  });
  if (state._fb?.familiarWeapons?.length) {
    state._fb.familiarWeapons.forEach(w => { if (!items.includes(w)) items.push(w); });
  }
  if (state._fb?.trainedWeapons?.length) {
    state._fb.trainedWeapons.forEach(w => { if (!items.includes(w)) items.push(w); });
  }
  el.innerHTML = _buildProfSummaryHTML('숙련 :', items);
  el.style.display = items.length ? '' : 'none';
}

function updateArmorProfSummary() {
  const el = document.getElementById('armor-prof-summary');
  if (!el) return;
  const cats = [
    {id:'light', name:'경갑'},
    {id:'medium', name:'평갑'},
    {id:'heavy', name:'중갑'},
    {id:'unarmored', name:'비무장'}
  ];
  const items = [];
  cats.forEach(c => {
    const rank = parseInt(document.getElementById('prof-armor-'+c.id)?.value || 0);
    if (rank >= 2) items.push(c.name);
  });
  el.innerHTML = _buildProfSummaryHTML('숙련 :', items);
  el.style.display = items.length ? '' : 'none';
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
    return `<span class="trait-tag" onmouseenter="posTraitTip(this)" onmouseleave="hideTraitTip(this)" ontouchstart="toggleTraitTip(event,this)">${name}<span class="trait-balloon">${desc}</span></span>`;
  }
  return `<span class="tag">${name}</span>`;
}

function posTraitTip(el) {
  const balloon = el.querySelector('.trait-balloon');
  if (!balloon) return;
  balloon.style.display = 'block';
  const rect = el.getBoundingClientRect();
  const bRect = balloon.getBoundingClientRect();
  let left = rect.left + rect.width/2 - bRect.width/2;
  let top = rect.top - bRect.height - 6;
  if (left < 4) left = 4;
  if (left + bRect.width > window.innerWidth - 4) left = window.innerWidth - bRect.width - 4;
  if (top < 4) top = rect.bottom + 6;
  balloon.style.left = left + 'px';
  balloon.style.top = top + 'px';
}

function hideTraitTip(el) {
  const balloon = el.querySelector('.trait-balloon');
  if (balloon && !el.classList.contains('tip-open')) balloon.style.display = 'none';
}

function toggleTraitTip(e, el) {
  e.preventDefault();
  e.stopPropagation();
  const isOpen = el.classList.contains('tip-open');
  document.querySelectorAll('.trait-tag.tip-open').forEach(t => { t.classList.remove('tip-open'); hideTraitTip(t); });
  if (!isOpen) { el.classList.add('tip-open'); posTraitTip(el); }
}
// 아무 곳이나 터치/클릭하면 열린 태그 풍선 닫기
document.addEventListener('click', () => {
  document.querySelectorAll('.trait-tag.tip-open').forEach(t => t.classList.remove('tip-open'));
});
document.addEventListener('touchstart', () => {
  document.querySelectorAll('.trait-tag.tip-open').forEach(t => t.classList.remove('tip-open'));
  document.querySelectorAll('.spell-tip.tip-open').forEach(t => { t.classList.remove('tip-open'); const b = t.querySelector('.spell-balloon'); if (b) b.style.display = 'none'; });
}, {passive: true});
document.addEventListener('click', () => {
  document.querySelectorAll('.spell-tip.tip-open').forEach(t => { t.classList.remove('tip-open'); const b = t.querySelector('.spell-balloon'); if (b) b.style.display = 'none'; });
});

// spell-tip: data-tip 속성으로 풍선 동적 생성 (trait-tag와 동일 패턴)
document.addEventListener('mouseover', (e) => {
  const tip = e.target.closest('.spell-tip');
  if (!tip) return;
  if (!tip.querySelector('.spell-balloon') && tip.dataset.tip) {
    const balloon = document.createElement('span');
    balloon.className = 'spell-balloon';
    balloon.textContent = tip.dataset.tip;
    tip.appendChild(balloon);
  }
  const balloon = tip.querySelector('.spell-balloon');
  if (balloon) {
    balloon.style.display = 'block';
    const rect = tip.getBoundingClientRect();
    const bRect = balloon.getBoundingClientRect();
    let left = rect.left + rect.width/2 - bRect.width/2;
    let top = rect.top - bRect.height - 6;
    if (left < 4) left = 4;
    if (left + bRect.width > window.innerWidth - 4) left = window.innerWidth - bRect.width - 4;
    if (top < 4) top = rect.bottom + 6;
    balloon.style.left = left + 'px';
    balloon.style.top = top + 'px';
  }
});
document.addEventListener('mouseout', (e) => {
  const tip = e.target.closest('.spell-tip');
  if (tip && !tip.classList.contains('tip-open')) {
    const balloon = tip.querySelector('.spell-balloon');
    if (balloon) balloon.style.display = 'none';
  }
});
document.addEventListener('touchstart', (e) => {
  const tip = e.target.closest('.spell-tip');
  if (!tip) return;
  e.preventDefault();
  e.stopPropagation();
  const isOpen = tip.classList.contains('tip-open');
  document.querySelectorAll('.spell-tip.tip-open').forEach(t => { t.classList.remove('tip-open'); const b = t.querySelector('.spell-balloon'); if (b) b.style.display = 'none'; });
  if (!isOpen) {
    if (!tip.querySelector('.spell-balloon') && tip.dataset.tip) {
      const balloon = document.createElement('span');
      balloon.className = 'spell-balloon';
      balloon.textContent = tip.dataset.tip;
      tip.appendChild(balloon);
    }
    tip.classList.add('tip-open');
    const balloon = tip.querySelector('.spell-balloon');
    if (balloon) {
      balloon.style.display = 'block';
      const rect = tip.getBoundingClientRect();
      const bRect = balloon.getBoundingClientRect();
      let left = rect.left + rect.width/2 - bRect.width/2;
      let top = rect.top - bRect.height - 6;
      if (left < 4) left = 4;
      if (left + bRect.width > window.innerWidth - 4) left = window.innerWidth - bRect.width - 4;
      if (top < 4) top = rect.bottom + 6;
      balloon.style.left = left + 'px';
      balloon.style.top = top + 'px';
    }
  }
}, {passive: false});

// ═══════════════════════════════════════════════
//  DESC DYNAMIC REFERENCES  {{type:key}}
// ═══════════════════════════════════════════════

const _DESC_REF_RE = /\{\{(spell|feat|condition|trait|action):([^}]+)\}\}/g;

function _lookupDescRef(type, key) {
  switch (type) {
    case 'spell': {
      const sp = typeof SPELL_DB!=='undefined' && SPELL_DB.find(s => s.name_en === key);
      return sp ? {ko: sp.name_ko, en: sp.name_en, summary: sp.summary||'', desc: sp.desc||''} : null;
    }
    case 'feat': {
      const f = typeof FEAT_DB!=='undefined' && FEAT_DB.find(x => x.name_en === key);
      return f ? {ko: f.name_ko, en: f.name_en, summary: f.summary||'', desc: f.desc||''} : null;
    }
    case 'condition': {
      const c = typeof CONDITIONS_DATA!=='undefined' && CONDITIONS_DATA.find(c => c.en.toLowerCase() === key.toLowerCase());
      return c ? {ko: c.name, en: c.en, summary: c.desc||'', desc: c.desc||''} : null;
    }
    case 'trait': {
      const k = key.charAt(0).toUpperCase() + key.slice(1);
      const tVal = typeof TRAIT_DB!=='undefined' && (TRAIT_DB[key] || TRAIT_DB[k]);
      return tVal ? {ko: key, en: key, summary: typeof tVal==='string'?tVal:tVal.desc||'', desc: typeof tVal==='string'?tVal:tVal.desc||''} : null;
    }
    case 'action': {
      const a = typeof ACTION_DB!=='undefined' && ACTION_DB.find(a => a.name_en === key);
      return a ? {ko: a.name_ko, en: a.name_en, summary: a.summary||'', desc: a.desc||a.summary||''} : null;
    }
  }
  return null;
}

function resolveDescRefs(html) {
  if (!html || typeof html !== 'string') return html||'';
  return html.replace(_DESC_REF_RE, (match, type, key) => {
    const data = _lookupDescRef(type, key);
    if (!data) return match;
    const label = data.ko ? `${data.ko}(${data.en})` : data.en;
    return `<span class="desc-ref" data-ref-type="${type}" data-ref-key="${key.replace(/"/g,'&quot;')}">${label}</span>`;
  });
}

// desc-ref 팝업 (이벤트 위임)
(function() {
  let _refPopup = null;

  function _createRefPopup() {
    if (_refPopup) return _refPopup;
    _refPopup = document.createElement('div');
    _refPopup.id = 'desc-ref-popup';
    _refPopup.style.cssText = 'display:none;position:fixed;z-index:10001;max-width:340px;min-width:200px;background:var(--bg2,#1e1e1e);border:1px solid var(--gold,#d4a843);border-radius:8px;padding:12px 14px;box-shadow:0 4px 20px rgba(0,0,0,.5);font-size:12px;line-height:1.6;color:var(--text,#e0e0e0);pointer-events:auto;';
    document.body.appendChild(_refPopup);
    return _refPopup;
  }

  function _showRefPopup(el) {
    const type = el.dataset.refType;
    const key = el.dataset.refKey;
    const data = _lookupDescRef(type, key);
    if (!data) return;
    const popup = _createRefPopup();
    const typeLabel = {spell:'주문',feat:'재주',condition:'상태',trait:'특성',action:'행동'}[type]||type;
    const typeBadge = `<span style="display:inline-block;background:var(--gold,#d4a843);color:#000;font-size:10px;font-weight:700;padding:1px 6px;border-radius:3px;margin-right:6px;">${typeLabel}</span>`;
    const titleKo = data.ko || data.en;
    const titleEn = data.en && data.en !== data.ko ? `<span style="color:var(--text2,#999);font-size:11px;margin-left:4px;">${data.en}</span>` : '';
    let body = data.summary || data.desc || '';
    const plain = body.replace(/<[^>]*>/g,'');
    const display = plain.length > 200 ? plain.substring(0, 200) + '…' : plain;
    popup.innerHTML = `<div style="margin-bottom:6px;">${typeBadge}<strong>${titleKo}</strong>${titleEn}</div><div style="color:var(--text2,#bbb);font-size:11px;line-height:1.5;">${display}</div>`;
    popup.style.display = 'block';
    const rect = el.getBoundingClientRect();
    const pRect = popup.getBoundingClientRect();
    let left = rect.left + rect.width/2 - pRect.width/2;
    let top = rect.top - pRect.height - 8;
    if (left < 4) left = 4;
    if (left + pRect.width > window.innerWidth - 4) left = window.innerWidth - pRect.width - 4;
    if (top < 4) top = rect.bottom + 8;
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
  }

  function _hideRefPopup() {
    if (_refPopup) _refPopup.style.display = 'none';
  }

  document.addEventListener('mouseover', (e) => {
    const ref = e.target.closest('.desc-ref');
    if (ref) _showRefPopup(ref);
  });
  document.addEventListener('mouseout', (e) => {
    const ref = e.target.closest('.desc-ref');
    if (ref) _hideRefPopup();
  });
  document.addEventListener('touchstart', (e) => {
    const ref = e.target.closest('.desc-ref');
    if (ref) {
      e.preventDefault(); e.stopPropagation();
      if (_refPopup && _refPopup.style.display === 'block') { _hideRefPopup(); return; }
      _showRefPopup(ref);
    } else { _hideRefPopup(); }
  }, {passive: false});
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.desc-ref') && !e.target.closest('#desc-ref-popup')) _hideRefPopup();
  });
})();

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
//  SPELL ↔ FEAT INTERACTION NOTES
// ═══════════════════════════════════════════════

const SPELL_FEAT_MODS = [
  // 주사위 변경
  { feat:'치유의 손', spell:'치유', note:'🔷 <b>치유의 손</b> — d8 대신 <b>d10</b>을 굴립니다.' },
  { feat:'해로운 손', spell:'해로움', note:'🔷 <b>해로운 손</b> — d8 대신 <b>d10</b>을 굴립니다.' },
  { feat:'마법 손', spell:'치유', note:'🔷 <b>마법 손</b> — 상처 치료 성공 시 d8→d10, 치유에 레벨만큼 상태 보너스.' },
  // 시전 방식 변경
  { feat:'선택적 에너지', spell:'치유', note:'🔷 <b>선택적 에너지</b> — 3행동(영역) 시전 시 최대 5명을 제외할 수 있습니다.' },
  { feat:'선택적 에너지', spell:'해로움', note:'🔷 <b>선택적 에너지</b> — 3행동(영역) 시전 시 최대 5명을 제외할 수 있습니다.' },
  { feat:'빠른 채널', spell:'치유', note:'🔷 <b>빠른 채널</b> — 2행동으로 시전해도 3행동 버전의 영역 효과를 얻습니다.' },
  { feat:'빠른 채널', spell:'해로움', note:'🔷 <b>빠른 채널</b> — 2행동으로 시전해도 3행동 버전의 영역 효과를 얻습니다.' },
  { feat:'밀물과 썰물', spell:'치유', note:'🔷 <b>밀물과 썰물</b> — 1~2행동 시전 시 적 1명에 피해 + 아군 1명에 회복을 동시에.' },
  { feat:'밀물과 썰물', spell:'해로움', note:'🔷 <b>밀물과 썰물</b> — 1~2행동 시전 시 적 1명에 피해 + 아군 1명에 회복을 동시에.' },
  // 추가 효과
  { feat:'신성 주입', spell:'치유', note:'🔷 <b>신성 주입</b> — 대상의 다음 근접 공격에 추가 1d6 활력 피해 (5랭크 2d6, 8랭크 3d6).' },
  { feat:'신성 주입', spell:'해로움', note:'🔷 <b>신성 주입</b> — 대상의 다음 근접 공격에 추가 1d6 공허 피해 (5랭크 2d6, 8랭크 3d6).' },
  { feat:'순교자', spell:'치유', note:'🔷 <b>순교자</b> — 자신이 랭크당 1d8 HP를 잃고, 아군이 같은 양만큼 추가 회복.' },
  { feat:'순교자', spell:'해로움', note:'🔷 <b>순교자</b> — 자신이 랭크당 1d8 HP를 잃고, 아군이 같은 양만큼 추가 회복.' },
  { feat:'방어적 회복', spell:'치유', note:'🔷 <b>방어적 회복</b> — 단일 대상 HP 회복 시, 1라운드간 AC와 내성에 +2 상태 보너스.' },
  { feat:'방어적 회복', spell:'해로움', note:'🔷 <b>방어적 회복</b> — 단일 대상 HP 회복 시, 1라운드간 AC와 내성에 +2 상태 보너스.' },
  { feat:'채널 차단', spell:'치유', note:'🔷 <b>채널 차단</b> — 방패 막기 시 소비하여 경도 +랭크당 1d8.' },
  { feat:'채널 차단', spell:'해로움', note:'🔷 <b>채널 차단</b> — 방패 막기 시 소비하여 경도 +랭크당 1d8.' },
  // 축복 관련
  { feat:'영원한 축복', spell:'축복', note:'🔷 <b>영원한 축복</b> — 영구적으로 15피트 반경 축복 효과. 해산 가능, 1분 후 자동 복귀.' },
];

function getSpellFeatNotes(spellNameKo) {
  if (!state.feats) return '';
  const allFeats = Object.values(state.feats).flat().map(f => f.name.split(' (')[0].trim());
  const notes = SPELL_FEAT_MODS
    .filter(m => m.spell === spellNameKo && allFeats.includes(m.feat))
    .map(m => m.note);
  if (!notes.length) return '';
  return '<div style="margin-top:10px;padding:8px 10px;background:rgba(100,160,255,0.08);border-left:3px solid var(--accent);border-radius:4px;font-size:12px;line-height:1.6;">' + notes.join('<br>') + '</div>';
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
    item = FEAT_DB.find(f => f && f.name_ko === nameKo) ||
           FEAT_DB.find(f => f && nameKo.startsWith(f.name_ko));
  } else if (type === 'heritage' && typeof HERITAGE_DB !== 'undefined') {
    item = HERITAGE_DB.find(h => h.name_ko === nameKo);
  } else if (type === 'weapon' && typeof WEAPON_DB !== 'undefined') {
    item = WEAPON_DB.find(w => w.name_ko === nameKo);
  } else if (type === 'armor' && typeof ARMOR_DB !== 'undefined') {
    item = ARMOR_DB.find(a => a.name_ko === nameKo);
  } else if (type === 'shield' && typeof SHIELD_DB !== 'undefined') {
    item = SHIELD_DB.find(s => s.name_ko === nameKo);
  } else if (type === 'gear' && typeof GEAR_DB !== 'undefined') {
    item = GEAR_DB.find(g => g.name_ko === nameKo);
  }

  // 파손된 장비인지 확인하여 수치 조정
  const brokenEquip = state.equip?.find(e => e.name === nameKo && e._broken);
  if (item && brokenEquip) {
    item = {...item}; // 원본 보존을 위해 복사
    item.name_ko = '파손된 ' + item.name_ko;
    if (item.damage) item.summary = (item.summary||'') + '<br><br><strong style="color:var(--red-light);">⚠ 파손됨:</strong> 명중 굴림 -2 페널티.';
    if (item.ac_bonus !== undefined) {
      const original = item.ac_bonus;
      item.ac_bonus = Math.floor(original / 2);
      item.summary = (item.summary||'') + '<br><br><strong style="color:var(--red-light);">⚠ 파손됨:</strong> AC 보너스가 +' + original + '에서 +' + item.ac_bonus + '으로 감소.';
    }
    if (item.hardness !== undefined) item.summary = (item.summary||'') + '<br><br><strong style="color:var(--red-light);">⚠ 파손됨:</strong> 방패 올리기로 AC 보너스를 받을 수 없습니다.';
  }

  // DB에 없으면 커스텀 장비 데이터 확인 후 임시 카드
  if (!item) {
    const nameEn = (name.match(/\(([^)]+)\)/) || [])[1] || '';
    // 커스텀 장비: state.equip에서 _data 또는 _desc 활용
    const eqMatch = state.equip?.find(e => e.name === nameKo);
    if (eqMatch && eqMatch._data) {
      item = {...eqMatch._data, name_ko: eqMatch._data.name_ko || nameKo, name_en: eqMatch._data.name_en || nameEn};
    } else if (eqMatch && eqMatch._desc) {
      item = {name_ko: nameKo, name_en: nameEn, summary: eqMatch._desc};
    } else {
      item = {
        name_ko: nameKo, name_en: nameEn,
        summary: 'DB에 상세 정보가 없습니다.',
        ...(type === 'feat' ? {feat_level:'?', category:'-', traits:[], prerequisites:''} : {}),
        ...(type === 'spell' ? {rank:0, is_cantrip:false, is_focus:false, traditions:[], traits:[], actions:''} : {}),
      };
    }
  }

  const titleMap = {spell:'주문 정보', feat:'재주 정보', heritage:'유산 정보', weapon:'무기 정보', armor:'방어구 정보', shield:'방패 정보', gear:'장비 정보'};
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
      let desc = item.desc || item.summary || '';
      let tags = '';
      if (item.feat_level !== undefined) tags = `<span class="tag-meta">${item.feat_level}레벨</span> <span class="tag-meta">${item.category||''}</span>`;
      else if (item.rank !== undefined) tags = `<span class="tag-meta">${item.is_cantrip?'캔트립':'랭크 '+item.rank}</span> <span class="spell-actions">${item.actions||''}</span>`;
      else if (item.damage) tags = `<span class="tag-meta">${item.damage}</span> <span class="tag-meta">${item.price||''}</span>`;
      else if (item.ac_bonus !== undefined) tags = `<span class="tag-meta">AC+${item.ac_bonus}</span>`;
      // 주문 메타 구조화
      let spellMeta = '';
      if (item.rank !== undefined) {
        const spTraits = [...(item.traditions||[]),...(item.traits||[])].map(t => typeof traitTag==='function'?traitTag(t):`<span class="tag">${t}</span>`).join('');
        if (spTraits) spellMeta += `<div style="margin-bottom:6px;">${spTraits}</div>`;
        let metaLines = '';
        if (item.castTime) metaLines += `<div><strong>시전:</strong> ${item.castTime}</div>`;
        if (item.range) metaLines += `<div><strong>사거리:</strong> ${item.range}${item.area ? ` | <strong>영역:</strong> ${item.area}` : ''}</div>`;
        if (item.target) metaLines += `<div><strong>대상:</strong> ${item.target}</div>`;
        if (item.defense) metaLines += `<div><strong>방어:</strong> ${item.defense}</div>`;
        if (item.duration) metaLines += `<div><strong>지속 시간:</strong> ${item.duration}</div>`;
        if (item.trigger) metaLines += `<div><strong>유발 조건:</strong> ${item.trigger}</div>`;
        if (metaLines) spellMeta += `<div style="font-size:12px;line-height:1.6;padding:6px 0;margin-bottom:6px;border-bottom:1px solid var(--border);color:var(--text2);">${metaLines}</div>`;
        desc = desc.replace(/<strong>(?:사거리|영역|대상|방어|지속 ?시간|빈도|유발 조건|요구사항|비용|시전):<\/strong>[^<]*(?:<br>)?/g, '').replace(/^\s*<br>/, '');
      }
      const spellNotes = (item.rank !== undefined) ? getSpellFeatNotes(nameKoD) : '';
      listItems.innerHTML = `<div style="padding:16px;">
        <div style="font-size:16px;font-weight:700;margin-bottom:2px;">${nameKoD}</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:10px;">${nameEnD}</div>
        <div style="margin-bottom:10px;">${tags}</div>
        ${spellMeta}
        <div style="font-size:13px;line-height:1.7;">${typeof formatDescActions==='function'?formatDescActions(desc,item):desc}${spellNotes}</div>
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
  // 기존 기술 숙련값/지식 이름 백업 (DOM 재생성 시 값 유실 방지)
  const savedProfs = {};
  const savedLores = {};
  SKILLS.forEach(sk => {
    const profEl = document.getElementById('sk-prof-' + sk.id);
    if (profEl) savedProfs[sk.id] = profEl.value;
    if (sk.isLore) {
      const loreEl = document.getElementById('lore-name-' + sk.id);
      if (loreEl) savedLores[sk.id] = loreEl.value;
    }
  });
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
    // 백업값 복원
    if (savedProfs[sk.id]) {
      const profEl = document.getElementById('sk-prof-' + sk.id);
      if (profEl) profEl.value = savedProfs[sk.id];
    }
    if (savedLores[sk.id]) {
      const loreEl = document.getElementById('lore-name-' + sk.id);
      if (loreEl) loreEl.value = savedLores[sk.id];
    }
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
    if (c.auto) {
      item.style.opacity = isActive ? '1' : '0.5';
      item.style.cursor = 'default';
      item.title = '부피에 따라 자동 적용/해제';
      item.addEventListener('click', (e) => { toggleCondDesc(c.name); });
    } else {
      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('cond-name')) {
          toggleCondDesc(c.name);
          return;
        }
        toggleCondValue(c.name);
      });
    }

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
    const removeBtn = c.auto
      ? `<span style="color:var(--text2);font-size:10px;opacity:0.3;" title="부피 줄여야 해제">🔒</span>`
      : `<span style="cursor:pointer;color:var(--text2);font-size:10px;" onclick="state.conditions['${c.name}']=0;buildConditions();save();">✕</span>`;
    return `<div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid var(--border);font-size:12px;">
      <span style="color:var(--red-light);font-weight:600;min-width:60px;">⚠ ${c.name}${valText}</span>
      <span style="color:var(--text2);font-size:10px;flex:1;">${c.desc.substring(0, 80)}...</span>
      ${removeBtn}
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
    detail.innerHTML = `<strong>${cdata.name}</strong> <span style="color:var(--text2);">${cdata.en}</span>${cdata.valued ? ' (최대 '+(cdata.max||4)+')' : ''}<br>${resolveDescRefs(cdata.desc)}`;
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

  // 배경 섹션 — 고정 선택 + 자유 선택 분리
  {
    const bg = state.selectedBackground;
    if (!bg) {
      const s = document.createElement('div');
      s.className = 'boost-section';
      s.innerHTML = '<div class="boost-section-title">배경 부스트</div><div class="boost-section-desc" style="color:var(--text2);">배경을 먼저 선택하세요.</div>';
      container.appendChild(s);
    } else {
      const KO_TO_ID = {'근력':'str','민첩':'dex','건강':'con','지능':'int','지혜':'wis','매력':'cha'};
      const boostStr = bg.boosts || '';
      const fixedPart = boostStr.split(',').map(s=>s.trim()).find(p => p.includes('또는'));

      if (fixedPart) {
        // "A 또는 B, 자유" → 고정 + 자유 분리
        const fixedOptions = fixedPart.split('또는').map(s => KO_TO_ID[s.trim().replace(/\(.*\)/,'').trim()] || '').filter(Boolean);
        if (!state.boosts.bgFixed) state.boosts.bgFixed = [];
        if (!state.boosts.bgFree) state.boosts.bgFree = [];
        // bgFixed/bgFree → bg 자동 동기화
        state.boosts.bg = [...state.boosts.bgFixed, ...state.boosts.bgFree];

        // 고정 부스트 (1개)
        container.appendChild(makeBoostSection(
          `배경 고정 부스트 — ${fixedPart}`, `배경: ${bg.name}`,
          'bgFixed', 1, fixedOptions, state.boosts.bgFixed));

        // 자유 부스트 (1개, 고정 선택과 다른 속성)
        const freeAvail = ATTRS.filter(a => !state.boosts.bgFixed.includes(a));
        container.appendChild(makeBoostSection(
          '배경 자유 부스트 (다른 속성 1개)', '고정 부스트와 다른 속성을 선택하세요.',
          'bgFree', 1, freeAvail, state.boosts.bgFree));
      } else {
        // "자유, 자유" — 기존 로직
        container.appendChild(makeBoostSection('배경 부스트 (자유 2개, 서로 다른 속성)',
          `배경: ${bg.name}`, 'bg', 2, ATTRS, state.boosts.bg));
      }
    }
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

// ═══════════════════════════════════════════════
//  빌더 핵심 선택 반응형 재파생 (유산/배경)
//  applyFeatEffects와 동일한 clear+rebuild 패턴
// ═══════════════════════════════════════════════
function rebuildCoreEffects() {
  const heritage = state.selectedHeritage;
  const bg = state.selectedBackground;

  // ── CLEAR PHASE ──

  // 유산 기술: prevRank 복원
  (state._heritageGrantedSkills || []).forEach(entry => {
    const el = document.getElementById('sk-prof-' + entry.skill);
    if (el && parseInt(el.value || 0) === entry.rank) {
      el.value = String(entry.prevRank || 0);
    }
  });
  state._heritageGrantedSkills = [];

  // 유산 재주: _fromHeritage 제거 (choice 스냅샷)
  const savedHeritageChoices = {};
  Object.values(state.feats).forEach(arr => {
    if (!arr) return;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i]?._fromHeritage) {
        if (arr[i].choice) savedHeritageChoices[arr[i].name] = arr[i].choice;
        arr.splice(i, 1);
      }
    }
  });

  // 유산 무기: _fromHeritage 제거
  state.weapons = (state.weapons || []).filter(w => !w._fromHeritage);

  // 유산 선천 주문: _heritage 제거 (캔트립 선택 제외 — _heritageCantrip 재주가 관리)
  if (state.spells?.innate) {
    state.spells.innate = state.spells.innate.filter(s => !s._heritage);
  }

  // 배경 기술: prevRank 복원
  (state._bgGrantedSkills || []).forEach(entry => {
    const el = document.getElementById('sk-prof-' + entry.skill);
    if (el && parseInt(el.value || 0) === entry.rank) {
      el.value = String(entry.prevRank || 0);
    }
  });
  state._bgGrantedSkills = [];

  // 배경 지식: 이름+숙련 복원
  (state._bgGrantedLores || []).forEach(entry => {
    const nameEl = document.getElementById('lore-name-' + entry.slot);
    const profEl = document.getElementById('sk-prof-' + entry.slot);
    if (nameEl && nameEl.value === entry.name) {
      nameEl.value = entry.prevName || '';
      if (profEl) profEl.value = String(entry.prevRank || 0);
    }
  });
  state._bgGrantedLores = [];

  // 배경 재주: _fromBackground 제거
  Object.values(state.feats).forEach(arr => {
    if (!arr) return;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i]?._fromBackground) arr.splice(i, 1);
    }
  });

  // ── REBUILD PHASE ──

  // 유산 HP 보너스
  state._heritageHpBonus = heritage?.hpBonus || 0;

  // 유산 기술 숙련
  if (heritage?.grantSkills) {
    heritage.grantSkills.forEach(sid => {
      const el = document.getElementById('sk-prof-' + sid);
      if (!el) return;
      const cur = parseInt(el.value || 0);
      if (cur < 2) {
        state._heritageGrantedSkills.push({skill: sid, rank: 2, prevRank: cur});
        el.value = '2';
      } else {
        // 이미 2 이상이면 추적만 (clear 시 복원 불필요)
        state._heritageGrantedSkills.push({skill: sid, rank: 2, prevRank: cur});
      }
    });
  }

  // 유산 재주
  if (heritage?.grantFeats) {
    heritage.grantFeats.forEach(entry => {
      const featName = typeof entry === 'string' ? entry : entry.name;
      const presetChoice = typeof entry === 'object' ? entry.choice : undefined;
      const nameKo = featName.split(' (')[0].trim();
      const fd = typeof FEAT_DB !== 'undefined' ? FEAT_DB.find(f => f && f.name_ko === nameKo) : null;
      const cat = fd?.category === 'general' ? 'general' : 'skill';
      if (!state.feats[cat]) state.feats[cat] = [];
      const feat = {name: featName, level: 1, _fromHeritage: true};
      if (savedHeritageChoices[featName]) feat.choice = savedHeritageChoices[featName];
      else if (presetChoice) feat.choice = presetChoice;
      state.feats[cat].push(feat);
    });
  }

  // 유산 무기
  if (heritage?.grantWeapon) {
    const w = heritage.grantWeapon;
    if (typeof addWeapon === 'function') {
      addWeapon({name: w.name, dmg: w.dmg, traits: w.traits, category: w.category, _fromHeritage: true});
    }
  }

  // 유산 선천 주문 (비선택형만 — 선택형��� _heritageCantrip 재주가 관리)
  if (heritage?.innateSpells) {
    if (!state.spells) state.spells = {cantrip:[], known:[], focus:[], innate:[]};
    if (!state.spells.innate) state.spells.innate = [];
    heritage.innateSpells.forEach(sp => {
      const needsChoice = sp.tradition === '원시' || sp.tradition === '선택';
      if (!needsChoice) {
        state.spells.innate.push({name: sp.name, tradition: sp.tradition, type: sp.type, uses: sp.uses, _heritage: true, _source: heritage.name_ko});
      }
    });
  }

  // 배경 기술 + 지식
  if (bg?.skills) {
    let loreUsed = 0;
    bg.skills.split(', ').forEach(skillName => {
      const s = skillName.trim();
      if (s.includes('또는') || s.includes('/') || s.includes('중 선택')) return;
      if (s.endsWith(' 지식') || s === '필사 지식' || s.includes('지식')) {
        const loreName = s.replace(' 지식', '').trim();
        const slot = loreUsed === 0 ? 'lore1' : 'lore2';
        const nameEl = document.getElementById('lore-name-' + slot);
        const profEl = document.getElementById('sk-prof-' + slot);
        if (nameEl && profEl) {
          const prevName = nameEl.value === loreName ? loreName : nameEl.value;
          const prevRank = parseInt(profEl.value || 0);
          state._bgGrantedLores.push({slot, name: loreName, prevName: prevRank < 2 ? '' : prevName, prevRank: prevRank < 2 ? 0 : prevRank});
          if (!nameEl.value || nameEl.value === loreName) nameEl.value = loreName;
          if (prevRank < 2) profEl.value = '2';
        }
        loreUsed++;
      } else {
        const id = skillNameToId(s);
        if (!id) return;
        const el = document.getElementById('sk-prof-' + id);
        if (!el) return;
        const cur = parseInt(el.value || 0);
        if (cur < 2) {
          state._bgGrantedSkills.push({skill: id, rank: 2, prevRank: cur});
          el.value = '2';
        } else {
          state._bgGrantedSkills.push({skill: id, rank: 2, prevRank: cur});
        }
      }
    });
  }

  // 배경 재주
  if (bg?.feat) {
    const featName = bg.feat.trim();
    if (featName && !featName.includes('/') && !featName.includes('또는')) {
      if (!state.feats.skill) state.feats.skill = [];
      state.feats.skill.push({name: featName, level: 1, _fromBackground: true});
    }
  }
}

function recalcAll() {
  // 빌더 핵심 선택 재파생 (유산/배경)
  rebuildCoreEffects();
  // 재주 효과 집계
  if (typeof applyFeatEffects === 'function') applyFeatEffects();
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
  // 주문 탭 렌더링 (선천적 주문 포함)
  if (typeof renderSpells === 'function') renderSpells();
  // 행동 탭이 활성화된 경우에만 재렌더
  if (document.getElementById('panel-actions')?.classList.contains('active')) renderActions();
  // 재주 탭 갱신 (숙련 변경 → 드롭다운 반영)
  if (typeof renderFeats === 'function') renderFeats();
}

function getCondPenalty() {
  const frightened = parseInt(state.conditions['공포'] || 0);
  const sickened = parseInt(state.conditions['메스꺼움'] || 0);
  const clumsy = parseInt(state.conditions['서투름'] || 0);
  const enfeebled = parseInt(state.conditions['약화'] || 0);
  const stupefied = parseInt(state.conditions['현기증'] || 0);
  return {
    all: Math.max(frightened, sickened), // 공포/메스꺼움 중 큰 값
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
  // 파손 시 AC 보너스 절반
  const armorBroken = state.equip?.some(e => e._equipped && e._type === 'armor' && e._broken);
  const armorBonus = armorBroken ? Math.floor((baseAc + potency) / 2) : (baseAc + potency);
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

  // 방패 들기 보너스 (파손 시 0)
  const shieldBroken = state.equip?.some(e => e._equipped && e._type === 'shield' && e._broken);
  const shieldBonus = (state.shieldRaised && !state.shieldStowed && !shieldBroken) ? parseInt(document.getElementById('shield-ac')?.value||0) : 0;
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
  const initEl = document.getElementById('val-init');
  const initBonus = state._fb?.initiative || 0;
  if (initEl) initEl.textContent = fmtBonus(total + initBonus);
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
  // Focus tab breakdown mirrors
  const fKeyLabel = document.getElementById('spell-key-label-f');
  if (fKeyLabel) fKeyLabel.textContent = keyAttr ? keyAttr.substring(0,3).toUpperCase() : '—';
  const fKeyVal = document.getElementById('spell-key-val-f');
  if (fKeyVal) fKeyVal.textContent = getMod(keyAttr);
  const fProfVal = document.getElementById('spell-prof-val-f');
  if (fProfVal) fProfVal.textContent = prof;
  const fItemVal = document.getElementById('spell-item-val-f');
  if (fItemVal) fItemVal.textContent = 0;
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

function getArmorPenalties() {
  const checkPen = parseInt(document.getElementById('armor-check-pen')?.value||0);
  const speedPen = parseInt(document.getElementById('armor-speed-pen')?.value||0);
  const strReq = parseInt(document.getElementById('armor-str-req')?.value||0);
  const strMod = getMod('str');
  const stowed = state.armorStowed || false;
  // 보관 중이면 페널티 없음
  if (stowed) return {check:0, speed:0};
  // 근력 충족 시 속도 페널티 면제 (판정 페널티는 항상 적용)
  const meetsStr = strMod >= strReq;
  // 가혹한 근면 (Unburdened Iron): 속도 페널티 무시 + 다른 속도 페널티 5피트 경감
  const hasUnburdenedIron = state._fb?.unburdenedIron || false;
  let finalSpeed = meetsStr ? 0 : speedPen;
  if (hasUnburdenedIron) finalSpeed = 0; // 갑옷 속도 페널티 완전 무시
  return {check: checkPen, speed: finalSpeed};
}

function recalcSkills() {
  SKILLS.forEach(sk => recalcSkill(sk.id));
}

function recalcSkill(id) {
  const sk = SKILLS.find(s=>s.id===id);
  if (!sk) return;
  let rank = parseInt(document.getElementById('sk-prof-'+id)?.value||0);
  // 재주에 의한 기술 숙련 적용
  const featSkill = state._fb?.skills?.[id];
  if (featSkill && featSkill.min_rank > rank) {
    rank = featSkill.min_rank;
    const sel = document.getElementById('sk-prof-'+id);
    if (sel) sel.value = rank;
    if (typeof syncProfRankBadge === 'function') syncProfRankBadge('rank-sk-'+id, 'sk-prof-'+id);
  }
  // 임시 숙련 (조상의 장수) — 실제 등급이 이미 숙련 이상이면 무시
  let isTemp = false;
  if (state.tempSkillTrained === id && rank < 2) {
    rank = 2;
    isTemp = true;
  }
  // 임시 전문가 (전문가의 장수) — 숙련이면 전문가로
  if (state.tempSkillExpert === id && rank >= 2 && rank < 4) {
    rank = 4;
    isTemp = true;
  }
  const lv = getLevel();
  const base = getMod(sk.attr) + (rank>0?rank+lv:0);
  const pen = getCondPenalty();
  let extraPen = 0;
  if (sk.attr === 'str') extraPen = pen.enfeebled;
  if (sk.attr === 'dex') extraPen = pen.clumsy;
  if (['int','wis','cha'].includes(sk.attr)) extraPen = pen.stupefied;
  // 갑옷 판정 페널티 (STR/DEX 기반 기술에 적용)
  let armorCheckPen = 0;
  if (sk.attr === 'str' || sk.attr === 'dex') {
    armorCheckPen = getArmorPenalties().check;
  }
  applyPenaltyColor(document.getElementById('sk-val-'+id), base, pen.all + extraPen + armorCheckPen);
  // 임시 숙련 표시
  const nameEl = document.querySelector(`#skills-list .skill-row:nth-child(${SKILLS.indexOf(sk)+1}) .skill-name`);
  const tempLabel = nameEl?.querySelector('.temp-trained-label');
  if (isTemp && !tempLabel) {
    const span = document.createElement('span');
    span.className = 'temp-trained-label';
    span.style.cssText = 'font-size:9px;color:var(--accent);margin-left:4px;';
    span.textContent = '(임시 숙련)';
    nameEl?.appendChild(span);
  } else if (!isTemp && tempLabel) {
    tempLabel.remove();
  }
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
  // 방패 HP ≤ BT(max/2)이면 자동 파손
  const bt = Math.floor(shieldHp / 2);
  if (shieldName && shieldHp > 0) {
    const shieldEquip = state.equip?.find(e => e._type === 'shield' && e._equipped);
    if (shieldEquip) {
      const wasBroken = shieldEquip._broken;
      shieldEquip._broken = cur <= bt;
      if (wasBroken !== shieldEquip._broken) { recalcAC(); }
    }
  }
  // 게이지 색상: 파손 시 빨간색
  if (fill) {
    if (cur <= bt && shieldHp > 0) fill.style.background = 'linear-gradient(90deg,#6a1a1a,#a03030)';
    else fill.style.background = 'linear-gradient(90deg,#4a3a1a,#8a6a2a)';
  }
}

function renderResistances() {
  const wrap = document.getElementById('resistances-display');
  const list = document.getElementById('resistances-list');
  if (!wrap || !list) return;

  const resistances = [];
  const lv = getLevel();
  const halfLv = Math.max(1, Math.floor(lv / 2));

  // 유산에서 저항 가져오기
  const heritage = state.selectedHeritage;
  if (heritage?.resistances) {
    heritage.resistances.forEach(r => {
      const val = r.formula === 'half' ? halfLv : (r.value || 0);
      resistances.push({type: r.type, value: val, source: heritage.name_ko});
    });
  }

  // FEAT_EFFECTS에서 저항 가져오기 (state._fb에 저장된 것)
  // 향후 확장 가능

  if (resistances.length === 0) {
    wrap.style.display = 'none';
    return;
  }
  wrap.style.display = '';
  list.innerHTML = resistances.map(r =>
    `<span class="tag" style="font-size:10px;background:var(--bg4);border:1px solid var(--border2);">🛡 ${r.type} ${r.value}</span>`
  ).join('');
}

function recalcBulk() {
  let total = 0;
  state.equip.forEach(e => {
    const b = parseFloat(e.bulk||0);
    total += isNaN(b)?0:b;
  });
  // 배낭 내 아이템 부피 (ignoreBulk가 아닌 경우만)
  if (state.containers) {
    state.containers.forEach(c => {
      if (c.ignoreBulk) return;
      c.items.forEach(e => {
        const b = parseFloat(e.bulk||0);
        total += isNaN(b)?0:b;
      });
    });
  }
  // 동전 부피: 100개당 0.1 부피
  const totalCoins = ['cur-gp','cur-sp','cur-cp','cur-pp'].reduce((s,id) => s + (parseInt(document.getElementById(id)?.value)||0), 0);
  total += Math.floor(totalCoins / 100) * 0.1;

  document.getElementById('bulk-total').textContent = total.toFixed(1).replace('.0','');
  const fbBulk = state._fb?.bulk || 0;
  const strMod = getMod('str');
  const encThreshold = strMod + 5 + fbBulk;   // 과적 기준
  const maxBulk = strMod + 10 + fbBulk;        // 소지 한계
  document.getElementById('bulk-max').textContent = encThreshold;

  // 과적/초과 상태 판정
  const bulkStatus = document.getElementById('bulk-status');
  const bulkTotal = document.getElementById('bulk-total');
  const isEncumbered = total > encThreshold;
  const isOverloaded = total > maxBulk;

  if (isOverloaded) {
    if (bulkStatus) { bulkStatus.textContent = '⛔ 소지 불가! (한계 ' + maxBulk + ')'; bulkStatus.style.color = '#ff4444'; }
    if (bulkTotal) bulkTotal.style.color = '#ff4444';
  } else if (isEncumbered) {
    if (bulkStatus) { bulkStatus.textContent = '⚠ 과적 (서투름 1, 속도 -10ft)'; bulkStatus.style.color = '#ffaa00'; }
    if (bulkTotal) bulkTotal.style.color = '#ffaa00';
  } else {
    if (bulkStatus) { bulkStatus.textContent = ''; bulkStatus.style.color = ''; }
    if (bulkTotal) bulkTotal.style.color = '';
  }

  // 과적 상태이상 자동 적용/해제
  const wasEncumbered = !!state.conditions['과적'];
  if (isEncumbered && !wasEncumbered) {
    state.conditions['과적'] = true;
    if ((parseInt(state.conditions['서투름'])||0) < 1) state.conditions['서투름'] = 1;
    buildConditions();
  } else if (!isEncumbered && wasEncumbered) {
    state.conditions['과적'] = false;
    if ((parseInt(state.conditions['서투름'])||0) <= 1) state.conditions['서투름'] = 0;
    buildConditions();
  }

  // 과적 시 속도 감소 반영
  recalcSpeed(isEncumbered);
}

function isOverloaded() {
  let total = 0;
  state.equip.forEach(e => { const b = parseFloat(e.bulk||0); total += isNaN(b)?0:b; });
  if (state.containers) state.containers.forEach(c => { if (c.ignoreBulk) return; c.items.forEach(e => { const b = parseFloat(e.bulk||0); total += isNaN(b)?0:b; }); });
  const totalCoins = ['cur-gp','cur-sp','cur-cp','cur-pp'].reduce((s,id) => s + (parseInt(document.getElementById(id)?.value)||0), 0);
  total += Math.floor(totalCoins / 100) * 0.1;
  return total > getMod('str') + 10 + (state._fb?.bulk || 0);
}

function recalcSpeed(isEncumbered) {
  const speedEl = document.getElementById('speed');
  const baseSpeed = parseInt(speedEl?.value||25);
  const hasUI = state._fb?.unburdenedIron || false;
  const encPenalty = isEncumbered ? (hasUI ? 5 : 10) : 0;
  const effSpeed = Math.max(5, baseSpeed - encPenalty);
  const dispEl = document.getElementById('speed-display');
  if (dispEl) {
    dispEl.textContent = effSpeed;
    dispEl.style.color = isEncumbered ? '#ffaa00' : '';
  }
  const effLabel = document.getElementById('speed-enc-label');
  if (effLabel) {
    if (isEncumbered) {
      effLabel.textContent = hasUI ? '(과적 -5, 가혹한 근면)' : '(과적 -10)';
      effLabel.style.display = 'inline';
    } else {
      effLabel.textContent = '';
      effLabel.style.display = 'none';
    }
  }
}

function updateHP() {
  const lv = getLevel();
  if (state.selectedClass && state.selectedAncestry) {
    const ancHP = state.selectedAncestry.hp;
    const clsHP = state.selectedClass.hp;
    const conMod = getMod('con');
    const max = ancHP + (state._heritageHpBonus || 0) + (clsHP + conMod) * lv + (state._fb?.hp || 0);
    const maxEl = document.getElementById('hp-max');
    const curEl = document.getElementById('hp-cur');
    const oldMax = parseInt(maxEl.value || 0);
    maxEl.value = max;
    // 현재 HP: 이전 최대치와 같았거나 0이면 → 새 최대치로 갱신
    // 그렇지 않으면 (피해를 입은 상태) 유지하되 새 최대치 초과 방지
    if (curEl) {
      const curHP = parseInt(curEl.value || 0);
      if (curHP === 0 || curHP === oldMax) {
        curEl.value = max;
      } else if (curHP > max) {
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
    const val = Math.max(state.extraSpeeds[key] || 0, state._fb?.extraSpeeds?.[key] || 0);
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

