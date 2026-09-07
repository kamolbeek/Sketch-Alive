// Tayyor personajlarni yig'adigan skript.
//
//   node tools/make-creatures.js
//   → assets/creatures/<id>.svg  +  assets/creatures/manifest.json
//
// RASMLARNI O'ZIMIZ CHIZMAYMIZ
//
// Avval bu skript jonivorlarni noldan chizardi va natija yomon edi: bir
// qarashda «qo'lbola» ekani bilinib turardi. Endi manba — professional
// dizaynerlar chizgan, ochiq litsenziyali to'plamlar:
//
//   assets/creatures/base/   — Twemoji, rangli (CC-BY 4.0)
//   assets/coloring/outline/ — OpenMoji, kontur (CC-BY-SA 4.0)
//
// Ular repozitoriyga ko'chirib qo'yilgan: shunda `npm install` kerak
// bo'lmaydi va loyiha bog'liqliksizligicha qoladi. Mualliflik va
// litsenziya — NOTICE.md da.
//
// BU SKRIPT NIMA QILADI
//
// Tayyor rasmlar ikki joyda bizga to'g'ri kelmaydi:
//
//   1. Ular tekis. Emoji kichkina ikonka uchun chizilgan, televizor
//      ekranida esa yassi qog'oz parchasiga o'xshaydi. Shuning uchun
//      ustiga hajm qatlami qo'yiladi — yorug'lik va soya.
//   2. Ko'pchiligi chapga qaraydi. Dvigatel (assets/alive2d.js) esa bosh
//      o'ngda deb hisoblaydi: tanani to'lqinlantirganda boshni qimirlatmay,
//      kuchni dumga qarab oshiradi. Chapga qaragan rasm teskari suzardi.
//
// Hajm qatlami rasmning **o'z shakli bo'yicha** qirqiladi. Shakl har xil va
// oldindan noma'lum, shuning uchun kontur yo'li emas, maska ishlatiladi:
// rasmning shaffofligi oq rangga aylantirilib, soya o'sha maska ichida
// qoladi. Shu tufayli usul har qanday rasmga ishlaydi — biz ko'rmagan
// yangisiga ham.

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = path.join(ROOT, 'assets', 'creatures', 'base');
const OUT = path.join(ROOT, 'assets', 'creatures');

// ── turlar ─────────────────────────────────────────────────────────────────
//
// `flip` — manba rasm chapga qaraydimi.
// `nick` — jonivorning ismi. Bolalar «bu Otabek baliq» deb eslab qolishadi,
// quruq «masxaraboz baliq»dan ko'ra bu yaxshiroq yopishadi; ism chop
// etiladigan varaqda ham turadi.

const SPECIES = [
  { id: 'clownfish',  flip: true,  nick: 'Otabek',  titles: { uz: 'Masxaraboz baliq', ru: 'Рыба-клоун', en: 'Clownfish' } },
  { id: 'fish',       flip: true,  nick: 'Sardor',  titles: { uz: 'Baliq', ru: 'Рыбка', en: 'Fish' } },
  { id: 'pufferfish', flip: true,  nick: 'Anvar',   titles: { uz: 'Kirpi baliq', ru: 'Рыба-ёж', en: 'Pufferfish' } },
  { id: 'shark',      flip: true,  nick: 'Bahodir', titles: { uz: 'Akula', ru: 'Акула', en: 'Shark' } },
  { id: 'dolphin',    flip: true,  nick: 'Dilnoza', titles: { uz: 'Delfin', ru: 'Дельфин', en: 'Dolphin' } },
  { id: 'whale',      flip: true,  nick: 'Bekzod',  titles: { uz: 'Kit', ru: 'Кит', en: 'Whale' } },
  { id: 'bluewhale',  flip: true,  nick: 'Rustam',  titles: { uz: 'Ko‘k kit', ru: 'Синий кит', en: 'Blue whale' } },
  { id: 'octopus',    flip: false, nick: 'Sakkiz',  titles: { uz: 'Sakkizoyoq', ru: 'Осьминог', en: 'Octopus' } },
  { id: 'squid',      flip: false, nick: 'Kamol',   titles: { uz: 'Kalmar', ru: 'Кальмар', en: 'Squid' } },
  { id: 'shrimp',     flip: true,  nick: 'Nodira',  titles: { uz: 'Krevetka', ru: 'Креветка', en: 'Shrimp' } },
  { id: 'lobster',    flip: false, nick: 'Temur',   titles: { uz: 'Omar', ru: 'Омар', en: 'Lobster' } },
  { id: 'crab',       flip: false, nick: 'Qisqich', titles: { uz: 'Qisqichbaqa', ru: 'Краб', en: 'Crab' } },
  { id: 'shell',      flip: false, nick: 'Sadaf',   titles: { uz: 'Chig‘anoq', ru: 'Ракушка', en: 'Shell' } },
  { id: 'turtle',     flip: true,  nick: 'Toshbo‘', titles: { uz: 'Toshbaqa', ru: 'Черепаха', en: 'Turtle' } },
  { id: 'jellyfish',  flip: false, nick: 'Malika',  titles: { uz: 'Meduza', ru: 'Медуза', en: 'Jellyfish' } },
  { id: 'seal',       flip: true,  nick: 'Zilola',  titles: { uz: 'Tyulen', ru: 'Тюлень', en: 'Seal' } },
  { id: 'crocodile',  flip: true,  nick: 'Alisher', titles: { uz: 'Timsoh', ru: 'Крокодил', en: 'Crocodile' } },
  { id: 'otter',      flip: true,  nick: 'Doston',  titles: { uz: 'Suvsar', ru: 'Выдра', en: 'Otter' } },
  { id: 'penguin',    flip: false, nick: 'Jasur',   titles: { uz: 'Pingvin', ru: 'Пингвин', en: 'Penguin' } },
  { id: 'coral',      flip: false, nick: 'Marjon',  titles: { uz: 'Marjon', ru: 'Коралл', en: 'Coral' } }
];

