// ═══════════════════════════════════════════════
//  MAP / TOKEN SYSTEM — 세션 전술 맵 (FVTT 스타일)
//  Phase A: 데이터 모델 + Firestore 실시간 동기화 (렌더링은 Phase B~)
//  설계: memory/pf2e-charsheet/project_map_token_system.md
//
//  데이터 모델 (Firestore):
//    sessions/{id}/map/state          ← 맵 1개 doc: bgImage(base64), bgW/H, gridSize,
//                                        fogEnabled, fogMask(다운스케일 PNG), maskW/H
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
  let _sessionUnsub = null;           // session doc 감시 (activeMapId)
  let _mapsUnsub    = null;           // maps 컬렉션 감시 (GM 드로어)
  let _tplUnsub     = null;           // 토큰 템플릿 감시 (GM 팔레트)
  let _mapUnsub     = null;           // 활성 맵 doc 감시
  let _tokensUnsub  = null;           // 활성 맵 tokens 감시
  let _tokensReady  = false;          // 초기 스냅샷 구분
  let _pingsUnsub   = null;
  let _pingsReady   = false;
  let _changeCb     = null;           // 렌더러 구독 콜백
  let _ensuringDefault = false;       // GM 기본 맵 자동생성 중복 방지

  function _db()        { return (typeof db !== 'undefined') ? db : null; }
  function _ts()        { return firebase.firestore.FieldValue.serverTimestamp(); }
  function _sessDoc()   { return _db().collection('sessions').doc(_sessionId); }
  function _mapsCol()   { return _sessDoc().collection('maps'); }
  function _tplCol()    { return _sessDoc().collection('tokenTemplates'); }  // 토큰 템플릿(세션 레벨)
  function _mapDoc()    { return _mapsCol().doc(_activeMapId); }     // 활성 맵 doc (배경/안개/그리드)
  function _tokensCol() { return _mapDoc().collection('tokens'); }  // 활성 맵 토큰
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
    _tokensReady = false;
    if (!_db() || !_sessionId) { console.warn('[MapSync] db/sessionId 없음 — 시작 취소'); return; }

    // 세션 doc 감시 → activeMapId 변경 시 활성 맵 재바인딩 (전원: 플레이어는 이걸로만 추종)
    _sessionUnsub = _sessDoc().onSnapshot(function(doc) {
      var aid = doc.exists ? (doc.data().activeMapId || null) : null;
      if (aid !== _activeMapId) _bindMap(aid);
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

      // 토큰 템플릿(팔레트) 감시 — 세션 레벨, 맵 전환과 무관
      _tplUnsub = _tplCol().onSnapshot(function(snap) {
        _templates.clear();
        snap.forEach(function(d) { _templates.set(d.id, Object.assign({ id: d.id }, d.data())); });
        _emit('templates', getTemplates());
      }, function(err) { console.error('[MapSync templates listener]', err); });
    }

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
    _activeMapId = mapId || null;
    _mapState = null;
    _tokens.clear();
    _tokensReady = false;
    _emit('active', _activeMapId);            // 뷰 리셋(자동맞춤 재개/편집기 닫기)
    if (!_activeMapId) { _emit('map', null); _emit('tokens-init', []); return; }

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
  }

  function _stopListeners() {
    if (_sessionUnsub) { _sessionUnsub(); _sessionUnsub = null; }
    if (_mapsUnsub)    { _mapsUnsub();    _mapsUnsub = null; }
    if (_tplUnsub)     { _tplUnsub();     _tplUnsub = null; }
    if (_mapUnsub)     { _mapUnsub();     _mapUnsub = null; }
    if (_tokensUnsub)  { _tokensUnsub();  _tokensUnsub = null; }
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
  function myToken()     { for (var t of _tokens.values()) { if (t.ownerUid === _uid) return t; } return null; }
  function canControl(t) { return !!t; }   // 이동은 모두에게 — 세션 내 보이는 토큰은 누구나 이동 가능
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
      bgImage: dataUrl || null, bgW: w || 0, bgH: h || 0,
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
  // 플레이어 입장 시 자기 토큰 보장 (Phase C에서 호출) — 이미 있으면 그 id 반환
  function ensureMyToken(fields) {
    if (!_activeMapId) return Promise.reject('no-active-map');
    var mine = myToken();
    if (mine) return Promise.resolve(mine.id);
    return createToken(Object.assign({ ownerUid: _uid }, fields || {}));
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
      bgImage: null, bgW: 0, bgH: 0, gridSize: 50, gridEnabled: false,
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
    myToken: myToken, canControl: canControl,
    // 맵 관리 (GM) — 멀티맵 저장/전환
    createMap: createMap, renameMap: renameMap, deleteMap: deleteMap, setActiveMap: setActiveMap,
    // 맵 쓰기 (GM)
    setBackground: setBackground, setGridSize: setGridSize, setGrid: setGrid, setFogMask: setFogMask,
    // 토큰 쓰기
    createToken: createToken, upsertToken: upsertToken, moveToken: moveToken,
    removeToken: removeToken, ensureMyToken: ensureMyToken, createNpc: createNpc,
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

  let _inited  = false;
  let _active  = false;     // 지도 패널이 표시 중인가
  let _dirty   = true;      // 다시 그려야 하는가 (rAF dirty-flag)
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

  // 포인터 상태
  let _drag = null;         // 마우스/단일터치 팬: {x,y}
  let _pinch = null;        // 2터치 줌: {dist, mid, worldMid, scale}
  let _tokenDrag = null;    // 토큰 끌기: {id, x, y, grabX, grabY} (x,y=현재 월드 위치)

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
        else if (kind === 'active') { _onActiveMapChange(); }   // 활성 맵 전환 → 뷰 리셋
        else if (kind === 'maps') { _renderDrawer(); }          // 맵 목록 변경 → 드로어 갱신(GM)
        else if (kind === 'templates') { _renderTplPalette(); } // 토큰 팔레트 변경 → 갱신(GM)
        else if (kind === 'tokens-init') { _maybeProvision(); _markDirty(); }
        else if (kind === 'ping') { _addPing(payload); }
        else { _markDirty(); }            // 'tokens' 증분 변경
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

    // ── GM 배경 업로드 ──
    if (_fileInput) _fileInput.addEventListener('change', _onPickBg);

    window.addEventListener('resize', function() { if (_active) { _positionFullscreen(); _resize(); } });
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
    if (_bg.loaded && !_userMoved && _cssW && _cssH) fit();
  }

  // ── 배경 상태 변경 처리 ──
  function _onMapState(state) {
    const url = state && state.bgImage ? state.bgImage : null;
    if (url !== _bg.url) {
      _bg = { url: url, img: null, w: 0, h: 0, loaded: false };
      _userMoved = false;                 // 새 배경 → 자동 맞춤 재개
      if (url) {
        const img = new Image();
        img.onload = function() {
          _bg.img = img; _bg.loaded = true;
          _bg.w = (state && state.bgW) || img.naturalWidth;
          _bg.h = (state && state.bgH) || img.naturalHeight;
          _autoFit();                     // 캔버스 크기 확정돼 있으면 전체 맞춤
          _refreshEmpty();
          _markDirty();
        };
        img.onerror = function() { console.warn('[MapView] 배경 로드 실패'); };
        img.src = url;
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
    if (gm) _refreshMapEditor();    // 배경/격자는 드로어 지도 편집기로 이동
    // 시트 플레이 뷰 전용: '내 토큰 놓기' 버튼
    const placeBtn = document.getElementById('map-place-btn');
    if (placeBtn) placeBtn.style.display = _playMode ? '' : 'none';
  }
  // 안개 공개/제거 툴바 (세로 메인 버튼 + 확장 메뉴: 자유/원/사각/전체)
  let _fogMenu = null;              // 열린 메뉴: 'reveal' | 'recover' | null
  function _refreshFogToolbar() {
    const gm = _effGM();
    const rv = document.getElementById('fog-btn-reveal');
    const rc = document.getElementById('fog-btn-recover');
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
    _refreshFogToolbar();
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

  // ───────────────────────────────────────────
  //  토큰 — 기하/가시성/히트테스트/이미지 캐시
  // ───────────────────────────────────────────
  function _cell() { return _gridPx || 50; }   // 셀 크기(px) — 격자/스냅/토큰크기 단일 출처
  function _tokenRadiusWorld(t) { return ((t.size || 1) * _cell()) / 2; }
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
    const n = Math.max(1, Math.round(size || 1));       // 점유 칸수(작음 0.5→1)
    if (n % 2 === 1) return { x: (Math.floor(x / c) + 0.5) * c, y: (Math.floor(y / c) + 0.5) * c };
    return { x: Math.round(x / c) * c, y: Math.round(y / c) * c };
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
      var s = _snapWorld(d.x, d.y, tk && tk.size);
      tx = s.x; ty = s.y;
    }
    MapSync.moveToken(d.id, Math.round(tx), Math.round(ty))
      .catch(function(err) { console.warn('[MapView moveToken]', err); _markDirty(); });
    _markDirty();
  }

  // ── 전체 맵을 화면에 맞춤 (중앙 정렬) ──
  function fit() {
    if (!_bg.loaded || !_cssW || !_cssH) return;
    const s = Math.min(_cssW / _bg.w, _cssH / _bg.h);
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
    return { cx: (_cssW / 2 - _view.offX) / _view.scale, cy: (_cssH / 2 - _view.offY) / _view.scale, scale: _view.scale };
  }
  function _applyCamNow(c) {
    if (!c || !_cssW || !_cssH || !c.scale) return false;
    _view.scale = c.scale;
    _view.offX = _cssW / 2 - c.cx * c.scale;
    _view.offY = _cssH / 2 - c.cy * c.scale;
    _userMoved = true; _markDirty(); return true;     // userMoved=true → autoFit이 동기화 시점을 덮지 않음
  }
  function applyCameraShare(c) { _pendingCam = c || null; _applyCamNow(c); }

  // ── 마우스 ──
  function _onMouseDown(e) {
    if (_displayPlayer) return;                       // 플레이어 디스플레이=무조작(카메라는 동기화로만)
    const p = _localXY(e);
    _hideTokenActions();                              // 새 상호작용 → 토큰 액션 팝업 닫기
    if (_isPainting()) { _startStroke(p); return; }   // 안개 브러시 우선
    if (!_tryStartTokenDrag(p)) _drag = p;            // 토큰 못 잡으면 팬
    _startPress(p);                                   // 롱프레스(1초) → 핑
  }
  function _onMouseMove(e) {
    if (!_active) return;
    const p = _localXY(e);
    _movePress(p);
    if (_stroke || _shapeDrag) { _paintMove(p); }
    else if (_tokenDrag) { _dragTokenTo(p); }
    else if (_drag) {
      _view.offX += p.x - _drag.x; _view.offY += p.y - _drag.y;
      _drag = p; _userMoved = true; _markDirty();
    }
  }
  function _onMouseUp() { _cancelPress(); _endStroke(); _endTokenDrag(); _drag = null; }
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
      if (_isPainting()) { _startStroke(p); }          // 안개 브러시 우선
      else if (!_tryStartTokenDrag(p)) _drag = p;       // 내 토큰 위면 끌기, 아니면 팬
      _startPress(p);                                   // 롱프레스(1초) → 핑
    } else if (e.touches.length >= 2) {
      _cancelPress();                                   // 두 손가락 → 핑 취소
      _cancelShape();                                   // 그리던 도형은 취소(미적용)
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
      if (_stroke || _shapeDrag) { _paintMove(p); }
      else if (_tokenDrag) { _dragTokenTo(p); }
      else if (_drag) {
        _view.offX += p.x - _drag.x; _view.offY += p.y - _drag.y;
        _drag = p; _userMoved = true; _markDirty();
      }
    }
    e.preventDefault();
  }
  function _onTouchEnd(e) {
    if (e.touches.length === 0) { _cancelPress(); _endStroke(); _endTokenDrag(); _drag = null; _pinch = null; }
    else if (e.touches.length === 1) { _pinch = null; if (!_stroke && !_shapeDrag && !_tokenDrag) _drag = _touchLocal(e.touches[0]); }
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
    if (_dirty) { _dirty = false; _render(); if (_animActive) _dirty = true; }  // 보간 진행 중이면 다음 프레임 예약
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
    _drawPings();           // 핑 (안개 위)
    _drawShapePreview();    // 안개 도형 러버밴드 미리보기 (최상단)
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
    // 테두리: 이미지 토큰은 아트 자체의 링이 프레임 → 기본 테두리 미표시(숨김 상태만 점선 힌트).
    //         글자/색원 토큰만 골드(내토큰)/흰색 테두리.
    if (!img) {
      _ctx.lineWidth = 2;
      _ctx.strokeStyle = (myUid && t.ownerUid === myUid) ? '#f5c518' : 'rgba(255,255,255,0.85)';
      if (t.hidden) _ctx.setLineDash([4, 3]);
      _ctx.beginPath(); _ctx.arc(sx, sy, r, 0, Math.PI * 2); _ctx.stroke();
    } else if (t.hidden) {                              // 숨김 이미지 토큰: 점선만(GM 식별용)
      _ctx.lineWidth = 2; _ctx.strokeStyle = 'rgba(255,255,255,0.7)'; _ctx.setLineDash([4, 3]);
      _ctx.beginPath(); _ctx.arc(sx, sy, r, 0, Math.PI * 2); _ctx.stroke();
    }
    _ctx.restore();
    if (t.hpMax > 0 && _effGM()) {                      // HP 바 (GM 뷰, 몬스터 연결 토큰)
      const cur = (t.hp != null ? t.hp : t.hpMax), ratio = Math.max(0, Math.min(1, cur / t.hpMax));
      const bw = Math.max(24, r * 1.6), bh = 5, bx = sx - bw / 2, by = sy - r - 9;
      _ctx.save();
      _ctx.fillStyle = 'rgba(0,0,0,0.7)'; _ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
      _ctx.fillStyle = ratio > 0.5 ? '#4caf50' : ratio > 0.25 ? '#f1c40f' : '#e74c3c';
      _ctx.fillRect(bx, by, bw * ratio, bh);
      _ctx.restore();
    }
    if (t.name && r >= 12) {                            // 이름표
      _ctx.save();
      _ctx.font = '11px sans-serif'; _ctx.textAlign = 'center'; _ctx.textBaseline = 'top';
      const ty = sy + r + 2, tw = _ctx.measureText(t.name).width;
      _ctx.fillStyle = 'rgba(0,0,0,0.6)';
      _ctx.fillRect(sx - tw / 2 - 3, ty, tw + 6, 14);
      _ctx.fillStyle = '#fff';
      _ctx.fillText(t.name, sx, ty + 1);
      _ctx.restore();
    }
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
    const _gridLines = function(off, color) {
      _ctx.strokeStyle = color;
      _ctx.beginPath();
      for (let wx = wMinX; wx <= wMaxX + 0.5; wx += gs) {
        const sx = Math.round(_view.offX + wx * _view.scale) + off;
        _ctx.moveTo(sx, cy0); _ctx.lineTo(sx, cy1);
      }
      for (let wy = wMinY; wy <= wMaxY + 0.5; wy += gs) {
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
    else if (_drawerTab === 'tokens') _renderTplPalette();
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
  let _editKind = 'npc';     // 'npc'(배치된 토큰) | 'tpl'(팔레트 템플릿) — 편집기 공용
  let _np = null;
  function _npcRefs() {
    if (_np) return _np;
    _np = {
      box:    document.getElementById('map-npc-editor'),
      title:  document.getElementById('np-title'),
      name:   document.getElementById('np-name'),
      size:   document.getElementById('np-size'),
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
  // 편집기는 드로어 팔레트(템플릿) 전용 — 배치된 토큰은 탭하면 숨기기/제거만
  function openTplEdit(id) {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    const t = MapSync.getTemplate(id); if (!t) return;
    const e = _npcRefs(); if (!e.box) return;
    _editKind = 'tpl'; _npcEditId = id;
    if (e.title)  e.title.textContent = '토큰 편집';
    if (e.name)   e.name.value = t.name || '';
    if (e.size)   e.size.value = t.sizeCat || 'medium';
    if (e.hidden) e.hidden.checked = !!t.hidden;
    if (typeof window !== 'undefined' && window.MonsterLink) window.MonsterLink.onEditOpen(id, t);  // 몬스터 연결 UI 동기화
    e.box.style.display = 'block';
  }
  // 배치된 토큰 편집기 열기 (이름/크기/숨김 + 연결 몬스터 정보) — FVTT식 토큰 시트
  function openNpcEdit(id) {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    const t = MapSync.getToken(id); if (!t) return;
    const e = _npcRefs(); if (!e.box) return;
    _editKind = 'npc'; _npcEditId = id;
    if (e.title)  e.title.textContent = '토큰 시트';
    if (e.name)   e.name.value = t.name || '';
    if (e.size)   e.size.value = t.sizeCat || 'medium';
    if (e.hidden) e.hidden.checked = !!t.hidden;
    if (typeof window !== 'undefined' && window.MonsterLink) window.MonsterLink.onEditOpen(id, t);  // 연결 몬스터 라벨/검색 동기화
    const sb = document.getElementById('np-statbtn');
    if (sb) sb.style.display = t.monsterId ? '' : 'none';   // 연결 몬스터 있으면 정보 버튼 노출
    e.box.style.display = 'block';
    _hideTokenActions();
  }
  // 편집기에서 연결 몬스터 스탯블록 보기
  function npcShowStat() {
    if (!_npcEditId || typeof MapSync === 'undefined') return;
    const t = MapSync.getToken(_npcEditId) || (typeof MapSync.getTemplate === 'function' ? MapSync.getTemplate(_npcEditId) : null);
    const mid = t && t.monsterId; if (!mid) { alert('연결된 몬스터가 없습니다.'); return; }
    if (typeof window !== 'undefined' && window.MonsterLink) window.MonsterLink.showStat(mid, (t && (t.monsterName || t.name)) || '');
  }
  // ＋토큰 추가: 새 템플릿 생성 후 편집기 열기
  function openTplCreate() {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    MapSync.createTemplate({ name: '토큰', size: 1, sizeCat: 'medium' })
      .then(function(id) { openTplEdit(id); })
      .catch(function(err) { console.warn('[openTplCreate]', err); alert('토큰 생성 실패: ' + err); });
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
    if (typeof window !== 'undefined' && window.MonsterLink && window.MonsterLink.getSelection) {
      const lk = window.MonsterLink.getSelection();      // 글루가 보유한 현재 편집 대상의 몬스터 연결
      if (lk) { fields.monsterId = lk.monsterId || null; fields.monsterName = lk.monsterName || null; fields.hpMax = lk.hpMax || 0; }
    }
    const p = (_editKind === 'tpl') ? MapSync.updateTemplate(_npcEditId, fields) : MapSync.upsertToken(_npcEditId, fields);
    p.catch(function(err) { console.warn('[npcApply]', err); });
    _markDirty();
  }
  function npcDelete() {
    if (!_npcEditId || !_effGM() || typeof MapSync === 'undefined') return;
    if (_editKind === 'tpl') {
      if (!confirm('이 토큰 템플릿을 삭제할까요?')) return;
      MapSync.deleteTemplate(_npcEditId).catch(function(err) { console.warn('[tplDelete]', err); });
    } else {
      if (!confirm('이 NPC를 삭제할까요?')) return;
      MapSync.removeToken(_npcEditId).catch(function(err) { console.warn('[npcDelete]', err); });
      _disp.delete(_npcEditId);
    }
    npcClose();
  }
  function npcClose() {
    _npcEditId = null;
    const e = _npcRefs(); if (e.box) e.box.style.display = 'none';
  }
  function npcPickPortrait() {
    const e = _npcRefs(); if (e.portraitInput) { e.portraitInput.value = ''; e.portraitInput.click(); }
  }
  function _onNpcPortrait(ev) {
    const file = ev.target.files && ev.target.files[0];
    if (!file || !_npcEditId || typeof MapSync === 'undefined') return;
    const kind = _editKind, id = _npcEditId;
    MapSync.resizeTokenImage(file)
      .then(function(r) { return (kind === 'tpl') ? MapSync.updateTemplate(id, { img: r.dataUrl }) : MapSync.upsertToken(id, { img: r.dataUrl }); })
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
    if (typeof window !== 'undefined' && window.MonsterLink) window.MonsterLink.showStat(t.monsterId, t.monsterName || t.name);
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

  // ── 토큰 팔레트(드로어) + 드래그앤드롭 배치 (GM) ──
  function _sizeKo(cat) { for (var i = 0; i < NPC_SIZES.length; i++) if (NPC_SIZES[i].cat === cat) return NPC_SIZES[i].ko.split(' ')[0]; return '중형'; }
  function _renderTplPalette() {
    const list = document.getElementById('map-tpl-list');
    if (!list || typeof MapSync === 'undefined' || !MapSync.getTemplates) return;
    const tpls = MapSync.getTemplates();
    list.innerHTML = '';
    if (!tpls.length) {
      const hint = document.createElement('div'); hint.className = 'tp-empty';
      hint.textContent = '＋ 토큰 추가로 만든 뒤 지도로 끌어다 놓으세요.';
      list.appendChild(hint); return;
    }
    tpls.forEach(function(t) {
      const row = document.createElement('div');
      row.className = 'tp-row'; row.title = '드래그해서 지도에 배치';
      row.onpointerdown = function(ev) { _startTemplateDrag(t.id, ev); };
      const thumb = document.createElement('div');
      thumb.className = 'tp-thumb';
      if (t.img) { thumb.style.backgroundImage = 'url(' + t.img + ')'; }
      else { thumb.style.background = t.color || '#b03030'; thumb.textContent = ((t.name || '?').trim().charAt(0) || '?'); }
      const nm = document.createElement('span'); nm.className = 'tp-name';
      nm.textContent = (t.name || '토큰') + ' · ' + _sizeKo(t.sizeCat);
      const edit = document.createElement('button'); edit.className = 'tp-act'; edit.textContent = '✎'; edit.title = '편집';
      edit.onpointerdown = function(ev) { ev.stopPropagation(); };
      edit.onclick = function(ev) { ev.stopPropagation(); openTplEdit(t.id); };
      const del = document.createElement('button'); del.className = 'tp-act tp-del'; del.textContent = '🗑'; del.title = '삭제';
      del.onpointerdown = function(ev) { ev.stopPropagation(); };
      del.onclick = function(ev) { ev.stopPropagation(); if (confirm('토큰 "' + (t.name || '') + '" 삭제?')) MapSync.deleteTemplate(t.id).catch(function() {}); };
      row.appendChild(thumb); row.appendChild(nm); row.appendChild(edit); row.appendChild(del);
      list.appendChild(row);
    });
  }
  function addTemplate() { openTplCreate(); }
  // 드로어 토큰 → 포인터 드래그(마우스/터치 공통) → 지도에 드롭
  function _startTemplateDrag(id, ev) {
    if (!_effGM() || typeof MapSync === 'undefined') return;
    const tpl = MapSync.getTemplate(id); if (!tpl) return;
    if (ev && ev.preventDefault) ev.preventDefault();
    const ghost = document.createElement('div');
    ghost.className = 'tpl-ghost'; ghost.textContent = tpl.name || '토큰';
    document.body.appendChild(ghost);
    const place = function(x, y) { ghost.style.left = x + 'px'; ghost.style.top = y + 'px'; };
    place(ev.clientX, ev.clientY);
    let moved = false;
    const onMove = function(e) { moved = true; place(e.clientX, e.clientY); };
    const onUp = function(e) {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
      if (moved) _placeTemplateAtClient(e.clientX, e.clientY, tpl);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }
  function _placeTemplateAtClient(clientX, clientY, tpl) {
    if (!_cv || typeof MapSync === 'undefined') return;
    const r = _cv.getBoundingClientRect();
    if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return;  // 맵 밖 드롭 = 무시
    if (!MapSync.hasActiveMap()) { alert('먼저 지도를 선택하세요.'); return; }
    const w = _screenToWorld(clientX - r.left, clientY - r.top);
    let x = w.x, y = w.y;
    if (_bg.loaded) { x = _clamp(x, 0, _bg.w); y = _clamp(y, 0, _bg.h); }
    if (_gridEnabled) { const s = _snapWorld(x, y, tpl.size); x = s.x; y = s.y; }
    MapSync.createNpc({ name: tpl.name, img: tpl.img, color: tpl.color, size: tpl.size, sizeCat: tpl.sizeCat, hidden: tpl.hidden, x: Math.round(x), y: Math.round(y), monsterId: tpl.monsterId, monsterName: tpl.monsterName, hpMax: tpl.hpMax })
      .catch(function(e) { console.warn('[placeTemplate]', e); });
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
    const bg = document.getElementById('mme-bg-status');
    if (bg) bg.textContent = _bg.loaded ? '✓ 있음 (다시 선택해 교체)' : '없음';
  }

  return {
    init: init, show: show, hide: hide,
    toggleFullscreen: toggleFullscreen, openFullscreen: openFullscreen, closeFullscreen: closeFullscreen,
    fit: fit, zoomIn: zoomIn, zoomOut: zoomOut, pickBg: pickBg,
    getCameraShare: getCameraShare, applyCameraShare: applyCameraShare,   // 듀얼모니터 카메라 동기화
    // 안개 (GM): 공개/제거 도구 + 확장 메뉴
    toggleFogMenu: toggleFogMenu, setFogTool: setFogTool,
    revealAll: revealAll, coverAll: coverAll,
    // 격자 + 지도 편집기 (GM, 드로어 ✎)
    toggleGrid: toggleGrid, gridRangeInput: gridRangeInput, gridRangeChange: gridRangeChange,
    openMapEdit: openMapEdit, mapEditClose: mapEditClose, mapRename: mapRename,
    // GM 멀티맵 드로어 (Map.html)
    toggleDrawer: toggleDrawer, setDrawerTab: setDrawerTab, addMap: addMap, dbSearch: dbSearch,
    // GM 토큰 편집기(드로어 템플릿) + 배치 토큰 빠른 액션
    npcApply: npcApply, npcDelete: npcDelete,
    npcClose: npcClose, npcPickPortrait: npcPickPortrait,
    tokenActionHide: tokenActionHide, tokenActionRemove: tokenActionRemove, tokenActionStat: tokenActionStat,
    tokenActionDamage: tokenActionDamage, tokenActionHeal: tokenActionHeal, tokenActionEdit: tokenActionEdit,
    npcShowStat: npcShowStat,
    // GM 토큰 팔레트(드로어 + 드래그앤드롭)
    addTemplate: addTemplate, openTplEdit: openTplEdit, openNpcEdit: openNpcEdit,
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
