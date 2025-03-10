'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth, signIn, signOut } from './Auth';
import { createBooking, deleteBooking, getBookings, updateBooking, updateGuest } from './data-service';

const idRegex = /^[a-zA-Z0-9]{6,12}$/;

async function updateProfile(data) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const nationalID = data.get('nationalID');
  const fullNationality = data.get('nationality');
  const [nationality, countryFlag] = fullNationality.split('%');


  if (!idRegex.test(nationalID)) throw new Error('Please provide a valid national ID');

  const updateData = {
    nationality, countryFlag, nationalID
  };

  await updateGuest(session.user.guestId, updateData);

  revalidatePath('/account/profile');

  return session;
}

async function deleteBookingAction(id) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  await new Promise((res) => setTimeout(res, 3000));


  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map(booking => booking.id);

  if (!guestBookingIds.includes(id)) throw new Error('You are not authorized to delete this booking');

  await deleteBooking(id);

  revalidatePath('/account/reservation');

  return { message: 'Booking deleted successfully' };
}

async function updateBookingAction(data) {
  // Authentication
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  // Get data
  const numGuests = +data.get('numGuests');
  const observations = data.get('observations').slice(0, 1000);
  const bookingId = +data.get('bookingId');

  // Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map(booking => booking.id);

  if (!guestBookingIds.includes(bookingId)) throw new Error('You are not authorized to delete this booking');

  // Validation
  if (!numGuests && !observations) throw new Error('You need to update something to go ahead');

  // Update booking
  await updateBooking(bookingId, { numGuests, observations });

  // Redirecting and revalidation
  revalidatePath('/account/reservations');
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect('/account/reservations');

  return { message: 'Booking updated successfully' };
}

async function createBookingAction(bookingData, data) {
  // Authentication
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  // Get data
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    observations: data.get('observations').slice(0, 1000),
    numGuests: +data.get('numGuests'),
    isPaid: false,
  };

  await createBooking(newBooking);

  revalidatePath('/account/reservations');
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect('/thankyou');

  return { message: 'Booking created successfully' };
}


async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

export {
  deleteBookingAction,
  signInAction,
  signOutAction,
  updateBookingAction,
  updateProfile,
  createBookingAction
};
