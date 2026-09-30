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
