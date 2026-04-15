import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { mockPets } from '../data/mockData';
import { Dog, CalendarCheck, AlertTriangle, Syringe, Info, MapPin, Check, RotateCcw } from 'lucide-react';
import styles from './OwnerDashboard.module.css';

export function OwnerDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // load care plans + tasks from localStorage
  const [carePlans, setCarePlans] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const savedPlans = localStorage.getItem('petminder_careplans');
    const savedTasks = localStorage.getItem('petminder_tasks');
    setCarePlans(savedPlans ? JSON.parse(savedPlans) : []);
    setTasks(savedTasks ? JSON.parse(savedTasks) : []);
  }, []);

  // Track active caregiver sessions for live tracking
  const [activeSessions, setActiveSessions] = useState([]);

  useEffect(() => {
    const checkActiveSharing = () => {
      try {
        const activeShares = JSON.parse(localStorage.getItem('active_sharing_sessions') || '[]');
        setActiveSessions(activeShares);
      } catch (error) {
        console.error('Error checking active sessions:', error);
      }
    };
    
    checkActiveSharing();
    const interval = setInterval(checkActiveSharing, 5000);
    return () => clearInterval(interval);
  }, []);

  // toggle task status between pending and completed
  function handleToggleTask(taskId) {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: t.status === 'completed' ? 'pending' : 'completed' };
      }
      return t;
    });
    setTasks(updated);
    localStorage.setItem('petminder_tasks', JSON.stringify(updated));
  }

  // only show tasks from active plans whose date range covers today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const activePlanIds = carePlans
    .filter(p => {
      if ((p.status || 'active') !== 'active') return false;
      const start = p.startDate ? new Date(p.startDate) : null;
      const end = p.endDate ? new Date(p.endDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(0, 0, 0, 0);
      if (start && today < start) return false;
      if (end && today > end) return false;
      return true;
    })
    .map(p => p.id);
  const todayTasks = tasks.filter(t => activePlanIds.includes(t.carePlanId));

  // Determine time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="container">
      {/* Welcome Hero Area */}
      <div className={styles.welcomeHero}>
        <div className={styles.welcomeText}>
          <h2>{greeting}, {currentUser?.firstName || 'there'}!</h2>
          <p>Here's what's happening with your pets today.</p>
        </div>
        <div className={styles.quickActions}>
          <Button variant="secondary" onClick={() => navigate('/search')}>
            <MapPin size={16} /> Find Caregiver
          </Button>
          <Button onClick={() => navigate('/pets/add')}>+ Add New Pet</Button>
          <Button 
            variant="outline" 
            onClick={() => {
              // Reload active sessions from localStorage
              const activeShares = JSON.parse(localStorage.getItem('active_sharing_sessions') || '[]');
              setActiveSessions(activeShares);
            }}
          >
            <RotateCcw size={14} /> Show Live Tracking
          </Button>
        </div>
      </div>

      {/* Live Tracking Card - Shows when caregiver has active session */}
      {activeSessions.length > 0 && (
        <Card className={styles.liveTrackingCard}>
          <div className={styles.liveTrackingHeader}>
            <MapPin size={20} className={styles.liveTrackingIcon} />
            <h3>Live Tracking Active</h3>
            <span className={styles.liveBadge}>LIVE</span>
          </div>
          <p className={styles.liveTrackingText}>
            Your caregiver is currently active. Track their location in real-time.
          </p>
          {activeSessions.map(session => (
            <div key={session.sessionId} className={styles.trackingSessionItem}>
              <div className={styles.sessionInfo}>
                <span className={styles.sessionLabel}>Session ID:</span>
                <code className={styles.sessionCode}>{session.sessionId}</code>
              </div>
              <div className={styles.sessionTime}>
                Started: {new Date(session.startTime).toLocaleTimeString()}
              </div>
              <Button 
                size="sm" 
                onClick={() => navigate(`/track-caregiver/${session.sessionId}`)}
                className={styles.trackButton}
              >
                <MapPin size={14} /> View Live Location
              </Button>
            </div>
          ))}
        </Card>
      )}

      <div className={styles.layoutGrid}>
        {/* LEFT COLUMN: Pets Layout */}
        <div className={styles.mainColumn}>
          <div className={styles.sectionHeader}>
            <h3><Dog size={22} className={styles.iconPrimary} /> My Pets Detail</h3>
          </div>
          <div className={styles.petList}>
            {mockPets.map(pet => (
              <Card key={pet.id} className={styles.petCardDetailed} hoverable onClick={() => navigate(`/pets/${pet.id}`)}>
                <div className={styles.petImageContainer}>
                  {pet.profileImageUrl ? (
                    <img src={pet.profileImageUrl} alt={pet.name} className={styles.petImage} />
                  ) : (
                    <div className={styles.petPlaceholder}><Dog size={48} /></div>
                  )}
                  <div className={styles.petTags}>
                    <span className={styles.tag}>{pet.breed}</span>
                    <span className={styles.tag}>{pet.age} yrs</span>
                  </div>
                </div>
                
                <div className={styles.petInfoDetailed}>
                  <div className={styles.petHeaderInfo}>
                    <h4>{pet.name}</h4>
                    <span className={styles.weightBadge}>{pet.weight} lbs</span>
                  </div>
                  
                  <div className={styles.petDetailsGrid}>
                    <div className={styles.detailItem}>
                      <Syringe size={16} className={styles.detailIconWarning} />
                      <div>
                        <strong>Primary Vet</strong>
                        <span>{pet.primaryVet?.name} ({pet.primaryVet?.clinicName})</span>
                        <span className={styles.phoneLink}>{pet.primaryVet?.phoneNumber}</span>
                      </div>
                    </div>
                    
                    <div className={styles.detailItem}>
                      <Info size={16} className={styles.detailIconInfo} />
                      <div>
                        <strong>Special notes</strong>
                        <span>{pet.specialInstructions || "None"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.petCardActions}>
                    <Button variant="outline" size="sm">Edit Profile</Button>
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/care-plans/new?petId=${pet.id}`); }}>Care Plans</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Tasks and Care Plans */}
        <div className={styles.sideColumn}>
          <div className={styles.widget}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.alertHeader}><AlertTriangle size={20} /> Today's Needs</h3>
            </div>
            <div className={styles.list}>
              {todayTasks.map(task => {
                const isDone = task.status === 'completed';
                return (
                  <div key={task.id} className={styles.taskItem}>
                    <div className={styles.taskTime}>{task.timeOfDay}</div>
                    <div className={styles.taskContent}>
                      <strong style={isDone ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>
                        {task.title}
                      </strong>
                      <span>{task.description}</span>
                    </div>
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={styles.taskStatus}
                      style={{
                        cursor: 'pointer',
                        background: isDone ? '#d1fae5' : '#f3f4f6',
                        color: isDone ? '#059669' : '#6b7280',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {isDone ? <><Check size={14} /> Done</> : <><RotateCcw size={14} /> Todo</>}
                    </button>
                  </div>
                );
              })}
              {todayTasks.length === 0 && <p className={styles.emptyState}>All caught up!</p>}
            </div>
          </div>

          <div className={styles.widget}>
            <div className={styles.sectionHeader}>
              <h3><CalendarCheck size={20} className={styles.iconPrimary} /> Active Plans</h3>
            </div>
            <div className={styles.list}>
              {carePlans.length > 0 ? carePlans.map(plan => {
                const pet = mockPets.find(p => p.id === plan.petId);
                return (
                  <div key={plan.id} className={styles.planItem}>
                    <div className={styles.planContent}>
                      <strong>{plan.title}</strong>
                      <span>{pet ? pet.name : 'Unknown pet'} — {plan.description || 'No description'}</span>
                    </div>
                    <span className={styles.statusBadgeActive}>{plan.status || 'Active'}</span>
                  </div>
                );
              }) : (
                <p className={styles.emptyState}>No care plans yet.</p>
              )}
            </div>
            <Button variant="outline" fullWidth className={styles.marginTop} onClick={() => navigate('/care-plans/new')}>+ New Care Plan</Button>
          </div>
        </div>
      </div>
    </div>
  );
}