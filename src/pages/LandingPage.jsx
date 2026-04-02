import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Dog, CalendarCheck, ShieldCheck, MapPin, Star, Heart } from 'lucide-react';
import styles from './LandingPage.module.css';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Premium Care for Your <span className={styles.highlight}>Furry Family.</span>
          </h1>
          <p className={styles.subtitle}>
            Connect with highly vetted Pet Minders, manage detailed care plans, and track your pets' wellbeing in real-time with flawless transparency.
          </p>
          <div className={styles.heroButtons}>
            <Button size="lg" onClick={() => navigate('/login')}>Find a Pet Minder</Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>Become a Minder</Button>
          </div>
        </div>
        
        <div className={styles.heroImageWrapper}>
          <div className={styles.imageDecoration}></div>
          <img src="/hero_banner.png" alt="Happy Golden Retriever and Cat" className={styles.heroImage} />
          
          <div className={`${styles.floatingCard} ${styles.floatTopRight}`}>
            <Heart size={20} className={styles.heartIcon} fill="currentColor" />
            <div>
              <strong>Perfect Match</strong>
              <span>Found in 2 mins</span>
            </div>
          </div>
          
          <div className={`${styles.floatingCard} ${styles.floatBottomLeft}`}>
            <MapPin size={20} className={styles.mapIcon} />
            <div>
              <strong>Live GPS</strong>
              <span>Buddy is walking!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2>Why Choose PetMinder?</h2>
          <p>We built our platform from the ground up to guarantee trust, safety, and joy.</p>
        </div>
        
        <div className={styles.features}>
          <Card className={styles.featureCard} hoverable>
            <div className={styles.iconWrapper}>
              <CalendarCheck size={28} />
            </div>
            <h3>Detailed Care Plans</h3>
            <p>Go beyond simple bookings. Organize daily task checklists, recurring walks, and scheduled feedings with real-time completion tracking.</p>
          </Card>
          
          <Card className={styles.featureCard} hoverable>
            <div className={styles.iconWrapper}>
              <ShieldCheck size={28} />
            </div>
            <h3>Vetted & Verified Minders</h3>
            <p>Every caregiver is background-checked. View detailed profiles, qualifications, and read real community reviews before you book.</p>
          </Card>
          
          <Card className={styles.featureCard} hoverable>
            <div className={styles.iconWrapper}>
              <MapPin size={28} />
            </div>
            <h3>Live Session Tracking</h3>
            <p>Peace of mind out of the box. Watch live GPS tracking during walks, receive photo updates, and utilize our built-in SOS emergency features.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
