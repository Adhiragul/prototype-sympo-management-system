import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventApi, regApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { EventCard } from '../components/EventCard';
import { FilterBar } from '../components/FilterBar';
import { TicketModal } from '../components/TicketModal';
import { Calendar, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  // Filter States initialized from URL params if present
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get('department') || 'All Departments');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [availableOnly, setAvailableOnly] = useState(searchParams.get('available') === 'true');
  const [sortBy, setSortBy] = useState('date-asc');

  const [events, setEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTicket, setActiveTicket] = useState(null);

  // Sync state changes with URL query parameters
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (selectedDepartment !== 'All Departments') params.department = selectedDepartment;
    if (selectedCategory !== 'All Categories') params.category = selectedCategory;
    if (availableOnly) params.available = 'true';
    if (sortBy !== 'date-asc') params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [search, selectedDepartment, selectedCategory, availableOnly, sortBy]);

  // Fetch events based on current filters
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {
          search,
          department: selectedDepartment,
          category: selectedCategory,
          availableOnly,
          sort: sortBy
        };

        const res = await eventApi.getEvents(params);
        if (res.data.success) {
          setEvents(res.data.events);
        }

        if (isAuthenticated) {
          const regRes = await regApi.getMyRegistrations();
          if (regRes.data.success) {
            setUserRegistrations(regRes.data.registrations);
          }
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchEvents, 200);
    return () => clearTimeout(debounceTimer);
  }, [search, selectedDepartment, selectedCategory, availableOnly, sortBy, isAuthenticated]);

  const handleRsvpSuccess = (newReg, eventId) => {
    setUserRegistrations((prev) => [...prev, newReg]);
    setEvents((prev) =>
      prev.map((e) => (e._id === eventId ? { ...e, seatsAvailable: e.seatsAvailable - 1 } : e))
    );
    setActiveTicket(newReg);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Heading */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          <span>SRM EEC Campus Events Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
          Symposiums, Workshops & Hackathons
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Browse upcoming academic and technical events hosted by college departments including Cybersecurity, Robotics & Automation, EEE, CSE, IT, and AI&DS.
        </p>
      </div>

      {/* Filter Bar Component */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        availableOnly={availableOnly}
        setAvailableOnly={setAvailableOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalFound={events.length}
      />

      {/* Events Grid or States */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading SRM EEC events catalog...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-3xl space-y-4 max-w-lg mx-auto my-8">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Events Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No events match your current filter criteria for "{selectedDepartment}" or category "{selectedCategory}".
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedDepartment('All Departments');
              setSelectedCategory('All Categories');
              setAvailableOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all"
          >
            Clear Filters & View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              userRegistrations={userRegistrations}
              onRsvpSuccess={handleRsvpSuccess}
            />
          ))}
        </div>
      )}

      {/* Digital Ticket Modal after RSVP */}
      {activeTicket && (
        <TicketModal
          registration={activeTicket}
          onClose={() => setActiveTicket(null)}
        />
      )}
    </div>
  );
};
