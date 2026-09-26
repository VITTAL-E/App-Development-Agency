const fs = require('fs');

// Fix portfolio.html footer - it uses spans instead of img
let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/portfolio.html', 'utf8');

const footerIdx = content.toLowerCase().indexOf('<footer');
if (footerIdx === -1) {
  console.log('No footer tag found');
  process.exit();
}

// The pattern in portfolio.html footer:
// <div class="flex items-center gap-space-sm"><span class="font-headline-md text-title-sm text-on-surface tracking-tight font-bold">Apex<span class="text-primary">Labs</span></span><span class="px-space-xs ...">SYSTEM V4.2</span></div>

// We need to find this block in the footer and wrap it in an anchor
const footerStr = content.substring(footerIdx);

// Find the "flex items-center gap-space-sm" div that contains the Apex brand
// In portfolio.html, it has "Apex<span class="text-primary">Labs</span>"
const searchStr = '<div class="flex items-center gap-space-sm"><span class="font-headline-md';
const brandIdx = footerStr.indexOf(searchStr);

if (brandIdx === -1) {
  console.log('Cannot find brand div pattern');
  // Try alternate
  const altSearch = 'font-headline-md text-title-sm text-on-surface tracking-tight font-bold';
  const altIdx = footerStr.indexOf(altSearch);
  if (altIdx !== -1) {
    console.log('Found at altSearch index:', altIdx);
    console.log('Context:', footerStr.substring(altIdx - 50, altIdx + 300));
  }
  process.exit();
}

console.log('Found brand at index:', brandIdx);

// Find the end of this div block
const logoArea = footerStr.substring(brandIdx);
let depth = 0;
let endIdx = -1;
for (let i = 0; i < logoArea.length; i++) {
  if (logoArea.substring(i).startsWith('<div')) {
    depth++;
  } else if (logoArea.substring(i).startsWith('</div>')) {
    depth--;
    if (depth === 0) {
      endIdx = i + 6; // length of '</div>'
      break;
    }
  }
}

if (endIdx === -1) {
  console.log('Cannot find end of logo div');
  process.exit();
}

const logoBlock = logoArea.substring(0, endIdx);
console.log('Logo block:', logoBlock.substring(0, 200));

// Check if already wrapped
const beforeBrand = footerStr.substring(0, brandIdx);
const lastAnchor = beforeBrand.lastIndexOf('<a ');
const lastDivClose = beforeBrand.lastIndexOf('</div>');

if (lastAnchor > lastDivClose) {
  console.log('Already wrapped in anchor');
  process.exit();
}

// Wrap the logo block in anchor
const absoluteBrandIdx = footerIdx + brandIdx;
const absoluteEndIdx = footerIdx + brandIdx + endIdx;

const wrappedBlock = `<a href="index.html" class="hover:opacity-80 transition-opacity">${logoBlock}</a>`;

const modified = content.substring(0, absoluteBrandIdx) + wrappedBlock + content.substring(absoluteEndIdx);

fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/portfolio.html', modified, 'utf8');
console.log('portfolio.html: ✓ footer logo wrapped with link to index.html');
