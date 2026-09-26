const fs = require('fs');

const files = ['index.html','home-2.html','contact.html','portfolio.html','services.html','pricing.html','process.html','blog.html'];

// The source image is rectangular (wider than tall). The A' icon is in the leftmost square portion.
// Using a clip-path to show only the leftmost square portion of the image.
// The image aspect ratio appears to be roughly 3:1 (icon + dot + text), so the icon is about the first 33%.
// Using clip-path: inset(0 67% 0 0) would clip the right 67%, showing only the left 33%.
// But a simpler approach: make the image much taller than the container so the icon fills it.
// With h-[200%] and object-left object-cover, only the very leftmost portion (the A' icon) shows.

const LOGO_SRC = 'https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32=s256';

// The trick: use a fixed-size container with overflow-hidden, and set the image height to 
// match container height but let width be auto (much wider). With object-position: left,
// we see only the leftmost portion. The key is the image needs to be TALL enough.
// Actually, the real issue is the image at =s256 returns a 256px tall image with proportional width.
// So if the image is ~768x256 (3:1), and our container is 36x36, then:
//   h-9 (36px) means the image scales to 36px tall, ~108px wide
//   overflow-hidden on a 36px wide container shows left 36px = just the icon!
// That should work. Let me verify the image classes are correct.

// The image tag: class="h-full w-auto max-w-none object-left"
// - h-full: fills container height (36px)
// - w-auto: width proportional to height (so ~108px if 3:1 aspect ratio)
// - max-w-none: override any max-width constraint  
// - object-left: align to left edge
// But wait - object-left only works with object-fit. Without object-fit, the img just renders at its natural w-auto size.
// We DON'T want object-cover here since the img is already sized by h-full/w-auto.
// The container's overflow-hidden handles the cropping.

const IMG_TAG = `<img alt="ApexLabs Logo" class="h-9 w-auto max-w-none" src="${LOGO_SRC}">`;

// ── HEADER LOGO ──
const HEADER_LOGO = [
  '<a class="group flex items-center gap-3 relative" href="index.html">',
    '<div class="relative flex items-center justify-center">',
      '<div class="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-all"></div>',
      '<div class="w-9 h-9 overflow-hidden rounded-xl relative z-10">',
        IMG_TAG,
      '</div>',
    '</div>',
    '<span class="font-title-sm text-title-sm text-on-surface tracking-tight flex items-center gap-1.5">',
      'Apex <span class="text-primary">Labs</span>',
      '<span class="font-label-code text-label-code px-1.5 py-0.5 rounded bg-surface-container-high text-primary border border-primary/30">v3.2</span>',
    '</span>',
  '</a>'
].join('');

// ── FOOTER LOGO ──
const FOOTER_LOGO = [
  '<a href="index.html" class="flex items-center gap-3 hover:opacity-80 transition-opacity group">',
    '<div class="relative flex items-center justify-center">',
      '<div class="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-all"></div>',
      '<div class="w-9 h-9 overflow-hidden rounded-xl relative z-10">',
        IMG_TAG,
      '</div>',
    '</div>',
    '<span class="font-title-sm text-title-sm text-on-surface tracking-tight">',
      'Apex <span class="text-primary">Labs</span>',
    '</span>',
  '</a>'
].join('');

function findAndReplaceAnchor(chunk, startPatterns, replacement) {
  let logoStart = -1;
  for (const p of startPatterns) {
    const idx = chunk.indexOf(p);
    if (idx !== -1) { logoStart = idx; break; }
  }
  if (logoStart === -1) {
    // Fallback
    const imgIdx = chunk.indexOf('ApexLabs Logo');
    if (imgIdx === -1) return null;
    logoStart = chunk.lastIndexOf('<a ', imgIdx);
    if (logoStart === -1) return null;
  }
  
  const anchorArea = chunk.substring(logoStart);
  let depth = 0, endIdx = -1, i = 0;
  while (i < anchorArea.length) {
    if (anchorArea.substring(i).match(/^<a[\s>]/)) { depth++; i += 2; }
    else if (anchorArea.substring(i).startsWith('</a>')) {
      depth--; if (depth === 0) { endIdx = i + 4; break; } i += 4;
    } else i++;
  }
  if (endIdx === -1) return null;
  return chunk.substring(0, logoStart) + replacement + anchorArea.substring(endIdx);
}

files.forEach(f => {
  try {
    let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
    let changed = false;

    // ══ HEADER ══
    const headerIdx = content.indexOf('<header');
    if (headerIdx !== -1) {
      const headerEndIdx = content.indexOf('</header>', headerIdx) + 9;
      let headerChunk = content.substring(headerIdx, headerEndIdx);
      const result = findAndReplaceAnchor(headerChunk, [
        '<a class="group flex items-center gap-3 relative" href="index.html">',
        '<a class="group flex items-center gap-space-sm relative" href="index.html">',
      ], HEADER_LOGO);
      if (result && result !== headerChunk) {
        content = content.substring(0, headerIdx) + result + content.substring(headerEndIdx);
        changed = true;
        console.log(f + ': ✓ header');
      }
    }

    // ══ FOOTER ══
    const footerIdx = content.indexOf('<footer');
    if (footerIdx !== -1) {
      const footerEndIdx = content.indexOf('</footer>', footerIdx) + 9;
      let footerChunk = content.substring(footerIdx, footerEndIdx);
      const result = findAndReplaceAnchor(footerChunk, [
        '<a href="index.html" class="flex items-center gap-3 hover:opacity-80 transition-opacity group">',
        '<a href="index.html" class="flex items-center gap-space-sm hover:opacity-80 transition-opacity group">',
      ], FOOTER_LOGO);
      if (result && result !== footerChunk) {
        content = content.substring(0, footerIdx) + result + content.substring(footerEndIdx);
        changed = true;
        console.log(f + ': ✓ footer');
      }
    }

    if (changed) fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, content, 'utf8');
  } catch(e) {
    console.log(f + ' ERROR:', e.message);
  }
});

console.log('\nDone!');
