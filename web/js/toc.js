/* =============================================
   toc.js — TOC Generator + IntersectionObserver
   Tự động tạo mục lục từ heading h2/h3 trong
   nội dung Markdown đã render.
   ============================================= */

/**
 * Build TOC in sidebar from headings inside contentEl.
 * @param {HTMLElement} contentEl   — #content-markdown
 * @param {HTMLElement} tocEl       — #sidebar-toc
 */
function buildTOC(contentEl, tocEl) {
  tocEl.innerHTML = '';

  const headings = contentEl.querySelectorAll('h2, h3');
  if (headings.length === 0) {
    tocEl.closest('.sidebar-toc').style.display = 'none';
    return;
  }
  tocEl.closest('.sidebar-toc').style.display = '';

  const items = [];

  headings.forEach((heading) => {
    const level = heading.tagName === 'H2' ? 2 : 3;
    const text  = heading.textContent.trim();
    const id    = heading.id || slugify(text);
    heading.id  = id; // ensure id is set

    const item = document.createElement('div');
    item.className = `toc-item level-${level}`;
    item.textContent = text;
    item.title = text;
    item.dataset.target = id;

    item.addEventListener('click', () => {
      const target = document.getElementById(id);
      if (target) {
        const topbarH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--topbar-h'),
          10
        ) || 52;
        const y = target.getBoundingClientRect().top + window.scrollY - topbarH - 12;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });

    tocEl.appendChild(item);
    items.push({ id, el: item });
  });

  // IntersectionObserver — highlight active heading
  initHeadingObserver(headings, items);
}

/**
 * Watch headings with IntersectionObserver.
 * Highlights the TOC item corresponding to the heading
 * nearest the top of the viewport.
 */
function initHeadingObserver(headings, tocItems) {
  const activeSet = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSet.add(entry.target.id);
        } else {
          activeSet.delete(entry.target.id);
        }
      });

      // Find the first heading currently visible (in document order)
      let activeId = null;
      headings.forEach((h) => {
        if (activeSet.has(h.id) && !activeId) activeId = h.id;
      });

      // Fallback: find heading just above viewport
      if (!activeId) {
        let closest = null;
        let closestDist = Infinity;
        headings.forEach((h) => {
          const rect = h.getBoundingClientRect();
          if (rect.top <= 80 && Math.abs(rect.top) < closestDist) {
            closestDist = Math.abs(rect.top);
            closest = h.id;
          }
        });
        activeId = closest;
      }

      tocItems.forEach(({ id, el }) => {
        el.classList.toggle('active', id === activeId);
      });
    },
    {
      rootMargin: '-60px 0px -70% 0px',
      threshold: 0,
    }
  );

  headings.forEach((h) => observer.observe(h));
}

/**
 * Convert heading text to a URL-friendly slug.
 * Handles Vietnamese characters.
 */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^\w\sÀ-ỹ]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
