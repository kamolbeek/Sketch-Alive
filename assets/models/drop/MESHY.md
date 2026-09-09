# Meshy'da baliq yasash

Meshy (meshy.ai) — matndan yoki rasmdan 3D model yasaydi. Natijasi `.glb`
bo'lib tushadi, uni shu papkaga tashlasang 3D sahnada darhol paydo bo'ladi.
Buyruq kerak emas.

## Tartib — bitta baliq uchun 2 daqiqa

1. meshy.ai → **Text to 3D**
2. Pastdagi promptlardan bittasini nusxa ol → **Generate**
3. To'rtta variant chiqadi — yoqqanini tanla → **Refine** (tekstura qo'shadi)
4. **Download → GLB**
5. Faylni shu papkaga tashla, nomini o'zgartir: `masxaraboz@2.glb`
6. `node server.js` → `/t/<kod>/tank`

Har biriga bitta prompt — bir uslubda chiqishi uchun hammasida bir xil
oxirgi qism bor.

## Sozlamalar

- **Art style:** Realistic yoki Cartoon — hammasiga bir xilini tanla,
  aks holda akvariumda uslub aralashib ketadi
- **Animation:** shart emas. Meshy'ning rigi odam gavdasi uchun; baliqqa
  to'g'ri kelmaydi. Sahna animatsiyasiz modelning tanasini o'zi egadi.
- **Format:** faqat GLB. FBX ham, OBJ ham kerak emas.

## Promptlar

Har birining oxiridagi qism o'zgarmaydi — u modelni sahnaga mos qiladi.

```
clownfish, orange body with three white bands outlined in black, side view, neutral pose, single fish, no background, game-ready, clean topology, PBR textures
```
```
blue tang fish, royal blue body with black marking and yellow tail, side view, neutral pose, single fish, no background, game-ready, clean topology, PBR textures
```
```
yellow tang fish, bright yellow oval body, side view, neutral pose, single fish, no background, game-ready, clean topology, PBR textures
```
```
angelfish, tall triangular body with black and silver vertical stripes, long flowing fins, side view, neutral pose, single fish, no background, game-ready, clean topology, PBR textures
```
```
butterflyfish, round yellow body with black eye band, side view, neutral pose, single fish, no background, game-ready, clean topology, PBR textures
```
```
koi carp, white body with orange and black patches, long flowing tail, side view, neutral pose, single fish, no background, game-ready, clean topology, PBR textures
```
```
goldfish, round orange body with big veil tail, side view, neutral pose, single fish, no background, game-ready, clean topology, PBR textures
```
```
pufferfish, round spiky body, yellow with brown spots, side view, neutral pose, single fish, no background, game-ready, clean topology, PBR textures
```
```
sea turtle, green shell with hexagonal pattern, four flippers, side view, neutral pose, single animal, no background, game-ready, clean topology, PBR textures
```
```
seahorse, orange curled body with ridged back, side view, neutral pose, single animal, no background, game-ready, clean topology, PBR textures
```
```
reef shark, grey body with white belly, dorsal fin, side view, neutral pose, single fish, no background, game-ready, clean topology, PBR textures
```
```
dolphin, blue-grey body with light belly, curved dorsal fin, side view, neutral pose, single animal, no background, game-ready, clean topology, PBR textures
```
```
octopus, purple body with eight curled arms, big eyes, side view, neutral pose, single animal, no background, game-ready, clean topology, PBR textures
```
```
jellyfish, translucent blue bell with trailing tentacles, side view, neutral pose, single animal, no background, game-ready, clean topology, PBR textures
```
```
crab, red shell with two claws and legs, front view, neutral pose, single animal, no background, game-ready, clean topology, PBR textures
```

## Fayl nomlari

`@` dan keyingi son — sahnadagi uzunlik (akvarium ichi 24 birlik):

| Fayl | Izoh |
|---|---|
| `masxaraboz@1.6.glb` | kichik |
| `koi@2.6.glb` | o'rtacha |
| `akula@4.glb` | katta |
| `delfin@4.glb` | katta |
| `toshbaqa@2.8.glb` | |
| `dengiz-oti@1.2.glb` | kichik |

## Litsenziya — muhim

Meshy'ning **bepul** tarifida yasalgan modellar **CC BY 4.0** ostida:
ishlatish mumkin, lekin Meshy'ni ko'rsatish shart (NOTICE.md ga bir qator).
**Pullik** tariflarda model to'liq seniki bo'ladi. Bog'chalarga tarqatiladigan
loyiha uchun ikkalasi ham to'g'ri keladi — faqat bepulda mualliflikni yozish
esdan chiqmasin.

Shartlar o'zgarib turadi — yuklab olishdan oldin meshy.ai/terms ni bir
qarab qo'y.

## Rasmdan yasash

Meshy'da **Image to 3D** ham bor. CGTrader'da ko'rgan baliq rasmini
(masxaraboz baliq skrinshoti) unga bersang, o'shanga o'xshash model yasaydi.
Lekin birovning rasmidan model yasash uning huquqiga tegishi mumkin — o'z
rasming yoki bepul rasmdan qil.
