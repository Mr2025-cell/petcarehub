export class Availability {
  constructor({ slots = [] } = {}) {
    this.slots = Array.isArray(slots) ? slots : [];
  }

  // Minimal helper until a scheduler UI exists.
  isAvailableForDate(date) {
    if (!date) return true;
    if (!this.slots.length) return true;
    const d = typeof date === 'string' ? date : new Date(date).toISOString();
    return this.slots.some((s) => String(s).includes(d.slice(0, 10)));
  }
}

