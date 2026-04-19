// ═══════════════════════════════════════════════
//  DYNAMIC LISTS
// ═══════════════════════════════════════════════

function addWeapon(data) {
  const d = data || {name:'',atk:'',dmg:'',traits:''};
  const id = 'w-'+Date.now();
  // Ensure rune/stow fields exist
  if (d._potency === undefined) d._potency = 0;
  if (d._striking === undefined) d._striking = 0;
  if (d._propertyRunes === undefined) d._propertyRunes = [];
  if (d._stowed === undefined) d._stowed = false;
  if (d._twoHand === undefined) d._twoHand = false;
  state.weapons.push({id,...d});
  renderWeapons();
}

// ── Weapon proficiency badge helpers ──
function updateWeaponProfBadge(cat) {
  const el = document.getElementById('badge-wp-'+cat);
  if (!el) return;
  const val = parseInt(document.getElementById('prof-weapon-'+cat)?.value||0);
  const map = {0:['U',''],2:['T','trained'],4:['E','expert'],6:['M','master'],8:['L','legendary']};
  const [letter,cls] = map[val]||['U',''];
  el.textContent = letter;
  el.className = 'weapon-prof-badge' + (cls?' '+cls:'');
}
function initWeaponProfBadges() {
  ['simple','martial','advanced','unarmed'].forEach(c=>updateWeaponProfBadge(c));
}

// ── Armor proficiency badge helpers ──
function updateArmorProfBadge(cat) {
  const el = document.getElementById('badge-ap-'+cat);
  if (!el) return;
  const val = parseInt(document.getElementById('prof-armor-'+cat)?.value||0);
  const map = {0:['U',''],2:['T','trained'],4:['E','expert'],6:['M','master'],8:['L','legendary']};
  const [letter,cls] = map[val]||['U',''];
  el.textContent = letter;
  el.className = 'weapon-prof-badge' + (cls?' '+cls:'');
}
function initArmorProfBadges() {
  ['light','medium','heavy','unarmored'].forEach(c=>updateArmorProfBadge(c));
}

// ── Armor category detection ──
function getArmorCategory(name) {
  if (!name || typeof ARMOR_DB === 'undefined') return 'unarmored';
  const armor = ARMOR_DB.find(a => a.name_ko === name || a.name_en === name);
  if (!armor) return 'unarmored';
  const cat = armor.category || '';
  if (cat.includes('경갑') || cat.toLowerCase().includes('light')) return 'light';
  if (cat.includes('重甲') || cat.includes('중갑')) return 'heavy';
  if (cat.includes('평갑') || cat.toLowerCase().includes('medium')) return 'medium';
  return 'unarmored';
}

function getArmorProfSelectId() {
  const name = document.getElementById('armor-name')?.value || '';
  const cat = getArmorCategory(name);
  document.getElementById('armor-category').value = cat;
  return 'prof-armor-' + cat;
}

// ── Render Armor Card ──
function renderArmorCard() {
  const card = document.getElementById('armor-card');
  if (!card) return;
  const name = document.getElementById('armor-name')?.value || '';
  const ac = document.getElementById('armor-ac')?.value || '0';
  const dex = document.getElementById('armor-dex')?.value || '-';
  const cat = getArmorCategory(name);
  const stowed = state.armorStowed || false;
  const potency = state.armorPotency || 0;
  const resilient = state.armorResilient || 0;

  const profVal = parseInt(document.getElementById('prof-armor-'+cat)?.value||0);
  const profMap = {0:['U',''],2:['T','trained'],4:['E','expert'],6:['M','master'],8:['L','legendary']};
  const [profLetter,profCls] = profMap[profVal]||['U',''];

  const runeNames = ['','강화 +1','강화 +2','강화 +3'];
  const resNames = ['','탄력 (회피 +1)','상위 탄력 (+2)','최상 탄력 (+3)'];

  card.className = 'defense-card' + (stowed ? ' stowed' : '');
  if (!name) {
    card.innerHTML = `<div class="defense-card-header"><span class="defense-card-name" style="font-size:11px;">갑옷 Armor</span></div>
      <div style="font-size:10px;color:var(--text2);text-align:center;padding:10px 0;">장비 탭에서 갑옷을 장착하면 여기에 표시됩니다</div>`;
    return;
  }
  card.innerHTML = `
    <div class="defense-card-header">
      <button class="defense-btn" onclick="showArmorRunePopup()">룬</button>
      <button class="defense-btn" onclick="toggleArmorStow()">${stowed?'장착':'보관'}</button>
    </div>
    <div class="defense-card-body">
      <div class="defense-card-name">
        <span class="weapon-prof-badge ${profCls}" style="font-size:8px;width:14px;height:14px;">${profLetter}</span>
        ${name}
        ${potency > 0 ? `<span class="tag" style="font-size:9px;">+${potency}</span>` : ''}
        ${resilient > 0 ? `<span class="tag" style="font-size:9px;">${resNames[resilient]||''}</span>` : ''}
      </div>
      <div class="defense-card-stats">
        <span class="stat-item">🛡 Item Bonus <span class="stat-val">+${parseInt(ac)+(potency||0)}</span></span>
        <span class="stat-item">⬆ Dex Cap <span class="stat-val">${dex==='-'||dex===''?'—':dex}</span></span>
      </div>
    </div>
  `;
}

function clearArmor() {
  document.getElementById('armor-name').value = '';
  document.getElementById('armor-ac').value = 0;
  document.getElementById('armor-dex').value = '-';
  document.getElementById('armor-category').value = 'unarmored';
  state.armorPotency = 0;
  state.armorResilient = 0;
  state.armorStowed = false;
  renderArmorCard();
  recalcAC();
  save();
}

function toggleArmorStow() {
  state.armorStowed = !state.armorStowed;
  renderArmorCard();
  recalcAC();
  save();
}

function showArmorRunePopup() {
  const potency = state.armorPotency || 0;
  const resilient = state.armorResilient || 0;
  const popup = document.createElement('div');
  popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10001;background:var(--bg2);border:2px solid var(--accent);border-radius:8px;padding:16px;min-width:260px;';
  popup.innerHTML = `
    <div style="font-weight:700;color:var(--accent);margin-bottom:10px;">갑옷 룬 설정</div>
    <div style="margin-bottom:8px;">
      <label style="font-size:11px;color:var(--text2);">강화 (Potency)</label><br>
      <select id="rune-armor-potency" style="background:var(--bg3);border:1px solid var(--border2);color:var(--text);padding:4px;border-radius:3px;width:100%;">
        <option value="0" ${potency===0?'selected':''}>없음</option>
        <option value="1" ${potency===1?'selected':''}>+1 강화</option>
        <option value="2" ${potency===2?'selected':''}>+2 강화</option>
        <option value="3" ${potency===3?'selected':''}>+3 강화</option>
      </select>
    </div>
    <div style="margin-bottom:12px;">
      <label style="font-size:11px;color:var(--text2);">탄력 (Resilient)</label><br>
      <select id="rune-armor-resilient" style="background:var(--bg3);border:1px solid var(--border2);color:var(--text);padding:4px;border-radius:3px;width:100%;">
        <option value="0" ${resilient===0?'selected':''}>없음</option>
        <option value="1" ${resilient===1?'selected':''}>탄력 (+1)</option>
        <option value="2" ${resilient===2?'selected':''}>상위 탄력 (+2)</option>
        <option value="3" ${resilient===3?'selected':''}>최상 탄력 (+3)</option>
      </select>
    </div>
    <div style="display:flex;gap:6px;justify-content:flex-end;">
      <button onclick="applyArmorRunes()" style="background:var(--accent);color:#fff;border:none;padding:5px 14px;border-radius:4px;cursor:pointer;">적용</button>
      <button onclick="this.closest('div[style]').remove();document.getElementById('armor-rune-overlay')?.remove();" style="background:var(--bg4);color:var(--text2);border:1px solid var(--border2);padding:5px 14px;border-radius:4px;cursor:pointer;">취소</button>
    </div>
  `;
  const overlay = document.createElement('div');
  overlay.id = 'armor-rune-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;';
  overlay.onclick = () => { overlay.remove(); popup.remove(); };
  document.body.appendChild(overlay);
  document.body.appendChild(popup);
}

function applyArmorRunes() {
  state.armorPotency = parseInt(document.getElementById('rune-armor-potency')?.value||0);
  state.armorResilient = parseInt(document.getElementById('rune-armor-resilient')?.value||0);
  document.getElementById('armor-rune-overlay')?.remove();
  document.querySelector('div[style*="translate(-50%"]')?.remove();
  renderArmorCard();
  recalcAC();
  save();
}

// ── Render Shield Card ──
function renderShieldCard() {
  const card = document.getElementById('shield-card');
  if (!card) return;
  const name = document.getElementById('shield-name')?.value || '';
  const ac = document.getElementById('shield-ac')?.value || '0';
  const hard = document.getElementById('shield-hard')?.value || '0';
  const hp = document.getElementById('shield-hp')?.value || '0';
  const bt = Math.floor(parseInt(hp)/2);
  const stowed = state.shieldStowed || false;

  if (!name) {
    card.className = 'defense-card';
    card.innerHTML = `<div class="defense-card-header"><span class="defense-card-name" style="font-size:11px;">방패 Shield</span></div>
      <div style="font-size:10px;color:var(--text2);text-align:center;padding:10px 0;">장비 탭에서 방패를 장착하면 여기에 표시됩니다</div>`;
    return;
  }
  card.className = 'defense-card' + (stowed ? ' stowed' : '');
  card.innerHTML = `
    <div class="defense-card-header">
      <button class="defense-btn" onclick="showInfo('shield','${name.replace(/'/g,"\\'")}')">정보</button>
      <button class="defense-btn" onclick="toggleShieldStow()">${stowed?'장착':'보관'}</button>
    </div>
    <div class="defense-card-body">
      <div class="defense-card-name">${name}</div>
      <div class="defense-card-stats">
        <span class="stat-item">🛡 Raised AC <span class="stat-val">+${ac}</span></span>
        <span class="stat-item">⚒ Hardness <span class="stat-val">${hard}</span></span>
        <span class="stat-item">❤ HP <span class="stat-val">${hp}</span> (BT ${bt})</span>
      </div>
    </div>
  `;
}

function clearShield() {
  document.getElementById('shield-name').value = '';
  document.getElementById('shield-ac').value = 0;
  document.getElementById('shield-hard').value = 0;
  document.getElementById('shield-hp').value = 0;
  const hpCur = document.getElementById('shield-hp-cur');
  if (hpCur) hpCur.value = 0;
  state.shieldStowed = false;
  renderShieldCard();
  updateShieldGauge();
  save();
}

function toggleShieldStow() {
  state.shieldStowed = !state.shieldStowed;
  renderShieldCard();
  save();
}

// ── Weapon category mapping ──
function getWeaponCategory(w) {
  // From DB data
  const cat = (w._dbData?.category || w.category || '').toLowerCase();
  if (cat.includes('비무장') || cat.includes('unarmed')) return 'unarmed';
  if (cat.includes('고급') || cat.includes('advanced') || cat.includes('상급')) return 'advanced';
  if (cat.includes('군용') || cat.includes('martial')) return 'martial';
  if (cat.includes('단순') || cat.includes('simple')) return 'simple';
  // Fallback: check traits
  const traits = getWeaponTraits(w);
  if (traits.some(t=>t.includes('비무장'))) return 'unarmed';
  return 'simple';
}

function getWeaponTraits(w) {
  if (w._dbData?.traits) return w._dbData.traits;
  if (Array.isArray(w.traits)) return w.traits;
  if (typeof w.traits === 'string') return w.traits.split(',').map(t=>t.trim()).filter(Boolean);
  return [];
}

function isRangedWeapon(w) {
  const cat = (w._dbData?.category || w.category || '').toLowerCase();
  if (cat.includes('원거리') || cat.includes('ranged')) return true;
  const range = w._dbData?.range || w.range;
  if (range && range > 0) return true;
  return false;
}

function hasWeaponTrait(w, traitKey) {
  const traits = getWeaponTraits(w);
  return traits.some(t => t.toLowerCase().includes(traitKey.toLowerCase()));
}

// ── Hit & Damage Calculation ──
function calcWeaponHit(w) {
  let cat = getWeaponCategory(w);
  const wpName = w.name || w._dbData?.name_ko || '';
  // 무기 친숙: 해당 무기를 한 카테고리 낮춰 취급 (군용→단순, 고급→군용)
  if (state._fb?.familiarWeapons?.includes(wpName)) {
    if (cat === 'martial') cat = 'simple';
    else if (cat === 'advanced') cat = 'martial';
  }
  const profSelId = 'prof-weapon-' + cat;
  let rank = parseInt(document.getElementById(profSelId)?.value || 0);
  // 개별 무기 훈련됨: 해당 무기에 최소 훈련됨(2) 보장
  if (state._fb?.trainedWeapons?.includes(wpName) && rank < 2) {
    rank = 2;
  }
  const lv = getLevel();
  // 무술 경험: 11레벨 이상이면 모든 무기 숙련, 미만이면 미숙련이어도 레벨을 숙련 보너스로
  if (state._fb?.martialExperience && rank < 2) {
    rank = lv >= 11 ? 2 : 0;
  }
  const profBonus = (rank > 0) ? (rank + lv) : (state._fb?.martialExperience ? lv : 0);

  // Ability modifier
  let abilMod;
  const ranged = isRangedWeapon(w);
  const finesse = hasWeaponTrait(w, '기교') || hasWeaponTrait(w, 'finesse');
  if (ranged) {
    abilMod = getMod('dex');
  } else if (finesse) {
    abilMod = Math.max(getMod('str'), getMod('dex'));
  } else {
    abilMod = getMod('str');
  }

  // Item bonus (potency rune)
  const itemBonus = parseInt(w._potency) || 0;
  // 파손 페널티: -2
  const brokenPen = w._broken ? -2 : 0;

  return abilMod + profBonus + itemBonus + brokenPen;
}

function calcWeaponDamage(w) {
  // Parse base damage dice from DB or stored string
  const rawDmg = w._dbData?.damage || w.dmg || '';
  const diceMatch = rawDmg.match(/(\d+)?d(\d+)/);
  let numDice = diceMatch ? parseInt(diceMatch[1] || 1) : 0;
  let dieSizeBase = diceMatch ? parseInt(diceMatch[2]) : 0;
  const dmgTypeMatch = rawDmg.match(/\s+([A-Z]|[가-힣]+)\s*$/);
  let dmgType = dmgTypeMatch ? dmgTypeMatch[1] : '';
  // Map single-letter damage types
  const typeMap = {'B':'타격','P':'관통','S':'참격','b':'타격','p':'관통','s':'참격'};
  if (typeMap[dmgType]) dmgType = typeMap[dmgType];

  // 치명적 단순함(Deadly Simplicity): 신격 선호 무기가 단순/비무장 & d6이하 → 주사위 +1단계
  if (state._deityWeapon && (w.name||'') === state._deityWeapon) {
    const wpCat = getWeaponCategory(w);
    if ((wpCat === 'simple' || wpCat === 'unarmed') && dieSizeBase > 0 && dieSizeBase <= 6) {
      const stepUp = {4:6, 6:8};
      if (stepUp[dieSizeBase]) dieSizeBase = stepUp[dieSizeBase];
    }
  }

  // Two-hand: check if toggled and weapon has 양손 trait
  let dieSize = dieSizeBase;
  if (w._twoHand) {
    const traits = getWeaponTraits(w);
    const thTrait = traits.find(t => t.includes('양손') || t.toLowerCase().includes('two-hand'));
    if (thTrait) {
      const thMatch = thTrait.match(/d(\d+)/);
      if (thMatch) dieSize = parseInt(thMatch[1]);
    }
  }

  // Striking rune: adds extra dice
  const striking = parseInt(w._striking) || 0;
  numDice += striking;

  // Ability modifier for damage
  let abilMod = 0;
  const ranged = isRangedWeapon(w);
  const propulsive = hasWeaponTrait(w, '추진') || hasWeaponTrait(w, 'propulsive');
  if (!ranged) {
    abilMod = getMod('str');
  } else if (propulsive) {
    abilMod = Math.floor(getMod('str') / 2);
    if (getMod('str') < 0) abilMod = getMod('str'); // negative STR fully applied
  }

  // Rune damage bonus (potency doesn't add to damage in PF2e, only hit)
  // But we keep the structure for property runes later

  const totalBonus = abilMod;
  if (numDice === 0 && dieSizeBase === 0) {
    // No parseable dice, return raw string
    return { str: rawDmg || '—', abilMod };
  }
  let str = numDice + 'd' + dieSize;
  if (totalBonus > 0) str += '+' + totalBonus;
  else if (totalBonus < 0) str += totalBonus;
  if (dmgType) str += ' ' + dmgType;
  return { str, abilMod };
}

// ── Runes popup ──
let activeRunePopup = null;
function showRunePopup(idx, btnEl) {
  closeRunePopup();
  const w = state.weapons[idx];
  if (!w) return;
  const popup = document.createElement('div');
  popup.className = 'weapon-rune-popup';
  popup.id = 'rune-popup-active';
  popup.innerHTML = `
    <label>잠재력 룬 (Potency)</label>
    <select onchange="state.weapons[${idx}]._potency=parseInt(this.value);renderWeapons();save()">
      <option value="0" ${(w._potency||0)===0?'selected':''}>없음</option>
      <option value="1" ${(w._potency||0)===1?'selected':''}>+1</option>
      <option value="2" ${(w._potency||0)===2?'selected':''}>+2</option>
      <option value="3" ${(w._potency||0)===3?'selected':''}>+3</option>
    </select>
    <label>강타 룬 (Striking)</label>
    <select onchange="state.weapons[${idx}]._striking=parseInt(this.value);renderWeapons();save()">
      <option value="0" ${(w._striking||0)===0?'selected':''}>없음</option>
      <option value="1" ${(w._striking||0)===1?'selected':''}>강타 (Striking)</option>
      <option value="2" ${(w._striking||0)===2?'selected':''}>상위 강타 (Greater)</option>
      <option value="3" ${(w._striking||0)===3?'selected':''}>최상위 강타 (Major)</option>
    </select>
    <button class="weapon-btn" onclick="closeRunePopup()" style="width:100%;margin-top:2px;">닫기</button>
  `;
  // Position near the button
  const rect = btnEl.getBoundingClientRect();
  popup.style.position = 'fixed';
  popup.style.top = (rect.bottom + 4) + 'px';
  popup.style.left = Math.min(rect.left, window.innerWidth - 220) + 'px';
  document.body.appendChild(popup);
  activeRunePopup = popup;
  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', closeRunePopupOutside, {once:true,capture:true});
  }, 50);
}
function closeRunePopup() {
  const p = document.getElementById('rune-popup-active');
  if (p) p.remove();
  activeRunePopup = null;
}
function closeRunePopupOutside(e) {
  if (activeRunePopup && !activeRunePopup.contains(e.target)) {
    closeRunePopup();
  }
}

