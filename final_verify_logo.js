const fs = require('fs');
const files = ['index.html','home-2.html','contact.html','portfolio.html','services.html','pricing.html','process.html','blog.html'];
let allOk = true;
files.forEach(f => {
  const c = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
  // Check header has "Apex <span" (with space)
  const hi = c.indexOf('<header');
  const hChunk = c.substring(hi, hi + 3000);
  const hHasSpace = hChunk.includes('>Apex <span class="text-primary">Labs</span>');
  const hHasImg = hChunk.includes('h-8 w-8 object-cover object-center');
  // Check footer has "Apex <span" (with space)
  const fi = c.indexOf('<footer');
  const fChunk = c.substring(fi, fi + 3000);
  const fHasSpace = fChunk.includes('Apex <span class="text-primary">Labs</span>');
  const ok = hHasSpace && hHasImg && fHasSpace;
  console.log(f + ': header_space=' + (hHasSpace?'✓':'✗') + ' header_img=' + (hHasImg?'✓':'✗') + ' footer_space=' + (fHasSpace?'✓':'✗') + (ok?' ✅':'  ⚠️'));
  if (!ok) allOk = false;
});
console.log(allOk ? '\n✅ All pages correct!' : '\n⚠️  Issues remain');
