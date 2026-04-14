const fs = require('fs');

const filePath = 'legacy/components/HomeTab.jsx';

// Read file as binary (latin1) to preserve original bytes
let content = fs.readFileSync(filePath, 'latin1');

// Find and replace the Russian section
const startMarker = ': {';
const englishSection = `"sectionStudio": "Studio"`;

// Find position after English section
const englishEnd = content.indexOf('},\n    : {');
if (englishEnd === -1) {
  console.log('Pattern not found');
  process.exit(1);
}

// Find the end of Russian section
const russianEnd = content.indexOf('};\n}', englishEnd);
if (russianEnd === -1) {
  console.log('Russian section end not found');
  process.exit(1);
}

const correctRussian = `: {
        sectionStudio: "Студия",
        sectionTrust: "Доверие",
        sectionProcess: "Процесс",
        heroKicker: "Орбитальная дизайн-станция",
        heroBody:
          "Премиальные визуальные системы для креаторов, стримеров и брендов. Чёткое направление, чистая иерархия и результат, который ощущается дорогим с первого экрана.",
        ctaPrimary: "Начать проект",
        ctaSecondary: "Открыть галерею",
        featuredTitle: "Выбранные работы",
        featuredSub: "Подборка работ с самым сильным визуальным акцентом и подачей.",
        toolkitTitle: "Инструменты",
        toolkitSub: "Основной стек для графики, моушна и глубины.",
        processTitle: "Как идет работа",
        trustTitle: "Почему доверяют",
        reviewsLabel: "отзывов",
        moreReviews: "Посмотреть больше",
        allReviewsTitle: "Все отзывы",
        backLabel: "Назад",
        verifiedLabel: "Проверенный отзыв",
        profileTitle: "Обо мне",
        profileBody:
          "Фокусируюсь на четком визуальном направлении для креаторов, стримеров и digital-брендов. Делаю работы, которые ощущаются чисто, собранно и премиально без лишнего шума.",
        profileMeta: [
          "Направление: премиальная digital-айдентика",
          "Фокус: превью, баннеры, логотипы, аватарки",
          "Формат: понятный процесс и четкая коммуникация",
        ],
        socialTitle: "Соцсети",
        faqTitle: "Быстрые ответы",
        steps: [
          "Бриф в Telegram",
          "Направление и референсы",
          "Производство",
          "Доработка и сдача",
        ],
      };
}`;

const before = content.substring(0, englishEnd + 3); // includes '},\n'
const after = content.substring(russianEnd + 2); // after '};'

const newContent = before + correctRussian + after;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Fixed Russian encoding!');
