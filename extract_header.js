const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let headerMatch = html.match(/<header[^>]*>[\s\S]*?<\/header>/);
if (headerMatch) {
    fs.writeFileSync('header.html', headerMatch[0]);
    console.log("Header saved to header.html");
}
