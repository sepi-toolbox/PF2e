#!/usr/bin/env node
// sync_kr.mjs — PF2e-KR 번역 상시 동기화 오케스트레이터 (한글 측 전량)
//
//   소스: Rutz179/PF2e-KR (원조 upstream). 명령 한 번으로 최신을 받아와
//   KO 추출기 5종을 재실행하고 dev/data/* 산출물을 갱신한다.
//   영문 BASE(extract_pf2e/extract_creatures)는 LevelDB + Foundry 종료가 필요해
//   이 동기화에서 제외(이미 dev/data/base/* 로 커밋됨, 번역 무관).
//
//   사용:
//     node tools/rebase/sync_kr.mjs            # Rutz179 최신 fetch 후 전량 동기화
//     node tools/rebase/sync_kr.mjs --local    # fetch 생략, 로컬 Foundry 설치본 사용
//     node tools/rebase/sync_kr.mjs --src DIR   # 임의 PF2e-KR 체크아웃 경로 사용
//     node tools/rebase/sync_kr.mjs --repo OWNER/NAME  # 다른 upstream(기본 Rutz179/PF2e-KR)
//     node tools/rebase/sync_kr.mjs --no-creatures      # 크리처 오버레이 8팩 생략(가벼움)
//
//   동기화 후 `git diff --stat dev/data/`를 출력. 커밋/푸시는 하지 않음(승인 후 별도).
//   크리처 데이터(dev/data/creatures/*)가 바뀌면 Bestiary.html·Map.html cs_monster.js?v 범프 필요.

import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..'); // /tmp/PF2e-publish
const argv = process.argv.slice(2);
const has = f => argv.includes(f);
const opt = (f, d) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };

const REPO = opt('--repo', 'Rutz179/PF2e-KR');
const LOCAL = has('--local');
const SRC_OVERRIDE = opt('--src', null);
const DO_CREATURES = !has('--no-creatures');
const WORK = '/tmp/PF2e-KR-src';

// 크리처 팩 매핑: dev/data/creatures/<base>.base.json  ↔  compendium/ko/<koPack>.json
const CREATURE_PACKS = [
  { base: 'bestiary',        ko: 'pf2e.pathfinder-bestiary' },
  { base: 'bestiary-2',      ko: 'pf2e.pathfinder-bestiary-2' },
  { base: 'bestiary-3',      ko: 'pf2e.pathfinder-bestiary-3' },
  { base: 'monster-core',    ko: 'pf2e.pathfinder-monster-core' },
  { base: 'monster-core-2',  ko: 'pf2e.pathfinder-monster-core-2' },
  { base: 'npc-core',        ko: 'pf2e.pathfinder-npc-core' },
  { base: 'npc-gallery',     ko: 'pf2e.npc-gallery' },
  { base: 'hazards',         ko: 'pf2e.hazards' },
];

const log = (...a) => console.log(...a);
const step = s => log(`\n\x1b[1m▶ ${s}\x1b[0m`);

function resolveSrc() {
  if (SRC_OVERRIDE) {
    if (!fs.existsSync(path.join(SRC_OVERRIDE, 'lang', 'ko.json')))
      throw new Error(`--src 경로에 lang/ko.json 없음: ${SRC_OVERRIDE}`);
    return SRC_OVERRIDE;
  }
  if (LOCAL) {
    const local = `${process.env.HOME}/Library/Application Support/FoundryVTT/Data/modules/PF2e-KR`;
    if (!fs.existsSync(path.join(local, 'lang', 'ko.json')))
      throw new Error(`로컬 설치본 없음: ${local}`);
    return local;
  }
  // fetch Rutz179 (또는 --repo) tarball
  step(`upstream fetch: ${REPO} (main)`);
  fs.rmSync(WORK, { recursive: true, force: true });
  fs.mkdirSync(WORK, { recursive: true });
  const url = `https://codeload.github.com/${REPO}/tar.gz/refs/heads/main`;
  execSync(`curl -sSL "${url}" | tar xz -C "${WORK}" --strip-components=1`, { stdio: 'inherit' });
  if (!fs.existsSync(path.join(WORK, 'lang', 'ko.json')))
    throw new Error(`fetch 실패 — ${WORK}/lang/ko.json 없음`);
  // upstream 버전 기록
  try {
    const mj = JSON.parse(fs.readFileSync(path.join(WORK, 'module.json'), 'utf8'));
    log(`  upstream: ${mj.title || REPO} v${mj.version}`);
  } catch {}
  return WORK;
}

function run(label, file, args, env) {
  step(label);
  execFileSync('node', [path.join(ROOT, file), ...args], {
    cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...env },
  });
}

// ── main ──
let SRC;
try {
  SRC = resolveSrc();
} catch (e) {
  console.error(`\x1b[31m소스 해결 실패: ${e.message}\x1b[0m`);
  process.exit(1);
}
log(`소스(PF2E_KR_SRC) = ${SRC}`);
const ENV = { PF2E_KR_SRC: SRC };

// 의존 순서: _lang.ko.json(특성명) 먼저 → glossary가 재사용
run('1/5 아이템 특성명 오버레이 (overlay/_lang.ko.json)', 'tools/pf2e/build_lang_overlay.mjs', [], ENV);
run('2/5 시스템 용어 글로서리 (creatures/_glossary.ko.json)', 'tools/rebase/build_glossary.mjs', [], ENV);
run('3/5 특성 설명 사전 (creatures/_trait_desc.ko.json)', 'tools/rebase/build_trait_desc.mjs', [], ENV);
run('4/5 아이템 오버레이 11종 (overlay/*.ko.json)', 'tools/pf2e/build_overlay.mjs', [], ENV);

if (DO_CREATURES) {
  step('5/5 크리처 오버레이 8팩 (creatures/*.ko.json)');
  for (const p of CREATURE_PACKS) {
    const baseFile = path.join(ROOT, 'dev/data/creatures', `${p.base}.base.json`);
    const koPack = path.join(SRC, 'compendium/ko', `${p.ko}.json`);
    if (!fs.existsSync(baseFile)) { log(`  - ${p.base}: base 없음, skip`); continue; }
    if (!fs.existsSync(koPack))   { log(`  - ${p.base}: ko팩(${p.ko}) 없음, skip`); continue; }
    log(`  · ${p.base}  ←  ${p.ko}`);
    execFileSync('node', [
      path.join(ROOT, 'tools/rebase/build_overlay.mjs'),
      p.ko,
      `dev/data/creatures/${p.base}.base.json`,
      `dev/data/creatures/${p.base}.ko.json`,
      `dev/data/creatures/${p.base}.todo.json`,
    ], { cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...ENV } });
  }
} else {
  log('\n(--no-creatures: 크리처 오버레이 생략)');
}

// ── 변경 리포트 ──
step('변경 사항 (git diff --stat dev/data/)');
let diff = '';
try { diff = execSync('git diff --stat -- dev/data/', { cwd: ROOT, encoding: 'utf8' }); } catch {}
if (diff.trim()) {
  log(diff);
  log('\x1b[33m산출물이 변경됨.\x1b[0m 검토 후 커밋하세요. (커밋/푸시는 이 스크립트가 하지 않음)');
  const creatureChanged = /dev\/data\/creatures\//.test(diff);
  if (creatureChanged)
    log('\x1b[33m⚠ 크리처 데이터 변경 → Bestiary.html·Map.html 의 cs_monster.js?v 범프 필요.\x1b[0m');
} else {
  log('변경 없음 — upstream과 이미 동기 상태.');
}
log('\n완료.');
