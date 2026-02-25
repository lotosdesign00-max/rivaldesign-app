import ReactGA from 'react-ga4';

const TRACKING_ID = 'G-5CP93DQTJE';
const IS_PRODUCTION = window.location.hostname !== 'localhost';

// Инициализация Google Analytics
export const initGA = () => {
  if (!IS_PRODUCTION) {
    console.log('[GA] Analytics disabled in development mode');
    return;
  }
  
  ReactGA.initialize(TRACKING_ID, {
    gaOptions: {
      anonymizeIp: true, // Анонимизация IP для соответствия GDPR
    },
  });
  
  console.log('[GA] Google Analytics initialized with ID:', TRACKING_ID);
};

// Отслеживание запуска приложения
export const trackAppStart = (userId = null) => {
  ReactGA.event({
    category: 'App',
    action: 'app_start',
    label: 'Application Started',
    value: 1,
  });
  
  // Отправляем pageview для подсчета сессий
  ReactGA.send({ hitType: 'pageview', page: '/app-start' });
  
  // Если есть Telegram User ID, сохраняем как user_id
  if (userId) {
    ReactGA.set({ userId: `tg_${userId}` });
  }
};

// Отслеживание источников трафика
export const trackTrafficSource = (source, medium = 'telegram') => {
  ReactGA.event({
    category: 'Traffic',
    action: 'traffic_source',
    label: source,
  });
  
  // Установка параметров источника трафика
  ReactGA.set({
    campaign_source: source,
    campaign_medium: medium,
  });
};

// Отслеживание просмотров разделов
export const trackSectionView = (sectionName) => {
  ReactGA.event({
    category: 'Navigation',
    action: 'section_view',
    label: sectionName,
  });
  
  // Отправляем как виртуальный pageview
  ReactGA.send({ 
    hitType: 'pageview', 
    page: `/${sectionName.toLowerCase()}`,
    title: sectionName 
  });
};

// Отслеживание воронки покупки
export const trackFunnelStep = (step, additionalData = {}) => {
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
    ReactGA.event({
      category: 'Funnel',
      action: step,
      label: currentStep.name,
      value: currentStep.step,
      ...additionalData,
    });
  }
};

// Отслеживание генерации идей
export const trackIdeaGeneration = () => {
  ReactGA.event({
    category: 'Engagement',
    action: 'generate_idea',
    label: 'User Generated Idea',
  });
};

// Отслеживание кликов по кнопкам
export const trackButtonClick = (buttonName, context = '') => {
  ReactGA.event({
    category: 'Interaction',
    action: 'button_click',
    label: `${context ? context + ' - ' : ''}${buttonName}`,
  });
};

// Отслеживание взаимодействия с галереей
export const trackGalleryInteraction = (action, imageId = null) => {
  ReactGA.event({
    category: 'Gallery',
    action: action, // 'open', 'close', 'next', 'prev'
    label: imageId ? `Image ${imageId}` : 'Gallery',
  });
};

// Отслеживание активности пользователя (для расчета активных пользователей)
export const trackUserActivity = () => {
  ReactGA.event({
    category: 'User',
    action: 'activity',
    label: 'User Active',
    nonInteraction: false,
  });
};

// Отслеживание времени на сайте (можно вызывать через интервалы)
export const trackEngagementTime = (seconds) => {
  ReactGA.event({
    category: 'Engagement',
    action: 'time_spent',
    label: 'Session Duration',
    value: seconds,
  });
};

// Кастомные события для специфичных действий
export const trackCustomEvent = (category, action, label, value = null) => {
  const eventParams = {
    category,
    action,
    label,
  };
  
  if (value !== null) {
    eventParams.value = value;
  }
  
  ReactGA.event(eventParams);
};
