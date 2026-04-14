const fs = require('fs');
const path = require('path');

const componentsDir = 'legacy/components';
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.jsx'));

let corruptedFiles = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(componentsDir, f), 'utf8');
  // Look for mojibake patterns (UTF-8 interpreted as Windows-1252)
  if (/Ð¡|Ð"Ð¾|ÐŸÑ€|ÐžÑ€|Ñ‚Ñƒ|Ð´Ð¸|Ñ€Ðµ|Ð½Ð°|Ñ‡Ð|Ð¼Ð¾|Ð³Ð»|Ð¿Ñ€|Ñ„Ð¾|Ð¾Ð±|Ð¿Ð¾|Ð½Ð°|Ð±Ñ€|Ð´Ð¾|Ñ€Ðµ|Ð¿Ñ€|Ñ‚Ðµ|ÑÐµ|ÑÑ‚|Ð²Ðµ|ÐºÐµ|Ð»Ð¾|Ð¼Ð°|Ð·Ð°|Ð½Ð¾|Ð¿Ð¾|Ñ€Ð°|ÑÑ‚|ÑƒÑ€|ÑˆÐ°|Ñ‡Ñ‚/.test(content)) {
    corruptedFiles.push(f);
  }
});

console.log(`Checked ${files.length} files`);
console.log(`Found ${corruptedFiles.length} corrupted files:`);
corruptedFiles.forEach(f => console.log('  -', f));
