const fs = require('fs');
const filePath = 'c:/Users/igors/Desktop/rivaldesign-app-main/legacy/AppLegacy.jsx';
let lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Find the broken region: quiz data injected into T.en
// Line 583 (0-indexed: 582) ends with: orderAll: "Order all"...
// Line 584 (0-indexed: 583) starts with: { q: "Кернинг
// We need to find where T.ua assignment is (which closes the block)

let brokenStart = -1;
let brokenEnd = -1;

for (let i = 0; i < lines.length; i++) {
  // Find first quiz object injected inside T.en (no property key, starts with { q:)
  if (brokenStart === -1 && lines[i].match(/^\s*\{\s*q:\s*"/) && i > 500 && i < 700) {
    brokenStart = i;
    console.log('Broken start at line', i + 1, ':', lines[i].substring(0, 60));
  }
  // Find where T.ua starts (signals end of T block)
  if (brokenStart !== -1 && lines[i].includes('T.ua = {')) {
    // The broken end is just before T.ua
    brokenEnd = i - 1;
    while (brokenEnd > brokenStart && lines[brokenEnd].trim() === '') brokenEnd--;
    console.log('Broken end at line', brokenEnd + 1, ':', lines[brokenEnd].substring(0, 60));
    break;
  }
}

if (brokenStart === -1) {
  console.log('ERROR: Could not find broken region');
  process.exit(1);
}

// The lines we keep from T.en before the break:
// Find what's JUST before brokenStart - should be T.en properties ending with toTelegram
// We need to insert the missing T.en closing lines

const insertLines = [
    '    copied: "Copied!", filterAll: "All", popular: "Popular",',
    '    zoomHint: "Tap to view", reviewSearch: "Search reviews...", allRatings: "All",',
    '    coursesTitle: "Courses & Learning", courseSub: "Level up your design skills",',
    '    courseStart: "Start Learning", courseFree: "Free", courseLessons: "lessons",',
    '    courseProgress: "Progress", courseTopics: "Course Program",',
    '    quizTitle: "Design Quiz", quizScore: "Score", quizCorrect: "Correct! \u2713",',
    '    quizWrong: "Wrong \u2717", quizResult: "Result",',
    '    streakTitle: "Day Streak", xpTitle: "Experience", levelTitle: "Level",',
    '    promoPlaceholder: "Promo code...", promoApply: "Apply",',
    '    promoSuccess: "Promo applied!", promoError: "Invalid code",',
    '    calcTitle: "Calculator", calcComplex: "Complexity", calcUrgent: "Urgency", calcTotal: "Total",',
    '    sortPop: "Popular", sortNew: "Newest", sortAlpha: "A\u2013Z",',
    '    achievements: "Achievements", achieveNew: "New Achievement!",',
    '    viewsLabel: "views", studentsLabel: "students",',
    '    onlineStatus: "ONLINE \u00b7 READY FOR ORDERS",',
    '    orderConfirm: "Order sent!", addedToWishlist: "Added to wishlist",',
    '    removedFromWishlist: "Removed from wishlist",',
    '    deliveryTime: "Time: ", includes: "Includes:",',
    '    packageDeal: "Best deal", savePercent: "savings",',
    '  },',
    '};',
];

// Remove broken lines, insert correct closing
const newLines = [
  ...lines.slice(0, brokenStart),
  ...insertLines,
  '',
  ...lines.slice(brokenEnd + 1)
];

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log('Fixed! Lines:', newLines.length, 'vs before:', lines.length);
console.log('Removed', brokenEnd - brokenStart + 1, 'broken lines, inserted', insertLines.length, 'clean lines');
