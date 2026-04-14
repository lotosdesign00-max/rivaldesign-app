const fs = require('fs');
const filePath = 'c:/Users/igors/Desktop/rivaldesign-app-main/legacy/AppLegacy.jsx';
let content = fs.readFileSync(filePath, 'utf8');

console.log('File size before:', content.length, 'chars');
console.log('Lines before:', content.split('\n').length);

// The problem: the T.en object is broken - from line ~583 onwards it has quiz data injected
// Strategy: find T = { ... }; block and reconstruct it properly

// Find the start of the T object
const tStart = content.indexOf('// ── TRANSLATIONS ──');
const tObjStart = content.indexOf('const T = {', tStart);

// Find end of T block - look for T.ua assignment which comes right after T};
const tUaLine = 'T.ua = { ...T.ru';
const tUaIdx = content.indexOf(tUaLine, tObjStart);
const tByLine = 'T.by = { ...T.ru';
const tByEnd = content.indexOf(tByLine, tUaIdx);
const tByLineEnd = content.indexOf('\n', tByEnd) + 1;

console.log('T block: from char', tObjStart, 'to', tByLineEnd);

// This is the clean T block we want
const cleanT = `const T = {
  ru: {
    appName: "Rival Space", homeHero: "Создаю визуалы мирового уровня",
    homeSub: "Аватарки · Превью · Баннеры · Логотипы",
    stats: [{ v: "50+", l: "Проектов" }, { v: "19+", l: "Клиентов" }, { v: "1+", l: "Год опыта" }, { v: "5★", l: "Рейтинг" }],
    navHome: "Главная", navGallery: "Галерея", navAI: "AI", navCourses: "Курсы", navPricing: "Прайс", navFreePack: "Пак", navMore: "Ещё", navProfile: "Профиль",
    galleryTitle: "Портфолио", gallerySearch: "Поиск...",
    reviewsTitle: "Отзывы", pricingTitle: "Прайс-лист",
    cartTitle: "Корзина", addCart: "В корзину", clearCart: "Очистить",
    orderBtn: "Заказать", discount: "Скидка 10%", finalPrice: "Итого",
    aboutTitle: "Обо мне",
    aboutText: "Я Rival — графический дизайнер с опытом более года.\\n\\nСпециализируюсь на создании визуальной идентичности для контент-мейкеров, стримеров и брендов.\\n\\nКаждая работа — это уникальный проект, созданный под твои цели и аудиторию.",
    faqTitle: "FAQ", aiTitle: "AI Studio", aiSub: "Генератор уникальных идей для дизайна",
    aiBtn: "✨ Генерировать идею", aiLoading: "AI думает...", aiEmpty: "Нажми кнопку для первой идеи",
    aiHist: "История идей", settingsTitle: "Настройки", settingsTheme: "Тема",
    settingsLang: "Язык", settingsSound: "Звук", settingsVol: "Громкость",
    pricingHint: "Цены в {cur} · 1$ = {rate} {cur}", discountNote: "🎁 Скидка 10% при заказе 2+ позиций",
    orderAll: "Заказать всё", quantityLabel: "шт", toTelegram: "Написать в Telegram",
    copied: "Скопировано!", filterAll: "Все", popular: "Популярное",
    zoomHint: "Нажми для просмотра", reviewSearch: "Поиск по отзывам...", allRatings: "Все",
    coursesTitle: "Курсы и обучение", courseSub: "Прокачай навыки дизайна",
    courseStart: "Начать обучение", courseFree: "Бесплатно", courseLessons: "уроков",
    courseProgress: "Прогресс", courseTopics: "Программа курса",
    quizTitle: "Дизайн-викторина", quizScore: "Счёт", quizCorrect: "Правильно! ✓",
    quizWrong: "Неверно ✗", quizResult: "Результат",
    streakTitle: "Дней подряд", xpTitle: "Опыт", levelTitle: "Уровень",
    promoPlaceholder: "Промокод...", promoApply: "Применить",
    promoSuccess: "Промокод применён!", promoError: "Неверный промокод",
    calcTitle: "Калькулятор", calcComplex: "Сложность", calcUrgent: "Срочность", calcTotal: "Итого",
    sortPop: "Популярные", sortNew: "Новые", sortAlpha: "А–Я",
    achievements: "Достижения", achieveNew: "Новое достижение!",
    viewsLabel: "просмотров", studentsLabel: "студентов",
    onlineStatus: "ОНЛАЙН · ГОТОВ К ЗАКАЗАМ",
    orderConfirm: "Заказ отправлен!", addedToWishlist: "Добавлено в избранное",
    removedFromWishlist: "Удалено из избранного",
    deliveryTime: "Срок: ", includes: "Включено:",
    packageDeal: "Выгодный пакет", savePercent: "экономия",
  },
  en: {
    appName: "Rival Space", homeHero: "Creating world-class visuals",
    homeSub: "Avatars · Previews · Banners · Logos",
    stats: [{ v: "50+", l: "Projects" }, { v: "19+", l: "Clients" }, { v: "1+", l: "Yr exp." }, { v: "5★", l: "Rating" }],
    navHome: "Home", navGallery: "Gallery", navAI: "AI", navCourses: "Courses", navPricing: "Pricing", navFreePack: "Pack", navMore: "More", navProfile: "Profile",
    galleryTitle: "Portfolio", gallerySearch: "Search...",
    reviewsTitle: "Reviews", pricingTitle: "Pricing",
    cartTitle: "Cart", addCart: "Add", clearCart: "Clear",
    orderBtn: "Order", discount: "10% off", finalPrice: "Total",
    aboutTitle: "About Me",
    aboutText: "I'm Rival — a graphic designer with over a year of experience.\\n\\nI specialize in creating visual identity for content creators, streamers, and brands.\\n\\nEvery project is unique and crafted for your goals and audience.",
    faqTitle: "FAQ", aiTitle: "AI Studio", aiSub: "Unique design idea generator",
    aiBtn: "✨ Generate Idea", aiLoading: "AI thinking...", aiEmpty: "Press the button for your first idea",
    aiHist: "Idea History", settingsTitle: "Settings", settingsTheme: "Theme",
    settingsLang: "Language", settingsSound: "Sound", settingsVol: "Volume",
    pricingHint: "Prices in {cur} · $1 = {rate} {cur}", discountNote: "🎁 10% off for 2+ items",
    orderAll: "Order all", quantityLabel: "qty", toTelegram: "Write on Telegram",
    copied: "Copied!", filterAll: "All", popular: "Popular",
    zoomHint: "Tap to view", reviewSearch: "Search reviews...", allRatings: "All",
    coursesTitle: "Courses & Learning", courseSub: "Level up your design skills",
    courseStart: "Start Learning", courseFree: "Free", courseLessons: "lessons",
    courseProgress: "Progress", courseTopics: "Course Program",
    quizTitle: "Design Quiz", quizScore: "Score", quizCorrect: "Correct! ✓",
    quizWrong: "Wrong ✗", quizResult: "Result",
    streakTitle: "Day Streak", xpTitle: "Experience", levelTitle: "Level",
    promoPlaceholder: "Promo code...", promoApply: "Apply",
    promoSuccess: "Promo applied!", promoError: "Invalid code",
    calcTitle: "Calculator", calcComplex: "Complexity", calcUrgent: "Urgency", calcTotal: "Total",
    sortPop: "Popular", sortNew: "Newest", sortAlpha: "A–Z",
    achievements: "Achievements", achieveNew: "New Achievement!",
    viewsLabel: "views", studentsLabel: "students",
    onlineStatus: "ONLINE · READY FOR ORDERS",
    orderConfirm: "Order sent!", addedToWishlist: "Added to wishlist",
    removedFromWishlist: "Removed from wishlist",
    deliveryTime: "Time: ", includes: "Includes:",
    packageDeal: "Best deal", savePercent: "savings",
  },
};
T.ua = { ...T.ru, appName: "Rival Space", homeHero: "Створюю візуали світового рівня", navHome: "Головна", navGallery: "Галерея", navAI: "AI", navCourses: "Курси", navPricing: "Прайс", navMore: "Ще", galleryTitle: "Портфоліо", addCart: "У кошик", orderBtn: "Замовити", coursesTitle: "Курси", toTelegram: "Telegram" };
T.kz = { ...T.ru, appName: "Rival Space", homeHero: "Әлемдік деңгейдегі визуалдар", navHome: "Басты", navGallery: "Галерея", navAI: "AI", navCourses: "Курстар", navPricing: "Прайс", navMore: "Көбірек", galleryTitle: "Портфолио", addCart: "Себетке", orderBtn: "Тапсыру", coursesTitle: "Курстар", toTelegram: "Telegram" };
T.by = { ...T.ru, appName: "Rival Space", homeHero: "Ствараю візуалы сусветнага ўзроўню", navHome: "Галоўная", navGallery: "Галерэя", navAI: "AI", navCourses: "Курсы", navPricing: "Прайс", navMore: "Яшчэ", galleryTitle: "Партфоліа", addCart: "У кошык", orderBtn: "Замовіць", coursesTitle: "Курсы", toTelegram: "Telegram" };
`;

// Replace the whole T block
const before = content.slice(0, tObjStart);
const after = content.slice(tByLineEnd);

const newContent = before + cleanT + after;
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('File size after:', newContent.length, 'chars');
console.log('Lines after:', newContent.split('\n').length);

// Verify
const counts = (c, s) => (c.match(new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
const newC = fs.readFileSync(filePath, 'utf8');
console.log('\nVerification:');
console.log('  const T =:', counts(newC, 'const T ='));
console.log('  T.ua =:', counts(newC, 'T.ua ='));
console.log('Lines:', newC.split('\n').length);
