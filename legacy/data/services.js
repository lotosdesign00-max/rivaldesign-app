/**
 * SERVICES — Available design services with pricing
 */

export const SERVICES = [
  { id: 1, icon: "●", key: "avatar", priceUSD: 5, ru: "Аватарка", en: "Avatar", ua: "Аватарка", kz: "Аватар", by: "Аватарка", descRu: "Уникальный аватар в твоём стиле", descEn: "Unique avatar in your style", timeRu: "1–2 дня", timeEn: "1–2 days", features: ["PNG + PSD", "3 правки", "Исходник"] },
  { id: 2, icon: "▶", key: "preview", priceUSD: 5, ru: "Превью", en: "Preview", ua: "Прев'ю", kz: "Превью", by: "Прэв'ю", descRu: "YouTube / Twitch превью", descEn: "YouTube / Twitch thumbnail", timeRu: "1 день", timeEn: "1 day", features: ["PNG 1280×720", "3 варианта", "PSD файл"] },
  { id: 3, icon: "▬", key: "banner", priceUSD: 5, ru: "Баннер", en: "Banner", ua: "Банер", kz: "Баннер", by: "Банер", descRu: "Шапка канала / профиля", descEn: "Channel / profile header", timeRu: "1–2 дня", timeEn: "1–2 days", features: ["PNG + PSD", "Адаптив", "3 правки"] },
  { id: 4, icon: "✦", key: "logo", priceUSD: 5, ru: "Логотип", en: "Logo", ua: "Логотип", kz: "Логотип", by: "Лагатып", descRu: "Логотип для бренда", descEn: "Logo for your brand", timeRu: "2–3 дня", timeEn: "2–3 days", features: ["SVG + PNG", "Все форматы", "5 правок"] },
  { id: 5, icon: "◉", key: "pack", priceUSD: 18, ru: "Полный пак", en: "Full Pack", ua: "Повний пак", kz: "Толық пак", by: "Поўны пак", descRu: "Аватар + превью + баннер", descEn: "Avatar + preview + banner", timeRu: "2–4 дня", timeEn: "2–4 days", features: ["3 работы", "Приоритет", "Исходники"] },
];

export const PROMO_CODES = {
  "AVATARPRO": { kind: "course", courseId: "c3", desc: "Аватарки PRO", title: "Аватарки PRO" },
};

export const DESIGN_PACK_CONFIG = {
  GOOGLE_DRIVE_FOLDER_ID: "YOUR_FOLDER_ID_HERE",
  GOOGLE_API_KEY: "YOUR_API_KEY_HERE",
  TELEGRAM_CHANNEL: "Rivaldsgn",
  TELEGRAM_CONTACT: "Rivaldsg",
};

export const MOCK_DESIGN_PACK = {
  fonts: [
    { id: "f1", name: "Montserrat Bold.ttf", size: "245 KB", category: "fonts", preview: "https://picsum.photos/seed/font1/400/200", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "f2", name: "Bebas Neue.ttf", size: "189 KB", category: "fonts", preview: "https://picsum.photos/seed/font2/400/200", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "f3", name: "Roboto Condensed.ttf", size: "312 KB", category: "fonts", preview: "https://picsum.photos/seed/font3/400/200", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "f4", name: "Raleway Light.ttf", size: "267 KB", category: "fonts", preview: "https://picsum.photos/seed/font4/400/200", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
  ],
  textures: [
    { id: "t1", name: "Grunge Texture Pack.zip", size: "45 MB", category: "textures", preview: "https://picsum.photos/seed/tex1/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "t2", name: "Paper Textures.zip", size: "78 MB", category: "textures", preview: "https://picsum.photos/seed/tex2/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "t3", name: "Metal Surfaces.zip", size: "92 MB", category: "textures", preview: "https://picsum.photos/seed/tex3/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "t4", name: "Fabric Patterns.zip", size: "34 MB", category: "textures", preview: "https://picsum.photos/seed/tex4/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
  ],
  brushes: [
    { id: "b1", name: "Watercolor Brushes.abr", size: "12 MB", category: "brushes", preview: "https://picsum.photos/seed/brush1/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "b2", name: "Sketch Brushes.abr", size: "8 MB", category: "brushes", preview: "https://picsum.photos/seed/brush2/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "b3", name: "Smoke Brushes.abr", size: "15 MB", category: "brushes", preview: "https://picsum.photos/seed/brush3/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "b4", name: "Ink Splatter.abr", size: "6 MB", category: "brushes", preview: "https://picsum.photos/seed/brush4/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
  ],
  templates: [
    { id: "p1", name: "Logo Template Pack.psd", size: "125 MB", category: "templates", preview: "https://picsum.photos/seed/temp1/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "p2", name: "Social Media Kit.psd", size: "89 MB", category: "templates", preview: "https://picsum.photos/seed/temp2/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "p3", name: "YouTube Thumbnail Bundle.psd", size: "156 MB", category: "templates", preview: "https://picsum.photos/seed/temp3/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "p4", name: "Brand Identity Kit.ai", size: "67 MB", category: "templates", preview: "https://picsum.photos/seed/temp4/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
  ],
  mockups: [
    { id: "m1", name: "T-Shirt Mockups.psd", size: "234 MB", category: "mockups", preview: "https://picsum.photos/seed/mock1/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "m2", name: "Business Card Mockup.psd", size: "145 MB", category: "mockups", preview: "https://picsum.photos/seed/mock2/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "m3", name: "Laptop Screen Mockup.psd", size: "189 MB", category: "mockups", preview: "https://picsum.photos/seed/mock3/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "m4", name: "Phone Mockup Pack.psd", size: "267 MB", category: "mockups", preview: "https://picsum.photos/seed/mock4/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
  ],
  graphics: [
    { id: "g1", name: "Abstract Shapes.eps", size: "23 MB", category: "graphics", preview: "https://picsum.photos/seed/graph1/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "g2", name: "Icon Set 500+.ai", size: "45 MB", category: "graphics", preview: "https://picsum.photos/seed/graph2/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "g3", name: "Geometric Patterns.svg", size: "12 MB", category: "graphics", preview: "https://picsum.photos/seed/graph3/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
    { id: "g4", name: "Vector Illustrations.ai", size: "67 MB", category: "graphics", preview: "https://picsum.photos/seed/graph4/400/400", downloadUrl: "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID" },
  ],
};
