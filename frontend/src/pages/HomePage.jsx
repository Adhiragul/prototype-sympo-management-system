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
              </Link>
            ) : (
              <Link
                to="/events?department=Cybersecurity"
                className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm flex items-center gap-2 transition-all"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Cybersecurity Events</span>
              </Link>
            )}
          </div>

          {/* Quick Pillars */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
              <Shield className="w-6 h-6 text-emerald-400 mb-2" />
              <h4 className="text-sm font-bold text-white">Cybersecurity (CS)</h4>
              <p className="text-xs text-slate-400">CTFs, Defense labs & Keynotes</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
              <Cpu className="w-6 h-6 text-cyan-400 mb-2" />
              <h4 className="text-sm font-bold text-white">Robotics & Auto (RA)</h4>
              <p className="text-xs text-slate-400">ROS 2, Manipulators & SLAM</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
              <Zap className="w-6 h-6 text-amber-400 mb-2" />
              <h4 className="text-sm font-bold text-white">Electrical (EEE)</h4>
              <p className="text-xs text-slate-400">Smart Grids, EV & Power Electronics</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
              <FileSpreadsheet className="w-6 h-6 text-blue-400 mb-2" />
              <h4 className="text-sm font-bold text-white">Admin Export</h4>
              <p className="text-xs text-slate-400">1-Click CSV / JSON rosters</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Upcoming on Campus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              Featured Symposiums & Workshops
            </h2>
          </div>

          <Link
            to="/events"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>View All Events ({featuredEvents.length}+)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-900/40 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                userRegistrations={userRegistrations}
                onRsvpSuccess={handleRsvpSuccess}
              />
            ))}
          </div>
        )}
      </section>

      {/* College Club Spotlight & Venues */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0c173d] via-[#101e4a] to-[#0c173d] p-8 sm:p-12 rounded-3xl border border-blue-900/50 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                Organizers & Student Clubs
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                Publishing an Event for your Department?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Club presidents and faculty coordinators at SRM Easwari Engineering College can easily list symposiums, set maximum seating capacity, prevent overbooking, track live attendance check-ins, and export complete attendee reports to CSV and JSON formats.
              </p>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real-time seat reservation with atomic concurrency</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant downloadable CSV (RFC 4180 compliant) for Excel & Sheets</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Automated digital entry passes with verified QR codes</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/organizer/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-700/30"
                >
                  <span>Go to Organizer Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Venues Showcase */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <h5 className="font-bold text-white text-sm">TRP Auditorium</h5>
                <p className="text-slate-400">1200+ capacity for National Symposium keynotes</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <h5 className="font-bold text-white text-sm">Robotics & ROS Lab</h5>
                <p className="text-slate-400">Specialized hardware kits & simulation rigs</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <h5 className="font-bold text-white text-sm">Cyber Defense Lab</h5>
                <p className="text-slate-400">Isolated network sandboxes for live CTF events</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <h5 className="font-bold text-white text-sm">Hi-Tech Seminar Hall</h5>
                <p className="text-slate-400">Hybrid streaming setups & audio engineering</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Pass Modal */}
      {activeTicket && (
        <TicketModal
          registration={activeTicket}
          onClose={() => setActiveTicket(null)}
        />
      )}
    </div>
  );
};
