const fs = require('fs');
const files = ['index.html','contact.html','portfolio.html','services.html','blog.html','pricing.html','process.html','home-2.html'];

const LOGO_SRC = 'https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32';

files.forEach(f => {
  try {
    const content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
    
    // Check header logo
    const headerIdx = content.indexOf('<header');
    if (headerIdx === -1) { console.log(f + ': no header'); return; }
    
    const headerStr = content.substring(headerIdx, headerIdx + 3000);
    
    // Check if logo image is present in header
    const hasLogoImg = headerStr.indexOf('ApexLabs Mobile Studio Logo') !== -1 || headerStr.indexOf('ApexLabs logo') !== -1;
    const hasCorrectSrc = headerStr.indexOf(LOGO_SRC) !== -1;
    
    // Check footer
    const footerIdx = content.indexOf('<footer');
    const footerStr = footerIdx !== -1 ? content.substring(footerIdx, footerIdx + 1000) : '';
    const footerHasLink = footerStr.indexOf('href="index.html"') !== -1;
    const footerHasImg = footerStr.indexOf('ApexLabs Mobile Studio Logo') !== -1;
    
    console.log(f + ':');
    console.log('  header logo img: ' + (hasLogoImg ? 'YES' : 'NO'));
    console.log('  header correct src: ' + (hasCorrectSrc ? 'YES' : 'NO'));
    console.log('  footer home link: ' + (footerHasLink ? 'YES' : 'NO'));
    console.log('  footer logo img: ' + (footerHasImg ? 'YES' : 'NO'));
  } catch(e) {
    console.log(f + ' error:', e.message);
  }
});
