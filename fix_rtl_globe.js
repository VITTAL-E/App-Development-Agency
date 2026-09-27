const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the toggle logic
    const oldLogic = "iconSpan.textContent = dir === 'rtl' ? 'format_textdirection_l_to_r' : 'language';";
    const newLogic = "iconSpan.textContent = 'language';";
    
    if (content.includes(oldLogic)) {
        content = content.replace(new RegExp(oldLogic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newLogic);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
console.log('Done');
