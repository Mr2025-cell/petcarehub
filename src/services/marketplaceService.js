// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../firebase';
import { mockPetMinders } from '../data/mockData';
import { BookingManager } from '../pages/BookingManager';

const DELAY = 600; 

export const marketplaceService = {
  
  /**
   * Fetches the available pet caregivers. 
   * Pre-configured to be swapped instantly to real Firestore!
   */
  async searchCaregivers(searchTerm = '') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          /* 
          // REAL FIREBASE IMPLEMENTATION (Uncomment when keys are active)
          const q = query(collection(db, "users"), where("role", "==", "PetCaregiver"));
          const snapshot = await getDocs(q);
          let minders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          */

          // MOCK FIREBASE RESPONSE
          let minders = [...mockPetMinders];

          // Fake some extra Data for the search view
          minders.push({
            id: 'minder2',
            firstName: 'Sarah',
            lastName: 'Connor',
            profileImageUrl: '/mock_cat.png', // reusing assets purely for prototype
            role: 'PetCaregiver',
            bio: 'Passionate about cat care and behavioral training.',
            hourlyRate: 18.0,
            averageRating: 5.0,
            totalReviews: 34,
            isVerified: true
          });

          // Apply local filter
          if (searchTerm) {
            minders = minders.filter(m => 
              `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }

          resolve(minders);
        } catch (err) {
          reject(new Error("Failed to fetch caregivers from Firestore"));
        }
      }, DELAY);
    });
  },

  createBooking(caregiver, options = {}) {
    return BookingManager.createBooking(caregiver, options);
  },

  getBookings() {
    return BookingManager.getBookings();
  },

  cancelBooking(bookingId) {
    return BookingManager.cancelBooking(bookingId);
  },
};
