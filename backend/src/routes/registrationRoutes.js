import express from 'express';
import {
  rsvpEvent,
  cancelRsvp,
  getMyRegistrations,
  checkRsvpStatus,
  getEventAttendees,
  toggleCheckIn
} from '../controllers/registrationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Student / general user routes
router.post('/rsvp/:eventId', protect, rsvpEvent);
router.post('/cancel/:registrationId', protect, cancelRsvp);
router.get('/my-registrations', protect, getMyRegistrations);
router.get('/status/:eventId', protect, checkRsvpStatus);

// Organizer / Admin routes
router.get('/event/:eventId/attendees', protect, authorize('organizer', 'admin'), getEventAttendees);
router.patch('/:id/checkin', protect, authorize('organizer', 'admin'), toggleCheckIn);

export default router;
