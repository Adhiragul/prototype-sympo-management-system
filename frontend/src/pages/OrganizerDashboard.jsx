import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventApi, statsApi, exportApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Calendar, 
  Users, 
  FileSpreadsheet, 
  FileCode, 
  Edit, 
  Trash2, 
  TrendingUp, 
  CheckCircle2, 
  Loader2, 
  ExternalLink,
  MapPin,
  Download
} from 'lucide-react';

export const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportingId, setExportingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [eventsRes, statsRes] = await Promise.all([
        eventApi.getEvents({}),
        statsApi.getDashboardStats()
      ]);

      if (eventsRes.data.success) {
        setEvents(eventsRes.data.events);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error('Failed to load organizer dashboard data:', err);
    } finally {
      setLoading(false);
