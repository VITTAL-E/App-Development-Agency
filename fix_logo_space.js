const fs = require('fs');

const files = ['index.html','home-2.html','contact.html','portfolio.html','services.html','pricing.html','process.html','blog.html'];

const LOGO_SRC = 'https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32';

// ── Canonical HEADER logo (original icon style + space between Apex and Labs) ──
// - Original overflow-hidden + object-left + object-cover (shows the "A" icon cleanly)
// - "Apex Labs" with a space
const HEADER_LOGO = `<a class="group flex items-center gap-space-sm relative" href="index.html"><div class="relative flex items-center justify-center"><div class="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-all"></div><div class="w-8 h-8 overflow-hidden inline-block relative z-10 rounded-lg"><img alt="ApexLabs Mobile Studio Logo" class="h-8 w-8 object-cover object-center rounded-lg" src="${LOGO_SRC}"></div></div><span class="font-title-sm text-title-sm text-on-surface tracking-tight flex items-center gap-1.5">Apex <span class="text-primary">Labs</span><span class="font-label-code text-label-code px-1.5 py-0.5 rounded bg-surface-container-high text-primary border border-primary/30">v3.2</span></span></a>`;

// ── Canonical FOOTER logo brand block (same space, same icon style) ──
// Used inside the footer anchor <a href="index.html" ...>
const FOOTER_LOGO_INNER = `<div class="relative flex items-center justify-center"><div class="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-all"></div><div class="w-8 h-8 overflow-hidden inline-block relative z-10 rounded-lg"><img alt="ApexLabs Mobile Studio Logo" class="h-8 w-8 object-cover object-center rounded-lg" src="${LOGO_SRC}"></div></div><span class="font-title-sm text-title-sm text-on-surface tracking-tight">Apex <span class="text-primary">Labs</span></span>`;

files.forEach(f => {
  try {
    let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
    let changed = false;

    // ══ 1. Fix HEADER logo ══
    const headerIdx = content.indexOf('<header');
    if (headerIdx !== -1) {
      const headerEnd = content.indexOf('</header>', headerIdx) + 9;
      let headerChunk = content.substring(headerIdx, headerEnd);

      // Find logo anchor start
      let logoStart = headerChunk.indexOf('<a class="group flex items-center gap-space-sm');
      if (logoStart === -1) {
        // fallback: find by img alt
        const imgIdx = headerChunk.indexOf('ApexLabs Mobile Studio Logo');
        if (imgIdx !== -1) {
          logoStart = headerChunk.lastIndexOf('<a ', imgIdx);
        }
      }

      if (logoStart !== -1) {
        // Find end of anchor
        const anchorArea = headerChunk.substring(logoStart);
        let depth = 0, endIdx = -1, i = 0;
        while (i < anchorArea.length) {
          if (anchorArea.substring(i).match(/^<a[\s>]/)) { depth++; i += 2; }
          else if (anchorArea.substring(i).startsWith('</a>')) { depth--; if (depth === 0) { endIdx = i + 4; break; } i += 4; }
          else i++;
        }
        if (endIdx !== -1) {
          const oldBlock = anchorArea.substring(0, endIdx);
          if (oldBlock !== HEADER_LOGO) {
            headerChunk = headerChunk.substring(0, logoStart) + HEADER_LOGO + anchorArea.substring(endIdx);
            content = content.substring(0, headerIdx) + headerChunk + content.substring(headerEnd);
            changed = true;
            console.log(f + ': ✓ header logo updated');
          } else {
            console.log(f + ': header already correct');
          }
        }
      }
    }

    // ══ 2. Fix FOOTER logo anchor (the <a href="index.html"> block) ══
    const footerIdx = content.indexOf('<footer');
    if (footerIdx !== -1) {
      const footerEnd = content.indexOf('</footer>', footerIdx) + 9;
      let footerChunk = content.substring(footerIdx, footerEnd);

      // Find the logo anchor in footer
      const logoAnchorIdx = footerChunk.indexOf('<a href="index.html" class="flex items-center gap-space-sm hover:opacity-80 transition-opacity group">');
      if (logoAnchorIdx !== -1) {
        // Find end of anchor
        const anchorArea = footerChunk.substring(logoAnchorIdx);
        let depth = 0, endIdx = -1, i = 0;
        while (i < anchorArea.length) {
          if (anchorArea.substring(i).match(/^<a[\s>]/)) { depth++; i += 2; }
          else if (anchorArea.substring(i).startsWith('</a>')) { depth--; if (depth === 0) { endIdx = i + 4; break; } i += 4; }
          else i++;
        }
        if (endIdx !== -1) {
          // Rebuild the footer logo anchor with standardized inner content
          const newAnchor = `<a href="index.html" class="flex items-center gap-space-sm hover:opacity-80 transition-opacity group">${FOOTER_LOGO_INNER}</a>`;
          footerChunk = footerChunk.substring(0, logoAnchorIdx) + newAnchor + anchorArea.substring(endIdx);
          content = content.substring(0, footerIdx) + footerChunk + content.substring(footerEnd);
          changed = true;
          console.log(f + ': ✓ footer logo updated');
        }
      } else {
        console.log(f + ': footer logo anchor not found in expected format');
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
