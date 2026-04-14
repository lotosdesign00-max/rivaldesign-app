/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GLOBAL STATE MANAGEMENT — Zustand Store
 * Centralized state for the entire application
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ═══════════════════════════════════════════════════════════════════════
      // USER STATE
      // ═══════════════════════════════════════════════════════════════════════
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      // ═══════════════════════════════════════════════════════════════════════
      // SETTINGS
      // ═══════════════════════════════════════════════════════════════════════
      settings: {
        language: 'ru',
        currency: 'RUB',
        theme: 'deepspace',
        soundEnabled: true,
        hapticsEnabled: true,
        notificationsEnabled: true,
        autoPlayVideos: true,
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // ═══════════════════════════════════════════════════════════════════════
      // NAVIGATION
      // ═══════════════════════════════════════════════════════════════════════
      currentTab: 'discover',
      setCurrentTab: (tab) => set({ currentTab: tab }),
      navigationHistory: [],
      pushNavigation: (route) =>
        set((state) => ({
          navigationHistory: [...state.navigationHistory, route],
        })),
      popNavigation: () =>
        set((state) => ({
          navigationHistory: state.navigationHistory.slice(0, -1),
        })),

      // ═══════════════════════════════════════════════════════════════════════
      // GALLERY & FAVORITES
      // ═══════════════════════════════════════════════════════════════════════
      favorites: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((fav) => fav !== id)
            : [...state.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),
      clearFavorites: () => set({ favorites: [] }),

      // ═══════════════════════════════════════════════════════════════════════
      // COLLECTIONS
      // ═══════════════════════════════════════════════════════════════════════
      collections: [],
      createCollection: (name, description = '') =>
        set((state) => ({
          collections: [
            ...state.collections,
            {
              id: Date.now().toString(),
              name,
              description,
              items: [],
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      addToCollection: (collectionId, itemId) =>
        set((state) => ({
          collections: state.collections.map((col) =>
            col.id === collectionId
              ? { ...col, items: [...col.items, itemId] }
              : col
          ),
        })),
      removeFromCollection: (collectionId, itemId) =>
        set((state) => ({
          collections: state.collections.map((col) =>
            col.id === collectionId
              ? { ...col, items: col.items.filter((id) => id !== itemId) }
              : col
          ),
        })),
      deleteCollection: (collectionId) =>
        set((state) => ({
          collections: state.collections.filter((col) => col.id !== collectionId),
        })),

      // ═══════════════════════════════════════════════════════════════════════
      // CART & ORDERS
      // ═══════════════════════════════════════════════════════════════════════
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { cart: [...state.cart, { ...item, quantity: 1 }] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),
      updateCartQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      // ═══════════════════════════════════════════════════════════════════════
      // ORDERS HISTORY
      // ═══════════════════════════════════════════════════════════════════════
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [
            {
              ...order,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              status: 'pending',
            },
            ...state.orders,
          ],
        })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order
          ),
        })),

      // ═══════════════════════════════════════════════════════════════════════
      // ACHIEVEMENTS
      // ═══════════════════════════════════════════════════════════════════════
      achievements: [],
      unlockedAchievements: [],
      unlockAchievement: (achievementId) =>
        set((state) => {
          if (state.unlockedAchievements.includes(achievementId)) {
            return state;
          }
          return {
            unlockedAchievements: [...state.unlockedAchievements, achievementId],
          };
        }),
      isAchievementUnlocked: (achievementId) =>
        get().unlockedAchievements.includes(achievementId),

      // ═══════════════════════════════════════════════════════════════════════
      // COURSE PROGRESS
      // ═══════════════════════════════════════════════════════════════════════
      courseProgress: {},
      updateCourseProgress: (courseId, lessonId, completed) =>
        set((state) => ({
          courseProgress: {
            ...state.courseProgress,
            [courseId]: {
              ...state.courseProgress[courseId],
              [lessonId]: completed,
            },
          },
        })),
      getCourseProgress: (courseId) => {
        const progress = get().courseProgress[courseId] || {};
        const completed = Object.values(progress).filter(Boolean).length;
        const total = Object.keys(progress).length;
        return { completed, total, percentage: total ? (completed / total) * 100 : 0 };
      },

      // ═══════════════════════════════════════════════════════════════════════
      // AI CHAT HISTORY
      // ═══════════════════════════════════════════════════════════════════════
      aiChatHistory: [],
      addAiMessage: (message) =>
        set((state) => ({
          aiChatHistory: [
            ...state.aiChatHistory,
            {
              ...message,
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
            },
          ],
        })),
      clearAiChat: () => set({ aiChatHistory: [] }),

      // ═══════════════════════════════════════════════════════════════════════
      // SEARCH HISTORY
      // ═══════════════════════════════════════════════════════════════════════
      searchHistory: [],
      addSearchQuery: (query) =>
        set((state) => {
          const filtered = state.searchHistory.filter((q) => q !== query);
          return {
            searchHistory: [query, ...filtered].slice(0, 10),
          };
        }),
      clearSearchHistory: () => set({ searchHistory: [] }),

      // ═══════════════════════════════════════════════════════════════════════
      // NOTIFICATIONS
      // ═══════════════════════════════════════════════════════════════════════
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notif) => ({
            ...notif,
            read: true,
          })),
        })),
      clearNotifications: () => set({ notifications: [] }),
      getUnreadCount: () => {
        const { notifications } = get();
        return notifications.filter((n) => !n.read).length;
      },

      // ═══════════════════════════════════════════════════════════════════════
      // UI STATE
      // ═══════════════════════════════════════════════════════════════════════
      modals: {},
      openModal: (modalId, data = null) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: { open: true, data } },
        })),
      closeModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: { open: false, data: null } },
        })),
      isModalOpen: (modalId) => get().modals[modalId]?.open || false,

      // ═══════════════════════════════════════════════════════════════════════
      // ONBOARDING
      // ═══════════════════════════════════════════════════════════════════════
      onboardingCompleted: false,
      completeOnboarding: () => set({ onboardingCompleted: true }),
      resetOnboarding: () => set({ onboardingCompleted: false }),

      // ═══════════════════════════════════════════════════════════════════════
      // ANALYTICS
      // ═══════════════════════════════════════════════════════════════════════
      analytics: {
        pageViews: {},
        interactions: {},
      },
      trackPageView: (page) =>
        set((state) => ({
          analytics: {
            ...state.analytics,
            pageViews: {
              ...state.analytics.pageViews,
              [page]: (state.analytics.pageViews[page] || 0) + 1,
            },
          },
        })),
      trackInteraction: (action) =>
        set((state) => ({
          analytics: {
            ...state.analytics,
            interactions: {
              ...state.analytics.interactions,
              [action]: (state.analytics.interactions[action] || 0) + 1,
            },
          },
        })),
    }),
    {
      name: 'rival-design-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        favorites: state.favorites,
        collections: state.collections,
        cart: state.cart,
        orders: state.orders,
        unlockedAchievements: state.unlockedAchievements,
        courseProgress: state.courseProgress,
        searchHistory: state.searchHistory,
        onboardingCompleted: state.onboardingCompleted,
      }),
    }
  )
);
