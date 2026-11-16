# Loop & Hook – Crochet shop (Netlify)

**Front end:** `public/` (index.html shop, admin.html orders dashboard)
**Back end:** `netlify/functions/` (products, order, orders) with orders stored in Netlify Blobs.

## Deploy
1. Push this folder to GitHub, then in Netlify: Add new site → Import from Git (drag-and-drop does NOT build functions).
2. Site settings → Environment variables → add `ADMIN_TOKEN` = a long secret you choose.
3. Redeploy. Shop is at `/`, your orders are at `/admin.html`.

## Customise
- Products and prices: `netlify/functions/_shared/products.js` (put photos in `public/images/` and set `img: "/images/name.jpg"`).
- Business name, WhatsApp and Instagram: `public/index.html`.
- Local testing: `npm i -g netlify-cli && npm i && netlify dev`.
