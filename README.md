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

Sahna bo‘sh ochilmasligi uchun loyihada **20 ta tayyor dengiz jonivori**
bor: baliq, masxaraboz baliq, kirpi baliq, akula, delfin, kit, ko‘k kit,
sakkizoyoq, kalmar, krevetka, omar, qisqichbaqa, chig‘anoq, toshbaqa,
meduza, tyulen, timsoh, suvsar, pingvin va marjon.

Rasmlarni biz chizmaymiz — ular **Twemoji** to‘plamidan (CC-BY 4.0),
professional dizaynerlar ishi. `tools/make-creatures.js` ularni o‘ngga
qaratadi va ustiga hajm qatlami — yorug‘lik va soya — qo‘shadi, shunda
tekis emoji televizor ekranida hajmli ko‘rinadi. Mualliflik va litsenziya:
[NOTICE.md](NOTICE.md).

Har birining **ismi** ham bor — Otabek, Dilnoza, Bahodir. Bolalar «bu
Otabek baliq» deb eslab qolishadi, quruq tur nomidan ko‘ra bu yaxshiroq
yopishadi.

Sahnada «Tayyor jonivorlar» tugmasi orqali qo‘yib yuboriladi. Hammasini
yonma-yon ko‘rish uchun — `/tools/creature-sheet.html`.

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

## Harakat

Hamma personaj bir xil qimirlasa, ekran mexanik ko‘rinadi. Shuning uchun
harakat ikki narsadan yig‘iladi.

**Tanadan.** Rasmdagi jonivorning haqiqiy chegarasi o‘lchanadi (fayl
chegarasi emas — Twemoji kvadrat, jonivor esa uning bir qismini egallaydi).
Undan o‘lcham va cho‘ziqlik chiqadi, ular esa harakatni belgilaydi: katta
tana dumini **sekin, lekin keng** uradi, mayda baliq **tez-tez va mayda**
qimirlaydi, uzun yassi tana bo‘ylab to‘lqin uzoq yuradi, dumaloq tanada
(meduza, qisqichbaqa) deyarli yo‘q.

**Tabiatdan.** Har bir personajga tug‘ilganda beshta tabiatdan bittasi
tegadi va u o‘zgarmaydi: kimdir shoshmasdan kesib o‘tadi, kimdir joyida
aylanadi, kimdir to‘xtab-to‘xtab qaraydi. Tabiat qaysi harakat qanchalik
tez-tez uchrashini belgilaydi — aylanish, otilish, to‘xtash yoki oddiy
suzish.

Natijada yigirmata baliqning yigirmatasi ham boshqacha yuradi, lekin har
biri o‘ziga izchil qoladi.

## Bog‘chada sinab ko‘rish

Birinchi sinov uchun bosqichma-bosqich yo‘riqnoma —
[SINAB-KORISH.md](SINAB-KORISH.md). Internet kerak emas, hammasi
bog‘chaning o‘z Wi-Fi’sida ishlaydi.

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

## Chop etiladigan varaqlar

Printer bo‘lsa, ikkinchi yo‘l ham bor va u ham **hech narsa sotib olmasdan**
ishlaydi: `/print.html` da 12 xil baliqning A4 varag‘i turibdi (o‘zbek, rus,
ingliz, polyak tillarida), yonida esa hammasini bitta PDF qilib yuklab
oladigan tugma.

Tartib: varaqni 100% masshtabda chop et → bola ranglaydi (burchakdagi to‘rtta
qora kvadratni bo‘yamasin) → telefonda **Suratga olish** → rasm sahnaga
tushadi. Tizim varaqni burchak belgilaridan topib, perspektivani to‘g‘rilab,
baliq konturi bo‘ylab **shaffof qilib kesadi** — shuning uchun sahnada
qog‘oz emas, faqat bolaning rasmi suzadi.

## 3D sahna

Asosiy sahna 2D, lekin haqiqiy 3D modellar bilan ishlaydigan sahna ham bor:
`/t/<kod>/tank`. Modellar skelet animatsiyasi bilan suzadi, bolaning bo‘yagan
varag‘i esa modelning terisi bo‘lib yopishadi.

Upstream bu yerda sotib olingan pakni talab qiladi. Bizda talab qilmaydi:

```bash
node tools/get-free-models.js     # CC0 modellar, bepul
```

Yoki o‘zing topgan har qanday `.glb` faylni `assets/models/drop/` ga
tashlaysan — buyruqsiz, sahnada darhol paydo bo‘ladi. Fayl nomi ekrandagi
nomga aylanadi, `@` dan keyingi son esa jonivorning kattaligi:
`akula@4.glb`. Batafsili — o‘sha papkadagi README.

Sotib olingan pak ham ishlayveradi (`assets/models/pack/`), ikkalasi bir
ro‘yxatda ko‘rinadi.

> Eslatma: 3D yo‘l **erkin chizishga to‘g‘ri kelmaydi** — bolaning dinozavr
> rasmini baliq modeliga yopishtirib bo‘lmaydi. Shuning uchun bog‘cha uchun
> asosiy yo‘l 2D bo‘lib qoladi; 3D — bo‘yash varaqlari bilan ishlaydigan
> qo‘shimcha imkoniyat.

## Joylashtirish (internetga chiqarish)

Loyiha ikki xil ishlaydi:

**Oddiy server** — `node server.js`. Ma'lumotlar `data/` papkasida, doimiy.
Bog‘cha uchun asosiy yo‘l shu: noutbuk yoki disk bor har qanday server
(Railway, Fly.io, oddiy VPS — `Dockerfile` tayyor).

**Vercel** — ko‘rib turish uchun. Repo ulanadi, har push'da o‘zi
joylashtiriladi. Lekin Vercel serverless: loyiha papkasiga yozib bo‘lmaydi,
ma'lumot `/tmp` ga tushadi va u **vaqtinchalik** — instansiya to‘xtasa,
chizilgan rasmlar yo‘qoladi. Demo uchun yetadi, bog‘chada doimiy ishlash
uchun emas. Vercel `server.js` ni o‘zi topadi (Node.js server sifatida) —
alohida kirish nuqtasi yo‘q; sahifalar va rasmlar funksiyaga `vercel.json`
dagi `includeFiles` orqali qo‘shiladi.

Ma'lumot papkasini `AQUA_DATA_DIR` o‘zgaruvchisi bilan istalgan joyga
ko‘chirsa bo‘ladi.

## Sahifalar

| Manzil | Nima |
|---|---|
| `/` | sahnalar ro‘yxati |
| `/t/<kod>` | katta ekran — 2D sahna |
| `/t/<kod>/draw` | planshet/telefonda chizish |
| `/t/<kod>/admin` | boshqaruv (parol kerak) |
| `/t/<kod>/capture` | ranglangan varaqni suratga olish |
| `/t/<kod>/tank` | 3D sahna — `assets/models/drop/` dagi modellar bilan |
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
