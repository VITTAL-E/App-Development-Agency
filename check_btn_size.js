const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('_raw'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find the toggle color mode button
    const match = content.match(/<button aria-label="Toggle color mode"[\s\S]*?<\/button>/);
    const matchRtl = content.match(/<button aria-label="Toggle RTL mode"[\s\S]*?<\/button>/);
    if (match) {
        console.log(`\n--- ${file} ---`);
        console.log("Color mode:", match[0]);
        console.log("RTL mode:", matchRtl ? matchRtl[0] : 'None');
    }
});
