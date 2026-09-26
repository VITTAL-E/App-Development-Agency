const fs = require('fs');
const files = ['index.html', 'blog.html', 'contact.html'];

files.forEach(f => {
  const c = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');

  // Header logo text
  const hi = c.indexOf('<header');
  const hChunk = c.substring(hi, hi + 2000);
  const hLogoStart = hChunk.indexOf('<a class="group flex items-center gap-space-sm');
  const hLogoEnd = hChunk.indexOf('</a>', hLogoStart) + 4;
  const hLogo = hChunk.substring(hLogoStart, hLogoEnd);
  const hText = hLogo.match(/\>Apex ([^<]*)<span[^>]*>Labs<\/span>/);
  const hImgClass = hLogo.match(/class="([^"]*object[^"]*)"/)

  // Footer logo text
  const fi = c.indexOf('<footer');
  const fChunk = c.substring(fi, fi + 1000);
  const fLogoStart = fChunk.indexOf('<a href="index.html"');
  const fLogoEnd = fChunk.indexOf('</a>', fLogoStart) + 4;
  const fLogo = fChunk.substring(fLogoStart, fLogoEnd);
  const fText = fLogo.match(/\>Apex ([^<]*)<span[^>]*>Labs<\/span>/);

  console.log(f + ':');
  console.log('  Header text: "Apex' + (hText ? hText[1] : '[NO MATCH]') + 'Labs"');
  console.log('  Header img class:', hImgClass ? hImgClass[1] : 'not found');
  console.log('  Footer text: "Apex' + (fText ? fText[1] : '[NO MATCH]') + 'Labs"');
  console.log('  Match:', (hText && fText && hText[1] === fText[1]) ? '✓ SAME' : '✗ DIFFERENT');
  console.log('');
});
