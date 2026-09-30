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
    await Event.findByIdAndUpdate(registration.event._id, {
      $inc: { seatsAvailable: 1 }
    });

    res.json({
      success: true,
      message: 'Registration cancelled successfully. Seat has been released.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's registered events
// @route   GET /api/registrations/my-registrations
// @access  Private
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      user: req.user._id,
      status: 'confirmed'
    })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email phone' }
      })
      .sort({ registeredAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check RSVP status for a specific event by current user
// @route   GET /api/registrations/status/:eventId
// @access  Private
export const checkRsvpStatus = async (req, res, next) => {
  try {
    const registration = await Registration.findOne({
      event: req.params.eventId,
      user: req.user._id,
      status: 'confirmed'
    });

    res.json({
      success: true,
      isRegistered: !!registration,
      registration: registration || null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendees list for an event
// @route   GET /api/registrations/event/:eventId/attendees
// @access  Private (Organizer of this event or Admin)
export const getEventAttendees = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Verify organizer or admin
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this attendee roster.'
      });
    }

    const attendees = await Registration.find({
      event: req.params.eventId,
      status: 'confirmed'
    })
      .populate('user', 'name email department collegeName rollNo year phone')
      .sort({ registeredAt: 1 });

    res.json({
      success: true,
      totalAttendees: attendees.length,
      event: {
        _id: event._id,
        title: event.title,
        department: event.department,
        totalSeats: event.totalSeats,
        seatsAvailable: event.seatsAvailable,
        eventDate: event.eventDate
      },
      attendees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle attendance check-in for an attendee
// @route   PATCH /api/registrations/:id/checkin
// @access  Private (Organizer or Admin)
export const toggleCheckIn = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('event');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Verify organizer or admin
    if (
      registration.event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to mark attendance for this event.'
      });
    }

    registration.attended = !registration.attended;
    registration.attendedAt = registration.attended ? new Date() : null;
    await registration.save();

    res.json({
      success: true,
      message: `Attendee check-in marked as ${registration.attended ? 'Present' : 'Absent'}`,
      attended: registration.attended,
      attendedAt: registration.attendedAt
    });
  } catch (error) {
    next(error);
  }
};
