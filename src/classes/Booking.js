import { Payment } from './Payment';

export class Booking {
  constructor({
    id,
    caregiverId,
    caregiverName,
    price = 0,
    hourlyRate,
    startTime,
    endTime,
    durationHours,
    totalPrice,
    status = 'Confirmed',
    createdAt,
    sessionDate = null,
    payment = null,
    userEmail,
  } = {}) {
    this.id = id || `bk_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    this.caregiverId = caregiverId || '';
    this.caregiverName = caregiverName || '';
    this.price = Number(price) || 0;
    this.hourlyRate = typeof hourlyRate === 'number' ? hourlyRate : Number(hourlyRate ?? this.price) || this.price;
    this.startTime = startTime || null; // 'HH:MM' or null
    this.endTime = endTime || null; // 'HH:MM' or null
    this.durationHours = typeof durationHours === 'number' ? durationHours : Number(durationHours) || null;
    this.totalPrice = typeof totalPrice === 'number' ? totalPrice : Number(totalPrice) || null;
    this.status = status; // 'Confirmed' | 'Cancelled'
    this.createdAt = createdAt || new Date().toISOString();
    this.sessionDate = sessionDate; // ISO string or null
    this.userEmail = userEmail || undefined;
    this.payment = payment
      ? new Payment(payment)
      : new Payment({ amount: this.price, status: 'Pending', method: 'Mock' });
  }
}

