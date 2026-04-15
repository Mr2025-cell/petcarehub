class TrackingSession {
  constructor(sessionId, bookingId, caregiverId) {
    this._sessionId = sessionId;
    this._bookingId = bookingId;
    this._caregiverId = caregiverId;
    this._startTime = null;
    this._endTime = null;
    this._gpsPoints = [];
    this._isActive = false;
  }

  start() {
    this._startTime = new Date();
    this._isActive = true;
    this._gpsPoints = [];
    return this._startTime;
  }

  end() {
    this._endTime = new Date();
    this._isActive = false;
    return this._endTime;
  }

  addGPSPoint(latitude, longitude) {
    if (!this._isActive) {
      throw new Error('Session not active');
    }
    const point = new GPSCoordinate(latitude, longitude);
    this._gpsPoints.push(point);
    return point;
  }

  getGPSPoints() {
    return [...this._gpsPoints];
  }

  getUnsyncedPoints() {
    return this._gpsPoints.filter(point => !point.synced);
  }

  getDuration() {
    if (!this._startTime) return 0;
    const end = this._endTime || new Date();
    return Math.round((end - this._startTime) / 1000 / 60);
  }

  isActive() {
    return this._isActive;
  }

  get startTime() {
    return this._startTime;
  }

  get endTime() {
    return this._endTime;
  }

  get sessionId() {
    return this._sessionId;
  }

  get bookingId() {
    return this._bookingId;
  }

  toJSON() {
    return {
      sessionId: this._sessionId,
      bookingId: this._bookingId,
      caregiverId: this._caregiverId,
      startTime: this._startTime,
      endTime: this._endTime,
      gpsPoints: this._gpsPoints.map(p => p.toJSON()),
      isActive: this._isActive
    };
  }
}

export default TrackingSession;