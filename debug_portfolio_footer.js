const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/portfolio.html', 'utf8');

const footerIdx = content.toLowerCase().indexOf('<footer');
if (footerIdx === -1) {
  console.log('No footer tag found');
  process.exit();
}

const footerStr = content.substring(footerIdx, footerIdx + 3000);
console.log('Footer start (3000 chars):');
console.log(footerStr);
