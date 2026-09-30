import Event, { CATEGORIES, VENUES } from '../models/Event.js';
import { DEPARTMENTS } from '../models/User.js';
import Registration from '../models/Registration.js';

// @desc    Get all events with rich filtering, search and sorting
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const {
      department,
      category,
      search,
      availableOnly,
      mode,
      status,
      sort = 'date-asc'
    } = req.query;

    const query = {};

    // Department filter
    if (department && department !== 'All Departments') {
      query.department = department;
    }

    // Category filter
    if (category && category !== 'All Categories') {
      query.category = category;
    }

    // Mode filter
    if (mode && mode !== 'All Modes') {
      query.mode = mode;
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Available seats only
    if (availableOnly === 'true' || availableOnly === true) {
      query.seatsAvailable = { $gt: 0 };
    }

    // Text search on title, description, clubName, and tags
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { clubName: searchRegex },
        { venue: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Sort order
    let sortOption = { eventDate: 1 };
    if (sort === 'date-desc') {
      sortOption = { eventDate: -1 };
    } else if (sort === 'seats-asc') {
      sortOption = { seatsAvailable: 1 };
    } else if (sort === 'seats-desc') {
      sortOption = { seatsAvailable: -1 };
    } else if (sort === 'popular') {
      sortOption = { totalSeats: -1 };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email department')
      .sort(sortOption);

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'organizer',
      'name email department collegeName phone'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Count confirmed attendees
    const confirmedRegistrations = await Registration.countDocuments({
      event: event._id,
      status: 'confirmed'
    });

    res.json({
      success: true,
      event,
      confirmedRegistrations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer / Admin)
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      department,
      category,
      clubName,
      venue,
      mode,
      eventDate,
      endDate,
      registrationDeadline,
      totalSeats,
      bannerUrl,
      tags,
      contactEmail,
      contactPhone,
      certificateProvided
    } = req.body;

    const seats = Number(totalSeats);
