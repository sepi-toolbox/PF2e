// ═══════════════════════════════════════════════
//  MAP / TOKEN SYSTEM — 세션 전술 맵 (FVTT 스타일)
//  Phase A: 데이터 모델 + Firestore 실시간 동기화 (렌더링은 Phase B~)
//  설계: memory/pf2e-charsheet/project_map_token_system.md
//
//  데이터 모델 (Firestore):
//    sessions/{id}/map/state          ← 맵 1개 doc: bgImage(base64) 또는 bgUrl(참조),
//                                        bgW/H, gridSize, fogEnabled, fogMask(다운스케일 PNG), maskW/H
//    배경 2모드: bgImage=업로드(1MiB 문서 한도 내 축소저장) / bgUrl=URL 참조(원본 해상도,
//                repo maps/ 권장 — 같은 오리진이라 CORS·캔버스 taint 없음). bgUrl 우선.
//    sessions/{id}/tokens/{tokenId}   ← 토큰당 doc: ownerUid, name, x, y, img(초상),
//                                        color, size, hidden
//
//  비용 절감: 토큰 이동은 drag-end 시점에 1회만 쓰기 (드래그 중 쓰기 0).
//             안개 마스크는 stroke-end에 1회 쓰기 (Phase D).
//  권한: 세션 참가자만. 플레이어는 자기 토큰만(ownerUid==uid), GM은 전체.
//        (Firestore Security Rules는 Console 수동 배포 필요)
// ═══════════════════════════════════════════════
var MapSync = (function() {
  'use strict';

  // ── 튜닝 상수 (해상도 상한 — 추후 상향 여지: 여기만 수정) ──
  const MAP_MAX_DIM   = 1500;        // 맵 배경 최대 변 길이(px)
  const MAP_JPEG_Q    = 0.7;         // 맵 배경 JPEG 품질
  const MAP_MAX_BYTES = 900 * 1024;  // base64 디코딩 후 목표 상한 (1MB 문서 제한 여유)
  const TOKEN_MAX_DIM = 256;         // 토큰/초상 최대 변 길이
  const TOKEN_JPEG_Q  = 0.8;
  const MASK_SCALE    = 8;           // 안개 마스크 다운스케일 배율 (Phase D)
  const RECONNECT_MS  = 3000;        // onSnapshot 에러 후 재연결 대기 (cs_session.js와 동일)

  // ── 로컬 캐시 ──
  let _sessionId    = null;
  let _isGM         = false;
  let _uid          = null;
  let _activeMapId  = null;           // 현재 활성 맵 id (session.activeMapId 추종)
  let _maps         = new Map();      // mapId → {id, name, order, ...} (드로어용, GM)
  let _templates    = new Map();      // 토큰 템플릿(팔레트, 세션 레벨, GM)
  let _mapsReady    = false;
  let _mapState     = null;           // 활성 맵 doc 데이터 (배경/안개/그리드; 없으면 null)
  let _tokens       = new Map();      // tokenId → {id, ownerUid, name, x, y, ...}
  let _areas        = new Map();      // AoE 영역 템플릿(활성 맵별): aid → {kind,x,y,ft,dir,color}
  let _pins         = new Map();      // GM 전용 마스터링 핀(활성 맵별): pid → {type,x,y,title,notes} — 플레이어 비공개
  let _paused       = false;          // 세션 준비중(중지) — 플레이어 화면 가림 (session.paused 추종)
  let _sessionUnsub = null;           // session doc 감시 (activeMapId, paused)
  let _mapsUnsub    = null;           // maps 컬렉션 감시 (GM 드로어)
  let _tplUnsub     = null;           // 토큰 템플릿 감시 (GM 팔레트)
  let _mapUnsub     = null;           // 활성 맵 doc 감시
  let _tokensUnsub  = null;           // 활성 맵 tokens 감시
  let _areasUnsub   = null;           // 활성 맵 AoE 영역 감시
  let _pinsUnsub    = null;           // 활성 맵 GM 핀 감시 (GM만 구독)
  let _tokensReady  = false;          // 초기 스냅샷 구분
  let _pingsUnsub   = null;
  let _pingsReady   = false;
  let _changeCb     = null;           // 렌더러 구독 콜백
  let _ensuringDefault = false;       // GM 기본 맵 자동생성 중복 방지

  function _db()        { return (typeof db !== 'undefined') ? db : null; }
  function _ts()        { return firebase.firestore.FieldValue.serverTimestamp(); }
  function _sessDoc()   { return _db().collection(PF_COL.sessions).doc(_sessionId); }
  function _mapsCol()   { return _sessDoc().collection('maps'); }
  function _tplCol()    { return _sessDoc().collection('tokenTemplates'); }  // 토큰 템플릿(세션 레벨)
  function _mapDoc()    { return _mapsCol().doc(_activeMapId); }     // 활성 맵 doc (배경/안개/그리드)
  function _tokensCol() { return _mapDoc().collection('tokens'); }  // 활성 맵 토큰
  function _areasCol()  { return _mapDoc().collection('areas'); }   // 활성 맵 AoE 영역 템플릿
  function _pinsCol()   { return _mapDoc().collection('pins'); }    // 활성 맵 GM 핀 (GM 전용 read/write)
  function _pingsCol()  { return _sessDoc().collection('pings'); }  // 핑은 세션 레벨 (변경 없음)

  function _emit(kind, payload) {
    if (typeof _changeCb === 'function') {
      try { _changeCb(kind, payload); } catch (e) { console.error('[MapSync cb]', e); }
    }
  }

  // ───────────────────────────────────────────
  //  시작 / 정지 — 세션 수명주기에 연동 (cs_session.js)
  // ───────────────────────────────────────────
  function _reconnect() {
    setTimeout(function() { if (_sessionId) start(_sessionId, { isGM: _isGM, uid: _uid }); }, RECONNECT_MS);
  }

  function start(sessionId, opts) {
    opts = opts || {};
    _stopListeners();          // 재진입 idempotent (중복 구독 방지)
    _sessionId = sessionId;
    _isGM = !!opts.isGM;
    _uid  = opts.uid || ((typeof currentUser !== 'undefined' && currentUser) ? currentUser.uid : null);
    _activeMapId = null;
    _maps.clear();
    _templates.clear();
    _mapsReady = false;
    _mapState = null;
    _tokens.clear();
    _areas.clear();
    _paused = false;
    _tokensReady = false;
    if (!_db() || !_sessionId) { console.warn('[MapSync] db/sessionId 없음 — 시작 취소'); return; }

    // 세션 doc 감시 → activeMapId 변경 시 활성 맵 재바인딩 (전원: 플레이어는 이걸로만 추종)
    //                  + paused(준비중) 변경 시 전원에게 전파
    _sessionUnsub = _sessDoc().onSnapshot(function(doc) {
      var data = doc.exists ? doc.data() : {};
      var aid = data.activeMapId || null;
      if (aid !== _activeMapId) _bindMap(aid);
      var pz = !!data.paused;
      if (pz !== _paused) { _paused = pz; _emit('paused', _paused); }
    }, function(err) { console.error('[MapSync session listener]', err); _reconnect(); });

    // 맵 목록 감시 (GM 드로어용). 플레이어는 목록 불필요 — 읽기 절약 위해 GM만 구독.
    if (_isGM) {
      _mapsUnsub = _mapsCol().onSnapshot(function(snap) {
        _maps.clear();
        snap.forEach(function(d) { _maps.set(d.id, Object.assign({ id: d.id }, d.data())); });
        _mapsReady = true;
        _emit('maps', getMaps());
        // GM인데 저장된 맵이 0개면 기본 맵 자동 생성 + 활성화 (1회만)
        if (_maps.size === 0 && !_ensuringDefault) {
          _ensuringDefault = true;
          createMap('지도 1').then(function(id) { return setActiveMap(id); })
            .catch(function(e) { console.warn('[MapSync default map]', e); })
            .then(function() { _ensuringDefault = false; });
        }
      }, function(err) { console.error('[MapSync maps listener]', err); });
    }
    // 토큰 팔레트(tokenTemplates) 기능 제거됨(v0.74) — 배치 토큰 추적기로 대체. 리스너 구독 안 함.

    // 핑 감시 (롱프레스 → 일시적 마커. rolls 패턴: 초기 스냅샷 무시 + added만 처리)
    _pingsReady = false;
    _pingsUnsub = _pingsCol().onSnapshot(function(snap) {
      if (!_pingsReady) { _pingsReady = true; return; }   // 입장 전 누적분 무시
      snap.docChanges().forEach(function(change) {
        if (change.type === 'added') { _emit('ping', Object.assign({ id: change.doc.id }, change.doc.data())); }
      });
    }, function(err) { console.error('[MapSync pings listener]', err); });
  }

  // 활성 맵 바인딩 — 맵 전환 시 기존 맵 doc/토큰 리스너 해제 후 재구독
  function _bindMap(mapId) {
    if (_mapUnsub)    { _mapUnsub();    _mapUnsub = null; }
    if (_tokensUnsub) { _tokensUnsub(); _tokensUnsub = null; }
    if (_areasUnsub)  { _areasUnsub();  _areasUnsub = null; }
    if (_pinsUnsub)   { _pinsUnsub();   _pinsUnsub = null; }
    _activeMapId = mapId || null;
    _mapState = null;
    _tokens.clear();
    _areas.clear();
    _pins.clear();
    _tokensReady = false;
    _emit('active', _activeMapId);            // 뷰 리셋(자동맞춤 재개/편집기 닫기)
    if (!_activeMapId) { _emit('map', null); _emit('tokens-init', []); _emit('areas', []); _emit('pins', []); return; }

    // 활성 맵 상태(배경/안개/그리드) 감시
    _mapUnsub = _mapDoc().onSnapshot(function(doc) {
      _mapState = doc.exists ? doc.data() : null;
      _emit('map', _mapState);
    }, function(err) { console.error('[MapSync map listener]', err); _reconnect(); });

    // 활성 맵 토큰 감시 (rolls 패턴 — docChanges 증분 적용)
    _tokensReady = false;
    _tokensUnsub = _tokensCol().onSnapshot(function(snap) {
      snap.docChanges().forEach(function(change) {
        var id = change.doc.id;
        if (change.type === 'removed') { _tokens.delete(id); }
        else { _tokens.set(id, Object.assign({ id: id }, change.doc.data())); }
      });
      var first = !_tokensReady;
      _tokensReady = true;
      _emit(first ? 'tokens-init' : 'tokens', Array.from(_tokens.values()));
    }, function(err) { console.error('[MapSync tokens listener]', err); _reconnect(); });

    // 활성 맵 AoE 영역 감시 (docChanges 증분 — 전원 구독, 플레이어도 봄)
    _areasUnsub = _areasCol().onSnapshot(function(snap) {
      snap.docChanges().forEach(function(change) {
        var id = change.doc.id;
        if (change.type === 'removed') { _areas.delete(id); }
        else { _areas.set(id, Object.assign({ id: id }, change.doc.data())); }
      });
      _emit('areas', Array.from(_areas.values()));
    }, function(err) { console.error('[MapSync areas listener]', err); _reconnect(); });

    // GM 전용 마스터링 핀 감시 — GM만 구독(플레이어는 read 권한이 없어 구독 자체를 안 함 → 비공개)
    _pins.clear();
    if (_isGM) {
      _pinsUnsub = _pinsCol().onSnapshot(function(snap) {
        snap.docChanges().forEach(function(change) {
          var id = change.doc.id;
          if (change.type === 'removed') { _pins.delete(id); }
          else { _pins.set(id, Object.assign({ id: id }, change.doc.data())); }
        });
        _emit('pins', Array.from(_pins.values()));
      }, function(err) { console.error('[MapSync pins listener]', err); });
    }
  }

  function _stopListeners() {
    if (_sessionUnsub) { _sessionUnsub(); _sessionUnsub = null; }
    if (_mapsUnsub)    { _mapsUnsub();    _mapsUnsub = null; }
    if (_tplUnsub)     { _tplUnsub();     _tplUnsub = null; }
    if (_mapUnsub)     { _mapUnsub();     _mapUnsub = null; }
    if (_tokensUnsub)  { _tokensUnsub();  _tokensUnsub = null; }
    if (_areasUnsub)   { _areasUnsub();   _areasUnsub = null; }
    if (_pinsUnsub)    { _pinsUnsub();    _pinsUnsub = null; }
    if (_pingsUnsub)   { _pingsUnsub();   _pingsUnsub = null; }
  }

  function stop() {
    _stopListeners();
    _sessionId = null;
    _activeMapId = null;
    _maps.clear();
    _templates.clear();
    _mapsReady = false;
    _mapState = null;
    _tokens.clear();
    _areas.clear();
    _pins.clear();
    _paused = false;
    _tokensReady = false;
  }

  // ───────────────────────────────────────────
  //  조회 (렌더러용 — Phase B~)
  // ───────────────────────────────────────────
  function getMapState()   { return _mapState; }
  function getActiveMapId(){ return _activeMapId; }
  function hasActiveMap()  { return !!_activeMapId; }
  function getMaps()       {                              // 드로어용 — order, createdAt 순 정렬
    return Array.from(_maps.values()).sort(function(a, b) {
      return (a.order || 0) - (b.order || 0) || String(a.id).localeCompare(String(b.id));
    });
  }
  function getTokens()   { return Array.from(_tokens.values()); }
  function getToken(id)  { return _tokens.get(id) || null; }
  function getAreas()    { return Array.from(_areas.values()); }
  function getPins()     { return _isGM ? Array.from(_pins.values()) : []; }   // GM만 (플레이어엔 항상 빈 배열)
  function getPin(id)    { return _pins.get(id) || null; }
  function isPaused()    { return _paused; }
  function myToken()     { for (var t of _tokens.values()) { if (t.ownerUid === _uid) return t; } return null; }
  function canControl(t) { return !!t && (_isGM || t.ownerUid === _uid); }   // GM=전체, 플레이어=자기 소유 토큰만 조작(이동/편집/패널)
  function isGM()        { return _isGM; }
  function isActive()    { return !!_sessionId; }
  function onChange(cb)  { _changeCb = cb; }

  // ───────────────────────────────────────────
  //  쓰기: 맵 상태 (GM 전용)
  // ───────────────────────────────────────────
  function setBackground(dataUrl, w, h) {
    if (!_isGM) { console.warn('[MapSync] GM만 배경 설정 가능'); return Promise.reject('not-gm'); }
    if (!_activeMapId) return Promise.reject('no-active-map');
    return _mapDoc().set({
      bgImage: dataUrl || null, bgUrl: null, bgW: w || 0, bgH: h || 0,
      updatedAt: _ts(), updatedBy: _uid
    }, { merge: true });
  }
  // URL 참조 배경 (GM) — Firestore엔 URL만 저장 → 문서 한도 무관, 원본 해상도.
  // url null이면 URL 배경 해제. 업로드(bgImage)와 상호배타(설정 시 반대편 비움).
  function setBackgroundUrl(url, w, h) {
    if (!_isGM) { console.warn('[MapSync] GM만 배경 설정 가능'); return Promise.reject('not-gm'); }
    if (!_activeMapId) return Promise.reject('no-active-map');
    return _mapDoc().set({
      bgUrl: url || null, bgImage: null, bgW: w || 0, bgH: h || 0,
      updatedAt: _ts(), updatedBy: _uid
    }, { merge: true });
  }
  function setGridSize(px) {
    if (!_isGM) return Promise.reject('not-gm');
    if (!_activeMapId) return Promise.reject('no-active-map');
    return _mapDoc().set({ gridSize: px || 50, updatedAt: _ts(), updatedBy: _uid }, { merge: true });
  }
  // 격자 on/off + 셀 크기(px) — GM. enabled/px 중 지정된 것만 갱신.
  function setGrid(enabled, px) {
    if (!_isGM) return Promise.reject('not-gm');
    if (!_activeMapId) return Promise.reject('no-active-map');
    var patch = { updatedAt: _ts(), updatedBy: _uid };
    if (typeof enabled === 'boolean') patch.gridEnabled = enabled;
    if (typeof px === 'number' && px > 0) patch.gridSize = Math.round(px);
    return _mapDoc().set(patch, { merge: true });
  }
  // 격자 원점 오프셋(px) — 배경 격자에 맞춰 상하좌우 이동. GM.
  function setGridOffset(ox, oy) {
    if (!_isGM) return Promise.reject('not-gm');
    if (!_activeMapId) return Promise.reject('no-active-map');
    return _mapDoc().set({ gridOffX: Math.round(ox) || 0, gridOffY: Math.round(oy) || 0, updatedAt: _ts(), updatedBy: _uid }, { merge: true });
  }
  // 세션 준비중(중지) 토글 — 플레이어 화면 가림. GM만. (session doc, activeMapId와 같은 권한)
  function setPaused(on) {
    if (!_isGM) return Promise.reject('not-gm');
    return _sessDoc().set({ paused: !!on }, { merge: true });
  }
  // 안개 마스크 (Phase D — GM 드로잉 결과 동기화)
  function setFogMask(maskDataUrl, mw, mh, enabled) {
    if (!_isGM) return Promise.reject('not-gm');
    if (!_activeMapId) return Promise.reject('no-active-map');
    return _mapDoc().set({
      fogMask: maskDataUrl || null, maskW: mw || 0, maskH: mh || 0,
      fogEnabled: enabled !== false, updatedAt: _ts(), updatedBy: _uid
    }, { merge: true });
  }

  // ───────────────────────────────────────────
  //  쓰기: 토큰
  // ───────────────────────────────────────────
  function createToken(fields) {
    fields = fields || {};
    if (!_activeMapId) return Promise.reject('no-active-map');
    var ref = _tokensCol().doc();
    return ref.set({
      ownerUid: fields.ownerUid || _uid,
      name:  fields.name  || '',
      x:     fields.x     || 0,
      y:     fields.y     || 0,
      img:   fields.img   || null,
      color: fields.color || '#c0a062',
      size:  fields.size  || 1,
      npc:   !!fields.npc,
      sizeCat: fields.sizeCat || null,
      hidden: !!fields.hidden,
      monsterId:   fields.monsterId   || null,    // MonsterDB 연결(스탯블록/굴림)
      monsterName: fields.monsterName || null,
      hpMax: fields.hpMax || 0,                    // 0이면 HP 추적 안 함
      hp:    (fields.hp != null ? fields.hp : (fields.hpMax || 0)),
      updatedAt: _ts(), updatedBy: _uid
    }).then(function() { return ref.id; });
  }
  function upsertToken(id, fields) {
    return _tokensCol().doc(id).set(
      Object.assign({}, fields, { updatedAt: _ts(), updatedBy: _uid }),
      { merge: true }
    );
  }
  // drag-end 위치 동기화 (소유권 검사 — 플레이어는 자기 토큰만)
  function moveToken(id, x, y) {
    var t = _tokens.get(id);
    if (t && !canControl(t)) { console.warn('[MapSync] 토큰 소유권 없음:', id); return Promise.reject('no-perm'); }
    return _tokensCol().doc(id).set({ x: x, y: y, updatedAt: _ts(), updatedBy: _uid }, { merge: true });
  }
  function removeToken(id) {
    var t = _tokens.get(id);
    if (t && !canControl(t)) return Promise.reject('no-perm');
    return _tokensCol().doc(id).delete();
  }
  // 내 토큰에 활성 상태이상 목록 기록 → GM/타인 지도에 아이콘 표시. list=[{id,name,val,img}]
  function setMyConditions(list) {
    if (!_activeMapId) return Promise.resolve();
    var mine = myToken();
    if (!mine) return Promise.resolve();
    return upsertToken(mine.id, { conditions: (list && list.length) ? list : [] }).catch(function(){});
  }
  // 플레이어 입장 시 자기 토큰 보장 (Phase C에서 호출) — 이미 있으면 그 id 반환
  function ensureMyToken(fields) {
    if (!_activeMapId) return Promise.reject('no-active-map');
    var mine = myToken();
    if (mine) return Promise.resolve(mine.id);
    return createToken(Object.assign({ ownerUid: _uid }, fields || {}));
  }

  // ───────────────────────────────────────────
  //  쓰기: AoE 영역 템플릿 (GM 전용) — 폭발(원)/원뿔/직선, 활성 맵에 귀속
  // ───────────────────────────────────────────
  function createArea(fields) {
    if (!_isGM) return Promise.reject('not-gm');
    if (!_activeMapId) return Promise.reject('no-active-map');
    fields = fields || {};
    var ref = _areasCol().doc();
    return ref.set({
      kind:  fields.kind  || 'circle',        // 'circle'(폭발/방출) | 'cone'(원뿔) | 'line'(직선)
      x:     fields.x     || 0,
      y:     fields.y     || 0,
      ft:    fields.ft    || 0,                // 크기(피트): 원=반경, 원뿔/직선=길이
      dir:   fields.dir   || 0,                // 방향(라디안) — 원뿔/직선
      color: fields.color || '#e0662a',
      createdBy: _uid, updatedAt: _ts()
    }).then(function() { return ref.id; });
  }
  function removeArea(id) {
    if (!_isGM) return Promise.reject('not-gm');
    return _areasCol().doc(id).delete();
  }
  // ── GM 마스터링 핀 (GM 전용 — 플레이어는 규칙상 read/write 불가) ──
  function createPin(fields) {
    if (!_isGM) return Promise.reject('not-gm');
    if (!_activeMapId) return Promise.reject('no-active-map');
    fields = fields || {};
    var ref = _pinsCol().doc();
    return ref.set({
      type:  fields.type  || 'npc',           // env|encounter|trap|treasure|npc
      x:     fields.x     || 0,
      y:     fields.y     || 0,
      title: fields.title || '',
      notes: fields.notes || '',
      createdBy: _uid, updatedAt: _ts()
    }).then(function() { return ref.id; });
  }
  function updatePin(id, fields) {
    if (!_isGM) return Promise.reject('not-gm');
    return _pinsCol().doc(id).set(Object.assign({}, fields || {}, { updatedAt: _ts() }), { merge: true });
  }
  function removePin(id) {
    if (!_isGM) return Promise.reject('not-gm');
    return _pinsCol().doc(id).delete();
  }
  function clearAreas() {
    if (!_isGM || !_activeMapId) return Promise.resolve();
    return _areasCol().get().then(function(snap) {
      if (snap.empty) return null;
      var batch = _db().batch();
      snap.forEach(function(d) { batch.delete(d.ref); });
      return batch.commit();
    });
  }

  // ───────────────────────────────────────────
  //  쓰기: 맵 관리 (GM 전용) — 멀티맵 저장/전환
  // ───────────────────────────────────────────
  function _nextOrder() {
    var m = 0; _maps.forEach(function(x) { if ((x.order || 0) > m) m = x.order; });
    return m + 1;
  }
  function createMap(name) {
    if (!_isGM) return Promise.reject('not-gm');
    var ref = _mapsCol().doc();
    return ref.set({
      name: name || '새 지도', order: _nextOrder(),
      bgImage: null, bgUrl: null, bgW: 0, bgH: 0, gridSize: 50, gridEnabled: false,
      fogEnabled: false, fogMask: null, maskW: 0, maskH: 0,
      createdAt: _ts(), updatedAt: _ts(), updatedBy: _uid
    }).then(function() { return ref.id; });
  }
  function renameMap(id, name) {
    if (!_isGM) return Promise.reject('not-gm');
    return _mapsCol().doc(id).set({ name: name || '', updatedAt: _ts(), updatedBy: _uid }, { merge: true });
  }
  function setActiveMap(id) {
    if (!_isGM) return Promise.reject('not-gm');
    return _sessDoc().set({ activeMapId: id || null }, { merge: true });
  }
  function deleteMap(id) {
    if (!_isGM) return Promise.reject('not-gm');
    if (_maps.size <= 1) return Promise.reject('last-map');   // 마지막 1개는 삭제 금지
    var mref = _mapsCol().doc(id);
    // 하위 tokens 서브컬렉션 best-effort 정리(클라 배치) 후 맵 doc 삭제
    return mref.collection('tokens').get().then(function(snap) {
      if (snap.empty) return null;
      var batch = _db().batch();
      snap.forEach(function(d) { batch.delete(d.ref); });
      return batch.commit();
    }).catch(function() {}).then(function() {
      return mref.delete();
    }).then(function() {
      if (_activeMapId === id) {                              // 활성 맵을 지웠으면 다른 맵으로 전환
        var next = null;
        getMaps().forEach(function(x) { if (x.id !== id && !next) next = x.id; });
        return setActiveMap(next);
      }
    });
  }

  // GM NPC 토큰 생성 — 활성 맵에 (ownerUid=gm, npc:true)
  function createNpc(fields) {
    if (!_isGM) return Promise.reject('not-gm');
    if (!_activeMapId) return Promise.reject('no-active-map');
    fields = fields || {};
    return createToken({
      ownerUid: _uid, npc: true,
      name: fields.name || 'NPC',
      x: fields.x || 0, y: fields.y || 0,
      img: fields.img || null, color: fields.color || '#b03030',
      size: fields.size || 1, sizeCat: fields.sizeCat || 'medium',
      hidden: !!fields.hidden,
      monsterId: fields.monsterId || null, monsterName: fields.monsterName || null,
      hpMax: fields.hpMax || 0, hp: (fields.hp != null ? fields.hp : (fields.hpMax || 0))
    });
  }

  // ── 토큰 템플릿(팔레트) — 세션 레벨, GM. 드래그앤드롭으로 createNpc 인스턴스 생성 ──
  function getTemplates() { return Array.from(_templates.values()).sort(function(a, b) { return (a.order || 0) - (b.order || 0); }); }
  function getTemplate(id) { return _templates.get(id) || null; }
  function _nextTplOrder() { var m = 0; _templates.forEach(function(x) { if ((x.order || 0) > m) m = x.order; }); return m + 1; }
  function createTemplate(fields) {
    if (!_isGM) return Promise.reject('not-gm');
    fields = fields || {};
    var ref = _tplCol().doc();
    return ref.set({
      name: fields.name || '토큰', img: fields.img || null,
      color: fields.color || '#b03030', size: fields.size || 1,
      sizeCat: fields.sizeCat || 'medium', hidden: !!fields.hidden,
      order: _nextTplOrder(), createdAt: _ts(), updatedAt: _ts(), updatedBy: _uid
    }).then(function() { return ref.id; });
  }
  function updateTemplate(id, fields) {
    if (!_isGM) return Promise.reject('not-gm');
    return _tplCol().doc(id).set(Object.assign({}, fields, { updatedAt: _ts(), updatedBy: _uid }), { merge: true });
  }
  function deleteTemplate(id) {
    if (!_isGM) return Promise.reject('not-gm');
    return _tplCol().doc(id).delete();
  }

  // ── 핑 (롱프레스) — 일시적 마커. 작성 후 5초 뒤 자동 삭제(누적 방지) ──
  function dropPing(x, y, color) {
    if (!_db() || !_sessionId) return Promise.reject('no-session');
    var ref = _pingsCol().doc();
    return ref.set({ x: x, y: y, uid: _uid, color: color || '#ffd24a', createdAt: _ts() })
      .then(function() {
        setTimeout(function() { ref.delete().catch(function(){}); }, 5000);
        return ref.id;
      });
  }

  // ───────────────────────────────────────────
  //  이미지 → base64 (클라이언트 리사이즈/압축)
  //  File → Promise<{dataUrl, w, h, quality}>
  //  maxDim 초과 시 비율 유지 축소. 용량 상한 초과 시 JPEG 품질 단계적 하향.
  // ───────────────────────────────────────────
  function resizeImageToBase64(file, maxDim, quality) {
    maxDim  = maxDim  || MAP_MAX_DIM;
    quality = quality || MAP_JPEG_Q;
    return new Promise(function(resolve, reject) {
      if (!file) { reject('no-file'); return; }
      var img = new Image();
      var url = URL.createObjectURL(file);
      img.onload = function() {
        URL.revokeObjectURL(url);
        var w = img.naturalWidth, h = img.naturalHeight;
        var scale = Math.min(1, maxDim / Math.max(w, h));
        var cw = Math.max(1, Math.round(w * scale));
        var ch = Math.max(1, Math.round(h * scale));
        var cv = document.createElement('canvas');
        cv.width = cw; cv.height = ch;
        cv.getContext('2d').drawImage(img, 0, 0, cw, ch);
        var q = quality, out = cv.toDataURL('image/jpeg', q);
        // base64 길이 × 0.75 ≈ 디코딩 후 바이트. 상한 초과 시 품질 하향.
        while (out.length * 0.75 > MAP_MAX_BYTES && q > 0.3) {
          q = Math.round((q - 0.1) * 10) / 10;
          out = cv.toDataURL('image/jpeg', q);
        }
        resolve({ dataUrl: out, w: cw, h: ch, quality: q });
      };
      img.onerror = function() { URL.revokeObjectURL(url); reject('img-load-fail'); };
      img.src = url;
    });
  }
  function resizeMapImage(file)   { return resizeImageToBase64(file, MAP_MAX_DIM, MAP_JPEG_Q); }
  function resizeTokenImage(file) { return resizeImageToBase64(file, TOKEN_MAX_DIM, TOKEN_JPEG_Q); }

  // ── 공개 API ──
  return {
    // 수명주기
    start: start, stop: stop, isActive: isActive, isGM: isGM, onChange: onChange,
    // 조회
    getMapState: getMapState, getActiveMapId: getActiveMapId, hasActiveMap: hasActiveMap,
    getMaps: getMaps, getTokens: getTokens, getToken: getToken,
    getAreas: getAreas, isPaused: isPaused,
    getPins: getPins, getPin: getPin,
    myToken: myToken, canControl: canControl,
    // 맵 관리 (GM) — 멀티맵 저장/전환
    createMap: createMap, renameMap: renameMap, deleteMap: deleteMap, setActiveMap: setActiveMap,
    // 맵 쓰기 (GM)
    setBackground: setBackground, setBackgroundUrl: setBackgroundUrl,
    setGridSize: setGridSize, setGrid: setGrid, setGridOffset: setGridOffset, setFogMask: setFogMask,
    // AoE 영역 (GM) + 세션 준비중
    createArea: createArea, removeArea: removeArea, clearAreas: clearAreas, setPaused: setPaused,
    // GM 마스터링 핀 (GM 전용)
    createPin: createPin, updatePin: updatePin, removePin: removePin,
    // 토큰 쓰기
    createToken: createToken, upsertToken: upsertToken, moveToken: moveToken,
    removeToken: removeToken, ensureMyToken: ensureMyToken, createNpc: createNpc,
    setMyConditions: setMyConditions,
    // 토큰 템플릿(팔레트, GM)
    getTemplates: getTemplates, getTemplate: getTemplate,
    createTemplate: createTemplate, updateTemplate: updateTemplate, deleteTemplate: deleteTemplate,
    // 핑
    dropPing: dropPing,
    // 이미지 헬퍼
    resizeMapImage: resizeMapImage, resizeTokenImage: resizeTokenImage,
    resizeImageToBase64: resizeImageToBase64,
    // 상수 노출 (Phase B~ 렌더러/UI)
    consts: {
      MAP_MAX_DIM: MAP_MAX_DIM, MAP_JPEG_Q: MAP_JPEG_Q,
      TOKEN_MAX_DIM: TOKEN_MAX_DIM, TOKEN_JPEG_Q: TOKEN_JPEG_Q, MASK_SCALE: MASK_SCALE
    }
  };
})();


