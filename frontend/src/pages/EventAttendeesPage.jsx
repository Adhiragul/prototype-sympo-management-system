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
