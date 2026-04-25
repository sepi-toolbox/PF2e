// ═════════════════════════════════���═════════════
//  SESSION SYSTEM — 멀티플레이어 세션 (GM + 플레이어)
// ═══════════════════════════════════════════════

/* ── 세션 상태 ── */
let _sessionMode = false;
let _currentSession = null;   // {id, name, joinCode, gmUid, players}
let _isGM = false;
let _gmEditTarget = null;     // GM이 편집 중인 플레이어 uid (null이면 파티 뷰)

/* ── onSnapshot 리스너 해제 함수 ── */
let _sessionDocUnsub = null;
let _charDocUnsub = null;
let _partyUnsub = null;
let _rollsUnsub = null;

/* ── 상수 ── */
const SESSION_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // I,O,0,1 제외
const SESSION_CODE_LEN = 6;

// ═══════════════════════════════════════════════
//  JOIN CODE 생성
// ═══════════════════════════════════════════════
function generateJoinCode() {
  let code = '';
  for (let i = 0; i < SESSION_CODE_LEN; i++) {
    code += SESSION_CODE_CHARS[Math.floor(Math.random() * SESSION_CODE_CHARS.length)];
  }
  return code;
}

// ══════════════════════���═══════════════════���════
//  세션 생성 (GM)
// ═══════════════════════════════════════════════
async function createSession(name) {
  if (!currentUser) { alert('로그인이 필요합니다.'); return; }
  const code = generateJoinCode();
  // 충돌 검사
  const existing = await db.collection('sessions').where('joinCode', '==', code).get();
  if (!existing.empty) return createSession(name); // 재귀 재시도 (확률 극소)

  const docRef = await db.collection('sessions').add({
    gmUid: currentUser.uid,
    joinCode: code,
    name: name || '새 세션',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    players: {}
  });
  _currentSession = {
    id: docRef.id,
    name: name || '새 세션',
    joinCode: code,
    gmUid: currentUser.uid,
    players: {}
  };
  _sessionMode = true;
  _isGM = true;
  _gmEditTarget = null;
  // localStorage 저장
  localStorage.setItem('pf2e_sessionId', docRef.id);
  localStorage.setItem('pf2e_sessionRole', 'gm');
  // UI 전환
  enterSessionUI();
  startSessionListeners();
  closeSessionModal();
}

// ═══════════════════════════════════════════════
//  세션 참가 (플레이어)
// ═══════════��═══════════════════════════════════
async function joinSession(code) {
  if (!currentUser) { alert('로그인이 필요합니다.'); return; }
  code = code.toUpperCase().trim();
  if (code.length !== SESSION_CODE_LEN) { alert('참가 코드는 ' + SESSION_CODE_LEN + '자리입니다.'); return; }

  const snap = await db.collection('sessions').where('joinCode', '==', code).get();
  if (snap.empty) { alert('세션을 ���을 수 없습니다.'); return; }

  const doc = snap.docs[0];
  const data = doc.data();

  // GM이 자기 세션에 참가 시도하면 GM 모드로 전환
  if (data.gmUid === currentUser.uid) {
    _currentSession = { id: doc.id, name: data.name, joinCode: data.joinCode, gmUid: data.gmUid, players: data.players || {} };
    _sessionMode = true;
    _isGM = true;
    _gmEditTarget = null;
    localStorage.setItem('pf2e_sessionId', doc.id);
    localStorage.setItem('pf2e_sessionRole', 'gm');
    enterSessionUI();
    startSessionListeners();
    closeSessionModal();
    return;
  }

  // players map에 자신 추가
  const playerField = 'players.' + currentUser.uid;
  await db.collection('sessions').doc(doc.id).update({
    [playerField + '.displayName']: currentUser.displayName || currentUser.email || '???',
    [playerField + '.joinedAt']: firebase.firestore.FieldValue.serverTimestamp(),
    [playerField + '.characterId']: currentUser.uid
  });

  _currentSession = { id: doc.id, name: data.name, joinCode: data.joinCode, gmUid: data.gmUid, players: data.players || {} };
  _currentSession.players[currentUser.uid] = { displayName: currentUser.displayName || '???' };
  _sessionMode = true;
  _isGM = false;
  _gmEditTarget = null;
  localStorage.setItem('pf2e_sessionId', doc.id);
  localStorage.setItem('pf2e_sessionRole', 'player');

  enterSessionUI();
  startSessionListeners();
  closeSessionModal();
  // 캐릭터 선택 모달
  openCharacterChoiceModal();
}

