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
    });

    if (existingReg) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event.',
        ticketId: existingReg.ticketId
      });
    }

    // 4. ATOMIC CONCURRENCY RESERVATION: Decrement seat only if seatsAvailable > 0
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: eventId,
        seatsAvailable: { $gt: 0 }
      },
      {
        $inc: { seatsAvailable: -1 }
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({
        success: false,
        message: 'Sorry! All seats for this event are fully booked.'
      });
    }

    // 5. Create the registration ticket
    const ticketId = generateTicketId(event.department);

    try {
      const registration = await Registration.create({
        event: eventId,
        user: userId,
        ticketId,
        status: 'confirmed',
        registeredAt: new Date()
      });

      // Populate registration data for immediate display
      await registration.populate('event', 'title eventDate venue category department bannerUrl clubName');
      await registration.populate('user', 'name email department rollNo collegeName');

      res.status(201).json({
        success: true,
        message: '🎉 RSVP Successful! Your seat has been reserved.',
        registration,
        seatsRemaining: updatedEvent.seatsAvailable
      });
    } catch (createErr) {
      // Rollback seat count if registration creation failed (e.g. duplicate key)
      await Event.findByIdAndUpdate(eventId, { $inc: { seatsAvailable: 1 } });
      throw createErr;
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an RSVP and reclaim the seat
// @route   POST /api/registrations/cancel/:registrationId
// @access  Private
export const cancelRsvp = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.registrationId).populate('event');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found.'
      });
    }

    // Check authorization: user themselves or admin
    if (
      registration.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this registration.'
      });
    }

    if (registration.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This registration is already cancelled.'
      });
    }

    // Mark as cancelled or delete
    registration.status = 'cancelled';
    await registration.save();

    // Increment available seats back on the event
