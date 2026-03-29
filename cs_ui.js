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
  // 제목 행
  const header = document.createElement('div');
  header.className = 'equip-row';
  header.style.cssText = 'font-size:10px;color:var(--text2);border-bottom:1px solid var(--border);padding:2px 4px;';
  header.innerHTML = `<span style="flex:1;">아이템</span><span style="width:30px;text-align:center;">부피</span><span style="width:70px;text-align:center;">수량</span><span style="width:60px;text-align:center;">장착</span><span style="width:24px;"></span>`;
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
      <span style="flex:1;font-size:12px;color:var(--text);cursor:pointer;" onclick="showInfo('${eqType}','${eqEscName}')">${e.name||'아이템'}</span>
      <span style="width:30px;text-align:center;font-size:10px;color:var(--text2);">${bulkDisplay}</span>
      <span style="width:70px;display:flex;align-items:center;justify-content:center;gap:2px;">
        <button class="qty-btn" onclick="event.stopPropagation();changeQty(${i},-1)">−</button>
        <span style="min-width:16px;text-align:center;font-size:13px;font-weight:600;color:var(--text);">${e.qty||1}</span>
        <button class="qty-btn" onclick="event.stopPropagation();changeQty(${i},1)">+</button>
      </span>
      <span style="width:60px;text-align:center;">${equipBtnHtml}</span>
      <span style="width:24px;text-align:center;">
        ${hasContainers ? `<span style="cursor:pointer;font-size:12px;color:var(--text2);" onclick="event.stopPropagation();moveToContainer(${i})" title="배낭으로 이동">📦</span>` : ''}
      </span>`;
    list.appendChild(row);
  });
  recalcBulk();
}

function moveToContainer(itemIdx) {
  if (!state.containers || state.containers.length === 0) return;
  const item = state.equip[itemIdx];
  if (!item) return;
  const names = state.containers.map((c,i) => `${i+1}. ${c.name}`).join('\n');
  const choice = prompt('이동할 배낭 번호를 입력하세요:\n' + names);
  if (!choice) return;
  const ci = parseInt(choice) - 1;
  if (ci < 0 || ci >= state.containers.length) return;
  state.containers[ci].items.push({name: item.name, qty: item.qty||1, bulk: item.bulk||0});
  state.equip.splice(itemIdx, 1);
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
  ['class','focus','ritual'].forEach(t => {
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
  // 집중 캔트립과 집중 주문 분리 렌더링
  const focusCantrips = (state.spells.focus || []).filter(s => s?._auto && s?.name?.includes('캔트립'));
  const focusRegular = (state.spells.focus || []).filter(s => !focusCantrips.includes(s));
  renderSpellSlotList('spells-focus-cantrips', focusCantrips, 'focus');
  renderSpellSlotList('spells-focus', focusRegular, 'focus');

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

function addPet() {
  if (!state.pets) state.pets = [];
  const name = prompt('반려동물 이름:');
  if (!name) return;
  state.pets.push({
    name, type:'동물 친구',
    hp:{cur:0,max:0}, ac:10, speed:25, size:'소형',
    str:0,dex:0,con:0,int:-4,wis:0,cha:0,
    fort:0,ref:0,will:0,perc:0,
    senses:'저광 시야',
    attacks:[],
    notes:''
  });
  renderPets();
  save();
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

function petHpChange(i, delta) {
  const p = state.pets[i];
  if (delta > 0) p.hp.cur = Math.min(p.hp.max, p.hp.cur + delta);
  else p.hp.cur = Math.max(0, p.hp.cur + delta);
  renderPets();
  save();
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
    el.innerHTML += `
    <div class="box" style="margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div>
          <span style="font-size:14px;font-weight:700;color:var(--accent);">${p.name}</span>
          <span style="font-size:10px;color:var(--text2);margin-left:6px;">${p.type||''}</span>
        </div>
        <div style="display:flex;gap:4px;">
          <button class="defense-btn" onclick="editPet(${i})">편집</button>
          <button class="defense-btn" onclick="openPetBarding(${i})">마갑</button>
          <button class="defense-btn" onclick="openPetSkills(${i})">스킬</button>
          <button class="defense-btn" onclick="openPetConditions(${i})">상태</button>
          <button class="defense-btn danger" onclick="removePet(${i})">삭제</button>
        </div>
      </div>
      <!-- AC + HP -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;">
        <div class="ac-shield" style="width:40px;height:40px;font-size:16px;line-height:40px;">${p.ac}</div>
        <div style="flex:1;">
          <div style="position:relative;background:var(--bg4);border:1px solid var(--border);border-radius:4px;height:22px;overflow:hidden;cursor:pointer;" onclick="petHpChange(${i}, parseInt(prompt('HP 변경량 (+회복 / -피해):'))||0)">
            <div style="position:absolute;left:0;top:0;bottom:0;width:${hpPct}%;background:${hpColor};border-radius:3px;transition:width .3s;"></div>
            <div style="position:relative;z-index:1;display:flex;align-items:center;justify-content:center;height:100%;font-size:11px;font-weight:700;color:#fff;">HP ${p.hp.cur}/${p.hp.max}</div>
          </div>
        </div>
      </div>
      ${p.barding && p.barding !== '없음' ? `<div style="font-size:10px;color:var(--text2);margin-bottom:4px;">🛡 마갑: <strong style="color:var(--text);">${p.barding}</strong></div>` : ''}
      ${(p.conditions && Object.keys(p.conditions).some(k=>p.conditions[k]>0)) ? `<div style="font-size:10px;color:var(--red-light);margin-bottom:4px;">⚠ ${Object.entries(p.conditions).filter(([,v])=>v>0).map(([k,v])=>{const cd=CONDITIONS_DATA.find(c=>c.name===k);return cd?.valued?k+' '+v:k;}).join(', ')}</div>` : ''}
      <!-- Info row -->
      <div style="display:flex;gap:8px;font-size:10px;color:var(--text2);margin-bottom:6px;flex-wrap:wrap;">
        <span>이동 <strong style="color:var(--text);">${p.speed}</strong>피트</span>
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
  let _bardingPetIdx = i;
  let _bardingSelected = null;
  const confirmBtn = document.querySelector('.btn-confirm');
  if (confirmBtn) { confirmBtn.style.display = ''; confirmBtn.textContent = '장착'; confirmBtn.onclick = () => {
    if (_bardingSelected) {
      p.barding = _bardingSelected.name === '없음' ? null : _bardingSelected.name;
      p.bardingData = _bardingSelected.name === '없음' ? null : _bardingSelected;
      renderPets(); save();
    }
    closeModal();
  };}
  const listEl = document.querySelector('.modal-list');
  if (listEl) listEl.style.display = '';
  const detail = document.getElementById('modal-detail');
  if (detail) detail.innerHTML = '<div class="modal-detail-empty">마갑을 선택하면 상세 정보가 표시됩니다.</div>';

  const container = document.getElementById('modal-options');
  container.innerHTML = '';
  BARDING_DB.forEach(b => {
    const isCur = (p.barding === b.name);
    const row = document.createElement('div');
    row.className = 'opt-row' + (isCur ? ' selected' : '');
    row.style.cursor = 'pointer';
    row.innerHTML = `
      <div class="opt-row-icon">${isCur ? '✓' : '🛡'}</div>
      <div style="flex:1;">
        <div class="opt-row-name">${b.name} ${b.category !== '없음' ? '<span style="color:var(--text2);font-size:10px;">('+b.category+')</span>' : ''}</div>
      </div>`;
    row.addEventListener('click', () => {
      _bardingSelected = b;
      container.querySelectorAll('.opt-row').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      if (detail) {
        if (b.ac > 0) {
          detail.innerHTML = `<div class="modal-detail-title">${b.name}</div>
            <div class="modal-detail-tags"><span class="tag hl">${b.category}</span></div>
            <div class="modal-detail-desc">
              <strong>AC 보너스:</strong> +${b.ac}<br>
              <strong>민첩 상한:</strong> +${b.dex}<br>
              <strong>판정 페널티:</strong> ${b.check}<br>
              <strong>속도 페널티:</strong> ${b.speed}피트<br>
              <strong>부피:</strong> ${b.bulk}
            </div>`;
        } else {
          detail.innerHTML = '<div class="modal-detail-title">없음</div><div class="modal-detail-desc">마갑을 장착하지 않습니다.</div>';
        }
      }
    });
    container.appendChild(row);
  });
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

