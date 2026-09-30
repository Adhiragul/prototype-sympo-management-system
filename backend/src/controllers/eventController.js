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
    if (!seats || seats <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total seats must be a positive number.'
      });
    }

    const event = await Event.create({
      title,
      description,
      department,
      category,
      clubName,
      venue,
      mode: mode || 'In-Person',
      eventDate,
      endDate,
      registrationDeadline,
      totalSeats: seats,
      seatsAvailable: seats, // initially all seats are available
      bannerUrl: bannerUrl || undefined,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      organizer: req.user._id,
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || req.user.phone || '',
      certificateProvided: certificateProvided !== undefined ? certificateProvided : true
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing event
// @route   PUT /api/events/:id
// @access  Private (Organizer of this event or Admin)
export const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check ownership if not admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event.'
      });
    }

    // Handle seat capacity change carefully
    if (req.body.totalSeats !== undefined) {
      const newTotalSeats = Number(req.body.totalSeats);
      const confirmedCount = await Registration.countDocuments({
        event: event._id,
        status: 'confirmed'
      });

      if (newTotalSeats < confirmedCount) {
        return res.status(400).json({
          success: false,
          message: `Cannot decrease total seats to ${newTotalSeats}. There are already ${confirmedCount} confirmed registrations.`
        });
      }

      req.body.seatsAvailable = newTotalSeats - confirmedCount;
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map(t => t.trim());
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Event updated successfully!',
      event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer of this event or Admin)
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event.'
      });
    }

    // Remove event and associated registrations
    await Event.findByIdAndDelete(req.params.id);
    await Registration.deleteMany({ event: req.params.id });

    res.json({
      success: true,
      message: 'Event and registrations removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get metadata (Departments, Categories, Venues)
// @route   GET /api/events/metadata
// @access  Public
export const getEventMetadata = async (req, res) => {
  res.json({
    success: true,
    departments: DEPARTMENTS,
    categories: CATEGORIES,
    venues: VENUES
  });
};
