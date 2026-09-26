const fs = require('fs');

// The dot might be part of the img src visual — maybe the image has a dot rendered in it
// OR it could be that the glow div is creating a visual artifact
// Let me look at what's BETWEEN the </div> (image wrapper) and <span (text)
// in the logo block

const files = ['index.html', 'blog.html'];
files.forEach(f => {
  const content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/' + f, 'utf8');
  const hi = content.indexOf('<header');
  const headerChunk = content.substring(hi, hi + 3000);

  // Find the logo anchor
  const logoStart = headerChunk.indexOf('<a class="group flex items-center');
  const logoEnd = headerChunk.indexOf('</a>', logoStart) + 4;
  const logoBlock = headerChunk.substring(logoStart, logoEnd);

  // Find what's between the closing div of the image wrapper and the opening span
  const imgWrapperEnd = logoBlock.lastIndexOf('</div>');
  const spanStart = logoBlock.indexOf('<span', imgWrapperEnd);
  const between = logoBlock.substring(imgWrapperEnd + 6, spanStart);

  console.log(f + ' - between img wrapper and span:');
  console.log('  repr: "' + between + '"');
  console.log('  bytes:', Buffer.from(between).toString('hex'));
  console.log('  trimmed: "' + between.trim() + '"');
  console.log('');
});
