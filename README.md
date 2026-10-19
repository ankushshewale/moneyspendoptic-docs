# App website

Plain HTML site for https://moneyspendoptic.com/ (hosted on Vercel, no build step).

| File | Page |
|---|---|
| `index.html` | Home page (Google's OAuth branding check needs it: describes the app, links to the privacy policy) |
| `privacy.html` | Privacy policy: keep in step with the in-app Legal tabs (see AGENTS.md) |
| `logo.png` | App logo, 240 px |

**Vercel:** project `moneyspendoptic-docs` › Settings › General › **Root Directory** = `website`. Every push to `main` redeploys.
A page's URL is its file name (`privacy.html` → `/privacy.html`). Add images and CSS in this folder and link them with relative paths.
