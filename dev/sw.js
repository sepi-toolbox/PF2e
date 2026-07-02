// Pathforge PWA 서비스워커 — 앱셸 캐싱 + 오프라인 폴백.
// 캐싱 정책 변경 시 CACHE 버전 올릴 것(구 캐시 자동 정리).
const CACHE = 'pathforge-0.58';

self.addEventListener('install', (e) => {
  self.skipWaiting();   // 새 SW 즉시 대기 해제(업데이트 빠르게 반영)
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));  // 구 캐시 제거
    await self.clients.claim();
  })());
});

async function cacheFirst(req) {
  const c = await caches.open(CACHE);
  const hit = await c.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok) c.put(req, res.clone());
  return res;
}

async function networkFirst(req) {
  const c = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok && res.type === 'basic') c.put(req, res.clone());  // 최신을 캐시에 갱신
    return res;
  } catch (e) {
    const hit = await c.match(req);
    if (hit) return hit;
    if (req.mode === 'navigate') {                        // 오프라인 + 미캐시 네비게이션
      const shell = await c.match('index.html') || await c.match('Pathforge.html');
      if (shell) return shell;
      return new Response('<meta charset="utf-8"><body style="background:#0c0c0c;color:#c9a84c;font-family:sans-serif;text-align:center;padding:60px;">오프라인입니다. 네트워크 연결 후 다시 시도하세요.</body>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    throw e;
  }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                        // 쓰기 요청은 우회
  const url = new URL(req.url);
  // Firestore/인증 API: SW 우회(데이터는 Firestore 자체 오프라인, 인증은 네트워크 필요)
  if (/firestore\.googleapis|identitytoolkit|securetoken|firebaseinstallations|google\.firestore/.test(url.href)) return;
  // 불변 CDN(firebase SDK 등): cache-first
  if (url.origin === 'https://www.gstatic.com') { e.respondWith(cacheFirst(req)); return; }
  // 동일 출처(앱셸·JS·아이콘·데이터파일): network-first + 캐시 폴백
  if (url.origin === self.location.origin) { e.respondWith(networkFirst(req)); return; }
  // 그 외: 기본 동작
});