// ── Options popup (two-hand toggle) ──
function showWeaponOptions(idx, btnEl) {
  closeRunePopup();
  const w = state.weapons[idx];
  if (!w) return;
  const traits = getWeaponTraits(w);
  const hasTwoHand = traits.some(t => t.includes('양손') || t.toLowerCase().includes('two-hand'));
  if (!hasTwoHand) return; // no options if no two-hand trait
  const popup = document.createElement('div');
  popup.className = 'weapon-rune-popup';
  popup.id = 'rune-popup-active';
  popup.innerHTML = `
    <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
      <input type="checkbox" ${w._twoHand?'checked':''} onchange="state.weapons[${idx}]._twoHand=this.checked;renderWeapons();save()">
      양손 사용 (Two-Hand)
    </label>
    <button class="weapon-btn" onclick="closeRunePopup()" style="width:100%;margin-top:6px;">닫기</button>
  `;
  const rect = btnEl.getBoundingClientRect();
  popup.style.position = 'fixed';
  popup.style.top = (rect.bottom + 4) + 'px';
  popup.style.left = Math.min(rect.left, window.innerWidth - 220) + 'px';
  document.body.appendChild(popup);
  activeRunePopup = popup;
  setTimeout(() => {
    document.addEventListener('click', closeRunePopupOutside, {once:true,capture:true});
  }, 50);
}

// ── Stow toggle ──
function toggleWeaponStow(idx) {
  const w = state.weapons[idx];
  if (!w) return;
  w._stowed = !w._stowed;
  renderWeapons();
  save();
}

function renderWeapons() {
  const list = document.getElementById('weapons-list');
  if (!list) return;
  list.innerHTML = '';
  state.weapons.forEach((w,i) => {
    const card = document.createElement('div');
    card.className = 'weapon-card' + (w._stowed ? ' stowed' : '');

    const escapedName = (w.name||'').replace(/'/g,"\\'").replace(/"/g,'&quot;');
    const traits = getWeaponTraits(w);
    const traitHtml = traits.map(t=>traitTag(t)).join(' ');
    const hasTwoHandTrait = traits.some(t => t.includes('양손') || t.toLowerCase().includes('two-hand'));

    // Calculate hit and damage
    const hitMod = calcWeaponHit(w);
    const dmgResult = calcWeaponDamage(w);
    const hitStr = fmtBonus(hitMod);
    const dmgStr = dmgResult.str || '—';

    // Range info
    const range = w._dbData?.range || w.range || null;
    const rangeHtml = range ? `<div class="weapon-card-range">\uD83C\uDFAF 사거리: ${range} ft.</div>` : '';

    // Rune indicator text
    let runeInfo = '';
    if ((w._potency||0) > 0 || (w._striking||0) > 0) {
      const parts = [];
      if (w._potency > 0) parts.push('+'+w._potency+' 잠재력');
      if (w._striking === 1) parts.push('강타');
      if (w._striking === 2) parts.push('상위 강타');
      if (w._striking === 3) parts.push('최상위 강타');
      runeInfo = `<span style="font-size:9px;color:var(--accent);margin-left:6px;">[${parts.join(', ')}]</span>`;
    }

    // 개별 무기 숙련도 표시 (TEML 뱃지) — 무기 친숙/훈련 반영
    let wpCat = getWeaponCategory(w);
    const wpNameForFam = w.name || w._dbData?.name_ko || '';
    if (state._fb?.familiarWeapons?.includes(wpNameForFam)) {
      if (wpCat === 'martial') wpCat = 'simple';
      else if (wpCat === 'advanced') wpCat = 'martial';
    }
    let wpProfVal = parseInt(document.getElementById('prof-weapon-'+wpCat)?.value||0);
    if (state._fb?.trainedWeapons?.includes(wpNameForFam) && wpProfVal < 2) wpProfVal = 2;
    if (state._fb?.martialExperience && wpProfVal < 2 && getLevel() >= 11) wpProfVal = 2;
    const wpTemlMap = {0:['U','미숙련',''],2:['T','숙련','trained'],4:['E','전문가','expert'],6:['M','대가','master'],8:['L','전설','legendary']};
    const [wpTemlLetter, wpProfName, wpProfCls] = wpTemlMap[wpProfVal]||['U','미숙련',''];
    const wpCatLabel = {simple:'단순',martial:'군용',advanced:'고급',unarmed:'비무장'}[wpCat]||wpCat;

    card.innerHTML = `
      <div class="weapon-card-header">
        ${hasTwoHandTrait ? `<button class="weapon-btn" onclick="showWeaponOptions(${i},this)" title="옵션">옵션</button>` : ''}
        <button class="weapon-btn" onclick="showRunePopup(${i},this)" title="룬 설정">룬</button>
        <button class="weapon-btn" onclick="toggleWeaponStow(${i})" title="${w._stowed?'꺼내기':'넣기'}">${w._stowed?'꺼내기':'넣기'}</button>
        <span style="flex:1;"></span>
        <button class="weapon-btn danger" onclick="removeWeapon(${i})" title="삭제">삭제</button>
      </div>
      <div class="weapon-card-body">
        <div class="weapon-card-stats">
          <div class="weapon-card-name" onclick="showInfo('weapon','${escapedName}')">
            \u2694 ${w._broken?'<span style="color:var(--red-light);">파손된 </span>':''}${w.name||'무기'}${runeInfo}
          </div>
          ${wpProfVal > 0 ? `<div style="font-size:9px;color:var(--text2);margin-top:-2px;margin-bottom:2px;"><span class="weapon-prof-badge ${wpProfCls}" style="font-size:7px;width:12px;height:12px;display:inline-flex;align-items:center;justify-content:center;">${wpTemlLetter}</span> ${wpCatLabel} 무기 ${wpProfName}</div>` : `<div style="font-size:9px;color:var(--red-light);margin-top:-2px;margin-bottom:2px;">⚠ ${wpCatLabel} 무기 미숙련</div>`}
          <div class="weapon-stat">
            <span class="stat-label">\u2699 명중</span>
            <span class="stat-val" style="${w._broken?'color:var(--red-light);':''}">${hitStr}</span>
          </div>
          <div class="weapon-stat weapon-stat-dmg" data-dmg="${(dmgResult.str||'').replace(/"/g,'&quot;')}">
            <span class="stat-label">\uD83C\uDFAF 피해</span>
            <span class="stat-val dmg">${dmgStr}</span>
          </div>
        </div>
        ${traitHtml ? `<div class="weapon-card-traits">${traitHtml}</div>` : ''}
        ${rangeHtml}
      </div>
    `;
    list.appendChild(card);
  });
}

function removeWeapon(i) { state.weapons.splice(i,1); renderWeapons(); save(); }

function addEquip(data) {
  if (typeof isOverloaded === 'function' && isOverloaded()) {
    alert('소지 한계 초과! 더 이상 아이템을 추가할 수 없습니다.\n(최대 부피 = 근력 수정치 + 10)');
    return;
  }
  const d = data || {name:'',qty:1,bulk:0};
  state.equip.push(d);
  renderEquip();
}

function renderEquip() {
  const list = document.getElementById('equip-list');
  list.innerHTML = '';
  // 제목 행
  const header = document.createElement('div');
  header.className = 'equip-row';
  header.style.cssText = 'font-size:10px;color:var(--text2);border-bottom:1px solid var(--border);padding:2px 4px;';
  header.innerHTML = `<span style="flex:1;">아이템</span><span style="width:30px;text-align:center;">부피</span><span style="width:70px;text-align:center;">수량</span><span style="width:60px;text-align:center;">장착</span><span style="width:40px;text-align:center;">상태</span><span style="width:28px;"></span>`;
  list.appendChild(header);

  state.equip.forEach((e,i) => {
    const row = document.createElement('div');
    row.className = 'equip-row';
    const isEquippable = e._type === 'weapon' || e._type === 'armor' || e._type === 'shield';
    const equipped = e._equipped;
    const eqType = e._type === 'weapon' ? 'weapon' : (e._type === 'armor' ? 'armor' : (e._type === 'shield' ? 'shield' : 'gear'));
    const eqEscName = (e.name||'').replace(/'/g,"\\'");
    const bulkDisplay = e.bulk === 'L' ? 'L' : (e.bulk || '—');

    let equipBtnHtml = '';
    if (isEquippable) {
      equipBtnHtml = equipped
        ? `<button class="equip-toggle equipped" onclick="event.stopPropagation();toggleEquip(${i})">해제</button>`
        : `<button class="equip-toggle" onclick="event.stopPropagation();toggleEquip(${i})">장착</button>`;
    }

    const hasContainers = state.containers && state.containers.length > 0;

    row.innerHTML = `
      <span style="flex:1;font-size:12px;color:${e._broken?'var(--red-light)':'var(--text)'};cursor:pointer;" onclick="showInfo('${eqType}','${eqEscName}')">${e._broken?'파손된 ':''}${e.name||'아이템'}</span>
      <span style="width:30px;text-align:center;font-size:10px;color:var(--text2);">${bulkDisplay}</span>
      <span style="width:70px;display:flex;align-items:center;justify-content:center;gap:2px;">
        <button class="qty-btn" onclick="event.stopPropagation();changeQty(${i},-1)">−</button>
        <span style="min-width:16px;text-align:center;font-size:13px;font-weight:600;color:var(--text);">${e.qty||1}</span>
        <button class="qty-btn" onclick="event.stopPropagation();changeQty(${i},1)">+</button>
      </span>
      <span style="width:60px;text-align:center;">${equipBtnHtml}</span>
      <span style="width:40px;text-align:center;">
        <button class="${e._broken ? 'equip-toggle equipped' : 'equip-toggle'}" onclick="event.stopPropagation();toggleBroken(${i})" style="font-size:9px;padding:2px 4px;${e._broken?'background:var(--red-bg);color:var(--red-light);border-color:var(--red);':''}">${e._broken ? '파손' : '정상'}</button>
      </span>
      <span style="width:28px;text-align:center;">
        ${hasContainers ? `<span class="move-wrap"><select onchange="if(this.value!=='')moveToContainer(${i},parseInt(this.value));this.value=''">
          <option value=""></option>
          ${state.containers.map((c,ci) => `<option value="${ci}">${c.name}</option>`).join('')}
        </select></span>` : ''}
      </span>`;
    list.appendChild(row);
  });
  recalcBulk();
}

function toggleBroken(i) {
  const item = state.equip[i];
  item._broken = !item._broken;
  // 장착된 무기 파손 상태 동기화
  if (item._equipped && item._type === 'weapon') {
    const wIdx = state.weapons.findIndex(w => w._fromEquip === i);
    if (wIdx >= 0) state.weapons[wIdx]._broken = item._broken;
    renderWeapons();
  }
  // 장착된 갑옷/방패 파손 → AC 재계산
  if (item._equipped && (item._type === 'armor' || item._type === 'shield')) {
    renderArmorCard();
    renderShieldCard();
    recalcAC();
  }
  renderEquip();
  renderWeapons();
  save();
}

function moveToContainer(itemIdx, ci) {
  if (!state.containers || ci < 0 || ci >= state.containers.length) return;
  const item = state.equip[itemIdx];
  if (!item) return;
  // 장착 해제 후 이동
  if (item._equipped) { toggleEquip(itemIdx); }
  // 전체 데이터 그대로 이동
  state.containers[ci].items.push({...item});
  state.equip.splice(itemIdx, 1);
  renderEquip();
  renderContainers();
  save();
}

function moveFromContainer(ci, ii, target) {
  if (!state.containers) return;
  const item = state.containers[ci].items[ii];
  if (!item) return;
  if (target === 'main') {
    state.equip.push({...item});
  } else {
    const tci = parseInt(target);
    if (tci >= 0 && tci < state.containers.length) {
      state.containers[tci].items.push({...item});
    }
  }
  state.containers[ci].items.splice(ii, 1);
  renderEquip();
  renderContainers();
  save();
}

function changeQty(i, delta) {
  const item = state.equip[i];
  if (!item) return;
  const newQty = (item.qty || 1) + delta;
  if (newQty <= 0) {
    if (confirm(item.name + '을(를) 제거하시겠습니까?')) {
      removeEquip(i);
    }
    return;
  }
  item.qty = newQty;
  renderEquip();
  save();
}

function toggleEquip(i) {
  const item = state.equip[i];
  if (!item) return;
  item._equipped = !item._equipped;

  if (item._equipped && item._type === 'weapon' && item._data) {
    const w = item._data;
    addWeapon({name: w.name_ko, dmg: w.damage||'', traits: (w.traits||[]).join(', '), _dbData: w, category: w.category, range: w.range, _fromEquip:i, _broken: item._broken||false});
  } else if (item._equipped && item._type === 'armor' && item._data) {
    const a = item._data;
    const nameEl = document.getElementById('armor-name');
    const acEl = document.getElementById('armor-ac');
    const dexEl = document.getElementById('armor-dex');
    if (nameEl) nameEl.value = a.name_ko;
    if (acEl) acEl.value = a.ac_bonus||0;
    if (dexEl) dexEl.value = a.dex_cap!==null && a.dex_cap!==undefined ? a.dex_cap : '-';
    const cpEl = document.getElementById('armor-check-pen');
    const spEl = document.getElementById('armor-speed-pen');
    const srEl = document.getElementById('armor-str-req');
    if (cpEl) cpEl.value = a.check_penalty||0;
    if (spEl) spEl.value = a.speed_penalty||0;
    if (srEl) srEl.value = a.strength||0;
    state.armorPotency = 0; state.armorResilient = 0; state.armorStowed = false;
    renderArmorCard();
    recalcAC();
  } else if (!item._equipped && item._type === 'weapon') {
    // 전투 탭에서 해당 무기 제거
    const wIdx = state.weapons.findIndex(w => w._fromEquip === i);
    if (wIdx >= 0) { state.weapons.splice(wIdx, 1); renderWeapons(); }
  } else if (item._equipped && item._type === 'shield' && item._data) {
    const s = item._data;
    const nameEl = document.getElementById('shield-name');
    const acEl = document.getElementById('shield-ac');
    const hardEl = document.getElementById('shield-hard');
    const hpEl = document.getElementById('shield-hp');
    const hpCurEl = document.getElementById('shield-hp-cur');
    if (nameEl) nameEl.value = s.name_ko;
    if (acEl) acEl.value = s.ac_bonus||0;
    if (hardEl) hardEl.value = s.hardness||0;
    if (hpEl) hpEl.value = s.hp||0;
    if (hpCurEl) hpCurEl.value = s.hp||0;
    state.shieldStowed = false;
    renderShieldCard();
    updateShieldGauge();
  } else if (!item._equipped && item._type === 'armor') {
    const nameEl = document.getElementById('armor-name');
    const acEl = document.getElementById('armor-ac');
    const dexEl = document.getElementById('armor-dex');
    if (nameEl) nameEl.value = '';
    if (acEl) acEl.value = 0;
    const cpEl = document.getElementById('armor-check-pen');
    const spEl = document.getElementById('armor-speed-pen');
    const srEl = document.getElementById('armor-str-req');
    if (cpEl) cpEl.value = 0;
    if (spEl) spEl.value = 0;
    if (srEl) srEl.value = 0;
    if (dexEl) dexEl.value = '-';
    state.armorPotency = 0; state.armorResilient = 0; state.armorStowed = false;
    renderArmorCard();
    recalcAC();
  } else if (!item._equipped && item._type === 'shield') {
    const nameEl = document.getElementById('shield-name');
    const acEl = document.getElementById('shield-ac');
    const hardEl = document.getElementById('shield-hard');
    const hpEl = document.getElementById('shield-hp');
    const hpCurEl = document.getElementById('shield-hp-cur');
    if (nameEl) nameEl.value = '';
    if (acEl) acEl.value = 0;
    if (hardEl) hardEl.value = 0;
    if (hpEl) hpEl.value = 0;
    if (hpCurEl) hpCurEl.value = 0;
    state.shieldStowed = false;
    renderShieldCard();
    updateShieldGauge();
  }

  renderEquip();
  recalcAll();
  save();
}

function removeEquip(i) {
  const item = state.equip[i];
  // 장착된 아이템이면 먼저 해제
  if (item?._equipped) {
    item._equipped = true; // toggleEquip이 반전시키므로
    toggleEquip(i);
  }
  state.equip.splice(i,1);
  // 무기의 _fromEquip 인덱스 재정렬
  state.weapons.forEach(w => { if (w._fromEquip > i) w._fromEquip--; });
  renderEquip();
  save();
}

// ── 컨테이너 (서브 인벤토리) ──
function addContainer() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'container-add';
  document.getElementById('modal-title').textContent = '📦 배낭 추가';
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

  const container = document.getElementById('modal-options');
  const presets = [
    {name:'배낭', bulk:1, desc:'일반적인 모험가 배낭.'},
    {name:'벨트 주머니', bulk:'L', desc:'허리에 차는 작은 주머니.'},
    {name:'자루', bulk:'L', desc:'물건을 넣는 간단한 자루.'},
    {name:'허리 가방', bulk:'L', desc:'허리에 착용하는 가방.'},
  ];
  container.innerHTML = `<div style="padding:16px;">
    <div style="font-size:12px;color:var(--text2);margin-bottom:12px;">배낭 유형을 선택하거나 직접 입력하세요.</div>
    ${presets.map(p => `<div class="opt-row" style="cursor:pointer;" onclick="createContainer('${p.name}')">
      <div class="opt-row-icon">📦</div>
      <span class="opt-row-name">${p.name}</span>
      <span style="font-size:10px;color:var(--text2);">${p.desc}</span>
    </div>`).join('')}
    <hr class="divider" style="margin:12px 0;">
    <div style="display:flex;gap:6px;margin-bottom:8px;">
      <input id="container-custom-name" placeholder="직접 입력..." style="flex:1;background:var(--bg3);border:1px solid var(--border2);color:var(--text);padding:8px;border-radius:4px;font-size:13px;"
        onkeydown="if(event.key==='Enter')createContainer(this.value)">
      <button onclick="createContainer(document.getElementById('container-custom-name').value)" style="padding:8px 16px;background:var(--accent);color:#000;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">추가</button>
    </div>
    <label style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text2);cursor:pointer;">
      <input type="checkbox" id="container-ignore-bulk" style="accent-color:var(--accent);width:16px;height:16px;">
      이 배낭 안의 아이템 부피를 총 부피에 포함하지 않음
    </label>
  </div>`;
}

function createContainer(name) {
  if (!name) return;
  if (!state.containers) state.containers = [];
  const ignoreBulk = document.getElementById('container-ignore-bulk')?.checked || false;
  state.containers.push({name, items:[], ignoreBulk});
  renderContainers();
  renderEquip(); // 이동 드롭다운 갱신
  save();
  closeModal();
}

function addContainerItem(ci) {
  const name = prompt('아이템 이름:');
  if (!name) return;
  state.containers[ci].items.push({name, qty:1, bulk:0});
  renderContainers();
  save();
}

