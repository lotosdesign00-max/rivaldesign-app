import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const TABS = {
  GALLERY: "gallery",
  REVIEWS: "reviews",
  PRICING: "pricing",
  CART: "cart", // Перемещено сразу после PRICING
  ABOUT_FAQ: "about_faq", // Объединенная вкладка "Обо мне" и "FAQ"
  AI: "ai",
};

// ТЕМЫ С ЦВЕТОВЫМИ СХЕМАМИ (фиксированные цвета)
const THEMES = {
  DARK: {
    id: "dark",
    name: "Темная",
    icon: "🌙",
    colors: {
      primary: "#0a0a0a",
      secondary: "#1a1a1a",
      accent: "#7c3aed",
      text: "#f8fafc",
      textSecondary: "#94a3b8",
      border: "#2d3748",
      card: "#1a1a1a",
      button: "#7c3aed",
      buttonText: "#ffffff",
      tabActive: "#7c3aed",
      shadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
      gradient: "linear-gradient(145deg, #0a0a0a, #1a1a1a)"
    }
  },
  LIGHT: {
    id: "light", 
    name: "Светлая",
    icon: "☀️",
    colors: {
      primary: "#f1f5f9",
      secondary: "#ffffff",
      accent: "#2563eb",
      text: "#1e293b",
      textSecondary: "#64748b",
      border: "#e2e8f0",
      card: "#ffffff",
      button: "#2563eb",
      buttonText: "#ffffff",
      tabActive: "#2563eb",
      shadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      gradient: "linear-gradient(145deg, #f1f5f9, #e2e8f0)"
    }
  },
  RED: {
    id: "red",
    name: "Красная",
    icon: "🔴",
    colors: {
      primary: "#1a0000",
      secondary: "#2a0000",
      accent: "#dc2626",
      text: "#fef2f2",
      textSecondary: "#fca5a5",
      border: "#7f1d1d",
      card: "#2a0000",
      button: "#dc2626",
      buttonText: "#ffffff",
      tabActive: "#dc2626",
      shadow: "0 4px 12px rgba(220, 38, 38, 0.15)",
      gradient: "linear-gradient(145deg, #1a0000, #2a0000)"
    }
  },
  BLUE: {
    id: "blue",
    name: "Синяя",
    icon: "🔵",
    colors: {
      primary: "#0c1a2d",
      secondary: "#1e293b",
      accent: "#0ea5e9",
      text: "#e2e8f0",
      textSecondary: "#94a3b8",
      border: "#334155",
      card: "#1e293b",
      button: "#0ea5e9",
      buttonText: "#ffffff",
      tabActive: "#0ea5e9",
      shadow: "0 4px 12px rgba(14, 165, 233, 0.1)",
      gradient: "linear-gradient(145deg, #0c1a2d, #1e293b)"
    }
  },
  PURPLE: {
    id: "purple",
    name: "Фиолетовая",
    icon: "🟣",
    colors: {
      primary: "#1e0b3a",
      secondary: "#2d1b4e",
      accent: "#a855f7",
      text: "#f5f3ff",
      textSecondary: "#c4b5fd",
      border: "#4c1d95",
      card: "#2d1b4e",
      button: "#a855f7",
      buttonText: "#ffffff",
      tabActive: "#a855f7",
      shadow: "0 4px 12px rgba(168, 85, 247, 0.1)",
      gradient: "linear-gradient(145deg, #1e0b3a, #2d1b4e)"
    }
  },
  GRADIENT: {
    id: "gradient",
    name: "Градиент",
    icon: "🌈",
    colors: {
      primary: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      secondary: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
      accent: "#ffd166",
      text: "#ffffff",
      textSecondary: "rgba(255,255,255,0.85)",
      border: "rgba(255,255,255,0.25)",
      card: "rgba(255,255,255,0.12)",
      button: "#ffd166",
      buttonText: "#000000",
      tabActive: "#ffd166",
      shadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      gradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
    }
  },
  NEON: {
    id: "neon",
    name: "Неон",
    icon: "💡",
    colors: {
      primary: "#000000",
      secondary: "#0a0a0a",
      accent: "#00ff9d",
      text: "#ffffff",
      textSecondary: "#00ff9d",
      border: "#00ff9d",
      card: "#0a0a0a",
      button: "#00ff9d",
      buttonText: "#000000",
      tabActive: "#00ff9d",
      shadow: "0 0 10px rgba(0, 255, 157, 0.3)",
      gradient: "linear-gradient(145deg, #000000, #0a0a0a)"
    }
  }
};

// Курсы валют (примерные)
const EXCHANGE_RATES = {
  USD: 1,
  RUB: 95,
  UAH: 40,
  BYN: 3.2,
  KZT: 450,
};

const LANGUAGE_TO_CURRENCY = {
  ru: { symbol: "₽", code: "RUB" },
  ua: { symbol: "₴", code: "UAH" },
  en: { symbol: "$", code: "USD" },
  by: { symbol: "Br", code: "BYN" },
  kz: { symbol: "₸", code: "KZT" },
};

const TAB_LABELS = {
  ru: {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Отзывы",
    [TABS.PRICING]: "Прайс",
    [TABS.CART]: "🛒 Корзина",
    [TABS.ABOUT_FAQ]: "Обо мне & FAQ",
    [TABS.AI]: "AI идеи",
  },
  en: {
    [TABS.GALLERY]: "Gallery",
    [TABS.REVIEWS]: "Reviews",
    [TABS.PRICING]: "Pricing",
    [TABS.CART]: "🛒 Cart",
    [TABS.ABOUT_FAQ]: "About & FAQ",
    [TABS.AI]: "AI Ideas",
  },
  ua: {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Відгуки",
    [TABS.PRICING]: "Прайс",
    [TABS.CART]: "🛒 Кошик",
    [TABS.ABOUT_FAQ]: "Про мене & FAQ",
    [TABS.AI]: "AI ідеї",
  },
  kz: {
    [TABS.GALLERY]: "Галерея",
    [TABS.REVIEWS]: "Пікірлер",
    [TABS.PRICING]: "Прайс",
    [TABS.CART]: "🛒 Себет",
    [TABS.ABOUT_FAQ]: "Мен туралы & FAQ",
    [TABS.AI]: "AI идеялар",
  },
  by: {
    [TABS.GALLERY]: "Галерэя",
    [TABS.REVIEWS]: "Водгукі",
    [TABS.PRICING]: "Прайс",
    [TABS.CART]: "🛒 Кошык",
    [TABS.ABOUT_FAQ]: "Пра мяне & FAQ",
    [TABS.AI]: "AI ідэі",
  },
};

// Категории галереи для разных языков
const GALLERY_CATEGORIES_TRANSLATIONS = {
  ru: ["Аватарки", "Превью", "Баннеры"],
  en: ["Avatars", "Previews", "Banners"],
  ua: ["Аватарки", "Прев'ю", "Банери"],
  kz: ["Аватарлар", "Превью", "Баннерлер"],
  by: ["Аватаркі", "Прэв'ю", "Банеры"]
};

