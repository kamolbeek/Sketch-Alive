// Sahnalar reestri — Sketch Alive'ning o'zagi.
//
// Upstream'da bitta narsa bor edi: akvarium, va uning ichida faqat baliq.
// Bizda esa bola nima chizishidan qat'i nazar, chizgani biror **sahnaga**
// tushishi kerak: dinozavr — bog'ga, mushuk — hovliga, krovat — xonaga.
// Shuning uchun sahna alohida tushuncha bo'lib ajratildi.
//
// Sahna nimani belgilaydi:
//   • fon (rasm bo'lmasa — protsedura gradient, shuning uchun hech qanday
//     tayyor aktiv talab qilmaydi);
//   • personaj o'zini qanday tutishi (`motion`): suzadi, yuradi, uchadi
//     yoki xonada turadi;
//   • ufq (`ground`) — undan pastdagisi yer tekisligi, yuradiganlar shu
//     tekislikda chuqurlik bo'yicha tarqaladi;
//   • bolaga beriladigan chizish maslahatlari (`draw`).
//
// Bir joyda turishi shart: sahnalar ro'yxati serverga ham (qaysi sahna
// haqiqiy ekanini tekshirish uchun), chizish sahifasiga ham, katta ekranga
// ham kerak. Ikkiga bo'linsa — birida bor, ikkinchisida yo'q sahna paydo
// bo'ladi va buni birinchi bo'lib tarbiyachi bolalar oldida ko'radi.
//
// Fayl ikki joyda ishlaydi: brauzerda <script> orqali (window.SCENES) va
// serverda require() orqali (module.exports).
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SCENES = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Ranglar HEX bilan yozilgan: sahna foni canvas'da gradient bo'lib
  // chiziladi, ya'ni birorta ham png yuklab olinmaydi. Bog'chada internet
  // sekin bo'lishi mumkin, sahna esa darhol ochilishi kerak.
  var LIST = [
    {
      id: 'aquarium',
      titles: { uz: 'Akvarium', ru: 'Аквариум', en: 'Aquarium' },
      motion: 'swim',
      // Suzadiganlar butun ekran bo'ylab yuradi, yer chizig'i kerak emas.
      // `ground` — bu yer emas, **ufq**: yuradigan sahnalarda undan pastdagi
      // hamma narsa yer tekisligi bo'ladi va personajlar shu tekislikda
      // chuqurlik bo'yicha tarqaladi.
      ground: null,
      sky: ['#0b4f78', '#0a2f4d'],
      floor: '#0a2036',
      // Akvariumda upstream'ning tayyor fonlari bor — ular ishlatiladi,
      // gradient esa fon yuklanmaguncha yoki topilmasa zaxira bo'lib qoladi.
      backgrounds: true,
      ambient: 'bubbles',
      draw: {
        uz: ['Baliq', 'Meduza', 'Dengiz oti', 'Toshbaqa', 'Qisqichbaqa'],
        ru: ['Рыбка', 'Медуза', 'Морской конёк', 'Черепаха', 'Краб'],
        en: ['Fish', 'Jellyfish', 'Seahorse', 'Turtle', 'Crab']
      }
    },
    {
      id: 'dino',
      titles: { uz: 'Dinozavrlar bog‘i', ru: 'Парк динозавров', en: 'Dinosaur park' },
      motion: 'walk',
      ground: 0.60,
      sky: ['#f6c98a', '#c9743f'],
      floor: '#6b4a2f',
      backgrounds: false,
      ambient: 'dust',
      draw: {
        uz: ['Dinozavr', 'Tiranozavr', 'Uchar kaltakesak', 'Vulqon', 'Palma'],
        ru: ['Динозавр', 'Тираннозавр', 'Птеродактиль', 'Вулкан', 'Пальма'],
        en: ['Dinosaur', 'T-Rex', 'Pterodactyl', 'Volcano', 'Palm tree']
      }
    },
    {
      id: 'zoo',
      titles: { uz: 'Hayvonot bog‘i', ru: 'Зоопарк', en: 'Zoo' },
      motion: 'walk',
      ground: 0.58,
      sky: ['#8ecae6', '#c7e9b0'],
      floor: '#4f7a3a',
      backgrounds: false,
      ambient: 'leaves',
      draw: {
        uz: ['Fil', 'Sher', 'Zurafa', 'Ayiq', 'Maymun', 'Quyon'],
        ru: ['Слон', 'Лев', 'Жираф', 'Медведь', 'Обезьяна', 'Заяц'],
        en: ['Elephant', 'Lion', 'Giraffe', 'Bear', 'Monkey', 'Rabbit']
      }
    },
    {
      id: 'home',
      titles: { uz: 'Uy', ru: 'Дом', en: 'Home' },
      // Xonada narsalar yurmaydi — ular joyida turadi va sekin "nafas oladi".
      // Bola stol yoki krovat chizsa, u yurib ketsa kulgili bo'lardi.
      motion: 'place',
      ground: 0.56,
      sky: ['#f3e3cf', '#e0c8a8'],
      floor: '#a8794f',
      backgrounds: false,
      ambient: null,
      draw: {
        uz: ['Krovat', 'Stol', 'Stul', 'Likopcha', 'Gul', 'Chiroq', 'Kitob'],
        ru: ['Кровать', 'Стол', 'Стул', 'Тарелка', 'Цветок', 'Лампа', 'Книга'],
        en: ['Bed', 'Table', 'Chair', 'Plate', 'Flower', 'Lamp', 'Book']
      }
    },
    {
      id: 'sky',
      titles: { uz: 'Osmon', ru: 'Небо', en: 'Sky' },
      motion: 'fly',
      ground: null,
      sky: ['#7ec8f0', '#dff1fb'],
      floor: '#dff1fb',
      backgrounds: false,
      ambient: 'clouds',
      draw: {
        uz: ['Qush', 'Kapalak', 'Samolyot', 'Raketa', 'Shar'],
        ru: ['Птица', 'Бабочка', 'Самолёт', 'Ракета', 'Шарик'],
        en: ['Bird', 'Butterfly', 'Plane', 'Rocket', 'Balloon']
      }
    }
  ];

  var BY_ID = {};
  LIST.forEach(function (s) { BY_ID[s.id] = s; });

  // Birinchi sahna — akvarium: upstream'ning tayyor fonlari, bo'yash
  // varaqlari va 3D modellari aynan shunga mo'ljallangan, ya'ni eng tayyor
  // sahna shu. Yangi bog'cha uni birinchi ko'radi.
  var DEFAULT_ID = 'aquarium';

  return {
    list: LIST,
    ids: LIST.map(function (s) { return s.id; }),
    defaultId: DEFAULT_ID,

    // Noma'lum id kelsa — sahnasiz qolgandan ko'ra akvarium ochilgani
    // yaxshi. Bu yo'l serverga ham, brauzerga ham bir xil kerak.
    get: function (id) { return BY_ID[id] || BY_ID[DEFAULT_ID]; },
    has: function (id) { return Object.prototype.hasOwnProperty.call(BY_ID, id); },

    title: function (id, lang) {
      var s = BY_ID[id] || BY_ID[DEFAULT_ID];
      return s.titles[lang] || s.titles.uz;
    }
  };
});
