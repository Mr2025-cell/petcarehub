import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import TrackingSession from '../classes/TrackingSession';
import TaskList from '../components/TaskList';
import OfflineIndicator from '../components/OfflineIndicator';
import gpsService from '../services/gpsService';
import { MapPin, Clock, AlertCircle, CheckCircle, Activity, WifiOff, Maximize2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './ActiveSession.module.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to auto-center map on new location
function SetViewOnLocation({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 15);
    }
  }, [location, map]);
  return null;
}

const ActiveSession = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const effectiveBookingId = bookingId || 'booking_default';
  
  const [session, setSession] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [shareLocation, setShareLocation] = useState(false);
  const [error, setError] = useState(null);
  const [mapExpanded, setMapExpanded] = useState(false);

  useEffect(() => {
    const mockTasks = [
      {
        taskId: '1',
        type: 'walk',
        instructions: 'Take dog for 30 min walk around the park',
        scheduledTime: new Date().toISOString(),
        frequency: 'daily'
      },
      {
        taskId: '2',
        type: 'feed',
        instructions: 'Feed 1 cup of dry food',
        scheduledTime: new Date(Date.now() + 3600000).toISOString(),
        frequency: 'daily'
      },
      {
        taskId: '3',
        type: 'medication',
        instructions: 'Give allergy medication with food',
        scheduledTime: new Date(Date.now() + 7200000).toISOString(),
        frequency: 'daily'
      }
    ];
    setTasks(mockTasks);
  }, [effectiveBookingId]);

  useEffect(() => {
    let interval;
    if (isActive && session) {
      interval = setInterval(() => {
        setDuration(session.getDuration());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, session]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      gpsService.syncOfflinePoints();
    };
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Enable automatic location sharing for the owner
  const enableLocationSharing = async (sessionId, caregiverId) => {
    try {
      // Remove any existing session for this caregiver first
      const existingSessions = JSON.parse(localStorage.getItem('active_sharing_sessions') || '[]');
      const filteredSessions = existingSessions.filter(s => s.caregiverId !== caregiverId);
      
      const sharingData = {
        sessionId: sessionId,
        caregiverId: caregiverId,
        bookingId: effectiveBookingId,
        isSharing: true,
        startTime: new Date().toISOString()
      };
      
      // ✅ ADD THIS MISSING LINE - Saves individual session data
      localStorage.setItem(`live_sharing_${sessionId}`, JSON.stringify(sharingData));
      
      // Add new session to filtered list
      filteredSessions.push(sharingData);
      localStorage.setItem('active_sharing_sessions', JSON.stringify(filteredSessions));
      
      console.log('✅ Location sharing automatically enabled for session:', sessionId);
      console.log('Saved live_sharing_ data:', localStorage.getItem(`live_sharing_${sessionId}`));
    } catch (error) {
      console.error('Failed to enable location sharing:', error);
    }
  };

  // Disable location sharing when session ends
  const disableLocationSharing = (sessionId) => {
    localStorage.removeItem(`live_sharing_${sessionId}`);
    
    const activeShares = JSON.parse(localStorage.getItem('active_sharing_sessions') || '[]');
    const updated = activeShares.filter(s => s.sessionId !== sessionId);
    localStorage.setItem('active_sharing_sessions', JSON.stringify(updated));
    
    console.log('✅ Location sharing automatically disabled for session:', sessionId);
  };

  const startSession = async () => {
    try {
      const sessionId = `session_${Date.now()}`;
      const caregiverId = currentUser?.id || localStorage.getItem('userId') || 'caregiver_001';
      
      // ✅ FIX 1: Remove any existing unfinished sessions for this caregiver
      const existingSessions = JSON.parse(localStorage.getItem('active_sharing_sessions') || '[]');
      const filteredSessions = existingSessions.filter(s => s.caregiverId !== caregiverId);
      
      if (filteredSessions.length !== existingSessions.length) {
        console.log('Removing old session for this caregiver');
        localStorage.setItem('active_sharing_sessions', JSON.stringify(filteredSessions));
        
        // Also clean up old location data
        existingSessions.forEach(session => {
          localStorage.removeItem(`live_location_${session.sessionId}`);
          localStorage.removeItem(`live_sharing_${session.sessionId}`);
        });
      }
      
      const newSession = new TrackingSession(sessionId, effectiveBookingId, caregiverId);
      newSession.start();
      setSession(newSession);
      setIsActive(true);
      setError(null);
      
      gpsService.startTracking(
        newSession,
        (location, isOfflineMode = false) => {
          setCurrentLocation(location);
          setError(null);
          
          // If sharing is enabled, store the location for owner to see
          if (shareLocation) {
            const currentSharingData = {
              ...location,
              sessionId: sessionId,
              caregiverId: caregiverId,
              timestamp: new Date().toISOString()
            };
            localStorage.setItem(`live_location_${sessionId}`, JSON.stringify(currentSharingData));
          }
          
          if (isOfflineMode) {
            console.log('GPS point cached offline');
          }
        },
        (err) => {
          console.error('GPS error:', err);
          setError('Unable to access GPS. Please enable location services.');
        }
      );
      
      // Automatically enable location sharing for owner if checkbox is checked
      if (shareLocation) {
        await enableLocationSharing(sessionId, caregiverId);
      }
      
    } catch (error) {
      console.error('Failed to start session:', error);
      setError('Failed to start session. Please try again.');
    }
  };

  const endSession = async () => {
    if (session && session.isActive()) {
      session.end();
      gpsService.stopTracking();
      setIsActive(false);
      
      // Automatically disable location sharing
      if (shareLocation) {
        disableLocationSharing(session.sessionId);
        localStorage.removeItem(`live_location_${session.sessionId}`);
      }
      
      setShareLocation(false);
      
      console.log('Session ended:', session.toJSON());
      navigate('/');
    }
  };

  const handleTaskCompleted = (task, completion) => {
    setCompletedTasks(prev => [...prev, completion]);
    console.log('Task completed:', task.type, completion);
  };

  const toggleLocationSharing = () => {
    const newState = !shareLocation;
    setShareLocation(newState);
    
    // If session is already active, enable/disable sharing immediately
    if (session && session.isActive()) {
      if (newState) {
        enableLocationSharing(session.sessionId, session.caregiverId);
      } else {
        disableLocationSharing(session.sessionId);
        localStorage.removeItem(`live_location_${session.sessionId}`);
      }
    }
  };

  const progress = tasks.length > 0 
    ? (completedTasks.length / tasks.length) * 100 
    : 0;

  const formatDuration = (minutes) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className={styles.container}>
      {isOffline && <OfflineIndicator />}
      
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Active Care Session</h1>
          {isActive && (
            <div className={styles.liveBadge}>
              <Activity size={14} /> LIVE
            </div>
          )}
        </div>
        <Button variant="danger" size="sm" className={styles.sosButton}>
          <AlertCircle size={16} /> SOS
        </Button>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {!isActive ? (
        <Card className={styles.startCard}>
          <div className={styles.startCardContent}>
            <h2>Ready to start?</h2>
            <p>You are about to start a care session for this booking.</p>
            
            <div className={styles.shareToggleCard}>
              <label className={styles.shareToggleLabel}>
                <input 
                  type="checkbox" 
                  checked={shareLocation}
                  onChange={toggleLocationSharing}
                />
                <span>📍 Share live location with pet owner</span>
              </label>
              <p className={styles.shareToggleHint}>
                Owner will be able to track your location in their dashboard automatically
              </p>
            </div>
            
            <Button onClick={startSession} size="lg" className={styles.startButton}>
              ▶ Start Session
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className={styles.statusBar}>
            <div className={styles.statusItem}>
              <Clock size={18} />
              <span>{formatDuration(duration)}</span>
            </div>
            <div className={styles.statusItem}>
              <MapPin size={18} />
              <span>{currentLocation ? 'GPS Active' : 'Waiting for GPS...'}</span>
            </div>
            {isOffline && (
              <div className={`${styles.statusItem} ${styles.offlineStatus}`}>
                <WifiOff size={18} />
                <span>Offline Mode</span>
              </div>
            )}
          </div>

          {/* Location Card with Map */}
          <Card className={styles.locationCard}>
            <div className={styles.locationHeader}>
              <MapPin size={20} className={styles.locationIcon} />
              <h3>Live Location Tracking</h3>
              <button 
                className={styles.expandMapBtn}
                onClick={() => setMapExpanded(!mapExpanded)}
                title="Expand map"
              >
                <Maximize2 size={16} />
              </button>
            </div>
            
            {/* Interactive Map */}
            <div className={`${styles.mapContainer} ${mapExpanded ? styles.mapExpanded : ''}`}>
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
                        <strong>Current Location</strong>
                        <br />
                        Lat: {currentLocation.latitude.toFixed(6)}
                        <br />
                        Lng: {currentLocation.longitude.toFixed(6)}
                        <br />
                        <span className={styles.popupTime}>Live update every second</span>
                      </div>
                    </Popup>
                  </Marker>
                  <SetViewOnLocation location={currentLocation} />
                </MapContainer>
              ) : (
                <div className={styles.mapPlaceholder}>
                  <MapPin size={48} className={styles.mapPlaceholderIcon} />
                  <p>Waiting for GPS signal...</p>
                </div>
              )}
            </div>

            {/* Coordinates Display */}
            {currentLocation && (
              <div className={styles.locationCoords}>
                <div className={styles.coordRow}>
                  <span className={styles.coordLabel}>Latitude:</span>
                  <code className={styles.coordValue}>{currentLocation.latitude.toFixed(6)}</code>
                </div>
                <div className={styles.coordRow}>
                  <span className={styles.coordLabel}>Longitude:</span>
                  <code className={styles.coordValue}>{currentLocation.longitude.toFixed(6)}</code>
                </div>
                <p className={styles.locationUpdateHint}>📍 Live updates every second</p>
              </div>
            )}
            
            {!currentLocation && (
              <p className={styles.loadingLocation}>Waiting for GPS signal...</p>
            )}
            
            {/* Automatic Sharing Indicator */}
            {shareLocation && (
              <div className={styles.sharingActiveIndicator}>
                <CheckCircle size={16} className={styles.sharingIcon} />
                <span>📍 Location sharing active - Owner can see your location in their dashboard</span>
              </div>
            )}
          </Card>

          <TaskList 
            tasks={tasks}
            sessionId={session?.sessionId}
            onTaskCompleted={handleTaskCompleted}
          />

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>Session Progress</span>
              <span className={styles.progressCount}>
                {completedTasks.length}/{tasks.length} tasks completed
              </span>
            </div>
            <div className={styles.progressBarContainer}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Button 
            variant="danger" 
            size="lg" 
            onClick={endSession} 
            fullWidth
            className={styles.endButton}
          >
            ⏹ End Session
          </Button>
        </>
      )}
    </div>
  );
};

export default ActiveSession;