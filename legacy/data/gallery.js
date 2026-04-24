/**
 * GALLERY — Portfolio gallery data with localized categories
 * Includes local asset resolution for picsum.photos placeholders.
 */

// Prefer real local works over picsum placeholders in gallery.
const LOCAL_GALLERY_ASSETS = {
  avatars: [
    "/images/optimized/podborka-av-1.jpg",
    "/images/optimized/podborka-av-2.jpg",
    "/images/optimized/podborka-av-3.jpg",
    "/images/optimized/podborka-av-4.jpg",
    "/images/optimized/podborka-av-5.jpg",
  ],
  previews: [
    "/images/optimized/podborka-preview-1.jpg",
    "/images/optimized/podborka-preview-2.jpg",
    "/images/optimized/podborka-preview-3.jpg",
    "/images/optimized/podborka-preview-4.jpg",
    "/images/optimized/podborka-preview-5.jpg",
    "/images/optimized/preview-mockup.jpg",
  ],
};
LOCAL_GALLERY_ASSETS.banners = LOCAL_GALLERY_ASSETS.previews;
LOCAL_GALLERY_ASSETS.logos = LOCAL_GALLERY_ASSETS.avatars;

export function pickGalleryAsset(pool, index) {
  if (!Array.isArray(pool) || pool.length === 0) return "";
  return pool[index % pool.length];
}

function resolveLocalGalleryImage(item, index) {
  const id = String(item?.id || "");
  if (id.startsWith("a")) return pickGalleryAsset(LOCAL_GALLERY_ASSETS.avatars, index);
  if (id.startsWith("p")) return pickGalleryAsset(LOCAL_GALLERY_ASSETS.previews, index);
  if (id.startsWith("b")) return pickGalleryAsset(LOCAL_GALLERY_ASSETS.banners, index);
  if (id.startsWith("l")) return pickGalleryAsset(LOCAL_GALLERY_ASSETS.logos, index);
  return item?.img || "";
}

