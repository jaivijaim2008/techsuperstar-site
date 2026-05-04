const fs = require('fs');
const path = require('path');

// Simple copy for now - you can use sharp or other image processing later
const source = path.join(__dirname, '../public/favicon.jpg');
const dest = path.join(__dirname, '../public/favicon.ico');

if (fs.existsSync(source)) {
  fs.copyFileSync(source, dest);
  console.log('✅ Favicon generated!');
} else {
  console.log('❌ Source image not found');
}