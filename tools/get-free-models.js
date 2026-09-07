// Bepul 3D modellarni yuklab oladi.
//
//   node tools/get-free-models.js
//   → assets/models/drop/ ga bir nechta model tushadi
//
// NEGA BU KERAK
//
// 3D sahna (/t/<kod>/tank) modelsiz bo'sh turadi, upstream esa modellarni
// sotib olingan pakdan oladi — u pullik va repozitoriyga qo'shib bo'lmaydi.
// Ya'ni loyihani ochgan odam 3D sahnani umuman ko'rmaydi va uni ishlashini
// tekshirib ham ko'ra olmaydi.
//
// Bu skript shuni hal qiladi: Khronos'ning rasmiy namuna to'plamidan bir
// nechta **CC0** modelni yuklab oladi. CC0 — mualliflik huquqidan butunlay
// voz kechilgan, ya'ni hech qanday shartsiz ishlatiladi.
//
// Bu to'plam kichik va u yerda dengiz jonivorlari deyarli yo'q. Maqsad ham
// akvariumni to'ldirish emas — 3D yo'l ishlashini pul sarflamasdan
// ko'rsatish. Ko'proq model kerak bo'lsa, assets/models/drop/README.md da
// qayerdan olish yozilgan.
//
// Yuklangan fayllar git'ga tushmaydi (.gitignore): ular bizniki emas,
// va har kim o'zi yuklab olgani ma'qul.

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT = path.join(__dirname, '..', 'assets', 'models', 'drop');

const BASE = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models';

// Fayl nomidagi «@» dan keyingi son — jonivorning sahnadagi uzunligi
// (akvarium ichi 24 birlik). Uni fayldan bilib bo'lmaydi: modellarda
// masshtab ixtiyoriy va krevetka kit kattaligida bo'lishi odatiy hol.
const MODELS = [
  {
    file: 'barramundi@2.6.glb',
    url: BASE + '/BarramundiFish/glTF-Binary/BarramundiFish.glb',
    note: 'Barramundi baliq — haqiqiy baliq, akvariumga to‘g‘ri keladi'
  },
  {
    file: 'tulki@2.4.glb',
    url: BASE + '/Fox/glTF-Binary/Fox.glb',
    note: 'Tulki — animatsiyali (yuradi, yuguradi); hayvonot bog‘i uchun'
  },
  {
    file: 'o‘rdak@1.6.glb',
    url: BASE + '/Duck/glTF-Binary/Duck.glb',
    note: 'O‘rdak — animatsiyasiz, sahna tanasini o‘zi egadi'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      // GitHub qayta yo'naltirishi mumkin — ergashamiz.
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return download(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error('HTTP ' + res.statusCode));
      }
      // Vaqtinchalik nomga yozamiz: yuklash uzilib qolsa, papkada yarim
      // fayl qolib, sahna uni ochishga urinib xato bermasin.
      const tmp = dest + '.part';
      const out = fs.createWriteStream(tmp);
      res.pipe(out);
      out.on('finish', () => out.close(() => {
        fs.renameSync(tmp, dest);
        resolve(fs.statSync(dest).size);
      }));
      out.on('error', (e) => { try { fs.unlinkSync(tmp); } catch (x) {} reject(e); });
    });
    req.on('error', reject);
    req.setTimeout(120000, () => req.destroy(new Error('vaqt tugadi')));
  });
}

(async function () {
  fs.mkdirSync(OUT, { recursive: true });
  let ok = 0;

  for (const m of MODELS) {
    const dest = path.join(OUT, m.file);
    if (fs.existsSync(dest)) {
      console.log(`  o'tkazildi (bor): ${m.file}`);
      ok++;
      continue;
    }
    process.stdout.write(`  yuklanyapti: ${m.file} … `);
    try {
      const size = await download(m.url, dest);
      console.log(`${Math.round(size / 1024)} KB — ${m.note}`);
      ok++;
    } catch (e) {
      console.log(`chiqmadi (${e.message})`);
    }
  }

  console.log('');
  if (ok) {
    console.log(`${ok} ta model tayyor → assets/models/drop/`);
    console.log('Ko\'rish uchun: node server.js, keyin /t/<kod>/tank');
  } else {
    console.log('Hech narsa yuklanmadi — internet ulanishini tekshiring.');
  }
  console.log('Litsenziya: CC0 (Khronos glTF-Sample-Assets). Ko\'proq model:');
  console.log('assets/models/drop/README.md');
})();
