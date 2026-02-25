import * as amplitude from '@amplitude/analytics-browser';

// 🔑 Получите ваш API Key на https://analytics.amplitude.com/
// Settings → Projects → [Your Project] → API Keys
const AMPLITUDE_API_KEY = 'YOUR_AMPLITUDE_API_KEY'; // TODO: Замените на ваш ключ

const IS_PRODUCTION = window.location.hostname !== 'localhost';

// Инициализация Amplitude
export const initGA = () => {
  if (!IS_PRODUCTION) {
    console.log('[Amplitude] Analytics disabled in development mode');
    return;
  }
  
  amplitude.init(AMPLITUDE_API_KEY, {
    defaultTracking: {
      sessions: true,
      pageViews: true,
      formInteractions: true,
      fileDownloads: false,
    },
  });
  
  console.log('[Amplitude] Analytics initialized');
};

// Отслеживание запуска приложения
export const trackAppStart = (userId = null) => {
  if (!IS_PRODUCTION) return;
  
  // Если есть Telegram User ID, сохраняем как user_id
  if (userId) {
    amplitude.setUserId(`tg_${userId}`);
  }
  
  amplitude.track('app_start', {
    platform: 'telegram_mini_app',
    timestamp: new Date().toISOString(),
  });
};

// Отслеживание источников трафика
export const trackTrafficSource = (source, medium = 'telegram') => {
  if (!IS_PRODUCTION) return;
  
  amplitude.track('traffic_source', {
    source,
    medium,
    utm_source: source,
    utm_medium: medium,
  });
};

// Отслеживание просмотров разделов
export const trackSectionView = (sectionName) => {
  if (!IS_PRODUCTION) return;
  
  amplitude.track('section_view', {
    section_name: sectionName,
    page: `/${sectionName.toLowerCase()}`,
  });
};

// Отслеживание воронки покупки
export const trackFunnelStep = (step, additionalData = {}) => {
  if (!IS_PRODUCTION) return;
  
  const funnelSteps = {
    app_start: { step: 1, name: 'App Started' },
    view_gallery: { step: 2, name: 'Viewed Gallery' },
    view_pricing: { step: 3, name: 'Viewed Pricing' },
    select_plan: { step: 4, name: 'Selected Plan' },
    purchase_intent: { step: 5, name: 'Purchase Intent' },
    purchase_complete: { step: 6, name: 'Purchase Complete' },
  };
  
  const currentStep = funnelSteps[step];
  
  if (currentStep) {
    amplitude.track(step, {
      funnel_step: currentStep.step,
      funnel_name: currentStep.name,
      ...additionalData,
    });
  }
};

// Отслеживание генерации идей
export const trackIdeaGeneration = () => {
  if (!IS_PRODUCTION) return;
  
  amplitude.track('generate_idea', {
    category: 'engagement',
  });
};

// Отслеживание кликов по кнопкам
export const trackButtonClick = (buttonName, context = '') => {
  if (!IS_PRODUCTION) return;
  
  amplitude.track('button_click', {
    button_name: buttonName,
    context: context || 'general',
  });
};

// Отслеживание взаимодействия с галереей
export const trackGalleryInteraction = (action, imageId = null) => {
  if (!IS_PRODUCTION) return;
  
  amplitude.track('gallery_interaction', {
    action: action, // 'open', 'close', 'next', 'prev'
    image_id: imageId,
  });
};

// Отслеживание активности пользователя (для расчета активных пользователей)
export const trackUserActivity = () => {
  if (!IS_PRODUCTION) return;
  
  amplitude.track('user_activity', {
    timestamp: new Date().toISOString(),
  });
};

// Отслеживание времени на сайте (можно вызывать через интервалы)
export const trackEngagementTime = (seconds) => {
  if (!IS_PRODUCTION) return;
  
  amplitude.track('engagement_time', {
    seconds: seconds,
    minutes: Math.floor(seconds / 60),
  });
};

// Кастомные события для специфичных действий
export const trackCustomEvent = (eventName, properties = {}) => {
  if (!IS_PRODUCTION) return;
  
  amplitude.track(eventName, properties);
};
