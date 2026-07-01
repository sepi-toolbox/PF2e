#!/usr/bin/env node
/* datatool_server.mjs — DataManager.html 로컬 컴패니언 서버
 * 기능: ①dev/ 정적 서빙(툴 + cs_pf2e.js + data/) ②POST /dm/commit → override JSON 파일 반영 + git add/commit
 * 실행: cd dev && node tools/datatool_server.mjs [port]   (기본 8899)
 * 정적 호스팅(GitHub Pages)은 파일쓰기 불가 → 편집/커밋은 이 로컬 서버 전제.
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..');            // dev/
const OVR_DIR = path.join(DEV, 'data', 'override');
const PORT = Number(process.argv[2]) || 8899;

const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8', '.css':'text/css; charset=utf-8', '.webp':'image/webp',
  '.woff2':'font/woff2', '.png':'image/png', '.svg':'image/svg+xml' };

function send(res, code, body, type='text/plain; charset=utf-8') {
  res.writeHead(code, { 'Content-Type': type }); res.end(body);
}
function git(args) {
  return new Promise((resolve, reject) => {
    execFile('git', args, { cwd: DEV }, (err, so, se) => err ? reject(new Error(se||err.message)) : resolve(so.trim()));
  });
}

async function handleCommit(req, res) {
  let raw = '';
  req.on('data', c => { raw += c; if (raw.length > 50e6) req.destroy(); });
  req.on('end', async () => {
    try {
      const { overrides, commit = true, push = false } = JSON.parse(raw || '{}');
      if (!overrides || typeof overrides !== 'object') return send(res, 400, 'no overrides');
      fs.mkdirSync(OVR_DIR, { recursive: true });
      const written = [];
      // 카테고리별로 기존 override 파일과 병합 후 기록
      for (const cat of Object.keys(overrides)) {
        const file = path.join(OVR_DIR, `${cat}.json`);
        let cur = {};
        try { cur = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) {}
        for (const slug of Object.keys(overrides[cat])) {
          cur[slug] = { ...(cur[slug] || {}), ...overrides[cat][slug] };
          // 빈 필드 정리
          for (const f of Object.keys(cur[slug])) if (cur[slug][f] === '' || cur[slug][f] == null) delete cur[slug][f];
          if (!Object.keys(cur[slug]).length) delete cur[slug];
        }
        fs.writeFileSync(file, JSON.stringify(cur, null, 2) + '\n');
        written.push(path.relative(DEV, file));
      }
      let message = `override 반영: ${written.join(', ')}`;
      if (commit) {
        try {
          await git(['add', ...written]);
          await git(['commit', '-m', `data override: ${written.map(w=>path.basename(w,'.json')).join(',')} (DataManager)`]);
          const sha = await git(['rev-parse', '--short', 'HEAD']);
          message = `커밋 ${sha} — ${written.join(', ')}`;
          if (push) { await git(['push']); message += ' (pushed)'; }
        } catch (e) { message = `파일은 저장됨(${written.join(', ')}) / git 실패: ${e.message}`; }
      }
      send(res, 200, JSON.stringify({ ok: true, message, written }), MIME['.json']);
    } catch (e) {
      send(res, 500, JSON.stringify({ ok: false, message: e.message }), MIME['.json']);
    }
  });
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (req.method === 'POST' && url === '/dm/commit') return handleCommit(req, res);
  // 정적 서빙
  let rel = url === '/' ? '/DataManager.html' : url;
  const fp = path.join(DEV, rel);
  if (!fp.startsWith(DEV)) return send(res, 403, 'forbidden');
  fs.readFile(fp, (err, data) => {
    if (err) return send(res, 404, 'not found: ' + rel);
    send(res, 200, data, MIME[path.extname(fp)] || 'application/octet-stream');
  });
});
server.listen(PORT, () => {
  console.log(`DataManager 컴패니언 서버: http://localhost:${PORT}/  (dev=${DEV})`);
  console.log(`  편집 → "dev 커밋" → POST /dm/commit → data/override/*.json 반영 + git commit`);
});
