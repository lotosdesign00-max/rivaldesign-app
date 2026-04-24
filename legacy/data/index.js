/**
 * Data barrel — central re-export for all data models.
 * Import from here instead of individual files.
 *
 * Usage: import { THEMES, GALLERY, T, SERVICES, ... } from "../data";
 */

export { THEMES, normalizeThemeId } from "./themes";
export { LANGS } from "./langs";
export { GALLERY, CAT_ICONS, pickGalleryAsset, LOCAL_GALLERY_ASSETS } from "./gallery";
export { COURSES, COURSE_CATS } from "./courses";
export { REVIEWS } from "./reviews";
export { SERVICES, PROMO_CODES, DESIGN_PACK_CONFIG, MOCK_DESIGN_PACK } from "./services";
export { ACHIEVEMENTS } from "./achievements";
export { QUIZ_QUESTIONS_POOL, QUIZ_DATA, getQuizForToday } from "./quiz";
export { FAQ_DATA } from "./faq";
export { T } from "./translations";
export { AI_IDEA_PROMPTS_RU, AI_IDEA_PROMPTS_EN } from "./aiPrompts";