function changeContainerQty(ci, ii, delta) {
  const item = state.containers[ci].items[ii];
  if (!item) return;
  const newQty = (item.qty || 1) + delta;
  if (newQty <= 0) {
    if (confirm(item.name + '을(를) 제거하시겠습니까?')) {
      removeContainerItem(ci, ii);
    }
    return;
  }
  item.qty = newQty;
  renderContainers();
  save();
}

function removeContainerItem(ci, ii) {
  state.containers[ci].items.splice(ii, 1);
  renderContainers();
  save();
}

function removeContainer(ci) {
  if (!confirm(state.containers[ci].name + ' 배낭을 삭제합니까?')) return;
  state.containers.splice(ci, 1);
  renderContainers();
  renderEquip();
  save();
}

function renderContainers() {
  const el = document.getElementById('container-list');
  if (!el) return;
  if (!state.containers) state.containers = [];
  el.innerHTML = '';
  state.containers.forEach((c, ci) => {
    let html = `<div class="box">
      <div class="box-title" style="display:flex;justify-content:space-between;align-items:center;">
        <span>📦 ${c.name}${c.ignoreBulk ? ' <span style="font-size:9px;color:var(--accent);font-weight:400;">(부피 미적용)</span>' : ''}</span>
        <span class="spell-del" onclick="removeContainer(${ci})" style="cursor:pointer;">✕</span>
      </div>`;
    // 헤더 (메인과 동일)
    html += `<div class="equip-row" style="font-size:10px;color:var(--text2);padding:2px 4px;border-bottom:1px solid var(--border);">
      <span style="flex:1;">아이템</span><span style="width:30px;text-align:center;">부피</span><span style="width:70px;text-align:center;">수량</span><span style="width:60px;"></span><span style="width:40px;"></span><span style="width:28px;"></span>
    </div>`;
    c.items.forEach((item, ii) => {
      const bulkDisplay = item.bulk === 'L' ? 'L' : (item.bulk || '—');
      const eqEscName = (item.name||'').replace(/'/g,"\\'");
      const eqType = item._type === 'weapon' ? 'weapon' : (item._type === 'armor' ? 'armor' : (item._type === 'shield' ? 'shield' : 'gear'));
      html += `<div class="equip-row">
        <span style="flex:1;font-size:12px;color:${item._broken?'var(--red-light)':'var(--text)'};cursor:pointer;" onclick="showInfo('${eqType}','${eqEscName}')">${item._broken?'파손된 ':''}${item.name}</span>
        <span style="width:30px;text-align:center;font-size:10px;color:var(--text2);">${bulkDisplay}</span>
        <span style="width:70px;display:flex;align-items:center;justify-content:center;gap:2px;">
          <button class="qty-btn" onclick="event.stopPropagation();changeContainerQty(${ci},${ii},-1)">−</button>
          <span style="min-width:16px;text-align:center;font-size:13px;font-weight:600;color:var(--text);">${item.qty||1}</span>
          <button class="qty-btn" onclick="event.stopPropagation();changeContainerQty(${ci},${ii},1)">+</button>
        </span>
        <span style="width:60px;"></span>
        <span style="width:40px;"></span>
        <span style="width:28px;text-align:center;">
          <span class="move-wrap"><select onchange="if(this.value!=='')moveFromContainer(${ci},${ii},this.value);this.value=''">
            <option value=""></option>
            <option value="main">메인</option>
            ${state.containers.map((cc,cci) => cci !== ci ? `<option value="${cci}">${cc.name}</option>` : '').join('')}
          </select></span>
        </span>
      </div>`;
    });
    html += `</div>`;
    el.innerHTML += html;
  });
}

// ── 제조법 (레시피) ──
function addFormula() {
  // 장비 DB 모달과 동일하게 열되, 획득/구매 대신 "제조법 기록" 버튼
  modalType = 'formula-pick';
  openEquipBrowse();
  // openEquipBrowse 호출 후 modalType을 덮어씀
  setTimeout(() => { modalType = 'formula-pick'; }, 50);
}

function recordFormula(name) {
  if (!name) return;
  if (!state.formulas) state.formulas = [];
  if (state.formulas.some(f => f.name === name)) {
    alert(name + ' 제조법은 이미 기록되어 있습니다.');
    return;
  }
  state.formulas.push({name, level: 1});
  renderFormulas();
  save();
  closeModal();
}

function addFormulaManual() {
  const name = prompt('제조법 이름 (아이템 이름):');
  if (!name) return;
  if (!state.formulas) state.formulas = [];
  if (!state.formulas.some(f => f.name === name)) {
    state.formulas.push({name, level:1});
    renderFormulas();
    save();
  }
}

function addFormulaByName(name, level) {
  if (!state.formulas) state.formulas = [];
  if (!state.formulas.some(f => f.name === name)) {
    state.formulas.push({name, level: level||1});
    renderFormulas();
    save();
  }
}

function removeFormula(i) {
  if (!state.formulas) return;
  state.formulas.splice(i, 1);
  renderFormulas();
  save();
}

// ── 언어 ──
const COMMON_LANGUAGES = ['공용어','드워프어','엘프어','노움어','고블린어','하플링어','요툰어','오크어'];
const UNCOMMON_LANGUAGES = ['아클로어','크토니안어','드라코닉어','천상어','페이어','콜로어','네크릴어','페트란어','사크브로스어','숲요정어'];

function getMaxLanguages() {
  const intMod = Math.max(0, getMod('int'));
  return 2 + intMod; // 공용어 + 혈통어 + INT 수정치
}

function addLanguage() {
  if (!state.languages) state.languages = [];
  const maxLangs = getMaxLanguages();
  const selected = state.languages;

  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('modal-title').textContent = `언어 선택 (${selected.length}/${maxLangs})`;
  const searchEl = document.getElementById('modal-search');
  if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; }
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) { confirmBtn.style.display = ''; confirmBtn.textContent = '완료'; }
  modalType = 'skill-multi'; // 완료 버튼으로 닫기 위해 skill-multi 사용
  modalSelected = null;

  const listEl = document.querySelector('.modal-list');
  if (listEl) listEl.style.display = '';
  const detail = document.getElementById('modal-detail');
  if (detail) detail.innerHTML = `<div class="modal-detail-empty">${maxLangs}개의 언어를 선택하세요.</div>`;

  renderLanguagePickList();
}

function renderLanguagePickList() {
  if (!state.languages) state.languages = [];
  const maxLangs = getMaxLanguages();
  const selected = state.languages;
  const isFull = selected.length >= maxLangs;
  const q = document.getElementById('modal-search')?.value?.toLowerCase() || '';
  const container = document.getElementById('modal-options');
  container.innerHTML = '';

  // 타이틀 갱신
  const titleEl = document.getElementById('modal-title');
  if (titleEl) titleEl.textContent = `언어 선택 (${selected.length}/${maxLangs})`;

  const addSection = (title, langs) => {
    const items = langs.filter(l => !q || l.toLowerCase().includes(q));
    if (items.length === 0) return;
    const header = document.createElement('div');
    header.className = 'opt-section-header';
    header.textContent = title;
    container.appendChild(header);
    items.forEach(l => {
      const isSelected = selected.includes(l);
      const row = document.createElement('div');
      row.className = 'opt-row' + (isSelected ? ' selected' : '');
      if (!isSelected && isFull) row.style.opacity = '0.4';
      row.innerHTML = `
        <div class="opt-row-icon">${isSelected ? '✓' : '🗣'}</div>
        <span class="opt-row-name">${l}</span>`;
      row.style.cursor = (isSelected || !isFull) ? 'pointer' : 'default';
      if (isSelected || !isFull) {
        row.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isSelected) {
            state.languages = state.languages.filter(x => x !== l);
          } else {
            state.languages.push(l);
          }
          renderLanguagePickList();
          renderGrowthPlan();
          save();
        });
      }
      container.appendChild(row);
    });
  };
  addSection('일반 언어', COMMON_LANGUAGES);
  addSection('비일반 언어', UNCOMMON_LANGUAGES);

  const searchEl = document.getElementById('modal-search');
  if (searchEl && !searchEl._langBound) {
    searchEl.addEventListener('input', renderLanguagePickList);
    searchEl._langBound = true;
  }
}

function removeLanguage(i) {
  if (!state.languages) return;
  state.languages.splice(i, 1);
  renderLanguages();
  save();
}