export const GALLERY = {
  ru: [
    { id: "a1", cat: "Аватарки", title: "Киберпанк аватар", desc: "Неоновое свечение и sci-fi эстетика", img: "https://picsum.photos/seed/rsa1/1080/1280", tags: ["neon", "cyber", "scifi"], popular: true, views: 1240 },
    { id: "a2", cat: "Аватарки", title: "Минимал аватар", desc: "Чистый геометрический минимализм", img: "https://picsum.photos/seed/rsa2/1080/1280", tags: ["minimal", "geo"], popular: false, views: 560 },
    { id: "a3", cat: "Аватарки", title: "Тёмный аватар", desc: "Мрачный атмосферный стиль", img: "https://picsum.photos/seed/rsa3/1080/1280", tags: ["dark", "moody"], popular: true, views: 980 },
    { id: "a4", cat: "Аватарки", title: "Градиент аватар", desc: "Плавные переходы, мягкие тона", img: "https://picsum.photos/seed/rsa4/1080/1280", tags: ["gradient", "soft"], popular: false, views: 430 },
    { id: "a5", cat: "Аватарки", title: "Anime аватар", desc: "Иллюстрация в аниме-стиле", img: "https://picsum.photos/seed/rsa5/1080/1280", tags: ["anime", "illustration"], popular: true, views: 2100 },
    { id: "a6", cat: "Аватарки", title: "Pixel аватар", desc: "Пиксельное ретро искусство", img: "https://picsum.photos/seed/rsa6/1080/1280", tags: ["pixel", "retro"], popular: false, views: 310 },
    { id: "p1", cat: "Превью", title: "YouTube превью Gaming", desc: "Эпичный геймерский дизайн", img: "https://picsum.photos/seed/rsp1/1080/1280", tags: ["youtube", "game"], popular: true, views: 3400 },
    { id: "p2", cat: "Превью", title: "Twitch превью", desc: "Стримерский дизайн с индивидуальностью", img: "https://picsum.photos/seed/rsp2/1080/1280", tags: ["twitch", "stream"], popular: false, views: 780 },
    { id: "p3", cat: "Превью", title: "Viral превью", desc: "Заставит кликать каждого", img: "/images/optimized/podborka-av-4.jpg", tags: ["viral", "bright"], popular: true, views: 5600 },
    { id: "p4", cat: "Превью", title: "Минимал превью", desc: "Элегантная лаконичность", img: "https://picsum.photos/seed/rsp4/1080/1280", tags: ["minimal", "clean"], popular: false, views: 290 },
    { id: "p5", cat: "Превью", title: "Dark превью", desc: "Тёмная тема, максимум атмосферы", img: "https://picsum.photos/seed/rsp5/1080/1280", tags: ["dark", "cinematic"], popular: true, views: 1870 },
    { id: "b1", cat: "Баннеры", title: "Twitch баннер PRO", desc: "Профессиональная шапка канала", img: "https://picsum.photos/seed/rsb1/1080/1280", tags: ["twitch", "channel"], popular: true, views: 2200 },
    { id: "b2", cat: "Баннеры", title: "Discord баннер", desc: "Уникальная серверная шапка", img: "https://picsum.photos/seed/rsb2/1080/1280", tags: ["discord"], popular: false, views: 650 },
    { id: "b3", cat: "Баннеры", title: "YouTube шапка 4K", desc: "Безупречный канальный арт", img: "https://picsum.photos/seed/rsb3/1080/1280", tags: ["youtube", "4k"], popular: true, views: 3100 },
    { id: "b4", cat: "Баннеры", title: "VK/TikTok баннер", desc: "Для соцсетей нового поколения", img: "https://picsum.photos/seed/rsb4/1080/1280", tags: ["vk", "tiktok"], popular: false, views: 410 },
    { id: "l1", cat: "Логотипы", title: "Gaming лого eSports", desc: "Победные символы для команд", img: "https://picsum.photos/seed/rsl1/1080/1280", tags: ["game", "esports", "logo"], popular: true, views: 4200 },
    { id: "l2", cat: "Логотипы", title: "Минимал лого", desc: "Современный геометрический бренд", img: "https://picsum.photos/seed/rsl2/1080/1280", tags: ["minimal", "geo", "logo"], popular: false, views: 740 },
    { id: "l3", cat: "Логотипы", title: "Неон лого", desc: "Светящийся знак в ночи", img: "https://picsum.photos/seed/rsl3/1080/1280", tags: ["neon", "glow", "logo"], popular: true, views: 1950 },
    { id: "l4", cat: "Логотипы", title: "3D лого PRO", desc: "Объёмный дизайн нового уровня", img: "https://picsum.photos/seed/rsl4/1080/1280", tags: ["3d", "volume", "logo"], popular: false, views: 580 },
    { id: "l5", cat: "Логотипы", title: "Mascot лого", desc: "Персонаж-маскот для бренда", img: "https://picsum.photos/seed/rsl5/1080/1280", tags: ["mascot", "character", "logo"], popular: true, views: 2800 },
  ],
  en: [
    { id: "a1", cat: "Avatars", title: "Cyberpunk Avatar", desc: "Neon glow sci-fi aesthetic", img: "https://picsum.photos/seed/rsa1/1080/1280", tags: ["neon", "cyber", "scifi"], popular: true, views: 1240 },
    { id: "a2", cat: "Avatars", title: "Minimal Avatar", desc: "Clean geometric minimalism", img: "https://picsum.photos/seed/rsa2/1080/1280", tags: ["minimal", "geo"], popular: false, views: 560 },
    { id: "a3", cat: "Avatars", title: "Dark Avatar", desc: "Moody atmospheric style", img: "https://picsum.photos/seed/rsa3/1080/1280", tags: ["dark", "moody"], popular: true, views: 980 },
    { id: "a4", cat: "Avatars", title: "Gradient Avatar", desc: "Smooth pastel transitions", img: "https://picsum.photos/seed/rsa4/1080/1280", tags: ["gradient", "soft"], popular: false, views: 430 },
    { id: "a5", cat: "Avatars", title: "Anime Avatar", desc: "Anime illustration style", img: "https://picsum.photos/seed/rsa5/1080/1280", tags: ["anime", "illustration"], popular: true, views: 2100 },
    { id: "a6", cat: "Avatars", title: "Pixel Avatar", desc: "Retro pixel art", img: "https://picsum.photos/seed/rsa6/1080/1280", tags: ["pixel", "retro"], popular: false, views: 310 },
    { id: "p1", cat: "Previews", title: "YouTube Gaming Preview", desc: "Epic gamer thumbnail design", img: "https://picsum.photos/seed/rsp1/1080/1280", tags: ["youtube", "game"], popular: true, views: 3400 },
    { id: "p2", cat: "Previews", title: "Twitch Preview", desc: "Streamer-focused unique design", img: "https://picsum.photos/seed/rsp2/1080/1280", tags: ["twitch"], popular: false, views: 780 },
    { id: "p3", cat: "Previews", title: "Viral Preview", desc: "Impossible not to click", img: "https://picsum.photos/seed/rsp3/1080/1280", tags: ["viral", "bright"], popular: true, views: 5600 },
    { id: "p4", cat: "Previews", title: "Minimal Preview", desc: "Elegant and clean", img: "https://picsum.photos/seed/rsp4/1080/1280", tags: ["minimal"], popular: false, views: 290 },
    { id: "p5", cat: "Previews", title: "Dark Preview", desc: "Dark cinematic atmosphere", img: "https://picsum.photos/seed/rsp5/1080/1280", tags: ["dark", "cinematic"], popular: true, views: 1870 },
    { id: "b1", cat: "Banners", title: "Twitch Banner PRO", desc: "Professional channel header", img: "https://picsum.photos/seed/rsb1/1080/1280", tags: ["twitch"], popular: true, views: 2200 },
    { id: "b2", cat: "Banners", title: "Discord Banner", desc: "Unique server header", img: "https://picsum.photos/seed/rsb2/1080/1280", tags: ["discord"], popular: false, views: 650 },
    { id: "b3", cat: "Banners", title: "YouTube Header 4K", desc: "Flawless channel art", img: "https://picsum.photos/seed/rsb3/1080/1280", tags: ["youtube"], popular: true, views: 3100 },
    { id: "b4", cat: "Banners", title: "VK/TikTok Banner", desc: "Next-gen social media", img: "https://picsum.photos/seed/rsb4/1080/1280", tags: ["tiktok"], popular: false, views: 410 },
    { id: "l1", cat: "Logos", title: "Gaming eSports Logo", desc: "Victory symbol for teams", img: "https://picsum.photos/seed/rsl1/1080/1280", tags: ["game", "esports"], popular: true, views: 4200 },
    { id: "l2", cat: "Logos", title: "Minimal Logo", desc: "Modern geometric brand", img: "https://picsum.photos/seed/rsl2/1080/1280", tags: ["minimal"], popular: false, views: 740 },
    { id: "l3", cat: "Logos", title: "Neon Logo", desc: "Glowing sign in the night", img: "https://picsum.photos/seed/rsl3/1080/1280", tags: ["neon"], popular: true, views: 1950 },
    { id: "l4", cat: "Logos", title: "3D Logo PRO", desc: "Next-level volumetric design", img: "https://picsum.photos/seed/rsl4/1080/1280", tags: ["3d"], popular: false, views: 580 },
    { id: "l5", cat: "Logos", title: "Mascot Logo", desc: "Character mascot for brand", img: "https://picsum.photos/seed/rsl5/1080/1280", tags: ["mascot"], popular: true, views: 2800 },
  ],
};

