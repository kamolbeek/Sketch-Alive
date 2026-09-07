# 3D modellarni shu yerga tashla

Bu papkaga qo'yilgan har qanday `.glb` yoki `.gltf` fayl 3D sahnada
(`/t/<kod>/tank`) darhol paydo bo'ladi. Buyruq yozish kerak emas — faylni
tashlaysan, sahifani yangilaysan.

## Qanday fayl kerak

- Format: **`.glb`** (bitta fayl, teksturalar ichida) — eng qulayi.
  `.gltf` + tekstura papkasi ham bo'ladi, lekin hammasini birga qo'yish kerak.
- **Animatsiyali** bo'lsa yaxshi: sahna birinchi klipni o'ynatadi va baliq
  o'zi suzadi. Animatsiyasiz model ham ishlaydi — tanasi shaderda egiladi.
- Bitta faylda **bitta jonivor** bo'lsin, atrofida sahna bo'lmasin.
- Hajmi ~15 MB gacha. Undan kattasi televizorda sekin ochiladi.
- Yo'nalishi **muhim emas**: sahna boshni qayerdaligini skeletdan yoki
  tananing shaklidan o'zi topadi.
- Draco siqilishi **qo'llanadi**. KTX2/Basis teksturalari esa **yo'q** —
  bunday fayl ochilmaydi. Sketchfab'da «glTF» yoki «glTF Binary» ni tanla,
  «KTX2» ni emas.

## Nom qanday chiqadi

Fayl nomi ekrandagi nomga aylanadi:

| Fayl | Ro'yxatda |
|---|---|
| `oltin-baliq.glb` | Oltin baliq |
| `Akula.glb` | Akula |

## Uzunligini belgilash

Sahnada jonivor qanchalik katta bo'lishini fayl nomiga yozsa bo'ladi —
oxiriga `@` va sonni qo'sh (sahna birligida; akvarium ichi 24 birlik):

| Fayl | Uzunligi |
|---|---|
| `krevetka@0.8.glb` | kichkina |
| `akula@4.glb` | katta |

Yozilmasa 2.2 olinadi — o'rtacha baliq.

## Qayerdan model olish mumkin

Bepul va litsenziyasi ochiq joylar:

- **poly.pizza** — hammasi CC0, «Download → GLB»
- **Sketchfab** — «Downloadable» + «CC0» + «Animated» filtrlarini yoq,
  keyin «glTF Binary (.glb)» ni yuklab ol
- **CGTrader** — «Free» filtri bor

Qidiruv so'zlari: `animated fish glb`, `low poly fish rigged`,
`clownfish animated`, `koi carp rigged`.

Sotib olingan pak bo'lsa, uni bu yerga qo'yish shart emas — upstream'ning
yo'li (`assets/models/pack/`) ham ishlayveradi.

> Diqqat: model litsenziyasini tekshir. Bu papka `.gitignore` da —
> u yerdagi fayllar seniki va umumiy repozitoriyga tushmaydi.
