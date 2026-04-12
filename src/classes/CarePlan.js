// CarePlan.js - class for managing pet care plans

export class CarePlan {
  constructor(petId, title, description, startDate, endDate) {
    this.id = crypto.randomUUID();
    this.petId = petId;
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = 'active';   // active, paused, completed
    this.tasks = [];          // array of task ids
    this.createdAt = new Date().toISOString();
  }

  // add a task to this plan
  addTask(taskId) {
    if (!this.tasks.includes(taskId)) {
      this.tasks.push(taskId);
    }
  }

  // remove a task from this plan
  removeTask(taskId) {
    this.tasks = this.tasks.filter(id => id !== taskId);
  }

  // pause the plan temporarily
  pause() {
    this.status = 'paused';
  }

  // resume the plan
  resume() {
    this.status = 'active';
  }

  // mark plan as completed
  complete() {
    this.status = 'completed';
  }
}
