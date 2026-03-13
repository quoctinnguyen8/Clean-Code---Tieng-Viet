/* =============================================
   app.js — Clean Code Tiếng Việt
   Không dùng jQuery. Fetch API thuần.
   ============================================= */

const CHAPTERS = [
  { title: "Chương 1: Code Sạch",                    link: '/Markdown/Chaper01.md' },
  { title: "Chương 2: Những Cái Tên Rõ Nghĩa",       link: '/Markdown/Chaper02.md' },
  { title: "Chương 3: Hàm",                           link: '/Markdown/Chaper03.md' },
  { title: "Chương 4: Comment",                       link: '/Markdown/Chaper04.md' },
  { title: "Chương 5: Định Dạng Code",                link: '/Markdown/Chaper05.md' },
  { title: "Chương 6: Đối Tượng Và Cấu Trúc Dữ Liệu",link: '/Markdown/Chaper06.md' },
  { title: "Chương 7: Xử Lý Lỗi",                    link: '/Markdown/Chaper07.md' },
  { title: "Chương 8: Ranh Giới",                     link: '/Markdown/Chaper08.md' },
  { title: "Chương 9: Kiểm Tra Đơn Vị",              link: '/Markdown/Chaper09.md' },
  { title: "Chương 10: Lớp",                          link: '/Markdown/Chaper10.md' },
  { title: "Chương 11: Hệ Thống",                     link: '/Markdown/Chaper11_System.md' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getChapterFromURL() {
  const params = new URLSearchParams(window.location.search);
  const ch = parseInt(params.get('chapter'), 10);
  if (!ch || ch < 1 || ch > CHAPTERS.length) return 1;
  return ch;
}

function navigateTo(chapter) {
  const n = Math.max(1, Math.min(CHAPTERS.length, chapter));
  window.location.href = `/index.html?chapter=${String(n).padStart(2, '0')}`;
}

function saveScrollPosition(chapter) {
  localStorage.setItem(`scroll_${chapter}`, window.scrollY);
}

function restoreScrollPosition(chapter) {
  const saved = localStorage.getItem(`scroll_${chapter}`);
  if (saved) window.scrollTo(0, parseInt(saved, 10));
}

// ─── Marked configuration ─────────────────────────────────────────────────────

function configureMarked() {
  // marked v5+ dùng marked.use() với renderer nhận token object
  marked.use({
    breaks: true,
    gfm: true,
    renderer: {
      // token.depth = heading level (1-6), token.text = rendered inline HTML
      heading({ text, depth }) {
        const plain = text.replace(/<[^>]*>/g, '');
        const id = plain
          .toLowerCase()
          .replace(/[^\w\sÀ-ỹ]/g, '')
          .trim()
          .replace(/\s+/g, '-');
        return `<h${depth} id="${id}">${text}</h${depth}>`;
      },
      // token.text = code content, token.lang = language
      code({ text, lang }) {
        const language = lang || 'plaintext';
        const validLang = hljs.getLanguage(language) ? language : 'plaintext';
        const highlighted = hljs.highlight(text, { language: validLang }).value;
        return `
<div class="code-block-wrapper">
  <div class="code-block-header">
    <span class="code-lang-label">${language}</span>
    <button class="btn-copy" onclick="copyCode(this)" title="Sao chép">
      <i class="bi bi-clipboard"></i> Copy
    </button>
  </div>
  <pre><code class="hljs language-${validLang}">${highlighted}</code></pre>
</div>`;
      }
    }
  });
}

// ─── Copy code ────────────────────────────────────────────────────────────────

window.copyCode = function (btn) {
  const code = btn.closest('.code-block-wrapper').querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    btn.classList.add('copied');
    btn.innerHTML = '<i class="bi bi-check2"></i> Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
    }, 2000);
  });
};

// ─── Dark Mode ────────────────────────────────────────────────────────────────

function initDarkMode() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  applyTheme(isDark);

  document.getElementById('btn-dark').addEventListener('click', () => {
    const currentlyDark = document.documentElement.dataset.theme === 'dark';
    applyTheme(!currentlyDark);
    localStorage.setItem('theme', !currentlyDark ? 'dark' : 'light');
  });
}

function applyTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const btn = document.getElementById('btn-dark');
  if (dark) {
    btn.innerHTML = '<i class="bi bi-sun"></i> <span>Light</span>';
    document.getElementById('hljs-theme-light').disabled = true;
    document.getElementById('hljs-theme-dark').disabled = false;
  } else {
    btn.innerHTML = '<i class="bi bi-moon"></i> <span>Dark</span>';
    document.getElementById('hljs-theme-light').disabled = false;
    document.getElementById('hljs-theme-dark').disabled = true;
  }
}

// ─── Font Size ────────────────────────────────────────────────────────────────

