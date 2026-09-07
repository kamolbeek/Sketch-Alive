# Sketch Alive — kelib chiqishi va litsenziyalar

## Asos (upstream)

Sketch Alive **Paper Aquarium** loyihasining forki asosida qurilgan:

- Manba: https://github.com/MrMoT9I/paper-aquarium
- Muallif: Мистер Мотя (Mister Motya)
- Litsenziya: MIT (`LICENSE` faylida saqlangan)
- Fork qilingan holat: `main`, 2026-yil sentyabr

Paper Aquarium'dan olingan va Sketch Alive'da davom etayotgan qismlar:

| Qism | Fayl | Nima qiladi |
|---|---|---|
| Varaq tanish (marker + perspektiva) | `assets/capture.js` | Bo'yalgan A4 varaqni fotodan topib, to'g'rilab, konturi bo'yicha kesadi |
| Server | `server.js` | Bog'liqliksiz Node HTTP server, sahnalar `data/` ichida |
| 3D akvarium sahnasi | `demos/realistic-tank.html` | three.js sahnasi |
| Model orientatsiyasi | `assets/fish-frame.js`, `assets/fish-glb.js` | Modelning boshi/orqasi qayerdaligini animatsiyadan aniqlaydi |
| Bo'yash varaqlari generatori | `tools/make-coloring.js`, `tools/silhouettes.html` | A4 varaq va manifestni yasaydi |
| i18n karkasi | `assets/i18n.js` | `data-t` atributlari orqali tarjima |
| Akvarium fonlari | `assets/backgrounds/` | Upstream muallifi chizgan, MIT shartlarida |

Upstream MIT bo'lgani uchun bu kod erkin ishlatiladi va o'zgartiriladi.
`LICENSE` faylidagi asl mualliflik huquqi bildirishnomasi **o'chirilmaydi** —
MIT shuni talab qiladi.

## Sketch Alive qo'shgan qismlar

Sketch Alive'ning o'z kodi ham MIT litsenziyasida (`LICENSE` ga qarang).

## Tayyor jonivorlarning rasmlari

Sketch Alive jonivorlarni o'zi chizmaydi — professional dizaynerlar chizgan,
ochiq litsenziyali to'plamlardan oladi. Fayllar repozitoriyga ko'chirib
qo'yilgan, chunki loyiha bog'liqliksiz bo'lishi kerak.

### Twemoji — rangli jonivorlar

- Joyi: `assets/creatures/base/`
- Manba: https://github.com/jdecked/twemoji (avval Twitter, Inc.)
- **Rasmlar litsenziyasi: CC-BY 4.0** — ishlatish va o'zgartirish erkin,
  mualliflikni ko'rsatish shart.
- Sketch Alive nima qilgan: rasm ko'zguda aylantirilgan (hammasi o'ngga
  qarashi uchun) va ustiga hajm qatlami — yorug'lik va soya — qo'shilgan.
  Bular `tools/make-creatures.js` da, natija `assets/creatures/*.svg` da.

Eslatma: npm'dagi `@twemoji/svg` paketi o'zini MIT deb belgilaydi, lekin u
qayta nashr; asl rasmlar CC-BY 4.0 va biz shu shartni qo'llaymiz — chunki
qayta nashr etuvchi boshqa odamning rasmini o'z ixtiyori bilan MIT ga
o'tkaza olmaydi.

### OpenMoji — chop etish uchun konturlar

- Joyi: `assets/coloring/outline/`
- Manba: https://openmoji.org — HfG Schwäbisch Gmünd
- **Litsenziyasi: CC-BY-SA 4.0** — mualliflikni ko'rsatish shart va
  **hosila ishlar ham shu litsenziyada tarqatiladi**. Ya'ni bu konturlardan
  yasalgan bo'yash varaqlari CC-BY-SA 4.0 bo'lib qoladi. Loyihaning kodi
  bundan ta'sirlanmaydi — u MIT bo'lib qolaveradi.

## Bepul 3D modellar

`node tools/get-free-models.js` Khronos'ning rasmiy namuna to'plamidan
model yuklab oladi:

- Manba: https://github.com/KhronosGroup/glTF-Sample-Assets
- Litsenziya: **CC0** — mualliflik huquqidan voz kechilgan, shartsiz
  ishlatiladi.

Fayllar `assets/models/drop/` ga tushadi va git'ga qo'shilmaydi: har kim
o'zi yuklab olgani ma'qul.

## 3D modellar

Upstream 3D baliqlarni **CGTrader'dan sotib olingan** pakdan oladi —
u fayllar repozitoriyda yo'q va bo'lishi ham mumkin emas (Royalty Free
litsenziya qayta tarqatishni taqiqlaydi).

Sketch Alive bunga bog'lanmaydi: asosiy ish rejimi bolaning **o'z rasmi**
bo'lgani uchun sotib olingan modelsiz ham to'liq ishlaydi. Repozitoriyga
faqat litsenziyasi ochiq (CC0 / CC-BY) modellar qo'shiladi va har biri
`assets/models/CREDITS.md` da qayd etiladi.

## Ilhom manbai

G'oya teamLab'ning *Sketch Aquarium* installyatsiyasidan keladi (2013).
teamLab bilan hech qanday aloqamiz yo'q, ularning kodi ham ishlatilmagan —
faqat "bola chizadi, chizgani jonlanadi" degan g'oya umumiy.
