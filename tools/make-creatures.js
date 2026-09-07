// Tayyor personajlarni yasaydigan skript.
//
//   node tools/make-creatures.js
//   → assets/creatures/<id>.svg  +  assets/creatures/manifest.json
//
// NEGA ULAR KERAK
//
// Sahna bo'sh ochilsa, bog'chada birinchi ko'rinadigan narsa — hech narsa.
// Tarbiyachi ekranni yoqadi, bolalar qaraydi, u yerda esa fon. Upstream bu
// muammoni sotib olingan 3D pak bilan hal qilgan: menyuda «tayyor baliqni
// qo'yib yuborish» bor, lekin u faqat pak sotib olinganda ishlaydi.
//
// Bizda tayyor personajlar loyihaning o'zida yotadi — SVG bo'lib. Bu:
//   • hech narsa sotib olinmaydi va litsenziya masalasi yo'q — o'zimizniki;
//   • yigirmatasi birgalikda 100 KB ga ham yetmaydi, ya'ni sekin internetda
//     ham darrov ochiladi;
//   • vektor bo'lgani uchun 4K televizorda ham donadorlashmaydi.
//
// NEGA SKRIPT, TAYYOR FAYL EMAS
//
// Yigirma faylni qo'lda tahrirlash — yigirma joyda bir xil xatoni tuzatish.
// Bu yerda uslub bir joyda turadi: ko'z, og'iz, kontur qalinligi. Shaklni
// o'zgartirsang, skriptni qayta ishga tushirasan.
//
// YO'NALISH
//
// Hamma jonivor **o'ngga qaraydi**. Dvigatel (assets/alive2d.js) chapga
// suzayotganda spraytni ko'zgu qilib aylantiradi va tanani to'lqinlantirganda
// boshni qimirlatmay, dumga qarab kuchni oshiradi — u bosh o'ng tomonda deb
// hisoblaydi. Chapga qaragan rasm teskari suzadi.

'use strict';

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'creatures');

// ── umumiy qismlar ─────────────────────────────────────────────────────────

