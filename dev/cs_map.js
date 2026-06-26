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


// ═══════════════════════════════════════════════
//  MAP VIEW — 캔버스 렌더러 + 터치 줌/팬 + GM 배경 업로드
//  Phase B: 배경 렌더 + 핀치줌/팬 + GM 업로드. 토큰/안개는 Phase C/D.
//  MapSync(데이터)와 분리된 표현 계층. MapSync.onChange로 재draw 트리거.
// ═══════════════════════════════════════════════
var MapView = (function() {
  'use strict';

  const MIN_SCALE = 0.05, MAX_SCALE = 16;
  const GRID_MIN_PX = 6;   // 화면상 셀이 이보다 작으면 그리드 생략(모아레 방지)

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
  let _fittedFor = null;    // fit을 마지막으로 맞춘 배경 url (자동 맞춤 1회)

  // 포인터 상태
  let _drag = null;         // 마우스/단일터치 팬: {x,y}
  let _pinch = null;        // 2터치 줌: {dist, mid, worldMid, scale}

  function _clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function _markDirty() { _dirty = true; }

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
    _inited = true;

    // MapSync 데이터 변경 → 재draw
    if (typeof MapSync !== 'undefined') {
      MapSync.onChange(function(kind, payload) {
        if (kind === 'map') _onMapState(payload);
        else _markDirty();                // 토큰 변경 — 렌더는 Phase C
      });
    }

    // ── 터치 (모바일: 핀치줌/팬) ──
    _stage.addEventListener('touchstart', _onTouchStart, { passive: false });
    _stage.addEventListener('touchmove',  _onTouchMove,  { passive: false });
    _stage.addEventListener('touchend',   _onTouchEnd,   { passive: false });
    _stage.addEventListener('touchcancel',_onTouchEnd,   { passive: false });
    // ── 마우스 (데스크톱: 드래그 팬 + 휠 줌) ──
    _stage.addEventListener('mousedown', _onMouseDown);
    window.addEventListener('mousemove', _onMouseMove);
    window.addEventListener('mouseup',   _onMouseUp);
    _stage.addEventListener('wheel', _onWheel, { passive: false });

    // ── GM 배경 업로드 ──
    if (_fileInput) _fileInput.addEventListener('change', _onPickBg);

    window.addEventListener('resize', function() { if (_active) { _resize(); } });
  }

  // ── 패널 표시/숨김 (switchTab에서 호출) ──
  function show() {
    init();
    if (!_inited) return;
    _active = true;
    _refreshToolbar();
    _onMapState(typeof MapSync !== 'undefined' ? MapSync.getMapState() : null);
    _resize();                            // 캔버스 크기 확정 + 첫 draw
    _loop();
  }
  function hide() {
    _active = false;
    if (_raf) { cancelAnimationFrame(_raf); _raf = null; }
    if (_drag) _drag = null;
    if (_pinch) _pinch = null;
  }

  // ── 캔버스 픽셀 크기 = 스테이지 크기 (모바일 하단 내비 제외) ──
  function _resize() {
    if (!_stage) return;
    const rect = _stage.getBoundingClientRect();
    const nav = document.getElementById('mobile-bottom-nav');
    const navH = (nav && getComputedStyle(nav).display !== 'none') ? nav.offsetHeight : 0;
    // 스테이지가 하단 내비 밑으로 흐르면 잘라냄
    let h = Math.min(rect.height, window.innerHeight - rect.top - navH);
    if (!(h > 80)) h = Math.max(120, window.innerHeight - rect.top - navH);
    _stage.style.height = h + 'px';

    _dpr  = window.devicePixelRatio || 1;
    _cssW = _stage.clientWidth;
    _cssH = _stage.clientHeight;
    _cv.width  = Math.max(1, Math.round(_cssW * _dpr));
    _cv.height = Math.max(1, Math.round(_cssH * _dpr));
    _markDirty();
  }

  // ── 배경 상태 변경 처리 ──
  function _onMapState(state) {
    const url = state && state.bgImage ? state.bgImage : null;
    if (url !== _bg.url) {
      _bg = { url: url, img: null, w: 0, h: 0, loaded: false };
      if (url) {
        const img = new Image();
        img.onload = function() {
          _bg.img = img; _bg.loaded = true;
          _bg.w = (state && state.bgW) || img.naturalWidth;
          _bg.h = (state && state.bgH) || img.naturalHeight;
          if (_fittedFor !== url) { fit(); _fittedFor = url; }
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
    _refreshEmpty();
    _markDirty();
  }

  function _refreshEmpty() {
    if (!_empty) return;
    if (_bg.loaded) { _empty.style.display = 'none'; return; }
    _empty.style.display = 'flex';
    const gm = (typeof MapSync !== 'undefined' && MapSync.isGM());
    _empty.textContent = gm
      ? '배경 이미지를 업로드하면 모든 참가자에게 표시됩니다.'
      : 'GM이 지도를 준비하면 여기에 표시됩니다.';
  }

  function _refreshToolbar() {
    const gm = (typeof MapSync !== 'undefined' && MapSync.isGM());
    if (_uploadBtn) _uploadBtn.style.display = gm ? '' : 'none';
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
    const w = _screenToWorld(sx, sy);
    _view.scale = ns;
    _view.offX = sx - w.x * ns;
    _view.offY = sy - w.y * ns;
    _markDirty();
  }
  function zoomIn()  { _zoomAt(_cssW / 2, _cssH / 2, 1.25); }
  function zoomOut() { _zoomAt(_cssW / 2, _cssH / 2, 1 / 1.25); }

  // ── 마우스 ──
  function _onMouseDown(e) { _drag = _localXY(e); }
  function _onMouseMove(e) {
    if (!_drag || !_active) return;
    const p = _localXY(e);
    _view.offX += p.x - _drag.x; _view.offY += p.y - _drag.y;
    _drag = p; _markDirty();
  }
  function _onMouseUp() { _drag = null; }
  function _onWheel(e) {
    e.preventDefault();
    const p = _localXY(e);
    _zoomAt(p.x, p.y, e.deltaY < 0 ? 1.1 : 1 / 1.1);
  }

  // ── 터치 (1손가락=팬, 2손가락=핀치줌+팬) ──
  function _onTouchStart(e) {
    if (e.touches.length === 1) {
      _pinch = null;
      _drag = _touchLocal(e.touches[0]);
    } else if (e.touches.length >= 2) {
      _drag = null;
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
      _markDirty();
    } else if (e.touches.length === 1 && _drag) {
      const p = _touchLocal(e.touches[0]);
      _view.offX += p.x - _drag.x; _view.offY += p.y - _drag.y;
      _drag = p; _markDirty();
    }
    e.preventDefault();
  }
  function _onTouchEnd(e) {
    if (e.touches.length === 0) { _drag = null; _pinch = null; }
    else if (e.touches.length === 1) { _pinch = null; _drag = _touchLocal(e.touches[0]); }
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
      .then(function() { _fittedFor = null; })   // 새 배경 → 다음 로드 시 자동 맞춤
      .catch(function(err) { console.error('[MapView upload]', err); alert('배경 업로드 실패: ' + err); })
      .then(function() { if (_uploadBtn) { _uploadBtn.disabled = false; _uploadBtn.textContent = '🖼 배경'; } });
  }

  // ── 렌더 루프 (dirty-flag) ──
  function _loop() {
    if (!_active) return;
    if (_dirty) { _dirty = false; _render(); }
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
      _drawGrid();
      // 맵 경계
      _ctx.strokeStyle = 'rgba(192,160,98,0.55)';
      _ctx.lineWidth = 1;
      _ctx.strokeRect(_view.offX + 0.5, _view.offY + 0.5, w, h);
    }
    // 토큰/안개 레이어는 Phase C/D
  }

  // ── 그리드 (gridSize px/셀) ──
  function _drawGrid() {
    const st = (typeof MapSync !== 'undefined') ? MapSync.getMapState() : null;
    const gs = st && st.gridSize ? st.gridSize : 0;
    if (!gs) return;
    const step = gs * _view.scale;
    if (step < GRID_MIN_PX) return;       // 너무 촘촘하면 생략
    const x0 = _view.offX, y0 = _view.offY;
    const x1 = x0 + _bg.w * _view.scale, y1 = y0 + _bg.h * _view.scale;
    _ctx.save();
    _ctx.beginPath();
    _ctx.rect(Math.max(0, x0), Math.max(0, y0),
              Math.min(_cssW, x1) - Math.max(0, x0), Math.min(_cssH, y1) - Math.max(0, y0));
    _ctx.clip();
    _ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    _ctx.lineWidth = 1;
    _ctx.beginPath();
    for (let wx = 0; wx <= _bg.w + 0.5; wx += gs) {
      const sx = Math.round(x0 + wx * _view.scale) + 0.5;
      _ctx.moveTo(sx, y0); _ctx.lineTo(sx, y1);
    }
    for (let wy = 0; wy <= _bg.h + 0.5; wy += gs) {
      const sy = Math.round(y0 + wy * _view.scale) + 0.5;
      _ctx.moveTo(x0, sy); _ctx.lineTo(x1, sy);
    }
    _ctx.stroke();
    _ctx.restore();
  }

  return {
    init: init, show: show, hide: hide,
    fit: fit, zoomIn: zoomIn, zoomOut: zoomOut, pickBg: pickBg
  };
})();
