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
  let _sessionId   = null;
  let _isGM        = false;
  let _uid         = null;
  let _mapState    = null;           // map/state doc 데이터 (없으면 null)
  let _tokens      = new Map();      // tokenId → {id, ownerUid, name, x, y, ...}
  let _mapUnsub    = null;
  let _tokensUnsub = null;
  let _tokensReady = false;          // 초기 스냅샷 구분
  let _changeCb    = null;           // 렌더러 구독 콜백 (Phase B~)

  function _db()        { return (typeof db !== 'undefined') ? db : null; }
  function _ts()        { return firebase.firestore.FieldValue.serverTimestamp(); }
  function _mapDoc()    { return _db().collection('sessions').doc(_sessionId).collection('map').doc('state'); }
  function _tokensCol() { return _db().collection('sessions').doc(_sessionId).collection('tokens'); }

  function _emit(kind, payload) {
    if (typeof _changeCb === 'function') {
      try { _changeCb(kind, payload); } catch (e) { console.error('[MapSync cb]', e); }
    }
  }

  // ───────────────────────────────────────────
  //  시작 / 정지 — 세션 수명주기에 연동 (cs_session.js)
  // ───────────────────────────────────────────
  function start(sessionId, opts) {
    opts = opts || {};
    _stopListeners();          // 재진입 idempotent (중복 구독 방지)
    _sessionId = sessionId;
    _isGM = !!opts.isGM;
    _uid  = opts.uid || ((typeof currentUser !== 'undefined' && currentUser) ? currentUser.uid : null);
    _mapState = null;
    _tokens.clear();
    _tokensReady = false;
    if (!_db() || !_sessionId) { console.warn('[MapSync] db/sessionId 없음 — 시작 취소'); return; }

    // 맵 상태(배경/안개/그리드) 감시
    _mapUnsub = _mapDoc().onSnapshot(function(doc) {
      _mapState = doc.exists ? doc.data() : null;
      _emit('map', _mapState);
    }, function(err) {
      console.error('[MapSync map listener]', err);
      setTimeout(function() { if (_sessionId) start(_sessionId, { isGM: _isGM, uid: _uid }); }, RECONNECT_MS);
    });

    // 토큰 감시 (rolls 패턴 — docChanges 증분 적용)
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
    }, function(err) {
      console.error('[MapSync tokens listener]', err);
      setTimeout(function() { if (_sessionId) start(_sessionId, { isGM: _isGM, uid: _uid }); }, RECONNECT_MS);
    });
  }

  function _stopListeners() {
    if (_mapUnsub)    { _mapUnsub();    _mapUnsub = null; }
    if (_tokensUnsub) { _tokensUnsub(); _tokensUnsub = null; }
  }

  function stop() {
    _stopListeners();
    _sessionId = null;
    _mapState = null;
    _tokens.clear();
    _tokensReady = false;
  }

  // ───────────────────────────────────────────
  //  조회 (렌더러용 — Phase B~)
  // ───────────────────────────────────────────
  function getMapState() { return _mapState; }
  function getTokens()   { return Array.from(_tokens.values()); }
  function getToken(id)  { return _tokens.get(id) || null; }
  function myToken()     { for (var t of _tokens.values()) { if (t.ownerUid === _uid) return t; } return null; }
  function canControl(t) { return _isGM || !!(t && t.ownerUid === _uid); }
  function isGM()        { return _isGM; }
  function isActive()    { return !!_sessionId; }
  function onChange(cb)  { _changeCb = cb; }

  // ───────────────────────────────────────────
  //  쓰기: 맵 상태 (GM 전용)
  // ───────────────────────────────────────────
  function setBackground(dataUrl, w, h) {
    if (!_isGM) { console.warn('[MapSync] GM만 배경 설정 가능'); return Promise.reject('not-gm'); }
    return _mapDoc().set({
      bgImage: dataUrl || null, bgW: w || 0, bgH: h || 0,
      updatedAt: _ts(), updatedBy: _uid
    }, { merge: true });
  }
  function setGridSize(px) {
    if (!_isGM) return Promise.reject('not-gm');
    return _mapDoc().set({ gridSize: px || 50, updatedAt: _ts(), updatedBy: _uid }, { merge: true });
  }
  // 안개 마스크 (Phase D — GM 드로잉 결과 동기화)
  function setFogMask(maskDataUrl, mw, mh, enabled) {
    if (!_isGM) return Promise.reject('not-gm');
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
    var ref = _tokensCol().doc();
    return ref.set({
      ownerUid: fields.ownerUid || _uid,
      name:  fields.name  || '',
      x:     fields.x     || 0,
      y:     fields.y     || 0,
      img:   fields.img   || null,
      color: fields.color || '#c0a062',
      size:  fields.size  || 1,
      hidden: !!fields.hidden,
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
    var mine = myToken();
    if (mine) return Promise.resolve(mine.id);
    return createToken(Object.assign({ ownerUid: _uid }, fields || {}));
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
    getMapState: getMapState, getTokens: getTokens, getToken: getToken,
    myToken: myToken, canControl: canControl,
    // 맵 쓰기 (GM)
    setBackground: setBackground, setGridSize: setGridSize, setFogMask: setFogMask,
    // 토큰 쓰기
    createToken: createToken, upsertToken: upsertToken, moveToken: moveToken,
    removeToken: removeToken, ensureMyToken: ensureMyToken,
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
