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
    // 풀 기반 type별 max 합산 (v530~)
    const speedExtra = (typeof getStackedBonus === 'function') ? getStackedBonus('speed', null) : {total:0, picks:[]};
    const baseSpeed = parseInt(speedVal.value || '25') + speedExtra.total + armorPen.speed;
    speedDisp.textContent = Math.max(5, baseSpeed);
    speedDisp.dataset.bonusPicks = JSON.stringify(speedExtra.picks);
  }
  // 감각 표시 (유산 vision이 혈통 vision보다 우선)
  const sensesEl = document.getElementById('char-senses');
  if (sensesEl) {
    const ancVision = state.selectedAncestry?.vision || 'none';
    const stateVision = state.vision || 'none';
    // 더 좋은 시야를 사용 (상위 암시야 > 암시야 > 저광 시야 > 없음)
    const vision = (VISION_RANK[stateVision]||0) >= (VISION_RANK[ancVision]||0) ? stateVision : ancVision;
    const ko = VISION_KO[vision] || '';
    const en = VISION_EN[vision] || '';
    let sensesText = (ko && en) ? `${ko} (${en})` : (ko || '—');
    // 유산 추가 감각
    const heritageSense = getHeritageEffects(state.selectedHeritage).extraSenses;
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
  // v526~ TRAIT_DB array 형식. id 또는 name_ko로 lookup, 끝의 dice 표기 제거 후 재시도
  let t = getTrait(name) || getTrait(name.replace(/\s*\d+.*$/, ''));
  // FVTT-네이티브 데이터는 트레잇/시전전통이 슬러그(arcane 등)로 들어올 수 있음.
  // 글로서리(PF2eAnc._glossary.traitKo: slug→한글)로 한글화 후 재조회하여 설명을 해소.
  const gloss = (typeof PF2eAnc !== 'undefined' && PF2eAnc._glossary && PF2eAnc._glossary.traitKo) ? PF2eAnc._glossary.traitKo : null;
  if (!t && gloss) { const ko = gloss(name); if (ko && ko !== name) t = getTrait(ko); }
  const desc = t?.desc || null;
  // 표시 라벨: 한글 우선. TRAIT_DB name_ko가 영문 슬러그(arcane 등)면 글로서리 한글명으로 대체.
  const _hangul = s => /[가-힣]/.test(s || '');
  let label = (t && _hangul(t.name_ko)) ? t.name_ko : name;
  if (!_hangul(label) && gloss) { const ko = gloss(label); if (ko && ko !== label) label = ko; }
  if (desc) {
    return `<span class="trait-tag" onmouseenter="posTraitTip(this)" onmouseleave="hideTraitTip(this)" ontouchstart="toggleTraitTip(event,this)">${label}<span class="trait-balloon">${desc}</span></span>`;
  }
  // 설명이 없어도 동일한 칩 형태(.trait-tag)로 통일 — plain .tag로 떨어져 "칩 아닌 것"이 섞이지 않도록.
  return `<span class="trait-tag">${label}</span>`;
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

// 활성 보너스 출처 툴팁: data-bonus-picks 속성 있는 요소에 마우스/터치 시 출처 풍선 (v530~)
(function initBonusTooltips() {
  let balloon = null;
  function getBalloon() {
    if (balloon) return balloon;
    balloon = document.createElement('div');
    balloon.className = 'bonus-balloon';
    balloon.style.cssText = 'position:fixed;display:none;background:#222;color:#fff;border:1px solid var(--gold);padding:8px 10px;border-radius:6px;font-size:12px;z-index:10000;max-width:280px;line-height:1.5;pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,0.4)';
    document.body.appendChild(balloon);
    return balloon;
  }
  function show(el) {
    let picks;
    try { picks = JSON.parse(el.dataset.bonusPicks || '[]'); } catch(e) { return; }
    if (!picks.length) return;
    const html = picks.map(p => {
      const t = p.bonus_type ? `<span style="color:var(--gold);font-weight:600">[${p.bonus_type}]</span> ` : '';
      const sign = (typeof p.value === 'number' && p.value < 0) ? '' : '+';
      const cond = p.condition ? `<div style="color:#aaa;font-size:11px;margin-left:8px">└ ${p.condition}</div>` : '';
      return `<div>${t}${sign}${p.value} <em style="color:#ddd">${p.source||''}</em>${cond}</div>`;
    }).join('');
    const b = getBalloon();
    b.innerHTML = '<div style="color:var(--gold);font-weight:600;margin-bottom:4px">활성 보너스</div>' + html;
    b.style.display = 'block';
    const rect = el.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    let left = rect.left + rect.width/2 - bRect.width/2;
    let top = rect.top - bRect.height - 6;
    if (left < 4) left = 4;
    if (left + bRect.width > window.innerWidth - 4) left = window.innerWidth - bRect.width - 4;
    if (top < 4) top = rect.bottom + 6;
    b.style.left = left + 'px';
    b.style.top = top + 'px';
  }
  function hide() { if (balloon) balloon.style.display = 'none'; }
  document.addEventListener('mouseover', e => {
    const el = e.target.closest('[data-bonus-picks]');
    if (el && el.dataset.bonusPicks && el.dataset.bonusPicks !== '[]') show(el);
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('[data-bonus-picks]')) hide();
  });
  document.addEventListener('touchstart', e => {
    const el = e.target.closest('[data-bonus-picks]');
    if (el && el.dataset.bonusPicks && el.dataset.bonusPicks !== '[]') {
      show(el);
      setTimeout(hide, 3000);
    } else hide();
  }, {passive: true});
})();

// ref-link[data-ref="cat.slug"] 툴팁: 호버=미리보기 / 클릭·탭=고정(스크롤로 긴 내용 읽기, ✕·바깥클릭 닫기).
// 모바일도 탭으로 고정(홀드 불필요).
(function initRefLinkTooltips() {
  let balloon = null, pinned = false;
  function getBalloon() {
    if (balloon) return balloon;
    balloon = document.createElement('div');
    balloon.className = 'reflink-balloon';
    balloon.style.cssText = 'position:fixed;display:none;background:#1c1712;color:#eee;border:1px solid var(--gold,#c9a44a);padding:10px 12px;border-radius:8px;font-size:12px;z-index:10001;max-width:min(360px,92vw);max-height:56vh;overflow:auto;line-height:1.55;box-shadow:0 8px 24px rgba(0,0,0,0.55);-webkit-overflow-scrolling:touch;';
    document.body.appendChild(balloon);
    return balloon;
  }
  const cache = {};
  function body(ref) {
    if (cache[ref] !== undefined) return cache[ref];
    if (typeof PF2eData === 'undefined') return null;   // 카탈로그 미로드 → 다음 시도 때 재조회(캐시 안 함)
    const dot = ref.indexOf('.'); if (dot < 0) return (cache[ref] = null);
    const cat = ref.slice(0, dot), slug = ref.slice(dot + 1);
    let t; try { t = PF2eData.get(cat, slug); } catch (e) {}
    if (!t) return null;
    const name = t.name_ko || t.name || slug;
    let desc = t._desc_ko || (t.system && t.system.description && t.system.description.value) || '';
    try { if (desc) desc = PF2eData.enrichDesc(desc); } catch (e) {}
    return (cache[ref] = { name: name, desc: desc });
  }
  function render(ref, withClose) {
    const b = body(ref); if (!b) return null;
    const close = withClose ? '<span class="reflink-close" style="float:right;cursor:pointer;color:var(--gold,#c9a44a);font-weight:700;margin:-2px -4px 0 8px;font-size:15px;line-height:1">✕</span>' : '';
    return close + '<div style="color:var(--gold,#c9a44a);font-weight:700;margin-bottom:4px">' + b.name + '</div>' + (b.desc ? '<div style="color:#ddd">' + b.desc + '</div>' : '<div style="color:#999">(설명 없음)</div>');
  }
  function place(el) {
    const b = balloon, rect = el.getBoundingClientRect(), bRect = b.getBoundingClientRect();
    let left = rect.left + rect.width / 2 - bRect.width / 2;
    let top = rect.top - bRect.height - 8;
    if (left < 4) left = 4;
    if (left + bRect.width > window.innerWidth - 4) left = window.innerWidth - bRect.width - 4;
    if (top < 4) top = rect.bottom + 8;
    if (top + bRect.height > window.innerHeight - 4) top = Math.max(4, window.innerHeight - bRect.height - 4);
    b.style.left = left + 'px'; b.style.top = top + 'px';
  }
  function preview(el) {
    if (pinned) return;
    const html = render(el.dataset.ref, false); if (!html) return;
    const b = getBalloon(); b.style.pointerEvents = 'none'; b.innerHTML = html; b.style.display = 'block'; place(el);
  }
  function pin(el) {
    const html = render(el.dataset.ref, true); if (!html) return;
    const b = getBalloon(); b.style.pointerEvents = 'auto'; b.innerHTML = html; b.style.display = 'block'; pinned = true; place(el);
  }
  function hide() { pinned = false; if (balloon) balloon.style.display = 'none'; }
  document.addEventListener('mouseover', e => { const el = e.target.closest('.ref-link[data-ref]'); if (el) preview(el); });
  document.addEventListener('mouseout', e => { if (!pinned && e.target.closest('.ref-link[data-ref]')) hide(); });
  document.addEventListener('click', e => {
    if (e.target.closest('.reflink-close')) { hide(); return; }
    const el = e.target.closest('.ref-link[data-ref]');
    if (el) { pin(el); e.preventDefault(); e.stopPropagation(); return; }   // 클릭·탭 → 고정
    if (pinned && !e.target.closest('.reflink-balloon')) hide();            // 바깥 클릭 → 닫기
  });
})();

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
//  DB LOOKUP HELPERS (v523~)
//  텍스트 매칭 정규화: name_en/name_ko 직접 비교 대신 캐시된 Map 인덱스 사용
//  audit_text_lookups.js의 .name_en === / .name_ko === 패턴 회피
// ═══════════════════════════════════════════════

const _DB_INDEX_CACHE = new WeakMap();
function _getDbIndex(db, fields) {
  let idx = _DB_INDEX_CACHE.get(db);
  if (idx) return idx;
  idx = {};
  for (const f of fields) idx[f] = new Map();
  for (const item of db) {
    if (!item) continue;
    for (const f of fields) {
      const v = item[f];
      if (v != null && !idx[f].has(v)) idx[f].set(v, item);
    }
  }
  _DB_INDEX_CACHE.set(db, idx);
  return idx;
}

// 통합 lookup: id 우선 → name_en → name_ko (각 DB별)
function _findInDb(db, key, fields) {
  if (!db || !key) return null;
  const idx = _getDbIndex(db, fields);
  for (const f of fields) {
    const hit = idx[f].get(key);
    if (hit) return hit;
  }
  return null;
}

// 주문 카탈로그 = FVTT 단일 소스(PF2eSpell). 미로드 시 빈 목록(로딩 게이트가 커버).
function _allSpells() {
  return (typeof PF2eSpell !== 'undefined' && PF2eSpell.ready && PF2eSpell.ready()) ? PF2eSpell.spellList() : [];
}
function getSpell(key) {
  return (typeof PF2eSpell !== 'undefined' && PF2eSpell.ready && PF2eSpell.ready()) ? PF2eSpell.getSpellLegacy(key) : null;
}
function getFeat(key)  {
  // 재주 카탈로그 = FVTT 단일 소스(PF2eFeat). 효과는 effects_db, 선행조건은 prereqs_db.
  return (typeof PF2eFeat !== 'undefined' && PF2eFeat.ready && PF2eFeat.ready()) ? PF2eFeat.getFeatLegacy(key) : null;
}
// 신격 주문(Cleric Spells): 섬기는 신격의 주문을 클레릭 주문 목록에 편입(전통 무관). {rank:slug} → slug Set.
//   신성 시전(divine 전통) 클래스 + 신격 선택 시에만. DataManager 신격 데이터(spells_slug)에서 파생.
function deitySpellSlugSet() {
  const out = new Set();
  if (!state.deity) return out;
  const cls = state.selectedClass;
  if (!cls || cls.tradition !== 'divine' || !cls.deity_skill) return out;  // 신성 준비시전 클래스만(클레릭 계열)
  const d = (typeof _getDeity === 'function') ? _getDeity(state.deity) : null;
  const sp = d && d.spells_slug;
  if (sp) for (const k in sp) { if (sp[k]) out.add(sp[k]); }
  return out;
}
// 재주 특성 판정 = 원본 slug(traitSlugs) 우선, 구 저장/한글 traits는 폴백.
// 번역 드리프트 무음 사망 방지(dedication↔헌신, multiclass↔멀티클래스 등).
function featHasTrait(f, slug, koFallback) {
  if (f && Array.isArray(f.traitSlugs)) return f.traitSlugs.includes(slug);
  return !!(f && Array.isArray(f.traits) && koFallback && f.traits.includes(koFallback));
}
// ── slug 디커플링 헬퍼 (번역명 결합 제거) ──────────────────────────────
// 저장·매칭은 slug(id)로 정규화, 표시는 항상 현재 name_ko로 재해소.
// 인자는 이름(구 저장)·slug(신 저장)·객체({id,name}) 모두 허용 → 하위호환.
// 미해소 시 원문 유지(graceful): 정본 DB에 없는 커스텀/희귀 항목 보존.
function _refKey(x) { return (x != null && typeof x === 'object') ? (x.id || x.name) : x; }
function spellSlug(x) {
  if (x == null || x === '') return '';
  const sp = getSpell(_refKey(x));
  return sp ? sp.id : (typeof x === 'object' ? (x.id || x.name || '') : String(x));
}
function spellDisplay(x) {
  if (x == null || x === '') return '';
  const sp = getSpell(_refKey(x));
  if (sp) return sp.name_ko || sp.name_en || sp.name;
  return (typeof x === 'object') ? (x.name || x.id || '') : String(x);
}
function featSlug(x) {
  if (x == null || x === '') return '';
  const k = _refKey(x);
  const f = getFeat(k) || (typeof k === 'string' ? getFeat(k.split(' (')[0].trim()) : null);
  return f ? f.id : (typeof x === 'object' ? (x.id || x.name || '') : String(x));
}
// 두 참조가 같은 항목인지 (slug 우선, 미해소 시 원문 비교)
function spellSame(a, b) { return spellSlug(a) === spellSlug(b); }
function featSame(a, b) { return featSlug(a) === featSlug(b); }

