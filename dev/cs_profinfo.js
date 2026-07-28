// ── 숙련 정보 팝업 (기술·내성·지각·클래스 난이도 클릭 시) ──
// Foundry PF2e "Proficiency Information" 팝업 미러. 시트 스탯을 클릭하면
//   ① 굴림 버튼 + 총 수정치 ② TEML 등급 + 능력치/숙련/장비/(갑옷) 분해
//   ③ 정본 한글 설명 ④ (기술만) 관련 행동 목록 ⑤ 완료.
// 대원칙: 분해는 기존 calc 헬퍼(getMod/rankBonus/getArmorPenalties/getClassKeyAttr)에서 파생,
//   기술→행동은 action_curation(PF2eAction.curatedList)의 req_skill에서 파생(하드코딩 금지).
(function () {
  'use strict';

  // 능력치 한글 약칭 (분해 컬럼 헤더용)
  const ATTR_KO = { str: '근력', dex: '민첩', con: '건강', int: '지능', wis: '지혜', cha: '매력' };

  // 내성·지각·클래스 난이도 정본 설명 (Player Core 기반, 간결)
  const STAT_DESC = {
    fort: '건강 내성은 몸을 쇠약하게 만드는 능력이나 질병의 효과를 줄여 줍니다. 건강 수정치를 사용합니다.',
    ref: '반사 내성은 위험을 재빨리 피하는 능력입니다. 민첩 수정치를 사용합니다.',
    will: '의지 내성은 정신과 의지력에 대한 공격을 견뎌 냅니다. 지혜 수정치를 사용합니다.',
    perc: '지각은 주변을 인지하는 능력으로, 모든 생물이 가지며 감각의 한계 안에서 작동합니다. 인지에 기반한 판정을 할 때마다 지각 판정을 하며, 지혜 수정치를 사용합니다.',
    classdc: '클래스 난이도(클래스 DC)는 당신의 클래스가 부여하는 특정 능력의 난이도를 정합니다. 10 + 클래스 DC 숙련 보너스 + 클래스 핵심 능력치 수정치와 같습니다.',
  };

  // 기술 정본 설명 (Player Core 기반, 간결). 지식(lore)은 일반 설명.
  const SKILL_DESC = {
    acrobatics: '곡예는 협응과 우아함이 필요한 행동을 수행하는 능력을 나타냅니다. 탈출 기본 행동을 사용할 때 비무장 명중 대신 곡예 수정치를 쓸 수 있습니다.',
    arcana: '주문학은 비전 마법 이론과 그와 관련된 생물·역사·유물에 대한 지식을 다룹니다.',
    athletics: '운동은 등반·수영·도약과 붙잡기·밀기·넘어뜨리기 같은 육체적 위업을 수행하는 능력입니다.',
    crafting: '제작은 물품을 만들고 수리하며 그 원리를 이해하고, 자원으로 소득을 올리는 능력입니다.',
    deception: '기만은 거짓말·변장·페인트·주의 분산으로 상대를 오도하는 능력입니다.',
    diplomacy: '교섭은 요청·설득·정보 수집을 통해 사람들에게 우호적으로 영향을 주는 능력입니다.',
    intimidation: '위협은 협박과 위압으로 상대를 굴복시키거나 사기를 꺾는 능력입니다.',
    medicine: '의학은 부상을 치료하고 응급 처치를 하며 질병과 독에 대응하는 능력입니다.',
    nature: '자연학은 자연 지형·동물·원소·자연 마법과 자연계에 대한 지식을 다룹니다.',
    occultism: '오컬티즘은 신비학·기이한 존재·철학과 오컬트 마법에 대한 지식을 다룹니다.',
    performance: '공연은 연기·연주·춤 등으로 청중을 사로잡는 능력입니다.',
    religion: '종교학은 신·교리·사후세계·신성한 존재와 신성 마법에 대한 지식을 다룹니다.',
    society: '사회학은 사람·역사·법·언어 등 문명 사회에 대한 지식을 다룹니다.',
    stealth: '은신은 들키지 않고 숨거나 이동하고 물건을 감추는 능력입니다.',
    survival: '생존은 야생에서 방향을 찾고 흔적을 추적하며 자급하는 능력입니다.',
    thievery: '손기술은 소매치기·자물쇠 따기·장치 해제 등 섬세한 손재주가 필요한 행동입니다.',
  };
  const LORE_DESC = '지식은 특정 주제나 분야에 대한 전문 지식을 나타냅니다. 해당 주제와 관련된 사실을 회상할 때 사용합니다.';

  // 갑옷 판정 페널티가 적용되는 기술(근력/민첩 기반)
  function _hasArmorPen(attr) { return attr === 'str' || attr === 'dex'; }

  // #val-* / #sk-val-* 텍스트(권위 있는 총합)에서 숫자 추출
  function _valNum(id) {
    const el = document.getElementById(id);
    return el ? (parseInt(el.textContent) || 0) : 0;
  }
  function _rankOf(selId) { return parseInt(document.getElementById(selId)?.value || 0) || 0; }
  function _fmt(n) { return (n >= 0 ? '+' : '') + n; }

  // 기술 관련 행동을 action_curation(req_skill)에서 파생
  function _skillActions(skillId) {
    if (typeof PF2eAction === 'undefined' || !PF2eAction.curatedList) return [];
    return PF2eAction.curatedList()
      .filter(a => a.req_skill === skillId)
      .map(a => ({ name: a.name_ko || a.name_en || a.id, cost: a.cost, rank: a.req_rank || 0, slug: a.id }));
  }

  // 스탯 종류별 팝업 설정 조립
  function buildProfInfoConfig(kind, id) {
    const lv = (typeof getLevel === 'function') ? getLevel() : 1;
    if (kind === 'skill') {
      const sk = (typeof SKILLS !== 'undefined') ? SKILLS.find(s => s.id === id) : null;
      if (!sk) return null;
      const attr = sk.attr;
      const rank = _rankOf('sk-prof-' + id);
      const abilityMod = (typeof getMod === 'function') ? getMod(attr) : 0;
      const profB = (typeof rankBonus === 'function') ? rankBonus(rank, lv) : 0;
      const armor = _hasArmorPen(attr) && typeof getArmorPenalties === 'function' ? getArmorPenalties().check : 0;
      const total = _valNum('sk-val-' + id);
      const cols = [{ h: ATTR_KO[attr] || attr.toUpperCase(), v: abilityMod }, { h: '숙련', v: profB }, { h: '장비', v: 0 }];
      if (_hasArmorPen(attr)) cols.push({ h: '갑옷', v: armor });
      return {
        title: sk.name, label: sk.name, mod: total, rank, cols,
        desc: sk.isLore ? LORE_DESC : (SKILL_DESC[id] || LORE_DESC),
        actions: _skillActions(id),
        roll: { category: 'skill', label: sk.name, mod: total },
      };
    }
    if (kind === 'save') {
      const map = { fort: ['건강 내성', 'con'], ref: ['반사 내성', 'dex'], will: ['의지 내성', 'wis'] };
      const [label, attr] = map[id] || [];
      if (!label) return null;
      const rank = _rankOf('prof-' + id);
      const abilityMod = getMod(attr), profB = rankBonus(rank, lv);
      const total = _valNum('val-' + id);
      return {
        title: '숙련 정보', label, mod: total, rank,
        cols: [{ h: ATTR_KO[attr], v: abilityMod }, { h: '숙련', v: profB }, { h: '장비', v: 0 }],
        desc: STAT_DESC[id], actions: null,
        roll: { category: 'save', label, mod: total },
      };
    }
    if (kind === 'perc') {
      const rank = _rankOf('prof-perc');
      const total = _valNum('val-perc');
      return {
        title: '숙련 정보', label: '지각', mod: total, rank,
        cols: [{ h: ATTR_KO.wis, v: getMod('wis') }, { h: '숙련', v: rankBonus(rank, lv) }, { h: '장비', v: 0 }],
        desc: STAT_DESC.perc, actions: null,
        roll: { category: 'perception', label: '지각', mod: total },
      };
    }
    if (kind === 'weapon') {
      const catKo = { simple: '단순 무기', martial: '군용 무기', advanced: '고급 무기', unarmed: '비무장 공격' }[id] || id;
      const rank = _rankOf('prof-weapon-' + id);
      const profB = rankBonus(rank, lv);
      return {
        title: '무기 숙련', label: catKo, mod: profB, rank,
        cols: [{ h: '숙련', v: profB }],
        desc: '이 무기 범주로 공격할 때 명중 굴림에 더하는 숙련 보너스입니다. 숙련되지 않으면 명중에 아무 보너스도 얻지 못합니다.\n(수련 등급: 미숙련 U · 숙련 T · 전문가 E · 달인 M · 전설 L)',
        actions: null, roll: null,
      };
    }
    if (kind === 'classdc') {
      const attr = (typeof getClassKeyAttr === 'function') ? getClassKeyAttr() : 'wis';
      const rank = _rankOf('prof-classdc');
      const dc = _valNum('val-classdc');            // 총 DC(10 포함)
      const bonus = dc - 10;                          // 굴림 수정치 = DC - 10
      const clsName = (state.selectedClass && state.selectedClass.name) || '클래스';
      return {
        title: '숙련 정보', label: clsName, mod: bonus, rank,
        cols: [{ h: ATTR_KO[attr] || attr.toUpperCase(), v: getMod(attr) }, { h: '숙련', v: rankBonus(rank, lv) }, { h: '장비', v: 0 }],
        desc: STAT_DESC.classdc + `\n\n현재 클래스 난이도(DC): ${dc}`, actions: null,
        roll: { category: 'classdc', label: clsName + ' 클래스', mod: bonus },
      };
    }
    return null;
  }

  const RANKS = [['T', 2], ['E', 4], ['M', 6], ['L', 8]];
  function _temlHtml(rank) {
    return RANKS.map(([c, rv]) =>
      `<span class="pi-teml-b${rank === rv ? ' on' : ''}">${c}</span>`).join('');
  }
  function _colsHtml(cols) {
    return cols.map(c =>
      `<div class="pi-col"><div class="pi-col-h">${c.h}</div><div class="pi-col-v">${c.v}</div></div>`).join('');
  }
  function _actionsHtml(actions) {
    if (!actions || !actions.length) return '';
    const rows = actions.map(a => {
      const glyph = (typeof getActionIcons === 'function') ? getActionIcons(a.cost) : '';
      const rankNote = a.rank >= 2 ? ' <span class="pi-act-rank">(숙련 이상)</span>' : '';
      return `<div class="pi-act" onclick="ProfInfo.toggleAction(this,'${a.slug}')">
        <span class="pi-act-name">${a.name}${rankNote}</span>
        <span class="pi-act-cost">${glyph}</span></div>`;
    }).join('');
    return `<div class="pi-card"><div class="pi-sec-h">관련 행동</div>${rows}</div>`;
  }

  function closeProfInfo() {
    const el = document.getElementById('profinfo-overlay');
    if (el) el.remove();
  }

  // 관련 행동 클릭 = 설명 인라인 펼침(카탈로그 desc)
  function toggleAction(rowEl, slug) {
    const next = rowEl.nextElementSibling;
    if (next && next.classList.contains('pi-act-detail')) { next.remove(); return; }
    document.querySelectorAll('.pi-act-detail').forEach(d => d.remove());
    let desc = '';
    if (typeof PF2eAction !== 'undefined' && PF2eAction.getActionLegacy) {
      const a = PF2eAction.getActionLegacy(slug);
      desc = (a && a.desc) || '';
    }
    const div = document.createElement('div');
    div.className = 'pi-act-detail';
    div.innerHTML = desc || '<em style="color:var(--text2);">설명 없음</em>';
    rowEl.after(div);
  }

  function _doRoll(roll) {
    closeProfInfo();
    // 팝업 안 「굴림」 = 즉시 d20 판정(상황보너스 추가 모달 없이 바로 굴림).
    if (typeof DiceRoller !== 'undefined' && DiceRoller.rollCheck) {
      DiceRoller.rollCheck(roll.mod || 0, roll.label);
    }
  }
  // Roll 버튼 onclick에서 참조할 임시 저장
  let _pendingRoll = null;

  function openProfInfo(kind, id) {
    const cfg = buildProfInfoConfig(kind, id);
    if (!cfg) return;
    closeProfInfo();
    _pendingRoll = cfg.roll;
    const overlay = document.createElement('div');
    overlay.id = 'profinfo-overlay';
    overlay.className = 'pi-overlay';
    overlay.onclick = function (e) { if (e.target === overlay) closeProfInfo(); };
    const descHtml = (cfg.desc || '').replace(/\n/g, '<br>');
    overlay.innerHTML = `
      <div class="pi-modal">
        <div class="pi-title">${cfg.title}</div>
        <div class="pi-card pi-head">
          ${cfg.roll ? '<button class="pi-roll" onclick="ProfInfo.roll()">🎲 <span>굴림</span></button>' : ''}
          <span class="pi-label">${cfg.label} ${_fmt(cfg.mod)}</span>
          <span class="pi-teml">${_temlHtml(cfg.rank)}</span>
          <span class="pi-cols">${_colsHtml(cfg.cols)}</span>
        </div>
        <div class="pi-card pi-desc">${descHtml}</div>
        ${_actionsHtml(cfg.actions)}
        <button class="pi-finish" onclick="ProfInfo.close()">완료 Finished</button>
      </div>`;
    document.body.appendChild(overlay);
  }

  window.ProfInfo = {
    open: openProfInfo,
    close: closeProfInfo,
    roll: function () { if (_pendingRoll) _doRoll(_pendingRoll); },
    toggleAction: toggleAction,
    _build: buildProfInfoConfig, // 검증/하니스용
  };
  // 전역 별칭(위임 핸들러에서 호출)
  window.openProfInfo = openProfInfo;
})();
