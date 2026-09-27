const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/ADMIN/Desktop/h_app';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace breakpoint xl to lg for navbar
  content = content.replace(/hidden xl:flex/g, 'hidden lg:flex');
  content = content.replace(/xl:hidden/g, 'lg:hidden');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
