# App website

Plain HTML site for https://www.moneyspendoptic.com/ (hosted on Vercel, no framework, no build step).

| File | Page |
|---|---|
| `index.html` | Home page (design: `docs/website-design/`; styles are inline). Keeps the app description, the Drive `drive.file` note and the privacy link that Google's OAuth branding check needs (footer) |
| `site.js` | Highlights gallery and its enlarge view, hero tilt, count-up facts, questions, computer-view code demo, region for the hero salary card (no framework) |
| `privacy.html` | Privacy policy: keep in step with the in-app Legal tabs (see AGENTS.md) |
| `fonts/` | Outfit `.woff2` (300/400/500/600) made from `app/src/main/res/font/outfit_*.ttf`, plus `OFL.txt` (the licence) |
| `screens/` | WebP pictures used by the hero and the computer-view demo (made-up demo data) |
| `features/` | The Play-style feature pictures (JPEG) of the Highlights gallery; the same set as `PlayStore Listing/` (made by `tools/play/make_feature_image.py`) |
| `logo.png` | App logo, 240 px |
| `app-ads.txt` | AdMob seller file; keep the path |

**Vercel:** project `moneyspendoptic-docs` › Settings › General › **Root Directory** = `website`. Every push to `main` redeploys.
A page's URL is its file name (`privacy.html` → `/privacy.html`). Add images and CSS in this folder and link them with relative paths.

**Before going live:** every Google Play button points to `#get`; search `TODO` in `index.html` for the three places to put the real Play Store link.
