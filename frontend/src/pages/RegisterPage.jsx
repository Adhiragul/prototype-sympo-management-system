import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, UserPlus, Lock, Mail, User, BookOpen, Hash, Phone, Loader2, AlertCircle } from 'lucide-react';

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

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Cybersecurity',
    collegeName: 'SRM Easwari Engineering College (Autonomous)',
    rollNo: '',
    year: 3,
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      navigate('/events');
    } else {
      setError(res.error);
    }
  };

  const handlePrefillStudent = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    setFormData({
      name: `Adhiragul S`,
      email: `adhiragul.${rand}@eec.srmrmp.edu.in`,
      password: 'Student@123',
      role: 'student',
      department: 'Cybersecurity',
      collegeName: 'SRM Easwari Engineering College (Autonomous)',
      rollNo: `310621205${rand.toString().slice(0, 3)}`,
      year: 3,
      phone: '+91 98401 98765'
    });
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-[#0b132b]/95 border border-blue-900/50 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 backdrop-blur-md">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 border border-blue-400/30 mb-1">
            <GraduationCap className="w-7 h-7 text-amber-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Create Portal Account
          </h1>
          <p className="text-xs text-blue-300">
            Easwari Engineering College (Autonomous) • SRM Group
          </p>
        </div>

        {/* 1-Click Prefill Helper */}
        <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px]">Testing as a new student?</span>
          <button
            type="button"
            onClick={handlePrefillStudent}
            className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-lg font-semibold transition-colors"
          >
            ⚡ Auto-Fill Sample Student
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
