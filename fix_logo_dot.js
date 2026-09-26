const fs = require('fs');

const files = ['index.html','home-2.html','contact.html','portfolio.html','services.html','pricing.html','process.html','blog.html'];

// Fix 1: Header logo img - use w-8 h-8 object-contain instead of w-auto object-left object-cover max-w-none
// Fix 2: Footer logo img - same fix
// Fix 3: Remove the glow blur div in header logo (it creates the relative wrapper that can misalign)
//         Keep the glow but make it tighter

// The new canonical header logo (clean, no dot visible):
const LOGO_SRC = 'https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32';

// Clean img tag for both header and footer - contain the icon exactly
const CLEAN_IMG = `<img alt="ApexLabs Mobile Studio Logo" class="w-8 h-8 object-contain rounded-lg" src="${LOGO_SRC}">`;

// Clean img div wrapper (no overflow-hidden needed with contain)
const CLEAN_IMG_WRAPPER = `<div class="w-8 h-8 flex-shrink-0">${CLEAN_IMG}</div>`;

files.forEach(f => {
  try {
    let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
    let changed = false;

    // ── Fix header logo ──
    // Old pattern: <div class="w-8 h-8 overflow-hidden inline-block relative z-10 rounded-lg"><img alt="ApexLabs Mobile Studio Logo" class="h-8 w-auto object-left object-cover max-w-none" src="...">
    // New: <div class="w-8 h-8 flex-shrink-0"><img ... class="w-8 h-8 object-contain rounded-lg">
    
    // Replace in header
    const headerIdx = content.indexOf('<header');
    if (headerIdx !== -1) {
      const headerEnd = content.indexOf('</header>', headerIdx) + 9;
      let headerChunk = content.substring(headerIdx, headerEnd);
      
      // Fix the img wrapper + img tag in header
      const oldImgWrapper = /<div class="w-8 h-8 overflow-hidden inline-block relative z-10 rounded-lg"><img alt="ApexLabs Mobile Studio Logo" class="h-8 w-auto object-left object-cover max-w-none" src="[^"]*"><\/div>/;
      if (oldImgWrapper.test(headerChunk)) {
        headerChunk = headerChunk.replace(oldImgWrapper, CLEAN_IMG_WRAPPER);
        content = content.substring(0, headerIdx) + headerChunk + content.substring(headerEnd);
        changed = true;
        console.log(f + ': ✓ header logo img fixed');
      } else {
        // Try just fixing the img class
        const oldImgTag = /<img alt="ApexLabs Mobile Studio Logo" class="h-8 w-auto object-left object-cover max-w-none" src="([^"]*)"\s*>/;
        const headerChunk2 = content.substring(headerIdx, content.indexOf('</header>', headerIdx) + 9);
        if (oldImgTag.test(headerChunk2)) {
          const fixed = headerChunk2.replace(oldImgTag, `<img alt="ApexLabs Mobile Studio Logo" class="w-8 h-8 object-contain rounded-lg" src="$1">`);
          content = content.substring(0, headerIdx) + fixed + content.substring(content.indexOf('</header>', headerIdx) + 9);
          changed = true;
          console.log(f + ': ✓ header img class fixed (fallback)');
        } else {
          console.log(f + ': header img not matched');
        }
      }
    }

    // ── Fix footer logo ──
    const footerIdx = content.indexOf('<footer');
    if (footerIdx !== -1) {
      const footerEnd = content.indexOf('</footer>', footerIdx) + 9;
      let footerChunk = content.substring(footerIdx, footerEnd);
      
      // Footer uses same img pattern
      const oldFooterImg = /<img alt="ApexLabs Mobile Studio Logo" class="h-8 w-auto object-left object-cover max-w-none" src="([^"]*)"\s*>/;
      if (oldFooterImg.test(footerChunk)) {
        footerChunk = footerChunk.replace(oldFooterImg, `<img alt="ApexLabs Mobile Studio Logo" class="w-8 h-8 object-contain rounded-lg" src="$1">`);
        // Also fix the wrapper div if it has overflow-hidden
        footerChunk = footerChunk.replace(
          /<div class="w-8 h-8 overflow-hidden inline-block relative z-10 rounded-lg">/g,
          '<div class="w-8 h-8 flex-shrink-0">'
        );
        footerChunk = footerChunk.replace(
          /<div class="w-8 h-8 overflow-hidden inline-block  rounded-lg">/g,
          '<div class="w-8 h-8 flex-shrink-0">'
        );
        content = content.substring(0, footerIdx) + footerChunk + content.substring(footerEnd);
        changed = true;
        console.log(f + ': ✓ footer logo img fixed');
      } else {
        console.log(f + ': footer img not matched');
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
