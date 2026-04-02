import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { marketplaceService } from '../services/marketplaceService';
import { Search, Star, ShieldCheck, MapPin } from 'lucide-react';
import styles from './SearchCaregiversPage.module.css';

export function SearchCaregiversPage() {
  const navigate = useNavigate();
  const [caregivers, setCaregivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial fetch from "Firestore"
    fetchMinders();
  }, []);

  const fetchMinders = async (query = '') => {
    setIsLoading(true);
    try {
      const results = await marketplaceService.searchCaregivers(query);
      setCaregivers(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMinders(searchTerm);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2>Find a Trusted Pet Minder</h2>
          <p>Search highly rated caregivers in your area according to your needs.</p>
        </div>
        
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" size="md">Search</Button>
        </form>
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Fetching caretakers from database...</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {caregivers.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No pet minders found matching your search.</p>
              <Button variant="outline" onClick={() => { setSearchTerm(''); fetchMinders(''); }}>Clear Search</Button>
            </div>
          ) : (
            caregivers.map(minder => (
              <Card key={minder.id} className={styles.minderCard} hoverable>
                <div className={styles.cardHeader}>
                  <div className={styles.imagePlaceholder}>
                    {minder.profileImageUrl ? (
                      <img src={minder.profileImageUrl} alt="Profile" className={styles.profileImg} />
                    ) : (
                      <span className={styles.initials}>{minder.firstName.charAt(0)}{minder.lastName.charAt(0)}</span>
                    )}
                  </div>
                  <div className={styles.minderInfo}>
                    <div className={styles.nameRow}>
                      <h3>{minder.firstName} {minder.lastName}</h3>
                      {minder.isVerified && <ShieldCheck size={18} className={styles.verifiedIcon} />}
                    </div>
                    <div className={styles.statsRow}>
                      <span className={styles.rating}>
                        <Star size={14} fill="currentColor" /> {minder.averageRating} ({minder.totalReviews})
                      </span>
                      <span className={styles.rate}>£{minder.hourlyRate}/hr</span>
                    </div>
                  </div>
                </div>

                <p className={styles.bio}>{minder.bio}</p>

                <div className={styles.cardActions}>
                  <Button fullWidth onClick={() => alert('Booking request workflow initiated (RQ15)')}>Book Session</Button>
                  <Button fullWidth variant="outline">View Full Profile</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
