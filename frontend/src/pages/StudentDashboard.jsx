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
