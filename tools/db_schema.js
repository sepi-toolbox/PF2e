// ═══════════════════════════════════════════════
//  DB SCHEMA — 모든 DB 변수의 메타데이터
//  export/import 스크립트가 공유하는 정의
// ═══════════════════════════════════════════════

// 각 엔트리:
//   sheet     — Excel 시트명 (31자 제한)
//   var       — JS 변수명
//   file      — 소속 JS 파일 (dev/ 기준 상대)
//   keyword   — 선언 키워드 (const/let/var)
//   shape     — 'array' (배열의 객체들), 'kv-json' (객체 키→임의값, JSON 직렬화), 'kv-rows' (객체 키→객체, 행으로 펼침)

const DB_DEFS = [
  // cs_data.js
  { sheet:'CLASSES',           var:'CLASSES',           file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'SUBCLASS_DB',       var:'SUBCLASS_DB',       file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'ANCESTRIES',        var:'ANCESTRIES',        file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'BACKGROUNDS',       var:'BACKGROUNDS',       file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'HERITAGE_DB',       var:'HERITAGE_DB',       file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'LANGUAGES',         var:'LANGUAGES',         file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'VISION_DEFS',       var:'VISION_DEFS',       file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'SKILLS',            var:'SKILLS',            file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'CONDITIONS_DATA',   var:'CONDITIONS_DATA',   file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'ACTION_DB',         var:'ACTION_DB',         file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'TRAIT_DB',          var:'TRAIT_DB',          file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'PREREQ_GROUPS',     var:'PREREQ_GROUPS',     file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'EFFECT_GROUPS',     var:'EFFECT_GROUPS',     file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'CHOICE_OPTIONS',    var:'CHOICE_OPTIONS',    file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'ANCESTRY_NAME_MAP', var:'ANCESTRY_NAME_MAP', file:'cs_data.js', keyword:'const', shape:'kv-json' },
  { sheet:'SKILL_NAME_MAP',    var:'SKILL_NAME_MAP',    file:'cs_data.js', keyword:'const', shape:'kv-json' },
  { sheet:'CONDITIONS',        var:'CONDITIONS',        file:'cs_data.js', keyword:'const', shape:'array' },
  { sheet:'PROF_RANKS',        var:'PROF_RANKS',        file:'cs_data.js', keyword:'const', shape:'kv-json' },

  // class_features_db.js
  { sheet:'DEITY_DB',           var:'DEITY_DB',           file:'class_features_db.js', keyword:'var', shape:'array' },
  { sheet:'CLASS_PROF_TABLE',   var:'CLASS_PROF_TABLE',   file:'class_features_db.js', keyword:'var', shape:'kv-json' },
  // CLASS_FEATURE_NAMES: v529부터 FEAT_DB.category='feature' + acquisition='auto' + source=class_id 행에서 IIFE로 파생.
  //   Excel 편집 대상 아님 — FEAT_DB 시트에서 편집해야 함.
  { sheet:'CLASS_AUTO_FEATS',   var:'CLASS_AUTO_FEATS',   file:'class_features_db.js', keyword:'var', shape:'kv-json' },
  { sheet:'CLASS_AUTO_SPELLS',  var:'CLASS_AUTO_SPELLS',  file:'class_features_db.js', keyword:'var', shape:'kv-json' },
  { sheet:'DOMAIN_DB',          var:'DOMAIN_DB',          file:'class_features_db.js', keyword:'var', shape:'kv-json' },
  { sheet:'PATRON_TRADITION',   var:'PATRON_TRADITION',   file:'class_features_db.js', keyword:'var', shape:'kv-json' },
  { sheet:'DIVINE_FONT_SLOTS',  var:'DIVINE_FONT_SLOTS',  file:'class_features_db.js', keyword:'var', shape:'kv-json' },
  { sheet:'CLASS_SPELL_TABLE',  var:'CLASS_SPELL_TABLE',  file:'class_features_db.js', keyword:'var', shape:'kv-json' },

  // feat_db.js
  { sheet:'FEAT_DB', var:'FEAT_DB', file:'feat_db.js', keyword:'var', shape:'array' },

  // SPELL_DB.js
  { sheet:'SPELL_DB', var:'SPELL_DB', file:'SPELL_DB.js', keyword:'const', shape:'array' },

  // equipment_db.js
  { sheet:'WEAPON_DB', var:'WEAPON_DB', file:'equipment_db.js', keyword:'const', shape:'array' },
  { sheet:'ARMOR_DB',  var:'ARMOR_DB',  file:'equipment_db.js', keyword:'const', shape:'array' },
  { sheet:'SHIELD_DB', var:'SHIELD_DB', file:'equipment_db.js', keyword:'const', shape:'array' },
  { sheet:'GEAR_DB',   var:'GEAR_DB',   file:'equipment_db.js', keyword:'const', shape:'array' },
  { sheet:'RUNE_DB',   var:'RUNE_DB',   file:'equipment_db.js', keyword:'const', shape:'array' },

  // cs_feat_effects.js
  { sheet:'FEAT_EFFECTS', var:'FEAT_EFFECTS', file:'cs_feat_effects.js', keyword:'const', shape:'kv-json' },
];

module.exports = { DB_DEFS };
