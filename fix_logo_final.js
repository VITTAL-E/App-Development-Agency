const fs = require('fs');

const files = ['index.html','home-2.html','contact.html','portfolio.html','services.html','pricing.html','process.html','blog.html'];

// HD URL (=s256 for crisp rendering)
const LOGO_SRC = 'https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32=s256';

// The image is wide: [A' icon] [dot] [ApexLabs text]
// We use object-cover + object-left to crop and show ONLY the A' icon part
// Container is square, image overflows to the right, hidden by overflow-hidden

// ── HEADER LOGO ──
const HEADER_LOGO = [
  '<a class="group flex items-center gap-3 relative" href="index.html">',
    '<div class="relative flex items-center justify-center">',
      '<div class="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-all"></div>',
      '<div class="w-9 h-9 overflow-hidden rounded-xl relative z-10">',
        `<img alt="ApexLabs Logo" class="h-full w-auto max-w-none object-left object-cover" src="${LOGO_SRC}">`,
      '</div>',
    '</div>',
    '<span class="font-title-sm text-title-sm text-on-surface tracking-tight flex items-center gap-1.5">',
      'Apex <span class="text-primary">Labs</span>',
      '<span class="font-label-code text-label-code px-1.5 py-0.5 rounded bg-surface-container-high text-primary border border-primary/30">v3.2</span>',
    '</span>',
  '</a>'
].join('');

// ── FOOTER LOGO ── (same icon, same "Apex Labs" spacing, no v3.2 badge)
const FOOTER_LOGO = [
  '<a href="index.html" class="flex items-center gap-3 hover:opacity-80 transition-opacity group">',
    '<div class="relative flex items-center justify-center">',
      '<div class="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-all"></div>',
      '<div class="w-9 h-9 overflow-hidden rounded-xl relative z-10">',
        `<img alt="ApexLabs Logo" class="h-full w-auto max-w-none object-left object-cover" src="${LOGO_SRC}">`,
      '</div>',
    '</div>',
    '<span class="font-title-sm text-title-sm text-on-surface tracking-tight">',
      'Apex <span class="text-primary">Labs</span>',
    '</span>',
  '</a>'
].join('');

// Helper: find and replace an <a> block
function replaceAnchor(chunk, searchStart, replacement) {
  // Find logo anchor start
  let logoStart = -1;
  const patterns = [
    '<a class="group flex items-center gap-space-sm relative" href="index.html">',
    '<a class="group flex items-center gap-3 relative" href="index.html">',
    '<a class="group flex items-center gap-space-sm" href="index.html">',
  ];
  for (const p of patterns) {
    const idx = chunk.indexOf(p, searchStart);
    if (idx !== -1) { logoStart = idx; break; }
  }
  if (logoStart === -1) {
    // Fallback: find by logo alt text
    const imgIdx = chunk.indexOf('ApexLabs Logo', searchStart);
    if (imgIdx === -1) return null;
    const before = chunk.substring(0, imgIdx);
    const lastA = before.lastIndexOf('<a ');
    if (lastA === -1) return null;
    logoStart = lastA;
  }

  // Walk to find matching </a>
  const anchorArea = chunk.substring(logoStart);
  let depth = 0, endIdx = -1, i = 0;
  while (i < anchorArea.length) {
    if (anchorArea.substring(i).match(/^<a[\s>]/)) { depth++; i += 2; }
    else if (anchorArea.substring(i).startsWith('</a>')) {
      depth--;
      if (depth === 0) { endIdx = i + 4; break; }
      i += 4;
    } else i++;
  }
  if (endIdx === -1) return null;

  return chunk.substring(0, logoStart) + replacement + anchorArea.substring(endIdx);
}

// Helper for footer anchor (different class pattern)
function replaceFooterAnchor(chunk, replacement) {
  let logoStart = -1;
  const patterns = [
    '<a href="index.html" class="flex items-center gap-space-sm hover:opacity-80 transition-opacity group">',
    '<a href="index.html" class="flex items-center gap-3 hover:opacity-80 transition-opacity group">',
  ];
  for (const p of patterns) {
    const idx = chunk.indexOf(p);
    if (idx !== -1) { logoStart = idx; break; }
  }
  if (logoStart === -1) {
    // Fallback: find first <a href="index.html" in footer
    logoStart = chunk.indexOf('<a href="index.html"');
    if (logoStart === -1) return null;
  }

  const anchorArea = chunk.substring(logoStart);
  let depth = 0, endIdx = -1, i = 0;
  while (i < anchorArea.length) {
    if (anchorArea.substring(i).match(/^<a[\s>]/)) { depth++; i += 2; }
    else if (anchorArea.substring(i).startsWith('</a>')) {
      depth--;
      if (depth === 0) { endIdx = i + 4; break; }
      i += 4;
    } else i++;
  }
  if (endIdx === -1) return null;

  return chunk.substring(0, logoStart) + replacement + anchorArea.substring(endIdx);
}

files.forEach(f => {
  try {
    let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
    let changed = false;

    // ══ Fix HEADER ══
    const headerIdx = content.indexOf('<header');
    if (headerIdx !== -1) {
      const headerEndIdx = content.indexOf('</header>', headerIdx) + 9;
      let headerChunk = content.substring(headerIdx, headerEndIdx);
      const result = replaceAnchor(headerChunk, 0, HEADER_LOGO);
      if (result && result !== headerChunk) {
        content = content.substring(0, headerIdx) + result + content.substring(headerEndIdx);
        changed = true;
        console.log(f + ': ✓ header logo → HD A\' icon');
      }
    }

    // ══ Fix FOOTER ══
    const footerIdx = content.indexOf('<footer');
    if (footerIdx !== -1) {
      const footerEndIdx = content.indexOf('</footer>', footerIdx) + 9;
      let footerChunk = content.substring(footerIdx, footerEndIdx);
      const result = replaceFooterAnchor(footerChunk, FOOTER_LOGO);
      if (result && result !== footerChunk) {
        content = content.substring(0, footerIdx) + result + content.substring(footerEndIdx);
        changed = true;
        console.log(f + ': ✓ footer logo → HD A\' icon + "Apex Labs"');
      }
    }

    if (changed) {
      fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, content, 'utf8');
    }
  } catch(e) {
    console.log(f + ' ERROR:', e.message);
  }
});

console.log('\nDone!');
