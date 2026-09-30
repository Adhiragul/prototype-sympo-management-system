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
