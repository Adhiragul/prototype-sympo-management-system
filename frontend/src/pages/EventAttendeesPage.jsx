import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { regApi, exportApi } from '../api/client';
import { 
  ArrowLeft, 
  FileSpreadsheet, 
  FileCode, 
  Search, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Users, 
  Calendar, 
  Clock, 
  UserCheck 
} from 'lucide-react';

export const EventAttendeesPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingJson, setExportingJson] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const res = await regApi.getAttendees(id);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load attendees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [id]);

  const handleToggleCheckIn = async (registrationId) => {
    setTogglingId(registrationId);
    try {
      const res = await regApi.toggleCheckIn(registrationId);
      if (res.data.success) {
        setData((prev) => ({
          ...prev,
          attendees: prev.attendees.map((att) =>
            att._id === registrationId
              ? { ...att, attended: res.data.attended, attendedAt: res.data.attendedAt }
              : att
          )
        }));
      }
    } catch (err) {
      alert('Failed to update attendance.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleExportCsv = async () => {
    if (!data?.event) return;
    setExportingCsv(true);
    try {
      await exportApi.downloadCsv(id, data.event.title);
    } catch (err) {
      alert('Failed to export CSV file.');
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportJson = async () => {
    if (!data?.event) return;
    setExportingJson(true);
    try {
      await exportApi.downloadJson(id, data.event.title);
    } catch (err) {
      alert('Failed to export JSON file.');
    } finally {
      setExportingJson(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-xs text-slate-400">Loading attendee roster & check-in list...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
