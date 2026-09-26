const fs = require('fs');

// Check the header logo area for any dot/bullet characters
const content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/index.html', 'utf8');
const hi = content.indexOf('<header');
const headerChunk = content.substring(hi, hi + 3000);

// Find the logo anchor
const logoStart = headerChunk.indexOf('<a class="group flex items-center gap-space-sm');
const logoEnd = headerChunk.indexOf('</a>', logoStart) + 4;
const logoBlock = headerChunk.substring(logoStart, logoEnd);

console.log('Logo block (hex):');
for (let i = 0; i < logoBlock.length; i++) {
  const code = logoBlock.charCodeAt(i);
  if (code > 127) {
    console.log('  Non-ASCII at pos', i, ': char="' + logoBlock[i] + '" code=0x' + code.toString(16));
  }
}

console.log('\nLogo block text:');
console.log(logoBlock);

// Also check footer logo
const footerIdx = content.indexOf('<footer');
const footerChunk = content.substring(footerIdx, footerIdx + 1000);
const footerLogoStart = footerChunk.indexOf('<a href="index.html"');
const footerLogoEnd = footerChunk.indexOf('</a>', footerLogoStart) + 4;
const footerLogoBlock = footerChunk.substring(footerLogoStart, footerLogoEnd);

console.log('\nFooter logo block:');
console.log(footerLogoBlock);
for (let i = 0; i < footerLogoBlock.length; i++) {
  const code = footerLogoBlock.charCodeAt(i);
  if (code > 127) {
    console.log('  Non-ASCII at pos', i, ': char="' + footerLogoBlock[i] + '" code=0x' + code.toString(16));
  }
}
