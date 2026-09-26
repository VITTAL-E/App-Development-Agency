const fs = require('fs');
const files = ['index.html','contact.html','portfolio.html','services.html','blog.html','pricing.html','process.html','home-2.html'];
files.forEach(f => {
  try {
    const content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
    // Find footer section
    const footerIdx = content.toLowerCase().indexOf('<footer');
    if (footerIdx !== -1) {
      const footerChunk = content.substring(footerIdx, footerIdx + 2000);
      // Find logo/brand link  
      const logoIdx = footerChunk.toLowerCase().indexOf('apexlabs');
      if (logoIdx !== -1) {
        // get surrounding href
        const around = footerChunk.substring(Math.max(0, logoIdx-200), logoIdx+200);
        const hrefMatch = around.match(/href="([^"]*)"/);
        console.log(f + ' footer logo href:', hrefMatch ? hrefMatch[1] : 'no href found');
        console.log('  context:', around.replace(/\n/g, ' ').substring(0,300));
      } else {
        console.log(f + ': footer found but no ApexLabs brand in first 2000 chars');
      }
    } else {
      console.log(f + ': NO <footer> tag found');
    }
  } catch(e) {
    console.log(f + ' error:', e.message);
  }
});
