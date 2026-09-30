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
        setRegistrations((prev) => prev.filter((r) => r._id !== registrationId));
        setCancelModal(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Profile Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-blue-900/40 p-6 sm:p-8 rounded-3xl border border-blue-800/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg border border-blue-400/30">
            <GraduationCap className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white font-['Outfit']">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-blue-300 mt-1">
              Roll No: <strong className="text-white">{user?.rollNo || 'N/A'}</strong> • {user?.department}
            </p>
            <p className="text-[11px] text-slate-400">
              {user?.collegeName || 'SRM Easwari Engineering College'}
            </p>
          </div>
        </div>

        <Link
          to="/events"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-700/30 shrink-0"
        >
          Browse More Events
        </Link>
      </div>

      {/* Registrations List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-['Outfit']">
            <Ticket className="w-5 h-5 text-amber-400" />
            <span>My Registered Symposiums & Workshops ({registrations.length})</span>
          </h2>
