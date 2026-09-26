const fs = require('fs');
const content = fs.readFileSync('services.html', 'utf8');
const hi = content.indexOf('<header');
const navStart = content.indexOf('<nav class="hidden xl:flex', hi);
const navEnd = content.indexOf('</nav>', navStart) + 6;
const nav = content.substring(navStart, navEnd);
// Pretty-print by adding newlines before tags
const pretty = nav.replace(/></g, '>\n<').replace(/\n\n+/g, '\n');
console.log(pretty.substring(0, 3000));
