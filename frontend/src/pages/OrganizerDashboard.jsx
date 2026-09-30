import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventApi, statsApi, exportApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Calendar, 
  Users, 
  FileSpreadsheet, 
  FileCode, 
  Edit, 
  Trash2, 
  TrendingUp, 
  CheckCircle2, 
  Loader2, 
  ExternalLink,
  MapPin,
  Download
} from 'lucide-react';

export const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportingId, setExportingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [eventsRes, statsRes] = await Promise.all([
        eventApi.getEvents({}),
        statsApi.getDashboardStats()
      ]);

      if (eventsRes.data.success) {
        setEvents(eventsRes.data.events);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error('Failed to load organizer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleExportCsv = async (eventId, title) => {
    setExportingId(`${eventId}-csv`);
    try {
      await exportApi.downloadCsv(eventId, title);
    } catch (err) {
      alert('Failed to export CSV.');
    } finally {
      setExportingId(null);
    }
  };

  const handleExportJson = async (eventId, title) => {
    setExportingId(`${eventId}-json`);
    try {
      await exportApi.downloadJson(eventId, title);
    } catch (err) {
      alert('Failed to export JSON.');
    } finally {
      setExportingId(null);
    }
  };

  const handleDeleteEvent = async (eventId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This will cancel all student registrations for this event.`)) {
      return;
    }

    setDeletingId(eventId);
    try {
      const res = await eventApi.deleteEvent(eventId);
      if (res.data.success) {
        setEvents((prev) => prev.filter((e) => e._id !== eventId));
        loadDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <LayoutDashboard className="w-4 h-4" />
            <span>Club Coordinator & Admin Center</span>
          </div>
          <h1 className="text-3xl font-black text-white font-['Outfit']">
            SRM EEC Organizer Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish symposiums, track live seat availability, manage check-in verification, and export attendee rosters.
          </p>
        </div>

        <Link
          to="/organizer/create-event"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-700/25 flex items-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Event</span>
        </Link>
      </div>

      {/* Analytics KPI Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b132b]/80 border border-blue-900/40 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Events Published</span>
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-white font-mono">{stats.totalEvents}</p>
            <p className="text-[11px] text-blue-300">Across SRM EEC Departments</p>
          </div>

          <div className="bg-[#0b132b]/80 border border-blue-900/40 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Registrations</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black text-emerald-400 font-mono">{stats.totalRegistrations}</p>
            <p className="text-[11px] text-emerald-300/80">Confirmed Student RSVPs</p>
          </div>

          <div className="bg-[#0b132b]/80 border border-blue-900/40 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Seat Fill Rate</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400 font-mono">{stats.fillRate}%</p>
            <p className="text-[11px] text-slate-400">{stats.totalCapacity - stats.totalAvailable} of {stats.totalCapacity} seats booked</p>
          </div>

          <div className="bg-[#0b132b]/80 border border-blue-900/40 p-5 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Check-in Verification</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-cyan-400 font-mono">{stats.attendanceRate}%</p>
            <p className="text-[11px] text-slate-400">QR scanned at venue</p>
          </div>
        </div>
      )}

      {/* Events Management Roster Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <span>Active Events & Attendee Rosters</span>
          <span className="text-xs font-normal text-slate-400">({events.length} events)</span>
        </h2>

        {loading ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-xs text-slate-400">Loading events and attendee rosters...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4">
            <p className="text-slate-400 text-sm">No events found. Start by publishing your first symposium!</p>
            <Link
              to="/organizer/create-event"
              className="inline-block px-4 py-2 bg-blue-600 rounded-xl text-white text-xs font-bold"
            >
              Publish Event Now
            </Link>
          </div>
        ) : (
          <div className="bg-[#0b132b]/80 border border-blue-900/40 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#070d1e] text-slate-400 uppercase text-[10px] tracking-wider border-b border-blue-950">
                  <tr>
                    <th className="py-3.5 px-4">Event Details</th>
                    <th className="py-3.5 px-4">Department & Club</th>
                    <th className="py-3.5 px-4">Date & Venue</th>
                    <th className="py-3.5 px-4">Seat Availability</th>
                    <th className="py-3.5 px-4 text-center">Attendee Roster</th>
                    <th className="py-3.5 px-4 text-center">Export Data</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {events.map((event) => {
                    const booked = event.totalSeats - event.seatsAvailable;
                    const percent = Math.round((booked / event.totalSeats) * 100);
                    const eventDate = new Date(event.eventDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    });

                    return (
                      <tr key={event._id} className="hover:bg-slate-800/40 transition-colors">
                        {/* Title & Category */}
                        <td className="py-4 px-4 font-medium max-w-xs">
                          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-600 text-white mb-1">
                            {event.category}
                          </span>
                          <Link
                            to={`/events/${event._id}`}
                            className="block text-white font-bold hover:text-blue-400 transition-colors line-clamp-1 text-sm"
                          >
                            {event.title}
                          </Link>
                        </td>

                        {/* Dept & Club */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <p className="font-semibold text-slate-200">{event.department}</p>
                          <p className="text-[11px] text-slate-400">{event.clubName}</p>
                        </td>

                        {/* Date & Venue */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-200">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            <span>{eventDate}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{event.venue}</p>
                        </td>

                        {/* Seat Meter */}
                        <td className="py-4 px-4 min-w-[160px]">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-white">{booked} registered</span>
                            <span className="text-slate-400">{event.seatsAvailable} left</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-500 h-full rounded-full"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </td>

                        {/* View Attendees */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <Link
                            to={`/organizer/events/${event._id}/attendees`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-semibold transition-colors"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>View Roster ({booked})</span>
                          </Link>
                        </td>

                        {/* Export Buttons: CSV & JSON */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {/* Export CSV Button */}
                            <button
                              onClick={() => handleExportCsv(event._id, event.title)}
                              disabled={exportingId === `${event._id}-csv`}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Export Attendee Roster as CSV (for Excel / Sheets)"
                            >
                              {exportingId === `${event._id}-csv` ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                              <span>CSV</span>
                            </button>

                            {/* Export JSON Button */}
                            <button
                              onClick={() => handleExportJson(event._id, event.title)}
                              disabled={exportingId === `${event._id}-json`}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Export Attendee Roster as JSON"
                            >
                              {exportingId === `${event._id}-json` ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                              )}
                              <span>JSON</span>
                            </button>
                          </div>
                        </td>

                        {/* Action Icons */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <Link
                              to={`/organizer/edit-event/${event._id}`}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title="Edit Event"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteEvent(event._id, event.title)}
                              disabled={deletingId === event._id}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete Event"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
