# Kassachi — frontend (Telegram Mini App, React)

4–12 kishilik guruhda navbat bilan pul aylantirish xizmatining Telegram Mini App qismi.
**React 18 + Vite**, Vercel'da joylashadi.
Backend alohida repozitoriyada: https://github.com/falonchiyev11-source/kaassachi-back-and

## Vercel'da ishga tushirish

1. vercel.com → **Add New → Project** → shu repozitoriya. Framework **Vite** avtomatik aniqlanadi (Build: `npm run build`, Output: `dist`). Root Directory bo'sh qoladi.
2. Backend manzilini bering — ikki yo'ldan biri:
   - `public/config.js` faylidagi `API_URL` ni Render manziliga o'zgartiring (qayta build kerak emas, faqat commit), yoki
   - Vercel → Settings → Environment Variables: `VITE_API_URL=https://<render-manzil>` (keyin Redeploy).
3. Vercel bergan manzilni Render'dagi `WEBAPP_URL` o'zgaruvchisiga yozing va backendni qayta deploy qiling.

## Lokal ishga tushirish

```bash
npm install
npm run dev
```

Telegram'siz brauzerda sinash uchun backend'da `DEV_AUTH=1` qo'ying va `public/config.js` ga `DEV_USER: 1` qo'shing (production'da yoqmang).

## Tuzilma

```
index.html              Telegram WebApp SDK va config.js ulanadi
public/config.js        backend manzili (API_URL)
src/main.jsx            kirish nuqtasi
src/App.jsx             ishga tushish, navigatsiya, umumiy holat (context), Telegram "Orqaga" tugmasi
src/api.js              backend so'rovlari (Telegram initData bilan)
src/utils.js            formatlash, sana, navbat hisob-kitoblari
src/hooks.js            guruh amallari va tasdiqlash oynasi
src/components/ui.jsx   ikonalar, avatar, navbat halqasi, sarlavha
src/components/sheets.jsx  oynalar: taklif/QR, qur'a, to'lov, karta, profil
src/pages/              Bosh ekran, Guruh, Navbat jadvali, Guruh yaratish, Karta, Chat, Profil, Bildirishnomalar, Ro'yxatdan o'tish
```
