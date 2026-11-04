(() => {
  'use strict';
  const root = document.documentElement;
  const safeGet = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const safeSet = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let language = safeGet('jp-language') === 'zh' ? 'zh' : 'en';
  const languageButton = document.querySelector('#language-toggle');
  const themeButton = document.querySelector('#theme-toggle');
  const menuButton = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#navigation');
  const search = document.querySelector('#publication-search');
  const year = document.querySelector('#publication-year');
  const first = document.querySelector('#first-author');
  const papers = [...document.querySelectorAll('.paper')];
  function filterPapers() {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    papers.forEach(paper => {
      const match = (!query || paper.textContent.toLocaleLowerCase().includes(query)) &&
        (year.value === 'all' || paper.dataset.year === year.value) &&
        (!first.checked || paper.dataset.first === 'true');
      paper.hidden = !match;
      if (match) visible++;
    });
    document.querySelector('#publication-count').textContent = language === 'zh' ? `显示 ${visible} / ${papers.length} 篇精选论文` : `Showing ${visible} of ${papers.length} selected publications`;
    document.querySelector('#no-results').hidden = visible !== 0;
  }
  function updateThemeLabel() {
    const isDark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', language === 'zh' ? (isDark ? '切换为浅色模式' : '切换为深色模式') : (isDark ? 'Switch to light appearance' : 'Switch to dark appearance'));
    themeButton.setAttribute('aria-pressed', String(isDark));
  }
  function applyLanguage() {
    root.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-en][data-zh]').forEach(element => { element.textContent = element.dataset[language]; });
    search.placeholder = language === 'zh' ? '搜索论文标题、作者或期刊 / 会议' : 'Search title, author, or venue';
    languageButton.textContent = language === 'zh' ? 'EN' : '中文';
    languageButton.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
    menuButton.setAttribute('aria-label', language === 'zh' ? '切换导航菜单' : 'Toggle navigation');
    updateThemeLabel();
    filterPapers();
  }
  const storedTheme = safeGet('jp-theme');
  root.dataset.theme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    safeSet('jp-theme', root.dataset.theme);
    updateThemeLabel();
  });
  languageButton.addEventListener('click', () => {
    language = language === 'en' ? 'zh' : 'en';
    safeSet('jp-language', language);
    applyLanguage();
  });
  function closeMenu() { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
  search.addEventListener('input', filterPapers);
  year.addEventListener('change', filterPapers);
  first.addEventListener('change', filterPapers);
  const sections = [...document.querySelectorAll('main > [id]')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        nav.querySelectorAll('a').forEach(link => {
          const current = link.hash === `#${entry.target.id}`;
          link.classList.toggle('active', current);
          if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-12% 0px -65% 0px', threshold: 0 });
    sections.forEach(section => observer.observe(section));
  }
  document.querySelectorAll('[data-requires-js]').forEach(element => element.hidden = false);
  applyLanguage();
})();
