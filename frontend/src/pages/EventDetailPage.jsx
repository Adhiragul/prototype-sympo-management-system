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
