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

function getCurrentUserEmail() {
  if (typeof window === 'undefined') return '';
  const raw = window.localStorage.getItem('petminder_current_session');
  const session = safeParse(raw, null);
  return typeof session?.email === 'string' ? session.email : '';
}

function getStorageKeyForCurrentUser() {
  const email = getCurrentUserEmail();
  return email ? `${STORAGE_KEY}_${email}` : STORAGE_KEY;
}

export const BookingManager = {
  getBookings() {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(getStorageKeyForCurrentUser());
    const arr = safeParse(raw, []);
    return Array.isArray(arr) ? arr : [];
  },

  saveBookings(bookings) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(getStorageKeyForCurrentUser(), JSON.stringify(bookings));
  },

  createBooking(caregiver, options = {}) {
    const caregiverId = caregiver?.id ?? '';
    const caregiverName =
      options.caregiverName ||
      `${caregiver?.firstName ?? ''} ${caregiver?.lastName ?? ''}`.trim() ||
      caregiver?.name ||
      'Caregiver';

    const price = options.price ?? caregiver?.hourlyRate ?? caregiver?.rate ?? 0; // hourly rate
    const sessionDate = options.sessionDate ?? null;
    const userEmail = getCurrentUserEmail();

    const booking = new Booking({
      caregiverId,
      caregiverName,
      price,
      hourlyRate: options.hourlyRate ?? price,
      status: 'Confirmed',
      sessionDate,
      startTime: options.startTime ?? null,
      endTime: options.endTime ?? null,
      durationHours: options.durationHours ?? null,
      totalPrice: options.totalPrice ?? null,
      payment: options.payment ?? null,
      ...(userEmail ? { userEmail } : {}),
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

