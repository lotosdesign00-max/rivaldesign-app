const fs = require('fs');
const path = 'c:/Users/igors/Desktop/rivaldesign-app-main/legacy/AppLegacy.jsx';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// Find line numbers (0-indexed)
let firstT = -1, secondT = -1;
lines.forEach((l, i) => {
  if (l.includes('const T =') || l.includes('const T={')) {
    if (firstT === -1) firstT = i;
    else secondT = i;
  }
});

console.log('First T at line:', firstT + 1, 'Second T at line:', secondT + 1);

if (secondT === -1) {
  console.log('No second T found, checking by regex...');
  const idx1 = content.indexOf('// ── TRANSLATIONS ──');
  const idx2 = content.indexOf('// ── TRANSLATIONS ──', idx1 + 1);
  console.log('TRANSLATIONS comment position 1:', idx1, 'position 2:', idx2);
  process.exit(0);
}

// Find the end of the second T block - look for 'T.by = ' line after secondT
let endLine = secondT;
for (let i = secondT; i < lines.length; i++) {
  if (lines[i].includes('T.by = ') || lines[i].includes("T.by={")) {
    endLine = i;
    break;
  }
}
console.log('End of second T block at line:', endLine + 1);

// Now find where LevelUpNotification ends after this
let levelUpEnd = -1;
for (let i = endLine; i < Math.min(endLine + 50, lines.length); i++) {
  if (lines[i].trim() === ');') {
    levelUpEnd = i;
    break;
  }
}
console.log('LevelUpNotification end at:', levelUpEnd + 1);

// Remove lines from secondT-2 (the comment before it) to levelUpEnd (inclusive)
const commentLine = secondT >= 2 && lines[secondT - 2].includes('TRANSLATIONS') ? secondT - 3 : secondT - 1;
const deleteStart = commentLine >= 0 ? commentLine : secondT;
const deleteEnd = levelUpEnd >= 0 ? levelUpEnd : endLine;

console.log('Deleting lines', deleteStart + 1, 'to', deleteEnd + 1);

const newLines = [...lines.slice(0, deleteStart), ...lines.slice(deleteEnd + 1)];
fs.writeFileSync(path, newLines.join('\n'), 'utf8');
console.log('Done! New line count:', newLines.length, 'vs old:', lines.length);
