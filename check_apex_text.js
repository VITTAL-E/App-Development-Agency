const fs = require('fs');
const c = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/index.html', 'utf8');

// Check header logo text
const hi = c.indexOf('<header');
const hChunk = c.substring(hi, hi + 2000);
const hLogoStart = hChunk.indexOf('<a class="group flex items-center gap-space-sm');
const hLogoEnd = hChunk.indexOf('</a>', hLogoStart) + 4;
const hLogo = hChunk.substring(hLogoStart, hLogoEnd);
// Find the span with Apex text
const spanIdx = hLogo.indexOf('>Apex');
console.log('Header around Apex:', JSON.stringify(hLogo.substring(spanIdx, spanIdx + 50)));

// Check footer logo text
const fi = c.indexOf('<footer');
const fChunk = c.substring(fi, fi + 1000);
const fLogoStart = fChunk.indexOf('<a href="index.html"');
const fLogoEnd = fChunk.indexOf('</a>', fLogoStart) + 4;
const fLogo = fChunk.substring(fLogoStart, fLogoEnd);
const fSpanIdx = fLogo.indexOf('>Apex');
console.log('Footer around Apex:', JSON.stringify(fLogo.substring(fSpanIdx, fSpanIdx + 50)));
