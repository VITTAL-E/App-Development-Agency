const fs = require('fs');
const content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/index.html', 'utf8');
const match = content.match(/rel="icon"[^>]*/);
console.log('favicon tag:', match ? match[0] : 'not found');
// Also check apple touch
const apple = content.match(/rel="apple-touch-icon"[^>]*/);
console.log('apple-touch-icon:', apple ? apple[0] : 'not found');
