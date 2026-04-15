import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MapPin, Clock, AlertCircle, Activity } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './TrackCaregiverPage.module.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TrackCaregiverPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load session info
    const loadSessionData = () => {
      try {
        const sharingData = localStorage.getItem(`live_sharing_${sessionId}`);
        if (sharingData) {
          const data = JSON.parse(sharingData);
          setSessionInfo(data);
        } else {
          setIsActive(false);
          setError('This tracking session has ended or is no longer active.');
        }
      } catch (err) {
        console.error('Error loading session:', err);
        setError('Unable to load tracking data.');
      }
    };

    loadSessionData();

    // Get initial location
    const loadLocation = () => {
      try {
        const locationData = localStorage.getItem(`live_location_${sessionId}`);
        if (locationData) {
          const location = JSON.parse(locationData);
          setCurrentLocation(location);
        }
      } catch (err) {
        console.error('Error loading location:', err);
      }
    };

    loadLocation();

    // Listen for location updates every 2 seconds
    const interval = setInterval(() => {
      try {
        const locationData = localStorage.getItem(`live_location_${sessionId}`);
        if (locationData) {
          const location = JSON.parse(locationData);
          setCurrentLocation(location);
          setIsActive(true);
        } else {
          // No location data means session might be ended
          const sharingData = localStorage.getItem(`live_sharing_${sessionId}`);
          if (!sharingData) {
            setIsActive(false);
            clearInterval(interval);
          }
        }
      } catch (err) {
        console.error('Error updating location:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [sessionId]);

  if (error) {
    return (
      <div className={styles.container}>
        <Card className={styles.errorCard}>
          <AlertCircle size={48} className={styles.errorIcon} />
          <h2>Tracking Unavailable</h2>
          <p>{error}</p>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className={styles.container}>
        <Card className={styles.errorCard}>
          <h2>Session Ended</h2>
          <p>This tracking session has ended. The caregiver is no longer active.</p>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Live Caregiver Tracking</h1>
        <div className={styles.liveBadge}>
          <Activity size={14} /> LIVE
        </div>
      </div>

      <Card className={styles.mapCard}>
        <div className={styles.mapHeader}>
          <MapPin size={20} />
          <h3>Caregiver's Current Location</h3>
        </div>
        
        <div className={styles.mapContainer}>
          {currentLocation ? (
            <MapContainer
              center={[currentLocation.latitude, currentLocation.longitude]}
              zoom={15}
              className={styles.leafletMap}
              key={currentLocation.latitude + currentLocation.longitude}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
                <Popup>
                  <div className={styles.mapPopup}>
                    <strong>Caregiver Location</strong>
                    <br />
                    Lat: {currentLocation.latitude.toFixed(6)}
                    <br />
                    Lng: {currentLocation.longitude.toFixed(6)}
                    <br />
                    <span>Last update: {new Date(currentLocation.timestamp).toLocaleTimeString()}</span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className={styles.mapPlaceholder}>
              <MapPin size={48} />
              <p>Waiting for caregiver location...</p>
            </div>
          )}
        </div>

        {currentLocation && (
          <div className={styles.locationInfo}>
            <div className={styles.coordRow}>
              <span className={styles.coordLabel}>Latitude:</span>
              <code>{currentLocation.latitude.toFixed(6)}</code>
            </div>
            <div className={styles.coordRow}>
              <span className={styles.coordLabel}>Longitude:</span>
              <code>{currentLocation.longitude.toFixed(6)}</code>
            </div>
            <p className={styles.updateHint}>
              <Clock size={12} /> Last update: {new Date(currentLocation.timestamp).toLocaleTimeString()}
            </p>
          </div>
        )}

        {sessionInfo && (
          <div className={styles.sessionInfo}>
            <p>Session started: {new Date(sessionInfo.startTime).toLocaleTimeString()}</p>
          </div>
        )}
      </Card>

      <Button variant="outline" onClick={() => navigate('/')} className={styles.backButton}>
        ← Back to Dashboard
      </Button>
    </div>
  );
};

export default TrackCaregiverPage;