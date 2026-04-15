class GPSCoordinate {
  constructor(latitude, longitude, timestamp = new Date()) {
    this._latitude = latitude;
    this._longitude = longitude;
    this._timestamp = timestamp;
    this._synced = false;
  }

  get latitude() {
    return this._latitude;
  }

  get longitude() {
    return this._longitude;
  }

  get timestamp() {
    return this._timestamp;
  }

  get synced() {
    return this._synced;
  }

  markSynced() {
    this._synced = true;
  }

  toJSON() {
    return {
      latitude: this._latitude,
      longitude: this._longitude,
      timestamp: this._timestamp,
      synced: this._synced
    };
  }

  static fromJSON(data) {
    const point = new GPSCoordinate(data.latitude, data.longitude, new Date(data.timestamp));
    if (data.synced) point.markSynced();
    return point;
  }
}

export default GPSCoordinate;