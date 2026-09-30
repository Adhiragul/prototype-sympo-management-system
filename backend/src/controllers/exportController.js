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
