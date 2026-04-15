class TaskCompletion {
  constructor(taskId, taskType) {
    this._completionId = this._generateId();
    this._taskId = taskId;
    this._taskType = taskType;
    this._completedAt = null;
    this._photoUrl = null;
    this._notes = '';
    this._requiresPhoto = (taskType === 'walk');
  }

  _generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  complete(photoUrl = null, notes = '') {
    if (this._requiresPhoto && !photoUrl) {
      throw new Error('Photo upload is required for walk completion');
    }
    this._completedAt = new Date();
    this._photoUrl = photoUrl;
    this._notes = notes;
  }

  get completionId() {
    return this._completionId;
  }

  get taskId() {
    return this._taskId;
  }

  get taskType() {
    return this._taskType;
  }

  get completedAt() {
    return this._completedAt;
  }

  get photoUrl() {
    return this._photoUrl;
  }

  get notes() {
    return this._notes;
  }

  get requiresPhoto() {
    return this._requiresPhoto;
  }

  isCompleted() {
    return this._completedAt !== null;
  }

  toJSON() {
    return {
      completionId: this._completionId,
      taskId: this._taskId,
      taskType: this._taskType,
      completedAt: this._completedAt,
      photoUrl: this._photoUrl,
      notes: this._notes,
      requiresPhoto: this._requiresPhoto
    };
  }
}

export default TaskCompletion;