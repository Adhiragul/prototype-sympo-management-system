import crypto from 'crypto';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';

// Helper to generate unique SRM EEC ticket code
const generateTicketId = (department) => {
  const deptCode = department
    ? department
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 3)
    : 'GEN';
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `EEC-${deptCode}-${randomNum}`;
};

// @desc    Single-Click RSVP for an event with atomic seat reservation
// @route   POST /api/registrations/rsvp/:eventId
// @access  Private (Student / Any authenticated user)
export const rsvpEvent = async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  try {
    // 1. Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    // 2. Check if registration deadline has passed
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline for this event has passed.'
      });
    }

    // 3. Check if user has already registered
    const existingReg = await Registration.findOne({
      event: eventId,
      user: userId,
      status: 'confirmed'