function renderLanguages() {
  if (!state.languages) state.languages = [];
  const html = state.languages.length === 0
    ? '<div style="font-size:10px;color:var(--text2);text-align:center;padding:4px;">언어를 추가하세요</div>'
    : state.languages.map((l, i) =>
      `<div style="display:flex;align-items:center;gap:4px;padding:2px 4px;font-size:12px;border-bottom:1px solid var(--border);">
        <span style="flex:1;color:var(--text);">${l}</span>
        <span class="spell-del" onclick="removeLanguage(${i})" style="cursor:pointer;">✕</span>
      </div>`).join('');
  ['language-list','language-list-mobile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  });
}

function renderFormulas() {
  const el = document.getElementById('formula-list');
  if (!el) return;
  if (!state.formulas) state.formulas = [];
  el.innerHTML = '';
  if (state.formulas.length === 0) {
    el.innerHTML = '<div style="font-size:10px;color:var(--text2);text-align:center;padding:6px 0;">제조법을 추가하세요</div>';
    return;
  }
  state.formulas.forEach((f, i) => {
    el.innerHTML += `<div style="display:flex;align-items:center;gap:4px;padding:3px 4px;border-bottom:1px solid var(--border);font-size:12px;">
      <span style="color:var(--accent);font-size:10px;">📜</span>
      <span style="flex:1;color:var(--text);">${f.name}</span>
      <span style="font-size:10px;color:var(--text2);">Lv ${f.level}</span>
      <span class="spell-del" onclick="removeFormula(${i})" style="cursor:pointer;width:20px;text-align:center;">✕</span>
    </div>`;
  });
}

function addSpell(rank) {
  const name = prompt(`${rank===0?'캔트립':'주문'} 이름:`);
  if (!name) return;
  const target = rank===0 ? state.spells.cantrip : state.spells.known;
  target.push({name, rank});
  renderSpells();
  save();
}

function addFocusSpell() {
  const name = prompt('집중 주문 이름:');
  if (!name) return;
  state.spells.focus.push({name});
  renderSpells();
  save();
}

// ── Spell slot pending for modal pick ──
let _spellSlotPending = null;

function getActionIcons(actions) {
  if (!actions) return '';
  const map = {'1':'◆','2':'◆◆','3':'◆◆◆','reaction':'↩','free':'⟡'};
  return map[String(actions)] || actions;
}

function switchSpellSubtab(tab) {
  ['class','focus','innate','ritual'].forEach(t => {
    const tabEl = document.getElementById('spell-subtab-'+t);
    const contentEl = document.getElementById('spell-content-'+t);
    if (tabEl) tabEl.classList.toggle('active', tab===t);
    if (contentEl) contentEl.style.display = tab===t ? '' : 'none';
  });
}


function updateSpellTemlBadges() {
  if (typeof syncAllProfRanks === 'function') syncAllProfRanks();
}

function setSpellProf(rank) {
  const el = document.getElementById('prof-spatk');
  if (!el) return;
  const cur = parseInt(el.value||0);
  // If clicking same rank, toggle down to previous; otherwise set to clicked rank
  el.value = String(cur === rank ? Math.max(0, rank - 2) : rank);
  recalcSpellStats();
  save();
  updateSpellTemlBadges();
}

function updateSpellBreakdown() {
  const keyAttr = getClassKeyAttr();
  const keyMod = getMod(keyAttr);
  const prof = getProfBonus('prof-spatk');
  const attrLabels = {str:'Str',dex:'Dex',con:'Con',int:'Int',wis:'Wis',cha:'Cha'};
  const el1 = document.getElementById('spell-key-label');
  const el2 = document.getElementById('spell-key-val');
  const el3 = document.getElementById('spell-prof-val');
  if (el1) el1.textContent = attrLabels[keyAttr] || 'Key';
  if (el2) el2.textContent = keyMod;
  if (el3) el3.textContent = prof;
}

function pickSpellForSlot(type, rank, slotIndex) {
  _spellSlotPending = {type, rank, slotIndex};
  openModal('spell', type === 'cantrip' ? 'cantrip' : 'known');
}

function renderSpells() {
  const lv = getLevel() || 1;
  const maxRank = Math.min(10, Math.ceil(lv / 2)) || 1;
  const heightenedLevel = Math.max(1, Math.ceil(lv / 2)) || 1;

  // ── 선천적 주문 렌더링 (가장 먼저 — 다른 에러에 영향받지 않도록) ──
  try {
    const innateList = document.getElementById('spells-innate');
    const innateTab = document.getElementById('spell-subtab-innate');
    const innateArr = state.spells?.innate || [];
    if (innateTab) innateTab.style.display = innateArr.length > 0 ? '' : 'none';
    if (innateList) {
      innateList.innerHTML = '';
      if (!state.innateSpellsUsed) state.innateSpellsUsed = {};
      innateArr.forEach((s, i) => {
        const spellData = (typeof SPELL_DB !== 'undefined') ? SPELL_DB.find(sp => sp.name_ko === s.name) : null;
        const actions = getActionIcons(spellData?.actions);
        const isCantrip = s.type === 'cantrip';
        const rankLabel = isCantrip ? `[캔트립 ${heightenedLevel}랭크]` : (s.rank ? `[${s.rank}랭크]` : '');
        const usesLabel = s.uses === '자유' ? '자유 시전' : s.uses || '';
        // 사용 횟수 체크 (자유 시전이 아닌 경우)
        const maxUses = s.uses === '자유' ? 0 : parseInt((s.uses||'').match(/\d+/)?.[0]) || 1;
        const used = state.innateSpellsUsed[i] || 0;
        let usesHtml = '';
        if (maxUses > 0) {
          let checks = '';
          for (let u = 0; u < maxUses; u++) {
            const isUsed = u < used;
            checks += `<span class="spell-slot-fire${isUsed?' used':''}" onclick="toggleInnateUse(${i},${u},${maxUses})" style="cursor:pointer;font-size:14px;margin:0 1px;">🔥</span>`;
          }
          usesHtml = `<span style="margin-left:6px;">${checks}</span>`;
        }
        const row = document.createElement('div');
        row.className = 'spell-slot-row';
        row.style.cssText = 'border-left:3px solid var(--accent);background:rgba(100,160,255,0.06);';
        const srcName = s._source ? s._source.split(' (')[0].trim() : '';
        row.innerHTML = `
          <span class="spell-slot-name" onclick="showInfo('spell','${(s.name||'').replace(/'/g,"\\'")}')">${s.name}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}</span>
          <span style="font-size:10px;color:var(--accent);margin-left:4px;">${rankLabel}</span>
          ${usesHtml}
          <span style="font-size:10px;color:var(--text2);margin-left:auto;">${s.tradition || ''} · ${usesLabel}</span>
          ${srcName ? `<span style="font-size:9px;color:var(--accent);margin-left:4px;">${srcName}</span>` : ''}`;
        innateList.appendChild(row);
      });
      if (innateArr.length === 0) {
        innateList.innerHTML = '<div style="padding:12px;text-align:center;color:var(--text2);font-size:12px;">선천적 주문이 없습니다.</div>';
      }
    }
  } catch(e) { console.warn('innate render error:', e); }

  // Update sub-tab label with class name
  const subtabClass = document.getElementById('spell-subtab-class');
  if (subtabClass) {
    subtabClass.textContent = state.selectedClass ? state.selectedClass.name : '주문';
  }

  // Update TEML badges
  updateSpellTemlBadges();
  // Update breakdown
  updateSpellBreakdown();

  // ── "주문 기억" 버튼 표시/숨김 ──
  const isPrepared = state.selectedClass?.casting === 'prepared';
  const isPreparedCaster = isPrepared && (typeof CLASS_SPELL_TABLE !== 'undefined') && CLASS_SPELL_TABLE[state.selectedClass?.id];
  const isSpontaneous = state.selectedClass?.casting === 'spontaneous';
  const memBtn = document.getElementById('btn-memorize-spells');
  if (memBtn) memBtn.style.display = isPrepared ? '' : 'none';

  // ── Cantrips ──
  const cantripHeader = document.getElementById('cantrip-header');
  if (cantripHeader) cantripHeader.textContent = `캔트립 (강화 랭크 ${heightenedLevel})`;

  const cantripSlots = state.cantripSlots || 5;
  const cantripEl = document.getElementById('spells-cantrip');
  if (cantripEl) {
    cantripEl.innerHTML = '';

    if (isPreparedCaster) {
      // ═══ PREPARED: 준비된 캔트립 표시 ═══
      const prep = state.preparedSpells?.cantrip || [];
      for (let i = 0; i < cantripSlots; i++) {
        const name = prep[i] || null;
        const row = document.createElement('div');
        row.className = 'spell-slot-row';
        if (name) {
          const spellData = (typeof SPELL_DB !== 'undefined') ? SPELL_DB.find(sp => sp.name_ko === name) : null;
          const actions = getActionIcons(spellData?.actions);
          row.innerHTML = `
            <span class="spell-slot-name" onclick="showInfo('spell','${name.replace(/'/g,"\\'")}')">${name}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}</span>
            <span class="spell-slot-del" onclick="unprepareSlot(0,${i})" title="준비 해제">✕</span>`;
        } else {
          row.innerHTML = `<span class="spell-slot-name empty" onclick="openPrepareSpellForSlot(0,${i})">준비 안 됨</span><span style="width:20px;"></span>`;
        }
        cantripEl.appendChild(row);
      }
    } else {
      // ═══ SPONTANEOUS / FALLBACK ═══
      const totalCantrips = Math.max(cantripSlots, (state.spells.cantrip||[]).length);
      for (let i = 0; i < totalCantrips; i++) {
        const spell = state.spells.cantrip[i] || null;
        const isAuto = spell?._auto;
        const row = document.createElement('div');
        row.className = 'spell-slot-row';
        if (isAuto) row.style.cssText = 'border-left:3px solid var(--accent);background:rgba(100,160,255,0.06);';
        if (spell) {
          const spellData = (typeof SPELL_DB !== 'undefined') ? SPELL_DB.find(sp => sp.name_ko === spell.name) : null;
          const actions = getActionIcons(spellData?.actions);
          const srcLabel = isAuto && spell._source ? `<span style="font-size:9px;color:var(--accent);margin-left:auto;">${spell._source}</span>` : '';
          row.innerHTML = `
            <span class="spell-slot-name" onclick="showInfo('spell','${spell.name.replace(/'/g,"\\'")}')">${spell.name}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}</span>
            ${srcLabel}
            ${isAuto ? '<span style="width:20px;"></span>' : `<span class="spell-slot-del" onclick="removeSpellFromSlot('cantrip',${i})">✕</span>`}`;
        } else if (i < cantripSlots) {
          row.innerHTML = `
            <span class="spell-slot-name empty" onclick="pickSpellForSlot('cantrip',0,${i})">선택 안 됨</span>
            <span class="spell-slot-dur"></span><span class="spell-slot-range"></span><span style="width:20px;"></span>`;
        }
        if (spell || i < cantripSlots) cantripEl.appendChild(row);
      }
    }
  }

  // ── Focus spells ──
  // 집중 캔트립과 집중 주문 분리 렌더링 (SPELL_DB의 is_cantrip 기반)
  const focusCantrips = (state.spells.focus || []).filter(s => {
    if (!s) return false;
    const spData = (typeof SPELL_DB !== 'undefined') ? SPELL_DB.find(sp => sp.name_ko === s.name) : null;
    return spData ? spData.is_cantrip : (s.name || '').includes('캔트립');
  });
  const focusRegular = (state.spells.focus || []).filter(s => s && !focusCantrips.includes(s));
  renderSpellSlotList('spells-focus-cantrips', focusCantrips, 'focus', heightenedLevel);
  renderSpellSlotList('spells-focus', focusRegular, 'focus', heightenedLevel);

  // 집중 포인트 자동 계산: min(집중 주문 수, 3)
  const totalFocusSpells = (state.spells.focus || []).length;
  const fpMax = Math.min(3, Math.max(1, totalFocusSpells));
  const fpMaxEl = document.getElementById('fp-max');
  const fpCurEl = document.getElementById('fp-cur');
  if (fpMaxEl && totalFocusSpells > 0) {
    const oldMax = parseInt(fpMaxEl.value || 0);
    fpMaxEl.value = fpMax;
    // 최대치가 늘어나면 현재도 따라 늘림
    if (fpCurEl && (parseInt(fpCurEl.value || 0) === oldMax || oldMax === 0)) {
      fpCurEl.value = fpMax;
    }
  } else if (fpMaxEl && totalFocusSpells === 0) {
    fpMaxEl.value = 0;
    if (fpCurEl) fpCurEl.value = 0;
  }
  if (typeof renderFpChecks === 'function') renderFpChecks();

  // ── Divine Font (Cleric) ──
  const dfSection = document.getElementById('spell-divine-font-section');
  const dfBody = document.getElementById('divine-font-body');
  if (dfSection && dfBody) {
    if (state.divineFont && state.selectedClass?.id === 'cleric') {
      dfSection.style.display = '';
      const isHeal = state.divineFont === 'heal';
      const spellName = isHeal ? '치유 (Heal)' : '해로움 (Harm)';
      const totalSlots = getDivineFontSlots();
      const used = Math.min(state.divineFontUsed || 0, totalSlots);
      document.getElementById('divine-font-label').textContent = isHeal ? 'Divine Font — Heal' : 'Divine Font — Harm';
      let fires = '';
      for (let i = 0; i < totalSlots; i++) {
        const isUsed = i < used;
        fires += `<span class="spell-slot-fire${isUsed?' used':''}" style="cursor:pointer;font-size:16px;" onclick="toggleDivineFontSlot(${i})">\uD83D\uDD25</span>`;
      }
      dfBody.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="font-size:20px;">${isHeal?'💚':'💀'}</span>
          <span style="font-size:14px;font-weight:600;color:var(--accent);cursor:pointer;text-decoration:underline;" onclick="showInfo('spell','${isHeal?'치유':'해로움'}')">${spellName}</span>
          <span style="font-size:11px;color:var(--text2);margin-left:auto;">${used}/${totalSlots} 사용</span>
        </div>
        <div style="display:flex;gap:2px;flex-wrap:wrap;">${fires}</div>
        <div style="font-size:10px;color:var(--text2);margin-top:4px;">일반 주문 슬롯과 별도로 관리됩니다. 🔥을 클릭하여 사용/미사용 전환</div>`;
    } else {
      dfSection.style.display = 'none';
    }
  }

  // ── Known spells grouped by rank ──
  const ranksContainer = document.getElementById('spell-ranks-container');
  if (!ranksContainer) return;
  ranksContainer.innerHTML = '';

  for (let r = 1; r <= maxRank; r++) {
    const slotMax = parseInt(state.spellSlots?.[r] || 0);
    // 이 랭크의 모든 known 주문 (auto + growth + 재주 부여 등)
    const allAtRank = state.spells.known.filter(s => s.rank === r);

    // spontaneous: 주문이나 슬롯이 하나도 없으면 섹션 스킵
    if (isSpontaneous && allAtRank.length === 0 && slotMax === 0) continue;
    // prepared: 슬롯 없으면 스킵
    if (isPreparedCaster && slotMax === 0) continue;

    const section = document.createElement('div');
    section.className = 'spell-rank-section';

    // ── Rank header ──
    const header = document.createElement('div');
    header.className = 'spell-rank-header';
    if (isSpontaneous || isPreparedCaster) {
      header.innerHTML = `${r}랭크 주문
        <span style="float:right;font-size:11px;color:var(--text2);">슬롯 ${slotMax}개</span>`;
    } else {
      header.innerHTML = `주문 랭크 ${r}
        <span style="float:right;font-size:11px;color:var(--text2);">
          슬롯: <input class="inline-edit" type="number" value="${slotMax}" min="0" max="10"
            style="width:28px;font-size:11px;" oninput="state.spellSlots=state.spellSlots||{};state.spellSlots[${r}]=parseInt(this.value);renderSpells();save()">
        </span>`;
    }
    section.appendChild(header);

    // ── Fire icons for slot usage (prepared caster는 개별 주문에 🔥 표시) ──
    if (slotMax > 0 && !isPreparedCaster) {
      const firesDiv = document.createElement('div');
      firesDiv.className = 'spell-slots-used';
      firesDiv.innerHTML = '<span style="font-size:10px;color:var(--text2);margin-right:4px;">슬롯:</span>';
      const usedCount = getSpellSlotUsedCount(r, slotMax);
      for (let c = 0; c < slotMax; c++) {
        const isUsed = c < usedCount;
        const fire = document.createElement('span');
        fire.className = 'spell-slot-fire' + (isUsed ? ' used' : '');
        fire.textContent = '\uD83D\uDD25';
        fire.style.cursor = 'pointer';
        fire.onclick = (function(rank, idx) {
          return function() { toggleSpellSlotStar(rank, idx); };
        })(r, c);
        firesDiv.appendChild(fire);
      }
      section.appendChild(firesDiv);
    }

    if (isSpontaneous) {
      // ═══ SPONTANEOUS: 레퍼토리 나열 방식 ═══

      // 시그니처 주문 고양: 낮은 랭크의 시그니처 주문을 이 랭크에도 표시
      const sigHeightened = [];
      const sigs = state.signatureSpells || {};
      for (let sr = 1; sr < r; sr++) {
        const sigName = sigs[sr];
        if (!sigName) continue;
        // 이미 이 랭크에 같은 이름으로 배운 게 없을 때만
        if (!allAtRank.some(s => s.name === sigName)) {
          sigHeightened.push({name: sigName, originalRank: sr});
        }
      }

      if (allAtRank.length === 0 && sigHeightened.length === 0) {
        const emptyRow = document.createElement('div');
        emptyRow.className = 'spell-slot-row';
        emptyRow.style.opacity = '0.5';
        emptyRow.innerHTML = '<span class="spell-slot-name" style="color:var(--text2);font-size:12px;">빌더에서 주문을 선택하세요</span>';
        section.appendChild(emptyRow);
      }

      // 정식으로 배운 주문
      allAtRank.forEach(spell => {
        const spellData = (typeof SPELL_DB !== 'undefined') ? SPELL_DB.find(sp => sp.name_ko === spell.name) : null;
        const actions = getActionIcons(spellData?.actions);
        const isAuto = spell._auto;
        const isSig = sigs[r] === spell.name;
        const row = document.createElement('div');
        row.className = 'spell-slot-row';
        if (isAuto) row.style.cssText = 'border-left:3px solid var(--accent);background:rgba(100,160,255,0.06);';

        let badges = '';
        if (isSig) badges += '<span style="font-size:9px;color:var(--accent);margin-right:4px;">★ 시그니처</span>';
        if (isAuto) {
          const srcName = spell._source ? spell._source.split(' (')[0].trim() : '클래스 부여';
          badges += `<span style="font-size:9px;color:var(--accent);margin-left:auto;">${srcName}</span>`;
        }
        const srcFeat = spell._sourceFeat ? `<span style="font-size:9px;color:var(--accent);margin-left:auto;">${spell._sourceFeat.split(' (')[0]}</span>` : '';

        row.innerHTML = `
          <span class="spell-slot-name" onclick="showInfo('spell','${(spell.name||'').replace(/'/g,"\\'")}')">${spell.name}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}</span>
          ${badges}${srcFeat}`;
        section.appendChild(row);
      });

      // 시그니처 고양 주문 (낮은 랭크에서 올라온 것)
      sigHeightened.forEach(sig => {
        const spellData = (typeof SPELL_DB !== 'undefined') ? SPELL_DB.find(sp => sp.name_ko === sig.name) : null;
        const actions = getActionIcons(spellData?.actions);
        const row = document.createElement('div');
        row.className = 'spell-slot-row';
        row.style.cssText = 'border-left:3px solid var(--accent);background:rgba(212,175,55,0.08);';
        row.innerHTML = `
          <span class="spell-slot-name" onclick="showInfo('spell','${(sig.name||'').replace(/'/g,"\\'")}')">${sig.name}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}</span>
          <span style="font-size:9px;color:var(--accent);margin-left:auto;">★ ${sig.originalRank}랭크에서 고양</span>`;
        section.appendChild(row);
      });
    } else if (isPreparedCaster) {
      // ═══ PREPARED CASTER: 준비된 주문 + 🔥 시전 토글 ═══
      const prep = state.preparedSpells?.[r] || [];
      for (let i = 0; i < slotMax; i++) {
        const name = prep[i] || null;
        const isCast = !!(state.spellSlotsUsed?.[r]?.[i]);
        const row = document.createElement('div');
        row.className = 'spell-slot-row';
        if (isCast) row.style.opacity = '0.35';
        if (name) {
          const spellData = (typeof SPELL_DB !== 'undefined') ? SPELL_DB.find(sp => sp.name_ko === name) : null;
          const actions = getActionIcons(spellData?.actions);
          const fireIcon = `<span class="spell-slot-fire${isCast?' used':''}" onclick="togglePreparedCast(${r},${i})" style="cursor:pointer;font-size:14px;margin-right:4px;" title="${isCast?'슬롯 복원':'시전 (소모)'}">\uD83D\uDD25</span>`;
          row.innerHTML = `
            ${fireIcon}<span class="spell-slot-name" onclick="showInfo('spell','${name.replace(/'/g,"\\'")}')">${name}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}${isCast ? ' <span style="font-size:9px;color:var(--text2);">(시전됨)</span>' : ''}</span>`;
        } else {
          row.innerHTML = `<span style="font-size:14px;margin-right:4px;opacity:0.2;">🔥</span><span class="spell-slot-name" style="color:var(--text2);font-size:12px;">준비 안 됨</span>`;
        }
        section.appendChild(row);
      }
    } else {
      // ═══ LEGACY FALLBACK: 기존 슬롯 방식 ═══
      const spellsAtRank = allAtRank.filter(s => !s._auto);
      const autoAtRank = allAtRank.filter(s => s._auto);

      // Column headers
      const colHeader = document.createElement('div');
      colHeader.className = 'spell-slot-col-header';
      colHeader.innerHTML = `
        <span style="width:40px;text-align:center;">시전</span>
        <span style="flex:1;">주문</span>
        <span style="width:70px;text-align:center;">지속</span>
        <span style="width:70px;text-align:center;">사거리</span>
        <span style="width:20px;"></span>`;
      section.appendChild(colHeader);

      const totalSlots = Math.max(slotMax, spellsAtRank.length);
      for (let i = 0; i < totalSlots; i++) {
        const spell = spellsAtRank[i] || null;
        const row = document.createElement('div');
        const isCast = !!(state.spellSlotsUsed?.[r]?.[i]);
        row.className = 'spell-slot-row' + (isCast ? ' slot-used' : '');
        if (spell) {
          const globalIdx = state.spells.known.indexOf(spell);
          const spellData = (typeof SPELL_DB !== 'undefined') ? SPELL_DB.find(sp => sp.name_ko === spell.name) : null;
          const actions = getActionIcons(spellData?.actions);
          row.innerHTML = `
            <span class="spell-cast-label${isCast?' cast-used':''}" onclick="toggleSpellCast(${r},${i})">Cast</span>
            <span class="spell-slot-name" onclick="showInfo('spell','${spell.name.replace(/'/g,"\\'")}')">${spell.name}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}</span>
            <span class="spell-slot-dur">\u2014</span>
            <span class="spell-slot-range">\u2014</span>
            <span class="spell-slot-del" onclick="removeSpell('known',${globalIdx})">✕</span>`;
        } else {
          row.innerHTML = `
            <span class="spell-cast-label">Cast</span>
            <span class="spell-slot-name empty" onclick="pickSpellForSlot('known',${r},${i})">선택 안 됨</span>
            <span class="spell-slot-dur"></span>
            <span class="spell-slot-range"></span>
            <span style="width:20px;"></span>`;
        }
        section.appendChild(row);
      }
      // _auto 주문
      autoAtRank.forEach(spell => {
        const spellData = (typeof SPELL_DB !== 'undefined') ? SPELL_DB.find(sp => sp.name_ko === spell.name) : null;
        const actions = getActionIcons(spellData?.actions);
        const row = document.createElement('div');
        row.className = 'spell-slot-row';
        row.style.cssText = 'border-left:3px solid var(--accent);background:rgba(100,160,255,0.06);';
        const srcName = spell._source ? spell._source.split(' (')[0].trim() : '';
        row.innerHTML = `
          <span class="spell-slot-name" onclick="showInfo('spell','${(spell.name||'').replace(/'/g,"\\'")}')">${spell.name}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}</span>
          <span style="font-size:9px;color:var(--accent);margin-left:auto;">${srcName || '클래스 부여'}</span>`;
        section.appendChild(row);
      });
    }

    ranksContainer.appendChild(section);
  }

}

function toggleSpellCast(rank, slotIdx) {
  state.spellSlotsUsed = state.spellSlotsUsed || {};
  state.spellSlotsUsed[rank] = state.spellSlotsUsed[rank] || {};
  state.spellSlotsUsed[rank][slotIdx] = !state.spellSlotsUsed[rank][slotIdx];
  renderSpells();
  save();
}

// Star-rating style for spell slot fires
function getSpellSlotUsedCount(rank, max) {
  if (!state.spellSlotsUsed?.[rank]) return 0;
  let count = 0;
  for (let i = 0; i < max; i++) { if (state.spellSlotsUsed[rank][i]) count++; else break; }
  return count;
}
function toggleSpellSlotStar(rank, idx) {
  state.spellSlotsUsed = state.spellSlotsUsed || {};
  state.spellSlotsUsed[rank] = state.spellSlotsUsed[rank] || {};
  const curUsed = getSpellSlotUsedCount(rank, 20);
  let newUsed;
  if (idx < curUsed) { newUsed = idx; } // click filled: unfill from this point
  else { newUsed = idx + 1; }            // click empty: fill up to this
  // Set progressive flags
  for (let i = 0; i < 20; i++) state.spellSlotsUsed[rank][i] = i < newUsed;
  renderSpells();
  save();
}

function toggleInnateUse(idx, clickedSlot, max) {
  if (!state.innateSpellsUsed) state.innateSpellsUsed = {};
  const cur = state.innateSpellsUsed[idx] || 0;
  // 클릭한 슬롯 이하면 사용, 초과면 해제
  state.innateSpellsUsed[idx] = clickedSlot < cur ? clickedSlot : Math.min(clickedSlot + 1, max);
  renderSpells();
  save();
}

function removeSpellFromSlot(type, index) {
  if (type === 'cantrip') {
    state.spells.cantrip.splice(index, 1);
  }
  renderSpells();
  save();
}

function renderSpellSlotList(elId, arr, type, heightenedLevel) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = '';
  arr.forEach((s, i) => {
    const isAuto = s?._auto;
    const spellData = (typeof SPELL_DB !== 'undefined') ? SPELL_DB.find(sp => sp.name_ko === s.name) : null;
    const actions = getActionIcons(spellData?.actions);
    // 집중 주문 랭크 표시: 캔트립은 heightenedLevel로, 일반 집중주문도 heightenedLevel
    let rankLabel = '';
    if (type === 'focus' && heightenedLevel) {
      const isCantrip = spellData ? spellData.is_cantrip : false;
      const baseRank = spellData?.rank || 1;
      const effectiveRank = isCantrip ? heightenedLevel : Math.max(baseRank, heightenedLevel);
      rankLabel = `<span style="font-size:10px;color:var(--accent);margin-left:4px;">[${effectiveRank}랭크]</span>`;
    }
    const row = document.createElement('div');
    row.className = 'spell-slot-row';
    if (isAuto) row.style.cssText = 'border-left:3px solid var(--accent);background:rgba(100,160,255,0.06);';
    const srcLabel = isAuto && s._source ? `<span style="font-size:9px;color:var(--accent);margin-left:auto;">${s._source}</span>` : '';
    row.innerHTML = `
      <span class="spell-slot-name" onclick="showInfo('spell','${s.name.replace(/'/g,"\\'")}')">${s.name}${rankLabel}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}</span>
      ${srcLabel}
      ${isAuto ? '<span style="width:20px;"></span>' : `<span class="spell-slot-del" onclick="removeSpell('${type}',${i})">✕</span>`}`;
    el.appendChild(row);
  });
}

function renderSpellSlotChecks(parentEl, rank) {
  renderSpells();
}

function togglePreparedCast(rank, slotIdx) {
  state.spellSlotsUsed = state.spellSlotsUsed || {};
  state.spellSlotsUsed[rank] = state.spellSlotsUsed[rank] || {};
  state.spellSlotsUsed[rank][slotIdx] = !state.spellSlotsUsed[rank][slotIdx];
  renderSpells();
  save();
}

function removeSpell(type, i) {
  state.spells[type].splice(i,1);
  renderSpells();
  save();
}

function addFeat(type) {
  const name = prompt('재주/능력 이름:');
  if (!name) return;
  // DB에서 영문명 매칭
  let fullName = name;
  if (typeof FEAT_DB !== 'undefined' && !name.includes('(')) {
    const found = FEAT_DB.find(f => f && f.name_ko === name.trim());
    if (found?.name_en) fullName = `${found.name_ko} (${found.name_en})`;
  }
  state.feats[type].push({name: fullName, level:getLevel()});
  // 선택이 필요한 재주면 선택 모달 열기
  if (typeof checkFeatChoice === 'function' && checkFeatChoice(fullName, type, state.feats[type].length - 1)) {
    recalcAll();
    renderFeats();
    save();
    return;
  }
  recalcAll();
  renderFeats();
  save();
}

