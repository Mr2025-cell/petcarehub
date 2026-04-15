import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { marketplaceService } from '../services/marketplaceService';
import { Search, Star, ShieldCheck, MapPin } from 'lucide-react';
import styles from './SearchCaregiversPage.module.css';

function toMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== 'string') return null;
  const [hStr, mStr] = hhmm.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

export function SearchCaregiversPage() {
  const navigate = useNavigate();
  const [caregivers, setCaregivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pendingBookingMinder, setPendingBookingMinder] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    // Initial fetch from "Firestore"
    fetchMinders();
  }, []);

  useEffect(() => {
    if (!pendingBookingMinder) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setPendingBookingMinder(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pendingBookingMinder]);

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

  const handleBookSession = (minder) => {
    setPendingBookingMinder(minder);
    setBookingDate('');
    setStartTime('');
    setEndTime('');
    setCardholderName('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setBookingError('');
  };

  const validateAndPay = (minder) => {
    try {
      setBookingError('');

      if (!bookingDate) return setBookingError('Please choose a booking date.');
      if (!startTime) return setBookingError('Please choose a start time.');
      if (!endTime) return setBookingError('Please choose an end time.');

      const startMins = toMinutes(startTime);
      const endMins = toMinutes(endTime);
      if (startMins == null || endMins == null) return setBookingError('Please enter a valid start and end time.');
      if (endMins <= startMins) return setBookingError('End time must be later than start time.');

      const durationHours = Number(((endMins - startMins) / 60).toFixed(2));
      const hourlyRate = Number(minder?.hourlyRate ?? 0) || 0;
      const totalPrice = Number((durationHours * hourlyRate).toFixed(2));

      if (!cardholderName.trim()) return setBookingError('Cardholder name is required.');

      const digitsOnly = String(cardNumber).replace(/\s+/g, '');
      if (!/^\d{12,19}$/.test(digitsOnly)) return setBookingError('Card number must look like a valid card number.');
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(String(expiry).trim())) return setBookingError('Expiry must be in MM/YY format.');
      if (!/^\d{3}$/.test(String(cvv).trim())) return setBookingError('CVV must be 3 digits.');

      const last4 = digitsOnly.slice(-4);
      const sessionDate = new Date(`${bookingDate}T${startTime}:00`).toISOString();

      marketplaceService.createBooking(minder, {
        sessionDate,
        startTime,
        endTime,
        durationHours,
        hourlyRate,
        totalPrice,
        price: hourlyRate,
        payment: {
          amount: totalPrice,
          method: 'Card',
          status: 'Paid',
          last4,
        },
      });
      setPendingBookingMinder(null);
      navigate('/bookings');
    } catch (err) {
      console.error(err);
      alert('Sorry — we could not create that booking.');
    }
  };

  const startMins = toMinutes(startTime);
  const endMins = toMinutes(endTime);
  const showSummary = pendingBookingMinder && bookingDate && startMins != null && endMins != null && endMins > startMins;
  const durationHours = showSummary ? Number(((endMins - startMins) / 60).toFixed(2)) : 0;
  const hourlyRate = pendingBookingMinder ? Number(pendingBookingMinder?.hourlyRate ?? 0) || 0 : 0;
  const totalPrice = showSummary ? Number((durationHours * hourlyRate).toFixed(2)) : 0;

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
                  <Button fullWidth onClick={() => handleBookSession(minder)}>Book Session</Button>
                  <Button fullWidth variant="outline">View Full Profile</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {pendingBookingMinder ? (
        <div
          className={styles.modalOverlay}
          onClick={() => setPendingBookingMinder(null)}
          role="presentation"
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-payment-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 id="booking-payment-title" className={styles.modalTitle}>Book & Pay</h3>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.modalText}>
                Complete your booking with{' '}
                <span className={styles.modalCaregiverName}>
                  {`${pendingBookingMinder?.firstName ?? ''} ${pendingBookingMinder?.lastName ?? ''}`.trim() || 'this caregiver'}
                </span>
                .
              </p>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label htmlFor="booking-date">Booking Date</label>
                  <input
                    id="booking-date"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>

                <div className={styles.formRow2}>
                  <div className={styles.field}>
                    <label htmlFor="start-time">Start Time</label>
                    <input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="end-time">End Time</label>
                    <input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.summaryBox}>
                  <div>Hourly Rate: £{hourlyRate}/hour</div>
                  <div>Duration: {showSummary ? `${durationHours} hours` : '—'}</div>
                  <div style={{ fontWeight: 700 }}>Total: {showSummary ? `£${totalPrice}` : '—'}</div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="cardholder-name">Cardholder Name</label>
                  <input
                    id="cardholder-name"
                    type="text"
                    placeholder="Name on card"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="card-number">Card Number</label>
                  <input
                    id="card-number"
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>

                <div className={styles.formRow2}>
                  <div className={styles.field}>
                    <label htmlFor="expiry">Expiry Date</label>
                    <input
                      id="expiry"
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      type="password"
                      inputMode="numeric"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {bookingError ? <div className={styles.errorBox}>{bookingError}</div> : null}
            </div>

            <div className={styles.modalActions}>
              <Button variant="outline" onClick={() => setPendingBookingMinder(null)}>Cancel</Button>
              <Button onClick={() => validateAndPay(pendingBookingMinder)}>Pay &amp; Book Now</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
