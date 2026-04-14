/**
 * CORE CONSTANTS
 * Single source of truth for app-wide constants
 */

export const APP_CONFIG = {
  name: 'Rival Design',
  version: '5.0.0',
  description: 'Premium design portfolio & learning platform',
  author: 'Rivaldsg',
  telegram: {
    channel: '@Rivaldsgn',
    contact: '@Rivaldsg',
    group: 'https://t.me/+a7SsFZHmCaJiNDMy',
  },
  social: {
    tiktok: 'https://www.tiktok.com/@rivaldsgn',
    youtube: 'https://www.youtube.com/@RivalDesign',
  },
};

export const FEATURES = {
  onboarding: true,
  aiAssistant: true,
  smartGallery: true,
  achievements: true,
  courses: true,
  social: true,
  analytics: true,
  collaboration: false, // Coming soon
  marketplace: false, // Coming soon
};

export const LIMITS = {
  maxUploadSize: 10 * 1024 * 1024, // 10MB
  maxImagesPerMoodboard: 50,
  maxCoursesInProgress: 5,
  maxSavedSearches: 10,
  maxNotifications: 100,
};

export const TIMING = {
  toastDuration: 3000,
  tooltipDelay: 500,
  debounceSearch: 300,
  autoSaveInterval: 5000,
  sessionTimeout: 30 * 60 * 1000, // 30 min
};

export const BREAKPOINTS = {
  xs: 320,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

export const ROUTES = {
  home: '/',
  gallery: '/gallery',
  courses: '/courses',
  pricing: '/pricing',
  profile: '/profile',
  ai: '/ai',
  analytics: '/analytics',
  settings: '/settings',
};

export const USER_ROLES = {
  designer: 'designer',
  streamer: 'streamer',
  brand: 'brand',
  student: 'student',
  other: 'other',
};

export const ACHIEVEMENT_TYPES = {
  firstVisit: 'first_visit',
  firstLike: 'first_like',
  firstCourse: 'first_course',
  streak7: 'streak_7',
  streak30: 'streak_30',
  level5: 'level_5',
  level10: 'level_10',
  level25: 'level_25',
  explorer: 'explorer',
  collector: 'collector',
  master: 'master',
};

export const XP_REWARDS = {
  visit: 5,
  like: 2,
  comment: 5,
  share: 10,
  courseLesson: 15,
  courseComplete: 100,
  aiChat: 3,
  achievement: 50,
  dailyStreak: 20,
};

export const LEVELS = [
  { level: 1, xp: 0, title: 'Новичок', titleEn: 'Beginner' },
  { level: 2, xp: 100, title: 'Ученик', titleEn: 'Apprentice' },
  { level: 3, xp: 250, title: 'Практик', titleEn: 'Practitioner' },
  { level: 4, xp: 500, title: 'Специалист', titleEn: 'Specialist' },
  { level: 5, xp: 1000, title: 'Эксперт', titleEn: 'Expert' },
  { level: 6, xp: 2000, title: 'Мастер', titleEn: 'Master' },
  { level: 7, xp: 4000, title: 'Гуру', titleEn: 'Guru' },
  { level: 8, xp: 8000, title: 'Легенда', titleEn: 'Legend' },
  { level: 9, xp: 15000, title: 'Титан', titleEn: 'Titan' },
  { level: 10, xp: 30000, title: 'Бог дизайна', titleEn: 'Design God' },
];

export const NOTIFICATION_TYPES = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
  achievement: 'achievement',
  social: 'social',
  system: 'system',
};

export const GALLERY_CATEGORIES = {
  ru: ['Аватарки', 'Превью', 'Баннеры', 'Логотипы', 'UI/UX', '3D', 'Иллюстрации'],
  en: ['Avatars', 'Previews', 'Banners', 'Logos', 'UI/UX', '3D', 'Illustrations'],
};

export const COURSE_LEVELS = {
  beginner: { ru: 'Начинающий', en: 'Beginner' },
  intermediate: { ru: 'Средний', en: 'Intermediate' },
  advanced: { ru: 'Продвинутый', en: 'Advanced' },
  expert: { ru: 'Эксперт', en: 'Expert' },
};

export const PRICING_TIERS = {
  basic: 'basic',
  pro: 'pro',
  premium: 'premium',
  enterprise: 'enterprise',
};
