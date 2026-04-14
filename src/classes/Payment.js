export class Payment {
  constructor({ amount = 0, status = 'Pending', method = 'Mock' } = {}) {
    this.amount = Number(amount) || 0;
    this.status = status; // 'Pending' | 'Paid' | 'Failed'
    this.method = method; // e.g. 'Card' | 'Cash' | 'Mock'
  }
}

