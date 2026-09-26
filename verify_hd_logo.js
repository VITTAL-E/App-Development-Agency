const fs = require('fs');
const files = ['index.html','blog.html','services.html'];

files.forEach(f => {
  const c = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');

  // Header checks
  const hi = c.indexOf('<header');
  const hChunk = c.substring(hi, hi + 2000);
  const hHD = hChunk.includes('=s256');
  const hSpace = hChunk.includes('>Apex <span class="text-primary">Labs</span>');
  const hContain = hChunk.includes('object-contain');
  const hRounded = hChunk.includes('rounded-xl');

  // Footer checks
  const fi = c.indexOf('<footer');
  const fChunk = c.substring(fi, fi + 2000);
  const fHD = fChunk.includes('=s256');
  const fSpace = fChunk.includes('Apex <span class="text-primary">Labs</span>');
  const fContain = fChunk.includes('object-contain');

  const ok = hHD && hSpace && hContain && fHD && fSpace && fContain;
  console.log(f + ': HD=' + (hHD?'✓':'✗') + '/' + (fHD?'✓':'✗') + 
    ' Space=' + (hSpace?'✓':'✗') + '/' + (fSpace?'✓':'✗') + 
    ' Contain=' + (hContain?'✓':'✗') + '/' + (fContain?'✓':'✗') + 
    ' Rounded=' + (hRounded?'✓':'✗') +
    (ok ? ' ✅' : ' ⚠️'));
});
