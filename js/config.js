/* ============================================================
   선생님이 직접 고치는 설정 파일입니다.
   - 따옴표(' ')와 쉼표(,)만 지우지 않으면 됩니다.
   - 고친 뒤 GitHub에 다시 올리면 바로 반영됩니다.
   ============================================================ */
window.CFG = {

  /* 1) 구글 시트 연결 주소 (Apps Script 웹 앱 URL).
        비워 두면 "연습 모드"로 이 기기에만 저장됩니다. */
  API_URL: 'https://script.google.com/macros/s/AKfycbyL42l7zymrpLzVkE8wA4inwVKSonsvWAc-g4lHmqiOJ_5R6_cL4J_EoLqFUV1F0lHLqQ/exec',

  /* 2) 식물 단계: need = 그 단계가 되는 데 필요한 누적 경험치.
        단계를 늘리거나 줄여도 됩니다. (그림은 5단계까지 준비되어 있어 6단계부터는 5단계 그림을 씁니다) */
  LEVELS: [
    { need: 0,   name: { ko: '씨앗',   en: 'Seed' } },
    { need: 15,  name: { ko: '새싹',   en: 'Sprout' } },
    { need: 50,  name: { ko: '어린 식물', en: 'Seedling' } },
    { need: 120, name: { ko: '꽃 피는 식물', en: 'Blooming' } },
    { need: 250, name: { ko: '열매 맺은 식물', en: 'Fruiting' } }
  ],

  /* 3) 칭찬 아이템: 교사 페이지의 버튼으로 나타납니다. xp = 주는 경험치.
        새 아이템은 한 줄 복사해서 id, icon, xp, name만 바꾸면 됩니다. */
  ITEMS: [
    { id: 'nutri',   icon: '🧪', xp: 5,  name: { ko: '영양제',     en: 'Plant food' } },
    { id: 'sunny',   icon: '🌞', xp: 3,  name: { ko: '햇살 듬뿍',   en: 'Extra sunshine' } },
    { id: 'compost', icon: '🍂', xp: 10, name: { ko: '특급 퇴비',   en: 'Super compost' } },
    { id: 'bee',     icon: '🐝', xp: 7,  name: { ko: '꿀벌 친구',   en: 'Bee friend' } }
  ],

  /* 4) 재해 이벤트(패널티): xp는 음수로 적습니다. 식물이 "시든 상태"가 됩니다. */
  EVENTS: [
    { id: 'locust',  icon: '🦗', xp: -5,  name: { ko: '메뚜기 떼',  en: 'Locust swarm' } },
    { id: 'drought', icon: '🏜️', xp: -3,  name: { ko: '가뭄',      en: 'Drought' } },
    { id: 'typhoon', icon: '🌀', xp: -10, name: { ko: '태풍',      en: 'Typhoon' } }
  ],

  /* 5) 고를 수 있는 식물 종류. 직접 그린 그림을 쓰려면 img에 단계별 파일 경로 5개를 적습니다.
        예) img: ['img/tomato1.png','img/tomato2.png','img/tomato3.png','img/tomato4.png','img/tomato5.png'] */
  SPECIES: [
    { id: 'tomato',    name: { ko: '토마토',   en: 'Tomato' },     img: null },
    { id: 'strawberry',name: { ko: '딸기',     en: 'Strawberry' }, img: null },
    { id: 'lettuce',   name: { ko: '상추',     en: 'Lettuce' },    img: null },
    { id: 'paprika',   name: { ko: '파프리카', en: 'Bell pepper' },img: null },
    { id: 'sunflower', name: { ko: '해바라기', en: 'Sunflower' },  img: null }
  ],

  /* 6) 스마트팜 자료(노트북LM) 링크. 구글 시트 "설정"에 적은 링크가 있으면 그것이 우선합니다. */
  NOTEBOOK_URL: '',

  /* 7) 랭킹에 보여 줄 인원 */
  RANK_TOP: 10,

  /* 8) 반 목록 (교사 페이지 진도표에 쓰입니다) */
  CLASSES: ['1', '2', '3', '4', '5', '6', '7']
};