// 재주풀 = FVTT 단일 소스(PF2eFeat.featList). 모달/필터용.
function _allFeats() {
  return (typeof PF2eFeat !== 'undefined' && PF2eFeat.ready && PF2eFeat.ready()) ? PF2eFeat.featList() : [];
}
// 행동 = FVTT 카탈로그(PF2eAction) + 큐레이션(그룹/게이트) 단일 소스. 큐레이션(앱 요약) 우선, 미등재면 FVTT.
function getAction(key){
  if (typeof PF2eAction === 'undefined') return null;
  return (PF2eAction.getCuration && PF2eAction.getCuration(key)) || (PF2eAction.getActionLegacy && PF2eAction.getActionLegacy(key)) || null;
}
function getHeritage(key){
  // 유산 카탈로그 = FVTT 단일 소스(PF2eAnc)
  if (typeof PF2eAnc !== 'undefined' && PF2eAnc.ready && PF2eAnc.ready()) {
    return PF2eAnc.getHeritageLegacy(key) || _findInDb(PF2eAnc.heritageList(), key, ['id','name_en','name_ko']) || null;
  }
  return null;
}
// 장비 카탈로그 = FVTT 단일 소스(PF2eEquip). key=slug/name_en/name_ko 모두 해소(구 저장 하위호환).
function _getEquip(key, type) { return (typeof PF2eEquip !== 'undefined' && PF2eEquip.getEquipLegacy) ? PF2eEquip.getEquipLegacy(key, type) : null; }
function getWeapon(key){ return _getEquip(key, 'weapon'); }
function getArmor(key) { return _getEquip(key, 'armor'); }
function getShield(key){ return _getEquip(key, 'shield'); }
function getGear(key)  { return _getEquip(key); }
function getCondition(key) {
  if (typeof CONDITIONS_DATA === 'undefined' || !key) return null;
  const idx = _getDbIndex(CONDITIONS_DATA, ['id','en','name']);
  return idx.id.get(key) || idx.en.get(key) || idx.name.get(key) || null;
}
// TRAIT_DB v526~ array 형식. id 또는 한글명으로 lookup
function getTrait(key) {
  if (typeof TRAIT_DB === 'undefined' || !key) return null;
  return _findInDb(TRAIT_DB, key, ['id','name_ko','name_en']);
}
// LANGUAGES v526~ array 형식. id/name_ko/name_en 매칭
function getLanguage(key) {
  if (typeof LANGUAGES === 'undefined' || !key) return null;
  return _findInDb(LANGUAGES, key, ['id','name_ko','name_en']);
}

// 사용자 텍스트(prereq 등)가 DB 객체의 name_ko/name_en/id 중 하나와 일치하는지
// — 어휘 차이를 흡수하기 위한 의도적 텍스트 매칭. audit는 정규식으로 안 잡음.
function nameMatches(text, item) {
  if (!text || !item) return false;
  for (const k of ['id','name_en','name_ko']) {
    if (item[k] != null && item[k] === text) return true;
  }
  return false;
}
// case-insensitive condition lookup (en 매칭)
function getConditionByEnCi(en) {
  if (typeof CONDITIONS_DATA === 'undefined' || !en) return null;
  const lc = en.toLowerCase();
  for (const c of CONDITIONS_DATA) {
    if (c.en && c.en.toLowerCase() === lc) return c;
  }
  return null;
}

// PREREQ_GROUPS v528~: group_id로 묶인 1:N 정규화 행 조회
const _PREREQ_GROUPS_INDEX = new Map();
function getPrereqRows(groupId) {
  if (!groupId || typeof PREREQ_GROUPS === 'undefined') return [];
  if (_PREREQ_GROUPS_INDEX.size === 0 && PREREQ_GROUPS.length) {
    for (const r of PREREQ_GROUPS) {
      const arr = _PREREQ_GROUPS_INDEX.get(r.group_id) || [];
      arr.push(r);
      _PREREQ_GROUPS_INDEX.set(r.group_id, arr);
    }
  }
  return _PREREQ_GROUPS_INDEX.get(groupId) || [];
}

// HERITAGE_DB v534~ Phase 4a: effect_group_id → 기존 컬럼 형태로 변환 (호환층)
//   호출처(rebuildCoreEffects/recalcResistance/cs_modal.js 등)는 기존 h.hpBonus / h.grantSkills 형태로 접근하므로,
//   EFFECT_GROUPS 행을 type별로 집계해 기존 컬럼 형태({hpBonus, vision, grantSkills, ...}) 객체로 반환.
const _HERITAGE_EFFECTS_CACHE = new Map();
function getHeritageEffects(h) {
  if (!h) return {};
  // ── FVTT-native(P4): system.rules → RE 엔진. 레벨/능력치 의존이라 입력값 캐시키 ──
  if (h._reEffects && typeof PF2eAnc !== 'undefined' && PF2eAnc.ready && PF2eAnc.ready()) {
    const lv = (typeof getLevel === 'function') ? getLevel() : 1;
    const abilities = {};
    if (typeof getMod === 'function') for (const ab of ['str','dex','con','int','wis','cha']) abilities[ab] = getMod(ab);
    const anc = state.selectedAncestry;
    const ancTraitsV = (anc && anc._doc && anc._doc.system && anc._doc.system.traits && anc._doc.system.traits.value) || [];
    const key = 're:' + (h.id || '') + ':' + lv + ':' + abilities.con + ':' + abilities.int;
    if (_HERITAGE_EFFECTS_CACHE.has(key)) return _HERITAGE_EFFECTS_CACHE.get(key);
    const herDoc = h._doc || (PF2eAnc.getHeritageLegacy(h.id || '') || {})._doc;
    const out = herDoc ? PF2eAnc.heritageEffects(herDoc, {
      level: lv, abilities, ancestrySlug: anc && anc.id, ancestryTraits: ancTraitsV, choices: state._heritageChoices || {},
    }) : {};
    _HERITAGE_EFFECTS_CACHE.set(key, out);
    return out;
  }
  const id = h.id || '';
  if (_HERITAGE_EFFECTS_CACHE.has(id)) return _HERITAGE_EFFECTS_CACHE.get(id);
  const out = {};
  if (typeof getEffectRows === 'function') {
    for (const r of getEffectRows(h.id)) { // slug 단일 소스
      switch (r.type) {
        case 'vision_upgrade': out.vision = r.target; break;
        case 'hp_bonus': out.hpBonus = (out.hpBonus || 0) + (r.value || 0); break;
        case 'rest_bonus_hp': out.restBonusHp = !!r.value; break;
        case 'extra_languages': out.extraLanguages = (out.extraLanguages || 0) + (r.value || 0); break;
        case 'extra_sense':
          out.extraSenses = (out.extraSenses ? out.extraSenses + ', ' : '') + (r.sense || '');
          break;
        case 'resistance':
          (out.resistances = out.resistances || []).push({ type: r.target, formula: r.value });
          break;
        case 'grant_weapon':
          out.grantWeapon = { name: r.target, dmg: r.damage, traits: r.traits, category: r.weapon_category };
          break;
        case 'skill_trained':
          (out.grantSkills = out.grantSkills || []).push(r.target);
          break;
        case 'grant_feat':
          (out.grantFeats = out.grantFeats || []).push(
            r.default_choice ? { id: r.target, choice: r.default_choice } : r.target
          );
          break;
        case 'grant_innate_spell':
          (out.innateSpells = out.innateSpells || []).push({
            name: r.target, tradition: r.tradition, type: r.spellType || r.spell_type, uses: r.uses
          });
          break;
        case 'versatile_ancestry': out.versatile = !!r.value; break;
        case 'extra_feat_category':
          (out.extraFeats = out.extraFeats || []).push(r.target);
          break;
      }
    }
  }
  _HERITAGE_EFFECTS_CACHE.set(id, out);
  return out;
}

// BACKGROUNDS v535~ Phase 4b: effect_group_id → 기존 컬럼 형태로 변환 (호환층)
//   호출처(rebuildCoreEffects/cs_modal.js applyBackgroundInfo/배경 모달 등)는 기존 b.fixed_skills 등 형태로 접근.
//   EFFECT_GROUPS 행을 type별로 집계해 기존 컬럼 형태로 반환.
const _BACKGROUND_EFFECTS_CACHE = new Map();
function getBackgroundEffects(b) {
  if (!b) return {};
  // 재주와 동일 경로로 통일: 효과 테이블(getEffectRows/EFFECTS_DB) 단일 소스.
  // (구 _fvtt _effects 단락 폐지 — 배경 구조필드는 생성기가 효과행으로 방출. 부여=같은 기능=같은 경로.)
  const id = b.id || '';
  if (_BACKGROUND_EFFECTS_CACHE.has(id)) return _BACKGROUND_EFFECTS_CACHE.get(id);
  const out = { boosts: [], boost_choices: [], free_boosts: 0, fixed_skills: [], choice_skill_groups: [], fixed_lores: [], choice_lore: false, feat_id: null, deity_skill: false, deity_lore: false };
  // 능력치 부스트 = 배경 store 네이티브 4컬럼(build_boosts.mjs). effects 테이블 ability_boost* 폐기.
  out.boosts = (b.boost_fixed || []).slice();               // 고정 부스트
  out.free_boosts = b.boost_free || 0;                      // 자유 부스트 개수
  out.boost_choices = (b.boost_choice && b.boost_choice.length) ? [b.boost_choice.slice()] : []; // 택1 풀
  if (typeof getEffectRows === 'function') {
    const _skillGroups = {};   // group_no → [skill_id...]
    for (const r of getEffectRows(b.id)) { // slug 단일 소스(기술·지식·재주·신격)
      switch (r.type) {
        case 'skill_trained':
          out.fixed_skills.push(r.target);
          break;
        case 'skill_choice': {
          const g = r.group_no || 1;
          (_skillGroups[g] = _skillGroups[g] || []).push(r.target);
          break;
        }
        case 'grant_lore':
          // $choice = 원하는 지식 1개(추가 지식과 동일) → 사용자가 이름 지정. 고정 지식과 구분.
          if (r.target === '$choice') out.choice_lore = true;
          else out.fixed_lores.push(r.target);
          break;
        case 'grant_feat':
          out.feat_id = r.target;
          break;
        case 'deity_skill':
          out.deity_skill = true;
          break;
        case 'deity_lore':
          out.deity_lore = true;
          break;
      }
    }
    out.choice_skill_groups = Object.keys(_skillGroups).sort((a, b) => +a - +b).map(k => _skillGroups[k]);
  }
  _BACKGROUND_EFFECTS_CACHE.set(id, out);
  return out;
}

// EFFECT_GROUPS / CHOICE_OPTIONS v532~ Phase 3a: 1:N 정규화 행 조회
const _EFFECT_GROUPS_INDEX = new Map();
// L3 효과 override (data/override/effect_groups.json = {group_id:[rows...]}). 그룹 단위 교체(있으면 base 대체).
// 재주/유산/배경 자동화 전부 getEffectRows 경유 → 이 훅 하나로 3소스 override 반영.
let _EFFECT_OVERRIDE = null;
function _loadEffectOverride() {
  if (_EFFECT_OVERRIDE || typeof fetch !== 'function') return;
  fetch('data/override/effect_groups.json?v=0.297').then(r => r.ok ? r.json() : null).then(m => {
    if (!m || typeof m !== 'object') return;
    _EFFECT_OVERRIDE = m;
    _clearRuneCatalog();   // 룬 효과 override 반영 위해 카탈로그 캐시 무효화
    try { if (typeof recalcAll === 'function') recalcAll(); } catch (e) {}
  }).catch(() => {});
}
// ── 효과 조건엔진(v0.163): 정적조건(cond=raw predicate) 행을 캐릭터 상태로 평가. 못 푸는 원자=미해소→행 skip(안전, 무회귀). ──
//   편입 대상=부여(grant)+기술훈련 정적조건행(build_effects ACT_COND_TYPES). 상황조건은 애초 런타임 미편입.
//   삼치 논리(true/false/null=미해소): AND 하나라도 false→false, 미해소 포함→null. OR 하나라도 true→true. 최상위 true만 적용.
function _effectCondCtx() {   // recalc마다 값싸게 재구성(캐시 없음 — feats Set 수십개는 무시할 비용).
  const level = (typeof getLevel === 'function') ? getLevel() : 1;
  const cls = (typeof state !== 'undefined' && state.selectedClass && state.selectedClass.id) || '';
  const feats = new Set();
  try { Object.values(state.feats || {}).forEach(arr => (arr || []).forEach(f => { if (f) { const s = (typeof featSlug === 'function') ? featSlug(f) : (f.id || f.name); if (s) feats.add(String(s)); } })); } catch (e) {}
  const features = new Set();
  const sub = (typeof state !== 'undefined') && state.selectedSubclass;
  if (sub && sub.id) {
    features.add(String(sub.id)); if (sub.subclass_type) features.add(String(sub.subclass_type));
    // 레인저 특기(hunter's edge) 서브클래스 id는 edge-flurry/edge-outwit/edge-precision인데, 효과 조건(masterful-hunter 등)은
    //   FVTT 특기 슬러그 feature:flurry/outwit/precision를 씀 → 접두 제거 별칭도 등록해 슬러그 드리프트로 부여가 무음 드롭되던 것 해소.
    const _stripped = String(sub.id).replace(/^edge-/, '');
    if (_stripped !== String(sub.id)) features.add(_stripped);
  }
  try { if (typeof PF2eClass !== 'undefined' && PF2eClass.classFeatureRoster && cls) (PF2eClass.classFeatureRoster(cls) || []).forEach(f => { const s = f && (f.slug || f.id); if (s) features.add(String(s)); }); } catch (e) {}
  const heritage = (typeof state !== 'undefined' && state.selectedHeritage && state.selectedHeritage.id) || '';
  const ancestry = (typeof state !== 'undefined' && state.selectedAncestry && state.selectedAncestry.id) || '';
  const traits = new Set();
  try { ((state.selectedAncestry && state.selectedAncestry.traits) || []).forEach(t => traits.add(String(t))); } catch (e) {}
  return { level, cls, feats, features, heritage, ancestry, traits };
}
function _evalCondAtom(atom, ctx) {   // → true|false|null(미해소)
  if (typeof atom !== 'string' || /[{}]/.test(atom)) return null;
  let m;
  if ((m = /^class:(.+)$/.exec(atom))) return ctx.cls === m[1];
  if ((m = /^self:heritage:(.+)$/.exec(atom))) return ctx.heritage === m[1];
  if ((m = /^self:ancestry:(.+)$/.exec(atom))) return ctx.ancestry === m[1];
  if ((m = /^self:trait:(.+)$/.exec(atom))) return ctx.traits.has(m[1]);
  if ((m = /^feat:(.+)$/.exec(atom))) { const s = m[1]; return ctx.feats.has(s) || ctx.feats.has(s.split(':')[0]); }
  if ((m = /^feature:(.+)$/.exec(atom))) { const s = m[1]; return ctx.features.has(s) || ctx.feats.has(s); }
  return null;   // armor:*/self:size/senses 등 미모델 → 미해소
}
function _condOperand(v, ctx) {
  if (v === 'self:level') return ctx.level;
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && /^-?\d+$/.test(v)) return parseInt(v);
  return undefined;
}
function _evalCondNode(node, ctx) {   // → true|false|null
  if (node == null) return true;
  if (Array.isArray(node)) { let unk = false; for (const x of node) { const r = _evalCondNode(x, ctx); if (r === false) return false; if (r === null) unk = true; } return unk ? null : true; }
  if (typeof node === 'object') {
    for (const op of Object.keys(node)) {
      const o = node[op];
      if (op === 'gte' || op === 'gt' || op === 'lte' || op === 'lt' || op === 'eq') {
        const a = Array.isArray(o) ? o : [o], L = _condOperand(a[0], ctx), R = _condOperand(a[1], ctx);
        if (L === undefined || R === undefined) return null;
        return op === 'gte' ? L >= R : op === 'gt' ? L > R : op === 'lte' ? L <= R : op === 'lt' ? L < R : L === R;
      }
      if (op === 'and' || op === 'nand') { const r = _evalCondNode(o, ctx); return op === 'nand' ? (r === null ? null : !r) : r; }
      if (op === 'or' || op === 'nor') { const a = Array.isArray(o) ? o : [o]; let t = false, unk = false; for (const x of a) { const r = _evalCondNode(x, ctx); if (r === true) t = true; else if (r === null) unk = true; } const v = t ? true : (unk ? null : false); return op === 'nor' ? (v === null ? null : !v) : v; }
      if (op === 'not') { const r = _evalCondNode(o, ctx); return r === null ? null : !r; }
      return null;   // if/xor/미인식 = 미해소
    }
    return true;
  }
  return _evalCondAtom(node, ctx);
}
function _evalEffectCondition(cond, ctx) { return _evalCondNode(cond, ctx || _effectCondCtx()) === true; }

