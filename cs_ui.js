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
  card.innerHTML = `
    <div class="defense-card-header">
      <button class="defense-btn" onclick="openModal('armor')">변경</button>
      <button class="defense-btn" onclick="showArmorRunePopup()">룬</button>
      <button class="defense-btn" onclick="toggleArmorStow()">${stowed?'장착':'보관'}</button>
      <span style="flex:1;"></span>
      ${name ? `<button class="defense-btn danger" onclick="clearArmor()">해제</button>` : ''}
    </div>
    <div class="defense-card-body">
      <div class="defense-card-name">
        <span class="weapon-prof-badge ${profCls}" style="font-size:8px;width:14px;height:14px;">${profLetter}</span>
        ${name || '갑옷 없음'}
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

  card.className = 'defense-card' + (stowed ? ' stowed' : '');
  card.innerHTML = `
    <div class="defense-card-header">
      <button class="defense-btn" onclick="openModal('shield')">변경</button>
      ${name ? `<button class="defense-btn" onclick="showInfo('shield','${name.replace(/'/g,"\\'")}')">정보</button>` : ''}
      ${name ? `<button class="defense-btn danger" onclick="clearShield()">제거</button>` : ''}
      <button class="defense-btn" onclick="toggleShieldStow()">${stowed?'장착':'보관'}</button>
    </div>
    <div class="defense-card-body">
      <div class="defense-card-name">${name || '방패 없음'}</div>
      ${name ? `
      <div class="defense-card-stats">
        <span class="stat-item">🛡 Raised AC <span class="stat-val">+${ac}</span></span>
        <span class="stat-item">⚒ Hardness <span class="stat-val">${hard}</span></span>
        <span class="stat-item">❤ HP <span class="stat-val">${hp}</span> (BT ${bt})</span>
      </div>
      ` : ''}
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
  const cat = getWeaponCategory(w);
  const profSelId = 'prof-weapon-' + cat;
  const rank = parseInt(document.getElementById(profSelId)?.value || 0);
  const lv = getLevel();
  const profBonus = rank > 0 ? (rank + lv) : 0;

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

  return abilMod + profBonus + itemBonus;
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
            \u2694 ${w.name||'무기'}${runeInfo}
          </div>
          <div class="weapon-stat">
            <span class="stat-label">\u2699 명중</span>
            <span class="stat-val">${hitStr}</span>
          </div>
          <div class="weapon-stat">
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
  const d = data || {name:'',qty:1,bulk:0};
  state.equip.push(d);
  renderEquip();
}

