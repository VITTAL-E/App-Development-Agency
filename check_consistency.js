const fs = require('fs');
const files = ['index.html','blog.html','services.html','contact.html','portfolio.html','pricing.html','process.html','home-2.html'];
let allOk = true;

files.forEach(f => {
  const c = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
  
  // Header: find "Apex" near <header>
  const hi = c.indexOf('<header');
  const hChunk = c.substring(hi, hi + 2500);
  const hApex = hChunk.indexOf('>Apex ');
  const hSpace = hApex !== -1;
  const hGap3 = hChunk.includes('gap-3');
  
  // Footer: find "Apex" near <footer>
  const fi = c.indexOf('<footer');
  const fChunk = c.substring(fi, fi + 2500);
  const fApex = fChunk.indexOf('Apex ');
  const fSpace = fApex !== -1 && fChunk.charAt(fApex + 5) === '<';
  const fGap3 = fChunk.includes('gap-3');
  
  const ok = hSpace && fSpace && hGap3 && fGap3;
  console.log(f + ': h_space=' + (hSpace?'✓':'✗') + ' h_gap3=' + (hGap3?'✓':'✗') + ' f_space=' + (fSpace?'✓':'✗') + ' f_gap3=' + (fGap3?'✓':'✗') + (ok?' ✅':' ⚠️'));
  if (!ok) allOk = false;
});

console.log(allOk ? '\n✅ All consistent!' : '\n⚠️ Some issues found');