// FVTT 숙련 경로 → 우리 시트 DOM 숙련 id 접미사(표준 카테고리만). 개별무기(weapon-base-*)·시전별칭(aliases)·미매핑=null.
//   숙련 진행은 섀시(class_progression)가 전담이지만, 재주·아키타입·유산이 표준 카테고리를 성장표보다 높게 주면
//   applyFeatEffects의 proficiency 처리가 상향덮기(prevRank<rank)로 반영. 매핑 불가 대상은 여기서 null → 미적용.
function _profTargetToDom(p) {
  if (typeof p !== 'string') return null;
  let m;
  if ((m = /attacks\.(simple|martial|advanced|unarmed)\.rank$/.exec(p))) return 'weapon-' + m[1];
  if ((m = /defenses\.(unarmored|light|medium|heavy)\.rank$/.exec(p))) return 'armor-' + m[1];
  if (/saves\.fortitude\.rank$/.test(p)) return 'fort';
  if (/saves\.reflex\.rank$/.test(p)) return 'ref';
  if (/saves\.will\.rank$/.test(p)) return 'will';
  if (/(^|\.)perception\.rank$/.test(p)) return 'perc';
  return null;
}

// v0.28~ 효과 단일화: slug 기준 EFFECTS_DB(effects_db.js) 단일 소스. override(effect_groups.json)도 slug 키.
// (구 EFFECT_GROUPS/group_id 경로 폐기. 재주·유산·배경·서브클래스 모두 이 함수로 slug→효과행.)
// v0.163~ 조건행(r.cond) 게이트: 정적조건 미충족·미해소 행은 여기서 제거 → 전 소비처 일괄 반영(단일 경로).
function getEffectRows(slug) {
  if (!slug) return [];
  let rows;
  if (_EFFECT_OVERRIDE && Object.prototype.hasOwnProperty.call(_EFFECT_OVERRIDE, slug)) rows = _EFFECT_OVERRIDE[slug] || [];
  else rows = (typeof EFFECTS_DB !== 'undefined' && EFFECTS_DB[slug] && EFFECTS_DB[slug].rows) || [];
  if (!rows.length) return rows;
  let ctx = null;
  return rows.filter(r => { if (!r.cond) return true; if (!ctx) ctx = _effectCondCtx(); return _evalEffectCondition(r.cond, ctx); });
}

// 룬 카탈로그 = 아이템 테이블(store) ⊕ 효과 자동화 테이블(getEffectRows의 type:'rune' 행). RUNE_DB 폐기 대체.
// 룬 = "효과 테이블에 rune 효과행이 있는 장비 아이템". 별도 DB 없이 slug로 매칭.
let _runeCatalogCache = null;
// 룬 표시명에 "룬"/"Rune" 부여 — FVTT 원본 컴펜디움명은 대부분 "룬" 없이("전진","Shadow (Major)")
// 명명돼 식별·검색이 안 됨. 등급 괄호 앞에 삽입해 "전진 룬 (중급)"처럼 자연스럽게. 이미 있으면 그대로.
function _runeNameKo(nk) {
  if (!nk || nk.indexOf('룬') !== -1) return nk || '';
  const m = nk.match(/^(.*?)(\s*\([^)]*\))\s*$/);
  return m ? (m[1] + ' 룬' + m[2]) : (nk + ' 룬');
}
function _runeNameEn(ne) {
  if (!ne || /rune/i.test(ne)) return ne || '';
  const m = ne.match(/^(.*?)(\s*\([^)]*\))\s*$/);
  return m ? (m[1] + ' Rune' + m[2]) : (ne + ' Rune');
}
function getRuneCatalog() {
  if (_runeCatalogCache) return _runeCatalogCache;
  // 준비 판정: PF2eEquip엔 ready()가 없음(legacy 제거 시 삭제됨) — 장비 데이터 로드 여부는
  // legacyList 결과로 판단. 미로드면 [] 반환하되 캐시하지 않음(다음 호출 재시도).
  if (typeof PF2eEquip === 'undefined' || typeof PF2eEquip.legacyList !== 'function') return [];
  const src = PF2eEquip.legacyList({});
  if (!src.length) return [];
  const dtKo = (t) => (PF2eEquip.damageTypeKo ? PF2eEquip.damageTypeKo(t) : t);
  const out = [];
  for (const it of src) {
    const slug = it.id || it.slug; if (!slug) continue;
    const rune = getEffectRows(slug).find(r => r && r.type === 'rune');
    if (!rune) continue;
    const base = {
      category: 'rune', attachTo: rune.attach, runeType: rune.runeType, runeValue: rune.value,
      runeDamage: rune.damage || null, runePersistent: rune.persistent || null,
      runeResist: rune.resistance || null, runeNote: rune.note || '',
    };
    // 에너지 선택형 저항 룬 = 효과행 energyChoice 데이터 필드로 속성별 개별 슬러그 파생
    // (예: energy-resistant → energy-resistant-fire/cold/acid/electricity). 하드코딩 아님.
    if (Array.isArray(rune.energyChoice) && rune.energyChoice.length && rune.resistance) {
      for (const elem of rune.energyChoice) {
        out.push(Object.assign({}, it, base, {
          id: slug + '-' + elem,
          name_ko: _runeNameKo(dtKo(elem) + ' ' + (it.name_ko || it.name || '')),
          name_en: _runeNameEn(elem.charAt(0).toUpperCase() + elem.slice(1) + ' ' + (it.name_en || '')),
          runeResist: { type: elem, value: rune.resistance.value },
        }));
      }
    } else {
      out.push(Object.assign({}, it, base, {
        name_ko: _runeNameKo(it.name_ko || it.name || ''),
        name_en: _runeNameEn(it.name_en || it.name || ''),
      }));
    }
  }
  _runeCatalogCache = out;
  return out;
}
function _clearRuneCatalog() { _runeCatalogCache = null; }

const _CHOICE_OPTIONS_INDEX = new Map();
function getChoiceOptions(choiceId) {
  if (!choiceId || typeof CHOICE_OPTIONS === 'undefined') return [];
  if (_CHOICE_OPTIONS_INDEX.size === 0 && CHOICE_OPTIONS.length) {
    for (const r of CHOICE_OPTIONS) {
      const arr = _CHOICE_OPTIONS_INDEX.get(r.choice_id) || [];
      arr.push(r);
      _CHOICE_OPTIONS_INDEX.set(r.choice_id, arr);
    }
  }
  return _CHOICE_OPTIONS_INDEX.get(choiceId) || [];
}

// EFFECT_GROUPS row → 기존 effect 객체 형태로 변환
//  - target 통합 컬럼을 type별 원래 컬럼명으로 풀기
//    skill_trained.target → skill / grant_focus_spell.target → spell / save_bonus.target → save 등
//  - weapon_familiarity/weapon_trained는 행 펼침되어 있으므로 weapons:[target] 단일 원소 배열로
//    (한 그룹의 N개 행이 _applyOneEffect를 N번 호출 — 결과적으로 N무기 모두 적용)
//  - proficiency 등은 target 컬럼명 그대로 사용
const _EFFECT_TARGET_TO_COL = {
  skill_trained: 'skill',
  grant_feat_if_trained: 'skill',  // skill 우선 매핑 (TARGET_COLS 순서 기준), feat은 별도 컬럼 보존
  grant_focus_spell: 'spell',
  grant_innate_spell: 'spell',
  grant_feat: 'feat',
  grant_adopted_feat: 'feat',
  grant_action: 'action',
  grant_weapon: 'weapon_name',
  grant_lore: 'name',
  vision_upgrade: 'vision',
  extra_sense: 'sense',
  save_bonus: 'save',
  resistance: 'damage_type',
};
function _rowToEffect(r) {
  const e = { type: r.type };
  for (const k of Object.keys(r)) {
    if (k === 'group_id' || k === 'type') continue;
    if (k === 'target') {
      const t = r.type;
      if (t === 'weapon_familiarity' || t === 'weapon_trained') {
        e.weapons = [r.target];
      } else {
        const col = _EFFECT_TARGET_TO_COL[t] || 'target';
        e[col] = r[k];
      }
    } else {
      e[k] = r[k];
    }
  }
  return e;
}

// ═══════════════════════════════════════════════
//  지식(Lore) 슬롯 — 출처(source) 기반 배정 (v0.112~)
// ═══════════════════════════════════════════════
// ★ 원칙: 부여된 지식은 "어느 효과(출처)로부터 왔는지"를 기억하고, 슬롯 점유는 이름이 아니라 출처로 판단.
//   출처(재주/배경)가 빌더에서 제거되면 다음 recalc에서 수집되지 않아 해당 지식이 함께 사라지고, 뒷순번이 당겨진다.
//   이름은 출처의 choice(=슬롯 내용)일 뿐 — 빈 이름이어도 슬롯을 점유한다(이름 미입력 ≠ 미점유).
// 흐름: recalc 중 각 부여 효과가 collectLoreSource로 state._loreSources에 push
//   → recalcAll이 rebuildCoreEffects+applyFeatEffects 뒤 assignLoreSlots() 1회 호출 → lore1/lore2/오버플로 배정.
const LORE_SLOTS = ['lore1', 'lore2'];

// prof_by_level([[레벨하한,숙련],...])로 현재 레벨 숙련 계산(없으면 훈련 2). 빈 이름이어도 스케일 적용됨.
function _loreRank(profByLevel) {
  if (!Array.isArray(profByLevel)) return 2;
  const level = (typeof getLevel === 'function') ? getLevel() : 1;
  let rank = 0;
  for (const p of profByLevel) if (Array.isArray(p) && level >= p[0]) rank = Math.max(rank, p[1]);
  return rank || 2;
}

// 지식 출처 1건 수집. src = {key, name, rank, kind:'feat'|'background', ref(편집대상), fixed(이름고정)}.
function collectLoreSource(src) {
  if (!src || !src.key) return;
  (state._loreSources = state._loreSources || []).push({
    key: src.key,
    name: (src.name || '').trim(),
    rank: src.rank || 2,
    kind: src.kind || 'feat',
    ref: src.ref || null,
    fixed: !!src.fixed,
  });
}

function _writeLoreSlot(sid, name, rank, readOnly) {
  const nameEl = document.getElementById('lore-name-' + sid);
  const profEl = document.getElementById('sk-prof-' + sid);
  if (nameEl) { nameEl.value = name || ''; nameEl.readOnly = !!readOnly; }
  if (profEl) profEl.value = String(rank || 0);
}
function _loreSlotName(sid) {
  const nameEl = document.getElementById('lore-name-' + sid);
  return nameEl ? nameEl.value : '';
}

// 지식(Lore) 동적 렌더 — 고정 슬롯(lore1/lore2) 폐지. 부여 지식(출처) + 커스텀 지식을 목록으로 표시.
//   recalcAll 말미 1회 호출. 부여=state._loreSources(배경·재주, 읽기전용) / 커스텀=state.customLores(모달 편집).
//   총합 = INT + 숙련 랭크(부여는 prof_by_level 스케일, 커스텀은 훈련2). 슬롯 초과 개념 없음(경고 제거).
function renderLores() {
  state._loreOverflow = [];   // 동적 목록 = 초과 없음 (loreSlotFullForFeat/Background 항상 false)
  const host = document.getElementById('lore-list');
  if (!host) return;
  const level = (typeof getLevel === 'function') ? getLevel() : 1;
  const intMod = getMod('int');
  const pen = (typeof getCondPenalty === 'function') ? getCondPenalty() : { all: 0, stupefied: 0 };
  const penalty = (pen.all || 0) + (pen.stupefied || 0);
  const granted = (state._loreSources || []).map(s => ({ name: s.name, rank: s.rank || 2, kind: 'granted' }));
  const custom = (state.customLores || []).map(l => ({ name: l.name, rank: l.rank || 2, kind: 'custom' }));
  const all = granted.concat(custom);
  if (!all.length) {
    host.innerHTML = '<div style="color:var(--text2);font-size:11px;padding:2px 0;">없음 — 「＋ 편집」으로 추가하거나 배경·재주로 획득합니다.</div>';
    return;
  }
  host.innerHTML = all.map((lo, i) => {
    const rk = ['U', 'T', 'E', 'M', 'L'][Math.round((lo.rank || 0) / 2)] || 'U';
    const nm = (lo.name || '').trim() ? String(lo.name).replace(/</g, '&lt;') : '<span style="color:var(--text2);">(이름 없음)</span>';
    const src = lo.kind === 'granted'
      ? '<span style="font-size:9px;color:var(--accent);border:1px solid var(--accent);border-radius:3px;padding:0 3px;margin-left:4px;vertical-align:middle;" title="배경·재주가 부여 — 출처에서만 편집">부여</span>'
      : '';
    return `<div class="skill-row">
      <span class="prof-rank-badge">${rk}</span>
      <span class="skill-attr">INT</span>
      <span class="skill-name">${nm}${src}</span>
      <span class="skill-total" id="lore-val-${i}">+0</span>
    </div>`;
  }).join('');
  all.forEach((lo, i) => {
    const base = intMod + rankBonus(lo.rank || 0, level);
    applyPenaltyColor(document.getElementById('lore-val-' + i), base, penalty);
  });
}

// ── 커스텀 지식 편집 모달 (Add/Remove/Finished) — 커스텀 지식만 관리(부여 지식은 목록에만 표시) ──
function openLoreModal() {
  renderLoreModalList();
  const el = document.getElementById('lore-modal'); if (el) el.classList.remove('hidden');
  const inp = document.getElementById('lore-add-name'); if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 30); }
}
function closeLoreModal() {
  const el = document.getElementById('lore-modal'); if (el) el.classList.add('hidden');
}
function addCustomLore() {
  const inp = document.getElementById('lore-add-name'); if (!inp) return;
  const name = (inp.value || '').trim(); if (!name) { inp.focus(); return; }
  (state.customLores = state.customLores || []).push({ name: name, rank: 2 });   // 훈련(2) 기본
  inp.value = '';
  if (typeof recalcAll === 'function') recalcAll();   // renderLores 반영 + save(자동)
  else if (typeof save === 'function') save();
  renderLoreModalList();
  inp.focus();
}
function removeCustomLore(idx) {
  if (!state.customLores || idx < 0 || idx >= state.customLores.length) return;
  state.customLores.splice(idx, 1);
  if (typeof recalcAll === 'function') recalcAll();
  else if (typeof save === 'function') save();
  renderLoreModalList();
}
function renderLoreModalList() {
  const host = document.getElementById('lore-modal-list');
  const empty = document.getElementById('lore-modal-empty');
  const list = state.customLores || [];
  if (empty) empty.style.display = list.length ? 'none' : '';
  if (!host) return;
  host.innerHTML = list.map((l, i) => `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">
    <button class="btn" onclick="removeCustomLore(${i})" style="font-size:11px;padding:2px 10px;">삭제 Remove</button>
    <span style="flex:1;">${String(l.name || '').replace(/</g, '&lt;')} <span style="color:var(--text2);font-size:11px;">훈련 Trained</span></span>
  </div>`).join('');
}

// 지식 슬롯 이름 편집 = 소유 출처의 choice에 기록(단일 진실원). 슬롯 점유는 이름 무관 → recalc 불필요.
function onLoreSlotNameInput(sid) {
  const val = _loreSlotName(sid);
  const src = state._loreSlotRef && state._loreSlotRef[sid];
  if (src && !src.fixed) {
    if (src.kind === 'feat' && src.ref) src.ref.choice = val;
    else if (src.kind === 'background' && src.ref === 'bg-choice') {
      if (!state.initialChoices) state.initialChoices = {};
      if (!state.initialChoices.background) state.initialChoices.background = {};
      state.initialChoices.background.choiceLore = val;
    }
  }
  save();
}

