const fs = require('fs');
const file = 'legacy/components/HomeTab.jsx';
let c = fs.readFileSync(file, 'utf8');

// Fix tools descriptions
c = c.replace(
  /body: lang === "en" \? "Key visuals, covers and thumbnails\." : "[^"]+",/,
  'body: lang === "en" ? "Key visuals, covers and thumbnails." : "Кей-визуалы, обложки и превью.",'
);

c = c.replace(
  /body: lang === "en" \? "Motion cues and animated emphasis\." : "[^"]+",/,
  'body: lang === "en" ? "Motion cues and animated emphasis." : "Моушн-акценты и анимированная подача.",'
);

c = c.replace(
  /body: lang === "en" \? "Depth, lighting and 3D form\." : "[^"]+",/,
  'body: lang === "en" ? "Depth, lighting and 3D form." : "Глубина, свет и 3D-форма.",'
);

// Fix Telegram message
c = c.replace(
  /openTg\("Rivaldsg", lang === "en" \? "Hi, I want to start a project\." : "[^"]+"\)/,
  'openTg("Rivaldsg", lang === "en" ? "Hi, I want to start a project." : "Привет, хочу начать проект.")'
);

fs.writeFileSync(file, c, 'utf8');
console.log('Fixed all encoding issues!');
