import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventApi, regApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { TicketModal } from '../components/TicketModal';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Mail, 
  Phone, 
  Sparkles, 
  CheckCircle, 
  ArrowLeft, 
  Award, 
  Loader2, 
  ShieldAlert,
  AlertCircle
} from 'lucide-react';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [registration, setRegistration] = useState(null);
  const [showTicket, setShowTicket] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const res = await eventApi.getEventById(id);
        if (res.data.success) {
          setEvent(res.data.event);
        }

        if (isAuthenticated) {
          const statusRes = await regApi.checkStatus(id);
          if (statusRes.data.success && statusRes.data.isRegistered) {
            setRegistration(statusRes.data.registration);
          }
        }
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, isAuthenticated]);

  const handleRsvp = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await regApi.rsvp(id);
      if (res.data.success) {
        setRegistration(res.data.registration);
        setEvent((prev) => ({
          ...prev,
          seatsAvailable: prev.seatsAvailable - 1
        }));

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setShowTicket(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'RSVP failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">Loading symposium specifications...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Event Not Found</h2>
        <p className="text-xs text-slate-400">The requested event could not be found or has been removed.</p>
        <Link to="/events" className="inline-block px-4 py-2 bg-blue-600 rounded-xl text-xs font-semibold text-white">
          Back to Events Catalog
        </Link>
      </div>
    );
  }

  const isSoldOut = event.seatsAvailable <= 0;
  const isRegistered = !!registration;
  const eventDateObj = new Date(event.eventDate);
  const formattedDate = eventDateObj.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const formattedTime = eventDateObj.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const deadlineObj = new Date(event.registrationDeadline);
  const formattedDeadline = deadlineObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const total = event.totalSeats || 100;
  const booked = total - event.seatsAvailable;
  const percentFilled = Math.min(100, Math.round((booked / total) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </Link>

      {/* Hero Banner Header */}
      <div className="relative rounded-3xl overflow-hidden border border-blue-900/40 bg-slate-950 shadow-2xl">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-64 sm:h-80 object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1128] via-[#0a1128]/70 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-md">
              {event.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-900/80 text-indigo-200 border border-indigo-500/40 backdrop-blur-md">
              Dept: {event.department}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50 backdrop-blur-md">
              {event.clubName}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] leading-tight">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Main Grid: Details Left, RSVP & Action Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Description & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-[#0b132b]/80 border border-blue-900/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white font-['Outfit']">Event Overview & Agenda</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {/* Certificate tag */}
            {event.certificateProvided && (
              <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  <strong>Authorized Certificate of Participation:</strong> Provided to all registered attendees upon verification by the SRM EEC department head.
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="bg-[#0b132b]/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-xs text-slate-400 font-semibold mr-1">Topics:</span>
              {event.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Organizer Contact Info */}
          <div className="bg-[#0b132b]/60 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Host & Contact Coordination
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Organized by: <strong>{event.clubName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>{event.contactEmail || 'events@eec.srmrmp.edu.in'}</span>
              </div>
              {event.contactPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-400" />
                  <span>{event.contactPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Seat Meter & RSVP Action Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-[#0c1638] to-[#0a1128] border border-blue-800/50 rounded-3xl p-6 shadow-2xl space-y-6 sticky top-24">
            {/* Live Seat Availability */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Live Seat Capacity
                </span>
                <span className={`font-bold ${event.seatsAvailable <= 5 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {isSoldOut ? 'Sold Out' : `${event.seatsAvailable} of ${event.totalSeats} seats left`}
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isSoldOut
                      ? 'bg-rose-500'
