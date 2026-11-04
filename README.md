# Jinghua Piao · 朴景华

Personal academic homepage: https://piaojh97.github.io/

A responsive, bilingual academic website highlighting research in Nature Machine Intelligence, Nature Communications, and the AgentSociety platform.

## Edit the homepage

- `index.html`: biography, highlights, news, the complete publication catalogue, education, honors, and contact information. English and Chinese copy lives in `data-en` / `data-zh` attributes. Paper titles retain their original language.
- `publications.json`: publication metadata, author roles, links, alternate titles, and verification sources.
- `homepage.css`: responsive layout, typography, and light/dark colors.
- `homepage.js`: language/theme preferences, mobile navigation, and publication filtering.
- `images/smalle.png`: existing profile photo.
- `assets/fonts/`: locally hosted DM Sans font files, distributed under the SIL Open Font License.

Edit `publications.json`, then run `python3 scripts/render_publications.py`. Commit both the JSON and regenerated `index.html`. The script updates the year groups and year options. All publications remain present in HTML and readable without JavaScript; no build is required by GitHub Pages.

Set `first` to `"first"`, `"co-first"`, or `null`; set `corresponding` to `true` only when supported by the paper or a confirmed author correction. Keep the supporting URL in `sources`. The first-author filter includes co-first authors; selecting both role checkboxes takes their union, combined with the year and text filters. Alternate titles are searchable but duplicate versions are not listed separately.

The catalogue was reconciled with all 49 Google Scholar records on 2026-11-04, producing 45 distinct works. The four merged pairs are MarketSim / Fidelity Breeds Complexity, CacheSpec / MiniCache, AI Urban Scientist / Accelerating Urban Science Research, and Debiasing International Attitudes / The Roots of International Perceptions. MobiSim-Bench has no date in the author's Scholar record and is listed under undated manuscripts. The Nature Machine Intelligence acceptance of Multi-LLM Systems was confirmed by the author; it is not labelled as published.

MSA-Net and Bi-Dynamic Graph ODE have verified bibliographic records, but their author-role footnotes were inaccessible during this update. They are included in the full list without positive first/corresponding-role flags pending clarification; see `roleVerification` in the catalogue.

## Preview

```sh
python3 -m http.server 8765
```

Visit http://localhost:8765/.

## Deployment

GitHub Pages publishes the root of `master`. `.nojekyll` serves the homepage as static files; no Node, Ruby, build step, API key, or external font service is needed. Push changes to `master` to publish.

The earlier Academic Pages template files are retained for history and optional future use. The current homepage is `index.html`; `_pages/about.md` and `_config.yml` do not control it.

Visual direction inspired by [Chen Gao’s homepage](https://fi.ee.tsinghua.edu.cn/~gaochen/). The homepage implementation is original. Existing Academic Pages licensing is retained in `LICENSE`.
