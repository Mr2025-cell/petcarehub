import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { mockTasks } from '../data/mockData';
import { CheckCircle, MapPin } from 'lucide-react';
import styles from './MinderDashboard.module.css';

export function MinderDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className={styles.header}>
        <div>
          <h2>Minder Dashboard</h2>
          <p>Welcome! Here are your assigned tasks for today.</p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3><CheckCircle size={20} /> Today's Checklist</h3>
          </div>
          
          <div className={styles.list}>
            {mockTasks.map(task => (
              <Card key={task.id} className={styles.taskCard}>
                <div className={styles.taskInfo}>
                  <div className={styles.timeBadge}>{task.timeOfDay}</div>
                  <div>
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                  </div>
                </div>
                <div className={styles.taskActions}>
                  <Button variant="outline" size="sm" onClick={() => navigate('/session')}>
                    <MapPin size={16} /> Start Session
                  </Button>
                  <Button size="sm">Mark Complete</Button>
                </div>
              </Card>
            ))}
            
            {mockTasks.length === 0 && (
              <p>No tasks assigned for today!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
