const fs = require('fs');
const files = ['index.html','contact.html','portfolio.html','services.html','blog.html','pricing.html','process.html','home-2.html'];

// The canonical logo image src (from index.html header)
const LOGO_SRC = 'https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32';

// Standardized footer logo block (always links to index.html, matches header style)
const STANDARD_FOOTER_LOGO = `<a href="index.html" class="flex items-center gap-space-sm hover:opacity-80 transition-opacity group">
  <div class="relative flex items-center justify-center">
    <div class="absolute -inset-1 rounded-full bg-primary/20 blur-md group-hover:bg-primary/40 transition-all"></div>
    <div class="w-8 h-8 overflow-hidden inline-block relative z-10 rounded-lg">
      <img alt="ApexLabs Mobile Studio Logo" class="h-8 w-auto object-left object-cover max-w-none" src="${LOGO_SRC}">
    </div>
  </div>
  <span class="font-title-sm text-title-sm text-on-surface tracking-tight">Apex<span class="text-primary">Labs</span></span>
</a>`;

files.forEach(f => {
  try {
    let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
    const footerIdx = content.toLowerCase().indexOf('<footer');
    if (footerIdx === -1) { console.log(f + ': no footer'); return; }

    // Find the logo anchor we created: <a href="index.html" class="hover:opacity-80 transition-opacity">
    const footerStr = content.substring(footerIdx);
    
    // Find the logo anchor start
    const logoAnchorStart = footerStr.indexOf('<a href="index.html"');
    if (logoAnchorStart === -1) {
      console.log(f + ': no logo anchor found in footer, skipping');
      return;
    }

    // Find the end of the logo anchor (closing </a>)
    const anchorArea = footerStr.substring(logoAnchorStart);
    let depth = 0; // track nested <a> tags (unlikely but safe)
    let endIdx = -1;
    let i = 0;
    while (i < anchorArea.length) {
      if (anchorArea.substring(i).startsWith('<a ') || anchorArea.substring(i).startsWith('<a>')) {
        depth++;
        i += 2;
      } else if (anchorArea.substring(i).startsWith('</a>')) {
        depth--;
        if (depth === 0) {
          endIdx = i + 4;
          break;
        }
        i += 4;
      } else {
        i++;
      }
    }

    if (endIdx === -1) {
      console.log(f + ': cannot find end of logo anchor');
      return;
    }

    const oldLogoBlock = anchorArea.substring(0, endIdx);
    const absoluteStart = footerIdx + logoAnchorStart;
    const absoluteEnd = footerIdx + logoAnchorStart + endIdx;

    // Replace with standardized logo
    const modified = content.substring(0, absoluteStart) + STANDARD_FOOTER_LOGO + content.substring(absoluteEnd);
    fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, modified, 'utf8');
    console.log(f + ': ✓ footer logo standardized');

  } catch(e) {
    console.log(f + ' error:', e.message);
  }
});
console.log('\nDone!');
