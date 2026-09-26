const fs = require('fs');

const files = ['index.html','contact.html','portfolio.html','services.html','blog.html','pricing.html','process.html','home-2.html'];

files.forEach(f => {
  try {
    let content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
    
    // Find the footer section
    const footerIdx = content.toLowerCase().indexOf('<footer');
    if (footerIdx === -1) {
      console.log(f + ': no footer tag, skipping');
      return;
    }

    // Strategy: find the footer logo div and wrap it in an anchor tag
    // The pattern is: <div class="flex items-center gap-space-sm">...<img alt="ApexLabs...">...<span ...>ApexLabs</span>
    // We need to wrap this in <a href="index.html">

    const footerContent = content.substring(footerIdx);
    
    // Pattern 1: Logo with img + span "ApexLabs" text (no wrapping anchor)
    // Find the brand block and add href
    // Look for the logo image or ApexLabs text in the footer
    
    // We'll look for specific patterns and replace them:
    
    // Pattern: <div class="flex items-center gap-space-sm"><div class="w-8 h-8 ... rounded-lg"><img alt="ApexLabs...
    // OR: <div class="flex items-center gap-space-sm"><div class="w-7 h-7 ...
    
    // We need to find where the logo starts and ends (logo img + text span)
    // Then wrap that section with <a href="index.html">
    
    // Let's find the logo block in the footer more precisely
    // Check if it's already wrapped in an anchor
    
    let modified = content;
    let changed = false;
    
    // Find the footer index in the full content
    const ftIdx = content.toLowerCase().indexOf('<footer');
    
    // Get the substring from footer start
    let footerStr = content.substring(ftIdx);
    
    // Find the ApexLabs logo area in footer
    let logoIdx = footerStr.search(/ApexLabs Mobile Studio Logo|ApexLabs logo/i);
    if (logoIdx === -1) {
      // Try finding "ApexLabs" text
      logoIdx = footerStr.indexOf('>ApexLabs<');
      if (logoIdx === -1) {
        console.log(f + ': cannot find logo in footer');
        return;
      }
    }
    
    // Find the start of the containing div (the logo wrapper div)
    // Go backwards from logoIdx to find the opening <div class="flex items-center gap-space-sm"
    const beforeLogo = footerStr.substring(0, logoIdx);
    const flexDivIdx = beforeLogo.lastIndexOf('<div class="flex items-center gap-space-sm"');
    
    if (flexDivIdx === -1) {
      console.log(f + ': cannot find flex div wrapper for logo');
      return;
    }
    
    // Check if there's already an anchor tag wrapping this
    const beforeFlex = beforeLogo.substring(0, flexDivIdx);
    const lastAnchorIdx = beforeFlex.lastIndexOf('<a ');
    const lastDivCloseIdx = beforeFlex.lastIndexOf('</div>');
    
    // If the most recent tag before this div is an <a> tag (and not closed by a div), it's already wrapped
    if (lastAnchorIdx > lastDivCloseIdx) {
      console.log(f + ': logo already wrapped in anchor, skipping');
      return;
    }
    
    // Now find the end of this logo block. 
    // The logo block consists of: the img div + the span with ApexLabs name
    // We need to find the closing </div> after the span
    
    // Find the full logo area: from <div class="flex items-center gap-space-sm"> to end of that div block
    // This div contains: icon div + span
    // Count nested divs
    
    const logoArea = footerStr.substring(flexDivIdx);
    
    // Find the end of the first-level div (flex items-center gap-space-sm)
    let depth = 0;
    let endIdx = -1;
    for (let i = 0; i < logoArea.length; i++) {
      if (logoArea.substring(i).startsWith('<div')) {
        depth++;
      } else if (logoArea.substring(i).startsWith('</div>')) {
        depth--;
        if (depth === 0) {
          endIdx = i + 6; // length of '</div>'
          break;
        }
      }
    }
    
    if (endIdx === -1) {
      console.log(f + ': cannot find end of logo div');
      return;
    }
    
    // The logo block
    const logoBlock = logoArea.substring(0, endIdx);
    
    // Wrap it in an anchor
    const wrappedLogo = `<a href="index.html" class="flex items-center gap-space-sm hover:opacity-80 transition-opacity">${logoBlock.replace('<div class="flex items-center gap-space-sm">', '<div class="flex items-center gap-space-sm">')}</a>`;
    
    // Actually, let's just wrap the whole flex div in the anchor
    // Replace: <div class="flex items-center gap-space-sm">...(logo content)...</div>
    // With: <a href="index.html" ...><div class="flex items-center gap-space-sm">...(logo content)...</div></a>
    
    // But we need to be precise - only the FIRST occurrence in the footer
    const absoluteFlexIdx = ftIdx + flexDivIdx;
    const absoluteEndIdx = ftIdx + flexDivIdx + endIdx;
    
    const logoBlockInFull = content.substring(absoluteFlexIdx, absoluteEndIdx);
    
    const wrappedBlock = `<a href="index.html" class="hover:opacity-80 transition-opacity">${logoBlockInFull}</a>`;
    
    modified = content.substring(0, absoluteFlexIdx) + wrappedBlock + content.substring(absoluteEndIdx);
    
    fs.writeFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, modified, 'utf8');
    console.log(f + ': ✓ footer logo wrapped with link to index.html');
    changed = true;
    
  } catch(e) {
    console.log(f + ' error:', e.message, e.stack);
  }
});

console.log('\nDone!');