// FAQ вопросы для разных языков (обновленные с короткими ответами)
const FAQ_TRANSLATIONS = {
  ru: [
    {
      question: "📝 Как проходит работа?",
      answer: "1. Приветствие\n2. Обсуждение проекта\n3. Согласование\n4. Оплата\n5. Ожидание выполнения заказа (от 1 до 3х дней, если срочный то быстрее)\n6. Получение товара\n6. Правки (если есть)\n7. Отзыв"
    },
    {
      question: "💾 Что я получу?",
      answer: "✅ Качественную работу\n✅ Вежливое общение\n✅ Исходные PSD/AEP файлы\n✅ 3 бесплатные правки"
    },
    {
      question: "✏️ Сколько правок?",
      answer: "🔄 В стоимость входит до 3 бесплатных правок\n💰 Дополнительные — обсуждаем отдельно"
    },
    {
      question: "💳 Как оплатить?",
      answer: "💳 Карта любой страны\n💸 Криптовалюта, CryptoBot (USDT)\n\n💵 50% предоплата + 50% после"
    },
    {
      question: "⚡ Срочный заказ?",
      answer: "🔥 Срок выполнения может достигать до 3 часов, в зависимости от сложности и объема\n💸 +20-50% за срочность"
    }
  ],
  en: [
    {
      question: "📝 How does the process work?",
      answer: "1. Greeting\n2. Project discussion\n3. Agreement\n4. Payment\n5. Waiting for order completion (1-3 days, faster for urgent orders)\n6. Receiving the product\n7. Revisions (if needed)\n8. Review"
    },
    {
      question: "💾 What will I receive?",
      answer: "✅ Quality work\n✅ Polite communication\n✅ Source PSD/AEP files\n✅ 3 free revisions"
    },
    {
      question: "✏️ How many revisions?",
      answer: "🔄 Price includes up to 3 free revisions\n💰 Additional revisions discussed separately"
    },
    {
      question: "💳 How to pay?",
      answer: "💳 Card from any country\n💸 Cryptocurrency, CryptoBot (USDT)\n\n💵 50% prepayment + 50% after"
    },
    {
      question: "⚡ Urgent order?",
      answer: "🔥 Completion time can be up to 3 hours, depending on complexity and volume\n💸 +20-50% for urgency"
    }
  ],
  ua: [
    {
      question: "📝 Як проходить робота?",
      answer: "1. Вітання\n2. Обговорення проекту\n3. Узгодження\n4. Оплата\n5. Очікування виконання замовлення (від 1 до 3 днів, якщо термінове то швидше)\n6. Отримання товару\n7. Правки (якщо потрібно)\n8. Відгук"
    },
    {
      question: "💾 Що я отримаю?",
      answer: "✅ Якісну роботу\n✅ Ввічливе спілкування\n✅ Вихідні PSD/AEP файли\n✅ 3 безкоштовні правки"
    },
    {
      question: "✏️ Скільки правок?",
      answer: "🔄 У вартість входить до 3 безкоштовних правок\n💰 Додаткові — обговорюємо окремо"
    },
    {
      question: "💳 Як оплатити?",
      answer: "💳 Карта будь-якої країни\n💸 Криптовалюта, CryptoBot (USDT)\n\n💵 50% передоплата + 50% після"
    },
    {
      question: "⚡ Термінове замовлення?",
      answer: "🔥 Термін виконання може досягати до 3 годин, залежно від складності та обсягу\n💸 +20-50% за терміновість"
    }
  ],
  kz: [
    {
      question: "📝 Жұмыс қалай өтеді?",
      answer: "1. Сәлемдесу\n2. Жобаны талқылау\n3. Келісім\n4. Төлем\n5. Тапсырысты орындауды күту (1-3 күн, шұғыл болса жылдам)\n6. Тауарды алу\n7. Өзгерістер (қажет болса)\n8. Пікір"
    },
    {
      question: "💾 Мен не аламын?",
      answer: "✅ Сапалы жұмыс\n✅ Әдепті қарым-қатынас\n✅ Бастапқы PSD/AEP файлдар\n✅ 3 тегін өзгеріс"
    },
    {
      question: "✏️ Қанша өзгеріс?",
      answer: "🔄 Бағаға дейін 3 тегін өзгеріс кіреді\n💰 Қосымша өзгерістер бөлек талқыланады"
    },
    {
      question: "💳 Қалай төлем жасауға болады?",
      answer: "💳 Кез келген елдің картасы\n💸 Криптовалюта, CryptoBot (USDT)\n\n💵 50% алдын ала төлем + 50% кейін"
    },
    {
      question: "⚡ Шұғыл тапсырыс?",
      answer: "🔥 Орындау мерзімі 3 сағатқа дейін жетуі мүмкін, күрделілігі мен көлеміне байланысты\n💸 Шұғылдық үшін +20-50%"
    }
  ],
  by: [
    {
      question: "📝 Як праходзіць работа?",
      answer: "1. Прывітанне\n2. Абмеркаванне праекта\n3. Узгадненне\n4. Аплата\n5. Чаканне выканання замовы (ад 1 да 3 дзён, калі тэрміновае то хутчэй)\n6. Атрыманне тавару\n7. Праўкі (калі трэба)\n8. Водгук"
    },
    {
      question: "💾 Што я атрымаю?",
      answer: "✅ Якасную працу\n✅ Ветлівае зносіны\n✅ Зыходныя PSD/AEP файлы\n✅ 3 бясплатныя праўкі"
    },
    {
      question: "✏️ Колькі праўкі?",
      answer: "🔄 У кошт уваходзіць да 3 бясплатных праўкі\n💰 Дадатковыя — абмяркоўваем асобна"
    },
    {
      question: "💳 Як аплаціць?",
      answer: "💳 Карта любой краіны\n💸 Крыптавалюта, CryptoBot (USDT)\n\n💵 50% папярэдняя аплата + 50% пасля"
    },
    {
      question: "⚡ Тэрміновая замова?",
      answer: "🔥 Тэрмін выканання можа дасягаць да 3 гадзін, у залежнасці ад складанасці і аб'ёму\n💸 +20-50% за тэрміновасць"
    }
  ]
};

// Текст для секции "Обо мне" на разных языках
const ABOUT_ME_TRANSLATIONS = {
  ru: {
    title: "Обо мне",
    content: "Я Rival — графический дизайнер, с опытом более 1 года, который превращает идеи в стильные и запоминающиеся визуалы.\n\nЧто делаю:\n• Аватарки, превью, баннеры\n• Логотипы и брендинг\n• Дизайн для Twitch/YouTube/TikTok",
    socialTitle: "🌐 Мои соцсети",
    socialDescription: "Подписывайся, чтобы следить за моими работами и быть в курсе новых проектов!",
    socialWait: "Жду только тебя! 🚀"
  },
  en: {
    title: "About me",
    content: "I'm Rival — a graphic designer with over 1 year of experience who turns ideas into stylish and memorable visuals.\n\nWhat I do:\n• Avatars, previews, banners\n• Logos and branding\n• Design for Twitch/YouTube/TikTok",
    socialTitle: "🌐 My social media",
    socialDescription: "Subscribe to follow my works and stay updated on new projects!",
    socialWait: "Waiting just for you! 🚀"
  },
  ua: {
    title: "Про мене",
    content: "Я Rival — графічний дизайнер, з досвідом понад 1 рік, який перетворює ідеї на стильні та запам'ятовуючі візуали.\n\nЩо роблю:\n• Аватарки, прев'ю, банери\n• Логотипи та брендинг\n• Дизайн для Twitch/YouTube/TikTok",
    socialTitle: "🌐 Мої соцмережі",
    socialDescription: "Підписуйся, щоб слідкувати за моїми роботами та бути в курсі нових проектів!",
    socialWait: "Чекаю тільки на тебе! 🚀"
  },
  kz: {
    title: "Мен туралы",
    content: "Мен Rival — 1 жылдан астам тәжірибесі бар графикалық дизайнер, идеяларды стильді және есте қаларлық визуалдарға айналдырамын.\n\nНе істеймін:\n• Аватарлар, превью, баннерлер\n• Логотиптер және брендинг\n• Twitch/YouTube/TikTok үшін дизайн",
    socialTitle: "🌐 Менің әлеуметтік желілерім",
    socialDescription: "Менің жұмыстарымды қадағалау және жаңа жобалардан хабардар болу үшін жазылыңыз!",
    socialWait: "Тек сені күтемін! 🚀"
  },
  by: {
    title: "Пра мяне",
    content: "Я Rival — графічны дызайнер, з досведам больш за 1 год, які ператварае ідэі ў стыльныя і запамінальныя візуалы.\n\nШто раблю:\n• Аватаркі, прэв'ю, банеры\n• Лагатыпы і брэндынг\n• Дызайн для Twitch/YouTube/TikTok",
    socialTitle: "🌐 Мае сацсеткі",
    socialDescription: "Падпісвайся, каб сачыць за маімі працамі і быць у курсе новых праектаў!",
    socialWait: "Чакаю толькі цябе! 🚀"
  }
};

// Текст для кнопки "нажми, чтобы увеличить"
const ZOOM_HINT_TRANSLATIONS = {
  ru: "🔍 нажми, чтобы увеличить",
  en: "🔍 click to zoom",
  ua: "🔍 натисніть, щоб збільшити",
  kz: "🔍 үлкейту үшін басыңыз",
  by: "🔍 націсніце, каб павялічыць"
};

