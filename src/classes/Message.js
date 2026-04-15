// Message.js - class representing a message between users (SOS alerts, chat, system notifications)

export class Message {
  constructor(senderId, recipientId, content, type = 'chat') {
    this.id = crypto.randomUUID();
    this.senderId = senderId;
    this.recipientId = recipientId;
    this.content = content;
    this.type = type;                     // 'chat' | 'sos' | 'system' | 'alert'
    this.priority = type === 'sos' ? 'critical' : 'normal';
    this.status = 'pending';               // pending, sent, delivered, read, failed
    this.timestamp = new Date().toISOString();
    this.metadata = {};                    // e.g. location, petId, bookingId
  }

  // attach extra context (e.g. GPS coords for an SOS)
  attachMetadata(key, value) {
    this.metadata[key] = value;
  }

  // mark as sent by transport layer
  markSent() {
    this.status = 'sent';
  }

  // mark as delivered to recipient device
  markDelivered() {
    this.status = 'delivered';
  }

  // mark as read by recipient
  markRead() {
    this.status = 'read';
  }

  // mark as failed (offline, no recipient, etc.)
  markFailed(reason) {
    this.status = 'failed';
    this.metadata.failureReason = reason;
  }

  // quick check for SOS-type messages
  isEmergency() {
    return this.type === 'sos' || this.priority === 'critical';
  }

  // human-readable preview for lists
  preview(maxLength = 60) {
    if (!this.content) return '';
    return this.content.length > maxLength
      ? this.content.slice(0, maxLength) + '…'
      : this.content;
  }
}
