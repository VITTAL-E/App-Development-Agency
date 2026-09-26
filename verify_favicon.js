const fs = require('fs');
const files = ['index.html','home-2.html','contact.html','portfolio.html','services.html','pricing.html','process.html','blog.html'];
let all = true;
files.forEach(f => {
  const c = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
  const hasPng = c.includes('href="favicon.png" type="image/png"');
  const hasApple = c.includes('rel="apple-touch-icon" href="favicon.png"');
  console.log(f + ': favicon.png=' + (hasPng?'✓':'✗') + ' apple-touch=' + (hasApple?'✓':'✗'));
  if (!hasPng) all = false;
});
const pngExists = fs.existsSync('C:/Users/ADMIN/Desktop/h_app/favicon.png');
console.log('\nfavicon.png file exists:', pngExists ? '✓' : '✗');
console.log(all && pngExists ? '\n✅ All pages updated!' : '\n⚠️  Issues found');
