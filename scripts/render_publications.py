#!/usr/bin/env python3
"""Render the checked publication catalogue into static, no-JS-readable HTML."""
import json
import re
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LABELS = {
    "paper": ("Paper ↗", "论文 ↗"),
    "preprint": ("Preprint ↗", "预印本 ↗"),
    "code": ("Code ↗", "代码 ↗"),
    "platform": ("Platform ↗", "平台 ↗"),
}


def bilingual(en, zh, css=""):
    cls = f' class="{css}"' if css else ""
    return f'<span{cls} data-en="{escape(en)}" data-zh="{escape(zh)}">{escape(en)}</span>'


def render(p):
    title, year = escape(p["title"]), str(p["year"] or "undated")
    assert "Jinghua Piao" in p["authors"], p["title"]
    assert p["first"] in (None, "first", "co-first"), p["title"]
    assert isinstance(p["corresponding"], bool)
    assert p["url"].startswith("https://")
    authors = [f'<strong>{escape(a)}</strong>' if a == "Jinghua Piao" else escape(a) for a in p["authors"]]
    authors = ", ".join(authors[:-1]) + ", and " + authors[-1]
    venue = escape(p["venue"])
    if p.get("status") == "accepted":
        venue += " · " + bilingual("Accepted", "已接收", "acceptance-status")
    elif p.get("status") == "just-accepted":
        venue += " · " + bilingual("Just Accepted", "已接收·在线版", "acceptance-status")
    roles = []
    if p["first"]:
        roles.append(bilingual("Co-first author" if p["first"] == "co-first" else "First author", "共同一作" if p["first"] == "co-first" else "第一作者", "author-role"))
    if p["corresponding"]:
        roles.append(bilingual("Corresponding author", "通讯作者", "author-role"))
    links = []
    for link in p["links"]:
        en, zh = LABELS[link["kind"]]
        assert link["url"].startswith("https://")
        links.append(f'<a href="{escape(link["url"])}" data-en="{en}" data-zh="{zh}">{en}</a>')
    extras = escape(" ".join(p.get("alternateTitles", [])))
    return f'''        <article class="paper" data-year="{year}" data-first="{str(bool(p['first'])).lower()}" data-corresponding="{str(p['corresponding']).lower()}" data-search="{extras}">
          <div><h4><a href="{escape(p['url'])}">{title}</a></h4><p class="authors">{authors}</p><div class="paper-bottom"><span class="venue{' preprint' if p.get('status') == 'preprint' else ''}">{venue}</span>{''.join(roles)}{''.join(links)}</div></div>
        </article>'''


def main():
    papers = json.loads((ROOT / "publications.json").read_text())
    assert len({p["url"] for p in papers}) == len(papers), "Duplicate publication URL"
    assert len({p["title"].casefold() for p in papers}) == len(papers), "Duplicate title"
    years = sorted({p["year"] for p in papers if p["year"]}, reverse=True)
    groups = []
    if any(p["year"] is None for p in papers):
        years.append(None)
    for year in years:
        group = [p for p in papers if p["year"] == year]
        label = str(year) if year else bilingual("Undated manuscripts", "未标年份的文稿")
        groups.append(f'      <section class="paper-group" aria-labelledby="year-{year or "undated"}">\n        <h3 class="paper-group-title" id="year-{year or "undated"}">{label}</h3>\n' + "\n".join(map(render, group)) + '\n      </section>')
    path = ROOT / "index.html"
    html = path.read_text()
    start, end = "<!-- PUBLICATIONS:START -->", "<!-- PUBLICATIONS:END -->"
    assert html.count(start) == html.count(end) == 1
    html = re.sub(re.escape(start) + r".*?" + re.escape(end), lambda _: start + "\n" + "\n".join(groups) + "\n      " + end, html, flags=re.S)
    options = '<option value="all" data-en="All years" data-zh="全部年份">All years</option>'
    options += ''.join(f'<option value="{y}">{y}</option>' if y else '<option value="undated" data-en="Undated" data-zh="未标年份">Undated</option>' for y in years)
    html = re.sub(r'(<select id="publication-year">).*?(</select>)', lambda m: m[1] + options + m[2], html, flags=re.S)
    path.write_text(html)
    print(f'Rendered {len(papers)} publications; {sum(bool(p["first"]) for p in papers)} first/co-first; {sum(p["corresponding"] for p in papers)} corresponding.')


if __name__ == "__main__":
    main()
