const fs = require('fs');
const files = ['index.html','contact.html','portfolio.html','services.html','blog.html','pricing.html','process.html','home-2.html'];

const LOGO_SRC = 'https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32';

// Canonical header logo:
//  - gap-space-sm between icon and text (same as footer)
//  - object-contain so only the icon is shown (no dot bleed)
//  - no overflow-hidden needed with object-contain
const STANDARD_HEADER_LOGO = `<a class="group flex items-center gap-space-sm relative" href="index.html"><div class="relative flex items-center justify-center"><div class="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-all"></div><div class="w-8 h-8 flex-shrink-0 relative z-10"><img alt="ApexLabs Mobile Studio Logo" class="w-8 h-8 object-contain rounded-lg" src="${LOGO_SRC}"></div></div><span class="font-title-sm text-title-sm text-on-surface tracking-tight flex items-center gap-1.5">Apex<span class="text-primary">Labs</span><span class="font-label-code text-label-code px-1.5 py-0.5 rounded bg-surface-container-high text-primary border border-primary/30">v3.2</span></span></a>`;

files.forEach(f => {
  try {
    let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
    
    const headerIdx = content.indexOf('<header');
    if (headerIdx === -1) { console.log(f + ': no header'); return; }

    const headerStr = content.substring(headerIdx);
    
    // Find the logo anchor in header
    let logoAnchorStart = -1;
    const patterns = [
      '<a class="group flex items-center gap-space-sm relative" href="index.html">',
      '<a class="group flex items-center gap-space-sm" href="index.html">',
    ];
    for (const p of patterns) {
      const idx = headerStr.indexOf(p);
      if (idx !== -1) { logoAnchorStart = idx; break; }
    }

    if (logoAnchorStart === -1) {
      // Fallback: find by logo img alt text
      const imgIdx = headerStr.indexOf('ApexLabs Mobile Studio Logo');
      if (imgIdx !== -1) {
        const before = headerStr.substring(0, imgIdx);
        const lastA = before.lastIndexOf('<a ');
        if (lastA !== -1) logoAnchorStart = lastA;
      }
    }
    if (logoAnchorStart === -1) { console.log(f + ': cannot find header logo anchor'); return; }

    // Find end of anchor
    const anchorArea = headerStr.substring(logoAnchorStart);
    let depth = 0, endIdx = -1, i = 0;
    while (i < anchorArea.length) {
      if (anchorArea.substring(i).match(/^<a[\s>]/)) { depth++; i += 2; }
      else if (anchorArea.substring(i).startsWith('</a>')) { depth--; if (depth === 0) { endIdx = i + 4; break; } i += 4; }
      else i++;
    }
    if (endIdx === -1) { console.log(f + ': cannot find end of logo anchor'); return; }

    const absStart = headerIdx + logoAnchorStart;
    const absEnd = headerIdx + logoAnchorStart + endIdx;
    const oldBlock = content.substring(absStart, absEnd);

    if (oldBlock === STANDARD_HEADER_LOGO) { console.log(f + ': already canonical'); return; }

    const modified = content.substring(0, absStart) + STANDARD_HEADER_LOGO + content.substring(absEnd);
    fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, modified, 'utf8');
    console.log(f + ': ✓ header logo standardized (clean, no dot)');

  } catch(e) {
    console.log(f + ' ERROR:', e.message);
  }
});
console.log('\nDone!');
