const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.includes('_raw'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find ALL toggle color mode buttons
    const match = content.match(/<button aria-label="Toggle color mode"[\s\S]*?<\/button>/g);
    const matchRtl = content.match(/<button aria-label="Toggle RTL mode"[\s\S]*?<\/button>/g);
    if (match || matchRtl) {
        console.log(`\n--- ${file} ---`);
        console.log("Color mode instances:", match ? match.length : 0);
        if (match) {
            match.forEach(m => console.log("  " + m));
        }
        console.log("RTL mode instances:", matchRtl ? matchRtl.length : 0);
        if (matchRtl) {
            matchRtl.forEach(m => console.log("  " + m));
        }
    }
});
