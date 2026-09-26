const fs = require('fs');
const path = require('path');
const files = ['index.html','home-2.html','contact.html','portfolio.html','services.html','pricing.html','process.html','blog.html'];

const CLEAN_IMG = `<img alt="ApexLabs Logo" class="w-full h-full object-contain rounded-xl" src="favicon.png">`;
const IMG_WRAPPER = `<div class="w-9 h-9 relative z-10">${CLEAN_IMG}</div>`;

files.forEach(f => {
  try {
    const fullPath = path.join(__dirname, f);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace header logo wrapper
    const headerRegex = /<div class="w-9 h-9 overflow-hidden rounded-xl relative z-10">\s*<img[^>]*>\s*<\/div>/g;
    content = content.replace(headerRegex, IMG_WRAPPER);
    
    // Replace footer logo wrapper
    const wrapperRegex2 = /<div class="w-8 h-8 flex-shrink-0">\s*<img[^>]*>\s*<\/div>/g;
    content = content.replace(wrapperRegex2, `<div class="w-9 h-9 relative z-10">${CLEAN_IMG}</div>`);

    const oldSrc = "https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32=s256";
    const oldSrc2 = "https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32";
    
    content = content.split(oldSrc).join('favicon.png');
    content = content.split(oldSrc2).join('favicon.png');
    
    // Then fix the classes on favicon.png images
    content = content.replace(/<img([^>]*)src="favicon\.png"([^>]*)>/g, (match, p1, p2) => {
        // remove old classes
        let newImg = match.replace(/class="[^"]*"/, 'class="w-full h-full object-contain rounded-xl"');
        if (!newImg.includes('class=')) {
           newImg = match.replace('src=', 'class="w-full h-full object-contain rounded-xl" src=');
        }
        return newImg;
    });

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed', f);
  } catch(e) {
    console.error(e);
  }
});