function renderFeats() {
  // 유산 표시 — 아코디언
  const herDisplay = document.getElementById('heritage-display');
  if (herDisplay) {
    if (state.selectedHeritage) {
      const h = state.selectedHeritage;
      const div = document.createElement('div');
      div.className = 'feat-entry';
      div.style.cursor = 'pointer';
      const desc = h.summary || h.desc || '';
      const hAncestry = h.ancestry === '*' ? '다목적 유산' : h.ancestry || '';
      div.innerHTML = `
        <div style="display:flex;align-items:center;gap:4px;width:100%;margin-bottom:2px;">
          <span style="flex:1;color:var(--text);font-size:12px;">${h.name_ko} (${h.name_en||''})</span>
        </div>
        <div class="feat-src"><span class="tag-meta">유산</span> <span class="tag-meta">${hAncestry}</span></div>
        <div class="feat-detail">
          <div style="line-height:1.6;">${typeof formatDescActions==='function'?formatDescActions(desc,h):desc}</div>
        </div>`;
      div.addEventListener('click', () => _toggleFeatAccordion(div));
      herDisplay.innerHTML = '';
      herDisplay.appendChild(div);
    } else {
      herDisplay.innerHTML = '<div style="font-size:11px;color:var(--text2);padding:6px 0;">코어 탭에서 유산을 선택하세요</div>';
    }
  }

  const types = ['special','ancestry','class','general','skill','archetype','other'];
  const labels = {'special':'클래스 특성','ancestry':'혈통','class':'클래스','general':'일반','skill':'기술','archetype':'원형','other':'기타'};
  types.forEach(t => {
    const el = document.getElementById('feats-'+t);
    if (!el) return;
    el.innerHTML = '';
    state.feats[t].forEach((f,i) => {
      const isAuto = f._auto;
      const div = document.createElement('div');
      div.className = 'feat-entry';
      div.style.cursor = 'pointer';
      const choiceBadge = f.choice && typeof _getChoiceDisplayName === 'function' ? _getChoiceDisplayName(f) : '';
      const srcLabel = isAuto ? `Lv ${f.level||1} — 클래스 특성` : `Lv ${f.level||1}`;
      // DB에서 설명 가져오기
      const featData = (typeof FEAT_DB !== 'undefined') ? FEAT_DB.find(fd => fd && fd.name_ko === f.name.split(' (')[0].trim()) : null;
      const desc = featData?.desc || featData?.summary || '';
      // 아코디언 내 메타 + 특성 뱃지
      const catLabels = {ancestry:'혈통',class:'클래스',general:'일반',skill:'기술',archetype:'원형',special:'클래스 특성',other:'기타'};
      const fTraits = (featData?.traits||[]).map(t2 => typeof traitTag==='function' ? traitTag(t2) : `<span class="tag">${t2}</span>`).join(' ');
      const fMeta = `<span class="tag-meta">${featData?.feat_level||f.level||1}레벨</span> <span class="tag-meta">${catLabels[featData?.category]||catLabels[t]||t}</span>`;
      let fPrereq = '';
      if (featData?.prerequisites) {
        const prParts = featData.prerequisites.split(/(?<=\.)\s+/);
        fPrereq = `<div style="margin-top:4px;"><b style="color:var(--accent);">선행:</b> ${prParts[0].replace(/\.$/,'')}</div>`;
      }
      const choiceUI = _buildFeatChoiceUI(f, t, i);
      const hasIssue = typeof _hasFeatChoiceIssue === 'function' && _hasFeatChoiceIssue(f);
      const redDot = hasIssue ? '<span style="font-size:11px;color:#f44336;flex-shrink:0;line-height:1;" title="선택 필요">⚠</span>' : '';
      div.innerHTML = `
        <div style="display:flex;align-items:center;gap:4px;width:100%;margin-bottom:2px;">
          <span style="flex:1;color:var(--text);font-size:12px;">${f.name || labels[t] + ' 재주'}</span>
          ${choiceBadge ? `<span style="font-size:10px;color:var(--accent);flex-shrink:0;">[${choiceBadge}]</span>` : ''}
          ${redDot}
        </div>
        <div class="feat-src"><span style="color:var(--text2);font-size:10px;">${fMeta}</span></div>
        ${fTraits ? `<div class="feat-traits-row">${fTraits}</div>` : ''}
        <div class="feat-detail">
          ${fPrereq}
          <div style="line-height:1.6;">${typeof formatDescActions==='function'?formatDescActions(desc,featData):desc}</div>
          ${typeof _buildFeatActionCard==='function'?_buildFeatActionCard(featData):''}
          ${choiceUI}
        </div>`;
      div.addEventListener('click', (e) => {
        if (e.target.closest('.feat-choice-ctrl')) return;
        _toggleFeatAccordion(div);
      });
      el.appendChild(div);
    });
  });
}

function _toggleFeatAccordion(div) {
  // 다른 열린 아코디언 닫기
  div.parentElement?.querySelectorAll('.feat-entry.expanded').forEach(el => {
    if (el !== div) el.classList.remove('expanded');
  });
  div.classList.toggle('expanded');
}

function cascadeRemoveFeats() {
  if (typeof FEAT_DB === 'undefined') return;
  // _checkPrereqs는 cs_modal.js에 정의 — state.feats 현재 상태 기반으로 판정
  let changed = true;
  while (changed) {
    changed = false;
    for (const type of Object.keys(state.feats)) {
      const arr = state.feats[type];
      if (!Array.isArray(arr)) continue;
      for (let j = arr.length - 1; j >= 0; j--) {
        const f = arr[j];
        if (!f?.name) continue;
        const fNameKo = f.name.split(' (')[0].trim();
        const fData = FEAT_DB.find(fd => fd && fd.name_ko === fNameKo);
        if (fData?.prerequisites && !_checkPrereqs(fData.prerequisites)) {
          if (state.spells?.innate) state.spells.innate = state.spells.innate.filter(s => s._sourceFeat !== f.name);
          // 성장에서도 제거
          for (const lv of Object.keys(state.growth || {})) {
            for (const k of Object.keys(state.growth[lv] || {})) {
              if (state.growth[lv][k] === f.name) delete state.growth[lv][k];
            }
          }
          arr.splice(j, 1);
          changed = true;
        }
      }
    }
  }
  // grant_feat / feat_pick으로 부여된 재주 연쇄 정리 (A→B→C 재귀)
  let grantChanged = true;
  while (grantChanged) {
    grantChanged = false;
    const allFeatNames = new Set();
    for (const arr of Object.values(state.feats)) {
      if (Array.isArray(arr)) arr.forEach(f => { if (f?.name) allFeatNames.add(f.name); });
    }
    for (const type of Object.keys(state.feats)) {
      const arr = state.feats[type];
      if (!Array.isArray(arr)) continue;
      for (let j = arr.length - 1; j >= 0; j--) {
        if (arr[j]?._grantedBy && !allFeatNames.has(arr[j]._grantedBy)) {
          // 선천 주문도 함께 제거
          if (arr[j].name && state.spells?.innate) {
            state.spells.innate = state.spells.innate.filter(s => s._sourceFeat !== arr[j].name);
          }
          // 성장에서도 제거
          for (const lv of Object.keys(state.growth || {})) {
            for (const k of Object.keys(state.growth[lv] || {})) {
              if (state.growth[lv][k] === arr[j].name) delete state.growth[lv][k];
            }
          }
          arr.splice(j, 1);
          grantChanged = true;
        }
      }
    }
  }
  // 선천 주문 최종 정리
  if (state.spells?.innate) {
    const allNames2 = new Set();
    for (const arr of Object.values(state.feats)) {
      if (Array.isArray(arr)) arr.forEach(f => { if (f?.name) allNames2.add(f.name); });
    }
    state.spells.innate = state.spells.innate.filter(s => !s._sourceFeat || allNames2.has(s._sourceFeat));
  }
}

function removeFeat(t, i) {
  const feat = state.feats[t][i];
  const featName = feat?.name?.split(' (')[0].trim() || '';
  // 재주로 얻은 선천 주문 + 집중 주문 제거
  if (feat?.name) {
    if (state.spells?.innate) state.spells.innate = state.spells.innate.filter(s => s._sourceFeat !== feat.name);
    if (state.spells?.focus) state.spells.focus = state.spells.focus.filter(s => s._sourceFeat !== feat.name);
  }
  // 재주로 부여된 무기 제거 (grant_weapon)
  if (feat?.name) {
    const _fEN = (typeof _extractEnName === 'function') ? _extractEnName(feat.name) : '';
    if (_fEN) {
      state.weapons = state.weapons.filter(w => w._fromFeat !== _fEN);
    }
  }
  // 재주로 부여된 지식/기술 숙련 정리
  if (feat?.name && typeof FEAT_EFFECTS !== 'undefined') {
    const nameEn = (typeof _extractEnName === 'function') ? _extractEnName(feat.name) : '';
    const def = nameEn ? FEAT_EFFECTS[nameEn] : null;
    if (def?.effects) {
      def.effects.forEach(eff => {
        // grant_lore: 고정 이름 또는 $choice
        if (eff.type === 'grant_lore') {
          const loreName = (eff.name === '$choice') ? feat.choice : eff.name;
          if (loreName) {
            ['lore1','lore2'].forEach(sid => {
              const el = document.getElementById('lore-name-'+sid);
              const profEl = document.getElementById('sk-prof-'+sid);
              if (el && el.value === loreName) { el.value = ''; if (profEl) profEl.value = '0'; }
            });
          }
        }
        // skill_trained: 고정 skill ID 또는 $choice
        if (eff.type === 'skill_trained') {
          const skillId = (eff.skill === '$choice') ? feat.choice : eff.skill;
          if (skillId) {
            const ids = skillId.includes(',') ? skillId.split(',') : [skillId];
            ids.forEach(sid => {
              const s = sid.trim();
              if (!s) return;
              const profEl = document.getElementById('sk-prof-' + s);
              if (profEl && parseInt(profEl.value || 0) === 2) profEl.value = '0';
            });
          }
        }
      });
    }
  }
  state.feats[t].splice(i,1);
  cascadeRemoveFeats();
  recalcAll(); renderFeats(); save();
}

function updateSlotChecks(rank) {
  const max = parseInt(document.getElementById(`slots-max-${rank}`)?.value||0);
  const td = document.getElementById(`slot-checks-${rank}`);
  if (!td) return;
  td.innerHTML = '';
  for (let i=0; i<max; i++) {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'slot-check';
    cb.onchange = () => save();
    td.appendChild(cb);
  }
}

// ═══════════════════════════════════════════════
//  EQUIPMENT BROWSE MODAL
// ═══════════════════════════════════════════════

let equipBrowseTab = 'weapon';
let equipBrowseSubTab = '';

function openEquipBrowse() {
  modalType = 'equip-browse';
  modalSelected = null;
  modalContext = null;

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  document.getElementById('modal-search').value = '';
  document.getElementById('modal-title').textContent = '장비 추가';

  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = '';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';

  // Inject tab bar
  let tabContainer = document.getElementById('equip-tab-container');
  if (!tabContainer) {
    tabContainer = document.createElement('div');
    tabContainer.id = 'equip-tab-container';
    const modalEl = document.querySelector('.modal');
    const modalBody = document.getElementById('modal-body');
    modalEl.insertBefore(tabContainer, modalBody);
  }
  tabContainer.style.display = '';
  tabContainer.innerHTML = `
    <div class="equip-tabs" id="equip-tabs">
      <div class="equip-tab active" onclick="switchEquipTab('weapon')">무기</div>
      <div class="equip-tab" onclick="switchEquipTab('armor')">방어구</div>
      <div class="equip-tab" onclick="switchEquipTab('shield')">방패</div>
      <div class="equip-tab" onclick="switchEquipTab('gear')">장비</div>
      <div class="equip-tab" onclick="switchEquipTab('all')">전체</div>
    </div>
    <div class="equip-subtabs" id="equip-subtabs" style="display:none;"></div>`;

  // Replace footer with currency
  const footer = document.querySelector('.modal-footer');
  footer.innerHTML = `<div class="modal-currency" id="modal-currency">
    <div class="modal-currency-item"><span class="coin coin-pp"></span><span class="coin-label">백금</span><span class="coin-val" id="mc-pp">${document.getElementById('cur-pp')?.value||0}</span></div>
    <div class="modal-currency-item"><span class="coin coin-gp"></span><span class="coin-label">금화</span><span class="coin-val" id="mc-gp">${document.getElementById('cur-gp')?.value||0}</span></div>
    <div class="modal-currency-item"><span class="coin coin-sp"></span><span class="coin-label">은화</span><span class="coin-val" id="mc-sp">${document.getElementById('cur-sp')?.value||0}</span></div>
    <div class="modal-currency-item"><span class="coin coin-cp"></span><span class="coin-label">동화</span><span class="coin-val" id="mc-cp">${document.getElementById('cur-cp')?.value||0}</span></div>
  </div>
  <button class="btn btn-cancel" onclick="closeModal()" style="width:100%;padding:12px;font-size:14px;margin-top:6px;">닫기</button>`;

  equipBrowseTab = 'weapon';
  equipBrowseSubTab = '';
  switchEquipTab('weapon');
}

function switchEquipTab(tab) {
  equipBrowseTab = tab;
  equipBrowseSubTab = '';
  document.querySelectorAll('#equip-tabs .equip-tab').forEach(t => t.classList.remove('active'));
  const tabMap = {weapon:0, armor:1, shield:2, gear:3, all:4};
  const tabs = document.querySelectorAll('#equip-tabs .equip-tab');
  if (tabs[tabMap[tab]]) tabs[tabMap[tab]].classList.add('active');

  const subContainer = document.getElementById('equip-subtabs');
  let cats = [];
  if (tab === 'weapon') cats = [...new Set(WEAPON_DB.map(w => w.category))];
  else if (tab === 'armor') cats = [...new Set(ARMOR_DB.map(a => a.category))];

  if (cats.length > 0) {
    subContainer.innerHTML = `<div class="equip-subtab active" onclick="switchEquipSubTab('')">전체</div>` +
      cats.map(c => `<div class="equip-subtab" onclick="switchEquipSubTab('${c}')">${c}</div>`).join('');
    subContainer.style.display = '';
  } else {
    subContainer.innerHTML = '';
    subContainer.style.display = 'none';
  }
  renderEquipBrowseItems();
}

function switchEquipSubTab(sub) {
  equipBrowseSubTab = sub;
  document.querySelectorAll('#equip-subtabs .equip-subtab').forEach(t => t.classList.remove('active'));
  if (!sub) {
    document.querySelector('#equip-subtabs .equip-subtab')?.classList.add('active');
  } else {
    document.querySelectorAll('#equip-subtabs .equip-subtab').forEach(s => { if (s.textContent === sub) s.classList.add('active'); });
  }
  renderEquipBrowseItems();
}

function renderEquipBrowseItems() {
  let items = [];
  if (equipBrowseTab === 'weapon') items = [...WEAPON_DB];
  else if (equipBrowseTab === 'armor') items = [...ARMOR_DB];
  else if (equipBrowseTab === 'shield') items = [...SHIELD_DB];
  else if (equipBrowseTab === 'gear') items = [...GEAR_DB];
  else items = [...WEAPON_DB, ...ARMOR_DB, ...SHIELD_DB, ...GEAR_DB];

  if (equipBrowseSubTab) items = items.filter(i => i.category === equipBrowseSubTab);

  const q = (document.getElementById('modal-search')?.value||'').toLowerCase();
  if (q) items = items.filter(i => (i.name_ko||'').includes(q) || (i.name_en||'').toLowerCase().includes(q));

  renderOptions(items);
}

