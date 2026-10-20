# App website

Plain HTML site for https://www.moneyspendoptic.com/ (hosted on Vercel, no framework, no build step).

| File | Page |
|---|---|
| `index.html` | Home page (design: `docs/website-design/`; styles are inline). Keeps the app description, the Drive `drive.file` note and the privacy link that Google's OAuth branding check needs (footer) |
| `site.js` | Carousel, hero tilt, count-up facts, questions, computer-view code demo, region for the hero salary card (no framework) |
| `privacy.html` | Privacy policy: keep in step with the in-app Legal tabs (see AGENTS.md) |
| `fonts/` | Outfit `.woff2` (300/400/500/600) made from `app/src/main/res/font/outfit_*.ttf`, plus `OFL.txt` (the licence) |
| `screens/` | WebP pictures of the app screens (made-up demo data) from `docs/website-design/screens/*.png` (`cwebp -q 82`) |
| `logo.png` | App logo, 240 px |
| `app-ads.txt` | AdMob seller file; keep the path |

**Vercel:** project `moneyspendoptic-docs` › Settings › General › **Root Directory** = `website`. Every push to `main` redeploys.
A page's URL is its file name (`privacy.html` → `/privacy.html`). Add images and CSS in this folder and link them with relative paths.

**Before going live:** every Google Play button points to `#get`; search `TODO` in `index.html` for the three places to put the real Play Store link.
