import * as amplitude from '@amplitude/analytics-browser';

// 🔑 API Key берется из переменных окружения (.env файл)
// Получите ваш ключ на: https://analytics.amplitude.com/
// Settings → Projects → [Your Project] → API Keys
const AMPLITUDE_API_KEY = import.meta.env.VITE_AMPLITUDE_API_KEY;

const IS_PRODUCTION = window.location.hostname !== 'localhost';
const IS_DEVELOPMENT = !IS_PRODUCTION;

// Инициализация Amplitude
export const initGA = () => {
  if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY === 'YOUR_AMPLITUDE_API_KEY') {
    console.warn('[Amplitude] ⚠️ API Key не настроен! Добавьте VITE_AMPLITUDE_API_KEY в .env файл');
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
  
  console.log('[Amplitude] ✅ Analytics initialized', IS_DEVELOPMENT ? '(Dev Mode)' : '(Production)');
};

// Отслеживание запуска приложения
export const trackAppStart = (userId = null) => {
  if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY === 'YOUR_AMPLITUDE_API_KEY') return;
  
  // Если есть Telegram User ID, сохраняем как user_id
  if (userId) {
    amplitude.setUserId(`tg_${userId}`);
  }
  
  amplitude.track('app_start', {
    platform: 'telegram_mini_app',
    timestamp: new Date().toISOString(),
    environment: IS_PRODUCTION ? 'production' : 'development',
  });
  
  if (IS_DEVELOPMENT) {
    console.log('[Amplitude] 📊 Event: app_start', { userId });
  }
};

// Отслеживание источников трафика
export const trackTrafficSource = (source, medium = 'telegram') => {
  if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY === 'YOUR_AMPLITUDE_API_KEY') return;
  
  amplitude.track('traffic_source', {
    source,
    medium,
    utm_source: source,
    utm_medium: medium,
  });
  
  if (IS_DEVELOPMENT) {
    console.log('[Amplitude] 📊 Event: traffic_source', { source, medium });
  }
};

// Отслеживание просмотров разделов
export const trackSectionView = (sectionName) => {
  if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY === 'YOUR_AMPLITUDE_API_KEY') return;
  
  amplitude.track('section_view', {
    section_name: sectionName,
    page: `/${sectionName.toLowerCase()}`,
  });
  
  if (IS_DEVELOPMENT) {
    console.log('[Amplitude] 📊 Event: section_view', { sectionName });
  }
};

// Отслеживание воронки покупки
export const trackFunnelStep = (step, additionalData = {}) => {
  if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY === 'YOUR_AMPLITUDE_API_KEY') return;
  
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
    
    if (IS_DEVELOPMENT) {
      console.log('[Amplitude] 📊 Event: funnel_step', { step, ...currentStep, ...additionalData });
    }
  }
};

// Отслеживание генерации идей
export const trackIdeaGeneration = () => {
  if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY === 'YOUR_AMPLITUDE_API_KEY') return;
  
  amplitude.track('generate_idea', {
    category: 'engagement',
  });
  
  if (IS_DEVELOPMENT) {
    console.log('[Amplitude] 📊 Event: generate_idea');
  }
};

// Отслеживание кликов по кнопкам
export const trackButtonClick = (buttonName, context = '') => {
  if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY === 'YOUR_AMPLITUDE_API_KEY') return;
  
  amplitude.track('button_click', {
    button_name: buttonName,
    context: context || 'general',
  });
  
  if (IS_DEVELOPMENT) {
    console.log('[Amplitude] 📊 Event: button_click', { buttonName, context });
  }
};

// Отслеживание взаимодействия с галереей
export const trackGalleryInteraction = (action, imageId = null) => {
  if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY === 'YOUR_AMPLITUDE_API_KEY') return;
  
  amplitude.track('gallery_interaction', {
    action: action, // 'open', 'close', 'next', 'prev'
    image_id: imageId,
  });
  
  if (IS_DEVELOPMENT) {
    console.log('[Amplitude] 📊 Event: gallery_interaction', { action, imageId });
  }
};

// Отслеживание активности пользователя (для расчета активных пользователей)
export const trackUserActivity = () => {
  if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY === 'YOUR_AMPLITUDE_API_KEY') return;
  
  amplitude.track('user_activity', {
    timestamp: new Date().toISOString(),
  });
  
  if (IS_DEVELOPMENT) {
    console.log('[Amplitude] 📊 Event: user_activity');
  }
};

// Отслеживание времени на сайте (можно вызывать через интервалы)
export const trackEngagementTime = (seconds) => {
  if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY === 'YOUR_AMPLITUDE_API_KEY') return;
  
  amplitude.track('engagement_time', {
    seconds: seconds,
    minutes: Math.floor(seconds / 60),
  });
  
  if (IS_DEVELOPMENT) {
    console.log('[Amplitude] 📊 Event: engagement_time', { seconds });
  }
};

// Кастомные события для специфичных действий
export const trackCustomEvent = (eventName, properties = {}) => {
  if (!AMPLITUDE_API_KEY || AMPLITUDE_API_KEY === 'YOUR_AMPLITUDE_API_KEY') return;
  
  amplitude.track(eventName, properties);
  
  if (IS_DEVELOPMENT) {
    console.log('[Amplitude] 📊 Event:', eventName, properties);
  }
};
