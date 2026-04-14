/**
 * EVENT SYSTEM
 * Global event bus for app-wide communication
 */

class EventBus {
  constructor() {
    this.events = new Map();
  }

  // Subscribe to event
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).push(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  // Subscribe once
  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };

    return this.on(event, wrapper);
  }

  // Unsubscribe from event
  off(event, callback) {
    if (!this.events.has(event)) return;

    const callbacks = this.events.get(event);
    const index = callbacks.indexOf(callback);

    if (index > -1) {
      callbacks.splice(index, 1);
    }

    if (callbacks.length === 0) {
      this.events.delete(event);
    }
  }

  // Emit event
  emit(event, ...args) {
    if (!this.events.has(event)) return;

    const callbacks = this.events.get(event);
    callbacks.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event handler for "${event}":`, error);
      }
    });
  }

  // Clear all listeners for event
  clear(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  // Get listener count
  listenerCount(event) {
    return this.events.has(event) ? this.events.get(event).length : 0;
  }
}

// Create singleton
const eventBus = new EventBus();

// Event names
export const EVENTS = {
  // Theme
  THEME_CHANGED: 'theme:changed',

  // User
  USER_LOGGED_IN: 'user:logged_in',
  USER_LOGGED_OUT: 'user:logged_out',
  USER_UPDATED: 'user:updated',

  // Navigation
  ROUTE_CHANGED: 'route:changed',
  TAB_CHANGED: 'tab:changed',

  // Gallery
  GALLERY_ITEM_LIKED: 'gallery:item_liked',
  GALLERY_ITEM_VIEWED: 'gallery:item_viewed',
  GALLERY_FILTER_CHANGED: 'gallery:filter_changed',

  // Courses
  COURSE_STARTED: 'course:started',
  COURSE_COMPLETED: 'course:completed',
  LESSON_COMPLETED: 'lesson:completed',

  // Achievements
  ACHIEVEMENT_UNLOCKED: 'achievement:unlocked',
  LEVEL_UP: 'level:up',
  XP_GAINED: 'xp:gained',
  STREAK_UPDATED: 'streak:updated',

  // AI
  AI_MESSAGE_SENT: 'ai:message_sent',
  AI_MESSAGE_RECEIVED: 'ai:message_received',

  // Social
  COMMENT_ADDED: 'social:comment_added',
  USER_FOLLOWED: 'social:user_followed',
  CONTENT_SHARED: 'social:content_shared',

  // Notifications
  NOTIFICATION_RECEIVED: 'notification:received',
  NOTIFICATION_READ: 'notification:read',

  // UI
  MODAL_OPENED: 'ui:modal_opened',
  MODAL_CLOSED: 'ui:modal_closed',
  TOAST_SHOWN: 'ui:toast_shown',
  DRAWER_OPENED: 'ui:drawer_opened',
  DRAWER_CLOSED: 'ui:drawer_closed',

  // System
  APP_READY: 'app:ready',
  APP_ERROR: 'app:error',
  NETWORK_ONLINE: 'network:online',
  NETWORK_OFFLINE: 'network:offline',
};

// Convenience methods
export const on = (event, callback) => eventBus.on(event, callback);
export const once = (event, callback) => eventBus.once(event, callback);
export const off = (event, callback) => eventBus.off(event, callback);
export const emit = (event, ...args) => eventBus.emit(event, ...args);
export const clear = (event) => eventBus.clear(event);

export default eventBus;
