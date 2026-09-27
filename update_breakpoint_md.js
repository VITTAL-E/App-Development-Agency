const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/ADMIN/Desktop/h_app';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace breakpoint lg to md for navbar and mobile menu
  content = content.replace(/hidden lg:flex/g, 'hidden md:flex');
  content = content.replace(/lg:hidden/g, 'md:hidden');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
