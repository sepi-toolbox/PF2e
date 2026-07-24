#!/usr/bin/env node
/* build_subclasses.mjs — 서브클래스 단일소스 테이블 = data/derived/subclasses.json (런타임 SUBCLASS_DB가 이걸 로드)
 *  런타임 조립을 그대로 구움(parity by construction):
 *    ① 큐레이션 6클래스(subclasses_curated.json = bard/druid/ranger/rogue/witch/wizard, PC1 리치데이터)
 *    ② FVTT 파생(cs_pf2e_class.subclassList: 신규 클래스, granted_feats/spells·desc)
 *    ③ 클레릭 교의(cleric_doctrines.json 큐레이션, prof_changes/features)
 *  = PF2eClass.init()이 _mergeIntoGlobals + loadDoctrines로 조립하는 결과 전량.
 *  desc는 enrichDesc 결과(런타임 SUBCLASS_DB와 동일). 표시용 별칭 slug/class/grants/rules_n 부가.
 *  실행: cd dev && node tools/derive/build_subclasses.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEV = path.resolve(__dirname, '..', '..');

// ① 큐레이션 6클래스를 전역 SUBCLASS_DB 초기값으로(하니스: 브라우저 전역을 globalThis로 모사)
const curated = JSON.parse(fs.readFileSync(path.join(DEV, 'data/derived/subclasses_curated.json'), 'utf8')).rows;
globalThis.SUBCLASS_DB = curated.map(x => ({ ...x }));
globalThis.CLASS_FEATURE_NAMES = {};
globalThis.CLASS_SPELL_TABLE = {};

// ②③ PF2eClass.init → _mergeIntoGlobals(FVTT 서브클래스) + loadDoctrines(cleric) 가 globalThis.SUBCLASS_DB에 병합
const PFClass = await import(path.join(DEV, 'cs_pf2e_class.js'));
await PFClass.default.init();
const SD = globalThis.SUBCLASS_DB;

// 위저드 비전 학파 = 큐레이션 stub의 한 줄 desc 대신 정본 FVTT 특성(school-of-*)의 완전한 _desc_ko(@link 교육과정·학파주문 포함)로 교체.
//   소서러 혈통·오라클 신비처럼 정본 설명·링크가 나오도록. 매핑=wizard_schools.json feature_slug. (구조 필드 granted_spells/prof는 큐레이션 유지)
{
  const PF = (await import(path.join(DEV, 'cs_pf2e.js'))).default;
  PF.loadCategorySync('feats'); PF.loadCategorySync('spells');
  const ws = JSON.parse(fs.readFileSync(path.join(DEV, 'data/derived/wizard_schools.json'), 'utf8'));
  const wsRows = Array.isArray(ws) ? ws : (ws.rows || Object.values(ws));
  const featBySlug = {};
  for (const f of PF.all('feats')) { const s = f.system && f.system.slug; if (s) featBySlug[s] = f; }
  let patched = 0;
  for (const s of SD) {
    if (s.class_id !== 'wizard') continue;
    const meta = wsRows.find(w => w.slug === s.id || w.feature_slug === s.id);
    const feat = meta && featBySlug[meta.feature_slug];
    if (!feat) continue;
    const nameKo = PF.nameKo(feat), nameEn = feat.name || feat.name_en || s.name_en;
    s.desc = PF.enrichDesc(PF.descKo(feat) || '');   // 서브클래스 설명 = 서브클래스 데이터(s.desc). 정본 학파 특성 desc를 소스로(혈통·신비와 동일).
    s.name_en = nameEn;                               // 「Ars Grammatica」 stub → 「School of Ars Grammatica」
    // ⚠ 학파 자신(school-of-*)을 features(클래스 특성)로 넣지 않음 — 서브클래스 설명이 성장표에 클래스특성으로
    //   중복 분류되던 문제. 혈통이 자신 대신 혈통마법(blood-magic-*)을 feature로 두는 것과 동일. 학파는 별도
    //   패시브 특성이 없어 빈 배열. 학파 효과(학파주문=granted_spells, 교육과정=curriculum)는 아래 필드가 소유.
    s.features = [];
    // 교육과정(curriculum) = 서브클래스 성장 데이터에 실음(대원칙 0) → 런타임이 subclass.curriculum을 직접 읽어
    //   주문서 편입·보너스 슬롯 적용(클래스 하드코딩 없이 데이터 구동). 학파주문(school_spell)도 참조용으로 부착.
    if (meta.curriculum) s.curriculum = meta.curriculum;
    if (meta.school_spell) s.school_spell = meta.school_spell;
    patched++;
  }
  console.log(`  위저드 학파 정본 desc/feature 주입: ${patched}종`);

  // 바드 뮤즈 = 큐레이션 stub → 정본 FVTT 특성(enigma/maestro/polymath/warrior)의 완전 _desc_ko(@link 뮤즈재주·뮤즈주문)로 교체.
  //   위저드 학파·소서러 혈통과 동일: 설명은 서브클래스 데이터(s.desc). 뮤즈 재주/주문은 granted_feats/granted_spells 소유
  //   → features(클래스 특성)엔 뮤즈 자신·부여물 넣지 않음(빈 배열). 매핑=muse-<x> → FVTT slug <x>.
  let musePatched = 0;
  for (const s of SD) {
    if (s.class_id !== 'bard') continue;
    const fslug = String(s.id).replace(/^muse-/, '');   // muse-enigma → enigma
    const feat = featBySlug[fslug];
    if (!feat) continue;
    s.desc = PF.enrichDesc(PF.descKo(feat) || '');
    s.name_en = feat.name || feat.name_en || s.name_en;
    s.features = [];   // 뮤즈 자신/부여 재주는 features가 아님(granted_* 소유)
    musePatched++;
  }
  console.log(`  바드 뮤즈 정본 desc 주입: ${musePatched}종`);

  // 마녀 후원자 = 실제 Player Core 7후원자(subclasses_curated 재구성). 큐레이션 필드(flavor·전통·기술·교훈·사역마)로
  //   rich desc 조립: 소개 + 전통 + 후원자 기술 + 교훈(주술 캔트립 @link + 사역마 습득 주문 @link) + 사역마 능력(카드는 features).
  const TRAD_KO = { arcane: '비전', divine: '신성', occult: '오컬트', primal: '원시' };
  const SKILL_KO = { religion: '종교학', arcana: '주문학', occultism: '오컬티즘', nature: '자연학', society: '사회학', crafting: '제작', medicine: '의학', deception: '기만', intimidation: '위협', athletics: '운동', diplomacy: '외교', acrobatics: '곡예' };
  let patronPatched = 0;
  for (const s of SD) {
    if (s.class_id !== 'witch') continue;
    const tradKo = TRAD_KO[s.tradition] || s.tradition || '';
    const skillKo = SKILL_KO[s.patron_skill_slug] || s.patron_skill_slug || '';
    const hex = (s.granted_spells || []).find(g => g.type === 'focus');
    const fam = (s.granted_spells || []).find(g => g.type === 'known');
    let d = '';
    if (s.flavor) d += `<p><em>${s.flavor}</em></p>`;
    if (tradKo) d += `<p><strong>전통</strong> ${tradKo}</p>`;
    if (skillKo) d += `<p><strong>후원자 기술</strong> ${skillKo}</p>`;
    const lessonParts = [];
    if (hex) lessonParts.push(`@link[spells.${hex.spell_id}] 주술 캔트립을 얻고`);
    if (fam) lessonParts.push(`사역마가 @link[spells.${fam.spell_id}] 주문을 배웁니다`);
    else if (Array.isArray(s.familiar_spell_choice)) lessonParts.push(`사역마가 ${s.familiar_spell_choice.map(x => `@link[spells.${x}] 주문`).join(' 또는 ')} 중 하나를 배웁니다`);
    if (lessonParts.length) d += `<p><strong>교훈</strong> ${s.lesson_ko ? s.lesson_ko + ' — ' : ''}${lessonParts.join(', ')}.</p>`;
    // 사역마 고유 능력 = 이름 + 실제 효과 설명을 desc에 자기완결적으로(이름만 두면 "저게 뭐냐" — 사용자 지적).
    if (s.features && s.features[0] && s.features[0].name_ko) {
      const famName = s.features[0].name_ko, famDesc = String(s.features[0].desc || '').replace(/^\s*<p>|<\/p>\s*$/g, '').trim();
      d += `<p><strong>사역마 능력</strong> ${famName}${famDesc ? ' — ' + famDesc : ''}</p>`;
      // 후원자 고정 사역마 능력 = grant_familiar(성장표) 소스. 펫(사역마)이 이 이름/설명을 그대로 표시하도록
      //   slug(=식별, 실 엔티티 참조) + 큐레이트 name/desc(=서브클래스 설명과 동일 텍스트, 단일소스)를 함께 실음.
      const _fslug = (typeof s.granted_familiar === 'string') ? s.granted_familiar : (s.granted_familiar && s.granted_familiar.slug);
      if (_fslug) s.granted_familiar = { slug: _fslug, name: famName, desc: famDesc };
    }
    s.desc = PF.enrichDesc(d);
    // 후원자가 주는 것(전통·기술·교훈·사역마 능력)을 desc 한 곳에 모음 → 클래스 특성 카드로 중복 표시 안 함(features 비움).
    //   familiar 데이터는 위 desc에 이미 소비됨. 성장표 특성 칸도 비어 자기참조/중복 없음.
    s.features = [];
    patronPatched++;
  }
  console.log(`  마녀 후원자 desc(정본 7후원자 조립) 주입: ${patronPatched}종`);

  // 드루이드 교단 = Player Core 정본 4교단(subclasses_curated 구조화). 큐레이션 필드(flavor·anathema)+부여(granted_*)로
  //   rich desc 조립: 소개 + 교단 기술 + 교단 주문(집중 @link) + 교단 재주(1레벨 보너스 @link) + 금기.
  //   마녀 후원자와 동일 패턴 — 부여는 granted_skills/feats/spells 소유, features(클래스 특성)는 비움.
  let orderPatched = 0;
  for (const s of SD) {
    if (s.class_id !== 'druid') continue;
    const skillSlug = (s.granted_skills || [])[0];
    const skillKo = SKILL_KO[skillSlug] || skillSlug || '';
    const focus = (s.granted_spells || []).find(g => g.type === 'focus');
    const feat = (s.granted_feats || [])[0];
    let d = '';
    if (s.flavor) d += `<p><em>${s.flavor}</em></p>`;
    if (skillKo) d += `<p><strong>교단 기술</strong> ${skillKo}</p>`;
    if (focus) d += `<p><strong>교단 주문</strong> @link[spells.${focus.spell_id}] (집중 주문, 1레벨 자동 습득)</p>`;
    if (feat) d += `<p><strong>교단 재주</strong> @link[feats.${feat}] (1레벨 보너스 드루이드 재주)</p>`;
    if (s.anathema) d += `<p><strong>금기</strong> ${s.anathema}</p>`;
    s.desc = PF.enrichDesc(d);
    s.features = [];   // 교단 부여(기술·주문·재주)는 desc·granted_*가 소유 → 클래스 특성 카드 중복 표시 안 함.
    orderPatched++;
  }
  console.log(`  드루이드 교단 desc(정본 4교단 조립) 주입: ${orderPatched}종`);

  // 레인저 사냥 방식(Hunter's Edge) = Player Core 정본 3방식(subclasses_curated 구조화). 큐레이션 필드(flavor·edge_benefit·edge_masterful)로
  //   rich desc 조립: 소개 + 사냥 방식 효과(1레벨) + 노련한 사냥꾼(17레벨 강화). 레인저는 주문 없음 → 순수 기계효과(부여 @link 없음).
  //   교단·후원자와 동일 패턴 — features(클래스 특성)는 desc가 소유하므로 비움(중복 카드 방지).
  let edgePatched = 0;
  for (const s of SD) {
    if (s.class_id !== 'ranger') continue;
    let d = '';
    if (s.flavor) d += `<p><em>${s.flavor}</em></p>`;
    if (s.edge_benefit) d += `<p><strong>사냥 방식 효과</strong> ${s.edge_benefit}</p>`;
    if (s.edge_masterful) d += `<p><strong>노련한 사냥꾼 (17레벨)</strong> ${s.edge_masterful}</p>`;
    s.desc = PF.enrichDesc(d);
    s.features = [];   // 사냥 방식 효과는 desc가 소유 → 클래스 특성 카드 중복 표시 안 함.
    edgePatched++;
  }
  console.log(`  레인저 사냥 방식 desc(정본 3방식 조립) 주입: ${edgePatched}종`);

  // 로그 수법(Rogue's Racket) = Player Core 정본 4수법(subclasses_curated 구조화). 큐레이션 필드(flavor·racket_benefit·racket_skill·key_attr)로
  //   rich desc 조립: 소개 + 수법 효과 + 수법 기술 + 핵심 능력치 선택(일부). 수법은 은밀 공격과 결합(주문 부여 없음).
  //   교단·사냥 방식과 동일 패턴 — features(클래스 특성)는 desc가 소유하므로 비움. (subclass_type=수법. Rogue's Racket=「로그의 수법」 store 번역과 통일.)
  const _ATTR_KO = { str: '근력', dex: '민첩', con: '건강', int: '지능', wis: '지혜', cha: '매력' };
  const _eul = w => { const c = String(w).charCodeAt(String(w).length - 1); return (c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 !== 0) ? '을' : '를'; };  // 받침 조사 정정(지능을/도둑을 vs 매력를 방지)
  let racketPatched = 0;
  for (const s of SD) {
    if (s.class_id !== 'rogue') continue;
    const skillTxt = s.racket_skill || (s.granted_skills || []).map(sk => SKILL_KO[sk] || sk).join(', ');
    const keyKo = s.key_attr ? _ATTR_KO[s.key_attr] : '';
    let d = '';
    if (s.flavor) d += `<p><em>${s.flavor}</em></p>`;
    if (s.racket_benefit) d += `<p><strong>수법 효과</strong> ${s.racket_benefit}</p>`;
    if (skillTxt) d += `<p><strong>수법 기술</strong> ${skillTxt}</p>`;
    if (keyKo) d += `<p><strong>핵심 능력치</strong> ${keyKo}${_eul(keyKo)} 핵심 능력치로 선택할 수 있습니다(기본 민첩과 택1).</p>`;
    s.desc = PF.enrichDesc(d);
    s.features = [];   // 수법 효과는 desc가 소유 → 클래스 특성 카드 중복 표시 안 함.
    racketPatched++;
  }
  console.log(`  로그 수법 desc(정본 4수법 조립) 주입: ${racketPatched}종`);

  // 챔피언 원인(Cause) = Player Core 2 정본 7원인(FVTT 파생 desc 재작성). 신격·성별화·헌신 주문은 모달 인라인 컨트롤이 담당.
  //   여기선 원인 정체성 = 소개 + 성별화 요구 + 신조(edicts) + 금기(anathema) + 챔피언 반응(@link[actions.X] 정본명 + 1레벨 효과).
  //   반응은 성장표 granted_actions로 이미 부여(행동 탭) → desc는 표시. 「축복받은 X」(3레벨 헌신자의 축복)는 원인 아님 → 서브클래스에서 제외(_NOT_SUBCLASS)하고 cs_modal 축복 카드가 담당.
  const _SANCT_KO = { holy: '신성 (Holy 성별화 필요)', unholy: '부정 (Unholy 성별화 필요)', any: '무관 (어느 성별화든 선택 가능)' };
  const CAUSE = {
    justice: { sanct: 'any', flavor: '신의 이름으로 정의를 추구하며, 법을 따르고 이를 어기는 자를 처벌합니다.', edicts: '법을 따르고, 정당한 권위와 지도력을 존중한다', anathema: '타인을 이용하거나 속인다', rxn: 'retributive-strike', effect: '발동: 챔피언 오라 내 아군이 적에게 피해를 입음. 효과: 아군이 그 피해에 <b>2 + 레벨</b> 저항을 얻고, 적이 사거리 내에 있으면 그 적에게 근접 타격 1회.' },
    liberation: { sanct: 'any', flavor: '모든 이가 속박과 억압에서 벗어나 자유롭기를 바랍니다.', edicts: '노예제와 압제에 맞서고, 타인이 스스로 결정할 자유를 위해 싸우며, 남의 선택을 존중한다', anathema: '누군가를 강요·위협하거나, 노예제·압제에 가담한다', rxn: 'liberating-step', effect: '발동: 오라 내 아군이 적에게 피해·붙잡힘·포박당함. 효과: (피해였다면) 아군이 <b>2 + 레벨</b> 저항을 얻고, 붙잡기·포박 효과에서 탈출을 시도한 뒤 <b>자유 행동으로 한 걸음</b> 이동.' },
    obedience: { sanct: 'any', flavor: '사회는 마땅한 이유로 질서 지어져 있으며, 사람은 제자리에 맞게 처신해야 한다고 믿습니다.', edicts: '정당한 위계를 강제하고, 부당한 위계를 무너뜨리며, 가장 적합할 때 앞장선다', anathema: '자신보다 못한 자가 자신을 지배하거나 이끌게 둔다', rxn: 'iron-command', effect: '발동: 오라 내 적이 나에게 피해를 입힘. 효과: 적이 <b>무릎 꿇기</b>(넘어짐) 또는 <b>거부</b>(1d6 정신 피해, 레벨에 따라 증가) 중 하나를 택함. 어느 쪽이든 그 적에 대한 내 타격은 다음 턴까지 +1 영혼 피해.' },
    grandeur: { sanct: 'holy', flavor: '순결한 천상계의 찬란한 위엄에 고무되어, 그 덕을 세상에 드러내 오만한 자에게 겸손을 일깨웁니다.', edicts: '남에게 빛나는 본보기가 되고, 주변의 아름다움을 누리고 나누며, 단정함을 유지한다', anathema: '악마·부정한 세력과 어울려 자신을 더럽힌다', rxn: 'flash-of-grandeur', effect: '발동: 오라 내 적이 아군에게 피해를 입힘. 효과: 아군이 그 피해에 <b>2 + 레벨</b> 저항을 얻고, 적은 1라운드간 <b>폭로하는 빛</b>의 영향을 받습니다.' },
    redemption: { sanct: 'holy', flavor: '모두가 조화롭게 살기를 갈망하며, 남들이 베거나 내치려는 자마저 구원하려 애씁니다.', edicts: '악행을 저지른 자를 구원하려 애쓰고, 지위와 무관하게 자비를 베푼다', anathema: '구원의 기회를 먼저 주지 않고 지성 있는 적을 죽인다', rxn: 'glimpse-of-redemption', effect: '발동: 오라 내 아군이 적에게 피해를 입음. 효과: 적이 <b>회개</b>(아군이 피해를 입지 않음) 또는 <b>거부</b>(아군이 2 + 레벨 저항을 얻고, 적은 다음 턴까지 쇠약 2) 중 하나를 택함.' },
    desecration: { sanct: 'unholy', flavor: '상대를 가리지 않고 원하는 것을 취하며, 닿는 모든 것에 악의를 퍼뜨립니다.', edicts: '길을 막는 순수하고 신성한 모든 것을 전복·타락시키고, 순수·신성의 이상에 의심을 뿌린다', anathema: '', rxn: 'selfish-shield', effect: '발동: 오라 내 적이 나에게 피해를 입힘. 효과: 그 피해에 피해 유형과 무관하게 <b>2 + 레벨의 절반</b> 저항을 얻고, 이후 그 적에 대한 타격은 +1 영혼 피해.' },
    iniquity: { sanct: 'unholy', flavor: '명예도 정직도 없이, 친절이 품은 헛된 희망을 깨뜨리는 데 몰두합니다.', edicts: '자신을 거스르거나 앞을 막는 것을 파괴하고, 남을 이용하며, 속이고 훔친다', anathema: '신격이 요구하지 않는 율법에 스스로를 얽맨다', rxn: 'destructive-vengeance', effect: '발동: 오라 내 적이 나에게 피해를 입힘. 효과: 내가 받는 피해가 1d6 증가하고 그 적에게 <b>1d6 영혼 피해</b>(레벨에 따라 증가). 이후 그 적에 대한 타격은 +2 영혼 피해.' },
  };
  let causePatched = 0;
  for (const s of SD) {
    if (s.class_id !== 'champion') continue;
    const c = CAUSE[s.id]; if (!c) continue;   // 「축복받은 X」(헌신자의 축복)는 원인 아님 → 건너뜀
    let d = '';
    if (c.flavor) d += `<p><em>${c.flavor}</em></p>`;
    d += `<p><strong>성별화</strong> ${_SANCT_KO[c.sanct]}</p>`;
    if (c.edicts) d += `<p><strong>신조</strong> ${c.edicts}</p>`;
    if (c.anathema) d += `<p><strong>금기</strong> ${c.anathema}</p>`;
    d += `<p><strong>챔피언 반응</strong> @link[actions.${c.rxn}] — ${c.effect}</p>`;
    s.desc = PF.enrichDesc(d);
    s.features = [];   // 반응은 성장표 granted_actions(행동 탭)가 소유 → 클래스 특성 카드 중복 표시 안 함.
    causePatched++;
  }
  console.log(`  챔피언 원인 desc(정본 7원인 조립) 주입: ${causePatched}종`);
}

// 챔피언 「축복받은 X」(Blessing of the Devoted, 3레벨 택1 특성)는 서브클래스 아님 → 원인 드롭다운에서 제외.
//   정본 = 챔피언 서브클래스 축 = 원인(Cause) 하나. 축복은 cs_modal 헌신자의 축복 카드(state.championBlessing)가 담당.
const _NOT_SUBCLASS = new Set(['blessed-armament', 'blessed-shield', 'blessed-swiftness']);
// 표시용 별칭(DataManager 서브클래스 탭: slug/class/grants/rules_n) 부가 — 런타임 필드(id/class_id/...)는 보존
const rows = SD.filter(s => !_NOT_SUBCLASS.has(s.id)).map(s => ({
  slug: s.id, class: s.class_id,
  ...s,
  grants: (s.granted_feats || []).length + (s.granted_spells || []).length + (s.granted_actions || []).length,
  rules_n: (s.features || []).length,
}));
rows.sort((a, b) => (a.class || '').localeCompare(b.class || '') || String(a.subclass_type).localeCompare(String(b.subclass_type)) || String(a.slug).localeCompare(String(b.slug)));

const out = { rows, note: '서브클래스 단일소스(런타임 SUBCLASS_DB가 로드). 큐레이션 6 + FVTT파생 + 클레릭 교의 조립. id/class_id=런타임, slug/class=표시별칭.' };
fs.writeFileSync(path.join(DEV, 'data/derived/subclasses.json'), JSON.stringify(out, null, 1) + '\n');

const by = {}; rows.forEach(r => by[r.class] = (by[r.class] || 0) + 1);
const noDesc = rows.filter(r => !r.desc).length, noType = rows.filter(r => !r.subclass_type).length;
console.log(`✔ subclasses.json — ${rows.length}종 (desc 없음 ${noDesc}, subclass_type 없음 ${noType})`);
console.log('  클래스별:', JSON.stringify(by));