// ═══════════════════════════════════════════════
//  MAP VIEW — 캔버스 렌더러 + 터치 줌/팬 + GM 배경 업로드
//  Phase B: 배경 렌더 + 핀치줌/팬 + GM 업로드. 토큰/안개는 Phase C/D.
//  MapSync(데이터)와 분리된 표현 계층. MapSync.onChange로 재draw 트리거.
// ═══════════════════════════════════════════════
var MapView = (function() {
  'use strict';

  const MIN_SCALE = 0.05, MAX_SCALE = 16;
  const GRID_MIN_PX = 6;   // 화면상 셀이 이보다 작으면 그리드 생략(모아레 방지)
  // 격자 (배치 + 스냅 + 0~100% 비율). 슬라이더 0~100% ↔ 셀 크기 px 선형 매핑.
  const GRID_UI_MIN = 16, GRID_UI_MAX = 200;
  let _gridEnabled = false;   // 격자 표시 + 토큰 스냅 (맵 state.gridEnabled 동기화)
  let _gridPx = 50;           // 셀 크기 px (맵 state.gridSize 동기화) — _cell()/토큰크기/스냅의 단일 출처
  let _gridDragging = false;  // 슬라이딩 중(로컬 미리보기, Firestore 쓰기 보류)
  let _gridOffX = 0, _gridOffY = 0;  // 격자 원점 오프셋(px) — 배경 격자 정렬 (state.gridOffX/Y 동기화)
  let _gridOffTimer = 0;      // 오프셋 넛지 쓰기 디바운스

  // ── AoE 영역 템플릿 (GM 배치, 전원 동기화) + 세션 준비중 ──
  const AREA_COLOR = '#e0662a';       // AoE 기본색(따뜻한 주황)
  let _areaTool = null;       // 선택된 영역 도구: 'circle'|'cone'|'line'|null
  let _areaMenu = false;      // 영역 플라이아웃 메뉴 열림 여부
  let _areaDrag = null;       // 배치 중(러버밴드): {ox,oy(월드 원점), cx,cy(월드 현재), start(스크린)}
  // GM 마스터링 핀 (GM 전용): 5종 이모지 핀 배치 + 메모 편집 — 플레이어엔 안 보임
  const PIN_TYPES = {
    env:       { emoji: '🌲', label: '환경',  color: '#5aa469' },
    encounter: { emoji: '⚔️', label: '조우',  color: '#e05a4e' },
    trap:      { emoji: '🪤', label: '함정',  color: '#e0842a' },
    treasure:  { emoji: '💰', label: '보물',  color: '#e2b23a' },
    npc:       { emoji: '👤', label: 'NPC',   color: '#4a90d9' }
  };
  let _pinTool   = null;      // 선택된 핀 종류(배치 모드): env|encounter|trap|treasure|npc|null
  let _pinMenu   = false;     // 핀 종류 플라이아웃 열림 여부
  let _pinDrag   = null;      // 핀 이동 중: {id,x,y,grabX,grabY,startScreen,moved}
  let _pinEditId = null;      // 편집기에 열린 핀 id
  let _paused = false;        // 세션 준비중(중지) — 플레이어 화면 가림 (MapSync.isPaused 미러)

  let _inited  = false;
  let _active  = false;     // 지도 패널이 표시 중인가
  let _dirty   = true;      // 다시 그려야 하는가 (rAF dirty-flag)
  let _onRenderCb = null;   // 실제 렌더(화면 변화) 발생 시 호출 — CCTV 프레임 캡처용
  let _raf      = null;
  let _cv = null, _ctx = null, _stage = null, _empty = null, _fileInput = null;
  let _uploadBtn = null;

  // 뷰포트 (CSS px 기준): screen = world * scale + off
  let _view = { scale: 1, offX: 0, offY: 0 };
  let _cssW = 0, _cssH = 0, _dpr = 1;

  // 배경 이미지 캐시
  let _bg = { url: null, img: null, w: 0, h: 0, loaded: false };
  let _userMoved = false;   // 사용자가 직접 팬/줌 했나 (true면 자동 맞춤 중단 — 시점 유지)

  // 토큰 초상 이미지 캐시 (base64 url → {img, loaded})
  let _tokenImgs = new Map();
  // 상태이상 아이콘 캐시 (상대경로 → {img, loaded})
  let _condImgs = new Map();

  // 포인터 상태
  let _drag = null;         // 마우스/단일터치 팬: {x,y}
  let _pinch = null;        // 2터치 줌: {dist, mid, worldMid, scale}
  let _tokenDrag = null;    // 토큰 끌기: {id, x, y, grabX, grabY} (x,y=현재 월드 위치)
  let _highlightId = null;  // 드로어 토큰 목록에서 선택해 강조 중인 토큰 id (펄스 링)
  let _highlightT0 = 0;     // 강조 시작 시각(펄스 애니 위상)

  // ── 전장의 안개 (Phase D) ──
  let _fogEnabled = false;
  let _maskCv = null, _maskCtx = null, _maskW = 0, _maskH = 0;  // 공개 마스크(저해상도): 불투명=공개
  let _maskUrl = null;      // 마지막 로드/기록한 fogMask data url (자기 echo 스킵)
  let _maskLoadTok = 0;     // 비동기 마스크 로드 경합 방지 토큰
  let _fogCanvas = null, _fogCtx = null;  // 화면 크기 안개 합성용 오프스크린
  const BRUSH_SIZES = [40, 80, 160, 320];
  const BRUSH_LABELS = ['소', '중', '대', '특'];
  let _brushIdx = 1;
  let _brush = { paint: false, mode: 'reveal', size: BRUSH_SIZES[1], shape: 'free' };  // shape: free|rect|circle
  let _stroke = null;       // 그리는 중(자유곡선): {last:{x,y}}
  let _shapeDrag = null;    // 그리는 중(사각/원): {start:{x,y}, cur:{x,y}} (스크린 좌표)

  // ── 원격 이동 보간 (Phase E) ──
  let _disp = new Map();    // tokenId → {x,y} 화면 표시 위치 (원격 이동 보간용)
  let _animActive = false;  // 이번 프레임에 보간 진행 중 (다음 프레임 재draw)

  // ── 시트 플레이 뷰 (관리기능 없음: 이동·내토큰·핑만) + 핑 ──
  let _playMode = false;    // true=시트 오버레이(플레이 뷰): GM 도구/투시 안개 비활성, 핑/내토큰 활성
  let _displayPlayer = false; // true=플레이어 디스플레이 창/CCTV(?display=player): 진짜 플레이어 시점·무조작·카메라는 동기화로만 제어
  let _pendingCam = null;   // 캔버스 준비 전 도착한 동기화 카메라 (resize 후 적용)
  let _resizeDeb = 0;       // 플레이어 디스플레이 리사이즈 디바운스 타이머
  let _pings = [];          // [{x,y,color,t0}] 진행 중인 핑 (t0=performance.now())
  let _press = null;        // 롱프레스 추적 {x,y,timer,fired}
  const PING_MS = 2600;     // 핑 애니메이션 지속(ms)
  const LONGPRESS_MS = 1000;// 1초 홀드 → 핑
  const PRESS_MOVE_TOL = 8; // 이만큼 움직이면 롱프레스 취소(=드래그/팬)

  function _clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function _markDirty() { _dirty = true; }
  function _now() { return (typeof performance !== 'undefined' && performance.now) ? performance.now() : 0; }
  // 시트 플레이 뷰·플레이어 디스플레이에선 GM 권한 무력화(불투명 안개+숨김토큰 숨김+도구 없음)
  function _effGM() { return !_playMode && !_displayPlayer && (typeof MapSync !== 'undefined') && MapSync.isGM(); }

  // ── 좌표 변환 ──
  function _screenToWorld(sx, sy) {
    return { x: (sx - _view.offX) / _view.scale, y: (sy - _view.offY) / _view.scale };
  }
  function _localXY(ev) {
    const r = _cv.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  }
  function _touchLocal(t) {
    const r = _cv.getBoundingClientRect();
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }

  // ── 초기화 (최초 표시 시 1회) ──
  function init() {
    if (_inited) return;
    _cv    = document.getElementById('map-canvas');
    _stage = document.getElementById('map-stage');
    _empty = document.getElementById('map-empty');
    _fileInput = document.getElementById('map-bg-input');
    _uploadBtn = document.getElementById('map-upload-btn');
    if (!_cv || !_stage) return;          // 마크업 없으면 보류
    _ctx = _cv.getContext('2d');
    if (typeof window !== 'undefined' && window._mapDisplayPlayer) _displayPlayer = true;
    _inited = true;

    // MapSync 데이터 변경 → 재draw
    if (typeof MapSync !== 'undefined') {
      MapSync.onChange(function(kind, payload) {
        if (kind === 'map') { _onMapState(payload); }
        else if (kind === 'active') { _highlightId = null; _onActiveMapChange(); _maybeRefreshTokenList(); }   // 활성 맵 전환 → 뷰 리셋
        else if (kind === 'maps') { _renderDrawer(); }          // 맵 목록 변경 → 드로어 갱신(GM)
        else if (kind === 'tokens-init') { _maybeProvision(); _maybeRefreshTokenList(); _markDirty(); }
        else if (kind === 'areas') { _markDirty(); }            // AoE 영역 변경 → 재draw
        else if (kind === 'pins') { _markDirty(); }             // GM 핀 변경 → 재draw
        else if (kind === 'paused') { _paused = !!payload; _refreshPauseUI(); _markDirty(); }
        else if (kind === 'ping') { _addPing(payload); }
        else { _maybeRefreshTokenList(); _markDirty(); }        // 'tokens' 증분 변경 → 목록 갱신
      });
    }

    // 입력은 캔버스에만 바인딩 — 위에 떠 있는 툴바/줌 버튼 탭이 preventDefault로 막히지 않도록
    // ── 터치 (모바일: 핀치줌/팬/토큰 끌기) ──
    _cv.addEventListener('touchstart', _onTouchStart, { passive: false });
    _cv.addEventListener('touchmove',  _onTouchMove,  { passive: false });
    _cv.addEventListener('touchend',   _onTouchEnd,   { passive: false });
    _cv.addEventListener('touchcancel',_onTouchEnd,   { passive: false });
    // ── 마우스 (데스크톱: 드래그 팬 + 휠 줌 + 토큰 끌기) ──
    _cv.addEventListener('mousedown', _onMouseDown);
    window.addEventListener('mousemove', _onMouseMove);
    window.addEventListener('mouseup',   _onMouseUp);
    _cv.addEventListener('wheel', _onWheel, { passive: false });

    // ── 키보드 단축키 (GM): 스페이스바 = 세션 준비중(중지) 토글 ──
    window.addEventListener('keydown', function(e) {
      if (e.code !== 'Space' && e.key !== ' ') return;
      if (!_active || !_effGM()) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      e.preventDefault();
      togglePause();
    });

    // ── GM 배경 업로드 ──
    if (_fileInput) _fileInput.addEventListener('change', _onPickBg);

    window.addEventListener('resize', function() {
      if (!_active) return;
      _positionFullscreen();
      // 플레이어 디스플레이 창: 최대화 시 resize가 연속 발생 → 디바운스로 합쳐 깜빡임 방지
      if (_displayPlayer) { clearTimeout(_resizeDeb); _resizeDeb = setTimeout(_resize, 130); }
      else _resize();
    });
  }

  // ── 전체화면 토글 (상단 바의 🗺 지도 버튼) ──
  // 상단 #auth-bar를 제외한 전체를 덮는 fixed 오버레이. top은 auth-bar 하단으로 맞춤.
  function _positionFullscreen() {
    const bar = document.getElementById('header') || document.getElementById('auth-bar');
    const fs = document.getElementById('map-fullscreen');
    if (fs) fs.style.top = (bar ? Math.round(bar.getBoundingClientRect().bottom) : 0) + 'px';
  }
  function toggleFullscreen() {
    const fs = document.getElementById('map-fullscreen');
    if (!fs) return;
    const open = !fs.classList.contains('open');
    const btn = document.getElementById('map-fab');
    if (open) {
      _playMode = true;                   // 시트 오버레이 = 플레이 뷰(관리기능 없음, 이동·내토큰·핑만)
      window.scrollTo(0, 0);              // 스크롤 상태에서도 auth-bar 하단 정확히 측정
      _positionFullscreen();
      fs.classList.add('open');
      document.body.classList.add('map-open');
      if (btn) btn.classList.add('on');
      show();
    } else {
      fs.classList.remove('open');
      document.body.classList.remove('map-open');
      if (btn) btn.classList.remove('on');
      hide();
    }
  }
  function openFullscreen() {
    const fs = document.getElementById('map-fullscreen');
    if (fs && !fs.classList.contains('open')) toggleFullscreen();
  }
  function closeFullscreen() {
    const fs = document.getElementById('map-fullscreen');
    if (fs && fs.classList.contains('open')) toggleFullscreen();
  }

  // ── 표시/숨김 (toggleFullscreen에서 호출) ──
  function show() {
    init();
    if (!_inited) return;
    _active = true;
    _refreshToolbar();
    _onMapState(typeof MapSync !== 'undefined' ? MapSync.getMapState() : null);
    _resize();                            // 캔버스 크기 확정 + 첫 draw (_autoFit 포함)
    _maybeProvision();                    // 토큰 동기화 후 진입했다면 보강
    _loop();
    // 모바일: 헤더/주소창 높이가 늦게 잡히는 경우 대비 — 다음 프레임 + 짧은 지연 재측정(_resize가 _autoFit 포함)
    requestAnimationFrame(function() { if (_active) _resize(); });
    setTimeout(function() { if (_active) _resize(); }, 250);
  }
  function hide() {
    _active = false;
    if (_raf) { cancelAnimationFrame(_raf); _raf = null; }
    if (_drag) _drag = null;
    if (_pinch) _pinch = null;
  }

  // ── 캔버스 픽셀 크기 = 뷰포트 잔여 높이 ──
  // 전체화면 오버레이(상단 바 제외 전체)라 하단 내비까지 덮음 → 스테이지 상단부터 화면 끝까지.
  function _resize() {
    if (!_stage) return;
    const rect = _stage.getBoundingClientRect();
    let h = window.innerHeight - rect.top;
    if (!(h > 120)) h = 120;
    _stage.style.height = h + 'px';

    _dpr  = window.devicePixelRatio || 1;
    _cssW = _stage.clientWidth  || Math.round(rect.width) || 1;
    _cssH = _stage.clientHeight || h;
    _cv.width  = Math.max(1, Math.round(_cssW * _dpr));
    _cv.height = Math.max(1, Math.round(_cssH * _dpr));
    _autoFit();
    if (_displayPlayer && _pendingCam) _applyCamNow(_pendingCam);  // 동기화된 카메라 유지(autoFit 덮어쓰기 방지)
    _markDirty();
  }

  // 사용자가 아직 손대지 않았으면 전체 맞춤 (모바일에서 크기 늦게 확정돼도 최종 크기에 맞춰짐)
  function _autoFit() {
    if (_bg.loaded && !_userMoved && _cssW && _cssH) fit(_displayPlayer);  // 플레이어 디스플레이=꽉 채움(cover)
  }

  // ── 배경 상태 변경 처리 ──
  // bgUrl(참조) 우선, 없으면 bgImage(base64 업로드). URL은 crossOrigin='anonymous'로 시도
  // (같은 오리진 maps/는 무조건 OK, 외부 호스트는 ACAO 필요) → 실패 시 CORS 없이 재시도
  // (표시는 되나 캔버스 taint → CCTV 캡처만 불가, try/catch로 무해).
  function _onMapState(state) {
    const url = state ? (state.bgUrl || state.bgImage || null) : null;
    if (url !== _bg.url) {
      _bg = { url: url, img: null, w: 0, h: 0, loaded: false };
      _userMoved = false;                 // 새 배경 → 자동 맞춤 재개
      if (url) {
        const isRef = url.indexOf('data:') !== 0;
        const load = function(useCors) {
          const img = new Image();
          if (useCors) img.crossOrigin = 'anonymous';
          img.onload = function() {
            if (_bg.url !== url) return;  // 로딩 중 배경이 또 바뀐 경우 무시
            _bg.img = img; _bg.loaded = true;
            _bg.w = (state && state.bgW) || img.naturalWidth;
            _bg.h = (state && state.bgH) || img.naturalHeight;
            _autoFit();                   // 캔버스 크기 확정돼 있으면 전체 맞춤
            _refreshEmpty();
            _refreshMapEditor();
            _markDirty();
          };
          img.onerror = function() {
            if (useCors) { console.warn('[MapView] 배경 CORS 로드 실패 → 무CORS 재시도(CCTV 캡처 불가)'); load(false); }
            else console.warn('[MapView] 배경 로드 실패:', url.slice(0, 120));
          };
          img.src = url;
        };
        load(isRef);
      }
    } else if (url && _bg.loaded && state) {
      // 같은 배경, 치수만 갱신 가능
      _bg.w = state.bgW || _bg.w; _bg.h = state.bgH || _bg.h;
    }
    // 안개 (Phase D)
    _fogEnabled = !!(state && state.fogEnabled);
    _loadMaskFromState(state);
    // 격자 (배치 + 스냅) — 슬라이딩 중이 아니면 state로 동기화
    _gridEnabled = !!(state && state.gridEnabled);
    if (!_gridDragging) _gridPx = (state && state.gridSize) ? state.gridSize : 50;
    if (!_gridOffTimer) { _gridOffX = (state && state.gridOffX) || 0; _gridOffY = (state && state.gridOffY) || 0; }
    _refreshEmpty();
    _refreshToolbar();
    _markDirty();
  }

  function _refreshEmpty() {
    if (!_empty) return;
    if (_bg.loaded) { _empty.style.display = 'none'; return; }
    _empty.style.display = 'flex';
    const gm = _effGM();
    _empty.textContent = gm
      ? '배경 이미지를 업로드하면 모든 참가자에게 표시됩니다.'
      : 'GM이 지도를 준비하면 여기에 표시됩니다.';
  }

  function _refreshToolbar() {
    const gm = _effGM();
    const drawerBtn = document.getElementById('map-drawer-btn');
    if (drawerBtn) drawerBtn.style.display = gm ? '' : 'none';
    _refreshFogToolbar();           // 공개/제거 버튼 + 확장 메뉴 (GM)
    _refreshAreaToolbar();          // AoE 영역 버튼 + 확장 메뉴 (GM)
    _refreshPinToolbar();           // GM 마스터링 핀 버튼 + 확장 메뉴 (GM)
    _refreshCamToolbar();           // 카메라 제어 버튼 + 확장 메뉴 (GM)
    _refreshPauseUI();              // 준비중(중지) 배지/버튼
    if (gm) _refreshMapEditor();    // 배경/격자는 드로어 지도 편집기로 이동
    // 시트 플레이 뷰 전용: '내 토큰 놓기' 버튼
    const placeBtn = document.getElementById('map-place-btn');
    if (placeBtn) placeBtn.style.display = _playMode ? '' : 'none';
  }
  // AoE 영역 툴바 (버튼 + 확장 메뉴: 폭발/원뿔/직선/지우기)
  function _refreshAreaToolbar() {
    const gm = _effGM();
    const btn = document.getElementById('area-btn');
    if (btn) { btn.style.display = gm ? '' : 'none'; btn.classList.toggle('on', !!_areaTool || _areaMenu); }
    const menu = document.getElementById('area-menu');
    if (menu) menu.style.display = (gm && _areaMenu) ? 'flex' : 'none';
    const items = document.querySelectorAll('#area-menu [data-area]');
    for (let i = 0; i < items.length; i++) items[i].classList.toggle('on', items[i].getAttribute('data-area') === _areaTool);
  }
  function toggleAreaMenu() {
    if (!_effGM()) return;
    _areaMenu = !_areaMenu;
    if (_areaMenu) { _fogMenu = null; _brush.paint = false; _camMenu = false; _pinMenu = false; _pinTool = null; }   // 다른 플라이아웃과 상호배타
    _refreshFogToolbar(); _refreshAreaToolbar(); _refreshCamToolbar(); _refreshPinToolbar(); _markDirty();
  }
  // 영역 도구 선택: kind(circle/cone/line). 이후 지도에 드래그로 배치.
  function setAreaTool(kind) {
    if (!_effGM()) return;
    _areaTool = (kind === 'cone' || kind === 'line') ? kind : 'circle';
    _brush.paint = false; _fogMenu = null;                      // 안개 브러시 끔
    _pinTool = null; _pinMenu = false;                          // 핀 도구 끔(상호배타)
    _refreshFogToolbar(); _refreshAreaToolbar(); _refreshPinToolbar(); _markDirty();
  }
  // ── GM 마스터링 핀 툴바 (버튼 + 5종 확장 메뉴: 환경/조우/함정/보물/NPC) ──
  function _refreshPinToolbar() {
    const gm = _effGM();
    const btn = document.getElementById('pin-btn');
    if (btn) { btn.style.display = gm ? '' : 'none'; btn.classList.toggle('on', !!_pinTool || _pinMenu); }
    const menu = document.getElementById('pin-menu');
    if (menu) menu.style.display = (gm && _pinMenu) ? 'flex' : 'none';
    const items = document.querySelectorAll('#pin-menu [data-pin]');
    for (let i = 0; i < items.length; i++) items[i].classList.toggle('on', items[i].getAttribute('data-pin') === _pinTool);
  }
  function togglePinMenu() {
    if (!_effGM()) return;
    _pinMenu = !_pinMenu;
    if (_pinMenu) { _fogMenu = null; _brush.paint = false; _camMenu = false; _areaMenu = false; _areaTool = null; }  // 다른 플라이아웃과 상호배타
    _refreshFogToolbar(); _refreshAreaToolbar(); _refreshCamToolbar(); _refreshPinToolbar(); _markDirty();
  }
  // 핀 종류 선택 → 지도를 탭하면 그 자리에 핀 배치. 다시 누르면 해제.
  function setPinTool(type) {
    if (!_effGM()) return;
    _pinTool = (_pinTool === type) ? null : (PIN_TYPES[type] ? type : null);
    _pinMenu = false;
    _brush.paint = false; _fogMenu = null; _areaTool = null; _areaMenu = false;   // 다른 배치 도구 끔
    _refreshFogToolbar(); _refreshAreaToolbar(); _refreshPinToolbar(); _markDirty();
  }
  function clearAreas() {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    if (!MapSync.getAreas().length) return;
    MapSync.clearAreas().catch(function(e) { console.warn('[clearAreas]', e); });
  }
  function _isAreaPlacing() { return _effGM() && !!_areaTool; }

  // ── 카메라 제어 플라이아웃 (듀얼모니터 GM 도구: 플레이어창/동기화/따라가기/CCTV) ──
  let _camMenu = false;
  function _refreshCamToolbar() {
    const gm = _effGM();
    const btn = document.getElementById('cam-btn');
    if (btn) { btn.style.display = gm ? '' : 'none'; btn.classList.toggle('on', _camMenu); }
    const menu = document.getElementById('cam-menu');
    if (menu) menu.style.display = (gm && _camMenu) ? 'flex' : 'none';
  }
  function toggleCamMenu() {
    if (!_effGM()) return;
    _camMenu = !_camMenu;
    if (_camMenu) { _fogMenu = null; _areaMenu = false; _pinMenu = false; _pinTool = null; }   // 다른 플라이아웃과 상호배타
    _refreshFogToolbar(); _refreshAreaToolbar(); _refreshCamToolbar(); _refreshPinToolbar(); _markDirty();
  }

  // ── 세션 준비중(중지) — 스페이스바/버튼 토글, 플레이어 화면 가림 ──
  function togglePause() {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    MapSync.setPaused(!_paused).catch(function(e) { console.warn('[togglePause]', e); });
  }
  function _refreshPauseUI() {
    // 준비중(중지) 상태바 — 버튼 아님. GM 뷰에서만 표시(플레이어 화면 가림은 _render에서 처리).
    // 토글은 스페이스바(togglePause). 여기선 현재 상태만 반영.
    const el = document.getElementById('map-pause-status');
    if (el) {
      el.style.display = _effGM() ? '' : 'none';
      el.classList.toggle('paused', _paused);
      el.textContent = _paused ? '⏸ 중지됨' : '▶ 진행 중';
    }
  }

  // ── AoE 영역 배치 (GM 드래그) + 지오메트리 ──
  const AREA_FT_PER_CELL = 5;                                   // PF2e: 1칸 = 5ft
  function _distToFt(worldDist) { return Math.max(AREA_FT_PER_CELL, Math.round(worldDist / _cell()) * AREA_FT_PER_CELL); }
  function _ftToWorld(ft) { return (ft / AREA_FT_PER_CELL) * _cell(); }
  function _startArea(p) {
    var w = _screenToWorld(p.x, p.y);
    if (_gridEnabled) { var s = _snapCorner(w.x, w.y); w = s; }
    _areaDrag = { ox: w.x, oy: w.y, cx: w.x, cy: w.y };
    _markDirty();
  }
  function _moveArea(p) {
    if (!_areaDrag) return;
    var w = _screenToWorld(p.x, p.y);
    _areaDrag.cx = w.x; _areaDrag.cy = w.y; _markDirty();
  }
  function _hitArea(wx, wy) {                                   // 원점 근처(탭 삭제용)
    var as = (typeof MapSync !== 'undefined') ? MapSync.getAreas() : [], tol = _cell() * 0.7;
    for (var i = as.length - 1; i >= 0; i--) {
      var a = as[i]; if (Math.hypot(wx - a.x, wy - a.y) <= tol) return a;
    }
    return null;
  }
  function _endArea() {
    if (!_areaDrag) return;
    var d = _areaDrag; _areaDrag = null;
    if (typeof MapSync === 'undefined') { _markDirty(); return; }
    var dx = d.cx - d.ox, dy = d.cy - d.oy, dist = Math.hypot(dx, dy);
    if (dist * _view.scale < 6) {                              // 탭 = 원점 근처 영역 삭제
      var hit = _hitArea(d.ox, d.oy);
      if (hit) MapSync.removeArea(hit.id).catch(function(e) { console.warn('[removeArea]', e); });
      _markDirty(); return;
    }
    MapSync.createArea({ kind: _areaTool, x: Math.round(d.ox), y: Math.round(d.oy),
      ft: _distToFt(dist), dir: Math.atan2(dy, dx), color: AREA_COLOR })
      .catch(function(e) { console.warn('[createArea]', e); });
    _markDirty();
  }
  // 영역 경로 구성 (스크린 좌표, rpx=반경/길이 px, dir=라디안)
  function _areaPath(ctx, kind, sx, sy, rpx, dir) {
    ctx.beginPath();
    if (kind === 'cone') {                                     // PF2e 원뿔 = 사분원(90°)
      ctx.moveTo(sx, sy);
      ctx.arc(sx, sy, rpx, dir - Math.PI / 4, dir + Math.PI / 4);
      ctx.closePath();
    } else if (kind === 'line') {                              // 직선 = 폭 5ft(1칸)
      var wpx = _cell() * _view.scale, hw = wpx / 2;
      var ux = Math.cos(dir), uy = Math.sin(dir), px = -uy, py = ux;
      ctx.moveTo(sx + px * hw, sy + py * hw);
      ctx.lineTo(sx - px * hw, sy - py * hw);
      ctx.lineTo(sx - px * hw + ux * rpx, sy - py * hw + uy * rpx);
      ctx.lineTo(sx + px * hw + ux * rpx, sy + py * hw + uy * rpx);
      ctx.closePath();
    } else {                                                   // circle = 폭발/방출
      ctx.arc(sx, sy, rpx, 0, Math.PI * 2);
    }
  }
  function _drawAreaShape(kind, ox, oy, ft, dir, color, dashed) {
    var sx = _view.offX + ox * _view.scale, sy = _view.offY + oy * _view.scale;
    var rpx = _ftToWorld(ft) * _view.scale;
    _ctx.save();
    _areaPath(_ctx, kind, sx, sy, rpx, dir);
    _ctx.globalAlpha = 0.22; _ctx.fillStyle = color; _ctx.fill();
    _ctx.globalAlpha = 0.95; _ctx.strokeStyle = color; _ctx.lineWidth = 2;
    if (dashed) _ctx.setLineDash([6, 4]);
    _ctx.stroke();
    // ft 라벨
    _ctx.setLineDash([]);
    var lx = sx, ly = sy;
    if (kind === 'circle') ly = sy - rpx - 6; else { lx = sx + Math.cos(dir) * rpx * 0.55; ly = sy + Math.sin(dir) * rpx * 0.55; }
    _ctx.globalAlpha = 1; _ctx.font = '700 13px Eczar, serif';
    _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
    _ctx.lineWidth = 3; _ctx.strokeStyle = 'rgba(0,0,0,0.75)';
    _ctx.strokeText(ft + ' ft', lx, ly); _ctx.fillStyle = '#fff'; _ctx.fillText(ft + ' ft', lx, ly);
    _ctx.restore();
  }
  function _drawAreas() {
    if (typeof MapSync === 'undefined') return;
    var as = MapSync.getAreas();
    for (var i = 0; i < as.length; i++) {
      var a = as[i];
      _drawAreaShape(a.kind || 'circle', a.x, a.y, a.ft || 0, a.dir || 0, a.color || AREA_COLOR, false);
    }
  }
  function _drawAreaPreview() {
    if (!_areaDrag) return;
    var d = _areaDrag, dx = d.cx - d.ox, dy = d.cy - d.oy, dist = Math.hypot(dx, dy);
    _drawAreaShape(_areaTool || 'circle', d.ox, d.oy, _distToFt(dist), Math.atan2(dy, dx), AREA_COLOR, true);
  }

  // ── GM 마스터링 핀: 배치 / 이동 / 탭-편집 / 렌더 (GM 전용 — 플레이어엔 안 보임) ──
  function _isPinPlacing() { return _effGM() && !!_pinTool; }
  function _hitPin(wx, wy) {
    if (!_effGM() || typeof MapSync === 'undefined') return null;
    var ps = MapSync.getPins(), tol = 20 / _view.scale;         // 화면 20px 반경 → 월드
    for (var i = ps.length - 1; i >= 0; i--) { var p = ps[i]; if (Math.hypot(wx - p.x, wy - p.y) <= tol) return p; }
    return null;
  }
  function _placePin(scr) {
    var w = _screenToWorld(scr.x, scr.y);
    var hit = _hitPin(w.x, w.y);
    if (hit) { _pinTool = null; _refreshPinToolbar(); openPinEditor(hit.id); return; }   // 기존 핀 탭 → 편집
    var type = _pinTool;
    MapSync.createPin({ type: type, x: Math.round(w.x), y: Math.round(w.y) })
      .then(function(id) { _pinTool = null; _refreshPinToolbar(); openPinEditor(id); })   // 배치 즉시 편집기 열기
      .catch(function(e) { console.warn('[createPin]', e); });
  }
  function _tryStartPinDrag(scr) {
    if (!_effGM() || typeof MapSync === 'undefined') return false;
    var w = _screenToWorld(scr.x, scr.y);
    var pin = _hitPin(w.x, w.y);
    if (!pin) return false;
    _pinDrag = { id: pin.id, x: pin.x, y: pin.y, grabX: pin.x - w.x, grabY: pin.y - w.y, startScreen: { x: scr.x, y: scr.y }, moved: 0 };
    _markDirty(); return true;
  }
  function _dragPinTo(scr) {
    var w = _screenToWorld(scr.x, scr.y);
    _pinDrag.x = w.x + _pinDrag.grabX; _pinDrag.y = w.y + _pinDrag.grabY;
    var dx = scr.x - _pinDrag.startScreen.x, dy = scr.y - _pinDrag.startScreen.y;
    _pinDrag.moved = Math.max(_pinDrag.moved, Math.hypot(dx, dy));
    _markDirty();
  }
  function _endPinDrag() {
    if (!_pinDrag) return;
    var d = _pinDrag; _pinDrag = null;
    if (typeof MapSync === 'undefined') { _markDirty(); return; }
    if (d.moved < 5) { openPinEditor(d.id); _markDirty(); return; }   // 거의 안 움직임 = 탭 → 편집기
    MapSync.updatePin(d.id, { x: Math.round(d.x), y: Math.round(d.y) }).catch(function(e) { console.warn('[updatePin]', e); _markDirty(); });
    _markDirty();
  }
  function _drawPins() {
    if (!_effGM() || typeof MapSync === 'undefined') return;    // GM 전용 렌더 게이트
    var ps = MapSync.getPins();
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      var pos = (_pinDrag && _pinDrag.id === p.id) ? _pinDrag : p;
      _drawPinMarker(p.type, pos.x, pos.y, p.title, !!(p.notes && String(p.notes).trim()));
    }
  }
  function _drawPinMarker(type, wx, wy, title, hasNotes) {
    var def = PIN_TYPES[type] || PIN_TYPES.npc;
    var sx = _view.offX + wx * _view.scale, sy = _view.offY + wy * _view.scale;
    var R = 16;
    _ctx.save();
    _ctx.beginPath(); _ctx.arc(sx, sy, R, 0, Math.PI * 2);
    _ctx.fillStyle = 'rgba(24,14,12,0.88)'; _ctx.fill();
    _ctx.lineWidth = 2.5; _ctx.strokeStyle = def.color; _ctx.stroke();
    _ctx.font = '18px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
    _ctx.fillText(def.emoji, sx, sy + 1);
    if (hasNotes) {                                             // 메모 있음 → 우상단 골드 점
      _ctx.beginPath(); _ctx.arc(sx + R * 0.74, sy - R * 0.74, 4.5, 0, Math.PI * 2);
      _ctx.fillStyle = '#f1c40f'; _ctx.fill();
      _ctx.lineWidth = 1.2; _ctx.strokeStyle = 'rgba(0,0,0,0.7)'; _ctx.stroke();
    }
    if (title && String(title).trim()) {                       // 제목 라벨(핀 아래)
      _ctx.font = '700 11px Eczar, serif';
      var tw = _ctx.measureText(title).width, ty = sy + R + 3;
      _ctx.fillStyle = 'rgba(0,0,0,0.72)';
      _ctx.fillRect(sx - tw / 2 - 4, ty, tw + 8, 15);
      _ctx.fillStyle = def.color; _ctx.textBaseline = 'top';
      _ctx.fillText(title, sx, ty + 2);
    }
    _ctx.restore();
  }

  // ── 핀 편집기 (열기 / 종류변경 / 저장 / 삭제 / 닫기) ──
  function openPinEditor(id, _tries) {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    var box = document.getElementById('pin-editor');
    if (!box) return;
    var p = MapSync.getPin(id);
    if (!p) { if ((_tries || 0) < 5) setTimeout(function() { openPinEditor(id, (_tries || 0) + 1); }, 120); return; }  // 생성 직후 스냅샷 도착 대기
    _pinEditId = id;
    _syncPinEditorType(p.type);
    var ti = document.getElementById('pin-ed-title'); if (ti) ti.value = p.title || '';
    var no = document.getElementById('pin-ed-notes'); if (no) no.value = p.notes || '';
    box.style.display = 'flex';
    if (ti) setTimeout(function() { try { ti.focus(); } catch (e) {} }, 30);
  }
  function _syncPinEditorType(type) {
    var def = PIN_TYPES[type] || PIN_TYPES.npc;
    var hd = document.getElementById('pin-ed-head');
    if (hd) hd.textContent = def.emoji + ' ' + def.label;
    var row = document.getElementById('pin-ed-types');
    if (row) { var bs = row.querySelectorAll('[data-pt]'); for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('on', bs[i].getAttribute('data-pt') === type); }
  }
  function pinEditSetType(type) {
    if (!_pinEditId || !PIN_TYPES[type]) return;
    _syncPinEditorType(type);
    MapSync.updatePin(_pinEditId, { type: type }).catch(function(e) { console.warn('[updatePin type]', e); });
  }
  function pinEditSave() {
    if (!_pinEditId) return Promise.resolve();
    var ti = document.getElementById('pin-ed-title'), no = document.getElementById('pin-ed-notes');
    return MapSync.updatePin(_pinEditId, { title: ti ? ti.value : '', notes: no ? no.value : '' })
      .catch(function(e) { console.warn('[updatePin]', e); });
  }
  function pinEditClose() {
    pinEditSave();
    var box = document.getElementById('pin-editor'); if (box) box.style.display = 'none';
    _pinEditId = null;
  }
  function pinEditDelete() {
    if (!_pinEditId) return;
    if (!confirm('이 핀을 삭제할까요?')) return;
    MapSync.removePin(_pinEditId).catch(function(e) { console.warn('[removePin]', e); });
    var box = document.getElementById('pin-editor'); if (box) box.style.display = 'none';
    _pinEditId = null;
  }
  // 드로어 토큰 목록에서 선택한 토큰을 지도에서 펄스 링으로 강조
  function _drawHighlightRing() {
    if (!_highlightId || typeof MapSync === 'undefined') return;
    var t = MapSync.getToken(_highlightId);
    if (!t) { _highlightId = null; return; }
    var pos = _displayPos(t);
    var sx = pos.x * _view.scale + _view.offX, sy = pos.y * _view.scale + _view.offY;
    var r = _tokenRadiusWorld(t) * _view.scale; if (r < 9) r = 9;
    var ph = (_now() - _highlightT0) % 1200 / 1200;            // 0..1 위상
    var pr = r + 7 + Math.sin(ph * Math.PI * 2) * 4;
    _ctx.save();
    _ctx.lineWidth = 3;
    _ctx.strokeStyle = 'rgba(245,197,24,' + (0.55 + 0.45 * Math.abs(Math.sin(ph * Math.PI))) + ')';
    _ctx.beginPath(); _ctx.arc(sx, sy, pr, 0, Math.PI * 2); _ctx.stroke();
    _ctx.restore();
  }
  // 안개 공개/제거 툴바 (세로 메인 버튼 + 확장 메뉴: 자유/원/사각/전체)
  let _fogMenu = null;              // 열린 메뉴: 'reveal' | 'recover' | null
  function _refreshFogToolbar() {
    const gm = _effGM();
    const sel = document.getElementById('fog-btn-select');
    const rv = document.getElementById('fog-btn-reveal');
    const rc = document.getElementById('fog-btn-recover');
    if (sel) { sel.style.display = gm ? '' : 'none'; sel.classList.toggle('on', !_brush.paint); }
    if (rv) { rv.style.display = gm ? '' : 'none'; rv.classList.toggle('on', _fogMenu === 'reveal'); }
    if (rc) { rc.style.display = gm ? '' : 'none'; rc.classList.toggle('on', _fogMenu === 'recover'); }
    const mr = document.getElementById('fog-menu-reveal');
    const mc = document.getElementById('fog-menu-recover');
    if (mr) mr.style.display = (gm && _fogMenu === 'reveal') ? 'flex' : 'none';
    if (mc) mc.style.display = (gm && _fogMenu === 'recover') ? 'flex' : 'none';
    const active = _brush.paint ? (_brush.mode + ':' + _brush.shape) : '';
    const btns = document.querySelectorAll('#fog-menu-reveal [data-fs],#fog-menu-recover [data-fs]');
    for (let i = 0; i < btns.length; i++) btns[i].classList.toggle('on', btns[i].getAttribute('data-fs') === active);
  }
  function toggleFogMenu(mode) {
    if (!_effGM()) return;
    _fogMenu = (_fogMenu === mode) ? null : (mode === 'recover' ? 'recover' : 'reveal');
    if (_fogMenu) { _areaMenu = false; _camMenu = false; _pinMenu = false; _pinTool = null; }   // 다른 플라이아웃 닫기
    _refreshFogToolbar(); _refreshAreaToolbar(); _refreshCamToolbar(); _refreshPinToolbar();
  }
  function _enableFog() {
    if (_fogEnabled || !_bg.loaded || typeof MapSync === 'undefined') return;
    _ensureMaskFromBg();
    if (_maskCtx) {                              // 처음 켤 땐 전체 공개(보임) — 이후 '제거'로 가림
      _maskCtx.globalCompositeOperation = 'source-over';
      _maskCtx.fillStyle = '#fff';
      _maskCtx.fillRect(0, 0, _maskW, _maskH);
    }
    _fogEnabled = true;
    const url = _maskCv ? _maskCv.toDataURL('image/png') : null;
    _maskUrl = url;
    MapSync.setFogMask(url, _maskW, _maskH, true).catch(function(e) { console.warn('[enableFog]', e); });
  }
  // 안개 도구 선택: mode(reveal=공개 / recover=제거) + shape(free/rect/circle). 선택 시 안개 자동 활성+그리기 on
  function setFogTool(mode, shape) {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    if (!_bg.loaded) { alert('먼저 드로어 ✎ 지도 편집에서 배경 이미지를 넣어주세요.'); return; }
    _enableFog();
    _brush.mode = (mode === 'recover') ? 'recover' : 'reveal';
    _brush.shape = (shape === 'rect' || shape === 'circle') ? shape : 'free';
    _brush.paint = true;
    _refreshFogToolbar();
    _markDirty();
  }
  // 일반 선택기: 안개 브러시 off → 팬/토큰 이동 등 기본 포인터로 복귀
  function setSelectTool() {
    if (!_effGM()) return;
    _brush.paint = false;
    _fogMenu = null;
    _areaTool = null; _areaMenu = false; _camMenu = false;
    _pinTool = null; _pinMenu = false;
    _refreshFogToolbar(); _refreshAreaToolbar(); _refreshCamToolbar(); _refreshPinToolbar();
    _markDirty();
  }

  // ───────────────────────────────────────────
  //  토큰 — 기하/가시성/히트테스트/이미지 캐시
  // ───────────────────────────────────────────
  function _cell() { return _gridPx || 50; }   // 셀 크기(px) — 격자/스냅/토큰크기 단일 출처
  // 토큰 점유 칸수 — size(칸) 우선, 없으면 sizeCat(소형/중형=1·대형=2·거대=3·초대형=4)에서 파생
  function _tokenCells(t) {
    if (t && t.size) return t.size;
    if (t && t.sizeCat && typeof _cellsForCat === 'function') return _cellsForCat(t.sizeCat);
    return 1;
  }
  function _tokenRadiusWorld(t) { return (_tokenCells(t) * _cell()) / 2; }
  function _myUid() { return (typeof currentUser !== 'undefined' && currentUser) ? currentUser.uid : null; }

  function _visibleTokens() {
    if (typeof MapSync === 'undefined') return [];
    const gm = _effGM();
    return MapSync.getTokens().filter(function(t) { return gm || !t.hidden; });  // 플레이어/플레이뷰는 hidden 토큰 안 보임
  }
  function _tokenWorld(t) {
    if (_tokenDrag && _tokenDrag.id === t.id) return { x: _tokenDrag.x, y: _tokenDrag.y };  // 끌기 중 로컬 위치
    return { x: t.x, y: t.y };
  }
  function _hitToken(wx, wy) {
    const ts = _visibleTokens();
    for (let i = ts.length - 1; i >= 0; i--) {           // 위에 그려진 토큰 우선
      const t = ts[i];
      if (!MapSync.canControl(t)) continue;              // 제어 가능한 것만 잡음
      const r = _tokenRadiusWorld(t);
      const dx = wx - t.x, dy = wy - t.y;
      if (dx * dx + dy * dy <= r * r) return t;
    }
    return null;
  }
  function _getTokenImg(url) {
    if (!url) return null;
    let e = _tokenImgs.get(url);
    if (!e) {
      e = { img: new Image(), loaded: false };
      e.img.onload  = function() { e.loaded = true; _markDirty(); };
      e.img.onerror = function() { e.loaded = false; };
      e.img.src = url;
      _tokenImgs.set(url, e);
    }
    return e.loaded ? e.img : null;
  }

  // 상태이상 아이콘 로더 (icon_map 상대경로 → data/icons/ 기준 URL)
  function _getCondImg(rel) {
    if (!rel) return null;
    var url = /^(data:|https?:|\/|data\/icons\/)/.test(rel) ? rel : ('data/icons/' + rel);
    var e = _condImgs.get(url);
    if (!e) {
      e = { img: new Image(), loaded: false };
      e.img.onload  = function() { e.loaded = true; _markDirty(); };
      e.img.onerror = function() { e.loaded = false; };
      e.img.src = url;
      _condImgs.set(url, e);
    }
    return e.loaded ? e.img : null;
  }

  // 토큰 둘레에 상태이상 아이콘 원형 배치 (FVTT 토큰 효과 스타일 — 골드 링 배지)
  function _drawTokenConditions(t, sx, sy, r) {
    var conds = t.conditions;
    if (!conds || !conds.length) return;
    var n = Math.min(conds.length, 8);                       // 최대 8개 표시
    var ri = Math.max(6, r * 0.34);                          // 배지 반지름
    var a0 = Math.PI * 0.70, a1 = Math.PI * 1.30;            // 왼쪽 호(위→아래)
    for (var i = 0; i < n; i++) {
      var c = conds[i] || {};
      var ang = (n === 1) ? Math.PI : a0 + (a1 - a0) * (i / (n - 1));
      var cx = sx + Math.cos(ang) * (r + ri * 0.10);
      var cy = sy + Math.sin(ang) * (r + ri * 0.10);
      _ctx.save();
      _ctx.beginPath(); _ctx.arc(cx, cy, ri, 0, Math.PI * 2);
      _ctx.fillStyle = '#ece4d2'; _ctx.fill();               // 밝은 중심
      var img = _getCondImg(c.img);
      if (img) {
        _ctx.save(); _ctx.beginPath(); _ctx.arc(cx, cy, ri - 1, 0, Math.PI * 2); _ctx.clip();
        _ctx.drawImage(img, cx - ri, cy - ri, ri * 2, ri * 2); _ctx.restore();
      }
      _ctx.lineWidth = Math.max(1.5, ri * 0.18); _ctx.strokeStyle = '#c9a44a';  // 골드 링
      _ctx.beginPath(); _ctx.arc(cx, cy, ri, 0, Math.PI * 2); _ctx.stroke();
      var v = parseInt(c.val || 0);
      if (v > 0) {                                           // 수치 배지(우하단)
        var bx = cx + ri * 0.72, by = cy + ri * 0.72, br = ri * 0.58;
        _ctx.fillStyle = 'rgba(110,20,20,0.95)';
        _ctx.beginPath(); _ctx.arc(bx, by, br, 0, Math.PI * 2); _ctx.fill();
        _ctx.fillStyle = '#fff'; _ctx.font = 'bold ' + Math.round(br * 1.3) + 'px sans-serif';
        _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
        _ctx.fillText(String(v), bx, by);
      }
      _ctx.restore();
    }
  }

  // 색/스폰 위치 — uid 해시로 결정 (플레이어별 분산)
  function _hashStr(s) { let h = 0; s = s || ''; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }
  function _colorForUid(uid) { const hue = ((_hashStr(uid) % 360) + 360) % 360; return 'hsl(' + hue + ',55%,55%)'; }
  function _defaultSpawn() {
    const h = _hashStr(_myUid());
    const jx = ((h % 5) - 2) * _cell();                  // -2..+2 셀 분산
    const jy = ((((h >> 3) % 5) + 5) % 5 - 2) * _cell();
    if (_bg.loaded) return { x: _bg.w / 2 + jx, y: _bg.h / 2 + jy };
    return { x: 300 + jx, y: 300 + jy };
  }

  // ── 플레이어 자동 토큰 보장 (입장 시 1회, GM 제외) ──
  // 시트 플레이 뷰에선 자동 생성 안 함 — '내 토큰 놓기' 버튼으로 수동 배치(placeMyToken).
  function _maybeProvision() {
    if (_playMode) return;
    if (typeof window !== 'undefined' && window._mapNoProvision) return;  // 독립 지도(GM/미리보기 뷰)는 토큰 생성 안 함
    if (typeof MapSync === 'undefined' || !MapSync.isActive() || MapSync.isGM()) return;
    const portrait = (typeof state !== 'undefined' && state.portrait) ? state.portrait : null;
    const mine = MapSync.myToken();
    if (mine) {
      // 토큰 생성 후 초상이 늦게 로드된 경우 보강
      if (portrait && !mine.img) MapSync.upsertToken(mine.id, { img: portrait }).catch(function(){});
      return;
    }
    const nameEl = document.getElementById('f-name');
    const name = (nameEl && nameEl.value.trim()) || '플레이어';
    const sp = _defaultSpawn();
    MapSync.ensureMyToken({ name: name, img: portrait, x: Math.round(sp.x), y: Math.round(sp.y), color: _colorForUid(_myUid()) })
      .catch(function(err) { console.warn('[MapView provision]', err); });
  }

  // ── 토큰 끌기 (소유권 확인 후 분기) ──
  function _tryStartTokenDrag(p) {
    if (typeof MapSync === 'undefined') return false;
    const w = _screenToWorld(p.x, p.y);
    const t = _hitToken(w.x, w.y);
    if (!t) return false;
    _tokenDrag = { id: t.id, x: t.x, y: t.y, grabX: t.x - w.x, grabY: t.y - w.y, startScreen: { x: p.x, y: p.y }, moved: 0 };
    _markDirty();
    return true;
  }
  function _dragTokenTo(p) {
    const w = _screenToWorld(p.x, p.y);
    _tokenDrag.x = w.x + _tokenDrag.grabX;
    _tokenDrag.y = w.y + _tokenDrag.grabY;
    const dx = p.x - _tokenDrag.startScreen.x, dy = p.y - _tokenDrag.startScreen.y;
    _tokenDrag.moved = Math.max(_tokenDrag.moved, Math.hypot(dx, dy));
    _markDirty();
  }
  // 격자 스냅 — 점유 칸수(size)에 맞춰: 홀수칸=셀 중심, 짝수칸=격자 교차점
  function _snapWorld(x, y, size) {
    const c = _cell();
    const ox = _gridOffX || 0, oy = _gridOffY || 0;     // 격자 오프셋 기준으로 스냅
    const n = Math.max(1, Math.round(size || 1));       // 점유 칸수(작음 0.5→1)
    if (n % 2 === 1) return { x: (Math.floor((x - ox) / c) + 0.5) * c + ox, y: (Math.floor((y - oy) / c) + 0.5) * c + oy };
    return { x: Math.round((x - ox) / c) * c + ox, y: Math.round((y - oy) / c) * c + oy };
  }
  // 격자 교차점(코너)에 스냅 — AoE 영역 원점용
  function _snapCorner(x, y) {
    const c = _cell(), ox = _gridOffX || 0, oy = _gridOffY || 0;
    return { x: Math.round((x - ox) / c) * c + ox, y: Math.round((y - oy) / c) * c + oy };
  }
  function _endTokenDrag() {
    if (!_tokenDrag) return;
    const d = _tokenDrag; _tokenDrag = null;
    if (typeof MapSync === 'undefined') { _markDirty(); return; }
    if (d.moved < 5) {                                  // 거의 안 움직임 = 탭
      if (_effGM() && MapSync.getToken(d.id)) {         // GM(Map.html): 탭 → 숨기기/제거 버튼(편집 X)
        _showTokenActions(d.id);
      }
      _markDirty(); return;
    }
    var tx = d.x, ty = d.y;
    if (_gridEnabled) {                                 // 격자 켜짐 → 점유 칸수에 맞춰 스냅
      var tk = MapSync.getToken(d.id);
      var s = _snapWorld(d.x, d.y, _tokenCells(tk));
      tx = s.x; ty = s.y;
    }
    MapSync.moveToken(d.id, Math.round(tx), Math.round(ty))
      .catch(function(err) { console.warn('[MapView moveToken]', err); _markDirty(); });
    _markDirty();
  }

  // ── 맵을 화면에 맞춤 (중앙 정렬). cover=true면 창을 꽉 채움(여백 없음, 넘침은 잘림) ──
  function fit(cover) {
    if (!_bg.loaded || !_cssW || !_cssH) return;
    const s = cover ? Math.max(_cssW / _bg.w, _cssH / _bg.h) : Math.min(_cssW / _bg.w, _cssH / _bg.h);
    _view.scale = _clamp(s, MIN_SCALE, MAX_SCALE);
    _view.offX = (_cssW - _bg.w * _view.scale) / 2;
    _view.offY = (_cssH - _bg.h * _view.scale) / 2;
    _markDirty();
  }

  // ── 줌 (중심점 유지) ──
  function _zoomAt(sx, sy, factor) {
    const ns = _clamp(_view.scale * factor, MIN_SCALE, MAX_SCALE);
    if (ns === _view.scale) return;
    _userMoved = true;                    // 사용자 줌 → 자동 맞춤 중단
    const w = _screenToWorld(sx, sy);
    _view.scale = ns;
    _view.offX = sx - w.x * ns;
    _view.offY = sy - w.y * ns;
    _markDirty();
  }
  function zoomIn()  { _zoomAt(_cssW / 2, _cssH / 2, 1.25); }
  function zoomOut() { _zoomAt(_cssW / 2, _cssH / 2, 1 / 1.25); }

  // ── 카메라 공유 (듀얼모니터 동기화: 해상도 독립 — 월드 중심점 + 줌배율) ──
  function getCameraShare() {
    if (!_cssW || !_cssH || !_view.scale) return null;
    // 해상도 독립: 월드 중심 + 가시 월드영역(vw/vh) 전달 → 수신측이 자기 창 크기에 맞춰 스케일 계산
    return {
      cx: (_cssW / 2 - _view.offX) / _view.scale,
      cy: (_cssH / 2 - _view.offY) / _view.scale,
      vw: _cssW / _view.scale,
      vh: _cssH / _view.scale,
      scale: _view.scale,   // 구버전 폴백용
    };
  }
  function _applyCamNow(c) {
    if (!c || !_cssW || !_cssH) return false;
    // GM 가시영역(vw/vh)을 내 창에 contain(전부 보이게) → 큰 창이면 그만큼 확대돼 꽉 참
    let scale;
    // 플레이어 디스플레이=cover(창을 꽉 채움), 그 외(미리보기 등)=contain(GM 시야 전부 보임)
    if (c.vw && c.vh) scale = (_displayPlayer ? Math.max : Math.min)(_cssW / c.vw, _cssH / c.vh);
    else if (c.scale) scale = c.scale;   // 구버전 폴백
    else return false;
    scale = _clamp(scale, MIN_SCALE, MAX_SCALE);
    _view.scale = scale;
    _view.offX = _cssW / 2 - c.cx * scale;
    _view.offY = _cssH / 2 - c.cy * scale;
    _userMoved = true; _markDirty(); return true;     // userMoved=true → autoFit이 동기화 시점을 덮지 않음
  }
  function applyCameraShare(c) { _pendingCam = c || null; _applyCamNow(c); }

  // ── 마우스 ──
  function _onMouseDown(e) {
    if (_displayPlayer) return;                       // 플레이어 디스플레이=무조작(카메라는 동기화로만)
    const p = _localXY(e);
    _hideTokenActions();                              // 새 상호작용 → 토큰 액션 팝업 닫기
    if (_isPinPlacing()) { _placePin(p); return; }    // GM 핀 배치 모드 우선
    if (_isAreaPlacing()) { _startArea(p); return; }  // AoE 영역 배치 우선
    if (_isPainting()) { _startStroke(p); return; }   // 안개 브러시 우선
    if (_tryStartPinDrag(p)) return;                  // GM: 기존 핀 잡기(이동/탭-편집)
    if (!_tryStartTokenDrag(p)) _drag = p;            // 토큰 못 잡으면 팬
    _startPress(p);                                   // 롱프레스(1초) → 핑
  }
  function _onMouseMove(e) {
    if (!_active) return;
    const p = _localXY(e);
    _movePress(p);
    if (_pinDrag) { _dragPinTo(p); }
    else if (_areaDrag) { _moveArea(p); }
    else if (_stroke || _shapeDrag) { _paintMove(p); }
    else if (_tokenDrag) { _dragTokenTo(p); }
    else if (_drag) {
      _view.offX += p.x - _drag.x; _view.offY += p.y - _drag.y;
      _drag = p; _userMoved = true; _markDirty();
    }
  }
  function _onMouseUp() { _cancelPress(); _endPinDrag(); _endArea(); _endStroke(); _endTokenDrag(); _drag = null; }
  function _onWheel(e) {
    if (_displayPlayer) return;                       // 플레이어 디스플레이=무조작
    e.preventDefault();
    const p = _localXY(e);
    _zoomAt(p.x, p.y, e.deltaY < 0 ? 1.1 : 1 / 1.1);
  }

  // ── 터치 (1손가락=팬, 2손가락=핀치줌+팬) ──
  function _onTouchStart(e) {
    if (_displayPlayer) return;                       // 플레이어 디스플레이=무조작
    if (e.touches.length === 1) {
      _pinch = null;
      const p = _touchLocal(e.touches[0]);
      _hideTokenActions();                             // 새 상호작용 → 토큰 액션 팝업 닫기
      if (_isPinPlacing()) { _placePin(p); }            // GM 핀 배치 모드 우선
      else if (_isAreaPlacing()) { _startArea(p); }     // AoE 영역 배치 우선
      else if (_isPainting()) { _startStroke(p); }      // 안개 브러시 우선
      else if (_tryStartPinDrag(p)) { /* GM 핀 잡기(이동/탭-편집) */ }
      else if (!_tryStartTokenDrag(p)) _drag = p;       // 내 토큰 위면 끌기, 아니면 팬
      _startPress(p);                                   // 롱프레스(1초) → 핑
    } else if (e.touches.length >= 2) {
      _cancelPress();                                   // 두 손가락 → 핑 취소
      _cancelShape();                                   // 그리던 도형은 취소(미적용)
      if (_areaDrag) { _areaDrag = null; }              // 배치 중 도형 취소
      _pinDrag = null;                                  // 핀 이동 중이었으면 취소
      _endStroke();                                     // 자유곡선 그리는 중이었으면 마무리(커밋)
      _drag = null; _tokenDrag = null;                  // 두 손가락 → 핀치줌
      _startPinch(e.touches[0], e.touches[1]);
    }
    e.preventDefault();
  }
  function _onTouchMove(e) {
    if (e.touches.length >= 2 && _pinch) {
      const a = _touchLocal(e.touches[0]), b = _touchLocal(e.touches[1]);
      const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
      const ns = _clamp(_pinch.scale * (dist / _pinch.dist), MIN_SCALE, MAX_SCALE);
      _view.scale = ns;
      _view.offX = midX - _pinch.worldMid.x * ns;
      _view.offY = midY - _pinch.worldMid.y * ns;
      _userMoved = true; _markDirty();
    } else if (e.touches.length === 1) {
      const p = _touchLocal(e.touches[0]);
      _movePress(p);
      if (_pinDrag) { _dragPinTo(p); }
      else if (_areaDrag) { _moveArea(p); }
      else if (_stroke || _shapeDrag) { _paintMove(p); }
      else if (_tokenDrag) { _dragTokenTo(p); }
      else if (_drag) {
        _view.offX += p.x - _drag.x; _view.offY += p.y - _drag.y;
        _drag = p; _userMoved = true; _markDirty();
      }
    }
    e.preventDefault();
  }
  function _onTouchEnd(e) {
    if (e.touches.length === 0) { _cancelPress(); _endPinDrag(); _endArea(); _endStroke(); _endTokenDrag(); _drag = null; _pinch = null; }
    else if (e.touches.length === 1) { _pinch = null; if (!_areaDrag && !_stroke && !_shapeDrag && !_tokenDrag && !_pinDrag) _drag = _touchLocal(e.touches[0]); }
  }
  function _startPinch(t0, t1) {
    const a = _touchLocal(t0), b = _touchLocal(t1);
    const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    const midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
    _pinch = { dist: dist, scale: _view.scale, worldMid: _screenToWorld(midX, midY) };
  }

  // ── GM 배경 선택 → 리사이즈 → 동기화 ──
  function pickBg() { if (_fileInput) _fileInput.value = '', _fileInput.click(); }
  function _onPickBg(e) {
    const file = e.target.files && e.target.files[0];
    if (!file || typeof MapSync === 'undefined') return;
    if (_uploadBtn) { _uploadBtn.disabled = true; _uploadBtn.textContent = '업로드 중…'; }
    MapSync.resizeMapImage(file)
      .then(function(r) { return MapSync.setBackground(r.dataUrl, r.w, r.h); })
      .catch(function(err) { console.error('[MapView upload]', err); alert('배경 업로드 실패: ' + err); })
      .then(function() { if (_uploadBtn) { _uploadBtn.disabled = false; _uploadBtn.textContent = '🖼 이미지 선택'; } });
  }

  // ── 렌더 루프 (dirty-flag + 보간 중 연속 재draw) ──
  function _loop() {
    if (!_active) return;
    if (_dirty) { _dirty = false; _render(); if (_onRenderCb) { try { _onRenderCb(); } catch (e) {} } if (_animActive || _highlightId) _dirty = true; }  // 보간/강조 진행 중이면 다음 프레임 예약
    _raf = requestAnimationFrame(_loop);
  }

  function _render() {
    if (!_ctx) return;
    _ctx.setTransform(_dpr, 0, 0, _dpr, 0, 0);
    _ctx.clearRect(0, 0, _cssW, _cssH);
    // 배경
    if (_bg.loaded && _bg.img) {
      const w = _bg.w * _view.scale, h = _bg.h * _view.scale;
      _ctx.imageSmoothingEnabled = true;
      _ctx.drawImage(_bg.img, _view.offX, _view.offY, w, h);
      // 맵 경계
      _ctx.strokeStyle = 'rgba(192,160,98,0.55)';
      _ctx.lineWidth = 1;
      _ctx.strokeRect(_view.offX + 0.5, _view.offY + 0.5, w, h);
    }
    _drawGrid();            // 격자 (배경 유무와 무관 — 빈 지도에도 표시 + 스냅)
    _drawTokens();          // 토큰 레이어 (Phase C)
    _drawFog();             // 안개 오버레이 (Phase D)
    if (typeof window !== 'undefined' && window._mapTokensAboveFog) _drawAllTokensOnTop();  // GM 플레이어 미리보기: 모든 토큰 안개 위
    else _drawOwnTokenOnTop();   // 시트 플레이: 내 토큰만 안개 위
    _drawAreas();           // AoE 영역 (안개 위 — 전원 표시)
    _drawPins();            // GM 마스터링 핀 (GM 전용 — 플레이어엔 안 보임)
    _drawHighlightRing();   // 드로어에서 선택한 토큰 강조 링 (GM)
    _drawPings();           // 핑 (안개 위)
    _drawShapePreview();    // 안개 도형 러버밴드 미리보기
    _drawAreaPreview();     // AoE 배치 미리보기
    if (_paused && !_effGM()) _drawPausedCover();   // 준비중: 플레이어 화면 전체 가림 (GM 제외)
  }
  // 세션 준비중 — 플레이어 화면을 덮고 "준비중입니다" 중앙 표시
  function _drawPausedCover() {
    _ctx.save();
    _ctx.fillStyle = '#0b0906';
    _ctx.fillRect(0, 0, _cssW, _cssH);
    _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
    var cx = _cssW / 2, cy = _cssH / 2;
    var big = Math.max(26, Math.min(64, _cssW / 12));
    _ctx.fillStyle = '#e8d3b0';
    _ctx.font = '700 ' + big + 'px Eczar, serif';
    _ctx.fillText('준비 중입니다', cx, cy);
    _ctx.fillStyle = 'rgba(232,211,176,0.55)';
    _ctx.font = '400 ' + Math.round(big * 0.34) + 'px Gelasio, serif';
    _ctx.fillText('잠시만 기다려 주세요', cx, cy + big * 0.85);
    _ctx.restore();
  }

  // 화면 표시 위치 — 내가 끌면 즉시, 그 외(원격 이동)는 보간(exponential smoothing)
  function _displayPos(t) {
    const target = (_tokenDrag && _tokenDrag.id === t.id) ? { x: _tokenDrag.x, y: _tokenDrag.y } : { x: t.x, y: t.y };
    let d = _disp.get(t.id);
    if (!d) { d = { x: target.x, y: target.y }; _disp.set(t.id, d); return d; }
    if (_tokenDrag && _tokenDrag.id === t.id) { d.x = target.x; d.y = target.y; return d; }  // 내 드래그=즉시
    const k = 0.28;
    d.x += (target.x - d.x) * k; d.y += (target.y - d.y) * k;
    if (Math.abs(target.x - d.x) < 0.5 && Math.abs(target.y - d.y) < 0.5) { d.x = target.x; d.y = target.y; }
    else { _animActive = true; }                          // 아직 이동 중 → 다음 프레임 재draw
    return d;
  }

  // 토큰 1개 렌더 (원형 초상/색원 + 테두리 + 이름표)
  function _drawOneToken(t, myUid) {
    const pos = _displayPos(t);
    const sx = pos.x * _view.scale + _view.offX;
    const sy = pos.y * _view.scale + _view.offY;
    let r = _tokenRadiusWorld(t) * _view.scale;
    if (r < 9) r = 9;                                  // 최소 가시 크기
    if (sx + r < 0 || sx - r > _cssW || sy + r < 0 || sy - r > _cssH) return;  // 화면 밖 컬링
    _ctx.save();
    if (t.hidden) _ctx.globalAlpha = 0.55;             // GM 뷰에서 숨김 토큰 반투명
    const img = _getTokenImg(t.img);
    if (img) {
      _ctx.save();
      _ctx.beginPath(); _ctx.arc(sx, sy, r, 0, Math.PI * 2); _ctx.clip();
      _ctx.drawImage(img, sx - r, sy - r, r * 2, r * 2);
      _ctx.restore();
    } else {
      _ctx.beginPath(); _ctx.arc(sx, sy, r, 0, Math.PI * 2);
      _ctx.fillStyle = t.color || '#c0a062'; _ctx.fill();
      _ctx.fillStyle = '#1a1a1a';
      _ctx.font = 'bold ' + Math.round(r * 0.95) + 'px sans-serif';
      _ctx.textAlign = 'center'; _ctx.textBaseline = 'middle';
      _ctx.fillText(((t.name || '?').trim().charAt(0) || '?'), sx, sy);
    }
    // 테두리: 이미지 토큰은 아트 자체의 링이 프레임 → 테두리 없음(숨김 점선 힌트도 제거, 반투명만).
    //         글자/색원 토큰만 골드(내토큰)/흰색 실선 테두리.
    if (!img) {
      _ctx.lineWidth = 2;
      _ctx.strokeStyle = (myUid && t.ownerUid === myUid) ? '#f5c518' : 'rgba(255,255,255,0.85)';
      _ctx.beginPath(); _ctx.arc(sx, sy, r, 0, Math.PI * 2); _ctx.stroke();
    }
    _ctx.restore();
    // HP 바·이름표 제거(사용자 요청): 토큰 위 체력바/아래 이름 라벨 렌더 안 함.
    _drawTokenConditions(t, sx, sy, r);                 // 상태이상 아이콘 배지(토큰 둘레)
  }

  // ── 토큰 레이어 (안개 아래) ──
  function _drawTokens() {
    if (typeof MapSync === 'undefined') return;
    _animActive = false;
    const ts = _visibleTokens();
    if (!ts.length) return;
    const myUid = _myUid();
    for (const t of ts) _drawOneToken(t, myUid);
  }

  // ── 내 토큰은 안개 위에도 보이게 (안개 레이어 뒤에 한 번 더 그림) ──
  function _drawOwnTokenOnTop() {
    if (!_fogEnabled || typeof MapSync === 'undefined') return;
    const mine = MapSync.myToken();
    if (mine) _drawOneToken(mine, _myUid());
  }
  // ── 모든 토큰을 안개 위에 (GM '플레이어 모드로 보기' = 안개 무시하고 토큰 전부 보임) ──
  function _drawAllTokensOnTop() {
    if (!_fogEnabled || typeof MapSync === 'undefined') return;
    const myUid = _myUid();
    for (const t of _visibleTokens()) _drawOneToken(t, myUid);
  }

  // ── 핑 (확장하며 사라지는 링) ──
  function _drawPings() {
    if (!_pings.length) return;
    const now = _now();
    for (let i = _pings.length - 1; i >= 0; i--) {
      const p = _pings[i];
      const age = now - p.t0;
      if (age >= PING_MS) { _pings.splice(i, 1); continue; }
      _animActive = true;                                // 핑 진행 중 → 연속 재draw
      const f = age / PING_MS;                            // 0..1
      const sx = p.x * _view.scale + _view.offX;
      const sy = p.y * _view.scale + _view.offY;
      const baseR = 22 + 22 * f;                          // 확장
      _ctx.save();
      _ctx.globalAlpha = 1 - f;
      _ctx.strokeStyle = p.color || '#ffd24a';
      _ctx.lineWidth = 3;
      _ctx.beginPath(); _ctx.arc(sx, sy, baseR, 0, Math.PI * 2); _ctx.stroke();
      _ctx.beginPath(); _ctx.arc(sx, sy, baseR * 0.55, 0, Math.PI * 2); _ctx.stroke();
      _ctx.globalAlpha = (1 - f) * 0.9;                   // 중심 점
      _ctx.fillStyle = p.color || '#ffd24a';
      _ctx.beginPath(); _ctx.arc(sx, sy, 4, 0, Math.PI * 2); _ctx.fill();
      _ctx.restore();
    }
  }

  // ── 그리드 (격자 배치: gridEnabled일 때만, _gridPx px/셀) ──
  function _drawGrid() {
    if (!_gridEnabled) return;
    const gs = _gridPx || 0;
    if (!gs) return;
    const step = gs * _view.scale;
    if (step < GRID_MIN_PX) return;       // 너무 촘촘하면 생략
    // 격자 범위: 배경 있으면 배경 영역, 없으면 화면에 보이는 월드 전체(빈 지도)
    let wMinX, wMinY, wMaxX, wMaxY, cx0, cy0, cx1, cy1;
    if (_bg.loaded) {
      wMinX = 0; wMinY = 0; wMaxX = _bg.w; wMaxY = _bg.h;
      cx0 = _view.offX; cy0 = _view.offY;
      cx1 = _view.offX + _bg.w * _view.scale; cy1 = _view.offY + _bg.h * _view.scale;
    } else {
      const tl = _screenToWorld(0, 0), br = _screenToWorld(_cssW, _cssH);
      wMinX = Math.floor(tl.x / gs) * gs; wMinY = Math.floor(tl.y / gs) * gs;
      wMaxX = Math.ceil(br.x / gs) * gs;  wMaxY = Math.ceil(br.y / gs) * gs;
      cx0 = 0; cy0 = 0; cx1 = _cssW; cy1 = _cssH;
    }
    _ctx.save();
    _ctx.beginPath();
    _ctx.rect(Math.max(0, cx0), Math.max(0, cy0),
              Math.min(_cssW, cx1) - Math.max(0, cx0), Math.min(_cssH, cy1) - Math.max(0, cy0));
    _ctx.clip();
    _ctx.lineWidth = 1;
    // 밝은 맵·어두운 맵 모두에서 보이도록 어두운 선 + 밝은 선을 1px 어긋나게 겹침(엠보싱)
    // 오프셋 원점: 격자선은 (wx - _gridOffX)가 gs의 배수인 지점. 범위 내 첫 선부터 시작.
    const offX = ((_gridOffX % gs) + gs) % gs, offY = ((_gridOffY % gs) + gs) % gs;
    const firstX = wMinX + ((offX - (wMinX % gs)) % gs + gs) % gs;
    const firstY = wMinY + ((offY - (wMinY % gs)) % gs + gs) % gs;
    const _gridLines = function(off, color) {
      _ctx.strokeStyle = color;
      _ctx.beginPath();
      for (let wx = firstX; wx <= wMaxX + 0.5; wx += gs) {
        const sx = Math.round(_view.offX + wx * _view.scale) + off;
        _ctx.moveTo(sx, cy0); _ctx.lineTo(sx, cy1);
      }
      for (let wy = firstY; wy <= wMaxY + 0.5; wy += gs) {
        const sy = Math.round(_view.offY + wy * _view.scale) + off;
        _ctx.moveTo(cx0, sy); _ctx.lineTo(cx1, sy);
      }
      _ctx.stroke();
    };
    _gridLines(0.5, 'rgba(20,22,30,0.5)');     // 어두운 선 — 밝은 맵에서 보임
    _gridLines(1.5, 'rgba(255,255,255,0.4)');  // 밝은 선 — 어두운 맵에서 보임
    _ctx.restore();
  }

  // ───────────────────────────────────────────
  //  전장의 안개 (Phase D) — GM 수동 브러시, 저해상도 마스크
  // ───────────────────────────────────────────
  function _maskScale() {
    return (typeof MapSync !== 'undefined' && MapSync.consts && MapSync.consts.MASK_SCALE) || 8;
  }
  function _ensureMask(mw, mh) {
    mw = Math.max(1, mw | 0); mh = Math.max(1, mh | 0);
    if (!_maskCv) { _maskCv = document.createElement('canvas'); _maskCtx = _maskCv.getContext('2d'); }
    if (_maskCv.width !== mw || _maskCv.height !== mh) { _maskCv.width = mw; _maskCv.height = mh; }  // 리사이즈=비워짐(전체 가림)
    _maskW = mw; _maskH = mh;
  }
  function _ensureMaskFromBg() {
    if (!_bg.loaded) return;
    const sc = _maskScale();
    _ensureMask(Math.ceil(_bg.w / sc), Math.ceil(_bg.h / sc));
  }
  // map/state의 fogMask를 로컬 마스크 캔버스로 로드 (자기 echo/그리는 중엔 스킵)
  function _loadMaskFromState(state) {
    const url = (state && state.fogMask) ? state.fogMask : null;
    if (url) {
      if (url === _maskUrl || _stroke) return;          // 이미 보유 or 그리는 중
      const mw = (state.maskW | 0), mh = (state.maskH | 0);
      const tok = ++_maskLoadTok;
      const img = new Image();
      img.onload = function() {
        if (tok !== _maskLoadTok || _stroke) return;    // 더 최신 로드/그리는 중이면 폐기
        _ensureMask(mw || img.naturalWidth, mh || img.naturalHeight);
        _maskCtx.clearRect(0, 0, _maskW, _maskH);
        _maskCtx.drawImage(img, 0, 0, _maskW, _maskH);
        _maskUrl = url;
        _markDirty();
      };
      img.onerror = function() {};
      img.src = url;
    } else if (_fogEnabled) {
      _ensureMaskFromBg(); _maskUrl = null;             // 마스크 없음 + 안개 ON → 전체 가림
    }
  }

  // 안개 오버레이 렌더 (배경/그리드/토큰 위)
  function _drawFog() {
    if (!_fogEnabled || !_bg.loaded) return;
    const gm = _effGM();
    if (!_fogCanvas) { _fogCanvas = document.createElement('canvas'); _fogCtx = _fogCanvas.getContext('2d'); }
    if (_fogCanvas.width !== _cssW || _fogCanvas.height !== _cssH) { _fogCanvas.width = _cssW; _fogCanvas.height = _cssH; }
    const fx = _fogCtx;
    fx.setTransform(1, 0, 0, 1, 0, 0);
    fx.clearRect(0, 0, _cssW, _cssH);
    const x = _view.offX, y = _view.offY, w = _bg.w * _view.scale, h = _bg.h * _view.scale;
    fx.globalCompositeOperation = 'source-over';
    fx.fillStyle = gm ? 'rgba(10,12,20,0.5)' : 'rgba(4,5,9,1)';   // GM=투시 반투명 / 플레이어=불투명
    fx.fillRect(x, y, w, h);
    if (_maskCv) {                                                 // 공개부(마스크 불투명)만큼 구멍
      fx.globalCompositeOperation = 'destination-out';
      fx.imageSmoothingEnabled = true;
      fx.drawImage(_maskCv, x, y, w, h);
      fx.globalCompositeOperation = 'source-over';
    }
    _ctx.drawImage(_fogCanvas, 0, 0, _cssW, _cssH);
  }

  // ── 브러시 페인트 ──
  function _isPainting() {
    return _effGM() && _fogEnabled && _brush.paint;
  }
  function _paintDab(worldX, worldY) {
    if (!_maskCtx) return;
    const sc = _maskScale();
    const r = Math.max(0.5, (_brush.size / 2) / sc);
    _maskCtx.globalCompositeOperation = (_brush.mode === 'reveal') ? 'source-over' : 'destination-out';
    _maskCtx.fillStyle = '#fff';
    _maskCtx.beginPath(); _maskCtx.arc(worldX / sc, worldY / sc, r, 0, Math.PI * 2); _maskCtx.fill();
    _maskCtx.globalCompositeOperation = 'source-over';
  }
  function _paintLine(fromScreen, toScreen) {
    const a = _screenToWorld(fromScreen.x, fromScreen.y);
    const b = _screenToWorld(toScreen.x, toScreen.y);
    const stepWorld = Math.max(1, (_brush.size / 2) * 0.5);       // 겹치게 보간
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const n = Math.max(1, Math.ceil(dist / stepWorld));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      _paintDab(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    }
  }
  function _startStroke(p) {
    if (!_maskCv) _ensureMaskFromBg();
    if (!_maskCv) return false;
    if (_brush.shape === 'rect' || _brush.shape === 'circle') {   // 사각/원: 러버밴드 시작
      _shapeDrag = { start: p, cur: p };
      _markDirty();
      return true;
    }
    _stroke = { last: p };
    const w = _screenToWorld(p.x, p.y);
    _paintDab(w.x, w.y);
    _markDirty();
    return true;
  }
  function _paintMove(p) {                          // 자유=칠하기 / 사각·원=러버밴드 갱신
    if (_stroke) { _strokeMove(p); }
    else if (_shapeDrag) { _shapeDrag.cur = p; _markDirty(); }
  }
  function _strokeMove(p) {
    if (!_stroke) return;
    _paintLine(_stroke.last, p);
    _stroke.last = p;
    _markDirty();
  }
  function _cancelShape() { if (_shapeDrag) { _shapeDrag = null; _markDirty(); } }
  function _endStroke() {                            // 페인트 종료(자유/도형 공통 진입점)
    if (_shapeDrag) { _endShape(); return; }
    if (!_stroke) return;
    _stroke = null;
    _commitMask();
  }
  function _endShape() {
    const d = _shapeDrag; _shapeDrag = null;
    if (!d || !_maskCv) { _markDirty(); return; }
    if (Math.hypot(d.cur.x - d.start.x, d.cur.y - d.start.y) < 3) { _markDirty(); return; }  // 거의 안 끌었으면 무시
    _applyShapeToMask(d.start, d.cur);
    _commitMask();
    _markDirty();
  }
  // 사각/원 영역을 마스크에 적용 (reveal=공개 흰칠 / recover=가림 지움)
  function _applyShapeToMask(aScreen, bScreen) {
    if (!_maskCtx) return;
    const sc = _maskScale();
    const a = _screenToWorld(aScreen.x, aScreen.y), b = _screenToWorld(bScreen.x, bScreen.y);
    const x0 = Math.min(a.x, b.x) / sc, y0 = Math.min(a.y, b.y) / sc;
    const x1 = Math.max(a.x, b.x) / sc, y1 = Math.max(a.y, b.y) / sc;
    _maskCtx.globalCompositeOperation = (_brush.mode === 'reveal') ? 'source-over' : 'destination-out';
    _maskCtx.fillStyle = '#fff';
    _maskCtx.beginPath();
    if (_brush.shape === 'circle') {
      _maskCtx.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.max(0.5, (x1 - x0) / 2), Math.max(0.5, (y1 - y0) / 2), 0, 0, Math.PI * 2);
    } else {
      _maskCtx.rect(x0, y0, Math.max(0.5, x1 - x0), Math.max(0.5, y1 - y0));
    }
    _maskCtx.fill();
    _maskCtx.globalCompositeOperation = 'source-over';
  }
  // 도형 러버밴드 미리보기 (메인 캔버스, 스크린 좌표)
  function _drawShapePreview() {
    if (!_shapeDrag) return;
    const a = _shapeDrag.start, b = _shapeDrag.cur;
    const x0 = Math.min(a.x, b.x), y0 = Math.min(a.y, b.y);
    const w = Math.abs(b.x - a.x), h = Math.abs(b.y - a.y);
    const reveal = (_brush.mode === 'reveal');
    _ctx.save();
    _ctx.lineWidth = 2; _ctx.setLineDash([6, 4]);
    _ctx.strokeStyle = reveal ? 'rgba(245,197,24,0.95)' : 'rgba(110,150,255,0.95)';
    _ctx.fillStyle   = reveal ? 'rgba(245,197,24,0.16)' : 'rgba(110,150,255,0.16)';
    _ctx.beginPath();
    if (_brush.shape === 'circle') _ctx.ellipse(x0 + w / 2, y0 + h / 2, Math.max(1, w / 2), Math.max(1, h / 2), 0, 0, Math.PI * 2);
    else _ctx.rect(x0, y0, w, h);
    _ctx.fill(); _ctx.stroke();
    _ctx.restore();
  }
  function _commitMask() {
    if (!_maskCv || typeof MapSync === 'undefined') return;
    const url = _maskCv.toDataURL('image/png');
    _maskUrl = url;                                  // 자기 echo 스킵
    MapSync.setFogMask(url, _maskW, _maskH, _fogEnabled).catch(function(err) { console.warn('[MapView fog]', err); });
  }

  // ── 공개 안개 컨트롤 (GM 툴바) ──
  // (안개 on/off·브러시·모드·크기·도형 토글은 v564 공개/제거 툴바로 대체 — setFogTool/toggleFogMenu 참조)
  function _fillMask(reveal) {
    if (typeof MapSync === 'undefined' || !MapSync.isGM() || !_bg.loaded) return;
    _ensureMaskFromBg();
    if (!_maskCv) return;
    if (reveal) { _maskCtx.globalCompositeOperation = 'source-over'; _maskCtx.fillStyle = '#fff'; _maskCtx.fillRect(0, 0, _maskW, _maskH); }
    else { _maskCtx.clearRect(0, 0, _maskW, _maskH); }
    if (!_fogEnabled) _fogEnabled = true;            // 전체공개/가림은 안개 활성 전제
    _commitMask();
    _refreshToolbar(); _markDirty();
  }
  function revealAll() { _fillMask(true); }
  function coverAll()  { _fillMask(false); }

  // ───────────────────────────────────────────
  //  시트 플레이 뷰 — 내 토큰 배치 + 핑(롱프레스)
  // ───────────────────────────────────────────
  // 지금 보고 있는 시트 캐릭터의 토큰을 화면 중앙에 배치(없으면 생성, 있으면 이동+정보 갱신)
  function placeMyToken() {
    if (typeof MapSync === 'undefined' || !MapSync.isActive()) return;
    const nameEl = document.getElementById('f-name');
    const name = (nameEl && nameEl.value.trim()) || '플레이어';
    const portrait = (typeof state !== 'undefined' && state.portrait) ? state.portrait : null;
    const c = _screenToWorld(_cssW / 2, _cssH / 2);
    let x = c.x, y = c.y;
    if (_bg.loaded) { x = _clamp(x, 0, _bg.w); y = _clamp(y, 0, _bg.h); }
    x = Math.round(x); y = Math.round(y);
    const mine = MapSync.myToken();
    if (mine) {
      MapSync.upsertToken(mine.id, { x: x, y: y, name: name, img: portrait }).catch(function(e) { console.warn('[placeMyToken]', e); });
    } else {
      MapSync.createToken({ ownerUid: _myUid(), name: name, img: portrait, x: x, y: y, color: _colorForUid(_myUid()) })
        .catch(function(e) { console.warn('[placeMyToken]', e); });
    }
    _markDirty();
  }

  // 핑 등록(원격/로컬) + 롱프레스 처리
  function _addPing(p) {
    if (!p || typeof p.x !== 'number') return;
    _pings.push({ x: p.x, y: p.y, color: p.color || '#ffd24a', t0: _now() });
    if (_pings.length > 30) _pings.shift();
    _markDirty();
  }
  function _dropPingAt(sx, sy) {
    const w = _screenToWorld(sx, sy);
    _addPing({ x: w.x, y: w.y, color: '#ffd24a' });            // 로컬 즉시 표시
    if (typeof MapSync !== 'undefined') MapSync.dropPing(Math.round(w.x), Math.round(w.y), '#ffd24a').catch(function() {});
  }
  function _startPress(p) {
    _cancelPress();
    _press = { x: p.x, y: p.y, fired: false, timer: setTimeout(function() {
      if (!_press) return;
      _press.fired = true;
      _drag = null; _tokenDrag = null;                         // 롱프레스 발동 → 팬/토큰끌기 취소
      _dropPingAt(_press.x, _press.y);
    }, LONGPRESS_MS) };
  }
  function _movePress(p) {
    if (!_press || _press.fired) return;
    if (Math.hypot(p.x - _press.x, p.y - _press.y) > PRESS_MOVE_TOL) _cancelPress();
  }
  function _cancelPress() { if (_press) { clearTimeout(_press.timer); _press = null; } }

  // ═══════════════════════════════════════════
  //  GM 멀티맵 드로어 + NPC 편집기 (Map.html GM 뷰 전용 — 마크업 없으면 모두 no-op)
  // ═══════════════════════════════════════════
  // PF2e 표준 크기 → 격자 점유(칸 지름). 작음=1칸 미만, 소형/중형=1칸, 대형=2, 거대=3, 초대형=4.
  const NPC_SIZES = [
    { cat: 'tiny',       ko: '작음 (Tiny)',         cells: 0.5 },
    { cat: 'small',      ko: '소형 (Small)',        cells: 1 },
    { cat: 'medium',     ko: '중형 (Medium)',       cells: 1 },
    { cat: 'large',      ko: '대형 (Large)',        cells: 2 },
    { cat: 'huge',       ko: '거대 (Huge)',         cells: 3 },
    { cat: 'gargantuan', ko: '초대형 (Gargantuan)', cells: 4 }
  ];
  function _cellsForCat(cat) {
    for (var i = 0; i < NPC_SIZES.length; i++) if (NPC_SIZES[i].cat === cat) return NPC_SIZES[i].cells;
    return 1;
  }

  // 활성 맵 전환 시: 자동맞춤 재개 + 보간 캐시 비움 + 편집기 닫기 + 드로어 강조 갱신
  function _onActiveMapChange() {
    _userMoved = false;
    _disp.clear();
    npcClose();
    _hideTokenActions();
    _fogMenu = null;
    if (_mapEditId && _mapEditId !== MapSync.getActiveMapId()) mapEditClose();
    _renderDrawer();
    _markDirty();
  }

  // ── 좌측 드로어: 지도/토큰/크리처/해저드 (GM) ──
  const DRAWER_TABS = ['maps', 'tokens', 'creatures', 'hazards'];
  let _drawerTab = 'maps';
  function toggleDrawer() {
    const d = document.getElementById('map-drawer'); if (!d) return;
    const open = !d.classList.contains('open');
    d.classList.toggle('open', open);
    const btn = document.getElementById('map-drawer-btn');
    if (btn) btn.classList.toggle('on', open);
    if (open) { _bindDrawerScroll(); _refreshDrawerTabs(); }
  }
  function setDrawerTab(tab) {
    _drawerTab = DRAWER_TABS.indexOf(tab) >= 0 ? tab : 'maps';
    _refreshDrawerTabs();
  }
  function _refreshDrawerTabs() {
    DRAWER_TABS.forEach(function (t) {
      const panel = document.getElementById('md-panel-' + t);
      if (panel) panel.style.display = (_drawerTab === t) ? '' : 'none';
      const btn = document.getElementById('md-tab-' + t);
      if (btn) btn.classList.toggle('on', _drawerTab === t);
    });
    if (_drawerTab === 'maps') _renderDrawer();
    else if (_drawerTab === 'tokens') _renderTokenList();
    else _renderDbList(_drawerTab, false);
  }

  // ── 크리처/해저드 DB 브라우저 (전체 목록 + 청크 무한스크롤 + 드래그 배치) ──
  const DB_CHUNK = 60;
  const _dbState = { creatures: { cursor: 0, q: '', filtered: null }, hazards: { cursor: 0, q: '', filtered: null } };
  const _dbKindType = { creatures: 'npc', hazards: 'hazard' };
  const SIZECAT = { tiny: 'tiny', sm: 'small', med: 'medium', lg: 'large', huge: 'huge', grg: 'gargantuan' };
  let _dbScrollBound = false;

  function _bindDrawerScroll() {
    if (_dbScrollBound) return;
    const sc = document.getElementById('md-scroll'); if (!sc) return;
    sc.addEventListener('scroll', function () {
      if (_drawerTab !== 'creatures' && _drawerTab !== 'hazards') return;
      if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 80) _renderDbList(_drawerTab, true);  // 바닥 근처 → 다음 청크
    });
    _dbScrollBound = true;
  }
  function dbSearch(kind, q) {
    const st = _dbState[kind]; if (!st) return;
    st.q = (q || '').trim().toLowerCase(); st.filtered = null;
    _renderDbList(kind, false);
  }
  function _dbCompute(kind) {
    const st = _dbState[kind];
    const type = _dbKindType[kind];
    const MDB = window.MonsterDB;
    let arr = (MDB && MDB.all) ? MDB.all().filter(function (c) { return c.type === type; }) : [];
    if (st.q) arr = arr.filter(function (c) {
      const n = MDB.name(c);
      return (n.ko || '').toLowerCase().indexOf(st.q) >= 0 || (n.en || '').toLowerCase().indexOf(st.q) >= 0;
    });
    arr.sort(function (a, b) { return (MDB.level(a) - MDB.level(b)) || MDB.name(a).ko.localeCompare(MDB.name(b).ko, 'ko'); });
    st.filtered = arr;
  }
  function _renderDbList(kind, append) {
    const listEl = document.getElementById(kind === 'creatures' ? 'md-crit-list' : 'md-haz-list');
    const moreEl = document.getElementById(kind === 'creatures' ? 'md-crit-more' : 'md-haz-more');
    if (!listEl) return;
    const MDB = window.MonsterDB, MLK = window.MonsterLink;
    // 데이터 미로드 → 지연 로드 후 재렌더
    if (!MDB || !MDB.all || !MDB.all().length) {
      listEl.innerHTML = '<div class="tp-empty">크리처 데이터 불러오는 중…</div>';
      const ensure = MLK && MLK.ensure ? MLK.ensure() : (MDB && MDB.load ? MDB.load({ dir: 'data/creatures/' }) : Promise.reject(new Error('MonsterDB 없음')));
      ensure.then(function () { _dbState[kind].filtered = null; _renderDbList(kind, false); })
        .catch(function (e) { listEl.innerHTML = '<div class="tp-empty">로드 실패: ' + (e && e.message) + '</div>'; });
      return;
    }
    const st = _dbState[kind];
    if (!append) { st.cursor = 0; listEl.innerHTML = ''; st.filtered = null; }
    if (!st.filtered) _dbCompute(kind);
    const all = st.filtered;
    if (!all.length) { listEl.innerHTML = '<div class="tp-empty">결과 없음</div>'; if (moreEl) moreEl.textContent = ''; return; }
    const end = Math.min(st.cursor + DB_CHUNK, all.length);
    for (let i = st.cursor; i < end; i++) {
      const c = all[i]; const n = MDB.name(c); const lv = MDB.level(c); const tr = MDB.traits(c);
      const row = document.createElement('div');
      row.className = 'tp-row db-row'; row.title = '드래그=배치 · 클릭=정보';
      row.onpointerdown = function (ev) { _startCreatureDrag(c.id, ev); };
      const thumb = document.createElement('div');
      thumb.className = 'tp-thumb'; thumb.style.background = (kind === 'hazards' ? '#6a5320' : '#3a2a4a');
      const _ico = (kind !== 'hazards' && MDB.creatureIcon) ? MDB.creatureIcon(c) : '';
      if (_ico) {                                   // 트림된 토큰 아트: 어두운 중립 배경 위 cover
        thumb.style.backgroundColor = '#15110d';
        thumb.style.backgroundImage = 'url(' + _ico + ')';
        thumb.style.backgroundSize = 'cover'; thumb.style.backgroundPosition = 'center';
      } else { thumb.textContent = (n.ko || '?').trim().charAt(0) || '?'; }
      const nm = document.createElement('span'); nm.className = 'tp-name';
      nm.innerHTML = '<b>' + _esc(n.ko) + '</b> <span class="db-lv">Lv ' + lv + (tr && tr.size ? ' · ' + _sizeKo(SIZECAT[tr.size] || 'medium') : '') + '</span>';
      row.appendChild(thumb); row.appendChild(nm);
      listEl.appendChild(row);
    }
    st.cursor = end;
    if (moreEl) moreEl.textContent = end < all.length ? ('▾ ' + end + ' / ' + all.length + ' (스크롤하면 더 보기)') : (all.length + '종');
  }
  function _esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // 크리처 행 드래그: 이동=맵 배치, 비이동(클릭)=스탯 시트 표시
  function _startCreatureDrag(creatureId, ev) {
    if (!_effGM()) return;
    const MDB = window.MonsterDB; if (!MDB) return;
    const c = MDB.getCreature(creatureId); if (!c) return;
    if (ev && ev.preventDefault) ev.preventDefault();
    const nm = MDB.name(c);
    const ghost = document.createElement('div');
    ghost.className = 'tpl-ghost'; ghost.textContent = nm.ko || '토큰';
    document.body.appendChild(ghost);
    const place = function (x, y) { ghost.style.left = x + 'px'; ghost.style.top = y + 'px'; };
    place(ev.clientX, ev.clientY);
    let moved = false;
    const onMove = function (e) { if (Math.abs(e.clientX - ev.clientX) + Math.abs(e.clientY - ev.clientY) > 5) moved = true; place(e.clientX, e.clientY); };
    const onUp = function (e) {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
      if (moved) _placeCreatureAtClient(e.clientX, e.clientY, c);
      else if (window.MonsterLink && window.MonsterLink.showStat) window.MonsterLink.showStat(creatureId);  // 클릭=정보 시트
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }
  function _placeCreatureAtClient(clientX, clientY, c) {
    if (!_cv || typeof MapSync === 'undefined') return;
    const r = _cv.getBoundingClientRect();
    if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return;
    if (!MapSync.hasActiveMap()) { alert('먼저 지도를 선택하세요.'); return; }
    const MDB = window.MonsterDB; const n = MDB.name(c); const tr = MDB.traits(c);
    const cat = SIZECAT[tr && tr.size] || 'medium'; const cells = _cellsForCat(cat);
    const hpMax = (MDB.hp(c) || {}).max || 0;
    const w = _screenToWorld(clientX - r.left, clientY - r.top);
    let x = w.x, y = w.y;
    if (_bg.loaded) { x = _clamp(x, 0, _bg.w); y = _clamp(y, 0, _bg.h); }
    if (_gridEnabled) { const s = _snapWorld(x, y, cells); x = s.x; y = s.y; }
    const _ico = (MDB.creatureIcon && MDB.creatureIcon(c)) || null;
    MapSync.createNpc({ name: n.ko, size: cells, sizeCat: cat, x: Math.round(x), y: Math.round(y), monsterId: c.id, monsterName: n.ko, hpMax: hpMax, img: _ico })
      .catch(function (e) { console.warn('[placeCreature]', e); });
  }
  function _renderDrawer() {
    const list = document.getElementById('map-drawer-list');
    if (!list || typeof MapSync === 'undefined') return;
    const maps = MapSync.getMaps();
    const active = MapSync.getActiveMapId();
    list.innerHTML = '';
    maps.forEach(function(m) {
      const row = document.createElement('div');
      row.className = 'md-row' + (m.id === active ? ' active' : '');
      const nm = document.createElement('button');
      nm.className = 'md-name'; nm.textContent = m.name || '(이름 없음)';
      nm.onclick = function() { MapSync.setActiveMap(m.id).catch(function(e) { console.warn('[setActiveMap]', e); }); };
      const ren = document.createElement('button');
      ren.className = 'md-act'; ren.title = '편집(이름/배경/격자)'; ren.textContent = '✎';
      ren.onclick = function(ev) { ev.stopPropagation(); openMapEdit(m.id); };
      const del = document.createElement('button');
      del.className = 'md-act md-del'; del.title = '삭제'; del.textContent = '🗑';
      del.onclick = function(ev) {
        ev.stopPropagation();
        if (maps.length <= 1) { alert('마지막 지도는 삭제할 수 없습니다.'); return; }
        if (confirm('"' + (m.name || '') + '" 지도를 삭제할까요? (배치한 토큰도 함께 삭제됩니다)'))
          MapSync.deleteMap(m.id).catch(function(e) { alert('삭제 실패: ' + e); });
      };
      row.appendChild(nm); row.appendChild(ren); row.appendChild(del);
      list.appendChild(row);
    });
  }
  function addMap() {
    if (typeof MapSync === 'undefined') return;
    const nn = prompt('새 지도 이름', '지도 ' + (MapSync.getMaps().length + 1));
    if (nn == null) return;
    MapSync.createMap((nn.trim() || '새 지도')).then(function(id) { return MapSync.setActiveMap(id); })
      .catch(function(e) { alert('지도 생성 실패: ' + e); });
  }

  // ── NPC 편집기 (GM) — 이름/크기(PF2e)/초상/숨김 ──
  let _npcEditId = null;
  let _np = null;
  function _npcRefs() {
    if (_np) return _np;
    _np = {
      box:    document.getElementById('map-npc-editor'),
      title:  document.getElementById('np-title'),
      name:   document.getElementById('np-name'),
      size:   document.getElementById('np-size'),
      hp:     document.getElementById('np-hp'),
      hpmax:  document.getElementById('np-hpmax'),
      hidden: document.getElementById('np-hidden'),
      portraitInput: document.getElementById('np-portrait-input')
    };
    if (_np.size && !_np.size.options.length) {     // 크기 드롭다운 1회 채움
      NPC_SIZES.forEach(function(s) {
        const o = document.createElement('option'); o.value = s.cat; o.textContent = s.ko; _np.size.appendChild(o);
      });
    }
    if (_np.portraitInput) _np.portraitInput.addEventListener('change', _onNpcPortrait);
    return _np;
  }
  // 배치된 토큰 편집기 열기 (이름/크기/체력/숨김 + 연결 몬스터=능력) — FVTT식 토큰 시트
  function openNpcEdit(id) {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    const t = MapSync.getToken(id); if (!t) return;
    const e = _npcRefs(); if (!e.box) return;
    _npcEditId = id;
    if (e.title)  e.title.textContent = '토큰 시트';
    if (e.name)   e.name.value = t.name || '';
    if (e.size)   e.size.value = t.sizeCat || 'medium';
    if (e.hp)     e.hp.value = (t.hp != null ? t.hp : (t.hpMax || ''));
    if (e.hpmax)  e.hpmax.value = t.hpMax || '';
    if (e.hidden) e.hidden.checked = !!t.hidden;
    if (typeof window !== 'undefined' && window.MonsterLink) window.MonsterLink.onEditOpen(id, t);  // 연결 몬스터 라벨/검색 동기화(=능력)
    const sb = document.getElementById('np-statbtn');
    if (sb) sb.style.display = t.monsterId ? '' : 'none';   // 연결 몬스터 있으면 정보 버튼 노출
    e.box.style.display = 'block';
    _hideTokenActions();
  }
  // 편집기에서 연결 몬스터 스탯블록 보기 (=능력)
  function npcShowStat() {
    if (!_npcEditId || typeof MapSync === 'undefined') return;
    const t = MapSync.getToken(_npcEditId);
    const mid = t && t.monsterId; if (!mid) { alert('연결된 몬스터가 없습니다.'); return; }
    if (typeof window !== 'undefined' && window.MonsterLink) window.MonsterLink.showStat(mid, _npcEditId);  // 토큰 id 전달 → 초상화 교체
  }
  function npcApply() {
    if (!_npcEditId || !_effGM() || typeof MapSync === 'undefined') return;
    const e = _npcRefs();
    const cat = e.size ? e.size.value : 'medium';
    const fields = {
      name: e.name ? e.name.value : '',
      size: _cellsForCat(cat), sizeCat: cat,
      hidden: e.hidden ? !!e.hidden.checked : false
    };
    const hpMax = e.hpmax ? parseInt(e.hpmax.value, 10) : NaN;   // 직접 입력한 체력이 우선
    const hp    = e.hp    ? parseInt(e.hp.value, 10)    : NaN;
    if (!isNaN(hpMax)) fields.hpMax = Math.max(0, hpMax);
    if (!isNaN(hp))    fields.hp    = Math.max(0, hp);
    if (typeof window !== 'undefined' && window.MonsterLink && window.MonsterLink.getSelection) {
      const lk = window.MonsterLink.getSelection();      // 현재 편집 대상의 몬스터 연결(=능력 출처)
      if (lk) {
        fields.monsterId = lk.monsterId || null; fields.monsterName = lk.monsterName || null;
        if ((isNaN(hpMax) || hpMax === 0) && lk.hpMax) {  // 체력 미입력 시 몬스터 기본 체력 채움
          fields.hpMax = lk.hpMax;
          if (isNaN(hp)) fields.hp = lk.hpMax;
          if (e.hpmax) e.hpmax.value = lk.hpMax;
          if (e.hp && !e.hp.value) e.hp.value = lk.hpMax;
        }
        const sb = document.getElementById('np-statbtn'); if (sb) sb.style.display = lk.monsterId ? '' : 'none';
      }
    }
    MapSync.upsertToken(_npcEditId, fields).catch(function(err) { console.warn('[npcApply]', err); });
    _markDirty();
  }
  function npcDelete() {
    if (!_npcEditId || !_effGM() || typeof MapSync === 'undefined') return;
    if (!confirm('이 토큰을 삭제할까요?')) return;
    MapSync.removeToken(_npcEditId).catch(function(err) { console.warn('[npcDelete]', err); });
    _disp.delete(_npcEditId);
    npcClose();
  }
  function npcClose() {
    _npcEditId = null; _highlightId = null;               // 편집 닫으면 강조 해제
    const e = _npcRefs(); if (e.box) e.box.style.display = 'none';
    _renderTokenList(); _markDirty();
  }
  function npcPickPortrait() {
    const e = _npcRefs(); if (e.portraitInput) { e.portraitInput.value = ''; e.portraitInput.click(); }
  }
  function _onNpcPortrait(ev) {
    const file = ev.target.files && ev.target.files[0];
    if (!file || !_npcEditId || typeof MapSync === 'undefined') return;
    const id = _npcEditId;
    MapSync.resizeTokenImage(file)
      .then(function(r) { return MapSync.upsertToken(id, { img: r.dataUrl }); })
      .catch(function(err) { console.warn('[npc portrait]', err); });
  }

  // ── 배치된 토큰 탭 → 숨기기/제거 빠른 버튼 (편집은 드로어 팔레트에서) ──
  let _actionTokenId = null;
  function _showTokenActions(id) {
    const box = document.getElementById('map-token-actions');
    const t = (typeof MapSync !== 'undefined') ? MapSync.getToken(id) : null;
    if (!box || !t) return;
    _actionTokenId = id;
    const sx = t.x * _view.scale + _view.offX;
    let r = _tokenRadiusWorld(t) * _view.scale; if (r < 9) r = 9;
    const syC = t.y * _view.scale + _view.offY;
    box.style.left = Math.round(sx) + 'px';
    if (syC - r < 50) { box.style.top = Math.round(syC + r) + 'px'; box.style.transform = 'translate(-50%, 8px)'; }
    else { box.style.top = Math.round(syC - r) + 'px'; box.style.transform = 'translate(-50%, calc(-100% - 8px))'; }
    const hb = document.getElementById('mta-hide');
    if (hb) hb.textContent = t.hidden ? '👁 보이기' : '🙈 숨기기';
    const stb = document.getElementById('mta-stat');
    if (stb) stb.style.display = t.monsterId ? '' : 'none';   // 몬스터 연결된 토큰만 스탯 버튼
    const hasHp = t.hpMax > 0;                                // HP 추적 토큰만 피해/회복
    const hpEl = document.getElementById('mta-hp');
    if (hpEl) { hpEl.style.display = hasHp ? '' : 'none'; if (hasHp) hpEl.textContent = 'HP ' + (t.hp != null ? t.hp : t.hpMax) + '/' + t.hpMax; }
    ['mta-hp-amt', 'mta-dmg', 'mta-heal'].forEach(function (id) { const el = document.getElementById(id); if (el) el.style.display = hasHp ? '' : 'none'; });
    box.style.display = 'flex';
  }
  function _hideTokenActions() {
    _actionTokenId = null;
    const box = document.getElementById('map-token-actions');
    if (box) box.style.display = 'none';
  }
  function tokenActionHide() {
    if (!_actionTokenId || typeof MapSync === 'undefined') return;
    const t = MapSync.getToken(_actionTokenId); if (!t) { _hideTokenActions(); return; }
    MapSync.upsertToken(_actionTokenId, { hidden: !t.hidden }).catch(function(e) { console.warn('[tokenHide]', e); });
    const hb = document.getElementById('mta-hide');
    if (hb) hb.textContent = !t.hidden ? '👁 보이기' : '🙈 숨기기';
    _markDirty();
  }
  function tokenActionRemove() {
    if (!_actionTokenId || typeof MapSync === 'undefined') return;
    if (!confirm('이 토큰을 제거할까요?')) return;
    MapSync.removeToken(_actionTokenId).catch(function(e) { console.warn('[tokenRemove]', e); });
    _disp.delete(_actionTokenId);
    _hideTokenActions();
    _markDirty();
  }
  function tokenActionStat() {
    if (!_actionTokenId || typeof MapSync === 'undefined') return;
    const t = MapSync.getToken(_actionTokenId); if (!t) return;
    if (!t.monsterId) { alert('이 토큰에 연결된 몬스터가 없습니다.'); return; }
    if (typeof window !== 'undefined' && window.MonsterLink) window.MonsterLink.showStat(t.monsterId, _actionTokenId);  // 토큰 id 전달 → 초상화 교체
    else alert('몬스터 데이터 모듈이 로드되지 않았습니다.');
  }
  function _applyHp(sign) {                                   // 피해(-1)/회복(+1)
    if (!_actionTokenId || typeof MapSync === 'undefined') return;
    const t = MapSync.getToken(_actionTokenId); if (!t || !t.hpMax) return;
    const amtEl = document.getElementById('mta-hp-amt');
    const amt = Math.abs(parseInt(amtEl && amtEl.value, 10) || 0); if (!amt) return;
    const cur = (t.hp != null ? t.hp : t.hpMax);
    const next = Math.max(0, Math.min(t.hpMax, cur + sign * amt));
    MapSync.upsertToken(_actionTokenId, { hp: next }).catch(function (e) { console.warn('[hp]', e); });
    const hpEl = document.getElementById('mta-hp'); if (hpEl) hpEl.textContent = 'HP ' + next + '/' + t.hpMax;
    if (amtEl) amtEl.value = '';
    _markDirty();
  }
  function tokenActionEdit() {
    if (!_actionTokenId) return;
    openNpcEdit(_actionTokenId);
  }
  function tokenActionDamage() { _applyHp(-1); }
  function tokenActionHeal() { _applyHp(1); }

  // ── 배치 토큰 추적기(드로어 토큰 탭) — 현재 지도 토큰 목록 + 강조 + 편집 (GM) ──
  function _sizeKo(cat) { for (var i = 0; i < NPC_SIZES.length; i++) if (NPC_SIZES[i].cat === cat) return NPC_SIZES[i].ko.split(' ')[0]; return '중형'; }
  function _renderTokenList() {
    const list = document.getElementById('map-token-list');
    if (!list || typeof MapSync === 'undefined') return;
    const ts = MapSync.getTokens().slice().sort(function(a, b) {
      return String(a.name || '').localeCompare(String(b.name || '')) || String(a.id).localeCompare(String(b.id));
    });
    list.innerHTML = '';
    if (!ts.length) {
      const hint = document.createElement('div'); hint.className = 'tp-empty';
      hint.textContent = '이 지도에 배치된 토큰이 없습니다. 「크리처」 탭에서 끌어다 놓으세요.';
      list.appendChild(hint); return;
    }
    ts.forEach(function(t) {
      const row = document.createElement('div');
      row.className = 'tp-row tk-row' + (t.id === _highlightId ? ' on' : '');
      row.title = '클릭: 지도에서 위치 강조 + 편집';
      row.onclick = function() { focusToken(t.id); };
      const thumb = document.createElement('div'); thumb.className = 'tp-thumb';
      if (t.img) { thumb.style.backgroundColor = '#15110d'; thumb.style.backgroundImage = 'url(' + t.img + ')'; thumb.style.backgroundSize = 'cover'; thumb.style.backgroundPosition = 'center'; }
      else { thumb.style.background = t.color || '#3a2a4a'; thumb.textContent = ((t.name || '?').trim().charAt(0) || '?'); }
      const nm = document.createElement('span'); nm.className = 'tp-name';
      const hp = (t.hpMax > 0) ? ' · HP ' + (t.hp != null ? t.hp : t.hpMax) + '/' + t.hpMax : '';
      nm.innerHTML = '<b>' + _esc(t.name || '토큰') + '</b> <span class="db-lv">' + _sizeKo(t.sizeCat || 'medium') + hp + (t.hidden ? ' · 숨김' : '') + '</span>';
      row.appendChild(thumb); row.appendChild(nm);
      list.appendChild(row);
    });
  }
  function _maybeRefreshTokenList() {
    const d = document.getElementById('map-drawer');
    if (d && d.classList.contains('open') && _drawerTab === 'tokens') _renderTokenList();
  }
  // 토큰 목록 클릭 → 카메라를 그 토큰으로 이동 + 펄스 링 강조 + 편집기 열기
  function focusToken(id) {
    if (typeof MapSync === 'undefined') return;
    const t = MapSync.getToken(id); if (!t) return;
    if (_cssW && _cssH) { _view.offX = _cssW / 2 - t.x * _view.scale; _view.offY = _cssH / 2 - t.y * _view.scale; _userMoved = true; }
    _highlightId = id; _highlightT0 = _now();
    openNpcEdit(id);
    _renderTokenList();
    _markDirty();
  }

  // ── 격자 컨트롤 (GM) — 배치 on/off + 0~100% 비율 슬라이더 ──
  // 비율 ↔ 셀 px (반비례: 높은 %일수록 촘촘한 격자 = 작은 셀). 0%=가장 성김, 100%=가장 촘촘.
  function _pctToPx(pct) { return Math.round(GRID_UI_MAX - (GRID_UI_MAX - GRID_UI_MIN) * (_clamp(pct, 0, 100) / 100)); }
  function _pxToPct(px)  { return Math.round(_clamp((GRID_UI_MAX - px) / (GRID_UI_MAX - GRID_UI_MIN) * 100, 0, 100)); }
  function toggleGrid() {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    if (!MapSync.hasActiveMap()) { alert('먼저 좌측 목록에서 지도를 선택/생성하세요.'); return; }
    MapSync.setGrid(!_gridEnabled, _gridPx).catch(function(e) { console.warn('[toggleGrid]', e); });
  }
  function _refreshGridLabel() {
    const v = document.getElementById('map-grid-val');
    if (v) v.textContent = _pxToPct(_gridPx) + '%';
    const info = document.getElementById('map-grid-info');
    if (info) info.textContent = _bg.loaded
      ? ('≈ ' + Math.max(1, Math.round(_bg.w / _gridPx)) + '×' + Math.max(1, Math.round(_bg.h / _gridPx)) + '칸')
      : (_gridPx + 'px/칸');
  }
  function _refreshGridBar() {
    const range = document.getElementById('map-grid-range');
    if (range && !_gridDragging) range.value = _pxToPct(_gridPx);
    _refreshGridLabel();
  }
  function gridRangeInput(pct) {            // 슬라이딩 중 — 로컬 미리보기만(Firestore 쓰기 0)
    _gridDragging = true;
    _gridPx = _pctToPx(+pct);
    _refreshGridLabel();
    _markDirty();
  }
  function gridRangeChange(pct) {           // 놓을 때 — 1회 쓰기 (안개 stroke-end 철학과 동일)
    _gridDragging = false;
    _gridPx = _pctToPx(+pct);
    _refreshGridLabel();
    _markDirty();
    if (_effGM() && typeof MapSync !== 'undefined') MapSync.setGrid(true, _gridPx).catch(function(e) { console.warn('[gridRange]', e); });
  }
  // 격자 원점 상하좌우 이동(넛지) — 로컬 즉시 미리보기 + 디바운스 1회 쓰기. 셀 크기로 순환(mod).
  function gridNudge(dx, dy) {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    const c = _gridPx || 50, step = Math.max(1, Math.round(c / 25));   // 셀의 ~4% 씩
    _gridOffX = (((_gridOffX + dx * step) % c) + c) % c;
    _gridOffY = (((_gridOffY + dy * step) % c) + c) % c;
    _markDirty();
    if (_gridOffTimer) clearTimeout(_gridOffTimer);
    _gridOffTimer = setTimeout(function() {
      _gridOffTimer = 0;
      MapSync.setGridOffset(_gridOffX, _gridOffY).catch(function(e) { console.warn('[gridNudge]', e); });
    }, 350);
  }
  function gridNudgeReset() {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    _gridOffX = 0; _gridOffY = 0; _markDirty();
    if (_gridOffTimer) { clearTimeout(_gridOffTimer); _gridOffTimer = 0; }
    MapSync.setGridOffset(0, 0).catch(function(e) { console.warn('[gridNudgeReset]', e); });
  }

  // ── 드로어 지도 편집기 (이름/배경 이미지/격자) — 활성 맵 대상 ──
  let _mapEditId = null;
  function openMapEdit(id) {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    const m = MapSync.getMaps().find(function(x) { return x.id === id; });
    _mapEditId = id;
    if (MapSync.getActiveMapId() !== id) MapSync.setActiveMap(id).catch(function(e) { console.warn('[openMapEdit]', e); });
    const box = document.getElementById('map-map-editor'); if (!box) return;
    const nm = document.getElementById('mme-name'); if (nm) nm.value = m ? (m.name || '') : '';
    box.style.display = 'block';
    _refreshMapEditor();
  }
  function mapEditClose() {
    _mapEditId = null;
    const box = document.getElementById('map-map-editor'); if (box) box.style.display = 'none';
  }
  function mapRename() {
    if (!_mapEditId || typeof MapSync === 'undefined') return;
    const nm = document.getElementById('mme-name');
    MapSync.renameMap(_mapEditId, nm ? nm.value.trim() : '').catch(function(e) { console.warn('[mapRename]', e); });
  }
  function _refreshMapEditor() {
    const box = document.getElementById('map-map-editor');
    if (!box || box.style.display === 'none') return;
    const chk = document.getElementById('mme-grid-on');
    if (chk) chk.checked = _gridEnabled;
    _refreshGridBar();   // 슬라이더 + 라벨 (#map-grid-range / #map-grid-val / #map-grid-info)
    const st = (typeof MapSync !== 'undefined') ? MapSync.getMapState() : null;
    const urlIn = document.getElementById('mme-bg-url');
    if (urlIn && document.activeElement !== urlIn) urlIn.value = (st && st.bgUrl) || '';
    const bg = document.getElementById('mme-bg-status');
    if (bg) {
      if (st && st.bgUrl) bg.textContent = _bg.loaded ? ('✓ URL 배경 (' + _bg.w + '×' + _bg.h + ', 원본 해상도)') : 'URL 로딩 중…';
      else if (st && st.bgImage) bg.textContent = _bg.loaded ? ('✓ 업로드 배경 (' + _bg.w + '×' + _bg.h + ', 축소 저장)') : '업로드 로딩 중…';
      else bg.textContent = '없음';
    }
  }

  // ── 원본 업로드(리포 커밋) — 브라우저에서 GitHub Contents API로 dev/maps/에 커밋,
  //    raw.githubusercontent.com URL(커밋 즉시 사용 가능, ACAO:*)을 배경으로 자동 적용.
  //    토큰(PAT)은 이 브라우저 localStorage에만 저장(Firestore/서버 전송 없음), 401 시 재입력.
  const GH_REPO = 'sepi-toolbox/PF2e', GH_DIR = 'dev/maps', GH_TOKEN_KEY = 'pf2e_gh_pat';
  function _ghToken(forceAsk) {
    let t = null;
    try { t = localStorage.getItem(GH_TOKEN_KEY); } catch (e) {}
    if (!t || forceAsk) {
      t = prompt('GitHub 토큰(PAT)을 붙여넣으세요 — 원본 업로드는 리포(' + GH_REPO + ')에 커밋하는 방식입니다.\n\n발급: github.com → Settings → Developer settings → Fine-grained tokens\n  · Resource owner: sepi-toolbox / 대상 리포: PF2e만\n  · Repository permissions → Contents: Read and write\n\n이 브라우저에만 저장되며 외부로 전송되지 않습니다(GitHub API 제외).');
      if (t) { t = t.trim(); try { localStorage.setItem(GH_TOKEN_KEY, t); } catch (e) {} }
    }
    return t || null;
  }
  function uploadBgOriginal() {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = function() { const f = inp.files && inp.files[0]; if (f) _repoUpload(f); };
    inp.click();
  }
  function _repoUpload(file) {
    const stEl = document.getElementById('mme-bg-status');
    const say = function(t) { if (stEl) stEl.textContent = t; };
    if (file.size > 40 * 1024 * 1024) { say('✗ 40MB 초과 — 웹용은 5~20MB JPEG/WebP 권장'); return; }
    const tok = _ghToken(false);
    if (!tok) { say('✗ 토큰 없음 — 업로드 취소'); return; }
    say('리포 커밋 중… (' + (Math.round(file.size / 1024 / 102.4) / 10) + 'MB)');
    const rd = new FileReader();
    rd.onerror = function() { say('✗ 파일 읽기 실패'); };
    rd.onload = function() {
      const b64 = String(rd.result).split(',')[1] || '';
      const m = file.name.match(/^(.*?)(\.(png|jpe?g|webp|gif|avif))?$/i);
      const base = (m[1] || 'bg').replace(/[^a-zA-Z0-9_-]+/g, '').slice(0, 24) || 'bg';
      const ext = (m[3] || 'jpg').toLowerCase();
      const d = new Date(), p = function(n) { return (n < 10 ? '0' : '') + n; };
      const name = base + '_' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '_' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()) + '.' + ext;
      fetch('https://api.github.com/repos/' + GH_REPO + '/contents/' + GH_DIR + '/' + name, {
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + tok, 'Accept': 'application/vnd.github+json' },
        body: JSON.stringify({ message: '지도 배경 업로드: ' + name + ' (지도 편집기 원본 업로드)', content: b64 })
      }).then(function(res) {
        if (res.status === 401 || res.status === 403) {
          try { localStorage.removeItem(GH_TOKEN_KEY); } catch (e) {}
          say('✗ 토큰 인증 실패 — 버튼을 다시 누르면 토큰을 새로 물어봅니다');
          throw 'auth';
        }
        if (!res.ok) { say('✗ 커밋 실패 (HTTP ' + res.status + ')'); throw 'http-' + res.status; }
        return res.json();
      }).then(function() {
        // raw URL은 커밋 직후 수 초 내 서빙됨 — cb 프로브로 확인 후(404 CDN 캐시 오염 방지) 클린 URL 저장
        const url = 'https://raw.githubusercontent.com/' + GH_REPO + '/main/' + GH_DIR + '/' + name;
        let tries = 0;
        const probe = function() {
          say('반영 확인 중…' + (tries ? ' (' + tries + ')' : ''));
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function() {
            MapSync.setBackgroundUrl(url, img.naturalWidth, img.naturalHeight)
              .catch(function(e) { say('저장 실패: ' + e); });
          };
          img.onerror = function() {
            if (++tries < 10) setTimeout(probe, 3000);
            else say('✗ 반영 확인 실패 — 잠시 후 URL 칸에 직접 적용: ' + url);
          };
          img.src = url + '?cb=' + Date.now();
        };
        probe();
      }).catch(function(e) { if (e !== 'auth') console.warn('[MapView repoUpload]', e); });
    };
    rd.readAsDataURL(file);
  }

  // URL 배경 적용 — 먼저 클라에서 로드해 원본 치수 확보 후 Firestore엔 URL만 저장.
  // 빈 입력 + 적용 = URL 배경 해제. 상대경로(maps/x.jpg)는 페이지 기준 해석(데브/운영 각자 정합).
  function applyBgUrl() {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    const urlIn = document.getElementById('mme-bg-url');
    const stEl  = document.getElementById('mme-bg-status');
    const url = urlIn ? urlIn.value.trim() : '';
    if (!url) {
      MapSync.setBackgroundUrl(null, 0, 0).catch(function(e) { console.warn('[applyBgUrl]', e); });
      return;
    }
    if (stEl) stEl.textContent = '확인 중…';
    const probe = function(useCors) {
      const img = new Image();
      if (useCors) img.crossOrigin = 'anonymous';
      img.onload = function() {
        MapSync.setBackgroundUrl(url, img.naturalWidth, img.naturalHeight)
          .catch(function(e) { console.warn('[applyBgUrl]', e); if (stEl) stEl.textContent = '저장 실패: ' + e; });
      };
      img.onerror = function() {
        if (useCors) { probe(false); return; }   // 외부 호스트 무CORS 폴백(표시는 됨, CCTV 캡처만 불가)
        if (stEl) stEl.textContent = '✗ 이미지를 불러올 수 없습니다 (URL 확인)';
      };
      img.src = url;
    };
    probe(true);
  }

  return {
    init: init, show: show, hide: hide,
    toggleFullscreen: toggleFullscreen, openFullscreen: openFullscreen, closeFullscreen: closeFullscreen,
    fit: fit, zoomIn: zoomIn, zoomOut: zoomOut, pickBg: pickBg,
    getCameraShare: getCameraShare, applyCameraShare: applyCameraShare,   // 듀얼모니터 카메라 동기화
    onRender: function (cb) { _onRenderCb = cb; },                         // 화면 변화 시 콜백(CCTV 캡처용)
    // 안개 (GM): 공개/제거(숨기기) 도구 + 확장 메뉴
    toggleFogMenu: toggleFogMenu, setFogTool: setFogTool, setSelectTool: setSelectTool,
    revealAll: revealAll, coverAll: coverAll,
    // AoE 영역 (GM) + 세션 준비중 + 카메라 제어
    toggleAreaMenu: toggleAreaMenu, setAreaTool: setAreaTool, clearAreas: clearAreas, togglePause: togglePause,
    toggleCamMenu: toggleCamMenu,
    // GM 마스터링 핀 (GM 전용)
    togglePinMenu: togglePinMenu, setPinTool: setPinTool, openPinEditor: openPinEditor,
    pinEditSetType: pinEditSetType, pinEditSave: pinEditSave, pinEditClose: pinEditClose, pinEditDelete: pinEditDelete,
    // 격자 + 지도 편집기 (GM, 드로어 ✎)
    toggleGrid: toggleGrid, gridRangeInput: gridRangeInput, gridRangeChange: gridRangeChange,
    gridNudge: gridNudge, gridNudgeReset: gridNudgeReset,
    openMapEdit: openMapEdit, mapEditClose: mapEditClose, mapRename: mapRename,
    applyBgUrl: applyBgUrl, uploadBgOriginal: uploadBgOriginal,
    // GM 멀티맵 드로어 (Map.html)
    toggleDrawer: toggleDrawer, setDrawerTab: setDrawerTab, addMap: addMap, dbSearch: dbSearch,
    // 배치 토큰 추적기 (드로어 토큰 탭)
    focusToken: focusToken,
    // GM 토큰 편집기(드로어 템플릿) + 배치 토큰 빠른 액션
    npcApply: npcApply, npcDelete: npcDelete,
    npcClose: npcClose, npcPickPortrait: npcPickPortrait,
    tokenActionHide: tokenActionHide, tokenActionRemove: tokenActionRemove, tokenActionStat: tokenActionStat,
    tokenActionDamage: tokenActionDamage, tokenActionHeal: tokenActionHeal, tokenActionEdit: tokenActionEdit,
    npcShowStat: npcShowStat, openNpcEdit: openNpcEdit,
    // 시트 플레이 뷰
    placeMyToken: placeMyToken
  };
})();

// 자동 초기화 — 지도를 열기 전이라도 세션 입장 시 토큰 자동 생성/배경 동기화가 동작하도록
(function() {
  function _mvInit() { if (typeof MapView !== 'undefined') MapView.init(); }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _mvInit);
    else _mvInit();
  }
})();
