# Bog‘chada sinab ko‘rish

Birinchi sinov uchun yo‘riqnoma. Internet kerak emas — hammasi bog‘chaning
o‘z Wi-Fi’sida ishlaydi.

## Nima kerak

| Narsa | Izoh |
|---|---|
| Noutbuk | Windows yoki Mac, farqi yo‘q |
| Televizor | HDMI kabel bilan noutbukka ulanadi |
| Telefon yoki planshet | Bola shunda chizadi |
| Wi-Fi | Noutbuk ham, telefon ham **bitta** Wi-Fi’da bo‘lishi shart |

Smart TV’ning o‘z brauzerida ham ochsa bo‘ladi, lekin **birinchi sinovda
noutbukni HDMI bilan ulash ishonchliroq**: arzon televizorlarning brauzeri
sekin va ba’zilari sahifani umuman ochmaydi. Muammo chiqsa, u dasturdanmi
yoki televizordanmi — buni ajratib bo‘lmay qoladi.

---

## 1-qadam. Node.js o‘rnatish (bir marta)

[nodejs.org](https://nodejs.org) → katta yashil **LTS** tugmasi → yuklab
olib o‘rnatish. Hamma joyda “Next”.

Tekshirish: **Windows**da Пуск → `cmd` deb yozib Command Prompt’ni oching,
**Mac**da Terminal’ni oching va yozing:

```
node -v
```

`v20.…` yoki `v22.…` chiqsa — bo‘ldi.

## 2-qadam. Loyihani yuklab olish (bir marta)

Eng oson yo‘l — ZIP:

1. https://github.com/kamolbeek/Sketch-Alive oching
2. Yuqorida shoxobchani `claude/animated-drawing-project-6nktjl` ga
   almashtiring
3. Yashil **Code** → **Download ZIP**
4. Arxivni oching, masalan `Hujjatlar` (Documents) papkasiga

Git bilan ishlashni bilsangiz:

```
git clone https://github.com/kamolbeek/Sketch-Alive
cd Sketch-Alive
git checkout claude/animated-drawing-project-6nktjl
```

## 3-qadam. Ishga tushirish

Terminal (yoki Command Prompt) ochib, loyiha papkasiga kiring va yozing:

```
node server.js
```

Shunday chiqishi kerak:

```
  Sketch Alive tayyor.

  Shu kompyuterda:  http://localhost:8000/
  Telefon/televizordan: http://192.168.1.42:8000/   (Wi-Fi)
```

Ikkinchi manzilni **yozib oling** — telefonga o‘sha kerak bo‘ladi. Sizdagi
raqamlar boshqacha bo‘ladi.

> **Windows birinchi marta so‘raydi:** «Разрешить доступ» / «Allow access».
> **Albatta ruxsat bering** — aks holda telefon ulanmaydi. Agar
> tasodifan “Отмена” bosilgan bo‘lsa: Windows Defender Firewall →
> «Разрешить работу с приложением» → Node.js ga belgi qo‘ying.

Bu oynani **yopmang** — server shu yerda ishlab turadi. To‘xtatish: `Ctrl+C`.

## 4-qadam. Sahna yaratish

Noutbukda brauzerni ochib `http://localhost:8000/` ga kiring.

1. **Yangi sahna** bosing
2. Nom bering — masalan, guruh nomi: `Kichik guruh`
3. Chiqqan **kod** va **parolni** yozib oling (kod 10 belgi)

Kod — televizor va telefon uchun. Parol — faqat o‘chirish uchun, bolalarga
kerak emas.

## 5-qadam. Televizorni ulash

1. Noutbukni HDMI bilan televizorga ulang
2. Windows’da `Win + P` → **Дублировать** (yoki Mac’da ekranni takrorlash)
3. Brauzerda sahna ochilgan bo‘lsin, **F11** bosing — to‘liq ekran
4. Ekranning pastida manzil va kod turadi

Ekranga bosilsa boshqaruv paneli ochiladi: sahnani almashtirish, tayyor
jonivorlar, ismlarni yoqib-o‘chirish.

**Boshlashdan oldin ekranni jonlantiring:** panelda **Tayyor jonivorlar**
→ 5–6 tasini bosing. Bo‘sh akvarium bilan boshlamang — bolalar avval
nimadir ko‘rishi, keyin “men ham shunaqa chizaman” deyishi kerak.

## 6-qadam. Telefonda chizish

Telefonni **o‘sha Wi-Fi**ga ulang va brauzerda 3-qadamdagi manzilni oching:

```
http://192.168.1.42:8000
```

Keyin:
1. **Sahnani kod bilan ochish** maydoniga kodni kiriting → **Ochish**
2. Ekranga bosing → panelda **Chizish**
3. Bola ismini yozing, chizsin, **Jonlantirish** bosing

Rasm 3 soniyada televizorga chiqadi, ostida bolaning ismi turadi.

> Bir telefonda hamma bola navbatma-navbat chizishi mumkin: rasm
> yuborilgach varaq o‘zi tozalanadi, faqat ismni almashtirasiz.

---

## Ishlamasa

**Telefonda sahifa ochilmadi.**
Ko‘pincha sabab uchtadan biri:
1. Telefon boshqa Wi-Fi’da (yoki mobil internetda) — tekshiring;
2. Windows firewall ruxsat bermagan — 3-qadamdagi izohga qarang;
3. Bog‘chaning Wi-Fi’si «mehmon» rejimida — bunda qurilmalar bir-birini
   ko‘rmaydi. Boshqa Wi-Fi’ga o‘ting yoki telefonda “hotspot” yoqib,
   noutbukni ham o‘shanga ulang.

**Televizorda sahna sekin.**
Smart TV brauzeridan foydalanayotgan bo‘lsangiz — noutbuk + HDMI ga
o‘ting.

**Chizganda chiziq qo‘l ortidan yetib bormayapti.**
Eski planshetda bo‘lishi mumkin. Qalinlikni kichikroq qilib ko‘ring.

**«node» degan buyruq topilmadi.**
Node.js o‘rnatilmagan yoki terminal qayta ochilmagan — terminalni yopib,
qaytadan oching.

---

## Sinovdan keyin nimaga e’tibor berish

Kod yozish oson, bog‘chada nima bo‘lishini taxmin qilish qiyin. Sinovdan
keyin shu savollarga javob kerak — keyingi ishlar shundan kelib chiqadi:

- Tarbiyachi qaysi qadamda to‘xtab qoldi? Qayerda “endi nima qilay?” dedi?
- Bolaning rasmi ekranga chiqqanda reaksiyasi qanday bo‘ldi?
- Bir telefon yetdimi, yoki navbat kutish uzoq bo‘ldimi?
- Barmoq bilan chizish qulay bo‘ldimi, yoki qalam kerakmi?
- Nechta bola bir mashg‘ulotda ulgurdi?
- Qaysi sahna ko‘proq yoqdi — akvariummi, hayvonot bog‘imi?

Bu savollarning javobi guruhlar paneli va mashg‘ulot skriptlari qanday
bo‘lishini belgilaydi.
