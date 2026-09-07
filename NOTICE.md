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
