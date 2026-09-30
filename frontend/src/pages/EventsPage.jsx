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