// 지식 슬롯 초과 경고 조회 — state._loreOverflow: [{kind:'feat'|'background', ref, ...}]
function loreSlotFullForFeat(feat) {
  return !!(feat && state._loreOverflow && state._loreOverflow.some(o => o.kind === 'feat' && o.ref === feat));
}
function loreSlotFullForBackground() {
  return !!(state._loreOverflow && state._loreOverflow.some(o => o.kind === 'background'));
}

// ═══════════════════════════════════════════════
//  DESC DYNAMIC REFERENCES  {{type:key}}
// ═══════════════════════════════════════════════

const _DESC_REF_RE = /\{\{(spell|feat|condition|trait|action):([^}]+)\}\}/g;

function _lookupDescRef(type, key) {
  switch (type) {
    case 'spell': {
      const sp = getSpell(key);
      return sp ? {ko: sp.name_ko, en: sp.name_en, summary: sp.summary||'', desc: sp.desc||''} : null;
    }
    case 'feat': {
      const f = getFeat(key);
      return f ? {ko: f.name_ko, en: f.name_en, summary: f.summary||'', desc: f.desc||''} : null;
    }
    case 'condition': {
      const c = getConditionByEnCi(key);
      return c ? {ko: c.name, en: c.en, summary: c.desc||'', desc: c.desc||''} : null;
    }
    case 'trait': {
      const t = getTrait(key);
      if (!t) return null;
      const text = t.desc || '';
      return {ko: t.name_ko || key, en: t.name_en || key, summary: text, desc: text};
    }
    case 'action': {
      const a = getAction(key);
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
    let body = data.desc || data.summary || '';
    // 안전한 태그만 유지 (strong, em, br), 나머지 제거
    let safe = body.replace(/<(?!\/?(?:strong|em|br)\b)[^>]*>/gi, '');
    // 중첩 {{}} 템플릿은 팝업 안에서 재귀 해석하지 않음
    safe = safe.replace(/\{\{[^}]+\}\}/g, (m) => { const d = m.match(/\{\{\w+:([^}]+)\}\}/); return d ? d[1] : m; });
    // 텍스트 길이 300자 제한 (태그 제외)
    const plainLen = safe.replace(/<[^>]*>/g,'').length;
    if (plainLen > 300) {
      let count = 0, cut = safe.length;
      for (let i = 0; i < safe.length && count < 300; i++) {
        if (safe[i] === '<') { while (i < safe.length && safe[i] !== '>') i++; continue; }
        count++;
        if (count >= 300) cut = i + 1;
      }
      safe = safe.substring(0, cut) + '…';
    }
    popup.innerHTML = `<div style="margin-bottom:6px;">${typeBadge}<strong>${titleKo}</strong>${titleEn}</div><div style="color:var(--text2,#bbb);font-size:11px;line-height:1.5;">${safe}</div>`;
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

// ═══════════════════════════════════════════════
//  SPELL ↔ FEAT INTERACTION NOTES
// ═══════════════════════════════════════════════

// feat/spell을 slug(fs/ss)로 식별 — 이름 편집·번역 드리프트에 불변(구: 한글명 키 → 드리프트로 조용히 미매칭).
const SPELL_FEAT_MODS = [
  // 주사위 변경
  { fs:'healing-hands', ss:'heal', note:'🔷 <b>치유의 손</b> — d8 대신 <b>d10</b>을 굴립니다.' },
  { fs:'harming-hands', ss:'harm', note:'🔷 <b>해로운 손</b> — d8 대신 <b>d10</b>을 굴립니다.' },
  { fs:'magic-hands', ss:'heal', note:'🔷 <b>마법 손</b> — 상처 치료 성공 시 d8→d10, 치유에 레벨만큼 상태 보너스.' },
  // 시전 방식 변경
  { fs:'selective-energy', ss:'heal', note:'🔷 <b>선택적 에너지</b> — 3행동(영역) 시전 시 최대 5명을 제외할 수 있습니다.' },
  { fs:'selective-energy', ss:'harm', note:'🔷 <b>선택적 에너지</b> — 3행동(영역) 시전 시 최대 5명을 제외할 수 있습니다.' },
  { fs:'fast-channel', ss:'heal', note:'🔷 <b>빠른 채널</b> — 2행동으로 시전해도 3행동 버전의 영역 효과를 얻습니다.' },
  { fs:'fast-channel', ss:'harm', note:'🔷 <b>빠른 채널</b> — 2행동으로 시전해도 3행동 버전의 영역 효과를 얻습니다.' },
  { fs:'ebb-and-flow', ss:'heal', note:'🔷 <b>밀물과 썰물</b> — 1~2행동 시전 시 적 1명에 피해 + 아군 1명에 회복을 동시에.' },
  { fs:'ebb-and-flow', ss:'harm', note:'🔷 <b>밀물과 썰물</b> — 1~2행동 시전 시 적 1명에 피해 + 아군 1명에 회복을 동시에.' },
  // 추가 효과
  { fs:'divine-infusion', ss:'heal', note:'🔷 <b>신성 주입</b> — 대상의 다음 근접 공격에 추가 1d6 활력 피해 (5랭크 2d6, 8랭크 3d6).' },
  { fs:'divine-infusion', ss:'harm', note:'🔷 <b>신성 주입</b> — 대상의 다음 근접 공격에 추가 1d6 공허 피해 (5랭크 2d6, 8랭크 3d6).' },
  { fs:'martyr', ss:'heal', note:'🔷 <b>순교자</b> — 자신이 랭크당 1d8 HP를 잃고, 아군이 같은 양만큼 추가 회복.' },
  { fs:'martyr', ss:'harm', note:'🔷 <b>순교자</b> — 자신이 랭크당 1d8 HP를 잃고, 아군이 같은 양만큼 추가 회복.' },
  { fs:'defensive-recovery', ss:'heal', note:'🔷 <b>방어적 회복</b> — 단일 대상 HP 회복 시, 1라운드간 AC와 내성에 +2 상태 보너스.' },
  { fs:'defensive-recovery', ss:'harm', note:'🔷 <b>방어적 회복</b> — 단일 대상 HP 회복 시, 1라운드간 AC와 내성에 +2 상태 보너스.' },
  { fs:'channeling-block', ss:'heal', note:'🔷 <b>채널 차단</b> — 방패 막기 시 소비하여 경도 +랭크당 1d8.' },
  { fs:'channeling-block', ss:'harm', note:'🔷 <b>채널 차단</b> — 방패 막기 시 소비하여 경도 +랭크당 1d8.' },
  // 축복 관련
  { fs:'eternal-blessing', ss:'bless', note:'🔷 <b>영원한 축복</b> — 영구적으로 15피트 반경 축복 효과. 해산 가능, 1분 후 자동 복귀.' },
];

function getSpellFeatNotes(spellRef) {
  if (!state.feats) return '';
  const spSlug = spellSlug(spellRef);  // 이름/객체/slug 모두 허용
  if (!spSlug) return '';
  const owned = new Set(Object.values(state.feats).flat().filter(Boolean).map(f => featSlug(f)));
  const notes = SPELL_FEAT_MODS
    .filter(m => m.ss === spSlug && owned.has(m.fs))
    .map(m => m.note);
  if (!notes.length) return '';
  return '<div style="margin-top:10px;padding:8px 10px;background:rgba(100,160,255,0.08);border-left:3px solid var(--accent);border-radius:4px;font-size:12px;line-height:1.6;">' + notes.join('<br>') + '</div>';
}

// ═══════════════════════════════════════════════
//  INFO POPUP (feat / spell)
// ═══════════════════════════════════════════════

// 정보 아이템 해석 (showInfo 모달 + 인라인 아코디언 공용)
function _infoResolveItem(type, name) {
  let item = null;
  const nameKo = (name || '').split(' (')[0].trim();

  if (type === 'spell') {
    item = getSpell(nameKo);
  } else if (type === 'feat') {
    item = getFeat(nameKo);
    // 폴백: nameKo가 "한글명 (English)" 형식일 때 prefix 매칭
    if (!item && typeof _allFeats === 'function') {
      for (const f of _allFeats()) {
        if (f && f.name_ko && nameKo.startsWith(f.name_ko)) { item = f; break; }
      }
    }
  } else if (type === 'heritage') {
    item = getHeritage(nameKo);
  } else if (type === 'weapon') {
    item = getWeapon(nameKo);
  } else if (type === 'armor') {
    item = getArmor(nameKo);
  } else if (type === 'shield') {
    item = getShield(nameKo);
  } else if (type === 'gear' || type === 'rune') {
    item = getGear(nameKo);
    if (!item && typeof getRuneCatalog === 'function') item = getRuneCatalog().find(r => r && (r.name_ko === nameKo || r.name_en === nameKo || r.id === nameKo));
  }

  // 장비 인스턴스 매칭: 전체 이름 우선(등급 괄호 "(상급)" 등 보존), 실패 시 괄호 제거된 nameKo로.
  // (BASE 소비품의 ~49%는 한글명에 등급 괄호가 있어 ' (' split만으로는 매칭 실패 → "DB에 정보 없음" 버그)
  const _eqByName = (n) => state.equip?.find(e => e.name === n);
  const nameEn0 = (name.match(/\(([^)]+)\)/) || [])[1] || '';

  // ── 장비 설명 보장 (모달=획득 후 동일 정보) ──
  // 획득 모달은 BASE 항목을 직접 보여주므로 설명이 있다. 획득 후엔 _infoResolveItem이
  // 레거시 DB를 먼저 보는데, 레거시에 desc가 없으면 설명이 비어 "DB에 정보 없음"이 떴다.
  // → 인스턴스 _data(획득 시 저장한 모달 원본) → BASE 카탈로그(PF2eEquip) 순으로 항상 설명을 채운다.
  if (['gear', 'rune', 'weapon', 'armor', 'shield'].includes(type)) {
    const inst = _eqByName(name) || _eqByName(nameKo);
    const lacksDesc = !item || (!item.desc && !item.summary);
    // 1) 인스턴스 _data 우선
    if (lacksDesc && inst && inst._data) {
      const dd = inst._data;
      if (dd.desc || dd._desc || dd.summary) {
        item = { ...(item || {}), ...dd, name_ko: (item && item.name_ko) || dd.name_ko || nameKo, name_en: (item && item.name_en) || dd.name_en || nameEn0, desc: dd.desc || dd._desc || dd.summary };
      }
    } else if (lacksDesc && inst && inst._desc) {
      item = { ...(item || { name_ko: nameKo, name_en: nameEn0 }), summary: inst._desc };
    }
    // 2) 그래도 설명 없으면 BASE 카탈로그에서 이름으로 조회 (구버전 저장·_data 미보유 커버)
    if ((!item || (!item.desc && !item.summary)) && typeof PF2eEquip !== 'undefined' && typeof PF2eEquip.legacyList === 'function') {
      try {
        const cand = PF2eEquip.legacyList({ search: nameKo });
        const hit = cand.find(c => c.name_ko === name) || cand.find(c => c.name_ko === nameKo)
                 || cand.find(c => (c.name_ko || '').startsWith(nameKo)) || (cand.length === 1 ? cand[0] : null);
        if (hit && (hit.desc || hit._desc)) item = { ...(item || {}), ...hit, name_ko: (item && item.name_ko) || hit.name_ko, name_en: (item && item.name_en) || hit.name_en || nameEn0, desc: hit.desc || hit._desc };
      } catch (e) {}
    }
  }

  // 파손된 장비인지 확인하여 수치 조정
  const brokenEquip = state.equip?.find(e => (e.name === name || e.name === nameKo) && e._broken);
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
    // 커스텀/BASE 장비: state.equip에서 _data 또는 _desc 활용 (전체 이름 우선 매칭)
    const eqMatch = _eqByName(name) || _eqByName(nameKo);
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

  // 장비: DB 항목에 설명이 없으면 보유 중인 장비 인스턴스의 _desc로 보강
  // (룬 등 최소 스키마에는 설명이 없으나 FVTT 카탈로그로 추가한 항목은 _desc 보유)
  if (item && !item.desc && !item.summary && ['gear','rune','weapon','armor','shield'].includes(type)) {
    const eqInst = _eqByName(name) || _eqByName(nameKo);
    const d = eqInst && (eqInst._desc || eqInst._data?._desc || eqInst._data?.desc || eqInst._data?.description);
    if (d) item = {...item, summary: d};
  }
  return item;
}

// 주문 메타 필드 블록(시전/사거리/영역/대상/방어/지속/빈도/유발/요구사항/비용) 공용 빌더 — 정본 단일 소스.
//   (구: infoCardHtml·showItemDetail·_learnSpellDetailHtml 3곳에 동일 로직 복붙, cs_calc는 6필드 subset이라 drift.)
function _spellMetaHtml(item) {
  let m = '';
  if (item.castTime) m += `<div><strong>시전:</strong> ${item.castTime}</div>`;
  if (item.range) m += `<div><strong>사거리:</strong> ${item.range}${item.area ? ` | <strong>영역:</strong> ${item.area}` : ''}</div>`;
  if (item.target) m += `<div><strong>대상:</strong> ${item.target}</div>`;
  if (item.defense) m += `<div><strong>방어:</strong> ${item.defense}</div>`;
  if (item.duration) m += `<div><strong>지속 시간:</strong> ${item.duration}</div>`;
  if (item.frequency) m += `<div><strong>빈도:</strong> ${item.frequency}</div>`;
  if (item.trigger) m += `<div><strong>유발 조건:</strong> ${item.trigger}</div>`;
  if (item.requirements) m += `<div><strong>요구사항:</strong> ${item.requirements}</div>`;
  if (item.cost) m += `<div><strong>비용:</strong> ${item.cost}</div>`;
  return m ? `<div style="font-size:12px;line-height:1.6;padding:6px 0;margin-bottom:6px;border-bottom:1px solid var(--border);color:var(--text2);">${m}</div>` : '';
}
// desc 본문에서 중복된 메타 줄(<strong>사거리:</strong> …)을 제거 — 위 메타 블록과 이중표시 방지. 공용 정본.
function _stripSpellMetaFromDesc(desc) {
  return String(desc || '').replace(/<strong>(?:사거리|영역|대상|방어|지속 ?시간|빈도|유발 조건|요구사항|비용|시전):<\/strong>[^<]*(?:<br>)?/g, '').replace(/^\s*<br>/, '');
}

// 저장 주문 참조(s) → 카탈로그 주문 해소: id → name_ko → name_en 3단 폴백. 공용 정본(구: 복붙 2벌, ?:↔&& drift).
function _resolveSpellRef(s) {
  if (!s || typeof getSpell !== 'function') return null;
  return (s.id && getSpell(s.id)) || (s.name_ko && getSpell(s.name_ko)) || (s.name_en && getSpell(s.name_en)) || null;
}

// 유산이 부여한 선천 주문 제거(_heritage 마커). 유산 clear 경로 공용 정본.
function _cleanHeritageInnateSpells() {
  if (state.spells && state.spells.innate) state.spells.innate = state.spells.innate.filter(s => !s._heritage);
}

