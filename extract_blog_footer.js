const fs = require('fs');

// Extract and print the full footer from blog.html
const content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/blog.html', 'utf8');
const footerIdx = content.indexOf('<footer');
if (footerIdx === -1) { console.log('No footer found'); process.exit(); }

// Find closing </footer>
const footerEnd = content.indexOf('</footer>', footerIdx);
if (footerEnd === -1) { console.log('No closing footer found'); process.exit(); }

const footer = content.substring(footerIdx, footerEnd + 9);
console.log('Footer length:', footer.length);
console.log('--- FOOTER START ---');
console.log(footer);
console.log('--- FOOTER END ---');
