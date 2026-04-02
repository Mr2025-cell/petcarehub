import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/Toast';
import { mockTasks } from '../data/mockData';
import { CheckCircle, MapPin, Circle } from 'lucide-react';
import styles from './MinderDashboard.module.css';

export function MinderDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  // Local task completion state — tracks which tasks have been completed
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
        addToast('Task marked as incomplete', 'info');
      } else {
        next.add(taskId);
        addToast('Task completed! Great job 🎉', 'success');
      }
      return next;
    });
  };

  const completedCount = completedTasks.size;
  const totalCount = mockTasks.length;

  return (
    <div className="container">
      <div className={styles.header}>
        <div>
          <h2>Minder Dashboard</h2>
          <p>Welcome, {currentUser?.firstName || 'Caregiver'}! Here are your assigned tasks for today.</p>
        </div>
        {totalCount > 0 && (
          <div className={styles.progressBadge}>
            {completedCount}/{totalCount} done
          </div>
        )}
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3><CheckCircle size={20} /> Today's Checklist</h3>
          </div>
          
          <div className={styles.list}>
            {mockTasks.map(task => {
              const isDone = completedTasks.has(task.id);
              return (
                <Card key={task.id} className={`${styles.taskCard} ${isDone ? styles.taskDone : ''}`}>
                  <div className={styles.taskInfo}>
                    <div className={styles.timeBadge}>{task.timeOfDay}</div>
                    <div>
                      <h4 style={isDone ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>{task.title}</h4>
                      <p>{task.description}</p>
                    </div>
                  </div>
                  <div className={styles.taskActions}>
                    {!isDone && (
                      <Button variant="outline" size="sm" onClick={() => navigate('/session')}>
                        <MapPin size={16} /> Start Session
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant={isDone ? 'outline' : 'primary'}
                      onClick={() => toggleTask(task.id)}
                    >
                      {isDone ? (
                        <><Circle size={16} /> Undo</>
                      ) : (
                        <><CheckCircle size={16} /> Mark Complete</>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
            
            {mockTasks.length === 0 && (
              <p>No tasks assigned for today!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