function showEquipDetail(item) {
  const detail = document.getElementById('modal-detail');
  if (!detail) return;
  const nameKo = item.name_ko || item.name || '';
  const nameEn = item.name_en || '';
  let infoHtml = '';

  if (item.damage !== undefined) {
    infoHtml = `<div style="margin:12px 0;font-size:13px;line-height:2.2;">
      <div><strong>가격:</strong> ${item.price||'—'}</div>
      <div><strong>피해:</strong> ${item.damage}</div>
      <div><strong>부피:</strong> ${item.bulk==='L'?'L':item.bulk==='—'?'—':item.bulk}</div>
      <div><strong>손:</strong> ${item.hands}</div>
      ${item.range?`<div><strong>사거리:</strong> ${item.range}ft</div>`:''}
      ${item.reload!==null&&item.reload!==undefined?`<div><strong>재장전:</strong> ${item.reload}</div>`:''}
      <div><strong>분류:</strong> ${item.category||''}</div>
      <div><strong>그룹:</strong> ${item.group||''}</div>
    </div>${(item.traits||[]).length?`<div class="modal-detail-tags">${item.traits.map(t=>traitTag(t)).join('')}</div>`:''}`;
  } else if (item.hardness !== undefined) {
    infoHtml = `<div style="margin:12px 0;font-size:13px;line-height:2.2;">
      <div><strong>가격:</strong> ${item.price||'—'}</div>
      <div><strong>AC 보너스:</strong> +${item.ac_bonus}</div>
      <div><strong>경도:</strong> ${item.hardness}</div>
      <div><strong>HP:</strong> ${item.hp} (BT: ${item.bt})</div>
      <div><strong>부피:</strong> ${item.bulk==='L'?'L':item.bulk}</div>
      ${item.speed_penalty?`<div style="color:var(--red-light);"><strong>속도 페널티:</strong> ${item.speed_penalty}</div>`:''}
    </div>`;
  } else if (item.ac_bonus !== undefined) {
    infoHtml = `<div style="margin:12px 0;font-size:13px;line-height:2.2;">
      <div><strong>가격:</strong> ${item.price||'—'}</div>
      <div><strong>AC 보너스:</strong> +${item.ac_bonus}</div>
      ${item.dex_cap!==null?`<div><strong>DEX 상한:</strong> +${item.dex_cap}</div>`:''}
      ${item.check_penalty?`<div style="color:var(--red-light);"><strong>점검 페널티:</strong> ${item.check_penalty}</div>`:''}
      ${item.speed_penalty?`<div style="color:var(--red-light);"><strong>속도 페널티:</strong> ${item.speed_penalty}</div>`:''}
      ${item.strength?`<div><strong>근력 요구:</strong> ${item.strength}</div>`:''}
      <div><strong>부피:</strong> ${item.bulk==='L'?'L':item.bulk==='—'?'—':item.bulk}</div>
      <div><strong>분류:</strong> ${item.category||''}</div>
      <div><strong>그룹:</strong> ${item.group||''}</div>
    </div>${(item.traits||[]).length?`<div class="modal-detail-tags">${item.traits.map(t=>traitTag(t)).join('')}</div>`:''}`;
  } else {
    infoHtml = `<div style="margin:12px 0;font-size:13px;line-height:2.2;">
      <div><strong>가격:</strong> ${item.price||'—'}</div>
      <div><strong>부피:</strong> ${item.bulk==='L'?'L':item.bulk==='—'?'—':item.bulk}</div>
    </div>`;
  }

  detail.innerHTML = `
    <div class="modal-detail-back" onclick="document.getElementById('modal-body').classList.remove('detail-open')">← 목록으로</div>
    <div class="modal-detail-title">${nameKo}</div>
    <div class="modal-detail-en">${nameEn}</div>
    ${infoHtml}
    <div class="equip-give-buy">
      ${modalType === 'formula-pick'
        ? `<button class="btn-give" onclick="recordFormula('${nameKo.replace(/'/g,"\\'")}')">📜 제조법 기록</button>`
        : `<button class="btn-give" onclick="equipBrowseGive()">획득</button>
           <button class="btn-buy" onclick="equipBrowseBuy()">구매</button>`}
    </div>`;
}

// ── Price Parsing & Currency ──

function parsePrice(priceStr) {
  if (!priceStr || priceStr === '—' || priceStr === '-') return 0;
  let totalCp = 0;
  const re = /(\d+)\s*(pp|gp|sp|cp)/gi;
  let m;
  while ((m = re.exec(priceStr)) !== null) {
    const n = parseInt(m[1]);
    const u = m[2].toLowerCase();
    if (u === 'pp') totalCp += n * 1000;
    else if (u === 'gp') totalCp += n * 100;
    else if (u === 'sp') totalCp += n * 10;
    else totalCp += n;
  }
  return totalCp;
}

function getCurrencyTotalCp() {
  const pp = parseInt(document.getElementById('cur-pp')?.value||0);
  const gp = parseInt(document.getElementById('cur-gp')?.value||0);
  const sp = parseInt(document.getElementById('cur-sp')?.value||0);
  const cp = parseInt(document.getElementById('cur-cp')?.value||0);
  return pp*1000 + gp*100 + sp*10 + cp;
}

function deductCurrency(costCp) {
  let total = getCurrencyTotalCp() - costCp;
  if (total < 0) return false;
  const pp = Math.floor(total/1000); total %= 1000;
  const gp = Math.floor(total/100); total %= 100;
  const sp = Math.floor(total/10); total %= 10;
  document.getElementById('cur-pp').value = pp;
  document.getElementById('cur-gp').value = gp;
  document.getElementById('cur-sp').value = sp;
  document.getElementById('cur-cp').value = total;
  updateEquipBrowseCurrency();
  save();
  return true;
}

function updateEquipBrowseCurrency() {
  const ids = [['mc-pp','cur-pp'],['mc-gp','cur-gp'],['mc-sp','cur-sp'],['mc-cp','cur-cp']];
  ids.forEach(([modal,main]) => {
    const el = document.getElementById(modal);
    if (el) el.textContent = document.getElementById(main)?.value||0;
  });
}

function equipBrowseGive() {
  if (!modalSelected) return;
  const item = modalSelected;
  const bulk = typeof item.bulk==='number'?item.bulk:(item.bulk==='L'?0.1:0);
  let type = null;
  if (item.damage !== undefined) type = 'weapon';
  else if (item.hardness !== undefined) type = 'shield';
  else if (item.ac_bonus !== undefined) type = 'armor';
  addEquip({name: item.name_ko, qty:1, bulk, _type: type, _data: type ? item : undefined});
  recalcAll();
  save();
  closeModal();
}

function equipBrowseBuy() {
  if (!modalSelected) return;
  const item = modalSelected;
  const costCp = parsePrice(item.price);
  if (!costCp) { equipBrowseGive(); return; }
  if (getCurrencyTotalCp() < costCp) { alert(`소지금이 부족합니다!\n필요: ${item.price}\n보유: ${Math.floor(getCurrencyTotalCp()/100)}gp ${Math.floor((getCurrencyTotalCp()%100)/10)}sp ${getCurrencyTotalCp()%10}cp`); return; }
  deductCurrency(costCp);
  equipBrowseGive();
}

// ═══════════════════════════════════════════════
//  PETS (반려동물)
// ═══════════════════════════════════════════════

const BARDING_DB = [
  {name:'없음', ac:0, dex:99, check:0, speed:0, bulk:0, category:'없음'},
  {name:'패딩 마갑', ac:1, dex:5, check:-1, speed:0, bulk:2, category:'경갑'},
  {name:'가죽 마갑', ac:2, dex:4, check:-2, speed:-5, bulk:2, category:'경갑'},
  {name:'사슬 마갑', ac:3, dex:3, check:-2, speed:-5, bulk:3, category:'경갑'},
  {name:'합성 마갑', ac:4, dex:2, check:-3, speed:-10, bulk:4, category:'중갑'},
  {name:'반판 마갑', ac:5, dex:1, check:-3, speed:-10, bulk:4, category:'중갑'},
];

const COMPANION_DB = [
  {id:'ape',name_ko:'유인원',name_en:'Ape',size:'소형',hp:6,str:3,dex:2,con:2,int:-4,wis:2,cha:0,
   skill:'위협',senses:'저광 시야',speed:25,speeds:{climb:25},
   attacks:[{name:'주먹',hit:'',dmg:'1d8 B',traits:[]}]},
  {id:'arboreal',name_ko:'수목 묘목',name_en:'Arboreal Sapling',size:'소형',hp:8,str:3,dex:1,con:2,int:-4,wis:2,cha:0,
   skill:'은신',senses:'저광 시야',speed:25,speeds:{},
   attacks:[{name:'가지',hit:'',dmg:'1d8 B',traits:[]}]},
  {id:'bat',name_ko:'박쥐',name_en:'Bat',size:'소형',hp:6,str:2,dex:3,con:2,int:-4,wis:1,cha:0,
   skill:'은신',senses:'반향정위 20피트, 저광 시야',speed:15,speeds:{fly:30},
   attacks:[{name:'턱',hit:'',dmg:'1d6 P',traits:['기교']},{name:'날개',hit:'',dmg:'1d4 S',traits:['민첩','기교']}]},
  {id:'badger',name_ko:'오소리',name_en:'Badger',size:'소형',hp:8,str:2,dex:2,con:2,int:-4,wis:2,cha:0,
   skill:'생존',senses:'저광 시야, 후각(부정확 30피트)',speed:25,speeds:{burrow:10,climb:10},
   attacks:[{name:'턱',hit:'',dmg:'1d8 P',traits:[]},{name:'발톱',hit:'',dmg:'1d6 S',traits:['민첩']}]},
  {id:'bear',name_ko:'곰',name_en:'Bear',size:'소형',hp:8,str:3,dex:2,con:2,int:-4,wis:1,cha:0,
   skill:'위협',senses:'저광 시야, 후각(부정확 30피트)',speed:35,speeds:{},
   attacks:[{name:'턱',hit:'',dmg:'1d8 P',traits:[]},{name:'발톱',hit:'',dmg:'1d6 S',traits:['민첩']}]},
  {id:'bird',name_ko:'새',name_en:'Bird',size:'소형',hp:4,str:2,dex:3,con:1,int:-4,wis:2,cha:0,
   skill:'은신',senses:'저광 시야',speed:10,speeds:{fly:60},
   attacks:[{name:'부리',hit:'',dmg:'1d6 P',traits:['기교']},{name:'발톱',hit:'',dmg:'1d4 S',traits:['민첩','기교']}]},
  {id:'boar',name_ko:'멧돼지',name_en:'Boar',size:'소형',hp:8,str:3,dex:1,con:2,int:-4,wis:2,cha:0,
   skill:'생존',senses:'저광 시야, 후각(부정확 30피트)',speed:35,speeds:{},
   attacks:[{name:'엄니',hit:'',dmg:'1d8 P',traits:[]}]},
  {id:'cat',name_ko:'고양이',name_en:'Cat',size:'소형',hp:4,str:2,dex:3,con:1,int:-4,wis:2,cha:0,
   skill:'은신',senses:'저광 시야, 후각(부정확 30피트)',speed:35,speeds:{},
   attacks:[{name:'턱',hit:'',dmg:'1d6 P',traits:['기교']},{name:'발톱',hit:'',dmg:'1d4 S',traits:['민첩','기교']}]},
  {id:'crocodile',name_ko:'악어',name_en:'Crocodile',size:'소형',hp:6,str:3,dex:2,con:2,int:-4,wis:1,cha:0,
   skill:'은신',senses:'저광 시야',speed:20,speeds:{swim:25},
   attacks:[{name:'턱',hit:'',dmg:'1d8 P',traits:[]},{name:'꼬리',hit:'',dmg:'1d6 B',traits:['민첩']}]},
  {id:'dromaeosaur',name_ko:'드로마에오사우루스',name_en:'Dromaeosaur',size:'소형',hp:6,str:2,dex:3,con:2,int:-4,wis:1,cha:0,
   skill:'은신',senses:'저광 시야, 후각(부정확 30피트)',speed:50,speeds:{},
   attacks:[{name:'턱',hit:'',dmg:'1d8 P',traits:['기교']},{name:'발톱',hit:'',dmg:'1d6 S',traits:['민첩','기교']}]},
  {id:'horse',name_ko:'말',name_en:'Horse',size:'대형',hp:8,str:3,dex:2,con:2,int:-4,wis:1,cha:0,
   skill:'생존',senses:'저광 시야, 후각(부정확 30피트)',speed:40,speeds:{},mount:true,
   attacks:[{name:'발굽',hit:'',dmg:'1d6 B',traits:['민첩']}]},
  {id:'drake',name_ko:'기마 드레이크',name_en:'Riding Drake',size:'대형',hp:8,str:2,dex:1,con:2,int:-4,wis:1,cha:2,
   skill:'위협',senses:'암시야',speed:45,speeds:{},mount:true,uncommon:true,
   attacks:[{name:'턱',hit:'',dmg:'1d8 P',traits:[]},{name:'꼬리',hit:'',dmg:'1d6 B',traits:[]}]},
  {id:'scorpion',name_ko:'전갈',name_en:'Scorpion',size:'소형',hp:6,str:3,dex:3,con:1,int:-4,wis:1,cha:0,
   skill:'은신',senses:'암시야',speed:30,speeds:{},
   attacks:[{name:'침',hit:'',dmg:'1d6 P',traits:[]},{name:'집게',hit:'',dmg:'1d6 S',traits:['민첩']}]},
  {id:'shark',name_ko:'상어',name_en:'Shark',size:'소형',hp:6,str:3,dex:2,con:2,int:-4,wis:1,cha:0,
   skill:'은신',senses:'피냄새, 후각(부정확 60피트)',speed:0,speeds:{swim:40},
   attacks:[{name:'턱',hit:'',dmg:'1d8 P',traits:[]}]},
  {id:'snake',name_ko:'뱀',name_en:'Snake',size:'소형',hp:6,str:3,dex:3,con:1,int:-4,wis:1,cha:0,
   skill:'은신',senses:'저광 시야, 후각(부정확 30피트)',speed:20,speeds:{climb:20,swim:20},
   attacks:[{name:'턱',hit:'',dmg:'1d8 P',traits:['기교']}]},
  {id:'wolf',name_ko:'늑대',name_en:'Wolf',size:'소형',hp:6,str:2,dex:3,con:2,int:-4,wis:1,cha:0,
   skill:'생존',senses:'저광 시야, 후각(부정확 30피트)',speed:40,speeds:{},
   attacks:[{name:'턱',hit:'',dmg:'1d8 P',traits:['기교']}]},
];

function addPet() {
  if (!state.pets) state.pets = [];
  // 동물 동료 선택 모달
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'pet-add';
  document.getElementById('modal-title').textContent = '🐾 동료 추가';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; }
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  const listEl = document.querySelector('.modal-list');
  if (listEl) { listEl.style.display = ''; listEl.style.width = ''; listEl.style.borderRight = ''; }
  const detail = document.getElementById('modal-detail');
  if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">동물을 선택하면 상세 정보가 표시됩니다.</div>'; }

  const container = document.getElementById('modal-options');
  container.innerHTML = '';

  // 커스텀 옵션
  const customRow = document.createElement('div');
  customRow.className = 'opt-row';
  customRow.style.cursor = 'pointer';
  customRow.innerHTML = '<div class="opt-row-icon">✏</div><span class="opt-row-name">직접 입력 (커스텀)</span>';
  customRow.onclick = () => {
    closeModal();
    const name = prompt('동료 이름:');
    if (!name) return;
    state.pets.push({name, type:'커스텀', hp:{cur:0,max:0}, ac:10, speed:25, size:'소형',
      str:0,dex:0,con:0,int:-4,wis:0,cha:0, fort:0,ref:0,will:0,perc:0, senses:'', attacks:[], notes:''});
    renderPets(); save();
  };
  container.appendChild(customRow);

  // 동물 동료 목록
  const header = document.createElement('div');
  header.className = 'opt-section-header';
  header.textContent = '동물 동료 Animal Companions';
  container.appendChild(header);

  COMPANION_DB.forEach(c => {
    const row = document.createElement('div');
    row.className = 'opt-row';
    row.style.cursor = 'pointer';
    row.innerHTML = `
      <div class="opt-row-icon">🐾</div>
      <div style="flex:1;">
        <div class="opt-row-name">${c.name_ko} <span style="color:var(--text2);font-size:10px;">${c.name_en}</span></div>
        <div style="font-size:10px;color:var(--text2);">${c.size} | 속도 ${c.speed}피트 | HP ${c.hp}/Lv</div>
      </div>`;
    row.addEventListener('click', () => {
      container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      if (detail && window.innerWidth > 900) {
        const speedStr = [c.speed + '피트', ...Object.entries(c.speeds||{}).map(([k,v])=>({climb:'등반',swim:'수영',fly:'비행',burrow:'굴착'}[k]||k)+' '+v+'피트')].join(', ');
        detail.innerHTML = `
          <div class="modal-detail-title">${c.name_ko}</div>
          <div class="modal-detail-en">${c.name_en}</div>
          <div class="modal-detail-desc" style="margin-top:10px;">
            <strong>크기:</strong> ${c.size}<br>
            <strong>HP:</strong> ${c.hp} + (6+CON)×레벨<br>
            <strong>속도:</strong> ${speedStr}<br>
            <strong>감각:</strong> ${c.senses}<br>
            <strong>기술:</strong> ${c.skill}<br>
            <strong>능력치:</strong> 근${c.str>=0?'+':''}${c.str} 민${c.dex>=0?'+':''}${c.dex} 건${c.con>=0?'+':''}${c.con} 지${c.int>=0?'+':''}${c.int} 혜${c.wis>=0?'+':''}${c.wis} 매${c.cha>=0?'+':''}${c.cha}<br><br>
            <strong>공격:</strong><br>
            ${c.attacks.map(a => `• ${a.name} — ${a.dmg}${a.traits.length ? ' ('+a.traits.join(', ')+')' : ''}`).join('<br>')}
          </div>
          <button onclick="createCompanionPet('${c.id}')" style="width:100%;margin-top:12px;padding:10px;background:var(--accent);color:#000;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">추가</button>`;
      }
    });
    container.appendChild(row);
  });
}

function createCompanionPet(compId) {
  const c = COMPANION_DB.find(x => x.id === compId);
  if (!c) return;
  const name = prompt(c.name_ko + '의 이름:', c.name_ko);
  if (!name) return;
  const lv = getLevel();
  const hpMax = c.hp + (6 + c.con) * lv;
  // AC = 10 + DEX + 숙련(trained=2) + 레벨
  const ac = 10 + Math.min(c.dex, 99) + 2 + lv;
  // 내성/지각 = 속성 + 숙련(trained=2) + 레벨
  const profBonus = 2 + lv;
  state.pets.push({
    name, type: c.name_ko, companionId: c.id,
    hp: {cur: hpMax, max: hpMax},
    ac: ac, speed: c.speed, size: c.size,
    str: c.str, dex: c.dex, con: c.con, int: c.int, wis: c.wis, cha: c.cha,
    fort: c.con + profBonus, ref: c.dex + profBonus, will: c.wis + profBonus,
    perc: c.wis + profBonus,
    senses: c.senses,
    attacks: c.attacks.map(a => ({name: a.name, hit: '+' + (Math.max(c.str, c.dex) + profBonus), dmg: a.dmg})),
    speeds: c.speeds || {},
    skill: c.skill,
    notes: '',
    mount: c.mount || false,
  });
  renderPets(); save(); closeModal();
}

function removePet(i) {
  if (!confirm(state.pets[i].name + '을(를) 제거하시겠습니까?')) return;
  state.pets.splice(i,1);
  renderPets();
  save();
}

function editPet(i) {
  const p = state.pets[i];
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'pet-edit';
  document.getElementById('modal-title').textContent = '🐾 ' + p.name + ' 편집';
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

  const is = 'width:50px;background:var(--bg3);border:1px solid var(--border2);color:var(--text);padding:4px;border-radius:4px;font-size:13px;text-align:center;';
  const container = document.getElementById('modal-options');
  container.innerHTML = `<div style="padding:12px;font-size:12px;">
    <div style="display:flex;gap:6px;margin-bottom:8px;">
      <div style="flex:1;"><label style="font-size:9px;color:var(--text2);">이름</label><input id="pe-name" value="${p.name}" style="width:100%;${is}"></div>
      <div><label style="font-size:9px;color:var(--text2);">유형</label><input id="pe-type" value="${p.type||''}" style="width:80px;${is}"></div>
    </div>
    <div style="display:flex;gap:6px;margin-bottom:8px;">
      <div><label style="font-size:9px;color:var(--text2);">AC</label><input id="pe-ac" type="number" value="${p.ac}" style="${is}"></div>
      <div><label style="font-size:9px;color:var(--text2);">HP 최대</label><input id="pe-hpmax" type="number" value="${p.hp.max}" style="${is}"></div>
      <div><label style="font-size:9px;color:var(--text2);">이동</label><input id="pe-speed" type="number" value="${p.speed}" style="${is}"></div>
      <div><label style="font-size:9px;color:var(--text2);">크기</label><input id="pe-size" value="${p.size||'소형'}" style="width:50px;${is}"></div>
    </div>
    <div style="font-size:10px;color:var(--accent);margin-bottom:4px;">능력치 수정치</div>
    <div style="display:flex;gap:4px;margin-bottom:8px;">
      ${['str','dex','con','int','wis','cha'].map(a => `<div style="text-align:center;"><div style="font-size:8px;color:var(--text2);">${a.toUpperCase()}</div><input id="pe-${a}" type="number" value="${p[a]||0}" style="width:36px;${is}"></div>`).join('')}
    </div>
    <div style="font-size:10px;color:var(--accent);margin-bottom:4px;">내성/지각</div>
    <div style="display:flex;gap:4px;margin-bottom:8px;">
      ${[['fort','인내'],['ref','반사'],['will','의지'],['perc','지각']].map(([k,l]) => `<div style="text-align:center;"><div style="font-size:8px;color:var(--text2);">${l}</div><input id="pe-${k}" type="number" value="${p[k]||0}" style="width:42px;${is}"></div>`).join('')}
    </div>
    <div style="margin-bottom:8px;"><label style="font-size:9px;color:var(--text2);">감각</label><input id="pe-senses" value="${p.senses||''}" style="width:100%;${is}"></div>
    <div style="margin-bottom:8px;">
      <label style="font-size:9px;color:var(--text2);">공격 (줄마다: 이름,명중,피해)</label>
      <textarea id="pe-attacks" style="width:100%;min-height:50px;${is};text-align:left;">${(p.attacks||[]).map(a=>a.name+','+a.hit+','+a.dmg).join('\n')}</textarea>
    </div>
    <div style="margin-bottom:8px;"><label style="font-size:9px;color:var(--text2);">메모</label><textarea id="pe-notes" style="width:100%;min-height:40px;${is};text-align:left;">${p.notes||''}</textarea></div>
    <button onclick="applyPetEdit(${i})" style="width:100%;padding:10px;background:var(--accent);color:#000;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">저장</button>
  </div>`;
}

function applyPetEdit(i) {
  const p = state.pets[i];
  p.name = document.getElementById('pe-name').value || p.name;
  p.type = document.getElementById('pe-type').value;
  p.ac = parseInt(document.getElementById('pe-ac').value)||10;
  p.hp.max = parseInt(document.getElementById('pe-hpmax').value)||0;
  if (p.hp.cur > p.hp.max) p.hp.cur = p.hp.max;
  if (p.hp.cur === 0 && p.hp.max > 0) p.hp.cur = p.hp.max;
  p.speed = parseInt(document.getElementById('pe-speed').value)||25;
  p.size = document.getElementById('pe-size').value || '소형';
  ['str','dex','con','int','wis','cha'].forEach(a => { p[a] = parseInt(document.getElementById('pe-'+a).value)||0; });
  ['fort','ref','will','perc'].forEach(k => { p[k] = parseInt(document.getElementById('pe-'+k).value)||0; });
  p.senses = document.getElementById('pe-senses').value;
  p.notes = document.getElementById('pe-notes').value;
  p.attacks = (document.getElementById('pe-attacks').value||'').split('\n').filter(l=>l.trim()).map(l => {
    const [name,hit,dmg] = l.split(',').map(s=>s.trim());
    return {name:name||'공격',hit:hit||'+0',dmg:dmg||'1d4'};
  });
  renderPets();
  save();
  closeModal();
}

function openPetHpModal(i) {
  const p = state.pets[i];
  const cur = p.hp.cur || 0;
  const max = p.hp.max || 0;
  const temp = p.hp.temp || 0;

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'pet-hp';
  document.getElementById('modal-title').textContent = '❤ ' + p.name + ' HP';
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
          <input type="number" id="pet-hp-heal" min="0" value="0" onkeydown="if(event.key==='Enter')applyPetHp(${i},'heal')" style="${inputStyle}">
          <button onclick="applyPetHp(${i},'heal')" style="padding:8px 16px;background:var(--green);color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">확인</button>
        </div>
      </div>
      <div style="border:1px solid var(--border);border-radius:6px;padding:12px;">
        <div style="font-size:12px;color:var(--text2);margin-bottom:6px;">⚔️ 피해</div>
        <div style="display:flex;gap:6px;">
          <input type="number" id="pet-hp-dmg" min="0" value="0" onkeydown="if(event.key==='Enter')applyPetHp(${i},'dmg')" style="${inputStyle}">
          <button onclick="applyPetHp(${i},'dmg')" style="padding:8px 16px;background:var(--red);color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">확인</button>
        </div>
      </div>
      <div style="border:1px solid var(--border);border-radius:6px;padding:12px;">
        <div style="font-size:12px;color:var(--text2);margin-bottom:6px;">🔧 HP 직접 설정</div>
        <div style="display:flex;gap:6px;">
          <input type="number" id="pet-hp-set" min="0" value="${cur}" onkeydown="if(event.key==='Enter')applyPetHp(${i},'set')" style="${inputStyle}">
          <button onclick="applyPetHp(${i},'set')" style="padding:8px 16px;background:var(--bg4);color:var(--text);border:1px solid var(--border2);border-radius:4px;cursor:pointer;font-size:13px;">확인</button>
        </div>
      </div>
      <div style="border:1px solid var(--border);border-radius:6px;padding:12px;">
        <div style="font-size:12px;color:var(--text2);margin-bottom:6px;">🛡 임시 HP</div>
        <div style="display:flex;gap:6px;">
          <input type="number" id="pet-hp-temp" min="0" value="${temp}" onkeydown="if(event.key==='Enter')applyPetHp(${i},'temp')" style="${inputStyle}">
          <button onclick="applyPetHp(${i},'temp')" style="padding:8px 16px;background:var(--bg4);color:var(--text);border:1px solid var(--border2);border-radius:4px;cursor:pointer;font-size:13px;">확인</button>
        </div>
      </div>
    </div>
  </div>`;
}

