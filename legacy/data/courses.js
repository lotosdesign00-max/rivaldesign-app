/**
 * COURSES — Design course catalog with localized content
 */

import { pickGalleryAsset, LOCAL_GALLERY_ASSETS } from "./gallery";

const COURSES_DATA = {
  ru: [
    { id: "c1", cat: "Основы", title: "Photoshop с нуля", desc: "Полный курс базы графического дизайна", level: "Начинающий", duration: "3 ч", lessons: 12, img: "https://picsum.photos/seed/course1/600/340", popular: true, free: true, price: 0, rating: 4.9, students: 2840, topics: ["Интерфейс", "Слои", "Выделение", "Цвет", "Текст", "Фильтры", "Маски", "Смарт-объекты", "Экспорт", "Batch", "Шорткаты", "Финал"] },
    { id: "c2", cat: "Основы", title: "Теория цвета", desc: "Палитры, гармонии и психология цвета", level: "Начинающий", duration: "2 ч", lessons: 8, img: "https://picsum.photos/seed/course2/600/340", popular: true, free: true, price: 0, rating: 4.8, students: 1920, topics: ["Цветовой круг", "Тёплые/холодные", "Комплементарные", "Триады", "Психология", "Веб-палитры", "Брендинг", "Практика"] },
    { id: "c3", cat: "Продвинутый", title: "Аватарки PRO", desc: "Создавай аватары топового уровня", level: "Продвинутый", duration: "5 ч", lessons: 16, img: "https://picsum.photos/seed/course3/600/340", popular: true, free: false, price: 15, rating: 5.0, students: 680, topics: ["Тренды", "Композиция", "Свет/тень", "Неон", "Глитч", "Smoke", "3D элементы", "Текстуры", "Киберпанк", "Минимализм", "Градиент PRO", "Цветокоррекция", "Animated PFP", "Мокапы", "Портфолио", "Фриланс"] },
    { id: "c4", cat: "Продвинутый", title: "YouTube Thumbnail Master", desc: "Превью которые принесут миллионы просмотров", level: "Продвинутый", duration: "4 ч", lessons: 14, img: "https://picsum.photos/seed/course4/600/340", popular: false, free: false, price: 15, rating: 4.7, students: 430, topics: ["Психология кликов", "Композиция", "Типографика", "Лицо", "Эмоции", "Контраст", "A/B тест", "Шаблоны", "Ниши", "Анимация", "CTR", "Тренды 2025", "Ошибки", "Проект"] },
    { id: "c5", cat: "Брендинг", title: "Логотип с нуля до профи", desc: "Полный гайд по логотипам и брендингу", level: "Средний", duration: "6 ч", lessons: 18, img: "https://picsum.photos/seed/course5/600/340", popular: true, free: false, price: 20, rating: 4.9, students: 1100, topics: ["История", "Типы", "Бриф", "Скетчинг", "Цвет", "Типографика", "Вектор", "Illustrator PRO", "Адаптивные", "Анимация", "Гайдлайн", "Мокапы", "Презентация", "Ценообразование", "Правки", "Авторское право", "Портфолио", "Фриланс"] },
    { id: "c6", cat: "Моушн", title: "Motion Design старт", desc: "Оживи свои дизайны анимацией", level: "Средний", duration: "8 ч", lessons: 20, img: "https://picsum.photos/seed/course6/600/340", popular: true, free: false, price: 25, rating: 4.8, students: 790, topics: ["After Effects", "Ключевые кадры", "Easing", "Текст", "Shape layers", "Маски", "Precomps", "Expressions", "Анимация лого", "Переходы", "Particles", "3D слои", "Камера", "Рендер", "GIF", "Lottie", "Веб", "Соцсети", "Шоурил", "Проект"] },
    { id: "c7", cat: "Бизнес", title: "Фриланс дизайнер", desc: "Как зарабатывать $1000+/мес на дизайне", level: "Все уровни", duration: "4 ч", lessons: 15, img: "https://picsum.photos/seed/course7/600/340", popular: false, free: false, price: 10, rating: 4.6, students: 560, topics: ["Ниша", "Портфолио", "Биржи", "Клиенты", "Ценообразование", "Переговоры", "Контракты", "Управление", "Дедлайны", "Обратная связь", "Масштаб", "Пассивный доход", "Личный бренд", "Соцсети", "Рост"] },
    { id: "c8", cat: "Бизнес", title: "Дизайн для стримеров", desc: "Полный пак для Twitch / YouTube", level: "Средний", duration: "5 ч", lessons: 14, img: "https://picsum.photos/seed/course8/600/340", popular: false, free: false, price: 15, rating: 4.7, students: 380, topics: ["Оверлеи", "Панели Twitch", "Алерты", "Ожидание", "Шапка", "Эмоуты", "Брендинг", "Пак", "Анимация", "OBS", "Саб-бейджи", "Мерч", "Ценообразование", "Портфолио"] },
  ],
  en: [
    { id: "c1", cat: "Basics", title: "Photoshop from Zero", desc: "Complete graphic design foundation", level: "Beginner", duration: "3h", lessons: 12, img: "https://picsum.photos/seed/course1/600/340", popular: true, free: true, price: 0, rating: 4.9, students: 2840, topics: ["Interface", "Layers", "Selection", "Color", "Text", "Filters", "Masks", "Smart Objects", "Export", "Batch", "Shortcuts", "Final Project"] },
    { id: "c2", cat: "Basics", title: "Color Theory", desc: "Palettes, harmonies and psychology", level: "Beginner", duration: "2h", lessons: 8, img: "https://picsum.photos/seed/course2/600/340", popular: true, free: true, price: 0, rating: 4.8, students: 1920, topics: ["Color Wheel", "Warm/Cool", "Complementary", "Triads", "Psychology", "Web Palettes", "Branding", "Practice"] },
    { id: "c3", cat: "Advanced", title: "Avatar Design PRO", desc: "Create top-tier avatar artwork", level: "Advanced", duration: "5h", lessons: 16, img: "https://picsum.photos/seed/course3/600/340", popular: true, free: false, price: 15, rating: 5.0, students: 680, topics: ["Trends", "Composition", "Light & Shadow", "Neon", "Glitch", "Smoke", "3D Elements", "Textures", "Cyberpunk", "Minimalism", "Gradients PRO", "Color Grading", "Animated PFP", "Mockups", "Portfolio", "Freelance"] },
    { id: "c4", cat: "Advanced", title: "YouTube Thumbnail Master", desc: "Thumbnails that earn millions of views", level: "Advanced", duration: "4h", lessons: 14, img: "https://picsum.photos/seed/course4/600/340", popular: false, free: false, price: 15, rating: 4.7, students: 430, topics: ["Click Psychology", "Composition", "Typography", "Face", "Emotions", "Contrast", "A/B Testing", "Templates", "Niches", "Animation", "CTR", "Trends 2025", "Mistakes", "Project"] },
    { id: "c5", cat: "Branding", title: "Logo from Zero to Pro", desc: "Full logo & branding guide", level: "Intermediate", duration: "6h", lessons: 18, img: "https://picsum.photos/seed/course5/600/340", popular: true, free: false, price: 20, rating: 4.9, students: 1100, topics: ["History", "Types", "Brief", "Sketching", "Color", "Typography", "Vector", "Illustrator PRO", "Adaptive", "Animation", "Guidelines", "Mockups", "Presentation", "Pricing", "Revisions", "Copyright", "Portfolio", "Freelance"] },
    { id: "c6", cat: "Motion", title: "Motion Design Start", desc: "Bring your designs to life", level: "Intermediate", duration: "8h", lessons: 20, img: "https://picsum.photos/seed/course6/600/340", popular: true, free: false, price: 25, rating: 4.8, students: 790, topics: ["After Effects", "Keyframes", "Easing", "Text", "Shape Layers", "Masks", "Precomps", "Expressions", "Logo Animation", "Transitions", "Particles", "3D Layers", "Camera", "Render", "GIF", "Lottie", "Web", "Social", "Showreel", "Project"] },
    { id: "c7", cat: "Business", title: "Freelance Designer", desc: "Earn $1000+/month with design", level: "All Levels", duration: "4h", lessons: 15, img: "https://picsum.photos/seed/course7/600/340", popular: false, free: false, price: 10, rating: 4.6, students: 560, topics: ["Niche", "Portfolio", "Platforms", "Clients", "Pricing", "Negotiations", "Contracts", "Management", "Deadlines", "Feedback", "Scaling", "Passive Income", "Brand", "Social", "Growth"] },
    { id: "c8", cat: "Business", title: "Design for Streamers", desc: "Full pack for Twitch / YouTube", level: "Intermediate", duration: "5h", lessons: 14, img: "https://picsum.photos/seed/course8/600/340", popular: false, free: false, price: 15, rating: 4.7, students: 380, topics: ["Overlays", "Twitch Panels", "Alerts", "Waiting Screens", "Channel Header", "Emotes", "Branding", "Pack", "Animation", "OBS", "Sub Badges", "Merch", "Pricing", "Portfolio"] },
  ],
};
COURSES_DATA.ua = COURSES_DATA.ru;
COURSES_DATA.kz = COURSES_DATA.ru;
COURSES_DATA.by = COURSES_DATA.ru;

// Replace picsum covers with local assets
const LOCAL_COURSE_COVERS = [
  ...LOCAL_GALLERY_ASSETS.previews,
  ...LOCAL_GALLERY_ASSETS.avatars,
];
Object.keys(COURSES_DATA).forEach((locale) => {
  COURSES_DATA[locale] = (COURSES_DATA[locale] || []).map((course, index) => {
    const img = String(course?.img || "");
    if (!img.includes("picsum.photos")) return course;
    return { ...course, img: pickGalleryAsset(LOCAL_COURSE_COVERS, index) };
  });
});

export const COURSES = COURSES_DATA;
export const COURSE_CATS = [...new Set((COURSES_DATA.ru || []).map((course) => course.cat))];