// Localized category aliases
GALLERY.ua = GALLERY.ru.map(i => ({ ...i, cat: { "Аватарки": "Аватарки", "Превью": "Прев'ю", "Баннеры": "Банери", "Логотипы": "Логотипи" }[i.cat] || i.cat }));
GALLERY.kz = GALLERY.ru.map(i => ({ ...i, cat: { "Аватарки": "Аватарлар", "Превью": "Превью", "Баннеры": "Баннерлер", "Логотипы": "Логотиптер" }[i.cat] || i.cat }));
GALLERY.by = GALLERY.ru.map(i => ({ ...i, cat: { "Аватарки": "Аватаркі", "Превью": "Прэв'ю", "Баннеры": "Банеры", "Логотипы": "Лагатыпы" }[i.cat] || i.cat }));

// Replace picsum.photos placeholders with local assets
Object.keys(GALLERY).forEach((locale) => {
  GALLERY[locale] = (GALLERY[locale] || []).map((item, index) => {
    const img = String(item?.img || "");
    if (!img.includes("picsum.photos")) return item;
    return { ...item, img: resolveLocalGalleryImage(item, index) };
  });
});

export const CAT_ICONS = {
  "Аватарки": "●", "Avatars": "●", "Аватаркі": "●", "Аватарлар": "●",
  "Прев'ю": "▶", "Previews": "▶", "Превью": "▶", "Прэв'ю": "▶",
  "Баннеры": "▬", "Banners": "▬", "Банери": "▬", "Банеры": "▬", "Баннерлер": "▬",
  "Логотипы": "✦", "Logos": "✦", "Логотипи": "✦", "Лагатыпы": "✦", "Логотиптер": "✦",
};

export { LOCAL_GALLERY_ASSETS };
