/**
 * ONBOARDING SYSTEM
 * Smart interactive onboarding with personalization
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUser, updateUser, completeOnboarding, addXP } from '../core/user';
import { emit, EVENTS } from '../core/events';
import { USER_ROLES, XP_REWARDS } from '../core/constants';

const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: { ru: 'Добро пожаловать!', en: 'Welcome!' },
    subtitle: { ru: 'Давай настроим твой опыт', en: "Let's personalize your experience" },
    type: 'welcome',
  },
  {
    id: 'role',
    title: { ru: 'Кто ты?', en: 'Who are you?' },
    subtitle: { ru: 'Выбери свою роль', en: 'Choose your role' },
    type: 'role-select',
  },
  {
    id: 'interests',
    title: { ru: 'Что тебя интересует?', en: 'What interests you?' },
    subtitle: { ru: 'Выбери категории', en: 'Select categories' },
    type: 'multi-select',
  },
  {
    id: 'tour',
    title: { ru: 'Быстрый тур', en: 'Quick tour' },
    subtitle: { ru: 'Основные возможности', en: 'Key features' },
    type: 'tour',
  },
  {
    id: 'complete',
    title: { ru: 'Всё готово!', en: 'All set!' },
    subtitle: { ru: 'Начинаем путешествие', en: "Let's start your journey" },
    type: 'complete',
  },
];

const ROLES = [
  {
    id: USER_ROLES.designer,
    icon: '🎨',
    title: { ru: 'Дизайнер', en: 'Designer' },
    desc: { ru: 'Создаю визуальный контент', en: 'I create visual content' },
  },
  {
    id: USER_ROLES.streamer,
    icon: '🎮',
    title: { ru: 'Стример', en: 'Streamer' },
    desc: { ru: 'Нужен дизайн для канала', en: 'Need design for my channel' },
  },
  {
    id: USER_ROLES.brand,
    icon: '🏢',
    title: { ru: 'Бренд', en: 'Brand' },
    desc: { ru: 'Ищу дизайнера для проекта', en: 'Looking for designer' },
  },
  {
    id: USER_ROLES.student,
    icon: '📚',
    title: { ru: 'Учусь', en: 'Student' },
    desc: { ru: 'Хочу научиться дизайну', en: 'Want to learn design' },
  },
];

const INTERESTS = [
  { id: 'avatars', icon: '👤', label: { ru: 'Аватарки', en: 'Avatars' } },
  { id: 'previews', icon: '🖼️', label: { ru: 'Превью', en: 'Thumbnails' } },
  { id: 'banners', icon: '🎯', label: { ru: 'Баннеры', en: 'Banners' } },
  { id: 'logos', icon: '✨', label: { ru: 'Логотипы', en: 'Logos' } },
  { id: 'ui', icon: '📱', label: { ru: 'UI/UX', en: 'UI/UX' } },
  { id: '3d', icon: '🎲', label: { ru: '3D', en: '3D' } },
  { id: 'illustration', icon: '🎭', label: { ru: 'Иллюстрации', en: 'Illustrations' } },
  { id: 'courses', icon: '🎓', label: { ru: 'Обучение', en: 'Learning' } },
];

const TOUR_FEATURES = [
  {
    id: 'gallery',
    icon: '🖼️',
    title: { ru: 'Галерея', en: 'Gallery' },
    desc: { ru: 'Тысячи работ с умным поиском', en: 'Thousands of works with smart search' },
  },
  {
    id: 'ai',
    icon: '🤖',
    title: { ru: 'AI Ассистент', en: 'AI Assistant' },
    desc: { ru: 'Помощь в создании брифов и идей', en: 'Help with briefs and ideas' },
  },
  {
    id: 'courses',
    icon: '📚',
    title: { ru: 'Курсы', en: 'Courses' },
    desc: { ru: 'Обучение от профи', en: 'Learn from pros' },
  },
  {
    id: 'achievements',
    icon: '🏆',
    title: { ru: 'Достижения', en: 'Achievements' },
    desc: { ru: 'Прокачивай уровень и получай награды', en: 'Level up and earn rewards' },
  },
];

export default function OnboardingSystem({ lang = 'ru', onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  const user = getUser();
  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const getText = (obj) => obj[lang] || obj.en || obj.ru;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    // Save user data
    updateUser({
      role: selectedRole,
      interests: selectedInterests,
      onboardingCompleted: true,
    });

    // Award XP
    addXP(XP_REWARDS.achievement * 2, 'onboarding_complete');

    // Emit event
    emit(EVENTS.USER_UPDATED, { onboardingCompleted: true });

    // Close onboarding
    setIsVisible(false);

    // Call callback
    if (onComplete) {
      setTimeout(onComplete, 300);
    }
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setTimeout(handleNext, 500);
  };

  const toggleInterest = (interestId) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(3, 4, 8, 0.98)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div style={{ maxWidth: 600, width: '100%' }}>
        {/* Progress */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            display: 'flex',
            gap: 8,
            marginBottom: 12,
          }}>
            {ONBOARDING_STEPS.map((s, i) => (
              <div
                key={s.id}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: i <= currentStep
                    ? 'linear-gradient(90deg, #8B5CF6, #6366F1)'
                    : 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
          <div style={{
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.5)',
            textAlign: 'center',
          }}>
            {currentStep + 1} / {ONBOARDING_STEPS.length}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h1 style={{
                fontSize: 36,
                fontWeight: 900,
                background: 'linear-gradient(135deg, #C7D2FE, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 12,
              }}>
                {getText(step.title)}
              </h1>
              <p style={{
                fontSize: 16,
                color: 'rgba(255, 255, 255, 0.6)',
              }}>
                {getText(step.subtitle)}
              </p>
            </div>

            {/* Step content */}
            {step.type === 'welcome' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 80, marginBottom: 20 }}>👋</div>
                <p style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}>
                  {lang === 'ru'
                    ? 'Rival Design — это твоя платформа для вдохновения, обучения и роста в дизайне'
                    : 'Rival Design is your platform for inspiration, learning and growth in design'}
                </p>
              </div>
            )}

            {step.type === 'role-select' && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 16,
              }}>
                {ROLES.map(role => (
                  <motion.button
                    key={role.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRoleSelect(role.id)}
                    style={{
                      padding: 24,
                      borderRadius: 20,
                      border: selectedRole === role.id
                        ? '2px solid #8B5CF6'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      background: selectedRole === role.id
                        ? 'rgba(139, 92, 246, 0.1)'
                        : 'rgba(255, 255, 255, 0.03)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 12 }}>{role.icon}</div>
                    <div style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: 8,
                    }}>
                      {getText(role.title)}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}>
                      {getText(role.desc)}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {step.type === 'multi-select' && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 12,
                  marginBottom: 24,
                }}>
                  {INTERESTS.map(interest => {
                    const isSelected = selectedInterests.includes(interest.id);
                    return (
                      <motion.button
                        key={interest.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleInterest(interest.id)}
                        style={{
                          padding: 16,
                          borderRadius: 16,
                          border: isSelected
                            ? '2px solid #8B5CF6'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                          background: isSelected
                            ? 'rgba(139, 92, 246, 0.15)'
                            : 'rgba(255, 255, 255, 0.03)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ fontSize: 24 }}>{interest.icon}</div>
                        <div style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: isSelected ? '#C7D2FE' : 'rgba(255, 255, 255, 0.8)',
                        }}>
                          {getText(interest.label)}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                <p style={{
                  fontSize: 13,
                  color: 'rgba(255, 255, 255, 0.5)',
                  textAlign: 'center',
                }}>
                  {lang === 'ru'
                    ? `Выбрано: ${selectedInterests.length}`
                    : `Selected: ${selectedInterests.length}`}
                </p>
              </div>
            )}

            {step.type === 'tour' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {TOUR_FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      padding: 20,
                      borderRadius: 16,
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      gap: 16,
                      alignItems: 'center',
                    }}
                  >
                    <div style={{
                      fontSize: 32,
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      background: 'rgba(139, 92, 246, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {feature.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#fff',
                        marginBottom: 4,
                      }}>
                        {getText(feature.title)}
                      </div>
                      <div style={{
                        fontSize: 13,
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}>
                        {getText(feature.desc)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {step.type === 'complete' && (
              <div style={{ textAlign: 'center' }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  style={{ fontSize: 100, marginBottom: 20 }}
                >
                  🎉
                </motion.div>
                <p style={{
                  fontSize: 18,
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}>
                  {lang === 'ru'
                    ? 'Ты получил +100 XP за завершение онбординга!'
                    : 'You earned +100 XP for completing onboarding!'}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div style={{
          display: 'flex',
          gap: 12,
          marginTop: 40,
        }}>
          {!isLastStep && (
            <button
              onClick={handleSkip}
              style={{
                flex: 1,
                padding: '14px 24px',
                borderRadius: 12,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {lang === 'ru' ? 'Пропустить' : 'Skip'}
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step.type === 'multi-select' && selectedInterests.length === 0}
            style={{
              flex: 2,
              padding: '14px 24px',
              borderRadius: 12,
              border: 'none',
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: step.type === 'multi-select' && selectedInterests.length === 0 ? 0.5 : 1,
            }}
          >
            {isLastStep
              ? (lang === 'ru' ? 'Начать!' : 'Start!')
              : (lang === 'ru' ? 'Далее' : 'Next')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