// Тексты для корзины (обновленные для скидки по количеству)
const CART_TEXTS = {
  ru: {
    cartTitle: "Корзина",
    cartEmpty: "Корзина пуста",
    cartItems: "Товары в корзине",
    total: "Итого",
    clearCart: "Очистить корзину",
    orderAll: "Заказать всё",
    addToCart: "В корзину",
    remove: "Удалить",
    quantity: "Кол-во",
    discountNote: "При заказе 2+ товаров скидка 10%",
    finalPrice: "Итоговая цена",
  },
  en: {
    cartTitle: "Cart",
    cartEmpty: "Cart is empty",
    cartItems: "Items in cart",
    total: "Total",
    clearCart: "Clear cart",
    orderAll: "Order all",
    addToCart: "Add to cart",
    remove: "Remove",
    quantity: "Qty",
    discountNote: "10% discount for 2+ items",
    finalPrice: "Final price",
  },
  ua: {
    cartTitle: "Кошик",
    cartEmpty: "Кошик порожній",
    cartItems: "Товари у кошику",
    total: "Всього",
    clearCart: "Очистити кошик",
    orderAll: "Замовити все",
    addToCart: "У кошик",
    remove: "Видалити",
    quantity: "Кількість",
    discountNote: "Знижка 10% при замовленні 2+ товарів",
    finalPrice: "Фінальна ціна",
  },
  kz: {
    cartTitle: "Себет",
    cartEmpty: "Себет бос",
    cartItems: "Себеттегі тауарлар",
    total: "Барлығы",
    clearCart: "Себетті тазалау",
    orderAll: "Барлығын тапсыру",
    addToCart: "Себетке қосу",
    remove: "Жою",
    quantity: "Саны",
    discountNote: "2+ тауарға 10% жеңілдік",
    finalPrice: "Соңғы баға",
  },
  by: {
    cartTitle: "Кошык",
    cartEmpty: "Кошык пусты",
    cartItems: "Тавары ў кошыку",
    total: "Усяго",
    clearCart: "Ачысціць кошык",
    orderAll: "Замовіць усё",
    addToCart: "У кошык",
    remove: "Выдаліць",
    quantity: "Колькасць",
    discountNote: "Зніжка 10% пры замове 2+ тавараў",
    finalPrice: "Канчатковая цана",
  }
};

const TEXTS = {
  ru: {
    appTitle: "Rival App",
    galleryTitle: "Галерея работ",
    gallerySubtitle: "Аватарки, превью, баннеры и другие проекты.",
    galleryHint: "Выбери категорию сверху и листай работы свайпом.",
    reviewsTitle: "Отзывы клиентов",
    reviewsSubtitle: "Настоящие отзывы моих клиентов.",
    reviewsAddButton: "Оставить отзыв",
    pricingTitle: "Прайс / Услуги",
    pricingCurrencyHint: "Цены в {currency} (курс: 1$ ≈ {rate} {currency})",
    aboutTitle: "Обо мне",
    aboutSubtitle: "Я Rival — графический дизайнер, с опытом более 1 года, который превращает идеи в стильные и запоминающиеся визуалы.\n\nЧто делаю:\n• Аватарки, превью, баннеры\n• Логотипы и брендинг\n• Дизайн для Twitch/YouTube/TikTok",
    faqTitle: "Часто задаваемые вопросы",
    aboutFaqTitle: "Обо мне & FAQ",
    aiTitle: "AI идеи",
    aiSubtitle: "Генератор идей для палитр, референсов и концептов (в разработке).",
    bottomOrder: "Оформить заказ",
    bottomGenerate: "Сгенерировать идею",
    orderAlert: "Скоро здесь будет переход к твоему Telegram для оформления заказа 😉",
    aiAlert: "Скоро здесь будет генератор идей на AI 🚀",
    ...CART_TEXTS.ru,
  },
  en: {
    appTitle: "Rival App",
    galleryTitle: "Portfolio",
    gallerySubtitle: "Avatars, thumbnails, banners and other projects.",
    galleryHint: "Choose a category above and swipe through your works.",
    reviewsTitle: "Client reviews",
    reviewsSubtitle: "Real feedback from my clients.",
    reviewsAddButton: "Leave a review",
    pricingTitle: "Pricing / Services",
    pricingCurrencyHint: "Prices in {currency} (rate: 1$ ≈ {rate} {currency})",
    aboutTitle: "About me",
    aboutSubtitle: "I'm Rival — a graphic designer with over 1 year of experience who turns ideas into stylish and memorable visuals.\n\nWhat I do:\n• Avatars, previews, banners\n• Logos and branding\n• Design for Twitch/YouTube/TikTok",
    faqTitle: "Frequently Asked Questions",
    aboutFaqTitle: "About & FAQ",
    aiTitle: "AI ideas",
    aiSubtitle: "Idea generator for palettes, references and concepts (coming soon).",
    bottomOrder: "Place an order",
    bottomGenerate: "Generate idea",
    orderAlert: "Soon this will open your Telegram for orders 😉",
    aiAlert: "Soon this will be an AI idea generator 🚀",
    ...CART_TEXTS.en,
  },
  ua: {
    appTitle: "Rival App",
    galleryTitle: "Галерея робіт",
    gallerySubtitle: "Аватарки, прев'ю, банери та інші проєкти.",
    galleryHint: "Обери категорію зверху та гортай роботи свайпом.",
    reviewsTitle: "Відгуки клієнтів",
    reviewsSubtitle: "Реальні відгуки моїх клієнтів.",
    reviewsAddButton: "Залишити відгук",
    pricingTitle: "Прайс / Послуги",
    pricingCurrencyHint: "Ціни в {currency} (курс: 1$ ≈ {rate} {currency})",
    aboutTitle: "Про мене",
    aboutSubtitle: "Я Rival — графічний дизайнер, з досвідом понад 1 рік, який перетворює ідеї на стильні та запам'ятовуючі візуали.\n\nЩо роблю:\n• Аватарки, прев'ю, банери\n• Логотипи та брендинг\n• Дизайн для Twitch/YouTube/TikTok",
    faqTitle: "Часто задавані питання",
    aboutFaqTitle: "Про мене & FAQ",
    aiTitle: "AI ідеї",
    aiSubtitle: "Генератор ідей для палітр, референсів та концептів (у розробці).",
    bottomOrder: "Замовити дизайн",
    bottomGenerate: "Згенерувати ідею",
    orderAlert: "Скоро тут буде перехід у твій Telegram для замовлення 😉",
    aiAlert: "Скоро тут буде AI-генератор ідей 🚀",
    ...CART_TEXTS.ua,
  },
  kz: {
    appTitle: "Rival App",
    galleryTitle: "Жұмыстар галереясы",
    gallerySubtitle: "Аватарлар, превью, баннерлер және басқа жобалар.",
    galleryHint: "Жоғарыдан санатты таңда да, жұмыстарды свайппен қара.",
    reviewsTitle: "Клиенттерімнің пікірлері",
    reviewsSubtitle: "Нағыз клиенттерден пікірлер.",
    reviewsAddButton: "Пікір қалдыру",
    pricingTitle: "Прайс / Қызметтер",
    pricingCurrencyHint: "Бағалар {currency} (курс: 1$ ≈ {rate} {currency})",
    aboutTitle: "Мен туралы",
    aboutSubtitle: "Мен Rival — 1 жылдан астам тәжірибесі бар графикалық дизайнер, идеяларды стильді және есте қаларлық визуалдарға айналдырамын.\n\nНе істеймін:\n• Аватарлар, превью, баннерлер\n• Логотиптер және брендинг\n• Twitch/YouTube/TikTok үшін дизайн",
    faqTitle: "Жиі қойылатын сұрақтар",
    aboutFaqTitle: "Мен туралы & FAQ",
    aiTitle: "AI идеялар",
    aiSubtitle: "Палитралар, референстер және концепттер үшін идея генераторы (әзірлеуде).",
    bottomOrder: "Дизайнға тапсырыс беру",
    bottomGenerate: "Идея генерациялау",
    orderAlert: "Жақында мұнда тапсырыс беру үшін сенің Telegram-ыңа өтуді қосамыз 😉",
    aiAlert: "Жақында мұнда AI идея генераторы болады 🚀",
    ...CART_TEXTS.kz,
  },
  by: {
    appTitle: "Rival App",
    galleryTitle: "Галерэя работ",
    gallerySubtitle: "Аватаркі, прэв'ю, банеры і іншыя праекты.",
    galleryHint: "Абяры катэгорыю зверху і ліставай работы свайпам.",
    reviewsTitle: "Водгукі маіх кліентаў",
    reviewsSubtitle: "Сапраўдныя водгукі маіх кліентаў.",
    reviewsAddButton: "Пакінуць водгук",
    pricingTitle: "Прайс / Паслугі",
    pricingCurrencyHint: "Цэны ў {currency} (курс: 1$ ≈ {rate} {currency})",
    aboutTitle: "Пра мяне",
    aboutSubtitle: "Я Rival — графічны дызайнер, з досведам больш за 1 год, які ператварае ідэі ў стыльныя і запамінальныя візуалы.\n\nШто раблю:\n• Аватаркі, прэв'ю, банеры\n• Лагатыпы і брэндынг\n• Дызайн для Twitch/YouTube/TikTok",
    faqTitle: "Часта задаваныя пытанні",
    aboutFaqTitle: "Пра мяне & FAQ",
    aiTitle: "AI ідэі",
    aiSubtitle: "Генератар ідэй для палітр, рэферансаў і канцэптаў (у распрацоўцы).",
    bottomOrder: "Замовіць дызайн",
    bottomGenerate: "Згенераваць ідэю",
    orderAlert: "Хутка тут будзе пераход у твой Telegram для замовы 😉",
    aiAlert: "Хутка тут буде AI-генератар ідэй 🚀",
    ...CART_TEXTS.by,
  },
};

