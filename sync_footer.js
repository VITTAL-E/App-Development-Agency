const fs = require('fs');

// Read the canonical footer from blog.html
const blogContent = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/blog.html', 'utf8');
const blogFooterStart = blogContent.indexOf('<footer');
const blogFooterEnd = blogContent.indexOf('</footer>', blogFooterStart) + 9;
const CANONICAL_FOOTER = blogContent.substring(blogFooterStart, blogFooterEnd);

console.log('Canonical footer length:', CANONICAL_FOOTER.length);

// Pages to update (all except blog.html itself)
const files = [
  'index.html',
  'home-2.html',
  'contact.html',
  'portfolio.html',
  'services.html',
  'pricing.html',
  'process.html',
];

files.forEach(f => {
  try {
    let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');

    // Find the existing footer
    const footerStart = content.indexOf('<footer');
    if (footerStart === -1) {
      // No footer tag — try to insert before </body>
      const bodyClose = content.lastIndexOf('</body>');
      if (bodyClose === -1) { console.log(f + ': no footer and no </body>, skipping'); return; }
      const modified = content.substring(0, bodyClose) + CANONICAL_FOOTER + '\n' + content.substring(bodyClose);
      fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, modified, 'utf8');
      console.log(f + ': ✓ footer injected before </body>');
      return;
    }

    const footerEnd = content.indexOf('</footer>', footerStart);
    if (footerEnd === -1) { console.log(f + ': found <footer> but no </footer>, skipping'); return; }
    const footerEndFull = footerEnd + 9; // include </footer>

    // Replace the entire footer
    const modified = content.substring(0, footerStart) + CANONICAL_FOOTER + content.substring(footerEndFull);
    fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, modified, 'utf8');
    console.log(f + ': ✓ footer replaced with blog.html canonical footer');

  } catch(e) {
    console.log(f + ' ERROR:', e.message);
  }
});

console.log('\nAll done!');
