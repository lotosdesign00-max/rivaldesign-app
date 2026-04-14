/**
 * ANALYTICS SYSTEM
 * Track user behavior and app performance
 */

import { emit, EVENTS } from './events';
import storage from './storage';

class Analytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.events = [];
    this.maxEvents = 1000;
    this.flushInterval = 60000; // 1 minute

    this.startSession();
    this.setupAutoFlush();
  }

  // Generate unique session ID
  generateSessionId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Start new session
  startSession() {
    this.track('session_start', {
      sessionId: this.sessionId,
      timestamp: this.sessionStart,
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    });
  }

  // Track event
  track(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        url: window.location.href,
        referrer: document.referrer,
      },
    };

    this.events.push(event);

    // Trim if too many events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Save to storage
    this.saveEvents();

    // Emit for real-time listeners
    emit(EVENTS.APP_ERROR, event);
  }

  // Track page view
  pageView(page, properties = {}) {
    this.track('page_view', {
      page,
      ...properties,
    });
  }

  // Track user action
  action(action, properties = {}) {
    this.track('user_action', {
      action,
      ...properties,
    });
  }

  // Track error
  error(error, context = {}) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  // Track performance
  performance(metric, value, properties = {}) {
    this.track('performance', {
      metric,
      value,
      ...properties,
    });
  }

  // Track timing
  timing(category, variable, time, properties = {}) {
    this.track('timing', {
      category,
      variable,
      time,
      ...properties,
    });
  }

  // Get session duration
  getSessionDuration() {
    return Date.now() - this.sessionStart;
  }

  // Get events
  getEvents(filter = null) {
    if (!filter) return this.events;

    return this.events.filter(event => {
      if (typeof filter === 'string') {
        return event.name === filter;
      }
      if (typeof filter === 'function') {
        return filter(event);
      }
      return true;
    });
  }

  // Get event count
  getEventCount(eventName = null) {
    if (!eventName) return this.events.length;
    return this.getEvents(eventName).length;
  }

  // Get analytics summary
  getSummary() {
    const summary = {
      sessionId: this.sessionId,
      sessionDuration: this.getSessionDuration(),
      totalEvents: this.events.length,
      eventTypes: {},
      topEvents: [],
    };

    // Count event types
    this.events.forEach(event => {
      summary.eventTypes[event.name] = (summary.eventTypes[event.name] || 0) + 1;
    });

    // Get top events
    summary.topEvents = Object.entries(summary.eventTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return summary;
  }

  // Save events to storage
  saveEvents() {
    storage.set('analytics_events', this.events, {
      ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  // Load events from storage
  loadEvents() {
    const saved = storage.get('analytics_events', []);
    this.events = saved;
  }

  // Flush events (send to server)
  async flush() {
    if (this.events.length === 0) return;

    // In a real app, send to analytics server
    console.log('Flushing analytics:', this.getSummary());

    // For now, just keep in storage
    this.saveEvents();
  }

  // Setup auto-flush
  setupAutoFlush() {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  // Clear all events
  clear() {
    this.events = [];
    storage.remove('analytics_events');
  }
}

// Create singleton
const analytics = new Analytics();

// Convenience methods
export const track = (event, properties) => analytics.track(event, properties);
export const pageView = (page, properties) => analytics.pageView(page, properties);
export const action = (action, properties) => analytics.action(action, properties);
export const trackError = (error, context) => analytics.error(error, context);
export const trackPerformance = (metric, value, properties) => analytics.performance(metric, value, properties);
export const trackTiming = (category, variable, time, properties) => analytics.timing(category, variable, time, properties);
export const getAnalyticsSummary = () => analytics.getSummary();
export const clearAnalytics = () => analytics.clear();

export default analytics;