// Исходные данные галереи (на русском)
const GALLERY_ITEMS_RU = [
  { id: "5", category: "Аватарки", title: "Свежая Подборка Работ", image: "/images/podborka av 5.png", description: "«Воплоти свою идею в дизайн вместе с нами» " },
  { id: "4", category: "Аватарки", title: "Свежая Подборка Работ", image: "/images/podborka av 4.png", description: "«Воплоти свою идею в дизайн вместе с нами» " },
  { id: "1", category: "Аватарки", title: "Свежая Подборка Работ", image: "/images/podborka av 1.jpg", description: "«Воплоти свою идею в дизайн вместе с нами» " },
  { id: "2", category: "Аватарки", title: "Свежая Подборка Работ", image: "/images/podborka av 2.jpg", description: "«Воплоти свою идею в дизайн вместе с нами» " },
  { id: "3", category: "Аватарки", title: "Свежая Подборка Работ", image: "/images/podborka av 3.jpg", description: "«Воплоти свою идею в дизайн вместе с нами» " },
  { id: "25", category: "Превью", title: "Свежая Подборка Работ", image: "/images/мокап для превьюшек.png", description: "«Воплоти свою идею в дизайн вместе с нами»" },
  { id: "20", category: "Превью", title: "Свежая Подборка Работ", image: "/images/podborka prewiew 1.jpg", description: "«Воплоти свою идею в дизайн вместе с нами»" },
  { id: "21", category: "Превью", title: "Свежая Подборка Работ", image: "/images/podborka prewiew 2.jpg", description: "«Воплоти свою идею в дизайн вместе с нами»" },
  { id: "22", category: "Превью", title: "Свежая Подборка Работ", image: "/images/podborka prewiew 3.jpg", description: "«Воплоти свою идею в дизайн вместе с нами»" },
  { id: "23", category: "Превью", title: "Свежая Подборка Работ", image: "/images/podborka prewiew 4.jpg", description: "«Воплоти свою идею в дизайн вместе с нами»" },
  { id: "24", category: "Превью", title: "Свежая Подборка Работ", image: "/images/podborka prewiew 5.jpg", description: "«Воплоти свою идею в дизайн вместе с нами»" },
  { id: "3", category: "Баннеры", title: "Баннер 1", image: "/images/banner1.jpg", description: "Описание баннера 1" },
];

