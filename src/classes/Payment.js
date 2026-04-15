export class Payment {
  constructor({ amount = 0, status = 'Pending', method = 'Mock', last4 = '' } = {}) {
    this.amount = Number(amount) || 0;
    this.status = status; // 'Pending' | 'Paid' | 'Failed'
    this.method = method; // e.g. 'Card' | 'Cash' | 'Mock'
    this.last4 = last4 ? String(last4).slice(-4) : '';
  }
}

