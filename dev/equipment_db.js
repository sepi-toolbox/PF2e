// Pathfinder 2e — 룬 & 부착 큐레이션 DB
// 무기/방어구/방패/장비 카탈로그는 FVTT 단일 소스(PF2eEquip)로 이관됨.
// 룬 부착 시스템(attachTo/runeType/runeValue)은 FVTT 컴펜디움 미인코딩 → 큐레이션 유지.


// ═══════════════════════════════════
//  RUNE & ATTACHMENT DATABASE
// ═══════════════════════════════════
// RUNE_DB 폐기 → 룬 효과는 효과 자동화 테이블(curated_effects→effects_db), 룬 아이템은 store.
// 런타임 룬 카탈로그 = cs_calc.getRuneCatalog()(store⊕효과 매칭).

