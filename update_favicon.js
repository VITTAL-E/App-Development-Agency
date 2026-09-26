const https = require('https');
const fs = require('fs');
const path = require('path');

const LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1U8OFUVK46mzAF2ZrNa3K_jP5TRhW_EE_4JTi8UML69qw9x5icvEkIAUCTfPY9L9oZLzCRxfZbvwQWxr4eq0Oh-AHd7WpLLfs4dLbwVA8EmcTWEiIh4oFsxKUro_8tFvu-oVlbdVj1du6-pmXMXwu0-R-PPbW_P9jw-crlNG0avz7opxvSHV9nkuWtUNsy4wy_g6A69q-0l3dHNJN3ZpJllv3ar_bsiII5naXDDDpZwSk6XX0Yo_An4S-32';
const OUTPUT = path.join('C:/Users/ADMIN/Desktop/h_app', 'favicon.png');

console.log('Downloading logo as favicon.png...');

function download(url, dest, redirectCount) {
  if (redirectCount > 5) { console.log('Too many redirects'); return; }
  https.get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      console.log('Redirecting to:', res.headers.location);
      download(res.headers.location, dest, (redirectCount || 0) + 1);
      return;
    }
    if (res.statusCode !== 200) {
      console.log('Error: HTTP', res.statusCode);
      return;
    }
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      const stats = fs.statSync(dest);
      console.log('Downloaded favicon.png - size:', stats.size, 'bytes');
      
      // Now update all HTML files
      const htmlFiles = ['index.html','home-2.html','contact.html','portfolio.html','services.html','pricing.html','process.html','blog.html'];
      
      const OLD_FAVICON_PATTERN = /<link rel="icon" href="[^"]*" type="[^"]*">/g;
      const NEW_FAVICON = `<link rel="icon" href="favicon.png" type="image/png"><link rel="apple-touch-icon" href="favicon.png">`;
      
      htmlFiles.forEach(f => {
        try {
          let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
          
          if (OLD_FAVICON_PATTERN.test(content)) {
            OLD_FAVICON_PATTERN.lastIndex = 0; // reset regex
            const modified = content.replace(OLD_FAVICON_PATTERN, NEW_FAVICON);
            fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, modified, 'utf8');
            console.log(f + ': ✓ favicon updated to favicon.png');
          } else {
            // Try inserting before </head>
            const headClose = content.indexOf('</head>');
            if (headClose !== -1) {
              const modified = content.substring(0, headClose) + NEW_FAVICON + content.substring(headClose);
              fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, modified, 'utf8');
              console.log(f + ': ✓ favicon inserted before </head>');
            } else {
              console.log(f + ': could not update favicon');
            }
          }
        } catch(e) {
          console.log(f + ' error:', e.message);
        }
      });
      
      console.log('\nAll done!');
    });
  }).on('error', (err) => {
    console.log('Download error:', err.message);
  });
}

download(LOGO_URL, OUTPUT, 0);
