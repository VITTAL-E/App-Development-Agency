const fs = require('fs');
const files = ['index.html','contact.html','portfolio.html','services.html','blog.html','pricing.html','process.html','home-2.html'];
let allOk = true;
files.forEach(f => {
  const content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
  const fi = content.toLowerCase().indexOf('<footer');
  if (fi === -1) { console.log(f + ': NO FOOTER'); allOk = false; return; }
  const chunk = content.substring(fi, fi+1000);
  const hasLink = chunk.indexOf('href="index.html"') !== -1;
  console.log(f + ': footer logo link = ' + (hasLink ? 'OK' : 'MISSING'));
  if (!hasLink) allOk = false;
});
console.log(allOk ? '\nAll pages OK!' : '\nSome pages need fixing!');