// Трансляции для галереи
const GALLERY_TRANSLATIONS = {
  ru: GALLERY_ITEMS_RU,
  en: [ 
    { id: "5", category: "Avatars", title: "Fresh Selection of Works", image: "/images/podborka av 5.jpg", description: "Bring your idea to life in design with us" },
    { id: "4", category: "Avatars", title: "Fresh Selection of Works", image: "/images/podborka av 4.png", description: "Bring your idea to life in design with us" },
    { id: "1", category: "Avatars", title: "Fresh Selection of Works", image: "/images/podborka av 1.jpg", description: "Bring your idea to life in design with us" },
    { id: "2", category: "Avatars", title: "Fresh Selection of Works", image: "/images/podborka av 2.jpg", description: "Bring your idea to life in design with us" },
    { id: "3", category: "Avatars", title: "Fresh Selection of Works", image: "/images/podborka av 3.jpg", description: "Bring your idea to life in design with us" },
    { id: "25", category: "Previews", title: "Fresh Selection of Works", image: "/images/мокап для превьюшек.png", description: "Bring your idea to life in design with us" },
    { id: "20", category: "Previews", title: "Fresh Selection of Works", image: "/images/podborka prewiew 1.jpg", description: "Bring your idea to life in design with us" },
    { id: "21", category: "Previews", title: "Fresh Selection of Works", image: "/images/podborka prewiew 2.jpg", description: "Bring your idea to life in design with us" },
    { id: "22", category: "Previews", title: "Fresh Selection of Works", image: "/images/podborka prewiew 3.jpg", description: "Bring your idea to life in design with us" },
    { id: "23", category: "Previews", title: "Fresh Selection of Works", image: "/images/podborka prewiew 4.jpg", description: "Bring your idea to life in design with us" },
    { id: "24", category: "Previews", title: "Fresh Selection of Works", image: "/images/podborka prewiew 5.jpg", description: "Bring your idea to life in design with us" },
    { id: "3", category: "Banners", title: "Banner 1", image: "/images/banner1.jpg", description: "Banner description 1" },
  ],
  ua: [
    { id: "5", category: "Аватарки", title: "Свіжа підбірка робіт", image: "/images/podborka av 5.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "4", category: "Аватарки", title: "Свіжа підбірка робіт", image: "/images/podborka av 4.png", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "1", category: "Аватарки", title: "Свіжа підбірка робіт", image: "/images/podborka av 1.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "2", category: "Аватарки", title: "Свіжа підбірка робіт", image: "/images/podborka av 2.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "3", category: "Аватарки", title: "Свіжа підбірка робіт", image: "/images/podborka av 3.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "25", category: "Прев'ю", title: "Свіжа підбірка робіт", image: "/images/мокап для превьюшек.png", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "20", category: "Прев'ю", title: "Свіжа підбірка робіт", image: "/images/podborka prewiew 1.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "21", category: "Прев'ю", title: "Свіжа підбірка робіт", image: "/images/podborka prewiew 2.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "22", category: "Прев'ю", title: "Свіжа підбірка робіт", image: "/images/podborka prewiew 3.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "23", category: "Прев'ю", title: "Свіжа підбірка робіт", image: "/images/podborka prewiew 4.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "24", category: "Прев'ю", title: "Свіжа підбірка робіт", image: "/images/podborka prewiew 5.jpg", description: "Втіли свою ідею в дизайн разом з нами" },
    { id: "3", category: "Банери", title: "Банер 1", image: "/images/banner1.jpg", description: "Опис банера 1" },
  ],
  kz: [
    { id: "5", category: "Аватарлар", title: "Жаңа таңдау шолуы", image: "/images/podborka av 5.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "4", category: "Аватарлар", title: "Жаңа таңдау шолуы", image: "/images/podborka av 4.png", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "1", category: "Аватарлар", title: "Жаңа таңдау шолуы", image: "/images/podborka av 1.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "2", category: "Аватарлар", title: "Жаңа таңдау шолуы", image: "/images/podborka av 2.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "3", category: "Аватарлар", title: "Жаңа таңдау шолуы", image: "/images/podborka av 3.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "25", category: "Превью", title: "Жаңа таңдау шолуы", image: "/images/мокап для превьюшек.png", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "20", category: "Превью", title: "Жаңа таңдау шолуы", image: "/images/podborka prewiew 1.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "21", category: "Превью", title: "Жаңа таңдау шолуы", image: "/images/podborka prewiew 2.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "22", category: "Превью", title: "Жаңа таңдау шолуы", image: "/images/podborka prewiew 3.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "23", category: "Превью", title: "Жаңа таңдау шолуы", image: "/images/podborka prewiew 4.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "24", category: "Превью", title: "Жаңа таңдау шолуы", image: "/images/podborka prewiew 5.jpg", description: "Бізбен бірге идеяңызды дизайн арқылы өмірге әкеліңіз" },
    { id: "3", category: "Баннерлер", title: "Баннер 1", image: "/images/banner1.jpg", description: "Баннер сипаттамасы 1" },
  ],
  by: [
    { id: "5", category: "Аватаркі", title: "Свежы падбор твораў", image: "/images/podborka av 5.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "4", category: "Аватаркі", title: "Свежы падбор твораў", image: "/images/podborka av 4.png", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "1", category: "Аватаркі", title: "Свежы падбор твораў", image: "/images/podborka av 1.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "2", category: "Аватаркі", title: "Свежы падбор твораў", image: "/images/podborka av 2.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "3", category: "Аватаркі", title: "Свежы падбор твораў", image: "/images/podborka av 3.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "25", category: "Прэв'ю", title: "Свежы падбор твораў", image: "/images/мокап для превьюшек.png", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "20", category: "Прэв'ю", title: "Свежы падбор твораў", image: "/images/podborka prewiew 1.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "21", category: "Прэв'ю", title: "Свежы падбор твораў", image: "/images/podborka prewiew 2.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "22", category: "Прэв'ю", title: "Свежы падбор твораў", image: "/images/podborka prewiew 3.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "23", category: "Прэв'ю", title: "Свежы падбор твораў", image: "/images/podborka prewiew 4.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "24", category: "Прэв'ю", title: "Свежы падбор твораў", image: "/images/podborka prewiew 5.jpg", description: "Ажыццявіце сваю ідэю ў дызайне з намі" },
    { id: "3", category: "Банеры", title: "Банер 1", image: "/images/banner1.jpg", description: "Апісанне банеру 1" },
  ]
};

// Отзывы с ссылками на Telegram
const REVIEWS_ITEMS = [
  { 
    id: "r1", 
    name: "W1tex", 
    text: "Работа выполнена превосходно, очень доволен результатом.",
    telegram: "w1tex_dsg"
  },
  { 
    id: "r2", 
    name: "Shyngyzx", 
    text: "Отличный специалист, рекомендую к сотрудничеству.",
    telegram: "Shyngyzx"
  },
  { 
    id: "r3", 
    name: "Butter", 
    text: "Качество работы на высшем уровне, оценка 10/10.",
    telegram: "BUTTE6"
  },
  { 
    id: "r4", 
    name: "scarlet roses", 
    text: "Благодарю за проделанную работу, всё выполнено профессионально.",
    telegram: "hoskefromheviz"
  },
  { 
    id: "r5", 
    name: "Solevoy", 
    text: "Рекомендую всем — работа выполнена безупречно.",
    telegram: "fazenemoy"
  },
  { 
    id: "r6", 
    name: "Aero", 
    text: "Отличный результат, спасибо за качественную работу.",
    telegram: "AeroDesig"
  },
  { 
    id: "r7", 
    name: "Firessk", 
    text: "Большое спасибо, обязательно порекомендую вас своим знакомым.",
    telegram: "firessk"
  },
  { 
    id: "r8", 
    name: "Helvite", 
    text: "Работа выполнена на оценку 10/10, всё качественно.",
    telegram: "Helvite0"
  },
  { 
    id: "r9", 
    name: "Usepsyho", 
    text: "Всё выполнено быстро и профессионально, 10/10.",
    telegram: "Usepsyho"
  },
  { 
    id: "r10", 
    name: "Filling", 
    text: "Отличная работа, оценка 9/10, очень качественно.",
    telegram: "Filling_tg"
  },
  { 
    id: "r11", 
    name: "Arthur", 
    text: "Благодарю за профессиональный подход.",
    telegram: "Arthur_dsg"
  },
  { 
    id: "r12", 
    name: "Kupiz", 
    text: "Всё выполнено чётко и качественно.",
    telegram: "Kupiz"
  },
  { 
    id: "r13", 
    name: "Du", 
    text: "Полностью доволен результатом, получил всё что хотел.",
    telegram: "Du_tg"
  },
  { 
    id: "r14", 
    name: "ZetaMert", 
    text: "Всё отлично, работа выполнена качественно.",
    telegram: "ZetaMert"
  },
  { 
    id: "r15", 
    name: "Rare", 
    text: "Работа выполнена в указанные сроки, даже быстрее. Рекомендую специалиста @Rivaldsg.",
    telegram: "Rare_user"
  },
  { 
    id: "r16", 
    name: "Xyi v tapke", 
    text: "Отличный результат, очень доволен.",
    telegram: "xyi_v_tapke"
  },
  { 
    id: "r17", 
    name: "Yvonne", 
    text: "Работа выполнена именно так, как я и хотел.",
    telegram: "Yvonne_dsg"
  },
  { 
    id: "r18", 
    name: "Wised", 
    text: "Заказывал баннер и аватарку — рекомендую специалиста @Rivaldsg, работа выполнена профессионально.",
    telegram: "Wised_tg"
  },
  { 
    id: "r19", 
    name: "Zahar", 
    text: "@Rivaldsg оперативно выполнил заказ, всё чётко и быстро.",
    telegram: "Zahar_user"
  }
];

// Базовые цены в USD
const BASE_PRICES = [
  { id: 1, service: "Аватарка", priceUSD: 5 },
  { id: 2, service: "Превью", priceUSD: 5 },
  { id: 3, service: "Баннеры", priceUSD: 5 },
  { id: 4, service: "Логотип", priceUSD: 5 },
];

const SERVICES_TRANSLATIONS = {
  ru: {
    "Аватарка": "Аватарка",
    "Превью": "Превью",
    "Баннеры": "Баннеры",
    "Логотип": "Логотип"
  },
  en: {
    "Аватарка": "Avatar",
    "Превью": "Preview",
    "Баннеры": "Banner",
    "Логотип": "Logo"
  },
  ua: {
    "Аватарка": "Аватарка",
    "Превью": "Прев'ю",
    "Баннеры": "Банер",
    "Логотип": "Логотип"
  },
  kz: {
    "Аватарка": "Аватар",
    "Превью": "Алдын ала қарау",
    "Баннеры": "Баннер",
    "Логотип": "Логотипі"
  },
  by: {
    "Аватарка": "Аватарка",
    "Превью": "Папярэдні прагляд",
    "Баннеры": "Банэр",
    "Логотип": "Лагатып"
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS.GALLERY);
  const [theme, setTheme] = useState(THEMES.DARK);
  const [language, setLanguage] = useState("ru");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Аватарки");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme");
    if (savedTheme && THEMES[savedTheme.toUpperCase()]) {
      setTheme(THEMES[savedTheme.toUpperCase()]);
    }
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("appLanguage");
    if (savedLanguage && TEXTS[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem("appCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  useEffect(() => {
    localStorage.setItem("appCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const categories = GALLERY_CATEGORIES_TRANSLATIONS[language];
    if (categories && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [language]);

  const saveTheme = (themeId) => {
    localStorage.setItem("appTheme", themeId);
  };

  const saveLanguage = (lang) => {
    localStorage.setItem("appLanguage", lang);
  };

  const currencyInfo = LANGUAGE_TO_CURRENCY[language];
  const t = TEXTS[language];
  const labels = TAB_LABELS[language];
  const galleryCategories = GALLERY_CATEGORIES_TRANSLATIONS[language] || GALLERY_CATEGORIES_TRANSLATIONS.ru;
  const faqItems = FAQ_TRANSLATIONS[language] || FAQ_TRANSLATIONS.ru;
  const aboutMe = ABOUT_ME_TRANSLATIONS[language] || ABOUT_ME_TRANSLATIONS.ru;
  const galleryItems = GALLERY_TRANSLATIONS[language] || GALLERY_TRANSLATIONS.ru;
  const zoomHint = ZOOM_HINT_TRANSLATIONS[language] || ZOOM_HINT_TRANSLATIONS.ru;

  const convertPrice = (priceUSD) => {
    const rate = EXCHANGE_RATES[currencyInfo.code];
    return Math.round(priceUSD * rate);
  };

  const formatPrice = (priceUSD) => {
    const converted = convertPrice(priceUSD);
    return `${converted} ${currencyInfo.symbol}`;
  };

  const getCurrencyHint = () => {
    const hintTemplate = t.pricingCurrencyHint;
    const rate = EXCHANGE_RATES[currencyInfo.code];
    const symbol = currencyInfo.symbol;
    
    return hintTemplate
      .replace("{currency}", symbol)
      .replace("{rate}", rate)
      .replace("{currency}", symbol);
  };

  const getTranslatedServices = () => {
    return BASE_PRICES.map(item => ({
      ...item,
      translatedService: SERVICES_TRANSLATIONS[language][item.service] || item.service
    }));
  };

  const addToCart = (service) => {
    const existingItem = cart.find(item => item.id === service.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === service.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { 
        ...service, 
        quantity: 1,
        priceUSD: service.priceUSD
      }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.priceUSD * item.quantity), 0);
    const discount = totalItems >= 2 ? subtotal * 0.1 : 0;
    return {
      subtotal: subtotal,
      discount: discount,
      total: subtotal - discount,
      totalItems: totalItems
    };
  };

  const openTelegramProfile = (username) => {
    window.open(`https://t.me/${username}`, "_blank");
  };

  const toggleTheme = () => {
    const themeKeys = Object.keys(THEMES);
    const currentIndex = themeKeys.findIndex(key => THEMES[key].id === theme.id);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    const newTheme = THEMES[themeKeys[nextIndex]];
    setTheme(newTheme);
    saveTheme(newTheme.id);
  };

  const selectTheme = (themeObj) => {
    setTheme(themeObj);
    saveTheme(themeObj.id);
    setShowThemeMenu(false);
  };

  const toggleLangMenu = () => {
    setShowLangMenu(prev => !prev);
    setShowThemeMenu(false);
  };

  const toggleThemeMenu = () => {
    setShowThemeMenu(prev => !prev);
    setShowLangMenu(false);
  };

  const handleLangChange = (lang) => {
    setLanguage(lang);
    saveLanguage(lang);
    setShowLangMenu(false);
  };

  const toggleFaq = (index) => {
    if (expandedFaqIndex === index) {
      setExpandedFaqIndex(null);
    } else {
      setExpandedFaqIndex(index);
    }
  };

  const handleBottomButton = () => {
    if (activeTab === TABS.AI) {
      alert(t.aiAlert);
    } else if (activeTab === TABS.CART && cart.length > 0) {
      const cartTotal = getCartTotal();
      const servicesList = cart.map(item => 
        `${item.translatedService || item.service} x${item.quantity}`
      ).join(', ');
      
      const message = encodeURIComponent(
        `Привет! Хочу заказать из корзины:\n` +
        `${servicesList}\n` +
        `Итоговая сумма: ${formatPrice(cartTotal.total)}\n` +
        `Язык интерфейса: ${labels[TABS.ABOUT_FAQ] === "Обо мне & FAQ" ? "русский" : language}`
      );
      
      window.open(`https://t.me/Rivaldsg?text=${message}`, "_blank");
    } else {
      let serviceType = "дизайн";
      if (activeTab === TABS.PRICING) {
        serviceType = "услугу из прайса";
      } else if (activeTab === TABS.GALLERY) {
        serviceType = "работу из галереи";
      }
      
      const message = encodeURIComponent(
        `Привет! Я с твоего портфолио. Хочу заказать ${serviceType}. ` +
        `Язык интерфейса: ${labels[TABS.ABOUT_FAQ] === "Обо мне & FAQ" ? "русский" : language}`
      );
      
      window.open(`https://t.me/Rivaldsg?text=${message}`, "_blank");
    }
  };

  const handleCardMouseMove = (e, id) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((centerY - y) / centerY) * 5;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    setHoveredCard(id);
  };

  const handleCardMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    setHoveredCard(null);
  };

  const SkeletonCard = () => (
    <div 
      className="project-card skeleton" 
      style={{ 
        background: theme.colors.card,
        border: `1px solid ${theme.colors.border}`,
        boxShadow: theme.colors.shadow
      }}
    >
      <div className="project-thumb-wrapper skeleton" style={{ background: theme.colors.border }}></div>
      <div className="project-info">
        <div className="skeleton" style={{ 
          width: '80%', 
          height: '12px', 
          background: theme.colors.border,
          marginBottom: '6px',
          borderRadius: '4px'
        }}></div>
        <div className="skeleton" style={{ 
          width: '60%', 
          height: '10px', 
          background: theme.colors.border,
          borderRadius: '4px'
        }}></div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case TABS.GALLERY:
        return (
          <div className="card" style={{ 
            background: theme.colors.card, 
            boxShadow: theme.colors.shadow,
            animation: 'fadeIn 0.4s ease'
          }}>
            <h2 className="section-title" style={{ 
              color: theme.colors.text,
              animation: 'slideDown 0.4s ease'
            }}>{t.galleryTitle}</h2>
            <p className="section-subtitle" style={{ 
              color: theme.colors.textSecondary,
              animation: 'slideDown 0.4s ease 0.1s forwards',
              opacity: 0
            }}>{t.gallerySubtitle}</p>
            
            <div 
              className="tabs" 
              style={{ 
                borderBottom: `1px solid ${theme.colors.border}`,
                background: theme.colors.secondary,
                borderRadius: '8px',
                padding: '4px',
                marginBottom: '16px',
                animation: 'slideDown 0.4s ease 0.2s forwards',
                opacity: 0
              }}
            >
              {galleryCategories.map((cat, index) => (
                <button
                  key={cat}
                  className={"tab-btn" + (cat === activeCategory ? " tab-btn-active" : "")}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    color: cat === activeCategory ? theme.colors.accent : theme.colors.textSecondary,
                    borderBottom: cat === activeCategory ? `2px solid ${theme.colors.accent}` : 'none',
                    background: 'transparent',
                    opacity: 0,
                    animation: 'slideUp 0.3s ease forwards',
                    animationDelay: `calc(${index} * 0.05s)`
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <SwiperSlide key={`skeleton-${index}`} style={{ width: 220 }}>
                    <SkeletonCard />
                  </SwiperSlide>
                ))
              ) : (
                galleryItems
                  .filter((p) => p.category === activeCategory)
                  .map((p, index) => (
                  <SwiperSlide key={p.id} style={{ width: 220 }}>
                    <div 
                      className="project-card" 
                      onClick={() => setSelectedImage(p)} 
                      onMouseMove={(e) => handleCardMouseMove(e, p.id)}
                      onMouseLeave={handleCardMouseLeave}
                      style={{ 
                        cursor: "pointer",
                        background: theme.colors.card,
                        border: `1px solid ${theme.colors.border}`,
                        boxShadow: hoveredCard === p.id 
                          ? `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 20px ${theme.colors.accent}40`
                          : theme.colors.shadow,
                        transform: hoveredCard === p.id 
                          ? 'perspective(1000px) rotateX(5deg) rotateY(5deg) scale3d(1.05, 1.05, 1.05)' 
                          : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        opacity: 0,
                        animation: 'slideUp 0.3s ease forwards',
                        animationDelay: `calc(${index} * 0.05s)`
                      }}
                    >
                      <div className="project-thumb-wrapper">
                        <img 
                          src={p.image} 
                          alt={p.title} 
                          className="project-thumb-img"
                          style={{
                            transform: hoveredCard === p.id ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.5s ease'
                          }}
                        />
                      </div>
                      <div className="project-info">
                        <div className="project-title" style={{ color: theme.colors.text }}>{p.title}</div>
                        <p className="hint-text" style={{ color: theme.colors.textSecondary }}>{p.description}</p>
                        <span className="hint-text" style={{ color: theme.colors.accent }}>{zoomHint}</span>
                      </div>
                    </div>
                  </SwiperSlide>
                ))
              )}
            </Swiper>
            <p className="hint-text" style={{ 
              color: theme.colors.textSecondary,
              animation: 'slideUp 0.4s ease 0.3s forwards',
              opacity: 0
            }}>{t.galleryHint}</p>
          </div>
        );

      case TABS.REVIEWS:
        return (
          <div className="card" style={{ 
            background: theme.colors.card, 
            boxShadow: theme.colors.shadow,
            animation: 'fadeIn 0.4s ease'
          }}>
            <h2 className="section-title" style={{ 
              color: theme.colors.text,
              animation: 'slideDown 0.4s ease'
            }}>{t.reviewsTitle}</h2>
            <p className="section-subtitle" style={{ 
              color: theme.colors.textSecondary,
              animation: 'slideDown 0.4s ease 0.1s forwards',
              opacity: 0
            }}>{t.reviewsSubtitle}</p>
            <Swiper spaceBetween={12} slidesPerView={"auto"}>
              {REVIEWS_ITEMS.map((r, index) => (
                <SwiperSlide key={r.id} style={{ width: 250 }}>
                  <div 
                    className="card" 
                    style={{ 
                      background: theme.colors.card,
                      border: `1px solid ${theme.colors.border}`,
                      boxShadow: theme.colors.shadow,
                      opacity: 0,
                      animation: 'slideUp 0.3s ease forwards',
                      animationDelay: `calc(${index} * 0.03s)`
                    }}
                  >
                    <div style={{ 
                      fontWeight: "bold", 
                      fontSize: "24px", 
                      marginBottom: "4px", 
                      color: theme.colors.accent 
                    }}>
                      {r.name[0]}
                    </div>
                    <div 
                      onClick={() => openTelegramProfile(r.telegram)}
                      style={{ 
                        color: theme.colors.accent,
                        cursor: "pointer",
                        fontWeight: "bold",
                        marginBottom: "4px",
                        textDecoration: "underline",
                        transition: "opacity 0.2s"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                    >
                      {r.name}
                    </div>
                    <div className="hint-text" style={{ color: theme.colors.textSecondary }}>{r.text}</div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button 
              className="secondary-btn" 
              style={{ 
                marginTop: 10,
                background: theme.colors.secondary,
                color: theme.colors.text,
                border: `1px solid ${theme.colors.border}`,
                animation: 'slideUp 0.4s ease 0.2s forwards',
                opacity: 0
              }}
              onClick={() => window.open(`https://t.me/Rivaldsg`, "_blank")}
            >
              {t.reviewsAddButton}
            </button>
          </div>
        );

      case TABS.PRICING:
        const translatedServices = getTranslatedServices();
        return (
          <div className="card" style={{ 
            background: theme.colors.card, 
            boxShadow: theme.colors.shadow,
            animation: 'fadeIn 0.4s ease'
          }}>
            <h2 className="section-title" style={{ 
              color: theme.colors.text,
              animation: 'slideDown 0.4s ease'
            }}>{t.pricingTitle}</h2>
            <div className="currency-hint" style={{ 
              fontSize: "12px", 
              color: theme.colors.textSecondary, 
              marginBottom: "10px",
              animation: 'slideDown 0.4s ease 0.1s forwards',
              opacity: 0
            }}>
              {getCurrencyHint()}
            </div>
            <ul className="list">
              {translatedServices.map((item, index) => (
                <li key={item.id} style={{ 
                  color: theme.colors.text, 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                  padding: '4px 0',
                  opacity: 0,
                  animation: 'slideUp 0.3s ease forwards',
                  animationDelay: `calc(${index} * 0.05s)`
                }}>
                  <span>
                    {item.translatedService} — от {formatPrice(item.priceUSD)}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    style={{
                      background: theme.colors.accent,
                      color: theme.colors.buttonText,
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    {t.addToCart}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );

      case TABS.CART:
        const cartTotal = getCartTotal();
        const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        return (
          <div className="card" style={{ 
            background: theme.colors.card, 
            boxShadow: theme.colors.shadow,
            animation: 'fadeIn 0.4s ease'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '12px',
              animation: 'slideDown 0.4s ease'
            }}>
              <h2 className="section-title" style={{ color: theme.colors.text }}>
                {t.cartTitle} {cartItemsCount > 0 && `(${cartItemsCount})`}
              </h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  style={{
                    background: 'transparent',
                    color: theme.colors.accent,
                    border: `1px solid ${theme.colors.accent}`,
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  {t.clearCart}
                </button>
              )}
            </div>
            
            {cart.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px',
                color: theme.colors.textSecondary,
                animation: 'fadeIn 0.5s ease'
              }}>
                {t.cartEmpty}
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ 
                    fontSize: '13px', 
                    color: theme.colors.textSecondary,
                    marginBottom: '8px',
                    animation: 'slideDown 0.3s ease'
                  }}>
                    {t.cartItems}
                  </h3>
                  {cart.map((item, index) => (
                    <div key={item.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: `1px solid ${theme.colors.border}`,
                      opacity: 0,
                      animation: 'slideUp 0.3s ease forwards',
                      animationDelay: `calc(${index} * 0.05s)`
                    }}>
                      <div>
                        <div style={{ color: theme.colors.text, fontSize: '12px' }}>
                          {item.translatedService || item.service}
                        </div>
                        <div style={{ fontSize: '11px', color: theme.colors.textSecondary }}>
                          {formatPrice(item.priceUSD)} × {item.quantity}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{
                              background: theme.colors.secondary,
                              color: theme.colors.text,
                              border: `1px solid ${theme.colors.border}`,
                              borderRadius: '4px',
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            -
                          </button>
                          <span style={{ 
                            color: theme.colors.text,
                            fontSize: '12px',
                            minWidth: '20px',
                            textAlign: 'center'
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{
                              background: theme.colors.secondary,
                              color: theme.colors.text,
                              border: `1px solid ${theme.colors.border}`,
                              borderRadius: '4px',
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div style={{ 
                          color: theme.colors.accent,
                          fontSize: '12px',
                          minWidth: '60px',
                          textAlign: 'right'
                        }}>
                          {formatPrice(item.priceUSD * item.quantity)}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: 'transparent',
                            color: theme.colors.textSecondary,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '4px'
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{
                  background: theme.colors.secondary,
                  borderRadius: '8px',
                  padding: '12px',
                  border: `1px solid ${theme.colors.border}`,
                  animation: 'slideUp 0.4s ease'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '4px'
                  }}>
                    <span style={{ color: theme.colors.textSecondary, fontSize: '12px' }}>{t.total}:</span>
                    <span style={{ color: theme.colors.text, fontSize: '12px' }}>
                      {formatPrice(cartTotal.subtotal)}
                    </span>
                  </div>
                  
                  {cartTotal.discount > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                      animation: 'pulse 0.5s ease'
                    }}>
                      <span style={{ color: '#10b981', fontSize: '11px' }}>
                        {t.discountNote} ({cartTotal.totalItems} шт.):
                      </span>
                      <span style={{ color: '#10b981', fontSize: '11px' }}>
                        -{formatPrice(cartTotal.discount)}
                      </span>
                    </div>
                  )}
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: `1px solid ${theme.colors.border}`
                  }}>
                    <span style={{ color: theme.colors.accent, fontSize: '14px', fontWeight: 'bold' }}>
                      {t.finalPrice}:
                    </span>
                    <span style={{ color: theme.colors.accent, fontSize: '14px', fontWeight: 'bold' }}>
                      {formatPrice(cartTotal.total)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case TABS.ABOUT_FAQ:
        return (
          <div className="card" style={{ 
            background: theme.colors.card, 
            boxShadow: theme.colors.shadow,
            animation: 'fadeIn 0.5s ease'
          }}>
            <h2 className="section-title" style={{ 
              color: theme.colors.text,
              animation: 'slideDown 0.4s ease'
            }}>{t.aboutFaqTitle}</h2>
            
            {/* Секция "Обо мне" */}
            <div style={{ 
              marginBottom: '32px',
              animation: 'slideUp 0.5s ease 0.1s forwards',
              opacity: 0
            }}>
              <h3 style={{ 
                color: theme.colors.accent, 
                fontSize: '16px',
                marginBottom: '12px'
              }}>
                {aboutMe.title}
              </h3>
              <div 
                style={{ 
                  color: theme.colors.textSecondary,
                  whiteSpace: 'pre-line',
                  lineHeight: '1.6',
                  fontSize: '14px',
                  animation: 'fadeIn 0.8s ease 0.2s forwards',
                  opacity: 0
                }}
              >
                {aboutMe.content}
              </div>
            </div>

            {/* Мои соцсети */}
            <div style={{
              animation: 'slideUp 0.5s ease 0.4s forwards',
              opacity: 0,
              marginTop: '30px'
            }}>
              <h3 style={{ 
                color: theme.colors.accent, 
                fontSize: '16px',
                marginBottom: '10px',
                textAlign: 'center'
              }}>
                {aboutMe.socialTitle}
              </h3>
              
              <div style={{
                color: theme.colors.textSecondary,
                fontSize: '14px',
                textAlign: 'center',
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                {aboutMe.socialDescription}
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '25px',
                flexWrap: 'wrap',
                marginBottom: '20px'
              }}>
                {/* TikTok */}
                <a href="https://www.tiktok.com/@rival.design" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.2) translateY(-3px)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  }}>
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" 
                      alt="TikTok"
                      style={{ width: '30px', height: '30px' }}
                    />
                  </div>
                </a>

                {/* Telegram */}
                <a href="https://t.me/Rivaldsgn" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.2) translateY(-3px)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  }}>
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" 
                      alt="Telegram"
                      style={{ width: '30px', height: '30px' }}
                    />
                  </div>
                </a>

                {/* YouTube */}
                <a href="https://www.youtube.com/@RivalDesign" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.2) translateY(-3px)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  }}>
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" 
                      alt="YouTube"
                      style={{ width: '30px', height: '30px' }}
                    />
                  </div>
                </a>

                {/* Pinterest */}
                <a href="https://ru.pinterest.com/lotosdesign00/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.2) translateY(-3px)';
                  }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                  }}>
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/174/174863.png" 
                      alt="Pinterest"
                      style={{ width: '30px', height: '30px' }}
                    />
                  </div>
                </a>
              </div>
              
              <div style={{
                color: theme.colors.textSecondary,
                fontSize: '12px',
                textAlign: 'center',
                marginTop: '15px',
                fontStyle: 'italic',
                opacity: 0.8
              }}>
                {aboutMe.socialWait}
              </div>
            </div>
            
            {/* Секция "FAQ" с аккордеоном */}
            <div style={{
              animation: 'slideUp 0.5s ease 0.2s forwards',
              opacity: 0
            }}>
              <h3 style={{ 
                color: theme.colors.accent, 
                fontSize: '16px',
                marginBottom: '16px'
              }}>
                ❓ {t.faqTitle}
              </h3>
              <div className="faq-list">
                {faqItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="faq-item"
                    style={{ 
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '8px',
                      marginBottom: '10px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      opacity: 0,
                      animation: 'slideUp 0.3s ease forwards',
                      animationDelay: `calc(${index} * 0.05s)`
                    }}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: expandedFaqIndex === index 
                          ? theme.colors.accent + '10' 
                          : theme.colors.secondary,
                        border: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <span style={{ 
                        color: expandedFaqIndex === index 
                          ? theme.colors.accent 
                          : theme.colors.text,
                        fontSize: '14px',
                        fontWeight: '500',
                        textAlign: 'left'
                      }}>
                        {item.question}
                      </span>
                      <span style={{ 
                        color: theme.colors.accent,
                        fontSize: '18px',
                        transition: 'transform 0.3s ease',
                        transform: expandedFaqIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}>
                        ▼
                      </span>
                    </button>
                    
                    {expandedFaqIndex === index && (
                      <div 
                        style={{
                          padding: '16px',
                          background: theme.colors.card,
                          color: theme.colors.textSecondary,
                          whiteSpace: 'pre-line',
                          lineHeight: '1.5',
                          fontSize: '13px',
                          borderTop: `1px solid ${theme.colors.border}`,
                          animation: 'slideDown 0.3s ease'
                        }}
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`app-root theme-${theme.id}`} style={{ 
      background: theme.colors.primary,
      position: 'relative'
    }}>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .section-title {
          animation: slideDown 0.4s ease;
        }
        
        .card {
          animation: fadeIn 0.4s ease;
        }
        
        .list li {
          opacity: 0;
          animation: slideUp 0.3s ease forwards;
        }
        
        .cart-item {
          opacity: 0;
          animation: slideUp 0.3s ease forwards;
        }
        
        .faq-item {
          opacity: 0;
          animation: slideUp 0.3s ease forwards;
        }
        
        .project-card {
          transition: all 0.3s ease;
        }
        
        button {
          transition: all 0.2s ease;
        }
        
        button:hover {
          transform: translateY(-1px);
        }
      `}</style>
      
      <div className="app-shell">
        <div 
          className="top-bar" 
          style={{ 
            background: theme.colors.secondary,
            borderBottom: `1px solid ${theme.colors.border}`,
            padding: '8px 16px',
            minHeight: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'slideDown 0.3s ease'
          }}
        >
          <div className="top-bar-left" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ paddingLeft: '20px' }}>
              <span className="app-title" style={{ 
                color: theme.colors.text, 
                fontSize: '18px',
                fontWeight: 'bold',
                animation: 'slideDown 0.4s ease'
              }}>{t.appTitle}</span>
              <span className="app-subtitle" style={{ 
                color: theme.colors.textSecondary,
                fontSize: '14px',
                marginLeft: '8px',
                animation: 'slideDown 0.4s ease 0.1s forwards',
                opacity: 0
              }}>{t.appSubtitle}</span>
            </div>
          </div>

          <div className="controls" style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: "relative" }}>
              <button 
                className="icon-btn" 
                onClick={toggleThemeMenu}
                style={{ 
                  background: theme.colors.accent,
                  color: theme.colors.buttonText,
                  border: `1px solid ${theme.colors.border}`,
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {theme.icon}
              </button>

              {showThemeMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: 0,
                    background: theme.colors.card,
                    borderRadius: "12px",
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    boxShadow: theme.colors.shadow,
                    border: `1px solid ${theme.colors.border}`,
                    zIndex: 20,
                    minWidth: "140px",
                    animation: 'slideDown 0.2s ease'
                  }}
                >
                  {Object.values(THEMES).map((themeOption) => (
                    <button
                      key={themeOption.id}
                      className="theme-option"
                      onClick={() => selectTheme(themeOption)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: theme.id === themeOption.id ? theme.colors.accent + "20" : "transparent",
                        border: "none",
                        color: theme.id === themeOption.id ? theme.colors.accent : theme.colors.text,
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.accent + "10"}
                      onMouseLeave={(e) => e.currentTarget.style.background = theme.id === themeOption.id ? theme.colors.accent + "20" : "transparent"}
                    >
                      <span style={{ fontSize: "16px" }}>{themeOption.icon}</span>
                      <span>{themeOption.name}</span>
                      {theme.id === themeOption.id && (
                        <span style={{ marginLeft: "auto", color: theme.colors.accent }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: "relative" }}>
              <button 
                className="icon-btn" 
                onClick={toggleLangMenu}
                style={{ 
                  background: theme.colors.secondary,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                🌐
              </button>

              {showLangMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: 0,
                    background: theme.colors.card,
                    borderRadius: "12px",
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    boxShadow: theme.colors.shadow,
                    border: `1px solid ${theme.colors.border}`,
                    zIndex: 10,
                    minWidth: "140px",
                    animation: 'slideDown 0.2s ease'
                  }}
                >
                  {Object.entries(LANGUAGE_TO_CURRENCY).map(([langCode, currency]) => (
                    <button
                      key={langCode}
                      className="tab-btn lang-option"
                      onClick={() => handleLangChange(langCode)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: language === langCode ? theme.colors.accent + "20" : "transparent",
                        border: "none",
                        color: language === langCode ? theme.colors.accent : theme.colors.text,
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = theme.colors.accent + "10"}
                      onMouseLeave={(e) => e.currentTarget.style.background = language === langCode ? theme.colors.accent + "20" : "transparent"}
                    >
                      <span>
                        {langCode === "ru" && "🇷🇺"}
                        {langCode === "ua" && "🇺🇦"}
                        {langCode === "en" && "🇺🇸"}
                        {langCode === "kz" && "🇰🇿"}
                        {langCode === "by" && "🇧🇾"}
                      </span>
                      <span>
                        {langCode === "ru" && "Русский"}
                        {langCode === "ua" && "Українська"}
                        {langCode === "en" && "English"}
                        {langCode === "kz" && "Қазақша"}
                        {langCode === "by" && "Беларуская"}
                      </span>
                      {language === langCode && (
                        <span style={{ marginLeft: "auto", color: theme.colors.accent }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <nav 
          className="tabs" 
          style={{ 
            borderBottom: `1px solid ${theme.colors.border}`,
            background: theme.colors.secondary,
            animation: 'slideDown 0.3s ease 0.1s forwards',
            opacity: 0
          }}
        >
          {Object.values(TABS).map((tab, index) => (
            <button
              key={tab}
              className={"tab-btn" + (activeTab === tab ? " tab-btn-active" : "")}
              onClick={() => setActiveTab(tab)}
              style={{
                color: activeTab === tab ? theme.colors.accent : theme.colors.textSecondary,
                borderBottom: activeTab === tab ? `2px solid ${theme.colors.accent}` : 'none',
                background: 'transparent',
                opacity: 0,
                animation: 'slideDown 0.3s ease forwards',
                animationDelay: `calc(${index} * 0.05s)`
              }}
            >
              {labels[tab]}
            </button>
          ))}
        </nav>

        <main className="tab-content">
          {renderContent()}
        </main>

        {/* Кнопка внизу (как в старом коде) */}
        <button
          className="primary-btn"
          onClick={handleBottomButton}
          style={{
            background: theme.colors.button,
            color: theme.colors.buttonText,
            border: `1px solid ${theme.colors.accent}`,
            padding: '12px 24px',
            borderRadius: '8px',
            margin: '20px 16px',
            width: 'calc(100% - 32px)',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            animation: 'slideUp 0.4s ease 0.2s forwards',
            opacity: 0
          }}
        >
          {activeTab === TABS.AI ? t.bottomGenerate : 
           activeTab === TABS.CART && cart.length > 0 ? t.orderAll : t.bottomOrder}
        </button>
      </div>

      {selectedImage && (
        <div 
          className="image-modal-backdrop" 
          onClick={() => setSelectedImage(null)}
          style={{ 
            background: 'rgba(0,0,0,0.9)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div 
            className="image-modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              background: theme.colors.card,
              border: `1px solid ${theme.colors.border}`,
              boxShadow: theme.colors.shadow,
              animation: 'slideUp 0.3s ease'
            }}
          >
            <button 
              className="icon-btn image-modal-close" 
              onClick={() => setSelectedImage(null)}
              style={{ 
                background: theme.colors.accent,
                color: theme.colors.buttonText,
                border: `1px solid ${theme.colors.border}`
              }}
            >
              ✖
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="image-modal-img"
            />
            <div className="image-modal-text">
              <h3 style={{ color: theme.colors.text }}>{selectedImage.title}</h3>
              <p style={{ color: theme.colors.textSecondary }}>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