// ── manba SVG'ni qismlarga ajratish ────────────────────────────────────────

function readBase(id) {
  const src = fs.readFileSync(path.join(BASE, id + '.svg'), 'utf8');

  const vb = src.match(/viewBox\s*=\s*"([^"]+)"/);
  if (!vb) throw new Error(id + ': viewBox topilmadi');

  // Ichki mazmun — tashqi <svg> tegisiz. U <defs> ichiga solinadi va ikki
  // marta ishlatiladi: bir marta ko'rinadigan rasm, bir marta soya maskasi.
  const inner = src.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
  const [, , w, h] = vb[1].trim().split(/\s+/).map(Number);
  return { viewBox: vb[1].trim(), w, h, inner };
}

// ── hajm qatlami ───────────────────────────────────────────────────────────
//
// Bitta gradient yuqoridan yorug'lik va pastdan soya beradi, ustiga
// yumshoq yaltiroq dog' qo'shiladi. Kuchi ataylab o'rtacha: manba rasmning
// o'z ranglari bor va soya ularni bosib ketmasligi kerak. Maqsad — rasmni
// o'zgartirish emas, unga hajm qo'shish.

function shading(w, h) {
  const blur = (Math.min(w, h) * 0.12).toFixed(2);
  return `  <filter id="sa-alpha">
    <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/>
  </filter>
  <filter id="sa-soft" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="${blur}"/>
  </filter>
  <mask id="sa-mask">
    <g filter="url(#sa-alpha)"><use href="#sa-art"/></g>
  </mask>
  <linearGradient id="sa-vol" x1="0.2" y1="0" x2="0.5" y2="1">
    <stop offset="0"    stop-color="#ffffff" stop-opacity="0.34"/>
    <stop offset="0.42" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="0.68" stop-color="#000000" stop-opacity="0"/>
    <stop offset="1"    stop-color="#000000" stop-opacity="0.34"/>
  </linearGradient>`;
}

function build(sp) {
  const b = readBase(sp.id);

  // Manba viewBox kichkina (36 px). Brauzer SVG'ni <img> sifatida o'zining
  // o'lchamida rasterlaydi, canvas esa kattalashtiradi — shuning uchun aniq
  // o'lcham beriladi. 12 barobar = ~432 px, televizorga yetarli.
  const RASTER = 12;

  // Chapga qaragan rasm ko'zguda aylantiriladi. Aylantirish `sa-art` ning
  // o'ziga qo'llanadi, maska ham o'shandan olinadi — shuning uchun soya
  // ham to'g'ri tomonda qoladi.
  const flip = sp.flip ? ` transform="translate(${b.w},0) scale(-1,1)"` : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${b.viewBox}" `
    + `width="${Math.round(b.w * RASTER)}" height="${Math.round(b.h * RASTER)}">
<title>${sp.titles.en}</title>
<defs>
  <g id="sa-art"${flip}>
${b.inner}
  </g>
${shading(b.w, b.h)}
</defs>
<use href="#sa-art"/>
<g mask="url(#sa-mask)">
  <rect x="0" y="0" width="${b.w}" height="${b.h}" fill="url(#sa-vol)"/>
  <ellipse cx="${(b.w * 0.42).toFixed(2)}" cy="${(b.h * 0.28).toFixed(2)}"
           rx="${(b.w * 0.26).toFixed(2)}" ry="${(b.h * 0.16).toFixed(2)}"
           fill="#ffffff" opacity="0.22" filter="url(#sa-soft)"/>
</g>
</svg>
`;
}

// ── yig'ish ────────────────────────────────────────────────────────────────

const manifest = { version: 2, scene: 'aquarium', creatures: [] };
const seen = new Set();

for (const sp of SPECIES) {
  if (seen.has(sp.id)) throw new Error('takrorlangan id: ' + sp.id);
  seen.add(sp.id);
  fs.writeFileSync(path.join(OUT, sp.id + '.svg'), build(sp));
  manifest.creatures.push({
    id: sp.id,
    scene: 'aquarium',
    nick: sp.nick,
    titles: sp.titles,
    url: '/assets/creatures/' + sp.id + '.svg'
  });
}

fs.writeFileSync(
  path.join(OUT, 'manifest.json'),
  JSON.stringify(manifest, null, 1) + '\n'
);

console.log(`${SPECIES.length} ta jonivor yig'ildi → assets/creatures/`);