// ═════════════════════════════════════���═════════
//  세션 복귀 (새로고침/재접속)
// ═══���═══════════════��═══════════════════════════
async function restoreSession() {
  const sid = localStorage.getItem('pf2e_sessionId');
  if (!sid || !currentUser) return false;

  try {
    const doc = await db.collection('sessions').doc(sid).get();
    if (!doc.exists) {
      clearSessionStorage();
      return false;
    }
    const data = doc.data();
    // GM이거나 플레이어 목록에 있는지 확인
    const isGM = data.gmUid === currentUser.uid;
    const isPlayer = data.players && data.players[currentUser.uid];
    if (!isGM && !isPlayer) {
      clearSessionStorage();
      return false;
    }
    _currentSession = { id: doc.id, name: data.name, joinCode: data.joinCode, gmUid: data.gmUid, players: data.players || {} };
    _sessionMode = true;
    _isGM = isGM;
    _gmEditTarget = null;
    enterSessionUI();
    startSessionListeners();
    // 플레이어: 세션 캐릭터 로드
    if (!_isGM) {
      loadSessionCharacter(currentUser.uid);
    }
    return true;
  } catch (e) {
    console.error('[restoreSession]', e);
    clearSessionStorage();
    return false;
  }
}

function clearSessionStorage() {
  localStorage.removeItem('pf2e_sessionId');
  localStorage.removeItem('pf2e_sessionRole');
}

// ════════��═══════════════════════���══════════════
//  세션 나가기
// ══��════════════════════════════════════════════
async function leaveSession() {
  if (!_currentSession) return;
  if (_isGM) {
    if (!confirm('세션을 삭제하시겠습니까?\n모든 참가자의 세션 캐릭터가 삭제됩니다.')) return;
    // 캐릭터 + 롤 서브컬렉션 삭제는 클라이언트에서 일일이 해야 함
    try {
      const charSnap = await db.collection('sessions').doc(_currentSession.id).collection('characters').get();
      const batch = db.batch();
      charSnap.forEach(d => batch.delete(d.ref));
      batch.delete(db.collection('sessions').doc(_currentSession.id));
      await batch.commit();
    } catch (e) {
      console.error('[deleteSession]', e);
    }
  } else {
    // 플레이어 나가기 — 내보내기 옵션
    const doExport = confirm('세션을 나갑니다.\n현재 캐릭터를 개인 슬롯으로 내보내시겠습니까?');
    if (doExport) await exportSessionCharToSlot();
    // players map에서 제거 + 캐릭터 삭제
    try {
      const playerField = 'players.' + currentUser.uid;
      await db.collection('sessions').doc(_currentSession.id).update({
        [playerField]: firebase.firestore.FieldValue.delete()
      });
      await db.collection('sessions').doc(_currentSession.id)
        .collection('characters').doc(currentUser.uid).delete();
    } catch (e) {
      console.error('[leaveSession]', e);
    }
  }
  stopSessionListeners();
  _sessionMode = false;
  _currentSession = null;
  _isGM = false;
  _gmEditTarget = null;
  clearSessionStorage();
  exitSessionUI();
}

// ══════��════════════════════════════��═══════════
//  세션 캐릭터 저장/로드
// ══════════��═════════════════���══════════════════
function sessionSaveNow() {
  if (!_currentSession || !currentUser) return;
  const targetUid = _gmEditTarget || currentUser.uid;
  // GM이 파티 뷰(편집 대상 없음)이면 저장 불필요
  if (_isGM && !_gmEditTarget) return;

  const st = document.getElementById('save-status');
  if (st) { st.textContent = '저장 중...'; st.style.color = '#f5c518'; }
  const data = collectData();
  db.collection('sessions').doc(_currentSession.id)
    .collection('characters').doc(targetUid).set({
      ownerUid: targetUid,
      data: JSON.stringify(data),
      name: data.name || '이름 없음',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      if (st) { st.textContent = '저장완료'; st.style.color = '#27ae60'; }
    }).catch((e) => {
      if (st) { st.textContent = '저장 실패'; st.style.color = '#e74c3c'; }
      console.error('[sessionSave]', e);
    });
}

