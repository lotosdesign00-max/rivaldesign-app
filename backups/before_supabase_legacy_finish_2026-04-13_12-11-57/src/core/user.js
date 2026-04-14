/**
 * USER SYSTEM
 * User state, progress, achievements, and preferences
 */

import storage from './storage';
import { emit, EVENTS } from './events';
import { XP_REWARDS, LEVELS, ACHIEVEMENT_TYPES } from './constants';

class UserSystem {
  constructor() {
    this.user = this.loadUser();
    this.initializeUser();
  }

  // Initialize user if not exists
  initializeUser() {
    if (!this.user.id) {
      this.user = {
        id: this.generateUserId(),
        createdAt: Date.now(),
        lastVisit: Date.now(),
        visits: 1,

        // Profile
        name: null,
        avatar: null,
        role: null,
        bio: null,

        // Progress
        xp: 0,
        level: 1,
        streak: 0,
        lastStreakDate: null,

        // Stats
        stats: {
          galleryViews: 0,
          likes: 0,
          coursesStarted: 0,
          coursesCompleted: 0,
          lessonsCompleted: 0,
          aiChats: 0,
          timeSpent: 0,
        },

        // Achievements
        achievements: [],

        // Preferences
        preferences: {
          theme: 'deepspace',
          language: 'ru',
          soundEnabled: true,
          notificationsEnabled: true,
          analyticsEnabled: true,
        },

        // Social
        following: [],
        followers: [],

        // Content
        likedItems: [],
        savedItems: [],
        moodboards: [],

        // Courses
        coursesInProgress: [],
        completedCourses: [],

        // Onboarding
        onboardingCompleted: false,
        onboardingStep: 0,
      };

      this.saveUser();
      this.checkAchievement(ACHIEVEMENT_TYPES.firstVisit);
    } else {
      // Update last visit
      this.user.visits++;
      this.user.lastVisit = Date.now();
      this.checkStreak();
      this.saveUser();
    }
  }

  // Generate unique user ID
  generateUserId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Load user from storage
  loadUser() {
    return storage.get('user', {});
  }

  // Save user to storage
  saveUser() {
    storage.set('user', this.user);
    emit(EVENTS.USER_UPDATED, this.user);
  }

  // Get user
  getUser() {
    return { ...this.user };
  }

  // Update user
  updateUser(updates) {
    this.user = { ...this.user, ...updates };
    this.saveUser();
  }

  // Update profile
  updateProfile(profile) {
    this.user = {
      ...this.user,
      ...profile,
    };
    this.saveUser();
  }

  // Update preferences
  updatePreferences(preferences) {
    this.user.preferences = {
      ...this.user.preferences,
      ...preferences,
    };
    this.saveUser();
  }

  // Add XP
  addXP(amount, reason = '') {
    const oldXP = this.user.xp;
    const oldLevel = this.user.level;

    this.user.xp += amount;

    // Check for level up
    const newLevel = this.calculateLevel(this.user.xp);
    if (newLevel > oldLevel) {
      this.user.level = newLevel;
      emit(EVENTS.LEVEL_UP, { level: newLevel, xp: this.user.xp });
      this.checkAchievement(`level_${newLevel}`);
    }

    this.saveUser();
    emit(EVENTS.XP_GAINED, { amount, reason, oldXP, newXP: this.user.xp });
  }

