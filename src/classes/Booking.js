import { Payment } from './Payment';

export class Booking {
  constructor({
    id,
    caregiverId,
    caregiverName,
    price = 0,
    status = 'Confirmed',
    createdAt,
    sessionDate = null,
    payment = null,
  } = {}) {
    this.id = id || `bk_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    this.caregiverId = caregiverId || '';
    this.caregiverName = caregiverName || '';
    this.price = Number(price) || 0;
    this.status = status; // 'Confirmed' | 'Cancelled'
    this.createdAt = createdAt || new Date().toISOString();
    this.sessionDate = sessionDate; // ISO string or null
    this.payment = payment
      ? new Payment(payment)
      : new Payment({ amount: this.price, status: 'Pending', method: 'Mock' });
  }
}

