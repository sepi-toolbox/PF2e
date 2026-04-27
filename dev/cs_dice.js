// ══════════════════════════════════════════════════════════════
// cs_dice.js — PF2e 캐릭터 시트 주사위 시스템 (독립 모듈)
// 기존 사이트 기능에 영향 없음. 완전 자체 namespace.
// ══════════════════════════════════════════════════════════════

const DiceRoller = (() => {
  'use strict';

  // ── 상수 ──
  const DICE_TYPES = [4, 6, 8, 10, 12, 20, 100];
  const DICE_COLORS = {4:'#e74c3c',6:'#e67e22',8:'#f1c40f',10:'#2ecc71',12:'#3498db',20:'#9b59b6',100:'#95a5a6'};
  const MAX_LOG = 50;
  const TOAST_DURATION = 4000;

  // ── 상태 ──
  let pool = [];          // 현재 풀에 담긴 주사위 [{sides, count}]
  let rollLog = [];       // 굴림 기록
  let trayOpen = false;
  let logOpen = false;
  let _rollCallback = null; // 세션 주사위 공유용 콜백

  // ── 유틸 ──
  function roll(sides) { return Math.floor(Math.random() * sides) + 1; }
  function fmtMod(n) { return n >= 0 ? '+' + n : '' + n; }

  // ── 풀 관리 ──
  function addToPool(sides) {
    const existing = pool.find(d => d.sides === sides);
    if (existing) existing.count++;
    else pool.push({sides, count: 1});
    renderTray();
  }

  function removeFromPool(sides) {
    const idx = pool.findIndex(d => d.sides === sides);
    if (idx < 0) return;
    pool[idx].count--;
    if (pool[idx].count <= 0) pool.splice(idx, 1);
    renderTray();
  }

  function clearPool() {
    pool = [];
    renderTray();
  }

  // ── 핵심 굴림 ──
  function rollPool(label, modifier) {
    if (pool.length === 0 && modifier === undefined) return;
    const mod = modifier || 0;
    const results = [];
    let total = 0;
    pool.forEach(d => {
      for (let i = 0; i < d.count; i++) {
        const val = roll(d.sides);
        results.push({sides: d.sides, value: val});
        total += val;
      }
    });
    total += mod;

    const entry = {
      label: label || poolLabel(),
      dice: results,
      modifier: mod,
      total,
      time: new Date(),
      isNat20: results.length === 1 && results[0].sides === 20 && results[0].value === 20,
      isNat1: results.length === 1 && results[0].sides === 20 && results[0].value === 1,
    };
    rollLog.unshift(entry);
    if (rollLog.length > MAX_LOG) rollLog.pop();

    showRollAnimation(entry, () => showToast(entry));
    if (_rollCallback) try { _rollCallback(entry); } catch(e) { console.warn('[DiceRoller] onRoll error', e); }
    clearPool();
    if (logOpen) renderLog();
    return entry;
  }

  function rollQuick(sides, count, modifier, label) {
    pool = [{sides, count: count || 1}];
    return rollPool(label, modifier);
  }

  function rollCheck(modifier, label) {
    pool = [{sides: 20, count: 1}];
    return rollPool(label, modifier);
  }

  // "2d8+4 참격" 같은 문자열 파싱 → 굴림
  function rollDamage(dmgStr, label) {
    const match = dmgStr.match(/(\d+)d(\d+)/);
    if (!match) return;
    const count = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]) || 6;
    const modMatch = dmgStr.match(/d\d+\s*([+-]\s*\d+)/);
    const mod = modMatch ? parseInt(modMatch[1].replace(/\s/g, '')) : 0;
    pool = [{sides, count}];
    return rollPool(label || dmgStr, mod);
  }

  function poolLabel() {
    const parts = pool.map(d => d.count + 'd' + d.sides);
    return parts.join(' + ') || 'd20';
  }

  // ── 토스트 위젯 ──
  function showToast(entry) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = 'dice-toast' + (entry.isNat20 ? ' nat20' : '') + (entry.isNat1 ? ' nat1' : '');

    const diceStr = entry.dice.map(d => {
      const cls = d.value === d.sides ? 'dice-max' : d.value === 1 ? 'dice-min' : '';
      return `<span class="dice-result-chip ${cls}" style="background:${DICE_COLORS[d.sides]||'#666'}">d${d.sides}:${d.value}</span>`;
    }).join(' ');

    const modStr = entry.modifier ? ` ${fmtMod(entry.modifier)}` : '';

    toast.innerHTML = `
      <div class="dice-toast-header">
        <span class="dice-toast-label">${entry.label}</span>
        <span class="dice-toast-total">${entry.total}</span>
      </div>
      <div class="dice-toast-detail">${diceStr}${modStr}</div>
    `;

    container.prepend(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 400);
    }, TOAST_DURATION);
  }

  function getToastContainer() {
    let el = document.getElementById('dice-toast-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'dice-toast-container';
      document.body.appendChild(el);
    }
    return el;
  }

  // ── 3D 주사위 애니메이션 ──
  function showRollAnimation(entry, callback) {
    let overlay = document.getElementById('dice-anim-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'dice-anim-overlay';
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = '';
    overlay.classList.remove('hidden');
    overlay.classList.add('active');

    const diceToAnimate = entry.dice.slice(0, 8); // 성능: 최대 8개

    diceToAnimate.forEach((d, i) => {
      const die = document.createElement('div');
      die.className = 'dice-3d';
      die.style.setProperty('--color', DICE_COLORS[d.sides] || '#666');
      die.style.animationDelay = (i * 0.07) + 's';

      // 면체 시각화
      const face = document.createElement('div');
      face.className = 'dice-3d-face';
      face.textContent = d.value;
      die.appendChild(face);

      const label = document.createElement('div');
      label.className = 'dice-3d-label';
      label.textContent = 'd' + d.sides;
      die.appendChild(label);

      overlay.appendChild(die);
    });

    // 전체 합산 표시
    const totalEl = document.createElement('div');
    totalEl.className = 'dice-anim-total' + (entry.isNat20 ? ' nat20' : '') + (entry.isNat1 ? ' nat1' : '');
    const modStr = entry.modifier ? ` (${fmtMod(entry.modifier)})` : '';
    totalEl.innerHTML = `<span class="dice-anim-total-num">${entry.total}</span><span class="dice-anim-total-label">${entry.label}${modStr}</span>`;
    overlay.appendChild(totalEl);

    setTimeout(() => {
      overlay.classList.remove('active');
      overlay.classList.add('hidden');
      setTimeout(() => { overlay.innerHTML = ''; }, 300);
      if (callback) callback();
    }, 1200);
  }

  // ── 주사위 트레이 UI ──
  function toggleTray() {
    trayOpen = !trayOpen;
    const tray = document.getElementById('dice-tray');
    if (tray) tray.classList.toggle('open', trayOpen);
    if (trayOpen) renderTray();
  }

  function renderTray() {
    const body = document.getElementById('dice-tray-body');
    if (!body) return;

    // 주사위 버튼들
    let html = '<div class="dice-buttons">';
    DICE_TYPES.forEach(sides => {
      const inPool = pool.find(d => d.sides === sides);
      const count = inPool ? inPool.count : 0;
      html += `
        <div class="dice-btn-wrap">
          <button class="dice-btn ${count > 0 ? 'active' : ''}" style="--dice-color:${DICE_COLORS[sides]}"
                  onclick="DiceRoller.addToPool(${sides})">
            <svg class="dice-icon" viewBox="0 0 40 40">${getDiceSVG(sides)}</svg>
            <span class="dice-btn-label">d${sides}</span>
          </button>
          ${count > 0 ? `<span class="dice-count" onclick="DiceRoller.removeFromPool(${sides})">${count}</span>` : ''}
        </div>`;
    });
    html += '</div>';

    // 현재 풀 표시 + 굴리기
    if (pool.length > 0) {
      html += `<div class="dice-pool-info">
        <span class="dice-pool-label">${poolLabel()}</span>
        <button class="dice-roll-btn" onclick="DiceRoller.rollPool()">🎲 굴리기!</button>
        <button class="dice-clear-btn" onclick="DiceRoller.clearPool()">✕</button>
      </div>`;
    }

    // 빠른 굴리기
    html += `<div class="dice-quick">
      <button class="dice-quick-btn" onclick="DiceRoller.rollQuick(20,1,0,'d20')">d20</button>
      <button class="dice-quick-btn" onclick="DiceRoller.rollQuick(20,1,0,'인스피')" style="font-size:10px">2d20↑</button>
      <button class="dice-quick-btn" onclick="DiceRoller.rollQuick(6,4,0,'4d6')">4d6</button>
      <button class="dice-quick-btn dice-log-toggle ${logOpen?'active':''}" onclick="DiceRoller.toggleLog()">📜 기록</button>
    </div>`;

    body.innerHTML = html;

    // 인스피 버튼 2d20 유리 수정
    const inspBtn = body.querySelector('.dice-quick-btn:nth-child(2)');
    if (inspBtn) {
      inspBtn.onclick = () => {
        const r1 = roll(20), r2 = roll(20);
        const best = Math.max(r1, r2);
        const entry = {
          label: '유리 (2d20↑)', dice: [{sides:20,value:r1},{sides:20,value:r2}],
          modifier: 0, total: best, time: new Date(),
          isNat20: best === 20, isNat1: false
        };
        rollLog.unshift(entry); if (rollLog.length > MAX_LOG) rollLog.pop();
        showRollAnimation(entry, () => showToast(entry));
        if (_rollCallback) try { _rollCallback(entry); } catch(e) {}
        if (logOpen) renderLog();
      };
    }
  }

  // ── 로그 패널 ──
  function toggleLog() {
    logOpen = !logOpen;
    let panel = document.getElementById('dice-log-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'dice-log-panel';
      document.getElementById('dice-tray')?.appendChild(panel);
    }
    panel.classList.toggle('open', logOpen);
    if (logOpen) renderLog();
    renderTray();
  }

  function renderLog() {
    const panel = document.getElementById('dice-log-panel');
    if (!panel) return;
    if (rollLog.length === 0) {
      panel.innerHTML = '<div class="dice-log-empty">아직 굴림 기록이 없습니다.</div>';
      return;
    }
    let html = '<div class="dice-log-header"><span>굴림 기록</span><button class="dice-log-clear" onclick="DiceRoller.clearLog()">전체 삭제</button></div>';
    html += '<div class="dice-log-list">';
    rollLog.forEach((e, i) => {
      const timeStr = e.time.toLocaleTimeString('ko-KR', {hour:'2-digit',minute:'2-digit',second:'2-digit'});
      const diceStr = e.dice.map(d => `d${d.sides}:${d.value}`).join(', ');
      const modStr = e.modifier ? ` ${fmtMod(e.modifier)}` : '';
      const cls = e.isNat20 ? 'nat20' : e.isNat1 ? 'nat1' : '';
      html += `<div class="dice-log-entry ${cls}">
        <div class="dice-log-top"><span class="dice-log-label">${e.label}</span><span class="dice-log-total">${e.total}</span></div>
        <div class="dice-log-bottom"><span class="dice-log-detail">[${diceStr}]${modStr}</span><span class="dice-log-time">${timeStr}</span></div>
      </div>`;
    });
    html += '</div>';
    panel.innerHTML = html;
  }

  function clearLog() {
    rollLog = [];
    renderLog();
  }

  // ── 주사위 SVG ──
  function getDiceSVG(sides) {
    switch(sides) {
      case 4: return '<polygon points="20,4 36,34 4,34" fill="none" stroke="currentColor" stroke-width="2"/><text x="20" y="28" text-anchor="middle" font-size="12" fill="currentColor">4</text>';
      case 6: return '<rect x="6" y="6" width="28" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="12" fill="currentColor">6</text>';
      case 8: return '<polygon points="20,2 38,20 20,38 2,20" fill="none" stroke="currentColor" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="12" fill="currentColor">8</text>';
      case 10: return '<polygon points="20,2 36,14 36,30 20,38 4,30 4,14" fill="none" stroke="currentColor" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="11" fill="currentColor">10</text>';
      case 12: return '<polygon points="20,2 34,10 38,26 28,38 12,38 2,26 6,10" fill="none" stroke="currentColor" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="11" fill="currentColor">12</text>';
      case 20: return '<polygon points="20,2 36,12 36,28 20,38 4,28 4,12" fill="none" stroke="currentColor" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="11" fill="currentColor">20</text>';
      case 100: return '<circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="2"/><text x="20" y="25" text-anchor="middle" font-size="9" fill="currentColor">100</text>';
      default: return '<circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="2"/>';
    }
  }

  // ── 판정 연결 (무기/내성/기술/지각) ──
  function initCheckBindings() {
    // 무기 명중: 이벤트 위임 (weapon-list 컨테이너)
    document.addEventListener('click', (e) => {
      // 명중 stat-val 클릭
      const statEl = e.target.closest('.weapon-stat');
      if (statEl) {
        const label = statEl.querySelector('.stat-label')?.textContent || '';
        const card = statEl.closest('.weapon-card');
        const nameEl = card?.querySelector('.weapon-card-name');
        const wpName = nameEl?.textContent?.replace(/[⚔\s파손된\s]/g,'').trim().split('[')[0].trim() || '무기';

        if (label.includes('명중')) {
          e.stopPropagation();
          const valEl = statEl.querySelector('.stat-val');
          if (!valEl) return;
          const mod = parseInt(valEl.textContent) || 0;
          rollCheck(mod, wpName + ' 명중');
          return;
        }
        if (label.includes('피해') && statEl.classList.contains('weapon-stat-dmg')) {
          e.stopPropagation();
          const dmgStr = statEl.dataset.dmg || '';
          if (dmgStr && dmgStr !== '—') {
            rollDamage(dmgStr, wpName + ' 피해');
          }
          return;
        }
      }

      // 내성 클릭 (val-fort, val-ref, val-will)
      const saveNames = {
        'val-fort': '건강 내성', 'val-ref': '반사 내성', 'val-will': '의지 내성'
      };
      for (const [id, label] of Object.entries(saveNames)) {
        if (e.target.id === id || e.target.closest('#' + id)) {
          const el = e.target.id === id ? e.target : e.target.closest('#' + id);
          const mod = parseInt(el.textContent) || 0;
          rollCheck(mod, label);
          return;
        }
      }

      // 지각 클릭
      if (e.target.id === 'val-perc' || e.target.closest('#val-perc')) {
        const el = e.target.id === 'val-perc' ? e.target : e.target.closest('#val-perc');
        const mod = parseInt(el.textContent) || 0;
        rollCheck(mod, '지각');
        return;
      }

      // 기술 클릭 (sk-val-*)
      if (e.target.classList.contains('skill-total') || e.target.closest('.skill-total')) {
        const el = e.target.classList.contains('skill-total') ? e.target : e.target.closest('.skill-total');
        const mod = parseInt(el.textContent) || 0;
        const row = el.closest('.skill-row');
        const nameEl = row?.querySelector('.skill-name');
        const skillName = nameEl?.textContent?.trim() || '기술';
        rollCheck(mod, skillName);
        return;
      }

      // 선제 클릭
      if (e.target.id === 'val-init' || e.target.closest('#val-init')) {
        const el = e.target.id === 'val-init' ? e.target : e.target.closest('#val-init');
        const mod = parseInt(el.textContent) || 0;
        rollCheck(mod, '선제');
        return;
      }
    });
  }

  // ── 초기화 ──
  function init() {
    // FAB 버튼
    const fab = document.createElement('button');
    fab.id = 'dice-fab';
    fab.innerHTML = '🎲';
    fab.title = '주사위 굴리기';
    fab.onclick = toggleTray;
    document.body.appendChild(fab);

    // 트레이
    const tray = document.createElement('div');
    tray.id = 'dice-tray';
    tray.innerHTML = `
      <div class="dice-tray-header">
        <span>🎲 주사위</span>
        <button class="dice-tray-close" onclick="DiceRoller.toggleTray()">✕</button>
      </div>
      <div id="dice-tray-body"></div>
      <div id="dice-log-panel"></div>
    `;
    document.body.appendChild(tray);

    // 판정 바인딩
    initCheckBindings();
  }

  // DOM 로드 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── 콜백 설정 ──
  function onRoll(cb) { _rollCallback = cb; }

  // ── 원격 주사위 토스트 (세션 공유용) ──
  function showRemoteToast(data) {
    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.className = 'dice-toast dice-toast-remote' + (data.isNat20 ? ' nat20' : '') + (data.isNat1 ? ' nat1' : '');

    const diceStr = (data.dice || []).map(d => {
      const cls = d.value === d.sides ? 'dice-max' : d.value === 1 ? 'dice-min' : '';
      return `<span class="dice-result-chip ${cls}" style="background:${DICE_COLORS[d.sides]||'#666'}">d${d.sides}:${d.value}</span>`;
    }).join(' ');

    const modStr = data.modifier ? ` ${fmtMod(data.modifier)}` : '';

    toast.innerHTML = `
      <div class="dice-toast-who">🎲 ${data.characterName || '???'}</div>
      <div class="dice-toast-header">
        <span class="dice-toast-label">${data.label || ''}</span>
        <span class="dice-toast-total">${data.total}</span>
      </div>
      <div class="dice-toast-detail">${diceStr}${modStr}</div>
    `;

    container.prepend(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }

  // ── Public API ──
  return {
    addToPool, removeFromPool, clearPool,
    rollPool, rollQuick, rollCheck,
    toggleTray, toggleLog, clearLog,
    onRoll, showRemoteToast,
  };
})();