  // Calculate level from XP
  calculateLevel(xp) {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].xp) {
        return LEVELS[i].level;
      }
    }
    return 1;
  }

  // Get level info
  getLevelInfo() {
    const currentLevel = LEVELS.find(l => l.level === this.user.level);
    const nextLevel = LEVELS.find(l => l.level === this.user.level + 1);

    return {
      current: currentLevel,
      next: nextLevel,
      progress: nextLevel
        ? (this.user.xp - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)
        : 1,
      xpToNext: nextLevel ? nextLevel.xp - this.user.xp : 0,
    };
  }

  // Check and update streak
  checkStreak() {
    const today = new Date().toDateString();
    const lastDate = this.user.lastStreakDate
      ? new Date(this.user.lastStreakDate).toDateString()
      : null;

    if (lastDate === today) {
      // Already counted today
      return;
    }

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (lastDate === yesterday) {
      // Continue streak
      this.user.streak++;
      this.addXP(XP_REWARDS.dailyStreak, 'daily_streak');
    } else if (lastDate !== today) {
      // Reset streak
      this.user.streak = 1;
    }

    this.user.lastStreakDate = Date.now();
    this.saveUser();
    emit(EVENTS.STREAK_UPDATED, { streak: this.user.streak });

    // Check streak achievements
    if (this.user.streak === 7) {
      this.checkAchievement(ACHIEVEMENT_TYPES.streak7);
    }
    if (this.user.streak === 30) {
      this.checkAchievement(ACHIEVEMENT_TYPES.streak30);
    }
  }

  // Check achievement
  checkAchievement(achievementId) {
    if (this.user.achievements.includes(achievementId)) {
      return false;
    }

    this.user.achievements.push(achievementId);
    this.addXP(XP_REWARDS.achievement, `achievement_${achievementId}`);
    this.saveUser();
    emit(EVENTS.ACHIEVEMENT_UNLOCKED, { achievementId });

    return true;
  }

  // Update stats
  updateStats(stats) {
    this.user.stats = {
      ...this.user.stats,
      ...stats,
    };
    this.saveUser();
  }

  // Increment stat
  incrementStat(stat, amount = 1) {
    if (this.user.stats[stat] !== undefined) {
      this.user.stats[stat] += amount;
      this.saveUser();
    }
  }

  // Like item
  likeItem(itemId) {
    if (!this.user.likedItems.includes(itemId)) {
      this.user.likedItems.push(itemId);
      this.incrementStat('likes');
      this.addXP(XP_REWARDS.like, 'like_item');
      this.saveUser();
      emit(EVENTS.GALLERY_ITEM_LIKED, { itemId, liked: true });

      if (this.user.likedItems.length === 1) {
        this.checkAchievement(ACHIEVEMENT_TYPES.firstLike);
      }
    }
  }

  // Unlike item
  unlikeItem(itemId) {
    const index = this.user.likedItems.indexOf(itemId);
    if (index > -1) {
      this.user.likedItems.splice(index, 1);
      this.incrementStat('likes', -1);
      this.saveUser();
      emit(EVENTS.GALLERY_ITEM_LIKED, { itemId, liked: false });
    }
  }

  // Check if item is liked
  isLiked(itemId) {
    return this.user.likedItems.includes(itemId);
  }

  // Save item
  saveItem(itemId) {
    if (!this.user.savedItems.includes(itemId)) {
      this.user.savedItems.push(itemId);
      this.saveUser();
    }
  }

  // Unsave item
  unsaveItem(itemId) {
    const index = this.user.savedItems.indexOf(itemId);
    if (index > -1) {
      this.user.savedItems.splice(index, 1);
      this.saveUser();
    }
  }

  // Check if item is saved
  isSaved(itemId) {
    return this.user.savedItems.includes(itemId);
  }

  // Complete onboarding
  completeOnboarding() {
    this.user.onboardingCompleted = true;
    this.saveUser();
  }

  // Reset user (for testing)
  reset() {
    storage.remove('user');
    this.user = {};
    this.initializeUser();
  }
}

// Create singleton
const userSystem = new UserSystem();

// Convenience methods
export const getUser = () => userSystem.getUser();
export const updateUser = (updates) => userSystem.updateUser(updates);
export const updateProfile = (profile) => userSystem.updateProfile(profile);
export const updatePreferences = (prefs) => userSystem.updatePreferences(prefs);
export const addXP = (amount, reason) => userSystem.addXP(amount, reason);
export const getLevelInfo = () => userSystem.getLevelInfo();
export const checkAchievement = (id) => userSystem.checkAchievement(id);
export const updateStats = (stats) => userSystem.updateStats(stats);
export const incrementStat = (stat, amount) => userSystem.incrementStat(stat, amount);
export const likeItem = (id) => userSystem.likeItem(id);
export const unlikeItem = (id) => userSystem.unlikeItem(id);
export const isLiked = (id) => userSystem.isLiked(id);
export const saveItem = (id) => userSystem.saveItem(id);
export const unsaveItem = (id) => userSystem.unsaveItem(id);
export const isSaved = (id) => userSystem.isSaved(id);
export const completeOnboarding = () => userSystem.completeOnboarding();
export const resetUser = () => userSystem.reset();

export default userSystem;