function applyPetHp(i, action) {
  const p = state.pets[i];
  if (action === 'heal') {
    const val = parseInt(document.getElementById('pet-hp-heal').value) || 0;
    p.hp.cur = Math.min(p.hp.max, p.hp.cur + val);
  } else if (action === 'dmg') {
    let val = parseInt(document.getElementById('pet-hp-dmg').value) || 0;
    let temp = p.hp.temp || 0;
    if (temp > 0) { const absorbed = Math.min(temp, val); temp -= absorbed; val -= absorbed; p.hp.temp = temp; }
    p.hp.cur = Math.max(0, p.hp.cur - val);
  } else if (action === 'set') {
    p.hp.cur = Math.min(p.hp.max, Math.max(0, parseInt(document.getElementById('pet-hp-set').value) || 0));
  } else if (action === 'temp') {
    p.hp.temp = Math.max(0, parseInt(document.getElementById('pet-hp-temp').value) || 0);
  }
  renderPets(); save(); closeModal();
}

function renderPets() {
  const el = document.getElementById('pet-list');
  if (!el) return;
  if (!state.pets) state.pets = [];
  el.innerHTML = '';
  if (state.pets.length === 0) {
    el.innerHTML = '<div style="font-size:11px;color:var(--text2);text-align:center;padding:16px;">반려동물을 추가하세요</div>';
    return;
  }
  state.pets.forEach((p, i) => {
    const hpPct = p.hp.max > 0 ? Math.round((p.hp.cur/p.hp.max)*100) : 0;
    const hpColor = hpPct > 50 ? '#2d8a5e' : hpPct > 25 ? '#a08a20' : '#a03030';
    // 마갑 적용 계산 (파손 시 AC 보너스 절반)
    const bd = p.bardingData || null;
    const bardingAC = bd ? (p.bardingBroken ? Math.floor(bd.ac / 2) : bd.ac) : 0;
    const effectiveAC = p.ac + bardingAC;
    const effectiveSpeed = Math.max(0, p.speed + (bd ? bd.speed : 0));
    const bardingCheckPen = bd ? bd.check : 0;
    const bardingDexCap = bd ? bd.dex : 99;
    el.innerHTML += `
    <div class="box" style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div>
          <span style="font-size:14px;font-weight:700;color:var(--accent);">${p.name}</span>
          <span style="font-size:10px;color:var(--text2);margin-left:6px;">${p.type||''}</span>
        </div>
        <div style="display:flex;gap:4px;">
          <button class="defense-btn" onclick="editPet(${i})">편집</button>
          ${!p.isFamiliar ? `<button class="defense-btn" onclick="openPetBarding(${i})">마갑</button>` : `<button class="defense-btn" onclick="openFamiliarAbilities(${i})">능력</button>`}
          <button class="defense-btn" onclick="openPetSkills(${i})">스킬</button>
          <button class="defense-btn" onclick="openPetConditions(${i})">상태</button>
          <button class="defense-btn danger" onclick="removePet(${i})">삭제</button>
        </div>
      </div>
      <!-- AC + HP -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
        <div class="ac-shield" style="width:40px;height:40px;font-size:16px;line-height:40px;">${effectiveAC}</div>
        <div style="flex:1;">
          <div style="position:relative;background:var(--bg4);border:1px solid var(--border);border-radius:4px;height:22px;overflow:hidden;cursor:pointer;" onclick="openPetHpModal(${i})">
            <div style="position:absolute;left:0;top:0;bottom:0;width:${hpPct}%;background:${hpColor};border-radius:3px;transition:width .3s;"></div>
            ${(p.hp.temp||0) > 0 ? `<div style="position:absolute;right:0;top:0;bottom:0;width:${Math.min(100,(p.hp.temp/p.hp.max)*100)}%;background:#666;border-left:2px solid #999;"></div>` : ''}
            <div style="position:relative;z-index:1;display:flex;align-items:center;justify-content:center;height:100%;font-size:11px;font-weight:700;color:#fff;">HP ${p.hp.cur}/${p.hp.max}${(p.hp.temp||0)>0?' +임시'+p.hp.temp:''}</div>
          </div>
        </div>
      </div>
      ${p.barding && p.barding !== '없음' ? `<div style="font-size:10px;color:var(--text2);margin-bottom:4px;">🛡 마갑: <strong style="color:${p.bardingBroken?'var(--red-light)':'var(--text)'};">${p.bardingBroken?'파손된 ':''}${p.barding}</strong> <span style="color:var(--text2);">(AC+${bd?.ac||0} 민첩상한+${bd?.dex||0} 판정${bd?.check||0})</span>
        <button onclick="event.stopPropagation();togglePetBardingBroken(${i})" style="font-size:9px;padding:1px 6px;border-radius:3px;cursor:pointer;margin-left:4px;${p.bardingBroken?'background:var(--red-bg);color:var(--red-light);border:1px solid var(--red);':'background:var(--bg4);color:var(--text2);border:1px solid var(--border2);'}">${p.bardingBroken?'파손됨':'정상'}</button>
      </div>` : ''}
      ${p.isFamiliar && p.familiarAbilities?.length > 0 ? `<div style="font-size:10px;color:var(--text2);margin-bottom:4px;">✦ 능력: <strong style="color:var(--accent);">${p.familiarAbilities.map(id => FAMILIAR_ABILITIES.find(a=>a.id===id)?.name||id).join(', ')}</strong></div>` : ''}
      ${(p.conditions && Object.keys(p.conditions).some(k=>p.conditions[k]>0)) ? `<div style="font-size:10px;color:var(--red-light);margin-bottom:4px;">⚠ ${Object.entries(p.conditions).filter(([,v])=>v>0).map(([k,v])=>{const cd=CONDITIONS_DATA.find(c=>c.name===k);return cd?.valued?k+' '+v:k;}).join(', ')}</div>` : ''}
      <!-- Info row -->
      <div style="display:flex;gap:8px;font-size:10px;color:var(--text2);margin-bottom:6px;flex-wrap:wrap;">
        <span>이동 <strong style="color:${effectiveSpeed < p.speed ? 'var(--red-light)' : 'var(--text)'};">${effectiveSpeed}</strong>피트</span>
        <span>크기 <strong style="color:var(--text);">${p.size}</strong></span>
        ${p.senses ? `<span>감각 <strong style="color:var(--text);">${p.senses}</strong></span>` : ''}
      </div>
      <!-- Attacks -->
      ${(p.attacks||[]).length > 0 ? `<div style="margin-bottom:6px;">
        ${p.attacks.map(a => `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;border-bottom:1px solid var(--border);font-size:12px;">
          <span style="font-weight:600;color:var(--text);min-width:60px;">${a.name}</span>
          <span style="color:var(--text2);">명중 <strong style="color:var(--accent);">${a.hit}</strong></span>
          <span style="color:var(--text2);">피해 <strong style="color:var(--text);">${a.dmg}</strong></span>
        </div>`).join('')}
      </div>` : ''}
      <!-- Saves + Stats -->
      <div style="display:flex;gap:6px;font-size:10px;margin-bottom:4px;flex-wrap:wrap;">
        <span style="color:var(--text2);">인내 <strong style="color:var(--text);">${p.fort>=0?'+':''}${p.fort}</strong></span>
        <span style="color:var(--text2);">반사 <strong style="color:var(--text);">${p.ref>=0?'+':''}${p.ref}</strong></span>
        <span style="color:var(--text2);">의지 <strong style="color:var(--text);">${p.will>=0?'+':''}${p.will}</strong></span>
        <span style="color:var(--text2);">지각 <strong style="color:var(--text);">${p.perc>=0?'+':''}${p.perc}</strong></span>
      </div>
      <div style="display:flex;gap:4px;font-size:10px;flex-wrap:wrap;">
        ${['str','dex','con','int','wis','cha'].map(a => `<span style="color:var(--text2);">${a.toUpperCase()} <strong style="color:${p[a]<0?'var(--red-light)':'var(--text)'};">${p[a]>=0?'+':''}${p[a]}</strong></span>`).join('')}
      </div>
      ${p.notes ? `<div style="font-size:10px;color:var(--text2);margin-top:4px;padding-top:4px;border-top:1px solid var(--border);">${p.notes}</div>` : ''}
    </div>`;
  });
}

// ── 마갑 모달 ──
function openPetBarding(i) {
  const p = state.pets[i];
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'pet-barding';
  document.getElementById('modal-title').textContent = '🛡 ' + p.name + ' — 마갑 선택';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  const listEl = document.querySelector('.modal-list');
  if (listEl) { listEl.style.display = ''; listEl.style.width = ''; listEl.style.borderRight = ''; }
  const detail = document.getElementById('modal-detail');
  if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">마갑을 선택하면 상세 정보가 표시됩니다.</div>'; }

  const container = document.getElementById('modal-options');
  container.innerHTML = '';

  // 섹션 헤더
  const addHeader = (title) => {
    const h = document.createElement('div');
    h.className = 'opt-section-header';
    h.textContent = title;
    container.appendChild(h);
  };

  let lastCat = '';
  BARDING_DB.forEach(b => {
    if (b.category !== lastCat) { addHeader(b.category === '없음' ? '기본' : b.category); lastCat = b.category; }
    const isCur = (p.barding === b.name);
    const row = document.createElement('div');
    row.className = 'opt-row' + (isCur ? ' selected' : '');
    row.style.cursor = 'pointer';
    const priceText = b.ac > 0 ? (b.bulk >= 4 ? b.name.includes('합성') ? '12gp' : '20gp' : b.name.includes('패딩') ? '4sp' : b.name.includes('가죽') ? '4gp' : '10gp') : '';
    row.innerHTML = `
      <div class="opt-row-icon">${isCur ? '✓' : '🛡'}</div>
      <span class="opt-row-name" style="flex:1;">${b.name}</span>
      ${priceText ? `<span style="font-size:11px;color:var(--text2);">${priceText}</span>` : ''}`;

    row.addEventListener('click', () => {
      container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');

      if (window.innerWidth > 900) {
        // PC: 디테일 패인에 상세 + 장착 버튼
        showBardingDetail(i, b);
      } else {
        // 모바일: 아코디언
        document.querySelectorAll('.opt-row-detail.open').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.opt-row.expanded').forEach(r => r.classList.remove('expanded'));
        row.classList.add('expanded');
        let dd = row.nextElementSibling;
        if (!dd || !dd.classList.contains('opt-row-detail')) { dd = document.createElement('div'); dd.className = 'opt-row-detail'; row.after(dd); }
        dd.innerHTML = buildBardingDetailHtml(b) + `<div style="display:flex;gap:6px;margin-top:8px;">
          <button onclick="applyBarding(${i},'${b.name}')" style="flex:1;padding:10px;background:var(--bg4);color:var(--text);border:1px solid var(--border2);border-radius:4px;font-size:13px;cursor:pointer;">획득</button>
          <button onclick="buyBarding(${i},'${b.name}')" style="flex:1;padding:10px;background:var(--accent-bg);color:var(--accent);border:1px solid var(--accent);border-radius:4px;font-size:13px;cursor:pointer;">구매</button>
        </div>`;
        dd.classList.add('open');
      }
    });
    container.appendChild(row);
  });
}

function buildBardingDetailHtml(b) {
  if (b.ac === 0) return '<div style="font-size:13px;color:var(--text);">마갑을 장착하지 않습니다.</div>';
  const prices = {'패딩 마갑':'4sp','가죽 마갑':'4gp','사슬 마갑':'10gp','합성 마갑':'12gp','반판 마갑':'20gp'};
  return `<div style="font-size:13px;line-height:1.8;">
    <strong>가격:</strong> ${prices[b.name]||'—'}<br>
    <strong>AC 보너스:</strong> +${b.ac}<br>
    <strong>민첩 상한:</strong> +${b.dex}<br>
    <strong>판정 페널티:</strong> ${b.check}<br>
    <strong>속도 페널티:</strong> ${b.speed === 0 ? '—' : b.speed + '피트'}<br>
    <strong>부피:</strong> ${b.bulk}<br>
    <strong>분류:</strong> ${b.category}
  </div>`;
}

function showBardingDetail(petIdx, b) {
  const detail = document.getElementById('modal-detail');
  if (!detail) return;
  detail.innerHTML = `
    <div class="modal-detail-title">${b.name}</div>
    ${b.category !== '없음' ? `<div class="modal-detail-tags"><span class="tag hl">${b.category}</span></div>` : ''}
    <div class="modal-detail-desc" style="margin-bottom:16px;">${buildBardingDetailHtml(b)}</div>
    <div class="equip-give-buy">
      <button class="btn-give" onclick="applyBarding(${petIdx},'${b.name}')">획득</button>
      <button class="btn-buy" onclick="buyBarding(${petIdx},'${b.name}')">구매</button>
    </div>`;
}

function buyBarding(petIdx, bardingName) {
  const prices = {'패딩 마갑':4,'가죽 마갑':400,'사슬 마갑':1000,'합성 마갑':1200,'반판 마갑':2000}; // in cp
  const costCp = prices[bardingName] || 0;
  if (costCp > 0) {
    const totalCp = getCurrencyTotalCp();
    if (totalCp < costCp) {
      alert('소지금이 부족합니다! (필요: ' + (costCp >= 100 ? Math.floor(costCp/100)+'gp' : costCp >= 10 ? Math.floor(costCp/10)+'sp' : costCp+'cp') + ')');
      return;
    }
    deductCurrency(costCp);
  }
  applyBarding(petIdx, bardingName);
}

function togglePetBardingBroken(i) {
  state.pets[i].bardingBroken = !state.pets[i].bardingBroken;
  renderPets(); save();
}

function applyBarding(petIdx, bardingName) {
  const p = state.pets[petIdx];
  const b = BARDING_DB.find(x => x.name === bardingName);
  p.barding = bardingName === '없음' ? null : bardingName;
  p.bardingData = bardingName === '없음' ? null : b;
  renderPets(); save(); closeModal();
}

// ── 스킬 모달 ──
function openPetSkills(i) {
  const p = state.pets[i];
  if (!p.skills) p.skills = {};
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'pet-skills';
  document.getElementById('modal-title').textContent = '📖 ' + p.name + ' — 스킬';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) searchEl.style.display = 'none';
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  modalSelected = null;
  // 리스트만 표시, 디테일 숨김, 모달 축소
  const listEl = document.querySelector('.modal-list');
  if (listEl) { listEl.style.display = ''; listEl.style.width = '100%'; listEl.style.borderRight = 'none'; }
  const detail = document.getElementById('modal-detail');
  if (detail) detail.style.display = 'none';
  const modalEl = document.querySelector('.modal');
  if (modalEl && window.innerWidth > 900) { modalEl.style.maxWidth = '400px'; modalEl.style.height = '70vh'; }

  renderPetSkillList(i);
}

