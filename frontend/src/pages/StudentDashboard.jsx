import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { regApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { TicketModal } from '../components/TicketModal';
import { 
  Ticket, 
  Calendar, 
  MapPin, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Loader2,
  GraduationCap
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModal, setCancelModal] = useState(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await regApi.getMyRegistrations();
      if (res.data.success) {
        setRegistrations(res.data.registrations);
      }
    } catch (err) {
      console.error('Failed to fetch student registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancelRsvp = async (registrationId) => {
    setCancellingId(registrationId);
    try {
      const res = await regApi.cancel(registrationId);
      if (res.data.success) {
        setRegistrations((prev) => prev.filter((r) => r._id !== registrationId));
        setCancelModal(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-900/40 p-6 sm:p-8 rounded-3xl border border-blue-800/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg border border-blue-400/30">
            <GraduationCap className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white font-['Outfit']">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-blue-300 mt-1">
              Roll No: <strong className="text-white">{user?.rollNo || 'N/A'}</strong> • {user?.department}
            </p>
            <p className="text-[11px] text-slate-400">
              {user?.collegeName || 'SRM Easwari Engineering College'}
            </p>
          </div>
        </div>

        <Link
          to="/events"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-700/30 shrink-0"
        >
          Browse More Events
        </Link>
      </div>

      {/* Registrations List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-['Outfit']">
            <Ticket className="w-5 h-5 text-amber-400" />
            <span>My Registered Symposiums & Workshops ({registrations.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-xs text-slate-400">Loading your registration passes...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 max-w-md mx-auto my-6">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No Active Registrations</h3>
            <p className="text-xs text-slate-400">
              You haven't registered for any events yet. Explore upcoming symposiums across SRM EEC departments.
            </p>
            <Link
              to="/events"
              className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500"
            >
              Explore Events Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {registrations.map((reg) => {
              const event = reg.event || {};
              const eventDateObj = new Date(event.eventDate || reg.registeredAt);
              const formattedDate = eventDateObj.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });
              const formattedTime = eventDateObj.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={reg._id}
                  className="glass-card rounded-2xl overflow-hidden border border-blue-950 bg-slate-900/80 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top row: Category & Ticket ID */}
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-blue-600 text-white">
                        {event.category || 'Symposium'}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                        {reg.ticketId}
                      </span>
                    </div>

                    <Link to={`/events/${event._id}`}>
                      <h3 className="text-base font-bold text-white hover:text-blue-400 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-blue-300">
                      Dept: <strong>{event.department}</strong> • {event.clubName}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{formattedDate} • {formattedTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: View Ticket Pass & Cancel RSVP */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => setActiveTicket(reg)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-700/20 transition-all"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>View Pass / QR</span>
                    </button>

                    <button
                      onClick={() => setCancelModal(reg)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                      title="Cancel RSVP & Release Seat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Digital Ticket Modal */}
      {activeTicket && (
        <TicketModal
          registration={activeTicket}
          onClose={() => setActiveTicket(null)}
        />
      )}

      {/* Cancel RSVP Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-[#0d142d] border border-blue-900/60 rounded-3xl p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">Cancel Registration?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to cancel your RSVP for <strong className="text-white">{cancelModal.event?.title}</strong>? Your reserved seat will be immediately released back to other students.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCancelModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Keep Seat
              </button>
              <button
                onClick={() => handleCancelRsvp(cancelModal._id)}
                disabled={cancellingId === cancelModal._id}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                {cancellingId === cancelModal._id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Yes, Cancel RSVP</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
