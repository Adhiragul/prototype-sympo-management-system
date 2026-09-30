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
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-200">
          {/* Role selector */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Account Role *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, role: 'student' }))}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  formData.role === 'student'
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                Student Attendee
              </button>
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, role: 'organizer' }))}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  formData.role === 'organizer'
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                Club / Faculty Organizer
              </button>
            </div>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Adhiragul S"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                College Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="adhiragul@eec.srmrmp.edu.in"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Password (min 6 characters) *
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Department & Roll No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Department *
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

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Roll No / Register No
              </label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="310621205001"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* College Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Institution
            </label>
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-700/25 flex items-center justify-center gap-2 transition-all mt-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Register & Access Portal</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 font-bold hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
