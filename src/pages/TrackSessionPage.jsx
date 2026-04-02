import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AlertCircle, MapPin, Camera } from 'lucide-react';
import styles from './TrackSessionPage.module.css';

export function TrackSessionPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Live Session Tracking</h2>
        <Button variant="danger" size="sm">
          <AlertCircle size={16} /> SOS
        </Button>
      </div>

      <div className={styles.mapPlaceholder}>
        <MapPin size={48} className={styles.mapIcon} />
        <p>Interactive Map Simulation</p>
        <span className={styles.offlineWarning}>Offline capabilities enabled</span>
      </div>

      <div className={styles.controls}>
        <Card className={styles.activeTask}>
          <h3>Current Task: 30 Min Walk</h3>
          <p>Started at 14:00 PM</p>
          
          <div className={styles.actions}>
            <Button variant="outline"><Camera size={16} /> Upload Photo</Button>
            <Button onClick={() => navigate('/')}>End Session</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
