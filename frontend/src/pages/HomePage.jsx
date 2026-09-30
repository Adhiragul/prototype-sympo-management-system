import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventApi, regApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { EventCard } from '../components/EventCard';
import { TicketModal } from '../components/TicketModal';
import { 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Shield, 
  Cpu, 
  Zap, 
  Users, 
  Ticket, 
  FileSpreadsheet, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export const HomePage = () => {
  const { isAuthenticated, isOrganizer } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsRes = await eventApi.getEvents({ sort: 'date-asc' });
        if (eventsRes.data.success) {
          setFeaturedEvents(eventsRes.data.events.slice(0, 4));
        }

        if (isAuthenticated) {
          const regRes = await regApi.getMyRegistrations();
          if (regRes.data.success) {
            setUserRegistrations(regRes.data.registrations);
          }
        }
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);
