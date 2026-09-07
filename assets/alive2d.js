// Bolaning rasmini jonlantiruvchi 2D dvigatel.
//
// NEGA 2D, 3D emas.
//
// Upstream 3D yo'ldan boradi: bola tayyor konturni bo'yaydi, rasm esa
// oldindan sotib olingan 3D model ustiga tekstura bo'lib yopishadi. Bu
// chiroyli ishlaydi, lekin ikkita narxi bor. Birinchisi — modellar pullik
// va repozitoriyga qo'shib bo'lmaydi, ya'ni loyihani ochib olgan bog'cha
// bo'sh akvarium ko'radi. Ikkinchisi, kattarog'i — bola **erkin chiza
// olmaydi**: shakl har doim tayyor, bolaniki faqat rang.
//
// Bizga esa aynan erkin chizish kerak: bola dinozavr chizsa dinozavr,
// krovat chizsa krovat jonlanishi kerak. Har bir shakl uchun 3D model
// topib bo'lmaydi. Shuning uchun personaj — bolaning rasmining o'zi:
// shaffof fonli kartinka, sahnada harakatlanadi va tanasi to'lqinlanadi.
//
// teamLab ham xuddi shunday qiladi — ularning akvariumidagi baliqlar 3D
// emas, tekis rasmlar. Bola uchun bu kuchliroq ham: ekranda **aynan o'zi
// chizgani** suzadi, tanish begona model emas.
//
// 3D yo'l o'chirilmadi: modellar bo'lgan joyda upstream sahnasi ishlayveradi.
// Bu dvigatel — hech narsa sotib olmasdan ishlaydigan asosiy yo'l.
//
//   var eng = Alive2D.create(canvas, SCENES.get('aquarium'));
//   eng.setCharacters([{ id:'a1', url:'/api/t/xx/fish/a1/texture.png', name:'Amir' }]);
//   eng.start();
(function (root) {
  'use strict';

  // ── kichik yordamchilar ──────────────────────────────────────────────────

  function rand(a, b) { return a + Math.random() * (b - a); }

  // Chuqurlik diapazoni. Eng uzoq personaj eng yaqinidan taxminan ikki
  // baravar kichik: kattaroq farq bo'lsa uzoqdagisi ko'rinmay ketadi,
  // kichikroq bo'lsa chuqurlik sezilmaydi.
  var Z_MIN = 0.4, Z_MAX = 1;

  // Yuradiganlar uchun eng yaqin qator ekranning qayerida turadi. Ufq —
  // sahnaning `ground` qiymati; ikkisi orasidagi bo'shliq — yer tekisligi,
  // personajlar shu tekislikda tarqaladi.
  var NEAR_LINE = 0.94;

  // Chuqurlikdan oyoq chizig'ini hisoblash. Ufqdan yaqin qatorgacha
  // chiziqli tarqatamiz: shunda hech kim yer tekisligidan tashqarida,
  // "havoda" turib qolmaydi.
  function footLine(scene, z) {
    var k = (z - Z_MIN) / (Z_MAX - Z_MIN);
    return scene.ground + (NEAR_LINE - scene.ground) * k;
  }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

  // Rasmni yuklab, chizishga tayyor holga keltiramiz. Bolaning rasmi
  // ixtiyoriy o'lchamda kelishi mumkin, sahnada esa u sahna balandligining
  // ma'lum ulushini egallashi kerak — shuning uchun o'lcham yuklangandan
  // keyin hisoblanadi, oldindan emas.
  function loadImage(url) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('rasm yuklanmadi: ' + url)); };
      img.src = url;
    });
  }

  // Rasmdagi jonivorning haqiqiy chegarasini o'lchaymiz.
  //
  // Rasm fayli va undagi jonivor bir narsa emas: Twemoji kvadrat, jonivor
  // esa uning turli qismini egallaydi — krevetka burchakdan burchakka
  // cho'zilgan, chig'anoq o'rtada kichkina. Fayl balandligi bo'yicha
  // o'lchansa, krevetka kitdek katta bo'lib chiqadi. Bolaning rasmida ham
  // xuddi shunday: atrofida bo'sh joy bo'lishi mumkin.
  //
  // Shuning uchun shaffof bo'lmagan piksellarning chegarasi o'lchanadi.
  // O'lchov kichraytirilgan nusxada olinadi — bizga aniq piksel emas,
  // nisbat kerak, 96 px esa har qanday rasm uchun yetarli va tez.
  function measure(img) {
    var M = 96;
    var w = Math.max(1, Math.min(M, img.width || M));
    var h = Math.max(1, Math.min(M, img.height || M));
    var cv = document.createElement('canvas');
    cv.width = w; cv.height = h;
    var cx = cv.getContext('2d', { willReadFrequently: true });
    var box = { x0: 0, y0: 0, x1: 1, y1: 1 };
    try {
      cx.drawImage(img, 0, 0, w, h);
      var d = cx.getImageData(0, 0, w, h).data;
      var minX = w, minY = h, maxX = -1, maxY = -1;
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          if (d[(y * w + x) * 4 + 3] > 24) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX >= 0) {
        box = { x0: minX / w, y0: minY / h, x1: (maxX + 1) / w, y1: (maxY + 1) / h };
      }
    } catch (e) {
      // Boshqa manbadan kelgan rasm canvas'ni "iflos" qiladi va o'qib
      // bo'lmaydi. Bunda butun rasmni jonivor deb hisoblaymiz — bu
      // ishlamay qolishdan yaxshiroq.
    }
    return box;
  }

  // ── personaj ─────────────────────────────────────────────────────────────
  //
  // Bitta jonlangan rasm. O'zining joyini, tezligini va "hayot fazasi"ni
  // biladi. Faza har bir personajda tasodifiy boshlanadi: aks holda ekrandagi
  // hamma baliq bir vaqtda, bir xil qimirlab, mashinaga o'xshab qolardi.

  // FE'L-ATVOR
  //
  // Hamma personaj bir xil harakat qilsa, ekran mexanik ko'rinadi: yigirmata
  // baliq bir tezlikda, bir yo'nalishda, bir xil to'lqinlanib suzadi va bola
  // ularni jonli deb qabul qilmaydi.
  //
  // Shuning uchun har bir personajga tug'ilganda **tabiat** beriladi va u
  // umr bo'yi o'zgarmaydi: kimdir shoshmasdan kesib o'tadi, kimdir joyida
  // aylanadi, kimdir tubda sekin yuradi. Ustiga vaqti-vaqti bilan qisqa
  // **harakat** qo'shiladi — aylanish, otilish, to'xtab atrofga qarash.
  //
  // Tabiat qaysi harakat qanchalik tez-tez uchrashini belgilaydi. Shunda
  // yigirmata baliqning yigirmatasi ham boshqacha yuradi, lekin har biri
  // o'ziga izchil qoladi: bugun aylangan baliq ertaga ham aylanadi.

  var NATURES = [
    // id           tezlik   aylanish  suzish  otilish  to'xtash  uy
    { id: 'cruiser',  spd: 1.00, turn: 0.5, w: { swim: 6, loop: 1, dash: 2, rest: 1 } },
    { id: 'darter',   spd: 1.25, turn: 0.9, w: { swim: 3, loop: 1, dash: 6, rest: 1 } },
    { id: 'wanderer', spd: 0.85, turn: 1.5, w: { swim: 3, loop: 6, dash: 1, rest: 2 } },
    { id: 'calm',     spd: 0.60, turn: 0.4, w: { swim: 6, loop: 1, dash: 0, rest: 5 } },
    { id: 'shy',      spd: 0.75, turn: 1.1, w: { swim: 3, loop: 2, dash: 3, rest: 6 } }
  ];

  function pickNature() {
    return NATURES[(Math.random() * NATURES.length) | 0];
  }

  // Tabiatning og'irliklariga qarab navbatdagi harakatni tanlaymiz.
  function pickAction(nature) {
    var w = nature.w;
    var total = w.swim + w.loop + w.dash + w.rest;
    var r = Math.random() * total;
    if ((r -= w.swim) < 0) return 'swim';
    if ((r -= w.loop) < 0) return 'loop';
    if ((r -= w.dash) < 0) return 'dash';
    return 'rest';
  }

  // ── personaj ─────────────────────────────────────────────────────────────

  function Character(img, opts) {
    this.img = img;
    this.id = opts.id;
    this.name = opts.name || '';
    this.motion = opts.motion || 'swim';
    // Rasm chapga qaragan bo'lsa ko'zguda aylantiriladi. Bu doimiy xossa,
    // suzish yo'nalishidan alohida: ikkalasi ko'paytiriladi.
    this.mirror = opts.flip ? -1 : 1;

    // Chuqurlik: 0 — eng uzoq, 1 — eng yaqin. O'lchamga ham, tartibga ham
    // ta'sir qiladi, shuning uchun sahna tekis emas, hajmli ko'rinadi.
    this.z = rand(Z_MIN, Z_MAX);

    this.nature = pickNature();

    // TANA HARAKATNI BELGILAYDI
    //
    // Kit bilan krevetka bir xil qimirlasa, ikkalasi ham qog'oz bo'lib
    // ko'rinadi. Haqiqatda o'lcham va shakl harakatni to'g'ridan-to'g'ri
    // belgilaydi: katta tana suvni og'ir kesadi — dumini sekin, lekin keng
    // uradi; mayda baliq esa tez-tez va mayda qimirlaydi. Uzun yassi tana
    // bo'ylab to'lqin uzoq yuradi, kalta dumaloq tanada esa deyarli yo'q.
    //
    // Ikkala kattalik ham o'lchanadi, taxmin qilinmaydi:
    //   bulk   — turning tabiiy o'lchami (manifestdan; bolaning rasmi 1),
    //   aspect — rasmning eni/bo'yi, ya'ni tana cho'ziqmi yoki dumaloqmi.
    this.bulk = clamp(opts.scale || 1, 0.35, 2.4);

    // Jonivorning rasm ichidagi haqiqiy chegarasi.
    this.box = measure(img);
    var bw = Math.max(0.02, this.box.x1 - this.box.x0);
    var bh = Math.max(0.02, this.box.y1 - this.box.y0);
    this.boxH = bh;

    // Nisbat fayl o'lchamidan emas, jonivorning o'zidan olinadi.
    this.aspect = clamp((bw * (img.width || 1)) / (bh * (img.height || 1)), 0.4, 4);

    // Dum urish chastotasi. Kvadrat ildizga yaqin bog'liqlik — biologiyada
    // ham shunday: o'lcham ikki barobar oshsa, chastota ikki barobar emas,
    // undan kamroq tushadi.
    this.beat = 4.4 / Math.pow(this.bulk, 0.62);

    // To'lqinning tana bo'ylab kuchi. Cho'ziq tanada to'lqin uzoq yuradi,
    // dumaloq tanada (meduza, qisqichbaqa) deyarli bilinmaydi — ular
    // umuman boshqacha, "nafas olib" qimirlaydi.
    this.wave = clamp((this.aspect - 0.9) / 1.6, 0.12, 1.15);

    // Katta tana bir joydan ikkinchisiga uzoqroq yo'l bosadi, lekin
    // ko'rinishidan shoshmaydi; maydasi tez-tez yo'nalish o'zgartiradi.
    this.tempo = 1 / Math.pow(this.bulk, 0.45);

    // Yo'nalish burchak bilan saqlanadi, "chapga/o'ngga" bilan emas. Faqat
    // burchak bo'lgandagina aylanish, egri yo'l va yumshoq burilish tabiiy
    // chiqadi: ularning hammasi burchakni asta o'zgartirishdan iborat.
    this.ang = Math.random() * Math.PI * 2;
    this.turn = 0;             // hozirgi burilish tezligi, rad/s

    this.dir = Math.cos(this.ang) < 0 ? -1 : 1;
    // Ko'rinadigan yo'nalish alohida: burilish bir zumda emas, sprayt
    // gorizontal siqilib, keyin ochilib buriladi — shunda burilish
    // "sakrash" emas, harakat bo'lib ko'rinadi.
    this.face = this.dir;

    this.phase = rand(0, Math.PI * 2);
    // Ekrandagi tezlik: katta baliq sekinroq ko'rinadi, lekin butunlay
    // to'xtab qolmaydi — 0.2 daraja bu ikkisi orasidagi muvozanat.
    this.speedScale = rand(0.8, 1.25) * this.nature.spd / Math.pow(this.bulk, 0.2);

    // Hozirgi harakat va u tugaguncha qolgan vaqt.
    this.action = 'swim';
    this.actionLeft = rand(1, 3);
    this.gas = 1;              // tezlik ko'paytirgichi, harakatga qarab
    this.gasTarget = 1;

    // Burilishdagi og'ish. Baliq chuqurlikni o'zgartirganda tanasi biroz
    // qiyshayadi — bu harakatni tekis sirg'anishdan ajratib turadigan
    // eng sezilarli belgi.
    this.tilt = 0;
    this.prevY = 0;

    this.x = Math.random();
    this.y = rand(0.15, 0.85);
    this.driftPhase = rand(0, Math.PI * 2);

    // Yangi personaj sahnaga "paydo bo'lish" bilan kiradi: kattalashib,
    // biroz sakrab joylashadi. Bu bolaning "meniki chiqdi!" lahzasi —
    // sahnaga jimgina qo'shilib qo'yish uni yo'qotadi.
    this.born = 0;
    this.entering = true;
  }

  // Navbatdagi harakatga o'tish. Har bir harakat o'z burilish tezligi va
  // o'z gazini o'rnatadi, qolganini step() bir xil hisoblaydi.
  Character.prototype.nextAction = function () {
    var a = pickAction(this.nature);
    this.action = a;

    if (a === 'loop') {
      // Aylanish: burilish tezligi doimiy, davomiyligi to'liq aylanaga
      // yaqin. Yo'nalish tasodifiy — hammasi bir tomonga aylansa, bu yana
      // bir xillik bo'lardi.
      var side = Math.random() < 0.5 ? -1 : 1;
      this.turn = side * rand(1.1, 2.0) * this.tempo;
      this.actionLeft = rand(2.2, 4.5) / this.tempo;
      this.gasTarget = rand(0.8, 1.2);
    } else if (a === 'dash') {
      // Otilish: to'g'riga va tez, lekin qisqa.
      this.turn = rand(-0.15, 0.15);
      this.actionLeft = rand(0.6, 1.4) / this.tempo;
      this.gasTarget = rand(2.0, 3.2);
    } else if (a === 'rest') {
      // To'xtab turish: deyarli joyida, faqat atrofga qaraydi. Dum ham
      // sekin qimirlaydi — buni tezlikka bog'langan animatsiya o'zi qiladi.
      this.turn = rand(-0.5, 0.5);
      this.actionLeft = rand(1.5, 3.5) / this.tempo;
      this.gasTarget = rand(0.05, 0.25);
    } else {
      // Oddiy suzish: sekin va tasodifiy egiladi, shuning uchun yo'l
      // to'g'ri chiziq emas.
      this.turn = rand(-1, 1) * this.nature.turn * 0.5;
      this.actionLeft = rand(2, 5) / this.tempo;
      this.gasTarget = rand(0.7, 1.3);
    }
  };

  Character.prototype.step = function (dt, t, scene, view) {
    var m = this.motion;

    this.born += dt;
    if (this.born > 1.2) this.entering = false;

    // Ko'rinadigan yo'nalish haqiqiy yo'nalishga asta yetib boradi.
    this.face += (this.dir - this.face) * clamp(dt * 6, 0, 1);

    if (m === 'place') return;   // xonadagi narsa joyidan jilmaydi

    // Yer bo'ylab yuradiganlar burchak bilan emas, oddiy chap-o'ng bilan
    // harakatlanadi: ular uchun aylanish ham, ko'tarilish ham ma'nosiz.
    if (m === 'walk') return this.stepWalk(dt, scene);

    this.actionLeft -= dt;
    if (this.actionLeft <= 0) this.nextAction();

    this.gas += (this.gasTarget - this.gas) * clamp(dt * 2, 0, 1);

    // Chetdan qaytish. Devorga urilib emas, o'zi burilib qaytadi: chegaraga
    // yaqinlashgan sari markazga qaragan burchakka tortiladi.
    var steer = this.turn;
    var margin = 0.10;
    if (this.x < margin) steer += (0 - Math.cos(this.ang)) * 3 + (this.x < 0 ? 4 : 0);
    if (this.x > 1 - margin) steer += (0 - Math.cos(this.ang)) * -3 + (this.x > 1 ? -4 : 0);
    if (this.y < 0.12) steer += Math.sin(this.ang) < 0 ? 3 * (this.dir > 0 ? 1 : -1) : 0;
    if (this.y > 0.88) steer += Math.sin(this.ang) > 0 ? -3 * (this.dir > 0 ? 1 : -1) : 0;

    this.ang += steer * dt;

    var base = (m === 'fly') ? 0.085 : 0.06;
    // Uzoqdagilar sekinroq suzadi — perspektivada shunday ko'rinadi.
    var speed = base * this.speedScale * this.gas * (0.55 + 0.45 * this.z);

    // Vertikal harakat gorizontaldan sekinroq: ekran keng, baland emas, va
    // to'liq tenglikda baliqlar tepa-pastga otilib yurgandek ko'rinadi.
    this.x += Math.cos(this.ang) * speed * dt;
    this.y += Math.sin(this.ang) * speed * dt * 0.55;

    this.x = clamp(this.x, -0.04, 1.04);
    this.y = clamp(this.y, 0.08, 0.9);

    // Ko'rinadigan yo'nalish — harakat yo'nalishining belgisi. Deyarli
    // vertikal ketayotganda belgi tez-tez almashib, sprayt titrab qolmasligi
    // uchun kichik o'lik zona qoldiriladi.
    var cx = Math.cos(this.ang);
    if (cx > 0.12) this.dir = 1;
    else if (cx < -0.12) this.dir = -1;

    // Og'ish balandlik o'zgarishidan hisoblanadi: yuqoriga ketayotgan
    // personajning boshi ko'tariladi. Formulaga emas, haqiqiy harakatga
    // bog'langani uchun u har doim harakatga mos tushadi.
    if (dt > 0) {
      var vy = (this.y - this.prevY) / dt;
      this.tilt += (clamp(vy * 1.6, -0.5, 0.5) - this.tilt) * clamp(dt * 3, 0, 1);
    }
    this.prevY = this.y;
  };

  Character.prototype.stepWalk = function (dt, scene) {
    this.actionLeft -= dt;
    if (this.actionLeft <= 0) {
      // Yerdagilarga aylanish to'g'ri kelmaydi — ular yo yuradi, yo
      // to'xtaydi, yo yugurib qo'yadi.
      this.action = Math.random() < 0.3 ? 'rest' : (Math.random() < 0.25 ? 'dash' : 'swim');
      this.gasTarget = this.action === 'rest' ? rand(0, 0.15)
        : (this.action === 'dash' ? rand(1.8, 2.6) : rand(0.7, 1.2));
      this.actionLeft = rand(1.5, 4);
      // Vaqti-vaqti bilan orqaga buriladi — hamma bir tomonga yursa,
      // qator bo'lib ketayotgandek ko'rinadi.
      if (Math.random() < 0.25) this.dir = -this.dir;
    }
    this.gas += (this.gasTarget - this.gas) * clamp(dt * 2, 0, 1);

    var speed = 0.045 * this.speedScale * this.gas * (0.55 + 0.45 * this.z);
    this.x += this.dir * speed * dt;

    if (this.x > 0.98 && this.dir > 0) this.dir = -1;
    if (this.x < 0.02 && this.dir < 0) this.dir = 1;
    this.x = clamp(this.x, -0.04, 1.04);

    if (scene.ground) this.y = footLine(scene, this.z);
  };

  // ── sahna ────────────────────────────────────────────────────────────────

  function Engine(canvas, scene) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scene = scene;
    this.chars = [];
    this.loading = {};       // id → true, bir rasmni ikki marta yuklamaslik uchun
    // Yuklanmagan rasmlar. Ularsiz sahna har so'rovda (3 soniyada bir)
    // o'sha yo'q faylni qayta so'rayveradi: server jurnali 404 bilan
    // to'lib ketadi va haqiqiy nosozlik shu shovqin ichida ko'rinmay
    // qoladi. Bu odatiy hol — masalan, o'z rasmini papkadan o'chirgan.
    this.failed = {};
    this.bg = null;          // sahna fon rasmi (bo'lsa)
    this.ambient = [];
    this.running = false;
    this.last = 0;
    this.showNames = true;
    this.dpr = 1;
    this._resize = this.resize.bind(this);
    this.resize();
    this.initAmbient();
  }

  Engine.prototype.resize = function () {
    // Katta ekranda (televizor) piksel zichligi 1 bo'ladi, telefonda 2–3.
    // Zichlikni 2 bilan cheklaymiz: 3x da eski telefon sahnani sekin tortadi,
    // ko'zga esa farqi deyarli bilinmaydi.
    var dpr = Math.min(root.devicePixelRatio || 1, 2);
    var w = this.canvas.clientWidth || root.innerWidth;
    var h = this.canvas.clientHeight || root.innerHeight;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.w = w;
    this.h = h;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  // Fon jonlanishi: suvdagi pufakchalar, cho'ldagi chang, osmondagi bulut.
  // Bularsiz sahna, personajlar bo'lmaganda, o'lik gradient bo'lib qoladi —
  // bog'chada esa ekran ko'pincha bo'sh turadi va baribir chiroyli
  // ko'rinishi kerak.
  Engine.prototype.initAmbient = function () {
    var kind = this.scene.ambient;
    this.ambient = [];
    if (!kind) return;
    var n = kind === 'clouds' ? 6 : (kind === 'bubbles' ? 26 : 18);
    for (var i = 0; i < n; i++) {
      this.ambient.push({
        x: Math.random(),
        y: Math.random(),
        r: kind === 'clouds' ? rand(0.06, 0.16) : rand(0.002, 0.008),
        v: rand(0.3, 1) * (kind === 'clouds' ? 0.02 : 0.08),
        ph: rand(0, Math.PI * 2)
      });
    }
  };

  Engine.prototype.setScene = function (scene) {
    this.scene = scene;
    this.initAmbient();
    this.chars.forEach(function (c) {
      // Sahna almashsa, personajlar yangi qoidaga ko'chadi: akvariumdan
      // hayvonot bog'iga o'tganda baliq havoda suzib yurmasligi kerak.
      c.motion = scene.motion;
      // Yangi qoidaga o'tayotganda balandlik ham qayta hisoblanadi. Bunsiz
      // hayvonot bog'idan akvariumga o'tgan personajlar yer chizig'ida
      // qolib, hammasi ekranning pastida bir uyum bo'lib suzardi.
      if (scene.ground && scene.motion === 'walk') c.y = footLine(scene, c.z);
      else if (!scene.ground) c.y = rand(0.15, 0.85);
      else c.y = scene.ground + (NEAR_LINE - scene.ground) * Math.random();
    });
  };

  Engine.prototype.setBackground = function (url) {
    var self = this;
    if (!url) { this.bg = null; return Promise.resolve(); }
    return loadImage(url).then(function (img) { self.bg = img; },
      function () { self.bg = null; });   // fon yuklanmasa — gradient qoladi
  };

  // Ro'yxatni yangilash. Sahifa serverni har necha soniyada so'raydi,
  // shuning uchun bu chaqiruv tez-tez keladi: allaqachon sahnada yurgan
  // personajni qayta yuklamaymiz, aks holda u har so'rovda "yangidan
  // tug'ilib", joyidan sakrab turardi.
  Engine.prototype.setCharacters = function (list) {
    var self = this;
    var want = {};
    list.forEach(function (c) { want[c.id] = c; });

    // Ketganlarini olib tashlaymiz.
    this.chars = this.chars.filter(function (c) { return want[c.id]; });

    var have = {};
    this.chars.forEach(function (c) { have[c.id] = true; });

    list.forEach(function (c) {
      if (have[c.id] || self.loading[c.id] || self.failed[c.id]) return;
      self.loading[c.id] = true;
      loadImage(c.url).then(function (img) {
        delete self.loading[c.id];
        self.chars.push(new Character(img, {
          id: c.id, name: c.name, flip: c.flip, scale: c.scale,
          motion: c.motion || self.scene.motion
        }));
      }, function () {
        // Rasm buzuq yoki o'chirilgan — sahna baribir ishlayveradi, faqat
        // buni eslab qolamiz va qayta so'ramaymiz.
        delete self.loading[c.id];
        self.failed[c.id] = true;
      });
    });
  };

  Engine.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    root.addEventListener('resize', this._resize);
    var self = this;
    var loop = function (now) {
      if (!self.running) return;
      // dt ni cheklaymiz: ilova fonga o'tib qaytganda now sakrab ketadi va
      // cheklovsiz hamma personaj bir kadrda ekranning narigi chetiga
      // uchib ketardi.
      var dt = Math.min((now - self.last) / 1000, 0.05);
      self.last = now;
      self.frame(dt, now / 1000);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  };

  Engine.prototype.stop = function () {
    this.running = false;
    root.removeEventListener('resize', this._resize);
  };

  Engine.prototype.frame = function (dt, t) {
    var ctx = this.ctx, scene = this.scene;
    this.drawBackground(ctx, scene);
    this.stepAmbient(dt);
    this.drawAmbient(ctx, scene, 'back');

    var self = this;
    this.chars.forEach(function (c) { c.step(dt, t, scene, self); });
    // Uzoqdagilar avval chiziladi — yaqindagilari ularni yopadi.
    this.chars.slice().sort(function (a, b) { return a.z - b.z; })
      .forEach(function (c) { self.drawCharacter(ctx, c, t); });

    this.drawAmbient(ctx, scene, 'front');
  };

  Engine.prototype.drawBackground = function (ctx, scene) {
    var w = this.w, h = this.h;
    if (this.bg) {
      // Fon rasmini ekranga "cover" qilib joylaymiz: cho'zilgan fon
      // televizorda darrov ko'zga tashlanadi.
      var s = Math.max(w / this.bg.width, h / this.bg.height);
      var bw = this.bg.width * s, bh = this.bg.height * s;
      ctx.drawImage(this.bg, (w - bw) / 2, (h - bh) / 2, bw, bh);
      return;
    }
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, scene.sky[0]);
    g.addColorStop(1, scene.sky[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    if (scene.ground) {
      ctx.fillStyle = scene.floor;
      ctx.fillRect(0, scene.ground * h, w, h - scene.ground * h);
      // Yer chizig'ida yumshoq chegara: keskin chiziq kartondek ko'rinadi.
      var gg = ctx.createLinearGradient(0, scene.ground * h - h * 0.05, 0, scene.ground * h + h * 0.02);
      gg.addColorStop(0, 'rgba(0,0,0,0)');
      gg.addColorStop(1, 'rgba(0,0,0,0.18)');
      ctx.fillStyle = gg;
      ctx.fillRect(0, scene.ground * h - h * 0.05, w, h * 0.07);
    }
  };

  Engine.prototype.stepAmbient = function (dt) {
    var kind = this.scene.ambient;
    if (!kind) return;
    this.ambient.forEach(function (p) {
      if (kind === 'bubbles') {
        p.y -= p.v * dt;
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
      } else if (kind === 'clouds') {
        p.x += p.v * dt;
        if (p.x > 1.3) { p.x = -0.3; p.y = rand(0.05, 0.5); }
      } else {
        p.x += p.v * dt * 0.5;
        p.y += Math.sin(p.ph + p.x * 8) * dt * 0.02;
        if (p.x > 1.1) { p.x = -0.1; p.y = Math.random(); }
      }
    });
  };

  Engine.prototype.drawAmbient = function (ctx, scene, layer) {
    var kind = scene.ambient;
    if (!kind) return;
    // Bulutlar personajlar ortida, pufakcha va chang — oldida: pufakcha
    // oldinda bo'lsa suv haqiqiyroq, bulut oldinda bo'lsa qush yopilib qoladi.
    var front = (kind !== 'clouds');
    if ((layer === 'front') !== front) return;

    var w = this.w, h = this.h;
    ctx.save();
    if (kind === 'bubbles') {
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      this.ambient.forEach(function (p) {
        var r = p.r * h;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, r, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
      });
    } else if (kind === 'clouds') {
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      this.ambient.forEach(function (p) {
        var r = p.r * h;
        ctx.beginPath();
        ctx.ellipse(p.x * w, p.y * h, r * 1.8, r * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      ctx.fillStyle = kind === 'leaves' ? 'rgba(90,140,60,0.35)' : 'rgba(210,180,140,0.35)';
      this.ambient.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r * h * 1.6, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    ctx.restore();
  };

  // Personajni chizish — dvigatelning yuragi.
  //
  // Sprayt bir butun chizilsa, u ekranda sirg'anayotgan stikerga o'xshaydi.
  // Jonli ko'rinishi uchun tana **bo'ylab bo'lakka bo'linadi** va har bo'lak
  // sinus bilan siljitiladi — dumga yaqinlashgan sari kuchliroq. Bu suzish
  // va uchishga to'g'ri keladi.
  //
  // Yuradiganlar uchun bo'lak kerak emas: ular sakraydi va yerga tushganda
  // biroz yassilanadi — bu qadamning eng tanish belgisi.
  Engine.prototype.drawCharacter = function (ctx, c, t) {
    var w = this.w, h = this.h, img = c.img;

    // O'lcham sahna balandligiga bog'liq: televizorda ham, telefonda ham
    // personaj bir xil ulushni egallaydi.
    // Ekrandagi o'lcham: chuqurlik + turning tabiiy kattaligi. Kub ildiz
    // bilan yumshatiladi — aks holda ko'k kit ekranning yarmini egallab,
    // krevetka nuqta bo'lib qolardi.
    // Kerakli balandlik — **jonivorning** balandligi. Fayl undan kattaroq
    // bo'lgani uchun rasm shunga mos kattalashtiriladi: c.boxH rasmdagi
    // jonivor egallagan ulush.
    // Sonlar o'lchovga moslangan: jonivor egallagan ulush (c.boxH) odatda
    // 0.7 atrofida, ya'ni bo'luv rasmni ~1.4 barobar kattalashtiradi —
    // asosiy koeffitsient shuni hisobga oladi. 0.7 darajasi o'lcham
    // farqini ko'rinadigan qiladi: ko'k kit krevetkadan uch barobar
    // kattaroq bo'lib chiqadi, lekin ekranni egallab ketmaydi.
    var target = h * (0.07 + 0.10 * (c.z - Z_MIN) / (Z_MAX - Z_MIN))
      * Math.pow(c.bulk, 0.70) / c.boxH;
    var scale = target / img.height;
    var dw = img.width * scale, dh = img.height * scale;

    var x = c.x * w, y = c.y * h;

    // Yuradiganlar uchun c.y — oyoq chizig'i, markaz emas: sprayt markazi
    // bilan yerga qo'yilsa, personajning yarmi yer ostida qolib ketadi.
    // Suzadiganlarda esa c.y aynan markaz — suvda "oyoq chizig'i" yo'q.
    var footY = y;
    if (c.motion === 'walk') y -= dh / 2;

    // Paydo bo'lish: kattalashib, biroz oshib ketib joyiga o'tiradi.
    var pop = 1;
    if (c.entering) {
      var k = clamp(c.born / 1.2, 0, 1);
      pop = 1 + Math.sin(k * Math.PI) * 0.35 * (1 - k * 0.5);
    }

    ctx.save();
    ctx.translate(x, y);

    var flip = (c.face < 0 ? -1 : 1) * c.mirror;
    // Og'ish suzish yo'nalishi bo'yicha qo'llanadi: chapga suzayotgan
    // baliqning boshi ham yuqoriga ko'tarilishi kerak, pastga emas.
    if (c.tilt) ctx.rotate(c.tilt * (c.face < 0 ? -1 : 1));
    // |face| < 1 bo'lgan payt — burilish o'rtasi: sprayt yupqalashadi.
    var turn = Math.abs(c.face);
    ctx.scale(flip * Math.max(turn, 0.05) * pop, pop);

    if (c.motion === 'walk') {
      var hop = Math.abs(Math.sin(t * 3.2 * c.speedScale + c.phase));
      var squash = 1 + (1 - hop) * 0.10;     // yerga tushganda yassilanadi
      ctx.translate(0, -hop * dh * 0.10);
      ctx.scale(1 / squash, squash);
      // Yuradiganlar oyoq ostidan soya olishadi — soyasiz ular yerdan
      // uzilib qolgandek ko'rinadi.
      ctx.save();
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.globalAlpha = 0.18 * (1 - hop * 0.4);
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(x, footY, dw * (c.box.x1 - c.box.x0) * 0.34, dh * 0.04, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    } else if (c.motion === 'place') {
      // Xonadagi narsa "nafas oladi": zo'rg'a sezilarli, lekin muzlab
      // qolgan rasmdan butunlay boshqacha.
      var br = 1 + Math.sin(t * 1.4 + c.phase) * 0.015;
      ctx.scale(1, br);
      ctx.rotate(Math.sin(t * 0.7 + c.phase) * 0.012);
      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    } else {
      this.drawWavy(ctx, img, dw, dh, t, c);
    }

    ctx.restore();

    // Ism personajning ostida turadi: yuradiganda — oyoq chizig'idan sal
    // pastda, suzayotganda — spraytning ostida.
    if (this.showNames && c.name) {
      // Yorliq jonivorning ostida turadi. Rasmning pastida bo'sh joy
      // bo'lsa (ko'p rasmda shunday), fayl chetiga qo'yilgan ism jonivordan
      // uzilib qolardi.
      var below = y + dh * (c.box.y1 - 0.5) + dh * 0.04;
      this.drawName(ctx, c, x, (c.motion === 'walk' ? footY + dh * 0.04 : below));
    }
  };

  // Tanani bo'laklab to'lqinlantirish.
  //
  // Bo'lak soni tanlangan qiymat: 16 tada to'lqin silliq, ammo bir kadrda
  // 16 ta drawImage — 20 ta personajda 320 chaqiruv, bu arzon televizor
  // brauzeri uchun ham og'ir emas. Kattaroq son ko'zga hech narsa
  // qo'shmaydi, kichrayganda esa tana bo'g'inlarga bo'linib ko'rinadi.
  var SLICES = 16;

  Engine.prototype.drawWavy = function (ctx, img, dw, dh, t, c) {
    var n = SLICES;
    var sw = img.width / n;
    var dsw = dw / n;
    // Dum urishi ikki narsadan hisoblanadi: tanadan (katta sekin, mayda
    // tez — `beat`) va hozirgi tezlikdan (otilayotgani tez-tez uradi,
    // sirg'anayotgani deyarli qimirlatmaydi). Ikkisi bog'lanmasa, harakat
    // va animatsiya bir-biridan ajralib, o'yinchoqqa o'xshab qoladi.
    var speed = (c.motion === 'fly' ? c.beat * 1.7 : c.beat)
      * (0.5 + 0.7 * (c.gas || 1));
    // Kuch: katta tana keng, mayda tana tor uradi. `wave` cho'ziqlikdan
    // keladi — dumaloq tanada to'lqin deyarli yo'q.
    var maxAmp = dh * (c.motion === 'fly' ? 0.05 : 0.075)
      * c.wave * Math.pow(c.bulk, 0.35)
      * (0.6 + 0.5 * clamp(c.gas || 1, 0, 2));

    for (var i = 0; i < n; i++) {
      // Bosh — spraytning oldi tomoni (transformdan keyin doim o'ng tomon),
      // shuning uchun kuch chapga, dumga qarab o'sadi.
      var k = 1 - (i + 0.5) / n;
      var amp = maxAmp * k * k;              // bosh deyarli qimirlamaydi
      var dy = Math.sin(t * speed + c.phase - k * 3.4) * amp;

      // Manba va manzil kengligiga +1 piksel qo'shiladi: bo'laklar orasida
      // aks holda yupqa shaffof chiziqlar qoladi va rasm taroqqa o'xshaydi.
      ctx.drawImage(
        img,
        i * sw, 0, sw + 1, img.height,
        -dw / 2 + i * dsw, -dh / 2 + dy, dsw + 1, dh
      );
    }
  };

  // Ism — bog'cha uchun muhim qism: ekranda "bu meniki" degan javob
  // shu yerda turadi. Shuning uchun u qorong'i fonda ham, och fonda ham
  // o'qilishi kerak — matn atrofi qoraytiriladi.
  Engine.prototype.drawName = function (ctx, c, x, y) {
    var size = Math.max(13, this.h * 0.022);
    ctx.save();
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.font = '600 ' + size + 'px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.lineWidth = Math.max(3, size * 0.28);
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineJoin = 'round';
    ctx.strokeText(c.name, x, y);
    ctx.fillStyle = '#fff';
    ctx.fillText(c.name, x, y);
    ctx.restore();
  };

  root.Alive2D = {
    create: function (canvas, scene) { return new Engine(canvas, scene); }
  };
})(window);
