import { Booking } from '../classes/Booking';

const STORAGE_KEY = 'petcarehub_bookings_v1';

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export const BookingManager = {
  getBookings() {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const arr = safeParse(raw, []);
    return Array.isArray(arr) ? arr : [];
  },

  saveBookings(bookings) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  },

  createBooking(caregiver, options = {}) {
    const caregiverId = caregiver?.id ?? '';
    const caregiverName =
      options.caregiverName ||
      `${caregiver?.firstName ?? ''} ${caregiver?.lastName ?? ''}`.trim() ||
      caregiver?.name ||
      'Caregiver';

    const price = options.price ?? caregiver?.hourlyRate ?? caregiver?.rate ?? 0;
    const sessionDate = options.sessionDate ?? null;

    const booking = new Booking({
      caregiverId,
      caregiverName,
      price,
      status: 'Confirmed',
      sessionDate,
    });

    const all = BookingManager.getBookings();
    BookingManager.saveBookings([booking, ...all]);
    return booking;
  },

  cancelBooking(bookingId) {
    const all = BookingManager.getBookings();
    const next = all.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
    BookingManager.saveBookings(next);
    return next;
  },
};

