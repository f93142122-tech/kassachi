# Kassachi — frontend (Telegram Mini App)

4–12 kishilik guruhda navbat bilan pul aylantirish xizmatining Telegram Mini App qismi. Statik sayt, build talab qilmaydi, Vercel'da joylashadi.
Backend alohida repozitoriyada: https://github.com/falonchiyev11-source/kaassachi-back-and

## Vercel'da ishga tushirish

1. `config.js` faylidagi `API_URL` ga Render'dagi backend manzilini yozing va commit qiling.
2. vercel.com → **Add New → Project** → shu repozitoriya → Framework: **Other** → Deploy (Root Directory bo'sh qoladi).
3. Vercel bergan manzilni Render'dagi `WEBAPP_URL` o'zgaruvchisiga yozing va backendni qayta deploy qiling.

## Fayllar

- `index.html`: sahifa, Telegram WebApp SDK
- `app.js`: ilova mantiqi va ekranlar
- `styles.css`: dizayn
- `config.js`: backend manzili
