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

  // ── personaj ─────────────────────────────────────────────────────────────
  //
  // Bitta jonlangan rasm. O'zining joyini, tezligini va "hayot fazasi"ni
  // biladi. Faza har bir personajda tasodifiy boshlanadi: aks holda ekrandagi
  // hamma baliq bir vaqtda, bir xil qimirlab, mashinaga o'xshab qolardi.

  function Character(img, opts) {
    this.img = img;
    this.id = opts.id;
    this.name = opts.name || '';
    this.motion = opts.motion || 'swim';

    // Chuqurlik: 0 — eng uzoq, 1 — eng yaqin. O'lchamga ham, tartibga ham
    // ta'sir qiladi, shuning uchun sahna tekis emas, hajmli ko'rinadi.
    this.z = rand(Z_MIN, Z_MAX);

    this.dir = Math.random() < 0.5 ? -1 : 1;
    // Ko'rinadigan yo'nalish alohida: burilish bir zumda emas, sprayt
    // gorizontal siqilib, keyin ochilib buriladi — shunda burilish
    // "sakrash" emas, harakat bo'lib ko'rinadi.
    this.face = this.dir;

    this.phase = rand(0, Math.PI * 2);
    this.speedScale = rand(0.75, 1.35);

    this.x = Math.random();
    this.y = rand(0.15, 0.85);
    this.driftPhase = rand(0, Math.PI * 2);

    // Yangi personaj sahnaga "paydo bo'lish" bilan kiradi: kattalashib,
    // biroz sakrab joylashadi. Bu bolaning "meniki chiqdi!" lahzasi —
    // sahnaga jimgina qo'shilib qo'yish uni yo'qotadi.
    this.born = 0;
    this.entering = true;
  }

  Character.prototype.step = function (dt, t, scene, view) {
    var m = this.motion;

    this.born += dt;
    if (this.born > 1.2) this.entering = false;

    // Ko'rinadigan yo'nalish haqiqiy yo'nalishga asta yetib boradi.
    this.face += (this.dir - this.face) * clamp(dt * 6, 0, 1);

    if (m === 'place') return;   // xonadagi narsa joyidan jilmaydi

    var base = (m === 'walk') ? 0.045 : (m === 'fly' ? 0.085 : 0.06);
    // Uzoqdagilar sekinroq suzadi — perspektivada shunday ko'rinadi.
    var speed = base * this.speedScale * (0.55 + 0.45 * this.z);

    this.x += this.dir * speed * dt;

    // Chetga yetganda yo'qolib ketmaydi, buriladi. Ekrandan chiqib ketish
    // katta ekranda "rasmim yo'qoldi" degan taassurot beradi.
    if (this.x > 1.05) { this.x = 1.05; this.dir = -1; }
    if (this.x < -0.05) { this.x = -0.05; this.dir = 1; }

    if (m === 'swim' || m === 'fly') {
      // Vertikal siljish — sekin, uzun to'lqin. Tananing to'lqinlanishi
      // (pastda, chizishda) tez; ikkalasi bir xil chastotada bo'lsa,
      // harakat sun'iy ko'rinadi.
      this.driftPhase += dt * (m === 'fly' ? 0.9 : 0.55) * this.speedScale;
      var amp = (m === 'fly') ? 0.10 : 0.06;
      this.y = clamp(this.y + Math.sin(this.driftPhase) * amp * dt, 0.08, 0.88);
    }

    // Yuradiganlar hammasi bitta chiziqda tursa, ekranda bir-birining ustiga
    // mingashib, tirbandlik bo'lib qoladi. Shuning uchun yer chizig'i
    // chuqurlikka bog'liq: uzoqdagisi balandroq turadi va kichikroq
    // chiziladi — bu tekis rasmga chuqurlik beradigan eng arzon usul.
    if (m === 'walk' && scene.ground) this.y = footLine(scene, this.z);
  };

  // ── sahna ────────────────────────────────────────────────────────────────

  function Engine(canvas, scene) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scene = scene;
    this.chars = [];
    this.loading = {};       // id → true, bir rasmni ikki marta yuklamaslik uchun
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
      if (scene.motion === 'walk' && scene.ground) c.y = footLine(scene, c.z);
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
      if (have[c.id] || self.loading[c.id]) return;
      self.loading[c.id] = true;
      loadImage(c.url).then(function (img) {
        delete self.loading[c.id];
        self.chars.push(new Character(img, {
          id: c.id, name: c.name, motion: c.motion || self.scene.motion
        }));
      }, function () {
        delete self.loading[c.id];   // rasm buzuq — sahna baribir ishlayveradi
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
    var target = h * (0.13 + 0.19 * (c.z - Z_MIN) / (Z_MAX - Z_MIN));
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

    var flip = c.face < 0 ? -1 : 1;
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
      ctx.ellipse(x, footY, dw * 0.32, dh * 0.05, 0, 0, Math.PI * 2);
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
      this.drawName(ctx, c, x, (c.motion === 'walk' ? footY + dh * 0.04 : y + dh * 0.55));
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
    var speed = (c.motion === 'fly' ? 7.5 : 4.2) * c.speedScale;
    var maxAmp = dh * (c.motion === 'fly' ? 0.05 : 0.07);

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
