# Sketch Alive

Bola chizadi — chizgani katta ekranda jonlanadi.

```
planshetda chizish  ┐
                    ├─→  rasm  →  sahnada jonli personaj  →  televizor
qog‘oz + telefon ── ┘
```

Bog‘chalar uchun. Skaner ham, proyektor ham, sensor xona ham kerak emas:
bog‘chada allaqachon bor narsalar yetadi — **televizor va bitta telefon**.

## Nega bu boshqacha

G‘oya teamLab’ning *Sketch Aquarium* ko‘rgazmasidan keladi, kod esa
[Paper Aquarium](https://github.com/MrMoT9I/paper-aquarium) forkidan
(MIT — batafsili [NOTICE.md](NOTICE.md) da). Ikkalasidan ham ikkita muhim
farqi bor.

**Bola erkin chizadi.** teamLab’da ham, Paper Aquarium’da ham bola tayyor
konturni bo‘yaydi: shakl oldindan berilgan, bolaniki faqat rang. Sketch
Alive’da personaj — bolaning rasmining o‘zi. Dinozavr chizsa dinozavr
yuradi, krovat chizsa krovat xonada turadi.

**Hech narsa sotib olinmaydi.** Paper Aquarium 3D baliqlarni CGTrader’dan
sotib olingan pakdan oladi; modelsiz akvarium bo‘sh qoladi. Sketch Alive
asosiy yo‘lda 3D modelga umuman muhtoj emas — rasm 2D personaj bo‘lib
jonlanadi (teamLab ham aynan shunday qiladi). Fonlar ham gradient bilan
chiziladi, bironta ham fayl yuklab olinmaydi.

## Tayyor jonivorlar

Sahna bo'sh ochilmasligi uchun loyihada **20 ta tayyor dengiz jonivori**
bor: masxaraboz baliq, ko'k tang, farishta baliq, kapalak baliq, dengiz oti,
toshbaqa, meduza, sakkizoyoq, qisqichbaqa, dengiz yulduzi, kirpi baliq,
akula, delfin, kit, skat, murena, koi, oltin baliq, krevetka va dengiz
shilliqqurti.

Ular SVG — jami 100 KB ga yetmaydi, 4K televizorda ham donadorlashmaydi va
o'zimizniki, ya'ni hech qanday litsenziya cheklovi yo'q. Sahnada
«Tayyor jonivorlar» tugmasi orqali qo'yib yuboriladi.

Shakl yoki rangni o'zgartirish kerak bo'lsa `tools/make-creatures.js` ni
tahrirlab, qayta ishga tushiring; hammasini yonma-yon ko'rish uchun —
`/tools/creature-sheet.html`.

## Sahnalar

Har bir sahna personaj o‘zini qanday tutishini belgilaydi:

| Sahna | Personaj | Bolalar nima chizadi |
|---|---|---|
| Akvarium | suzadi, tanasi to‘lqinlanadi | baliq, meduza, toshbaqa |
| Dinozavrlar bog‘i | yer bo‘ylab yuradi, sakraydi | dinozavr, vulqon, palma |
| Hayvonot bog‘i | yer bo‘ylab yuradi | fil, sher, zurafa, quyon |
| Uy | joyida turadi, sekin “nafas oladi” | krovat, stol, likopcha, gul |
| Osmon | uchadi, qanot qoqadi | qush, kapalak, samolyot |

Sahna istalgan payt almashtiriladi va bolalarning rasmlari yo‘qolmaydi —
ular yangi sahnada boshqacha harakatlanadi.

## Ishga tushirish

```bash
node server.js          # http://localhost:8000
```

Node 18+ kerak. O‘rnatadigan hech narsa yo‘q: bog‘liqliklar umuman yo‘q,
three.js `vendor/` ichida turadi. Portni `PORT` belgilaydi.

Server ishga tushganda tarmoqdagi manzillarni chop etadi — telefon va
televizorni o‘sha manzilga ulaysiz (bitta Wi-Fi bo‘lishi kerak).

## Bog‘chada qanday ishlatiladi

1. Telefon yoki noutbukda sahna yaratiladi — nom guruh nomi bo‘lsin.
2. Televizorda brauzer ochiladi. Smart TV bo‘lmasa — noutbuk HDMI bilan
   ulanadi (eng ishonchli yo‘l: arzon televizor brauzeri sekin bo‘ladi).
3. Televizorga sahna kodi kiritiladi. Ekranda kod va manzil turadi.
4. Bola telefon yoki planshetda **Chizish** ni ochib, barmoq bilan chizadi
   va “Jonlantirish”ni bosadi. Rasm 3 soniyada televizorga chiqadi, ostida
   bolaning ismi turadi.

Printer bo‘lsa, eski yo‘l ham ishlaydi: A4 varaqni chop etib, bola
ranglaydi, telefonda suratga olinadi (bu yo‘l Paper Aquarium’dan
qolgan va sotib olingan 3D modellarni talab qiladi).

## Sahifalar

| Manzil | Nima |
|---|---|
| `/` | sahnalar ro‘yxati |
| `/t/<kod>` | katta ekran — 2D sahna |
| `/t/<kod>/draw` | planshet/telefonda chizish |
| `/t/<kod>/admin` | boshqaruv (parol kerak) |
| `/t/<kod>/capture` | ranglangan varaqni suratga olish |
| `/t/<kod>/tank` | eski 3D sahna, sotib olingan modellar kerak |
| `/print.html` | chop etish uchun varaqlar |

## Tillar

O‘zbek, rus, ingliz, polyak. Barcha satrlar `assets/i18n.js` da, tarjima
`data-t` atributlari orqali joylanadi. Til qurilma sozlamasidan olinadi,
keyin esa foydalanuvchi tanlagani eslab qolinadi.

## Kirish huquqi

Hisob ochilmaydi. Har sahnaning 10 belgili kodi (u ham manzil) va paroli bor:

| | kod (havola) | parol |
|---|---|---|
| sahnani ko‘rish | ✅ | |
| chizish, rasm qo‘shish, fonni almashtirish | ✅ | |
| rasm yoki sahnani o‘chirish, nomini o‘zgartirish | | ✅ |

Chizish ataylab parolsiz: bola telefonda havolani ochadi, u yerda parol
so‘rash butun g‘oyani o‘ldiradi. Qaytarib bo‘lmaydigan hamma narsa parol
ostida.

Batafsili — [upstream README](https://github.com/MrMoT9I/paper-aquarium)
dagi «Access» bo‘limi: kod uzunligi, parolni himoyalash va cheklovlar
o‘zgarmagan.

## Ma’lumotlar

Hammasi `data/tanks/<kod>/` ichida: sahna nomi, parol xeshi, bolalarning
rasmlari, fonlar. O‘chirilgani darhol yo‘qolmaydi — savatga ko‘chadi va
30 kundan keyin butunlay o‘chadi. `data/` git’ga tushmaydi: bu bir
bog‘chaning ma’lumotlari, o‘yinning qismi emas.

## Keyingi ishlar

- [ ] Guruhlar va tarbiyachi paneli: bitta bog‘chada bir nechta guruh,
      har biriga o‘z sahnasi va o‘z kodi
- [ ] Tayyor mashg‘ulot skriptlari: 20–30 daqiqalik dars rejasi, har sahna
      uchun — tarbiyachi texnologiya o‘rganmasin, skriptga ergashsin
- [ ] Ota-onaga havola: bola chizgan rasm uyda ham ko‘rinsin
- [ ] Ovoz: rasm sahnaga chiqqanda kichik jarang
- [ ] Erkin chizilgan odam figurasi uchun skelet animatsiya
      ([Meta Animated Drawings](https://github.com/facebookresearch/AnimatedDrawings), MIT)
- [ ] Ochiq litsenziyali (CC0) 3D modellar to‘plami — 3D yo‘l ham
      sotib olmasdan ishlashi uchun
- [ ] Boshqa sahnalar uchun ham tayyor jonivorlar: dinozavr, hayvonot bog‘i,
      uy jihozlari

## Litsenziya

Kod [MIT](LICENSE). Fork qilingan qism va uning mualliflik huquqi
[NOTICE.md](NOTICE.md) da yozilgan.
