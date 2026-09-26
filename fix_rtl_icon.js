const fs = require('fs');
const path = require('path');
const files = ['index.html','home-2.html','contact.html','portfolio.html','services.html','pricing.html','process.html','blog.html'];

files.forEach(f => {
  try {
    const fullPath = path.join(__dirname, f);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace the specific icon text inside the RTL toggle span
    const modified = content.replace(/format_textdirection_r_to_l/g, 'language');
    
    if (content !== modified) {
        fs.writeFileSync(fullPath, modified, 'utf8');
        console.log('Fixed', f);
    }
  } catch(e) {
    console.error(e);
  }
});
