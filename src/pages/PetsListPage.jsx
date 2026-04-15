import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Dog, Syringe, Info, MapPin, CalendarCheck, AlertCircle } from 'lucide-react';
import styles from './PetsListPage.module.css';

function PetsListPage() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [carePlans, setCarePlans] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);

  // Load pets from localStorage
  useEffect(() => {
    const savedPets = localStorage.getItem('userPets');
    if (savedPets) {
      setPets(JSON.parse(savedPets));
    } else {
      // Load mock pets if no saved pets
      import('../data/mockData').then(({ mockPets }) => {
        setPets(mockPets);
      });
    }
  }, []);

  // Load care plans
  useEffect(() => {
    const savedPlans = localStorage.getItem('petminder_careplans');
    if (savedPlans) {
      setCarePlans(JSON.parse(savedPlans));
    }
  }, []);

  // Load active caregiver sessions
  useEffect(() => {
    const checkActiveSessions = () => {
      try {
        const sessions = JSON.parse(localStorage.getItem('active_sharing_sessions') || '[]');
        setActiveSessions(sessions);
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    };
    
    checkActiveSessions();
    const interval = setInterval(checkActiveSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get care plans for a specific pet
  const getPetCarePlans = (petId) => {
    return carePlans.filter(plan => plan.petId === petId);
  };

  // Check if pet has active caregiver session
  const hasActiveSession = (petId) => {
    // This would need to link pet to booking to session
    // For now, just show if any active session exists
    return activeSessions.length > 0;
  };

  // Helper for placeholder color
  const getPlaceholderColor = (name) => {
    const colors = ['purple', 'blue', 'green', 'orange', 'pink'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Pets</h1>
        <Button onClick={() => navigate('/pets/add')}>+ Add New Pet</Button>
      </div>

      {pets.length === 0 ? (
        <Card className={styles.emptyCard}>
          <div className={styles.emptyState}>
            <Dog size={48} className={styles.emptyIcon} />
            <h3>No pets yet</h3>
            <p>Click "Add New Pet" to get started.</p>
            <Button onClick={() => navigate('/pets/add')}>Add Your First Pet</Button>
          </div>
        </Card>
      ) : (
        <div className={styles.petsGrid}>
          {pets.map(pet => {
            const petCarePlans = getPetCarePlans(pet.id);
            const hasActiveCare = petCarePlans.length > 0;
            const hasSession = hasActiveSession(pet.id);

            return (
              <Card key={pet.id} className={styles.petCard}>
                <div className={styles.petCardHeader}>
                  <div className={styles.petImageContainer}>
                    {pet.profileImageUrl ? (
                      <img src={pet.profileImageUrl} alt={pet.name} className={styles.petImage} />
                    ) : (
                      <div className={`${styles.petPlaceholder} ${getPlaceholderColor(pet.name)}`}>
                        <div className={styles.petInitials}>
                          {pet.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={styles.petInfo}>
                    <h2>{pet.name}</h2>
                    <div className={styles.petDetails}>
                      <span className={styles.badge}>{pet.breed}</span>
                      <span className={styles.badge}>{pet.age} yrs</span>
                      <span className={styles.badge}>{pet.weight} lbs</span>
                    </div>
                  </div>
                  <div className={styles.petStatus}>
                    {hasActiveCare && (
                      <span className={styles.activePlanBadge}>
                        <CalendarCheck size={14} /> Active Plan
                      </span>
                    )}
                    {hasSession && (
                      <span className={styles.liveBadge}>
                        <MapPin size={14} /> Live
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.petDetailsGrid}>
                  <div className={styles.detailSection}>
                    <h4>
                      <Syringe size={16} /> Primary Vet
                    </h4>
                    <p><strong>Name:</strong> {pet.primaryVet?.name || 'Not set'}</p>
                    <p><strong>Clinic:</strong> {pet.primaryVet?.clinicName || 'Not set'}</p>
                    <p><strong>Phone:</strong> {pet.primaryVet?.phoneNumber || 'Not set'}</p>
                  </div>

                  <div className={styles.detailSection}>
                    <h4>
                      <Info size={16} /> Special Notes
                    </h4>
                    <p>{pet.specialInstructions || 'No special notes'}</p>
                  </div>
                </div>

                {petCarePlans.length > 0 && (
                  <div className={styles.carePlansSection}>
                    <h4>Care Plans ({petCarePlans.length})</h4>
                    <div className={styles.carePlansList}>
                      {petCarePlans.slice(0, 2).map(plan => (
                        <div key={plan.id} className={styles.carePlanItem}>
                          <span className={styles.planName}>{plan.title}</span>
                          <span className={styles.planStatus}>{plan.status || 'Active'}</span>
                        </div>
                      ))}
                      {petCarePlans.length > 2 && (
                        <div className={styles.morePlans}>
                          +{petCarePlans.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className={styles.petActions}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/pets/${pet.id}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/pets/${pet.id}/edit`)}
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/care-plans/new?petId=${pet.id}`)}
                  >
                    Care Plans
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PetsListPage;