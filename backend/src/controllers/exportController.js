import { Parser } from 'json2csv';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// Helper to sanitize filename
const sanitizeFilename = (text) => {
  return text.replace(/[^a-zA-Z0-9_-]/g, '_');
};

// @desc    Export event attendee list as CSV
// @route   GET /api/export/event/:eventId/csv
// @access  Private (Organizer of event or Admin)
export const exportAttendeesCsv = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to export this attendee list.'
      });
    }

    const registrations = await Registration.find({
      event: req.params.eventId,
      status: 'confirmed'
    })
      .populate('user', 'name email department collegeName rollNo year phone')
      .sort({ registeredAt: 1 });

    // Transform to flat tabular format for CSV
    const data = registrations.map((reg, index) => ({
      'S.No': index + 1,
      'Ticket ID': reg.ticketId,
      'Student Name': reg.user?.name || 'N/A',
      'Email': reg.user?.email || 'N/A',
      'Department': reg.user?.department || 'N/A',
      'College': reg.user?.collegeName || 'SRM Easwari Engineering College',
      'Roll No / Reg No': reg.user?.rollNo || 'N/A',
      'Year of Study': reg.user?.year || 'N/A',
      'Contact Phone': reg.user?.phone || 'N/A',
      'Registration Date': new Date(reg.registeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      'Attendance Status': reg.attended ? 'PRESENT' : 'ABSENT',
      'Check-in Time': reg.attendedAt ? new Date(reg.attendedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '-'
    }));

    const fields = [
      'S.No',
      'Ticket ID',
      'Student Name',
      'Email',
      'Department',
      'College',
      'Roll No / Reg No',
      'Year of Study',
      'Contact Phone',
      'Registration Date',
      'Attendance Status',
      'Check-in Time'
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);

    const safeTitle = sanitizeFilename(event.title);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `SRM_EEC_${safeTitle}_Attendees_${dateStr}.csv`;

    res.header('Content-Type', 'text/csv');
    res.attachment(filename);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

// @desc    Export event attendee list as JSON
// @route   GET /api/export/event/:eventId/json
// @access  Private (Organizer of event or Admin)
export const exportAttendeesJson = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to export this attendee list.'
      });
    }

    const registrations = await Registration.find({
      event: req.params.eventId,
      status: 'confirmed'
    })
      .populate('user', 'name email department collegeName rollNo year phone')
      .sort({ registeredAt: 1 });

    const exportPayload = {
      institution: 'SRM Easwari Engineering College (Autonomous)',
      exportedAt: new Date().toISOString(),
      event: {
        id: event._id,
        title: event.title,
        department: event.department,
        category: event.category,
        clubName: event.clubName,
        venue: event.venue,
        eventDate: event.eventDate,
        totalSeats: event.totalSeats,
        confirmedAttendees: registrations.length
      },
      attendees: registrations.map((reg, index) => ({
        index: index + 1,
        ticketId: reg.ticketId,
        student: {
          name: reg.user?.name,
          email: reg.user?.email,
          department: reg.user?.department,
          collegeName: reg.user?.collegeName,
          rollNo: reg.user?.rollNo,
          year: reg.user?.year,
          phone: reg.user?.phone
        },
        registeredAt: reg.registeredAt,
        attended: reg.attended,
        attendedAt: reg.attendedAt
      }))
    };

    const safeTitle = sanitizeFilename(event.title);
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `SRM_EEC_${safeTitle}_Attendees_${dateStr}.json`;

    res.header('Content-Type', 'application/json');
    res.attachment(filename);
    return res.send(JSON.stringify(exportPayload, null, 2));
  } catch (error) {
    next(error);
  }
};