function loadSessionCharacter(uid) {
  const st = document.getElementById('save-status');
  if (st) { st.textContent = '불러오는 중...'; st.style.color = '#f5c518'; }
  db.collection('sessions').doc(_currentSession.id)
    .collection('characters').doc(uid).get().then(doc => {
      if (doc.exists && doc.data().data) {
        const data = JSON.parse(doc.data().data);
        _loadComplete = false;
        loadData(data);
        _rebuildAllUI();
        _cloudResolved = true; _checkReady();
        recalcAll();
        if (st) { st.textContent = '✓ 불러오기 완료'; st.style.color = '#27ae60'; }
      } else {
        if (st) { st.textContent = '빈 캐릭터'; st.style.color = '#888'; }
        _cloudResolved = true; _checkReady();
      }
    }).catch(e => {
      console.error('[loadSessionChar]', e);
      if (st) { st.textContent = '로드 실패'; st.style.color = '#e74c3c'; }
      _cloudResolved = true; _checkReady();
    });
}

// 모든 UI 재구축 (loadFromCloud와 동일 패턴)
function _rebuildAllUI() {
  if (typeof buildSkills === 'function') buildSkills();
  if (typeof buildConditions === 'function') buildConditions();
  if (typeof renderEquip === 'function') renderEquip();
  if (typeof renderContainers === 'function') renderContainers();
  if (typeof renderFormulas === 'function') renderFormulas();
  if (typeof renderLanguages === 'function') renderLanguages();
  if (typeof renderPets === 'function') renderPets();
  if (typeof renderFeats === 'function') renderFeats();
  if (typeof updateSpellSlotsForClass === 'function') updateSpellSlotsForClass();
  if (typeof renderSpells === 'function') renderSpells();
  if (typeof renderWeapons === 'function') renderWeapons();
  if (typeof renderArmorCard === 'function') renderArmorCard();
  if (typeof renderShieldCard === 'function') renderShieldCard();
}

