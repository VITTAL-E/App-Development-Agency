const fs = require('fs');
const c = fs.readFileSync('C:/Users/ADMIN/Desktop/h_app/index.html', 'utf8');

// Check footer specifically
const fi = c.indexOf('<footer');
const fChunk = c.substring(fi, fi + 2000);

// Find Apex in footer
const apexIdx = fChunk.indexOf('Apex');
if (apexIdx !== -1) {
  console.log('Footer around Apex:', JSON.stringify(fChunk.substring(apexIdx - 5, apexIdx + 60)));
} else {
  console.log('Apex not found in first 2000 chars of footer');
}

// Also search for "Labs" span
const labsIdx = fChunk.indexOf('>Labs<');
if (labsIdx !== -1) {
  console.log('Footer around Labs:', JSON.stringify(fChunk.substring(labsIdx - 30, labsIdx + 20)));
}
