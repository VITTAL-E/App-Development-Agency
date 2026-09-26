const fs = require('fs');
const https = require('https');

// Google Photos URLs support crop parameters. 
// =s64-c crops to a 64x64 square from center. But we need the LEFT portion.
// =w64-h64-p means 64x64 with smart crop.
// Let's try =s64-c which should give a square crop.
const FAVICON_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32=s64-c';

function download(url, dest, redirects) {
  if (redirects > 5) { console.log('Too many redirects'); return; }
  https.get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      download(res.headers.location, dest, (redirects||0)+1);
      return;
    }
    if (res.statusCode !== 200) { 
      console.log('HTTP', res.statusCode, '- trying alternate URL...');
      // Try without -c
      const alt = url.replace('=s64-c', '=s64');
      if (url !== alt) download(alt, dest, (redirects||0)+1);
      return; 
    }
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      const stats = fs.statSync(dest);
      console.log('Downloaded favicon.png:', stats.size, 'bytes');
      
      // Now update all pages to point to favicon.png
      updateFaviconTags();
    });
  }).on('error', (e) => console.log('Error:', e.message));
}

function updateFaviconTags() {
  const files = ['index.html','home-2.html','contact.html','portfolio.html','services.html','pricing.html','process.html','blog.html'];
  const FAVICON_TAG = '<link rel="icon" href="favicon.png" type="image/png"><link rel="apple-touch-icon" href="favicon.png">';
  
  files.forEach(f => {
    try {
      let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
      
      // Remove old favicon tags (could be multiple patterns)
      const patterns = [
        /<link rel="icon"[^>]*>/g,
        /<link rel="apple-touch-icon"[^>]*>/g,
      ];
      
      let cleaned = content;
      patterns.forEach(p => { cleaned = cleaned.replace(p, ''); });
      
      // Insert new favicon tag before </head>
      const headClose = cleaned.indexOf('</head>');
      if (headClose !== -1) {
        cleaned = cleaned.substring(0, headClose) + FAVICON_TAG + cleaned.substring(headClose);
        fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, cleaned, 'utf8');
        console.log(f + ': ✓ favicon tag updated');
      } else {
        console.log(f + ': no </head> found');
      }
    } catch(e) {
      console.log(f + ' ERROR:', e.message);
    }
  });
  
  console.log('\nAll done!');
}

download(FAVICON_URL, 'C:/Users/ADMIN/Desktop/h_app/favicon.png', 0);
