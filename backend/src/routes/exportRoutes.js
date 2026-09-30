import express from 'express';
import { exportAttendeesCsv, exportAttendeesJson } from '../controllers/exportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/event/:eventId/csv', protect, authorize('organizer', 'admin'), exportAttendeesCsv);
router.get('/event/:eventId/json', protect, authorize('organizer', 'admin'), exportAttendeesJson);

export default router;
