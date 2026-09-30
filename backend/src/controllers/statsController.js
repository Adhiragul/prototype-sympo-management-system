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

    // Registrations per department
    const deptDistribution = {};
    events.forEach(e => {
      deptDistribution[e.department] = (deptDistribution[e.department] || 0) + (e.totalSeats - e.seatsAvailable);
    });

    // Registrations per category
    const categoryDistribution = {};
    events.forEach(e => {
      categoryDistribution[e.category] = (categoryDistribution[e.category] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        totalEvents,
        totalCapacity,
        totalAvailable,
        totalRegistrations: confirmedRegistrations,
        attendanceRate: confirmedRegistrations > 0 ? Math.round((attendedCount / confirmedRegistrations) * 100) : 0,
        fillRate: totalCapacity > 0 ? Math.round(((totalCapacity - totalAvailable) / totalCapacity) * 100) : 0,
        deptDistribution,
        categoryDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};
