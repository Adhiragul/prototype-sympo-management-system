import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// @desc    Get dashboard statistics for organizer or admin
// @route   GET /api/stats/dashboard
// @access  Private (Organizer / Admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const isOrganizer = req.user.role === 'organizer';
    const eventFilter = isOrganizer ? { organizer: req.user._id } : {};

    const events = await Event.find(eventFilter);
    const eventIds = events.map(e => e._id);

    const totalEvents = events.length;
    const totalCapacity = events.reduce((sum, e) => sum + e.totalSeats, 0);
    const totalAvailable = events.reduce((sum, e) => sum + e.seatsAvailable, 0);

    const confirmedRegistrations = await Registration.countDocuments({
      event: { $in: eventIds },
      status: 'confirmed'
    });

    const attendedCount = await Registration.countDocuments({
      event: { $in: eventIds },
      status: 'confirmed',
      attended: true
    });

