const accountKey = (uid, section) => `intab:account:${uid}:${section}`;
const bookingKey = (email) => `intab:bookings:${email.trim().toLowerCase()}`;

export function readAccountData(uid, section, fallback) {
  const stored = localStorage.getItem(accountKey(uid, section));
  return stored === null ? fallback : JSON.parse(stored);
}

export function writeAccountData(uid, section, value) {
  localStorage.setItem(accountKey(uid, section), JSON.stringify(value));
}

export function readBookings(email) {
  if (!email) return [];
  const stored = localStorage.getItem(bookingKey(email));
  if (stored === null) return [];
  const bookings = JSON.parse(stored);
  if (!Array.isArray(bookings)) {
    throw new Error("Saved bookings have an invalid format.");
  }
  return bookings;
}

export function saveBooking(email, booking) {
  if (!email) {
    throw new Error("A contact email is required to save this booking.");
  }
  const bookings = readBookings(email);
  bookings.unshift({
    ...booking,
    id: booking.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  });
  localStorage.setItem(bookingKey(email), JSON.stringify(bookings));
}
