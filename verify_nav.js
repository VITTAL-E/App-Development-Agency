const fs = require('fs');

['services.html', 'index.html', 'portfolio.html'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hi = content.indexOf('<header');
  const navStart = content.indexOf('<nav class="hidden xl:flex', hi);
  const navEnd = content.indexOf('</nav>', navStart) + 6;
  const nav = content.substring(navStart, navEnd);
  
  // Check key things
  const hasServicesActive = nav.includes('Services') && nav.includes('text-primary font-semibold');
  const dropdownBgOpaque = nav.includes('bg-surface-container border');
  const noGapInDropdown = nav.includes('group-hover:block');
  
  console.log('\n' + file + ':');
  console.log('  Services shown as active:', hasServicesActive);
  console.log('  Dropdown bg opaque:', dropdownBgOpaque);
  console.log('  No gap dropdown (block not flex):', noGapInDropdown);
  console.log('  Nav length:', nav.length);
});
