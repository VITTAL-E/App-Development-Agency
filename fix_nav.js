const fs = require('fs');

const files = [
  { file: 'index.html',     active: 'Home' },
  { file: 'home-2.html',    active: 'Home' },
  { file: 'services.html',  active: 'Services' },
  { file: 'portfolio.html', active: 'Portfolio' },
  { file: 'process.html',   active: 'Process' },
  { file: 'pricing.html',   active: 'Pricing' },
  { file: 'blog.html',      active: 'Blog' },
  { file: 'contact.html',   active: 'Contact' },
];

// ── Canonical header nav (same for all pages, active page is set by JS below) ──
// Key fixes:
//  1. Dropdown bg is fully opaque (bg-surface-container-lowest not /90)
//  2. Dropdown uses negative margin-top (-mt-px) + padding-top so no hover gap
//  3. Active state set dynamically by JS per-page
//  4. Home button is default (no hardcoded active class)

function buildNav(activePage) {
  const isHomeActive = activePage === 'Home';
  
  // nav link helper
  const link = (label, href, page) => {
    const isActive = activePage === page;
    const activeClass = isActive
      ? 'bg-surface-container-high text-primary font-semibold shadow-[0_0_16px_rgba(6,182,212,0.2)] border border-primary/30'
      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-transparent';
    return `<a class="px-3 py-2 rounded font-body-sm text-body-sm ${activeClass} transition-all" href="${href}">${label}</a>`;
  };

  // Home dropdown button classes
  const homeActiveClass = isHomeActive
    ? 'bg-surface-container-high text-primary font-semibold shadow-[0_0_16px_rgba(6,182,212,0.2)] border border-primary/30'
    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-transparent';

  return `<nav class="hidden xl:flex items-center gap-space-xs p-1 rounded-lg bg-surface-container-lowest/60 border border-outline-variant/20">` +
    // ── Home dropdown ──
    `<div class="relative group">` +
      `<button type="button" class="flex items-center gap-1 px-3 py-2 rounded transition-all ${homeActiveClass}" aria-haspopup="true">` +
        `<span>Home</span>` +
        `<span class="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover:rotate-180">expand_more</span>` +
      `</button>` +
      // dropdown – no gap so hover stays connected; solid opaque bg
      `<div class="absolute left-0 top-full w-64 hidden group-hover:block z-[100]">` +
        `<div class="mt-1 rounded-xl bg-surface-container border border-outline-variant/40 shadow-2xl p-2 flex flex-col gap-1">` +
          `<a class="flex flex-col p-2.5 rounded-lg ${activePage === 'Home' ? 'bg-surface-container-low' : 'hover:bg-surface-container-high'} transition-all text-left" href="index.html">` +
            `<span class="font-semibold text-[13px] text-primary flex items-center justify-between">Home 1: App Development Agency<span class="material-symbols-outlined text-[14px]">arrow_forward</span></span>` +
            `<span class="text-[11px] text-on-surface-variant mt-0.5">Flagship agency engineering</span>` +
          `</a>` +
          `<a class="flex flex-col p-2.5 rounded-lg hover:bg-surface-container-high transition-all text-left" href="home-2.html">` +
            `<span class="font-semibold text-[13px] text-on-surface flex items-center justify-between">Home 2: Startup &amp; MVP Studio<span class="material-symbols-outlined text-[14px]">arrow_forward</span></span>` +
            `<span class="text-[11px] text-on-surface-variant mt-0.5">Rapid venture MVP delivery</span>` +
          `</a>` +
        `</div>` +
      `</div>` +
    `</div>` +
    link('Services',  'services.html',  'Services') +
    link('Portfolio', 'portfolio.html', 'Portfolio') +
    link('Process',   'process.html',   'Process') +
    link('Pricing',   'pricing.html',   'Pricing') +
    link('Blog',      'blog.html',      'Blog') +
    link('Contact',   'contact.html',   'Contact') +
  `</nav>`;
}

// Patterns that identify the <nav ...> block in the header
const NAV_START_PATTERNS = [
  '<nav class="hidden xl:flex',
  "<nav class='hidden xl:flex",
];

files.forEach(({ file, active }) => {
  try {
    let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + file, 'utf8');

    // Find the header
    const headerIdx = content.indexOf('<header');
    if (headerIdx === -1) { console.log(file + ': no header'); return; }
    
    // Find the nav inside the header
    let navStart = -1;
    for (const pat of NAV_START_PATTERNS) {
      const idx = content.indexOf(pat, headerIdx);
      if (idx !== -1 && idx < headerIdx + 5000) {
        navStart = idx;
        break;
      }
    }
    if (navStart === -1) { console.log(file + ': no nav found'); return; }

    // Find </nav>
    const navEnd = content.indexOf('</nav>', navStart);
    if (navEnd === -1) { console.log(file + ': no </nav> found'); return; }
    const navEndFull = navEnd + 6; // include </nav>

    const oldNav = content.substring(navStart, navEndFull);
    const newNav = buildNav(active);

    if (oldNav === newNav) {
      console.log(file + ': nav already correct');
      return;
    }

    const modified = content.substring(0, navStart) + newNav + content.substring(navEndFull);
    fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/' + file, modified, 'utf8');
    console.log(file + ': ✓ nav updated (active: ' + active + ')');

  } catch(e) {
    console.log(file + ' ERROR:', e.message);
  }
});

console.log('\nAll done!');
