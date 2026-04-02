import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { mockPets, mockCarePlans, mockTasks } from '../data/mockData';
import { Dog, CalendarCheck, AlertTriangle, Syringe, Info, MapPin } from 'lucide-react';
import styles from './OwnerDashboard.module.css';

export function OwnerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container">
      {/* Welcome Hero Area */}
      <div className={styles.welcomeHero}>
        <div className={styles.welcomeText}>
          <h2>Good Afternoon, Alice!</h2>
          <p>Here's what's happening with your pets today.</p>
        </div>
        <div className={styles.quickActions}>
          <Button variant="secondary" onClick={() => navigate('/search')}>
            <MapPin size={16} /> Find Caregiver
          </Button>
          <Button onClick={() => navigate('/pets/add')}>+ Add New Pet</Button>
        </div>
      </div>

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
                  
                  {/* Detailed Information from mock data */}
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
                    <Button variant="outline" size="sm">Care Plans</Button>
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
              {mockTasks.map(task => (
                <div key={task.id} className={styles.taskItem}>
                  <div className={styles.taskTime}>{task.timeOfDay}</div>
                  <div className={styles.taskContent}>
                    <strong>{task.title}</strong>
                    <span>{task.description}</span>
                  </div>
                  <div className={styles.taskStatus}>Todo</div>
                </div>
              ))}
              {mockTasks.length === 0 && <p className={styles.emptyState}>All caught up!</p>}
            </div>
            <Button variant="outline" fullWidth className={styles.marginTop}>View Full Schedule</Button>
          </div>

          <div className={styles.widget}>
            <div className={styles.sectionHeader}>
              <h3><CalendarCheck size={20} className={styles.iconPrimary} /> Active Plans</h3>
            </div>
            <div className={styles.list}>
              {mockCarePlans.map(plan => (
                <div key={plan.id} className={styles.planItem}>
                  <div className={styles.planContent}>
                    <strong>{plan.title}</strong>
                    <span>{plan.description}</span>
                  </div>
                  <span className={styles.statusBadgeActive}>Active</span>
                </div>
              ))}
            </div>
            <Button variant="outline" fullWidth className={styles.marginTop}>Manage Plans</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