// 세션 캐릭터 → 개인 슬롯 내보내기
async function exportSessionCharToSlot() {
  try {
    const doc = await db.collection('sessions').doc(_currentSession.id)
      .collection('characters').doc(currentUser.uid).get();
    if (!doc.exists || !doc.data().data) return;
    // 빈 슬롯 찾기
    const slotsSnap = await db.collection('users').doc(currentUser.uid).collection('characters').get();
    const usedSlots = new Set();
    slotsSnap.forEach(d => { if (d.data().data) usedSlots.add(d.id); });
    let targetSlot = null;
    for (let i = 1; i <= 5; i++) {
      if (!usedSlots.has('slot' + i)) { targetSlot = 'slot' + i; break; }
    }
    if (!targetSlot) {
      alert('빈 개인 슬롯이 없습니다. (5/5 사용 중)');
      return;
    }
    await db.collection('users').doc(currentUser.uid).collection('characters').doc(targetSlot).set({
      data: doc.data().data,
      name: doc.data().name || '이름 없음',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert('캐릭터를 ' + targetSlot + '에 내보냈습니다.');
  } catch (e) {
    console.error('[exportSessionChar]', e);
    alert('내보내기 실패: ' + e.message);
  }
}

// 개인 슬롯 → 세션 캐릭터 복사
async function copySlotToSession(slotId) {
  try {
    const doc = await db.collection('users').doc(currentUser.uid)
      .collection('characters').doc(slotId).get();
    if (!doc.exists || !doc.data().data) {
      alert('선택한 슬롯이 비��있습니다.');
      return;
    }
    await db.collection('sessions').doc(_currentSession.id)
      .collection('characters').doc(currentUser.uid).set({
        ownerUid: currentUser.uid,
        data: doc.data().data,
        name: doc.data().name || '이름 없음',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    // 로드
    loadSessionCharacter(currentUser.uid);
    closeSessionModal();
  } catch (e) {
    console.error('[copySlotToSession]', e);
    alert('복사 실패: ' + e.message);
  }
}

// ════════════════��═════════════════��════════════
//  onSnapshot 리스너
// ══════════��═════════════════════��══════════════
function startSessionListeners() {
  if (!_currentSession) return;
  // 세션 문서 실시간 감시 (players 변경 등)
  _sessionDocUnsub = db.collection('sessions').doc(_currentSession.id)
    .onSnapshot(doc => {
      if (!doc.exists) {
        // 세션이 삭제됨 (GM이 삭제)
        if (!_isGM) {
          alert('세션이 종료되었습니다.');
          stopSessionListeners();
          _sessionMode = false;
          _currentSession = null;
          _isGM = false;
          clearSessionStorage();
          exitSessionUI();
        }
        return;
      }
      const data = doc.data();
      _currentSession.players = data.players || {};
      _currentSession.name = data.name;
      updateSessionBar();
      if (_isGM && typeof renderGMDashboard === 'function') renderGMDashboard();
    });

  // 플레이어: 자기 캐릭터 문서 감시 (GM 편집 반영)
  if (!_isGM) {
    _charDocUnsub = db.collection('sessions').doc(_currentSession.id)
      .collection('characters').doc(currentUser.uid)
      .onSnapshot(doc => {
        if (!doc.exists || !doc.data().data) return;
        // GM이 수정한 경우에만 반영 (자기 저장은 무시)
        // updatedAt 비교 대신, 간단히 데이터 hash 비교
        const remoteData = doc.data().data;
        const localData = JSON.stringify(collectData());
        if (remoteData !== localData) {
          const prev = _loadComplete;
          _loadComplete = false;
          loadData(JSON.parse(remoteData));
          _rebuildAllUI();
          recalcAll();
          _loadComplete = prev;
        }
      });
  }
}

function stopSessionListeners() {
  if (_sessionDocUnsub) { _sessionDocUnsub(); _sessionDocUnsub = null; }
  if (_charDocUnsub) { _charDocUnsub(); _charDocUnsub = null; }
  if (_partyUnsub) { _partyUnsub(); _partyUnsub = null; }
  if (_rollsUnsub) { _rollsUnsub(); _rollsUnsub = null; }
}

// ═══════════════════════════════════════════════
//  UI: 세션 모드 전환
// ═════════════════════════════════════════��═════
function enterSessionUI() {
  if (_isGM) {
    // GM: 전용 대시보드 갱신
    if (typeof renderGMDashboard === 'function') renderGMDashboard();
  } else {
    // 플레이어: 세션 바 표시 + 캐릭터 시트
    const slotBar = document.getElementById('slot-bar');
    if (slotBar) slotBar.style.display = 'none';
    let bar = document.getElementById('session-bar');
    if (bar) bar.style.display = 'flex';
    updateSessionBar();
  }
}

function exitSessionUI() {
  const bar = document.getElementById('session-bar');
  if (bar) bar.style.display = 'none';
  const gmPage = document.getElementById('gm-page');
  if (gmPage) gmPage.style.display = 'none';
  // 모드 선택 화면으로 돌아가기
  if (typeof showModeSelection === 'function') showModeSelection();
}

function updateSessionBar() {
  const bar = document.getElementById('session-bar');
  if (!bar || !_currentSession) return;
  const playerCount = Object.keys(_currentSession.players || {}).length;
  const roleLabel = _isGM ? '<span style="color:#f5c518;font-weight:700;">GM</span>' : '<span style="color:#3498db;">플레이어</span>';
  bar.innerHTML =
    '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;width:100%;">' +
      '<span style="color:#f5c518;font-weight:700;">🎮 ' + (_currentSession.name || '세션') + '</span>' +
      roleLabel +
      '<span style="color:#888;font-size:11px;">참가 코드: <strong style="color:#fff;font-family:monospace;letter-spacing:2px;">' + _currentSession.joinCode + '</strong>' +
        '<button onclick="navigator.clipboard.writeText(\'' + _currentSession.joinCode + '\').then(()=>this.textContent=\'✓\').catch(()=>{})" style="background:none;border:none;color:#f5c518;cursor:pointer;font-size:11px;margin-left:4px;" title="코드 복사">📋</button></span>' +
      '<span style="color:#888;font-size:11px;">참가자 ' + playerCount + '명</span>' +
      '<button onclick="leaveSession()" style="background:#c0392b;color:#fff;border:none;padding:3px 10px;border-radius:4px;cursor:pointer;font-size:11px;margin-left:auto;">' + (_isGM ? '세션 삭제' : '세션 나가기') + '</button>' +
    '</div>';
}

function updateSessionButtons() {
  // (no-op — 버튼은 모드 선택으로 이동됨)
}

// ════��═══════════════════════════════════���══════
//  UI: 세션 모달
// ══════════════════════════════��════════════════
function openCreateSessionModal() {
  if (!currentUser) { alert('로그인이 필요합니다.'); return; }
  const overlay = _getOrCreateSessionOverlay();
  overlay.innerHTML =
    '<div class="session-modal">' +
      '<h3 style="color:#f5c518;margin:0 0 16px;">새 세션 만���기</h3>' +
      '<input id="session-name-input" type="text" placeholder="세션 이름 (예: 멸망의 시대)" maxlength="30" style="width:100%;padding:8px;background:#222;border:1px solid #555;color:#fff;border-radius:4px;font-size:14px;box-sizing:border-box;">' +
      '<div style="display:flex;gap:8px;margin-top:16px;justify-content:flex-end;">' +
        '<button onclick="closeSessionModal()" style="background:#555;color:#fff;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;">취소</button>' +
        '<button onclick="createSession(document.getElementById(\'session-name-input\').value)" style="background:#f5c518;color:#000;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-weight:700;">만들��</button>' +
      '</div>' +
    '</div>';
  overlay.classList.remove('hidden');
  setTimeout(() => document.getElementById('session-name-input')?.focus(), 100);
}

function openJoinSessionModal() {
  if (!currentUser) { alert('로그인이 필요합니다.'); return; }
  const overlay = _getOrCreateSessionOverlay();
  overlay.innerHTML =
    '<div class="session-modal">' +
      '<h3 style="color:#3498db;margin:0 0 16px;">세션 참가</h3>' +
      '<input id="session-code-input" type="text" placeholder="참가 코드 (6자리)" maxlength="6" style="width:100%;padding:8px;background:#222;border:1px solid #555;color:#fff;border-radius:4px;font-size:18px;text-align:center;letter-spacing:4px;font-family:monospace;box-sizing:border-box;text-transform:uppercase;">' +
      '<div style="display:flex;gap:8px;margin-top:16px;justify-content:flex-end;">' +
        '<button onclick="closeSessionModal()" style="background:#555;color:#fff;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;">취소</button>' +
        '<button onclick="joinSession(document.getElementById(\'session-code-input\').value)" style="background:#3498db;color:#fff;border:none;padding:6px 16px;border-radius:4px;cursor:pointer;font-weight:700;">참가</button>' +
      '</div>' +
    '</div>';
  overlay.classList.remove('hidden');
  setTimeout(() => document.getElementById('session-code-input')?.focus(), 100);
}

function openCharacterChoiceModal() {
  if (!currentUser || !_currentSession) return;
  const overlay = _getOrCreateSessionOverlay();
  let html =
    '<div class="session-modal" style="max-width:400px;">' +
      '<h3 style="color:#f5c518;margin:0 0 16px;">세션 캐릭터 선택</h3>' +
      '<p style="color:#aaa;font-size:12px;margin:0 0 12px;">새 캐릭��를 만들거나 기존 캐릭터를 복사합니���.</p>' +
      '<button onclick="closeSessionModal()" style="width:100%;padding:10px;background:#27ae60;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;font-weight:700;margin-bottom:8px;">새 캐릭터 만들기</button>' +
      '<div style="border-top:1px solid #444;margin:8px 0;"></div>' +
      '<p style="color:#888;font-size:11px;margin:4px 0 8px;">기존 ��릭터 복사:</p>' +
      '<div id="session-slot-list" style="display:flex;flex-direction:column;gap:4px;">로딩 중...</div>' +
    '</div>';
  overlay.innerHTML = html;
  overlay.classList.remove('hidden');
  // 개인 슬롯 목록 로드
  db.collection('users').doc(currentUser.uid).collection('characters').get().then(snap => {
    const list = document.getElementById('session-slot-list');
    if (!list) return;
    let items = '';
    snap.forEach(doc => {
      const d = doc.data();
      const name = d.name && d.name !== '��름 없음' ? d.name : '빈 슬롯';
      if (d.data) {
        items += '<button onclick="copySlotToSession(\'' + doc.id + '\')" style="padding:8px;background:#333;color:#ccc;border:1px solid #555;border-radius:4px;cursor:pointer;text-align:left;font-size:12px;">' + doc.id.replace('slot', '슬롯 ') + ': <strong style="color:#fff;">' + name + '</strong></button>';
      }
    });
    list.innerHTML = items || '<span style="color:#666;">저장된 캐릭터가 ��습니다.</span>';
  });
}

function _getOrCreateSessionOverlay() {
  let overlay = document.getElementById('session-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'session-modal-overlay';
    overlay.className = 'session-overlay hidden';
    overlay.addEventListener('click', function(e) { if (e.target === overlay) closeSessionModal(); });
    document.body.appendChild(overlay);
  }
  return overlay;
}

function closeSessionModal() {
  const overlay = document.getElementById('session-modal-overlay');
  if (overlay) overlay.classList.add('hidden');
}

// ═══════════════════════════════════════════════
//  GM 모드: 세션 만들기/참가 선택 모달
// ═══════════════════════════════════════════════
function openGMSessionChoiceModal() {
  const overlay = _getOrCreateSessionOverlay();
  overlay.innerHTML =
    '<div class="session-modal" style="max-width:360px;text-align:center;">' +
      '<h3 style="color:#f5c518;margin:0 0 20px;">📜 게임마스터 모드</h3>' +
      '<button onclick="openCreateSessionModal()" style="width:100%;padding:12px;background:#f5c518;color:#000;border:none;border-radius:6px;cursor:pointer;font-size:15px;font-weight:700;margin-bottom:16px;">새 세션 만들기</button>' +
      '<div style="border-top:1px solid #444;padding-top:12px;">' +
        '<button onclick="closeSessionModal();localStorage.removeItem(\'pf2e_appMode\');showModeSelection();" style="background:none;border:none;color:#888;cursor:pointer;font-size:12px;">← 뒤로가기</button>' +
      '</div>' +
    '</div>';
  overlay.classList.remove('hidden');
}

// ══���════════════════════════════���═══════════════
//  autoSaveNow 오버라이드
// ═══════════════��═══════════════════════════════
const _origAutoSaveNow = autoSaveNow;
autoSaveNow = function() {
  if (_sessionMode) return sessionSaveNow();
  return _origAutoSaveNow();
};

// ═══════════════════════════════════════════════
//  GM 세션 모드 (?gmsession=ID 파라미터)
// ═══════════════════════════════════════════════
let _gmPlayerTabs = [];       // [{uid, displayName}]
let _gmCharUnsubs = {};       // uid → onSnapshot unsub
let _gmActiveTab = null;      // 현재 보고 있는 플레이어 uid

function checkGMSessionParam() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('gmsession');
  if (!sessionId) return false;
  // auth 완료 후 호출되므로 currentUser가 있어야 함
  if (!currentUser) return false;
  _pendingGMSession = sessionId;
  return true;
}

let _pendingGMSession = null;

async function enterGMSessionMode(sessionId) {
  try {
    const doc = await db.collection('sessions').doc(sessionId).get();
    if (!doc.exists) { alert('세션을 찾을 수 없습니다.'); return; }
    const data = doc.data();
    if (data.gmUid !== currentUser.uid) { alert('이 세션의 GM이 아닙니다.'); return; }

    _currentSession = { id: doc.id, name: data.name, joinCode: data.joinCode, gmUid: data.gmUid, players: data.players || {} };
    _sessionMode = true;
    _isGM = true;

    // 슬롯 바 숨기기
    const slotBar = document.getElementById('slot-bar');
    if (slotBar) slotBar.style.display = 'none';

    // 플레이어 탭 바 생성
    _buildPlayerTabBar();

    // 세션 문서 실시간 감시 (플레이어 참가/퇴장 → 탭 갱신)
    _sessionDocUnsub = db.collection('sessions').doc(sessionId)
      .onSnapshot(snap => {
        if (!snap.exists) return;
        const d = snap.data();
        _currentSession.players = d.players || {};
        _buildPlayerTabBar();
      });

    // 첫 번째 플레이어 탭 자동 선택
    const uids = Object.keys(_currentSession.players);
    if (uids.length > 0) {
      gmSwitchTab(uids[0]);
    } else {
      _showEmptyPartyMessage();
    }
  } catch(e) {
    console.error('[enterGMSessionMode]', e);
    alert('세션 로드 실패: ' + e.message);
  }
}

function _buildPlayerTabBar() {
  let bar = document.getElementById('gm-tab-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'gm-tab-bar';
    const slotBar = document.getElementById('slot-bar');
    slotBar.parentNode.insertBefore(bar, slotBar.nextSibling);
  }
  bar.style.display = 'flex';

  const players = _currentSession.players || {};
  const uids = Object.keys(players);
  _gmPlayerTabs = uids.map(uid => ({ uid, displayName: players[uid].displayName || '???' }));

  bar.innerHTML =
    '<span style="color:var(--gold);font-weight:700;font-size:12px;padding:0 8px;">🎮 ' + (_currentSession.name || '세션') + '</span>' +
    uids.map(uid => {
      const p = players[uid];
      const active = uid === _gmActiveTab;
      return '<button class="gm-tab' + (active ? ' gm-tab-active' : '') + '" onclick="gmSwitchTab(\'' + uid + '\')">' +
        (p.displayName || '???') +
      '</button>';
    }).join('') +
    '<a href="GMSheet.html" style="margin-left:auto;color:#888;font-size:11px;padding:0 12px;text-decoration:none;align-self:center;">← 로비</a>';

  // 플레이어가 새로 참가했을 때 자동 선택
  if (!_gmActiveTab && uids.length > 0) {
    gmSwitchTab(uids[0]);
  }
}

function gmSwitchTab(uid) {
  if (_gmActiveTab === uid) return;

  // 현재 편집 중인 캐릭터 저장
  if (_gmActiveTab && _loadComplete) {
    sessionSaveNow();
  }

  _gmActiveTab = uid;
  _gmEditTarget = uid;

  // 탭 바 활성 상태 갱신
  document.querySelectorAll('.gm-tab').forEach(btn => btn.classList.remove('gm-tab-active'));
  const activeBtn = document.querySelector('.gm-tab[onclick*="' + uid + '"]');
  if (activeBtn) activeBtn.classList.add('gm-tab-active');

  // 캐릭터 로드
  loadSessionCharacter(uid);

  // 이전 리스너 해제 후 이 캐릭터에 대한 실시간 감시 시작
  _startGMCharListener(uid);
}

function _startGMCharListener(uid) {
  // 기존 리스너 해제
  if (_charDocUnsub) { _charDocUnsub(); _charDocUnsub = null; }

  _charDocUnsub = db.collection('sessions').doc(_currentSession.id)
    .collection('characters').doc(uid)
    .onSnapshot(doc => {
      if (!doc.exists || !doc.data().data) return;
      // 플레이어가 수정한 변경사항 반영
      const remoteData = doc.data().data;
      const localData = JSON.stringify(collectData());
      if (remoteData !== localData && _gmActiveTab === uid) {
        const prev = _loadComplete;
        _loadComplete = false;
        loadData(JSON.parse(remoteData));
        _rebuildAllUI();
        recalcAll();
        _loadComplete = prev;
      }
    });
}

function _showEmptyPartyMessage() {
  // 참가자 없을 때 안내 메시지
  const header = document.getElementById('header');
  if (header) {
    header.insertAdjacentHTML('afterend',
      '<div id="gm-empty-msg" style="text-align:center;padding:60px 20px;color:#666;">' +
        '<p style="font-size:16px;margin-bottom:8px;">아직 참가한 플레이어가 없습니다.</p>' +
        '<p style="font-size:13px;">참가 코드: <strong style="color:#f5c518;font-family:monospace;font-size:18px;letter-spacing:3px;">' + _currentSession.joinCode + '</strong></p>' +
        '<p style="font-size:11px;margin-top:8px;">이 코드를 플레이어에게 공유하세요.</p>' +
      '</div>'
    );
  }
}

