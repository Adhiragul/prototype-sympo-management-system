import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { regApi } from '../api/client';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert,
  Loader2
} from 'lucide-react';

export const EventCard = ({ event, onRsvpSuccess, userRegistrations = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [rsvpError, setRsvpError] = useState('');

  // Check if current user is already registered
  const isRegistered = userRegistrations.some(
    (reg) => (reg.event?._id || reg.event) === event._id && reg.status === 'confirmed'
  );

  const existingReg = userRegistrations.find(
    (reg) => (reg.event?._id || reg.event) === event._id && reg.status === 'confirmed'
  );

  // Seat calculations
  const total = event.totalSeats || 100;
  const available = event.seatsAvailable;
  const booked = total - available;
  const percentFilled = Math.min(100, Math.round((booked / total) * 100));
  const isSoldOut = available <= 0;

  // Single-Click RSVP Handler
  const handleSingleClickRsvp = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${event._id}` } });
      return;
    }

    if (isRegistered || isSoldOut) return;

    setSubmitting(true);
    setRsvpError('');

    try {
      const res = await regApi.rsvp(event._id);
      if (res.data.success) {
        // Trigger celebratory confetti effect!
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });

        if (onRsvpSuccess) {
          onRsvpSuccess(res.data.registration, event._id);
        }
      }
    } catch (err) {
      setRsvpError(err.response?.data?.message || 'RSVP failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Department color accent mapper
  const getDeptColor = (dept) => {
    switch (dept) {
      case 'Cybersecurity':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Robotics and Automation':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'Electrical and Electronics Engineering':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Computer Science & Engineering':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Artificial Intelligence & Data Science':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Information Technology':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/30';
    }
  };

  // Format date
  const eventDateObj = new Date(event.eventDate);
  const formattedDate = eventDateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const formattedTime = eventDateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full group bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all duration-300">
      {/* Banner & Category Overlay */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/90 text-white backdrop-blur-md shadow-md">
            {event.category}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${getDeptColor(event.department)}`}>
            {event.department === 'Robotics and Automation' ? 'Robotics & Auto' : event.department}
          </span>
        </div>

        {/* Club Name Pill */}
        <div className="absolute bottom-2 left-3">
          <span className="text-[11px] font-medium text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-700/50">
            {event.clubName}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link to={`/events/${event._id}`}>
            <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
              {event.title}
            </h3>
          </Link>
          <p className="text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Event Meta Details */}
        <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{formattedDate} • {formattedTime}</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span className="truncate max-w-[200px]">{event.venue}</span>
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {event.mode}
            </span>
          </div>
        </div>

        {/* Live Seat Availability Meter */}
        <div className="space-y-1.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 font-medium text-slate-400">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Seat Availability</span>
            </span>
            <span className={`font-semibold ${available <= 5 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
              {isSoldOut ? (
                <span className="text-rose-400 font-bold">Sold Out</span>
              ) : (
                <span>{available} of {total} left</span>
              )}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isSoldOut
                  ? 'bg-rose-500'
                  : available <= 10
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* Error message if RSVP failed */}
        {rsvpError && (
          <p className="text-xs text-rose-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>{rsvpError}</span>
          </p>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          {isRegistered ? (
            <Link
              to="/my-registrations"
              className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Registered (Ticket: {existingReg?.ticketId || 'Active'})</span>
            </Link>
          ) : (
            <button
              onClick={handleSingleClickRsvp}
              disabled={submitting || isSoldOut}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                isSoldOut
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-700/25 active:scale-[0.98]'
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Reserving Seat...</span>
                </>
              ) : isSoldOut ? (
                <span>Housefull / Sold Out</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Single-Click RSVP</span>
                </>
              )}
            </button>
          )}

          <Link
            to={`/events/${event._id}`}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
            title="View full details"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
