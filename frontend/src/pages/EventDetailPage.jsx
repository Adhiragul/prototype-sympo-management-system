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
