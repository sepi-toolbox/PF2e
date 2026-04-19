#!/usr/bin/env node
/**
 * feat_db.js의 텍스트 prerequisites → 구조화 prereqs 배열 자동 생성
 * 사용법: node tools/generate_prereqs.js
 * 결과: prereqs JSON 출력 (stdout), 로그 (stderr)
 */

const fs = require('fs');

// ── 매핑 테이블 ──
const SKILL_MAP = {
  '곡예':'acrobatics','주문학':'arcana','운동':'athletics','공예':'crafting',
  '기만':'deception','교섭':'diplomacy','위협':'intimidation','의학':'medicine',
  '자연학':'nature','오컬티즘':'occultism','공연':'performance','종교학':'religion',
  '사회':'society','은신':'stealth','생존':'survival','도둑질':'thievery',
  // 별칭/오타 대응
  '종교':'religion','제작':'crafting','외교':'diplomacy',
};
const RANK_MAP = {'숙련':2,'전문가':4,'달인':6,'전설':8};
const ABILITY_MAP = {
  '근력':'str','민첩':'dex','건강':'con','지능':'int','지혜':'wis','매력':'cha'
};

// feat_db 로드
eval(fs.readFileSync('feat_db.js', 'utf8'));

// 한글명→영문명 매핑 구축
const koToEn = {};
const enSet = new Set();
for (const f of FEAT_DB) {
  if (!f) continue;
  if (f.name_ko && f.name_en) {
    koToEn[f.name_ko] = f.name_en;
    // "재주명 (English)" → "재주명"도 등록
    const short = f.name_ko.split(' (')[0].trim();
    if (!koToEn[short]) koToEn[short] = f.name_en;
    enSet.add(f.name_en);
  }
}

// 혈통 이름 목록 (traits 체크용)
const ANCESTRY_TRAITS = ['드워프','엘프','노움','고블린','하플링','인간','레쉬','오크',
  '체인질링','네피림','아이우바린','드로마르'];

