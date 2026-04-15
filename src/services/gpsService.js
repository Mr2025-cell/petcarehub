import localforage from 'localforage';

localforage.config({
  name: 'PetCareHub',
  storeName: 'gps_tracking'
});

class GPSService {
  constructor() {
    this.watchId = null;
    this.currentSession = null;
    this.isTracking = false;
    this.offlineQueue = [];
    this.loadOfflineQueue();
  }

  async loadOfflineQueue() {
    try {
      const stored = await localforage.getItem('offlineGPSQueue');
      if (stored) {
        this.offlineQueue = stored;
        this.updateOfflineIndicator();
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }

  async saveOfflineQueue() {
    try {
      await localforage.setItem('offlineGPSQueue', this.offlineQueue);
      this.updateOfflineIndicator();
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  updateOfflineIndicator() {
    const event = new CustomEvent('offline-points-update', {
      detail: { count: this.offlineQueue.length }
    });
    window.dispatchEvent(event);
  }

  startTracking(session, onLocationUpdate, onError) {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported by your browser');
      return;
    }

    this.currentSession = session;
    this.isTracking = true;

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const gpsPoint = { latitude, longitude, timestamp: new Date().toISOString() };
        
        if (navigator.onLine) {
          this.syncToServer(gpsPoint);
          onLocationUpdate(gpsPoint);
        } else {
          this.addToOfflineQueue(gpsPoint);
          onLocationUpdate(gpsPoint, true);
        }
      },
      onError,
      options
    );

    return this.watchId;
  }

  stopTracking() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
    this.currentSession = null;
  }

  async addToOfflineQueue(point) {
    this.offlineQueue.push({
      ...point,
      sessionId: this.currentSession?.sessionId,
      synced: false
    });
    await this.saveOfflineQueue();
  }

  async syncOfflinePoints() {
    if (!navigator.onLine) {
      console.log('Still offline, sync deferred');
      return;
    }

    if (this.offlineQueue.length === 0) {
      console.log('No offline points to sync');
      return;
    }

    console.log(`Syncing ${this.offlineQueue.length} offline points...`);

    const unsynced = [...this.offlineQueue];
    let syncedCount = 0;

    for (const point of unsynced) {
      try {
        await this.syncToServer(point);
        this.offlineQueue = this.offlineQueue.filter(p => p !== point);
        syncedCount++;
      } catch (error) {
        console.error('Failed to sync point:', error);
      }
    }

    await this.saveOfflineQueue();
    console.log(`Synced ${syncedCount} points`);

    return syncedCount;
  }

  async syncToServer(point) {
    console.log('Syncing point to server:', point);
    return new Promise((resolve) => {
      setTimeout(() => resolve(point), 100);
    });
  }

  setupAutoSync() {
    window.addEventListener('online-sync', () => {
      console.log('Connection restored, syncing offline data...');
      this.syncOfflinePoints();
    });
  }

  isTrackingActive() {
    return this.isTracking;
  }

  getOfflineQueueSize() {
    return this.offlineQueue.length;
  }
}

const gpsService = new GPSService();
gpsService.setupAutoSync();

export default gpsService;