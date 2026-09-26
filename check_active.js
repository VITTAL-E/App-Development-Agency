const fs = require('fs');

const files = [
  { file: 'index.html',    expected: 'Home' },
  { file: 'services.html', expected: 'Services' },
  { file: 'portfolio.html',expected: 'Portfolio' },
  { file: 'contact.html',  expected: 'Contact' },
];

files.forEach(({ file, expected }) => {
  const content = fs.readFileSync(file, 'utf8');
  const hi = content.indexOf('<header');
  const navStart = content.indexOf('<nav class="hidden xl:flex', hi);
  const navEnd = content.indexOf('</nav>', navStart) + 6;
  const nav = content.substring(navStart, navEnd);

  // Find all active links (contain text-primary font-semibold)
  const activeLinks = [];
  const linkRegex = /href="([^"]+)"[^>]*class="[^"]*text-primary font-semibold[^"]*"|class="[^"]*text-primary font-semibold[^"]*"[^>]*href="([^"]+)"/g;
  let m;
  while ((m = linkRegex.exec(nav)) !== null) {
    activeLinks.push(m[1] || m[2]);
  }
  
  // Also check the Home button active state
  const homeBtn = nav.match(/button[^>]*class="([^"]*text-primary font-semibold[^"]*)"[^>]*aria-haspopup/);
  const homeIsActive = homeBtn !== null;
  
  console.log(file + ' (expected active: ' + expected + ')');
  console.log('  Home button active:', homeIsActive);
  console.log('  Active link hrefs:', activeLinks.join(', ') || 'none');
  console.log('');
});