function initFontSize() {
  const el = document.getElementById('content-markdown');
  const saved = localStorage.getItem('fontSize');
  if (saved) el.style.fontSize = saved + 'px';

  document.getElementById('btn-font-lg').addEventListener('click', () => {
    const current = parseFloat(window.getComputedStyle(el).fontSize);
    const next = Math.min(current + 2, 26);
    el.style.fontSize = next + 'px';
    localStorage.setItem('fontSize', next);
  });

  document.getElementById('btn-font-sm').addEventListener('click', () => {
    const current = parseFloat(window.getComputedStyle(el).fontSize);
    const next = Math.max(current - 2, 13);
    el.style.fontSize = next + 'px';
    localStorage.setItem('fontSize', next);
  });
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

// ─── Sidebar chapters list ────────────────────────────────────────────────────

function buildSidebarChapters(currentChapter) {
  const container = document.getElementById('sidebar-chapters');
  CHAPTERS.forEach((ch, i) => {
    const item = document.createElement('div');
    item.className = 'sidebar-item' + (i + 1 === currentChapter ? ' active' : '');
    item.textContent = ch.title;
    item.title = ch.title;
    item.addEventListener('click', () => {
      saveScrollPosition(currentChapter);
      navigateTo(i + 1);
    });
    container.appendChild(item);
  });
}

// ─── Navigation buttons ───────────────────────────────────────────────────────

function initNavButtons(chapter) {
  const isFirst = chapter === 1;
  const isLast  = chapter === CHAPTERS.length;

  // Desktop nav
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  btnPrev.disabled = isFirst;
  btnNext.disabled = isLast;
  btnPrev.addEventListener('click', () => { saveScrollPosition(chapter); navigateTo(chapter - 1); });
  btnNext.addEventListener('click', () => { saveScrollPosition(chapter); navigateTo(chapter + 1); });

  document.getElementById('nav-chapter-count').textContent = `${chapter} / ${CHAPTERS.length}`;
  document.getElementById('nav-chapter-title').textContent = CHAPTERS[chapter - 1].title;

  // Mobile bottom nav
  const btnPrevM = document.getElementById('btn-prev-mobile');
  const btnNextM = document.getElementById('btn-next-mobile');
  btnPrevM.disabled = isFirst;
  btnNextM.disabled = isLast;
  btnPrevM.addEventListener('click', () => { saveScrollPosition(chapter); navigateTo(chapter - 1); });
  btnNextM.addEventListener('click', () => { saveScrollPosition(chapter); navigateTo(chapter + 1); });
  document.getElementById('bottom-nav-info').textContent = `${chapter} / ${CHAPTERS.length}`;

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft'  && !isFirst) { saveScrollPosition(chapter); navigateTo(chapter - 1); }
    if (e.key === 'ArrowRight' && !isLast)  { saveScrollPosition(chapter); navigateTo(chapter + 1); }
  });
}

// ─── Mobile sidebar drawer ────────────────────────────────────────────────────

function initSidebarDrawer() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const btnMenu  = document.getElementById('btn-menu');

  function openDrawer()  { sidebar.classList.add('open'); overlay.classList.add('visible'); }
  function closeDrawer() { sidebar.classList.remove('open'); overlay.classList.remove('visible'); }

  btnMenu.addEventListener('click', openDrawer);
  overlay.addEventListener('click', closeDrawer);
}

// ─── Load chapter content ─────────────────────────────────────────────────────

async function loadChapter(chapter) {
  const url = CHAPTERS[chapter - 1].link;
  const el  = document.getElementById('content-markdown');

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    el.innerHTML = marked.parse(text);

    // Build TOC from headings
    buildTOC(el, document.getElementById('sidebar-toc'));

    // Restore scroll position
    restoreScrollPosition(chapter);
  } catch (err) {
    el.innerHTML = `
      <div style="text-align:center;padding:60px 0;color:var(--text-muted)">
        <i class="bi bi-emoji-frown" style="font-size:48px;color:var(--border)"></i>
        <p style="margin-top:16px">Không tải được nội dung. Vui lòng thử lại.</p>
        <small style="opacity:.6">${err.message}</small>
      </div>`;
    console.error('Lỗi tải chương:', err);
  }
}

// ─── Save scroll before leaving ───────────────────────────────────────────────

function initScrollSave(chapter) {
  window.addEventListener('beforeunload', () => saveScrollPosition(chapter));
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  configureMarked();
  initDarkMode();
  initFontSize();
  initProgressBar();
  initSidebarDrawer();

  const chapter = getChapterFromURL();
  document.title = CHAPTERS[chapter - 1].title + ' — Clean Code Tiếng Việt';

  buildSidebarChapters(chapter);
  initNavButtons(chapter);
  initScrollSave(chapter);
  loadChapter(chapter);
});
