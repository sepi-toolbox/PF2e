/* context_adapter.js — 빌더 state → FVTT 캐릭터 시트 템플릿 컨텍스트
 * FVTT character.hbs/sidebar.hbs/header.hbs 가 기대하는 prepared-data shape으로 매핑.
 * M0: 빈 캐릭터 안전 렌더. M1: PF2eData(클래스/혈통 BASE) + PF2eActor.deriveStats 로 실값.
 * deriveStats 전제: 호출 전에 PF2eData.loadCategory('classes','ancestries',...) 완료 + CLASS_PROF_TABLE 로드.
 */
(function (root) {
  "use strict";

  const ABILITIES = [
    { slug: "str", label: "PF2E.AbilityStr" }, { slug: "dex", label: "PF2E.AbilityDex" },
    { slug: "con", label: "PF2E.AbilityCon" }, { slug: "int", label: "PF2E.AbilityInt" },
    { slug: "wis", label: "PF2E.AbilityWis" }, { slug: "cha", label: "PF2E.AbilityCha" },
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
  // 기술 → 핵심 능력치 표준 매핑 (lore 제외 16종)
  const SKILL_ABILITY = {
    acrobatics: "dex", arcana: "int", athletics: "str", crafting: "int", deception: "cha",
    diplomacy: "cha", intimidation: "cha", medicine: "wis", nature: "wis", occultism: "int",
    performance: "cha", religion: "wis", society: "int", stealth: "dex", survival: "wis", thievery: "dex",
  };
  const DEFAULT_IMG = "../data/fvtt-assets/icons/svg/cowled.svg";
  const abMod = (score) => Math.floor(((Number(score) || 10) - 10) / 2);
  const PF = () => root.PF2eData;

  function blankState() {
    return {
      name: "플레이어 캐릭터", img: null, level: 1, xp: 0, heroPoints: 1,
      abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
      ancestry: null, heritage: null, background: null, class: null, deity: null,
      keyability: null, size: "med",
      details: { gender: "", age: "", ethnicity: "", nationality: "", languagesDetails: "" },
      languages: [],
    };
  }

  // M1 데모용 샘플: 드워프 파이터 Lv5
  function sampleState() {
    return {
      name: "두린 아이언포지", img: null, level: 5, xp: 320, heroPoints: 1,
      abilities: { str: 18, dex: 12, con: 16, int: 10, wis: 14, cha: 8 },
      ancestry: { slug: "dwarf" }, heritage: { slug: "ancient-blooded-dwarf" },
      background: { slug: "warrior" }, class: { slug: "fighter" }, deity: { slug: "torag" },
      keyability: "str", size: "med",
      details: { gender: "남성 / 그", age: "75", ethnicity: "두라간", nationality: "" },
      languages: [{ slug: "common", label: "공용어" }, { slug: "dwarven", label: "드워프어" }],
    };
  }

  // 클래스 BASE 에서 빌드 정보 추출 (keyAttr, hp/lvl, trained skills)
  function classInfo(slug) {
    const doc = slug && PF() && PF().get("classes", slug);
    if (!doc) return null;
    const sys = doc.system || {};
    const keyAttr = (sys.keyAbility && sys.keyAbility.value && sys.keyAbility.value[0]) || "str";
    const trained = (sys.trainedSkills && sys.trainedSkills.value) || [];
    return { doc, keyAttr, hpPerLevel: sys.hp || 8, trainedSkills: trained, name: PF().nameKo(doc) };
  }
  function ancestryInfo(slug) {
    const doc = slug && PF() && PF().get("ancestries", slug);
    if (!doc) return null;
    const sys = doc.system || {};
    return { doc, hp: sys.hp || 0, speed: sys.speed || 25, size: sys.size || "med", name: PF().nameKo(doc) };
  }

  function tryDerive(state, ab) {
    try {
      if (!(root.PF2eActor && typeof root.PF2eActor.deriveStats === "function" && state.class)) return null;
      const cls = state.class.slug || state.class.id;
      const ci = classInfo(cls);
      const keyAttr = state.keyability || (ci && ci.keyAttr) || "str";
      // 기술 기여: 클래스 훈련 기술 → 숙련(contrib 2). (배경/INT 추가는 M2에서.)
      const skillContribs = {}; const skillAbility = {};
      if (ci) for (const sk of ci.trainedSkills) { if (SKILL_ABILITY[sk]) { skillContribs[sk] = 2; skillAbility[sk] = SKILL_ABILITY[sk]; } }
      return root.PF2eActor.deriveStats(state, {
        level: state.level, abilityMods: ab, classSlug: cls, keyAttr,
        ancestrySlug: state.ancestry && (state.ancestry.slug || state.ancestry.id),
        armorSlot: "armor-unarmored", skillContribs, skillAbility,
      });
    } catch (e) { console.warn("[builder] deriveStats 실패, base 폴백:", e); return null; }
  }

  function buildContext(state) {
    state = state || blankState();
    const lvl = Number(state.level) || 1;
    const ab = {}; for (const a of ABILITIES) ab[a.slug] = abMod(state.abilities[a.slug]);
    const derived = tryDerive(state, ab);
    const get = (k, base) => (derived && derived[k] && typeof derived[k].total === "number" ? derived[k].total : base);

    const abilities = {};
    for (const a of ABILITIES) abilities[a.slug] = { slug: a.slug, label: a.label, shortLabel: a.label, mod: ab[a.slug] };

    const saves = {};
    for (const s of SAVES) {
      const d = derived && derived[s.slug];
      saves[s.slug] = { slug: s.slug, label: s.label, rank: d ? d.rank : 0, totalModifier: d ? d.total : 0 };
    }

    // HP / 속도 (혈통+클래스 BASE)
    const ci = state.class ? classInfo(state.class.slug || state.class.id) : null;
    const ai = state.ancestry ? ancestryInfo(state.ancestry.slug || state.ancestry.id) : null;
    let hpMax = 0;
    if (ci || ai) hpMax = (ai ? ai.hp : 0) + ((ci ? ci.hpPerLevel : 0) + ab.con) * lvl;
    const landSpeed = ai ? ai.speed : 25;
    const size = (ai && ai.size) || state.size || "med";

    const speeds = [
      { label: "PF2E.Actor.Speed.Type.Land", value: landSpeed, breakdown: "", icon: '<i class="fa-solid fa-person-running"></i>' },
      { label: "PF2E.Actor.Speed.Type.Swim", value: null, action: "swim" },
      { label: "PF2E.Actor.Speed.Type.Climb", value: null, action: "climb" },
      { label: "PF2E.Actor.Speed.Type.Fly", value: null },
      { label: "PF2E.Actor.Speed.Type.Burrow", value: null },
    ];

    // ABC 표시 (BASE 한글명 해소)
    const resolveAbc = (cat, sel) => {
      if (!sel) return null;
      const slug = sel.slug || sel.id;
      const doc = PF() && PF().get(cat, slug);
      return { id: slug, name: (doc && PF().nameKo(doc)) || sel.name || slug, img: sel.img || DEFAULT_IMG };
    };

    return {
      cssClass: "editable", editable: true, options: { id: "builder" },
      actor: { name: state.name || "플레이어 캐릭터", img: state.img || DEFAULT_IMG, keyAttribute: state.keyability || null },
      data: {
        details: {
          level: { value: lvl },
          xp: { value: Number(state.xp) || 0, max: 1000, pct: Math.min(100, ((Number(state.xp) || 0) / 1000) * 100) },
          keyability: { value: state.keyability || (ci && ci.keyAttr) || null },
          gender: { value: state.details.gender || "" }, age: { value: state.details.age || "" },
          ethnicity: { value: state.details.ethnicity || "" }, nationality: { value: state.details.nationality || "" },
          languages: { details: state.details.languagesDetails || "" },
        },
        attributes: {
          hp: { value: hpMax, max: hpMax, temp: 0, unrecoverable: 0 },
          dying: { value: 0, max: 4 }, wounded: { value: 0 }, doomed: { value: 0 },
          ac: { value: get("ac", 10) },
          shield: { hp: { max: 0, value: 0 }, ac: 0, hardness: 0, brokenThreshold: 0, broken: false, destroyed: false },
          immunities: [], weaknesses: [], resistances: [],
        },
        perception: { value: get("perception", 0), rank: derived && derived.perception ? derived.perception.rank : 0 },
        initiative: { totalModifier: get("perception", 0), statistic: "perception", label: "PF2E.InitiativeLabel" },
        saves, abilities,
        traits: { size: { value: size } },
        build: { languages: { value: (state.languages || []).length, max: (state.languages || []).length }, attributes: { apex: null } },
      },
      ancestry: resolveAbc("ancestries", state.ancestry),
      heritage: resolveAbc("heritages", state.heritage),
      background: resolveAbc("backgrounds", state.background),
      class: resolveAbc("classes", state.class),
      deity: resolveAbc("deities", state.deity),
      headerResource: { slug: "hero-points", value: Number(state.heroPoints) || 0, max: 3, label: "PF2E.Actor.Resource.HeroPoints", icon: "fa-circle" },
      numberToRank: NUMBER_TO_RANK, actorSizes: ACTOR_SIZES,
      senses: [], traits: [],
      languages: (state.languages || []).map((l) => ({ slug: l.slug || l, label: l.label || l, overLimit: false })),
      speeds, initiativeOptions: { perception: "PF2E.PerceptionLabel" },
      apexAttributeOptions: [], attributeBoostsAllocated: true,
      tabVisibility: { character: true, actions: true, inventory: true, spellcasting: true, crafting: true, proficiencies: true, feats: true, effects: true, biography: true, pfs: true },
      specialResources: null, hasStamina: false,
      dying: { remainingWounded: 3, remainingDying: 4, maxed: false }, isProficiencyLocked: false,
      _derived: derived,
    };
  }

  root.BuilderContext = { buildContext, blankState, sampleState };
})(window);
