const fs = require('fs');

// Looking at the screenshot - the dot appears to be inside the logo image itself
// The image URL contains the full "A logo with a dot separator" visual
// Solution: The dot is rendered as part of the image crop - the image shows more than just the A icon
// We need to check the image dimensions vs the container

// Let's look at the actual img tag in the header
const content = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/index.html', 'utf8');
const hi = content.indexOf('<header');
const headerChunk = content.substring(hi, hi + 3000);

// Find all img tags in header
const imgMatches = [...headerChunk.matchAll(/<img[^>]+>/g)];
imgMatches.forEach((m, i) => {
  console.log('Header img ' + i + ':');
  console.log('  ' + m[0]);
  console.log('');
});

// The image is object-cover with object-left and max-w-none
// This means it shows the left portion of a wider image
// The image itself might contain a dot after the A icon
// Fix: use object-contain instead of object-cover, or adjust the width

// Let's also check what class the image wrapper div has
const imgWrapper = headerChunk.match(/<div class="w-8 h-8 overflow-hidden[^"]*">/);
console.log('Image wrapper div:', imgWrapper ? imgWrapper[0] : 'not found');
