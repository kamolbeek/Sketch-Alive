// Vercel uchun kirish nuqtasi.
//
// Vercel'da server port tinglamaydi: platforma har so'rovda shu faylni
// chaqiradi. Shuning uchun server.js dagi handle() ni eksport qilamiz.
//
// Ma'lumotlar /tmp ga yoziladi — Vercel'da loyiha papkasi faqat o'qish
// uchun. Bu vaqtinchalik xotira: har instansiya o'ziniki va u to'xtaganda
// bo'shaydi. Ya'ni bu joylashtirish **ko'rib turish uchun** — bog'chada
// doimiy ishlash uchun disk bor server kerak (README, «Joylashtirish»).
//
// AQUA_DATA_DIR server.js yuklanishidan OLDIN o'rnatilishi shart: u modul
// ochilganda o'qiladi va papka o'sha zahoti yaratiladi.
process.env.AQUA_DATA_DIR = process.env.AQUA_DATA_DIR || '/tmp/sketch-alive';

const { handle } = require('../server.js');

module.exports = (req, res) => {
  // Rewrite orqali kelganda ba'zi muhitlarda req.url manzil o'rniga
  // funksiyaning o'z yo'lini ko'rsatadi. Asl manzil sarlavhada bo'lsa,
  // o'shani olamiz.
  const orig = req.headers['x-vercel-original-path'] || req.headers['x-forwarded-uri'];
  if (orig && /^\/api\/index(\.js)?(\?|$)/.test(req.url)) req.url = orig;
  return handle(req, res);
};