function renderPetSkillList(i) {
  const p = state.pets[i];
  if (!p.skills) p.skills = {};
  const container = document.getElementById('modal-options');
  container.innerHTML = '';
  const lv = getLevel();
  SKILLS.forEach(sk => {
    const rank = parseInt(p.skills[sk.id] || 0);
    const mod = p[sk.attr] || 0;
    const total = mod + (rank > 0 ? rank + lv : 0);
    const rankLabel = RANK_LABELS[String(rank)] || '미숙련';
    const rankClass = RANK_CLASSES[String(rank)] || '';
    const row = document.createElement('div');
    row.className = 'opt-row';
    row.innerHTML = `
      <span class="prof-rank-badge ${rankClass}" style="flex-shrink:0;">${RANK_LETTERS[String(rank)]||'U'}</span>
      <span style="flex:1;font-size:12px;color:var(--text);">${sk.name} <span style="color:var(--text2);font-size:10px;">${sk.en}</span></span>
      <span style="font-size:13px;font-weight:700;color:var(--accent);width:30px;text-align:right;">${total>=0?'+':''}${total}</span>`;
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      // 숙련 순환: 0→2→4→6→8→0
      const next = rank >= 8 ? 0 : rank + 2;
      p.skills[sk.id] = next;
      save();
      renderPetSkillList(i);
    });
    container.appendChild(row);
  });
}

// ── 상태이상 모달 ──
function openPetConditions(i) {
  const p = state.pets[i];
  if (!p.conditions) p.conditions = {};
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'pet-conditions';
  document.getElementById('modal-title').textContent = '⚠ ' + p.name + ' — 상태이상';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; }
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) confirmBtn.style.display = 'none';
  // PC: 리스트+디테일 모두 표시
  const listEl = document.querySelector('.modal-list');
  if (listEl) { listEl.style.display = ''; listEl.style.width = ''; listEl.style.borderRight = ''; }
  const detail = document.getElementById('modal-detail');
  if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">상태이상을 선택하면 상세 정보가 표시됩니다.</div>'; }

  renderPetCondList(i);
}

function renderPetCondList(i) {
  const p = state.pets[i];
  if (!p.conditions) p.conditions = {};
  const q = document.getElementById('modal-search')?.value?.toLowerCase() || '';
  const container = document.getElementById('modal-options');
  container.innerHTML = '';

  CONDITIONS_DATA.forEach(c => {
    if (c.name === '파손됨') return; // 장비 상태이므로 제외
    if (q && !c.name.includes(q) && !c.en.toLowerCase().includes(q)) return;
    const current = p.conditions[c.name] || 0;
    const isActive = c.valued ? current > 0 : !!current;
    const row = document.createElement('div');
    row.className = 'opt-row';
    row.style.cursor = 'pointer';
    row.innerHTML = `
      <div class="opt-row-icon" style="${isActive ? 'background:var(--red-bg);color:var(--red-light);' : ''}">${isActive ? '⚠' : '◻'}</div>
      <div style="flex:1;">
        <div class="opt-row-name">${c.name} <span style="color:var(--text2);font-size:10px;">${c.en}</span></div>
        <div style="font-size:10px;color:var(--text2);margin-top:2px;">${c.desc.substring(0, 60)}...</div>
      </div>
      ${isActive ? '<span style="color:var(--red-light);font-size:11px;font-weight:600;">' + (c.valued ? current : '활성') + '</span>' : ''}`;
    row.onclick = () => {
      const curVal = p.conditions[c.name] || 0;
      const statusText = c.valued ? `현재 수치: ${curVal}` + (c.max ? ` / ${c.max}` : '') : (curVal ? '활성' : '비활성');
      const btnHtml = `<div style="display:flex;gap:6px;margin-top:12px;">
        <button onclick="event.stopPropagation();petCondChange(${i},'${c.name}',1)" style="flex:1;padding:8px;background:var(--red-bg);color:var(--red-light);border:1px solid var(--red);border-radius:4px;cursor:pointer;font-size:12px;">${c.valued ? '+1 증가' : '적용'}</button>
        <button onclick="event.stopPropagation();petCondChange(${i},'${c.name}',-1)" style="flex:1;padding:8px;background:var(--bg4);color:var(--text2);border:1px solid var(--border2);border-radius:4px;cursor:pointer;font-size:12px;">${c.valued ? '-1 감소' : '해제'}</button>
      </div>`;

      if (window.innerWidth > 900) {
        // PC: 디테일 패인
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

  const searchEl = document.getElementById('modal-search');
  if (searchEl && !searchEl._petCondBound) {
    searchEl.addEventListener('input', () => renderPetCondList(i));
    searchEl._petCondBound = true;
  }
}

function petCondChange(i, name, dir) {
  const p = state.pets[i];
  if (!p.conditions) p.conditions = {};
  const cdata = CONDITIONS_DATA.find(c => c.name === name);
  if (!cdata) return;
  if (cdata.valued) {
    let cur = p.conditions[name] || 0;
    cur = dir > 0 ? Math.min(cur + 1, cdata.max || 99) : Math.max(cur - 1, 0);
    p.conditions[name] = cur;
  } else {
    p.conditions[name] = dir > 0 ? 1 : 0;
  }
  renderPets();
  save();
  renderPetCondList(i);
}

// ═══════════════════════════════════════════════
//  FAMILIARS (사역마)
// ═══════════════════════════════════════════════

const FAMILIAR_ABILITIES = [
  // 펫 능력 (Pet Feat abilities)
  {id:'amphibious',name:'수륙양생',en:'Amphibious',desc:'육지와 수중 모두 호흡 가능. 가장 높은 육상/수영 속도와 같은 육상 속도와 수영 속도를 얻습니다.'},
  {id:'burrower',name:'굴착',en:'Burrower',desc:'5피트 굴착 속도를 얻어 작은 구멍을 팝니다.'},
  {id:'climber',name:'등반',en:'Climber',desc:'25피트 등반 속도를 얻습니다.'},
  {id:'darkvision',name:'암시야',en:'Darkvision',desc:'암시야를 얻습니다.'},
  {id:'echolocation',name:'반향정위',en:'Echolocation',desc:'20피트 이내 청각을 정밀 감각으로 사용할 수 있습니다.'},
  {id:'fast',name:'빠른 이동',en:'Fast Movement',desc:'속도 중 하나가 25피트에서 40피트로 증가합니다.'},
  {id:'flier',name:'비행',en:'Flier',desc:'25피트 비행 속도를 얻습니다.'},
  {id:'manual-dex',name:'손재주',en:'Manual Dexterity',desc:'앞발 2개를 손처럼 사용하여 조작 행동을 할 수 있습니다.'},
  {id:'scent',name:'후각',en:'Scent',desc:'30피트 이내 부정확 후각 감각을 얻습니다.'},
  {id:'tough',name:'강인',en:'Tough',desc:'레벨당 최대 HP가 2 증가합니다.'},
  // 사역마 전용 능력
  {id:'accompanist',name:'반주자',en:'Accompanist',desc:'공연 판정 시 사역마가 함께 연주하여 +1 상황 보너스 (+2 달인 이상).'},
  {id:'construct',name:'구조체',en:'Construct',desc:'동물 특성 대신 구조체 특성. 사망/질병/탈진/피로/치유/마비/독/메스꺼움/의식불명/공허 면역. 강인 능력 필요.'},
  {id:'damage-avoid',name:'피해 회피',en:'Damage Avoidance',desc:'내성 유형 1개 선택. 해당 내성에 성공하면 피해를 받지 않음 (다른 효과는 적용).'},
  {id:'dragon',name:'드래곤',en:'Dragon',desc:'동물 특성 대신 드래곤 특성을 얻습니다.'},
  {id:'elemental',name:'원소',en:'Elemental',desc:'동물 특성 대신 원소 특성. 공기/땅/불/금속/물/나무 중 선택. 출혈/마비/독/수면/해당 원소 면역.'},
  {id:'focused-rejuv',name:'집중 회복',en:'Focused Rejuvenation',desc:'재집중 시 사역마가 레벨당 HP 1점 회복합니다.'},
  {id:'fungus',name:'균류',en:'Fungus',desc:'동물 특성 대신 균류 특성을 얻습니다.'},
  {id:'independent',name:'독립',en:'Independent',desc:'명령하지 않아도 매 라운드 1행동을 자체적으로 사용합니다.'},
  {id:'kinspeech',name:'동족어',en:'Kinspeech',desc:'같은 종의 동물과 대화 가능. 말하기 능력 + 6레벨 이상 필요.'},
  {id:'major-resist',name:'상위 저항',en:'Major Resistance',desc:'저항 능력의 저항값이 레벨과 같아집니다. 8레벨 이상 필요.'},
  {id:'master-form',name:'주인의 형상',en:'Master\'s Form',desc:'1행동으로 인간형 변신. 손재주+말하기 능력 필요.'},
  {id:'partner-crime',name:'범죄 동료',en:'Partner in Crime',desc:'기만/도둑질로 도움 시 자동 성공 (달인이면 대성공).'},
  {id:'plant',name:'식물',en:'Plant',desc:'동물 특성 대신 식물 특성을 얻습니다.'},
  {id:'plant-form',name:'식물 형태',en:'Plant Form',desc:'1행동으로 작은 식물로 변신. 식물 특성 필요.'},
  {id:'resistance',name:'저항',en:'Resistance',desc:'산, 냉기, 전기, 불, 독, 음파 중 2개 선택. 레벨 절반 저항 (최소 1).'},
  {id:'skilled',name:'숙련',en:'Skilled',desc:'곡예/은신 외 기술 1개 선택. 해당 기술 수정치 = 레벨 + 주문시전 속성 수정치.'},
  {id:'speech',name:'말하기',en:'Speech',desc:'주인이 아는 언어 1개를 이해하고 말할 수 있습니다.'},
  {id:'spellcasting',name:'주문시전',en:'Spellcasting',desc:'하루 1회 주문 시전 가능 (최고 랭크보다 5 낮은 주문). 6랭크 이상 필요.'},
  {id:'toolbearer',name:'도구 운반',en:'Toolbearer',desc:'가벼운 부피의 도구를 운반. 인접 시 도구 사용 가능. 손재주 필요.'},
  {id:'touch-telepathy',name:'접촉 텔레파시',en:'Touch Telepathy',desc:'접촉으로 주인과 텔레파시 소통. 말하기 능력 있으면 같은 언어 사용자와도 가능.'},
  {id:'valet',name:'시종',en:'Valet',desc:'턴 종료 전 2회까지 가벼운 부피 아이템을 가져와 주인 빈 손에 놓을 수 있습니다.'},
];

function addFamiliar() {
  if (!state.pets) state.pets = [];
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'familiar-add';
  document.getElementById('modal-title').textContent = '🐱 사역마 추가';
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

  const lv = getLevel();
  const spellAttr = getClassKeyAttr() || 'cha';
  const spellMod = getMod(spellAttr);
  const hp = 5 * lv;
  // AC/내성 = 주인과 동일
  const masterAC = parseInt(document.getElementById('val-ac')?.textContent || 10);
  const masterFort = parseInt(document.getElementById('val-fort')?.textContent || 0);
  const masterRef = parseInt(document.getElementById('val-ref')?.textContent || 0);
  const masterWill = parseInt(document.getElementById('val-will')?.textContent || 0);
  const percMod = Math.max(spellMod + lv, 3 + lv);

  const container = document.getElementById('modal-options');
  container.innerHTML = `<div style="padding:16px;">
    <div style="border-left:3px solid var(--accent);padding-left:10px;margin-bottom:12px;">
      <div style="font-size:12px;color:var(--text2);line-height:1.6;">
        사역마는 마법적 유대로 연결된 작은 생물입니다.<br>
        <strong>HP:</strong> 5 × 레벨 = <strong style="color:var(--text);">${hp}</strong><br>
        <strong>AC:</strong> 주인과 동일 = <strong style="color:var(--text);">${masterAC}</strong><br>
        <strong>내성:</strong> 주인과 동일 (인내 ${masterFort>=0?'+':''}${masterFort}, 반사 ${masterRef>=0?'+':''}${masterRef}, 의지 ${masterWill>=0?'+':''}${masterWill})<br>
        <strong>지각/곡예/은신:</strong> 주문시전 속성(${spellAttr.toUpperCase()}) + 레벨 = <strong style="color:var(--text);">${percMod>=0?'+':''}${percMod}</strong><br>
        <strong>크기:</strong> 극소형 (Tiny)<br>
        <strong>속도:</strong> 25피트<br>
        <strong>능력:</strong> 매일 2개 선택 (재주로 증가 가능)
      </div>
    </div>
    <div style="margin-bottom:12px;">
      <label style="font-size:10px;color:var(--text2);">사역마 이름</label>
      <input id="familiar-name" placeholder="이름..." style="width:100%;background:var(--bg3);border:1px solid var(--border2);color:var(--text);padding:6px;border-radius:4px;font-size:14px;">
    </div>
    <div style="margin-bottom:12px;">
      <label style="font-size:10px;color:var(--text2);">외형 (박쥐, 고양이, 여우, 까마귀, 뱀 등)</label>
      <input id="familiar-form" placeholder="고양이" style="width:100%;background:var(--bg3);border:1px solid var(--border2);color:var(--text);padding:6px;border-radius:4px;font-size:13px;">
    </div>
    <button onclick="createFamiliar()" style="width:100%;padding:10px;background:var(--accent);color:#000;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;">생성</button>
  </div>`;
}

function createFamiliar() {
  const name = document.getElementById('familiar-name')?.value;
  const form = document.getElementById('familiar-form')?.value || '고양이';
  if (!name) { alert('이름을 입력하세요.'); return; }

  const lv = getLevel();
  const spellAttr = getClassKeyAttr() || 'cha';
  const spellMod = getMod(spellAttr);
  const hp = 5 * lv;
  const masterAC = parseInt(document.getElementById('val-ac')?.textContent || 10);
  const masterFort = parseInt(document.getElementById('val-fort')?.textContent || 0);
  const masterRef = parseInt(document.getElementById('val-ref')?.textContent || 0);
  const masterWill = parseInt(document.getElementById('val-will')?.textContent || 0);
  const percMod = Math.max(spellMod + lv, 3 + lv);

  if (!state.pets) state.pets = [];
  state.pets.push({
    name, type: '사역마', isFamiliar: true, familiarForm: form,
    hp: {cur: hp, max: hp},
    ac: masterAC, speed: 25, size: '극소형',
    str: -1, dex: 1, con: 0, int: -1, wis: 1, cha: -1,
    fort: masterFort, ref: masterRef, will: masterWill,
    perc: percMod,
    senses: '저광 시야',
    attacks: [],
    familiarAbilities: [], // 선택된 능력 ID 목록
    maxAbilities: 2,
    notes: '외형: ' + form,
  });
  renderPets(); save(); closeModal();
}

function openFamiliarAbilities(petIdx) {
  const p = state.pets[petIdx];
  if (!p.familiarAbilities) p.familiarAbilities = [];
  const max = p.maxAbilities || 2;

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('hidden');
  modalType = 'familiar-abilities';
  document.getElementById('modal-title').textContent = '🐱 ' + p.name + ' — 능력 선택 (' + p.familiarAbilities.length + '/' + max + ')';
  const searchEl = document.getElementById('modal-search');
  if (searchEl) { searchEl.style.display = ''; searchEl.value = ''; }
  const fbar = document.getElementById('modal-filterbar');
  if (fbar) fbar.innerHTML = '';
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) { confirmBtn.style.display = ''; confirmBtn.textContent = '완료'; }
  modalSelected = null;
  const listEl = document.querySelector('.modal-list');
  if (listEl) { listEl.style.display = ''; listEl.style.width = ''; listEl.style.borderRight = ''; }
  const detail = document.getElementById('modal-detail');
  if (detail) { detail.style.display = ''; detail.innerHTML = '<div class="modal-detail-empty">능력을 선택하면 상세 정보가 표시됩니다.</div>'; }

  renderFamiliarAbilityList(petIdx);
}

function renderFamiliarAbilityList(petIdx) {
  const p = state.pets[petIdx];
  const selected = p.familiarAbilities || [];
  const max = p.maxAbilities || 2;
  const isFull = selected.length >= max;
  const q = document.getElementById('modal-search')?.value?.toLowerCase() || '';
  const container = document.getElementById('modal-options');
  container.innerHTML = '';

  const titleEl = document.getElementById('modal-title');
  if (titleEl) titleEl.textContent = '🐱 ' + p.name + ' — 능력 선택 (' + selected.length + '/' + max + ')';

  FAMILIAR_ABILITIES.forEach(a => {
    if (q && !a.name.includes(q) && !a.en.toLowerCase().includes(q)) return;
    const isSelected = selected.includes(a.id);
    const row = document.createElement('div');
    row.className = 'opt-row' + (isSelected ? ' selected' : '');
    if (!isSelected && isFull) row.style.opacity = '0.4';
    row.innerHTML = `
      <div class="opt-row-icon">${isSelected ? '✓' : '✦'}</div>
      <div style="flex:1;">
        <div class="opt-row-name">${a.name} <span style="color:var(--text2);font-size:10px;">${a.en}</span></div>
      </div>`;
    row.style.cursor = (isSelected || !isFull) ? 'pointer' : 'default';

    row.addEventListener('click', () => {
      // PC: 디테일 표시
      const detail = document.getElementById('modal-detail');
      if (detail && window.innerWidth > 900) {
        container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
        row.classList.add('selected');
        detail.innerHTML = `<div class="modal-detail-title">${a.name}</div>
          <div class="modal-detail-en">${a.en}</div>
          <div class="modal-detail-desc" style="margin-top:10px;">${a.desc}</div>
          <button onclick="toggleFamiliarAbility(${petIdx},'${a.id}')" style="width:100%;margin-top:12px;padding:8px;background:${isSelected?'var(--red-bg)':'var(--accent)'};color:${isSelected?'var(--red-light)':'#000'};border:${isSelected?'1px solid var(--red)':'none'};border-radius:4px;cursor:pointer;font-size:13px;font-weight:600;">${isSelected ? '해제' : '선택'}</button>`;
      } else {
        // 모바일: 직접 토글
        toggleFamiliarAbility(petIdx, a.id);
      }
    });
    container.appendChild(row);
  });

  const searchEl = document.getElementById('modal-search');
  if (searchEl && !searchEl._famAbBound) {
    searchEl.addEventListener('input', () => renderFamiliarAbilityList(petIdx));
    searchEl._famAbBound = true;
  }
}

function toggleFamiliarAbility(petIdx, abilityId) {
  const p = state.pets[petIdx];
  if (!p.familiarAbilities) p.familiarAbilities = [];
  const max = p.maxAbilities || 2;
  const idx = p.familiarAbilities.indexOf(abilityId);
  if (idx >= 0) {
    p.familiarAbilities.splice(idx, 1);
  } else if (p.familiarAbilities.length < max) {
    p.familiarAbilities.push(abilityId);
  }
  renderPets(); save();
  renderFamiliarAbilityList(petIdx);
}

