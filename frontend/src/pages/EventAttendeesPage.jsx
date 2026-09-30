import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { regApi, exportApi } from '../api/client';
import { 
  ArrowLeft, 
  FileSpreadsheet, 
  FileCode, 
  Search, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Users, 
  Calendar, 
  Clock, 
  UserCheck 
} from 'lucide-react';

export const EventAttendeesPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingJson, setExportingJson] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const res = await regApi.getAttendees(id);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load attendees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [id]);

  const handleToggleCheckIn = async (registrationId) => {
    setTogglingId(registrationId);
    try {
      const res = await regApi.toggleCheckIn(registrationId);
      if (res.data.success) {
        setData((prev) => ({
          ...prev,
          attendees: prev.attendees.map((att) =>
            att._id === registrationId
              ? { ...att, attended: res.data.attended, attendedAt: res.data.attendedAt }
              : att
          )
        }));
      }
    } catch (err) {
      alert('Failed to update attendance.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleExportCsv = async () => {
    if (!data?.event) return;
    setExportingCsv(true);
    try {
      await exportApi.downloadCsv(id, data.event.title);
    } catch (err) {
      alert('Failed to export CSV file.');
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportJson = async () => {
    if (!data?.event) return;
    setExportingJson(true);
    try {
      await exportApi.downloadJson(id, data.event.title);
    } catch (err) {
      alert('Failed to export JSON file.');
    } finally {
      setExportingJson(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">Loading attendee roster & check-in list...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
        <p className="text-sm text-slate-400">Could not find attendee roster for this event.</p>
        <Link to="/organizer/dashboard" className="inline-block px-4 py-2 bg-blue-600 rounded-xl text-xs font-semibold text-white">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { event, attendees } = data;
  const filteredAttendees = attendees.filter((a) => {
    const term = search.toLowerCase();
    return (
      a.ticketId?.toLowerCase().includes(term) ||
      a.user?.name?.toLowerCase().includes(term) ||
      a.user?.email?.toLowerCase().includes(term) ||
      a.user?.rollNo?.toLowerCase().includes(term) ||
      a.user?.department?.toLowerCase().includes(term)
    );
  });

  const attendedCount = attendees.filter((a) => a.attended).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/organizer/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Organizer Dashboard</span>
      </Link>

      {/* Header Banner with Event Specs & Export Buttons */}
      <div className="bg-[#0b132b]/90 border border-blue-900/50 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
              {event.department}
            </span>
            <span className="text-xs text-slate-400">
              Total Capacity: <strong>{event.totalSeats} seats</strong> ({event.seatsAvailable} remaining)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            {event.title}
          </h1>
          <p className="text-xs text-slate-300">
            Registered Attendees: <strong className="text-white">{attendees.length}</strong> • Verified Check-ins: <strong className="text-emerald-400">{attendedCount}</strong>
          </p>
        </div>

        {/* Primary Export Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleExportCsv}
            disabled={exportingCsv || attendees.length === 0}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-700/25 flex items-center gap-2 transition-all disabled:opacity-50"
            title="Download CSV formatted for Microsoft Excel and Google Sheets"
          >
            {exportingCsv ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            <span>Export CSV (Excel)</span>
          </button>

          <button
            onClick={handleExportJson}
            disabled={exportingJson || attendees.length === 0}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-700/25 flex items-center gap-2 transition-all disabled:opacity-50"
            title="Download JSON structured roster"
          >
            {exportingJson ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileCode className="w-4 h-4" />
            )}
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Search and Table Roster */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student, roll no, ticket ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <p className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredAttendees.length}</strong> of {attendees.length} attendees
          </p>
        </div>

        {filteredAttendees.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-400">No attendees match your search query.</p>
          </div>
        ) : (
          <div className="bg-[#0b132b]/80 border border-blue-900/40 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#070d1e] text-slate-400 uppercase text-[10px] tracking-wider border-b border-blue-950">
                  <tr>
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Department & College</th>
                    <th className="py-3 px-4">Registration Time</th>
                    <th className="py-3 px-4 text-center">Attendance Check-in</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredAttendees.map((att, index) => {
                    const regDate = new Date(att.registeredAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <tr key={att._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 text-slate-500 font-mono">{index + 1}</td>

                        {/* Ticket Code */}
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                          {att.ticketId}
                        </td>

                        {/* Student Name & Email */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-white text-sm">{att.user?.name || 'N/A'}</p>
                          <p className="text-[11px] text-slate-400">{att.user?.email}</p>
                        </td>

                        {/* Roll No */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                          {att.user?.rollNo || '-'}
                        </td>

                        {/* Department */}
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-300">{att.user?.department}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[180px]">
                            {att.user?.collegeName || 'SRM Easwari Engineering College'}
                          </p>
                        </td>

                        {/* Registered At */}
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                          {regDate}
                        </td>

                        {/* Check-in Toggle */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggleCheckIn(att._id)}
                            disabled={togglingId === att._id}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 mx-auto transition-all ${
                              att.attended
                                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-white'
                            }`}
                          >
                            {togglingId === att._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : att.attended ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Present</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                                <span>Mark Present</span>
                              </>
                            )}
                          </button>
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
