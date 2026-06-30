/* cs_re_engine.js — FVTT Rule Element 해석 엔진 v1 (P2)
 * 액터 모델 위에 아이템들의 system.rules를 적용 → 수정치 풀/IWR/속도/감각/노트 수집 + PF2e 스태킹.
 * 의존: cs_pf2e.js (PF2eData) — getByUuid/resolveBrackets/testPredicate.
 * 설계: dev/FVTT_NATIVE_REBASE.md §4. 미구현 RE = graceful no-op + _log.
 */
(function (root) {
  'use strict';
  const isNode = typeof window === 'undefined';
  const PF = root.PF2eData || (isNode ? require('/tmp/PF2e-publish/dev/cs_pf2e.js') : null);

  const ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  const MOD_TYPES = ['circumstance', 'status', 'item', 'untyped'];

  // ---- 액터 생성 ----
  // input: { level, abilities:{str..cha mods}, ancestry, class, traits:[], items:[{doc, choices?}] }
  function createActor(input) {
    const a = {
      level: input.level || 1,
      abilities: Object.assign({ str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 }, input.abilities || {}),
      ancestry: input.ancestry || null, class: input.class || null,
      traits: input.traits ? input.traits.slice() : [],
      items: (input.items || []).map(it => ({ doc: it.doc, choices: it.choices || {}, _granted: false })),
      // 산출물
      rollOptions: new Set(),
      modifiers: {},     // selector → [ {type,value,slug,source,predicate} ]
      damageDice: {},    // selector → [ {diceNumber,dieSize,damageType,source} ]
      notes: {},         // selector → [ {outcome,text,title,source} ]
      iwr: { resistances: [], weaknesses: [], immunities: [] },
      speeds: {},        // selector → value (최대값 채택)
      senses: new Set(),
      aeApplied: [],     // ActiveEffectLike 적용 로그
      dataChanges: {},   // ActiveEffectLike 비능력치 수치 경로 → 누적값 (숙련 rank 등)
      grantedItems: [],
      grantedDocs: [],   // GrantItem 해소된 doc (소비자가 재주/효과 구분)
      _log: [],          // 미구현/스킵 기록
    };
    return a;
  }

  function _seedRollOptions(a) {
    const o = a.rollOptions;
    o.add(`self:level:${a.level}`);
    if (a.ancestry) o.add(`self:ancestry:${a.ancestry}`), o.add(`origin:ancestry:${a.ancestry}`);
    if (a.class) o.add(`self:class:${a.class}`);
    for (const t of a.traits) o.add(`self:trait:${t}`);
    for (const ab of ABILITIES) o.add(`self:ability:${ab}:${a.abilities[ab]}`);
  }

  // ChoiceSet 해소: 제공된 choices 우선, 없으면 첫 선택지(default). flags.system.rulesSelections에 기록.
  function _resolveChoices(a, entry) {
    const doc = entry.doc;
    const rules = (doc.system && doc.system.rules) || [];
    const sel = {};
    for (const r of rules) {
      if (r.key !== 'ChoiceSet') continue;
      const flag = r.flag || 'choice';
      let val = entry.choices && entry.choices[flag] != null ? entry.choices[flag] : null;
      if (val == null && Array.isArray(r.choices) && r.choices.length && typeof r.choices[0] === 'object') {
        val = r.choices[0].value; // default = 첫 선택지
      }
      if (val != null) {
        sel[flag] = val;
        // ChoiceSet의 rollOption → "<rollOption>:<선택값>" 굴림옵션 등록 (선택 의존 predicate가 발동하도록)
        if (r.rollOption) a.rollOptions.add(`${r.rollOption}:${val}`);
      }
    }
    entry.rulesSelections = sel;
    return sel;
  }

  // FVTT 수식/브래킷 → 숫자. 숫자 실패 시 evalFormula(@actor.level 등) 시도.
  function _num(val, ctx) {
    if (typeof val === 'number') return val;
    const resolved = PF.resolveBrackets(val, ctx);
    let n = Number(resolved);
    if (!Number.isNaN(n) && resolved !== '' && resolved != null) return n;
    if (PF.evalFormula) { n = PF.evalFormula(val, ctx); if (!Number.isNaN(n)) return n; }
    return NaN;
  }

  // ---- 1-pass: roll-options, ChoiceSet, GrantItem(재귀), ActiveEffectLike, RollOption, Sense, BaseSpeed ----
  function _pass1(a) {
    const queue = a.items.slice();
    const seen = new Set();
    while (queue.length) {
      const entry = queue.shift();
      const doc = entry.doc; if (!doc) continue;
      const slug = (doc.system && doc.system.slug) || doc._id;
      if (seen.has(slug + ':' + JSON.stringify(entry.choices || {}))) continue;
      seen.add(slug + ':' + JSON.stringify(entry.choices || {}));
      a.rollOptions.add(`self:${doc.type}:${slug}`);
      const sel = _resolveChoices(a, entry);
      const ctx = { item: doc, rulesSelections: sel, actor: a };
      const rules = (doc.system && doc.system.rules) || [];
      for (const r of rules) {
        switch (r.key) {
          case 'RollOption': {
            // toggleable면 기본 off (사용자 토글). 아니면 on. predicate는 2-pass에서 평가하므로 여기선 무조건 등록 안 함 → 단순화: 비-toggleable + predicate 통과시 등록은 2-pass.
            if (!r.toggleable && (!r.predicate)) { if (r.option) a.rollOptions.add(PF.resolveBrackets(r.option, ctx)); }
            else { entry._deferredRollOptions = entry._deferredRollOptions || []; entry._deferredRollOptions.push({ r, ctx }); }
            break;
          }
          case 'GrantItem': {
            if (r.predicate && !PF.testPredicate(r.predicate, a.rollOptions)) break; // 조건부 부여 미충족
            const g = PF.getByUuid(r.uuid);
            if (g) { const ge = { doc: g, choices: {}, _granted: true, _grantedBy: slug }; a.items.push(ge); queue.push(ge); a.grantedItems.push(g.name_ko || g.name); a.grantedDocs.push(g); }
            else a._log.push(`GrantItem 미해소: ${r.uuid} (from ${doc.name})`);
            break;
          }
          case 'ActiveEffectLike':
            if (r.predicate && !PF.testPredicate(r.predicate, a.rollOptions)) break; // 선택/조건 미충족 시 미적용
            _applyAELike(a, r, ctx); break;
          case 'Sense':
            if (r.predicate && !PF.testPredicate(r.predicate, a.rollOptions)) break;
            if (r.selector) a.senses.add(r.selector); break;
          case 'BaseSpeed':
            if (r.predicate && !PF.testPredicate(r.predicate, a.rollOptions)) break;
            if (r.selector) { const v = _num(r.value, ctx) || 0; a.speeds[r.selector] = Math.max(a.speeds[r.selector] || 0, v); } break;
          case 'ChoiceSet': break; // 처리 완료
          default: break; // 2-pass 또는 미구현
        }
      }
    }
    // deferred RollOption 평가 (predicate가 다른 옵션에 의존 가능 → 1회 추가 평가)
    for (const entry of a.items) {
      for (const d of (entry._deferredRollOptions || [])) {
        const { r, ctx } = d;
        if (r.toggleable) continue; // 토글형은 기본 off
        if (!r.predicate || PF.testPredicate(r.predicate, a.rollOptions)) { if (r.option) a.rollOptions.add(PF.resolveBrackets(r.option, ctx)); }
      }
    }
  }

  function _applyAELike(a, r, ctx) {
    const path = r.path || ''; const mode = r.mode || 'add';
    const num = _num(r.value, ctx);
    const apply = (cur) => {
      if (mode === 'add') return cur + num;
      if (mode === 'subtract') return cur - num;
      if (mode === 'upgrade') return Math.max(cur, num);
      if (mode === 'downgrade') return Math.min(cur, num);
      if (mode === 'override') return num;
      if (mode === 'multiply') return cur * num;
      return cur;
    };
    // 능력치 경로 → 액터 abilities 직접 반영
    const mAb = path.match(/^system\.abilities\.(\w+)\.mod$/);
    if (mAb && ABILITIES.includes(mAb[1]) && !Number.isNaN(num)) {
      a.abilities[mAb[1]] = apply(a.abilities[mAb[1]] || 0);
      a.aeApplied.push(`${path} ${mode} ${num} → ${a.abilities[mAb[1]]}`);
    } else if (!Number.isNaN(num)) {
      // 비능력치 수치 경로(숙련 rank, 방어 등) → dataChanges에 누적 (소비자가 해석)
      const cur = (a.dataChanges[path] != null) ? a.dataChanges[path] : 0;
      a.dataChanges[path] = apply(cur);
      a.aeApplied.push(`${path} ${mode} ${num} → ${a.dataChanges[path]}`);
    } else {
      a.aeApplied.push(`(skip) ${path} ${mode} ${PF.resolveBrackets(r.value, ctx)}`);
    }
  }

  // ---- 2-pass: predicate 평가 후 FlatModifier/DamageDice/Note/Resistance/Weakness/Immunity/AdjustModifier 수집 ----
  function _pass2(a) {
    for (const entry of a.items) {
      const doc = entry.doc; if (!doc) continue;
      const ctx = { item: doc, rulesSelections: entry.rulesSelections || {}, actor: a };
      const rules = (doc.system && doc.system.rules) || [];
      const src = doc.name_ko || doc.name;
      for (const r of rules) {
        if (r.predicate && !PF.testPredicate(r.predicate, a.rollOptions)) continue;
        switch (r.key) {
          case 'FlatModifier': {
            const sels = Array.isArray(r.selector) ? r.selector : [r.selector];
            const val = _num(r.value, ctx);
            if (Number.isNaN(val)) { a._log.push(`FlatModifier 비수치 value: ${JSON.stringify(r.value)} (${src})`); break; }
            for (const s of sels) { if (!s) continue; (a.modifiers[s] = a.modifiers[s] || []).push({ type: r.type || 'untyped', value: val, slug: r.slug || null, source: src }); }
            break;
          }
          case 'DamageDice': {
            const s = r.selector; if (!s) break;
            (a.damageDice[s] = a.damageDice[s] || []).push({ diceNumber: r.diceNumber || 0, dieSize: r.dieSize || null, damageType: PF.resolveBrackets(r.damageType, ctx) || null, source: src });
            break;
          }
          case 'Note': {
            const s = r.selector; if (!s) break;
            (a.notes[s] = a.notes[s] || []).push({ outcome: r.outcome || null, text: PF.resolveBrackets(r.text, ctx), title: PF.resolveBrackets(r.title, ctx), source: src });
            break;
          }
          case 'Resistance': { const rv = _num(r.value, ctx); a.iwr.resistances.push({ type: PF.resolveBrackets(r.type, ctx), value: Number.isNaN(rv) ? r.value : rv, source: src }); break; }
          case 'Weakness': { const wv = _num(r.value, ctx); a.iwr.weaknesses.push({ type: PF.resolveBrackets(r.type, ctx), value: Number.isNaN(wv) ? r.value : wv, source: src }); break; }
          case 'Immunity': a.iwr.immunities.push({ type: PF.resolveBrackets(r.type, ctx), source: src }); break;
          case 'AdjustModifier': {
            // v1: 같은 selector + slug 매칭 수정치의 value를 mode대로 조정
            const s = r.selector; const pool = a.modifiers[s]; if (!pool) break;
            const delta = _num(r.value, ctx); if (Number.isNaN(delta)) break;
            for (const mod of pool) { if (!r.slug || mod.slug === r.slug) { if ((r.mode || 'add') === 'add') mod.value += delta; else if (r.mode === 'multiply') mod.value *= delta; else if (r.mode === 'override') mod.value = delta; } }
            break;
          }
          // 미구현(2차): ItemAlteration, Strike, Aura, BattleForm, TokenLight 등 → 로그
          default:
            if (['ItemAlteration', 'Strike', 'Aura', 'BattleForm', 'TokenLight', 'TokenMark', 'TokenEffectIcon',
              'MartialProficiency', 'CriticalSpecialization', 'AdjustStrike', 'AdjustDegreeOfSuccess', 'RollTwice',
              'ActorTraits', 'CreatureSize', 'FastHealing', 'TempHP', 'EphemeralEffect', 'DamageAlteration',
              'CraftingAbility', 'DexterityModifierCap', 'SubstituteRoll', 'MultipleAttackPenalty', 'SpecialStatistic',
              'SpecialResource', 'LoseHitPoints'].includes(r.key))
              a._log.push(`미구현 RE: ${r.key} (${src})`);
            break;
        }
      }
    }
  }

  // ---- PF2e 스태킹: 동일 type 보너스=최고, 페널티=최저, untyped=전부 합산 ----
  function getStatistic(a, selector, extraOptions) {
    const pool = (a.modifiers[selector] || []).slice();
    if (extraOptions) { /* 향후: 옵션 의존 수정치 재평가 자리 */ }
    const applied = [];
    // 타입별 그룹
    const byType = {};
    for (const m of pool) (byType[m.type] = byType[m.type] || []).push(m);
    let total = 0;
    for (const type of Object.keys(byType)) {
      const mods = byType[type];
      if (type === 'untyped') { for (const m of mods) { total += m.value; applied.push(m); } continue; }
      // 보너스 최고 1개, 페널티 최저 1개
      let bestBonus = null, worstPen = null;
      for (const m of mods) {
        if (m.value >= 0) { if (!bestBonus || m.value > bestBonus.value) bestBonus = m; }
        else { if (!worstPen || m.value < worstPen.value) worstPen = m; }
      }
      if (bestBonus) { total += bestBonus.value; applied.push(bestBonus); }
      if (worstPen) { total += worstPen.value; applied.push(worstPen); }
    }
    return { selector, total, applied, all: pool };
  }

  // ---- 전체 파이프라인 ----
  function build(input) {
    const a = createActor(input);
    _seedRollOptions(a);
    _pass1(a);
    _pass2(a);
    return a;
  }

  const API = { createActor, build, getStatistic, ABILITIES, MOD_TYPES };
  root.REEngine = API;
  if (isNode && typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
