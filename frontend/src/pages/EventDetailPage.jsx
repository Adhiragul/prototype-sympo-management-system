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
