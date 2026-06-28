/* context_adapter.js — 빌더 state → FVTT 캐릭터 시트 템플릿 컨텍스트
 * FVTT character.hbs/sidebar.hbs/header.hbs 가 기대하는 prepared-data shape으로 매핑.
 * M0(빈 캐릭터)에서도 안전하게 렌더되도록 모든 필드에 기본값.
 * M1: PF2eActor.deriveStats() 결과를 끌어와 사이드바/능력치 채움(엔진 로드 시).
 */
(function (root) {
  "use strict";

  const ABILITIES = [
    { slug: "str", label: "PF2E.AbilityStr" },
    { slug: "dex", label: "PF2E.AbilityDex" },
    { slug: "con", label: "PF2E.AbilityCon" },
    { slug: "int", label: "PF2E.AbilityInt" },
    { slug: "wis", label: "PF2E.AbilityWis" },
    { slug: "cha", label: "PF2E.AbilityCha" },
  ];
  const SAVES = [
    { slug: "fortitude", label: "PF2E.SavesFortitude" },
    { slug: "reflex", label: "PF2E.SavesReflex" },
    { slug: "will", label: "PF2E.SavesWill" },
  ];
  const ACTOR_SIZES = {
    tiny: "PF2E.ActorSizeTiny", sm: "PF2E.ActorSizeSmall", med: "PF2E.ActorSizeMedium",
    lg: "PF2E.ActorSizeLarge", huge: "PF2E.ActorSizeHuge", grg: "PF2E.ActorSizeGargantuan",
  };
  const NUMBER_TO_RANK = {
    0: "PF2E.ProficiencyLevel0", 1: "PF2E.ProficiencyLevel1", 2: "PF2E.ProficiencyLevel2",
    3: "PF2E.ProficiencyLevel3", 4: "PF2E.ProficiencyLevel4",
  };
  const DEFAULT_IMG = "../data/fvtt-assets/icons/svg/cowled.svg";
  const abMod = (score) => Math.floor(((Number(score) || 10) - 10) / 2);

  function blankState() {
    return {
      name: "플레이어 캐릭터", img: null, level: 1, xp: 0,
      heroPoints: 1,
      abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      ancestry: null, heritage: null, background: null, class: null, deity: null,
      keyability: null, size: "med",
      details: { gender: "", age: "", ethnicity: "", nationality: "", languagesDetails: "" },
      languages: [],
    };
  }

  function tryDerive(state) {
    try {
      if (root.PF2eActor && typeof root.PF2eActor.deriveStats === "function" && state.class) {
        const mods = {}; for (const a of ABILITIES) mods[a.slug] = abMod(state.abilities[a.slug]);
        return root.PF2eActor.deriveStats(state, { level: state.level, abilityMods: mods });
      }
    } catch (e) { console.warn("[builder] deriveStats 실패, base 폴백:", e); }
    return null;
  }

  function buildContext(state) {
    state = state || blankState();
    const lvl = Number(state.level) || 1;
    const derived = tryDerive(state);
    const get = (k, base) => (derived && derived[k] && typeof derived[k].total === "number" ? derived[k].total : base);

    const abilities = {};
    for (const a of ABILITIES) {
      const mod = abMod(state.abilities[a.slug]);
      abilities[a.slug] = { slug: a.slug, label: a.label, shortLabel: a.label, mod };
    }
    const saves = {};
    for (const s of SAVES) {
      const d = derived && derived[s.slug];
      saves[s.slug] = { slug: s.slug, label: s.label, rank: d ? d.rank : 0, totalModifier: d ? d.total : 0 };
    }
    let hpMax = state._hpMax != null ? state._hpMax : 0;

    const speeds = [
      { label: "PF2E.Actor.Speed.Type.Land", value: state._landSpeed != null ? state._landSpeed : 25, breakdown: "", icon: '<i class="fa-solid fa-person-running"></i>' },
      { label: "PF2E.Actor.Speed.Type.Swim", value: null, action: "swim" },
      { label: "PF2E.Actor.Speed.Type.Climb", value: null, action: "climb" },
      { label: "PF2E.Actor.Speed.Type.Fly", value: null },
      { label: "PF2E.Actor.Speed.Type.Burrow", value: null },
    ];

    const detailItem = (item) => (item ? { id: item.id || "", name: item.name || item.name_ko || "", img: item.img || DEFAULT_IMG } : null);

    return {
      cssClass: "editable",
      editable: true,
      options: { id: "builder" },
      actor: {
        name: state.name || "플레이어 캐릭터",
        img: state.img || DEFAULT_IMG,
        keyAttribute: state.keyability || null,
      },
      data: {
        details: {
          level: { value: lvl },
          xp: { value: Number(state.xp) || 0, max: 1000, pct: Math.min(100, ((Number(state.xp) || 0) / 1000) * 100) },
          keyability: { value: state.keyability || null },
          gender: { value: state.details.gender || "" },
          age: { value: state.details.age || "" },
          ethnicity: { value: state.details.ethnicity || "" },
          nationality: { value: state.details.nationality || "" },
          languages: { details: state.details.languagesDetails || "" },
        },
        attributes: {
          hp: { value: hpMax, max: hpMax, temp: 0, unrecoverable: 0 },
          dying: { value: 0, max: 4 },
          wounded: { value: 0 },
          doomed: { value: 0 },
          ac: { value: get("ac", 10) },
          shield: { hp: { max: 0, value: 0 }, ac: 0, hardness: 0, brokenThreshold: 0, broken: false, destroyed: false },
          immunities: [], weaknesses: [], resistances: [],
        },
        perception: { value: get("perception", 0), rank: derived && derived.perception ? derived.perception.rank : 0 },
        initiative: { totalModifier: get("perception", 0), statistic: "perception", label: "PF2E.InitiativeLabel" },
        saves,
        abilities,
        traits: { size: { value: state.size || "med" } },
        build: { languages: { value: (state.languages || []).length, max: (state.languages || []).length }, attributes: { apex: null } },
      },
      ancestry: detailItem(state.ancestry),
      heritage: detailItem(state.heritage),
      background: detailItem(state.background),
      class: detailItem(state.class),
      deity: detailItem(state.deity),
      headerResource: { slug: "hero-points", value: Number(state.heroPoints) || 0, max: 3, label: "PF2E.Actor.Resource.HeroPoints", icon: "fa-circle" },
      numberToRank: NUMBER_TO_RANK,
      actorSizes: ACTOR_SIZES,
      senses: [],
      traits: [],
      languages: (state.languages || []).map((l) => ({ slug: l.slug || l, label: l.label || l, overLimit: false })),
      speeds,
      initiativeOptions: { perception: "PF2E.PerceptionLabel" },
      apexAttributeOptions: [],
      attributeBoostsAllocated: true,
      tabVisibility: {
        character: true, actions: true, inventory: true, spellcasting: true, crafting: true,
        proficiencies: true, feats: true, effects: true, biography: true, pfs: true,
      },
      specialResources: null,
      hasStamina: false,
      dying: { remainingWounded: 3, remainingDying: 4, maxed: false },
      isProficiencyLocked: false,
    };
  }

  root.BuilderContext = { buildContext, blankState };
})(window);
