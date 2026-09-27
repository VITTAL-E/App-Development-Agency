const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html') && f !== 'contact_raw.html');
let changedCount = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/(<button aria-label="Toggle color mode" class=")w-9 h-9/g, '$1w-8 h-8');
    newContent = newContent.replace(/(<button aria-label="Toggle RTL mode" class=")w-9 h-9/g, '$1w-8 h-8');
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        changedCount++;
        console.log('Updated ' + file);
    }
});
console.log('Total updated: ' + changedCount);
