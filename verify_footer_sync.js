const fs = require('fs');
const files = ['index.html','home-2.html','contact.html','portfolio.html','services.html','pricing.html','process.html','blog.html'];

// Get canonical footer hash from blog.html
const blogContent = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/blog.html', 'utf8');
const bs = blogContent.indexOf('<footer');
const be = blogContent.indexOf('</footer>', bs) + 9;
const canonicalFooter = blogContent.substring(bs, be);

let allMatch = true;
files.forEach(f => {
  const content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
  const s = content.indexOf('<footer');
  const e = content.indexOf('</footer>', s) + 9;
  if (s === -1) { console.log(f + ': NO FOOTER'); allMatch = false; return; }
  const footer = content.substring(s, e);
  const match = footer === canonicalFooter;
  const hasHomeLink = footer.includes('href="index.html"');
  const hasSOC2 = footer.includes('SOC2 Type II');
  const hasSocials = footer.includes('ApexLabs GitHub');
  console.log(f + ': match=' + (match ? '✓' : '✗') + ' homeLink=' + hasHomeLink + ' SOC2=' + hasSOC2 + ' socials=' + hasSocials);
  if (!match) allMatch = false;
});
console.log('\n' + (allMatch ? '✅ All footers are identical!' : '⚠️  Some footers differ'));
