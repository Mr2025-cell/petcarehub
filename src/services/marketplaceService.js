import { mockPetMinders } from '../data/mockData';
import { BookingManager } from '../pages/BookingManager';

const DELAY = 600;

export const marketplaceService = {
  /**
   * Fetches the available pet caregivers.
   * Searches registered caregivers from localStorage first, then falls back to mock data.
   */
  async searchCaregivers(searchTerm = '') {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get caregivers from localStorage (registered users)
        const registeredCaregivers = JSON.parse(localStorage.getItem('petcaregivers') || '[]');

        // Start with registered caregivers
        let allCaregivers = [...registeredCaregivers];

        // If no registered caregivers, use mock data
        if (allCaregivers.length === 0) {
          allCaregivers = [...mockPetMinders];

          // Add extra mock data for variety
          allCaregivers.push({
            id: 'minder2',
            firstName: 'Sarah',
            lastName: 'Connor',
            profileImageUrl: '/mock_cat.png',
            role: 'PetCaregiver',
            bio: 'Passionate about cat care and behavioral training.',
            hourlyRate: 18.0,
            averageRating: 5.0,
            totalReviews: 34,
            isVerified: true
          });
        }

        // Apply local filter if search term exists
        if (searchTerm && searchTerm.trim() !== '') {
          const term = searchTerm.toLowerCase().trim();
          allCaregivers = allCaregivers.filter(caregiver => {
            const fullName = `${caregiver.firstName} ${caregiver.lastName}`.toLowerCase();
            return fullName.includes(term);
          });
        }

        resolve(allCaregivers);
      }, DELAY);
    });
  },

  /**
   * Creates a new booking for a caregiver.
   */
  createBooking(caregiver, options = {}) {
    return BookingManager.createBooking(caregiver, options);
  },

  /**
   * Gets all bookings from localStorage.
   */
  getBookings() {
    return BookingManager.getBookings();
  },

  /**
   * Cancels a booking by ID.
   */
  cancelBooking(bookingId) {
    return BookingManager.cancelBooking(bookingId);
  }
};