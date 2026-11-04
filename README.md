# Jinghua Piao · 朴景华

Personal academic homepage: https://piaojh97.github.io/

A responsive, bilingual academic website highlighting research in Nature Machine Intelligence, Nature Communications, and the AgentSociety platform.

## Edit the homepage

- `index.html`: biography, highlights, news, selected publications, education, honors, and contact information. English and Chinese copy lives in `data-en` / `data-zh` attributes. Paper titles retain their original language.
- `homepage.css`: responsive layout, typography, and light/dark colors.
- `homepage.js`: language/theme preferences, mobile navigation, and publication filtering.
- `images/smalle.png`: existing profile photo.
- `assets/fonts/`: locally hosted DM Sans font files, distributed under the SIL Open Font License.

For a publication, add an `<article class="paper">` inside `.papers` and set `data-year` and `data-first`. Add a year to the filter if necessary. All publications are present in HTML and readable without JavaScript.

## Preview

```sh
python3 -m http.server 8765
```

Visit http://localhost:8765/.

## Deployment

GitHub Pages publishes the root of `master`. `.nojekyll` serves the homepage as static files; no Node, Ruby, build step, API key, or external font service is needed. Push changes to `master` to publish.

The earlier Academic Pages template files are retained for history and optional future use. The current homepage is `index.html`; `_pages/about.md` and `_config.yml` do not control it.

Visual direction inspired by [Chen Gao’s homepage](https://fi.ee.tsinghua.edu.cn/~gaochen/). The homepage implementation is original. Existing Academic Pages licensing is retained in `LICENSE`.
