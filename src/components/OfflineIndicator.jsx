import React, { useState, useEffect } from 'react';
import './OfflineIndicator.module.css';

const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [offlinePointsCount, setOfflinePointsCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      window.dispatchEvent(new CustomEvent('online-sync'));
    };
    
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const loadOfflineCount = () => {
      const stored = localStorage.getItem('offlineGPSPoints');
      if (stored) {
        const points = JSON.parse(stored);
        setOfflinePointsCount(points.length);
      }
    };

    loadOfflineCount();
    
    const handlePointsUpdate = (e) => {
      setOfflinePointsCount(e.detail.count);
    };
    window.addEventListener('offline-points-update', handlePointsUpdate);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('offline-points-update', handlePointsUpdate);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="offline-indicator">
      <div className="offline-icon">📡</div>
      <div className="offline-message">
        <strong>Offline Mode Active</strong>
        <span>GPS data is being cached locally. Will auto-sync when connection returns.</span>
        {offlinePointsCount > 0 && (
          <span className="offline-count">{offlinePointsCount} points cached</span>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;