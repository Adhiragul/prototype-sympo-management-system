import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { eventApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Image, 
  Tag, 
  Award, 
  Sparkles, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

const DEPARTMENTS = [
  'Cybersecurity',
  'Robotics and Automation',
  'Electrical and Electronics Engineering',
  'Computer Science & Engineering',
  'Information Technology',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biomedical Engineering',
  'Management Studies'
];

const CATEGORIES = [
  'Symposium',
  'Workshop',
  'Hackathon',
  'Paper Presentation',
  'Seminar',
  'Technical Contest'
];

const VENUES = [
  'TRP Auditorium',
  'EEC Mini Auditorium',
  'Hi-Tech Seminar Hall - Block 5',
  'Cyber Defense Lab (CS)',
  'Robotics & Automation Lab (RA)',
  'Power Electronics Lab (EEE)',
  'Smart Computing Center (CSE)',
  'IoT & Embedded Systems Lab (ECE)',
  'CAD/CAM Simulation Center (Mech)',
  'EEC Convention Ground',
  'Virtual (Google Meet / Zoom)'
];

const SAMPLE_BANNERS = [
  { label: 'Cybersecurity / CTF', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Robotics & Hardware', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Electrical / Smart Grid', url: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?w=1200&auto=format&fit=crop&q=80' },
  { label: 'AI & Data Science', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Coding / Hackathon', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80' }
];

export const CreateEditEventPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: user?.department || 'Cybersecurity',
    category: 'Symposium',
    clubName: 'CyberDef Club EEC',
    venue: 'TRP Auditorium',
    mode: 'In-Person',
    eventDate: '',
    registrationDeadline: '',
    totalSeats: 100,
    bannerUrl: SAMPLE_BANNERS[0].url,
    tags: 'Cybersecurity, Workshop, EEC',
    contactEmail: user?.email || 'events@eec.srmrmp.edu.in',
    contactPhone: user?.phone || '+91 98401 23456',
    certificateProvided: true
  });

  useEffect(() => {
    if (isEditMode) {
      const loadEvent = async () => {
        try {
          const res = await eventApi.getEventById(id);
          if (res.data.success) {
            const ev = res.data.event;
            setFormData({
              title: ev.title,
              description: ev.description,
              department: ev.department,
              category: ev.category,
              clubName: ev.clubName,
              venue: ev.venue,
              mode: ev.mode,
              eventDate: ev.eventDate ? new Date(ev.eventDate).toISOString().slice(0, 16) : '',
              registrationDeadline: ev.registrationDeadline ? new Date(ev.registrationDeadline).toISOString().slice(0, 16) : '',
              totalSeats: ev.totalSeats,
              bannerUrl: ev.bannerUrl,
              tags: Array.isArray(ev.tags) ? ev.tags.join(', ') : '',
              contactEmail: ev.contactEmail || '',
              contactPhone: ev.contactPhone || '',
              certificateProvided: ev.certificateProvided
            });
          }
        } catch (err) {
          setError('Failed to load event data for editing.');
        } finally {
          setLoading(false);
        }
      };
      loadEvent();
    } else {
      // Default dates for new event: 10 days ahead
      const tenDaysAhead = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
      const nineDaysAhead = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000);
      setFormData((prev) => ({
        ...prev,
        eventDate: tenDaysAhead.toISOString().slice(0, 16),
        registrationDeadline: nineDaysAhead.toISOString().slice(0, 16)
      }));
    }
  }, [id, isEditMode, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (isEditMode) {
        await eventApi.updateEvent(id, formData);
      } else {
        await eventApi.createEvent(formData);
      }
      navigate('/organizer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/organizer/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Organizer Dashboard</span>
      </Link>

      <div className="bg-[#0b132b]/90 border border-blue-900/50 p-6 sm:p-10 rounded-3xl shadow-2xl space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            SRM Easwari Engineering College
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] mt-1">
            {isEditMode ? 'Edit Event Details' : 'Publish New Symposium / Workshop'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Set capacity, department, venues, and registration deadlines for college attendees.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-200">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. CYBERBLITZ '26 - National Level Cyber Defense Symposium"
              className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Department & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">
                Host Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">
                Event Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Club Name & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">
                Organizing Club / Student Body *
              </label>
              <input
                type="text"
                name="clubName"
                required
                value={formData.clubName}
                onChange={handleChange}
                placeholder="e.g. CyberDef Club EEC / RoboTech Club / IEEE Student Branch"
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">
                Event Mode *
              </label>
              <select
                name="mode"
                value={formData.mode}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="In-Person">In-Person (Campus)</option>
                <option value="Virtual">Virtual (Online)</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {/* Venue & Total Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">
                Campus Venue *
              </label>
              <select
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {VENUES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">
                Total Seat Capacity *
              </label>
              <input
                type="number"
                name="totalSeats"
                min="1"
                required
                value={formData.totalSeats}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Event Date & Registration Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">
                Event Date & Time *
              </label>
              <input
                type="datetime-local"
                name="eventDate"
                required
                value={formData.eventDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">
                Registration Deadline *
              </label>
              <input
                type="datetime-local"
                name="registrationDeadline"
                required
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Event Description & Schedule *
            </label>
            <textarea
              name="description"
              rows="5"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide a comprehensive breakdown of the symposium rounds, workshops sessions, prerequisites, and resource persons..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* Banner URL & Stock Presets */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Banner Image URL
            </label>
            <input
              type="url"
              name="bannerUrl"
              value={formData.bannerUrl}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
            {/* Quick banner presets */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1">
              <span className="text-[10px] text-slate-400 shrink-0">Sample Images:</span>
              {SAMPLE_BANNERS.map((b, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, bannerUrl: b.url }))}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] text-slate-300 shrink-0 border border-slate-700"
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. Cybersecurity, ROS2, Smart Grid, AI, Hackathon"
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">
                Coordinator Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider">
                Coordinator Phone
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Certificate Toggle */}
          <div className="flex items-center gap-3 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              id="certCheck"
              name="certificateProvided"
              checked={formData.certificateProvided}
              onChange={handleChange}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-800"
            />
            <label htmlFor="certCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
              Provide Authorized Participation Certificate to Verified Attendees
            </label>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <Link
              to="/organizer/dashboard"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-700/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Event...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isEditMode ? 'Update Event Specifications' : 'Publish Symposium / Workshop'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