// 특정 출처(재주 등)가 부여한 선천/집중 주문을 제거 — _sourceFeat slug 기준. 여러 재주 정리 경로 공용 정본.
function removeSpellsBySource(source) {
  if (!state.spells || typeof featSlug !== 'function') return;
  const sl = featSlug(source);
  if (state.spells.innate) state.spells.innate = state.spells.innate.filter(s => featSlug(s._sourceFeat) !== sl);
  if (state.spells.focus) state.spells.focus = state.spells.focus.filter(s => featSlug(s._sourceFeat) !== sl);
}

// 정보 카드 본문 HTML (모달 모바일 + 인라인 아코디언 공용). showHeading=true면 이름 헤딩 포함.
function infoCardHtml(item, type, showHeading) {
  if (!item) return '<span style="color:var(--text2);font-size:12px;">상세 정보가 없습니다.</span>';
  const _tt = (t) => (typeof traitTag === 'function') ? traitTag(t) : `<span class="tag">${t}</span>`;
  const nameKoD = item.name || item.name_ko || '';
  const nameEnD = item.en || item.name_en || '';
  let desc = item.desc || item.summary || '';
  let tags = '';
  let metaBlock = '';

  if (item.feat_level !== undefined) {
    tags = `<span class="tag-meta">${item.feat_level}레벨</span> <span class="tag-meta">${item.category||''}</span>`;
  } else if (item.rank !== undefined) {
    // 주문
    tags = `<span class="tag-meta">${item.is_cantrip?'캔트립':'랭크 '+item.rank}</span> <span class="spell-actions">${item.actions||''}</span>`;
    const spTraits = [...(item.traditions||[]),...(item.traits||[])].map(_tt).join('');
    if (spTraits) metaBlock += `<div style="margin-bottom:6px;">${spTraits}</div>`;
    metaBlock += _spellMetaHtml(item);   // 공용 주문 메타 블록(9필드 정본 — 구 6필드 subset 통일)
    desc = _stripSpellMetaFromDesc(desc);
  } else {
    // 장비(무기/방어구/방패/장비/룬): 특성 + 수치 메타
    const tr = item.traits || [];
    if (tr.length) metaBlock += `<div style="margin-bottom:6px;">${tr.map(_tt).join('')}</div>`;
    let ml = '';
    const addm = (l, v) => { if (v !== undefined && v !== null && v !== '' && v !== '—') ml += `<div><strong>${l}:</strong> ${v}</div>`; };
    if (item.damage !== undefined || item.group !== undefined) {            // 무기
      addm('피해', item.damage); addm('무기군', item.group); addm('분류', item.category);
      addm('손', item.hands); addm('사거리', item.range ? item.range + ' ft.' : ''); addm('재장전', item.reload);
    } else if (item.dex_cap !== undefined || item.check_penalty !== undefined) {  // 방어구
      addm('AC 보너스', item.ac_bonus !== undefined ? '+' + item.ac_bonus : ''); addm('민첩 상한', item.dex_cap !== undefined ? '+' + item.dex_cap : '');
      addm('판정 페널티', item.check_penalty); addm('이동 페널티', item.speed_penalty); addm('근력', item.strength); addm('분류', item.category);
    } else if (item.hardness !== undefined || item.bt !== undefined) {       // 방패
      addm('AC 보너스', item.ac_bonus !== undefined ? '+' + item.ac_bonus : ''); addm('견고도', item.hardness); addm('HP', item.hp); addm('파손 한계', item.bt);
    }
    addm('가격', item.price); addm('부피', item.bulk);
    if (ml) metaBlock += `<div style="font-size:12px;line-height:1.6;padding:6px 0;margin-bottom:6px;border-bottom:1px solid var(--border);color:var(--text2);">${ml}</div>`;
  }

  const spellNotes = (item.rank !== undefined) ? getSpellFeatNotes(nameKoD) : '';
  const body = (typeof formatDescActions === 'function') ? formatDescActions(desc, item) : desc;
  let heading = '';
  if (showHeading) {
    heading = `<div style="font-size:16px;font-weight:700;margin-bottom:2px;">${nameKoD}</div><div style="font-size:12px;color:var(--text2);margin-bottom:10px;">${nameEnD}</div>`;
  } else if (nameEnD) {
    heading = `<div style="font-size:11px;color:var(--text2);margin-bottom:6px;">${nameEnD}</div>`;
  }
  return `${heading}${tags ? `<div style="margin-bottom:10px;">${tags}</div>` : ''}${metaBlock}<div style="font-size:13px;line-height:1.7;">${body}${spellNotes}</div>`;
}

