/* cs_pf2e_stats.js — FVTT-Native 재기반 베이스 숙련 수학 레이어 (P4)
 * 숙련등급(U/T/E/M/L) + 레벨 + 능력치 보정 + RE 수정치풀(REEngine.getStatistic) → 스탯 최종치.
 * PF2e 규칙: 숙련 보너스 = (숙련됨이면) 레벨 + 등급기여(T=2/E=4/M=6/L=8), 미숙련=0(레벨 미가산).
 * 의존: cs_re_engine.js(REEngine, 선택) · class_features_db.js(CLASS_PROF_TABLE 브리지, 선택).
 * 브라우저/Node 양용. 설계: dev/FVTT_NATIVE_REBASE.md §4 "베이스 숙련 수학".
 *
 * 정합 기준(레거시 cs_calc.js): prof select 값 = 등급기여(0/2/4/6/8),
 *   getProfBonus = 기여>0 ? 기여+level : 0.  본 레이어는 같은 규칙을 순수함수로 제공.
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  const REE = root.REEngine || (isNode ? safeReq('/tmp/PF2e-publish/dev/cs_re_engine.js') : null);
  function safeReq(p) { try { return require(p); } catch (e) { return null; } }

  // ── 숙련등급 ↔ 기여분 ──
  // rank: 0=미숙련(U) 1=숙련(T) 2=전문가(E) 3=달인(M) 4=전설(L)
  const RANK_CONTRIB = { 0: 0, 1: 2, 2: 4, 3: 6, 4: 8 };
  const RANK_KO = { 0: '미숙련', 1: '숙련', 2: '전문가', 3: '달인', 4: '전설' };
  const RANK_LETTER = { 0: 'U', 1: 'T', 2: 'E', 3: 'M', 4: 'L' };

  function rankToContrib(rank) { return RANK_CONTRIB[rank] || 0; }
  function contribToRank(contrib) { return (Number(contrib) || 0) / 2; }

  // 숙련 보너스: 기여>0이면 레벨 가산, 미숙련이면 0.
  // 입력은 rank(0~4) 또는 {contrib} 둘 다 허용 — contrib 우선.
  function proficiencyBonus(rankOrContrib, level, opts) {
    const useContrib = opts && opts.asContrib;
    const contrib = useContrib ? (Number(rankOrContrib) || 0) : rankToContrib(rankOrContrib);
    return contrib > 0 ? (Number(level) || 0) + contrib : 0;
  }

  // ── CLASS_PROF_TABLE 브리지: 레벨별 기여분 해소 ──
  // table 예: {"1":4,"9":6,"17":8}  → 레벨 이하 최대 breakpoint의 값(기여분).
  function contribAtLevel(breakpointMap, level) {
    if (!breakpointMap) return 0;
    const lv = Number(level) || 1;
    let best = 0, bestKey = -1;
    for (const k of Object.keys(breakpointMap)) {
      const kn = Number(k);
      if (kn <= lv && kn > bestKey) { bestKey = kn; best = Number(breakpointMap[k]) || 0; }
    }
    return best;
  }

  // 클래스 진행표에서 (classSlug, statKey, level) → 기여분.
  // statKey: fort/ref/will/perc/classdc/weapon-simple/... (CLASS_PROF_TABLE 키 그대로)
  function classContrib(classSlug, statKey, level, table) {
    const T = table || root.CLASS_PROF_TABLE;
    if (!T || !T[classSlug]) return 0;
    return contribAtLevel(T[classSlug][statKey], level);
  }

  /* ── 스탯 최종치 계산 ──
   * computeStatistic({ level, abilityMod, contrib | rank, reActor, selector, base, extraMods })
   *   - contrib/rank: 숙련 기여(둘 중 하나; contrib 우선)
   *   - base: 시작 상수(AC=10, classDC/spellDC=10, 굴림계=0)
   *   - reActor: REEngine.build 결과(있으면 selector 풀 합산)
   *   - selector: RE 풀 selector(들). 문자열/배열.
   *   - extraMods: [{type,value,source}] 추가 수정치(레거시 효과 브리지용)
   * 반환: { total, base, profBonus, abilityMod, reTotal, applied[], breakdown[] }
   */
  function computeStatistic(o) {
    const level = Number(o.level) || 0;
    const abilityMod = Number(o.abilityMod) || 0;
    const base = Number(o.base) || 0;
    const contrib = o.contrib != null ? (Number(o.contrib) || 0) : rankToContrib(o.rank);
    const profBonus = contrib > 0 ? level + contrib : 0;

    // RE 수정치풀 (PF2e 스태킹 적용된 getStatistic). selector 여러 개면 풀 병합.
    let reTotal = 0, applied = [];
    if (o.reActor && REE && typeof REE.getStatistic === 'function') {
      const sels = Array.isArray(o.selector) ? o.selector : (o.selector ? [o.selector] : []);
      if (sels.length) {
        // 여러 selector의 풀을 임시 병합 후 한 번에 스태킹.
        const merged = { modifiers: {} };
        merged.modifiers['_merged'] = [];
        for (const s of sels) for (const m of (o.reActor.modifiers[s] || [])) merged.modifiers['_merged'].push(m);
        // extraMods도 같은 풀에 합류(레거시 효과 → RE 스태킹 일관)
        for (const m of (o.extraMods || [])) merged.modifiers['_merged'].push(m);
        const st = REE.getStatistic(merged, '_merged');
        reTotal = st.total; applied = st.applied;
      }
    } else if (o.extraMods && o.extraMods.length) {
      // reActor 없이 extraMods만 — 자체 스태킹
      const st = _stackMods(o.extraMods);
      reTotal = st.total; applied = st.applied;
    }

    const total = base + profBonus + abilityMod + reTotal;
    const breakdown = [];
    if (base) breakdown.push({ label: '기본', value: base });
    breakdown.push({ label: `능력`, value: abilityMod });
    breakdown.push({ label: `숙련(${RANK_KO[contribToRank(contrib)] || '미숙련'})`, value: profBonus });
    for (const m of applied) breakdown.push({ label: (m.source || m.type || '수정치'), value: m.value, type: m.type });
    return { total, base, profBonus, abilityMod, reTotal, contrib, rank: contribToRank(contrib), applied, breakdown };
  }

  // RE 없이도 동작하는 독립 스태킹(동일 type 보너스 최고/페널티 최저, untyped 합산)
  function _stackMods(mods) {
    const byType = {}; for (const m of mods) (byType[m.type || 'untyped'] = byType[m.type || 'untyped'] || []).push(m);
    let total = 0; const applied = [];
    for (const type of Object.keys(byType)) {
      if (type === 'untyped') { for (const m of byType[type]) { total += m.value; applied.push(m); } continue; }
      let bb = null, wp = null;
      for (const m of byType[type]) { if (m.value >= 0) { if (!bb || m.value > bb.value) bb = m; } else { if (!wp || m.value < wp.value) wp = m; } }
      if (bb) { total += bb.value; applied.push(bb); }
      if (wp) { total += wp.value; applied.push(wp); }
    }
    return { total, applied };
  }

  // ── 표준 selector 상수(RE 풀 키) ──
  const SEL = {
    ac: ['ac'],
    fortitude: ['fortitude', 'saving-throw'],
    reflex: ['reflex', 'saving-throw'],
    will: ['will', 'saving-throw'],
    perception: ['perception'],
    classDC: ['class-dc'],
    spellAttack: ['spell-attack'],
    spellDC: ['spell-dc'],
    skill: (slug) => [slug, 'skill-check'],
    strikeAttack: ['attack', 'attack-roll', 'strike-attack-roll'],
  };

  // ── 편의 래퍼 ──
  function computeSave(which, o) { return computeStatistic(Object.assign({ base: 0, selector: SEL[which] }, o)); }
  function computeAC(o) { return computeStatistic(Object.assign({ base: 10, selector: SEL.ac }, o)); }
  function computePerception(o) { return computeStatistic(Object.assign({ base: 0, selector: SEL.perception }, o)); }
  function computeClassDC(o) { return computeStatistic(Object.assign({ base: 10, selector: SEL.classDC }, o)); }
  function computeSpellAttack(o) { return computeStatistic(Object.assign({ base: 0, selector: SEL.spellAttack }, o)); }
  function computeSpellDC(o) { return computeStatistic(Object.assign({ base: 10, selector: SEL.spellDC }, o)); }
  function computeSkill(slug, o) { return computeStatistic(Object.assign({ base: 0, selector: SEL.skill(slug) }, o)); }

  const API = {
    RANK_CONTRIB, RANK_KO, RANK_LETTER, SEL,
    rankToContrib, contribToRank, proficiencyBonus,
    contribAtLevel, classContrib, computeStatistic,
    computeSave, computeAC, computePerception, computeClassDC,
    computeSpellAttack, computeSpellDC, computeSkill,
    _stackMods,
  };
  root.PF2eStats = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
