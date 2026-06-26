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
  let _brush = { paint: false, mode: 'reveal', size: BRUSH_SIZES[1] };  // size=월드 px 지름, mode: reveal|recover
  let _stroke = null;       // 그리는 중: {last:{x,y}}

  // ── 다듬기 (Phase E) ──
  let _snap = true;         // 토큰 드롭 시 격자 스냅 (클라이언트별)
  let _disp = new Map();    // tokenId → {x,y} 화면 표시 위치 (원격 이동 보간용)
  let _animActive = false;  // 이번 프레임에 보간 진행 중 (다음 프레임 재draw)
  let _editId = null;       // 편집기 대상 토큰 id (GM)
  let _ed = null;           // 편집기 DOM refs

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
        if (kind === 'map') { _onMapState(payload); }
        else if (kind === 'tokens-init') { _maybeProvision(); _markDirty(); }
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
    const bar = document.getElementById('auth-bar');
    const fs = document.getElementById('map-fullscreen');
    if (fs) fs.style.top = (bar ? Math.round(bar.getBoundingClientRect().bottom) : 0) + 'px';
  }
  function toggleFullscreen() {
    const fs = document.getElementById('map-fullscreen');
    if (!fs) return;
    const open = !fs.classList.contains('open');
    const btn = document.getElementById('map-toggle-btn');
    if (open) {
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
    _refreshEmpty();
    _refreshToolbar();
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
    // 안개 컨트롤 (GM 전용)
    const fogBtn = document.getElementById('map-fog-btn');
    if (fogBtn) { fogBtn.style.display = gm ? '' : 'none'; fogBtn.classList.toggle('on', _fogEnabled); }
    const fogBar = document.getElementById('map-fog-bar');
    if (fogBar) fogBar.style.display = (gm && _fogEnabled) ? 'flex' : 'none';
    const brushBtn = document.getElementById('map-brush-btn');
    if (brushBtn) brushBtn.classList.toggle('on', _brush.paint);
    const modeBtn = document.getElementById('map-brush-mode');
    if (modeBtn) modeBtn.textContent = (_brush.mode === 'reveal') ? '지우개(공개)' : '덮기(가림)';
    const sizeLbl = document.getElementById('map-brush-size');
    if (sizeLbl) sizeLbl.textContent = BRUSH_LABELS[_brushIdx];
    // 다듬기 (Phase E) — ＋토큰/격자 모두 GM 전용 (플레이어는 메뉴 자체 없음, 이동만)
    const addBtn = document.getElementById('map-addtoken-btn');
    if (addBtn) addBtn.style.display = gm ? '' : 'none';
    const snapBtn = document.getElementById('map-snap-btn');
    if (snapBtn) { snapBtn.style.display = gm ? '' : 'none'; snapBtn.classList.toggle('on', _snap); }
  }

  // ───────────────────────────────────────────
  //  토큰 — 기하/가시성/히트테스트/이미지 캐시
  // ───────────────────────────────────────────
  function _cell() {
    const st = (typeof MapSync !== 'undefined') ? MapSync.getMapState() : null;
    return (st && st.gridSize) ? st.gridSize : 50;     // gridSize 없으면 기본 50px/셀
  }
  function _tokenRadiusWorld(t) { return ((t.size || 1) * _cell()) / 2; }
  function _myUid() { return (typeof currentUser !== 'undefined' && currentUser) ? currentUser.uid : null; }

  function _visibleTokens() {
    if (typeof MapSync === 'undefined') return [];
    const gm = MapSync.isGM();
    return MapSync.getTokens().filter(function(t) { return gm || !t.hidden; });  // 플레이어는 hidden 토큰 안 보임
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
  function _maybeProvision() {
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
  function _snapWorld(x, y) {
    if (!_snap) return { x: x, y: y };
    const c = _cell();
    return { x: (Math.floor(x / c) + 0.5) * c, y: (Math.floor(y / c) + 0.5) * c };  // 가장 가까운 셀 중심
  }
  function _endTokenDrag() {
    if (!_tokenDrag) return;
    const d = _tokenDrag; _tokenDrag = null;
    if (typeof MapSync === 'undefined') { _markDirty(); return; }
    if (d.moved < 5) {                                  // 거의 안 움직임 = 탭 → GM은 편집기, 이동 없음
      if (MapSync.isGM()) _openTokenEditor(d.id);
      _markDirty(); return;
    }
    const s = _snapWorld(d.x, d.y);
    MapSync.moveToken(d.id, Math.round(s.x), Math.round(s.y))
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

  // ── 마우스 ──
  function _onMouseDown(e) {
    const p = _localXY(e);
    if (_isPainting()) { _startStroke(p); return; }   // 안개 브러시 우선
    if (!_tryStartTokenDrag(p)) _drag = p;            // 토큰 못 잡으면 팬
  }
  function _onMouseMove(e) {
    if (!_active) return;
    const p = _localXY(e);
    if (_stroke) { _strokeMove(p); }
    else if (_tokenDrag) { _dragTokenTo(p); }
    else if (_drag) {
      _view.offX += p.x - _drag.x; _view.offY += p.y - _drag.y;
      _drag = p; _userMoved = true; _markDirty();
    }
  }
  function _onMouseUp() { _endStroke(); _endTokenDrag(); _drag = null; }
  function _onWheel(e) {
    e.preventDefault();
    const p = _localXY(e);
    _zoomAt(p.x, p.y, e.deltaY < 0 ? 1.1 : 1 / 1.1);
  }

  // ── 터치 (1손가락=팬, 2손가락=핀치줌+팬) ──
  function _onTouchStart(e) {
    if (e.touches.length === 1) {
      _pinch = null;
      const p = _touchLocal(e.touches[0]);
      if (_isPainting()) { _startStroke(p); }          // 안개 브러시 우선
      else if (!_tryStartTokenDrag(p)) _drag = p;       // 내 토큰 위면 끌기, 아니면 팬
    } else if (e.touches.length >= 2) {
      _endStroke();                                     // 그리는 중이었으면 마무리(커밋)
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
      if (_stroke) { _strokeMove(p); }
      else if (_tokenDrag) { _dragTokenTo(p); }
      else if (_drag) {
        _view.offX += p.x - _drag.x; _view.offY += p.y - _drag.y;
        _drag = p; _userMoved = true; _markDirty();
      }
    }
    e.preventDefault();
  }
  function _onTouchEnd(e) {
    if (e.touches.length === 0) { _endStroke(); _endTokenDrag(); _drag = null; _pinch = null; }
    else if (e.touches.length === 1) { _pinch = null; if (!_stroke && !_tokenDrag) _drag = _touchLocal(e.touches[0]); }
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
      .then(function() { if (_uploadBtn) { _uploadBtn.disabled = false; _uploadBtn.textContent = '🖼 배경'; } });
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
      _drawGrid();
      // 맵 경계
      _ctx.strokeStyle = 'rgba(192,160,98,0.55)';
      _ctx.lineWidth = 1;
      _ctx.strokeRect(_view.offX + 0.5, _view.offY + 0.5, w, h);
    }
    _drawTokens();        // 토큰 레이어 (Phase C)
    _drawFog();           // 안개 오버레이 (Phase D)
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

  // ── 토큰 렌더 (원형 초상/색원 + 테두리 + 이름표) ──
  function _drawTokens() {
    if (typeof MapSync === 'undefined') return;
    _animActive = false;
    const ts = _visibleTokens();
    if (!ts.length) return;
    const myUid = _myUid();
    for (const t of ts) {
      const pos = _displayPos(t);
      const sx = pos.x * _view.scale + _view.offX;
      const sy = pos.y * _view.scale + _view.offY;
      let r = _tokenRadiusWorld(t) * _view.scale;
      if (r < 9) r = 9;                                  // 최소 가시 크기
      if (sx + r < 0 || sx - r > _cssW || sy + r < 0 || sy - r > _cssH) continue;  // 화면 밖 컬링
      _ctx.save();
      if (t.hidden) _ctx.globalAlpha = 0.55;             // GM 뷰에서 숨김 토큰 반투명
      // 초상 or 색원 + 이니셜
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
      // 테두리: 내 토큰=골드 / 남=흰색, 숨김=점선
      _ctx.lineWidth = 2;
      _ctx.strokeStyle = (myUid && t.ownerUid === myUid) ? '#f5c518' : 'rgba(255,255,255,0.85)';
      if (t.hidden) _ctx.setLineDash([4, 3]);
      _ctx.beginPath(); _ctx.arc(sx, sy, r, 0, Math.PI * 2); _ctx.stroke();
      _ctx.restore();
      // 이름표
      if (t.name && r >= 12) {
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
    const gm = (typeof MapSync !== 'undefined' && MapSync.isGM());
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
    return (typeof MapSync !== 'undefined') && MapSync.isGM() && _fogEnabled && _brush.paint;
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
    _stroke = { last: p };
    const w = _screenToWorld(p.x, p.y);
    _paintDab(w.x, w.y);
    _markDirty();
    return true;
  }
  function _strokeMove(p) {
    if (!_stroke) return;
    _paintLine(_stroke.last, p);
    _stroke.last = p;
    _markDirty();
  }
  function _endStroke() {
    if (!_stroke) return;
    _stroke = null;
    _commitMask();
  }
  function _commitMask() {
    if (!_maskCv || typeof MapSync === 'undefined') return;
    const url = _maskCv.toDataURL('image/png');
    _maskUrl = url;                                  // 자기 echo 스킵
    MapSync.setFogMask(url, _maskW, _maskH, _fogEnabled).catch(function(err) { console.warn('[MapView fog]', err); });
  }

  // ── 공개 안개 컨트롤 (GM 툴바) ──
  function toggleFog() {
    if (typeof MapSync === 'undefined' || !MapSync.isGM()) return;
    if (!_bg.loaded) { alert('먼저 배경을 업로드하세요.'); return; }
    const next = !_fogEnabled;
    if (next) _ensureMaskFromBg();                   // 없으면 전체 가림 마스크
    _fogEnabled = next;
    if (!next) _brush.paint = false;
    const url = _maskCv ? _maskCv.toDataURL('image/png') : null;
    _maskUrl = url;
    MapSync.setFogMask(url, _maskW, _maskH, next).catch(function(err) { console.warn('[fog toggle]', err); });
    _refreshToolbar(); _markDirty();
  }
  function toggleBrush() {
    if (typeof MapSync === 'undefined' || !MapSync.isGM() || !_fogEnabled) return;
    _brush.paint = !_brush.paint;
    _refreshToolbar(); _markDirty();
  }
  function toggleBrushMode() { _brush.mode = (_brush.mode === 'reveal') ? 'recover' : 'reveal'; _refreshToolbar(); }
  function brushSize(delta) {
    _brushIdx = _clamp(_brushIdx + delta, 0, BRUSH_SIZES.length - 1);
    _brush.size = BRUSH_SIZES[_brushIdx];
    _refreshToolbar();
  }
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
  //  다듬기 (Phase E) — 격자 스냅 + GM 토큰 편집기/NPC
  // ───────────────────────────────────────────
  function toggleSnap() { _snap = !_snap; _refreshToolbar(); }

  // GM: 화면 중앙에 NPC 토큰 생성 후 편집기 열기
  function addToken() {
    if (typeof MapSync === 'undefined' || !MapSync.isGM()) return;
    const c = _screenToWorld(_cssW / 2, _cssH / 2);
    let x = c.x, y = c.y;
    if (_bg.loaded) { x = _clamp(x, 0, _bg.w); y = _clamp(y, 0, _bg.h); }
    MapSync.createToken({ ownerUid: _myUid(), name: 'NPC', x: Math.round(x), y: Math.round(y), color: '#b03030', size: 1, hidden: true })
      .then(function(id) { _openTokenEditor(id); })
      .catch(function(err) { console.warn('[MapView addToken]', err); });
  }

  function _edRefs() {
    if (_ed) return _ed;
    _ed = {
      box:    document.getElementById('map-token-editor'),
      name:   document.getElementById('te-name'),
      color:  document.getElementById('te-color'),
      size:   document.getElementById('te-size'),
      hidden: document.getElementById('te-hidden'),
      portraitInput: document.getElementById('te-portrait-input')
    };
    if (_ed.portraitInput) _ed.portraitInput.addEventListener('change', _onEditorPortrait);
    return _ed;
  }
  function _openTokenEditor(id) {
    if (typeof MapSync === 'undefined' || !MapSync.isGM()) return;
    const t = MapSync.getToken(id);
    if (!t) return;
    const e = _edRefs();
    if (!e.box) return;
    _editId = id;
    if (e.name)   e.name.value = t.name || '';
    if (e.color)  e.color.value = /^#[0-9a-fA-F]{6}$/.test(t.color || '') ? t.color : '#cccccc';
    if (e.size)   e.size.value = String(t.size || 1);
    if (e.hidden) e.hidden.checked = !!t.hidden;
    e.box.style.display = 'block';
  }
  function editorApply() {
    if (!_editId || typeof MapSync === 'undefined' || !MapSync.isGM()) return;  // GM 전용
    const e = _edRefs();
    MapSync.upsertToken(_editId, {
      name:  e.name ? e.name.value : '',
      color: e.color ? e.color.value : '#cccccc',
      size:  e.size ? (parseInt(e.size.value, 10) || 1) : 1,
      hidden: e.hidden ? !!e.hidden.checked : false
    }).catch(function(err) { console.warn('[MapView editorApply]', err); });
    _markDirty();
  }
  function editorDelete() {
    if (!_editId || typeof MapSync === 'undefined' || !MapSync.isGM()) return;  // GM 전용
    if (!confirm('이 토큰을 삭제할까요?')) return;
    MapSync.removeToken(_editId).catch(function(err) { console.warn('[MapView editorDelete]', err); });
    _disp.delete(_editId);
    editorClose();
  }
  function editorClose() { _editId = null; const e = _edRefs(); if (e.box) e.box.style.display = 'none'; }
  function editorPickPortrait() { const e = _edRefs(); if (e.portraitInput) { e.portraitInput.value = ''; e.portraitInput.click(); } }
  function _onEditorPortrait(ev) {
    const file = ev.target.files && ev.target.files[0];
    if (!file || !_editId || typeof MapSync === 'undefined') return;
    MapSync.resizeTokenImage(file)
      .then(function(r) { return MapSync.upsertToken(_editId, { img: r.dataUrl }); })
      .catch(function(err) { console.warn('[MapView editor portrait]', err); });
  }

  return {
    init: init, show: show, hide: hide,
    toggleFullscreen: toggleFullscreen, closeFullscreen: closeFullscreen,
    fit: fit, zoomIn: zoomIn, zoomOut: zoomOut, pickBg: pickBg,
    // 안개 (GM)
    toggleFog: toggleFog, toggleBrush: toggleBrush, toggleBrushMode: toggleBrushMode,
    brushSize: brushSize, revealAll: revealAll, coverAll: coverAll,
    // 다듬기 (Phase E)
    toggleSnap: toggleSnap, addToken: addToken,
    editorApply: editorApply, editorDelete: editorDelete, editorClose: editorClose, editorPickPortrait: editorPickPortrait
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