// ── 단일 조건 파싱 ──
function parseSingleCondition(text) {
  const c = text.trim();
  if (!c) return null;

  // 기술 숙련도: "종교학 숙련", "은신 전문가", "종교에 숙련"
  const skillMatch = c.match(/^(.+?)\s+(숙련|전문가|달인|전설)$/);
  if (skillMatch) {
    const name = skillMatch[1].replace(/에$/, '');
    const rank = RANK_MAP[skillMatch[2]];
    if (name === '지각') return {perception: rank};
    if (name === '지식') return {lore: rank};
    const id = SKILL_MAP[name];
    if (id) return {skill: id, rank};
    return null;
  }

  // 능력치: "매력 +2", "근력 +4"
  const abilMatch = c.match(/^(근력|민첩|건강|지능|지혜|매력)\s*\+(\d+)$/);
  if (abilMatch) {
    return {ability: ABILITY_MAP[abilMatch[1]], min: parseInt(abilMatch[2])};
  }

  // 시야
  if (c === '저광 시야') return {vision: 'low-light'};
  if (c === '암시야' || c.startsWith('암시야(')) return {vision: 'darkvision'};

  // 혈통 특성
  if (ANCESTRY_TRAITS.includes(c)) return {ancestry: c};

  // 혈통 관련 복합 (천상 혈통, 마귀 혈통 등)
  const heritageMatch = c.match(/^(.+)\s+혈통$/);
  if (heritageMatch) return {heritage: c};

  // 서브클래스
  const subclassMatch = c.match(/^(.+)\s+(뮤즈|교리|교의|교단|라켓|결사|본능|학파|방법론)$/);
  if (subclassMatch) return {subclass: c};

  // 재주 참조: "XX(English Name)" 패턴
  const featParenMatch = c.match(/^(.+?)\s*\(([A-Za-z][\w\s'''-]+)\)$/);
  if (featParenMatch && enSet.has(featParenMatch[2].trim())) {
    return {feat: featParenMatch[2].trim()};
  }
  if (featParenMatch) {
    return {feat: featParenMatch[2].trim()};
  }

  // 재주 참조: 한글만 — FEAT_DB에서 검색
  const enName = koToEn[c];
  if (enName) return {feat: enName};

  // "XX 원천" 패턴 (해로운 원천, 치유 원천)
  if (c.endsWith(' 원천')) return {feat: c};

  // 단일 단어가 아닌 복합 한글 — 재주명일 가능성 체크
  // 3글자 이상이고 DB에서 유사 매칭
  if (c.length >= 2) {
    // 정확한 매칭 실패 시 부분 매칭 시도
    for (const f of FEAT_DB) {
      if (!f || !f.name_ko) continue;
      const short = f.name_ko.split(' (')[0].trim();
      if (short === c) return {feat: f.name_en};
    }
  }

  return null;
}

// ── 전제조건 문자열 → prereqs 배열 ──
function parsePrerequisites(prereqStr) {
  if (!prereqStr) return null;

  // 첫 문장만 (설명 텍스트 제거)
  let prereq = prereqStr.split(/(?<=\.)\s+/)[0].replace(/\.$/,'').trim();
  if (!prereq) return null;

  // ";" 세미콜론도 AND 구분자로 처리
  prereq = prereq.replace(/;\s*/g, ', ');

  // 쉼표로 AND 분리
  const andParts = prereq.split(/,\s*/);
  const result = [];
  let allParsed = true;

  for (const part of andParts) {
    const p = part.trim();
    if (!p) continue;

    // "또는" OR 조건
    if (p.includes(' 또는 ')) {
      const orParts = p.split(/\s+또는\s+/);
      const orConditions = [];
      let orAllParsed = true;
      for (const op of orParts) {
        const cond = parseSingleCondition(op.trim());
        if (cond) orConditions.push(cond);
        else orAllParsed = false;
      }
      if (orConditions.length > 1 && orAllParsed) {
        result.push({or: orConditions});
      } else if (orConditions.length === 1 && orAllParsed) {
        result.push(orConditions[0]);
      } else {
        allParsed = false;
      }
      continue;
    }

    const cond = parseSingleCondition(p);
    if (cond) {
      result.push(cond);
    } else {
      allParsed = false;
    }
  }

  // 부분 파싱도 허용: 파싱된 조건만 반환 (체크 가능한 것만이라도)
  return result.length > 0 ? { prereqs: result, complete: allParsed } : null;
}

// ── 메인 ──
let fullParsed = 0, partialParsed = 0, skipped = 0;
const unparsed = [];
const results = {};

for (const f of FEAT_DB) {
  if (!f || !f.prerequisites) continue;
  const parsed = parsePrerequisites(f.prerequisites);
  if (parsed) {
    results[f.name_en] = parsed.prereqs;
    if (parsed.complete) fullParsed++;
    else {
      partialParsed++;
      const prereq = f.prerequisites.split(/(?<=\.)\s+/)[0].replace(/\.$/,'').trim().substring(0, 60);
      unparsed.push(`  PARTIAL: ${f.name_en} → ${prereq}`);
    }
  } else {
    skipped++;
    const prereq = f.prerequisites.split(/(?<=\.)\s+/)[0].replace(/\.$/,'').trim().substring(0, 60);
    unparsed.push(`  SKIP: ${f.name_en} → ${prereq}`);
  }
}

console.error(`=== 변환 결과 ===`);
console.error(`  완전 파싱: ${fullParsed}`);
console.error(`  부분 파싱: ${partialParsed}`);
console.error(`  파싱 실패: ${skipped}`);
console.error(`  총: ${fullParsed + partialParsed + skipped}`);
if (unparsed.length > 0) {
  console.error(`\n=== 미완 목록 ===`);
  unparsed.forEach(u => console.error(u));
}

// JSON 출력
console.log(JSON.stringify(results, null, 2));