function renderEquip() {
  const list = document.getElementById('equip-list');
  list.innerHTML = '';
  state.equip.forEach((e,i) => {
    const row = document.createElement('div');
    row.className = 'equip-row';
    const isWeapon = e._type === 'weapon';
    const isArmor = e._type === 'armor';
    const isShield = e._type === 'shield';
    const equipped = e._equipped;
    const equipBtn = (isWeapon || isArmor || isShield)
      ? `<span class="equip-btn ${equipped?'equipped':''}" onclick="toggleEquip(${i})" title="${equipped?'장착 해제':'장착'}">${equipped?(isShield?'🛡':'⚔'):'◻'}</span>`
      : '';
    const eqType = isWeapon ? 'weapon' : (isArmor ? 'armor' : (isShield ? 'shield' : 'gear'));
    const eqEscName = (e.name||'').replace(/'/g,"\\'");
    row.innerHTML = `
      <input class="eq-name" placeholder="아이템 이름" value="${e.name||''}" style="flex:3;cursor:pointer;" oninput="state.equip[${i}].name=this.value;recalcBulk();save()" onclick="showInfo('${eqType}','${eqEscName}')">
      <input class="eq-qty" type="number" min="0" value="${e.qty||1}" style="width:36px;text-align:center;" oninput="state.equip[${i}].qty=parseInt(this.value);save()">
      <input class="eq-bulk" type="number" min="0" step="0.1" value="${e.bulk||0}" style="width:36px;text-align:center;" oninput="state.equip[${i}].bulk=parseFloat(this.value);recalcBulk();save()">
      ${equipBtn}
      <span class="spell-del" onclick="removeEquip(${i})">✕</span>`;
    list.appendChild(row);
  });
  recalcBulk();
}

function toggleEquip(i) {
  const item = state.equip[i];
  if (!item) return;
  item._equipped = !item._equipped;

  if (item._equipped && item._type === 'weapon' && item._data) {
    const w = item._data;
    addWeapon({name: w.name_ko, dmg: w.damage||'', traits: (w.traits||[]).join(', '), _dbData: w, category: w.category, range: w.range, _fromEquip:i});
  } else if (item._equipped && item._type === 'armor' && item._data) {
    const a = item._data;
    const nameEl = document.getElementById('armor-name');
    const acEl = document.getElementById('armor-ac');
    const dexEl = document.getElementById('armor-dex');
    if (nameEl) nameEl.value = a.name_ko;
    if (acEl) acEl.value = a.ac_bonus||0;
    if (dexEl) dexEl.value = a.dex_cap!==null && a.dex_cap!==undefined ? a.dex_cap : '-';
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

function removeEquip(i) { state.equip.splice(i,1); renderEquip(); save(); }

// ── 컨테이너 (서브 인벤토리) ──
function addContainer() {
  const name = prompt('컨테이너 이름 (예: 배낭, 벨트 주머니):');
  if (!name) return;
  if (!state.containers) state.containers = [];
  state.containers.push({name, items:[]});
  renderContainers();
  save();
}

function addContainerItem(ci) {
  const name = prompt('아이템 이름:');
  if (!name) return;
  state.containers[ci].items.push({name, qty:1, bulk:0});
  renderContainers();
  save();
}

function removeContainerItem(ci, ii) {
  state.containers[ci].items.splice(ii, 1);
  renderContainers();
  save();
}

function removeContainer(ci) {
  if (!confirm(state.containers[ci].name + ' 컨테이너를 삭제합니까?')) return;
  state.containers.splice(ci, 1);
  renderContainers();
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
        <span>📦 ${c.name}</span>
        <span class="spell-del" onclick="removeContainer(${ci})" style="cursor:pointer;">✕</span>
      </div>`;
    c.items.forEach((item, ii) => {
      html += `<div style="display:flex;align-items:center;gap:4px;padding:2px 4px;border-bottom:1px solid var(--border);font-size:12px;">
        <span style="flex:3;color:var(--text);">${item.name}</span>
        <input type="number" value="${item.qty}" min="0" style="width:36px;text-align:center;background:var(--bg3);border:1px solid var(--border);color:var(--text);border-radius:3px;font-size:11px;"
          oninput="state.containers[${ci}].items[${ii}].qty=parseInt(this.value||0);save()">
        <input type="number" value="${item.bulk}" min="0" step="0.1" style="width:36px;text-align:center;background:var(--bg3);border:1px solid var(--border);color:var(--text);border-radius:3px;font-size:11px;"
          oninput="state.containers[${ci}].items[${ii}].bulk=parseFloat(this.value||0);save()">
        <span class="spell-del" onclick="removeContainerItem(${ci},${ii})" style="cursor:pointer;width:20px;text-align:center;">✕</span>
      </div>`;
    });
    html += `<button class="add-btn" onclick="addContainerItem(${ci})" style="margin-top:4px;">+ 아이템 추가</button></div>`;
    el.innerHTML += html;
  });
}

// ── 제조법 (레시피) ──
function addFormula() {
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
  document.getElementById('spell-subtab-class').classList.toggle('active', tab==='class');
  document.getElementById('spell-subtab-ritual').classList.toggle('active', tab==='ritual');
  document.getElementById('spell-content-class').style.display = tab==='class' ? '' : 'none';
  document.getElementById('spell-content-ritual').style.display = tab==='ritual' ? '' : 'none';
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
  const lv = getLevel();
  const maxRank = Math.min(10, Math.ceil(lv / 2));
  const heightenedLevel = Math.max(1, Math.ceil(lv / 2));

  // Update sub-tab label with class name
  const subtabClass = document.getElementById('spell-subtab-class');
  if (subtabClass) {
    subtabClass.textContent = state.selectedClass ? state.selectedClass.name : '주문';
  }

  // Update TEML badges
  updateSpellTemlBadges();
  // Update breakdown
  updateSpellBreakdown();

  // ── Cantrips ──
  const cantripHeader = document.getElementById('cantrip-header');
  if (cantripHeader) cantripHeader.textContent = `캔트립 (강화 랭크 ${heightenedLevel})`;

  const cantripSlots = state.cantripSlots || 5;
  const cantripEl = document.getElementById('spells-cantrip');
  if (cantripEl) {
    cantripEl.innerHTML = '';
    const totalCantrips = Math.max(cantripSlots, (state.spells.cantrip||[]).length);
    for (let i = 0; i < totalCantrips; i++) {
      const spell = state.spells.cantrip[i] || null;
      const isAuto = spell?._auto;
      const row = document.createElement('div');
      row.className = 'spell-slot-row';
      if (spell) {
        const spellData = (typeof SPELL_DB !== 'undefined') ? SPELL_DB.find(sp => sp.name_ko === spell.name) : null;
        const actions = getActionIcons(spellData?.actions);
        row.innerHTML = `
          ${isAuto ? '<span style="color:var(--accent);font-size:9px;font-weight:700;width:30px;text-align:center;flex-shrink:0;">⚡</span>' : ''}
          <span class="spell-slot-name" onclick="showInfo('spell','${spell.name.replace(/'/g,"\\'")}')">${spell.name}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}</span>
          <span class="spell-slot-dur">\u2014</span>
          <span class="spell-slot-range">\u2014</span>
          ${isAuto ? '<span style="width:20px;"></span>' : `<span class="spell-slot-del" onclick="removeSpellFromSlot('cantrip',${i})">✕</span>`}`;
      } else if (i < cantripSlots) {
        row.innerHTML = `
          <span class="spell-slot-name empty" onclick="pickSpellForSlot('cantrip',0,${i})">선택 안 됨</span>
          <span class="spell-slot-dur"></span>
          <span class="spell-slot-range"></span>
          <span style="width:20px;"></span>`;
      }
      if (spell || i < cantripSlots) cantripEl.appendChild(row);
    }
  }

  // ── Focus spells ──
  renderSpellSlotList('spells-focus', state.spells.focus, 'focus');
  // Update FP mirrors
  const fpCurMirror = document.getElementById('fp-cur-mirror');
  const fpMaxMirror = document.getElementById('fp-max-mirror');
  if (fpCurMirror) fpCurMirror.textContent = document.getElementById('fp-cur')?.value || '0';
  if (fpMaxMirror) fpMaxMirror.textContent = document.getElementById('fp-max')?.value || '0';

  // ── Divine Font (Cleric) ──
  const dfSection = document.getElementById('spell-divine-font-section');
  const dfBody = document.getElementById('divine-font-body');
  if (dfSection && dfBody) {
    if (state.divineFont && state.selectedClass?.id === 'cleric') {
      dfSection.style.display = '';
      const isHeal = state.divineFont === 'heal';
      const spellName = isHeal ? '치유 (Heal)' : '해악 (Harm)';
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
          <span style="font-size:14px;font-weight:600;color:var(--text);">${spellName}</span>
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
    const spellsAtRank = state.spells.known.filter(s => s.rank === r);

    const section = document.createElement('div');
    section.className = 'spell-rank-section';

    // Rank header with slot count editor
    const header = document.createElement('div');
    header.className = 'spell-rank-header';
    header.innerHTML = `주문 랭크 ${r}
      <span style="float:right;font-size:11px;color:var(--text2);">
        슬롯: <input class="inline-edit" type="number" value="${slotMax}" min="0" max="10"
          style="width:28px;font-size:11px;" oninput="state.spellSlots=state.spellSlots||{};state.spellSlots[${r}]=parseInt(this.value);renderSpells();save()">
      </span>`;
    section.appendChild(header);

    // Fire icons for slot tracking (star-rating: click Nth = fill 1..N, click filled = unfill from N)
    if (slotMax > 0) {
      const firesDiv = document.createElement('div');
      firesDiv.className = 'spell-slots-used';
      firesDiv.innerHTML = '<span style="font-size:10px;color:var(--text2);margin-right:4px;">슬롯:</span>';
      // Count how many are used (progressive from left)
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

    // Render spell slots (max of slotMax or actual spells count)
    const totalSlots = Math.max(slotMax, spellsAtRank.length);
    for (let i = 0; i < totalSlots; i++) {
      const spell = spellsAtRank[i] || null;
      const row = document.createElement('div');
      row.className = 'spell-slot-row';

      // Cast label (clickable to toggle)
      const isCast = !!(state.spellSlotsUsed?.[r]?.[i]);

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

function removeSpellFromSlot(type, index) {
  if (type === 'cantrip') {
    state.spells.cantrip.splice(index, 1);
  }
  renderSpells();
  save();
}

function renderSpellSlotList(elId, arr, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = '';
  arr.forEach((s, i) => {
    const isAuto = s?._auto;
    const spellData = (typeof SPELL_DB !== 'undefined') ? SPELL_DB.find(sp => sp.name_ko === s.name) : null;
    const actions = getActionIcons(spellData?.actions);
    const row = document.createElement('div');
    row.className = 'spell-slot-row';
    row.innerHTML = `
      ${isAuto ? '<span style="color:var(--accent);font-size:9px;font-weight:700;width:30px;text-align:center;flex-shrink:0;">⚡</span>' : ''}
      <span class="spell-slot-name" onclick="showInfo('spell','${s.name.replace(/'/g,"\\'")}')">${s.name}${actions ? ' <span class="spell-actions-inline">'+actions+'</span>' : ''}</span>
      <span class="spell-slot-dur">\u2014</span>
      <span class="spell-slot-range">\u2014</span>
      ${isAuto ? '<span style="width:20px;"></span>' : `<span class="spell-slot-del" onclick="removeSpell('${type}',${i})">✕</span>`}`;
    el.appendChild(row);
  });
}

function renderSpellSlotChecks(parentEl, rank) {
  renderSpells();
}

function removeSpell(type, i) {
  state.spells[type].splice(i,1);
  renderSpells();
  save();
}

function addFeat(type) {
  const name = prompt('재주/능력 이름:');
  if (!name) return;
  state.feats[type].push({name, level:getLevel()});
  renderFeats();
  save();
}

function renderFeats() {
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
      if (isAuto) {
        div.innerHTML = `
          <div style="display:flex;align-items:center;gap:4px;width:100%;margin-bottom:2px;">
            <span style="color:var(--accent);font-size:10px;font-weight:700;flex-shrink:0;">⚡자동</span>
            <span style="flex:1;color:var(--text);font-size:12px;">${f.name}</span>
          </div>
          <div class="feat-src"><span style="color:var(--text2);font-size:10px;">Lv ${f.level||1} — 클래스 특성</span></div>`;
        div.addEventListener('click', () => showInfo('feat', f.name));
      } else {
        div.innerHTML = `
          <div style="display:flex;align-items:center;gap:4px;width:100%;margin-bottom:2px;">
            <span style="flex:1;color:var(--text);font-size:12px;">${f.name || labels[t] + ' 재주'}</span>
            <span class="spell-del" style="flex-shrink:0;">✕</span>
          </div>
          <div class="feat-src"><span style="color:var(--text2);font-size:10px;">Lv ${f.level||1}</span></div>`;
        div.addEventListener('click', (e) => { if (!e.target.classList.contains('spell-del')) showInfo('feat', f.name); });
        div.querySelector('.spell-del').addEventListener('click', (e) => { e.stopPropagation(); removeFeat(t, i); });
      }
      el.appendChild(div);
    });
  });
}

function removeFeat(t, i) { state.feats[t].splice(i,1); renderFeats(); save(); }

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
      <button class="btn-give" onclick="equipBrowseGive()">획득</button>
      <button class="btn-buy" onclick="equipBrowseBuy()">구매</button>
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

