// Task.js - class for storing task data in each care plan

export class Task {
  constructor(carePlanId, title, description, timeOfDay, isRecurring = false, recurrence = 'daily') {
    this.id = crypto.randomUUID();
    this.carePlanId = carePlanId;
    this.title = title;
    this.description = description;
    this.timeOfDay = timeOfDay;       // e.g. "08:00", "14:00"
    this.isRecurring = isRecurring;   // whether this task repeats
    this.recurrence = recurrence;     // daily, weekly, monthly
    this.status = 'pending';          // pending, completed, skipped
    this.createdAt = new Date().toISOString();
  }

  // mark task as completed
  markComplete() {
    this.status = 'completed';
  }

  // skip this task
  skip() {
    this.status = 'skipped';
  }

  // reset status back to pending (used when recurring task creates a new cycle)
  resetStatus() {
    this.status = 'pending';
  }
}
