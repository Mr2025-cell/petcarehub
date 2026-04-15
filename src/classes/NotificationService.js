// NotificationService.js - service for dispatching notifications and SOS alerts
// Handles in-app, browser, and (simulated) SMS/email channels with an offline queue.

import { Message } from './Message';

export class NotificationService {
  constructor() {
    this.subscribers = new Map();   // userId -> [callback, ...]
    this.queue = [];                // messages waiting to send (offline buffer)
    this.history = [];              // all sent messages for audit
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    // listen for connectivity changes to flush queue
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => { this.isOnline = false; });
    }
  }

  // subscribe a user to receive live notifications
  subscribe(userId, callback) {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, []);
    }
    this.subscribers.get(userId).push(callback);

    // return unsubscribe handle
    return () => {
      const list = this.subscribers.get(userId) || [];
      this.subscribers.set(userId, list.filter(cb => cb !== callback));
    };
  }

  // core send method - queues if offline
  async send(message) {
    if (!(message instanceof Message)) {
      throw new Error('NotificationService.send requires a Message instance');
    }

    if (!this.isOnline) {
      this.queue.push(message);
      return { queued: true, messageId: message.id };
    }

    return this.dispatch(message);
  }

  // actually deliver message to subscribers + log
  async dispatch(message) {
    try {
      message.markSent();
      const listeners = this.subscribers.get(message.recipientId) || [];
      listeners.forEach(cb => {
        try { cb(message); } catch (e) { console.error('notification listener failed', e); }
      });
      message.markDelivered();
      this.history.push(message);

      // browser notification for emergency
      if (message.isEmergency()) {
        this.showBrowserNotification(message);
      }

      return { queued: false, messageId: message.id, status: message.status };
    } catch (err) {
      message.markFailed(err.message);
      this.history.push(message);
      return { queued: false, messageId: message.id, status: 'failed', error: err.message };
    }
  }

  // high-level SOS trigger - broadcasts emergency to a list of recipients
  async triggerSOS(senderId, recipientIds, locationData, note = '') {
    const results = [];
    const content = note || 'EMERGENCY: Immediate assistance needed.';

    for (const recipientId of recipientIds) {
      const msg = new Message(senderId, recipientId, content, 'sos');
      if (locationData) msg.attachMetadata('location', locationData);
      msg.attachMetadata('triggeredAt', new Date().toISOString());
      const result = await this.send(msg);
      results.push(result);
    }
    return results;
  }

  // flush queued messages once back online
  async handleOnline() {
    this.isOnline = true;
    const pending = [...this.queue];
    this.queue = [];
    for (const msg of pending) {
      await this.dispatch(msg);
    }
  }

  // request browser notification permission (call from user gesture)
  async requestPermission() {
    if (typeof Notification === 'undefined') return 'unsupported';
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission !== 'denied') {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  }

  // fire an actual browser notification
  showBrowserNotification(message) {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission !== 'granted') return;
    try {
      new Notification(
        message.isEmergency() ? '🚨 EMERGENCY ALERT' : 'PetCareHub',
        { body: message.preview(120), tag: message.id, requireInteraction: message.isEmergency() }
      );
    } catch (e) {
      console.warn('Browser notification failed', e);
    }
  }

  // retrieve history for a user (inbox view)
  getInbox(userId) {
    return this.history
      .filter(m => m.recipientId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // pending count for badge UI
  getPendingCount() {
    return this.queue.length;
  }
}

// singleton - one service instance across the app
export const notificationService = new NotificationService();
