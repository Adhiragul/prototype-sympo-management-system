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
