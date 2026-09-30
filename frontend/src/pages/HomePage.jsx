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

  const handleRsvpSuccess = (newReg, eventId) => {
    setUserRegistrations((prev) => [...prev, newReg]);
    setFeaturedEvents((prev) =>
      prev.map((e) => (e._id === eventId ? { ...e, seatsAvailable: e.seatsAvailable - 1 } : e))
    );
    setActiveTicket(newReg);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-blue-950/60 bg-gradient-to-b from-[#0a1435] to-[#070d1e]">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Institution Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/40 border border-blue-600/40 text-blue-300 text-xs font-semibold backdrop-blur-md shadow-lg shadow-blue-900/20">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <span>Easwari Engineering College (Autonomous) • SRM Group</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-['Outfit'] leading-tight">
            Campus Symposium & <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
              Workshop Portal
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
            Discover premier national-level symposiums, hands-on technical workshops, and hackathons hosted across SRM EEC departments. Reserve your seat with single-click RSVP.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/events"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {isOrganizer ? (
              <Link
                to="/organizer/create-event"
                className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm flex items-center gap-2 transition-all"
              >
                <span>Publish New Event</span>
