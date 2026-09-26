const fs = require('fs');

const files = ['index.html','home-2.html','contact.html','portfolio.html','services.html','pricing.html','process.html','blog.html'];

// The original URL ends without a size param. Appending =s256 gets an HD version from Google's CDN.
const LOGO_SRC_HD = 'https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32=s256';

// ── Canonical HEADER logo ──
// HD image, object-contain so the full icon is visible, proper rounding
const HEADER_LOGO = `<a class="group flex items-center gap-space-sm relative" href="index.html"><div class="relative flex items-center justify-center"><div class="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-all"></div><div class="w-9 h-9 relative z-10 rounded-xl overflow-hidden"><img alt="ApexLabs Logo" class="w-full h-full object-contain" src="${LOGO_SRC_HD}"></div></div><span class="font-title-sm text-title-sm text-on-surface tracking-tight flex items-center gap-1.5">Apex <span class="text-primary">Labs</span><span class="font-label-code text-label-code px-1.5 py-0.5 rounded bg-surface-container-high text-primary border border-primary/30">v3.2</span></span></a>`;

// ── Canonical FOOTER logo (same icon style + same "Apex Labs" spacing) ──
const FOOTER_LOGO_ANCHOR = `<a href="index.html" class="flex items-center gap-space-sm hover:opacity-80 transition-opacity group"><div class="relative flex items-center justify-center"><div class="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-all"></div><div class="w-9 h-9 relative z-10 rounded-xl overflow-hidden"><img alt="ApexLabs Logo" class="w-full h-full object-contain" src="${LOGO_SRC_HD}"></div></div><span class="font-title-sm text-title-sm text-on-surface tracking-tight">Apex <span class="text-primary">Labs</span></span></a>`;

files.forEach(f => {
  try {
    let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
    let changed = false;

    // ══ 1. Fix HEADER logo ══
    const headerIdx = content.indexOf('<header');
    if (headerIdx !== -1) {
      const headerEndIdx = content.indexOf('</header>', headerIdx) + 9;
      let headerChunk = content.substring(headerIdx, headerEndIdx);

      // Find logo anchor
      let logoStart = -1;
      const patterns = [
        '<a class="group flex items-center gap-space-sm relative" href="index.html">',
        '<a class="group flex items-center gap-space-sm" href="index.html">',
      ];
      for (const p of patterns) {
        const idx = headerChunk.indexOf(p);
        if (idx !== -1) { logoStart = idx; break; }
      }
      if (logoStart === -1) {
        const imgIdx = headerChunk.indexOf('ApexLabs');
        if (imgIdx !== -1) {
          const before = headerChunk.substring(0, imgIdx);
          const lastA = before.lastIndexOf('<a ');
          if (lastA !== -1) logoStart = lastA;
        }
      }

      if (logoStart !== -1) {
        const anchorArea = headerChunk.substring(logoStart);
        let depth = 0, endIdx = -1, i = 0;
        while (i < anchorArea.length) {
          if (anchorArea.substring(i).match(/^<a[\s>]/)) { depth++; i += 2; }
          else if (anchorArea.substring(i).startsWith('</a>')) {
            depth--;
            if (depth === 0) { endIdx = i + 4; break; }
            i += 4;
          } else i++;
        }
        if (endIdx !== -1) {
          const oldBlock = anchorArea.substring(0, endIdx);
          if (oldBlock !== HEADER_LOGO) {
            headerChunk = headerChunk.substring(0, logoStart) + HEADER_LOGO + anchorArea.substring(endIdx);
            content = content.substring(0, headerIdx) + headerChunk + content.substring(headerEndIdx);
            changed = true;
            console.log(f + ': ✓ header logo → HD');
          } else {
            console.log(f + ': header already HD');
          }
        }
      }
    }

    // ══ 2. Fix FOOTER logo ══
    const footerIdx = content.indexOf('<footer');
    if (footerIdx !== -1) {
      const footerEndIdx = content.indexOf('</footer>', footerIdx) + 9;
      let footerChunk = content.substring(footerIdx, footerEndIdx);

      // Find the footer logo anchor
      let fLogoStart = footerChunk.indexOf('<a href="index.html" class="flex items-center gap-space-sm');
      if (fLogoStart === -1) {
        // Try finding by image alt
        const fImgIdx = footerChunk.indexOf('ApexLabs');
        if (fImgIdx !== -1) {
          const before = footerChunk.substring(0, fImgIdx);
          const lastA = before.lastIndexOf('<a ');
          if (lastA !== -1) fLogoStart = lastA;
        }
      }

      if (fLogoStart !== -1) {
        const anchorArea = footerChunk.substring(fLogoStart);
        let depth = 0, endIdx = -1, i = 0;
        while (i < anchorArea.length) {
          if (anchorArea.substring(i).match(/^<a[\s>]/)) { depth++; i += 2; }
          else if (anchorArea.substring(i).startsWith('</a>')) {
            depth--;
            if (depth === 0) { endIdx = i + 4; break; }
            i += 4;
          } else i++;
        }
        if (endIdx !== -1) {
          const oldBlock = anchorArea.substring(0, endIdx);
          if (oldBlock !== FOOTER_LOGO_ANCHOR) {
            footerChunk = footerChunk.substring(0, fLogoStart) + FOOTER_LOGO_ANCHOR + anchorArea.substring(endIdx);
            content = content.substring(0, footerIdx) + footerChunk + content.substring(footerEndIdx);
            changed = true;
            console.log(f + ': ✓ footer logo → HD');
          } else {
            console.log(f + ': footer already HD');
          }
        }
      } else {
        console.log(f + ': footer logo anchor not found');
      }
    }

    if (changed) {
      fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, content, 'utf8');
    }
  } catch(e) {
    console.log(f + ' ERROR:', e.message);
  }
});

// Also update favicon.png to HD version
const https = require('https');
const faviconUrl = LOGO_SRC_HD;
const faviconPath = 'C:/Users/ADMIN/Desktop/h_app/favicon.png';

function download(url, dest, redirects) {
  if (redirects > 5) return;
  https.get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      download(res.headers.location, dest, (redirects||0)+1);
      return;
    }
    if (res.statusCode !== 200) { console.log('Favicon download failed:', res.statusCode); return; }
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('\n✓ favicon.png updated to HD (' + fs.statSync(dest).size + ' bytes)');
      console.log('\nAll done!');
    });
  }).on('error', (e) => console.log('Download error:', e.message));
}

download(faviconUrl, faviconPath, 0);