function showInfo(type, name) {
  if (!name) return;
  const item = _infoResolveItem(type, name);

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
    if (listItems) listItems.innerHTML = `<div style="padding:16px;">${infoCardHtml(item, type, true)}</div>`;
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
      <span class="skill-name">${sk.name}${sk.isLore?` <input class="inline-edit" id="lore-name-${sk.id}" placeholder="주제..." oninput="onLoreSlotNameInput('${sk.id}')" style="width:60px;font-size:11px;">`:''}</span>
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
    if (c.class_only && !(state.selectedClass && state.selectedClass.id === c.class_only)) return;  // 클래스 전용 상태이상(저주에 묶인=오라클)은 해당 클래스만
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
      <span style="color:var(--red-light);font-weight:600;min-width:60px;display:inline-flex;align-items:center;">${typeof iconImg==='function'?iconImg('condition',c,'ico-sm'):'⚠ '}${c.name}${valText}</span>
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
// - 증강 1개 = +1 (수정치 < +4일 때)
// - 수정치 +4 이상에 증강 → "부분 증강" 표시 (2개 쌓이면 +1)
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
    // 같은 묶음 내 해당 속성 증강 횟수 (정상적으론 최대 1회)
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

// ─── 증강 팝업 모달 ───
// focusLv: 레벨 5/10/15/20 기어에서 넘어오면 그 레벨의 자유 증강 4개만 보여줌(Pathbuilder "Set Ability Boosts Level N").
//   미지정/1이면 초기 배분(혈통·배경·클래스·레벨1) 전체 모달.
let _boostFocusLv = null;
function openBoostModal(focusLv) {
  _boostFocusLv = (focusLv && focusLv > 1) ? focusLv : null;
  document.getElementById('modal-title').textContent = _boostFocusLv
    ? `능력치 증강 — 레벨 ${_boostFocusLv}` : '능력치 증강 배분';
  document.getElementById('modal-overlay').classList.remove('hidden');
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  modalType = 'boost';
  renderBoostModal();
}

function renderBoostModal() {
  const ATTRS = ATTRIBUTES;  // cs_data.js 전역
  const container = document.getElementById('modal-options');
  container.innerHTML = '';

  // 현재 수정치 요약 바(상단)
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

  // 포커스 모드(레벨 5/10/15/20) = 그 레벨의 자유 증강 4개만. 초기 배분(혈통·배경·클래스·레벨1)은 아래 전체 렌더.
  if (_boostFocusLv) {
    const hint = document.createElement('div');
    hint.style.cssText = 'font-size:11px;color:var(--text2);line-height:1.6;padding:8px 10px 0;';
    hint.innerHTML = `이 레벨에는 서로 <b>다른 능력치 4개</b>를 증강합니다. 수정치가 이미 <b>+4 이상</b>인 능력치는 증강 2개가 모여야 +1 오릅니다(부분 증강 <b>½</b>).`;
    container.appendChild(hint);
    container.appendChild(_boostFreeSection(_boostFocusLv, 'lv' + _boostFocusLv, ATTRS));
    return;
  }

  let html = '';

  // ── 혈통 증강 (고정=readonly, 자유=드롭다운, 결함=− 행) ──
  if (state.selectedAncestry) {
    const anc = state.selectedAncestry;
    const fixed = state.boosts.ancFixed || [];
    const flaws = state.boosts.ancFlaw || [];
    const freeCount = anc.free_boosts || 0;
    const ancChoice = (anc.boost_choices && anc.boost_choices[0]) || null;  // 드문 택1 풀(반요정 등)
    const baseExcl = [...fixed, ...flaws];
    let rows = '';
    fixed.forEach(a => { rows += _boostFixedRow(a); });
    if (ancChoice && ancChoice.length) {
      rows += _boostSelectRow('ancFree', 0, ancChoice, state.boosts.ancFree[0], baseExcl);
    } else {
      for (let i = 0; i < freeCount; i++) {
        const others = state.boosts.ancFree.filter((v, idx) => idx !== i);
        rows += _boostSelectRow('ancFree', i, ATTRS, state.boosts.ancFree[i], [...baseExcl, ...others]);
      }
    }
    flaws.forEach(a => { rows += _boostFixedRow(a, true); });
    html += _boostSec('혈통 증강 Ancestry Boosts', rows);
  } else {
    html += _boostSec('혈통 증강 Ancestry Boosts', '<div class="boost-pb-empty">혈통을 먼저 선택하세요.</div>');
  }

  // ── 배경 증강 (택1 풀 + 자유, 모두 드롭다운) ──
  {
    const bg = state.selectedBackground;
    if (!bg) {
      html += _boostSec('배경 증강 Background Boosts', '<div class="boost-pb-empty">배경을 먼저 선택하세요.</div>');
    } else {
      const beff = getBackgroundEffects(bg);
      const choiceGroup = (beff.boost_choices || [])[0];
      const freeCount = beff.free_boosts || 0;
      if (!state.boosts.bgFixed) state.boosts.bgFixed = [];
      if (!state.boosts.bgFree) state.boosts.bgFree = [];
      let rows = '';
      if (choiceGroup && choiceGroup.length) {
        rows += _boostSelectRow('bgFixed', 0, choiceGroup, state.boosts.bgFixed[0], []);
        for (let i = 0; i < freeCount; i++) {
          const others = state.boosts.bgFree.filter((v, idx) => idx !== i);
          rows += _boostSelectRow('bgFree', i, ATTRS, state.boosts.bgFree[i], [...state.boosts.bgFixed, ...others]);
        }
      } else if (freeCount > 0) {
        for (let i = 0; i < freeCount; i++) {
          const others = state.boosts.bg.filter((v, idx) => idx !== i);
          rows += _boostSelectRow('bg', i, ATTRS, state.boosts.bg[i], [...others]);
        }
      }
      state.boosts.bg = [...state.boosts.bgFixed, ...state.boosts.bgFree];
      html += _boostSec('배경 증강 Background Boosts', rows || '<div class="boost-pb-empty">이 배경은 능력치 증강이 없습니다.</div>');
    }
  }

  // ── 클래스 증강 (핵심 속성: 1개=readonly, 선택형=드롭다운) ──
  {
    const cls = state.selectedClass;
    if (!cls) {
      html += _boostSec('클래스 증강 Class Boost', '<div class="boost-pb-empty">클래스를 먼저 선택하세요.</div>');
    } else {
      const keys = getEffectiveClassKeyAttrs();   // 클래스 ∪ 서브클래스 확장(로그 수법 등)
      let rows = '';
      if (keys.length > 1) {
        rows += _boostSelectRow('__clsKey', 0, keys, state.boosts.cls, []);
      } else {
        const k = keys[0] || state.boosts.cls;
        if (k && state.boosts.cls !== k) state.boosts.cls = k;   // 단일 핵심속성 자동 확정
        rows += _boostFixedRow(k);
      }
      html += _boostSec('클래스 증강 Class Boost', rows);
    }
  }

  container.insertAdjacentHTML('beforeend', html);

  // 초기 배분 모달(레벨1 기어) = 혈통·배경·클래스 + 레벨1 자유 증강만.
  //   5·10·15·20레벨 증강은 각 레벨 기어의 포커스 창(_boostFocusLv, 위 early-return)에서 처리 — 여기 섞지 않음.
  container.appendChild(_boostFreeSection(1, 'lv1', ATTRS));
}

// ── Pathbuilder식 능력치 증강 모달 헬퍼 (v0.262~) ──
function _boostSec(title, rowsHtml) {
  return `<div class="boost-pb-sec"><div class="boost-pb-title">${title}</div>${rowsHtml}</div>`;
}
// 고정 증강/결함 행 (+ 원 아이콘 + 속성명)
function _boostFixedRow(attr, isFlaw) {
  if (!attr) return '';
  return `<div class="boost-pb-row ${isFlaw ? 'boost-pb-flaw' : ''}">
    <span class="boost-plus ${isFlaw ? 'minus' : ''}"></span>
    <span class="boost-pb-fixed">${ATTR_KO[attr]}</span></div>`;
}
// 드롭다운 행. key=state.boosts 키, idx=슬롯, opts=선택가능 속성, cur=현재값, excluded=제외(disabled)
function _boostSelectRow(key, idx, opts, cur, excluded) {
  const options = ['<option value="">— 선택 —</option>'].concat(opts.map(a => {
    const dis = excluded.includes(a) && a !== cur;
    return `<option value="${a}" ${a === cur ? 'selected' : ''} ${dis ? 'disabled' : ''}>${ATTR_KO[a]}</option>`;
  })).join('');
  return `<div class="boost-pb-row">
    <span class="boost-plus"></span>
    <select class="boost-pb-select" onchange="_onBoostSelect('${key}',${idx},this.value)">${options}</select></div>`;
}
// 자유 증강 섹션 (체크박스 그리드 + 남은 개수 카운터)
function _boostFreeSection(reqLv, key, ATTRS) {
  const sec = document.createElement('div');
  sec.className = 'boost-pb-sec';
  const arr = state.boosts[key];
  const chosen = arr.filter(a => ATTRS.includes(a)).length;
  const remain = 4 - chosen;
  const title = reqLv === 1 ? '자유 증강 Free Boosts' : `레벨 ${reqLv} 자유 증강 Free Boosts`;
  let items = '';
  ATTRS.forEach(a => {
    const on = arr.includes(a);
    const full = chosen >= 4 && !on;
    const { mod, partial } = calcMod(a);
    items += `<div class="boost-free-item ${on ? 'on' : ''} ${full ? 'disabled' : ''}" onclick="${full ? '' : `_onBoostFree('${key}','${a}')`}">
      <span class="boost-free-box"></span>
      <span class="boost-free-abbr">${ATTR_KO[a]}</span>
      <span class="boost-free-val">${fmtBonus(mod)}${partial ? '½' : ''}</span></div>`;
  });
  sec.innerHTML = `<div class="boost-free-head"><div class="boost-pb-title" style="margin:0;">${title}</div>
    <span class="boost-counter ${remain <= 0 ? 'done' : ''}">${remain}</span></div>
    <div class="boost-free-grid">${items}</div>`;
  return sec;
}
function _onBoostSelect(key, idx, val) {
  if (key === '__clsKey') { state.boosts.cls = val; recalcAll(); save(); renderBoostModal(); return; }
  const arr = state.boosts[key];
  if (val) arr[idx] = val; else arr.splice(idx, 1);
  state.boosts[key] = arr.filter((v, i) => v && arr.indexOf(v) === i);
  if (key === 'bgFixed' || key === 'bgFree') state.boosts.bg = [...(state.boosts.bgFixed || []), ...(state.boosts.bgFree || [])];
  recalcAll(); save(); renderBoostModal();
}
function _onBoostFree(key, a) {
  const arr = state.boosts[key];
  const i = arr.indexOf(a);
  if (i >= 0) arr.splice(i, 1);
  else { if (arr.filter(x => x).length >= 4) return; arr.push(a); }
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

  // 혈통 고정 증강 (혈통 선택 시 자동 설정)
  addRow('혈통 고정', null, 0, state.boosts.ancFixed, false);
  // 혈통 자유 증강 (혈통에 따라 1~2개, 혈통 고정+자유 합쳐서 중복 불가 체크)
  // ancFree는 혈통 고정과 같은 묶음이므로 이미 선택된 것 제외
  const ancUsed = [...state.boosts.ancFixed];
  // 혈통 자유: 혈통마다 다른 개수 (대부분 1개, 인간/오크는 2개)
  const ancFreeMax = state.selectedAncestry ? (state.selectedAncestry.free_boosts || 0) : 1;
  // 자유 증강 선택 시 이미 고정된 속성 제외
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
      // 고정 증강에서 이미 사용된 속성은 비활성화
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
  // 배경 증강 (2개, 서로 달라야)
  addRow('배경 (2개)', 'bg', 2, null, false);
  // 클래스 핵심 속성 (자동)
  addRow('클래스', null, 0, state.boosts.cls ? [state.boosts.cls] : [], false);
  // 레벨별 자유 증강 (4개씩, 같은 묶음 내 서로 달라야)
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
// 숙련 보너스 = 숙련이면 rank(contrib 0/2/4/6/8) + 레벨, 미숙련이면 0. 전 계산 공용 단일식.
function rankBonus(rank, lv) { return rank > 0 ? rank + lv : 0; }
function getProfBonus(selectId) {
  const v = parseInt(document.getElementById(selectId)?.value||0);
  return rankBonus(v, getLevel());
}
function fmtBonus(n) { return n >= 0 ? '+'+n : ''+n; }

// ═══════════════════════════════════════════════
//  빌더 핵심 선택 반응형 재파생 (유산/배경)
//  applyFeatEffects와 동일한 clear+rebuild 패턴
// ═══════════════════════════════════════════════
// ── 성장(빌더) 기술 훈련/향상 = 출처(source) 기반 재파생 (원칙 #3) ──
//   과거: 성장 핸들러가 sk-prof DOM을 값기준으로 revert(value==='2'→'0', 향상은 -2). 출처 미추적이라
//   배경/유산/재주가 같은 기술을 동값으로 부여한 다중출처 상황에서 성장 슬롯 제거 시 타 출처 훈련을
//   오삭제하거나 유령 잔존시킴. → 배경/유산/재주와 동일한 prevRank 스냅샷 + clear+rebuild 패턴으로 통일.
//   CLEAR는 recalcAll 최상단(rebuildCoreEffects/applyFeatEffects의 clear보다 먼저) — 성장 기여를 먼저
//   걷어내야 heritage/bg/feat가 깨끗한 base에서 prevRank를 스냅샷한다. REBUILD는 최하단(모든 트레인드
//   부여 확정 후) — 향상은 트레인드 base를 요구하므로.
function clearGrowthSkills() {
  // 향상 먼저 복원(역순: 상위 레벨 향상부터 되돌려야 누적이 순서대로 풀림)
  (state._growthIncreasedSkills || []).slice().reverse().forEach(e => {
    const el = document.getElementById('sk-prof-' + e.skill);
    if (el && parseInt(el.value || 0) === e.newRank) el.value = String(e.prevRank || 0);
  });
  state._growthIncreasedSkills = [];
  // 훈련 복원
  (state._growthTrainedSkills || []).forEach(e => {
    const el = document.getElementById('sk-prof-' + e.skill);
    if (el && parseInt(el.value || 0) === e.rank) el.value = String(e.prevRank || 0);
  });
  state._growthTrainedSkills = [];
}

// 기술 증가 레벨 관문(정본 Player Core): 전문가(4)는 언제나, 달인(6)은 7레벨, 전설(8)은 15레벨 이상부터.
//   반환 = 해당 캐릭터 레벨에서 기술 증가로 도달 가능한 최고 숙련도 rank. 후보 필터·실제 적용 공용(원칙#1).
function skillIncreaseRankCap(lv) {
  lv = parseInt(lv) || 0;
  if (lv >= 15) return 8;   // 전설
  if (lv >= 7)  return 6;   // 달인
  return 4;                 // 전문가
}

function applyGrowthSkills() {
  state._growthTrainedSkills = [];
  state._growthIncreasedSkills = [];
  // 추가 기술 숙련(훈련) — 모두 growth[1]에 저장. 트레인드(2) 미만이면 부여, prevRank로 출처추적.
  const trainArr = (state.growth[1] && state.growth[1].skillTraining) || [];
  trainArr.forEach(id => {
    if (!id) return;
    const el = document.getElementById('sk-prof-' + id);
    if (!el) return;
    const cur = parseInt(el.value || 0);
    state._growthTrainedSkills.push({skill: id, rank: 2, prevRank: cur});
    if (cur < 2) el.value = '2';
  });
  // 기술 향상 — 레벨 순서대로 한 단계씩. 트레인드(2) 이상만 대상 + 레벨 관문(달인@7·전설@15) 강제.
  const levels = Object.keys(state.growth).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
  levels.forEach(lv => {
    const inc = state.growth[lv] && state.growth[lv].skillIncrease;
    if (!inc) return;
    const el = document.getElementById('sk-prof-' + inc);
    if (!el) return;
    const cur = parseInt(el.value || 0);
    const cap = skillIncreaseRankCap(lv);   // 이 레벨에서 도달 가능한 최고 rank
    if (cur >= 2 && cur < cap) {
      const nr = cur + 2;   // cur<cap(≤8)이므로 nr≤cap≤8 — 관문·전설 상한 동시 충족
      state._growthIncreasedSkills.push({skill: inc, prevRank: cur, newRank: nr});
      el.value = String(nr);
    } else {
      // 미달(트레인드 아님)·이미 전설·레벨 관문 초과(예: 5레벨에 전문가→달인) — 무변경이지만 추적은 유지(clear 대칭)
      state._growthIncreasedSkills.push({skill: inc, prevRank: cur, newRank: cur});
    }
  });
}

function rebuildCoreEffects() {
  const heritage = state.selectedHeritage;
  const heff = getHeritageEffects(heritage);
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
  _cleanHeritageInnateSpells();

  // 배경 기술: prevRank 복원
  (state._bgGrantedSkills || []).forEach(entry => {
    const el = document.getElementById('sk-prof-' + entry.skill);
    if (el && parseInt(el.value || 0) === entry.rank) {
      el.value = String(entry.prevRank || 0);
    }
  });
  state._bgGrantedSkills = [];

  // 클래스 고정/선택 기술: prevRank 복원 (출처기반, v0.134 — 구 명령형 부여의 유령 잔존 해소)
  (state._classGrantedSkills || []).forEach(entry => {
    const el = document.getElementById('sk-prof-' + entry.skill);
    if (el && parseInt(el.value || 0) === entry.rank) el.value = String(entry.prevRank || 0);
  });
  state._classGrantedSkills = [];

  // 신격 기술/선호무기 숙련: prevRank 복원 (출처기반, v0.134)
  (state._deityGrantedSkills || []).forEach(entry => {
    const el = document.getElementById('sk-prof-' + entry.skill);
    if (el && parseInt(el.value || 0) === entry.rank) el.value = String(entry.prevRank || 0);
  });
  state._deityGrantedSkills = [];
  (state._deityGrantedProfs || []).forEach(entry => {
    const el = document.getElementById(entry.target);
    if (el && parseInt(el.value || 0) === entry.rank) el.value = String(entry.prevRank || 0);
  });
  state._deityGrantedProfs = [];

  // 지식(lore) 출처 수집 버퍼 초기화 — rebuildCoreEffects가 recalc의 첫 실행이므로 여기서 리셋.
  //   배경·재주가 collectLoreSource로 채우고, recalcAll이 마지막에 assignLoreSlots()로 배정.
  state._loreSources = [];

  // 배경 재주: _fromBackground 제거
  Object.values(state.feats).forEach(arr => {
    if (!arr) return;
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i]?._fromBackground) arr.splice(i, 1);
    }
  });

  // ── REBUILD PHASE ──

  // 유산 HP 보너스
  state._heritageHpBonus = heff.hpBonus || 0;

  // 유산 기술 숙련
  if (heff.grantSkills) {
    heff.grantSkills.forEach(sid => {
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

  // 유산 재주 (entry: string=feat_id 또는 {id, choice})
  if (heff.grantFeats) {
    heff.grantFeats.forEach(entry => {
      const featId = typeof entry === 'string' ? entry : entry.id;
      const presetChoice = typeof entry === 'object' ? entry.choice : undefined;
      const fd = getFeat(featId);
      const cat = fd?.category === 'general' ? 'general' : 'skill';
      if (!state.feats[cat]) state.feats[cat] = [];
      // savedHeritageChoices는 표시용 이름 키 → fd 있으면 정식 이름 키 사용, 없으면 id 키
      const featName = fd ? `${fd.name_ko} (${fd.name_en})` : featId;
      const feat = {id: fd?.id || featId, name: featName, _featId: featId, level: 1, _fromHeritage: true};
      if (savedHeritageChoices[featName]) feat.choice = savedHeritageChoices[featName];
      else if (savedHeritageChoices[featId]) feat.choice = savedHeritageChoices[featId];
      else if (presetChoice) feat.choice = presetChoice;
      state.feats[cat].push(feat);
    });
  }

  // 유산 무기
  if (heff.grantWeapon) {
    const w = heff.grantWeapon;
    if (typeof addWeapon === 'function') {
      addWeapon({name: w.name, dmg: w.dmg, traits: w.traits, category: w.category, _fromHeritage: true});
    }
  }

  // 유산 선천 주문 (비선택형만 — 선택형은 _heritageCantrip 재주가 관리)
  if (heff.innateSpells) {
    if (!state.spells) state.spells = {cantrip:[], known:[], focus:[], innate:[]};
    if (!state.spells.innate) state.spells.innate = [];
    heff.innateSpells.forEach(sp => {
      // 선택형 마커 = slug 어휘(primal/$other/any). 구 한글('원시'/'선택')은 폴백.
      const needsChoice = ['primal', '$other', 'any', '원시', '선택'].includes(sp.tradition);
      if (!needsChoice) {
        const _sp = getSpell(sp.name);
        state.spells.innate.push({id: _sp?.id || null, name: sp.name, tradition: sp.tradition, type: sp.type, uses: sp.uses, _heritage: true, _source: heritage.name_ko});
      }
    });
  }

  const beff = bg ? getBackgroundEffects(bg) : null;

  // 배경 기술 — 고정
  if (beff && beff.fixed_skills.length) {
    beff.fixed_skills.forEach(id => {
      const el = document.getElementById('sk-prof-' + id);
      if (!el) return;
      const cur = parseInt(el.value || 0);
      state._bgGrantedSkills.push({skill: id, rank: 2, prevRank: cur});
      if (cur < 2) el.value = '2';
    });
  }

  // 배경 기술 — 선택형(choice_skill_groups): 선택값을 출처추적 부여. (v0.134 — 구: 선택 기술이 노트에만
  //   반영되고 sk-prof엔 아예 훈련 안 되던 미적용 버그. 이제 _bgGrantedSkills로 부여+정리.)
  if (beff && beff.choice_skill_groups && beff.choice_skill_groups.length) {
    const bgChoiceSkill = state.initialChoices && state.initialChoices.background && state.initialChoices.background.choiceSkill;
    if (bgChoiceSkill) {
      const el = document.getElementById('sk-prof-' + bgChoiceSkill);
      if (el) {
        const cur = parseInt(el.value || 0);
        state._bgGrantedSkills.push({skill: bgChoiceSkill, rank: 2, prevRank: cur});
        if (cur < 2) el.value = '2';
      }
    }
  }

  // 배경 지식 (lore) — 출처로 수집(assignLoreSlots가 배정). 주제명 한글화(글로서리) 후.
  //   고정 지식은 이름 변경 불가(fixed). 각 고정 지식이 하나의 출처=슬롯 점유.
  if (beff && beff.fixed_lores.length) {
    beff.fixed_lores.forEach(loreName => {
      const loreKo = (typeof getLoreKo === 'function') ? getLoreKo(loreName) : loreName;
      collectLoreSource({ key: 'bg:fixed:' + loreName, name: loreKo, rank: 2, kind: 'background', ref: null, fixed: true });
    });
  }

  // 배경 지식(선택) — "원하는 지식 1개" 혜택 자체가 하나의 출처 → 이름 미입력이어도 슬롯 점유(출처 기반).
  if (beff && beff.choice_lore) {
    const chosen = ((state.initialChoices && state.initialChoices.background && state.initialChoices.background.choiceLore) || '').trim();
    collectLoreSource({ key: 'bg:choice', name: chosen, rank: 2, kind: 'background', ref: 'bg-choice', fixed: false });
  }

  // 배경 재주 — feat_id 기반
  if (beff?.feat_id) {
    const fd = getFeat(beff.feat_id);
    if (fd) {
      // 이미 다른 경로(수동 획득/타 소스)로 보유 중이면 중복 부여 금지 (slug 기준)
      const _slug = fd.id || beff.feat_id;
      const already = Object.values(state.feats).some(arr => (arr || []).some(ff => ff && featSlug(ff) === _slug));
      if (!already) {
        if (!state.feats.skill) state.feats.skill = [];
        state.feats.skill.push({
          name: `${fd.name_ko} (${fd.name_en})`,
          _featId: fd.id,
          level: 1,
          _fromBackground: true
        });
      }
    }
  }

  // ── 클래스 고정/선택 기술 숙련 (출처기반, v0.134) ──
  //   구: applyClassDefaults/confirmModal이 명령형으로 sk-prof를 훈련 → 같은 클래스 재확정+다른 "A or B"
  //   선택 시 이전 선택 기술이 유령 잔존(resetFromClass는 id 변경 시에만 정리). clear+rebuild로 출처추적.
  const cls = state.selectedClass;
  if (cls) {
    // 훈련 가능한 자유 기술 슬롯 = 클래스 부여 수(free_skill_count) + 지능 수정치 (PF2e 정본).
    //   반응형 단일 소스: 능력치 증강(지능) 변경마다 recalcAll→여기서 재계산(applyClassDefaults의 초기 세팅을 대체).
    //   음수 지능이면 자유 슬롯 감소, 최소 0(고정 클래스 기술은 별도라 줄지 않음).
    state.trainableSkillSlots = Math.max(0, (cls.free_skill_count || 0) + getMod('int'));
    const clsSkillIds = [];
    (cls.fixed_skills || []).forEach(id => { if (id) clsSkillIds.push(id); });
    ((state.initialChoices && state.initialChoices.class && state.initialChoices.class.chosenFixedSkills) || []).forEach(name => {
      if (!name) return;
      const id = (typeof skillNameToId === 'function') ? skillNameToId(name) : null;
      if (id) clsSkillIds.push(id);
    });
    // 택1 클래스 스킬(파이터 곡예/운동 등) — 성장 빌더 「클래스 스킬」 피커 선택값(그룹 내 유효값만) 훈련.
    const _cscGroups = cls.choice_skill_groups || [];
    (state.classSkillChoices || []).forEach((sid, gi) => {
      if (sid && _cscGroups[gi] && _cscGroups[gi].indexOf(sid) >= 0 && clsSkillIds.indexOf(sid) < 0) clsSkillIds.push(sid);
    });
    clsSkillIds.forEach(id => {
      const el = document.getElementById('sk-prof-' + id);
      if (!el) return;
      const cur = parseInt(el.value || 0);
      state._classGrantedSkills.push({skill: id, rank: 2, prevRank: cur});
      if (cur < 2) el.value = '2';
    });
  }

  // ── 신격 부여 기술/선호무기 숙련 (출처기반, v0.134) ──
  //   구: selectDeity 명령형 부여 + clearDeity/신격변경 시 미원복 → 이전 기술·무기숙련 유령 잔존.
  //   ⚠ deity_skill 플래그(과부하)를 직교 능력으로 분해:
  //     · 신격 기술 훈련 = 신격 선택 특성(deity-*)을 가진 클래스 전부 — 클레릭(deity-cleric)·챔피언(deity-champion)
  //       리마스터: 둘 다 "신격의 신성 기술에 숙련"(PC1 클레릭 / PC2 챔피언 '신성과 원인').
  //     · 선호무기 숙련 상승 = 클레릭 계열(deity_skill)만 — 챔피언은 '신성 무기'(피해 주사위 상승·접근)라 숙련 상승 아님.
  const _deityRoster = (typeof CLASS_FEATURE_NAMES !== 'undefined' && cls && CLASS_FEATURE_NAMES[cls.id]) || [];
  const _classTrainsDeitySkill = !!(cls && (cls.deity_skill || _deityRoster.some(f => /^deity-/.test(String(f.slug || f.id || '')))));
  if (_classTrainsDeitySkill && state.deity) {
    const dty = (typeof _getDeity === 'function') ? _getDeity(state.deity) : null;
    if (dty && dty.skill) {
      const el = document.getElementById('sk-prof-' + dty.skill);
      if (el) {
        const cur = parseInt(el.value || 0);
        state._deityGrantedSkills.push({skill: dty.skill, rank: 2, prevRank: cur});
        if (cur < 2) el.value = '2';
      }
    }
  }
  if (cls && cls.deity_skill && state.deity) {
    const dty = (typeof _getDeity === 'function') ? _getDeity(state.deity) : null;
    if (dty) {
      if (dty.weapon && typeof getWeapon === 'function') {
        const wpn = getWeapon(dty.weapon);
        if (wpn) {
          const wslug = (wpn.catSlug || '').toLowerCase();
          const wcat = (wpn.category || '').toLowerCase();
          let profKey = null;
          if (wslug === 'martial' || wcat.includes('군용') || wcat.includes('martial')) profKey = 'prof-weapon-martial';
          else if (wslug === 'advanced' || wcat.includes('고급') || wcat.includes('advanced')) profKey = 'prof-weapon-advanced';
          if (profKey) {
            const el = document.getElementById(profKey);
            if (el) {
              const cur = parseInt(el.value || 0);
              state._deityGrantedProfs.push({target: profKey, rank: 2, prevRank: cur});
              if (cur < 2) el.value = '2';
            }
          }
          state._deityWeapon = dty.weapon;
        }
      }
    }
  }

  // ── 서브클래스(교단 등) 부여 기술 숙련 — 성장표(subclass_progression) grant_skills 직접 소스 ──
  //   예: 드루이드 교단(동물=운동, 잎=외교, 폭풍=곡예, 야생=위협). 효과(자동화) 탭 경유 안 함(성장표 자체가 효과).
  //   _deityGrantedSkills 복원 버퍼 공용(자동부여 기술).
  if (state.selectedSubclass && state.selectedSubclass.id && typeof PF2eClass !== 'undefined' && PF2eClass.subclassGrantTable) {
    const _subLv = (typeof getLevel === 'function') ? getLevel() : 20;
    const _trainSub = sk => {
      if (!sk) return;
      const el = document.getElementById('sk-prof-' + sk);
      if (!el) return;
      const cur = parseInt(el.value || 0);
      state._deityGrantedSkills.push({ skill: sk, rank: 2, prevRank: cur });
      if (cur < 2) el.value = '2';
    };
    PF2eClass.subclassGrantTable(state.selectedSubclass.id, _subLv).skills.forEach(sr => _trainSub(sr.slug));
    // 드라코닉 등 표본 의존 2번째 혈통 기술 — 표본 선택(state.bloodlineExemplar)에서 훈련.
    const _bl = (typeof BLOODLINE_DB !== 'undefined') ? BLOODLINE_DB[state.selectedSubclass.id] : null;
    if (_bl && _bl.exemplars && state.bloodlineExemplar) {
      const _ex = _bl.exemplars.find(e => e.name_en === state.bloodlineExemplar);
      if (_ex && _ex.skill) _trainSub(_ex.skill);
    }
  }
}

// ── 서브클래스 효과 헬퍼 — 성장표(subclass_progression) 부여 칸 직접 소스 ──
// 합의 구조: 성장·정체성(클래스성장/혈통/유산/서브클래스성장) → 재주/아이템/클래스특성 → 효과(자동화).
//   효과(자동화) 탭은 재주·아이템·클래스특성 슬러그 전용. 서브클래스 성장은 그 자체로 효과를 지니므로
//   런타임이 PF2eClass.subclassGrantTable(성장표)에서 직접 읽어 적용(숙련 T/E/M/L과 동일 경로). getEffectRows 경유 폐지.
function getSubclassAutoFeats(sub) {
  if (!sub || !sub.id || typeof PF2eClass === 'undefined' || !PF2eClass.subclassGrantTable) return [];
  // 서브클래스가 부여하는 능력은 클래스 특성('special')으로 묶는다 — 클래스 재주(class)/기술 재주(skill)가 아님.
  return PF2eClass.subclassGrantTable(sub.id).feats.map(fe => {
    const f = (typeof getFeat === 'function') ? getFeat(fe.slug) : null;
    return f ? { lv: fe.lv || 1, name_ko: f.name_ko, name_en: f.name_en, category: 'special', _subclass: true } : null;
  }).filter(Boolean);
}
function getSubclassAutoSpells(sub) {
  if (!sub || !sub.id || typeof PF2eClass === 'undefined' || !PF2eClass.subclassGrantTable) return [];
  return PF2eClass.subclassGrantTable(sub.id).spells.map(sr => {
    const sp = (typeof getSpell === 'function') ? getSpell(sr.slug) : null;
    if (!sp) return null;
    const o = { lv: sr.lv || 1, type: sr.type, name_ko: sp.name_ko, name_en: sp.name_en };
    if (sr.rank !== undefined) o.rank = sr.rank;
    return o;
  }).filter(Boolean);
}
function getSubclassFeatures(sub) { return (sub && sub.features) || []; }

// 서브클래스 전통 해소(주문 탭 필터). 고정 전통(sub.tradition: 대부분 혈통·위치 후원자)이 우선.
//   전통 미지정(드라코닉 혈통=variable)은 표본 선택(state.bloodlineExemplar)에서 해소.
function _subclassTradition() {
  const sub = state.selectedSubclass;
  if (!sub) return null;
  if (sub.tradition) return sub.tradition;
  const bl = (typeof BLOODLINE_DB !== 'undefined') ? BLOODLINE_DB[sub.id] : null;
  if (bl && bl.exemplars && state.bloodlineExemplar) {
    const ex = bl.exemplars.find(e => e.name_en === state.bloodlineExemplar);
    if (ex && ex.tradition) return ex.tradition;
  }
  return null;
}

// ── 선택 유효성 리졸버 (B안: 캐스케이드 자동삭제 대신 유지+플래그+효과보류) ──
// 종속 선택(성별화·신성원천 등)이 그 출처(신격)와 맞는지 판정. 무효여도 값은 유지하고
// state._invalidChoices에 표시만 → 빌더는 「선행조건 불일치」 렌더, 효과는 각 적용부에서 게이트해 보류.
// (현재 파일럿 = 클레릭 신격↔성별화↔신성원천. 이후 서브클래스·챔피언 등으로 확장.)
function _resolveChoiceValidity() {
  const inv = {};
  const cls = state.selectedClass;
  // ⚠ 파일럿 범위 = 클레릭 계열(deity_skill: 신격이 성별화·신성원천을 강제)만 판정.
  //   챔피언 등 비-deity_skill 클래스도 성별화를 쓰지만(원인↔신격 제약) 규칙이 달라 오탐 방지 위해 제외(Phase 3).
  if (cls && cls.deity_skill) {
    const d = (state.deity && typeof _getDeity === 'function') ? _getDeity(state.deity) : null;
    if (!d) {
      // 신격 미선택인데 하위 선택이 남아 있으면 무효(성립 안 함)
      if (state.sanctification) inv.sanctification = true;
      if (state.divineFont) inv.divineFont = true;
    } else {
      // 성별화: 신격이 성별화를 제약(옵션 있음)하는데 그 안에 없으면 무효. 제약 없는 신격(0옵션)은 판정 제외(오탐 방지).
      const sanct = d.sanctification || [];
      if (state.sanctification && sanct.length && !sanct.includes(state.sanctification)) inv.sanctification = true;
      // 신성원천: 신격이 폰트를 제한(옵션 있음)하는데 그 안에 없으면 무효.
      const font = d.font || [];
      if (state.divineFont && font.length && !font.includes(state.divineFont)) inv.divineFont = true;
    }
  }
  state._invalidChoices = inv;
}

function recalcAll() {
  // 성장(빌더) 기술 훈련/향상 기여를 먼저 걷어냄 — heritage/bg/feat가 깨끗한 base에서 prevRank 스냅샷하도록.
  clearGrowthSkills();
  // 선택 유효성 판정(효과 보류·불일치 표시의 단일 소스) — 부여 적용 전에 계산.
  _resolveChoiceValidity();
  // 빌더 핵심 선택 재파생 (유산/배경)
  rebuildCoreEffects();
  // 재주 효과 집계
  if (typeof applyFeatEffects === 'function') applyFeatEffects();
  // 지식(lore) 출처 → 슬롯 배정 (배경+재주 수집 완료 후 1회). 기술 재계산 전에 실행해야 지식 숙련 반영.
  if (typeof renderLores === 'function') renderLores();
  // 성장(빌더) 기술 훈련/향상 재적용 — 모든 트레인드 부여(클래스고정/유산/배경/재주) 확정 후 마지막에.
  //   향상(+2)은 트레인드 base를 요구하므로 최하단. lore도 assignLoreSlots 후라 지식 향상 대상도 커버.
  applyGrowthSkills();
  ['str','dex','con','int','wis','cha'].forEach(a => {
    const {mod, partial} = calcMod(a);
    const mEl = document.getElementById('mod-'+a);
    if (mEl) mEl.textContent = fmtBonus(mod);
    const pEl = document.getElementById('partial-'+a);
    if (pEl) pEl.textContent = partial ? '½ 증강' : '';
  });
  // 증강 팝업이 열려있으면 실시간 업데이트
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
  // 디버그 박스 갱신
  _debugShowBonusPool();
  // 세션 중이면 활성 상태이상을 내 맵 토큰에 동기화(변경 시에만 write) → GM 지도에 표시
  if (typeof syncTokenConditions === 'function') syncTokenConditions();
}

// ── 보너스 확인 모달 (굴림 없는 stat용 — AC, 이속의 추가 정보 등) ──
function showBonusInfoModal(category, label) {
  const pool = state._fb?.bonuses || [];
  const matched = pool.filter(b => b.category === category);
  const TYPE_LABEL = {circumstance:'상황 보너스 (Circumstance)', status:'상태 보너스 (Status)', item:'아이템 보너스 (Item)', '':'기타 (untyped)'};
  const TYPES = ['circumstance', 'status', 'item', ''];
  const grouped = {};
  for (const t of TYPES) grouped[t] = matched.filter(b => (b.bonus_type || '') === t);

  const overlay = document.createElement('div');
  overlay.className = 'bonus-info-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:10001;display:flex;align-items:center;justify-content:center';

  let bodyHtml = '';
  // type별 max 합산은 정본 getStackedBonus(category) 단일 소스 사용(구: 동일 알고리즘 inline 재구현).
  const { total: totalApplied, picks } = getStackedBonus(category);
  const pickedSet = new Set(picks);
  for (const t of TYPES) {
    const group = grouped[t];
    if (!group.length && t === '') continue;
    bodyHtml += `<div style="margin-bottom:10px"><div style="color:var(--gold);font-size:11px;margin-bottom:4px;font-weight:600">${TYPE_LABEL[t] || t}</div>`;
    if (group.length) {
      group.forEach(b => {
        const isApplied = pickedSet.has(b);
        const sign = (typeof b.value === 'number' && b.value < 0) ? '' : '+';
        const cond = b.condition ? ` <span style="color:#888;font-size:11px">(조건: ${b.condition})</span>` : '';
        const mark = isApplied ? '<span style="color:#0c0;font-weight:700">★</span> ' : '<span style="color:#666">·</span> ';
        bodyHtml += `<div style="padding:3px 0;font-size:12px">${mark}<strong>${sign}${b.value}</strong> <em style="color:#bbb">${b.source||''}</em>${cond}</div>`;
      });
    } else {
      bodyHtml += '<div style="color:#666;font-size:11px;padding:2px 0 2px 20px">(없음)</div>';
    }
    bodyHtml += '</div>';
  }

  const card = document.createElement('div');
  card.style.cssText = 'background:var(--bg2);border:1px solid var(--gold);border-radius:8px;width:90vw;max-width:420px;max-height:85vh;display:flex;flex-direction:column;color:var(--text)';
  card.innerHTML = `
    <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
      <h3 style="margin:0;color:var(--gold);font-size:14px">${label} — 활성 보너스</h3>
      <button id="bim-x" style="background:none;border:none;color:var(--text2);font-size:20px;cursor:pointer;padding:0 4px">✕</button>
    </div>
    <div style="padding:12px 16px;overflow-y:auto;flex:1">
      <div style="color:#aaa;font-size:11px;margin-bottom:10px">★ = 자동 적용 (type별 max). PF2e 규칙상 같은 type끼리는 비합산.</div>
      ${bodyHtml}
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);text-align:right;font-size:13px">
        <span style="color:#aaa">자동 적용 합계:</span> <strong style="color:var(--gold)">${totalApplied >= 0 ? '+' : ''}${totalApplied}</strong>
      </div>
    </div>
    <div style="padding:10px 16px;border-top:1px solid var(--border);display:flex;justify-content:flex-end">
      <button id="bim-close" style="padding:8px 16px;background:var(--bg3);border:1px solid var(--border2);border-radius:4px;color:var(--text);cursor:pointer">닫기</button>
    </div>
  `;
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  const close = () => overlay.remove();
  card.querySelector('#bim-x').onclick = close;
  card.querySelector('#bim-close').onclick = close;
  overlay.onclick = e => { if (e.target === overlay) close(); };
}

// 조건은 slug(영문 id)로 식별 — state.conditions는 현재 한글명 키라, 하드코딩 한글명은 이름 개명 시 조용히 오작동.
// (실제로 sickened/clumsy/enfeebled/stupefied/drained 등이 개명돼 페널티 미적용이던 버그 복구.)
function _condName(slug) {
  const c = (typeof CONDITIONS_DATA !== 'undefined') ? CONDITIONS_DATA.find(x => x && x.id === slug) : null;
  return c ? c.name : slug;
}
function _condVal(slug) { return parseInt(state.conditions[_condName(slug)] || 0) || 0; }

function getCondPenalty() {
  const frightened = _condVal('frightened');
  const sickened = _condVal('sickened');
  return {
    all: Math.max(frightened, sickened), // 공포/구역질 중 큰 값
    clumsy: _condVal('clumsy'), enfeebled: _condVal('enfeebled'), stupefied: _condVal('stupefied')
  };
}

// 활성 보너스 풀에서 category/target에 매칭되는 보너스를 type별 max 1개로 합산 (v530~)
//   각 type(circumstance/status/item/'')별 최댓값 1개만 적용 — PF2e 보너스 합산 규칙
//   반환: {total: 합산값, picks: [{value, bonus_type, source, condition}, ...]}
//   picks는 실제 적용된 보너스 (툴팁용 출처 표시)
//   value === 'level' 키워드는 현재 레벨로 해석
function getStackedBonus(category, target) {
  const pool = state._fb?.bonuses || [];
  const matched = pool.filter(b => b.category === category && (target == null || b.target == null || b.target === target));
  if (!matched.length) return { total: 0, picks: [] };
  const lv = getLevel();
  const resolveVal = v => (v === 'level' ? lv : (typeof v === 'number' ? v : parseInt(v) || 0));
  // type별 그룹 → 각 그룹에서 value 최대 1개
  const byType = {};
  for (const b of matched) {
    const t = b.bonus_type || '';
    const v = resolveVal(b.value);
    if (!byType[t] || resolveVal(byType[t].value) < v) byType[t] = b;
  }
  const picks = Object.values(byType);
  const total = picks.reduce((sum, b) => sum + resolveVal(b.value), 0);
  return { total, picks };
}


// ── 디버그 박스 (개발 진단용 — 우상단 textarea, ✕로 닫기) ──
// ?debug=1 쿼리에서만 활성화 (dev 경로 자동 표시 제거 — 평소엔 안 뜸)
function _debugShowBonusPool() {
  if (!location.search.includes('debug=1')) return;
  let wrap = document.getElementById('debug-bonus-pool');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'debug-bonus-pool';
    wrap.style.cssText = 'position:fixed;top:5px;right:5px;background:#000;border:1px solid #0f0;z-index:99999;border-radius:4px;font-family:monospace;padding:4px';
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'position:absolute;top:2px;right:4px;background:#0f0;color:#000;border:none;width:20px;height:20px;cursor:pointer;font-weight:700;border-radius:2px';
    closeBtn.onclick = () => wrap.remove();
    const ta = document.createElement('textarea');
    ta.id = 'debug-bonus-pool-ta';
    ta.readOnly = true;
    ta.style.cssText = 'width:340px;height:200px;background:#000;color:#0f0;border:none;font-size:11px;font-family:monospace;padding:6px;line-height:1.4;resize:both';
    wrap.appendChild(closeBtn);
    wrap.appendChild(ta);
    document.body.appendChild(wrap);
  }
  const ta = document.getElementById('debug-bonus-pool-ta');
  if (!ta) return;
  const pool = state._fb?.bonuses || [];
  let lines = [];
  if (!pool.length) {
    lines.push('POOL: empty');
  } else {
    lines.push('POOL (' + pool.length + ')');
    pool.forEach(b => lines.push('  [' + b.category + '/' + (b.target||'-') + '] +' + b.value + ' (' + (b.bonus_type||'-') + ') ' + (b.source||'')));
  }
  ta.value = lines.join('\n');
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
  const profBonus = rankBonus(armorProfRank, lv);

  // Sync prof-ac (sidebar) with current armor category prof
  const profAc = document.getElementById('prof-ac');
  if (profAc) profAc.value = armorProfRank;
  const profAc2 = document.getElementById('prof-ac2');
  if (profAc2) profAc2.value = armorProfRank;

  const stowed = state.armorStowed || false;
  const effectiveArmor = stowed ? 0 : armorBonus;
  const effectiveDex = stowed ? getMod('dex') : dexMod;
  const effectiveProf = stowed ? rankBonus(parseInt(document.getElementById('prof-armor-unarmored')?.value||0), lv) : profBonus;

  // 방패 들기 보너스 (파손 시 0)
  const shieldBroken = state.equip?.some(e => e._equipped && e._type === 'shield' && e._broken);
  const shieldBonus = (state.shieldRaised && !state.shieldStowed && !shieldBroken) ? parseInt(document.getElementById('shield-ac')?.value||0) : 0;
  const pen = getCondPenalty();
  const acPenalty = pen.all + pen.clumsy;
  // 활성 보너스 풀에서 AC 보너스 (type별 1개) — 마법 효과/재주 등 (v530~)
  const acExtra = getStackedBonus('ac', null);
  const ac = 10 + effectiveDex + effectiveArmor + effectiveProf + shieldBonus + acExtra.total - acPenalty;
  const acEl = document.getElementById('val-ac');
  if (acEl) {
    acEl.textContent = ac;
    acEl.style.color = acPenalty > 0 ? 'var(--red-light)' : '';
    acEl.dataset.bonusPicks = JSON.stringify(acExtra.picks);  // 툴팁용
  }

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
  pairs.forEach(([key,attr,profId,valId, extraPen]) => {
    const rank = parseInt(document.getElementById(profId)?.value||0);
    const base = getMod(attr) + rankBonus(rank, lv);
    // 풀 자동 합산: target=key 매칭 + target=null(all) 매칭 (v531~)
    const saveExtra = getStackedBonus('save', key);
    const totalPen = pen.all + extraPen;
    const el = document.getElementById(valId);
    applyPenaltyColor(el, base + saveExtra.total, totalPen);
    if (el) el.dataset.bonusPicks = JSON.stringify(saveExtra.picks);
  });
}

function recalcPerc() {
  const total = getMod('wis') + getProfBonus('prof-perc');
  // 지각 풀 보너스 자동 합산 (v531~)
  const percEl = document.getElementById('val-perc');
  const percExtra = getStackedBonus('perception', null);
  if (percEl) {
    percEl.textContent = fmtBonus(total + percExtra.total);
    percEl.dataset.bonusPicks = JSON.stringify(percExtra.picks);
  }
  // 선제 풀 보너스 자동 합산 (v531~ — 풀 단일 출처)
  const initEl = document.getElementById('val-init');
  const initExtra = getStackedBonus('initiative', null);
  if (initEl) {
    initEl.textContent = fmtBonus(total + initExtra.total);
    initEl.dataset.bonusPicks = JSON.stringify(initExtra.picks);
  }
}

// 유효 핵심 능력치 후보 = 클래스 key_attrs ∪ 서브클래스 확장(로그 수법: 지략가 int·건달 str·사기꾼 cha 추가, 도둑=없음).
//   성장·정체성(서브클래스) 데이터가 직접 소유(대원칙 0) — subclasses.json의 key_attr 필드. 다른 클래스도 이 필드로 확장 가능.
function getEffectiveClassKeyAttrs() {
  const cls = state.selectedClass; if (!cls) return [];
  const base = (cls.key_attrs || []).slice();
  const sub = state.selectedSubclass;
  if (sub && sub.class_id === cls.id && sub.key_attr && !base.includes(sub.key_attr)) base.push(sub.key_attr);
  return base;
}
function getClassKeyAttr() {
  // 사용자 선택값(state.boosts.cls) 우선 — 단 유효 후보에 있을 때만(서브클래스 변경으로 무효화된 옛 선택 방지).
  const eff = getEffectiveClassKeyAttrs();
  if (state.boosts.cls && eff.includes(state.boosts.cls)) return state.boosts.cls;
  return eff[0] || 'wis';
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
  const base = getMod(sk.attr) + rankBonus(rank, lv);
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

// 저항 수식 해소: 고정 숫자 / 'half'(레벨절반) / @actor.level / floor(@actor.level/2).
// 미해소(선택형 에너지 {item|...}, 상황성 @actor.flags 등)는 0 → 정적 표시 생략(SKILL 조건부효과 원칙).
function _resolveResistFormula(f, lv, halfLv) {
  if (f === 'half' || f === 'half_level') return halfLv;
  if (typeof f === 'number') return f;
  if (typeof f !== 'string') return 0;
  const t = f.trim();
  if (/^\d+$/.test(t)) return parseInt(t, 10);
  if (/@actor\.level/.test(t)) return /floor\s*\(\s*@actor\.level\s*\/\s*2\s*\)/.test(t) ? halfLv : lv;
  return 0;
}

// 저항 = 출처 기반 재파생(recalc마다). 출처 = 유산 + 착용 방어구 속성 룬(에너지 저항 등).
// PF2e: 같은 피해 유형은 합산하지 않고 최댓값만 적용.
function renderResistances() {
  const wrap = document.getElementById('resistances-display');
  const list = document.getElementById('resistances-list');
  if (!wrap || !list) return;

  const lv = getLevel();
  const halfLv = Math.max(1, Math.floor(lv / 2));
  const collected = [];   // {type, value, source}

  // 1) 유산 저항
  const heritage = state.selectedHeritage;
  const heff = getHeritageEffects(heritage);
  if (heff.resistances) {
    heff.resistances.forEach(r => {
      const val = _resolveResistFormula(r.formula, lv, halfLv);
      if (r.type && val > 0) collected.push({ type: r.type, value: val, source: heritage.name_ko });
    });
  }

  // 2) 착용(_equipped) 방어구에 부착된 속성 룬의 저항 — 출처 기반, 방어구/룬 제거 시 자동 소멸
  if (typeof _getAttachedRunes === 'function' && Array.isArray(state.equip)) {
    state.equip.forEach((e, i) => {
      if (e._type !== 'armor' || !e._equipped) return;
      _getAttachedRunes(i).forEach(rune => {
        const res = rune._runeData && rune._runeData.resist;
        const val = res ? _resolveResistFormula(res.value, lv, halfLv) : 0;
        if (res && res.type && val > 0) collected.push({ type: res.type, value: val, source: rune.name || '방어구 룬' });
      });
    });
  }

  // 3) 재주·서브클래스·배경 부여 저항 (효과 테이블 단일 소스, 조건행은 getEffectRows가 캐릭터 상태로 이미 필터). v0.165~
  //    유산·룬과 동일 collected 풀에 합류 → 아래 유형별 최댓값 병합(PF2e: 같은 유형 최댓값, 다른 유형 각각).
  //    공식 미해소(@armor 룬포텐시·ternary 등)=_resolveResistFormula 0 → 생략. armor:category 조건=조건엔진 미해소→skip.
  const _resSources = [];
  try { Object.values(state.feats || {}).forEach(a => (a || []).forEach(f => { if (f) { const s = (typeof featSlug === 'function') ? featSlug(f) : (f && (f.id || f.name)); if (s) _resSources.push({ slug: s, name: (f.name_ko || f.name || s) }); } })); } catch (e) {}
  if (state.selectedSubclass && state.selectedSubclass.id) _resSources.push({ slug: state.selectedSubclass.id, name: (state.selectedSubclass.name_ko || state.selectedSubclass.name || state.selectedSubclass.id) });
  if (state.selectedBackground && state.selectedBackground.id) _resSources.push({ slug: state.selectedBackground.id, name: (state.selectedBackground.name_ko || state.selectedBackground.name || state.selectedBackground.id) });
  _resSources.forEach(src => {
    (getEffectRows(src.slug) || []).forEach(r => {
      if (r.type !== 'resistance') return;
      const val = _resolveResistFormula(r.value, lv, halfLv);
      if (val <= 0) return;
      let tgts = r.target;
      if (typeof tgts === 'string' && tgts.charAt(0) === '[') { try { tgts = JSON.parse(tgts); } catch (e) {} }
      (Array.isArray(tgts) ? tgts : [tgts]).forEach(tp => { if (tp && tp !== 'custom' && !/[{}]/.test(String(tp))) collected.push({ type: tp, value: val, source: src.name }); });
    });
  });

  // 유형별 최댓값만 유지 + 출처 병합
  const merged = new Map();   // type -> {value, sources:Set}
  collected.forEach(r => {
    const cur = merged.get(r.type);
    if (!cur) merged.set(r.type, { value: r.value, sources: new Set([r.source]) });
    else { cur.value = Math.max(cur.value, r.value); cur.sources.add(r.source); }
  });

  if (merged.size === 0) {
    list.innerHTML = '';   // 잔여 저항 태그 제거 (출처 변경 시 stale 방지)
    wrap.style.display = 'none';
    return;
  }
  wrap.style.display = '';
  const dtKo = (t) => (typeof PF2eEquip !== 'undefined' && PF2eEquip.damageTypeKo) ? PF2eEquip.damageTypeKo(t) : t;
  list.innerHTML = Array.from(merged.entries()).map(([type, info]) => {
    const src = Array.from(info.sources).join(', ').replace(/"/g, '');
    return `<span class="tag" title="출처: ${src}" style="font-size:10px;background:var(--bg4);border:1px solid var(--border2);">🛡 ${dtKo(type)} ${info.value}</span>`;
  }).join('');
}

// 총 부피 = 장비 + 배낭(ignoreBulk 제외) + 동전(100개당 0.1). recalcBulk·isOverloaded 공용 단일 소스.
function getTotalBulk() {
  let total = 0;
  state.equip.forEach(e => { const b = parseFloat(e.bulk||0); total += isNaN(b)?0:b; });
  if (state.containers) state.containers.forEach(c => { if (c.ignoreBulk) return; c.items.forEach(e => { const b = parseFloat(e.bulk||0); total += isNaN(b)?0:b; }); });
  const totalCoins = ['cur-gp','cur-sp','cur-cp','cur-pp'].reduce((s,id) => s + (parseInt(document.getElementById(id)?.value)||0), 0);
  total += Math.floor(totalCoins / 100) * 0.1;
  return total;
}
// 소지 한계 = STR수정치 + 10 + 효과보너스. 과적 기준은 한계-5.
function getBulkLimit() { return getMod('str') + 10 + (state._fb?.bulk || 0); }

function recalcBulk() {
  const total = getTotalBulk();
  document.getElementById('bulk-total').textContent = total.toFixed(1).replace('.0','');
  const maxBulk = getBulkLimit();              // 소지 한계
  const encThreshold = maxBulk - 5;            // 과적 기준
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

  // 과적 상태이상 자동 적용/해제 (조건명은 slug로 해소 — 개명 무관)
  const _enc = _condName('encumbered'), _clm = _condName('clumsy');
  const wasEncumbered = !!state.conditions[_enc];
  if (isEncumbered && !wasEncumbered) {
    state.conditions[_enc] = true;
    if ((parseInt(state.conditions[_clm])||0) < 1) state.conditions[_clm] = 1;
    buildConditions();
  } else if (!isEncumbered && wasEncumbered) {
    state.conditions[_enc] = false;
    if ((parseInt(state.conditions[_clm])||0) <= 1) state.conditions[_clm] = 0;
    buildConditions();
  }

  // 과적 시 속도 감소 반영
  recalcSpeed(isEncumbered);
}

function isOverloaded() { return getTotalBulk() > getBulkLimit(); }

function recalcSpeed(isEncumbered) {
  const speedEl = document.getElementById('speed');
  const baseSpeed = parseInt(speedEl?.value||25);
  const hasUI = state._fb?.unburdenedIron || false;
  const encPenalty = isEncumbered ? (hasUI ? 5 : 10) : 0;
  // 활성 보너스 풀에서 이속 보너스 (type별 1개) — 재주/주문 효과 (v530~)
  const speedExtra = getStackedBonus('speed', null);
  const effSpeed = Math.max(5, baseSpeed + speedExtra.total - encPenalty);
  const dispEl = document.getElementById('speed-display');
  if (dispEl) {
    dispEl.textContent = effSpeed;
    dispEl.style.color = isEncumbered ? '#ffaa00' : '';
    dispEl.dataset.bonusPicks = JSON.stringify(speedExtra.picks);  // 툴팁용
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
    // PF2e: HP 0 → 무의식 + 빈사 1 (부상 수치만큼 빈사 증가). 조건명은 slug로 해소.
    const _unc = _condName('unconscious'), _dyi = _condName('dying'), _wnd = _condName('wounded');
    if (!state.conditions[_unc]) {
      state.conditions[_unc] = 1;
      const wounded = state.conditions[_wnd] || 0;
      state.conditions[_dyi] = Math.max(state.conditions[_dyi] || 0, 1 + wounded);
      buildConditions();
      if (typeof renderActiveConditions === 'function') renderActiveConditions();
    }
  }
}