// Ko'z. Bolalar rasmida ko'z eng muhim detal: usiz shakl narsaga o'xshaydi,
// ko'z qo'yilishi bilan jonivorga aylanadi. Shuning uchun u hamma joyda bir
// xil — oq doira, qora qorachiq va kichkina yorug'lik nuqtasi.
function eye(cx, cy, r) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>` +
    `<circle cx="${cx + r * 0.18}" cy="${cy}" r="${r * 0.48}" fill="#17202a"/>` +
    `<circle cx="${cx + r * 0.02}" cy="${cy - r * 0.34}" r="${r * 0.19}" fill="#fff"/>`;
}

// Og'iz — bitta qisqa yoy. Kulgichga o'xshab ketmasligi uchun ataylab
// juda kichik: bolalar chizgan jonivorlar orasida bu tayyorlari
// ajralib turmasligi kerak.
function smile(x, y, w) {
  return `<path d="M${x},${y} q${w / 2},${w * 0.34} ${w},0" fill="none" ` +
    `stroke="#17202a" stroke-width="3" stroke-linecap="round" opacity=".55"/>`;
}

// ── turlar ─────────────────────────────────────────────────────────────────
//
// Har birining o'z siluetи bor: dumaloq, uzun, yassi, oyoqli, shoxli.
// Bir xil oval jism rangi bilan farqlansa — bu yigirma tur emas, bitta tur
// yigirma rangda; ekranda bu darrov bilinadi.

const SPECIES = [
  {
    id: 'clownfish',
    titles: { uz: 'Masxaraboz baliq', ru: 'Рыба-клоун', en: 'Clownfish' },
    vb: '0 0 220 132',
    body: 'M56,66 C56,34 92,16 136,18 C178,20 206,42 212,66 C206,90 178,112 136,114 C92,116 56,98 56,66 Z',
    art: `
      <path d="M60,66 L12,18 Q28,66 12,114 Z" fill="#d8551a"/>
      <path d="M96,28 C118,6 152,8 162,22 L146,40 Z" fill="#d8551a"/>
      <path d="M104,106 C124,126 152,124 160,112 L142,94 Z" fill="#d8551a"/>
      <path d="%BODY%" fill="#f5822f"/>
      <g clip-path="url(#c)">
        <path d="M60,0 L90,0 L76,132 L46,132 Z" fill="#1b232c"/>
        <path d="M66,0 L85,0 L71,132 L52,132 Z" fill="#ffffff"/>
        <path d="M118,0 L148,0 L136,132 L106,132 Z" fill="#1b232c"/>
        <path d="M124,0 L143,0 L131,132 L112,132 Z" fill="#ffffff"/>
        <path d="M164,0 L188,0 L180,132 L156,132 Z" fill="#1b232c"/>
        <path d="M169,0 L183,0 L175,132 L161,132 Z" fill="#ffffff"/>
      </g>
      ${eye(197, 57, 9)}
      ${smile(200, 78, 12)}`
  },
  {
    id: 'bluetang',
    titles: { uz: 'Ko‘k tang', ru: 'Голубой хирург', en: 'Blue tang' },
    vb: '0 0 214 148',
    body: 'M44,74 C44,36 84,16 126,20 C170,24 200,48 206,74 C200,100 170,124 126,128 C84,132 44,112 44,74 Z',
    art: `
      <path d="M50,74 L8,26 Q22,74 8,122 Z" fill="#f2c53d"/>
      <path d="M88,26 C118,8 148,14 158,28 L140,42 Z" fill="#1f6fd0"/>
      <path d="M92,122 C120,140 148,134 158,120 L140,106 Z" fill="#1f6fd0"/>
      <path d="%BODY%" fill="#2a7fe0"/>
      <g clip-path="url(#c)">
        <path d="M92,28 C128,38 148,66 154,104 C142,120 118,124 104,116
                 C116,82 104,54 82,42 Z" fill="#16233c"/>
        <path d="M44,44 L74,44 L58,104 L36,104 Z" fill="#16233c" opacity=".35"/>
      </g>
      ${eye(180, 62, 9)}
      ${smile(186, 84, 11)}`
  },
  {
    id: 'angelfish',
    titles: { uz: 'Farishta baliq', ru: 'Скалярия', en: 'Angelfish' },
    // Skalyariya ekranda faqat balandligi bilan tanilaadi: eni bo'yiga
    // yetsa, u oddiy baliqqa aylanadi. Shuning uchun viewBox baland va
    // qanotlar tanadan uzoqqa cho'ziladi.
    vb: '0 0 176 262',
    body: 'M38,130 C42,80 64,38 92,32 C118,26 142,66 152,130 C142,194 118,234 92,228 C64,222 42,180 38,130 Z',
    art: `
      <path d="M96,36 C88,10 70,0 44,2 C58,16 70,34 78,58 Z" fill="#e0c977"/>
      <path d="M56,34 C46,16 34,8 22,8 C34,24 44,44 50,62 Z" fill="#e0c977"/>
      <path d="M96,224 C88,250 70,260 44,258 C58,244 70,226 78,202 Z" fill="#e0c977"/>
      <path d="M56,226 C46,244 34,252 22,252 C34,236 44,216 50,198 Z" fill="#e0c977"/>
      <path d="M44,130 L6,74 Q20,130 6,186 Z" fill="#e0c977"/>
      <path d="%BODY%" fill="#f2e2ab"/>
      <g clip-path="url(#c)">
        <path d="M52,0 L80,0 L66,262 L38,262 Z" fill="#2f353f"/>
        <path d="M106,0 L132,0 L122,262 L96,262 Z" fill="#2f353f"/>
      </g>
      ${eye(136, 108, 9)}
      ${smile(140, 132, 11)}`
  },
  {
    id: 'butterflyfish',
    titles: { uz: 'Kapalak baliq', ru: 'Рыба-бабочка', en: 'Butterflyfish' },
    vb: '0 0 190 158',
    body: 'M40,80 C40,40 76,20 114,22 C152,24 178,50 182,80 C178,110 152,136 114,138 C76,140 40,120 40,80 Z',
    art: `
      <path d="M46,80 L8,34 Q22,80 8,126 Z" fill="#f0a92c"/>
      <path d="M78,28 C104,6 136,12 146,28 L128,42 Z" fill="#f7c53f"/>
      <path d="M82,132 C108,152 136,146 146,130 L128,116 Z" fill="#f7c53f"/>
      <path d="%BODY%" fill="#fbd651"/>
      <g clip-path="url(#c)">
        <path d="M60,0 L86,0 L120,158 L94,158 Z" fill="#fff" opacity=".45"/>
        <path d="M100,0 L126,0 L160,158 L134,158 Z" fill="#fff" opacity=".45"/>
        <path d="M146,0 L172,0 L172,158 L146,158 Z" fill="#22303c" opacity=".9"/>
      </g>
      ${eye(158, 62, 9)}
      ${smile(166, 88, 10)}`
  },
  {
    id: 'seahorse',
    titles: { uz: 'Dengiz oti', ru: 'Морской конёк', en: 'Seahorse' },
    // Dengiz oti ingichka chizilsa ekranda chiziqqa aylanadi va uzoqdan
    // umuman ko'rinmaydi. Tana ataylab yo'g'on: siluet tanilishi kerak.
    vb: '0 0 148 216',
    body: 'M96,34 C118,42 124,66 116,84 C108,102 88,110 82,126 C76,144 88,158 88,172 C88,192 70,204 50,200 C30,196 22,178 30,164 C40,146 60,148 64,136 C70,116 56,104 58,82 C60,54 74,26 96,34 Z',
    art: `
      <path d="M58,64 C34,66 20,88 24,110 C36,98 48,90 58,86 Z" fill="#dd8018"/>
      <path d="M62,128 C40,134 30,154 34,172 C46,158 58,150 68,146 Z" fill="#dd8018"/>
      <path d="%BODY%" fill="#f6a12c"/>
      <path d="M108,42 C126,36 142,44 144,54 C132,56 116,54 106,54 Z" fill="#f6a12c"/>
      <path d="M92,30 C90,10 80,0 68,0 C76,10 82,20 84,32 Z" fill="#dd8018"/>
      <path d="M72,20 C64,6 54,2 46,4 C56,12 62,22 66,32 Z" fill="#dd8018"/>
      <g clip-path="url(#c)" opacity=".26">
        <path d="M20,74 L128,74 L128,81 L20,81 Z" fill="#7a3c00"/>
        <path d="M20,98 L128,98 L128,105 L20,105 Z" fill="#7a3c00"/>
        <path d="M20,122 L128,122 L128,129 L20,129 Z" fill="#7a3c00"/>
        <path d="M20,146 L128,146 L128,153 L20,153 Z" fill="#7a3c00"/>
        <path d="M20,170 L128,170 L128,177 L20,177 Z" fill="#7a3c00"/>
      </g>
      ${eye(106, 56, 8)}`
  },
  {
    id: 'turtle',
    titles: { uz: 'Toshbaqa', ru: 'Черепаха', en: 'Turtle' },
    vb: '0 0 216 154',
    body: 'M42,76 C42,40 76,22 116,22 C156,22 186,40 186,76 C186,112 156,130 116,130 C76,130 42,112 42,76 Z',
    art: `
      <path d="M62,34 C40,14 20,14 14,26 C22,38 40,46 58,48 Z" fill="#4f8f4a"/>
      <path d="M62,118 C40,138 20,138 14,126 C22,114 40,106 58,104 Z" fill="#4f8f4a"/>
      <path d="M160,34 C180,18 198,20 202,32 C194,42 178,48 162,48 Z" fill="#4f8f4a"/>
      <path d="M160,118 C180,134 198,132 202,120 C194,110 178,104 162,104 Z" fill="#4f8f4a"/>
      <path d="M170,76 C170,58 186,46 200,48 C212,50 214,66 208,78 C202,92 186,96 176,92 Z" fill="#5aa254"/>
      <path d="%BODY%" fill="#3f7f52"/>
      <g clip-path="url(#c)">
        <g fill="none" stroke="#2c5f3c" stroke-width="5" opacity=".8">
          <path d="M74,22 L74,130 M116,20 L116,132 M158,22 L158,130"/>
          <path d="M42,54 L186,54 M42,98 L186,98"/>
        </g>
        <ellipse cx="116" cy="76" rx="26" ry="18" fill="#4f9463"/>
      </g>
      ${eye(198, 62, 7)}`
  },
  {
    id: 'jellyfish',
    titles: { uz: 'Meduza', ru: 'Медуза', en: 'Jellyfish' },
    vb: '0 0 156 212',
    body: 'M14,88 C14,44 46,14 78,14 C110,14 142,44 142,88 C142,100 132,106 118,102 C104,98 96,104 78,104 C60,104 52,98 38,102 C24,106 14,100 14,88 Z',
    art: `
      <g fill="none" stroke="#d17ab8" stroke-width="7" stroke-linecap="round" opacity=".85">
        <path d="M34,100 C26,130 42,150 32,182"/>
        <path d="M52,104 C46,138 60,158 50,196"/>
        <path d="M78,106 C74,142 88,164 78,204"/>
        <path d="M104,104 C110,138 96,158 106,196"/>
        <path d="M122,100 C130,130 114,150 124,182"/>
      </g>
      <path d="%BODY%" fill="#e79ccd" opacity=".92"/>
      <g clip-path="url(#c)" opacity=".55">
        <ellipse cx="52" cy="46" rx="18" ry="12" fill="#fff"/>
        <ellipse cx="96" cy="40" rx="10" ry="7" fill="#fff"/>
        <path d="M14,78 L142,78 L142,86 L14,86 Z" fill="#c96fb0"/>
      </g>
      ${eye(94, 62, 9)}
      ${eye(58, 64, 9)}
      ${smile(70, 82, 14)}`
  },
  {
    id: 'octopus',
    titles: { uz: 'Sakkizoyoq', ru: 'Осьминог', en: 'Octopus' },
    vb: '0 0 200 190',
    body: 'M40,72 C40,32 68,8 100,8 C132,8 160,32 160,72 C160,100 142,118 100,118 C58,118 40,100 40,72 Z',
    art: `
      <g fill="none" stroke="#b84d8f" stroke-width="13" stroke-linecap="round">
        <path d="M52,106 C34,128 40,152 22,164"/>
        <path d="M72,114 C60,140 68,160 50,178"/>
        <path d="M94,118 C90,146 98,164 84,184"/>
        <path d="M118,116 C124,144 118,164 134,182"/>
        <path d="M140,108 C154,132 150,154 170,166"/>
        <path d="M156,92 C176,108 182,128 194,134"/>
      </g>
      <path d="%BODY%" fill="#cf5ba0"/>
      <g clip-path="url(#c)" opacity=".35">
        <circle cx="72" cy="30" r="9" fill="#fff"/>
        <circle cx="118" cy="24" r="6" fill="#fff"/>
        <circle cx="140" cy="46" r="5" fill="#fff"/>
      </g>
      ${eye(124, 64, 13)}
      ${eye(74, 66, 13)}
      ${smile(88, 92, 18)}`
  },
  {
    id: 'crab',
    titles: { uz: 'Qisqichbaqa', ru: 'Краб', en: 'Crab' },
    vb: '0 0 212 152',
    body: 'M34,84 C34,52 68,32 106,32 C144,32 178,52 178,84 C178,106 148,118 106,118 C64,118 34,106 34,84 Z',
    art: `
      <g fill="none" stroke="#c0391f" stroke-width="9" stroke-linecap="round">
        <path d="M46,110 C34,126 22,132 12,132"/>
        <path d="M70,118 C62,136 52,144 40,146"/>
        <path d="M142,118 C150,136 160,144 172,146"/>
        <path d="M166,110 C178,126 190,132 200,132"/>
      </g>
      <path d="M42,60 C22,44 12,26 18,14 C30,16 44,30 52,48 Z" fill="#d84a2c"/>
      <path d="M18,14 C8,20 6,34 14,42 C22,38 26,26 24,18 Z" fill="#e2593a"/>
      <path d="M170,60 C190,44 200,26 194,14 C182,16 168,30 160,48 Z" fill="#d84a2c"/>
      <path d="M194,14 C204,20 206,34 198,42 C190,38 186,26 188,18 Z" fill="#e2593a"/>
      <path d="%BODY%" fill="#e2593a"/>
      <g clip-path="url(#c)" opacity=".28">
        <ellipse cx="106" cy="52" rx="46" ry="14" fill="#fff"/>
      </g>
      ${eye(132, 58, 11)}
      ${eye(82, 58, 11)}
      ${smile(94, 88, 24)}`
  },
  {
    id: 'starfish',
    titles: { uz: 'Dengiz yulduzi', ru: 'Морская звезда', en: 'Starfish' },
    vb: '0 0 180 174',
    body: 'M90,10 C102,44 108,54 142,58 C176,62 178,66 154,90 C130,114 126,124 134,158 C142,192 138,194 108,176 C78,158 66,158 36,176 C6,194 2,192 10,158 C18,124 14,114 -10,90 L14,90 C-6,68 -4,62 30,58 C64,54 78,44 90,10 Z',
    art: `
      <path d="M90,8 C104,46 110,54 150,58 C186,62 188,68 160,92
               C134,114 130,124 138,160 C146,196 140,200 108,180
               C78,162 66,162 36,180 C4,200 -2,196 6,160
               C14,124 10,114 -16,92 C-44,68 -42,62 -6,58
               C34,54 40,46 54,8 C68,-30 76,-30 90,8 Z" fill="#f2913c" transform="translate(28,14) scale(0.78)"/>
      <g opacity=".32" fill="#fff">
        <circle cx="90" cy="60" r="7"/>
        <circle cx="62" cy="86" r="5"/>
        <circle cx="118" cy="86" r="5"/>
        <circle cx="76" cy="118" r="5"/>
        <circle cx="106" cy="118" r="5"/>
      </g>
      ${eye(104, 74, 10)}
      ${eye(74, 74, 10)}
      ${smile(80, 98, 20)}`
  },
  {
    id: 'pufferfish',
    titles: { uz: 'Kirpi baliq', ru: 'Рыба-ёж', en: 'Pufferfish' },
    vb: '0 0 186 172',
    body: 'M28,86 C28,44 62,18 100,18 C138,18 168,44 168,86 C168,128 138,152 100,152 C62,152 28,128 28,86 Z',
    art: `
      <path d="M34,86 L4,52 Q16,86 4,120 Z" fill="#c9a02c"/>
      <g fill="#c9a02c">
        <path d="M100,18 L108,0 L116,20 Z"/><path d="M60,30 L60,10 L74,26 Z"/>
        <path d="M140,30 L150,12 L152,32 Z"/><path d="M166,72 L186,64 L172,84 Z"/>
        <path d="M166,102 L186,108 L170,116 Z"/><path d="M140,142 L150,160 L132,150 Z"/>
        <path d="M100,152 L106,172 L88,158 Z"/><path d="M60,142 L52,160 L48,140 Z"/>
        <path d="M32,110 L14,124 L24,102 Z"/><path d="M32,60 L14,48 L26,44 Z"/>
      </g>
      <path d="%BODY%" fill="#eec03e"/>
      <g clip-path="url(#c)" opacity=".4">
        <ellipse cx="100" cy="122" rx="52" ry="24" fill="#fff"/>
        <circle cx="70" cy="46" r="6" fill="#8a6a10"/>
        <circle cx="112" cy="40" r="5" fill="#8a6a10"/>
        <circle cx="140" cy="66" r="5" fill="#8a6a10"/>
      </g>
      ${eye(134, 78, 13)}
      ${eye(96, 80, 13)}
      ${smile(106, 108, 22)}`
  },
  {
    id: 'shark',
    titles: { uz: 'Akula', ru: 'Акула', en: 'Shark' },
    vb: '0 0 252 132',
    body: 'M40,70 C46,44 84,26 132,26 C184,26 226,44 240,70 C226,96 184,114 132,114 C84,114 46,96 40,70 Z',
    art: `
      <path d="M44,70 L6,20 Q26,70 6,120 Z" fill="#5f7484"/>
      <path d="M110,30 C122,2 142,-4 152,4 L146,34 Z" fill="#5f7484"/>
      <path d="M96,108 C92,126 80,134 70,132 L82,104 Z" fill="#5f7484"/>
      <path d="M160,108 C164,124 178,130 188,126 L176,104 Z" fill="#5f7484"/>
      <path d="%BODY%" fill="#7d93a4"/>
      <g clip-path="url(#c)">
        <path d="M40,86 C90,102 180,104 240,86 L240,132 L40,132 Z" fill="#e6edf2"/>
      </g>
      <path d="M196,88 C210,86 226,82 236,78 C226,90 210,94 198,94 Z" fill="#fff"/>
      <g fill="#7d93a4">
        <path d="M204,86 L208,93 L200,93 Z"/><path d="M214,84 L218,91 L210,91 Z"/>
        <path d="M224,81 L228,88 L220,88 Z"/>
      </g>
      <g stroke="#5f7484" stroke-width="3" opacity=".6" fill="none">
        <path d="M170,44 C176,54 176,68 170,78"/>
        <path d="M182,46 C188,56 188,68 182,76"/>
      </g>
      ${eye(206, 60, 9)}`
  },
  {
    id: 'dolphin',
    titles: { uz: 'Delfin', ru: 'Дельфин', en: 'Dolphin' },
    vb: '0 0 250 138',
    body: 'M40,74 C48,44 88,28 138,30 C180,32 208,44 226,58 C236,66 240,72 246,76 C238,84 216,96 186,102 C140,112 88,110 60,98 C46,92 40,84 40,74 Z',
    art: `
      <path d="M44,74 L8,26 Q26,74 8,122 Z" fill="#3f6c92"/>
      <path d="M116,34 C124,4 148,-2 158,8 L150,38 Z" fill="#3f6c92"/>
      <path d="M104,104 C100,124 86,132 76,128 L90,100 Z" fill="#3f6c92"/>
      <path d="%BODY%" fill="#5089b4"/>
      <g clip-path="url(#c)">
        <path d="M40,84 C96,104 172,104 246,80 L246,138 L40,138 Z" fill="#dfeaf2"/>
      </g>
      <path d="M228,70 C238,70 250,74 250,78 C242,82 230,82 224,80 Z" fill="#dfeaf2"/>
      ${eye(206, 62, 8)}`
  },
  {
    id: 'whale',
    titles: { uz: 'Kit', ru: 'Кит', en: 'Whale' },
    vb: '0 0 244 158',
    body: 'M44,90 C44,54 88,34 140,34 C192,34 228,58 234,90 C228,122 192,140 140,140 C88,140 44,126 44,90 Z',
    art: `
      <path d="M52,90 L6,36 Q28,90 6,144 Z" fill="#2f5f8a"/>
      <path d="M138,38 C150,10 174,4 184,14 L172,42 Z" fill="#2f5f8a"/>
      <path d="M96,130 C90,150 74,158 62,154 L80,126 Z" fill="#2f5f8a"/>
      <path d="%BODY%" fill="#3d78ab"/>
      <g clip-path="url(#c)">
        <path d="M44,100 C110,124 190,120 234,96 L234,158 L44,158 Z" fill="#e3edf5"/>
        <g stroke="#2f5f8a" stroke-width="4" opacity=".45" fill="none">
          <path d="M120,110 L234,104 M120,122 L226,116 M124,134 L212,128"/>
        </g>
      </g>
      <path d="M186,36 C186,18 176,6 168,2 C180,4 196,16 200,34 Z" fill="#cfe6f5" opacity=".8"/>
      <path d="M196,36 C200,18 212,8 222,6 C212,14 206,26 206,38 Z" fill="#cfe6f5" opacity=".8"/>
      ${eye(200, 76, 9)}
      ${smile(198, 98, 16)}`
  },
  {
    id: 'stingray',
    titles: { uz: 'Skat', ru: 'Скат', en: 'Stingray' },
    // Skat tepadan ko'rinadi: uni romb siluet tanitadi. Oldingi urinishda
    // tana oddiy oval edi va u qumdagi dog'ga o'xshab qolgandi.
    vb: '0 0 222 176',
    body: 'M204,88 C172,38 122,14 70,24 C28,32 6,56 22,88 C6,120 28,144 70,152 C122,162 172,138 204,88 Z',
    art: `
      <g fill="none" stroke="#8a6f4a" stroke-width="8" stroke-linecap="round">
        <path d="M26,88 C16,88 10,88 4,88"/>
      </g>
      <path d="M204,88 C214,90 220,94 222,100 C214,102 206,98 200,94 Z" fill="#8a6f4a"/>
      <path d="%BODY%" fill="#b08f60"/>
      <g clip-path="url(#c)">
        <path d="M22,88 C70,72 140,72 204,88 C140,104 70,104 22,88 Z" fill="#9a7c50" opacity=".55"/>
        <g opacity=".3" fill="#5e4a2c">
          <circle cx="86" cy="52" r="9"/><circle cx="130" cy="46" r="7"/>
          <circle cx="96" cy="126" r="8"/><circle cx="142" cy="122" r="6"/>
          <circle cx="58" cy="88" r="6"/>
        </g>
      </g>
      ${eye(176, 68, 9)}
      ${eye(170, 106, 9)}`
  },
  {
    id: 'moray',
    titles: { uz: 'Murena', ru: 'Мурена', en: 'Moray eel' },
    vb: '0 0 254 122',
    body: 'M10,88 C34,102 58,96 78,78 C100,58 118,32 148,26 C180,20 210,32 228,52 C242,68 246,82 244,94 C232,98 216,92 206,80 C192,64 172,56 154,60 C132,66 118,88 96,102 C70,118 34,114 10,100 Z',
    art: `
      <path d="M96,50 C120,24 152,12 186,16 C176,26 152,30 132,42 C118,50 108,58 100,66 Z" fill="#4e7c3e"/>
      <path d="%BODY%" fill="#6ea34e"/>
      <g clip-path="url(#c)" opacity=".35">
        <circle cx="60" cy="94" r="8" fill="#33562a"/>
        <circle cx="106" cy="76" r="7" fill="#33562a"/>
        <circle cx="150" cy="44" r="7" fill="#33562a"/>
        <circle cx="196" cy="52" r="6" fill="#33562a"/>
        <circle cx="222" cy="76" r="6" fill="#33562a"/>
      </g>
      <path d="M228,74 C236,72 244,74 246,80 C238,84 228,82 224,78 Z" fill="#f0e4d0"/>
      ${eye(220, 54, 8)}`
  },
  {
    id: 'koi',
    titles: { uz: 'Koi baliq', ru: 'Карп кои', en: 'Koi carp' },
    vb: '0 0 236 146',
    body: 'M52,74 C52,42 90,22 134,24 C178,26 206,46 214,74 C206,102 178,122 134,124 C90,126 52,106 52,74 Z',
    art: `
      <path d="M58,74 C40,44 20,26 6,18 C10,44 16,62 22,74 C16,86 10,104 6,130 C20,122 40,104 58,74 Z" fill="#e8e2d6"/>
      <path d="M112,28 C126,4 152,0 162,10 L150,36 Z" fill="#e8e2d6"/>
      <path d="M108,118 C118,140 138,146 148,138 L134,112 Z" fill="#e8e2d6"/>
      <path d="%BODY%" fill="#f7f2e8"/>
      <g clip-path="url(#c)">
        <path d="M84,24 C108,28 116,52 106,74 C96,96 104,116 122,124
                 C96,124 74,108 72,80 C70,54 76,36 84,24 Z" fill="#e8622a"/>
        <circle cx="164" cy="52" r="20" fill="#e8622a"/>
        <circle cx="140" cy="106" r="13" fill="#3a3a3a" opacity=".75"/>
      </g>
      ${eye(190, 62, 9)}
      <g stroke="#c9b48c" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M212,84 C222,90 228,100 226,110"/>
        <path d="M210,88 C216,98 216,110 210,118"/>
      </g>`
  },
  {
    id: 'goldfish',
    titles: { uz: 'Oltin baliq', ru: 'Золотая рыбка', en: 'Goldfish' },
    vb: '0 0 198 156',
    body: 'M56,78 C56,42 88,22 124,24 C160,26 184,48 190,78 C184,108 160,130 124,132 C88,134 56,114 56,78 Z',
    art: `
      <path d="M60,78 C42,44 22,20 6,10 C6,42 12,64 20,78 C12,92 6,114 6,146
               C22,136 42,112 60,78 Z" fill="#f0932b"/>
      <path d="M60,78 C46,60 30,44 16,34 C20,56 24,68 28,78 C24,88 20,100 16,122
               C30,112 46,96 60,78 Z" fill="#f8b04a"/>
      <path d="M100,30 C112,8 136,4 146,14 L134,38 Z" fill="#f0932b"/>
      <path d="M96,126 C104,146 124,152 134,144 L120,120 Z" fill="#f0932b"/>
      <path d="%BODY%" fill="#fba734"/>
      <g clip-path="url(#c)" opacity=".3">
        <path d="M56,96 C104,112 160,110 190,92 L190,156 L56,156 Z" fill="#fff"/>
      </g>
      ${eye(166, 62, 10)}
      ${smile(168, 88, 13)}`
  },
  {
    id: 'shrimp',
    titles: { uz: 'Krevetka', ru: 'Креветка', en: 'Shrimp' },
    // Krevetkani vergul shakli tanitadi: o'ngda yo'g'on bosh, chapga
    // qarab ingichkalashib buriladigan dum va uchida yelpig'ich.
    vb: '0 0 206 152',
    body: 'M164,50 C184,66 186,96 168,112 C148,130 116,128 94,116 C74,104 56,106 46,118 C36,130 20,126 18,112 C16,96 28,86 44,86 C64,86 78,72 92,54 C108,32 140,30 164,50 Z',
    art: `
      <path d="M22,120 C8,132 2,144 2,152 C16,150 30,142 40,130 Z" fill="#d9694e"/>
      <g stroke="#d9694e" stroke-width="5" fill="none" stroke-linecap="round">
        <path d="M172,46 C190,28 200,20 204,16"/>
        <path d="M178,58 C194,50 202,44 206,40"/>
        <path d="M78,120 C74,134 68,144 60,150"/>
        <path d="M100,124 C98,138 94,146 88,152"/>
        <path d="M124,124 C124,138 122,146 118,152"/>
        <path d="M146,118 C150,132 150,140 148,148"/>
      </g>
      <path d="%BODY%" fill="#f2917a"/>
      <g clip-path="url(#c)" opacity=".34">
        <path d="M74,0 L90,0 L64,152 L48,152 Z" fill="#c04f36"/>
        <path d="M102,0 L118,0 L94,152 L78,152 Z" fill="#c04f36"/>
        <path d="M130,0 L146,0 L124,152 L108,152 Z" fill="#c04f36"/>
      </g>
      ${eye(168, 62, 8)}
      ${smile(172, 84, 10)}`
  },
  {
    id: 'seasnail',
    titles: { uz: 'Dengiz shilliqqurti', ru: 'Морская улитка', en: 'Sea snail' },
    vb: '0 0 176 148',
    body: 'M30,112 C30,96 44,88 66,88 C96,88 120,90 140,96 C160,102 166,112 158,120 C148,130 110,134 76,134 C46,134 30,126 30,112 Z',
    art: `
      <path d="%BODY%" fill="#e8c37a"/>
      <g stroke="#c9a35c" stroke-width="4" fill="none" stroke-linecap="round">
        <path d="M148,96 C160,84 166,74 166,64"/>
        <path d="M156,102 C170,94 176,86 178,78"/>
      </g>
      <circle cx="164" cy="60" r="7" fill="#e8c37a"/>
      <circle cx="176" cy="74" r="6" fill="#e8c37a"/>
      <path d="M84,26 C118,26 142,50 142,78 C142,98 126,110 108,110
               C92,110 80,100 80,86 C80,74 90,66 100,66 C110,66 116,74 114,82
               C112,88 104,90 100,86" fill="none" stroke="#b5763a" stroke-width="15"
               stroke-linecap="round"/>
      <path d="M84,26 C118,26 142,50 142,78 C142,98 126,110 108,110
               C92,110 80,100 80,86 C80,74 90,66 100,66 C110,66 116,74 114,82
               C112,88 104,90 100,86" fill="none" stroke="#d99a54" stroke-width="8"
               stroke-linecap="round"/>
      ${eye(158, 104, 7)}
      ${smile(150, 116, 10)}`
  }
];

// ── yig'ish ────────────────────────────────────────────────────────────────

// SVG faylning karkasi. Ichida clipPath bor: naqshlar tananing tashqarisiga
// chiqmasligi kerak, aks holda chiziqlar havoda osilib qoladi. `id="c"` har
// bir faylda alohida hujjat bo'lgani uchun to'qnashmaydi — brauzer bu
// fayllarni <img> sifatida yuklaydi.
// Rasterlash o'lchamini `width`/`height` bilan aniq ko'rsatamiz. Faqat
// viewBox bo'lsa, brauzer SVG'ni <img> sifatida o'zining standart o'lchamida
// (300x150) rasterlaydi, canvas esa uni kattalashtiradi — televizorda personaj
// xiralashib chiqadi. Uch barobar zaxira 4K ekranga ham yetadi va fayl
// hajmiga ta'sir qilmaydi: vektor baribir vektorligicha qoladi.
const RASTER = 3;

function build(sp) {
  const art = sp.art.replace(/%BODY%/g, sp.body).trim();
  const [, , vw, vh] = sp.vb.split(/\s+/).map(Number);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${sp.vb}" `
    + `width="${vw * RASTER}" height="${vh * RASTER}">
<title>${sp.titles.en}</title>
<defs><clipPath id="c"><path d="${sp.body}"/></clipPath></defs>
${art}
</svg>
`;
}

fs.mkdirSync(OUT, { recursive: true });

const seen = new Set();
const manifest = { version: 1, scene: 'aquarium', creatures: [] };

for (const sp of SPECIES) {
  if (seen.has(sp.id)) throw new Error('takrorlangan id: ' + sp.id);
  seen.add(sp.id);
  const file = sp.id + '.svg';
  fs.writeFileSync(path.join(OUT, file), build(sp));
  manifest.creatures.push({
    id: sp.id,
    scene: 'aquarium',
    titles: sp.titles,
    url: '/assets/creatures/' + file
  });
}

fs.writeFileSync(
  path.join(OUT, 'manifest.json'),
  JSON.stringify(manifest, null, 1) + '\n'
);

console.log(`${SPECIES.length} ta jonivor yasaldi → assets/creatures/`);
